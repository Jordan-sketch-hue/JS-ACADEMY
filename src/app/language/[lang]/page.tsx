'use client'
import { use, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { getLanguage, LEVEL_ORDER, VOICES, type LangCode, type ProfLevel, type VocabItem, type DialogueLine } from '@/lib/language-data'
import { ChevronLeft, Volume2, Loader2, Check, X, ChevronDown, ChevronUp, BookOpen, GraduationCap, Dumbbell, Keyboard, Mic, MessageSquare, ChevronRight } from 'lucide-react'

type Tab = 'vocab' | 'grammar' | 'dialogue' | 'drill' | 'chars' | 'quiz'

function speak(text: string, voice: string, onStart: () => void, onEnd: () => void) {
  onStart()
  fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  })
    .then(r => { if (!r.ok) throw new Error(); return r.blob() })
    .then(blob => {
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => { onEnd(); URL.revokeObjectURL(url) }
      audio.onerror = () => onEnd()
      audio.play()
    })
    .catch(() => onEnd())
}

function SpeakBtn({ text, voice, size = 'md' }: { text: string; voice: string; size?: 'sm' | 'md' }) {
  const [loading, setLoading] = useState(false)
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
  const icon = size === 'sm' ? 11 : 14
  return (
    <button
      onClick={() => speak(text, voice, () => setLoading(true), () => setLoading(false))}
      disabled={loading}
      className={`flex-shrink-0 ${dim} rounded-full bg-[#fde8ef] hover:bg-[#f9c6d8] flex items-center justify-center transition-colors disabled:opacity-50`}
    >
      {loading
        ? <Loader2 size={icon} className="text-[#d4376e] animate-spin" />
        : <Volume2 size={icon} className="text-[#d4376e]" />}
    </button>
  )
}

function VocabCard({ item, voice }: { item: VocabItem; voice: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[20px] font-bold text-[#0a0a0a]">{item.word}</span>
              {item.romanization && <span className="text-[12px] text-neutral-400 font-mono">{item.romanization}</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] font-semibold text-[#d4376e]">{item.translation}</span>
              <span className="text-neutral-300 text-[10px]">·</span>
              <span className="text-[10px] text-neutral-400 italic">{item.partOfSpeech}</span>
            </div>
          </div>
          <SpeakBtn text={item.word} voice={voice} />
        </div>

        {/* Scenario */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-3 mb-3">
          <div className="text-[9px] font-bold text-neutral-400 tracking-[0.15em] uppercase mb-1">Real scenario</div>
          <p className="text-[12px] text-neutral-700 leading-relaxed">{item.scenario}</p>
        </div>

        {/* Example toggle */}
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          Example sentence
        </button>
        {open && (
          <div className="mt-2 space-y-1.5">
            <div className="flex items-start gap-2">
              <SpeakBtn text={item.exampleNative} voice={voice} size="sm" />
              <p className="text-[13px] font-medium text-[#0a0a0a] leading-snug">{item.exampleNative}</p>
            </div>
            <p className="text-[11px] text-neutral-400 leading-snug ml-8">{item.exampleEnglish}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DrillCard({ sentence, english, voice }: { sentence: string; english: string; voice: string }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const norm = (s: string) => s.trim().toLowerCase().replace(/[.,!?。！？]/g, '')
  const check = () => setResult(norm(input) === norm(sentence) ? 'correct' : 'wrong')
  const reset = () => { setInput(''); setResult(null) }

  return (
    <div className={`bg-white border rounded-xl p-4 transition-colors ${result === 'correct' ? 'border-green-300' : result === 'wrong' ? 'border-red-300' : 'border-neutral-200'}`}>
      <p className="text-[12px] text-neutral-500 mb-2">{english}</p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !result && check()}
          disabled={!!result}
          placeholder="Type in the native language…"
          className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-[#0a0a0a] outline-none focus:border-[#d4376e] disabled:bg-neutral-50"
        />
        <SpeakBtn text={sentence} voice={voice} />
      </div>
      <div className="mt-2 flex items-center gap-2 min-h-[24px]">
        {!result
          ? <button onClick={check} className="text-[11px] bg-[#0a0a0a] text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">Check</button>
          : <>
              <span className={`flex items-center gap-1 text-[11px] font-semibold ${result === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                {result === 'correct' ? <Check size={12} /> : <X size={12} />}
                {result === 'correct' ? 'Correct!' : sentence}
              </span>
              <button onClick={reset} className="ml-auto text-[10px] text-neutral-400 hover:text-neutral-600">Try again</button>
            </>
        }
      </div>
    </div>
  )
}

function DialogueSection({
  lines, voice, title, context,
}: { lines: DialogueLine[]; voice: string; title?: string; context?: string }) {
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null)
  const [playingAll, setPlayingAll] = useState(false)

  const speakLine = (idx: number) => new Promise<void>(resolve => {
    const line = lines[idx]
    setLoadingIdx(idx)
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: line.native, voice }),
    })
      .then(r => r.blob())
      .then(blob => {
        setLoadingIdx(null)
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onended = () => { URL.revokeObjectURL(url); resolve() }
        audio.onerror = () => resolve()
        audio.play()
      })
      .catch(() => { setLoadingIdx(null); resolve() })
  })

  const playAll = async () => {
    setPlayingAll(true)
    for (let i = 0; i < lines.length; i++) {
      await speakLine(i)
    }
    setPlayingAll(false)
  }

  return (
    <div>
      {title && (
        <div className="mb-4">
          <div className="text-[13px] font-bold text-[#0a0a0a]">{title}</div>
          {context && <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{context}</p>}
        </div>
      )}

      <div className="space-y-2 mb-5">
        {lines.map((line, i) => {
          const isYou = line.role === 'you'
          return (
            <div key={i} className={`rounded-xl border p-3.5 ${isYou ? 'bg-[#fdf5f0] border-[#f0c090] ml-4' : 'bg-white border-neutral-200 mr-4'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-bold tracking-[0.18em] uppercase ${isYou ? 'text-[#b85c00]' : 'text-neutral-400'}`}>
                  {isYou ? 'You' : 'Executive'}
                </span>
                <button
                  onClick={() => speakLine(i)}
                  disabled={loadingIdx !== null || playingAll}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 ${isYou ? 'bg-[#f0c090] hover:bg-[#e8a860]' : 'bg-[#fde8ef] hover:bg-[#f9c6d8]'}`}
                >
                  {loadingIdx === i
                    ? <Loader2 size={10} className={`animate-spin ${isYou ? 'text-[#b85c00]' : 'text-[#d4376e]'}`} />
                    : <Volume2 size={10} className={isYou ? 'text-[#b85c00]' : 'text-[#d4376e]'} />}
                </button>
              </div>
              <p className="text-[14px] font-medium text-[#0a0a0a] leading-snug mb-1">{line.native}</p>
              <p className="text-[11px] text-neutral-400 italic leading-snug">{line.english}</p>
            </div>
          )
        })}
      </div>

      <button
        onClick={playAll}
        disabled={playingAll || loadingIdx !== null}
        className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] text-white py-3 rounded-xl text-[12px] font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {playingAll
          ? <><Loader2 size={13} className="animate-spin" /> Playing…</>
          : <><Volume2 size={13} /> Play Full Dialogue</>}
      </button>
    </div>
  )
}

function QuizSection({ vocab, voice, onAdvance }: { vocab: VocabItem[]; voice: string; onAdvance?: () => void }) {
  const pool = vocab.slice(0, Math.min(vocab.length, 8))
  const [questions] = useState(() => pool.map((item, i) => {
    const wrong = pool.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3)
    const opts = [...wrong, item].sort(() => Math.random() - 0.5)
    return { item, opts, correctIdx: opts.indexOf(item) }
  }))
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (pool.length < 4) return <p className="text-[12px] text-neutral-500 p-4">Not enough vocab at this level for a quiz.</p>

  const q = questions[idx]

  const pick = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    if (i === q.correctIdx) setScore(s => s + 1)
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true)
      else { setIdx(x => x + 1); setChosen(null) }
    }, 1000)
  }

  const passed = score >= questions.length * 0.8

  if (done) return (
    <div className="text-center py-8">
      <div className="text-5xl mb-3">{passed ? '🔥' : score >= questions.length * 0.5 ? '💪' : '📚'}</div>
      <div className="text-[26px] font-bold text-[#0a0a0a]">{score}/{questions.length}</div>
      <p className="text-[12px] text-neutral-500 mt-1 mb-5">
        {passed ? 'Excellent — you are ready for the next level.' : 'Keep drilling. Repetition is mastery.'}
      </p>
      <div className="flex flex-col gap-2 max-w-[240px] mx-auto">
        {passed && onAdvance && (
          <button
            onClick={onAdvance}
            className="flex items-center justify-center gap-2 text-[13px] bg-[#d4376e] text-white px-5 py-3 rounded-xl hover:bg-[#b82e5a] font-semibold"
          >
            Next Level <ChevronRight size={14} />
          </button>
        )}
        <button
          onClick={() => { setIdx(0); setChosen(null); setScore(0); setDone(false) }}
          className="text-[12px] bg-neutral-100 text-neutral-600 px-5 py-2.5 rounded-xl hover:bg-neutral-200 font-medium"
        >
          Retry Quiz
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-neutral-400">{idx + 1} / {questions.length}</span>
        <span className="text-[11px] font-semibold text-[#d4376e]">{score} correct</span>
      </div>
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-4">
        <p className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] mb-2">Translate this word</p>
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-bold text-[#0a0a0a]">{q.item.word}</span>
          {q.item.romanization && <span className="text-[13px] text-neutral-400 font-mono">{q.item.romanization}</span>}
          <SpeakBtn text={q.item.word} voice={voice} size="sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`text-left p-3 rounded-xl border text-[12px] font-medium transition-all ${
              chosen === null
                ? 'border-neutral-200 text-[#0a0a0a] hover:border-[#d4376e] hover:bg-[#fde8ef]'
                : i === q.correctIdx
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : i === chosen
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-neutral-100 text-neutral-300'
            }`}
          >
            {opt.translation}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function LessonPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ level?: string }> }) {
  const { lang } = use(params)
  const { level: startLevel } = use(searchParams)
  const language = getLanguage(lang as LangCode)
  const initIdx = Math.max(0, LEVEL_ORDER.indexOf((startLevel as ProfLevel) || 'A1'))
  const [levelIdx, setLevelIdx] = useState(initIdx)
  const [tab, setTab] = useState<Tab>('vocab')
  const [charText, setCharText] = useState('')
  const [voiceIdx, setVoiceIdx] = useState(0)
  const [globalLoading, setGlobalLoading] = useState(false)
  const charRef = useRef<HTMLInputElement>(null)

  if (!language) return (
    <Shell>
      <div className="p-6">
        <p className="text-neutral-500 text-[13px]">Language not found.</p>
        <Link href="/language" className="text-[#d4376e] text-[12px] mt-2 inline-block">← Language Lab</Link>
      </div>
    </Shell>
  )

  const availLevels = LEVEL_ORDER.filter(l => language.levels.some(lv => lv.level === l))
  const lvl = language.levels.find(l => l.level === availLevels[levelIdx])!
  const voices = VOICES[lang as LangCode] || [lvl.azureVoice]
  const voice = voices[voiceIdx] || lvl.azureVoice

  const insertChar = useCallback((c: string) => {
    setCharText(prev => prev + c)
    charRef.current?.focus()
  }, [])

  const hasDialogue = !!(lvl.dialogue && lvl.dialogue.length > 0)

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'vocab', label: 'Vocabulary', icon: BookOpen },
    { id: 'grammar', label: 'Grammar', icon: GraduationCap },
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare },
    { id: 'drill', label: 'Challenge', icon: Dumbbell },
    { id: 'chars', label: 'Special Chars', icon: Keyboard },
    { id: 'quiz', label: 'Quiz', icon: Mic },
  ]

  const advanceLevel = () => {
    const nextIdx = levelIdx + 1
    if (nextIdx < availLevels.length) {
      setLevelIdx(nextIdx)
      setTab('vocab')
      // persist to localStorage
      const levels = JSON.parse(localStorage.getItem('lang_levels') || '{}')
      levels[lang] = availLevels[nextIdx]
      localStorage.setItem('lang_levels', JSON.stringify(levels))
    }
  }

  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        {/* Back */}
        <Link href="/language" className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 mb-5 transition-colors">
          <ChevronLeft size={13} /> Language Lab
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl">{language.flag}</span>
          <div>
            <h1 className="text-[20px] font-bold text-[#0a0a0a] leading-tight">{language.name}</h1>
            <p className="text-[12px] text-neutral-500">{language.nativeName} · {language.family} · {language.speakers} speakers</p>
          </div>
        </div>

        {/* Level selector */}
        <div className="mb-4">
          <p className="text-[9px] font-bold text-neutral-400 tracking-[0.15em] uppercase mb-2">Level</p>
          <div className="flex gap-1.5 flex-wrap">
            {availLevels.map((l, i) => (
              <button
                key={l}
                onClick={() => { setLevelIdx(i); setTab('vocab') }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  i === levelIdx ? 'bg-[#d4376e] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-neutral-600 font-medium mt-2">{lvl.label}</p>
          <p className="text-[11px] text-neutral-400 leading-snug">{lvl.description}</p>
        </div>

        {/* Voice selector */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-[10px] text-neutral-400 font-medium">Voice:</span>
          {voices.map((v, i) => (
            <button
              key={v}
              onClick={() => setVoiceIdx(i)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                i === voiceIdx ? 'bg-[#0a0a0a] text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {v.replace('Neural', '').split('-').slice(2).join('-')}
            </button>
          ))}
          <button
            onClick={() => speak(lvl.vocab[0]?.word || language.name, voice, () => setGlobalLoading(true), () => setGlobalLoading(false))}
            className="ml-auto flex items-center gap-1.5 text-[10px] text-[#d4376e] hover:underline font-medium"
          >
            {globalLoading ? <Loader2 size={11} className="animate-spin" /> : <Volume2 size={11} />}
            Preview voice
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 mb-5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-colors ${
                tab === id ? 'bg-white text-[#d4376e] shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'vocab' && (
          <div className="space-y-3">
            {lvl.vocab.length === 0
              ? <p className="text-[12px] text-neutral-400">No vocabulary loaded for this level yet.</p>
              : lvl.vocab.map((item, i) => <VocabCard key={i} item={item} voice={voice} />)
            }
          </div>
        )}

        {tab === 'grammar' && (
          <div className="space-y-3">
            {lvl.grammar.map((point, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fde8ef] flex items-center justify-center text-[10px] font-bold text-[#d4376e]">{i + 1}</span>
                <p className="text-[13px] text-[#0a0a0a] leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'dialogue' && (
          <div>
            {hasDialogue
              ? <DialogueSection lines={lvl.dialogue!} voice={voice} title={lvl.dialogueTitle} context={lvl.dialogueContext} />
              : (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
                  <MessageSquare size={28} className="text-neutral-300 mx-auto mb-2" />
                  <p className="text-[12px] text-neutral-500">Dialogue coming soon for this level.</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Try Vocabulary or Grammar in the meantime.</p>
                </div>
              )
            }
          </div>
        )}

        {tab === 'drill' && (
          <div className="space-y-3">
            <p className="text-[11px] text-neutral-400 mb-2">Type the sentence exactly as shown. Press Enter to check, or tap the speaker to hear it first.</p>
            {lvl.drillSentences.map((s, i) => (
              <DrillCard key={i} sentence={s.native} english={s.english} voice={voice} />
            ))}
          </div>
        )}

        {tab === 'chars' && (
          <div>
            <p className="text-[11px] text-neutral-500 mb-3">Tap a character to add it to your practice box. Type directly or mix both.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {language.specialChars.map(({ char, description }) => (
                <button
                  key={char}
                  onClick={() => insertChar(char)}
                  title={description}
                  className="flex flex-col items-center bg-white border border-neutral-200 rounded-lg px-2.5 py-2 hover:border-[#d4376e] hover:bg-[#fde8ef] transition-colors min-w-[44px]"
                >
                  <span className="text-[17px] font-semibold text-[#0a0a0a]">{char}</span>
                  <span className="text-[8px] text-neutral-400 mt-0.5 text-center leading-tight max-w-[56px] truncate">{description}</span>
                </button>
              ))}
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-[9px] font-bold text-neutral-400 tracking-[0.15em] uppercase mb-2">Practice box</p>
              <input
                ref={charRef}
                value={charText}
                onChange={e => setCharText(e.target.value)}
                placeholder="Tap characters above or type here…"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[15px] text-[#0a0a0a] outline-none focus:border-[#d4376e]"
              />
              <div className="flex items-center mt-2 gap-3">
                <button
                  onClick={() => speak(charText, voice, () => setGlobalLoading(true), () => setGlobalLoading(false))}
                  disabled={!charText || globalLoading}
                  className="flex items-center gap-1.5 text-[11px] text-[#d4376e] font-medium hover:underline disabled:opacity-40"
                >
                  {globalLoading ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                  Hear it
                </button>
                <button onClick={() => setCharText('')} className="ml-auto text-[11px] text-neutral-400 hover:text-neutral-600">Clear</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <QuizSection
            vocab={lvl.vocab}
            voice={voice}
            onAdvance={levelIdx < availLevels.length - 1 ? advanceLevel : undefined}
          />
        )}
      </div>
    </Shell>
  )
}
