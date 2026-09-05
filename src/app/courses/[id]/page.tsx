'use client'
import { use, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { getCourse, COURSES, TRACKS, LEVEL_COLORS } from '@/lib/courses'
import { completeCourse, isCourseCompleted, getWatchProgress, saveWatchProgress, markDailyActive } from '@/lib/progress'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, ChevronRight, BookOpen, Zap } from 'lucide-react'
import AudiobookPlayer, { type AudiobookPlayerHandle, type PlayingRange } from '@/components/AudiobookPlayer'

type Phase = 'reading' | 'terms' | 'quiz' | 'done'

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const course = getCourse(id)
  const router = useRouter()
  const courseIdx = COURSES.findIndex(c => c.id === id)
  const prevCourse = courseIdx > 0 ? COURSES[courseIdx - 1] : null
  const nextCourse = courseIdx < COURSES.length - 1 ? COURSES[courseIdx + 1] : null
  const [phase, setPhase] = useState<Phase>('reading')
  const [readPct, setReadPct] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [playingRange, setPlayingRange] = useState<PlayingRange | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<AudiobookPlayerHandle>(null)
  // Starts false (matching what the server always renders, since it has no
  // localStorage) and is filled in client-side after mount — computing this
  // synchronously from localStorage during render caused a hydration
  // mismatch on the "Already completed" badge for anyone who'd actually
  // completed the course.
  const [alreadyDone, setAlreadyDone] = useState(false)

  const handleWordClick = useCallback((offset: number) => {
    playerRef.current?.seekToOffset(offset)
  }, [])

  useEffect(() => {
    if (course) {
      const saved = getWatchProgress(course.id)
      setReadPct(saved)
      setAlreadyDone(isCourseCompleted(course.id))
      markDailyActive()
    }
  }, [course])

  // Deep link support: /courses/[id]?phase=terms jumps straight to the key-terms
  // review (used by the Notes tab's "Study terms" shortcut).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search)
    if (sp.get('phase') === 'terms') setPhase('terms')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Reset the "currently reading" highlight whenever we land on a different module.
  useEffect(() => { setPlayingRange(null) }, [id])

  // Keep the narrated paragraph in view while listening — but only nudge the
  // scroll when the highlight moves to a genuinely new block that's actually
  // out of view. playingRange ticks every ~400ms during playback; re-running
  // scrollIntoView on every tick would fight anyone trying to scroll manually.
  const lastScrolledElRef = useRef<Element | null>(null)
  useEffect(() => {
    if (!playingRange) { lastScrolledElRef.current = null; return }
    const container = contentRef.current
    const el = container?.querySelector('.reading-now')
    if (!container || !el || el === lastScrolledElRef.current) return
    lastScrolledElRef.current = el
    const elRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const visible = elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom
    if (!visible) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [playingRange])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const onScroll = () => {
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
      setReadPct(p => {
        const next = Math.max(p, pct)
        if (course && next > p) saveWatchProgress(course.id, next)
        return next
      })
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [course])

  if (!course) {
    return (
      <Shell>
        <div className="p-8 text-neutral-400">Course not found. <Link href="/" className="underline">Back to dashboard</Link></div>
      </Shell>
    )
  }

  if (course.content === 'LANGUAGE_LAB_REDIRECT') {
    router.replace('/language')
    return null
  }

  const track = TRACKS[course.track]
  const levelColor = LEVEL_COLORS[course.level]

  function startQuiz() {
    setQuizAnswers(new Array(course!.quiz.length).fill(null))
    setPhase('quiz')
  }

  function submitQuiz() {
    const score = quizAnswers.filter((a, i) => a === course!.quiz[i].correct).length
    setSubmitted(true)
    if (!alreadyDone) {
      const p = completeCourse(course!.id, score, course!.xp)
      const bonus = score >= Math.ceil(course!.quiz.length * 0.67) ? 50 : 0
      setXpEarned(course!.xp + bonus)
    }
  }

  function finish() {
    setPhase('done')
  }

  const quizScore = quizAnswers.filter((a, i) => a === course.quiz[i].correct).length
  const quizPassed = submitted && quizScore >= Math.ceil(course.quiz.length * 0.67)

  return (
    <Shell>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="bg-white border-b border-neutral-100 px-5 py-3 flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-ink">
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <div className="h-3 w-px bg-neutral-200" />
          <span className="text-[12px] text-neutral-400" style={{ color: track.color }}>{track.label}</span>
          <div className="h-3 w-px bg-neutral-200" />
          <span className="text-[12px] text-neutral-600 truncate max-w-[140px] md:max-w-xs">{course.title}</span>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Clock size={12} />
              {course.duration} min
            </div>
            <span className="text-[9px] font-medium px-2 py-0.5 rounded tracking-wide uppercase" style={{ color: levelColor.text, background: levelColor.bg }}>
              {course.level}
            </span>
            <span className="text-[11px] text-gold font-medium">+{course.xp} XP</span>
            {prevCourse && (
              <Link href={`/courses/${prevCourse.id}`} title={prevCourse.title}
                className="w-7 h-7 border border-neutral-200 rounded-full flex items-center justify-center hover:border-neutral-400 transition-colors">
                <ArrowLeft size={11} className="text-neutral-500" />
              </Link>
            )}
            {nextCourse && (
              <Link href={`/courses/${nextCourse.id}`} title={nextCourse.title}
                className="w-7 h-7 border border-neutral-200 rounded-full flex items-center justify-center hover:border-neutral-400 transition-colors">
                <ArrowRight size={11} className="text-neutral-500" />
              </Link>
            )}
          </div>
        </div>

        <div className="bg-neutral-100 h-1 flex-shrink-0">
          <div className="h-full bg-gold transition-all duration-300" style={{ width: `${readPct}%` }} />
        </div>

        {phase === 'done' ? (
          <div className="flex-1 flex items-center justify-center bg-ink">
            <div className="text-center max-w-sm">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <div className="text-white text-xl font-medium mb-2">Course complete</div>
              <div className="text-neutral-400 text-[13px] mb-6">+{xpEarned} XP earned</div>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/" className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded text-[13px] hover:border-neutral-500">
                  Dashboard
                </Link>
                {prevCourse && (
                  <Link href={`/courses/${prevCourse.id}`} className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded text-[13px] flex items-center gap-1.5 hover:border-neutral-500">
                    <ArrowLeft size={12} /> Prev
                  </Link>
                )}
                {nextCourse && (
                  <Link href={`/courses/${nextCourse.id}`} className="px-4 py-2 bg-white text-ink rounded text-[13px] font-medium flex items-center gap-1.5">
                    Next course <ArrowRight size={12} />
                  </Link>
                )}
                {!nextCourse && (
                  <button onClick={() => router.back()} className="px-4 py-2 bg-white text-ink rounded text-[13px] font-medium">
                    All courses
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : phase === 'quiz' ? (
          <div ref={contentRef} className="flex-1 overflow-auto bg-neutral-50">
            <div className="max-w-2xl mx-auto p-6">
              <div className="text-[11px] tracking-[0.15em] uppercase text-neutral-400 mb-1">Knowledge check</div>
              <div className="text-lg font-medium text-ink mb-6">{course.title}</div>
              {course.quiz.map((q, qi) => (
                <div key={qi} className="bg-white border border-neutral-100 rounded-lg p-5 mb-4">
                  <div className="text-[13px] font-medium text-ink mb-4 leading-snug">Q{qi + 1}. {q.q}</div>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = quizAnswers[qi] === oi
                      const isCorrect = oi === q.correct
                      let cls = 'border border-neutral-200 text-neutral-600'
                      if (submitted) {
                        if (isCorrect) cls = 'border-2 border-green-400 bg-green-50 text-green-800'
                        else if (selected && !isCorrect) cls = 'border-2 border-red-400 bg-red-50 text-red-700'
                        else cls = 'border border-neutral-100 text-neutral-400'
                      } else if (selected) {
                        cls = 'border-2 border-ink bg-neutral-50 text-ink'
                      }
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() => setQuizAnswers(prev => { const n = [...prev]; n[qi] = oi; return n })}
                          className={`w-full text-left px-4 py-3 rounded text-[12px] leading-snug transition-all ${cls}`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {submitted && (
                    <div className="mt-3 p-3 bg-neutral-50 rounded text-[11px] text-neutral-600 leading-relaxed border-l-2 border-gold">
                      <strong className="text-ink">Explanation: </strong>{q.explanation}
                    </div>
                  )}
                </div>
              ))}
              {!submitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={quizAnswers.some(a => a === null)}
                  className="w-full py-3 bg-ink text-white rounded font-medium text-[13px] disabled:opacity-40 mt-2"
                >
                  Submit answers
                </button>
              ) : (
                <div className="bg-white border border-neutral-100 rounded-lg p-5 text-center mt-2">
                  <div className={`text-2xl font-medium mb-1 ${quizPassed ? 'text-green-600' : 'text-red-500'}`}>
                    {quizScore}/{course.quiz.length} correct
                  </div>
                  <div className="text-[12px] text-neutral-400 mb-4">
                    {quizPassed ? `+${course.xp + 50} XP earned (including +50 quiz bonus)` : `+${course.xp} XP earned`}
                  </div>
                  <button onClick={finish} className="px-6 py-2.5 bg-ink text-white rounded text-[13px] font-medium">
                    Complete course <ChevronRight size={14} className="inline" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : phase === 'terms' ? (
          <div ref={contentRef} className="flex-1 overflow-auto bg-neutral-50">
            <div className="max-w-2xl mx-auto p-6">
              <div className="text-[11px] tracking-[0.15em] uppercase text-neutral-400 mb-1">Key terminology</div>
              <div className="text-lg font-medium text-ink mb-6">{course.title}</div>
              <div className="space-y-3 mb-6">
                {course.keyTerms.map(({ term, definition }) => (
                  <div key={term} className="bg-white border border-neutral-100 rounded-lg p-4">
                    <div className="text-[12px] font-medium text-ink mb-1.5 flex items-center gap-2">
                      <BookOpen size={12} className="text-gold" />
                      {term}
                    </div>
                    <div className="text-[12px] text-neutral-500 leading-relaxed">{definition}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={startQuiz}
                className="w-full py-3 bg-ink text-white rounded font-medium text-[13px] flex items-center justify-center gap-2"
              >
                <Zap size={14} />
                Take knowledge check
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Scrollable content */}
            <div ref={contentRef} className="flex-1 overflow-auto bg-white">
              <div className="max-w-2xl mx-auto px-5 md:px-8 py-5 md:py-6 pb-32 md:pb-6">
                <div className="mb-5">
                  <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: track.color }}>
                    {track.label} · {course.level}
                  </div>
                  <h1 className="text-[18px] md:text-xl font-medium text-ink leading-snug mb-1">{course.title}</h1>
                  <div className="text-[13px] text-neutral-500 mb-3">{course.subtitle}</div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1"><Clock size={11} />{course.duration} min read</span>
                    <span className="text-gold">+{course.xp} XP on completion</span>
                    {course.certArea && <span>Cert: {course.certArea}</span>}
                  </div>
                </div>
                {course.content && course.content !== 'LANGUAGE_LAB_REDIRECT' && (
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-1 -mx-5 md:-mx-8 px-5 md:px-8">
                    <AudiobookPlayer
                      ref={playerRef}
                      text={course.content}
                      courseTitle={course.title}
                      objective={course.subtitle}
                      courseId={course.id}
                      keyTerms={course.keyTerms}
                      onRangeChange={setPlayingRange}
                    />
                  </div>
                )}
                <div className="border-t border-neutral-100 pt-5">
                  <CourseProse content={course.content} playingRange={playingRange} onWordClick={handleWordClick} />
                </div>
              </div>
            </div>

            {/* Desktop sidebar — hidden on mobile */}
            <div className="hidden md:flex w-56 border-l border-neutral-100 bg-neutral-50 overflow-auto flex-shrink-0 flex-col">
              <div className="p-4">
                <div className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-3">Reading progress</div>
                <div className="bg-neutral-200 rounded h-1.5 overflow-hidden mb-1">
                  <div className="h-full bg-gold rounded transition-all" style={{ width: `${readPct}%` }} />
                </div>
                <div className="text-[10px] text-neutral-400 mb-5">{readPct}% read</div>
                <button onClick={() => setPhase('terms')} className="w-full py-2 bg-ink text-white text-[11px] rounded mb-2 font-medium">
                  Key terms →
                </button>
                <button onClick={startQuiz} className="w-full py-2 border border-neutral-200 text-neutral-600 text-[11px] rounded hover:border-ink">
                  Skip to quiz
                </button>
                {alreadyDone && (
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] text-green-600">
                    <CheckCircle size={12} /> Already completed
                  </div>
                )}
                <div className="mt-5 border-t border-neutral-100 pt-4">
                  <div className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-2">In this module</div>
                  {course.keyTerms.slice(0, 4).map(t => (
                    <div key={t.term} className="text-[10px] text-neutral-500 mb-1.5 leading-snug">{t.term}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile sticky action bar */}
            <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-3 z-20">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-neutral-100 rounded h-1.5 overflow-hidden">
                  <div className="h-full bg-gold rounded transition-all" style={{ width: `${readPct}%` }} />
                </div>
                <span className="text-[10px] text-neutral-400 flex-shrink-0">{readPct}%</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPhase('terms')} className="flex-1 py-2.5 bg-ink text-white text-[12px] rounded font-medium">
                  Key terms →
                </button>
                <button onClick={startQuiz} className="flex-1 py-2.5 border border-neutral-200 text-neutral-600 text-[12px] rounded">
                  Skip to quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

interface ProseCtx {
  playingRange: PlayingRange | null
  onWordClick: (offset: number) => void
}

// Renders course markdown as interactive prose: every word is a clickable span
// carrying its absolute character offset into the raw content, so a click can
// tell AudiobookPlayer exactly where to restart narration. Block elements that
// fall inside the currently-narrating range get a `reading-now` highlight.
function CourseProse({ content, playingRange, onWordClick }: { content: string; playingRange: PlayingRange | null; onWordClick: (offset: number) => void }) {
  const body = useMemo(
    () => renderMarkdown(content, { playingRange, onWordClick }),
    // playingRange changes rapidly in identity but only needs to trigger a
    // rebuild when the actual span moves — comparing the tuple keeps this cheap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, playingRange?.start, playingRange?.end, onWordClick]
  )
  return <div className="course-prose">{body}</div>
}

function computeLineOffsets(md: string): number[] {
  const lines = md.split('\n')
  const offsets: number[] = []
  let acc = 0
  for (const l of lines) { offsets.push(acc); acc += l.length + 1 }
  return offsets
}

function overlapsPlaying(ctx: ProseCtx, start: number, end: number): boolean {
  const r = ctx.playingRange
  return !!r && start < r.end && end > r.start
}

function renderWords(segment: string, absStart: number, keyPrefix: string, onWordClick: (offset: number) => void): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re = /\S+|\s+/g
  let m: RegExpExecArray | null
  let idx = 0
  while ((m = re.exec(segment))) {
    const token = m[0]
    if (/\S/.test(token)) {
      const abs = absStart + m.index
      out.push(
        <span key={`${keyPrefix}-${idx++}`} className="word-span" onClick={() => onWordClick(abs)}>{token}</span>
      )
    } else {
      out.push(token)
    }
  }
  return out
}

// Walks a line of inline markdown (**bold**, `code`, *italic*) tracking the
// absolute offset of every character so each resulting word span knows exactly
// where it sits in the original content string.
function renderInline(text: string, absBase: number, keyPrefix: string, ctx: ProseCtx): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let i = 0
  let seg = 0
  while (i < text.length) {
    if (text.slice(i, i + 2) === '**') {
      const end = text.indexOf('**', i + 2)
      if (end !== -1) {
        nodes.push(<strong key={`${keyPrefix}-b${seg}`}>{renderWords(text.slice(i + 2, end), absBase + i + 2, `${keyPrefix}-b${seg++}`, ctx.onWordClick)}</strong>)
        i = end + 2; continue
      }
    }
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        nodes.push(<code key={`${keyPrefix}-c${seg}`}>{renderWords(text.slice(i + 1, end), absBase + i + 1, `${keyPrefix}-c${seg++}`, ctx.onWordClick)}</code>)
        i = end + 1; continue
      }
    }
    if (text[i] === '*') {
      const end = text.indexOf('*', i + 1)
      if (end !== -1) {
        nodes.push(<em key={`${keyPrefix}-i${seg}`}>{renderWords(text.slice(i + 1, end), absBase + i + 1, `${keyPrefix}-i${seg++}`, ctx.onWordClick)}</em>)
        i = end + 1; continue
      }
    }
    let next = text.length
    for (let j = i + 1; j < text.length; j++) {
      if (text[j] === '*' || text[j] === '`') { next = j; break }
    }
    nodes.push(...renderWords(text.slice(i, next), absBase + i, `${keyPrefix}-p${seg++}`, ctx.onWordClick))
    i = next
  }
  return nodes
}

function renderMarkdown(md: string, ctx: ProseCtx) {
  const lines = md.split('\n')
  const lineOffsets = computeLineOffsets(md)
  const elements: React.ReactNode[] = []
  let i = 0
  let inCode = false
  let codeLines: string[] = []
  let inTable = false
  let tableRows: string[][] = []

  const flushTable = () => {
    if (tableRows.length < 2) { inTable = false; tableRows = []; return }
    const header = tableRows[0]
    const body = tableRows.slice(2)
    elements.push(
      <table key={`table-${i}`}>
        <thead>
          <tr>{header.map((h, hi) => <th key={hi}>{h.trim()}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell.trim()}</td>)}</tr>
          ))}
        </tbody>
      </table>
    )
    inTable = false
    tableRows = []
  }

  while (i < lines.length) {
    const line = lines[i]
    const lineStart = lineOffsets[i]

    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(<pre key={`code-${i}`}><code>{codeLines.join('\n')}</code></pre>)
        codeLines = []
        inCode = false
      } else { inCode = true }
      i++; continue
    }
    if (inCode) { codeLines.push(line); i++; continue }

    if (line.startsWith('|')) {
      inTable = true
      tableRows.push(line.split('|').filter((_, j, a) => j > 0 && j < a.length - 1))
      i++; continue
    }
    if (inTable) { flushTable() }

    if (line.startsWith('## ')) {
      const playing = overlapsPlaying(ctx, lineStart, lineStart + line.length)
      elements.push(<h2 key={i} className={playing ? 'reading-now' : undefined}>{renderInline(line.slice(3), lineStart + 3, `h${i}`, ctx)}</h2>)
    } else if (line.startsWith('### ')) {
      const playing = overlapsPlaying(ctx, lineStart, lineStart + line.length)
      elements.push(<h3 key={i} className={playing ? 'reading-now' : undefined}>{renderInline(line.slice(4), lineStart + 4, `h${i}`, ctx)}</h3>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: { text: string; start: number; lineStart: number; lineLen: number }[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push({ text: lines[i].slice(2), start: lineOffsets[i] + 2, lineStart: lineOffsets[i], lineLen: lines[i].length })
        i++
      }
      elements.push(
        <ul key={`ul-${i}`}>
          {items.map((it, ii) => {
            const playing = overlapsPlaying(ctx, it.lineStart, it.lineStart + it.lineLen)
            return <li key={ii} className={playing ? 'reading-now' : undefined}>{renderInline(it.text, it.start, `li${i}-${ii}`, ctx)}</li>
          })}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const items: { text: string; start: number; lineStart: number; lineLen: number }[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const markerLen = lines[i].match(/^\d+\.\s+/)?.[0].length ?? 3
        items.push({ text: lines[i].slice(markerLen), start: lineOffsets[i] + markerLen, lineStart: lineOffsets[i], lineLen: lines[i].length })
        i++
      }
      elements.push(
        <ol key={`ol-${i}`}>
          {items.map((it, ii) => {
            const playing = overlapsPlaying(ctx, it.lineStart, it.lineStart + it.lineLen)
            return <li key={ii} className={playing ? 'reading-now' : undefined}>{renderInline(it.text, it.start, `oli${i}-${ii}`, ctx)}</li>
          })}
        </ol>
      )
      continue
    } else if (line.trim()) {
      const playing = overlapsPlaying(ctx, lineStart, lineStart + line.length)
      elements.push(<p key={i} className={playing ? 'reading-now' : undefined}>{renderInline(line, lineStart, `p${i}`, ctx)}</p>)
    }
    i++
  }
  if (inTable) flushTable()
  return elements
}
