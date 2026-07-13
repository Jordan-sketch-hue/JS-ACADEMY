import Sidebar from '@/components/Sidebar'

const REWARDS = [
  { title: 'First Blood', desc: 'Complete your first lesson', xp: 50, icon: '🩸', earned: false },
  { title: 'Scholar', desc: 'Complete 10 lessons', xp: 200, icon: '📚', earned: false },
  { title: 'Polyglot', desc: 'Complete a lesson in 3 languages', xp: 300, icon: '🌍', earned: false },
  { title: 'Night Owl', desc: 'Complete a lesson after midnight', xp: 100, icon: '🦉', earned: false },
  { title: 'Streak: 7', desc: 'Maintain a 7-day learning streak', xp: 500, icon: '🔥', earned: false },
  { title: 'PhD Track', desc: 'Complete a PhD-level course', xp: 400, icon: '🎓', earned: false },
  { title: 'Trader\'s Edge', desc: 'Complete all Trading modules', xp: 800, icon: '📊', earned: false },
  { title: 'Linguist', desc: 'Reach PhD level in any language', xp: 1000, icon: '🗣️', earned: false },
]

export default function RewardsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-3xl mx-auto p-6 md:p-8">
            <h1 className="text-xl font-semibold text-[#0a0a0a] mb-1">Rewards</h1>
            <p className="text-sm text-neutral-500 mb-8">Earn XP by completing lessons. Unlock badges as you grow.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REWARDS.map(r => (
                <div
                  key={r.title}
                  className={`bg-white border rounded-xl p-5 ${r.earned ? 'border-[#c9a84c]' : 'border-neutral-200 opacity-60'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{r.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-[#0a0a0a] text-sm">{r.title}</p>
                        <span className="text-[11px] text-[#c9a84c] font-medium">+{r.xp} XP</span>
                      </div>
                      <p className="text-neutral-500 text-xs mt-1">{r.desc}</p>
                    </div>
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
