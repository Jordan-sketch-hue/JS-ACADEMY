'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { LANGUAGES, LEVEL_ORDER, type LangCode, type ProfLevel } from '@/lib/language-data'

const SCRIPT_LABELS: Record<string, string> = {
  zh: 'Simplified', ja: 'Hiragana', ko: 'Hangul', ar: 'Arabic', ru: 'Cyrillic',
  hi: 'Devanagari', es: 'Latin', fr: 'Latin', de: 'Latin', nl: 'Latin',
  pt: 'Latin', it: 'Latin', sw: 'Latin', en: 'Latin',
}

const TAGLINES: Record<string, string> = {
  zh: '1.1 billion speakers. The language of the future.',
  es: '500M speakers across 21 countries.',
  fr: 'Diplomacy, fashion & 300 million people.',
  de: 'Engineering, philosophy & precision.',
  ru: 'Tolstoy, space & geopolitics.',
  nl: 'Closest major language to English.',
  ja: 'Top-5 economy. Tech. Culture.',
  ar: '422M speakers across 22 countries.',
  pt: 'Brazil, Portugal, Angola & beyond.',
  it: 'Fashion, food, finance & beauty.',
  ko: 'K-culture, Samsung & Hyundai.',
  hi: '600M speakers. Fastest-growing economy.',
  sw: 'East Africa\'s lingua franca.',
  en: 'Global business, science & internet.',
}

// Mon=1 Tue=2 Wed=3 Thu=4 Fri=5
const DAY_FOCUS: Record<number, { label: string; langs: LangCode[] }> = {
  1: { label: 'Monday — Romance', langs: ['es', 'fr', 'pt', 'it'] },
  2: { label: 'Tuesday — Asian', langs: ['zh', 'ja', 'ko', 'hi'] },
  3: { label: 'Wednesday — Germanic', langs: ['de', 'nl', 'en'] },
  4: { label: 'Thursday — Global Scripts', langs: ['ar', 'ru', 'sw'] },
  5: { label: 'Friday — Open session', langs: ['zh', 'es', 'fr', 'de', 'ru', 'nl', 'ja', 'ar', 'pt', 'it', 'ko', 'hi', 'sw', 'en'] },
}

const LEVEL_COLORS: Record<ProfLevel, string> = {
  A1: '#6b7280', A2: '#3b82f6', B1: '#8b5cf6',
  B2: '#d97706', C1: '#dc2626', C2: '#059669', PhD: '#d4376e',
}

function getLevels(): Record<string, ProfLevel> {
  try { return JSON.parse(localStorage.getItem('lang_levels') || '{}') } catch { return {} }
}
function setLevel(code: string, level: ProfLevel) {
  const all = getLevels()
  all[code] = level
  localStorage.setItem('lang_levels', JSON.stringify(all))
}

export default function LanguageHub() {
  const [userLevels, setUserLevels] = useState<Record<string, ProfLevel>>({})
  const dow = (new Date().getDay() || 7)
  const todayFocus = DAY_FOCUS[dow] || DAY_FOCUS[5]
  const todayLangs = LANGUAGES.filter(l => todayFocus.langs.includes(l.code as LangCode))
  const otherLangs = LANGUAGES.filter(l => !todayFocus.langs.includes(l.code as LangCode))

  useEffect(() => { setUserLevels(getLevels()) }, [])

  const bump = (code: string, current: ProfLevel) => {
    const idx = LEVEL_ORDER.indexOf(current)
    if (idx < LEVEL_ORDER.length - 1) {
      const next = LEVEL_ORDER[idx + 1]
      setLevel(code, next)
      setUserLevels(getLevels())
    }
  }

  function LangCard({ lang, highlight }: { lang: typeof LANGUAGES[0]; highlight: boolean }) {
    const currentLevel = userLevels[lang.code] || 'A1'
    const levelIdx = LEVEL_ORDER.indexOf(currentLevel)
    const color = LEVEL_COLORS[currentLevel]

    return (
      <div className={`bg-white rounded-xl border transition-all ${highlight ? 'border-[#0a0a0a] shadow-sm' : 'border-neutral-200'}`}>
        {/* Top */}
        <Link href={`/language/${lang.code}?level=${currentLevel}`} className="block p-4 hover:bg-neutral-50 rounded-t-xl transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <div className="text-[14px] font-bold text-[#0a0a0a]">{lang.name}</div>
                <div className="text-[10px] text-neutral-400">{lang.nativeName}</div>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-neutral-400 tracking-[0.1em] uppercase bg-neutral-100 px-2 py-0.5 rounded-full flex-shrink-0">
              {SCRIPT_LABELS[lang.code]}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-snug mb-3">{TAGLINES[lang.code]}</p>

          {/* Level progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-0.5">
              {LEVEL_ORDER.map((l, i) => (
                <div
                  key={l}
                  className="flex-1 h-1.5 rounded-full transition-colors"
                  style={{ background: i <= levelIdx ? color : '#e5e7eb' }}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>{currentLevel}</span>
          </div>
        </Link>

        {/* Level controls */}
        <div className="px-4 pb-3 flex items-center gap-2 border-t border-neutral-100 pt-2">
          <span className="text-[10px] text-neutral-400">Your level:</span>
          <div className="flex gap-1 flex-wrap">
            {LEVEL_ORDER.map(l => (
              <button
                key={l}
                onClick={() => { setLevel(lang.code, l); setUserLevels(getLevels()) }}
                className={`text-[9px] px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  currentLevel === l ? 'text-white' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                }`}
                style={currentLevel === l ? { background: color } : {}}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d4376e] mb-1">Language Lab</div>
          <h1 className="text-[22px] font-bold text-[#0a0a0a]">14 Languages · Basic → PhD</h1>
          <p className="text-[12px] text-neutral-500">Azure Neural voices · Vocabulary · Grammar · Drills · Quiz</p>
        </div>

        {/* HOW IT WORKS — crystal clear */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6">
          <div className="text-[10px] font-bold text-[#d4376e] tracking-[0.2em] uppercase mb-3">How this works</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { n: '1', title: 'Pick ONE language', body: 'Focus on today\'s group (shown below). Don\'t jump between languages in one session.' },
              { n: '2', title: 'Work your current level', body: 'Start at A1. Do vocab, grammar, drills, quiz. When the quiz feels easy — bump up to A2. That could take weeks.' },
              { n: '3', title: 'Last course every day', body: 'Do Language Lab after everything else, before trading. 20–30 mins. Every single day.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d4376e] flex items-center justify-center text-[11px] font-bold text-white">{n}</span>
                <div>
                  <div className="text-[12px] font-semibold text-white mb-0.5">{title}</div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's focus */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-0.5">Today's focus</div>
            <div className="text-[14px] font-bold text-[#0a0a0a]">{todayFocus.label}</div>
          </div>
          <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded-lg font-medium">Pick 1 — do it fully</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {todayLangs.map(lang => <LangCard key={lang.code} lang={lang} highlight />)}
        </div>

        {/* All languages */}
        {otherLangs.length > 0 && (
          <>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-3">All languages</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherLangs.map(lang => <LangCard key={lang.code} lang={lang} highlight={false} />)}
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}
