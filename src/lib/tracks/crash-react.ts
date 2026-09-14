import type { Course } from '../courses'

const CC_REACT_OBJ = 'Build real React applications — components, hooks, state, effects, and performance patterns used in production Next.js codebases.'

export const crashReactCourses: Course[] = [
  {
    id: 'cc-react-m01', track: 'crash', title: 'React Components & JSX',
    subtitle: 'Build composable UI with function components and JSX syntax.',
    moduleObjective: 'Build function components with JSX, props, and conditional rendering.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Component', definition: 'A function that returns JSX. Components are the building blocks of React UIs — composable and reusable.' },
      { term: 'JSX', definition: 'JavaScript XML — HTML-like syntax in JavaScript files. Compiled to React.createElement() calls.' },
      { term: 'Props', definition: 'Data passed to a component from its parent. Read-only — components do not modify their own props.' },
      { term: 'Conditional Rendering', definition: 'Using && or ternary ?: to render different JSX based on conditions.' },
      { term: 'Fragment', definition: '<> ... </> — wraps multiple elements without adding a DOM node.' },
    ],
    content: `## React Components & JSX

React is a library for building user interfaces from composable components. Every UI element — button, card, nav, page — is a component.

### Function Component

\`\`\`tsx
interface GreetingProps {
  name: string
  role?: 'admin' | 'student'
}

export function Greeting({ name, role = 'student' }: GreetingProps) {
  return (
    <div className="greeting">
      <h2>Hello, {name}</h2>
      <p>Role: {role}</p>
    </div>
  )
}

// Usage
<Greeting name="Jordan" role="admin" />
\`\`\`

### JSX Rules

\`\`\`tsx
// 1. Only one root element — wrap with div or Fragment
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
)

// 2. className, not class
<div className="card">

// 3. Self-close empty elements
<img src="/logo.svg" alt="Logo" />
<br />
<input type="text" />

// 4. JavaScript expressions in {}
<h1>Score: {score * 2}</h1>
<img src={\`/avatars/\${userId}.jpg\`} alt="Avatar" />
\`\`\`

### Conditional Rendering

\`\`\`tsx
function StatusBadge({ active }: { active: boolean }) {
  return (
    <div>
      {active && <span className="badge green">Active</span>}

      {active
        ? <span className="badge green">Active</span>
        : <span className="badge grey">Inactive</span>
      }
    </div>
  )
}
\`\`\`

### Lists with .map()

\`\`\`tsx
interface Course { id: string; title: string; xp: number }

function CourseList({ courses }: { courses: Course[] }) {
  return (
    <ul>
      {courses.map(course => (
        <li key={course.id}>
          {course.title} — {course.xp}xp
        </li>
      ))}
    </ul>
  )
}
\`\`\`

The key prop is required when rendering lists — React uses it to track which items changed.`,
    quiz: [
      { q: 'What must every React component return?', options: ['A string', 'JSX or null', 'An array', 'An object'], correct: 1, explanation: 'React components must return JSX (which compiles to React.createElement calls) or null to render nothing.' },
      { q: 'Why is the key prop required on list items?', options: ['It adds CSS classes', 'React uses it to track which items changed — enables efficient updates', 'Required by TypeScript', 'It is the item id'], correct: 1, explanation: 'key helps React identify which items were added, changed, or removed in a list — enabling efficient DOM reconciliation.' },
      { q: 'What is the JSX attribute for CSS class?', options: ['class', 'className', 'cssClass', 'style'], correct: 1, explanation: 'className — not class — because class is a reserved keyword in JavaScript. JSX compiles to JS.' },
      { q: 'What does Fragment (<>) do?', options: ['Adds a div wrapper', 'Groups elements without adding a DOM node', 'Required for conditional rendering', 'Same as a div'], correct: 1, explanation: 'Fragment wraps multiple elements without inserting an extra DOM element. Keeps the markup clean.' },
    ],
  },
  {
    id: 'cc-react-m02', track: 'crash', title: 'useState & State Management',
    subtitle: 'Add interactivity to components with local state using the useState hook.',
    moduleObjective: 'Manage component state with useState including objects, arrays, and state update patterns.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Basic',
    xp: 150, duration: 10, module: 2, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'useState', definition: 'const [state, setState] = useState(initial) — returns current state and a setter function.' },
      { term: 'Functional update', definition: 'setState(prev => prev + 1) — use when new state depends on previous state.' },
      { term: 'State is immutable', definition: 'Never mutate state directly — always pass a new value to the setter. Mutation does not trigger re-render.' },
      { term: 'Re-render', definition: 'When state changes, React re-renders the component and its children. React batches updates for performance.' },
      { term: 'Controlled component', definition: 'A form input whose value is controlled by React state. value={state} onChange={setter}.' },
    ],
    content: `## useState & State Management

useState adds local state to function components. Every time state changes, the component re-renders.

### Basic useState

\`\`\`tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
\`\`\`

### Functional Updates (When State Depends on Previous)

\`\`\`tsx
// WRONG — may use stale value in async situations
setCount(count + 1)

// CORRECT — always uses latest value
setCount(prev => prev + 1)

// When multiple updates in a row
function addThree() {
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  // count goes up by 3
}
\`\`\`

### State with Objects

\`\`\`tsx
interface FormState {
  name: string
  email: string
  message: string
}

function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', message: ''
  })

  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <form>
      <input value={form.name} onChange={handleChange('name')} placeholder="Name" />
      <input value={form.email} onChange={handleChange('email')} placeholder="Email" />
    </form>
  )
}
\`\`\`

### State with Arrays

\`\`\`tsx
const [items, setItems] = useState<string[]>([])

// Add
setItems(prev => [...prev, newItem])

// Remove
setItems(prev => prev.filter(item => item !== targetItem))

// Update
setItems(prev => prev.map(item => item === old ? updated : item))
\`\`\`

Never push to an array in state directly — create a new array.`,
    quiz: [
      { q: 'When should you use the functional update pattern setState(prev => ...)?', options: ['Always', 'When the new state depends on the previous state', 'Only for numbers', 'When using arrays'], correct: 1, explanation: 'Functional updates ensure you always operate on the latest state value — important when updates happen in quick succession or async contexts.' },
      { q: 'What happens when you call setState?', options: ['State changes instantly in place', 'React schedules a re-render with the new state value', 'The function runs immediately', 'State is stored in localStorage'], correct: 1, explanation: 'setState schedules a re-render. React batches updates and re-renders the component with the new state.' },
      { q: 'How do you add an item to an array in state?', options: ['items.push(newItem)', 'setItems([...items, newItem])', 'items[items.length] = newItem', 'setItems(items.concat())'], correct: 1, explanation: 'Never mutate state directly. Create a new array with the spread operator: [...prev, newItem].' },
      { q: 'What is a controlled component?', options: ['A component that controls others', 'A form input with value from state and onChange calling the setter', 'A component with no props', 'A component using context'], correct: 1, explanation: 'A controlled input has value={state} and onChange={setter}. React state is the single source of truth for the input value.' },
    ],
  },
  {
    id: 'cc-react-m03', track: 'crash', title: 'useEffect & Side Effects',
    subtitle: 'Sync React components with external systems, data, and browser APIs using useEffect.',
    moduleObjective: 'Use useEffect to fetch data, set up subscriptions, and clean up side effects correctly.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'useEffect', definition: 'Runs after render to sync with external systems: fetch, subscriptions, timers, DOM manipulation.' },
      { term: 'Dependency array', definition: 'Second argument to useEffect. [] = run once. [dep] = run when dep changes. omitted = run every render.' },
      { term: 'Cleanup function', definition: 'The function returned from useEffect. Runs before the next effect and on unmount. Cancels subscriptions and timers.' },
      { term: 'Race condition', definition: 'When a fast response from a new fetch overwrites a slow response from an old fetch. Fixed with cleanup abort.' },
      { term: 'Strict Mode', definition: 'React runs effects twice in development to surface cleanup issues. Production only runs once.' },
    ],
    content: `## useEffect & Side Effects

useEffect synchronizes components with external systems — data fetching, subscriptions, timers, and DOM APIs.

### Basic useEffect

\`\`\`tsx
import { useState, useEffect } from 'react'

function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title
  }, [title])  // runs when title changes

  return null
}
\`\`\`

### Data Fetching Pattern

\`\`\`tsx
function CourseDetail({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const res = await fetch(\`/api/courses/\${courseId}\`)
        const data = await res.json()
        if (!cancelled) {
          setCourse(data)
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }  // cleanup — prevent stale state
  }, [courseId])

  if (loading) return <Spinner />
  if (error) return <Error message={error} />
  if (!course) return null
  return <CourseView course={course} />
}
\`\`\`

### Dependency Array Rules

\`\`\`tsx
// [] — run once on mount, cleanup on unmount
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])

// [dep] — run when dep changes
useEffect(() => {
  fetchUser(userId)
}, [userId])

// No array — run on every render (rarely needed)
useEffect(() => {
  console.log('rendered')
})
\`\`\`

### Subscription Cleanup

\`\`\`tsx
useEffect(() => {
  const subscription = store.subscribe(handler)
  return () => subscription.unsubscribe()
}, [])

useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
\`\`\``,
    quiz: [
      { q: 'What does an empty dependency array [] mean?', options: ['Run on every render', 'Run once on mount and cleanup on unmount', 'Never run', 'Run when props change'], correct: 1, explanation: '[] tells React: run this effect once after the first render, and run the cleanup when the component unmounts.' },
      { q: 'Why do you return a cleanup function from useEffect?', options: ['Required by React', 'To cancel subscriptions, timers, and async operations before the next effect or unmount', 'To reset state', 'For TypeScript compatibility'], correct: 1, explanation: 'The cleanup function runs before the next effect run and on unmount — preventing memory leaks and stale state from old effects.' },
      { q: 'How do you prevent a race condition in data fetching?', options: ['Use async/await always', 'Track a cancelled flag in the effect and check it before setting state', 'Fetch in a timeout', 'Use Redux'], correct: 1, explanation: 'A cancelled flag (set in cleanup) prevents setting state after a component has unmounted or the dep has changed to a new value.' },
      { q: 'What happens if you omit the dependency array?', options: ['Effect never runs', 'Effect runs after every render', 'Effect runs once', 'TypeScript error'], correct: 1, explanation: 'Omitting the array means no dependency tracking — the effect runs after every render. This is rarely correct.' },
    ],
  },
  {
    id: 'cc-react-m04', track: 'crash', title: 'useRef, useMemo & useCallback',
    subtitle: 'Access DOM elements and optimize performance with React\'s memoization hooks.',
    moduleObjective: 'Use useRef for DOM access and useMemo/useCallback to prevent unnecessary re-renders.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'useRef', definition: 'Returns a mutable ref object. Two uses: 1) accessing DOM elements, 2) storing values that do not trigger re-render.' },
      { term: 'useMemo', definition: 'useMemo(() => compute(), [deps]) — memoizes an expensive computation. Recomputes only when deps change.' },
      { term: 'useCallback', definition: 'useCallback(fn, [deps]) — memoizes a function. Returns the same function reference until deps change.' },
      { term: 'Referential equality', definition: 'In JavaScript, objects and functions created on every render are different references even if equal in value. This breaks React.memo comparisons.' },
      { term: 'React.memo', definition: 'React.memo(Component) — wraps a component to skip re-render if props have not changed (by reference).' },
    ],
    content: `## useRef, useMemo & useCallback

These hooks give you fine-grained control over DOM access and re-render behavior.

### useRef — DOM Access

\`\`\`tsx
import { useRef, useEffect } from 'react'

function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} type="text" placeholder="Auto-focused" />
}
\`\`\`

### useRef — Stable Values (No Re-render)

\`\`\`tsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function start() {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  )
}
\`\`\`

### useMemo — Expensive Computations

\`\`\`tsx
function CourseStats({ courses }: { courses: Course[] }) {
  // Recomputes only when courses changes
  const stats = useMemo(() => ({
    total: courses.length,
    totalXp: courses.reduce((sum, c) => sum + c.xp, 0),
    byTrack: courses.reduce((acc, c) => {
      acc[c.track] = (acc[c.track] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }), [courses])

  return <StatsDisplay stats={stats} />
}
\`\`\`

### useCallback — Stable Function References

\`\`\`tsx
function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  // Without useCallback: new function on every render, child re-renders unnecessarily
  const handleSearch = useCallback(() => {
    onSearch(query)
  }, [query, onSearch])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchButton onClick={handleSearch} />
    </div>
  )
}

const SearchButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>Search</button>
))
\`\`\``,
    quiz: [
      { q: 'When should you use useRef vs useState?', options: ['They are interchangeable', 'useRef for DOM access and values that should not trigger re-renders; useState for values that should update the UI', 'useState for DOM, useRef for state', 'useRef is newer, always prefer it'], correct: 1, explanation: 'Changing a ref does not trigger re-render. Use refs for DOM elements, timers, previous values. Use state for anything that should update the UI.' },
      { q: 'What does useMemo do?', options: ['Memoizes a component', 'Memoizes the result of a computation — only recomputes when deps change', 'Prevents all re-renders', 'Caches API responses'], correct: 1, explanation: 'useMemo caches the return value of a function and only recomputes when specified dependencies change.' },
      { q: 'What does useCallback do?', options: ['Runs a callback after render', 'Memoizes a function — returns the same reference until deps change', 'Replaces useEffect', 'Wraps async functions'], correct: 1, explanation: 'useCallback returns a memoized function. The same reference is returned until dependencies change — prevents child re-renders caused by new function references.' },
      { q: 'What is React.memo?', options: ['A data store', 'A HOC that skips re-render if props have not changed by reference', 'Same as useMemo', 'Required for hooks'], correct: 1, explanation: 'React.memo wraps a component and skips re-rendering if props have not changed. Shallow comparison by reference — use with stable references (useCallback, useMemo).' },
    ],
  },
  {
    id: 'cc-react-m05', track: 'crash', title: 'Context & Prop Drilling',
    subtitle: 'Share state across deep component trees without prop drilling using React Context.',
    moduleObjective: 'Create and consume React Context to share state across multiple levels of components.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Masters',
    xp: 175, duration: 11, module: 5, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Context', definition: 'React mechanism for passing data through the component tree without prop drilling.' },
      { term: 'createContext', definition: 'Creates a Context object with a default value. Provides the type for useContext.' },
      { term: 'Provider', definition: 'Context.Provider wraps the subtree that needs access. value prop sets the current context value.' },
      { term: 'useContext', definition: 'Hook that reads the current value from the nearest Provider above in the tree.' },
      { term: 'Prop drilling', definition: 'Passing props through multiple intermediate components that do not use them. Context eliminates this pattern.' },
    ],
    content: `## Context & Prop Drilling

Context lets you share state across a component tree without passing props manually through every level.

### Creating Context

\`\`\`tsx
import { createContext, useContext, useState } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
\`\`\`

### Consuming Context

\`\`\`tsx
// Deep in the tree — no prop drilling needed
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  )
}
\`\`\`

### Course Progress Context Pattern

\`\`\`tsx
interface ProgressContextValue {
  completed: Set<string>
  markComplete: (courseId: string) => void
  isComplete: (courseId: string) => boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const markComplete = (id: string) =>
    setCompleted(prev => new Set([...prev, id]))

  const isComplete = (id: string) => completed.has(id)

  return (
    <ProgressContext.Provider value={{ completed, markComplete, isComplete }}>
      {children}
    </ProgressContext.Provider>
  )
}
\`\`\`

### When to Use Context vs Props

Use context for: theme, current user, language/locale, global notifications.
Use props for: component-specific data, data that only flows one level down.`,
    quiz: [
      { q: 'What problem does React Context solve?', options: ['State persistence', 'Eliminates prop drilling — sharing state without passing props through every level', 'API calls', 'TypeScript types'], correct: 1, explanation: 'Context lets any descendant component consume shared state without intermediate components having to pass it as props.' },
      { q: 'What does Context.Provider do?', options: ['Creates the context', 'Wraps the subtree and sets the current context value for all consumers inside', 'Optimizes performance', 'Required for context to work at all'], correct: 1, explanation: 'Provider wraps the tree and supplies the value to all useContext calls inside it.' },
      { q: 'What does useContext return?', options: ['A setter function', 'The current value from the nearest Provider above in the tree', 'The Provider component', 'The context default value always'], correct: 1, explanation: 'useContext returns the current context value from the nearest matching Provider above in the component tree.' },
      { q: 'When should you use context over props?', options: ['Always — context is better', 'For truly global state (theme, user, language) shared across many levels', 'For data used in 2 components', 'When props are slow'], correct: 1, explanation: 'Context is for widely-shared state. For state used 1-2 levels deep, props are simpler, easier to trace, and have no re-render penalty.' },
    ],
  },
  {
    id: 'cc-react-m06', track: 'crash', title: 'Custom Hooks',
    subtitle: 'Extract and reuse stateful logic with custom hooks.',
    moduleObjective: 'Extract component logic into custom hooks and compose them across components.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Custom Hook', definition: 'A function starting with "use" that calls other hooks. Extracts stateful logic for reuse.' },
      { term: 'Hook composition', definition: 'Custom hooks can call other hooks — including other custom hooks. Logic composes cleanly.' },
      { term: 'Separation of concerns', definition: 'Custom hooks move data-fetching and state logic out of components. Components focus on rendering.' },
      { term: 'useFetch pattern', definition: 'A custom hook encapsulating fetch + loading + error state. Returns { data, loading, error }.' },
      { term: 'Rules of hooks', definition: 'Only call hooks at the top level (no conditions, loops). Only call from React functions. Enforced by ESLint.' },
    ],
    content: `## Custom Hooks

Custom hooks extract stateful logic into reusable functions. They follow the "use" naming convention and can call other hooks.

### useLocalStorage

\`\`\`tsx
import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch { return initialValue }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* storage full */ }
  }, [key, value])

  return [value, setValue] as const
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
}
\`\`\`

### useFetch

\`\`\`tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}

// Usage
function CourseDetail({ id }: { id: string }) {
  const { data: course, loading, error } = useFetch<Course>(\`/api/courses/\${id}\`)

  if (loading) return <Spinner />
  if (error) return <Error message={error} />
  return <CourseView course={course!} />
}
\`\`\`

### useDebounce

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// Usage — search input that waits 300ms before searching
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) search(debouncedQuery)
  }, [debouncedQuery])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
\`\`\``,
    quiz: [
      { q: 'What makes a function a custom hook?', options: ['It must be in a separate file', 'It starts with "use" and calls other hooks', 'It uses TypeScript generics', 'It returns JSX'], correct: 1, explanation: 'A custom hook is any function starting with "use" that calls hooks. The naming convention lets React and linters enforce hook rules.' },
      { q: 'What is the main benefit of custom hooks?', options: ['Performance optimization', 'Extracting stateful logic for reuse across components without copying code', 'Replacing Redux', 'Making TypeScript easier'], correct: 1, explanation: 'Custom hooks extract logic — fetch + loading + error, debounce, localStorage — so multiple components share the same logic without duplication.' },
      { q: 'Can a custom hook call other custom hooks?', options: ['No — only built-in hooks', 'Yes — hooks compose freely', 'Only if they share state', 'Only in strict mode'], correct: 1, explanation: 'Custom hooks can call any hook — built-in or custom. This composability is the key design principle.' },
      { q: 'What are the rules of hooks?', options: ['Hooks must be exported', 'Only call hooks at the top level, only from React functions — never in loops or conditions', 'Hooks must return a value', 'Maximum of 5 hooks per component'], correct: 1, explanation: 'React relies on the order hooks are called. Calling hooks in loops or conditions would change their order between renders, breaking React\'s internal tracking.' },
    ],
  },
  {
    id: 'cc-react-m07', track: 'crash', title: 'React Performance',
    subtitle: 'Identify and fix performance issues with memoization, virtualization, and code splitting.',
    moduleObjective: 'Apply React.memo, memoization hooks, and code splitting to optimize rendering performance.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'PhD',
    xp: 200, duration: 11, module: 7, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Reconciliation', definition: "React\'s algorithm for comparing the previous and next virtual DOM trees — determines the minimal DOM updates needed." },
      { term: 'React DevTools Profiler', definition: 'Browser extension that records renders and shows which components re-rendered and why.' },
      { term: 'Code Splitting', definition: 'Splitting a large bundle into smaller chunks loaded on demand. React.lazy + Suspense implement this.' },
      { term: 'Lazy loading', definition: 'const Component = React.lazy(() => import("./Component")) — loads the component only when rendered.' },
      { term: 'Virtualization', definition: 'Rendering only visible list items. React Window / TanStack Virtual — handles lists of thousands of items.' },
    ],
    content: `## React Performance

React is fast by default, but large apps need intentional optimization. Profile first — never optimize without measuring.

### React.memo

\`\`\`tsx
// Re-renders only when its props change
const CourseCard = React.memo(function CourseCard({ course }: { course: Course }) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.xp} XP</p>
    </div>
  )
})
\`\`\`

Combine with useCallback for onClick handlers passed as props — otherwise a new function reference breaks memo.

### Lazy Loading with Suspense

\`\`\`tsx
import { lazy, Suspense } from 'react'

const AudiobookPlayer = lazy(() => import('@/components/AudiobookPlayer'))
const CertificatePage = lazy(() => import('@/app/certifications/page'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AudiobookPlayer courseId={id} />
    </Suspense>
  )
}
\`\`\`

Next.js has its own dynamic import: import dynamic from 'next/dynamic'.

### Key-based Reset

\`\`\`tsx
// Force a component to fully reset state by changing its key
function SearchResults({ query }: { query: string }) {
  return <ResultsList key={query} query={query} />
}
\`\`\`

When key changes, React unmounts and remounts — all internal state resets.

### Batched State Updates

React 18 automatically batches all state updates — even in async code:

\`\`\`tsx
// React 18 — one re-render for all three
async function handleSubmit() {
  setLoading(true)
  setError(null)
  setData(null)
  // ^ batched — one render

  const result = await saveData()

  setLoading(false)  // batched
  setData(result)    // with the line above
}
\`\`\``,
    quiz: [
      { q: 'When does React.memo prevent a re-render?', options: ['Always', 'When all props are equal by reference to the previous render', 'When state does not change', 'When the parent does not re-render'], correct: 1, explanation: 'React.memo does a shallow comparison of props. If all props are the same reference as the previous render, the component skips re-rendering.' },
      { q: 'What does React.lazy do?', options: ['Delays rendering by 100ms', 'Enables code splitting — loads the component only when it is first rendered', 'Memoizes a component', 'Required for dynamic imports'], correct: 1, explanation: 'React.lazy(() => import("./Comp")) splits the component into a separate bundle that only loads when the component is first rendered.' },
      { q: 'What happens when you change a component\'s key?', options: ['Only the state resets', 'React unmounts and remounts the component — all state and effects reset', 'The component re-renders without reset', 'Nothing — keys are for lists only'], correct: 1, explanation: 'Changing key is a hard reset — React treats it as a different element entirely and remounts from scratch.' },
      { q: 'When should you profile before optimizing?', options: ['Never — optimize early', 'Always — never optimize without measuring where the actual bottleneck is', 'Only for production builds', 'Only for lists'], correct: 1, explanation: 'Premature optimization adds complexity without benefit. React DevTools Profiler shows exactly which components are slow and why.' },
    ],
  },
  {
    id: 'cc-react-m08', track: 'crash', title: 'Error Boundaries & Patterns',
    subtitle: 'Handle errors gracefully and apply production React patterns.',
    moduleObjective: 'Implement error boundaries, Suspense, and production React patterns for resilient applications.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Error Boundary', definition: 'A class component that catches JS errors in its child tree and displays a fallback UI instead of crashing.' },
      { term: 'Suspense', definition: 'Displays a fallback while a lazy component or async data loads. Works with React.lazy and use().' },
      { term: 'Compound Component', definition: 'A pattern where a parent component manages shared state and exposes child components as named exports: Tabs.Tab, Tabs.Panel.' },
      { term: 'Render prop', definition: 'A prop that is a function returning JSX. Enables sharing rendering logic: <List renderItem={item => <Card item={item} />}.' },
      { term: 'Forwarding refs', definition: 'forwardRef — passes a ref through a wrapper component to the underlying DOM element.' },
    ],
    content: `## Error Boundaries & Production Patterns

Production React requires graceful error handling and patterns that scale across large codebases.

### Error Boundary

\`\`\`tsx
import { Component, ErrorInfo } from 'react'

interface Props { children: React.ReactNode; fallback?: React.ReactNode }
interface State { hasError: boolean; error?: Error }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info)
    // report to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Something went wrong.</div>
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary fallback={<ErrorScreen />}>
  <RiskyComponent />
</ErrorBoundary>
\`\`\`

### Suspense + Lazy Loading

\`\`\`tsx
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </ErrorBoundary>
  )
}
\`\`\`

Always wrap Suspense in an ErrorBoundary in production.

### forwardRef

\`\`\`tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => (
    <div className="input-wrapper">
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  )
)

// Usage — parent can access the underlying input element
function Form() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <Input label="Email" ref={inputRef} type="email" />
}
\`\`\`

### Compound Component Pattern

\`\`\`tsx
const TabsContext = createContext<{ active: string; set: (id: string) => void } | null>(null)

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab)
  return <TabsContext.Provider value={{ active, set: setActive }}>{children}</TabsContext.Provider>
}

Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  return (
    <button
      className={ctx.active === id ? 'active' : ''}
      onClick={() => ctx.set(id)}
    >{children}</button>
  )
}

// Usage
<Tabs defaultTab="overview">
  <Tabs.Tab id="overview">Overview</Tabs.Tab>
  <Tabs.Tab id="modules">Modules</Tabs.Tab>
</Tabs>
\`\`\``,
    quiz: [
      { q: 'What does an error boundary do?', options: ['Prevents all errors', 'Catches JS errors in its child tree and shows a fallback UI instead of crashing', 'Handles async errors', 'Required for Suspense'], correct: 1, explanation: 'Error boundaries catch rendering errors in the subtree and display a fallback. Without them, one error crashes the entire app.' },
      { q: 'What does Suspense display while loading?', options: ['Nothing', 'The fallback prop — a loading indicator or skeleton', 'An error message', 'The cached previous content'], correct: 1, explanation: 'Suspense shows the fallback while the lazy component or async data is loading, then renders the actual content.' },
      { q: 'What is forwardRef used for?', options: ['Forwarding props to children', 'Passing a ref through a wrapper component to the underlying DOM element', 'Creating ref objects', 'Performance optimization'], correct: 1, explanation: 'forwardRef lets a wrapper component pass a ref prop down to the DOM element it renders — needed for custom input components.' },
      { q: 'What is the compound component pattern?', options: ['Nesting components deeply', 'A parent managing shared state and exposing named child components (Tabs.Tab, Tabs.Panel)', 'Using multiple contexts', 'A pattern for forms only'], correct: 1, explanation: 'Compound components (like Tabs.Tab) share implicit state via context. Users compose them naturally without passing state as props.' },
    ],
  },
]
