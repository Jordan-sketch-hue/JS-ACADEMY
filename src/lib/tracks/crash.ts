import { crashJsCourses } from './crash-js'
import { crashHtmlCourses } from './crash-html'
import { crashTsCourses } from './crash-ts'
import { crashReactCourses } from './crash-react'
import { crashNextjsCourses } from './crash-nextjs'
import { crashTailwindCourses } from './crash-tailwind'
import { crashSupabaseCourses } from './crash-supabase'
import { crashPostgresCourses } from './crash-postgres'
import { crashRestapiCourses } from './crash-restapi'
import { crashPayloadCourses } from './crash-payload'
import type { Course } from '../courses'

export const crashCourses: Course[] = [
  ...crashJsCourses,
  ...crashHtmlCourses,
  ...crashTsCourses,
  ...crashReactCourses,
  ...crashNextjsCourses,
  ...crashTailwindCourses,
  ...crashSupabaseCourses,
  ...crashPostgresCourses,
  ...crashRestapiCourses,
  ...crashPayloadCourses,
]
