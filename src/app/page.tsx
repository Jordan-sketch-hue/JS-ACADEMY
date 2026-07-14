import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { getTrackGroups } from '@/lib/courses'
import { LANGUAGES } from '@/lib/language-data'

export default function Home() {
  const tracks = getTrackGroups()
  const totalCourses = tracks.reduce((n, t) => n + t.courses.length, 0)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[#0a0a0a] tracking-tight mb-1">
                Good morning, Jordan.
              </h1>
              <p className="text-sm text-neutral-500">
                {totalCourses} courses · {tracks.length + 1} tracks · 0 XP earned
              </p>
            </div>

            {/* Language Studies — Last Course Each Day */}
            <div className="mb-8 rounded-xl border-2 border-[#c9a84c] bg-[#0a0a0a] p-5 md:p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                Last Course Daily
              </div>
              <div className="text-2xl mb-2">🌍</div>
              <h2 className="text-white font-semibold text-lg mb-1">Language Studies</h2>
              <p className="text-neutral-400 text-sm mb-4">
                {LANGUAGES.length} languages · Basic to PhD · Azure Neural Voices · Interactive drills
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {LANGUAGES.map(l => (
                  <Link
                    key={l.code}
                    href={`/language/${l.code}`}
                    className="bg-neutral-800 hover:bg-[#c9a84c] hover:text-[#0a0a0a] text-neutral-300 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all"
                    title={l.name}
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/language"
                className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4b55e] transition-colors"
              >
                Start Language Session →
              </Link>
            </div>

            {/* Course Tracks Grid */}
            <h2 className="text-xs text-neutral-500 tracking-widest uppercase mb-4">All tracks · Week 1</h2>
            <div className="space-y-6">
              {tracks.map(t => (
                <div key={t.track}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{t.icon}</span>
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a] text-sm">{t.track}</h3>
                      <p className="text-neutral-500 text-[11px]">{t.courses.length} modules · {t.subtitle}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {t.courses.map(c => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.id}`}
                        className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-[#c9a84c] hover:shadow-sm transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wide">{c.level}</span>
                          <span className="text-[10px] text-[#c9a84c] font-medium">+{c.xp}</span>
                        </div>
                        <p className="text-[13px] font-medium text-[#0a0a0a] mb-1 group-hover:text-[#8a6a1c] transition-colors leading-snug">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-neutral-500">{c.duration}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
