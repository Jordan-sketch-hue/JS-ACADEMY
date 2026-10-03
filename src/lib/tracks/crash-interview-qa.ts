import type { Course } from '../courses'

const CC_QA_OBJ = 'Master test strategy, unit/integration/E2E testing, CI pipeline setup, accessibility testing, and performance testing so you can own quality on any engineering team.'

export const crashInterviewQaCourses: Course[] = [
  {
    id: 'cc-interview-qa-m01', track: 'crash', title: 'Testing Philosophy & Strategy',
    subtitle: 'The testing pyramid, what to test vs not, and how to structure a test suite that teams actually maintain.',
    moduleObjective: 'Explain the testing pyramid, pick the right test type for any scenario, and avoid the common traps that make test suites brittle.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 1, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Testing Pyramid', definition: 'Many unit tests at the base, fewer integration tests in the middle, fewest E2E tests at top — optimal cost/coverage ratio.' },
      { term: 'Unit Test', definition: 'Tests a single function or class in isolation, with all dependencies mocked.' },
      { term: 'Integration Test', definition: 'Tests multiple units working together, often with a real database or HTTP server.' },
      { term: 'E2E Test', definition: 'End-to-End — drives a real browser through user flows; slowest but highest confidence.' },
      { term: 'Test Double', definition: 'Any fake dependency: stub (returns fixed data), mock (asserts calls), spy (records calls), fake (real implementation but simpler).' },
      { term: 'Code Coverage', definition: 'Percentage of code lines/branches executed by tests; useful signal but not a quality goal by itself.' },
      { term: 'Flaky Test', definition: 'A test that passes and fails non-deterministically — the most expensive form of technical debt in a test suite.' },
    ],
    content: `## Testing Philosophy & Strategy

### The Testing Pyramid

\`\`\`
         /\\
        /E2E\\          ← Few (5-20): slow, fragile, high confidence
       /──────\\
      /  Integration  ← Some (50-200): medium speed, tests contracts
     /──────────────\\
    /   Unit Tests    ← Many (500+): fast, isolated, precise
   /──────────────────\\
\`\`\`

**The rule:** push tests down the pyramid as far as possible.
- If a unit test can prove the logic — write a unit test.
- If you need two modules interacting — write an integration test.
- Reserve E2E for critical user journeys only (checkout, login, sign-up).

### What to test and what NOT to test

\`\`\`typescript
// ✓ DO test: business logic with clear inputs/outputs
function calculateDiscount(price: number, tier: 'silver' | 'gold' | 'platinum') {
  if (tier === 'platinum') return price * 0.7
  if (tier === 'gold') return price * 0.85
  return price * 0.95
}
// Easy to unit test — pure function, no dependencies

// ✓ DO test: error branches and edge cases
function getUser(id: string) {
  if (!id) throw new Error('ID required')
  return db.find(id)
}

// ✗ DON'T test: implementation details
const [count, setCount] = useState(0)
// Don't test that useState is called — test visible behavior

// ✗ DON'T test: third-party library internals
// Don't test that React.createElement works — test YOUR component

// ✓ DO test: component behavior from user perspective
// render → interact → assert on visible output
\`\`\`

### Test structure: Arrange-Act-Assert (AAA)

\`\`\`typescript
import { describe, it, expect } from 'vitest'

describe('calculateDiscount', () => {
  it('gives platinum members 30% off', () => {
    // Arrange
    const price = 100
    const tier = 'platinum'

    // Act
    const result = calculateDiscount(price, tier)

    // Assert
    expect(result).toBe(70)
  })

  it('gives gold members 15% off', () => {
    expect(calculateDiscount(100, 'gold')).toBe(85)
  })

  it('gives silver members 5% off', () => {
    expect(calculateDiscount(100, 'silver')).toBe(95)
  })
})
\`\`\`

### Vitest setup for a Next.js project

\`\`\`typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',       // browser-like env for component tests
    globals: true,              // no need to import describe/it/expect
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines: 80, branches: 75 },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})

// vitest.setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
afterEach(cleanup)
\`\`\`

### Anti-patterns that make test suites brittle

\`\`\`typescript
// ✗ BRITTLE: Testing implementation details
it('calls setState twice', () => {
  const spy = vi.spyOn(component, 'setState')
  component.handleClick()
  expect(spy).toHaveBeenCalledTimes(2)  // breaks on refactor
})

// ✓ RESILIENT: Testing visible behavior
it('shows success message after clicking submit', async () => {
  render(<Form />)
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))
  expect(screen.getByText('Success!')).toBeInTheDocument()
})

// ✗ BRITTLE: Hardcoded timeouts in async tests
it('loads data', async () => {
  render(<DataTable />)
  await new Promise(r => setTimeout(r, 2000))  // flaky!
  expect(screen.getByText('Row 1')).toBeInTheDocument()
})

// ✓ RESILIENT: Wait for the actual condition
it('loads data', async () => {
  render(<DataTable />)
  await waitFor(() => {
    expect(screen.getByText('Row 1')).toBeInTheDocument()
  })
})
\`\`\``,
    quiz: [
      { q: 'Why are unit tests at the base of the testing pyramid (most numerous)?', options: ['Unit tests are harder to write and need more of them', 'They are fast, cheap to run, and pinpoint failures precisely — making them the highest ROI test type', 'Unit tests cover more code than integration tests', 'Unit tests are required by CI/CD pipelines'], correct: 1, explanation: 'Unit tests run in milliseconds, have zero infrastructure dependencies, and fail with precise location info. You get maximum coverage feedback at minimal cost.' },
      { q: 'A test passes on developer machines but fails 20% of the time in CI. What is this called?', options: ['A regression test', 'A smoke test', 'A flaky test', 'A broken test'], correct: 2, explanation: 'A flaky test is non-deterministic — it passes sometimes and fails other times with no code change. Common causes: race conditions, shared state, network calls, random seeds, or time dependencies.' },
      { q: 'What is the difference between a mock and a stub?', options: ['They are the same thing', 'A stub returns preset data; a mock additionally asserts that it was called correctly', 'A mock returns preset data; a stub asserts calls', 'Stubs are for functions; mocks are for classes'], correct: 1, explanation: 'A stub just returns data to make code run. A mock also verifies interaction — you assert that a function was called with specific arguments a specific number of times.' },
      { q: 'Testing that a React component calls useState internally is an example of what anti-pattern?', options: ['Over-testing', 'Testing implementation details', 'Integration testing', 'Snapshot testing abuse'], correct: 1, explanation: 'Testing implementation details means your tests break when you refactor — even if behavior stays the same. Test what the user sees and interacts with, not internal wiring.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write test cases for a shoppingCart module. Test add, remove, and getTotal with edge cases. Structure them with AAA (Arrange-Act-Assert).',
      starterCode: `// The module under test
function createCart() {
  const items = []
  return {
    add(item) {
      const existing = items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        items.push({ ...item })
      }
    },
    remove(id) {
      const idx = items.findIndex(i => i.id === id)
      if (idx !== -1) items.splice(idx, 1)
    },
    getTotal() {
      return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    },
    getItems() { return [...items] },
  }
}

// TODO: Write these test cases (plain assertions, no framework needed)
function runTests() {
  // Test 1: adding an item increases total
  // Test 2: adding same item twice increases quantity, not count
  // Test 3: removing an item decreases total
  // Test 4: empty cart total is 0
  // Test 5: removing non-existent item doesn't throw

  console.log('All tests passed!')
}

// Helper
function assert(condition, message) {
  if (!condition) throw new Error('FAIL: ' + message)
  console.log('PASS:', message)
}

runTests()`,
      hints: [
        'Create a fresh cart for each test to avoid shared state between tests',
        'For test 2: add the same id twice, then check getItems().length === 1 and items[0].quantity === 2',
        'For test 5: call remove with a non-existent id and verify no error is thrown — wrap in try/catch',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m02', track: 'crash', title: 'Unit Testing with Vitest',
    subtitle: 'Mocking, spies, async tests, and testing pure functions and modules thoroughly.',
    moduleObjective: 'Write comprehensive unit tests with mocks, spies, and async patterns using Vitest.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 2, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'vi.mock()', definition: 'Vitest module mock — replaces an entire import with a controlled fake at test time.' },
      { term: 'vi.fn()', definition: 'Creates a mock function that records calls, arguments, and return values.' },
      { term: 'vi.spyOn()', definition: 'Wraps an existing method to track calls without replacing its implementation.' },
      { term: 'mockResolvedValue', definition: 'Sets a mock async function to resolve with a specific value.' },
      { term: 'beforeEach / afterEach', definition: 'Setup and teardown hooks that run before/after each test in a describe block.' },
      { term: 'Snapshot Test', definition: 'Serializes a value (often JSX) to a file; future runs compare to that snapshot.' },
      { term: 'toThrow', definition: 'Vitest matcher that asserts a function throws an error, optionally matching message.' },
    ],
    content: `## Unit Testing with Vitest

### Mocking modules

\`\`\`typescript
// src/services/email.ts (real module)
export async function sendEmail(to: string, subject: string, body: string) {
  // sends real email via Resend API
}

// src/services/auth.ts (module we're testing)
import { sendEmail } from './email'

export async function registerUser(email: string, password: string) {
  const user = await db.createUser({ email, password })
  await sendEmail(email, 'Welcome!', 'Thanks for registering')
  return user
}

// tests/auth.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { registerUser } from '../src/services/auth'

// Mock the ENTIRE email module
vi.mock('../src/services/email', () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}))

// Also mock the DB
vi.mock('../src/lib/db', () => ({
  default: {
    createUser: vi.fn().mockResolvedValue({ id: 'user-1', email: 'test@test.com' }),
  },
}))

import { sendEmail } from '../src/services/email'

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()   // reset call counts between tests
  })

  it('creates a user and sends welcome email', async () => {
    const user = await registerUser('alice@example.com', 'password123')

    expect(user.id).toBe('user-1')
    expect(sendEmail).toHaveBeenCalledOnce()
    expect(sendEmail).toHaveBeenCalledWith(
      'alice@example.com',
      'Welcome!',
      'Thanks for registering'
    )
  })

  it('does not send email if user creation fails', async () => {
    const { default: db } = await import('../src/lib/db')
    vi.mocked(db.createUser).mockRejectedValueOnce(new Error('DB error'))

    await expect(registerUser('bad@test.com', 'pw')).rejects.toThrow('DB error')
    expect(sendEmail).not.toHaveBeenCalled()
  })
})
\`\`\`

### Spying on existing methods

\`\`\`typescript
describe('formatPrice', () => {
  it('calls Intl.NumberFormat with correct locale', () => {
    const spy = vi.spyOn(Intl, 'NumberFormat')

    formatPrice(1999, 'USD')

    expect(spy).toHaveBeenCalledWith('en-US', expect.objectContaining({
      style: 'currency',
      currency: 'USD',
    }))

    spy.mockRestore()   // always restore spies in afterEach
  })
})
\`\`\`

### Testing async functions and timers

\`\`\`typescript
import { vi } from 'vitest'

// 1. Fake timers — control setTimeout/setInterval
describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('only calls fn after wait ms of silence', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('a')
    debounced('b')
    debounced('c')

    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith('c')
  })
})

// 2. Async with resolved/rejected promises
describe('fetchUser', () => {
  it('returns user data on success', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'Alice' }),
    })

    const user = await fetchUser('1')
    expect(user.name).toBe('Alice')
  })

  it('throws on HTTP error', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    await expect(fetchUser('999')).rejects.toThrow('404')
  })
})
\`\`\`

### Parametrized tests with it.each

\`\`\`typescript
describe('validatePassword', () => {
  it.each([
    ['short', 'abc', false],
    ['no uppercase', 'password1!', false],
    ['no number', 'Password!', false],
    ['no special', 'Password1', false],
    ['valid', 'Password1!', true],
    ['long valid', 'MyS3cur3P@ssw0rd', true],
  ])('%s: validatePassword(%s) returns %s', (_name, password, expected) => {
    expect(validatePassword(password)).toBe(expected)
  })
})
\`\`\``,
    quiz: [
      { q: 'What does vi.clearAllMocks() do in a beforeEach block?', options: ['Removes all mock implementations permanently', 'Resets call counts and recorded calls between tests so mocks don\'t leak state', 'Restores original implementations', 'Clears the module registry cache'], correct: 1, explanation: 'clearAllMocks resets call counts, return values from mockReturnValueOnce, etc. Tests are independent — state from one test must not affect another.' },
      { q: 'When should you use vi.spyOn() vs vi.mock()?', options: ['They are interchangeable', 'spyOn wraps an existing method to track calls while keeping its real implementation; vi.mock replaces an entire module', 'vi.mock is for async functions only', 'spyOn is only for class methods'], correct: 1, explanation: 'spyOn lets you track calls to real methods without replacing them. vi.mock replaces the whole module, useful when you don\'t want real side effects (email sending, network calls).' },
      { q: 'You need to test a function that uses setTimeout. What should you use instead of waiting real time?', options: ['Add await new Promise(r => setTimeout(r, ms)) in your test', 'vi.useFakeTimers() then vi.advanceTimersByTime()', 'Use a longer test timeout', 'Skip timer-dependent tests'], correct: 1, explanation: 'Fake timers replace the real setTimeout with a controllable version. vi.advanceTimersByTime(300) instantly jumps the clock 300ms without real waiting — tests stay fast.' },
      { q: 'What is the main risk of snapshot tests for React components?', options: ['They are too slow', 'Developers blindly update snapshots when they fail instead of investigating, making them useless as regression guards', 'They can\'t test props or events', 'Snapshots don\'t work with TypeScript'], correct: 1, explanation: 'Snapshot tests are brittle — any UI change breaks them. Developers often run --updateSnapshot without thinking, defeating the purpose. Prefer behavioral assertions over snapshots.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a createCache function with get/set/clear methods, then write tests that verify it works — including testing that stale items expire correctly using fake timers.',
      starterCode: `// Cache implementation
function createCache(ttlMs = 5000) {
  const store = new Map()

  return {
    set(key, value) {
      store.set(key, { value, expiresAt: Date.now() + ttlMs })
    },
    get(key) {
      const entry = store.get(key)
      if (!entry) return null
      if (Date.now() > entry.expiresAt) {
        store.delete(key)
        return null   // expired
      }
      return entry.value
    },
    clear() {
      store.clear()
    },
    size() {
      return store.size
    },
  }
}

// Manual test framework (no Vitest needed here)
let passed = 0, failed = 0
function test(name, fn) {
  try { fn(); console.log('✓', name); passed++ }
  catch(e) { console.error('✗', name, '-', e.message); failed++ }
}
function expect(val) {
  return {
    toBe: (exp) => { if (val !== exp) throw new Error(\`Expected \${exp}, got \${val}\`) },
    toBeNull: () => { if (val !== null) throw new Error(\`Expected null, got \${val}\`) },
    toBeTruthy: () => { if (!val) throw new Error(\`Expected truthy, got \${val}\`) },
  }
}

// TODO: Write tests for:
// 1. get returns stored value
// 2. get returns null for missing key
// 3. set overwrites existing value
// 4. expired entries return null (advance Date.now manually)
// 5. clear removes all entries

// Mock Date.now for expiry testing
let mockTime = Date.now()
const realDateNow = Date.now.bind(Date)
Date.now = () => mockTime
function advanceTime(ms) { mockTime += ms }

// Write your tests below:

console.log(\`\\nResults: \${passed} passed, \${failed} failed\`)
Date.now = realDateNow`,
      hints: [
        'Create a fresh cache() at the start of each test so they don\'t share state',
        'To test expiry: create cache with TTL 100ms, set a value, call advanceTime(101), then get should return null',
        'Test overwrite: set same key twice, get should return the second value',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m03', track: 'crash', title: 'React Testing Library',
    subtitle: 'Component tests, user events, async queries, and form testing the way users actually use apps.',
    moduleObjective: 'Write React component tests that verify user-visible behavior using React Testing Library best practices.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 3, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'getByRole', definition: 'RTL query that finds elements by ARIA role — the preferred query because it tests accessibility too.' },
      { term: 'userEvent', definition: 'Simulates real user interactions (type, click, tab) with proper browser event sequencing.' },
      { term: 'waitFor', definition: 'Async RTL utility that retries an assertion until it passes or times out.' },
      { term: 'findBy', definition: 'Async query variant — returns a Promise that resolves when the element appears.' },
      { term: 'renderHook', definition: 'RTL utility for testing custom hooks in isolation without a real component.' },
      { term: 'MSW', definition: 'Mock Service Worker — intercepts fetch/XHR at the network level for realistic API mocking.' },
      { term: 'screen', definition: 'RTL global object providing all queries against the currently rendered DOM.' },
    ],
    content: `## React Testing Library

### Query priority — always use in this order

\`\`\`typescript
// 1. getByRole — PREFERRED (tests accessibility)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('heading', { name: /welcome/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('checkbox', { name: /remember me/i })

// 2. getByLabelText — for form inputs without explicit role
screen.getByLabelText(/username/i)

// 3. getByPlaceholderText — fallback for inputs
screen.getByPlaceholderText(/search.../i)

// 4. getByText — for non-interactive elements
screen.getByText(/terms of service/i)

// 5. getByTestId — LAST RESORT (adds non-semantic attributes)
screen.getByTestId('price-display')
\`\`\`

### Testing a form component

\`\`\`typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('submits email and password to onLogin callback', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn().mockResolvedValue(undefined)

    render(<LoginForm onLogin={onLogin} />)

    // Type into inputs
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.type(screen.getByLabelText(/password/i), 'MyPassword1!')

    // Submit
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        email: 'alice@example.com',
        password: 'MyPassword1!',
      })
    })
  })

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i)
  })

  it('disables submit button while loading', async () => {
    const user = userEvent.setup()
    // onLogin never resolves — simulates long request
    const onLogin = vi.fn().mockReturnValue(new Promise(() => {}))

    render(<LoginForm onLogin={onLogin} />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })
})
\`\`\`

### Testing async data loading

\`\`\`typescript
// Using MSW to intercept fetch calls
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/api/courses', () => {
    return HttpResponse.json([
      { id: '1', title: 'JavaScript Crash Course' },
      { id: '2', title: 'React Mastery' },
    ])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('CourseList', () => {
  it('renders courses after loading', async () => {
    render(<CourseList />)

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data
    expect(await screen.findByText('JavaScript Crash Course')).toBeInTheDocument()
    expect(screen.getByText('React Mastery')).toBeInTheDocument()
  })

  it('shows error message on API failure', async () => {
    server.use(
      http.get('/api/courses', () => HttpResponse.error())
    )

    render(<CourseList />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load/i)
  })
})
\`\`\`

### Testing custom hooks

\`\`\`typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('starts at initial value', () => {
    const { result } = renderHook(() => useCounter(5))
    expect(result.current.count).toBe(5)
  })

  it('increments correctly', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => { result.current.increment() })

    expect(result.current.count).toBe(1)
  })

  it('does not go below min', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }))

    act(() => { result.current.decrement() })

    expect(result.current.count).toBe(0)  // clamped at min
  })
})
\`\`\``,
    quiz: [
      { q: 'Why is getByRole the preferred RTL query method?', options: ['It is the fastest query', 'It tests both functionality AND accessibility — if users with screen readers can\'t find it, the query fails too', 'It works for all HTML elements', 'It doesn\'t require importing screen'], correct: 1, explanation: 'getByRole queries by ARIA role, the same way screen readers navigate. Tests written with getByRole automatically verify that your UI is accessible.' },
      { q: 'What is the advantage of using userEvent.type() over fireEvent.change()?', options: ['userEvent.type() is faster', 'userEvent.type() simulates real browser events (keydown, keypress, keyup, input) like a real user, while fireEvent.change() just fires one event', 'fireEvent.change() doesn\'t work with React', 'userEvent automatically validates input values'], correct: 1, explanation: 'Real users fire multiple events when typing. userEvent.type() accurately simulates the full keyboard interaction sequence, catching bugs that only appear with real event sequences.' },
      { q: 'When should you use findBy instead of getBy?', options: ['findBy is always preferred', 'findBy when the element appears asynchronously (after a fetch or state update); getBy for elements present immediately', 'getBy for elements in forms; findBy for everything else', 'findBy only works in async test functions'], correct: 1, explanation: 'getBy throws immediately if the element is not in the DOM. findBy returns a Promise that retries until the element appears (using MutationObserver), ideal for async rendering.' },
      { q: 'Why use MSW (Mock Service Worker) instead of mocking fetch directly?', options: ['MSW is the only way to test network requests', 'MSW intercepts at the network level, making tests realistic — the same mocks work for unit tests, integration tests, and even the running app in development', 'MSW doesn\'t require any setup', 'Direct fetch mocks are not supported in Vitest'], correct: 1, explanation: 'MSW intercepts real HTTP requests in the service worker (browser) or in Node (via intercept), so your actual fetch/axios code runs unchanged. The same handler files can be reused in the app and in tests.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a simple DOM testing utility (without any framework) that renders HTML, queries elements, simulates clicks, and asserts on text content.',
      starterCode: `// Tiny testing utility — understand what RTL does under the hood
function createTestEnv(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  return {
    getByText(text) {
      const elements = container.querySelectorAll('*')
      for (const el of elements) {
        if (el.textContent?.trim() === text) return el
      }
      throw new Error(\`Element with text "\${text}" not found\`)
    },
    getByRole(role) {
      // button, input, heading (h1-h6), link (a), etc.
      const selector = role === 'heading' ? 'h1,h2,h3,h4,h5,h6' : role
      const el = container.querySelector(selector)
      if (!el) throw new Error(\`Element with role "\${role}" not found\`)
      return el
    },
    click(el) {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    },
    cleanup() {
      document.body.removeChild(container)
    }
  }
}

// TODO: Write tests for this counter component using createTestEnv
const counterHTML = \`
  <div>
    <h1>Count: <span id="count">0</span></h1>
    <button id="inc">Increment</button>
    <button id="dec">Decrement</button>
  </div>
\`

// Add behavior
function mountCounter() {
  const { getByText, getByRole, click, cleanup } = createTestEnv(counterHTML)
  let count = 0
  const countEl = document.getElementById('count')
  document.getElementById('inc').onclick = () => { count++; countEl.textContent = count }
  document.getElementById('dec').onclick = () => { count--; countEl.textContent = count }
  return { getByText, getByRole, click, cleanup }
}

// Write 3 tests below using assert():
function assert(cond, msg) {
  if (!cond) throw new Error('FAIL: ' + msg)
  console.log('PASS:', msg)
}

// Test 1: initial count is 0
// Test 2: clicking increment shows 1
// Test 3: clicking decrement from 0 shows -1`,
      hints: [
        'Call mountCounter() to set up the DOM; call .cleanup() at the end of each test',
        'After clicking Increment, get the count element by id and check its textContent',
        'Each test should start from a fresh mountCounter() call to avoid shared state',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m04', track: 'crash', title: 'E2E Testing with Playwright',
    subtitle: 'Full browser automation, page objects, parallel execution, and CI integration.',
    moduleObjective: 'Write robust E2E tests with Playwright using Page Object Model and run them in CI.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 4, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Page Object Model', definition: 'A design pattern encapsulating page-specific selectors and actions into reusable classes.' },
      { term: 'Locator', definition: 'Playwright\'s lazy selector that auto-waits and retries — better than immediate querySelector.' },
      { term: 'Trace Viewer', definition: 'Playwright\'s built-in tool that records and replays test execution with screenshots and network logs.' },
      { term: 'Test Fixture', definition: 'Playwright setup shared across tests — authenticated state, database seeds, shared pages.' },
      { term: 'Soft Assertion', definition: 'expect.soft() — logs failure but continues the test, collecting multiple failures at once.' },
      { term: 'API Testing', definition: 'Playwright can test REST APIs directly (request.get, request.post) alongside browser tests.' },
      { term: 'Sharding', definition: 'Splitting a test suite across multiple machines to run in parallel and reduce total CI time.' },
    ],
    content: `## E2E Testing with Playwright

### Setup and first test

\`\`\`typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,   // retry flakes in CI
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',          // save trace on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})

// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('Password1!')
  await page.getByRole('button', { name: /sign in/i }).click()

  // Playwright auto-waits for navigation
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByRole('heading', { name: /welcome alice/i })).toBeVisible()
})
\`\`\`

### Page Object Model — reusable, maintainable

\`\`\`typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.submitButton = page.getByRole('button', { name: /sign in/i })
    this.errorMessage = page.getByRole('alert')
  }

  async goto() { await this.page.goto('/login') }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}

// e2e/login.spec.ts using POM
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test('invalid credentials show error', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('wrong@example.com', 'wrongpass')

  await expect(loginPage.errorMessage).toHaveText(/invalid credentials/i)
})
\`\`\`

### Fixtures for authenticated state

\`\`\`typescript
// e2e/fixtures.ts
import { test as base, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

type Fixtures = {
  authenticatedPage: Page
}

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Log in once, share across tests
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('alice@example.com', 'Password1!')
    await page.waitForURL('/dashboard')

    await use(page)  // pass authenticated page to tests
  },
})

export { expect }

// e2e/dashboard.spec.ts
import { test, expect } from './fixtures'

test('dashboard shows enrolled courses', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard')
  await expect(authenticatedPage.getByText('My Courses')).toBeVisible()
})
\`\`\`

### API testing with Playwright

\`\`\`typescript
import { test, expect } from '@playwright/test'

test('GET /api/courses returns list', async ({ request }) => {
  const response = await request.get('/api/courses')

  expect(response.status()).toBe(200)
  const data = await response.json()
  expect(Array.isArray(data)).toBe(true)
  expect(data[0]).toMatchObject({
    id: expect.any(String),
    title: expect.any(String),
  })
})

test('POST /api/courses validates input', async ({ request }) => {
  const response = await request.post('/api/courses', {
    data: { title: '' },   // invalid — too short
    headers: { 'Content-Type': 'application/json' },
  })
  expect(response.status()).toBe(400)
  const error = await response.json()
  expect(error.error).toBeTruthy()
})
\`\`\``,
    quiz: [
      { q: 'What is the main advantage of Playwright Locators over document.querySelector()?', options: ['Locators support CSS selectors', 'Locators are lazy and auto-retry until the element is found or a timeout occurs, eliminating timing-based flakiness', 'Locators work in all browsers', 'Locators are faster than querySelector'], correct: 1, explanation: 'Playwright Locators build an expression that is re-evaluated on each action. They automatically wait for elements to be visible, enabled, and stable before interacting — no manual waits needed.' },
      { q: 'What problem does the Page Object Model solve?', options: ['It makes tests run faster', 'It centralizes selectors so a UI change only needs to be updated in one place, not across every test', 'It eliminates the need for assertions', 'It automatically generates test cases'], correct: 1, explanation: 'Without POM, the same selector (e.g. [data-testid="submit-btn"]) is scattered across dozens of tests. POM puts it in one class, so a UI change means editing one file instead of twenty.' },
      { q: 'Why set retries: 2 in CI but retries: 0 locally?', options: ['CI machines are slower so tests need more time', 'Network flakiness and resource contention in CI can cause sporadic failures; locally you want immediate feedback on real failures', 'Local machines have more memory', 'Retries are disabled locally by default and can\'t be changed'], correct: 1, explanation: 'CI environments have shared resources, cold starts, and network variance that cause occasional test flakiness unrelated to code bugs. Retries handle these. Locally, retries hide bugs, so they are turned off.' },
      { q: 'What does test.extend() in Playwright fixtures allow you to do?', options: ['Add custom matchers', 'Share setup/teardown code (like an authenticated browser state) across multiple test files', 'Run tests in parallel', 'Mock API responses automatically'], correct: 1, explanation: 'Fixtures let you define reusable setup (like a logged-in page, a seeded database, or a configured API client) that Playwright automatically sets up before each test and tears down after.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a waitFor utility function that retries a callback until it returns true (or throws), with a configurable timeout and interval. This is what Playwright does internally.',
      starterCode: `// Implement waitFor — retries condition until truthy or timeout
async function waitFor(condition, { timeout = 5000, interval = 100 } = {}) {
  // TODO:
  // - Call condition() every \`interval\` ms
  // - If it returns truthy (or resolves truthy), return the value
  // - If timeout is exceeded, throw: new Error('Timeout waiting for condition')
  // - If condition throws, keep retrying until timeout
}

// Test 1: resolves when condition becomes true
let flag = false
setTimeout(() => { flag = true }, 300)

waitFor(() => flag, { timeout: 2000 })
  .then(() => console.log('Test 1 PASS: resolved when flag became true'))
  .catch(e => console.error('Test 1 FAIL:', e.message))

// Test 2: rejects after timeout if condition never true
waitFor(() => false, { timeout: 200, interval: 50 })
  .then(() => console.error('Test 2 FAIL: should have timed out'))
  .catch(e => console.log('Test 2 PASS: timed out correctly:', e.message))

// Test 3: works with async condition
waitFor(async () => {
  const result = await Promise.resolve(42)
  return result === 42
}, { timeout: 1000 })
  .then(() => console.log('Test 3 PASS: async condition worked'))
  .catch(e => console.error('Test 3 FAIL:', e.message))`,
      hints: [
        'Use a loop: get the current time, loop while Date.now() < startTime + timeout',
        'Call condition() inside try/catch — if it throws, swallow the error and keep retrying',
        'Use await new Promise(r => setTimeout(r, interval)) to wait between retries',
        'If the loop exits without condition being truthy, throw the timeout error',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m05', track: 'crash', title: 'API & Integration Testing',
    subtitle: 'Testing REST APIs with Supertest, database integration tests, and contract testing.',
    moduleObjective: 'Write integration tests for REST APIs using Supertest and a real test database.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 5, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Supertest', definition: 'Node.js library for testing HTTP servers — makes requests and asserts on responses without a running server.' },
      { term: 'Test Database', definition: 'An isolated database instance (in-memory or separate schema) used exclusively for tests.' },
      { term: 'Database Seeding', definition: 'Inserting known data into the test database before tests run to ensure predictable results.' },
      { term: 'Contract Test', definition: 'Verifies that an API consumer and provider agree on the interface — prevents breaking changes.' },
      { term: 'Transaction Rollback', definition: 'Wrapping each test in a DB transaction and rolling back after, keeping tests isolated.' },
      { term: 'Schema Migration', definition: 'Running up migrations on the test database before the test suite to match production schema.' },
      { term: 'Health Check', definition: 'An endpoint (/health or /api/health) that returns 200 OK when the service is running correctly.' },
    ],
    content: `## API & Integration Testing

### Supertest — testing Express/Node HTTP APIs

\`\`\`typescript
// tests/api/courses.test.ts
import request from 'supertest'
import { app } from '../../src/app'
import { db } from '../../src/lib/db'
import { seed, cleanup } from '../helpers/db'

// app.ts — does NOT call app.listen() (Supertest handles connections)
// export const app = express()
// app.use(router)  etc.

describe('GET /api/courses', () => {
  beforeAll(async () => {
    await db.migrate.latest()   // run migrations on test DB
    await seed.courses([        // insert known data
      { id: 'c1', title: 'JavaScript Crash Course', level: 'Beginner' },
      { id: 'c2', title: 'React Mastery', level: 'Intermediate' },
    ])
  })

  afterAll(async () => {
    await cleanup()
    await db.destroy()
  })

  it('returns all courses', async () => {
    const res = await request(app)
      .get('/api/courses')
      .expect(200)

    expect(res.body).toHaveLength(2)
    expect(res.body[0]).toMatchObject({
      id: 'c1',
      title: 'JavaScript Crash Course',
    })
  })

  it('filters by level', async () => {
    const res = await request(app)
      .get('/api/courses?level=Beginner')
      .expect(200)

    expect(res.body).toHaveLength(1)
    expect(res.body[0].level).toBe('Beginner')
  })
})

describe('POST /api/courses', () => {
  it('creates a course with valid data', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', \`Bearer \${await getTestToken()}\`)
      .send({ title: 'New Course', level: 'Advanced' })
      .expect(201)

    expect(res.body.id).toBeTruthy()
    expect(res.body.title).toBe('New Course')
  })

  it('returns 400 for missing title', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', \`Bearer \${await getTestToken()}\`)
      .send({ level: 'Advanced' })   // no title
      .expect(400)

    expect(res.body.error).toBeTruthy()
  })

  it('returns 401 without auth token', async () => {
    await request(app)
      .post('/api/courses')
      .send({ title: 'New Course', level: 'Advanced' })
      .expect(401)
  })
})
\`\`\`

### Transaction rollback pattern for test isolation

\`\`\`typescript
// Each test runs in a transaction that gets rolled back
describe('UserService', () => {
  let trx: Knex.Transaction

  beforeEach(async () => {
    trx = await db.transaction()  // start transaction
  })

  afterEach(async () => {
    await trx.rollback()          // always roll back — DB stays clean
  })

  it('creates a user', async () => {
    const userService = new UserService(trx)  // inject transaction
    const user = await userService.create({
      email: 'test@test.com',
      name: 'Test User',
    })

    expect(user.id).toBeTruthy()

    // Verify it's in the DB within this transaction
    const found = await trx('users').where({ id: user.id }).first()
    expect(found.email).toBe('test@test.com')
    // After this test, trx.rollback() removes the row
  })
})
\`\`\`

### Testing authentication middleware

\`\`\`typescript
describe('auth middleware', () => {
  it('allows request with valid JWT', async () => {
    const token = jwt.sign({ sub: 'user-1' }, process.env.JWT_SECRET!, { expiresIn: '1h' })

    await request(app)
      .get('/api/me')
      .set('Authorization', \`Bearer \${token}\`)
      .expect(200)
  })

  it('rejects expired token', async () => {
    const token = jwt.sign({ sub: 'user-1' }, process.env.JWT_SECRET!, { expiresIn: -1 })

    const res = await request(app)
      .get('/api/me')
      .set('Authorization', \`Bearer \${token}\`)
      .expect(401)

    expect(res.body.error).toMatch(/expired/i)
  })

  it('rejects tampered token', async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEifQ.tamperedsig'

    await request(app)
      .get('/api/me')
      .set('Authorization', \`Bearer \${token}\`)
      .expect(401)
  })
})
\`\`\``,
    quiz: [
      { q: 'Why does the Express app in Supertest tests NOT call app.listen()?', options: ['Supertest doesn\'t support TCP connections', 'Supertest creates its own temporary HTTP server internally — calling listen() would cause port conflicts', 'listen() is only needed for production builds', 'It\'s a Vitest limitation'], correct: 1, explanation: 'Supertest\'s request(app) spins up a bound server internally for each test suite and tears it down automatically. Calling listen() separately would cause EADDRINUSE errors.' },
      { q: 'What is the benefit of the transaction rollback pattern for database tests?', options: ['Transactions are faster than queries', 'Each test starts with a clean database state automatically without needing DELETE or TRUNCATE between tests', 'It avoids needing migrations', 'Transactions improve query performance in tests'], correct: 1, explanation: 'By wrapping each test in a transaction and rolling it back afterward, every test starts from a known clean state with zero manual cleanup. Much faster than truncating tables.' },
      { q: 'You test POST /api/courses with a valid body and get 500. What should you check first?', options: ['The test assertion is wrong', 'Check server logs — a 500 is an unhandled error in the route handler, not a test framework issue', 'Increase the test timeout', 'The request body is too large'], correct: 1, explanation: 'A 500 means the server crashed handling the request. Check the route handler for unhandled exceptions, missing null checks, or DB errors that weren\'t caught.' },
      { q: 'What is a contract test?', options: ['A test that validates your legal API terms of service', 'A test verifying that a consumer and provider agree on an API interface — catching breaking changes before deployment', 'A load test validating SLA compliance', 'A test that verifies DB schema matches ORM models'], correct: 1, explanation: 'Contract tests (Pact, OpenAPI) ensure that when team A changes an API, team B\'s consumers don\'t break. The "contract" is the agreed interface, verified on both sides independently.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a lightweight API test runner that makes HTTP-like requests to mock route handlers and asserts on status codes and response bodies.',
      starterCode: `// Lightweight API tester — understand what Supertest does
function createApp() {
  const routes = {}

  return {
    get(path, handler) {
      routes['GET:' + path] = handler
    },
    post(path, handler) {
      routes['POST:' + path] = handler
    },
    async request(method, path, { body, headers } = {}) {
      const key = method + ':' + path
      const handler = routes[key]
      if (!handler) return { status: 404, body: { error: 'Not found' } }

      const req = { body, headers, method, path }
      const res = { status: 200, body: null }
      const setStatus = (code) => { res.status = code; return res }
      const json = (data) => { res.body = data; return res }
      const resObj = { status: setStatus, json }

      await handler(req, resObj)
      return res
    }
  }
}

// Define the app under test
const app = createApp()

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/echo', (req, res) => {
  if (!req.body?.message) {
    res.status(400).json({ error: 'message required' })
    return
  }
  res.json({ echo: req.body.message })
})

// TODO: Write 4 test cases:
// 1. GET /api/health returns 200 with status: 'ok'
// 2. POST /api/echo returns 200 with the echoed message
// 3. POST /api/echo without body returns 400
// 4. GET /nonexistent returns 404

function assert(cond, msg) {
  if (!cond) throw new Error('FAIL: ' + msg)
  console.log('PASS:', msg)
}

async function runTests() {
  // Write tests here
}

runTests()`,
      hints: [
        'Call app.request("GET", "/api/health") and check res.status === 200 and res.body.status === "ok"',
        'For echo: pass { body: { message: "hello" } } and check res.body.echo === "hello"',
        'For 404: request a path not registered with app.get/app.post',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m06', track: 'crash', title: 'Accessibility & Performance Testing',
    subtitle: 'axe-core, Lighthouse CI, Web Vitals testing, and keyboard navigation verification.',
    moduleObjective: 'Automate accessibility audits and performance budgets in your CI pipeline.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 6, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'WCAG', definition: 'Web Content Accessibility Guidelines — the standard for web accessibility (levels A, AA, AAA).' },
      { term: 'axe-core', definition: 'Open-source accessibility engine used in @axe-core/playwright and jest-axe to find violations.' },
      { term: 'Lighthouse CI', definition: 'Automated Lighthouse runs in CI that fail the build if scores drop below thresholds.' },
      { term: 'Core Web Vitals', definition: 'Google\'s user experience metrics: LCP (loading), INP (interactivity), CLS (layout stability).' },
      { term: 'ARIA', definition: 'Accessible Rich Internet Applications — HTML attributes (role, aria-label, aria-live) for screen readers.' },
      { term: 'Performance Budget', definition: 'A maximum allowed value for a metric (bundle size, LCP, response time) enforced in CI.' },
      { term: 'Tab Order', definition: 'The sequence in which keyboard Tab key moves focus through interactive elements.' },
    ],
    content: `## Accessibility & Performance Testing

### Automated accessibility testing with axe

\`\`\`typescript
// Unit level: jest-axe with React Testing Library
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Button accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Button onClick={() => {}}>Save Changes</Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('icon-only button has accessible label', async () => {
    const { container } = render(
      <IconButton icon={TrashIcon} aria-label="Delete post" />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// E2E level: @axe-core/playwright
import { checkA11y } from 'axe-playwright'

test('home page has no critical a11y violations', async ({ page }) => {
  await page.goto('/')

  await checkA11y(page, undefined, {
    detailedReport: true,
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],  // only check WCAG 2 AA rules
    },
  })
})
\`\`\`

### Keyboard navigation testing

\`\`\`typescript
test('modal can be closed with Escape key', async ({ page }) => {
  await page.goto('/courses')
  await page.getByRole('button', { name: /filters/i }).click()

  // Modal is open
  await expect(page.getByRole('dialog')).toBeVisible()

  // Press Escape
  await page.keyboard.press('Escape')

  // Modal should close
  await expect(page.getByRole('dialog')).not.toBeVisible()

  // Focus should return to trigger element
  await expect(page.getByRole('button', { name: /filters/i })).toBeFocused()
})

test('form can be filled with keyboard only', async ({ page }) => {
  await page.goto('/login')

  // Tab to email, type, Tab to password, type, Tab to button, Enter
  await page.keyboard.press('Tab')
  await page.keyboard.type('alice@example.com')
  await page.keyboard.press('Tab')
  await page.keyboard.type('Password1!')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL('/dashboard')
})
\`\`\`

### Lighthouse CI in GitHub Actions

\`\`\`yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/courses
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

# lighthouse-budget.json — performance budgets
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint", "budget": 2000 },
      { "metric": "largest-contentful-paint", "budget": 3000 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 },
      { "metric": "total-blocking-time", "budget": 300 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 300 },
      { "resourceType": "total", "budget": 500 }
    ]
  }
]
\`\`\`

### What violations to prioritize

| Severity | Example | Fix |
|---|---|---|
| Critical | Image without alt text | Add descriptive alt attribute |
| Critical | Form input without label | Add <label> with htmlFor |
| Serious | Insufficient color contrast | Use 4.5:1 ratio minimum |
| Moderate | Positive tabindex | Remove — use natural DOM order |
| Minor | Missing lang attribute on html | Add lang="en" |

### ARIA best practices

\`\`\`typescript
// ✗ BAD: div soup — not accessible
<div onClick={handleClose}>×</div>

// ✓ GOOD: semantic with ARIA
<button
  onClick={handleClose}
  aria-label="Close dialog"
  type="button"
>
  <XMarkIcon aria-hidden="true" />
</button>

// ✓ Live region for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// ✓ Dialog with proper ARIA
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
</div>
\`\`\``,
    quiz: [
      { q: 'What does WCAG 2 AA compliance mean for color contrast?', options: ['Colors must be black or white only', 'Text must have a contrast ratio of at least 4.5:1 against its background (3:1 for large text)', 'Any color combination is acceptable', 'Contrast only matters for images'], correct: 1, explanation: 'WCAG 2 AA requires 4.5:1 contrast for normal text and 3:1 for large text (18pt or 14pt bold). This ensures readability for users with low vision and in bright environments.' },
      { q: 'A button displays only a trash icon with no visible text. What must you add for accessibility?', options: ['A title attribute', 'An aria-label attribute describing the action (e.g., "Delete post")', 'A tooltip', 'A data-testid attribute'], correct: 1, explanation: 'aria-label provides a text alternative for screen readers. The icon is decorative (aria-hidden="true"), and aria-label gives the button a meaningful accessible name.' },
      { q: 'What does Lighthouse CI\'s performance budget enforce?', options: ['Maximum test runtime', 'That metrics like LCP and bundle size don\'t exceed defined thresholds, failing the CI build if they do', 'Minimum JavaScript coverage', 'Database query time limits'], correct: 1, explanation: 'Performance budgets define maximum acceptable values for metrics. If a code change causes LCP to exceed the budget, CI fails — preventing performance regressions from shipping.' },
      { q: 'After closing a modal dialog, where should keyboard focus move?', options: ['To the top of the page', 'To the first focusable element in the page', 'Back to the element that triggered the modal', 'To the browser address bar'], correct: 2, explanation: 'Returning focus to the trigger element (the button that opened the dialog) is the WCAG requirement for focus management. This lets keyboard users continue where they were.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write an audit function that checks an HTML string for common accessibility violations: missing alt on images, buttons with no accessible name, and inputs with no label.',
      starterCode: `function auditAccessibility(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const violations = []

  // TODO: Check 1 — images without alt attribute
  // Find all <img> elements; if no alt attribute, add violation:
  // { rule: 'img-alt', element: 'img', message: 'Image missing alt attribute' }

  // TODO: Check 2 — buttons with no accessible name
  // Find all <button> elements; if textContent.trim() is empty AND no aria-label attribute, add violation:
  // { rule: 'button-name', element: 'button', message: 'Button has no accessible name' }

  // TODO: Check 3 — text inputs with no associated label
  // Find all <input type="text"> (or no type); if no id OR no <label for="that-id">, add violation:
  // { rule: 'label', element: 'input', message: 'Input has no associated label' }

  return violations
}

// Test
const html1 = \`<img src="logo.png"><button></button><input type="text">\`
const html2 = \`
  <img src="logo.png" alt="Company logo">
  <button aria-label="Close">X</button>
  <label for="name">Name</label><input type="text" id="name">
\`

const v1 = auditAccessibility(html1)
console.log('Violations in html1:', v1.length, '(should be 3)')
v1.forEach(v => console.log(' -', v.rule + ':', v.message))

const v2 = auditAccessibility(html2)
console.log('Violations in html2:', v2.length, '(should be 0)')`,
      hints: [
        'Use doc.querySelectorAll("img") to find images, then check if el.hasAttribute("alt")',
        'For buttons: el.textContent.trim() === "" && !el.hasAttribute("aria-label")',
        'For inputs: get the id, then check if doc.querySelector(`label[for="${id}"]`) exists',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m07', track: 'crash', title: 'CI/CD & Test Pipelines',
    subtitle: 'GitHub Actions workflows, test parallelization, coverage gating, and deployment verification.',
    moduleObjective: 'Build a complete CI pipeline that runs unit, integration, and E2E tests with proper caching and failure handling.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 7, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'CI Pipeline', definition: 'Automated sequence of build, test, and validation steps triggered on every code change.' },
      { term: 'Cache Key', definition: 'A hash (usually of package-lock.json) that determines when to invalidate the dependency cache.' },
      { term: 'Matrix Strategy', definition: 'GitHub Actions feature that runs the same job across multiple OS/Node.js version combinations.' },
      { term: 'Job Dependencies', definition: 'needs: [job] in GitHub Actions — ensures a job runs only after its dependencies pass.' },
      { term: 'Artifact Upload', definition: 'Saving test results, coverage reports, or Playwright traces from a CI run for inspection.' },
      { term: 'Deployment Verification', definition: 'Automated tests (smoke tests, health checks) run against the freshly deployed environment.' },
      { term: 'Branch Protection', definition: 'GitHub setting requiring CI checks to pass before a PR can be merged.' },
    ],
    content: `## CI/CD & Test Pipelines

### Complete GitHub Actions pipeline

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # Job 1: lint and typecheck (fast, runs first)
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'                           # cache node_modules
      - run: npm ci --prefer-offline
      - run: npm run lint
      - run: npm run typecheck

  # Job 2: unit and integration tests
  unit-tests:
    runs-on: ubuntu-latest
    needs: lint                                  # only runs if lint passes
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: \${{ env.NODE_VERSION }}, cache: 'npm' }
      - run: npm ci --prefer-offline
      - run: npm run test:unit -- --coverage
        env:
          DATABASE_URL: postgres://postgres:testpass@localhost:5432/testdb
      - uses: actions/upload-artifact@v4
        if: always()                             # upload even on failure
        with:
          name: coverage-report
          path: coverage/

  # Job 3: E2E tests (slowest, runs last)
  e2e:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: \${{ env.NODE_VERSION }}, cache: 'npm' }
      - run: npm ci --prefer-offline
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test --shard=1/2     # split across 2 runners
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.TEST_SUPABASE_URL }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
\`\`\`

### Coverage gating — fail build below threshold

\`\`\`typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 85,
        statements: 80,
      },
    },
  },
})
// If any threshold is not met, vitest exits with code 1 → CI fails
\`\`\`

### Post-deployment smoke tests

\`\`\`typescript
// e2e/smoke.spec.ts — runs against production/staging URL
import { test, expect } from '@playwright/test'

const BASE = process.env.SMOKE_URL ?? 'https://staging.example.com'

test.describe('Smoke Tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveTitle(/JS Academy/i)
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('health endpoint returns 200', async ({ request }) => {
    const res = await request.get(\`\${BASE}/api/health\`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
  })

  test('login page is accessible', async ({ page }) => {
    await page.goto(\`\${BASE}/login\`)
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })
})
\`\`\`

### Branch protection rules (set in GitHub repo settings)

\`\`\`
Protect branch: main
Required status checks before merging:
  ✓ lint
  ✓ unit-tests
  ✓ e2e
Require branches to be up to date before merging: ✓
Require conversation resolution before merging: ✓
Restrict pushes: only allow PR merges
\`\`\``,
    quiz: [
      { q: 'Why does the E2E job have needs: unit-tests in the CI pipeline?', options: ['E2E tests require unit tests to run first', 'It prevents running expensive E2E tests if cheaper tests already failed, saving CI time and cost', 'GitHub Actions requires explicit job dependencies', 'E2E tests reuse unit test fixtures'], correct: 1, explanation: 'Fail fast — if unit tests find a bug, there\'s no point running 10-minute E2E tests. needs: creates a dependency chain that short-circuits on failure.' },
      { q: 'What does uploading Playwright traces as artifacts if: failure() accomplish?', options: ['It retries failed tests automatically', 'It saves screenshots, network logs, and DOM snapshots from failed test runs so developers can replay and debug them', 'It sends failure notifications to Slack', 'It archives tests for future use'], correct: 1, explanation: 'Playwright traces capture the full test execution — screenshots, network requests, console logs. Uploaded as artifacts, developers can download and open them in the Trace Viewer to diagnose failures.' },
      { q: 'What is --shard=1/2 in Playwright CI?', options: ['Runs only half the test files alphabetically', 'Splits the test suite evenly across 2 runners in parallel, halving total test time', 'Runs tests twice and compares results', 'Skips flaky tests'], correct: 1, explanation: 'Sharding divides all spec files across N parallel runners. --shard=1/2 means "this runner takes the first half of the shard." Combined with 2 GitHub Actions runners, E2E time is cut roughly in half.' },
      { q: 'A developer increases line coverage from 70% to 82% but the CI still fails the coverage check. Why?', options: ['Line coverage is not measured correctly', 'Branch coverage may still be below the threshold — 82% lines but 60% branches still fails if the branch threshold is 75%', 'Coverage thresholds apply only to unit tests', 'The threshold was recently changed to 85%'], correct: 1, explanation: 'Vitest can enforce separate thresholds for lines, branches, functions, and statements. All must pass. Branches (if/else, ternaries) often have lower coverage than lines.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a parseCoverageReport function that reads a coverage summary and returns whether all thresholds pass, listing any failures.',
      starterCode: `const thresholds = {
  lines: 80,
  branches: 75,
  functions: 85,
  statements: 80,
}

// Simulated coverage report output (like from istanbul/v8)
const coverageReport = {
  lines: { pct: 83.4 },
  branches: { pct: 71.2 },   // BELOW threshold
  functions: { pct: 88.0 },
  statements: { pct: 82.1 },
}

function parseCoverageReport(report, thresholds) {
  // TODO:
  // - Compare each metric in report against its threshold
  // - Return { passed: boolean, failures: Array<{ metric, actual, required }> }
  // - passed is true only if ALL metrics meet their threshold
}

const result = parseCoverageReport(coverageReport, thresholds)
console.log('Coverage passed:', result.passed)   // false
if (!result.passed) {
  console.log('Failures:')
  result.failures.forEach(f => {
    console.log(\`  \${f.metric}: \${f.actual}% (required: \${f.required}%)\`)
  })
}`,
      hints: [
        'Loop over Object.keys(thresholds) and compare report[metric].pct against thresholds[metric]',
        'Build a failures array from metrics where pct < threshold',
        'passed is failures.length === 0',
      ],
    },
  },

  {
    id: 'cc-interview-qa-m08', track: 'crash', title: 'QA Live Challenges',
    subtitle: 'Mock QA interview: write tests for buggy functions, find regressions, and fix a broken pipeline.',
    moduleObjective: 'Diagnose untested code, write targeted regression tests, and debug a failing CI pipeline under interview conditions.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 8, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Regression Test', definition: 'A test added specifically to prevent a bug from reappearing after it is fixed.' },
      { term: 'Boundary Testing', definition: 'Testing values at the edges of valid input ranges — min, max, min-1, max+1.' },
      { term: 'Equivalence Partition', definition: 'Grouping inputs into classes where each member should behave the same — test one from each class.' },
      { term: 'Root Cause Analysis', definition: 'Finding the underlying cause of a failure, not just the symptom.' },
      { term: 'Test-Driven Bug Fix', definition: 'Write a failing test for the bug → fix the code → verify the test passes.' },
      { term: 'Mutation Testing', definition: 'Automatically introducing small code changes (mutations) and checking that tests catch them.' },
      { term: 'Cyclomatic Complexity', definition: 'A measure of the number of independent paths through code — higher = more branches to test.' },
    ],
    content: `## QA Live Challenges

### Challenge 1: Find the bugs in this code

\`\`\`typescript
// BUGGY function — find and fix all bugs
function processOrders(orders: Order[]) {
  const result = {
    total: 0,
    count: 0,
    averageOrder: 0,
  }

  for (const order of orders) {
    result.total = result.total + order.amount  // might be: +=
    result.count++
  }

  result.averageOrder = result.total / result.count  // BUG: divide by zero if orders empty!

  return result
}

// Write regression tests for the bugs you find:
// Bug 1: empty array causes NaN (0/0) averageOrder
// Bug 2: orders with negative amounts should they be excluded?
// Bug 3: what if order.amount is null/undefined?
\`\`\`

### Challenge 2: Test a complex async flow

\`\`\`typescript
// Function to test: handles checkout with retry logic
async function processCheckout(cart: Cart, maxRetries = 3) {
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const order = await paymentService.charge(cart.total, cart.paymentMethod)
      await inventoryService.reserve(cart.items)
      await emailService.sendConfirmation(cart.userId, order.id)
      return { success: true, orderId: order.id }
    } catch (err) {
      attempt++
      if (attempt >= maxRetries) throw err
      await delay(attempt * 1000)  // exponential backoff
    }
  }
}

// Tests to write:
// 1. Success on first attempt
// 2. Failure on first attempt, success on second (retry works)
// 3. All 3 attempts fail — throws original error
// 4. Email failure does NOT prevent order from completing (or does it? clarify!)
// 5. Inventory reservation fails after payment — rollback? (critical edge case)
\`\`\`

### Challenge 3: Diagnose a failing CI pipeline

\`\`\`
Error log from CI:
────────────────────────────────────────
FAIL tests/courses.test.ts
  ✓ GET /api/courses returns all courses (312ms)
  ✗ POST /api/courses creates new course (1523ms)
    Error: expected 201, got 500
    Response body: { "error": "relation \"courses\" does not exist" }
────────────────────────────────────────

Root cause analysis:
1. "relation does not exist" → DB table missing in test environment
2. Most likely cause: migration was NOT run before the test suite
3. Check: does the CI workflow include a migration step?
4. Fix: add step before tests: npx knex migrate:latest --env test

How to debug efficiently:
1. Read the error message carefully — it tells you exactly what's wrong
2. Check if it works locally — if yes, environment diff is the culprit
3. Look at recent CI changes — did someone add a migration recently?
4. Add database health check to confirm connection before running tests
\`\`\`

### The interview QA mindset

\`\`\`
Interviewer: "We just deployed a fix for a date parsing bug. What tests do you write?"

Answer framework:
1. Regression test for the exact bug (the reported input that failed)
2. Boundary tests around the bug (dates near the boundary that was wrong)
3. Equivalence class tests (valid dates, invalid dates, edge formats)
4. Integration test if the parsing is used in a larger flow

Example:
Bug: "2024-02-29" (leap year) parsed as invalid

Tests:
- it('parses 2024-02-29 correctly') ← regression
- it('parses 2024-02-28 correctly') ← day before boundary
- it('returns null for 2023-02-29') ← non-leap year, should be invalid
- it('handles ISO format 2024-02-29T00:00:00Z') ← format variation
- it('handles DD/MM/YYYY 29/02/2024') ← different format
\`\`\``,
    quiz: [
      { q: 'A CI test fails with "relation does not exist" error. What is the most likely cause?', options: ['A syntax error in the test', 'The test database migrations were not run before the test suite', 'The test is querying the wrong table name', 'The database password is wrong'], correct: 1, explanation: '"Relation does not exist" is Postgres\'s error for a missing table. In CI, the test DB is fresh and needs migrations run (CREATE TABLE statements) before tests can use the tables.' },
      { q: 'You find a bug in production. What test should you write FIRST before fixing the code?', options: ['A unit test for the fixed implementation', 'A test that reproduces the bug and currently fails', 'An E2E test for the full user flow', 'A performance test for the affected endpoint'], correct: 1, explanation: 'Test-Driven Bug Fix: write a failing test that reproduces the exact bug first. When your fix makes it pass, you have a permanent regression guard — the bug can\'t sneak back undetected.' },
      { q: 'What is boundary testing and why is it important?', options: ['Testing the outer limits of the application UI', 'Testing values at the exact edges of valid ranges (min, max, min-1, max+1) where bugs cluster', 'Testing the first and last items in a database', 'Performance testing at maximum concurrent users'], correct: 1, explanation: 'Bugs disproportionately live at boundaries: off-by-one errors, <= vs <, empty collections, maximum string lengths. Testing exactly at and around boundaries catches these without exhaustive testing.' },
      { q: 'Mutation testing reports 40% mutation score. What does this mean?', options: ['40% of tests pass', '40% of your code is covered', 'Only 40% of the small code changes (mutations) introduced were detected by your tests — 60% of mutations survived undetected', 'Your test suite runs 40% faster than average'], correct: 2, explanation: 'Mutation testing creates many broken versions of your code (mutations) and checks if tests catch them. A 40% score means 60% of bugs that could be introduced would go undetected by your test suite.' },
    ],
    ide: {
      language: 'javascript',
      task: 'There are 3 bugs in this pagination function. Write tests to expose each bug, then fix the code so all tests pass.',
      starterCode: `// BUGGY paginate function — find and fix 3 bugs
function paginate(items, page, pageSize) {
  // Bug 1: page is 1-indexed but code treats it as 0-indexed
  const start = page * pageSize
  const end = start + pageSize
  const data = items.slice(start, end)

  // Bug 2: totalPages rounds down — last partial page is lost
  const totalPages = Math.floor(items.length / pageSize)

  // Bug 3: hasNextPage is wrong — should be page < totalPages (not <=)
  const hasNextPage = page <= totalPages

  return { data, page, pageSize, totalPages, hasNextPage }
}

const items = ['a','b','c','d','e','f','g']  // 7 items

// Write tests that expose each bug, then fix paginate() above
function assert(cond, msg) {
  if (!cond) throw new Error('FAIL: ' + msg)
  console.log('PASS:', msg)
}

// Test: page 1, size 3 should return ['a','b','c']
// Test: page 3, size 3 should return ['g'] (last page, 1 item)
// Test: totalPages for 7 items, size 3 should be 3 (not 2)
// Test: page 3 (last page) should have hasNextPage: false

// Write your tests:
`,
      hints: [
        'Bug 1: start should be (page - 1) * pageSize for 1-indexed pages. page=1 should give start=0',
        'Bug 2: Math.ceil(items.length / pageSize) for correct total pages (7/3 = 2.33 → 3 pages)',
        'Bug 3: hasNextPage should be page < totalPages (strictly less than, not <=)',
      ],
    },
  },
  {
    id: 'cc-interview-qa-m09', track: 'crash', title: 'Behavioral STAR Stories for QA Engineers',
    subtitle: 'Turn your testing wins into memorable interview stories using the STAR framework.',
    moduleObjective: 'Build a bank of compelling STAR stories that demonstrate testing strategy, bug advocacy, and quality ownership.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'PhD', xp: 240, duration: 13, module: 9, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'STAR Framework', definition: 'Situation, Task, Action, Result — the structure for answering behavioral interview questions with clarity and impact.' },
      { term: 'Bug Advocacy', definition: 'The skill of communicating a bug\'s severity and business impact to non-technical stakeholders to prioritize fixing it.' },
      { term: 'Quality Gate', definition: 'A defined threshold a build must meet before it can proceed to the next stage (e.g., 80% coverage, zero P0 failures).' },
      { term: 'Regression Risk', definition: 'The probability that a new change will break existing functionality — drives test prioritization decisions.' },
      { term: 'Story Bank', definition: 'A prepared set of 6–8 STAR stories covering different competencies, ready to adapt to any behavioral question.' },
    ],
    content: `## Behavioral STAR Stories for QA Engineers

### Why STAR matters for QA interviews

QA interviews ask behavioral questions more than any other engineering role because quality is fundamentally about process, communication, and judgment — not just code. "Tell me about a time you…" questions test whether you can influence without authority, push back on ship decisions, and balance speed with quality.

### STAR Framework for QA

\`\`\`
S — Situation: Set the scene in 1–2 sentences. What was the product, the team size, the stakes?
T — Task:      What was YOUR specific responsibility? (Not "we" — "I")
A — Action:    What 3-4 concrete steps did YOU take? This is the meat.
R — Result:    Quantified outcome. What improved? What was saved? What was learned?
\`\`\`

### The 7 QA competencies interviewers probe

1. **Bug advocacy** — Did you push back when a P0 was labeled P2?
2. **Test strategy ownership** — Did you design the test plan or just execute it?
3. **Cross-functional collaboration** — How did you work with devs, PMs, support?
4. **Handling deadline pressure** — What did you cut, and how did you decide?
5. **Automation judgment** — When did you automate vs stay manual, and why?
6. **Incident response** — What did you do when a bug escaped to production?
7. **Process improvement** — What did you change that made the team faster or safer?

### Story 1: Catching a critical bug before launch

> "Three days before a major e-commerce launch, I was doing exploratory testing on the checkout flow with an unexpected payment method combination — a store credit applied to a subscription product. The system allowed the purchase but never charged the card, effectively giving away a free subscription indefinitely. The issue was in an untested edge case at the intersection of two billing systems that had never needed to talk before.
>
> I documented it with a screen recording, estimated revenue impact (potentially $40K/month in lost subscriptions), and escalated directly to the engineering lead and PM — skipping the normal ticket queue given the launch timeline. Dev fixed it in 6 hours. The launch proceeded on schedule. The PM later told me I'd saved the quarter."

**STAR breakdown:**
- **S:** Three days before launch, e-commerce platform
- **T:** Exploratory testing of checkout edge cases
- **A:** Found race condition, documented with recording, quantified impact, escalated directly
- **R:** Fixed before launch, no revenue loss, on-time ship

### Story 2: Pushing back on a ship decision

> "The product team wanted to ship a redesigned onboarding flow that had a 12% increase in drop-off rate in our UAT cohort. The PM framed it as 'within acceptable variance.' I pulled the historical data showing our existing flow had a 4% drop-off rate, meaning the new design would cost roughly 350 sign-ups per week at current traffic. I presented this at the sprint review with a one-page summary. The team agreed to delay one sprint to fix the two screens with the highest drop-off. Post-launch, the redesign actually improved sign-ups by 8%."

**Key lesson:** Never say "this shouldn't ship." Say "here is the cost of shipping now vs. fixing this one thing."

### Story 3: Improving test suite reliability

> "Our E2E suite was failing 30% of CI runs due to flaky tests, causing developers to re-run pipelines routinely. I audited 3 months of failure logs, categorized every failure, and found 80% came from 12 tests with timing-dependent assertions. I rewrote those 12 tests using explicit wait conditions instead of hardcoded sleeps, and added retry logic for network-dependent steps. Within two weeks, the flake rate dropped from 30% to under 2%, saving the team an estimated 4 hours of re-run time per day."

### The 5 questions you MUST have stories for

\`\`\`
1. "Tell me about a time you found a critical bug right before launch."
   → Use Story 1 above or adapt it to your experience.

2. "Describe a time you disagreed with a product decision about quality."
   → Use Story 2. Lead with data, not opinion.

3. "How have you improved a broken or slow test process?"
   → Use Story 3. Quantify the before/after.

4. "Tell me about a bug that escaped to production and what you did."
   → Key: own your role, describe the post-mortem, explain what changed.

5. "How do you balance test coverage with shipping speed?"
   → Show you understand risk-based testing, not 100% coverage at all costs.
\`\`\`

### Building your personal story bank

Before your interview, write out 6–8 stories in STAR format. Tag each with the competencies it demonstrates. During the interview, you're just selecting the right story for the question — not improvising.

\`\`\`
Story A: [Caught critical bug]     → bug advocacy, exploratory testing
Story B: [Pushed back on ship]     → cross-functional, data-driven
Story C: [Fixed flaky suite]       → process improvement, automation
Story D: [Led test strategy]       → strategy ownership, planning
Story E: [Production incident]     → incident response, communication
Story F: [Mentored a developer]    → collaboration, test culture
\`\`\`

The interviewer will remember the story, not your resume bullet. Make it specific.`,
    quiz: [
      {
        q: 'In a STAR story, what should you emphasize most when describing the Action?',
        options: ['The team\'s collective effort', 'Your specific, individual steps', 'The technology stack used', 'The timeline of events'],
        correct: 1,
        explanation: 'The Action is YOUR story — use "I" not "we." Interviewers want to assess your specific contribution, judgment, and skills.',
      },
      {
        q: 'A PM dismisses a P1 bug as "acceptable variance." What\'s the most effective QA response?',
        options: ['Escalate to the VP immediately', 'Accept the decision since the PM owns the product', 'Quantify the business impact in the PM\'s language (revenue, users affected)', 'File the bug and move on'],
        correct: 2,
        explanation: 'QA professionals influence without authority. Translating bugs into business impact (revenue lost, users affected) is far more persuasive than technical severity alone.',
      },
      {
        q: 'What makes a Result section of a STAR story strong?',
        options: ['It describes all team members\' contributions', 'It includes quantified outcomes (%, $, hours saved)', 'It explains the technical solution in detail', 'It lists lessons learned'],
        correct: 1,
        explanation: 'Quantified results are memorable and credible. "Flake rate dropped from 30% to 2%" is far stronger than "the tests became more reliable."',
      },
      {
        q: 'Which QA competency is most important to demonstrate with behavioral stories?',
        options: ['Memorizing all testing frameworks', 'Influence without authority — driving quality without direct control', 'Writing perfect test code', 'Knowing every bug tracking tool'],
        correct: 1,
        explanation: 'QA engineers rarely have direct authority to block a ship. The ability to influence PMs, devs, and leadership through data and communication is the defining senior QA skill.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a STAR story scorer. Given a STAR story object, score it 0–100 based on: has quantified result (+30), uses "I" not just "we" (+20), names specific tools/actions (+20), mentions business impact (+20), is under 250 words (+10). Return the score and an array of feedback strings.',
      starterCode: `function scoreStarStory(story) {
  // story = { situation, task, action, result }
  // Return { score: number, feedback: string[] }

  const feedback = []
  let score = 0

  const fullText = [story.situation, story.task, story.action, story.result].join(' ')
  const wordCount = fullText.split(/\\s+/).length

  // TODO: Check for quantified result (%, $, number, hours, ms)
  // TODO: Check for first-person "I" usage
  // TODO: Check for specific tool mentions (common ones: Jest, Playwright, Cypress, etc.)
  // TODO: Check for business impact keywords (revenue, users, conversion, retention)
  // TODO: Check word count <= 250

  return { score, feedback }
}

// Test it:
const myStory = {
  situation: "Three days before launch on our e-commerce platform",
  task: "I was responsible for exploratory testing of the checkout flow",
  action: "I found a race condition where store credits bypassed card charging, documented it with a screen recording, estimated $40K/month impact, and escalated directly to the engineering lead",
  result: "Dev fixed it in 6 hours, we shipped on time, no revenue loss"
}

console.log(scoreStarStory(myStory))`,
      solution: `function scoreStarStory(story) {
  const feedback = []
  let score = 0

  const fullText = [story.situation, story.task, story.action, story.result].join(' ')
  const wordCount = fullText.split(/\\s+/).length

  // Quantified result
  if (/[\\d]+%|\\$[\\d]+|[\\d]+ (hours?|users?|ms|minutes?|days?)/.test(story.result)) {
    score += 30
    feedback.push('✓ Result is quantified')
  } else {
    feedback.push('✗ Add a number to the result (%, $, hours saved, users affected)')
  }

  // First person
  const iCount = (fullText.match(/\\bI\\b/g) || []).length
  if (iCount >= 3) {
    score += 20
    feedback.push('✓ Uses first person clearly')
  } else {
    feedback.push('✗ Use "I" more — describe YOUR actions, not the team\'s')
  }

  // Specific tools
  const tools = ['jest', 'playwright', 'cypress', 'selenium', 'postman', 'jira', 'github', 'ci', 'pipeline']
  const mentionedTools = tools.filter(t => fullText.toLowerCase().includes(t))
  if (mentionedTools.length >= 1) {
    score += 20
    feedback.push(\`✓ Mentions specific tools: \${mentionedTools.join(', ')}\`)
  } else {
    feedback.push('✗ Name specific tools — "a screen recording" is better than "documented it"')
  }

  // Business impact
  if (/revenue|user|conversion|retention|customer|cost|save|ship|launch/.test(fullText.toLowerCase())) {
    score += 20
    feedback.push('✓ Connects to business impact')
  } else {
    feedback.push('✗ Add business context — why did this matter to the company?')
  }

  // Word count
  if (wordCount <= 250) {
    score += 10
    feedback.push(\`✓ Concise (\${wordCount} words)\`)
  } else {
    feedback.push(\`✗ Too long (\${wordCount} words) — trim to under 250\`)
  }

  return { score, feedback }
}

const myStory = {
  situation: "Three days before launch on our e-commerce platform",
  task: "I was responsible for exploratory testing of the checkout flow",
  action: "I found a race condition where store credits bypassed card charging, documented it with a screen recording, estimated $40K/month impact, and escalated directly to the engineering lead",
  result: "Dev fixed it in 6 hours, we shipped on time, no revenue loss"
}

console.log(scoreStarStory(myStory))`,
      hints: [
        'Use a regex like /[\\d]+%|\\$[\\d]+/ to detect quantified results',
        'Count occurrences of \\bI\\b (word boundary ensures you match "I" not "It")',
        'Check for tool names with fullText.toLowerCase().includes(toolName)',
      ],
    },
  },
  {
    id: 'cc-interview-qa-m10', track: 'crash', title: 'Trade-off Articulation for QA Engineers',
    subtitle: 'How to frame testing tool and strategy decisions as principled trade-offs, not preferences.',
    moduleObjective: 'Articulate 5 key QA trade-offs — automation vs manual, E2E vs unit, Playwright vs Cypress, shift-left vs shift-right, coverage vs speed — with a structured framework.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'PhD', xp: 245, duration: 13, module: 10, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Shift-Left Testing', definition: 'Moving testing earlier in the development cycle — developers write tests before or during development, not after.' },
      { term: 'Shift-Right Testing', definition: 'Testing in production using feature flags, canary releases, and observability to catch issues that tests miss.' },
      { term: 'Test Flakiness', definition: 'Non-deterministic test behavior — a test that sometimes passes and sometimes fails without code changes.' },
      { term: 'Risk-Based Testing', definition: 'Allocating test effort proportionally to the risk and impact of each feature — not equal coverage everywhere.' },
      { term: 'Contract Testing', definition: 'Tests that verify the interface between two services matches both sides\' expectations (e.g., Pact framework).' },
    ],
    content: `## Trade-off Articulation for QA Engineers

### The Trade-off Framework

Every trade-off question has the same structure:

\`\`\`
1. Context  — what constraints matter here? (team size, release cadence, tech stack, risk tolerance)
2. Criteria — what are we optimizing for? (speed, confidence, maintainability, cost)
3. Options  — what are the realistic choices?
4. Decision — which fits best given context + criteria?
5. Trade-offs Accepted — what are you giving up, and why is that okay here?
\`\`\`

### Trade-off 1: Automated vs Manual Testing

**The wrong answer:** "We should automate everything."

**The right answer:**

\`\`\`
Automate when:
  ✓ Test runs repeatedly in CI on every PR
  ✓ Deterministic inputs and outputs
  ✓ Low visual/UX judgment required
  ✓ Automation ROI: (runs × time_saved) > (write_time + maintenance_time)

Keep manual when:
  ✓ Exploratory testing — finding bugs that aren't in requirements
  ✓ Usability assessment — "does this FEEL right?"
  ✓ One-time migration validation
  ✓ Complex visual checks (layout, responsive design)
  ✓ Newly specced features that will change
\`\`\`

**One-liner for interviews:** "I automate anything that runs more than 10 times and has a clear pass/fail condition. I keep manual testing for exploration and judgment calls."

### Trade-off 2: Playwright vs Cypress

| Factor | Playwright | Cypress |
|--------|-----------|---------|
| Browser support | Chromium, Firefox, Safari (WebKit) | Chromium only (Firefox beta) |
| Multi-tab / iframes | Native support | Limited |
| Speed | Faster (parallel by default) | Slower (serial by default in free tier) |
| Learning curve | Steeper | Gentler |
| API style | async/await | Chainable (Cypress-specific) |
| Best for | Complex multi-browser flows, CI | Simple SPAs, developer-run tests |

**Interview frame:** "For a team with a React SPA that needs quick developer adoption, I'd start with Cypress. For a checkout flow that must pass on Safari and involves multiple tabs, Playwright is the right call."

### Trade-off 3: E2E vs Unit Test Coverage

**The trap:** Reaching for E2E tests because "they test what users actually do."

**The cost:** E2E tests are 10–100× slower, 5–10× more expensive to write and maintain, and flake more.

\`\`\`
Rule of thumb — if it can be a unit test, it should be:

✓ Business logic → unit test (fast, precise, zero flake risk)
✓ API contract → integration test (real DB, mock external services)
✓ Critical user journey → E2E test (checkout, onboarding, auth)
✗ Every UI interaction → E2E test (this kills CI speed)
\`\`\`

### Trade-off 4: Shift-Left vs Shift-Right Testing

**Shift-Left:** Write tests during development, TDD, pair with devs during design
- Pro: Catches bugs cheapest (before they're shipped)
- Con: Requires developer buy-in, slows initial feature development

**Shift-Right:** Canary releases, feature flags, production monitoring, chaos engineering
- Pro: Catches issues real traffic exposes (edge cases, scale)
- Con: Real users experience bugs; requires good rollback capability

**Best answer:** "Both — shift-left for correctness, shift-right for resilience. For a mature team, I'd prioritize shift-left for new features and invest in observability for existing ones."

### Trade-off 5: 100% Coverage vs Shipping Speed

**The reality:** 100% coverage is a vanity metric if the wrong things are tested.

\`\`\`
Better metrics than code coverage:
  - Defect escape rate (bugs found in production vs QA)
  - Mean time to detect (MTTD) — how fast do you catch regressions?
  - Test suite reliability (% of CI runs that are non-flaky)
  - Business-critical path coverage (are checkout/login/auth fully covered?)
\`\`\`

**Interview frame:** "I'd rather have 60% coverage on the right 60% — all the business logic, edge cases, and integrations — than 95% coverage that's mostly getters/setters and trivial code paths."`,
    quiz: [
      {
        q: 'When should you choose Playwright over Cypress?',
        options: ['When the team is new to E2E testing', 'When you need multi-browser support including Safari', 'When you want the gentlest learning curve', 'When tests are running locally, not in CI'],
        correct: 1,
        explanation: 'Playwright supports Chromium, Firefox, and WebKit (Safari). Cypress has limited multi-browser support. For cross-browser or multi-tab flows, Playwright is the correct choice.',
      },
      {
        q: 'A PM asks why you\'re not aiming for 100% test coverage. What\'s the best response?',
        options: ['100% coverage would slow us down too much', 'Coverage percentage doesn\'t measure what matters — defect escape rate and business-critical path coverage do', 'Our team doesn\'t have the budget for it', '100% coverage is impossible'],
        correct: 1,
        explanation: 'The strongest QA engineers shift from coverage percentage to outcome metrics: how many bugs escaped to production, and is the critical user path fully protected?',
      },
      {
        q: 'What is "shift-right testing"?',
        options: ['Moving unit tests to integration level', 'Testing in production using feature flags, canaries, and monitoring', 'Shifting test writing responsibility to developers', 'Delaying testing until after launch'],
        correct: 1,
        explanation: 'Shift-right testing catches what traditional testing misses — real production traffic, unexpected edge cases at scale, and subtle issues that only appear under real load.',
      },
      {
        q: 'When is a manual test the correct choice over automation?',
        options: ['When you don\'t have time to write the automated test', 'For exploratory testing and usability assessment requiring human judgment', 'Always — automated tests aren\'t reliable', 'When the feature is very complex'],
        correct: 1,
        explanation: 'Exploratory testing, usability assessment, and visual design review require human judgment that automation cannot replicate. Automating these adds maintenance burden without improving confidence.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a test ROI calculator. Given a test\'s write time (hours), maintenance time per month (hours), time saved per run (minutes), and number of runs per month, calculate: total cost over 12 months, total savings over 12 months, ROI percentage, and whether it\'s worth automating (ROI > 0).',
      starterCode: `function calculateTestROI(params) {
  const { writeTimeHours, maintenancePerMonth, timeSavedMinutes, runsPerMonth } = params
  const HOURLY_RATE = 100 // $/hour engineering time

  // TODO: Calculate total cost over 12 months
  // Total cost = writeTime + (maintenancePerMonth * 12)

  // TODO: Calculate total savings over 12 months
  // Each run saves timeSavedMinutes (convert to hours for cost)
  // Total savings = (timeSavedMinutes / 60) * HOURLY_RATE * runsPerMonth * 12

  // TODO: Calculate ROI = (savings - cost) / cost * 100

  // TODO: Determine if worth automating

  return {
    totalCostDollars: 0,
    totalSavingsDollars: 0,
    roiPercent: 0,
    worthAutomating: false,
    summary: ''
  }
}

console.log(calculateTestROI({ writeTimeHours: 4, maintenancePerMonth: 0.5, timeSavedMinutes: 15, runsPerMonth: 60 }))
// Should show positive ROI — 60 runs/month × 15min saved = 900min = 15h × $100 × 12 = $18,000 savings`,
      solution: `function calculateTestROI(params) {
  const { writeTimeHours, maintenancePerMonth, timeSavedMinutes, runsPerMonth } = params
  const HOURLY_RATE = 100

  const totalCostDollars = (writeTimeHours + maintenancePerMonth * 12) * HOURLY_RATE
  const totalSavingsDollars = (timeSavedMinutes / 60) * HOURLY_RATE * runsPerMonth * 12
  const roiPercent = Math.round((totalSavingsDollars - totalCostDollars) / totalCostDollars * 100)
  const worthAutomating = roiPercent > 0

  return {
    totalCostDollars,
    totalSavingsDollars,
    roiPercent,
    worthAutomating,
    summary: worthAutomating
      ? \`Worth automating: saves $\${totalSavingsDollars - totalCostDollars} net over 12 months (\${roiPercent}% ROI)\`
      : \`Not worth automating: costs $\${totalCostDollars - totalSavingsDollars} more than it saves\`
  }
}

console.log(calculateTestROI({ writeTimeHours: 4, maintenancePerMonth: 0.5, timeSavedMinutes: 15, runsPerMonth: 60 }))`,
      hints: [
        'Convert timeSavedMinutes to hours by dividing by 60 before multiplying by HOURLY_RATE',
        'Total cost includes both initial write time and ongoing maintenance (12 months)',
        'ROI = (savings - cost) / cost * 100',
      ],
    },
  },
  {
    id: 'cc-interview-qa-m11', track: 'crash', title: '3am Production Incident — QA Edition',
    subtitle: 'How to diagnose and resolve a critical test failure or escaped bug under pressure.',
    moduleObjective: 'Apply the Incident Response Framework to a production quality failure: diagnose root cause, communicate clearly, and drive a post-mortem that prevents recurrence.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'PhD', xp: 250, duration: 14, module: 11, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Incident Response Framework', definition: 'A structured process: Assess → Hypothesis → Isolate → Fix/Rollback → Post-mortem for diagnosing and resolving production issues.' },
      { term: 'Escaped Defect', definition: 'A bug that passed through the QA process and reached production users — the most expensive type of defect.' },
      { term: 'Post-mortem', definition: 'A blameless analysis conducted after an incident to identify root causes and preventive measures.' },
      { term: 'Rollback', definition: 'Reverting a deployment to a previous known-good version to stop user impact while root cause is investigated.' },
      { term: 'Canary Release', definition: 'Deploying a change to a small percentage of users to detect issues before full rollout.' },
    ],
    content: `## 3am Production Incident — QA Edition

### The scenario

> **2:47am.** PagerDuty wakes you. The on-call engineer confirms: checkout success rate dropped from 98% to 61% 30 minutes after the 2am deployment. Payment provider logs show successful charges but the app isn't recording orders. Support is already fielding angry customers.

This is the most common production QA failure pattern: **everything tested passes, but the integration between two systems broke.**

### Incident Response Framework (IRF) for QA

\`\`\`
Phase 1 — ASSESS (5 min)
  What is the user impact? (% affected, feature, geography)
  What changed recently? (deployment, config, dependency)
  Do we have a rollback option?

Phase 2 — HYPOTHESIS (10 min)
  Form 2–3 hypotheses ordered by likelihood
  What would prove/disprove each hypothesis fastest?

Phase 3 — ISOLATE (15 min)
  Run the fastest test that confirms or rules out each hypothesis
  Don't fix yet — understand first

Phase 4 — FIX OR ROLLBACK (varies)
  If root cause is clear and fix is safe → fix forward
  If root cause unclear or fix is risky → rollback immediately
  Rollback + post-mortem beats a second incident

Phase 5 — POST-MORTEM (24–72h later)
  Blameless — focus on systems, not people
  5 Whys to find root cause
  Action items with owners and deadlines
\`\`\`

### Working the checkout scenario

**Assess:**
- Impact: 37% of checkout attempts failing, all payment methods
- Changed: 2am deployment added a new webhook handler for payment events
- Rollback: Yes, last deployment was 48h ago and was stable

**Hypotheses (ordered by probability):**
1. Webhook handler is throwing an error before recording the order
2. Database migration in the deployment changed the orders table schema
3. Payment provider changed their webhook signature format

**Isolate:**
\`\`\`
Hypothesis 1 → Check application error logs for webhook handler errors
  → CONFIRMED: "TypeError: Cannot read property 'orderId' of undefined"
  → Payment provider sends 'order_id', handler expects 'orderId' (camelCase vs snake_case)

Hypothesis 2 → Not needed (H1 confirmed)
\`\`\`

**Fix forward** (root cause is clear, safe to fix):
\`\`\`javascript
// Before (broken)
async function handlePaymentWebhook(payload) {
  const order = await db.orders.update({ id: payload.orderId }) // undefined

// After (fixed)
async function handlePaymentWebhook(payload) {
  const orderId = payload.order_id || payload.orderId  // handle both
  const order = await db.orders.update({ id: orderId })
\`\`\`

**Post-mortem (the QA angle):**
\`\`\`
Root cause: Webhook handler used camelCase field name; payment provider sends snake_case.
Why did testing miss it? The integration test mocked the webhook payload using our own
format, not the actual provider's format.

5 Whys:
  Why did checkout fail? → Webhook handler threw on undefined orderId
  Why was orderId undefined? → Handler used camelCase, payload used snake_case
  Why was the mismatch not caught? → Test used a fake payload we wrote ourselves
  Why did we write our own fake? → No contract test against the real webhook format
  Why no contract test? → We didn't know to verify provider payload format

Action items:
  1. Add contract test using real webhook payload captured from provider sandbox
  2. Add integration smoke test in staging that fires a real (test) payment
  3. Add field validation at webhook entry point — log and alert on unknown fields
\`\`\`

### Why QA owns post-mortems

Developers fix the bug. QA fixes the **process that let the bug through**. The most valuable question in any post-mortem: "What test would have caught this?" If you can answer that and ensure it gets written, you've turned an incident into a permanent improvement.

### What interviewers want to hear

When asked about a production incident:
1. Don't blame the developer who wrote the code
2. Own the testing gap — what should QA have caught?
3. Explain the process improvement you drove
4. Quantify the before/after if possible`,
    quiz: [
      {
        q: 'In the checkout incident, the bug was a field naming mismatch (camelCase vs snake_case). What type of test would have caught this?',
        options: ['A unit test of the order creation function', 'A contract test using the actual payment provider webhook payload format', 'An E2E test of the checkout flow', 'A load test of the payment API'],
        correct: 1,
        explanation: 'A contract test verifies that the interface between two systems matches both sides\' expectations. Testing with the real provider payload format would have caught the field naming mismatch before production.',
      },
      {
        q: 'At 3am with checkout failing, should you fix forward or rollback first?',
        options: ['Always rollback first to stop user impact', 'Fix forward if root cause is clear and fix is safe; rollback if uncertain', 'Always fix forward — rollbacks confuse the codebase', 'Wait for the full team to be available before deciding'],
        correct: 1,
        explanation: 'The decision depends on clarity and risk. A clear, low-risk fix (rename a field) can go forward immediately. An unclear root cause with complex changes warrants rollback while you investigate properly.',
      },
      {
        q: 'What is the QA engineer\'s primary responsibility in a post-mortem?',
        options: ['Identifying which developer introduced the bug', 'Determining what test would have caught this and ensuring it gets written', 'Documenting the timeline of events', 'Calculating the financial impact'],
        correct: 1,
        explanation: 'Developers fix the bug; QA fixes the process. The post-mortem action item owned by QA is always: what test should exist that would catch this class of bug going forward.',
      },
      {
        q: 'What does "blameless post-mortem" mean in practice?',
        options: ['No one is accountable for the incident', 'Focus analysis on systems and processes, not individual mistakes', 'Post-mortems are optional if the team resolves the incident', 'Only senior engineers participate'],
        correct: 1,
        explanation: 'Blameless means the analysis focuses on why the system allowed the mistake, not who made it. This creates psychological safety for honest root cause analysis and prevents hiding information.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a webhook payload validator. Given an expected schema (object with field names and types) and an incoming payload, return { valid: boolean, errors: string[] }. This is the kind of validation that would have caught the orderId/order_id mismatch in the incident above.',
      starterCode: `function validateWebhookPayload(schema, payload) {
  // schema = { fieldName: 'string' | 'number' | 'boolean', ... }
  // payload = the actual incoming data
  // Return { valid: boolean, errors: string[] }

  const errors = []

  // TODO: Check for each required field in schema
  //   - If field is missing in payload, add error: "Missing required field: X"
  //   - If field exists but wrong type, add error: "Field X: expected string, got number"

  // TODO: Check for unexpected fields in payload (warn, don't fail)
  //   - If payload has fields not in schema, add warning: "Unexpected field: X"

  return { valid: errors.filter(e => !e.startsWith('Warning')).length === 0, errors }
}

// The schema we expected (our camelCase format)
const expectedSchema = {
  orderId: 'string',
  amount: 'number',
  currency: 'string',
  status: 'string'
}

// What the payment provider actually sends (snake_case)
const actualPayload = {
  order_id: 'ord_123',  // snake_case!
  amount: 9999,
  currency: 'usd',
  status: 'succeeded',
  created: 1700000000  // extra field
}

console.log(validateWebhookPayload(expectedSchema, actualPayload))`,
      solution: `function validateWebhookPayload(schema, payload) {
  const errors = []

  // Check required fields
  for (const [field, expectedType] of Object.entries(schema)) {
    if (!(field in payload)) {
      errors.push(\`Missing required field: \${field}\`)
    } else if (typeof payload[field] !== expectedType) {
      errors.push(\`Field \${field}: expected \${expectedType}, got \${typeof payload[field]}\`)
    }
  }

  // Warn on unexpected fields
  for (const field of Object.keys(payload)) {
    if (!(field in schema)) {
      errors.push(\`Warning: Unexpected field: \${field}\`)
    }
  }

  return { valid: errors.filter(e => !e.startsWith('Warning')).length === 0, errors }
}

const expectedSchema = { orderId: 'string', amount: 'number', currency: 'string', status: 'string' }
const actualPayload = { order_id: 'ord_123', amount: 9999, currency: 'usd', status: 'succeeded', created: 1700000000 }

console.log(validateWebhookPayload(expectedSchema, actualPayload))
// { valid: false, errors: ['Missing required field: orderId', 'Warning: Unexpected field: order_id', 'Warning: Unexpected field: created'] }`,
      hints: [
        'Use Object.entries(schema) to iterate over [fieldName, expectedType] pairs',
        'Check if a field exists with: field in payload (not payload[field] — which fails for falsy values)',
        'typeof payload[field] returns "string", "number", "boolean", etc.',
      ],
    },
  },
  {
    id: 'cc-interview-qa-m12', track: 'crash', title: 'Product Thinking for QA Engineers',
    subtitle: 'How great QA engineers think about quality as a product feature, not a gate.',
    moduleObjective: 'Articulate quality as a business investment, make risk-based testing decisions, and communicate testing value in product language.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'PhD', xp: 245, duration: 13, module: 12, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Quality as a Feature', definition: 'The mindset that reliability, performance, and absence of defects are features that users value and pay for — not just overhead.' },
      { term: 'Risk-Based Testing', definition: 'Allocating test effort by the probability and impact of failure — not equal coverage everywhere.' },
      { term: 'Defect Cost Curve', definition: 'The principle that fixing a bug in production costs 10–100× more than catching it in development.' },
      { term: 'Quality Metrics', definition: 'Outcome-based measures: defect escape rate, MTTD, test suite reliability — not vanity metrics like coverage %.' },
      { term: 'Jobs To Be Done', definition: 'A framework focusing on what outcome a user is trying to achieve, not just what they click or do.' },
    ],
    content: `## Product Thinking for QA Engineers

### The old QA mindset vs the new one

\`\`\`
Old: "My job is to find bugs before they ship."
New: "My job is to ensure users get the outcomes they came for."
\`\`\`

The difference matters in interviews. "I find bugs" is a task. "I protect user outcomes" is a product responsibility.

### Quality as a product investment

**The Defect Cost Curve:**
\`\`\`
Stage               Cost to fix   Example
─────────────────────────────────────────────
Requirements phase  $1            Wrong acceptance criteria
Development         $5            Unit test catches it
QA                  $20           Found in test cycle
Production          $100–$500     User reports it; hotfix; support tickets; refunds
\`\`\`

This is why shift-left testing ROI is so high. A QA engineer who catches bugs in requirements review saves 100x compared to finding them in production.

### Risk-Based Testing — where to focus

Not all features carry equal risk. Before writing a single test, ask:

\`\`\`
1. Impact: If this breaks, how many users are affected? What business function stops?
2. Probability: How complex is this code? Does it touch multiple systems?
3. Reversibility: Can we rollback? Do we have feature flags?

Risk = Impact × Probability

High risk + irreversible → exhaustive testing + staged rollout
High risk + reversible   → solid testing + feature flag
Low risk + reversible    → smoke test + monitoring
Low risk + irreversible  → medium testing + rollback plan
\`\`\`

**Example:** An A/B test on button color → low risk, low testing needed. The checkout flow → maximum risk, maximum testing.

### Talking to PMs about quality

**Don't say:** "We need more time to test."
**Do say:** "The checkout flow has 3 untested edge cases. Two of them could cause failed payments. I need 4 hours to cover those. Here's my estimate of the risk if we skip them."

Always translate testing needs into business outcomes:
- "4 hours of testing" → "protecting 100 checkout transactions per hour"
- "Fixing this flaky test" → "saving 2 hours of CI re-runs per day = $10K/year in engineering time"

### The 4 product questions QA should always ask

\`\`\`
1. "What does success look like for the user?"
   → Don't just test the spec — test the user's intended outcome.

2. "What's the worst thing that could go wrong?"
   → Risk-first thinking drives better test prioritization than coverage metrics.

3. "How will we know if this is broken in production?"
   → Every feature needs a health check, not just QA coverage.

4. "What's the minimum test confidence to ship responsibly?"
   → This prevents the false choice between "100% tested" and "untested."
\`\`\`

### When to say "ship it anyway"

Great QA engineers understand when to accept risk:
- The bug affects 0.01% of users and the fix is risky
- The release is a hotfix for a worse existing bug
- The feature is behind a feature flag for 1% of users
- A rollback takes 5 minutes and you have monitoring

Saying "we can ship this if we add a feature flag and monitor metric X" is more valuable than "we can't ship until everything is perfect."`,
    quiz: [
      {
        q: 'According to the Defect Cost Curve, when is the cheapest time to fix a bug?',
        options: ['In QA testing', 'In production', 'During requirements/design phase', 'During code review'],
        correct: 2,
        explanation: 'Fixing a bug during requirements or design costs approximately $1; fixing it in production costs $100–$500. This is the core ROI argument for shift-left testing and requirements review.',
      },
      {
        q: 'A PM asks you to skip testing a low-risk styling change to meet a deadline. What\'s the right response?',
        options: ['Refuse to ship without testing', 'Agree — styling changes are always safe', 'Assess risk: is it truly low risk? If so, a smoke test + feature flag may be sufficient', 'Ask for more time to do full testing'],
        correct: 2,
        explanation: 'Risk-based testing means proportional effort. A truly low-risk change may need only a smoke test. The key is making the risk assessment explicit so the PM can decide with full information.',
      },
      {
        q: 'What\'s the strongest way to explain to a PM why fixing a flaky test is worth prioritizing?',
        options: ['Flaky tests are unprofessional', 'Translate it to cost: "This flaky test costs 2 CI re-runs per day × $50/hour = $10K/year in lost engineering time"', 'Tell them it\'s a QA best practice', 'Show them the test code'],
        correct: 1,
        explanation: 'PMs make decisions based on business impact. Converting flaky test overhead to dollar cost makes the prioritization case compelling and objective.',
      },
      {
        q: 'What does "quality as a feature" mean for a QA engineer\'s role?',
        options: ['Writing more tests to increase coverage', 'Treating reliability and absence of defects as user value delivered, not overhead', 'Adding quality-related features to the product', 'Writing the QA section of the product requirements'],
        correct: 1,
        explanation: 'Quality as a feature means advocating for reliability, performance, and correctness as things users explicitly value and pay for — making the QA role a product investment, not a cost center.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a test priority calculator. Given an array of features, each with { name, userImpact (1-10), bugProbability (1-10), isReversible (boolean) }, calculate a risk score for each and return them sorted highest-risk first. Risk = userImpact × bugProbability × (isReversible ? 0.7 : 1.0).',
      starterCode: `function prioritizeTests(features) {
  // Each feature: { name, userImpact, bugProbability, isReversible }
  // Return features sorted by riskScore descending
  // riskScore = userImpact × bugProbability × (isReversible ? 0.7 : 1.0)

  return features
    .map(f => ({
      ...f,
      riskScore: 0 // TODO: calculate
    }))
    .sort((a, b) => 0) // TODO: sort by riskScore descending
}

const features = [
  { name: 'Button color A/B test',    userImpact: 2,  bugProbability: 1,  isReversible: true },
  { name: 'Checkout payment flow',    userImpact: 10, bugProbability: 7,  isReversible: false },
  { name: 'User profile avatar',      userImpact: 3,  bugProbability: 3,  isReversible: true },
  { name: 'Password reset email',     userImpact: 8,  bugProbability: 5,  isReversible: false },
  { name: 'Analytics event tracking', userImpact: 4,  bugProbability: 4,  isReversible: true },
]

prioritizeTests(features).forEach(f =>
  console.log(\`\${f.name}: risk=\${f.riskScore.toFixed(1)}\`)
)`,
      solution: `function prioritizeTests(features) {
  return features
    .map(f => ({
      ...f,
      riskScore: f.userImpact * f.bugProbability * (f.isReversible ? 0.7 : 1.0)
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
}

const features = [
  { name: 'Button color A/B test',    userImpact: 2,  bugProbability: 1,  isReversible: true },
  { name: 'Checkout payment flow',    userImpact: 10, bugProbability: 7,  isReversible: false },
  { name: 'User profile avatar',      userImpact: 3,  bugProbability: 3,  isReversible: true },
  { name: 'Password reset email',     userImpact: 8,  bugProbability: 5,  isReversible: false },
  { name: 'Analytics event tracking', userImpact: 4,  bugProbability: 4,  isReversible: true },
]

prioritizeTests(features).forEach(f =>
  console.log(\`\${f.name}: risk=\${f.riskScore.toFixed(1)}\`)
)
// Checkout: 70.0, Password reset: 40.0, Analytics: 11.2, Avatar: 6.3, Button: 1.4`,
      hints: [
        'riskScore = userImpact * bugProbability * (isReversible ? 0.7 : 1.0)',
        'Use .map() to add riskScore to each feature object with spread: { ...f, riskScore: ... }',
        'Sort descending: (a, b) => b.riskScore - a.riskScore',
      ],
    },
  },
  {
    id: 'cc-interview-qa-m13', track: 'crash', title: 'Performance Awareness for QA Engineers',
    subtitle: 'Testing performance: suite speed, application benchmarks, and knowing when performance is a quality issue.',
    moduleObjective: 'Optimize test suite performance, write performance assertions, and articulate the QA role in application performance monitoring.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'PhD', xp: 250, duration: 14, module: 13, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Test Suite Performance', definition: 'How fast your test suite runs — directly impacts CI feedback loop speed and developer productivity.' },
      { term: 'Parallel Test Execution', definition: 'Running multiple test files or suites simultaneously to reduce total wall-clock time.' },
      { term: 'Performance Assertion', definition: 'A test that fails if a response time or resource usage exceeds a defined threshold.' },
      { term: 'Load Testing', definition: 'Simulating concurrent users to find performance degradation and breaking points under realistic traffic.' },
      { term: 'Performance Budget', definition: 'A threshold for performance metrics (e.g., LCP < 2.5s, API p99 < 200ms) that the team commits to maintaining.' },
    ],
    content: `## Performance Awareness for QA Engineers

### Two types of performance QA engineers own

1. **Test suite performance** — how fast your tests run
2. **Application performance testing** — how fast your app runs

Both matter. A test suite that takes 45 minutes to run is a quality problem.

### Test Suite Performance

**The benchmark:** A unit test suite for a mid-size app should run in under 30 seconds. If it doesn't, it won't be run often.

\`\`\`
Common causes of slow test suites:

1. Too many E2E tests (fix: convert to unit/integration where possible)
2. No test parallelism (fix: enable --maxWorkers in Jest, parallel mode in Playwright)
3. Database not reset efficiently (fix: use transactions that rollback, not DELETE + INSERT)
4. Slow test doubles — real HTTP calls in unit tests (fix: mock external services)
5. No test caching — rebuilding the app on every test run (fix: cached builds)
\`\`\`

**Jest performance tuning:**
\`\`\`javascript
// jest.config.js
module.exports = {
  maxWorkers: '50%',          // Use half available CPUs
  testTimeout: 5000,          // Fail fast — 5s max per test
  coverageThreshold: { global: { lines: 80 } },
  // Bail on first failure in CI (don't waste time on known-broken suite)
  bail: process.env.CI ? 1 : 0,
}
\`\`\`

### Application Performance Testing

**The performance testing pyramid:**
\`\`\`
         /\\
        /Load\\           ← Peak traffic simulation (k6, Artillery)
       /────────\\
      / Stress   \\       ← Find breaking point
     /────────────\\
    / Soak         \\     ← Sustained load (memory leaks, connection pool)
   /────────────────\\
  / Smoke Performance\\ ← API p95 assertions in CI (fast, always runs)
 /────────────────────\\
\`\`\`

**Smoke performance assertion in CI:**
\`\`\`javascript
// In your integration tests — run this on every PR
test('checkout API responds under 500ms', async () => {
  const start = Date.now()
  await fetch('/api/checkout', { method: 'POST', body: JSON.stringify(testOrder) })
  const duration = Date.now() - start
  expect(duration).toBeLessThan(500) // Performance budget: 500ms p95
})
\`\`\`

### What interviewers mean by "performance awareness"

They want to know if you think about performance proactively:
- "When I add a new E2E test, I check if it duplicates coverage we could get cheaper with a unit test"
- "I track CI runtime trending — if it grows 20% in a sprint, I investigate"
- "For our checkout feature I added a performance assertion that fails CI if the endpoint exceeds 500ms"

**The standout answer:** Show you've moved from reactive ("I ran a load test before launch") to proactive ("I have performance budgets in CI that alert before we ship a regression").`,
    quiz: [
      {
        q: 'Your Jest test suite went from 8 minutes to 18 minutes over 3 sprints. What\'s the first thing to check?',
        options: ['Buy faster CI machines', 'Check if parallelism is configured and if new slow E2E tests were added', 'Delete redundant tests', 'Increase test timeout values'],
        correct: 1,
        explanation: 'The first step is diagnosis: is parallelism enabled? (--maxWorkers). Did new slow E2E tests get added? Are any tests making real HTTP calls? These are the common causes of gradual suite slowdown.',
      },
      {
        q: 'What is a "performance assertion" in the context of integration tests?',
        options: ['A test that checks performance configuration settings', 'A test that fails if response time or resource usage exceeds a defined threshold', 'A performance review of the test suite code quality', 'A manual performance check done before launch'],
        correct: 1,
        explanation: 'A performance assertion is code like `expect(duration).toBeLessThan(500)` — it makes your CI pipeline catch performance regressions automatically, the same way a unit test catches logic regressions.',
      },
      {
        q: 'What is "soak testing" and what does it catch?',
        options: ['Testing under very high load to find the breaking point', 'Sustained load testing over hours to find memory leaks and connection pool exhaustion', 'Testing the database under write-heavy loads', 'Running tests in a water-resistant environment'],
        correct: 1,
        explanation: 'Soak testing runs moderate load over a long period (hours or days) to expose memory leaks, connection pool exhaustion, and slow degradation that only appears over time.',
      },
      {
        q: 'What does "performance budget" mean in a QA context?',
        options: ['The budget allocated for performance testing tools', 'A committed threshold (e.g., API p99 < 200ms) that CI enforces — failing if exceeded', 'An estimate of how long performance testing will take', 'The maximum test suite size allowed'],
        correct: 1,
        explanation: 'A performance budget is a contract the team makes with themselves: "this metric must stay under this threshold." CI enforces it automatically, preventing performance regressions from shipping unnoticed.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a test suite performance analyzer. Given an array of test results with { name, durationMs, type } where type is "unit", "integration", or "e2e", return: totalDuration, slowestTests (top 5), averageByType, and a recommendation string if total duration exceeds 60 seconds.',
      starterCode: `function analyzeTestSuite(testResults) {
  // testResults: [{ name, durationMs, type }]
  // Return: { totalDuration, slowestTests, averageByType, recommendation }

  const totalDuration = 0 // TODO: sum all durationMs

  const slowestTests = [] // TODO: top 5 by durationMs descending

  const averageByType = {} // TODO: { unit: avg, integration: avg, e2e: avg }

  const recommendation = '' // TODO: if totalDuration > 60000, suggest top culprit

  return { totalDuration, slowestTests, averageByType, recommendation }
}

const results = [
  { name: 'Login unit test', durationMs: 12, type: 'unit' },
  { name: 'Checkout E2E', durationMs: 15000, type: 'e2e' },
  { name: 'User API integration', durationMs: 800, type: 'integration' },
  { name: 'Email unit test', durationMs: 8, type: 'unit' },
  { name: 'Payment flow E2E', durationMs: 22000, type: 'e2e' },
  { name: 'Auth integration', durationMs: 1200, type: 'integration' },
]

console.log(analyzeTestSuite(results))`,
      solution: `function analyzeTestSuite(testResults) {
  const totalDuration = testResults.reduce((sum, t) => sum + t.durationMs, 0)

  const slowestTests = [...testResults]
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, 5)

  const byType = {}
  for (const t of testResults) {
    if (!byType[t.type]) byType[t.type] = []
    byType[t.type].push(t.durationMs)
  }
  const averageByType = {}
  for (const [type, durations] of Object.entries(byType)) {
    averageByType[type] = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
  }

  let recommendation = ''
  if (totalDuration > 60000) {
    const topCulprit = slowestTests[0]
    recommendation = \`Suite too slow (\${(totalDuration/1000).toFixed(1)}s). Investigate "\${topCulprit.name}" (\${(topCulprit.durationMs/1000).toFixed(1)}s). Consider converting slow E2E tests to integration tests.\`
  }

  return { totalDuration, slowestTests, averageByType, recommendation }
}

const results = [
  { name: 'Login unit test', durationMs: 12, type: 'unit' },
  { name: 'Checkout E2E', durationMs: 15000, type: 'e2e' },
  { name: 'User API integration', durationMs: 800, type: 'integration' },
  { name: 'Email unit test', durationMs: 8, type: 'unit' },
  { name: 'Payment flow E2E', durationMs: 22000, type: 'e2e' },
  { name: 'Auth integration', durationMs: 1200, type: 'integration' },
]

console.log(analyzeTestSuite(results))`,
      hints: [
        'Use reduce to sum totalDuration: testResults.reduce((sum, t) => sum + t.durationMs, 0)',
        'Sort a copy of the array with [...testResults].sort(...) to avoid mutating the input',
        'Group by type with a loop: if (!byType[t.type]) byType[t.type] = []; byType[t.type].push(t.durationMs)',
      ],
    },
  },
  {
    id: 'cc-interview-qa-m14', track: 'crash', title: 'Security Instincts for QA Engineers',
    subtitle: 'How QA engineers spot security vulnerabilities through testing — before attackers do.',
    moduleObjective: 'Apply security testing techniques to find authentication bypasses, injection flaws, and broken access control through the lens of a QA engineer.',
    courseObjective: CC_QA_OBJ, crashId: 'cc-interview-qa', crashTitle: 'QA Interview Prep',
    level: 'PhD', xp: 255, duration: 14, module: 14, certArea: 'QA Interview Prep',
    keyTerms: [
      { term: 'Security Testing', definition: 'Testing that actively tries to bypass authentication, inject malicious input, and access unauthorized resources.' },
      { term: 'IDOR', definition: 'Insecure Direct Object Reference — a vulnerability where changing an ID in a URL gives access to another user\'s data.' },
      { term: 'Input Validation Testing', definition: 'Testing that the application correctly rejects, escapes, or sanitizes unexpected or malicious input.' },
      { term: 'Authentication Bypass', definition: 'A vulnerability where an attacker can access protected resources without valid credentials.' },
      { term: 'Boundary Testing', definition: 'Testing at the edges of valid input ranges — a security and correctness technique combined.' },
    ],
    content: `## Security Instincts for QA Engineers

### Why security is a QA responsibility

Security vulnerabilities are bugs. OWASP A01 (Broken Access Control) is the #1 web vulnerability — and it's caused by missing tests, not missing features. Every QA engineer should have a security testing mindset.

### The 5 security test categories QA should cover

\`\`\`
1. Authentication tests     — Can I access this without logging in?
2. Authorization tests      — Can I access data that belongs to another user?
3. Input validation tests   — What happens with malicious input?
4. Session management       — Can I reuse an expired token?
5. Error message leakage    — Do errors reveal internal structure?
\`\`\`

### Test 1: Authentication bypass

\`\`\`javascript
// Test: protected endpoint returns 401 without auth token
test('GET /api/orders requires authentication', async () => {
  const res = await fetch('/api/orders')  // no Authorization header
  expect(res.status).toBe(401)
})

// Test: endpoint returns 401 with invalid token
test('GET /api/orders rejects invalid token', async () => {
  const res = await fetch('/api/orders', {
    headers: { Authorization: 'Bearer fake-token-12345' }
  })
  expect(res.status).toBe(401)
})
\`\`\`

### Test 2: Insecure Direct Object Reference (IDOR)

This is the most common access control bug. Always test it.

\`\`\`javascript
// Setup: User A owns order #100, User B owns order #200
// Test: User B cannot read User A's order
test('cannot read another user\'s order (IDOR)', async () => {
  const userBToken = await loginAs('user-b@example.com')
  const res = await fetch('/api/orders/100', {  // User A's order
    headers: { Authorization: \`Bearer \${userBToken}\` }
  })
  expect(res.status).toBe(403)  // Not 200, not 404 (which would leak existence)
})

// Test: User B cannot modify User A's order
test('cannot modify another user\'s order (IDOR write)', async () => {
  const userBToken = await loginAs('user-b@example.com')
  const res = await fetch('/api/orders/100', {
    method: 'PATCH',
    headers: { Authorization: \`Bearer \${userBToken}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled' })
  })
  expect(res.status).toBe(403)
})
\`\`\`

### Test 3: Input validation — XSS and injection

\`\`\`javascript
const maliciousInputs = [
  '<script>alert("xss")</script>',
  '"; DROP TABLE users; --',
  '../../../etc/passwd',
  '\${7*7}',  // template injection
  'a'.repeat(10000),  // buffer overflow
]

test.each(maliciousInputs)('user name field rejects malicious input: %s', async (input) => {
  const res = await fetch('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify({ name: input })
  })
  // Should either reject (400) or sanitize — never store raw
  if (res.ok) {
    const saved = await res.json()
    // If accepted, verify it was sanitized
    expect(saved.name).not.toContain('<script>')
    expect(saved.name).not.toContain('DROP TABLE')
  } else {
    expect(res.status).toBe(400)
  }
})
\`\`\`

### Test 4: Error message leakage

\`\`\`javascript
// Bad: error reveals internal structure
// { error: "PG::UndefinedTable: ERROR: relation 'users' does not exist" }
// Good: generic error only
// { error: "An unexpected error occurred" }

test('errors do not leak database or stack information', async () => {
  const res = await fetch('/api/users/999999')  // non-existent ID
  const body = await res.json()

  expect(JSON.stringify(body)).not.toMatch(/postgres|pg::|stack:|at Object|\.ts:\d/)
  expect(JSON.stringify(body)).not.toMatch(/SELECT|FROM|WHERE|INSERT/)
})
\`\`\`

### Security regression tests — add these after every incident

Every security bug you fix should generate a regression test. If a user found they could access admin routes without being an admin, add:

\`\`\`javascript
test('non-admin cannot access admin routes (regression: CVE-2024-001)', async () => {
  const userToken = await loginAs('regular-user@example.com')
  const res = await fetch('/api/admin/users', {
    headers: { Authorization: \`Bearer \${userToken}\` }
  })
  expect(res.status).toBe(403)
})
\`\`\`

### The security test mindset for interviews

When asked "how do you approach security in your testing?", show:
1. You have a systematic checklist (auth, IDOR, input, sessions, errors)
2. You test from the perspective of a malicious user, not a cooperative one
3. You add regression tests after every security fix
4. You catch security issues in the QA cycle, not after a breach`,
    quiz: [
      {
        q: 'What is an IDOR vulnerability and how does a QA engineer test for it?',
        options: ['An injection attack tested with SQL payloads', 'Accessing another user\'s resource by changing an ID — tested by logging in as User B and requesting User A\'s resource ID', 'An incorrect database record found through boundary testing', 'A redirect vulnerability tested with URL manipulation'],
        correct: 1,
        explanation: 'IDOR (Insecure Direct Object Reference) is the most common access control bug. Test it by authenticating as one user and requesting resource IDs that belong to another user. Expect 403, not 200.',
      },
      {
        q: 'Why should a non-existent user\'s API response return 403 instead of 404?',
        options: ['403 is more user-friendly', '404 leaks that the resource exists (or doesn\'t), which can be exploited for user enumeration', '403 is the standard for all missing resources', 'There is no practical difference'],
        correct: 1,
        explanation: 'Returning 404 for "you don\'t have access to this" leaks the existence of the resource. An attacker enumerating user IDs can distinguish between "user exists but you can\'t access them" (403) and "user doesn\'t exist" (404). Always 403.',
      },
      {
        q: 'What should you do after finding and fixing a security vulnerability?',
        options: ['Document it in the changelog', 'Add a regression test that verifies the specific vulnerability is fixed — so it can never silently re-appear', 'Increase the overall test coverage percentage', 'Notify the security team only'],
        correct: 1,
        explanation: 'Security regression tests are the most important type of security test — they prevent a fixed vulnerability from quietly reappearing in a future refactor. Always write the test after the fix.',
      },
      {
        q: 'You find that your API returns detailed database error messages in production. What severity is this?',
        options: ['Low — just cosmetic', 'Medium — confusing but not dangerous', 'High — reveals internal structure, table names, and query patterns that help attackers craft targeted attacks', 'Critical — causes immediate data breach'],
        correct: 2,
        explanation: 'Verbose error messages revealing database structure (table names, column names, SQL queries) are a significant information disclosure vulnerability. They help attackers craft more targeted SQL injection and enumeration attacks. This is OWASP A05: Security Misconfiguration.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write an IDOR test helper. Given a list of resources (each with ownerId and resourceId) and a function getResource(resourceId, requestingUserId) that returns a resource or throws, write a test that verifies: the owner CAN access their own resources, and other users CANNOT (should throw or return null).',
      starterCode: `// Simulated resource store
const resources = [
  { resourceId: 'res-001', ownerId: 'user-alice', data: { secret: 'alice_data' } },
  { resourceId: 'res-002', ownerId: 'user-alice', data: { secret: 'more_alice_data' } },
  { resourceId: 'res-003', ownerId: 'user-bob',   data: { secret: 'bob_data' } },
]

// This is the function under test (simulates your API)
function getResource(resourceId, requestingUserId) {
  const resource = resources.find(r => r.resourceId === resourceId)
  if (!resource) throw new Error('Not found')
  // BUG: Missing authorization check! Returns resource to anyone.
  // Fix: if (resource.ownerId !== requestingUserId) throw new Error('Forbidden')
  return resource.data
}

function runIdorTests(getResourceFn, testResources) {
  let passed = 0, failed = 0

  // TODO: For each resource, verify:
  // 1. The owner CAN access it (should NOT throw)
  // 2. A different user CANNOT access it (SHOULD throw)

  // Test users to try as the "other user"
  const allUserIds = [...new Set(testResources.map(r => r.ownerId))]

  for (const resource of testResources) {
    // Test owner access
    // Test non-owner access for each other user
  }

  console.log(\`IDOR Test Results: \${passed} passed, \${failed} failed\`)
  return failed === 0
}

console.log('Running IDOR tests on vulnerable function:')
runIdorTests(getResource, resources)`,
      solution: `const resources = [
  { resourceId: 'res-001', ownerId: 'user-alice', data: { secret: 'alice_data' } },
  { resourceId: 'res-002', ownerId: 'user-alice', data: { secret: 'more_alice_data' } },
  { resourceId: 'res-003', ownerId: 'user-bob',   data: { secret: 'bob_data' } },
]

function getResource(resourceId, requestingUserId) {
  const resource = resources.find(r => r.resourceId === resourceId)
  if (!resource) throw new Error('Not found')
  // BUG: Missing authorization check
  return resource.data
}

function runIdorTests(getResourceFn, testResources) {
  let passed = 0, failed = 0
  const allUserIds = [...new Set(testResources.map(r => r.ownerId))]

  for (const resource of testResources) {
    // Test 1: owner can access
    try {
      getResourceFn(resource.resourceId, resource.ownerId)
      console.log(\`✓ Owner \${resource.ownerId} can access \${resource.resourceId}\`)
      passed++
    } catch (e) {
      console.log(\`✗ FAIL: Owner \${resource.ownerId} cannot access own resource \${resource.resourceId}\`)
      failed++
    }

    // Test 2: non-owners cannot access
    for (const userId of allUserIds) {
      if (userId === resource.ownerId) continue
      try {
        getResourceFn(resource.resourceId, userId)
        console.log(\`✗ IDOR VULNERABILITY: \${userId} accessed \${resource.resourceId} owned by \${resource.ownerId}\`)
        failed++
      } catch (e) {
        console.log(\`✓ \${userId} correctly denied access to \${resource.resourceId}\`)
        passed++
      }
    }
  }

  console.log(\`\\nIDOR Test Results: \${passed} passed, \${failed} failed\`)
  return failed === 0
}

console.log('Running IDOR tests on vulnerable function:')
runIdorTests(getResource, resources)`,
      hints: [
        'Owner access: try { getResourceFn(id, ownerId); passed++ } catch { failed++ }',
        'Non-owner access: try { getResourceFn(id, otherId); failed++ } catch { passed++ } — success means IDOR found',
        'Get all unique user IDs with: [...new Set(resources.map(r => r.ownerId))]',
      ],
    },
  },
]
