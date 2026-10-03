import type { Course } from '../courses'

const CC_REACT_OBJ = 'Build real React applications — components, hooks, state, effects, and performance patterns used in production Next.js codebases.'

export const crashReactCourses: Course[] = [
  {
    id: 'cc-react-m01', track: 'crash',
    title: 'Environment, Components & Thinking in React',
    subtitle: 'Set up Vite + React, master JSX from first principles, and build composable components.',
    moduleObjective: 'Configure a Vite React project with VS Code extensions, build function components with JSX and props, and understand component composition.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Basic',
    xp: 150, duration: 12, module: 1, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Component', definition: 'A JavaScript function that accepts props and returns JSX. The fundamental unit of React UI — everything from a button to a full page is a component.' },
      { term: 'JSX', definition: 'JavaScript XML — HTML-like syntax that compiles to React.createElement() calls. Runs inside .jsx/.tsx files. NOT actual HTML.' },
      { term: 'Props', definition: 'Data passed from a parent component to a child. Read-only — a component never modifies its own props.' },
      { term: 'Declarative UI', definition: 'Describe what the UI should look like given some state. React handles all DOM mutations. No document.querySelector() or manual element updates needed.' },
      { term: 'Vite', definition: 'The modern build tool that replaced Create React App. Uses native ES modules for near-instant hot module replacement. The industry standard for new React projects.' },
      { term: 'Virtual DOM', definition: "React's in-memory tree of UI elements. React diffs old vs new trees on every render and patches only the real DOM nodes that changed." },
    ],
    content: `## Environment, Components & Thinking in React

### Why React? The DOM Mutation Problem

Imagine building a dashboard: a user menu, a data table, a notification badge, and a sidebar. When a user logs in, every element that displays user data needs to update. In vanilla JavaScript that means:

\`\`\`javascript
document.querySelector('#nav-username').textContent = user.name
document.querySelector('#avatar').src = user.avatar
document.querySelector('#badge').textContent = notifications.length
document.querySelector('#sidebar-name').textContent = user.name
// ... one line per DOM node, forever
\`\`\`

This is **imperative UI** — you manually describe every mutation. As the app scales, this becomes unmanageable. Miss one update and the UI is inconsistent. Add a new feature and you must trace every element it affects.

React introduces a **declarative model**: instead of saying "update element X", you say "given this state, the UI looks like this." React computes the minimum DOM changes needed. This is the mental shift that makes React transformative — you focus on *what* the UI should look like, not *how* to get there.

### Setting Up Your Environment

**Create React App is officially deprecated.** The modern standard is **Vite**.

**Step 1 — Create the project:**
\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

Your app is live at \`http://localhost:5173\`. Vite uses native ES modules so hot module replacement (HMR) is near-instant — save a file and the browser updates in milliseconds without reloading.

**Step 2 — VS Code extensions to install:**

Open VS Code and install these extensions:
- **ES7+ React/Redux/React-Native snippets** (by dsznajder): Type \`rafce\` and press Tab to scaffold a complete arrow-function component. Saves minutes every day.
- **Prettier - Code Formatter**: Set to "Format on Save" for consistent style across your project.

**Step 3 — React Developer Tools (browser extension):**

Install from the Chrome or Firefox extension store. It adds a **Components** tab to DevTools. You can inspect the component tree, view props and state in real time, and see exactly why each component re-renders — essential for debugging.

### Your Project File Structure

After \`npm create vite\`, you get:

\`\`\`
my-app/
  src/
    main.jsx             ← entry point — mounts <App /> into index.html
    App.jsx              ← root component rendered into the DOM
    assets/              ← images, SVGs, static files
    components/          ← create this folder for your own components
      Card.jsx
      Button.jsx
      NavBar.jsx
  index.html             ← single HTML page — Vite injects your bundle here
  vite.config.js         ← build configuration
  package.json
\`\`\`

Every component lives in a \`.jsx\` (or \`.tsx\` for TypeScript) file. Components export as named or default exports and import into parent components.

### What Is a Component?

A component is a JavaScript function that:
1. Accepts one argument — an object called **props** (or no argument if it takes no input)
2. Returns **JSX** — a description of the UI to render

\`\`\`jsx
// src/components/Card.jsx
export function Card({ title, description, imageUrl }) {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
\`\`\`

When React encounters \`<Card title="React" />\` it calls this function, receives JSX, and renders it to the DOM. When props change, React calls the function again, diffs the new JSX against the previous output, and surgically updates only the changed DOM nodes.

### JSX Is Not HTML — Three Critical Differences

**1. Use \`className\` not \`class\`:**
\`\`\`jsx
// Wrong — class is a reserved keyword in JavaScript
<div class="container">

// Correct
<div className="container">
\`\`\`

**2. Event handlers are camelCase and receive function references, not strings:**
\`\`\`jsx
// HTML — lowercase, string handler
<button onclick="handleClick()">

// JSX — camelCase, pass the function directly
<button onClick={handleClick}>
<input onChange={handleChange} onKeyDown={handleKeyDown} />
\`\`\`

**3. All tags must be explicitly closed:**
\`\`\`jsx
// Wrong — implicit closing not allowed
<img src="/logo.png">
<input type="text">
<br>

// Correct — self-closing syntax required
<img src="/logo.png" alt="Logo" />
<input type="text" />
<br />
\`\`\`

### Component Composition — The Real Power of React

Simple components compose into complex UIs by nesting. Props flow down the tree from parent to child:

\`\`\`jsx
// src/components/Button.jsx
export function Button({ children, variant = 'primary', onClick }) {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {children}
    </button>
  )
}

// src/App.jsx
import { Card } from './components/Card'
import { Button } from './components/Button'

export default function App() {
  return (
    <main className="app">
      <Card
        title="React Crash Course"
        description="Build interactive UIs with hooks and components."
        imageUrl="/courses/react.jpg"
      />
      <Button variant="primary" onClick={() => alert('Enrolled!')}>
        Enroll Now
      </Button>
    </main>
  )
}
\`\`\`

The \`children\` prop is special — it receives whatever is nested between a component's opening and closing tags. In \`<Button>Enroll Now</Button>\`, the string "Enroll Now" becomes \`props.children\`. This is how all layout wrapper components work in React.

### Importing Between Files

\`\`\`jsx
// Named export — import with curly braces
export function Card({ ... }) { ... }
import { Card } from './components/Card'

// Default export — import without curly braces
export default function App() { ... }
import App from './App'
\`\`\`

Convention: one component per file. The file name matches the component name. This makes codebases easy to navigate.`,

    quiz: [
      { q: 'Which tool is the modern replacement for Create React App?', options: ['Webpack', 'Parcel', 'Vite', 'Rollup'], correct: 2, explanation: 'Vite is the industry standard for new React projects. Create React App is deprecated and no longer maintained. Vite uses native ES modules for near-instant HMR.' },
      { q: 'What is the JSX attribute for CSS class?', options: ['class', 'cssClass', 'htmlClass', 'className'], correct: 3, explanation: 'className — not class — because class is a reserved keyword in JavaScript. JSX compiles to JS, so reserved words cannot be attribute names.' },
      { q: 'What does a React component function return?', options: ['An HTML string', 'A DOM element', 'JSX or null', 'A JavaScript object'], correct: 2, explanation: 'Components return JSX, which compiles to React.createElement() calls. React uses these to build and diff the virtual DOM.' },
      { q: 'What does the children prop contain?', options: ['An array of prop keys', 'Whatever is nested between the component\'s opening and closing tags', 'The parent component reference', 'A list of child component names'], correct: 1, explanation: 'children is a special React prop that receives everything between <Component> and </Component>. It enables wrapper and layout components.' },
    ],

    ide: {
      language: 'javascript',
      task: 'Build a Card component function that accepts props (title, description, imageUrl) and returns an HTML string using template literals. Call it with three different sets of props. This mirrors exactly how a React component works — a function that receives props and returns markup.',
      starterCode: `// In React, a component looks like this:
// function Card({ title, description, imageUrl }) { return <div>...</div> }
//
// Here we simulate it with template literals — no JSX build step needed.
// The mental model is identical: a function takes props, returns markup.

function Card({ title, description, imageUrl }) {
  // TODO: return a template literal string with the card HTML.
  // Use \${title}, \${description}, \${imageUrl} to insert the props.
}

// Call your component with different props
const card1 = Card({
  title: 'React Crash Course',
  description: 'Build interactive UIs with hooks and components.',
  imageUrl: '/courses/react.jpg'
})

const card2 = Card({
  title: 'Next.js Crash Course',
  description: 'Full-stack React with server-side rendering.',
  imageUrl: '/courses/nextjs.jpg'
})

console.log('Card 1:', card1)
console.log('Card 2:', card2)`,

      solution: `function Card({ title, description, imageUrl }) {
  return \`
    <div class="card">
      <img src="\${imageUrl}" alt="\${title}" />
      <h2 class="card-title">\${title}</h2>
      <p class="card-desc">\${description}</p>
    </div>
  \`
}

const card1 = Card({
  title: 'React Crash Course',
  description: 'Build interactive UIs with hooks and components.',
  imageUrl: '/courses/react.jpg'
})

const card2 = Card({
  title: 'Next.js Crash Course',
  description: 'Full-stack React with server-side rendering.',
  imageUrl: '/courses/nextjs.jpg'
})

const card3 = Card({
  title: 'TypeScript Crash Course',
  description: 'Type-safe JavaScript for production developers.',
  imageUrl: '/courses/typescript.jpg'
})

console.log('Card 1:', card1)
console.log('Card 2:', card2)
console.log('Card 3:', card3)
// In React you write: <Card title="..." description="..." imageUrl="..." />
// React calls this exact same function under the hood.`,

      hints: [
        'The function uses destructuring in its parameter: { title, description, imageUrl } pulls those three values out of the props object.',
        'Return a template literal: use backticks to start the string, then embed ${title}, ${description}, ${imageUrl} where you need them.',
        'Structure: a wrapper <div class="card">, an <img> with src and alt, an <h2> for the title, and a <p> for the description.',
      ]
    }
  },

  {
    id: 'cc-react-m02', track: 'crash', title: 'useState & State Management',
    subtitle: 'Add interactivity to components with local state using the useState hook.',
    moduleObjective: 'Manage component state with useState including objects, arrays, and functional update patterns.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Basic',
    xp: 150, duration: 10, module: 2, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'useState', definition: 'const [state, setState] = useState(initial) — returns the current state value and a setter function.' },
      { term: 'Functional update', definition: 'setState(prev => prev + 1) — use when new state depends on previous state. Guarantees you work with the latest value.' },
      { term: 'State is immutable', definition: 'Never mutate state directly. Always pass a new value or new object to the setter. Direct mutation does not trigger a re-render.' },
      { term: 'Re-render', definition: 'When state changes, React re-renders the component and its children. React 18 batches multiple updates into a single render pass.' },
      { term: 'Controlled component', definition: 'A form input whose value is owned by React state. value={state} onChange={e => setState(e.target.value)}.' },
    ],
    content: `## useState & State Management

State is what makes a React component interactive. Without state, components are pure functions — same input always produces the same output. useState adds memory: a component can remember a value between renders and update the UI when that value changes.

### Why Not Use a Regular Variable?

\`\`\`jsx
// This does NOT work — React does not know to re-render
function Counter() {
  let count = 0  // ← regular variable, lost on every render

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => { count++ }}>
        Increment
      </button>
    </div>
  )
}
\`\`\`

When you click the button, \`count\` increments but React never re-renders because nothing told it state changed. You need \`useState\` — it signals React to re-render the component with the new value.

### Basic useState

\`\`\`tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // initial value = 0

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

Every call to \`setCount\` schedules a re-render. React re-runs the function, \`useState\` returns the new value, and React updates the DOM to match the new JSX.

### Functional Updates — When State Depends on Previous

\`\`\`tsx
// RISKY — count might be stale in async or batched scenarios
setCount(count + 1)

// SAFE — functional update always receives the latest value
setCount(prev => prev + 1)

// When calling setCount multiple times in one handler:
function addThree() {
  setCount(prev => prev + 1)  // ← each sees the result of the previous
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  // count increases by 3 — correct
}
\`\`\`

Use the functional pattern whenever the new state depends on the old value.

### State with Objects — Spread to Update

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

  // Spread previous state, override only the changed field
  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <form>
      <input value={form.name} onChange={handleChange('name')} placeholder="Name" />
      <input value={form.email} onChange={handleChange('email')} placeholder="Email" />
      <textarea value={form.message} onChange={handleChange('message')} />
    </form>
  )
}
\`\`\`

Never mutate the state object directly (\`form.name = 'Jordan'\`). Always create a new object with the spread operator.

### State with Arrays — Always Create a New Array

\`\`\`tsx
const [items, setItems] = useState<string[]>([])

// Add an item
setItems(prev => [...prev, newItem])

// Remove an item
setItems(prev => prev.filter(item => item !== targetItem))

// Update an item
setItems(prev => prev.map(item =>
  item.id === targetId ? { ...item, done: true } : item
))
\`\`\`

Never use \`push()\`, \`splice()\`, or direct index assignment on state arrays. These mutate the existing array — React compares references, not deep values, so a mutated array still looks like the same array and the component does not re-render.

### Derived State — Compute From State, Not Duplicate It

\`\`\`tsx
// Bad — two pieces of state that must always be in sync
const [items, setItems] = useState([...])
const [count, setCount] = useState(0)  // ← duplicate

// Good — derive count from items
const [items, setItems] = useState([...])
const count = items.length  // ← computed on every render, always correct
\`\`\`

If a value can be calculated from existing state, compute it during render — do not store it as separate state.`,

    quiz: [
      { q: 'When should you use the functional update pattern setState(prev => ...)?', options: ['Always, without exception', 'When the new state depends on the previous state', 'Only for number state', 'Only inside async functions'], correct: 1, explanation: 'Functional updates ensure you always work with the latest state value — critical when updates happen in quick succession or in async contexts where the closure might hold a stale value.' },
      { q: 'What happens when you call setState?', options: ['State changes instantly in place', 'React schedules a re-render with the new state value', 'The function re-runs immediately', 'State is stored in localStorage'], correct: 1, explanation: 'setState schedules a re-render. React batches updates and re-runs the component function with the new state value on the next render.' },
      { q: 'How do you add an item to an array in state?', options: ['items.push(newItem)', 'setItems([...items, newItem])', 'items[items.length] = newItem', 'setItems(items.concat())'], correct: 1, explanation: 'Never mutate state arrays directly. Create a new array with the spread operator: setItems(prev => [...prev, newItem]).' },
      { q: 'What is a controlled component?', options: ['A component that controls its children', 'A form input with value from React state and onChange calling the setter', 'A component with no props', 'A component using useRef'], correct: 1, explanation: 'A controlled input has value={state} and onChange={setter}. React state is the single source of truth — the input always reflects what React says it should be.' },
    ],

    ide: {
      language: 'javascript',
      task: 'Build a createState function that simulates useState using closures. It should support both direct value updates and functional updates (like setState(prev => prev + 1)). Then use it to build a counter and a toggle.',
      starterCode: `// React's useState is built on a similar concept internally.
// Here we simulate it with closures to understand the pattern.

function createState(initialValue) {
  let value = initialValue

  function getState() {
    return value
  }

  function setState(newValue) {
    // TODO: handle both direct values and functional updates
    // If newValue is a function, call it with the current value
    // Otherwise, set value directly
  }

  return [getState, setState]
}

// Test 1: Counter
const [getCount, setCount] = createState(0)
console.log('Initial count:', getCount())        // 0

setCount(5)
console.log('After setCount(5):', getCount())    // 5

setCount(prev => prev + 1)  // functional update
console.log('After increment:', getCount())      // 6

// Test 2: Toggle
const [getVisible, setVisible] = createState(true)
console.log('Initial visible:', getVisible())    // true

setVisible(prev => !prev)
console.log('After toggle:', getVisible())       // false`,

      solution: `function createState(initialValue) {
  let value = initialValue

  function getState() {
    return value
  }

  function setState(newValue) {
    if (typeof newValue === 'function') {
      // Functional update: pass current value, use returned value
      value = newValue(value)
    } else {
      // Direct update
      value = newValue
    }
  }

  return [getState, setState]
}

// Test 1: Counter
const [getCount, setCount] = createState(0)
console.log('Initial count:', getCount())        // 0
setCount(5)
console.log('After setCount(5):', getCount())    // 5
setCount(prev => prev + 1)
console.log('After increment:', getCount())      // 6

// Multiple functional updates chain correctly
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
console.log('After 3 increments:', getCount())   // 9

// Test 2: Toggle
const [getVisible, setVisible] = createState(true)
console.log('Initial visible:', getVisible())    // true
setVisible(prev => !prev)
console.log('After toggle:', getVisible())       // false
setVisible(prev => !prev)
console.log('After second toggle:', getVisible()) // true`,

      hints: [
        'Check if newValue is a function with typeof newValue === "function".',
        'If newValue is a function, call it: value = newValue(value). This is the functional update pattern.',
        'If newValue is not a function, just assign: value = newValue.',
      ]
    }
  },

  {
    id: 'cc-react-m03', track: 'crash', title: 'useEffect & Side Effects',
    subtitle: 'Sync React components with external systems, data, and browser APIs using useEffect.',
    moduleObjective: 'Use useEffect to fetch data, set up subscriptions, and clean up side effects correctly.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'useEffect', definition: 'Runs after render to sync with external systems: fetch, subscriptions, timers, DOM manipulation.' },
      { term: 'Dependency array', definition: 'Second argument to useEffect. [] = run once on mount. [dep] = run when dep changes. omitted = run every render.' },
      { term: 'Cleanup function', definition: 'The function returned from useEffect. Runs before the next effect and on unmount. Cancels subscriptions and timers.' },
      { term: 'Race condition', definition: 'When a fast response from a new fetch overwrites a slow response from an old fetch. Fixed with a cancelled flag in cleanup.' },
      { term: 'Strict Mode', definition: 'In development, React runs effects twice to surface cleanup issues. Production only runs once.' },
    ],
    content: `## useEffect & Side Effects

A React component should be a pure function: same props + state in, same JSX out. But real applications need to interact with the outside world — fetch data, start timers, listen to DOM events. These are **side effects** because they affect things outside the component's return value.

\`useEffect\` is React's escape hatch for side effects. It runs after the component renders and after React has updated the DOM.

### Why After Render?

React renders your component, paints the DOM, then runs effects. This order matters because:
1. The user sees the UI immediately, not waiting for data to load
2. Effects can reference real DOM nodes (they exist after render)
3. Server components can render without any effects (SSR safety)

### Basic useEffect — Syncing with External State

\`\`\`tsx
import { useState, useEffect } from 'react'

function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title  // side effect: modifying the browser tab
  }, [title])  // re-run whenever title changes

  return null
}
\`\`\`

### The Dependency Array — Three Patterns

\`\`\`tsx
// Pattern 1: [] — run once on mount, cleanup on unmount
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)  // cleanup: cancel the interval
}, [])

// Pattern 2: [dep] — run when dep changes (including first mount)
useEffect(() => {
  fetchUser(userId)
}, [userId])  // re-fetch whenever userId changes

// Pattern 3: No array — run after EVERY render (rarely needed)
useEffect(() => {
  console.log('rendered with count:', count)
})
\`\`\`

### Data Fetching — The Production Pattern

\`\`\`tsx
function CourseDetail({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false  // prevents stale state on unmount or dep change

    async function load() {
      try {
        setLoading(true)
        const res = await fetch(\`/api/courses/\${courseId}\`)
        const data = await res.json()
        if (!cancelled) {           // only update state if still mounted
          setCourse(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load course.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }  // cleanup: mark as cancelled
  }, [courseId])  // re-fetch when courseId changes

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} />
  if (!course) return null
  return <CourseView course={course} />
}
\`\`\`

The \`cancelled\` flag prevents a **race condition**: if \`courseId\` changes while a fetch is in flight, the cleanup sets \`cancelled = true\`. When the old fetch completes, it checks \`cancelled\` before updating state — preventing stale data from overwriting fresh data.

### Cleanup — Preventing Memory Leaks

\`\`\`tsx
// Event listener cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// Subscription cleanup
useEffect(() => {
  const subscription = store.subscribe(handleUpdate)
  return () => subscription.unsubscribe()
}, [])

// Timer cleanup
useEffect(() => {
  const id = setTimeout(() => setShowNotice(true), 5000)
  return () => clearTimeout(id)
}, [])
\`\`\`

The cleanup function runs:
1. Before the effect runs again (when deps change)
2. When the component unmounts from the DOM

Without cleanup, event listeners and subscriptions accumulate every time the component mounts — a memory leak that crashes long-running apps.`,

    quiz: [
      { q: 'What does an empty dependency array [] mean?', options: ['Run on every render', 'Run once on mount, cleanup on unmount', 'Never run', 'Run when props change'], correct: 1, explanation: '[] tells React: run this effect once after the first render, and run the cleanup when the component unmounts. No re-runs for prop or state changes.' },
      { q: 'Why do you return a cleanup function from useEffect?', options: ['It is required by React', 'To cancel subscriptions, timers, and async operations before the next effect or unmount', 'To reset state', 'For TypeScript compatibility'], correct: 1, explanation: 'The cleanup function runs before the next effect run and on unmount — preventing memory leaks and stale state updates from effects that are no longer relevant.' },
      { q: 'How do you prevent a race condition in data fetching?', options: ['Use async/await always', 'Track a cancelled flag in the effect, check it before setting state, set it to true in cleanup', 'Fetch in a timeout', 'Use Redux instead'], correct: 1, explanation: 'A cancelled flag set in cleanup prevents updating state after the component has unmounted or the dep has changed — the two causes of stale data race conditions.' },
      { q: 'What happens if you omit the dependency array entirely?', options: ['Effect never runs', 'Effect runs after every single render', 'Effect runs once', 'TypeScript error'], correct: 1, explanation: 'Omitting the array means no dependency tracking — the effect runs after every render. This is almost never what you want and often causes infinite loops.' },
    ],

    ide: {
      language: 'javascript',
      task: 'Write an async loadUser function that simulates the useEffect data fetching pattern: handle loading, success, and error state. Use a cancelled flag to prevent stale updates — log the state at each stage.',
      starterCode: `// Simulating the useEffect data fetching pattern in plain JS.
// In React this lives inside useEffect with the same logic.

async function fetchUser(userId) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50))

  const users = {
    1: { id: 1, name: 'Jordan Morris', role: 'admin' },
    2: { id: 2, name: 'Alex Rivera', role: 'student' },
  }

  if (!users[userId]) throw new Error(\`User \${userId} not found\`)
  return users[userId]
}

async function loadUser(userId) {
  let loading = true
  let user = null
  let error = null

  // TODO:
  // 1. Log that loading started
  // 2. Call fetchUser(userId) inside try/catch
  // 3. On success: set user, set loading false
  // 4. On error: set error message, set loading false
  // 5. In finally: always set loading false
  // 6. Log the final state: { loading, user, error }
}

// Test both success and error cases
loadUser(1)
loadUser(99)`,

      solution: `async function fetchUser(userId) {
  await new Promise(resolve => setTimeout(resolve, 50))

  const users = {
    1: { id: 1, name: 'Jordan Morris', role: 'admin' },
    2: { id: 2, name: 'Alex Rivera', role: 'student' },
  }

  if (!users[userId]) throw new Error(\`User \${userId} not found\`)
  return users[userId]
}

async function loadUser(userId) {
  let loading = true
  let user = null
  let error = null

  console.log(\`Loading user \${userId}...\`)

  try {
    user = await fetchUser(userId)
    loading = false
    console.log(\`Success! State: \`, { loading, user, error })
  } catch (err) {
    error = err.message
    loading = false
    console.log(\`Error! State: \`, { loading, user, error })
  }
}

// In React, this logic lives inside useEffect:
// useEffect(() => {
//   let cancelled = false
//   async function load() {
//     try { setLoading(true); const u = await fetchUser(userId)
//       if (!cancelled) setUser(u)
//     } catch(e) { if (!cancelled) setError(e.message) }
//     finally { if (!cancelled) setLoading(false) }
//   }
//   load()
//   return () => { cancelled = true }  // cleanup
// }, [userId])

loadUser(1)
loadUser(99)`,

      hints: [
        'Use try/catch/finally. Set user in the try block, error in the catch block, and loading = false in the finally block.',
        'Log the state object { loading, user, error } after the try/catch/finally to see the final state.',
        'In React this same pattern sits inside useEffect with a cancelled flag to prevent setting state after unmount.',
      ]
    }
  },

  {
    id: 'cc-react-m04', track: 'crash', title: 'useRef, useMemo & useCallback',
    subtitle: 'Access DOM elements and optimize performance with React\'s memoization hooks.',
    moduleObjective: 'Use useRef for DOM access and useMemo/useCallback to prevent unnecessary re-renders.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'useRef', definition: 'Returns a mutable ref object. Two uses: 1) accessing DOM elements directly, 2) storing values that persist across renders without triggering re-renders.' },
      { term: 'useMemo', definition: 'useMemo(() => compute(), [deps]) — memoizes an expensive computation. Only recomputes when dependencies change.' },
      { term: 'useCallback', definition: 'useCallback(fn, [deps]) — memoizes a function reference. Returns the same function until deps change.' },
      { term: 'Referential equality', definition: 'In JS, objects and functions created on each render are new references even if equal in value. This breaks React.memo comparisons.' },
      { term: 'React.memo', definition: 'React.memo(Component) — wraps a component to skip re-render when props have not changed by reference.' },
    ],
    content: `## useRef, useMemo & useCallback

These three hooks give you fine-grained control over DOM access and render performance. They are the tools you reach for when a component is rendering too often or you need direct DOM interaction.

### useRef — Two Distinct Use Cases

**Use case 1: DOM element access**

\`\`\`tsx
import { useRef, useEffect } from 'react'

function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()  // focus the actual DOM input on mount
  }, [])

  return <input ref={inputRef} type="text" placeholder="Auto-focused" />
}
\`\`\`

Attaching a \`ref\` to a JSX element gives you direct access to the DOM node. React sets \`inputRef.current\` to the element after the first render.

**Use case 2: Persistent values that do not trigger re-renders**

\`\`\`tsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

Storing the interval ID in a ref (not state) means clearing it does not cause a re-render.

### useMemo — Expensive Computations

\`\`\`tsx
function CourseStats({ courses }: { courses: Course[] }) {
  // Without useMemo: runs on every render, even when courses hasn't changed
  // With useMemo: only recomputes when courses changes
  const stats = useMemo(() => ({
    total: courses.length,
    totalXp: courses.reduce((sum, c) => sum + c.xp, 0),
    byTrack: courses.reduce((acc, c) => {
      acc[c.track] = (acc[c.track] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    masters: courses.filter(c => c.level === 'Masters').length,
  }), [courses])

  return <StatsDisplay stats={stats} />
}
\`\`\`

The rule: if a computation takes noticeable time AND the component re-renders often for unrelated reasons, wrap it in \`useMemo\`. Do not apply it everywhere — it has overhead of its own.

### useCallback — Stable Function References

Every render creates new function instances. If you pass a function as a prop to a memoized child, the child re-renders on every parent render — even if the function "looks the same."

\`\`\`tsx
function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  // This function is recreated on every render — SearchButton always re-renders
  const handleSearch = () => onSearch(query)

  // useCallback: same reference until query or onSearch changes
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

// memo: only re-renders when props change by reference
const SearchButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>Search</button>
))
\`\`\`

\`useCallback\` is most useful when: 1) you pass callbacks to memoized children, or 2) a callback is a dependency of another hook (useEffect, useMemo).

### When to Optimize

The golden rule of React performance: **measure first, optimize second.** Use the React DevTools Profiler to record renders and see which components re-render and why before adding memoization.

Premature optimization with \`useMemo\` and \`useCallback\` everywhere adds complexity and can actually hurt performance (the comparison overhead on every render). Apply them surgically to confirmed bottlenecks.`,

    quiz: [
      { q: 'When should you use useRef vs useState?', options: ['They are interchangeable', 'useRef for DOM access and values that must not trigger re-renders; useState for values that update the UI', 'useState for DOM nodes, useRef for state', 'useRef is newer — always prefer it'], correct: 1, explanation: 'Changing a ref does not trigger re-render. Use refs for DOM elements, timers, previous values. Use state for anything that should update the UI.' },
      { q: 'What does useMemo do?', options: ['Memoizes a component', 'Memoizes the result of a computation — only recomputes when dependencies change', 'Prevents all re-renders', 'Caches API responses'], correct: 1, explanation: 'useMemo caches the return value of a function and only recomputes when specified dependencies change. Useful for expensive calculations on frequently-rendering components.' },
      { q: 'What does useCallback do?', options: ['Runs a callback after render', 'Memoizes a function — returns the same reference until dependencies change', 'Replaces useEffect', 'Wraps async functions'], correct: 1, explanation: 'useCallback returns a memoized function. The same reference is returned until dependencies change — prevents child re-renders caused by new function references on every parent render.' },
      { q: 'What is React.memo?', options: ['A data store', 'A higher-order component that skips re-render when props have not changed by reference', 'Same as useMemo', 'Required to use hooks'], correct: 1, explanation: 'React.memo wraps a component and skips re-rendering if props have not changed (shallow reference comparison). Works best when combined with useCallback for handler props.' },
    ],
  },

  {
    id: 'cc-react-m05', track: 'crash', title: 'Context & Prop Drilling',
    subtitle: 'Share state across deep component trees without prop drilling using React Context.',
    moduleObjective: 'Create and consume React Context to share state across multiple levels of components.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Masters',
    xp: 175, duration: 11, module: 5, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Context', definition: 'React mechanism for passing data through the component tree without threading props through every level.' },
      { term: 'createContext', definition: 'Creates a Context object with a default value. Required before Provider or useContext can be used.' },
      { term: 'Provider', definition: 'Context.Provider wraps the subtree that needs access. The value prop sets the current context value for all consumers inside.' },
      { term: 'useContext', definition: 'Hook that reads the current value from the nearest matching Provider above in the component tree.' },
      { term: 'Prop drilling', definition: 'Passing props through intermediate components that do not use them — just to get data to a deeply nested child. Context eliminates this.' },
    ],
    content: `## Context & Prop Drilling

### The Problem: Prop Drilling

Imagine a NavBar component deep in your tree that needs the current user's name. That data lives at the top of the tree in App. Without context, you pass it down through every layer:

\`\`\`tsx
<App user={user}>          // has the data
  <Layout user={user}>     // does not need it — just passes it down
    <Sidebar user={user}>  // same
      <NavBar user={user}> // finally uses it
\`\`\`

Every intermediate component is polluted with a prop it does not use. Add another 3 levels and this becomes unmaintainable.

Context solves this by making a value available to any descendant without threading it through props.

### Creating Context

\`\`\`tsx
import { createContext, useContext, useState } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// createContext creates the context with a default value (used when no Provider wraps the consumer)
const ThemeContext = createContext<ThemeContextValue | null>(null)

// Provider component — wraps the tree that needs access
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook — safer than raw useContext, throws a helpful error
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
\`\`\`

### Consuming Context

Any component inside \`ThemeProvider\` can call \`useTheme()\` — no matter how deeply nested:

\`\`\`tsx
// Deep in the tree — no prop drilling
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  )
}

// In App.tsx
export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        {/* ThemeToggle can be anywhere in the tree */}
        <NavBar />
      </Layout>
    </ThemeProvider>
  )
}
\`\`\`

### Course Progress Context — Real Example

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

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider')
  return ctx
}
\`\`\`

### When to Use Context vs Props

**Use context for:**
- Theme (light/dark mode)
- Current authenticated user
- Language/locale settings
- Global notifications/toasts
- Progress tracking shared across pages

**Use props for:**
- Component-specific data
- Data used only 1-2 levels deep
- Data that varies between instances of the same component

Context is not a replacement for all prop passing — it makes every consumer re-render when the context value changes. Over-using it is a performance anti-pattern.`,

    quiz: [
      { q: 'What problem does React Context solve?', options: ['State persistence across page reloads', 'Eliminates prop drilling — sharing state without passing it through every intermediate level', 'API calls', 'TypeScript types'], correct: 1, explanation: 'Context lets any descendant component consume shared state without intermediary components needing to pass it as props.' },
      { q: 'What does Context.Provider do?', options: ['Creates the context object', 'Wraps the subtree and sets the current context value for all consumers inside it', 'Optimizes context performance', 'Required for useContext to compile'], correct: 1, explanation: 'Provider wraps the tree and supplies the value. All useContext calls inside the Provider boundary receive that value.' },
      { q: 'What does useContext return?', options: ['A setter function', 'The current value from the nearest matching Provider above in the component tree', 'The Provider component itself', 'The context default value always'], correct: 1, explanation: 'useContext returns the current context value from the nearest matching Provider. If no Provider wraps it, the default value from createContext is returned.' },
      { q: 'When should you use context over props?', options: ['Always — context is always better', 'For widely-shared state (theme, user, language) accessed across many component levels', 'Whenever data is used in 2 components', 'When props are slow'], correct: 1, explanation: 'Context is for globally-shared state. For data 1-2 levels deep, props are simpler, easier to trace, and have no re-render overhead.' },
    ],
  },

  {
    id: 'cc-react-m06', track: 'crash', title: 'Custom Hooks',
    subtitle: 'Extract and reuse stateful logic across components with custom hooks.',
    moduleObjective: 'Extract component logic into custom hooks and compose them across components.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Custom Hook', definition: 'A function starting with "use" that calls other hooks. Extracts stateful logic for reuse across components.' },
      { term: 'Hook composition', definition: 'Custom hooks can call other hooks — including other custom hooks. Logic composes cleanly without duplication.' },
      { term: 'Separation of concerns', definition: 'Custom hooks move data-fetching and logic out of components. Components focus on rendering. Logic is testable in isolation.' },
      { term: 'useFetch pattern', definition: 'A custom hook encapsulating fetch + loading + error state. Returns { data, loading, error } for any URL.' },
      { term: 'Rules of hooks', definition: 'Only call hooks at the top level (never inside conditions, loops, or nested functions). Only call from React functions or other hooks.' },
    ],
    content: `## Custom Hooks

When multiple components need the same stateful logic — data fetching, localStorage sync, debouncing — the right solution is a custom hook. Extract the logic once, reuse it everywhere.

### The Pattern

A custom hook is just a JavaScript function that:
1. Starts with \`use\` (so React can enforce the rules of hooks)
2. Calls other hooks (useState, useEffect, built-in or custom)
3. Returns values the component needs

### useLocalStorage — Persisted State

\`\`\`tsx
import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* storage quota exceeded */ }
  }, [key, value])

  return [value, setValue] as const
}

// Usage — drop-in replacement for useState with persistence
function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar', true)
}
\`\`\`

### useFetch — Data Fetching with Loading State

\`\`\`tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setError(null) } })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}

// Usage — components get clean data with no loading boilerplate
function CourseDetail({ id }: { id: string }) {
  const { data: course, loading, error } = useFetch<Course>(\`/api/courses/\${id}\`)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} />
  return <CourseView course={course!} />
}
\`\`\`

### useDebounce — Delay Expensive Operations

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)  // cancel the previous timer on each change
  }, [value, delay])

  return debounced
}

// Usage — search fires only after 300ms of inactivity
function CourseSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) searchCourses(debouncedQuery)
  }, [debouncedQuery])

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search courses..."
    />
  )
}
\`\`\`

### useMediaQuery — Responsive Logic in JS

\`\`\`tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Usage
function NavBar() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <MobileNav /> : <DesktopNav />
}
\`\`\`

The key insight: hooks compose. \`useDebounce\` uses \`useState\` and \`useEffect\`. \`useFetch\` uses \`useState\`, \`useEffect\`, and could use \`useDebounce\`. You build complex, reusable behavior by composing simple primitives.`,

    quiz: [
      { q: 'What makes a function a custom hook?', options: ['It must be in a hooks/ folder', 'It starts with "use" and calls other hooks', 'It uses TypeScript generics', 'It returns JSX'], correct: 1, explanation: 'A custom hook is any function starting with "use" that calls hooks. The naming convention lets React and ESLint enforce hook rules (no conditional calls).' },
      { q: 'What is the main benefit of custom hooks?', options: ['Performance optimization', 'Extracting stateful logic for reuse across components without duplicating code', 'Replacing Redux entirely', 'Making TypeScript easier'], correct: 1, explanation: 'Custom hooks extract logic — fetch + loading + error, debounce, localStorage — so multiple components share the same behavior without copy-paste.' },
      { q: 'Can a custom hook call other custom hooks?', options: ['No — only built-in hooks', 'Yes — hooks compose freely', 'Only if they share state', 'Only in strict mode'], correct: 1, explanation: 'Custom hooks can call any hook — built-in or custom. This composability is the key design principle. useFetch calls useState and useEffect internally.' },
      { q: 'What are the rules of hooks?', options: ['Hooks must be exported', 'Only call hooks at the top level of React functions — never inside loops, conditions, or nested functions', 'Hooks must return a value', 'Maximum of 10 hooks per component'], correct: 1, explanation: 'React relies on the order hooks are called to match state to the right hook on each render. Conditionals break that order and corrupt internal state tracking.' },
    ],
  },

  {
    id: 'cc-react-m07', track: 'crash', title: 'React Performance',
    subtitle: 'Identify and fix performance issues with memoization, virtualization, and code splitting.',
    moduleObjective: 'Apply React.memo, memoization hooks, lazy loading, and code splitting to optimize rendering performance.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'PhD',
    xp: 200, duration: 11, module: 7, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Reconciliation', definition: "React's algorithm for comparing previous and next virtual DOM trees to determine minimal real DOM updates." },
      { term: 'React DevTools Profiler', definition: 'Browser extension tool that records renders and shows which components re-rendered, how long they took, and why.' },
      { term: 'Code Splitting', definition: 'Splitting a large JS bundle into smaller chunks loaded on demand. React.lazy + Suspense implement this at the component level.' },
      { term: 'Lazy loading', definition: 'const Component = React.lazy(() => import("./Component")) — the component bundle only loads when it is first rendered.' },
      { term: 'Virtualization', definition: 'Rendering only the visible items in a long list. React Window / TanStack Virtual — handles lists of thousands of rows efficiently.' },
    ],
    content: `## React Performance

React is fast by default. The virtual DOM diff algorithm is highly optimized and batches DOM updates. Most React apps do not need manual optimization — but when they do, the tools are surgical and powerful.

**The golden rule: profile first, optimize second.** Adding \`useMemo\` and \`useCallback\` everywhere without measurement adds complexity and can hurt performance through comparison overhead on every render.

### Understanding Re-renders

A component re-renders when:
1. Its own state changes
2. Its parent re-renders (by default, all children re-render too)
3. A context it consumes changes

Re-renders are not inherently bad — React is fast. The problem is when heavy computations or many child components re-render unnecessarily.

### React.memo — Skip Child Re-renders

\`\`\`tsx
// Without memo: re-renders whenever parent re-renders, regardless of props
function CourseCard({ course }: { course: Course }) { ... }

// With memo: skips re-render if props have not changed by reference
const CourseCard = React.memo(function CourseCard({ course }: { course: Course }) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.xp} XP</p>
    </div>
  )
})
\`\`\`

Combine with \`useCallback\` for event handlers passed as props — otherwise a new function reference on each parent render defeats memo.

### Lazy Loading with Suspense

\`\`\`tsx
import { lazy, Suspense } from 'react'

// These components are split into separate JS chunks
// They only download when first rendered
const AudiobookPlayer = lazy(() => import('@/components/AudiobookPlayer'))
const CertificatePage = lazy(() => import('@/app/certifications/page'))
const HeavyChart = lazy(() => import('@/components/HeavyChart'))

function CoursePage({ courseId }: { courseId: string }) {
  return (
    <div>
      <CourseContent courseId={courseId} />
      <Suspense fallback={<div className="loading-skeleton" />}>
        <AudiobookPlayer courseId={courseId} />
      </Suspense>
    </div>
  )
}
\`\`\`

In Next.js, use \`dynamic\` from \`'next/dynamic'\` instead — it has the same API plus SSR control.

### Key-based Component Reset

\`\`\`tsx
// Force a component to fully unmount and remount when the key changes
// All internal state resets — like destroying and rebuilding the component
function CourseViewer({ courseId }: { courseId: string }) {
  return <CourseContent key={courseId} courseId={courseId} />
  //                    ^^^^^^^^^^^
  // Change courseId → old component unmounts, new one mounts fresh
}
\`\`\`

This is useful when a component has internal state that should reset when a prop changes (like a video player that should restart when the source changes).

### React 18 Automatic Batching

React 18 batches all state updates in a single render — even inside async functions, promises, and setTimeout:

\`\`\`tsx
async function handleSubmit() {
  // React 18: ALL of these are batched into ONE render
  setLoading(true)
  setError(null)
  setData(null)

  const result = await saveFormData(formData)

  // Also batched — one render after the await
  setLoading(false)
  setData(result)
}
\`\`\`

In React 17, updates inside async code triggered separate renders. React 18 automatically batches them.

### Using the DevTools Profiler

1. Open React DevTools → Profiler tab
2. Click "Record"
3. Interact with the slow part of the UI
4. Stop recording
5. Inspect the flame graph — bars show time spent per component per render
6. Hover a bar to see WHY the component rendered (which hook or prop changed)

Optimize only what the profiler confirms is slow.`,

    quiz: [
      { q: 'When does React.memo prevent a re-render?', options: ['Always, unconditionally', 'When all props are equal by reference to the previous render', 'When the parent does not re-render', 'When state does not change'], correct: 1, explanation: 'React.memo does a shallow comparison of props. If all props are the same reference as the previous render, the component skips re-rendering.' },
      { q: 'What does React.lazy do?', options: ['Delays rendering by 100ms', 'Enables code splitting — loads the component bundle only when it is first rendered', 'Memoizes a component', 'Makes the component render on the server'], correct: 1, explanation: 'React.lazy(() => import("./Comp")) splits the component into a separate JS chunk that only downloads when the component is first rendered.' },
      { q: 'What happens when you change a component\'s key?', options: ['Only state resets', 'React unmounts the component and mounts a fresh one — all state and effects reset', 'The component re-renders without resetting', 'Nothing — keys are only for lists'], correct: 1, explanation: 'Changing key causes React to treat it as a completely different element. The old component unmounts (cleanup runs), a new one mounts from scratch.' },
      { q: 'When should you profile before optimizing?', options: ['Never — optimize proactively', 'Always — never add optimization without measuring the actual bottleneck', 'Only for production builds', 'Only for lists with 100+ items'], correct: 1, explanation: 'Premature optimization adds complexity without benefit. React DevTools Profiler shows exactly which components are slow and why before you write a single useMemo.' },
    ],
  },

  {
    id: 'cc-react-m08', track: 'crash', title: 'Error Boundaries & Patterns',
    subtitle: 'Handle errors gracefully and apply production React patterns at scale.',
    moduleObjective: 'Implement error boundaries, Suspense, forwardRef, and compound component patterns for production React apps.',
    courseObjective: CC_REACT_OBJ, crashId: 'cc-react', crashTitle: 'React', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'React Crash Course',
    keyTerms: [
      { term: 'Error Boundary', definition: 'A class component that catches JS errors in its child tree and displays a fallback UI instead of crashing the entire app.' },
      { term: 'Suspense', definition: 'Shows a fallback UI while a lazy component or async data loads. Works with React.lazy and the new use() hook.' },
      { term: 'Compound Component', definition: 'A pattern where a parent manages shared state and exposes named child components: Tabs.Tab, Tabs.Panel, Accordion.Item.' },
      { term: 'Render prop', definition: 'A prop that is a function returning JSX. Enables sharing rendering logic: <List renderItem={item => <Card item={item} />} />.' },
      { term: 'forwardRef', definition: 'forwardRef — passes a ref through a custom component to the underlying DOM element. Required for custom input components.' },
    ],
    content: `## Error Boundaries & Production Patterns

### Error Boundaries — Graceful Failure

Without error boundaries, one JavaScript error in a component crashes the entire React app — the user sees a blank white screen with no recourse.

Error boundaries are class components (the only case where class components are still needed) that catch errors in their subtree and render fallback UI:

\`\`\`tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State { hasError: boolean; error?: Error }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to Sentry, DataDog, etc.
    this.props.onError?.(error, info)
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="error-screen">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Usage — wrap critical sections
<ErrorBoundary fallback={<ErrorScreen />} onError={logToSentry}>
  <CoursePlayer courseId={id} />
</ErrorBoundary>
\`\`\`

**Always** wrap \`<Suspense>\` in an \`<ErrorBoundary>\` in production — if the lazy component fails to load, Suspense alone leaves an unhandled error.

### Suspense + Lazy Loading — Full Pattern

\`\`\`tsx
const HeavyVideoPlayer = lazy(() => import('./HeavyVideoPlayer'))

function CoursePage({ courseId }: { courseId: string }) {
  return (
    <div>
      <CourseHeader courseId={courseId} />

      <ErrorBoundary fallback={<p>Player failed to load.</p>}>
        <Suspense fallback={<PlayerSkeleton />}>
          <HeavyVideoPlayer courseId={courseId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
\`\`\`

### forwardRef — Expose DOM Access from Wrapper Components

\`\`\`tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="input-field">
      <label>{label}</label>
      <input ref={ref} className={error ? 'error' : ''} {...props} />
      {error && <span className="error-text">{error}</span>}
    </div>
  )
)

Input.displayName = 'Input'  // shows in React DevTools

// Parent can access the real <input> DOM node
function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    emailRef.current?.focus()  // focus the Input's inner <input> element
  }

  return <Input ref={emailRef} label="Email" type="email" />
}
\`\`\`

### Compound Component Pattern

\`\`\`tsx
const TabsContext = createContext<{
  active: string
  setActive: (id: string) => void
} | null>(null)

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

Tabs.Tab = function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)!
  return (
    <button
      className={\`tab \${ctx.active === id ? 'active' : ''}\`}
      onClick={() => ctx.setActive(id)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useContext(TabsContext)!
  if (active !== id) return null
  return <div className="tab-panel">{children}</div>
}

// Usage — explicit, readable, no prop spaghetti
<Tabs defaultTab="overview">
  <Tabs.Tab id="overview">Overview</Tabs.Tab>
  <Tabs.Tab id="modules">Modules</Tabs.Tab>
  <Tabs.Tab id="quiz">Quiz</Tabs.Tab>
  <Tabs.Panel id="overview"><OverviewContent /></Tabs.Panel>
  <Tabs.Panel id="modules"><ModuleList /></Tabs.Panel>
  <Tabs.Panel id="quiz"><QuizView /></Tabs.Panel>
</Tabs>
\`\`\`

The compound component pattern is how libraries like Radix UI, Headless UI, and React Select are built — shared implicit state via context, explicit composition on the surface.`,

    quiz: [
      { q: 'What does an error boundary do?', options: ['Prevents all runtime errors', 'Catches JS errors in its child tree and renders fallback UI instead of crashing the whole app', 'Handles async errors in useEffect', 'Required for Suspense to work'], correct: 1, explanation: 'Error boundaries catch rendering errors in the subtree. Without them, one unhandled error crashes the entire React app and shows a blank screen.' },
      { q: 'What does Suspense display while loading?', options: ['Nothing — the page goes blank', 'The fallback prop — a skeleton, spinner, or placeholder UI', 'An error message', 'The cached previous content'], correct: 1, explanation: 'Suspense shows the fallback while the lazy component or async data resolves, then swaps in the real content when ready.' },
      { q: 'What is forwardRef used for?', options: ['Forwarding props to children', 'Passing a ref through a custom component to the underlying DOM element it renders', 'Creating ref objects', 'Memoizing components'], correct: 1, explanation: 'forwardRef lets a wrapper component accept a ref prop and pass it to the DOM element inside — essential for custom input/button components.' },
      { q: 'What is the compound component pattern?', options: ['Deeply nesting many components', 'A parent managing shared state exposed through named child components (Tabs.Tab, Tabs.Panel)', 'Using multiple contexts', 'A pattern only for forms'], correct: 1, explanation: 'Compound components share implicit context-based state. Users compose them naturally without passing state as props — the API is declarative and flexible.' },
    ],
  },
]
