import type { Course } from '../courses'

export const csfCourses: Course[] = [
  {
    id: 'csf-m01',
    track: 'cs-foundations' as any,
    title: 'Algorithms & Data Structures',
    subtitle: 'The science of organizing and transforming information efficiently',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Time Complexity', definition: 'A measure of how the runtime of an algorithm grows relative to input size, expressed in Big O notation (e.g., O(n log n) for merge sort).' },
      { term: 'Space Complexity', definition: 'The amount of memory an algorithm uses as a function of input size, including both auxiliary space and input storage.' },
      { term: 'Amortized Analysis', definition: 'A method of averaging the cost of operations over a sequence, useful when occasional expensive operations are offset by many cheap ones (e.g., dynamic array resizing).' },
      { term: 'Hash Collision', definition: 'When two distinct keys map to the same hash table bucket; resolved via chaining (linked lists per bucket) or open addressing (probing adjacent slots).' },
      { term: 'Tree Traversal', definition: 'Systematic visiting of all nodes in a tree — in-order (left, root, right), pre-order (root, left, right), or post-order (left, right, root) — each suited to different tasks.' },
    ],
    content: `## Algorithms & Data Structures

At the core of every system that processes information is a set of decisions about *how* that information is stored and *what operations* are performed on it. Algorithms and data structures are not academic abstractions — they are the difference between a feature that runs in milliseconds and one that crashes under load.

### Why Complexity Analysis Matters

Every algorithm has a cost. Big O notation describes how that cost scales. An O(n²) algorithm on a list of 1,000 items takes one million operations. Scale to one million items and you're at one trillion — a browser tab, not a web service. Understanding this shapes every architectural choice.

The key classes:
- **O(1)** — constant time: hash table lookup, array index access
- **O(log n)** — logarithmic: binary search, balanced BST operations
- **O(n)** — linear: single-pass array scan, linked list traversal
- **O(n log n)** — log-linear: merge sort, heap sort, efficient comparison-based sorting
- **O(n²)** — quadratic: naive nested loops, bubble sort on unsorted data

### Foundational Data Structures

**Arrays** provide O(1) random access by index because elements are contiguous in memory. Insertion and deletion at arbitrary positions cost O(n) due to shifting. Dynamic arrays (like JavaScript arrays or Python lists) amortize the cost of resizing by doubling capacity, achieving O(1) amortized append.

**Linked Lists** trade random access for O(1) insertions and deletions at the head. Each node stores a value and a pointer to the next node. Doubly-linked lists add a back-pointer, enabling O(1) deletion anywhere if you already hold the node reference. They underpin queues, LRU caches, and adjacency lists.

**Hash Tables** achieve average O(1) insert, lookup, and delete by applying a hash function to keys, mapping them to array buckets. The challenge is collision handling. Separate chaining stores a linked list per bucket. Open addressing probes for the next available slot. A good hash function and load factor (ratio of entries to buckets, typically kept below 0.75) keep performance predictable.

**Trees** encode hierarchical relationships. A Binary Search Tree (BST) maintains the invariant that left children are smaller and right children are larger, enabling O(log n) search in balanced cases. Self-balancing trees (AVL, Red-Black) enforce balance through rotations, guaranteeing O(log n) worst case. Heaps are complete binary trees satisfying the heap property — max-heap: every parent ≥ its children — supporting O(1) max access and O(log n) insert/extract, making them ideal for priority queues.

**Graphs** are the most general structure: a set of vertices connected by edges, directed or undirected, weighted or unweighted. They model networks, dependencies, and state spaces. Represented as adjacency matrices (O(V²) space, O(1) edge lookup) or adjacency lists (O(V+E) space, efficient for sparse graphs).

### Sorting Algorithms

**Merge Sort** divides the array in half recursively, sorts each half, then merges — O(n log n) guaranteed, stable, but requires O(n) auxiliary space.

**Quick Sort** picks a pivot, partitions around it, and recurses — O(n log n) average, O(1) extra space, but O(n²) worst case on already-sorted data (mitigated by randomized pivot selection).

**Heap Sort** builds a max-heap then repeatedly extracts the maximum — O(n log n) worst case, O(1) space, but poor cache performance due to non-sequential memory access.

For small arrays (n < ~20), **Insertion Sort** outperforms them all in practice due to low overhead and cache-friendly access.

### Graph Traversal

**Breadth-First Search (BFS)** explores layer by layer using a queue, finding shortest paths in unweighted graphs. **Depth-First Search (DFS)** uses a stack (or recursion) to explore as deep as possible before backtracking — used for cycle detection, topological sorting, and connected components.

**Dijkstra's algorithm** extends BFS to weighted graphs, using a priority queue to always process the closest unvisited vertex — O((V + E) log V).

### Applying This Knowledge

When building software, the question is not "which algorithm is fastest in theory" but "what are the access patterns?" A read-heavy system with few writes suits hash tables. Ordered range queries suit B-trees (used in every SQL database). Processing items in priority order suits heaps. Representing relationships suits graphs.

Profiling reveals where time is actually spent. Complexity analysis tells you whether optimization is linear — meaning faster hardware helps — or algorithmic, meaning a 1000x input size means 1,000,000x work.`,
    quiz: [
      {
        q: 'A function loops through an array of n items, and for each item, performs a binary search on the same array. What is the time complexity?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correct: 1,
        explanation: 'Binary search is O(log n). Doing it n times gives O(n log n). The outer loop contributes the n factor.',
      },
      {
        q: 'Which data structure offers O(1) average-case lookup by key?',
        options: ['Balanced BST', 'Sorted array', 'Hash table', 'Linked list'],
        correct: 2,
        explanation: 'Hash tables use a hash function to map keys to indices, achieving O(1) average lookup. BSTs achieve O(log n).',
      },
      {
        q: 'What is the space complexity of merge sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct: 2,
        explanation: 'Merge sort requires O(n) auxiliary space to hold the merged result during the combine phase.',
      },
      {
        q: 'Which traversal of a BST produces nodes in sorted (ascending) order?',
        options: ['Pre-order', 'Post-order', 'In-order', 'Level-order (BFS)'],
        correct: 2,
        explanation: 'In-order traversal visits left subtree, then root, then right subtree — which for a BST yields ascending order.',
      },
      {
        q: 'A dynamic array doubles its capacity when full. What is the amortized cost per insertion?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correct: 3,
        explanation: 'Doubling means each element is copied at most a constant number of times over its lifetime, amortizing the resize cost to O(1) per insertion.',
      },
    ],
  },
  {
    id: 'csf-m02',
    track: 'cs-foundations' as any,
    title: 'Programming Paradigms',
    subtitle: 'OOP, functional, declarative — the mental models behind how code is written',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 2,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'First-Class Functions', definition: 'Functions treated as values — they can be stored in variables, passed as arguments, and returned from other functions, enabling higher-order programming.' },
      { term: 'Immutability', definition: 'The property of data that cannot be changed after creation; instead, operations return new data. Eliminates a class of bugs caused by shared mutable state.' },
      { term: 'Polymorphism', definition: 'The ability of different types to be treated uniformly through a shared interface; includes subtype polymorphism (inheritance), parametric polymorphism (generics), and ad-hoc polymorphism (overloading).' },
      { term: 'Pure Function', definition: 'A function with no side effects that returns the same output for the same input; enables memoization, parallelism, and easier testing.' },
      { term: 'Closure', definition: 'A function bundled with its lexical environment — it "closes over" variables from the enclosing scope, which persist even after the outer function has returned.' },
    ],
    content: `## Programming Paradigms

A paradigm is a mental model for structuring computation. The language you use constrains — but does not fully determine — which paradigm you employ. Understanding paradigms lets you write better code in any language and choose the right tool for each problem.

### Imperative Programming

Imperative code describes *how* to do something: a sequence of statements that modify state. You loop, assign, branch. Assembly is purely imperative. C is largely imperative. Most JavaScript written by beginners is imperative.

The strength of imperative style is directness — the code closely mirrors what the CPU actually does. The weakness is that explicit state mutation creates complexity that grows non-linearly with program size. Tracking which variable holds what value at which point becomes the dominant cognitive load.

### Object-Oriented Programming (OOP)

OOP organizes code around objects — encapsulated bundles of state and behavior. The four pillars:

**Encapsulation** hides internal state behind a public interface. Objects expose methods, not raw fields. This localizes the impact of implementation changes.

**Inheritance** allows a class to extend another, inheriting its methods and properties. This enables code reuse but creates tight coupling. Favor composition over inheritance is a well-earned maxim: a Car *has* an Engine is often cleaner than Car *is* a Vehicle when the hierarchy becomes deep.

**Polymorphism** lets code work with any object satisfying an interface, regardless of concrete type. You write a function accepting a \`Drawable\` — it works for circles, squares, or custom shapes. In statically typed languages, interfaces and generics formalize this. In dynamically typed languages, duck typing achieves the same result implicitly.

**Abstraction** is exposing essential features while hiding implementation detail. A List exposes append, remove, contains — not its internal array or linked list mechanics.

OOP is dominant in enterprise software because it models domains naturally (customers, orders, payments) and supports large teams working on separate classes. Its failure modes are deep inheritance hierarchies, god objects with too many responsibilities, and overengineered abstractions.

### Functional Programming (FP)

Functional programming treats computation as the evaluation of mathematical functions. Its core principles:

**Immutability**: data structures are never modified after creation. Instead of mutating an array, you create a new one. This eliminates a huge class of bugs — race conditions, aliasing bugs, and unexpected side effects — at the cost of some performance (mitigated by structural sharing).

**Pure functions**: a function given the same inputs always returns the same output and has no observable side effects (no network calls, no mutations, no I/O). Pure functions are trivially testable, memoizable, and parallelizable.

**Higher-order functions**: functions that accept functions as arguments or return functions. map, filter, reduce are the canonical examples. Composition — chaining functions together — replaces loops.

**Referential transparency**: any expression can be replaced by its value without changing program behavior. This enables powerful compiler optimizations and equational reasoning about code.

Languages like Haskell and Elm enforce purity. JavaScript, Python, and Kotlin support a functional style alongside OOP. React's component model is heavily functional — components are functions from state to UI.

### Declarative Programming

Declarative code describes *what* you want, not *how* to achieve it. SQL is the canonical example: \`SELECT name FROM users WHERE age > 18\` expresses intent without specifying the join algorithm or index access pattern. HTML and CSS are declarative. React's JSX is declarative.

The compiler or runtime is responsible for finding an efficient implementation. This raises the level of abstraction and enables powerful optimization but sacrifices low-level control.

### Logic Programming

Prolog, Datalog, and logic programming languages express programs as a set of facts and rules. The system uses unification and backtracking to find solutions. This is powerful for constraint satisfaction, theorem proving, and database query optimization — the query planner in a SQL database is essentially a logic programming system.

### Choosing a Paradigm

In practice, modern systems blend paradigms. A backend API might use OOP for domain modeling, FP for data transformation pipelines, and declarative queries for database access.

The key question is which paradigm fits the problem structure:
- **State machines and business processes** → OOP or procedural
- **Data transformation pipelines** → FP
- **Database queries or rule systems** → declarative
- **Concurrent systems** → FP's immutability eliminates entire classes of concurrency bugs

The engineers who write the most maintainable systems are those who recognize which paradigm a given module calls for — and have the vocabulary to execute it fluently.`,
    quiz: [
      {
        q: 'A function that increments a counter stored in a global variable is best described as:',
        options: ['A pure function', 'A higher-order function', 'An impure function with side effects', 'A closure'],
        correct: 2,
        explanation: 'Modifying global state is a side effect. Pure functions must not affect or depend on any state outside their parameters.',
      },
      {
        q: 'Which OOP principle is violated when internal implementation details are accessible and modified directly from outside the class?',
        options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction'],
        correct: 1,
        explanation: 'Encapsulation hides internal state behind a controlled interface. Exposing internal state violates this principle.',
      },
      {
        q: 'What does it mean for a language to treat functions as "first-class citizens"?',
        options: [
          'Functions must be declared before use',
          'Functions can only be called once',
          'Functions can be stored in variables and passed as arguments',
          'Functions must return a value',
        ],
        correct: 2,
        explanation: 'First-class functions can be treated like any other value — stored, passed, and returned — enabling higher-order patterns like map and filter.',
      },
      {
        q: 'SQL is an example of which programming paradigm?',
        options: ['Imperative', 'Object-oriented', 'Declarative', 'Logic'],
        correct: 2,
        explanation: 'SQL describes what data to retrieve, not how to retrieve it. The database engine determines the execution strategy.',
      },
      {
        q: 'The advice "favor composition over inheritance" addresses which failure mode of OOP?',
        options: [
          'Global mutable state',
          'Deep, brittle inheritance hierarchies',
          'Lack of type safety',
          'Slow function calls',
        ],
        correct: 1,
        explanation: 'Deep inheritance creates tight coupling and fragile base class problems. Composition (has-a) is more flexible than inheritance (is-a).',
      },
    ],
  },
  {
    id: 'csf-m03',
    track: 'cs-foundations' as any,
    title: 'Discrete Mathematics for CS',
    subtitle: 'Logic, proofs, sets, and graphs — the mathematical foundation of computation',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 3,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Propositional Logic', definition: 'A formal system for reasoning about statements that are either true or false, using operators AND, OR, NOT, implication (→), and biconditional (↔).' },
      { term: 'Graph Isomorphism', definition: 'Two graphs G and H are isomorphic if there exists a bijection between their vertex sets that preserves edges; determining isomorphism is a computationally hard problem for large graphs.' },
      { term: 'Proof by Contradiction', definition: 'Assuming the negation of the statement to be proved, then deriving a contradiction — showing the assumption must be false, proving the original statement true.' },
      { term: 'Bijection', definition: 'A function that is both injective (one-to-one: no two inputs map to the same output) and surjective (onto: every output is reached by some input); bijections establish that two sets have the same cardinality.' },
      { term: 'Recurrence Relation', definition: 'An equation that defines a sequence in terms of earlier values; e.g., T(n) = 2T(n/2) + n describes merge sort\'s runtime, solvable with the Master Theorem to yield O(n log n).' },
    ],
    content: `## Discrete Mathematics for Computer Science

Discrete mathematics is the study of mathematical structures that are fundamentally countable rather than continuous. Unlike calculus, which operates on real numbers and infinite limits, discrete math deals with integers, graphs, sets, and logical statements — precisely the structures that computers manipulate.

### Logic and Proof

**Propositional logic** forms the foundation of digital circuits and program verification. A proposition is any statement with a definite truth value. Logical connectives combine propositions: AND (∧), OR (∨), NOT (¬), implication (p → q means "if p then q"), and biconditional (p ↔ q means "p if and only if q").

A **tautology** is a formula true under all assignments (e.g., p ∨ ¬p). A **contradiction** is always false (p ∧ ¬p). These concepts underlie SAT solvers used in chip verification, formal methods, and AI planning.

**Predicate logic** extends propositional logic with quantifiers: ∀ (for all) and ∃ (there exists). "Every user has a password" is ∀u ∃p Holds(u, p). Predicate logic is the basis for SQL semantics, Prolog, and type theory.

**Proof techniques** are the machinery of mathematical reasoning:
- **Direct proof**: assume the hypothesis, derive the conclusion through logical steps
- **Proof by contrapositive**: prove ¬Q → ¬P to establish P → Q (logically equivalent)
- **Proof by contradiction**: assume ¬P, derive a contradiction, conclude P
- **Mathematical induction**: prove a base case, then prove that if it holds for n it holds for n+1

### Set Theory

A **set** is an unordered collection of distinct elements. Operations: union (A ∪ B), intersection (A ∩ B), difference (A − B), complement (Ā), and Cartesian product (A × B = all ordered pairs from A and B).

**Power set** P(S) is the set of all subsets of S. If |S| = n, then |P(S)| = 2ⁿ. This exponential growth explains why exhaustive search over subsets is intractable for large n.

**Relations** are subsets of Cartesian products. A relation R on set A is:
- **Reflexive**: ∀a, aRa
- **Symmetric**: aRb → bRa
- **Transitive**: aRb ∧ bRc → aRc
- An **equivalence relation** is all three — it partitions a set into equivalence classes (think: grouping users by role).
- A **partial order** is reflexive, antisymmetric, and transitive (think: topological ordering of dependencies).

**Functions** are special relations mapping each input to exactly one output. A function is **injective** (one-to-one) if distinct inputs map to distinct outputs; **surjective** (onto) if every output is reached; **bijective** if both. Bijections are used in cryptographic key generation and hash function design.

### Combinatorics

**Counting** is fundamental to algorithm analysis and probability. The **multiplication principle**: if task A can be done in m ways and task B in n ways, they can be done in sequence in m·n ways.

**Permutations**: number of ways to arrange n distinct objects = n! Number of k-item arrangements from n objects = n!/(n−k)!

**Combinations**: C(n,k) = n! / (k!(n−k)!) — number of ways to choose k items from n without regard to order. C(10,3) = 120 ways to pick 3 features from 10.

**Pigeonhole Principle**: if n+1 items are placed in n containers, at least one container has ≥ 2 items. This proves the existence of hash collisions: mapping more keys than buckets guarantees at least one collision.

### Graph Theory

A **graph** G = (V, E) consists of vertices V and edges E. **Degree** of a vertex = number of incident edges. The sum of all degrees = 2|E| (each edge contributes to two vertices).

**Paths and cycles**: a path visits vertices without repetition; a cycle returns to its start. A graph is **connected** if a path exists between every pair of vertices.

**Trees** are connected acyclic graphs. A tree with n vertices has exactly n−1 edges. Every tree has at least two leaf nodes (degree 1). Spanning trees connect all vertices with minimal edges — the basis for network routing protocols.

**Planar graphs** can be drawn without edge crossings. Euler's formula: V − E + F = 2 for connected planar graphs (F = faces including the outer face). This proves that K₅ and K₃,₃ are non-planar — relevant in VLSI circuit design where crossing wires require additional layers.

**Graph coloring**: assign colors to vertices so no adjacent vertices share a color. The chromatic number χ(G) is the minimum colors needed. The four color theorem states any planar map needs at most 4 colors. Graph coloring models register allocation in compilers: variables are vertices, edges connect variables live simultaneously, colors represent registers.

### Recurrence Relations

Many algorithms' runtime satisfies a recurrence. Merge sort: T(n) = 2T(n/2) + cn. The **Master Theorem** solves T(n) = aT(n/b) + f(n) for divide-and-conquer algorithms, yielding the complexity without unrolling the recursion manually.

Fibonacci numbers satisfy F(n) = F(n-1) + F(n-2) — an additive recurrence. The closed form (Binet's formula) expresses Fibonacci in terms of the golden ratio φ, demonstrating how combinatorics and algebra interlock.`,
    quiz: [
      {
        q: 'Which proof technique assumes the negation of the statement and derives a logical contradiction?',
        options: ['Direct proof', 'Proof by induction', 'Proof by contrapositive', 'Proof by contradiction'],
        correct: 3,
        explanation: 'Proof by contradiction assumes ¬P, then derives a statement that contradicts a known truth, forcing the conclusion that P must be true.',
      },
      {
        q: 'A set S has 4 elements. How many elements does its power set P(S) have?',
        options: ['8', '12', '16', '24'],
        correct: 2,
        explanation: 'The power set of a set with n elements has 2ⁿ elements. 2⁴ = 16.',
      },
      {
        q: 'The Pigeonhole Principle guarantees which property of hash functions?',
        options: [
          'Hash functions are reversible',
          'Collisions must exist when more keys than buckets exist',
          'Hash functions are uniformly distributed',
          'Chaining eliminates all collisions',
        ],
        correct: 1,
        explanation: 'If you map more keys than available buckets, at least two keys must hash to the same bucket — guaranteed by the Pigeonhole Principle.',
      },
      {
        q: 'A tree with n vertices has exactly how many edges?',
        options: ['n', 'n + 1', 'n − 1', '2n'],
        correct: 2,
        explanation: 'A tree is a connected acyclic graph. It always has exactly n − 1 edges — one fewer than vertices.',
      },
      {
        q: 'In graph coloring, what real-world CS problem does it model?',
        options: [
          'Network routing',
          'Register allocation in compilers',
          'Hash table sizing',
          'Memory paging',
        ],
        correct: 1,
        explanation: 'Register allocation assigns CPU registers to variables. Variables that are "live" simultaneously conflict, modeled as edges. Coloring assigns registers (colors) so conflicting variables get different registers.',
      },
    ],
  },
  {
    id: 'csf-m04',
    track: 'cs-foundations' as any,
    title: 'Operating Systems Concepts',
    subtitle: 'Processes, memory, scheduling — how software actually runs on hardware',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 4,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Context Switch', definition: 'The OS saving the state (registers, program counter, stack pointer) of a running process and restoring the state of another, enabling multitasking at the cost of a small overhead.' },
      { term: 'Virtual Memory', definition: 'An abstraction that gives each process the illusion of a large, private address space by mapping virtual addresses to physical RAM or disk storage through a page table.' },
      { term: 'Deadlock', definition: 'A state where two or more processes are each waiting for a resource held by another, forming a cycle that prevents any from making progress. Requires hold-and-wait, circular wait, no preemption, and mutual exclusion simultaneously.' },
      { term: 'Semaphore', definition: 'A synchronization primitive with two atomic operations: wait (P) decrements the count and blocks if zero, and signal (V) increments the count and unblocks a waiting process.' },
      { term: 'Page Fault', definition: 'Occurs when a process accesses a virtual memory page not currently in physical RAM; the OS handles it by loading the page from disk (swap space), which is orders of magnitude slower than RAM access.' },
    ],
    content: `## Operating Systems Concepts

An operating system is the software that mediates between applications and hardware. It provides the abstractions — processes, files, sockets, virtual memory — that make hardware programmable at scale. Understanding how it works makes you a dramatically better programmer.

### Processes and Threads

A **process** is a running program: it has its own virtual address space, file descriptors, heap, and stack. The OS creates an illusion of dedicated hardware for each process through multiplexing.

A **thread** is a unit of execution within a process. All threads in a process share the heap and file descriptors but have separate stacks and register state. Threads are lighter than processes — creating one is cheaper, and context switching between threads in the same process is faster.

**Context switching** is the overhead of multitasking. The OS saves the current CPU state (registers, program counter) to the process control block (PCB), then restores another process's state. On modern hardware this costs ~1-10 microseconds, which is why you pay for hundreds of threads but not hundreds of processes on a single CPU.

**Process states**: running (currently on CPU), ready (waiting for CPU), blocked (waiting for I/O or event), zombie (finished but not reaped by parent). The OS scheduler moves processes between these states.

### Scheduling

The scheduler decides which ready process runs next. Key metrics: **throughput** (processes completed per second), **turnaround time** (total time from submission to completion), **response time** (time until first response), **fairness**.

**First-Come-First-Served (FCFS)**: processes run in arrival order. Simple, but a long process starves all subsequent short ones — the convoy effect.

**Shortest Job First (SJF)**: minimizes average turnaround time, but requires knowing execution times in advance (impractical for interactive systems).

**Round Robin**: each process gets a fixed time quantum (typically 1-100ms), then is preempted. Good response time, higher context switch overhead. The quantum size matters: too small wastes time context switching, too large degrades to FCFS.

**Priority Scheduling**: processes have priorities; the highest-priority ready process runs. Risk of starvation for low-priority processes, mitigated by **aging** (raising priority as wait time increases).

**Completely Fair Scheduler (CFS)**: Linux's scheduler tracks each process's "virtual runtime" and always schedules the one with the smallest, ensuring proportional CPU time allocation.

### Memory Management

Each process has a **virtual address space** — typically 4GB on 32-bit, vastly larger on 64-bit. Virtual addresses are translated to physical addresses by the Memory Management Unit (MMU) using **page tables**.

Memory is divided into fixed-size **pages** (typically 4KB). The page table maps virtual page numbers to physical frame numbers. When a page is accessed that isn't in RAM, a **page fault** occurs and the OS loads it from swap. If swap is on SSD, this takes ~100μs; on HDD, ~10ms — 1000x and 100,000x slower than RAM access, respectively.

**Translation Lookaside Buffer (TLB)**: a hardware cache for page table entries. Because most programs exhibit temporal and spatial locality, TLB hit rates exceed 99%, making virtual memory translation nearly free in practice.

**Memory allocation**: the kernel allocates physical pages to processes and manages **demand paging** (loading pages only when accessed). Page replacement algorithms (LRU, Clock) decide which pages to evict when RAM is full.

### Concurrency and Synchronization

Multiple threads accessing shared data concurrently creates **race conditions**: the outcome depends on the interleaving of operations. A race condition is a bug that may appear rarely in testing but catastrophically in production.

**Mutual exclusion (mutex)** ensures only one thread enters a critical section at a time. A mutex has two states: locked and unlocked. Acquiring a locked mutex blocks the thread until it's released.

**Semaphores** generalize mutexes: a counting semaphore allows up to N simultaneous acquirers. Used to limit concurrent access to a resource pool (e.g., at most 10 threads can use a database connection at once).

**Condition variables** let threads wait until a condition is true without busy-waiting. The pattern: hold a mutex, check condition, wait (atomically releases mutex and sleeps), recheck on wake.

**Deadlock** requires four conditions simultaneously: mutual exclusion, hold-and-wait, no preemption, circular wait. Prevention strategies include lock ordering (always acquire locks in the same order) or using try-lock with timeout.

### File Systems

The OS provides a **file system abstraction** over block storage: files, directories, and permissions. Underneath, data is stored in blocks on disk. A **filesystem** manages the mapping: inodes (Unix) or MFT entries (NTFS) store metadata (size, permissions, timestamps) and block pointers.

**Journaling** (ext4, NTFS) logs pending operations before committing them, enabling recovery after crashes without full disk scans. **Copy-on-write** filesystems (ZFS, btrfs) never overwrite data — they write to new blocks and update pointers — making snapshots instant and crashes safe.

### System Calls

Applications interact with the OS through **system calls** — controlled transitions from user mode to kernel mode. open(), read(), write(), close() for files; fork(), exec() for processes; socket(), connect(), send() for networking. Each system call has significant overhead (mode switch, argument validation, kernel work) — batching I/O is one of the most effective performance optimizations.`,
    quiz: [
      {
        q: 'What does a context switch involve?',
        options: [
          'Copying the process\'s heap to disk',
          'Saving CPU state of one process and restoring another\'s',
          'Allocating new memory pages to a process',
          'Moving a process from blocked to ready state',
        ],
        correct: 1,
        explanation: 'A context switch saves the current process\'s register state to its PCB and restores the state of the next scheduled process.',
      },
      {
        q: 'A page fault means:',
        options: [
          'The program has a null pointer dereference',
          'The MMU has a TLB miss',
          'A memory page is not currently in physical RAM',
          'The page table is corrupt',
        ],
        correct: 2,
        explanation: 'A page fault occurs when a process accesses a virtual memory page not currently mapped to physical RAM, triggering OS intervention to load it.',
      },
      {
        q: 'Which condition is NOT required for deadlock to occur?',
        options: ['Mutual exclusion', 'Circular wait', 'Preemption is allowed', 'Hold and wait'],
        correct: 2,
        explanation: 'Deadlock requires mutual exclusion, hold-and-wait, no preemption, and circular wait. If preemption IS allowed, deadlock cannot form.',
      },
      {
        q: 'Round-robin scheduling with a very small time quantum approaches which failure mode?',
        options: [
          'Convoy effect (long jobs block short ones)',
          'Starvation of low-priority processes',
          'Excessive context switch overhead',
          'No CPU utilization',
        ],
        correct: 2,
        explanation: 'A very small quantum means the CPU spends most of its time context switching rather than doing useful work.',
      },
      {
        q: 'Why does the TLB make virtual memory translation nearly free in practice?',
        options: [
          'It stores the entire page table in registers',
          'It caches recent address translations; programs exhibit locality so hit rates exceed 99%',
          'It maps virtual to physical addresses without page tables',
          'It runs in user mode, avoiding kernel overhead',
        ],
        correct: 1,
        explanation: 'Programs access a small working set of pages repeatedly (locality). The TLB caches these translations, achieving >99% hit rates and avoiding page table walks.',
      },
    ],
  },
  {
    id: 'csf-m05',
    track: 'cs-foundations' as any,
    title: 'Computer Architecture',
    subtitle: 'CPU pipelines, memory hierarchies, caches — what happens below the code',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 5,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Instruction Pipeline', definition: 'Breaking CPU instruction execution into stages (fetch, decode, execute, memory, writeback) that overlap, allowing multiple instructions to be in-flight simultaneously for higher throughput.' },
      { term: 'Cache Coherence', definition: 'The protocol ensuring all CPU cores see a consistent view of memory; in MESI protocol, each cache line is in Modified, Exclusive, Shared, or Invalid state.' },
      { term: 'Branch Prediction', definition: 'Hardware mechanism that guesses the outcome of conditional branches before they are evaluated, maintaining pipeline throughput; mispredictions flush the pipeline and cost ~15-20 cycles.' },
      { term: 'SIMD', definition: 'Single Instruction Multiple Data — a class of CPU instructions that apply one operation to multiple data elements simultaneously (e.g., adding 8 floats in one instruction), critical for multimedia and ML workloads.' },
      { term: 'Memory Wall', definition: 'The growing disparity between CPU speed (doubling every ~18 months historically) and memory latency (improving slowly), making memory access the dominant bottleneck in most programs.' },
    ],
    content: `## Computer Architecture

Every line of code you write eventually becomes electrical signals in silicon. The path from high-level language to executed instruction involves compilers, instruction set architectures, and microarchitectural mechanisms that are invisible but determinative — the difference between code that runs in 10ms and code that runs in 10 seconds.

### Instruction Set Architecture (ISA)

The ISA is the contract between software and hardware: the set of instructions, registers, and memory model that a CPU supports. Programs compiled for x86-64 run on any chip implementing that ISA, regardless of internal microarchitecture.

**RISC vs CISC**: Reduced Instruction Set Computing (ARM, RISC-V) uses simple, fixed-length instructions that execute in one cycle, relying on compilers to combine them. Complex Instruction Set Computing (x86) has hundreds of complex, variable-length instructions. Modern x86 processors internally translate CISC instructions into RISC-like micro-operations (μops), combining the software ecosystem of CISC with the microarchitectural advantages of RISC.

Registers are the CPU's fastest storage — 16-32 general-purpose registers, each holding 64 bits. Accessing a register is a single cycle. The goal of compiler register allocation is keeping frequently used values in registers rather than memory.

### The Pipeline

A modern CPU executes instructions in stages: **Fetch** (read instruction from memory/cache), **Decode** (parse opcode and operands), **Execute** (perform arithmetic/logic in ALU), **Memory** (read/write data memory if needed), **Writeback** (store result in register).

Pipelining overlaps these stages — while instruction 5 executes, instruction 6 decodes and instruction 7 fetches. A 5-stage pipeline can theoretically execute 5 instructions per cycle (CPI of 1). Modern out-of-order superscalar CPUs handle 4-8 instructions per cycle by executing independent instructions simultaneously.

**Hazards** disrupt the pipeline. **Data hazards**: instruction B needs a result instruction A hasn't produced yet — solved by forwarding (passing results directly between stages) or stalling. **Control hazards**: branch instructions don't know the next PC until execution — solved by branch prediction. **Structural hazards**: two instructions need the same hardware unit simultaneously — solved by duplicating functional units.

### Branch Prediction

Modern CPUs are deeply pipelined (10-20+ stages). A branch misprediction means flushing all in-flight instructions and restarting — a 15-20 cycle penalty. With branch prediction, the CPU guesses the branch outcome and continues filling the pipeline speculatively.

Modern predictors (tournament, TAGE) achieve >99% accuracy on typical workloads. The remaining 1% of mispredictions still dominate runtime in branch-heavy code. This is why sorting data before searching can speed up code: predictable branch patterns reduce mispredictions (the "branch prediction warm-up" effect in benchmarks).

**Spectre and Meltdown** (2018) demonstrated that speculative execution of mispredicted branches can access and leak privileged memory through cache side channels — the most severe hardware security vulnerabilities in decades.

### Memory Hierarchy

The gap between CPU speed and DRAM latency is enormous: a register read takes 0 cycles; an L1 cache hit takes 4 cycles; L2 takes 12 cycles; L3 takes 40-50 cycles; DRAM takes 200-300 cycles. A cache miss to DRAM costs 200x more than an L1 hit.

**Caches** exploit locality. **Temporal locality**: recently accessed data will be accessed again. **Spatial locality**: nearby data will be accessed soon. Caches are organized into **cache lines** (64 bytes on x86) — the unit of transfer. Accessing any byte in a cache line loads the whole line.

**Cache associativity** balances simplicity and hit rate. Direct-mapped caches map each address to one cache slot — fast but prone to conflict misses. Fully associative caches allow any address in any slot — optimal hit rate but expensive. N-way set-associative (4-way, 8-way) balances both.

**Cache coherence** in multi-core systems ensures all cores see a consistent memory state. The MESI protocol assigns states to cache lines: Modified (dirty, exclusive), Exclusive (clean, exclusive), Shared (clean, multiple caches have it), Invalid (stale). When one core writes a Shared line, it sends an invalidation to other cores — a cache-to-cache transfer that takes ~50 cycles but is far faster than going to DRAM.

### Writing Cache-Friendly Code

The fastest code manipulates data in patterns that maximize cache hits. Key techniques:

**Sequential access**: iterate through arrays element by element, not with large strides. A stride of 64 (skipping every cache line) reduces effective bandwidth by 64x.

**Structure of Arrays vs Array of Structures**: for processing one field across many objects, Structure of Arrays (separate arrays per field) has better cache behavior than Array of Structures (objects with all fields together).

**Cache blocking (tiling)**: matrix multiplication naively has poor cache behavior. Tiling the computation into blocks that fit in cache can improve performance 10x.

### SIMD and Parallelism

Modern CPUs support SIMD instructions: AVX-512 on x86 can add 16 float-32s in a single instruction. Compilers auto-vectorize simple loops; critical inner loops may need manual SIMD intrinsics or libraries that use them. NumPy, OpenBLAS, and deep learning frameworks are largely SIMD-optimized C/C++ libraries.

**Hardware threads (SMT)**: Intel Hyper-Threading lets one physical core appear as two logical cores, interleaving two threads' instructions to hide memory latency. This improves throughput for memory-bound code but not for compute-bound code (both threads share the same execution units).`,
    quiz: [
      {
        q: 'A branch misprediction on a 15-stage pipeline costs approximately:',
        options: ['1-2 cycles', '5-7 cycles', '15 cycles to flush and restart', '100+ cycles'],
        correct: 2,
        explanation: 'A misprediction flushes all instructions fetched after the branch — roughly the depth of the pipeline, about 15 cycles — then restarts from the correct path.',
      },
      {
        q: 'Why does accessing data sequentially outperform random access in loops?',
        options: [
          'Sequential access uses more CPU registers',
          'Random access triggers branch mispredictions',
          'Sequential access exploits spatial locality, keeping cache hit rates high',
          'Sequential access avoids virtual memory translation',
        ],
        correct: 2,
        explanation: 'Cache lines load 64 bytes contiguously. Sequential access maximizes the use of each loaded line. Random access may touch a new cache line every access, causing constant misses.',
      },
      {
        q: 'In the MESI cache coherence protocol, when core A writes to a Shared cache line, what happens?',
        options: [
          'Core A\'s write is discarded',
          'The line is promoted to Modified and invalidation messages are sent to other cores',
          'All cores automatically see the new value',
          'The line is written through to DRAM immediately',
        ],
        correct: 1,
        explanation: 'Writing a Shared line transitions it to Modified in core A\'s cache and sends Invalidate messages to other cores holding copies, ensuring coherence.',
      },
      {
        q: 'What does SIMD stand for and why is it relevant to ML workloads?',
        options: [
          'Single Instruction Multiple Data — applies one operation to many data elements simultaneously, critical for matrix math',
          'Simultaneous Instruction Multiple Decode — speeds up decoding of complex instructions',
          'Sequential Instruction Memory Direct — accesses memory in order for cache efficiency',
          'Static Inline Machine Data — stores constants in registers',
        ],
        correct: 0,
        explanation: 'SIMD processes multiple data elements with one instruction. Matrix multiplication (the core operation of neural networks) is embarrassingly parallel and maps directly to SIMD.',
      },
      {
        q: 'The "memory wall" refers to:',
        options: [
          'A hardware limit on how many memory addresses can be mapped',
          'The growing gap between CPU speed and DRAM latency, making memory the dominant bottleneck',
          'The maximum size of L3 cache',
          'The boundary between virtual and physical memory',
        ],
        correct: 1,
        explanation: 'CPU speeds improved ~50%/year for decades while DRAM latency improved ~7%/year. This gap means memory access, not computation, limits most real programs.',
      },
    ],
  },
  {
    id: 'csf-m06',
    track: 'cs-foundations' as any,
    title: 'Theory of Computation',
    subtitle: 'Automata, Turing machines, and the limits of what computers can do',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 6,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Finite Automaton (FA)', definition: 'A computational model with a fixed set of states, transitions on input symbols, and accepting states; recognizes the class of regular languages, which includes patterns describable by regular expressions.' },
      { term: 'Turing Machine', definition: 'A theoretical model of computation with an infinite tape, a read/write head, and a transition function; defines the class of computable functions and serves as the universal model of algorithmic computation.' },
      { term: 'Halting Problem', definition: 'The problem of determining, given an arbitrary program and input, whether the program will halt or run forever; proven undecidable by Turing (1936) — no general algorithm can solve it.' },
      { term: 'Context-Free Grammar (CFG)', definition: 'A formal grammar with production rules of the form A → α where A is a single non-terminal; CFGs describe programming language syntax and are parsed by pushdown automata.' },
      { term: 'Decidability', definition: 'A problem is decidable if there exists a Turing machine that always halts and correctly accepts or rejects any input; undecidable problems exist for which no such algorithm can exist.' },
    ],
    content: `## Theory of Computation

Theory of computation answers a fundamental question: what can be computed? And equally important — what cannot? These answers define the outer limits of software engineering, explain why some problems have no algorithmic solution, and underpin formal methods for program verification.

### The Chomsky Hierarchy

Noam Chomsky classified formal languages into four levels, each recognized by a different computational model. This hierarchy directly maps to language features in programming languages.

**Regular Languages** (Level 3) are recognized by **finite automata** (FA). A FA has a finite set of states, transitions on input characters, and accepting states. Regular languages include all patterns expressible by regular expressions: email validation, lexical tokens, simple pattern matching. Key limitation: no memory between characters — a FA cannot count matched parentheses because that requires unbounded memory.

**Context-Free Languages** (Level 2) are recognized by **pushdown automata** (PDA) — finite automata with a stack. The stack enables counting and matching: balanced parentheses, properly nested HTML, arithmetic expression parsing. Programming language syntax is context-free. Parsers (LL, LR, LALR) are implementations of PDAs.

**Context-Sensitive Languages** (Level 1) require linear bounded automata and capture some natural language constructs. Rarely used in CS practice.

**Recursively Enumerable Languages** (Level 0) are recognized by **Turing machines** — the most powerful computational model.

### Turing Machines

A Turing machine has: an infinite tape (the memory), a read/write head, a finite set of states, and a transition function δ: (state, symbol) → (new state, new symbol, direction). Despite its simplicity, a Turing machine can simulate any algorithm computable on any physical computer.

The **Church-Turing Thesis** (not a theorem, a philosophical claim) states that anything computable by any physical device is computable by a Turing machine. This defines what "computation" means.

**Universal Turing Machine**: a single TM that can simulate any other TM, given that TM's description as input. This is the theoretical basis for general-purpose computers and interpreters.

### Decidability

A language L is **decidable** (recursive) if there exists a TM that halts on all inputs and correctly accepts inputs in L and rejects inputs not in L. Most problems you'll ever code are decidable.

A language is **recognizable** (recursively enumerable) if a TM accepts all inputs in L — but may loop forever on inputs not in L. An algorithm exists, but it might not terminate.

An **undecidable** problem has no TM that always halts and gives the correct answer.

### The Halting Problem

Alan Turing's 1936 proof that the Halting Problem is undecidable is one of the most important results in mathematics.

**Claim**: There is no algorithm H that, given any program P and input I, always correctly determines whether P halts on I.

**Proof (by contradiction)**: Suppose H exists. Construct a program D that does the following: given input P, if H(P, P) says "halts", then D loops forever; if H(P, P) says "loops forever", then D halts. Now ask: what does H(D, D) do? If it says "halts", then D loops forever — contradiction. If it says "loops forever", then D halts — contradiction. Therefore H cannot exist.

This diagonalization argument shows there is a hard limit on what any algorithm can determine about other programs. Practical implication: static analysis tools (linters, type checkers) can never perfectly detect all bugs or termination issues — they are fundamentally incomplete. They can be sound (no false negatives) or complete (no false positives) but not both.

### Rice's Theorem

Rice's Theorem generalizes the Halting Problem: any non-trivial semantic property of programs is undecidable. "Does this program always return a positive number?" "Does this function compute the square root?" "Is this program equivalent to that one?" — all undecidable in general.

This is why:
- Virus scanners use heuristics, not exact detection — exactly determining if code is malicious is undecidable
- Type checkers use conservative approximations — they might reject valid programs to remain sound
- Test suites are necessary — full program verification is undecidable in general

### Reductions

To prove problem B is undecidable, show it is at least as hard as the Halting Problem by **reduction**: a polynomial-time algorithm that converts any Halting Problem instance to a B instance. If B were decidable, we could solve the Halting Problem — contradiction.

The same technique proves NP-completeness in complexity theory. The landscape of computational problems is partially ordered by reducibility, forming a rich theoretical structure that explains why some problems are intrinsically hard.

### Applications in Practice

Understanding computability shapes how you approach problems. When a specification asks for something impossible (e.g., "automatically determine if any two versions of this code are equivalent"), you know to either restrict the problem (only certain code patterns), use approximations, or ask for human judgment.

Compilers apply these concepts directly: lexical analysis uses finite automata, parsing uses context-free grammars, and the theoretical limits of static analysis follow from Rice's theorem.`,
    quiz: [
      {
        q: 'Why can a finite automaton (FA) not recognize balanced parentheses like ((()))?',
        options: [
          'FAs can only process strings of length < 100',
          'FAs have no memory between characters — they cannot count unboundedly',
          'FAs require regular expressions, which do not support parentheses',
          'FAs process characters in reverse order',
        ],
        correct: 1,
        explanation: 'Matching balanced parentheses requires counting, which requires memory proportional to nesting depth. FAs have only a finite fixed number of states — no unbounded counting.',
      },
      {
        q: 'The Church-Turing Thesis states:',
        options: [
          'All decidable problems are in P',
          'No physical computer is more powerful than a Turing machine',
          'Regular languages are closed under intersection',
          'The Halting Problem is NP-complete',
        ],
        correct: 1,
        explanation: 'The Church-Turing Thesis claims any physically realizable computation can be simulated by a Turing machine, defining the scope of "computation."',
      },
      {
        q: 'Rice\'s Theorem implies which of the following?',
        options: [
          'All programming languages are equivalent in power',
          'No algorithm can perfectly determine any non-trivial property of all programs',
          'Context-free languages are undecidable',
          'Static type checking is impossible',
        ],
        correct: 1,
        explanation: "Rice's Theorem says any non-trivial semantic property of programs is undecidable. Static analysis must therefore use approximations that are either unsound or incomplete.",
      },
      {
        q: 'In Turing\'s halting problem proof, what logical technique is used?',
        options: ['Induction', 'Direct proof', 'Diagonalization (proof by contradiction via self-reference)', 'Pigeonhole principle'],
        correct: 2,
        explanation: 'Turing constructs a program D that behaves oppositely to what the hypothetical solver H predicts for D itself, creating a contradiction — a diagonalization argument.',
      },
      {
        q: 'Which computational model extends finite automata with a stack?',
        options: ['Turing machine', 'Linear bounded automaton', 'Pushdown automaton', 'Nondeterministic FA'],
        correct: 2,
        explanation: 'A pushdown automaton (PDA) is an FA plus a stack, giving it the memory to recognize context-free languages like properly nested syntax.',
      },
    ],
  },
  {
    id: 'csf-m07',
    track: 'cs-foundations' as any,
    title: 'Database Theory',
    subtitle: 'Relational algebra, normalization, ACID, and query optimization internals',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 7,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Relational Algebra', definition: 'A formal query language for relational databases with operations: selection (σ), projection (π), join (⋈), union (∪), difference (−), and rename (ρ) — the theoretical basis for SQL.' },
      { term: 'Normal Form', definition: 'A standard for eliminating redundancy and anomalies in relational schemas. 1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies. BCNF: every determinant is a superkey.' },
      { term: 'ACID', definition: 'Atomicity (all-or-nothing transactions), Consistency (database invariants preserved), Isolation (concurrent transactions appear sequential), Durability (committed transactions survive crashes) — the properties of reliable database transactions.' },
      { term: 'B-Tree', definition: 'A balanced tree data structure with branching factor B, keeping all leaves at equal depth; used in virtually every database and filesystem for indexed storage because it minimizes disk I/O per operation.' },
      { term: 'Query Plan', definition: 'The execution strategy chosen by the query optimizer for a SQL statement, specifying join order, index usage, and operator types (hash join, nested loop, merge join); EXPLAIN shows this plan.' },
    ],
    content: `## Database Theory

Databases are one of the most theoretically grounded areas of computing. Codd's relational model (1970) was a mathematical breakthrough that replaced ad-hoc data access with a rigorous algebraic foundation. Understanding that theory makes you a far better database designer and a far more effective developer.

### The Relational Model

A **relation** is a set of tuples (rows) over a schema (column names and types). Unlike files, relations are sets — no ordering, no duplicates, pure mathematical structure. This clean foundation enables algebraic manipulation.

**Relational algebra** defines operations on relations:
- **Selection** σ condition(R): filters rows where condition is true
- **Projection** π attributes(R): keeps only specified columns
- **Join** R ⋈ condition S: combines rows from two relations where the condition holds
- **Union** R ∪ S: all rows from both (schemas must match)
- **Difference** R − S: rows in R but not S
- **Rename** ρ new(R): rename a relation or attribute

SQL is a declarative surface over relational algebra. SELECT implements projection, WHERE implements selection, JOIN implements join. The query optimizer translates SQL to a relational algebra expression tree, then finds the most efficient execution plan.

### Normalization

Unnormalized schemas cause **update anomalies**: inserting, deleting, or updating data requires changes in multiple places, risking inconsistency. Normal forms eliminate these by removing redundancy.

**1NF**: all attribute values are atomic (no repeating groups or nested relations). A "tags" column with comma-separated values violates 1NF.

**2NF**: no partial dependencies — every non-key attribute depends on the entire primary key. Violated in a table with composite key (OrderID, ProductID) where a column like SupplierAddress depends only on ProductID.

**3NF**: no transitive dependencies — non-key attribute A depends on non-key attribute B which depends on the key. Fix: move B and A to a separate table.

**BCNF (Boyce-Codd NF)**: every functional dependency X → Y has X as a superkey. Stricter than 3NF; sometimes decomposition into BCNF loses join dependencies.

The goal is **lossless-join decomposition** — splitting a table into two tables that can be rejoined to recover the original data exactly. Not all decompositions are lossless.

### Transactions and ACID

A **transaction** is a sequence of operations treated as a single unit. ACID properties guarantee reliability:

**Atomicity**: the transaction either completes fully or has no effect. Achieved through undo logs — if a transaction aborts, the log is replayed in reverse to restore the previous state.

**Isolation**: concurrent transactions behave as if executed serially. **Serializable** isolation is the gold standard but expensive. Weaker levels (Read Uncommitted, Read Committed, Repeatable Read) trade correctness anomalies for performance.

**Dirty Read**: reading uncommitted changes from another transaction (prevented above Read Uncommitted).
**Non-repeatable Read**: re-reading a row returns different data because another transaction committed a change (prevented above Read Committed).
**Phantom Read**: a range query returns different rows on re-execution because another transaction inserted rows (prevented only at Serializable).

**Durability**: committed transactions survive crashes. Achieved through Write-Ahead Logging (WAL): changes are written to a sequential log before being applied to data pages. On crash, the log is replayed from the last checkpoint.

### Indexing

An **index** is a separate data structure that speeds queries at the cost of storage and write overhead. The dominant index structure is the **B-Tree**.

A B-Tree with branching factor B stores up to B-1 keys per node. With n records, the tree height is log_B(n). For B=1000 and n=1 billion, height = 3. Three disk reads to find any record in 1 billion. This is why indexes are transformative: without one, a full table scan reads all rows (O(n)); with an index, O(log n).

**Hash indexes** support only equality lookups (perfect for primary key lookups) but cannot handle range queries. B-Trees support both equality and range queries.

**Covering indexes** include all columns needed for a query, eliminating the need to access the main table at all — queries are answered entirely from the index.

### Query Optimization

The query optimizer is the database's most sophisticated component. It translates SQL into a **logical plan** (relational algebra expression), then generates **physical plans** (specific algorithms), estimates their cost using statistics (row counts, cardinality, histograms), and chooses the cheapest.

**Join algorithms**:
- **Nested Loop Join**: for each row in R, scan S for matches. O(|R|·|S|). Good for small tables or when one table fits in memory.
- **Hash Join**: build a hash table from the smaller relation, probe it with each row of the larger. O(|R| + |S|). Good for large tables without relevant indexes.
- **Merge Join**: sort both relations on the join key, merge. O(|R| log |R| + |S| log |S|). Excellent when data is already sorted.

**Join order** matters exponentially. For n tables, there are n!/2 possible join orders. The optimizer uses dynamic programming to find the optimal order for small n, and heuristics for large n.

EXPLAIN (or EXPLAIN ANALYZE) reveals the chosen plan, estimated vs actual row counts, and time per node. Mismatched estimates (wrong statistics) are the most common cause of bad query plans — running ANALYZE updates statistics.`,
    quiz: [
      {
        q: 'Which normal form eliminates partial dependencies on a composite primary key?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correct: 1,
        explanation: '2NF requires that every non-key attribute depends on the entire primary key, not just part of it. This is only relevant when the primary key is composite.',
      },
      {
        q: 'A "phantom read" anomaly means:',
        options: [
          'Reading an uncommitted value from another transaction',
          'A value changes between two reads within the same transaction',
          'A range query returns different rows on re-execution due to concurrent inserts',
          'A committed transaction is not visible to other transactions',
        ],
        correct: 2,
        explanation: 'Phantom reads occur when a range query returns different rows on re-execution because another transaction inserted rows matching the range condition. Prevented only at Serializable isolation.',
      },
      {
        q: 'Why do B-Trees dominate database indexing over binary trees?',
        options: [
          'B-Trees support more data types',
          'B-Trees minimize disk I/O by having high branching factor, keeping tree height small',
          'B-Trees do not require sorted data',
          'B-Trees use less memory than binary trees',
        ],
        correct: 1,
        explanation: 'B-Trees with branching factor 1000 have height ~3 for a billion records. Each level = one disk read. Binary trees would need ~30 levels = 30 disk reads, each ~10ms.',
      },
      {
        q: 'Write-Ahead Logging (WAL) implements which ACID property?',
        options: ['Atomicity only', 'Consistency only', 'Both Atomicity and Durability', 'Isolation'],
        correct: 2,
        explanation: 'WAL ensures atomicity (changes can be undone from the log on abort) and durability (committed changes survive crashes by being in the log before data pages are written).',
      },
      {
        q: 'EXPLAIN ANALYZE shows an estimated 100 rows but actual 100,000. What is the likely cause and fix?',
        options: [
          'Wrong join algorithm — switch to hash join',
          'Stale statistics — run ANALYZE/VACUUM to update row count estimates',
          'Missing index — add a B-Tree index on the join column',
          'Incorrect isolation level — switch to Serializable',
        ],
        correct: 1,
        explanation: 'The query optimizer uses statistics (row counts, histograms) to estimate cardinality. Stale statistics lead to wrong estimates and bad plans. ANALYZE updates them.',
      },
    ],
  },
  {
    id: 'csf-m08',
    track: 'cs-foundations' as any,
    title: 'Compiler Design & Language Theory',
    subtitle: 'Lexing, parsing, AST, type systems — how source code becomes execution',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 8,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Abstract Syntax Tree (AST)', definition: 'A tree representation of source code\'s structure produced by the parser; each node represents a syntactic construct (expression, statement, declaration); the basis for all subsequent compiler phases.' },
      { term: 'Type Inference', definition: 'The compiler\'s ability to deduce types of expressions without explicit annotations; Hindley-Milner type inference (used in Haskell, ML) can infer the most general type of any expression in polynomial time.' },
      { term: 'SSA Form', definition: 'Static Single Assignment — an IR where each variable is assigned exactly once; simplifies dataflow analysis, enabling powerful optimizations like dead code elimination, constant propagation, and register allocation.' },
      { term: 'Lexeme', definition: 'A sequence of characters in source code that matches a token pattern; e.g., "int", "42", "=", "identifier_name" are lexemes. The lexer converts character streams to token streams for the parser.' },
      { term: 'Semantic Analysis', definition: 'Compiler phase after parsing that checks type correctness, variable declaration before use, function signature matching, and other properties not captured by the grammar; produces a decorated AST with type information.' },
    ],
    content: `## Compiler Design & Language Theory

A compiler translates source code to a target language (machine code, bytecode, or another high-level language). Understanding compilers teaches you how programming languages work, why certain optimizations are possible, and how type systems actually enforce correctness.

### Compilation Phases

**Lexical Analysis (Lexing/Scanning)**: converts a character stream to a token stream. Tokens are the basic symbols of the language: keywords (if, while), identifiers (myVariable), literals (42, "hello"), operators (+, =), and punctuation ({, }). The lexer is typically implemented as a finite automaton — each token type is a regular language recognized by a pattern. Tools: lex, flex, or hand-rolled.

**Syntax Analysis (Parsing)**: converts the token stream to an Abstract Syntax Tree (AST) using the grammar. The AST captures structure, not text: a binary expression node has an operator, a left operand, and a right operand — regardless of whitespace or parentheses used to express it.

Parser types:
- **Recursive descent**: a hand-written top-down parser where each grammar rule becomes a function. Readable, good error messages, handles LL(k) grammars.
- **LL parsers**: Left-to-right scanning, Leftmost derivation. Predictive parsers using a parsing table. Cannot handle left-recursive grammars.
- **LR parsers** (LALR, SLR): more powerful than LL, handle most programming languages. Generated by tools like yacc/bison. Used for C, Java compilers.

**Semantic Analysis**: the AST is traversed to check properties beyond syntax. Type checking ensures operations are applied to compatible types. Symbol resolution associates identifier uses with declarations. Scope rules determine which declaration a name refers to. The output is a type-decorated AST.

**Intermediate Representation (IR)**: most compilers translate to an IR before emitting target code. LLVM IR and GCC's GIMPLE are architecture-independent, enabling the same optimizations for all target platforms. SSA form (Static Single Assignment) makes dataflow analysis tractable.

**Optimization**: the IR is transformed to improve performance without changing semantics. Key optimizations:
- **Constant folding/propagation**: evaluate constant expressions at compile time (2 + 3 → 5), propagate constants through the program
- **Dead code elimination**: remove code that cannot affect the output
- **Inlining**: replace function calls with the function body — eliminates call overhead and enables further optimizations
- **Loop optimizations**: hoisting invariant computations out of loops, unrolling loops to reduce branching
- **Register allocation**: assign variables to CPU registers, minimizing memory accesses (NP-hard in general; modeled as graph coloring)

**Code Generation**: translates optimized IR to target instructions (x86, ARM, WASM). Instruction selection matches IR patterns to target instructions. Register allocation assigns physical registers. Instruction scheduling reorders instructions to avoid pipeline stalls.

### Type Systems

A type system assigns types to expressions and enforces constraints at compile time (static) or runtime (dynamic). Strong type systems catch entire classes of bugs before execution.

**Type soundness**: a type system is sound if a well-typed program never encounters a type error at runtime. "Well-typed programs don't go wrong" (Milner, 1978). Java and Haskell have sound type systems; C's does not (undefined behavior, pointer casts).

**Hindley-Milner type inference** (used in Haskell, ML, OCaml, inferred parts of TypeScript) can determine the most general type of any expression without annotations. The algorithm (Algorithm W) works via unification: when two type expressions must match, their type variables are unified. This enables type-safe code with nearly no annotations.

**Parametric polymorphism (generics)**: a function \`identity<T>(x: T): T\` works for any type T. The compiler instantiates it for each concrete type — monomorphization in Rust/C++, or uses a uniform representation with type erasure (Java, Go).

**Dependent types** (Agda, Coq, Idris) allow types to depend on values: a function that returns an array of exactly n elements has type \`Array[n]\`. This enables proofs of program correctness as types — the foundation of formal verification.

### Interpretation vs Compilation

**Compiled languages** (C, Rust, C++, Go) produce native machine code at compile time. Execution is fast — no runtime overhead, direct CPU instructions.

**Interpreted languages** (Python, Ruby) execute source code (or bytecode) via a runtime interpreter. Slower per instruction (10-100x) but faster to develop, debug, and run on multiple platforms without recompilation.

**JIT compilation** (JavaScript V8, Java JVM, Python PyPy) compiles hot code paths at runtime using profiling information. Gets close to compiled performance while retaining the flexibility of interpretation. V8 compiles JavaScript functions after seeing them called frequently, using type feedback to specialize for the actual types observed.

### Domain-Specific Languages (DSLs)

A DSL is a language specialized for a domain. SQL is a DSL for relational queries. HTML is a DSL for document structure. Regex is a DSL for pattern matching. Build systems (Make, Gradle) are DSLs for build logic.

Building a DSL — even a simple one — uses the same pipeline: lexer, parser, AST, interpreter or code generator. Modern meta-programming (macros in Rust/Lisp, decorators in Python, template literals in JavaScript) enables embedded DSLs without a separate compiler.`,
    quiz: [
      {
        q: 'Which compiler phase converts a character stream to a token stream?',
        options: ['Parsing', 'Semantic analysis', 'Lexical analysis', 'Code generation'],
        correct: 2,
        explanation: 'Lexical analysis (lexing) converts the raw character stream into a stream of tokens (keywords, identifiers, literals, operators) for the parser to consume.',
      },
      {
        q: 'SSA (Static Single Assignment) form helps compilers by:',
        options: [
          'Eliminating all function calls through inlining',
          'Ensuring each variable is assigned exactly once, simplifying dataflow analysis',
          'Mapping variables to specific CPU registers before optimization',
          'Removing all branches from the program',
        ],
        correct: 1,
        explanation: 'SSA assigns each variable exactly once. This makes dataflow (def-use chains) explicit, simplifying optimizations like dead code elimination and constant propagation.',
      },
      {
        q: 'A type system is "sound" if:',
        options: [
          'It accepts all correct programs',
          'It never rejects a valid program',
          'Well-typed programs never encounter a type error at runtime',
          'It infers types for all expressions without annotations',
        ],
        correct: 2,
        explanation: 'Soundness means the type system\'s guarantees hold at runtime: if the compiler accepts the program\'s types, no type error can occur during execution.',
      },
      {
        q: 'Why is register allocation modeled as a graph coloring problem?',
        options: [
          'Variables with overlapping lifetimes cannot share a register; coloring assigns registers so conflicting variables differ',
          'CPU registers are arranged in a graph topology',
          'Graph coloring finds the minimum number of variables needed',
          'Register addresses form a regular graph',
        ],
        correct: 0,
        explanation: 'Two variables "conflict" if both are live (in use) at the same time — they cannot share a register. This is exactly graph coloring: vertices are variables, edges connect conflicting pairs, colors are registers.',
      },
      {
        q: 'JIT compilation improves performance over pure interpretation by:',
        options: [
          'Compiling all code before execution',
          'Compiling hot code paths at runtime using type feedback, producing native machine code',
          'Caching interpreted results in a hash table',
          'Removing dynamic type checks entirely',
        ],
        correct: 1,
        explanation: 'JIT profiles which functions are called frequently (hot paths), then compiles them to native code using observed type information. This combines interpretation flexibility with compiled performance.',
      },
    ],
  },
  {
    id: 'csf-m09',
    track: 'cs-foundations' as any,
    title: 'Machine Learning Theory',
    subtitle: 'Statistical learning, bias-variance, gradient descent, neural network foundations',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 9,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Bias-Variance Tradeoff', definition: 'Bias: error from underfitting (model too simple to capture patterns). Variance: error from overfitting (model too sensitive to training noise). Increasing model complexity reduces bias but increases variance; the optimal model balances both.' },
      { term: 'Gradient Descent', definition: 'An optimization algorithm that iteratively adjusts parameters in the direction of steepest loss decrease: θ ← θ − η∇L(θ), where η is the learning rate and ∇L is the gradient of the loss function.' },
      { term: 'Backpropagation', definition: 'An efficient algorithm for computing gradients of the loss with respect to all neural network parameters using the chain rule, enabling gradient descent training for deep networks.' },
      { term: 'Regularization', definition: 'Techniques to reduce overfitting by penalizing model complexity: L1 (Lasso) adds |w|, inducing sparsity; L2 (Ridge) adds w², shrinking weights toward zero; Dropout randomly zeroes neurons during training.' },
      { term: 'PAC Learning', definition: 'Probably Approximately Correct — a formal framework defining when a learning algorithm can generalize: it needs a polynomial number of samples to find a hypothesis that is ε-close to correct with probability 1−δ.' },
    ],
    content: `## Machine Learning Theory

Machine learning is applied statistics, optimization theory, and linear algebra at scale. Understanding the theoretical foundations prevents the "black box" trap: knowing why models fail, what sample size you need, and which algorithm suits which problem.

### The Learning Problem

Formally, supervised learning is: given a training set {(x₁,y₁), ..., (xₙ,yₙ)} drawn from an unknown distribution P(X,Y), find a hypothesis h: X → Y that generalizes well to new samples from P.

**Empirical Risk Minimization (ERM)**: minimize average loss on training data. The risk (true error) is the expected loss over P; we minimize empirical risk as a proxy. But minimizing training loss doesn't guarantee minimizing test error.

**Generalization gap**: difference between test error and training error. A large gap means overfitting. The generalization gap is bounded by O(√(d/n)) where d is model complexity (VC dimension) and n is training size — more data and simpler models generalize better.

### PAC Learning Framework

PAC (Probably Approximately Correct) learning formalizes generalization. A concept class C is PAC-learnable if there exists an algorithm A such that for any ε, δ > 0, any target concept c ∈ C, and any distribution P, given m ≥ O(1/ε · log(1/δ) · VC(C)) samples, A outputs a hypothesis with error ≤ ε with probability ≥ 1−δ.

The **VC dimension** (Vapnik-Chervonenkis) measures hypothesis class capacity: the size of the largest set that can be "shattered" (any labeling realized). A linear classifier in ℝᵈ has VC dimension d+1. Neural networks' VC dimension grows with parameters.

This theoretical framework tells you: to halve your error, you need ~4x more data (all else equal). To double model capacity, you need proportionally more data to maintain the same generalization.

### Bias-Variance Decomposition

The expected test error decomposes as:
\`\`\`
E[error] = (Bias)² + Variance + Irreducible Noise
\`\`\`

**Bias** measures systematic error: a linear model fitted to nonlinear data always misses the true function regardless of how much data you have. **Variance** measures sensitivity to training set: a deep tree can memorize any training set but performs poorly on new data.

The bias-variance tradeoff: reducing bias (more complex model) typically increases variance. The goal is the **sweet spot** — the model complexity where total error is minimized. In practice: start simple, measure validation error, increase complexity until validation error stops improving.

**Ensemble methods** reduce variance without increasing bias: random forests average many high-variance, low-bias trees; boosting (AdaBoost, XGBoost) reduces bias by sequentially fitting residuals.

### Optimization

**Gradient descent** moves parameters downhill on the loss surface. The loss surface of deep networks is high-dimensional with many saddle points (not local minima — saddle points have zero gradient but are escapable). Research shows SGD naturally escapes saddle points due to gradient noise.

**Stochastic Gradient Descent (SGD)**: compute gradient on one sample (or mini-batch). Noisy but fast, and the noise actually helps generalization (implicit regularization). Mini-batch SGD (batch size 32-512) balances noise and hardware efficiency.

**Learning rate** is the most important hyperparameter. Too large: oscillates or diverges. Too small: slow convergence. **Learning rate schedules** (cosine annealing, warmup) adjust lr during training. **Adaptive optimizers** (Adam, AdaGrad) maintain per-parameter learning rates based on gradient history, dramatically reducing hyperparameter sensitivity.

**Vanishing/exploding gradients** in deep networks: backpropagation multiplies Jacobians at each layer; with many layers, gradients either vanish (near zero, no learning) or explode (overflow). Solutions: careful initialization (Xavier/Kaiming), batch normalization, residual connections (skip connections in ResNets add gradients directly, bypassing multiplication).

### Neural Networks

A neural network is a composition of linear transformations and nonlinear activations. Each layer: y = σ(Wx + b) where W is a weight matrix, b is a bias vector, and σ is an elementwise nonlinearity.

**Universal Approximation Theorem**: a feedforward network with one hidden layer and enough neurons can approximate any continuous function on a compact domain to arbitrary precision. But "enough neurons" may be exponential — deep networks approximate efficiently what shallow networks require exponential width for.

**Activation functions**: sigmoid (historical, now mostly deprecated for hidden layers — vanishing gradients), tanh (better than sigmoid, still used), ReLU (max(0,x) — zero gradient for x<0 ("dying ReLU") but simple and effective), GELU (smooth approximation of ReLU, used in transformers).

**Convolutional Neural Networks (CNNs)**: exploit spatial structure through weight sharing. A convolution applies the same filter at every position — this inductive bias is exactly right for images (translation invariance), making CNNs far more sample-efficient than fully connected networks for vision.

**Attention and Transformers**: instead of processing sequences recurrently, transformers compute a weighted average of all positions (attention = softmax(QKᵀ/√d)V). The self-attention mechanism allows arbitrary dependencies between positions. Transformers scale extremely well with data and compute — the foundation of GPT, BERT, and all modern LLMs.

### Regularization

Regularization reduces overfitting by penalizing complexity. **L2 regularization** (weight decay) adds λ·‖w‖² to the loss, penalizing large weights — equivalent to Gaussian prior on weights in Bayesian terms. **L1 regularization** adds λ·‖w‖₁, inducing sparsity (weights become exactly zero) — equivalent to Laplace prior, useful for feature selection.

**Dropout** randomly zeroes neurons during training with probability p. At test time, all neurons are used but outputs are scaled by (1−p). Interpreted as training an ensemble of 2ⁿ sub-networks and averaging.

**Early stopping**: monitor validation loss; stop when it starts increasing. Simple and effective — keeps the model at the point of best generalization before overfitting sets in.`,
    quiz: [
      {
        q: 'A model with high bias and low variance is described as:',
        options: [
          'Overfitting — too sensitive to training data',
          'Underfitting — too simple to capture the true pattern',
          'Well-regularized — in the bias-variance sweet spot',
          'Overparameterized — more parameters than samples',
        ],
        correct: 1,
        explanation: 'High bias means systematic error — the model is too simple to capture the true function. This is underfitting. Overfitting manifests as high variance (performs well on training, poorly on test).',
      },
      {
        q: 'The PAC learning framework says you need more training data when:',
        options: [
          'The learning rate is too small',
          'Model complexity (VC dimension) increases or required accuracy increases',
          'The data has more features',
          'The loss function is non-convex',
        ],
        correct: 1,
        explanation: 'PAC bounds: m ≥ O(VC(C)/ε · log(1/δ)). More complex models (higher VC dimension) or tighter error requirements (smaller ε) require more data for the same generalization guarantees.',
      },
      {
        q: 'Residual (skip) connections in ResNets primarily address which training problem?',
        options: [
          'Overfitting on large datasets',
          'Slow data loading bottlenecks',
          'Vanishing gradients in very deep networks',
          'Lack of translation invariance',
        ],
        correct: 2,
        explanation: 'Skip connections add the input directly to the output (x + F(x)). Gradients flow through the shortcut path without being multiplied through many layers, solving vanishing gradients that prevent training very deep networks.',
      },
      {
        q: 'Dropout regularization is theoretically equivalent to:',
        options: [
          'L2 weight decay with a specific λ',
          'Training and averaging an ensemble of 2ⁿ sub-networks',
          'Early stopping at the optimal validation error',
          'Removing neurons with small weights permanently',
        ],
        correct: 1,
        explanation: 'Each dropout mask creates a different sub-network. Training with dropout is approximately averaging over an exponentially large ensemble of sub-networks.',
      },
      {
        q: 'Adam optimizer improves over vanilla SGD primarily because:',
        options: [
          'It uses second-order (curvature) information',
          'It maintains per-parameter adaptive learning rates based on gradient history',
          'It avoids all saddle points by detecting them analytically',
          'It uses larger batch sizes for stability',
        ],
        correct: 1,
        explanation: 'Adam maintains exponential moving averages of gradients (first moment) and squared gradients (second moment), adapting the learning rate for each parameter — making it less sensitive to the global learning rate choice.',
      },
    ],
  },
  {
    id: 'csf-m10',
    track: 'cs-foundations' as any,
    title: 'Distributed Systems Theory',
    subtitle: 'CAP theorem, consensus, fault tolerance, and consistency models',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 10,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'CAP Theorem', definition: 'A distributed system can provide at most two of: Consistency (every read receives the most recent write), Availability (every request receives a response), Partition Tolerance (the system operates despite network partitions). Since partitions always occur, systems choose CA or AP.' },
      { term: 'Consensus', definition: 'The problem of getting distributed nodes to agree on a value despite failures. Solved by protocols like Paxos and Raft; impossible to solve in asynchronous systems with even one crash failure (FLP impossibility).' },
      { term: 'Eventual Consistency', definition: 'A consistency model guaranteeing that, if no new updates are made, all replicas will eventually converge to the same value. Used by Cassandra, DynamoDB, DNS — trades immediate consistency for availability and performance.' },
      { term: 'Vector Clock', definition: 'A mechanism for tracking causality in distributed systems: each node maintains a vector of logical timestamps, one per node; two events are ordered if their vector clocks can be compared; otherwise they are concurrent.' },
      { term: 'Two-Phase Commit (2PC)', definition: 'A distributed transaction protocol where a coordinator asks all participants to prepare (phase 1) then commit or abort (phase 2). Provides atomicity across nodes but blocks if the coordinator crashes — not fault-tolerant.' },
    ],
    content: `## Distributed Systems Theory

A distributed system is a collection of autonomous computers communicating over a network to appear as a coherent system. The fundamental challenge: partial failures. In a single computer, either everything works or nothing does. In distributed systems, some components fail while others continue — creating subtle inconsistencies, split brains, and the impossibility results that define the field.

### The Fundamental Challenges

**Partial failures**: a node can crash, a network link can fail, a message can be delayed arbitrarily. Unlike a single computer, you cannot distinguish "the remote node is slow" from "the remote node has crashed."

**Asynchronous networks**: there is no upper bound on message delivery time. A message may arrive in 1ms or 10 seconds or never. This makes reasoning about ordering and synchronization deeply hard.

**Independent failure modes**: two nodes can have conflicting views of state. Both think they are the leader. Both accept writes. Data diverges. This is the split-brain problem.

### CAP Theorem

Eric Brewer's CAP theorem (formally proved by Gilbert and Lynch): a distributed data store can provide at most two of:

- **Consistency**: every read returns the most recent write (or an error)
- **Availability**: every request receives a response (not an error)
- **Partition Tolerance**: the system continues operating despite network partitions (messages lost between nodes)

Network partitions are not optional — any distributed system over a real network must handle them. So the real choice is between **CP** (sacrifice availability during partitions; return errors rather than stale data) and **AP** (sacrifice consistency during partitions; return stale data rather than errors).

**CP systems**: ZooKeeper, HBase, traditional RDBMS with synchronous replication — return errors when they cannot guarantee up-to-date data.

**AP systems**: Cassandra, DynamoDB, CouchDB — return the best available data even if stale, converge later.

PACELC extends CAP to cover normal operation: there's a tradeoff between latency and consistency even when there are no partitions. Replicating writes synchronously before acknowledging increases consistency but latency.

### Consistency Models

**Linearizability** (strong consistency): every operation appears to take effect atomically at a single point in time, consistent with a global clock. The strongest model; requires coordination overhead.

**Sequential consistency**: all operations appear in some sequential order consistent with each process's local order. Weaker than linearizability — does not require a global clock.

**Causal consistency**: causally related operations appear in causal order to all processes. Concurrent operations (no causal dependency) may appear in different order. Implemented using vector clocks.

**Eventual consistency**: if no new updates are made, all replicas will eventually agree. No bounds on convergence time. CRDTs (Conflict-free Replicated Data Types) provide specific data structures (counters, sets, registers) that merge concurrent updates deterministically.

### FLP Impossibility

Fischer, Lynch, and Paterson (1985) proved: in an asynchronous distributed system, no consensus algorithm can be both correct (all non-faulty processes decide, all decide the same value) and fault-tolerant to even one crash failure.

This seems to make consensus impossible. The resolution: real systems use **partial synchrony** (assume message delays are bounded most of the time) or **randomization** (break symmetry with coin flips). Both approaches allow consensus in practice while technically violating the FLP model.

### Consensus Protocols

**Paxos** (Lamport, 1989): the canonical consensus algorithm. A proposer proposes a value to a quorum of acceptors, which promise not to accept proposals with lower proposal numbers. If a quorum accepts, the value is decided. Complex to implement correctly — many subtleties.

**Raft** (Ongaro and Ousterhout, 2014): designed for understandability. Elects a leader that handles all writes, replicates a log to followers. Leader election uses randomized timeouts; log replication is straightforward. Used in etcd (Kubernetes state), CockroachDB, TiKV.

**Quorum systems**: require responses from a majority (quorum) of nodes. If you have 2f+1 nodes, any two quorums overlap by at least one node, ensuring at least one node in any quorum has the latest data. This allows tolerating f simultaneous failures.

### Replication Strategies

**Single-leader replication**: one node accepts all writes, propagates to followers. Simple, strong consistency if synchronous. Leader becomes a bottleneck and single point of failure.

**Multi-leader replication**: multiple nodes accept writes, replicate to each other. Higher write availability; conflict resolution is the problem. Last-write-wins, version vectors, CRDTs are solutions.

**Leaderless replication** (Dynamo-style): any node accepts reads and writes. Uses quorums: write to W nodes, read from R nodes; if W + R > N (total replicas), reads always overlap with writes. Cassandra, Riak, DynamoDB use this model.

### Distributed Transactions

**Two-Phase Commit (2PC)**: coordinator asks all participants to prepare (acquire locks, write undo log), then commits or aborts. Provides atomicity but blocks if coordinator crashes while participants are prepared — they cannot release locks or commit without the coordinator's decision.

**Three-Phase Commit (3PC)**: adds a pre-commit phase to allow participants to commit if the coordinator fails during commit. Safer but requires a synchronous network (bounded delays) — impractical for WAN.

**Saga pattern**: a sequence of local transactions, each publishing events that trigger the next. Compensating transactions undo completed steps on failure. No distributed locks — highly available but requires careful design of compensating actions.

### The Real-World Implication

Every database, every distributed cache, every service mesh makes these tradeoffs. When you see "eventual consistency" in DynamoDB documentation, you now know it means: AP in the CAP sense, with convergence guaranteed eventually, and that you must design your application to handle stale reads. When you configure a Kafka consumer group, you're reasoning about partitions and consumer assignment — distributed coordination. These aren't just buzzwords; they're consequences of mathematical theorems about networked systems.`,
    quiz: [
      {
        q: 'A distributed database that returns an error during a network partition rather than serving stale data is choosing:',
        options: ['AP (availability over consistency)', 'CP (consistency over availability)', 'CA (not partition-tolerant)', 'Eventual consistency'],
        correct: 1,
        explanation: 'Returning an error during a partition prioritizes consistency (no stale reads) over availability. This is the CP choice in CAP.',
      },
      {
        q: 'FLP impossibility says:',
        options: [
          'No distributed system can be both available and consistent',
          'No consensus algorithm can be correct and fault-tolerant in a fully asynchronous system',
          'Network partitions cannot be avoided in WAN deployments',
          'Two-phase commit always blocks under coordinator failure',
        ],
        correct: 1,
        explanation: 'FLP proves that in a purely asynchronous model, no consensus algorithm can tolerate even one crash failure while still terminating. Real systems use partial synchrony to work around this.',
      },
      {
        q: 'In a quorum system with N=5 nodes, W=3 writes, and R=3 reads, why are reads guaranteed to see the latest write?',
        options: [
          'Because 3+3 > 5, any read quorum overlaps with any write quorum by at least one node',
          'Because all 5 nodes are always synchronized',
          'Because the write quorum always includes the leader',
          'Because W > N/2 prevents split-brain',
        ],
        correct: 0,
        explanation: 'W + R > N ensures at least one node in every read quorum participated in every write quorum. That node has the latest data, so reads are guaranteed to see it.',
      },
      {
        q: 'The Saga pattern differs from 2PC distributed transactions by:',
        options: [
          'Requiring a global coordinator for all steps',
          'Using compensating transactions instead of distributed locks for failure recovery',
          'Guaranteeing atomic all-or-nothing semantics like 2PC',
          'Only working with a single database',
        ],
        correct: 1,
        explanation: 'Sagas use compensating transactions (undo completed steps semantically) rather than holding distributed locks across services. This trades strict atomicity for availability and scalability.',
      },
      {
        q: 'Vector clocks track causality by:',
        options: [
          'Synchronizing clocks across nodes using NTP',
          'Recording the number of messages sent between nodes',
          'Each node maintaining a counter vector; events are ordered if one vector dominates the other',
          'Using a global sequence number from a central coordinator',
        ],
        correct: 2,
        explanation: 'Vector clocks: each node increments its own counter on each event and includes the full vector in messages. If vector A ≤ vector B component-wise, A causally precedes B. Otherwise they are concurrent.',
      },
    ],
  },
  {
    id: 'csf-m11',
    track: 'cs-foundations' as any,
    title: 'Complexity Theory',
    subtitle: 'P vs NP, NP-completeness, reductions, and what makes problems hard',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 11,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'P (Polynomial Time)', definition: 'The class of decision problems solvable in polynomial time O(nᵏ) for some constant k. Problems in P are considered "efficiently solvable": sorting, shortest paths, primality testing.' },
      { term: 'NP (Nondeterministic Polynomial)', definition: 'The class of decision problems where a "yes" answer can be verified in polynomial time. Equivalently, problems solvable by a nondeterministic TM in polynomial time. SAT, graph coloring, and Hamiltonian path are in NP.' },
      { term: 'NP-Complete', definition: 'A problem that is in NP and is NP-hard (every NP problem reduces to it in polynomial time). If any NP-complete problem is in P, then P = NP. Examples: 3-SAT, Vertex Cover, Knapsack (decision version).' },
      { term: 'Polynomial-Time Reduction', definition: 'A transformation of problem A to problem B in polynomial time such that a "yes" instance of A maps to a "yes" instance of B; used to prove NP-hardness by reducing a known NP-hard problem to the new problem.' },
      { term: 'Approximation Algorithm', definition: 'An algorithm for NP-hard optimization problems that finds a solution guaranteed to be within a factor α of optimal in polynomial time; e.g., the greedy vertex cover is a 2-approximation.' },
    ],
    content: `## Complexity Theory

Complexity theory classifies computational problems by their inherent difficulty — not the complexity of a particular algorithm, but the minimum resources any algorithm needs. It explains why some problems have fast solutions, others require exponential time regardless of algorithmic cleverness, and a vast class of important problems sits in a frustrating middle ground.

### Complexity Classes

Problems are classified by the resources needed to solve them: time (number of steps) and space (memory), measured as a function of input size n.

**P** contains problems solvable in polynomial time O(nᵏ). Polynomial time is the informal definition of "efficiently solvable": sorting (O(n log n)), shortest paths (Dijkstra's O((V+E) log V)), linear programming (O(n³)), primality testing (O((log n)¹²)).

**NP** (Nondeterministic Polynomial) contains problems where a "yes" solution can be *verified* in polynomial time. Whether it can be *found* in polynomial time is unknown. Given a proposed Sudoku solution, verifying it takes O(n²). Finding it may take exponential time.

Equivalently (and historically): problems solvable by a nondeterministic Turing machine in polynomial time. A NDTM can "branch" on all choices simultaneously and accept if any branch succeeds.

P ⊆ NP (every P problem's solution can be trivially verified). Whether P = NP is the most important open problem in mathematics and computer science.

### The P vs NP Question

If P = NP, every problem whose solution is verifiable in polynomial time is also solvable in polynomial time. This would mean: theorem provers could find proofs as easily as check them, protein folding could be solved optimally, most cryptography would break (integer factorization is in NP; if P=NP, RSA collapses).

Most researchers believe P ≠ NP, but it has resisted proof for 50 years. The Clay Mathematics Institute offers \$1 million for a resolution.

### Cook's Theorem and NP-Completeness

Stephen Cook (1971) proved that **3-SAT** is NP-complete: it's in NP (solutions are easily verified), and every NP problem reduces to it in polynomial time.

**3-SAT**: given a boolean formula in conjunctive normal form with exactly 3 literals per clause, is there an assignment satisfying all clauses?

Since then, thousands of problems have been proven NP-complete by reduction: to prove problem B is NP-complete, find a polynomial-time reduction from a known NP-complete problem A to B. If A ≤ₚ B (A reduces to B), B is at least as hard as A.

Key NP-complete problems:
- **Graph coloring**: can a graph be colored with k colors so no adjacent vertices share a color? (k ≥ 3)
- **Hamiltonian path**: does a graph have a path visiting every vertex exactly once?
- **Vertex cover**: is there a set of k vertices covering all edges?
- **Subset sum / Knapsack**: given weights/values and a capacity, find the maximum-value selection within capacity
- **Traveling Salesman Problem (TSP)**: shortest tour visiting all cities
- **Integer Linear Programming**: LP with integer variables

### Dealing With NP-Hardness

Encountering an NP-complete problem in practice doesn't mean defeat. Strategies:

**Exact algorithms for small instances**: dynamic programming over subsets (O(2ⁿ · n)) solves TSP for n ≤ 20-25. Branch and bound prunes the search tree. Practical TSP solvers handle millions of cities using sophisticated cutting planes.

**Approximation algorithms**: find solutions provably close to optimal. The **greedy vertex cover** is a 2-approximation (it finds a cover at most twice the optimal size). TSP with triangle inequality has a 1.5-approximation (Christofides algorithm). The theory of **APX** defines what's approximable within a constant factor.

**Parameterized complexity**: if the problem is NP-hard in the input size n but tractable when a parameter k is small, use **fixed-parameter tractable (FPT)** algorithms: runtime O(f(k) · nᶜ). Vertex cover is FPT in the cover size k: O(2ᵏ · n). This is powerful when k is small in practice.

**Randomized algorithms**: sometimes a randomized algorithm that is correct with high probability and runs in polynomial time (Las Vegas or Monte Carlo algorithms) is acceptable. Some NP problems have randomized polynomial-time algorithms.

**Heuristics and metaheuristics**: simulated annealing, genetic algorithms, local search. No approximation guarantee, but produce good solutions in practice.

### The Complexity Zoo

Beyond P and NP:

**coNP**: problems whose "no" instances are verifiable in polynomial time. If P ≠ NP, P ≠ coNP. Graph non-isomorphism is in coNP.

**PSPACE**: problems solvable in polynomial space (memory). PSPACE ⊇ NP (you can solve NP problems using polynomial space). PSPACE-complete problems include game-playing (generalized chess, go).

**#P**: counting problems — how many solutions exist? Counting satisfying assignments of a 3-CNF formula is #P-complete. Harder than NP (you can determine existence from count, but not the reverse).

**BPP**: problems solvable in polynomial time with a bounded-error randomized algorithm (error probability < 1/3). Believed to equal P, but unproven. Miller-Rabin primality testing is a BPP algorithm.

### Cryptography and Complexity

Most public-key cryptography relies on conjectured hardness. **RSA** relies on integer factorization being hard (in NP but not known to be NP-complete). **ECC** relies on discrete logarithm hardness. **Post-quantum cryptography** uses problems believed hard even for quantum computers (lattice problems, code-based).

Quantum computers can solve factorization in polynomial time (Shor's algorithm, 1994). This doesn't prove P = NP — quantum complexity theory (BQP) is a different complexity class. But it means RSA is broken by sufficiently large quantum computers — the motivation for NIST's post-quantum cryptography standardization (completed 2024).`,
    quiz: [
      {
        q: 'A problem in NP means:',
        options: [
          'No polynomial-time algorithm exists for it',
          'Solutions can be verified in polynomial time, but may not be found in polynomial time',
          'It requires exponential time in the worst case',
          'It is equivalent in difficulty to the Halting Problem',
        ],
        correct: 1,
        explanation: 'NP contains problems where a proposed solution can be verified in polynomial time. Whether solutions can also be found in polynomial time (P = NP) is unknown.',
      },
      {
        q: 'To prove a new problem B is NP-complete, you need to:',
        options: [
          'Show B is in P and find a reduction from B to SAT',
          'Show B is in NP and find a polynomial-time reduction from a known NP-complete problem to B',
          'Solve B in polynomial time for all small instances',
          'Show the best known algorithm for B is exponential',
        ],
        correct: 1,
        explanation: 'NP-completeness requires: (1) B is in NP (solutions verifiable in polynomial time), and (2) B is NP-hard (every NP problem reduces to B, shown by reducing a known NP-complete problem to B).',
      },
      {
        q: 'A 2-approximation algorithm for vertex cover guarantees:',
        options: [
          'The algorithm runs in O(n²) time',
          'The solution is exactly 2 vertices larger than optimal',
          'The solution size is at most twice the optimal solution size',
          'The algorithm uses 2x less memory than brute force',
        ],
        correct: 2,
        explanation: 'A 2-approximation algorithm returns a solution with cost ≤ 2 × OPT. The guarantee is a ratio bound, not an additive bound.',
      },
      {
        q: 'Shor\'s quantum algorithm for factoring implies:',
        options: [
          'P = NP',
          'BQP ⊇ NP',
          'RSA is broken by sufficiently large quantum computers',
          'All NP problems can be solved in polynomial time on quantum computers',
        ],
        correct: 2,
        explanation: "Shor's algorithm factors integers in polynomial time on a quantum computer. RSA's security relies on factoring being hard — quantum computers break this assumption. This is P and NP being classes for classical computers; quantum complexity (BQP) is separate.",
      },
      {
        q: 'Fixed-parameter tractability (FPT) helps when:',
        options: [
          'The problem is in P and the input is very large',
          'The problem is NP-hard but a relevant parameter k is small in practice',
          'An approximation ratio of 2 is acceptable',
          'The problem can be randomized to avoid worst cases',
        ],
        correct: 1,
        explanation: 'FPT algorithms run in O(f(k) · nᶜ) — exponential in k but polynomial in n. When k is small (e.g., small tree-width, small vertex cover size), FPT algorithms are practical even for large n.',
      },
    ],
  },
  {
    id: 'csf-m12',
    track: 'cs-foundations' as any,
    title: 'Research Methods in Computer Science',
    subtitle: 'Reading papers, experimental design, peer review, and navigating the CS research landscape',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 12,
    certArea: 'Computer Science Foundations',
    keyTerms: [
      { term: 'Empirical Evaluation', definition: 'Assessing a system\'s performance through controlled experiments, benchmarks, and statistical analysis rather than theoretical proofs alone; essential for systems and ML papers.' },
      { term: 'Reproducibility', definition: 'The ability of independent researchers to obtain the same results using the same methods and data; a crisis in ML research where many published results cannot be reproduced with different hardware or random seeds.' },
      { term: 'Ablation Study', definition: 'Systematically removing components of a proposed system to determine each component\'s contribution to overall performance; distinguishes which parts matter from which are incidental.' },
      { term: 'Peer Review', definition: 'The process of expert evaluation before publication; in CS, typically double-blind (neither author nor reviewer knows the other\'s identity) at major venues like NeurIPS, ICML, SOSP, PLDI, SIGCOMM.' },
      { term: 'Conference vs Journal', definition: 'CS research is primarily published at top conferences (NeurIPS, ICML for ML; SOSP, OSDI for systems; POPL, PLDI for PL) unlike most sciences where journals dominate; conference acceptance rates are often 15-25%.' },
    ],
    content: `## Research Methods in Computer Science

CS is unusual among technical fields: its primary publication venues are conferences, not journals. The research moves fast — what appears in NeurIPS 2024 today was rejected from ICML 2023 yesterday. Understanding how research works lets you read papers critically, extract real insights, and distinguish breakthroughs from incremental work.

### The CS Research Landscape

CS research divides into subfields with distinct venues and cultures:

**Theory** (algorithms, complexity, cryptography): primarily published in STOC, FOCS, SODA, CRYPTO. Mathematical proofs are the primary contribution. Rarely empirically evaluated. Reviewer emphasis on novelty and correctness.

**Systems** (OS, networks, distributed systems, storage): SOSP, OSDI, NSDI, USENIX ATC. Emphasis on real implementations, measured performance, evaluation on realistic workloads. "Systems plumbers" prize practicality.

**Machine Learning/AI**: NeurIPS, ICML, ICLR, AAAI. Empirical results on benchmarks, theoretical analysis secondary. Fastest-moving field — arXiv preprints dominate, papers are months ahead of conferences.

**Programming Languages**: POPL, PLDI, OOPSLA. Type theory, program analysis, compilers. Mix of formal proofs and empirical evaluation.

**Human-Computer Interaction**: CHI. User studies, qualitative and quantitative human evaluation. Ethical review for studies involving humans.

**Security**: IEEE S&P, USENIX Security, CCS, NDSS. CVEs, formal security models, attacks and defenses. Responsible disclosure adds complexity.

### Anatomy of a CS Paper

Most CS papers follow this structure:

**Abstract**: 150-250 words. Problem statement, approach, key result, significance. Reading only the abstract tells you 70% of what you need to decide if it's relevant.

**Introduction**: Motivates the problem, states contributions explicitly (often as a bulleted list), and outlines the paper structure. The contribution list is the paper's core claim.

**Related Work**: positions the paper among prior work. Read this to understand what's novel vs incremental. "To our knowledge, X is the first..." is a strong claim to verify.

**Technical Content**: the meat — architecture, algorithm, proof, or system design. May be the hardest to read but skip liberally on first pass if you don't need to implement it.

**Evaluation**: experiments, benchmarks, or proofs. For empirical papers, this is critical — is the experimental setup fair? Are baselines strong? Are results statistically significant?

**Conclusion**: summarizes contributions, limitations, and future work. Limitations are often undersold.

### Reading Papers Effectively

**Three-pass reading** (Keshav, 2007):
1. **First pass** (5-10 minutes): title, abstract, section headings, figures, conclusion. Decide: is this relevant? What are the claims?
2. **Second pass** (1 hour): read carefully, skipping proofs. Understand the key ideas, examine figures, note unfamiliar terms.
3. **Third pass** (4-5 hours): fully understand every step. Attempt to re-derive proofs, identify assumptions, evaluate experiments critically.

Most papers warrant only a first or second pass. Do a third pass only for foundational papers in your area or papers you intend to build upon.

**Evaluating claims critically**:
- What problem is being solved? Is it the right problem?
- What are the assumptions? Are they realistic?
- Are comparisons fair? Are baselines the best current alternatives?
- Is the improvement statistically significant? What are the confidence intervals?
- Would the approach generalize to settings different from the paper's experiments?
- What is not shown? Papers present their system in the best light.

### Experimental Design in CS

A good CS experiment is:

**Controlled**: only one variable changes at a time. When comparing system A vs system B, hardware, dataset, configuration, and metrics should be identical. Lack of control is the most common experimental flaw.

**Representative**: benchmarks should reflect real workloads. Micro-benchmarks measure peak performance but not realistic behavior. The SPEC CPU benchmarks are industry standards for CPU performance; TPC-C for databases; MLPerf for ML.

**Statistically rigorous**: report means, standard deviations, and confidence intervals. Run experiments multiple times with different seeds. Report the median, not just the maximum. Overfitting to random seeds is a documented ML research pathology.

**Reproducible**: provide code, datasets, and exact hyperparameters. Most ML papers now submit code to OpenReview. Systems papers submit artifacts for evaluation. Despite this, the ML reproducibility crisis persists: different hardware, library versions, and initialization seeds often produce meaningfully different results.

**Ablation studies** are essential for papers proposing multi-component systems. Without ablations, you cannot tell which components matter. "We achieve 10% improvement" could mean 8% came from one component and the other four collectively added 2%.

### The Peer Review Process

A submitted paper goes to an area chair (AC) who assigns 3-5 reviewers. In double-blind review, neither reviewers nor authors know each other's identities. Reviewers submit scores (e.g., 1-10) and written reviews. Authors respond to reviews in a rebuttal. AC makes a recommendation; program chairs decide.

Typical acceptance rates: NeurIPS ~26%, ICML ~22%, ICLR ~32%, SOSP ~18%, PLDI ~22%. Rejection is the norm. The best papers are often rejected once.

**Common rejection reasons**: lack of novelty ("similar to prior work X"), insufficient evaluation, missing ablations, unclear writing, overclaiming, or missing important baselines.

**arXiv preprints**: most ML and theory research appears on arXiv months before peer review. This accelerates knowledge dissemination but also means many non-peer-reviewed claims circulate as though established. "Recent papers claim X" ≠ "X is established."

### Staying Current

**Key strategies**: follow top venues on Semantic Scholar/Papers With Code. Set arXiv keyword alerts. Subscribe to researcher Twitter/Bluesky. Read survey papers for comprehensive overviews. Attend or watch conference talks. Follow reproducibility reports.

**Papers With Code** (paperswithcode.com) tracks state-of-the-art on benchmarks with links to implementations — invaluable for ML. **Semantic Scholar** provides citation graphs and AI-powered recommendations. **Google Scholar** for citation counts and author pages.

Understanding research culture makes you a better engineer: you can evaluate vendor claims, prototype new techniques, and distinguish marketing from substance.`,
    quiz: [
      {
        q: 'An ablation study in a systems or ML paper primarily serves to:',
        options: [
          'Demonstrate that the system runs on ablated (simplified) hardware',
          'Identify which components of the proposed system contribute to performance gains',
          'Reduce the paper\'s page count by removing less important experiments',
          'Test the system on datasets not seen during development',
        ],
        correct: 1,
        explanation: 'Ablation studies remove components one at a time to measure each component\'s contribution. Without ablations, improvements cannot be attributed to specific design choices.',
      },
      {
        q: 'The ML reproducibility crisis refers to:',
        options: [
          'Papers being rejected for lack of code submission',
          'Published results that cannot be reproduced due to hardware, seed, or library version differences',
          'Duplicate publications appearing in multiple venues simultaneously',
          'Benchmark datasets being too small for reliable results',
        ],
        correct: 1,
        explanation: 'Many published ML results depend on specific hardware (GPU type), random seeds, or exact library versions. Independent researchers often cannot reproduce claimed improvements, undermining scientific credibility.',
      },
      {
        q: 'CS research differs from most scientific fields in that:',
        options: [
          'CS papers are longer than papers in other fields',
          'CS results can never be formally proved',
          'Primary publication venues are conferences, not journals, so key results appear much faster',
          'CS peer review is single-blind, not double-blind',
        ],
        correct: 2,
        explanation: 'CS, especially ML and systems, primarily publishes at conferences (NeurIPS, SOSP, etc.) rather than journals. This means results appear 1-2 years faster than in biology or physics.',
      },
      {
        q: 'In the three-pass paper reading method, when should you do a full third pass?',
        options: [
          'For every paper you read to ensure complete understanding',
          'Only for foundational papers or papers you intend to build upon or implement',
          'Whenever the abstract seems promising',
          'Before writing the related work section of your own paper',
        ],
        correct: 1,
        explanation: 'A third pass takes 4-5 hours. Most papers only need a first or second pass. Reserve deep reading for foundational papers in your area or papers you will directly use.',
      },
      {
        q: 'A paper reports 10% improvement but provides no confidence intervals across multiple runs. The main concern is:',
        options: [
          'The benchmark may be too easy',
          'The improvement may not be statistically significant — a single run may have gotten lucky with initialization or random data order',
          'The paper may have too many authors',
          'The improvement is too small to be meaningful',
        ],
        correct: 1,
        explanation: 'Without multiple runs and statistical tests, a 10% improvement may fall within variance. Different seeds or slight configuration changes may reverse the result — a core reproducibility concern.',
      },
    ],
  },
]
