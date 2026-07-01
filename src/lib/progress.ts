'use client'

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

  if (p.lastActiveDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    p.streak = p.lastActiveDate === yesterday.toDateString() ? p.streak + 1 : 1
    p.lastActiveDate = today
  }

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
