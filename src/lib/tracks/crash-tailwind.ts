import type { Course } from '../courses'

const CC_TAILWIND_OBJ = 'Style production UIs with Tailwind CSS â€" utility classes, responsive design, dark mode, custom themes, and component patterns used in real Next.js projects.'

export const crashTailwindCourses: Course[] = [
  {
    id: 'cc-tailwind-m01', track: 'crash', title: 'Tailwind Fundamentals',
    subtitle: 'Style elements directly with utility classes instead of writing custom CSS.',
    moduleObjective: 'Apply Tailwind utility classes for spacing, color, typography, and borders.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Utility-first', definition: 'Compose styles by combining small, single-purpose classes directly in HTML/JSX instead of writing custom CSS.' },
      { term: 'JIT compiler', definition: 'Just-in-time â€" Tailwind scans your files and generates only the CSS classes you actually use. Zero unused CSS.' },
      { term: 'Spacing scale', definition: 'Tailwind\'s default spacing uses a 4px base unit. p-1=4px, p-2=8px, p-4=16px, p-8=32px.' },
      { term: 'Arbitrary values', definition: 'w-[327px], text-[#c9a84c], mt-[13px] â€" escape the scale for one-off design values.' },
      { term: 'cn() / clsx()', definition: 'Utility for conditionally joining class names: cn("base", condition && "extra"). Ships in shadcn/ui as lib/utils.' },
    ],
    content: `## Tailwind Fundamentals

Tailwind is a utility-first CSS framework. Every CSS property has corresponding utility classes â€" no custom CSS needed for most UI work.

### Core Utilities

\`\`\`tsx
// Spacing
<div className="p-4 px-6 py-3 mt-8 mb-4 gap-4">
  {/* p=padding, m=margin, gap=gap */}
</div>

// Typography
<h1 className="text-3xl font-bold tracking-tight text-gray-900">
  JST Academy
</h1>
<p className="text-sm text-gray-600 leading-relaxed">
  PhD-level crash courses
</p>

// Colors and backgrounds
<div className="bg-amber-500 text-white">
<div className="bg-[#f59e0b] text-[#1a1a1a]">  {/* arbitrary */}

// Borders and radius
<div className="border border-gray-200 rounded-xl shadow-sm">
<button className="rounded-full border-2 border-black">
\`\`\`

### Flexbox and Grid

\`\`\`tsx
// Flex
<div className="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

// Grid
<div className="grid grid-cols-3 gap-6">
  {courses.map(c => <CourseCard key={c.id} course={c} />)}
</div>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
\`\`\`

### Width, Height, Display

\`\`\`tsx
<div className="w-full max-w-4xl mx-auto">
<div className="w-1/2 h-48">
<div className="min-h-screen flex flex-col">
<span className="hidden md:block">  {/* hide on mobile */}
<span className="block md:hidden">  {/* hide on desktop */}
\`\`\`

### Conditional Classes with cn()

\`\`\`tsx
import { cn } from '@/lib/utils'

function Badge({ level }: { level: string }) {
  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium rounded-full",
      level === 'Basic' && "bg-gray-100 text-gray-600",
      level === 'Masters' && "bg-blue-100 text-blue-700",
      level === 'PhD' && "bg-amber-100 text-amber-700",
    )}>
      {level}
    </span>
  )
}
\`\`\``,
    quiz: [
      { q: 'What does the JIT compiler do?', options: ['Slows builds', 'Scans your code and generates only the CSS classes you actually use â€" zero bloat', 'Compiles TypeScript', 'Required for dark mode'], correct: 1, explanation: 'JIT generates CSS on demand by scanning your HTML/JSX. Only classes you reference are included â€" typical production bundles are under 10KB.' },
      { q: 'What is p-4 in Tailwind?', options: ['4px padding', '4rem padding', '16px padding (4 Ã— 4px base unit)', '4% padding'], correct: 2, explanation: 'Tailwind\'s spacing scale uses a 4px base unit. p-4 = 16px, p-8 = 32px, p-2 = 8px. Applies to all four sides.' },
      { q: 'How do you use a one-off value not in the scale?', options: ['Override the config', 'Arbitrary values: w-[327px], text-[#c9a84c]', 'Write inline style', 'Impossible in Tailwind'], correct: 1, explanation: 'Square brackets let you escape the scale: w-[327px] generates exactly width: 327px. Works for any property.' },
      { q: 'What does cn() do?', options: ['Creates components', 'Conditionally joins class names â€" useful for dynamic styling based on props', 'Required by Tailwind', 'Compiles classes'], correct: 1, explanation: 'cn() (from clsx + twMerge) joins class strings and handles conditional classes cleanly. Ships with shadcn/ui.' },
    ],
  },
  {
    id: 'cc-tailwind-m02', track: 'crash', title: 'Responsive Design',
    subtitle: 'Build mobile-first layouts using Tailwind\'s responsive prefixes.',
    moduleObjective: 'Apply Tailwind responsive prefixes to build mobile-first adaptive layouts.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Basic',
    xp: 150, duration: 10, module: 2, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Mobile-first', definition: 'Unprefixed utilities apply to all sizes. Prefixed (sm:, md:) override upward. Start from mobile and expand.' },
      { term: 'Breakpoints', definition: 'sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px. All "min-width" â€" activate at that width and up.' },
      { term: 'Container', definition: 'max-w-screen-lg mx-auto px-4 â€" centers content with responsive max-widths. Or use the container class.' },
      { term: 'Stack to row', definition: 'flex-col md:flex-row â€" vertical on mobile, horizontal on desktop. Common pattern for nav and cards.' },
      { term: 'Responsive grid', definition: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 â€" single column on mobile, expanding on larger screens.' },
    ],
    content: `## Responsive Design

Tailwind is mobile-first. Unprefixed classes apply everywhere. Prefixed classes kick in at the breakpoint and above.

### Breakpoints

\`\`\`tsx
// sm: â‰¥640px  md: â‰¥768px  lg: â‰¥1024px  xl: â‰¥1280px  2xl: â‰¥1536px

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
      { q: 'What does md: prefix mean?', options: ['Applies only at 768px exactly', 'Applies at 768px and wider (min-width: 768px)', 'Applies below 768px', 'Medium importance'], correct: 1, explanation: 'All Tailwind breakpoints are min-width. md: applies at 768px and up â€" not just at exactly 768px.' },
      { q: 'How do you show an element only on desktop?', options: ['display-desktop', 'hidden md:block or hidden md:flex', 'desktop:show', 'visible-lg'], correct: 1, explanation: 'hidden hides on all sizes; md:block or md:flex reveals it at 768px and up. The mobile-first pattern for show/hide.' },
      { q: 'What is the pattern for a responsive grid (1 -> 2 -> 3 cols)?', options: ['responsive-grid-3', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'cols-auto sm:cols-2 lg:cols-3', 'flex-wrap'], correct: 1, explanation: 'grid + grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 â€" starts single column and adds columns at each breakpoint.' },
    ],
  },
  {
    id: 'cc-tailwind-m03', track: 'crash', title: 'Dark Mode & Color Themes',
    subtitle: 'Implement dark mode and custom color palettes using Tailwind\'s theming system.',
    moduleObjective: 'Configure dark mode variants and custom color tokens in tailwind.config.ts.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Basic',
    xp: 150, duration: 10, module: 3, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'dark: prefix', definition: 'dark:bg-gray-900 â€" applies when dark mode is active. Works with "class" strategy (class="dark" on html) or "media" (system preference).' },
      { term: 'darkMode: "class"', definition: 'Toggle dark mode by adding class="dark" to the html element. Gives programmatic control over the theme.' },
      { term: 'Custom colors', definition: 'Extend the palette in tailwind.config.ts. Custom colors become utility classes: bg-brand-500, text-brand-600.' },
      { term: 'CSS variables', definition: 'Define a color as a CSS custom property and reference it in Tailwind config â€" enables runtime theme switching.' },
      { term: 'Opacity modifier', definition: 'bg-black/50, text-white/80 â€" slash syntax adds opacity to any color utility.' },
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

// app/layout.tsx â€" add class to html
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
      { q: 'What does darkMode: "class" mean?', options: ['Dark mode is always on', 'Dark mode activates when the html element has class="dark" â€" programmatic control', 'Follows system preference only', 'CSS-only dark mode'], correct: 1, explanation: '"class" strategy gives you explicit control â€" add class="dark" to toggle dark mode. Alternative is "media" which uses prefers-color-scheme.' },
      { q: 'How do you add a custom color to Tailwind?', options: ['Import CSS variables', 'Add it to theme.extend.colors in tailwind.config.ts â€" it becomes a utility class', 'Use inline styles', 'Impossible without a plugin'], correct: 1, explanation: 'theme.extend.colors adds to the default palette. Define brand: { 500: "#f59e0b" } and use bg-brand-500, text-brand-500, border-brand-500.' },
      { q: 'What does bg-black/50 do?', options: ['50% darker black', 'Black background at 50% opacity', '50th black shade', 'Blur effect'], correct: 1, explanation: 'The slash opacity modifier applies opacity: bg-black/50 = background-color: rgba(0, 0, 0, 0.5). Works with any color.' },
      { q: 'How do you style differently in dark mode?', options: ['media:dark:', 'dark: prefix â€" dark:bg-gray-900 applies when dark mode is active', 'night:', 'Separate stylesheet'], correct: 1, explanation: 'dark: is a variant prefix. dark:bg-gray-900 sets the background only when the dark class is on the html element (or system is dark in media mode).' },
    ],
  },
  {
    id: 'cc-tailwind-m04', track: 'crash', title: 'State Variants & Animations',
    subtitle: 'Handle hover, focus, active states and add motion with Tailwind transitions.',
    moduleObjective: 'Apply state variants (hover, focus, disabled) and transitions to interactive elements.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'hover: prefix', definition: 'hover:bg-blue-600 â€" applies when the element is hovered. Stacks with dark: and other variants.' },
      { term: 'focus: prefix', definition: 'focus:ring-2 focus:ring-offset-2 â€" applies on keyboard focus. Critical for accessibility.' },
      { term: 'transition', definition: 'transition, transition-colors, transition-all â€" enables smooth property changes. Pair with duration-200 ease-in-out.' },
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
      { q: 'How do you add a hover style in Tailwind?', options: ['&:hover { ... }', 'hover: prefix â€" hover:bg-blue-600', '.hover-blue { }', 'onMouseEnter handler'], correct: 1, explanation: 'hover: is a variant prefix. hover:bg-blue-600 generates CSS with :hover pseudoclass applied â€" no custom CSS needed.' },
      { q: 'What does the group class do?', options: ['Groups components', 'Enables group-hover: on children â€" style children based on parent hover state', 'Required for animations', 'Same as a container'], correct: 1, explanation: 'Add group to a parent element, then use group-hover:, group-focus:, etc. on children to apply styles when the parent changes state.' },
      { q: 'What classes do you need for a smooth hover transition?', options: ['just hover:', 'hover: + transition + duration â€" e.g. hover:bg-blue-600 transition-colors duration-200', 'animation: class', 'Just CSS'], correct: 1, explanation: 'Tailwind applies hover styles instantly by default. Add transition-colors (or transition-all) and duration-200 for smooth animated transitions.' },
      { q: 'What does peer enable?', options: ['Parent-child styles', 'Style a sibling element based on a form input\'s state â€" peer-focus:, peer-invalid:', 'Group animations', 'Required for forms'], correct: 1, explanation: 'peer marks an input; peer-focus: and peer-invalid: on adjacent siblings apply when the peer input is focused or invalid. Used for floating labels.' },
    ],
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
      { term: 'cva()', definition: 'Class Variance Authority â€" defines component variants with type-safe variant props. Pairs with cn() from shadcn/ui.' },
      { term: 'shadcn/ui', definition: 'Open-source component library built on Tailwind + Radix UI. Copy-paste components into your project â€" not installed as a dependency.' },
      { term: 'Compound variants', definition: 'cva compound variants â€" apply classes when a combination of variants is active: size=sm + variant=ghost.' },
    ],
    content: `## Component Patterns

In Tailwind, components live in your component files â€" not CSS. Extract via React components with variant props.

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
      { q: 'Where should you extract Tailwind components?', options: ['In a CSS @apply rule', 'In a React (or other JS framework) component â€" not @apply', 'In a global CSS file', 'Both @apply and components are equivalent'], correct: 1, explanation: 'Extract components in JavaScript/TypeScript, not @apply. @apply works but conflicts with the JIT scanner and loses variant logic. Component files are the canonical pattern.' },
      { q: 'What does cva() do?', options: ['Creates animations', 'Defines component variants with type-safe props â€" base classes + variant maps', 'Required for Tailwind v4', 'Compiles class names'], correct: 1, explanation: 'cva (Class Variance Authority) lets you define a component\'s base classes and variant classes together. TypeScript enforces valid variant values.' },
      { q: 'What is shadcn/ui?', options: ['A Tailwind replacement', 'Copy-paste component library built on Tailwind + Radix UI â€" you own the code, no dependency to update', 'A design system', 'Paid components'], correct: 1, explanation: 'shadcn/ui components are copied into your project (not installed as an npm package). You own and modify them. Built on Tailwind + Radix primitives.' },
      { q: 'How do you allow custom className on a component with variants?', options: ['Not possible', 'Spread ...props and pass cn(buttonVariants({variant}), className) â€" user className last to allow overrides', 'Use !important', 'Separate prop'], correct: 1, explanation: 'Pass className as the last argument to cn() so it takes precedence over variant classes. Spread ...props passes HTML attributes through.' },
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
      { term: 'theme (replace)', definition: 'Replaces the entire default theme for a key â€" theme.colors replaces all colors, not just adds to them.' },
      { term: '@tailwindcss/typography', definition: 'prose plugin â€" applies beautiful typography to blocks of HTML rendered from markdown. Classes: prose prose-lg prose-amber.' },
      { term: '@tailwindcss/forms', definition: 'Resets form element styles to a consistent, styleable baseline. Lets you style inputs without fighting browser defaults.' },
      { term: 'Custom plugin', definition: 'addUtilities() â€" add custom utility classes that integrate with Tailwind\'s variant system (hover:, dark:, responsive).' },
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
      { q: 'What does the typography plugin provide?', options: ['Web fonts', 'prose class for beautiful markdown/HTML rendering with typographic spacing and styles', 'Font size utilities', 'Text animation'], correct: 1, explanation: 'The prose class from @tailwindcss/typography applies opinionated typographic defaults to HTML blocks â€" headings, paragraphs, code, lists.' },
      { q: 'What does @tailwindcss/forms do?', options: ['Adds form layout utilities', 'Resets browser form element styles to a styleable baseline', 'Creates form validation', 'Required for inputs'], correct: 1, explanation: 'Browser defaults for inputs, selects, and textareas are hard to style. The forms plugin resets them so you can apply Tailwind classes cleanly.' },
      { q: 'How do you add a custom animation?', options: ['CSS animation file', 'Add to theme.extend.keyframes and theme.extend.animation in config â€" then use animate-your-name class', 'JS only', 'Only with a plugin'], correct: 1, explanation: 'Define keyframes and animation names in config.theme.extend. Tailwind generates animate-{name} utility class usable with variants.' },
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
      { term: 'overflow-y-auto', definition: 'Adds a vertical scrollbar to a container when content overflows â€" used for scrollable sidebars and panels.' },
      { term: 'z-index utilities', definition: 'z-0 through z-50, z-[100] â€" controls stack order. Essential for modals, dropdowns, and overlapping elements.' },
      { term: 'aspect-ratio', definition: 'aspect-video (16:9), aspect-square (1:1) â€" maintains ratio regardless of width. Uses the aspect-ratio CSS property.' },
      { term: 'object-fit utilities', definition: 'object-cover, object-contain â€" control how images fill their container. Pair with fill Image in Next.js.' },
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
      { q: 'How do you make a sticky header?', options: ['position: fixed only', 'sticky top-0 z-50 â€" sticks to viewport top when scrolled, stays in document flow', 'overflow: hidden', 'fixed top-0'], correct: 1, explanation: 'sticky top-0 sticks the element when it reaches the top during scroll while staying in the document flow. z-50 keeps it above content.' },
      { q: 'What does h-[calc(100vh-4rem)] do?', options: ['Sets height to 100vh', 'Sets height to viewport height minus 64px (4rem = 64px at base font size)', 'CSS error', 'Only works on desktop'], correct: 1, explanation: 'Tailwind arbitrary values support calc(): h-[calc(100vh-4rem)] = height: calc(100vh - 4rem). Subtracts the 16 (h-16 = 4rem) header height.' },
      { q: 'How do you make a scrollable sidebar that matches the viewport?', options: ['height: 100%', 'overflow-y-auto with a bounded height (e.g. h-[calc(100vh-4rem)])', 'scroll-auto', 'position: relative'], correct: 1, explanation: 'For an element to be scrollable, it needs overflow-y-auto AND a bounded height. Without a height constraint, it expands to fit content.' },
      { q: 'What does lg:col-span-2 do in a grid?', options: ['Adds 2 columns', 'Makes the element span 2 columns on lg screens and wider', 'Applies at all sizes', 'Merges rows'], correct: 1, explanation: 'col-span-2 makes the element span 2 grid columns. lg: prefix applies it only at 1024px+ â€" different span on mobile vs desktop.' },
    ],
  },
  {
    id: 'cc-tailwind-m08', track: 'crash', title: 'Tailwind v4 & Production',
    subtitle: 'Understand Tailwind v4 CSS-first config and production optimization.',
    moduleObjective: 'Migrate to Tailwind v4 CSS-first config and optimize production builds.',
    courseObjective: CC_TAILWIND_OBJ, crashId: 'cc-tailwind', crashTitle: 'Tailwind CSS', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'Tailwind CSS Crash Course',
    keyTerms: [
      { term: 'Tailwind v4', definition: 'CSS-first config â€" configuration in CSS with @theme instead of tailwind.config.ts. Lightning CSS engine replaces PostCSS.' },
      { term: '@theme', definition: 'v4 CSS directive for defining design tokens directly in CSS. @theme { --color-brand-500: #f59e0b; }' },
      { term: 'CSS cascade layers', definition: 'v4 uses @layer for base, components, utilities â€" proper cascade control, no specificity surprises.' },
      { term: 'Purging', definition: 'Tailwind scans content files and removes unused classes. In v4 this is automatic. In v3, configure content array.' },
      { term: 'twMerge', definition: 'Resolves conflicting Tailwind classes: twMerge("px-4 px-6") = "px-6". Critical when components accept className overrides.' },
    ],
    content: `## Tailwind v4 & Production

Tailwind v4 shifts to CSS-first configuration. The JIT engine is rewritten in Rust via Lightning CSS â€" significantly faster builds.

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
âœ… All content paths in tailwind.config.ts content array (v3)
âœ… No dynamic class construction: bg-\${color}-500 (JIT can't scan)
âœ… Safelist for dynamic classes: safelist: ['bg-red-500', 'bg-green-500']
âœ… Purge working: check final CSS size (should be under 20KB)
âœ… twMerge in cn() utility for overrideable components
âœ… No @apply for anything you can do with a React component
\`\`\``,
    quiz: [
      { q: 'What is the main difference in Tailwind v4?', options: ['More utility classes', 'CSS-first config with @theme in CSS files instead of tailwind.config.ts', 'New color palette', 'React-only'], correct: 1, explanation: 'Tailwind v4 moves config to CSS @theme directives. No tailwind.config.ts required for theming. The engine switches to Lightning CSS (Rust).' },
      { q: 'What does twMerge solve?', options: ['Type errors', 'Conflicting Tailwind classes â€" twMerge("px-4 px-6") = "px-6" (last wins correctly)', 'Build optimization', 'Required for cn()'], correct: 1, explanation: 'Without twMerge, clsx would output both "px-4 px-6" â€" the first class would win due to specificity. twMerge understands Tailwind and keeps only the last.' },
      { q: 'Why can\'t you use dynamic class names like bg-${color}-500?', options: ['TypeScript error', 'JIT scans files as text â€" template literals are not evaluated at scan time, so the class is never generated', 'Runtime error', 'Works in v4 only'], correct: 1, explanation: 'Tailwind JIT scans code statically as text â€" it can\'t evaluate template literals. Write full class strings; use safelist for truly dynamic classes.' },
      { q: 'What should production Tailwind CSS output be?', options: ['As large as needed', 'Under 20KB for most apps â€" JIT removes all unused classes', '1MB is normal', 'Depends on theme'], correct: 1, explanation: 'With JIT, Tailwind\'s purged output for most Next.js apps is 5-20KB. Anything larger suggests unused classes slipping through or missing purge config.' },
    ],
  },
]
