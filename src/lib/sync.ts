'use client'
import type { UserProgress, CourseProgress } from './progress'
import type { AudioPosition } from './audio-progress'

// Best-effort cross-device sync. Every call is fire-and-forget from the
// caller's perspective — a slow network or a misconfigured server (no
// SUPABASE_SERVICE_ROLE_KEY set yet) must never block or break local
// learning, since localStorage remains the source of truth for the current
// session regardless of whether sync succeeds.

async function safeFetch(input: string, init?: RequestInit) {
  try {
    const res = await fetch(input, init)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export function pushProgress(p: UserProgress) {
  void safeFetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'progress', data: p }),
  })
}

export function pushAudioPositions(all: Record<string, AudioPosition>) {
  void safeFetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'audio_positions', data: all }),
  })
}

// Combines two UserProgress snapshots without ever discarding progress:
// XP and per-course stats take the higher value seen on either device, and
// only the streak/lastActiveDate (which are date-sequence-dependent, not
// summable) come from whichever snapshot was active more recently.
export function mergeProgress(a: UserProgress, b: UserProgress): UserProgress {
  const aTime = a.lastActiveDate ? new Date(a.lastActiveDate).getTime() : 0
  const bTime = b.lastActiveDate ? new Date(b.lastActiveDate).getTime() : 0
  const newer = aTime >= bTime ? a : b

  const byId = new Map<string, CourseProgress>()
  for (const c of [...a.completedCourses, ...b.completedCourses]) {
    const existing = byId.get(c.courseId)
    byId.set(c.courseId, existing ? {
      courseId: c.courseId,
      completedAt: existing.completedAt || c.completedAt,
      quizScore: Math.max(existing.quizScore, c.quizScore),
      xpEarned: Math.max(existing.xpEarned, c.xpEarned),
      watchProgress: Math.max(existing.watchProgress, c.watchProgress),
    } : c)
  }

  const xp = Math.max(a.xp, b.xp)
  return {
    xp,
    level: Math.max(a.level, b.level),
    streak: newer.streak,
    lastActiveDate: newer.lastActiveDate,
    completedCourses: Array.from(byId.values()),
  }
}

export function mergeAudioPosition(a: AudioPosition | undefined, b: AudioPosition | undefined): AudioPosition | undefined {
  if (!a) return b
  if (!b) return a
  return a.updatedAt >= b.updatedAt ? a : b
}

export async function pullProgress(): Promise<UserProgress | null> {
  const res = await safeFetch('/api/sync?key=progress')
  return res?.data ?? null
}

export async function pullAudioPositions(): Promise<Record<string, AudioPosition> | null> {
  const res = await safeFetch('/api/sync?key=audio_positions')
  return res?.data ?? null
}
