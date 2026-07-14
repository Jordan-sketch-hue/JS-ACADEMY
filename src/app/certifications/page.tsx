import Sidebar from '@/components/Sidebar'

const CERTS = [
  { title: 'Marketing Mastery', desc: 'Complete all 5 Marketing modules', modules: 5, done: 0, icon: '📈' },
  { title: 'Technology Expert', desc: 'Complete all 5 Technology modules', modules: 5, done: 0, icon: '⚙️' },
  { title: 'Trading Proficiency', desc: 'Complete all 5 Trading modules', modules: 5, done: 0, icon: '📊' },
  { title: 'Business Leadership', desc: 'Complete all 5 Business modules', modules: 5, done: 0, icon: '💼' },
  { title: 'Design Excellence', desc: 'Complete all 5 Design modules', modules: 5, done: 0, icon: '🎨' },
  { title: 'Mindset Mastery', desc: 'Complete all 5 Mindset modules', modules: 5, done: 0, icon: '🧠' },
  { title: 'Creative Direction', desc: 'Complete all 5 Creative modules', modules: 5, done: 0, icon: '🎬' },
  { title: 'Global Intelligence', desc: 'Complete all 5 Cross Cultures modules', modules: 5, done: 0, icon: '🌍' },
  { title: 'Essential Knowledge', desc: 'Complete all 5 Need to Know modules', modules: 5, done: 0, icon: '💡' },
  { title: 'Polyglot Elite', desc: 'Reach PhD level in 3+ languages', modules: 3, done: 0, icon: '🗣️' },
]

export default function CertificationsPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#f5f5f3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-3xl mx-auto p-6 md:p-8">
            <h1 className="text-xl font-semibold text-[#0a0a0a] mb-1">Certifications</h1>
            <p className="text-sm text-neutral-500 mb-8">Complete all modules in a track to earn your certificate.</p>

            <div className="space-y-4">
              {CERTS.map(c => {
                const pct = Math.round((c.done / c.modules) * 100)
                return (
                  <div key={c.title} className="bg-white border border-neutral-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold text-[#0a0a0a] text-sm">{c.title}</p>
                          <span className="text-[11px] text-neutral-400">{c.done}/{c.modules}</span>
                        </div>
                        <p className="text-neutral-500 text-xs mb-3">{c.desc}</p>
                        <div className="bg-neutral-100 rounded h-1.5 overflow-hidden">
                          <div className="h-full bg-[#c9a84c] rounded transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
