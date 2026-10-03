import type { Course } from '../courses'

const CC_CS_OBJ =
  'Master the CS theory that web-dev bootcamps skip — discrete math, algorithms, data structures, operating systems, computer architecture, compilers, networking, and database theory at degree level.'

export const crashCsDegreeCourses: Course[] = [
  {
    id: 'cc-cs-degree-1',
    track: 'crash',
    title: 'Discrete Mathematics & Logic',
    subtitle: 'Proofs, sets, graphs, and the math that powers CS',
    level: 'Masters',
    xp: 130,
    duration: 14,
    module: 1,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Understand propositional and predicate logic, proof techniques, sets, functions, relations, and graph theory fundamentals used throughout computer science.',
    keyTerms: [
      { term: 'Propositional Logic', definition: 'Logic using propositions (true/false statements) connected with AND, OR, NOT, and IF-THEN operators; the foundation of conditional expressions in code.' },
      { term: 'Predicate Logic', definition: 'Extension of propositional logic with quantifiers (∀ for all, ∃ there exists) and variables; enables precise statements about sets of objects.' },
      { term: 'Proof by Induction', definition: 'Proves a statement for all natural numbers via base case (prove P(0)) and inductive step (assume P(k), prove P(k+1)); mirrors recursive function structure.' },
      { term: 'Set Theory', definition: 'Mathematical study of collections of objects with operations union, intersection, difference, and complement; basis for type systems, databases, and probability.' },
      { term: 'Graph Theory', definition: 'Study of vertices (nodes) and edges (connections); models networks, dependency graphs, state machines, and social relationships.' },
      { term: 'Boolean Algebra', definition: 'Algebraic system with values {0,1} and operations AND, OR, NOT; the mathematical foundation of digital circuits and logic gates.' },
    ],
    content: `## Why Discrete Math Is the Backbone of CS

Every time you write an \`if\` statement you are applying propositional logic. Every time you recurse you are relying on mathematical induction. Every time a social network recommends a friend it traverses a graph. Discrete mathematics is not an abstract curiosity — it is the shared language that lets us reason precisely about algorithms, data structures, programming languages, cryptography, and databases.

The word *discrete* means made of distinct, separate parts — integers rather than real numbers, finite graphs rather than smooth curves. That matches how computers work: bits are 0 or 1, memory addresses are whole numbers, loops run a countable number of times.

## Propositional Logic

A *proposition* is any statement that is either true or false. "The value is greater than zero" is a proposition. "What time is it?" is not.

We combine propositions with *connectives*:

| Symbol | Name | Meaning |
|--------|------|---------|
| ¬P | Negation | NOT P |
| P ∧ Q | Conjunction | P AND Q |
| P ∨ Q | Disjunction | P OR Q |
| P → Q | Implication | If P then Q |
| P ↔ Q | Biconditional | P if and only if Q |

A *truth table* lists every combination of truth values for the variables and shows the resulting value of the compound expression. For two variables there are 2² = 4 rows; for n variables there are 2ⁿ rows.

**Tautologies and contradictions**: a tautology is always true (P ∨ ¬P); a contradiction is always false (P ∧ ¬P). Compilers use tautology detection to eliminate dead code.

**De Morgan's Laws** are essential for simplifying Boolean expressions in code:

\`\`\`
¬(P ∧ Q) ≡ ¬P ∨ ¬Q
¬(P ∨ Q) ≡ ¬P ∧ ¬Q
\`\`\`

In JavaScript: \`!(a && b)\` is equivalent to \`!a || !b\`.

## Predicate Logic

Propositional logic treats statements as atomic. *Predicate logic* (first-order logic) adds variables, predicates, and quantifiers, letting us say things like "for every integer n, n² ≥ 0."

- **Universal quantifier** ∀x P(x): "For all x, P(x) is true."
- **Existential quantifier** ∃x P(x): "There exists an x such that P(x) is true."

Negating quantifiers: ¬(∀x P(x)) ≡ ∃x ¬P(x). This is why a single counterexample disproves a universal claim.

Database \`WHERE\` clauses are essentially existential queries. Type systems in languages like TypeScript use predicate logic to express type constraints.

## Proof Techniques

**Direct proof**: Assume P, deduce Q. To prove "if n is even then n² is even": let n = 2k, then n² = 4k² = 2(2k²), which is even. ✓

**Proof by contradiction**: Assume ¬Q, derive a contradiction, conclude Q. The classic proof that √2 is irrational follows this pattern.

**Proof by contrapositive**: Prove ¬Q → ¬P instead of P → Q (logically equivalent). Often simpler.

**Mathematical induction** proves statements about natural numbers:
1. *Base case*: prove P(0) or P(1).
2. *Inductive step*: assume P(k) (the inductive hypothesis), prove P(k+1).

This mirrors recursive thinking. If you can handle the base case and you know how to reduce a problem of size k+1 to a problem of size k, you have a recursive algorithm — and induction proves it correct.

*Strong induction* lets the inductive hypothesis cover all values up to k, not just k itself. It is used to prove properties of algorithms that reduce to subproblems of varying sizes.

## Set Theory

A *set* is an unordered collection of distinct elements. Sets underlie type theory, database relations, and formal language definitions.

Key operations:
- **Union** A ∪ B: elements in A or B (or both)
- **Intersection** A ∩ B: elements in both A and B
- **Difference** A − B: elements in A but not B
- **Complement** Ā: elements not in A (relative to a universal set)
- **Power set** P(A): the set of all subsets of A; |P(A)| = 2^|A|

*Cardinality* is the number of elements. For infinite sets, Cantor showed that the set of real numbers is "more infinite" than the set of integers — there are different sizes of infinity.

A *function* f: A → B maps each element of A (the domain) to exactly one element of B (the codomain). Functions are injective (one-to-one), surjective (onto), or bijective (both). Bijections between sets prove they have the same cardinality.

## Relations

A *relation* R on a set A is a subset of A × A. Properties matter for database design and type systems:

- **Reflexive**: (a, a) ∈ R for all a
- **Symmetric**: (a, b) ∈ R implies (b, a) ∈ R
- **Antisymmetric**: (a, b) ∈ R and (b, a) ∈ R implies a = b
- **Transitive**: (a, b) ∈ R and (b, c) ∈ R implies (a, c) ∈ R

An *equivalence relation* is reflexive, symmetric, and transitive — it partitions a set into equivalence classes. This models "same type" in type theory and "same bucket" in hash tables.

A *partial order* is reflexive, antisymmetric, and transitive — it models dependency graphs and version orderings.

## Graph Theory

A *graph* G = (V, E) consists of *vertices* V and *edges* E ⊆ V × V.

- **Undirected graph**: edges have no direction (friendship network)
- **Directed graph (digraph)**: edges have direction (Twitter follow)
- **Weighted graph**: edges carry a numeric weight (road distances)

Fundamental concepts:
- **Degree** of a vertex: number of edges incident to it
- **Path**: sequence of vertices connected by edges
- **Cycle**: path that starts and ends at the same vertex
- **Connected graph**: there is a path between every pair of vertices
- **Tree**: connected graph with no cycles; a tree on n vertices has exactly n−1 edges

**Handshaking lemma**: the sum of all vertex degrees equals twice the number of edges (each edge contributes to two vertices' degrees).

Graph representations in code:
- **Adjacency matrix**: 2D array; O(1) edge lookup; O(V²) space
- **Adjacency list**: array of lists; O(V + E) space; better for sparse graphs

Graphs appear everywhere: dependency resolution (npm/yarn), social networks, route finding, compiler control-flow analysis, and database query planning.

## Counting and Combinatorics

Combinatorics answers "how many?" questions that arise in algorithm analysis.

- **Rule of product**: if task 1 has m outcomes and task 2 has n outcomes, together they have m·n outcomes.
- **Permutations**: ordered arrangements of r items from n: P(n,r) = n!/(n−r)!
- **Combinations**: unordered selections of r items from n: C(n,r) = n! / (r!(n−r)!)
- **Pigeonhole principle**: if n+1 items are placed in n boxes, at least one box holds 2 items. This proves that no lossless compression algorithm can compress all inputs, and that hash collisions are inevitable.

The *binomial theorem* — (a+b)ⁿ = Σ C(n,k) aᵏ bⁿ⁻ᵏ — appears in probability, generating functions, and the analysis of divide-and-conquer recurrences.`,
    quiz: [
      {
        q: 'Which proof technique mirrors the structure of recursion?',
        options: [
          'Direct proof',
          'Proof by contradiction',
          'Mathematical induction',
          'Proof by contrapositive',
        ],
        correct: 2,
        explanation:
          'Induction has a base case and an inductive step that reduces size k+1 to size k, exactly mirroring a recursive function with a base case and a recursive call.',
      },
      {
        q: "De Morgan's Law states that ¬(P ∧ Q) is equivalent to:",
        options: ['¬P ∧ ¬Q', '¬P ∨ ¬Q', 'P ∨ Q', '¬P → ¬Q'],
        correct: 1,
        explanation:
          "De Morgan's first law: NOT (P AND Q) equals (NOT P) OR (NOT Q). In code: !(a && b) === !a || !b.",
      },
      {
        q: 'How many subsets does a set with 4 elements have?',
        options: ['4', '8', '16', '12'],
        correct: 2,
        explanation:
          'The power set of a set with n elements has 2ⁿ elements. 2⁴ = 16.',
      },
      {
        q:
          'A graph that is connected and has no cycles is called a(n):',
        options: ['Complete graph', 'Bipartite graph', 'Tree', 'Eulerian graph'],
        correct: 2,
        explanation:
          'A tree is defined as a connected acyclic graph. A tree on n vertices has exactly n−1 edges.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a function `isPrime(n)` that uses a loop to test primality, then write a function `sieve(limit)` that returns all primes up to `limit` using the Sieve of Eratosthenes. Return the primes as an array.',
      starterCode: `function isPrime(n) {
  // TODO: return true if n is prime, false otherwise
}

function sieve(limit) {
  // TODO: return array of all primes <= limit
  // Use the Sieve of Eratosthenes
}

console.log(isPrime(17));   // true
console.log(isPrime(18));   // false
console.log(sieve(30));     // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
`,
      solution: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function sieve(limit) {
  const composite = new Array(limit + 1).fill(false);
  composite[0] = composite[1] = true;
  for (let i = 2; i * i <= limit; i++) {
    if (!composite[i]) {
      for (let j = i * i; j <= limit; j += i) {
        composite[j] = true;
      }
    }
  }
  return Array.from({ length: limit + 1 }, (_, i) => i).filter(i => !composite[i] && i >= 2);
}

console.log(isPrime(17));   // true
console.log(isPrime(18));   // false
console.log(sieve(30));     // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
`,
    },
  },

  {
    id: 'cc-cs-degree-2',
    track: 'crash',
    title: 'Algorithms & Complexity',
    subtitle: 'Big-O, sorting, searching, and problem complexity classes',
    level: 'Masters',
    xp: 140,
    duration: 15,
    module: 2,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Analyse algorithm efficiency using Big-O notation, master classical sorting and searching algorithms, and understand P vs NP complexity classes.',
    keyTerms: [
      { term: 'Big-O Notation', definition: 'Describes worst-case growth rate of an algorithm as input size n grows, ignoring constants: O(n²) means runtime grows quadratically.' },
      { term: 'Time Complexity', definition: 'How runtime scales with input size, measured in Big-O. O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) — the hierarchy every developer must know.' },
      { term: 'Space Complexity', definition: 'How memory usage scales with input size; auxiliary space excludes the input itself — recursion depth counts as stack space.' },
      { term: 'Divide and Conquer', definition: 'Algorithm strategy: split into smaller subproblems, solve recursively, combine results. Used in mergesort (O(n log n)) and binary search (O(log n)).' },
      { term: 'NP-Completeness', definition: 'Problems verifiable in polynomial time but with no known polynomial-time solution; Traveling Salesman and Boolean SAT are canonical examples.' },
      { term: 'Recurrence Relation', definition: 'Equation defining algorithm cost in terms of subproblem costs; solved with the Master Theorem to give Big-O for divide-and-conquer algorithms.' },
    ],
    content: `## What Is an Algorithm?

An algorithm is a finite, unambiguous sequence of instructions that solves a problem for any valid input. The key word is *any*: an algorithm must work not just on the examples you tested but on every possible input in its domain. This is why we analyse worst-case performance, not average-case alone.

Algorithm analysis asks two questions: how much *time* does this take, and how much *memory* does it need? We answer both using asymptotic notation — a mathematical language for describing growth rates.

## Big-O Notation

Big-O characterises the *upper bound* on the growth of a function. f(n) = O(g(n)) means that beyond some point, f grows no faster than a constant multiple of g.

Practically: drop constants and lower-order terms. If your algorithm does 3n² + 7n + 12 operations, the runtime is O(n²). The constant 3 and the lower-order 7n vanish because for large n they become irrelevant.

**Common complexity classes (fastest to slowest)**:

| Class | Name | Example |
|-------|------|---------|
| O(1) | Constant | Array index lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear scan |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Brute-force subset enumeration |
| O(n!) | Factorial | Brute-force TSP |

**Omega notation** Ω(g) gives a *lower bound*. **Theta notation** Θ(g) means both O(g) and Ω(g) — an exact tight bound. When people say merge sort is "O(n log n)" they usually mean Θ(n log n).

## Recurrence Relations

Divide-and-conquer algorithms split a problem of size n into subproblems, solve them recursively, and combine results. Their runtime satisfies a *recurrence relation*.

Merge sort splits into two halves and does O(n) work to merge:
\`\`\`
T(n) = 2T(n/2) + O(n)
\`\`\`

The **Master Theorem** solves recurrences of the form T(n) = aT(n/b) + O(nᵈ):
- If d > log_b(a): T(n) = Θ(nᵈ)
- If d = log_b(a): T(n) = Θ(nᵈ log n)  ← merge sort case
- If d < log_b(a): T(n) = Θ(n^(log_b a))

For merge sort: a=2, b=2, d=1. log₂2 = 1 = d → T(n) = Θ(n log n). ✓

## Sorting Algorithms

### Comparison-Based Sorts

**Bubble sort** O(n²): repeatedly swap adjacent elements that are out of order. Educational only — never use in production.

**Insertion sort** O(n²) worst case, O(n) best case: build a sorted prefix one element at a time. Excellent for nearly-sorted data and small arrays (< 20 elements). Most standard library implementations switch to insertion sort for small sub-arrays.

**Merge sort** O(n log n): split the array in half, recursively sort each half, merge the two sorted halves. Stable, predictable, but requires O(n) extra space.

**Quick sort** O(n log n) average, O(n²) worst case: choose a pivot, partition elements smaller/larger, recurse. In practice the fastest due to cache locality. Worst case is avoided with randomised pivot selection or the median-of-three heuristic.

**Heap sort** O(n log n) worst case, O(1) extra space: build a max-heap, extract maximum n times. Optimal in both time and space but poor cache behaviour.

**Lower bound for comparison sorts**: any algorithm that sorts by comparisons requires Ω(n log n) comparisons in the worst case. Proof: a sorting algorithm corresponds to a decision tree with n! leaves (all permutations); a binary tree with n! leaves has height at least log₂(n!) = Ω(n log n) by Stirling's approximation.

### Non-Comparison Sorts

**Counting sort** O(n + k): counts occurrences of each of k possible values. O(k) extra space. Only works for integers in a known range.

**Radix sort** O(d·(n + k)): sorts integers digit by digit using a stable sort at each step. Effectively linear when d (digits) is constant.

**Bucket sort** O(n) average: distributes elements into buckets, sorts each bucket, concatenates. Requires knowing the distribution.

## Searching

**Linear search** O(n): scan the array. Works on unsorted data.

**Binary search** O(log n): on a sorted array, compare the middle element and eliminate half the search space each step. Requires sorted input. This pattern generalises: whenever you can eliminate half the possibilities each step, you achieve logarithmic complexity.

Binary search on the answer is a powerful technique: instead of searching for a value in an array, "search" for the answer in the range of possible answers, using a feasibility check as the comparison.

## Graph Algorithms

**Breadth-first search (BFS)** O(V + E): explores nodes layer by layer. Finds shortest paths in unweighted graphs. Uses a queue.

**Depth-first search (DFS)** O(V + E): explores as far as possible before backtracking. Uses a stack (or recursion). Foundation for topological sort and strongly connected components.

**Dijkstra's algorithm** O((V + E) log V) with a binary heap: shortest paths from a single source in a weighted graph with non-negative weights.

**Bellman-Ford** O(V·E): handles negative weights, detects negative cycles.

**Floyd-Warshall** O(V³): all-pairs shortest paths using dynamic programming.

## Dynamic Programming

Dynamic programming (DP) solves problems by breaking them into overlapping subproblems, solving each once, and storing results (*memoisation* or *tabulation*).

Two conditions for DP applicability:
1. **Optimal substructure**: an optimal solution incorporates optimal solutions to subproblems.
2. **Overlapping subproblems**: the same subproblems recur many times.

Classic examples: Fibonacci (O(2ⁿ) naive → O(n) with DP), longest common subsequence, 0/1 knapsack, edit distance (used in spell checkers and git diff), coin change.

The key insight is that memoisation converts exponential tree recursion into polynomial-time table filling.

## Greedy Algorithms

A greedy algorithm makes the locally optimal choice at each step. Greedy works when the problem has the *greedy choice property* (a global optimum can be reached by local optima) and *optimal substructure*.

Examples: activity selection (always choose the job that finishes earliest), Huffman coding (always merge the two least-frequent symbols), Kruskal's and Prim's minimum spanning tree algorithms.

Greedy often *fails* for problems like the general knapsack — a simple exchange argument or counterexample suffices to show this.

## Complexity Classes: P vs NP

**P** is the class of problems solvable in polynomial time O(nᵏ) for some constant k.

**NP** (non-deterministic polynomial) is the class of problems where a proposed solution can be *verified* in polynomial time, even if finding it is hard. Every problem in P is also in NP.

**NP-complete** problems are the hardest problems in NP: if you could solve any NP-complete problem in polynomial time, you could solve all NP problems in polynomial time (Cook-Levin theorem). Classic NP-complete problems: SAT (satisfiability), 3-SAT, graph colouring, Hamiltonian cycle, TSP (decision version), subset sum.

**P vs NP** is the most famous open problem in computer science. Most researchers believe P ≠ NP, meaning NP-complete problems have no polynomial algorithm — but no one has proved it.

**NP-hard** problems are at least as hard as NP-complete problems but may not be in NP (e.g., the optimisation version of TSP).

**Practical implications**: when you recognise that a problem is NP-complete, you stop searching for an exact polynomial algorithm and instead use approximation algorithms, heuristics, or exploit the structure of practical instances.

## Space Complexity

Space complexity counts the extra memory an algorithm uses (beyond the input). Merge sort is O(n) space; quicksort is O(log n) on the call stack; in-place algorithms are O(1).

There is often a time-space trade-off: memoisation sacrifices space to save time; streaming algorithms sacrifice accuracy to save space.`,
    quiz: [
      {
        q:
          'What is the time complexity of binary search on a sorted array of n elements?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct: 1,
        explanation:
          'Binary search halves the search space at each step, giving O(log n) comparisons.',
      },
      {
        q:
          'Which sorting algorithm has the best worst-case time complexity with O(1) extra space?',
        options: ['Merge sort', 'Quick sort', 'Heap sort', 'Insertion sort'],
        correct: 2,
        explanation:
          'Heap sort achieves O(n log n) worst case with only O(1) extra space (in-place). Merge sort is O(n log n) but needs O(n) space. Quicksort has O(n²) worst case.',
      },
      {
        q:
          'A problem is NP-complete if it is in NP and:',
        options: [
          'It can be solved in polynomial time',
          'Every problem in NP can be reduced to it in polynomial time',
          'It has no known algorithm',
          'Its solution can be found but not verified efficiently',
        ],
        correct: 1,
        explanation:
          'NP-complete problems are NP-hard (every NP problem reduces to them) and in NP (solutions are verifiable in polynomial time).',
      },
      {
        q:
          'Dynamic programming improves over naive recursion by:',
        options: [
          'Using more memory to avoid recomputing overlapping subproblems',
          'Always choosing the greedy local optimum',
          'Sorting the input first',
          'Parallelising independent subproblems',
        ],
        correct: 0,
        explanation:
          'DP stores solutions to subproblems (memoisation/tabulation) so each is solved once, converting exponential time into polynomial time at the cost of space.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement merge sort. Your function `mergeSort(arr)` should return a new sorted array. Also implement a helper `merge(left, right)` that merges two sorted arrays into one sorted array.',
      starterCode: `function merge(left, right) {
  // TODO: merge two sorted arrays into one sorted array
}

function mergeSort(arr) {
  // TODO: implement merge sort recursively
}

console.log(mergeSort([5, 3, 8, 1, 9, 2, 7, 4, 6]));
// Expected: [1, 2, 3, 4, 5, 6, 7, 8, 9]
`,
      solution: `function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

console.log(mergeSort([5, 3, 8, 1, 9, 2, 7, 4, 6]));
// Expected: [1, 2, 3, 4, 5, 6, 7, 8, 9]
`,
    },
  },

  {
    id: 'cc-cs-degree-3',
    track: 'crash',
    title: 'Data Structures Deep Dive',
    subtitle: 'Trees, graphs, heaps, and hash tables from first principles',
    level: 'Masters',
    xp: 140,
    duration: 15,
    module: 3,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Implement and analyse advanced data structures including binary search trees, AVL trees, heaps, hash tables with collision resolution, and understand when to use each.',
    keyTerms: [
      { term: 'Binary Search Tree', definition: 'Tree where left child < parent < right child; O(log n) search, insert, delete when balanced — degrades to O(n) when skewed.' },
      { term: 'AVL Tree', definition: 'Self-balancing BST maintaining |balance factor| ≤ 1 via rotations after each insert/delete; guarantees O(log n) operations regardless of input order.' },
      { term: 'Hash Collision', definition: 'Two keys mapping to the same hash bucket; resolved by chaining (linked lists per bucket) or open addressing (probing for the next empty slot).' },
      { term: 'Heap Property', definition: 'In a min-heap, every parent ≤ its children; enables O(1) min access and O(log n) insert/delete via sift-up/sift-down.' },
      { term: 'Amortised Analysis', definition: 'Average cost per operation over a sequence; shows that expensive occasional operations (dynamic array resize) are offset by cheap frequent ones, giving O(1) amortised append.' },
      { term: 'Graph Representation', definition: 'Adjacency matrix: O(V²) space, O(1) edge lookup. Adjacency list: O(V+E) space, O(degree) edge lookup. Choose based on graph density.' },
    ],
    content: `## Data Structures as Contracts

A data structure is not just a container — it is a *contract* about what operations are supported and at what cost. Choosing the wrong data structure is often the cause of performance bottlenecks that no amount of micro-optimisation can fix.

## Arrays and Linked Lists Revisited

An **array** stores elements in contiguous memory, giving O(1) random access by index. Insertion and deletion in the middle are O(n) because elements must shift. Dynamic arrays (JavaScript arrays, C++ vector, Python list) amortise the cost of resizing: when the buffer fills, it is doubled, so the average cost per push is O(1) — this is *amortised* O(1).

A **linked list** stores each element in a node that holds a value and a pointer to the next node. Random access is O(n); prepend/delete-head is O(1). Doubly-linked lists add a previous pointer, making tail insertion and deletion O(1). The trade-off: linked lists have poor cache locality — each node might be anywhere in memory, causing frequent cache misses.

A **doubly-linked list + hash map** combination gives O(1) access *and* O(1) insertion/deletion — this is the implementation behind LRU caches.

## Stacks and Queues

A **stack** is last-in, first-out (LIFO): push and pop from the same end. Used for: function call stacks, expression evaluation, backtracking DFS, undo history.

A **queue** is first-in, first-out (FIFO): enqueue at the back, dequeue from the front. Used for: BFS, task scheduling, print queues. A **deque** (double-ended queue) supports O(1) operations at both ends.

A **priority queue** dequeues the *highest priority* element first, regardless of insertion order. The canonical implementation is a heap.

## Binary Trees

A **binary tree** is a rooted tree where each node has at most two children (left and right). Key terminology:
- **Height**: the length of the longest path from root to a leaf
- **Depth** of a node: its distance from the root
- **Complete binary tree**: all levels full except possibly the last, filled left to right
- **Balanced binary tree**: the heights of left and right subtrees of every node differ by at most some constant

A **binary search tree (BST)** maintains the invariant: for every node n, all values in n's left subtree are less than n's value, and all values in n's right subtree are greater. This enables O(height) search, insertion, and deletion.

In the worst case (inserting sorted data), a BST degenerates to a linked list with O(n) height. To guarantee O(log n) height, we need *self-balancing* BSTs.

## AVL Trees

An **AVL tree** (Adelson-Velsky and Landis, 1962) is a BST where the *balance factor* (height of right subtree minus height of left subtree) of every node is −1, 0, or +1. This guarantees height O(log n).

When an insertion or deletion violates the balance condition, we restore it with **rotations**:

- **Left rotation**: when the right subtree is too heavy
- **Right rotation**: when the left subtree is too heavy
- **Left-right rotation** and **right-left rotation** for the two zig-zag cases

Each rotation takes O(1) time. After an insertion, at most O(log n) rotations are needed.

**Red-Black trees** are another self-balancing BST variant used in most standard library implementations (Java TreeMap, C++ std::map, Linux kernel). They use colour bits to enforce a weaker balance condition, requiring fewer rotations on average.

## Heaps

A **heap** is a complete binary tree satisfying the *heap property*:
- **Max-heap**: every node's value ≥ its children's values
- **Min-heap**: every node's value ≤ its children's values

Heaps are stored as arrays: for a node at index i, its left child is at 2i+1, right child at 2i+2, and parent at ⌊(i−1)/2⌋. This array layout gives excellent cache locality.

**Heap operations**:
- **Insert**: add at end, bubble up — O(log n)
- **Extract-max/min**: swap root with last, remove last, bubble down (*heapify*) — O(log n)
- **Peek**: read root — O(1)
- **Build heap from array**: O(n) (not O(n log n) — the proof is a clever sum of geometric series)

Heaps power priority queues, heap sort, and Dijkstra's algorithm.

## Hash Tables

A **hash table** maps keys to values in O(1) average time. It works by applying a *hash function* to the key, producing an index into a fixed-size array (the *table*).

A good hash function distributes keys uniformly, is fast to compute, and is deterministic. For strings: polynomial rolling hash (used in Java's String.hashCode). For integers: multiply-shift or FNV.

### Collision Resolution

Two keys that hash to the same index cause a *collision*. The two main strategies:

**Separate chaining**: each table slot holds a linked list (or dynamic array) of all key-value pairs that hash there. Worst case: all keys hash to the same slot → O(n) per operation. Average case with a good hash function and load factor α = n/m (n items, m slots): O(1 + α).

**Open addressing**: if the target slot is occupied, probe for the next empty slot. Probing sequences:
- **Linear probing**: check slot h, h+1, h+2, ... → simple but causes *primary clustering*
- **Quadratic probing**: h, h+1, h+4, h+9, ... → less clustering
- **Double hashing**: h₁(k) + i·h₂(k) → best distribution

**Load factor**: hash tables resize (rehash) when the load factor exceeds a threshold (typically 0.75). JavaScript object properties and Map are backed by hash tables. Python dict uses open addressing with a smart probe sequence.

**Hash collisions as attacks**: if an attacker can send data that all hashes to the same slot, a hash table degrades to O(n). Most languages now randomise hash seeds per process to prevent this.

## Graphs Revisited: Representations

Choosing between an adjacency matrix and an adjacency list depends on the graph's *density*.

**Adjacency matrix** (V×V boolean array):
- Edge lookup: O(1)
- Iterating neighbours: O(V)
- Space: O(V²) — only practical for dense graphs where E ≈ V²

**Adjacency list** (array of V lists, total size E):
- Edge lookup: O(degree) or O(1) with a hash set
- Iterating neighbours: O(degree)
- Space: O(V + E) — ideal for sparse graphs (most real-world graphs)

## Disjoint Set Union (Union-Find)

The **union-find** data structure tracks a partition of a set into disjoint subsets. It supports:
- **Find(x)**: return the representative of x's set — nearly O(1)
- **Union(x, y)**: merge the sets containing x and y — nearly O(1)

With *union by rank* and *path compression*, both operations are O(α(n)) amortised, where α is the inverse Ackermann function — effectively O(1) for all practical n.

Union-Find is the backbone of Kruskal's MST algorithm and cycle detection in graphs.

## Tries (Prefix Trees)

A **trie** is a tree where each edge represents a character. A string is stored by tracing the path from root corresponding to its characters. Tries give O(|key|) insertion, search, and prefix matching, independent of the number of keys.

Tries are used in autocomplete, spell checkers, IP routing tables, and compilers' symbol tables. A *compressed trie* (Patricia trie) merges chains of single-child nodes to reduce space.

## Amortised Analysis

Some data structures have expensive occasional operations that are more than compensated by cheap typical operations. *Amortised analysis* spreads the cost of occasional expensive operations across many cheap ones.

**Dynamic array**: most pushes are O(1); a resize is O(n). But resizes are rare: after n elements are inserted into an initially empty array, the total work is O(n), so the amortised cost per operation is O(1).

**Banker's method**: assign credits to cheap operations; expensive operations spend saved credits. **Potential method**: define a potential function over the data structure; the amortised cost equals actual cost plus change in potential.`,
    quiz: [
      {
        q:
          'What property does an AVL tree maintain to guarantee O(log n) height?',
        options: [
          'All leaves are at the same depth',
          'The balance factor of every node is between −1 and +1',
          'The tree is always a complete binary tree',
          'Every node has exactly two children',
        ],
        correct: 1,
        explanation:
          'AVL trees enforce that the height difference between left and right subtrees of any node is at most 1, keeping the tree height O(log n).',
      },
      {
        q:
          'In a binary heap stored as an array, what is the index of the left child of node at index i?',
        options: ['2i', '2i + 1', '2i + 2', 'i / 2'],
        correct: 1,
        explanation:
          'In a 0-indexed heap array, the left child of node i is at 2i+1 and the right child is at 2i+2.',
      },
      {
        q:
          'Hash table performance degrades when the load factor is too high because:',
        options: [
          'Hash functions slow down',
          'More collisions occur, lengthening probe sequences or chains',
          'Keys can no longer be hashed',
          'Memory fragmentation increases',
        ],
        correct: 1,
        explanation:
          'A high load factor (n/m approaching 1) means many slots are occupied, causing more collisions and longer search chains, degrading average O(1) toward O(n).',
      },
      {
        q:
          'What is the time complexity of building a heap from an unsorted array of n elements?',
        options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
        correct: 1,
        explanation:
          'The bottom-up heap construction algorithm is O(n) because nodes near the leaves (most nodes) require very few heapify steps.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a MinHeap class with `insert(val)`, `extractMin()`, and `peek()` methods. Use an array to store the heap and implement `bubbleUp` and `bubbleDown` helpers.',
      starterCode: `class MinHeap {
  constructor() {
    this.heap = [];
  }

  peek() {
    // TODO: return the minimum element without removing it
  }

  insert(val) {
    // TODO: add val and restore heap property
  }

  extractMin() {
    // TODO: remove and return the minimum element
  }

  // helpers
  bubbleUp(i) { /* TODO */ }
  bubbleDown(i) { /* TODO */ }
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

const h = new MinHeap();
h.insert(5); h.insert(3); h.insert(8); h.insert(1);
console.log(h.peek());        // 1
console.log(h.extractMin());  // 1
console.log(h.peek());        // 3
`,
      solution: `class MinHeap {
  constructor() {
    this.heap = [];
  }

  peek() { return this.heap[0]; }

  insert(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent] <= this.heap[i]) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  bubbleDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

const h = new MinHeap();
h.insert(5); h.insert(3); h.insert(8); h.insert(1);
console.log(h.peek());        // 1
console.log(h.extractMin());  // 1
console.log(h.peek());        // 3
`,
    },
  },

  {
    id: 'cc-cs-degree-4',
    track: 'crash',
    title: 'Operating Systems',
    subtitle: 'Processes, threads, scheduling, and memory management',
    level: 'Masters',
    xp: 130,
    duration: 14,
    module: 4,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Understand how operating systems manage processes, threads, CPU scheduling, memory (virtual memory, paging, segmentation), and handle concurrency and synchronisation.',
    keyTerms: [
      { term: 'Process vs Thread', definition: 'A process is an isolated program with its own memory space; a thread is a lightweight execution unit sharing memory within a process — threads communicate faster but are harder to isolate.' },
      { term: 'Context Switch', definition: "Saving one process's CPU state (registers, PC) and restoring another's; has overhead that limits how often the scheduler should preempt." },
      { term: 'Virtual Memory', definition: 'Abstraction giving each process a private address space backed by RAM + disk; enables isolation, memory larger than physical RAM, and copy-on-write optimizations.' },
      { term: 'Page Fault', definition: 'Access to a virtual address not currently in RAM; OS loads the page from disk (major fault) or initializes it (minor fault) and resumes execution transparently.' },
      { term: 'Deadlock', definition: 'Circular wait where each process holds a resource another needs; the four Coffman conditions are mutual exclusion, hold-and-wait, no preemption, and circular wait.' },
      { term: 'Semaphore', definition: 'Integer counter with atomic wait() (decrement, block if zero) and signal() (increment, wake waiter); used for mutual exclusion and producer-consumer synchronization.' },
    ],
    content: `## The Operating System as Referee

An operating system (OS) is the software layer between application programs and hardware. Its three core jobs are: resource management (CPU, memory, I/O), abstraction (hide hardware details behind clean interfaces), and isolation (prevent processes from interfering with each other).

Without an OS, every program would need to speak directly to the hardware, and two programs running simultaneously could corrupt each other's memory. The OS prevents this through *privilege levels* (kernel mode vs user mode) enforced by the CPU.

## Processes

A **process** is a running instance of a program. It consists of:
- **Code segment**: the compiled instructions
- **Data segment**: global and static variables
- **Heap**: dynamically allocated memory (malloc/new)
- **Stack**: local variables and call frames
- **Process Control Block (PCB)**: OS metadata — PID, state, CPU registers, open files, scheduling information

The **process lifecycle** flows through states: New → Ready → Running → Waiting → Terminated.

A process transitions from Running to Waiting when it needs I/O (e.g., reading a file). It moves back to Ready when the I/O completes. The OS **scheduler** selects which Ready process runs next.

**Process creation**: Unix uses \`fork()\` to duplicate the current process (copy-on-write), then \`exec()\` to replace the new process's image with a program. The parent-child relationship creates a process tree. Zombie processes: a child that has exited but whose parent hasn't called \`wait()\` to read its exit status.

**Inter-process communication (IPC)**: processes are isolated, so they communicate via: pipes, named pipes (FIFOs), message queues, shared memory, sockets, and signals.

## Threads

A **thread** is a lightweight unit of execution within a process. Threads in the same process share the code, data, heap, and open files, but each has its own stack and register state.

Benefits of threads over processes:
- **Faster creation**: no need to duplicate address space
- **Cheaper context switching**: same address space
- **Natural for parallelism**: web servers handle each request in a thread

Costs of threads: shared memory requires synchronisation to avoid race conditions.

**User threads vs kernel threads**: user-level threads are managed by a library (faster context switch, but if one blocks, all block). Kernel threads are managed by the OS (slower, but true parallelism).

**Thread models**: 1:1 (one user thread to one kernel thread — Linux pthreads), N:1 (all user threads on one kernel thread), M:N (M user threads on N kernel threads).

## CPU Scheduling

The scheduler decides which process/thread runs on the CPU and for how long.

**Scheduling criteria**:
- **CPU utilisation**: keep CPU busy
- **Throughput**: jobs completed per unit time
- **Turnaround time**: time from submission to completion
- **Waiting time**: time spent in the ready queue
- **Response time**: time until first response (important for interactive systems)

**Scheduling algorithms**:

**First-Come, First-Served (FCFS)**: run processes in arrival order. Simple but causes the *convoy effect* — short jobs wait behind long ones.

**Shortest Job First (SJF)**: run the process with the shortest expected CPU burst. Optimal for average waiting time, but requires knowing burst lengths in advance.

**Shortest Remaining Time First (SRTF)**: preemptive SJF — the running job is preempted if a new arrival has a shorter remaining time.

**Round Robin (RR)**: each process gets a fixed *time quantum* (typically 10–100ms), then is moved to the back of the queue. Fair and good for interactive systems. The quantum size matters: too short → too many context switches; too long → degenerates to FCFS.

**Priority scheduling**: each process has a priority; the highest-priority ready process runs. Problem: *starvation* — low-priority processes may never run. Solution: *aging* (gradually increase priority of waiting processes).

**Multilevel feedback queues (MLFQ)**: the dominant approach in real OSes. Multiple queues with different priorities and time quanta. Processes move between queues based on behaviour — CPU-bound processes drift to low-priority queues; interactive processes stay high.

## Memory Management

Physical memory is limited and must be shared among many processes. The OS provides the illusion of a private address space through **virtual memory**.

Each process sees a virtual address space (e.g., 48-bit on x86-64: 256 TB). The **Memory Management Unit (MMU)** translates virtual addresses to physical addresses using a **page table**.

**Paging**: both virtual and physical memory are divided into fixed-size blocks called *pages* (virtual) and *frames* (physical), typically 4 KB. The page table maps virtual page numbers to physical frame numbers. Translation: split the virtual address into a page number and an offset.

**Page table overhead**: a 64-bit address space with 4 KB pages would need 2⁵² page table entries — far too large. Solution: **multi-level page tables** (hierarchical, used in x86-64: 4 levels) store only the entries that are actually used.

**Translation Lookaside Buffer (TLB)**: a hardware cache of recent page table entries. Without it, every memory access would require multiple memory lookups for page table traversal. TLB hit: ~1 cycle. TLB miss: ~100 cycles to walk the page table.

**Page faults**: if a page is not currently in physical memory (it was swapped to disk), the CPU raises a page fault. The OS finds the page on disk, loads it into a free frame (possibly evicting another page), updates the page table, and retries the instruction.

**Page replacement algorithms**:
- **FIFO**: replace the oldest page — simple but suffers from Bélády's anomaly (more frames → more faults)
- **LRU**: replace the least recently used page — good approximation of the optimal, but expensive to implement exactly
- **Clock algorithm**: approximate LRU using a reference bit — widely used in real OSes

**Segmentation**: some architectures (historical x86) divide memory into variable-size segments (code, data, stack). Each segment has a base address and limit. Modern x86-64 effectively ignores segments and uses paging only.

## Concurrency and Synchronisation

**Race condition**: two threads access shared data concurrently and the result depends on the order of execution. To reason correctly about concurrent code, we need *mutual exclusion*.

A **critical section** is code that accesses shared data and must not be executed by more than one thread at a time.

Requirements for a correct mutual exclusion solution:
1. **Mutual exclusion**: at most one thread in the critical section
2. **Progress**: if no thread is in the critical section, a waiting thread must eventually enter
3. **Bounded waiting**: a thread must not wait forever

**Mutex (mutual exclusion lock)**: \`lock()\` before entering the critical section, \`unlock()\` after. Implemented using hardware atomic operations (test-and-set, compare-and-swap).

**Semaphore**: a generalisation of a mutex. A counting semaphore has an integer value; \`wait()\` (P) decrements it (blocking if 0); \`signal()\` (V) increments it. Binary semaphore = mutex. Counting semaphores manage a pool of resources.

**Monitor**: a higher-level synchronisation construct combining mutual exclusion with *condition variables*. Condition variables allow threads to wait for a condition to become true without holding the lock. Used in Java (synchronized methods, wait/notify), Python (threading.Condition).

**Deadlock** occurs when a set of processes are each waiting for a resource held by another:

Four necessary conditions (Coffman conditions):
1. Mutual exclusion
2. Hold and wait
3. No preemption
4. Circular wait

Prevention: ensure at least one condition cannot hold. Avoidance: use Banker's algorithm to only grant requests that leave the system in a safe state. Detection and recovery: let deadlocks happen, detect cycles in the resource allocation graph, kill/preempt to break them.

## I/O and File Systems

**I/O subsystem**: the OS abstracts all I/O devices as files (Unix "everything is a file"). Blocking I/O suspends the thread; non-blocking I/O returns immediately; async I/O notifies the application on completion (Node.js event loop uses this).

**File systems** organise storage into hierarchies. Key abstractions: files (byte streams), directories (mappings of names to inodes), inodes (metadata: size, permissions, block pointers). File system designs: FAT (simple, no permissions), ext4 (journalling for crash recovery), APFS (copy-on-write), ZFS (checksums, snapshots).`,
    quiz: [
      {
        q: 'What is the primary difference between a process and a thread?',
        options: [
          'Threads cannot perform I/O',
          'Threads share the address space of their process; processes do not share with each other',
          'Processes are faster to create than threads',
          'Threads run in kernel mode; processes run in user mode',
        ],
        correct: 1,
        explanation:
          'Threads within a process share code, data, heap, and open files. Processes have isolated address spaces, requiring IPC to communicate.',
      },
      {
        q:
          'A Translation Lookaside Buffer (TLB) is used to:',
        options: [
          'Translate domain names to IP addresses',
          'Cache recent virtual-to-physical address mappings',
          'Buffer disk writes',
          'Store the process control block',
        ],
        correct: 1,
        explanation:
          'The TLB caches recently used page table entries to avoid slow multi-level page table walks on every memory access.',
      },
      {
        q:
          'Which of the four Coffman conditions must hold for deadlock to occur?',
        options: [
          'Only mutual exclusion is required',
          'All four conditions must hold simultaneously',
          'Any two of the four are sufficient',
          'Only circular wait is required',
        ],
        correct: 1,
        explanation:
          'Deadlock requires all four: mutual exclusion, hold-and-wait, no preemption, and circular wait. Preventing any one condition prevents deadlock.',
      },
      {
        q: 'Round Robin scheduling is designed to optimise:',
        options: [
          'Throughput for CPU-bound jobs',
          'Response time and fairness for interactive processes',
          'Turnaround time for all processes',
          'Memory utilisation',
        ],
        correct: 1,
        explanation:
          'RR gives each process a short time quantum in turn, ensuring no process waits too long and interactive processes feel responsive.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Simulate a Round Robin scheduler. Given an array of processes `[{name, burstTime}]` and a `quantum`, return an array of log entries showing which process ran at each step, and the final average waiting time.',
      starterCode: `function roundRobin(processes, quantum) {
  // Each process: { name: string, burstTime: number }
  // Return { log: string[], avgWaitingTime: number }
  // log entries like: "Process A runs for 2ms (remaining: 3ms)"
}

const procs = [
  { name: 'A', burstTime: 5 },
  { name: 'B', burstTime: 3 },
  { name: 'C', burstTime: 7 },
];
const result = roundRobin(procs, 2);
console.log(result.log.join('\\n'));
console.log('Avg waiting time:', result.avgWaitingTime);
`,
      solution: `function roundRobin(processes, quantum) {
  const queue = processes.map(p => ({ ...p, remaining: p.burstTime, waited: 0 }));
  const log = [];
  let time = 0;
  let i = 0;

  while (queue.some(p => p.remaining > 0)) {
    const p = queue[i % queue.length];
    i++;
    if (p.remaining <= 0) continue;

    const run = Math.min(p.remaining, quantum);
    // Add waiting time for all other processes
    queue.forEach(other => {
      if (other !== p && other.remaining > 0) other.waited += run;
    });

    p.remaining -= run;
    time += run;
    log.push(\`Process \${p.name} runs for \${run}ms (remaining: \${p.remaining}ms)\`);
  }

  const avgWaitingTime = queue.reduce((s, p) => s + p.waited, 0) / queue.length;
  return { log, avgWaitingTime: +avgWaitingTime.toFixed(2) };
}

const procs = [
  { name: 'A', burstTime: 5 },
  { name: 'B', burstTime: 3 },
  { name: 'C', burstTime: 7 },
];
const result = roundRobin(procs, 2);
console.log(result.log.join('\\n'));
console.log('Avg waiting time:', result.avgWaitingTime);
`,
    },
  },

  {
    id: 'cc-cs-degree-5',
    track: 'crash',
    title: 'Computer Architecture & Memory Hierarchy',
    subtitle: 'CPUs, caches, pipelines, and how hardware shapes software',
    level: 'Masters',
    xp: 125,
    duration: 13,
    module: 5,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Understand CPU architecture including instruction sets, pipelining, branch prediction, and the memory hierarchy from registers to DRAM to disk, and how these affect software performance.',
    keyTerms: [
      { term: 'Instruction Set Architecture', definition: 'The hardware/software interface defining instructions a CPU executes (x86, ARM, RISC-V); determines opcodes, registers, and memory addressing modes.' },
      { term: 'CPU Pipeline', definition: 'Breaks instruction execution into stages (fetch, decode, execute, write-back) that overlap like an assembly line; ideal throughput is one instruction per clock cycle.' },
      { term: 'Cache Locality', definition: 'Principle that sequential memory access (spatial locality) and repeated access (temporal locality) hit cache; cache-friendly code is 10–100× faster than cache-thrashing code.' },
      { term: 'Branch Prediction', definition: 'CPU speculatively executes one path of a branch; misprediction flushes the pipeline at a cost of 10–20 cycles — explains why sorted arrays process faster than random ones.' },
      { term: 'Memory Hierarchy', definition: 'Registers → L1/L2/L3 cache → RAM → SSD → HDD; each level trades capacity for latency; the CPU automatically moves hot data up the hierarchy.' },
      { term: 'SIMD', definition: 'Single Instruction Multiple Data; one instruction operates on multiple values simultaneously (8 floats via AVX); basis of vectorized math in ML, graphics, and codecs.' },
    ],
    content: `## Why Programmers Need to Know Hardware

Modern CPUs are extraordinarily complex, and the gap between what your code says and what the hardware actually does is enormous. Yet hardware behaviour is not opaque — understanding a handful of architectural principles explains why a matrix multiply that traverses memory column-by-column is 10× slower than one that goes row-by-row, why \`switch\` statements can outperform chains of \`if-else\`, and why a tight loop suddenly slows down after a certain data size.

## Instruction Set Architecture

The **Instruction Set Architecture (ISA)** defines the interface between software and hardware: the set of instructions the CPU understands, the registers, memory addressing modes, and calling conventions.

**RISC vs CISC**:
- **CISC** (Complex Instruction Set Computer — x86): many complex instructions, variable-length encoding, operations that access memory directly. Historical rationale: save memory when memory was expensive.
- **RISC** (Reduced Instruction Set Computer — ARM, MIPS, RISC-V): fewer, simpler, fixed-length instructions; all arithmetic happens on registers; memory access only via explicit load/store. Simpler decoding enables faster pipelines.

Modern x86 CPUs decode CISC instructions internally into RISC-like micro-operations (µops) that the out-of-order execution engine processes. The RISC/CISC distinction matters less in hardware than it once did; it matters more for compilers.

**Registers**: the fastest storage in the system (~0.3 ns access). x86-64 has 16 general-purpose 64-bit registers (rax, rbx, rcx, rdx, rsp, rbp, rsi, rdi, r8-r15), SIMD registers (YMM0-YMM15 for AVX), and others. Register allocation is a critical compiler optimisation.

## CPU Pipelining

A pipeline divides instruction execution into stages so multiple instructions can execute simultaneously:

1. **IF** (Instruction Fetch)
2. **ID** (Instruction Decode)
3. **EX** (Execute)
4. **MEM** (Memory access)
5. **WB** (Write-back to register)

With 5 stages, the CPU works on 5 instructions at once. **CPI (cycles per instruction)** approaches 1 for a full pipeline.

**Hazards** stall the pipeline:
- **Data hazard**: instruction needs the result of a previous instruction that hasn't finished (solved by *forwarding* or inserting NOPs)
- **Control hazard** (branch hazard): the CPU doesn't know which instruction to fetch after a branch until the branch is evaluated
- **Structural hazard**: two instructions need the same hardware unit simultaneously

## Branch Prediction

When the CPU encounters a conditional branch (\`if\`, \`while\`, \`for\`), it speculatively fetches and executes instructions *before* knowing which way the branch goes. If the prediction is wrong, the speculative work is discarded (*branch misprediction penalty*: 10–20 cycles on modern CPUs).

**Static prediction**: always predict not-taken, or backward branches taken (loops). Simple but ~65% accuracy.

**Dynamic prediction**: hardware maintains a **branch history table (BHT)** of past branch outcomes. 2-bit saturating counters provide ~95% accuracy on typical code. More sophisticated predictors (TAGE, perceptron-based) achieve 99%+.

**Meltdown and Spectre** (2018): speculative execution was found to leak secrets — the CPU speculatively accesses memory it shouldn't be able to read, and although the results are discarded architecturally, they leave traces in the cache that an attacker can measure.

## Memory Hierarchy

Memory access times vary by ~1,000,000×:

| Level | Size | Latency |
|-------|------|---------|
| Register | ~100 bytes | ~0.3 ns |
| L1 cache | 32–64 KB | ~1 ns |
| L2 cache | 256 KB–1 MB | ~4 ns |
| L3 cache | 4–64 MB | ~20 ns |
| DRAM | 8–64 GB | ~80 ns |
| NVMe SSD | 1–4 TB | ~100 µs |
| HDD | 1–20 TB | ~10 ms |

The memory hierarchy exploits two principles:
- **Temporal locality**: recently accessed data is likely to be accessed again soon
- **Spatial locality**: data near recently accessed data is likely to be accessed soon

**Cache operation**: when the CPU requests an address, it checks L1 → L2 → L3 → DRAM in order. A *cache miss* at every level is called a **cold miss**, a **capacity miss** (working set too large), or a **conflict miss** (too many addresses map to the same cache set).

**Cache line**: the unit of transfer between cache levels is 64 bytes on x86. Even if you read 1 byte, 64 bytes are loaded. This makes traversing arrays row-by-row (sequential memory access) fast, but traversing arrays column-by-column (strided access) slow.

**Set-associative caches**: a k-way set-associative cache is divided into sets, each holding k lines. An address maps to one set and can go in any of the k lines. More associativity = fewer conflict misses but more hardware complexity. L1 is typically 8-way; L3 16-way.

## Cache-Friendly Programming

The performance difference between cache-friendly and cache-hostile code can be 10–100×.

**Row-major vs column-major traversal**: C/JavaScript arrays are row-major. Traversing a 2D array row by row is fast (sequential access); column by column causes a cache miss on every access.

**Structure of Arrays (SoA) vs Array of Structures (AoS)**: if you process many objects but only use one field per object, storing each field as a separate array (SoA) is far more cache-friendly than an array of objects (AoS) — you load only the data you need.

**Blocking / tiling**: for matrix multiplication, partition the matrices into tiles that fit in L1/L2 cache. Process one tile at a time to maximise reuse of cached data. This can improve performance by 10× over a naive triple loop.

**False sharing**: in multi-core systems, a cache line is the unit of coherence. If two cores read different variables that happen to share a cache line, writes by one core invalidate the other core's cached copy, causing unnecessary traffic. Padding structures to align each hot variable to a separate cache line eliminates false sharing.

## Out-of-Order and Superscalar Execution

Modern CPUs can:
- **Execute multiple µops per cycle** (superscalar): execute units are replicated (2–4 integer ALUs, 2 FPUs, etc.)
- **Execute instructions out-of-order**: as long as data dependencies are respected, instructions are executed as their operands become available
- **Speculate**: execute both sides of a branch, discard the wrong path

The **instruction-level parallelism (ILP)** available in a program determines how well these mechanisms help. Compilers and CPUs work hard to extract ILP, but data-dependent code (pointer chasing, recursive algorithms) limits it.

## SIMD: Single Instruction, Multiple Data

Modern CPUs include vector units (SSE, AVX, AVX-512 on x86; NEON on ARM) that apply a single instruction to multiple data elements simultaneously:
- AVX2: 256-bit registers → 8 × 32-bit integers or 4 × 64-bit doubles per instruction
- AVX-512: 512-bit registers → 16 × 32-bit integers per instruction

SIMD is the basis of high-performance numerical code (numpy, BLAS libraries), and is auto-vectorised by optimising compilers when loops access arrays sequentially.

## Virtual Memory and the TLB Revisited

Each virtual-to-physical address translation checks the TLB (typically 64 entries in L1-ITLB, 512 in L2-TLB). A TLB miss triggers a hardware or software *page table walk*, accessing multiple levels of the page table in memory.

**Huge pages** (2 MB or 1 GB) reduce TLB pressure: one TLB entry covers 2 MB instead of 4 KB, requiring 512× fewer entries for the same working set. Databases and virtual machine monitors use huge pages aggressively.`,
    quiz: [
      {
        q: 'Why is traversing a 2D array column-by-column slower than row-by-row in C or JavaScript?',
        options: [
          'Columns require more iterations',
          'Column-by-column access skips memory locations, causing cache misses on every access',
          'Rows are stored in registers; columns are not',
          'The CPU branch predictor fails on column access patterns',
        ],
        correct: 1,
        explanation:
          'Arrays are stored row-major (row elements are contiguous). Row-by-row traversal accesses sequential memory (cache-friendly). Column-by-column jumps by the row stride on each access, missing the cache.',
      },
      {
        q:
          'What is the primary purpose of a cache in the memory hierarchy?',
        options: [
          'To store the operating system kernel',
          'To bridge the speed gap between fast CPU registers and slow DRAM',
          'To back up data in case of power failure',
          'To hold the page table',
        ],
        correct: 1,
        explanation:
          'DRAM access takes ~80 ns vs ~1 ns for L1 cache. By caching recently and frequently used data, the CPU avoids most slow DRAM accesses.',
      },
      {
        q: 'A branch misprediction penalty of 15 cycles means:',
        options: [
          'The branch takes 15 cycles to execute',
          'All speculatively executed instructions after the branch must be discarded and refetched',
          'The TLB is flushed on every branch',
          'Branch prediction is disabled for 15 subsequent branches',
        ],
        correct: 1,
        explanation:
          'On a misprediction, the pipeline is flushed: all work done speculatively on the wrong path is thrown away, and execution restarts from the correct branch target.',
      },
      {
        q:
          'SIMD instructions improve performance by:',
        options: [
          'Running code on multiple CPU cores simultaneously',
          'Applying one instruction to multiple data elements packed into a wide register',
          'Eliminating branch mispredictions',
          'Compressing data before it enters the cache',
        ],
        correct: 1,
        explanation:
          'SIMD (Single Instruction, Multiple Data) packs 4, 8, or 16 values into a 128–512-bit register and applies one operation to all of them in parallel within a single CPU.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `matMul(A, B)` that multiplies two square n×n matrices. Then write an optimised version `matMulTransposed(A, B)` that first transposes B so that both loops access rows (cache-friendly). Compare correctness on a 3×3 example.',
      starterCode: `// Matrix represented as array of rows: A[row][col]

function matMul(A, B) {
  // TODO: standard O(n^3) matrix multiply
}

function transpose(M) {
  // TODO: return the transpose of M
}

function matMulTransposed(A, B) {
  // TODO: transpose B first, then multiply
  // (makes inner loop access B's rows instead of columns)
}

const A = [[1,2],[3,4]];
const B = [[5,6],[7,8]];
console.log(matMul(A, B));           // [[19,22],[43,50]]
console.log(matMulTransposed(A, B)); // [[19,22],[43,50]]
`,
      solution: `function matMul(A, B) {
  const n = A.length;
  const C = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        C[i][j] += A[i][k] * B[k][j]; // B[k][j] is column access — cache unfriendly
  return C;
}

function transpose(M) {
  const n = M.length;
  return Array.from({length: n}, (_, i) => Array.from({length: n}, (_, j) => M[j][i]));
}

function matMulTransposed(A, B) {
  const BT = transpose(B);
  const n = A.length;
  const C = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        C[i][j] += A[i][k] * BT[j][k]; // both row accesses — cache friendly
  return C;
}

const A = [[1,2],[3,4]];
const B = [[5,6],[7,8]];
console.log(matMul(A, B));           // [[19,22],[43,50]]
console.log(matMulTransposed(A, B)); // [[19,22],[43,50]]
`,
    },
  },

  {
    id: 'cc-cs-degree-6',
    track: 'crash',
    title: 'Compiler Design & Language Theory',
    subtitle: 'How source code becomes machine code: lexing, parsing, and optimisation',
    level: 'Masters',
    xp: 135,
    duration: 14,
    module: 6,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Understand formal languages, regular expressions, context-free grammars, and the phases of a compiler from lexical analysis through code generation and optimisation.',
    keyTerms: [
      { term: 'Regular Expression', definition: 'Pattern recognized by a finite automaton; describes the token language a lexer handles (identifiers, number literals, keywords, operators).' },
      { term: 'Context-Free Grammar', definition: 'Grammar with rules A → α where A is a non-terminal; describes nested syntax requiring matched brackets — regular expressions cannot handle nesting.' },
      { term: 'Abstract Syntax Tree', definition: "Tree representation of source code structure after parsing; nodes are operations/constructs, leaves are literals; the compiler's working representation for all passes." },
      { term: 'Lexer', definition: 'Tokenizer converting raw source characters into a stream of typed tokens (keywords, operators, identifiers); the first stage of a compiler or interpreter.' },
      { term: 'Parser', definition: 'Converts token stream into an AST; recursive descent parsers are the most readable; LR parsers handle more grammars and are used in generated parsers like yacc.' },
      { term: 'SSA Form', definition: 'Static Single Assignment — each variable assigned exactly once; simplifies dataflow analysis and enables optimizations like constant propagation and dead code elimination.' },
    ],
    content: `## Why Compilers Matter

Every program you write is transformed by a compiler or interpreter before it runs. TypeScript compiles to JavaScript. JavaScript is JIT-compiled to machine code by V8. Even Python bytecode is the output of a compiler. Understanding compilers gives you insight into:
- What your type checker is actually doing
- Why some code patterns are faster than others
- How to design a domain-specific language (DSL)
- What error messages really mean

## Formal Language Theory

**Alphabets, strings, and languages**: an *alphabet* Σ is a finite set of symbols. A *string* over Σ is a finite sequence of symbols. A *language* L over Σ is any set of strings.

**Regular languages** are the simplest class. They are described by:
- **Regular expressions**: patterns built from concatenation, alternation (|), and Kleene star (*)
- **Finite automata (DFA/NFA)**: state machines that accept or reject strings

Key theorem (Kleene): a language is regular iff it is described by a regular expression iff it is accepted by a finite automaton.

Regular languages cannot express nested structure. The *Pumping Lemma* proves, for example, that the language {aⁿbⁿ : n ≥ 0} (equal numbers of a's and b's) is not regular — no finite automaton can count.

**Context-free languages** (CFLs) extend regular languages with recursion. They are described by:
- **Context-free grammars (CFGs)**: rules of the form A → α where A is a non-terminal and α is a string of terminals and non-terminals
- **Pushdown automata (PDA)**: finite automata augmented with a stack

Programming language syntax is described by context-free grammars. The language of balanced parentheses — S → (S) | SS | ε — is context-free but not regular.

The Chomsky hierarchy: Regular ⊂ Context-Free ⊂ Context-Sensitive ⊂ Recursively Enumerable.

## Lexical Analysis (Lexing/Scanning)

The **lexer** (scanner) is the first compiler phase. It reads the raw source string and produces a stream of *tokens* — the meaningful units of the language.

For JavaScript: keywords (if, while, function), identifiers (myVar), literals (42, "hello", true), operators (+, ===, =>), punctuation ({, }, ;, ,), and whitespace/comments (discarded).

Lexers are implemented using regular expressions compiled to DFAs. Each pattern is a regular expression; the lexer runs all patterns simultaneously (the DFA is the union of all patterns' DFAs) and greedily matches the longest token at each position.

Tools: lex (C), flex (C), ANTLR, or hand-written scanners (most modern compilers).

## Parsing

The **parser** takes the token stream and produces an **Abstract Syntax Tree (AST)**, a tree representation of the program's structure according to the grammar.

The grammar for a simple expression:
\`\`\`
expr   → term (('+' | '-') term)*
term   → factor (('*' | '/') factor)*
factor → NUMBER | '(' expr ')'
\`\`\`

**Top-down parsing (LL parsers)**: start from the start symbol, predict which production to use based on the current token. LL(1) parsers use a *parse table* to select productions. Recursive-descent parsers implement each non-terminal as a function — easy to write, widely used (TypeScript compiler, Python's parser).

**Bottom-up parsing (LR parsers)**: start from the tokens and reduce them to the start symbol. LR(1), LALR(1), SLR — more powerful than LL(1) but harder to write by hand. Most parser generators (yacc, bison) produce LALR parsers.

**Error recovery**: real parsers must handle syntax errors gracefully. Common techniques: panic-mode recovery (skip tokens until a synchronisation point like \`;\` or \`}\`), error productions in the grammar.

## Semantic Analysis

The **semantic analyser** checks properties that can't be expressed in the grammar:
- **Type checking**: does \`"hello" + 5\` make sense? TypeScript's type checker is essentially a semantic analyser.
- **Scope resolution**: is this variable declared? Which declaration does this name refer to?
- **Definite assignment**: TypeScript ensures variables are assigned before use.

The semantic analyser decorates the AST with type information and may produce a *symbol table* mapping names to their declarations and types.

**Type systems**:
- **Static typing**: types checked at compile time (TypeScript, Java, C++)
- **Dynamic typing**: types checked at runtime (JavaScript, Python)
- **Strong vs weak typing**: whether implicit conversions are allowed
- **Type inference**: Hindley-Milner algorithm infers types without annotations (Haskell, ML, Rust, TypeScript)

## Intermediate Representations

Before generating machine code, compilers translate the AST into an **Intermediate Representation (IR)** that is easier to optimise.

**Three-address code**: each instruction has at most one operator and three addresses (variables): \`t1 = a + b\`. Like assembly but with unlimited virtual registers.

**Static Single Assignment (SSA) form**: each variable is assigned exactly once. When a variable is assigned multiple times, each assignment creates a new version. Control flow join points use *φ (phi) functions* to select among versions.

SSA simplifies many analyses and optimisations. GCC, LLVM, and modern JIT compilers use SSA.

## Compiler Optimisations

Optimisation transforms the IR to make the program faster or smaller without changing its meaning.

**Constant folding**: evaluate constant expressions at compile time. \`2 + 3\` → \`5\`.

**Constant propagation**: replace variables known to hold a constant. \`x = 5; y = x + 1\` → \`y = 6\`.

**Dead code elimination**: remove code whose results are never used.

**Inlining**: replace a function call with the function body. Eliminates call overhead and enables further optimisations.

**Loop optimisations**:
- **Loop-invariant code motion (LICM)**: move computations that don't change across iterations out of the loop
- **Loop unrolling**: duplicate the loop body n times to reduce loop overhead
- **Loop fusion**: combine adjacent loops over the same range
- **Loop vectorisation**: transform scalar loops into SIMD instructions

**Register allocation**: assign variables to a limited set of hardware registers. Formulated as a graph-colouring problem: two variables that are *live* at the same time cannot share a register. This is NP-complete in general; heuristics work well in practice.

**Peephole optimisations**: local pattern-replacement on sequences of instructions (e.g., replace \`add r1, 0\` with nothing; replace \`mul r1, 2\` with \`shl r1, 1\`).

## Code Generation

The **code generator** translates IR to machine code (or assembly). Key decisions:
- **Instruction selection**: which machine instructions implement each IR operation
- **Instruction scheduling**: order instructions to avoid pipeline stalls (e.g., place a load early so its result is ready when needed)
- **Register allocation**: map virtual registers to physical ones

Modern compilers (LLVM, GCC) use a multi-pass backend pipeline. JIT compilers like V8 do this at runtime, using profiling data to guide optimisation: first interpret or compile cheaply, then recompile hot functions with full optimisation.

## V8 and JavaScript Compilation

V8 (the JavaScript engine in Node.js and Chrome) compiles JavaScript through several stages:
1. **Ignition**: interprets AST nodes, collecting *type feedback* (what types appear at each operation)
2. **Sparkplug**: a quick non-optimising compiler for warm code
3. **Maglev**: mid-tier optimising compiler (uses type feedback)
4. **TurboFan**: the full optimising compiler for hot functions; produces highly optimised machine code using SSA, inlining, type specialisation

V8 can *deoptimise*: if a function was compiled assuming an integer argument but receives a string, it discards the optimised code and falls back to the interpreter. This is why type-inconsistent JavaScript is slow — it prevents TurboFan from specialising.`,
    quiz: [
      {
        q:
          'Which phase of a compiler produces tokens from raw source text?',
        options: [
          'Parser',
          'Semantic analyser',
          'Lexer (scanner)',
          'Code generator',
        ],
        correct: 2,
        explanation:
          'The lexer reads raw characters and groups them into tokens (identifiers, keywords, literals, operators). The parser then turns the token stream into an AST.',
      },
      {
        q:
          'Why is the language {aⁿbⁿ} (equal a\'s and b\'s) not regular?',
        options: [
          'It contains too many strings',
          'Finite automata cannot count arbitrarily, so they cannot verify equal quantities',
          'Regular expressions cannot contain letters',
          'It is ambiguous',
        ],
        correct: 1,
        explanation:
          'DFAs have finite memory (fixed number of states). To match equal a\'s and b\'s for arbitrary n, a machine needs to count, which requires unbounded memory. The Pumping Lemma formalises this impossibility.',
      },
      {
        q: 'Static Single Assignment (SSA) form requires that:',
        options: [
          'All variables are constant',
          'Each variable is assigned exactly once',
          'Functions are inlined',
          'The program has no branches',
        ],
        correct: 1,
        explanation:
          'In SSA form, each variable name is assigned exactly once. Multiple assignments create new versions (x₁, x₂). Phi functions at merge points select between versions. This simplifies dataflow analysis.',
      },
      {
        q:
          'A compiler performs "constant folding" when it:',
        options: [
          'Moves loop-invariant code outside the loop',
          'Evaluates constant expressions at compile time instead of runtime',
          'Eliminates unused variables',
          'Merges two adjacent loops',
        ],
        correct: 1,
        explanation:
          'Constant folding replaces compile-time-known expressions (like 2*3) with their value (6) in the generated code, avoiding redundant runtime computation.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a simple tokeniser (lexer) for arithmetic expressions. Given a string like "3 + (42 * x) - 7", return an array of tokens, each being an object {type, value}. Token types: NUMBER, IDENTIFIER, PLUS, MINUS, STAR, SLASH, LPAREN, RPAREN.',
      starterCode: `function tokenise(input) {
  // Return array of { type: string, value: string } tokens
  // Types: NUMBER, IDENTIFIER, PLUS, MINUS, STAR, SLASH, LPAREN, RPAREN
  // Skip whitespace
}

console.log(tokenise("3 + (42 * x) - 7"));
/* Expected (roughly):
[
  { type: 'NUMBER', value: '3' },
  { type: 'PLUS', value: '+' },
  { type: 'LPAREN', value: '(' },
  { type: 'NUMBER', value: '42' },
  { type: 'STAR', value: '*' },
  { type: 'IDENTIFIER', value: 'x' },
  { type: 'RPAREN', value: ')' },
  { type: 'MINUS', value: '-' },
  { type: 'NUMBER', value: '7' },
]
*/
`,
      solution: `function tokenise(input) {
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\\s/.test(ch)) { i++; continue; }
    if (/[0-9]/.test(ch)) {
      let num = '';
      while (i < input.length && /[0-9]/.test(input[i])) num += input[i++];
      tokens.push({ type: 'NUMBER', value: num });
    } else if (/[a-zA-Z_]/.test(ch)) {
      let id = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) id += input[i++];
      tokens.push({ type: 'IDENTIFIER', value: id });
    } else {
      const map = { '+': 'PLUS', '-': 'MINUS', '*': 'STAR', '/': 'SLASH', '(': 'LPAREN', ')': 'RPAREN' };
      if (map[ch]) tokens.push({ type: map[ch], value: ch });
      i++;
    }
  }
  return tokens;
}

console.log(tokenise("3 + (42 * x) - 7"));
`,
    },
  },

  {
    id: 'cc-cs-degree-7',
    track: 'crash',
    title: 'Networking Fundamentals',
    subtitle: 'TCP/IP, DNS, HTTP internals, and the protocols behind every web request',
    level: 'Masters',
    xp: 135,
    duration: 14,
    module: 7,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Understand the TCP/IP stack from physical layer to application layer, how DNS resolution works, what happens during an HTTP request, and how TLS provides security.',
    keyTerms: [
      { term: 'TCP/IP Model', definition: '4-layer model: Link (Ethernet/WiFi), Internet (IP routing), Transport (TCP/UDP reliability), Application (HTTP/DNS/TLS); each layer adds headers.' },
      { term: 'DNS Resolution', definition: 'Recursive lookup converting hostname to IP: stub resolver → recursive resolver → root nameserver → TLD nameserver → authoritative nameserver.' },
      { term: 'Three-Way Handshake', definition: 'TCP connection setup: SYN → SYN-ACK → ACK; establishes initial sequence numbers for reliable ordered delivery before any data is sent.' },
      { term: 'TLS Handshake', definition: 'Negotiates cipher suite, authenticates server certificate via PKI, and establishes shared session keys using asymmetric cryptography — then switches to symmetric.' },
      { term: 'HTTP/2 Multiplexing', definition: 'Multiple request/response streams over a single TCP connection; eliminates head-of-line blocking and the 6-connection-per-domain limit of HTTP/1.1.' },
      { term: 'BGP Routing', definition: 'Border Gateway Protocol; how autonomous systems (ISPs, cloud providers) advertise reachable IP prefixes and select routes across the global Internet.' },
    ],
    content: `## The Internet as a Stack of Abstractions

Every time you fetch a URL, dozens of protocols cooperate invisibly. Understanding the network stack demystifies performance, security, and reliability issues that otherwise seem like magic.

The internet is built on layered abstractions — each layer provides services to the layer above and consumes services from the layer below, hiding complexity.

## The TCP/IP Model

The four-layer TCP/IP model maps the functions of the OSI seven-layer model into a simpler hierarchy:

| Layer | Purpose | Example Protocols |
|-------|---------|-------------------|
| Application | User-facing services | HTTP, DNS, SMTP, SSH |
| Transport | End-to-end communication | TCP, UDP |
| Internet | Packet routing across networks | IP, ICMP, BGP |
| Link | Node-to-node on a single network | Ethernet, Wi-Fi, ARP |

## The Link Layer

The **link layer** handles communication between adjacent nodes on the same physical network. Ethernet frames contain a destination MAC address, source MAC address, EtherType, payload, and CRC checksum.

**MAC addresses** are 48-bit hardware identifiers. The **Address Resolution Protocol (ARP)** maps IP addresses to MAC addresses within a local network: "Who has 192.168.1.1? Tell 192.168.1.100."

**Switches** operate at the link layer, forwarding frames based on MAC addresses. They build a *MAC address table* by observing which port each source MAC address appears on.

## The Internet Layer: IP and Routing

**IP (Internet Protocol)** provides best-effort, connectionless packet delivery. Each *datagram* contains a source IP address, destination IP address, TTL (time-to-live), protocol field (TCP=6, UDP=17), and payload.

**IPv4** uses 32-bit addresses (4.3 billion; essentially exhausted). **IPv6** uses 128-bit addresses.

**Subnets and CIDR**: 192.168.1.0/24 means the first 24 bits are the network prefix; the remaining 8 bits identify hosts (256 addresses). Routers forward packets based on *longest prefix match* in their routing table.

**Routing protocols**:
- **RIP** (Routing Information Protocol): distance-vector; each router shares its routing table with neighbours; simple but slow to converge.
- **OSPF** (Open Shortest Path First): link-state; each router floods link-state advertisements to all routers; each router computes shortest paths using Dijkstra's algorithm. Used within an Autonomous System (AS).
- **BGP** (Border Gateway Protocol): the routing protocol of the internet. Connects Autonomous Systems (networks managed by a single organisation, e.g., AWS, Cloudflare). Policy-based; ISPs and cloud providers announce which IP ranges they can reach. BGP misconfigurations have caused major internet outages.

## The Transport Layer: TCP and UDP

**UDP (User Datagram Protocol)**: stateless, connectionless. A datagram is sent and may or may not arrive, in order or out of order. No acknowledgement. Use when speed matters more than reliability: DNS queries, video streaming, online games, WebRTC.

**TCP (Transmission Control Protocol)**: reliable, ordered, connection-oriented. Provides:
- **Reliability**: lost packets are retransmitted
- **Ordering**: packets delivered in order
- **Flow control**: the receiver advertises a *window size* (bytes it can accept); the sender doesn't exceed it
- **Congestion control**: the sender backs off when the network is overloaded

### TCP Three-Way Handshake

Before data flows, TCP establishes a connection:

1. Client → Server: **SYN** (seq = x)
2. Server → Client: **SYN-ACK** (seq = y, ack = x+1)
3. Client → Server: **ACK** (ack = y+1)

After this, both sides have synchronised their sequence numbers. The **four-way teardown** (FIN, ACK, FIN, ACK) gracefully closes the connection.

**Time cost**: one round-trip time (RTT) just to start sending data. With TLS, this adds more round trips. HTTP/2 and HTTP/3 amortise this by multiplexing many requests over one connection.

### TCP Congestion Control

TCP prevents a single sender from overwhelming the network:
- **Slow start**: begin with a small *congestion window* (cwnd), double it each RTT until the *slow-start threshold*
- **Congestion avoidance**: increase cwnd by 1 MSS per RTT (additive increase)
- **Fast retransmit**: on receiving 3 duplicate ACKs, retransmit without waiting for a timeout
- **CUBIC** (default in Linux): uses cubic function for window growth, more aggressive on high-bandwidth-delay-product links

## DNS: Domain Name System

The Domain Name System is a distributed, hierarchical, globally replicated database that maps hostnames to IP addresses.

**Resolution process** for www.example.com:
1. Check OS cache (and /etc/hosts)
2. Query **local recursive resolver** (usually your ISP or 8.8.8.8)
3. If not cached, recursive resolver queries a **root nameserver** → learns .com nameserver
4. Queries **.com TLD nameserver** → learns example.com authoritative nameserver
5. Queries **example.com authoritative nameserver** → gets the A record for www.example.com
6. Returns IP address to client; caches with TTL

**Record types**:
- **A**: hostname → IPv4 address
- **AAAA**: hostname → IPv6 address
- **CNAME**: alias → canonical hostname
- **MX**: mail exchange for a domain
- **TXT**: arbitrary text (used for SPF, DKIM, domain verification)
- **NS**: authoritative nameservers for a domain

**TTL** (time-to-live): how long DNS resolvers should cache the record. Low TTL → faster propagation of changes; high TTL → fewer queries, lower latency.

**DNSSEC** adds cryptographic signatures to DNS records to prevent poisoning attacks. **DNS over HTTPS (DoH)** encrypts DNS queries so ISPs can't snoop.

## HTTP: HyperText Transfer Protocol

HTTP is an application-layer request-response protocol. A client sends a *request* (method + URI + headers + optional body); the server sends a *response* (status code + headers + body).

**HTTP/1.1**: text-based; each request uses one TCP connection (with Connection: keep-alive for reuse). Head-of-line blocking: requests in a pipeline must respond in order.

**HTTP/2**: binary framing; multiplexes multiple *streams* over one TCP connection; server push; header compression (HPACK). Eliminates HTTP-level head-of-line blocking — but TCP-level blocking remains (one lost packet stalls all streams).

**HTTP/3**: built on QUIC (UDP-based transport), which provides multiplexed streams without TCP's head-of-line blocking, and faster 0-RTT or 1-RTT connection establishment.

**Status codes**:
- 2xx: success (200 OK, 201 Created, 204 No Content)
- 3xx: redirection (301 Moved Permanently, 302 Found, 304 Not Modified)
- 4xx: client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests)
- 5xx: server error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable)

**Caching headers**: Cache-Control, ETag, Last-Modified, Vary control how browsers and CDN edge nodes cache responses.

## TLS: Transport Layer Security

TLS encrypts and authenticates connections. It sits between TCP and the application layer.

**TLS 1.3 handshake** (1-RTT):
1. Client → Server: **ClientHello** (supported cipher suites, key share)
2. Server → Client: **ServerHello** + certificate + **Finished**
3. Client verifies certificate, sends **Finished**
4. Both sides derive symmetric session keys from the key exchange

**Key exchange**: TLS 1.3 uses ephemeral **Diffie-Hellman (ECDHE)** — neither side's long-term key is used in the key exchange, ensuring **forward secrecy** (compromising the server's private key doesn't decrypt past sessions).

**Certificates**: signed by a **Certificate Authority (CA)** trusted by the browser. The certificate binds a public key to a hostname. Browsers verify the chain of trust from the certificate up to a trusted root CA.

**HSTS** (HTTP Strict Transport Security): tells browsers to always use HTTPS for a domain, preventing downgrade attacks.

## Performance: The Full Round-Trip

When you type https://example.com:
1. DNS lookup: ~50ms (or ~0ms if cached)
2. TCP handshake: 1 RTT (~50ms)
3. TLS handshake: 1 RTT TLS 1.3 (~50ms), or 2 RTT for TLS 1.2
4. HTTP request + response: 1 RTT + server processing

Total without caching: ~200ms of pure latency before the first byte of HTML arrives. CDNs reduce this by bringing edge servers geographically closer to users.`,
    quiz: [
      {
        q: 'What is the purpose of the TCP three-way handshake?',
        options: [
          'To encrypt the connection before data transfer',
          'To synchronise sequence numbers so both sides can track ordered, reliable delivery',
          'To resolve the destination hostname to an IP address',
          'To negotiate the HTTP version to use',
        ],
        correct: 1,
        explanation:
          'The SYN, SYN-ACK, ACK exchange establishes the initial sequence numbers for both sides, enabling TCP to detect lost/reordered packets and reassemble data in order.',
      },
      {
        q: 'Which DNS record type maps a hostname to an IPv4 address?',
        options: ['CNAME', 'MX', 'A', 'NS'],
        correct: 2,
        explanation:
          'An A record directly maps a hostname to a 32-bit IPv4 address. AAAA records map to IPv6 addresses. CNAME is an alias to another hostname.',
      },
      {
        q:
          'HTTP/3 improves on HTTP/2 by:',
        options: [
          'Using a binary rather than text-based format',
          'Using QUIC (UDP-based) to eliminate TCP head-of-line blocking across streams',
          'Supporting TLS encryption',
          'Adding server push capability',
        ],
        correct: 1,
        explanation:
          'HTTP/2 runs over TCP; a single lost TCP packet stalls all multiplexed HTTP streams. HTTP/3 over QUIC has per-stream loss recovery, so a lost packet only blocks the affected stream.',
      },
      {
        q:
          'TLS forward secrecy means:',
        options: [
          'Connections are always TLS 1.3',
          'Compromising the server\'s long-term private key cannot decrypt past sessions',
          'All data is encrypted twice',
          'The server\'s certificate cannot be forged',
        ],
        correct: 1,
        explanation:
          'With ephemeral Diffie-Hellman key exchange, session keys are derived fresh for each connection and discarded afterward. Even if an attacker later obtains the server\'s private key, they cannot decrypt previously captured traffic.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Simulate a DNS resolver cache. Implement a `DnsCache` class with `set(hostname, ip, ttl)` (ttl in seconds) and `get(hostname)` (returns the IP if not expired, null otherwise). Use Date.now() for time. Then demonstrate with a few lookups.',
      starterCode: `class DnsCache {
  constructor() {
    this.cache = new Map();
  }

  set(hostname, ip, ttl) {
    // TODO: store ip with expiry = now + ttl * 1000ms
  }

  get(hostname) {
    // TODO: return ip if cached and not expired, otherwise null
    // If expired, remove the entry
  }
}

const cache = new DnsCache();
cache.set('example.com', '93.184.216.34', 300); // 300s TTL
console.log(cache.get('example.com')); // '93.184.216.34'
console.log(cache.get('missing.com')); // null
`,
      solution: `class DnsCache {
  constructor() {
    this.cache = new Map();
  }

  set(hostname, ip, ttl) {
    this.cache.set(hostname, { ip, expiry: Date.now() + ttl * 1000 });
  }

  get(hostname) {
    const entry = this.cache.get(hostname);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(hostname);
      return null;
    }
    return entry.ip;
  }
}

const cache = new DnsCache();
cache.set('example.com', '93.184.216.34', 300);
console.log(cache.get('example.com')); // '93.184.216.34'
console.log(cache.get('missing.com')); // null

// Test expiry
cache.set('fast-expire.com', '1.2.3.4', 0); // 0s TTL
setTimeout(() => console.log(cache.get('fast-expire.com')), 10); // null after expiry
`,
    },
  },

  {
    id: 'cc-cs-degree-8',
    track: 'crash',
    title: 'Database Theory',
    subtitle: 'Relational algebra, normalisation, ACID, and query optimisation',
    level: 'Masters',
    xp: 140,
    duration: 15,
    module: 8,
    certArea: 'CS Degree Add-On',
    crashId: 'cc-cs-degree',
    crashTitle: 'CS Degree Add-On',
    courseObjective: CC_CS_OBJ,
    moduleObjective:
      'Master relational database theory including the relational model, normalisation up to BCNF, ACID properties and transaction isolation, and how query optimisers work.',
    keyTerms: [
      { term: 'Relational Algebra', definition: 'Formal query language with operations select (σ), project (π), join (⋈), union, and difference; defines the precise semantics that SQL implements.' },
      { term: 'Normal Forms', definition: 'Rules eliminating redundancy: 1NF (atomic values), 2NF (no partial key dependency), 3NF (no transitive dependency), BCNF (all determinants are candidate keys).' },
      { term: 'ACID Properties', definition: 'Atomicity (all-or-nothing commits), Consistency (constraints preserved), Isolation (concurrent transactions appear serial), Durability (committed data survives crashes).' },
      { term: 'Transaction Isolation', definition: 'Levels from Read Uncommitted to Serializable; higher isolation prevents more anomalies (dirty read, non-repeatable read, phantom) at the cost of concurrency.' },
      { term: 'Query Optimisation', definition: 'The planner chooses join order, index vs sequential scan, and algorithm based on statistics about table size and column selectivity to minimize total cost.' },
      { term: 'B-Tree Index', definition: 'Balanced tree keeping keys sorted; supports O(log n) point queries and efficient range scans — the default index type in PostgreSQL, MySQL, and SQLite.' },
    ],
    content: `## Databases as Formalised Reasoning

SQL is easy to learn at a surface level — anyone can write \`SELECT * FROM users\`. But when your database is slow, corrupt, or returning wrong answers, you need the theory: what *relational algebra* guarantees about query results, what *normal forms* prevent in terms of anomalies, what *ACID* actually promises, and how the query optimiser decides to use an index.

## The Relational Model

Ted Codd introduced the relational model in 1970. Its foundation:

- **Relation**: a set of tuples (rows) with a fixed schema (set of named, typed attributes/columns). Unlike a table, a relation is a mathematical set — no duplicate rows, no ordering.
- **Tuple**: one row; an ordered list of attribute values.
- **Attribute**: a named, typed column.
- **Domain**: the allowed values for an attribute (e.g., integers, strings, dates).
- **Schema**: the name and attributes of a relation.
- **Instance**: the current set of tuples in a relation.

A **primary key** uniquely identifies each tuple. A **foreign key** references the primary key of another relation, enforcing *referential integrity*.

**Null values** represent missing or unknown information. They complicate logic: three-valued logic (TRUE, FALSE, UNKNOWN) applies when comparing with NULL.

## Relational Algebra

Relational algebra is the formal query language underlying SQL. It provides a set of operations that take relations as input and produce relations as output.

**Selection σ_condition(R)**: filters rows satisfying the condition. Equivalent to SQL WHERE. Example: σ_salary>100000(Employee)

**Projection π_attrs(R)**: keeps only the specified columns, eliminating duplicates (set semantics). Equivalent to SQL SELECT DISTINCT.

**Cartesian product R × S**: all combinations of tuples from R and S. Rarely used alone; combined with selection to form joins.

**Natural join R ⋈ S**: combines tuples from R and S that agree on all shared attributes, projecting out duplicates. Equivalent to an equijoin on shared column names.

**Theta join R ⋈_condition S**: join with an arbitrary condition. Implemented as σ_condition(R × S).

**Union R ∪ S**: all tuples in R or S (relations must have the same schema).

**Intersection R ∩ S**: tuples in both R and S.

**Difference R − S**: tuples in R but not S.

**Renaming ρ**: renames a relation or attributes.

**Division R ÷ S**: tuples in R that match all tuples in S on the relevant attributes — useful for "find all X that are related to all Y" queries.

SQL is *relationally complete*: it can express any query expressible in relational algebra. The SELECT-FROM-WHERE-GROUP BY-HAVING-ORDER BY structure maps directly to compositions of algebraic operators.

## Functional Dependencies and Normal Forms

A **functional dependency (FD)** A → B means that knowing the value of attribute(s) A uniquely determines the value of B. For example, StudentID → {Name, Major} — knowing the student ID tells you the name and major.

Normalization uses FDs to design schemas that avoid:
- **Insertion anomaly**: can't add data without unrelated data
- **Update anomaly**: updating one fact requires updating multiple rows
- **Deletion anomaly**: deleting one fact loses other facts

**First Normal Form (1NF)**: every attribute value is atomic (no multi-valued attributes or repeating groups).

**Second Normal Form (2NF)**: 1NF + every non-key attribute is *fully functionally dependent* on the entire primary key (no partial dependencies). Violations occur with composite keys.

**Third Normal Form (3NF)**: 2NF + no transitive dependencies — non-key attribute B depends on non-key attribute A, which depends on the key. Example: \`OrderID → CustomerID → CustomerCity\` is a transitive dependency; CustomerCity should move to a Customer table.

**Boyce-Codd Normal Form (BCNF)**: for every non-trivial FD X → Y, X must be a superkey. Stricter than 3NF; eliminates all redundancy due to FDs. Some BCNF decompositions are not dependency-preserving, requiring a trade-off.

**Fourth Normal Form (4NF)** and **Fifth Normal Form (5NF)** address multi-valued dependencies and join dependencies — important for very complex schemas.

*Denormalisation* is deliberate violation of normal forms for performance: storing redundant data to avoid expensive joins. Data warehouses (OLAP) use *star schemas* and *snowflake schemas* that are highly denormalised.

## ACID Properties

Databases guarantee **ACID** properties for transactions:

**Atomicity**: a transaction is all-or-nothing. Either all its operations succeed and are committed, or all are rolled back. Implemented using a *write-ahead log (WAL)*: log operations before applying them so the database can undo incomplete transactions after a crash.

**Consistency**: a transaction moves the database from one consistent state to another. Consistent means all integrity constraints (primary keys, foreign keys, check constraints) are satisfied. The database enforces this; the application ensures the business logic makes sense.

**Isolation**: concurrent transactions don't see each other's intermediate state. The *illusion* of serial execution. Implemented using locks or MVCC.

**Durability**: once a transaction commits, its changes survive crashes. Implemented by writing the WAL to disk before acknowledging the commit.

## Transaction Isolation Levels

Full serialisability is expensive (lots of locking). SQL standards define isolation levels with specific allowed anomalies:

**Anomalies**:
- **Dirty read**: reads uncommitted data of another transaction (that might be rolled back)
- **Non-repeatable read**: reading the same row twice in a transaction gives different results (another transaction committed an update)
- **Phantom read**: re-executing a range query returns different rows (another transaction inserted/deleted rows)

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|----------------|------------|---------------------|--------------|
| Read Uncommitted | Possible | Possible | Possible |
| Read Committed | Prevented | Possible | Possible |
| Repeatable Read | Prevented | Prevented | Possible |
| Serialisable | Prevented | Prevented | Prevented |

**Multi-version Concurrency Control (MVCC)**: most modern databases (PostgreSQL, MySQL InnoDB, Oracle) implement isolation using MVCC — each transaction sees a snapshot of the database as of its start time. Writers don't block readers; readers don't block writers. Old versions are kept in an *undo log* and cleaned up by a vacuum/garbage collection process.

**Optimistic vs Pessimistic Concurrency**: pessimistic locking acquires locks before accessing data; optimistic approaches proceed without locks and check for conflicts at commit time (aborting if a conflict is detected). Optimistic works well when conflicts are rare.

## Indexing

A **database index** is a data structure that speeds up retrieval at the cost of extra storage and write overhead.

**B-tree index**: the standard. A B-tree is a balanced, multi-level search tree where each node holds many keys (unlike a binary tree). Height is O(log_m n) where m is the branching factor (typically 100–1000). A disk page maps to one B-tree node, minimising I/O. Supports: equality lookups, range queries, ORDER BY, and GROUP BY efficiently.

**B+ tree**: a variant where all values are stored in leaf nodes; internal nodes hold only keys for routing. Most database indexes are B+ trees. Leaf nodes are linked, making range scans very efficient.

**Hash index**: stores a hash of the key; supports O(1) equality lookups but *not* range queries. Used in PostgreSQL's hash indexes and hash joins.

**Clustered index**: the table data is physically ordered by the index key. Extremely fast for range scans; a table can have only one. In MySQL InnoDB, the primary key is always the clustered index.

**Covering index**: an index that contains all columns needed by a query, so no row lookup is needed. Often the most effective performance optimisation.

**Index selectivity**: a column with high selectivity (many distinct values relative to total rows) is a good candidate for an index. An index on a boolean column (true/false) is rarely useful.

## Query Optimisation

A SQL query can often be executed in many different ways (query plans). The **query optimiser** chooses the plan with the lowest estimated cost.

**Phases**:
1. **Parsing**: SQL → parse tree
2. **Logical optimisation**: algebraic transformations (push selections down, reorder joins)
3. **Physical optimisation**: choose access methods (index scan vs sequential scan), join algorithms, join order

**Join algorithms**:
- **Nested loop join**: for each row in the outer table, scan the inner table. O(n·m). Good when the inner table is small or has an index.
- **Hash join**: build a hash table on the smaller table, probe with each row of the larger table. O(n + m). Ideal for large tables with no useful indexes.
- **Merge join**: sort both tables on the join key, then merge. O(n log n + m log m). Ideal when both sides are already sorted or have a sorted index.

**Cost estimation**: the optimiser uses statistics (table row counts, column value distributions, index statistics) to estimate the cost of each plan. Stale statistics cause poor plan choices. \`ANALYZE\` (PostgreSQL) or \`UPDATE STATISTICS\` (SQL Server) refreshes them.

**EXPLAIN / EXPLAIN ANALYZE**: shows the query plan chosen by the optimiser and (with ANALYZE) the actual execution statistics. Essential for identifying slow queries — look for sequential scans on large tables, large row estimates that differ from actuals, and expensive hash or sort operations.

## CAP Theorem and NoSQL

The **CAP theorem** (Brewer, 2000; proved 2002) states that a distributed data store can guarantee at most two of:
- **Consistency**: every read returns the most recent write
- **Availability**: every request receives a response
- **Partition tolerance**: the system continues operating despite network partitions

Since partitions are unavoidable in distributed systems, the real choice is between CP (consistent but may reject requests during a partition) and AP (available but may return stale data).

**NoSQL databases** trade some relational features for scale:
- **Document stores** (MongoDB): nested JSON documents; flexible schema; horizontal sharding
- **Key-value stores** (Redis, DynamoDB): simple get/put; extremely fast
- **Column-family stores** (Cassandra, HBase): optimised for wide-row, time-series, and write-heavy workloads
- **Graph databases** (Neo4j): native graph storage and traversal

The choice between relational and NoSQL is not "which is better" but "which fits the access patterns and consistency requirements of this specific workload."`,
    quiz: [
      {
        q:
          'What does Third Normal Form (3NF) prevent that Second Normal Form (2NF) does not?',
        options: [
          'Partial dependencies on a composite key',
          'Transitive dependencies where a non-key attribute depends on another non-key attribute',
          'Multi-valued dependencies',
          'Null values in primary key columns',
        ],
        correct: 1,
        explanation:
          '2NF eliminates partial dependencies (non-key attribute depends on part of a composite key). 3NF additionally eliminates transitive dependencies (A → B → C where B is not a key).',
      },
      {
        q: 'The "I" in ACID stands for Isolation. What does full isolation (Serialisable level) guarantee?',
        options: [
          'Transactions run on separate hardware',
          'Concurrent transactions produce results equivalent to some serial (one-at-a-time) execution',
          'No two transactions can access the same table',
          'All transactions are encrypted',
        ],
        correct: 1,
        explanation:
          'Serialisable isolation means that even though transactions run concurrently, the database ensures the result is as if they ran one after another in some order.',
      },
      {
        q: 'A B+ tree index is better than a B-tree for range scans because:',
        options: [
          'B+ trees are always smaller',
          'All values are stored in linked leaf nodes, enabling sequential scans without returning to internal nodes',
          'B+ trees support hash lookups',
          'B+ trees have lower insertion cost',
        ],
        correct: 1,
        explanation:
          'In a B+ tree, internal nodes contain only routing keys; all data lives in the leaves, which are linked. A range scan walks the linked leaf list sequentially after finding the start key.',
      },
      {
        q:
          'According to the CAP theorem, during a network partition a database must choose between:',
        options: [
          'Speed and durability',
          'Consistency and availability',
          'Normalisation and denormalisation',
          'ACID and BASE',
        ],
        correct: 1,
        explanation:
          'CAP: since partitions cannot be prevented, the trade-off is CP (refuse requests to stay consistent) vs AP (serve stale data to stay available).',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement a simple in-memory relational table with basic operations: `insert(row)`, `select(predicate)` (returns rows where predicate returns true), and `project(fields)` (returns only specified fields). Demonstrate with an employees table.',
      starterCode: `class Table {
  constructor(name) {
    this.name = name;
    this.rows = [];
  }

  insert(row) {
    // TODO: add a row object to this.rows
  }

  select(predicate) {
    // TODO: return rows for which predicate(row) is true
  }

  project(fields) {
    // TODO: return all rows but with only the specified fields
  }
}

const emp = new Table('employees');
emp.insert({ id: 1, name: 'Alice', dept: 'Engineering', salary: 120000 });
emp.insert({ id: 2, name: 'Bob',   dept: 'Marketing',   salary: 85000  });
emp.insert({ id: 3, name: 'Carol', dept: 'Engineering', salary: 110000 });

// SQL: SELECT name, salary FROM employees WHERE dept = 'Engineering'
const result = emp.select(r => r.dept === 'Engineering').map(r => ({ name: r.name, salary: r.salary }));
console.log(result);
// [{ name: 'Alice', salary: 120000 }, { name: 'Carol', salary: 110000 }]
`,
      solution: `class Table {
  constructor(name) {
    this.name = name;
    this.rows = [];
  }

  insert(row) {
    this.rows.push({ ...row });
  }

  select(predicate) {
    return this.rows.filter(predicate);
  }

  project(fields) {
    return this.rows.map(row => {
      const result = {};
      fields.forEach(f => { if (f in row) result[f] = row[f]; });
      return result;
    });
  }
}

const emp = new Table('employees');
emp.insert({ id: 1, name: 'Alice', dept: 'Engineering', salary: 120000 });
emp.insert({ id: 2, name: 'Bob',   dept: 'Marketing',   salary: 85000  });
emp.insert({ id: 3, name: 'Carol', dept: 'Engineering', salary: 110000 });

const result = emp.select(r => r.dept === 'Engineering').map(r => ({ name: r.name, salary: r.salary }));
console.log(result);
// [{ name: 'Alice', salary: 120000 }, { name: 'Carol', salary: 110000 }]

// Using project method
console.log(emp.project(['name', 'dept']));
`,
    },
  },
]
