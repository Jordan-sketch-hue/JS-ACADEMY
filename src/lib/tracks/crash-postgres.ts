import type { Course } from '../courses'

const CC_POSTGRES_OBJ = 'Write real PostgreSQL — queries, joins, indexes, transactions, and schema design patterns used in production Supabase and Next.js projects.'

export const crashPostgresCourses: Course[] = [
  {
    id: 'cc-postgres-m01', track: 'crash', title: 'PostgreSQL Fundamentals',
    subtitle: 'Write SELECT, INSERT, UPDATE, DELETE and understand Postgres data types.',
    moduleObjective: 'Write all four DML statements with WHERE, ORDER BY, and LIMIT clauses.',
    courseObjective: CC_POSTGRES_OBJ, crashId: 'cc-postgres', crashTitle: 'PostgreSQL', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'PostgreSQL Crash Course',
    keyTerms: [
      { term: 'DML', definition: 'Data Manipulation Language — SELECT, INSERT, UPDATE, DELETE. Operates on rows.' },
      { term: 'DDL', definition: 'Data Definition Language — CREATE TABLE, ALTER TABLE, DROP TABLE. Operates on schema structure.' },
      { term: 'NULL', definition: 'The absence of a value — not zero, not empty string. IS NULL / IS NOT NULL for comparison. NULL != NULL.' },
      { term: 'RETURNING', definition: 'PostgreSQL extension to INSERT/UPDATE/DELETE — returns the affected rows. RETURNING id, created_at.' },
      { term: 'Serial / Identity', definition: 'Auto-incrementing integer columns. GENERATED ALWAYS AS IDENTITY is the modern standard over SERIAL.' },
    ],
    content: `## PostgreSQL Fundamentals

PostgreSQL is the world's most advanced open-source relational database. Supabase runs on Postgres — understanding SQL gives you full control.

### SELECT

\`\`\`sql
-- All columns
SELECT * FROM courses;

-- Specific columns with alias
SELECT id, title, xp AS experience_points FROM courses;

-- Filter
SELECT * FROM courses WHERE track = 'crash' AND level = 'Basic';

-- Sort and limit
SELECT * FROM courses
ORDER BY xp DESC
LIMIT 10;

-- Range
SELECT * FROM courses WHERE xp BETWEEN 150 AND 200;

-- Pattern match
SELECT * FROM courses WHERE title ILIKE '%react%';  -- case-insensitive
\`\`\`

### INSERT

\`\`\`sql
-- Single row
INSERT INTO progress (user_id, course_id, xp_earned)
VALUES ('uuid-here', 'cc-js-m01', 150)
RETURNING id, completed_at;

-- Multiple rows
INSERT INTO progress (user_id, course_id, xp_earned) VALUES
  ('uuid1', 'cc-js-m01', 150),
  ('uuid1', 'cc-js-m02', 150);
\`\`\`

### UPDATE

\`\`\`sql
UPDATE profiles
SET display_name = 'Jordan', updated_at = now()
WHERE id = 'uuid-here'
RETURNING id, display_name;
\`\`\`

### DELETE

\`\`\`sql
-- Delete with filter (always use WHERE)
DELETE FROM sessions
WHERE expires_at < now()
RETURNING id;

-- TRUNCATE — deletes all rows fast (no WHERE, not logged row by row)
TRUNCATE TABLE temp_data;
\`\`\``,
    quiz: [
      { q: 'What does ILIKE do?', options: ['Exact match', 'Case-insensitive pattern match using % wildcard', 'Integer comparison', 'IS LIKE alternative'], correct: 1, explanation: 'ILIKE is PostgreSQL\'s case-insensitive LIKE. title ILIKE \'%react%\' matches "React", "react", "REACT". % matches any sequence of characters.' },
      { q: 'What does RETURNING do?', options: ['Required for INSERT', 'Returns the affected rows — see generated IDs or timestamps without a second query', 'Rolls back the transaction', 'Same as SELECT after INSERT'], correct: 1, explanation: 'RETURNING is a PostgreSQL extension that returns the rows modified by INSERT/UPDATE/DELETE. No need for a separate SELECT to get the new ID.' },
      { q: 'What is the difference between DELETE and TRUNCATE?', options: ['They are identical', 'DELETE removes rows with optional WHERE and fires triggers; TRUNCATE removes ALL rows instantly without logging each row', 'TRUNCATE is slower', 'DELETE requires a WHERE clause'], correct: 1, explanation: 'DELETE logs each row deletion and fires triggers. TRUNCATE is a DDL that removes all rows in one operation — faster, but no WHERE, no triggers, no RETURNING.' },
      { q: 'How do you check for NULL values?', options: ['= NULL', 'IS NULL / IS NOT NULL — NULL = NULL is always false in SQL', '== null', 'NULL()'], correct: 1, explanation: 'NULL represents the absence of a value. NULL = NULL is always false — use IS NULL or IS NOT NULL to check for NULL.' },
    ],
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

### INNER JOIN (only matching rows)

\`\`\`sql
-- Users who have completed courses
SELECT
  u.email,
  p.course_id,
  p.xp_earned,
  p.completed_at
FROM progress p
INNER JOIN auth.users u ON u.id = p.user_id
WHERE p.course_id LIKE 'cc-%'
ORDER BY p.completed_at DESC;
\`\`\`

### LEFT JOIN (all left + matching right)

\`\`\`sql
-- All users, with their progress (NULL if none)
SELECT
  u.email,
  COUNT(p.id) AS completed_courses,
  COALESCE(SUM(p.xp_earned), 0) AS total_xp
FROM auth.users u
LEFT JOIN progress p ON p.user_id = u.id
GROUP BY u.id, u.email
ORDER BY total_xp DESC;
\`\`\`

### Three-Table Join

\`\`\`sql
-- Course details with user progress and profile
SELECT
  c.title,
  c.xp AS course_xp,
  pr.display_name,
  p.completed_at,
  p.quiz_score
FROM progress p
INNER JOIN courses c ON c.id = p.course_id
INNER JOIN profiles pr ON pr.id = p.user_id
WHERE p.user_id = 'uuid-here'
ORDER BY p.completed_at DESC;
\`\`\`

### Self-Join

\`\`\`sql
-- Find users who completed the same course as a given user
SELECT DISTINCT u2.email
FROM progress p1
INNER JOIN progress p2 ON p2.course_id = p1.course_id AND p2.user_id != p1.user_id
INNER JOIN auth.users u2 ON u2.id = p2.user_id
WHERE p1.user_id = 'uuid-here';
\`\`\``,
    quiz: [
      { q: 'What does INNER JOIN return?', options: ['All rows from both tables', 'Only rows where the join condition matches in both tables', 'Left table only', 'NULL rows'], correct: 1, explanation: 'INNER JOIN filters to only rows where a match exists in both tables. Rows in either table without a match are excluded.' },
      { q: 'When do you use LEFT JOIN over INNER JOIN?', options: ['When tables are large', 'When you need ALL rows from the left table, even if there are no matching rows on the right', 'For better performance', 'Always'], correct: 1, explanation: 'LEFT JOIN keeps all left-table rows. Unmatched right-table columns become NULL. Use for "show all users and their (optional) progress."' },
      { q: 'What does COALESCE do?', options: ['Joins tables', 'Returns the first non-NULL value from its arguments — COALESCE(sum, 0) = 0 if sum is NULL', 'Counts NULL values', 'Required for LEFT JOINs'], correct: 1, explanation: 'COALESCE(value, fallback) returns value if not NULL, otherwise fallback. Essential for handling NULLs from LEFT JOINs.' },
      { q: 'What is a table alias?', options: ['A copy of the table', 'A short name for a table within a query — FROM progress p means p.column instead of progress.column', 'Required for JOINs', 'A view'], correct: 1, explanation: 'Table aliases (FROM progress p) shorten repeated table references. Required when joining a table to itself (self-join).' },
    ],
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
FROM progress
GROUP BY LEFT(course_id, 8)
ORDER BY completions DESC;

-- Filter groups with HAVING
SELECT
  user_id,
  COUNT(*) AS completed_count,
  SUM(xp_earned) AS total_xp
FROM progress
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
FROM progress
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
FROM progress;
\`\`\`

### Running Total

\`\`\`sql
SELECT
  completed_at::date AS day,
  COUNT(*) AS daily_completions,
  SUM(COUNT(*)) OVER (ORDER BY completed_at::date) AS cumulative
FROM progress
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

### Creating Indexes

\`\`\`sql
-- Single column (most common)
CREATE INDEX progress_user_id_idx ON progress (user_id);

-- Composite index (column order matters)
CREATE INDEX progress_user_course_idx ON progress (user_id, course_id);

-- Partial index (only index relevant rows)
CREATE INDEX active_users_idx ON users (id)
WHERE deleted_at IS NULL;

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX progress_unique_idx ON progress (user_id, course_id);

-- Index on expression
CREATE INDEX course_track_idx ON progress (LEFT(course_id, 8));
\`\`\`

### EXPLAIN ANALYZE

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM progress WHERE user_id = 'uuid-here';

-- Output:
-- Index Scan using progress_user_id_idx on progress  (cost=0.29..8.31 rows=5)
--   Index Cond: (user_id = 'uuid-here'::uuid)
-- Planning Time: 0.1 ms
-- Execution Time: 0.2 ms

-- Without index (seq scan on large table):
-- Seq Scan on progress  (cost=0.00..5432.00 rows=5)
--   Filter: (user_id = 'uuid-here'::uuid)
-- Execution Time: 187 ms
\`\`\`

### When NOT to Index

\`\`\`sql
-- Don't index:
-- 1. Small tables (seq scan is faster)
-- 2. Low-cardinality columns (boolean, status with 3 values)
-- 3. Columns rarely used in WHERE/JOIN/ORDER BY
-- 4. Tables with very high write volume (indexes slow down writes)

-- Do index:
-- 1. Foreign keys (user_id, order_id)
-- 2. Frequently filtered columns
-- 3. Columns used in ORDER BY on large tables
-- 4. Unique constraints
\`\`\``,
    quiz: [
      { q: 'What is a Seq Scan in EXPLAIN output?', options: ['Fast scan of an index', 'Full table scan — reads every row. Usually means a missing or unused index', 'Parallel query', 'Normal for small tables'], correct: 1, explanation: 'Seq Scan means PostgreSQL read every row in the table looking for matches. On large tables this is slow. Create an index on the WHERE column to get an Index Scan instead.' },
      { q: 'What is a composite index and why does column order matter?', options: ['An index with two copies', 'An index on multiple columns. (user_id, course_id) efficiently supports WHERE user_id=? AND course_id=? but not WHERE course_id=? alone', 'Faster than single index', 'Same order always'], correct: 1, explanation: 'Composite indexes support queries using the leftmost columns. (user_id, course_id) helps filter by user_id or by both columns — but not course_id alone.' },
      { q: 'When is a partial index useful?', options: ['For partial data only', 'When you frequently query a subset of rows — index only active records, undeleted items. Smaller index = faster', 'Required for NULL columns', 'Postgres-only feature'], correct: 1, explanation: 'WHERE deleted_at IS NULL in the index skips soft-deleted rows. The index is smaller and faster since it only covers the active subset.' },
      { q: 'What is the cost of adding indexes?', options: ['None — always add more', 'Indexes speed up reads but slow down writes (INSERT/UPDATE/DELETE must update every index)', 'Only disk space', 'Only for large tables'], correct: 1, explanation: 'Every index must be maintained on INSERT, UPDATE, DELETE. Over-indexing a write-heavy table degrades write performance. Index purposefully.' },
    ],
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

UPDATE profiles
SET total_xp = total_xp - 100
WHERE id = 'sender-uuid'
  AND total_xp >= 100;  -- check balance

-- If first update affected 0 rows, something's wrong
-- Application code checks RETURNING and rolls back if needed

UPDATE profiles
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
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  FROM progress
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
INNER JOIN auth.users u ON u.id = c.user_id
ORDER BY c.crash_id, u.email;
\`\`\`

### DISTINCT ON (PostgreSQL-specific)

\`\`\`sql
-- Latest progress entry per user
SELECT DISTINCT ON (user_id)
  user_id,
  course_id,
  completed_at
FROM progress
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
      { q: 'Why use PostgreSQL enum types?', options: ['Required for indexes', 'Type-safe column values — database rejects inserts with invalid values; also documents the allowed values in the schema', 'Faster than TEXT', 'Same as CHECK constraint'], correct: 1, explanation: 'Enum types are self-documenting and enforced at the DB level. More semantic than CHECK constraints — PostgreSQL shows the type in \d table output.' },
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
  v_existing progress;
BEGIN
  -- Prevent duplicate completion
  SELECT * INTO v_existing
  FROM progress
  WHERE user_id = p_user_id AND course_id = p_course_id;

  IF FOUND THEN
    RETURN json_build_object('success', false, 'reason', 'already_completed');
  END IF;

  INSERT INTO progress (user_id, course_id, xp_earned, quiz_score)
  VALUES (p_user_id, p_course_id, p_xp, p_quiz_score);

  UPDATE profiles
  SET total_xp = total_xp + p_xp
  WHERE id = p_user_id;

  RETURN json_build_object('success', true, 'xp_earned', p_xp);
END;
\$\$;

-- Call from Supabase client
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
  INSERT INTO public.profiles (id, email, display_name)
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
GRANT SELECT, INSERT, UPDATE ON progress TO authenticated;
REVOKE ALL ON progress FROM anon;
\`\`\``,
    quiz: [
      { q: 'What is the advantage of a stored function over application code?', options: ['Easier to write', 'Runs inside the database — atomic with other DB operations, no extra network round-trip, always enforced', 'Faster to deploy', 'TypeScript types'], correct: 1, explanation: 'Stored functions run server-side in Postgres. They\'re atomic with surrounding queries, avoid extra round-trips, and execute regardless of which client calls them.' },
      { q: 'What does SECURITY DEFINER mean?', options: ['Prevents RLS bypass', 'Function runs with the owner\'s privileges — can bypass RLS (use for triggers that need admin access)', 'Required for triggers', 'Same as SECURITY INVOKER'], correct: 1, explanation: 'SECURITY DEFINER runs as the function owner. Common pattern for triggers on auth.users (which RLS-restricted users can\'t access directly).' },
      { q: 'When does a BEFORE trigger run?', options: ['After COMMIT', 'Before the row change is written — can modify NEW values before they\'re saved', 'After DELETE only', 'Before BEGIN'], correct: 1, explanation: 'BEFORE triggers fire before the row is written. They can modify the NEW row or raise an exception to abort the operation.' },
      { q: 'What does supabase.rpc() do?', options: ['Calls a REST endpoint', 'Calls a PostgreSQL stored function — type-safe, runs server-side with full DB access', 'Sends a webhook', 'Required for transactions'], correct: 1, explanation: 'supabase.rpc(\'function_name\', args) calls a stored function. The result type can be typed with your Database generic for full TypeScript support.' },
    ],
  },
]
