import type { Course } from '../courses'

const CC_DATA_OBJ = 'Master SQL, Python data analysis, statistical thinking, visualization, and the end-to-end data pipeline so you can answer any business question and explain your methodology in a data analyst interview.'

export const crashInterviewDataCourses: Course[] = [
  {
    id: 'cc-interview-data-m01', track: 'crash', title: 'SQL for Data Analysis',
    subtitle: 'Window functions, CTEs, subqueries, and the SQL patterns every data analyst interview tests.',
    moduleObjective: 'Write complex analytical SQL using window functions, CTEs, and aggregations to answer real business questions.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 1, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'Window Function', definition: 'A function that operates across a set of rows related to the current row without collapsing them into one row.' },
      { term: 'CTE', definition: 'Common Table Expression — a named temporary result set defined with WITH, improving readability and reusability.' },
      { term: 'PARTITION BY', definition: 'Divides window function results by groups — like GROUP BY but keeps all rows.' },
      { term: 'ROW_NUMBER()', definition: 'Assigns sequential integers to rows within a partition, ordered by the specified column.' },
      { term: 'LAG / LEAD', definition: 'Window functions that access a previous/next row\'s value — used for period-over-period comparisons.' },
      { term: 'RANK vs DENSE_RANK', definition: 'RANK leaves gaps after ties (1,1,3); DENSE_RANK does not (1,1,2).' },
      { term: 'Running Total', definition: 'Cumulative SUM() with ORDER BY inside the window frame — shows growth over time.' },
    ],
    content: `## SQL for Data Analysis

### Window Functions — the most tested SQL topic

\`\`\`sql
-- Schema: orders(id, user_id, amount, created_at), users(id, name, country)

-- 1. Running total of revenue by date
SELECT
  DATE(created_at) AS order_date,
  SUM(amount) AS daily_revenue,
  SUM(SUM(amount)) OVER (ORDER BY DATE(created_at)) AS running_total
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date;

-- 2. Rank users by total spend (handle ties with DENSE_RANK)
SELECT
  u.name,
  SUM(o.amount) AS total_spend,
  DENSE_RANK() OVER (ORDER BY SUM(o.amount) DESC) AS rank
FROM orders o
JOIN users u ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY rank;

-- 3. Month-over-month revenue change (LAG)
WITH monthly AS (
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
  ROUND(
    (revenue - LAG(revenue) OVER (ORDER BY month)) /
    LAG(revenue) OVER (ORDER BY month) * 100, 2
  ) AS pct_change
FROM monthly
ORDER BY month;

-- 4. Top N per group (top 3 spenders per country)
WITH ranked AS (
  SELECT
    u.name,
    u.country,
    SUM(o.amount) AS total_spend,
    ROW_NUMBER() OVER (
      PARTITION BY u.country
      ORDER BY SUM(o.amount) DESC
    ) AS rn
  FROM orders o
  JOIN users u ON u.id = o.user_id
  GROUP BY u.id, u.name, u.country
)
SELECT name, country, total_spend
FROM ranked
WHERE rn <= 3
ORDER BY country, rn;
\`\`\`

### CTEs for readable complex queries

\`\`\`sql
-- Cohort retention analysis: what % of users from each month are still active?
WITH cohorts AS (
  -- Each user's signup month
  SELECT
    user_id,
    DATE_TRUNC('month', MIN(created_at)) AS cohort_month
  FROM orders
  GROUP BY user_id
),
activity AS (
  -- Each user's activity month
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('month', created_at) AS activity_month
  FROM orders
),
combined AS (
  SELECT
    c.cohort_month,
    a.activity_month,
    COUNT(DISTINCT c.user_id) AS active_users,
    EXTRACT(MONTH FROM AGE(a.activity_month, c.cohort_month)) AS months_since_signup
  FROM cohorts c
  JOIN activity a ON a.user_id = c.user_id
  GROUP BY 1, 2, 4
)
SELECT
  cohort_month,
  months_since_signup,
  active_users,
  FIRST_VALUE(active_users) OVER (
    PARTITION BY cohort_month ORDER BY months_since_signup
  ) AS cohort_size,
  ROUND(active_users * 100.0 /
    FIRST_VALUE(active_users) OVER (
      PARTITION BY cohort_month ORDER BY months_since_signup
    ), 1) AS retention_pct
FROM combined
ORDER BY cohort_month, months_since_signup;
\`\`\`

### Common interview SQL questions

\`\`\`sql
-- "Find users who have NOT made a purchase in the last 30 days"
SELECT u.id, u.email
FROM users u
WHERE u.id NOT IN (
  SELECT DISTINCT user_id
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
);

-- Or with LEFT JOIN (more efficient on large tables):
SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
  AND o.created_at >= NOW() - INTERVAL '30 days'
WHERE o.id IS NULL;

-- "Find duplicate emails"
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- "Calculate median order value" (Postgres)
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median_amount
FROM orders;
\`\`\``,
    quiz: [
      { q: 'What is the difference between ROW_NUMBER() and RANK() when there are ties?', options: ['They are identical', 'ROW_NUMBER() gives unique sequential numbers (no ties); RANK() gives the same rank to ties but leaves gaps after', 'RANK() gives unique numbers; ROW_NUMBER() allows ties', 'ROW_NUMBER() is for sorting; RANK() is for grouping'], correct: 1, explanation: 'For rows with the same value: ROW_NUMBER() assigns 1,2,3 arbitrarily. RANK() assigns 1,1,3 (skips 2). DENSE_RANK() assigns 1,1,2 (no gaps).' },
      { q: 'What does PARTITION BY do in a window function?', options: ['Splits the table into separate result sets', 'Divides the window into groups — the function resets and calculates independently within each group', 'Filters rows before the window function runs', 'Creates separate columns for each partition'], correct: 1, explanation: 'PARTITION BY is like GROUP BY for window functions but keeps all rows. ROW_NUMBER() OVER (PARTITION BY country ORDER BY revenue) numbers rows 1,2,3 independently within each country.' },
      { q: 'You need the previous month\'s revenue to calculate growth rate. Which window function do you use?', options: ['FIRST_VALUE()', 'LAG(revenue, 1)', 'LEAD(revenue, -1)', 'PREV_VALUE()'], correct: 1, explanation: 'LAG(column, offset) accesses the value N rows before the current row within the window partition. LAG(revenue, 1) gets the previous row\'s revenue.' },
      { q: 'What is the advantage of using a LEFT JOIN over NOT IN for finding users with no orders?', options: ['LEFT JOIN is more readable', 'NOT IN returns incorrect results when the subquery contains NULL values; LEFT JOIN handles NULLs correctly', 'NOT IN is slower in all cases', 'LEFT JOIN supports more databases'], correct: 1, explanation: 'NOT IN with a subquery returns no rows if ANY value in the subquery is NULL (due to three-valued logic). LEFT JOIN WHERE right.id IS NULL correctly finds unmatched rows even with NULLs.' },
    ],
    ide: {
      language: 'sql',
      task: 'Write a SQL query to find the top 3 products by revenue for each category, including the product name, category, total revenue, and rank within category.',
      starterCode: `-- Schema:
-- products(id, name, category, price)
-- order_items(id, order_id, product_id, quantity)

-- Sample data:
-- Category: Electronics — Laptop $1000, Phone $800, Tablet $400, Headphones $200
-- Category: Books — Python Book $50, SQL Book $45, Clean Code $40, Algorithms $55

-- Write a query that returns:
-- category | product_name | total_revenue | rank_in_category

-- HINT: Use a CTE to calculate revenue per product, then ROW_NUMBER() to rank

WITH product_revenue AS (
  SELECT
    p.category,
    p.name AS product_name,
    -- TODO: calculate total revenue (price * quantity)
    -- JOIN products with order_items
    0 AS total_revenue
  FROM products p
  -- TODO: join order_items
  GROUP BY p.id, p.category, p.name, p.price
),
ranked AS (
  SELECT
    category,
    product_name,
    total_revenue,
    -- TODO: add ROW_NUMBER() partitioned by category, ordered by revenue DESC
    1 AS rank_in_category
  FROM product_revenue
)
SELECT *
FROM ranked
WHERE rank_in_category <= 3
ORDER BY category, rank_in_category;`,
      hints: [
        'Revenue per product = SUM(p.price * oi.quantity) with JOIN products p ON p.id = oi.product_id',
        'ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_revenue DESC) AS rank_in_category',
        'The outer query filters WHERE rank_in_category <= 3',
      ],
    },
  },

  {
    id: 'cc-interview-data-m02', track: 'crash', title: 'Python for Data Analysis',
    subtitle: 'pandas, NumPy, data cleaning, aggregations, and the Python patterns every data role tests.',
    moduleObjective: 'Load, clean, aggregate, and analyze datasets with pandas — the core skill of every data analyst role.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 2, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'DataFrame', definition: 'pandas 2D data structure — rows and columns, like a table; the primary object for data analysis.' },
      { term: 'groupby', definition: 'pandas method that splits data into groups and applies aggregate functions — equivalent to SQL GROUP BY.' },
      { term: 'merge', definition: 'pandas function for SQL-style JOIN operations between DataFrames.' },
      { term: 'fillna / dropna', definition: 'Handle missing values — fillna replaces NaN; dropna removes rows/columns with NaN.' },
      { term: 'apply', definition: 'pandas method to apply a function row-by-row or column-by-column.' },
      { term: 'value_counts', definition: 'Returns frequency count of each unique value in a Series — essential for EDA.' },
      { term: 'pivot_table', definition: 'Creates a spreadsheet-style pivot table — aggregates data by row/column combinations.' },
    ],
    content: `## Python for Data Analysis

### Loading and exploring data

\`\`\`python
import pandas as pd
import numpy as np

# Load data
df = pd.read_csv('orders.csv', parse_dates=['created_at'])

# First look — always run these in an interview
print(df.shape)          # (rows, cols)
print(df.dtypes)         # column types
print(df.head())         # first 5 rows
print(df.describe())     # stats: count, mean, std, min, quartiles, max
print(df.isnull().sum()) # missing values per column
print(df.duplicated().sum())  # duplicate rows

# Check unique values in categorical columns
print(df['status'].value_counts())
print(df['country'].nunique())   # number of unique countries
\`\`\`

### Data cleaning — the most time-consuming part

\`\`\`python
# 1. Handle missing values
df['amount'].fillna(df['amount'].median(), inplace=True)  # fill with median
df.dropna(subset=['user_id', 'product_id'], inplace=True) # drop if key columns null

# 2. Fix data types
df['amount'] = pd.to_numeric(df['amount'], errors='coerce')  # coerce bad values to NaN
df['created_at'] = pd.to_datetime(df['created_at'])

# 3. Remove duplicates
df.drop_duplicates(subset=['order_id'], keep='first', inplace=True)

# 4. String cleaning
df['email'] = df['email'].str.lower().str.strip()
df['country'] = df['country'].str.title()  # "united states" → "United States"

# 5. Outlier detection (IQR method)
Q1 = df['amount'].quantile(0.25)
Q3 = df['amount'].quantile(0.75)
IQR = Q3 - Q1
df_clean = df[~((df['amount'] < Q1 - 1.5 * IQR) | (df['amount'] > Q3 + 1.5 * IQR))]
\`\`\`

### GroupBy — the core analytical operation

\`\`\`python
# Revenue by month
monthly = (df
    .groupby(df['created_at'].dt.to_period('M'))
    .agg(
        total_revenue=('amount', 'sum'),
        order_count=('id', 'count'),
        avg_order=('amount', 'mean'),
        unique_customers=('user_id', 'nunique'),
    )
    .reset_index()
)

# Top 10 customers by spend
top_customers = (df
    .groupby('user_id')['amount']
    .sum()
    .nlargest(10)
    .reset_index()
    .rename(columns={'amount': 'total_spend'})
)

# Multiple aggregations per group
summary = df.groupby(['country', 'status']).agg({
    'amount': ['sum', 'mean', 'count'],
    'user_id': 'nunique',
}).round(2)
# Flatten multi-level columns
summary.columns = ['_'.join(col).strip() for col in summary.columns]
\`\`\`

### Merge / Join operations

\`\`\`python
users = pd.read_csv('users.csv')
orders = pd.read_csv('orders.csv')

# Inner join — only matching rows
merged = orders.merge(users, left_on='user_id', right_on='id', how='inner')

# Left join — all orders, user info where available
merged = orders.merge(users, left_on='user_id', right_on='id', how='left')

# Find orders with no matching user (like SQL LEFT JOIN WHERE right IS NULL)
orphan_orders = merged[merged['id_y'].isnull()]

# Merge on multiple columns
merged = orders.merge(products,
    left_on=['product_id', 'region'],
    right_on=['id', 'region']
)
\`\`\`

### Pivot table for business reporting

\`\`\`python
# Revenue by country and month
pivot = df.pivot_table(
    values='amount',
    index='country',
    columns=df['created_at'].dt.month,
    aggfunc='sum',
    fill_value=0,
)
pivot.columns = [f'Month_{m}' for m in pivot.columns]

# Month-over-month growth rate
pivot['MoM_Growth'] = (
    (pivot['Month_2'] - pivot['Month_1']) / pivot['Month_1'] * 100
).round(1)
\`\`\``,
    quiz: [
      { q: 'What does df.describe() output for a numeric column?', options: ['The first 5 rows', 'Count, mean, standard deviation, min, 25th/50th/75th percentile, and max', 'Data types and null counts', 'The column\'s unique values and their frequencies'], correct: 1, explanation: 'describe() generates descriptive statistics: count (non-null), mean, std, min, Q1, median, Q3, max. It\'s the fastest way to get a statistical overview of numeric columns.' },
      { q: 'You have orders with amount values like "1,234.56" (with commas) being loaded as strings. How do you fix this?', options: ['df["amount"].astype(float)', 'df["amount"].str.replace(",", "").astype(float)', 'pd.to_numeric(df["amount"])', 'df["amount"].apply(int)'], correct: 1, explanation: 'Remove the commas first with str.replace(",", ""), then convert to float. pd.to_numeric would fail because "1,234.56" is not a valid numeric string.' },
      { q: 'What does groupby("country")["amount"].agg(["sum", "mean", "count"]) return?', options: ['A scalar value', 'A DataFrame with one row per country and columns for sum, mean, and count of amount', 'Three separate DataFrames', 'A list of three Series objects'], correct: 1, explanation: 'groupby splits by country, agg applies all three functions to the amount column, returning a DataFrame indexed by country with sum, mean, and count columns.' },
      { q: 'When would you use how="left" in a merge?', options: ['When you want only matching rows', 'When you want all rows from the left DataFrame, with NaN for columns from the right where there is no match', 'When the right DataFrame is smaller', 'Left merge is the default in pandas'], correct: 1, explanation: 'Left join keeps all rows from the left (main) DataFrame. If no match exists in the right DataFrame, the right columns are filled with NaN — useful for finding unmatched records.' },
    ],
    ide: {
      language: 'python',
      task: 'Analyze this sales dataset: find monthly revenue, top 5 products by sales, and the percentage of orders that had a discount applied.',
      starterCode: `import json

# Simulated dataset (in a real interview you'd use pandas)
orders = [
  {"id": 1, "product": "Laptop", "amount": 999.99, "month": 1, "has_discount": False},
  {"id": 2, "product": "Phone", "amount": 599.99, "month": 1, "has_discount": True},
  {"id": 3, "product": "Laptop", "amount": 999.99, "month": 1, "has_discount": True},
  {"id": 4, "product": "Tablet", "amount": 399.99, "month": 2, "has_discount": False},
  {"id": 5, "product": "Phone", "amount": 599.99, "month": 2, "has_discount": False},
  {"id": 6, "product": "Laptop", "amount": 999.99, "month": 2, "has_discount": True},
  {"id": 7, "product": "Headphones", "amount": 199.99, "month": 2, "has_discount": False},
  {"id": 8, "product": "Tablet", "amount": 399.99, "month": 3, "has_discount": True},
  {"id": 9, "product": "Phone", "amount": 599.99, "month": 3, "has_discount": False},
  {"id": 10, "product": "Laptop", "amount": 999.99, "month": 3, "has_discount": False},
]

# TODO 1: Calculate total revenue per month
# Expected: {1: 2599.97, 2: 2199.96, 3: 1999.97}

# TODO 2: Top 3 products by total revenue
# Expected: [('Laptop', 3999.96), ('Phone', 1799.97), ('Tablet', 799.98)]

# TODO 3: Percentage of orders with discount
# Expected: 40.0%

# Implement and print results:
`,
      hints: [
        'For monthly revenue: use a dict and accumulate with orders by month key',
        'For top products: build a product_revenue dict, sort by value descending, slice [:3]',
        'For discount pct: sum(1 for o in orders if o["has_discount"]) / len(orders) * 100',
      ],
    },
  },

  {
    id: 'cc-interview-data-m03', track: 'crash', title: 'Statistics for Data Analysts',
    subtitle: 'Hypothesis testing, A/B testing, distributions, correlation, and statistical significance.',
    moduleObjective: 'Apply the right statistical test for A/B experiments and interpret results correctly without common pitfalls.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 3, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'p-value', definition: 'The probability of observing results at least as extreme as the data, assuming the null hypothesis is true.' },
      { term: 'Statistical Significance', definition: 'A result is significant when p < α (usually 0.05), meaning it\'s unlikely to be due to chance.' },
      { term: 'Type I Error', definition: 'False positive — rejecting a true null hypothesis; α is the max acceptable probability of this.' },
      { term: 'Type II Error', definition: 'False negative — failing to reject a false null hypothesis; β is its probability.' },
      { term: 'Statistical Power', definition: '1 - β — the probability of correctly detecting a real effect when it exists.' },
      { term: 'Sample Size', definition: 'Minimum users per variant needed to detect a given effect size with required power.' },
      { term: 'Confidence Interval', definition: 'A range that contains the true parameter with a given probability (e.g., 95% CI means 95% of such intervals contain the true value).' },
    ],
    content: `## Statistics for Data Analysts

### A/B Testing framework — the most common interview topic

\`\`\`python
from scipy import stats
import numpy as np

# Scenario: Testing a new checkout button color
# Control (A): 980 visitors, 49 conversions (5.0%)
# Treatment (B): 1020 visitors, 61 conversions (5.98%)

control_visitors = 980
control_conversions = 49
treatment_visitors = 1020
treatment_conversions = 61

# Convert to arrays (1 = converted, 0 = not)
control = np.array([1] * control_conversions + [0] * (control_visitors - control_conversions))
treatment = np.array([1] * treatment_conversions + [0] * (treatment_visitors - treatment_conversions))

# Two-proportion z-test
from statsmodels.stats.proportion import proportions_ztest

count = np.array([treatment_conversions, control_conversions])
nobs = np.array([treatment_visitors, control_visitors])

stat, p_value = proportions_ztest(count, nobs)

control_rate = control_conversions / control_visitors
treatment_rate = treatment_conversions / treatment_visitors
relative_lift = (treatment_rate - control_rate) / control_rate * 100

print(f"Control rate: {control_rate:.2%}")
print(f"Treatment rate: {treatment_rate:.2%}")
print(f"Relative lift: {relative_lift:.1f}%")
print(f"p-value: {p_value:.4f}")
print(f"Significant (p<0.05): {p_value < 0.05}")

# Always calculate confidence interval too
from statsmodels.stats.proportion import proportion_confint
ci_low, ci_high = proportion_confint(treatment_conversions, treatment_visitors, alpha=0.05)
print(f"95% CI for treatment: [{ci_low:.2%}, {ci_high:.2%}]")
\`\`\`

### Common statistical mistakes in interviews

\`\`\`
Mistake 1: Peeking — stopping the test early when you see p < 0.05
  → Fix: pre-define your sample size using a power calculation and don't stop early

Mistake 2: Multiple comparisons problem (testing 10 variants)
  → Fix: Bonferroni correction: use α/n threshold (0.05/10 = 0.005 per test)

Mistake 3: Ignoring practical significance
  → A 0.001% conversion lift might be statistically significant but not worth shipping

Mistake 4: Simpson's Paradox — aggregate trend reversed in subgroups
  → Always check results by segment (device, country, user type)

Mistake 5: Non-random assignment
  → Cookies, not IP addresses. Users must be randomly assigned at session start
\`\`\`

### Correlation vs Causation

\`\`\`python
import pandas as pd
import numpy as np

# Correlation coefficient
r = df['advertising_spend'].corr(df['revenue'])
print(f"Correlation: {r:.3f}")
# r = 0.85 means strong positive linear relationship
# BUT this does NOT mean spending causes revenue!

# Correlation values:
# |r| > 0.7  → strong
# 0.5-0.7   → moderate
# 0.3-0.5   → weak
# < 0.3     → very weak/none

# Interview answer: "I see a 0.85 correlation between ad spend and revenue.
# However, this could be confounded by seasonality — we spend more and also
# get more organic traffic in Q4. I'd recommend a controlled experiment
# (randomizing ad spend allocation by region) to establish causation."
\`\`\`

### Sample size calculation

\`\`\`python
from statsmodels.stats.power import NormalIndPower

# How many users per variant do we need?
# Baseline conversion: 5%
# Minimum detectable effect: 10% relative lift (5% → 5.5%)
# Power: 80% (β = 0.2)
# Significance: α = 0.05

analysis = NormalIndPower()
sample_size = analysis.solve_power(
    effect_size=0.1,        # 10% relative change in conversion
    power=0.80,
    alpha=0.05,
    ratio=1.0,              # equal split
    alternative='two-sided'
)
print(f"Users needed per variant: {int(sample_size)}")
# → ~1570 per variant, 3140 total
\`\`\``,
    quiz: [
      { q: 'An A/B test shows p = 0.03. What does this mean?', options: ['There is a 3% chance the treatment is better', 'Assuming no real difference, there is a 3% probability of observing a difference this large or larger by chance', 'The treatment increased conversions by 3%', 'The test needs 3% more data'], correct: 1, explanation: 'p = 0.03 means: if the null hypothesis (no difference) were true, you\'d see results this extreme 3% of the time. It does NOT mean there\'s a 97% chance the treatment is better.' },
      { q: 'You run A/B tests for 10 different features simultaneously. How do you adjust your significance threshold?', options: ['Keep α = 0.05 for each test', 'Apply Bonferroni correction: use α/10 = 0.005 as the threshold for each test', 'Use α = 0.5 for each test', 'Stop testing after the first significant result'], correct: 1, explanation: 'Multiple comparisons inflate Type I error. Running 10 tests at α=0.05 means ~40% chance of at least one false positive. Bonferroni correction divides α by the number of comparisons.' },
      { q: 'Your A/B test shows a statistically significant 0.02% conversion lift. Should you ship it?', options: ['Yes — it\'s statistically significant', 'Not necessarily — statistical significance doesn\'t mean practical significance; evaluate the lift against implementation cost', 'No — small lifts are never worth shipping', 'Run the test longer to see if the lift grows'], correct: 1, explanation: 'Statistical significance just means the effect is real, not random. Practical significance asks: is the effect large enough to matter? A 0.02% lift on 1000 users/day = 0.2 extra conversions. Probably not worth engineering effort.' },
      { q: 'What is Simpson\'s Paradox?', options: ['A trend that appears in aggregate data reverses when the data is segmented into groups', 'A paradox where more data produces less significant results', 'When both A and B variants improve simultaneously', 'When p-values are exactly 0.05'], correct: 0, explanation: 'Simpson\'s Paradox: a trend exists in combined data but reverses in every subgroup. Example: Treatment A beats B overall, but B beats A in both mobile and desktop groups. Always segment your results.' },
    ],
    ide: {
      language: 'python',
      task: 'Implement a simple A/B test analyzer that calculates conversion rates, relative lift, and whether the result is significant at p < 0.05 using the z-score formula.',
      starterCode: `import math

def analyze_ab_test(control_n, control_conversions, treatment_n, treatment_conversions):
    """
    Returns:
    {
        'control_rate': float,
        'treatment_rate': float,
        'relative_lift_pct': float,
        'z_score': float,
        'p_value': float (two-tailed approximation),
        'significant': bool (p < 0.05)
    }
    """
    # TODO:
    # 1. Calculate conversion rates
    # 2. Pooled proportion for z-test
    # 3. Standard error
    # 4. z-score = (treatment_rate - control_rate) / se
    # 5. p-value approximation: 2 * (1 - normal_cdf(|z|))
    # Use normal_cdf below (no scipy needed)
    pass

def normal_cdf(z):
    """Approximation of the standard normal CDF"""
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))

# Test
result = analyze_ab_test(
    control_n=1000, control_conversions=50,    # 5.0%
    treatment_n=1000, treatment_conversions=70  # 7.0%
)
print(result)
# Expected: relative_lift ~40%, significant: True (p ≈ 0.017)`,
      hints: [
        'Pooled proportion p = (control_conv + treatment_conv) / (control_n + treatment_n)',
        'Standard error = sqrt(p * (1-p) * (1/control_n + 1/treatment_n))',
        'z = (treatment_rate - control_rate) / se; p_value = 2 * (1 - normal_cdf(abs(z)))',
      ],
    },
  },

  {
    id: 'cc-interview-data-m04', track: 'crash', title: 'Data Visualization',
    subtitle: 'matplotlib, seaborn, chart selection, storytelling with data, and dashboard principles.',
    moduleObjective: 'Choose the right chart for any data relationship and build clear, readable visualizations that drive decisions.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 4, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'Chart Junk', definition: 'Decorative elements that add no information — 3D effects, excessive gridlines, redundant labels.' },
      { term: 'Data-Ink Ratio', definition: 'Edward Tufte\'s principle: maximize ink used to display data, minimize ink used for decoration.' },
      { term: 'Small Multiples', definition: 'A series of similar charts with the same scale, comparing the same variable across categories.' },
      { term: 'Dual Axis', definition: 'A chart with two Y-axes; often misleading — use separate charts or index both to 100 instead.' },
      { term: 'Color Encoding', definition: 'Using hue to represent a categorical variable; sequential palettes for ordered data, diverging for negative/positive.' },
      { term: 'Annotation', definition: 'Text labels on a chart pointing out key events, anomalies, or values to guide the viewer\'s attention.' },
      { term: 'Histogram vs Bar Chart', definition: 'Histogram shows distribution of a continuous variable; bar chart compares discrete categories.' },
    ],
    content: `## Data Visualization

### Chart selection guide

\`\`\`
Question → Chart type:

Show change over time (one metric)     → Line chart
Compare categories                     → Bar chart (horizontal for many categories)
Show distribution                      → Histogram, box plot
Show relationship between two numeric  → Scatter plot
Show part-to-whole                     → Stacked bar (NOT pie — hard to compare)
Show geographic data                   → Choropleth map
Show correlation matrix                → Heatmap
Show multiple time series comparison   → Small multiples (not dual axis!)
\`\`\`

### matplotlib / seaborn essentials

\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Set style once at the top
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['figure.dpi'] = 150

# 1. Line chart — monthly revenue
fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(monthly['month'].astype(str), monthly['revenue'],
        marker='o', linewidth=2, color='#2563EB')
ax.fill_between(monthly['month'].astype(str), monthly['revenue'],
                alpha=0.1, color='#2563EB')

# Annotate the peak
peak_idx = monthly['revenue'].idxmax()
ax.annotate(
    f"Peak: ${monthly.loc[peak_idx, 'revenue']:,.0f}",
    xy=(monthly.loc[peak_idx, 'month'].astype(str), monthly.loc[peak_idx, 'revenue']),
    xytext=(0, 15), textcoords='offset points',
    ha='center', fontsize=9, color='#1D4ED8'
)

ax.set_title('Monthly Revenue 2024', fontsize=14, fontweight='bold', pad=15)
ax.set_xlabel('Month')
ax.set_ylabel('Revenue ($)')
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'${x:,.0f}'))
sns.despine()   # remove top and right spines (chart junk)
plt.tight_layout()

# 2. Bar chart — top products
fig, ax = plt.subplots(figsize=(8, 5))
bars = ax.bar(top_products['name'], top_products['revenue'],
              color=sns.color_palette("muted", len(top_products)))

# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 500,
            f'${height:,.0f}', ha='center', va='bottom', fontsize=9)

# 3. Scatter with regression line
fig, ax = plt.subplots(figsize=(8, 6))
sns.regplot(data=df, x='ad_spend', y='revenue', ax=ax,
            scatter_kws={'alpha': 0.5}, line_kws={'color': 'red'})
\`\`\`

### Storytelling with data — the interview answer

\`\`\`
Bad answer: "Here's a chart of revenue by month."

Good answer:
"Revenue grew 23% Q1→Q4. The growth accelerated after the March product
launch — note the steeper slope from week 12. However, December shows
a dip we should investigate — this could be the typical post-holiday slowdown
or an early indicator of churn. I'd recommend segmenting by acquisition
channel to see if the dip is concentrated in paid vs organic users."

Framework: Observation → Context → Implication → Recommendation
\`\`\`

### Dashboard design principles

\`\`\`
1. Answer one question per dashboard
   Bad: 20 charts on one page
   Good: "How is Q4 revenue performing vs target?"

2. Hierarchy: most important KPI at top-left
   Humans scan F-pattern: top → right → down

3. Consistent scales across comparison charts
   Misleading: two line charts with different Y-axis scales
   Fix: use same Y-axis range or index to 100

4. Traffic light colors for KPIs
   Green: on target | Yellow: at risk | Red: below target
   Don't use red/green for non-status data (colorblind users!)

5. Include a "last updated" timestamp
   Always tell viewers when data was refreshed
\`\`\``,
    quiz: [
      { q: 'You need to compare the distribution of order values between 5 different product categories. Which chart is best?', options: ['A pie chart with 5 slices', 'Five separate histograms side by side (small multiples)', 'A dual-axis line chart', 'A scatter plot'], correct: 1, explanation: 'Small multiples — five histograms with the same axis scale — let viewers compare distributions at a glance. A pie chart can\'t show distribution, and scatter plots require two numeric variables.' },
      { q: 'Why are pie charts often discouraged for comparing values?', options: ['Pie charts can only show two values', 'Humans are poor at estimating areas and angles, making it hard to compare slices accurately — bar charts are always clearer', 'Pie charts don\'t work in matplotlib', 'Pie charts use too much color'], correct: 1, explanation: 'Research shows humans judge linear lengths (bar chart) much more accurately than angles or areas (pie chart). For any comparison, a sorted horizontal bar chart is more readable.' },
      { q: 'What is the "data-ink ratio" principle?', options: ['The ratio of data rows to visualization pixels', 'The proportion of ink used to display actual data vs decorative elements — maximize it by removing chart junk', 'The number of colors in a chart vs the number of data series', 'The ratio of charts to text in a report'], correct: 1, explanation: 'Edward Tufte\'s principle: every drop of ink should encode information. Remove gridlines, borders, backgrounds, and decorations that don\'t convey data. The chart should be self-explanatory without decoration.' },
      { q: 'An exec asks why October revenue dropped 15%. What do you do before answering?', options: ['Immediately agree it\'s a problem', 'Check if it\'s a data issue first, then segment by channel, region, product, and compare to prior years before drawing conclusions', 'Run a linear regression', 'Calculate the p-value of the drop'], correct: 1, explanation: 'A good data analyst investigates before concluding. First: verify data quality (pipeline issues, reporting delays). Then segment to isolate the cause. Then compare to historical baselines. Then form a hypothesis.' },
    ],
    ide: {
      language: 'python',
      task: 'Process sales data and generate a text-based chart (since we can\'t render matplotlib here) showing monthly revenue trend and highlighting months above/below average.',
      starterCode: `data = {
    'Jan': 45000, 'Feb': 38000, 'Mar': 52000, 'Apr': 61000,
    'May': 58000, 'Jun': 71000, 'Jul': 55000, 'Aug': 63000,
    'Sep': 68000, 'Oct': 42000, 'Nov': 75000, 'Dec': 89000
}

def text_bar_chart(data, width=40):
    """
    Print a horizontal bar chart.
    Bars above average should be marked with ▲ (above avg)
    Bars below average should be marked with ▼ (below avg)

    Output format:
    Jan | ████████████          $45,000 ▼
    Feb | ████████               $38,000 ▼
    Mar | ████████████████       $52,000 ▲
    ...
    """
    # TODO:
    # 1. Calculate average
    # 2. Find max value for scaling
    # 3. For each month, calculate bar length proportional to max
    # 4. Print: "MON | " + "█" * bar_len + spaces + formatted_value + indicator
    pass

text_bar_chart(data)`,
      hints: [
        'avg = sum(data.values()) / len(data); max_val = max(data.values())',
        'bar_len = int(value / max_val * width) — scale to the chart width',
        'indicator = "▲" if value >= avg else "▼"',
        'f"${value:,}" formats numbers with comma separators',
      ],
    },
  },

  {
    id: 'cc-interview-data-m05', track: 'crash', title: 'Business Metrics & KPIs',
    subtitle: 'Funnel analysis, cohort retention, LTV, churn, and the metrics every product analytics interview covers.',
    moduleObjective: 'Define, calculate, and interpret the core business metrics for any product — from funnel to lifetime value.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 5, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'LTV', definition: 'Lifetime Value — predicted total revenue a customer will generate over their entire relationship with the company.' },
      { term: 'CAC', definition: 'Customer Acquisition Cost — total marketing/sales spend divided by new customers acquired.' },
      { term: 'Churn Rate', definition: 'The percentage of customers who stop using the product in a given period.' },
      { term: 'MRR', definition: 'Monthly Recurring Revenue — predictable monthly revenue from active subscriptions.' },
      { term: 'NPS', definition: 'Net Promoter Score — % Promoters minus % Detractors; measures customer loyalty (-100 to 100).' },
      { term: 'Funnel Conversion', definition: 'Percentage of users who complete each step of a multi-step process (visit → sign-up → purchase).' },
      { term: 'DAU/MAU', definition: 'Daily/Monthly Active Users ratio — measures engagement stickiness (higher is better).' },
    ],
    content: `## Business Metrics & KPIs

### Funnel analysis

\`\`\`sql
-- E-commerce purchase funnel
WITH funnel AS (
  SELECT
    COUNT(DISTINCT CASE WHEN event = 'page_view'       THEN user_id END) AS step1_visit,
    COUNT(DISTINCT CASE WHEN event = 'add_to_cart'     THEN user_id END) AS step2_cart,
    COUNT(DISTINCT CASE WHEN event = 'checkout_start'  THEN user_id END) AS step3_checkout,
    COUNT(DISTINCT CASE WHEN event = 'purchase'        THEN user_id END) AS step4_purchase
  FROM events
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT
  step1_visit,
  step2_cart,
  step3_checkout,
  step4_purchase,
  ROUND(step2_cart * 100.0 / step1_visit, 1)    AS visit_to_cart_pct,
  ROUND(step3_checkout * 100.0 / step2_cart, 1) AS cart_to_checkout_pct,
  ROUND(step4_purchase * 100.0 / step3_checkout, 1) AS checkout_to_purchase_pct,
  ROUND(step4_purchase * 100.0 / step1_visit, 1)  AS overall_conversion_pct
FROM funnel;

-- Typical benchmarks:
-- Visit → Cart: 10-30%
-- Cart → Checkout: 40-70%  ← biggest drop-off opportunity
-- Checkout → Purchase: 60-80%
\`\`\`

### Customer Lifetime Value (LTV) calculation

\`\`\`python
# Simple LTV model
# LTV = ARPU × (1 / Churn Rate)
# Where ARPU = Average Revenue Per User per month

# From data:
monthly_revenue = 50000
active_users = 500
arpu = monthly_revenue / active_users      # $100/month

# Churn rate: % of users who leave each month
churned_last_month = 25
churn_rate = churned_last_month / active_users  # 5% monthly churn

# Average customer lifespan
avg_lifespan_months = 1 / churn_rate  # 1/0.05 = 20 months

# LTV
ltv = arpu * avg_lifespan_months  # $100 × 20 = $2,000

# CAC (Customer Acquisition Cost)
total_marketing_spend = 10000
new_customers_acquired = 100
cac = total_marketing_spend / new_customers_acquired  # $100

# LTV:CAC ratio (should be 3:1 or better)
ltv_cac_ratio = ltv / cac  # 20:1 — healthy!
print(f"LTV: ${ltv:,.0f} | CAC: ${cac:,.0f} | LTV:CAC: {ltv_cac_ratio:.1f}x")
\`\`\`

### Churn analysis

\`\`\`sql
-- Monthly churn rate
WITH active_users AS (
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(DISTINCT user_id) AS users
  FROM subscriptions
  WHERE status = 'active'
  GROUP BY 1
),
churned AS (
  SELECT
    DATE_TRUNC('month', cancelled_at) AS month,
    COUNT(DISTINCT user_id) AS churned
  FROM subscriptions
  WHERE status = 'cancelled'
  GROUP BY 1
)
SELECT
  a.month,
  a.users,
  COALESCE(c.churned, 0) AS churned,
  ROUND(COALESCE(c.churned, 0) * 100.0 / a.users, 2) AS churn_rate_pct
FROM active_users a
LEFT JOIN churned c ON c.month = a.month
ORDER BY a.month;

-- Predict churn before it happens: users with declining activity
SELECT
  user_id,
  COUNT(CASE WHEN activity_date >= CURRENT_DATE - 30 THEN 1 END) AS last_30_days,
  COUNT(CASE WHEN activity_date >= CURRENT_DATE - 60
              AND activity_date < CURRENT_DATE - 30 THEN 1 END) AS prev_30_days,
  ROUND(
    (COUNT(CASE WHEN activity_date >= CURRENT_DATE - 30 THEN 1 END) -
     COUNT(CASE WHEN activity_date >= CURRENT_DATE - 60
                 AND activity_date < CURRENT_DATE - 30 THEN 1 END)) * 100.0 /
    NULLIF(COUNT(CASE WHEN activity_date >= CURRENT_DATE - 60
                        AND activity_date < CURRENT_DATE - 30 THEN 1 END), 0), 1
  ) AS activity_change_pct
FROM user_activity
GROUP BY user_id
HAVING activity_change_pct < -50;  -- flagged as at-risk
\`\`\``,
    quiz: [
      { q: 'A company has 5% monthly churn. What is the average customer lifetime in months?', options: ['5 months', '10 months', '20 months', '95 months'], correct: 2, explanation: 'Average lifespan = 1 / churn_rate = 1 / 0.05 = 20 months. At 5% monthly churn, the average customer stays for 20 months.' },
      { q: 'Your funnel shows 70% of users abandon at the checkout step. What should you investigate first?', options: ['The home page design', 'Friction in the checkout form — too many fields, no guest checkout, unexpected shipping costs, limited payment options', 'The product descriptions', 'Email marketing campaigns'], correct: 1, explanation: 'Checkout abandonment is the highest-value optimization in e-commerce. Investigate: number of form fields, guest checkout availability, payment options, shipping cost reveal timing, and trust signals.' },
      { q: 'LTV:CAC ratio is 1.5x. What does this mean for the business?', options: ['The business is very profitable', 'The business is spending $1.50 to acquire every $1 of lifetime value — unsustainable without improvement', 'The business is breaking even', 'CAC should always be lower than LTV'], correct: 1, explanation: 'A 1.5x LTV:CAC ratio means you spend almost as much to acquire a customer as they\'ll ever generate. A healthy ratio is 3:1 or higher — that leaves room for operational costs and profit.' },
      { q: 'What is the DAU/MAU ratio and what does a ratio of 0.5 indicate?', options: ['50% of monthly users are new', '50% of monthly active users visit every day — quite high engagement (Facebook ~0.65)', 'The app has 50% more monthly users than daily', 'The retention rate is 50%'], correct: 1, explanation: 'DAU/MAU = daily actives / monthly actives. A ratio of 0.5 means half of people who use the product monthly also use it on any given day — high daily engagement. Twitter is ~0.25; Facebook ~0.65.' },
    ],
    ide: {
      language: 'python',
      task: 'Calculate key business metrics from this subscription dataset: MRR, churn rate, LTV, and CAC. Format results as a business metrics report.',
      starterCode: `# Dataset
subscriptions = [
    {'id': 1, 'user_id': 'u1', 'plan': 'pro', 'mrr': 49, 'status': 'active', 'months': 8},
    {'id': 2, 'user_id': 'u2', 'plan': 'basic', 'mrr': 19, 'status': 'active', 'months': 3},
    {'id': 3, 'user_id': 'u3', 'plan': 'pro', 'mrr': 49, 'status': 'cancelled', 'months': 2},
    {'id': 4, 'user_id': 'u4', 'plan': 'basic', 'mrr': 19, 'status': 'active', 'months': 12},
    {'id': 5, 'user_id': 'u5', 'plan': 'enterprise', 'mrr': 199, 'status': 'active', 'months': 6},
    {'id': 6, 'user_id': 'u6', 'plan': 'pro', 'mrr': 49, 'status': 'cancelled', 'months': 1},
    {'id': 7, 'user_id': 'u7', 'plan': 'basic', 'mrr': 19, 'status': 'active', 'months': 5},
    {'id': 8, 'user_id': 'u8', 'plan': 'pro', 'mrr': 49, 'status': 'active', 'months': 9},
]

marketing_spend = 2400
new_customers_this_month = 3

# TODO: Calculate and print:
# 1. MRR (sum of active subscriptions)
# 2. Churn rate (cancelled / total)
# 3. Average LTV = ARPU * (1 / churn_rate)
# 4. CAC = marketing_spend / new_customers
# 5. LTV:CAC ratio
# 6. Is LTV:CAC healthy? (>= 3 is good)

# Expected output:
# === Business Metrics Report ===
# MRR: $xxx
# Churn Rate: x.x%
# Avg LTV: $xxx
# CAC: $xxx
# LTV:CAC: x.xx (Good/Needs improvement)
`,
      hints: [
        'MRR = sum(s["mrr"] for s in subscriptions if s["status"] == "active")',
        'ARPU = MRR / count of active users; churn_rate = cancelled_count / total_count',
        'LTV = ARPU / churn_rate; LTV:CAC = LTV / CAC',
      ],
    },
  },

  {
    id: 'cc-interview-data-m06', track: 'crash', title: 'ETL & Data Pipelines',
    subtitle: 'Extract, transform, load patterns, data quality checks, and pipeline orchestration basics.',
    moduleObjective: 'Design and implement a simple ETL pipeline with data quality validation and error handling.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 6, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'ETL', definition: 'Extract, Transform, Load — the process of pulling data from sources, cleaning/shaping it, and writing it to a destination.' },
      { term: 'Data Quality', definition: 'Accuracy, completeness, consistency, timeliness, and validity of data.' },
      { term: 'Idempotency', definition: 'Running a pipeline multiple times produces the same result — essential for safe reruns.' },
      { term: 'Incremental Load', definition: 'Only processing new/changed data since the last run, rather than reprocessing everything.' },
      { term: 'Data Warehouse', definition: 'A centralized repository of integrated data from multiple sources, optimized for analytical queries.' },
      { term: 'Staging Table', definition: 'A temporary landing area for raw data before transformation and validation.' },
      { term: 'dbt', definition: 'Data Build Tool — defines data transformations as SQL SELECT statements with version control and testing.' },
    ],
    content: `## ETL & Data Pipelines

### Simple ETL pipeline in Python

\`\`\`python
import pandas as pd
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')
log = logging.getLogger(__name__)

class OrdersETL:
    """
    Daily ETL: Extract orders from source DB,
    validate and transform, load to analytics warehouse
    """

    def __init__(self, source_db, warehouse_db):
        self.source = source_db
        self.warehouse = warehouse_db
        self.errors = []

    def extract(self, since: datetime) -> pd.DataFrame:
        """Pull only new orders since last run (incremental)"""
        log.info(f"Extracting orders since {since}")
        query = f"""
            SELECT id, user_id, amount, status, product_id, created_at
            FROM orders
            WHERE created_at >= '{since}'
            AND created_at < NOW()
        """
        df = pd.read_sql(query, self.source)
        log.info(f"Extracted {len(df)} orders")
        return df

    def validate(self, df: pd.DataFrame) -> pd.DataFrame:
        """Check data quality, log issues, return clean rows"""
        original_count = len(df)

        # Rule 1: no null user_id or amount
        nulls = df[df['user_id'].isnull() | df['amount'].isnull()]
        if len(nulls) > 0:
            self.errors.append(f"{len(nulls)} rows with null user_id/amount")
            df = df.dropna(subset=['user_id', 'amount'])

        # Rule 2: amount must be positive
        negatives = df[df['amount'] <= 0]
        if len(negatives) > 0:
            self.errors.append(f"{len(negatives)} rows with non-positive amount")
            df = df[df['amount'] > 0]

        # Rule 3: status must be known value
        valid_statuses = {'pending', 'completed', 'refunded', 'cancelled'}
        invalid = df[~df['status'].isin(valid_statuses)]
        if len(invalid) > 0:
            self.errors.append(f"{len(invalid)} rows with invalid status")
            df = df[df['status'].isin(valid_statuses)]

        log.info(f"Validation: {original_count} in → {len(df)} clean ({original_count - len(df)} dropped)")
        return df

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply business logic transformations"""
        # Extract date parts for partitioning
        df['order_date'] = df['created_at'].dt.date
        df['order_month'] = df['created_at'].dt.to_period('M').astype(str)
        df['order_hour'] = df['created_at'].dt.hour

        # Bucket order sizes
        df['order_tier'] = pd.cut(df['amount'],
            bins=[0, 50, 200, 1000, float('inf')],
            labels=['micro', 'small', 'medium', 'large'])

        # Normalize to uppercase
        df['status'] = df['status'].str.upper()

        return df

    def load(self, df: pd.DataFrame, table: str = 'fact_orders'):
        """Upsert to warehouse — idempotent"""
        log.info(f"Loading {len(df)} rows to {table}")
        df.to_sql(
            table,
            self.warehouse,
            if_exists='append',
            index=False,
            method='multi',  # batch inserts
            chunksize=1000,
        )
        log.info("Load complete")

    def run(self, since: datetime = None):
        """Full pipeline with error handling"""
        if since is None:
            since = datetime.now() - timedelta(days=1)  # default: last 24h

        try:
            raw = self.extract(since)
            if len(raw) == 0:
                log.info("No new data to process")
                return

            clean = self.validate(raw)
            transformed = self.transform(clean)
            self.load(transformed)

            if self.errors:
                log.warning(f"Pipeline completed with {len(self.errors)} data quality issues:")
                for err in self.errors:
                    log.warning(f"  - {err}")

        except Exception as e:
            log.error(f"Pipeline failed: {e}")
            raise   # let orchestrator handle retry
\`\`\`

### Data quality checks with dbt tests

\`\`\`yaml
# models/fact_orders.yml
version: 2
models:
  - name: fact_orders
    columns:
      - name: id
        tests:
          - unique
          - not_null
      - name: amount
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 100000
      - name: status
        tests:
          - accepted_values:
              values: ['PENDING', 'COMPLETED', 'REFUNDED', 'CANCELLED']
      - name: user_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_users')
              field: id
\`\`\``,
    quiz: [
      { q: 'What makes an ETL pipeline idempotent?', options: ['It runs exactly once', 'Running it multiple times produces the same result — reruns don\'t create duplicate records or corrupt data', 'It processes data in alphabetical order', 'It validates data before loading'], correct: 1, explanation: 'An idempotent pipeline can be safely rerun after a failure. Techniques: UPSERT (INSERT ... ON CONFLICT), delete-and-reinsert by date partition, or tracking a watermark timestamp.' },
      { q: 'What is the advantage of incremental loading over full refresh?', options: ['Full refresh is always slower', 'Incremental only processes new/changed data — much faster and lower cost for large datasets', 'Incremental loads are more accurate', 'Full refresh doesn\'t support transformations'], correct: 1, explanation: 'A full refresh of 100M rows daily might take hours and cost significantly. Incremental loading (only yesterday\'s 50K new rows) takes seconds. The tradeoff: more complex logic to track the watermark.' },
      { q: 'In a data pipeline, what is a staging table?', options: ['A table used only in development', 'A temporary landing area for raw extracted data before validation and transformation', 'A table that stores intermediate results permanently', 'A backup copy of the production table'], correct: 1, explanation: 'Raw data lands in staging first — exactly as extracted. Transformations and validations happen from staging → final tables. This preserves the raw data and allows reruns without re-extracting.' },
      { q: 'Your ETL runs at 2 AM but the source database is busy with batch jobs until 3 AM. What could go wrong?', options: ['ETL would fail immediately', 'ETL might extract incomplete data if source batch jobs haven\'t finished writing all records yet', 'ETL would run slower', 'The source DB would reject the connection'], correct: 1, explanation: 'If source batch jobs are still writing when ETL extracts, you get a partial snapshot — some records from that day\'s batch are missing. Solutions: add a processing delay, use a cutoff timestamp, or use change data capture (CDC).' },
    ],
    ide: {
      language: 'python',
      task: 'Implement a validate_dataset function that checks a list of records for data quality issues: nulls in required fields, value ranges, and referential integrity.',
      starterCode: `def validate_dataset(records, rules):
    """
    rules is a dict like:
    {
      'required': ['id', 'user_id', 'amount'],
      'numeric_ranges': {'amount': (0, 100000)},
      'allowed_values': {'status': ['pending', 'completed', 'cancelled']},
    }

    Returns: {'valid': list, 'invalid': list, 'summary': dict}
    """
    valid = []
    invalid = []
    summary = {'total': len(records), 'issues': {}}

    for record in records:
        issues = []

        # TODO: Check required fields (null/missing)

        # TODO: Check numeric ranges

        # TODO: Check allowed values

        if issues:
            invalid.append({**record, '_issues': issues})
            for issue in issues:
                summary['issues'][issue] = summary['issues'].get(issue, 0) + 1
        else:
            valid.append(record)

    return {'valid': valid, 'invalid': invalid, 'summary': summary}

# Test
records = [
    {'id': 1, 'user_id': 'u1', 'amount': 50, 'status': 'completed'},
    {'id': 2, 'user_id': None, 'amount': 100, 'status': 'pending'},     # null user_id
    {'id': 3, 'user_id': 'u3', 'amount': -10, 'status': 'completed'},   # negative amount
    {'id': 4, 'user_id': 'u4', 'amount': 75, 'status': 'refunded'},     # invalid status
    {'id': 5, 'user_id': 'u5', 'amount': 200, 'status': 'pending'},
]

rules = {
    'required': ['id', 'user_id', 'amount'],
    'numeric_ranges': {'amount': (0, 1000)},
    'allowed_values': {'status': ['pending', 'completed', 'cancelled']},
}

result = validate_dataset(records, rules)
print(f"Valid: {len(result['valid'])}")    # 2
print(f"Invalid: {len(result['invalid'])}")  # 3
print("Issues:", result['summary']['issues'])`,
      hints: [
        'For required: check if record.get(field) is None for each field in rules["required"]',
        'For numeric_ranges: get min_val, max_val from the tuple; flag if value < min or value > max',
        'For allowed_values: flag if record[field] not in allowed_set; use .get() to avoid KeyError',
      ],
    },
  },

  {
    id: 'cc-interview-data-m07', track: 'crash', title: 'Data Analyst System Design',
    subtitle: 'Design an analytics system, a reporting dashboard, and a metrics framework end-to-end.',
    moduleObjective: 'Structure a complete data analytics architecture from raw events to executive dashboard.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 7, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'Star Schema', definition: 'Data warehouse design with a central fact table surrounded by dimension tables — optimized for analytical queries.' },
      { term: 'Fact Table', definition: 'A table of measurable, quantitative data (events, transactions) with foreign keys to dimension tables.' },
      { term: 'Dimension Table', definition: 'A table of descriptive attributes (users, products, dates) referenced by fact tables.' },
      { term: 'Slowly Changing Dimension', definition: 'A dimension (e.g. user address) that changes over time — Type 2 SCD keeps full history.' },
      { term: 'Materialized View', definition: 'A pre-computed query result stored as a table — refreshed periodically for fast dashboard queries.' },
      { term: 'Event Tracking', definition: 'Recording user actions (page_view, button_click, purchase) with properties for analysis.' },
      { term: 'North Star Metric', definition: 'The single most important metric reflecting the core value the product delivers to users.' },
    ],
    content: `## Data Analyst System Design

### Design: Analytics system for an e-learning platform

\`\`\`
Business Question: "How do we know if students are learning and coming back?"

Step 1: Define the North Star Metric
North Star: "Courses Completed Per Active Learner Per Month"
- Measures value delivery (completion, not just enrollment)
- Captures retention (active, not just registered)

Supporting metrics:
- DAU/WAU/MAU (engagement)
- Enrollment rate per course
- Module completion rate
- Quiz pass rate
- Return visit rate (day 7, day 30)

Step 2: Event taxonomy
\`\`\`

\`\`\`sql
-- Raw events table (append-only)
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,
  event_name  TEXT,    -- 'course_started', 'module_completed', 'quiz_passed'
  properties  JSONB,   -- { "course_id": "...", "score": 85 }
  session_id  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Star schema for warehouse
CREATE TABLE fact_course_progress (
  id              BIGSERIAL PRIMARY KEY,
  user_key        INT REFERENCES dim_users(user_key),
  course_key      INT REFERENCES dim_courses(course_key),
  date_key        INT REFERENCES dim_date(date_key),
  modules_done    INT,
  quizzes_passed  INT,
  time_spent_min  INT,
  is_completed    BOOLEAN,
  last_activity   TIMESTAMPTZ
);

CREATE TABLE dim_users (
  user_key     SERIAL PRIMARY KEY,
  user_id      UUID UNIQUE,
  email        TEXT,
  country      TEXT,
  plan_tier    TEXT,
  signup_date  DATE,
  -- SCD Type 2: track plan changes
  valid_from   DATE,
  valid_to     DATE,
  is_current   BOOLEAN DEFAULT true
);

-- Materialized view for daily dashboard (refreshed nightly)
CREATE MATERIALIZED VIEW mv_daily_metrics AS
SELECT
  d.date,
  COUNT(DISTINCT fp.user_key) FILTER (WHERE fp.last_activity::date = d.date) AS dau,
  COUNT(DISTINCT fp.user_key) FILTER (WHERE fp.is_completed) AS completions,
  AVG(fp.time_spent_min) AS avg_time_min,
  AVG(fp.quizzes_passed * 100.0 / NULLIF(fp.modules_done, 0)) AS avg_quiz_pass_rate
FROM dim_date d
CROSS JOIN fact_course_progress fp
GROUP BY d.date;
\`\`\`

### Interview question: "How would you set up tracking for a new feature?"

\`\`\`
Step 1: Define what questions you need to answer
  - Is the feature being used?
  - Are users completing the intended flow?
  - Are there drop-off points?

Step 2: Define events (with product/engineering)
  feature_viewed:      { feature_id, user_segment, source }
  feature_started:     { feature_id, variant }
  feature_completed:   { feature_id, time_to_complete_ms }
  feature_abandoned:   { feature_id, last_step, reason }

Step 3: Instrument the code
  analytics.track('feature_started', {
    feature_id: 'ai-quiz-generator',
    variant: 'v2',
    user_id: session.userId
  })

Step 4: Build the analysis
  - Funnel: viewed → started → completed
  - Retention: users who used feature N days later
  - Segment: by plan tier, country, device

Step 5: Set up alerting
  - Alert if completion rate drops >20% vs rolling 7-day average
\`\`\``,
    quiz: [
      { q: 'What is the difference between a fact table and a dimension table in a star schema?', options: ['Fact tables are smaller; dimension tables are larger', 'Fact tables contain measurable events/transactions with numeric values; dimension tables contain descriptive attributes that contextualize those facts', 'Fact tables are updated frequently; dimension tables are immutable', 'They are interchangeable names for the same concept'], correct: 1, explanation: 'Fact tables hold what happened: rows of events with quantities (amount, duration, count). Dimension tables hold who/what/when: users, products, dates. Queries JOIN facts to dimensions for context.' },
      { q: 'Why use a materialized view for a dashboard instead of running the query live?', options: ['Materialized views are required for dashboards', 'Pre-computing the result and storing it as a table means dashboards load in milliseconds instead of running a heavy aggregation query on millions of rows each time', 'Regular views don\'t support GROUP BY', 'Materialized views automatically update in real-time'], correct: 1, explanation: 'Heavy aggregation queries (joining millions of events) might take 30+ seconds. A materialized view stores the result as a physical table, refreshed periodically (e.g., nightly), so dashboards query the pre-aggregated result in <1ms.' },
      { q: 'A user\'s pricing plan changes from Basic to Pro. How does a Type 2 SCD handle this in dim_users?', options: ['Update the existing row', 'Delete the old row and insert a new one', 'Insert a new row with the new plan, set valid_to on the old row to today, and add valid_from to the new row — keeping full history', 'Add a new column for each plan change'], correct: 2, explanation: 'Type 2 SCD preserves history by inserting a new row for each change. The old row gets valid_to = today, is_current = false. The new row gets valid_from = today, is_current = true. Historical facts can be joined to the correct dimension version.' },
      { q: 'What is a North Star Metric and why should a product have exactly one?', options: ['The most impressive metric to show investors', 'The single metric that best reflects the core value delivered to users — focusing on one prevents optimizing vanity metrics', 'The metric with the highest absolute value', 'A metric that never decreases'], correct: 1, explanation: 'A North Star Metric aligns the entire company around what actually matters (user value). Multiple north stars create conflicting priorities. Example: Airbnb\'s is nights booked; Spotify\'s is time spent listening.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a simple analytics event tracker that records events with timestamps, and provides funnel analysis — calculating conversion rates between consecutive steps.',
      starterCode: `class AnalyticsTracker {
  constructor() {
    this.events = []
  }

  track(userId, eventName, properties = {}) {
    this.events.push({
      userId,
      eventName,
      properties,
      timestamp: Date.now(),
    })
  }

  // TODO: funnelAnalysis(steps, startDate, endDate)
  // steps = ['page_view', 'signup_start', 'signup_complete', 'first_purchase']
  // For each consecutive step pair, calculate:
  //   - users who reached this step
  //   - conversion rate from previous step
  // Return: array of { step, users, conversionFromPrev }
  funnelAnalysis(steps) {
    // implement here
    return []
  }
}

// Test data
const tracker = new AnalyticsTracker()
const users = ['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10']

// All 10 users view page
users.forEach(u => tracker.track(u, 'page_view'))

// 7 start signup
users.slice(0, 7).forEach(u => tracker.track(u, 'signup_start'))

// 5 complete signup
users.slice(0, 5).forEach(u => tracker.track(u, 'signup_complete'))

// 3 make first purchase
users.slice(0, 3).forEach(u => tracker.track(u, 'first_purchase'))

const funnel = tracker.funnelAnalysis(['page_view','signup_start','signup_complete','first_purchase'])
funnel.forEach(step => {
  console.log(\`\${step.step}: \${step.users} users (\${step.conversionFromPrev})\`)
})
// page_view: 10 users (100%)
// signup_start: 7 users (70.0%)
// signup_complete: 5 users (71.4%)
// first_purchase: 3 users (60.0%)`,
      hints: [
        'Count unique userIds for each step using a Set: new Set(events.filter(e => e.eventName === step).map(e => e.userId))',
        'Conversion = currentStepUsers / prevStepUsers * 100, formatted to 1 decimal',
        'First step always has 100% conversion (no previous step)',
      ],
    },
  },

  {
    id: 'cc-interview-data-m08', track: 'crash', title: 'Data Analyst Live Interview',
    subtitle: 'Solve realistic take-home case studies: investigate a revenue drop, design an experiment, explain findings.',
    moduleObjective: 'Structure a complete data investigation under time pressure and communicate findings like a senior data analyst.',
    courseObjective: CC_DATA_OBJ, crashId: 'cc-interview-data', crashTitle: 'Data Analyst Interview Prep',
    level: 'Masters', xp: 200, duration: 14, module: 8, certArea: 'Data Analyst Interview Prep',
    keyTerms: [
      { term: 'Issue Tree', definition: 'A structured decomposition of a problem into mutually exclusive, collectively exhaustive branches for systematic investigation.' },
      { term: 'Sanity Check', definition: 'Verifying data looks reasonable before analyzing it — check totals, date ranges, row counts.' },
      { term: 'Hypothesis', definition: 'A specific, testable explanation for an observed pattern.' },
      { term: 'Segment', definition: 'Divide users/data into groups (by device, country, plan) to isolate where a change is concentrated.' },
      { term: 'Seasonality', definition: 'Predictable periodic patterns in data — weekly cycles, monthly patterns, annual trends.' },
      { term: 'Anomaly Detection', definition: 'Identifying data points that fall outside expected patterns — statistical outliers or sudden shifts.' },
      { term: 'Executive Summary', definition: 'A brief (1 page) summary of findings and recommendations for a non-technical audience.' },
    ],
    content: `## Data Analyst Live Interview

### Case study: "Revenue dropped 20% last week"

**Interviewer prompt:** "Our revenue dropped 20% last week. Figure out why."

**Your structured response (use this framework every time):**

\`\`\`
Step 1: Clarify and sanity check (2 min)
  - What time period exactly? Week-over-week or vs last year?
  - Is this in all products or one product line?
  - Any known events? Deploy, outage, marketing pause?
  - Is the data fresh? Any pipeline issues?

Step 2: Build an issue tree
  Revenue = Orders × AOV
  Orders = Traffic × Conversion Rate
  Traffic = Paid + Organic + Direct + Email

  Drop could be in any branch:
  - Traffic dropped (paid campaign paused? SEO ranking fell?)
  - Conversion dropped (checkout bug? price increase?)
  - AOV dropped (discount codes? product mix shift?)
  - Refunds spiked (product quality issue?)

Step 3: SQL investigation (this is where you actually code)
\`\`\`

\`\`\`sql
-- Segment the drop: which channel / country / device?
SELECT
  channel,
  country,
  device_type,
  SUM(CASE WHEN order_date >= '2024-01-22' THEN 1 ELSE 0 END) AS this_week,
  SUM(CASE WHEN order_date >= '2024-01-15'
          AND order_date < '2024-01-22' THEN 1 ELSE 0 END) AS last_week,
  ROUND(
    (SUM(CASE WHEN order_date >= '2024-01-22' THEN 1 ELSE 0 END) -
     SUM(CASE WHEN order_date >= '2024-01-15' AND order_date < '2024-01-22' THEN 1 ELSE 0 END)) * 100.0 /
    NULLIF(SUM(CASE WHEN order_date >= '2024-01-15' AND order_date < '2024-01-22' THEN 1 ELSE 0 END), 0), 1
  ) AS pct_change
FROM orders o
JOIN sessions s ON s.id = o.session_id
WHERE order_date >= '2024-01-15'
GROUP BY 1, 2, 3
ORDER BY pct_change ASC
LIMIT 20;

-- Check conversion funnel by day
SELECT
  event_date,
  COUNT(DISTINCT CASE WHEN step = 'visit' THEN user_id END) AS visitors,
  COUNT(DISTINCT CASE WHEN step = 'purchase' THEN user_id END) AS purchases,
  ROUND(
    COUNT(DISTINCT CASE WHEN step = 'purchase' THEN user_id END) * 100.0 /
    NULLIF(COUNT(DISTINCT CASE WHEN step = 'visit' THEN user_id END), 0), 2
  ) AS conversion_rate
FROM funnel_events
WHERE event_date >= '2024-01-08'
GROUP BY 1
ORDER BY 1;
\`\`\`

### How to communicate findings

\`\`\`
Bad answer:
"Revenue dropped 20%. The conversion rate went from 3.2% to 2.6%.
Mobile conversions were 40% lower. That's all I found."

Good answer:
"Revenue dropped 20% week-over-week. The drop is concentrated
in mobile users in North America — desktop and Europe were flat.

Mobile conversion dropped from 3.2% to 1.9% starting Monday the 22nd.
This timing aligns with a CSS deploy at 2 PM on the 22nd that touched
the checkout form.

My hypothesis: the CSS change broke the checkout button on mobile Safari
(which accounts for ~35% of our mobile traffic). I pulled the error logs
and see a spike in JavaScript errors on checkout.js at exactly 2 PM.

Recommended action: roll back the CSS change immediately and verify
with a 5-minute fix to the mobile checkout. Expected revenue recovery:
~$4,000/day based on pre-incident rates."

Framework: Observation → Isolation → Root Cause → Evidence → Recommendation → Quantified Impact
\`\`\``,
    quiz: [
      { q: 'An interviewer says "revenue dropped 20% — figure out why." What is the first thing you do?', options: ['Immediately run SQL queries', 'Clarify the time period, scope, and whether there were any known events, then sanity-check the data pipeline', 'Calculate the correlation between revenue and all other metrics', 'Ask the engineering team if there was a bug'], correct: 1, explanation: 'Before diving into analysis, clarify scope (week-over-week? vs last year? one product?), check for known events (deploy, outage, campaign), and verify the data is correct. Many "revenue drops" are reporting pipeline issues.' },
      { q: 'You find that the revenue drop is 100% in mobile Safari. What does this tell you?', options: ['All users should switch to desktop', 'The issue is highly specific to one platform/browser — points to a front-end bug or platform-specific issue rather than a product or pricing change', 'Mobile Safari users spend less', 'The A/B test affected mobile users'], correct: 1, explanation: 'A drop concentrated in one browser/platform is almost always a code or compatibility bug. A pricing or product change would affect all channels. This isolates the root cause dramatically.' },
      { q: 'What is an issue tree in data analysis?', options: ['A visualization of database table relationships', 'A structured decomposition of a metric into its component parts to systematically identify where the change occurred', 'A decision tree machine learning model', 'A version control tree for SQL queries'], correct: 1, explanation: 'An issue tree breaks Revenue = Orders × AOV, Orders = Traffic × Conversion Rate, etc. By checking each branch, you systematically isolate which component changed — instead of guessing randomly.' },
      { q: 'You find a statistically significant correlation between ice cream sales and drowning rates. What is wrong with concluding ice cream causes drowning?', options: ['The data sample is too small', 'Correlation is not causation — both are caused by a confounding variable (hot weather / summer) not by each other', 'The statistical test is wrong', 'The variables should be log-transformed'], correct: 1, explanation: 'Both ice cream sales and drowning increase in summer due to hot weather — a confounding variable. This is a classic example of spurious correlation. Always ask: what third variable could explain both?' },
    ],
    ide: {
      language: 'javascript',
      task: 'Analyze this daily metrics dataset and identify the anomaly: find the day where conversion rate dropped significantly below the rolling 7-day average.',
      starterCode: `const metrics = [
  { date: '2024-01-01', visitors: 1200, purchases: 48 },
  { date: '2024-01-02', visitors: 1350, purchases: 54 },
  { date: '2024-01-03', visitors: 1100, purchases: 44 },
  { date: '2024-01-04', visitors: 1400, purchases: 56 },
  { date: '2024-01-05', visitors: 1250, purchases: 50 },
  { date: '2024-01-06', visitors: 1300, purchases: 52 },
  { date: '2024-01-07', visitors: 1450, purchases: 58 },
  { date: '2024-01-08', visitors: 1380, purchases: 28 },  // ← anomaly here
  { date: '2024-01-09', visitors: 1320, purchases: 53 },
  { date: '2024-01-10', visitors: 1280, purchases: 51 },
]

// TODO:
// 1. Calculate conversion rate for each day (purchases/visitors * 100)
// 2. For each day from index 7 onwards, calculate the rolling 7-day average conversion rate
// 3. Flag days where conversion rate is more than 20% below the rolling average
// 4. Print a report of anomalies

function analyzeConversionAnomalies(data) {
  // Add conversion rate to each record
  // Calculate rolling averages
  // Detect and report anomalies
}

analyzeConversionAnomalies(metrics)
// Expected output:
// 2024-01-08: conversion 2.03% (rolling avg: 4.03%) — DROP of 49.7% — ANOMALY`,
      hints: [
        'conversionRate = purchases / visitors * 100',
        'Rolling 7-day average for day i = average of days [i-7, i-1]',
        'Anomaly: conversionRate < rollingAvg * 0.80 (more than 20% below average)',
        'pctDrop = (conversionRate - rollingAvg) / rollingAvg * 100',
      ],
    },
  },
]
