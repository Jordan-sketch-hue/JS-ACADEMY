import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { LANGUAGES } from '@/lib/language-data'

export default function LanguageHub() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-5xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="text-4xl mb-3">🌍</div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                Language Studies
              </h1>
              <p className="text-neutral-400 text-base mb-1">
                {LANGUAGES.length} major world languages · Basic → PhD · Real Azure Neural voices
              </p>
              <p className="text-[#c9a84c] text-sm">
                ★ Your last course each day — before trading, after everything else
              </p>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LANGUAGES.map(lang => (
                <Link
                  key={lang.code}
                  href={`/language/${lang.code}`}
                  className="group bg-[#111] border border-neutral-800 rounded-xl p-5 hover:border-[#c9a84c] hover:bg-[#141408] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-3xl leading-none">{lang.flag}</span>
                      <h2 className="text-white font-semibold text-base mt-2 group-hover:text-[#c9a84c] transition-colors">
                        {lang.name}
                      </h2>
                      <p className="text-neutral-500 text-sm mt-0.5">{lang.nativeName}</p>
                    </div>
                    <span className="text-[10px] text-neutral-600 bg-neutral-900 px-2 py-1 rounded tracking-wider uppercase flex-shrink-0">
                      {lang.script.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">{lang.tagline}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {lang.lessons.map(l => (
                        <div
                          key={l.level}
                          className="w-2 h-2 rounded-full bg-neutral-700 group-hover:bg-[#c9a84c] transition-colors"
                          title={l.level}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-600">
                      {lang.lessons.length} levels
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Closing note */}
            <div className="mt-10 border-t border-neutral-800 pt-6">
              <p className="text-neutral-600 text-xs text-center">
                Powered by Azure Neural Voices · Pronunciation practice · Special character input · Interactive quizzes
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
