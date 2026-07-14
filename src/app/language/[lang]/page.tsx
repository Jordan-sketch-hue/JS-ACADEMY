'use client'
import { useParams } from 'next/navigation'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { LANGUAGES, type Language, type Lesson, type LanguageCode } from '@/lib/language-data'
import { Volume2, ChevronRight, ChevronDown, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react'

type Tab = 'vocab' | 'grammar' | 'dialogue' | 'challenge' | 'chars'

export default function LanguagePage() {
  const { lang } = useParams<{ lang: string }>()
  const language = LANGUAGES.find(l => l.code === lang as LanguageCode)

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(language?.lessons[0] ?? null)
  const [activeTab, setActiveTab] = useState<Tab>('vocab')
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [userInput, setUserInput] = useState('')
  const [challengeResults, setChallengeResults] = useState<Record<number, boolean | null>>({})
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [playing, setPlaying] = useState<string | null>(null)
  const [showHint, setShowHint] = useState<Set<number>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, id: string) => {
    if (!language || !selectedLesson) return
    if (playing === id) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    setPlaying(id)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: language.voiceName }),
      })
      if (!res.ok) throw new Error('TTS failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        audioRef.current.onended = () => setPlaying(null)
      }
    } catch {
      setPlaying(null)
    }
  }, [language, selectedLesson, playing])

  const injectChar = (char: string) => {
    const el = document.getElementById('challenge-input') as HTMLInputElement
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const newVal = el.value.slice(0, start) + char + el.value.slice(end)
    setUserInput(newVal)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + char.length, start + char.length)
    }, 0)
  }

  const checkAnswer = (idx: number) => {
    if (!selectedLesson) return
    const challenge = selectedLesson.challenge[idx]
    const correct = userInput.trim().toLowerCase().includes(
      challenge.answer.toLowerCase().slice(0, 10)
    ) || challenge.answer.toLowerCase().includes(userInput.trim().toLowerCase().slice(0, 10))
    setChallengeResults(prev => ({ ...prev, [idx]: correct }))
  }

  if (!language) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Language not found.</p>
          <Link href="/language" className="text-[#c9a84c] underline">Back to languages</Link>
        </div>
      </div>
    )
  }

  const lesson = selectedLesson

  const TABS: { key: Tab; label: string }[] = [
    { key: 'vocab', label: 'Vocabulary' },
    { key: 'grammar', label: 'Grammar' },
    { key: 'dialogue', label: 'Dialogue' },
    { key: 'challenge', label: 'Challenge' },
    ...(language.specialChars.length > 0 ? [{ key: 'chars' as Tab, label: 'Special Chars' }] : []),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <audio ref={audioRef} />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-5xl mx-auto p-4 md:p-6">

            {/* Back + Header */}
            <div className="flex items-center gap-3 mb-6">
              <Link href="/language" className="text-neutral-600 hover:text-white transition-colors">
                <ArrowLeft size={16} />
              </Link>
              <span className="text-3xl">{language.flag}</span>
              <div>
                <h1 className="text-white font-bold text-xl leading-none">{language.name}</h1>
                <p className="text-neutral-500 text-xs mt-0.5">{language.nativeName} · {language.script}</p>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Sidebar: level picker */}
              <div className="hidden md:flex flex-col gap-1 w-44 flex-shrink-0">
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">Levels</p>
                {language.lessons.map(l => (
                  <button
                    key={l.level}
                    onClick={() => { setSelectedLesson(l); setActiveTab('vocab'); setFlippedCards(new Set()); setChallengeResults({}); setCurrentChallenge(0); setUserInput('') }}
                    className={`text-left px-3 py-2.5 rounded-lg text-xs transition-all border ${
                      selectedLesson?.level === l.level
                        ? 'bg-[#c9a84c] text-[#0a0a0a] font-semibold border-[#c9a84c]'
                        : 'text-neutral-500 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold">{l.level}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{l.levelLabel}</div>
                  </button>
                ))}
              </div>

              {/* Main content */}
              {lesson ? (
                <div className="flex-1 min-w-0">
                  {/* Lesson header */}
                  <div className="bg-[#111] border border-neutral-800 rounded-xl p-5 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex gap-2 mb-2">
                          <span className="text-[10px] bg-[#c9a84c] text-[#0a0a0a] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            {lesson.level}
                          </span>
                          <span className="text-[10px] text-neutral-500 border border-neutral-700 px-2 py-0.5 rounded">
                            {lesson.duration}
                          </span>
                          <span className="text-[10px] text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-0.5 rounded">
                            +{lesson.xp} XP
                          </span>
                        </div>
                        <h2 className="text-white font-bold text-lg">{lesson.title}</h2>
                        <p className="text-neutral-400 text-sm mt-1">{lesson.subtitle}</p>
                      </div>
                    </div>

                    {/* Mobile level selector */}
                    <div className="md:hidden flex gap-2 flex-wrap">
                      {language.lessons.map(l => (
                        <button
                          key={l.level}
                          onClick={() => { setSelectedLesson(l); setActiveTab('vocab'); setFlippedCards(new Set()); setChallengeResults({}); setCurrentChallenge(0); setUserInput('') }}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                            selectedLesson?.level === l.level
                              ? 'bg-[#c9a84c] text-[#0a0a0a] border-[#c9a84c]'
                              : 'text-neutral-500 border-neutral-700'
                          }`}
                        >
                          {l.level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 mb-4 bg-[#111] border border-neutral-800 rounded-lg p-1 overflow-x-auto">
                    {TABS.map(t => (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === t.key
                            ? 'bg-[#c9a84c] text-[#0a0a0a]'
                            : 'text-neutral-500 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* VOCAB TAB */}
                  {activeTab === 'vocab' && (
                    <div className="space-y-3">
                      {lesson.vocab.map((item, i) => (
                        <div key={i} className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setFlippedCards(prev => {
                              const next = new Set(prev)
                              next.has(i) ? next.delete(i) : next.add(i)
                              return next
                            })}
                            className="w-full text-left p-5"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-2xl font-bold text-white">{item.word}</span>
                                  <button
                                    onClick={e => { e.stopPropagation(); speak(item.audioText, `vocab-${i}`) }}
                                    className="text-[#c9a84c] hover:text-white transition-colors"
                                  >
                                    {playing === `vocab-${i}` ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                                  </button>
                                </div>
                                <p className="text-neutral-500 text-sm italic mb-1">{item.pronunciation}</p>
                                <p className="text-[#c9a84c] text-sm font-medium">{item.meaning}</p>
                              </div>
                              {flippedCards.has(i) ? <ChevronDown size={16} className="text-neutral-600 flex-shrink-0 mt-1" /> : <ChevronRight size={16} className="text-neutral-600 flex-shrink-0 mt-1" />}
                            </div>
                          </button>

                          {flippedCards.has(i) && (
                            <div className="px-5 pb-5 border-t border-neutral-800 pt-4 space-y-3">
                              <div className="bg-[#0a0a0a] rounded-lg p-3">
                                <p className="text-[10px] text-neutral-600 uppercase tracking-wide mb-1">Scenario</p>
                                <p className="text-neutral-300 text-sm">{item.scenario}</p>
                              </div>
                              <div className="bg-[#0a0a0a] rounded-lg p-3">
                                <p className="text-[10px] text-neutral-600 uppercase tracking-wide mb-1">Example</p>
                                <div className="flex items-start gap-2">
                                  <p className="text-white text-sm flex-1">{item.exampleSentence}</p>
                                  <button
                                    onClick={() => speak(item.audioText, `example-${i}`)}
                                    className="text-[#c9a84c] hover:text-white transition-colors flex-shrink-0"
                                  >
                                    {playing === `example-${i}` ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                                  </button>
                                </div>
                                <p className="text-neutral-500 text-sm mt-1 italic">{item.exampleTranslation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* GRAMMAR TAB */}
                  {activeTab === 'grammar' && (
                    <div className="space-y-4">
                      {lesson.grammar.map((g, i) => (
                        <div key={i} className="bg-[#111] border border-neutral-800 rounded-xl p-5">
                          <h3 className="text-[#c9a84c] font-semibold text-base mb-2">{g.rule}</h3>
                          <p className="text-neutral-300 text-sm mb-4 leading-relaxed">{g.explanation}</p>
                          <div className="space-y-2">
                            {g.examples.map((ex, j) => (
                              <div key={j} className="bg-[#0a0a0a] rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <p className="text-white text-sm flex-1">{ex.target}</p>
                                  <button
                                    onClick={() => speak(ex.target, `grammar-${i}-${j}`)}
                                    className="text-neutral-600 hover:text-[#c9a84c] transition-colors"
                                  >
                                    {playing === `grammar-${i}-${j}` ? <Loader2 size={13} className="animate-spin" /> : <Volume2 size={13} />}
                                  </button>
                                </div>
                                <p className="text-neutral-500 text-xs mt-1">{ex.translation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DIALOGUE TAB */}
                  {activeTab === 'dialogue' && (
                    <div className="space-y-3">
                      <div className="text-xs text-neutral-600 mb-4">
                        Read each line · press the speaker to hear it · practice the rhythm
                      </div>
                      {lesson.dialogueLines.map((line, i) => (
                        <div key={i} className={`flex gap-3 ${line.speaker === 'You' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl p-4 ${
                            line.speaker === 'You'
                              ? 'bg-[#c9a84c] text-[#0a0a0a]'
                              : 'bg-[#111] border border-neutral-800 text-white'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wide ${
                                line.speaker === 'You' ? 'text-[#0a0a0a]/60' : 'text-neutral-600'
                              }`}>{line.speaker}</span>
                              <button
                                onClick={() => speak(line.text, `dialog-${i}`)}
                                className={`transition-colors ${
                                  line.speaker === 'You'
                                    ? 'text-[#0a0a0a]/60 hover:text-[#0a0a0a]'
                                    : 'text-neutral-600 hover:text-[#c9a84c]'
                                }`}
                              >
                                {playing === `dialog-${i}` ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                              </button>
                            </div>
                            <p className="text-sm font-medium">{line.text}</p>
                            {line.translation && (
                              <p className={`text-xs mt-1 italic ${
                                line.speaker === 'You' ? 'text-[#0a0a0a]/50' : 'text-neutral-500'
                              }`}>{line.translation}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          lesson.dialogueLines.forEach((line, i) => {
                            setTimeout(() => speak(line.text, `dialog-full-${i}`), i * 2500)
                          })
                        }}
                        className="w-full mt-4 border border-[#c9a84c] text-[#c9a84c] rounded-lg py-2.5 text-sm font-medium hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all"
                      >
                        ▶ Play Full Dialogue
                      </button>
                    </div>
                  )}

                  {/* CHALLENGE TAB */}
                  {activeTab === 'challenge' && (
                    <div>
                      {lesson.challenge.map((ch, i) => (
                        <div key={i} className={`bg-[#111] border border-neutral-800 rounded-xl p-5 mb-4 ${i !== currentChallenge ? 'opacity-50' : ''}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            <p className="text-white text-sm font-medium">{ch.prompt}</p>
                          </div>

                          {i === currentChallenge && (
                            <>
                              {language.specialChars.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {language.specialChars.map((sc, si) => (
                                    <button
                                      key={si}
                                      onClick={() => injectChar(sc.char)}
                                      title={sc.name + ' — ' + sc.tip}
                                      className="bg-[#0a0a0a] border border-neutral-700 text-white text-sm px-2 py-1.5 rounded hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all font-mono"
                                    >
                                      {sc.char}
                                    </button>
                                  ))}
                                </div>
                              )}

                              <textarea
                                id="challenge-input"
                                value={userInput}
                                onChange={e => setUserInput(e.target.value)}
                                placeholder="Type your answer here..."
                                className="w-full bg-[#0a0a0a] border border-neutral-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] resize-none mb-3 placeholder:text-neutral-700"
                                rows={3}
                                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) checkAnswer(i) }}
                              />

                              <div className="flex gap-2 flex-wrap">
                                <button
                                  onClick={() => checkAnswer(i)}
                                  className="bg-[#c9a84c] text-[#0a0a0a] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4b55e] transition-colors"
                                >
                                  Check Answer
                                </button>
                                <button
                                  onClick={() => setShowHint(prev => { const n = new Set(prev); n.add(i); return n })}
                                  className="border border-neutral-700 text-neutral-500 px-4 py-2 rounded-lg text-sm hover:text-white hover:border-neutral-500 transition-colors"
                                >
                                  Hint
                                </button>
                                {challengeResults[i] !== undefined && (
                                  <button
                                    onClick={() => { setCurrentChallenge(i + 1); setUserInput('') }}
                                    className="border border-neutral-700 text-neutral-400 px-4 py-2 rounded-lg text-sm hover:text-white transition-colors ml-auto"
                                  >
                                    Next →
                                  </button>
                                )}
                              </div>

                              {showHint.has(i) && (
                                <div className="mt-3 bg-[#1a1a0a] border border-[#c9a84c]/30 rounded-lg p-3">
                                  <p className="text-[#c9a84c] text-xs">💡 {ch.hint}</p>
                                </div>
                              )}

                              {challengeResults[i] !== undefined && (
                                <div className={`mt-3 rounded-lg p-4 flex items-start gap-3 ${
                                  challengeResults[i]
                                    ? 'bg-green-900/20 border border-green-800'
                                    : 'bg-red-900/20 border border-red-800'
                                }`}>
                                  {challengeResults[i]
                                    ? <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                                    : <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                  }
                                  <div>
                                    <p className={`text-sm font-semibold ${challengeResults[i] ? 'text-green-400' : 'text-red-400'}`}>
                                      {challengeResults[i] ? 'Correct! Great work.' : "Not quite — here's the answer:"}
                                    </p>
                                    {!challengeResults[i] && (
                                      <p className="text-neutral-300 text-sm mt-1">{ch.answer}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {challengeResults[i] !== undefined && i !== currentChallenge && (
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle size={14} className="text-green-500" />
                              <p className="text-neutral-500 text-xs">Completed</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {currentChallenge >= lesson.challenge.length && (
                        <div className="bg-[#c9a84c]/10 border border-[#c9a84c] rounded-xl p-6 text-center">
                          <div className="text-3xl mb-2">🎉</div>
                          <p className="text-[#c9a84c] font-bold text-lg mb-1">Level Complete!</p>
                          <p className="text-neutral-400 text-sm">+{lesson.xp} XP earned</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SPECIAL CHARS TAB */}
                  {activeTab === 'chars' && language.specialChars.length > 0 && (
                    <div>
                      <p className="text-neutral-500 text-sm mb-4">
                        Click any character to hear it pronounced. Use these when typing exercises.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {language.specialChars.map((sc, i) => (
                          <button
                            key={i}
                            onClick={() => speak(sc.char, `char-${i}`)}
                            className="bg-[#111] border border-neutral-800 rounded-xl p-4 text-left hover:border-[#c9a84c] transition-all group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl text-white font-mono group-hover:text-[#c9a84c] transition-colors">{sc.char}</span>
                              {playing === `char-${i}` && <Loader2 size={14} className="text-[#c9a84c] animate-spin" />}
                            </div>
                            <p className="text-neutral-400 text-xs font-medium mb-1">{sc.name}</p>
                            <p className="text-neutral-600 text-[11px]">{sc.tip}</p>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6">
                        <p className="text-neutral-600 text-xs mb-3">Typing practice:</p>
                        <textarea
                          value={userInput}
                          onChange={e => setUserInput(e.target.value)}
                          placeholder="Click characters above to insert them, or type directly..."
                          className="w-full bg-[#0a0a0a] border border-neutral-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] resize-none placeholder:text-neutral-700"
                          rows={4}
                          id="challenge-input"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {language.specialChars.map((sc, si) => (
                            <button
                              key={si}
                              onClick={() => injectChar(sc.char)}
                              className="bg-[#0a0a0a] border border-neutral-700 text-white text-sm px-2 py-1.5 rounded hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all font-mono"
                            >
                              {sc.char}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-neutral-600">Select a level to begin.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
