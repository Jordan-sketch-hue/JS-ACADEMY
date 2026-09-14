import type { Course } from '../courses'

const CC_JS_OBJ = 'Write real JavaScript from scratch — variables, async patterns, DOM manipulation, and the ES6+ syntax used in every modern web project.'

export const crashJsCourses: Course[] = [
  {
    id: 'cc-js-m01', track: 'crash', title: 'Types, Variables & Functions',
    subtitle: 'Declare variables correctly, understand JS types, and write reusable functions.',
    moduleObjective: 'Declare variables correctly, understand JS types, and write reusable functions.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'let / const', definition: 'Block-scoped declarations. Use const by default, let when reassignment is needed. Never var.' },
      { term: 'Primitive Types', definition: 'JS has 7: string, number, bigint, boolean, undefined, null, symbol. typeof checks type at runtime.' },
      { term: 'Arrow Function', definition: 'Concise syntax: (param) => expression. No own this binding — inherits from surrounding scope.' },
      { term: 'Closure', definition: 'When an inner function retains access to outer scope variables after the outer function returns.' },
      { term: 'Template Literal', definition: 'Backtick string with embedded expressions: `Hello ${name}`. Replaces string concatenation.' },
    ],
    content: `## Types, Variables & Functions

JavaScript is the only language that runs natively in every browser and in Node.js. React, Next.js, TypeScript — they all compile down to JavaScript. Mastering fundamentals removes the magic from every framework above them.

### Variables: The Right Declarations

\`\`\`js
const name = 'Jordan'      // cannot be reassigned — use this by default
let count = 0              // reassignable — use when value changes
var old = 'never use this' // function-scoped, hoisted — legacy
\`\`\`

**Rule:** default to \`const\`. Use \`let\` only when the value will change.

### Data Types

\`\`\`js
typeof 'hello'        // 'string'
typeof 42             // 'number'
typeof true           // 'boolean'
typeof undefined      // 'undefined'
typeof null           // 'object' ← historic JS bug, never fixed
typeof []             // 'object'
typeof function(){}   // 'function'
\`\`\`

Primitives are passed by value. Objects (including arrays) are passed by reference.

### Functions: Three Forms

\`\`\`js
// Declaration — hoisted, callable before definition
function greet(name) {
  return \`Hello, \${name}\`
}

// Arrow function — concise, no own this
const greet = (name) => \`Hello, \${name}\`

// Expression — not hoisted
const greet = function(name) { return \`Hello, \${name}\` }
\`\`\`

### Default Parameters and Rest/Spread

\`\`\`js
function createUser(name, role = 'viewer') {
  return { name, role }
}

function sum(first, ...rest) {
  return rest.reduce((acc, n) => acc + n, first)
}

Math.max(...[3, 1, 4, 1, 5, 9])  // 9
\`\`\`

### Scope and Closures

\`const\` and \`let\` are block-scoped:

\`\`\`js
if (true) {
  const x = 10
}
console.log(x)  // ReferenceError
\`\`\`

A closure remembers outer scope:

\`\`\`js
function makeCounter(start = 0) {
  let count = start
  return {
    inc: () => ++count,
    get: () => count,
  }
}
const c = makeCounter(5)
c.inc()  // 6
\`\`\`

This is exactly how React's useState works internally.

### Truthiness

Falsy: \`false\`, \`0\`, \`''\`, \`null\`, \`undefined\`, \`NaN\`. Empty arrays and objects are truthy.

\`\`\`js
const user = null
const name = user?.name ?? 'Guest'  // optional chaining + nullish coalescing
\`\`\``,
    quiz: [
      { q: 'Which declaration should you use by default?', options: ['var', 'let', 'const', 'They are equivalent'], correct: 2, explanation: 'Default to const. Use let only when value must be reassigned.' },
      { q: 'What is a closure?', options: ['A way to exit early', 'Inner function retaining outer scope after outer returns', 'A try/catch wrapper', 'Prevents hoisting'], correct: 1, explanation: 'Closures capture surrounding scope variables. React hooks rely on this.' },
      { q: 'typeof null returns what?', options: ['"null"', '"undefined"', '"object"', '"primitive"'], correct: 2, explanation: '"object" — a JS bug never fixed for backwards compatibility. Use === null to check for null.' },
      { q: 'Difference between undefined and null?', options: ['Identical', 'undefined = never assigned; null = intentionally empty', 'null is a number', 'undefined only in TypeScript'], correct: 1, explanation: 'undefined is the default of unassigned vars. null is an explicit signal: intentionally no value.' },
    ],
  },
  {
    id: 'cc-js-m02', track: 'crash', title: 'Arrays & Objects Deep Dive',
    subtitle: 'Master map, filter, reduce, destructuring, and spread — the foundation of every React project.',
    moduleObjective: 'Manipulate arrays and objects fluently using destructuring, spread, and chained array methods.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Basic',
    xp: 150, duration: 12, module: 2, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'Array.map()', definition: 'Returns a NEW array with each element transformed. Never mutates the original.' },
      { term: 'Array.filter()', definition: 'Returns a NEW array containing only elements where callback returns true.' },
      { term: 'Array.reduce()', definition: 'Folds elements into a single output value. Most powerful array method.' },
      { term: 'Destructuring', definition: 'Extract values: const { name } = user or const [first] = arr. Supports defaults and renaming.' },
      { term: 'Spread (...)', definition: 'Expands iterable: [...arr, item] or {...obj, key: val}. Core of immutable updates.' },
    ],
    content: `## Arrays & Objects Deep Dive

Every React component renders from data — usually arrays of objects. These patterns appear in every codebase.

### The Three Core Array Methods

\`\`\`js
const products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Phone', price: 699, inStock: false },
  { id: 3, name: 'Tablet', price: 499, inStock: true },
]

const names = products.map(p => p.name)
// ['Laptop', 'Phone', 'Tablet']

const available = products.filter(p => p.inStock)

const total = products.reduce((sum, p) => sum + p.price, 0)
// 2197

// Chain them
const availableTotal = products
  .filter(p => p.inStock)
  .reduce((sum, p) => sum + p.price, 0)  // 1498
\`\`\`

### Other Essential Methods

\`\`\`js
products.find(p => p.name === 'Laptop')   // first match or undefined
products.some(p => !p.inStock)            // true if any match
products.every(p => p.inStock)            // true if all match

const sorted = [...products].sort((a, b) => a.price - b.price)  // spread first!
products.slice(0, 2)    // copy portion, non-mutating
\`\`\`

### Destructuring

\`\`\`js
const { name, price, category = 'General', name: productName } = product

// Nested
const { user: { address: { city } } } = data

// Array
const [first, second, ...rest] = items

// Function params — universal React pattern
function ProductCard({ name, price, inStock = false }) {
  return <div>{name} — \${price}</div>
}
\`\`\`

### Spread and Immutable Updates

\`\`\`js
// These three patterns ARE React state updates
const updated = { ...product, price: 899 }
const withNew = [...products, newProduct]
const without = products.filter(p => p.id !== id)

// Update specific item
const modified = products.map(p =>
  p.id === targetId ? { ...p, inStock: false } : p
)
\`\`\`

### Iterating Objects

\`\`\`js
const config = { host: 'localhost', port: 5432, db: 'myapp' }

Object.keys(config)     // ['host', 'port', 'db']
Object.values(config)   // ['localhost', 5432, 'myapp']
Object.entries(config)  // [['host','localhost'], ...]

const uppercased = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [k, String(v).toUpperCase()])
)
\`\`\`

### Optional Chaining & Nullish Coalescing

\`\`\`js
const city = user?.address?.city
const label = item?.label ?? 'Unknown'
\`\`\``,
    quiz: [
      { q: 'What does Array.map() return?', options: ['Original modified', 'New array with each element transformed', 'First match', 'A boolean'], correct: 1, explanation: 'map() creates a NEW array. Never mutates original.' },
      { q: 'Update one item without mutating original?', options: ['splice()', 'find() then assign', 'products.map(p => p.id === id ? {...p, change} : p)', 'Object.assign(products, changes)'], correct: 2, explanation: 'map() with conditional spread creates a new array where only the matching item is replaced.' },
      { q: 'sort() vs [...arr].sort()?', options: ['No difference', 'sort() mutates original; spread creates a copy first', 'spread is slower', 'sort() only for numbers'], correct: 1, explanation: 'sort() mutates in place. Spread first to preserve original — critical with React state.' },
      { q: 'Optional chaining hits null — returns?', options: ['TypeError', 'null', 'undefined', 'false'], correct: 2, explanation: 'Short-circuits to undefined when any step is null/undefined. No TypeError.' },
    ],
  },
  {
    id: 'cc-js-m03', track: 'crash', title: 'Async JavaScript — Promises & async/await',
    subtitle: 'Write async code that fetches data, handles errors, and runs operations in parallel.',
    moduleObjective: 'Write async code that fetches data, handles errors, and runs parallel operations confidently.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Masters',
    xp: 175, duration: 13, module: 3, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'Promise', definition: 'Object representing a future value: pending → fulfilled or rejected.' },
      { term: 'async/await', definition: 'Makes async code look synchronous. async always returns a Promise; await pauses until it settles.' },
      { term: 'Promise.all()', definition: 'Runs multiple Promises in parallel. Resolves when ALL complete, rejects if ANY rejects.' },
      { term: 'Promise.allSettled()', definition: 'Waits for all to finish regardless of rejections. Returns {status, value/reason} for each.' },
      { term: 'try/catch with async', definition: 'Rejected Promises inside try jump to catch. Always wrap await in try/catch.' },
    ],
    content: `## Async JavaScript — Promises & async/await

Every real web app fetches data, calls APIs, reads from databases. JavaScript handles all of this asynchronously — without blocking the page.

### Promises

\`\`\`js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('data'), 1000)
})

p.then(data => console.log(data))
 .catch(err => console.error(err))
 .finally(() => setLoading(false))
\`\`\`

### async/await

\`\`\`js
async function loadUserPosts(userId) {
  try {
    const res = await fetch(\`/api/user/\${userId}\`)
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const user = await res.json()

    const postsRes = await fetch(\`/api/posts/\${user.id}\`)
    return await postsRes.json()
  } catch (err) {
    console.error('Failed:', err)
    throw err
  }
}
\`\`\`

**Rules:** await only inside async functions. async functions always return a Promise. Rejected awaited Promises jump to catch.

### Sequential vs Parallel

\`\`\`js
// Sequential — total = A + B + C
const user = await getUser(id)
const posts = await getPosts(id)
const followers = await getFollowers(id)

// Parallel — total = max(A, B, C)
const [user, posts, followers] = await Promise.all([
  getUser(id), getPosts(id), getFollowers(id),
])
\`\`\`

### Promise.allSettled

\`\`\`js
const results = await Promise.allSettled([
  fetch(url1), fetch(url2), fetch(url3)
])

results.forEach(r => {
  if (r.status === 'fulfilled') process(r.value)
  else logError(r.reason)
})
\`\`\`

### The fetch Pattern

\`\`\`js
async function api(path, options = {}) {
  const res = await fetch(\`/api\${path}\`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? \`HTTP \${res.status}\`)
  }
  return res.json()
}
\`\`\`

fetch only rejects on network failure. A 404 is still a resolved Promise — always check res.ok.`,
    quiz: [
      { q: 'Does fetch() reject when server returns 404?', options: ['Yes — any non-2xx rejects', 'No — only rejects on network failure', 'Only with {strict: true}', 'Only in Node.js'], correct: 1, explanation: 'fetch rejects only on network failure. 404 is a valid HTTP response — check res.ok explicitly.' },
      { q: 'Three independent API calls. Fastest approach?', options: ['Sequential awaits', 'Promise.all()', 'Nested .then() chains', 'setTimeout callbacks'], correct: 1, explanation: 'Promise.all() runs all three simultaneously. Sequential awaits total A+B+C time.' },
      { q: 'Want all to complete even if one fails?', options: ['Promise.all()', 'Promise.allSettled()', 'Promise.race()', 'Promise.any()'], correct: 1, explanation: 'Promise.all() fails fast. Promise.allSettled() waits for all and returns every outcome.' },
      { q: 'Can await be used outside async function?', options: ['Yes anywhere', 'No — SyntaxError unless inside async or top-level ESM', 'Only in Node.js', 'Only in TypeScript'], correct: 1, explanation: 'await is only valid inside async functions or top-level ES modules.' },
    ],
  },
  {
    id: 'cc-js-m04', track: 'crash', title: 'Error Handling & Defensive Patterns',
    subtitle: 'Write code that fails gracefully — catching, surfacing, and recovering from errors correctly.',
    moduleObjective: 'Write code that handles errors gracefully using try/catch, custom errors, and guard clauses.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Masters',
    xp: 175, duration: 11, module: 4, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'try / catch / finally', definition: 'try executes; catch runs on error; finally always runs (cleanup).' },
      { term: 'Custom Error Class', definition: 'class ApiError extends Error. Allows instanceof checks to branch handling by type.' },
      { term: 'Guard Clause', definition: 'Early return handling edge cases before main logic. Keeps happy path readable.' },
      { term: 'Re-throw', definition: 'Catch only when you can handle it. Otherwise re-throw so a higher layer can. Swallowing errors hides bugs.' },
      { term: 'Optional Chaining (?.)', definition: 'Safe property access: returns undefined instead of throwing on null/undefined.' },
    ],
    content: `## Error Handling & Defensive Patterns

Production code fails. Networks drop, APIs return unexpected shapes, users provide bad input. Code that cannot handle failure is not production-ready.

### try / catch / finally

\`\`\`js
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`)
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return await res.json()
  } catch (err) {
    console.error('fetchUser failed:', err.message)
    throw err  // re-throw unless you can handle it here
  } finally {
    setLoading(false)  // always runs
  }
}
\`\`\`

### Custom Error Classes

\`\`\`js
class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

class ValidationError extends Error {
  constructor(field, message) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

try {
  await api.getUser(id)
} catch (err) {
  if (err instanceof ApiError && err.status === 404) return null
  if (err instanceof ValidationError) {
    showFieldError(err.field, err.message)
    return
  }
  throw err  // unexpected — re-throw
}
\`\`\`

### Guard Clauses

\`\`\`js
// BAD — nested
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.total > 0) { /* logic buried */ }
    }
  }
}

// GOOD — guard clauses
function processOrder(order) {
  if (!order) throw new ValidationError('order', 'Order is required')
  if (order.items.length === 0) throw new ValidationError('items', 'Cart is empty')
  if (order.total <= 0) throw new ValidationError('total', 'Invalid total')

  return chargeAndFulfill(order)
}
\`\`\`

### Go-Style Error Tuples

\`\`\`js
async function safeGet(url) {
  try {
    const data = await api.get(url)
    return [data, null]
  } catch (err) {
    return [null, err]
  }
}

const [user, err] = await safeGet('/api/user')
if (err) { handleError(err); return }
// user guaranteed defined here
\`\`\``,
    quiz: [
      { q: 'When should you re-throw?', options: ['Never', 'Always', 'When you cannot handle it locally', 'Only in production'], correct: 2, explanation: 'Catch only when you can handle meaningfully. Otherwise re-throw. Swallowing errors hides bugs.' },
      { q: 'Advantage of custom error classes?', options: ['Faster', 'instanceof checks to branch handling by type', 'Prevent stack traces', 'Required by TypeScript'], correct: 1, explanation: 'Custom errors let you distinguish ApiError from ValidationError and handle each differently.' },
      { q: 'What does finally do?', options: ['Runs if no error', 'Runs only if error', 'Always runs — cleanup', 'Cancels thrown errors'], correct: 2, explanation: 'finally always runs — whether try succeeded or catch handled an error.' },
      { q: 'What is a guard clause?', options: ['Security check before API', 'Early return handling edge cases before main logic', 'A try/catch wrapper', 'TypeScript assertion'], correct: 1, explanation: 'Guard clauses return/throw early for preconditions, keeping main logic unindented.' },
    ],
  },
  {
    id: 'cc-js-m05', track: 'crash', title: 'DOM Manipulation & Events',
    subtitle: 'Select, modify, and respond to user interactions in the browser DOM directly.',
    moduleObjective: 'Select, modify, and respond to browser DOM elements and events without a framework.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Basic',
    xp: 150, duration: 10, module: 5, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'DOM', definition: "Browser's in-memory tree of the HTML document. JS reads and mutates it to change what users see." },
      { term: 'querySelector', definition: 'Selects first element matching a CSS selector. querySelectorAll returns all matches.' },
      { term: 'addEventListener', definition: "Attaches a handler: element.addEventListener('click', fn)." },
      { term: 'Event Delegation', definition: 'One parent listener handles children via bubbling. Efficient for dynamic lists.' },
      { term: 'Event Bubbling', definition: 'Events fire on target then bubble up through ancestors. stopPropagation() halts it.' },
    ],
    content: `## DOM Manipulation & Events

React abstracts the DOM, but understanding it separates developers who can debug at any level from those who are lost without a framework.

### Selecting Elements

\`\`\`js
const btn = document.querySelector('#submit')
const nav = document.querySelector('nav.primary')
const cards = document.querySelectorAll('.card')
const arr = [...cards]  // spread NodeList to use array methods

const container = document.querySelector('.grid')
const items = container.querySelectorAll('.item')  // scope to container
\`\`\`

### Reading and Writing

\`\`\`js
element.textContent = 'Safe text'           // escapes HTML — use for user data
element.innerHTML = '<strong>Bold</strong>' // renders HTML — NEVER with user input (XSS)

element.setAttribute('aria-expanded', 'true')
element.dataset.id    // shortcut for data-id attribute

element.classList.add('active')
element.classList.remove('hidden')
element.classList.toggle('open')

input.value     // form input value
input.checked   // checkbox
\`\`\`

### Creating Elements

\`\`\`js
const card = document.createElement('div')
card.className = 'card'
card.textContent = title
parent.appendChild(card)
parent.prepend(card)    // at start
card.after(sibling)     // after existing node
card.remove()
\`\`\`

### Events

\`\`\`js
function handleClick(event) {
  event.preventDefault()           // stop form submit / link nav
  event.stopPropagation()          // stop bubbling
  console.log(event.target)        // element that triggered
  console.log(event.currentTarget) // element listener is on
}

btn.addEventListener('click', handleClick)
btn.removeEventListener('click', handleClick)  // same reference required
btn.addEventListener('click', handleClick, { once: true })  // auto-removes
\`\`\`

### Event Delegation

\`\`\`js
const list = document.querySelector('#product-list')

list.addEventListener('click', (e) => {
  const item = e.target.closest('[data-product-id]')
  if (!item) return
  handleProductClick(item.dataset.productId)
})
\`\`\`

\`closest()\` walks up the DOM to find the nearest ancestor matching a selector — essential when click lands on a child of the intended target.

### Why This Matters for React

React's virtual DOM optimizes over these raw operations:
- \`key\` props let React match DOM nodes during reconciliation
- \`useRef\` gives you a direct DOM handle (\`ref.current = element\`)
- React state updates are async — batched then applied as minimal DOM mutations`,
    quiz: [
      { q: 'Why never use innerHTML with user data?', options: ['Slower', 'Can execute scripts — XSS vector', 'No nested elements', 'Converts to plain text'], correct: 1, explanation: 'innerHTML parses and renders HTML including scripts. Injecting user data = XSS. Use textContent.' },
      { q: 'event.target refers to?', options: ['Element listener is on', 'Element that triggered the event', 'Parent of clicked element', 'Document root'], correct: 1, explanation: 'event.target is the element that received the event. event.currentTarget is where the listener is — they differ during delegation.' },
      { q: 'Why is event delegation more efficient?', options: ['Less CSS', 'One listener handles all children — works for dynamic elements too', 'addEventListener is slower', 'Required by browsers'], correct: 1, explanation: 'One parent listener catches events from all children including dynamically added ones. N listeners on N elements is expensive.' },
      { q: 'What does closest() do?', options: ['Returns closest sibling', 'Walks up DOM to nearest ancestor matching selector', 'Finds element with smallest pixel distance', 'Returns parent element'], correct: 1, explanation: "closest() traverses up the DOM returning the first ancestor matching the CSS selector." },
    ],
  },
  {
    id: 'cc-js-m06', track: 'crash', title: 'ES Modules & the Import/Export System',
    subtitle: 'Organise code across files using named exports, default exports, and barrel patterns.',
    moduleObjective: 'Organise code across files using ES module imports, exports, and re-export patterns.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'Named Export', definition: "export const foo. Imported with destructuring: import { foo } from './file'. Multiple per file." },
      { term: 'Default Export', definition: "export default thing. Imported as any name. One per file." },
      { term: 'Barrel File', definition: "index.ts that re-exports from many files: export { Button } from './Button'. Clean import paths." },
      { term: 'Dynamic Import', definition: "import('./module') — loads asynchronously at runtime. Enables code splitting." },
      { term: 'Module Scope', definition: 'Each module has its own scope. Variables are private unless exported.' },
    ],
    content: `## ES Modules & the Import/Export System

A codebase is not one file. How modules work — what is shared, what is private, how imports resolve — is essential reading.

### Named vs Default Exports

\`\`\`js
// Named exports — multiple per file
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
export const MAX_FILE_SIZE = 10 * 1024 * 1024

import { formatCurrency, MAX_FILE_SIZE } from './utils'
import { formatCurrency as fmt } from './utils'   // rename
import * as utils from './utils'                   // namespace
\`\`\`

\`\`\`js
// Default export — one per file
export default function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

import Button from './Button'      // name is your choice
import MyButton from './Button'    // also valid
\`\`\`

### Barrel Files

\`\`\`js
// components/index.ts
export { default as Button } from './Button'
export { default as Input } from './Input'
export { default as Modal } from './Modal'

// Consumer
import { Button, Input, Modal } from '@/components'
\`\`\`

### Dynamic Imports

\`\`\`js
// Load on demand
const { Chart } = await import('chart.js')

// Next.js dynamic with loading state
import dynamic from 'next/dynamic'
const Heavy = dynamic(() => import('./Heavy'), {
  loading: () => <Spinner />,
  ssr: false,
})
\`\`\`

### Path Aliases

\`\`\`json
// tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
\`\`\`

\`\`\`js
import { Button } from '@/components'      // with alias
import { Button } from '../../../components'  // without — fragile
\`\`\`

### Module Scope is Private

\`\`\`js
// a.ts
const secret = 'only here'
export const shared = 'accessible via import'

// b.ts
import { shared } from './a'
// secret is inaccessible
\`\`\`

A fundamental improvement over script tags where every variable was global.`,
    quiz: [
      { q: 'Named vs default exports?', options: ['Default faster', 'Named = {} import, many per file; default = any name, one per file', 'Named only TypeScript', "Default can't export functions"], correct: 1, explanation: 'Named: export const x → import { x }. Multiple per file. Default: export default → import AnyName. One per file.' },
      { q: 'What is a barrel file?', options: ['Bundled production file', 'index.ts re-exporting many files for clean imports', 'webpack config', 'Type definitions only'], correct: 1, explanation: 'A barrel file re-exports from many files, creating a single import entry point for a folder.' },
      { q: 'Path alias advantage?', options: ['Faster bundling', 'Clean absolute paths that do not break when files move', 'Required for TypeScript', 'npm access'], correct: 1, explanation: 'Aliases replace fragile relative paths. When you reorganise files, only alias config changes.' },
      { q: 'Are top-level module variables global by default?', options: ['Yes', 'No — private unless exported', 'Only if const', 'Yes in browser, no in Node'], correct: 1, explanation: 'ES modules have their own scope. Variables are private unless explicitly exported.' },
    ],
  },
  {
    id: 'cc-js-m07', track: 'crash', title: 'npm, package.json & the Build Chain',
    subtitle: 'Use npm confidently and understand what happens between source code and the browser.',
    moduleObjective: 'Use npm fluently, read package.json, and trace the full build chain from source to browser.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'Masters',
    xp: 175, duration: 11, module: 7, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'package.json', definition: 'Project manifest: name, version, scripts, dependencies, devDependencies.' },
      { term: 'dependencies vs devDependencies', definition: 'dependencies run in production. devDependencies are build tools excluded from production.' },
      { term: 'package-lock.json', definition: 'Auto-generated. Records exact installed versions. Guarantees reproducible installs. Always commit.' },
      { term: 'Bundler', definition: 'Resolves imports, combines modules, tree-shakes, outputs browser-ready files.' },
      { term: 'Tree Shaking', definition: 'Removes unused exports from final bundle. Requires static ES imports.' },
    ],
    content: `## npm, package.json & the Build Chain

Understanding the package system and what \`npm run build\` actually does removes a huge class of debugging helplessness.

### npm Commands Daily

\`\`\`bash
npm install                    # install all deps from package-lock.json
npm install react              # add to dependencies
npm install -D eslint          # add to devDependencies
npm uninstall package          # remove
npm run dev                    # run dev script
npm run build                  # run build script
npx some-cli                   # run without global install
\`\`\`

### Reading package.json

\`\`\`json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "^19.0.0",
    "@supabase/supabase-js": "^2.46.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.0.0"
  }
}
\`\`\`

Version ranges: \`^19.0.0\` = accept minor+patch (19.x.x); \`~19.0.0\` = patches only; \`19.0.0\` = exact.

### The Build Chain (Next.js)

1. **TypeScript** — type-checks .ts/.tsx; build fails on errors
2. **Bundler** — resolves all imports, loads files, applies aliases
3. **Tree Shaking** — removes unused exported code
4. **Code Splitting** — separate bundles per route
5. **Minification** — renames vars, removes whitespace
6. **Output** — .next/ directory

### Environment Variables

\`\`\`
NEXT_PUBLIC_API_URL=https://api.mysite.com  ← baked into client bundle at BUILD TIME
SUPABASE_SERVICE_ROLE_KEY=secret            ← server-side only at RUNTIME
\`\`\`

\`NEXT_PUBLIC_*\` vars are inlined into the JS bundle — anyone can read them. Never put secrets in \`NEXT_PUBLIC_\`.

### .gitignore Rules

Always commit: \`package.json\`, \`package-lock.json\`
Never commit: \`node_modules/\`, \`.env\`

### Semantic Versioning

MAJOR.MINOR.PATCH — breaking.feature.fix. The \`^\` caret accepts MINOR and PATCH but locks MAJOR.`,
    quiz: [
      { q: 'Never commit to git?', options: ['package.json', 'package-lock.json', 'node_modules and .env', 'tsconfig.json'], correct: 2, explanation: 'node_modules is massive and regeneratable. .env contains secrets. Both in .gitignore.' },
      { q: 'dependencies vs devDependencies?', options: ['JS vs TypeScript', 'Production runtime vs build tools excluded from prod', 'No difference', 'devDependencies install globally'], correct: 1, explanation: 'dependencies needed at runtime. devDependencies (TypeScript, ESLint) are build-only — excluded from production.' },
      { q: 'What does NEXT_PUBLIC_ do?', options: ['Encrypts it', 'Bakes into client JS at build — visible to all users', 'All environments', 'Prevents overriding'], correct: 1, explanation: 'NEXT_PUBLIC_ vars are inlined into the browser bundle. Never put secrets there.' },
      { q: 'Tree shaking does what?', options: ['Sorts imports', 'Removes unused exported code from bundle', 'Reorders modules', 'Converts CommonJS to ESM'], correct: 1, explanation: 'Tree shaking removes exported code never imported anywhere. Only one function used from a large library? The rest is cut.' },
    ],
  },
  {
    id: 'cc-js-m08', track: 'crash', title: 'Browser APIs, Storage & Performance',
    subtitle: 'Use Web APIs, manage client-side storage, and write JS that performs in the browser.',
    moduleObjective: 'Use essential browser APIs, manage localStorage, and avoid common JS performance pitfalls.',
    courseObjective: CC_JS_OBJ, crashId: 'cc-js', crashTitle: 'JavaScript', level: 'PhD',
    xp: 200, duration: 12, module: 8, certArea: 'JavaScript Crash Course',
    keyTerms: [
      { term: 'localStorage', definition: 'Key-value storage persisting across sessions. Strings only — JSON.stringify/parse objects. Never store secrets.' },
      { term: 'sessionStorage', definition: 'Same API as localStorage but cleared when tab closes.' },
      { term: 'Intersection Observer', definition: 'Detects when elements enter/exit viewport. Correct way to implement lazy loading.' },
      { term: 'Debounce', definition: 'Delays execution until N ms after last call. Use on input events for expensive operations.' },
      { term: 'requestAnimationFrame', definition: 'Schedules callback before browser repaints. Correct way to animate — synced to display refresh.' },
    ],
    content: `## Browser APIs, Storage & Performance

The browser has a rich API surface. Using these correctly is what separates code that works from code that performs.

### Client-Side Storage

\`\`\`js
// localStorage — persists across sessions
localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')

// Store objects
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Jordan' }))
const user = JSON.parse(localStorage.getItem('user') ?? 'null')

// Always try/catch — throws in private browsing or when full
function safeGetLocal(key, fallback = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

sessionStorage.setItem('step', '2')  // cleared on tab close
\`\`\`

Security: never store JWTs, passwords, or API keys. Any JS on the same origin can read it.

### Intersection Observer

\`\`\`js
// Wrong — fires thousands of times per scroll
window.addEventListener('scroll', () => {
  if (element.getBoundingClientRect().top < window.innerHeight) revealElement()
})

// Correct — fires only when visibility changes
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el))
\`\`\`

### Debounce

\`\`\`js
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const searchAPI = debounce(async (query) => {
  const results = await api.search(query)
  render(results)
}, 300)

input.addEventListener('input', e => searchAPI(e.target.value))
\`\`\`

### requestAnimationFrame for Animations

\`\`\`js
// Wrong — forced synchronous layout
setInterval(() => {
  element.style.left = (parseFloat(element.style.left) + 1) + 'px'
}, 16)

// Correct
let x = 0
function animate() {
  x += 1
  element.style.transform = \`translateX(\${x}px)\`
  if (x < 300) requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
\`\`\`

\`transform\` and \`opacity\` are GPU-composited. Animating \`width\`, \`height\`, \`top\`, \`left\` triggers layout recalculation every frame — significantly slower.

### Clipboard API

\`\`\`js
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied!')
  } catch {
    // fallback for older browsers
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}
\`\`\``,
    quiz: [
      { q: 'Why never store a JWT in localStorage?', options: ['Too slow', 'Any JS on same origin can read it — XSS can steal it', "Doesn't support strings", 'Deleted on logout'], correct: 1, explanation: 'localStorage is accessible to all JS on the same origin. XSS vulnerabilities let attackers steal everything stored there.' },
      { q: 'Why use Intersection Observer not scroll listener?', options: ['Scroll listeners deprecated', 'Only fires when visibility changes — not thousands of times per scroll', "Can't change CSS from scroll", 'Mobile only'], correct: 1, explanation: 'Scroll listeners fire on every pixel. getBoundingClientRect() forces layout recalculation. Intersection Observer fires only on state changes.' },
      { q: 'What is debouncing?', options: ['Remove listeners after use', 'Delay execution until N ms after last call', 'Fire at most once per interval', 'Cache return values'], correct: 1, explanation: 'Debounce delays execution until N ms have passed with no new calls. Fires only when user pauses typing.' },
      { q: 'Best CSS properties for animation performance?', options: ['width and height', 'top and left', 'transform and opacity', 'margin and padding'], correct: 2, explanation: 'transform and opacity are GPU-composited — animated without layout recalculation. width/height/top/left trigger expensive layout on every frame.' },
    ],
  },
]
