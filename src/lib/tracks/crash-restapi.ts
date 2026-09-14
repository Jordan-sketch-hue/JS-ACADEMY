import type { Course } from '../courses'

const CC_RESTAPI_OBJ = 'Design and consume REST APIs — HTTP methods, status codes, authentication, rate limiting, and full-stack API patterns used in real Next.js applications.'

export const crashRestapiCourses: Course[] = [
  {
    id: 'cc-restapi-m01', track: 'crash', title: 'REST Fundamentals',
    subtitle: 'Understand REST principles, HTTP methods, and resource-based URL design.',
    moduleObjective: 'Design RESTful routes and apply the correct HTTP method and status code for each operation.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'REST', definition: 'Representational State Transfer — architectural style for distributed systems. Resources identified by URLs, manipulated via HTTP methods.' },
      { term: 'HTTP Methods', definition: 'GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Methods describe the operation, the URL describes the resource.' },
      { term: 'Stateless', definition: 'Each request must contain all information needed. Server stores no session state between requests.' },
      { term: 'Resource', definition: 'A noun in the URL representing a concept: /courses, /users, /progress. Not verbs (/getCourses).' },
      { term: 'Idempotent', definition: 'Calling the same request multiple times has the same result. GET, PUT, DELETE are idempotent. POST is not.' },
    ],
    content: `## REST Fundamentals

REST is the standard architectural style for web APIs. It maps HTTP methods to CRUD operations on URL-named resources.

### URL Design

\`\`\`
Collection:  GET    /api/courses         → list all courses
             POST   /api/courses         → create a course

Single item: GET    /api/courses/:id     → get one course
             PATCH  /api/courses/:id     → update a course
             DELETE /api/courses/:id     → delete a course

Nested:      GET    /api/users/:id/progress  → user's progress
             POST   /api/users/:id/progress  → mark course complete
\`\`\`

### HTTP Methods

\`\`\`
GET     → Read — safe, idempotent, no body
POST    → Create — not idempotent (creates new resource each time)
PUT     → Replace entire resource — idempotent
PATCH   → Partial update — send only changed fields
DELETE  → Remove — idempotent
HEAD    → Same as GET but no body — check existence/headers
OPTIONS → Describe allowed methods — used in CORS preflight
\`\`\`

### HTTP Status Codes

\`\`\`
2xx Success:
  200 OK           — successful GET, PUT, PATCH
  201 Created      — successful POST
  204 No Content   — successful DELETE (no body)

4xx Client Error:
  400 Bad Request  — invalid request body
  401 Unauthorized — not authenticated
  403 Forbidden    — authenticated but no permission
  404 Not Found    — resource doesn't exist
  422 Unprocessable — validation error (correct format, wrong data)
  429 Too Many Requests — rate limited

5xx Server Error:
  500 Internal Server Error — unexpected error
  503 Service Unavailable   — server overloaded/down
\`\`\`

### REST vs Other Patterns

\`\`\`
REST        — resource-based, HTTP verbs, flexible
GraphQL     — query language, single endpoint, specify exact fields
tRPC        — TypeScript-first RPC, end-to-end type safety, Next.js native
\`\`\``,
    quiz: [
      { q: 'What HTTP method creates a new resource?', options: ['GET', 'PUT', 'POST', 'PATCH'], correct: 2, explanation: 'POST creates a new resource. The server assigns the ID. PUT replaces a specific resource at a known ID (idempotent). POST is not idempotent — calling twice creates two resources.' },
      { q: 'What is the difference between 401 and 403?', options: ['They are identical', '401 = not authenticated (who are you?); 403 = authenticated but not authorized (I know who you are, but you can\'t do this)', '401 is for APIs only', '403 is for missing data'], correct: 1, explanation: '401 means the request lacks valid credentials — send the login page or auth challenge. 403 means the user is authenticated but lacks permission for this specific resource.' },
      { q: 'What does "stateless" mean in REST?', options: ['No server', 'Each request contains all needed information — server holds no session between requests', 'No database', 'Fast responses'], correct: 1, explanation: 'Stateless means the server does not remember the client between requests. Auth tokens, user IDs, and other context must be sent with every request.' },
      { q: 'Which HTTP methods are idempotent?', options: ['Only GET', 'GET, PUT, DELETE — calling them multiple times has the same result', 'POST and PATCH', 'All methods'], correct: 1, explanation: 'GET retrieves the same data, PUT replaces with the same data, DELETE removes (already gone after first call). POST creates a new resource each call — not idempotent.' },
    ],
  },
  {
    id: 'cc-restapi-m02', track: 'crash', title: 'Building REST APIs in Next.js',
    subtitle: 'Build fully typed REST API routes with Next.js Route Handlers.',
    moduleObjective: 'Implement CRUD REST endpoints using Next.js Route Handlers with validation.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'Basic',
    xp: 150, duration: 11, module: 2, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'Route Handler', definition: 'app/api/*/route.ts — named HTTP exports (GET, POST, PATCH, DELETE). The App Router API layer.' },
      { term: 'Zod validation', definition: 'z.parse(body) — validates and types the request body. Throws if validation fails. Returns typed data if valid.' },
      { term: 'NextResponse.json()', definition: 'Returns a JSON response with proper Content-Type header and optional status code.' },
      { term: 'params', definition: 'Dynamic route params accessed from the second argument: ({ params }: { params: Promise<{id: string}> }).' },
      { term: 'searchParams', definition: 'Query string parameters from req.nextUrl.searchParams.get("key").' },
    ],
    content: `## Building REST APIs in Next.js

Next.js Route Handlers implement REST endpoints. Zod validates input; NextResponse formats output.

### Collection Route

\`\`\`tsx
// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { COURSES } from '@/lib/courses'

export async function GET(req: NextRequest) {
  const track = req.nextUrl.searchParams.get('track')
  const level = req.nextUrl.searchParams.get('level')

  let courses = COURSES
  if (track) courses = courses.filter(c => c.track === track)
  if (level) courses = courses.filter(c => c.level === level)

  return NextResponse.json({
    data: courses,
    total: courses.length,
  })
}

const CreateCourseSchema = z.object({
  title: z.string().min(1).max(200),
  track: z.string(),
  xp: z.number().int().positive(),
  duration: z.number().int().positive(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = CreateCourseSchema.parse(body)

    // save to DB...
    const course = await createCourse(validated)

    return NextResponse.json({ data: course }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

### Single Item Route

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

  return NextResponse.json({ data: course })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  // partial update...
  return NextResponse.json({ data: updated })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // delete...
  return new NextResponse(null, { status: 204 })
}
\`\`\``,
    quiz: [
      { q: 'What does Zod validation provide on top of manual checks?', options: ['Nothing extra', 'Type inference from the schema — validated data is typed, no manual type assertions needed', 'Faster parsing', 'Required by Next.js'], correct: 1, explanation: 'After z.parse(body), the result is fully typed per the schema. Errors are structured for clean 422 responses.' },
      { q: 'What status code should a successful DELETE return?', options: ['200 with deleted object', '204 No Content — operation succeeded, no response body', '201 Created', '200 with empty array'], correct: 1, explanation: '204 No Content is the standard DELETE success response — confirms success without a body. 200 with the deleted resource is also acceptable.' },
      { q: 'How do you access query string params in a Route Handler?', options: ['req.params.get()', 'req.nextUrl.searchParams.get("key")', 'req.query.key', 'params.key'], correct: 1, explanation: 'req.nextUrl.searchParams is a URLSearchParams object. .get("key") returns the value or null. .getAll("key") returns an array for repeated params.' },
      { q: 'What HTTP status should a validation error return?', options: ['400 Bad Request', '422 Unprocessable Entity — the format is correct but the data violates business rules or schema', '500 Server Error', '401 Unauthorized'], correct: 1, explanation: '422 signals the request format is valid (parseable JSON) but the content fails validation — missing required fields, wrong types, constraint violations.' },
    ],
  },
  {
    id: 'cc-restapi-m03', track: 'crash', title: 'Authentication in APIs',
    subtitle: 'Secure REST endpoints with JWT tokens and API key authentication.',
    moduleObjective: 'Add JWT-based authentication to REST endpoints using middleware and headers.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'JWT', definition: 'JSON Web Token — a signed, base64-encoded token. Contains claims (user ID, role, expiry). Verified without a DB lookup.' },
      { term: 'Bearer token', definition: 'Authorization: Bearer <token> — the standard HTTP header for sending JWTs with requests.' },
      { term: 'API key', definition: 'A secret string passed in a header (X-API-Key) or query param. Simpler than OAuth for server-to-server calls.' },
      { term: 'Token expiry', definition: 'JWTs have an exp claim. Short-lived access tokens (15min) + long-lived refresh tokens (7d) is standard.' },
      { term: 'Supabase JWT', definition: 'Supabase issues JWTs on sign-in. Pass in Authorization header to authenticate API calls.' },
    ],
    content: `## Authentication in APIs

REST APIs are stateless — authentication tokens must be sent with every request in headers.

### JWT Auth Pattern

\`\`\`tsx
// Middleware auth check
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

// Protected route
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const progress = await getProgress(user.id)
  return NextResponse.json({ data: progress })
}
\`\`\`

### Sending Auth from the Client

\`\`\`tsx
'use client'
import { createClient } from '@/lib/supabase/client'

async function fetchMyProgress() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch('/api/progress', {
    headers: {
      Authorization: \`Bearer \${session?.access_token}\`,
      'Content-Type': 'application/json',
    },
  })

  return res.json()
}
\`\`\`

### API Key Auth (Server-to-Server)

\`\`\`tsx
// Route Handler
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('X-API-Key')

  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // process request...
}

// Calling from another service
await fetch('/api/internal/sync', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.INTERNAL_API_KEY!,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
})
\`\`\``,
    quiz: [
      { q: 'What is the Authorization header format for JWTs?', options: ['Token <jwt>', 'Bearer <jwt>', 'JWT <token>', 'Basic <jwt>'], correct: 1, explanation: 'Bearer is the standard token scheme: Authorization: Bearer eyJ... Defined in RFC 6750. Other schemes (Basic, Digest) are for different auth methods.' },
      { q: 'Why verify the JWT with Supabase on the server?', options: ['It is faster', 'Verifies the signature and checks expiry against Supabase servers — prevents forged or expired tokens', 'Required by Next.js', 'For TypeScript types'], correct: 1, explanation: 'Anyone can base64-decode a JWT. Verification checks the cryptographic signature to ensure Supabase issued it and it has not expired or been tampered with.' },
      { q: 'What is the difference between API key and JWT auth?', options: ['They are identical', 'API keys are static shared secrets (server-to-server); JWTs are user-specific, signed tokens with expiry', 'JWT is more secure always', 'API keys expire faster'], correct: 1, explanation: 'API keys are long-lived static secrets for service-to-service. JWTs are short-lived, user-specific, signed tokens. Both have their place.' },
      { q: 'What does a 401 response mean vs 403?', options: ['Both mean not allowed', '401: not authenticated (no valid credentials); 403: authenticated but not authorized for this resource', '401 is for users, 403 for services', '403 means rate limited'], correct: 1, explanation: '401 tells the client to authenticate. 403 tells the client they are authenticated but do not have permission — no point retrying with better auth.' },
    ],
  },
  {
    id: 'cc-restapi-m04', track: 'crash', title: 'Consuming APIs with fetch',
    subtitle: 'Fetch, cache, and handle errors from external REST APIs in Next.js.',
    moduleObjective: 'Consume REST APIs with typed fetch wrappers, error handling, and retry logic.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'fetch API', definition: 'Native browser + Node.js API for HTTP requests. Returns a Response — call .json() to parse the body.' },
      { term: 'Error handling', definition: 'fetch only rejects on network failure — a 404 or 500 resolves normally. Always check res.ok or res.status.' },
      { term: 'Typed fetch wrapper', definition: 'A typed helper function that calls fetch and returns typed data. Centralizes error handling and auth headers.' },
      { term: 'AbortController', definition: 'Cancel a fetch request. Set a timeout or cancel on component unmount to prevent state updates on stale requests.' },
      { term: 'Retry logic', definition: 'Automatically retry failed requests (network errors, 429, 503) with exponential backoff.' },
    ],
    content: `## Consuming APIs with fetch

fetch is the universal HTTP client. Typed wrappers give you consistency and type safety across all API calls.

### Basic Fetch

\`\`\`tsx
// fetch rejects only on network error — always check res.ok
const res = await fetch('/api/courses')
if (!res.ok) {
  throw new Error(\`HTTP \${res.status}: \${res.statusText}\`)
}
const data = await res.json()
\`\`\`

### Typed API Client

\`\`\`tsx
// lib/api.ts
type ApiResponse<T> = { data: T; error?: never } | { data?: never; error: string }

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const json = await res.json()

    if (!res.ok) {
      return { error: json.error ?? \`HTTP \${res.status}\` }
    }

    return { data: json.data ?? json }
  } catch (err) {
    return { error: 'Network error' }
  }
}

// Usage — fully typed
const { data: courses, error } = await apiFetch<Course[]>('/api/courses')
if (error) return <Error message={error} />
return <CourseList courses={courses} />
\`\`\`

### Fetch with Timeout

\`\`\`tsx
async function fetchWithTimeout<T>(url: string, ms = 5000): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  } finally {
    clearTimeout(id)
  }
}
\`\`\`

### Azure TTS API Call Pattern (used in this app)

\`\`\`tsx
const speechRes = await fetch(
  \`https://\${region}.tts.speech.microsoft.com/cognitiveservices/v1\`,
  {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
    },
    body: ssmlString,
  }
)

if (!speechRes.ok) {
  throw new Error(\`Azure TTS error: \${speechRes.status}\`)
}

const audioBuffer = await speechRes.arrayBuffer()
\`\`\``,
    quiz: [
      { q: 'When does fetch() reject with an error?', options: ['On any 4xx status', 'Only on network failures — 404 and 500 responses resolve normally; always check res.ok', 'On 500 only', 'Never rejects'], correct: 1, explanation: 'fetch resolves on all HTTP responses, even errors. The promise rejects only if the request never got a response (network down, CORS block, DNS failure).' },
      { q: 'What does res.ok represent?', options: ['True if status is 200', 'True if status is in 200-299 range — convenience property for success check', 'True if body is non-empty', 'True if JSON is valid'], correct: 1, explanation: 'res.ok is true for 200-299. More readable than checking res.status >= 200 && res.status < 300.' },
      { q: 'What is AbortController used for?', options: ['Cancelling database queries', 'Cancelling a fetch request — for timeouts or component unmount cleanup', 'Required for POST', 'Setting headers'], correct: 1, explanation: 'AbortController.abort() sends a signal to cancel a pending fetch. Used for timeouts and preventing state updates after component unmounts.' },
      { q: 'Why use a typed API wrapper over direct fetch calls?', options: ['No benefit', 'Centralizes error handling, auth headers, and response typing — consistent behavior across all API calls', 'Required for TypeScript', 'Faster network calls'], correct: 1, explanation: 'A typed wrapper ensures every API call handles errors the same way, includes auth headers automatically, and returns typed data without manual assertions.' },
    ],
  },
  {
    id: 'cc-restapi-m05', track: 'crash', title: 'Rate Limiting & Security',
    subtitle: 'Protect REST APIs from abuse with rate limiting, CORS, and input validation.',
    moduleObjective: 'Implement rate limiting and CORS in Next.js API routes.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'Masters',
    xp: 175, duration: 10, module: 5, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'Rate limiting', definition: 'Restricts requests per IP/user per time window. Returns 429 Too Many Requests when exceeded.' },
      { term: 'CORS', definition: 'Cross-Origin Resource Sharing — browser security mechanism. APIs must send Allow-Origin headers for cross-origin browser requests.' },
      { term: 'Input sanitization', definition: 'Strip or escape untrusted input before using it in SQL, HTML, or shell commands. Prevents injection attacks.' },
      { term: 'Security headers', definition: 'HTTP headers that protect against XSS, clickjacking, MIME sniffing: X-Frame-Options, X-Content-Type-Options, CSP.' },
      { term: 'OWASP Top 10', definition: 'The ten most critical web application security risks. Include injection, broken auth, XSS, insecure deserialization.' },
    ],
    content: `## Rate Limiting & Security

Public APIs need protection. Rate limiting, CORS, and security headers are the baseline for production APIs.

### Rate Limiting (Vercel + upstash/ratelimit)

\`\`\`tsx
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s'),  // 10 req per 10s
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) },
      }
    )
  }

  // process request...
}
\`\`\`

### CORS Headers

\`\`\`tsx
// next.config.ts — global CORS headers
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
    ],
  }]
}

// Route Handler for OPTIONS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  })
}
\`\`\`

### Security Headers

\`\`\`tsx
// next.config.ts
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  }]
}
\`\`\``,
    quiz: [
      { q: 'What status code does rate limiting return?', options: ['403 Forbidden', '429 Too Many Requests — with Retry-After header telling client when to retry', '503 Unavailable', '400 Bad Request'], correct: 1, explanation: '429 is the standard rate limit response. Include a Retry-After header (seconds until reset) so clients can implement proper backoff.' },
      { q: 'What is CORS protecting against?', options: ['SQL injection', 'Browser scripts from one origin making cross-origin requests — only browser requests are subject to CORS', 'DDoS attacks', 'Server-side attacks'], correct: 1, explanation: 'CORS is enforced by browsers, not servers. It prevents malicious web pages from making requests to your API using a visitor\'s credentials. Server-to-server calls ignore CORS.' },
      { q: 'What does X-Frame-Options: DENY do?', options: ['Denies all requests', 'Prevents the page from being embedded in an iframe — protects against clickjacking attacks', 'Blocks JavaScript', 'Denies unauthenticated users'], correct: 1, explanation: 'Clickjacking embeds your page in an invisible iframe to trick users into clicking buttons. X-Frame-Options: DENY prevents any framing of your pages.' },
      { q: 'When is input validation most critical?', options: ['Only for forms', 'At every system boundary — any data from users, external APIs, or untrusted sources must be validated before use', 'Only in the database', 'Not needed with TypeScript'], correct: 1, explanation: 'TypeScript types are compile-time only — at runtime, anything can come in from external sources. Validate and sanitize at every boundary: API routes, webhooks, form submissions.' },
    ],
  },
  {
    id: 'cc-restapi-m06', track: 'crash', title: 'Pagination & Filtering',
    subtitle: 'Implement cursor-based pagination and advanced filtering for REST collections.',
    moduleObjective: 'Build cursor-based and offset pagination with filter and sort query parameters.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'Offset pagination', definition: '?page=2&limit=20 — skip (page-1)*limit rows. Simple but has issues with large datasets and real-time data.' },
      { term: 'Cursor pagination', definition: '?cursor=last_id&limit=20 — start from a specific item. Consistent even when data changes between pages.' },
      { term: 'Cursor', definition: 'An opaque value (base64-encoded ID or timestamp) clients pass to get the next page. Must not be interpretable by clients.' },
      { term: 'has_more', definition: 'Boolean in the response indicating whether more pages exist. Drives infinite scroll and "Load more" UI.' },
      { term: 'Query normalization', definition: 'Parse and validate all query params before using them. Prevent SQL injection via Zod schema on the params.' },
    ],
    content: `## Pagination & Filtering

APIs returning large collections need pagination. Cursor pagination is more robust than offset for real-time data.

### Offset Pagination

\`\`\`tsx
// GET /api/courses?page=1&limit=20&track=crash&level=Basic

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1')
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '20'), 100)
  const track = req.nextUrl.searchParams.get('track')
  const level = req.nextUrl.searchParams.get('level')

  let courses = COURSES
  if (track) courses = courses.filter(c => c.track === track)
  if (level) courses = courses.filter(c => c.level === level)

  const total = courses.length
  const offset = (page - 1) * limit
  const paginated = courses.slice(offset, offset + limit)

  return NextResponse.json({
    data: paginated,
    meta: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      has_more: offset + limit < total,
    },
  })
}
\`\`\`

### Cursor Pagination

\`\`\`tsx
// GET /api/progress?cursor=base64_encoded_id&limit=20

export async function GET(req: NextRequest) {
  const limit = 20
  const rawCursor = req.nextUrl.searchParams.get('cursor')
  const cursor = rawCursor ? Buffer.from(rawCursor, 'base64').toString() : null

  const query = supabase
    .from('progress')
    .select('*')
    .order('id')
    .limit(limit + 1)  // fetch one extra to check has_more

  if (cursor) query.gt('id', cursor)

  const { data } = await query
  const has_more = data!.length > limit
  const items = has_more ? data!.slice(0, limit) : data!
  const next_cursor = has_more
    ? Buffer.from(items[items.length - 1].id).toString('base64')
    : null

  return NextResponse.json({ data: items, next_cursor, has_more })
}
\`\`\`

### Sort and Filter Parameters

\`\`\`
GET /api/courses?
  track=crash                 filter by track
  level=Basic                 filter by level
  sort=xp                     sort field
  order=desc                  sort direction
  search=javascript           full-text search
  min_xp=150&max_xp=200      range filter
\`\`\``,
    quiz: [
      { q: 'What is the main advantage of cursor pagination over offset?', options: ['Simpler to implement', 'Consistent results even when data changes — offset pagination shows duplicates or skips items when data is added', 'Faster always', 'Works with search'], correct: 1, explanation: 'If 5 items are inserted before page 2 loads, offset pagination shows 5 duplicates. Cursor pagination always starts after the last seen item.' },
      { q: 'Why fetch limit+1 items for cursor pagination?', options: ['For caching', 'To check if there are more results without an extra COUNT query — if n+1 results exist, has_more is true', 'Required pattern', 'For error handling'], correct: 1, explanation: 'Fetching one extra item lets you determine has_more without a separate count query. If count > limit, there are more pages.' },
      { q: 'Why should cursors be opaque (base64-encoded)?', options: ['Saves bandwidth', 'Prevents clients from interpreting or manipulating the cursor value — implementation detail hidden', 'Required by spec', 'Encryption'], correct: 1, explanation: 'Opaque cursors let you change the underlying pagination strategy without breaking clients. Clients treat it as a black box token.' },
      { q: 'What is the standard limit cap pattern?', options: ['No cap needed', 'Math.min(userLimit, MAX_LIMIT) — prevents clients from requesting 10000 items in one call', 'Always use 20', 'Server decides always'], correct: 1, explanation: 'Always cap the limit: Math.min(requested, 100). Without a cap, a single request could return millions of rows and crash your server.' },
    ],
  },
  {
    id: 'cc-restapi-m07', track: 'crash', title: 'Webhooks & Event-Driven APIs',
    subtitle: 'Implement webhooks to push real-time events and verify signature security.',
    moduleObjective: 'Build and verify webhook endpoints with HMAC signature validation.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'PhD',
    xp: 200, duration: 10, module: 7, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'Webhook', definition: 'HTTP callback — a third-party service POSTs to your URL when an event occurs. Inverted API: they call you, you don\'t poll them.' },
      { term: 'HMAC signature', definition: 'Hash-based Message Authentication Code — the sender signs the payload with a shared secret. You verify on receipt.' },
      { term: 'Idempotency key', definition: 'A unique key per event. Store processed keys to prevent duplicate processing when webhooks are retried.' },
      { term: 'Retry logic', definition: 'Webhook providers retry failed deliveries (non-2xx). Your handler must be idempotent.' },
      { term: 'Raw body', definition: 'Signature verification requires the raw request body (unmodified bytes). Parse JSON only after verification.' },
    ],
    content: `## Webhooks & Event-Driven APIs

Webhooks let third-party services notify you of events in real time. You build the receiver; they call it.

### Webhook Receiver with Signature Verification

\`\`\`tsx
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

export async function POST(req: NextRequest) {
  // Get raw body BEFORE parsing JSON
  const rawBody = await req.text()
  const signature = req.headers.get('x-stripe-signature') ?? ''

  if (!verifySignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const idempotencyKey = event.id

  // Check for duplicate event
  const already = await db.processedEvents.findUnique({ where: { id: idempotencyKey } })
  if (already) return NextResponse.json({ received: true })

  // Process event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePayment(event.data.object)
      break
  }

  // Mark as processed
  await db.processedEvents.create({ data: { id: idempotencyKey } })
  return NextResponse.json({ received: true })
}

// Disable body parsing (Next.js default) — we need raw text
export const config = { api: { bodyParser: false } }
\`\`\`

### Sending Webhooks (Outbound)

\`\`\`tsx
async function sendWebhook(url: string, event: object, secret: string) {
  const payload = JSON.stringify(event)
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    },
    body: payload,
  })
}
\`\`\``,
    quiz: [
      { q: 'Why must you verify webhook signatures?', options: ['It is faster', 'Prevents attackers from sending forged webhook payloads to trigger actions — proves the event came from the real sender', 'Required by HTTP spec', 'Prevents duplicates'], correct: 1, explanation: 'Without signature verification, anyone can POST to your webhook URL and trigger actions. The HMAC proves the payload was signed with the shared secret.' },
      { q: 'What is timingSafeEqual used for?', options: ['Faster comparison', 'Prevents timing attacks — regular string comparison leaks information about how much of the signature matches', 'Required for HMAC', 'Unicode handling'], correct: 1, explanation: 'Regular === comparison short-circuits on the first mismatch — an attacker can measure timing to guess the signature byte-by-byte. timingSafeEqual always takes the same time.' },
      { q: 'Why must webhook handlers be idempotent?', options: ['For performance', 'Webhook providers retry on non-2xx responses — your handler may receive the same event multiple times', 'Required by spec', 'For logging'], correct: 1, explanation: 'If your handler returns non-200, the provider retries (often multiple times). Store processed event IDs to prevent duplicate order fulfillment, double billing, etc.' },
      { q: 'Why read the raw body before parsing JSON?', options: ['JSON parsing is slow', 'HMAC verification requires the exact bytes that were signed — parsing to JSON and re-serializing changes whitespace', 'Required by all parsers', 'For error handling'], correct: 1, explanation: 'Signature is computed on the exact payload bytes. JSON.parse + JSON.stringify may reorder keys or change whitespace — invalidating the signature.' },
    ],
  },
  {
    id: 'cc-restapi-m08', track: 'crash', title: 'API Design & Documentation',
    subtitle: 'Design clean, consistent APIs and document them with OpenAPI.',
    moduleObjective: 'Apply REST API design principles and generate OpenAPI documentation.',
    courseObjective: CC_RESTAPI_OBJ, crashId: 'cc-restapi', crashTitle: 'REST APIs', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'REST APIs Crash Course',
    keyTerms: [
      { term: 'Versioning', definition: '/api/v1/ — version in the URL. Allows breaking changes without breaking existing clients.' },
      { term: 'OpenAPI', definition: 'Machine-readable API specification (formerly Swagger). Generates documentation, client SDKs, and validation.' },
      { term: 'Error envelope', definition: 'Consistent error response shape: { error: { code, message, details } }. Clients know exactly where to find the error.' },
      { term: 'Hypermedia (HATEOAS)', definition: 'Including related links in responses: { data: course, links: { self, modules, cert } }. Enables API discoverability.' },
      { term: 'API contract', definition: 'The agreed-upon interface between client and server. Changes to the contract are breaking changes that require versioning.' },
    ],
    content: `## API Design & Documentation

A well-designed API is predictable, consistent, and self-documented. These principles reduce bugs and client integration time.

### Response Envelope Pattern

\`\`\`tsx
// Consistent response shape
type ApiSuccess<T> = {
  data: T
  meta?: {
    page?: number
    total?: number
    has_more?: boolean
  }
}

type ApiError = {
  error: {
    code: string        // machine-readable: "COURSE_NOT_FOUND"
    message: string     // human-readable: "The requested course was not found"
    details?: unknown   // Zod validation errors, etc.
  }
}

// All routes return one of these two shapes
function ok<T>(data: T, meta?: ApiSuccess<T>['meta']): NextResponse {
  return NextResponse.json({ data, meta })
}

function err(code: string, message: string, status: number): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status })
}

// Usage
return ok(course)
return err('COURSE_NOT_FOUND', 'Course not found', 404)
\`\`\`

### Versioning

\`\`\`
app/
  api/
    v1/
      courses/
        route.ts      ← /api/v1/courses
      progress/
        route.ts
    v2/
      courses/
        route.ts      ← /api/v2/courses (breaking changes)
\`\`\`

### OpenAPI with Zod

\`\`\`tsx
// Using next-swagger-doc or zod-to-openapi
import { extendZodWithOpenApi } from 'zod-to-openapi'

const CourseSchema = z.object({
  id: z.string().openapi({ example: 'cc-js-m01' }),
  title: z.string().openapi({ example: 'JavaScript Fundamentals' }),
  xp: z.number().openapi({ example: 150 }),
})

// Auto-generates /api/docs OpenAPI spec
\`\`\`

### API Design Checklist

\`\`\`
✅ Nouns in URLs, verbs as HTTP methods
✅ Consistent response envelope { data, meta } / { error }
✅ HTTP status codes used correctly
✅ Pagination on all list endpoints
✅ Versioned (/v1/) if public-facing
✅ All inputs validated (Zod)
✅ Auth on every non-public endpoint
✅ Rate limiting on auth and write endpoints
✅ CORS configured for production domains
✅ Security headers in place
\`\`\``,
    quiz: [
      { q: 'What is the benefit of a consistent error envelope?', options: ['Smaller responses', 'Clients always know where to find the error code and message — no conditional parsing per endpoint', 'Required by REST', 'Easier logging'], correct: 1, explanation: 'Consistent error envelopes mean clients parse errors the same way regardless of which endpoint errored. Machine-readable codes let clients handle specific errors.' },
      { q: 'Why version your API?', options: ['For documentation', 'Allows breaking changes without breaking existing clients — v1 stays stable while v2 ships new behavior', 'Required for rate limiting', 'SEO benefit'], correct: 1, explanation: 'Versioning decouples your release cycle from your clients\'. v1 clients continue working after v2 ships breaking changes.' },
      { q: 'What does OpenAPI provide?', options: ['Database schema', 'Machine-readable API spec — generates interactive docs, client SDKs, and validation from one source of truth', 'Required for REST', 'Replaces tests'], correct: 1, explanation: 'OpenAPI (Swagger) spec can generate documentation UIs (Swagger UI), typed client SDKs in any language, and server-side request validation.' },
      { q: 'What makes a REST API predictable?', options: ['Using only GET requests', 'Consistent naming, correct HTTP methods and status codes, uniform response shape, and documented error codes', 'No versioning', 'Single endpoint'], correct: 1, explanation: 'Predictability comes from consistency. Developers integrating your API should be able to guess how it works before reading the docs.' },
    ],
  },
]
