import type { Course } from '../courses'

export const sweCourses: Course[] = [
  {
    id: 'swe-m01',
    track: 'software-eng' as any,
    title: 'SOLID Principles',
    subtitle: 'The five design principles that separate maintainable code from technical debt',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Single Responsibility Principle', definition: 'A class or module should have one reason to change — it should encapsulate one domain responsibility, making changes localized and behavior predictable.' },
      { term: 'Open/Closed Principle', definition: 'Software entities should be open for extension but closed for modification; add behavior by adding new code (subclasses, decorators, plugins), not by changing existing code.' },
      { term: 'Liskov Substitution Principle', definition: 'Subtypes must be substitutable for their base types without altering program correctness; if a function works with a base class, it must work with any subclass without knowing the difference.' },
      { term: 'Interface Segregation Principle', definition: 'Clients should not be forced to depend on interfaces they do not use; prefer many narrow interfaces over one wide interface.' },
      { term: 'Dependency Inversion Principle', definition: 'High-level modules should not depend on low-level modules; both should depend on abstractions. Abstractions should not depend on details; details depend on abstractions.' },
    ],
    content: `## SOLID Principles

SOLID is five design principles formulated by Robert C. Martin that guide object-oriented design toward maintainability, extensibility, and testability. They are not rules to follow mechanically but lenses for diagnosing why code is hard to change.

### Single Responsibility Principle (SRP)

A class should have one reason to change. Reason to change = domain responsibility. A User class that handles authentication, profile management, email sending, and database persistence has four reasons to change. When the email service changes its API, you're editing the User class — but User isn't about email.

Violation symptoms: classes with >200 lines, methods that do setup + business logic + I/O, test files that require enormous mocks to isolate a single behavior.

SRP at the module level: a module responsible for one domain concept means changes in that domain touch one module, not many. This is the basis of domain-driven design.

### Open/Closed Principle (OCP)

Software should be open for extension but closed for modification. The original formulation (Bertrand Meyer) meant inheritance. The modern interpretation: you add new behavior by adding new code — a new class, a new function, a new decorator — not by editing existing, tested code.

A payment processor with a switch statement on payment type violates OCP: adding a new payment type requires editing the switch statement, risking regressions in existing payment types. A better design: a PaymentStrategy interface with implementations per type. Adding a new type adds a new class, not a modification.

OCP is enabled by good abstractions. Where you expect extension points, define interfaces. Where the logic is stable, keep it closed.

### Liskov Substitution Principle (LSP)

If S is a subtype of T, then objects of type T in a program may be replaced with objects of type S without altering program correctness (Barbara Liskov, 1987).

Classic violation: Square extends Rectangle. Rectangle has setWidth(w) and setHeight(h) that operate independently. Square overrides both to keep sides equal. Code that sets width and height independently then checks the area will fail for Square instances — a Square is not substitutable for a Rectangle in this context.

LSP violations often manifest as: subclass methods that throw NotImplementedException, type-checking with instanceof in code that should be polymorphic, or subclasses that weaken postconditions (return narrower output) or strengthen preconditions (require more of callers).

### Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use. Fat interfaces force implementors to provide stubs for irrelevant methods and force callers to depend on things they don't need.

A Worker interface with methods work(), eat(), and sleep() forces a Robot class to implement eat() and sleep() with empty stubs or exceptions. Split into Workable (work()), Feedable (eat()), Restable (sleep()). Robot implements only Workable.

ISP is especially relevant in TypeScript/Java interfaces used for dependency injection. A narrow interface is also easier to mock in tests.

### Dependency Inversion Principle (DIP)

High-level policy modules should not depend directly on low-level mechanism modules. Both should depend on abstractions.

Without DIP: OrderService directly instantiates EmailSender, MySQLRepository, and StripePayment. To test OrderService, you need a real email server, database, and payment processor. Every change to those implementations requires changes in OrderService.

With DIP: OrderService depends on IEmailSender, IOrderRepository, IPaymentProcessor interfaces. Implementations inject through the constructor. Tests inject fakes. Swapping MySQL for Postgres touches only the repository implementation, not OrderService.

DIP is the theoretical foundation of dependency injection frameworks (Spring, .NET DI, NestJS providers).

### Using SOLID as Diagnostics

SOLID principles are most useful as diagnostic tools:
- Code hard to test → DIP violation (concrete dependencies)
- Change one feature, break another → SRP violation (mixed responsibilities)
- Adding a feature requires editing existing code everywhere → OCP violation (no extension points)
- Implementing an interface requires stubs → ISP violation (interface too broad)
- Subclass breaks tests written for parent → LSP violation

Apply them selectively. Over-engineering a simple script to be SOLID-compliant is worse than a pragmatic SRP violation. SOLID matters when code is shared, evolved, and tested over time.`,
    quiz: [
      {
        q: 'An OrderService class handles order creation, inventory checking, payment processing, and email notifications. Which SOLID principle does this violate?',
        options: ['Open/Closed', 'Liskov Substitution', 'Single Responsibility', 'Interface Segregation'],
        correct: 2,
        explanation: 'OrderService has four distinct reasons to change (payment API changes, email service changes, inventory logic changes, order logic changes). Each reason to change is a responsibility — four responsibilities violates SRP.',
      },
      {
        q: 'Adding new payment types to a PaymentProcessor by adding new strategy classes rather than editing a switch statement is an example of:',
        options: ['Single Responsibility Principle', 'Open/Closed Principle', 'Dependency Inversion', 'Interface Segregation'],
        correct: 1,
        explanation: 'OCP: open for extension (add new PaymentStrategy implementation) but closed for modification (no changes to existing PaymentProcessor code).',
      },
      {
        q: 'Why does Square extending Rectangle violate Liskov Substitution?',
        options: [
          'Square has more methods than Rectangle',
          'Code that independently sets width and height breaks for Square, so Square is not substitutable for Rectangle',
          'Square\'s constructor requires different arguments',
          'Square should be an interface, not a class',
        ],
        correct: 1,
        explanation: 'LSP requires that subclass instances work wherever parent class instances are expected. Code setting width and height independently on a Rectangle fails when given a Square (which couples them).',
      },
      {
        q: 'Dependency Inversion Principle primarily improves:',
        options: [
          'Runtime performance by avoiding virtual dispatch',
          'Testability and replaceability by depending on abstractions rather than concrete implementations',
          'Code readability by making dependencies explicit',
          'Security by hiding implementation details',
        ],
        correct: 1,
        explanation: 'DIP makes high-level modules independent of specific implementations. Tests inject fakes; production injects real implementations. Swapping implementations (MySQL→Postgres) does not touch high-level code.',
      },
      {
        q: 'A Robot class is forced to implement eat() and sleep() from a Worker interface with empty methods. This violates:',
        options: ['SRP', 'OCP', 'LSP', 'ISP'],
        correct: 3,
        explanation: 'ISP: clients should not depend on methods they do not use. A fat Worker interface forces Robot to stub methods it does not need. Split into narrower interfaces (Workable, Feedable, Restable).',
      },
    ],
  },
  {
    id: 'swe-m02',
    track: 'software-eng' as any,
    title: 'Design Patterns',
    subtitle: 'Creational, structural, and behavioral patterns — the vocabulary of software design',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 2,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Factory Pattern', definition: 'A creational pattern that defines an interface for creating objects without specifying their concrete class; allows subclasses or configuration to control which class is instantiated.' },
      { term: 'Observer Pattern', definition: 'A behavioral pattern where an object (subject) maintains a list of dependents (observers) and notifies them automatically when its state changes; the basis of event systems, pub/sub, and reactive programming.' },
      { term: 'Decorator Pattern', definition: 'A structural pattern that attaches new behaviors to objects by wrapping them in decorator objects, as an alternative to inheritance; composes behavior at runtime rather than compile time.' },
      { term: 'Strategy Pattern', definition: 'A behavioral pattern that defines a family of interchangeable algorithms, encapsulates each one, and makes them interchangeable; enables selecting algorithms at runtime.' },
      { term: 'Repository Pattern', definition: 'A domain-driven design pattern that abstracts data access behind a collection-like interface; hides database details from domain code and simplifies testing by allowing in-memory repositories.' },
    ],
    content: `## Design Patterns

Design patterns are proven solutions to recurring design problems. The Gang of Four (Gamma, Helm, Johnson, Vlissides, 1994) catalogued 23 patterns across three categories. They are not code to copy but vocabulary for communicating design intent and a starting point for thinking through structural problems.

### Creational Patterns

**Singleton**: ensures one instance exists and provides global access. Often overused; globals make testing hard, introduce hidden coupling, and create thread-safety concerns. Prefer dependency injection over singletons.

**Factory Method**: a base class defines a creation interface (createProduct()), subclasses override to decide which class to instantiate. Enables extension without modifying the factory's client code.

**Abstract Factory**: a factory of factories; produces families of related objects (a Mac UI factory produces Mac buttons, Mac checkboxes, Mac dialogs). Swapping the factory swaps the entire family.

**Builder**: separates construction from representation. \`new QueryBuilder().select("name").from("users").where("age > 18").build()\` is clearer than a constructor with 10 parameters and avoids "telescoping constructor" anti-pattern.

**Prototype**: creates objects by cloning an existing instance. Useful when construction is expensive and most new objects are similar to existing ones (e.g., game entities with complex initialization).

### Structural Patterns

**Adapter**: converts one interface to another. A legacy XML API adapted to a modern JSON interface; a third-party payment library adapted to your PaymentProcessor interface. Adapters enable integration without modifying either side.

**Decorator**: wraps objects to add behavior without subclassing. HTTP middleware chains are decorators: \`logging(caching(compression(handler)))\` — each layer adds behavior while calling through to the next. JavaScript class decorators (@Injectable, @Memoize) are the language-level version.

**Composite**: composes objects into tree structures to represent part-whole hierarchies. A UI component tree is composite: each component can be a leaf (button) or composite (panel containing buttons). Code treating leaf and composite uniformly is cleaner than code distinguishing them.

**Proxy**: provides a surrogate or placeholder. A lazy-loading proxy delays expensive object creation until first use. A caching proxy stores results. A protective proxy enforces access control. A remote proxy represents an object on a different machine (the basis of RPC).

**Facade**: provides a simplified interface to a complex subsystem. A PaymentFacade might coordinate authentication, fraud checking, charging, receipt generation, and audit logging behind a single pay(amount, card) method.

### Behavioral Patterns

**Observer / Event**: subject maintains a list of observers; notifies them on state change. DOM addEventListener is Observer. RxJS Observables, Node.js EventEmitter, React's useState (re-renders are notifications to the UI). The foundational pattern for reactive programming.

**Strategy**: encapsulates a family of algorithms; select one at runtime. A Sorter with a SortStrategy interface can be configured with QuickSort or MergeSort without changing calling code. This is OCP in action: new strategies extend the system without modifying it.

**Command**: encapsulates a request as an object. This enables undo/redo (store executed commands in a stack), transaction log (persist commands), macro recording (replay sequences), and deferred execution (queue commands for later). Text editors, design tools, and financial systems use Command extensively.

**Template Method**: defines algorithm skeleton in a base class with abstract steps that subclasses implement. A DataProcessor base class defines: readData(), processData(), writeData() — the template. Subclasses provide concrete implementations of each step. Django's class-based views follow this pattern.

**Iterator**: provides sequential access to collection elements without exposing the collection's structure. JavaScript's \`for...of\` works with any object implementing the iterator protocol ([Symbol.iterator]). Generators naturally produce iterators.

**Chain of Responsibility**: passes a request along a chain of handlers; each either handles it or passes to the next. HTTP middleware (Express.js, ASP.NET middleware) is Chain of Responsibility. Request validation, authentication, logging, and routing are separate handlers in a chain.

### Pattern Anti-Patterns

The risk with patterns is over-engineering. A function that selects an algorithm with a ternary doesn't need the Strategy pattern. A simple object doesn't need Builder. Pattern application should reduce complexity, not add layers for their own sake.

**Pattern smell**: if you're creating classes primarily to satisfy a pattern's structure rather than to model a real concept, reconsider. The goal is readable, maintainable code — patterns are means, not ends.

In modern JavaScript/TypeScript, many classical OOP patterns are unnecessary: first-class functions replace Strategy and Command (just pass the function), closures replace many uses of classes with state, and algebraic types with pattern matching handle Visitor more elegantly.`,
    quiz: [
      {
        q: 'Express.js middleware (app.use(logger), app.use(auth), app.use(route)) is an example of which pattern?',
        options: ['Observer', 'Chain of Responsibility', 'Decorator', 'Strategy'],
        correct: 1,
        explanation: 'Each middleware either handles the request or calls next() to pass to the next handler — exactly Chain of Responsibility.',
      },
      {
        q: 'A text editor\'s undo/redo system stores executed operations as objects in a stack. This is the:',
        options: ['Memento pattern', 'Command pattern', 'Observer pattern', 'State pattern'],
        correct: 1,
        explanation: 'The Command pattern encapsulates requests as objects. Storing command objects enables undo (reverse the last command) and redo (re-execute).',
      },
      {
        q: 'Which pattern is the foundation of reactive programming and pub/sub systems?',
        options: ['Strategy', 'Observer', 'Factory', 'Iterator'],
        correct: 1,
        explanation: 'Observer: subjects notify observers of state changes. This is the basis of DOM events, RxJS observables, Node.js EventEmitter, and all pub/sub systems.',
      },
      {
        q: 'Adding logging, caching, and compression to an HTTP handler by wrapping it: logging(caching(compression(handler))) demonstrates:',
        options: ['Composite pattern', 'Proxy pattern', 'Decorator pattern', 'Facade pattern'],
        correct: 2,
        explanation: 'Decorator wraps objects to add behavior without subclassing. Each wrapper (logging, caching, compression) adds behavior and delegates to the wrapped object.',
      },
      {
        q: 'When is the Builder pattern most valuable?',
        options: [
          'When an object has one required parameter',
          'When creating objects requires many optional parameters or a multi-step construction process',
          'When you need multiple instances of an object',
          'When subclasses determine which class to instantiate',
        ],
        correct: 1,
        explanation: 'Builder shines with many optional configuration parameters, avoiding the "telescoping constructor" anti-pattern (constructors with 8+ parameters) and making construction intent explicit through a fluent API.',
      },
    ],
  },
  {
    id: 'swe-m03',
    track: 'software-eng' as any,
    title: 'Testing Strategies',
    subtitle: 'Unit, integration, E2E — test pyramid, TDD, property-based testing',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 3,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Test Pyramid', definition: 'A testing strategy with many fast unit tests at the base, fewer integration tests in the middle, and even fewer slow E2E tests at the top; provides coverage speed while ensuring system integration works.' },
      { term: 'Test-Driven Development (TDD)', definition: 'A development practice of writing a failing test before implementation code: Red (failing test) → Green (minimal passing code) → Refactor (clean up). Forces modular, testable design.' },
      { term: 'Mock vs Stub vs Fake', definition: 'Test doubles: Stub returns canned responses; Mock is a stub that verifies interactions (assert it was called); Fake is a working simplified implementation (e.g., in-memory database). Overuse of mocks creates brittle tests.' },
      { term: 'Property-Based Testing', definition: 'Testing that generates random inputs and verifies properties (invariants) that should hold for all inputs, rather than specific examples; discovers edge cases that manual tests miss (QuickCheck, fast-check).' },
      { term: 'Code Coverage', definition: 'A metric measuring what percentage of code is executed by tests: line, branch, and path coverage. High coverage does not guarantee good tests; it is a necessary but not sufficient condition for quality.' },
    ],
    content: `## Testing Strategies

Tests are the primary tool for building confidence that code behaves as intended. The question is not whether to test but how: which tests to write, at what granularity, and in what balance to maximize confidence per unit of maintenance cost.

### The Test Pyramid

Mike Cohn's Test Pyramid describes the ideal distribution of test types:

**Unit Tests** (bottom, most): test individual functions or classes in isolation. Fast (milliseconds), deterministic, pinpoint failures precisely. Should comprise ~70% of tests.

**Integration Tests** (middle): test how components interact — a service with its database, an API with authentication middleware, a cache layer with its backing store. Slower (seconds), require infrastructure, but verify that components actually work together. ~20% of tests.

**End-to-End Tests** (top, fewest): simulate a real user interacting with the full system through the UI or API. Slowest (minutes), fragile (flaky), expensive to maintain, but test the actual user experience. ~10% of tests.

The **Ice Cream Cone** anti-pattern (inverted pyramid) has mostly E2E tests: slow, expensive, fragile, hard to diagnose. A single E2E failure might require hours to investigate.

### Unit Testing Well

Good unit tests:
- **Test behavior, not implementation**: test that calculateTax(100) returns 10, not that it called getTaxRate() exactly once. Implementation-testing creates brittle tests that break during refactoring.
- **One logical assertion per test**: a test named "should return user when found" should not also test "should return null when not found." Separate concerns = separate tests.
- **Fast and isolated**: no I/O, no network, no external services. Use test doubles for dependencies.
- **Readable**: the test is documentation. \`it("returns empty array when no users match the filter")\` explains intent better than \`it("test filter edge case")\`.

**AAA pattern**: Arrange (set up test data), Act (call the function), Assert (verify the result). Every unit test follows this structure explicitly.

### Test Doubles

A test double replaces a real dependency in tests:

**Dummy**: passed but never used (a null or empty object to satisfy an interface parameter).

**Stub**: returns preset responses. \`userRepo.findById.returns({ id: 1, name: 'Alice' })\`. Stubs simulate dependencies without real behavior.

**Mock**: a stub that also verifies interactions. \`emailService.send.wasCalledOnce()\`. Mocks assert *how* the system under test interacted with its dependencies.

**Fake**: a real, working implementation that is simpler than production. An in-memory database (SQLite or just a Map) instead of PostgreSQL. Fast and realistic — better than mocks for most purposes.

**Spy**: a real implementation that also records calls. Used to verify behavior without stubbing.

**The mock debate**: over-mocking creates tests that pass even when the system is broken (wrong mock expectations), and tests that break when implementation details change without any real behavioral change. Martin Fowler distinguishes "mockists" (mock everything) from "classicists" (use real collaborators or fakes where possible). The classicist approach produces more durable tests.

### Test-Driven Development (TDD)

TDD: write a failing test first, then write the minimal code to pass it, then refactor.

**Benefits**: forces you to think about the API before implementation (you write the calling code first); makes code testable by construction (hard-to-test code reveals design problems); gives instant feedback; prevents over-engineering (you only write code to pass tests).

**The Red-Green-Refactor cycle**:
1. **Red**: write a test that fails (doesn't even compile yet is fine)
2. **Green**: write the minimum code to make it pass (hack if needed)
3. **Refactor**: clean up the code, knowing tests verify behavior is preserved

TDD is not universal. It works well for algorithms, business logic, and utility functions. It works poorly for UI, highly stateful systems, and exploratory prototypes. Skilled engineers apply it selectively.

### Integration and E2E Testing

Integration tests should use real dependencies where practical. Testing an API with a real database (test database, populated with fixtures) catches more bugs than testing with mocks of the database layer. Use Docker Compose to spin up infrastructure for test suites.

**Test fixtures**: seed data that creates the starting state for each test. Each test should be isolated — no test should depend on the state left by another. Transaction rollback after each test keeps the database clean.

E2E tests with Playwright or Cypress automate browser interaction. They are valuable for critical user journeys (sign up, purchase, login) but should be minimized because they are slow and fail for reasons unrelated to bugs (timing issues, external service flakiness).

### Property-Based Testing

Traditional example-based testing: check that reverse([1,2,3]) == [3,2,1].

Property-based testing: for any array A, reverse(reverse(A)) == A. Generate hundreds of random arrays; verify the property holds for all of them.

Properties to test: idempotence (applying twice = applying once), roundtrip (encode then decode = identity), invariants (sorted array stays sorted after insertion), commutativity (a+b = b+a).

**fast-check** (JavaScript), **Hypothesis** (Python), **QuickCheck** (Haskell) are the main frameworks. They shrink failing examples to the smallest case that still fails — invaluable for debugging.

### Coverage and Quality

Code coverage measures how much code is executed during tests. 100% line coverage is achievable with trivial assertions that test nothing meaningful. Coverage is a **floor**, not a ceiling.

Branch coverage (testing both paths of every if-else) is more meaningful than line coverage. Mutation testing (deliberately introduce bugs and verify tests catch them) is the most rigorous test quality measure.

The goal is confidence, not coverage numbers. A well-tested critical path with 70% coverage is more valuable than 95% coverage with weak assertions.`,
    quiz: [
      {
        q: 'The "test pyramid" recommends the largest proportion of tests be:',
        options: ['E2E tests (full user journeys)', 'Integration tests', 'Unit tests', 'Performance tests'],
        correct: 2,
        explanation: 'Unit tests are fast, deterministic, and precise. They should be the majority. E2E tests are slow and fragile — keep them minimal for critical user journeys only.',
      },
      {
        q: 'A test that mocks the database layer passes but production code fails against a real database. This illustrates a problem with:',
        options: [
          'Integration tests being too slow',
          'Overly detailed mocks that verify behavior that differs from the real implementation',
          'E2E tests not covering database logic',
          'Code coverage not being high enough',
        ],
        correct: 1,
        explanation: 'Mock behavior diverging from real behavior is the core problem with over-mocking. Fakes (in-memory implementations) or tests against real databases catch these discrepancies.',
      },
      {
        q: 'In TDD, what does the "Red" phase refer to?',
        options: [
          'A test that runs slowly (red = slow)',
          'Writing a failing test before any implementation exists',
          'Identifying code coverage gaps',
          'A failing CI pipeline',
        ],
        correct: 1,
        explanation: 'Red-Green-Refactor: Red means the test fails (ideally does not even compile). You then write code to make it Green (passing), then Refactor (clean up). You never write implementation before the test.',
      },
      {
        q: 'Property-based testing differs from example-based testing because it:',
        options: [
          'Requires less code to write',
          'Generates random inputs and verifies invariants, discovering edge cases example tests miss',
          'Tests the full system end-to-end',
          'Does not require a testing framework',
        ],
        correct: 1,
        explanation: 'Property-based testing generates hundreds of random inputs and checks that a property holds for all of them. It finds edge cases that hand-written examples miss (empty strings, max integers, unicode, etc.).',
      },
      {
        q: '100% code coverage means:',
        options: [
          'The code has no bugs',
          'Every line is executed at least once during tests — a floor, not a guarantee of test quality',
          'Every branch is tested in both directions',
          'Tests assert correct behavior for all inputs',
        ],
        correct: 1,
        explanation: '100% line coverage can be achieved with assertions like `expect(true).toBe(true)`. Coverage tells you what is executed, not whether behavior is verified correctly.',
      },
    ],
  },
  {
    id: 'swe-m04',
    track: 'software-eng' as any,
    title: 'Clean Code & Code Quality',
    subtitle: 'Naming, functions, structure — the craft of writing code that reads like prose',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 4,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Cognitive Complexity', definition: 'A metric measuring how difficult code is to understand, weighting control flow nesting, breaks in linear flow, and recursion; distinct from cyclomatic complexity, which counts paths.' },
      { term: 'Magic Number', definition: 'A hard-coded numeric literal with no explanation of its meaning or origin; e.g., if (status === 4) — replacing with named constants (STATUS_SHIPPED = 4) makes intent clear.' },
      { term: 'Command-Query Separation', definition: 'Functions should either perform an action (command, returns void) or return data (query, no side effects) — never both. Mixing the two makes reasoning about state difficult.' },
      { term: 'Law of Demeter', definition: 'A module should only communicate with its immediate dependencies, not reach through them (a.b.c.d() chains are violations); promotes loose coupling by limiting knowledge of object graphs.' },
      { term: 'Boy Scout Rule', definition: 'Leave the code cleaner than you found it; fix one small thing every time you touch a file — meaningful variable name, extract a function, remove a dead branch — prevents decay over time.' },
    ],
    content: `## Clean Code & Code Quality

Clean code is code that clearly communicates intent to the next reader (who is often yourself six months later). It is not necessarily shorter or faster — it is readable, testable, and changeable. These properties matter because the cost of software is predominantly in maintenance, not initial development.

### Naming

Names are the most important element of clean code. Good names eliminate the need for comments.

**Variables**: name the concept, not the type. \`userList\` is worse than \`activeSubscribers\`. \`d\` is unacceptable unless scope is 2 lines. \`data\` is almost always wrong — data of what?

**Functions**: verbs. \`createOrder()\`, \`sendWelcomeEmail()\`, \`validatePaymentMethod()\`. If you cannot name a function with one verb phrase, it probably does more than one thing.

**Boolean flags**: prefix with is/has/should/can. \`isAuthenticated\`, \`hasExpired\`, \`shouldRetry\`. \`authenticated\` could be a noun (a person) or an adjective — the prefix clarifies.

**Classes**: nouns representing concepts. \`UserRepository\` not \`UserDatabaseHandler\`. Classes named after processes (\`DataProcessor\`, \`InfoManager\`) are often SRP violations in disguise.

**Avoid**: abbreviations (acct, usr), encodings (iUserCount, strName — type information belongs in the type system), noise words (Manager, Handler, Processor, Info, Data, Object added to a name that already says everything).

### Functions

A function should do one thing, do it well, and do it only. Robert Martin's heuristics:

**Length**: functions should rarely exceed 20 lines. Not a rule but a smell — longer functions likely do multiple things.

**Arguments**: 0-2 arguments is ideal. 3 is acceptable. More than 3: extract a parameter object. Flag arguments (a boolean that controls two behaviors) should be split into two functions.

**Side effects**: a function named \`checkPassword()\` should not also reset the session. Unexpected side effects are where bugs hide.

**Levels of abstraction**: a function should operate at one level of abstraction. Mixing high-level logic (process order) with low-level details (parse date string) in the same function makes both harder to understand.

### Structure

**Early returns**: validate inputs and return early rather than wrapping everything in else blocks. Arrow anti-pattern: code with 5 levels of nesting from else-if chains. Early return removes nesting.

**Guard clauses**: \`if (!user) return null; if (!user.isActive) return null; // real logic here\` is cleaner than nested ifs.

**Extract functions**: when you feel the urge to write a comment, extract that block into a function with a descriptive name. \`// calculate compound interest\` → \`calculateCompoundInterest(principal, rate, years)\`.

**Horizontal and vertical formatting**: related code should be close. Variable declarations near first use, not all at the top. Methods that call each other should be adjacent. Blank lines separate logical sections.

### Code Smells

**Long methods**: doing too much, too complex.

**Large classes (God objects)**: know too much, do too much. Break into focused classes.

**Feature envy**: a method uses another class's data more than its own. Move it to the class it envies.

**Primitive obsession**: using primitives (strings, ints) where domain objects belong. A phone number isn't a string — it has formatting, validation, country code. A Money type prevents accidentally adding USD and EUR.

**Shotgun surgery**: one change requires edits in many files. Symptom of incorrect code organization — related concepts are spread across modules.

**Dead code**: commented-out code, unreachable branches, unused functions. Delete it — version control remembers it.

**Duplicate code (DRY)**: copy-paste is the most common source of bugs. Extract duplicated logic. But don't over-DRY: two similar-looking functions in different domains may diverge. Premature DRY creates wrong abstractions that are harder to fix than the original duplication.

### Cognitive Complexity

The human working memory holds ~7 items. Deeply nested code, complex boolean expressions, and long chains of transformations exceed this limit, making reasoning error-prone.

Cognitive complexity measures this: each nesting level adds weight, each structural break (continue, break, recursion) adds weight. Code analysis tools (SonarQube, ESLint's complexity rule) measure this automatically.

Reducing cognitive complexity: extract nested logic into named functions, replace complex boolean expressions with named predicates (\`isEligibleForDiscount()\`), convert deeply nested loops to functional chains (map/filter/reduce).

### The Boy Scout Rule and Technical Debt

Technical debt is the cost of rework caused by choosing a fast solution now over a correct one. Like financial debt, it accrues interest: the longer it persists, the harder it becomes to fix as more code depends on the poor design.

The Boy Scout Rule — leave code cleaner than you found it — prevents debt accumulation. Fix one variable name, extract one function, remove one dead branch every time you touch a file. Over months, the codebase improves continuously without requiring dedicated "cleanup sprints."

This doesn't mean refactoring without tests. Refactor in tested code with a clear behavioral contract; refactoring untested code is rewriting, which is a different risk.`,
    quiz: [
      {
        q: 'A function named processData() that reads from a file, transforms the data, writes to a database, and sends an email violates which principle?',
        options: [
          'DRY (Don\'t Repeat Yourself)',
          'Single Responsibility (it does four different things)',
          'Law of Demeter',
          'Command-Query Separation',
        ],
        correct: 1,
        explanation: 'SRP: a function should do one thing. processData() has four reasons to change: file format, transformation logic, database schema, email format. Extract four focused functions.',
      },
      {
        q: 'Command-Query Separation says functions should:',
        options: [
          'Either perform an action OR return data, never both',
          'Always return a value for testability',
          'Never modify state',
          'Use commands for writes and queries for reads in different services',
        ],
        correct: 0,
        explanation: 'CQS: commands (setters, actions) return nothing; queries return data without side effects. A function that both changes state AND returns data makes state reasoning difficult.',
      },
      {
        q: 'The "primitive obsession" code smell refers to:',
        options: [
          'Using too many loops instead of functional methods',
          'Using raw primitives (strings, ints) where domain objects should represent domain concepts',
          'Preferring simple code over abstractions',
          'Using magic numbers instead of constants',
        ],
        correct: 1,
        explanation: 'Primitive obsession: using a string for phone numbers, an int for money, a boolean for state instead of PhoneNumber, Money, or UserStatus types. Domain types carry validation and semantics.',
      },
      {
        q: 'The Boy Scout Rule applied to a legacy codebase means:',
        options: [
          'Complete a full refactor before adding any features',
          'Improve one small thing every time you touch a file, creating continuous gradual improvement',
          'Write tests before any modification to legacy code',
          'Delete all code older than 2 years',
        ],
        correct: 1,
        explanation: 'The Boy Scout Rule: leave code cleaner than you found it, one small improvement at a time. Prevents decay accumulation without requiring dedicated refactor sprints.',
      },
      {
        q: 'Feature envy is a code smell where:',
        options: [
          'A class has too many features for its size',
          'Two classes have duplicate functionality',
          'A method uses another class\'s data more than its own, suggesting it belongs in that class',
          'A function returns too many values',
        ],
        correct: 2,
        explanation: 'Feature envy: a method is "envious" of another class\'s data — it accesses that class more than its own. The fix is usually to move the method to the class it envies.',
      },
    ],
  },
  {
    id: 'swe-m05',
    track: 'software-eng' as any,
    title: 'Software Architecture Patterns',
    subtitle: 'MVC, hexagonal, event-driven, microservices — choosing the right architecture',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 5,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Hexagonal Architecture', definition: 'Also known as Ports and Adapters — isolates application core logic from external systems (databases, APIs, UIs) behind ports (interfaces) with adapters (implementations); domain code has no framework or I/O dependencies.' },
      { term: 'Event Sourcing', definition: 'Persisting application state as an immutable log of events (OrderPlaced, ItemShipped, PaymentReceived) rather than current state; current state is derived by replaying events; enables audit trail, temporal queries, and event replay.' },
      { term: 'CQRS', definition: 'Command Query Responsibility Segregation — separating the write model (commands, normalized for consistency) from the read model (queries, denormalized for performance); scales reads and writes independently.' },
      { term: 'Bounded Context', definition: 'A Domain-Driven Design concept: a logical boundary within which a domain model is consistent and terms have specific meanings; the Shipping context\'s "Order" and the Billing context\'s "Order" are different models with different behaviors.' },
      { term: 'Circuit Breaker', definition: 'A resilience pattern for distributed systems: after N consecutive failures calling a dependency, the circuit "opens" (fails fast without attempting the call) for a timeout period, preventing cascade failures.' },
    ],
    content: `## Software Architecture Patterns

Architecture is the set of decisions that are expensive to change: how the system is decomposed, how components communicate, where boundaries lie, and which concerns are separated. Good architecture maximizes the decisions you can defer.

### Layered Architecture

The classic three-tier: Presentation → Application → Data. Each layer depends only on the layer below it. Simple, widely understood, and sufficient for many applications.

Problems at scale: the data layer bleeds into the application layer (domain objects are database entities), the presentation layer couples to specific APIs, and testing requires the full stack. The anemic domain model anti-pattern: domain objects are just data containers with no behavior, all logic in service classes.

### Hexagonal Architecture (Ports and Adapters)

Alistair Cockburn's hexagonal architecture puts the application core at the center, with ports defining interfaces for everything external, and adapters implementing those interfaces.

**Domain layer**: pure business logic, no framework, no I/O, no database. Testable with zero infrastructure.

**Application layer**: orchestrates domain logic using ports. \`CreateOrderUseCase\` depends on \`IOrderRepository\`, \`IPaymentGateway\`, \`IEmailSender\` — all interfaces.

**Infrastructure layer**: adapters implementing ports — \`PostgresOrderRepository\`, \`StripePaymentGateway\`, \`SendgridEmailSender\`. Swappable without touching domain or application code.

This architecture makes the domain the most important part of the codebase (not the database) and enables testing domain logic in isolation. It underpins clean architecture (Robert Martin) and onion architecture.

### Domain-Driven Design (DDD)

DDD (Eric Evans, 2003) aligns software design with the business domain:

**Entities**: objects with identity that persists through state changes. An Order is an entity — it has a unique ID; two orders with the same items are still different orders.

**Value Objects**: objects defined entirely by their attributes. Money(100, USD) equals Money(100, USD) — no identity needed. Immutable by definition.

**Aggregates**: clusters of entities and value objects with a clear boundary and root. An Order aggregate contains OrderItems, a ShippingAddress, and PaymentDetails. All access goes through the Order root. An invariant (order total must equal sum of items) is enforced by the aggregate.

**Bounded Contexts**: the Catalog context's "Product" has price, description, and image. The Inventory context's "Product" has stock level and warehouse location. These are different models sharing a name. Map their relationship in a Context Map.

### Event-Driven Architecture and CQRS/ES

**Event-Driven Architecture**: components communicate through events. OrderService publishes OrderPlaced event; InventoryService consumes it to reserve stock; EmailService consumes it to send confirmation. Producers and consumers are decoupled.

**Event Sourcing**: instead of storing current state, store the full history of events. \`ORDER_PLACED → PAYMENT_RECEIVED → ITEM_SHIPPED → DELIVERED\`. Current state = replay from start. Benefits: complete audit trail, temporal queries ("what was the order state last Tuesday?"), event replay for migrations, projections.

**CQRS**: write side accepts commands and updates the domain model (append events). Read side maintains denormalized views (projections) optimized for queries. The read model is eventually consistent with the write model. This separates scaling concerns: reads can scale horizontally by adding read replicas; writes go through the aggregate.

### Microservices

Microservices decompose a system into small, independently deployable services. Benefits: independent deployments, technology heterogeneity, failure isolation, team autonomy (Conway's Law: architecture mirrors org structure).

**When to use microservices**: when team size exceeds what can effectively own a monolith, when services have genuinely different scaling requirements, when deployment independence outweighs distributed systems complexity.

**When not to**: for a new system without clear domain boundaries (premature decomposition), for small teams (overhead of service mesh, distributed tracing, contract testing, deployment coordination exceeds the benefits).

The **Strangler Fig** pattern migrates a monolith to microservices: new functionality is built as separate services; existing monolith code is gradually replaced by extracting services.

### Resilience Patterns

**Circuit Breaker**: wraps calls to remote services. After N consecutive failures, the circuit opens — calls fail immediately without attempting the network call. After a timeout, a probe request tests if the service recovered. Prevents cascade failures when one service is down.

**Bulkhead**: isolates thread pools or connection pools per dependency. If one downstream service consumes all threads, other services remain available. Named after ship compartments that prevent flooding the whole vessel.

**Retry with Exponential Backoff**: retry failed requests with increasing delays (1s, 2s, 4s, 8s) plus random jitter. Prevents thundering herd: if 1000 services all retry simultaneously after an outage, they immediately overwhelm the recovered service. Jitter staggers retries.

**Timeouts**: every remote call must have a timeout. Without them, a slow dependency can exhaust all threads.

### Choosing an Architecture

For a new system with a single team: start with a monolith. Well-structured modular monolith with clear boundaries is far easier to develop, test, and deploy than microservices. Extract services only when you have clear scaling or team-ownership reasons.

For an existing system: add interfaces before extracting. Port and adapter boundaries in a monolith translate directly to service boundaries if you later extract — the code changes minimally, only infrastructure code changes.`,
    quiz: [
      {
        q: 'In hexagonal architecture, the domain layer should have dependencies on:',
        options: [
          'The database adapter directly for performance',
          'The web framework for HTTP handling',
          'No framework, I/O, or infrastructure — only interfaces (ports) it defines',
          'The application layer for orchestration',
        ],
        correct: 2,
        explanation: 'Hexagonal architecture: the domain has no outward dependencies. External systems (databases, APIs, frameworks) depend on the domain through ports (interfaces), not the reverse.',
      },
      {
        q: 'Event Sourcing stores application state as:',
        options: [
          'A snapshot of current state updated atomically on each change',
          'An immutable log of events; current state is derived by replaying events',
          'JSON documents with embedded version history',
          'A separate audit table alongside the main state table',
        ],
        correct: 1,
        explanation: 'Event Sourcing: the event log IS the source of truth. Current state is a projection of replayed events. This enables audit trails, temporal queries, and event replay for new projections.',
      },
      {
        q: 'CQRS separates responsibilities between:',
        options: [
          'Frontend and backend layers',
          'Write operations (commands, normalized domain model) and read operations (queries, denormalized projections)',
          'Production and staging environments',
          'Synchronous and asynchronous operations',
        ],
        correct: 1,
        explanation: 'CQRS: commands change state through the domain model; queries read from denormalized projections optimized for specific views. This allows independent scaling and optimization of reads and writes.',
      },
      {
        q: 'A Circuit Breaker "opens" after N consecutive failures. In the open state it:',
        options: [
          'Retries the request immediately after each failure',
          'Fails fast without attempting the network call, preventing cascade failures',
          'Routes traffic to a backup service automatically',
          'Logs the failure and returns a cached response',
        ],
        correct: 1,
        explanation: 'Open circuit = fail fast, no network call attempted. This prevents the caller from waiting for timeouts on a known-broken service and frees threads for other work.',
      },
      {
        q: 'The recommendation to "start with a monolith" for new systems means:',
        options: [
          'Never use microservices',
          'Avoid introducing distributed systems complexity before domain boundaries are clear and scaling needs justify it',
          'All code should be in one file',
          'Microservices should only be used for legacy systems',
        ],
        correct: 1,
        explanation: 'Premature microservice decomposition adds distributed systems overhead (service discovery, distributed tracing, contract testing, deployment complexity) before the benefits materialize. A well-structured monolith is easier to evolve into services when boundaries are clear.',
      },
    ],
  },
  {
    id: 'swe-m06',
    track: 'software-eng' as any,
    title: 'Technical Debt & Refactoring',
    subtitle: 'Managing accumulated complexity, safe refactoring techniques, and code evolution',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 6,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Technical Debt Quadrant', definition: 'Martin Fowler\'s framework classifying debt by intent (deliberate/inadvertent) and outcome (reckless/prudent). Prudent deliberate debt: "We\'ll ship now and refactor later." Reckless inadvertent debt: "We didn\'t know about layering."' },
      { term: 'Refactoring', definition: 'Restructuring existing code without changing its external behavior; improves internal design without altering functionality. Requires tests to verify behavior is preserved during restructuring.' },
      { term: 'Strangler Fig Pattern', definition: 'Incrementally replacing a legacy system by routing new functionality to new code while old functionality is gradually migrated; allows continuous delivery during a large architectural change without a big-bang rewrite.' },
      { term: 'Mikado Method', definition: 'A technique for making large structural changes in a legacy codebase by starting the change, noting what breaks, reverting, and building a dependency graph of prerequisite changes to tackle in the right order.' },
      { term: 'Code Archaeology', definition: 'Using git blame, history, and commit messages to understand why code is written the way it is — essential before refactoring code whose original intent is unclear.' },
    ],
    content: `## Technical Debt & Refactoring

Technical debt is the cost you pay for building software faster than you should have. Every shortcut, every "we'll fix it later," every copied block of code is a withdrawal on a debt account that accrues interest. Understanding debt — how it accumulates, how to measure it, and how to pay it down safely — is one of the most important practical skills in software engineering.

### Understanding Technical Debt

Ward Cunningham coined the term in 1992. The financial metaphor is precise: debt enables progress now at the cost of future interest payments. Done consciously, it's a tool. Done unconsciously, it compounds until it collapses projects.

**Martin Fowler's Technical Debt Quadrant** classifies debt on two axes:

- **Prudent vs Reckless**: Did you make a considered tradeoff, or was it just sloppiness?
- **Deliberate vs Inadvertent**: Did you choose to incur the debt, or didn't you know better?

Four quadrants:
1. **Prudent + Deliberate**: "We need to ship this quarter; we'll refactor after we understand the domain better." Acceptable when tracked and paid.
2. **Reckless + Deliberate**: "We don't have time for tests or documentation." The most dangerous — creates shortcuts with full knowledge of the consequences, often under misaligned incentives.
3. **Prudent + Inadvertent**: "Now we understand the domain, we see we should have split this differently." Learning debt — unavoidable, acceptable.
4. **Reckless + Inadvertent**: "What's layering?" — the most expensive because no one knows it's happening.

### Measuring Technical Debt

**Debt indicators**:
- Cyclomatic complexity > 10 per function
- Functions > 50 lines
- Classes > 200-300 lines
- Test coverage < 30% on critical paths
- Build time > 30 minutes (symptom of poor modularity)
- Features taking 5x longer than initial estimate (compound interest)
- Team velocity declining while code grows

Tools: SonarQube, CodeClimate, and language-specific linters report complexity, duplication, and security issues. They express debt as estimated remediation hours — useful for communicating with management.

### Safe Refactoring

The prerequisite for refactoring is tests. Refactoring without tests is rewriting — a fundamentally riskier activity. If code has no tests, the first task is adding characterization tests (tests that capture current behavior, even if wrong) before touching the implementation.

**Martin Fowler's Refactoring Catalog** (refactoring.com) defines atomic refactoring operations, each with a precise before/after:

**Extract Method**: select a code block, create a function, replace the block with a call. The most important refactoring operation.

**Rename Variable/Method/Class**: the most common. Modern IDEs do this with certainty for statically typed languages.

**Extract Class**: take part of a class's responsibilities and move them to a new class. Fixes SRP violations.

**Replace Conditional with Polymorphism**: replace a switch/if-else on type with a polymorphic method on each type's class.

**Replace Primitive with Object**: wrap a primitive (phone string, money int) in a domain type with validation.

**Introduce Parameter Object**: replace 5 function parameters with one object.

**Move Method**: when a method uses another class's data more than its own (feature envy), move it to that class.

### Tackling Large Refactors Safely

**The Strangler Fig Pattern** (Martin Fowler): don't rewrite, strangle. For a legacy API, add an interceptor layer in front. New endpoints are implemented in the new system. Old endpoints continue working in the old system. Gradually route old endpoints to the new system as they're reimplemented. When all traffic flows to the new system, delete the old one.

This pattern enables continuous delivery throughout the migration — you're never in a "broken state" during migration because the old system always handles what the new system hasn't yet replaced.

**The Mikado Method**: start the change you want to make. Note what breaks. Don't fix it — revert. Add the first prerequisite to your dependency graph. Make that prerequisite change (it may break something else — revert, note). Build the dependency graph from prerequisites. When you've mapped all dependencies, execute in reverse order: deepest prerequisites first. This turns an overwhelming refactor into a series of safe, focused changes.

**Feature Flags**: wrap new code in a flag. Deploy both old and new implementations. Route a small percentage of traffic to the new code. Monitor for errors. Gradually increase the percentage. Delete the old code when 100% is on the new path. This is how Facebook, Netflix, and Google deploy large architectural changes without downtime.

### Working With Legacy Code

Michael Feathers defines legacy code as "code without tests." The challenge: without tests, you can't refactor safely; without refactoring, you can't add tests.

**The Legacy Code Change Algorithm** (Feathers):
1. Identify **change points** (where new behavior must go)
2. Find **test points** (where you can inject test doubles to observe behavior)
3. Break **dependencies** (use seam techniques to isolate the unit)
4. Write **characterization tests**
5. Make the change and verify behavior is preserved

**Seam techniques**: a seam is a place where behavior can be changed without editing the code directly. Object seams (pass dependencies in rather than hardcoding them), link seams (link-time dependency injection), preprocessing seams (conditional compilation). The goal is making untestable code testable without changing its behavior.

### The Cost-Benefit of Paying Debt

Not all debt needs to be paid. Code that is stable, correct, and unlikely to change — even if ugly — costs little in interest. Code that is frequently modified and has no tests costs enormous interest.

Prioritize debt reduction where:
- The code is changed frequently (high interest)
- Bugs occur repeatedly in the same area (symptom of structural debt)
- Onboarding new engineers takes weeks due to complexity
- Feature development is slowing demonstrably (declining velocity)

Communicate debt to stakeholders in business terms: "Adding this feature will take 3 weeks because of accumulated debt in the payment module. With 1 week of refactoring first, subsequent features will take 1 week each rather than 3." This frames technical work in terms management can reason about.`,
    quiz: [
      {
        q: 'According to Fowler\'s Technical Debt Quadrant, the most dangerous type of debt is:',
        options: [
          'Prudent and deliberate: consciously shipping fast to learn',
          'Prudent and inadvertent: realized a better design exists after gaining domain knowledge',
          'Reckless and inadvertent: poor design due to lack of knowledge, not even recognized as debt',
          'Reckless and deliberate: intentionally skipping tests to meet a deadline',
        ],
        correct: 2,
        explanation: 'Reckless + Inadvertent debt is most dangerous because the team doesn\'t know it\'s happening. No one is tracking or planning to pay it. It compounds silently.',
      },
      {
        q: 'The Strangler Fig Pattern differs from a "big-bang rewrite" because:',
        options: [
          'It uses the same codebase throughout the migration',
          'It incrementally replaces functionality while the old system remains live, maintaining continuous delivery',
          'It requires less testing than a rewrite',
          'It migrates the database before any application code',
        ],
        correct: 1,
        explanation: 'Strangler Fig: old and new systems coexist; traffic gradually shifts. At no point is the system "broken" during migration. Big-bang rewrites often fail or take years because the system is non-functional until the rewrite completes.',
      },
      {
        q: 'Michael Feathers defines "legacy code" as:',
        options: [
          'Code written more than 5 years ago',
          'Code in a language no longer actively developed',
          'Code without tests',
          'Code with no documentation',
        ],
        correct: 2,
        explanation: 'Feathers\' definition is pragmatic: legacy code = code without tests. Without tests, you cannot safely change it. The language age or documentation is secondary.',
      },
      {
        q: 'The Mikado Method helps with large refactors by:',
        options: [
          'Automatically generating refactoring scripts',
          'Mapping prerequisites by starting changes, noting what breaks, reverting, and building a dependency graph',
          'Splitting the refactor across multiple team members working in parallel',
          'Using feature flags to test the refactor in production',
        ],
        correct: 1,
        explanation: 'Mikado: start the change → note what breaks → revert → add prerequisites to a graph. Execute in bottom-up order. This turns a seemingly impossible refactor into a sequence of safe, focused changes.',
      },
      {
        q: 'Which of these is the highest-priority technical debt to pay first?',
        options: [
          'Poorly named variables in a module that has not changed in 3 years',
          'Missing tests in a payment processing module that is modified monthly and has recurring bugs',
          'An outdated README file',
          'Inconsistent code formatting in a library used only by one team',
        ],
        correct: 1,
        explanation: 'Prioritize debt where: changes are frequent (high interest from instability), bugs recur (symptom of structural problems), and the domain is critical (payment processing). Stable code with ugly internals but correct behavior costs little in interest.',
      },
    ],
  },
  {
    id: 'swe-m07',
    track: 'software-eng' as any,
    title: 'Code Review Culture',
    subtitle: 'Giving and receiving feedback that improves code and strengthens teams',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 7,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Nitpick', definition: 'A minor style or preference issue in a code review that the reviewer notes but that does not block merging; labeling it explicitly ("nit:") signals to the author that it can be addressed or ignored at their discretion.' },
      { term: 'Blocking vs Non-Blocking Comment', definition: 'A blocking comment must be resolved before merge (correctness bug, security issue, architectural concern); a non-blocking comment is a suggestion that the author can address or explain away.' },
      { term: 'LGTM Culture', definition: 'A code review culture where reviewers approve (Looks Good To Me) without substantive review, providing false confidence; common when review is rushed or social pressure discourages pushing back.' },
      { term: 'Pair Programming', definition: 'Two developers working at one keyboard simultaneously — driver writes code, navigator reviews in real time; reduces review friction by catching issues before they are committed.' },
      { term: 'Conventional Comments', definition: 'A labeling system for review comments (nit:, suggestion:, question:, blocker:, praise:) that sets clear expectations on what action each comment requires.' },
    ],
    content: `## Code Review Culture

Code review is the most common form of knowledge transfer and quality assurance in software teams. Done well, it improves code quality, spreads domain knowledge, mentors junior engineers, and builds team consensus around design principles. Done poorly, it creates friction, slows delivery, and damages relationships.

### The Purpose of Code Review

Code review serves multiple goals, not all equally important:

**Primary**: catching bugs, security issues, and architectural problems that the author missed.

**Secondary**: ensuring consistency with codebase conventions, sharing knowledge about changed code with at least one other engineer, and maintaining a shared understanding of how the system evolves.

**Tertiary**: style enforcement, formatting — these should be automated (linters, formatters) and never the subject of review comments.

The purpose defines the standard: a review that finds no bugs isn't a failure — it's validation. The goal is not to find something to criticize.

### Reviewing Well

**Understand before critiquing**: read the PR description, the linked ticket, and understand the intent before reading the diff. A change that looks wrong often makes sense given context you don't yet have.

**Review the right things**: logic correctness, security implications, error handling, test coverage, and alignment with architecture. Not variable names, brace style, or line length — those are for formatters.

**Be specific and actionable**: "This looks wrong" is not useful. "This will panic on nil input if user.Profile is null — add a nil check" is. The author needs to know what to fix and why.

**Distinguish blocking from non-blocking**: label critical issues clearly. Label suggestions as optional. The author should never have to guess what they must fix versus what they can consider.

**Conventional Comments labels**:
- \`blocker:\` — must be resolved before merge
- \`suggestion:\` — optional improvement
- \`question:\` — seeking understanding, not necessarily requiring change
- \`nit:\` — minor preference, not blocking
- \`praise:\` — positive signal, encourages good patterns

**Acknowledge good work**: reviewing is not purely adversarial. When you see elegant code, an insightful test, or a well-documented complex function, say so. Praise reinforces good patterns and builds psychological safety.

### The Author's Responsibilities

**Write a useful PR description**: context saves reviewers time. What problem does this solve? Why this approach and not alternatives? What edge cases did you consider? What's in scope and what's left for later?

**Keep PRs small**: the correlation between PR size and bugs found per line reviewed is inverse — reviewers lose focus on large diffs. PRs under 400 lines receive 90% review effectiveness; PRs over 1000 lines are often rubber-stamped.

**Self-review before submitting**: read your own diff. You will catch 20-30% of issues yourself.

**Respond to all comments**: even to say "acknowledged, will address in a follow-up" or "disagree because X." Leaving comments without response creates confusion about what was addressed.

**Don't take it personally**: a comment on your code is not a comment on your worth as an engineer. The best engineers welcome critical review because it improves the code.

### Giving Feedback on Sensitive Issues

When reviewing code by a senior engineer or addressing a fundamental design issue, frame feedback as questions: "I'm wondering if we should consider X — what are your thoughts on the tradeoffs?" rather than directives.

When disagreeing with a reviewer, provide reasoning: "I considered that approach but chose this one because of performance implications in the hot path — see the benchmark in the PR description." Respectful technical disagreement is healthy.

When the same issue recurs in multiple PRs, address it in a team discussion or a code style guide rather than relitigating it in every review.

### LGTM Culture and Review Quality

Teams under delivery pressure often develop LGTM culture — approvals without substantive review. This is a false economy: bugs that pass review cost 10-100x more to fix after deployment than during review.

Signs of LGTM culture: approval within 5 minutes of a large PR, zero comments on complex changes, authors who never receive blocking feedback.

Addressing it requires psychological safety: reviewers must feel safe giving feedback that slows delivery, and authors must receive critical feedback without defensiveness. This comes from leadership modeling good review behavior and treating found bugs as team wins, not individual failures.

### Code Review Metrics

**Review turnaround time**: if code sits in review for days, it creates integration conflicts and blocks the author. Target same-day reviews for urgent changes; 24-hour turnaround as a team norm.

**Review comment resolution rate**: what percentage of blocking comments are addressed versus explained away. Low rates may indicate insufficient context in comments.

**Bugs caught per review**: harder to measure but valuable signal for team effectiveness.

Avoid measuring review by comment count — it incentivizes nitpicking to show engagement.`,
    quiz: [
      {
        q: 'A code review comment labeled "nit:" means:',
        options: [
          'A critical security issue that blocks the PR',
          'A minor style preference that does not block merging',
          'A question the reviewer needs answered before approving',
          'A suggestion to change the architecture',
        ],
        correct: 1,
        explanation: '"Nit:" signals a minor preference — the author can address or ignore it. This prevents trivial comments from blocking valuable changes.',
      },
      {
        q: 'Why should code review PRs be kept small (under 400 lines)?',
        options: [
          'Reviewers cannot understand more than 400 lines of code',
          'Larger PRs exceed the version control system\'s limits',
          'Review effectiveness drops sharply on large diffs — reviewers lose focus and bugs slip through',
          'Small PRs are easier to revert',
        ],
        correct: 2,
        explanation: 'Research shows review effectiveness drops significantly on large diffs. Small, focused PRs receive higher-quality review. Under 400 lines: ~90% effectiveness. Over 1000 lines: often rubber-stamped.',
      },
      {
        q: 'The primary purpose of code review is:',
        options: [
          'Enforcing code style and formatting standards',
          'Demonstrating that the team is thorough',
          'Catching bugs, security issues, and architectural problems the author missed',
          'Slowing down delivery to ensure quality',
        ],
        correct: 2,
        explanation: 'Primary purpose: finding correctness issues. Style and formatting should be automated. Review is not about gatekeeping — it is validation and knowledge transfer.',
      },
      {
        q: 'When a reviewer leaves a comment saying "This looks wrong," this is poor review practice because:',
        options: [
          'Comments should be positive',
          'It is not specific or actionable — the author doesn\'t know what to fix or why',
          'The reviewer should have fixed the code themselves',
          'Reviewers should not disagree with authors',
        ],
        correct: 1,
        explanation: 'Effective review comments are specific and actionable: what the issue is and why it\'s a problem. "This looks wrong" leaves the author guessing.',
      },
      {
        q: 'LGTM culture in code review is a risk because:',
        options: [
          'It makes reviews too short',
          'It means approvals happen without substantive review, creating false confidence and letting bugs through',
          'It prevents junior engineers from learning',
          'It reduces the number of comments in the codebase',
        ],
        correct: 1,
        explanation: 'LGTM culture: approvals without substantive review. Bugs that pass code review cost 10-100x more after deployment. It is a false economy that feels fast but accumulates quality debt.',
      },
    ],
  },
  {
    id: 'swe-m08',
    track: 'software-eng' as any,
    title: 'SDLC Models & Agile Practices',
    subtitle: 'Waterfall, Scrum, Kanban, and choosing the right process for the problem',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 8,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Sprint', definition: 'A fixed-length iteration in Scrum (1-4 weeks) during which a team delivers a potentially shippable product increment; the sprint goal provides focus and the sprint review validates delivery.' },
      { term: 'Definition of Done', definition: 'A shared, explicit checklist of criteria that must be met for a story to be considered complete: code reviewed, tests written and passing, feature flagged, documentation updated, deployed to staging.' },
      { term: 'Cycle Time', definition: 'The time from when work starts on a story to when it is deployed to production; a key Kanban metric for measuring flow efficiency and identifying bottlenecks.' },
      { term: 'Sprint Velocity', definition: 'The average story points completed per sprint over the last 3-5 sprints; used for capacity planning, not as a performance metric or target to maximize.' },
      { term: 'Retrospective', definition: 'A regular team ceremony (per sprint in Scrum, per cadence in Kanban) to reflect on the process — what worked, what didn\'t, and what to change — with concrete action items for the next cycle.' },
    ],
    content: `## SDLC Models & Agile Practices

The Software Development Life Cycle (SDLC) defines how software goes from idea to production. Different models make different tradeoffs between predictability, flexibility, feedback frequency, and overhead.

### Waterfall

The original linear model: Requirements → Design → Implementation → Testing → Deployment → Maintenance. Each phase is fully complete before the next begins.

**When it works**: highly stable requirements (building a bridge, launching a satellite), regulatory environments requiring documentation gates, and projects where rework is prohibitively expensive.

**Why it fails for most software**: requirements are not fully knowable upfront. Users don't know what they want until they see something working. Technology changes during long projects. The first working version isn't delivered until testing is complete — often 18+ months after requirements.

The iron triangle of project management (scope, time, cost — pick two) shows the fundamental tension: Waterfall fixes scope and time but overruns cost; Agile fixes time and cost but adjusts scope.

### Scrum

Scrum is the most widely adopted Agile framework. Core elements:

**Sprints**: fixed 1-4 week iterations producing a potentially shippable increment. "Potentially shippable" means it meets the Definition of Done — it could be deployed, even if the business chooses not to.

**Roles**:
- **Product Owner**: owns the product backlog, sets priorities, represents business value
- **Scrum Master**: coaches the team on Scrum, removes impediments, facilitates ceremonies
- **Development Team**: self-organizing group that commits to and delivers sprint work

**Ceremonies**:
- **Sprint Planning**: select backlog items and create a sprint goal; team commits to what they can deliver
- **Daily Standup**: 15 minutes; what did I do, what will I do, what's blocking me
- **Sprint Review**: demonstrate what was built; stakeholders give feedback
- **Sprint Retrospective**: inspect and adapt the process

**Scrum anti-patterns**:
- Treating velocity as a target to game (adding story points to look productive)
- Skipping retrospectives when "too busy"
- Product Owner unavailable during sprint (backlogs go stale)
- Sprints never delivering shippable increments (the DoD is aspirational, not enforced)
- Estimates used as performance benchmarks

### Kanban

Kanban is a flow-based method with no fixed iterations. Work items flow through stages (To Do → In Progress → Review → Done) with WIP limits.

**Work In Progress (WIP) limits**: limit how many items can be in each stage simultaneously. If a stage is at capacity, upstream work stops — forcing focus on completing work rather than starting more. This surfaces bottlenecks: if Review is always full, the bottleneck is review capacity, not development.

**Kanban metrics**:
- **Cycle time**: time from start to done
- **Throughput**: items completed per week
- **WIP**: current items in flight

**When Kanban fits better than Scrum**: operations and support work (unpredictable inflow), mature teams with continuous deployment, and contexts where fixed-length sprints create artificial batching.

### Extreme Programming (XP)

XP is an Agile method focused on technical practices:
- **Test-Driven Development**: write tests first
- **Pair Programming**: two engineers at one workstation
- **Continuous Integration**: merge and build multiple times per day
- **Small Releases**: deploy frequently
- **Refactoring**: continuous design improvement
- **Collective Code Ownership**: any engineer can change any code

XP's value is its emphasis on technical discipline. Scrum often gets adopted without XP practices — teams sprint but don't do TDD or CI, which leads to technical debt accumulating under Agile timelines.

### Choosing a Model

**New product with unclear requirements**: Scrum — short sprints force early feedback, allowing pivots before significant investment is sunk.

**Support/operations team with continuous inflow**: Kanban — no artificial sprint cycles; work flows as it arrives.

**Regulated or safety-critical systems**: structured V-Model or hybrid — rigorous documentation gates matter when rework is dangerous.

**Small team, trusted stakeholders, continuous deployment**: Kanban or "shape up" — minimal ceremony, maximize flow.

**Startup finding product-market fit**: Kanban with weekly goals — avoid sprint overhead before the product direction is stable.

### The Backlog and User Stories

A product backlog is an ordered list of everything that might be done. Items at the top are detailed and ready; items at the bottom are vague and distant.

**User stories**: "As a [user type], I want [capability], so that [benefit]." This format forces thinking about who uses the feature and why, rather than technical solutions.

**Acceptance criteria**: the specific conditions under which a story is done. Without them, "done" is ambiguous. With them, testing is clear.

**Story splitting**: large stories (epics) must be split before they enter a sprint. Techniques: by workflow step, by user type, by data variation, by interface simplification.

### Estimation

Story points are relative estimates of complexity and uncertainty, not time. A 3-point story is roughly 3x the effort of a 1-point story; absolute hours are not meaningful.

Planning poker: team members simultaneously reveal their estimates; discuss discrepancies; re-estimate. This surfaces different understandings of scope early.

The key insight: estimation is about reducing uncertainty and surfacing unknowns, not predicting time precisely. If the team disagrees on an estimate, there is a misunderstanding to resolve.`,
    quiz: [
      {
        q: 'The "Definition of Done" in Scrum is:',
        options: [
          'The sprint goal set during planning',
          'An explicit shared checklist of criteria all stories must meet to be considered complete',
          'The list of features in a release',
          'The velocity target for the sprint',
        ],
        correct: 1,
        explanation: 'The Definition of Done (DoD) is a shared contract: code reviewed, tests passing, deployed to staging, documentation updated. Without a DoD, "done" is ambiguous and technical debt accumulates.',
      },
      {
        q: 'WIP limits in Kanban are designed to:',
        options: [
          'Prevent engineers from working on more than one ticket simultaneously for security',
          'Surface bottlenecks by stopping upstream work when a stage is full, forcing focus on completion',
          'Reduce the size of the backlog',
          'Limit the number of engineers on a team',
        ],
        correct: 1,
        explanation: 'WIP limits expose bottlenecks. If Review is always at capacity, the team learns that review capacity is the constraint — and invests there rather than starting more development.',
      },
      {
        q: 'Why is using sprint velocity as a performance target an anti-pattern?',
        options: [
          'Velocity is not a meaningful measure of output',
          'It is a relative estimation tool; optimizing it (inflating story points) destroys its usefulness for capacity planning',
          'Velocity only measures coding speed, not quality',
          'It should only be measured quarterly',
        ],
        correct: 1,
        explanation: 'When velocity becomes a target, teams inflate story points to appear more productive. This destroys its utility as a planning tool. Velocity should be observed, not optimized.',
      },
      {
        q: 'Waterfall is most appropriate when:',
        options: [
          'The team is working on a new consumer product with unknown requirements',
          'Requirements are stable, fully known upfront, and rework is prohibitively expensive',
          'The team wants to deliver frequently and respond to feedback',
          'The project has a large number of unknowns',
        ],
        correct: 1,
        explanation: 'Waterfall assumes requirements are stable and fully knowable. For safety-critical or regulated systems (aerospace, medical devices) where rework is dangerous or costly, the structured documentation gates justify the overhead.',
      },
      {
        q: 'A user story format ("As a [user], I want [capability], so that [benefit]") is valuable because it:',
        options: [
          'Replaces technical specifications',
          'Forces thinking about the user\'s goal and why a feature is needed, not just what to build',
          'Makes estimation easier',
          'Satisfies documentation requirements',
        ],
        correct: 1,
        explanation: 'The user story format keeps the focus on user value. The "so that" clause is the most important part — if you can\'t explain the benefit, the feature\'s value is questionable.',
      },
    ],
  },
  {
    id: 'swe-m09',
    track: 'software-eng' as any,
    title: 'API Design',
    subtitle: 'REST, GraphQL, RPC — designing APIs developers love to use',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 9,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Idempotency', definition: 'An operation is idempotent if applying it multiple times produces the same result as applying it once; critical for retry safety in distributed systems — GET, PUT, and DELETE are idempotent; POST is not by default.' },
      { term: 'API Versioning', definition: 'A strategy for evolving an API without breaking existing clients: URL versioning (/v1/users), header versioning (Accept: application/vnd.api+json;version=1), or query parameter versioning (?version=1).' },
      { term: 'Pagination', definition: 'A technique for returning large collections in manageable pieces: offset-based (page=2&limit=20), cursor-based (after=<token>), or keyset-based (after_id=123). Cursor-based avoids the "missing row" problem of offset pagination.' },
      { term: 'Rate Limiting', definition: 'Restricting how many API calls a client can make in a time window; protects the API from abuse and overload; communicated to clients via X-RateLimit-Remaining and Retry-After headers.' },
      { term: 'Hypermedia (HATEOAS)', definition: 'REST\'s highest maturity level: API responses include links to related resources and available actions; clients discover the API dynamically rather than hardcoding URLs. Used in mature APIs (GitHub, PayPal) but adds complexity.' },
    ],
    content: `## API Design

An API is a product. Its users are developers. Like any product, a good API reduces friction: developers can build what they need without reading long documentation, make mistakes difficult, and guide users toward correct usage through its design.

### REST Principles

REST (Representational State Transfer) is an architectural style, not a protocol. Key constraints:

**Resources, not actions**: REST models state as resources with stable URLs. \`/orders/123\` not \`/getOrderById?id=123\`. Resources are nouns; HTTP verbs express actions.

**HTTP verb semantics**:
- \`GET\`: retrieve; safe (no side effects) and idempotent
- \`POST\`: create or trigger an action; neither safe nor idempotent
- \`PUT\`: replace a resource entirely; idempotent
- \`PATCH\`: partial update; not necessarily idempotent
- \`DELETE\`: remove; idempotent

**Statelessness**: each request contains all information needed to process it. Session state is not stored on the server. This enables horizontal scaling: any server can handle any request.

**Status codes with meaning**:
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request (client error, malformed request), 401 Unauthorized (authentication needed), 403 Forbidden (authenticated but not authorized), 404 Not Found, 409 Conflict (optimistic concurrency violation), 422 Unprocessable Entity (validation errors)
- 500 Internal Server Error (server bug), 503 Service Unavailable (dependency down), 429 Too Many Requests (rate limited)

**Using 200 for everything is wrong**: an error wrapped in a 200 response breaks HTTP-level error handling, caching, and monitoring.

### REST API Design Practices

**Consistent naming**: plural nouns (\`/users\`, \`/orders\`), lowercase, hyphenated (\`/shipping-addresses\`). Consistent across the API.

**Resource hierarchy**: nested paths for truly hierarchical resources (\`/users/123/orders\`) but avoid deep nesting (\`/users/123/orders/456/items/789/discounts\` — start returning a resource directly at an appropriate level with IDs for context).

**Filtering, sorting, pagination**: \`/orders?status=pending&sort=created_at&order=desc&limit=20&cursor=<token>\`.

**Versioning strategy**: URL versioning (\`/v1/users\`) is most visible and explicit. Header versioning is "purer" REST but harder to test and debug. Avoid query parameter versioning (version state in URLs is standard; in query strings it's noise).

**Error responses**: return structured error bodies:
\`\`\`json
{ "error": { "code": "VALIDATION_FAILED", "message": "Email is invalid", "field": "email" } }
\`\`\`
Not just status codes. Clients need enough information to show a useful error message or retry correctly.

### GraphQL

GraphQL (Facebook, 2015) is a query language for APIs and a runtime for executing those queries. Clients request exactly the fields they need.

**Over-fetching and under-fetching**: REST endpoints return fixed shapes. A \`/users/123\` endpoint always returns all user fields even if you only need the name. A \`/users/123\` endpoint might not return the user's recent orders, requiring a second request (N+1 problem). GraphQL solves both: request exactly what you need in one query.

**Type system**: GraphQL schemas are strongly typed. Every field has a type. Tools (GraphiQL, introspection) enable self-documentation and IDE autocompletion.

**Queries vs Mutations**: queries read data; mutations change it. Both return a response. Subscriptions are real-time updates over WebSocket.

**GraphQL trade-offs**:
- Complexity: caching is harder (queries are unique strings), rate limiting is harder (one endpoint, variable cost per query), authorization logic is distributed across resolvers
- N+1 problem in resolvers: loading related entities naively triggers N queries (one per parent). Requires DataLoader (batching and caching)
- Over-fetching to under: mobile clients benefit; internal APIs between services often don't need the flexibility

### gRPC and Protocol Buffers

gRPC is a high-performance RPC framework using HTTP/2 and Protocol Buffer serialization.

**Protocol Buffers**: language-neutral, platform-neutral, binary serialization format. Faster and smaller than JSON. Strongly typed schemas shared between client and server.

**Streaming**: gRPC supports server streaming, client streaming, and bidirectional streaming.

**When gRPC fits**: internal service-to-service communication where performance and type safety matter more than human-readable messages. Not ideal for browser clients (gRPC-web adds friction).

### API Design Principles

**Pit of success**: design the API so the easy path is the correct path. \`createOrder()\` requiring explicit idempotency keys makes safe retries the default. \`deleteUser(userId, {hard: true})\` makes soft delete the default.

**Consistency over cleverness**: the most important property is consistency. If some endpoints return \`{"data": [...], "total": 100}\` and others return \`{"items": [...]}\`, clients need special cases everywhere.

**Progressive disclosure**: simple things should be simple; complex things should be possible. A basic request with sensible defaults; optional parameters for advanced use.

**Design for change**: expect fields to be added. Clients should ignore unknown fields (additive backward compatibility). Removing fields requires versioning.

**Documentation is part of the product**: an API without clear documentation, examples, and error descriptions is incomplete. Tools like OpenAPI/Swagger for REST, GraphQL introspection, and protobuf IDL for gRPC enable auto-generated documentation.`,
    quiz: [
      {
        q: 'An API operation is "idempotent" means:',
        options: [
          'It returns the same response every time',
          'Calling it multiple times has the same effect as calling it once',
          'It can be called without authentication',
          'It uses HTTP GET',
        ],
        correct: 1,
        explanation: 'Idempotency: multiple identical requests produce the same result. DELETE /orders/123 twice leaves the order deleted (not an error on the second call). Idempotent operations are safe to retry.',
      },
      {
        q: 'Returning HTTP 200 OK for an error response (error wrapped in a 200) is a problem because:',
        options: [
          'Clients never check the response body',
          'It breaks HTTP-level error handling, caching, and monitoring — all of which rely on status codes',
          'The HTTP spec does not allow it',
          'It is slower than returning 500',
        ],
        correct: 1,
        explanation: 'HTTP infrastructure (load balancers, CDNs, monitoring tools) uses status codes. A 200 error bypasses error tracking, prevents appropriate caching behavior, and forces clients to parse every body for errors.',
      },
      {
        q: 'GraphQL\'s primary advantage over REST for mobile clients is:',
        options: [
          'It is more secure by default',
          'Clients request exactly the fields they need, eliminating over-fetching and reducing over-the-wire data',
          'It uses binary serialization',
          'It has a built-in caching layer',
        ],
        correct: 1,
        explanation: 'REST endpoints return fixed shapes — often more data than needed. GraphQL lets clients specify exactly which fields they need, reducing payload size, especially valuable for mobile on limited bandwidth.',
      },
      {
        q: 'Cursor-based pagination is preferred over offset-based pagination because:',
        options: [
          'It is simpler to implement',
          'Offset pagination has the "missing row" problem — if rows are inserted or deleted between pages, rows shift, causing missed or duplicated items',
          'Cursor pagination is more widely supported',
          'Offset pagination does not work with SQL databases',
        ],
        correct: 1,
        explanation: 'Offset pagination: page 2 is rows 21-40. If row 15 is deleted between page 1 and page 2 requests, every row shifts — row 21 becomes the new row 20, and you miss one row. Cursor pagination uses stable anchors.',
      },
      {
        q: 'The gRPC framework is most appropriate for:',
        options: [
          'Public-facing APIs consumed by web browsers',
          'Internal service-to-service communication where performance and type safety are priorities',
          'GraphQL subscriptions',
          'REST API versioning',
        ],
        correct: 1,
        explanation: 'gRPC uses binary Protocol Buffers and HTTP/2 — fast and efficient for internal microservice communication. For browser clients, gRPC-web adds friction; REST or GraphQL is typically better for public APIs.',
      },
    ],
  },
  {
    id: 'swe-m10',
    track: 'software-eng' as any,
    title: 'Security in Software Development',
    subtitle: 'Threat modeling, OWASP Top 10, secure coding — building security in, not bolting it on',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 10,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Threat Modeling', definition: 'A structured analysis of a system to identify what could go wrong (threats), who might cause it (adversaries), and what controls mitigate the risk; typically expressed as STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege).' },
      { term: 'SQL Injection', definition: 'An attack where user input is concatenated directly into a SQL query, allowing the attacker to modify the query\'s logic — exfiltrate data, modify records, or drop tables; prevented by parameterized queries (prepared statements).' },
      { term: 'Cross-Site Scripting (XSS)', definition: 'An attack where malicious scripts are injected into web pages viewed by other users; stored XSS persists in the database; reflected XSS bounces off the server; DOM-based XSS manipulates the client; prevented by output encoding and Content Security Policy.' },
      { term: 'Principle of Least Privilege', definition: 'Every component, user, and service should have the minimum access rights needed to perform its function; limits the blast radius of a compromise.' },
      { term: 'OWASP Top 10', definition: 'The Open Web Application Security Project\'s ranked list of the most critical web application security risks, updated periodically; the de facto standard for web security education and compliance requirements.' },
    ],
    content: `## Security in Software Development

Security cannot be bolted on after the fact. An application built without security considerations has structural vulnerabilities that are expensive to fix — if fixable at all — once the system is in production. Secure software development integrates security at every stage: design, implementation, testing, and deployment.

### Threat Modeling

Threat modeling asks: what could go wrong? Before writing code for a new feature, consider:

**STRIDE** (Microsoft's threat categorization):
- **Spoofing**: impersonating another user or service
- **Tampering**: modifying data or code without authorization
- **Repudiation**: denying actions that occurred (no audit trail)
- **Information Disclosure**: exposing private data to unauthorized parties
- **Denial of Service**: making a service unavailable
- **Elevation of Privilege**: gaining more access than intended

The process: draw a data flow diagram (components, data stores, external actors, data flows). For each flow and component, enumerate STRIDE threats. For each threat, determine a mitigation: authentication, input validation, audit logging, rate limiting, least privilege.

### OWASP Top 10

The OWASP Top 10 represents the most common and impactful web security risks:

**1. Broken Access Control**: users access resources they should not (IDOR — Insecure Direct Object Reference, vertical/horizontal privilege escalation). Enforce authorization checks on every request. Never trust client-supplied IDs as authorization tokens.

**2. Cryptographic Failures**: sensitive data (passwords, credit cards, health records) exposed due to weak encryption, missing encryption, or misused cryptography. Encrypt data in transit (TLS everywhere) and at rest. Never roll your own crypto. Use bcrypt/Argon2 for passwords — never MD5 or SHA1.

**3. Injection** (SQL, NoSQL, OS command, LDAP): user input injected into commands or queries. Use parameterized queries. Never concatenate user input into SQL. Validate and sanitize all input.

**4. Insecure Design**: security requirements not considered during design. Threat model. Defense in depth. Assume breach. Secure defaults.

**5. Security Misconfiguration**: default credentials left unchanged, unnecessary features enabled, debug logging in production, verbose error messages exposing stack traces. Principle of least privilege in infrastructure. Disable what you don't need.

**6. Vulnerable and Outdated Components**: dependencies with known CVEs. Automated dependency scanning (Dependabot, Snyk). Keep dependencies updated.

**7. Authentication Failures**: weak passwords allowed, no multi-factor, session IDs exposed in URLs, sessions not invalidated after logout. Use proven authentication libraries. Implement MFA. Short session timeouts for sensitive operations.

**8. Software and Data Integrity Failures**: code or data pipeline integrity not verified; use code signing, artifact hashing, and verified build processes.

**9. Logging and Monitoring Failures**: attacks undetected due to insufficient logging. Log security events: authentication attempts, access control failures, input validation failures. Alert on anomalies. Retain logs for forensics.

**10. Server-Side Request Forgery (SSRF)**: attacker tricks the server into making requests to internal services. Validate and restrict which URLs the server will request; use allowlists.

### Secure Coding Practices

**Input validation**: validate all input at system boundaries. Length, type, format, and range. Reject, don't sanitize, malicious input where possible. Validation happens server-side — client-side validation is UX, not security.

**Output encoding**: encode output according to context. HTML encoding prevents XSS in HTML contexts. URL encoding prevents injection in URLs. SQL parameterization prevents SQL injection. JSON serialization prevents JSON injection. The context determines the encoding.

**SQL injection prevention**: always use parameterized queries or ORM methods that handle parameterization:
\`\`\`sql
-- WRONG: vulnerable to injection
SELECT * FROM users WHERE email = '\${userInput}'

-- CORRECT: parameterized
SELECT * FROM users WHERE email = $1  -- (with userInput as the $1 parameter)
\`\`\`

**XSS prevention**: encode all user-generated content rendered in HTML. Use Content Security Policy (CSP) headers. React and most modern frameworks auto-encode; be cautious with \`dangerouslySetInnerHTML\`.

**Authentication and Session Management**: use established libraries. HTTPS everywhere. HttpOnly cookies (prevent JavaScript access). Secure flag (HTTPS only). SameSite=Lax (CSRF protection). Short expiry for sensitive tokens.

**Secrets management**: never hardcode secrets. Never commit secrets to version control. Use environment variables (with a secret store for production). Rotate secrets. Audit secret access.

### Defense in Depth

No single security control is sufficient. Defense in depth layers controls:
- Network layer: firewall rules, VPC, WAF
- Application layer: authentication, authorization, input validation
- Data layer: encryption at rest, column-level encryption for sensitive data, row-level security
- Infrastructure: minimal IAM permissions, immutable infrastructure, audit logs

When one layer fails, others limit the damage.

### Shift Left Security

"Shift left" means integrating security earlier in the development lifecycle:
- **Design**: threat modeling
- **Code**: static analysis (SAST — Static Application Security Testing), secure coding guidelines
- **Build**: dependency scanning (SCA — Software Composition Analysis), secret scanning
- **Test**: dynamic analysis (DAST), penetration testing
- **Deploy**: infrastructure security scanning, runtime protection (RASP)

The cost of fixing a vulnerability found during design is 1x. Found during implementation: 10x. Found in production: 100x.`,
    quiz: [
      {
        q: 'Parameterized queries prevent SQL injection because:',
        options: [
          'They limit the length of user input',
          'The database treats user input as data, not as part of the query structure — no matter what characters it contains',
          'They encrypt the query before sending it to the database',
          'They validate that input is a valid SQL type',
        ],
        correct: 1,
        explanation: 'In parameterized queries, user input is bound as a typed parameter separate from the query text. The database never interprets user input as SQL — it\'s always treated as a literal value.',
      },
      {
        q: 'STRIDE in threat modeling stands for:',
        options: [
          'Scan, Test, Review, Implement, Deploy, Evaluate',
          'Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege',
          'Security, Trust, Resilience, Identity, Detection, Enforcement',
          'Structured Threat Risk Identification and Defense Engineering',
        ],
        correct: 1,
        explanation: 'STRIDE categorizes threats: Spoofing (impersonation), Tampering (data modification), Repudiation (no audit trail), Information Disclosure (data leakage), DoS (availability), Elevation of Privilege (unauthorized access).',
      },
      {
        q: 'Why should passwords be hashed with bcrypt or Argon2 rather than SHA-256?',
        options: [
          'SHA-256 is not supported by most databases',
          'bcrypt and Argon2 are intentionally slow and include a salt, making brute-force and rainbow-table attacks impractical',
          'SHA-256 cannot hash strings, only binary data',
          'bcrypt is more widely standardized than SHA-256',
        ],
        correct: 1,
        explanation: 'SHA-256 is a general-purpose, fast hash — a GPU can compute billions per second. bcrypt/Argon2 are slow by design (configurable work factor) and include random salts, making mass cracking infeasible.',
      },
      {
        q: 'The Principle of Least Privilege applied to a database service account means:',
        options: [
          'The service account should use the root database user for simplicity',
          'The service account should have only the SELECT/INSERT/UPDATE permissions it actually uses, never DROP or admin rights',
          'The service account password should be rotated monthly',
          'The service account should only connect from the production server\'s IP',
        ],
        correct: 1,
        explanation: 'Least privilege limits blast radius: if the service is compromised, the attacker has only the permissions the service account has. A read-only service account with SELECT permission cannot drop tables or modify sensitive data.',
      },
      {
        q: 'Content Security Policy (CSP) headers primarily protect against:',
        options: [
          'SQL injection by restricting database queries',
          'Cross-Site Scripting (XSS) by controlling which scripts can execute on the page',
          'DDoS attacks by limiting request rates',
          'CSRF by verifying request origins',
        ],
        correct: 1,
        explanation: 'CSP lets a site declare which script sources are trusted. Even if an attacker injects a script tag, the browser will refuse to execute it if it doesn\'t match the CSP policy. A strong CSP is a critical XSS mitigation.',
      },
    ],
  },
  {
    id: 'swe-m11',
    track: 'software-eng' as any,
    title: 'Documentation & Engineering Communication',
    subtitle: 'Writing docs people read, ADRs, technical specs, and the RFC process',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 11,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Architecture Decision Record (ADR)', definition: 'A document capturing a significant architectural decision: its context, the decision made, the alternatives considered, and the consequences; preserves institutional knowledge about why the system is built the way it is.' },
      { term: 'RFC (Request for Comments)', definition: 'A lightweight proposal document circulated for team feedback before a significant change is implemented; originated at IETF, adopted by engineering teams (Rust, React, Ember) as a structured way to make design decisions collaboratively.' },
      { term: 'README-Driven Development', definition: 'Writing the README before writing the code — forces clarity about the interface, assumptions, and goals before implementation details constrain thinking.' },
      { term: 'Runbook', definition: 'A step-by-step procedure for operating, monitoring, or troubleshooting a system; used by on-call engineers responding to incidents; should be executable without expert knowledge.' },
      { term: 'Docs as Code', definition: 'Treating documentation with the same rigor as code: stored in version control, reviewed via pull requests, tested for accuracy, and deployed automatically; prevents documentation drift from code.' },
    ],
    content: `## Documentation & Engineering Communication

Documentation is the memory of a software system. When it's absent, knowledge lives only in the heads of the engineers who built it — and walks out the door with them. When it's present and maintained, it enables onboarding, correct usage, safe operation, and informed evolution.

### What Documentation Actually Gets Read

Most documentation doesn't get read because it doesn't answer the question the reader has in the moment they have it. Effective documentation:

**API/library documentation**: readers want to know how to use the thing, not how it was built. Show examples first. Put common use cases at the top. Detailed parameters tables last.

**README files**: should answer in order: (1) what is this, (2) who is it for, (3) how do I install/run it, (4) how do I do the most common thing, (5) how do I get more help. Stop there for most projects.

**Architecture documentation**: readers are making decisions about the system. They need to understand structure, tradeoffs made, and constraints. Data flow diagrams and component diagrams beat prose.

**Runbooks**: readers are in an incident. They need step-by-step procedures that can be executed without expert knowledge. Numbered steps. Clear pass/fail conditions. Links to dashboards.

### Architecture Decision Records (ADRs)

An ADR captures a significant architectural decision that would otherwise be lost to history. Six months later, when someone asks "why is this in Postgres instead of MongoDB?", the ADR is the answer.

**ADR format** (Michael Nygard):
- **Title**: "Use PostgreSQL for the orders service"
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: the problem situation and forces that led to this decision
- **Decision**: what was decided
- **Consequences**: positive and negative outcomes of this decision
- **Alternatives considered**: why they were rejected

ADRs live in the repository (\`docs/adr/\` or \`adr/\`) alongside the code they document. They use sequential numbering (ADR-001, ADR-002) and are never deleted — deprecated ADRs are marked as Superseded with a pointer to the new decision.

**When to write an ADR**: for decisions that are hard to reverse, that affect multiple teams, or where understanding the reasoning matters as much as the decision itself.

### RFC Process

RFCs (Requests for Comments) are proposals for significant changes. Rather than one engineer making a unilateral decision and submitting code, an RFC documents the proposal, opens it for feedback, and records the resulting decision.

**RFC structure**:
- **Summary**: one paragraph of what this proposes
- **Motivation**: the problem being solved and why it matters
- **Detailed design**: how the proposal works in detail
- **Drawbacks**: honest discussion of downsides
- **Alternatives**: what else was considered and why this approach was chosen
- **Unresolved questions**: what's not decided yet

**RFC lifecycle**:
1. Author writes RFC and opens a pull request
2. Team reviews and comments (typically 1-2 weeks)
3. RFC is either accepted (merged), revised (updated based on feedback), or rejected (closed)
4. Accepted RFC becomes a binding commitment; implementation follows

Companies that have scaled RFC processes well: Rust, React, Ember, Figma, Stripe. The value: decisions are documented, dissent is surfaced before implementation, and authors have thought through edge cases.

### Technical Writing Principles

**Audience first**: every piece of documentation has an audience. Who are they, what do they already know, and what question are they trying to answer? Write for them, not for yourself.

**One topic per document**: mixing installation, concepts, and API reference in one document forces readers to hunt. Separation by purpose (tutorials, how-tos, explanations, references) is the Diátaxis framework.

**Active voice**: "The system processes the request" is clearer than "The request is processed by the system."

**Examples over explanations**: show before you tell. One concrete example communicates more than three paragraphs of abstract description.

**Maintain or remove**: stale documentation is worse than no documentation — it actively misleads. Documentation must be updated with the code it documents, or deleted.

### Docs as Code

Treating documentation as code means:
- Store docs in the same repository as the code (or a linked one)
- Review documentation changes through the same PR process as code
- Automated checks: link checking, spell checking, API doc generation from code annotations
- Deployment via CI/CD: docs build and publish automatically when merged

This prevents the drift where code changes but documentation doesn't. The PR that changes an API should also change the documentation — they're reviewed together.

**Documentation generators**: JSDoc/TSDoc for JavaScript/TypeScript, Sphinx for Python, Javadoc for Java, Rustdoc for Rust. These extract documentation from code comments and generate reference documentation automatically.

### Incident Communication

Engineering communication extends to incident management. During an incident:

**Status page updates**: brief, factual, in plain language. "We are investigating elevated error rates on the checkout API" not "Our infrastructure team is actively engaged in root-cause analysis of anomalous behavior patterns."

**Internal incident channels**: use a structured format. Declare severity. Assign roles (Incident Commander, Communications Lead). Regular updates (every 15-30 minutes). Clear "all clear" message.

**Post-mortems (blameless)**: document what happened, when, how it was detected, how it was resolved, contributing factors, and action items. The purpose is learning, not blame. "The engineer deleted the wrong database" is not the root cause — "we had no confirmation step before a destructive operation on a production database" is.`,
    quiz: [
      {
        q: 'An Architecture Decision Record (ADR) is most valuable for:',
        options: [
          'Documenting all code changes in a sprint',
          'Capturing the context, decision, and reasoning behind significant architectural choices so future engineers understand why the system is built this way',
          'Tracking security vulnerabilities',
          'Recording sprint retrospective action items',
        ],
        correct: 1,
        explanation: 'ADRs preserve institutional memory. "Why PostgreSQL and not MongoDB?" is answered by an ADR. Without it, the knowledge walks out the door when the original engineers leave.',
      },
      {
        q: 'The RFC process (Request for Comments) improves decision quality because:',
        options: [
          'It requires management approval for all technical decisions',
          'It surfaces dissent and edge cases before implementation, and documents the decision and reasoning for posterity',
          'It slows down engineering to prevent mistakes',
          'It delegates decisions to the most senior engineer',
        ],
        correct: 1,
        explanation: 'RFC: proposal → team review → decision. This surfaces objections and edge cases before implementation costs mount. The resulting document also serves as the ADR for the decision.',
      },
      {
        q: 'Stale documentation (describing behavior that no longer exists) is:',
        options: [
          'Acceptable because at least something is documented',
          'Worse than no documentation — it actively misleads readers into incorrect assumptions',
          'Only a problem for external APIs',
          'Fixed automatically by good IDEs',
        ],
        correct: 1,
        explanation: 'Stale docs actively harm: a developer following incorrect documentation writes code that doesn\'t work, then spends hours debugging before discovering the doc is wrong. Missing docs leave a gap; wrong docs create false confidence.',
      },
      {
        q: 'Docs-as-Code means:',
        options: [
          'All documentation is written in code comments only',
          'Documentation is stored in version control, reviewed via PRs, and deployed automatically — treated with the same rigor as code',
          'Documentation is generated entirely from code without human writing',
          'Code should be self-documenting and require no separate docs',
        ],
        correct: 1,
        explanation: 'Docs-as-Code: documentation lives in version control, changes are reviewed alongside code changes in PRs, and documentation is automatically built and deployed. This prevents drift between code and docs.',
      },
      {
        q: 'A blameless post-mortem focuses on:',
        options: [
          'Identifying which engineer made the mistake so they can be retrained',
          'Finding systemic contributing factors and process improvements — treating incidents as learning opportunities, not occasions for blame',
          'Documenting exactly who was responsible for each decision',
          'Comparing the incident to SLA commitments',
        ],
        correct: 1,
        explanation: 'Blameless post-mortems: "an engineer deleted the database" is not the root cause. "No confirmation step existed for destructive operations in production" is. Systems and processes are analyzed, not individuals.',
      },
    ],
  },
  {
    id: 'swe-m12',
    track: 'software-eng' as any,
    title: 'Engineering Culture & Career',
    subtitle: 'Staff engineer, tech lead, and engineering manager paths — navigating growth',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 12,
    certArea: 'Software Engineering Discipline',
    keyTerms: [
      { term: 'Staff Engineer', definition: 'A senior individual contributor role above Senior Engineer; focuses on technical strategy, cross-team influence, and solving problems with organization-wide impact without taking on direct people management.' },
      { term: 'Tech Lead', definition: 'A senior engineer responsible for the technical direction of a team; owns architecture decisions, code quality, and mentoring; often still an individual contributor while influencing a team\'s technical output.' },
      { term: 'Glue Work', definition: 'The invisible work that holds teams together — documentation, onboarding, process improvement, meeting facilitation, cross-team coordination; often done by women and underrepresented engineers; not always recognized in performance reviews.' },
      { term: 'Technical Breadth vs Depth', definition: 'Staff engineers need breadth (understanding many systems and technologies) more than pure depth; depth matters for principal/distinguished levels where narrow mastery drives organizational strategy.' },
      { term: '1:1 Meeting', definition: 'A regular private meeting between a manager and report; the report\'s agenda — used to discuss career growth, feedback, blockers, and context not appropriate for team meetings. Not a status update.' },
    ],
    content: `## Engineering Culture & Career

Engineering is a craft and a profession, and career growth in it is neither linear nor automatic. Understanding the career ladder, the different paths available, and the practices that distinguish engineers who grow from those who stagnate is essential knowledge that most engineers learn too late.

### The Engineering Ladder

Most engineering career ladders look like:
- **Junior Engineer**: executing assigned tasks with guidance; learning the codebase, tools, and practices
- **Engineer (Mid)**: working independently on well-defined problems; contributing to design discussions
- **Senior Engineer**: independently driving work that spans multiple components; mentoring junior engineers; making scope-appropriate design decisions
- **Staff Engineer**: technical direction at the team or multi-team level; solving ambiguous, cross-team problems; organizational influence
- **Principal/Distinguished Engineer**: company-level technical direction; setting the technical strategy for a business domain; recognized externally

The key insight: each level requires a broader radius of impact. Junior engineers impact their own code. Senior engineers impact their team's code. Staff engineers impact multiple teams. Principal engineers impact the company or industry.

### Individual Contributor vs Management Paths

Around the Senior level, engineers choose:

**Management path** (Engineering Manager): hiring, performance management, career development for reports, organizational health. Stops writing code regularly (usually). Multiplies output through people.

**IC (Individual Contributor) path** (Staff → Principal → Distinguished): technical leadership, architecture, engineering strategy. Multiplies output through technical influence and high-leverage technical work.

Neither is inherently superior. A great Staff Engineer has 10x leverage on team output through architecture decisions and mentorship. A great Engineering Manager has 10x leverage on team output through hiring, culture, and removing organizational friction.

A common mistake: great engineers get promoted to management because they were great engineers. Management requires entirely different skills: coaching, conflict resolution, ambiguity tolerance, political navigation. Good at coding ≠ good at managing.

### What Gets Engineers Promoted

**Junior → Mid**: demonstrates reliability; delivers assigned work without supervision; code passes review without major issues; asks good questions.

**Mid → Senior**: owns problems end-to-end (writes the code, tests, deploys, monitors); makes technical decisions others follow; identifies issues before they become crises; mentors more junior engineers effectively.

**Senior → Staff**: the "senior engineer" promotion often happens by continuing to do more of the same, better. The Staff promotion requires demonstrating impact at a larger scope: influencing architecture decisions that affect multiple teams, solving problems that others couldn't frame, being a technical resource across the organization.

**Common failure mode**: high-performing Senior Engineers who optimize for local technical excellence without developing organizational influence. Being the best coder on the team is not sufficient for Staff — influence, communication, and cross-team impact are required.

### Glue Work and Visibility

Tanya Reilly's "Being Glue" describes the invisible work that holds engineering teams together: writing documentation, onboarding new engineers, improving processes, coordinating between teams, running post-mortems.

This work is essential but often invisible to performance reviewers. Engineers — particularly underrepresented engineers who are socialized to take on supporting roles — can spend 40% of their time on glue work and receive "needs more technical impact" in their performance review.

The solution: make glue work visible. Describe its impact explicitly in reviews ("I documented the payment module's architecture, reducing onboarding time for three new engineers"). Ensure the manager knows the context. Negotiate with your manager about how much glue work is appropriate versus individually technical work.

### Feedback and Performance Reviews

**Giving feedback**: the SBI framework — Situation (specific situation), Behavior (what happened), Impact (the effect). "In the sprint review last Tuesday [S], you interrupted Alice three times while she was presenting [B], which made her unable to finish her point and left the audience confused [I]."

**Receiving feedback**: resist the defensive reaction. Separate the message from the delivery. "Thank you for telling me" is the correct response even if the feedback stings. Ask clarifying questions. Decide whether to act on it.

**Performance reviews**: document your impact throughout the year. Don't leave it to memory at review time. Maintain a "brag document" — a running list of accomplishments, impact statements, and feedback received. Reviews favor those with clear, specific impact over those with vague impressions of being "a good team player."

### Engineering Culture Principles

**Psychological safety** (Amy Edmondson): the shared belief that the team is safe to take interpersonal risks — ask questions, admit mistakes, propose ideas — without fear of punishment or humiliation. Teams with high psychological safety innovate more, learn faster from failures, and retain members longer.

**Disagree and commit**: healthy teams can have strong disagreements, reach a decision, and then fully commit to that decision even if you were on the losing side. Publicly relitigating closed decisions after commitment undermines team coordination.

**Learning from failure**: high-performing engineering teams treat failures as learning opportunities. Blameless post-mortems, safe-to-fail experiments, and normalization of "I don't know" create environments where people take intelligent risks rather than optimizing for safety.

**Craft and mastery**: engineering is a craft that rewards deliberate practice. The best engineers read code (open source, colleagues' code), write code outside of work (side projects, contributions), study systems they use (database internals, networking), and teach (writing, talks, mentorship). Mastery is pursued, not acquired incidentally.

### Managing Up

Every engineer, regardless of level, has a manager. Managing up — communicating effectively upward in the organization — is a professional skill:

**Give your manager no surprises**: if a project is off track, tell your manager early. Managers hate surprises at deadline. Early warning enables course correction.

**Understand their concerns**: your manager has stakeholders too. Understanding their pressures helps you frame your work in terms that matter to them.

**Ask for what you need**: blocked on a dependency? Tell your manager and ask them to unblock it. Need clarity on priorities? Ask explicitly. Managers cannot help with what they don't know about.

**Own your career**: no one is going to manage your career for you. Know what you want to learn, what work would get you to the next level, and what gaps you have. Bring this to your 1:1s; your manager can help only if you're clear about what you want.`,
    quiz: [
      {
        q: 'The key difference between Senior Engineer and Staff Engineer scope is:',
        options: [
          'Staff engineers write more complex code',
          'Staff engineers impact multiple teams or the organization; Senior engineers primarily impact their own team',
          'Staff engineers no longer write code',
          'Staff engineers manage other engineers',
        ],
        correct: 1,
        explanation: 'Each level in the engineering ladder requires broader impact radius. Senior: team level. Staff: multi-team or organizational level. The work is less about individual code quality and more about technical direction, influence, and solving ambiguous cross-team problems.',
      },
      {
        q: '"Glue work" in engineering teams refers to:',
        options: [
          'Code that holds different systems together through APIs',
          'Invisible organizational work (documentation, onboarding, process improvement, coordination) that is essential but often not recognized in performance reviews',
          'Technical debt that prevents teams from shipping',
          'Infrastructure and DevOps work',
        ],
        correct: 1,
        explanation: 'Glue work: the invisible work that keeps teams functional. Essential — but not always rewarded in performance reviews. Engineers should make this work visible and explicit, documenting its impact.',
      },
      {
        q: 'Psychological safety in an engineering team means:',
        options: [
          'The codebase has no security vulnerabilities',
          'Team members feel safe to ask questions, admit mistakes, and propose ideas without fear of punishment or humiliation',
          'The team\'s infrastructure is highly available',
          'Engineers can work from home without surveillance',
        ],
        correct: 1,
        explanation: 'Amy Edmondson\'s research: psychologically safe teams innovate more, learn faster from failures, and retain members longer. It\'s the foundation for honest communication, productive disagreement, and learning from failure.',
      },
      {
        q: '"Disagree and commit" in engineering culture means:',
        options: [
          'Engineers should disagree with managers to show independent thinking',
          'Teams can have strong disagreements, reach a decision through the process, then fully commit to that decision even if you were on the losing side',
          'Commit your code even if you disagree with the design',
          'Document your disagreements in code comments',
        ],
        correct: 1,
        explanation: 'Disagree and commit: healthy disagreement BEFORE the decision, then unified execution AFTER. Publicly relitigating closed decisions undermines coordination. Amazon codified this in their leadership principles.',
      },
      {
        q: 'The SBI framework for giving feedback stands for:',
        options: [
          'Specific, Balanced, Immediate',
          'Situation, Behavior, Impact — anchoring feedback in observable specifics rather than character judgments',
          'Summary, Background, Insight',
          'Strengths, Blockers, Improvements',
        ],
        correct: 1,
        explanation: 'SBI: "In the sprint review [Situation], you interrupted Alice [Behavior], which prevented her point from landing [Impact]." This is specific, factual, and actionable — unlike "you need to improve your communication skills."',
      },
    ],
  },
]
