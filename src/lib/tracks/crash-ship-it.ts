import type { Course } from '../courses'

const CC_SHIP_OBJ = 'Take any project from local dev to live production — wiring frontend, backend, database, CI/CD, domain, monitoring, and security together into a single deployable system.'

export const crashShipItCourses: Course[] = [
  {
    id: 'cc-ship-it-m01', track: 'crash', title: 'The Build Pipeline: From Source to Bundle',
    subtitle: 'Understand what npm run build actually does and what Vercel/Netlify receives.',
    moduleObjective: 'Run a production build, read the output, understand chunking and tree-shaking, and know exactly what files get deployed.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 150, duration: 14, module: 1, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'Production Build', definition: 'npm run build compiles, minifies, and tree-shakes your code into static files. Output lives in .next/ (Next.js) or dist/ (Vite). The development server is never used in production.' },
      { term: 'Tree-shaking', definition: 'Dead code elimination. The bundler statically analyzes imports and removes exported functions/modules that are never called. Reduces bundle size significantly.' },
      { term: 'Code Splitting', definition: 'Breaking the JS bundle into smaller chunks loaded on demand. Next.js does this per route automatically — visiting /dashboard only loads the dashboard chunk.' },
      { term: 'Static Asset', definition: 'Files served directly from a CDN without any server computation: HTML, CSS, JS bundles, fonts, images. Fast because there is no runtime processing.' },
      { term: 'Environment Variable', definition: 'Configuration value injected at build or runtime. NEXT_PUBLIC_ prefix makes it available in the browser bundle. Without the prefix, only available server-side.' },
    ],
    content: `## The Build Pipeline: From Source to Bundle

### What Actually Happens When You Run \`npm run build\`

Most developers run \`npm run dev\`, build features, then hand it to Vercel and hope for the best. Understanding what the build step actually does makes you 10x better at debugging production issues.

---

### The Full Pipeline

\`\`\`
Source code (.tsx, .ts, .css)
        ↓
TypeScript compiler (tsc) — type checks, strips types
        ↓
Next.js compiler (SWC) — transforms JSX, handles imports
        ↓
Bundler (webpack/turbopack) — resolves deps, code splits
        ↓
Minifier — removes whitespace, shortens variable names
        ↓
Output: .next/ directory
        ↓
Vercel deployment (CDN + edge network)
\`\`\`

---

### Reading Build Output

Run \`npm run build\` and read what it tells you:

\`\`\`
Route (app)                    Size    First Load JS
┌ ○ /                          4.2 kB      112 kB
├ ○ /about                     1.1 kB      109 kB
├ ● /courses/[id]              8.7 kB      147 kB
└ ƒ /api/tts                   0 B         0 B

○ Static  ● Dynamic  ƒ Serverless Function
\`\`\`

- **○ Static** — pre-rendered HTML at build time, served from CDN, fastest possible
- **● Dynamic** — rendered on each request (uses \`fetch\` with no cache, cookies, or headers)
- **ƒ Serverless Function** — your API routes, run on-demand

**First Load JS** is the critical number. Under 130 kB is good. Over 300 kB needs investigation.

---

### Environment Variables: Build vs Runtime

This is the #1 source of production bugs for new developers.

\`\`\`bash
# .env.local (never commit this)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co   # ← bundled into client JS
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...              # ← bundled into client JS
SUPABASE_SERVICE_KEY=eyJhb...                       # ← SERVER ONLY, never exposed
OPENAI_API_KEY=sk-...                               # ← SERVER ONLY, never exposed
\`\`\`

**Rule**: \`NEXT_PUBLIC_\` = visible to everyone in the browser. Never put secrets there.

---

### Vercel's Build System

When you push to GitHub, Vercel:
1. Clones your repo
2. Runs \`npm install\` (uses package-lock.json for exact versions)
3. Runs your build command (default: \`npm run build\`)
4. Deploys \`.next/\` to its global CDN
5. Spins up serverless functions for API routes

**Critical**: Vercel builds in a clean environment. It has no access to your \`.env.local\`. Environment variables must be added in the Vercel dashboard under Settings → Environment Variables.

---

### Common Build Failures and Fixes

**TypeScript errors blocking build:**
\`\`\`bash
# Check locally first — never push blindly
npx tsc --noEmit
\`\`\`

**Missing environment variables:**
\`\`\`
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
\`\`\`
Add the variable to Vercel dashboard, then redeploy.

**Module not found:**
\`\`\`bash
npm install   # install missing dep
# Commit package.json + package-lock.json
\`\`\`

**Build succeeds locally, fails on Vercel:**
- You have a file import that works on macOS (case-insensitive) but fails on Linux (case-sensitive): \`import Button from './button'\` → should be \`'./Button'\`
- You're using a Node.js API in a component that runs at the edge

---

### The \`next.config.js\` Production Checklist

\`\`\`js
const nextConfig = {
  // Images from external domains must be explicitly allowed
  images: {
    remotePatterns: [{ hostname: 'your-supabase-project.supabase.co' }],
  },
  // Redirects — handled at CDN level, zero latency
  async redirects() {
    return [
      { source: '/old-path', destination: '/new-path', permanent: true },
    ]
  },
}
\`\`\``,
    ide: {
      language: 'javascript',
      task: 'Write a build analyzer: given a simulated build output (array of routes with size and type), calculate: total static routes, total dynamic routes, average first-load JS size, and flag any route over 200KB as "needs optimization". Return a report object.',
      starterCode: `const buildOutput = [
  { route: '/', size: 4200, firstLoadJs: 112000, type: 'static' },
  { route: '/about', size: 1100, firstLoadJs: 109000, type: 'static' },
  { route: '/courses/[id]', size: 8700, firstLoadJs: 147000, type: 'dynamic' },
  { route: '/dashboard', size: 12000, firstLoadJs: 280000, type: 'dynamic' },
  { route: '/api/tts', size: 0, firstLoadJs: 0, type: 'serverless' },
  { route: '/api/auth', size: 0, firstLoadJs: 0, type: 'serverless' },
]

function analyzeBuild(output) {
  // TODO: return {
  //   staticCount, dynamicCount, serverlessCount,
  //   avgFirstLoadJs (exclude serverless),
  //   needsOptimization: [routes where firstLoadJs > 200000]
  // }
}

console.log(analyzeBuild(buildOutput))`,
      solution: `const buildOutput = [
  { route: '/', size: 4200, firstLoadJs: 112000, type: 'static' },
  { route: '/about', size: 1100, firstLoadJs: 109000, type: 'static' },
  { route: '/courses/[id]', size: 8700, firstLoadJs: 147000, type: 'dynamic' },
  { route: '/dashboard', size: 12000, firstLoadJs: 280000, type: 'dynamic' },
  { route: '/api/tts', size: 0, firstLoadJs: 0, type: 'serverless' },
  { route: '/api/auth', size: 0, firstLoadJs: 0, type: 'serverless' },
]

function analyzeBuild(output) {
  const staticRoutes = output.filter(r => r.type === 'static')
  const dynamicRoutes = output.filter(r => r.type === 'dynamic')
  const serverlessRoutes = output.filter(r => r.type === 'serverless')
  const jsRoutes = output.filter(r => r.type !== 'serverless')
  const avgFirstLoadJs = jsRoutes.reduce((s, r) => s + r.firstLoadJs, 0) / jsRoutes.length
  const needsOptimization = output
    .filter(r => r.firstLoadJs > 200000)
    .map(r => ({ route: r.route, firstLoadJs: r.firstLoadJs }))
  return {
    staticCount: staticRoutes.length,
    dynamicCount: dynamicRoutes.length,
    serverlessCount: serverlessRoutes.length,
    avgFirstLoadJs: Math.round(avgFirstLoadJs),
    needsOptimization,
  }
}

console.log(analyzeBuild(buildOutput))`,
    },
    quiz: [
      { q: 'What does NEXT_PUBLIC_ prefix on an environment variable mean?', options: ['It is only available during build time', 'It is bundled into the client JavaScript and visible to everyone in the browser', 'It is only available in API routes', 'It bypasses TypeScript type checking'], correct: 1, explanation: 'NEXT_PUBLIC_ variables are inlined into the client bundle at build time. Anyone can read them in DevTools. Never put secrets (API keys, service keys) behind NEXT_PUBLIC_ — use server-only variables for those.' },
      { q: 'Your build passes locally but fails on Vercel with "Module not found: ./Button". What is the likely cause?', options: ['Vercel uses a different Node.js version', 'macOS is case-insensitive so ./button works locally, but Linux (Vercel) is case-sensitive', 'The Button component needs to be exported differently', 'Vercel does not support dynamic imports'], correct: 1, explanation: 'macOS HFS+ filesystem is case-insensitive by default — import from \'./button\' and \'./Button\' both work. Linux is case-sensitive. Always match import paths exactly to filenames.' },
      { q: 'A Next.js route shows "○ Static" in the build output. What does this mean?', options: ['The route uses useState so it is static', 'The page was pre-rendered to HTML at build time and is served from CDN with no server computation', 'The route has no TypeScript errors', 'Static means the page content never changes'], correct: 1, explanation: 'Static routes are rendered once at build time. The resulting HTML is cached on Vercel\'s CDN globally. Zero server compute per request — fastest possible delivery. Dynamic routes run on every request.' },
      { q: 'You add a new environment variable to .env.local. Why does the Vercel deployment still fail with "undefined"?', options: ['.env.local syntax is wrong', 'Vercel does not read .env.local — variables must be added in the Vercel dashboard under Settings → Environment Variables', 'You need to restart the Next.js server', 'The variable needs a NEXT_PUBLIC_ prefix'], correct: 1, explanation: '.env.local is a local development file that should never be committed. Vercel builds in a clean container with no access to your local files. Each environment variable must be explicitly added in Vercel\'s dashboard.' },
    ],
  },
  {
    id: 'cc-ship-it-m02', track: 'crash', title: 'Supabase in Production',
    subtitle: 'Row Level Security, migrations, connection pooling, and the env setup that does not leak secrets.',
    moduleObjective: 'Enable RLS on every table, write your first policy, run a migration, and wire production Supabase credentials into Vercel.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 150, duration: 13, module: 2, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'Row Level Security (RLS)', definition: 'PostgreSQL feature that restricts which rows a database user can read or write. In Supabase, the anon key bypasses nothing — policies define exactly who sees what.' },
      { term: 'Service Role Key', definition: 'Supabase key that bypasses RLS entirely. For server-side admin operations only. Never expose client-side. If leaked, attackers have full database access.' },
      { term: 'Anon Key', definition: 'Supabase public key for client-side use. Safe to expose in browser. Can only access data your RLS policies allow. This is your NEXT_PUBLIC_ key.' },
      { term: 'Migration', definition: 'A versioned SQL file that changes the database schema. Run in order — migration 002 always runs after 001. Never modify a migration after it runs in production.' },
      { term: 'Connection Pooler', definition: 'Supabase Transaction Pooler sits between your app and Postgres. Serverless functions open/close connections constantly — pooling prevents exhausting Postgres\'s connection limit.' },
    ],
    content: `## Supabase in Production

### The Two Keys You Must Understand

Every Supabase project has two main keys. Mixing them up is one of the most common security mistakes:

\`\`\`bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...   # SAFE for browser
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...             # SERVER ONLY
\`\`\`

**Anon key**: Used in client-side Supabase client. Respects RLS policies. Safe to expose.

**Service role key**: Used in API routes and server actions only. Bypasses ALL RLS policies. Full database access. If this leaks into your client bundle, anyone can read/write/delete everything.

---

### Row Level Security — Why and How

Without RLS, anyone with your anon key can read every row in every table. Supabase ships with RLS **disabled** by default. You must enable it.

\`\`\`sql
-- Enable RLS on a table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy: users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: public read for a posts table
CREATE POLICY "Anyone can read published posts"
ON posts FOR SELECT
USING (published = true);
\`\`\`

**After enabling RLS with no policies**: zero rows are returned for any query. Policies are additive — add one for each operation (SELECT, INSERT, UPDATE, DELETE).

---

### Migrations: The Right Way to Change Your Schema

Never change production schema in the Supabase dashboard GUI directly. Use migrations.

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase login
supabase link --project-ref your-project-ref

# Create a new migration
supabase migration new add_courses_table
# Creates: supabase/migrations/20241003120000_add_courses_table.sql

# Write your SQL
\`\`\`

\`\`\`sql
-- supabase/migrations/20241003120000_add_courses_table.sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own courses"
ON courses FOR ALL
USING (auth.uid() = user_id);
\`\`\`

\`\`\`bash
# Apply to production
supabase db push
\`\`\`

---

### Connection Pooling for Serverless

Vercel serverless functions spin up and down constantly. Each function invocation opens a new database connection. At scale this exhausts Postgres's connection limit (default 100).

Supabase's Transaction Pooler solves this:

\`\`\`bash
# Direct connection (use for migrations only)
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Pooled connection (use in your app)
postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
\`\`\`

In your Supabase client:
\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
\`\`\`

---

### Vercel Environment Variable Setup

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with the correct scope (Production / Preview / Development)
3. After adding variables, trigger a new deployment (changes don't apply to already-built deployments)

**Never commit \`.env.local\` to git.** Verify your \`.gitignore\`:
\`\`\`
.env.local
.env.*.local
\`\`\``,
    ide: {
      language: 'javascript',
      task: 'Build an RLS policy simulator. Given a table of rows (each with user_id) and a current user ID, implement three policy checks: canRead(row, userId) — user can only read their own rows, canWrite(row, userId) — user can only write their own rows, and filterRows(rows, userId) — returns only rows the user can read. Test with a mix of owned and unowned rows.',
      starterCode: `const rows = [
  { id: 1, user_id: 'user-alice', content: 'Alice post 1' },
  { id: 2, user_id: 'user-bob',   content: 'Bob post 1' },
  { id: 3, user_id: 'user-alice', content: 'Alice post 2' },
  { id: 4, user_id: 'user-carol', content: 'Carol post 1' },
]

const currentUser = 'user-alice'

function canRead(row, userId) {
  // TODO: return true only if row.user_id === userId
}

function canWrite(row, userId) {
  // TODO: same rule for writes
}

function filterRows(rows, userId) {
  // TODO: filter rows to only those the user can read
}

console.log('Can read own row:', canRead(rows[0], currentUser))
console.log('Can read other row:', canRead(rows[1], currentUser))
console.log('Filtered rows:', filterRows(rows, currentUser))`,
      solution: `const rows = [
  { id: 1, user_id: 'user-alice', content: 'Alice post 1' },
  { id: 2, user_id: 'user-bob',   content: 'Bob post 1' },
  { id: 3, user_id: 'user-alice', content: 'Alice post 2' },
  { id: 4, user_id: 'user-carol', content: 'Carol post 1' },
]

const currentUser = 'user-alice'

function canRead(row, userId) {
  return row.user_id === userId
}

function canWrite(row, userId) {
  return row.user_id === userId
}

function filterRows(rows, userId) {
  return rows.filter(row => canRead(row, userId))
}

console.log('Can read own row:', canRead(rows[0], currentUser))     // true
console.log('Can read other row:', canRead(rows[1], currentUser))   // false
console.log('Filtered rows:', filterRows(rows, currentUser))
// [{id:1,...}, {id:3,...}]`,
    },
    quiz: [
      { q: 'You enable RLS on a table but add no policies. What happens when a user queries it?', options: ['They see all rows', 'They see zero rows — RLS with no policies blocks everything', 'An error is thrown', 'They see only their own rows'], correct: 1, explanation: 'RLS defaults to deny. Without a policy, no rows match any access rule — every query returns an empty result set. This is the correct secure default: explicit allowlisting rather than implicit access.' },
      { q: 'When should you use the Supabase service role key?', options: ['In the browser client for admin features', 'Only in server-side code (API routes, server actions) for operations that need to bypass RLS', 'For all database reads to improve performance', 'When the user is an admin'], correct: 1, explanation: 'The service role key bypasses ALL RLS policies. It must never reach the client bundle. Use it in Next.js API routes or server actions for admin operations. Using it client-side exposes full database access to anyone.' },
      { q: 'Why use the Transaction Pooler connection string instead of the direct database URL in a Vercel app?', options: ['The pooler URL is shorter', 'Serverless functions open new connections per invocation — the pooler reuses connections and prevents exhausting Postgres\'s connection limit', 'The direct URL does not support SSL', 'The pooler is faster for reads'], correct: 1, explanation: 'Postgres has a default connection limit (~100). Each serverless function invocation opens a fresh connection. Under load, you\'ll hit "too many clients" errors. The Transaction Pooler maintains a connection pool and multiplexes many serverless requests through it.' },
      { q: 'Why should you never run schema changes directly in the Supabase dashboard in production?', options: ['The dashboard is slow', 'Direct changes bypass version control — you lose the ability to reproduce the schema, roll back, or sync dev/staging environments', 'Dashboard changes break RLS', 'The dashboard only supports SELECT'], correct: 1, explanation: 'Migration files are versioned, committed to git, and can be replayed on any environment. A dashboard click leaves no record, cannot be rolled back programmatically, and cannot be reproduced on a fresh database or a teammate\'s local setup.' },
    ],
  },
  {
    id: 'cc-ship-it-m03', track: 'crash', title: 'Wiring Next.js + Supabase on Vercel',
    subtitle: 'Auth, data fetching, and environment variables connected end-to-end — the exact setup that works in production.',
    moduleObjective: 'Wire Supabase Auth into a Next.js App Router app, protect routes with middleware, and fetch data server-side with proper session handling.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 150, duration: 15, module: 3, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'Middleware', definition: 'next/middleware runs before every request, before the route handler. Used to check auth session and redirect unauthenticated users. Lives at the project root in middleware.ts.' },
      { term: 'Server Action', definition: 'An async function marked with "use server" that runs on the server. Can be called directly from a React component without creating an API route. Used for form submissions and mutations.' },
      { term: 'Session Cookie', definition: 'Supabase SSR stores the auth session in a cookie, not localStorage. This allows the server to read the session and render protected pages without a client-side hydration step.' },
      { term: 'Protected Route', definition: 'A page or API endpoint that requires authentication. In Next.js App Router, protection is done in middleware.ts using the session check.' },
      { term: '@supabase/ssr', definition: 'The official Supabase package for server-side rendering. Replaces @supabase/auth-helpers-nextjs. Creates server and browser clients with cookie-based session management.' },
    ],
    content: `## Wiring Next.js + Supabase on Vercel

### The Full Auth Architecture

\`\`\`
Browser → Next.js Middleware (check session cookie)
              ↓ authenticated         ↓ unauthenticated
          Protected page          Redirect → /login
              ↓
         Server Component (read session, fetch user data)
              ↓
         Supabase (RLS uses auth.uid() from session)
\`\`\`

---

### Step 1: Install Dependencies

\`\`\`bash
npm install @supabase/ssr @supabase/supabase-js
\`\`\`

---

### Step 2: Create Supabase Clients

\`\`\`typescript
// src/lib/supabase/client.ts — browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

\`\`\`typescript
// src/lib/supabase/server.ts — server client (reads cookies)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
\`\`\`

---

### Step 3: Middleware — Protect Routes

\`\`\`typescript
// middleware.ts (root of project)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Redirect unauthenticated users away from protected routes
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
\`\`\`

---

### Step 4: Server Component with Auth

\`\`\`typescript
// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // RLS uses auth.uid() = user.id — only fetches this user's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main>
      <h1>Welcome, {user.email}</h1>
      <ul>
        {courses?.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </main>
  )
}
\`\`\`

---

### Vercel Deployment Checklist

Before pushing:
\`\`\`bash
# 1. Type check
npx tsc --noEmit

# 2. Test build locally
npm run build

# 3. Check .gitignore includes .env.local
cat .gitignore | grep env

# 4. Verify Vercel has all env vars set
# Dashboard → Settings → Environment Variables
\`\`\``,
    ide: {
      language: 'javascript',
      task: 'Build a route protection middleware simulator. Given a list of routes (some public, some protected) and a session object (null if unauthenticated), implement processRequest(path, session) that returns: "allow" for public routes, "allow" for authenticated users on protected routes, "redirect:/login" for unauthenticated users on protected routes, and "redirect:/dashboard" for authenticated users visiting /login or /signup.',
      starterCode: `const protectedPaths = ['/dashboard', '/profile', '/settings', '/courses']
const authPaths = ['/login', '/signup']

function processRequest(path, session) {
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  const isAuthPage = authPaths.includes(path)

  // TODO: implement logic
  // - authenticated user on auth page → redirect to /dashboard
  // - unauthenticated user on protected route → redirect to /login
  // - everything else → allow
}

// Test cases
console.log(processRequest('/dashboard', { userId: 'abc' }))  // allow
console.log(processRequest('/dashboard', null))               // redirect:/login
console.log(processRequest('/login', { userId: 'abc' }))      // redirect:/dashboard
console.log(processRequest('/login', null))                   // allow
console.log(processRequest('/about', null))                   // allow`,
      solution: `const protectedPaths = ['/dashboard', '/profile', '/settings', '/courses']
const authPaths = ['/login', '/signup']

function processRequest(path, session) {
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  const isAuthPage = authPaths.includes(path)

  if (session && isAuthPage) return 'redirect:/dashboard'
  if (!session && isProtected) return 'redirect:/login'
  return 'allow'
}

console.log(processRequest('/dashboard', { userId: 'abc' }))  // allow
console.log(processRequest('/dashboard', null))               // redirect:/login
console.log(processRequest('/login', { userId: 'abc' }))      // redirect:/dashboard
console.log(processRequest('/login', null))                   // allow
console.log(processRequest('/about', null))                   // allow`,
    },
    quiz: [
      { q: 'Why does Next.js App Router require @supabase/ssr instead of the standard @supabase/supabase-js for auth?', options: ['@supabase/ssr is faster', 'Server Components cannot access localStorage — @supabase/ssr uses cookies so the session is available server-side', '@supabase/supabase-js does not support TypeScript', '@supabase/ssr has better RLS support'], correct: 1, explanation: 'Server Components run on the server with no access to browser APIs including localStorage. @supabase/ssr stores the session in cookies, which are available in both server and client contexts. This enables server-side auth checks and avoids an extra client-side round trip.' },
      { q: 'Where in a Next.js project should route protection (auth checks + redirects) live?', options: ['In every page component individually', 'In middleware.ts at the project root — it runs before every request', 'In a custom _app.tsx wrapper', 'In the Supabase dashboard under Auth settings'], correct: 1, explanation: 'Middleware runs at the edge before any route handler or page component. It\'s the ideal place for auth checks because: 1) it runs once per request, 2) it can redirect before any page code executes, 3) it avoids rendering a protected page then redirecting (flash of content).' },
      { q: 'A Server Component fetches user data directly from Supabase. Why is this better than fetching from an API route?', options: ['Server Components have a direct database connection', 'The fetch runs server-side with no extra HTTP round trip — data arrives with the HTML, no loading state needed on the client', 'API routes do not support Supabase', 'Server Components bypass RLS'], correct: 1, explanation: 'An API route fetch from a Server Component: browser → server (render) → server (API) → Supabase → back. Direct fetch in Server Component: server → Supabase → HTML to browser. One less hop, no loading skeleton, better performance, and the data is available on first render.' },
      { q: 'Your middleware checks auth for every route including /_next/static assets. What problem does this cause?', options: ['Static assets are blocked for unauthenticated users', 'Every static asset request (JS, CSS, images) triggers an auth check, adding latency to every file load', 'The session cookie grows too large', 'Static assets cannot be served over HTTPS'], correct: 1, explanation: 'Middleware runs on every matched request. Without excluding static assets, every JS chunk, CSS file, and image load triggers a Supabase session check. The matcher config excludes _next/static, _next/image, and common image extensions to prevent this overhead.' },
    ],
  },
  {
    id: 'cc-ship-it-m04', track: 'crash', title: 'Deploying a Separate Backend API',
    subtitle: 'Ship a standalone Node/Express API to Railway or Render — separate from your Next.js frontend.',
    moduleObjective: 'Containerize a Node.js API with Docker, deploy it to Railway, connect it to a production database, and call it from your Next.js app.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 150, duration: 14, module: 4, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'Dockerfile', definition: 'A text file with instructions to build a Docker image. Each instruction creates a layer. Multi-stage builds use a build stage (with devDependencies) and a final stage (production only) to minimize image size.' },
      { term: 'Railway', definition: 'PaaS that deploys from a GitHub repo or Dockerfile. Auto-detects Node.js, provisions a domain, handles SSL, and scales horizontally. Simpler than AWS for most backend APIs.' },
      { term: 'Health Check', definition: 'A /health endpoint that returns 200 OK. Railway and Render use it to verify your service is running before sending traffic. If it fails, the deployment is rolled back.' },
      { term: 'CORS', definition: 'Cross-Origin Resource Sharing. When your Next.js frontend (app.vercel.app) calls your API (api.railway.app), the browser blocks the request unless the API explicitly allows that origin.' },
      { term: 'PORT', definition: 'Railway injects a PORT environment variable. Your server must listen on process.env.PORT, not a hardcoded port. Hardcoding port 3000 will cause the deployment to fail.' },
    ],
    content: `## Deploying a Separate Backend API

### When You Need a Separate API

Next.js API routes handle most backend needs. You need a separate backend when:
- The backend is shared by multiple frontends (web + mobile)
- You need persistent WebSocket connections
- Long-running jobs that exceed Vercel's 60-second function timeout
- You're building a microservice that other teams consume

---

### The Minimal Production-Ready Express App

\`\`\`typescript
// src/index.ts
import express from 'express'
import cors from 'cors'

const app = express()

// CORS — must come before routes
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

app.use(express.json())

// Health check — Railway uses this to verify your service is up
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Your routes
app.get('/api/users', async (req, res) => {
  // ...
})

// Railway injects PORT — never hardcode
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})
\`\`\`

---

### Multi-Stage Dockerfile

\`\`\`dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # exact versions from package-lock.json
COPY . .
RUN npm run build             # tsc → compiles TypeScript to dist/

# Stage 2: Production (no devDependencies, no source files)
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev         # production dependencies only
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
\`\`\`

**Why multi-stage?** A single-stage image with TypeScript compiler, ts-node, and devDependencies can reach 800MB. The multi-stage final image is ~80MB.

---

### Deploying to Railway

1. Push your code to GitHub
2. railway.app → New Project → Deploy from GitHub repo
3. Railway auto-detects Node.js or uses your Dockerfile
4. Set environment variables in the Railway dashboard:
   - DATABASE_URL (from your Supabase project settings)
   - ALLOWED_ORIGIN (your Vercel frontend URL)
   - Any API keys your backend needs
5. Railway provisions a \`*.up.railway.app\` domain automatically

**Important Railway settings:**
\`\`\`
Health Check Path: /health
Health Check Timeout: 30s
Restart Policy: Always
\`\`\`

---

### Calling Your Railway API from Next.js

\`\`\`typescript
// In a Server Component or API route
const API_URL = process.env.API_URL  // https://your-api.up.railway.app

const response = await fetch(\`\${API_URL}/api/users\`, {
  headers: {
    Authorization: \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
  // Cache behavior
  cache: 'no-store',       // Always fresh (SSR)
  // or
  next: { revalidate: 60 } // Re-fetch every 60 seconds (ISR)
})
\`\`\`

---

### The CORS Debug Checklist

If you see \`Access-Control-Allow-Origin\` errors:

1. Is your Vercel URL in the \`origin\` allowlist?
2. Is \`credentials: true\` set in both the CORS config AND the fetch call?
3. Is the OPTIONS preflight request handled? (express cors() handles this automatically)
4. Is the API URL correct? (http vs https)

\`\`\`typescript
// Explicit CORS for debugging
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
\`\`\``,
    ide: {
      language: 'javascript',
      task: 'Build a CORS validator: given a request origin and a list of allowed origins, implement isAllowed(requestOrigin, allowedOrigins) that returns true/false. Then build buildCorsHeaders(requestOrigin, allowedOrigins) that returns the correct CORS response headers object. Handle the case where allowedOrigins includes a wildcard "*".',
      starterCode: `function isAllowed(requestOrigin, allowedOrigins) {
  // TODO: return true if requestOrigin is in allowedOrigins OR allowedOrigins includes '*'
}

function buildCorsHeaders(requestOrigin, allowedOrigins) {
  // TODO: return headers object:
  // If allowed: { 'Access-Control-Allow-Origin': requestOrigin, 'Vary': 'Origin' }
  // If wildcard: { 'Access-Control-Allow-Origin': '*' }
  // If not allowed: {} (empty — no CORS headers = browser blocks it)
}

// Test cases
console.log(isAllowed('https://app.vercel.app', ['https://app.vercel.app', 'http://localhost:3000']))  // true
console.log(isAllowed('https://evil.com', ['https://app.vercel.app']))  // false
console.log(isAllowed('https://anything.com', ['*']))  // true
console.log(buildCorsHeaders('https://app.vercel.app', ['https://app.vercel.app']))`,
      solution: `function isAllowed(requestOrigin, allowedOrigins) {
  return allowedOrigins.includes('*') || allowedOrigins.includes(requestOrigin)
}

function buildCorsHeaders(requestOrigin, allowedOrigins) {
  if (allowedOrigins.includes('*')) {
    return { 'Access-Control-Allow-Origin': '*' }
  }
  if (allowedOrigins.includes(requestOrigin)) {
    return { 'Access-Control-Allow-Origin': requestOrigin, 'Vary': 'Origin' }
  }
  return {}
}

console.log(isAllowed('https://app.vercel.app', ['https://app.vercel.app', 'http://localhost:3000']))  // true
console.log(isAllowed('https://evil.com', ['https://app.vercel.app']))  // false
console.log(isAllowed('https://anything.com', ['*']))  // true
console.log(buildCorsHeaders('https://app.vercel.app', ['https://app.vercel.app']))
// { 'Access-Control-Allow-Origin': 'https://app.vercel.app', 'Vary': 'Origin' }`,
    },
    quiz: [
      { q: 'Railway injects a PORT environment variable. What happens if you hardcode port 3000 in your server?', options: ['Railway defaults to port 3000 anyway', 'Railway tries to connect to the PORT it assigned but your server is on 3000 — health checks fail, deployment fails', 'The app works but is slower', 'Port 3000 is blocked by Railway\'s firewall'], correct: 1, explanation: 'Railway assigns a random port via the PORT env variable. It then routes traffic to that port. If your server hardcodes 3000 but Railway expects port 4521 (for example), the health check hits the wrong port, gets a connection refused, and marks the deployment as failed.' },
      { q: 'What is the purpose of a health check endpoint like GET /health?', options: ['It exposes API documentation', 'Railway/Render hit it after deployment — if it returns 200, traffic is routed to the new version; if it fails, the old version stays', 'It checks database connectivity for the client', 'It reports server metrics to a monitoring service'], correct: 1, explanation: 'Zero-downtime deployments work by deploying the new version alongside the old, hitting the health check, and only switching traffic when the new version is confirmed healthy. Without a health check, a broken deployment immediately serves errors to all users.' },
      { q: 'Why does a multi-stage Docker build produce a much smaller final image?', options: ['Multi-stage compresses files more aggressively', 'The build stage contains compilers, devDependencies, and source files — the final stage copies only the compiled output and production deps, discarding everything else', 'Multi-stage uses a different base image', 'Docker removes unused layers automatically in multi-stage builds'], correct: 1, explanation: 'A TypeScript build stage needs tsc, ts-node, all devDependencies, and source .ts files. The final stage needs only the compiled .js files and production node_modules. Discarding the build tools and source is what reduces a 600MB image to 80MB.' },
      { q: 'Your Next.js frontend on Vercel calls your Railway API. The browser shows a CORS error. Your server has cors() middleware. What is the most likely cause?', options: ['Railway does not support CORS', 'The allowed origin in your CORS config is http://... but your Vercel app is https://...', 'CORS errors only happen on localhost', 'The cors() middleware must come after your routes'], correct: 1, explanation: 'CORS origin matching is exact. http://app.vercel.app and https://app.vercel.app are different origins. Production Vercel apps are always https. Ensure your ALLOWED_ORIGIN environment variable on Railway uses the exact https:// URL of your Vercel deployment.' },
    ],
  },
  {
    id: 'cc-ship-it-m05', track: 'crash', title: 'CI/CD with GitHub Actions',
    subtitle: 'Auto-deploy on every push to main — run tests, typecheck, build, and deploy without touching a server.',
    moduleObjective: 'Write a GitHub Actions workflow that typechecks, runs tests, and deploys to Vercel on every push to main.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 150, duration: 13, module: 5, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'GitHub Actions', definition: 'CI/CD platform built into GitHub. Workflows are YAML files in .github/workflows/. Triggered by push, pull_request, schedule, or manually. Runs on GitHub-hosted Linux, macOS, or Windows runners.' },
      { term: 'Workflow', definition: 'A YAML file defining one or more jobs triggered by events. Each job runs in a fresh virtual machine. Jobs run in parallel by default; use needs: to chain them sequentially.' },
      { term: 'Secret', definition: 'An encrypted environment variable stored in GitHub (Settings → Secrets and Variables → Actions). Referenced in workflows as ${{ secrets.MY_SECRET }}. Never printed in logs.' },
      { term: 'Artifact', definition: 'Files saved from one job for use by another or for download after the workflow. Build output, test reports, coverage files. Uploaded with actions/upload-artifact.' },
      { term: 'Matrix Strategy', definition: 'Run the same job with multiple configurations in parallel. Test against Node 18 AND 20 simultaneously. Defined as strategy: matrix: node: [18, 20].' },
    ],
    content: `## CI/CD with GitHub Actions

### The Workflow That Protects Main

Every push or PR to main runs: typecheck → tests → build. Only if all pass does Vercel deploy. This means broken code never reaches production.

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    needs: typecheck        # only run if typecheck passes
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: [typecheck, test]
    env:
      NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
\`\`\`

---

### Adding Secrets to GitHub

Repository → Settings → Secrets and Variables → Actions → New repository secret.

Add the same variables Vercel needs:
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- Any other build-time environment variables

---

### Deploying to Vercel via GitHub Actions

Vercel automatically deploys when you push to GitHub (via the Git integration). The GitHub Actions workflow above just gates that deployment — if CI fails, Vercel still deploys (it doesn't know about your workflow by default).

To make Vercel wait for CI:

**Option A**: Use Vercel's Deployment Protection (requires Vercel Pro).

**Option B**: Deploy manually from GitHub Actions using the Vercel CLI:

\`\`\`yaml
  deploy:
    needs: [typecheck, test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm install -g vercel
      - run: vercel pull --yes --environment=production --token=\${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=\${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=\${{ secrets.VERCEL_TOKEN }}
\`\`\`

Add to GitHub Secrets: \`VERCEL_TOKEN\` (from vercel.com/account/tokens), \`VERCEL_ORG_ID\`, \`VERCEL_PROJECT_ID\` (from \`.vercel/project.json\` after running \`vercel link\`).

---

### Caching for Speed

Without caching, \`npm ci\` downloads all packages on every run. With caching, the second run takes seconds:

\`\`\`yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm           # caches node_modules based on package-lock.json hash
\`\`\`

---

### Viewing Workflow Results

GitHub → your repo → Actions tab. Click a workflow run to see each job's logs. Red X = failure, green checkmark = success. Click any step to expand the logs.

**Debugging failed workflows:**
1. Look at the step that failed
2. Read the full error message (usually at the bottom of that step's output)
3. Reproduce locally: run the exact same command from the workflow`,
    ide: {
      language: 'javascript',
      task: 'Build a workflow dependency resolver. Given jobs with needs arrays (like GitHub Actions), implement getExecutionOrder(jobs) that returns an array of arrays — each inner array contains jobs that can run in parallel at that stage. Jobs with no needs go first, then jobs whose needs are all satisfied.',
      starterCode: `const jobs = {
  typecheck: { needs: [] },
  lint:      { needs: [] },
  test:      { needs: ['typecheck'] },
  build:     { needs: ['typecheck', 'lint'] },
  deploy:    { needs: ['test', 'build'] },
}

function getExecutionOrder(jobs) {
  // TODO: return array of stages, e.g.:
  // [['typecheck', 'lint'], ['test', 'build'], ['deploy']]
  // Each stage's jobs can run in parallel
  // A job enters a stage once all its needs have completed
}

console.log(getExecutionOrder(jobs))`,
      solution: `const jobs = {
  typecheck: { needs: [] },
  lint:      { needs: [] },
  test:      { needs: ['typecheck'] },
  build:     { needs: ['typecheck', 'lint'] },
  deploy:    { needs: ['test', 'build'] },
}

function getExecutionOrder(jobs) {
  const completed = new Set()
  const stages = []
  const remaining = new Set(Object.keys(jobs))

  while (remaining.size > 0) {
    const stage = []
    for (const job of remaining) {
      const needs = jobs[job].needs
      if (needs.every(n => completed.has(n))) {
        stage.push(job)
      }
    }
    if (stage.length === 0) throw new Error('Circular dependency detected')
    stage.forEach(j => { completed.add(j); remaining.delete(j) })
    stages.push(stage)
  }
  return stages
}

console.log(getExecutionOrder(jobs))
// [['typecheck', 'lint'], ['test', 'build'], ['deploy']]`,
    },
    quiz: [
      { q: 'In a GitHub Actions workflow, what does `needs: [typecheck, test]` do on the build job?', options: ['Copies typecheck and test output to build', 'The build job only runs if both typecheck and test jobs completed successfully', 'Runs typecheck and test in parallel inside the build job', 'Imports environment variables from those jobs'], correct: 1, explanation: '`needs` creates a dependency chain. `needs: [typecheck, test]` means build waits for both to finish AND only runs if both succeeded. If either fails, build is skipped, preventing a broken build from deploying.' },
      { q: 'You have a secret API key needed during `npm run build`. How do you make it available in the workflow?', options: ['Add it to .env.local and commit it', 'Add it to GitHub Secrets, then reference it as ${{ secrets.MY_KEY }} in the env section of the build step', 'Pass it as a command-line argument to npm run build', 'Store it in package.json'], correct: 1, explanation: 'GitHub Secrets are encrypted and never printed in logs. Reference them with ${{ secrets.NAME }}. They are injected as environment variables into the step that declares them. Committing secrets to git is a critical security mistake — GitHub will actually scan and alert on common secret patterns.' },
      { q: 'Why does `actions/setup-node` with `cache: npm` speed up CI?', options: ['It uses a faster npm registry', 'It caches node_modules between runs — on a cache hit, npm ci completes in seconds instead of minutes', 'It uses a pre-installed Node.js version', 'It skips type checking for cached modules'], correct: 1, explanation: 'The cache key is a hash of package-lock.json. If the lockfile hasn\'t changed, the cached node_modules is restored and npm ci verifies integrity without re-downloading. A full install might take 90 seconds; a cache hit takes 5 seconds.' },
      { q: 'Your workflow\'s deploy job should only run on pushes to main, not on pull requests. How do you implement this?', options: ['Add `branches: [main]` to the on: section of the deploy job', 'Add `if: github.ref == \'refs/heads/main\'` to the deploy job', 'Separate workflows cannot share secrets', 'Use `only: main` in the job configuration'], correct: 1, explanation: 'The `if` condition on a job controls when it runs. `github.ref` is the full ref name of the branch/tag that triggered the workflow. `refs/heads/main` is the main branch. Pull requests trigger with refs/pull/123/merge, so this condition correctly skips deployment for PRs.' },
    ],
  },
  {
    id: 'cc-ship-it-m06', track: 'crash', title: 'Custom Domain + DNS on Vercel',
    subtitle: 'Point your domain to Vercel, configure DNS records, and understand what actually happens when someone types your URL.',
    moduleObjective: 'Add a custom domain to a Vercel project, configure the correct DNS records, and understand the full DNS resolution path.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 120, duration: 11, module: 6, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'A Record', definition: 'Maps a domain (example.com) to an IPv4 address (76.76.21.21). Vercel\'s A record points your apex domain to their load balancer.' },
      { term: 'CNAME Record', definition: 'Maps a subdomain (www) to another domain name (cname.vercel-dns.com). Cannot be used on the apex domain (root @) — use an A record or ALIAS there.' },
      { term: 'Nameserver', definition: 'The DNS server authoritative for your domain. Your domain registrar lets you set nameservers. Pointing to Vercel\'s nameservers gives Vercel full DNS control.' },
      { term: 'TTL', definition: 'Time To Live — how long DNS resolvers cache a record before re-querying. Low TTL (60s) during migration allows fast changes. Normal TTL (3600s) reduces DNS query load.' },
      { term: 'SSL Certificate', definition: 'Vercel automatically provisions a Let\'s Encrypt TLS certificate for every custom domain. HTTPS is enabled by default with no configuration needed.' },
    ],
    content: `## Custom Domain + DNS on Vercel

### What Happens When Someone Types Your URL

\`\`\`
User types: myapp.com
     ↓
Browser checks local DNS cache
     ↓ (cache miss)
OS queries configured DNS resolver (usually ISP or 8.8.8.8)
     ↓
Resolver queries root nameservers → TLD nameservers (.com)
     ↓
TLD nameservers return your domain's authoritative nameservers
     ↓
Authoritative nameserver returns IP address (A record)
     ↓
Browser connects to that IP (Vercel's load balancer)
     ↓
Vercel routes request to your deployment
     ↓
Response arrives at browser (~50ms total)
\`\`\`

---

### Adding a Domain to Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Type your domain: \`myapp.com\`
3. Vercel shows you the required DNS records

**Option A: Use Vercel as your DNS (recommended)**
Transfer nameservers to Vercel at your registrar:
\`\`\`
ns1.vercel-dns.com
ns2.vercel-dns.com
\`\`\`
Vercel manages all DNS records. Automatic SSL. Easy subdomain setup.

**Option B: Keep your registrar's DNS**
Add the records Vercel specifies:

\`\`\`
Type    Name    Value
A       @       76.76.21.21         ← apex domain (myapp.com)
CNAME   www     cname.vercel-dns.com ← www subdomain
\`\`\`

---

### Common DNS Mistakes

**CNAME on apex domain**: Many registrars don't allow CNAME on the root (@) domain. Use an A record or ALIAS record instead.

**Wrong TTL during migration**:
1. Before migrating: set TTL to 60 seconds (changes propagate in 1 minute)
2. After migration is stable: raise TTL back to 3600 (reduces DNS load)

**Propagation delay**: DNS changes take time to propagate globally. "Propagation" means different DNS resolvers around the world picking up your changes. Use [whatsmydns.net](https://whatsmydns.net) to check propagation status.

---

### Subdomains for Staging

\`\`\`
myapp.com           → production (main branch)
staging.myapp.com   → staging (develop branch)
api.myapp.com       → your Railway backend
\`\`\`

In Vercel: Settings → Domains → Add \`staging.myapp.com\` and assign it to a specific git branch.

\`\`\`
CNAME   staging   cname.vercel-dns.com
CNAME   api       your-service.up.railway.app
\`\`\`

---

### SSL Certificates: Automatic

Vercel automatically:
1. Detects new custom domains
2. Requests a Let's Encrypt certificate
3. Renews it before expiry
4. Forces HTTPS (HTTP redirects to HTTPS)

Zero configuration required. If you see an SSL error, check:
- DNS is pointing to Vercel (not the old host)
- The domain is added in Vercel's dashboard
- Wait 5-10 minutes after DNS change (certificate provisioning takes a moment)`,
    ide: {
      language: 'javascript',
      task: 'Build a DNS record validator. Implement validateDnsConfig(records) that checks: 1) apex domain (@) has an A record or ALIAS, not a CNAME. 2) www subdomain has a CNAME or A record. 3) No duplicate record names with the same type. Returns { valid: boolean, errors: string[] }.',
      starterCode: `function validateDnsConfig(records) {
  const errors = []

  // TODO:
  // 1. Check if there's a CNAME on '@' (apex) — that's an error
  // 2. Check if there's an A or ALIAS record for '@' — required
  // 3. Check for duplicate (name + type) combinations
  // Return { valid: errors.length === 0, errors }
}

const records = [
  { type: 'A',     name: '@',   value: '76.76.21.21' },
  { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
  { type: 'CNAME', name: 'api', value: 'my-api.railway.app' },
  { type: 'CNAME', name: 'www', value: 'duplicate.example.com' },  // duplicate
]

console.log(validateDnsConfig(records))`,
      solution: `function validateDnsConfig(records) {
  const errors = []

  // Check for CNAME on apex
  const apexCname = records.find(r => r.name === '@' && r.type === 'CNAME')
  if (apexCname) errors.push('CNAME record on apex domain (@) is not allowed — use A or ALIAS record')

  // Check apex has A or ALIAS
  const apexA = records.find(r => r.name === '@' && (r.type === 'A' || r.type === 'ALIAS'))
  if (!apexA) errors.push('Apex domain (@) is missing an A or ALIAS record')

  // Check for duplicates
  const seen = new Set()
  for (const r of records) {
    const key = \`\${r.type}:\${r.name}\`
    if (seen.has(key)) errors.push(\`Duplicate \${r.type} record for "\${r.name}"\`)
    seen.add(key)
  }

  return { valid: errors.length === 0, errors }
}

const records = [
  { type: 'A',     name: '@',   value: '76.76.21.21' },
  { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
  { type: 'CNAME', name: 'api', value: 'my-api.railway.app' },
  { type: 'CNAME', name: 'www', value: 'duplicate.example.com' },
]

console.log(validateDnsConfig(records))
// { valid: false, errors: ['Duplicate CNAME record for "www"'] }`,
    },
    quiz: [
      { q: 'Why can\'t you use a CNAME record on your apex domain (myapp.com)?', options: ['CNAMEs are only for subdomains by convention', 'The DNS spec prohibits CNAME at the apex alongside other records — an apex domain must have SOA and NS records, which cannot coexist with CNAME', 'Vercel doesn\'t support apex CNAMEs', 'CNAMEs on apex domains are slower'], correct: 1, explanation: 'The DNS specification (RFC 1034) requires that a CNAME record cannot coexist with other records of the same name. Apex domains must have SOA and NS records. Therefore, CNAME at apex is technically invalid. Use an A record (pointing to Vercel\'s IP) or an ALIAS/ANAME record if your registrar supports it.' },
      { q: 'You update an A record but users still hit the old server 2 hours later. What determines how long this takes?', options: ['The size of the DNS change', 'The TTL (Time To Live) of the old record — DNS resolvers cache records for TTL seconds before re-querying', 'Vercel\'s propagation speed', 'The user\'s internet speed'], correct: 1, explanation: 'DNS resolvers cache records for their TTL. If your old A record had TTL 86400 (24 hours), resolvers won\'t re-query for up to 24 hours. Best practice: lower TTL to 60-300 seconds a day before migration, then change the record, then raise TTL back after confirming the change.' },
      { q: 'What does Vercel do with SSL certificates for custom domains?', options: ['You must purchase and upload a certificate', 'Vercel automatically provisions a Let\'s Encrypt certificate, serves HTTPS, and renews before expiry — zero configuration', 'SSL requires Vercel Pro plan', 'You configure SSL through your domain registrar'], correct: 1, explanation: 'Vercel handles the entire SSL lifecycle automatically. When you add a domain, Vercel requests a certificate from Let\'s Encrypt, configures HTTPS, forces HTTP→HTTPS redirects, and renews certificates automatically. No configuration, no cost.' },
      { q: 'How do you create a staging environment at staging.myapp.com pointing to a specific git branch?', options: ['Create a second Vercel project', 'In Vercel Settings → Domains, add staging.myapp.com and assign it to the develop branch, then add a CNAME record in DNS', 'Edit vercel.json to define branch mappings', 'Staging environments require Vercel Pro'], correct: 1, explanation: 'Vercel allows assigning custom domains to specific branches. Traffic to staging.myapp.com goes to the develop branch deployment; myapp.com goes to main. Each branch gets its own serverless functions and edge network distribution. No second project needed.' },
    ],
  },
  {
    id: 'cc-ship-it-m07', track: 'crash', title: 'Error Tracking + Uptime Monitoring',
    subtitle: 'Know when your app breaks before your users tell you — Sentry, Vercel Analytics, and uptime alerts.',
    moduleObjective: 'Install Sentry in a Next.js app, capture errors with context, set up uptime monitoring, and read Vercel\'s performance data.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 130, duration: 12, module: 7, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'Error Boundary', definition: 'A React component that catches JavaScript errors in its child tree and renders a fallback UI instead of crashing the whole page. Required in Next.js App Router for client-side error handling.' },
      { term: 'Sentry', definition: 'Error tracking service. Captures exceptions with full stack trace, user context, breadcrumbs (what happened before the error), and source maps (original TypeScript line numbers).' },
      { term: 'Source Maps', definition: 'Files that map compiled/minified JavaScript back to original TypeScript source. Without them, Sentry shows minified code like "a.b.c is not a function" instead of the actual file and line.' },
      { term: 'Uptime Monitor', definition: 'A service that pings your URL every minute from multiple locations. Alerts you within minutes if your site goes down. Tracks response times and historical availability.' },
      { term: 'Core Web Vitals', definition: 'Google\'s performance metrics: LCP (Largest Contentful Paint — load speed), FID/INP (interactivity), CLS (Cumulative Layout Shift — visual stability). Affect SEO ranking and user experience.' },
    ],
    content: `## Error Tracking + Uptime Monitoring

### The Problem Without Monitoring

Without error tracking, you find out your app broke when:
- A user emails you
- Someone tweets about it
- You check it yourself

With error tracking, you find out within minutes, with a full stack trace, user context, and the exact line of code that failed.

---

### Installing Sentry in Next.js

\`\`\`bash
npx @sentry/wizard@latest -i nextjs
\`\`\`

This automatically:
- Creates \`sentry.client.config.ts\`, \`sentry.server.config.ts\`, \`sentry.edge.config.ts\`
- Adds Sentry to \`next.config.js\`
- Creates \`src/app/global-error.tsx\` (error boundary)
- Uploads source maps on build

Add your DSN to environment variables:
\`\`\`bash
SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=sntrys_...  # for source map uploads
\`\`\`

---

### Capturing Errors with Context

Don't just let errors propagate — add context so you know what the user was doing:

\`\`\`typescript
import * as Sentry from '@sentry/nextjs'

async function fetchCourse(courseId: string, userId: string) {
  return Sentry.withScope(async (scope) => {
    scope.setUser({ id: userId })
    scope.setTag('courseId', courseId)
    scope.setContext('request', { courseId, userId })

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      Sentry.captureException(err)
      throw err
    }
  })
}
\`\`\`

---

### The global-error.tsx File

\`\`\`typescript
// src/app/global-error.tsx
'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  )
}
\`\`\`

---

### Free Uptime Monitoring Options

**UptimeRobot** (free, industry standard):
1. Sign up at uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: \`https://yourapp.com/api/health\` (or just \`/\`)
4. Interval: every 5 minutes
5. Alert contacts: email, Slack, Discord webhook

Your health endpoint:
\`\`\`typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
\`\`\`

---

### Vercel Analytics

Vercel Dashboard → Your Project → Analytics:
- **Core Web Vitals** per route — find slow pages
- **Real User Monitoring** — actual user devices and connections
- **Traffic** — requests, bandwidth, errors by route

Enable in \`next.config.js\`:
\`\`\`js
const nextConfig = {
  experimental: {
    // Already enabled on Vercel, but explicit for clarity
  }
}
\`\`\`

Or use the \`@vercel/analytics\` package for more detailed tracking:
\`\`\`bash
npm install @vercel/analytics
\`\`\`
\`\`\`typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\``,
    ide: {
      language: 'javascript',
      task: 'Build an uptime monitor simulator. Given a list of ping results (each with timestamp, statusCode, responseTimeMs), implement: getUptimePercentage(results), getAverageResponseTime(results), getIncidents(results) — groups of consecutive failures (statusCode !== 200), and isCurrentlyDown(results) — checks if the most recent ping failed.',
      starterCode: `const pingResults = [
  { timestamp: 1000, statusCode: 200, responseTimeMs: 145 },
  { timestamp: 2000, statusCode: 200, responseTimeMs: 132 },
  { timestamp: 3000, statusCode: 500, responseTimeMs: 5000 },
  { timestamp: 4000, statusCode: 500, responseTimeMs: 5000 },
  { timestamp: 5000, statusCode: 200, responseTimeMs: 155 },
  { timestamp: 6000, statusCode: 200, responseTimeMs: 148 },
  { timestamp: 7000, statusCode: 503, responseTimeMs: 5000 },
]

function getUptimePercentage(results) {
  // TODO: (successful pings / total pings) * 100, rounded to 2 decimal places
}

function getAverageResponseTime(results) {
  // TODO: average responseTimeMs, rounded to nearest integer
}

function getIncidents(results) {
  // TODO: return array of incidents: [{start, end, duration}]
  // An incident is one or more consecutive failures
}

function isCurrentlyDown(results) {
  // TODO: return true if the most recent result has statusCode !== 200
}

console.log('Uptime:', getUptimePercentage(pingResults) + '%')
console.log('Avg response:', getAverageResponseTime(pingResults) + 'ms')
console.log('Incidents:', getIncidents(pingResults))
console.log('Currently down:', isCurrentlyDown(pingResults))`,
      solution: `const pingResults = [
  { timestamp: 1000, statusCode: 200, responseTimeMs: 145 },
  { timestamp: 2000, statusCode: 200, responseTimeMs: 132 },
  { timestamp: 3000, statusCode: 500, responseTimeMs: 5000 },
  { timestamp: 4000, statusCode: 500, responseTimeMs: 5000 },
  { timestamp: 5000, statusCode: 200, responseTimeMs: 155 },
  { timestamp: 6000, statusCode: 200, responseTimeMs: 148 },
  { timestamp: 7000, statusCode: 503, responseTimeMs: 5000 },
]

function getUptimePercentage(results) {
  const up = results.filter(r => r.statusCode === 200).length
  return Math.round((up / results.length) * 10000) / 100
}

function getAverageResponseTime(results) {
  const total = results.reduce((s, r) => s + r.responseTimeMs, 0)
  return Math.round(total / results.length)
}

function getIncidents(results) {
  const incidents = []
  let incidentStart = null
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.statusCode !== 200 && incidentStart === null) {
      incidentStart = r.timestamp
    }
    if (r.statusCode === 200 && incidentStart !== null) {
      incidents.push({ start: incidentStart, end: results[i-1].timestamp, duration: results[i-1].timestamp - incidentStart })
      incidentStart = null
    }
  }
  if (incidentStart !== null) {
    const last = results[results.length - 1]
    incidents.push({ start: incidentStart, end: last.timestamp, duration: last.timestamp - incidentStart })
  }
  return incidents
}

function isCurrentlyDown(results) {
  return results[results.length - 1].statusCode !== 200
}

console.log('Uptime:', getUptimePercentage(pingResults) + '%')
console.log('Avg response:', getAverageResponseTime(pingResults) + 'ms')
console.log('Incidents:', getIncidents(pingResults))
console.log('Currently down:', isCurrentlyDown(pingResults))`,
    },
    quiz: [
      { q: 'Without source maps, what does Sentry show for an error in your TypeScript code?', options: ['The original TypeScript file and line number', 'Minified JavaScript like "Cannot read properties of undefined (reading \'a\')" with no file context', 'A screenshot of the error', 'The database query that caused the error'], correct: 1, explanation: 'Production builds minify and mangle variable names. Without source maps, stack traces reference minified bundle code that is unreadable. Source maps tell Sentry how minified code maps back to original TypeScript — essential for debugging production issues.' },
      { q: 'What should your /health endpoint return to serve as a useful uptime monitor target?', options: ['A full HTML page', 'HTTP 200 with a simple JSON body — uptime monitors check the status code, not the content', 'Database connection status details', 'The current git commit hash'], correct: 1, explanation: 'Uptime monitors check: 1) can they reach the URL? 2) does it return 200? The response body is usually ignored. Keep /health lightweight — it runs every minute. Optionally include a timestamp or version for debugging, but avoid database queries that could fail under load.' },
      { q: 'What is Cumulative Layout Shift (CLS) and why does it matter for your deployed app?', options: ['How long the largest image takes to load', 'How much page elements shift after initial render — unexpected movement frustrates users and hurts SEO ranking', 'The number of JavaScript errors per session', 'Network latency between user and server'], correct: 1, explanation: 'CLS measures visual instability. A common cause: an image with no width/height attribute loading and pushing content down. Or a font loading and reflowing text. Google uses CLS as a ranking signal. High CLS = poor UX + SEO penalty. Fix by reserving space for async content.' },
      { q: 'You add Sentry.captureException(err) in a catch block. What additional context makes this most useful?', options: ['The error message alone is enough', 'The user ID, relevant IDs (courseId, orderId), and the action the user was taking when it failed', 'The full database query', 'The server\'s memory usage at the time of failure'], correct: 1, explanation: 'An exception with only a stack trace tells you what broke. An exception with user context (who), IDs (which record), and action (what they were doing) tells you everything needed to reproduce and fix it. Sentry\'s setUser, setTag, and setContext methods add this structured context.' },
    ],
  },
  {
    id: 'cc-ship-it-m08', track: 'crash', title: 'Pre-Launch Security Checklist',
    subtitle: 'The security checks every developer must run before pointing real users at their app.',
    moduleObjective: 'Audit your deployed app against the top 8 pre-launch security checks and fix any failures.',
    courseObjective: CC_SHIP_OBJ, crashId: 'cc-ship-it', crashTitle: 'Ship It', level: 'Masters',
    xp: 150, duration: 14, module: 8, certArea: 'Ship It Crash Course',
    keyTerms: [
      { term: 'HTTPS Everywhere', definition: 'All traffic encrypted with TLS. HTTP requests redirect to HTTPS. Vercel enforces this automatically. Never serve sensitive data over HTTP.' },
      { term: 'Rate Limiting', definition: 'Restricting how many requests a client can make in a time window. Prevents brute force attacks on auth endpoints, API abuse, and denial-of-service from single IPs.' },
      { term: 'Security Headers', definition: 'HTTP response headers that instruct the browser on security behavior: X-Frame-Options (clickjacking), Content-Security-Policy (XSS), Strict-Transport-Security (force HTTPS).' },
      { term: 'Input Validation', definition: 'Verifying that all data from users/external sources matches expected types, lengths, and formats before processing. The first line of defense against injection attacks.' },
      { term: 'Principle of Least Privilege', definition: 'Every component, API key, and database user should have only the permissions it needs and nothing more. An API that only reads data should not have write permissions.' },
    ],
    content: `## Pre-Launch Security Checklist

### The 8 Checks Before You Go Live

Run through this list before your first real user hits your app. Each item here represents a class of attack that regularly takes down real production systems.

---

### 1. Environment Variables — No Secrets in Code

\`\`\`bash
# Search your entire codebase for hardcoded secrets
grep -r "sk-" src/          # OpenAI key pattern
grep -r "eyJhb" src/        # JWT/Supabase key pattern
grep -r "ghp_" src/         # GitHub token pattern
grep -r "AKIA" src/         # AWS key pattern
\`\`\`

**Never hardcode API keys.** One public GitHub repo with a leaked key can be exploited within minutes — automated scanners watch GitHub 24/7.

---

### 2. Supabase RLS — Every Table Locked Down

\`\`\`sql
-- Check which tables have RLS disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
\`\`\`

Every row in a Supabase table is publicly readable via the anon key unless RLS is enabled with policies. Run this query in the Supabase SQL editor before launch.

---

### 3. Rate Limiting on Auth Endpoints

\`\`\`typescript
// Supabase handles login rate limiting built-in
// For your own API endpoints, use upstash/ratelimit:

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10s
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  // ... your handler
}
\`\`\`

---

### 4. Security Headers in next.config.js

\`\`\`js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}
\`\`\`

Check your headers at [securityheaders.com](https://securityheaders.com).

---

### 5. Input Validation with Zod

Never trust user input. Validate everything at the API boundary:

\`\`\`typescript
import { z } from 'zod'

const CreateCourseSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  published: z.boolean().default(false),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = CreateCourseSchema.safeParse(body)

  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { title, description, published } = result.data
  // title is now guaranteed to be a non-empty string under 200 chars
  // SQL injection via title is impossible with parameterized queries
}
\`\`\`

---

### 6. CORS — Only Allow Your Domains

Already covered in Module 4. Verify your production CORS config only allows your actual frontend domain, not \`*\`.

---

### 7. Dependency Audit

\`\`\`bash
npm audit             # shows known vulnerabilities
npm audit fix         # auto-fixes non-breaking updates
npm audit fix --force # upgrades major versions (test carefully)
\`\`\`

Run \`npm audit\` before every major deployment. Known vulnerabilities in dependencies are one of the most common attack vectors.

---

### 8. .gitignore Verification

\`\`\`bash
# Verify these are ignored
cat .gitignore | grep -E "\\.env|\\.key|\\.pem"

# Check nothing sensitive is tracked
git ls-files | grep -E "\\.env|secret|key|credential"
\`\`\`

If a secret was ever committed (even in old commits), rotate it immediately — git history is public and permanent.

---

### Quick Security Score

| Check | Tool |
|---|---|
| Security headers | securityheaders.com |
| SSL configuration | ssllabs.com/ssltest |
| Known vulnerabilities | npm audit |
| RLS coverage | Supabase SQL editor |
| Exposed secrets | GitHub secret scanning (automatic on public repos) |`,
    ide: {
      language: 'javascript',
      task: 'Build a pre-launch security checker. Given a config object representing an app\'s security setup, implement checkSecurity(config) that returns { score: number, passed: string[], failed: string[], critical: string[] }. Check: httpsEnabled, rlsEnabled on all tables, hasRateLimit, hasSecurityHeaders, inputValidation, noHardcodedSecrets, corsConfigured, dependenciesAudited. Critical failures (score 0 if any): noHardcodedSecrets, rlsEnabled, httpsEnabled.',
      starterCode: `function checkSecurity(config) {
  const checks = {
    httpsEnabled:         { label: 'HTTPS enforced',           critical: true },
    rlsEnabled:           { label: 'RLS on all tables',        critical: true },
    noHardcodedSecrets:   { label: 'No hardcoded secrets',     critical: true },
    hasRateLimit:         { label: 'Rate limiting on auth',    critical: false },
    hasSecurityHeaders:   { label: 'Security headers set',     critical: false },
    inputValidation:      { label: 'Input validation (Zod)',   critical: false },
    corsConfigured:       { label: 'CORS restricted',          critical: false },
    dependenciesAudited:  { label: 'npm audit clean',          critical: false },
  }

  // TODO: iterate over checks
  // passed = config[key] is true
  // failed = config[key] is false
  // critical = failed items where checks[key].critical is true
  // score = (passed.length / total) * 100, but 0 if any critical failures
}

const appConfig = {
  httpsEnabled: true,
  rlsEnabled: true,
  noHardcodedSecrets: false,  // ← leaked key in code!
  hasRateLimit: true,
  hasSecurityHeaders: false,
  inputValidation: true,
  corsConfigured: true,
  dependenciesAudited: false,
}

console.log(checkSecurity(appConfig))`,
      solution: `function checkSecurity(config) {
  const checks = {
    httpsEnabled:         { label: 'HTTPS enforced',           critical: true },
    rlsEnabled:           { label: 'RLS on all tables',        critical: true },
    noHardcodedSecrets:   { label: 'No hardcoded secrets',     critical: true },
    hasRateLimit:         { label: 'Rate limiting on auth',    critical: false },
    hasSecurityHeaders:   { label: 'Security headers set',     critical: false },
    inputValidation:      { label: 'Input validation (Zod)',   critical: false },
    corsConfigured:       { label: 'CORS restricted',          critical: false },
    dependenciesAudited:  { label: 'npm audit clean',          critical: false },
  }

  const passed = [], failed = [], critical = []
  for (const [key, check] of Object.entries(checks)) {
    if (config[key]) {
      passed.push(check.label)
    } else {
      failed.push(check.label)
      if (check.critical) critical.push(check.label)
    }
  }

  const rawScore = Math.round((passed.length / Object.keys(checks).length) * 100)
  const score = critical.length > 0 ? 0 : rawScore

  return { score, passed, failed, critical }
}

const appConfig = {
  httpsEnabled: true,
  rlsEnabled: true,
  noHardcodedSecrets: false,
  hasRateLimit: true,
  hasSecurityHeaders: false,
  inputValidation: true,
  corsConfigured: true,
  dependenciesAudited: false,
}

console.log(checkSecurity(appConfig))
// score: 0 (critical failure), critical: ['No hardcoded secrets']`,
    },
    quiz: [
      { q: 'You find that an API key was committed to git 3 months ago and then deleted in a later commit. Is your key safe?', options: ['Yes — it was deleted from the current code', 'No — git history is permanent. Anyone who cloned the repo can see the key with git log. Rotate the key immediately.', 'Only if the repo is private', 'Yes — GitHub automatically redacts secrets in history'], correct: 1, explanation: 'Git stores every commit permanently. Even after deletion, the key exists in git history and is retrievable with git log --all -p. GitHub secret scanning alerts you when known patterns appear in commits. The only safe response is to rotate (revoke and regenerate) the key immediately.' },
      { q: 'What does X-Frame-Options: DENY prevent?', options: ['SQL injection attacks', 'Clickjacking — loading your site in an iframe on an attacker\'s page to trick users into clicking hidden buttons', 'Cross-site request forgery', 'Script injection via URL parameters'], correct: 1, explanation: 'Clickjacking loads your app in a transparent iframe over an attacker\'s page. The user thinks they\'re clicking on the attacker\'s content but actually clicking your app\'s buttons. X-Frame-Options: DENY prevents any site from embedding yours in an iframe.' },
      { q: 'Why is `npm audit` important to run before major deployments?', options: ['It checks TypeScript errors', 'It identifies known vulnerabilities in your dependencies that attackers actively exploit', 'It optimizes bundle size', 'It validates environment variables'], correct: 1, explanation: 'CVE databases track known vulnerabilities in open-source packages. When a vulnerability is discovered (e.g., a prototype pollution bug in a popular utility), npm audit flags it. Attackers actively scan GitHub repos for vulnerable dependency versions and target them.' },
      { q: 'A Supabase table has RLS enabled but no policies. A user queries it with the anon key. What do they get?', options: ['All rows', 'An authentication error', 'An empty result set — RLS with no policies denies all access by default', 'Only public rows'], correct: 2, explanation: 'RLS is a deny-by-default system. No policies = no access for any user (including service role if you also create a restrictive policy). This is intentional — security by default. You explicitly grant access through policies rather than explicitly denying it.' },
    ],
  },
]
