import type { Course } from '../courses'

const CC_JAVA_OBJ = 'Master the JVM ecosystem — write production-quality Java, understand OOP deeply, and pick up Kotlin\'s concise syntax for modern Android and backend development.'

export const crashJavaCourses: Course[] = [
  {
    id: 'cc-java-m01', track: 'crash', title: 'JVM, IntelliJ Setup & Hello World',
    subtitle: 'Install the JDK, configure IntelliJ IDEA or VS Code, understand what the JVM actually does, and write your first compiled Java program.',
    moduleObjective: 'Install JDK 21, configure IntelliJ IDEA, understand the compile-run cycle, and write a working Hello World that exercises println, static methods, and command-line args.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'Basic',
    xp: 155, duration: 12, module: 1, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'JDK', definition: 'Java Development Kit — the full toolchain: compiler (javac), runtime (JRE), and standard library. Download JDK 21 LTS from adoptium.net.' },
      { term: 'JVM', definition: 'Java Virtual Machine — the runtime that executes bytecode. Your .java source compiles to .class bytecode; JVM runs that bytecode on any OS.' },
      { term: 'Bytecode', definition: 'The intermediate compiled format (.class files) that the JVM interprets or JIT-compiles to native machine code at runtime.' },
      { term: 'main method', definition: 'public static void main(String[] args) — the entry point of every standalone Java program. JVM calls this first.' },
      { term: 'Package', definition: 'A namespace grouping related classes. Declared at the top: package com.example.app. Mirrors the directory structure on disk.' },
      { term: 'System.out.println', definition: 'The standard way to print to console. System is a class, out is a PrintStream field, println is a method.' },
    ],
    content: `## JVM, IntelliJ Setup & Hello World

### What Is the JVM and Why Does It Matter?

Java's core promise is **write once, run anywhere**. You write Java source code (.java), the compiler (javac) turns it into bytecode (.class), and the JVM runs that bytecode on any machine — Windows, macOS, Linux — without recompiling. The JVM also handles memory management through garbage collection, so you never call free() like in C.

The JVM ecosystem is massive. Java runs Android apps, the bulk of enterprise backends, distributed systems at Google and LinkedIn, and scientific computing pipelines. Kotlin — which we cover in Module 7 — also compiles to JVM bytecode, making everything you learn here directly transferable.

---

### Installing JDK 21 (LTS)

JDK 21 is the current long-term support release. Always use an LTS version for serious projects.

**macOS:**
\`\`\`bash
brew install --cask temurin@21
java -version   # should print: openjdk 21.x.x
\`\`\`

**Windows:** Download the .msi installer from https://adoptium.net — select JDK 21, Windows, x64. Run it. Open a new terminal and verify:
\`\`\`bash
java -version
javac -version
\`\`\`

**Linux (Ubuntu/Debian):**
\`\`\`bash
sudo apt update
sudo apt install temurin-21-jdk
java -version
\`\`\`

---

### IntelliJ IDEA Setup

IntelliJ is the professional IDE for Java. The Community Edition is free and has everything you need.

1. Download IntelliJ IDEA Community from jetbrains.com/idea
2. Open it → New Project → Java → select JDK 21
3. Name the project: JavaCrashCourse
4. IntelliJ creates the project structure: src/ for source files, out/ for compiled bytecode

**Alternatively, VS Code** works well with the "Extension Pack for Java" (Microsoft). Install it and point it to your JDK 21 installation. For this course, either IDE is fine.

---

### The Compile–Run Cycle

\`\`\`
HelloWorld.java  →  javac HelloWorld.java  →  HelloWorld.class  →  java HelloWorld
   source              compiler                 bytecode              JVM runs it
\`\`\`

In IntelliJ, clicking the green Run button does both steps automatically. Understanding what happens under the hood matters when debugging classpath errors.

---

### Anatomy of a Java Program

\`\`\`java
package com.jst.crash;   // optional: the package this class belongs to

public class HelloWorld {  // class name MUST match filename: HelloWorld.java

    public static void main(String[] args) {  // entry point
        System.out.println("Hello, World!");

        // args contains command-line arguments: java HelloWorld Alice
        if (args.length > 0) {
            System.out.println("Hello, " + args[0] + "!");
        }
    }
}
\`\`\`

**Key rules:**
- One public class per file
- Class name must exactly match the filename (case-sensitive)
- main must be \`public static void\` with \`String[] args\`
- Statements end with semicolons

---

### Your First Real Program: A Temperature Converter

\`\`\`java
public class TempConverter {

    // static method: belongs to the class, not an instance
    public static double celsiusToFahrenheit(double celsius) {
        return (celsius * 9.0 / 5.0) + 32;
    }

    public static double fahrenheitToCelsius(double fahrenheit) {
        return (fahrenheit - 32) * 5.0 / 9.0;
    }

    public static void main(String[] args) {
        double boiling = 100.0;
        double bodyTemp = 98.6;

        System.out.printf("%.1f°C = %.1f°F%n",
            boiling, celsiusToFahrenheit(boiling));

        System.out.printf("%.1f°F = %.1f°C%n",
            bodyTemp, fahrenheitToCelsius(bodyTemp));
    }
}
\`\`\`

\`System.out.printf\` uses format strings: \`%.1f\` means a floating-point number with 1 decimal place. \`%n\` is a platform-independent newline (better than \`\\n\` in printf).

---

### Static vs. Instance Members

Everything in the main method above is \`static\` — it belongs to the class itself, not to any object. You call static methods with: \`ClassName.methodName()\` or just \`methodName()\` from within the same class.

In Object-Oriented Java (Modules 3–5), you'll create **instances** of classes — objects that hold their own state. Static is the entry point; instances are the architecture.

---

### String Basics

\`\`\`java
String name = "Jordan";
int len = name.length();               // 6
String upper = name.toUpperCase();     // "JORDAN"
String sub = name.substring(0, 3);     // "Jor"
boolean starts = name.startsWith("J"); // true

// String concatenation
String greeting = "Hello, " + name + "!";

// String formatting (preferred over concatenation for complex strings)
String msg = String.format("Name: %s, Length: %d", name, len);
System.out.println(msg);
\`\`\`

Strings in Java are **immutable** — every operation creates a new String object. For heavy string building, use StringBuilder.`,
    quiz: [
      { q: 'What does the JVM compile Java source code (.java) into before executing it?', options: ['Native machine code', 'Bytecode (.class files)', 'Assembly language', 'JavaScript'], correct: 1, explanation: 'javac compiles .java source into .class bytecode. The JVM then interprets or JIT-compiles that bytecode to native machine code at runtime — enabling "write once, run anywhere."' },
      { q: 'What is the correct signature of the Java entry point method?', options: ['public void main()', 'static main(String args)', 'public static void main(String[] args)', 'void start(String[] args)'], correct: 2, explanation: 'The JVM looks specifically for public static void main(String[] args). Every word matters: public (accessible), static (no instance needed), void (no return), String[] args (command-line arguments).' },
      { q: 'Why must the filename match the public class name in Java?', options: ['It is just a convention', 'The JVM uses the filename to locate and load the class', 'The compiler cannot run otherwise', 'Both B and C'], correct: 3, explanation: 'The Java compiler and classloader use the filename to locate classes. If HelloWorld.java contains public class HelloWorld, the classloader knows where to find it. Mismatch causes a compile error.' },
      { q: 'What does System.out.printf("%.2f", 3.14159) print?', options: ['3.14', '3.14159', '3.1416', '%.2f'], correct: 0, explanation: '%.2f formats a floating-point number with exactly 2 decimal places. 3.14159 rounded to 2 decimal places is 3.14.' },
    ],
    ide: {
      language: 'java',
      task: 'Write a Java class called Greeter with: (1) a static method greet(String name) that returns "Hello, {name}! Welcome to Java." (2) a static method shout(String msg) that returns the message fully uppercased with "!!" appended. (3) a main method that calls both and prints the results.',
      starterCode: `public class Greeter {

    // TODO: static method greet(String name) -> "Hello, {name}! Welcome to Java."
    public static String greet(String name) {
        return "";
    }

    // TODO: static method shout(String msg) -> msg.toUpperCase() + "!!"
    public static String shout(String msg) {
        return "";
    }

    public static void main(String[] args) {
        System.out.println(greet("Jordan"));
        System.out.println(shout("hello world"));
    }
}`,
      solution: `public class Greeter {

    public static String greet(String name) {
        return "Hello, " + name + "! Welcome to Java.";
    }

    public static String shout(String msg) {
        return msg.toUpperCase() + "!!";
    }

    public static void main(String[] args) {
        System.out.println(greet("Jordan"));
        System.out.println(shout("hello world"));
    }
}`,
      hints: [
        'String concatenation in Java: use the + operator. "Hello, " + name + "!"',
        'toUpperCase() is a method on String: msg.toUpperCase()',
        'Append "!!" with: msg.toUpperCase() + "!!"',
      ],
    },
  },
  {
    id: 'cc-java-m02', track: 'crash', title: 'Types, Variables, Operators & Control Flow',
    subtitle: 'Master Java\'s primitive types, reference types, all operators, and every control flow construct from if/else to enhanced for loops.',
    moduleObjective: 'Declare and use all 8 primitive types, understand autoboxing, use all comparison/logical operators correctly, and implement if/switch/for/while/do-while without reference.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'Basic',
    xp: 160, duration: 14, module: 2, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'Primitive Types', definition: 'Java\'s 8 built-in types: byte, short, int, long, float, double, boolean, char. Stored on the stack by value, not as objects.' },
      { term: 'Autoboxing', definition: 'Java\'s automatic conversion between primitive types (int) and their wrapper class equivalents (Integer). Enables primitives in collections.' },
      { term: 'Type Casting', definition: 'Explicitly converting between numeric types. Widening (int → long) is automatic. Narrowing (double → int) requires explicit cast and may lose data.' },
      { term: 'Enhanced for loop', definition: 'The for-each loop: for (int x : array). Iterates every element without managing an index. Use when you don\'t need the index.' },
      { term: 'Switch Expression', definition: 'Java 14+ feature: switch (day) { case MONDAY -> "Work"; default -> "Other"; }. Returns a value, no fall-through.' },
      { term: 'Ternary Operator', definition: 'Compact if/else: condition ? valueIfTrue : valueIfFalse. Good for simple assignments, avoid nesting.' },
    ],
    content: `## Types, Variables, Operators & Control Flow

### Java's Type System: Primitives vs. References

Java has two categories of types:

**Primitive types** — stored by value on the stack:
\`\`\`java
byte   b = 127;           // 8-bit integer:  -128 to 127
short  s = 32767;         // 16-bit integer: -32,768 to 32,767
int    i = 2_147_483_647; // 32-bit integer: ±2.1 billion  (default integer type)
long   l = 9_223_372_036_854_775_807L; // 64-bit: note the L suffix
float  f = 3.14f;         // 32-bit float: note the f suffix
double d = 3.141592653589793; // 64-bit float (default floating-point type)
boolean flag = true;      // true or false only
char   c = 'A';           // 16-bit Unicode character (note single quotes)
\`\`\`

Underscores in numeric literals (2_147_483_647) are legal and improve readability — they don't affect the value.

**Reference types** — objects stored on the heap; variables hold a reference (pointer):
\`\`\`java
String  name = "Jordan";       // most common reference type
int[]   scores = {95, 87, 91}; // array of primitives
Integer boxed = 42;            // Integer is the wrapper class for int
\`\`\`

---

### Type Casting

**Widening** (safe, automatic — smaller type into larger type):
\`\`\`java
int i = 100;
long l = i;      // automatic widening
double d = i;    // automatic widening
\`\`\`

**Narrowing** (potentially lossy — requires explicit cast):
\`\`\`java
double pi = 3.14159;
int truncated = (int) pi;  // → 3 (decimal portion cut off, not rounded)

long big = 10_000_000_000L;
int overflow = (int) big;  // → unpredictable — value may overflow
\`\`\`

Always check the range before narrowing. Use \`Math.round()\` if you need rounding instead of truncation.

---

### Operators

**Arithmetic:**
\`\`\`java
int a = 17, b = 5;
System.out.println(a + b);   // 22
System.out.println(a - b);   // 12
System.out.println(a * b);   // 85
System.out.println(a / b);   // 3  (integer division — decimal dropped)
System.out.println(a % b);   // 2  (modulus: remainder of 17/5)

double x = 17.0, y = 5.0;
System.out.println(x / y);   // 3.4 (floating-point division)
\`\`\`

**Comparison and Logical:**
\`\`\`java
boolean t = (5 > 3);          // true
boolean f = (5 == 3);         // false
boolean ne = (5 != 3);        // true
boolean and = (true && false); // false (short-circuit: stops at first false)
boolean or  = (false || true); // true  (short-circuit: stops at first true)
boolean not = !true;           // false
\`\`\`

**Increment/Decrement:**
\`\`\`java
int n = 5;
n++;    // n = 6 (post-increment: use value, then increment)
++n;    // n = 7 (pre-increment: increment, then use value)
n--;    // n = 6
int result = n++;  // result = 6, then n becomes 7
int result2 = ++n; // n becomes 8, then result2 = 8
\`\`\`

---

### Control Flow

**if / else if / else:**
\`\`\`java
int score = 87;
String grade;

if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}
System.out.println("Grade: " + grade);  // "Grade: B"
\`\`\`

**Ternary (inline if/else):**
\`\`\`java
String status = score >= 60 ? "Pass" : "Fail";
\`\`\`

**Switch Expression (Java 14+):**
\`\`\`java
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    default -> "Weekend";
};
System.out.println(dayName);  // "Wednesday"
\`\`\`

The arrow syntax (\`->\`) eliminates fall-through. Use it over the old \`case x: break;\` style in new code.

---

### Loops

**for loop (index-based):**
\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println("Iteration: " + i);
}
\`\`\`

**Enhanced for loop (for-each):**
\`\`\`java
int[] scores = {92, 85, 78, 96, 88};
int total = 0;
for (int score : scores) {
    total += score;
}
double average = (double) total / scores.length;
System.out.printf("Average: %.1f%n", average);  // Average: 87.8
\`\`\`

**while loop:**
\`\`\`java
int n = 1;
while (n <= 10) {
    System.out.print(n + " ");
    n++;
}
// Output: 1 2 3 4 5 6 7 8 9 10
\`\`\`

**do-while (executes at least once):**
\`\`\`java
int attempts = 0;
do {
    System.out.println("Attempt: " + (++attempts));
} while (attempts < 3);
// Always runs at least once, even if condition starts false
\`\`\`

**break and continue:**
\`\`\`java
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;  // skip 3
    if (i == 7) break;     // stop at 7
    System.out.print(i + " ");
}
// Output: 0 1 2 4 5 6
\`\`\`

---

### Autoboxing and Wrapper Classes

Java's collections can only hold objects, not primitives. Autoboxing handles the conversion automatically:

\`\`\`java
Integer boxedInt = 42;        // autoboxing: int → Integer
int primitive = boxedInt;     // unboxing: Integer → int

// Common operations on wrapper classes:
int max = Integer.MAX_VALUE;          // 2147483647
int parsed = Integer.parseInt("123"); // parse String to int
String asString = Integer.toString(42); // int to String
\`\`\`

Be careful with \`==\` on Integer objects — it compares references, not values. Always use \`.equals()\` for object comparison:
\`\`\`java
Integer a = 200, b = 200;
System.out.println(a == b);       // false (different objects above cache range)
System.out.println(a.equals(b));  // true  (always use this for object equality)
\`\`\``,
    quiz: [
      { q: 'What is the result of 17 / 5 in Java when both operands are ints?', options: ['3.4', '3', '4', '2'], correct: 1, explanation: 'Integer division in Java truncates the decimal. 17 / 5 = 3, remainder 2. To get 3.4, at least one operand must be a double: 17.0 / 5 or (double) 17 / 5.' },
      { q: 'Which loop is guaranteed to execute its body at least once?', options: ['for', 'while', 'do-while', 'enhanced for'], correct: 2, explanation: 'The do-while loop evaluates its condition AFTER executing the body. Even if the condition is false initially, the body runs once. Use it when you need at least one execution (e.g., prompt-until-valid patterns).' },
      { q: 'Why should you use .equals() instead of == to compare String or Integer objects?', options: ['== is slower', '== compares references (memory addresses), not values', '.equals() is required by the compiler', '== only works on primitives in some JVMs'], correct: 1, explanation: '== checks whether two variables point to the same object in memory. Two Integer objects with value 200 may be stored at different memory addresses, so == returns false even though their values are equal. .equals() compares values.' },
      { q: 'What does (int) 3.99 evaluate to in Java?', options: ['4', '3', '3.99', 'Compile error'], correct: 1, explanation: 'Casting a double to int truncates (cuts off) the decimal — it does not round. So (int) 3.99 = 3. To round, use (int) Math.round(3.99) = 4.' },
    ],
    ide: {
      language: 'java',
      task: 'Write a FizzBuzz program that prints numbers 1–30. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz". Then compute and print the sum of all non-FizzBuzz numbers using a separate loop.',
      starterCode: `public class FizzBuzz {
    public static void main(String[] args) {
        // Part 1: FizzBuzz 1–30
        for (int i = 1; i <= 30; i++) {
            // TODO: print FizzBuzz, Fizz, Buzz, or the number
        }

        System.out.println("---");

        // Part 2: Sum all numbers 1–30 that are NOT divisible by 3 or 5
        int sum = 0;
        // TODO: loop 1–30, add to sum only if not divisible by 3 or 5
        System.out.println("Sum of non-FizzBuzz numbers: " + sum);
    }
}`,
      solution: `public class FizzBuzz {
    public static void main(String[] args) {
        for (int i = 1; i <= 30; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }

        System.out.println("---");

        int sum = 0;
        for (int i = 1; i <= 30; i++) {
            if (i % 3 != 0 && i % 5 != 0) {
                sum += i;
            }
        }
        System.out.println("Sum of non-FizzBuzz numbers: " + sum);
    }
}`,
      hints: [
        'Check FizzBuzz (both 3 AND 5) first, before individual Fizz or Buzz checks. Use &&.',
        'The modulus operator % gives the remainder: 15 % 3 == 0 means 15 is divisible by 3.',
        'For Part 2: skip the number if i % 3 == 0 || i % 5 == 0. Only add to sum otherwise.',
      ],
    },
  },
  {
    id: 'cc-java-m03', track: 'crash', title: 'Methods & OOP Fundamentals',
    subtitle: 'Write well-structured methods, understand scope and the call stack, and create your first classes with fields, constructors, and encapsulation.',
    moduleObjective: 'Write methods with proper return types, understand parameter passing, define a class with private fields and public methods, and use this keyword and constructors correctly.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'Masters',
    xp: 170, duration: 16, module: 3, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'Encapsulation', definition: 'Hiding internal state behind private fields and exposing controlled access through public methods (getters/setters). The first pillar of OOP.' },
      { term: 'Constructor', definition: 'A special method with the same name as the class, no return type, called with new. Initializes object state at creation time.' },
      { term: 'this keyword', definition: 'Reference to the current object instance. Used to disambiguate between field names and parameter names, or to call another constructor.' },
      { term: 'Method Overloading', definition: 'Multiple methods with the same name but different parameter lists. Java picks the right one at compile time based on argument types.' },
      { term: 'Pass by Value', definition: 'Java always passes by value. For primitives, the value is copied. For objects, the reference (address) is copied — not the object itself.' },
      { term: 'Access Modifiers', definition: 'private: class-only. package-private (default): same package. protected: package + subclasses. public: everywhere.' },
    ],
    content: `## Methods & OOP Fundamentals

### Method Anatomy

\`\`\`java
// accessModifier returnType methodName(paramType param1, ...) {
//     method body
//     return value;   // required unless return type is void
// }

public static int add(int a, int b) {
    return a + b;
}

// void methods return nothing
public static void printLine(String msg) {
    System.out.println(">>> " + msg);
}

// Multiple return points — valid but use sparingly
public static String classify(int n) {
    if (n < 0) return "negative";
    if (n == 0) return "zero";
    return "positive";
}
\`\`\`

---

### Method Overloading

Same method name, different parameter signatures. Java resolves at compile time:

\`\`\`java
public static double area(double radius) {
    return Math.PI * radius * radius;  // circle area
}

public static double area(double width, double height) {
    return width * height;  // rectangle area
}

public static double area(double a, double b, double c) {
    // Heron's formula for triangle given 3 sides
    double s = (a + b + c) / 2;
    return Math.sqrt(s * (s-a) * (s-b) * (s-c));
}

// main:
System.out.println(area(5.0));           // circle: 78.54
System.out.println(area(4.0, 6.0));      // rectangle: 24.0
System.out.println(area(3.0, 4.0, 5.0)); // triangle: 6.0
\`\`\`

---

### Your First Class: BankAccount

A class defines a blueprint. \`new\` creates an instance of that blueprint with its own copy of the fields:

\`\`\`java
public class BankAccount {
    // Fields — private: only this class can access them directly
    private String owner;
    private double balance;
    private int transactionCount;

    // Constructor — called with: BankAccount acct = new BankAccount("Jordan", 1000.0)
    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;          // 'this.owner' = field; 'owner' alone = parameter
        this.balance = initialBalance;
        this.transactionCount = 0;
    }

    // No-arg constructor for an empty account
    public BankAccount(String owner) {
        this(owner, 0.0);  // calls the 2-arg constructor above
    }

    // Mutator methods (setters with business logic)
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        balance += amount;
        transactionCount++;
    }

    public boolean withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Withdrawal must be positive");
        if (amount > balance) return false;  // insufficient funds
        balance -= amount;
        transactionCount++;
        return true;
    }

    // Accessor methods (getters)
    public double getBalance() { return balance; }
    public String getOwner()   { return owner; }
    public int getTransactionCount() { return transactionCount; }

    // toString: how this object looks when printed
    @Override
    public String toString() {
        return String.format("BankAccount[%s: $%.2f, %d txns]",
            owner, balance, transactionCount);
    }
}
\`\`\`

**Using BankAccount:**
\`\`\`java
BankAccount acct = new BankAccount("Jordan", 500.0);
acct.deposit(250.0);
boolean success = acct.withdraw(100.0);
System.out.println(success);            // true
System.out.println(acct);              // BankAccount[Jordan: $650.00, 2 txns]
System.out.println(acct.getBalance()); // 650.0

boolean failed = acct.withdraw(10000.0);
System.out.println(failed);            // false — insufficient funds
\`\`\`

---

### Pass By Value (The Common Gotcha)

Java passes **everything** by value. For primitives, a copy of the value is passed. For objects, a copy of the **reference** is passed:

\`\`\`java
// Primitives: original unchanged
public static void doubleIt(int x) {
    x = x * 2;  // only changes the local copy
}
int n = 5;
doubleIt(n);
System.out.println(n);  // still 5 — original unchanged

// Objects: can mutate through the reference
public static void deposit100(BankAccount acct) {
    acct.deposit(100);  // mutates the object at the original address
}
BankAccount a = new BankAccount("Test", 500.0);
deposit100(a);
System.out.println(a.getBalance());  // 600.0 — the object was mutated

// But reassigning the reference inside the method has no effect outside
public static void reassign(BankAccount acct) {
    acct = new BankAccount("New", 0.0);  // only changes local reference copy
}
reassign(a);
System.out.println(a.getOwner());  // still "Test"
\`\`\`

---

### The @Override Annotation

\`@Override\` tells the compiler you intend to override a parent class method. If you misspell it, the compiler catches the error:

\`\`\`java
@Override
public String toString() {
    return "My custom string representation";
}
\`\`\`

Every class in Java implicitly extends \`Object\`. \`Object\` has \`toString()\`, \`equals()\`, and \`hashCode()\` — you should override all three in well-designed value classes.`,
    quiz: [
      { q: 'What is the result of calling the following method with n=5: public static void triple(int n) { n *= 3; }', options: ['n becomes 15 in the caller', 'n is unchanged in the caller', 'The method returns 15', 'Compile error — void methods cannot modify parameters'], correct: 1, explanation: 'Java is pass-by-value for primitives. The method receives a copy of 5. Multiplying the copy by 3 gives 15 locally, but the original variable in the caller is unchanged.' },
      { q: 'What does this(owner, 0.0) do inside a constructor?', options: ['Calls a static method named this', 'Creates a new instance of the class', 'Calls another constructor in the same class', 'References the superclass constructor'], correct: 2, explanation: 'this(...) inside a constructor calls another constructor in the same class — called constructor chaining. It must be the first statement in the constructor body.' },
      { q: 'Which access modifier restricts a field to be accessible only within the class it is declared in?', options: ['public', 'protected', 'package-private (no modifier)', 'private'], correct: 3, explanation: 'private fields are only accessible within the class that declares them. This enforces encapsulation — external code must use public methods to interact with the state.' },
      { q: 'What is method overloading?', options: ['Replacing a parent class method with a different implementation', 'Multiple methods with the same name and same parameters but different return types', 'Multiple methods with the same name but different parameter lists', 'Calling the same method more than once'], correct: 2, explanation: 'Overloading = same name, different parameter list (different number, types, or order of parameters). Return type alone is not enough to distinguish overloaded methods.' },
    ],
    ide: {
      language: 'java',
      task: 'Create a Rectangle class with: private fields width and height, a constructor, getters, an area() method, a perimeter() method, a scale(double factor) method that multiplies both dimensions by factor, and toString(). In main, create two rectangles, print their area/perimeter, scale one by 2.5, and print again.',
      starterCode: `public class Rectangle {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        // TODO: initialize fields
    }

    public double getWidth()  { return width; }
    public double getHeight() { return height; }

    public double area()      { return 0; /* TODO */ }
    public double perimeter() { return 0; /* TODO */ }

    public void scale(double factor) {
        // TODO: multiply both dimensions by factor
    }

    @Override
    public String toString() {
        return ""; // TODO: e.g. "Rectangle[4.0 x 6.0]"
    }

    public static void main(String[] args) {
        Rectangle r1 = new Rectangle(4.0, 6.0);
        Rectangle r2 = new Rectangle(3.0, 3.0);
        System.out.println(r1);
        System.out.printf("Area: %.1f, Perimeter: %.1f%n", r1.area(), r1.perimeter());
        r1.scale(2.5);
        System.out.println("After scale(2.5): " + r1);
    }
}`,
      solution: `public class Rectangle {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double getWidth()  { return width; }
    public double getHeight() { return height; }

    public double area()      { return width * height; }
    public double perimeter() { return 2 * (width + height); }

    public void scale(double factor) {
        width  *= factor;
        height *= factor;
    }

    @Override
    public String toString() {
        return String.format("Rectangle[%.1f x %.1f]", width, height);
    }

    public static void main(String[] args) {
        Rectangle r1 = new Rectangle(4.0, 6.0);
        Rectangle r2 = new Rectangle(3.0, 3.0);
        System.out.println(r1);
        System.out.printf("Area: %.1f, Perimeter: %.1f%n", r1.area(), r1.perimeter());
        r1.scale(2.5);
        System.out.println("After scale(2.5): " + r1);
        System.out.printf("r2 area: %.1f%n", r2.area());
    }
}`,
      hints: [
        'area = width * height. perimeter = 2 * (width + height).',
        'scale multiplies both: width *= factor; height *= factor;',
        'toString: use String.format("Rectangle[%.1f x %.1f]", width, height)',
      ],
    },
  },
  {
    id: 'cc-java-m04', track: 'crash', title: 'Classes, Inheritance & Interfaces',
    subtitle: 'Extend classes with inheritance, use abstract classes and polymorphism, and define behavior contracts with interfaces.',
    moduleObjective: 'Create a class hierarchy using extends, override methods polymorphically, declare abstract classes, implement interfaces, and understand when to choose each.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'Masters',
    xp: 175, duration: 18, module: 4, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'Inheritance', definition: 'A class (subclass) extending another (superclass) inherits all non-private fields and methods. Use extends keyword. Java supports single inheritance only.' },
      { term: 'Polymorphism', definition: 'One interface, multiple implementations. A variable of a parent type can hold a child instance; the correct method is called at runtime based on the actual object type.' },
      { term: 'Abstract Class', definition: 'A class that cannot be instantiated directly. May have abstract methods (no body) that subclasses must implement. Use when subclasses share common state.' },
      { term: 'Interface', definition: 'A contract declaring method signatures (and default implementations) that implementing classes must provide. Use implements. A class can implement multiple interfaces.' },
      { term: 'super keyword', definition: 'References the parent class. super() calls the parent constructor; super.method() calls the parent version of an overridden method.' },
      { term: 'instanceof', definition: 'Runtime type check: obj instanceof ClassName returns true if obj is that type or a subtype. Java 16+ pattern: if (obj instanceof Dog d) lets you use d directly.' },
    ],
    content: `## Classes, Inheritance & Interfaces

### Inheritance with extends

\`\`\`java
// Superclass (parent)
public class Animal {
    protected String name;  // protected: accessible in subclasses
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    public String speak() {
        return name + " makes a sound";
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "[" + name + ", age=" + age + "]";
    }
}

// Subclass inherits everything from Animal
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);  // MUST call parent constructor first
        this.breed = breed;
    }

    @Override  // replaces Animal.speak() for Dog instances
    public String speak() {
        return name + " barks: Woof!";
    }

    public String getBreed() { return breed; }
}

public class Cat extends Animal {
    public Cat(String name, int age) {
        super(name, age);
    }

    @Override
    public String speak() {
        return name + " meows: Purrrr";
    }
}
\`\`\`

**Polymorphism in action:**
\`\`\`java
Animal[] animals = {
    new Dog("Rex", 3, "German Shepherd"),
    new Cat("Whiskers", 5),
    new Dog("Buddy", 2, "Labrador"),
};

for (Animal a : animals) {
    System.out.println(a.speak());  // calls correct subclass speak() at runtime
}
// Rex barks: Woof!
// Whiskers meows: Purrrr
// Buddy barks: Woof!

// instanceof + pattern matching (Java 16+)
for (Animal a : animals) {
    if (a instanceof Dog d) {
        System.out.println(d.getBreed());
    }
}
\`\`\`

---

### Abstract Classes

Use \`abstract\` when the concept is too generic to instantiate directly but shares state:

\`\`\`java
public abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // abstract method: no body, subclasses MUST implement it
    public abstract double area();
    public abstract double perimeter();

    // concrete method: shared by all shapes
    public void describe() {
        System.out.printf("%s %s: area=%.2f, perimeter=%.2f%n",
            color, getClass().getSimpleName(), area(), perimeter());
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override public double area()      { return Math.PI * radius * radius; }
    @Override public double perimeter() { return 2 * Math.PI * radius; }
}

public class Square extends Shape {
    private double side;

    public Square(String color, double side) {
        super(color);
        this.side = side;
    }

    @Override public double area()      { return side * side; }
    @Override public double perimeter() { return 4 * side; }
}
\`\`\`

---

### Interfaces

Interfaces define **what** a class can do without specifying **how**. A class can implement multiple interfaces:

\`\`\`java
public interface Printable {
    void print();  // public abstract by default
}

public interface Saveable {
    boolean save(String filepath);

    // Default method: provides a default implementation
    default String getSaveFormat() {
        return "json";
    }
}

public class Report implements Printable, Saveable {
    private String title;
    private String content;

    public Report(String title, String content) {
        this.title   = title;
        this.content = content;
    }

    @Override
    public void print() {
        System.out.println("=== " + title + " ===");
        System.out.println(content);
    }

    @Override
    public boolean save(String filepath) {
        System.out.println("Saving to: " + filepath + "." + getSaveFormat());
        return true;
    }
}

// Use the interface type for polymorphism:
Printable p = new Report("Q4 Results", "Revenue: $1.2M");
p.print();
\`\`\`

---

### Abstract Class vs. Interface: The Decision Rule

| Scenario | Use |
|---|---|
| Subclasses share **fields and state** | Abstract class |
| Subclasses share **behavior** (methods) | Abstract class |
| Defining a **capability** (can print, can save) | Interface |
| A class needs **multiple contracts** | Interfaces (since Java has single inheritance) |
| Retrofitting existing classes with new behavior | Interface default methods |

---

### The super Keyword

\`\`\`java
public class LuxuryAccount extends BankAccount {
    private double creditLimit;

    public LuxuryAccount(String owner, double balance, double creditLimit) {
        super(owner, balance);  // call BankAccount constructor
        this.creditLimit = creditLimit;
    }

    @Override
    public boolean withdraw(double amount) {
        // Can overdraft up to creditLimit
        if (amount > getBalance() + creditLimit) return false;
        // Call parent implementation, then adjust if needed
        return super.withdraw(Math.min(amount, getBalance()))
            || adjustCredit(amount - getBalance());
    }

    private boolean adjustCredit(double amount) {
        creditLimit -= amount;
        return true;
    }
}
\`\`\``,
    quiz: [
      { q: 'A variable of type Animal holds a Dog instance. When you call speak() on it, which implementation runs?', options: ['Animal.speak()', 'Dog.speak()', 'Both run in sequence', 'Compile error — must cast to Dog first'], correct: 1, explanation: 'This is polymorphism (dynamic dispatch). Java determines the actual object type at runtime and calls the most specific override. The variable type is Animal, but the object is Dog, so Dog.speak() runs.' },
      { q: 'Can you instantiate an abstract class directly with new?', options: ['Yes, always', 'Yes, if it has a constructor', 'No, you must extend it and implement abstract methods', 'Yes, if all abstract methods have default implementations'], correct: 2, explanation: 'Abstract classes cannot be instantiated with new. They exist only as base types. You must create a concrete subclass that implements all abstract methods, then instantiate the subclass.' },
      { q: 'What is the key difference between an abstract class and an interface?', options: ['Interfaces can have methods; abstract classes cannot', 'Abstract classes can have fields and constructors; interfaces (traditionally) define only method contracts', 'A class can extend multiple abstract classes but implement only one interface', 'There is no meaningful difference in modern Java'], correct: 1, explanation: 'Abstract classes can have instance fields, constructors, and concrete methods — they model "is-a" with shared state. Interfaces define behavioral contracts — a class can implement multiple interfaces but only extend one abstract class.' },
      { q: 'What does super() do when called inside a constructor?', options: ['Creates a new superclass instance', 'Calls the no-arg constructor of Object', 'Calls the parent class constructor — must be the first statement', 'Calls the overridden version of the current method'], correct: 2, explanation: 'super() inside a constructor calls the parent class constructor. If not written explicitly and the parent has no no-arg constructor, you\'ll get a compile error. It must always be the first line of the constructor.' },
    ],
    ide: {
      language: 'java',
      task: 'Create an abstract class Vehicle with fields make, model, year; an abstract method fuelCost(int miles); and a concrete describe() method. Then create Car (gas, mpg) and ElectricCar (kWhPer100Miles, electricityRatePerKWh) subclasses. Implement fuelCost(). In main, create one of each and print descriptions + fuel cost for 500 miles.',
      starterCode: `public class VehicleDemo {

    abstract static class Vehicle {
        protected String make, model;
        protected int year;

        public Vehicle(String make, String model, int year) {
            this.make = make; this.model = model; this.year = year;
        }

        public abstract double fuelCost(int miles);

        public void describe() {
            System.out.printf("%d %s %s%n", year, make, model);
        }
    }

    static class Car extends Vehicle {
        private double mpg;
        private double gasPricePerGallon;

        public Car(String make, String model, int year, double mpg, double gasPrice) {
            super(make, model, year);
            // TODO: assign mpg and gasPricePerGallon
        }

        @Override
        public double fuelCost(int miles) {
            return 0; // TODO: (miles / mpg) * gasPricePerGallon
        }
    }

    static class ElectricCar extends Vehicle {
        private double kWhPer100Miles;
        private double ratePerKWh;

        public ElectricCar(String make, String model, int year, double kWhPer100Miles, double ratePerKWh) {
            super(make, model, year);
            // TODO: assign fields
        }

        @Override
        public double fuelCost(int miles) {
            return 0; // TODO: (miles / 100.0) * kWhPer100Miles * ratePerKWh
        }
    }

    public static void main(String[] args) {
        Vehicle gas = new Car("Toyota", "Camry", 2023, 32.0, 3.80);
        Vehicle ev  = new ElectricCar("Tesla", "Model 3", 2023, 25.0, 0.13);

        int miles = 500;
        for (Vehicle v : new Vehicle[]{gas, ev}) {
            v.describe();
            System.out.printf("  Cost for %d miles: $%.2f%n", miles, v.fuelCost(miles));
        }
    }
}`,
      solution: `public class VehicleDemo {

    abstract static class Vehicle {
        protected String make, model;
        protected int year;

        public Vehicle(String make, String model, int year) {
            this.make = make; this.model = model; this.year = year;
        }

        public abstract double fuelCost(int miles);

        public void describe() {
            System.out.printf("%d %s %s%n", year, make, model);
        }
    }

    static class Car extends Vehicle {
        private double mpg, gasPricePerGallon;

        public Car(String make, String model, int year, double mpg, double gasPrice) {
            super(make, model, year);
            this.mpg = mpg;
            this.gasPricePerGallon = gasPrice;
        }

        @Override
        public double fuelCost(int miles) {
            return (miles / mpg) * gasPricePerGallon;
        }
    }

    static class ElectricCar extends Vehicle {
        private double kWhPer100Miles, ratePerKWh;

        public ElectricCar(String make, String model, int year, double kWhPer100Miles, double ratePerKWh) {
            super(make, model, year);
            this.kWhPer100Miles = kWhPer100Miles;
            this.ratePerKWh = ratePerKWh;
        }

        @Override
        public double fuelCost(int miles) {
            return (miles / 100.0) * kWhPer100Miles * ratePerKWh;
        }
    }

    public static void main(String[] args) {
        Vehicle gas = new Car("Toyota", "Camry", 2023, 32.0, 3.80);
        Vehicle ev  = new ElectricCar("Tesla", "Model 3", 2023, 25.0, 0.13);

        int miles = 500;
        for (Vehicle v : new Vehicle[]{gas, ev}) {
            v.describe();
            System.out.printf("  Cost for %d miles: $%.2f%n", miles, v.fuelCost(miles));
        }
    }
}`,
      hints: [
        'Car fuel cost: gallons needed = miles / mpg. Cost = gallons * pricePerGallon.',
        'ElectricCar cost: kWh needed = (miles / 100.0) * kWhPer100Miles. Cost = kWh * ratePerKWh.',
        'Use the Vehicle[] array in main to demonstrate polymorphism — same loop, different fuelCost() implementations.',
      ],
    },
  },
  {
    id: 'cc-java-m05', track: 'crash', title: 'Collections: ArrayList, HashMap & Streams',
    subtitle: 'Use Java\'s most important data structures and transform data with the Streams API — filter, map, sort, collect.',
    moduleObjective: 'Use ArrayList and HashMap fluently, understand generics, apply the 5 core Stream operations (filter, map, sorted, collect, reduce), and choose the right collection for a task.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'Masters',
    xp: 180, duration: 18, module: 5, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'Generics', definition: 'Type parameters that let you write type-safe code without casting. ArrayList<String> can only hold Strings. The compiler enforces this at compile time.' },
      { term: 'ArrayList', definition: 'A resizable array backed by a dynamic array. O(1) get/set, O(1) amortized add at end, O(n) insert/delete. Use when you need indexed access.' },
      { term: 'HashMap', definition: 'Key-value store backed by a hash table. O(1) average put/get/containsKey. Keys must properly implement hashCode() and equals().' },
      { term: 'Stream', definition: 'A declarative pipeline for processing collections. Lazy evaluation — operations run only when a terminal operation (collect, reduce, forEach) is called.' },
      { term: 'Lambda Expression', definition: 'Anonymous function passed as an argument. (x) -> x * 2 doubles x. Used extensively with Streams and functional interfaces.' },
      { term: 'Collectors', definition: 'Terminal stream operations that collect results: toList(), toMap(), groupingBy(), joining(). Part of java.util.stream.Collectors.' },
    ],
    content: `## Collections: ArrayList, HashMap & Streams

### ArrayList

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");
names.add(1, "Zara");   // insert at index 1

System.out.println(names);         // [Alice, Zara, Bob, Charlie]
System.out.println(names.get(0));  // Alice
System.out.println(names.size());  // 4

names.remove("Bob");               // remove by value
names.remove(0);                   // remove by index
System.out.println(names);         // [Zara, Charlie]

// Initialize with values (immutable):
List<Integer> scores = List.of(92, 85, 78, 96, 88);

// Mutable copy:
List<Integer> mutableScores = new ArrayList<>(scores);
Collections.sort(mutableScores);
System.out.println(mutableScores); // [78, 85, 88, 92, 96]
\`\`\`

---

### HashMap

\`\`\`java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> inventory = new HashMap<>();
inventory.put("apples",  50);
inventory.put("bananas", 30);
inventory.put("oranges", 45);

System.out.println(inventory.get("apples"));          // 50
System.out.println(inventory.getOrDefault("grapes", 0)); // 0 (key not present)
System.out.println(inventory.containsKey("bananas")); // true

// Update with merge:
inventory.merge("apples", 10, Integer::sum);  // apples = 50 + 10 = 60

// Iterate entries:
for (Map.Entry<String, Integer> entry : inventory.entrySet()) {
    System.out.printf("%s: %d%n", entry.getKey(), entry.getValue());
}

// Or with forEach lambda:
inventory.forEach((item, qty) ->
    System.out.printf("  %s → %d units%n", item, qty));
\`\`\`

---

### The Streams API

Streams provide a functional, declarative way to process collections. Key rule: **streams don't mutate the source** — they produce new results.

\`\`\`java
import java.util.List;
import java.util.stream.Collectors;

List<String> words = List.of("apple", "banana", "avocado", "blueberry", "apricot");

// filter → map → sorted → collect
List<String> result = words.stream()
    .filter(w -> w.startsWith("a"))      // keep words starting with 'a'
    .map(String::toUpperCase)            // uppercase each
    .sorted()                            // alphabetical order
    .collect(Collectors.toList());

System.out.println(result);  // [APPLE, APRICOT, AVOCADO]
\`\`\`

**Numeric streams and reduction:**
\`\`\`java
List<Integer> nums = List.of(3, 7, 2, 9, 4, 1, 8, 5, 6);

int sum  = nums.stream().mapToInt(Integer::intValue).sum();
int max  = nums.stream().mapToInt(Integer::intValue).max().getAsInt();
double avg = nums.stream().mapToInt(Integer::intValue).average().getAsDouble();

System.out.printf("Sum=%d, Max=%d, Avg=%.1f%n", sum, max, avg);
// Sum=45, Max=9, Avg=5.0
\`\`\`

**groupingBy — partition data into a map:**
\`\`\`java
List<String> fruits = List.of("apple", "apricot", "banana", "blueberry", "cherry", "avocado");

Map<Character, List<String>> byFirstLetter = fruits.stream()
    .collect(Collectors.groupingBy(s -> s.charAt(0)));

byFirstLetter.forEach((letter, list) ->
    System.out.println(letter + ": " + list));
// a: [apple, apricot, avocado]
// b: [banana, blueberry]
// c: [cherry]
\`\`\`

**Chaining with objects:**
\`\`\`java
record Product(String name, double price, String category) {}

List<Product> products = List.of(
    new Product("Laptop",  1299.0, "Electronics"),
    new Product("Phone",    799.0, "Electronics"),
    new Product("Desk",     450.0, "Furniture"),
    new Product("Monitor",  599.0, "Electronics"),
    new Product("Chair",    299.0, "Furniture")
);

// Electronics sorted by price descending, names only
List<String> elecNames = products.stream()
    .filter(p -> p.category().equals("Electronics"))
    .sorted((a, b) -> Double.compare(b.price(), a.price()))
    .map(Product::name)
    .collect(Collectors.toList());

System.out.println(elecNames);  // [Laptop, Monitor, Phone]

// Total value of all products
double total = products.stream()
    .mapToDouble(Product::price)
    .sum();
System.out.printf("Total: $%.2f%n", total);  // Total: $3446.00
\`\`\`

---

### Choosing the Right Collection

| Use Case | Collection |
|---|---|
| Ordered list, indexed access | ArrayList |
| Frequent insert/delete in middle | LinkedList |
| No duplicates, fast lookup | HashSet |
| No duplicates, sorted | TreeSet |
| Key → value mapping | HashMap |
| Key → value, sorted by key | TreeMap |
| Thread-safe map | ConcurrentHashMap |`,
    quiz: [
      { q: 'What is the time complexity of HashMap.get(key) on average?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct: 2, explanation: 'HashMap uses a hash table. get() computes the hash of the key, jumps directly to the bucket — O(1) on average. In the worst case (all keys hash to the same bucket) it degrades to O(n), but this is extremely rare with a well-implemented hashCode().' },
      { q: 'Streams are lazy. What does this mean?', options: ['Streams are slow', 'Stream operations like filter() and map() do not execute until a terminal operation is called', 'Streams only process the first element', 'Streams cache results automatically'], correct: 1, explanation: 'Intermediate operations (filter, map, sorted) build a pipeline but do no work. The pipeline executes only when a terminal operation (collect, sum, forEach, findFirst) is called. This enables short-circuiting — finding the first match stops processing.' },
      { q: 'What does Collectors.groupingBy() return?', options: ['A sorted list', 'A Map where keys are the grouping criterion and values are lists of matching elements', 'A Set of unique grouped values', 'A Stream of grouped streams'], correct: 1, explanation: 'groupingBy classifies stream elements into a Map<K, List<T>>. For example, groupingBy(String::length) groups words by their length into a Map<Integer, List<String>>.' },
      { q: 'Which List method removes an element by its index?', options: ['delete(index)', 'remove(index)', 'pop(index)', 'discard(index)'], correct: 1, explanation: 'list.remove(int index) removes by position. list.remove(Object o) removes by value. When working with List<Integer>, use list.remove(Integer.valueOf(5)) to remove the value 5, not list.remove(5) which removes index 5.' },
    ],
    ide: {
      language: 'java',
      task: 'Given a list of Student records (name, grade, score), use Streams to: (1) find all students with score >= 80, sorted by score descending, (2) compute the class average, (3) group students by grade letter (A=90+, B=80+, C=70+, F=below 70). Print all three results.',
      starterCode: `import java.util.*;
import java.util.stream.*;

public class StudentAnalysis {
    record Student(String name, double score) {
        String grade() {
            if (score >= 90) return "A";
            if (score >= 80) return "B";
            if (score >= 70) return "C";
            return "F";
        }
    }

    public static void main(String[] args) {
        List<Student> students = List.of(
            new Student("Alice", 95.5),
            new Student("Bob", 72.0),
            new Student("Carol", 88.5),
            new Student("David", 61.0),
            new Student("Emma", 91.0),
            new Student("Frank", 78.5),
            new Student("Grace", 84.0)
        );

        // TODO 1: Students with score >= 80, sorted by score desc
        List<Student> topStudents = students.stream()
            /* ... */
            .collect(Collectors.toList());
        System.out.println("Top students:");
        topStudents.forEach(s -> System.out.printf("  %s: %.1f%n", s.name(), s.score()));

        // TODO 2: Class average
        double avg = 0; // compute with stream
        System.out.printf("Class average: %.2f%n", avg);

        // TODO 3: Group by grade letter
        Map<String, List<Student>> byGrade = students.stream()
            /* ... */
            .collect(Collectors.groupingBy(Student::grade));
        System.out.println("By grade:");
        byGrade.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> System.out.println("  " + e.getKey() + ": " +
                e.getValue().stream().map(Student::name).collect(Collectors.joining(", "))));
    }
}`,
      solution: `import java.util.*;
import java.util.stream.*;

public class StudentAnalysis {
    record Student(String name, double score) {
        String grade() {
            if (score >= 90) return "A";
            if (score >= 80) return "B";
            if (score >= 70) return "C";
            return "F";
        }
    }

    public static void main(String[] args) {
        List<Student> students = List.of(
            new Student("Alice", 95.5),
            new Student("Bob", 72.0),
            new Student("Carol", 88.5),
            new Student("David", 61.0),
            new Student("Emma", 91.0),
            new Student("Frank", 78.5),
            new Student("Grace", 84.0)
        );

        List<Student> topStudents = students.stream()
            .filter(s -> s.score() >= 80)
            .sorted((a, b) -> Double.compare(b.score(), a.score()))
            .collect(Collectors.toList());
        System.out.println("Top students:");
        topStudents.forEach(s -> System.out.printf("  %s: %.1f%n", s.name(), s.score()));

        double avg = students.stream()
            .mapToDouble(Student::score)
            .average()
            .orElse(0.0);
        System.out.printf("Class average: %.2f%n", avg);

        Map<String, List<Student>> byGrade = students.stream()
            .collect(Collectors.groupingBy(Student::grade));
        System.out.println("By grade:");
        byGrade.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> System.out.println("  " + e.getKey() + ": " +
                e.getValue().stream().map(Student::name).collect(Collectors.joining(", "))));
    }
}`,
      hints: [
        'For top students: .filter(s -> s.score() >= 80).sorted((a, b) -> Double.compare(b.score(), a.score()))',
        'For average: .mapToDouble(Student::score).average().orElse(0.0)',
        'For groupBy: .collect(Collectors.groupingBy(Student::grade))',
      ],
    },
  },
  {
    id: 'cc-java-m06', track: 'crash', title: 'Exception Handling & File I/O',
    subtitle: 'Write robust exception handling with try/catch/finally, define custom exceptions, and read/write files with modern Java NIO.',
    moduleObjective: 'Handle checked and unchecked exceptions correctly, create custom exception classes, use try-with-resources for file safety, and read/write text and CSV files with java.nio.file.Files.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'PhD',
    xp: 185, duration: 20, module: 6, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'Checked Exception', definition: 'Exception the compiler forces you to handle (catch or declare with throws). Usually represents recoverable conditions: IOException, SQLException.' },
      { term: 'Unchecked Exception', definition: 'RuntimeException subclasses. Compiler does not require handling. Usually programming errors: NullPointerException, ArrayIndexOutOfBoundsException.' },
      { term: 'try-with-resources', definition: 'Automatically closes AutoCloseable objects (files, streams) when the try block exits — even on exception. Eliminates resource leak bugs.' },
      { term: 'Finally block', definition: 'Code that runs regardless of whether an exception was thrown or caught. Use for cleanup when try-with-resources is not applicable.' },
      { term: 'Custom Exception', definition: 'A class extending Exception (checked) or RuntimeException (unchecked). Adds domain-specific error types with additional fields.' },
      { term: 'Path / Files', definition: 'java.nio.file.Path and Files — modern Java I/O. Files.readAllLines(), Files.writeString(), Files.lines() are cleaner than old java.io classes.' },
    ],
    content: `## Exception Handling & File I/O

### The Exception Hierarchy

\`\`\`
Throwable
├── Error  (JVM-level — OutOfMemoryError — don't catch these)
└── Exception
    ├── Checked Exceptions (must handle at compile time)
    │   ├── IOException
    │   ├── SQLException
    │   └── ParseException
    └── RuntimeException (unchecked — handle if you want)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── IllegalArgumentException
        └── NumberFormatException
\`\`\`

---

### try / catch / finally

\`\`\`java
public static int divide(int a, int b) {
    try {
        return a / b;
    } catch (ArithmeticException e) {
        System.err.println("Division by zero: " + e.getMessage());
        return 0;
    } finally {
        System.out.println("divide() completed"); // always runs
    }
}

// Multiple catch blocks — most specific first:
public static int parseAndDouble(String input) {
    try {
        int n = Integer.parseInt(input);
        return n * 2;
    } catch (NumberFormatException e) {
        System.err.println("Not a number: " + input);
        return -1;
    } catch (Exception e) {
        System.err.println("Unexpected: " + e.getMessage());
        return -1;
    }
}

// Multi-catch (Java 7+):
try {
    // ...
} catch (IOException | SQLException e) {
    System.err.println("IO or DB error: " + e.getMessage());
}
\`\`\`

---

### Custom Exceptions

\`\`\`java
// Checked custom exception
public class InsufficientFundsException extends Exception {
    private final double requested;
    private final double available;

    public InsufficientFundsException(double requested, double available) {
        super(String.format("Requested $%.2f but only $%.2f available",
              requested, available));
        this.requested = requested;
        this.available = available;
    }

    public double getShortfall() { return requested - available; }
}

// Using it:
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        throw new InsufficientFundsException(amount, balance);
    }
    balance -= amount;
}

// Caller must handle:
try {
    account.withdraw(5000.0);
} catch (InsufficientFundsException e) {
    System.err.println(e.getMessage());
    System.out.printf("You need $%.2f more.%n", e.getShortfall());
}
\`\`\`

---

### File I/O with java.nio.file

Modern Java uses \`Path\` and \`Files\` from java.nio.file:

\`\`\`java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

// Writing a file:
public static void writeReport(String filepath, String content) throws IOException {
    Path path = Paths.get(filepath);
    Files.writeString(path, content);
    System.out.println("Written to: " + path.toAbsolutePath());
}

// Reading a file:
public static List<String> readLines(String filepath) throws IOException {
    return Files.readAllLines(Paths.get(filepath));
}

// Streaming lines (memory-efficient for large files):
public static long countWords(String filepath) throws IOException {
    try (var lines = Files.lines(Paths.get(filepath))) {
        return lines
            .flatMap(line -> java.util.Arrays.stream(line.split("\\\\s+")))
            .filter(word -> !word.isBlank())
            .count();
    }
}
\`\`\`

---

### try-with-resources

The safest way to work with resources (files, database connections, network streams):

\`\`\`java
import java.io.*;
import java.nio.file.*;

// try-with-resources ensures reader.close() is ALWAYS called
public static void processCSV(String filepath) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(Paths.get(filepath))) {
        String line;
        int lineNum = 0;
        while ((line = reader.readLine()) != null) {
            lineNum++;
            String[] parts = line.split(",");
            if (parts.length < 3) continue;
            System.out.printf("Line %d: name=%s, score=%s%n",
                lineNum, parts[0].trim(), parts[2].trim());
        }
    }
    // reader is automatically closed here — no finally block needed
}

// Writing CSV:
public static void writeCSV(String filepath, List<String[]> rows) throws IOException {
    try (PrintWriter writer = new PrintWriter(Files.newBufferedWriter(Paths.get(filepath)))) {
        writer.println("name,email,score");
        for (String[] row : rows) {
            writer.println(String.join(",", row));
        }
    }
}
\`\`\`

---

### Exception Design Guidelines

1. **Throw early, catch late** — validate inputs immediately; handle exceptions at the layer that can do something meaningful
2. **Never swallow exceptions** — \`catch (Exception e) {}\` hides bugs; at minimum log the error
3. **Use checked exceptions** for conditions the caller can reasonably recover from (file not found → prompt for different path)
4. **Use unchecked exceptions** for programming errors (invalid argument, null where not expected)
5. **Include context** in exception messages — \`"File not found: " + filepath\` is better than \`"File not found"\``,
    quiz: [
      { q: 'What is the difference between a checked and an unchecked exception?', options: ['Checked exceptions crash the program; unchecked do not', 'Checked exceptions must be caught or declared with throws at compile time; unchecked (RuntimeException) do not', 'Checked exceptions extend RuntimeException; unchecked extend Exception', 'There is no difference in Java 17+'], correct: 1, explanation: 'Checked exceptions (IOException, SQLException) must be handled — either caught with try/catch or declared with throws in the method signature. The compiler enforces this. Unchecked exceptions (RuntimeException) are optional to handle.' },
      { q: 'What is the main benefit of try-with-resources?', options: ['It makes code run faster', 'It automatically closes AutoCloseable resources even if an exception is thrown, preventing resource leaks', 'It catches all exceptions automatically', 'It retries the operation on failure'], correct: 1, explanation: 'Before try-with-resources, you needed a finally block to close files/connections — and it was easy to forget. try-with-resources automatically calls close() on declared resources when the block exits, whether normally or with an exception.' },
      { q: 'What happens in the finally block?', options: ['It runs only if no exception was thrown', 'It runs only if an exception was thrown', 'It always runs, regardless of exceptions', 'It runs instead of the catch block'], correct: 2, explanation: 'finally always executes — after try completes normally, after a catch block completes, or even when an exception propagates uncaught. Use it for critical cleanup when try-with-resources is not applicable.' },
      { q: 'Which Java NIO method reads all lines of a text file into a List<String>?', options: ['Files.read(path)', 'Files.readAllLines(path)', 'Files.getText(path)', 'new Scanner(path).lines()'], correct: 1, explanation: 'Files.readAllLines(Path path) reads the entire file into a List<String>. For large files, use Files.lines(path) instead — it returns a Stream<String> that is lazily evaluated.' },
    ],
    ide: {
      language: 'java',
      task: 'Write a class SafeCalculator with a static divide(double a, double b) that throws a custom DivisionByZeroException (unchecked) with a descriptive message when b==0. Write a static parseNumber(String s) that returns the double or throws a custom InvalidInputException (checked) with the invalid input in the message. In main, test both with valid and invalid inputs using try/catch.',
      starterCode: `public class SafeCalculator {

    // Unchecked exception for division by zero
    static class DivisionByZeroException extends RuntimeException {
        public DivisionByZeroException(double numerator) {
            // TODO: super("Cannot divide " + numerator + " by zero");
            super("TODO");
        }
    }

    // Checked exception for invalid input
    static class InvalidInputException extends Exception {
        private final String input;
        public InvalidInputException(String input) {
            // TODO: descriptive message including the invalid input
            super("TODO");
            this.input = input;
        }
        public String getInput() { return input; }
    }

    public static double divide(double a, double b) {
        // TODO: throw DivisionByZeroException if b == 0
        return a / b;
    }

    public static double parseNumber(String s) throws InvalidInputException {
        // TODO: try Integer.parseInt, catch NumberFormatException,
        //       throw InvalidInputException
        return 0;
    }

    public static void main(String[] args) {
        // Test divide
        System.out.println(divide(10, 2));    // 5.0
        try {
            divide(7, 0);
        } catch (DivisionByZeroException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        // Test parseNumber
        try {
            System.out.println(parseNumber("42.5"));
            System.out.println(parseNumber("abc"));  // should throw
        } catch (InvalidInputException e) {
            System.out.println("Invalid: " + e.getInput());
        }
    }
}`,
      solution: `public class SafeCalculator {

    static class DivisionByZeroException extends RuntimeException {
        public DivisionByZeroException(double numerator) {
            super("Cannot divide " + numerator + " by zero");
        }
    }

    static class InvalidInputException extends Exception {
        private final String input;
        public InvalidInputException(String input) {
            super("Invalid number: '" + input + "' cannot be parsed as a double");
            this.input = input;
        }
        public String getInput() { return input; }
    }

    public static double divide(double a, double b) {
        if (b == 0) throw new DivisionByZeroException(a);
        return a / b;
    }

    public static double parseNumber(String s) throws InvalidInputException {
        try {
            return Double.parseDouble(s);
        } catch (NumberFormatException e) {
            throw new InvalidInputException(s);
        }
    }

    public static void main(String[] args) {
        System.out.println(divide(10, 2));
        try {
            divide(7, 0);
        } catch (DivisionByZeroException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        try {
            System.out.println(parseNumber("42.5"));
            System.out.println(parseNumber("abc"));
        } catch (InvalidInputException e) {
            System.out.println("Invalid: " + e.getInput());
        }
    }
}`,
      hints: [
        'DivisionByZeroException extends RuntimeException — no throws declaration needed at call sites.',
        'InvalidInputException extends Exception — the calling method must declare throws InvalidInputException.',
        'Use Double.parseDouble(s) inside a try/catch NumberFormatException to detect invalid input.',
      ],
    },
  },
  {
    id: 'cc-java-m07', track: 'crash', title: 'Kotlin: val/var, Data Classes, Null Safety & Extensions',
    subtitle: 'Learn Kotlin from a Java perspective — understand why it is preferred for Android and modern backends, and write idiomatic Kotlin in 60 minutes.',
    moduleObjective: 'Use val/var correctly, define data classes, write null-safe code with ? and !!, use extension functions to add behavior to existing classes, and write when expressions.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'PhD',
    xp: 195, duration: 20, module: 7, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'val / var', definition: 'val is immutable (like Java final). var is mutable. Prefer val. Kotlin infers type from context so you rarely write the type explicitly.' },
      { term: 'Data Class', definition: 'data class generates equals(), hashCode(), toString(), copy(), and componentN() functions automatically. Perfect for value objects and DTOs.' },
      { term: 'Null Safety', definition: 'Kotlin separates nullable (String?) from non-null (String) types at the compiler level. You must explicitly handle null — eliminating NullPointerException at compile time.' },
      { term: 'Extension Function', definition: 'Adds a method to an existing class without modifying or subclassing it. fun String.isPalindrome(): Boolean = this == this.reversed()' },
      { term: 'when expression', definition: 'Kotlin\'s enhanced switch. Returns a value, requires no break, can match types/ranges/conditions. Exhaustive when used on sealed classes.' },
      { term: 'Scope Functions', definition: 'let, apply, run, also, with — execute a block in the context of an object. apply returns the object; let transforms it; also performs side effects.' },
    ],
    content: `## Kotlin: val/var, Data Classes, Null Safety & Extensions

### Why Kotlin?

Kotlin is officially preferred by Google for Android development and is widely used in backend services (Ktor, Spring Boot). It compiles to JVM bytecode, so everything you know about Java applies. Kotlin eliminates Java boilerplate while adding powerful features.

---

### Variables: val and var

\`\`\`kotlin
val name = "Jordan"     // immutable (final in Java) — cannot reassign
var count = 0           // mutable — can reassign
count = count + 1       // OK
// name = "Alice"       // COMPILE ERROR: val cannot be reassigned

// Type can be declared explicitly:
val price: Double = 29.99
var inventory: Int = 100

// Type inference means you rarely need to write the type
val greeting = "Hello"  // Kotlin infers String
\`\`\`

---

### Data Classes

In Java, a simple value class requires a constructor, getters, equals(), hashCode(), and toString(). In Kotlin:

\`\`\`kotlin
data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String
)

// All this is auto-generated:
val p1 = Product(1, "Laptop", 1299.0, "Electronics")
val p2 = Product(1, "Laptop", 1299.0, "Electronics")

println(p1)           // Product(id=1, name=Laptop, price=1299.0, category=Electronics)
println(p1 == p2)     // true  (structural equality via equals())
println(p1 === p2)    // false (referential equality — different objects)

// copy() creates a modified copy without mutating original:
val discounted = p1.copy(price = 999.0)
println(discounted)   // Product(id=1, name=Laptop, price=999.0, category=Electronics)
\`\`\`

---

### Null Safety

Kotlin's type system distinguishes nullable from non-null:

\`\`\`kotlin
var nonNull: String = "Hello"
// nonNull = null  // COMPILE ERROR

var nullable: String? = "Hello"
nullable = null  // OK

// Safe call operator (?.)
println(nullable?.length)    // null (doesn't throw)
println(nullable?.uppercase()) // null

// Elvis operator (?:) — provide a default
val length = nullable?.length ?: 0  // 0 if nullable is null

// Non-null assertion (!!) — use only when you're certain; throws NPE if null
val forcedLength = nullable!!.length  // throws KotlinNullPointerException if null

// let for null-safe operations:
nullable?.let {
    println("Not null: $it")  // only runs if nullable != null
}
\`\`\`

---

### Extension Functions

Add functions to any class without inheriting from it:

\`\`\`kotlin
// Add isPalindrome() to String
fun String.isPalindrome(): Boolean = this == this.reversed()

// Add a toCurrency() to Double
fun Double.toCurrency(symbol: String = "$"): String =
    "$symbol\${"%.2f".format(this)}"

// Extension on a data class
fun Product.isExpensive(): Boolean = price > 500.0

// Usage:
println("racecar".isPalindrome())  // true
println("hello".isPalindrome())    // false
println(1299.0.toCurrency())       // $1299.00
println(1299.0.toCurrency("£"))    // £1299.00

val laptop = Product(1, "Laptop", 1299.0, "Electronics")
println(laptop.isExpensive())      // true
\`\`\`

---

### The when Expression

\`\`\`kotlin
// Replaces switch — cleaner, returns a value
fun classify(n: Int): String = when {
    n < 0    -> "negative"
    n == 0   -> "zero"
    n < 10   -> "small"
    n < 100  -> "medium"
    else     -> "large"
}

// Match against specific values:
fun dayType(day: String): String = when (day) {
    "Saturday", "Sunday" -> "weekend"
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> "weekday"
    else -> "unknown"
}

// Match types (smart cast):
fun describe(obj: Any): String = when (obj) {
    is String -> "String of length \${obj.length}"  // obj is auto-cast to String
    is Int    -> "Integer: \$obj"
    is Double -> "Double: \${"%.2f".format(obj)}"
    is List<*> -> "List with \${obj.size} elements"
    else      -> "Unknown: \${obj::class.simpleName}"
}
\`\`\`

---

### Scope Functions

\`\`\`kotlin
// apply — configures an object and returns it (builder pattern)
data class Config(var host: String = "", var port: Int = 8080, var debug: Boolean = false)

val config = Config().apply {
    host  = "api.jsupremetech.online"
    port  = 443
    debug = false
}

// let — transform a nullable value
val message: String? = "  Hello, World!  "
val processed = message?.let { it.trim().uppercase() }  // "HELLO, WORLD!"

// also — perform side effect, return original object
val numbers = mutableListOf(3, 1, 4, 1, 5)
    .also { println("Original: $it") }
    .apply { sort() }
    .also { println("Sorted: $it") }
\`\`\`

---

### Higher-Order Functions and Lambdas

\`\`\`kotlin
val products = listOf(
    Product(1, "Laptop",  1299.0, "Electronics"),
    Product(2, "Desk",     450.0, "Furniture"),
    Product(3, "Monitor",  599.0, "Electronics"),
)

// Kotlin collections mirror Java Streams but with simpler syntax:
val electronicNames = products
    .filter { it.category == "Electronics" }
    .sortedByDescending { it.price }
    .map { it.name }

println(electronicNames)  // [Laptop, Monitor]

val avgPrice = products.map { it.price }.average()
println("Avg: \${"%.2f".format(avgPrice)}")
\`\`\``,
    quiz: [
      { q: 'What is the difference between val and var in Kotlin?', options: ['val is public, var is private', 'val is immutable (cannot be reassigned), var is mutable', 'val is for value types, var is for reference types', 'They are identical — val is just a convention'], correct: 1, explanation: 'val declares an immutable reference (equivalent to Java\'s final). Once assigned, it cannot point to a different object. var is mutable and can be reassigned. Always prefer val — it communicates intent and prevents accidental mutation.' },
      { q: 'Given: var name: String? = null — what does name?.length return?', options: ['0', 'NullPointerException', 'null', 'Compile error'], correct: 2, explanation: 'The safe call operator (?.) returns null if the receiver is null instead of throwing an exception. name is null, so name?.length returns null. This is the foundation of Kotlin\'s null-safety system.' },
      { q: 'What does a data class auto-generate?', options: ['Only toString()', 'equals(), hashCode(), toString(), copy(), and componentN() functions', 'A singleton instance', 'A companion object with factory methods'], correct: 1, explanation: 'data class generates structural equality (equals/hashCode based on properties), a readable toString(), a copy() function for creating modified copies, and destructuring support via componentN(). This eliminates enormous amounts of Java boilerplate.' },
      { q: 'What is an extension function?', options: ['A function defined inside a class that extends another class', 'A function that adds behavior to an existing class without modifying its source code', 'An override of a parent class method', 'A Kotlin-specific annotation'], correct: 1, explanation: 'Extension functions are defined outside a class but called as if they were members of it. fun String.shout() = this.uppercase() + "!!" lets you call "hello".shout(). The original class is unchanged — extensions are resolved statically at compile time.' },
    ],
    ide: {
      language: 'java',
      task: 'Write Kotlin-style Java code: create a Product record, then use streams to (1) filter by Electronics, (2) find the most expensive product using max(), (3) compute average price. Print results. Note: we use Java records here as they mirror Kotlin data classes.',
      starterCode: `import java.util.*;
import java.util.stream.*;

public class KotlinStyle {
    // Java record = Kotlin data class equivalent
    record Product(int id, String name, double price, String category) {}

    public static void main(String[] args) {
        var products = List.of(
            new Product(1, "Laptop",  1299.0, "Electronics"),
            new Product(2, "Desk",     450.0, "Furniture"),
            new Product(3, "Monitor",  599.0, "Electronics"),
            new Product(4, "Chair",    299.0, "Furniture"),
            new Product(5, "Phone",    799.0, "Electronics")
        );

        // TODO 1: filter Electronics, sort by price desc, print names
        System.out.println("Electronics by price:");
        // ...

        // TODO 2: most expensive product (use .max())
        // Optional<Product> mostExpensive = ...
        // System.out.println("Most expensive: " + mostExpensive.get().name());

        // TODO 3: average price
        // double avg = ...
        // System.out.printf("Average price: $%.2f%n", avg);
    }
}`,
      solution: `import java.util.*;
import java.util.stream.*;

public class KotlinStyle {
    record Product(int id, String name, double price, String category) {}

    public static void main(String[] args) {
        var products = List.of(
            new Product(1, "Laptop",  1299.0, "Electronics"),
            new Product(2, "Desk",     450.0, "Furniture"),
            new Product(3, "Monitor",  599.0, "Electronics"),
            new Product(4, "Chair",    299.0, "Furniture"),
            new Product(5, "Phone",    799.0, "Electronics")
        );

        System.out.println("Electronics by price:");
        products.stream()
            .filter(p -> p.category().equals("Electronics"))
            .sorted((a, b) -> Double.compare(b.price(), a.price()))
            .map(Product::name)
            .forEach(name -> System.out.println("  " + name));

        Optional<Product> mostExpensive = products.stream()
            .max(Comparator.comparingDouble(Product::price));
        mostExpensive.ifPresent(p ->
            System.out.println("Most expensive: " + p.name() + " ($" + p.price() + ")"));

        double avg = products.stream()
            .mapToDouble(Product::price)
            .average()
            .orElse(0.0);
        System.out.printf("Average price: $%.2f%n", avg);
    }
}`,
      hints: [
        'For most expensive: .max(Comparator.comparingDouble(Product::price)) returns an Optional<Product>.',
        'Use .ifPresent() to safely handle the Optional.',
        'var (Java 10+) infers the list type — same idea as Kotlin\'s val.',
      ],
    },
  },
  {
    id: 'cc-java-m08', track: 'crash', title: 'Capstone: OOP Contact Manager with Full CRUD',
    subtitle: 'Build a complete in-memory contact manager with add/find/update/delete, sorting, searching, and file persistence — applying every concept from this course.',
    moduleObjective: 'Design and implement a Contact class hierarchy, a ContactBook with full CRUD, search/filter with Streams, sort by multiple fields, serialize to/from JSON-style text, and test edge cases.',
    courseObjective: CC_JAVA_OBJ, crashId: 'cc-java', crashTitle: 'Java / Kotlin', level: 'PhD',
    xp: 200, duration: 25, module: 8, certArea: 'Java / Kotlin Crash Course',
    keyTerms: [
      { term: 'CRUD', definition: 'Create, Read, Update, Delete — the four fundamental data operations. Every persistent system implements these.' },
      { term: 'UUID', definition: 'Universally Unique Identifier — a 128-bit identifier that is statistically guaranteed unique. Java: UUID.randomUUID().toString()' },
      { term: 'Optional<T>', definition: 'A container that may or may not hold a value. Avoids null returns. .isPresent(), .get(), .orElse(), .ifPresent() are the key methods.' },
      { term: 'Comparator', definition: 'Defines custom ordering for objects. Comparator.comparing(Contact::lastName).thenComparing(Contact::firstName) chains comparisons.' },
      { term: 'Record', definition: 'Java 16+ immutable data class with auto-generated constructor, accessors, equals, hashCode, toString. Perfect for query results and DTOs.' },
      { term: 'Defensive Copy', definition: 'Returning a copy of an internal collection instead of the original, preventing external code from mutating the internal state.' },
    ],
    content: `## Capstone: OOP Contact Manager with Full CRUD

### Architecture Overview

\`\`\`
Contact (abstract)
├── PersonContact (firstName, lastName, phone, email)
└── BusinessContact (companyName, contactPerson, phone, email)

ContactBook
├── add(Contact)
├── findById(String) → Optional<Contact>
├── findByName(String) → List<Contact>
├── update(String id, Contact updated)
├── delete(String id) → boolean
├── listAll() → List<Contact>
├── listSorted(Comparator) → List<Contact>
└── exportToString() / importFromString()
\`\`\`

---

### The Contact Hierarchy

\`\`\`java
import java.time.LocalDateTime;
import java.util.UUID;

public abstract class Contact {
    protected final String id;
    protected String phone;
    protected String email;
    protected final LocalDateTime createdAt;

    protected Contact(String phone, String email) {
        this.id        = UUID.randomUUID().toString().substring(0, 8);
        this.phone     = phone;
        this.email     = email;
        this.createdAt = LocalDateTime.now();
    }

    // For reconstruction from storage (known id)
    protected Contact(String id, String phone, String email) {
        this.id        = id;
        this.phone     = phone;
        this.email     = email;
        this.createdAt = LocalDateTime.now();
    }

    public String getId()    { return id; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }

    public void setPhone(String phone) {
        if (phone == null || phone.isBlank())
            throw new IllegalArgumentException("Phone cannot be blank");
        this.phone = phone;
    }

    public void setEmail(String email) { this.email = email; }

    public abstract String getDisplayName();
    public abstract String serialize();  // for file export

    @Override
    public String toString() {
        return String.format("[%s] %s | %s | %s",
            id, getDisplayName(), phone, email != null ? email : "no email");
    }
}

public class PersonContact extends Contact {
    private String firstName;
    private String lastName;

    public PersonContact(String firstName, String lastName, String phone, String email) {
        super(phone, email);
        this.firstName = firstName.trim();
        this.lastName  = lastName.trim();
    }

    @Override public String getDisplayName() { return firstName + " " + lastName; }
    public String getFirstName() { return firstName; }
    public String getLastName()  { return lastName; }

    public void setFirstName(String fn) { this.firstName = fn.trim(); }
    public void setLastName(String ln)  { this.lastName  = ln.trim(); }

    @Override
    public String serialize() {
        return String.join("|", "PERSON", id, firstName, lastName,
            phone, email != null ? email : "");
    }
}

public class BusinessContact extends Contact {
    private String companyName;
    private String contactPerson;

    public BusinessContact(String companyName, String contactPerson, String phone, String email) {
        super(phone, email);
        this.companyName   = companyName.trim();
        this.contactPerson = contactPerson.trim();
    }

    @Override public String getDisplayName() { return companyName + " (" + contactPerson + ")"; }
    public String getCompanyName()   { return companyName; }
    public String getContactPerson() { return contactPerson; }

    @Override
    public String serialize() {
        return String.join("|", "BUSINESS", id, companyName, contactPerson,
            phone, email != null ? email : "");
    }
}
\`\`\`

---

### ContactBook: Full CRUD Implementation

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class ContactBook {
    private final Map<String, Contact> contacts = new LinkedHashMap<>();

    // CREATE
    public void add(Contact c) {
        if (contacts.containsKey(c.getId()))
            throw new IllegalStateException("Contact id already exists: " + c.getId());
        contacts.put(c.getId(), c);
    }

    // READ — single
    public Optional<Contact> findById(String id) {
        return Optional.ofNullable(contacts.get(id));
    }

    // READ — search by name (case-insensitive)
    public List<Contact> findByName(String query) {
        String q = query.toLowerCase();
        return contacts.values().stream()
            .filter(c -> c.getDisplayName().toLowerCase().contains(q))
            .collect(Collectors.toList());
    }

    // READ — all contacts (defensive copy)
    public List<Contact> listAll() {
        return new ArrayList<>(contacts.values());
    }

    // READ — sorted
    public List<Contact> listSorted(Comparator<Contact> comparator) {
        return contacts.values().stream()
            .sorted(comparator)
            .collect(Collectors.toList());
    }

    // UPDATE
    public boolean update(String id, String phone, String email) {
        Contact c = contacts.get(id);
        if (c == null) return false;
        if (phone != null && !phone.isBlank()) c.setPhone(phone);
        if (email != null) c.setEmail(email);
        return true;
    }

    // DELETE
    public boolean delete(String id) {
        return contacts.remove(id) != null;
    }

    public int size() { return contacts.size(); }

    // EXPORT — pipe-delimited text
    public String exportToString() {
        return contacts.values().stream()
            .map(Contact::serialize)
            .collect(Collectors.joining("\\n"));
    }

    // STATISTICS
    public record Stats(int total, int persons, int businesses) {}

    public Stats getStats() {
        long persons = contacts.values().stream()
            .filter(c -> c instanceof PersonContact).count();
        return new Stats(contacts.size(), (int) persons,
            (int)(contacts.size() - persons));
    }
}
\`\`\`

---

### Main Program: Putting It All Together

\`\`\`java
public class Main {
    public static void main(String[] args) {
        ContactBook book = new ContactBook();

        // Add contacts
        book.add(new PersonContact("Jordan",  "Morris",   "876-555-0100", "jordan@jst.com"));
        book.add(new PersonContact("Alice",   "Johnson",  "876-555-0101", "alice@email.com"));
        book.add(new PersonContact("Bob",     "Smith",    "876-555-0102", null));
        book.add(new BusinessContact("J Supreme Tech", "Jordan Morris", "876-555-0103", "info@jst.com"));
        book.add(new BusinessContact("Solid Trust",    "Owen Ferguson", "876-555-0104", "info@st.com"));

        System.out.println("All contacts (" + book.size() + "):");
        book.listAll().forEach(System.out::println);

        System.out.println("\\n--- Search 'jordan' ---");
        book.findByName("jordan").forEach(System.out::println);

        System.out.println("\\n--- Sorted by display name ---");
        book.listSorted(Comparator.comparing(Contact::getDisplayName))
            .forEach(System.out::println);

        System.out.println("\\n--- Stats ---");
        var stats = book.getStats();
        System.out.printf("Total: %d | Persons: %d | Businesses: %d%n",
            stats.total(), stats.persons(), stats.businesses());

        System.out.println("\\n--- Export ---");
        System.out.println(book.exportToString());
    }
}
\`\`\``,
    quiz: [
      { q: 'Why does listAll() return new ArrayList<>(contacts.values()) instead of contacts.values() directly?', options: ['For performance', 'To prevent external code from modifying the internal map by mutating the returned collection (defensive copy)', 'Because Map.values() cannot be returned directly', 'To sort the results'], correct: 1, explanation: 'contacts.values() returns a live view backed by the map. If external code called .remove() or .add() on it, the internal map would be modified, breaking encapsulation. A defensive copy (new ArrayList<>(...)) is an independent collection — safe to return.' },
      { q: 'What does Optional.ofNullable(contacts.get(id)) return when id is not in the map?', options: ['null', 'An empty Optional', 'An IllegalArgumentException', 'Optional.empty() wrapped in null'], correct: 1, explanation: 'Optional.ofNullable(null) returns Optional.empty() — a non-null empty Optional. Callers can check .isPresent(), use .orElse(), or call .ifPresent() — no null checks or NPE risk.' },
      { q: 'What Java feature generates equals(), hashCode(), toString() and compact constructors automatically for immutable classes?', options: ['abstract class', 'interface', 'record', 'enum'], correct: 2, explanation: 'Records (Java 16+) are immutable data carriers. record Stats(int total, int persons, int businesses) {} auto-generates all accessor methods, equals(), hashCode(), and toString(). Equivalent to Kotlin data classes.' },
      { q: 'How does Comparator.comparing(Contact::getDisplayName).thenComparing(Contact::getId) sort contacts?', options: ['By id first, then display name', 'By display name first; ties broken by id', 'Randomly, since Comparators are not deterministic', 'It causes a compile error'], correct: 1, explanation: 'Comparator chains sort by the first criterion, then use subsequent comparators only to break ties. This means: sort by display name alphabetically; if two contacts have identical display names, sort those ties by id.' },
    ],
    ide: {
      language: 'java',
      task: 'Complete the ContactBook implementation. Implement: (1) findByPhone(String phone) returning Optional<Contact>, (2) listPersons() returning only PersonContacts sorted by lastName then firstName, (3) countByType() returning a Map<String, Long> with "PERSON" and "BUSINESS" counts. Test all three in main.',
      starterCode: `import java.util.*;
import java.util.stream.*;

public class ContactBookCapstone {

    abstract static class Contact {
        protected final String id;
        protected String phone;
        protected String email;
        protected Contact(String id, String phone, String email) {
            this.id = id; this.phone = phone; this.email = email;
        }
        public String getId()    { return id; }
        public String getPhone() { return phone; }
        public abstract String getDisplayName();
        public abstract String getType();
    }

    static class PersonContact extends Contact {
        private String firstName, lastName;
        public PersonContact(String id, String fn, String ln, String phone, String email) {
            super(id, phone, email);
            this.firstName = fn; this.lastName = ln;
        }
        public String getFirstName() { return firstName; }
        public String getLastName()  { return lastName; }
        @Override public String getDisplayName() { return firstName + " " + lastName; }
        @Override public String getType() { return "PERSON"; }
        @Override public String toString() { return "[" + id + "] " + getDisplayName() + " " + phone; }
    }

    static class BusinessContact extends Contact {
        private String company;
        public BusinessContact(String id, String company, String phone, String email) {
            super(id, phone, email);
            this.company = company;
        }
        @Override public String getDisplayName() { return company; }
        @Override public String getType() { return "BUSINESS"; }
        @Override public String toString() { return "[" + id + "] " + company + " " + phone; }
    }

    static class ContactBook {
        private final Map<String, Contact> contacts = new LinkedHashMap<>();

        public void add(Contact c) { contacts.put(c.getId(), c); }

        // TODO 1: findByPhone — return Optional<Contact>
        public Optional<Contact> findByPhone(String phone) {
            return Optional.empty(); // implement with stream filter
        }

        // TODO 2: listPersons — return List<PersonContact> sorted by lastName then firstName
        public List<PersonContact> listPersons() {
            return List.of(); // filter instanceof PersonContact, cast, sort
        }

        // TODO 3: countByType — Map<String, Long> with "PERSON" and "BUSINESS" counts
        public Map<String, Long> countByType() {
            return Map.of(); // use Collectors.groupingBy(Contact::getType, Collectors.counting())
        }
    }

    public static void main(String[] args) {
        ContactBook book = new ContactBook();
        book.add(new PersonContact("p1", "Jordan", "Morris", "876-100", "j@jst.com"));
        book.add(new PersonContact("p2", "Alice",  "Smith",  "876-101", null));
        book.add(new PersonContact("p3", "Bob",    "Smith",  "876-102", null));
        book.add(new BusinessContact("b1", "J Supreme Tech", "876-103", "info@jst.com"));
        book.add(new BusinessContact("b2", "Solid Trust",    "876-104", null));

        System.out.println("Find by phone 876-101: " +
            book.findByPhone("876-101").map(Contact::getDisplayName).orElse("Not found"));

        System.out.println("Persons sorted:");
        book.listPersons().forEach(p ->
            System.out.println("  " + p.getLastName() + ", " + p.getFirstName()));

        System.out.println("Counts: " + book.countByType());
    }
}`,
      solution: `import java.util.*;
import java.util.stream.*;

public class ContactBookCapstone {

    abstract static class Contact {
        protected final String id;
        protected String phone;
        protected String email;
        protected Contact(String id, String phone, String email) {
            this.id = id; this.phone = phone; this.email = email;
        }
        public String getId()    { return id; }
        public String getPhone() { return phone; }
        public abstract String getDisplayName();
        public abstract String getType();
    }

    static class PersonContact extends Contact {
        private String firstName, lastName;
        public PersonContact(String id, String fn, String ln, String phone, String email) {
            super(id, phone, email);
            this.firstName = fn; this.lastName = ln;
        }
        public String getFirstName() { return firstName; }
        public String getLastName()  { return lastName; }
        @Override public String getDisplayName() { return firstName + " " + lastName; }
        @Override public String getType() { return "PERSON"; }
        @Override public String toString() { return "[" + id + "] " + getDisplayName() + " " + phone; }
    }

    static class BusinessContact extends Contact {
        private String company;
        public BusinessContact(String id, String company, String phone, String email) {
            super(id, phone, email);
            this.company = company;
        }
        @Override public String getDisplayName() { return company; }
        @Override public String getType() { return "BUSINESS"; }
        @Override public String toString() { return "[" + id + "] " + company + " " + phone; }
    }

    static class ContactBook {
        private final Map<String, Contact> contacts = new LinkedHashMap<>();

        public void add(Contact c) { contacts.put(c.getId(), c); }

        public Optional<Contact> findByPhone(String phone) {
            return contacts.values().stream()
                .filter(c -> phone.equals(c.getPhone()))
                .findFirst();
        }

        public List<PersonContact> listPersons() {
            return contacts.values().stream()
                .filter(c -> c instanceof PersonContact)
                .map(c -> (PersonContact) c)
                .sorted(Comparator.comparing(PersonContact::getLastName)
                    .thenComparing(PersonContact::getFirstName))
                .collect(Collectors.toList());
        }

        public Map<String, Long> countByType() {
            return contacts.values().stream()
                .collect(Collectors.groupingBy(Contact::getType, Collectors.counting()));
        }
    }

    public static void main(String[] args) {
        ContactBook book = new ContactBook();
        book.add(new PersonContact("p1", "Jordan", "Morris", "876-100", "j@jst.com"));
        book.add(new PersonContact("p2", "Alice",  "Smith",  "876-101", null));
        book.add(new PersonContact("p3", "Bob",    "Smith",  "876-102", null));
        book.add(new BusinessContact("b1", "J Supreme Tech", "876-103", "info@jst.com"));
        book.add(new BusinessContact("b2", "Solid Trust",    "876-104", null));

        System.out.println("Find by phone 876-101: " +
            book.findByPhone("876-101").map(Contact::getDisplayName).orElse("Not found"));

        System.out.println("Persons sorted:");
        book.listPersons().forEach(p ->
            System.out.println("  " + p.getLastName() + ", " + p.getFirstName()));

        System.out.println("Counts: " + book.countByType());
    }
}`,
      hints: [
        'findByPhone: .filter(c -> phone.equals(c.getPhone())).findFirst() — returns Optional.',
        'listPersons: filter c instanceof PersonContact, then .map(c -> (PersonContact) c) to cast.',
        'countByType: .collect(Collectors.groupingBy(Contact::getType, Collectors.counting()))',
      ],
    },
  },
]
