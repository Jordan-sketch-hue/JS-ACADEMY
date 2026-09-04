'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Headphones, ChevronDown, Loader2, RotateCcw, Volume2 } from 'lucide-react'

const VOICES = [
  { id: 'Dan',      name: 'Dan',      desc: 'Deep · Male' },
  { id: 'Will',     name: 'Will',     desc: 'Warm · Male' },
  { id: 'Scarlett', name: 'Scarlett', desc: 'Clear · Female' },
  { id: 'Liv',      name: 'Liv',      desc: 'Natural · Female' },
  { id: 'Amy',      name: 'Amy',      desc: 'Bright · Female' },
]

const SPEEDS = [0.75, 1, 1.25, 1.5] as const
const VOICE_KEY = 'academy_audiobook_voice'
const DEFAULT_VOICE = 'Dan'

function fmt(secs: number) {
  if (!isFinite(secs) || secs < 0) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props {
  text: string
  courseTitle?: string
  courseId?: string
}

export default function AudiobookPlayer({ text, courseTitle }: Props) {
  const [voiceId, setVoiceId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_VOICE
    const saved = localStorage.getItem(VOICE_KEY)
    return VOICES.some(v => v.id === saved) ? saved! : DEFAULT_VOICE
  })
  const [speed, setSpeed]   = useState<number>(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed]   = useState(0)
  const [showVoices, setShowVoices] = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')

  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const blobUrlsRef = useRef<string[]>([])
  const abortRef    = useRef<AbortController | null>(null)
  const totalRef    = useRef(1)
  const chunkRef    = useRef(0)

  useEffect(() => { localStorage.setItem(VOICE_KEY, voiceId) }, [voiceId])

  const revokeBlobUrls = useCallback(() => {
    blobUrlsRef.current.forEach(u => URL.revokeObjectURL(u))
    blobUrlsRef.current = []
  }, [])

  const cleanup = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    revokeBlobUrls()
    setProgress(0)
    setElapsed(0)
  }, [revokeBlobUrls])

  useEffect(() => () => { cleanup() }, [cleanup])

  // Reset when voice changes
  useEffect(() => {
    if (status !== 'idle') { cleanup(); setStatus('idle'); setErrorMsg('') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceId])

  async function fetchChunk(idx: number, signal: AbortSignal): Promise<{ blobUrl: string; total: number }> {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId, courseTitle, chunk: idx }),
      signal,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Audio generation failed' }))
      throw new Error(err.error ?? 'Audio generation failed')
    }

    const total = parseInt(res.headers.get('X-Total') ?? '1', 10)
    const bytes = await res.arrayBuffer()
    const blob  = new Blob([bytes], { type: 'audio/mpeg' })
    const url   = URL.createObjectURL(blob)
    blobUrlsRef.current.push(url)
    return { blobUrl: url, total }
  }

  // audio is created synchronously in the gesture context (see startPlayback),
  // so iOS allows .play() even after the async fetch completes.
  function playBlobUrl(audio: HTMLAudioElement, url: string, idx: number, signal: AbortSignal) {
    audio.src = url
    audio.playbackRate = speed

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return
      const base     = idx / totalRef.current
      const chunkPct = (audio.currentTime / audio.duration) / totalRef.current
      setProgress(Math.round((base + chunkPct) * 100))
      setElapsed(prev => {
        const secs = audio.currentTime + (idx / totalRef.current) * audio.duration
        return isFinite(secs) ? secs : prev
      })
    })

    audio.addEventListener('ended', async () => {
      const next = idx + 1
      if (next >= totalRef.current || signal.aborted) {
        setStatus('idle'); setProgress(100); return
      }
      chunkRef.current = next
      try {
        const { blobUrl } = await fetchChunk(next, signal)
        if (!signal.aborted) playBlobUrl(audio, blobUrl, next, signal)
      } catch {
        if (!signal.aborted) { setStatus('error'); setErrorMsg('Playback interrupted') }
      }
    })

    audio.play()
      .then(() => setStatus('playing'))
      .catch(() => {
        if (!signal.aborted) { setStatus('error'); setErrorMsg('Playback blocked — tap play again') }
      })
  }

  async function startPlayback() {
    cleanup()
    setStatus('loading')
    setErrorMsg('')
    totalRef.current = 1
    chunkRef.current = 0

    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Create Audio element HERE — synchronously within the tap gesture —
    // so iOS Safari grants playback permission when .play() fires later.
    const audio = new Audio()
    audioRef.current = audio

    try {
      const { blobUrl, total } = await fetchChunk(0, ctrl.signal)
      if (ctrl.signal.aborted) return
      totalRef.current = total
      playBlobUrl(audio, blobUrl, 0, ctrl.signal)
    } catch (e: unknown) {
      if ((e as { name?: string }).name === 'AbortError') return
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Could not load audio')
    }
  }

  async function handlePlay() {
    if (status === 'playing') {
      audioRef.current?.pause()
      setStatus('paused')
      return
    }
    if (status === 'paused' && audioRef.current) {
      audioRef.current.play()
      setStatus('playing')
      return
    }
    await startPlayback()
  }

  function handleReset() { cleanup(); setStatus('idle'); setErrorMsg('') }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * audio.duration
    setProgress(Math.round(pct * 100))
  }

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  const isLoading = status === 'loading'
  const isPlaying = status === 'playing'
  const activeVoice = VOICES.find(v => v.id === voiceId) ?? VOICES[0]

  return (
    <>
      <div className="border border-neutral-150 rounded-xl bg-neutral-50 p-3 mb-5 select-none">
        <div className="flex items-center gap-2.5">

          {/* Label */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-neutral-400 flex-shrink-0">
            <Volume2 size={11} />
            <span className="tracking-wide uppercase">Listen</span>
          </div>

          {/* Play/Pause */}
          <button
            onClick={handlePlay}
            className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0 hover:bg-neutral-800 active:scale-95 transition-all"
          >
            {isLoading
              ? <Loader2 size={13} className="animate-spin" />
              : isPlaying
                ? <Pause size={13} />
                : <Play size={13} className="ml-px" />}
          </button>

          {/* Progress + waveform */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="h-1.5 bg-neutral-200 rounded-full cursor-pointer" onClick={handleSeek}>
              <div
                className="h-full bg-ink rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-3 pl-px">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[2px] bg-ink rounded-full opacity-60"
                    style={{
                      height: `${30 + Math.sin(i * 0.8) * 50}%`,
                      animation: `audioPulse ${0.5 + (i % 3) * 0.15}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Time */}
          <div className="text-[10px] text-neutral-400 flex-shrink-0 font-mono w-10 text-right">
            {(isPlaying || status === 'paused') ? fmt(elapsed) : null}
          </div>

          {/* Reset */}
          {status !== 'idle' && (
            <button onClick={handleReset} className="text-neutral-300 hover:text-neutral-500 flex-shrink-0" title="Reset">
              <RotateCcw size={12} />
            </button>
          )}

          {/* Speed */}
          <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0">
            {SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${speed === s ? 'bg-ink text-white font-medium' : 'text-neutral-400 hover:text-neutral-700'}`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Voice picker */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowVoices(p => !p)}
              className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-ink border border-neutral-200 rounded-lg px-2 py-1.5 bg-white transition-colors"
            >
              <Headphones size={10} />
              <span className="hidden sm:inline max-w-[80px] truncate">{activeVoice.name}</span>
              <ChevronDown size={9} className={`transition-transform ${showVoices ? 'rotate-180' : ''}`} />
            </button>

            {showVoices && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowVoices(false)} />
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 w-52 overflow-hidden">

                  <div className="px-3 py-2 border-b border-neutral-100">
                    <div className="text-[9px] tracking-[0.15em] uppercase text-neutral-400">Neural Voices</div>
                  </div>

                  {VOICES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setVoiceId(v.id); setShowVoices(false) }}
                      className={`w-full text-left px-3 py-2.5 text-[11px] hover:bg-neutral-50 transition-colors ${voiceId === v.id ? 'text-ink' : 'text-neutral-600'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={voiceId === v.id ? 'font-medium' : ''}>{v.name}</span>
                        {voiceId === v.id && <div className="w-1.5 h-1.5 rounded-full bg-ink" />}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{v.desc}</div>
                    </button>
                  ))}

                  {/* Mobile speed */}
                  <div className="sm:hidden border-t border-neutral-100 px-3 py-2.5">
                    <div className="text-[9px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Speed</div>
                    <div className="flex gap-1">
                      {SPEEDS.map(s => (
                        <button
                          key={s}
                          onClick={() => { setSpeed(s); setShowVoices(false) }}
                          className={`flex-1 text-[10px] py-1 rounded transition-colors ${speed === s ? 'bg-ink text-white' : 'border border-neutral-200 text-neutral-500'}`}
                        >
                          {s}×
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {status === 'error' && (
          <div className="mt-2 flex items-center justify-between text-[10px] text-red-500">
            <span>{errorMsg}</span>
            <button onClick={handleReset} className="underline ml-2 flex-shrink-0">Reset</button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes audioPulse {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}
