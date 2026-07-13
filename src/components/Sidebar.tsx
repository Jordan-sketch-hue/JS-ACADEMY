'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getProgress, levelName, xpToNextLevel } from '@/lib/progress'
import { BookOpen, LayoutDashboard, Trophy, BarChart2, BookMarked, Award, Flame, Layers, Languages } from 'lucide-react'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tracks', label: 'All tracks', icon: Layers },
  { href: '/language', label: 'Language Lab', icon: Languages },
  { href: '/rewards', label: 'Rewards', icon: Trophy },
  { href: '/certifications', label: 'Certifications', icon: Award },
]

export default function Sidebar() {
  const path = usePathname()
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const p = getProgress()
    setXp(p.xp)
    setStreak(p.streak)
    setLevel(p.level)
  }, [])

  const { current, needed, pct } = xpToNextLevel(xp)

  return (
    <aside className="w-[196px] bg-ink min-h-screen flex flex-col border-r border-neutral-800 flex-shrink-0">
      <div className="px-5 py-5 border-b border-neutral-800">
        <div className="text-white font-medium tracking-widest text-lg">JST</div>
        <div className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase mt-0.5">Academy</div>
      </div>

      <nav className="flex-1 py-4">
        <div className="px-5 pb-2 text-[9px] text-neutral-600 tracking-[0.2em] uppercase">Learn</div>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-5 py-2 text-[12px] transition-colors ${
                active
                  ? 'text-white border-l-2 border-gold bg-neutral-900'
                  : 'text-neutral-500 hover:text-white hover:bg-neutral-900 border-l-2 border-transparent'
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-neutral-800">
        {streak > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <Flame size={13} className="text-gold" />
            <span className="text-[11px] text-neutral-400">{streak}-day streak</span>
          </div>
        )}
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] text-neutral-500">Level {level} · {levelName(level)}</span>
          <span className="text-[10px] text-gold">{xp.toLocaleString()} XP</span>
        </div>
        <div className="bg-neutral-800 rounded h-1 overflow-hidden">
          <div className="h-full bg-gold rounded transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[10px] text-neutral-600 mt-1">{needed - current} XP to Level {level + 1}</div>
      </div>
    </aside>
  )
}
