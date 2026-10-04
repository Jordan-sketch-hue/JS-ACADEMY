'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { VOCAB, UNIT_META, LANG_META, type LangCode, type UnitId, type VocabItem } from '@/lib/language-lessons'
import {
  ChevronLeft, Volume2, Loader2, Check, X, Lock, ChevronRight,
  Star, Bot, Send, User as UserIcon, Trophy, Zap, RotateCcw, ArrowRight
} from 'lucide-react'

// ─── SRS Engine ──────────────────────────────────────────────────────────────

interface SRSCard { interval: number; nextDue: number; ease: number; reps: number }

function getSRS(lang: string, wordId: string): SRSCard {
  try {
    const raw = localStorage.getItem(`srs_${lang}_${wordId}`)
    return raw ? JSON.parse(raw) : { interval: 1, nextDue: 0, ease: 2.5, reps: 0 }
  } catch { return { interval: 1, nextDue: 0, ease: 2.5, reps: 0 } }
}

function rateSRS(lang: string, wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') {
  const card = getSRS(lang, wordId)
  const easeAdj = { again: -0.3, hard: -0.15, good: 0, easy: 0.15 }[rating]
  const ease = Math.max(1.3, Math.min(2.5, card.ease + easeAdj))
  const intervalMult = { again: 0, hard: 0.5, good: 1, easy: 1.5 }[rating]
  const interval = rating === 'again' ? 1 : Math.max(1, Math.round(card.interval * ease * intervalMult + 1))
  const nextDue = Date.now() + interval * 24 * 60 * 60 * 1000
  try {
    localStorage.setItem(`srs_${lang}_${wordId}`, JSON.stringify({ interval, nextDue, ease, reps: card.reps + 1 }))
  } catch { /* ignore */ }
}

// ─── Progress ────────────────────────────────────────────────────────────────

function getProgress(lang: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(`progress_${lang}`) || '{}') } catch { return {} }
}
function markComplete(lang: string, lessonId: string) {
  const p = getProgress(lang)
  p[lessonId] = true
  try { localStorage.setItem(`progress_${lang}`, JSON.stringify(p)) } catch { /* ignore */ }
}
function getLangXP(lang: string): number {
  try { return parseInt(localStorage.getItem(`xp_${lang}`) || '0') } catch { return 0 }
}
function addXP(lang: string, amount: number) {
  try { localStorage.setItem(`xp_${lang}`, String(getLangXP(lang) + amount)) } catch { /* ignore */ }
}

// ─── Exercise Types ───────────────────────────────────────────────────────────

type ExType = 'flashcard' | 'fill_blank' | 'listen_type' | 'build_sentence'

interface Exercise {
  type: ExType
  vocab: VocabItem
  distractors: string[]
  tiles: string[]
  blank: string
  blankAnswer: string
}

function buildExercises(vocabItems: VocabItem[], allUnitVocab: VocabItem[]): Exercise[] {
  const CYCLE: ExType[] = ['flashcard', 'fill_blank', 'listen_type', 'build_sentence']
  return vocabItems.map((v, i) => {
    const type = CYCLE[i % 4]
    const pool = allUnitVocab.filter(x => x.id !== v.id)
    const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.translation)
    const sentenceWords = v.sentence.split(/\s+/).filter(Boolean)
    const decoys = allUnitVocab.filter(x => x.id !== v.id).slice(0, 2).map(x => x.word)
    const tiles = [...sentenceWords, ...decoys].sort(() => Math.random() - 0.5)
    const blank = v.sentence.replace(v.word, '___')
    return { type, vocab: v, distractors, tiles, blank, blankAnswer: v.word }
  })
}

// ─── TTS ─────────────────────────────────────────────────────────────────────

function speak(text: string, bcp47: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis?.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = bcp47
  window.speechSynthesis?.speak(u)
}

// ─── AI Tutor Chat ────────────────────────────────────────────────────────────

interface ChatMessage { role: 'user' | 'assistant'; content: string }

function AiTutorPanel({ language, lang, onClose }: { language: string; lang: string; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/claude-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          languageCode: lang,
          level: 'A1',
          conversationHistory: newMessages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.error === 'ANTHROPIC_API_KEY not configured'
            ? 'AI tutor not available — add your ANTHROPIC_API_KEY to environment variables.'
            : `Error: ${data.error}`
        }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — try again.' }])
    }
    setLoading(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 border-l border-neutral-200 dark:border-gray-700 z-[60] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#fde8ef] flex items-center justify-center">
            <Bot size={16} className="text-[#d4376e]" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">AI Tutor</div>
            <div className="text-[10px] text-neutral-400">{language} coach</div>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
          <X size={14} className="text-neutral-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center pt-6 pb-4">
            <div className="text-[12px] text-neutral-400 mb-4">Ask anything about {language}</div>
            <div className="space-y-2">
              {[
                `How do I say "thank you" in ${language}?`,
                `What's the word order in ${language}?`,
                `Give me a beginner tip for ${language}`
              ].map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="block w-full text-left text-[11px] border border-neutral-200 dark:border-gray-600 rounded-xl px-3 py-2 text-neutral-500 dark:text-gray-400 hover:border-[#d4376e] hover:text-[#d4376e] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${m.role === 'assistant' ? 'bg-[#fde8ef]' : 'bg-neutral-100 dark:bg-gray-700'}`}>
              {m.role === 'assistant'
                ? <Bot size={11} className="text-[#d4376e]" />
                : <UserIcon size={11} className="text-neutral-400" />}
            </div>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap ${
              m.role === 'assistant'
                ? 'bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 text-neutral-700 dark:text-gray-300'
                : 'bg-[#d4376e] text-white'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-[#fde8ef] flex-shrink-0 flex items-center justify-center">
              <Bot size={11} className="text-[#d4376e]" />
            </div>
            <div className="bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 rounded-xl px-3 py-2">
              <Loader2 size={12} className="text-[#d4376e] animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-neutral-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={`Ask about ${language}…`}
            className="flex-1 border border-neutral-200 dark:border-gray-600 rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[#d4376e] bg-white dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-[#d4376e] hover:bg-[#bb2d5e] disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Flashcard Exercise ───────────────────────────────────────────────────────

function FlashcardExercise({
  exercise, lang, bcp47, onRate
}: {
  exercise: Exercise
  lang: string
  bcp47: string
  onRate: (r: 'again' | 'hard' | 'good' | 'easy') => void
}) {
  const [flipped, setFlipped] = useState(false)
  const v = exercise.vocab

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6">
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">Flashcard</p>

      {/* Card */}
      <div
        className="relative w-full max-w-sm cursor-pointer"
        style={{ perspective: '1000px', height: 280 }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 gap-3"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-[40px] font-bold text-[#0a0a0a] dark:text-white text-center leading-tight">{v.word}</div>
            {v.romanization && (
              <div className="text-[15px] text-neutral-400 font-mono">{v.romanization}</div>
            )}
            <button
              onClick={e => { e.stopPropagation(); speak(v.word, bcp47) }}
              className="w-10 h-10 rounded-full bg-[#fde8ef] hover:bg-[#f9c6d8] flex items-center justify-center transition-colors mt-2"
            >
              <Volume2 size={18} className="text-[#d4376e]" />
            </button>
            <p className="text-[11px] text-neutral-300 absolute bottom-4">TAP TO REVEAL</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-[28px] font-bold text-[#d4376e] text-center">{v.translation}</div>
            <div className="text-[11px] text-neutral-400 italic">{v.partOfSpeech}</div>
            <div className="mt-2 w-full bg-neutral-50 dark:bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-[13px] text-[#0a0a0a] dark:text-white font-medium leading-snug">{v.sentence}</div>
              <div className="text-[11px] text-neutral-400 mt-1">{v.sentenceEn}</div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); speak(v.sentence, bcp47) }}
              className="w-8 h-8 rounded-full bg-[#fde8ef] hover:bg-[#f9c6d8] flex items-center justify-center transition-colors"
            >
              <Volume2 size={14} className="text-[#d4376e]" />
            </button>
          </div>
        </div>
      </div>

      {/* SRS Buttons (only on back) */}
      {flipped && (
        <div className="flex gap-2 mt-6 w-full max-w-sm">
          {(['again', 'hard', 'good', 'easy'] as const).map(r => {
            const colors = {
              again: 'bg-red-100 text-red-600 hover:bg-red-200 border-red-200',
              hard: 'bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200',
              good: 'bg-green-100 text-green-600 hover:bg-green-200 border-green-200',
              easy: 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200'
            }[r]
            return (
              <button
                key={r}
                onClick={() => { rateSRS(lang, v.id, r); onRate(r) }}
                className={`flex-1 py-2 rounded-xl border text-[12px] font-semibold capitalize transition-colors ${colors}`}
              >
                {r}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Fill in the Blank ────────────────────────────────────────────────────────

function FillBlankExercise({
  exercise, bcp47, onContinue
}: {
  exercise: Exercise
  bcp47: string
  onContinue: () => void
}) {
  const v = exercise.vocab
  const [chosen, setChosen] = useState<string | null>(null)
  const options = [...exercise.distractors, v.translation].sort(() => Math.random() - 0.5)
  // Stable options via ref to avoid re-shuffle on re-render
  const optionsRef = useRef(options)

  const pick = (opt: string) => {
    if (chosen) return
    setChosen(opt)
  }
  const isCorrect = chosen === v.translation

  return (
    <div className="flex flex-col h-full px-4 py-6">
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">Choose the missing word</p>

      <div className="bg-neutral-50 dark:bg-gray-800 rounded-2xl p-5 mb-6 text-center">
        <p className="text-[22px] font-bold text-[#0a0a0a] dark:text-white leading-relaxed">{exercise.blank}</p>
        <button
          onClick={() => speak(v.sentence, bcp47)}
          className="mt-3 w-8 h-8 rounded-full bg-[#fde8ef] hover:bg-[#f9c6d8] flex items-center justify-center transition-colors mx-auto"
        >
          <Volume2 size={14} className="text-[#d4376e]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {optionsRef.current.map(opt => {
          let cls = 'border-neutral-200 dark:border-gray-600 text-[#0a0a0a] dark:text-white hover:border-[#d4376e] hover:bg-[#fde8ef]'
          if (chosen) {
            if (opt === v.translation) cls = 'border-green-400 bg-green-50 text-green-700'
            else if (opt === chosen) cls = 'border-red-300 bg-red-50 text-red-600'
            else cls = 'border-neutral-100 text-neutral-300 dark:border-gray-700 dark:text-gray-600'
          }
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              className={`rounded-xl border p-4 text-[14px] font-semibold transition-all ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {chosen && (
        <div className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`flex items-center gap-2 font-semibold text-[13px] ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
            {isCorrect ? <Check size={16} /> : <X size={16} />}
            {isCorrect ? 'Correct!' : `The answer is: ${v.translation}`}
          </div>
          <button
            onClick={onContinue}
            className="mt-3 w-full bg-[#d4376e] hover:bg-[#bb2d5e] text-white font-semibold py-3 rounded-xl text-[14px] transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Listen & Type ────────────────────────────────────────────────────────────

function ListenTypeExercise({
  exercise, bcp47, onContinue
}: {
  exercise: Exercise
  bcp47: string
  onContinue: () => void
}) {
  const v = exercise.vocab
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    speak(v.word, bcp47)
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [v.word, bcp47])

  const norm = (s: string) => s.trim().toLowerCase().replace(/[.,!?。！？]/g, '')
  const check = () => {
    if (!input.trim()) return
    setResult(norm(input) === norm(v.word) ? 'correct' : 'wrong')
  }

  return (
    <div className="flex flex-col h-full px-4 py-6">
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">Type what you heard</p>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <button
          onClick={() => speak(v.word, bcp47)}
          className="w-20 h-20 rounded-full bg-[#fde8ef] hover:bg-[#f9c6d8] flex items-center justify-center transition-all hover:scale-105 shadow-md"
        >
          <Volume2 size={32} className="text-[#d4376e]" />
        </button>
        <p className="text-[12px] text-neutral-400">Tap to hear again</p>

        <div className="w-full max-w-sm">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !result && check()}
            disabled={!!result}
            placeholder="Type what you heard…"
            className="w-full border-2 border-neutral-200 dark:border-gray-600 rounded-xl px-4 py-3 text-[16px] text-[#0a0a0a] dark:text-white outline-none focus:border-[#d4376e] bg-white dark:bg-gray-800 text-center"
          />
        </div>
      </div>

      {!result ? (
        <button
          onClick={check}
          disabled={!input.trim()}
          className="w-full bg-[#d4376e] hover:bg-[#bb2d5e] disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-[14px] transition-colors"
        >
          Check
        </button>
      ) : (
        <div className={`p-4 rounded-xl ${result === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`flex items-center gap-2 font-semibold text-[13px] mb-1 ${result === 'correct' ? 'text-green-700' : 'text-red-600'}`}>
            {result === 'correct' ? <Check size={16} /> : <X size={16} />}
            {result === 'correct' ? 'Correct!' : `The word was: ${v.word}`}
          </div>
          {result === 'wrong' && (
            <div className="text-[12px] text-neutral-500 mb-2">You typed: {input}</div>
          )}
          <button
            onClick={onContinue}
            className="mt-2 w-full bg-[#d4376e] hover:bg-[#bb2d5e] text-white font-semibold py-3 rounded-xl text-[14px] transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sentence Builder ─────────────────────────────────────────────────────────

function SentenceBuilderExercise({
  exercise, bcp47, onContinue
}: {
  exercise: Exercise
  bcp47: string
  onContinue: () => void
}) {
  const v = exercise.vocab
  const [bank, setBank] = useState<string[]>(() => exercise.tiles)
  const [placed, setPlaced] = useState<string[]>([])
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const addTile = (tile: string, idx: number) => {
    if (result) return
    setBank(b => b.filter((_, i) => i !== idx))
    setPlaced(p => [...p, tile])
  }

  const removeTile = (tile: string, idx: number) => {
    if (result) return
    setPlaced(p => p.filter((_, i) => i !== idx))
    setBank(b => [...b, tile])
  }

  const norm = (s: string) => s.trim().toLowerCase().replace(/[.,!?。！？]/g, '')
  const check = () => {
    if (placed.length === 0) return
    const answer = placed.join(' ')
    setResult(norm(answer) === norm(v.sentence) ? 'correct' : 'wrong')
  }

  const reset = () => {
    setBank(exercise.tiles)
    setPlaced([])
    setResult(null)
  }

  return (
    <div className="flex flex-col h-full px-4 py-6">
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">Arrange the words</p>
      <p className="text-[13px] text-neutral-500 dark:text-gray-400 mb-4">{v.sentenceEn}</p>

      {/* Answer area */}
      <div
        className="min-h-[64px] border-2 border-dashed border-neutral-200 dark:border-gray-600 rounded-xl p-3 mb-4 flex flex-wrap gap-2 items-start content-start"
      >
        {placed.length === 0 && (
          <span className="text-[12px] text-neutral-300 dark:text-gray-600 self-center">Tap words below to build the sentence</span>
        )}
        {placed.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            onClick={() => removeTile(tile, i)}
            className="px-3 py-1.5 bg-[#d4376e] text-white rounded-xl text-[13px] font-medium hover:bg-[#bb2d5e] transition-colors"
          >
            {tile}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[48px]">
        {bank.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            onClick={() => addTile(tile, i)}
            disabled={!!result}
            className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-xl text-[13px] font-medium text-[#0a0a0a] dark:text-white hover:border-[#d4376e] hover:bg-[#fde8ef] transition-colors disabled:opacity-50"
          >
            {tile}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-gray-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          <RotateCcw size={15} className="text-neutral-400" />
        </button>
        <button
          onClick={() => speak(v.sentence, bcp47)}
          className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-gray-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          <Volume2 size={15} className="text-[#d4376e]" />
        </button>
        {!result && (
          <button
            onClick={check}
            disabled={placed.length === 0}
            className="flex-1 bg-[#d4376e] hover:bg-[#bb2d5e] disabled:opacity-40 text-white font-semibold py-2 rounded-xl text-[14px] transition-colors"
          >
            Check
          </button>
        )}
      </div>

      {result && (
        <div className={`p-4 rounded-xl ${result === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`flex items-center gap-2 font-semibold text-[13px] mb-1 ${result === 'correct' ? 'text-green-700' : 'text-red-600'}`}>
            {result === 'correct' ? <Check size={16} /> : <X size={16} />}
            {result === 'correct' ? 'Perfect!' : `Correct: ${v.sentence}`}
          </div>
          <button
            onClick={onContinue}
            className="mt-2 w-full bg-[#d4376e] hover:bg-[#bb2d5e] text-white font-semibold py-3 rounded-xl text-[14px] transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Lesson Complete Screen ───────────────────────────────────────────────────

function LessonCompleteScreen({ xpEarned, onContinue }: { xpEarned: number; onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
      <div className="text-[72px] mb-4">🎉</div>
      <h2 className="text-[28px] font-bold text-[#0a0a0a] dark:text-white mb-2">Lesson Complete!</h2>
      <p className="text-[14px] text-neutral-500 mb-8">Great work — you are building your vocabulary.</p>

      <div className="flex items-center gap-3 bg-[#fde8ef] rounded-2xl px-6 py-4 mb-8">
        <Zap size={24} className="text-[#d4376e]" />
        <div>
          <div className="text-[28px] font-bold text-[#d4376e]">+{xpEarned} XP</div>
          <div className="text-[11px] text-[#d4376e] opacity-70">earned this lesson</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-8">
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
        Keep your streak going — come back tomorrow!
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-xs bg-[#d4376e] hover:bg-[#bb2d5e] text-white font-bold py-4 rounded-2xl text-[16px] transition-colors flex items-center justify-center gap-2"
      >
        Continue <ArrowRight size={18} />
      </button>
    </div>
  )
}

// ─── Lesson View (full screen overlay) ───────────────────────────────────────

interface LessonViewProps {
  exercises: Exercise[]
  lang: string
  bcp47: string
  onClose: () => void
  onComplete: (xp: number) => void
}

function LessonView({ exercises, lang, bcp47, onClose, onComplete }: LessonViewProps) {
  const [exIdx, setExIdx] = useState(0)
  const [lessonXP, setLessonXP] = useState(0)
  const [showComplete, setShowComplete] = useState(false)

  const current = exercises[exIdx]

  const advance = useCallback(() => {
    const gained = 2
    setLessonXP(x => x + gained)
    if (exIdx + 1 >= exercises.length) {
      const total = (exIdx + 1) * gained
      setLessonXP(total)
      setShowComplete(true)
    } else {
      setExIdx(i => i + 1)
    }
  }, [exIdx, exercises.length])

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X size={18} className="text-neutral-500" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-3 bg-neutral-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d4376e] rounded-full transition-all duration-300"
            style={{ width: showComplete ? '100%' : `${((exIdx) / exercises.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Zap size={14} className="text-[#d4376e]" />
          <span className="text-[13px] font-bold text-[#d4376e]">{lessonXP}</span>
        </div>
      </div>

      {/* Exercise area */}
      <div className="flex-1 overflow-y-auto">
        {showComplete ? (
          <LessonCompleteScreen
            xpEarned={lessonXP}
            onContinue={() => onComplete(lessonXP)}
          />
        ) : current?.type === 'flashcard' ? (
          <FlashcardExercise
            key={exIdx}
            exercise={current}
            lang={lang}
            bcp47={bcp47}
            onRate={advance}
          />
        ) : current?.type === 'fill_blank' ? (
          <FillBlankExercise
            key={exIdx}
            exercise={current}
            bcp47={bcp47}
            onContinue={advance}
          />
        ) : current?.type === 'listen_type' ? (
          <ListenTypeExercise
            key={exIdx}
            exercise={current}
            bcp47={bcp47}
            onContinue={advance}
          />
        ) : current?.type === 'build_sentence' ? (
          <SentenceBuilderExercise
            key={exIdx}
            exercise={current}
            bcp47={bcp47}
            onContinue={advance}
          />
        ) : null}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const LESSONS_PER_UNIT = 5
const WORDS_PER_LESSON = 8

export default function LangPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as LangCode
  const langMeta = LANG_META[lang]
  const allVocab = VOCAB[lang] || []

  const [view, setView] = useState<'map' | 'lesson'>('map')
  const [activeUnit, setActiveUnit] = useState<UnitId | null>(null)
  const [activeLessonIdx, setActiveLessonIdx] = useState(0)
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [xp, setXP] = useState(0)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showTutor, setShowTutor] = useState(false)

  useEffect(() => {
    setProgress(getProgress(lang))
    setXP(getLangXP(lang))
  }, [lang])

  if (!langMeta) {
    return (
      <Shell>
        <div className="p-6">
          <p className="text-neutral-500 text-[13px]">Language not found.</p>
          <Link href="/language" className="text-[#d4376e] text-[12px] mt-2 inline-block">
            ← Language Lab
          </Link>
        </div>
      </Shell>
    )
  }

  const units = UNIT_META

  // Compute how many lessons each unit has and which are complete
  const getUnitLessons = (unitId: UnitId) => {
    const unitVocab = allVocab.filter(v => v.unitId === unitId)
    const count = Math.max(1, Math.ceil(unitVocab.length / WORDS_PER_LESSON))
    return Math.min(count, LESSONS_PER_UNIT)
  }

  const getLessonId = (unitId: UnitId, lessonIdx: number) => `${lang}_${unitId}_${lessonIdx}`

  const getUnitComplete = (unitIdx: number): boolean => {
    const unit = units[unitIdx]
    const lessonCount = getUnitLessons(unit.id)
    for (let i = 0; i < lessonCount; i++) {
      if (!progress[getLessonId(unit.id, i)]) return false
    }
    return true
  }

  const isUnitUnlocked = (unitIdx: number): boolean => {
    if (unitIdx === 0) return true
    return getUnitComplete(unitIdx - 1)
  }

  const getUnitCompletedLessons = (unitId: UnitId, total: number): number => {
    let count = 0
    for (let i = 0; i < total; i++) {
      if (progress[getLessonId(unitId, i)]) count++
    }
    return count
  }

  const startLesson = (unitId: UnitId, lessonIdx: number) => {
    const unitVocab = allVocab.filter(v => v.unitId === unitId)
    const start = lessonIdx * WORDS_PER_LESSON
    const lessonVocab = unitVocab.slice(start, start + WORDS_PER_LESSON)
    if (lessonVocab.length === 0) return
    const exs = buildExercises(lessonVocab, unitVocab)
    setExercises(exs)
    setActiveUnit(unitId)
    setActiveLessonIdx(lessonIdx)
    setView('lesson')
  }

  const handleStartUnit = (unitId: UnitId, unitIdx: number) => {
    if (!isUnitUnlocked(unitIdx)) return
    const lessonCount = getUnitLessons(unitId)
    // Find first incomplete lesson
    let target = 0
    for (let i = 0; i < lessonCount; i++) {
      if (!progress[getLessonId(unitId, i)]) { target = i; break }
    }
    startLesson(unitId, target)
  }

  const handleLessonComplete = (earnedXP: number) => {
    if (!activeUnit) return
    const lessonId = getLessonId(activeUnit, activeLessonIdx)
    markComplete(lang, lessonId)
    addXP(lang, earnedXP)
    const newProgress = getProgress(lang)
    setProgress(newProgress)
    setXP(getLangXP(lang))
    setView('map')
    setActiveUnit(null)
  }

  return (
    <Shell>
      <div className="relative">
        {/* Lesson overlay */}
        {view === 'lesson' && exercises.length > 0 && (
          <LessonView
            exercises={exercises}
            lang={lang}
            bcp47={langMeta.bcp47}
            onClose={() => setView('map')}
            onComplete={handleLessonComplete}
          />
        )}

        {/* Unit Map */}
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          {/* Back */}
          <Link
            href="/language"
            className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 mb-5 transition-colors"
          >
            <ChevronLeft size={13} /> Language Lab
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{langMeta.flag}</span>
              <div>
                <h1 className="text-[22px] font-bold text-[#0a0a0a] dark:text-white leading-tight">{langMeta.name}</h1>
                <p className="text-[11px] text-neutral-400">A1 · Absolute Beginner</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fde8ef] rounded-full px-3 py-1.5">
              <Zap size={14} className="text-[#d4376e]" />
              <span className="text-[13px] font-bold text-[#d4376e]">{xp} XP</span>
            </div>
          </div>

          <p className="text-[12px] text-neutral-400 mb-6 ml-[64px]">{langMeta.nativeName}</p>

          {/* Units */}
          <div className="space-y-3">
            {units.map((unit, unitIdx) => {
              const unlocked = isUnitUnlocked(unitIdx)
              const lessonCount = getUnitLessons(unit.id)
              const completedLessons = getUnitCompletedLessons(unit.id, lessonCount)
              const complete = completedLessons === lessonCount && lessonCount > 0
              const isCurrent = unlocked && !complete

              let circleClass = 'bg-gray-100 dark:bg-gray-700'
              let iconColor = 'text-gray-400'
              if (complete) { circleClass = 'bg-yellow-100'; iconColor = 'text-yellow-500' }
              else if (isCurrent) { circleClass = 'bg-[#fde8ef]'; iconColor = 'text-[#d4376e]' }

              return (
                <div
                  key={unit.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all ${
                    unlocked
                      ? 'border-neutral-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:border-[#f9c6d8] dark:hover:border-pink-800'
                      : 'border-neutral-100 dark:border-gray-800 opacity-60'
                  }`}
                  onClick={() => handleStartUnit(unit.id, unitIdx)}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Icon circle */}
                    <div className={`w-14 h-14 rounded-2xl ${circleClass} flex items-center justify-center flex-shrink-0 text-[28px]`}>
                      {unit.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[15px] font-bold text-[#0a0a0a] dark:text-white truncate">{unit.title}</h3>
                        <div className="flex-shrink-0 ml-2">
                          {!unlocked && <Lock size={16} className="text-gray-400" />}
                          {complete && <Trophy size={16} className="text-yellow-500" />}
                          {isCurrent && <ChevronRight size={16} className="text-[#d4376e]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-2">
                        {completedLessons} / {lessonCount} lessons complete
                      </p>
                      {/* Progress bar */}
                      <div className="h-2 bg-neutral-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${complete ? 'bg-yellow-400' : 'bg-[#d4376e]'}`}
                          style={{ width: lessonCount > 0 ? `${(completedLessons / lessonCount) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lesson dots */}
                  {unlocked && (
                    <div className="px-4 pb-3 flex gap-1.5">
                      {Array.from({ length: lessonCount }).map((_, i) => {
                        const done = !!progress[getLessonId(unit.id, i)]
                        return (
                          <button
                            key={i}
                            onClick={e => { e.stopPropagation(); startLesson(unit.id, i) }}
                            className={`flex-1 h-1.5 rounded-full transition-colors ${done ? 'bg-[#d4376e]' : 'bg-neutral-200 dark:bg-gray-600 hover:bg-[#f9c6d8]'}`}
                            title={`Lesson ${i + 1}`}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom padding for FAB */}
          <div className="h-20" />
        </div>

        {/* AI Tutor FAB */}
        <button
          onClick={() => setShowTutor(t => !t)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#d4376e] hover:bg-[#bb2d5e] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="AI Tutor"
        >
          <Bot size={24} className="text-white" />
        </button>

        {/* AI Tutor Panel */}
        {showTutor && (
          <AiTutorPanel
            language={langMeta.name}
            lang={lang}
            onClose={() => setShowTutor(false)}
          />
        )}
      </div>
    </Shell>
  )
}
