'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Layers, Trophy, Award, Flame, Languages, NotebookPen } from 'lucide-react'
import { getProgress, saveProgress, levelName, xpToNextLevel } from '@/lib/progress'
import { getAllAudioPositions, setAudioPositionLocal } from '@/lib/audio-progress'
import { pullProgress, pullAudioPositions, mergeProgress, mergeAudioPosition } from '@/lib/sync'

// Runs once per full page load (not per client-side navigation — Shell
// remounts on every route change since it's instantiated inside each page,
// and re-syncing on every nav would be needless chatter for zero benefit).
let hasSyncedThisLoad = false

async function reconcileFromServer() {
  const [remoteProgress, remoteAudio] = await Promise.all([pullProgress(), pullAudioPositions()])

  if (remoteProgress) {
    saveProgress(mergeProgress(getProgress(), remoteProgress))
  }
  if (remoteAudio) {
    const localAll = getAllAudioPositions()
    const ids = new Set([...Object.keys(localAll), ...Object.keys(remoteAudio)])
    for (const id of ids) {
      const merged = mergeAudioPosition(localAll[id], remoteAudio[id])
      if (merged) setAudioPositionLocal(merged)
    }
  }
}

const nav = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/tracks', label: 'Tracks', icon: Layers },
  { href: '/language', label: 'Languages', icon: Languages },
  { href: '/notes', label: 'Notes', icon: NotebookPen },
  { href: '/rewards', label: 'Rewards', icon: Trophy },
  { href: '/certifications', label: 'Certs', icon: Award },
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const p = getProgress()
    setXp(p.xp); setStreak(p.streak); setLevel(p.level)
    const i = setInterval(() => {
      const p2 = getProgress()
      setXp(p2.xp); setStreak(p2.streak); setLevel(p2.level)
    }, 2000)

    if (!hasSyncedThisLoad) {
      hasSyncedThisLoad = true
      reconcileFromServer().then(() => {
        const merged = getProgress()
        setXp(merged.xp); setStreak(merged.streak); setLevel(merged.level)
      })
    }

    return () => clearInterval(i)
  }, [])

  const { pct } = xpToNextLevel(xp)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[180px] bg-[#0a0a0a] flex-col flex-shrink-0 border-r border-neutral-800">
        <div className="px-5 py-5 border-b border-neutral-800">
          <div className="text-white font-medium tracking-widest text-lg">JST</div>
          <div className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase mt-0.5">Academy</div>
        </div>
        <nav className="flex-1 py-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-[12px] transition-colors ${
                  active ? 'text-white border-l-2 border-[#c9a84c] bg-neutral-900' : 'text-neutral-500 hover:text-white hover:bg-neutral-900 border-l-2 border-transparent'
                }`}>
                <Icon size={13} />{label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-neutral-800">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <Flame size={12} className="text-[#c9a84c]" />
              <span className="text-[10px] text-neutral-400">{streak}-day streak</span>
            </div>
          )}
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-neutral-500">L{level} · {levelName(level)}</span>
            <span className="text-[10px] text-[#c9a84c]">{xp.toLocaleString()}</span>
          </div>
          <div className="bg-neutral-800 rounded h-1 overflow-hidden">
            <div className="h-full bg-[#c9a84c] rounded" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0a] flex-shrink-0">
          <div>
            <span className="text-white font-medium tracking-widest text-base">JST</span>
            <span className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase ml-2">Academy</span>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && <div className="flex items-center gap-1"><Flame size={12} className="text-[#c9a84c]" /><span className="text-[11px] text-neutral-400">{streak}</span></div>}
            <div className="bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-bold px-2 py-1 rounded tracking-wide">{xp.toLocaleString()} XP</div>
          </div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-neutral-800 flex z-50">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href} className="flex-1 flex flex-col items-center py-3 gap-1">
                <Icon size={18} className={active ? 'text-[#c9a84c]' : 'text-neutral-600'} />
                <span className={`text-[10px] tracking-wide ${active ? 'text-[#c9a84c]' : 'text-neutral-600'}`}>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
