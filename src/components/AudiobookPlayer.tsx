'use client'
import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Play, Pause, Headphones, ChevronDown, Loader2, RotateCcw, Volume2 } from 'lucide-react'
import { getAudioPosition, saveAudioPosition, clearAudioPosition } from '@/lib/audio-progress'

const VOICES = [
  { id: 'Marcus', name: 'Marcus', desc: 'Deep · Commanding' },
  { id: 'Tony',   name: 'Tony',   desc: 'Smooth · Male' },
  { id: 'Aria',   name: 'Aria',   desc: 'Expressive · Female' },
  { id: 'Nova',   name: 'Nova',   desc: 'Warm · Female' },
  { id: 'Jason',  name: 'Jason',  desc: 'Rich · Male' },
]

const SPEEDS = [0.75, 1, 1.25, 1.5] as const
const VOICE_KEY = 'academy_audiobook_voice'
const DEFAULT_VOICE = 'Marcus'

function fmt(secs: number) {
  if (!isFinite(secs) || secs < 0) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface KeyTerm { term: string; definition: string }

export interface PlayingRange { start: number; end: number }

export interface AudiobookPlayerHandle {
  /** Restart narration from a specific character offset in `text` — used for click-to-read-from-here. */
  seekToOffset: (offset: number) => void
}

interface Props {
  text: string
  courseTitle?: string
  /** Spoken right after the welcome line on the first chunk — what the listener should walk away able to do. */
  objective?: string
  courseId?: string
  keyTerms?: KeyTerm[]
  /** Fires with the [start,end) character range of the chunk currently narrating (absolute offsets into `text`), or null when idle. */
  onRangeChange?: (range: PlayingRange | null) => void
}

interface StartOpts { atOffset?: number; atChunk?: number; atTime?: number }

function AudiobookPlayer(
  { text, courseTitle, objective, courseId, keyTerms, onRangeChange }: Props,
  ref: React.Ref<AudiobookPlayerHandle>
) {
  // Always start at DEFAULT_VOICE so server and client render identical markup
  // on first paint; the saved preference (if any) is applied after mount,
  // client-only. Reading localStorage synchronously in the initializer here
  // previously caused a hydration mismatch for anyone whose saved voice
  // wasn't the default — the picker button's label text differed between
  // the server-rendered HTML and the client's first render.
  const [voiceId, setVoiceIdState] = useState<string>(DEFAULT_VOICE)

  useEffect(() => {
    const saved = localStorage.getItem(VOICE_KEY)
    if (saved && VOICES.some(v => v.id === saved)) setVoiceIdState(saved)
  }, [])

  function setVoiceId(id: string) {
    setVoiceIdState(id)
    localStorage.setItem(VOICE_KEY, id)
  }
  const [speed, setSpeed]   = useState<number>(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed]   = useState(0)
  const [showVoices, setShowVoices] = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')
  const [resumeAt, setResumeAt]     = useState<number | null>(null)

  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const blobUrlsRef = useRef<string[]>([])
  const abortRef    = useRef<AbortController | null>(null)
  const totalRef    = useRef(1)
  const chunkRef    = useRef(0)
  const runBaseRef  = useRef(0)      // absolute offset into `text` where the current playback run started
  const lastSaveRef = useRef(0)
  const lastRangeSaveRef = useRef(0)
  // Tracks the timeupdate handler for the currently-playing chunk so we can
  // remove it before attaching the next chunk's handler. Without this, each
  // chunk adds a new listener that is never removed: by chunk N there are N
  // stale listeners all firing simultaneously, and the chunk-0 handler (which
  // closed over chunkStart=0) keeps emitting onRangeChange({ start:0 }),
  // causing the scroll to jump back to the beginning of the page.
  const timeUpdateHandlerRef = useRef<(() => void) | null>(null)

  // Pick up any saved position for this course whenever we land on a new module.
  useEffect(() => {
    const saved = courseId ? getAudioPosition(courseId) : null
    setResumeAt(saved && saved.elapsed > 3 ? saved.elapsed : null)
  }, [courseId, text])

  const revokeBlobUrls = useCallback(() => {
    blobUrlsRef.current.forEach(u => URL.revokeObjectURL(u))
    blobUrlsRef.current = []
  }, [])

  const cleanup = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (audioRef.current) {
      if (timeUpdateHandlerRef.current) {
        audioRef.current.removeEventListener('timeupdate', timeUpdateHandlerRef.current)
        timeUpdateHandlerRef.current = null
      }
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    revokeBlobUrls()
    setProgress(0)
    setElapsed(0)
    onRangeChange?.(null)
  }, [revokeBlobUrls, onRangeChange])

  useEffect(() => () => { cleanup() }, [cleanup])

  // Reset whenever the voice changes, or — critically — whenever the module itself
  // changes. Without this, navigating to a new course mid-playback kept the old
  // fetch/playback chain alive, which kept requesting chunks against the NEW text
  // using chunk boundaries computed for the OLD text: narration would jump to an
  // unrelated point instead of stopping. Content identity (text + courseId) is the
  // single source of truth for "is this still the same listening session."
  useEffect(() => {
    if (status !== 'idle') { cleanup(); setStatus('idle'); setErrorMsg('') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceId, text, courseId])

  async function fetchChunk(idx: number, sourceText: string, signal: AbortSignal) {
    // Only inject the "Welcome to / objective" intro on the genuine first chunk
    // of a full play-from-start session. When the user seeks to a mid-point,
    // runBaseRef.current > 0, so we omit courseTitle/objective — the API's
    // existing `if (isFirstChunk && courseTitle)` guard then skips the intro,
    // preventing TTS from sounding like it has "restarted from the beginning"
    // every time a word is clicked.
    const isGenuineStart = runBaseRef.current === 0 && idx === 0
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sourceText,
        voiceId,
        courseTitle: isGenuineStart ? courseTitle : undefined,
        objective:   isGenuineStart ? objective   : undefined,
        chunk: idx,
        keyTerms: keyTerms ?? [],
      }),
      signal,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Audio generation failed' }))
      throw new Error(err.error ?? 'Audio generation failed')
    }

    const total      = parseInt(res.headers.get('X-Total') ?? '1', 10)
    const chunkStart = parseInt(res.headers.get('X-Chunk-Start') ?? '0', 10)
    const chunkEnd   = parseInt(res.headers.get('X-Chunk-End') ?? String(sourceText.length), 10)
    const bytes = await res.arrayBuffer()
    const blob  = new Blob([bytes], { type: 'audio/mpeg' })
    const url   = URL.createObjectURL(blob)
    blobUrlsRef.current.push(url)
    return { blobUrl: url, total, chunkStart, chunkEnd }
  }

  // audio is created synchronously in the gesture context (see startPlayback),
  // so iOS allows .play() even after the async fetch completes.
  function playBlobUrl(
    audio: HTMLAudioElement, url: string, idx: number, sourceText: string, signal: AbortSignal,
    chunkStart: number, chunkEnd: number, seekTime?: number
  ) {
    audio.src = url
    audio.playbackRate = speed

    if (seekTime) {
      audio.addEventListener('loadedmetadata', () => { audio.currentTime = seekTime }, { once: true })
    }

    onRangeChange?.({ start: runBaseRef.current + chunkStart, end: runBaseRef.current + chunkStart + 1 })

    // Remove the previous chunk's timeupdate listener before attaching the new
    // one. Without this, every chunk adds a persistent listener that is never
    // removed. By chunk N there would be N stale listeners all firing on the
    // same audio element; the chunk-0 closure (chunkStart=0) would keep
    // emitting onRangeChange({ start:0 }), making the scroll jump back to the
    // top of the page as if narration had reset.
    if (timeUpdateHandlerRef.current) {
      audio.removeEventListener('timeupdate', timeUpdateHandlerRef.current)
    }

    // Azure's REST TTS returns one audio blob per chunk with no word-level
    // timestamps, so we interpolate a position through the chunk's character
    // range based on playback fraction — close enough to track the current
    // paragraph without pretending to karaoke-level precision.
    function onTimeUpdate() {
      if (!audio.duration) return
      const base     = idx / totalRef.current
      const chunkPct = (audio.currentTime / audio.duration) / totalRef.current
      setProgress(Math.round((base + chunkPct) * 100))
      const secs = audio.currentTime + (idx / totalRef.current) * audio.duration
      setElapsed(prev => {
        const next = isFinite(secs) ? secs : prev
        const now = Date.now()
        if (courseId && now - lastSaveRef.current > 2000) {
          lastSaveRef.current = now
          saveAudioPosition(courseId, {
            baseOffset: runBaseRef.current, chunkIdx: idx, chunkTime: audio.currentTime, elapsed: next, voiceId,
          })
        }
        return next
      })

      const now = Date.now()
      if (now - lastRangeSaveRef.current > 700) {
        lastRangeSaveRef.current = now
        const frac = Math.min(1, audio.currentTime / audio.duration)
        const est = chunkStart + Math.round(frac * Math.max(1, chunkEnd - chunkStart))
        onRangeChange?.({ start: runBaseRef.current + est, end: runBaseRef.current + est + 1 })
      }
    }

    timeUpdateHandlerRef.current = onTimeUpdate
    audio.addEventListener('timeupdate', onTimeUpdate)

    // { once: true } ensures this handler removes itself after firing, so the
    // next chunk's ended listener doesn't stack on top of this one.
    audio.addEventListener('ended', async () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      if (timeUpdateHandlerRef.current === onTimeUpdate) timeUpdateHandlerRef.current = null
      const next = idx + 1
      if (next >= totalRef.current || signal.aborted) {
        setStatus('idle'); setProgress(100)
        onRangeChange?.(null)
        if (courseId) clearAudioPosition(courseId)
        setResumeAt(null)
        return
      }
      chunkRef.current = next
      try {
        const { blobUrl, chunkStart: cs, chunkEnd: ce } = await fetchChunk(next, sourceText, signal)
        if (!signal.aborted) playBlobUrl(audio, blobUrl, next, sourceText, signal, cs, ce)
      } catch {
        if (!signal.aborted) { setStatus('error'); setErrorMsg('Playback interrupted') }
      }
    }, { once: true })

    audio.play()
      .then(() => setStatus('playing'))
      .catch(() => {
        if (!signal.aborted) { setStatus('error'); setErrorMsg('Playback blocked — tap play again') }
      })
  }

  async function startPlayback(opts?: StartOpts) {
    cleanup()
    setStatus('loading')
    setErrorMsg('')
    setResumeAt(null)

    const baseOffset = opts?.atOffset ?? 0
    const sourceText = baseOffset > 0 ? text.slice(baseOffset) : text
    runBaseRef.current = baseOffset
    totalRef.current = 1
    const startChunk = opts?.atChunk ?? 0
    chunkRef.current = startChunk

    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Create Audio element HERE — synchronously within the tap gesture —
    // so iOS Safari grants playback permission when .play() fires later.
    const audio = new Audio()
    audioRef.current = audio

    try {
      const { blobUrl, total, chunkStart, chunkEnd } = await fetchChunk(startChunk, sourceText, ctrl.signal)
      if (ctrl.signal.aborted) return
      totalRef.current = total
      playBlobUrl(audio, blobUrl, startChunk, sourceText, ctrl.signal, chunkStart, chunkEnd, opts?.atTime)
    } catch (e: unknown) {
      if ((e as { name?: string }).name === 'AbortError') return
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Could not load audio')
    }
  }

  useImperativeHandle(ref, () => ({
    seekToOffset(offset: number) {
      startPlayback({ atOffset: Math.max(0, Math.min(offset, text.length - 1)) })
    },
  }))

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

  function handleResume() {
    if (!courseId) return
    const saved = getAudioPosition(courseId)
    if (!saved) return
    startPlayback({ atOffset: saved.baseOffset, atChunk: saved.chunkIdx, atTime: saved.chunkTime })
  }

  function handleReset() {
    cleanup()
    setStatus('idle')
    setErrorMsg('')
    if (courseId) clearAudioPosition(courseId)
    setResumeAt(null)
  }

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

        {status === 'idle' && resumeAt !== null && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-400">
            <span>Left off at {fmt(resumeAt)}.</span>
            <button onClick={handleResume} className="text-gold hover:underline font-medium">Resume listening</button>
          </div>
        )}

        {status === 'idle' && resumeAt === null && (
          <div className="mt-2 text-[10px] text-neutral-300">
            Tap any word in the text below to start reading from there.
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

export default forwardRef(AudiobookPlayer)
