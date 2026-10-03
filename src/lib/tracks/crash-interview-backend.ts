import type { Course } from '../courses'

const CC_BE_OBJ = 'Ace the backend developer interview — REST design, database internals, Node.js, auth, system design, algorithms, Docker/CI, and building production APIs under interview conditions.'

export const crashInterviewBackendCourses: Course[] = [
  {
    id: 'cc-interview-be-m01', track: 'crash', title: 'REST API Design — Senior-Level Questions',
    subtitle: 'HTTP verbs, status codes, versioning, idempotency, pagination, and the API design decisions that separate juniors from seniors.',
    moduleObjective: 'Design a production REST API: choose correct HTTP methods and status codes, implement cursor pagination, and explain idempotency and HATEOAS.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 1, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'Idempotency', definition: 'A request is idempotent if making it multiple times has the same effect as making it once. GET, PUT, DELETE are idempotent. POST is not. Critical for retry logic.' },
      { term: 'Cursor Pagination', definition: 'Paginate using a pointer to the last item (cursor) rather than an offset. Stable under inserts/deletes. Required for real-time feeds. ?after=cursor_token' },
      { term: 'HATEOAS', definition: 'Hypermedia As The Engine Of Application State — responses include links to related actions. Self-documenting APIs. Often impractical; understand the concept.' },
      { term: 'Content Negotiation', definition: 'Client declares Accept: application/json or Accept: application/xml. Server responds with Content-Type header matching what it returned.' },
      { term: 'Rate Limiting', definition: 'Protect APIs from abuse. Token bucket algorithm. Headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After. 429 Too Many Requests status.' },
      { term: 'ETags', definition: 'Entity Tag — a hash of the response content. Client sends If-None-Match on next request. Server returns 304 Not Modified if unchanged. Saves bandwidth.' },
      { term: 'Versioning', definition: 'URL path: /v1/users (most common), Header: API-Version: 2, Accept header negotiation. Path versioning is most explicit and cacheable.' },
    ],
    content: `## REST API Design — Senior-Level Questions

### HTTP Methods — The Full Semantic Contract

\`\`\`
GET    /products          — list products (safe, idempotent, cacheable)
GET    /products/123      — get one product
POST   /products          — create product (NOT idempotent — repeated calls create duplicates)
PUT    /products/123      — full replacement (idempotent — same result if repeated)
PATCH  /products/123      — partial update (usually idempotent in practice)
DELETE /products/123      — delete (idempotent — deleting twice has same effect as once)

GET    /products/123/reviews      — sub-resource (reviews belong to product)
POST   /products/123/reviews      — create a review for product 123
DELETE /products/123/reviews/456  — delete review 456 of product 123
\`\`\`

**Interview question: "When do you use PUT vs PATCH?"**
> PUT replaces the entire resource — you must send all fields. PATCH updates only the provided fields. If a client sends PUT with only \`name\`, all other fields would be erased. PATCH is safer for partial updates. PUT is correct when the client owns the full representation.

---

### Status Codes — The Ones That Matter

\`\`\`
200 OK             — successful GET, PUT, PATCH
201 Created        — successful POST (include Location header to new resource)
204 No Content     — successful DELETE (no body)
400 Bad Request    — validation failure, malformed JSON
401 Unauthorized   — not authenticated (no or invalid token)
403 Forbidden      — authenticated but lacks permission
404 Not Found      — resource doesn't exist
409 Conflict       — state conflict (duplicate email, concurrent modification)
422 Unprocessable  — request understood but semantically invalid
429 Too Many Req   — rate limited
500 Internal Err   — server error (don't leak details to client)
503 Unavailable    — server down/overloaded (include Retry-After header)
\`\`\`

**Common mistake:** Returning 200 with \`{ error: "not found" }\` in the body. Use the correct status code — clients (and monitoring tools) depend on it.

---

### Pagination — Offset vs Cursor

\`\`\`js
// OFFSET pagination (simple but has problems)
GET /products?page=3&limit=20
// SQL: SELECT * FROM products LIMIT 20 OFFSET 40
// Problem: if a record is inserted/deleted between page 1 and page 2 requests,
// you get duplicates or miss items. Fine for small, stable datasets.

// CURSOR pagination (stable, scalable)
GET /products?limit=20&after=cursor_abc123
// SQL: SELECT * FROM products WHERE id > :cursor ORDER BY id LIMIT 20
// Response includes:
{
  "data": [...],
  "pagination": {
    "hasNextPage": true,
    "nextCursor": "cursor_xyz789",
    "total": null  // cursor pagination often can't provide total count cheaply
  }
}
// Use for: real-time feeds, large datasets, anything that changes frequently
\`\`\`

---

### Rate Limiting — Token Bucket Algorithm

\`\`\`
Token Bucket:
- Bucket holds max N tokens (burst capacity)
- Tokens refill at rate R per second
- Each request consumes 1 token
- If bucket empty → 429 Too Many Requests

Example: 100 tokens, refill 10/second
- Burst: 100 requests immediately
- Sustained: 10 requests/second
\`\`\`

\`\`\`js
// Rate limit response headers
{
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Remaining': '87',
  'X-RateLimit-Reset': '1715000060',  // Unix timestamp when window resets
  'Retry-After': '60',               // Only on 429
}
\`\`\`

---

### API Versioning

\`\`\`
// URL versioning (most common — explicit, cacheable)
GET /api/v1/users
GET /api/v2/users  // v2 changes response shape

// Header versioning
GET /api/users
API-Version: 2

// Accept header versioning
GET /api/users
Accept: application/vnd.myapp.v2+json
\`\`\`

**Interview answer:** "I use URL versioning for public APIs — it's explicit, easy to test in a browser, and works with CDN caching. For internal APIs between services, header versioning is cleaner."

---

### Error Response Shape

\`\`\`js
// Consistent error format across all endpoints
{
  "error": {
    "code": "VALIDATION_ERROR",       // machine-readable code
    "message": "Email is invalid",   // human-readable message
    "details": [                      // optional field-level errors
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "age", "message": "Must be at least 18" }
    ],
    "requestId": "req_abc123"        // for server-side log tracing
  }
}
\`\`\`

---

### Idempotency Keys

\`\`\`js
// POST is NOT idempotent by default
// But you can make it idempotent with an Idempotency-Key header

POST /payments
Idempotency-Key: client-generated-uuid-abc123

// Server: store result against this key for 24h
// If same key comes again (network retry), return cached result
// This is how Stripe prevents duplicate charges on network failures
\`\`\`
`,
    quiz: [
      { q: 'A client sends PUT /users/1 with only {"name": "Jordan"}. What happens to the email field?', options: ['It stays unchanged', 'It is set to null/removed — PUT replaces the entire resource', 'The request fails', 'PUT only updates provided fields'], correct: 1, explanation: 'PUT semantically replaces the entire resource. If you don\'t include a field, it should be unset. Use PATCH for partial updates. This is the most important semantic difference.' },
      { q: 'Why is cursor pagination preferred over offset pagination for large, frequently-updated datasets?', options: ['Cursor is faster to implement', 'Offset pagination causes duplicate or missing items when records are inserted/deleted between page requests', 'Cursor requires fewer SQL queries', 'Offset doesn\'t support sorting'], correct: 1, explanation: 'With offset: DELETE record 5 before page 2 request → what was on page 2 is now on page 1 → you miss record 20. With cursor: pointer to last seen item is stable regardless of inserts/deletes.' },
      { q: 'What status code should you return when a user is authenticated but lacks permission for the resource?', options: ['401 Unauthorized', '404 Not Found', '403 Forbidden', '400 Bad Request'], correct: 2, explanation: '401 means "not authenticated — who are you?". 403 means "I know who you are, but you can\'t do this." Returning 404 on a forbidden resource is sometimes done intentionally to hide the resource\'s existence.' },
      { q: 'What is the purpose of an Idempotency-Key header on a POST request?', options: ['Authentication token', 'Allow clients to safely retry failed POST requests without creating duplicates', 'Request routing', 'API versioning'], correct: 1, explanation: 'POST creates a new resource on each call. With an Idempotency-Key, the server caches the result and returns the same response on retry without re-processing. Critical for payment APIs.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a REST API router simulator. Build a Router class with get(path, handler), post(path, handler), put(path, handler), delete(path, handler) methods. Routes support path parameters (:id). The router matches requests and calls the right handler, returning 404 if no match.',
      starterCode: `class Router {
  constructor() {
    this.routes = []  // [{ method, pattern, handler }]
  }

  // Register route methods
  get(path, handler)    { this.routes.push({ method: 'GET',    path, handler }) }
  post(path, handler)   { this.routes.push({ method: 'POST',   path, handler }) }
  put(path, handler)    { this.routes.push({ method: 'PUT',    path, handler }) }
  delete(path, handler) { this.routes.push({ method: 'DELETE', path, handler }) }

  // Match a request and call the handler
  handle(method, url) {
    for (const route of this.routes) {
      if (route.method !== method) continue
      const params = matchPath(route.path, url)
      if (params !== null) {
        return route.handler({ params, method, url })
      }
    }
    return { status: 404, body: { error: { code: 'NOT_FOUND' } } }
  }
}

function matchPath(pattern, url) {
  // TODO: convert :param into a regex capture group
  // /users/:id should match /users/123 and return { id: '123' }
  // Return null if no match
}

// Test
const router = new Router()
router.get('/users',     ({ params }) => ({ status: 200, body: { users: [] } }))
router.get('/users/:id', ({ params }) => ({ status: 200, body: { id: params.id } }))
router.post('/users',    ({ params }) => ({ status: 201, body: { created: true } }))

console.log(router.handle('GET', '/users'))         // 200 { users: [] }
console.log(router.handle('GET', '/users/42'))      // 200 { id: '42' }
console.log(router.handle('POST', '/users'))        // 201 { created: true }
console.log(router.handle('DELETE', '/users/42'))   // 404 not found`,
      hints: ['Replace :param with a named capture group: (\\w+)', 'Use new RegExp("^" + pattern + "$") for full-path matching', 'Match object\'s groups property gives the named captures'],
    },
  },
  {
    id: 'cc-interview-be-m02', track: 'crash', title: 'Database Internals — Indexes, Transactions & N+1',
    subtitle: 'What makes a query slow, how indexes work under the hood, ACID transactions, the N+1 problem, and connection pooling.',
    moduleObjective: 'Identify slow queries, choose correct index types, explain ACID with real examples, solve the N+1 problem, and design a schema for a common interview scenario.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'Masters', xp: 220, duration: 16, module: 2, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'B-Tree Index', definition: 'The default index type. Sorted tree structure. Efficient for range queries (WHERE created_at > X), equality, ORDER BY. Most columns use this.' },
      { term: 'N+1 Problem', definition: 'Fetching 1 parent record, then N queries for its children. 100 users → 101 queries. Fix: JOIN or eager loading (include/populate in ORM).' },
      { term: 'ACID', definition: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crash).' },
      { term: 'Connection Pool', definition: 'A set of pre-opened database connections shared across requests. Avoids the cost of creating a new connection per request. pgPool, Prisma, etc.' },
      { term: 'EXPLAIN ANALYZE', definition: 'PostgreSQL command to show query execution plan and actual row counts/timing. First step in diagnosing a slow query.' },
      { term: 'Covering Index', definition: 'An index that includes all columns needed by a query. The query is answered entirely from the index without touching the main table (index-only scan).' },
      { term: 'Isolation Level', definition: 'READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE. Higher isolation = fewer anomalies = more locking/overhead. Choose based on consistency needs.' },
    ],
    content: `## Database Internals — Indexes, Transactions & N+1

### How Indexes Work

Without an index, every query scans the whole table — O(n). A B-tree index is a balanced tree sorted on the indexed column — lookup is O(log n).

\`\`\`sql
-- Full table scan (slow on large tables)
SELECT * FROM orders WHERE customer_id = 42;
-- Without index: reads every row

-- After creating an index:
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
-- Now: O(log n) lookup, reads only matching rows

-- Composite index — order matters!
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);
-- This index serves: WHERE customer_id = 42
--                   WHERE customer_id = 42 AND created_at > '2024-01-01'
-- But NOT:           WHERE created_at > '2024-01-01' (needs leading column)

-- EXPLAIN ANALYZE shows the query plan
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42 AND created_at > '2024-01-01';
-- Look for: "Index Scan" (good) vs "Seq Scan" (may be slow)
\`\`\`

---

### The N+1 Problem

\`\`\`js
// N+1 — the most common ORM mistake
const users = await User.findAll()         // 1 query
for (const user of users) {
  const posts = await Post.findAll({ where: { userId: user.id } })  // N queries!
  // 100 users = 101 total queries
}

// Fix 1: JOIN (SQL)
const usersWithPosts = await User.findAll({
  include: [{ model: Post }]  // Sequelize eager loading → 1 query with JOIN
})

// Fix 2: DataLoader pattern (batch by ID)
const postsByUser = await Post.findAll({
  where: { userId: users.map(u => u.id) }  // WHERE userId IN (1,2,3,...) — 1 query
})
const postMap = groupBy(postsByUser, 'userId')
users.forEach(u => { u.posts = postMap[u.id] || [] })
\`\`\`

---

### ACID with Real Examples

\`\`\`sql
-- Atomicity: all steps succeed or all roll back
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- both succeed
-- If second UPDATE fails, first is rolled back automatically — no money lost

-- Isolation: concurrent transactions don't see each other's uncommitted work
-- Session 1:
BEGIN;
UPDATE products SET stock = stock - 1 WHERE id = 5;
-- (not committed yet)

-- Session 2 (READ COMMITTED isolation):
SELECT stock FROM products WHERE id = 5;
-- Returns original stock — doesn't see Session 1's uncommitted change

-- Optimistic locking for concurrent updates:
UPDATE products
SET stock = stock - 1, version = version + 1
WHERE id = 5 AND version = 3;
-- Returns 0 rows if version changed (someone else updated) → retry
\`\`\`

---

### Schema Design Interview: E-Commerce

\`\`\`sql
-- Products
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  status      VARCHAR(50) NOT NULL DEFAULT 'pending',
  total       DECIMAL(10,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Order line items (many-to-many with quantity/price snapshot)
CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL  -- snapshot at time of purchase
);

-- Indexes for common queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category_id ON products(category_id);
\`\`\`

**Why snapshot unit_price?** Because product.price can change. The customer paid $29.99 regardless of what the price is today.

---

### Connection Pooling

\`\`\`
Without pool: each request opens a new DB connection
→ TCP handshake + auth = 100-300ms per request
→ 1000 concurrent users = 1000 connections = DB overloaded

With pool (e.g., size=10):
→ 10 persistent connections
→ Requests wait for an available connection (queue)
→ 1000 concurrent users → 10 connections handle all of them
\`\`\`

\`\`\`js
// Prisma handles pooling automatically
// PgBouncer is a standalone connection pooler in front of PostgreSQL

// node-postgres (pg) manual pool:
import { Pool } from 'pg'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,           // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
\`\`\`
`,
    quiz: [
      { q: 'A composite index on (customer_id, created_at) — does it help a query that only filters on created_at?', options: ['Yes, composite indexes work for any column in them', 'No — composite indexes must be used from the leading column', 'Only if created_at is unique', 'Yes, if created_at has high cardinality'], correct: 1, explanation: 'Composite indexes work like a phone book sorted by (last_name, first_name). You can\'t look up by first_name alone efficiently. The leading column (customer_id) must be in the WHERE clause for the index to be used.' },
      { q: 'How does the N+1 problem typically manifest?', options: ['One slow query', 'N+1 separate database queries where N is the number of parent records', 'A transaction that never commits', 'A JOIN that returns too many rows'], correct: 1, explanation: '1 query fetches N records. Then for each record, 1 more query fetches its related data. 100 users → 101 queries. Fix with JOIN (eager loading) or batch queries (WHERE id IN (...)).' },
      { q: 'In ACID, what does "Isolation" guarantee?', options: ['Data survives a server crash', 'All steps in a transaction complete or none do', 'Concurrent transactions don\'t interfere with each other', 'The database remains in a valid state'], correct: 2, explanation: 'Isolation means concurrent transactions are separated. Without it, you\'d get dirty reads (reading uncommitted changes), non-repeatable reads, and phantom rows. READ COMMITTED is PostgreSQL\'s default.' },
      { q: 'Why store unit_price in order_items instead of just a product_id reference?', options: ['To reduce JOIN complexity', 'Prices change — you need to preserve what the customer actually paid at purchase time', 'To improve index performance', 'Regulatory requirement'], correct: 1, explanation: 'If you reference product.price directly, a price change would retroactively change historical orders. Always snapshot prices (and product names) at time of purchase. Same logic applies to shipping addresses.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a simple in-memory query cache with TTL (time-to-live). The cache wraps an async function: on first call it executes the function and caches the result; subsequent calls within TTL return cached value; after TTL expires, the next call re-fetches. Include a method to invalidate specific keys.',
      starterCode: `function createQueryCache(ttlMs = 5000) {
  const cache = new Map()  // key → { value, expiresAt }

  return {
    async get(key, fetchFn) {
      // TODO: if cached and not expired, return cached value
      // TODO: otherwise call fetchFn(), cache the result with expiry, return it
    },

    invalidate(key) {
      // TODO: remove key from cache
    },

    invalidateAll() {
      cache.clear()
    }
  }
}

// Simulate a database query
let queryCount = 0
async function fetchUser(id) {
  queryCount++
  console.log(\`DB query #\${queryCount} for user \${id}\`)
  return { id, name: \`User \${id}\`, email: \`user\${id}@example.com\` }
}

// Test
const cache = createQueryCache(1000)  // 1 second TTL

;(async () => {
  const u1 = await cache.get('user:1', () => fetchUser(1))  // DB query
  const u2 = await cache.get('user:1', () => fetchUser(1))  // Cached
  const u3 = await cache.get('user:1', () => fetchUser(1))  // Cached
  console.log(\`Total DB queries: \${queryCount}\`)  // Should be 1
  cache.invalidate('user:1')
  const u4 = await cache.get('user:1', () => fetchUser(1))  // DB query after invalidation
  console.log(\`Total DB queries: \${queryCount}\`)  // Should be 2
})()`,
      hints: ['cache.has(key) && cache.get(key).expiresAt > Date.now() to check freshness', 'cache.set(key, { value: result, expiresAt: Date.now() + ttlMs })', 'Return cache.get(key).value when fresh'],
    },
  },
  {
    id: 'cc-interview-be-m03', track: 'crash', title: 'Authentication & Security',
    subtitle: 'JWT anatomy, OAuth 2.0, password hashing, OWASP Top 10 in backend context, and building a secure auth system.',
    moduleObjective: 'Implement JWT-based auth with refresh tokens, explain OAuth 2.0 authorization code flow, hash passwords correctly, and prevent SQL injection and other OWASP vulnerabilities.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'Masters', xp: 220, duration: 15, module: 3, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'JWT (JSON Web Token)', definition: 'Base64-encoded header.payload.signature. Stateless — server verifies signature without DB lookup. Payload holds claims. Never put sensitive data in payload — it\'s base64, not encrypted.' },
      { term: 'Refresh Token', definition: 'Long-lived token stored in HttpOnly cookie. Used to obtain new short-lived access tokens without re-login. If stolen, can be revoked via DB.' },
      { term: 'OAuth 2.0', definition: 'Authorization framework. Four flows: Authorization Code (web apps), PKCE (SPAs/mobile), Client Credentials (server-to-server), Implicit (deprecated).' },
      { term: 'bcrypt', definition: 'Password hashing function with a cost factor. Slow by design — makes brute force expensive. Hash is not reversible. Never store plaintext passwords.' },
      { term: 'SQL Injection', definition: 'Attacker injects SQL via user input. Prevention: parameterized queries / prepared statements. NEVER concatenate user input into SQL strings.' },
      { term: 'RBAC', definition: 'Role-Based Access Control. Users are assigned roles (admin, editor, viewer). Roles have permissions. Simpler than ABAC, sufficient for most applications.' },
      { term: 'OWASP Top 10', definition: 'Standard awareness of most critical web security risks: injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, vulnerable components, insufficient logging.' },
    ],
    content: `## Authentication & Security

### JWT — Anatomy and Correct Usage

A JWT has three parts: header.payload.signature, each base64url-encoded.

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← header: {"alg":"HS256","typ":"JWT"}
.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MTUwMDAwMDB9  ← payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← signature
\`\`\`

**What goes in the payload:**
- userId, email, role — identifying info
- exp (expiry), iat (issued at), iss (issuer)

**What NEVER goes in the payload:**
- Passwords, full SSN, credit card numbers — the payload is **base64, not encrypted**. Anyone can decode it.

\`\`\`js
// Generating a JWT (Node.js, jsonwebtoken library)
import jwt from 'jsonwebtoken'

function generateTokens(userId, role) {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }  // short-lived — 15 minutes
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }   // long-lived — 7 days
  )
  return { accessToken, refreshToken }
}

// Verifying a JWT
function verifyAccess(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new Error('Access token expired')
    throw new Error('Invalid token')
  }
}
\`\`\`

---

### Refresh Token Flow

\`\`\`
1. User logs in → server returns:
   - accessToken (15min) in response body (stored in memory)
   - refreshToken (7d) in HttpOnly cookie

2. Each API request:
   Authorization: Bearer <accessToken>

3. When accessToken expires (401):
   POST /auth/refresh
   Cookie: refreshToken=... (sent automatically)
   → Server verifies refreshToken (DB check + signature)
   → Returns new accessToken

4. Logout:
   POST /auth/logout
   → Server deletes refreshToken from DB
   → Clear cookie
\`\`\`

---

### Password Hashing

\`\`\`js
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12  // cost factor — higher = slower = more secure

// Registration
async function register(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  await db.users.create({ email, password: hashedPassword })
  // NEVER store the original password
}

// Login
async function login(email, password) {
  const user = await db.users.findOne({ email })
  if (!user) {
    // Timing attack prevention: still compare even if user not found
    await bcrypt.compare(password, '$2b$12$invalidhash12345678901u')
    throw new Error('Invalid credentials')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Invalid credentials')
  return generateTokens(user.id, user.role)
}
\`\`\`

**Why bcrypt is slow:** The cost factor (12) means 4096 iterations of a key derivation function. Hashing takes ~200ms — too slow for brute force, unnoticeable to legitimate users.

---

### SQL Injection — Never Concatenate User Input

\`\`\`js
// DANGEROUS: attacker input: "1 OR 1=1"
const id = req.params.id
const query = \`SELECT * FROM users WHERE id = \${id}\`
// Becomes: SELECT * FROM users WHERE id = 1 OR 1=1
// Returns ALL users

// SAFE: parameterized query
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [req.params.id]    // $1 is a placeholder — never concatenated
)

// SAFE: Prisma (always parameterized)
const user = await prisma.user.findUnique({ where: { id: userId } })

// If you need dynamic column names (rare):
const ALLOWED_COLUMNS = ['name', 'email', 'created_at']
if (!ALLOWED_COLUMNS.includes(column)) throw new Error('Invalid column')
await pool.query(\`SELECT * FROM users ORDER BY \${column}\`, [])
// Whitelist, don't sanitize user input for SQL structure
\`\`\`

---

### OAuth 2.0 Authorization Code Flow

\`\`\`
1. User clicks "Login with Google"
2. Your app redirects to Google:
   https://accounts.google.com/o/oauth2/auth
   ?client_id=YOUR_CLIENT_ID
   &redirect_uri=https://yourapp.com/callback
   &response_type=code
   &scope=email+profile
   &state=random_csrf_token

3. User authenticates with Google, approves scopes

4. Google redirects to your callback:
   https://yourapp.com/callback?code=AUTH_CODE&state=...

5. Your server exchanges code for tokens (server-to-server):
   POST https://oauth2.googleapis.com/token
   { code, client_id, client_secret, redirect_uri, grant_type: 'authorization_code' }
   → { access_token, refresh_token, id_token }

6. Use access_token to fetch user info from Google
   Store user in your database, create your own session
\`\`\`

**Why the code exchange happens server-side:** client_secret never leaves your server. The auth code is short-lived (minutes). This prevents token interception.
`,
    quiz: [
      { q: 'Why should access tokens be short-lived (15 minutes) while refresh tokens are long-lived (7 days)?', options: ['Shorter tokens are smaller', 'If an access token is stolen, it expires quickly; refresh tokens can be revoked via database', 'JWTs can only be 15 minutes long', 'Long tokens cause performance issues'], correct: 1, explanation: 'JWTs are stateless — you can\'t invalidate them. A stolen 30-day access token gives attacker access for 30 days. Short access tokens limit the damage window. Refresh tokens are stored in DB so they can be explicitly revoked (logout, suspicious activity).' },
      { q: 'In bcrypt, what is the "cost factor"?', options: ['The length of the resulting hash', 'The number of iterations that make brute force expensive', 'The salt length in bytes', 'The algorithm version'], correct: 1, explanation: 'Cost factor 12 = 2^12 = 4096 iterations of the key derivation. Doubling the cost factor doubles the time. A modern GPU can try billions of MD5 hashes/sec but only thousands of bcrypt hashes — brute force is infeasible.' },
      { q: 'Why use parameterized queries instead of sanitizing user input for SQL?', options: ['Parameterized queries are faster', 'Sanitization is complex and error-prone; parameterized queries prevent injection by design', 'Sanitization doesn\'t work', 'Parameterized queries support more data types'], correct: 1, explanation: 'Sanitization requires knowing every possible attack vector — new bypass techniques are discovered regularly. Parameterized queries separate SQL structure from data. The DB treats $1 as a value, never as SQL syntax. Injection is impossible by design.' },
      { q: 'In OAuth 2.0 Authorization Code flow, why is the token exchange done server-to-server?', options: ['It\'s faster', 'client_secret stays on the server and never reaches the browser', 'The browser can\'t make POST requests', 'Google requires server-to-server'], correct: 1, explanation: 'The auth code returned to the browser is short-lived and harmless alone. Exchanging it for tokens requires client_secret, which must never be in client-side code (it would be visible in the browser). Server-to-server exchange keeps the secret safe.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a middleware function that verifies a JWT Bearer token from the Authorization header. It should: extract the token, verify the signature using a secret, attach the decoded payload to the request object, and call next() or return a 401 error. Simulate with a test token.',
      starterCode: `// Simple JWT implementation (no library — shows you understand it)
// In production: use jsonwebtoken library

// Base64url encode/decode utilities
function base64urlEncode(str) {
  return btoa(str).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '')
}

function base64urlDecode(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

// Simple HMAC-SHA256 (browser SubtleCrypto — async)
async function sign(data, secret) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return base64urlEncode(String.fromCharCode(...new Uint8Array(sig)))
}

async function createToken(payload, secret) {
  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body   = base64urlEncode(JSON.stringify({ ...payload, exp: Date.now() + 60000 }))
  const sig    = await sign(header + '.' + body, secret)
  return header + '.' + body + '.' + sig
}

async function verifyToken(token, secret) {
  // TODO: split token into [header, payload, signature]
  // TODO: re-sign header.payload with secret
  // TODO: compare signatures (timing-safe would use crypto.timingSafeEqual in Node)
  // TODO: check exp claim hasn't passed
  // TODO: return decoded payload or throw
}

// Mock middleware
async function authMiddleware(req, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    return { status: 401, body: { error: 'Missing token' } }
  }
  const token = authHeader.slice(7)
  try {
    req.user = await verifyToken(token, 'my-secret-key')
    return next(req)
  } catch (e) {
    return { status: 401, body: { error: e.message } }
  }
}

// Test
;(async () => {
  const token = await createToken({ userId: 42, role: 'admin' }, 'my-secret-key')
  console.log('Token:', token.slice(0, 50) + '...')
  const req = { headers: { authorization: 'Bearer ' + token } }
  const res = await authMiddleware(req, (r) => ({ status: 200, body: { user: r.user } }))
  console.log('Result:', res)
})()`,
      hints: ['const [header, payload, sig] = token.split(".")', 'const expected = await sign(header + "." + payload, secret)', 'JSON.parse(base64urlDecode(payload)) for the claims'],
    },
  },
  {
    id: 'cc-interview-be-m04', track: 'crash', title: 'Node.js Deep Dive',
    subtitle: 'The event loop, streams, worker threads, clustering, memory leaks, and production Node.js patterns.',
    moduleObjective: 'Explain the Node.js event loop phases, implement a streaming file processor, identify and fix a memory leak, and describe when to use worker threads vs clustering.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'Masters', xp: 210, duration: 15, module: 4, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'Event Loop Phases', definition: 'timers → pending callbacks → idle → poll (I/O) → check (setImmediate) → close callbacks. Promise microtasks run between each phase.' },
      { term: 'Streams', definition: 'Process data in chunks rather than loading it all into memory. Readable, Writable, Transform. Pipe them: fs.createReadStream().pipe(transform).pipe(writeStream).' },
      { term: 'Worker Threads', definition: 'True parallel execution in Node.js (Node 10.5+). Share memory via SharedArrayBuffer. Use for CPU-intensive tasks (image processing, crypto, ML inference).' },
      { term: 'Clustering', definition: 'Fork N worker processes (usually number of CPU cores). Each handles its own event loop. Master distributes connections. Use cluster module or PM2.' },
      { term: 'Memory Leak', definition: 'Memory that is allocated but never freed. In Node.js: growing Maps/Sets, retained closures, event listener accumulation, timers not cleared.' },
      { term: 'Backpressure', definition: 'When a writable stream is slower than a readable stream. handle via writable.write() return false + drain event. pipe() handles this automatically.' },
      { term: 'libuv', definition: 'C library underlying Node.js. Provides the event loop, async I/O, thread pool (for fs, crypto, DNS). The thread pool default size is 4.' },
    ],
    content: `## Node.js Deep Dive

### The Event Loop — All 6 Phases

\`\`\`
┌──────────────────────────────────────────────┐
│           Node.js Event Loop                 │
│                                              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ timers  │→ │ pending  │→ │   idle    │  │
│  │setTimeout│  │callbacks │  │  prepare  │  │
│  │setInterval  └──────────┘  └───────────┘  │
│  └────┬────┘                                 │
│       ↓                                      │
│  ┌──────────┐  ← MOST I/O CALLBACKS HERE    │
│  │  poll    │  (incoming connections, data)  │
│  └────┬─────┘                                │
│       ↓                                      │
│  ┌──────────┐  setImmediate callbacks        │
│  │  check   │                                │
│  └────┬─────┘                                │
│       ↓                                      │
│  ┌──────────┐  socket.on('close', ...)       │
│  │  close   │                                │
│  └──────────┘                                │
│                                              │
│  Between EACH phase: process.nextTick()      │
│                      Promise microtasks      │
└──────────────────────────────────────────────┘
\`\`\`

\`\`\`js
// Execution order demonstration
console.log('1 sync')

setTimeout(() => console.log('5 setTimeout'), 0)   // timers phase
setImmediate(() => console.log('4 setImmediate'))  // check phase

Promise.resolve().then(() => console.log('3 Promise.then'))  // microtask

process.nextTick(() => console.log('2 nextTick'))  // runs before ALL phases

console.log('1 sync end')
// Output: 1, 1 end, 2, 3, 4, 5
// nextTick before Promise.then before setImmediate before setTimeout
\`\`\`

---

### Streams — Processing Large Files

\`\`\`js
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import { pipeline } from 'stream/promises'

// Transform stream: convert CSV lines to JSON
class CSVToJSON extends Transform {
  constructor() {
    super({ objectMode: true })
    this.headers = null
    this.buffer = ''
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString()
    const lines = this.buffer.split('\\n')
    this.buffer = lines.pop()  // keep incomplete line in buffer

    for (const line of lines) {
      if (!this.headers) {
        this.headers = line.split(',')
        continue
      }
      const values = line.split(',')
      const obj = Object.fromEntries(this.headers.map((h, i) => [h, values[i]]))
      this.push(JSON.stringify(obj) + '\\n')
    }
    callback()
  }

  _flush(callback) {
    if (this.buffer) {
      const values = this.buffer.split(',')
      const obj = Object.fromEntries(this.headers.map((h, i) => [h, values[i]]))
      this.push(JSON.stringify(obj) + '\\n')
    }
    callback()
  }
}

// Process a 10GB CSV without loading it all into memory
await pipeline(
  createReadStream('huge.csv'),
  new CSVToJSON(),
  createWriteStream('output.json')
)
console.log('Done — processed without memory issues')
\`\`\`

---

### Memory Leaks — How They Happen and How to Fix Them

\`\`\`js
// LEAK 1: Growing Map with no eviction
const cache = new Map()
app.get('/user/:id', async (req, res) => {
  const { id } = req.params
  if (!cache.has(id)) {
    cache.set(id, await fetchUser(id))  // cache grows forever
  }
  res.json(cache.get(id))
})
// Fix: use LRU cache with max size, or Redis, or TTL

// LEAK 2: Event listener accumulation
function setupServer() {
  const server = new EventEmitter()
  setInterval(() => {
    server.on('data', handler)  // adds a new listener every second!
  }, 1000)
}
// Fix: removeListener when done, or use once() for one-time handlers

// LEAK 3: Closure holding large objects
function processData() {
  const largeBuffer = Buffer.alloc(100_000_000)  // 100MB
  return function() {
    // This closure keeps largeBuffer alive even after processData returns
    console.log(largeBuffer.length)  // only uses length, not the data
  }
}
// Fix: capture only what's needed
function processDataFixed() {
  const len = Buffer.alloc(100_000_000).length  // buffer can be GC'd
  return function() { console.log(len) }
}

// Detect leaks: node --inspect → Chrome DevTools Memory tab
// Or: heapdump npm package to take heap snapshots
\`\`\`

---

### Worker Threads vs Clustering

\`\`\`js
// CPU-intensive work — worker thread
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'

if (isMainThread) {
  // Main thread: spawn worker for CPU work
  const worker = new Worker(__filename, {
    workerData: { numbers: Array.from({ length: 1_000_000 }, (_, i) => i) }
  })
  worker.on('message', result => console.log('Sum:', result))
} else {
  // Worker thread: compute
  const sum = workerData.numbers.reduce((a, b) => a + b, 0)
  parentPort.postMessage(sum)
}

// Many requests, I/O-bound — clustering
import cluster from 'cluster'
import { cpus } from 'os'

if (cluster.isPrimary) {
  const numCPUs = cpus().length
  for (let i = 0; i < numCPUs; i++) cluster.fork()
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died, restarting...\`)
    cluster.fork()
  })
} else {
  // Each worker is a full Express server
  app.listen(3000)
}
// PM2 handles this automatically: pm2 start app.js -i max
\`\`\`
`,
    quiz: [
      { q: 'In Node.js event loop order, which runs first: process.nextTick() or Promise.then()?', options: ['Promise.then()', 'process.nextTick()', 'They run in the order they were called', 'Depends on the phase'], correct: 1, explanation: 'process.nextTick() runs before Promise.then() — it has its own queue that runs before the microtask queue. Both run between event loop phases, but nextTick queue is drained first.' },
      { q: 'What is the main advantage of using Node.js streams for large files?', options: ['Streams are faster per chunk', 'Streams process data chunk by chunk without loading the entire file into memory', 'Streams support more file formats', 'Streams use multiple CPU cores'], correct: 1, explanation: 'Without streams, reading a 10GB file into memory would require 10GB RAM. Streams process fixed-size chunks, keeping memory usage constant regardless of file size. Critical for log processing, ETL, file uploads.' },
      { q: 'When should you use Worker Threads vs Clustering in Node.js?', options: ['Worker Threads for I/O-bound, Clustering for CPU-bound', 'Worker Threads for CPU-bound tasks (image processing, crypto), Clustering for I/O-bound request handling', 'Both are the same', 'Clustering for all production use'], correct: 1, explanation: 'Clustering forks entire processes — each handles its own event loop and I/O requests (horizontal scaling). Worker Threads share memory and are for running CPU-intensive code without blocking the main event loop.' },
      { q: 'What is the most common cause of memory leaks in Node.js applications?', options: ['Using async/await', 'Growing data structures (Map/Set, Arrays) with no eviction, accumulated event listeners, closures holding large objects', 'Too many Promise chains', 'Using setTimeout'], correct: 1, explanation: 'Node.js garbage collects unreachable objects. Leaks happen when objects are still reachable (referenced) but no longer needed: unbounded caches, event listeners added in loops, closures capturing large buffers unnecessarily.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a simple task queue with concurrency control. The queue accepts async tasks and runs them with a maximum concurrency of N (e.g., 3 at once). If N tasks are already running, new tasks wait. When a running task completes, the next waiting task starts. This simulates controlling parallel DB connections or API calls.',
      starterCode: `function createTaskQueue(concurrency = 3) {
  let running = 0
  const queue = []

  function run() {
    while (running < concurrency && queue.length > 0) {
      const { task, resolve, reject } = queue.shift()
      running++
      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          running--
          run()  // try to start next task
        })
    }
  }

  return function enqueue(task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject })
      run()
    })
  }
}

// Test: 6 tasks, concurrency 2 — at most 2 run simultaneously
const queue = createTaskQueue(2)

function makeTask(id, duration) {
  return () => new Promise(resolve => {
    console.log(\`Task \${id} started\`)
    setTimeout(() => {
      console.log(\`Task \${id} completed after \${duration}ms\`)
      resolve(id)
    }, duration)
  })
}

Promise.all([
  queue(makeTask(1, 300)),
  queue(makeTask(2, 200)),
  queue(makeTask(3, 400)),
  queue(makeTask(4, 100)),
  queue(makeTask(5, 250)),
  queue(makeTask(6, 150)),
]).then(results => console.log('All done:', results))`,
      hints: ['The run() function checks running < concurrency before starting tasks', 'Each task calls run() in .finally() to fill the slot it just freed', 'Store { task, resolve, reject } in the queue to fulfill the outer Promise'],
    },
  },
  {
    id: 'cc-interview-be-m05', track: 'crash', title: 'System Design for Backend Interviews',
    subtitle: 'Design a URL shortener, rate limiter, chat system, or job queue — the exact backend system design questions at senior interviews.',
    moduleObjective: 'Walk through a backend system design interview from requirements to components to scale considerations, and explain CAP theorem, caching strategies, and message queues.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'PhD', xp: 250, duration: 18, module: 5, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'CAP Theorem', definition: 'A distributed system can guarantee only 2 of 3: Consistency (every read sees latest write), Availability (every request gets a response), Partition Tolerance (works despite network splits). Most systems choose CP or AP.' },
      { term: 'Cache-Aside Pattern', definition: 'Application checks cache first; on miss, fetches from DB and writes to cache. Cache doesn\'t know about DB. App controls what gets cached. Most common pattern.' },
      { term: 'Message Queue', definition: 'Decouples producers from consumers. RabbitMQ, Kafka, AWS SQS. Producers publish messages; consumers process at their own pace. Enables async processing and retry.' },
      { term: 'Sharding', definition: 'Horizontal partitioning of a database. Users A-M on shard 1, N-Z on shard 2. Scales write capacity. Complicates cross-shard queries and transactions.' },
      { term: 'Read Replica', definition: 'A copy of the primary DB that serves read queries. Scales read throughput. Eventual consistency — may be slightly behind primary. Send read-heavy queries here.' },
      { term: 'Circuit Breaker', definition: 'Pattern that stops calling a failing service, returns fallback immediately, and retries after a timeout. Prevents cascade failures. Three states: Closed, Open, Half-Open.' },
      { term: 'Eventual Consistency', definition: 'In distributed systems, all replicas will converge to the same value given enough time and no new updates. Acceptable for likes/views counts, not for bank balances.' },
    ],
    content: `## System Design for Backend Interviews

### The Framework — Use This Every Time

1. **Clarify requirements (5 min):**
   - Scale: users/day, requests/sec, data volume?
   - Features: what are the core requirements?
   - SLA: 99.9% uptime? Read-heavy or write-heavy?

2. **High-level design (10 min):**
   - Draw the main components: Client → CDN → Load Balancer → API → DB

3. **Deep dive (15 min):**
   - Pick 2-3 interesting components and go deep
   - Data model, API design, scaling decisions

4. **Scale discussion (10 min):**
   - Bottlenecks? Caching strategy? DB sharding?
   - CAP theorem trade-offs?

---

### Design: URL Shortener (bit.ly)

**Requirements:** shorten URLs, redirect 301/302, analytics (click count), 10B URLs, 10K reads/sec

\`\`\`
Architecture:
  Browser → CDN (cache hot links) → Load Balancer → API Servers → Redis (hot URLs)
                                                                 ↘ PostgreSQL (all URLs)
                                                                 → Analytics service (async)
\`\`\`

**Key design decisions:**

1. **Generating the short code:**
\`\`\`js
// Option A: MD5 hash, take first 7 chars (collision risk: handle with retry)
const code = crypto.createHash('md5').update(longUrl).digest('base64').slice(0, 7)

// Option B: Base62 encoding of auto-increment ID
function toBase62(n) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  while (n > 0) {
    result = chars[n % 62] + result
    n = Math.floor(n / 62)
  }
  return result
}
// ID 1,000,000 → '4c92' (4 chars) — 62^7 = 3.5T unique codes
\`\`\`

2. **Database schema:**
\`\`\`sql
CREATE TABLE urls (
  id         BIGSERIAL PRIMARY KEY,
  code       CHAR(7) UNIQUE NOT NULL,
  long_url   TEXT NOT NULL,
  user_id    BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_urls_code ON urls(code);  -- lookup by code
\`\`\`

3. **Caching:**
\`\`\`js
async function redirect(code) {
  // 1. Check Redis (hot cache)
  let longUrl = await redis.get(\`url:\${code}\`)
  if (longUrl) return { url: longUrl, source: 'cache' }

  // 2. Miss — query DB
  const row = await db.query('SELECT long_url FROM urls WHERE code = $1', [code])
  if (!row) throw new Error('Not found')

  // 3. Write to cache (TTL: 1 day)
  await redis.setex(\`url:\${code}\`, 86400, row.long_url)
  return { url: row.long_url, source: 'db' }
}
\`\`\`

---

### Design: Rate Limiter

\`\`\`
Token Bucket in Redis:

Script (atomic Lua to prevent race conditions):
\`\`\`

\`\`\`lua
-- Redis Lua script: atomic check-and-decrement
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

-- Refill tokens based on elapsed time
local elapsed = now - last_refill
tokens = math.min(capacity, tokens + elapsed * refill_rate)

if tokens >= 1 then
  tokens = tokens - 1
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
  return 1  -- allowed
else
  return 0  -- rate limited
end
\`\`\`

---

### Caching Strategies

\`\`\`
Cache-Aside (Lazy):
  Read: check cache → miss → fetch DB → write cache → return
  Write: update DB → invalidate cache (or update cache)
  Use: most common, works for any workload

Write-Through:
  Write: update DB + cache simultaneously
  Read: always from cache (warm)
  Use: when read:write ratio is high

Write-Behind (Write-Back):
  Write: update cache immediately, write DB asynchronously
  Use: high write throughput, acceptable risk of data loss

Read-Through:
  Application calls cache as if it's the DB
  Cache fetches from DB on miss (cache handles it)
  Use: when you want to abstract the cache layer
\`\`\`

---

### Message Queue — When and Why

\`\`\`
Without queue:
  POST /orders → creates order → sends email (sync, 500ms) → returns

With queue:
  POST /orders → creates order → publishes OrderCreated event → returns 201
  EmailWorker → consumes OrderCreated → sends email (async)
  ReportWorker → consumes OrderCreated → updates analytics

Benefits:
  - API is fast (no waiting for email)
  - If email service is down, message stays in queue, retried later
  - Workers scale independently
  - Natural retry with backoff on failure
\`\`\`
`,
    quiz: [
      { q: 'In CAP theorem, what do most database systems sacrifice?', options: ['Consistency', 'Availability', 'Partition tolerance — because network splits always happen', 'None — all three are achievable'], correct: 2, explanation: 'Network partitions are a physical reality — they WILL happen. So systems choose between CP (consistent but may reject requests during partition) or AP (always responds but may return stale data). Partition Tolerance is non-optional.' },
      { q: 'What is cache invalidation and why is it considered hard?', options: ['The process of clearing unused cache entries', 'Ensuring cached data is removed or updated when the source data changes — determining when and what to invalidate requires knowing all relationships', 'A Redis configuration setting', 'Cache eviction based on memory pressure'], correct: 1, explanation: '"There are only two hard things in computer science: cache invalidation and naming things." You need to know: which cache keys are affected by a DB update? When a user updates their profile, do you invalidate by userId? By all their posts? Determining the blast radius is hard.' },
      { q: 'Why use Base62 encoding of an auto-increment ID for URL shortening instead of random codes?', options: ['Random codes cause hash collisions', 'Base62 IDs are guaranteed unique without collision checking', 'Base62 is more readable', 'Random codes are slower to generate'], correct: 1, explanation: 'Auto-increment IDs are globally unique by definition. Base62 encoding (a-z, A-Z, 0-9) produces 7-character codes for IDs up to 62^7 = 3.5 trillion. No collision, no retry needed. Predictable short codes for sequential IDs is a tradeoff (security).' },
      { q: 'When would you choose a message queue over a direct synchronous API call?', options: ['When latency is critical', 'When the consumer can be slower than the producer, when retry logic is needed, or when multiple consumers need the same event', 'When you need a guaranteed response', 'When the operation must complete before the request returns'], correct: 1, explanation: 'Message queues decouple producers and consumers. They enable: independent scaling, retry with backoff on failure, fan-out (multiple consumers), and buffering bursts. Use when you don\'t need an immediate response and can process asynchronously.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a Base62 URL shortener: toBase62(n) converts a number to a base-62 string, fromBase62(s) converts back. Then build a simple in-memory URL store: shorten(url) stores the URL and returns a short code, resolve(code) returns the original URL. Verify with 5 URLs.',
      starterCode: `const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function toBase62(n) {
  // TODO: convert number to base-62 string
  // e.g. toBase62(1) → '1', toBase62(62) → 'A0'
}

function fromBase62(s) {
  // TODO: convert base-62 string back to number
}

// Simple URL store
let counter = 100000  // start at 100000 for 5-char codes
const store = new Map()  // code → url

function shorten(url) {
  const id = counter++
  const code = toBase62(id)
  store.set(code, url)
  return \`https://sht.ly/\${code}\`
}

function resolve(code) {
  return store.get(code) || null
}

// Test
const urls = [
  'https://academy.jsupremeconglomerate.online/crash-courses',
  'https://github.com/Jordan-sketch-hue/JS-ACADEMY',
  'https://nextjs.org/docs',
  'https://supabase.com/docs',
  'https://tailwindcss.com',
]

urls.forEach(url => {
  const short = shorten(url)
  const code = short.split('/').pop()
  const resolved = resolve(code)
  console.log(\`\${url.slice(0, 40)}... → \${short} → \${resolved === url ? '✓' : '✗'}\`)
})

// Verify round-trip
console.log('toBase62(62):', toBase62(62))     // 'A0'
console.log('fromBase62("A0"):', fromBase62('A0'))  // 62`,
      hints: ['toBase62: while n > 0, result = CHARS[n % 62] + result, n = floor(n/62)', 'fromBase62: for each char, result = result * 62 + CHARS.indexOf(char)', 'Handle n === 0 case in toBase62: return "0"'],
    },
  },
  {
    id: 'cc-interview-be-m06', track: 'crash', title: 'Data Structures & Algorithms for Backend',
    subtitle: 'The DSA questions that backend interviews actually ask — hash maps, trees, graphs, and when O(n) matters in production.',
    moduleObjective: 'Solve the most common backend interview DSA problems: hash maps for O(1) lookup, BFS/DFS for graphs, binary search for sorted data, and recognize when DSA matters vs when it doesn\'t.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'PhD', xp: 240, duration: 16, module: 6, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'Time Complexity', definition: 'How runtime grows with input size. O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) quasilinear, O(n²) quadratic. Dominant term matters.' },
      { term: 'Two Pointers', definition: 'Use two indices on a sorted array, moving toward each other or in the same direction. Solves sum pairs, palindrome check, container with most water in O(n).' },
      { term: 'Sliding Window', definition: 'Maintain a window of fixed or variable size over an array/string. Expand right, shrink left when condition fails. Solves substring/subarray problems in O(n).' },
      { term: 'BFS vs DFS', definition: 'BFS: level-by-level using a queue. Finds shortest path. DFS: depth-first using a stack/recursion. Finds paths, detects cycles, topological sort.' },
      { term: 'Dynamic Programming', definition: 'Break problems into overlapping subproblems, cache results (memoization) or build bottom-up. Solves optimization problems: knapsack, LCS, coin change.' },
      { term: 'Heap / Priority Queue', definition: 'Tree-based structure where parent is always min (min-heap) or max (max-heap). Efficient: O(log n) insert/extract-min. Used for: top-K, Dijkstra, task scheduling.' },
      { term: 'Trie', definition: 'Prefix tree. Each node is a character. Efficient prefix search for autocomplete: O(m) lookup where m is string length. Alternative to hash map for prefix queries.' },
    ],
    content: `## Data Structures & Algorithms for Backend

### When DSA Matters in Backend Work

**Real production contexts:**
- **Search/autocomplete**: Trie for prefix matching
- **Rate limiter**: Sliding window counter
- **Task scheduler**: Priority queue (heap)
- **Dependency resolution**: Topological sort (DFS)
- **Social graph**: BFS for shortest path (degrees of separation)
- **Database query planner**: Graph algorithms internally

**When it doesn't:** Most CRUD APIs → just use correct indexes and avoid N+1.

---

### Two Pointers — Most Versatile Pattern

\`\`\`js
// Find two numbers that sum to target (sorted array)
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1
  while (left < right) {
    const sum = nums[left] + nums[right]
    if (sum === target) return [nums[left], nums[right]]
    else if (sum < target) left++
    else right--
  }
  return null
}
// O(n) time, O(1) space — vs O(n) hash map approach (both valid)

// Check if string is palindrome
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  let l = 0, r = s.length - 1
  while (l < r) {
    if (s[l] !== s[r]) return false
    l++; r--
  }
  return true
}
\`\`\`

---

### Sliding Window — Subarray/Substring Problems

\`\`\`js
// Maximum sum subarray of size k
function maxSumSubarray(nums, k) {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0)
  let maxSum = windowSum

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]  // slide: add new, remove old
    maxSum = Math.max(maxSum, windowSum)
  }
  return maxSum
}

// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
  const seen = new Map()  // char → last index
  let maxLen = 0, left = 0

  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1  // shrink window
    }
    seen.set(s[right], right)
    maxLen = Math.max(maxLen, right - left + 1)
  }
  return maxLen
}
// "abcabcbb" → 3 ("abc")
\`\`\`

---

### BFS — Shortest Path, Level-by-Level

\`\`\`js
// Shortest path in an unweighted graph
function shortestPath(graph, start, end) {
  const queue = [[start, [start]]]  // [node, path]
  const visited = new Set([start])

  while (queue.length) {
    const [node, path] = queue.shift()

    if (node === end) return path

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([neighbor, [...path, neighbor]])
      }
    }
  }
  return null  // no path
}

const graph = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D', 'E'],
  D: ['F'],
  E: ['F'],
  F: [],
}
console.log(shortestPath(graph, 'A', 'F'))  // ['A', 'C', 'E', 'F'] (or A→B→D→F)
\`\`\`

---

### Min Heap — Top-K Elements

\`\`\`js
// Find top K most frequent elements
function topKFrequent(nums, k) {
  const freq = new Map()
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1)

  // Sort by frequency (in production, use a min-heap for better complexity)
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num)
}
// topKFrequent([1,1,1,2,2,3], 2) → [1, 2]
// O(n log n) with sort — O(n log k) with min-heap

// Merge K sorted arrays (heap approach)
function mergeKSorted(arrays) {
  // Simple O(n log k) with a min-heap
  // Using sort here for clarity:
  return arrays.flat().sort((a, b) => a - b)
  // Production: use a proper heap (ds.heap npm, or implement)
}
\`\`\`

---

### Topological Sort — Dependency Resolution

\`\`\`js
// Build order: which packages to install first given dependencies
function topologicalSort(graph) {
  const visited = new Set()
  const stack = []

  function dfs(node) {
    visited.add(node)
    for (const dep of graph[node] || []) {
      if (!visited.has(dep)) dfs(dep)
    }
    stack.push(node)  // push after all dependencies processed
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) dfs(node)
  }

  return stack.reverse()  // reverse to get dependency order
}

const dependencies = {
  'app':    ['react', 'axios'],
  'react':  ['react-dom'],
  'axios':  [],
  'react-dom': [],
}
console.log(topologicalSort(dependencies))
// ['react-dom', 'react', 'axios', 'app'] — correct install order
\`\`\`
`,
    quiz: [
      { q: 'What makes the sliding window technique O(n) instead of O(n²)?', options: ['It uses two arrays', 'The window moves forward — each element is added once and removed once, regardless of window size changes', 'It uses binary search', 'It only processes sorted data'], correct: 1, explanation: 'A naive double loop recalculates the window from scratch each time: O(n*k). Sliding window maintains a running sum/set, adding the new element and removing the old one — O(1) per step, O(n) total.' },
      { q: 'Why is BFS preferred over DFS for finding the shortest path?', options: ['BFS is always faster', 'BFS explores level by level — the first time it reaches the destination, it\'s guaranteed to be the shortest path', 'DFS can\'t find paths', 'BFS uses less memory'], correct: 1, explanation: 'DFS may find a path but not the shortest one — it goes deep first. BFS radiates outward level by level. The first time BFS reaches the destination, it has traversed the minimum number of edges.' },
      { q: 'When would you use a Trie over a hash map?', options: ['When values are numbers', 'When you need prefix matching or autocomplete — hash maps don\'t support prefix queries efficiently', 'When storage is limited', 'When keys are long'], correct: 1, explanation: 'HashMap gives O(1) exact key lookup. Trie gives O(m) exact lookup AND O(m + matches) prefix search. For autocomplete ("find all words starting with \'app\'"), Trie is the correct data structure.' },
      { q: 'What is the time complexity of topological sort?', options: ['O(n²)', 'O(n log n)', 'O(V + E) — proportional to vertices plus edges', 'O(V²)'], correct: 2, explanation: 'Topological sort visits each vertex once and traverses each edge once. Time = O(V + E) where V = vertices and E = edges. Same as BFS/DFS. The output is a linear ordering of vertices respecting dependency order.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a function to find the longest increasing subsequence (LIS) — a classic DP problem. Given [3, 1, 8, 2, 5], find the length of the longest subsequence where each element is greater than the previous (not necessarily contiguous). E.g., [1, 2, 5] has length 3.',
      starterCode: `function longestIncreasingSubsequence(nums) {
  if (!nums.length) return 0

  // dp[i] = length of LIS ending at index i
  const dp = new Array(nums.length).fill(1)
  // Every element alone is a LIS of length 1

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        // nums[i] can extend the LIS ending at j
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }

  return Math.max(...dp)
}

// Test cases
console.log(longestIncreasingSubsequence([3, 1, 8, 2, 5]))  // 3 → [1, 2, 5]
console.log(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18]))  // 4 → [2, 3, 7, 101]
console.log(longestIncreasingSubsequence([0, 1, 0, 3, 2, 3]))  // 4 → [0, 1, 2, 3]
console.log(longestIncreasingSubsequence([7, 7, 7, 7]))  // 1 → no increasing sequence

// BONUS: Can you optimize to O(n log n) using binary search + patience sorting?
// Hint: maintain a 'tails' array where tails[i] = smallest tail of IS of length i+1`,
      hints: ['dp[i] starts at 1 (just the element itself)', 'For each j < i where nums[j] < nums[i]: dp[i] = max(dp[i], dp[j] + 1)', 'Answer is max(dp) — the longest LIS ending at any position'],
    },
  },
  {
    id: 'cc-interview-be-m07', track: 'crash', title: 'Docker, CI/CD & Production Deployment',
    subtitle: 'Containerize a Node.js app, write a multi-stage Dockerfile, set up a GitHub Actions pipeline, and deploy to production without downtime.',
    moduleObjective: 'Write a production-ready Dockerfile, configure environment variables securely, set up CI/CD with GitHub Actions, and explain rolling deployments and health checks.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'PhD', xp: 230, duration: 16, module: 7, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'Multi-Stage Build', definition: 'Dockerfile with multiple FROM stages. Build stage installs dev deps and compiles. Final stage copies only the artifacts — much smaller image (500MB → 80MB).' },
      { term: 'Environment Variables', definition: 'Never hardcode secrets in code or Dockerfile. Use: .env locally (in .gitignore), Docker --env-file, K8s Secrets, Vercel/Railway env vars in production.' },
      { term: 'Health Check', definition: 'Container (or load balancer) polls /health endpoint. If unhealthy, container is restarted. Prevents sending traffic to a crashed or starting-up service.' },
      { term: 'Rolling Deployment', definition: 'Gradually replace old containers with new ones. Zero downtime. If new version fails health checks, rollback automatically. Blue-green is an alternative.' },
      { term: 'GitHub Actions', definition: 'CI/CD via YAML workflows in .github/workflows/. Triggers: push, pull_request, schedule. Jobs run on Ubuntu runners. Reuse with composite actions.' },
      { term: '.dockerignore', definition: 'Like .gitignore but for Docker COPY. Exclude node_modules, .git, .env, test files. Reduces build context sent to daemon and prevents leaking secrets.' },
      { term: 'WORKDIR', definition: 'Sets working directory inside the container. All subsequent RUN, COPY, CMD use this path. Use /app by convention.' },
    ],
    content: `## Docker, CI/CD & Production Deployment

### Production-Ready Dockerfile

\`\`\`dockerfile
# Stage 1: Build (has dev dependencies)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files first (layer caching — only reinstalls when package.json changes)
COPY package*.json ./
RUN npm ci --only=production  # ci = faster, exact lock file, no optional

# Copy source
COPY . .
RUN npm run build  # if you have a build step (TypeScript, etc.)

# Stage 2: Production image (minimal)
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user (security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget -qO- http://localhost:3000/health || exit 1

USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

\`\`\`
# .dockerignore
node_modules
.git
.env
*.log
dist
coverage
.DS_Store
\`\`\`

---

### Environment Variables — The Correct Pattern

\`\`\`
Layer 1: Code (no hardcoded values)
  const DB_URL = process.env.DATABASE_URL  ✓
  const DB_URL = 'postgres://...'           ✗

Layer 2: Local dev (.env — NEVER commit)
  DATABASE_URL=postgres://localhost:5432/myapp
  JWT_SECRET=dev-secret-change-in-prod

Layer 3: Docker (inject at runtime, not build time)
  docker run --env-file .env.production myapp
  docker run -e DATABASE_URL=$DATABASE_URL myapp

Layer 4: Production (platform env vars)
  Vercel: Settings → Environment Variables
  Railway: Variables tab
  K8s: kubectl create secret generic app-secrets --from-env-file=.env.prod
\`\`\`

**Why not ARG in Dockerfile for secrets?**
ARG values are baked into image layers — visible in \`docker history\`. Use runtime ENV only.

---

### GitHub Actions CI/CD Pipeline

\`\`\`yaml
# .github/workflows/deploy.yml
name: Test and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: testdb
          POSTGRES_PASSWORD: testpass
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgres://postgres:testpass@localhost:5432/testdb

      - name: TypeScript check
        run: npx tsc --noEmit

  deploy:
    needs: test      # only deploy if tests pass
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # only on main branch

    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t myapp:\${{ github.sha }} .

      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}
\`\`\`

---

### Health Check Endpoint

\`\`\`js
// Express health check
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: 'unknown',
    redis: 'unknown',
  }

  try {
    await db.query('SELECT 1')
    checks.db = 'healthy'
  } catch {
    checks.db = 'unhealthy'
  }

  try {
    await redis.ping()
    checks.redis = 'healthy'
  } catch {
    checks.redis = 'unhealthy'
  }

  const isHealthy = checks.db === 'healthy'
  res.status(isHealthy ? 200 : 503).json(checks)
})

// Kubernetes liveness vs readiness:
// /health/live  — is the process running? (if no, restart the pod)
// /health/ready — is it ready to receive traffic? (if no, remove from load balancer)
\`\`\`

---

### Zero-Downtime Deployment

\`\`\`
Rolling Deployment (Kubernetes):
  Old: [v1, v1, v1, v1]
  Step 1: [v1, v1, v1, v2]  — add one new
  Step 2: [v1, v1, v2, v2]  — replace one old
  Step 3: [v1, v2, v2, v2]
  Step 4: [v2, v2, v2, v2]  — complete
  If v2 fails health check → roll back automatically

Blue-Green Deployment:
  Blue (current) receives 100% traffic
  Green (new version) is deployed, tested
  Switch load balancer → 100% to Green
  Blue becomes standby (instant rollback)
  Requires 2x infrastructure — more expensive
\`\`\`
`,
    quiz: [
      { q: 'Why use a multi-stage Dockerfile instead of a single stage?', options: ['Multi-stage is required by Docker', 'To separate build tools from runtime — final image only has production artifacts, much smaller and more secure', 'Multi-stage builds are faster', 'To support multiple architectures'], correct: 1, explanation: 'A single-stage Node.js image with devDependencies can be 1GB+. Multi-stage: the builder stage installs everything and compiles; the final stage copies only dist/ and production node_modules. Typical result: 80MB instead of 600MB.' },
      { q: 'Why should secrets NOT be passed as ARG in a Dockerfile?', options: ['ARG has a character limit', 'ARG values are baked into image layers and visible via docker history', 'ARG only works for build-time variables', 'Docker Hub doesn\'t support ARG'], correct: 1, explanation: 'Even if you unset an ARG after using it, docker history --no-trunc shows the value in the layer that used it. Always inject secrets at container runtime via -e or --env-file, never at build time.' },
      { q: 'In a GitHub Actions workflow, what does `needs: test` do in the deploy job?', options: ['Copies test artifacts to the deploy job', 'Makes the deploy job wait for the test job to succeed before running', 'Shares environment variables between jobs', 'Runs tests in parallel with deployment'], correct: 1, explanation: '`needs` creates a dependency between jobs. `needs: test` means the deploy job only runs if the test job completed successfully. If tests fail, deployment is skipped. Essential for preventing broken code from reaching production.' },
      { q: 'What is the difference between a Kubernetes liveness probe and readiness probe?', options: ['They are the same', 'Liveness: restart if unhealthy. Readiness: remove from load balancer if not ready to serve traffic', 'Readiness restarts the pod, liveness only logs', 'Liveness is for database checks, readiness for CPU'], correct: 1, explanation: 'Liveness: "is the process alive?" — if no, kill and restart the pod. Readiness: "is the pod ready to receive traffic?" — if no, remove from Service endpoints (no traffic sent), but don\'t restart. Use readiness during startup and graceful shutdown.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a circuit breaker implementation. A circuit breaker wraps function calls and tracks failures. After a threshold of failures, it "opens" and immediately rejects calls without trying. After a timeout, it goes "half-open" and allows one test call. If that succeeds, it "closes" again. Implement with three states: CLOSED, OPEN, HALF_OPEN.',
      starterCode: `const State = { CLOSED: 'CLOSED', OPEN: 'OPEN', HALF_OPEN: 'HALF_OPEN' }

function createCircuitBreaker(fn, { failureThreshold = 3, successThreshold = 1, timeout = 5000 } = {}) {
  let state = State.CLOSED
  let failures = 0
  let successes = 0
  let nextAttempt = null

  return async function(...args) {
    if (state === State.OPEN) {
      if (Date.now() < nextAttempt) {
        throw new Error('Circuit breaker OPEN — fast fail')
      }
      // Timeout passed — try half-open
      state = State.HALF_OPEN
      successes = 0
      console.log('Circuit: OPEN → HALF_OPEN')
    }

    try {
      const result = await fn(...args)
      // TODO: on success in HALF_OPEN: increment successes
      //       if successes >= successThreshold: close the circuit
      // TODO: on success in CLOSED: reset failures
      return result
    } catch (err) {
      // TODO: increment failures
      // TODO: if failures >= failureThreshold: open the circuit, set nextAttempt
      // TODO: in HALF_OPEN: any failure → re-open
      throw err
    }
  }
}

// Test
let callCount = 0
async function unstableService() {
  callCount++
  if (callCount <= 5) throw new Error('Service unavailable')  // first 5 calls fail
  return 'success'
}

const breaker = createCircuitBreaker(unstableService, { failureThreshold: 3, timeout: 100 })

;(async () => {
  for (let i = 0; i < 8; i++) {
    try {
      const result = await breaker()
      console.log(\`Call \${i+1}: \${result}\`)
    } catch (e) {
      console.log(\`Call \${i+1}: ERROR — \${e.message}\`)
    }
    await new Promise(r => setTimeout(r, 50))  // slight delay between calls
  }
})()`,
      hints: ['On success in HALF_OPEN: if ++successes >= successThreshold, state = CLOSED', 'On failure: if ++failures >= failureThreshold, state = OPEN, nextAttempt = Date.now() + timeout', 'On any failure in HALF_OPEN: state = OPEN, reset nextAttempt'],
    },
  },
  {
    id: 'cc-interview-be-m08', track: 'crash', title: 'Full Production API — Build It From Scratch',
    subtitle: 'Build a complete multi-file REST API with auth, validation, database, tests, and deployment config — exactly what an interview take-home looks like.',
    moduleObjective: 'Plan and implement a complete Node.js/Express API from an empty folder: project structure, middleware stack, route handlers, Prisma schema, JWT auth, input validation, error handling, and test setup.',
    courseObjective: CC_BE_OBJ, crashId: 'cc-interview-backend', crashTitle: 'Backend Interview Prep',
    level: 'PhD', xp: 280, duration: 22, module: 8, certArea: 'Backend Interview Prep',
    keyTerms: [
      { term: 'Middleware Stack', definition: 'Express processes requests through a chain of functions. Order matters: body parsing → CORS → rate limit → auth → route handler → error handler.' },
      { term: 'Zod', definition: 'TypeScript-first schema validation. Define schemas, parse/validate user input, infer TypeScript types. Alternative to Joi, Yup. Works in Node.js and browser.' },
      { term: 'Prisma', definition: 'TypeScript ORM for Node.js. Schema defined in .prisma file, migrations generated, type-safe queries. Supports PostgreSQL, MySQL, SQLite, MongoDB.' },
      { term: 'Global Error Handler', definition: 'Express error handler: app.use((err, req, res, next) => {...}). Catches all errors thrown in route handlers and middleware. Single place for error formatting.' },
      { term: 'Repository Pattern', definition: 'Abstracts data access behind an interface. Controllers call repositories, not databases directly. Makes testing easier — mock the repository.' },
      { term: 'Request Validation', definition: 'Validate all incoming data at the route layer before it reaches business logic. Check types, ranges, required fields. Return 400 with field-level errors.' },
      { term: 'Integration Test', definition: 'Tests a real HTTP endpoint against a real (test) database. Verifies the full stack: validation → controller → DB → response. More confidence than unit tests alone.' },
    ],
    content: `## Full Production API — Build It From Scratch

### Project Structure

\`\`\`
my-api/
├── src/
│   ├── app.ts              ← Express app (no listen) — testable
│   ├── server.ts           ← Entry point — calls app.listen
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── product.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── product.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── repositories/
│   │   └── product.repository.ts
│   ├── schemas/
│   │   └── product.schema.ts    ← Zod schemas
│   └── lib/
│       ├── prisma.ts            ← Prisma client singleton
│       └── jwt.ts
├── prisma/
│   └── schema.prisma
├── tests/
│   └── product.test.ts
├── Dockerfile
├── docker-compose.yml           ← local dev with Postgres
└── package.json
\`\`\`

---

### The Express App (app.ts)

\`\`\`ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { authRouter } from './routes/auth.routes'
import { productRouter } from './routes/product.routes'
import { errorHandler } from './middleware/error.middleware'

const app = express()

// Security middleware — order matters
app.use(helmet())                            // sets security headers
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json({ limit: '10kb' }))     // parse JSON body, limit size

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 100,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } }
}))

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))
app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)

// 404 handler
app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND' } }))

// Global error handler — must be last
app.use(errorHandler)

export { app }
\`\`\`

---

### Zod Validation + Middleware

\`\`\`ts
// schemas/product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().default(0),
  categoryId: z.number().int().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

// middleware/validate.middleware.ts
import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          details: result.error.flatten().fieldErrors
        }
      })
    }
    req.body = result.data  // replace with parsed (typed) data
    next()
  }
}
\`\`\`

---

### Controller — Clean, Thin

\`\`\`ts
// controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express'
import { ProductRepository } from '../repositories/product.repository'
import { CreateProductInput } from '../schemas/product.schema'

const repo = new ProductRepository()

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateProductInput
    const product = await repo.create(input)
    res.status(201).json({ data: product })
  } catch (err) {
    next(err)  // pass to global error handler
  }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20', search } = req.query
    const result = await repo.findAll({
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100),  // cap at 100
      search: search as string | undefined
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
}
\`\`\`

---

### Global Error Handler

\`\`\`ts
// middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err)

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {  // unique constraint
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Already exists' } })
    }
    if (err.code === 'P2025') {  // not found
      return res.status(404).json({ error: { code: 'NOT_FOUND' } })
    }
  }

  // Generic errors
  const status = (err as any).status || 500
  const message = status === 500 ? 'Internal server error' : err.message
  res.status(status).json({
    error: {
      code: status === 500 ? 'INTERNAL_ERROR' : 'ERROR',
      message,
      requestId: req.headers['x-request-id'] || null
    }
  })
}
\`\`\`
`,
    quiz: [
      { q: 'Why is the global error handler placed last in the Express middleware chain?', options: ['For performance', 'Express only calls 4-argument middleware (err, req, res, next) when an error is passed to next(err) — it needs to be registered after all routes', 'It overrides other middleware', 'Express requires this'], correct: 1, explanation: 'Express identifies error handlers by their 4-argument signature (err, req, res, next). They\'re called when next(err) is invoked. Placing it last ensures it catches errors from all routes. Routes placed after the error handler would be unreachable.' },
      { q: 'What does `schema.safeParse(req.body)` return vs `schema.parse(req.body)`?', options: ['safeParse is faster', 'safeParse returns {success, data} or {success, error} without throwing; parse throws on invalid input', 'safeParse handles async validation', 'They are identical'], correct: 1, explanation: 'parse() throws a ZodError if validation fails — you need try/catch. safeParse() returns a result object: {success: true, data: parsed} or {success: false, error: ZodError}. safeParse is preferred for HTTP validation to avoid unhandled exceptions.' },
      { q: 'What is the repository pattern and why use it?', options: ['A design pattern for Git repositories', 'Abstraction that separates data access logic from business logic, making controllers testable without a real database', 'A caching layer between the controller and database', 'A connection pooling strategy'], correct: 1, explanation: 'Repository pattern hides data access behind an interface. Controllers call repo.create(data), not prisma.product.create(data) directly. In tests, you replace the real repository with a mock. Controllers stay testable without a database.' },
      { q: 'Why cap the `limit` query parameter at 100 in the getProducts controller?', options: ['PostgreSQL has a 100-row limit', 'Prevent clients from requesting 10,000 rows and causing memory/performance issues', 'Pagination only works up to 100', 'Express body limit is 100KB'], correct: 1, explanation: 'Without a cap, a client could request limit=10000, forcing the database to return and the server to serialize 10,000 rows per request. Even with indexes, this wastes resources. Always enforce a reasonable maximum on user-controlled pagination parameters.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a complete mini Express-style router and request handler in pure JavaScript (no npm). Implement: Router with get/post methods, middleware support (app.use()), path parameters, and a simple JSON response helper. Then define 3 routes and make test requests through the router.',
      starterCode: `// Mini Express implementation — shows you understand the framework internals

class MiniExpress {
  constructor() {
    this.middlewares = []
    this.routes = []
  }

  use(fn) {
    this.middlewares.push({ type: 'middleware', fn })
  }

  get(path, ...handlers) {
    this.routes.push({ method: 'GET', path, handlers })
  }

  post(path, ...handlers) {
    this.routes.push({ method: 'POST', path, handlers })
  }

  // Match path and extract params: /users/:id matches /users/42 → { id: '42' }
  matchRoute(method, url) {
    for (const route of this.routes) {
      if (route.method !== method) continue
      const paramNames = []
      const pattern = route.path.replace(/:([\\w]+)/g, (_, name) => {
        paramNames.push(name)
        return '([\\\\w-]+)'
      })
      const match = url.match(new RegExp(\`^\${pattern}$\`))
      if (match) {
        const params = Object.fromEntries(paramNames.map((n, i) => [n, match[i + 1]]))
        return { handlers: route.handlers, params }
      }
    }
    return null
  }

  // Process a mock request
  async handle(method, url, body = null) {
    const req = { method, url, body, params: {}, headers: {} }
    const res = {
      status: 200,
      headers: {},
      body: null,
      json(data) { this.body = data; this.headers['content-type'] = 'application/json'; return this },
      statusCode(code) { this.status = code; return this },
    }

    // TODO: run middlewares, then match route and run handlers
    // Implement a next() function that advances through the chain
  }
}

// Test it
const app = new MiniExpress()

// Middleware
app.use((req, res, next) => {
  console.log(\`[\${req.method}] \${req.url}\`)
  next()
})

// Routes
app.get('/users', (req, res) => res.json({ users: [{ id: 1, name: 'Jordan' }] }))
app.get('/users/:id', (req, res) => res.json({ user: { id: req.params.id } }))
app.post('/users', (req, res) => res.statusCode(201).json({ created: req.body }))

;(async () => {
  const r1 = await app.handle('GET', '/users')
  console.log('GET /users:', r1.body)

  const r2 = await app.handle('GET', '/users/42')
  console.log('GET /users/42:', r2.body)

  const r3 = await app.handle('POST', '/users', { name: 'New User' })
  console.log('POST /users:', r3.status, r3.body)

  const r4 = await app.handle('GET', '/notfound')
  console.log('GET /notfound:', r4?.status || 404)
})()`,
      hints: ['Create a handlers array: [...middlewares, ...routeHandlers]', 'Use index + next = () => runNext(index+1) pattern', 'If no route matched, return {status: 404, body: {error: "not found"}}'],
    },
  },
]
