import type { Course } from '../courses'

const CC_NEXTJS_OBJ = 'Build and deploy full-stack Next.js applications — App Router, server components, data fetching, API routes, middleware, and Vercel deployment.'

export const crashNextjsCourses: Course[] = [
  {
    id: 'cc-nextjs-m01', track: 'crash',
    title: 'Environment, App Router & How Next.js Actually Works',
    subtitle: 'Set up a Next.js 15 project, understand App Router routing, and master the Server vs Client Component model.',
    moduleObjective: 'Configure a Next.js project with VS Code, understand file-system routing, and know when to use Server vs Client components.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Basic',
    xp: 150, duration: 12, module: 1, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'App Router', definition: 'Next.js 13+ routing system based on the file system. Every folder under app/ with a page.tsx creates a route. Server Components by default.' },
      { term: 'Server Component', definition: 'React component that runs exclusively on the server. Zero client JS shipped. Can async/await, read databases, access secrets directly.' },
      { term: 'Client Component', definition: '"use client" directive at the top of the file. Runs in the browser. Required for useState, useEffect, event handlers, and browser APIs.' },
      { term: 'layout.tsx', definition: 'Wraps all pages in a route segment. Persists across navigations within the segment — nav, sidebar, and providers live here.' },
      { term: 'SSR', definition: 'Server-Side Rendering — HTML is generated on the server for each request. The user gets a fully rendered page, not an empty shell.' },
      { term: 'SSG', definition: 'Static Site Generation — pages are rendered to HTML at build time. Fastest possible delivery — served directly from CDN with no server computation.' },
    ],
    content: `## Environment, App Router & How Next.js Actually Works

### Why Next.js? The Problem with Plain React

A plain React app (from Vite) ships an empty HTML shell to the browser:

\`\`\`html
<div id="root"></div>
<script src="/bundle.js"></script>
\`\`\`

The browser downloads the JS bundle, executes it, then React renders your app into \`#root\`. Until the JS runs, the user sees nothing. Search engines see nothing. This is called **Client-Side Rendering (CSR)** and it has real costs:
- Slow **First Contentful Paint** (FCP) — users wait for JS before seeing content
- Poor **SEO** — crawlers often don't execute JS
- No direct database access — everything needs a separate API endpoint

Next.js adds **Server-Side Rendering (SSR)**, **Static Site Generation (SSG)**, and **Incremental Static Regeneration (ISR)** — giving you pre-rendered HTML from the server on every request, at build time, or on a schedule. Users get fast, SEO-friendly pages. The App Router takes this further: components run on the server by default and you opt into client behavior only when needed.

### Setting Up Your Environment

**Step 1 — Create the project:**
\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
\`\`\`

Flags explained:
- \`--typescript\`: TypeScript from the start (industry standard)
- \`--tailwind\`: Tailwind CSS pre-configured
- \`--app\`: App Router (not the older Pages Router)

Your app runs at \`http://localhost:3000\`. The terminal shows a build output with routes detected. HMR works — save a file and the browser updates instantly.

**Step 2 — VS Code extensions to install:**
- **Next.js extension** (by Vercel) or the **ES7+ React snippets** extension: Component scaffolding shortcuts.
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind class names in JSX.
- **Prettier**: Format on save.

**Step 3 — Understand the start-up output:**

Run \`npm run dev\` and you will see something like:
\`\`\`
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local
  ✓ Starting...
  ✓ Ready in 2.1s
\`\`\`

Next.js is running a Node.js server that handles every request — running your server components, serving static files, and proxying to the Next.js runtime.

### File System Routing — The Mental Model

Every \`page.tsx\` file inside \`src/app/\` defines a route. The folder path becomes the URL path:

\`\`\`
src/app/
  layout.tsx          ← root layout — html, body, global providers
  page.tsx            ← / (home page)
  about/
    page.tsx          ← /about
  courses/
    layout.tsx        ← wraps all /courses/* routes (shared nav)
    page.tsx          ← /courses (course list)
    [id]/
      page.tsx        ← /courses/cc-js-m01, /courses/cc-react-m02, etc.
      loading.tsx     ← shown as Suspense fallback while page loads
      error.tsx       ← shown if the page component throws
  api/
    courses/
      route.ts        ← API endpoint: GET/POST /api/courses
\`\`\`

This is the entire routing system. No router configuration file. No \`<Route path="...">\`. The file system IS the router.

### Server Components vs Client Components

This is the most important mental model in Next.js 15.

**Server Component (default — no directive needed):**

\`\`\`tsx
// src/app/courses/page.tsx
// No "use client" = Server Component
// Runs on the server. Can async/await. Ships ZERO JavaScript to the browser.

import { getCourses } from '@/lib/courses'

export default async function CoursesPage() {
  const courses = await getCourses()  // direct function call — no API needed

  return (
    <main>
      <h1>All Courses</h1>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title} — {c.xp} XP</li>
        ))}
      </ul>
    </main>
  )
}
\`\`\`

No useEffect. No loading state. No API route needed. The server calls \`getCourses()\` directly, gets the data, renders HTML, sends it to the browser. The browser receives fully-rendered HTML with the course list — instant paint.

**Client Component (opt-in):**

\`\`\`tsx
'use client'  // ← this one directive changes everything

import { useState } from 'react'

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')  // useState works now

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

\`'use client'\` marks a component (and all its imports) as client code. This JS is bundled and shipped to the browser. Use it only for: hooks, event handlers, browser APIs (\`localStorage\`, \`window\`, geolocation).

### The Rule: Push 'use client' As Deep As Possible

\`\`\`tsx
// WRONG — entire page is client-side for one interactive element
'use client'
export default async function CoursesPage() { ... }

// CORRECT — only the search bar is client-side
// src/app/courses/page.tsx (Server Component)
import { SearchBar } from '@/components/SearchBar'  // 'use client' inside there

export default async function CoursesPage() {
  const courses = await getCourses()  // server-only logic still works

  return (
    <main>
      <SearchBar />             {/* ← client island */}
      <CourseList courses={courses} />  {/* ← server-rendered */}
    </main>
  )
}
\`\`\`

Think of your page as mostly server-rendered HTML with small "islands" of client interactivity.

### Root Layout — The App Shell

\`\`\`tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JST Academy',
  description: 'PhD-level crash courses for modern developers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>JST Academy</nav>
        <main>{children}</main>
        <footer>© 2026 J Supreme Tech</footer>
      </body>
    </html>
  )
}
\`\`\`

This layout wraps every page in the app. The \`metadata\` export auto-generates \`<title>\` and \`<meta description>\` tags. \`children\` is the current page's rendered output.`,

    quiz: [
      { q: 'What command creates a Next.js 15 project with TypeScript, Tailwind, and App Router?', options: ['npx create-react-app my-app --next', 'npx create-next-app@latest my-app --typescript --tailwind --app', 'npm init next my-app', 'npx next create my-app'], correct: 1, explanation: 'npx create-next-app@latest with --typescript --tailwind --app sets up a production-ready Next.js project with the App Router and TypeScript.' },
      { q: 'What is the default component type in the App Router?', options: ['Client Component', 'Server Component', 'Shared Component', 'Async Component'], correct: 1, explanation: 'All components in the App Router are Server Components by default. Add "use client" only when you need browser APIs, hooks, or event handlers.' },
      { q: 'What does layout.tsx do?', options: ['Defines global CSS', 'Wraps all child pages in the segment — persists and does not remount on navigation', 'Required for every route', 'Same as a page with extra steps'], correct: 1, explanation: 'layout.tsx wraps child pages. Unlike pages, it persists (does not remount) when navigating between pages in the same segment — ideal for shared nav and providers.' },
      { q: 'When do you need the "use client" directive?', options: ['Always at the top of every file', 'For useState, useEffect, event handlers, and browser APIs only', 'For async/await in components', 'For any data fetching'], correct: 1, explanation: '"use client" is needed only for client-side interactivity — hooks, event listeners, browser APIs. Server components handle async data fetching natively.' },
    ],

    ide: {
      language: 'javascript',
      task: 'Build two functions: a RootLayout that wraps children in an app shell (nav + main + footer), and a CoursePage that calls getCourses() and returns structured markup. This mirrors the App Router\'s layout.tsx and page.tsx pattern.',
      starterCode: `// Simulating Next.js App Router page and layout components in plain JS.
// In a real Next.js project these would be .tsx files with JSX.

// 1. Build a RootLayout function that:
//    - Accepts a { children } parameter
//    - Returns a string with a <nav>, <main>{children}</main>, and <footer>
function RootLayout({ children }) {
  // TODO: return the HTML shell
}

// 2. Build a CoursePage function that:
//    - Calls getCourses() to get the data
//    - Returns markup listing each course title and XP
function CoursePage() {
  const courses = getCourses()
  // TODO: return a string with a heading and list of courses
}

// Helper — simulates a database call (like getCourses() in lib/courses.ts)
function getCourses() {
  return [
    { id: 'cc-js-m01', title: 'JavaScript Crash Course', xp: 150 },
    { id: 'cc-react-m01', title: 'React Crash Course', xp: 150 },
    { id: 'cc-nextjs-m01', title: 'Next.js Crash Course', xp: 150 },
  ]
}

// Test it — compose layout and page together
const pageContent = CoursePage()
const fullPage = RootLayout({ children: pageContent })
console.log(fullPage)`,

      solution: `function RootLayout({ children }) {
  return \`
    <html>
      <body>
        <nav>JST Academy</nav>
        <main>\${children}</main>
        <footer>© 2026 J Supreme Tech</footer>
      </body>
    </html>
  \`
}

function CoursePage() {
  const courses = getCourses()
  const courseItems = courses
    .map(c => \`<li>\${c.title} — \${c.xp} XP</li>\`)
    .join('\\n')

  return \`
    <section>
      <h1>All Courses</h1>
      <ul>
        \${courseItems}
      </ul>
    </section>
  \`
}

function getCourses() {
  return [
    { id: 'cc-js-m01', title: 'JavaScript Crash Course', xp: 150 },
    { id: 'cc-react-m01', title: 'React Crash Course', xp: 150 },
    { id: 'cc-nextjs-m01', title: 'Next.js Crash Course', xp: 150 },
  ]
}

// Compose them — layout wraps the page output
const pageContent = CoursePage()
const fullPage = RootLayout({ children: pageContent })
console.log(fullPage)
// In Next.js: layout.tsx receives the rendered page.tsx output as children`,

      hints: [
        'RootLayout takes { children } and wraps it: return `<nav>...</nav><main>${children}</main><footer>...</footer>`',
        'CoursePage calls getCourses() to get the array, then maps over it to build list items.',
        'Use .map().join("\\n") to build the list items string, then embed it in a <ul>.',
      ]
    }
  },

  {
    id: 'cc-nextjs-m02', track: 'crash', title: 'Data Fetching & Caching',
    subtitle: 'Fetch data with server components, React cache, and Next.js fetch extensions.',
    moduleObjective: 'Fetch and cache data efficiently using server components and the fetch API extensions.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Basic',
    xp: 150, duration: 11, module: 2, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'fetch cache', definition: 'Next.js extends the native fetch API to support caching. { cache: "force-cache" } caches forever; { next: { revalidate: 60 } } caches for 60 seconds.' },
      { term: 'ISR', definition: 'Incremental Static Regeneration — pages are statically generated and silently regenerated in the background on a schedule. export const revalidate = 60.' },
      { term: 'generateStaticParams', definition: 'Pre-renders dynamic route pages at build time. Returns an array of param objects that become individual static HTML files.' },
      { term: 'React cache()', definition: 'Deduplicates identical function calls within a single render pass. Two server components calling getCourse(id) with the same id hit the source only once.' },
      { term: 'unstable_cache', definition: 'next/cache — caches async function results with a tag key. Persists across requests. Works like ISR but for arbitrary functions, not just fetch.' },
    ],
    content: `## Data Fetching & Caching

In the App Router, data fetching happens directly in server components — no useEffect, no loading state, no separate API call. The component \`async\`/\`await\`s the data and renders it server-side.

Next.js extends the native \`fetch\` API with caching options, and provides \`React.cache()\` for per-request deduplication.

### The Three Fetching Strategies

**1. Static (SSG) — build once, serve forever**

\`\`\`tsx
// app/courses/page.tsx
// Fetches at BUILD TIME — result cached forever
const res = await fetch('https://api.example.com/courses', {
  cache: 'force-cache'
})
const courses = await res.json()
\`\`\`

Fastest possible delivery — the HTML is pre-generated and served from CDN. Use for content that rarely changes.

**2. ISR — rebuild on a schedule**

\`\`\`tsx
// Fetch with 60-second revalidation
const res = await fetch('https://api.example.com/courses', {
  next: { revalidate: 60 }
})

// Or set revalidation at the page level
export const revalidate = 60  // all fetches in this page revalidate every 60s

export default async function CoursesPage() {
  const courses = await getCourses()
  return <CourseList courses={courses} />
}
\`\`\`

The page is served from cache. After 60 seconds, the next request triggers a silent background regeneration. Users always get a fast response; data stays fresh.

**3. Dynamic (SSR) — fresh on every request**

\`\`\`tsx
const res = await fetch('https://api.example.com/user/profile', {
  cache: 'no-store'  // bypass cache entirely — always fresh
})
\`\`\`

Use for user-specific data — personalized content, real-time balances, private records that must never be cached across users.

### generateStaticParams — Pre-render Dynamic Routes

\`\`\`tsx
// app/courses/[id]/page.tsx
export async function generateStaticParams() {
  const courses = await getCourses()
  // Returns all the [id] values to pre-generate at build time
  return courses.map(c => ({ id: c.id }))
}

export default async function CoursePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) return notFound()

  return <CourseDetail course={course} />
}
\`\`\`

At build time, Next.js calls \`generateStaticParams\`, gets the list of IDs, and generates a static HTML page for each one. Visiting \`/courses/cc-react-m01\` serves pre-built HTML instantly.

### React cache() — Per-Request Deduplication

\`\`\`tsx
import { cache } from 'react'
import { COURSES } from '@/lib/courses'

// Wrapping getCourse in cache() deduplicates calls within one request
export const getCourse = cache(async (id: string) => {
  // In a real app, this would be a database query
  return COURSES.find(c => c.id === id) ?? null
})

// app/courses/[id]/page.tsx — calls getCourse(id) for the page
// app/courses/[id]/layout.tsx — also calls getCourse(id) for the breadcrumb
// Result: getCourse() executes once — both components share the result
\`\`\`

Without \`cache()\`, two server components calling \`getCourse('cc-react-m01')\` in the same request would hit the database twice. With \`cache()\`, the second call returns the memoized result.`,

    quiz: [
      { q: 'What does { next: { revalidate: 60 } } do?', options: ['Runs a 60ms timeout before fetching', 'Caches the response for 60 seconds then silently regenerates it in the background', 'Retries the request 60 times on failure', 'Adds a 60-second delay to the response'], correct: 1, explanation: 'next.revalidate is ISR at the fetch level. The cached response is served for 60 seconds, then Next.js regenerates it in the background on the next request.' },
      { q: 'What does generateStaticParams return?', options: ['A loading state for the page', 'An array of route param objects to pre-render as static HTML at build time', 'The page component itself', 'SEO metadata for the route'], correct: 1, explanation: 'generateStaticParams tells Next.js which [id] values to generate at build time. Each returned object becomes a static HTML page served from CDN.' },
      { q: 'What does React cache() do?', options: ['Caches data across multiple requests', 'Deduplicates identical function calls within a single render pass — multiple components share one execution', 'Speeds up client-side rendering', 'Required to use async server components'], correct: 1, explanation: 'React cache() is per-request deduplication. Two server components calling getCourse("same-id") in one render tree execute the function only once.' },
      { q: 'When should you use cache: "no-store"?', options: ['For images and static assets', 'For user-specific or real-time data that must never be cached across requests', 'For pages with static content', 'Never — always cache for performance'], correct: 1, explanation: 'no-store bypasses caching entirely. Use for user-specific data (profile, dashboard), real-time prices, or any data that must not be shared across users.' },
    ],

    ide: {
      language: 'javascript',
      task: 'Write an async fetchWithCache function that simulates Next.js fetch caching. It should support "force-cache" (return cached result), "no-store" (always fetch fresh), and a revalidate option (serve cache but fetch again after N seconds). Test all three strategies.',
      starterCode: `// Simulating Next.js fetch cache strategies in plain JS.

const cache = {}  // our simple in-memory cache

async function fakeFetch(url) {
  // Simulates a slow network request
  await new Promise(resolve => setTimeout(resolve, 30))
  return { data: \`Result from \${url}\`, timestamp: Date.now() }
}

async function fetchWithCache(url, options = {}) {
  const { cache: cacheOption, next } = options

  // TODO: implement cache strategies:
  // 1. If cacheOption === 'force-cache': return cached result if it exists,
  //    otherwise fetch and store it
  // 2. If cacheOption === 'no-store': always fetch fresh, never cache
  // 3. If next?.revalidate exists: return cached result if still fresh
  //    (within revalidate seconds), otherwise fetch and cache

  // Default: fetch fresh
  return await fakeFetch(url)
}

// Test force-cache
async function run() {
  console.log('--- force-cache (fetches once) ---')
  const r1 = await fetchWithCache('/api/courses', { cache: 'force-cache' })
  const r2 = await fetchWithCache('/api/courses', { cache: 'force-cache' })
  console.log('r1:', r1.timestamp)
  console.log('r2:', r2.timestamp)
  console.log('Same result?', r1.timestamp === r2.timestamp)
}

run()`,

      solution: `const cache = {}

async function fakeFetch(url) {
  await new Promise(resolve => setTimeout(resolve, 30))
  return { data: \`Result from \${url}\`, timestamp: Date.now() }
}

async function fetchWithCache(url, options = {}) {
  const { cache: cacheOption, next } = options

  if (cacheOption === 'force-cache') {
    // Return cached result if it exists, otherwise fetch and store
    if (cache[url]) {
      console.log(\`  [cache HIT] \${url}\`)
      return cache[url]
    }
    console.log(\`  [cache MISS — fetching] \${url}\`)
    const result = await fakeFetch(url)
    cache[url] = result
    return result
  }

  if (cacheOption === 'no-store') {
    // Always fetch fresh — never use or populate cache
    console.log(\`  [no-store — always fresh] \${url}\`)
    return await fakeFetch(url)
  }

  if (next?.revalidate) {
    const cached = cache[url]
    const now = Date.now()
    if (cached && (now - cached.timestamp) < next.revalidate * 1000) {
      console.log(\`  [ISR cache HIT] \${url}\`)
      return cached
    }
    console.log(\`  [ISR revalidating] \${url}\`)
    const result = await fakeFetch(url)
    cache[url] = result
    return result
  }

  return await fakeFetch(url)
}

async function run() {
  console.log('--- force-cache ---')
  const r1 = await fetchWithCache('/api/courses', { cache: 'force-cache' })
  const r2 = await fetchWithCache('/api/courses', { cache: 'force-cache' })
  console.log('Same result?', r1.timestamp === r2.timestamp) // true

  console.log('\\n--- no-store ---')
  const r3 = await fetchWithCache('/api/user', { cache: 'no-store' })
  const r4 = await fetchWithCache('/api/user', { cache: 'no-store' })
  console.log('Same result?', r3.timestamp === r4.timestamp) // false

  console.log('\\n--- ISR revalidate:60 ---')
  const r5 = await fetchWithCache('/api/news', { next: { revalidate: 60 } })
  const r6 = await fetchWithCache('/api/news', { next: { revalidate: 60 } })
  console.log('Same result?', r5.timestamp === r6.timestamp) // true (within window)
}

run()`,

      hints: [
        'For force-cache: check if cache[url] exists. If yes, return it. If no, fetch, store in cache[url], then return.',
        'For no-store: skip the cache entirely — just call fakeFetch(url) directly.',
        'For revalidate: check if a cached entry exists AND (Date.now() - cached.timestamp) < revalidate * 1000.',
      ]
    }
  },

  {
    id: 'cc-nextjs-m03', track: 'crash', title: 'API Routes & Server Actions',
    subtitle: 'Build backend endpoints and mutate data with Route Handlers and Server Actions.',
    moduleObjective: 'Create API routes with Route Handlers and perform mutations with Server Actions.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'Route Handler', definition: 'app/api/*/route.ts — exported HTTP handlers (GET, POST, PATCH, DELETE). Runs on the server. The App Router replacement for pages/api.' },
      { term: 'Server Action', definition: '"use server" — an async function that runs on the server, callable directly from client components. Eliminates separate API endpoints for mutations.' },
      { term: 'revalidatePath', definition: 'next/cache — clears the cached data for a route after a mutation, so the next request sees fresh data.' },
      { term: 'NextRequest', definition: 'Extends the Web Request API with helpers for cookies, geo, IP, and Next.js-specific URL parsing.' },
      { term: 'NextResponse', definition: 'Extends the Web Response API with .json(), .redirect(), and .rewrite() helpers. The standard return type from Route Handlers.' },
    ],
    content: `## API Routes & Server Actions

Next.js gives you two ways to run server-side logic:

1. **Route Handlers** — traditional REST API endpoints consumed by external clients, mobile apps, or third-party services
2. **Server Actions** — server functions called directly from React components, no HTTP overhead, fully type-safe

### Route Handlers

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

  // Validate, save to DB...
  const newCourse = await saveCourse(body)

  return NextResponse.json(newCourse, { status: 201 })
}
\`\`\`

The file exports named functions matching HTTP methods: \`GET\`, \`POST\`, \`PATCH\`, \`DELETE\`. No framework config — the export name is the method.

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
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  return NextResponse.json(course)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const updates = await req.json()
  const updated = await updateCourse(id, updates)
  return NextResponse.json(updated)
}
\`\`\`

### Server Actions — Mutations Without API Routes

Server Actions are async functions marked with \`'use server'\`. They run on the server, but client components can call them like regular JavaScript functions — no fetch, no endpoint, no CORS.

\`\`\`tsx
// app/actions/progress.ts
'use server'
import { revalidatePath } from 'next/cache'
import { saveCourseProgress } from '@/lib/db'

export async function markCourseComplete(courseId: string, userId: string) {
  // Runs on the server — can access DB, env vars, secrets directly
  await saveCourseProgress({ courseId, userId, completedAt: new Date() })

  // Clear the cache so the next page render shows updated progress
  revalidatePath('/courses')
  revalidatePath(\`/courses/\${courseId}\`)

  return { success: true }
}
\`\`\`

\`\`\`tsx
// app/components/CompleteButton.tsx
'use client'
import { useState } from 'react'
import { markCourseComplete } from '@/app/actions/progress'

export function CompleteButton({ courseId, userId }: { courseId: string; userId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleClick() {
    setLoading(true)
    await markCourseComplete(courseId, userId)  // calls server directly
    setDone(true)
    setLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={loading || done}>
      {done ? 'Completed!' : loading ? 'Saving...' : 'Mark Complete'}
    </button>
  )
}
\`\`\`

No API route. No endpoint URL. No fetch. The client button calls a server function by reference.

### When to Use What

| Use Case | Tool |
|---|---|
| Form submit, toggle, mutation from a React component | Server Action |
| REST API for a mobile app or external service | Route Handler |
| Webhook endpoint | Route Handler |
| Database mutation from a button click | Server Action |
| GraphQL endpoint | Route Handler |

### Error Handling in Route Handlers

\`\`\`tsx
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const result = await saveItem(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('POST /api/items error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
\`\`\``,

    quiz: [
      { q: 'Where do Route Handlers live in the App Router?', options: ['pages/api/ directory', 'app/ directory in route.ts files with named HTTP method exports', 'Any file with export default handler', 'middleware.ts'], correct: 1, explanation: 'Route Handlers are route.ts files with named exports matching HTTP methods: GET, POST, PATCH, DELETE. They live anywhere under app/ — typically in app/api/.' },
      { q: 'What is a Server Action?', options: ['A server-side API route', 'An async function marked "use server" that runs on the server and is callable directly from client components', 'A middleware function', 'A React hook for server requests'], correct: 1, explanation: 'Server Actions run on the server but can be called directly from client components like regular functions — no manual fetch, no endpoint URL, fully type-safe.' },
      { q: 'What does revalidatePath do?', options: ['Refreshes the browser tab', 'Invalidates the Next.js cache for a specific route so the next request fetches fresh data', 'Reloads the server process', 'Required after every database write'], correct: 1, explanation: 'revalidatePath tells Next.js to purge cached data for a route. The next visit re-executes the server component and fetches fresh data from the source.' },
      { q: 'When should you use a Server Action vs a Route Handler?', options: ['Server Actions are only for HTML forms', 'Server Actions for mutations from React components; Route Handlers for public API endpoints consumed by external clients', 'Route Handlers are always the better choice', 'They are functionally identical'], correct: 1, explanation: 'Server Actions are ideal for internal mutations — type-safe, co-located with components, no HTTP overhead. Route Handlers are for REST APIs consumed by external services.' },
    ],

    ide: {
      language: 'javascript',
      task: 'Build a handleRequest function that simulates a Next.js Route Handler. It should handle GET (return filtered courses), POST (validate and add a course), and return proper status codes and error messages for invalid requests.',
      starterCode: `// Simulating a Next.js Route Handler for /api/courses
// In Next.js: this is app/api/courses/route.ts

const courses = [
  { id: 'cc-js-m01', title: 'JavaScript Crash Course', track: 'crash', xp: 150 },
  { id: 'cc-react-m01', title: 'React Crash Course', track: 'crash', xp: 150 },
  { id: 'cc-ts-m01', title: 'TypeScript Crash Course', track: 'crash', xp: 150 },
]

function handleRequest(method, searchParams = {}, body = null) {
  // TODO: implement GET and POST handlers

  // GET: return all courses, or filter by searchParams.track if provided
  // POST: validate body has title and track, add to courses array
  //   - If body is missing title or track: return { error, status: 400 }
  //   - On success: return { course: newCourse, status: 201 }
  // Other methods: return { error: 'Method not allowed', status: 405 }
}

// Test GET — all courses
console.log('GET all:', handleRequest('GET'))

// Test GET — filtered
console.log('GET crash:', handleRequest('GET', { track: 'crash' }))

// Test POST — valid
console.log('POST valid:', handleRequest('POST', {}, { title: 'Next.js Course', track: 'crash', xp: 150 }))

// Test POST — missing title
console.log('POST invalid:', handleRequest('POST', {}, { track: 'crash' }))`,

      solution: `const courses = [
  { id: 'cc-js-m01', title: 'JavaScript Crash Course', track: 'crash', xp: 150 },
  { id: 'cc-react-m01', title: 'React Crash Course', track: 'crash', xp: 150 },
  { id: 'cc-ts-m01', title: 'TypeScript Crash Course', track: 'crash', xp: 150 },
]

function handleRequest(method, searchParams = {}, body = null) {
  if (method === 'GET') {
    const filtered = searchParams.track
      ? courses.filter(c => c.track === searchParams.track)
      : courses
    return { data: filtered, status: 200 }
  }

  if (method === 'POST') {
    if (!body || !body.title) {
      return { error: 'title is required', status: 400 }
    }
    if (!body.track) {
      return { error: 'track is required', status: 400 }
    }

    const newCourse = {
      id: \`cc-\${body.title.toLowerCase().replace(/ /g, '-')}\`,
      title: body.title,
      track: body.track,
      xp: body.xp || 150,
    }
    courses.push(newCourse)
    return { course: newCourse, status: 201 }
  }

  return { error: 'Method not allowed', status: 405 }
}

// Tests
console.log('GET all:', handleRequest('GET'))
console.log('GET crash track:', handleRequest('GET', { track: 'crash' }))
console.log('POST valid:', handleRequest('POST', {}, { title: 'Next.js Course', track: 'crash', xp: 150 }))
console.log('POST missing title:', handleRequest('POST', {}, { track: 'crash' }))
console.log('DELETE:', handleRequest('DELETE'))`,

      hints: [
        'Use if/else or a switch on the method parameter: "GET", "POST", etc.',
        'For GET, check if searchParams.track exists. If yes, filter courses array. If no, return all.',
        'For POST validation, check if body exists AND if body.title exists. Return { error, status: 400 } if invalid.',
      ]
    }
  },

  {
    id: 'cc-nextjs-m04', track: 'crash', title: 'Dynamic Routes & Params',
    subtitle: 'Build dynamic pages with route params, catch-all routes, and parallel routes.',
    moduleObjective: 'Implement dynamic routing including optional catch-all and parallel routes.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: '[id]', definition: 'Dynamic segment — matches any single path value. /courses/[id] matches /courses/cc-js-m01 and any other id.' },
      { term: '[...slug]', definition: 'Catch-all segment — matches any number of path segments. /docs/[...slug] matches /docs/intro, /docs/api/courses, etc.' },
      { term: '[[...slug]]', definition: 'Optional catch-all — matches zero or more segments. Matches both /docs and /docs/a/b.' },
      { term: 'Parallel Routes', definition: '@slot folders — render multiple pages simultaneously in the same layout. Used for modals, tabs, and split-pane views.' },
      { term: 'Intercepting Routes', definition: '(.) prefix — intercepts a route and shows it in a modal context without navigating away from the current page.' },
    ],
    content: `## Dynamic Routes & Params

Next.js routing handles flexible patterns for blogs, product pages, documentation, and complex UI patterns — all through folder naming conventions.

### Dynamic Segment — [id]

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

In Next.js 15, \`params\` and \`searchParams\` are Promises — always \`await\` them before accessing properties.

### notFound() and generateMetadata

\`\`\`tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params
  const course = COURSES.find(c => c.id === moduleId)

  if (!course) return { title: 'Not Found' }

  return {
    title: \`\${course.title} | JST Academy\`,
    description: course.moduleObjective,
    openGraph: {
      title: course.title,
      description: course.moduleObjective,
    },
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
  /docs  (slug is undefined with optional catch-all)
\`\`\`

\`\`\`tsx
// [slug] is an array of the path segments
export default async function DocsPage({
  params
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const path = slug.join('/')  // "api/courses/create"
  return <DocsContent path={path} />
}
\`\`\`

### Parallel Routes (Modal Pattern)

\`\`\`
app/
  layout.tsx           ← receives { children, modal }
  page.tsx             ← the main page
  @modal/              ← parallel slot
    (.)courses/
      [id]/
        page.tsx       ← rendered as a modal overlay
  courses/
    [id]/
      page.tsx         ← full course page
\`\`\`

\`\`\`tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}  {/* modal renders on top of the main page */}
    </>
  )
}
\`\`\`

This pattern powers Instagram-style route modals: clicking a photo opens it in a modal (intercepted route), but navigating to \`/photo/123\` directly shows the full page.

### URL Search Params

\`\`\`tsx
// Reading search params in a server component
export default async function CoursesPage({
  searchParams
}: {
  searchParams: Promise<{ track?: string; level?: string; page?: string }>
}) {
  const { track, level, page = '1' } = await searchParams

  const courses = await getCourses({ track, level, page: parseInt(page) })

  return (
    <div>
      <FilterBar currentTrack={track} currentLevel={level} />
      <CourseList courses={courses} />
      <Pagination currentPage={parseInt(page)} />
    </div>
  )
}
\`\`\``,

    quiz: [
      { q: 'What does [...slug] match?', options: ['One segment only', 'Any number of path segments — e.g., /docs/a/b/c gives slug as ["a","b","c"]', 'Optional segments', 'Only the root segment'], correct: 1, explanation: 'Catch-all [...slug] matches one or more path segments. The slug param is an array of all the matched segment strings.' },
      { q: 'What does notFound() do in a page component?', options: ['Returns a 200 with "not found" text', 'Throws a Not Found error — renders the nearest not-found.tsx with a 404 status', 'Redirects the user to /', 'Shows a blank page with no error'], correct: 1, explanation: 'notFound() is a Next.js navigation function that interrupts rendering, triggers the not-found boundary, and returns a 404 status to search engines.' },
      { q: 'What are parallel routes (@slot)?', options: ['Routes that redirect to each other', 'Multiple page segments rendered simultaneously in the same layout — for modals, split views, and tabs', 'Routes with faster loading', 'API routes running in parallel'], correct: 1, explanation: 'Parallel routes (@modal, @sidebar) are separate route segments rendered simultaneously in the layout. The layout receives each slot as a separate prop.' },
      { q: 'In Next.js 15, how do you access params in a page component?', options: ['props.params.id directly', 'const { id } = await params — params is a Promise in Next.js 15', 'useParams() hook', 'router.query.id'], correct: 1, explanation: 'In Next.js 15, params and searchParams are Promises. Always await them before accessing properties: const { id } = await params.' },
    ],
  },

  {
    id: 'cc-nextjs-m05', track: 'crash', title: 'Middleware & Authentication',
    subtitle: 'Protect routes and redirect users with middleware and Next.js auth patterns.',
    moduleObjective: 'Write middleware to protect routes and redirect unauthenticated users.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Masters',
    xp: 175, duration: 11, module: 5, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'middleware.ts', definition: 'Edge middleware — runs before every request matching the config.matcher. Can redirect, rewrite, add headers, and inspect cookies.' },
      { term: 'Edge Runtime', definition: 'Lightweight V8 runtime at the CDN edge. No Node.js APIs (no fs, path, net). Middleware always runs on the edge for global minimal latency.' },
      { term: 'config.matcher', definition: 'Array of route patterns that trigger middleware. Without it, middleware runs on every request including static files.' },
      { term: 'NextResponse.redirect', definition: 'Returns a redirect response from middleware. Use new URL() to build the destination from req.url.' },
      { term: 'Cookies', definition: 'req.cookies.get("session") — read cookies in middleware for session-based authentication checks.' },
    ],
    content: `## Middleware & Authentication

Middleware runs at the CDN edge before every matching request — before the request reaches your server, before the database is touched. This makes it ideal for:
- Authentication guards (redirect to login if no session)
- Geo-based redirects (different content by country)
- A/B testing (cookie-based feature flags)
- Rate limiting headers

Because middleware runs on the **Edge Runtime** (a V8 environment, not full Node.js), it has no access to \`fs\`, \`path\`, or other Node APIs. It runs in milliseconds near the user.

### Basic Middleware — Auth Guard

\`\`\`tsx
// middleware.ts (root of the project, next to package.json)
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const { pathname } = req.nextUrl

  const isProtected = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/courses') ||
                      pathname.startsWith('/profile')

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()  // proceed to the route normally
}

// Only run middleware on these routes (not static files, not API routes)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
\`\`\`

The matcher pattern excludes Next.js internals and static assets — if you skip this, middleware runs on every image and CSS file too.

### Role-Based Access

\`\`\`tsx
export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const role = req.cookies.get('role')?.value
  const { pathname } = req.nextUrl

  // Admin-only routes
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  // Any authenticated route
  if (
    (pathname.startsWith('/dashboard') || pathname.startsWith('/courses')) &&
    !session
  ) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
\`\`\`

### Reading Auth in Server Components

For auth checks in server components (not middleware), use the \`cookies()\` helper:

\`\`\`tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) redirect('/login')  // throws internally — stops rendering

  const user = await verifyToken(token)
  if (!user) redirect('/login')

  return user
}

// Protected page — automatically redirects if not authenticated
export default async function DashboardPage() {
  const user = await getUser()  // redirects to /login if no valid session

  return <Dashboard user={user} />
}
\`\`\`

### Adding User Context to Headers

Middleware can attach data to headers, making it available to server components downstream:

\`\`\`tsx
export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Decode token (lightweight — no DB call at edge)
  const userId = decodeJwtSub(token)  // edge-compatible JWT decode

  // Pass user id to downstream server components via headers
  const res = NextResponse.next()
  res.headers.set('x-user-id', userId)
  return res
}
\`\`\``,

    quiz: [
      { q: 'Where does Next.js middleware run?', options: ['On the origin server', 'At the CDN edge before every matching request — minimal latency globally', 'In the browser before routing', 'After the response is generated'], correct: 1, explanation: 'Next.js middleware runs at the edge (CDN) before the request reaches your origin server. Auth redirects and geo checks happen in milliseconds near the user.' },
      { q: 'What is config.matcher for?', options: ['Database query matching', 'Defines which routes trigger middleware — prevents it from running on static files and images', 'Required by TypeScript for middleware', 'Sets up rate limiting rules'], correct: 1, explanation: 'config.matcher controls which routes trigger middleware. Without it, middleware runs on every request including _next/static files — very wasteful.' },
      { q: 'How do you redirect in middleware?', options: ['throw redirect(url)', 'return NextResponse.redirect(new URL(path, req.url))', 'return null', 'router.push(url)'], correct: 1, explanation: 'NextResponse.redirect() returns a redirect response from middleware. Use new URL() to build a full URL relative to req.url — required for relative paths.' },
      { q: 'What APIs are NOT available in middleware?', options: ['Web fetch API', 'URL and Request APIs', 'Node.js fs, path, net modules', 'Cookies and headers'], correct: 2, explanation: 'Middleware runs on the Edge Runtime — a V8 environment without Node.js APIs. fs, path, net, and crypto (Node version) are unavailable. Use Web APIs instead.' },
    ],
  },

  {
    id: 'cc-nextjs-m06', track: 'crash', title: 'Image, Font & Metadata Optimization',
    subtitle: 'Optimize Core Web Vitals with next/image, next/font, and the Metadata API.',
    moduleObjective: 'Configure next/image, next/font, and generate metadata for SEO and social sharing.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'next/image', definition: 'Image component with automatic WebP/AVIF conversion, lazy loading, blur placeholder, and responsive sizes. Prevents Cumulative Layout Shift.' },
      { term: 'next/font', definition: 'Self-hosts Google Fonts at build time with zero layout shift. Fonts are served from your domain — no external DNS lookup, GDPR-friendly.' },
      { term: 'Metadata API', definition: 'export const metadata or generateMetadata() — sets page title, description, and Open Graph tags from server components.' },
      { term: 'sizes prop', definition: 'Tells the browser which image size to download based on viewport width. Critical for responsive images to avoid loading a 1200px image on mobile.' },
      { term: 'Open Graph', definition: 'og: meta tags that control how pages appear when shared on social media. Next.js Metadata API generates these automatically.' },
    ],
    content: `## Image, Font & Metadata Optimization

Three of the biggest Core Web Vitals killers are images, fonts, and missing metadata. Next.js has built-in solutions for all three.

### next/image — Automatic Optimization

\`\`\`tsx
import Image from 'next/image'

// Fixed-size — avatar, logo, icon
<Image
  src="/logo.png"
  alt="JST Academy"
  width={120}
  height={40}
  priority  // LCP image — skip lazy loading, load immediately
/>

// Responsive — hero, card cover
<div className="relative h-64">
  <Image
    src="/hero.jpg"
    alt="Academy Hero"
    fill                         // fills the parent container
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"  // hints for responsive sizing
    priority
  />
</div>
\`\`\`

What next/image does automatically:
- Converts images to **WebP** or **AVIF** (smaller file sizes)
- Applies **lazy loading** unless \`priority\` is set
- Reserves the correct space before the image loads (**prevents CLS**)
- Generates a **blur placeholder** for progressive loading (with \`placeholder="blur"\`)
- Generates responsive sizes via \`srcset\` for the \`sizes\` prop

For \`fill\` images, the parent must have \`position: relative\`.

### next/font — Zero-Shift Fonts

\`\`\`tsx
// src/app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',   // CSS variable for Tailwind
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

\`next/font\` downloads fonts at **build time** and hosts them on your domain. No external Google Fonts DNS request at runtime, no layout shift when fonts swap in, and no user tracking by Google (GDPR-friendly).

### Metadata API — SEO and Social Tags

\`\`\`tsx
// app/layout.tsx — static metadata (applies to all pages via template)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | JST Academy',   // page titles become "React Course | JST Academy"
    default: 'JST Academy',
  },
  description: 'PhD-level crash courses for modern web developers.',
  openGraph: {
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    siteName: 'JST Academy',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
\`\`\`

\`\`\`tsx
// app/courses/[id]/page.tsx — dynamic metadata from route params
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) return { title: 'Not Found' }

  return {
    title: course.title,             // becomes "React Crash Course | JST Academy"
    description: course.moduleObjective,
    openGraph: {
      title: course.title,
      description: course.moduleObjective,
      images: [{ url: \`/og/\${id}.jpg\`, width: 1200, height: 630 }],
    },
  }
}
\`\`\`

### Verifying Your Optimization

Test your pages with:
- **Google PageSpeed Insights** — real-world Core Web Vitals scores
- **Chrome DevTools Network tab** — verify images serve WebP format
- **Twitter Card Validator** / **Facebook Debugger** — verify OG tags render correctly on social`,

    quiz: [
      { q: 'What does next/image automatically do for images?', options: ['Nothing special beyond HTML img', 'Converts to WebP/AVIF, lazy loads, prevents CLS with reserved space, and generates responsive srcset', 'Only compresses file size', 'Requires manual optimization config for each image'], correct: 1, explanation: 'next/image handles format conversion (WebP/AVIF), responsive sizes, lazy loading, CLS prevention, and blur placeholders — Core Web Vitals improvements with no manual config.' },
      { q: 'Why use next/font over a Google Fonts <link>?', options: ['It is faster to implement', 'Self-hosts fonts at build time — zero layout shift, no external DNS request, no Google tracking (GDPR-friendly)', 'Required by Next.js for deployment', 'Same performance, different syntax'], correct: 1, explanation: 'next/font downloads fonts at build time and hosts them on your domain. No external DNS lookup, no font-swap layout shift, and no user data sent to Google.' },
      { q: 'What is the title template used for?', options: ['Page transition animations', 'Automatically formats page titles as "Page Title | App Name" across all child pages', 'Required for SEO crawlers to index pages', 'Generates breadcrumb navigation'], correct: 1, explanation: 'The title template ("%s | JST Academy") is applied to all child page titles automatically. Set it once in the root layout — child pages set only their own title.' },
      { q: 'What does the sizes prop on next/image do?', options: ['Sets the CSS width and height', 'Tells the browser which image width to download based on viewport — prevents loading a 1200px image on a 390px phone', 'Required when using the fill prop', 'Controls the image quality setting'], correct: 1, explanation: 'The sizes prop generates a srcset so browsers download only the appropriately-sized image for the current viewport. Critical for performance on mobile.' },
    ],
  },

  {
    id: 'cc-nextjs-m07', track: 'crash', title: 'Environment Variables & Config',
    subtitle: 'Manage environment variables, Next.js config, and TypeScript path aliases.',
    moduleObjective: 'Configure environment variables, path aliases, and Next.js build settings for secure deployments.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'PhD',
    xp: 200, duration: 10, module: 7, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'NEXT_PUBLIC_', definition: 'Prefix that exposes an env var to the browser bundle. Without this prefix, env vars are server-only and never sent to clients.' },
      { term: '.env.local', definition: 'Git-ignored local overrides. Highest priority. Never committed to version control. The correct place for local secrets during development.' },
      { term: 'Path alias (@/)', definition: '@/ maps to src/ — import "@/lib/courses" instead of "../../../lib/courses". Configured in tsconfig.json.' },
      { term: 'next.config.ts', definition: 'Build and runtime configuration — webpack, headers, redirects, image remote patterns, and experimental features.' },
      { term: 'Turbopack', definition: 'Next.js 15 dev bundler. Significantly faster than webpack for large projects. Enable with --turbopack in the dev command.' },
    ],
    content: `## Environment Variables & Config

### Environment Files — Priority Order

Next.js loads environment files in this order (highest to lowest priority):

\`\`\`
.env.local         ← highest — never committed (your local secrets)
.env.development   ← dev builds only (npm run dev)
.env.production    ← production builds only (npm run build)
.env               ← all environments (lowest priority, commit safe for non-secrets)
\`\`\`

Create \`.env.local\` for local secrets. Add it to \`.gitignore\` (Next.js does this automatically).

### Server vs Client Variables

\`\`\`bash
# Server-only — NEVER shipped to the browser (no NEXT_PUBLIC_ prefix)
DATABASE_URL=postgresql://...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
AZURE_SPEECH_KEY=abc123def456
STRIPE_SECRET_KEY=sk_live_...

# Browser-exposed — safe to expose, never put secrets here
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_APP_URL=https://academy.jsupremeconglomerate.online
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
\`\`\`

The \`NEXT_PUBLIC_\` vars are **inlined at build time** into the client bundle. If you accidentally put a secret in a \`NEXT_PUBLIC_\` variable, it is visible to anyone who inspects the browser's network tab or JavaScript source.

### TypeScript: Validate Env at Startup

\`\`\`tsx
// src/lib/env.ts — validates all required env vars when the server starts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),
  AZURE_SPEECH_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
// Throws at startup if any required var is missing or malformed
// Prevents silent runtime failures mid-request
\`\`\`

Import \`env\` from \`@/lib/env\` everywhere instead of \`process.env\` directly. You get autocomplete, type safety, and a server crash on startup (not a mid-request 500) if something is missing.

### next.config.ts

\`\`\`tsx
import type { NextConfig } from 'next'

const config: NextConfig = {
  // Allow images from these external domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Add security headers to all API routes
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    }]
  },
  // Permanent redirects
  async redirects() {
    return [{
      source: '/old-path',
      destination: '/new-path',
      permanent: true,  // 308 — tell search engines to update their index
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
\`\`\`

With this configured:
- \`import { COURSES } from '@/lib/courses'\` works from any file
- No more \`../../../lib/courses\` relative path gymnastics
- Move files freely without updating import paths

Next.js's \`create-next-app\` sets this up automatically. If you are adding it manually, also set \`baseUrl\` and ensure the path alias matches your folder structure.`,

    quiz: [
      { q: 'What prefix exposes an env var to the browser bundle?', options: ['PUBLIC_', 'NEXT_PUBLIC_', 'CLIENT_', 'BROWSER_'], correct: 1, explanation: 'NEXT_PUBLIC_ vars are inlined into the client bundle at build time. All other vars remain server-only and are never sent to the browser.' },
      { q: 'Which env file has the highest priority?', options: ['.env', '.env.production', '.env.local', '.env.development'], correct: 2, explanation: '.env.local has the highest priority and is never committed to git. Use it for local secrets — API keys, database URLs — during development.' },
      { q: 'What does validating env vars with zod provide?', options: ['Slower builds for safety', 'A server crash at startup if required vars are missing — prevents silent runtime failures mid-request', 'Required by Next.js for production', 'Only useful for production deployments'], correct: 1, explanation: 'Env validation at startup catches missing or malformed vars before the app serves any traffic — far better than a cryptic 500 error on a specific request.' },
      { q: 'What is next.config.ts used for?', options: ['Defining routes', 'Build and runtime configuration — image domains, custom headers, redirects, webpack customization', 'Environment variable definitions', 'TypeScript compiler settings'], correct: 1, explanation: 'next.config.ts is the build/runtime config for Next.js. Separate from .env files (environment variables) and tsconfig.json (TypeScript compilation).' },
    ],
  },

  {
    id: 'cc-nextjs-m08', track: 'crash', title: 'Deployment & Vercel',
    subtitle: 'Deploy Next.js to Vercel with environment setup, domain config, and CI/CD.',
    moduleObjective: 'Deploy a Next.js application to Vercel with custom domains and environment variables.',
    courseObjective: CC_NEXTJS_OBJ, crashId: 'cc-nextjs', crashTitle: 'Next.js', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'Next.js Crash Course',
    keyTerms: [
      { term: 'Vercel', definition: 'The deployment platform built by the Next.js team. Zero-config — push to git and your app deploys automatically with preview URLs for every branch.' },
      { term: 'Preview deployment', definition: 'Every PR and branch gets a unique preview URL. Test changes in production-like conditions before merging.' },
      { term: 'Production deployment', definition: 'The deployment aliased to your production domain. Triggered by pushing to your configured production branch (default: main).' },
      { term: 'vercel alias', definition: 'npx vercel alias <deploy-url> <domain> — points a custom domain to a specific deployment. Enables zero-downtime domain switching.' },
      { term: 'ISR revalidation', definition: 'On-demand revalidation via revalidatePath() or revalidateTag() clears the CDN cache globally across all Vercel edge nodes.' },
    ],
    content: `## Deployment & Vercel

Vercel is the zero-config deployment platform for Next.js — built by the same team. Every git push can deploy your app automatically with no server provisioning.

### Deploy from CLI

\`\`\`bash
# Install the Vercel CLI globally
npm i -g vercel

# Log in (first time)
vercel login

# Deploy to preview (staging URL for testing)
npx vercel

# Deploy to production
npx vercel --prod

# Alias a deployment to a custom domain
npx vercel alias <deployment-url> academy.jsupremeconglomerate.online
\`\`\`

### Environment Variables in Vercel

\`\`\`bash
# Add an env var (prompts for value securely)
vercel env add AZURE_SPEECH_KEY production
vercel env add AZURE_SPEECH_KEY preview

# Pull all Vercel env vars to local .env.local
# Keeps your local environment in sync with production
vercel env pull .env.local
\`\`\`

**Critical**: set env vars for **both Production and Preview**. Preview deployments are real Next.js apps — if env vars are missing, API routes fail on PR previews and you get false test results.

### CI/CD — Automatic Deployments via Git

Connect your repository to Vercel (vercel.com → Import Project → select repo). After that:

\`\`\`
Every push to main/master → production deployment (auto)
Every push to any other branch → preview deployment (auto)
Every PR → preview URL posted as a GitHub/GitLab comment (auto)
\`\`\`

No manual deploys needed. The deploy pipeline runs your TypeScript build, checks for errors, and rolls back automatically if the build fails.

### vercel.json — Deployment Config

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

### Pre-Launch Deployment Checklist

\`\`\`
✅ All env vars added to Vercel (Production AND Preview)
✅ Custom domain DNS configured (A record or CNAME pointing to Vercel)
✅ Domain aliased to latest production deployment
✅ next/image remotePatterns set for all external image hosts
✅ TypeScript build passes locally: npx tsc --noEmit
✅ No secrets in NEXT_PUBLIC_ vars or committed .env files
✅ Error boundaries wrap all critical routes
✅ generateMetadata added to key pages for SEO
✅ Performance check: Lighthouse score 90+ on production
\`\`\`

### Monitoring After Deploy

\`\`\`bash
# View runtime logs for your production deployment
vercel logs <project-name>

# Inspect a specific deployment
vercel inspect <deployment-url>

# List all deployments
vercel ls <project-name>
\`\`\`

Vercel also provides the **Analytics** and **Speed Insights** dashboards for real-user Core Web Vitals data — add \`@vercel/analytics\` and \`@vercel/speed-insights\` to your layout for automatic tracking.`,

    quiz: [
      { q: 'What triggers a production deployment on Vercel?', options: ['Any git commit to any branch', 'Push to the main/master branch (or whichever branch is configured as production)', 'Manual deploy command only', 'Any PR being opened'], correct: 1, explanation: 'Vercel watches the configured production branch (default: main/master). A push triggers an automatic build and production deployment.' },
      { q: 'Why set env vars on both Production and Preview?', options: ['Required by Vercel dashboard rules', 'Preview deployments are real Next.js apps that run your actual code — missing vars cause silent failures on PR previews', 'For staging environment parity', 'Only needed if using database vars'], correct: 1, explanation: 'Preview deployments run the same code as production. Missing env vars cause API routes and data fetching to fail on PR previews — invalidating your test results.' },
      { q: 'What does vercel alias do?', options: ['Creates a new Vercel project', 'Points a domain or subdomain to a specific deployment URL — atomic zero-downtime switch', 'Upgrades a deployment in place', 'Required for all custom domains'], correct: 1, explanation: 'vercel alias atomically switches a domain to point to a specific deployment URL. This enables zero-downtime domain switching and safe rollbacks.' },
      { q: 'What does vercel env pull do?', options: ['Uploads local env vars to Vercel', 'Downloads Vercel env vars to .env.local — keeps local and production in sync', 'Deletes all local env files', 'Shows the values of Vercel env vars in the terminal'], correct: 1, explanation: 'vercel env pull downloads your Vercel project\'s env vars to .env.local. Keeps local development consistent with production without exposing values in git.' },
    ],
  },
]
