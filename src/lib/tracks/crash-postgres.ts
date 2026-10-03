import type { Course } from '../courses'

const CC_POSTGRES_OBJ = 'Write real PostgreSQL — queries, joins, indexes, transactions, and schema design patterns used in production Supabase and Next.js projects.'

export const crashPostgresCourses: Course[] = [
  {
    id: 'cc-postgres-m01', track: 'crash', title: 'Environment, SQL Fundamentals & Your First Real Schema',
    subtitle: 'Set up VS Code for Postgres, understand relational databases from first principles, and design a 3-table schema with foreign keys.',
    moduleObjective: 'Set up a PostgreSQL environment, write all four DML statements, and create a multi-table schema with proper foreign key constraints.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Basic',
    xp: 150, duration: 12, module: 1, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'Relational database', definition: 'A database organized into tables of rows and columns, with relationships enforced by foreign keys. Each table has a primary key uniquely identifying every row.' },
      { term: 'Primary key', definition: 'A column (or set of columns) that uniquely identifies every row. No two rows share the same primary key. Often a UUID or auto-incrementing integer.' },
      { term: 'Foreign key', definition: 'A column that references the primary key of another table, creating a relationship. Enforces referential integrity — you cannot reference a row that does not exist.' },
      { term: 'DML', definition: 'Data Manipulation Language — SELECT, INSERT, UPDATE, DELETE. Operates on rows within tables.' },
      { term: 'DDL', definition: 'Data Definition Language — CREATE TABLE, ALTER TABLE, DROP TABLE. Defines and modifies the structure of the database.' },
    ],
    content: `## Environment, SQL Fundamentals & Your First Real Schema

### Step 1 — Set Up Your Environment

**Option A: VS Code + Local PostgreSQL (recommended for learning)**

1. Download **PostgreSQL 16** from postgresql.org/download. Run the installer with default options. Remember the password you set for the \`postgres\` user.
2. In VS Code, install the **"PostgreSQL" extension by Chris Kolkman** (search "postgresql" in the Extensions panel).
3. Click the PostgreSQL icon in the sidebar. Click "Add Connection". Enter: host \`localhost\`, port \`5432\`, user \`postgres\`, your password, database \`postgres\`.
4. Click Connect — you now have a live SQL editor connected to a real Postgres database.

**Option B: Supabase (free cloud Postgres, no install needed)**

1. Create a free project at supabase.com. Wait ~2 minutes for provisioning.
2. Install the same PostgreSQL VS Code extension. Your connection string is at: Settings → Database → Connection string (URI format).
3. Paste that connection string into the extension. Done — you have a cloud Postgres database.

Both options let you run SQL queries directly in VS Code. Write a query, press F5 (or click Run), see results instantly.

### What IS a Relational Database? — First Principles

Before writing SQL, understand *why* relational databases exist.

**The problem they solve:** Imagine tracking student enrollments in a spreadsheet. If Jordan takes 10 courses, Jordan's name, email, and phone number appear 10 times across 10 rows. When Jordan's email changes, you update 10 rows — miss one and your data is inconsistent. This is *data redundancy*, and it causes *update anomalies*.

**The relational solution:** Separate data into tables and link them by reference. Jordan's info lives in exactly one row in a \`users\` table. Enrollments live in an \`enrollments\` table that says "user ID abc123 enrolled in course ID cc-postgres-m01." Jordan's email is stored once. Change it once and it's updated everywhere.

**Tables = Spreadsheets + Rules**

A table is like a spreadsheet where:
- **Columns** are typed fields: TEXT, INTEGER, BOOLEAN, UUID, TIMESTAMPTZ
- **Rows** are individual records
- **Constraints** enforce rules: NOT NULL (required field), UNIQUE (no duplicates), CHECK (must satisfy a condition)

**Primary keys** uniquely identify each row. Common patterns:
\`\`\`sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()  -- modern pattern
id SERIAL PRIMARY KEY                           -- auto-increment integer
\`\`\`

**Foreign keys** create relationships between tables. A foreign key column in one table points to the primary key column in another. The database enforces this — you *cannot* insert a row with a foreign key referencing a non-existent parent row.

### Design a Real 3-Table Schema

A learning platform needs three tables: \`users\` (who), \`courses\` (what), and \`enrollments\` (who completed what). Here is the schema from scratch:

\`\`\`sql
-- Create the foundation tables first (DDL)

CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  total_xp     INT  NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE courses (
  id       TEXT PRIMARY KEY,           -- e.g. 'cc-postgres-m01'
  title    TEXT NOT NULL,
  track    TEXT NOT NULL,
  xp       INT  NOT NULL DEFAULT 0 CHECK (xp >= 0),
  duration INT  NOT NULL CHECK (duration > 0),
  level    TEXT NOT NULL CHECK (level IN ('Basic', 'Masters', 'PhD', 'Next-Gen AI')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table — links users to courses
CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   TEXT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  xp_earned   INT  NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
  quiz_score  INT  CHECK (quiz_score BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)    -- each user completes each course at most once
);
\`\`\`

**Why the constraints matter:**
- \`REFERENCES users(id) ON DELETE CASCADE\` — delete a user and their enrollments are automatically removed
- \`REFERENCES courses(id) ON DELETE RESTRICT\` — prevents deleting a course that has enrollments
- \`UNIQUE (user_id, course_id)\` — composite unique constraint; prevents duplicate completions

### The Four DML Operations

With the schema created, run the four CRUD operations:

\`\`\`sql
-- INSERT — add rows. RETURNING gives back generated values immediately.
INSERT INTO users (email, display_name)
VALUES ('jordan@example.com', 'Jordan')
RETURNING id, created_at;

INSERT INTO courses (id, title, track, xp, duration, level)
VALUES ('cc-postgres-m01', 'SQL Fundamentals', 'crash', 150, 12, 'Basic');

-- Use the UUID returned by the first INSERT here
INSERT INTO enrollments (user_id, course_id, xp_earned, quiz_score)
VALUES ('your-uuid-from-above', 'cc-postgres-m01', 150, 92)
RETURNING id, completed_at;

-- SELECT — query data
SELECT * FROM users WHERE email = 'jordan@example.com';

SELECT * FROM courses
WHERE track = 'crash'
ORDER BY xp DESC
LIMIT 10;

-- UPDATE — always use WHERE or you update every row
UPDATE users
SET display_name = 'Jordan Morris'
WHERE id = 'your-uuid'
RETURNING id, display_name;

-- DELETE — always use WHERE
DELETE FROM enrollments
WHERE user_id = 'your-uuid' AND course_id = 'cc-postgres-m01'
RETURNING id;
\`\`\`

### The RETURNING Clause — PostgreSQL Superpower

Unlike other databases, PostgreSQL lets you get modified rows back immediately after INSERT/UPDATE/DELETE without a separate SELECT query:

\`\`\`sql
-- Get the new user's auto-generated UUID instantly
INSERT INTO users (email, display_name)
VALUES ('alex@example.com', 'Alex')
RETURNING id;

-- Update and confirm what changed
UPDATE users
SET total_xp = total_xp + 150
WHERE email = 'alex@example.com'
RETURNING id, total_xp;
\`\`\`

This pattern appears in every production Postgres app — create a parent record, get its ID, use that ID to create child records in one atomic flow.`,
    quiz: [
      { q: 'What problem does a relational database solve compared to a flat spreadsheet?', options: ['It is faster', 'Data redundancy — each fact is stored once and referenced by ID, preventing update anomalies', 'It stores images', 'It is easier to use'], correct: 1, explanation: 'Storing Jordan\'s email once per enrollment row means multiple places to update when it changes — and inconsistency when one is missed. Relational design stores it once in users and references it everywhere.' },
      { q: 'What does ON DELETE CASCADE mean on a foreign key?', options: ['Prevents deletion of the parent row', 'When the parent row is deleted, automatically delete all child rows referencing it', 'Required for all foreign keys', 'Copies the parent row data'], correct: 1, explanation: 'CASCADE propagates deletion down the relationship. Delete user → their enrollments are deleted automatically. ON DELETE RESTRICT (default) prevents deletion if child rows exist.' },
      { q: 'What does RETURNING do in an INSERT statement?', options: ['Required by PostgreSQL', 'Returns the inserted row including auto-generated values like UUID and timestamps — no extra SELECT needed', 'Rolls back on failure', 'Same as SELECT after INSERT'], correct: 1, explanation: 'RETURNING is a PostgreSQL extension. It returns the affected rows after INSERT/UPDATE/DELETE. Essential for getting generated UUIDs and timestamps immediately.' },
      { q: 'Why use UNIQUE (user_id, course_id) on enrollments?', options: ['For faster JOINs', 'Prevents duplicate enrollments — the combination of user_id and course_id must be unique across the table', 'Required for foreign keys', 'Same as primary key'], correct: 1, explanation: 'Composite UNIQUE ensures each user-course pair appears at most once. A user can enroll in many courses; many users can enroll in the same course — but no user-course duplicate.' },
    ],
    ide: {
      language: 'sql',
      task: 'Design a blog database. Create three tables: authors (id UUID, name, email unique, bio), posts (id UUID, title, body, status constrained to draft/published/archived, author_id foreign key, published_at nullable), and comments (id UUID, post_id foreign key, author_name, body, created_at). Then: (1) INSERT 2 authors, 3 posts (mix of statuses), 4 comments. (2) SELECT all published posts ordered by published_at descending. (3) SELECT all comments for one specific post.',
      starterCode: `-- Blog Schema Exercise
-- Build out each table with proper types, constraints, and foreign keys

CREATE TABLE authors (
  -- TODO: id UUID primary key with auto-generation
  -- TODO: name NOT NULL
  -- TODO: email NOT NULL UNIQUE
  -- TODO: bio optional text
  -- TODO: created_at with default
);

CREATE TABLE posts (
  -- TODO: id UUID primary key
  -- TODO: title NOT NULL
  -- TODO: body NOT NULL
  -- TODO: status with CHECK constraint (draft, published, archived)
  -- TODO: author_id foreign key -> authors, ON DELETE CASCADE
  -- TODO: published_at TIMESTAMPTZ (nullable)
  -- TODO: created_at with default
);

CREATE TABLE comments (
  -- TODO: id UUID primary key
  -- TODO: post_id foreign key -> posts, ON DELETE CASCADE
  -- TODO: author_name NOT NULL
  -- TODO: body NOT NULL
  -- TODO: created_at with default
);

-- INSERT 2 authors

-- INSERT 3 posts (at least 1 published, 1 draft)

-- INSERT 4 comments

-- SELECT all published posts ordered by published_at DESC

-- SELECT all comments for one specific post
`,
      solution: `CREATE TABLE authors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  bio        TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'published', 'archived')),
  author_id    UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO authors (name, email, bio) VALUES
  ('Jordan Morris', 'jordan@jst.com', 'Founder & full-stack developer'),
  ('Alex Thompson', 'alex@example.com', 'Technical writer and educator')
RETURNING id, name;

-- Use actual UUIDs from above in a real run
-- For demo purposes, subquery pattern:
INSERT INTO posts (title, body, status, author_id, published_at)
SELECT title, body, status, a.id, published_at
FROM (VALUES
  ('Getting Started with PostgreSQL', 'PostgreSQL is the most advanced open-source database.', 'published', 'jordan@jst.com', now()),
  ('Advanced Query Patterns', 'Window functions change how you think about SQL.', 'published', 'jordan@jst.com', now() - interval '2 days'),
  ('Draft: Performance Tuning', 'Work in progress on indexes and EXPLAIN ANALYZE.', 'draft', 'alex@example.com', NULL)
) AS p(title, body, status, author_email, published_at)
JOIN authors a ON a.email = p.author_email;

INSERT INTO comments (post_id, author_name, body)
SELECT p.id, c.name, c.body
FROM (VALUES
  ('Getting Started with PostgreSQL', 'Sam', 'Really helpful intro!'),
  ('Getting Started with PostgreSQL', 'Maria', 'Foreign key explanation was clear'),
  ('Advanced Query Patterns', 'Dev', 'PARTITION BY finally makes sense'),
  ('Advanced Query Patterns', 'Jordan', 'Bookmarking this for reference')
) AS c(post_title, name, body)
JOIN posts p ON p.title = c.post_title;

-- Published posts
SELECT id, title, published_at
FROM posts
WHERE status = 'published'
ORDER BY published_at DESC;

-- Comments for a specific post
SELECT c.author_name, c.body, c.created_at
FROM comments c
JOIN posts p ON p.id = c.post_id
WHERE p.title = 'Getting Started with PostgreSQL'
ORDER BY c.created_at;
`,
      hints: [
        'UUID primary key: id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'Constrain status with: CHECK (status IN (\'draft\', \'published\', \'archived\'))',
        'Foreign key syntax: author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE',
        'Filter by status in SELECT: WHERE status = \'published\'',
        'Join comments to posts: FROM comments c JOIN posts p ON p.id = c.post_id'
      ]
    }
  },
  {
    id: 'cc-postgres-m02', track: 'crash', title: 'Joins & Relationships',
    subtitle: 'Query data across related tables with INNER, LEFT, and other JOIN types.',
    moduleObjective: 'Write INNER JOIN and LEFT JOIN queries to combine data from related tables.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Basic',
    xp: 150, duration: 11, module: 2, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'INNER JOIN', definition: 'Returns rows where the join condition matches in BOTH tables. Missing matches are excluded.' },
      { term: 'LEFT JOIN', definition: 'Returns ALL rows from the left table plus matched rows from the right. Unmatched right rows become NULL.' },
      { term: 'Foreign key', definition: 'A column that references the primary key of another table. Enforces referential integrity.' },
      { term: 'ON clause', definition: 'Specifies the join condition: JOIN profiles ON profiles.id = progress.user_id.' },
      { term: 'Table alias', definition: 'Short name for a table in a query: FROM progress p JOIN profiles u ON u.id = p.user_id.' },
    ],
    content: `## Joins & Relationships

Joins combine data from related tables. Understanding INNER vs LEFT JOIN is essential for any non-trivial query.

### Why Joins Exist

Data is split across tables to eliminate redundancy. But to display meaningful information — "Jordan completed PostgreSQL Fundamentals on Monday" — you need to pull Jordan's name from \`users\`, the course title from \`courses\`, and the completion date from \`enrollments\`. Joins combine these tables into a single result set.

### INNER JOIN (only matching rows)

\`\`\`sql
-- Users who have completed courses
SELECT
  u.email,
  e.course_id,
  e.xp_earned,
  e.completed_at
FROM enrollments e
INNER JOIN users u ON u.id = e.user_id
WHERE e.course_id LIKE 'cc-%'
ORDER BY e.completed_at DESC;
\`\`\`

INNER JOIN excludes rows that have no match. If a user has no enrollments, they do not appear in this result.

### LEFT JOIN (all left + matching right)

\`\`\`sql
-- ALL users, with their enrollment counts (even users with zero completions)
SELECT
  u.email,
  COUNT(e.id) AS completed_courses,
  COALESCE(SUM(e.xp_earned), 0) AS total_xp
FROM users u
LEFT JOIN enrollments e ON e.user_id = u.id
GROUP BY u.id, u.email
ORDER BY total_xp DESC;
\`\`\`

LEFT JOIN keeps every row from the left table (\`users\`). Users with no enrollments appear with NULL for the enrollment columns — COALESCE converts NULL to 0.

### Three-Table Join

\`\`\`sql
-- Full enrollment details: course title, user name, completion date
SELECT
  c.title,
  c.xp AS course_xp,
  u.display_name,
  e.completed_at,
  e.quiz_score
FROM enrollments e
INNER JOIN courses c ON c.id = e.course_id
INNER JOIN users   u ON u.id = e.user_id
WHERE u.email = 'jordan@example.com'
ORDER BY e.completed_at DESC;
\`\`\`

Each JOIN adds another table. Chain as many as needed. Use table aliases (e, c, u) to keep the query readable.

### Self-Join

\`\`\`sql
-- Find users who completed the same course as a given user
SELECT DISTINCT u2.email
FROM enrollments e1
INNER JOIN enrollments e2 ON e2.course_id = e1.course_id
                          AND e2.user_id != e1.user_id
INNER JOIN users u2 ON u2.id = e2.user_id
WHERE e1.user_id = 'uuid-here';
\`\`\`

A self-join joins a table to itself using aliases. Here \`e1\` is the given user's enrollments; \`e2\` finds other users in the same courses.`,
    quiz: [
      { q: 'What does INNER JOIN return?', options: ['All rows from both tables', 'Only rows where the join condition matches in both tables', 'Left table only', 'NULL rows'], correct: 1, explanation: 'INNER JOIN filters to only rows where a match exists in both tables. Rows in either table without a match are excluded.' },
      { q: 'When do you use LEFT JOIN over INNER JOIN?', options: ['When tables are large', 'When you need ALL rows from the left table, even if there are no matching rows on the right', 'For better performance', 'Always'], correct: 1, explanation: 'LEFT JOIN keeps all left-table rows. Unmatched right-table columns become NULL. Use for "show all users and their (optional) progress."' },
      { q: 'What does COALESCE do?', options: ['Joins tables', 'Returns the first non-NULL value from its arguments — COALESCE(sum, 0) returns 0 if sum is NULL', 'Counts NULL values', 'Required for LEFT JOINs'], correct: 1, explanation: 'COALESCE(value, fallback) returns value if not NULL, otherwise fallback. Essential for handling NULLs from LEFT JOINs.' },
      { q: 'What is a table alias?', options: ['A copy of the table', 'A short name for a table within a query — FROM enrollments e means e.column instead of enrollments.column', 'Required for JOINs', 'A view'], correct: 1, explanation: 'Table aliases shorten repeated table references. Required when joining a table to itself (self-join) so you can distinguish the two instances.' },
    ],
    ide: {
      language: 'sql',
      task: 'Using the blog schema from Module 1 (authors, posts, comments), write three JOIN queries: (1) INNER JOIN — get all published posts with their author names and emails. (2) LEFT JOIN + GROUP BY — get all authors and their post counts (include authors with zero posts). (3) Three-table join — get all comments with the post title and the post\'s author name.',
      starterCode: `-- JOIN Practice on Blog Schema
-- Assume the authors, posts, comments tables exist from Module 1

-- Query 1: INNER JOIN
-- Get all published posts with author name and email
-- Columns: post title, post status, author name, author email, published_at
SELECT
  -- TODO: write the SELECT columns
FROM posts p
-- TODO: JOIN to authors
WHERE p.status = 'published'
ORDER BY p.published_at DESC;

-- Query 2: LEFT JOIN + GROUP BY
-- Get ALL authors with their post counts (include authors with no posts)
-- Columns: author name, total_posts
SELECT
  a.name,
  -- TODO: count posts
FROM authors a
-- TODO: LEFT JOIN posts
GROUP BY a.id, a.name
ORDER BY total_posts DESC;

-- Query 3: Three-table join
-- Get all comments with post title and post's author name
-- Columns: comment body, commenter name, post title, post author name
SELECT
  -- TODO: write columns
FROM comments c
-- TODO: JOIN posts, then JOIN authors
ORDER BY c.created_at DESC;
`,
      solution: `-- Query 1: INNER JOIN
SELECT
  p.title AS post_title,
  p.status,
  a.name  AS author_name,
  a.email AS author_email,
  p.published_at
FROM posts p
INNER JOIN authors a ON a.id = p.author_id
WHERE p.status = 'published'
ORDER BY p.published_at DESC;

-- Query 2: LEFT JOIN + GROUP BY
SELECT
  a.name,
  COUNT(p.id) AS total_posts
FROM authors a
LEFT JOIN posts p ON p.author_id = a.id
GROUP BY a.id, a.name
ORDER BY total_posts DESC;

-- Query 3: Three-table join
SELECT
  c.body         AS comment_body,
  c.author_name  AS commenter_name,
  p.title        AS post_title,
  a.name         AS post_author_name
FROM comments c
INNER JOIN posts   p ON p.id = c.post_id
INNER JOIN authors a ON a.id = p.author_id
ORDER BY c.created_at DESC;
`,
      hints: [
        'INNER JOIN: FROM posts p INNER JOIN authors a ON a.id = p.author_id',
        'LEFT JOIN: FROM authors a LEFT JOIN posts p ON p.author_id = a.id (left table is authors)',
        'COUNT(p.id) counts non-NULL post IDs — authors with no posts get COUNT = 0',
        'For 3-table join: first JOIN posts, then JOIN authors from posts.author_id'
      ]
    }
  },
  {
    id: 'cc-postgres-m03', track: 'crash', title: 'Aggregates & Window Functions',
    subtitle: 'Summarize data with GROUP BY aggregates and rank rows with window functions.',
    moduleObjective: 'Use COUNT, SUM, AVG with GROUP BY and apply ROW_NUMBER with window functions.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'Aggregate function', definition: 'Reduces multiple rows to one value: COUNT(), SUM(), AVG(), MIN(), MAX().' },
      { term: 'GROUP BY', definition: 'Groups rows sharing the same value. Required when mixing aggregates with non-aggregate columns.' },
      { term: 'HAVING', definition: 'Filters after GROUP BY — like WHERE but for aggregated values. HAVING COUNT(*) > 5.' },
      { term: 'Window function', definition: 'Calculates across rows related to the current row without collapsing them: ROW_NUMBER(), RANK(), LAG().' },
      { term: 'OVER (PARTITION BY)', definition: 'Defines the window for a window function — the subset of rows it operates on.' },
    ],
    content: `## Aggregates & Window Functions

Aggregates summarize data. Window functions compute across rows while keeping individual row context.

### Aggregates with GROUP BY

\`\`\`sql
-- Count completions per track
SELECT
  LEFT(course_id, 8) AS crash_id,  -- e.g. cc-js
  COUNT(*) AS completions,
  AVG(xp_earned) AS avg_xp,
  MAX(completed_at) AS last_completion
FROM enrollments
GROUP BY LEFT(course_id, 8)
ORDER BY completions DESC;

-- Filter groups with HAVING
SELECT
  user_id,
  COUNT(*) AS completed_count,
  SUM(xp_earned) AS total_xp
FROM enrollments
GROUP BY user_id
HAVING SUM(xp_earned) > 500  -- only users with 500+ total XP
ORDER BY total_xp DESC;
\`\`\`

### Window Functions

\`\`\`sql
-- Rank users by total XP (dense rank — no gaps)
SELECT
  user_id,
  SUM(xp_earned) AS total_xp,
  DENSE_RANK() OVER (ORDER BY SUM(xp_earned) DESC) AS rank
FROM enrollments
GROUP BY user_id;

-- Row number within each track
SELECT
  course_id,
  user_id,
  xp_earned,
  ROW_NUMBER() OVER (
    PARTITION BY LEFT(course_id, 8)  -- reset per crash course
    ORDER BY xp_earned DESC
  ) AS rank_in_course
FROM enrollments;
\`\`\`

### Running Total

\`\`\`sql
SELECT
  completed_at::date AS day,
  COUNT(*) AS daily_completions,
  SUM(COUNT(*)) OVER (ORDER BY completed_at::date) AS cumulative
FROM enrollments
GROUP BY completed_at::date
ORDER BY day;
\`\`\``,
    quiz: [
      { q: 'What is the difference between WHERE and HAVING?', options: ['They are identical', 'WHERE filters rows before aggregation; HAVING filters groups after aggregation', 'HAVING is faster', 'WHERE is for JOINs'], correct: 1, explanation: 'WHERE runs before GROUP BY — filters individual rows. HAVING runs after GROUP BY — filters aggregated groups. You cannot use aggregate functions in WHERE.' },
      { q: 'What does PARTITION BY do in a window function?', options: ['Splits the table physically', 'Defines the subset of rows the window function operates on — resets the calculation per group', 'Same as GROUP BY', 'Required for window functions'], correct: 1, explanation: 'PARTITION BY is like GROUP BY for window functions — it resets the window calculation for each partition group without collapsing rows.' },
      { q: 'What does DENSE_RANK() do differently from RANK()?', options: ['They are identical', 'DENSE_RANK has no gaps in ranking — tied rows get the same rank, next rank is sequential (1,2,2,3). RANK skips (1,2,2,4).', 'DENSE_RANK is faster', 'RANK includes NULL'], correct: 1, explanation: 'If two rows tie at rank 2, RANK gives the next row rank 4 (skipping 3). DENSE_RANK gives it rank 3 — no gaps.' },
      { q: 'When do you use window functions vs GROUP BY?', options: ['They are interchangeable', 'Window functions keep individual rows; GROUP BY collapses them. Use window functions when you need per-row results with aggregate context', 'GROUP BY is always better', 'Window functions only for ranking'], correct: 1, explanation: 'GROUP BY reduces N rows to one per group. Window functions let you compute rank, running total, etc. while keeping every row in the result.' },
    ],
  },
  {
    id: 'cc-postgres-m04', track: 'crash', title: 'Indexes & Query Performance',
    subtitle: 'Speed up queries with indexes and understand EXPLAIN ANALYZE output.',
    moduleObjective: 'Create appropriate indexes and use EXPLAIN ANALYZE to identify slow queries.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Masters',
    xp: 175, duration: 11, module: 4, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'B-tree index', definition: 'The default index type. Optimizes =, <, >, BETWEEN, ORDER BY on a column. 95% of use cases.' },
      { term: 'EXPLAIN ANALYZE', definition: 'Runs the query and shows the actual execution plan with costs and row counts. The primary performance debugging tool.' },
      { term: 'Seq scan', definition: 'Sequential scan — reads every row in the table. Slow on large tables. Usually means a missing index.' },
      { term: 'Index scan', definition: 'Uses an index to find matching rows directly. Fast. Shows up in EXPLAIN as "Index Scan on idx_name".' },
      { term: 'Composite index', definition: 'Index on multiple columns. ORDER matters: (user_id, course_id) is different from (course_id, user_id).' },
    ],
    content: `## Indexes & Query Performance

Indexes are the primary performance tool in PostgreSQL. EXPLAIN ANALYZE shows you where time is actually spent.

### Why Indexes Matter

Without an index, PostgreSQL reads *every row* in the table to find matches — a "sequential scan." On a table with 1 million rows, finding one record might require reading all 1 million rows. An index is a sorted data structure (a B-tree) that lets Postgres jump directly to matching rows, like using a book's index instead of reading every page.

### Creating Indexes

\`\`\`sql
-- Single column (most common)
CREATE INDEX enrollments_user_id_idx ON enrollments (user_id);

-- Composite index (column order matters)
CREATE INDEX enrollments_user_course_idx ON enrollments (user_id, course_id);

-- Partial index (only index relevant rows — smaller and faster)
CREATE INDEX active_users_idx ON users (id)
WHERE deleted_at IS NULL;

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX enrollments_unique_idx ON enrollments (user_id, course_id);

-- Index on expression
CREATE INDEX course_track_idx ON enrollments (LEFT(course_id, 8));
\`\`\`

### EXPLAIN ANALYZE

\`\`\`sql
-- Run before creating an index
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE user_id = 'uuid-here';

-- Without index output:
-- Seq Scan on enrollments  (cost=0.00..5432.00 rows=5 width=80)
--   Filter: (user_id = 'uuid-here')
-- Execution Time: 187 ms

-- After: CREATE INDEX enrollments_user_id_idx ON enrollments (user_id);
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE user_id = 'uuid-here';

-- With index output:
-- Index Scan using enrollments_user_id_idx on enrollments  (cost=0.29..8.31 rows=5 width=80)
--   Index Cond: (user_id = 'uuid-here')
-- Execution Time: 0.2 ms
\`\`\`

The difference: 187ms → 0.2ms. That is a 935x speedup on a 100k-row table.

### When NOT to Index

\`\`\`sql
-- Do NOT index:
-- 1. Small tables (< 10k rows) — seq scan is faster than index overhead
-- 2. Low-cardinality columns (boolean, status with 3 options)
-- 3. Columns rarely used in WHERE / JOIN / ORDER BY
-- 4. Write-heavy tables — every index slows INSERT/UPDATE/DELETE

-- DO index:
-- 1. Foreign key columns (user_id, post_id) — always
-- 2. Frequently filtered columns
-- 3. Columns in ORDER BY on large tables
-- 4. Columns used in unique constraints
\`\`\`

### Reading EXPLAIN Output

Key terms to look for:
- **Seq Scan** — reading the whole table. Bad on large tables.
- **Index Scan** — using an index. Good.
- **cost=X..Y** — X is startup cost, Y is total cost (higher = slower)
- **rows=N** — estimated matching rows
- **actual time=X..Y** — real execution time in ms
- **Execution Time** — total query time at the bottom`,
    quiz: [
      { q: 'What is a Seq Scan in EXPLAIN output?', options: ['Fast scan of an index', 'Full table scan — reads every row. Usually means a missing or unused index', 'Parallel query', 'Normal for small tables'], correct: 1, explanation: 'Seq Scan means PostgreSQL read every row in the table looking for matches. On large tables this is slow. Create an index on the WHERE column to get an Index Scan instead.' },
      { q: 'What is a composite index and why does column order matter?', options: ['An index with two copies', 'An index on multiple columns. (user_id, course_id) efficiently supports WHERE user_id=? AND course_id=? but not WHERE course_id=? alone', 'Faster than single index', 'Same order always'], correct: 1, explanation: 'Composite indexes support queries using the leftmost columns. (user_id, course_id) helps filter by user_id or by both columns — but not course_id alone.' },
      { q: 'When is a partial index useful?', options: ['For partial data only', 'When you frequently query a subset of rows — index only active records, undeleted items. Smaller index = faster', 'Required for NULL columns', 'Postgres-only feature'], correct: 1, explanation: 'WHERE deleted_at IS NULL in the index skips soft-deleted rows. The index is smaller and faster since it only covers the active subset.' },
      { q: 'What is the cost of adding indexes?', options: ['None — always add more', 'Indexes speed up reads but slow down writes (INSERT/UPDATE/DELETE must update every index)', 'Only disk space', 'Only for large tables'], correct: 1, explanation: 'Every index must be maintained on INSERT, UPDATE, DELETE. Over-indexing a write-heavy table degrades write performance. Index purposefully.' },
    ],
    ide: {
      language: 'sql',
      task: 'Practice EXPLAIN ANALYZE and index creation. (1) Run EXPLAIN ANALYZE on a SELECT query filtering enrollments by user_id — observe the Seq Scan. (2) CREATE an index on enrollments(user_id). (3) Run EXPLAIN ANALYZE again — observe the Index Scan. (4) Create a composite index on enrollments(user_id, course_id). (5) Create a partial index on posts(author_id) WHERE status = \'published\'.',
      starterCode: `-- Index & EXPLAIN Practice

-- Step 1: EXPLAIN ANALYZE before any index
-- What scan type does PostgreSQL use?
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE user_id = 'some-uuid-here';

-- Step 2: Create a single-column index on user_id
-- TODO: CREATE INDEX enrollments_user_id_idx ON ...

-- Step 3: Run EXPLAIN ANALYZE again after the index
-- Observe the change from Seq Scan to Index Scan
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE user_id = 'some-uuid-here';

-- Step 4: Create a composite index for queries filtering both columns
-- TODO: CREATE INDEX enrollments_user_course_idx ON ...

-- Step 5: Create a partial index (only published posts)
-- This index only covers rows where status = 'published'
-- TODO: CREATE INDEX posts_published_author_idx ON posts ...
-- Hint: add WHERE status = 'published' at the end

-- Step 6: List all indexes on the enrollments table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'enrollments';
`,
      solution: `-- Step 1: EXPLAIN before index (will show Seq Scan)
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE user_id = 'some-uuid-here';
-- Output: Seq Scan on enrollments ...

-- Step 2: Create single-column index
CREATE INDEX enrollments_user_id_idx ON enrollments (user_id);

-- Step 3: EXPLAIN after index (should show Index Scan)
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE user_id = 'some-uuid-here';
-- Output: Index Scan using enrollments_user_id_idx ...

-- Step 4: Composite index
CREATE INDEX enrollments_user_course_idx ON enrollments (user_id, course_id);

-- Step 5: Partial index
CREATE INDEX posts_published_author_idx ON posts (author_id)
WHERE status = 'published';

-- Step 6: List indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'enrollments';
`,
      hints: [
        'CREATE INDEX syntax: CREATE INDEX name ON table (column)',
        'Composite index: CREATE INDEX name ON table (col1, col2)',
        'Partial index adds WHERE clause: CREATE INDEX name ON table (column) WHERE condition',
        'EXPLAIN ANALYZE actually runs the query — use on a table with real data for meaningful output',
        'Look for "Seq Scan" vs "Index Scan" in EXPLAIN output to confirm the index is being used'
      ]
    }
  },
  {
    id: 'cc-postgres-m05', track: 'crash', title: 'Transactions & Constraints',
    subtitle: 'Ensure data integrity with transactions, foreign keys, and check constraints.',
    moduleObjective: 'Use transactions for atomic operations and define constraints to enforce data rules.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Masters',
    xp: 175, duration: 10, module: 5, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'Transaction', definition: 'A unit of work where all operations succeed or all are rolled back. Ensures atomicity.' },
      { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — properties PostgreSQL guarantees for every transaction.' },
      { term: 'ROLLBACK', definition: 'Cancels all changes in the current transaction. Called on error to prevent partial writes.' },
      { term: 'NOT NULL', definition: 'Column constraint — prevents NULL values. Set on columns that must always have a value.' },
      { term: 'CHECK constraint', definition: 'CHECK (xp > 0) — validates column values against a condition at insert/update time.' },
    ],
    content: `## Transactions & Constraints

Transactions make multiple operations atomic. Constraints enforce data rules at the database level — impossible to bypass.

### Transactions

\`\`\`sql
-- Transfer XP between users atomically
BEGIN;

UPDATE users
SET total_xp = total_xp - 100
WHERE id = 'sender-uuid'
  AND total_xp >= 100;  -- check balance

-- If first update affected 0 rows, something's wrong
-- Application code checks RETURNING and rolls back if needed

UPDATE users
SET total_xp = total_xp + 100
WHERE id = 'receiver-uuid';

COMMIT;
-- If any statement fails, ROLLBACK instead of COMMIT
\`\`\`

### Common Constraints

\`\`\`sql
CREATE TABLE courses (
  id TEXT PRIMARY KEY,                    -- NOT NULL + unique
  track TEXT NOT NULL,                    -- required
  title TEXT NOT NULL,
  xp INT NOT NULL DEFAULT 0,
  duration INT NOT NULL CHECK (duration > 0),      -- must be positive
  level TEXT NOT NULL CHECK (level IN ('Basic', 'Masters', 'PhD', 'Next-Gen AI')),
  module INT NOT NULL CHECK (module >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
\`\`\`

### Foreign Keys

\`\`\`sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  xp_earned INT NOT NULL CHECK (xp_earned >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)  -- each user completes each course once
);
\`\`\`

### Savepoints (Nested Transactions)

\`\`\`sql
BEGIN;
  INSERT INTO orders (user_id, total) VALUES ('uuid', 1000) RETURNING id;
  SAVEPOINT after_order;

  INSERT INTO order_items (order_id, product_id) VALUES (1, 99);
  -- If this fails, rollback to savepoint (not the whole transaction)
  ROLLBACK TO after_order;

COMMIT;
\`\`\``,
    quiz: [
      { q: 'What does BEGIN...COMMIT do?', options: ['Starts a timer', 'Wraps statements in a transaction — all succeed or all are rolled back', 'Required for all queries', 'Locks the table'], correct: 1, explanation: 'BEGIN starts a transaction block. COMMIT saves all changes atomically. If any statement fails, ROLLBACK undoes everything since BEGIN.' },
      { q: 'What does ON DELETE CASCADE mean on a foreign key?', options: ['Prevents deletion', 'When the parent row is deleted, automatically delete all child rows referencing it', 'Required for foreign keys', 'Opposite of RESTRICT'], correct: 1, explanation: 'CASCADE means child rows are automatically deleted when the parent is deleted. RESTRICT (default) prevents deletion if child rows exist.' },
      { q: 'What does UNIQUE (user_id, course_id) do?', options: ['Creates a unique user id', 'Ensures no two rows have the same combination of user_id AND course_id', 'Indexes both columns', 'Same as PRIMARY KEY'], correct: 1, explanation: 'Composite UNIQUE constraint — the combination must be unique. A user can complete the same course only once.' },
      { q: 'What does CHECK (level IN (...)) do?', options: ['Creates an enum type', 'Validates that every INSERT/UPDATE for that column uses an allowed value — database-enforced', 'Required by TypeScript', 'Same as an enum'], correct: 1, explanation: 'CHECK constraints are enforced by the database. Even if your application code sends an invalid value, the database rejects the INSERT/UPDATE.' },
    ],
  },
  {
    id: 'cc-postgres-m06', track: 'crash', title: 'CTEs & Advanced Queries',
    subtitle: 'Write readable complex queries with CTEs and use JSON operators.',
    moduleObjective: 'Use Common Table Expressions (CTEs) and JSON operators for complex data operations.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Masters',
    xp: 175, duration: 11, module: 6, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'CTE', definition: 'Common Table Expression — WITH name AS (...) SELECT. A named subquery that improves readability.' },
      { term: 'Recursive CTE', definition: 'WITH RECURSIVE — a CTE that references itself. Used for hierarchical data (categories, org charts).' },
      { term: 'JSONB', definition: 'Binary JSON column type. Supports indexing and operators: data->>\'key\', data @> \'{"active": true}\'.' },
      { term: 'Subquery', definition: 'A SELECT inside another SELECT. CTEs are often cleaner than subqueries for complex logic.' },
      { term: 'DISTINCT ON', definition: 'PostgreSQL extension — SELECT DISTINCT ON (col) returns one row per distinct value of col.' },
    ],
    content: `## CTEs & Advanced Queries

CTEs break complex queries into readable steps. PostgreSQL's JSON support handles semi-structured data without a separate document store.

### CTE (WITH clause)

\`\`\`sql
-- Find users who completed all 8 modules of a crash course
WITH crash_completions AS (
  SELECT
    user_id,
    LEFT(course_id, 8) AS crash_id,
    COUNT(*) AS modules_done
  FROM enrollments
  WHERE course_id LIKE 'cc-%'
  GROUP BY user_id, LEFT(course_id, 8)
),
certified_users AS (
  SELECT user_id, crash_id
  FROM crash_completions
  WHERE modules_done = 8
)
SELECT
  u.email,
  c.crash_id,
  now() AS certified_at
FROM certified_users c
INNER JOIN users u ON u.id = c.user_id
ORDER BY c.crash_id, u.email;
\`\`\`

### DISTINCT ON (PostgreSQL-specific)

\`\`\`sql
-- Latest enrollment entry per user
SELECT DISTINCT ON (user_id)
  user_id,
  course_id,
  completed_at
FROM enrollments
ORDER BY user_id, completed_at DESC;
\`\`\`

### JSONB Queries

\`\`\`sql
-- Table with JSONB column
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Query JSONB
SELECT payload->>'event_type' AS type,
       payload->>'user_id' AS user
FROM events
WHERE payload->>'event_type' = 'course_completed';

-- Contains operator
SELECT * FROM events
WHERE payload @> '{"event_type": "course_completed"}';

-- Index on JSONB
CREATE INDEX events_payload_gin ON events USING GIN (payload);
\`\`\``,
    quiz: [
      { q: 'What is the benefit of a CTE over a subquery?', options: ['CTEs are faster', 'CTEs are named and reusable within the query — more readable and maintainable than nested subqueries', 'Subqueries are deprecated', 'CTEs use less memory'], correct: 1, explanation: 'CTEs define named intermediate results that can be referenced multiple times. They make complex queries readable by breaking them into logical steps.' },
      { q: 'What does -> vs ->> do for JSONB?', options: ['They are identical', '-> returns JSONB; ->> returns TEXT. payload->\'key\' returns JSON; payload->>\'key\' returns a string', '-> is for arrays', 'Only ->> is supported'], correct: 1, explanation: 'payload->\'key\' returns the value as JSONB (for nesting). payload->>\'key\' extracts it as text (for comparison). Use ->> for WHERE clauses.' },
      { q: 'What does DISTINCT ON do?', options: ['Same as DISTINCT', 'Returns one row per distinct value of the specified column — which row is controlled by ORDER BY', 'Required for GROUP BY', 'Removes all duplicates'], correct: 1, explanation: 'DISTINCT ON (col) keeps one row per unique value of col. The ORDER BY determines which row is kept — ORDER BY col, date DESC keeps the most recent.' },
      { q: 'What index type is best for JSONB columns?', options: ['B-tree', 'GIN — Generalized Inverted Index handles JSONB containment and key existence queries', 'HASH', 'No index possible'], correct: 1, explanation: 'GIN indexes JSONB key-value pairs and support the @> (contains) and ? (key exists) operators. B-tree cannot index JSONB keys.' },
    ],
  },
  {
    id: 'cc-postgres-m07', track: 'crash', title: 'Schema Design Patterns',
    subtitle: 'Design normalized, extensible schemas for real-world production applications.',
    moduleObjective: 'Apply normalization and design a multi-entity schema with proper relationships.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'PhD',
    xp: 200, duration: 11, module: 7, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'Normalization', definition: 'Organizing schema to eliminate redundancy. 3NF: each non-key column depends only on the primary key.' },
      { term: 'Denormalization', definition: 'Intentionally storing redundant data for read performance. Cache a user\'s total_xp instead of SUM()ing every time.' },
      { term: 'Enum type', definition: 'CREATE TYPE level AS ENUM (\'Basic\',\'Masters\',\'PhD\') — a type-safe column with a fixed set of allowed values.' },
      { term: 'Soft delete', definition: 'deleted_at TIMESTAMPTZ — mark rows as deleted without removing them. Preserves history, allows undo.' },
      { term: 'Audit columns', definition: 'created_at, updated_at, created_by — track when and who changed data. Always include in production tables.' },
    ],
    content: `## Schema Design Patterns

Good schema design prevents problems that are painful to fix later. These patterns appear in every production PostgreSQL application.

### Standard Table Template

\`\`\`sql
CREATE TABLE courses (
  -- Identity
  id TEXT PRIMARY KEY,           -- natural key for courses (cc-js-m01)
  -- or for user tables:
  -- id UUID PRIMARY KEY DEFAULT gen_random_uuid()

  -- Business columns
  track TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Basic', 'Masters', 'PhD', 'Next-Gen AI')),
  xp INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
  module INT NOT NULL CHECK (module >= 1),

  -- Optional relations
  cert_area TEXT,

  -- Audit columns (always include)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
\$\$ LANGUAGE plpgsql;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
\`\`\`

### Enum Types

\`\`\`sql
CREATE TYPE course_level AS ENUM ('Basic', 'Masters', 'PhD', 'Next-Gen AI');
CREATE TYPE course_track AS ENUM ('crash', 'tech', 'marketing', 'trading');

CREATE TABLE courses (
  level course_level NOT NULL,
  track course_track NOT NULL,
  -- ...
);
\`\`\`

### Soft Delete

\`\`\`sql
ALTER TABLE courses ADD COLUMN deleted_at TIMESTAMPTZ;

-- "Delete"
UPDATE courses SET deleted_at = now() WHERE id = 'cc-js-m01';

-- Active records only
CREATE VIEW active_courses AS
  SELECT * FROM courses WHERE deleted_at IS NULL;

-- Index only active
CREATE INDEX active_courses_track_idx ON courses (track)
WHERE deleted_at IS NULL;
\`\`\``,
    quiz: [
      { q: 'What is normalization?', options: ['Making tables faster', 'Organizing schema to eliminate redundancy — each fact stored once', 'Adding indexes', 'Splitting large tables'], correct: 1, explanation: 'Normalization eliminates redundant data by ensuring each piece of information is stored in one place. Prevents update anomalies.' },
      { q: 'When should you denormalize?', options: ['Never — always normalize', 'When a computed value is read far more often than it changes — cache total_xp to avoid SUM() on every page load', 'For all user-facing tables', 'When the schema is complex'], correct: 1, explanation: 'Denormalization trades write complexity for read performance. Cache total_xp when it\'s shown on every page, even if it means updating it on every completion.' },
      { q: 'What is the benefit of a soft delete over DELETE?', options: ['Faster deletion', 'Preserves history, enables undo, maintains foreign key integrity, allows audit trails', 'Required for RLS', 'Less disk space'], correct: 1, explanation: 'Hard deletes are permanent and cascade to related data. Soft deletes preserve the row — you can restore it, audit it, and see historical state.' },
      { q: 'Why use PostgreSQL enum types?', options: ['Required for indexes', 'Type-safe column values — database rejects inserts with invalid values; also documents the allowed values in the schema', 'Faster than TEXT', 'Same as CHECK constraint'], correct: 1, explanation: 'Enum types are self-documenting and enforced at the DB level. More semantic than CHECK constraints — PostgreSQL shows the type in \\d table output.' },
    ],
  },
  {
    id: 'cc-postgres-m08', track: 'crash', title: 'Functions, Triggers & Security',
    subtitle: 'Automate logic with stored functions and triggers, and secure access with roles.',
    moduleObjective: 'Write PL/pgSQL functions and triggers to automate data integrity rules.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'Stored function', definition: 'A PL/pgSQL function stored in the database. Runs inside Postgres — no network round-trip.' },
      { term: 'Trigger', definition: 'A function that fires automatically on INSERT, UPDATE, or DELETE. For BEFORE or AFTER the row change.' },
      { term: 'SECURITY DEFINER', definition: 'Function runs with the privileges of the owner — can bypass RLS for admin operations.' },
      { term: 'SECURITY INVOKER', definition: 'Default. Function runs with the caller\'s privileges — respects RLS.' },
      { term: 'Roles & GRANT', definition: 'GRANT SELECT ON courses TO anon — controls which Postgres roles can access which tables.' },
    ],
    content: `## Functions, Triggers & Security

Stored functions and triggers move business logic into the database — guaranteeing it runs regardless of which client sends the query.

### Stored Function

\`\`\`sql
-- Award XP and update profile total in one atomic call
CREATE OR REPLACE FUNCTION complete_course(
  p_user_id UUID,
  p_course_id TEXT,
  p_xp INT,
  p_quiz_score INT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS \$\$
DECLARE
  v_existing enrollments;
BEGIN
  -- Prevent duplicate completion
  SELECT * INTO v_existing
  FROM enrollments
  WHERE user_id = p_user_id AND course_id = p_course_id;

  IF FOUND THEN
    RETURN json_build_object('success', false, 'reason', 'already_completed');
  END IF;

  INSERT INTO enrollments (user_id, course_id, xp_earned, quiz_score)
  VALUES (p_user_id, p_course_id, p_xp, p_quiz_score);

  UPDATE users
  SET total_xp = total_xp + p_xp
  WHERE id = p_user_id;

  RETURN json_build_object('success', true, 'xp_earned', p_xp);
END;
\$\$;

-- Call from Supabase client:
-- const { data } = await supabase.rpc('complete_course', { p_user_id, p_course_id, p_xp: 150 })
\`\`\`

### Trigger

\`\`\`sql
-- Auto-create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- run as owner, bypasses RLS
SET search_path = public
AS \$\$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
\$\$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
\`\`\`

### Roles and Grants (Supabase context)

\`\`\`sql
-- anon: unauthenticated users
-- authenticated: signed-in users

GRANT SELECT ON courses TO anon;
GRANT SELECT, INSERT, UPDATE ON enrollments TO authenticated;
REVOKE ALL ON enrollments FROM anon;
\`\`\``,
    quiz: [
      { q: 'What is the advantage of a stored function over application code?', options: ['Easier to write', 'Runs inside the database — atomic with other DB operations, no extra network round-trip, always enforced', 'Faster to deploy', 'TypeScript types'], correct: 1, explanation: 'Stored functions run server-side in Postgres. They\'re atomic with surrounding queries, avoid extra round-trips, and execute regardless of which client calls them.' },
      { q: 'What does SECURITY DEFINER mean?', options: ['Prevents RLS bypass', 'Function runs with the owner\'s privileges — can bypass RLS (use for triggers that need admin access)', 'Required for triggers', 'Same as SECURITY INVOKER'], correct: 1, explanation: 'SECURITY DEFINER runs as the function owner. Common pattern for triggers on auth.users (which RLS-restricted users can\'t access directly).' },
      { q: 'When does a BEFORE trigger run?', options: ['After COMMIT', 'Before the row change is written — can modify NEW values before they\'re saved', 'After DELETE only', 'Before BEGIN'], correct: 1, explanation: 'BEFORE triggers fire before the row is written. They can modify the NEW row or raise an exception to abort the operation.' },
      { q: 'What does supabase.rpc() do?', options: ['Calls a REST endpoint', 'Calls a PostgreSQL stored function — type-safe, runs server-side with full DB access', 'Sends a webhook', 'Required for transactions'], correct: 1, explanation: 'supabase.rpc(\'function_name\', args) calls a stored function. The result type can be typed with your Database generic for full TypeScript support.' },
    ],
  },
]
