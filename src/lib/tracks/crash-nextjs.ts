import type { Course } from '../courses'

const CC_NEXTJS_OBJ = 'Build and deploy full-stack Next.js applications — App Router, server components, data fetching, API routes, middleware, and Vercel deployment.'

export const crashNextjsCourses: Course[] = [
  {
    id: 'cc-nextjs-m01', track: 'crash', title: 'Next.js App Router Fundamentals',
    subtitle: 'Understand the App Router file-system routing and React Server Components.',
    moduleObjective: 'Build routes with the App Router, layouts, and loading/error boundaries.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'App Router', definition: 'Next.js 13+ routing system. Every folder under app/ with a page.tsx is a route. Enables server components by default.' },
      { term: 'Server Component', definition: 'React component that runs on the server. Zero client JS. Can async/await, read DB, access secrets. Default in App Router.' },
      { term: 'Client Component', definition: '"use client" — runs in the browser. Required for useState, useEffect, event handlers. Use sparingly.' },
      { term: 'layout.tsx', definition: 'Wraps all pages in a segment. Persists across navigations — shared nav, sidebar, providers live here.' },
      { term: 'loading.tsx', definition: 'Automatically shown as a Suspense fallback while a page loads. Zero extra code needed.' },
    ],
    content: `## Next.js App Router Fundamentals

Next.js 15 App Router builds on React Server Components. Every component is a server component by default — only opt into client when you need browser APIs or interactivity.

### File System Routing

\`\`\`
app/
  layout.tsx          ← root layout (html, body)
  page.tsx            ← /
  about/
    page.tsx          ← /about
  courses/
    layout.tsx        ← wraps all /courses/* pages
    page.tsx          ← /courses
    [id]/
      page.tsx        ← /courses/abc123
      loading.tsx     ← Suspense fallback
      error.tsx       ← error boundary
\`\`\`

### Server Component (Default)

\`\`\`tsx
// app/courses/page.tsx — server component, no "use client"
import { getCourses } from '@/lib/courses'

export default async function CoursesPage() {
  const courses = await getCourses()  // direct DB call — no API needed

  return (
    <main>
      <h1>Courses</h1>
      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </main>
  )
}
\`\`\`

### Client Component

\`\`\`tsx
'use client'  // ← required for hooks and event handlers

import { useState } from 'react'

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onSearch(query)}
      placeholder="Search courses..."
    />
  )
}
\`\`\`

### Layout

\`\`\`tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/Sidebar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JST Academy',
  description: 'PhD-level crash courses for modern web development',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  )
}
\`\`\``,
    quiz: [
      { q: 'What is the default component type in the App Router?', options: ['Client Component', 'Server Component', 'Shared Component', 'Async Component'], correct: 1, explanation: 'All components in the App Router are Server Components by default. Add "use client" only when you need browser APIs, hooks, or event handlers.' },
      { q: 'What does layout.tsx do?', options: ['Defines page styles', 'Wraps all child pages in the segment — persists across navigations', 'Required for every route', 'Same as a page'], correct: 1, explanation: 'layout.tsx wraps child pages. It persists (does not remount) when navigating between pages in the same segment — ideal for shared nav.' },
      { q: 'What file creates an automatic loading state?', options: ['spinner.tsx', 'loading.tsx', 'fallback.tsx', 'pending.tsx'], correct: 1, explanation: 'loading.tsx in a route segment is automatically used as the Suspense fallback while the page loads. React streaming makes this instant.' },
      { q: 'When do you need "use client"?', options: ['Always', 'For useState, useEffect, event handlers, and browser APIs', 'For async/await', 'For data fetching'], correct: 1, explanation: '"use client" is needed only for client-side interactivity — hooks, event listeners, browser APIs. Server components cannot use these.' },
    ],
  },
  {
    id: 'cc-nextjs-m02', track: 'crash', title: 'Data Fetching & Caching',
    subtitle: 'Fetch data with server components, React cache, and Next.js fetch extensions.',
    moduleObjective: 'Fetch and cache data efficiently using server components and the fetch API extensions.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Basic',
    xp: 150, duration: 11, module: 2, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'fetch cache', definition: 'Next.js extends fetch to support caching. { cache: "force-cache" } caches forever; { next: { revalidate: 60 } } caches for 60 seconds.' },
      { term: 'ISR', definition: 'Incremental Static Regeneration — pages are statically generated and re-built in the background on a schedule. export const revalidate = 60.' },
      { term: 'generateStaticParams', definition: 'Pre-renders dynamic route pages at build time. Returns an array of params that get converted to static HTML.' },
      { term: 'React cache()', definition: 'Deduplicates identical function calls in a single request. Two components calling getCourse(id) with the same id hit the DB once.' },
      { term: 'unstable_cache', definition: 'next/cache — caches async function results with a key. Survives across requests. Similar to ISR but for arbitrary functions.' },
    ],
    content: `## Data Fetching & Caching

Next.js extends fetch and provides utilities for request deduplication, ISR, and on-demand revalidation.

### Fetch with Caching

\`\`\`tsx
// Force-cache — serves same data forever until revalidation
const res = await fetch('https://api.example.com/courses', {
  cache: 'force-cache'
})

// Revalidate every 60 seconds (ISR)
const res = await fetch('https://api.example.com/courses', {
  next: { revalidate: 60 }
})

// No cache — always fresh
const res = await fetch('https://api.example.com/courses', {
  cache: 'no-store'
})
\`\`\`

### Page-level Revalidation (ISR)

\`\`\`tsx
// app/courses/page.tsx
export const revalidate = 60  // rebuild every 60s

export default async function CoursesPage() {
  const courses = await getCourses()
  return <CourseList courses={courses} />
}
\`\`\`

### generateStaticParams — Pre-render Dynamic Routes

\`\`\`tsx
// app/courses/[id]/page.tsx
export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map(c => ({ id: c.id }))
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = await getCourse(id)
  return <CourseDetail course={course} />
}
\`\`\`

### React cache() — Request Deduplication

\`\`\`tsx
import { cache } from 'react'

export const getCourse = cache(async (id: string) => {
  const course = COURSES.find(c => c.id === id)
  return course ?? null
})

// Two server components calling getCourse('cc-js-m01') in the same request
// result in ONE function call — second call returns cached result
\`\`\``,
    quiz: [
      { q: 'What does { next: { revalidate: 60 } } do?', options: ['Runs a timeout of 60ms', 'Caches the response for 60 seconds then regenerates in the background', 'Forces 60 cache busts', 'Retries the request 60 times'], correct: 1, explanation: 'next.revalidate is ISR at the fetch level. The cached response is served, and after 60 seconds Next.js regenerates it in the background.' },
      { q: 'What does generateStaticParams return?', options: ['A loading state', 'An array of route params to pre-render as static HTML at build time', 'The page component', 'Metadata for the route'], correct: 1, explanation: 'generateStaticParams tells Next.js which [id] values to generate at build time. Each returned object becomes a static HTML page.' },
      { q: 'What does React cache() do?', options: ['Caches across requests', 'Deduplicates identical function calls within a single request — multiple components share one DB call', 'Speeds up rendering', 'Required for server components'], correct: 1, explanation: 'React cache() is per-request deduplication. If two components call getCourse("same-id") in one render, the function runs once.' },
      { q: 'When should you use cache: "no-store"?', options: ['For images', 'For data that must always be fresh — user-specific data, real-time prices', 'For static pages', 'Never — always cache'], correct: 1, explanation: 'no-store skips caching entirely. Use for user-specific data (auth checks, personalized content) or data that changes frequently.' },
    ],
  },
  {
    id: 'cc-nextjs-m03', track: 'crash', title: 'API Routes & Server Actions',
    subtitle: 'Build backend endpoints and mutate data with Route Handlers and Server Actions.',
    moduleObjective: 'Create API routes and Server Actions to handle data mutations and backend logic.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'Route Handler', definition: 'app/api/*/route.ts — named HTTP handler exports (GET, POST, PATCH, DELETE). Runs on the server. The App Router replacement for pages/api.' },
      { term: 'Server Action', definition: '"use server" — an async function that runs on the server, callable from client components. Replaces form POST + API route for mutations.' },
      { term: 'revalidatePath', definition: 'next/cache — invalidates the cache for a route after a mutation, causing the next request to re-fetch.' },
      { term: 'NextRequest', definition: 'Extends the Web Request API with helpers for cookies, geo, and Next.js-specific properties.' },
      { term: 'NextResponse', definition: 'Extends Response with .json(), .redirect(), and .rewrite() helpers. The standard return from Route Handlers.' },
    ],
    content: `## API Routes & Server Actions

Route Handlers are the App Router's API layer. Server Actions are the preferred mutation pattern — they eliminate the need for a separate API endpoint for most form submissions.

### Route Handler

\`\`\`tsx
// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { COURSES } from '@/lib/courses'

export async function GET(req: NextRequest) {
  const track = req.nextUrl.searchParams.get('track')
  const courses = track
    ? COURSES.filter(c => c.track === track)
    : COURSES

  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // validate and save...
  return NextResponse.json({ success: true }, { status: 201 })
}
\`\`\`

### Dynamic Route Handler

\`\`\`tsx
// app/api/courses/[id]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const course = COURSES.find(c => c.id === id)

  if (!course) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(course)
}
\`\`\`

### Server Action

\`\`\`tsx
// app/actions/progress.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function markComplete(courseId: string) {
  // save to DB...
  revalidatePath('/courses')
  return { success: true }
}

// app/components/CompleteButton.tsx
'use client'
import { markComplete } from '@/app/actions/progress'

export function CompleteButton({ courseId }: { courseId: string }) {
  return (
    <button onClick={() => markComplete(courseId)}>
      Mark Complete
    </button>
  )
}
\`\`\``,
    quiz: [
      { q: 'Where do Route Handlers live in the App Router?', options: ['pages/api/', 'app/api/*/route.ts with named HTTP exports', 'Any file with export default', 'middleware.ts'], correct: 1, explanation: 'Route Handlers are route.ts files with named exports matching HTTP methods: GET, POST, PATCH, DELETE. They live anywhere under app/.' },
      { q: 'What is a Server Action?', options: ['An API route', 'An async function marked "use server" — runs on the server, callable from client components', 'A middleware function', 'A React hook'], correct: 1, explanation: 'Server Actions run on the server but can be called directly from client components — no manual fetch/API route needed for mutations.' },
      { q: 'What does revalidatePath do?', options: ['Refreshes the browser', 'Invalidates the Next.js cache for a specific path — next request re-fetches fresh data', 'Reloads the server', 'Required after every mutation'], correct: 1, explanation: 'revalidatePath tells Next.js to purge cached data for a route. The next visit re-runs the server component and fetches fresh data.' },
      { q: 'When should you use a Server Action vs a Route Handler?', options: ['Server Actions are only for forms', 'Server Actions for mutations triggered from components; Route Handlers for public API endpoints consumed by external clients', 'Route Handlers are always better', 'They are identical'], correct: 1, explanation: 'Server Actions are ideal for internal mutations — no HTTP overhead, type-safe, co-located. Route Handlers are for REST APIs consumed externally.' },
    ],
  },
  {
    id: 'cc-nextjs-m04', track: 'crash', title: 'Dynamic Routes & Params',
    subtitle: 'Build dynamic pages with route params, catch-all routes, and parallel routes.',
    moduleObjective: 'Implement dynamic routing including optional catch-all and parallel routes.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: '[id]', definition: 'Dynamic segment — matches any single value. /courses/[id] matches /courses/cc-js-m01.' },
      { term: '[...slug]', definition: 'Catch-all segment — matches any number of path segments. /blog/[...slug] matches /blog/a/b/c.' },
      { term: '[[...slug]]', definition: 'Optional catch-all — matches zero or more segments. Matches both /blog and /blog/a/b.' },
      { term: 'Parallel Routes', definition: '@slot folders — render multiple pages simultaneously in the same layout. Used for modals, tabs, split views.' },
      { term: 'Intercepting Routes', definition: '(.) prefix — intercepts a route and shows it in a modal context (e.g. opening a photo in a feed without navigating away).' },
    ],
    content: `## Dynamic Routes & Params

Next.js routing supports flexible patterns for blogs, product pages, documentation, and complex UI patterns.

### Dynamic Segment

\`\`\`tsx
// app/courses/[trackId]/[moduleId]/page.tsx
interface Props {
  params: Promise<{ trackId: string; moduleId: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function ModulePage({ params, searchParams }: Props) {
  const { trackId, moduleId } = await params
  const { tab = 'content' } = await searchParams

  const course = COURSES.find(c => c.id === moduleId && c.track === trackId)

  if (!course) return notFound()

  return <CourseViewer course={course} activeTab={tab} />
}
\`\`\`

### notFound() and generateMetadata

\`\`\`tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params
  const course = COURSES.find(c => c.id === moduleId)

  if (!course) return { title: 'Not Found' }

  return {
    title: course.title + ' | JST Academy',
    description: course.moduleObjective,
  }
}
\`\`\`

### Catch-All Routes

\`\`\`
app/docs/[...slug]/page.tsx  → matches:
  /docs/intro
  /docs/api/courses
  /docs/api/courses/create

app/docs/[[...slug]]/page.tsx → also matches:
  /docs  (slug is undefined)
\`\`\`

### Parallel Routes (Modal Pattern)

\`\`\`
app/
  layout.tsx
  page.tsx
  @modal/           ← parallel slot
    (.)courses/
      [id]/
        page.tsx    ← intercepted modal
  courses/
    [id]/
      page.tsx      ← full page
\`\`\`

app/layout.tsx receives \`{ children, modal }\` — render both simultaneously.`,
    quiz: [
      { q: 'What does [...slug] match?', options: ['One segment only', 'Any number of path segments — e.g. /docs/a/b/c', 'Optional segments', 'Only the root'], correct: 1, explanation: 'Catch-all [...slug] matches one or more path segments. The slug param is an array of strings.' },
      { q: 'What does notFound() do in a page?', options: ['Returns a 200 with "not found" text', 'Throws a Not Found error — renders the nearest not-found.tsx with a 404 status', 'Redirects to /', 'Shows a blank page'], correct: 1, explanation: 'notFound() is a Next.js navigation function that interrupts rendering and triggers the not-found boundary.' },
      { q: 'What are parallel routes (@slot)?', options: ['Routes that redirect', 'Multiple pages rendered simultaneously in the same layout — for modals, split views, tabs', 'Faster loading routes', 'API routes'], correct: 1, explanation: 'Parallel routes (@modal, @sidebar) are separate route segments rendered together in the layout. The layout receives them as separate props.' },
      { q: 'What is [[...slug]] vs [...slug]?', options: ['They are identical', '[[...slug]] is optional — also matches the route with no additional segments; [...slug] requires at least one', 'One is faster', 'Only [[...slug]] supports arrays'], correct: 1, explanation: 'Optional catch-all [[...slug]] matches both /docs (slug = undefined) and /docs/a/b. Regular catch-all requires at least one segment.' },
    ],
  },
  {
    id: 'cc-nextjs-m05', track: 'crash', title: 'Middleware & Authentication',
    subtitle: 'Protect routes and redirect users with middleware and Next.js auth patterns.',
    moduleObjective: 'Write middleware to protect routes and redirect unauthenticated users.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Masters',
    xp: 175, duration: 11, module: 5, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'middleware.ts', definition: 'Edge middleware — runs before every request matching the config.matcher. Intercepts, redirects, rewrites, or adds headers.' },
      { term: 'Edge Runtime', definition: 'Lightweight V8 runtime at the CDN edge. No Node.js APIs. Middleware always runs on the edge for minimal latency.' },
      { term: 'config.matcher', definition: 'Array of route patterns middleware should run on. Excludes static files by default.' },
      { term: 'NextResponse.redirect', definition: 'Returns a redirect response from middleware. Preserves the intended URL as a ?callbackUrl param for post-login redirect.' },
      { term: 'Cookies', definition: 'req.cookies.get("session") — read cookies in middleware. Used for session-based auth checks.' },
    ],
    content: `## Middleware & Authentication

Middleware runs at the CDN edge before every matching request — ideal for auth guards, redirects, and A/B testing.

### Basic Middleware

\`\`\`tsx
// middleware.ts (root of project)
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
\`\`\`

### Route-Specific Guards

\`\`\`tsx
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Add user id to headers so server components can read it
  const res = NextResponse.next()
  res.headers.set('x-user-token', token)
  return res
}
\`\`\`

### Reading Auth in Server Components

\`\`\`tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) redirect('/login')
  return verifyToken(token)
}

export default async function DashboardPage() {
  const user = await getSession()
  return <Dashboard user={user} />
}
\`\`\``,
    quiz: [
      { q: 'Where does middleware run?', options: ['On the origin server', 'At the CDN edge before every matching request — minimal latency', 'In the browser', 'After the response'], correct: 1, explanation: 'Next.js middleware runs at the edge (CDN) — before the request reaches your server. This makes auth redirects near-instant.' },
      { q: 'What is config.matcher for?', options: ['Database matching', 'Defines which routes middleware runs on — prevents running on static files and images', 'Required by TypeScript', 'Rate limiting'], correct: 1, explanation: 'config.matcher controls which routes trigger middleware. Without it, middleware runs on every request including _next/static files.' },
      { q: 'How do you redirect in middleware?', options: ['throw redirect(url)', 'return NextResponse.redirect(new URL(path, req.url))', 'return null', 'router.push(url)'], correct: 1, explanation: 'NextResponse.redirect() returns a redirect response from middleware. Pass a full URL — use new URL() to build it from req.url.' },
      { q: 'What APIs are available in middleware?', options: ['Full Node.js APIs', 'Edge Runtime only — Web APIs (fetch, URL, Request, Response), no Node.js fs, net, etc.', 'Browser APIs', 'All APIs'], correct: 1, explanation: 'Middleware runs on the Edge Runtime — a V8 environment without Node.js APIs. You can use Web fetch, URL, cookies, headers, but not fs or path.' },
    ],
  },
  {
    id: 'cc-nextjs-m06', track: 'crash', title: 'Image, Font & Metadata Optimization',
    subtitle: 'Optimize Core Web Vitals with next/image, next/font, and the Metadata API.',
    moduleObjective: 'Configure next/image, next/font, and generate metadata for SEO and social sharing.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'next/image', definition: 'Image component with automatic WebP conversion, lazy loading, blur placeholder, and size optimization. Prevents CLS.' },
      { term: 'next/font', definition: 'Self-hosts Google Fonts with zero layout shift. Fonts are downloaded at build time and served from your domain.' },
      { term: 'Metadata API', definition: 'export const metadata or generateMetadata() — sets page title, description, OG tags, Twitter cards from server components.' },
      { term: 'sizes prop', definition: 'Tells the browser which image size to load based on viewport width. Critical for responsive images that are not full-width.' },
      { term: 'Open Graph', definition: 'og: meta tags — control how pages appear when shared on social media. Next.js Metadata API generates them automatically.' },
    ],
    content: `## Image, Font & Metadata Optimization

Next.js ships built-in optimization for the three biggest CWV killers: images, fonts, and metadata.

### next/image

\`\`\`tsx
import Image from 'next/image'

// Fixed-size image (avatar, logo)
<Image
  src="/logo.png"
  alt="JST Academy"
  width={120}
  height={40}
  priority  // LCP image — load eagerly
/>

// Responsive image (hero, card)
<Image
  src="/hero.jpg"
  alt="Hero"
  fill             // fills parent container
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
\`\`\`

The parent of a fill image needs position: relative.

### next/font

\`\`\`tsx
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${playfair.variable}\`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
\`\`\`

### Metadata API

\`\`\`tsx
// Static metadata
export const metadata: Metadata = {
  title: { template: '%s | JST Academy', default: 'JST Academy' },
  description: 'PhD-level crash courses.',
  openGraph: {
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

// Dynamic metadata from params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).id)
  return {
    title: course?.title,
    description: course?.moduleObjective,
    openGraph: { title: course?.title },
  }
}
\`\`\``,
    quiz: [
      { q: 'What does next/image do automatically?', options: ['Nothing special', 'Converts to WebP, lazy loads, prevents CLS with reserved space, and serves optimized sizes', 'Only compresses', 'Requires manual config'], correct: 1, explanation: 'next/image handles format conversion (WebP/AVIF), responsive sizes, lazy loading, and the sizes attribute — Core Web Vitals improvements out of the box.' },
      { q: 'Why use next/font over a Google Fonts <link>?', options: ['It is faster to type', 'Self-hosts fonts at build time — zero layout shift, no external network request, GDPR-friendly', 'Required by Next.js', 'Same performance'], correct: 1, explanation: 'next/font downloads fonts at build time and hosts them on your domain. No external DNS lookup, no CLS from font swaps, no Google analytics.' },
      { q: 'What is the title template used for?', options: ['Page animations', 'Generates "Page Title | App Name" format automatically for all pages — set once in root layout', 'Required for SEO', 'Breadcrumb navigation'], correct: 1, explanation: 'The template ("%s | JST Academy") is applied to all page titles. Child pages set their own title and the template wraps it.' },
      { q: 'What does the sizes prop on next/image do?', options: ['Sets the CSS size', 'Tells the browser which image size to download based on viewport width — prevents loading a 1200px image on mobile', 'Required for fill', 'Controls lazy loading'], correct: 1, explanation: 'The sizes prop generates a srcset so browsers only download the appropriate image size for the current viewport.' },
    ],
  },
  {
    id: 'cc-nextjs-m07', track: 'crash', title: 'Environment Variables & Config',
    subtitle: 'Manage environment variables, Next.js config, and TypeScript paths.',
    moduleObjective: 'Configure environment variables, path aliases, and Next.js build settings.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'PhD',
    xp: 200, duration: 10, module: 7, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'NEXT_PUBLIC_', definition: 'Prefix that exposes env vars to the browser bundle. Without it, vars are server-only.' },
      { term: '.env.local', definition: 'Git-ignored local overrides. Not committed. Takes precedence over .env. The right place for secrets during development.' },
      { term: 'Path alias (@/)', definition: '@/ maps to src/ or the root — import \"@/lib/courses\" instead of \"../../../lib/courses\".' },
      { term: 'next.config.ts', definition: 'Build and runtime configuration — webpack, headers, redirects, image domains, experimental features.' },
      { term: 'Turbopack', definition: 'Next.js 15 dev bundler — significantly faster than webpack for HMR. Enable with --turbopack flag.' },
    ],
    content: `## Environment Variables & Config

Environment variable management and Next.js config are critical for secure, portable deployments.

### Environment Files (Priority Order)

\`\`\`
.env.local         ← highest priority, never committed (secrets)
.env.development   ← dev only
.env.production    ← production only
.env               ← all environments (lowest priority)
\`\`\`

### Server vs Client Variables

\`\`\`bash
# Server-only (secure — never in browser)
DATABASE_URL=postgresql://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AZURE_SPEECH_KEY=abc123

# Browser-exposed (safe — no secrets)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_APP_URL=https://academy.jsupremeconglomerate.online
\`\`\`

### TypeScript: env validation with zod

\`\`\`tsx
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AZURE_SPEECH_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
// Throws at startup if any required var is missing
\`\`\`

### next.config.ts

\`\`\`tsx
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    }]
  },
  async redirects() {
    return [{
      source: '/old-path',
      destination: '/new-path',
      permanent: true,
    }]
  },
}

export default config
\`\`\`

### tsconfig.json Path Aliases

\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
\`\`\``,
    quiz: [
      { q: 'What prefix exposes an env var to the browser?', options: ['PUBLIC_', 'NEXT_PUBLIC_', 'CLIENT_', 'BROWSER_'], correct: 1, explanation: 'NEXT_PUBLIC_ vars are inlined into the browser bundle at build time. All other vars are server-only and never shipped to the client.' },
      { q: 'Which env file has the highest priority?', options: ['.env', '.env.production', '.env.local', '.env.development'], correct: 2, explanation: '.env.local has the highest priority and is never committed. Use it for secrets that should stay on your machine.' },
      { q: 'What does validating env vars with zod do?', options: ['Slows the build', 'Throws at startup if required vars are missing — prevents silent runtime failures', 'Required by Next.js', 'Only for production'], correct: 1, explanation: 'Env validation at startup (import time) catches missing or malformed vars before the app serves any traffic.' },
      { q: 'What is next.config.ts used for?', options: ['Defining routes', 'Build and runtime config — image domains, custom headers, redirects, webpack, experimental features', 'Environment variables', 'TypeScript settings'], correct: 1, explanation: 'next.config.ts is the build/runtime config for Next.js. Separate from .env files (env vars) and tsconfig (TypeScript).' },
    ],
  },
  {
    id: 'cc-nextjs-m08', track: 'crash', title: 'Deployment & Vercel',
    subtitle: 'Deploy Next.js to Vercel with environment setup, domain config, and CI/CD.',
    moduleObjective: 'Deploy a Next.js application to Vercel with custom domains and environment variables.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'Vercel', definition: 'The deployment platform built by the Next.js team. Zero-config deployment — push to git and it deploys automatically.' },
      { term: 'Preview deployment', definition: 'Every PR/branch gets a unique preview URL. Test before merging. Preview envs can have separate env vars.' },
      { term: 'Production deployment', definition: 'The deployment aliased to your production domain. Triggered by push to main/master.' },
      { term: 'vercel alias', definition: 'npx vercel alias <deploy-url> <custom-domain> — points a domain to a specific deployment. Used for zero-downtime deploys.' },
      { term: 'ISR revalidation', definition: 'On-demand revalidation via revalidatePath() or revalidateTag() clears the CDN cache globally across all Vercel edge nodes.' },
    ],
    content: `## Deployment & Vercel

Vercel is the zero-config deployment platform for Next.js — built by the same team.

### Deploy from CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod

# Alias to a custom domain
npx vercel alias <deployment-url> academy.jsupremeconglomerate.online
\`\`\`

### Environment Variables in Vercel

\`\`\`bash
# Add via CLI (prompts for value)
vercel env add AZURE_SPEECH_KEY production
vercel env add AZURE_SPEECH_KEY preview

# Pull to local .env.local
vercel env pull .env.local
\`\`\`

Set env vars for BOTH production and preview environments — preview deployments (PRs) need them too.

### vercel.json Config

\`\`\`json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/old-api/:path*", "destination": "/api/:path*" }
  ]
}
\`\`\`

### Checklist Before Going Live

\`\`\`
✅ All env vars added to Vercel (Production + Preview)
✅ Custom domain DNS set (A record or CNAME to Vercel)
✅ Domain aliased to latest production deployment
✅ Images configured (remotePatterns for external hosts)
✅ TypeScript build passes (npx tsc --noEmit)
✅ No hardcoded secrets in source code
✅ Error boundaries in place for critical routes
\`\`\``,
    quiz: [
      { q: 'What triggers a production deployment on Vercel?', options: ['Any commit', 'Push to the main/master branch (or the branch configured as production)', 'Manual deploy only', 'npx vercel command only'], correct: 1, explanation: 'Vercel watches the production branch (default: main/master). A push triggers an automatic build and production deployment.' },
      { q: 'Why set env vars on both Production and Preview?', options: ['Required by Vercel', 'Preview deployments (PRs) run your actual code and need the same vars — missing vars cause silent failures', 'For staging', 'Only secrets need both'], correct: 1, explanation: 'Preview deployments are real Next.js deployments. Without env vars set for preview, API routes and data fetching fail on PR previews.' },
      { q: 'What does vercel alias do?', options: ['Creates a new project', 'Points a domain or subdomain to a specific deployment URL', 'Upgrades the deployment', 'Required for custom domains'], correct: 1, explanation: 'vercel alias <deployment> <domain> atomically switches the domain to point to a specific deployment — zero-downtime domain switching.' },
      { q: 'What does vercel env pull do?', options: ['Uploads local env vars', 'Downloads Vercel env vars to .env.local — keeps local and production in sync', 'Deletes local env', 'Shows env var values'], correct: 1, explanation: 'vercel env pull downloads your project\'s Vercel env vars to .env.local. Keeps local development consistent with production without exposing values in git.' },
    ],
  },
]
