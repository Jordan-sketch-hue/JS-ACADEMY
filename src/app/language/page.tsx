'use client'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { LANGUAGES } from '@/lib/language-data'
import { Globe2, Mic, BookOpen, Zap } from 'lucide-react'

export default function LanguageHub() {
  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Globe2 size={18} className="text-[#d4376e]" />
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#d4376e]">Language Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0a0a0a] leading-tight">Master Every Major Language</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Basic → PhD · Azure Neural Voices · Interactive Drills · Special Characters</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Globe2, label: '14 Languages', sub: 'All major world languages' },
            { icon: BookOpen, label: '7 Levels Each', sub: 'A1 → A2 → B1 → B2 → C1 → C2 → PhD' },
            { icon: Mic, label: 'Azure Neural TTS', sub: 'Diverse real human voices' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-[#fde8ef] rounded-xl p-3 border border-[#f5b8cc]">
              <Icon size={16} className="text-[#d4376e] mb-1.5" />
              <div className="text-[12px] font-semibold text-[#0a0a0a]">{label}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Daily tip */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6 flex items-start gap-3">
          <Zap size={16} className="text-[#d4376e] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[11px] font-semibold text-[#d4376e] tracking-[0.15em] uppercase mb-1">Strategy</div>
            <p className="text-[12px] text-neutral-300 leading-relaxed">
              Do Language Lab <strong className="text-white">last each day</strong> — before trading, after all other courses.
              Language acquisition is strongest when your brain is primed from a full day of learning.
              15 minutes per language session compounds into fluency faster than marathon sessions.
            </p>
          </div>
        </div>

        {/* Language grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LANGUAGES.map(lang => (
            <Link
              key={lang.code}
              href={`/language/${lang.code}`}
              className="group bg-white border border-neutral-100 rounded-xl p-4 hover:border-[#d4376e] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{lang.flag}</span>
                <span className="text-[9px] font-medium text-neutral-400 tracking-[0.1em] uppercase bg-neutral-50 px-1.5 py-0.5 rounded">
                  {lang.levels.length} levels
                </span>
              </div>
              <div className="text-[14px] font-semibold text-[#0a0a0a] leading-tight">{lang.name}</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">{lang.nativeName}</div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="text-[10px] text-neutral-400">{lang.speakers} speakers</div>
              </div>
              <div className="mt-2 text-[10px] text-neutral-400 font-medium tracking-[0.08em]">{lang.family}</div>
              <div className="mt-3 text-[11px] text-[#d4376e] font-medium group-hover:underline">
                Start learning →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  )
}
