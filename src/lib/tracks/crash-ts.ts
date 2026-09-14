import type { Course } from '../courses'

const CC_TS_OBJ = 'Write production TypeScript — typed components, generics, utility types, and strict-mode patterns used in real Next.js and React codebases.'

export const crashTsCourses: Course[] = [
  {
    id: 'cc-ts-m01', track: 'crash', title: 'TypeScript Fundamentals — Types & Inference',
    subtitle: 'Understand static typing, type inference, and why TypeScript catches bugs before runtime.',
    moduleObjective: 'Declare typed variables, functions, and parameters using TypeScript primitives and inference.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'Static Typing', definition: 'Types are checked at compile time. TypeScript catches type errors before your code runs.' },
      { term: 'Type Inference', definition: 'TypeScript infers the type from the assigned value: const x = 5 makes x a number automatically.' },
      { term: 'Primitive Types', definition: 'string, number, boolean, null, undefined, symbol, bigint — the seven TypeScript primitive types.' },
      { term: 'Type Annotation', definition: 'Explicit type: const name: string = "Jordan". Preferred for function parameters and return types.' },
      { term: 'any vs unknown', definition: 'any disables type checking — avoid it. unknown is safe: you must narrow before use.' },
    ],
    content: `## TypeScript Fundamentals

TypeScript is JavaScript with types. It catches bugs at compile time, provides autocomplete, and makes large codebases maintainable.

### Primitive Types

\`\`\`typescript
const name: string = 'Jordan'
const age: number = 28
const active: boolean = true

// Inference — TypeScript figures out the type
const score = 100     // inferred: number
const label = 'Pro'   // inferred: string
\`\`\`

### Function Types

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}\`
}

const add = (a: number, b: number): number => a + b

function logError(msg: string): void {
  console.error(msg)
}

// Optional parameter
function greetUser(name: string, title?: string): string {
  return title ? \`\${title} \${name}\` : name
}
\`\`\`

### Arrays and Tuples

\`\`\`typescript
const names: string[] = ['Jordan', 'Owen']
const ids: number[] = [1, 2, 3]

// Generic syntax
const tags: Array<string> = ['react', 'typescript']

// Tuple — fixed positions and types
const coord: [number, number] = [12.5, -77.0]
\`\`\`

### any vs unknown

\`\`\`typescript
// any — disables type checking, avoid
let bad: any = 'hello'
bad.toUpperCase()   // no error even if bad is a number

// unknown — safe, must narrow before use
let input: unknown = getInput()
if (typeof input === 'string') {
  console.log(input.toUpperCase())  // OK after narrowing
}
\`\`\`

### Type Aliases

\`\`\`typescript
type UserId = string
type Status = 'active' | 'inactive' | 'pending'

const status: Status = 'active'
// const bad: Status = 'deleted'  // Error — not in union
\`\`\``,
    quiz: [
      { q: 'What does TypeScript type inference do?', options: ['Requires explicit types everywhere', 'Automatically determines the type from the assigned value', 'Makes code slower', 'Only works with primitives'], correct: 1, explanation: 'TypeScript infers types from assigned values. const x = 5 — x is number without writing : number.' },
      { q: 'What is the difference between any and unknown?', options: ['They are identical', 'any disables type checking; unknown is safe — you must narrow it before use', 'unknown is an error type', 'any is for arrays only'], correct: 1, explanation: 'any turns off TypeScript for that variable. unknown keeps type safety — you must check the type before calling methods.' },
      { q: 'What is a tuple?', options: ['An array with any types', 'A fixed-length array with specific types at each position', 'Same as a generic array', 'An object type'], correct: 1, explanation: 'A tuple is a fixed-length array where each position has a specific type: [string, number].' },
      { q: 'When should you add explicit type annotations?', options: ['Never — inference is always better', 'Always', 'For function parameters and return types; let inference handle variables', 'Only in .tsx files'], correct: 2, explanation: 'Annotate function parameters and return types. Let TypeScript infer variable types from assignment.' },
    ],
  },
  {
    id: 'cc-ts-m02', track: 'crash', title: 'Interfaces & Type Aliases',
    subtitle: 'Define the shape of objects with interfaces and type aliases.',
    moduleObjective: 'Define typed object shapes using interfaces and type aliases, and know when to use each.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'Basic',
    xp: 150, duration: 10, module: 2, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'interface', definition: 'Defines the shape of an object. Can be extended and implemented by classes.' },
      { term: 'type alias', definition: 'Names any type — union, intersection, primitive, tuple, function. More flexible than interface.' },
      { term: 'Optional property', definition: 'property?: string — the property may or may not be present.' },
      { term: 'readonly', definition: 'readonly id: string — the property cannot be reassigned after object creation.' },
      { term: 'extends', definition: 'interface Admin extends User — Admin has all User properties plus its own.' },
    ],
    content: `## Interfaces & Type Aliases

TypeScript interfaces and type aliases define the shape of objects — the contract that code must satisfy.

### Interface

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'student'
  bio?: string         // optional
}

const user: User = {
  id: 'user_001',
  name: 'Jordan Morris',
  email: 'jordan@jsupremetech.com',
  role: 'admin',
}
\`\`\`

### Type Alias

\`\`\`typescript
type User = {
  id: string
  name: string
}

// Type aliases can do things interfaces cannot
type StringOrNumber = string | number
type Callback = (err: Error | null, result: string) => void
\`\`\`

### Extending Interfaces

\`\`\`typescript
interface Entity {
  id: string
  createdAt: Date
}

interface Course extends Entity {
  title: string
  xp: number
}
\`\`\`

### readonly Properties

\`\`\`typescript
interface Config {
  readonly apiUrl: string   // cannot change after creation
  debug: boolean            // can change
}

const config: Config = { apiUrl: '/api', debug: false }
// config.apiUrl = '/other'  // Error: read-only
config.debug = true          // OK
\`\`\`

### Intersection Types

\`\`\`typescript
type AdminUser = User & { permissions: string[] }
type BaseEntity = { id: string } & { createdAt: Date }
\`\`\``,
    quiz: [
      { q: 'When should you prefer interface over type alias?', options: ['Never', 'For object shapes — especially when extension and class implementation are needed', 'For union types only', 'When using React'], correct: 1, explanation: 'interface is preferred for object shapes. Supports extends, class implements, and declaration merging.' },
      { q: 'What does property?: string mean?', options: ['Required string property', 'Optional — may or may not be present', 'Null property', 'Accepts any type'], correct: 1, explanation: 'The ? makes a property optional. TypeScript treats it as string | undefined.' },
      { q: 'What does readonly do to a property?', options: ['Makes it private', 'Prevents reassignment after object creation', 'Makes it optional', 'Only works on class properties'], correct: 1, explanation: 'readonly marks a property as immutable after the object is created. Reassignment is a TypeScript error.' },
      { q: 'How do you combine two types with all properties of both?', options: ['interface merge', 'Intersection type with &', 'Union type with |', 'extends keyword'], correct: 1, explanation: 'Intersection type T & U — result has all properties of both T and U.' },
    ],
  },
  {
    id: 'cc-ts-m03', track: 'crash', title: 'Generics',
    subtitle: 'Write reusable, type-safe functions and components that work across multiple types.',
    moduleObjective: 'Write generic functions and interfaces that maintain type safety across different types.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'Masters',
    xp: 175, duration: 11, module: 3, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'Generic', definition: 'A type parameter T filled in when the function or interface is used. Enables reusable, type-safe code.' },
      { term: 'Type Parameter', definition: '<T> declares a generic. Conventional names: T (type), K (key), V (value).' },
      { term: 'Generic Constraint', definition: '<T extends User> — T must extend User. Adds requirements to generic types.' },
      { term: 'Generic Interface', definition: 'interface ApiResponse<T> — the shape is defined once, the data type T varies per use.' },
      { term: 'Type Inference at Call Site', definition: 'TypeScript infers T from the argument: getFirst(["a","b"]) — T is inferred as string.' },
    ],
    content: `## Generics

Generics let you write one function or interface that works with many types — without sacrificing type safety.

### Why Generics

\`\`\`typescript
// Without generics — duplicate for each type
function getFirstStr(arr: string[]): string { return arr[0] }
function getFirstNum(arr: number[]): number { return arr[0] }

// With generics — one function
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

const name = getFirst(['Jordan', 'Owen'])  // T = string
const score = getFirst([100, 95, 87])       // T = number
\`\`\`

### Generic API Response Interface

\`\`\`typescript
interface ApiResponse<T> {
  data: T
  error: string | null
  status: number
}

interface Paginated<T> {
  items: T[]
  total: number
  page: number
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}
\`\`\`

### Generic Constraints

\`\`\`typescript
interface HasId { id: string }

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id)
}

const user = findById(users, 'user_001')     // T = User
const course = findById(courses, 'cc-ts-m01') // T = Course
\`\`\`

### Generic React Components

\`\`\`typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
\`\`\``,
    quiz: [
      { q: 'What problem do generics solve?', options: ['Runtime performance', 'Writing reusable code that works with multiple types while maintaining type safety', 'Async operations', 'Module imports'], correct: 1, explanation: 'Without generics you duplicate functions for each type. Generics write the logic once, type filled in at the call site.' },
      { q: 'What does <T extends HasId> mean?', options: ['T must be exactly HasId', 'T can be any type with at least the properties of HasId', 'T is optional', 'T extends a parent class'], correct: 1, explanation: 'A constraint requires T to be assignable to HasId — T must have at minimum those properties, but can have more.' },
      { q: 'What is the return type of merge<T, U>(a: T, b: U)?', options: ['T', 'U', 'T & U (intersection)', 'T | U (union)'], correct: 2, explanation: 'T & U is an intersection — the result has all properties of both T and U.' },
      { q: 'Where is the generic type T resolved?', options: ['When the interface is defined', 'At the call site — each use can have a different T', 'At compile time globally', 'Only in .tsx files'], correct: 1, explanation: 'T is filled in when the function or interface is actually used — each call site can provide a different T.' },
    ],
  },
  {
    id: 'cc-ts-m04', track: 'crash', title: 'Union, Literal & Discriminated Union Types',
    subtitle: 'Model real-world states precisely with union types, literal types, and discriminated unions.',
    moduleObjective: 'Use union types, literal types, and discriminated unions to model application state safely.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'Masters',
    xp: 175, duration: 11, module: 4, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'Union Type', definition: 'string | number — the value can be either type. Narrowed in conditionals.' },
      { term: 'Literal Type', definition: '"admin" | "user" | "guest" — value must be exactly one of these strings.' },
      { term: 'Discriminated Union', definition: 'Union of objects each with a shared literal property (status: "success" | "error") used to narrow the type.' },
      { term: 'Type Narrowing', definition: 'Using typeof, instanceof, in, or a discriminant to narrow a union within a conditional block.' },
      { term: 'never', definition: 'The empty type — a value that can never exist. Exhaustive switch cases use never to catch unhandled variants.' },
    ],
    content: `## Union, Literal & Discriminated Union Types

TypeScript's most powerful feature for modeling real-world states precisely.

### Union Types

\`\`\`typescript
type StringOrNumber = string | number

function formatId(id: StringOrNumber): string {
  if (typeof id === 'string') {
    return id.toUpperCase()  // id is string here
  }
  return id.toString()       // id is number here
}
\`\`\`

### Literal Types

\`\`\`typescript
type Level = 'Basic' | 'Masters' | 'PhD' | 'Next-Gen AI'
type Status = 'pending' | 'active' | 'cancelled' | 'completed'

const courseLevel: Level = 'Masters'
// const bad: Level = 'Beginner'  // Error — not in union

function setStatus(id: string, status: Status): void { }
setStatus('user_1', 'active')    // OK
// setStatus('user_1', 'removed') // Error
\`\`\`

### Discriminated Union — State Machine Pattern

\`\`\`typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string }

function renderState(state: LoadingState) {
  switch (state.status) {
    case 'idle':    return <div>Ready</div>
    case 'loading': return <Spinner />
    case 'success': return <UserList users={state.data} />   // state.data typed
    case 'error':   return <Error msg={state.message} />     // state.message typed
  }
}
\`\`\`

The discriminant (status) tells TypeScript which variant you are handling — additional properties are typed correctly.

### Exhaustive Checks with never

\`\`\`typescript
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x)
}

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':   return 'Waiting'
    case 'active':    return 'Running'
    case 'cancelled': return 'Stopped'
    case 'completed': return 'Done'
    default:          return assertNever(status)
  }
}
// Add a new Status variant → TypeScript errors at assertNever
\`\`\``,
    quiz: [
      { q: 'What is a discriminated union?', options: ['A union of primitives', 'Union of objects each sharing a literal property used to narrow the type', 'A union that must be exhausted', 'A union with only two variants'], correct: 1, explanation: 'Discriminated unions share a common literal property. TypeScript narrows to the specific variant based on that property.' },
      { q: 'What is type narrowing?', options: ['Making a type smaller in bytes', 'Using conditions to narrow a union to a specific type in a block', 'Removing optional properties', 'Casting with as'], correct: 1, explanation: 'Inside a conditional, TypeScript narrows the type based on the checked condition — safe property access follows.' },
      { q: 'What is the never type for?', options: ['For null values', 'For the empty type — used for exhaustive checks to catch unhandled union variants', 'For async functions', 'For class instances'], correct: 1, explanation: 'never represents something that can never happen. Used in exhaustive switches to error when new variants are added but not handled.' },
      { q: 'Advantage of literal types over plain string?', options: ['Better performance', 'Restricts values to a specific set, catching typos at compile time', 'Required for union types', 'Shorter code'], correct: 1, explanation: 'Literal types ("active" | "pending") catch invalid values at compile time. plain string accepts any string.' },
    ],
  },
  {
    id: 'cc-ts-m05', track: 'crash', title: 'Utility Types',
    subtitle: 'Use TypeScript built-in utility types to transform and compose existing types.',
    moduleObjective: 'Apply Partial, Readonly, Pick, Omit, and Record utility types to transform existing types.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'Masters',
    xp: 175, duration: 10, module: 5, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'Partial<T>', definition: 'Makes all properties of T optional. Used for update payloads.' },
      { term: 'Required<T>', definition: 'Makes all properties of T required. Removes all ?.' },
      { term: 'Readonly<T>', definition: 'Makes all properties of T readonly. Prevents mutation.' },
      { term: 'Pick<T, K>', definition: 'Creates a new type with only the specified keys from T.' },
      { term: 'Omit<T, K>', definition: 'Creates a new type with all keys of T except K.' },
    ],
    content: `## Utility Types

TypeScript ships with utility types that transform existing types — no need to rewrite manually.

### Partial and Required

\`\`\`typescript
interface User { id: string; name: string; email: string; bio: string }

type UserUpdate = Partial<User>
// { id?: string; name?: string; email?: string; bio?: string }

async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return fetch(\`/api/users/\${id}\`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then(r => r.json())
}
\`\`\`

### Pick and Omit

\`\`\`typescript
interface User {
  id: string; name: string; email: string
  passwordHash: string; bio: string
}

// Only these fields
type PublicUser = Pick<User, 'id' | 'name' | 'bio'>

// Everything except passwordHash
type SafeUser = Omit<User, 'passwordHash'>
\`\`\`

### Record

\`\`\`typescript
type TrackColors = Record<'tech' | 'marketing' | 'trading', string>

const colors: TrackColors = {
  tech: '#378add', marketing: '#c9a84c', trading: '#2d8a4e',
}

// Dynamic lookup map
type CourseLookup = Record<string, Course>
const byId: CourseLookup = {}
courses.forEach(c => { byId[c.id] = c })
\`\`\`

### ReturnType and Parameters

\`\`\`typescript
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email, createdAt: new Date() }
}

type NewUser = ReturnType<typeof createUser>
// { id: string; name: string; email: string; createdAt: Date }
\`\`\`

### Combining Utility Types

\`\`\`typescript
type CourseForm = Partial<Omit<Course, 'id' | 'createdAt'>>
type ImmutableConfig = Readonly<Record<string, string>>
\`\`\``,
    quiz: [
      { q: 'When should you use Partial<T>?', options: ['When all fields are required', 'For update/patch payloads where only some fields change', 'When creating a new record', 'For read-only data'], correct: 1, explanation: 'Partial makes all properties optional — ideal for PATCH endpoints or form state.' },
      { q: 'What does Omit<User, "passwordHash"> produce?', options: ['A type with only passwordHash', 'A User type with every property except passwordHash', 'An error', 'Same as User'], correct: 1, explanation: 'Omit creates a new type with all the keys of T except the ones specified.' },
      { q: 'What is Record<string, Course> used for?', options: ['A list of courses', 'A map from string keys to Course values', 'A typed array', 'A union of course types'], correct: 1, explanation: 'Record<K, V> creates an object type where keys are type K and values are type V — a typed map.' },
      { q: 'What does ReturnType<typeof fn> extract?', options: ['The function parameters', 'The type that the function returns', 'The function itself', 'The function name'], correct: 1, explanation: 'ReturnType extracts the return type of a function.' },
    ],
  },
  {
    id: 'cc-ts-m06', track: 'crash', title: 'TypeScript in React & Next.js',
    subtitle: 'Type React components, props, hooks, and event handlers correctly.',
    moduleObjective: 'Type React component props, hooks, refs, and event handlers using TypeScript conventions.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'Masters',
    xp: 175, duration: 12, module: 6, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'ComponentProps', definition: 'Annotate a functional component with explicit prop types rather than React.FC.' },
      { term: 'useState type', definition: 'useState<number>(0) — generic fills in when inference fails (null initial value).' },
      { term: 'useRef type', definition: 'useRef<HTMLInputElement>(null) — types the ref to a specific DOM element.' },
      { term: 'Event types', definition: 'React.ChangeEvent<HTMLInputElement>, React.FormEvent<HTMLFormElement>, React.MouseEvent.' },
      { term: 'children prop', definition: 'children: React.ReactNode — accepts any valid JSX.' },
    ],
    content: `## TypeScript in React & Next.js

Every component, hook, and event handler has proper TypeScript types.

### Component Props

\`\`\`typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  children?: React.ReactNode
}

export function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
\`\`\`

### useState with Types

\`\`\`typescript
const [count, setCount] = useState(0)              // inferred: number
const [name, setName] = useState('')               // inferred: string

// Generic needed when initial value is null
const [user, setUser] = useState<User | null>(null)
const [courses, setCourses] = useState<Course[]>([])
\`\`\`

### useRef for DOM Elements

\`\`\`typescript
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

return <input ref={inputRef} type="text" />
\`\`\`

### Event Handlers

\`\`\`typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation()
}
\`\`\`

### Next.js App Router Types

\`\`\`typescript
interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CoursePage({ params }: PageProps) {
  const course = getCourse(params.id)
  if (!course) notFound()
  return <CourseView course={course} />
}
\`\`\``,
    quiz: [
      { q: 'How do you type a useState holding a User or null?', options: ['useState(null)', 'useState<User | null>(null)', 'useState({ type: User })', 'useState<User>()'], correct: 1, explanation: 'When initial value is null, TypeScript cannot infer the type — provide the generic: useState<User | null>(null).' },
      { q: 'What type should a change event handler on an input use?', options: ['Event', 'React.ChangeEvent<HTMLInputElement>', 'InputEvent', 'KeyboardEvent'], correct: 1, explanation: 'React.ChangeEvent<HTMLInputElement> gives typed access to e.target.value as a string.' },
      { q: 'How do you type a useRef for an input element?', options: ['useRef()', 'useRef<Element>(null)', 'useRef<HTMLInputElement>(null)', 'useRef<input>()'], correct: 2, explanation: 'useRef<HTMLInputElement>(null) types the ref to HTMLInputElement, giving typed DOM access.' },
      { q: 'What does React.ReactNode accept?', options: ['Only strings', 'Only JSX elements', 'Any valid JSX — strings, numbers, elements, arrays, null', 'Only components'], correct: 2, explanation: 'React.ReactNode is the widest type — accepts strings, numbers, elements, arrays, null, undefined.' },
    ],
  },
  {
    id: 'cc-ts-m07', track: 'crash', title: 'Type Guards & Narrowing',
    subtitle: 'Write type-safe code by narrowing types at runtime through guards and discriminants.',
    moduleObjective: 'Implement type guards, custom type predicates, and assertion functions to safely narrow types.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'PhD',
    xp: 200, duration: 11, module: 7, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'Type Guard', definition: 'A runtime check that narrows a type: typeof, instanceof, in operator, discriminant check.' },
      { term: 'Type Predicate', definition: 'function isUser(x: unknown): x is User — tells TypeScript the type after a true return.' },
      { term: 'Assertion Function', definition: 'function assert(cond: boolean): asserts cond — TypeScript trusts the code after this call.' },
      { term: 'in operator', definition: '"email" in obj — checks if a property exists. Narrows to the type with that property.' },
      { term: 'instanceof', definition: 'err instanceof Error — narrows to Error type. Used in catch blocks.' },
    ],
    content: `## Type Guards & Narrowing

TypeScript narrows types based on control flow — inside a conditional, the type is automatically refined.

### Built-in Guards

\`\`\`typescript
function process(value: string | number | null) {
  if (value === null) { return }

  if (typeof value === 'string') {
    return value.toUpperCase()  // value is string here
  }
  return value * 2               // value is number here
}
\`\`\`

### instanceof Guard

\`\`\`typescript
try {
  const res = await fetch(url)
  return await res.text()
} catch (err) {
  if (err instanceof Error) {
    return \`Error: \${err.message}\`  // err.message is typed
  }
  return 'Unknown error'
}
\`\`\`

### in Operator Guard

\`\`\`typescript
interface Dog { bark(): void }
interface Cat { meow(): void }
type Pet = Dog | Cat

function makeNoise(pet: Pet) {
  if ('bark' in pet) {
    pet.bark()  // TypeScript: pet is Dog
  } else {
    pet.meow()  // TypeScript: pet is Cat
  }
}
\`\`\`

### Custom Type Predicate

\`\`\`typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' && obj !== null &&
    'id' in obj && 'email' in obj
  )
}

function processResponse(data: unknown) {
  if (isUser(data)) {
    console.log(data.email)  // fully typed
  }
}
\`\`\`

### Assertion Functions

\`\`\`typescript
function assertDefined<T>(val: T | null | undefined, name: string): asserts val is T {
  if (val == null) throw new Error(\`\${name} is required\`)
}

function render(userId: string | null) {
  assertDefined(userId, 'userId')
  fetchUser(userId)  // TypeScript: userId is string here
}
\`\`\``,
    quiz: [
      { q: 'What is a type predicate?', options: ['A runtime assertion', 'A function returning x is Type — tells TypeScript the narrowed type on true', 'A TypeScript decorator', 'A generic constraint'], correct: 1, explanation: 'Type predicates (x is User) in return type tell TypeScript: if this returns true, x is that type.' },
      { q: 'When should you use instanceof?', options: ['For primitive types', 'For class instances and Error objects', 'Only in try/catch', 'For interface types'], correct: 1, explanation: 'instanceof checks if an object is an instance of a class — ideal for Error subclasses in catch blocks.' },
      { q: 'What does the in operator do for narrowing?', options: ['Checks if value is in array', 'Narrows to the type that has the specified property', 'Checks inheritance', 'Required for object types'], correct: 1, explanation: '"bark" in pet checks if the property exists. TypeScript narrows to types that have bark.' },
      { q: 'What does asserts cond do in a return type?', options: ['Throws an error always', 'Tells TypeScript: if this returns normally, cond is true — code after benefits from narrowing', 'Makes function async', 'Required for throw'], correct: 1, explanation: 'asserts cond tells TypeScript the condition holds after a normal return — code after the call is narrowed.' },
    ],
  },
  {
    id: 'cc-ts-m08', track: 'crash', title: 'tsconfig, Strict Mode & Modules',
    subtitle: 'Configure TypeScript correctly for a Next.js project with strict mode and path aliases.',
    moduleObjective: 'Configure tsconfig.json with strict mode, path aliases, and module settings for a Next.js project.',
    courseObjective: CC_TS_OBJ, crashId: 'cc-ts', crashTitle: 'TypeScript', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'TypeScript Crash Course',
    keyTerms: [
      { term: 'tsconfig.json', definition: 'TypeScript compiler configuration. Controls strictness, module format, and path aliases.' },
      { term: 'strict mode', definition: '"strict": true enables strictNullChecks, noImplicitAny, strictFunctionTypes. Always enable in new projects.' },
      { term: 'strictNullChecks', definition: 'Prevents passing null/undefined where a non-null type is expected. Catches most null-reference bugs.' },
      { term: 'paths / baseUrl', definition: 'Path aliases: "@/components/*" maps to "src/components/*". Eliminates ../../ imports.' },
      { term: 'noEmit', definition: '"noEmit": true — run type checking without generating JS. Used for npx tsc --noEmit CI checks.' },
    ],
    content: `## tsconfig, Strict Mode & Modules

A properly configured tsconfig.json is the foundation of a safe TypeScript codebase.

### Next.js tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
\`\`\`

### strict Mode

\`\`\`typescript
// strictNullChecks — null is separate
function getUser(id: string): User | null { return null }
const user = getUser('u1')
// user.name     // Error: user is possibly null
user?.name        // OK — optional chaining

// noImplicitAny — parameters must have types
// function process(data) { }  // Error: data has implicit any
function process(data: unknown) { }  // OK
\`\`\`

### Path Aliases

\`\`\`typescript
// Without alias — brittle relative imports
import { Button } from '../../../components/ui/Button'

// With "@/*": ["./src/*"]
import { Button } from '@/components/ui/Button'
import { COURSES } from '@/lib/courses'
import { cn } from '@/lib/utils'
\`\`\`

### Type Check Commands

\`\`\`bash
# Check types without building
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
\`\`\`

Empty output = no errors. Use in CI to gate deployments.`,
    quiz: [
      { q: 'What does "strict": true enable?', options: ['Only type checking', 'strictNullChecks, noImplicitAny, strictFunctionTypes — always enable in new projects', 'Prevents using any', 'Only in production'], correct: 1, explanation: 'strict is a shorthand for several strictness flags. Most importantly strictNullChecks (null safety) and noImplicitAny.' },
      { q: 'What does noEmit do?', options: ['Stops compilation', 'Runs type checking without generating JS output', 'Removes type annotations', 'Disables source maps'], correct: 1, explanation: 'noEmit: true tells TypeScript to check types but not write output — used for CI type-checking.' },
      { q: 'What do path aliases like "@/*" enable?', options: ['Faster compilation', 'Absolute imports like @/components/Button instead of ../../../components/Button', 'Dynamic imports only', 'Required for Next.js'], correct: 1, explanation: 'Path aliases eliminate brittle relative imports and make refactoring easier.' },
      { q: 'What does strictNullChecks prevent?', options: ['Using null', 'Passing null/undefined to functions expecting non-null without explicit handling', 'Optional properties', 'Implicit returns'], correct: 1, explanation: 'strictNullChecks makes null and undefined separate types. You must handle null cases explicitly.' },
    ],
  },
]
