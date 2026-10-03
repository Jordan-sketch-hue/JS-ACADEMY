import type { Course } from '../courses'

const COURSE_OBJECTIVE =
  'Master Rust from zero to production — own the ownership model, write safe concurrent code, handle errors idiomatically, and ship a functional CLI tool by the final module.'

export const crashRustCourses: Course[] = [
  // ── Module 1 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m01',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Environment & Hello World',
    subtitle: 'Install Rust via rustup, configure VS Code, and run your first program',
    level: 'Basic',
    xp: 155,
    duration: 20,
    module: 1,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Install Rust using rustup, set up the rust-analyzer VS Code extension, understand the Cargo project system, and compile and run a Hello World program.',
    keyTerms: [
      { term: 'rustup', definition: 'The Rust toolchain installer — manages Rust versions, targets, and components like clippy and rustfmt.' },
      { term: 'cargo', definition: "Rust's official build system and package manager — the equivalent of npm for JavaScript." },
      { term: 'rustc', definition: 'The Rust compiler; usually invoked via cargo rather than directly.' },
      { term: 'Crate', definition: 'The basic unit of compilation in Rust; a binary crate produces an executable, a library crate produces a .rlib.' },
      { term: 'Cargo.toml', definition: "The project manifest — declares the package name, version, edition, and dependencies (like package.json)." },
      { term: 'rust-analyzer', definition: 'The official Rust language server providing real-time IDE features in VS Code.' },
    ],
    content: `## Setting Up Rust

### 1. Install via rustup

\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
\`\`\`

On Windows, download and run \`rustup-init.exe\` from https://rustup.rs.

After installation:
\`\`\`bash
rustc --version   # rustc 1.78.0 (9b00956e5 2024-04-29)
cargo --version   # cargo 1.78.0 (54d8815d0 2024-03-26)
\`\`\`

### 2. VS Code Setup

Install the **rust-analyzer** extension (extension id: \`rust-lang.rust-analyzer\`). This is the official extension — do not install the old "Rust" extension.

rust-analyzer provides:
- Real-time type inference
- Inline diagnostics from the borrow checker
- Code actions and refactors
- Go-to-definition across crates

### 3. Create a Project

\`\`\`bash
cargo new hello_rust
cd hello_rust
\`\`\`

This creates:
\`\`\`
hello_rust/
  Cargo.toml
  src/
    main.rs
\`\`\`

### 4. Your First Program

\`src/main.rs\` already contains Hello World:

\`\`\`rust
fn main() {
    println!("Hello, World!");
}
\`\`\`

Run it:

\`\`\`bash
cargo run
# Compiling hello_rust v0.1.0
# Finished dev profile
# Running target/debug/hello_rust
# Hello, World!
\`\`\`

Build a release binary (optimized):

\`\`\`bash
cargo build --release
./target/release/hello_rust
\`\`\`

### 5. println! is a Macro

The \`!\` suffix means \`println!\` is a macro, not a function. Rust macros operate at compile time and can be variadic — that is why \`println!("{} {}", a, b)\` works without generic function overloads.

### 6. Cargo.toml

\`\`\`toml
[package]
name    = "hello_rust"
version = "0.1.0"
edition = "2021"

[dependencies]
\`\`\`

The \`edition\` field picks which Rust edition to use. Always use \`2021\` for new projects.

### 7. Useful Cargo Commands

\`\`\`bash
cargo check      # fast type-check without producing a binary
cargo clippy     # linter — much stricter than the compiler
cargo fmt        # auto-format all Rust files
cargo test       # run all tests
cargo doc --open # build and open docs
\`\`\``,
    quiz: [
      {
        q: 'What tool is used to install and manage Rust toolchains?',
        options: ['cargo', 'rustc', 'rustup', 'rustfmt'],
        correct: 2,
        explanation: 'rustup is the Rust toolchain manager — it installs Rust, manages versions, and adds components like clippy.',
      },
      {
        q: 'What does `cargo check` do differently from `cargo build`?',
        options: [
          'It runs tests',
          'It type-checks code without producing a binary — much faster',
          'It checks for outdated dependencies',
          'It performs a security audit',
        ],
        correct: 1,
        explanation: '`cargo check` does full type checking and borrow checking but skips code generation — ideal for fast feedback in development.',
      },
      {
        q: 'Why is `println!` a macro (with !) rather than a regular function?',
        options: [
          'Macros are faster than functions',
          'Macros allow variadic formatting arguments that are type-checked at compile time',
          'Functions cannot write to stdout',
          'It is a historical accident',
        ],
        correct: 1,
        explanation: 'Macros can accept a variable number of typed arguments and generate code at compile time — enabling the format string pattern.',
      },
      {
        q: 'What does `cargo build --release` do differently from `cargo build`?',
        options: [
          'It builds for production with full optimizations and no debug info',
          'It publishes the crate to crates.io',
          'It cross-compiles for all platforms',
          'It strips the binary of all symbols',
        ],
        correct: 0,
        explanation: 'Release builds apply LLVM optimizations (O3), making the binary significantly faster but taking longer to compile.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Modify the starter code to print: "Hello from Rust! Version: [the string you define as a const]". Define a const named VERSION of type &str set to "1.0.0".',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `// TODO: define a const VERSION: &str = "1.0.0"
const VERSION: &str = "1.0.0";

fn main() {
    // TODO: print "Hello from Rust! Version: 1.0.0"
    println!("Hello from Rust! Version: {}", VERSION);
}
`,
        },
      ],
    },
  },

  // ── Module 2 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m02',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Ownership, Borrowing & Lifetimes',
    subtitle: "Rust's core memory model — no GC, no dangling pointers",
    level: 'Basic',
    xp: 160,
    duration: 45,
    module: 2,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      "Understand Rust's three ownership rules, differentiate between moves and copies, use references to borrow without transferring ownership, and read basic lifetime annotations.",
    keyTerms: [
      { term: 'Ownership', definition: 'Every value has exactly one owner; when the owner goes out of scope the value is dropped (memory freed).' },
      { term: 'Move', definition: 'Transferring ownership from one variable to another — the original variable is invalidated.' },
      { term: 'Copy', definition: 'Types implementing the Copy trait (integers, bools, chars) are duplicated on assignment — both variables remain valid.' },
      { term: 'Borrow (&T)', definition: 'An immutable reference — you can have any number of these simultaneously.' },
      { term: 'Mutable borrow (&mut T)', definition: 'An exclusive mutable reference — you can have at most one at a time, and no immutable borrows while it exists.' },
      { term: "Lifetime ('a)", definition: "A compile-time annotation describing how long a reference is valid — prevents dangling references." },
    ],
    content: `## Ownership, Borrowing & Lifetimes

### The Three Ownership Rules

1. Each value has exactly one owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is dropped.

### Move Semantics

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is MOVED into s2 — s1 is no longer valid

    // println!("{}", s1); // compile error: value moved
    println!("{}", s2); // ok
}
\`\`\`

String is heap-allocated and does not implement Copy — assignment moves ownership.

### Copy Types

Primitive types implement Copy — assignment duplicates the value:

\`\`\`rust
let x = 5;
let y = x; // x is COPIED, not moved
println!("{} {}", x, y); // both valid: 5 5
\`\`\`

Copy types: integers, floats, bool, char, tuples of Copy types.

### Cloning

Explicitly deep-copy a non-Copy type:

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1.clone(); // explicit heap allocation
println!("{} {}", s1, s2); // both valid
\`\`\`

### Borrowing (References)

Pass a reference to avoid moving ownership:

\`\`\`rust
fn length(s: &String) -> usize { // borrows s
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = length(&s); // pass reference
    println!("{} has {} chars", s, len); // s still valid
}
\`\`\`

### Mutable References

\`\`\`rust
fn append_world(s: &mut String) {
    s.push_str(", world");
}

fn main() {
    let mut s = String::from("hello");
    append_world(&mut s);
    println!("{}", s); // hello, world
}
\`\`\`

**Rule:** you can have EITHER any number of \`&T\` OR exactly one \`&mut T\` — never both simultaneously. This prevents data races at compile time.

### Lifetimes

Lifetimes annotate how long references live. The compiler infers most of them:

\`\`\`rust
// 'a says: the returned reference lives as long as the shorter-lived input
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xy");
        result = longest(s1.as_str(), s2.as_str());
        println!("{}", result); // ok — both alive here
    }
}
\`\`\`

You rarely write lifetime annotations in practice — the compiler's lifetime elision rules handle most cases.`,
    quiz: [
      {
        q: 'What happens when you assign a String to a new variable in Rust?',
        options: [
          'Both variables point to the same data (reference counting)',
          'The data is deep-copied (cloned)',
          'Ownership is moved — the original variable is invalidated',
          'A compile error is always raised',
        ],
        correct: 2,
        explanation: 'String is a heap-allocated, non-Copy type. Assignment moves ownership to the new variable, invalidating the original.',
      },
      {
        q: 'How many mutable references to the same data can exist at one time?',
        options: ['Unlimited', 'Two — one read, one write', 'Exactly one', 'Zero — mutation requires ownership'],
        correct: 2,
        explanation: 'Rust enforces that at most one &mut reference exists at a time, preventing data races at compile time.',
      },
      {
        q: 'What does `s.clone()` do for a String?',
        options: [
          'Creates an alias pointing to the same memory',
          'Moves ownership to a new variable',
          'Performs a deep copy — new heap allocation with the same content',
          'Increments a reference counter',
        ],
        correct: 2,
        explanation: '`clone()` explicitly deep-copies heap data, creating an independent String with the same content.',
      },
      {
        q: 'What do lifetime annotations like `\'a` prevent?',
        options: [
          'Stack overflows',
          'Integer overflows',
          'Dangling references — references that outlive the data they point to',
          'Concurrent mutation',
        ],
        correct: 2,
        explanation: "Lifetimes encode reference validity into the type system, preventing the dangling pointer bugs common in C/C++.",
      },
    ],
    ide: {
      language: 'rust',
      task: 'Write a function `first_word(s: &str) -> &str` that returns a reference to the first word in the string (up to the first space, or the whole string if no space). Test it with "hello world" and "rust".',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `fn first_word(s: &str) -> &str {
    // Find the first space and return a slice up to it
    match s.find(' ') {
        Some(i) => &s[..i],
        None => s,
    }
}

fn main() {
    let s1 = "hello world";
    println!("First word of '{}': '{}'", s1, first_word(s1));

    let s2 = "rust";
    println!("First word of '{}': '{}'", s2, first_word(s2));
}
`,
        },
      ],
    },
  },

  // ── Module 3 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m03',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Structs, Enums & Pattern Matching',
    subtitle: 'Model data precisely and eliminate invalid states with enums',
    level: 'Masters',
    xp: 170,
    duration: 35,
    module: 3,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Define structs with methods, use enums to model mutually exclusive states, and exhaustively match patterns with match and if let.',
    keyTerms: [
      { term: 'struct', definition: 'A product type — groups named fields into a single composite value.' },
      { term: 'impl block', definition: 'Associates methods and associated functions with a type.' },
      { term: 'enum', definition: "A sum type — a value that can be one of several variants, each optionally carrying data. Rust's enums are more powerful than in most languages." },
      { term: 'match', definition: 'Exhaustive pattern matching — the compiler ensures every variant is handled.' },
      { term: 'if let', definition: 'A concise way to pattern-match a single case, ignoring the rest.' },
      { term: 'Option<T>', definition: 'A standard-library enum — either Some(T) (a value exists) or None (absent). Replaces null.' },
    ],
    content: `## Structs, Enums & Pattern Matching

### Structs

\`\`\`rust
#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    // Associated function (like a static method / constructor)
    fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }

    // Method — takes self reference
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

fn main() {
    let p1 = Point::new(0.0, 0.0);
    let p2 = Point::new(3.0, 4.0);
    println!("Distance: {:.1}", p1.distance(&p2)); // 5.0
    println!("{:?}", p1); // Debug: Point { x: 0.0, y: 0.0 }
}
\`\`\`

### Enums with Data

\`\`\`rust
#[derive(Debug)]
enum Shape {
    Circle(f64),           // radius
    Rectangle(f64, f64),   // width, height
    Triangle { base: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r)             => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h)       => w * h,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(5.0),
        Shape::Rectangle(3.0, 4.0),
        Shape::Triangle { base: 6.0, height: 8.0 },
    ];

    for s in &shapes {
        println!("{:?} → area: {:.2}", s, s.area());
    }
}
\`\`\`

### Option<T> — No More Null

\`\`\`rust
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

fn main() {
    match divide(10.0, 2.0) {
        Some(v) => println!("Result: {}", v),
        None    => println!("Division by zero"),
    }

    // Concise: if let
    if let Some(v) = divide(9.0, 3.0) {
        println!("Got: {}", v);
    }

    // Unwrap with default
    let result = divide(5.0, 0.0).unwrap_or(0.0);
    println!("{}", result); // 0
}
\`\`\`

### Destructuring

\`\`\`rust
let point = Point { x: 3.0, y: 4.0 };
let Point { x, y } = point;
println!("{} {}", x, y);

// Tuple destructuring
let (a, b, c) = (1, 2, 3);
\`\`\`

### Match Guards

\`\`\`rust
let n = 7;
match n {
    x if x < 0  => println!("negative"),
    0            => println!("zero"),
    x if x % 2 == 0 => println!("positive even"),
    _            => println!("positive odd"),
}
\`\`\``,
    quiz: [
      {
        q: 'What does `#[derive(Debug)]` do for a struct?',
        options: [
          'Enables breakpoints in the debugger',
          'Automatically implements the Debug trait, allowing {:?} formatting',
          'Makes all fields public',
          'Enables mutable access to private fields',
        ],
        correct: 1,
        explanation: 'The derive macro automatically generates the Debug trait implementation, which enables printing with `{:?}`.',
      },
      {
        q: 'What is Rust\'s guarantee about `match` expressions?',
        options: [
          'They always return a value',
          'They are exhaustive — the compiler ensures every possible case is handled',
          'They are faster than if-else chains',
          'They can only match integers and strings',
        ],
        correct: 1,
        explanation: 'Rust\'s match is exhaustive — if you miss a variant the compiler refuses to compile, eliminating unhandled-case bugs.',
      },
      {
        q: 'What does `Option<T>` replace in Rust?',
        options: [
          'Exception handling',
          'Null pointers — None represents absence, Some(T) represents a value',
          'Raw pointers',
          'Default function arguments',
        ],
        correct: 1,
        explanation: 'Option<T> encodes nullable values in the type system — you must explicitly handle None, eliminating null pointer exceptions.',
      },
      {
        q: 'What is the difference between an `impl` associated function and a method?',
        options: [
          'Associated functions are public, methods are private',
          'Methods take self/&self/&mut self as the first parameter; associated functions do not',
          'Associated functions are called with :: syntax, methods always use . syntax — they are otherwise identical',
          'Methods can only return void',
        ],
        correct: 1,
        explanation: 'Methods have a self receiver and are called with dot syntax on an instance. Associated functions (like ::new()) have no self and are called with :: on the type.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Define an enum `Direction` with variants North, South, East, West. Write a function `opposite(d: &Direction) -> Direction` returning the opposite direction. Use match. Test all four cases.',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `#[derive(Debug)]
enum Direction {
    North,
    South,
    East,
    West,
}

fn opposite(d: &Direction) -> Direction {
    match d {
        Direction::North => Direction::South,
        Direction::South => Direction::North,
        Direction::East  => Direction::West,
        Direction::West  => Direction::East,
    }
}

fn main() {
    let directions = [Direction::North, Direction::South, Direction::East, Direction::West];
    for d in &directions {
        println!("Opposite of {:?} is {:?}", d, opposite(d));
    }
}
`,
        },
      ],
    },
  },

  // ── Module 4 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m04',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Traits & Generics',
    subtitle: 'Write reusable, type-safe abstractions without runtime cost',
    level: 'Masters',
    xp: 175,
    duration: 40,
    module: 4,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Define and implement traits, use generic type parameters with trait bounds, and understand how Rust achieves zero-cost abstractions through monomorphization.',
    keyTerms: [
      { term: 'trait', definition: "Rust's mechanism for shared behaviour — similar to an interface but more powerful; can have default method implementations." },
      { term: 'Generic <T>', definition: 'A type parameter that lets a function or struct work with multiple concrete types.' },
      { term: 'Trait bound', definition: 'A constraint on a generic parameter: `T: Display` means T must implement Display.' },
      { term: 'Monomorphization', definition: "The compiler generates a separate copy of generic code for each concrete type — zero runtime cost, unlike Java generics." },
      { term: 'impl Trait', definition: 'Shorthand for "some type that implements Trait" — usable in function signatures.' },
      { term: 'dyn Trait', definition: 'A trait object — dynamic dispatch; the concrete type is resolved at runtime via a vtable.' },
    ],
    content: `## Traits & Generics

### Defining a Trait

\`\`\`rust
trait Summary {
    fn summarize(&self) -> String;

    // Default implementation
    fn preview(&self) -> String {
        format!("Read more: {}", self.summarize())
    }
}

struct Article {
    title:   String,
    content: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}: {}...", self.title, &self.content[..50.min(self.content.len())])
    }
}

fn main() {
    let a = Article {
        title:   "Rust is fast".into(),
        content: "Rust achieves performance without a garbage collector.".into(),
    };
    println!("{}", a.summarize());
    println!("{}", a.preview()); // uses default implementation
}
\`\`\`

### Generics with Trait Bounds

\`\`\`rust
use std::fmt::Display;

// T must implement both Display and PartialOrd
fn largest<T: PartialOrd + Display>(list: &[T]) -> &T {
    let mut biggest = &list[0];
    for item in list {
        if item > biggest {
            biggest = item;
        }
    }
    biggest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest: {}", largest(&numbers)); // 100

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("Largest: {}", largest(&chars)); // y
}
\`\`\`

### impl Trait (modern shorthand)

\`\`\`rust
// In parameter position — accepts any type implementing Display
fn print_item(item: &impl Display) {
    println!("{}", item);
}

// In return position — return some type implementing Iterator
fn make_counter(n: u32) -> impl Iterator<Item = u32> {
    (0..n)
}
\`\`\`

### Generic Structs

\`\`\`rust
struct Pair<T> {
    first:  T,
    second: T,
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.first >= self.second {
            println!("First is larger: {}", self.first);
        } else {
            println!("Second is larger: {}", self.second);
        }
    }
}
\`\`\`

### dyn Trait (Dynamic Dispatch)

Use \`Box<dyn Trait>\` when you need a collection of heterogeneous types:

\`\`\`rust
fn make_shapes() -> Vec<Box<dyn Summary>> {
    vec![
        Box::new(Article { title: "A".into(), content: "...".into() }),
        // Box::new(Tweet { ... }),
    ]
}
\`\`\`

Dynamic dispatch has a small runtime cost (vtable lookup) vs the zero-cost of generics (monomorphization). Use generics when you know the type at compile time; \`dyn\` when you need heterogeneous collections.`,
    quiz: [
      {
        q: 'What is monomorphization in Rust?',
        options: [
          'A runtime technique to optimize hot paths',
          'The compiler generating a concrete copy of generic code for each type it is used with',
          'A garbage collection strategy',
          'A way to enforce single ownership',
        ],
        correct: 1,
        explanation: 'Monomorphization compiles generic code into type-specific versions at compile time — zero runtime overhead, unlike Java generics (type erasure).',
      },
      {
        q: 'What does `T: Display + PartialOrd` mean in a generic function signature?',
        options: [
          'T must be either Display or PartialOrd',
          'T must implement both the Display and PartialOrd traits',
          'T must be a numeric type',
          'T must be a reference type',
        ],
        correct: 1,
        explanation: 'The `+` syntax in a trait bound means the type must implement ALL listed traits.',
      },
      {
        q: 'When should you use `dyn Trait` instead of generics?',
        options: [
          'Always — dyn is faster',
          'When you need a heterogeneous collection of types that implement the same trait at runtime',
          'For primitive types only',
          'When you want to avoid monomorphization in all cases',
        ],
        correct: 1,
        explanation: 'dyn Trait enables runtime polymorphism — necessary for collections like `Vec<Box<dyn Shape>>` where concrete types differ.',
      },
      {
        q: 'What does a default method implementation in a trait allow?',
        options: [
          'The method cannot be overridden',
          'Implementors can use the provided behaviour without overriding it, but may override if needed',
          'It makes the trait optional to implement',
          'It creates a private method accessible only inside the trait',
        ],
        correct: 1,
        explanation: 'Default implementations reduce boilerplate — types get the behaviour for free and can override it selectively.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Define a trait `Describable` with a method `describe(&self) -> String`. Implement it for a `Car` struct (with make and model fields) and a `Person` struct (with name and age). Write a generic function `print_description(item: &impl Describable)` and call it for both.',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `trait Describable {
    fn describe(&self) -> String;
}

struct Car {
    make:  String,
    model: String,
}

impl Describable for Car {
    fn describe(&self) -> String {
        format!("Car: {} {}", self.make, self.model)
    }
}

struct Person {
    name: String,
    age:  u32,
}

impl Describable for Person {
    fn describe(&self) -> String {
        format!("Person: {} (age {})", self.name, self.age)
    }
}

fn print_description(item: &impl Describable) {
    println!("{}", item.describe());
}

fn main() {
    let car = Car { make: "Toyota".into(), model: "Corolla".into() };
    let person = Person { name: "Jordan".into(), age: 28 };

    print_description(&car);
    print_description(&person);
}
`,
        },
      ],
    },
  },

  // ── Module 5 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m05',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Error Handling with Result & Option',
    subtitle: 'Propagate errors without exceptions using the ? operator',
    level: 'Masters',
    xp: 180,
    duration: 35,
    module: 5,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Use Result<T, E> and Option<T> to handle recoverable errors, propagate errors with the ? operator, and create custom error types.',
    keyTerms: [
      { term: 'Result<T, E>', definition: 'An enum — Ok(T) on success, Err(E) on failure. Forces callers to handle errors.' },
      { term: '? operator', definition: 'Unwraps Ok or returns Err early from the current function — syntactic sugar for match on Result.' },
      { term: 'unwrap()', definition: 'Extracts the value from Ok/Some, panicking if it is Err/None — use only in tests or prototypes.' },
      { term: 'expect(msg)', definition: 'Like unwrap() but panics with a custom message — slightly better for debugging.' },
      { term: 'thiserror', definition: 'A popular crate that generates boilerplate for custom error types via derive macros.' },
      { term: 'anyhow', definition: 'A crate providing a flexible Error type that can wrap any error — ideal for application code.' },
    ],
    content: `## Error Handling with Result & Option

### Result<T, E>

\`\`\`rust
use std::num::ParseIntError;

fn parse_age(s: &str) -> Result<u32, ParseIntError> {
    let n = s.trim().parse::<u32>()?; // ? propagates the error
    Ok(n)
}

fn main() {
    match parse_age("25") {
        Ok(age)  => println!("Age: {}", age),
        Err(e)   => println!("Parse error: {}", e),
    }

    match parse_age("abc") {
        Ok(age)  => println!("Age: {}", age),
        Err(e)   => println!("Parse error: {}", e),
    }
}
\`\`\`

### The ? Operator

\`?\` is shorthand for:
\`\`\`rust
// This:
let n = s.parse::<u32>()?;

// Expands to roughly:
let n = match s.parse::<u32>() {
    Ok(v)  => v,
    Err(e) => return Err(e.into()),
};
\`\`\`

### Chaining Operations

\`\`\`rust
use std::fs;

fn read_username() -> Result<String, std::io::Error> {
    let content = fs::read_to_string("username.txt")?; // ? here
    Ok(content.trim().to_string())
}
\`\`\`

### Option Combinators

\`\`\`rust
let s = "hello world";
let upper: Option<String> = s.split_whitespace()
    .next()            // Option<&str>
    .map(str::to_uppercase); // Option<String>

println!("{:?}", upper); // Some("HELLO")

// unwrap_or provides a default
let word = s.split_whitespace().next().unwrap_or("default");
\`\`\`

### Custom Error Types

\`\`\`rust
use std::fmt;

#[derive(Debug)]
enum AppError {
    ParseError(String),
    NotFound(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            AppError::NotFound(key)   => write!(f, "Not found: {}", key),
        }
    }
}

impl std::error::Error for AppError {}

fn find_user(id: u32) -> Result<String, AppError> {
    if id == 1 { Ok("Jordan".into()) }
    else { Err(AppError::NotFound(format!("id={}", id))) }
}
\`\`\`

### The anyhow Crate

For application code (not libraries), anyhow eliminates boilerplate:

\`\`\`rust
// Cargo.toml: anyhow = "1"
use anyhow::{Result, Context};

fn run() -> Result<()> {
    let n: u32 = "42".parse().context("failed to parse config")?;
    println!("{}", n);
    Ok(())
}
\`\`\``,
    quiz: [
      {
        q: 'What does the `?` operator do when applied to a `Result::Err`?',
        options: [
          'It panics with the error message',
          'It returns the Err from the current function early',
          'It converts the error to Option::None',
          'It logs the error and continues',
        ],
        correct: 1,
        explanation: 'The `?` operator propagates the error upward — it returns Err early from the enclosing function, short-circuiting the rest.',
      },
      {
        q: 'When is it acceptable to use `unwrap()` in Rust?',
        options: [
          'In production code when performance matters',
          'In tests and prototype code where a panic is acceptable',
          'Only on Option, never on Result',
          'Only for values guaranteed to be Some/Ok at the call site, with a comment explaining why',
        ],
        correct: 1,
        explanation: 'unwrap() should be avoided in production code — a panic is unrecoverable. Use it in tests or when you know the value is always Ok/Some (and even then, prefer expect() with a message).',
      },
      {
        q: 'What must you implement for a type to be a valid std::error::Error?',
        options: [
          'Only Debug',
          'Only Display',
          'Both Debug and Display, plus implement the Error trait',
          'Serialize and Deserialize',
        ],
        correct: 2,
        explanation: 'The std::error::Error trait requires Debug and Display to already be implemented on the type.',
      },
      {
        q: 'What does `Option::map(f)` do?',
        options: [
          'Applies f to the inner value if Some, returning Some(f(v)); returns None if None',
          'Converts None to a default value',
          'Iterates over a collection of Options',
          'Panics if the Option is None',
        ],
        correct: 0,
        explanation: '`map` transforms the inner value of a Some without unwrapping it — a functional way to chain operations on optional values.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Write a function `parse_positive(s: &str) -> Result<u32, String>` that parses a string to u32, returning Err("not a number") if parsing fails and Err("must be positive") if the number is 0. Test with "5", "0", and "abc".',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `fn parse_positive(s: &str) -> Result<u32, String> {
    let n = s.trim().parse::<u32>().map_err(|_| "not a number".to_string())?;
    if n == 0 {
        return Err("must be positive".to_string());
    }
    Ok(n)
}

fn main() {
    for input in &["5", "0", "abc"] {
        match parse_positive(input) {
            Ok(n)  => println!("'{}' → {}", input, n),
            Err(e) => println!("'{}' → Error: {}", input, e),
        }
    }
}
`,
        },
      ],
    },
  },

  // ── Module 6 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m06',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Closures & Iterators',
    subtitle: 'Functional patterns that compile to zero-cost loops',
    level: 'PhD',
    xp: 185,
    duration: 35,
    module: 6,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Write closures that capture their environment, chain iterator adapters for expressive data transformation, and understand how iterators compile to tight loops.',
    keyTerms: [
      { term: 'Closure', definition: 'An anonymous function that captures variables from its enclosing scope; Fn, FnMut, or FnOnce depending on how it uses captured values.' },
      { term: 'Iterator trait', definition: 'A trait with a `next()` method returning Option<Item>; powers all iterator adapters.' },
      { term: 'map()', definition: 'Iterator adapter that transforms each item with a closure — lazy, no allocation until collected.' },
      { term: 'filter()', definition: 'Iterator adapter that keeps only items for which the closure returns true.' },
      { term: 'collect()', definition: 'Consumes an iterator and assembles the items into a collection (Vec, HashMap, etc.).' },
      { term: 'fold()', definition: 'Reduces an iterator to a single value by accumulating with a closure.' },
    ],
    content: `## Closures & Iterators

### Closures

\`\`\`rust
fn main() {
    let x = 10;
    let add_x = |n| n + x; // captures x by reference

    println!("{}", add_x(5));  // 15
    println!("{}", add_x(20)); // 30

    // Closures as function arguments
    let nums = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = nums.iter().map(|n| n * 2).collect();
    println!("{:?}", doubled); // [2, 4, 6, 8, 10]
}
\`\`\`

### Closure Traits

- **Fn** — can be called multiple times, captures by reference
- **FnMut** — can be called multiple times, captures by mutable reference
- **FnOnce** — can only be called once, captures by value (moves captured data)

\`\`\`rust
fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(x)
}

fn apply_once<F: FnOnce() -> String>(f: F) -> String {
    f() // f is consumed here
}

let greet = || "Hello".to_string();
println!("{}", apply_once(greet));
\`\`\`

### Iterator Chains

\`\`\`rust
let scores = vec![85, 92, 45, 78, 60, 95, 30];

let top_students: Vec<String> = scores.iter()
    .enumerate()                          // (index, value) pairs
    .filter(|(_, &score)| score >= 80)    // keep only high scores
    .map(|(i, score)| format!("Student {} scored {}", i + 1, score))
    .collect();

for s in &top_students {
    println!("{}", s);
}
\`\`\`

### Common Iterator Methods

\`\`\`rust
let v = vec![1, 2, 3, 4, 5];

// sum and product
let total: i32 = v.iter().sum();             // 15
let product: i32 = v.iter().product();       // 120

// fold (generic reduce)
let sum = v.iter().fold(0, |acc, x| acc + x); // 15

// find — returns Option
let first_even = v.iter().find(|&&x| x % 2 == 0); // Some(2)

// any / all
let has_big = v.iter().any(|&x| x > 4);     // true
let all_pos = v.iter().all(|&x| x > 0);     // true

// flatten
let nested = vec![vec![1, 2], vec![3, 4]];
let flat: Vec<i32> = nested.into_iter().flatten().collect(); // [1,2,3,4]

// zip
let names = vec!["Alice", "Bob"];
let ages  = vec![30, 25];
let pairs: Vec<_> = names.iter().zip(ages.iter()).collect();
// [("Alice", 30), ("Bob", 25)]
\`\`\`

### Implementing Iterator

\`\`\`rust
struct Counter {
    count: u32,
    max:   u32,
}

impl Counter {
    fn new(max: u32) -> Self { Counter { count: 0, max } }
}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.count < self.max {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

// Now Counter gets all iterator adapters for free
let sum: u32 = Counter::new(5).sum(); // 15
\`\`\``,
    quiz: [
      {
        q: 'What is the difference between `Fn` and `FnOnce`?',
        options: [
          'Fn is faster; FnOnce is for async code',
          'Fn can be called multiple times (borrows captures); FnOnce can only be called once (moves captures)',
          'FnOnce is the base trait, Fn is for closures without captures',
          'They are identical — the names are aliases',
        ],
        correct: 1,
        explanation: 'FnOnce consumes captured values on the first call. Fn only borrows them, allowing repeated calls.',
      },
      {
        q: 'Why are Rust iterators described as "lazy"?',
        options: [
          'They use garbage collection for cleanup',
          'They are slower than for loops',
          'No work is done until a consuming adapter like collect() or sum() is called',
          'They only work on sorted collections',
        ],
        correct: 2,
        explanation: 'Adapters like map() and filter() produce new iterators without doing work — the pipeline is driven by a terminal consumer.',
      },
      {
        q: 'What does `collect()` do to an iterator?',
        options: [
          'Returns the first element',
          'Counts the elements',
          'Consumes the iterator and assembles items into a collection type',
          'Sorts the elements',
        ],
        correct: 2,
        explanation: '`collect()` is a terminal adapter — it drives the iterator to completion and gathers results into a Vec, HashMap, String, etc.',
      },
      {
        q: 'What does `fold(init, f)` return?',
        options: [
          'An iterator of partial sums',
          'The last element of the iterator',
          'A single accumulated value computed by applying f repeatedly',
          'A tuple of (first, last) elements',
        ],
        correct: 2,
        explanation: '`fold` is a general reduce — it applies the closure to each element and an accumulator, returning the final accumulated value.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Given a Vec of integers, use iterator chain (no for loop allowed) to: filter out numbers less than 0, square each remaining number, and return the sum. Test with [-3, 1, 2, -1, 4, 0].',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `fn sum_of_squares(nums: &[i32]) -> i32 {
    nums.iter()
        .filter(|&&x| x >= 0)
        .map(|&x| x * x)
        .sum()
}

fn main() {
    let nums = vec![-3, 1, 2, -1, 4, 0];
    // Expected: 1*1 + 2*2 + 4*4 + 0*0 = 1 + 4 + 16 + 0 = 21
    println!("Sum of squares: {}", sum_of_squares(&nums));
}
`,
        },
      ],
    },
  },

  // ── Module 7 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m07',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'Async with Tokio',
    subtitle: 'Non-blocking I/O, async/await, and the Tokio runtime',
    level: 'PhD',
    xp: 195,
    duration: 45,
    module: 7,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Add the Tokio runtime to a project, write async functions, spawn concurrent tasks, and make HTTP requests with reqwest.',
    keyTerms: [
      { term: 'async fn', definition: 'A function that returns a Future — it does not block the thread when awaiting I/O.' },
      { term: '.await', definition: 'Suspends the current async task until the Future resolves, yielding control to the runtime.' },
      { term: 'Tokio', definition: "The de-facto async runtime for Rust — provides the thread pool, I/O reactor, and timer." },
      { term: 'tokio::spawn', definition: 'Spawns a new async task on the Tokio thread pool — returns a JoinHandle.' },
      { term: 'JoinHandle', definition: 'A handle to a spawned task; await it to wait for the task and retrieve its result.' },
      { term: 'reqwest', definition: 'The most popular async HTTP client for Rust, built on Tokio.' },
    ],
    content: `## Async with Tokio

### Setup

Add to \`Cargo.toml\`:

\`\`\`toml
[dependencies]
tokio  = { version = "1", features = ["full"] }
reqwest = { version = "0.12", features = ["json"] }
serde  = { version = "1", features = ["derive"] }
\`\`\`

### Basic async/await

\`\`\`rust
use tokio::time::{sleep, Duration};

async fn fetch_data(id: u32) -> String {
    sleep(Duration::from_millis(100)).await; // simulate I/O
    format!("Data for id={}", id)
}

#[tokio::main]
async fn main() {
    let result = fetch_data(42).await;
    println!("{}", result);
}
\`\`\`

### Concurrent Tasks with tokio::spawn

\`\`\`rust
use tokio::task::JoinHandle;

#[tokio::main]
async fn main() {
    let mut handles: Vec<JoinHandle<String>> = Vec::new();

    for i in 0..5 {
        let h = tokio::spawn(async move {
            tokio::time::sleep(Duration::from_millis(50)).await;
            format!("Task {} done", i)
        });
        handles.push(h);
    }

    for h in handles {
        let result = h.await.unwrap();
        println!("{}", result);
    }
}
\`\`\`

All 5 tasks run concurrently — total time ~50ms, not 250ms.

### HTTP Request with reqwest

\`\`\`rust
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Post {
    id:     u32,
    title:  String,
    body:   String,
    userId: u32,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let post: Post = reqwest::get("https://jsonplaceholder.typicode.com/posts/1")
        .await?
        .json::<Post>()
        .await?;

    println!("Title: {}", post.title);
    Ok(())
}
\`\`\`

### tokio::join! — Wait for Multiple Futures

\`\`\`rust
async fn task_a() -> &'static str { "A" }
async fn task_b() -> &'static str { "B" }

#[tokio::main]
async fn main() {
    let (a, b) = tokio::join!(task_a(), task_b());
    println!("{} {}", a, b); // both run concurrently
}
\`\`\`

### Async Channels

\`\`\`rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel::<u32>(32);

    tokio::spawn(async move {
        for i in 0..5 {
            tx.send(i).await.unwrap();
        }
    });

    while let Some(val) = rx.recv().await {
        println!("Received: {}", val);
    }
}
\`\`\``,
    quiz: [
      {
        q: 'What does `#[tokio::main]` do to the `main` function?',
        options: [
          'Makes main run on a background thread',
          'Sets up the Tokio runtime and drives the async main function to completion',
          'Adds logging to all async calls',
          'Enables multi-threading automatically',
        ],
        correct: 1,
        explanation: '`#[tokio::main]` is a macro that creates the Tokio runtime and uses it to run the async main function synchronously.',
      },
      {
        q: 'What is the difference between `tokio::spawn` and `tokio::join!`?',
        options: [
          'spawn is for CPU tasks, join! is for I/O tasks',
          'spawn creates a detached task that runs independently; join! runs futures concurrently and waits for all of them',
          'They are identical',
          'spawn is blocking, join! is non-blocking',
        ],
        correct: 1,
        explanation: 'spawn creates an independent background task. join! runs multiple futures concurrently within the current task and awaits all results.',
      },
      {
        q: 'Why does async Rust not block a thread while awaiting I/O?',
        options: [
          'It uses a separate process per future',
          'The runtime suspends the task and moves the thread to work on other tasks',
          'I/O is handled by the OS kernel without any Rust involvement',
          'Rust copies the stack to a heap buffer',
        ],
        correct: 1,
        explanation: 'The Tokio runtime parks suspended tasks and puts threads to work on ready tasks — one thread can drive thousands of concurrent connections.',
      },
      {
        q: 'What crate provides an ergonomic async HTTP client for Rust?',
        options: ['hyper', 'actix-web', 'reqwest', 'surf'],
        correct: 2,
        explanation: 'reqwest is the standard async HTTP client, built on hyper and Tokio, with a high-level API for JSON, multipart, and redirects.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Write an async program that spawns 3 tasks, each sleeping for 100ms and returning a string "Task N done". Collect all results and print them. Use tokio::spawn and JoinHandle.',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `use tokio::time::{sleep, Duration};

async fn run_task(n: u32) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("Task {} done", n)
}

#[tokio::main]
async fn main() {
    let handles: Vec<_> = (1..=3)
        .map(|n| tokio::spawn(run_task(n)))
        .collect();

    for handle in handles {
        match handle.await {
            Ok(result) => println!("{}", result),
            Err(e)     => println!("Task failed: {}", e),
        }
    }
}
`,
        },
      ],
    },
  },

  // ── Module 8 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-rust-m08',
    track: 'crash',
    crashId: 'cc-rust',
    crashTitle: 'Rust',
    certArea: 'Rust Crash Course',
    title: 'CLI Tool with clap',
    subtitle: 'Parse arguments, read files, and ship a polished command-line app',
    level: 'PhD',
    xp: 200,
    duration: 60,
    module: 8,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Use the clap crate to define and parse CLI arguments, combine file I/O with error handling, and ship a functional word-count tool.',
    keyTerms: [
      { term: 'clap', definition: 'Command Line Argument Parser — the standard Rust crate for building CLIs with subcommands, flags, and type-safe argument parsing.' },
      { term: '#[derive(Parser)]', definition: 'clap macro that generates an argument parser from a struct definition.' },
      { term: 'std::fs', definition: 'Standard library module for filesystem operations: reading, writing, and metadata.' },
      { term: 'BufReader', definition: 'Wraps an I/O reader with buffering — reads in chunks for efficiency rather than byte by byte.' },
      { term: 'exit code', definition: 'An integer returned to the OS on program exit — 0 means success, non-zero means failure.' },
      { term: 'eprintln!', definition: 'Prints to stderr instead of stdout — the correct channel for error messages in CLIs.' },
    ],
    content: `## CLI Tool with clap

### Setup

\`\`\`toml
[dependencies]
clap = { version = "4", features = ["derive"] }
\`\`\`

### Complete Word-Count CLI (wc clone)

\`\`\`rust
use clap::Parser;
use std::{
    fs::File,
    io::{self, BufRead, BufReader},
    path::PathBuf,
    process,
};

/// A minimal wc clone — count lines, words, and chars in a file.
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// File to analyse (reads stdin if omitted)
    #[arg(value_name = "FILE")]
    file: Option<PathBuf>,

    /// Count lines
    #[arg(short = 'l', long)]
    lines: bool,

    /// Count words
    #[arg(short = 'w', long)]
    words: bool,

    /// Count characters
    #[arg(short = 'c', long)]
    chars: bool,
}

struct Counts {
    lines: usize,
    words: usize,
    chars: usize,
}

fn count(reader: impl BufRead) -> Counts {
    let mut counts = Counts { lines: 0, words: 0, chars: 0 };

    for line in reader.lines() {
        match line {
            Ok(l) => {
                counts.lines += 1;
                counts.words += l.split_whitespace().count();
                counts.chars += l.chars().count() + 1; // +1 for newline
            }
            Err(e) => {
                eprintln!("Read error: {}", e);
                process::exit(1);
            }
        }
    }
    counts
}

fn main() {
    let args = Args::parse();

    let counts = if let Some(path) = &args.file {
        match File::open(path) {
            Ok(f)  => count(BufReader::new(f)),
            Err(e) => {
                eprintln!("Error opening {:?}: {}", path, e);
                process::exit(1);
            }
        }
    } else {
        count(BufReader::new(io::stdin()))
    };

    // If no flags, show all
    let show_all = !args.lines && !args.words && !args.chars;

    if args.lines || show_all { print!("{:>8}", counts.lines); }
    if args.words || show_all { print!("{:>8}", counts.words); }
    if args.chars || show_all { print!("{:>8}", counts.chars); }

    if let Some(path) = &args.file {
        println!(" {}", path.display());
    } else {
        println!();
    }
}
\`\`\`

### Build and Run

\`\`\`bash
cargo build --release

# Count everything in a file
./target/release/wc Cargo.toml

# Only word count
./target/release/wc -w Cargo.toml

# From stdin
echo "hello world foo" | ./target/release/wc

# Built-in help (clap generates this automatically)
./target/release/wc --help
\`\`\`

### Adding Subcommands

\`\`\`rust
#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Count words in a file
    Count { file: PathBuf },
    /// Reverse a string
    Reverse { text: String },
}
\`\`\`

### Writing to Files

\`\`\`rust
use std::io::Write;
use std::fs::File;

let mut file = File::create("output.txt")?;
writeln!(file, "Hello, file!")?;
\`\`\``,
    quiz: [
      {
        q: 'What does `#[derive(Parser)]` from clap do?',
        options: [
          'Serializes the struct to JSON',
          'Generates argument parsing code from the struct definition and doc comments',
          'Makes the struct implement Display',
          'Validates field types at runtime',
        ],
        correct: 1,
        explanation: 'The derive macro reads the struct definition and field attributes at compile time to generate a complete argument parser.',
      },
      {
        q: 'Why use `eprintln!` for error messages in a CLI instead of `println!`?',
        options: [
          'eprintln! is faster',
          'Error messages should go to stderr so stdout can be piped cleanly to other programs',
          'println! does not work when the file is missing',
          'eprintln! formats the message in red',
        ],
        correct: 1,
        explanation: 'stdout is for the program\'s output data; stderr is for diagnostics. Printing errors to stderr keeps stdout pipeable.',
      },
      {
        q: 'What does `process::exit(1)` do?',
        options: [
          'Restarts the program',
          'Terminates the process immediately with exit code 1, indicating failure',
          'Throws a recoverable error',
          'Returns 1 from main',
        ],
        correct: 1,
        explanation: 'process::exit() terminates immediately, bypassing destructors. Exit code 1 signals failure to the shell or calling process.',
      },
      {
        q: 'What is the advantage of `BufReader` when reading a file line by line?',
        options: [
          'It locks the file exclusively',
          'It reads the entire file into memory first',
          'It buffers reads into larger chunks, reducing system call overhead',
          'It automatically handles UTF-8 decoding errors',
        ],
        correct: 2,
        explanation: 'Unbuffered reads would issue a syscall per byte. BufReader reads in ~8KB chunks, dramatically reducing syscall overhead for line-by-line processing.',
      },
    ],
    ide: {
      language: 'rust',
      task: 'Write a CLI that accepts a `--name` flag (default "World") and a `--count` flag (default 1) and prints "Hello, <name>!" count times. Use clap derive.',
      files: [
        {
          name: 'main.rs',
          language: 'rust',
          code: `use clap::Parser;

/// Simple greeting CLI
#[derive(Parser, Debug)]
#[command(author, version, about)]
struct Args {
    /// Name to greet
    #[arg(short, long, default_value = "World")]
    name: String,

    /// Number of times to greet
    #[arg(short, long, default_value_t = 1)]
    count: u32,
}

fn main() {
    let args = Args::parse();

    for _ in 0..args.count {
        println!("Hello, {}!", args.name);
    }
}
`,
        },
      ],
    },
  },
]
