import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { getTrackGroups } from '@/lib/courses'

export default function TracksPage() {
  const tracks = getTrackGroups()

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#f5f5f3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            <h1 className="text-xl font-semibold text-[#0a0a0a] mb-1">All tracks · Week 1</h1>
            <p className="text-sm text-neutral-500 mb-8">{tracks.length} tracks · {tracks.reduce((n, t) => n + t.courses.length, 0)} courses</p>

            <div className="space-y-10">
              {tracks.map(t => (
                <div key={t.track}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <h2 className="font-semibold text-[#0a0a0a]">{t.track}</h2>
                      <p className="text-neutral-500 text-xs">{t.courses.length} modules · {t.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {t.courses.map(c => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.id}`}
                        className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl px-5 py-4 hover:border-[#c9a84c] hover:shadow-sm transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0a0a0a] text-sm group-hover:text-[#8a6a1c] transition-colors truncate">{c.title}</p>
                          <p className="text-neutral-400 text-xs mt-0.5 truncate">{c.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                          <span className="text-[11px] text-neutral-400">{c.duration}</span>
                          <span className="text-[11px] text-neutral-500 font-medium">{c.level}</span>
                          <span className="text-[11px] text-[#c9a84c] font-medium">+{c.xp}</span>
                        </div>
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
