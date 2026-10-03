import type { Course } from '../courses'

const CC_TAILWIND_OBJ = 'Style production UIs with Tailwind CSS — utility classes, responsive design, dark mode, custom themes, and component patterns used in real Next.js projects.'

export const crashTailwindCourses: Course[] = [
  {
    id: 'cc-tailwind-m01', track: 'crash', title: 'Environment, Utility-First Thinking & Your First Tailwind Page',
    subtitle: 'Set up Tailwind CSS in VS Code, understand the utility-first philosophy, and build your first styled component.',
    moduleObjective: 'Configure Tailwind in VS Code, install the toolchain, and apply core utility classes to build a product card.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Basic',
    xp: 150, duration: 12, module: 1, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Utility-first', definition: 'Compose styles by combining small, single-purpose classes directly in HTML/JSX instead of writing custom CSS.' },
      { term: 'JIT compiler', definition: 'Just-in-time — Tailwind scans your files and generates only the CSS classes you actually use. Zero unused CSS in production.' },
      { term: 'content array', definition: 'The content array in tailwind.config.js tells the JIT scanner which files to scan. Classes in uncovered files get purged in production.' },
      { term: 'Spacing scale', definition: 'Tailwind uses a 4px base unit. p-1=4px, p-2=8px, p-4=16px, p-8=32px. Every spacing utility follows this scale.' },
      { term: 'Arbitrary values', definition: 'w-[327px], text-[#c9a84c], mt-[13px] — square brackets escape the scale for one-off design values.' },
    ],
    content: `## Environment, Utility-First Thinking & Your First Tailwind Page

Before Tailwind existed, every developer was losing the same war. You'd write a \`.card\` class, then need \`.card--featured\`, then \`.card--featured--dark\`, then \`!important\` to beat a third-party library. Projects ended with 2,000-line CSS files full of classes nobody remembered writing, specificity battles nobody could win, and a growing fear of touching anything.

Tailwind's answer is radical: **stop naming things**. Instead of grouping ten properties under one class, write ten single-purpose classes directly in your HTML. You read the element and immediately see exactly what it looks like — no context switching, no hunting through stylesheets.

### Why Utility-First Works

**The specificity war ends.** Every utility class has the same weight. There is no custom CSS left to fight against.

**Naming is hard. Utility classes don't need names.** There's no \`.card__header--active\` to invent. The class name IS the style — \`bg-amber-500 text-white px-4 py-2 rounded-lg\` tells you the full picture in one line.

**Dead code elimination is automatic.** Tailwind's JIT compiler scans your files as text and generates only the CSS classes it finds. A typical production bundle is 5–15KB — smaller than most images. No manual purge config needed.

**All variants are prefix-based.** \`dark:bg-gray-900 md:flex-row hover:shadow-lg focus:ring-2\` — the dark-mode, responsive, and interactive logic lives next to the element, not buried in a separate stylesheet.

### The DX Difference

Traditional approach — name a class, write the CSS, then track down specificity conflicts when something breaks:

\`\`\`css
/* styles.css */
.product-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}
\`\`\`

Tailwind approach — same visual output, zero custom CSS, fully self-documenting:

\`\`\`html
<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm
            hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
\`\`\`

Both produce identical output. The Tailwind version is readable at a glance and never requires hunting a CSS file.

### VS Code Setup

Install the **Tailwind CSS IntelliSense** extension — this is not optional. It provides autocomplete for every utility class as you type, hover previews of the generated CSS, and lint warnings for invalid or conflicting classes.

1. Open VS Code → Extensions (Ctrl+Shift+X / Cmd+Shift+X)
2. Search **"Tailwind CSS IntelliSense"** (publisher: Tailwind Labs)
3. Install and reload VS Code

You will now see autocomplete dropdown suggestions and CSS previews as you write classes.

### Installing Tailwind in a Project

\`\`\`bash
# In your project folder
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

This creates two files: \`tailwind.config.js\` (your Tailwind configuration) and \`postcss.config.js\` (the PostCSS pipeline).

### Configuring tailwind.config.js

The \`content\` array is the most critical setting. It tells the JIT scanner exactly which files to search for class names. **Any file using Tailwind classes that is not covered here will have those classes stripped in production.**

\`\`\`js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},  // extend without replacing Tailwind defaults
  },
  plugins: [],
}
\`\`\`

### Adding Tailwind Directives to Your CSS

\`\`\`css
/* src/app/globals.css */
@tailwind base;      /* resets and base element styles */
@tailwind components; /* (mostly empty without plugins) */
@tailwind utilities; /* all generated utility classes */
\`\`\`

### Core Utility Categories

**Spacing** (4px base unit — p-1=4px, p-4=16px, p-8=32px):
- \`p-4\` — 16px padding all sides
- \`px-6 py-3\` — horizontal and vertical padding separately
- \`mt-8 mb-4\` — top and bottom margin
- \`gap-4\` — space between flex or grid children

**Layout**:
- \`flex\`, \`grid\`, \`block\`, \`inline-flex\` — display type
- \`flex-col\`, \`items-center\`, \`justify-between\` — flex alignment
- \`w-full\`, \`max-w-4xl\`, \`mx-auto\` — width and centering
- \`grid-cols-3\`, \`col-span-2\` — grid structure

**Colors** (scale 50=lightest, 900=darkest):
- \`bg-blue-500\`, \`bg-amber-100\`, \`bg-white\` — background
- \`text-gray-900\`, \`text-amber-600\` — text color
- \`border-gray-200\` — border color
- \`bg-[#1a1a1a]\`, \`text-[#f59e0b]\` — arbitrary hex values

**Typography**:
- \`text-sm\`, \`text-base\`, \`text-xl\`, \`text-3xl\` — font size
- \`font-bold\`, \`font-medium\`, \`font-semibold\` — font weight
- \`leading-relaxed\`, \`tracking-tight\` — line height, letter spacing

**Borders and Effects**:
- \`border\`, \`border-2\`, \`border-gray-200\` — border width and color
- \`rounded\`, \`rounded-lg\`, \`rounded-xl\`, \`rounded-full\` — border radius
- \`shadow-sm\`, \`shadow-md\`, \`shadow-lg\` — box shadow

### Responsive Prefixes: Mobile-First

Tailwind is mobile-first. Unprefixed classes apply at all screen sizes. Prefix a class to activate it only at that breakpoint and wider.

\`\`\`
sm: 640px+    md: 768px+    lg: 1024px+    xl: 1280px+
\`\`\`

\`\`\`html
<!-- Font scales up with viewport width -->
<h1 class="text-2xl md:text-4xl lg:text-5xl font-bold">JST Academy</h1>

<!-- Stacks on mobile, side by side on tablet+ -->
<div class="flex flex-col md:flex-row gap-6">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>

<!-- Grid: 1 col on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
\`\`\`

Write mobile styles first with no prefix, then override upward with breakpoint prefixes. You will rarely need a max-width media query in Tailwind.`,
    quiz: [
      { q: 'What does the content array in tailwind.config.js do?', options: ['Loads external stylesheets', 'Tells the JIT scanner which files to scan — classes in uncovered files are stripped from the production build', 'Sets the color theme', 'Required for dark mode only'], correct: 1, explanation: 'The JIT scanner reads your files as text to detect class names. Files missing from content[] have their classes purged. Always include every file path that uses Tailwind classes.' },
      { q: 'Which VS Code extension gives Tailwind autocomplete?', options: ['CSS IntelliSense', 'Tailwind CSS IntelliSense by Tailwind Labs', 'Prettier', 'ESLint'], correct: 1, explanation: 'Tailwind CSS IntelliSense (Tailwind Labs) provides class autocomplete, hover CSS previews, and invalid-class lint warnings. It is the first thing to install.' },
      { q: 'What does p-4 equal in pixels?', options: ['4px', '4rem', '16px — the 4px base unit times 4', '40px'], correct: 2, explanation: 'Tailwind uses a 4px base unit. p-1=4px, p-2=8px, p-4=16px, p-8=32px. This consistent scale makes spacing predictable across the whole system.' },
      { q: 'How does Tailwind\'s mobile-first responsive system work?', options: ['Separate mobile stylesheets', 'Unprefixed classes apply at all sizes; sm:, md:, lg: activate at that min-width and wider', 'Mobile classes override desktop ones', 'Requires a responsive plugin'], correct: 1, explanation: 'Write mobile styles first without a prefix, then layer larger-screen overrides with sm:, md:, lg:. All breakpoints are min-width — they activate at that size and above.' },
    ],
    ide: {
      language: 'html',
      task: 'Build a product card for a JST Academy course. The card needs: an amber "Crash Course" badge, a bold course title, a 2-line description, a row showing duration + XP, and an amber "Enroll Now" button. Replace every TODO comment with the correct Tailwind classes. Tailwind CDN is already loaded.',
      starterCode: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Course Card</title>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-8">

  <!--
    TASK: Replace every TODO with real Tailwind classes.
    Card wrapper: white background, rounded corners, drop shadow, padding, max width
    Badge: small amber pill
    Title: large bold dark text
    Description: smaller gray text with line spacing
    Stats row: two items side by side
    Button: full-width amber with white text
  -->

  <div class="TODO_card_wrapper">

    <span class="TODO_badge">Crash Course</span>

    <h2 class="TODO_title">Tailwind CSS</h2>

    <p class="TODO_description">
      Master utility-first CSS from zero to production.
      Build fast UIs without writing a single custom CSS rule.
    </p>

    <div class="TODO_stats_row">
      <span class="TODO_stat">12 min</span>
      <span class="TODO_stat_xp">150 XP</span>
    </div>

    <button class="TODO_button">Enroll Now</button>

  </div>

</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Course Card</title>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-8">

  <div class="bg-white rounded-2xl shadow-md p-6 max-w-sm w-full hover:shadow-xl transition-shadow duration-200">

    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
      Crash Course
    </span>

    <h2 class="text-xl font-bold text-gray-900 mt-3 mb-2">Tailwind CSS</h2>

    <p class="text-sm text-gray-600 leading-relaxed mb-4">
      Master utility-first CSS from zero to production.
      Build fast UIs without writing a single custom CSS rule.
    </p>

    <div class="flex items-center gap-4 mb-5">
      <span class="text-xs font-medium text-gray-500">12 min</span>
      <span class="text-xs font-semibold text-amber-600">150 XP</span>
    </div>

    <button class="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
      Enroll Now
    </button>

  </div>

</body>
</html>`,
      hints: [
        'Card wrapper: bg-white rounded-2xl shadow-md p-6 max-w-sm w-full',
        'Badge: inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800',
        'Title: text-xl font-bold text-gray-900 mt-3 mb-2',
        'Description: text-sm text-gray-600 leading-relaxed mb-4',
        'Stats row: flex items-center gap-4 mb-5',
        'Button: w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition-colors duration-150',
      ],
    },
  },
  {
    id: 'cc-tailwind-m02', track: 'crash', title: 'Responsive Design',
    subtitle: 'Build mobile-first layouts using Tailwind\'s responsive prefixes.',
    moduleObjective: 'Apply Tailwind responsive prefixes to build mobile-first adaptive layouts.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Basic',
    xp: 150, duration: 10, module: 2, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Mobile-first', definition: 'Unprefixed utilities apply to all sizes. Prefixed (sm:, md:) override upward. Start from mobile and expand.' },
      { term: 'Breakpoints', definition: 'sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px. All "min-width" — activate at that width and up.' },
      { term: 'Container', definition: 'max-w-screen-lg mx-auto px-4 — centers content with responsive max-widths. Or use the container class.' },
      { term: 'Stack to row', definition: 'flex-col md:flex-row — vertical on mobile, horizontal on desktop. Common pattern for nav and cards.' },
      { term: 'Responsive grid', definition: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 — single column on mobile, expanding on larger screens.' },
    ],
    content: `## Responsive Design

Tailwind is mobile-first. Unprefixed classes apply everywhere. Prefixed classes kick in at the breakpoint and above.

### Breakpoints

\`\`\`tsx
// sm: ≥640px  md: ≥768px  lg: ≥1024px  xl: ≥1280px  2xl: ≥1536px

<h1 className="text-2xl md:text-4xl lg:text-5xl">
  JST Academy
</h1>

<div className="flex flex-col md:flex-row gap-6">
  <Sidebar className="w-full md:w-64" />
  <main className="flex-1">...</main>
</div>
\`\`\`

### Responsive Grid

\`\`\`tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {courses.map(c => <CourseCard key={c.id} course={c} />)}
</div>
\`\`\`

### Show/Hide by Breakpoint

\`\`\`tsx
{/* Mobile-only */}
<nav className="flex md:hidden">
  <MobileMenu />
</nav>

{/* Desktop-only */}
<nav className="hidden md:flex items-center gap-6">
  <DesktopNav />
</nav>

{/* Adjust padding responsively */}
<section className="px-4 md:px-8 lg:px-16 py-8 md:py-16">
\`\`\`

### Responsive Typography

\`\`\`tsx
<h1 className="
  text-3xl font-bold
  sm:text-4xl
  lg:text-5xl
  tracking-tight
  text-gray-900
">
  Build Real Apps
</h1>

<p className="
  text-base leading-relaxed
  md:text-lg
  max-w-2xl
  text-gray-600
">
  PhD-level crash courses for full-stack developers.
</p>
\`\`\``,
    quiz: [
      { q: 'What does "mobile-first" mean in Tailwind?', options: ['Tailwind only works on mobile', 'Unprefixed classes apply at all sizes; prefixed classes (sm:, md:) activate at that breakpoint and wider', 'You must test on mobile first', 'Mobile has its own config'], correct: 1, explanation: 'Mobile-first: write the mobile layout with unprefixed classes, then override at larger breakpoints with sm:, md:, lg: etc.' },
      { q: 'What does md: prefix mean?', options: ['Applies only at 768px exactly', 'Applies at 768px and wider (min-width: 768px)', 'Applies below 768px', 'Medium importance'], correct: 1, explanation: 'All Tailwind breakpoints are min-width. md: applies at 768px and up — not just at exactly 768px.' },
      { q: 'How do you show an element only on desktop?', options: ['display-desktop', 'hidden md:block or hidden md:flex', 'desktop:show', 'visible-lg'], correct: 1, explanation: 'hidden hides on all sizes; md:block or md:flex reveals it at 768px and up. The mobile-first pattern for show/hide.' },
      { q: 'What is the pattern for a responsive grid (1 -> 2 -> 3 cols)?', options: ['responsive-grid-3', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'cols-auto sm:cols-2 lg:cols-3', 'flex-wrap'], correct: 1, explanation: 'grid + grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 — starts single column and adds columns at each breakpoint.' },
    ],
    ide: {
      language: 'html',
      task: 'Make the course grid responsive. Currently all 3 cards stack in a single column. Your goal: 1 column on mobile, 2 columns on sm (640px+), 3 columns on lg (1024px+). Also make the heading scale from text-2xl on mobile to text-4xl on lg+. Resize your browser window to see the breakpoints in action.',
      starterCode: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Responsive Grid Exercise</title>
</head>
<body class="bg-gray-50 p-8">

  <!--
    TASK 1: Make the heading responsive.
    Currently: text-2xl
    Goal: text-2xl on mobile, text-4xl on lg+
  -->
  <h1 class="text-2xl font-bold text-gray-900 mb-6">Course Library</h1>

  <!--
    TASK 2: Make this a responsive grid.
    Currently: a plain div (single column)
    Goal: grid, 1 col mobile → 2 col sm → 3 col lg, with gap-6
    Hint: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
  -->
  <div class="TODO_add_responsive_grid_classes_here">

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Tailwind CSS</h3>
      <p class="text-sm text-gray-600">Utility-first CSS for production UIs.</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Next.js</h3>
      <p class="text-sm text-gray-600">Full-stack React framework for production apps.</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Supabase</h3>
      <p class="text-sm text-gray-600">Postgres database and auth for full-stack apps.</p>
    </div>

  </div>
</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Responsive Grid Exercise</title>
</head>
<body class="bg-gray-50 p-8">

  <h1 class="text-2xl lg:text-4xl font-bold text-gray-900 mb-6">Course Library</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Tailwind CSS</h3>
      <p class="text-sm text-gray-600">Utility-first CSS for production UIs.</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Next.js</h3>
      <p class="text-sm text-gray-600">Full-stack React framework for production apps.</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Supabase</h3>
      <p class="text-sm text-gray-600">Postgres database and auth for full-stack apps.</p>
    </div>

  </div>
</body>
</html>`,
      hints: [
        'The grid container needs: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        'Responsive heading: text-2xl lg:text-4xl (unprefixed = mobile, lg: = desktop+)',
        'sm: activates at 640px, lg: activates at 1024px — resize the browser to test',
        'mobile-first: write the smallest layout first, then override upward with breakpoint prefixes',
      ],
    },
  },
  {
    id: 'cc-tailwind-m03', track: 'crash', title: 'Dark Mode & Color Themes',
    subtitle: 'Implement dark mode and custom color palettes using Tailwind\'s theming system.',
    moduleObjective: 'Configure dark mode variants and custom color tokens in tailwind.config.ts.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Basic',
    xp: 150, duration: 10, module: 3, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'dark: prefix', definition: 'dark:bg-gray-900 — applies when dark mode is active. Works with "class" strategy (class="dark" on html) or "media" (system preference).' },
      { term: 'darkMode: "class"', definition: 'Toggle dark mode by adding class="dark" to the html element. Gives programmatic control over the theme.' },
      { term: 'Custom colors', definition: 'Extend the palette in tailwind.config.ts. Custom colors become utility classes: bg-brand-500, text-brand-600.' },
      { term: 'CSS variables', definition: 'Define a color as a CSS custom property and reference it in Tailwind config — enables runtime theme switching.' },
      { term: 'Opacity modifier', definition: 'bg-black/50, text-white/80 — slash syntax adds opacity to any color utility.' },
    ],
    content: `## Dark Mode & Color Themes

Tailwind makes dark mode a one-line prefix. Custom color tokens let you use your brand palette as utility classes.

### Dark Mode Setup

\`\`\`tsx
// tailwind.config.ts
export default {
  darkMode: 'class',  // toggle via class="dark" on html
  // ...
}

// app/layout.tsx — add class to html
<html lang="en" className={isDark ? 'dark' : ''}>
\`\`\`

### Dark Mode Classes

\`\`\`tsx
<div className="
  bg-white text-gray-900
  dark:bg-gray-900 dark:text-gray-100
">
  <h1 className="text-2xl font-bold dark:text-white">
    Course Title
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    Module description
  </p>
  <button className="
    bg-amber-500 hover:bg-amber-600
    dark:bg-amber-400 dark:hover:bg-amber-300
    text-white dark:text-gray-900
    px-4 py-2 rounded-lg
  ">
    Start Course
  </button>
</div>
\`\`\`

### Custom Color Palette

\`\`\`tsx
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
        },
        crash: '#f59e0b',
      },
    },
  },
} satisfies Config

// Usage
<div className="bg-brand-500 text-brand-50 dark:bg-brand-700">
<span className="text-crash">Crash Course</span>
\`\`\`

### Opacity Modifier

\`\`\`tsx
<div className="bg-black/50">         {/* background-color: rgba(0,0,0,0.5) */}
<div className="text-white/80">       {/* color: rgba(255,255,255,0.8) */}
<div className="border-gray-200/60">  {/* border with 60% opacity */}
<div className="bg-brand-500/20">     {/* custom color with opacity */}
\`\`\``,
    quiz: [
      { q: 'What does darkMode: "class" mean?', options: ['Dark mode is always on', 'Dark mode activates when the html element has class="dark" — programmatic control', 'Follows system preference only', 'CSS-only dark mode'], correct: 1, explanation: '"class" strategy gives you explicit control — add class="dark" to toggle dark mode. Alternative is "media" which uses prefers-color-scheme.' },
      { q: 'How do you add a custom color to Tailwind?', options: ['Import CSS variables', 'Add it to theme.extend.colors in tailwind.config.ts — it becomes a utility class', 'Use inline styles', 'Impossible without a plugin'], correct: 1, explanation: 'theme.extend.colors adds to the default palette. Define brand: { 500: "#f59e0b" } and use bg-brand-500, text-brand-500, border-brand-500.' },
      { q: 'What does bg-black/50 do?', options: ['50% darker black', 'Black background at 50% opacity', '50th black shade', 'Blur effect'], correct: 1, explanation: 'The slash opacity modifier applies opacity: bg-black/50 = background-color: rgba(0, 0, 0, 0.5). Works with any color.' },
      { q: 'How do you style differently in dark mode?', options: ['media:dark:', 'dark: prefix — dark:bg-gray-900 applies when dark mode is active', 'night:', 'Separate stylesheet'], correct: 1, explanation: 'dark: is a variant prefix. dark:bg-gray-900 sets the background only when the dark class is on the html element (or system is dark in media mode).' },
    ],
  },
  {
    id: 'cc-tailwind-m04', track: 'crash', title: 'State Variants & Animations',
    subtitle: 'Handle hover, focus, active states and add motion with Tailwind transitions.',
    moduleObjective: 'Apply state variants (hover, focus, disabled) and transitions to interactive elements.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'hover: prefix', definition: 'hover:bg-blue-600 — applies when the element is hovered. Stacks with dark: and other variants.' },
      { term: 'focus: prefix', definition: 'focus:ring-2 focus:ring-offset-2 — applies on keyboard focus. Critical for accessibility.' },
      { term: 'transition', definition: 'transition, transition-colors, transition-all — enables smooth property changes. Pair with duration-200 ease-in-out.' },
      { term: 'group', definition: 'Apply group to a parent; use group-hover: on children to style them when the parent is hovered.' },
      { term: 'peer', definition: 'Apply peer to a sibling input; use peer-focus: or peer-invalid: on adjacent labels to style them.' },
    ],
    content: `## State Variants & Animations

Tailwind handles all CSS pseudo-classes as variants. Interactive states are just prefixes.

### Hover and Focus

\`\`\`tsx
<button className="
  bg-amber-500 text-white
  hover:bg-amber-600 active:bg-amber-700
  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
  transition-colors duration-150
  px-4 py-2 rounded-lg font-medium
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Start Course
</button>
\`\`\`

### Transition and Animation

\`\`\`tsx
// Smooth hover on a card
<div className="
  bg-white border border-gray-200 rounded-xl p-6
  hover:shadow-lg hover:-translate-y-1
  transition-all duration-200 ease-out
  cursor-pointer
">
  <h3>{course.title}</h3>
</div>

// Fade in
<div className="opacity-0 animate-fade-in">

// Pulse skeleton
<div className="bg-gray-200 animate-pulse rounded h-4 w-48" />
\`\`\`

### Group Hover (Parent -> Child)

\`\`\`tsx
<div className="group relative overflow-hidden rounded-xl">
  <img src="/thumb.jpg" className="
    w-full transition-transform duration-300
    group-hover:scale-105
  " />
  <div className="
    absolute inset-0 bg-black/0
    group-hover:bg-black/40
    transition-colors duration-300
    flex items-center justify-center
  ">
    <span className="
      text-white opacity-0
      group-hover:opacity-100
      transition-opacity duration-300
    ">View Course</span>
  </div>
</div>
\`\`\`

### Peer (Sibling State)

\`\`\`tsx
<div className="relative">
  <input
    type="text"
    placeholder=" "
    className="peer border-b-2 border-gray-300 focus:border-amber-500 pt-4 pb-1 w-full bg-transparent"
  />
  <label className="
    absolute left-0 top-4 text-gray-400
    peer-focus:top-0 peer-focus:text-xs peer-focus:text-amber-500
    peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs
    transition-all duration-150
  ">Name</label>
</div>
\`\`\``,
    quiz: [
      { q: 'How do you add a hover style in Tailwind?', options: ['&:hover { ... }', 'hover: prefix — hover:bg-blue-600', '.hover-blue { }', 'onMouseEnter handler'], correct: 1, explanation: 'hover: is a variant prefix. hover:bg-blue-600 generates CSS with :hover pseudoclass applied — no custom CSS needed.' },
      { q: 'What does the group class do?', options: ['Groups components', 'Enables group-hover: on children — style children based on parent hover state', 'Required for animations', 'Same as a container'], correct: 1, explanation: 'Add group to a parent element, then use group-hover:, group-focus:, etc. on children to apply styles when the parent changes state.' },
      { q: 'What classes do you need for a smooth hover transition?', options: ['just hover:', 'hover: + transition + duration — e.g. hover:bg-blue-600 transition-colors duration-200', 'animation: class', 'Just CSS'], correct: 1, explanation: 'Tailwind applies hover styles instantly by default. Add transition-colors (or transition-all) and duration-200 for smooth animated transitions.' },
      { q: 'What does peer enable?', options: ['Parent-child styles', 'Style a sibling element based on a form input\'s state — peer-focus:, peer-invalid:', 'Group animations', 'Required for forms'], correct: 1, explanation: 'peer marks an input; peer-focus: and peer-invalid: on adjacent siblings apply when the peer input is focused or invalid. Used for floating labels.' },
    ],
    ide: {
      language: 'html',
      task: 'Build an interactive course card that demonstrates group hover. When the card is hovered: (1) the card lifts with a shadow and upward translate, (2) a dark overlay appears over the thumbnail area, (3) a "View Course" label fades in on the overlay. Use group, group-hover:, transition, and duration utilities. Tailwind CDN is loaded.',
      starterCode: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Interactive Card Exercise</title>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-8">

  <!--
    TASK: Add interactive hover states using group + group-hover:

    1. Card wrapper: add "group" + hover:shadow-xl + hover:-translate-y-1 + transition-all + duration-200
    2. Thumbnail overlay div: starts bg-black/0, on group hover becomes bg-black/50 + transition-colors
    3. "View Course" span: starts opacity-0, on group hover becomes opacity-100 + transition-opacity

    The card structure is already set up — just add the right classes.
  -->

  <div class="bg-white rounded-2xl overflow-hidden max-w-xs w-full cursor-pointer">

    <!-- Thumbnail area with overlay -->
    <div class="relative h-40 bg-gradient-to-br from-amber-400 to-amber-600">
      <!-- Overlay: should darken on card hover -->
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Label: should fade in on card hover -->
        <span class="text-white font-semibold text-sm">View Course</span>
      </div>
    </div>

    <!-- Card body -->
    <div class="p-5">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Tailwind CSS</h3>
      <p class="text-sm text-gray-600">Utility-first CSS for production UIs.</p>
    </div>

  </div>

</body>
</html>`,
      solution: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Interactive Card Exercise</title>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-8">

  <div class="group bg-white rounded-2xl overflow-hidden max-w-xs w-full cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

    <div class="relative h-40 bg-gradient-to-br from-amber-400 to-amber-600">
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
        <span class="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Course
        </span>
      </div>
    </div>

    <div class="p-5">
      <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Crash Course</span>
      <h3 class="font-bold text-gray-900 mt-2 mb-1">Tailwind CSS</h3>
      <p class="text-sm text-gray-600">Utility-first CSS for production UIs.</p>
    </div>

  </div>

</body>
</html>`,
      hints: [
        'Add "group" to the card wrapper div — this enables group-hover: on all descendants',
        'Card lift: add hover:shadow-xl hover:-translate-y-1 transition-all duration-200 to the card wrapper',
        'Overlay: starts as bg-black/0 (invisible), becomes group-hover:bg-black/50 (dark) + transition-colors duration-300',
        'Label: starts as opacity-0 (invisible), becomes group-hover:opacity-100 (visible) + transition-opacity duration-300',
      ],
    },
  },
  {
    id: 'cc-tailwind-m05', track: 'crash', title: 'Component Patterns',
    subtitle: 'Build reusable, composable UI components using Tailwind utility patterns.',
    moduleObjective: 'Build card, button, badge, and form components following Tailwind\'s composition model.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Masters',
    xp: 175, duration: 11, module: 5, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Component extraction', definition: 'In Tailwind, extract components in JavaScript/TypeScript (a React component), not with @apply. @apply fights the JIT scanner.' },
      { term: 'Variant props', definition: 'Pass a variant prop to a component and map it to class names with cn(). Used for button variants: primary, secondary, ghost.' },
      { term: 'cva()', definition: 'Class Variance Authority — defines component variants with type-safe variant props. Pairs with cn() from shadcn/ui.' },
      { term: 'shadcn/ui', definition: 'Open-source component library built on Tailwind + Radix UI. Copy-paste components into your project — not installed as a dependency.' },
      { term: 'Compound variants', definition: 'cva compound variants — apply classes when a combination of variants is active: size=sm + variant=ghost.' },
    ],
    content: `## Component Patterns

In Tailwind, components live in your component files — not CSS. Extract via React components with variant props.

### Button Component with Variants

\`\`\`tsx
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        ghost: "hover:bg-gray-100 text-gray-700",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}

// Usage
<Button variant="primary" size="lg">Start Course</Button>
<Button variant="ghost">Cancel</Button>
\`\`\`

### Course Card Component

\`\`\`tsx
function CourseCard({ course }: { course: Course }) {
  return (
    <div className="
      group bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-2xl overflow-hidden
      hover:shadow-lg hover:-translate-y-0.5
      transition-all duration-200
    ">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge level={course.level} />
          <span className="text-xs text-gray-500">{course.duration} min</span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {course.subtitle}
        </p>
      </div>
      <div className="px-5 pb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-amber-600">{course.xp} XP</span>
        <span className="text-xs text-gray-400">Module {course.module}</span>
      </div>
    </div>
  )
}
\`\`\``,
    quiz: [
      { q: 'Where should you extract Tailwind components?', options: ['In a CSS @apply rule', 'In a React (or other JS framework) component — not @apply', 'In a global CSS file', 'Both @apply and components are equivalent'], correct: 1, explanation: 'Extract components in JavaScript/TypeScript, not @apply. @apply works but conflicts with the JIT scanner and loses variant logic. Component files are the canonical pattern.' },
      { q: 'What does cva() do?', options: ['Creates animations', 'Defines component variants with type-safe props — base classes + variant maps', 'Required for Tailwind v4', 'Compiles class names'], correct: 1, explanation: 'cva (Class Variance Authority) lets you define a component\'s base classes and variant classes together. TypeScript enforces valid variant values.' },
      { q: 'What is shadcn/ui?', options: ['A Tailwind replacement', 'Copy-paste component library built on Tailwind + Radix UI — you own the code, no dependency to update', 'A design system', 'Paid components'], correct: 1, explanation: 'shadcn/ui components are copied into your project (not installed as an npm package). You own and modify them. Built on Tailwind + Radix primitives.' },
      { q: 'How do you allow custom className on a component with variants?', options: ['Not possible', 'Spread ...props and pass cn(buttonVariants({variant}), className) — user className last to allow overrides', 'Use !important', 'Separate prop'], correct: 1, explanation: 'Pass className as the last argument to cn() so it takes precedence over variant classes. Spread ...props passes HTML attributes through.' },
    ],
  },
  {
    id: 'cc-tailwind-m06', track: 'crash', title: 'Custom Config & Plugins',
    subtitle: 'Extend Tailwind with custom utilities, themes, and plugins for design systems.',
    moduleObjective: 'Configure tailwind.config.ts with custom tokens, typography plugin, and forms plugin.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Masters',
    xp: 175, duration: 11, module: 6, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'theme.extend', definition: 'Add to the default theme without replacing it. The right place for custom colors, fonts, spacing, shadows.' },
      { term: 'theme (replace)', definition: 'Replaces the entire default theme for a key — theme.colors replaces all colors, not just adds to them.' },
      { term: '@tailwindcss/typography', definition: 'prose plugin — applies beautiful typography to blocks of HTML rendered from markdown. Classes: prose prose-lg prose-amber.' },
      { term: '@tailwindcss/forms', definition: 'Resets form element styles to a consistent, styleable baseline. Lets you style inputs without fighting browser defaults.' },
      { term: 'Custom plugin', definition: 'addUtilities() — add custom utility classes that integrate with Tailwind\'s variant system (hover:, dark:, responsive).' },
    ],
    content: `## Custom Config & Plugins

tailwind.config.ts is where you define your design system. Custom tokens become utility classes automatically.

### Full Config Example

\`\`\`tsx
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb', 100: '#fef3c7',
          500: '#f59e0b', 600: '#d97706',
          700: '#b45309', 900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config
\`\`\`

### Typography Plugin (Prose)

\`\`\`tsx
<article className="prose prose-lg prose-amber dark:prose-invert max-w-none">
  <div dangerouslySetInnerHTML={{ __html: courseContentHtml }} />
</article>
\`\`\`

prose-amber colors links and headings with amber. prose-invert for dark mode.

### Custom Plugin

\`\`\`tsx
const plugin = require('tailwindcss/plugin')

plugins: [
  plugin(function({ addUtilities }) {
    addUtilities({
      '.text-balance': { 'text-wrap': 'balance' },
      '.scrollbar-hide': {
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      },
    })
  }),
]
\`\`\``,
    quiz: [
      { q: 'What is the difference between theme.extend and theme?', options: ['They are identical', 'theme.extend adds to defaults; theme (without extend) replaces the entire default for that key', 'theme is for colors only', 'extend is for plugins only'], correct: 1, explanation: 'theme.colors = { ... } replaces ALL colors. theme.extend.colors = { ... } adds to the built-in palette. Almost always use extend.' },
      { q: 'What does the typography plugin provide?', options: ['Web fonts', 'prose class for beautiful markdown/HTML rendering with typographic spacing and styles', 'Font size utilities', 'Text animation'], correct: 1, explanation: 'The prose class from @tailwindcss/typography applies opinionated typographic defaults to HTML blocks — headings, paragraphs, code, lists.' },
      { q: 'What does @tailwindcss/forms do?', options: ['Adds form layout utilities', 'Resets browser form element styles to a styleable baseline', 'Creates form validation', 'Required for inputs'], correct: 1, explanation: 'Browser defaults for inputs, selects, and textareas are hard to style. The forms plugin resets them so you can apply Tailwind classes cleanly.' },
      { q: 'How do you add a custom animation?', options: ['CSS animation file', 'Add to theme.extend.keyframes and theme.extend.animation in config — then use animate-your-name class', 'JS only', 'Only with a plugin'], correct: 1, explanation: 'Define keyframes and animation names in config.theme.extend. Tailwind generates animate-{name} utility class usable with variants.' },
    ],
  },
  {
    id: 'cc-tailwind-m07', track: 'crash', title: 'Layout Patterns',
    subtitle: 'Build dashboards, sidebars, and grids with Tailwind\'s flexbox and grid utilities.',
    moduleObjective: 'Implement sidebar layouts, sticky headers, and responsive dashboard grids.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'PhD',
    xp: 200, duration: 11, module: 7, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'sticky top-0', definition: 'Makes a header stick to the top of the viewport on scroll. backdrop-blur-md for glassmorphism effect.' },
      { term: 'overflow-y-auto', definition: 'Adds a vertical scrollbar to a container when content overflows — used for scrollable sidebars and panels.' },
      { term: 'z-index utilities', definition: 'z-0 through z-50, z-[100] — controls stack order. Essential for modals, dropdowns, and overlapping elements.' },
      { term: 'aspect-ratio', definition: 'aspect-video (16:9), aspect-square (1:1) — maintains ratio regardless of width. Uses the aspect-ratio CSS property.' },
      { term: 'object-fit utilities', definition: 'object-cover, object-contain — control how images fill their container. Pair with fill Image in Next.js.' },
    ],
    content: `## Layout Patterns

Production dashboards share common patterns: sticky nav, scrollable sidebar, main content area, responsive grids.

### App Shell Layout

\`\`\`tsx
// Full app shell: sticky header + sidebar + scrollable main
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sticky Header */}
      <header className="
        sticky top-0 z-50
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-md border-b border-gray-200 dark:border-gray-800
        h-16 flex items-center px-6
      ">
        <nav className="flex items-center gap-6 w-full">
          <Logo />
          <div className="ml-auto flex items-center gap-4">
            <UserMenu />
          </div>
        </nav>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Fixed Sidebar */}
        <aside className="
          w-64 hidden lg:flex flex-col
          border-r border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-900
          overflow-y-auto
        ">
          <Sidebar />
        </aside>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
\`\`\`

### Dashboard Grid

\`\`\`tsx
<div className="space-y-6">
  {/* Stat Cards */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map(stat => <StatCard key={stat.label} stat={stat} />)}
  </div>

  {/* Main + Side */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <MainChart />
    </div>
    <div>
      <RecentActivity />
    </div>
  </div>
</div>
\`\`\`

### Modal Overlay

\`\`\`tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div
    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  />
  <div className="
    relative z-10 bg-white dark:bg-gray-900
    rounded-2xl shadow-xl
    w-full max-w-lg mx-4
    p-6
  ">
    {children}
  </div>
</div>
\`\`\``,
    quiz: [
      { q: 'How do you make a sticky header?', options: ['position: fixed only', 'sticky top-0 z-50 — sticks to viewport top when scrolled, stays in document flow', 'overflow: hidden', 'fixed top-0'], correct: 1, explanation: 'sticky top-0 sticks the element when it reaches the top during scroll while staying in the document flow. z-50 keeps it above content.' },
      { q: 'What does h-[calc(100vh-4rem)] do?', options: ['Sets height to 100vh', 'Sets height to viewport height minus 64px (4rem = 64px at base font size)', 'CSS error', 'Only works on desktop'], correct: 1, explanation: 'Tailwind arbitrary values support calc(): h-[calc(100vh-4rem)] = height: calc(100vh - 4rem). Subtracts the 16 (h-16 = 4rem) header height.' },
      { q: 'How do you make a scrollable sidebar that matches the viewport?', options: ['height: 100%', 'overflow-y-auto with a bounded height (e.g. h-[calc(100vh-4rem)])', 'scroll-auto', 'position: relative'], correct: 1, explanation: 'For an element to be scrollable, it needs overflow-y-auto AND a bounded height. Without a height constraint, it expands to fit content.' },
      { q: 'What does lg:col-span-2 do in a grid?', options: ['Adds 2 columns', 'Makes the element span 2 columns on lg screens and wider', 'Applies at all sizes', 'Merges rows'], correct: 1, explanation: 'col-span-2 makes the element span 2 grid columns. lg: prefix applies it only at 1024px+ — different span on mobile vs desktop.' },
    ],
  },
  {
    id: 'cc-tailwind-m08', track: 'crash', title: 'Tailwind v4 & Production',
    subtitle: 'Understand Tailwind v4 CSS-first config and production optimization.',
    moduleObjective: 'Migrate to Tailwind v4 CSS-first config and optimize production builds.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Tailwind v4', definition: 'CSS-first config — configuration in CSS with @theme instead of tailwind.config.ts. Lightning CSS engine replaces PostCSS.' },
      { term: '@theme', definition: 'v4 CSS directive for defining design tokens directly in CSS. @theme { --color-brand-500: #f59e0b; }' },
      { term: 'CSS cascade layers', definition: 'v4 uses @layer for base, components, utilities — proper cascade control, no specificity surprises.' },
      { term: 'Purging', definition: 'Tailwind scans content files and removes unused classes. In v4 this is automatic. In v3, configure content array.' },
      { term: 'twMerge', definition: 'Resolves conflicting Tailwind classes: twMerge("px-4 px-6") = "px-6". Critical when components accept className overrides.' },
    ],
    content: `## Tailwind v4 & Production

Tailwind v4 shifts to CSS-first configuration. The JIT engine is rewritten in Rust via Lightning CSS — significantly faster builds.

### Tailwind v4: CSS Config

\`\`\`css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-50: #fffbeb;
  --color-brand-500: #f59e0b;
  --color-brand-700: #b45309;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --radius-4xl: 2rem;
  --animate-fade-in: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
\`\`\`

No tailwind.config.ts needed for basic theming. Custom tokens become utilities: bg-brand-500, text-brand-700.

### v3 vs v4 Key Differences

\`\`\`
v3                          v4
tailwind.config.ts          @theme in CSS
content: [...]              auto-detected
PostCSS                     Lightning CSS (faster)
darkMode: 'class'           @variant dark (&:where(.dark, .dark *))
require() plugins           @plugin directives
\`\`\`

### twMerge for Class Conflicts

\`\`\`tsx
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Without twMerge: both px-4 and px-6 would be in the class string (conflict)
// With twMerge: the LAST one wins correctly
<Button className="px-6">  // overrides Button's default px-4
\`\`\`

### Production Checklist

\`\`\`
✅ All content paths in tailwind.config.ts content array (v3)
✅ No dynamic class construction: bg-\${color}-500 (JIT can't scan)
✅ Safelist for dynamic classes: safelist: ['bg-red-500', 'bg-green-500']
✅ Purge working: check final CSS size (should be under 20KB)
✅ twMerge in cn() utility for overrideable components
✅ No @apply for anything you can do with a React component
\`\`\``,
    quiz: [
      { q: 'What is the main difference in Tailwind v4?', options: ['More utility classes', 'CSS-first config with @theme in CSS files instead of tailwind.config.ts', 'New color palette', 'React-only'], correct: 1, explanation: 'Tailwind v4 moves config to CSS @theme directives. No tailwind.config.ts required for theming. The engine switches to Lightning CSS (Rust).' },
      { q: 'What does twMerge solve?', options: ['Type errors', 'Conflicting Tailwind classes — twMerge("px-4 px-6") = "px-6" (last wins correctly)', 'Build optimization', 'Required for cn()'], correct: 1, explanation: 'Without twMerge, clsx would output both "px-4 px-6" — the first class would win due to specificity. twMerge understands Tailwind and keeps only the last.' },
      { q: 'Why can\'t you use dynamic class names like bg-${color}-500?', options: ['TypeScript error', 'JIT scans files as text — template literals are not evaluated at scan time, so the class is never generated', 'Runtime error', 'Works in v4 only'], correct: 1, explanation: 'Tailwind JIT scans code statically as text — it can\'t evaluate template literals. Write full class strings; use safelist for truly dynamic classes.' },
      { q: 'What should production Tailwind CSS output be?', options: ['As large as needed', 'Under 20KB for most apps — JIT removes all unused classes', '1MB is normal', 'Depends on theme'], correct: 1, explanation: 'With JIT, Tailwind\'s purged output for most Next.js apps is 5-20KB. Anything larger suggests unused classes slipping through or missing purge config.' },
    ],
  },
]
