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
6. **Client islands** (`'use client'`) attach event listeners, manage local state

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
]
