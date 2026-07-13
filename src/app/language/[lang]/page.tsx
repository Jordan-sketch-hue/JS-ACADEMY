'use client'
import { use, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { getLanguage, LEVEL_ORDER, VOICES, type LangCode, type ProfLevel, type VocabItem } from '@/lib/language-data'
import {
  ChevronLeft, Volume2, Loader2, Check, X, ChevronDown, ChevronUp,
  Globe2, Mic, BookOpen, Dumbbell, GraduationCap, Keyboard
} from 'lucide-react'

type Tab = 'vocab' | 'grammar' | 'drill' | 'chars' | 'quiz'

function speak(text: string, voice: string, onStart: () => void, onEnd: () => void, onError: () => void) {
  onStart()
  fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  })
    .then(r => {
      if (!r.ok) throw new Error()
      return r.blob()
    })
    .then(blob => {
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => { onEnd(); URL.revokeObjectURL(url) }
      audio.onerror = () => { onEnd(); onError() }
      audio.play()
    })
    .catch(() => { onEnd(); onError() })
}

function VocabCard({ item, voice }: { item: VocabItem; voice: string }) {
  const [loading, setLoading] = useState(false)
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[22px] font-bold text-[#0a0a0a] leading-tight">{item.word}</span>
              {item.romanization && (
                <span className="text-[13px] text-neutral-400 font-mono">{item.romanization}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-medium text-[#d4376e]">{item.translation}</span>
              <span className="text-[10px] text-neutral-300">·</span>
              <span className="text-[10px] text-neutral-400 italic">{item.partOfSpeech}</span>
            </div>
          </div>
          <button
            onClick={() => speak(item.word, voice, () => setLoading(true), () => setLoading(false), () => {})}
            disabled={loading}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-[#fde8ef] hover:bg-[#f9c6d8] flex items-center justify-center transition-colors"
          >
            {loading ? <Loader2 size={15} className="text-[#d4376e] animate-spin" /> : <Volume2 size={15} className="text-[#d4376e]" />}
          </button>
        </div>

        {/* Scenario */}
        <div className="mt-3 bg-neutral-50 rounded-lg p-2.5">
          <div className="text-[9px] font-semibold text-neutral-400 tracking-[0.15em] uppercase mb-1">Real scenario</div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">{item.scenario}</p>
        </div>

        {/* Example */}
        <button
          onClick={() => setFlipped(!flipped)}
          className="mt-3 w-full text-left"
        >
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            {flipped ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Example sentence
          </div>
          {flipped && (
            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-2">
                <button
                  onClick={e => { e.stopPropagation(); speak(item.exampleNative, voice, () => setLoading(true), () => setLoading(false), () => {}) }}
                  className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#fde8ef] flex items-center justify-center"
                >
                  <Volume2 size={9} className="text-[#d4376e]" />
                </button>
                <p className="text-[12px] text-[#0a0a0a] font-medium leading-snug">{item.exampleNative}</p>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug ml-7">{item.exampleEnglish}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

function DrillInput({ sentence, english, voice }: { sentence: string; english: string; voice: string }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [loading, setLoading] = useState(false)

  const check = () => {
    const norm = (s: string) => s.trim().toLowerCase().replace(/[.,!?。！？]/g, '')
    setResult(norm(input) === norm(sentence) ? 'correct' : 'wrong')
  }

  const reset = () => { setInput(''); setResult(null) }

  return (
    <div className="bg-white border border-neutral-100 rounded-xl p-4">
      <div className="text-[11px] text-neutral-500 mb-2">{english}</div>
      <div className="relative">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !result && check()}
          placeholder="Type in the native language…"
          className={`w-full rounded-lg border px-3 py-2.5 text-[13px] outline-none transition-colors ${
            result === 'correct' ? 'border-green-400 bg-green-50' :
            result === 'wrong' ? 'border-red-400 bg-red-50' :
            'border-neutral-200 focus:border-[#d4376e]'
          }`}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        {!result ? (
          <button
            onClick={check}
            className="text-[11px] bg-[#0a0a0a] text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Check
          </button>
        ) : (
          <>
            <div className={`flex items-center gap-1 text-[11px] font-medium ${result === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
              {result === 'correct' ? <Check size={13} /> : <X size={13} />}
              {result === 'correct' ? 'Correct!' : `Answer: ${sentence}`}
            </div>
            <button onClick={reset} className="text-[11px] text-neutral-400 hover:text-neutral-700 ml-auto">Try again</button>
          </>
        )}
        <button
          onClick={() => speak(sentence, voice, () => setLoading(true), () => setLoading(false), () => {})}
          className="ml-auto flex-shrink-0 w-7 h-7 rounded-full bg-[#fde8ef] flex items-center justify-center"
        >
          {loading ? <Loader2 size={11} className="text-[#d4376e] animate-spin" /> : <Volume2 size={11} className="text-[#d4376e]" />}
        </button>
      </div>
    </div>
  )
}

function CharPalette({ chars, onInsert }: { chars: { char: string; description: string }[]; onInsert: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chars.map(({ char, description }) => (
        <button
          key={char}
          onClick={() => onInsert(char)}
          title={description}
          className="group relative flex flex-col items-center bg-white border border-neutral-200 rounded-lg px-2.5 py-2 hover:border-[#d4376e] hover:bg-[#fde8ef] transition-colors min-w-[40px]"
        >
          <span className="text-[16px] font-medium text-[#0a0a0a]">{char}</span>
          <span className="text-[8px] text-neutral-400 group-hover:text-[#d4376e] mt-0.5 text-center leading-tight max-w-[60px] truncate">{description}</span>
        </button>
      ))}
    </div>
  )
}

function QuizSection({ vocab, voice }: { vocab: VocabItem[]; voice: string }) {
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  if (vocab.length < 4) return <p className="text-[12px] text-neutral-400">Not enough vocab items for a quiz at this level.</p>

  const questions = vocab.slice(0, Math.min(vocab.length, 8)).map((item, i) => {
    const wrong = vocab.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3)
    const opts = [...wrong, item].sort(() => Math.random() - 0.5)
    const correctIdx = opts.indexOf(item)
    return { item, opts, correctIdx }
  })

  const q = questions[idx]

  const pick = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    if (i === q.correctIdx) setScore(s => s + 1)
    setTimeout(() => {
      if (idx + 1 >= questions.length) { setDone(true) }
      else { setIdx(x => x + 1); setChosen(null) }
    }, 1200)
  }

  if (done) return (
    <div className="text-center py-10">
      <div className="text-4xl mb-3">{score >= questions.length * 0.8 ? '🔥' : score >= questions.length * 0.5 ? '💪' : '📚'}</div>
      <div className="text-[18px] font-bold">{score}/{questions.length}</div>
      <div className="text-[12px] text-neutral-500 mt-1">{score >= questions.length * 0.8 ? 'Excellent! Ready for the next level.' : 'Keep drilling — repetition is mastery.'}</div>
      <button onClick={() => { setIdx(0); setChosen(null); setScore(0); setDone(false) }}
        className="mt-4 text-[11px] bg-[#d4376e] text-white px-4 py-2 rounded-lg hover:bg-[#b82e5a]">
        Retry Quiz
      </button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-neutral-400">Question {idx + 1} of {questions.length}</span>
        <span className="text-[11px] text-[#d4376e] font-medium">{score} correct</span>
      </div>
      <div className="bg-neutral-50 rounded-xl p-4 mb-4">
        <div className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] mb-2">What is the translation of:</div>
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-bold text-[#0a0a0a]">{q.item.word}</span>
          {q.item.romanization && <span className="text-[13px] text-neutral-400 font-mono">{q.item.romanization}</span>}
          <button
            onClick={() => speak(q.item.word, voice, () => setLoading(true), () => setLoading(false), () => {})}
            className="ml-auto w-8 h-8 rounded-full bg-[#fde8ef] flex items-center justify-center"
          >
            {loading ? <Loader2 size={13} className="text-[#d4376e] animate-spin" /> : <Volume2 size={13} className="text-[#d4376e]" />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`text-left p-3 rounded-xl border text-[12px] transition-all ${
              chosen === null ? 'border-neutral-200 hover:border-[#d4376e] hover:bg-[#fde8ef]' :
              i === q.correctIdx ? 'border-green-400 bg-green-50 text-green-700' :
              i === chosen ? 'border-red-400 bg-red-50 text-red-600' :
              'border-neutral-100 text-neutral-400'
            }`}
          >
            {opt.translation}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function LessonPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const language = getLanguage(lang as LangCode)
  const [levelIdx, setLevelIdx] = useState(0)
  const [tab, setTab] = useState<Tab>('vocab')
  const [charTarget, setCharTarget] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const charInputRef = useRef<HTMLInputElement>(null)

  if (!language) return (
    <Shell>
      <div className="p-6">
        <p className="text-neutral-500">Language not found.</p>
        <Link href="/language" className="text-[#d4376e] text-[12px] mt-2 inline-block">← Back to Language Lab</Link>
      </div>
    </Shell>
  )

  const availableLevels = LEVEL_ORDER.filter(l => language.levels.some(lv => lv.level === l))
  const currentLevel = language.levels.find(l => l.level === availableLevels[levelIdx])!
  const voices = VOICES[lang as LangCode] || [currentLevel.azureVoice]
  const [voiceIdx, setVoiceIdx] = useState(0)
  const voice = voices[voiceIdx] || currentLevel.azureVoice

  const insertChar = useCallback((char: string) => {
    setCharTarget(prev => prev + char)
    charInputRef.current?.focus()
  }, [])

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'vocab', label: 'Vocabulary', icon: BookOpen },
    { id: 'grammar', label: 'Grammar', icon: GraduationCap },
    { id: 'drill', label: 'Drills', icon: Dumbbell },
    { id: 'chars', label: 'Characters', icon: Keyboard },
    { id: 'quiz', label: 'Quiz', icon: Mic },
  ]

  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        {/* Back */}
        <Link href="/language" className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-700 mb-4">
          <ChevronLeft size={13} />
          Language Lab
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <span className="text-4xl">{language.flag}</span>
          <div className="flex-1">
            <h1 className="text-[20px] font-bold text-[#0a0a0a]">{language.name}</h1>
            <p className="text-[12px] text-neutral-500">{language.nativeName} · {language.speakers} speakers · {language.family}</p>
          </div>
        </div>

        {/* Level selector */}
        <div className="mb-4">
          <div className="text-[9px] font-medium text-neutral-400 tracking-[0.15em] uppercase mb-2">Level</div>
          <div className="flex gap-1.5 flex-wrap">
            {availableLevels.map((l, i) => (
              <button
                key={l}
                onClick={() => { setLevelIdx(i); setTab('vocab') }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  i === levelIdx
                    ? 'bg-[#d4376e] text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">{currentLevel.label} · {currentLevel.description}</p>
        </div>

        {/* Voice selector */}
        <div className="mb-4 flex items-center gap-2">
          <Mic size={12} className="text-[#d4376e]" />
          <span className="text-[10px] text-neutral-400">Voice:</span>
          <div className="flex gap-1.5">
            {voices.map((v, i) => (
              <button
                key={v}
                onClick={() => setVoiceIdx(i)}
                className={`px-2 py-1 rounded text-[9px] font-mono transition-colors ${
                  i === voiceIdx ? 'bg-[#d4376e] text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {v.split('-').slice(-1)[0].replace('Neural', '')}
              </button>
            ))}
          </div>
          <button
            onClick={() => speak(currentLevel.vocab[0]?.word || language.name, voice, () => setSpeaking(true), () => setSpeaking(false), () => {})}
            className="ml-auto flex items-center gap-1.5 text-[10px] text-[#d4376e] hover:underline"
          >
            {speaking ? <Loader2 size={11} className="animate-spin" /> : <Volume2 size={11} />}
            Preview voice
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-neutral-50 rounded-xl p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-colors ${
                tab === id ? 'bg-white text-[#d4376e] shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Icon size={11} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === 'vocab' && (
            <div className="space-y-3">
              {currentLevel.vocab.length === 0 && (
                <p className="text-[12px] text-neutral-400">Vocabulary for this level coming soon.</p>
              )}
              {currentLevel.vocab.map((item, i) => (
                <VocabCard key={i} item={item} voice={voice} />
              ))}
            </div>
          )}

          {tab === 'grammar' && (
            <div className="space-y-3">
              {currentLevel.grammar.map((point, i) => (
                <div key={i} className="bg-white border border-neutral-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#fde8ef] flex items-center justify-center text-[10px] font-bold text-[#d4376e]">{i + 1}</span>
                    <p className="text-[13px] text-[#0a0a0a] leading-relaxed">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'drill' && (
            <div className="space-y-3">
              <p className="text-[11px] text-neutral-400 mb-3">Type the sentence exactly. Press Enter or tap Check. Click 🔊 to hear the answer.</p>
              {currentLevel.drillSentences.map((s, i) => (
                <DrillInput key={i} sentence={s.native} english={s.english} voice={voice} />
              ))}
            </div>
          )}

          {tab === 'chars' && (
            <div>
              <p className="text-[11px] text-neutral-500 mb-3">Click a character to insert it into the box below. Practice typing special characters exactly as they appear in the language.</p>
              <div className="mb-4">
                <CharPalette chars={language.specialChars} onInsert={insertChar} />
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <div className="text-[9px] text-neutral-400 uppercase tracking-[0.15em] mb-2">Your practice text</div>
                <input
                  ref={charInputRef}
                  value={charTarget}
                  onChange={e => setCharTarget(e.target.value)}
                  placeholder="Click characters above or type directly…"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-[#d4376e]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => speak(charTarget, voice, () => setSpeaking(true), () => setSpeaking(false), () => {})}
                    disabled={!charTarget || speaking}
                    className="flex items-center gap-1.5 text-[11px] text-[#d4376e] hover:underline disabled:opacity-40"
                  >
                    {speaking ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                    Hear it
                  </button>
                  <button onClick={() => setCharTarget('')} className="ml-auto text-[11px] text-neutral-400 hover:text-neutral-600">Clear</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'quiz' && (
            <QuizSection vocab={currentLevel.vocab} voice={voice} />
          )}
        </div>
      </div>
    </Shell>
  )
}
