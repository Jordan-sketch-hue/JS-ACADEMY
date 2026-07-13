'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Layers, Trophy, Award, Languages } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/tracks', label: 'Tracks', icon: Layers },
  { href: '/language', label: 'Languages', icon: Languages },
  { href: '/rewards', label: 'Rewards', icon: Trophy },
  { href: '/certifications', label: 'Certs', icon: Award },
]

export default function Sidebar({ xp = 0, level = 1, rank = 'Observer', progress = 0 }: {
  xp?: number; level?: number; rank?: string; progress?: number
}) {
  const path = usePathname()
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[180px] bg-[#0a0a0a] flex-col flex-shrink-0 border-r border-neutral-800">
        <div className="px-5 py-5 border-b border-neutral-800">
          <div className="text-white font-medium tracking-widest text-lg">JST</div>
          <div className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase mt-0.5">Academy</div>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href || (href !== '/' && path.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-[12px] transition-colors border-l-2 ${
                  active
                    ? 'text-white bg-neutral-900 border-[#c9a84c]'
                    : 'text-neutral-500 hover:text-white hover:bg-neutral-900 border-transparent'
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-neutral-800">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-neutral-500">L{level} · {rank}</span>
            <span className="text-[10px] text-[#c9a84c]">{xp}</span>
          </div>
          <div className="bg-neutral-800 rounded h-1 overflow-hidden">
            <div className="h-full bg-[#c9a84c] rounded" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0a] flex-shrink-0">
        <div>
          <span className="text-white font-medium tracking-widest text-base">JST</span>
          <span className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase ml-2">Academy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-bold px-2 py-1 rounded tracking-wide">
            {xp} XP
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-neutral-800 flex z-50">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center py-3 gap-1">
              <Icon size={18} className={active ? 'text-[#c9a84c]' : 'text-neutral-600'} />
              <span className={`text-[10px] tracking-wide ${active ? 'text-[#c9a84c]' : 'text-neutral-600'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
