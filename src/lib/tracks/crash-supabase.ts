import type { Course } from '../courses'

const CC_SUPABASE_OBJ = 'Build full-stack features with Supabase — authentication, database queries, Row Level Security, storage, and real-time subscriptions.'

export const crashSupabaseCourses: Course[] = [
  {
    id: 'cc-supabase-m01', track: 'crash', title: 'Supabase Setup & Client',
    subtitle: 'Initialize Supabase in a Next.js project with typed client and environment config.',
    moduleObjective: 'Set up the Supabase client with TypeScript types and environment variables.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'Supabase', definition: 'Open-source Firebase alternative. Postgres database, Auth, Storage, Edge Functions, and Realtime — all in one.' },
      { term: 'anon key', definition: 'Public key for browser/client use. Safe to expose. RLS policies control what this key can access.' },
      { term: 'service_role key', definition: 'Admin key — bypasses RLS. Server-only. Never expose in client code or commit to git.' },
      { term: 'createBrowserClient', definition: '@supabase/ssr — creates a Supabase client for browser/client components. Reads cookies for session.' },
      { term: 'createServerClient', definition: '@supabase/ssr — creates a Supabase client for server components. Reads cookies from headers.' },
    ],
    content: `## Supabase Setup & Client

Supabase wraps PostgreSQL with a REST API, Auth, Storage, and Realtime. The @supabase/ssr package provides session-aware clients for Next.js.

### Install

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

### Environment Variables

\`\`\`bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # server-only
\`\`\`

### Generate Types

\`\`\`bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/database.types.ts
\`\`\`

### Browser Client

\`\`\`tsx
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

### Server Client (Server Components & Route Handlers)

\`\`\`tsx
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )
}
\`\`\``,
    quiz: [
      { q: 'What is the difference between the anon key and service_role key?', options: ['They are identical', 'anon is public/browser-safe, respects RLS; service_role bypasses RLS — server-only, never expose', 'service_role is for reading only', 'anon requires auth'], correct: 1, explanation: 'anon key is safe to expose — RLS policies limit what it can do. service_role bypasses all RLS — admin access, server-only, never ship to the client.' },
      { q: 'Why use @supabase/ssr over @supabase/supabase-js directly?', options: ['It is newer', 'ssr provides session-aware clients for Next.js App Router — reads/writes cookies for auth session', 'Better types', 'Required for TypeScript'], correct: 1, explanation: '@supabase/ssr handles the App Router cookie-based session pattern. Direct supabase-js client in a server component loses auth context.' },
      { q: 'What does supabase gen types do?', options: ['Generates API routes', 'Generates TypeScript types from your database schema — type-safe queries', 'Creates migrations', 'Required to use Supabase'], correct: 1, explanation: 'gen types generates a Database type from your live schema. Pass it as a generic to createClient() for fully typed queries.' },
      { q: 'Where should SUPABASE_SERVICE_ROLE_KEY be used?', options: ['client components', 'Server-only code (route handlers, server actions, server components) — never in client-side code', 'Anywhere', 'In .env only'], correct: 1, explanation: 'service_role bypasses RLS and has admin access. It must never reach the browser. Use it only in server code.' },
    ],
  },
  {
    id: 'cc-supabase-m02', track: 'crash', title: 'Database Queries',
    subtitle: 'Query, insert, update, and delete data using the Supabase JavaScript client.',
    moduleObjective: 'Write type-safe CRUD operations with the Supabase query builder.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'Basic',
    xp: 150, duration: 11, module: 2, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: '.from()', definition: 'Selects the table to query. Always returns the Supabase query builder, not data directly.' },
      { term: '.select()', definition: 'Specifies columns to return. "*" for all. "id, title, xp" for named columns. Supports joins: "*, track(name)".' },
      { term: '.eq() / .filter()', definition: 'WHERE clause builders. .eq("track", "crash") = WHERE track = \'crash\'.' },
      { term: '.single()', definition: 'Returns one row or null. Throws if more than one row matches. Use with .eq() on a unique column.' },
      { term: 'error handling', definition: 'Every query returns { data, error }. Always check error before using data.' },
    ],
    content: `## Database Queries

Supabase client wraps PostgreSQL queries in a chainable JavaScript API. Every operation returns { data, error }.

### Select

\`\`\`tsx
const supabase = createClient()

// All rows
const { data: courses, error } = await supabase
  .from('courses')
  .select('*')

// Specific columns
const { data } = await supabase
  .from('courses')
  .select('id, title, xp, track')

// With filter
const { data } = await supabase
  .from('courses')
  .select('*')
  .eq('track', 'crash')
  .order('module', { ascending: true })
  .limit(10)

// Single row
const { data: course, error } = await supabase
  .from('courses')
  .select('*')
  .eq('id', 'cc-js-m01')
  .single()
\`\`\`

### Insert

\`\`\`tsx
const { data, error } = await supabase
  .from('progress')
  .insert({
    user_id: userId,
    course_id: courseId,
    completed_at: new Date().toISOString(),
    xp_earned: 150,
  })
  .select()
  .single()

if (error) throw new Error(error.message)
\`\`\`

### Update

\`\`\`tsx
const { error } = await supabase
  .from('profiles')
  .update({ display_name: newName, updated_at: new Date().toISOString() })
  .eq('id', userId)

if (error) console.error('Update failed:', error.message)
\`\`\`

### Delete

\`\`\`tsx
const { error } = await supabase
  .from('progress')
  .delete()
  .eq('course_id', courseId)
  .eq('user_id', userId)
\`\`\`

### Error Handling Pattern

\`\`\`tsx
async function getCourse(id: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null  // not found
    throw new Error(\`Database error: \${error.message}\`)
  }

  return data
}
\`\`\``,
    quiz: [
      { q: 'What does every Supabase query return?', options: ['Data directly', '{ data, error } — always check error before using data', 'A Promise<void>', 'An array always'], correct: 1, explanation: 'Every Supabase query returns { data, error }. If error is not null, data is null. Always handle the error case.' },
      { q: 'What does .single() do?', options: ['Limits to 1 result', 'Returns one row as an object (not array) — errors if 0 or more than 1 rows match', 'Faster than select', 'Required for .eq()'], correct: 1, explanation: '.single() unwraps the array to return one object. It throws if the query returns 0 or 2+ rows. Use with unique column filters.' },
      { q: 'How do you filter by a column value?', options: ['.where("col", "=", val)', '.eq("column", value)', '.filter("column = value")', '.match({ column: value })'], correct: 1, explanation: '.eq("column", value) adds a WHERE column = value clause. Supabase also has .neq(), .gt(), .lt(), .in(), .like(), etc.' },
      { q: 'How do you insert and return the new row?', options: ['.insert(data)', '.insert(data).select().single()', '.insert(data).return()', '.insert(data).get()'], correct: 1, explanation: 'Chain .select() after .insert() to return the inserted row. .single() unwraps it from an array.' },
    ],
  },
  {
    id: 'cc-supabase-m03', track: 'crash', title: 'Authentication',
    subtitle: 'Add email, OAuth, and magic link auth to your Next.js app with Supabase Auth.',
    moduleObjective: 'Implement sign up, sign in, and protected routes using Supabase Auth and middleware.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'signUp', definition: 'supabase.auth.signUp({ email, password }) — creates an account. Sends a confirmation email.' },
      { term: 'signInWithPassword', definition: 'supabase.auth.signInWithPassword({ email, password }) — returns a session with access/refresh tokens.' },
      { term: 'signInWithOAuth', definition: 'One-click OAuth via Google, GitHub, etc. Supabase handles the redirect flow.' },
      { term: 'getUser()', definition: 'supabase.auth.getUser() — verifies the JWT with Supabase servers. Use in server code. More secure than getSession().' },
      { term: 'onAuthStateChange', definition: 'Browser listener — fires on sign in, sign out, token refresh. Use to update UI on auth events.' },
    ],
    content: `## Authentication

Supabase Auth manages users, sessions, OAuth, and JWT tokens. The @supabase/ssr package syncs sessions via cookies in Next.js.

### Sign Up and Sign In

\`\`\`tsx
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Sign up
async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Sign in
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

// OAuth (Google)
async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: \`\${window.location.origin}/auth/callback\` },
  })
}

// Sign out
async function signOut() {
  await supabase.auth.signOut()
}
\`\`\`

### Auth Callback Route

\`\`\`tsx
// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({name,value,options}) => cookieStore.set(name,value,options)) } }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
\`\`\`

### Get Current User (Server)

\`\`\`tsx
// In a server component
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <Dashboard userId={user.id} />
}
\`\`\``,
    quiz: [
      { q: 'What is the difference between getUser() and getSession()?', options: ['They are identical', 'getUser() verifies the JWT with Supabase servers (secure); getSession() reads from storage (could be stale)', 'getSession() is newer', 'getUser() only works client-side'], correct: 1, explanation: 'getUser() makes a network request to verify the token with Supabase. getSession() reads the cached session — may be expired. Use getUser() in server code.' },
      { q: 'What is the auth callback route for?', options: ['Logging auth events', 'Handles the OAuth redirect — exchanges the auth code for a session cookie', 'Required for email auth', 'Error handling'], correct: 1, explanation: 'OAuth and magic links redirect to /auth/callback with a code param. The callback route exchanges it for a session via exchangeCodeForSession().' },
      { q: 'How do you protect a server-rendered page?', options: ['Client-side check only', 'Call supabase.auth.getUser() in the page, redirect to /login if no user', 'middleware only', 'Add auth prop'], correct: 1, explanation: 'In a server component: getUser(), check for null, redirect(). This is server-enforced — the page never renders for unauthenticated users.' },
      { q: 'What does supabase.auth.signOut() do?', options: ['Deletes the user account', 'Invalidates the session token and clears the auth cookie', 'Just clears localStorage', 'Requires a page reload'], correct: 1, explanation: 'signOut() invalidates the session on Supabase servers and clears the session cookie. The user must sign in again.' },
    ],
  },
  {
    id: 'cc-supabase-m04', track: 'crash', title: 'Row Level Security',
    subtitle: 'Protect your data with PostgreSQL Row Level Security policies in Supabase.',
    moduleObjective: 'Write and test RLS policies to control table access by authenticated users.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'Masters',
    xp: 175, duration: 11, module: 4, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'RLS', definition: 'Row Level Security — PostgreSQL feature that adds row-level access control. Must be enabled per table.' },
      { term: 'auth.uid()', definition: 'PostgreSQL function returning the authenticated user\'s UUID from the JWT. Used in RLS policies.' },
      { term: 'Policy', definition: 'A rule attached to a table defining who can SELECT, INSERT, UPDATE, or DELETE rows — and which rows.' },
      { term: 'USING clause', definition: 'Filters which existing rows a policy applies to (for SELECT, UPDATE, DELETE).' },
      { term: 'WITH CHECK clause', definition: 'Validates rows being written (INSERT, UPDATE). Prevents inserting rows that don\'t satisfy the condition.' },
    ],
    content: `## Row Level Security

RLS is the security layer that makes Supabase safe to query directly from the browser. Without RLS, any user with your anon key can read all data.

### Enable RLS

\`\`\`sql
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
-- Now the table is locked — no access until policies are added
\`\`\`

### Common Policies

\`\`\`sql
-- Users can only read their own progress
CREATE POLICY "Users can read own progress"
  ON progress FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Courses are public (anyone can read)
CREATE POLICY "Courses are publicly readable"
  ON courses FOR SELECT
  USING (true);
\`\`\`

### Admin Policy

\`\`\`sql
-- Only admins (role stored in profiles) can insert courses
CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
\`\`\`

### Service Role Bypasses RLS

\`\`\`tsx
// Use service_role client to bypass RLS (admin operations)
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // server-only
)

// This ignores all RLS policies
const { data } = await adminClient
  .from('courses')
  .select('*')
\`\`\``,
    quiz: [
      { q: 'What happens to a table with RLS enabled but no policies?', options: ['All access allowed', 'All access is denied — no rows can be read, inserted, or modified', 'Only reads allowed', 'Error is thrown'], correct: 1, explanation: 'Enabling RLS with no policies creates a deny-all state. You must add explicit policies to grant access — security by default.' },
      { q: 'What does auth.uid() return?', options: ['The API key', 'The authenticated user\'s UUID from the JWT token', 'A session token', 'null always'], correct: 1, explanation: 'auth.uid() is a PostgreSQL function that reads the JWT from the request and returns the user\'s UUID. Used in policy conditions.' },
      { q: 'What is the difference between USING and WITH CHECK?', options: ['They are identical', 'USING filters which rows can be READ/MODIFIED; WITH CHECK validates rows being WRITTEN', 'WITH CHECK is for DELETE only', 'USING is newer'], correct: 1, explanation: 'USING applies to existing rows (SELECT, UPDATE, DELETE). WITH CHECK applies to rows being written (INSERT, UPDATE) — ensures you can\'t insert rows you couldn\'t own.' },
      { q: 'How do you make a table publicly readable?', options: ['Disable RLS', 'Add a SELECT policy with USING (true)', 'Grant anon role', 'Use the public schema'], correct: 1, explanation: 'USING (true) means the condition is always satisfied — any row passes. This makes all rows readable by anyone (authed or anonymous).' },
    ],
  },
  {
    id: 'cc-supabase-m05', track: 'crash', title: 'Storage & File Uploads',
    subtitle: 'Upload, retrieve, and protect files using Supabase Storage.',
    moduleObjective: 'Upload files to Supabase Storage and generate signed URLs for protected access.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'Masters',
    xp: 175, duration: 10, module: 5, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'Bucket', definition: 'A named storage container. Buckets can be public (URL = immediate access) or private (URL = no access without a signed URL).' },
      { term: 'upload()', definition: 'supabase.storage.from("bucket").upload("path", file) — stores a file. Path is the storage path, not the URL.' },
      { term: 'getPublicUrl()', definition: 'Returns the permanent public URL for a file in a public bucket. No expiry.' },
      { term: 'createSignedUrl()', definition: 'Returns a time-limited URL for a file in a private bucket. Pass expiry in seconds.' },
      { term: 'upsert', definition: 'upload option { upsert: true } — overwrites the file if the path already exists.' },
    ],
    content: `## Storage & File Uploads

Supabase Storage is S3-compatible file storage with bucket-level policies and per-file signed URLs.

### Upload a File

\`\`\`tsx
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = \`avatars/\${userId}.\${ext}\`

  const { data, error } = await supabase.storage
    .from('profiles')  // bucket name
    .upload(path, file, {
      contentType: file.type,
      upsert: true,      // overwrite if exists
    })

  if (error) throw new Error(error.message)
  return data.path
}
\`\`\`

### Public URL

\`\`\`tsx
function getAvatarUrl(path: string) {
  const { data } = supabase.storage
    .from('profiles')
    .getPublicUrl(path)

  return data.publicUrl
}

// Usage in Next.js Image
<Image src={getAvatarUrl(user.avatar_path)} alt="Avatar" width={40} height={40} />
\`\`\`

### Signed URL (Private Bucket)

\`\`\`tsx
async function getCertificateUrl(path: string) {
  const { data, error } = await supabase.storage
    .from('certificates')  // private bucket
    .createSignedUrl(path, 3600)  // expires in 1 hour

  if (error) throw error
  return data.signedUrl
}
\`\`\`

### File Input + Upload Component

\`\`\`tsx
'use client'
export function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const path = await uploadAvatar(userId, file)
    const url = getAvatarUrl(path)
    onUpload(url)
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-amber-50 file:text-amber-700"
    />
  )
}
\`\`\``,
    quiz: [
      { q: 'What is the difference between a public and private bucket?', options: ['Private costs more', 'Public bucket: files accessible via URL directly. Private: requires a signed URL with expiry', 'Public is for images only', 'Private is default'], correct: 1, explanation: 'Public buckets give permanent URLs. Private buckets require createSignedUrl() which generates a time-limited URL. Use private for sensitive files.' },
      { q: 'What does upsert: true do?', options: ['Creates a new bucket', 'Overwrites the file if the path already exists — no error on duplicate path', 'Updates metadata only', 'Required for images'], correct: 1, explanation: 'Without upsert, uploading to an existing path returns an error. upsert: true replaces the file at that path.' },
      { q: 'What does createSignedUrl require?', options: ['Auth token only', 'The file path and expiry in seconds — returns a URL that works only during the expiry window', 'Public bucket', 'Admin key'], correct: 1, explanation: 'createSignedUrl(path, expirySeconds) generates a JWT-signed URL. After expiry, it returns 401. Use for one-time downloads or time-limited previews.' },
      { q: 'What is the storage path vs the URL?', options: ['They are the same', 'The path is the internal storage key (avatars/user123.jpg); the URL is the full HTTP address for browser access', 'URL includes the bucket name', 'Path is only used for deletes'], correct: 1, explanation: 'You upload to a path (folder/filename within the bucket). getPublicUrl() or createSignedUrl() converts the path to a full URL.' },
    ],
  },
  {
    id: 'cc-supabase-m06', track: 'crash', title: 'Real-time Subscriptions',
    subtitle: 'Build live features with Supabase Realtime — presence, broadcast, and Postgres changes.',
    moduleObjective: 'Subscribe to database changes and implement real-time UI updates.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'Realtime', definition: 'Supabase Realtime uses WebSockets to push database changes to subscribed clients.' },
      { term: 'postgres_changes', definition: 'Subscription type that fires on INSERT, UPDATE, or DELETE events from a Postgres table.' },
      { term: 'channel', definition: 'A named WebSocket channel. Multiple subscriptions can share one channel or have separate ones.' },
      { term: 'Presence', definition: 'Track which users are online in a channel. Key for collaborative features like "3 people viewing this".' },
      { term: 'Broadcast', definition: 'Send arbitrary messages to all subscribers of a channel. Low-latency — bypasses the database.' },
    ],
    content: `## Real-time Subscriptions

Supabase Realtime lets you subscribe to database changes over WebSockets. UIs update live without polling.

### Subscribe to Table Changes

\`\`\`tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function LiveCourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Initial load
    supabase
      .from('courses')
      .select('*')
      .then(({ data }) => setCourses(data ?? []))

    // Subscribe to changes
    const channel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'courses' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCourses(prev => [...prev, payload.new as Course])
          }
          if (payload.eventType === 'DELETE') {
            setCourses(prev => prev.filter(c => c.id !== payload.old.id))
          }
          if (payload.eventType === 'UPDATE') {
            setCourses(prev => prev.map(c => c.id === payload.new.id ? payload.new as Course : c))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return <CourseList courses={courses} />
}
\`\`\`

### Presence (Online Users)

\`\`\`tsx
useEffect(() => {
  const channel = supabase.channel('course-room')

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const onlineCount = Object.keys(state).length
      setOnlineUsers(onlineCount)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ user_id: userId, online_at: new Date().toISOString() })
      }
    })

  return () => { supabase.removeChannel(channel) }
}, [])
\`\`\``,
    quiz: [
      { q: 'What transport does Supabase Realtime use?', options: ['HTTP polling', 'WebSockets — persistent connections that push changes without requests', 'Server-Sent Events', 'gRPC'], correct: 1, explanation: 'Supabase Realtime uses WebSockets. Clients maintain a persistent connection and receive pushed events instead of polling.' },
      { q: 'What event types does postgres_changes support?', options: ['Only INSERT', 'INSERT, UPDATE, DELETE — or "*" for all', 'Only SELECT', 'CREATE and ALTER'], correct: 1, explanation: 'postgres_changes fires on INSERT, UPDATE, DELETE (DML events). Pass event: "*" to listen for all three.' },
      { q: 'Why is cleanup important with Realtime subscriptions?', options: ['It saves money', 'Leaving open channels causes memory leaks and stale listeners — always remove on unmount', 'Required by TypeScript', 'Not important'], correct: 1, explanation: 'Each subscribed channel holds a WebSocket connection. Not removing on unmount creates multiple connections on re-mount and memory leaks.' },
      { q: 'What is Presence used for?', options: ['Database sync', 'Tracking which users are online in a channel — for collaborative UIs and online indicators', 'File uploads', 'Auth state'], correct: 1, explanation: 'Presence lets clients track each other\'s online state via a shared channel. Used for "2 people viewing this", cursor sharing, live collaboration.' },
    ],
  },
  {
    id: 'cc-supabase-m07', track: 'crash', title: 'Edge Functions',
    subtitle: 'Run server-side logic at the edge with Supabase Edge Functions (Deno).',
    moduleObjective: 'Write and deploy Supabase Edge Functions to run backend logic near users.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'PhD',
    xp: 200, duration: 10, module: 7, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'Edge Function', definition: 'Deno-based serverless function deployed to Supabase infrastructure. Runs globally at the edge near users.' },
      { term: 'Deno', definition: 'TypeScript-first runtime. No node_modules — imports via URL. Edge Functions use Deno.' },
      { term: 'invoke()', definition: 'supabase.functions.invoke("function-name", { body }) — calls an Edge Function from client code.' },
      { term: 'Secrets', definition: 'Environment variables for Edge Functions set via Supabase CLI: supabase secrets set KEY=value.' },
      { term: 'CORS', definition: 'Edge Functions must handle CORS — include Access-Control-Allow-Origin headers for browser calls.' },
    ],
    content: `## Edge Functions

Supabase Edge Functions are Deno TypeScript functions deployed globally. Use for webhook handling, AI calls, email sending, or any server logic that shouldn't be in the Next.js app.

### Create and Deploy

\`\`\`bash
# Create
supabase functions new send-welcome-email

# Run locally
supabase functions serve

# Deploy
supabase functions deploy send-welcome-email

# Set secrets
supabase secrets set RESEND_API_KEY=re_...
\`\`\`

### Edge Function

\`\`\`ts
// supabase/functions/send-welcome-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, name } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${Deno.env.get('RESEND_API_KEY')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'academy@jsupremetech.online',
        to: email,
        subject: \`Welcome to JST Academy, \${name}!\`,
        html: \`<h1>Welcome!</h1><p>Your crash courses are ready.</p>\`,
      }),
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
\`\`\`

### Call from Next.js

\`\`\`tsx
const { data, error } = await supabase.functions.invoke('send-welcome-email', {
  body: { email: user.email, name: user.name },
})
\`\`\``,
    quiz: [
      { q: 'What runtime do Supabase Edge Functions use?', options: ['Node.js', 'Deno — TypeScript-first, imports via URL, no node_modules', 'Bun', 'Python'], correct: 1, explanation: 'Edge Functions use Deno. No package.json or node_modules — import from URLs (esm.sh for npm packages, deno.land/std for standard library).' },
      { q: 'Why handle OPTIONS requests in Edge Functions?', options: ['For logging', 'CORS preflight — browsers send OPTIONS before cross-origin requests. Return headers to allow the actual request', 'Required by Deno', 'For authentication'], correct: 1, explanation: 'Browsers send an OPTIONS preflight request for cross-origin calls. The function must respond with Allow-Origin headers or the actual request is blocked.' },
      { q: 'How do you access secrets in an Edge Function?', options: ['process.env.KEY', 'Deno.env.get("KEY")', 'import.meta.env.KEY', 'config.secrets.KEY'], correct: 1, explanation: 'In Deno (Edge Functions), environment variables are accessed via Deno.env.get("KEY"). Set them with supabase secrets set KEY=value.' },
      { q: 'When should you use Edge Functions vs Next.js Route Handlers?', options: ['Edge Functions are always better', 'Edge Functions for logic shared across apps, webhooks, and heavy operations; Route Handlers for app-specific logic', 'Route Handlers are always better', 'They are identical'], correct: 1, explanation: 'Edge Functions are independent of your Next.js app — good for webhooks, background jobs, or shared microservices. Route Handlers are simpler for app-specific backend code.' },
    ],
  },
  {
    id: 'cc-supabase-m08', track: 'crash', title: 'Migrations & Schema Design',
    subtitle: 'Manage database schema with Supabase migrations and design production-ready tables.',
    moduleObjective: 'Write and run Supabase migrations and design normalized table schemas.',
    courseObjective: CC_SUPABASE_OBJ, crashId: 'cc-supabase', crashTitle: 'Supabase', level: 'PhD',
    xp: 200, duration: 11, module: 8, certArea: 'Supabase Crash Course',
    keyTerms: [
      { term: 'Migration', definition: 'A versioned SQL file that changes the database schema. Migrations are run in order — never edit a deployed migration.' },
      { term: 'supabase db push', definition: 'Applies pending local migrations to the remote Supabase project.' },
      { term: 'supabase db pull', definition: 'Generates a migration from the current remote schema — syncs remote changes to local.' },
      { term: 'Indexes', definition: 'CREATE INDEX speeds up queries on frequently filtered columns. Supabase adds a default index on primary keys.' },
      { term: 'Cascade delete', definition: 'ON DELETE CASCADE — when a parent row is deleted, child rows are automatically deleted. Maintains referential integrity.' },
    ],
    content: `## Migrations & Schema Design

Migrations give you version-controlled schema changes. Every ALTER TABLE or CREATE TABLE should go in a migration file.

### CLI Workflow

\`\`\`bash
# Initialize local Supabase (first time)
supabase init
supabase start  # starts local Docker instance

# Create a migration
supabase migration new create_progress_table

# Apply migrations to local
supabase db reset  # drops and recreates from all migrations

# Push to remote
supabase db push

# Pull remote schema changes
supabase db pull
\`\`\`

### Migration File

\`\`\`sql
-- supabase/migrations/20240901_create_progress.sql

CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  xp_earned INT NOT NULL DEFAULT 0,
  quiz_score INT,
  UNIQUE (user_id, course_id)
);

-- Enable RLS
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users read own progress"
  ON progress FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users insert own progress"
  ON progress FOR INSERT WITH CHECK (user_id = auth.uid());

-- Index for fast user lookups
CREATE INDEX progress_user_id_idx ON progress (user_id);
\`\`\`

### Schema Design Principles

\`\`\`sql
-- Use UUID primary keys (Supabase default)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Timestamp columns (always include)
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()

-- Soft deletes (instead of DELETE)
deleted_at TIMESTAMPTZ  -- null = active, non-null = deleted

-- Foreign keys with cascade
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE

-- Use TEXT not VARCHAR (Postgres internally identical, TEXT is simpler)
title TEXT NOT NULL
\`\`\``,
    quiz: [
      { q: 'Why should you never edit a deployed migration?', options: ['It is read-only', 'Other environments have already run it — editing it changes nothing on their DB and causes divergence', 'TypeScript restriction', 'Supabase prevents it'], correct: 1, explanation: 'Migrations are tracked by filename/timestamp. Editing a deployed migration does not re-run it. Create a new migration to change deployed schema.' },
      { q: 'What does ON DELETE CASCADE do?', options: ['Deletes the parent', 'Automatically deletes child rows when the parent row is deleted — maintains referential integrity', 'Required for foreign keys', 'Prevents deletion'], correct: 1, explanation: 'Without CASCADE, deleting a user with progress rows would fail (foreign key constraint). CASCADE makes child rows follow the parent.' },
      { q: 'Why add an index on user_id in the progress table?', options: ['Required by Supabase', 'Speeds up queries filtering by user_id — the most common query pattern for the progress table', 'For RLS policies', 'Adds a unique constraint'], correct: 1, explanation: 'Without an index, SELECT ... WHERE user_id = $1 does a full table scan. An index on user_id makes these queries fast as the table grows.' },
      { q: 'What does supabase db push do?', options: ['Pushes code to git', 'Applies pending local migration files to the remote Supabase project database', 'Creates a backup', 'Syncs env vars'], correct: 1, explanation: 'supabase db push runs any migration files that haven\'t been applied to the remote project yet — same as running them in the Supabase SQL editor.' },
    ],
  },
]
