import type { Course } from '../courses'

const CC_SWIFT_OBJ = 'Write idiomatic Swift from zero — understand value semantics, protocol-oriented design, and Apple\'s concurrency model to build real iOS and macOS applications.'

export const crashSwiftCourses: Course[] = [
  {
    id: 'cc-swift-m01', track: 'crash', title: 'Xcode, Swift Playgrounds & Hello World',
    subtitle: 'Install Xcode, explore Swift Playgrounds, understand the Swift compilation model, and write your first Swift program with proper formatting.',
    moduleObjective: 'Install Xcode 15+, run code in a Swift Playground and a command-line Swift file, use print() and string interpolation, and understand Swift\'s type safety model.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'Basic',
    xp: 155, duration: 12, module: 1, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'Xcode', definition: 'Apple\'s official IDE for Swift, iOS, macOS, watchOS, and tvOS development. Includes compiler, debugger, Interface Builder, and simulator.' },
      { term: 'Swift Playground', definition: 'An interactive document in Xcode (or the standalone Playgrounds app) that executes Swift code live and shows results inline. Perfect for learning and prototyping.' },
      { term: 'Type Inference', definition: 'Swift infers the type of a variable from its initial value. let name = "Jordan" infers String without needing : String explicitly.' },
      { term: 'String Interpolation', definition: 'Embedding expressions inside strings with \\(expression). "Hello, \\(name)!" substitutes the value of name at runtime.' },
      { term: 'REPL', definition: 'Read-Eval-Print Loop — run swift in Terminal to get an interactive Swift session. Type code, see results immediately.' },
      { term: 'Swift Package Manager', definition: 'Built-in tool for managing Swift dependencies. swift package init creates a new project; swift run executes it.' },
    ],
    content: `## Xcode, Swift Playgrounds & Hello World

### What Makes Swift Different?

Swift was designed by Apple in 2014 to replace Objective-C. Its core design principles:

1. **Safety** — optionals force you to handle null explicitly; strong typing catches errors at compile time
2. **Performance** — compiles to native machine code; comparable to C in benchmarks
3. **Expressiveness** — clean syntax, type inference, value types, protocol-oriented design
4. **Interoperability** — works side-by-side with Objective-C in the same project

Swift runs on macOS, iOS, iPadOS, watchOS, tvOS, and on Linux (server-side via Swift on the server). It is the primary language for all Apple platform development.

---

### Installing Xcode

Xcode includes the Swift compiler, iOS/macOS simulators, and all Apple SDKs.

**Mac (required for iOS/macOS development):**
1. Open the App Store
2. Search "Xcode" — download Xcode 15 or later (it is ~13GB)
3. Open it once to agree to the license and install components
4. Verify: open Terminal, run: \`swift --version\`

**Linux (no Xcode):**
\`\`\`bash
# Download Swift toolchain from swift.org
wget https://download.swift.org/swift-5.10-release/ubuntu2204/swift-5.10-RELEASE/swift-5.10-RELEASE-ubuntu22.04.tar.gz
tar xzf swift-5.10-RELEASE-ubuntu22.04.tar.gz
export PATH="$PWD/swift-5.10-RELEASE-ubuntu22.04/usr/bin:$PATH"
swift --version
\`\`\`

**Windows:** Use Swift on Windows (swift.org/install) or run code in an online Swift environment like swiftfiddle.com for this crash course.

---

### Swift Playgrounds

The fastest way to learn Swift — code runs as you type:

1. Open Xcode → File → New → Playground
2. Select "Blank" → macOS or iOS → Create
3. Code executes when you click the play button (or Shift+Enter for a line)
4. Results appear in the sidebar; use \`print()\` for console output

**Alternatively:** run Swift scripts from Terminal:
\`\`\`bash
# Create a file
echo 'print("Hello, Swift!")' > hello.swift
# Run it directly (no compile step needed)
swift hello.swift
\`\`\`

---

### Hello World and Swift Basics

\`\`\`swift
// Single-line comment
/* Multi-line
   comment */

// print() outputs to console. No semicolons required.
print("Hello, World!")
print("Hello, Swift 5.10!")

// String interpolation — embed expressions with \\(...)
let name = "Jordan"
let year = 2025
print("Hello, \\(name)! Year: \\(year)")
print("2 + 2 = \\(2 + 2)")  // arithmetic inside interpolation

// Multi-line strings
let message = """
    Swift is:
    - Safe
    - Fast
    - Expressive
    """
print(message)
\`\`\`

---

### Swift's Type System

Swift is **statically typed** — every variable has a type known at compile time. But you rarely write the type explicitly because **type inference** handles it:

\`\`\`swift
let greeting = "Hello"     // inferred as String
let count    = 42          // inferred as Int
let pi       = 3.14159     // inferred as Double
let isActive = true        // inferred as Bool

// Explicit types (use when the inferred type would be wrong):
let bigNumber: Int64   = 9_223_372_036_854_775_807
let smallFloat: Float  = 3.14  // Float (32-bit), not Double (64-bit)
let ascii: Character   = "A"

// Type annotation required when no initial value:
var currentUser: String  // no value yet — must annotate
currentUser = "Alice"
\`\`\`

**Swift is strict about types.** Unlike JavaScript, \`"5" + 5\` is a compile error. You must convert explicitly:

\`\`\`swift
let numStr = "42"
let num    = Int(numStr) ?? 0  // Int("42") returns Int? (optional) — ?? provides default
print(num + 8)  // 50
\`\`\`

---

### Your First Command-Line Program: Unit Converter

\`\`\`swift
func kilometersToMiles(_ km: Double) -> Double {
    return km * 0.621371
}

func milesToKilometers(_ miles: Double) -> Double {
    return miles / 0.621371
}

func celsiusToFahrenheit(_ c: Double) -> Double {
    return c * 9.0 / 5.0 + 32.0
}

let distances: [Double] = [1.0, 5.0, 10.0, 42.195]  // km

print("Distance Conversions:")
for km in distances {
    let miles = kilometersToMiles(km)
    print(String(format: "  %.3f km = %.3f miles", km, miles))
}

print("\\nTemperature Conversions:")
let temps = [0.0, 20.0, 37.0, 100.0]  // Celsius
for c in temps {
    print(String(format: "  %.1f°C = %.1f°F", c, celsiusToFahrenheit(c)))
}
\`\`\`

Swift function parameters use **argument labels** (\`_ km:\` means the caller doesn't write the label: \`kilometersToMiles(5.0)\`). We cover this in Module 3.

---

### Swift Package Manager (SPM) for CLI Programs

For real projects beyond Playgrounds:

\`\`\`bash
mkdir swift-crash-course
cd swift-crash-course
swift package init --type executable

# Project structure:
# Package.swift          — project manifest
# Sources/swift-crash-course/main.swift — entry point

# Run:
swift run
# Build only:
swift build
\`\`\`

Edit \`Sources/swift-crash-course/main.swift\` and \`swift run\` to execute.`,
    quiz: [
      { q: 'What does the ?? operator do in Swift?', options: ['Checks if two values are equal', 'Throws an error if a value is nil', 'Provides a default value when an Optional is nil', 'Declares a variable as optional'], correct: 2, explanation: 'The nil-coalescing operator ?? unwraps an Optional. If the optional is non-nil, it returns the unwrapped value; if nil, it returns the right-hand side default. Int("abc") ?? 0 returns 0 because "abc" cannot be converted to Int.' },
      { q: 'What does "Hello, \\(name)!" do in Swift?', options: ['Escapes the string', 'Embeds the value of name in the string at runtime — string interpolation', 'Creates a template literal', 'Declares a constant named name'], correct: 1, explanation: 'Swift string interpolation uses \\(...) — the backslash-parentheses syntax embeds any expression inside a string. It is evaluated at runtime and converted to a String representation.' },
      { q: 'What is type inference in Swift?', options: ['Swift converts types automatically like JavaScript', 'Swift deduces the type of a variable from its initial value, so you rarely need to write the type explicitly', 'Swift assigns types at runtime', 'All variables in Swift are untyped'], correct: 1, explanation: 'Swift is strongly statically typed, but the compiler infers the type from context. let x = 42 infers Int. Type annotations (:Int) are optional when the compiler can determine the type — and required when it cannot.' },
      { q: 'In Swift, what does swift hello.swift do in the terminal?', options: ['Compiles hello.swift to a binary', 'Interprets and runs hello.swift directly without a separate compile step', 'Opens hello.swift in Xcode', 'Creates a new Swift package'], correct: 1, explanation: 'Swift can run .swift files directly like a scripting language. It compiles and immediately executes the file. For production apps you\'d use swift build to create a binary, but swift filename.swift is perfect for quick runs.' },
    ],
    ide: {
      language: 'swift',
      task: 'Write a Swift function tipCalculator(billAmount: Double, tipPercent: Double) -> (tip: Double, total: Double) that returns a named tuple with the tip amount and total. Then write formatBill(_ amount: Double) -> String that formats a Double as "$XX.XX". In the main area, test with $85.50 at 18% and $42.00 at 20%.',
      starterCode: `import Foundation

// TODO: tipCalculator returns a named tuple (tip, total)
func tipCalculator(billAmount: Double, tipPercent: Double) -> (tip: Double, total: Double) {
    let tip = 0.0   // TODO: billAmount * tipPercent / 100
    let total = 0.0 // TODO: billAmount + tip
    return (tip, total)
}

// TODO: format a Double as "$XX.XX"
func formatBill(_ amount: Double) -> String {
    return ""  // use String(format: "$%.2f", amount)
}

// Test
let result1 = tipCalculator(billAmount: 85.50, tipPercent: 18)
print("Bill: \\(formatBill(85.50)) | Tip: \\(formatBill(result1.tip)) | Total: \\(formatBill(result1.total))")

let result2 = tipCalculator(billAmount: 42.00, tipPercent: 20)
print("Bill: \\(formatBill(42.00)) | Tip: \\(formatBill(result2.tip)) | Total: \\(formatBill(result2.total))")`,
      solution: `import Foundation

func tipCalculator(billAmount: Double, tipPercent: Double) -> (tip: Double, total: Double) {
    let tip   = billAmount * tipPercent / 100
    let total = billAmount + tip
    return (tip, total)
}

func formatBill(_ amount: Double) -> String {
    return String(format: "$%.2f", amount)
}

let result1 = tipCalculator(billAmount: 85.50, tipPercent: 18)
print("Bill: \\(formatBill(85.50)) | Tip: \\(formatBill(result1.tip)) | Total: \\(formatBill(result1.total))")

let result2 = tipCalculator(billAmount: 42.00, tipPercent: 20)
print("Bill: \\(formatBill(42.00)) | Tip: \\(formatBill(result2.tip)) | Total: \\(formatBill(result2.total))")`,
      hints: [
        'Tip calculation: billAmount * tipPercent / 100.0',
        'Named tuple return: return (tip: tipAmount, total: billAmount + tipAmount)',
        'String(format: "$%.2f", amount) formats to 2 decimal places with $ prefix',
      ],
    },
  },
  {
    id: 'cc-swift-m02', track: 'crash', title: 'Variables, Constants, Types & Optionals',
    subtitle: 'Master let/var, Swift\'s type system, numeric types, and the Optional type — Swift\'s solution to null safety.',
    moduleObjective: 'Use let and var correctly, understand all Swift value types, work with optionals using if let, guard let, and optional chaining, and convert between types safely.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'Basic',
    xp: 160, duration: 14, module: 2, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'Optional', definition: 'A type that either holds a value or nil. Declared with ?: String? can be nil. Must be unwrapped before use.' },
      { term: 'if let', definition: 'Optional binding: if let name = optionalName { /* name is unwrapped here */ }. Safe unwrapping that only enters the block if the optional has a value.' },
      { term: 'guard let', definition: 'Early exit pattern: guard let value = optional else { return }. Unwraps and keeps the value in scope for the rest of the function.' },
      { term: 'Optional Chaining', definition: 'Access properties or methods on an optional with ?.. Returns nil if any step is nil. user?.address?.city returns nil if user or address is nil.' },
      { term: 'Forced Unwrap', definition: 'optional! asserts the optional is non-nil and unwraps it. Crashes with a fatal error if nil. Use only when you are 100% certain.' },
      { term: 'Value Types', definition: 'Swift structs, enums, and tuples are value types — copied on assignment. Changes to a copy do not affect the original.' },
    ],
    content: `## Variables, Constants, Types & Optionals

### let and var

\`\`\`swift
// let — constant (immutable). Use by default.
let maxScore = 100
let appName  = "JST Academy"
// maxScore = 200  // ERROR: cannot assign to value: 'maxScore' is a 'let' constant

// var — variable (mutable). Use only when the value must change.
var currentScore = 0
currentScore += 10
currentScore += 25
print("Score: \\(currentScore)")  // Score: 35

// Type annotation when type cannot be inferred:
var message: String  // no initial value — must annotate
message = "Hello"
\`\`\`

**Rule: default to \`let\`. The compiler tells you when you need \`var\`.**

---

### Swift's Type Landscape

\`\`\`swift
// Integer types
let i: Int     = -42          // platform-native (64-bit on modern hardware)
let u: UInt    = 42           // unsigned integer
let i8: Int8   = 127          // -128 to 127
let i16: Int16 = 32767
let i64: Int64 = 9_223_372_036_854_775_807

// Floating-point
let d: Double  = 3.141592653589793  // 64-bit (default)
let f: Float   = 3.14              // 32-bit

// Boolean
let isActive: Bool = true

// Character and String
let grade: Character = "A"
let name: String     = "Jordan"

// Collection types
let numbers: [Int]          = [1, 2, 3, 4, 5]
let scores: [String: Int]   = ["Alice": 95, "Bob": 88]
let pair: (String, Int)     = ("Age", 28)  // tuple
\`\`\`

---

### Optionals: The Null Safety System

In most languages, any variable can be null/nil. In Swift, only **Optional types** can be nil:

\`\`\`swift
var name: String  = "Jordan"  // cannot be nil — compiler guarantees it
var alias: String? = nil      // can be nil — the ? makes it Optional

// Optionals must be unwrapped before use:
print(name)          // prints "Jordan" directly
// print(alias)      // ERROR: value of optional type 'String?' must be unwrapped

// Safe way 1: if let (optional binding)
if let unwrapped = alias {
    print("Alias: \\(unwrapped)")  // only runs if alias != nil
} else {
    print("No alias set")
}

// Shorthand (Swift 5.7+) — same name:
if let alias {
    print("Alias: \\(alias)")
}

// Safe way 2: guard let (early exit)
func greet(_ name: String?) {
    guard let name = name else {
        print("No name provided")
        return  // exits the function
    }
    // name is a non-optional String here
    print("Hello, \\(name)!")
}
greet(nil)       // No name provided
greet("Alice")   // Hello, Alice!

// Safe way 3: nil coalescing (??)
let displayName = alias ?? "Anonymous"
print(displayName)  // "Anonymous" since alias is nil

// Safe way 4: optional chaining (?.)
let upper = alias?.uppercased()  // nil — safe, no crash
print(upper as Any)  // nil

// UNSAFE: forced unwrap (!)
let forceAlias = alias!  // CRASHES with fatal error if alias is nil
\`\`\`

---

### Type Conversion

Swift never implicitly converts types. All conversions are explicit:

\`\`\`swift
let i = 5
let d = 3.14

// let sum = i + d  // ERROR: cannot add Int and Double directly
let sum = Double(i) + d  // correct: convert i to Double first
print(sum)  // 8.14

// String ↔ numeric conversions
let numStr   = "42"
let parsed   = Int(numStr)    // Optional<Int> — might fail
let safeNum  = Int(numStr) ?? 0  // safe: 42
let badParse = Int("abc")    // nil

let num    = 42
let asStr  = String(num)      // "42"
let asStr2 = "\\(num)"        // "42" — interpolation also works
\`\`\`

---

### Tuples

Tuples group multiple values without a named type:

\`\`\`swift
// Basic tuple
let point = (x: 3.0, y: 4.0)
print(point.x)  // 3.0
print(point.y)  // 4.0

// Destructuring
let (x, y) = (3.0, 4.0)
let (_, lat) = (longitude: -76.8, latitude: 17.99)  // ignore first value

// Return multiple values from a function
func minMax(array: [Int]) -> (min: Int, max: Int) {
    return (array.min()!, array.max()!)
}
let bounds = minMax(array: [3, 1, 7, 2, 9])
print("Min: \\(bounds.min), Max: \\(bounds.max)")  // Min: 1, Max: 9
\`\`\`

---

### Practical Optional Patterns

\`\`\`swift
struct User {
    let name: String
    var email: String?
    var phoneNumber: String?
}

func displayContact(_ user: User) {
    print("Name: \\(user.name)")

    // Optional chaining + nil coalescing
    let contact = user.email ?? user.phoneNumber ?? "No contact info"
    print("Contact: \\(contact)")

    // Multiple optional bindings in one if let
    if let email = user.email, let phone = user.phoneNumber {
        print("Both: \\(email), \\(phone)")
    } else if let email = user.email {
        print("Email only: \\(email)")
    } else {
        print("No email on file")
    }
}

let jordan = User(name: "Jordan", email: "jordan@jst.com", phoneNumber: "876-555-0100")
let alice  = User(name: "Alice",  email: nil,              phoneNumber: "876-555-0200")
displayContact(jordan)
displayContact(alice)
\`\`\``,
    quiz: [
      { q: 'What is the difference between String and String? in Swift?', options: ['String? is faster', 'String cannot be reassigned; String? can', 'String is never nil; String? can be nil and must be unwrapped before use', 'String? holds multiple strings'], correct: 2, explanation: 'String (without ?) is a non-optional — the compiler guarantees it always holds a valid String value. String? is an Optional<String> that can be nil. You must unwrap it (if let, guard let, !!, or ??) before using the underlying String.' },
      { q: 'What is the purpose of guard let vs if let?', options: ['They are identical — just stylistic choice', 'guard let exits the current scope on failure (else must return/throw); if let creates a nested scope for success', 'guard let is unsafe; if let is safe', 'guard let can only be used in functions'], correct: 1, explanation: 'guard let is the early-exit pattern. If the optional is nil, the else branch runs and must exit (return, throw, break, continue). The key benefit: the unwrapped value is available in the rest of the function\'s scope, not nested inside braces.' },
      { q: 'What does optional chaining (user?.address?.city) return if user is nil?', options: ['An empty string', 'A fatal error (crash)', 'nil — the entire chain short-circuits to nil', 'The string "nil"'], correct: 2, explanation: 'Optional chaining short-circuits — if any step returns nil, the entire expression returns nil without proceeding. This is the safe alternative to forced unwrapping (user!.address!.city) which would crash.' },
      { q: 'Why does Swift require explicit type conversion (Double(myInt))?', options: ['Performance reasons only', 'To prevent implicit narrowing bugs — Swift never silently converts types, forcing you to be intentional', 'Limitation of the compiler', 'It does not — Swift converts automatically like C'], correct: 1, explanation: 'Swift\'s strict type system prevents a whole class of subtle bugs. Adding an Int to a Double without explicit conversion is a compile error. This forces you to be deliberate: Double(myInt) + 3.14 is clear and intentional.' },
    ],
    ide: {
      language: 'swift',
      task: 'Write a function parseUserAge(_ input: String) -> String that tries to convert input to an Int, checks if it is between 1 and 120, and returns either "Valid age: X" or an error message. Use guard let for the parse step and another guard for the range check. Test with "25", "0", "150", "abc".',
      starterCode: `import Foundation

func parseUserAge(_ input: String) -> String {
    // Step 1: guard let to parse String to Int
    guard let age = Int(input) else {
        return ""  // TODO: "Invalid input: '\\(input)' is not a number"
    }

    // Step 2: guard for range 1...120
    guard age >= 1 && age <= 120 else {
        return ""  // TODO: "Out of range: \\(age) must be between 1 and 120"
    }

    return ""  // TODO: "Valid age: \\(age)"
}

// Tests
let inputs = ["25", "0", "150", "abc", "18", "-5"]
for input in inputs {
    print(parseUserAge(input))
}`,
      solution: `import Foundation

func parseUserAge(_ input: String) -> String {
    guard let age = Int(input) else {
        return "Invalid input: '\\(input)' is not a number"
    }
    guard age >= 1 && age <= 120 else {
        return "Out of range: \\(age) must be between 1 and 120"
    }
    return "Valid age: \\(age)"
}

let inputs = ["25", "0", "150", "abc", "18", "-5"]
for input in inputs {
    print(parseUserAge(input))
}`,
      hints: [
        'Int(input) returns Optional<Int>. Use guard let age = Int(input) else { return "error" }',
        'After the first guard, age is a non-optional Int in scope for the rest of the function.',
        'Range check: guard age >= 1 && age <= 120 else { return "out of range message" }',
      ],
    },
  },
  {
    id: 'cc-swift-m03', track: 'crash', title: 'Control Flow, Functions & Closures',
    subtitle: 'Write expressive Swift control flow with if/guard/switch/for, design functions with argument labels and default parameters, and master closures.',
    moduleObjective: 'Use all Swift control flow constructs, write functions with internal/external parameter labels, pass closures as arguments, use trailing closure syntax, and understand @escaping.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'Masters',
    xp: 170, duration: 16, module: 3, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'Argument Label', definition: 'The external name of a function parameter (used by the caller). Internal name is used in the body. func greet(to name: String) — "to" is the label, "name" is the internal name.' },
      { term: 'Closure', definition: 'A self-contained block of code that can be passed around and executed. { (params) -> ReturnType in body }. Closures capture variables from their surrounding scope.' },
      { term: 'Trailing Closure', definition: 'When a closure is the last argument, it can be written outside the parentheses. array.sorted { $0 > $1 } instead of array.sorted(by: { $0 > $1 }).' },
      { term: 'Shorthand Arguments', definition: '$0, $1, $2... refer to closure arguments by position. [1,2,3].map { $0 * 2 } doubles each element.' },
      { term: '@escaping', definition: 'Marks a closure that outlives the function call — stored in a property or executed asynchronously. Required for completion handlers and async callbacks.' },
      { term: 'switch with Pattern Matching', definition: 'Swift switch is exhaustive and powerful — matches ranges, tuples, enums, and uses where conditions. No fall-through by default.' },
    ],
    content: `## Control Flow, Functions & Closures

### Control Flow: if, guard, switch

\`\`\`swift
// if/else — no parentheses required around condition
let score = 87
let grade: String
if score >= 90      { grade = "A" }
else if score >= 80 { grade = "B" }
else if score >= 70 { grade = "C" }
else                { grade = "F" }

// Ternary
let status = score >= 60 ? "Pass" : "Fail"

// guard — early exit (same as guard let but for conditions)
func processScore(_ score: Int) -> String {
    guard score >= 0 && score <= 100 else {
        return "Invalid score"
    }
    return "Valid: \\(score)"
}
\`\`\`

**Swift switch — exhaustive and powerful:**
\`\`\`swift
// Must handle all cases (or use default:)
let day = "Wednesday"
switch day {
case "Saturday", "Sunday":
    print("Weekend")
case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday":
    print("Weekday")
default:
    print("Unknown")
}

// Range matching
let temp = 23
switch temp {
case ..<0:     print("Freezing")
case 0..<15:   print("Cold")
case 15..<25:  print("Comfortable")
case 25...:    print("Hot")
default:       break
}

// Tuple pattern matching
let point = (2, 0)
switch point {
case (0, 0):      print("Origin")
case (let x, 0):  print("On x-axis at \\(x)")
case (0, let y):  print("On y-axis at \\(y)")
case (let x, let y): print("Point at (\\(x), \\(y))")
}
\`\`\`

---

### Functions: Labels and Parameters

Swift functions have **argument labels** (external) and **parameter names** (internal):

\`\`\`swift
// External label "to", internal name "recipient"
func sendEmail(to recipient: String, subject: String, body: String) {
    print("To: \\(recipient)")
    print("Subject: \\(subject)")
    print("\\(body)")
}
// Called with labels:
sendEmail(to: "alice@example.com", subject: "Hello", body: "How are you?")

// No external label with _
func multiply(_ a: Int, by b: Int) -> Int {
    return a * b
}
let result = multiply(5, by: 3)  // 15

// Default parameter values
func greet(_ name: String, prefix: String = "Hello") -> String {
    return "\\(prefix), \\(name)!"
}
print(greet("Jordan"))             // Hello, Jordan!
print(greet("Jordan", prefix: "Hey")) // Hey, Jordan!

// Variadic parameters
func sum(_ numbers: Int...) -> Int {
    return numbers.reduce(0, +)
}
print(sum(1, 2, 3, 4, 5))  // 15

// inout — modify a parameter in place
func doubleInPlace(_ n: inout Int) {
    n *= 2
}
var x = 5
doubleInPlace(&x)
print(x)  // 10
\`\`\`

---

### Closures

A closure is a function without a name:

\`\`\`swift
// Full closure syntax
let double: (Int) -> Int = { (n: Int) -> Int in
    return n * 2
}

// Shorthand argument names ($0 = first arg, etc.)
let double2: (Int) -> Int = { $0 * 2 }

// Trailing closure syntax when last argument
let numbers = [5, 3, 8, 1, 9, 2, 7]

let sorted = numbers.sorted(by: { a, b in a < b })
let sortedShort = numbers.sorted { $0 < $1 }   // trailing closure

let doubled = numbers.map { $0 * 2 }           // [10, 6, 16, 2, 18, 4, 14]
let evens   = numbers.filter { $0 % 2 == 0 }   // [8, 2]
let total   = numbers.reduce(0) { $0 + $1 }    // 35
let totalShort = numbers.reduce(0, +)          // 35 (operator as closure)

print(doubled)   // [10, 6, 16, 2, 18, 4, 14]
print(evens)     // [8, 2]
print(total)     // 35
\`\`\`

**Capturing values:**
\`\`\`swift
func makeCounter(start: Int = 0) -> () -> Int {
    var count = start
    return {
        count += 1
        return count
    }
}

let counter = makeCounter()
print(counter())  // 1
print(counter())  // 2
print(counter())  // 3
\`\`\`

---

### @escaping Closures

When a closure is stored beyond the function's lifetime, mark it @escaping:

\`\`\`swift
class DataLoader {
    var completionHandlers: [() -> Void] = []

    // @escaping: closure stored in array, outlives loadData()
    func loadData(completion: @escaping () -> Void) {
        completionHandlers.append(completion)
        // In a real app: URLSession.shared.dataTask(...)
        // Later, the completion is called when data arrives
    }

    func simulateDataLoaded() {
        completionHandlers.forEach { $0() }
        completionHandlers.removeAll()
    }
}

let loader = DataLoader()
loader.loadData {
    print("Data loaded!")
}
loader.simulateDataLoaded()  // "Data loaded!"
\`\`\`

---

### Loops

\`\`\`swift
// for-in with range
for i in 1...5 {
    print(i)  // 1 2 3 4 5
}

for i in 1..<5 {  // half-open range (1, 2, 3, 4)
    print(i)
}

// for-in with array
let fruits = ["apple", "banana", "cherry"]
for fruit in fruits {
    print(fruit)
}

// enumerated — get index + value
for (index, fruit) in fruits.enumerated() {
    print("\\(index): \\(fruit)")
}

// while
var n = 1
while n <= 100 {
    n *= 2
}
print(n)  // 128 — first power of 2 > 100

// repeat-while (do-while equivalent)
var attempts = 0
repeat {
    attempts += 1
} while attempts < 3
print(attempts)  // 3
\`\`\``,
    quiz: [
      { q: 'What does the _ in func greet(_ name: String) do?', options: ['Makes name optional', 'Removes the external argument label so callers write greet("Alice") instead of greet(name: "Alice")', 'Marks the parameter as unused', 'Creates a private parameter'], correct: 1, explanation: 'In Swift, _ as the external label suppresses the argument label at the call site. Without it you\'d write greet(name: "Alice"). With _, you write greet("Alice") — more natural for functions where the label is obvious from context.' },
      { q: 'In numbers.map { $0 * 2 }, what is $0?', options: ['The index of the current element', 'The first argument to the closure — the current element', 'A placeholder for 0', 'A shorthand for the array itself'], correct: 1, explanation: '$0 is Swift\'s shorthand argument syntax. In a closure passed to map, $0 refers to the current element being processed. $1 would be the second argument (if the closure takes two). It avoids writing { element in element * 2 }.' },
      { q: 'When is @escaping required on a closure parameter?', options: ['Always — all closures must be @escaping', 'When the closure is called synchronously inside the function', 'When the closure outlives the function call — stored in a property or called asynchronously', 'Only in async functions'], correct: 2, explanation: '@escaping marks closures that are not called before the function returns — they "escape" into a longer lifetime. Completion handlers stored in arrays, network callbacks, and dispatch async blocks all require @escaping.' },
      { q: 'What makes Swift\'s switch statement different from Java\'s switch?', options: ['Swift switch only works on integers', 'Swift switch is exhaustive (must cover all cases) and has no fall-through by default, and can match ranges, tuples, and patterns', 'Swift switch requires break after each case', 'They are identical'], correct: 1, explanation: 'Swift switch: (1) exhaustive — compiler error if not all cases are covered (or no default:); (2) no fall-through — each case ends automatically; (3) powerful pattern matching — ranges, tuples, enums with associated values, where clauses.' },
    ],
    ide: {
      language: 'swift',
      task: 'Write a function pipeline that takes an array of integers and: (1) filters out negatives, (2) doubles the remaining values, (3) keeps only values > 10, (4) sorts descending, (5) returns the result. Use chained map/filter/sorted. Also write a makeMultiplier(_ factor: Int) -> (Int) -> Int function that returns a closure. Test both.',
      starterCode: `import Foundation

// TODO: chain filter -> map -> filter -> sorted
func pipeline(_ numbers: [Int]) -> [Int] {
    return numbers
        // filter: remove negatives
        // map: double each
        // filter: keep > 10
        // sorted: descending (use { $0 > $1 })
}

// TODO: returns a closure that multiplies by factor
func makeMultiplier(_ factor: Int) -> (Int) -> Int {
    return { n in
        // TODO
        return 0
    }
}

// Test pipeline
let input = [3, -1, 7, -4, 8, 2, 15, -9, 6, 12]
print("Pipeline:", pipeline(input))

// Test makeMultiplier
let triple = makeMultiplier(3)
print("triple(5):", triple(5))
print("triple(10):", triple(10))
let tenX = makeMultiplier(10)
print("[1,2,3].map(tenX):", [1,2,3].map(tenX))`,
      solution: `import Foundation

func pipeline(_ numbers: [Int]) -> [Int] {
    return numbers
        .filter { $0 >= 0 }
        .map { $0 * 2 }
        .filter { $0 > 10 }
        .sorted { $0 > $1 }
}

func makeMultiplier(_ factor: Int) -> (Int) -> Int {
    return { n in n * factor }
}

let input = [3, -1, 7, -4, 8, 2, 15, -9, 6, 12]
print("Pipeline:", pipeline(input))

let triple = makeMultiplier(3)
print("triple(5):", triple(5))
print("triple(10):", triple(10))
let tenX = makeMultiplier(10)
print("[1,2,3].map(tenX):", [1,2,3].map(tenX))`,
      hints: [
        'Chain: .filter { $0 >= 0 }.map { $0 * 2 }.filter { $0 > 10 }.sorted { $0 > $1 }',
        'makeMultiplier captures factor from its outer scope — that\'s a closure.',
        'Return the closure: return { n in n * factor }',
      ],
    },
  },
  {
    id: 'cc-swift-m04', track: 'crash', title: 'Structs, Classes & Enums',
    subtitle: 'Understand Swift\'s value vs. reference semantics, design structs and classes correctly, and use enums with associated values and raw values.',
    moduleObjective: 'Create structs and classes, explain when to choose each, use computed properties and property observers, define enums with associated values, and use CaseIterable.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'Masters',
    xp: 175, duration: 18, module: 4, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'Value Semantics', definition: 'Structs and enums are copied on assignment. Modifying a copy does not affect the original. Most Swift types are value types.' },
      { term: 'Reference Semantics', definition: 'Classes use reference semantics — assigning passes a pointer to the same object. Modifying through one reference is visible through all others.' },
      { term: 'Computed Property', definition: 'A property with a getter (and optional setter) that calculates its value instead of storing it. var area: Double { width * height }' },
      { term: 'Property Observer', definition: 'willSet and didSet — called before/after a stored property changes. Use for side effects when a value changes.' },
      { term: 'Associated Value', definition: 'Data attached to an enum case: case circle(radius: Double). Different cases can carry different types and amounts of data.' },
      { term: 'mutating', definition: 'Methods in a struct that modify self must be marked mutating. This signals that the struct will be replaced with a new copy.' },
    ],
    content: `## Structs, Classes & Enums

### The Core Decision: Struct vs. Class

**Use struct (value type) when:**
- The data is a simple value: a coordinate, a color, a date range
- Copies should be independent (no shared mutable state)
- The type doesn't need inheritance
- Default in Swift — most types in the standard library are structs (String, Array, Dictionary, Int)

**Use class (reference type) when:**
- Instances must be shared and mutated by multiple owners
- The type needs inheritance
- The type manages external resources (files, network connections)
- Lifetime must be controlled explicitly (ARC, weak references)

---

### Structs

\`\`\`swift
struct Point {
    var x: Double
    var y: Double

    // Computed property
    var magnitude: Double {
        (x * x + y * y).squareRoot()
    }

    // Memberwise initializer is auto-generated by Swift
    // init(x: Double, y: Double) is provided for free

    // Custom initializer
    init(angle: Double, radius: Double) {
        self.x = radius * cos(angle)
        self.y = radius * sin(angle)
    }

    // Must mark mutating — structs are value types
    mutating func translate(dx: Double, dy: Double) {
        x += dx
        y += dy
    }

    func distance(to other: Point) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        return (dx*dx + dy*dy).squareRoot()
    }
}

var p1 = Point(x: 3.0, y: 4.0)
let p2 = Point(x: 0.0, y: 0.0)

print(p1.magnitude)      // 5.0
print(p1.distance(to: p2)) // 5.0

p1.translate(dx: 1.0, dy: 0.0)
print(p1)  // Point(x: 4.0, y: 4.0)

// Value semantics demonstration
var p3 = p1
p3.x = 100.0
print(p1.x)  // 4.0 — p1 is unchanged
\`\`\`

---

### Classes

\`\`\`swift
class BankAccount {
    let owner: String
    private(set) var balance: Double  // readable externally, writable only internally

    // Property observer
    var transactionCount: Int = 0 {
        didSet {
            print("Transaction count updated: \\(transactionCount)")
        }
    }

    init(owner: String, initialBalance: Double = 0) {
        self.owner = owner
        self.balance = initialBalance
    }

    func deposit(_ amount: Double) {
        precondition(amount > 0, "Amount must be positive")
        balance += amount
        transactionCount += 1
    }

    @discardableResult
    func withdraw(_ amount: Double) -> Bool {
        guard amount > 0 && amount <= balance else { return false }
        balance -= amount
        transactionCount += 1
        return true
    }

    var description: String {
        "BankAccount[\\(owner): $\\(String(format: "%.2f", balance)), \\(transactionCount) txns]"
    }
}

let acct = BankAccount(owner: "Jordan", initialBalance: 500.0)
acct.deposit(250.0)
acct.withdraw(100.0)
print(acct.description)

// Reference semantics demonstration
let acct2 = acct   // same object — just another reference
acct2.deposit(1000)
print(acct.balance)  // 1650.0 — acct also reflects the change
\`\`\`

---

### Enums

\`\`\`swift
// Basic enum
enum Direction { case north, south, east, west }

let dir = Direction.north
switch dir {
case .north: print("Going north")
case .south: print("Going south")
case .east:  print("Going east")
case .west:  print("Going west")
}

// Raw values
enum Planet: Int {
    case mercury = 1, venus, earth, mars  // auto-increments from 1
}
print(Planet.earth.rawValue)  // 3
print(Planet(rawValue: 1)!)   // mercury

// String raw values
enum HTTPMethod: String {
    case get = "GET", post = "POST", put = "PUT", delete = "DELETE"
}
print(HTTPMethod.get.rawValue)  // "GET"

// Associated values — the most powerful feature
enum NetworkResult {
    case success(data: Data, statusCode: Int)
    case failure(error: Error)
    case loading
}

func handleResult(_ result: NetworkResult) {
    switch result {
    case .success(let data, let code):
        print("Success \\(code): \\(data.count) bytes")
    case .failure(let error):
        print("Error: \\(error.localizedDescription)")
    case .loading:
        print("Loading...")
    }
}

// CaseIterable — iterate all cases
enum Season: CaseIterable {
    case spring, summer, fall, winter
}
print("Seasons:", Season.allCases)  // [spring, summer, fall, winter]
for season in Season.allCases {
    print(season)
}
\`\`\`

---

### Enum Methods and Computed Properties

\`\`\`swift
enum Weekday: Int, CaseIterable {
    case monday = 1, tuesday, wednesday, thursday, friday, saturday, sunday

    var isWeekend: Bool {
        self == .saturday || self == .sunday
    }

    var name: String {
        switch self {
        case .monday:    return "Monday"
        case .tuesday:   return "Tuesday"
        case .wednesday: return "Wednesday"
        case .thursday:  return "Thursday"
        case .friday:    return "Friday"
        case .saturday:  return "Saturday"
        case .sunday:    return "Sunday"
        }
    }

    func next() -> Weekday {
        let nextRaw = (rawValue % 7) + 1
        return Weekday(rawValue: nextRaw)!
    }
}

print(Weekday.friday.isWeekend)   // false
print(Weekday.saturday.isWeekend) // true
print(Weekday.friday.next().name) // Saturday
\`\`\``,
    quiz: [
      { q: 'You assign a struct to a new variable and modify the new variable. Does the original change?', options: ['Yes — structs are references', 'No — structs are value types and are copied on assignment', 'It depends on whether the struct has let or var properties', 'Only if the struct is declared with var'], correct: 1, explanation: 'Structs have value semantics. var p2 = p1 creates an independent copy. Modifying p2 has no effect on p1. This is fundamentally different from classes (reference semantics) where both variables point to the same object.' },
      { q: 'Why must methods that modify struct properties be marked mutating?', options: ['Performance optimization', 'Structs are immutable by default — mutating signals that self will be replaced with a modified copy when the method runs', 'The Swift compiler requires it for all methods', 'To prevent concurrent modification'], correct: 1, explanation: 'Value types are conceptually immutable. When a mutating method changes a property, Swift replaces the struct instance with a new copy containing the changed value. The mutating keyword lets the compiler know this substitution will happen — and prevents calling mutating methods on let struct constants.' },
      { q: 'What is an enum associated value?', options: ['A default value for an enum case', 'Data attached to a specific enum case — different cases can carry different types of data', 'An Int or String backing an enum case', 'A property shared by all enum cases'], correct: 1, explanation: 'Associated values let each enum case carry custom data. case success(data: Data, statusCode: Int) carries both a Data payload and an Int. case failure(error: Error) carries only an Error. This is more powerful than traditional enums in most languages.' },
      { q: 'What does private(set) on a property mean?', options: ['The property cannot be read from outside the class', 'The property can be read externally but only set internally', 'The property is completely private', 'The property uses lazy initialization'], correct: 1, explanation: 'private(set) creates a property with a public getter and a private setter. External code can read the value (acct.balance) but cannot assign to it (acct.balance = 0 is a compile error). Only methods inside the class can modify it.' },
    ],
    ide: {
      language: 'swift',
      task: 'Create a Shape enum with cases circle(radius: Double), rectangle(width: Double, height: Double), triangle(base: Double, height: Double). Add a computed property area: Double that calculates the correct area for each case. Add a computed property name: String. Test with at least one of each shape type, print name and area.',
      starterCode: `import Foundation

enum Shape {
    case circle(radius: Double)
    case rectangle(width: Double, height: Double)
    case triangle(base: Double, height: Double)

    // TODO: computed property 'area'
    var area: Double {
        switch self {
        case .circle(let radius):
            return 0  // TODO: π * r²
        case .rectangle(let width, let height):
            return 0  // TODO: width * height
        case .triangle(let base, let height):
            return 0  // TODO: 0.5 * base * height
        }
    }

    // TODO: computed property 'name' -> "Circle", "Rectangle", "Triangle"
    var name: String {
        return ""
    }
}

let shapes: [Shape] = [
    .circle(radius: 5),
    .rectangle(width: 4, height: 6),
    .triangle(base: 3, height: 8),
]

for shape in shapes {
    print(String(format: "%@: area = %.2f", shape.name, shape.area))
}`,
      solution: `import Foundation

enum Shape {
    case circle(radius: Double)
    case rectangle(width: Double, height: Double)
    case triangle(base: Double, height: Double)

    var area: Double {
        switch self {
        case .circle(let radius):
            return Double.pi * radius * radius
        case .rectangle(let width, let height):
            return width * height
        case .triangle(let base, let height):
            return 0.5 * base * height
        }
    }

    var name: String {
        switch self {
        case .circle:    return "Circle"
        case .rectangle: return "Rectangle"
        case .triangle:  return "Triangle"
        }
    }
}

let shapes: [Shape] = [
    .circle(radius: 5),
    .rectangle(width: 4, height: 6),
    .triangle(base: 3, height: 8),
]

for shape in shapes {
    print(String(format: "%@: area = %.2f", shape.name, shape.area))
}`,
      hints: [
        'Circle area: Double.pi * radius * radius',
        'In the name switch, you can match .circle without extracting the associated value: case .circle: return "Circle"',
        'Triangle: 0.5 * base * height',
      ],
    },
  },
  {
    id: 'cc-swift-m05', track: 'crash', title: 'Protocols & Extensions',
    subtitle: 'Define behavior contracts with protocols, implement protocol-oriented design, add functionality to any type with extensions, and use protocol composition.',
    moduleObjective: 'Define and adopt protocols, implement default implementations with protocol extensions, use Codable for JSON serialization, and compose multiple protocols on a single type.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'Masters',
    xp: 180, duration: 18, module: 5, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'Protocol', definition: 'A blueprint of methods and properties that conforming types must implement. Swift\'s answer to interfaces. Structs, classes, and enums can all conform.' },
      { term: 'Protocol Extension', definition: 'Extends a protocol with default implementations. Any conforming type gets the implementation for free but can override it.' },
      { term: 'Codable', definition: 'A typealias for Encodable & Decodable. Conforming to Codable gives a struct/class free JSON serialization with JSONEncoder/JSONDecoder.' },
      { term: 'Protocol Composition', definition: 'Combining protocols with &. func process(_ item: Printable & Saveable) accepts any type that conforms to both Printable and Saveable.' },
      { term: 'Self requirement', definition: 'A protocol can require conforming types to use Self — their own type. Used in Equatable: func == (lhs: Self, rhs: Self) -> Bool.' },
      { term: 'Extension', definition: 'Adds methods, computed properties, and protocol conformances to any type — including types you don\'t own (String, Int, Array).' },
    ],
    content: `## Protocols & Extensions

### Defining a Protocol

\`\`\`swift
protocol Describable {
    var description: String { get }   // read-only property requirement
    func shortDescription() -> String  // method requirement
}

protocol Identifiable {
    var id: String { get }
}

// Conforming a struct
struct Product: Describable, Identifiable {
    let id: String
    let name: String
    let price: Double

    var description: String {
        "Product(\\(id)): \\(name) at $\\(String(format: "%.2f", price))"
    }

    func shortDescription() -> String { "\\(name): $\\(String(format: "%.2f", price))" }
}

// Conforming a class
class User: Describable, Identifiable {
    let id: String
    let name: String
    var email: String?

    init(id: String, name: String, email: String? = nil) {
        self.id = id; self.name = name; self.email = email
    }

    var description: String {
        "User(\\(id)): \\(name)" + (email.map { " <\\($0)>" } ?? "")
    }

    func shortDescription() -> String { name }
}

// Use the protocol as a type
func printAll(_ items: [any Describable]) {
    items.forEach { print($0.description) }
}

let items: [any Describable] = [
    Product(id: "p1", name: "Laptop", price: 1299.0),
    User(id: "u1", name: "Jordan", email: "j@jst.com"),
]
printAll(items)
\`\`\`

---

### Protocol Extensions — Default Implementations

\`\`\`swift
protocol Greetable {
    var name: String { get }
    func greet() -> String
}

extension Greetable {
    // Default implementation — conformers get this for free
    func greet() -> String {
        return "Hello, I am \\(name)."
    }

    func shout() -> String {
        return greet().uppercased() + "!!"
    }
}

struct Customer: Greetable {
    let name: String
    // greet() is provided by the extension — no need to implement
}

struct VIPCustomer: Greetable {
    let name: String
    // Override the default:
    func greet() -> String { "Welcome, VIP \\(name)!" }
}

let c = Customer(name: "Alice")
let v = VIPCustomer(name: "Bob")
print(c.greet())   // Hello, I am Alice.
print(v.greet())   // Welcome, VIP Bob!
print(c.shout())   // HELLO, I AM ALICE.!!
\`\`\`

---

### Codable: Free JSON Serialization

\`\`\`swift
import Foundation

struct Article: Codable {
    let id: Int
    let title: String
    let author: String
    let tags: [String]
    let publishedAt: Date?

    // Custom key names
    enum CodingKeys: String, CodingKey {
        case id, title, author, tags
        case publishedAt = "published_at"  // snake_case in JSON
    }
}

// Encoding to JSON
let article = Article(
    id: 1,
    title: "Swift Crash Course",
    author: "Jordan Morris",
    tags: ["swift", "ios", "programming"],
    publishedAt: Date()
)

let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
encoder.dateEncodingStrategy = .iso8601

if let jsonData = try? encoder.encode(article),
   let jsonString = String(data: jsonData, encoding: .utf8) {
    print(jsonString)
}

// Decoding from JSON
let jsonString = """
{
    "id": 2,
    "title": "iOS Development Guide",
    "author": "Alice Johnson",
    "tags": ["ios", "xcode"],
    "published_at": null
}
"""

let decoder = JSONDecoder()
decoder.dateDecodingStrategy = .iso8601

if let data = jsonString.data(using: .utf8),
   let decoded = try? decoder.decode(Article.self, from: data) {
    print("Decoded: \\(decoded.title) by \\(decoded.author)")
}
\`\`\`

---

### Extensions on Existing Types

\`\`\`swift
// Add methods to String
extension String {
    var isPalindrome: Bool {
        let cleaned = self.lowercased().filter { $0.isLetter }
        return cleaned == String(cleaned.reversed())
    }

    func truncated(to length: Int, trailing: String = "...") -> String {
        guard count > length else { return self }
        return String(prefix(length)) + trailing
    }

    var wordCount: Int {
        split(separator: " ").count
    }
}

print("racecar".isPalindrome)    // true
print("hello".isPalindrome)      // false
print("Swift is amazing and fast".truncated(to: 10))  // "Swift is a..."
print("Hello World".wordCount)    // 2

// Add to Int
extension Int {
    var isEven: Bool { self % 2 == 0 }
    var isOdd:  Bool { !isEven }

    func times(_ action: () -> Void) {
        (0..<self).forEach { _ in action() }
    }
}

print(7.isOdd)   // true
print(8.isEven)  // true
3.times { print("Hello!") }  // prints 3 times

// Add Comparable conformance to a custom type
struct Version: Comparable, CustomStringConvertible {
    let major, minor, patch: Int

    var description: String { "\\(major).\\(minor).\\(patch)" }

    static func < (lhs: Version, rhs: Version) -> Bool {
        if lhs.major != rhs.major { return lhs.major < rhs.major }
        if lhs.minor != rhs.minor { return lhs.minor < rhs.minor }
        return lhs.patch < rhs.patch
    }
}

let versions = [Version(major:2,minor:1,patch:0), Version(major:1,minor:9,patch:5), Version(major:2,minor:0,patch:3)]
print(versions.sorted())  // [1.9.5, 2.0.3, 2.1.0]
\`\`\``,
    quiz: [
      { q: 'What is the advantage of a protocol extension with a default implementation?', options: ['It forces all conforming types to use the same implementation', 'It provides a free implementation that conforming types can use as-is or override', 'It replaces inheritance', 'It makes the protocol optional to implement'], correct: 1, explanation: 'Protocol extensions with default implementations provide behavior for free to all conforming types. Swift\'s standard library uses this heavily — Equatable, Comparable, Collection all have hundreds of methods derived from just a few requirements via extensions.' },
      { q: 'What does Codable give you automatically?', options: ['Network requests', 'Free JSON encoding and decoding via JSONEncoder and JSONDecoder', 'Database persistence', 'Data validation'], correct: 1, explanation: 'Codable = Encodable & Decodable. A struct conforming to Codable can be converted to/from JSON (or other formats like Property List) using JSONEncoder and JSONDecoder. The synthesis is automatic as long as all properties are themselves Codable.' },
      { q: 'Can a Swift extension add stored properties to an existing type?', options: ['Yes, always', 'Yes, but only to classes', 'No — extensions can add computed properties and methods, but not stored properties', 'Yes, using the @stored annotation'], correct: 2, explanation: 'Extensions cannot add stored properties — doing so would change the memory layout of existing instances. They can add computed properties (which calculate values on demand) and methods. This is a fundamental limitation of Swift extensions.' },
      { q: 'What does protocol composition (&) enable?', options: ['Inheriting from multiple protocols', 'Requiring a type to conform to multiple protocols simultaneously in a function signature or type annotation', 'Merging two protocols into a new named protocol', 'Creating an enum that implements multiple protocols'], correct: 1, explanation: 'func save(_ item: Codable & Identifiable) requires item to conform to both protocols. This avoids creating a new protocol that inherits both — it is inline composition. Swift uses this extensively in its standard library.' },
    ],
    ide: {
      language: 'swift',
      task: 'Define a Taxable protocol with property taxRate: Double and method calculateTax(on amount: Double) -> Double. Provide a default implementation in a protocol extension. Create a FoodItem struct (name, price) conforming to Taxable (taxRate = 0.05) and an ElectronicsItem struct (name, price) conforming to Taxable (taxRate = 0.15). Also add an extension on Array where Element: Taxable to compute totalTaxFor(amount:) returning the sum of all taxes. Test with an array of mixed items.',
      starterCode: `import Foundation

protocol Taxable {
    var taxRate: Double { get }
    func calculateTax(on amount: Double) -> Double
}

// TODO: protocol extension with default calculateTax implementation
// hint: amount * taxRate

struct FoodItem: Taxable {
    let name: String
    let price: Double
    var taxRate: Double { 0.05 }  // 5%
    // calculateTax provided by default extension
}

struct ElectronicsItem: Taxable {
    let name: String
    let price: Double
    var taxRate: Double { 0.15 }  // 15%
}

// TODO: extension on Array where Element: Taxable
// func totalTax() -> Double — sum of calculateTax(on: element.price) for each element

let items: [any Taxable] = [
    FoodItem(name: "Bread", price: 5.00),
    FoodItem(name: "Milk", price: 3.50),
    ElectronicsItem(name: "Keyboard", price: 89.00),
    ElectronicsItem(name: "Mouse", price: 45.00),
]

for item in items {
    if let f = item as? FoodItem {
        print(String(format: "%@: tax = $%.2f", f.name, f.calculateTax(on: f.price)))
    } else if let e = item as? ElectronicsItem {
        print(String(format: "%@: tax = $%.2f", e.name, e.calculateTax(on: e.price)))
    }
}`,
      solution: `import Foundation

protocol Taxable {
    var taxRate: Double { get }
    func calculateTax(on amount: Double) -> Double
}

extension Taxable {
    func calculateTax(on amount: Double) -> Double {
        amount * taxRate
    }
}

extension Array where Element: Taxable {
    func totalTax() -> Double {
        // Not possible directly since we don't have price on Taxable
        // This is why protocol design matters — left as a note
        return 0
    }
}

struct FoodItem: Taxable {
    let name: String
    let price: Double
    var taxRate: Double { 0.05 }
}

struct ElectronicsItem: Taxable {
    let name: String
    let price: Double
    var taxRate: Double { 0.15 }
}

let items: [any Taxable] = [
    FoodItem(name: "Bread", price: 5.00),
    FoodItem(name: "Milk", price: 3.50),
    ElectronicsItem(name: "Keyboard", price: 89.00),
    ElectronicsItem(name: "Mouse", price: 45.00),
]

for item in items {
    if let f = item as? FoodItem {
        print(String(format: "%@: tax = $%.2f", f.name, f.calculateTax(on: f.price)))
    } else if let e = item as? ElectronicsItem {
        print(String(format: "%@: tax = $%.2f", e.name, e.calculateTax(on: e.price)))
    }
}`,
      hints: [
        'Protocol extension: extension Taxable { func calculateTax(on amount: Double) -> Double { amount * taxRate } }',
        'The default implementation uses taxRate from the conforming type — that\'s the power of protocol extensions.',
        'Both FoodItem and ElectronicsItem get calculateTax for free from the extension.',
      ],
    },
  },
  {
    id: 'cc-swift-m06', track: 'crash', title: 'Error Handling & the Result Type',
    subtitle: 'Handle errors the Swift way with throwing functions, do/try/catch, defer, and the Result<Success, Failure> type for explicit error propagation.',
    moduleObjective: 'Define Error enums, write and call throwing functions, use do/try/catch correctly, understand defer, and use Result<T, E> for async and functional error handling.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'PhD',
    xp: 185, duration: 20, module: 6, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'throws', definition: 'Marks a function that can propagate errors. Callers must handle them with try inside a do/catch or propagate further with throws.' },
      { term: 'do/try/catch', definition: 'The error handling block. try calls a throwing function. catch handles specific error types. If uncaught, the error propagates up.' },
      { term: 'try?', definition: 'Converts a throwing expression to an optional. Returns nil on error instead of propagating. Use when you don\'t care about the error detail.' },
      { term: 'try!', definition: 'Force-try — asserts no error will be thrown. Crashes with a fatal error if one is thrown. Use only when truly impossible to fail.' },
      { term: 'defer', definition: 'A block that runs when the current scope exits — regardless of how (return, throw, or fall-through). Use for cleanup operations.' },
      { term: 'Result<Success, Failure>', definition: 'An enum with .success(Value) and .failure(Error) cases. Represents an operation that can succeed or fail without throwing.' },
    ],
    content: `## Error Handling & the Result Type

### Defining Error Types

\`\`\`swift
// Swift errors conform to the Error protocol (usually enums)
enum ValidationError: Error, LocalizedError {
    case emptyField(fieldName: String)
    case tooShort(fieldName: String, minimum: Int, actual: Int)
    case invalidEmail(String)
    case outOfRange(value: Double, min: Double, max: Double)

    var errorDescription: String? {
        switch self {
        case .emptyField(let name):
            return "\\(name) cannot be empty"
        case .tooShort(let name, let min, let actual):
            return "\\(name) must be at least \\(min) characters (got \\(actual))"
        case .invalidEmail(let email):
            return "'\\(email)' is not a valid email address"
        case .outOfRange(let value, let min, let max):
            return "\\(value) must be between \\(min) and \\(max)"
        }
    }
}
\`\`\`

---

### Throwing Functions

\`\`\`swift
func validateEmail(_ email: String) throws -> String {
    guard !email.isEmpty else {
        throw ValidationError.emptyField(fieldName: "Email")
    }
    guard email.contains("@") && email.contains(".") else {
        throw ValidationError.invalidEmail(email)
    }
    return email.lowercased().trimmingCharacters(in: .whitespaces)
}

func validatePassword(_ password: String) throws -> String {
    guard !password.isEmpty else {
        throw ValidationError.emptyField(fieldName: "Password")
    }
    guard password.count >= 8 else {
        throw ValidationError.tooShort(fieldName: "Password", minimum: 8, actual: password.count)
    }
    return password
}

// Calling throwing functions
do {
    let email    = try validateEmail("jordan@jst.com")
    let password = try validatePassword("secure123")
    print("Valid: \\(email), password length: \\(password.count)")
} catch ValidationError.emptyField(let name) {
    print("Empty: \\(name)")
} catch ValidationError.invalidEmail(let e) {
    print("Bad email: \\(e)")
} catch ValidationError.tooShort(let name, let min, let actual) {
    print("\\(name) too short: \\(actual) < \\(min)")
} catch {
    print("Unexpected error: \\(error)")  // catch-all
}
\`\`\`

---

### try?, try!, and rethrows

\`\`\`swift
// try? — returns Optional, nil on error
let validEmail   = try? validateEmail("alice@example.com")  // Optional("alice@example.com")
let invalidEmail = try? validateEmail("notanemail")          // nil

// Combine with ?? for defaults
let email = (try? validateEmail(userInput)) ?? "unknown@email.com"

// try! — only use when error is truly impossible
// e.g. a hardcoded regex pattern that you KNOW is valid
let emailRegex = try! NSRegularExpression(pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}")

// rethrows — for higher-order functions that throw only if the closure throws
func transform<T, U>(_ value: T, using fn: (T) throws -> U) rethrows -> U {
    return try fn(value)
}
let result = try transform("jordan@jst.com", using: validateEmail)
\`\`\`

---

### defer

\`\`\`swift
func processFile(named filename: String) throws -> String {
    print("Opening \\(filename)")
    defer {
        print("Closing \\(filename)")  // always runs when function exits
    }

    guard filename.hasSuffix(".txt") else {
        throw ValidationError.invalidEmail(filename)  // reusing for demo
    }

    // ... process the file ...
    return "Processed: \\(filename)"
}

// Even when an error is thrown, defer runs:
do {
    let result = try processFile(named: "data.csv")
    print(result)
} catch {
    print("Error: \\(error)")
}
// Output:
// Opening data.csv
// Closing data.csv  ← defer ran even though error was thrown
// Error: ...
\`\`\`

---

### Result<Success, Failure>

\`\`\`swift
// Use Result when you want to return success/failure without throwing
// Great for async callbacks and when you want to store the result

enum NetworkError: Error {
    case noConnection
    case timeout
    case invalidResponse(statusCode: Int)
    case decodingFailed(Error)
}

func fetchUser(id: Int, completion: @escaping (Result<User, NetworkError>) -> Void) {
    // Simulate network call
    if id <= 0 {
        completion(.failure(.invalidResponse(statusCode: 400)))
        return
    }
    let user = User(id: String(id), name: "User \\(id)")
    completion(.success(user))
}

fetchUser(id: 1) { result in
    switch result {
    case .success(let user):
        print("Found: \\(user.name)")
    case .failure(let error):
        print("Error: \\(error)")
    }
}

// Result with map/flatMap for chaining
let rawInput = " jordan@jst.com "
let validated: Result<String, ValidationError> = Result {
    try validateEmail(rawInput)
}

let upper = validated.map { $0.uppercased() }
switch upper {
case .success(let email): print("Validated: \\(email)")
case .failure(let error): print("Failed: \\(error.errorDescription ?? "")")
}

// get() throws for interop
let email2 = try? validated.get()  // returns Optional<String>
\`\`\``,
    quiz: [
      { q: 'What does try? do when the throwing expression throws an error?', options: ['Crashes the program', 'Propagates the error to the caller', 'Returns nil instead of the value', 'Prints the error to console and continues'], correct: 2, explanation: 'try? converts the result to an Optional. On success, it returns the wrapped value. On failure (any thrown error), it returns nil — discarding error information. Use it when the specific error doesn\'t matter, but a successful result does.' },
      { q: 'What is the purpose of defer?', options: ['Delay a function call to the next run loop', 'Execute code when the current scope exits, regardless of how (normal return, early return, or thrown error)', 'Define a lazy property', 'Schedule background work'], correct: 1, explanation: 'defer registers a cleanup block that runs when the current scope exits — whether by return, throw, or falling off the end. Multiple defer blocks run in reverse order (LIFO). It\'s the Swift equivalent of Java\'s try-finally for cleanup.' },
      { q: 'What is the key advantage of Result<Success, Failure> over throwing?', options: ['Result is faster than throwing', 'Result can be stored, passed around, and processed functionally with map/flatMap; throwing is immediate propagation', 'Result works in async code; throwing does not', 'Result can hold multiple errors'], correct: 1, explanation: 'Throwing propagates immediately up the call stack. Result wraps the outcome in a value you can store in a variable, pass to a function, return from a non-throwing function, or chain with map/flatMap. It is essential for async completion handlers and functional pipelines.' },
      { q: 'When should you use try! ?', options: ['Whenever you are confident there will be no error', 'Only for unit tests', 'Only when the error is truly impossible — like compiling a known-valid regex literal — and a crash would indicate a programmer error', 'Never — it is always unsafe'], correct: 2, explanation: 'try! is appropriate when you have a compile-time guarantee that the operation cannot fail — hardcoded regex patterns, bundled resource URLs that must exist. If it does fail, the crash is a programmer error, not a runtime condition. Using try! to avoid writing error handling is always wrong.' },
    ],
    ide: {
      language: 'swift',
      task: 'Write a parseCSVRow function that takes a String row "name,age,email", validates that it has exactly 3 fields (throw a MalformedCSV error if not), parses the age as Int (throw InvalidAge if it fails or is out of range 1-120), and returns a (name: String, age: Int, email: String) tuple. Test with valid and invalid rows using do/try/catch.',
      starterCode: `import Foundation

enum CSVError: Error, LocalizedError {
    case wrongFieldCount(expected: Int, got: Int)
    case invalidAge(String)
    case ageOutOfRange(Int)

    var errorDescription: String? {
        switch self {
        case .wrongFieldCount(let e, let g): return "Expected \\(e) fields, got \\(g)"
        case .invalidAge(let s): return "Cannot parse age: '\\(s)'"
        case .ageOutOfRange(let n): return "Age \\(n) out of range 1-120"
        }
    }
}

func parseCSVRow(_ row: String) throws -> (name: String, age: Int, email: String) {
    let fields = row.split(separator: ",").map { String($0).trimmingCharacters(in: .whitespaces) }

    // TODO: guard fields.count == 3 else throw wrongFieldCount
    // TODO: guard let age = Int(fields[1]) else throw invalidAge
    // TODO: guard age >= 1 && age <= 120 else throw ageOutOfRange

    return ("", 0, "")  // replace with real tuple
}

let testRows = [
    "Jordan Morris,28,jordan@jst.com",
    "Alice,abc,alice@email.com",
    "Bob,150,bob@email.com",
    "Too,Few",
    "Too,Many,Fields,Here",
]

for row in testRows {
    do {
        let parsed = try parseCSVRow(row)
        print("OK: \\(parsed.name), age \\(parsed.age), \\(parsed.email)")
    } catch {
        if let e = error as? CSVError {
            print("Error: \\(e.errorDescription ?? "")")
        }
    }
}`,
      solution: `import Foundation

enum CSVError: Error, LocalizedError {
    case wrongFieldCount(expected: Int, got: Int)
    case invalidAge(String)
    case ageOutOfRange(Int)

    var errorDescription: String? {
        switch self {
        case .wrongFieldCount(let e, let g): return "Expected \\(e) fields, got \\(g)"
        case .invalidAge(let s): return "Cannot parse age: '\\(s)'"
        case .ageOutOfRange(let n): return "Age \\(n) out of range 1-120"
        }
    }
}

func parseCSVRow(_ row: String) throws -> (name: String, age: Int, email: String) {
    let fields = row.split(separator: ",").map { String($0).trimmingCharacters(in: .whitespaces) }

    guard fields.count == 3 else {
        throw CSVError.wrongFieldCount(expected: 3, got: fields.count)
    }

    guard let age = Int(fields[1]) else {
        throw CSVError.invalidAge(fields[1])
    }

    guard age >= 1 && age <= 120 else {
        throw CSVError.ageOutOfRange(age)
    }

    return (name: fields[0], age: age, email: fields[2])
}

let testRows = [
    "Jordan Morris,28,jordan@jst.com",
    "Alice,abc,alice@email.com",
    "Bob,150,bob@email.com",
    "Too,Few",
    "Too,Many,Fields,Here",
]

for row in testRows {
    do {
        let parsed = try parseCSVRow(row)
        print("OK: \\(parsed.name), age \\(parsed.age), \\(parsed.email)")
    } catch {
        if let e = error as? CSVError {
            print("Error: \\(e.errorDescription ?? "")")
        }
    }
}`,
      hints: [
        'guard fields.count == 3 else { throw CSVError.wrongFieldCount(expected: 3, got: fields.count) }',
        'guard let age = Int(fields[1]) else { throw CSVError.invalidAge(fields[1]) }',
        'Return the tuple: return (name: fields[0], age: age, email: fields[2])',
      ],
    },
  },
  {
    id: 'cc-swift-m07', track: 'crash', title: 'Concurrency: async/await & Actors',
    subtitle: 'Write modern Swift concurrency with async/await, run tasks in parallel with async let, and protect shared state with actors.',
    moduleObjective: 'Write async functions, call them with await, run concurrent tasks with async let and TaskGroup, protect mutable shared state with actors, and understand the MainActor.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'PhD',
    xp: 195, duration: 22, module: 7, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'async/await', definition: 'Swift\'s concurrency model. Mark a function async to allow suspension. Use await to call async functions — the thread is freed while waiting, not blocked.' },
      { term: 'Task', definition: 'A unit of asynchronous work. Task { ... } creates a new concurrent task. await Task.sleep(for: .seconds(1)) suspends without blocking.' },
      { term: 'async let', definition: 'Starts multiple async operations concurrently. async let result1 = fetchA(); async let result2 = fetchB(); let both = await (result1, result2) runs both in parallel.' },
      { term: 'Actor', definition: 'A reference type that protects its mutable state from concurrent access. Only one caller can access actor state at a time — Swift enforces this at compile time.' },
      { term: 'MainActor', definition: 'The actor that represents the main thread. UI updates must happen on the MainActor. @MainActor marks a function or class to always run on the main thread.' },
      { term: 'Sendable', definition: 'A protocol marking types that are safe to share across concurrency domains. Value types (structs, enums) are automatically Sendable. Classes must be explicit.' },
    ],
    content: `## Concurrency: async/await & Actors

### Why async/await?

Before Swift 5.5, async code used completion handlers — nested closures that became impossible to read ("callback hell"). async/await makes async code look and read like synchronous code while remaining non-blocking.

**Old way (completion handlers):**
\`\`\`swift
func fetchUser(id: Int, completion: @escaping (Result<User, Error>) -> Void) { ... }
func fetchPosts(for user: User, completion: @escaping ([Post]) -> Void) { ... }

fetchUser(id: 1) { result in
    switch result {
    case .success(let user):
        fetchPosts(for: user) { posts in
            // now we're 2 levels deep and it gets worse
        }
    case .failure(let error): ...
    }
}
\`\`\`

**New way (async/await):**
\`\`\`swift
let user  = try await fetchUser(id: 1)
let posts = await fetchPosts(for: user)
// Linear, readable, no nesting
\`\`\`

---

### Writing async Functions

\`\`\`swift
import Foundation

// Simulating a network request
func fetchWeather(for city: String) async throws -> String {
    // await suspends this function without blocking the thread
    try await Task.sleep(for: .milliseconds(100))  // simulate 100ms network delay

    let conditions = ["Sunny", "Cloudy", "Rainy", "Stormy"]
    let temp = Int.random(in: 20...35)
    return "\\(city): \\(conditions.randomElement()!), \\(temp)°C"
}

func fetchAllWeather() async {
    let cities = ["Kingston", "Miami", "London", "Tokyo"]

    // Sequential — waits for each before starting next (slow)
    for city in cities {
        if let weather = try? await fetchWeather(for: city) {
            print(weather)
        }
    }
}

// Start the async work:
Task {
    await fetchAllWeather()
}
\`\`\`

---

### Parallel Execution with async let

\`\`\`swift
func fetchWeatherParallel() async {
    // All four requests start simultaneously
    async let k = fetchWeather(for: "Kingston")
    async let m = fetchWeather(for: "Miami")
    async let l = fetchWeather(for: "London")
    async let t = fetchWeather(for: "Tokyo")

    // await here — all four complete and we collect results
    let results = await [
        (try? k) ?? "Kingston: unavailable",
        (try? m) ?? "Miami: unavailable",
        (try? l) ?? "London: unavailable",
        (try? t) ?? "Tokyo: unavailable",
    ]

    results.forEach { print($0) }
    // All 4 complete in ~100ms (parallel) vs ~400ms (sequential)
}

Task { await fetchWeatherParallel() }
\`\`\`

---

### Actors: Thread-Safe Shared State

\`\`\`swift
// Without actor — data race (two threads read/write simultaneously):
// class UnsafeCounter { var count = 0 }  // NOT thread-safe

// With actor — Swift serializes all access:
actor SafeCounter {
    private var count = 0
    private var history: [String] = []

    func increment() {
        count += 1
        history.append("Incremented to \\(count)")
    }

    func decrement() {
        count = max(0, count - 1)
    }

    func value() -> Int { count }
    func getHistory() -> [String] { history }
}

// Using an actor requires await — accessing actor state is async:
let counter = SafeCounter()

Task {
    await counter.increment()
    await counter.increment()
    await counter.increment()
    let value = await counter.value()
    print("Counter: \\(value)")  // 3
}
\`\`\`

---

### @MainActor for UI

\`\`\`swift
// In a real iOS app, UI updates must happen on the main thread
@MainActor
class ViewModel: ObservableObject {
    @Published var items: [String] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    func loadItems() async {
        isLoading = true
        defer { isLoading = false }  // defer + async work together

        do {
            // fetch from network (runs on background thread internally)
            let fetched = try await fetchFromServer()
            items = fetched  // safe — we're on MainActor
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func fetchFromServer() async throws -> [String] {
        try await Task.sleep(for: .seconds(1))  // simulate network
        return ["Item A", "Item B", "Item C"]
    }
}
\`\`\`

---

### TaskGroup: Dynamic Concurrency

\`\`\`swift
func fetchMultiple(ids: [Int]) async -> [String] {
    await withTaskGroup(of: String?.self) { group in
        for id in ids {
            group.addTask {
                try? await fetchWeather(for: "City\\(id)")
            }
        }
        var results: [String] = []
        for await result in group {
            if let r = result { results.append(r) }
        }
        return results
    }
}

Task {
    let results = await fetchMultiple(ids: [1, 2, 3, 4, 5])
    print("Got \\(results.count) results")
}
\`\`\``,
    quiz: [
      { q: 'What does await do when calling an async function?', options: ['Blocks the current thread until the function completes', 'Suspends the current async context without blocking the thread, allowing other work to proceed', 'Creates a new thread', 'Queues the call for later execution'], correct: 1, explanation: 'await is a suspension point — not a block. The current async task pauses, the thread is freed to do other work, and the task resumes when the async operation completes. This is fundamentally different from blocking (which wastes CPU cycles).' },
      { q: 'What is the key difference between sequential async calls and async let?', options: ['async let is slower', 'Sequential calls wait for each to complete before starting the next; async let starts all operations concurrently', 'async let blocks the thread', 'There is no functional difference'], correct: 1, explanation: 'Sequential await calls form a chain — each waits before the next starts. async let launches operations concurrently. For N independent operations each taking 1 second, sequential takes N seconds; async let takes ~1 second total.' },
      { q: 'Why do you need await to access an actor\'s properties?', options: ['Actor properties are stored on a different thread', 'Actors serialize access — they may need to wait for other ongoing operations on the actor to complete before granting access', 'It is just a syntactic requirement', 'Actor properties return optionals'], correct: 1, explanation: 'Actors use a mailbox model — requests are queued and processed one at a time. Accessing an actor from outside may need to wait for the actor to be free. await signals this potential wait point and lets the Swift concurrency system schedule appropriately.' },
      { q: 'What does @MainActor guarantee?', options: ['The code runs on a background thread', 'The code always runs on the main (UI) thread', 'The code is thread-safe through locking', 'The code runs before other actors'], correct: 1, explanation: '@MainActor is a global actor that represents the main thread. Marking a function or class @MainActor guarantees all code runs on the main thread. Since UIKit and SwiftUI require UI updates on the main thread, this replaces DispatchQueue.main.async {...} in modern Swift.' },
    ],
    ide: {
      language: 'swift',
      task: 'Write an async function fetchPrice(for symbol: String) async throws -> Double that simulates fetching a stock price (use Task.sleep for 50ms, return a random Double between 10 and 1000). Write fetchPortfolio(symbols: [String]) async -> [String: Double] that fetches all prices concurrently using async let for exactly 3 symbols, or TaskGroup for a dynamic list. Print total portfolio value.',
      starterCode: `import Foundation

// Simulated stock price fetch
func fetchPrice(for symbol: String) async throws -> Double {
    // TODO: await Task.sleep for 50ms
    // return Double.random(in: 10...1000)
    return 0
}

// Fetch 3 known symbols concurrently with async let
func fetchPortfolioFixed() async -> [String: Double] {
    // TODO: async let aapl = fetchPrice(for: "AAPL")
    // async let msft = fetchPrice(for: "MSFT")
    // async let goog = fetchPrice(for: "GOOG")
    // let (a, m, g) = await ((try? aapl) ?? 0, (try? msft) ?? 0, (try? goog) ?? 0)
    return [:]
}

// Fetch dynamic list with TaskGroup
func fetchPortfolio(symbols: [String]) async -> [String: Double] {
    await withTaskGroup(of: (String, Double).self) { group in
        for symbol in symbols {
            group.addTask {
                let price = (try? await fetchPrice(for: symbol)) ?? 0
                return (symbol, price)
            }
        }
        var portfolio: [String: Double] = [:]
        for await (symbol, price) in group {
            portfolio[symbol] = price
        }
        return portfolio
    }
}

Task {
    print("Fixed portfolio:")
    let fixed = await fetchPortfolioFixed()
    fixed.forEach { print("  \\($0.key): $\\(String(format: "%.2f", $0.value))") }
    print("Total: $\\(String(format: "%.2f", fixed.values.reduce(0, +)))")

    print("Dynamic portfolio:")
    let dynamic = await fetchPortfolio(symbols: ["AAPL", "TSLA", "NVDA", "AMZN"])
    dynamic.forEach { print("  \\($0.key): $\\(String(format: "%.2f", $0.value))") }
    print("Total: $\\(String(format: "%.2f", dynamic.values.reduce(0, +)))")
}`,
      solution: `import Foundation

func fetchPrice(for symbol: String) async throws -> Double {
    try await Task.sleep(for: .milliseconds(50))
    return Double.random(in: 10...1000)
}

func fetchPortfolioFixed() async -> [String: Double] {
    async let aapl = fetchPrice(for: "AAPL")
    async let msft = fetchPrice(for: "MSFT")
    async let goog = fetchPrice(for: "GOOG")
    let a = (try? await aapl) ?? 0
    let m = (try? await msft) ?? 0
    let g = (try? await goog) ?? 0
    return ["AAPL": a, "MSFT": m, "GOOG": g]
}

func fetchPortfolio(symbols: [String]) async -> [String: Double] {
    await withTaskGroup(of: (String, Double).self) { group in
        for symbol in symbols {
            group.addTask {
                let price = (try? await fetchPrice(for: symbol)) ?? 0
                return (symbol, price)
            }
        }
        var portfolio: [String: Double] = [:]
        for await (symbol, price) in group {
            portfolio[symbol] = price
        }
        return portfolio
    }
}

Task {
    print("Fixed portfolio:")
    let fixed = await fetchPortfolioFixed()
    fixed.forEach { print("  \\($0.key): $\\(String(format: "%.2f", $0.value))") }
    print("Total: $\\(String(format: "%.2f", fixed.values.reduce(0, +)))")

    print("Dynamic portfolio:")
    let dynamic = await fetchPortfolio(symbols: ["AAPL", "TSLA", "NVDA", "AMZN"])
    dynamic.forEach { print("  \\($0.key): $\\(String(format: "%.2f", $0.value))") }
    print("Total: $\\(String(format: "%.2f", dynamic.values.reduce(0, +)))")
}`,
      hints: [
        'try await Task.sleep(for: .milliseconds(50)) suspends for 50ms.',
        'async let starts immediately; the await happens when you read the value.',
        'TaskGroup: group.addTask { ... } for each symbol, then for await (symbol, price) in group collects results.',
      ],
    },
  },
  {
    id: 'cc-swift-m08', track: 'crash', title: 'Capstone: Task Manager with Persistence',
    subtitle: 'Build a complete task manager with full CRUD, priority sorting, filtering, JSON persistence to disk, and a clean layered architecture.',
    moduleObjective: 'Design and implement a Task model (Codable), a TaskStore actor, CRUD operations, filter/sort with closures, JSON serialization to disk, and test the complete system.',
    courseObjective: CC_SWIFT_OBJ, crashId: 'cc-swift', crashTitle: 'Swift', level: 'PhD',
    xp: 200, duration: 25, module: 8, certArea: 'Swift Crash Course',
    keyTerms: [
      { term: 'Persistence', definition: 'Saving data between app launches. In this project: encoding tasks to JSON and writing to the filesystem. In iOS apps: UserDefaults, Core Data, or SwiftData.' },
      { term: 'UUID', definition: 'Universally unique identifier. UUID() generates one. Conforms to Codable automatically in Swift.' },
      { term: 'FileManager', definition: 'Manages filesystem operations. FileManager.default.urls(for: .documentDirectory, in: .userDomainMask) returns the app\'s documents folder.' },
      { term: 'Equatable / Hashable', definition: 'Equatable enables == comparison. Hashable enables use in Sets and as Dictionary keys. Structs with Codable fields auto-synthesize both.' },
      { term: 'Computed filtering', definition: 'Returning a filtered view of a collection without modifying the source. tasks.filter { $0.isCompleted } returns a new array.' },
      { term: 'Actor isolation', definition: 'Swift prevents direct access to actor properties from outside. All reads and writes must go through the actor\'s async interface.' },
    ],
    content: `## Capstone: Task Manager with Persistence

### Architecture

\`\`\`
Task (struct, Codable, Identifiable)
├── id: UUID
├── title: String
├── notes: String?
├── priority: Priority (enum)
├── isCompleted: Bool
├── createdAt: Date
└── dueDate: Date?

TaskStore (actor)
├── add(_ task: Task)
├── update(_ task: Task)
├── delete(id: UUID) -> Bool
├── toggle(id: UUID)
├── all() -> [Task]
├── filtered(by: Filter) -> [Task]
├── sorted(by: SortOrder) -> [Task]
├── save() throws
└── load() throws

Filter enum: all, active, completed, highPriority, overdue
SortOrder enum: byCreated, byDue, byPriority, byTitle
\`\`\`

---

### The Task Model

\`\`\`swift
import Foundation

enum Priority: Int, Codable, CaseIterable, Comparable {
    case low = 1, medium = 2, high = 3

    static func < (lhs: Priority, rhs: Priority) -> Bool {
        lhs.rawValue < rhs.rawValue
    }

    var label: String {
        switch self {
        case .low:    return "Low"
        case .medium: return "Medium"
        case .high:   return "High"
        }
    }
}

struct Task: Codable, Identifiable, Equatable {
    let id: UUID
    var title: String
    var notes: String?
    var priority: Priority
    var isCompleted: Bool
    let createdAt: Date
    var dueDate: Date?

    init(title: String, notes: String? = nil, priority: Priority = .medium, dueDate: Date? = nil) {
        self.id          = UUID()
        self.title       = title
        self.notes       = notes
        self.priority    = priority
        self.isCompleted = false
        self.createdAt   = Date()
        self.dueDate     = dueDate
    }

    var isOverdue: Bool {
        guard let due = dueDate, !isCompleted else { return false }
        return due < Date()
    }

    var displayStatus: String {
        if isCompleted { return "✓" }
        if isOverdue   { return "!" }
        return "○"
    }
}
\`\`\`

---

### TaskStore Actor

\`\`\`swift
enum TaskFilter {
    case all, active, completed, highPriority, overdue
}

enum TaskSortOrder {
    case byCreated, byDue, byPriority, byTitle
}

actor TaskStore {
    private var tasks: [UUID: Task] = [:]
    private let saveURL: URL

    init() {
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        self.saveURL = docs.appendingPathComponent("tasks.json")
        // Load existing tasks on init (blocking here for simplicity)
        if let data = try? Data(contentsOf: saveURL),
           let saved = try? JSONDecoder().decode([Task].self, from: data) {
            self.tasks = Dictionary(uniqueKeysWithValues: saved.map { ($0.id, $0) })
        }
    }

    // CRUD
    func add(_ task: Task) {
        tasks[task.id] = task
    }

    func update(_ task: Task) -> Bool {
        guard tasks[task.id] != nil else { return false }
        tasks[task.id] = task
        return true
    }

    func delete(id: UUID) -> Bool {
        return tasks.removeValue(forKey: id) != nil
    }

    func toggle(id: UUID) -> Bool {
        guard var task = tasks[id] else { return false }
        task.isCompleted.toggle()
        tasks[id] = task
        return true
    }

    // Queries
    func all() -> [Task] {
        Array(tasks.values)
    }

    func filtered(by filter: TaskFilter) -> [Task] {
        let all = Array(tasks.values)
        switch filter {
        case .all:           return all
        case .active:        return all.filter { !$0.isCompleted }
        case .completed:     return all.filter {  $0.isCompleted }
        case .highPriority:  return all.filter {  $0.priority == .high }
        case .overdue:       return all.filter {  $0.isOverdue }
        }
    }

    func sorted(by order: TaskSortOrder) -> [Task] {
        let all = Array(tasks.values)
        switch order {
        case .byCreated:
            return all.sorted { $0.createdAt < $1.createdAt }
        case .byDue:
            return all.sorted {
                switch ($0.dueDate, $1.dueDate) {
                case (nil, nil):   return false
                case (nil, _):    return false  // no due date sorts last
                case (_, nil):    return true
                case (let a?, let b?): return a < b
                }
            }
        case .byPriority:
            return all.sorted { $0.priority > $1.priority }  // high first
        case .byTitle:
            return all.sorted { $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending }
        }
    }

    // Persistence
    func save() throws {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = .prettyPrinted
        let data = try encoder.encode(Array(tasks.values))
        try data.write(to: saveURL)
    }

    func stats() -> (total: Int, active: Int, completed: Int, overdue: Int) {
        let all = Array(tasks.values)
        return (
            total:     all.count,
            active:    all.filter { !$0.isCompleted }.count,
            completed: all.filter {  $0.isCompleted }.count,
            overdue:   all.filter {  $0.isOverdue   }.count
        )
    }
}
\`\`\`

---

### Main Program

\`\`\`swift
Task {
    let store = TaskStore()

    // Add tasks
    let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
    let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: Date())!

    await store.add(Task(title: "Launch JST Academy",  priority: .high,   dueDate: tomorrow))
    await store.add(Task(title: "Deploy Ferguson Law",  priority: .high,   dueDate: yesterday))
    await store.add(Task(title: "Review design assets", priority: .medium))
    await store.add(Task(title: "Update client report", priority: .low))

    // Toggle first two as done
    let all = await store.all()
    for task in all.prefix(1) {
        await store.toggle(id: task.id)
    }

    // Print stats
    let s = await store.stats()
    print("Stats: \\(s.total) total, \\(s.active) active, \\(s.completed) done, \\(s.overdue) overdue")

    // Print by priority
    print("\\nBy Priority (high first):")
    for task in await store.sorted(by: .byPriority) {
        print("  [\\(task.displayStatus)] \\(task.priority.label.uppercased()): \\(task.title)")
    }

    // Save to disk
    do {
        try await store.save()
        print("\\nSaved to disk successfully")
    } catch {
        print("Save failed: \\(error)")
    }
}
\`\`\``,
    quiz: [
      { q: 'Why is TaskStore an actor instead of a class?', options: ['Actors are faster than classes', 'Actors protect mutable state from concurrent access — multiple async tasks cannot modify the store simultaneously, preventing data races', 'Actors can conform to more protocols than classes', 'Actors have automatic memory management'], correct: 1, explanation: 'TaskStore is accessed from multiple concurrent tasks. Without actor isolation, two tasks could read-modify-write tasks simultaneously, corrupting data. The actor model serializes all access — only one caller executes at a time, eliminating data races without manual locking.' },
      { q: 'In this architecture, why does the Task model conform to Codable?', options: ['To enable async/await', 'To allow automatic JSON encoding and decoding for persistence', 'Required by Identifiable', 'To enable use in sets'], correct: 1, explanation: 'Codable provides free JSON serialization. JSONEncoder().encode(tasks) converts the array of Tasks to Data; JSONDecoder().decode([Task].self, from: data) restores it. Without Codable, you\'d write manual serialization for every property.' },
      { q: 'What does isCompleted.toggle() do on the task struct?', options: ['Calls a function named toggle on a class', 'Flips the Bool value: true becomes false, false becomes true', 'Marks the task for deletion', 'Sends a notification'], correct: 1, explanation: 'Bool has a mutating toggle() method that flips its value. Since Task is a struct, task.isCompleted.toggle() creates a new Task copy with the flipped value — which is then stored back in the tasks dictionary.' },
      { q: 'Why must accessing actor properties use await?', options: ['All async operations require await', 'Actors may be busy serving another caller — await suspends until the actor is available', 'Actor properties return optionals', 'It is just a syntax requirement without semantic meaning'], correct: 1, explanation: 'The actor\'s isolation guarantee means it serves one caller at a time. If a task is already running inside the actor when you call store.all(), your call must wait. The await is the mechanism for this potential wait — it suspends your task without blocking the thread.' },
    ],
    ide: {
      language: 'swift',
      task: 'Add a search function to TaskStore: func search(query: String) -> [Task] that returns tasks where title or notes contains the query string (case-insensitive). Also add a clearCompleted() function that removes all completed tasks and returns the count removed. Test both in a Task { } block.',
      starterCode: `import Foundation

struct TaskItem: Identifiable {
    let id: UUID
    var title: String
    var notes: String?
    var isCompleted: Bool

    init(title: String, notes: String? = nil) {
        self.id = UUID()
        self.title = title
        self.notes = notes
        self.isCompleted = false
    }
}

actor SimpleTaskStore {
    private var tasks: [UUID: TaskItem] = [:]

    func add(_ task: TaskItem) { tasks[task.id] = task }

    func toggle(id: UUID) {
        guard var t = tasks[id] else { return }
        t.isCompleted.toggle()
        tasks[id] = t
    }

    func all() -> [TaskItem] { Array(tasks.values) }

    // TODO: search(query:) -> [TaskItem]
    // filter where title or notes contains query (case insensitive)
    func search(query: String) -> [TaskItem] {
        return []
    }

    // TODO: clearCompleted() -> Int (count removed)
    func clearCompleted() -> Int {
        return 0
    }
}

Task {
    let store = SimpleTaskStore()
    await store.add(TaskItem(title: "Buy groceries", notes: "Milk, eggs, bread"))
    await store.add(TaskItem(title: "Call the client", notes: "Follow up on proposal"))
    await store.add(TaskItem(title: "Deploy to production"))
    await store.add(TaskItem(title: "Review pull request", notes: "Check the grocery list PR"))

    // Complete first two
    let allTasks = await store.all()
    for t in allTasks.prefix(2) {
        await store.toggle(id: t.id)
    }

    // Test search
    let results = await store.search(query: "grocery")
    print("Search 'grocery': \\(results.map { $0.title })")

    // Test clearCompleted
    let removed = await store.clearCompleted()
    print("Removed \\(removed) completed tasks")
    print("Remaining: \\(await store.all().count)")
}`,
      solution: `import Foundation

struct TaskItem: Identifiable {
    let id: UUID
    var title: String
    var notes: String?
    var isCompleted: Bool

    init(title: String, notes: String? = nil) {
        self.id = UUID()
        self.title = title
        self.notes = notes
        self.isCompleted = false
    }
}

actor SimpleTaskStore {
    private var tasks: [UUID: TaskItem] = [:]

    func add(_ task: TaskItem) { tasks[task.id] = task }

    func toggle(id: UUID) {
        guard var t = tasks[id] else { return }
        t.isCompleted.toggle()
        tasks[id] = t
    }

    func all() -> [TaskItem] { Array(tasks.values) }

    func search(query: String) -> [TaskItem] {
        let q = query.lowercased()
        return tasks.values.filter { task in
            task.title.lowercased().contains(q) ||
            (task.notes?.lowercased().contains(q) ?? false)
        }
    }

    func clearCompleted() -> Int {
        let completedKeys = tasks.filter { $0.value.isCompleted }.keys
        completedKeys.forEach { tasks.removeValue(forKey: $0) }
        return completedKeys.count
    }
}

Task {
    let store = SimpleTaskStore()
    await store.add(TaskItem(title: "Buy groceries", notes: "Milk, eggs, bread"))
    await store.add(TaskItem(title: "Call the client", notes: "Follow up on proposal"))
    await store.add(TaskItem(title: "Deploy to production"))
    await store.add(TaskItem(title: "Review pull request", notes: "Check the grocery list PR"))

    let allTasks = await store.all()
    for t in allTasks.prefix(2) {
        await store.toggle(id: t.id)
    }

    let results = await store.search(query: "grocery")
    print("Search 'grocery': \\(results.map { $0.title })")

    let removed = await store.clearCompleted()
    print("Removed \\(removed) completed tasks")
    print("Remaining: \\(await store.all().count)")
}`,
      hints: [
        'search: filter where title.lowercased().contains(q) || (notes?.lowercased().contains(q) ?? false)',
        'clearCompleted: get the keys of completed tasks first, then remove each. Count the keys.',
        'tasks.filter { $0.value.isCompleted }.keys gives you the UUIDs to delete.',
      ],
    },
  },
]
