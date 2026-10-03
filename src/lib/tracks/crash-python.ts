import type { Course } from '../courses'

const CC_PY_OBJ = 'Write real Python from scratch — syntax, data structures, OOP, async patterns, and the project structure used in every production Python codebase.'

export const crashPythonCourses: Course[] = [
  {
    id: 'cc-python-m01', track: 'crash', title: 'Environment, Syntax & Your First Python Program',
    subtitle: 'Install Python, configure VS Code, and write real code using variables, f-strings, and the type system.',
    moduleObjective: 'Configure a Python dev environment in VS Code, run .py files from the terminal, declare variables correctly, use f-strings, and call built-in functions.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'Basic',
    xp: 150, duration: 12, module: 1, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'Interpreter', definition: 'Python is interpreted line by line at runtime. No compile step — run any .py file with: python main.py' },
      { term: 'Variable', definition: 'A named reference to a value. Python is dynamically typed: x = 10 is valid, then x = "hello" is also valid.' },
      { term: 'f-string', definition: 'String with embedded expressions: f"Hello, {name}". Evaluates at runtime. Introduced in Python 3.6.' },
      { term: 'type()', definition: 'Built-in function that returns the type of any value: type(42) → <class "int">.' },
      { term: 'print()', definition: 'Outputs to stdout. Accepts any number of arguments: print("x =", x, sep=", ", end="\\n").' },
      { term: 'Virtual Environment', definition: 'Isolated Python installation for a project. Created with: python -m venv .venv. Prevents dependency conflicts across projects.' },
      { term: 'PEP 8', definition: 'The official Python style guide. snake_case for variables/functions, PascalCase for classes, 4-space indentation.' },
    ],
    content: `## Environment, Syntax & Your First Python Program

### Why Python?

Python is the top language for AI/ML, data science, scripting, and backend APIs. Its syntax is closer to plain English than any other production language — which makes it the best first language and a powerful second one. Django, FastAPI, pandas, TensorFlow — they're all Python.

**Before a single line: your environment must be correct.**

---

### Installing Python

Download Python 3.12+ from python.org/downloads. During install on Windows, check **"Add Python to PATH"** — this is critical.

Verify in terminal:
\`\`\`bash
python --version      # Windows
python3 --version     # macOS/Linux
\`\`\`

---

### VS Code Setup

Install these extensions:
1. **Python** (Microsoft) — syntax highlighting, IntelliSense, linting
2. **Pylance** — fast type checking and autocomplete
3. **Python Indent** — fixes VS Code's indentation handling

**Create your project and virtual environment:**
\`\`\`bash
mkdir python-crash-course
cd python-crash-course
python -m venv .venv

# Activate it:
.venv\\Scripts\\activate     # Windows
source .venv/bin/activate  # macOS/Linux

# VS Code: Ctrl+Shift+P → "Python: Select Interpreter" → pick .venv
\`\`\`

**Run any file:**
\`\`\`bash
python main.py
\`\`\`

---

### Variables and Dynamic Typing

\`\`\`python
name = "Jordan"          # str
age = 28                 # int
height = 5.11            # float
is_active = True         # bool (True/False — capital T and F)
nothing = None           # NoneType — Python's null

# Python is dynamically typed — types are checked at runtime, not compile time
x = 10
x = "now a string"      # perfectly valid

# Check types at runtime
print(type(name))        # <class 'str'>
print(type(age))         # <class 'int'>
print(type(nothing))     # <class 'NoneType'>
\`\`\`

---

### f-strings: The Right Way to Format Strings

\`\`\`python
name = "Marcus"
year = 2026
score = 94.756

# Basic f-string
print(f"Hello, {name}!")                   # Hello, Marcus!

# Expressions inside braces
print(f"Next year: {year + 1}")            # Next year: 2027

# Format specifiers
print(f"Score: {score:.2f}")               # Score: 94.76
print(f"Padded: {name:>10}")               # Padded:     Marcus
print(f"Year: {year:,}")                   # Year: 2,026

# Multi-line (use parentheses — Python's implicit line continuation)
message = (
    f"Name: {name}\\n"
    f"Year: {year}\\n"
    f"Score: {score:.1f}%"
)
print(message)
\`\`\`

---

### Python Arithmetic and String Operations

\`\`\`python
# Arithmetic
print(10 + 3)   # 13
print(10 - 3)   # 7
print(10 * 3)   # 30
print(10 / 3)   # 3.3333... (always returns float)
print(10 // 3)  # 3 (integer/floor division)
print(10 % 3)   # 1 (remainder/modulo)
print(2 ** 8)   # 256 (exponentiation)

# String operations
greeting = "hello"
print(greeting.upper())             # HELLO
print(greeting.capitalize())        # Hello
print(greeting.replace("l", "r"))   # herro
print(len(greeting))                # 5
print("ell" in greeting)            # True
print(greeting * 3)                 # hellohellohello
\`\`\`

---

### Multiple Assignment and Unpacking

\`\`\`python
# Multiple assignment in one line
x, y, z = 10, 20, 30
print(x, y, z)          # 10 20 30

# Swap without a temp variable
x, y = y, x
print(x, y)             # 20 10

# Augmented assignment
count = 0
count += 1   # equivalent to count = count + 1
count *= 2   # count = count * 2
\`\`\`

---

### Python's Indentation Rule

Python uses **indentation (4 spaces)** instead of braces to define code blocks. This is not optional:

\`\`\`python
# CORRECT — 4-space indent inside if block
if True:
    print("indented correctly")
    print("same block")

# INCORRECT — inconsistent indent causes IndentationError
if True:
    print("correct")
  print("wrong indent")  # IndentationError!
\`\`\`

**VS Code auto-handles this if you installed the Python extension.**`,
    quiz: [
      { q: 'What command activates a virtual environment on Windows?', options: ['source .venv/bin/activate', '.venv\\\\Scripts\\\\activate', 'python activate .venv', 'venv start'], correct: 1, explanation: '.venv\\Scripts\\activate on Windows. source .venv/bin/activate on macOS/Linux. Always activate before installing packages.' },
      { q: 'What does the // operator do in Python?', options: ['Integer (floor) division', 'Comment a line', 'String concatenation', 'Boolean short-circuit'], correct: 0, explanation: '10 // 3 = 3. It divides and floors to the nearest integer. Regular / always returns a float in Python 3.' },
      { q: 'How do you embed an expression in a Python string?', options: ['Use ${expression}', 'Use f"...{expression}..."', 'Use "..." + str(expression)', 'Use printf("%s", expression)'], correct: 1, explanation: 'f-strings (f"Hello, {name}") are the modern, readable way. The f prefix tells Python to evaluate expressions inside {}.' },
      { q: 'What is None in Python equivalent to?', options: ['0', 'false', 'null / null pointer — the absence of a value', 'An empty string'], correct: 2, explanation: 'None is Python\'s null. type(None) is NoneType. Always compare with "is None", not "== None", because == can be overridden by classes.' },
    ],
    ide: {
      language: 'python',
      task: 'Complete the program: declare variables for a person\'s name, age, city, and a score (float). Print a formatted profile card using f-strings. Then calculate and print what their age will be in 10 years. Use at least one format specifier (e.g., .2f for the score).',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 1
# Task: Print a formatted profile card using f-strings

# TODO: Declare these variables with real values
name = ""       # your name
age = 0         # your age (int)
city = ""       # your city
score = 0.0     # a score out of 100 (float)

# TODO: Print a formatted profile card
# Example output:
# ===== Profile Card =====
# Name : Jordan Morris
# Age  : 28
# City : Kingston
# Score: 94.76/100
# ========================

# TODO: Calculate and print age in 10 years
# Example: "In 10 years, Jordan will be 38."

# BONUS: Use type() to print the type of each variable
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m02', track: 'crash', title: 'Control Flow: Making Decisions and Loops',
    subtitle: 'Master if/elif/else, while loops, for loops with range(), and build logic that reacts to data.',
    moduleObjective: 'Write conditional logic with all comparison and logical operators, control loops with break/continue, and use range() with for loops to build iterative programs.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'Basic',
    xp: 160, duration: 14, module: 2, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'if / elif / else', definition: 'Python\'s conditional block. elif is short for "else if". The first True condition runs; the rest are skipped.' },
      { term: 'Comparison Operators', definition: '==, !=, <, >, <=, >=. Always use == for equality, not =. Python also supports chaining: 0 < x < 100.' },
      { term: 'Logical Operators', definition: 'and, or, not. Python uses words, not &&/||/!. Short-circuit evaluation: A and B skips B if A is False.' },
      { term: 'while loop', definition: 'Repeats a block as long as a condition is True. Use when the number of iterations is unknown upfront.' },
      { term: 'for loop', definition: 'Iterates over any sequence (list, range, string, dict). Python\'s for loop is always a "for each" loop.' },
      { term: 'range()', definition: 'Generates a sequence of integers. range(5) → 0,1,2,3,4. range(2,10,2) → 2,4,6,8. Never creates the full list in memory.' },
      { term: 'break / continue', definition: 'break exits the loop immediately. continue skips to the next iteration. Both work in for and while loops.' },
    ],
    content: `## Control Flow: Making Decisions and Loops

### Comparison Operators

\`\`\`python
x = 10

print(x == 10)    # True  — equality (two equals signs)
print(x != 5)     # True  — not equal
print(x > 5)      # True  — greater than
print(x < 20)     # True  — less than
print(x >= 10)    # True  — greater than or equal
print(x <= 10)    # True  — less than or equal

# Python supports chained comparisons — unique to Python
age = 25
print(18 <= age < 65)    # True — reads naturally like math
print(0 < x < 100)      # True
\`\`\`

---

### if / elif / else

\`\`\`python
score = 78

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Grade: {grade}")  # Grade: C

# One-line conditional expression (ternary)
status = "pass" if score >= 60 else "fail"
print(f"Status: {status}")  # Status: pass
\`\`\`

---

### Logical Operators: and, or, not

\`\`\`python
age = 22
has_id = True
is_vip = False

# and — both must be True
if age >= 21 and has_id:
    print("Access granted")

# or — at least one must be True
if is_vip or age >= 18:
    print("You may enter")

# not — inverts boolean
if not is_vip:
    print("Standard queue")

# Short-circuit evaluation
# "and" stops at first False — B is never evaluated if A is False
# "or" stops at first True — B is never evaluated if A is True
result = has_id and get_user_record()   # get_user_record() only called if has_id is True

# Truthiness — these are all falsy:
# False, 0, 0.0, "", [], {}, set(), None
# Everything else is truthy
name = ""
print("Has name" if name else "No name")   # No name
\`\`\`

---

### while Loops

\`\`\`python
# Basic while loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1
# Count: 0, 1, 2, 3, 4

# while with break — search loop pattern
items = [3, 7, 1, 9, 4]
target = 9
i = 0
while i < len(items):
    if items[i] == target:
        print(f"Found {target} at index {i}")
        break
    i += 1
else:
    # This else runs only if the loop completed WITHOUT a break
    print(f"{target} not found")

# Infinite loop with controlled exit
attempts = 0
max_attempts = 3
while True:
    attempts += 1
    success = attempts == 3  # Simulating: succeeds on 3rd try
    if success:
        print(f"Succeeded on attempt {attempts}")
        break
    if attempts >= max_attempts:
        print("Max attempts reached")
        break
    print(f"Attempt {attempts} failed, retrying...")
\`\`\`

---

### for Loops with range()

\`\`\`python
# range(stop) — 0 to stop-1
for i in range(5):
    print(i, end=" ")       # 0 1 2 3 4

# range(start, stop)
for i in range(1, 6):
    print(i, end=" ")       # 1 2 3 4 5

# range(start, stop, step)
for i in range(0, 20, 4):
    print(i, end=" ")       # 0 4 8 12 16

# Counting backwards
for i in range(5, 0, -1):
    print(i, end=" ")       # 5 4 3 2 1

# Iterating a string (for loops work on ANY iterable)
for char in "Python":
    print(char, end="-")    # P-y-t-h-o-n-
\`\`\`

---

### FizzBuzz — Classic Control Flow Test

\`\`\`python
for n in range(1, 101):
    if n % 15 == 0:        # divisible by both 3 and 5 — check FIRST
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)
\`\`\`

The key insight: check the **combined** case (divisible by 15) first. If you check 3 first, multiples of 15 will print "Fizz" instead of "FizzBuzz".

---

### break, continue, and the for/else Pattern

\`\`\`python
# continue — skip current iteration
for i in range(10):
    if i % 2 == 0:
        continue           # skip even numbers
    print(i, end=" ")      # 1 3 5 7 9

# break — exit the loop entirely
for i in range(10):
    if i == 5:
        break
    print(i, end=" ")      # 0 1 2 3 4

# for/else — else runs only if NO break occurred (prime check)
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False   # break-like exit via return
    return True            # no divisor found

print([n for n in range(2, 20) if is_prime(n)])
# [2, 3, 5, 7, 11, 13, 17, 19]
\`\`\``,
    quiz: [
      { q: 'What is the output of: print(10 // 3)?', options: ['3.333', '3', '4', '1'], correct: 1, explanation: '// is floor division. 10 // 3 = 3. It discards the remainder and always returns an integer (or float if either operand is float).' },
      { q: 'In FizzBuzz, why must you check n % 15 == 0 before checking n % 3 == 0?', options: ['Python evaluates conditions randomly', 'elif chains stop at the first True — 15 is divisible by 3, so it would match the 3 check first and never print FizzBuzz', 'You don\'t — the order doesn\'t matter', 'Because 15 > 3'], correct: 1, explanation: 'elif is exclusive: the first matching condition wins. 15 % 3 == 0 is True, so if you check 3 first, 15 prints "Fizz" instead of "FizzBuzz".' },
      { q: 'When does the "else" clause of a for loop execute?', options: ['Always, after the loop finishes', 'Only if the loop body ran at least once', 'Only if no break statement was hit', 'Only if the loop ran zero iterations'], correct: 2, explanation: 'The for/else else clause runs only if the loop completed without hitting a break. It\'s useful for search patterns: "I searched everything and didn\'t find it."' },
      { q: 'What does range(2, 10, 3) produce?', options: ['[2, 5, 8]', '[2, 3, 4, 5, 6, 7, 8, 9]', '[2, 4, 6, 8, 10]', '[3, 6, 9]'], correct: 0, explanation: 'range(start, stop, step): starts at 2, stops before 10, steps by 3. So: 2, 5, 8. (next would be 11 which is >= 10, so it stops).' },
    ],
    ide: {
      language: 'python',
      task: 'Write a FizzBuzz program for numbers 1–50. Then extend it: after the FizzBuzz output, print a summary showing how many Fizz, Buzz, and FizzBuzz values appeared. Use variables to count each category.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 2
# Task: FizzBuzz 1–50 with summary counts

fizz_count = 0
buzz_count = 0
fizzbuzz_count = 0

# TODO: Loop from 1 to 50 (inclusive)
# - If divisible by 3 AND 5: print "FizzBuzz", increment fizzbuzz_count
# - If divisible by 3 only: print "Fizz", increment fizz_count
# - If divisible by 5 only: print "Buzz", increment buzz_count
# - Otherwise: print the number

# After the loop, print:
# --- Summary ---
# Fizz:     X
# Buzz:     X
# FizzBuzz: X
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m03', track: 'crash', title: 'Functions, Scope & Reusable Code',
    subtitle: 'Write clean, reusable functions using parameters, return values, *args, **kwargs, and docstrings.',
    moduleObjective: 'Define functions with default parameters, *args, and **kwargs; understand local vs global scope; write proper docstrings; and build a stats function for a list of numbers.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'Masters',
    xp: 170, duration: 14, module: 3, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'def', definition: 'Keyword to define a function. def greet(name): — the function body must be indented 4 spaces.' },
      { term: 'return', definition: 'Sends a value back to the caller. A function without return implicitly returns None.' },
      { term: '*args', definition: 'Collects extra positional arguments into a tuple: def fn(*args). Lets you call fn(1, 2, 3) with any number of args.' },
      { term: '**kwargs', definition: 'Collects extra keyword arguments into a dict: def fn(**kwargs). Lets you call fn(name="Jordan", age=28).' },
      { term: 'Default Parameter', definition: 'A parameter with a fallback value: def greet(name="World"). Called without that argument, it uses the default.' },
      { term: 'Scope (LEGB)', definition: 'Python resolves names in order: Local → Enclosing → Global → Built-in. Variables declared in a function are local by default.' },
      { term: 'Docstring', definition: 'A triple-quoted string immediately after def. Explains what the function does. Accessible via help() and __doc__.' },
    ],
    content: `## Functions, Scope & Reusable Code

### Defining and Calling Functions

\`\`\`python
def greet(name):
    """Return a greeting string for the given name."""
    return f"Hello, {name}!"

message = greet("Jordan")
print(message)   # Hello, Jordan!

# A function without return implicitly returns None
def log(msg):
    print(f"[LOG] {msg}")

result = log("started")
print(result)   # None
\`\`\`

---

### Default Parameters

\`\`\`python
def create_user(name, role="viewer", active=True):
    return {"name": name, "role": role, "active": active}

# Use defaults
print(create_user("Jordan"))
# {'name': 'Jordan', 'role': 'viewer', 'active': True}

# Override specific defaults
print(create_user("Owen", role="admin"))
# {'name': 'Owen', 'role': 'admin', 'active': True}

# ⚠️ COMMON BUG: mutable defaults persist across calls
def append_item(item, lst=[]):  # DON'T DO THIS
    lst.append(item)
    return lst

print(append_item(1))   # [1]
print(append_item(2))   # [1, 2] — same list reused!

# CORRECT: use None as default, create list inside function
def append_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\`

---

### *args: Variable Positional Arguments

\`\`\`python
def sum_all(*args):
    """Sum any number of numeric arguments."""
    return sum(args)   # args is a tuple inside the function

print(sum_all(1, 2, 3))           # 6
print(sum_all(10, 20, 30, 40))    # 100
print(sum_all())                   # 0

def log_events(level, *messages):
    for msg in messages:
        print(f"[{level.upper()}] {msg}")

log_events("info", "Server started", "Listening on port 8000", "Ready")
# [INFO] Server started
# [INFO] Listening on port 8000
# [INFO] Ready
\`\`\`

---

### **kwargs: Variable Keyword Arguments

\`\`\`python
def build_query(**filters):
    """Build a SQL-style query from keyword filters."""
    conditions = [f"{k} = {repr(v)}" for k, v in filters.items()]
    return "WHERE " + " AND ".join(conditions) if conditions else ""

print(build_query(status="active", role="admin"))
# WHERE status = 'active' AND role = 'admin'

# Combine all parameter types: positional, *args, keyword, **kwargs
def fn(required, *args, keyword="default", **kwargs):
    print(f"required={required}")
    print(f"args={args}")
    print(f"keyword={keyword}")
    print(f"kwargs={kwargs}")

fn("hello", 1, 2, 3, keyword="custom", x=10, y=20)
# required=hello
# args=(1, 2, 3)
# keyword=custom
# kwargs={'x': 10, 'y': 20}
\`\`\`

---

### Scope: LEGB Rule

\`\`\`python
x = "global"        # Global scope

def outer():
    x = "enclosing"   # Enclosing scope

    def inner():
        x = "local"   # Local scope
        print(x)      # local — local takes priority

    inner()
    print(x)          # enclosing

outer()
print(x)              # global

# global keyword — modify a global inside a function (use sparingly)
count = 0

def increment():
    global count
    count += 1

increment()
increment()
print(count)   # 2

# nonlocal keyword — modify enclosing scope variable
def make_counter():
    total = 0
    def add(n):
        nonlocal total
        total += n
        return total
    return add

counter = make_counter()
print(counter(5))    # 5
print(counter(3))    # 8
\`\`\`

---

### Docstrings

\`\`\`python
def calculate_stats(numbers):
    """
    Calculate descriptive statistics for a list of numbers.

    Args:
        numbers: A list of numeric values. Must be non-empty.

    Returns:
        A dict with keys: min, max, mean, total, count.

    Raises:
        ValueError: If the input list is empty.

    Example:
        >>> calculate_stats([1, 2, 3, 4, 5])
        {'min': 1, 'max': 5, 'mean': 3.0, 'total': 15, 'count': 5}
    """
    if not numbers:
        raise ValueError("Cannot calculate stats on an empty list")
    return {
        "min": min(numbers),
        "max": max(numbers),
        "mean": sum(numbers) / len(numbers),
        "total": sum(numbers),
        "count": len(numbers),
    }

# Access docstring
print(calculate_stats.__doc__)
help(calculate_stats)
\`\`\`

---

### Lambda Functions (One-Line Anonymous Functions)

\`\`\`python
# lambda args: expression
double = lambda x: x * 2
print(double(5))    # 10

# Most useful as callbacks — sorting, filtering
people = [{"name": "Tony", "age": 34}, {"name": "Aria", "age": 28}]
people.sort(key=lambda p: p["age"])
print(people)   # Aria first (28), then Tony (34)

# But for anything beyond one line, use def — it's clearer
\`\`\``,
    quiz: [
      { q: 'What does a function return if it has no return statement?', options: ['0', 'False', 'None', 'An empty string'], correct: 2, explanation: 'Python implicitly returns None when there\'s no return statement. This is a common source of bugs when you forget to return a value.' },
      { q: 'Why is using a mutable default argument (like def fn(lst=[])) dangerous?', options: ['Python doesn\'t allow list defaults', 'The list is created once and shared across all calls — mutations persist between calls', 'It causes a TypeError', 'It works fine'], correct: 1, explanation: 'Default values are evaluated once when the function is defined, not on each call. If you mutate the default (append, etc.), the next call sees the mutated version.' },
      { q: 'What does **kwargs collect inside a function?', options: ['Extra positional arguments into a list', 'Extra keyword arguments into a dictionary', 'All function parameters into a tuple', 'Only integer keyword arguments'], correct: 1, explanation: '**kwargs collects any keyword arguments not matched by explicit parameters into a dict. fn(x=1, y=2) inside fn(**kwargs) gives kwargs = {"x": 1, "y": 2}.' },
      { q: 'Which scope does Python search LAST when resolving a variable name?', options: ['Local', 'Enclosing', 'Global', 'Built-in'], correct: 3, explanation: 'LEGB order: Local → Enclosing → Global → Built-in. Built-in is the final fallback — it contains names like print, len, range that are always available.' },
    ],
    ide: {
      language: 'python',
      task: 'Write a function calculate_stats(numbers) that takes a list of numbers and returns a dictionary with min, max, average, median, and count. Handle the edge case of an empty list (raise ValueError). Then call it and print each stat on its own line.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 3
# Task: Stats function with edge-case handling

def calculate_stats(numbers):
    """
    Calculate descriptive statistics for a list of numbers.
    Returns: dict with min, max, average, median, count.
    Raises: ValueError if the list is empty.
    """
    # TODO: raise ValueError("Empty list") if numbers is empty

    # TODO: calculate min, max
    # TODO: calculate average (sum / count)
    # TODO: calculate median (sort the list, pick middle element;
    #         if even length, average the two middle elements)

    return {
        "min": None,      # replace with real value
        "max": None,
        "average": None,
        "median": None,
        "count": None,
    }


# Test with a normal list
data = [4, 7, 2, 9, 1, 5, 8, 3, 6]
stats = calculate_stats(data)
print("=== Stats ===")
for key, value in stats.items():
    print(f"{key:>8}: {value}")

# Test with an empty list — should raise ValueError
try:
    calculate_stats([])
except ValueError as e:
    print(f"\\nCaught expected error: {e}")
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m04', track: 'crash', title: 'Data Structures: Lists, Dicts, Sets & Tuples',
    subtitle: 'Master Python\'s four core data structures and know when to reach for each one.',
    moduleObjective: 'Create and manipulate lists, dicts, sets, and tuples; write list and dict comprehensions; sort complex data structures; and build a contact book with CRUD operations.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'Masters',
    xp: 175, duration: 15, module: 4, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'List', definition: 'Ordered, mutable sequence: [1, 2, 3]. Use when order matters and items change. O(1) append, O(n) search.' },
      { term: 'Tuple', definition: 'Ordered, immutable sequence: (1, 2, 3). Use for fixed data — coordinates, RGB values, function return pairs.' },
      { term: 'Dict', definition: 'Key-value mapping: {"name": "Jordan"}. Keys are unique. O(1) average lookup. Ordered by insertion (Python 3.7+).' },
      { term: 'Set', definition: 'Unordered collection of unique values: {1, 2, 3}. O(1) membership test. Use for deduplication and math set operations.' },
      { term: 'List Comprehension', definition: '[expr for item in iterable if condition] — compact, readable loop that builds a list. Faster than an equivalent for loop.' },
      { term: 'Dict Comprehension', definition: '{key: value for item in iterable} — builds a dict from any iterable in one expression.' },
      { term: 'Slicing', definition: 'Extract a sub-sequence: lst[start:stop:step]. lst[1:4] → elements at index 1, 2, 3. lst[::-1] → reversed.' },
    ],
    content: `## Data Structures: Lists, Dicts, Sets & Tuples

### Lists — Ordered, Mutable Sequences

\`\`\`python
# Creating and accessing
fruits = ["apple", "banana", "cherry"]
print(fruits[0])       # apple (0-indexed)
print(fruits[-1])      # cherry (negative: from end)
print(fruits[1:3])     # ['banana', 'cherry'] (slicing)
print(fruits[::-1])    # ['cherry', 'banana', 'apple'] (reversed)

# Mutating a list
fruits.append("mango")           # add to end
fruits.insert(1, "blueberry")    # insert at index
fruits.remove("banana")          # remove by value
popped = fruits.pop()            # remove and return last item
fruits.pop(0)                    # remove by index

# Useful list methods
nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort()                     # sort in-place
print(nums)                     # [1, 1, 2, 3, 4, 5, 6, 9]

sorted_copy = sorted(nums, reverse=True)  # new sorted list
print(nums.count(1))            # 2 — count occurrences
print(nums.index(5))            # 4 — find index of value
\`\`\`

---

### List Comprehensions

\`\`\`python
# Basic: [expression for item in iterable]
squares = [x ** 2 for x in range(1, 6)]
print(squares)   # [1, 4, 9, 16, 25]

# With filter: [expression for item in iterable if condition]
evens = [x for x in range(20) if x % 2 == 0]
print(evens)     # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transforming strings
names = ["  jordan  ", "  TONY  ", "  aria  "]
clean = [name.strip().title() for name in names]
print(clean)     # ['Jordan', 'Tony', 'Aria']

# Nested comprehension (matrix flattening)
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [n for row in matrix for n in row]
print(flat)      # [1, 2, 3, 4, 5, 6]
\`\`\`

---

### Tuples — Ordered, Immutable Sequences

\`\`\`python
# Tuples are immutable — they cannot be changed after creation
point = (10, 25)
x, y = point           # tuple unpacking
print(f"x={x}, y={y}") # x=10, y=25

# Tuples as return values (common pattern)
def get_min_max(lst):
    return min(lst), max(lst)  # returns a tuple

lo, hi = get_min_max([3, 1, 4, 1, 5, 9])
print(f"Range: {lo}–{hi}")    # Range: 1–9

# Named tuples — self-documenting tuples
from collections import namedtuple
Color = namedtuple("Color", ["r", "g", "b"])
red = Color(255, 0, 0)
print(red.r, red.g, red.b)    # 255 0 0
\`\`\`

---

### Dictionaries — Key-Value Mappings

\`\`\`python
user = {"name": "Jordan", "age": 28, "role": "admin"}

# Access
print(user["name"])                    # Jordan
print(user.get("email", "N/A"))        # N/A (safe access, no KeyError)

# Mutate
user["email"] = "jordan@example.com"   # add or update
del user["role"]                       # delete a key
user.update({"age": 29, "city": "Kingston"})   # merge multiple

# Iterate
for key in user:
    print(key)

for key, value in user.items():
    print(f"{key}: {value}")

for value in user.values():
    print(value)

# Dict comprehension
scores = {"alice": 88, "bob": 74, "carol": 95}
passing = {name: score for name, score in scores.items() if score >= 80}
print(passing)   # {'alice': 88, 'carol': 95}

# Nested dict
contacts = {
    "jordan": {"phone": "876-555-0101", "email": "j@jst.com"},
    "tony":   {"phone": "876-555-0202", "email": "t@jst.com"},
}
print(contacts["jordan"]["phone"])     # 876-555-0101
\`\`\`

---

### Sets — Unique Values, Fast Membership Tests

\`\`\`python
# Sets store unique values only
tags = {"python", "web", "api", "python"}  # duplicates removed
print(tags)    # {'python', 'web', 'api'}  (order not guaranteed)

# O(1) membership test — much faster than list for large collections
print("python" in tags)   # True

tags.add("async")
tags.discard("web")       # remove without error if missing

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)    # {1,2,3,4,5,6}  — union
print(a & b)    # {3,4}           — intersection
print(a - b)    # {1,2}           — difference (in a but not b)
print(a ^ b)    # {1,2,5,6}       — symmetric difference

# Deduplication pattern
duplicates = [1, 2, 2, 3, 3, 3, 4]
unique = list(set(duplicates))
print(sorted(unique))   # [1, 2, 3, 4]
\`\`\`

---

### When to Use Which Structure

| Need | Use |
|------|-----|
| Ordered, changeable sequence | **list** |
| Fixed, immutable sequence (coordinates, records) | **tuple** |
| Key → value lookup | **dict** |
| Unique values, fast membership test | **set** |`,
    quiz: [
      { q: 'What does lst[1:4] return for lst = [10, 20, 30, 40, 50]?', options: ['[10, 20, 30]', '[20, 30, 40]', '[20, 30, 40, 50]', '[10, 20, 30, 40]'], correct: 1, explanation: 'Slicing [start:stop] includes start, excludes stop. [1:4] means indices 1, 2, 3 → [20, 30, 40].' },
      { q: 'Which data structure should you use to check if a value exists in a large collection?', options: ['list — use "in" operator', 'tuple — immutable so faster', 'set — O(1) average lookup vs O(n) for list', 'dict — always fastest'], correct: 2, explanation: 'Set membership (x in my_set) is O(1) on average due to hashing. List search is O(n) — it checks every element. For frequent membership tests on large data, always use a set or dict.' },
      { q: 'What does this comprehension produce: [x**2 for x in range(5) if x % 2 != 0]?', options: ['[1, 9]', '[0, 4, 16]', '[1, 4, 9]', '[1, 3]'], correct: 0, explanation: 'Odd numbers in range(5): 1, 3. Their squares: 1, 9. The if condition filters first, then the expression transforms.' },
      { q: 'How does dict.get("key", "default") differ from dict["key"]?', options: ['No difference', 'get() raises KeyError if missing; ["key"] returns None', '["key"] raises KeyError if missing; get() returns the default value instead', 'get() is slower'], correct: 2, explanation: 'dict["key"] raises KeyError if the key doesn\'t exist. dict.get("key", "default") returns the default value, making it safe for optional keys.' },
    ],
    ide: {
      language: 'python',
      task: 'Build a contact book using a dictionary. Implement four operations: add_contact(book, name, phone, email), get_contact(book, name), update_contact(book, name, **fields), and delete_contact(book, name). Each should print a confirmation message. Test all four operations.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 4
# Task: Contact book CRUD with a dict

contacts = {}   # name → {phone, email}

def add_contact(book, name, phone, email):
    """Add a new contact. Print error if name already exists."""
    # TODO: check if name already exists → print "Contact already exists"
    # TODO: add {"phone": phone, "email": email} under name key
    # TODO: print "Added: {name}"
    pass

def get_contact(book, name):
    """Return the contact dict, or print "Not found" and return None."""
    # TODO: use .get() to look up name safely
    # TODO: if found, print each field; if not, print "Not found: {name}"
    pass

def update_contact(book, name, **fields):
    """Update one or more fields on an existing contact."""
    # TODO: if name not in book, print "Not found: {name}"
    # TODO: update only the provided fields (don't overwrite all)
    # TODO: print "Updated: {name}"
    pass

def delete_contact(book, name):
    """Remove a contact by name."""
    # TODO: if not found, print "Not found: {name}"
    # TODO: delete and print "Deleted: {name}"
    pass


# Test all operations
add_contact(contacts, "Jordan", "876-555-0101", "jordan@jst.com")
add_contact(contacts, "Tony",   "876-555-0202", "tony@jst.com")
add_contact(contacts, "Jordan", "000-000-0000", "dup@jst.com")  # should error

get_contact(contacts, "Tony")
get_contact(contacts, "Aria")   # not found

update_contact(contacts, "Jordan", phone="876-999-1234")
get_contact(contacts, "Jordan")

delete_contact(contacts, "Tony")
delete_contact(contacts, "Tony")   # should error
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m05', track: 'crash', title: 'Modules, Error Handling & File I/O',
    subtitle: 'Import modules, handle exceptions cleanly, and read/write files with pathlib.',
    moduleObjective: 'Use import and from/import syntax, write try/except/finally blocks, raise custom exceptions, and parse structured text data from files using pathlib.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'Masters',
    xp: 180, duration: 16, module: 5, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'import', definition: 'Loads a module: import math. Access with math.sqrt(). Use "import module" for standard library modules.' },
      { term: 'from x import y', definition: 'Import specific names: from pathlib import Path. Avoids the module prefix — use Path() directly.' },
      { term: 'try / except', definition: 'Wraps risky code. If an exception is raised in try, Python jumps to the matching except block.' },
      { term: 'finally', definition: 'A block that runs whether or not an exception occurred. Use for cleanup: closing files, releasing resources.' },
      { term: 'raise', definition: 'Manually raise an exception: raise ValueError("message"). Can re-raise caught exceptions with bare raise.' },
      { term: 'Exception (custom)', definition: 'A class that inherits from Exception: class AuthError(Exception): pass. Lets callers catch your specific error type.' },
      { term: 'pathlib.Path', definition: 'Object-oriented file path handling. Path("file.csv").read_text(), .write_text(), .exists(), .parent, .stem.' },
    ],
    content: `## Modules, Error Handling & File I/O

### Importing Modules

\`\`\`python
# Import the whole module — access with module.function()
import math
import random
import json
from datetime import datetime

print(math.pi)                    # 3.141592...
print(math.sqrt(144))             # 12.0
print(random.randint(1, 100))     # random int between 1 and 100
print(datetime.now())             # 2026-10-03 14:35:00.123456

# Import specific names — use without prefix
from math import pi, sqrt, ceil, floor
from pathlib import Path
from collections import defaultdict, Counter

print(pi)          # 3.141592...
print(ceil(4.1))   # 5
\`\`\`

---

### try / except / else / finally

\`\`\`python
# Basic try/except
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    else:
        # Runs only if no exception occurred
        print(f"Result: {result}")
        return result
    finally:
        # Runs always — exception or not
        print("divide() called")

divide(10, 2)   # Result: 5.0 / divide() called
divide(10, 0)   # Error: ... / divide() called

# Catching multiple exception types
def parse_int(value):
    try:
        return int(value)
    except (ValueError, TypeError) as e:
        print(f"Parse failed: {e}")
        return None

# Catch any exception (use sparingly)
try:
    risky_operation()
except Exception as e:
    print(f"Unexpected error: {type(e).__name__}: {e}")
    raise   # re-raise after logging — don't silently swallow errors
\`\`\`

---

### Raising Exceptions

\`\`\`python
def get_percentage(value, total):
    """Calculate percentage. Validates inputs before calculating."""
    if not isinstance(value, (int, float)):
        raise TypeError(f"value must be numeric, got {type(value).__name__}")
    if total == 0:
        raise ValueError("total cannot be zero")
    if value < 0 or total < 0:
        raise ValueError("value and total must be non-negative")
    return (value / total) * 100

try:
    print(get_percentage(75, 100))    # 75.0
    print(get_percentage(75, 0))      # raises ValueError
except ValueError as e:
    print(f"ValueError: {e}")
\`\`\`

---

### Custom Exception Classes

\`\`\`python
class ValidationError(Exception):
    """Raised when input data fails validation."""
    def __init__(self, field, message):
        self.field = field
        super().__init__(f"[{field}] {message}")

class AuthenticationError(Exception):
    """Raised when authentication fails."""
    pass

def validate_email(email):
    if "@" not in email:
        raise ValidationError("email", f"'{email}' is not a valid email address")
    if len(email) > 254:
        raise ValidationError("email", "Email exceeds maximum length")
    return True

try:
    validate_email("not-an-email")
except ValidationError as e:
    print(f"Validation failed on field '{e.field}': {e}")
\`\`\`

---

### File I/O with pathlib

\`\`\`python
from pathlib import Path

# Writing a file
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)   # create directory, no error if exists

output = data_dir / "report.txt"   # / operator builds paths safely
output.write_text("Line 1\\nLine 2\\nLine 3", encoding="utf-8")

# Reading a file
content = output.read_text(encoding="utf-8")
print(content)

lines = content.splitlines()   # split into list of lines
print(lines)                   # ['Line 1', 'Line 2', 'Line 3']

# Check existence
print(output.exists())         # True
print(output.name)             # report.txt
print(output.stem)             # report
print(output.suffix)           # .txt
print(output.parent)           # data

# List files in a directory
for f in data_dir.iterdir():
    print(f.name)
\`\`\`

---

### Parsing CSV-Style Data with Error Handling

\`\`\`python
from pathlib import Path

CSV_DATA = """name,age,score
Jordan,28,94.5
Tony,34,88.0
invalid_row
Aria,25,97.2
,30,70.0
"""

def parse_csv(csv_string):
    """
    Parse a CSV string into a list of dicts.
    Skips malformed rows and logs warnings.
    """
    lines = csv_string.strip().splitlines()
    headers = lines[0].split(",")
    records = []

    for line_num, line in enumerate(lines[1:], start=2):
        parts = line.split(",")
        if len(parts) != len(headers):
            print(f"  Warning: Line {line_num} has wrong field count, skipping")
            continue
        row = dict(zip(headers, parts))
        if not row.get("name"):
            print(f"  Warning: Line {line_num} missing name, skipping")
            continue
        try:
            row["age"] = int(row["age"])
            row["score"] = float(row["score"])
        except ValueError as e:
            print(f"  Warning: Line {line_num} type conversion failed ({e}), skipping")
            continue
        records.append(row)

    return records

records = parse_csv(CSV_DATA)
for r in records:
    print(r)
\`\`\``,
    quiz: [
      { q: 'What is the difference between "import math" and "from math import sqrt"?', options: ['"import math" is slower', '"from math import sqrt" lets you call sqrt() directly; "import math" requires math.sqrt()', 'They are identical', '"from math import sqrt" copies the function, so it\'s slower'], correct: 1, explanation: '"from math import sqrt" binds the name sqrt directly in your namespace. "import math" adds the math module — you access everything via math.sqrt(). Both are valid; use "from x import y" when you only need specific names.' },
      { q: 'When does the finally block execute?', options: ['Only when no exception is raised', 'Only when an exception is raised', 'Always — whether an exception was raised or not', 'Only after return statements'], correct: 2, explanation: 'finally always runs — it\'s guaranteed cleanup. Use it to close files, database connections, or release locks, regardless of whether the operation succeeded.' },
      { q: 'What does "raise" without arguments do inside an except block?', options: ['Clears the exception', 'Re-raises the currently handled exception', 'Raises a new generic Exception', 'Causes a SyntaxError'], correct: 1, explanation: 'Bare "raise" inside an except block re-raises the caught exception, preserving its original traceback. Useful when you want to log an error but still let it propagate.' },
      { q: 'How does pathlib.Path handle file path separators across operating systems?', options: ['You must use \\\\ on Windows and / on Unix manually', 'Path uses the / operator and automatically uses the correct separator for the OS', 'pathlib only works on Unix', 'You must call Path.normalize() explicitly'], correct: 1, explanation: 'The / operator on Path objects builds paths using os.sep automatically. Path("data") / "file.txt" works correctly on both Windows and Unix without any manual separator handling.' },
    ],
    ide: {
      language: 'python',
      task: 'Write a parse_records function that accepts a CSV-style multi-line string (first line is headers), parses it into a list of dicts, converts numeric fields to int/float, skips rows that are malformed or have missing required fields, and returns the valid records. Test it with a string containing both valid and invalid rows.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 5
# Task: CSV parser with error handling

CSV_DATA = """id,name,age,score
1,Jordan,28,94.5
2,Tony,34,88.0
3,,25,97.2
4,Aria,not_a_number,91.0
5,Marcus,31,85.5
bad_row_here
7,Nova,29,78.0
"""


def parse_records(csv_string):
    """
    Parse CSV string into a list of dicts.
    - First line is the header row
    - Convert 'age' to int and 'score' to float
    - Skip rows with wrong field count (log a warning)
    - Skip rows with empty 'name' (log a warning)
    - Skip rows where type conversion fails (log a warning)
    Returns a list of valid record dicts.
    """
    # TODO: split csv_string into lines
    # TODO: parse the header line
    # TODO: loop through remaining lines
    #   - check field count
    #   - build a dict with zip(headers, parts)
    #   - validate non-empty name
    #   - convert age to int, score to float (try/except)
    #   - append to records on success
    return []


records = parse_records(CSV_DATA)
print(f"\\nParsed {len(records)} valid records:")
for r in records:
    print(r)
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m06', track: 'crash', title: 'Classes & Object-Oriented Programming',
    subtitle: 'Model real-world systems using classes, inheritance, __dunder__ methods, and dataclasses.',
    moduleObjective: 'Define classes with __init__, instance methods, and __str__; implement inheritance with super(); use @property for computed attributes; and build a BankAccount class.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'PhD',
    xp: 185, duration: 16, module: 6, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'class', definition: 'Blueprint for creating objects. class Dog: defines the Dog type. dog = Dog() creates an instance.' },
      { term: '__init__', definition: 'Constructor method. Called automatically when an instance is created. Initializes instance attributes via self.' },
      { term: 'self', definition: 'Reference to the current instance inside a method. Always the first parameter of instance methods.' },
      { term: 'Inheritance', definition: 'A child class extends a parent: class SavingsAccount(BankAccount). The child inherits all parent methods.' },
      { term: 'super()', definition: 'Calls the parent class\'s method. Used in __init__ to run the parent constructor before adding child-specific setup.' },
      { term: '@property', definition: 'Decorator that turns a method into a read-only attribute: @property def balance(self): return self._balance.' },
      { term: 'dataclass', definition: '@dataclass from dataclasses auto-generates __init__, __repr__, __eq__ from class fields. Less boilerplate.' },
    ],
    content: `## Classes & Object-Oriented Programming

### Defining a Class

\`\`\`python
class Product:
    """A product in an inventory system."""

    # Class variable — shared across ALL instances
    currency = "USD"
    product_count = 0

    def __init__(self, name, price, stock=0):
        """Initialize a Product instance."""
        # Instance variables — unique to each object
        self.name = name
        self.price = price
        self.stock = stock
        Product.product_count += 1

    def __str__(self):
        """Human-readable string — used by print()."""
        return f"{self.name} (\${self.price:.2f})"

    def __repr__(self):
        """Unambiguous string — used in debugging/REPL."""
        return f"Product(name={self.name!r}, price={self.price}, stock={self.stock})"

    def apply_discount(self, percent):
        """Return a new price after applying discount."""
        if not 0 < percent < 100:
            raise ValueError(f"Discount must be between 0 and 100, got {percent}")
        return self.price * (1 - percent / 100)

    def restock(self, quantity):
        if quantity <= 0:
            raise ValueError("Restock quantity must be positive")
        self.stock += quantity
        return self.stock


laptop = Product("MacBook Pro", 2499.00, stock=5)
keyboard = Product("Mechanical Keyboard", 149.99)

print(laptop)               # MacBook Pro ($2499.00)
print(repr(laptop))         # Product(name='MacBook Pro', price=2499.0, stock=5)
print(laptop.apply_discount(10))   # 2249.1
print(Product.product_count)       # 2
\`\`\`

---

### @property — Computed Attributes

\`\`\`python
class Circle:
    def __init__(self, radius):
        if radius <= 0:
            raise ValueError("Radius must be positive")
        self._radius = radius   # _ prefix = "private by convention"

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value

    @property
    def area(self):
        import math
        return math.pi * self._radius ** 2

    @property
    def circumference(self):
        import math
        return 2 * math.pi * self._radius


c = Circle(5)
print(c.area)           # 78.53981...
print(c.circumference)  # 31.41592...
c.radius = 10           # uses the setter
c.radius = -1           # ValueError!
\`\`\`

---

### Inheritance

\`\`\`python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

    def describe(self):
        return f"{self.name} is a {self.species}"

    def speak(self):
        raise NotImplementedError("Subclasses must implement speak()")


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, species="Canis lupus familiaris")
        self.breed = breed

    def speak(self):
        return f"{self.name} says: Woof!"

    def fetch(self, item="ball"):
        return f"{self.name} fetches the {item}!"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says: Meow."


dog = Dog("Rex", "German Shepherd")
cat = Cat("Luna", "Felis catus")

print(dog.describe())    # Rex is a Canis lupus familiaris
print(dog.speak())       # Rex says: Woof!
print(dog.fetch("stick"))
print(cat.speak())       # Luna says: Meow.

# isinstance — checks class hierarchy
print(isinstance(dog, Animal))   # True
print(isinstance(dog, Dog))      # True
print(isinstance(dog, Cat))      # False
\`\`\`

---

### dataclasses — Less Boilerplate

\`\`\`python
from dataclasses import dataclass, field
from typing import List

@dataclass
class Transaction:
    amount: float
    description: str
    transaction_type: str   # "credit" or "debit"

    def __post_init__(self):
        if self.amount <= 0:
            raise ValueError("Transaction amount must be positive")
        if self.transaction_type not in ("credit", "debit"):
            raise ValueError(f"Invalid type: {self.transaction_type}")

@dataclass
class Account:
    owner: str
    account_number: str
    _balance: float = field(default=0.0, repr=False)
    _transactions: List[Transaction] = field(default_factory=list, repr=False)

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount, description="Deposit"):
        t = Transaction(amount, description, "credit")
        self._balance += amount
        self._transactions.append(t)
        return self._balance

    def withdraw(self, amount, description="Withdrawal"):
        if amount > self._balance:
            raise ValueError(f"Insufficient funds (balance: {self._balance:.2f})")
        t = Transaction(amount, description, "debit")
        self._balance -= amount
        self._transactions.append(t)
        return self._balance

    def history(self):
        for t in self._transactions:
            sign = "+" if t.transaction_type == "credit" else "-"
            print(f"  {sign}\${t.amount:.2f}  {t.description}")

acc = Account("Jordan", "ACC-001")
acc.deposit(1000, "Initial deposit")
acc.deposit(500, "Client payment")
acc.withdraw(200, "Rent")
print(f"Balance: \${acc.balance:.2f}")
acc.history()
\`\`\``,
    quiz: [
      { q: 'What is the purpose of "self" in a Python class method?', options: ['It\'s the class name', 'It\'s a reference to the current instance — it allows methods to access instance attributes', 'It\'s Python\'s way of saying "public"', 'It passes global state to the method'], correct: 1, explanation: 'self refers to the specific instance the method is called on. dog.speak() is equivalent to Dog.speak(dog). Python passes the instance automatically as the first argument.' },
      { q: 'What does super().__init__() do inside a child class?', options: ['Creates a new parent class instance', 'Calls the parent\'s __init__ to run its setup before the child adds its own attributes', 'Overrides all parent methods', 'Imports the parent module'], correct: 1, explanation: 'super().__init__() runs the parent constructor first. Without it, the parent\'s __init__ logic (setting up its attributes) never runs, and the child instance will be missing those attributes.' },
      { q: 'What is the difference between __str__ and __repr__?', options: ['They are identical', '__str__ is for humans (used by print), __repr__ is for developers (used in debugging/REPL)', '__repr__ is faster', '__str__ can only return strings; __repr__ can return any type'], correct: 1, explanation: '__str__ should be readable for end users. __repr__ should be unambiguous and ideally show how to recreate the object. If only __repr__ is defined, it\'s used for both.' },
      { q: 'What does the @property decorator accomplish?', options: ['It makes a method a class method', 'It marks a method as private', 'It lets you access a method like an attribute, without calling it with ()', 'It makes an attribute immutable'], correct: 2, explanation: '@property turns circle.area() into circle.area — no parentheses needed. It\'s used for computed attributes and for controlled access to private attributes via getters/setters.' },
    ],
    ide: {
      language: 'python',
      task: 'Build a BankAccount class with: __init__(owner, account_number, initial_balance=0), deposit(amount) method, withdraw(amount) method that raises ValueError on overdraft, a balance property, a __str__ method, and a transaction_history() method. Test all methods including the overdraft error.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 6
# Task: BankAccount class with full CRUD and history

class BankAccount:
    """A simple bank account with deposit, withdraw, and history."""

    def __init__(self, owner, account_number, initial_balance=0):
        # TODO: set self.owner, self.account_number
        # TODO: set self._balance = initial_balance (private by convention)
        # TODO: initialize self._history = []  (list of strings)
        pass

    @property
    def balance(self):
        """Read-only balance property."""
        # TODO: return self._balance
        pass

    def deposit(self, amount):
        """Deposit amount. Raises ValueError if amount <= 0."""
        # TODO: validate amount > 0
        # TODO: add to _balance
        # TODO: append "+\${amount:.2f} Deposit" to _history
        # TODO: return new balance
        pass

    def withdraw(self, amount):
        """Withdraw amount. Raises ValueError on overdraft or invalid amount."""
        # TODO: validate amount > 0
        # TODO: validate amount <= balance (raise ValueError if overdraft)
        # TODO: subtract from _balance
        # TODO: append "-\${amount:.2f} Withdrawal" to _history
        # TODO: return new balance
        pass

    def transaction_history(self):
        """Print all transactions."""
        # TODO: print "=== Transaction History: {owner} ==="
        # TODO: print each item in _history
        # TODO: print "Current Balance: \${balance:.2f}"
        pass

    def __str__(self):
        return f"BankAccount({self.owner}, #{self.account_number}, \${self.balance:.2f})"


# Test the class
acc = BankAccount("Jordan Morris", "ACC-2026-001", initial_balance=500)
print(acc)

acc.deposit(1000)
acc.deposit(250.50)
acc.withdraw(300)

print(f"Balance: \${acc.balance:.2f}")
acc.transaction_history()

# Test overdraft protection
try:
    acc.withdraw(10000)
except ValueError as e:
    print(f"\\nCaught: {e}")
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m07', track: 'crash', title: 'APIs & Async: HTTP Requests and asyncio',
    subtitle: 'Fetch real data from HTTP APIs, parse JSON, and write async code with asyncio and aiohttp.',
    moduleObjective: 'Use the requests library for synchronous HTTP GET/POST, parse JSON responses, handle HTTP errors properly, and write async equivalents using asyncio and aiohttp.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'PhD',
    xp: 190, duration: 17, module: 7, certArea: 'Python Crash Course',
    keyTerms: [
      { term: 'requests', definition: 'Third-party HTTP library. pip install requests. Simplest way to make HTTP calls: requests.get(url).json().' },
      { term: 'Response', definition: 'Object returned by requests.get(). Has .status_code, .json(), .text, .headers, .raise_for_status().' },
      { term: 'raise_for_status()', definition: 'Method on a requests Response that raises HTTPError if status >= 400. Always call this before processing data.' },
      { term: 'asyncio', definition: 'Python\'s built-in async framework. asyncio.run() is the entry point. An event loop runs coroutines concurrently.' },
      { term: 'async / await', definition: 'async def marks a coroutine function. await pauses execution until the awaited operation completes.' },
      { term: 'aiohttp', definition: 'Async HTTP library. pip install aiohttp. Use inside async functions for concurrent network calls without blocking.' },
      { term: 'asyncio.gather()', definition: 'Runs multiple coroutines concurrently: results = await asyncio.gather(coro1(), coro2()). Returns a list of results.' },
    ],
    content: `## APIs & Async: HTTP Requests and asyncio

### Installing Dependencies

\`\`\`bash
pip install requests aiohttp
\`\`\`

---

### Synchronous HTTP with requests

\`\`\`python
import requests
import json

# GET request — fetch a resource
def get_user(user_id):
    """Fetch a single user from the JSONPlaceholder API."""
    url = f"https://jsonplaceholder.typicode.com/users/{user_id}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()    # raises HTTPError for 4xx/5xx
        return response.json()
    except requests.exceptions.Timeout:
        print(f"Request timed out for user {user_id}")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error {e.response.status_code}: {e}")
        return None
    except requests.exceptions.ConnectionError:
        print("Could not connect to the server")
        return None

user = get_user(1)
if user:
    print(f"Name: {user['name']}")
    print(f"Email: {user['email']}")
    print(f"City: {user['address']['city']}")
\`\`\`

---

### POST Request with JSON Body

\`\`\`python
import requests

def create_post(title, body, user_id):
    """Create a new post via POST request."""
    url = "https://jsonplaceholder.typicode.com/posts"
    payload = {
        "title": title,
        "body": body,
        "userId": user_id,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer your-token-here",
    }

    response = requests.post(url, json=payload, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json()

post = create_post("My First Post", "Content here", user_id=1)
print(f"Created post ID: {post['id']}")
print(f"Title: {post['title']}")
\`\`\`

---

### Understanding the requests Session

\`\`\`python
import requests

# Use a Session for multiple requests to the same host
# It reuses the TCP connection and applies shared headers/auth

def fetch_all_posts(base_url="https://jsonplaceholder.typicode.com"):
    with requests.Session() as session:
        session.headers.update({
            "Accept": "application/json",
            "User-Agent": "JST-Academy/1.0",
        })

        # Fetch posts
        resp = session.get(f"{base_url}/posts", timeout=10)
        resp.raise_for_status()
        posts = resp.json()

        # Fetch users
        resp = session.get(f"{base_url}/users", timeout=10)
        resp.raise_for_status()
        users = resp.json()

        # Join: attach user info to each post
        user_map = {u["id"]: u["name"] for u in users}
        for post in posts[:5]:
            author = user_map.get(post["userId"], "Unknown")
            print(f"[{author}] {post['title'][:50]}...")

fetch_all_posts()
\`\`\`

---

### Async Python with asyncio

\`\`\`python
import asyncio

# async def defines a coroutine — a function that can pause and resume
async def fetch_data(name, delay):
    print(f"Starting {name}...")
    await asyncio.sleep(delay)     # non-blocking pause (simulates I/O)
    print(f"Finished {name} after {delay}s")
    return f"{name}: done"

# Run a single coroutine
async def main():
    result = await fetch_data("task-1", 2)
    print(result)

asyncio.run(main())

# Run multiple coroutines CONCURRENTLY with gather
async def main_concurrent():
    # These run at the same time — total time ≈ 3s (longest), not 2+1+3=6s
    results = await asyncio.gather(
        fetch_data("task-A", 2),
        fetch_data("task-B", 1),
        fetch_data("task-C", 3),
    )
    print("All done:", results)

asyncio.run(main_concurrent())
\`\`\`

---

### Async HTTP with aiohttp

\`\`\`python
import asyncio
import aiohttp

async def fetch_user(session, user_id):
    """Fetch a single user asynchronously."""
    url = f"https://jsonplaceholder.typicode.com/users/{user_id}"
    async with session.get(url) as response:
        response.raise_for_status()
        return await response.json()

async def fetch_all_users(user_ids):
    """Fetch multiple users concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_user(session, uid) for uid in user_ids]
        users = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    for uid, user in zip(user_ids, users):
        if isinstance(user, Exception):
            print(f"Error fetching user {uid}: {user}")
        else:
            results.append(user)
    return results

async def main():
    users = await fetch_all_users([1, 2, 3, 4, 5])
    for u in users:
        print(f"{u['name']} — {u['email']}")

asyncio.run(main())
\`\`\`

---

### Sync vs Async: When to Use Which

| Scenario | Use |
|----------|-----|
| Simple script, one request | requests (sync) |
| Many requests, need speed | aiohttp (async) |
| Web framework (Django, Flask) | requests is fine (sync) |
| FastAPI, async web app | aiohttp or httpx |
| CPU-bound work | Neither — use multiprocessing |

**The rule:** async shines when you're waiting for I/O (network, disk). If you're doing heavy computation, async won't help — it's still single-threaded.`,
    quiz: [
      { q: 'What does response.raise_for_status() do?', options: ['Returns the HTTP status code', 'Raises an HTTPError exception if the status code is 4xx or 5xx', 'Converts the response to JSON', 'Retries the request on failure'], correct: 1, explanation: 'raise_for_status() examines the status code. If it\'s >= 400 (client error) or >= 500 (server error), it raises requests.exceptions.HTTPError. Always call this before processing the response.' },
      { q: 'What is the main advantage of asyncio.gather() vs awaiting each coroutine sequentially?', options: ['It\'s more readable', 'It runs coroutines sequentially, saving memory', 'It runs coroutines concurrently, so total time ≈ the slowest, not the sum', 'It handles exceptions automatically'], correct: 2, explanation: 'Sequential: 3 requests of 1s each = 3s. gather(): all three run at once = ~1s. gather() is essential for high-performance async code — it maximizes concurrency.' },
      { q: 'When should you use aiohttp over the requests library?', options: ['When you need to parse JSON', 'When making many concurrent HTTP calls in an async context', 'When making a single synchronous HTTP call', 'When the API requires authentication'], correct: 1, explanation: 'requests is synchronous — it blocks while waiting for each response. In an async context (like FastAPI or when fetching many URLs), aiohttp is non-blocking, so multiple requests happen concurrently.' },
      { q: 'What does "await" do inside an async function?', options: ['It blocks the entire Python process', 'It suspends the current coroutine and gives control back to the event loop, allowing other coroutines to run', 'It creates a new thread', 'It makes the function synchronous'], correct: 1, explanation: 'await pauses the current coroutine without blocking other coroutines. The event loop can run other awaitable tasks while this one is waiting for I/O — that\'s the concurrency model.' },
    ],
    ide: {
      language: 'python',
      task: 'Write two versions of a data-fetching function. Version 1 (sync): fetch_user_sync(user_id) using requests. Version 2 (async): fetch_user_async(user_id) using asyncio and aiohttp. Both should return a dict with the user\'s name and email. Since Pyodide can\'t make real HTTP calls, simulate the fetch with a dict lookup and asyncio.sleep() for the async version.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 7
# Task: Sync and async fetch functions
# Note: Pyodide cannot make real HTTP requests, so we simulate
# the network call using a local dict and asyncio.sleep()

import asyncio

# --- Simulated database (stands in for a real API) ---
MOCK_USERS = {
    1: {"id": 1, "name": "Jordan Morris", "email": "jordan@jst.com"},
    2: {"id": 2, "name": "Tony Stark",    "email": "tony@jst.com"},
    3: {"id": 3, "name": "Aria Nova",     "email": "aria@jst.com"},
    4: {"id": 4, "name": "Marcus Lane",   "email": "marcus@jst.com"},
}


# --- Sync version ---
def fetch_user_sync(user_id):
    """Simulate a synchronous HTTP GET for a user.
    Returns {"name": ..., "email": ...} or raises ValueError if not found.
    """
    # TODO: look up user_id in MOCK_USERS
    # TODO: raise ValueError(f"User {user_id} not found") if missing
    # TODO: return dict with only "name" and "email" keys
    pass


# --- Async version ---
async def fetch_user_async(user_id):
    """Simulate an async HTTP GET for a user.
    Awaits asyncio.sleep(0.1) to simulate network latency.
    Returns {"name": ..., "email": ...} or raises ValueError if not found.
    """
    await asyncio.sleep(0.1)   # simulate network latency
    # TODO: same lookup logic as sync version
    pass


async def fetch_all_async(user_ids):
    """Fetch multiple users concurrently using asyncio.gather()."""
    # TODO: use asyncio.gather() with return_exceptions=True
    # TODO: print each user's name and email (skip exceptions)
    pass


# --- Run both versions ---
print("=== Sync fetch ===")
for uid in [1, 2, 99]:
    try:
        user = fetch_user_sync(uid)
        print(f"Found: {user['name']} <{user['email']}>")
    except ValueError as e:
        print(f"Error: {e}")

print("\\n=== Async fetch (concurrent) ===")
asyncio.run(fetch_all_async([1, 2, 3, 4, 99]))
`,
        },
      ],
    },
  },

  {
    id: 'cc-python-m08', track: 'crash', title: 'Capstone: Multi-Module CLI Expense Tracker',
    subtitle: 'Build a real multi-file Python project with proper structure, imports, argparse, and file persistence.',
    moduleObjective: 'Structure a multi-module Python project with __init__.py and relative imports, build a CLI tool with argparse, persist data to a JSON file, and apply every concept from modules 1–7.',
    courseObjective: CC_PY_OBJ, crashId: 'cc-python', crashTitle: 'Python', level: 'PhD',
    xp: 195, duration: 18, module: 8, certArea: 'Python Crash Course',
    keyTerms: [
      { term: '__init__.py', definition: 'Empty (or not) file that marks a directory as a Python package. Enables "from expenses import models".' },
      { term: 'Relative Import', definition: 'Import from within the same package: from .models import Expense. The dot means "current package".' },
      { term: 'argparse', definition: 'Standard library module for building CLI tools. Defines commands, flags, and arguments. Generates --help automatically.' },
      { term: 'Package Structure', definition: 'A project with a src/ directory, package subdirectory with __init__.py, and a main entry-point at the root.' },
      { term: 'json module', definition: 'Built-in module for JSON serialization. json.dump(data, file) writes JSON. json.load(file) reads it back.' },
      { term: 'argparse subparsers', definition: 'Adds sub-commands to a CLI: python main.py add --amount 50 --category food --note "lunch".' },
      { term: 'if __name__ == "__main__"', definition: 'Guard that runs code only when the file is executed directly, not when imported as a module.' },
    ],
    content: `## Capstone: Multi-Module CLI Expense Tracker

### Project Structure

\`\`\`
expense-tracker/
├── main.py             ← CLI entry point
├── expenses/
│   ├── __init__.py     ← makes 'expenses' a package
│   ├── models.py       ← Expense class + data validation
│   ├── storage.py      ← JSON file read/write
│   └── reports.py      ← summary/stats functions
└── data/
    └── expenses.json   ← persisted data (created on first run)
\`\`\`

This structure mirrors real Python projects: one package (expenses/) containing logically grouped modules, and a top-level entry point.

---

### expenses/models.py — Data Model

\`\`\`python
# expenses/models.py
from dataclasses import dataclass, field, asdict
from datetime import datetime
import uuid

VALID_CATEGORIES = {"food", "transport", "housing", "entertainment", "health", "other"}

@dataclass
class Expense:
    amount: float
    category: str
    note: str = ""
    date: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    def __post_init__(self):
        if self.amount <= 0:
            raise ValueError(f"Amount must be positive, got {self.amount}")
        self.category = self.category.lower()
        if self.category not in VALID_CATEGORIES:
            raise ValueError(
                f"Invalid category '{self.category}'. "
                f"Valid options: {', '.join(sorted(VALID_CATEGORIES))}"
            )

    def to_dict(self):
        return asdict(self)

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

    def __str__(self):
        note_str = f" — {self.note}" if self.note else ""
        return f"[{self.id}] {self.date}  \${self.amount:.2f}  {self.category:<14}{note_str}"
\`\`\`

---

### expenses/storage.py — Persistence

\`\`\`python
# expenses/storage.py
import json
from pathlib import Path
from .models import Expense   # relative import — . means "this package"

DATA_FILE = Path("data/expenses.json")

def load_expenses():
    """Load all expenses from JSON file. Returns empty list if file missing."""
    DATA_FILE.parent.mkdir(exist_ok=True)
    if not DATA_FILE.exists():
        return []
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return [Expense.from_dict(item) for item in data]
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Warning: Could not read data file ({e}). Starting fresh.")
        return []

def save_expenses(expenses):
    """Persist expenses list to JSON file."""
    DATA_FILE.parent.mkdir(exist_ok=True)
    data = [e.to_dict() for e in expenses]
    DATA_FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
\`\`\`

---

### expenses/reports.py — Analytics

\`\`\`python
# expenses/reports.py
from collections import defaultdict
from .models import Expense

def summary(expenses):
    """Print a per-category summary and grand total."""
    if not expenses:
        print("No expenses recorded yet.")
        return

    by_category = defaultdict(float)
    for e in expenses:
        by_category[e.category] += e.amount

    total = sum(by_category.values())
    print("\\n=== Expense Summary ===")
    for cat, amount in sorted(by_category.items(), key=lambda x: -x[1]):
        bar = "█" * int(amount / total * 30)
        print(f"  {cat:<14} \${amount:>8.2f}  {bar}")
    print(f"  {'TOTAL':<14} \${total:>8.2f}")
    print(f"  {len(expenses)} transactions")
\`\`\`

---

### main.py — CLI Entry Point with argparse

\`\`\`python
# main.py
import argparse
import sys
from expenses.models import Expense, VALID_CATEGORIES
from expenses.storage import load_expenses, save_expenses
from expenses.reports import summary

def cmd_add(args):
    expenses = load_expenses()
    try:
        expense = Expense(
            amount=args.amount,
            category=args.category,
            note=args.note or "",
        )
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)
    expenses.append(expense)
    save_expenses(expenses)
    print(f"Added: {expense}")

def cmd_list(args):
    expenses = load_expenses()
    if not expenses:
        print("No expenses yet. Add one with: python main.py add --amount 50 --category food")
        return
    for e in expenses:
        print(e)

def cmd_summary(args):
    summary(load_expenses())

def cmd_delete(args):
    expenses = load_expenses()
    original_count = len(expenses)
    expenses = [e for e in expenses if e.id != args.id]
    if len(expenses) == original_count:
        print(f"No expense found with ID: {args.id}")
    else:
        save_expenses(expenses)
        print(f"Deleted expense {args.id}")

def main():
    parser = argparse.ArgumentParser(
        prog="expense-tracker",
        description="Track your expenses from the command line.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # add subcommand
    add_p = subparsers.add_parser("add", help="Add a new expense")
    add_p.add_argument("--amount",   type=float, required=True, help="Expense amount")
    add_p.add_argument("--category", required=True, choices=sorted(VALID_CATEGORIES))
    add_p.add_argument("--note",     default="", help="Optional description")
    add_p.set_defaults(func=cmd_add)

    # list subcommand
    list_p = subparsers.add_parser("list", help="List all expenses")
    list_p.set_defaults(func=cmd_list)

    # summary subcommand
    sum_p = subparsers.add_parser("summary", help="Show category summary")
    sum_p.set_defaults(func=cmd_summary)

    # delete subcommand
    del_p = subparsers.add_parser("delete", help="Delete an expense by ID")
    del_p.add_argument("id", help="The 8-character expense ID")
    del_p.set_defaults(func=cmd_delete)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
\`\`\`

**Run the CLI:**
\`\`\`bash
python main.py add --amount 45.50 --category food --note "Lunch at JST"
python main.py add --amount 120 --category transport
python main.py list
python main.py summary
python main.py delete abc12345
python main.py --help
\`\`\`

---

### Key Concepts Demonstrated

1. **Package structure** — expenses/ is importable because of __init__.py
2. **Relative imports** — from .models import Expense keeps modules decoupled
3. **Dataclasses** — __post_init__ for validation, asdict() for serialization
4. **argparse subparsers** — each command maps to a function
5. **if __name__ == "__main__"** — prevents main() from running on import
6. **Pathlib** — clean file I/O without os.path gymnastics
7. **Error handling** — validation errors exit cleanly with sys.exit(1)`,
    quiz: [
      { q: 'What makes a directory a Python package (importable with from package import module)?', options: ['The directory must be in sys.path', 'A __init__.py file must exist in the directory', 'All .py files must start with a package declaration', 'The directory must be named "src"'], correct: 1, explanation: '__init__.py (even if empty) marks a directory as a Python package. Without it, Python 3 will still often find "namespace packages", but an explicit __init__.py is the conventional and explicit way.' },
      { q: 'What does "from .models import Expense" mean?', options: ['Import from a module called ".models" at the system level', 'Import from models.py in the current package (relative import)', 'Import from a hidden file called models', 'Import the default export from models'], correct: 1, explanation: 'The leading dot means "relative to the current package". from .models imports from models.py in the same package directory. from ..models would go up one level.' },
      { q: 'What is the purpose of "if __name__ == \'__main__\'"?', options: ['It makes the file faster to import', 'It prevents the code from running when the file is imported as a module — only runs when executed directly', 'It declares main() as the entry point for all Python files', 'It\'s required for argparse to work'], correct: 1, explanation: 'When Python imports a module, __name__ is the module\'s name. When you run a file directly, __name__ == "__main__". This guard lets a file be both a runnable script and an importable module.' },
      { q: 'What does argparse\'s "subparsers" feature enable?', options: ['Running multiple scripts in parallel', 'Sub-commands like "git commit", "git push" — each command has its own arguments and handler function', 'Optional positional arguments', 'Auto-generating documentation'], correct: 1, explanation: 'Subparsers enable multi-command CLIs. parser.add_subparsers() creates a top-level command dispatcher. Each sub-parser (add, list, delete) defines its own arguments, and set_defaults(func=...) maps it to a handler function.' },
    ],
    ide: {
      language: 'python',
      task: 'Build a self-contained expense tracker in a single main.py file (simulating the multi-module version). Implement: an Expense dataclass with amount, category, note, date fields; add_expense(), list_expenses(), and summary() functions; an in-memory list to store expenses; and a simple CLI loop that lets the user choose an action. No argparse needed — use input() to drive the menu.',
      files: [
        {
          name: 'main.py',
          language: 'python',
          code: `# JST Academy — Python Crash Course: Module 8 Capstone
# Task: Self-contained expense tracker with dataclass + menu loop
# (Single-file version of the multi-module project)

from dataclasses import dataclass, field
from datetime import datetime

VALID_CATEGORIES = ["food", "transport", "housing", "entertainment", "health", "other"]

@dataclass
class Expense:
    amount: float
    category: str
    note: str = ""
    date: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))

    def __post_init__(self):
        # TODO: validate amount > 0 (raise ValueError)
        # TODO: normalize category to lowercase
        # TODO: validate category is in VALID_CATEGORIES (raise ValueError)
        pass

    def __str__(self):
        note_part = f" — {self.note}" if self.note else ""
        return f"{self.date}  \${self.amount:<8.2f}  {self.category:<14}{note_part}"


expenses = []   # in-memory store


def add_expense():
    """Prompt user for expense details and add to list."""
    # TODO: prompt for amount (float), category, and note
    # TODO: create Expense instance (wrap in try/except for ValueError)
    # TODO: append to expenses list
    # TODO: print "Added: {expense}"
    pass


def list_expenses():
    """Print all expenses or a message if none exist."""
    # TODO: if no expenses, print "No expenses yet."
    # TODO: print each expense with its index (1-based)
    pass


def summary():
    """Print total per category and grand total."""
    if not expenses:
        print("No expenses to summarize.")
        return
    # TODO: use a dict to accumulate total per category
    # TODO: print each category with its total
    # TODO: print grand total
    pass


def main():
    """Main menu loop."""
    print("=== JST Expense Tracker ===")
    while True:
        print("\\n1. Add expense")
        print("2. List expenses")
        print("3. Summary")
        print("4. Quit")
        choice = input("Choose (1-4): ").strip()

        if choice == "1":
            add_expense()
        elif choice == "2":
            list_expenses()
        elif choice == "3":
            summary()
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Enter 1, 2, 3, or 4.")


if __name__ == "__main__":
    main()
`,
        },
      ],
    },
  },
]
