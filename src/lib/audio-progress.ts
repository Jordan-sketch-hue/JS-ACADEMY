'use client'
import { pushAudioPositions } from './sync'

export interface AudioPosition {
  courseId: string
  baseOffset: number
  chunkIdx: number
  chunkTime: number
  elapsed: number
  voiceId: string
  updatedAt: number
}

const PREFIX = 'jst_academy_audio_pos_'

export function getAudioPosition(courseId: string): AudioPosition | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PREFIX + courseId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// All resume points keyed by courseId — used to push a full snapshot to sync
// and to merge in whatever the server has for other devices.
export function getAllAudioPositions(): Record<string, AudioPosition> {
  if (typeof window === 'undefined') return {}
  const all: Record<string, AudioPosition> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(PREFIX)) continue
      const raw = localStorage.getItem(key)
      if (!raw) continue
      try {
        const pos: AudioPosition = JSON.parse(raw)
        all[pos.courseId] = pos
      } catch {
        // skip malformed entry
      }
    }
  } catch {
    // localStorage unavailable
  }
  return all
}

export function setAudioPositionLocal(pos: AudioPosition) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PREFIX + pos.courseId, JSON.stringify(pos))
  } catch {
    // ignore
  }
}

export function saveAudioPosition(courseId: string, pos: Omit<AudioPosition, 'courseId' | 'updatedAt'>) {
  if (typeof window === 'undefined') return
  const full: AudioPosition = { courseId, ...pos, updatedAt: Date.now() }
  try {
    localStorage.setItem(PREFIX + courseId, JSON.stringify(full))
  } catch {
    // storage full or unavailable — resume is a convenience, not critical
  }
  pushAudioPositions(getAllAudioPositions())
}

export function clearAudioPosition(courseId: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(PREFIX + courseId)
  } catch {
    // ignore
  }
  pushAudioPositions(getAllAudioPositions())
}
