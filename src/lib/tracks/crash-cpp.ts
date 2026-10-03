import type { Course } from '../courses'

const COURSE_OBJECTIVE =
  'Master modern C++ from zero to production — understand memory, master OOP and the STL, use smart pointers correctly, and build a clean multi-file project by the final module.'

export const crashCppCourses: Course[] = [
  // ── Module 1 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m01',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'Environment & Hello World',
    subtitle: 'Install a compiler, configure VS Code, and understand compile flags',
    level: 'Basic',
    xp: 155,
    duration: 20,
    module: 1,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Install g++ or clang++, configure VS Code with the C/C++ extension, compile a Hello World program with modern flags, and understand the compilation pipeline.',
    keyTerms: [
      { term: 'g++', definition: 'The GNU C++ compiler — available on Linux/macOS; on Windows install via MSYS2/MinGW or WSL.' },
      { term: 'clang++', definition: 'The LLVM C++ compiler — better error messages than g++; default on macOS with Xcode Command Line Tools.' },
      { term: '-std=c++17', definition: 'Compiler flag selecting the C++17 language standard — use c++20 for newer projects.' },
      { term: '-Wall -Wextra', definition: 'Enable most compiler warnings — essential for catching bugs early.' },
      { term: 'Preprocessor', definition: 'First stage of compilation — handles #include, #define, and conditional compilation.' },
      { term: 'Linker', definition: 'Final stage — combines object files and libraries into the executable.' },
    ],
    content: `## Setting Up C++

### 1. Install a Compiler

**macOS:**
\`\`\`bash
xcode-select --install  # installs clang++
clang++ --version
\`\`\`

**Ubuntu/WSL:**
\`\`\`bash
sudo apt update && sudo apt install g++ build-essential
g++ --version
\`\`\`

**Windows (native):** Install MSYS2 from https://msys2.org, then inside the MSYS2 terminal:
\`\`\`bash
pacman -S mingw-w64-x86_64-gcc
\`\`\`

### 2. VS Code Setup

Install the **C/C++** extension by Microsoft (ms-vscode.cpptools). It provides:
- IntelliSense (autocomplete, hover)
- Debugger integration (via gdb/lldb)
- Code formatting with clang-format

### 3. Hello World

\`main.cpp\`:
\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\`

Compile and run:
\`\`\`bash
g++ -std=c++17 -Wall -Wextra -o hello main.cpp
./hello
# Hello, World!
\`\`\`

### 4. Essential Compile Flags

| Flag | Purpose |
|------|---------|
| \`-std=c++17\` | Enable C++17 features |
| \`-Wall\` | Enable common warnings |
| \`-Wextra\` | Enable additional warnings |
| \`-O2\` | Enable optimizations (release) |
| \`-g\` | Include debug symbols |
| \`-o output\` | Specify output filename |

### 5. The Compilation Pipeline

\`\`\`
Source (.cpp)
     ↓ Preprocessor   #includes resolved, macros expanded
     ↓ Compiler        → assembly (.s)
     ↓ Assembler       → object file (.o)
     ↓ Linker          → executable
\`\`\`

### 6. Using namespace std

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Shorter syntax" << endl;
    return 0;
}
\`\`\`

The \`using namespace std\` directive lets you write \`cout\` instead of \`std::cout\`. Avoid it in header files (it pollutes the namespace of every file that includes the header).

### 7. Namespaces

\`\`\`cpp
namespace myapp {
    void greet() {
        std::cout << "Hello from myapp!" << std::endl;
    }
}

int main() {
    myapp::greet();
}
\`\`\``,
    quiz: [
      {
        q: 'What does the `-std=c++17` flag do?',
        options: [
          'Links against the C++17 standard library',
          'Enables C++17 language features in the compiler',
          'Generates C++17-compatible object files',
          'Sets the optimization level to match C++17 performance goals',
        ],
        correct: 1,
        explanation: '`-std=c++17` tells the compiler to accept C++17 syntax and semantics — without it, newer features cause compile errors.',
      },
      {
        q: 'What does the linker do?',
        options: [
          'Expands #include directives',
          'Converts C++ source to assembly',
          'Combines object files and libraries into a single executable',
          'Optimizes the generated machine code',
        ],
        correct: 2,
        explanation: 'The linker resolves cross-file symbol references and combines .o object files with library code into the final binary.',
      },
      {
        q: 'Why should you avoid `using namespace std` in header files?',
        options: [
          'It increases compile time',
          'It pollutes the namespace of every file that includes the header',
          'std functions are slower without the prefix',
          'Header files cannot include namespaces',
        ],
        correct: 1,
        explanation: 'If a header uses `using namespace std`, every file including it silently imports the entire std namespace, risking name collisions.',
      },
      {
        q: 'What does `-Wall` enable?',
        options: [
          'All possible compiler warnings',
          'A common set of warning flags recommended by GCC',
          'Link-time warnings only',
          'Address sanitizer',
        ],
        correct: 1,
        explanation: 'Despite the name, `-Wall` does not enable all warnings — it enables a widely-recommended subset. `-Wextra` adds more; `-Wpedantic` adds pedantic ones.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Write a C++ program that prints "C++ version: " followed by the value of the __cplusplus macro (which is 201703L for C++17). Use std::cout.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <iostream>

int main() {
    // __cplusplus is a predefined macro set by the compiler
    // It is 201703L for C++17, 202002L for C++20
    std::cout << "C++ version: " << __cplusplus << std::endl;
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 2 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m02',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'Variables, Types, Pointers & References',
    subtitle: 'Static types, raw memory access, and safer C++ references',
    level: 'Basic',
    xp: 160,
    duration: 35,
    module: 2,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Declare variables with C++ fundamental types, use raw pointers for direct memory access, use references as safer aliases, and understand const correctness.',
    keyTerms: [
      { term: 'Reference (&)', definition: 'An alias for another variable — must be initialized and cannot be reseated; safer than a pointer for most use cases.' },
      { term: 'Pointer (*)', definition: 'A variable storing a memory address; can be null, can be reseated, can do arithmetic.' },
      { term: 'const', definition: 'Marks a variable or parameter as read-only — applying const correctly is a C++ best practice.' },
      { term: 'nullptr', definition: 'C++11 null pointer constant — always use instead of NULL or 0 for pointers.' },
      { term: 'auto', definition: 'Type deduction — the compiler infers the type from the initializer.' },
      { term: 'size_t', definition: 'Unsigned integer type for sizes and indices — returned by sizeof() and .size().' },
    ],
    content: `## Variables, Types, Pointers & References

### Fundamental Types

\`\`\`cpp
#include <iostream>

int main() {
    int    i  = 42;
    double d  = 3.14;
    char   c  = 'A';
    bool   b  = true;
    float  f  = 2.71f;   // f suffix = float literal
    long   l  = 1000000L;

    // C++11 auto type deduction
    auto x = 5;          // int
    auto y = 3.14;       // double
    auto z = "hello";    // const char*

    std::cout << i << " " << d << " " << c << std::endl;
    return 0;
}
\`\`\`

### const

\`\`\`cpp
const int MAX = 100;          // compile-time constant
const double PI = 3.14159;

// const parameter — function cannot modify it
void print(const std::string& s) {
    std::cout << s << std::endl;
}
\`\`\`

### Pointers

\`\`\`cpp
int x = 10;
int* p = &x;  // p holds the address of x

std::cout << p  << std::endl; // address: 0x7fff...
std::cout << *p << std::endl; // dereference: 10

*p = 20;           // modify x through pointer
std::cout << x;    // 20

int* null_ptr = nullptr; // null pointer (C++11)
\`\`\`

### References

A reference is an alias — it must be initialized and always refers to the same variable:

\`\`\`cpp
int a = 5;
int& ref = a;  // ref IS a (not a copy)

ref = 10;
std::cout << a; // 10 — a was changed through ref

// References are the preferred way to pass large objects
void increment(int& n) {
    n++;
}

int main() {
    int val = 7;
    increment(val);
    std::cout << val; // 8
}
\`\`\`

### Pointer vs Reference

| | Pointer | Reference |
|-|---------|-----------|
| Can be null | Yes | No |
| Can be reseated | Yes | No |
| Syntax to access | *p or p-> | r directly |
| Use when | Nullable or reseat needed | Simple alias / function param |

### const with Pointers

\`\`\`cpp
int x = 5, y = 10;

const int* p1 = &x;    // pointer to const: can't change *p1
int* const p2 = &x;    // const pointer: can't change p2 itself
const int* const p3 = &x; // both const

p1 = &y;   // ok — pointer can change
// *p1 = 9; // ERROR — can't modify through const pointer
\`\`\`

### sizeof and size_t

\`\`\`cpp
#include <cstddef>

std::cout << sizeof(int)    << " bytes\\n"; // 4
std::cout << sizeof(double) << " bytes\\n"; // 8
std::cout << sizeof(char)   << " bytes\\n"; // 1

size_t n = 42; // use for sizes and indices
\`\`\``,
    quiz: [
      {
        q: 'What is the key difference between a pointer and a reference in C++?',
        options: [
          'References are faster than pointers',
          'A pointer can be null and reseated; a reference must be initialized and always refers to the same object',
          'References can do pointer arithmetic',
          'Pointers are allocated on the heap, references on the stack',
        ],
        correct: 1,
        explanation: 'References are safer aliases — they cannot be null and cannot be reseated. This makes them preferred for function parameters.',
      },
      {
        q: 'What does `nullptr` represent in C++11+?',
        options: [
          'An uninitialized pointer',
          'A pointer to zero in memory',
          'The null pointer constant — replaces NULL and 0 for pointers',
          'A pointer to a null-terminated string',
        ],
        correct: 2,
        explanation: '`nullptr` is type-safe (it is type std::nullptr_t) and avoids ambiguous overload resolution issues that NULL (which is just 0) can cause.',
      },
      {
        q: 'What does `const int* p` mean?',
        options: [
          'The pointer itself cannot be changed',
          'Both the pointer and the value it points to are const',
          'The value at the address cannot be changed through p',
          'p is a constant pointer to a non-const int',
        ],
        correct: 2,
        explanation: '`const int* p` — "pointer to const int" — means you cannot modify the int through p, but you can point p at a different address.',
      },
      {
        q: 'What type does `auto x = 3.14;` infer for x?',
        options: ['float', 'long double', 'double', 'decimal'],
        correct: 2,
        explanation: 'Unadorned floating-point literals default to `double` in C++. Use the `f` suffix (3.14f) for float.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Write a function `swap(int& a, int& b)` that swaps two integers using references (no return value). In main, declare x=3 and y=7, call swap, and print both to verify the swap happened.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <iostream>

void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 3, y = 7;
    std::cout << "Before: x=" << x << " y=" << y << std::endl;
    swap(x, y);
    std::cout << "After:  x=" << x << " y=" << y << std::endl;
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 3 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m03',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'Functions, Overloading & Templates',
    subtitle: 'Reusable code with function overloading and compile-time generics',
    level: 'Masters',
    xp: 170,
    duration: 35,
    module: 3,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Use default arguments and function overloading to write flexible APIs, and write function templates for type-safe generic code.',
    keyTerms: [
      { term: 'Function overloading', definition: 'Multiple functions with the same name but different parameter types or counts — the compiler selects the best match.' },
      { term: 'Default arguments', definition: 'Parameter values used when the caller does not supply them; must be rightmost in the parameter list.' },
      { term: 'Function template', definition: 'A blueprint for a family of functions parameterized by type(s); the compiler instantiates a concrete version for each type used.' },
      { term: 'Template instantiation', definition: 'The compiler generating a concrete function from a template for a specific type.' },
      { term: 'inline', definition: 'Hint to the compiler to replace the function call with the function body — reduces call overhead for small functions.' },
      { term: 'constexpr', definition: 'A function or variable evaluated at compile time when possible — enables compile-time computation.' },
    ],
    content: `## Functions, Overloading & Templates

### Function Overloading

\`\`\`cpp
#include <iostream>
#include <string>

void print(int n) {
    std::cout << "int: " << n << std::endl;
}

void print(double d) {
    std::cout << "double: " << d << std::endl;
}

void print(const std::string& s) {
    std::cout << "string: " << s << std::endl;
}

int main() {
    print(42);          // calls print(int)
    print(3.14);        // calls print(double)
    print("hello");     // calls print(string)
    return 0;
}
\`\`\`

### Default Arguments

\`\`\`cpp
// Default arguments must be rightmost
void greet(const std::string& name, const std::string& greeting = "Hello") {
    std::cout << greeting << ", " << name << "!" << std::endl;
}

int main() {
    greet("Jordan");           // Hello, Jordan!
    greet("Jordan", "Hey");    // Hey, Jordan!
    return 0;
}
\`\`\`

### Function Templates

\`\`\`cpp
template <typename T>
T maximum(T a, T b) {
    return a > b ? a : b;
}

int main() {
    std::cout << maximum(3, 7)       << std::endl; // 7 (int)
    std::cout << maximum(3.14, 2.71) << std::endl; // 3.14 (double)
    std::cout << maximum('a', 'z')   << std::endl; // z (char)
    return 0;
}
\`\`\`

The compiler generates a separate \`maximum<int>\`, \`maximum<double>\`, and \`maximum<char>\` — zero runtime overhead.

### Multiple Template Parameters

\`\`\`cpp
template <typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {
    return a + b;
}

std::cout << add(3, 2.5); // 5.5 (double)
\`\`\`

### constexpr Functions

\`\`\`cpp
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// Evaluated at compile time when argument is a constant
constexpr int f5 = factorial(5); // 120 — computed at compile time
int arr[factorial(4)];           // 24 — array size computed at compile time
\`\`\`

### Template Specialization

\`\`\`cpp
// General template
template <typename T>
std::string describe(T val) {
    return "value: " + std::to_string(val);
}

// Specialization for bool
template <>
std::string describe<bool>(bool val) {
    return val ? "true" : "false";
}

std::cout << describe(42);    // value: 42
std::cout << describe(true);  // true
\`\`\``,
    quiz: [
      {
        q: 'How does the compiler choose between overloaded functions?',
        options: [
          'It always picks the first one defined',
          'It picks the one whose parameters best match the argument types',
          'It generates a union of all overloads',
          'Overloaded functions must have different return types',
        ],
        correct: 1,
        explanation: 'The compiler performs overload resolution — it finds the best match based on parameter types, applying implicit conversions if needed.',
      },
      {
        q: 'What constraint applies to default arguments in a function declaration?',
        options: [
          'They must be constexpr',
          'They must be the rightmost parameters',
          'They cannot be used with templates',
          'There can be at most one default argument per function',
        ],
        correct: 1,
        explanation: 'Default arguments must appear after all non-default parameters — you cannot have a default followed by a required parameter.',
      },
      {
        q: 'What is template instantiation?',
        options: [
          'Creating a class from a template at runtime',
          'The compiler generating a concrete function/class for a specific type used with the template',
          'Linking template definitions from separate files',
          'Calling a template function for the first time',
        ],
        correct: 1,
        explanation: 'When you call `maximum(3, 7)`, the compiler instantiates `maximum<int>` — a concrete function for int. Each distinct type gets its own copy.',
      },
      {
        q: 'What does `constexpr` guarantee about a function?',
        options: [
          'It always runs faster than regular functions',
          'It can be evaluated at compile time when called with constant arguments',
          'It cannot have side effects',
          'It is always inlined',
        ],
        correct: 1,
        explanation: 'A constexpr function can be evaluated at compile time, enabling compile-time constants and array sizes. It can also run at runtime.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Write a function template `clamp<T>(T value, T low, T high)` that returns value constrained to [low, high]. Test it with ints and doubles.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <iostream>

template <typename T>
T clamp(T value, T low, T high) {
    if (value < low)  return low;
    if (value > high) return high;
    return value;
}

int main() {
    std::cout << clamp(5,  0, 10)  << std::endl; // 5
    std::cout << clamp(-3, 0, 10)  << std::endl; // 0
    std::cout << clamp(15, 0, 10)  << std::endl; // 10
    std::cout << clamp(3.14, 0.0, 2.0) << std::endl; // 2.0
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 4 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m04',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'Classes, OOP & Inheritance',
    subtitle: 'Encapsulation, constructors, virtual dispatch, and polymorphism',
    level: 'Masters',
    xp: 175,
    duration: 45,
    module: 4,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Define classes with constructors and destructors, use access control, implement inheritance with virtual functions, and understand the Rule of Five.',
    keyTerms: [
      { term: 'Constructor', definition: 'A special member function called when an object is created — initializes member variables.' },
      { term: 'Destructor (~T)', definition: 'Called when an object goes out of scope or is deleted — releases owned resources.' },
      { term: 'virtual', definition: 'Marks a method for dynamic dispatch — the most-derived override is called at runtime.' },
      { term: 'override', definition: 'C++11 keyword confirming that a virtual method overrides a base-class method — enables the compiler to catch mismatches.' },
      { term: 'Abstract class', definition: 'A class with at least one pure virtual function (= 0) — cannot be instantiated directly.' },
      { term: 'Rule of Five', definition: 'If you define any of: destructor, copy constructor, copy assignment, move constructor, move assignment — you should define all five.' },
    ],
    content: `## Classes, OOP & Inheritance

### Basic Class

\`\`\`cpp
#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner;
    double      balance;

public:
    // Constructor with initializer list
    BankAccount(const std::string& owner, double initial)
        : owner(owner), balance(initial) {}

    // Destructor
    ~BankAccount() {
        std::cout << "Account for " << owner << " closed." << std::endl;
    }

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    bool withdraw(double amount) {
        if (amount > balance) return false;
        balance -= amount;
        return true;
    }

    double getBalance() const { return balance; } // const method
    const std::string& getOwner() const { return owner; }
};

int main() {
    BankAccount acc("Jordan", 1000.0);
    acc.deposit(500.0);
    acc.withdraw(200.0);
    std::cout << acc.getOwner() << ": $" << acc.getBalance() << std::endl;
    return 0;
} // destructor called here
\`\`\`

### Inheritance & Virtual Functions

\`\`\`cpp
class Shape {
public:
    virtual double area() const = 0;    // pure virtual
    virtual std::string name() const = 0;
    virtual ~Shape() = default;         // virtual destructor — always for polymorphic base classes
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {
        return 3.14159 * radius * radius;
    }
    std::string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    std::string name() const override { return "Rectangle"; }
};

// Polymorphic function
void printArea(const Shape& s) {
    std::cout << s.name() << " area: " << s.area() << std::endl;
}

int main() {
    Circle    c(5.0);
    Rectangle r(3.0, 4.0);
    printArea(c); // Circle area: 78.54
    printArea(r); // Rectangle area: 12
    return 0;
}
\`\`\`

### The Rule of Five

\`\`\`cpp
class Buffer {
    int* data;
    size_t size;
public:
    Buffer(size_t n) : data(new int[n]), size(n) {}
    ~Buffer()                             { delete[] data; }

    // Copy constructor
    Buffer(const Buffer& other) : data(new int[other.size]), size(other.size) {
        std::copy(other.data, other.data + size, data);
    }

    // Copy assignment
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);
        }
        return *this;
    }

    // Move constructor (C++11)
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr; other.size = 0;
    }

    // Move assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data; size = other.size;
            other.data = nullptr; other.size = 0;
        }
        return *this;
    }
};
\`\`\`

**Note:** In modern C++, prefer \`std::vector\` over raw arrays to avoid writing the Rule of Five manually.`,
    quiz: [
      {
        q: 'Why should a polymorphic base class have a virtual destructor?',
        options: [
          'For performance — virtual destructors are faster',
          'To allow the correct derived-class destructor to run when deleting through a base pointer',
          'To prevent the class from being instantiated',
          'C++ requires it for all classes',
        ],
        correct: 1,
        explanation: 'Without a virtual destructor, `delete base_ptr` only calls the base destructor — the derived destructor is skipped, leaking resources.',
      },
      {
        q: 'What does `= 0` on a virtual function declaration mean?',
        options: [
          'The function returns 0 by default',
          'The function is disabled and cannot be called',
          'The function is pure virtual — the class is abstract and cannot be instantiated',
          'The function has an empty default implementation',
        ],
        correct: 2,
        explanation: 'A pure virtual function (`virtual f() = 0`) forces subclasses to provide an implementation. The class becomes abstract.',
      },
      {
        q: 'What does the `override` keyword do?',
        options: [
          'Prevents further subclasses from overriding the method',
          'Tells the compiler to verify this method actually overrides a virtual base-class method — a spelling mistake becomes a compile error',
          'Makes the method call faster than a regular virtual function',
          'Allows overriding non-virtual methods',
        ],
        correct: 1,
        explanation: 'Without `override`, a typo in the method signature silently creates a new non-virtual function instead of overriding. `override` catches this at compile time.',
      },
      {
        q: 'What is the Rule of Five?',
        options: [
          'A class should have at most 5 member variables',
          'If you define any of destructor/copy ctor/copy assign/move ctor/move assign, you should define all five',
          'A function should have at most 5 parameters',
          'Inheritance chains should be at most 5 levels deep',
        ],
        correct: 1,
        explanation: 'These five functions all manage resource ownership. If you need to customize one, the default implementations of the others are likely wrong too.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Create an abstract class `Animal` with a pure virtual method `speak() const`. Implement `Dog` (speaks "Woof") and `Cat` (speaks "Meow"). Create a vector of Animal pointers and call speak() on each polymorphically.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <iostream>
#include <vector>
#include <memory>

class Animal {
public:
    virtual std::string speak() const = 0;
    virtual std::string name()  const = 0;
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    std::string speak() const override { return "Woof!"; }
    std::string name()  const override { return "Dog"; }
};

class Cat : public Animal {
public:
    std::string speak() const override { return "Meow!"; }
    std::string name()  const override { return "Cat"; }
};

int main() {
    std::vector<std::unique_ptr<Animal>> animals;
    animals.push_back(std::make_unique<Dog>());
    animals.push_back(std::make_unique<Cat>());
    animals.push_back(std::make_unique<Dog>());

    for (const auto& a : animals) {
        std::cout << a->name() << " says: " << a->speak() << std::endl;
    }
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 5 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m05',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'STL: Vector, Map, String & Algorithms',
    subtitle: 'The Standard Template Library — containers, iterators, and algorithms',
    level: 'Masters',
    xp: 180,
    duration: 40,
    module: 5,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Use std::vector and std::map as primary containers, manipulate std::string, and apply STL algorithms for sorting, searching, and transforming data.',
    keyTerms: [
      { term: 'std::vector<T>', definition: 'Dynamic array — O(1) amortized push_back, O(1) random access, contiguous memory.' },
      { term: 'std::map<K,V>', definition: 'Sorted associative container — O(log n) insert/lookup; keys are always sorted.' },
      { term: 'std::unordered_map<K,V>', definition: 'Hash map — O(1) average insert/lookup; no ordering guarantee.' },
      { term: 'Iterator', definition: 'A generalization of a pointer that allows traversal over a container in a uniform way.' },
      { term: 'std::sort', definition: 'Sorts a range defined by two iterators — O(n log n), introsort in most implementations.' },
      { term: 'Range-based for', definition: 'C++11 syntax `for (auto& x : container)` that iterates over any container with begin()/end().' },
    ],
    content: `## STL: Vector, Map, String & Algorithms

### std::vector

\`\`\`cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5, 9};

    v.push_back(2);               // append
    v.insert(v.begin(), 0);       // prepend
    v.erase(v.begin() + 1);       // remove element at index 1

    std::cout << "Size: " << v.size() << std::endl;
    std::cout << "Front: " << v.front() << std::endl;
    std::cout << "Back: "  << v.back()  << std::endl;

    // Range-based for
    for (const auto& n : v) {
        std::cout << n << " ";
    }
    return 0;
}
\`\`\`

### std::map

\`\`\`cpp
#include <map>
#include <string>

int main() {
    std::map<std::string, int> scores;
    scores["Alice"] = 95;
    scores["Bob"]   = 87;
    scores["Carol"] = 91;

    // Lookup
    if (scores.count("Alice")) {
        std::cout << "Alice: " << scores["Alice"] << std::endl;
    }

    // Iterate (always sorted by key)
    for (const auto& [name, score] : scores) { // C++17 structured bindings
        std::cout << name << ": " << score << std::endl;
    }

    // find returns iterator
    auto it = scores.find("Bob");
    if (it != scores.end()) {
        std::cout << "Found: " << it->second << std::endl;
    }
    return 0;
}
\`\`\`

### std::string

\`\`\`cpp
#include <string>

std::string s = "Hello, World!";

std::cout << s.length() << std::endl;      // 13
std::cout << s.substr(7, 5) << std::endl;  // World
std::cout << s.find("World") << std::endl; // 7

s.replace(7, 5, "C++");
std::cout << s << std::endl; // Hello, C++!

// split workaround (no built-in split)
#include <sstream>
std::istringstream iss("a b c");
std::string token;
while (iss >> token) std::cout << token << "\\n";
\`\`\`

### STL Algorithms

\`\`\`cpp
#include <algorithm>
#include <vector>
#include <numeric>

std::vector<int> v = {5, 2, 8, 1, 9, 3};

// Sort
std::sort(v.begin(), v.end());                        // ascending
std::sort(v.begin(), v.end(), std::greater<int>());   // descending

// Find
auto it = std::find(v.begin(), v.end(), 8);
if (it != v.end()) std::cout << "Found at index " << (it - v.begin()) << std::endl;

// Count
int fives = std::count(v.begin(), v.end(), 5);

// Transform (like map in functional programming)
std::vector<int> doubled(v.size());
std::transform(v.begin(), v.end(), doubled.begin(), [](int x) { return x * 2; });

// Accumulate (fold/reduce)
int sum = std::accumulate(v.begin(), v.end(), 0); // 0 = initial value

// Remove duplicates (sort first)
std::sort(v.begin(), v.end());
auto last = std::unique(v.begin(), v.end());
v.erase(last, v.end());
\`\`\``,
    quiz: [
      {
        q: 'What is the time complexity of std::vector::push_back?',
        options: ['O(n) always', 'O(1) amortized', 'O(log n)', 'O(n log n)'],
        correct: 1,
        explanation: 'push_back is O(1) amortized — occasional resizes are O(n) but the average cost across many operations is O(1).',
      },
      {
        q: 'What is the difference between std::map and std::unordered_map?',
        options: [
          'map stores keys as strings; unordered_map supports any key type',
          'map is O(log n) and keeps keys sorted; unordered_map is O(1) average but unsorted',
          'unordered_map is thread-safe; map is not',
          'map supports duplicate keys; unordered_map does not',
        ],
        correct: 1,
        explanation: 'map uses a balanced BST (red-black tree) — sorted, O(log n). unordered_map uses a hash table — unsorted, O(1) average.',
      },
      {
        q: 'What does std::find return when the element is NOT found?',
        options: ['nullptr', '-1', 'An iterator equal to the end iterator (container.end())', 'An empty optional'],
        correct: 2,
        explanation: 'STL algorithms return `end()` to indicate "not found". Always compare the result to `end()` before dereferencing.',
      },
      {
        q: 'What must you do before using std::unique to remove duplicates?',
        options: [
          'Reserve extra capacity in the vector',
          'Sort the range — std::unique only removes consecutive duplicates',
          'Convert the vector to a set first',
          'Call std::remove_if first',
        ],
        correct: 1,
        explanation: '`std::unique` only collapses consecutive equal elements. Sort first to bring all duplicates adjacent.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Given a vector of strings, use STL algorithms to: sort alphabetically, remove duplicates, then print each unique string. Input: {"banana", "apple", "cherry", "apple", "banana", "date"}.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> fruits = {"banana", "apple", "cherry", "apple", "banana", "date"};

    // Sort alphabetically
    std::sort(fruits.begin(), fruits.end());

    // Remove duplicates (unique + erase idiom)
    auto last = std::unique(fruits.begin(), fruits.end());
    fruits.erase(last, fruits.end());

    // Print
    for (const auto& f : fruits) {
        std::cout << f << std::endl;
    }
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 6 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m06',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'Memory Management & Smart Pointers',
    subtitle: 'RAII, unique_ptr, shared_ptr, and eliminating manual delete',
    level: 'PhD',
    xp: 185,
    duration: 45,
    module: 6,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Understand manual heap allocation and its pitfalls, apply RAII to eliminate leaks, and use unique_ptr and shared_ptr for automatic memory management.',
    keyTerms: [
      { term: 'RAII', definition: 'Resource Acquisition Is Initialization — resources are tied to object lifetime; the destructor releases them automatically.' },
      { term: 'unique_ptr<T>', definition: 'Exclusive ownership — one unique_ptr owns the object; deleted when it goes out of scope. Cannot be copied.' },
      { term: 'shared_ptr<T>', definition: 'Shared ownership — reference-counted; the object is deleted when the last shared_ptr to it is destroyed.' },
      { term: 'weak_ptr<T>', definition: 'A non-owning observer of a shared_ptr — does not affect the reference count; used to break cycles.' },
      { term: 'make_unique', definition: 'Factory function for unique_ptr — exception-safe and avoids calling new directly.' },
      { term: 'Memory leak', definition: 'Heap memory that is allocated but never freed — the program consumes ever-increasing memory.' },
    ],
    content: `## Memory Management & Smart Pointers

### Manual Allocation (the old way — avoid)

\`\`\`cpp
int* p = new int(42);
// ... if an exception is thrown here, delete never runs
delete p;   // manual cleanup — easy to forget or double-delete
\`\`\`

Problems with raw new/delete:
- Forgetting \`delete\` → memory leak
- \`delete\`-ing twice → undefined behaviour
- Exceptions skipping \`delete\` → leak

### RAII — The Solution

RAII ties resource lifetime to object lifetime:

\`\`\`cpp
class FileHandle {
    FILE* f;
public:
    FileHandle(const char* path) : f(fopen(path, "r")) {}
    ~FileHandle() { if (f) fclose(f); } // guaranteed cleanup
    FILE* get() { return f; }
};
\`\`\`

When \`FileHandle\` goes out of scope (normally or via exception), the destructor closes the file.

### unique_ptr — Single Ownership

\`\`\`cpp
#include <memory>

auto p = std::make_unique<int>(42); // prefer make_unique over new
std::cout << *p << std::endl;       // 42
// p is automatically deleted when it goes out of scope

// Transfer ownership with move
auto p2 = std::move(p);     // p is now nullptr
// *p would crash — p no longer owns the int

// In containers
std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(5.0));
shapes.push_back(std::make_unique<Rectangle>(3.0, 4.0));
\`\`\`

### shared_ptr — Shared Ownership

\`\`\`cpp
auto a = std::make_shared<int>(42);
auto b = a; // both own the int; reference count = 2

std::cout << a.use_count() << std::endl; // 2

{
    auto c = a;               // count = 3
    std::cout << *c << std::endl;
}                             // c destroyed, count = 2

// Object deleted when a and b both go out of scope (count → 0)
\`\`\`

### weak_ptr — Breaking Cycles

\`\`\`cpp
struct Node {
    int value;
    std::shared_ptr<Node> next;
    std::weak_ptr<Node>   prev; // weak — does not own
};
\`\`\`

If both \`next\` and \`prev\` were \`shared_ptr\`, two nodes pointing at each other would never be freed (circular reference). \`weak_ptr\` breaks the cycle.

### Choosing the Right Pointer

| Type | Use when |
|------|----------|
| \`unique_ptr\` | Single owner — default choice |
| \`shared_ptr\` | Multiple owners need the same object |
| \`weak_ptr\` | Observing a shared_ptr without ownership (breaks cycles) |
| Raw pointer \`T*\` | Non-owning view only; never store in a container |

### Custom Deleters

\`\`\`cpp
auto file = std::unique_ptr<FILE, decltype(&fclose)>(
    fopen("data.txt", "r"), fclose
);
// file is closed automatically even if an exception is thrown
\`\`\``,
    quiz: [
      {
        q: 'What does RAII stand for and what problem does it solve?',
        options: [
          'Resource Allocation Is Idempotent — it prevents double-free',
          'Resource Acquisition Is Initialization — ties resource lifetime to object lifetime, preventing leaks',
          'Random Access Iterator Interface — enables STL algorithms',
          'Run-time Allocation Inspection Interface — a memory profiler',
        ],
        correct: 1,
        explanation: 'RAII ensures resources (memory, files, locks) are released when the managing object is destroyed — the destructor always runs, even on exception.',
      },
      {
        q: 'Why can\'t you copy a unique_ptr?',
        options: [
          'unique_ptr is a final class',
          'It would violate single ownership — two unique_ptrs would think they own the same object and both delete it',
          'The copy constructor is private by accident',
          'Copying would be too slow',
        ],
        correct: 1,
        explanation: 'Allowing copy would create two unique_ptrs claiming ownership, causing a double-free when both go out of scope.',
      },
      {
        q: 'When is the object managed by a shared_ptr deleted?',
        options: [
          'When the first shared_ptr to it is destroyed',
          'When all shared_ptrs to it are destroyed (reference count reaches zero)',
          'On the next garbage collection',
          'When you explicitly call reset()',
        ],
        correct: 1,
        explanation: 'shared_ptr uses reference counting — the managed object lives as long as at least one shared_ptr owns it.',
      },
      {
        q: 'What is the primary use of weak_ptr?',
        options: [
          'Accessing a shared_ptr without incrementing the reference count, breaking circular references',
          'A faster alternative to unique_ptr',
          'Storing pointers to stack-allocated objects',
          'Sharing ownership across threads',
        ],
        correct: 0,
        explanation: 'weak_ptr observes a shared_ptr without participating in ownership — critical for breaking reference cycles that would otherwise leak memory.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Create a `Resource` class with a constructor that prints "acquired" and a destructor that prints "released". Allocate one with make_unique and one with make_shared. Show that they are automatically released when the pointers go out of scope.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <iostream>
#include <memory>

class Resource {
    std::string name;
public:
    Resource(const std::string& n) : name(n) {
        std::cout << name << " acquired" << std::endl;
    }
    ~Resource() {
        std::cout << name << " released" << std::endl;
    }
};

int main() {
    std::cout << "--- unique_ptr ---" << std::endl;
    {
        auto r1 = std::make_unique<Resource>("R1");
        // r1 goes out of scope here → destructor called
    }

    std::cout << "--- shared_ptr ---" << std::endl;
    {
        auto r2 = std::make_shared<Resource>("R2");
        std::cout << "ref count: " << r2.use_count() << std::endl; // 1
        {
            auto r3 = r2; // shared ownership
            std::cout << "ref count: " << r2.use_count() << std::endl; // 2
        } // r3 gone, count = 1
        std::cout << "ref count: " << r2.use_count() << std::endl; // 1
    } // r2 gone, count = 0 → destructor called

    std::cout << "Done" << std::endl;
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 7 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m07',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'File I/O & Exception Handling',
    subtitle: 'Read and write files, throw and catch typed exceptions',
    level: 'PhD',
    xp: 195,
    duration: 40,
    module: 7,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Read and write files using fstream, throw and catch exceptions correctly, and write exception-safe code using RAII.',
    keyTerms: [
      { term: 'std::ifstream', definition: 'Input file stream — opens a file for reading.' },
      { term: 'std::ofstream', definition: 'Output file stream — opens a file for writing, truncating by default.' },
      { term: 'std::fstream', definition: 'Combined file stream — supports both reading and writing.' },
      { term: 'throw', definition: 'Raises an exception — transfers control to the nearest matching catch block.' },
      { term: 'catch (...)', definition: 'Catch-all handler — catches any exception type; use as a last resort.' },
      { term: 'std::runtime_error', definition: 'Standard exception for errors that can only be detected at runtime.' },
    ],
    content: `## File I/O & Exception Handling

### Reading a File Line by Line

\`\`\`cpp
#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::ifstream file("data.txt");

    if (!file.is_open()) {
        std::cerr << "Error: could not open data.txt" << std::endl;
        return 1;
    }

    std::string line;
    while (std::getline(file, line)) {
        std::cout << line << std::endl;
    }

    file.close(); // optional — destructor closes it automatically
    return 0;
}
\`\`\`

### Writing to a File

\`\`\`cpp
std::ofstream out("output.txt");
if (!out) {
    std::cerr << "Cannot open output.txt" << std::endl;
    return 1;
}

out << "Line 1\\n";
out << "Line 2\\n";
// file closed by destructor
\`\`\`

### Appending

\`\`\`cpp
std::ofstream log("app.log", std::ios::app);
log << "[INFO] Server started\\n";
\`\`\`

### Exception Handling

\`\`\`cpp
#include <stdexcept>

double safeDivide(double a, double b) {
    if (b == 0.0) {
        throw std::invalid_argument("Division by zero");
    }
    return a / b;
}

int main() {
    try {
        double result = safeDivide(10.0, 0.0);
        std::cout << result << std::endl;
    }
    catch (const std::invalid_argument& e) {
        std::cerr << "Caught: " << e.what() << std::endl;
    }
    catch (const std::exception& e) {
        std::cerr << "Std exception: " << e.what() << std::endl;
    }
    catch (...) {
        std::cerr << "Unknown exception" << std::endl;
    }
    return 0;
}
\`\`\`

### Exception Hierarchy

\`\`\`
std::exception
  ├── std::logic_error
  │     ├── std::invalid_argument
  │     └── std::out_of_range
  └── std::runtime_error
        ├── std::range_error
        └── std::overflow_error
\`\`\`

Catch by const reference to avoid slicing and unnecessary copies.

### Custom Exceptions

\`\`\`cpp
class FileError : public std::runtime_error {
    std::string path;
public:
    FileError(const std::string& path, const std::string& msg)
        : std::runtime_error(msg), path(path) {}

    const std::string& getPath() const { return path; }
};

void readConfig(const std::string& path) {
    std::ifstream f(path);
    if (!f.is_open()) {
        throw FileError(path, "Cannot open config file: " + path);
    }
    // ...
}
\`\`\`

### RAII + Exceptions

Because destructors always run — even during stack unwinding from an exception — RAII-managed resources are always released:

\`\`\`cpp
void process() {
    std::ifstream file("data.txt"); // RAII — file closed no matter what
    auto lock = std::lock_guard<std::mutex>(mtx); // RAII — unlocked no matter what
    // if an exception is thrown here, file and lock are still cleaned up
}
\`\`\``,
    quiz: [
      {
        q: 'Why should you catch exceptions by `const reference` (`const std::exception& e`)?',
        options: [
          'Const references are faster than copies',
          'To avoid object slicing and prevent an unnecessary copy of the exception object',
          'You cannot catch non-const exceptions',
          'The `what()` method only works on const references',
        ],
        correct: 1,
        explanation: 'Catching by value would slice a derived exception type to the base type, losing information. const reference avoids copying and slicing.',
      },
      {
        q: 'What does `std::ios::app` do when opening a file with ofstream?',
        options: [
          'Appends new data to the end of the file instead of truncating',
          'Creates the file if it does not exist',
          'Enables both reading and appending',
          'Flushes the buffer after every write',
        ],
        correct: 0,
        explanation: 'Without `ios::app`, ofstream truncates (empties) the file on open. `ios::app` positions the write position at the end.',
      },
      {
        q: 'What happens to RAII-managed resources when an exception is thrown?',
        options: [
          'They are leaked — exceptions bypass destructors',
          'They are released — destructors run during stack unwinding',
          'They are held until the exception is caught and then released',
          'It depends on whether the exception is caught or not',
        ],
        correct: 1,
        explanation: 'Stack unwinding runs destructors for all local objects as the stack is popped, so RAII resources are always properly cleaned up.',
      },
      {
        q: 'What does `catch (...)` catch?',
        options: [
          'Only std::exception subclasses',
          'Only integer exception codes',
          'Any exception of any type, including non-std exceptions',
          'Only exceptions thrown within the same translation unit',
        ],
        correct: 2,
        explanation: 'The ellipsis (`...`) is a catch-all — it matches any exception. Use it as a last resort and usually rethrow with `throw;` after logging.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'Write a function `writeNumbers(filename, n)` that writes integers 1 to n to a file (one per line). Then write `readAndSum(filename)` that reads the file and returns the sum. Wrap everything in try/catch for file errors.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>

void writeNumbers(const std::string& filename, int n) {
    std::ofstream out(filename);
    if (!out) {
        throw std::runtime_error("Cannot open " + filename + " for writing");
    }
    for (int i = 1; i <= n; ++i) {
        out << i << "\\n";
    }
}

long long readAndSum(const std::string& filename) {
    std::ifstream in(filename);
    if (!in) {
        throw std::runtime_error("Cannot open " + filename + " for reading");
    }
    long long sum = 0;
    int n;
    while (in >> n) {
        sum += n;
    }
    return sum;
}

int main() {
    try {
        writeNumbers("numbers.txt", 10);
        long long total = readAndSum("numbers.txt");
        std::cout << "Sum 1..10 = " << total << std::endl; // 55
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}
`,
        },
      ],
    },
  },

  // ── Module 8 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-cpp-m08',
    track: 'crash',
    crashId: 'cc-cpp',
    crashTitle: 'C++',
    certArea: 'C++ Crash Course',
    title: 'Multi-File Project with Headers',
    subtitle: 'Organise a real C++ project across .h and .cpp files',
    level: 'PhD',
    xp: 200,
    duration: 60,
    module: 8,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Split a C++ program across header and implementation files, use include guards, compile multiple translation units, and understand linking.',
    keyTerms: [
      { term: 'Header file (.h)', definition: 'Contains declarations (class definitions, function prototypes, constants) — included by other files.' },
      { term: 'Implementation file (.cpp)', definition: 'Contains the definitions (function bodies) — compiled into a separate object file.' },
      { term: 'Include guard', definition: '#ifndef/#define/#endif or #pragma once — prevents a header from being included twice in one translation unit.' },
      { term: 'Translation unit', definition: 'A single .cpp file plus all the headers it includes — the unit compiled by the compiler in one pass.' },
      { term: 'Linker error', definition: 'An error at link time — usually means a function is declared but never defined, or defined twice.' },
      { term: '#pragma once', definition: 'Non-standard but universally supported header guard — simpler than #ifndef/#endif.' },
    ],
    content: `## Multi-File Project with Headers

### Project Layout

\`\`\`
calculator/
  mathlib.h      ← declarations
  mathlib.cpp    ← definitions
  main.cpp       ← entry point
\`\`\`

### mathlib.h

\`\`\`cpp
#pragma once  // include guard — prevents double inclusion

#include <stdexcept>

namespace mathlib {

class Calculator {
public:
    double add(double a, double b) const;
    double subtract(double a, double b) const;
    double multiply(double a, double b) const;
    double divide(double a, double b) const;   // throws on zero
    double power(double base, int exp) const;
};

// Inline function — definition stays in header
inline double square(double x) { return x * x; }

} // namespace mathlib
\`\`\`

### mathlib.cpp

\`\`\`cpp
#include "mathlib.h"

namespace mathlib {

double Calculator::add(double a, double b) const {
    return a + b;
}

double Calculator::subtract(double a, double b) const {
    return a - b;
}

double Calculator::multiply(double a, double b) const {
    return a * b;
}

double Calculator::divide(double a, double b) const {
    if (b == 0.0) {
        throw std::invalid_argument("Cannot divide by zero");
    }
    return a / b;
}

double Calculator::power(double base, int exp) const {
    double result = 1.0;
    bool negative = exp < 0;
    int  n = negative ? -exp : exp;
    for (int i = 0; i < n; ++i) result *= base;
    return negative ? 1.0 / result : result;
}

} // namespace mathlib
\`\`\`

### main.cpp

\`\`\`cpp
#include <iostream>
#include "mathlib.h"

int main() {
    mathlib::Calculator calc;

    std::cout << calc.add(3, 4)        << std::endl; // 7
    std::cout << calc.multiply(5, 6)   << std::endl; // 30
    std::cout << calc.power(2, 10)     << std::endl; // 1024
    std::cout << mathlib::square(7)    << std::endl; // 49

    try {
        calc.divide(1, 0);
    } catch (const std::exception& e) {
        std::cerr << "Caught: " << e.what() << std::endl;
    }

    return 0;
}
\`\`\`

### Compiling Multiple Files

\`\`\`bash
# Compile each .cpp to an object file
g++ -std=c++17 -Wall -c mathlib.cpp -o mathlib.o
g++ -std=c++17 -Wall -c main.cpp    -o main.o

# Link object files into an executable
g++ mathlib.o main.o -o calculator

./calculator
\`\`\`

Or in one step:
\`\`\`bash
g++ -std=c++17 -Wall mathlib.cpp main.cpp -o calculator
\`\`\`

### Why Separate Compilation?

- **Incremental builds** — only recompile changed files
- **Information hiding** — users see the header (interface), not the implementation
- **Parallel compilation** — build systems compile independent .cpp files simultaneously

### Common Pitfalls

1. **Defining a non-inline function in a header** — if two .cpp files include it, the linker sees two definitions and errors.
2. **Circular includes** — A.h includes B.h includes A.h → use forward declarations to break cycles.
3. **Missing #pragma once** — header included twice → redefinition errors.

### Forward Declarations

\`\`\`cpp
// In A.h — instead of #include "B.h"
class B;  // forward declaration — enough if you only use B* or B& in A.h

class A {
    B* ptr; // ok with forward declaration
};
\`\`\``,
    quiz: [
      {
        q: 'What is the purpose of `#pragma once` in a header file?',
        options: [
          'Ensures the header is compiled before other files',
          'Prevents the header from being included more than once per translation unit, avoiding redefinition errors',
          'Marks the header as part of the public API',
          'Enables C++17 features in that file',
        ],
        correct: 1,
        explanation: 'Without a guard, if two files include the same header, the compiler sees the declarations twice and errors on the redefinitions.',
      },
      {
        q: 'What is a translation unit?',
        options: [
          'A single class definition',
          'A .h file',
          'A single .cpp file plus all the headers it includes — compiled in one compiler pass',
          'All .cpp files in the same directory',
        ],
        correct: 2,
        explanation: 'The preprocessor expands all #includes into a single large source that the compiler processes as one translation unit.',
      },
      {
        q: 'Why should non-inline function definitions NOT go in header files?',
        options: [
          'Headers are compiled differently',
          'If multiple .cpp files include the header, each defines the function — the linker sees multiple definitions and errors',
          'Header files do not support function bodies',
          'Functions in headers are not optimized',
        ],
        correct: 1,
        explanation: 'The One Definition Rule (ODR) requires each function to have exactly one definition at link time. Multiple .cpp files including the same definition violates ODR.',
      },
      {
        q: 'What is a linker error (vs a compiler error)?',
        options: [
          'An error in the preprocessor phase',
          'An error from a missing semicolon',
          'An error at link time — usually a missing function definition or duplicate definition',
          'An error from incompatible types',
        ],
        correct: 2,
        explanation: 'The compiler checks syntax and types within a translation unit. The linker resolves cross-unit references — it errors if a symbol is never defined or defined multiple times.',
      },
    ],
    ide: {
      language: 'cpp',
      task: 'In a single file (simulating a multi-file project), declare a `StringUtils` namespace with functions `toUpper(string)`, `toLower(string)`, and `isPalindrome(string)`. Implement all three and test them in main.',
      files: [
        {
          name: 'main.cpp',
          language: 'cpp',
          code: `#include <algorithm>
#include <cctype>
#include <iostream>
#include <string>

namespace StringUtils {

std::string toUpper(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c) { return std::toupper(c); });
    return s;
}

std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return s;
}

bool isPalindrome(const std::string& s) {
    std::string clean;
    for (char c : s) {
        if (std::isalnum(c)) clean += std::tolower(c);
    }
    return clean == std::string(clean.rbegin(), clean.rend());
}

} // namespace StringUtils

int main() {
    std::cout << StringUtils::toUpper("hello world") << std::endl; // HELLO WORLD
    std::cout << StringUtils::toLower("RUST IS FAST") << std::endl; // rust is fast
    std::cout << std::boolalpha;
    std::cout << StringUtils::isPalindrome("racecar")       << std::endl; // true
    std::cout << StringUtils::isPalindrome("A man a plan a canal Panama") << std::endl; // true
    std::cout << StringUtils::isPalindrome("hello")         << std::endl; // false
    return 0;
}
`,
        },
      ],
    },
  },
]
