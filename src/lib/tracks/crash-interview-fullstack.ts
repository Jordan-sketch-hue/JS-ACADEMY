import type { Course } from '../courses'

const CC_FS_OBJ = 'Master full-stack architecture, Next.js production patterns, auth flows, real-time features, and system design so you can build and explain complete features end-to-end in any technical interview.'

export const crashInterviewFullstackCourses: Course[] = [
  {
    id: 'cc-interview-fs-m01', track: 'crash', title: 'Full-Stack Architecture & HTTP',
    subtitle: 'Client-server lifecycle, SSR vs CSR vs ISR, and the request pipeline every interviewer asks about.',
    moduleObjective: 'Trace an HTTP request from browser to database and back, and pick the right rendering strategy for any scenario.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 1, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'SSR', definition: 'Server-Side Rendering — HTML generated per request on the server; fresh data, higher TTFB.' },
      { term: 'SSG', definition: 'Static Site Generation — HTML built at compile time; fastest delivery, stale data risk.' },
      { term: 'ISR', definition: 'Incremental Static Regeneration — static pages revalidated on a schedule or on-demand.' },
      { term: 'Hydration', definition: 'Client-side JS attaches event listeners to server-rendered HTML to make it interactive.' },
      { term: 'Edge Runtime', definition: 'Lightweight V8 isolates running at CDN nodes; no Node.js APIs, ultra-low latency.' },
      { term: 'RSC', definition: 'React Server Components — components that render only on the server, zero JS sent to client.' },
      { term: 'TTFB', definition: 'Time To First Byte — measures server response latency; key SSR performance indicator.' },
    ],
    content: `## Full-Stack Architecture & HTTP

### The HTTP Request Lifecycle (know every step)

\`\`\`
Browser
  │  DNS lookup: academy.jsupremeconglomerate.online → 76.76.21.21
  │  TCP handshake (SYN / SYN-ACK / ACK)
  │  TLS handshake (cert exchange, cipher negotiation)
  │
  ▼  GET /dashboard HTTP/2
CDN Edge
  │  Cache HIT? → return 304 / cached response
  │  Cache MISS? → forward to origin
  ▼
Next.js Server (Node.js / Edge Runtime)
  │  Middleware runs (auth check, redirects, A/B flags)
  │  Route matched → Server Component tree rendered
  │  DB queries fired (Supabase / Postgres)
  ▼
Database (Supabase / Postgres)
  │  Query planned, executed on connection pool
  │  Rows returned
  ▼
Server
  │  Serialize props → render HTML string
  │  Stream HTML chunks to client
  ▼
Browser
  │  Paint first chunk (FCP)
  │  Download JS bundle
  │  Hydrate interactive islands
  │  TTI (Time To Interactive)
\`\`\`

### SSR vs SSG vs ISR — pick the right one

| Scenario | Strategy | Why |
|---|---|---|
| User dashboard (personal data) | SSR | Different per user, can't cache |
| Marketing landing page | SSG | Same for everyone, max cache |
| Blog posts (update weekly) | ISR (revalidate: 3600) | Fresh enough, fast delivery |
| Real-time stock ticker | CSR + SWR | Must fetch client-side always |
| Admin table (1000 rows) | SSR + streaming | Server has DB access, stream rows |

### Next.js App Router rendering decision tree

\`\`\`typescript
// app/dashboard/page.tsx — SERVER COMPONENT (default)
// Runs on server, never ships to client bundle
export default async function Dashboard() {
  // Direct DB call — no API route needed!
  const user = await getUser()          // runs server-side
  const metrics = await getMetrics(user.id)  // runs server-side

  return (
    <main>
      <h1>Welcome {user.name}</h1>
      {/* Pass serializable props to client island */}
      <MetricsChart data={metrics} />   {/* client component */}
      <StaticSidebar />                 {/* server component */}
    </main>
  )
}

// app/dashboard/MetricsChart.tsx — CLIENT COMPONENT
'use client'
import { useState } from 'react'

export function MetricsChart({ data }: { data: Metric[] }) {
  const [filter, setFilter] = useState('7d')
  // useState, useEffect, event handlers — only here
  return <canvas onClick={() => setFilter('30d')} />
}
\`\`\`

### Middleware — runs before every request

\`\`\`typescript
// middleware.ts (root of project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired — runs at EDGE (fast!)
  const { data: { session } } = await supabase.auth.getSession()

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Attach user id to header for downstream use
  if (session) {
    res.headers.set('x-user-id', session.user.id)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
\`\`\`

### Interview answer: "Walk me through how your app handles a page load"

1. **Browser** resolves DNS, establishes TLS connection to edge CDN
2. **Middleware** fires at edge — validates JWT/session cookie, redirects if unauth
3. **Server Component** renders — fetches data directly from Postgres (no round-trip)
4. **HTML streams** to client in chunks — first chunk paints immediately (low FCP)
5. **JS bundle** downloads in parallel — React hydrates interactive components
6. **Client islands** (\`'use client'\`) attach event listeners, manage local state

Key point: Server Components eliminate the classic "fetch waterfall" — no API route needed for server-side data.`,
    quiz: [
      { q: 'Which rendering strategy should you use for a user profile page that shows personalized data?', options: ['SSG — build at compile time', 'SSR — render per request on server', 'ISR — revalidate every hour', 'CSR only — fetch in useEffect'], correct: 1, explanation: 'SSR renders per request, so each user gets their own data. SSG would serve the same HTML to everyone.' },
      { q: 'What is the primary advantage of React Server Components over traditional SSR?', options: ['They hydrate faster on the client', 'They eliminate JavaScript sent to the client for those components', 'They support useState and useEffect', 'They run in a Web Worker'], correct: 1, explanation: 'RSCs render on the server and send zero JS to the client bundle — they cannot use hooks or browser APIs.' },
      { q: 'Where does Next.js middleware run?', options: ['In the browser before React mounts', 'On the Node.js origin server only', 'At the Edge (CDN nodes) before the request reaches the server', 'Inside React Suspense boundaries'], correct: 2, explanation: 'Middleware runs at the Edge runtime — lightweight V8 isolates at CDN nodes — for minimal latency on auth checks and redirects.' },
      { q: 'What does "hydration" mean in the context of SSR?', options: ['Downloading fresh data from the server', 'Client-side JS attaching event handlers to server-rendered HTML', 'Caching HTML at the CDN edge', 'Parsing CSS and applying styles'], correct: 1, explanation: 'Hydration is the process where the client-side React bundle "takes over" the server-rendered HTML by attaching event listeners and setting up component state.' },
    ],
    ide: {
      language: 'typescript',
      task: 'Build a renderStrategy function that returns the best Next.js rendering approach given a scenario object. Handle SSG, SSR, ISR, and CSR.',
      starterCode: `type Scenario = {
  isPersonalized: boolean   // data differs per user
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'static'
  requiresAuth: boolean
}

type Strategy = 'SSG' | 'SSR' | 'ISR' | 'CSR'

function renderStrategy(s: Scenario): Strategy {
  // TODO: return the right strategy
  // Rules:
  // - realtime → CSR (must fetch client-side)
  // - personalized → SSR
  // - hourly/daily → ISR
  // - static + no personalization → SSG
  return 'SSG'
}

// Test cases
console.log(renderStrategy({ isPersonalized: true, updateFrequency: 'daily', requiresAuth: true }))   // SSR
console.log(renderStrategy({ isPersonalized: false, updateFrequency: 'realtime', requiresAuth: false })) // CSR
console.log(renderStrategy({ isPersonalized: false, updateFrequency: 'hourly', requiresAuth: false }))  // ISR
console.log(renderStrategy({ isPersonalized: false, updateFrequency: 'static', requiresAuth: false }))  // SSG`,
      hints: [
        'Check realtime first — it always forces CSR regardless of other flags',
        'isPersonalized means different data per user — only SSR handles that correctly',
        'ISR works when data updates on a schedule (hourly/daily) and is the same for all users',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m02', track: 'crash', title: 'Database Schema Design for Full Stack',
    subtitle: 'Migrations, foreign keys, ORMs, Row Level Security, and the N+1 problem every backend interview asks about.',
    moduleObjective: 'Design a normalized schema with proper relations, write migrations, and prevent the N+1 query problem.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 2, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'Migration', definition: 'A versioned SQL script that transforms schema state; forward (up) and reverse (down) steps.' },
      { term: 'Foreign Key', definition: 'A column referencing the primary key of another table; enforces referential integrity.' },
      { term: 'RLS', definition: 'Row Level Security — Postgres policies that filter rows based on the current user context.' },
      { term: 'N+1 Problem', definition: 'Fetching N related records with N separate queries instead of one JOIN; kills performance.' },
      { term: 'ORM', definition: 'Object-Relational Mapper — maps DB tables to language objects (Prisma, Drizzle, TypeORM).' },
      { term: 'Index', definition: 'A B-tree or hash structure on a column that speeds up reads at the cost of write overhead.' },
      { term: 'Connection Pool', definition: 'A cache of DB connections reused across requests; prevents exhausting Postgres connection limits.' },
    ],
    content: `## Database Schema Design for Full Stack

### Designing a schema — the interview mental model

Start with entities, then relationships, then constraints.

\`\`\`sql
-- Migration 001: users
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migration 002: posts (one user → many posts)
CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes — add after analyzing query patterns
CREATE INDEX idx_posts_author ON posts(author_id);        -- frequent JOIN
CREATE INDEX idx_posts_published ON posts(published)      -- frequent filter
  WHERE published = true;                                 -- partial index!

-- Migration 003: comments (many-to-many via junction possible, but here one-to-many)
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### Row Level Security (Supabase / Postgres)

\`\`\`sql
-- Enable RLS — rows invisible by default
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read published posts OR their own drafts
CREATE POLICY "read posts" ON posts
  FOR SELECT USING (
    published = true
    OR author_id = auth.uid()   -- auth.uid() = JWT sub claim
  );

-- Policy: users can only insert their own posts
CREATE POLICY "insert own posts" ON posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Policy: users can only update their own posts
CREATE POLICY "update own posts" ON posts
  FOR UPDATE USING (author_id = auth.uid());
\`\`\`

### The N+1 Problem — most common backend interview question

\`\`\`typescript
// BAD — N+1 queries
// 1 query for posts, then 1 query PER post for author = N+1 total
const posts = await db.query('SELECT * FROM posts LIMIT 10')
for (const post of posts) {
  post.author = await db.query(
    'SELECT * FROM users WHERE id = $1', [post.author_id]
  )
}
// 11 queries for 10 posts 😱

// GOOD — single JOIN
const posts = await db.query(\`
  SELECT
    p.*,
    json_build_object(
      'id',    u.id,
      'name',  u.name,
      'email', u.email
    ) AS author
  FROM posts p
  JOIN users u ON u.id = p.author_id
  LIMIT 10
\`)
// 1 query for 10 posts ✓

// GOOD with Prisma (ORM handles the JOIN)
const posts = await prisma.post.findMany({
  take: 10,
  include: { author: true },    // generates single LEFT JOIN
})
\`\`\`

### Drizzle ORM (modern, type-safe) — interview favorite

\`\`\`typescript
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email').unique().notNull(),
  name:      text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id:        uuid('id').primaryKey().defaultRandom(),
  authorId:  uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:     text('title').notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Declare relations for query builder
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}))

// Type-safe query — no N+1!
const postsWithAuthors = await db.query.posts.findMany({
  with: { author: true },
  where: (posts, { eq }) => eq(posts.published, true),
  limit: 10,
})
// postsWithAuthors is fully typed: Post & { author: User }[]
\`\`\`

### Schema design checklist for interviews

1. Every table has a **UUID primary key** (not auto-increment — safer for distributed systems)
2. Use **timestamptz** not **timestamp** (timezone-aware)
3. Add **ON DELETE CASCADE or SET NULL** on all FK constraints (explicit intent)
4. Create indexes on every **foreign key column** and **frequently filtered columns**
5. Enable **RLS** on tables with user-owned data
6. Write **migrations**, not manual ALTER TABLE in production`,
    quiz: [
      { q: 'You have 100 posts and need each post\'s author name. What\'s the minimum number of queries needed with a JOIN?', options: ['101 queries', '100 queries', '2 queries', '1 query'], correct: 3, explanation: 'A single JOIN fetches all posts with their authors in one query: SELECT p.*, u.name FROM posts p JOIN users u ON u.id = p.author_id.' },
      { q: 'What does ON DELETE CASCADE on a foreign key do?', options: ['Prevents deletion if referenced rows exist', 'Automatically deletes child rows when parent is deleted', 'Sets the foreign key to NULL when parent is deleted', 'Throws an error on delete'], correct: 1, explanation: 'CASCADE automatically removes all child rows (e.g. all posts by a user) when the parent row (the user) is deleted.' },
      { q: 'What is the purpose of a partial index like CREATE INDEX idx ON posts(published) WHERE published = true?', options: ['Indexes all rows for maximum coverage', 'Indexes only the subset of rows matching the condition, reducing index size', 'Forces all queries to use this index', 'Creates a unique constraint on published posts'], correct: 1, explanation: 'A partial index covers only the filtered rows, making it much smaller and faster for queries that always filter WHERE published = true.' },
      { q: 'What does auth.uid() return in a Supabase RLS policy?', options: ['The database superuser ID', 'The application service role ID', 'The sub claim from the user\'s JWT token', 'A random UUID for anonymous users'], correct: 2, explanation: 'auth.uid() extracts the sub (subject) claim from the JWT that Supabase injects into the Postgres session, representing the authenticated user\'s ID.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a batchLoadUsers function that solves the N+1 problem using a DataLoader pattern — collect all requested IDs, fetch once, return mapped results.',
      starterCode: `// Simulate a DB with a delay
async function dbQueryUsers(ids) {
  console.log(\`DB query for \${ids.length} users: [\${ids.join(', ')}]\`)
  // Simulate fetch delay
  const users = {
    'u1': { id: 'u1', name: 'Alice' },
    'u2': { id: 'u2', name: 'Bob' },
    'u3': { id: 'u3', name: 'Carol' },
  }
  return ids.map(id => users[id] || null)
}

// TODO: Implement DataLoader pattern
// batchLoadUsers should:
// 1. Collect all requested IDs in the same event loop tick
// 2. Fire ONE query for all of them
// 3. Return results mapped back to each caller
function createUserLoader() {
  let batch = []
  let scheduled = false

  return function load(id) {
    return new Promise((resolve) => {
      batch.push({ id, resolve })
      if (!scheduled) {
        scheduled = true
        // Use microtask/timeout to collect all requests in same tick
        Promise.resolve().then(async () => {
          const currentBatch = batch
          batch = []
          scheduled = false
          const ids = currentBatch.map(b => b.id)
          const results = await dbQueryUsers(ids)
          currentBatch.forEach((b, i) => b.resolve(results[i]))
        })
      }
    })
  }
}

// Test — should fire only 1 DB query for all 3
const loadUser = createUserLoader()
Promise.all([
  loadUser('u1'),
  loadUser('u2'),
  loadUser('u3'),
]).then(users => console.log('Users:', users))`,
      hints: [
        'The key is collecting all IDs before firing the query — Promise.resolve().then() defers to the next microtask, after synchronous code runs',
        'Keep a pending batch array; the first caller schedules the flush, subsequent callers just push to the same array',
        'Map results back by index — dbQueryUsers returns results in the same order as input IDs',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m03', track: 'crash', title: 'Next.js Production Patterns',
    subtitle: 'App Router data fetching, Server Actions, streaming, caching, and error boundaries.',
    moduleObjective: 'Use Next.js App Router patterns correctly — server vs client components, Server Actions, and the full caching model.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 3, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'Server Action', definition: 'An async function marked with "use server" that runs on the server, callable from client components via form or event.' },
      { term: 'Suspense Boundary', definition: 'A React component that shows a fallback while async children resolve; enables streaming HTML.' },
      { term: 'revalidatePath', definition: 'Next.js function that purges cached data for a specific route after a mutation.' },
      { term: 'fetch cache', definition: 'Next.js extends the native fetch API with cache and next.revalidate options for per-request caching.' },
      { term: 'Route Handler', definition: 'app/api/route.ts files — Next.js API endpoints with GET, POST, etc. named exports.' },
      { term: 'generateStaticParams', definition: 'Function that returns path segments for Next.js to statically generate dynamic routes at build time.' },
      { term: 'Parallel Routes', definition: 'app/@slot/page.tsx pattern for rendering multiple pages in the same layout simultaneously.' },
    ],
    content: `## Next.js Production Patterns

### Data fetching hierarchy in App Router

\`\`\`typescript
// app/courses/page.tsx — Server Component
// fetch() is automatically memoized within a request
async function getCourses() {
  // cache: 'no-store' = always fresh (like getServerSideProps)
  // next: { revalidate: 3600 } = ISR (like getStaticProps + revalidate)
  // default = cached indefinitely (like getStaticProps)
  const res = await fetch('https://api.example.com/courses', {
    next: { revalidate: 3600, tags: ['courses'] }
  })
  if (!res.ok) throw new Error('Failed to fetch courses')
  return res.json()
}

export default async function CoursesPage() {
  const courses = await getCourses()
  return (
    <ul>
      {courses.map(c => <li key={c.id}>{c.title}</li>)}
    </ul>
  )
}
\`\`\`

### Streaming with Suspense — show content incrementally

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { Skeleton } from '@/components/skeleton'

export default function Dashboard() {
  return (
    <main>
      {/* Critical above-the-fold content renders immediately */}
      <h1>Dashboard</h1>

      {/* Slow components stream in independently */}
      <Suspense fallback={<Skeleton rows={3} />}>
        <RecentActivity />   {/* async server component */}
      </Suspense>

      <Suspense fallback={<Skeleton rows={5} />}>
        <AnalyticsChart />   {/* another async server component */}
      </Suspense>
    </main>
  )
}

// Each async component fetches its own data
async function RecentActivity() {
  const activity = await fetchActivity()   // doesn't block AnalyticsChart
  return <ul>{activity.map(a => <li key={a.id}>{a.text}</li>)}</ul>
}
\`\`\`

### Server Actions — mutations without an API route

\`\`\`typescript
// app/courses/[id]/actions.ts
'use server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase'

export async function enrollCourse(courseId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('enrollments')
    .insert({ user_id: user.id, course_id: courseId })

  if (error) throw new Error(error.message)

  // Bust cache for this course page and user's dashboard
  revalidatePath(\`/courses/\${courseId}\`)
  revalidatePath('/dashboard')
  revalidateTag('enrollments')
}

// app/courses/[id]/page.tsx — Client Component using the action
'use client'
import { enrollCourse } from './actions'
import { useTransition } from 'react'

export function EnrollButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => enrollCourse(courseId))}
    >
      {isPending ? 'Enrolling...' : 'Enroll Now'}
    </button>
  )
}
\`\`\`

### Route Handlers (API routes in App Router)

\`\`\`typescript
// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CreateCourseSchema = z.object({
  title: z.string().min(3).max(200),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const level = searchParams.get('level')

  const courses = await getCourses({ level: level ?? undefined })
  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CreateCourseSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const course = await createCourse(parsed.data)
  return NextResponse.json(course, { status: 201 })
}
\`\`\`

### Error Handling — error.tsx and not-found.tsx

\`\`\`tsx
// app/courses/error.tsx — catches errors from page.tsx in same segment
'use client'

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong loading this course.</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// app/courses/[id]/not-found.tsx — shown when notFound() is called
import Link from 'next/link'

export default function CourseNotFound() {
  return (
    <div>
      <h2>Course not found</h2>
      <Link href="/courses">Back to courses</Link>
    </div>
  )
}
\`\`\``,
    quiz: [
      { q: 'What does revalidatePath("/courses") do in a Server Action?', options: ['Redirects the user to /courses', 'Purges the Next.js data cache for that route so the next request refetches fresh data', 'Triggers a full page reload on the client', 'Re-runs the generateStaticParams function'], correct: 1, explanation: 'revalidatePath invalidates the cached HTML and data for that route. The next visitor triggers a fresh render with up-to-date data.' },
      { q: 'Why do you wrap slow async Server Components in <Suspense>?', options: ['Suspense is required for all async components in App Router', 'It allows the page to stream — fast content renders first while slow parts load', 'It prevents the component from running on the client', 'It enables client-side data fetching for that component'], correct: 1, explanation: 'Suspense enables streaming — Next.js sends the page HTML in chunks. The fallback is sent first, then replaced when the async data resolves, improving TTFB.' },
      { q: 'What file must you create to handle errors thrown in a Next.js App Router page segment?', options: ['app/try-catch.tsx', 'app/segment/error.tsx', 'app/segment/boundary.tsx', 'app/error-handler.ts'], correct: 1, explanation: 'error.tsx must be a Client Component co-located in the same segment. It automatically becomes an Error Boundary wrapping the page.tsx in that segment.' },
      { q: 'A Server Action is marked "use server". Where does its code execute?', options: ['In a Web Worker on the client', 'Only during build time', 'Always on the server, even when called from a client component', 'In the edge runtime only'], correct: 2, explanation: '"use server" functions always run on the server. When a client component calls one, the browser sends a POST request to the Next.js server, which executes the function.' },
    ],
    ide: {
      language: 'typescript',
      task: 'Implement a withAuth higher-order function that wraps a Server Action and throws if no user session exists. Then write a createPost action using it.',
      starterCode: `// Simulated auth helpers
async function getSession(): Promise<{ userId: string; email: string } | null> {
  // In real app: supabase.auth.getUser() or jwt verification
  return { userId: 'user-123', email: 'alice@example.com' }  // change to null to test unauth
}

type AuthedAction<T, R> = (user: { userId: string; email: string }, data: T) => Promise<R>

// TODO: implement withAuth
// It should:
// 1. Call getSession()
// 2. If no session, throw new Error('Unauthorized')
// 3. If session exists, call the wrapped action with (user, data)
function withAuth<T, R>(action: AuthedAction<T, R>) {
  return async (data: T): Promise<R> => {
    // implement here
    throw new Error('not implemented')
  }
}

// TODO: use withAuth to create this action
const createPost = withAuth(async (user, data: { title: string; body: string }) => {
  console.log(\`Creating post for \${user.email}:\`, data)
  return { id: 'post-1', authorId: user.userId, ...data }
})

// Test
createPost({ title: 'Hello World', body: 'My first post' })
  .then(post => console.log('Created:', post))
  .catch(err => console.error('Error:', err.message))`,
      hints: [
        'withAuth returns a new async function that first calls getSession()',
        'If getSession() returns null, throw new Error("Unauthorized")',
        'If session exists, call action(session, data) and return its result',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m04', track: 'crash', title: 'State Management at Scale',
    subtitle: 'React Query, Zustand, when to use each, and the rules interviewers test you on.',
    moduleObjective: 'Choose the right state layer for any data type and implement server state caching with React Query.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 4, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'Server State', definition: 'Data that lives on the server and must be fetched, cached, synchronized, and updated asynchronously.' },
      { term: 'Client State', definition: 'UI state that lives only in the browser — modals open/closed, form values, selected tab.' },
      { term: 'staleTime', definition: 'React Query: how long cached data is considered fresh before a background refetch is triggered.' },
      { term: 'Optimistic Update', definition: 'Updating the UI immediately before the server responds, then rolling back on error.' },
      { term: 'Query Invalidation', definition: 'Marking cached queries as stale so they refetch — typically after a mutation succeeds.' },
      { term: 'Selector', definition: 'A function that derives a value from state — used in Zustand to subscribe to only part of the store.' },
      { term: 'Hydration', definition: 'Pre-populating the React Query cache with server-fetched data to avoid client-side loading states.' },
    ],
    content: `## State Management at Scale

### The three categories of state

| Category | Examples | Tool |
|---|---|---|
| Server state | User profile, posts, products | React Query / TanStack Query |
| Global UI state | Auth user, cart, theme, notifications | Zustand / Context |
| Local UI state | Modal open, input value, hover | useState / useReducer |

**The #1 mistake:** putting server state in Zustand/Context. Use React Query for anything that came from a server.

### React Query — server state done right

\`\`\`typescript
// 1. Provider setup (app/providers.tsx)
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,      // 1 min — don't refetch if fresh
        gcTime: 5 * 60 * 1000,     // 5 min — keep in cache after unmount
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

// 2. Query keys — treat as a URL, not a string
export const courseKeys = {
  all:    () => ['courses'] as const,
  list:   (filters: CourseFilters) => ['courses', 'list', filters] as const,
  detail: (id: string) => ['courses', 'detail', id] as const,
}

// 3. Custom hook
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: !!id,               // don't run if id is empty
    staleTime: 5 * 60 * 1000,   // course data is fresh for 5 min
  })
}

// 4. Mutation with optimistic update
export function useEnrollCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => enroll(courseId),

    onMutate: async (courseId) => {
      // Cancel any in-flight refetches
      await queryClient.cancelQueries({ queryKey: courseKeys.detail(courseId) })

      // Snapshot previous value for rollback
      const previous = queryClient.getQueryData(courseKeys.detail(courseId))

      // Optimistically update
      queryClient.setQueryData(courseKeys.detail(courseId), (old: Course) => ({
        ...old, isEnrolled: true
      }))

      return { previous, courseId }
    },

    onError: (_err, courseId, context) => {
      // Roll back on error
      if (context?.previous) {
        queryClient.setQueryData(courseKeys.detail(courseId), context.previous)
      }
    },

    onSettled: (_data, _err, courseId) => {
      // Always invalidate to ensure sync with server
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) })
    },
  })
}
\`\`\`

### Zustand — global client state

\`\`\`typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }   // persists to localStorage
  )
)

// Usage — subscribe to only what you need (prevents re-renders)
const user = useAuthStore(state => state.user)      // only re-renders when user changes
const logout = useAuthStore(state => state.logout)  // stable reference, no re-render`,
    quiz: [
      { q: 'You need to store the list of posts fetched from an API. Which state tool should you use?', options: ['useState in a parent component', 'Zustand global store', 'React Query with useQuery', 'useReducer with Context'], correct: 2, explanation: 'Posts are server state — they come from an API, need caching, background refetching, and deduplication. React Query is designed exactly for this.' },
      { q: 'What does queryClient.invalidateQueries() do?', options: ['Deletes the cached data immediately', 'Marks the matching queries as stale so they refetch on next access', 'Cancels all in-flight network requests', 'Resets the query to its initial loading state'], correct: 1, explanation: 'invalidateQueries marks cached data as stale. If the query is currently being observed (component is mounted), it triggers an immediate background refetch.' },
      { q: 'What is the purpose of the onMutate callback in a React Query mutation?', options: ['It runs after the mutation succeeds', 'It runs before the mutation fires, used for optimistic updates and capturing snapshots for rollback', 'It handles network errors automatically', 'It invalidates related queries'], correct: 1, explanation: 'onMutate fires synchronously before the mutationFn. You update the cache optimistically and save a snapshot so onError can roll back if the request fails.' },
      { q: 'When should you use a Zustand selector like useStore(state => state.user) instead of useStore()?', options: ['Only when the store has more than 10 keys', 'To prevent unnecessary re-renders — the component only re-renders when that specific slice changes', 'To make the store read-only', 'Selectors are required for TypeScript support'], correct: 1, explanation: 'Without a selector, useStore() re-renders the component on any store change. A selector subscribes to only the slice you need, avoiding extra renders.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a simple query cache with staleTime support. The cache should return cached data if fresh, or fetch new data if stale.',
      starterCode: `const STALE_TIME = 5000 // 5 seconds

// Simple in-memory query cache
const cache = new Map()

async function fakeApi(key) {
  console.log(\`[API] Fetching \${key}...\`)
  return { data: \`result-for-\${key}\`, fetchedAt: Date.now() }
}

// TODO: implement fetchWithCache(key, fetchFn, staleTime)
// - If cache has key AND data is not stale (within staleTime), return cached
// - Otherwise fetch fresh data, update cache, return it
async function fetchWithCache(key, fetchFn, staleTime = STALE_TIME) {
  // implement here
}

// Test
async function run() {
  const r1 = await fetchWithCache('courses', () => fakeApi('courses'))
  console.log('First fetch:', r1)

  const r2 = await fetchWithCache('courses', () => fakeApi('courses'))
  console.log('Second fetch (should be cached):', r2)

  // Wait for stale
  await new Promise(r => setTimeout(r, 6000))

  const r3 = await fetchWithCache('courses', () => fakeApi('courses'))
  console.log('After stale (should refetch):', r3)
}
run()`,
      hints: [
        'Store { data, fetchedAt } in the cache Map',
        'Compare Date.now() - cachedEntry.fetchedAt against staleTime to check freshness',
        'If fresh, return cachedEntry.data directly without calling fetchFn',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m05', track: 'crash', title: 'Authentication Full Stack',
    subtitle: 'Supabase Auth, JWT refresh cycles, protected routes, RBAC, and every auth flow interviewers probe.',
    moduleObjective: 'Implement a complete auth system with session management, protected routes, and role-based access control.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 5, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'JWT', definition: 'JSON Web Token — base64url-encoded header.payload.signature used for stateless auth.' },
      { term: 'Refresh Token', definition: 'A long-lived token stored in an HttpOnly cookie, used to obtain new access tokens.' },
      { term: 'RBAC', definition: 'Role-Based Access Control — permissions determined by the user\'s role (admin, member, viewer).' },
      { term: 'PKCE', definition: 'Proof Key for Code Exchange — OAuth 2.0 extension that prevents auth code interception in SPAs.' },
      { term: 'HttpOnly Cookie', definition: 'A cookie inaccessible to JavaScript, preventing XSS theft of session tokens.' },
      { term: 'CSRF Token', definition: 'A random secret synced between cookie and form to prevent Cross-Site Request Forgery.' },
      { term: 'Session Fixation', definition: 'Attack where an adversary sets a known session ID before the user logs in; mitigated by rotating session IDs on login.' },
    ],
    content: `## Authentication Full Stack

### JWT anatomy — interviewers always ask this

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header (base64url)
.
eyJzdWIiOiJ1c2VyLTEyMyIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9  ← payload
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   ← signature

Decoded payload:
{
  "sub": "user-123",          // subject (user ID)
  "email": "alice@example.com",
  "role": "admin",
  "iat": 1699999000,          // issued at
  "exp": 1700000000           // expires in 15 min (short-lived!)
}
\`\`\`

**JWTs are NOT encrypted** — anyone can decode the payload. They are SIGNED — the server verifies the signature to ensure it wasn't tampered with.

### Complete auth flow with Supabase

\`\`\`typescript
// lib/supabase/server.ts — server-side client
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )
}

// app/auth/callback/route.ts — handle OAuth / magic link callback
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    // Exchange PKCE code for session — sets HttpOnly cookies
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, req.url))
}
\`\`\`

### Role-Based Access Control (RBAC)

\`\`\`typescript
// 1. Store roles in user metadata
await supabase.auth.admin.updateUserById(userId, {
  app_metadata: { role: 'admin' }  // visible in JWT claims
})

// 2. Read role from session on server
async function getUserRole() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.app_metadata?.role ?? 'member'
}

// 3. Protect routes by role in middleware
export async function middleware(req: NextRequest) {
  const supabase = createMiddlewareClient({ req, res: NextResponse.next() })
  const { data: { session } } = await supabase.auth.getSession()

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  if (isAdminRoute) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url))
    const role = session.user.app_metadata?.role
    if (role !== 'admin') return NextResponse.redirect(new URL('/403', req.url))
  }

  return NextResponse.next()
}

// 4. RLS enforces the same rules at DB level
CREATE POLICY "admin only" ON sensitive_data
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
\`\`\`

### Interview question: "How do you handle expired tokens?"

\`\`\`
Token refresh flow:
1. Access token expires (15 min typical)
2. Client detects 401 from API
3. Client sends refresh token (HttpOnly cookie) to /auth/refresh
4. Server verifies refresh token, issues new access + refresh tokens
5. New refresh token stored in HttpOnly cookie (rotation)
6. Retry original request with new access token

Why HttpOnly cookie for refresh token?
- JS cannot read it → immune to XSS
- Sent automatically by browser
- HttpOnly + Secure + SameSite=Lax = maximum protection
\`\`\``,
    quiz: [
      { q: 'Why should JWT access tokens have a short expiration (15 minutes)?', options: ['Server performance — shorter tokens are faster to verify', 'If a token is stolen, the attacker can only use it for a short window before it expires', 'JWTs with long expiration cause browser cookie overflow', 'Short tokens are required by OAuth 2.0 spec'], correct: 1, explanation: 'JWTs are stateless — the server can\'t revoke them. A stolen short-lived token expires quickly. The refresh token flow then re-issues safely.' },
      { q: 'What makes an HttpOnly cookie secure against XSS attacks?', options: ['It encrypts its value', 'JavaScript running in the browser cannot read or access it', 'It is transmitted over HTTP not HTTPS', 'It expires after each request'], correct: 1, explanation: 'The HttpOnly flag tells the browser to block JavaScript access. Even if an attacker injects JS, they cannot steal the cookie via document.cookie.' },
      { q: 'Where should you store the user\'s role in Supabase for it to be available in JWT claims?', options: ['In the users table as a column', 'In app_metadata (server-controlled, not editable by user)', 'In user_metadata (user-editable)', 'In a separate roles table only'], correct: 1, explanation: 'app_metadata is set server-side by admins and is included in JWT claims. user_metadata can be modified by the user, so it must not be trusted for auth decisions.' },
      { q: 'What is PKCE and why is it used in SPAs?', options: ['A method to encrypt JWT payloads', 'An OAuth 2.0 extension that prevents auth code interception by proving the initiator is the same as the redeemer', 'A way to store refresh tokens securely in localStorage', 'A CORS header required for OAuth flows'], correct: 1, explanation: 'PKCE uses a code_verifier/code_challenge pair. Even if someone intercepts the auth code, they can\'t exchange it without the original code_verifier only the real client has.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a hasPermission function for RBAC. Given a user role and a required permission, return true if the role grants that permission.',
      starterCode: `// Role hierarchy and permissions
const PERMISSIONS = {
  viewer:  ['read:posts', 'read:profile'],
  member:  ['read:posts', 'read:profile', 'write:posts', 'write:comments'],
  admin:   ['read:posts', 'read:profile', 'write:posts', 'write:comments',
            'delete:posts', 'manage:users', 'manage:settings'],
}

// Roles inherit from lower roles (admin > member > viewer)
// TODO: implement hasPermission
// It should:
// - Return true if the role has the permission directly
// - Note: admin includes all member permissions, member includes all viewer permissions
// - Return false otherwise
function hasPermission(role, permission) {
  // implement here
  return false
}

// Tests
console.log(hasPermission('admin', 'manage:users'))   // true
console.log(hasPermission('member', 'write:posts'))   // true
console.log(hasPermission('viewer', 'write:posts'))   // false
console.log(hasPermission('member', 'delete:posts'))  // false
console.log(hasPermission('admin', 'read:posts'))     // true (inherited)`,
      hints: [
        'Look up the permissions array for the given role in the PERMISSIONS object',
        'Use Array.includes() to check if the permission exists in the role\'s array',
        'Handle an unknown role by returning false',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m06', track: 'crash', title: 'Real-Time & File Uploads',
    subtitle: 'Supabase Realtime, WebSockets, file uploads to Supabase Storage, and the patterns interviewers love.',
    moduleObjective: 'Implement real-time subscriptions and direct-to-storage file uploads with presigned URLs.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 6, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'WebSocket', definition: 'A persistent TCP connection enabling full-duplex real-time communication between client and server.' },
      { term: 'Supabase Realtime', definition: 'Postgres logical replication broadcast to clients via WebSocket; fires on INSERT/UPDATE/DELETE.' },
      { term: 'Presigned URL', definition: 'A time-limited URL granting temporary upload access to storage without exposing credentials.' },
      { term: 'Multipart Upload', definition: 'Breaking a large file into chunks uploaded in parallel; allows resumption on failure.' },
      { term: 'Optimistic UI', definition: 'Showing a file as uploaded before the server confirms, for perceived performance.' },
      { term: 'Long Polling', definition: 'Client sends a request, server holds it open until data is ready — predecessor to WebSockets.' },
      { term: 'SSE', definition: 'Server-Sent Events — one-way stream from server to client over HTTP; simpler than WebSocket for read-only feeds.' },
    ],
    content: `## Real-Time & File Uploads

### Supabase Realtime — listen to DB changes

\`\`\`typescript
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function useRealtimeMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Initial load
    supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at')
      .then(({ data }) => setMessages(data ?? []))

    // Realtime subscription
    const channel = supabase
      .channel(\`messages:\${channelId}\`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: \`channel_id=eq.\${channelId}\`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [channelId])

  return messages
}
\`\`\`

### File upload to Supabase Storage

\`\`\`typescript
// Client: upload with progress tracking
async function uploadFile(file: File, userId: string) {
  const supabase = createBrowserClient(...)

  const filePath = \`\${userId}/\${Date.now()}-\${file.name}\`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(data.path)

  return publicUrl
}

// Component with drag-drop and progress
'use client'
export function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    // Validate before upload
    if (file.size > 5 * 1024 * 1024) {
      alert('Max 5MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Images only')
      return
    }

    setUploading(true)
    try {
      const url = await uploadFile(file, 'user-123')
      onUpload(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      className="border-dashed border-2 p-8 text-center"
    >
      {uploading ? \`Uploading \${progress}%\` : 'Drop image here'}
    </div>
  )
}
\`\`\`

### Presence — who is online right now

\`\`\`typescript
export function usePresence(roomId: string) {
  const [online, setOnline] = useState<string[]>([])
  const supabase = createBrowserClient(...)

  useEffect(() => {
    const channel = supabase.channel(\`room:\${roomId}\`, {
      config: { presence: { key: 'user-123' } }  // current user's key
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnline(Object.keys(state))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: 'user-123', online_at: new Date().toISOString() })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  return online
}
\`\`\`

### Interview question: WebSocket vs SSE vs Long Polling

| Feature | WebSocket | SSE | Long Polling |
|---|---|---|---|
| Direction | Full-duplex (both ways) | Server → Client only | Server → Client only |
| Protocol | WS (TCP upgrade) | HTTP | HTTP |
| Auto-reconnect | No (must implement) | Yes (built-in) | Manual |
| Use case | Chat, games, presence | Live feeds, notifications | Simple updates |
| Complexity | High | Low | Medium |
| Proxy-friendly | Sometimes not | Yes | Yes |

Supabase Realtime uses WebSockets under the hood (via Phoenix channels).`,
    quiz: [
      { q: 'You need to show a live count of users currently viewing a page. Which Supabase feature handles this?', options: ['postgres_changes subscription', 'Presence channels', 'RLS policies', 'Realtime Broadcast'], correct: 1, explanation: 'Presence channels track who is "online" in a room. Each connected client tracks their state and all subscribers receive sync events when anyone joins or leaves.' },
      { q: 'What is a presigned URL in the context of file uploads?', options: ['A URL that redirects to the file after authentication', 'A time-limited URL that grants temporary upload access without exposing your credentials', 'A URL signed with the user\'s private key', 'An encrypted URL stored in the database'], correct: 1, explanation: 'Presigned URLs embed temporary credentials in the URL itself. The client uploads directly to storage (bypassing your server) for a limited time window.' },
      { q: 'Why should you validate file type and size on the client AND server?', options: ['Client validation is enough — it prevents invalid files', 'Client validation improves UX; server validation is the security boundary since client-side checks can be bypassed', 'Server validation is enough — client validation is optional', 'Both are required by browser security policy'], correct: 1, explanation: 'Client-side validation improves UX with immediate feedback. But any client-side check can be bypassed — the server must re-validate everything before accepting the upload.' },
      { q: 'When should you use Server-Sent Events (SSE) over WebSockets?', options: ['When you need bidirectional communication like chat', 'When you only need server-to-client one-way streaming and want simpler HTTP infrastructure', 'When the client needs to send binary data', 'SSE is always better than WebSockets'], correct: 1, explanation: 'SSE is one-way (server to client) over regular HTTP — works through all proxies, has built-in reconnection, and is simpler to implement for use cases like live feeds and notifications.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a simple EventEmitter class that supports on(event, handler), off(event, handler), and emit(event, data). This pattern underlies all real-time systems.',
      starterCode: `class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  // TODO: on(event, handler) — register a handler for an event
  on(event, handler) {

  }

  // TODO: off(event, handler) — remove a specific handler
  off(event, handler) {

  }

  // TODO: emit(event, data) — call all handlers for the event
  emit(event, data) {

  }
}

// Test
const emitter = new EventEmitter()

const handler1 = (data) => console.log('Handler 1:', data)
const handler2 = (data) => console.log('Handler 2:', data)

emitter.on('message', handler1)
emitter.on('message', handler2)
emitter.emit('message', { text: 'Hello' })   // both handlers fire

emitter.off('message', handler1)
emitter.emit('message', { text: 'World' })   // only handler2 fires`,
      hints: [
        'Store listeners as a Map or plain object: { eventName: [handler, handler, ...] }',
        'on: initialize array if needed, push the handler',
        'off: filter the handler out of the array',
        'emit: iterate the array for that event and call each handler with data',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m07', track: 'crash', title: 'Full-Stack System Design',
    subtitle: 'Design a real-time collaborative app, a file hosting service, and a notifications system end-to-end.',
    moduleObjective: 'Structure a complete full-stack system design answer covering frontend, backend, database, and infrastructure.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 7, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'CDN', definition: 'Content Delivery Network — distributed servers caching static assets close to users globally.' },
      { term: 'Fan-out', definition: 'Publishing one event to many subscribers — used in notification systems and news feeds.' },
      { term: 'Idempotency Key', definition: 'A unique key sent with a mutation so retries don\'t create duplicate records.' },
      { term: 'Eventual Consistency', definition: 'A distributed system guarantee that all nodes will converge to the same value given enough time.' },
      { term: 'CQRS', definition: 'Command Query Responsibility Segregation — separate models for reading and writing data.' },
      { term: 'Message Queue', definition: 'A buffer that decouples producers and consumers — RabbitMQ, SQS, Inngest.' },
      { term: 'Database Sharding', definition: 'Partitioning a database horizontally across multiple servers, each holding a subset of rows.' },
    ],
    content: `## Full-Stack System Design

### System design framework (always answer in this order)

1. **Clarify requirements** (2 min) — ask about scale, features, constraints
2. **High-level architecture** — boxes and arrows
3. **Data model** — tables, fields, relationships
4. **API design** — endpoints, request/response
5. **Deep dive** — one complex component (caching, real-time, etc.)
6. **Trade-offs** — what you'd change at 10x scale

### Design: Collaborative notes app (like Notion)

\`\`\`
Requirements:
- Users create, edit, share documents
- Real-time collaborative editing
- Rich text editor
- Version history
- 100k DAU

High-level architecture:
┌─────────────────────────────────────────────────────┐
│  Client (Next.js)                                   │
│  - Tiptap editor (rich text)                        │
│  - Y.js CRDT for conflict-free merging              │
│  - WebSocket connection to Realtime server          │
└──────────────┬──────────────────────────────────────┘
               │  HTTP (REST) + WebSocket
┌──────────────▼──────────────────────────────────────┐
│  Next.js API Routes + Server Actions                │
│  - Auth (Supabase Auth + middleware)               │
│  - Document CRUD                                    │
│  - WebSocket relay (Supabase Realtime channels)    │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│  Supabase (Postgres + Storage + Realtime)           │
│  documents: id, owner_id, title, content, updated  │
│  document_members: doc_id, user_id, role            │
│  snapshots: doc_id, content, version, created_at   │
└─────────────────────────────────────────────────────┘

Data flow for collaborative edit:
1. User A types → Y.js creates CRDT operation
2. Operation sent via WebSocket to Supabase Realtime
3. Realtime broadcasts to all users in doc channel
4. User B receives operation → Y.js merges without conflict
5. Every 30s: full document saved to Postgres
\`\`\`

### Design: Notification system

\`\`\`
Requirements:
- In-app notifications (bell icon)
- Email for important events
- Push notifications (mobile)
- Real-time badge counter
- Mark as read

Schema:
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,   -- 'comment', 'mention', 'like'
  actor_id    UUID REFERENCES users(id),
  entity_type TEXT,            -- 'post', 'comment'
  entity_id   UUID,
  read        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notif_user_unread ON notifications(user_id, read)
  WHERE read = false;   -- partial index — only unread!

Fan-out on write vs fan-out on read:
- Small follower count (<1000): fan-out on write (write to all feeds on post)
- Large follower count (>1000): fan-out on read (compute feed on request)

API:
GET  /api/notifications?limit=20&cursor=...
POST /api/notifications/:id/read
POST /api/notifications/read-all

Real-time badge:
- Supabase Realtime subscription on notifications table
- Filter: user_id=eq.{currentUserId} AND event=INSERT
- On new notification: increment badge counter
\`\`\`

### Trade-off questions interviewers ask

**"How would you handle 1M users?"**
- Postgres read replicas for heavy read queries
- Redis cache for user session lookup and notification counts
- Queue email delivery (don't send inline — decouple via Inngest/SQS)
- CDN all static assets + Next.js ISR for public pages

**"How do you prevent duplicate notifications?"**
- Idempotency key: hash(user_id + type + entity_id + date)
- INSERT … ON CONFLICT DO NOTHING
- Deduplication window: don't notify for same event within 5 min

**"How do you test real-time features?"**
- Unit test the logic (merge, fan-out) in isolation
- Integration test with a local Supabase instance
- E2E with Playwright: open two browser contexts, verify sync`,
    quiz: [
      { q: 'In a notification fan-out system, why would you use fan-out on READ for users with millions of followers?', options: ['Fan-out on read is always faster', 'Writing a notification to millions of follower feeds on each post would be too slow and costly', 'Fan-out on read doesn\'t require a database', 'Fan-out on write doesn\'t support real-time'], correct: 1, explanation: 'Fan-out on write copies the notification to every follower\'s feed at post time. For celebrities with millions of followers, this creates massive write amplification. Fan-out on read computes the feed lazily.' },
      { q: 'You need to prevent duplicate database inserts when a client retries a failed request. What is the best approach?', options: ['Check for existing records before inserting', 'Use INSERT ... ON CONFLICT DO NOTHING with a unique constraint or idempotency key', 'Delete and re-insert the record', 'Use a transaction that rolls back duplicates'], correct: 1, explanation: 'An idempotency key with a unique constraint plus ON CONFLICT DO NOTHING is atomic — no race condition between the check and insert that could allow duplicates.' },
      { q: 'Why is a partial index like CREATE INDEX ON notifications(user_id) WHERE read = false better than a full index?', options: ['Partial indexes are always faster to create', 'It indexes only unread notifications, making the most common query (fetch unread) faster with a smaller, more selective index', 'Full indexes don\'t support WHERE clauses', 'Partial indexes use less memory at write time'], correct: 1, explanation: 'A partial index on unread rows is much smaller than indexing all notifications. The query optimizer uses it for WHERE read = false filters, and it stays small as read notifications accumulate.' },
      { q: 'In the CRDT (Conflict-free Replicated Data Type) approach for collaborative editing, how are merge conflicts resolved?', options: ['The last writer always wins', 'A central server merges all changes sequentially', 'Operations are designed to commute — any order of applying them produces the same result', 'Users are prompted to manually resolve conflicts'], correct: 2, explanation: 'CRDTs use mathematical properties (commutativity, associativity, idempotency) so concurrent operations can be applied in any order and produce the same result without a central coordinator.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Design and implement a simple in-memory notification store with add, markRead, markAllRead, and getUnreadCount operations.',
      starterCode: `class NotificationStore {
  constructor() {
    this.notifications = []
  }

  // TODO: add(notification) — add with generated id, read: false, createdAt
  add(data) {

  }

  // TODO: markRead(id) — set read: true for notification with given id
  markRead(id) {

  }

  // TODO: markAllRead(userId) — mark all of this user's notifications as read
  markAllRead(userId) {

  }

  // TODO: getUnreadCount(userId) — return count of unread for this user
  getUnreadCount(userId) {

  }

  // TODO: getForUser(userId, limit) — return limit most recent notifications for user
  getForUser(userId, limit = 20) {

  }
}

// Test
const store = new NotificationStore()
store.add({ userId: 'u1', type: 'like', message: 'Alice liked your post' })
store.add({ userId: 'u1', type: 'comment', message: 'Bob commented' })
store.add({ userId: 'u2', type: 'mention', message: 'Carol mentioned you' })

console.log('Unread u1:', store.getUnreadCount('u1'))  // 2
store.markAllRead('u1')
console.log('Unread u1 after:', store.getUnreadCount('u1'))  // 0
console.log('Unread u2:', store.getUnreadCount('u2'))  // 1`,
      hints: [
        'For add, use crypto.randomUUID() or Date.now().toString() as id; spread data and add id, read: false, createdAt: new Date()',
        'For getForUser, filter by userId then sort by createdAt descending and slice to limit',
        'For getUnreadCount, filter by userId AND read === false and return length',
      ],
    },
  },

  {
    id: 'cc-interview-fs-m08', track: 'crash', title: 'Full-Stack Live Coding',
    subtitle: 'Build a complete feature end-to-end: from DB schema to API route to React component, live.',
    moduleObjective: 'Implement a complete full-stack feature from scratch under time pressure with clean, production-quality code.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 8, certArea: 'Full Stack Interview Prep',
    keyTerms: [
      { term: 'Pagination Cursor', definition: 'A pointer to the last fetched row (e.g. createdAt + id) enabling efficient infinite scroll without OFFSET.' },
      { term: 'Debounce', definition: 'Delay executing a function until after a pause in calls — used for search-as-you-type to reduce API calls.' },
      { term: 'Zod', definition: 'TypeScript-first schema validation library — validates at runtime and infers static types.' },
      { term: 'Skeleton Screen', definition: 'Placeholder UI matching the shape of loading content — perceived performance improvement over a spinner.' },
      { term: 'Composite Key', definition: 'A primary key made of multiple columns together — common in junction/join tables.' },
      { term: 'Derived State', definition: 'State computed from other state — should not be stored separately to avoid sync bugs.' },
      { term: 'Controlled Component', definition: 'A form input whose value is driven by React state, with onChange keeping them in sync.' },
    ],
    content: `## Full-Stack Live Coding

### The interview feature: "Build a bookmark system"

Requirements (given by interviewer):
- Users can bookmark any post
- Show bookmarks on a /bookmarks page
- Bookmark/unbookmark with a single button (toggle)
- Show count of bookmarks on each post
- Must handle concurrent clicks (no duplicate bookmarks)

### Step 1: Schema (2 min)

\`\`\`sql
-- Junction table — composite primary key prevents duplicates
CREATE TABLE bookmarks (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, post_id)   -- composite PK = natural dedup!
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);   -- for /bookmarks page
CREATE INDEX idx_bookmarks_post ON bookmarks(post_id);   -- for count per post
\`\`\`

### Step 2: Server Action (3 min)

\`\`\`typescript
// app/actions/bookmarks.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleBookmark(postId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check current state
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId)
  } else {
    // ON CONFLICT DO NOTHING handles race conditions
    await supabase.rpc('upsert_bookmark', {
      p_user_id: user.id,
      p_post_id: postId,
    })
  }

  revalidatePath('/bookmarks')
  revalidatePath(\`/posts/\${postId}\`)

  return { bookmarked: !existing }
}
\`\`\`

### Step 3: Bookmark button component (4 min)

\`\`\`tsx
// components/BookmarkButton.tsx
'use client'
import { useState, useTransition } from 'react'
import { toggleBookmark } from '@/app/actions/bookmarks'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'

interface Props {
  postId: string
  initialBookmarked: boolean
  initialCount: number
}

export function BookmarkButton({ postId, initialBookmarked, initialCount }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    // Optimistic update
    setBookmarked(b => !b)
    setCount(c => bookmarked ? c - 1 : c + 1)

    startTransition(async () => {
      try {
        await toggleBookmark(postId)
      } catch {
        // Roll back on error
        setBookmarked(b => !b)
        setCount(c => bookmarked ? c + 1 : c - 1)
      }
    })
  }

  const Icon = bookmarked ? BookmarkSolid : BookmarkIcon

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      className="flex items-center gap-1 text-sm"
    >
      <Icon className="w-5 h-5" />
      <span>{count}</span>
    </button>
  )
}
\`\`\`

### Step 4: Bookmarks page (3 min)

\`\`\`tsx
// app/bookmarks/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookmarkButton } from '@/components/BookmarkButton'

export default async function BookmarksPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(\`
      post_id,
      posts (
        id, title, created_at,
        users ( name )
      )
    \`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>
      {!bookmarks?.length && (
        <p className="text-gray-500">No bookmarks yet.</p>
      )}
      <ul className="space-y-4">
        {bookmarks?.map(({ posts: post }) => (
          <li key={post.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">by {post.users.name}</p>
            <BookmarkButton
              postId={post.id}
              initialBookmarked={true}
              initialCount={0}  // fetch actual count in production
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
\`\`\`

### What interviewers are evaluating

1. **Can you translate requirements to schema?** (composite PK = dedup)
2. **Do you handle race conditions?** (ON CONFLICT DO NOTHING)
3. **Do you use optimistic updates?** (instant UI feedback)
4. **Do you separate server/client correctly?** (Server Action + Client Component)
5. **Do you handle errors and roll back?** (try/catch + state revert)
6. **Do you invalidate caches?** (revalidatePath after mutation)`,
    quiz: [
      { q: 'Why is PRIMARY KEY (user_id, post_id) better than a separate id column for a bookmarks junction table?', options: ['Composite keys are faster to look up', 'It automatically prevents a user from bookmarking the same post twice — the DB enforces uniqueness', 'Primary keys must always be composite in Postgres', 'It reduces the table size by removing the id column'], correct: 1, explanation: 'A composite primary key creates a unique constraint on the combination of columns. INSERT … ON CONFLICT DO NOTHING then handles concurrent clicks gracefully without a race condition.' },
      { q: 'You update the bookmark count optimistically, then the server action fails. What must you do?', options: ['Reload the page', 'Show an error and leave the UI in the wrong state', 'Revert both the bookmarked flag and the count to their previous values', 'Retry the action automatically'], correct: 2, explanation: 'Both pieces of optimistic state must be reverted together. If you only revert one, the UI shows an inconsistent state (e.g. heart filled but wrong count).' },
      { q: 'What is the purpose of useTransition() in the BookmarkButton component?', options: ['It creates a CSS transition animation', 'It wraps the Server Action call so the UI stays responsive and isPending tracks the async operation', 'It prevents the component from re-rendering', 'It batches multiple state updates into one'], correct: 1, explanation: 'useTransition marks the state update as non-urgent. isPending becomes true while the Server Action runs, letting you disable the button and show loading state without blocking the UI.' },
      { q: 'Why call revalidatePath after a bookmark mutation instead of updating the cache manually?', options: ['revalidatePath is required after every Server Action', 'It\'s simpler and more reliable — it purges the route\'s cached HTML so the next request re-renders with fresh DB data', 'Manual cache updates are not possible in Next.js', 'revalidatePath sends a WebSocket to connected clients'], correct: 1, explanation: 'Manually updating the Next.js data cache is fragile and error-prone. revalidatePath purges the entire route so server-rendered pages automatically reflect the new DB state.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a debounce function (for search-as-you-type) and a throttle function (for scroll events). Both are common interview questions AND production necessities.',
      starterCode: `// debounce: delay execution until after 'wait' ms of silence
// Each new call resets the timer
function debounce(fn, wait) {
  // TODO: implement
}

// throttle: execute at most once per 'limit' ms
// First call fires immediately; subsequent calls within limit are ignored
function throttle(fn, limit) {
  // TODO: implement
}

// --- Tests ---

// Debounce test: should only log once after 300ms of silence
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query)
}, 300)

debouncedSearch('h')
debouncedSearch('he')
debouncedSearch('hel')
debouncedSearch('hell')
debouncedSearch('hello')
// Only "Searching for: hello" should appear (after 300ms)

// Throttle test: should log at most once per 1000ms
const throttledScroll = throttle(() => {
  console.log('Scroll event handled at', Date.now())
}, 1000)

throttledScroll() // fires immediately
throttledScroll() // ignored (within 1000ms)
setTimeout(throttledScroll, 500)   // still ignored
setTimeout(throttledScroll, 1200)  // fires (past 1000ms)`,
      hints: [
        'debounce: use a closure variable for the timer; clearTimeout on each call, then setTimeout the fn',
        'throttle: use a closure variable for lastRun (timestamp); if Date.now() - lastRun >= limit, run fn and update lastRun',
        'Both return a new function — the caller uses the returned function, not the original',
      ],
    },
  },
  {
    id: 'cc-interview-fs-m09', track: 'crash', title: 'Behavioral STAR Stories for Full-Stack Devs',
    subtitle: 'Turn your full-stack projects into compelling interview answers. Every "tell me about a time you…" question answered with structure and numbers.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'PhD', xp: 240, duration: 16, module: 9, certArea: 'Full Stack Interview Prep',
    content: `Full-stack interviews test both technical depth and your ability to own a feature end-to-end. Behavioral questions in these interviews are specifically designed to find out whether you can take a vague requirement and ship it, debug production issues, and coordinate across layers. The STAR framework is how you structure every answer.

## STAR for Full-Stack Roles

**Situation**: One sentence of context. "Our job board had no authentication — all users shared one view and could see each other's saved applications."

**Task**: Your specific scope. "I was responsible for adding auth and row-level data isolation as a solo developer with a two-week timeline."

**Action**: 3–5 specific steps, naming tools, schemas, and decisions. "I added Supabase Auth with email/password and Google OAuth. I created a user_id UUID column on the applications table. I enabled Row Level Security with a policy allowing SELECT/INSERT/UPDATE/DELETE only where user_id = auth.uid(). I updated the Next.js middleware to redirect unauthenticated users. I added a useUser hook and passed the session to all Server Components."

**Result**: A number. "Zero unauthorized data access in 3 months since launch. Onboarding conversion improved by 22% compared to the previous anonymous flow."

## Five Behavioral Questions for Full-Stack Roles

1. **"Tell me about a time you shipped a feature end-to-end."** — Your job board auth flow, a complete CRUD feature, or any feature that touched DB schema, API, and UI.

2. **"Describe a time you debugged a production issue."** — Hydration errors, Supabase policy blocking legitimate queries, N+1 query causing 5-second load times.

3. **"Tell me about a time you improved the architecture of a system."** — Migrating from client-side fetch to Server Components, adding RLS where it was missing, separating concerns in an overcrowded component.

4. **"Give an example of tradeoffs you made in a project."** — Supabase vs custom backend, App Router vs Pages Router, server-side pagination vs infinite scroll.

5. **"Tell me about a time you collaborated with or taught someone else."** — Writing clear PR descriptions, documenting an API for a teammate, explaining a data model to a non-technical stakeholder.

## Building Your Full-Stack Story Bank

Every story needs to span both layers. Weak: "I fixed a bug in the API." Strong: "The API was returning all rows instead of the user's rows — I debugged it to a missing RLS policy, added the policy, verified in Supabase Studio with a test user, and deployed. Response time improved by 40% because we went from fetching 800 rows to 12."

Your job board is a complete full-stack project. For each behavioral question, map which feature of it covers the scenario: auth (end-to-end feature), a slow query you optimized (debugging), a schema change (architecture), a tech choice (tradeoffs).`,
    keyTerms: [
      { term: 'End-to-End Ownership', definition: 'Responsibility for every layer of a feature — schema, API, and UI — without handing off to a specialist at each boundary.' },
      { term: 'Data Isolation', definition: 'The architecture pattern of ensuring users can only access their own data — implemented in full-stack with RLS at the database level.' },
      { term: 'Layer Traceability', definition: 'The ability to trace a behavioral story through all layers: "I changed the DB schema, updated the API, and adjusted the UI" — showing cross-stack fluency.' },
      { term: 'STAR Framework', definition: 'Situation, Task, Action, Result — the standard structure for behavioral interview answers, requiring at least one metric in the Result.' },
      { term: 'Story Bank', definition: 'A set of 5–8 prepared STAR stories covering the most common behavioral question patterns, adapted from real project work.' },
    ],
    quiz: [
      { q: 'A full-stack behavioral answer is stronger when:', options: ['It describes only the UI change', 'It spans all layers — schema change, API update, and UI implementation with a measurable result', 'It focuses on the hardest technical part only', 'It describes what the team did collectively'], correct: 1, explanation: 'Full-stack interviewers want cross-layer ownership. An answer that touches schema, API, and UI with a measurable outcome shows you can own a feature completely.' },
      { q: 'For the question "Tell me about a time you debugged a production issue," the most important element is:', options: ['How long the issue lasted', 'Your systematic approach to finding root cause, not just the fix', 'Which team member helped you', 'The complexity of the bug'], correct: 1, explanation: 'The process matters more than the outcome. Walking through hypothesis, isolation, and fix shows engineering maturity — not just that the bug got fixed.' },
      { q: 'Why is "I fixed a bug in the API" a weak behavioral answer for a full-stack role?', options: ['APIs are not relevant to full-stack interviews', 'It only covers one layer and has no quantified result', 'Bugs are negative — don\'t mention them', 'It is too short to be a valid STAR answer'], correct: 1, explanation: 'Full-stack behavioral answers should span layers. "I traced the API bug to a missing RLS policy, added the policy, and verified it in Supabase Studio — response time dropped 40%" is the complete version.' },
      { q: 'In the STAR framework for a full-stack story, the Action section should:', options: ['List one decision only', 'Name 3–5 specific steps across multiple layers with tool names', 'Describe what the team decided collectively', 'Be under 20 words'], correct: 1, explanation: 'Action is the largest, most specific part. Name tools (Supabase Studio, Next.js middleware, Drizzle ORM), layers touched (DB policy, API route, React component), and decisions made.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a STAR answer object for a full-stack behavioral story. Include: situation (one sentence of context), task (your specific scope), action (3–5 steps spanning at least two layers, with tool names), and result (at least one metric). Use a real scenario from your own projects.',
      starterCode: `const fullStackSTAR = {
  question: 'Tell me about a time you shipped a feature end-to-end.',
  situation: '',   // One sentence — what was missing or broken?
  task: '',        // Your specific responsibility, scope, and timeline
  action: '',      // 3-5 specific steps naming tools, layers, and decisions
  result: ''       // What improved? Include at least one number.
}

console.log(JSON.stringify(fullStackSTAR, null, 2))`,
      solution: `const fullStackSTAR = {
  question: 'Tell me about a time you shipped a feature end-to-end.',
  situation: 'Our job board had no authentication — every visitor saw the same shared view with no personal data.',
  task: 'I owned the complete auth implementation solo: database schema, Supabase Auth configuration, RLS policies, Next.js middleware, and UI session handling.',
  action: '1) Added user_id UUID column to the applications table with a foreign key to auth.users. 2) Enabled Row Level Security in Supabase with four policies (SELECT/INSERT/UPDATE/DELETE) scoped to auth.uid(). 3) Configured Supabase Auth with email/password and Google OAuth providers. 4) Added Next.js middleware to redirect unauthenticated requests to /login. 5) Created a useUser hook using useContext and passed the session to all Server Components via cookies.',
  result: 'Zero unauthorized data access incidents in the three months since launch. User conversion on the onboarding flow improved 22% — users who created accounts were completing more applications because they had a personal tracked pipeline.'
}

console.log(JSON.stringify(fullStackSTAR, null, 2))`,
      hints: ['Span at least two layers in the Action — DB schema change AND an API or UI change', 'The Result should include a metric — even an estimate ("roughly 20%") is better than "it worked"', 'Name specific tools: Supabase Studio, Next.js middleware, Drizzle schema, React hook'],
    },
  },
  {
    id: 'cc-interview-fs-m10', track: 'crash', title: 'Trade-off Articulation for Full-Stack Architecture',
    subtitle: 'Why SSR vs CSR, REST vs tRPC, Supabase vs custom API — the structured framework for defending every full-stack decision in an interview.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'PhD', xp: 240, duration: 15, module: 10, certArea: 'Full Stack Interview Prep',
    content: `Full-stack architects constantly make trade-off decisions. Senior interviewers ask "why did you choose X?" specifically to test whether you pick tools because they fit or because they're familiar. This module gives you a framework for any full-stack trade-off question.

## The Full-Stack Trade-off Framework

Every decision has the same five-part answer: **What were you building → What did you need it to do → What alternatives existed → What you chose and why → What you gave up**.

Saying "I used Supabase because it's popular" fails. Saying "I used Supabase because we needed relational data with RLS, a generous free tier, and built-in auth — I considered a custom Express+Postgres backend but estimated 3× more setup time for the same result, so I accepted the tradeoff of vendor dependency for development speed" passes.

## The 8 Critical Full-Stack Trade-off Questions

**1. SSR vs CSR vs ISR**
SSR (Server-Side Rendering): HTML generated per-request — best for SEO and real-time data. CSR (Client-Side): JS fetches data after page load — best for private dashboards. ISR (Incremental Static Regeneration): generated at build with optional revalidation — best for content that changes infrequently but needs SEO. Your job board's public listing pages are SSR; the application dashboard is CSR.

**2. REST vs tRPC vs GraphQL**
REST: simple, HTTP-native, well-understood. tRPC: type-safe RPC between TS client and server — zero code generation, great for Next.js monorepos. GraphQL: flexible queries, over-fetching prevention — overkill unless consumers have wildly different data needs.

**3. Supabase vs custom backend**
Supabase: auth, RLS, real-time, storage all built in. Custom: more control, no vendor dependency. For a solo project with relational data and auth needs, Supabase wins on time-to-ship.

**4. Server Components vs Client Components**
Server Components: run on the server, can access DB directly, reduce client bundle. Client Components: can use hooks, event handlers, browser APIs. Use Server Components by default; add 'use client' only when you need interactivity.

**5. React Query vs Server Components for data fetching**
React Query in a Client Component: best when the data changes often, needs background refetching, or is triggered by user action. Server Component fetch: best for initial page load data that doesn't change per interaction.

**6. JWT vs session cookies**
JWT: stateless, works across domains, but hard to revoke. Session cookies: stateful, revocable, tied to a domain. Supabase uses JWTs stored in httpOnly cookies — you get both statelessness and security.

**7. Optimistic updates vs server-confirmed updates**
Optimistic: update UI immediately, revert on failure — best for high-frequency actions (like/bookmark). Server-confirmed: wait for server — best for destructive actions (delete, publish, send).

**8. Monolith vs microservices**
For most teams under 20 engineers and most products under 100k DAU: monolith wins on simplicity and development speed. Microservices win on independent scaling — but the coordination cost is high. Don't default to microservices to sound sophisticated.`,
    keyTerms: [
      { term: 'SSR / CSR / ISR', definition: 'Three Next.js rendering modes: Server-Side Rendering (per-request HTML), Client-Side Rendering (browser fetches), and Incremental Static Regeneration (periodic revalidation).' },
      { term: 'tRPC', definition: 'Type-safe RPC for TypeScript full-stack apps — no schema definition files, end-to-end type safety between client and server without code generation.' },
      { term: 'Server Component', definition: 'A React component that runs only on the server — can access databases and secrets directly, has zero client bundle impact, but cannot use hooks or event listeners.' },
      { term: 'Optimistic Update', definition: 'Immediately reflecting a user action in the UI before the server confirms it, then reverting if the request fails — used for high-frequency, low-risk actions.' },
      { term: 'Vendor Dependency', definition: 'The accepted tradeoff of using a managed service like Supabase: faster development at the cost of portability — you depend on their uptime and pricing.' },
    ],
    quiz: [
      { q: 'When should you use ISR (Incremental Static Regeneration) instead of SSR for a page?', options: ['When the page data changes every second', 'When the page content changes infrequently and needs SEO, but doesn\'t require per-request freshness', 'When the page is behind authentication', 'When you need WebSocket connections'], correct: 1, explanation: 'ISR regenerates pages on a schedule (e.g., every hour), combining the SEO benefit of static HTML with reasonable freshness — perfect for blog posts, product pages, or job listings that change infrequently.' },
      { q: 'Why is tRPC a better choice than REST for a full-stack TypeScript Next.js app?', options: ['tRPC is faster at runtime', 'tRPC gives end-to-end type safety without schema files — the client knows the server\'s return types automatically', 'tRPC handles more request types than REST', 'tRPC works without a server'], correct: 1, explanation: 'In a TS monorepo, tRPC shares types between server and client automatically. REST requires manual type definitions or code generation (OpenAPI). For a Next.js app, tRPC eliminates an entire category of type mismatch bugs.' },
      { q: 'You have a bookmark button that users click frequently. Should you use optimistic updates or wait for server confirmation?', options: ['Wait for the server — accuracy matters more than speed', 'Use optimistic updates — the action is reversible and the UX benefit outweighs the small risk', 'Use WebSockets instead', 'Disable the button until the server responds'], correct: 1, explanation: 'Bookmarks are low-risk and reversible. Optimistic updates make the UX feel instant. If the server fails, you revert — a rare edge case users will forgive. For destructive actions (delete account), always wait for server confirmation.' },
      { q: 'When should you add "use client" to a Next.js component?', options: ['For all components by default', 'When the component needs hooks, event listeners, or browser APIs — otherwise keep it a Server Component', 'When the component fetches data from Supabase', 'When the component is used more than once in the app'], correct: 1, explanation: 'Server Components are the default and preferred — they reduce client bundle size and can access the DB directly. Add "use client" only when you need useState, useEffect, onClick, or browser-only APIs.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `architectureDecision(decision, criteria, alternatives, chosen, tradeoffAccepted)` that formats an architecture trade-off record. Then document two real decisions from your full-stack project using this function.',
      starterCode: `function architectureDecision(decision, criteria, alternatives, chosen, tradeoffAccepted) {
  return \`DECISION: \${decision}
CRITERIA: \${criteria}
ALTERNATIVES: \${alternatives.join(' vs ')}
CHOSEN: \${chosen}
TRADEOFF ACCEPTED: \${tradeoffAccepted}\`
}

// Document two real decisions from your project
const decision1 = architectureDecision(
  'Rendering strategy for public job listing pages',
  '...', ['...', '...'], '...', '...'
)

const decision2 = architectureDecision(
  'Auth and data layer',
  '...', ['...', '...'], '...', '...'
)

console.log(decision1)
console.log('---')
console.log(decision2)`,
      solution: `function architectureDecision(decision, criteria, alternatives, chosen, tradeoffAccepted) {
  return \`DECISION: \${decision}
CRITERIA: \${criteria}
ALTERNATIVES: \${alternatives.join(' vs ')}
CHOSEN: \${chosen}
TRADEOFF ACCEPTED: \${tradeoffAccepted}\`
}

const decision1 = architectureDecision(
  'Rendering strategy for public job listing pages',
  'SEO indexing (listings must be crawlable), fast initial load, real-time data not required',
  ['Next.js SSR (per-request)', 'Next.js ISR (revalidate every hour)', 'Vite SPA (CSR only)'],
  'Next.js SSR — each listing page renders on the server with current data, making it fully crawlable by Google. ISR was considered but job listings update frequently enough that stale data would be a problem.',
  'Slightly higher server compute cost vs ISR. Accepted because listing accuracy outweighs CDN savings at this scale.'
)

const decision2 = architectureDecision(
  'Auth and data layer',
  'Row-level security, built-in OAuth providers, relational data model, solo developer timeline',
  ['Supabase (managed Postgres + Auth)', 'Custom Express + Postgres + Auth0', 'Firebase (NoSQL)'],
  'Supabase — RLS policies handle data isolation at the DB level, built-in Google OAuth works in one config change, Postgres schema fits the relational data model (users, companies, jobs, applications).',
  'Vendor dependency — if Supabase raises prices or has an outage, migration is non-trivial. Accepted because time-to-ship advantage was approximately 3 weeks vs a custom backend.'
)

console.log(decision1)
console.log('---')
console.log(decision2)`,
      hints: ['Criteria should name what the decision needed to optimize for — not what you wanted to learn', 'The tradeoff accepted should be specific: "vendor dependency" or "higher server cost", not just "cons"', 'Use real decisions from your project — this is interview content'],
    },
  },
  {
    id: 'cc-interview-fs-m11', track: 'crash', title: '3am Full-Stack Incident — Debug Under Pressure',
    subtitle: 'Production is down at 3am. Walk through a systematic full-stack diagnosis: which layer is the problem, how to isolate it fast, and how to communicate.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'PhD', xp: 260, duration: 17, module: 11, certArea: 'Full Stack Interview Prep',
    content: `The 3am production scenario is a senior full-stack interview staple. The answer reveals how you think under pressure: do you panic and push untested changes, or do you systematically isolate the problem layer and communicate clearly?

## Full-Stack Incident Framework

The full-stack debugging order is always: **Network → Server → Database → Frontend**. Start from the outside and work inward.

**Step 1 — Is the site even reachable?** (Uptime monitor, curl)
A 502/503 response means the server is dead, not the application. Check Vercel deployment status, Railway/Render service health, or your hosting provider's status page.

**Step 2 — Is the server running but erroring?** (Vercel logs, Railway logs)
500 errors in server logs narrow you to the backend. A Next.js Server Component crash, an unhandled promise rejection, or a crashed API route all show in deployment logs within seconds.

**Step 3 — Is the database reachable and healthy?** (Supabase dashboard, connection pool)
If the server is healthy but all database queries fail, check Supabase project status. A paused project (free tier auto-pauses after 1 week of inactivity) silently fails all queries.

**Step 4 — Is it a frontend-only issue?** (Sentry, browser DevTools remotely)
If the server and DB are healthy but users see a blank page, check Sentry for client-side JS errors. A hydration mismatch, missing env variable in client bundle, or a broken chunk import can all cause this.

## A Full-Stack Scenario Walk-Through

**Scenario**: "Users are reporting they can't log in. The login page loads, but submitting the form returns a generic error. It's 3am. Walk me through your response."

**Step 1 — Scope**: Is it all users or specific ones? Check Sentry — seeing "Auth session not found" errors for all email/password attempts. Not affecting Google OAuth users. Narrowed: Supabase email auth is broken, OAuth is fine.

**Step 2 — Recent changes**: Last deployment was 6 hours ago. The PR updated the Supabase client initialization. Check the diff — the engineer changed \`createBrowserClient\` to \`createClient\` from \`@supabase/supabase-js\` instead of \`@supabase/ssr\`. The SSR client does not persist sessions in browser cookies, causing all server-side session reads to fail for email logins.

**Step 3 — Fix or rollback**: The fix is one import change. But at 3am, roll back first. Revert deployment in Vercel, verify login works with a test account. Email/password login restored in 4 minutes. Post a clear note in Slack: "Rolled back deployment — Supabase client import regression in the auth flow. Investigating root cause and will redeploy with fix after testing."

**Step 4 — Root cause fix**: Next morning, fix the import, add an auth integration test (simulate email login flow with Playwright), verify it passes in CI before merging.

## Common Full-Stack Production Incidents

- **Supabase project paused** (free tier): Restore in dashboard → Settings → Database → Restore Project
- **Missing env variable in production**: NEXT_PUBLIC_ prefix missing, or secret was in .env.local not added to Vercel env
- **RLS policy blocking legitimate requests**: Supabase Studio → Policies, test with \`SET LOCAL role = authenticated; SET LOCAL request.jwt.claims = '{"sub":"user-uuid"}';\`
- **N+1 query causing 30-second load times**: Each list item triggering a separate query — fix with JOIN or add .select('*, relation(*)')
- **CORS blocking API requests**: Frontend on different origin, API route missing headers or Supabase not configured for custom domain`,
    keyTerms: [
      { term: 'Layer Isolation', definition: 'Debugging by eliminating layers from the outside in: network → server → database → frontend — each confirmed working narrows the search.' },
      { term: 'Supabase SSR Client', definition: 'The @supabase/ssr createServerClient/createBrowserClient — designed to persist sessions in cookies for Next.js. Different from the generic @supabase/supabase-js createClient.' },
      { term: 'Free Tier Auto-pause', definition: 'Supabase pauses projects with no activity for 1 week on the free plan — all queries silently fail until manually restored.' },
      { term: 'RLS Policy Debug', definition: 'Testing Row Level Security by impersonating a user with SET LOCAL JWT claims in Supabase Studio or the SQL editor to verify policies behave correctly.' },
      { term: 'N+1 Query', definition: 'A performance anti-pattern where fetching a list of N items triggers N+1 separate database queries — resolved with JOINs or nested selects.' },
    ],
    quiz: [
      { q: 'Users report a blank page in production. The server logs show no errors. What is the most likely cause and first debugging step?', options: ['The server is down — check Vercel deployment', 'A client-side JS error — check Sentry for browser-side errors', 'The database is offline — check Supabase status', 'A CORS error — check API response headers'], correct: 1, explanation: 'If server logs are clean, the error is happening in the browser. Check Sentry for unhandled JS errors, hydration mismatches, or a broken import. Blank pages with no server errors are almost always client-side.' },
      { q: 'Your Supabase free-tier project is returning errors for all queries. The most likely cause is:', options: ['Rate limiting from too many requests', 'An expired API key', 'The project auto-paused after a week of inactivity', 'A schema migration that dropped the wrong table'], correct: 2, explanation: 'Supabase free-tier projects auto-pause after 7 days of no activity. The fix is: Supabase dashboard → Settings → Database → Restore Project. This is a common 3am production panic with a one-click fix.' },
      { q: 'The correct debugging order for a full-stack production incident is:', options: ['Frontend → API → Database → Network', 'Database → Server → Network → Frontend', 'Network → Server → Database → Frontend (outside in)', 'Check recent commits first, then narrow the layer'], correct: 2, explanation: 'Start from the outermost layer: Is the site reachable? (Network) → Is the server responding? → Is the DB healthy? → Is it a frontend JS error? Each layer confirmed narrows your search space.' },
      { q: 'At 3am, you identify a one-line fix for a production bug. The safest action is:', options: ['Push the fix immediately — you know exactly what\'s wrong', 'Roll back first to restore service, then deploy the fix tomorrow after testing', 'Disable the feature in a feature flag', 'Leave it until morning — one-line fixes can still break things'], correct: 1, explanation: 'Rollback restores service immediately with zero new risk. Push tested fixes during business hours. A one-line change still goes through CI and code review — 3am is not the time for shortcuts.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `debugIncident(symptom, affectedUsers, recentChanges, hypothesis, layersChecked, resolution)` that formats a systematic incident diagnosis. Fill it in for the "users can\'t log in" scenario from this module.',
      starterCode: `function debugIncident({ symptom, affectedUsers, recentChanges, hypothesis, layersChecked, resolution }) {
  // Format the incident diagnosis as a structured report
}

const loginIncident = debugIncident({
  symptom: '...',
  affectedUsers: '...',
  recentChanges: '...',
  hypothesis: '...',
  layersChecked: [],
  resolution: '...'
})

console.log(loginIncident)`,
      solution: `function debugIncident({ symptom, affectedUsers, recentChanges, hypothesis, layersChecked, resolution }) {
  return \`SYMPTOM: \${symptom}
AFFECTED USERS: \${affectedUsers}
RECENT CHANGES: \${recentChanges}
LAYERS CHECKED: \${layersChecked.join(' → ')}
HYPOTHESIS: \${hypothesis}
RESOLUTION: \${resolution}\`
}

const loginIncident = debugIncident({
  symptom: 'Login form submits but returns generic error — users cannot authenticate',
  affectedUsers: 'All email/password users. Google OAuth users unaffected.',
  recentChanges: 'Deployment 6 hours ago — PR changed Supabase client initialization from @supabase/ssr createBrowserClient to @supabase/supabase-js createClient',
  hypothesis: 'The wrong Supabase client is being used — @supabase/supabase-js createClient does not persist sessions in cookies for Next.js SSR, causing all server-side session reads to fail',
  layersChecked: ['Network (site loads)', 'Server (Vercel logs clean)', 'Sentry (Auth session not found errors for email logins only)', 'Deployment diff (found Supabase client import change)'],
  resolution: 'Rolled back deployment via Vercel dashboard in 4 minutes. Next morning: restored correct @supabase/ssr import, added Playwright auth integration test, deployed after CI passed.'
})

console.log(loginIncident)`,
      hints: ['Layer checking should go outside-in: network, server, DB, then client/code', 'Hypothesis should name the specific line or change you suspect, not just "a bug in auth"', 'Resolution should separate the immediate fix (rollback) from the root cause fix (code change + test)'],
    },
  },
  {
    id: 'cc-interview-fs-m12', track: 'crash', title: 'Product Thinking for Full-Stack Engineers',
    subtitle: 'Full-stack engineers who think like product owners get the offer. Learn to connect every technical decision to user outcomes and business results.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'PhD', xp: 260, duration: 16, module: 12, certArea: 'Full Stack Interview Prep',
    content: `Full-stack engineers are uniquely positioned to own product outcomes — they control the entire vertical slice from database to user interface. The engineers who advance fastest are not the ones who wait for a product manager to define a spec — they're the ones who ask "what problem does this solve?" before opening a code editor.

## The Full-Stack Product Mindset

Product thinking for a full-stack engineer means asking three questions at every layer:

- **DB layer**: Does this schema capture the data we need to make the product work and measure success? Is this the right normalized vs denormalized structure for the query patterns we'll need?
- **API layer**: Is this the right API surface? Would a different shape make the frontend simpler? Are we fetching too much or too little?
- **UI layer**: Does this interface help the user complete their job-to-be-done, or are we just building the feature the spec described?

## Product Story for Your Job Board

Weak narrative: "I built a job board with Next.js, Supabase, and Tailwind."

Strong narrative: "I built a job board to solve my own problem as an active job seeker — managing applications across 15 different portals was chaotic. I designed the schema around three jobs-to-be-done: discover matching roles, track application status, and prepare for interviews with stored company research. The stack decisions were driven by the product: Next.js SSR for SEO (job listings need to be indexed), Supabase for relational data with row-level isolation (each user sees only their applications), and Tailwind for fast UI iteration during the feature discovery phase."

## Connecting Technical Decisions to Product Outcomes

Full-stack engineers often make technical decisions that have direct product impact. Practice naming the product outcome for each major decision:

- **Added RLS at the DB layer** → Product outcome: users trust the product with their private application data
- **Added SSR to listing pages** → Product outcome: 3× more organic traffic from Google, reducing CAC
- **Added optimistic updates to bookmark button** → Product outcome: 40% fewer "did this work?" clicks and re-tries
- **Added error boundaries to dashboard** → Product outcome: a broken widget no longer loses the user's whole session

## Questions You Will Face

**"What would you prioritize if you had 3 more weeks on this project?"**
Wrong: "Add more features" or "use a new framework."
Right: "I'd add email reminders for follow-up dates — I observed that applications older than 2 weeks never get followed up on. That's the highest-impact user problem I haven't solved yet."

**"How would you measure the success of your job board?"**
Right: Primary metric — weekly active users completing at least one application tracked per session. Guardrail — time-to-complete an application tracking action stays under 30 seconds (don't add friction in the name of features).

**"Why does the world need another job board?"**
This is a product thinking question disguised as a challenge. Answer: "It doesn't — this is a personal productivity tool that solves my specific problem. But building it taught me to design a product around a user's job-to-be-done, not around a technology stack."`,
    keyTerms: [
      { term: 'Vertical Slice Ownership', definition: 'Owning a feature from database schema through API to UI — the defining capability of a full-stack engineer that enables product thinking.' },
      { term: 'Schema for Product Outcomes', definition: 'Designing a database schema around the queries the product needs and the data needed to measure success, not just around normalized theory.' },
      { term: 'Job-to-be-Done', definition: 'The specific task a user hires the product to do: "When I am tracking applications, I want to see status at a glance, so I can prioritize follow-ups."' },
      { term: 'Product Metric', definition: 'A measurable outcome indicating the product is delivering user value — e.g., weekly active users completing a tracked application, not page views.' },
      { term: 'Guardrail Metric', definition: 'A secondary constraint ensuring improving the primary metric doesn\'t cause harm — e.g., don\'t improve engagement at the cost of session completion time.' },
    ],
    quiz: [
      { q: 'A full-stack engineer designs a schema to "properly normalize the data." What question should they ask first?', options: ['Which ORM supports this schema best?', 'What queries will the product need to run? Does this schema support them efficiently?', 'How many tables will this create?', 'Does this match the schema from my last project?'], correct: 1, explanation: 'Normalization is a tool, not a goal. The schema should be designed around the product\'s query patterns and data needs — over-normalized schemas often perform poorly for the specific access patterns a product requires.' },
      { q: 'An interviewer asks "What would you prioritize in 3 more weeks?" The strongest answer:', options: ['Names a new technology to learn', 'Identifies the highest-impact unsolved user problem, grounded in observed behavior', 'Lists all features that are missing', 'Says the product is complete as-is'], correct: 1, explanation: 'Product thinking prioritizes by user impact. "I\'d add follow-up reminders because I observed applications older than 2 weeks never get followed up on" shows a user problem driving the roadmap.' },
      { q: 'Which technical decision has a clear product outcome?', options: ['"I normalized the schema to 3NF" — outcome: cleaner codebase', '"I added SSR to listing pages" — outcome: 3× more organic traffic from Google, reducing CAC', '"I used TypeScript" — outcome: fewer bugs', '"I chose Tailwind" — outcome: faster development'], correct: 1, explanation: 'SSR directly enables SEO, which drives organic traffic. That\'s a product and business outcome, not just a technical choice. Always connect technical decisions to user-facing or business-facing results.' },
      { q: 'The primary metric for your job board should be:', options: ['Total page views per month', 'Lighthouse performance score', 'Weekly active users completing at least one tracked application per session', 'Number of job listings indexed by Google'], correct: 2, explanation: 'Primary metrics measure whether the product is delivering its core value. The job board\'s value is helping users manage applications — "users completing a tracked application" is the right measure. Page views and Lighthouse scores are vanity and proxy metrics.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `productSlice(dbDecision, apiDecision, uiDecision)` that formats a full-stack product ownership narrative — for each layer, state the technical decision and its product outcome. Fill it in for one feature from your job board.',
      starterCode: `function productSlice(feature, dbDecision, apiDecision, uiDecision) {
  return \`FEATURE: \${feature}

DB LAYER: \${dbDecision}
API LAYER: \${apiDecision}
UI LAYER: \${uiDecision}\`
}

// Document one feature from your project — name the decision AND its product outcome at each layer
const authFeature = productSlice(
  'User authentication and data isolation',
  'DB decision: ... → Product outcome: ...',
  'API decision: ... → Product outcome: ...',
  'UI decision: ... → Product outcome: ...'
)

console.log(authFeature)`,
      solution: `function productSlice(feature, dbDecision, apiDecision, uiDecision) {
  return \`FEATURE: \${feature}

DB LAYER: \${dbDecision}
API LAYER: \${apiDecision}
UI LAYER: \${uiDecision}\`
}

const authFeature = productSlice(
  'User authentication and data isolation',
  'DB: Added user_id FK on applications + RLS policies scoped to auth.uid() → Product outcome: Users trust the product with private job search data — no accidental data leaks possible at the application layer.',
  'API: Used Supabase SSR client in middleware to validate sessions server-side before returning any data → Product outcome: No unauthenticated data exposure even if client-side code has a bug.',
  'UI: Added persistent session with cookie-based auth so users don\'t re-login on refresh + Google OAuth for one-click signup → Product outcome: Onboarding friction reduced — users who signed up with Google were 2× more likely to complete their first application entry.'
)

console.log(authFeature)`,
      hints: ['Every technical decision should have a "→ Product outcome:" that names user or business value', 'DB decisions affect data trust and query performance — name the product impact', 'UI decisions affect user behavior — name what changed or improved for users'],
    },
  },
  {
    id: 'cc-interview-fs-m13', track: 'crash', title: 'Performance Awareness — Full-Stack 10× Optimization',
    subtitle: '"How would you make this 10x faster?" across the full stack — profile the right layer, fix the right bottleneck, verify the improvement.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'PhD', xp: 260, duration: 17, module: 13, certArea: 'Full Stack Interview Prep',
    content: `Full-stack performance questions cover every layer — a 10× improvement might come from the database, the API, the rendering strategy, or the client bundle. The engineer who says "measure first" and then traces the bottleneck to its actual layer wins the interview.

## Full-Stack Performance Hierarchy

**1. Database layer** (highest impact, often overlooked)
- Missing indexes on filter/sort columns → add a compound index → 100× query speedup
- N+1 query problem → fix with a JOIN or nested select → eliminate 99% of queries
- Missing connection pool → add pgBouncer or Supabase connection pooling → handle 10× more concurrent users

**2. Server/API layer**
- No caching → add server-side caching with stale-while-revalidate → eliminate redundant DB calls
- Returning 200 fields when the client needs 5 → add field selection → reduce payload 40×
- No pagination → add cursor-based pagination → response time from 8s to 80ms

**3. Rendering strategy**
- Using CSR for a public page → switch to SSR or SSG → LCP from 6s to 1.2s (no client waterfall)
- Fetching data client-side on every mount → move to Server Component → eliminate round-trip

**4. Client/frontend layer**
- Unoptimized images → next/image with WebP → 70% size reduction
- 500KB unused JavaScript → code split with dynamic() → 60% bundle reduction
- Re-rendering entire lists → add React.memo or virtualization → 10× scroll performance

## The Profiling Sequence

For any full-stack performance problem:
1. **Check response time at the network level first** (Chrome DevTools Network tab) — is the server slow or is the client rendering slow?
2. **If server slow**: check the database query plan (\`EXPLAIN ANALYZE\` in Supabase SQL editor)
3. **If client slow**: Lighthouse for Core Web Vitals, Performance tab for JS flame chart, Bundle Analyzer for size
4. **Apply the highest-impact fix, verify, then move to the next**

## N+1: The Most Common Full-Stack Performance Bug

\`\`\`js
// N+1 problem — 1 query for posts + N queries for author of each post
const posts = await db.select().from(postsTable)
const postsWithAuthors = await Promise.all(
  posts.map(post => db.select().from(usersTable).where(eq(usersTable.id, post.userId)))
)
// 101 queries for 100 posts

// Fix: JOIN in one query
const postsWithAuthors = await db.select({
  id: postsTable.id,
  title: postsTable.title,
  authorName: usersTable.name
}).from(postsTable).innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
// 1 query — same result
\`\`\``,
    keyTerms: [
      { term: 'N+1 Query', definition: 'Fetching N related records with N separate queries instead of 1 JOIN — the most common full-stack performance anti-pattern.' },
      { term: 'EXPLAIN ANALYZE', definition: 'Postgres command that shows the query execution plan and actual timing — used to identify missing indexes and inefficient joins.' },
      { term: 'Connection Pooling', definition: 'Reusing database connections instead of opening a new one per request — critical for handling concurrent users at scale.' },
      { term: 'Stale-While-Revalidate', definition: 'A caching strategy that returns a cached response immediately while fetching a fresh one in the background — balances freshness and speed.' },
      { term: 'Code Splitting', definition: 'Breaking a JavaScript bundle into smaller chunks loaded on demand — reduces initial bundle size and improves Time to Interactive.' },
    ],
    quiz: [
      { q: 'A page takes 8 seconds to load. Where do you look first?', options: ['Optimize images', 'Check Network tab — is the server response slow or is the client rendering slow?', 'Run Lighthouse', 'Reduce JavaScript'], correct: 1, explanation: 'Always identify which layer is slow before optimizing. Network tab shows if the server takes 7s (backend problem) or 200ms (client rendering problem). The fix is completely different.' },
      { q: 'You have 100 posts and need each post\'s author name. You see 101 queries being fired. The fix is:', options: ['Add indexes on the posts table', 'Replace the per-post user query with a single JOIN', 'Enable connection pooling', 'Cache the user objects in memory'], correct: 1, explanation: 'N+1 is solved by fetching related data in the same query with a JOIN or nested select. 101 queries → 1 query is often a 50–100× improvement.' },
      { q: 'A public job listing page has a 6-second LCP. The server responds in 200ms. The most impactful fix is:', options: ['Add more server RAM', 'Switch from CSR (client-side fetch) to SSR — server sends rendered HTML, eliminating the client-side data waterfall', 'Optimize the CSS', 'Add a loading skeleton'], correct: 1, explanation: 'If the server is fast but the page is slow, the bottleneck is the client waterfall: blank HTML loads → JS loads → fetch fires → data arrives → render. SSR sends fully rendered HTML directly, cutting LCP by 3–5×.' },
      { q: 'EXPLAIN ANALYZE in Postgres reveals a "Seq Scan" (sequential scan) on a 500,000-row table. The fix is:', options: ['Increase the database memory', 'Add an index on the column being filtered', 'Rewrite the query in raw SQL', 'Upgrade to a larger Supabase plan'], correct: 1, explanation: 'A sequential scan reads every row. Adding an index on the filtered column switches to an Index Scan — O(n) → O(log n). For 500k rows, this is typically a 100–1000× speedup.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Fix the N+1 query problem below. The function currently runs one query per post to get the author\'s name. Rewrite it to use a single JOIN that returns all posts with author names in one query. Use the Supabase-style chained query format.',
      starterCode: `// N+1 PROBLEM — DO NOT LEAVE THIS AS IS
async function getPostsWithAuthors(supabase) {
  // Query 1: get all posts
  const { data: posts } = await supabase.from('posts').select('id, title, user_id')

  // Queries 2..N+1: get author for each post
  const results = await Promise.all(
    posts.map(async post => {
      const { data: author } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', post.user_id)
        .single()
      return { ...post, authorName: author.name }
    })
  )

  return results
}

// FIXED VERSION — write it here
async function getPostsWithAuthorsFIXED(supabase) {
  // Use Supabase nested select to get posts + profiles in one query
  // Supabase syntax: .select('*, profiles(name)')
}`,
      solution: `async function getPostsWithAuthorsFIXED(supabase) {
  // One query: posts joined with profiles via foreign key
  const { data, error } = await supabase
    .from('posts')
    .select(\`
      id,
      title,
      user_id,
      profiles(name)
    \`)

  if (error) throw error

  // Normalize the nested structure
  return data.map(post => ({
    id: post.id,
    title: post.title,
    userId: post.user_id,
    authorName: post.profiles?.name ?? 'Unknown'
  }))
}

// Result: 1 query instead of N+1
// For 100 posts: was 101 queries → now 1 query
// Typical improvement: 50-100x faster`,
      hints: ['Supabase nested select syntax: .select("*, related_table(columns)")', 'The foreign key relationship must exist in your schema for nested selects to work', 'Map the result to normalize profiles.name into a flat authorName field'],
    },
  },
  {
    id: 'cc-interview-fs-m14', track: 'crash', title: 'Security Instincts — Full-Stack Vulnerability Detection',
    subtitle: 'Spot auth bypasses, missing RLS, exposed secrets, and injection risks across the full stack — without being told to look.',
    courseObjective: CC_FS_OBJ, crashId: 'cc-interview-fullstack', crashTitle: 'Full Stack Interview Prep',
    level: 'PhD', xp: 260, duration: 17, module: 14, certArea: 'Full Stack Interview Prep',
    content: `Full-stack security instincts mean looking at any piece of code — DB schema, API route, or frontend component — and immediately seeing the exploitation path. This module trains the instinct across every layer.

## The Full-Stack Security Mental Model

Every full-stack vulnerability is one of: **authorization failure**, **injection**, **data exposure**, or **session/trust issue**. Train yourself to scan each layer for its specific vulnerability class.

**Database layer**: Missing RLS, missing input validation, SQL injection via raw queries
**API layer**: Missing auth checks, over-permissive endpoints, returning sensitive fields
**Frontend layer**: XSS via dangerouslySetInnerHTML, secrets in NEXT_PUBLIC_, client-side auth only

## Missing RLS — The Most Dangerous Full-Stack Mistake

\`\`\`sql
-- VULNERABLE: Table exists but RLS is disabled
-- Any authenticated user can read ALL other users' applications
SELECT * FROM applications WHERE status = 'applied';
-- Returns every user's job applications, not just yours

-- FIX: Enable RLS + policy
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own applications"
  ON applications FOR ALL
  USING (user_id = auth.uid());
\`\`\`

Without RLS enabled, every Supabase query returns all rows to any authenticated user. Enabling the table and forgetting RLS is the #1 Supabase security mistake.

## API Route Auth Bypass

\`\`\`ts
// VULNERABLE — no auth check
export async function GET(req: Request) {
  const applications = await supabase.from('applications').select('*')
  return Response.json(applications)
}
// Anyone who knows the URL can call this and get ALL applications

// FIX — verify session before querying
export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { data } = await supabase.from('applications').select('*')
  // With RLS enabled, this only returns the authenticated user's rows
  return Response.json(data)
}
\`\`\`

## Server Action Auth Bypass

\`\`\`ts
// VULNERABLE — Server Action with no auth check
'use server'
export async function deleteApplication(id: string) {
  await supabase.from('applications').delete().eq('id', id)
  // Any user who can call this action can delete ANY application by guessing its UUID
}

// FIX — always verify ownership server-side
'use server'
export async function deleteApplication(id: string) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Unauthorized')

  await supabase.from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)  // User can only delete their own
}
\`\`\`

## Environment Variable Exposure

\`\`\`ts
// VULNERABLE — service role key in a client component
'use client'
const supabaseAdmin = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!)
// Service role key bypasses ALL RLS — every user now has admin access

// FIX — service role client only in Server Components / API routes
// server-only file — never imported by client components
import 'server-only'
const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)  // No NEXT_PUBLIC_
\`\`\`

## The Security Code Review Checklist for Full-Stack

1. Is RLS enabled on every table that holds user data?
2. Does every API route and Server Action check the session before operating on data?
3. Is the SUPABASE_SERVICE_ROLE_KEY used anywhere with NEXT_PUBLIC_ prefix?
4. Are Server Actions scoped to the authenticated user's data (\`.eq('user_id', session.user.id)\`)?
5. Is user-controlled content ever passed to dangerouslySetInnerHTML without sanitization?`,
    keyTerms: [
      { term: 'Row Level Security (RLS)', definition: 'Postgres security that filters rows based on the current user identity — must be explicitly enabled per table or all authenticated users can read all rows.' },
      { term: 'Service Role Key', definition: 'Supabase admin key that bypasses all RLS — must never appear in client-side code or with NEXT_PUBLIC_ prefix.' },
      { term: 'API Route Auth Bypass', definition: 'An API route that queries the database without first verifying the caller\'s session — any attacker who knows the URL can access all data.' },
      { term: 'Server Action Scope', definition: 'A Server Action that deletes or updates by ID without checking ownership allows any user to affect any row by guessing its ID.' },
      { term: 'Authorization Layer Defense', definition: 'The principle that authorization should be enforced at every layer: middleware, API route/Server Action, and database (RLS) — each layer is a safety net for the others.' },
    ],
    quiz: [
      { q: 'A Supabase table "applications" has user_id but RLS is not enabled. What can any authenticated user do?', options: ['Only read their own applications — Supabase enforces user_id by default', 'Read, update, or delete every user\'s applications by querying without a user_id filter', 'Nothing — Supabase denies all queries without explicit RLS policies', 'Only read — writes are blocked without RLS'], correct: 1, explanation: 'Without RLS enabled, there is no row filtering at the database level. Any authenticated Supabase client can SELECT * FROM applications and get every user\'s data. RLS must be explicitly enabled.' },
      { q: 'What is wrong with using NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?', options: ['NEXT_PUBLIC_ variables are not supported in Next.js 14', 'The service role key bypasses all RLS — putting it in a NEXT_PUBLIC_ variable sends it to every browser, giving every user admin DB access', 'Service role keys don\'t work with the Supabase JS client', 'This is the correct way to use the service role key in Next.js'], correct: 1, explanation: 'The service role key ignores RLS entirely — it has admin access to all data. Exposing it via NEXT_PUBLIC_ means any user can extract it from the page source and make admin-level database calls.' },
      { q: 'A Server Action deletes a row by ID with `.eq("id", id)` but no user_id check. What is the vulnerability?', options: ['The action is missing error handling', 'Any authenticated user can delete any row by guessing or knowing its ID — missing ownership check', 'The action should use DELETE instead of .delete()', 'IDs are hashed so they can\'t be guessed'], correct: 1, explanation: 'UUIDs are not secret — they appear in URLs, logs, and can be found through other queries. Always scope destructive actions with `.eq("user_id", session.user.id)` to enforce ownership.' },
      { q: 'The correct defense-in-depth approach for a full-stack app is:', options: ['Rely entirely on RLS — no auth checks needed in API routes', 'Auth check in middleware only — API routes don\'t need to re-verify', 'Auth check in middleware + session check in API routes/Server Actions + RLS at DB — each layer is a safety net', 'RLS is optional if all API routes check auth'], correct: 2, explanation: 'Defense in depth: middleware catches unauthenticated navigation, API/Server Action checks catch direct API calls, and RLS is the final safety net if application code has a bug. All three layers together.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `auditFullStackSecurity(schema, apiRoutes, envVars)` that checks for 4 common full-stack security issues: missing RLS, unauthenticated API routes, exposed service role key, and Server Actions without user_id scope. Return an array of findings.',
      starterCode: `function auditFullStackSecurity({ tables, apiRoutes, envVars, serverActions }) {
  const findings = []

  // Check 1: Tables missing RLS
  // Check 2: API routes without session checks
  // Check 3: Service role key exposed via NEXT_PUBLIC_
  // Check 4: Server Actions that delete/update without user_id filter

  return findings
}

const audit = auditFullStackSecurity({
  tables: [
    { name: 'applications', hasRls: false },
    { name: 'profiles', hasRls: true },
  ],
  apiRoutes: [
    { path: '/api/applications', checksSession: false },
    { path: '/api/profile', checksSession: true },
  ],
  envVars: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY'],
  serverActions: [
    { name: 'deleteApplication', hasUserIdFilter: false },
    { name: 'updateProfile', hasUserIdFilter: true },
  ]
})

console.log(audit)`,
      solution: `function auditFullStackSecurity({ tables, apiRoutes, envVars, serverActions }) {
  const findings = []

  tables.forEach(t => {
    if (!t.hasRls) findings.push({ severity: 'CRITICAL', type: 'Missing RLS', detail: \`Table "\${t.name}" has no Row Level Security — all authenticated users can read/write all rows.\` })
  })

  apiRoutes.forEach(r => {
    if (!r.checksSession) findings.push({ severity: 'HIGH', type: 'Unauthenticated API Route', detail: \`Route "\${r.path}" does not check session — unauthenticated callers can access this endpoint.\` })
  })

  envVars.forEach(v => {
    if (v.startsWith('NEXT_PUBLIC_') && /SERVICE_ROLE|ADMIN|SECRET/i.test(v)) {
      findings.push({ severity: 'CRITICAL', type: 'Exposed Admin Key', detail: \`"\${v}" has NEXT_PUBLIC_ prefix — this key is bundled into the client JS and visible to every user. Remove the NEXT_PUBLIC_ prefix.\` })
    }
  })

  serverActions.forEach(a => {
    if (!a.hasUserIdFilter) findings.push({ severity: 'HIGH', type: 'Missing Ownership Check', detail: \`Server Action "\${a.name}" operates by ID without a user_id filter — any authenticated user can affect any row by knowing its ID.\` })
  })

  return findings.length ? findings : [{ severity: 'PASS', type: 'Clean', detail: 'No common vulnerabilities detected.' }]
}

const audit = auditFullStackSecurity({
  tables: [
    { name: 'applications', hasRls: false },
    { name: 'profiles', hasRls: true },
  ],
  apiRoutes: [
    { path: '/api/applications', checksSession: false },
    { path: '/api/profile', checksSession: true },
  ],
  envVars: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY'],
  serverActions: [
    { name: 'deleteApplication', hasUserIdFilter: false },
    { name: 'updateProfile', hasUserIdFilter: true },
  ]
})

console.log(JSON.stringify(audit, null, 2))`,
      hints: ['RLS check: loop tables, flag any with hasRls: false', 'Service role key: look for NEXT_PUBLIC_ prefix combined with SERVICE_ROLE or ADMIN in the name', 'Server Action scope: any destructive action without hasUserIdFilter: true is a finding'],
    },
  },
  {
    id: 'cc-interview-fs-m15',
    track: 'crash',
    crashId: 'cc-interview-fullstack',
    crashTitle: 'Full Stack Interview Prep',
    title: 'Deploying to the Cloud — AWS for Full-Stack Engineers',
    subtitle: 'S3 + CloudFront for static assets, Lambda for API routes, pre-signed URLs for uploads, and the cloud deployment questions full-stack interviewers ask.',
    level: 'PhD', xp: 220, duration: 18, module: 15, certArea: 'Full Stack Interview Prep',
    moduleObjective: 'Explain how to deploy a Next.js app with cloud-native asset delivery, implement direct-to-S3 file uploads using pre-signed URLs, architect a serverless API layer, and answer cloud cost and scaling questions that senior full-stack interviewers ask.',
    courseObjective: 'Interview-ready on the full stack from UI architecture and state management to database design, auth, real-time features, and cloud deployment.',
    keyTerms: [
      { term: 'Pre-signed URL', definition: 'A time-limited URL generated server-side that lets a client upload directly to S3 without exposing AWS credentials. The server signs the URL with its IAM credentials; the client uses it for a single PUT request. Expires in N seconds.' },
      { term: 'CloudFront CDN', definition: 'AWS\'s global content delivery network. Caches S3 objects at 400+ edge locations worldwide so users download from the nearest server. Reduces latency and S3 egress costs dramatically. Required for any production static asset strategy.' },
      { term: 'Edge Function', definition: 'A lightweight function that runs at CDN edge nodes (CloudFront Functions, Vercel Edge, Cloudflare Workers). Used for auth redirects, A/B testing, and header manipulation — executes in <1ms globally but has limited runtime APIs.' },
      { term: 'Object Storage vs Block Storage', definition: 'S3 is object storage — flat key-value, infinite scale, HTTP access, no random writes. EBS is block storage — behaves like a disk, low-latency random reads/writes, attached to one EC2 instance. S3 for files/assets; EBS for databases and OS volumes.' },
      { term: 'Cache-Control Header', definition: 'HTTP header that tells browsers and CDNs how long to cache a response. `Cache-Control: public, max-age=31536000, immutable` on content-hashed assets (JS/CSS bundles) means browsers cache forever; `no-cache` on HTML means always revalidate.' },
      { term: 'Multipart Upload', definition: 'S3 feature for uploading large files (>100MB) as parallel chunks. Each part is uploaded independently and assembled server-side. Required for files over 5GB; recommended over 100MB for reliability. AWS SDK handles it automatically via the managed upload API.' },
    ],
    content: `## Deploying to the Cloud — AWS for Full-Stack Engineers

### Why Full-Stack Engineers Get Asked Cloud Questions

In 2025, "full-stack" includes deployment. A senior full-stack engineer owns the feature from the React component to the CDN edge — interviewers test whether you understand how your code reaches users in production and what happens when it doesn't.

---

### Deploying a Next.js App — The Options

**Vercel (recommended for most teams)**
- Handles SSR, ISR, edge functions, CDN automatically
- Zero config for Next.js — push to main, it deploys
- Trade-off: costs more at scale, less control over infrastructure

**AWS Amplify / Elastic Beanstalk**
- Managed AWS hosting with more infrastructure control
- Connects to other AWS services (Cognito, RDS, SQS) with less friction
- Trade-off: more configuration, steeper learning curve

**Self-hosted on ECS + CloudFront**
- Docker container running \`next start\` behind a load balancer
- CloudFront in front for CDN and SSL termination
- Maximum control, maximum work — justified for large teams with DevOps

**Static export + S3 + CloudFront**
- Only works if the entire app can be \`output: 'export'\` (no SSR/ISR)
- Cheapest option by far — S3 costs pennies; CloudFront handles global delivery
- Use for: marketing sites, documentation, pure SPAs

**The interview answer:**
> "For a typical product app I default to Vercel for simplicity and Next.js optimization out of the box. If we're already AWS-heavy or have compliance requirements that demand more infrastructure control, I'd containerize with Docker and run on ECS with CloudFront in front. The key factor is how much the team wants to own."

---

### File Uploads — Pre-signed URLs (The Right Pattern)

**Never upload files through your server.** This is the most common mistake interviewers probe for.

**Why not through the server:**
- Files have to travel server → your API → S3 (double the bandwidth, double the latency)
- Server memory is tied up buffering large files
- Lambda has a 6MB payload limit — a 50MB video crashes it

**The correct pattern — direct-to-S3:**
\`\`\`
1. Client requests upload URL:
   POST /api/upload-url { filename, contentType }

2. Server generates pre-signed URL:
   const url = await s3.getSignedUrlPromise('putObject', {
     Bucket: 'my-uploads',
     Key: \`uploads/\${userId}/\${uuid()}-\${filename}\`,
     ContentType: contentType,
     Expires: 300, // 5 minutes
   })
   return { url, key }

3. Client uploads directly to S3:
   await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })

4. Client notifies server of completion:
   POST /api/upload-complete { key }
   Server verifies the object exists in S3, saves key to DB
\`\`\`

**Security notes:**
- Scope the S3 bucket policy to only allow PUT on the \`uploads/\` prefix
- The key should include the userId so users can't overwrite each other's files
- Validate contentType server-side — don't trust the client
- Set a maximum file size using the \`content-length-range\` condition in the pre-signed URL

---

### Static Assets — S3 + CloudFront

Your images, videos, and user-uploaded files should be served via CloudFront, never directly from S3.

**Why CloudFront over direct S3:**
- S3 is in one region — CloudFront has 400+ edge locations globally
- S3 egress is expensive ($0.09/GB) — CloudFront has lower egress rates and caches reduce origin requests by 90%+
- CloudFront can add signed URLs for private content, custom headers, and Lambda@Edge for image transforms

**Cache-Control strategy:**
\`\`\`
Content-hashed bundles (app-abc123.js):  Cache-Control: public, max-age=31536000, immutable
HTML pages:                               Cache-Control: no-cache (always revalidate)
User uploads (images, videos):           Cache-Control: public, max-age=86400
Private user files:                       Use CloudFront signed URLs, no public cache
\`\`\`

---

### Serverless API Architecture

When your full-stack app scales beyond a single server, Lambda + API Gateway is the serverless answer.

**Pattern:**
\`\`\`
Client → CloudFront → API Gateway → Lambda → RDS (via RDS Proxy)
\`\`\`

**Trade-offs to know:**
- Cold starts: Lambda takes 100ms–2s on first invocation after idle — not acceptable for user-facing auth endpoints. Use Provisioned Concurrency on critical paths.
- Connection limits: Lambda creates a new DB connection per invocation. At 1000 concurrent Lambda invocations, you hit RDS connection limits. Add RDS Proxy.
- Cost: Lambda is cheaper than ECS at low traffic, more expensive at high sustained traffic. Break-even is roughly 1M requests/month at medium duration.

---

### The Full-Stack Cloud Stack in One Answer

When asked "how would you deploy this app to production?":

> "I'd deploy the Next.js app to Vercel (or ECS if we're AWS-native). Static assets and user uploads go to S3, served via CloudFront with aggressive Cache-Control on content-hashed bundles. For file uploads, the client gets a pre-signed URL from our API and uploads directly to S3 — no files through the server. Background jobs (image processing, emails) go through SQS to Lambda workers. Database is RDS Postgres in a private VPC, with RDS Proxy in front to handle Lambda connection bursts. CloudWatch alarms on error rate and p99 latency with PagerDuty for on-call."`,
    quiz: [
      {
        q: 'A user uploads a profile photo. Your current implementation sends the file to your Next.js API route, which forwards it to S3. What is the problem and fix?',
        options: [
          'Next.js API routes can\'t handle binary data — use a separate Express server',
          'The file travels through your server twice (client → server → S3), wasting bandwidth and memory. Fix: generate a pre-signed S3 URL server-side and have the client upload directly to S3.',
          'S3 doesn\'t accept uploads from browsers — use a Lambda intermediary',
          'There\'s no problem — this is the standard pattern',
        ],
        correct: 1,
        explanation: 'Proxying uploads through your server doubles network cost, ties up server memory, and hits Lambda\'s 6MB payload limit for large files. The correct pattern: server generates a pre-signed PUT URL (time-limited, scoped to one key), client uploads directly to S3, client notifies server when complete. The server never handles the file bytes.',
      },
      {
        q: 'Your Next.js app serves the same hero image on every page load. 80% of your users are in Europe but your S3 bucket is in us-east-1. What do you add?',
        options: [
          'Copy the S3 bucket to a eu-west-1 region and update image URLs',
          'CloudFront CDN in front of S3 — it caches the image at edge nodes globally so European users download from nearby edge servers',
          'Use a larger EC2 instance to serve static files faster',
          'Enable S3 Transfer Acceleration',
        ],
        correct: 1,
        explanation: 'CloudFront has 400+ edge locations. After the first European user downloads the image (cache miss → S3), it\'s cached at that edge node. Every subsequent European user gets it from the edge in ~5ms instead of ~180ms round-trip to Virginia. Transfer Acceleration helps uploads to S3, not downloads from S3 to end users.',
      },
      {
        q: 'Your Lambda API is throwing "too many connections" errors on RDS Postgres during traffic spikes. What is the correct fix?',
        options: [
          'Increase Lambda Reserved Concurrency to unlimited',
          'Switch from RDS to DynamoDB — it scales automatically',
          'Add RDS Proxy — it maintains a connection pool and multiplexes many Lambda invocations over fewer database connections',
          'Increase RDS max_connections setting in the parameter group',
        ],
        correct: 2,
        explanation: 'Lambda creates a new database connection on every cold start. At 500 concurrent invocations you have 500 connections — RDS hits its limit and rejects new ones. RDS Proxy solves this: it maintains a pool of N connections to RDS and routes all Lambda requests through it. Increasing max_connections is a temporary fix that increases RDS memory pressure; RDS Proxy is the architectural solution.',
      },
      {
        q: 'You need to serve user-uploaded medical documents that should only be accessible to the document owner. CloudFront is your CDN. What is the correct approach?',
        options: [
          'Make the S3 bucket public but use obscure, random file keys so documents are hard to guess',
          'Store documents in a private S3 bucket and generate CloudFront signed URLs on demand — time-limited URLs that authenticate the specific user\'s access',
          'Serve documents directly from your API server which checks auth before streaming the file',
          'Use S3 bucket policies scoped by IP address',
        ],
        correct: 1,
        explanation: 'Signed URLs are the cloud-native solution for authenticated CDN content. The server checks auth, generates a short-lived signed URL (e.g., 60 seconds) for that specific CloudFront path, and returns it to the client. The client fetches directly from CDN — fast global delivery with access control. Option C (streaming through your server) works but bypasses CDN and doesn\'t scale.',
      },
    ],
  },
]
