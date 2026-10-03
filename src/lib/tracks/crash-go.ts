import type { Course } from '../courses'

const COURSE_OBJECTIVE =
  'Master Go from zero to production — understand the language runtime, write idiomatic concurrent code, and ship a working REST API by the final module.'

export const crashGoCourses: Course[] = [
  // ── Module 1 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m01',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Environment & Hello World',
    subtitle: 'Install Go, configure VS Code, run your first program',
    level: 'Basic',
    xp: 155,
    duration: 20,
    module: 1,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Install Go and the VS Code extension, understand the workspace layout, and successfully run and build a Hello World program.',
    keyTerms: [
      { term: 'GOPATH', definition: 'Legacy workspace root directory; Go modules have largely replaced it but the env var still exists.' },
      { term: 'go run', definition: 'Compiles and executes a Go source file in one step without producing a binary on disk.' },
      { term: 'go build', definition: 'Compiles Go source into a native binary; the output is platform-specific.' },
      { term: 'package main', definition: 'The entry-point package; every executable Go program must have one.' },
      { term: 'fmt.Println', definition: 'Standard-library function that writes a line to stdout with a newline appended.' },
      { term: 'gopls', definition: 'The official Go language server powering autocomplete, navigation, and diagnostics in VS Code.' },
    ],
    content: `## Setting Up Go

### 1. Install Go

Download the installer for your OS from **https://go.dev/dl** (current LTS: 1.22+).

After installation verify:

\`\`\`bash
go version
# go version go1.22.3 linux/amd64
\`\`\`

### 2. VS Code Setup

Install the **Go** extension by the Go Team at Google (extension id: \`golang.go\`).

On first open VS Code will prompt you to install tools — click **Install All**. This pulls in \`gopls\`, \`dlv\` (debugger), \`staticcheck\`, and friends.

### 3. Your First Program

Create a directory and enter it:

\`\`\`bash
mkdir hello && cd hello
go mod init example.com/hello
\`\`\`

Create \`main.go\`:

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
\`\`\`

Run it without producing a binary:

\`\`\`bash
go run main.go
# Hello, World!
\`\`\`

Build a native binary:

\`\`\`bash
go build -o hello .
./hello
# Hello, World!
\`\`\`

### 4. What Just Happened

Every Go source file begins with a \`package\` declaration. The \`main\` package is special — its \`main()\` function is the program entry point. The \`import\` block pulls in packages from the standard library or external modules. \`fmt\` is Go's formatting package.

Go compiles to a statically linked binary — no runtime or VM needed on the target machine. That is why Go binaries are often used for CLI tools and microservices.

### 5. go mod init

\`go mod init\` creates \`go.mod\`, which declares the module path and the minimum Go version. Think of it as Go's \`package.json\`. You will not need to touch it manually for simple programs, but understanding it is essential for multi-file projects.

\`\`\`
module example.com/hello

go 1.22
\`\`\`

### 6. Formatting

Go ships with an official formatter. Run it at any time:

\`\`\`bash
go fmt ./...
\`\`\`

The VS Code extension runs this on save automatically.`,
    quiz: [
      {
        q: 'Which command compiles Go source AND runs it in one step?',
        options: ['go build', 'go run', 'go exec', 'go start'],
        correct: 1,
        explanation: '`go run` compiles in a temp directory and executes immediately — no binary is saved to your working directory.',
      },
      {
        q: 'What must every executable Go program contain?',
        options: [
          'A file named index.go',
          'A package named app with a Start() function',
          'A package named main with a main() function',
          'An import of the "os" package',
        ],
        correct: 2,
        explanation: 'Go requires `package main` and a `func main()` as the program entry point.',
      },
      {
        q: 'What does `go mod init example.com/myapp` create?',
        options: ['A binary named myapp', 'A go.sum file', 'A go.mod file declaring the module path', 'A vendor directory'],
        correct: 2,
        explanation: '`go mod init` creates `go.mod` which declares the module path and minimum Go version.',
      },
      {
        q: 'What is gopls?',
        options: [
          "Go's package manager",
          "Go's official language server for IDE features",
          'A linter that replaces staticcheck',
          "Go's built-in test runner",
        ],
        correct: 1,
        explanation: 'gopls is the Go language server — it powers autocomplete, go-to-definition, and inline diagnostics in VS Code.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Modify the starter code so it prints your name and the current Go version string (use `runtime.Version()` from the "runtime" package). The output should look like: "Hello, I am Jordan. Go version: go1.22.3"',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	// TODO: print your name and Go version
	// Use fmt.Printf or fmt.Println
	// runtime.Version() returns the version string
	fmt.Println("Hello, World!")
	fmt.Println(runtime.Version())
}
`,
        },
      ],
    },
  },

  // ── Module 2 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m02',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Variables, Types & Pointers',
    subtitle: 'Static typing, zero values, and direct memory addressing',
    level: 'Basic',
    xp: 160,
    duration: 25,
    module: 2,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Declare variables using both short and long form, understand Go\'s built-in types and zero values, and use pointers to modify values through references.',
    keyTerms: [
      { term: 'Short variable declaration (:=)', definition: 'Declares and infers type in one statement — only valid inside functions.' },
      { term: 'Zero value', definition: 'Go initializes every variable to a type-specific zero: 0 for numbers, "" for strings, false for bool, nil for pointers/slices/maps.' },
      { term: 'Pointer (*T)', definition: 'A variable that holds the memory address of another variable of type T.' },
      { term: 'Address-of operator (&)', definition: 'Returns the memory address of a variable, producing a pointer.' },
      { term: 'Dereference (*)', definition: 'Reads or writes the value at the address a pointer holds.' },
      { term: 'const', definition: 'A compile-time constant — its value cannot change; Go evaluates it at compile time.' },
    ],
    content: `## Variables, Types, and Pointers

### Declaring Variables

Go is statically typed — every variable has a fixed type determined at compile time.

\`\`\`go
package main

import "fmt"

func main() {
    // Long form: explicit type
    var name string = "Jordan"
    var age  int    = 28

    // Short form: type inferred (only inside functions)
    city   := "Kingston"
    score  := 98.5 // float64

    fmt.Println(name, age, city, score)
}
\`\`\`

### Built-in Types

| Category | Types |
|----------|-------|
| Integer  | int, int8, int16, int32, int64, uint, uint8 … |
| Float    | float32, float64 |
| String   | string (immutable UTF-8 bytes) |
| Bool     | bool |
| Byte     | byte (alias for uint8) |
| Rune     | rune (alias for int32, represents a Unicode code point) |

### Zero Values

Every Go variable is automatically initialized:

\`\`\`go
var i int     // 0
var f float64 // 0.0
var s string  // ""
var b bool    // false
var p *int    // nil
\`\`\`

This eliminates a huge class of "uninitialized variable" bugs common in C/C++.

### Constants

\`\`\`go
const Pi      = 3.14159
const MaxSize = 1024
const Greeting = "Hello"
\`\`\`

### Pointers

A pointer stores a memory address. Use \`&\` to get an address and \`*\` to read/write through it.

\`\`\`go
package main

import "fmt"

func increment(n *int) {
    *n = *n + 1 // dereference and modify
}

func main() {
    x := 10
    fmt.Println("before:", x) // 10

    increment(&x)              // pass address of x
    fmt.Println("after:", x)  // 11

    // Pointer variable
    p := &x
    fmt.Println("address:", p)  // 0xc000...
    fmt.Println("via ptr:", *p) // 11
}
\`\`\`

Go does NOT have pointer arithmetic (no \`p++\`). Pointers are safe — the garbage collector tracks them.

### new() vs &

\`\`\`go
p1 := new(int)   // allocates, returns *int pointing to 0
*p1 = 42

x  := 42
p2 := &x         // pointer to existing variable
\`\`\`

Both produce \`*int\` but \`new\` allocates fresh memory while \`&\` takes the address of a named variable.`,
    quiz: [
      {
        q: 'What is the zero value of a string in Go?',
        options: ['nil', 'null', '""', '0'],
        correct: 2,
        explanation: 'Go initializes strings to empty string `""` — not nil, not null.',
      },
      {
        q: 'Which declaration is only valid INSIDE a function?',
        options: ['var x int = 5', 'const X = 5', 'x := 5', 'var x = 5'],
        correct: 2,
        explanation: 'The short declaration `:=` is syntactic sugar that can only be used inside function bodies.',
      },
      {
        q: 'What does the & operator do?',
        options: [
          'Dereferences a pointer',
          'Returns the memory address of a variable',
          'Performs bitwise AND',
          'Declares a reference type',
        ],
        correct: 1,
        explanation: '`&x` returns the memory address of `x`, producing a pointer of type `*T` where T is the type of x.',
      },
      {
        q: 'What is the type of `3.14` when inferred via `:=`?',
        options: ['float32', 'float64', 'double', 'decimal'],
        correct: 1,
        explanation: 'Go infers untyped floating-point literals as `float64` by default.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Write a function `double(n *int)` that doubles the value at the pointer in place. Call it from main with x = 7 and print the result (should be 14). Then declare a const named MaxScore = 100 and print it.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import "fmt"

// TODO: declare const MaxScore = 100

// TODO: write func double(n *int) that doubles *n in place

func main() {
	x := 7
	// TODO: call double with &x
	fmt.Println(x) // should print 14

	// TODO: print MaxScore
}
`,
        },
      ],
    },
  },

  // ── Module 3 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m03',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Functions, Multiple Returns & Errors',
    subtitle: 'First-class functions, named returns, and idiomatic error handling',
    level: 'Masters',
    xp: 170,
    duration: 30,
    module: 3,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Write functions with multiple return values, use Go\'s idiomatic error pattern, and understand how defer works.',
    keyTerms: [
      { term: 'Multiple return values', definition: 'Go functions can return more than one value — the standard pattern is (result, error).' },
      { term: 'error interface', definition: 'Built-in interface with a single Error() string method; nil means success.' },
      { term: 'errors.New', definition: 'Creates a simple error value from a string message.' },
      { term: 'fmt.Errorf', definition: 'Creates a formatted error, supports %w to wrap an existing error.' },
      { term: 'defer', definition: 'Schedules a function call to execute when the surrounding function returns — runs LIFO.' },
      { term: 'variadic function', definition: 'A function accepting a variable number of arguments with the `...T` syntax.' },
    ],
    content: `## Functions, Multiple Returns & Errors

### Basic Functions

\`\`\`go
func add(a, b int) int {
    return a + b
}

// Multiple params of same type can share type annotation
func multiply(a, b int) int {
    return a * b
}
\`\`\`

### Multiple Return Values

Go's killer feature for error handling — return both result and error:

\`\`\`go
package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 3)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Printf("Result: %.2f\\n", result) // 3.33
}
\`\`\`

The convention is **always check err immediately after the call**. Never ignore errors.

### fmt.Errorf with Wrapping

\`\`\`go
func readUser(id int) (*User, error) {
    u, err := db.Find(id)
    if err != nil {
        return nil, fmt.Errorf("readUser %d: %w", id, err)
    }
    return u, nil
}
\`\`\`

\`%w\` wraps the original error, allowing callers to use \`errors.Is\` and \`errors.As\` to inspect it.

### Named Return Values

\`\`\`go
func minMax(nums []int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums {
        if n < min { min = n }
        if n > max { max = n }
    }
    return // "naked return" — returns named values
}
\`\`\`

Use named returns sparingly — they're best for short functions where the names serve as documentation.

### Variadic Functions

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

// Call with individual args or a slice
fmt.Println(sum(1, 2, 3))       // 6
nums := []int{4, 5, 6}
fmt.Println(sum(nums...))       // 15
\`\`\`

### defer

\`defer\` runs a call when the enclosing function exits — invaluable for cleanup:

\`\`\`go
func readFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close() // guaranteed to run even if we return early

    // read from f ...
    return nil
}
\`\`\`

Multiple defers run in LIFO order (last deferred, first executed).

### First-Class Functions

Functions are values in Go:

\`\`\`go
apply := func(f func(int) int, x int) int {
    return f(x)
}

double := func(n int) int { return n * 2 }
fmt.Println(apply(double, 5)) // 10
\`\`\``,
    quiz: [
      {
        q: 'What is the idiomatic way to signal success in Go\'s error return pattern?',
        options: ['return "", false', 'return result, nil', 'return result, 0', 'throw nil'],
        correct: 1,
        explanation: 'In Go, `nil` for the error return value means success. Non-nil means failure.',
      },
      {
        q: 'When does a deferred function call execute?',
        options: [
          'At the top of the function, before any other statement',
          'Immediately when defer is encountered',
          'When the surrounding function returns',
          'On the next garbage collection cycle',
        ],
        correct: 2,
        explanation: '`defer` schedules the call to run just before the enclosing function returns, regardless of how it returns.',
      },
      {
        q: 'What does `%w` do in fmt.Errorf?',
        options: [
          'Prints the error in bold',
          'Wraps an existing error so errors.Is/As can inspect it',
          'Converts the error to a warning',
          'Prints the error type name',
        ],
        correct: 1,
        explanation: '`%w` wraps the error value, preserving the chain. `errors.Is` traverses wrapped chains to find a target error.',
      },
      {
        q: 'How do you pass a slice `s` to a variadic function `f(...int)`?',
        options: ['f(s)', 'f(&s)', 'f(s...)', 'f(*s)'],
        correct: 2,
        explanation: 'The `...` suffix unpacks a slice into individual arguments: `f(s...)`.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Write a function `safeSqrt(x float64) (float64, error)` that returns an error if x is negative, otherwise returns the square root. Use `math.Sqrt`. In main, test it with -4 and 16, printing the results or errors.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import (
	"errors"
	"fmt"
	"math"
)

// TODO: write safeSqrt(x float64) (float64, error)
// Return an error if x < 0, otherwise math.Sqrt(x)
func safeSqrt(x float64) (float64, error) {
	if x < 0 {
		return 0, errors.New("cannot take sqrt of negative number")
	}
	return math.Sqrt(x), nil
}

func main() {
	// Test with -4 (should error)
	r1, err1 := safeSqrt(-4)
	if err1 != nil {
		fmt.Println("Error:", err1)
	} else {
		fmt.Printf("sqrt(-4) = %.2f\\n", r1)
	}

	// Test with 16 (should return 4)
	r2, err2 := safeSqrt(16)
	if err2 != nil {
		fmt.Println("Error:", err2)
	} else {
		fmt.Printf("sqrt(16) = %.2f\\n", r2)
	}
}
`,
        },
      ],
    },
  },

  // ── Module 4 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m04',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Structs, Methods & Interfaces',
    subtitle: 'Compose data, attach behaviour, and write polymorphic code',
    level: 'Masters',
    xp: 175,
    duration: 35,
    module: 4,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Define structs and attach methods to them, implement interfaces implicitly, and use interfaces to write polymorphic functions.',
    keyTerms: [
      { term: 'struct', definition: 'A composite data type that groups named fields — Go\'s equivalent of a class without inheritance.' },
      { term: 'method', definition: 'A function with a receiver argument — attaches behaviour to a type.' },
      { term: 'value receiver', definition: 'Method receives a copy of the struct — changes do not affect the original.' },
      { term: 'pointer receiver', definition: 'Method receives a pointer — changes affect the original; preferred for mutation and large structs.' },
      { term: 'interface', definition: 'A type defined by a set of method signatures; any type implementing those methods satisfies the interface — no `implements` keyword.' },
      { term: 'embedding', definition: 'Nesting one struct (or interface) inside another to compose behaviour without inheritance.' },
    ],
    content: `## Structs, Methods & Interfaces

### Structs

\`\`\`go
type User struct {
    ID    int
    Name  string
    Email string
    Admin bool
}

// Struct literal
u := User{ID: 1, Name: "Jordan", Email: "j@example.com"}
fmt.Println(u.Name) // Jordan

// Anonymous struct (useful for quick groupings)
point := struct{ X, Y int }{X: 3, Y: 4}
\`\`\`

### Methods

\`\`\`go
// Value receiver — operates on a copy
func (u User) String() string {
    return fmt.Sprintf("User(%d, %s)", u.ID, u.Name)
}

// Pointer receiver — can mutate the struct
func (u *User) Promote() {
    u.Admin = true
}

func main() {
    u := User{ID: 1, Name: "Jordan"}
    fmt.Println(u.String()) // User(1, Jordan)
    u.Promote()
    fmt.Println(u.Admin)    // true
}
\`\`\`

Use pointer receivers for methods that mutate state or for large structs (avoids copying).

### Interfaces

An interface is a contract. Any type that has all the required methods satisfies it automatically:

\`\`\`go
type Shape interface {
    Area()      float64
    Perimeter() float64
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

// Polymorphic function — works with any Shape
func printShape(s Shape) {
    fmt.Printf("Area: %.2f  Perimeter: %.2f\\n", s.Area(), s.Perimeter())
}

func main() {
    printShape(Rectangle{3, 4})
    printShape(Circle{5})
}
\`\`\`

### The Empty Interface

\`interface{}\` (or \`any\` in Go 1.18+) is satisfied by every type — use it only when you genuinely need a container of mixed types.

### Embedding

\`\`\`go
type Animal struct {
    Name string
}

func (a Animal) Speak() string { return "..." }

type Dog struct {
    Animal           // embedded — Dog gets Speak() for free
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Lab"}
fmt.Println(d.Speak()) // ...  (promoted method)
fmt.Println(d.Name)    // Rex  (promoted field)
\`\`\`

### Stringer Interface

If your type implements \`String() string\` it satisfies \`fmt.Stringer\` and fmt.Println will call it automatically — exactly like Java's \`toString()\`.`,
    quiz: [
      {
        q: 'When should you use a pointer receiver instead of a value receiver?',
        options: [
          'Always — pointer receivers are always faster',
          'When the method needs to mutate the struct or the struct is large',
          'When the struct has no fields',
          'Only for exported methods',
        ],
        correct: 1,
        explanation: 'Pointer receivers avoid copying the struct and allow mutation. For small read-only methods, value receivers are fine.',
      },
      {
        q: 'How does a type satisfy a Go interface?',
        options: [
          'By using the `implements` keyword',
          'By inheriting from the interface',
          'By registering with the runtime',
          'By implementing all methods defined in the interface',
        ],
        correct: 3,
        explanation: 'Go uses structural (implicit) interface satisfaction — no declaration needed, just implement the methods.',
      },
      {
        q: 'What is `any` in Go 1.18+?',
        options: ['A new number type', 'An alias for `interface{}`', 'A generic constraint', 'A null safety keyword'],
        correct: 1,
        explanation: '`any` is an alias for `interface{}` introduced in Go 1.18 to improve readability.',
      },
      {
        q: 'What does embedding a struct inside another struct accomplish?',
        options: [
          'It creates a subclass relationship',
          'It copies all fields and methods into the outer struct (composition)',
          'It creates a pointer reference to the inner struct',
          'It makes the inner struct private',
        ],
        correct: 1,
        explanation: 'Embedding promotes the inner type\'s fields and methods to the outer type — composition without inheritance.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Define a `Vehicle` interface with `Speed() float64` and `Fuel() string` methods. Implement it with two structs: `Car` (speed 120, fuel "petrol") and `ElectricBike` (speed 45, fuel "electric"). Write a `describe(v Vehicle)` function and call it for both.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import "fmt"

type Vehicle interface {
	Speed() float64
	Fuel() string
}

type Car struct {
	Model string
}

func (c Car) Speed() float64 { return 120 }
func (c Car) Fuel() string   { return "petrol" }

type ElectricBike struct {
	Brand string
}

func (e ElectricBike) Speed() float64 { return 45 }
func (e ElectricBike) Fuel() string   { return "electric" }

func describe(v Vehicle) {
	fmt.Printf("Speed: %.0f km/h | Fuel: %s\\n", v.Speed(), v.Fuel())
}

func main() {
	describe(Car{Model: "Toyota"})
	describe(ElectricBike{Brand: "Rad"})
}
`,
        },
      ],
    },
  },

  // ── Module 5 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m05',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Goroutines & Channels',
    subtitle: 'Lightweight concurrency, communication, and synchronization',
    level: 'Masters',
    xp: 180,
    duration: 40,
    module: 5,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Launch goroutines with the go keyword, communicate between them using channels, and prevent race conditions with WaitGroups and mutexes.',
    keyTerms: [
      { term: 'goroutine', definition: 'A lightweight user-space thread managed by the Go runtime — starting one costs ~2 KB of stack.' },
      { term: 'channel', definition: 'A typed conduit for sending values between goroutines — synchronization built in.' },
      { term: 'buffered channel', definition: 'A channel with a capacity; sends do not block until the buffer is full.' },
      { term: 'select', definition: 'A switch-like construct for handling multiple channel operations; picks whichever is ready.' },
      { term: 'sync.WaitGroup', definition: 'Tracks a count of goroutines; Wait() blocks until the count reaches zero.' },
      { term: 'sync.Mutex', definition: 'Mutual exclusion lock — Lock/Unlock protect a shared variable from concurrent access.' },
    ],
    content: `## Goroutines & Channels

### Launching a Goroutine

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    fmt.Printf("Hello, %s!\\n", name)
}

func main() {
    go sayHello("Alice") // runs concurrently
    go sayHello("Bob")
    time.Sleep(100 * time.Millisecond) // crude sync — don't do this in production
}
\`\`\`

### Channels

Channels replace shared memory. Send with \`<-\` and receive with \`<-\`:

\`\`\`go
ch := make(chan int) // unbuffered

go func() {
    ch <- 42 // send (blocks until receiver is ready)
}()

v := <-ch // receive (blocks until sender sends)
fmt.Println(v) // 42
\`\`\`

### WaitGroup (production sync)

\`\`\`go
package main

import (
    "fmt"
    "sync"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done() // decrement counter when done
    fmt.Printf("Worker %d finished\\n", id)
}

func main() {
    var wg sync.WaitGroup
    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }
    wg.Wait() // blocks until all Done() calls are made
    fmt.Println("All workers finished")
}
\`\`\`

### Buffered Channels

\`\`\`go
ch := make(chan string, 3) // buffer of 3

ch <- "a" // does not block
ch <- "b"
ch <- "c"
// ch <- "d" // would block — buffer full

fmt.Println(<-ch) // a
fmt.Println(<-ch) // b
\`\`\`

### select Statement

\`\`\`go
func main() {
    ch1 := make(chan string, 1)
    ch2 := make(chan string, 1)

    ch1 <- "one"
    ch2 <- "two"

    select {
    case msg := <-ch1:
        fmt.Println("Received from ch1:", msg)
    case msg := <-ch2:
        fmt.Println("Received from ch2:", msg)
    }
}
\`\`\`

### Mutex for Shared State

When goroutines share mutable state, protect it with a mutex:

\`\`\`go
type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    c.v[key]++
    c.mu.Unlock()
}
\`\`\`

### Closing Channels & Range

\`\`\`go
ch := make(chan int, 5)
for i := 0; i < 5; i++ { ch <- i }
close(ch)

for v := range ch { // loops until channel is closed
    fmt.Println(v)
}
\`\`\``,
    quiz: [
      {
        q: 'How much stack space does a goroutine start with (approximately)?',
        options: ['1 MB', '8 KB', '2 KB', '64 KB'],
        correct: 2,
        explanation: 'Goroutines start with ~2 KB and grow on demand — this allows running millions of them simultaneously.',
      },
      {
        q: 'What happens when you send to an unbuffered channel with no receiver waiting?',
        options: [
          'The send is silently dropped',
          'A panic occurs',
          'The sending goroutine blocks until a receiver is ready',
          'The value is stored in a temporary buffer',
        ],
        correct: 2,
        explanation: 'Unbuffered channels synchronize sender and receiver — the sender blocks until the receiver is ready.',
      },
      {
        q: 'What does `wg.Done()` do in a sync.WaitGroup?',
        options: ['Terminates all goroutines', 'Decrements the WaitGroup counter by 1', 'Signals an error', 'Closes the WaitGroup'],
        correct: 1,
        explanation: '`Done()` decrements the counter. When it reaches zero, `Wait()` returns.',
      },
      {
        q: 'What does `select` do when multiple channels are ready simultaneously?',
        options: [
          'It panics',
          'It picks the first one listed',
          'It picks one at random',
          'It executes all matching cases',
        ],
        correct: 2,
        explanation: 'When multiple cases are ready, `select` chooses one at random — this prevents starvation.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Launch 3 goroutines each computing the square of a number (1, 2, 3). Use a channel to collect the results and print them. Use sync.WaitGroup to ensure all goroutines finish.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import (
	"fmt"
	"sync"
)

func square(n int, ch chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	ch <- n * n
}

func main() {
	ch := make(chan int, 3)
	var wg sync.WaitGroup

	for _, n := range []int{1, 2, 3} {
		wg.Add(1)
		go square(n, ch, &wg)
	}

	// Close channel once all goroutines finish
	go func() {
		wg.Wait()
		close(ch)
	}()

	for result := range ch {
		fmt.Println(result)
	}
}
`,
        },
      ],
    },
  },

  // ── Module 6 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m06',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Packages & Modules',
    subtitle: 'Organise code into packages and manage external dependencies',
    level: 'PhD',
    xp: 185,
    duration: 30,
    module: 6,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Split a program across multiple packages, control visibility with exported names, manage dependencies with go.mod and go.sum, and use go get.',
    keyTerms: [
      { term: 'package', definition: 'The unit of code organisation in Go; all .go files in a directory share one package name.' },
      { term: 'exported name', definition: 'Any identifier starting with an uppercase letter is exported (public); lowercase is unexported (package-private).' },
      { term: 'go.mod', definition: 'Module manifest declaring the module path, Go version, and direct dependencies.' },
      { term: 'go.sum', definition: 'Cryptographic checksums for all dependencies — committed to source control for reproducible builds.' },
      { term: 'go get', definition: 'Downloads and adds a dependency to go.mod; with @version pins a specific version.' },
      { term: 'init()', definition: 'Special function that runs automatically before main(); used for package-level setup.' },
    ],
    content: `## Packages & Modules

### Package Basics

Every \`.go\` file belongs to exactly one package. Files in the same directory share a package name:

\`\`\`
myapp/
  main.go          // package main
  mathutil/
    math.go        // package mathutil
    math_test.go   // package mathutil
\`\`\`

### Exported vs Unexported

\`\`\`go
// mathutil/math.go
package mathutil

// Exported — visible outside the package
func Add(a, b int) int { return a + b }

// unexported — only visible within mathutil
func clamp(n, min, max int) int { ... }
\`\`\`

### go.mod in Practice

\`\`\`bash
go mod init github.com/myorg/myapp
\`\`\`

\`go.mod\`:
\`\`\`
module github.com/myorg/myapp

go 1.22

require (
    github.com/labstack/echo/v4 v4.12.0
)
\`\`\`

### Adding Dependencies

\`\`\`bash
go get github.com/labstack/echo/v4@latest
\`\`\`

This updates \`go.mod\` and \`go.sum\`. Commit both files.

### Tidy

After adding/removing imports, keep your module clean:

\`\`\`bash
go mod tidy
\`\`\`

This removes unused dependencies and adds any missing ones.

### init()

\`\`\`go
package config

import "os"

var DatabaseURL string

func init() {
    DatabaseURL = os.Getenv("DATABASE_URL")
    if DatabaseURL == "" {
        DatabaseURL = "postgres://localhost/dev"
    }
}
\`\`\`

### Using Your Package

\`\`\`go
// main.go
package main

import (
    "fmt"
    "github.com/myorg/myapp/mathutil"
)

func main() {
    fmt.Println(mathutil.Add(3, 4)) // 7
}
\`\`\`

### Blank Import

\`\`\`go
import _ "github.com/lib/pq" // import for side effects (init) only
\`\`\`

Used for database drivers that register themselves in \`init()\`.

### Vendor Directory

\`\`\`bash
go mod vendor
\`\`\`

Copies all dependencies into a local \`vendor/\` directory — useful for offline builds or reproducible CI.`,
    quiz: [
      {
        q: 'What makes a function or variable exported from a Go package?',
        options: [
          'The `export` keyword',
          'The `public` modifier',
          'Starting the name with an uppercase letter',
          'Placing it in a file named exports.go',
        ],
        correct: 2,
        explanation: 'In Go, visibility is determined purely by the first letter of the identifier — uppercase = exported, lowercase = unexported.',
      },
      {
        q: 'What command removes unused dependencies from go.mod?',
        options: ['go clean', 'go mod tidy', 'go remove', 'go mod prune'],
        correct: 1,
        explanation: '`go mod tidy` adds missing and removes unused entries in go.mod and go.sum.',
      },
      {
        q: 'What is go.sum used for?',
        options: [
          'Documenting package APIs',
          'Storing build cache checksums',
          'Cryptographic verification of dependency content for reproducible builds',
          'Listing all Go files in the module',
        ],
        correct: 2,
        explanation: 'go.sum contains hash checksums for every dependency version — guarantees you get exactly the same code every build.',
      },
      {
        q: 'When does an `init()` function run?',
        options: [
          'Only when explicitly called',
          'Before the `main()` function, automatically',
          'After the program has started accepting requests',
          'When the package is first imported in any goroutine',
        ],
        correct: 1,
        explanation: '`init()` runs automatically before `main()` — you never call it directly.',
      },
    ],
    ide: {
      language: 'go',
      task: 'In a single file, simulate a package by writing a `greet` function that is "unexported" (lowercase). Write an exported `Greet` wrapper that calls it. In main, call `Greet("Jordan")` and print the result.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import "fmt"

// unexported (lowercase) helper
func greet(name string) string {
	return "Hello, " + name + "! Welcome to Go."
}

// Exported wrapper
func Greet(name string) string {
	return greet(name)
}

func main() {
	msg := Greet("Jordan")
	fmt.Println(msg)
}
`,
        },
      ],
    },
  },

  // ── Module 7 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m07',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'HTTP Server with net/http',
    subtitle: 'Serve HTTP requests, handle routes, and write JSON responses',
    level: 'PhD',
    xp: 195,
    duration: 45,
    module: 7,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Use the standard library net/http to create an HTTP server, register route handlers, parse request data, and respond with JSON.',
    keyTerms: [
      { term: 'http.HandlerFunc', definition: 'A function type `func(ResponseWriter, *Request)` that satisfies the Handler interface.' },
      { term: 'http.ResponseWriter', definition: 'Interface for writing the HTTP response — headers, status code, and body.' },
      { term: '*http.Request', definition: 'Struct containing everything about the incoming request — method, URL, headers, body.' },
      { term: 'http.ServeMux', definition: 'The standard HTTP request multiplexer — maps URL patterns to handlers.' },
      { term: 'json.Encoder', definition: 'Writes JSON-encoded values to a writer; more efficient than json.Marshal for HTTP responses.' },
      { term: 'http.ListenAndServe', definition: 'Starts an HTTP server on a given address — blocks indefinitely.' },
    ],
    content: `## HTTP Server with net/http

### The Simplest Server

\`\`\`go
package main

import (
    "fmt"
    "net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, Web!")
}

func main() {
    http.HandleFunc("/", hello)
    http.ListenAndServe(":8080", nil)
}
\`\`\`

Visit \`http://localhost:8080\` — you should see "Hello, Web!".

### Returning JSON

\`\`\`go
package main

import (
    "encoding/json"
    "net/http"
)

type User struct {
    ID   int    \`json:"id"\`
    Name string \`json:"name"\`
}

func getUser(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    user := User{ID: 1, Name: "Jordan"}
    json.NewEncoder(w).Encode(user)
}

func main() {
    http.HandleFunc("/user", getUser)
    http.ListenAndServe(":8080", nil)
}
\`\`\`

### Status Codes

\`\`\`go
func notFound(w http.ResponseWriter, r *http.Request) {
    http.Error(w, "Not Found", http.StatusNotFound) // 404
}
\`\`\`

### Custom ServeMux

Using the global DefaultServeMux is fine for simple programs, but in production you want your own:

\`\`\`go
mux := http.NewServeMux()
mux.HandleFunc("/", homeHandler)
mux.HandleFunc("/api/users", usersHandler)

server := &http.Server{
    Addr:         ":8080",
    Handler:      mux,
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
}
server.ListenAndServe()
\`\`\`

Setting timeouts is critical — the default http.Server has no timeouts.

### Reading Request Body

\`\`\`go
func createUser(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }

    var user User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Bad Request", http.StatusBadRequest)
        return
    }

    // process user...
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}
\`\`\`

### Reading URL Query Parameters

\`\`\`go
func search(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("q")
    fmt.Fprintf(w, "Searching for: %s", query)
}
// GET /search?q=golang
\`\`\`

### Path Variables (Go 1.22+)

Go 1.22 added pattern matching to the standard mux:

\`\`\`go
mux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")
    fmt.Fprintf(w, "User ID: %s", id)
})
\`\`\``,
    quiz: [
      {
        q: 'What type does an HTTP handler function in Go take as its second argument?',
        options: ['http.Context', '*http.Request', 'http.Body', 'io.Reader'],
        correct: 1,
        explanation: 'Handler functions have the signature `func(http.ResponseWriter, *http.Request)` — the request is always a pointer.',
      },
      {
        q: 'Why should you set ReadTimeout and WriteTimeout on an http.Server?',
        options: [
          'They are required by the Go HTTP spec',
          'To prevent slow or malicious clients from holding connections open indefinitely',
          'To improve JSON encoding performance',
          'They unlock HTTP/2 support',
        ],
        correct: 1,
        explanation: 'Without timeouts, a slow client can hold a goroutine open forever, exhausting server resources.',
      },
      {
        q: 'What does `w.Header().Set("Content-Type", "application/json")` do?',
        options: [
          'It parses the incoming JSON body',
          'It sets the response Content-Type header before writing the body',
          'It sets the Accept header on the request',
          'It enables automatic JSON marshalling',
        ],
        correct: 1,
        explanation: 'Headers must be set before calling Write or WriteHeader — this header tells the client how to interpret the response body.',
      },
      {
        q: 'How do you get the value of URL query parameter "id" from an *http.Request?',
        options: [
          'r.Params["id"]',
          'r.QueryString("id")',
          'r.URL.Query().Get("id")',
          'r.FormValue("id")',
        ],
        correct: 2,
        explanation: '`r.URL.Query()` returns a `url.Values` map; `.Get("id")` retrieves the first value for that key.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Build an HTTP server that responds to GET /ping with JSON `{"status":"ok"}` and GET /hello?name=X with plain text "Hello, X!". Run on port 8080.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "World"
	}
	fmt.Fprintf(w, "Hello, %s!", name)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/ping", pingHandler)
	mux.HandleFunc("/hello", helloHandler)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", mux)
}
`,
        },
      ],
    },
  },

  // ── Module 8 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-go-m08',
    track: 'crash',
    crashId: 'cc-go',
    crashTitle: 'Go',
    certArea: 'Go Crash Course',
    title: 'Full REST API',
    subtitle: 'In-memory CRUD API with routing, middleware, and error handling',
    level: 'PhD',
    xp: 200,
    duration: 60,
    module: 8,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Build a complete in-memory REST API with full CRUD operations, a custom router, logging middleware, and proper HTTP semantics.',
    keyTerms: [
      { term: 'CRUD', definition: 'Create, Read, Update, Delete — the four fundamental operations on a resource.' },
      { term: 'REST', definition: 'Representational State Transfer — resource-oriented API design using HTTP verbs and status codes correctly.' },
      { term: 'middleware', definition: 'A handler that wraps another handler to add cross-cutting concerns like logging, auth, or CORS.' },
      { term: 'sync.RWMutex', definition: 'Reader/writer mutex — multiple concurrent reads are allowed; writes are exclusive.' },
      { term: 'http.StatusNotFound (404)', definition: 'HTTP status code meaning the requested resource does not exist on the server.' },
      { term: 'idempotent', definition: 'An operation that produces the same result whether called once or many times — PUT and DELETE are idempotent.' },
    ],
    content: `## Full REST API

### Project Layout

\`\`\`
api/
  main.go
\`\`\`

### Complete In-Memory REST API

\`\`\`go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"
    "strings"
    "sync"
    "time"
)

// ── Model ──────────────────────────────────────────────────────────────────

type Product struct {
    ID    int     \`json:"id"\`
    Name  string  \`json:"name"\`
    Price float64 \`json:"price"\`
}

// ── Store ──────────────────────────────────────────────────────────────────

type Store struct {
    mu       sync.RWMutex
    products map[int]Product
    nextID   int
}

func NewStore() *Store {
    s := &Store{products: make(map[int]Product), nextID: 1}
    s.products[1] = Product{ID: 1, Name: "Go T-Shirt", Price: 25.00}
    s.nextID = 2
    return s
}

func (s *Store) List() []Product {
    s.mu.RLock()
    defer s.mu.RUnlock()
    list := make([]Product, 0, len(s.products))
    for _, p := range s.products {
        list = append(list, p)
    }
    return list
}

func (s *Store) Get(id int) (Product, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    p, ok := s.products[id]
    return p, ok
}

func (s *Store) Create(p Product) Product {
    s.mu.Lock()
    defer s.mu.Unlock()
    p.ID = s.nextID
    s.nextID++
    s.products[p.ID] = p
    return p
}

func (s *Store) Update(id int, p Product) (Product, bool) {
    s.mu.Lock()
    defer s.mu.Unlock()
    if _, ok := s.products[id]; !ok {
        return Product{}, false
    }
    p.ID = id
    s.products[id] = p
    return p, true
}

func (s *Store) Delete(id int) bool {
    s.mu.Lock()
    defer s.mu.Unlock()
    if _, ok := s.products[id]; !ok {
        return false
    }
    delete(s.products, id)
    return true
}

// ── Helpers ────────────────────────────────────────────────────────────────

func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(v)
}

func idFromPath(path string) (int, bool) {
    parts := strings.Split(strings.Trim(path, "/"), "/")
    if len(parts) < 2 {
        return 0, false
    }
    id, err := strconv.Atoi(parts[len(parts)-1])
    return id, err == nil
}

// ── Handlers ───────────────────────────────────────────────────────────────

func productsHandler(store *Store) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            writeJSON(w, http.StatusOK, store.List())

        case http.MethodPost:
            var p Product
            if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
                http.Error(w, "bad request", http.StatusBadRequest)
                return
            }
            created := store.Create(p)
            writeJSON(w, http.StatusCreated, created)

        default:
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        }
    }
}

func productHandler(store *Store) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        id, ok := idFromPath(r.URL.Path)
        if !ok {
            http.Error(w, "invalid id", http.StatusBadRequest)
            return
        }

        switch r.Method {
        case http.MethodGet:
            p, found := store.Get(id)
            if !found {
                http.Error(w, "not found", http.StatusNotFound)
                return
            }
            writeJSON(w, http.StatusOK, p)

        case http.MethodPut:
            var p Product
            if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
                http.Error(w, "bad request", http.StatusBadRequest)
                return
            }
            updated, found := store.Update(id, p)
            if !found {
                http.Error(w, "not found", http.StatusNotFound)
                return
            }
            writeJSON(w, http.StatusOK, updated)

        case http.MethodDelete:
            if !store.Delete(id) {
                http.Error(w, "not found", http.StatusNotFound)
                return
            }
            w.WriteHeader(http.StatusNoContent)

        default:
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        }
    }
}

// ── Middleware ─────────────────────────────────────────────────────────────

func logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// ── Main ───────────────────────────────────────────────────────────────────

func main() {
    store := NewStore()
    mux := http.NewServeMux()

    mux.HandleFunc("/products", productsHandler(store))
    mux.HandleFunc("/products/", productHandler(store))

    server := &http.Server{
        Addr:         ":8080",
        Handler:      logging(mux),
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
    }

    fmt.Println("API running on http://localhost:8080")
    log.Fatal(server.ListenAndServe())
}
\`\`\`

### Test with curl

\`\`\`bash
# List products
curl http://localhost:8080/products

# Create
curl -X POST -H "Content-Type: application/json" \\
  -d '{"name":"Gopher Mug","price":12.99}' \\
  http://localhost:8080/products

# Get one
curl http://localhost:8080/products/1

# Update
curl -X PUT -H "Content-Type: application/json" \\
  -d '{"name":"Go Hoodie","price":45.00}' \\
  http://localhost:8080/products/1

# Delete
curl -X DELETE http://localhost:8080/products/1
\`\`\``,
    quiz: [
      {
        q: 'What HTTP status code should a successful POST (resource creation) return?',
        options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
        correct: 1,
        explanation: '201 Created signals that the request succeeded and a new resource was created. The response body typically contains the new resource.',
      },
      {
        q: 'Why use sync.RWMutex instead of sync.Mutex for a read-heavy store?',
        options: [
          'RWMutex is always faster',
          'RWMutex allows concurrent reads while only blocking for writes',
          'RWMutex avoids deadlocks automatically',
          'sync.Mutex cannot be used with maps',
        ],
        correct: 1,
        explanation: 'RWMutex lets multiple goroutines read simultaneously — only writes need exclusive access, improving throughput.',
      },
      {
        q: 'What does middleware in an HTTP server typically do?',
        options: [
          'Handles database connections',
          'Wraps handlers to add cross-cutting concerns like logging, auth, or CORS',
          'Parses JSON request bodies automatically',
          'Routes requests to the correct handler',
        ],
        correct: 1,
        explanation: 'Middleware is a handler that calls another handler, intercepting the request/response to add shared logic.',
      },
      {
        q: 'What status code should a successful DELETE return when there is no body?',
        options: ['200 OK', '201 Created', '204 No Content', '410 Gone'],
        correct: 2,
        explanation: '204 No Content is the standard response for a successful DELETE — the resource is gone and there is nothing to return.',
      },
    ],
    ide: {
      language: 'go',
      task: 'Extend the API with a GET /products?min_price=X filter. Modify the List handler to accept a `min_price` query param and only return products with price >= that value. Test with curl.',
      files: [
        {
          name: 'main.go',
          language: 'go',
          code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
)

type Product struct {
	ID    int     \`json:"id"\`
	Name  string  \`json:"name"\`
	Price float64 \`json:"price"\`
}

type Store struct {
	mu       sync.RWMutex
	products map[int]Product
	nextID   int
}

func NewStore() *Store {
	s := &Store{products: make(map[int]Product), nextID: 1}
	s.products[1] = Product{ID: 1, Name: "Go T-Shirt", Price: 25.00}
	s.products[2] = Product{ID: 2, Name: "Gopher Mug", Price: 12.99}
	s.products[3] = Product{ID: 3, Name: "Go Hoodie", Price: 55.00}
	s.nextID = 4
	return s
}

func (s *Store) List(minPrice float64) []Product {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []Product
	for _, p := range s.products {
		if p.Price >= minPrice {
			list = append(list, p)
		}
	}
	return list
}

func main() {
	store := NewStore()
	mux := http.NewServeMux()

	mux.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request) {
		minPrice := 0.0
		if v := r.URL.Query().Get("min_price"); v != "" {
			if f, err := strconv.ParseFloat(v, 64); err == nil {
				minPrice = f
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(store.List(minPrice))
	})

	fmt.Println("Server on :8080 — try GET /products?min_price=20")
	http.ListenAndServe(":8080", mux)
}
`,
        },
      ],
    },
  },
]
