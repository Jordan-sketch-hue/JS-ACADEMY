'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { getCourse } from '@/lib/courses'
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'

export default function CoursePage() {
  const { id } = useParams<{ id: string }>()
  const course = getCourse(id)
  const [openSection, setOpenSection] = useState<number>(0)

  if (!course) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <div className="p-8 text-neutral-400">
              Course not found. <Link className="underline" href="/">Back to dashboard</Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-3xl mx-auto p-6 md:p-8">

            <Link href="/" className="flex items-center gap-2 text-neutral-500 text-sm mb-6 hover:text-neutral-800 transition-colors">
              <ArrowLeft size={14} /> Back to dashboard
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex gap-2 mb-3">
                <span className="text-[11px] bg-[#0a0a0a] text-neutral-400 px-2.5 py-1 rounded">{course.track}</span>
                <span className="text-[11px] bg-[#0a0a0a] text-[#c9a84c] px-2.5 py-1 rounded">{course.level}</span>
                <span className="text-[11px] bg-[#0a0a0a] text-neutral-400 px-2.5 py-1 rounded">{course.duration}</span>
                <span className="text-[11px] bg-[#c9a84c] text-[#0a0a0a] font-semibold px-2.5 py-1 rounded">+{course.xp} XP</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0a0a0a] mb-2">{course.title}</h1>
              <p className="text-neutral-500">{course.subtitle}</p>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {course.sections.map((section, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenSection(openSection === i ? -1 : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#0a0a0a] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-[#0a0a0a] text-sm">{section.title}</span>
                    </div>
                    {openSection === i ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                  </button>

                  {openSection === i && (
                    <div className="px-5 pb-5 border-t border-neutral-100">
                      <p className="text-neutral-700 text-sm leading-relaxed mt-4 mb-4">{section.content}</p>
                      {section.keyPoints && (
                        <div className="bg-[#f5f5f3] rounded-lg p-4">
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Key Points</p>
                          <ul className="space-y-2">
                            {section.keyPoints.map((kp, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-[#0a0a0a]">
                                <span className="text-[#c9a84c] mt-0.5 flex-shrink-0">▸</span>
                                {kp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Complete button */}
            <div className="mt-8 flex items-center justify-between">
              <Link href="/" className="text-neutral-500 text-sm hover:text-neutral-800 transition-colors">
                ← Back
              </Link>
              <button className="bg-[#0a0a0a] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
                Mark Complete · +{course.xp} XP
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
