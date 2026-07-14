'use client'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { LANGUAGES } from '@/lib/language-data'
import { Globe2, Star } from 'lucide-react'

const SCRIPT_LABELS: Record<string, string> = {
  zh: 'Simplified', ja: 'Hiragana', ko: 'Hangul', ar: 'Arabic', ru: 'Cyrillic',
  hi: 'Devanagari', es: 'Latin', fr: 'Latin', de: 'Latin', nl: 'Latin',
  pt: 'Latin', it: 'Latin', sw: 'Latin', en: 'Latin',
}

const TAGLINES: Record<string, string> = {
  zh: '1.1 billion speakers. The language of the future.',
  es: '500+ million speakers. 21 countries. One language, infinite worlds.',
  fr: 'The language of diplomacy, fashion & 300 million people.',
  de: 'The language of engineering, philosophy & precision.',
  ru: 'The language of Tolstoy, space & geopolitics.',
  nl: '23 million speakers. The closest major language to English. Learn faster than you think.',
  ja: 'Top-5 economy. Anime. Technology. Respect built into every sentence.',
  ar: '422 million speakers. 22 countries. The sacred language of 1.8 billion Muslims.',
  pt: 'Brazil, Portugal, Angola, Cape Verde. 260 million and growing.',
  it: 'Fashion. Food. Finance. The most beautiful language on earth.',
  ko: 'K-culture, Samsung, Hyundai, and the world\'s most logical alphabet.',
  hi: '600 million speakers. India is the world\'s fastest growing major economy.',
  sw: 'East Africa\'s lingua franca. 200 million speakers. Easiest African language to start.',
  en: 'The language of global business, science & the internet. Master it at PhD level.',
}

export default function LanguageHub() {
  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-1 flex items-center gap-2">
          <Globe2 size={14} className="text-[#d4376e]" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#d4376e]">Language Lab</span>
        </div>
        <h1 className="text-[22px] font-bold text-[#0a0a0a] mb-0.5">Language Studies</h1>
        <p className="text-[12px] text-neutral-500 mb-1">14 major world languages · Basic → PhD · Real Azure Neural voices</p>
        <p className="text-[12px] font-medium text-[#d4376e] mb-5 flex items-center gap-1.5">
          <Star size={11} fill="currentColor" />
          Your last course each day — before trading, after everything else
        </p>

        {/* Language grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LANGUAGES.map(lang => (
            <Link
              key={lang.code}
              href={`/language/${lang.code}`}
              className="group bg-white border border-neutral-200 rounded-xl p-4 hover:border-[#d4376e] hover:shadow-md transition-all"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-[28px] font-black text-neutral-200 leading-none tracking-tight">
                  {lang.code.toUpperCase()}
                </span>
                <span className="text-[9px] font-semibold text-neutral-400 tracking-[0.12em] uppercase bg-neutral-100 px-2 py-0.5 rounded-full">
                  {SCRIPT_LABELS[lang.code]}
                </span>
              </div>

              {/* Name */}
              <div className="text-[15px] font-bold text-[#0a0a0a] leading-tight">{lang.name}</div>
              <div className="text-[11px] text-neutral-400 mb-2">{lang.nativeName}</div>

              {/* Tagline */}
              <p className="text-[11px] text-neutral-600 leading-snug mb-3">{TAGLINES[lang.code]}</p>

              {/* Level dots */}
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  {lang.levels.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-neutral-200 group-hover:bg-[#f5b8cc] transition-colors" />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400">{lang.levels.length} levels</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Curriculum note */}
        <div className="mt-6 bg-[#0a0a0a] rounded-xl p-4">
          <div className="text-[10px] font-semibold text-[#d4376e] tracking-[0.2em] uppercase mb-2">How the curriculum works</div>
          <p className="text-[12px] text-neutral-300 leading-relaxed">
            Each language runs <strong className="text-white">A1 → A2 → B1 → B2 → C1 → C2 → PhD</strong> independently.
            Pick a language, pick your level, drill it daily. You are not expected to finish all 7 levels in one week —
            you build up over months. Start every language at A1. Graduate a level when the quiz feels easy.
          </p>
        </div>
      </div>
    </Shell>
  )
}
