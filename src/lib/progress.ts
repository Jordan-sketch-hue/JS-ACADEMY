'use client'
import { useState, useEffect } from 'react'
import { pushProgress } from './sync'

export interface CourseProgress {
  courseId: string
  completedAt: string
  quizScore: number
  xpEarned: number
  watchProgress: number
}

export interface UserProgress {
  xp: number
  streak: number
  lastActiveDate: string
  completedCourses: CourseProgress[]
  level: number
}

const KEY = 'jst_academy_progress'

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : defaultProgress()
  } catch {
    return defaultProgress()
  }
}

function defaultProgress(): UserProgress {
  return { xp: 0, streak: 0, lastActiveDate: '', completedCourses: [], level: 1 }
}

export function saveProgress(p: UserProgress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(p))
  pushProgress(p)
}

// Bumps the streak counter at most once per calendar day, extending it if
// yesterday was the last active day or resetting to 1 otherwise. Shared by
// completeCourse and markDailyActive so "opened a lesson today" and "passed
// a quiz today" both count toward the habit the same way.
function bumpStreak(p: UserProgress, today: string) {
  if (p.lastActiveDate === today) return
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  p.streak = p.lastActiveDate === yesterday.toDateString() ? p.streak + 1 : 1
  p.lastActiveDate = today
}

export function completeCourse(courseId: string, quizScore: number, xp: number) {
  const p = getProgress()
  const today = new Date().toDateString()

  if (!p.completedCourses.find(c => c.courseId === courseId)) {
    p.completedCourses.push({ courseId, completedAt: new Date().toISOString(), quizScore, xpEarned: xp, watchProgress: 100 })
    p.xp += xp
    if (quizScore >= 2) p.xp += 50
    p.level = computeLevel(p.xp)
  }

  bumpStreak(p, today)
  saveProgress(p)
  return p
}

// Counts today toward the streak just for showing up and engaging with a
// lesson — listening or reading, not only finishing the quiz. Previously the
// streak only moved on quiz completion, so a commute spent listening to a
// module (without opening the app again later to finish the quiz) didn't
// count, which undersells the actual daily habit.
export function markDailyActive(): UserProgress {
  const p = getProgress()
  bumpStreak(p, new Date().toDateString())
  saveProgress(p)
  return p
}

export function saveWatchProgress(courseId: string, pct: number) {
  const p = getProgress()
  const existing = p.completedCourses.find(c => c.courseId === courseId)
  if (existing) { existing.watchProgress = Math.max(existing.watchProgress, pct) }
  else { p.completedCourses.push({ courseId, completedAt: '', quizScore: 0, xpEarned: 0, watchProgress: pct }) }
  saveProgress(p)
}

export function isCourseCompleted(courseId: string): boolean {
  return getProgress().completedCourses.some(c => c.courseId === courseId && c.completedAt)
}

// Reads localStorage synchronously the way isCourseCompleted() does, which
// is safe inside effects/handlers but NOT during render: on first client
// render (pre-hydration) `window` is already defined, so it returns real
// data while the server always rendered with none — a hydration mismatch.
// Call this hook once per component instead and check membership per row.
export function useCompletedCourseIds(): Set<string> {
  const [ids, setIds] = useState<Set<string>>(new Set())
  useEffect(() => {
    const load = () => setIds(new Set(
      getProgress().completedCourses.filter(c => c.completedAt).map(c => c.courseId)
    ))
    load()
    const i = setInterval(load, 2000)
    return () => clearInterval(i)
  }, [])
  return ids
}

export function getWatchProgress(courseId: string): number {
  return getProgress().completedCourses.find(c => c.courseId === courseId)?.watchProgress ?? 0
}

export function computeLevel(xp: number): number {
  const thresholds = [0, 500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000]
  return thresholds.findIndex(t => xp < t) || thresholds.length
}

export function levelName(level: number): string {
  return ['', 'Observer', 'Learner', 'Practitioner', 'Analyst', 'Strategist', 'Expert', 'Master', 'Architect', 'PhD', 'Next-Gen'][level] ?? 'Next-Gen'
}

export function xpToNextLevel(xp: number): { current: number; needed: number; pct: number } {
  const thresholds = [0, 500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000, 99999]
  const lvl = computeLevel(xp)
  const current = xp - thresholds[lvl - 1]
  const needed = thresholds[lvl] - thresholds[lvl - 1]
  return { current, needed, pct: Math.round((current / needed) * 100) }
}
