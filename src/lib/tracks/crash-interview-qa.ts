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
  // - Call condition() every `interval` ms
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
]
