import type { Course } from '../courses'

const CC_R_OBJ = 'Go from zero to fully functional data analyst in R — clean data, visualize distributions, run statistical tests, and build a reproducible EDA pipeline.'

export const crashRCourses: Course[] = [
  {
    id: 'cc-r-m01', track: 'crash', title: 'RStudio Setup, R Basics & Hello World',
    subtitle: 'Install R and RStudio, understand the REPL and script execution model, and write your first data-aware R script.',
    moduleObjective: 'Install R 4.3+ and RStudio, use the console and script editor, perform arithmetic and string operations, understand R\'s basic data types, and run your first complete R script.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'Basic',
    xp: 155, duration: 12, module: 1, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'R', definition: 'A statistical programming language and environment for data analysis, visualization, and machine learning. Open-source, with CRAN providing 20,000+ packages.' },
      { term: 'RStudio', definition: 'The most popular IDE for R. Features: console, script editor, environment pane (shows all variables), plots pane, and package manager.' },
      { term: 'CRAN', definition: 'Comprehensive R Archive Network — R\'s package repository. install.packages("dplyr") downloads from CRAN.' },
      { term: 'Assignment operator', definition: 'R uses <- for assignment: x <- 42. The = operator also works in most contexts, but <- is the convention.' },
      { term: 'Vector', definition: 'R\'s fundamental data structure — a sequence of values of the same type. c(1, 2, 3) creates a numeric vector. Almost all R operations work on vectors automatically.' },
      { term: 'Vectorization', definition: 'R applies operations to every element of a vector without explicit loops. x * 2 doubles every element of vector x simultaneously.' },
    ],
    content: `## RStudio Setup, R Basics & Hello World

### Why R?

R is the language of choice for statisticians, data scientists, and researchers worldwide. Unlike Python's general-purpose approach, R was built specifically for data analysis — statistics, visualization, and reproducible research are first-class citizens.

Key strengths:
- **Best-in-class visualization**: ggplot2 produces publication-quality graphics
- **Statistical depth**: thousands of statistical tests built in, with packages for every specialized method
- **Data frames**: tabular data handling is native, not an afterthought
- **Reproducibility**: R Markdown and Quarto combine code + narrative + output in one document

R is used at Google, Facebook, Airbnb, the FDA, and in every major academic journal for data analysis.

---

### Installing R and RStudio

**Step 1: Install R (the language)**
1. Go to https://cran.r-project.org
2. Click your OS: Windows, macOS, or Linux
3. Download and run the installer
4. Verify: open a terminal and run \`R --version\`

**Step 2: Install RStudio (the IDE)**
1. Go to https://posit.co/download/rstudio-desktop/
2. Download RStudio Desktop (Free)
3. Install and open it

**The RStudio Layout:**
- **Console** (bottom-left): interactive R session — type code, see results
- **Script Editor** (top-left): write and save .R files
- **Environment** (top-right): all variables in memory
- **Plots/Files/Packages** (bottom-right): view charts, install packages

---

### Running Code Two Ways

**Interactive console** — type directly, press Enter:
\`\`\`r
> 2 + 2
[1] 4
> "Hello, World!"
[1] "Hello, World!"
\`\`\`

The \`[1]\` means the first element of the result vector.

**Script file** — write a .R file, click Run or Source:
\`\`\`r
# This is a comment in R
x <- 10        # assign 10 to x
y <- 3         # assign 3 to y
z <- x + y     # z = 13

cat("Sum:", z, "\\n")  # cat() for formatted output (no newline by default)
print(z)              # print() outputs with [1]
message("Done!")      # message() writes to stderr
\`\`\`

---

### Basic Data Types

\`\`\`r
# Numeric (double by default)
x <- 42.5
class(x)     # "numeric"
typeof(x)    # "double"

# Integer (append L)
n <- 10L
class(n)     # "integer"

# Character (strings)
name <- "Jordan"
class(name)  # "character"

# Logical
is_active <- TRUE
class(is_active)  # "logical"
# TRUE/FALSE (uppercase) or T/F (shorthand)

# Complex
z <- 3 + 2i
class(z)  # "complex"

# NULL — absence of value
nothing <- NULL
is.null(nothing)  # TRUE

# NA — missing value (different from NULL!)
missing_val <- NA
is.na(missing_val)  # TRUE
\`\`\`

---

### Arithmetic and String Operations

\`\`\`r
# Arithmetic
10 + 3   # 13
10 - 3   # 7
10 * 3   # 30
10 / 3   # 3.333...
10 %% 3  # 1   (modulo)
10 %/% 3 # 3   (integer division)
2 ^ 10   # 1024 (exponentiation — use ^ not **)
sqrt(144) # 12
abs(-5)   # 5

# String operations
name <- "Jordan Morris"
nchar(name)              # 13
toupper(name)            # "JORDAN MORRIS"
tolower(name)            # "jordan morris"
substr(name, 1, 6)       # "Jordan" (1-indexed!)
gsub("Jordan", "Alice", name)  # "Alice Morris"
paste("Hello", "World")        # "Hello World" (space sep)
paste0("Hello", "World")       # "HelloWorld" (no sep)
sprintf("Score: %.1f%%", 87.5) # "Score: 87.5%"
\`\`\`

---

### Your First Complete R Script

\`\`\`r
# Temperature Analysis Script
# Run this with: source("temperature.R")

temps_c <- c(22, 18, 25, 30, 15, 28, 21)  # Celsius readings
n <- length(temps_c)

# Vectorized conversion — applies to ALL elements at once
temps_f <- temps_c * 9/5 + 32

# Built-in statistics
cat("=== Temperature Analysis ===\\n")
cat(sprintf("Readings: %d\\n", n))
cat(sprintf("Celsius:     Mean=%.1f, SD=%.1f, Range=[%.1f, %.1f]\\n",
    mean(temps_c), sd(temps_c), min(temps_c), max(temps_c)))
cat(sprintf("Fahrenheit:  Mean=%.1f, SD=%.1f, Range=[%.1f, %.1f]\\n",
    mean(temps_f), sd(temps_f), min(temps_f), max(temps_f)))

# Which days were hot? (vectorized logical comparison)
hot_days <- which(temps_c > 25)  # indices where temp > 25
cat(sprintf("Hot days (>25C): %s\\n", paste(hot_days, collapse=", ")))

# Summary
summary(temps_c)
\`\`\`

**Key insight**: \`temps_c * 9/5 + 32\` converts ALL 7 temperatures at once — no loop needed. This is R's vectorization in action.`,
    quiz: [
      { q: 'What does [1] at the start of R output indicate?', options: ['An error code', 'The index of the first element shown on that line', 'A logical TRUE value', 'The R version number'], correct: 1, explanation: 'R always displays the index of the first element on each output line. [1] means the first element of the result starts here. For a long vector that spans multiple lines, you\'d see [1], [17], [33], etc. — telling you where in the vector each line begins.' },
      { q: 'What is the difference between NA and NULL in R?', options: ['They are identical', 'NA represents a missing value within a data structure; NULL represents the absence of a value entirely', 'NULL is for numbers; NA is for strings', 'NA crashes programs; NULL does not'], correct: 1, explanation: 'NA (Not Available) is a placeholder for a missing value — a vector can contain NAs alongside real values: c(1, NA, 3). NULL represents nothing — it has zero length and no type. is.na(c(1, NA, 3)) returns [FALSE TRUE FALSE]. NULL is often used for optional function arguments.' },
      { q: 'What does c(1, 2, 3) * 2 return in R?', options: ['2 — only multiplies the first element', 'An error — c() does not support multiplication', 'c(2, 4, 6) — vectorization applies the operation to every element', '6 — sums first then multiplies'], correct: 2, explanation: 'R vectorizes arithmetic operations — * 2 is applied to every element of the vector. c(1,2,3) * 2 returns c(2,4,6). This eliminates the need for explicit loops in most calculations and makes R code much more concise than equivalent Python.' },
      { q: 'Which assignment operator is preferred by R convention?', options: ['=', '<-', ':=', '<<-'], correct: 1, explanation: '<- is the conventional R assignment operator. = works too, but <- makes the direction of assignment visually clear and is used in R style guides (Google, tidyverse). <<- is a different operator that assigns into the parent environment — used in specific cases like inside closures.' },
    ],
    ide: {
      language: 'r',
      task: 'Create a numeric vector of 8 exam scores. Compute: mean, median, standard deviation, and range. Then create a character vector of student names. Use paste0() to create a "Name: Score" string for each student using vectorization. Print all results.',
      starterCode: `# Exam score analysis

scores <- c(78, 92, 85, 61, 95, 73, 88, 79)
names_vec <- c("Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry")

# TODO: compute mean, median, sd, range
cat("Mean:", mean(scores), "\\n")
# cat("Median:", ...)
# cat("SD:", ...)
# cat("Range:", ..., "to", ..., "\\n")

# TODO: use paste0() to create "Name: Score" strings for each student
# hint: paste0(names_vec, ": ", scores) — vectorization
labels <- paste0("TODO", ": ", scores)
cat("Students:\\n")
cat(labels, sep="\\n")`,
      solution: `# Exam score analysis

scores <- c(78, 92, 85, 61, 95, 73, 88, 79)
names_vec <- c("Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry")

cat("Mean:", mean(scores), "\\n")
cat("Median:", median(scores), "\\n")
cat("SD:", round(sd(scores), 2), "\\n")
cat("Range:", min(scores), "to", max(scores), "\\n")

labels <- paste0(names_vec, ": ", scores)
cat("Students:\\n")
cat(labels, sep="\\n")`,
      hints: [
        'sd() computes standard deviation. round(sd(scores), 2) rounds to 2 decimal places.',
        'range() returns c(min, max). Or use min() and max() separately.',
        'paste0(names_vec, ": ", scores) is vectorized — it pairs each name with the corresponding score.',
      ],
    },
  },
  {
    id: 'cc-r-m02', track: 'crash', title: 'Vectors, Matrices & Data Frames',
    subtitle: 'Master R\'s core data structures — from atomic vectors to the data frame, the workhorse of data analysis.',
    moduleObjective: 'Create and subset vectors, matrices, and lists; build data frames from scratch and from named vectors; use $ and [] subsetting; understand recycling and type coercion.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'Basic',
    xp: 160, duration: 14, module: 2, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'Data Frame', definition: 'R\'s tabular data structure — a list of equal-length vectors. Each column can have a different type. The primary data structure for data analysis.' },
      { term: 'Factor', definition: 'A categorical variable with a fixed set of levels. factor(c("low","high","low","medium")). Levels are stored as integers with labels for efficiency.' },
      { term: 'Recycling', definition: 'When vectors have different lengths, R repeats the shorter one to match. c(1,2,3,4) + c(10,20) becomes c(11,22,13,24). Useful but can cause subtle bugs.' },
      { term: 'Subsetting', definition: 'Extracting elements: x[1:3] for positions, x[x > 5] for conditions, df$column for data frame columns, df[rows, cols] for 2D.' },
      { term: 'List', definition: 'A collection of heterogeneous elements — each element can be any type, including other lists. Access with [[i]] or $name.' },
      { term: 'str()', definition: 'Shows the structure of any R object — type, dimensions, and first few values. The most useful debugging function in R.' },
    ],
    content: `## Vectors, Matrices & Data Frames

### Vectors

\`\`\`r
# Creating vectors
x <- c(1, 2, 3, 4, 5)         # numeric
chars <- c("a", "b", "c")      # character
logic <- c(TRUE, FALSE, TRUE)  # logical
ints  <- 1:10                  # integer sequence

# Named vectors
scores <- c(Alice=95, Bob=88, Carol=72, David=91)
scores["Alice"]   # 95
scores[c("Bob", "Carol")]  # 88 72

# Vectorized operations
x * 2         # c(2, 4, 6, 8, 10)
x + c(10, 20) # c(11, 22, 13, 24, 15) — recycling
x > 3         # c(FALSE, FALSE, FALSE, TRUE, TRUE)

# Subsetting
x[2]           # 2  (1-indexed!)
x[2:4]         # c(2, 3, 4)
x[c(1, 3, 5)]  # c(1, 3, 5)
x[x > 3]       # c(4, 5) — logical subsetting
x[-1]          # c(2, 3, 4, 5) — exclude first
\`\`\`

---

### Useful Vector Functions

\`\`\`r
v <- c(3, 1, 4, 1, 5, 9, 2, 6, 5, 3)

length(v)       # 10
sum(v)          # 39
cumsum(v)       # running cumulative sum
diff(v)         # differences between consecutive elements
rev(v)          # reversed
sort(v)         # sorted ascending
order(v)        # indices that would sort v
unique(v)       # c(3, 1, 4, 5, 9, 2, 6) — deduplicated
table(v)        # frequency count of each value
which(v > 4)    # indices where condition is TRUE
any(v > 8)      # TRUE — any element > 8?
all(v > 0)      # TRUE — all elements > 0?
\`\`\`

---

### Matrices

\`\`\`r
# Create from vector
m <- matrix(1:12, nrow=3, ncol=4)
#      [,1] [,2] [,3] [,4]
# [1,]    1    4    7   10
# [2,]    2    5    8   11
# [3,]    3    6    9   12
# Filled column-by-column (col-major order)

# Dimensions
dim(m)    # c(3, 4)
nrow(m)   # 3
ncol(m)   # 4

# Subsetting [row, col]
m[1, ]    # first row: c(1, 4, 7, 10)
m[, 2]    # second column: c(4, 5, 6)
m[2, 3]   # element at row 2, col 3: 8

# Matrix arithmetic (element-wise)
m * 2     # doubles every element
m %*% t(m)  # matrix multiplication (with transpose)
apply(m, 1, sum)  # row sums: c(22, 26, 30)
apply(m, 2, sum)  # column sums: c(6, 15, 24, 33)
\`\`\`

---

### Lists

\`\`\`r
# Lists hold heterogeneous elements
person <- list(
    name  = "Jordan",
    age   = 28,
    scores = c(95, 88, 92),
    active = TRUE
)

# Access with $ or [[]]
person$name         # "Jordan"
person[["age"]]     # 28
person$scores[2]    # 88

str(person)  # shows structure of any object
# List of 4
#  $ name  : chr "Jordan"
#  $ age   : num 28
#  $ scores: num [1:3] 95 88 92
#  $ active: logi TRUE
\`\`\`

---

### Data Frames — The Core of R Analysis

\`\`\`r
# Create a data frame
students <- data.frame(
    name    = c("Alice", "Bob", "Carol", "David", "Emma"),
    age     = c(22, 25, 21, 23, 24),
    score   = c(92.5, 78.0, 95.5, 61.0, 88.5),
    passed  = c(TRUE, TRUE, TRUE, FALSE, TRUE),
    grade   = factor(c("A", "C", "A", "F", "B")),
    stringsAsFactors = FALSE
)

# Dimensions and structure
dim(students)   # c(5, 5)
str(students)   # shows types and preview
head(students)  # first 6 rows (or n rows with head(df, n))
tail(students)  # last 6 rows
summary(students)  # statistical summary per column

# Column access
students$name    # character vector of names
students[["score"]]  # same as $score

# Row and column subsetting [rows, cols]
students[1, ]           # first row (all cols)
students[, "score"]     # score column
students[1:3, c("name", "score")]  # rows 1–3, two columns

# Conditional subsetting
students[students$score >= 85, ]
students[students$grade == "A", "name"]

# Adding a column
students$letter_grade <- ifelse(students$score >= 90, "A",
                         ifelse(students$score >= 80, "B",
                         ifelse(students$score >= 70, "C", "F")))

# nrow, ncol
nrow(students)  # 5
ncol(students)  # 6 (after adding letter_grade)
\`\`\`

---

### Factors

\`\`\`r
sizes <- factor(c("S", "L", "M", "S", "XL", "M"),
                levels = c("S", "M", "L", "XL"))  # ordered levels

levels(sizes)  # "S" "M" "L" "XL"
table(sizes)   # frequency count by level
as.integer(sizes)  # numeric codes: 1 2 2 1 4 2

# Ordered factor for statistics
rating <- factor(c("low", "high", "medium", "low"),
                 levels = c("low", "medium", "high"),
                 ordered = TRUE)
rating[1] < rating[2]  # TRUE — "low" < "high"
\`\`\``,
    quiz: [
      { q: 'In R, what does x[x > 5] return for x <- c(3, 7, 2, 9, 1, 6)?', options: ['The count of elements > 5', 'A vector of the elements that are > 5: c(7, 9, 6)', 'The indices where elements > 5', 'An error — conditional subsetting is not valid'], correct: 1, explanation: 'Logical subsetting: x > 5 creates c(FALSE, TRUE, FALSE, TRUE, FALSE, TRUE). Using this logical vector inside [] returns only the elements where the condition is TRUE: c(7, 9, 6). This is one of R\'s most powerful features for filtering.' },
      { q: 'What is vector recycling in R?', options: ['Garbage collection of unused vectors', 'When R reuses (repeats) a shorter vector to match the length of a longer one in an operation', 'Moving a vector from memory to disk', 'Converting a vector to a list'], correct: 1, explanation: 'c(1,2,3,4) + c(10,20) recycles c(10,20) to c(10,20,10,20), giving c(11,22,13,24). Recycling is convenient but dangerous if the longer length is not a multiple of the shorter — R issues a warning.' },
      { q: 'How do you access the "score" column of a data frame df?', options: ['df.score', 'df["score"]', 'df$score (or df[["score"]])', 'df->score'], correct: 2, explanation: 'df$score is the idiomatic R way. It returns the vector of score values. df[["score"]] is equivalent. df["score"] returns a single-column data frame (not a vector) — this distinction matters for many functions.' },
      { q: 'What does the str() function do?', options: ['Converts an object to a string', 'Shows the structure, type, and first values of any R object — the best debugging tool', 'Measures the length of a string', 'Strips whitespace from strings'], correct: 1, explanation: 'str() (structure) prints a compact display of any object\'s type, dimensions, and first few values. str(df) for a data frame shows column types and sample values. It\'s the first function to call when you don\'t know what an object looks like.' },
    ],
    ide: {
      language: 'r',
      task: 'Create a data frame with 5 products: name, price, category (Electronics/Furniture), and quantity. (1) Subset to show only Electronics. (2) Add a total_value column (price * quantity). (3) Find the product with the highest total_value. (4) Compute average price by category.',
      starterCode: `# Product inventory analysis

products <- data.frame(
  name     = c("Laptop", "Desk", "Phone", "Chair", "Monitor"),
  price    = c(1299, 450, 799, 299, 599),
  category = c("Electronics", "Furniture", "Electronics", "Furniture", "Electronics"),
  quantity = c(5, 8, 12, 15, 7),
  stringsAsFactors = FALSE
)

# TODO 1: subset Electronics only
electronics <- products  # fix this

# TODO 2: add total_value column
# products$total_value <- ...

# TODO 3: product with highest total_value
# hint: which.max()

# TODO 4: average price by category
# hint: tapply(products$price, products$category, mean)

print(products)`,
      solution: `# Product inventory analysis

products <- data.frame(
  name     = c("Laptop", "Desk", "Phone", "Chair", "Monitor"),
  price    = c(1299, 450, 799, 299, 599),
  category = c("Electronics", "Furniture", "Electronics", "Furniture", "Electronics"),
  quantity = c(5, 8, 12, 15, 7),
  stringsAsFactors = FALSE
)

# 1: subset Electronics
electronics <- products[products$category == "Electronics", ]
cat("Electronics:\\n")
print(electronics)

# 2: total_value column
products$total_value <- products$price * products$quantity

# 3: most valuable product
top_idx <- which.max(products$total_value)
cat("\\nHighest total value:", products$name[top_idx],
    "($", products$total_value[top_idx], ")\\n")

# 4: average price by category
avg_price <- tapply(products$price, products$category, mean)
cat("\\nAverage price by category:\\n")
print(avg_price)`,
      hints: [
        'Subset: products[products$category == "Electronics", ]',
        'total_value: products$total_value <- products$price * products$quantity',
        'tapply(vector, groups, function) applies a function by group — great for group summaries.',
      ],
    },
  },
  {
    id: 'cc-r-m03', track: 'crash', title: 'Control Flow & Functions',
    subtitle: 'Write if/else, for and while loops in R, and build reusable functions with default arguments, return values, and proper documentation.',
    moduleObjective: 'Use if/else/ifelse(), for and while loops, write named R functions with default parameters and return values, understand R\'s functional idioms (lapply, sapply, Map), and avoid loops when vectorization works.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'Masters',
    xp: 170, duration: 16, module: 3, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'ifelse()', definition: 'Vectorized if/else: ifelse(x > 0, "positive", "non-positive"). Applies element-wise to a vector. Different from the scalar if() statement.' },
      { term: 'lapply / sapply', definition: 'Apply a function to each element of a list or vector. lapply returns a list; sapply simplifies to a vector or matrix when possible.' },
      { term: 'Function environment', definition: 'R functions are closures — they capture their definition environment. Variables inside a function are local; external variables are looked up in the enclosing scope.' },
      { term: 'return()', definition: 'Explicit return from a function. R also implicitly returns the last evaluated expression, so return() is often omitted.' },
      { term: 'Ellipsis (...)', definition: 'Passes unknown arguments to inner functions. function(x, ...) { plot(x, ...) } lets callers pass any plot() argument.' },
      { term: 'stop() / warning()', definition: 'stop() raises a fatal error with a message. warning() issues a non-fatal warning. tryCatch() handles errors programmatically.' },
    ],
    content: `## Control Flow & Functions

### if / else

\`\`\`r
# Scalar if (single TRUE/FALSE)
x <- 15

if (x > 10) {
  cat("Greater than 10\\n")
} else if (x == 10) {
  cat("Equal to 10\\n")
} else {
  cat("Less than 10\\n")
}

# Compact form (single expressions)
result <- if (x > 0) "positive" else "non-positive"

# ifelse() — vectorized (processes every element)
scores <- c(92, 78, 85, 61, 95)
grades <- ifelse(scores >= 90, "A",
          ifelse(scores >= 80, "B",
          ifelse(scores >= 70, "C", "F")))
print(grades)  # "A" "C" "B" "F" "A"
\`\`\`

---

### Loops

\`\`\`r
# for loop
fruits <- c("apple", "banana", "cherry")
for (fruit in fruits) {
  cat(toupper(fruit), "\\n")
}

# for with index
for (i in 1:5) {
  cat(sprintf("Item %d: %.2f\\n", i, i^2))
}

# while loop
n <- 1
while (n < 100) {
  n <- n * 2
}
cat("First power of 2 >= 100:", n, "\\n")  # 128

# next (continue) and break
for (i in 1:10) {
  if (i %% 2 == 0) next   # skip even numbers
  if (i > 7) break         # stop when i > 7
  cat(i, "")
}
# Output: 1 3 5 7
\`\`\`

**Important:** R loops are slow. Prefer vectorized operations for data processing — use loops only for truly sequential logic.

---

### Functions

\`\`\`r
# Basic function
square <- function(x) {
  x ^ 2  # implicit return — last expression is returned
}

square(5)   # 25
square(1:5) # c(1, 4, 9, 16, 25) — vectorized automatically

# Default arguments
greet <- function(name, greeting = "Hello", punctuation = "!") {
  paste0(greeting, ", ", name, punctuation)
}

greet("Jordan")                     # "Hello, Jordan!"
greet("Alice", greeting = "Hi")     # "Hi, Alice!"
greet("Bob", punctuation = ".")     # "Hello, Bob."

# Multiple return values (use a list or named vector)
stats_summary <- function(x) {
  list(
    mean   = mean(x, na.rm = TRUE),
    median = median(x, na.rm = TRUE),
    sd     = sd(x, na.rm = TRUE),
    n      = sum(!is.na(x))
  )
}

result <- stats_summary(c(3, 7, NA, 2, 9, 1, 8))
cat("Mean:", result$mean, "\\n")
cat("Median:", result$median, "\\n")
cat("N (non-NA):", result$n, "\\n")
\`\`\`

---

### Input Validation and Error Handling

\`\`\`r
safe_divide <- function(a, b) {
  if (!is.numeric(a) || !is.numeric(b)) {
    stop("Both arguments must be numeric")  # fatal error
  }
  if (b == 0) {
    warning("Division by zero — returning Inf")
    return(Inf)
  }
  a / b
}

# tryCatch for error handling
result <- tryCatch({
  safe_divide(10, 0)
}, warning = function(w) {
  message("Warning caught: ", conditionMessage(w))
  NA  # return NA on warning
}, error = function(e) {
  message("Error: ", conditionMessage(e))
  NA
})
\`\`\`

---

### Functional Idioms: lapply, sapply, Map, Reduce

\`\`\`r
# lapply — apply function to list, returns list
nums <- list(a = 1:5, b = 6:10, c = 11:15)
lapply(nums, mean)  # list(a=3, b=8, c=13)

# sapply — simplify result to vector/matrix
sapply(nums, mean)   # named vector: a=3, b=8, c=13
sapply(nums, range)  # 2×3 matrix

# vapply — safer sapply with expected type
vapply(nums, mean, FUN.VALUE = numeric(1))  # guaranteed numeric vector

# Map — apply function to multiple vectors simultaneously
x <- c(1, 2, 3)
y <- c(10, 20, 30)
Map(function(a, b) a + b, x, y)  # list(11, 22, 33)
mapply(function(a, b) a + b, x, y)  # simplified: c(11, 22, 33)

# Reduce — fold a vector with a function
Reduce("+", 1:5)        # 15: ((((1+2)+3)+4)+5)
Reduce(max, c(3,1,4))   # 4

# Anonymous functions (R 4.1+: the \\ shorthand)
sapply(1:5, \\(x) x^2)   # c(1, 4, 9, 16, 25)
\`\`\``,
    quiz: [
      { q: 'What is the difference between if() and ifelse() in R?', options: ['They are identical', 'if() is for scalar conditions; ifelse() is vectorized and applies to every element of a vector', 'ifelse() is deprecated', 'if() works on data frames; ifelse() works on vectors'], correct: 1, explanation: 'if() evaluates a single TRUE/FALSE condition. ifelse(vector, yes, no) evaluates the condition for every element and returns a vector of results. ifelse(c(1,-2,3), "pos", "neg") returns c("pos","neg","pos").' },
      { q: 'In R, what does a function return if you omit an explicit return() call?', options: ['NULL', 'An error', 'The value of the last evaluated expression', 'TRUE'], correct: 2, explanation: 'R functions implicitly return the value of the last evaluated expression. function(x) { x^2 } returns x^2. This is idiomatic R — explicit return() is used mainly for early returns from nested logic, not at the end of every function.' },
      { q: 'What does sapply(list(1:3, 4:6), sum) return?', options: ['A list with two sum values', 'c(6, 15) — a simplified numeric vector', 'An error — sapply cannot sum vectors', 'A data frame'], correct: 1, explanation: 'sapply applies sum to each element and simplifies: sum(1:3)=6, sum(4:6)=15. Since both results are single numbers, sapply returns a numeric vector c(6, 15). lapply would return a list(6, 15).' },
      { q: 'Why should you generally avoid writing explicit for loops in R for data processing?', options: ['for loops are not available in R', 'R loops are slow because R is an interpreted language; vectorized operations and apply functions are much faster', 'for loops cannot handle vectors', 'R style guides discourage all loops'], correct: 1, explanation: 'R\'s for loops run in interpreted R — slow. Vectorized operations and the apply family delegate to optimized C/Fortran code. A loop over 1 million elements can take seconds; the vectorized equivalent takes milliseconds. Loop when logic is truly sequential; vectorize everything else.' },
    ],
    ide: {
      language: 'r',
      task: 'Write a function normalize(x, min_val = NULL, max_val = NULL) that scales a numeric vector to [0, 1] using min-max normalization: (x - min) / (max - min). If min_val and max_val are provided use those; otherwise compute from x. Handle the edge case where max == min. Test with a vector and with custom bounds.',
      starterCode: `# Min-max normalization function

normalize <- function(x, min_val = NULL, max_val = NULL) {
  # Use provided bounds or compute from x
  mn <- if (!is.null(min_val)) min_val else min(x, na.rm = TRUE)
  mx <- if (!is.null(max_val)) max_val else max(x, na.rm = TRUE)

  # TODO: handle mn == mx (all values same) — return vector of 0s
  if (mn == mx) {
    return(rep(0, length(x)))  # already done — see the pattern
  }

  # TODO: return (x - mn) / (mx - mn)
  return(x)  # fix this
}

# Tests
scores <- c(20, 50, 80, 100, 35)
cat("Normalized (auto bounds):", normalize(scores), "\\n")

cat("Normalized (0–100 bounds):", normalize(scores, min_val=0, max_val=100), "\\n")

# Edge case: all same
cat("All same:", normalize(c(5, 5, 5)), "\\n")

# Apply to multiple columns with sapply
df <- data.frame(a = c(1, 2, 3, 4, 5), b = c(10, 20, 30, 40, 50))
normalized_df <- as.data.frame(sapply(df, normalize))
print(normalized_df)`,
      solution: `normalize <- function(x, min_val = NULL, max_val = NULL) {
  mn <- if (!is.null(min_val)) min_val else min(x, na.rm = TRUE)
  mx <- if (!is.null(max_val)) max_val else max(x, na.rm = TRUE)

  if (mn == mx) {
    return(rep(0, length(x)))
  }

  (x - mn) / (mx - mn)
}

scores <- c(20, 50, 80, 100, 35)
cat("Normalized (auto bounds):", normalize(scores), "\\n")
cat("Normalized (0–100 bounds):", normalize(scores, min_val=0, max_val=100), "\\n")
cat("All same:", normalize(c(5, 5, 5)), "\\n")

df <- data.frame(a = c(1, 2, 3, 4, 5), b = c(10, 20, 30, 40, 50))
normalized_df <- as.data.frame(sapply(df, normalize))
print(normalized_df)`,
      hints: [
        'Formula: (x - mn) / (mx - mn). This is vectorized — applies to all elements of x at once.',
        'Default arguments: min_val = NULL. Check with is.null(min_val) inside the function.',
        'sapply(df, normalize) applies normalize to each column of the data frame.',
      ],
    },
  },
  {
    id: 'cc-r-m04', track: 'crash', title: 'Data Manipulation with dplyr',
    subtitle: 'Transform, filter, group, and summarize data frames using dplyr\'s grammar of data manipulation — the most important R package for analysis.',
    moduleObjective: 'Use filter(), select(), mutate(), arrange(), group_by() + summarise(), and the pipe operator to write readable data transformation pipelines.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'Masters',
    xp: 175, duration: 18, module: 4, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'dplyr', definition: 'The tidyverse package for data manipulation. Provides a consistent grammar: filter (rows), select (columns), mutate (new columns), arrange (sort), group_by + summarise (aggregation).' },
      { term: 'Pipe operator (%>% or |>)', definition: 'Passes the result of one function to the first argument of the next. df %>% filter(...) %>% select(...) reads left-to-right like a sentence.' },
      { term: 'group_by + summarise', definition: 'The split-apply-combine pattern. group_by(category) splits the data; summarise() applies functions to each group; the result is one row per group.' },
      { term: 'mutate()', definition: 'Adds or modifies columns without changing row count. df %>% mutate(total = price * qty) adds a total column.' },
      { term: 'join operations', definition: 'Combine two data frames by a key column. left_join(df1, df2, by="id") keeps all rows from df1, matching from df2.' },
      { term: 'across()', definition: 'Apply a function to multiple columns simultaneously. summarise(across(where(is.numeric), mean)) computes mean for all numeric columns.' },
    ],
    content: `## Data Manipulation with dplyr

### Installing and Loading dplyr

\`\`\`r
install.packages("dplyr")  # run once
library(dplyr)             # load every session
\`\`\`

Or install the entire tidyverse at once: \`install.packages("tidyverse")\`

---

### Sample Data

\`\`\`r
library(dplyr)

sales <- data.frame(
  id        = 1:10,
  product   = c("Laptop","Phone","Desk","Laptop","Monitor","Phone","Chair","Laptop","Monitor","Desk"),
  category  = c("Electronics","Electronics","Furniture","Electronics","Electronics",
                "Electronics","Furniture","Electronics","Electronics","Furniture"),
  price     = c(1299,799,450,1199,599,849,299,1399,649,399),
  qty       = c(2,5,3,1,4,2,6,3,2,4),
  region    = c("North","South","North","East","West","South","North","East","West","South"),
  stringsAsFactors = FALSE
)
\`\`\`

---

### The Pipe Operator

\`\`\`r
# Without pipe (hard to read — inside-out):
arrange(select(filter(sales, category == "Electronics"), product, price), price)

# With pipe (left-to-right, readable):
sales %>%
  filter(category == "Electronics") %>%
  select(product, price) %>%
  arrange(price)

# Native pipe (R 4.1+) — no package needed:
sales |>
  filter(category == "Electronics") |>
  select(product, price) |>
  arrange(price)
\`\`\`

---

### Core dplyr Verbs

**filter() — keep rows matching conditions:**
\`\`\`r
sales %>% filter(price > 800)
sales %>% filter(category == "Electronics", region == "North")
sales %>% filter(price >= 500 & price <= 1000)
sales %>% filter(product %in% c("Laptop", "Phone"))
\`\`\`

**select() — choose columns:**
\`\`\`r
sales %>% select(product, price, qty)
sales %>% select(-id)              # exclude id
sales %>% select(starts_with("p")) # product, price
sales %>% select(where(is.numeric)) # numeric columns only
\`\`\`

**mutate() — add or modify columns:**
\`\`\`r
sales %>%
  mutate(
    revenue   = price * qty,
    discount  = if_else(price > 1000, price * 0.1, 0),
    final_rev = revenue - discount,
    category_upper = toupper(category)
  )
\`\`\`

**arrange() — sort rows:**
\`\`\`r
sales %>% arrange(price)              # ascending
sales %>% arrange(desc(price))        # descending
sales %>% arrange(category, desc(price))  # multi-key sort
\`\`\`

**group_by() + summarise() — aggregation:**
\`\`\`r
sales %>%
  group_by(category) %>%
  summarise(
    total_revenue = sum(price * qty),
    avg_price     = mean(price),
    n_products    = n(),
    .groups = "drop"
  )
#    category    total_revenue avg_price n_products
# 1  Electronics      23291     882.4      7
# 2  Furniture         5346     382.7      3

# Multiple grouping variables
sales %>%
  group_by(category, region) %>%
  summarise(revenue = sum(price * qty), .groups = "drop") %>%
  arrange(category, desc(revenue))
\`\`\`

---

### Advanced Operations

\`\`\`r
# slice — select rows by position
sales %>% slice_max(price, n = 3)  # top 3 most expensive
sales %>% slice_min(qty, n = 2)    # 2 lowest quantity

# rename — rename columns
sales %>% rename(units = qty, item = product)

# count — frequency tables
sales %>% count(category)
sales %>% count(region, sort = TRUE)

# across — apply function to multiple columns
sales %>%
  group_by(category) %>%
  summarise(across(c(price, qty), list(mean = mean, sum = sum)))

# Joins
customers <- data.frame(
  id   = 1:5,
  name = c("Alice", "Bob", "Carol", "David", "Emma")
)
# left_join — keep all rows from sales
left_join(sales, customers, by = "id")
\`\`\`

---

### Complete Pipeline Example

\`\`\`r
top_performers <- sales %>%
  mutate(revenue = price * qty) %>%
  group_by(product) %>%
  summarise(
    total_revenue = sum(revenue),
    units_sold    = sum(qty),
    avg_price     = mean(price),
    .groups = "drop"
  ) %>%
  mutate(revenue_share = total_revenue / sum(total_revenue) * 100) %>%
  arrange(desc(total_revenue)) %>%
  slice_head(n = 5)

print(top_performers)
\`\`\``,
    quiz: [
      { q: 'What does the pipe operator %>% do?', options: ['Calculates percentage', 'Takes the result of the left side and passes it as the first argument to the right side function', 'Compares two values', 'Imports a package'], correct: 1, explanation: 'x %>% f(y) is equivalent to f(x, y). The pipe lets you write data transformations left-to-right, like a sentence: "take sales, then filter, then group, then summarise." This dramatically improves readability over nested function calls.' },
      { q: 'What does group_by(category) %>% summarise(avg = mean(price)) return?', options: ['A single average of all prices', 'One row per unique category with the average price for that group', 'A grouped version of the original data frame', 'All rows where category is non-null'], correct: 1, explanation: 'group_by splits the data into groups; summarise collapses each group to one row. The result has one row per unique category value, with the average price calculated within that category.' },
      { q: 'Which dplyr function adds a new column without reducing the number of rows?', options: ['summarise()', 'filter()', 'mutate()', 'group_by()'], correct: 2, explanation: 'mutate() adds or modifies columns while preserving all rows. df %>% mutate(total = price * qty) adds a total column. summarise() reduces rows to group summaries. filter() reduces rows by condition. group_by() changes the grouping metadata without changing rows.' },
      { q: 'What does slice_max(price, n = 3) do?', options: ['Removes the 3 highest-priced rows', 'Returns the 3 rows with the highest price values', 'Limits all prices to 3 decimal places', 'Samples 3 random rows'], correct: 1, explanation: 'slice_max(column, n) returns the n rows with the largest values in the specified column. slice_min gives the smallest. These replace the more verbose arrange() %>% head() pattern.' },
    ],
    ide: {
      language: 'r',
      task: 'Using the built-in mtcars dataset, write a dplyr pipeline to: (1) filter for cars with mpg > 20, (2) add a column efficiency = mpg / wt (miles per pound), (3) group by cyl (cylinders), (4) summarise with mean_mpg, max_hp, mean_efficiency, count n, (5) arrange by mean_mpg descending. Print the result.',
      starterCode: `library(dplyr)

# mtcars is built in — just use it
# Columns: mpg, cyl, hp, wt, gear, carb, ...

result <- mtcars %>%
  # TODO 1: filter mpg > 20
  # TODO 2: mutate efficiency = mpg / wt
  # TODO 3: group_by(cyl)
  # TODO 4: summarise(mean_mpg = mean(mpg), max_hp = max(hp), mean_eff = mean(efficiency), n = n())
  # TODO 5: arrange(desc(mean_mpg))
  filter(FALSE)  # replace this

print(result)`,
      solution: `library(dplyr)

result <- mtcars %>%
  filter(mpg > 20) %>%
  mutate(efficiency = mpg / wt) %>%
  group_by(cyl) %>%
  summarise(
    mean_mpg  = round(mean(mpg), 2),
    max_hp    = max(hp),
    mean_eff  = round(mean(efficiency), 3),
    n         = n(),
    .groups   = "drop"
  ) %>%
  arrange(desc(mean_mpg))

print(result)`,
      hints: [
        'Chain: filter(mpg > 20) %>% mutate(efficiency = mpg / wt) %>% group_by(cyl) %>% ...',
        'summarise() needs .groups = "drop" to ungroup after summarising.',
        'arrange(desc(mean_mpg)) sorts highest mean_mpg first.',
      ],
    },
  },
  {
    id: 'cc-r-m05', track: 'crash', title: 'Visualization with ggplot2',
    subtitle: 'Build publication-quality charts using ggplot2\'s grammar of graphics — scatter plots, histograms, box plots, bar charts, and faceted panels.',
    moduleObjective: 'Build scatter, histogram, bar, box, and line plots with ggplot2; customize labels, colors, and themes; use facet_wrap() for multi-panel views; and save charts to files.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'Masters',
    xp: 180, duration: 18, module: 5, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'Grammar of Graphics', definition: 'ggplot2\'s design philosophy: a chart = data + aesthetic mappings + geometric objects + scales + facets + theme. Each layer is added with + .' },
      { term: 'aes()', definition: 'Aesthetic mappings — connect data variables to visual properties. aes(x = mpg, y = hp, color = cyl) maps variables to axes and color.' },
      { term: 'geom_()', definition: 'The visual layer: geom_point() for scatter, geom_histogram() for histograms, geom_bar() for bars, geom_boxplot(), geom_line().' },
      { term: 'facet_wrap()', definition: 'Creates small multiples — one subplot per group. facet_wrap(~cyl) makes a separate panel for each cylinder count.' },
      { term: 'theme()', definition: 'Controls non-data visual elements: fonts, grid lines, backgrounds. theme_minimal(), theme_bw(), theme_classic() are common presets.' },
      { term: 'ggsave()', definition: 'Saves a ggplot to a file. ggsave("chart.png", width=8, height=6, dpi=300) exports a high-resolution PNG.' },
    ],
    content: `## Visualization with ggplot2

### Installation and the Core Pattern

\`\`\`r
install.packages("ggplot2")  # once
library(ggplot2)
\`\`\`

**Every ggplot2 chart follows the same pattern:**
\`\`\`r
ggplot(data = your_data, aes(x = col1, y = col2)) +  # setup
  geom_point() +         # draw points
  labs(title = "Title") + # labels
  theme_minimal()          # appearance
\`\`\`

---

### Scatter Plot

\`\`\`r
# Built-in mtcars dataset: fuel efficiency vs weight
ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl), size = hp)) +
  geom_point(alpha = 0.8) +
  scale_color_manual(values = c("4" = "#2196F3", "6" = "#FF9800", "8" = "#F44336")) +
  labs(
    title    = "Fuel Efficiency vs. Weight",
    subtitle = "Colored by cylinders, sized by horsepower",
    x        = "Weight (1000 lbs)",
    y        = "Miles per Gallon",
    color    = "Cylinders",
    size     = "Horsepower"
  ) +
  theme_minimal(base_size = 13)
\`\`\`

---

### Histogram

\`\`\`r
# Distribution of mpg values
ggplot(mtcars, aes(x = mpg)) +
  geom_histogram(bins = 10, fill = "#2196F3", color = "white", alpha = 0.8) +
  geom_vline(aes(xintercept = mean(mpg)), color = "red", linetype = "dashed", linewidth = 1) +
  annotate("text", x = mean(mtcars$mpg) + 1, y = 7,
           label = paste("Mean:", round(mean(mtcars$mpg), 1)),
           color = "red", hjust = 0) +
  labs(title = "Distribution of Fuel Efficiency", x = "MPG", y = "Count") +
  theme_classic()
\`\`\`

---

### Bar Chart

\`\`\`r
library(dplyr)

# Count cars by cylinder
cyl_counts <- mtcars %>%
  count(cyl) %>%
  mutate(cyl = factor(cyl))

ggplot(cyl_counts, aes(x = cyl, y = n, fill = cyl)) +
  geom_col(show.legend = FALSE) +
  geom_text(aes(label = n), vjust = -0.5, fontface = "bold") +
  scale_fill_brewer(palette = "Blues") +
  labs(title = "Cars by Number of Cylinders", x = "Cylinders", y = "Count") +
  theme_minimal()
\`\`\`

---

### Box Plot

\`\`\`r
ggplot(mtcars, aes(x = factor(cyl), y = mpg, fill = factor(cyl))) +
  geom_boxplot(outlier.shape = 21, outlier.size = 3, alpha = 0.8) +
  geom_jitter(width = 0.15, alpha = 0.5, size = 2) +  # show individual points
  scale_fill_brewer(palette = "Set2", guide = "none") +
  labs(
    title = "MPG Distribution by Cylinder Count",
    x     = "Number of Cylinders",
    y     = "Miles per Gallon"
  ) +
  theme_bw()
\`\`\`

---

### Line Chart with Multiple Series

\`\`\`r
# Simulated time series
set.seed(42)
time_data <- data.frame(
  week     = rep(1:12, 3),
  revenue  = c(
    cumsum(rnorm(12, 100, 15)),
    cumsum(rnorm(12, 90, 20)),
    cumsum(rnorm(12, 110, 10))
  ),
  product  = rep(c("Laptop", "Phone", "Monitor"), each = 12)
)

ggplot(time_data, aes(x = week, y = revenue, color = product, group = product)) +
  geom_line(linewidth = 1.2) +
  geom_point(size = 2.5) +
  scale_color_brewer(palette = "Dark2") +
  labs(title = "Weekly Revenue by Product", x = "Week", y = "Cumulative Revenue ($)") +
  theme_minimal() +
  theme(legend.position = "bottom")
\`\`\`

---

### facet_wrap() — Small Multiples

\`\`\`r
# Separate scatter plot per cylinder count
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point(color = "#2196F3", size = 2.5, alpha = 0.7) +
  geom_smooth(method = "lm", se = TRUE, color = "#F44336") +
  facet_wrap(~cyl, labeller = label_both) +
  labs(title = "MPG vs Weight: Faceted by Cylinders") +
  theme_bw()
\`\`\`

---

### Saving Plots

\`\`\`r
# Save the last plot
ggsave("mpg_analysis.png", width = 8, height = 6, dpi = 300)

# Save a specific plot object
p <- ggplot(mtcars, aes(x = mpg)) + geom_histogram(bins = 10)
ggsave("histogram.pdf", plot = p, width = 6, height = 4)
\`\`\`

---

### Customizing Themes

\`\`\`r
# A fully custom theme
my_theme <- theme_minimal(base_size = 12) +
  theme(
    plot.title       = element_text(face = "bold", size = 14, hjust = 0),
    plot.subtitle    = element_text(color = "grey50"),
    panel.grid.minor = element_blank(),
    axis.line        = element_line(color = "grey70"),
    legend.position  = "bottom"
  )

ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point(color = "#2196F3") +
  labs(title = "Custom Theme Example", subtitle = "Clean, minimal style") +
  my_theme
\`\`\``,
    quiz: [
      { q: 'What does aes() do in ggplot2?', options: ['Creates aesthetically pleasing colors automatically', 'Maps data variables to visual properties like x/y position, color, size, and shape', 'Applies a CSS-like theme', 'Defines the chart type'], correct: 1, explanation: 'aes() (aesthetic mappings) connects data columns to visual channels. aes(x=mpg, color=cyl) tells ggplot: put mpg values on the x-axis, color points by the cyl value. The data-to-visual mapping is the core of the grammar of graphics.' },
      { q: 'What is the purpose of facet_wrap(~variable)?', options: ['Wraps long axis labels', 'Creates a separate subplot for each unique value of the variable', 'Applies a filter to the data', 'Changes the aspect ratio of the plot'], correct: 1, explanation: 'facet_wrap creates "small multiples" — one panel per level of the variable. facet_wrap(~cyl) creates three panels (one each for 4, 6, and 8 cylinders) with the same scales, making comparisons easy.' },
      { q: 'Which ggplot2 function adds a histogram layer?', options: ['geom_hist()', 'stat_histogram()', 'geom_histogram()', 'layer_bars()'], correct: 2, explanation: 'geom_histogram() adds a histogram layer. Key parameters: bins (number of bars) or binwidth (width of each bar), fill (bar color), color (border color), alpha (transparency).' },
      { q: 'How do you add layers in ggplot2?', options: ['By nesting function calls inside ggplot()', 'Using the + operator to add geoms, scales, labels, and themes', 'Using the %>% pipe operator', 'By passing a list of layers to ggplot()'], correct: 1, explanation: 'ggplot2 uses + to compose charts layer by layer. ggplot(...) + geom_point() + labs() + theme_minimal() builds up the chart piece by piece. Each + adds an independent layer or modifies the plot\'s specification.' },
    ],
    ide: {
      language: 'r',
      task: 'Using the diamonds dataset (built into ggplot2), create: (1) a scatter plot of carat vs price, colored by cut, with alpha=0.3, (2) use facet_wrap(~cut) to split by cut quality, (3) add a smooth trend line with geom_smooth(method="lm"), (4) apply theme_minimal() and proper labels. Print the plot.',
      starterCode: `library(ggplot2)

# diamonds is built in — str(diamonds) to inspect
# Columns: carat, cut, color, clarity, price, ...

# TODO: build the plot
p <- ggplot(diamonds, aes(x = carat, y = price)) +
  # TODO: geom_point with color=cut, alpha=0.3, size=0.5
  # TODO: facet_wrap(~cut)
  # TODO: geom_smooth(method="lm", se=FALSE, color="red")
  # TODO: labs(title=..., x=..., y=..., color=...)
  # TODO: theme_minimal()
  geom_point()  # placeholder

print(p)`,
      solution: `library(ggplot2)

p <- ggplot(diamonds, aes(x = carat, y = price, color = cut)) +
  geom_point(alpha = 0.3, size = 0.5) +
  facet_wrap(~cut) +
  geom_smooth(method = "lm", se = FALSE, color = "black", linewidth = 0.8) +
  labs(
    title = "Diamond Price vs Carat by Cut Quality",
    x     = "Carat",
    y     = "Price (USD)",
    color = "Cut"
  ) +
  theme_minimal() +
  theme(legend.position = "none")  # facet labels make legend redundant

print(p)`,
      hints: [
        'aes(x=carat, y=price, color=cut) maps cut to color automatically.',
        'geom_point(alpha=0.3, size=0.5) makes dense data readable.',
        'facet_wrap(~cut) creates one panel per cut level.',
        'geom_smooth(method="lm") adds a linear regression line.',
      ],
    },
  },
  {
    id: 'cc-r-m06', track: 'crash', title: 'Statistical Analysis: Summaries, Distributions & Tests',
    subtitle: 'Perform the statistical analysis that R is known for — descriptive stats, probability distributions, t-tests, chi-square, ANOVA, and correlation.',
    moduleObjective: 'Compute comprehensive descriptive statistics, work with probability distributions (normal, binomial), perform t-tests, chi-square, and correlation analysis, and interpret p-values and confidence intervals correctly.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'PhD',
    xp: 185, duration: 20, module: 6, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'p-value', definition: 'The probability of observing a result as extreme as the data, assuming the null hypothesis is true. p < 0.05 is conventionally "statistically significant."' },
      { term: 't-test', definition: 'Tests whether the means of one or two groups differ significantly. t.test() in R. Assumes roughly normal distribution.' },
      { term: 'Confidence Interval', definition: 'A range of plausible values for a parameter. A 95% CI means: if we repeated the study 100 times, 95 of those CIs would contain the true value.' },
      { term: 'Correlation', definition: 'Measures the linear relationship between two numeric variables. cor() returns Pearson r: +1 (perfect positive), 0 (none), -1 (perfect negative).' },
      { term: 'ANOVA', definition: 'Analysis of Variance — tests whether means differ across 3+ groups. aov() in R. If significant, post-hoc tests identify which pairs differ.' },
      { term: 'Effect size', definition: 'Practical magnitude of a difference (e.g., Cohen\'s d). A result can be statistically significant but practically tiny. Report both.' },
    ],
    content: `## Statistical Analysis: Summaries, Distributions & Tests

### Comprehensive Descriptive Statistics

\`\`\`r
# R's built-in summary
data(mtcars)
summary(mtcars)  # min, Q1, median, mean, Q3, max for each column

# Custom function for more detail
describe_var <- function(x, name = deparse(substitute(x))) {
  cat(sprintf("--- %s ---\\n", name))
  cat(sprintf("N: %d | Missing: %d\\n", sum(!is.na(x)), sum(is.na(x))))
  cat(sprintf("Mean: %.3f | Median: %.3f\\n", mean(x, na.rm=T), median(x, na.rm=T)))
  cat(sprintf("SD: %.3f | IQR: %.3f\\n", sd(x, na.rm=T), IQR(x, na.rm=T)))
  cat(sprintf("Min: %.3f | Max: %.3f\\n", min(x, na.rm=T), max(x, na.rm=T)))
  q <- quantile(x, c(0.25, 0.75, 0.90, 0.95), na.rm=T)
  cat(sprintf("P25: %.3f | P75: %.3f | P90: %.3f | P95: %.3f\\n", q[1], q[2], q[3], q[4]))
}

describe_var(mtcars$mpg)
\`\`\`

---

### Probability Distributions

R follows a consistent naming convention for distributions:
- \`d\` = density (PDF): \`dnorm(x)\`
- \`p\` = cumulative probability (CDF): \`pnorm(x)\`
- \`q\` = quantile (inverse CDF): \`qnorm(p)\`
- \`r\` = random sample: \`rnorm(n)\`

\`\`\`r
# Normal distribution
dnorm(0)              # density at 0: 0.3989
pnorm(1.96)           # P(Z <= 1.96) = 0.975 (95th percentile)
qnorm(0.975)          # 1.96 — the value at 97.5th percentile
rnorm(5, mean=100, sd=15)  # 5 random IQ-like scores

# What proportion of a N(100, 15) distribution is above 130?
pnorm(130, mean=100, sd=15, lower.tail=FALSE)  # 0.02275

# Binomial distribution
# P(X = 3) when n=10 trials, p=0.3 success probability
dbinom(3, size=10, prob=0.3)  # 0.2668
# P(X <= 3)
pbinom(3, size=10, prob=0.3)  # 0.6496
\`\`\`

---

### One-Sample and Two-Sample t-tests

\`\`\`r
# One-sample: is the mean mpg different from 20?
t.test(mtcars$mpg, mu = 20)
# Output shows: t statistic, df, p-value, 95% CI, mean

# Two-sample: do 4-cyl and 8-cyl cars have different mpg?
mpg_4 <- mtcars$mpg[mtcars$cyl == 4]
mpg_8 <- mtcars$mpg[mtcars$cyl == 8]

result <- t.test(mpg_4, mpg_8, var.equal = FALSE)  # Welch's t-test
cat(sprintf("t = %.3f, df = %.1f, p = %.4f\\n",
    result$statistic, result$parameter, result$p.value))
cat(sprintf("95%% CI: [%.2f, %.2f]\\n",
    result$conf.int[1], result$conf.int[2]))
# p < 0.001 — strong evidence that means differ

# Paired t-test (before/after measurements)
before <- c(82, 91, 78, 88, 95, 83, 77, 90)
after  <- c(88, 95, 82, 91, 98, 87, 84, 94)
t.test(before, after, paired = TRUE)
\`\`\`

---

### Correlation Analysis

\`\`\`r
# Pearson correlation between two variables
cor(mtcars$wt, mtcars$mpg)  # -0.868 — strong negative

# Correlation matrix for multiple variables
cor_matrix <- cor(mtcars[, c("mpg", "cyl", "hp", "wt", "qsec")])
round(cor_matrix, 3)

# Correlation with significance test
cor.test(mtcars$wt, mtcars$mpg)
# Shows: r, t-statistic, p-value, 95% CI

# Visualize correlation matrix
library(ggplot2)
library(reshape2)
melted <- melt(cor_matrix)
ggplot(melted, aes(Var1, Var2, fill = value)) +
  geom_tile() +
  scale_fill_gradient2(low="#B71C1C", mid="white", high="#1565C0", midpoint=0) +
  geom_text(aes(label=round(value, 2)), size=3) +
  labs(title="Correlation Matrix", fill="r") +
  theme_minimal()
\`\`\`

---

### ANOVA and Chi-Square

\`\`\`r
# One-way ANOVA: does mpg differ by cylinder count?
model <- aov(mpg ~ factor(cyl), data = mtcars)
summary(model)
# F = 39.7, p < 2e-16 — yes, significant difference

# Post-hoc: which pairs differ? (Tukey HSD)
TukeyHSD(model)

# Chi-square test: independence between categorical variables
# Are transmission type (am) and cylinder count (cyl) independent?
table_data <- table(mtcars$cyl, mtcars$am)
chi_result <- chisq.test(table_data)
cat(sprintf("Chi-square: %.3f, df: %d, p: %.4f\\n",
    chi_result$statistic, chi_result$parameter, chi_result$p.value))
\`\`\`

---

### Cohen's d (Effect Size)

\`\`\`r
cohens_d <- function(x, y) {
  pooled_sd <- sqrt(((length(x)-1)*var(x) + (length(y)-1)*var(y)) /
                    (length(x) + length(y) - 2))
  abs(mean(x) - mean(y)) / pooled_sd
}

d <- cohens_d(mpg_4, mpg_8)
cat(sprintf("Cohen's d = %.2f (%s)\\n", d,
    ifelse(d < 0.2, "negligible",
    ifelse(d < 0.5, "small",
    ifelse(d < 0.8, "medium", "large")))))
\`\`\``,
    quiz: [
      { q: 'A t-test returns p = 0.03. What does this mean?', options: ['There is a 3% chance the result is wrong', 'If the null hypothesis were true, there is a 3% chance of observing a result this extreme or more', 'The effect size is 0.03', 'The means differ by 3%'], correct: 1, explanation: 'p-value = probability of observing data this extreme assuming H0 is true. p = 0.03 means: if there were truly no difference (H0), we\'d see a result this large only 3% of the time. We reject H0 at the 5% level. It does NOT mean there is a 97% chance the hypothesis is true.' },
      { q: 'What does pnorm(1.96) return and what does it mean?', options: ['The density of the normal distribution at 1.96', 'The probability that a standard normal random variable is less than or equal to 1.96: ~0.975', 'The 196th percentile', 'The area above 1.96'], correct: 1, explanation: 'pnorm(x) returns P(Z <= x) for the standard normal. pnorm(1.96) ≈ 0.975 — 97.5% of the distribution lies below 1.96. This is why a 95% two-tailed confidence interval uses z = ±1.96.' },
      { q: 'What is the difference between statistical significance and practical significance?', options: ['They are the same thing', 'Statistical significance (p-value) tells you if an effect exists; practical significance (effect size) tells you if it matters in the real world', 'Statistical significance is more important', 'Practical significance only applies to business data'], correct: 1, explanation: 'With large samples, tiny differences can be statistically significant (p < 0.001) but practically meaningless (d = 0.02). Always report effect sizes (Cohen\'s d, R², or similar) alongside p-values to convey the magnitude of an effect, not just its existence.' },
      { q: 'When would you use ANOVA instead of a t-test?', options: ['When your data is not normally distributed', 'When comparing means across 3 or more groups simultaneously', 'When your sample size is very large', 'When comparing two proportions'], correct: 1, explanation: 'A t-test compares means between 2 groups. ANOVA (Analysis of Variance) compares means across 3+ groups simultaneously, while controlling the Type I error rate. Running multiple t-tests inflates the false positive rate — ANOVA is the correct approach.' },
    ],
    ide: {
      language: 'r',
      task: 'Using the built-in iris dataset: (1) compute a descriptive statistics table (mean, sd, min, max) for all 4 numeric columns grouped by Species using dplyr. (2) Test if Sepal.Length differs between setosa and virginica with a two-sample t-test. (3) Compute the correlation between Petal.Length and Petal.Width for all species. Print all results.',
      starterCode: `library(dplyr)

# iris has: Sepal.Length, Sepal.Width, Petal.Length, Petal.Width, Species

# TODO 1: grouped descriptive stats
stats_by_species <- iris %>%
  group_by(Species) %>%
  summarise(across(where(is.numeric), list(mean=mean, sd=sd)))

print(stats_by_species)

# TODO 2: t-test Sepal.Length: setosa vs virginica
setosa   <- iris$Sepal.Length[iris$Species == "setosa"]
virginica <- iris$Sepal.Length[iris$Species == "virginica"]

# t.test(setosa, virginica)

# TODO 3: correlation Petal.Length vs Petal.Width
# cor.test(iris$Petal.Length, iris$Petal.Width)`,
      solution: `library(dplyr)

# 1: grouped descriptive stats
stats_by_species <- iris %>%
  group_by(Species) %>%
  summarise(across(where(is.numeric), list(
    mean = \\(x) round(mean(x), 2),
    sd   = \\(x) round(sd(x), 3)
  )), .groups = "drop")

print(stats_by_species)

# 2: t-test
setosa    <- iris$Sepal.Length[iris$Species == "setosa"]
virginica <- iris$Sepal.Length[iris$Species == "virginica"]
result    <- t.test(setosa, virginica)
cat(sprintf("\\nt-test: t=%.3f, p=%.2e\\n", result$statistic, result$p.value))
cat(sprintf("95%% CI: [%.3f, %.3f]\\n", result$conf.int[1], result$conf.int[2]))

# 3: correlation
cor_result <- cor.test(iris$Petal.Length, iris$Petal.Width)
cat(sprintf("\\nCorrelation: r=%.3f, p=%.2e\\n",
    cor_result$estimate, cor_result$p.value))`,
      hints: [
        'across(where(is.numeric), list(mean=mean, sd=sd)) applies both functions to all numeric columns.',
        'Filter by Species: iris$Sepal.Length[iris$Species == "setosa"]',
        'cor.test() gives r, t-stat, p-value, and 95% CI for the correlation.',
      ],
    },
  },
  {
    id: 'cc-r-m07', track: 'crash', title: 'Data Import & Export: CSV, JSON & Excel',
    subtitle: 'Read and write every common data format in R — CSV, JSON, Excel, and RDS — with proper handling of encoding, missing values, and large files.',
    moduleObjective: 'Import CSV, JSON, and Excel files; export data in multiple formats; handle encoding and missing values during import; use read_csv vs read.csv correctly; and work with the readr and jsonlite packages.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'PhD',
    xp: 195, duration: 20, module: 7, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'readr', definition: 'Tidyverse package for reading rectangular text files. read_csv() is faster and smarter than base R\'s read.csv() — auto-detects types and returns a tibble.' },
      { term: 'jsonlite', definition: 'R package for JSON. fromJSON() parses JSON to R objects; toJSON() converts R to JSON. Handles nested structures automatically.' },
      { term: 'readxl', definition: 'Reads Excel files (.xls, .xlsx) without needing Excel installed. read_excel("file.xlsx", sheet="Sheet1") is the main function.' },
      { term: 'tibble', definition: 'A modern data frame from the tidyverse. Better printing, no row names by default, strings not converted to factors, and subsetting never silently changes types.' },
      { term: 'na_values', definition: 'Strings to treat as NA during import. read_csv(na = c("", "NA", "NULL", "N/A", "-")) handles multiple missing value representations.' },
      { term: 'write_csv / write_rds', definition: 'write_csv exports a data frame as CSV (portable). write_rds saves in R\'s binary format — fast and preserves R types exactly (factors, dates, etc.).' },
    ],
    content: `## Data Import & Export: CSV, JSON & Excel

### Reading CSV Files

\`\`\`r
# Base R — works everywhere, slower
df_base <- read.csv("data.csv", stringsAsFactors = FALSE)

# readr — faster, better type inference, returns tibble
library(readr)
df <- read_csv("data.csv")  # automatically reads column types

# Key read_csv options:
df <- read_csv(
  "data.csv",
  col_types = cols(
    date    = col_date(format = "%Y-%m-%d"),
    price   = col_double(),
    product = col_character()
  ),
  na        = c("", "NA", "N/A", "null", "-"),  # what to treat as NA
  skip      = 2,       # skip first 2 lines (metadata/header)
  n_max     = 10000,   # limit rows for testing
  locale    = locale(encoding = "UTF-8")
)

# Inspect after reading
glimpse(df)   # tidyverse's str() — shows type and preview per column
problems(df)  # any parsing errors?
\`\`\`

---

### Writing CSV Files

\`\`\`r
library(readr)

# Write to CSV
write_csv(df, "output.csv")                    # no row names (cleaner)
write_csv(df, "output.csv", na = "")           # write NA as empty string
write_csv2(df, "output_eu.csv")               # semicolon separator (European)

# Base R (adds row numbers by default — usually not wanted)
write.csv(df, "output.csv", row.names = FALSE)

# Append to existing file
write_csv(new_rows, "output.csv", append = TRUE)
\`\`\`

---

### JSON Import and Export

\`\`\`r
library(jsonlite)

# Read a JSON file
json_text <- '
[
  {"id": 1, "name": "Alice", "scores": [95, 88, 92]},
  {"id": 2, "name": "Bob",   "scores": [78, 81, 75]},
  {"id": 3, "name": "Carol", "scores": [91, 94, 89]}
]'

data <- fromJSON(json_text)
class(data)       # "data.frame"
data$name         # c("Alice", "Bob", "Carol")
data$scores       # a list column — each element is a vector

# Extract nested list column
avg_scores <- sapply(data$scores, mean)
data$avg_score <- avg_scores

# Read from URL or file
# json_data <- fromJSON("https://api.example.com/data")
# json_data <- fromJSON("data.json")

# Write to JSON
output_json <- toJSON(data, pretty = TRUE, auto_unbox = TRUE)
cat(output_json)
# writeLines(output_json, "output.json")

# Control JSON output
toJSON(list(name = "Jordan", scores = c(95, 88)), pretty = TRUE)
\`\`\`

---

### Excel Files

\`\`\`r
library(readxl)

# Read first sheet
df <- read_excel("data.xlsx")

# Specific sheet and range
df <- read_excel(
  "data.xlsx",
  sheet   = "Sales 2025",     # or sheet number: sheet = 2
  range   = "A1:F100",        # Excel range
  col_names = TRUE,
  na      = c("", "N/A")
)

# List all sheet names
excel_sheets("data.xlsx")  # c("Summary", "Sales 2025", "Products")

# Write Excel (needs writexl or openxlsx)
library(writexl)
write_xlsx(list(Sales = df_sales, Products = df_products), "output.xlsx")

library(openxlsx)
wb <- createWorkbook()
addWorksheet(wb, "Sales")
writeData(wb, "Sales", df_sales)
addWorksheet(wb, "Summary")
writeData(wb, "Summary", summary_df)
saveWorkbook(wb, "output.xlsx", overwrite = TRUE)
\`\`\`

---

### R Native Formats

\`\`\`r
# RDS — single R object, preserves types exactly (including factors, dates)
write_rds(df, "data.rds", compress = "gz")  # compressed
df_back <- read_rds("data.rds")             # reads back with exact types

# RData — multiple objects in one file
save(df1, df2, model, "workspace.RData")
load("workspace.RData")  # restores df1, df2, model to environment
\`\`\`

---

### Handling Encoding and Large Files

\`\`\`r
# Detect encoding of a file
library(readr)
guess_encoding("data_unknown.csv")  # returns likely encoding

# Read with specific encoding
df <- read_csv("data_latin1.csv", locale = locale(encoding = "latin1"))

# Large files — streaming with vroom (fast) or chunked processing
library(vroom)
df <- vroom("large_file.csv")  # 1GB+ files in seconds using ALTREP

# Chunked processing without loading everything into memory
library(readr)
read_csv_chunked(
  "huge_file.csv",
  callback = DataFrameCallback$new(function(chunk, pos) {
    # process each chunk here
    chunk %>% filter(value > 0)
  }),
  chunk_size = 100000
)
\`\`\``,
    quiz: [
      { q: 'What is the main advantage of read_csv() from readr over base R\'s read.csv()?', options: ['read_csv() is shorter to type', 'read_csv() is faster, returns a tibble, does not convert strings to factors, and provides better type detection and error reporting', 'read_csv() can read Excel files too', 'They are equivalent'], correct: 1, explanation: 'readr\'s read_csv() is 5-10x faster for large files, correctly detects column types (dates, numbers) without manual specification, never converts strings to factors (a notorious read.csv() gotcha), returns a tibble, and provides detailed parsing problem reports via problems().' },
      { q: 'What does fromJSON() return when parsing a JSON array of objects?', options: ['A list of lists', 'A character string', 'A data frame (one row per JSON object, one column per key)', 'An R environment'], correct: 2, explanation: 'fromJSON() is smart about coercing JSON arrays of objects to data frames — the most natural R representation. A JSON array with nested arrays becomes a data frame with list-columns.' },
      { q: 'When should you use write_rds() instead of write_csv()?', options: ['Always — RDS is better than CSV', 'When you need to preserve R-specific types (factors, dates, list columns) exactly and the file will only be read by R', 'When the file must be human-readable', 'For very large files only'], correct: 1, explanation: 'RDS preserves R data types perfectly — ordered factors, POSIXct timestamps, complex list columns, model objects. CSV converts everything to text, losing type information. Use CSV for sharing with other tools/people; use RDS for R-to-R workflows.' },
      { q: 'What does the na parameter in read_csv() control?', options: ['Whether to drop rows with missing values', 'Which strings in the file should be interpreted as NA (missing values) during import', 'The number of NA values allowed', 'Whether NA is printed in output'], correct: 1, explanation: 'Real-world data uses many representations for missing values: empty strings, "NA", "N/A", "null", "NULL", "-", "999". The na parameter tells read_csv which strings to treat as NA. Without this, "N/A" would be imported as the string "N/A" rather than a proper NA.' },
    ],
    ide: {
      language: 'r',
      task: 'Create a data frame of 10 products in R. Export it as CSV with write_csv. Then read it back with read_csv and verify the column types. Also convert it to JSON with jsonlite\'s toJSON and parse it back with fromJSON. Print a comparison of nrow and column types at each stage.',
      starterCode: `library(readr)
library(jsonlite)
library(dplyr)

# Create sample data
products <- data.frame(
  id       = 1:10,
  name     = paste0("Product_", 1:10),
  price    = round(runif(10, 10, 1000), 2),
  category = sample(c("Electronics", "Furniture", "Clothing"), 10, replace=TRUE),
  in_stock = sample(c(TRUE, FALSE), 10, replace=TRUE),
  stringsAsFactors = FALSE
)

cat("Original:\\n")
glimpse(products)

# TODO: write to CSV then read back
# write_csv(products, "/tmp/products.csv")
# products_back <- read_csv("/tmp/products.csv")
# cat("\\nRead from CSV:\\n")
# glimpse(products_back)

# TODO: convert to JSON and parse back
# json_str <- toJSON(products, pretty=TRUE)
# products_json <- fromJSON(json_str)
# cat("\\nFrom JSON:\\n")
# cat("nrow:", nrow(products_json), "\\n")`,
      solution: `library(readr)
library(jsonlite)
library(dplyr)

products <- data.frame(
  id       = 1:10,
  name     = paste0("Product_", 1:10),
  price    = round(runif(10, 10, 1000), 2),
  category = sample(c("Electronics", "Furniture", "Clothing"), 10, replace=TRUE),
  in_stock = sample(c(TRUE, FALSE), 10, replace=TRUE),
  stringsAsFactors = FALSE
)

cat("Original:\\n")
glimpse(products)

# CSV round-trip
tmp_csv <- tempfile(fileext=".csv")
write_csv(products, tmp_csv)
products_back <- read_csv(tmp_csv, show_col_types=FALSE)
cat("\\nAfter CSV round-trip:\\n")
cat("nrow:", nrow(products_back), "| ncol:", ncol(products_back), "\\n")
cat("in_stock type:", class(products_back$in_stock), "\\n")  # note: logical becomes TRUE/FALSE strings

# JSON round-trip
json_str <- toJSON(products, pretty=TRUE)
products_json <- fromJSON(json_str)
cat("\\nAfter JSON round-trip:\\n")
cat("nrow:", nrow(products_json), "| ncol:", ncol(products_json), "\\n")
cat("class:", class(products_json), "\\n")`,
      hints: [
        'Use tempfile(fileext=".csv") to create a temporary file path that works cross-platform.',
        'toJSON(df, pretty=TRUE) formats JSON readably. auto_unbox=TRUE prevents single values from becoming arrays.',
        'glimpse() shows column types clearly — use it to compare types before and after round-trips.',
      ],
    },
  },
  {
    id: 'cc-r-m08', track: 'crash', title: 'Capstone: Complete EDA Pipeline',
    subtitle: 'Build a full exploratory data analysis pipeline — import, clean, transform, visualize distributions and relationships, run statistical tests, and export a professional report.',
    moduleObjective: 'Execute a complete EDA from raw data to report: handle missing values, detect outliers, compute grouped statistics, build a multi-panel visualization, run a hypothesis test, and output reproducible findings.',
    courseObjective: CC_R_OBJ, crashId: 'cc-r', crashTitle: 'R', level: 'PhD',
    xp: 200, duration: 25, module: 8, certArea: 'R Crash Course',
    keyTerms: [
      { term: 'EDA', definition: 'Exploratory Data Analysis — the initial open-ended investigation of a dataset before modeling. Goal: understand distributions, patterns, anomalies, and relationships.' },
      { term: 'Missing value imputation', definition: 'Filling missing values with estimates: median (robust), mean (sensitive to outliers), or model-based imputation. Always document how you handled NAs.' },
      { term: 'Outlier detection', definition: 'Values far from the bulk of the distribution. Common rules: beyond 1.5×IQR (boxplot rule) or beyond 3 standard deviations from the mean.' },
      { term: 'Skewness', definition: 'A measure of asymmetry in a distribution. Positive skew: long right tail. Negative skew: long left tail. Skew > |1| usually indicates log transformation is helpful.' },
      { term: 'Reproducibility', definition: 'set.seed() ensures random operations produce the same results each run. Good practice to include in any analysis with random elements.' },
      { term: 'R Markdown / Quarto', definition: 'Documents that mix R code, output, and prose. Knitting produces HTML/PDF reports. The standard for reproducible research in R.' },
    ],
    content: `## Capstone: Complete EDA Pipeline

### The EDA Framework

A structured EDA follows these steps:
1. **Load and inspect** — understand the shape and types
2. **Data quality** — missing values, duplicates, impossible values
3. **Univariate analysis** — distribution of each variable
4. **Bivariate analysis** — relationships between pairs of variables
5. **Multivariate analysis** — patterns across multiple variables
6. **Statistical testing** — confirm observed patterns formally
7. **Summary and findings** — communicate key insights

---

### Step 1: Load and Inspect

\`\`\`r
library(dplyr)
library(ggplot2)
library(readr)

# We'll use the built-in mpg dataset (fuel economy data)
data <- mpg

# Shape and types
cat("Shape:", nrow(data), "×", ncol(data), "\\n")
str(data)
glimpse(data)

# First look
head(data, 5)
tail(data, 3)
\`\`\`

---

### Step 2: Data Quality Assessment

\`\`\`r
# Missing values
na_counts <- colSums(is.na(data))
cat("Missing values:\\n")
print(na_counts[na_counts > 0])

# Duplicates
n_dupes <- sum(duplicated(data))
cat(sprintf("\\nDuplicate rows: %d\\n", n_dupes))

# Unique values per column (good for spotting unexpected categories)
sapply(data, function(x) length(unique(x)))

# Data quality summary function
data_quality <- function(df) {
  data.frame(
    column   = names(df),
    type     = sapply(df, class),
    n_unique = sapply(df, function(x) length(unique(x))),
    n_na     = colSums(is.na(df)),
    pct_na   = round(colMeans(is.na(df)) * 100, 1)
  ) %>%
    arrange(desc(pct_na))
}
print(data_quality(data))
\`\`\`

---

### Step 3: Univariate Analysis

\`\`\`r
# Numeric variables — distribution summary
numeric_cols <- data %>% select(where(is.numeric))

describe_all <- numeric_cols %>%
  summarise(across(everything(), list(
    mean   = \\(x) round(mean(x, na.rm=T), 2),
    median = \\(x) round(median(x, na.rm=T), 2),
    sd     = \\(x) round(sd(x, na.rm=T), 2),
    min    = \\(x) min(x, na.rm=T),
    max    = \\(x) max(x, na.rm=T),
    iqr    = \\(x) round(IQR(x, na.rm=T), 2)
  )))

# Detect outliers using IQR rule
detect_outliers <- function(x) {
  q <- quantile(x, c(0.25, 0.75), na.rm = TRUE)
  iqr <- q[2] - q[1]
  lower <- q[1] - 1.5 * iqr
  upper <- q[2] + 1.5 * iqr
  sum(x < lower | x > upper, na.rm = TRUE)
}

cat("Outlier counts:\\n")
print(sapply(numeric_cols, detect_outliers))

# Distribution plots — histograms for all numeric columns
library(tidyr)
numeric_long <- numeric_cols %>%
  pivot_longer(everything(), names_to = "variable", values_to = "value")

ggplot(numeric_long, aes(x = value)) +
  geom_histogram(bins = 20, fill = "#2196F3", color = "white", alpha = 0.8) +
  facet_wrap(~variable, scales = "free") +
  labs(title = "Distribution of All Numeric Variables") +
  theme_minimal()
\`\`\`

---

### Step 4: Bivariate Analysis

\`\`\`r
# Correlation heatmap
cor_mat <- cor(numeric_cols, use = "complete.obs")

library(reshape2)
cor_melted <- melt(cor_mat)
ggplot(cor_melted, aes(Var1, Var2, fill = value)) +
  geom_tile(color = "white") +
  scale_fill_gradient2(low = "#B71C1C", mid = "white", high = "#1565C0",
                       midpoint = 0, limits = c(-1, 1)) +
  geom_text(aes(label = round(value, 2)), size = 3) +
  labs(title = "Correlation Matrix", x = NULL, y = NULL) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

# Box plots: hwy mpg by drive type
ggplot(data, aes(x = drv, y = hwy, fill = drv)) +
  geom_boxplot(alpha = 0.8) +
  geom_jitter(width = 0.1, alpha = 0.4, size = 1) +
  labs(title = "Highway MPG by Drive Type", x = "Drive Type", y = "Hwy MPG") +
  theme_minimal() +
  theme(legend.position = "none")
\`\`\`

---

### Step 5: Statistical Testing

\`\`\`r
# Does highway MPG differ significantly between drive types?
anova_model <- aov(hwy ~ drv, data = data)
summary(anova_model)

# Post-hoc pairwise comparisons
tukey <- TukeyHSD(anova_model)
print(tukey)

# Correlation test: engine displacement vs MPG
cor.test(data$displ, data$hwy)
# Expected: strong negative correlation

# Effect size for key comparison
front <- data$hwy[data$drv == "f"]
four  <- data$hwy[data$drv == "4"]
cohens_d <- function(x, y) {
  pooled <- sqrt(((length(x)-1)*var(x) + (length(y)-1)*var(y)) /
                  (length(x)+length(y)-2))
  abs(mean(x) - mean(y)) / pooled
}
cat(sprintf("\\nCohen's d (f vs 4WD): %.2f\\n", cohens_d(front, four)))
\`\`\`

---

### Step 6: Summary Report

\`\`\`r
cat("=== EDA SUMMARY ===\\n")
cat(sprintf("Dataset: %d rows × %d columns\\n", nrow(data), ncol(data)))
cat(sprintf("Missing values: %d (%.1f%%)\\n",
    sum(is.na(data)), mean(is.na(data)) * 100))
cat(sprintf("Duplicate rows: %d\\n", sum(duplicated(data))))

cat("\\nKey findings:\\n")
cat(sprintf("1. Mean highway MPG: %.1f (range: %d-%d)\\n",
    mean(data$hwy), min(data$hwy), max(data$hwy)))
cat(sprintf("2. Engine displacement negatively correlates with MPG: r=%.2f\\n",
    cor(data$displ, data$hwy)))
cat(sprintf("3. ANOVA confirms hwy MPG differs by drive type: p < 0.001\\n"))
cat(sprintf("4. Front-wheel drive cars average %.1f mpg hwy vs 4WD's %.1f mpg\\n",
    mean(data$hwy[data$drv=="f"]), mean(data$hwy[data$drv=="4"])))
\`\`\``,
    quiz: [
      { q: 'What is the first step of any EDA and why is it critical?', options: ['Build a model', 'Load the data and inspect its shape, types, and first few rows before doing anything else', 'Plot distributions', 'Handle missing values'], correct: 1, explanation: 'Inspecting the data first (str(), glimpse(), head(), summary()) prevents wasted effort. You might discover: columns with wrong types, unexpected missing values, a much larger/smaller dataset than expected, or encoding issues. Understanding what you have before you analyze it is non-negotiable.' },
      { q: 'What does the IQR method for outlier detection consider "extreme"?', options: ['Values more than 3 standard deviations from the mean', 'Values below Q1 - 1.5×IQR or above Q3 + 1.5×IQR', 'Any value above the 95th percentile', 'Values outside the min/max range'], correct: 1, explanation: 'The Tukey fence method: lower = Q1 - 1.5×IQR, upper = Q3 + 1.5×IQR. Values outside this range are plotted as individual points in boxplots. This method is robust to outliers themselves (unlike the mean ± 3SD rule) because it uses quartiles.' },
      { q: 'Why does a complete EDA include both statistical tests AND visualizations?', options: ['Regulations require both', 'Statistical tests confirm whether patterns are significant; visualizations reveal the shape, outliers, and non-obvious structure that numbers alone miss', 'Visualizations are required for publication', 'Statistical tests are too complex for non-statisticians to understand'], correct: 1, explanation: 'Anscombe\'s quartet famously shows four datasets with identical means, variances, and correlations but radically different visual structures. A test says "significant"; a plot shows you WHY and WHETHER the pattern makes sense. Both are required for trustworthy analysis.' },
      { q: 'What is the purpose of set.seed() in an R EDA pipeline?', options: ['Speeds up random number generation', 'Ensures random operations produce the same results every run, making the analysis reproducible', 'Prevents outliers from being generated', 'Required by the tidyverse packages'], correct: 1, explanation: 'set.seed(n) initializes R\'s random number generator to a known state. Any subsequent call to rnorm(), sample(), runif(), etc. produces the same sequence every time. Without it, charts and results involving random elements differ between runs, making the analysis non-reproducible.' },
    ],
    ide: {
      language: 'r',
      task: 'Using the built-in airquality dataset: (1) run the data_quality() function to count NAs per column, (2) remove rows with ANY missing value using na.omit() and compare row counts, (3) compute mean Ozone, Solar.R, Wind, and Temp grouped by Month using dplyr, (4) find which month has the highest average Ozone, (5) test if Ozone differs between months 5 and 8 with a t-test.',
      starterCode: `library(dplyr)

data(airquality)

# 1: NA counts per column
cat("NA counts:\\n")
print(colSums(is.na(airquality)))

# 2: Remove NAs and compare
clean <- na.omit(airquality)
cat(sprintf("\\nRows: original=%d, clean=%d (removed %d)\\n",
    nrow(airquality), nrow(clean), nrow(airquality) - nrow(clean)))

# 3: Monthly means with dplyr
monthly_stats <- clean %>%
  group_by(Month) %>%
  # TODO: summarise mean of Ozone, Solar.R, Wind, Temp
  summarise(n = n())  # replace with real summarise

print(monthly_stats)

# 4: Month with highest average Ozone
# TODO: which month has max mean Ozone? use slice_max

# 5: t-test Ozone: May (5) vs August (8)
may <- clean$Ozone[clean$Month == 5]
aug <- clean$Ozone[clean$Month == 8]
# TODO: t.test(may, aug) and print result`,
      solution: `library(dplyr)

data(airquality)

cat("NA counts:\\n")
print(colSums(is.na(airquality)))

clean <- na.omit(airquality)
cat(sprintf("\\nRows: original=%d, clean=%d (removed %d)\\n",
    nrow(airquality), nrow(clean), nrow(airquality) - nrow(clean)))

monthly_stats <- clean %>%
  group_by(Month) %>%
  summarise(
    mean_ozone  = round(mean(Ozone), 1),
    mean_solar  = round(mean(Solar.R), 1),
    mean_wind   = round(mean(Wind), 1),
    mean_temp   = round(mean(Temp), 1),
    n           = n(),
    .groups     = "drop"
  )

print(monthly_stats)

best_month <- monthly_stats %>%
  slice_max(mean_ozone, n = 1)
cat(sprintf("\\nHighest avg Ozone: Month %d (%.1f ppb)\\n",
    best_month$Month, best_month$mean_ozone))

may <- clean$Ozone[clean$Month == 5]
aug <- clean$Ozone[clean$Month == 8]
result <- t.test(may, aug)
cat(sprintf("\\nt-test May vs Aug: t=%.2f, p=%.4f\\n",
    result$statistic, result$p.value))
cat(sprintf("May mean=%.1f, Aug mean=%.1f\\n",
    mean(may), mean(aug)))`,
      hints: [
        'summarise(mean_ozone = mean(Ozone), mean_temp = mean(Temp), ..., .groups="drop")',
        'slice_max(mean_ozone, n=1) returns the row with the highest mean_ozone.',
        'Filter by Month: clean$Ozone[clean$Month == 5]',
      ],
    },
  },
]
