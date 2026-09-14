import type { Course } from '../courses'

const CC_HTML_OBJ = 'Build and style real web pages from scratch — semantic HTML structure, the full CSS box model, Flexbox, Grid, and responsive design patterns used in production.'

export const crashHtmlCourses: Course[] = [
  {
    id: 'cc-html-m01', track: 'crash', title: 'HTML Foundations — Structure & Semantics',
    subtitle: 'Write semantic HTML that browsers, screen readers, and search engines all understand.',
    moduleObjective: 'Write semantic HTML that communicates structure and meaning to browsers, assistive tech, and search engines.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'Semantic HTML', definition: 'Using elements that describe their content: nav, main, article, aside, section, header, footer. Improves accessibility and SEO.' },
      { term: 'Block vs Inline', definition: 'Block elements (div, p, h1) start on a new line and take full width. Inline elements (span, a, strong) flow within text.' },
      { term: 'Void Elements', definition: 'Self-closing tags with no content: img, input, br, hr, meta, link. No closing tag needed.' },
      { term: 'DOCTYPE', definition: '<!DOCTYPE html> at the top of every HTML file tells the browser to use modern HTML5 standards mode.' },
      { term: 'Accessibility (a11y)', definition: 'Making content usable for people with disabilities. Semantic HTML, alt text, labels, and ARIA attributes are the foundations.' },
    ],
    content: `## HTML Foundations

HTML is the skeleton of every web page. React generates HTML. Next.js generates HTML. Tailwind styles HTML. Understanding HTML structure means you can read and debug any web page.

### Document Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
  </head>
  <body>
    <!-- Visible content here -->
  </body>
</html>
\`\`\`

### Semantic Elements

\`\`\`html
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <article>
    <h1>Main Heading</h1>
    <p>Content.</p>
  </article>
  <aside><p>Sidebar</p></aside>
</main>
<footer><p>&copy; 2026 J Supreme</p></footer>
\`\`\`

Why semantics matter: screen readers announce landmarks; Google understands primary vs secondary content; heading hierarchy is indexed for search ranking.

### Headings

One h1 per page — the primary topic. h2 for major sections, h3 for subsections. Never skip levels for visual size — use CSS.

### Images

\`\`\`html
<img src="/images/logo.png" alt="J Supreme Tech logo" width="200" height="60">
<!-- Decorative: empty alt so screen reader skips it -->
<img src="/divider.svg" alt="">
\`\`\`

alt is required. Describe the image purpose, not appearance.`,
    quiz: [
      { q: 'What is the purpose of semantic HTML?', options: ['Makes pages load faster', 'Uses elements that describe content meaning — improves accessibility and SEO', 'Required for CSS to work', 'Replaces JavaScript'], correct: 1, explanation: 'Semantic elements communicate structure and purpose to browsers, search engines, and screen readers.' },
      { q: 'How many h1 elements should a page have?', options: ['As many as needed', 'One — the page primary topic', 'At least three', 'None — use CSS instead'], correct: 1, explanation: 'One h1 per page represents the primary topic. Use h2-h6 for sub-sections.' },
      { q: 'What goes in the head element?', options: ['Visible page content', 'Navigation links', 'Metadata, title, CSS links — not visible to user', 'The footer'], correct: 2, explanation: 'The head contains metadata: title, charset, viewport, CSS links, meta tags for SEO.' },
      { q: 'What should an alt attribute contain?', options: ['The image filename', 'A description of the image purpose, or empty string for decorative images', 'The image URL', 'CSS classes'], correct: 1, explanation: 'alt text is read aloud by screen readers. Describe what the image communicates. Use alt="" for purely decorative images.' },
    ],
  },
  {
    id: 'cc-html-m02', track: 'crash', title: 'Forms & Interactive Elements',
    subtitle: 'Build accessible HTML forms with proper inputs, labels, and validation.',
    moduleObjective: 'Build accessible forms with correct input types, labels, and built-in HTML validation.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Basic',
    xp: 150, duration: 10, module: 2, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'label', definition: 'Associates descriptive text with a form input. Required for accessibility. Use for= attribute matching input id.' },
      { term: 'Input Types', definition: 'HTML5 input types: text, email, password, number, tel, date, checkbox, radio, file. Browser provides appropriate keyboard on mobile.' },
      { term: 'required / pattern', definition: 'HTML validation attributes. required prevents empty submission. pattern accepts a regex.' },
      { term: 'fieldset / legend', definition: 'Groups related inputs. legend provides the group label — essential for accessible radio/checkbox groups.' },
      { term: 'form action / method', definition: 'action = URL to send data to. method = GET or POST. React/Next forms override both with onSubmit.' },
    ],
    content: `## Forms & Interactive Elements

Forms are how users interact with applications — every signup, checkout, and settings page is a form.

### Basic Form

\`\`\`html
<form action="/api/contact" method="POST">
  <div>
    <label for="name">Full Name</label>
    <input type="text" id="name" name="name" required placeholder="Jordan Morris">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div>
    <label for="msg">Message</label>
    <textarea id="msg" name="msg" rows="4" required></textarea>
  </div>
  <button type="submit">Send</button>
</form>
\`\`\`

The for= on label must match the id= on input — this is what screen readers use and makes clicking the label focus the input.

### Input Types

\`\`\`html
<input type="email">                          <!-- validates @ syntax -->
<input type="tel">                            <!-- numeric keyboard on mobile -->
<input type="number" min="0" max="100">
<input type="date">                           <!-- native date picker -->
<input type="password">                       <!-- hides characters -->
<input type="file" accept=".pdf,.jpg,.png">
<input type="checkbox" id="terms">
\`\`\`

### Radio Buttons and Fieldset

\`\`\`html
<fieldset>
  <legend>Preferred Contact</legend>
  <label><input type="radio" name="contact" value="email"> Email</label>
  <label><input type="radio" name="contact" value="phone"> Phone</label>
</fieldset>
\`\`\`

### HTML Validation

\`\`\`html
<input type="text" required minlength="2" maxlength="50">
<input type="number" min="18" max="120">
<input type="text" pattern="[A-Z]{3}-[0-9]{4}" title="Format: ABC-1234">
\`\`\``,
    quiz: [
      { q: 'How do you associate a label with an input?', options: ['Place the label next to it', 'Use for= on label matching id= on input', 'Use class= on both', 'CSS adjacent selector'], correct: 1, explanation: 'The for attribute must match the input id. Screen readers use this association.' },
      { q: 'Which input type validates email format?', options: ['type="text" with pattern', 'type="email"', 'type="name"', 'type="string"'], correct: 1, explanation: 'type="email" validates @ syntax and provides the right keyboard on mobile.' },
      { q: 'When should you use fieldset and legend?', options: ['For all form sections', 'When grouping related radio buttons or checkboxes', 'For single inputs', 'Instead of div'], correct: 1, explanation: 'fieldset + legend groups related inputs with an accessible label — essential for radio/checkbox groups.' },
      { q: 'What does the required attribute do?', options: ['Makes the field read-only', 'Prevents form submission if the field is empty', 'Adds a red border', 'Required for accessibility'], correct: 1, explanation: 'required is built-in HTML validation — browser blocks submission if a required field is empty, no JavaScript needed.' },
    ],
  },
  {
    id: 'cc-html-m03', track: 'crash', title: 'The CSS Box Model',
    subtitle: 'Understand how every element is sized and spaced — margin, border, padding, and content.',
    moduleObjective: 'Explain the CSS box model and use margin, padding, and border to control layout spacing precisely.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Basic',
    xp: 150, duration: 11, module: 3, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'Box Model', definition: 'Every HTML element is a box: content + padding + border + margin. box-sizing: border-box makes width include padding and border.' },
      { term: 'box-sizing: border-box', definition: 'Makes width/height include padding and border. Default in all modern frameworks. Always use it.' },
      { term: 'margin vs padding', definition: 'padding = space inside the border. margin = space outside pushing other elements away. margin can be negative; padding cannot.' },
      { term: 'Margin Collapse', definition: 'Adjacent vertical margins between block elements collapse to the larger value. Does not happen with flex/grid children.' },
      { term: 'display property', definition: 'Controls layout: block (full width, new line), inline (flows in text), inline-block, flex, grid, none.' },
    ],
    content: `## The CSS Box Model

Every element is a rectangular box: content + padding + border + margin.

### box-sizing: border-box

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

Without it: width: 300px means content is 300px, then padding and border ADD MORE.
With it: width: 300px means the entire box is 300px.

Tailwind applies border-box automatically. Always add this to vanilla CSS.

### Margin and Padding

\`\`\`css
margin: 16px;                    /* all sides */
margin: 16px 24px;               /* top/bottom, left/right */
margin: 8px 16px 12px 16px;      /* top right bottom left */
margin-top: 8px;
padding: 24px;
\`\`\`

### Margin Collapse

\`\`\`css
.first  { margin-bottom: 24px; }
.second { margin-top: 16px; }
/* gap = 24px, NOT 40px */
\`\`\`

Vertical margins between block elements collapse to the larger value. Flex/grid children do NOT collapse.

### Width and Height

\`\`\`css
width: 300px;       /* fixed */
width: 50%;         /* relative to parent */
width: 100vw;       /* viewport width */
min-width: 200px;
max-width: 1200px;
\`\`\`

### Overflow

\`\`\`css
overflow: hidden;   /* clips content */
overflow: auto;     /* scrollbar only when needed */
overflow-x: auto;   /* horizontal scroll only */
\`\`\``,
    quiz: [
      { q: 'What does box-sizing: border-box do?', options: ['Removes the border', 'Makes width/height include padding and border, not just content', 'Required for flexbox', 'Removes margin collapse'], correct: 1, explanation: 'With border-box, width: 300px means the whole box is 300px total — padding and border are included.' },
      { q: 'Difference between margin and padding?', options: ['They are identical', 'padding = space inside border; margin = space outside pushing other elements away', 'margin is for block elements only', 'padding cannot be set on inline elements'], correct: 1, explanation: 'padding creates space inside between content and border. margin creates space outside between this element and others.' },
      { q: 'Two block elements: margin-bottom 24px and margin-top 16px. What is the gap?', options: ['40px (sum)', '24px (larger)', '16px (smaller)', '0px'], correct: 1, explanation: 'Vertical margins between adjacent block elements collapse — the gap is the larger value, not the sum.' },
      { q: 'Which display value removes an element from layout entirely?', options: ['display: hidden', 'display: invisible', 'display: none', 'display: collapse'], correct: 2, explanation: 'display: none removes the element from layout entirely — no space, not visible.' },
    ],
  },
  {
    id: 'cc-html-m04', track: 'crash', title: 'Flexbox Layout',
    subtitle: 'Build one-dimensional layouts — rows and columns — with complete control.',
    moduleObjective: 'Build row and column layouts with Flexbox using justify-content, align-items, flex-wrap, and gap.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Basic',
    xp: 150, duration: 12, module: 4, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'flex container', definition: 'Parent element with display: flex. Controls layout of all direct children.' },
      { term: 'justify-content', definition: 'Aligns items along the MAIN axis: flex-start, flex-end, center, space-between, space-around, space-evenly.' },
      { term: 'align-items', definition: 'Aligns items along the CROSS axis: stretch (default), flex-start, flex-end, center.' },
      { term: 'flex-wrap', definition: 'nowrap (default — one line), wrap (items wrap to new lines).' },
      { term: 'gap', definition: 'Spacing between flex items. gap: 16px sets both row and column gap.' },
    ],
    content: `## Flexbox Layout

Flexbox is the most important CSS layout tool for component-level layout — navbars, card rows, centering.

### Container Properties

\`\`\`css
.container {
  display: flex;
  flex-direction: row;              /* row (default) | column */
  justify-content: space-between;   /* main axis */
  align-items: center;              /* cross axis */
  flex-wrap: wrap;
  gap: 16px;
}
\`\`\`

### Perfect Centering

\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

Three lines. Centers anything horizontally and vertically. No more hacks.

### Responsive Cards

\`\`\`css
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card { flex: 1 1 280px; }
\`\`\`

Cards wrap to new lines when they cannot fit. Responsive with zero media queries.

### flex shorthand

\`\`\`css
flex: 1;          /* grows and shrinks to fill available space */
flex: 0 0 200px;  /* fixed 200px — no grow, no shrink */
\`\`\`

### Sidebar Layout

\`\`\`css
.layout  { display: flex; gap: 32px; }
.sidebar { flex: 0 0 260px; }
.main    { flex: 1; }
\`\`\`

### Navbar Pattern

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}
\`\`\``,
    quiz: [
      { q: 'What does justify-content control in Flexbox?', options: ['Cross axis alignment (vertical)', 'Main axis alignment (horizontal by default)', 'Item width', 'Number of columns'], correct: 1, explanation: 'justify-content aligns items along the main axis. In a row layout that is horizontal.' },
      { q: 'What does align-items: center do?', options: ['Centers text horizontally', 'Centers items on the cross axis (vertical in row layout)', 'Centers the container on the page', 'Makes all items the same width'], correct: 1, explanation: 'align-items controls the cross axis. In a row layout, cross axis is vertical — so center vertically centers items.' },
      { q: 'What does flex: 1 mean?', options: ['The item is 1px wide', 'The item grows and shrinks to fill available space', 'The item is the first child', 'Fixed width 100px'], correct: 1, explanation: 'flex: 1 = flex-grow: 1, flex-shrink: 1, flex-basis: 0. Multiple flex: 1 siblings share space equally.' },
      { q: 'What does flex-wrap: wrap enable?', options: ['Reverses order', 'Allows items to wrap onto new lines when they do not fit', 'Wraps text inside items', 'Required for gap to work'], correct: 1, explanation: 'By default items stay on one line. flex-wrap: wrap allows items to move to new rows.' },
    ],
  },
  {
    id: 'cc-html-m05', track: 'crash', title: 'CSS Grid Layout',
    subtitle: 'Build two-dimensional page layouts with rows and columns together.',
    moduleObjective: 'Build two-dimensional layouts using CSS Grid with explicit and implicit tracks.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Masters',
    xp: 175, duration: 12, module: 5, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'grid-template-columns', definition: 'Defines column sizes: repeat(3, 1fr), 200px 1fr. The most-used Grid property.' },
      { term: 'fr unit', definition: 'Fractional unit — takes a fraction of available space after fixed tracks are placed.' },
      { term: 'repeat()', definition: 'Shorthand: repeat(3, 1fr) = 1fr 1fr 1fr. repeat(auto-fill, minmax(280px, 1fr)) for responsive columns.' },
      { term: 'grid-column / grid-row', definition: 'grid-column: 1 / 3 spans columns 1-3. grid-column: span 2 spans 2 columns.' },
      { term: 'grid-template-areas', definition: "Named regions: 'header header' / 'sidebar main'. Items placed with grid-area: header." },
    ],
    content: `## CSS Grid Layout

Grid is for two-dimensional layouts — control over rows AND columns simultaneously.

### Basic Grid

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
\`\`\`

### Responsive Grid — Zero Media Queries

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

On large screens: 4+ columns. On mobile: 1 column. Zero media queries.

### Placing Items

\`\`\`css
.featured { grid-column: 1 / 3; }    /* spans columns 1-3 */
.wide     { grid-column: span 2; }    /* span 2 from current */
.full     { grid-column: 1 / -1; }    /* span ALL columns */
.tall     { grid-row: span 2; }
\`\`\`

### Named Grid Areas (Readable Layout)

\`\`\`css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header;  }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main;    }
.footer  { grid-area: footer;  }
\`\`\`

The CSS reads like a visual diagram of the layout.

### Grid vs Flexbox

Use Flexbox for one-dimensional flow (navbar, cards). Use Grid for two-dimensional structure (page layout, dashboard).`,
    quiz: [
      { q: 'What does repeat(auto-fill, minmax(280px, 1fr)) create?', options: ['Fixed 280px columns', 'Responsive columns fitting as many 280px-min columns as possible', '3 equal columns', 'One column per item'], correct: 1, explanation: 'auto-fill creates as many columns as fit. minmax means each is at least 280px, growing to fill. Responsive with zero media queries.' },
      { q: 'What does grid-column: 1 / -1 do?', options: ['Places item in column 1', 'Spans across all columns', 'Creates a new column', 'Makes item invisible'], correct: 1, explanation: '-1 refers to the last grid line. 1 / -1 spans all columns regardless of how many there are.' },
      { q: 'When should you use Grid over Flexbox?', options: ['Always — Grid is newer', 'For two-dimensional layouts needing row and column control', 'For centering single items', 'Only for image galleries'], correct: 1, explanation: 'Grid handles two-dimensional layouts. Flexbox handles one-dimensional flow. Use Grid for page structure.' },
      { q: 'What does the fr unit represent?', options: ['Fixed pixels', 'Font-relative units', 'A fraction of available space after fixed tracks are placed', 'Frame rate'], correct: 2, explanation: '1fr = one fraction of space left after fixed columns are laid out.' },
    ],
  },
  {
    id: 'cc-html-m06', track: 'crash', title: 'Responsive Design & Media Queries',
    subtitle: 'Build layouts that adapt from mobile to desktop using breakpoints.',
    moduleObjective: 'Build responsive layouts using media queries, relative units, and mobile-first design.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Masters',
    xp: 175, duration: 11, module: 6, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'Media Query', definition: '@media (min-width: 768px) { } — applies styles only when the condition is true.' },
      { term: 'Mobile-First', definition: 'Write base styles for mobile, add min-width media queries for larger screens. The standard approach.' },
      { term: 'Relative Units', definition: 'rem (root font size = 16px), em (parent font size), %, vh (viewport height), vw (viewport width).' },
      { term: 'viewport meta tag', definition: '<meta name="viewport" content="width=device-width, initial-scale=1"> — required for mobile.' },
      { term: 'Breakpoints', definition: 'Tailwind: sm=640, md=768, lg=1024, xl=1280, 2xl=1536.' },
    ],
    content: `## Responsive Design & Media Queries

Your users access the web on phones, tablets, laptops, and large displays. Responsive design means one HTML, all screen sizes.

### The Viewport Meta Tag

Required in every HTML page:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

Without it, mobile browsers display at ~980px wide and zoom out.

### Mobile-First Breakpoints

\`\`\`css
/* Mobile base */
.card-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* Tablet */
@media (min-width: 768px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
\`\`\`

### Relative Units

\`\`\`css
font-size: 1rem;     /* 16px — respects user font-size preference */
font-size: 1.25rem;  /* 20px */
height: 100vh;       /* full viewport height */
width: 50%;          /* half of parent */

/* Fluid font — scales with viewport, clamped to min/max */
font-size: clamp(1rem, 2.5vw, 1.5rem);
\`\`\`

### Responsive Images

\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`

Always include in your CSS reset. Prevents images from overflowing their container.`,
    quiz: [
      { q: 'What is the mobile-first approach?', options: ['Design for desktop then scale down', 'Write base styles for mobile, add min-width media queries for larger screens', 'Only support mobile devices', 'Use px for all sizes'], correct: 1, explanation: 'Mobile-first: base styles target small screens, min-width media queries add complexity for larger screens.' },
      { q: 'What does 1rem equal?', options: ['1px', '1% of viewport', 'Root font size (default 16px)', 'Parent element font size'], correct: 2, explanation: '1rem = the font size set on the html element. Default is 16px. Respects user browser settings.' },
      { q: 'What does the viewport meta tag do?', options: ['Sets the browser window size', 'Tells mobile browsers to use device width instead of zooming out', 'Required for media queries', 'Sets base font size'], correct: 1, explanation: 'Without it, mobile browsers render at ~980px and scale it down — your layout looks like a shrunken desktop site.' },
      { q: 'What does clamp(1rem, 2.5vw, 1.5rem) do?', options: ['Picks a value randomly', 'Value scales with viewport, clamped between 1rem min and 1.5rem max', 'Clips text', 'Sets three breakpoints'], correct: 1, explanation: 'clamp(min, preferred, max) creates fluid scaling. 2.5vw grows with viewport but never below 1rem or above 1.5rem.' },
    ],
  },
  {
    id: 'cc-html-m07', track: 'crash', title: 'CSS Custom Properties & Design Tokens',
    subtitle: 'Use CSS variables to build maintainable, themeable design systems.',
    moduleObjective: 'Use CSS custom properties to create design tokens for colors, spacing, and typography.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'Masters',
    xp: 175, duration: 10, module: 7, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'CSS Custom Property', definition: '--name: value; defined on any element. Accessed with var(--name). Scoped to element and children.' },
      { term: ':root', definition: 'Pseudo-class targeting the html element. Define global tokens here — accessible everywhere in the document.' },
      { term: 'Design Token', definition: 'Named value representing a design decision: --color-primary, --spacing-md. One change cascades everywhere.' },
      { term: 'var() fallback', definition: 'var(--color, #fff) — second argument is the fallback if the property is undefined.' },
      { term: 'Dark mode', definition: 'Define light palette on :root, override values under prefers-color-scheme: dark or [data-theme="dark"].' },
    ],
    content: `## CSS Custom Properties & Design Tokens

Define once, use everywhere. Change --color-primary in one place and every button, card, and link updates.

### Defining Tokens

\`\`\`css
:root {
  --color-primary: #f59e0b;
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --radius: 8px;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius);
}
\`\`\`

### Dark Mode

\`\`\`css
:root { --color-bg: #ffffff; --color-text: #111827; }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #0f0f0e; --color-text: #f9f9f7;
  }
}

:root[data-theme="dark"] { --color-bg: #0f0f0e; --color-text: #f9f9f7; }

body { background: var(--color-bg); color: var(--color-text); }
\`\`\`

All components automatically switch — no per-component changes needed.

### var() Fallbacks

\`\`\`css
color: var(--color-accent, #f59e0b);   /* fallback if var undefined */
padding: var(--spacing-md, 16px);
\`\`\`

### Scoped Component Variables

\`\`\`css
.card {
  --card-padding: 24px;
  padding: var(--card-padding);
}

.card.compact { --card-padding: 12px; }  /* only affects .card.compact subtree */
\`\`\``,
    quiz: [
      { q: 'Why define design tokens on :root?', options: ['Required for CSS variables', ':root is the html element — properties accessible throughout the document', ':root prevents specificity issues', 'Performance optimization'], correct: 1, explanation: ':root targets html. Custom properties cascade to all descendants — globally accessible.' },
      { q: 'What does var(--color-primary, #000) do?', options: ['Sets two values', 'Uses --color-primary, or #000 if the variable is undefined', 'Creates a fallback file', 'Multiplies values'], correct: 1, explanation: 'Second argument to var() is the fallback when the property is not defined.' },
      { q: 'Design tokens: what is the difference between primitives and semantic tokens?', options: ['One for JS, one for CSS', 'Primitives are raw values; semantic tokens reference primitives and give meaning (color-brand vs amber-500)', 'Primitives are responsive; semantic are fixed', 'No difference'], correct: 1, explanation: 'Primitives (--amber-500) define raw values. Semantic tokens (--color-brand) reference primitives and express design intent.' },
      { q: 'How do you implement dark mode with CSS variables?', options: ['Use a different CSS file', 'Define light values on :root, override with dark values under prefers-color-scheme or [data-theme]', 'JavaScript toggles colors on each element', 'Only possible with a framework'], correct: 1, explanation: 'Override only the variable values in a media query or attribute selector — all components using those vars update automatically.' },
    ],
  },
  {
    id: 'cc-html-m08', track: 'crash', title: 'Typography, Transitions & Production CSS',
    subtitle: 'Apply web fonts, transitions, and professional CSS patterns used in production.',
    moduleObjective: 'Apply web fonts, transitions, transforms, and position to build polished production-ready UI.',
    courseObjective: CC_HTML_OBJ, crashId: 'cc-html', crashTitle: 'HTML & CSS', level: 'PhD',
    xp: 200, duration: 12, module: 8, certArea: 'HTML & CSS Crash Course',
    keyTerms: [
      { term: 'Web Fonts', definition: 'Google Fonts @import or @font-face. Always include a fallback stack.' },
      { term: 'transition', definition: 'Animate CSS changes: transition: color 200ms ease. Place on BASE state, not hover — so animation goes both directions.' },
      { term: 'transform', definition: 'GPU-composited transformations: translate(), scale(), rotate(). Does not affect layout.' },
      { term: 'position', definition: 'static (default), relative (offset), absolute (positioned ancestor), fixed (viewport), sticky (scrolls until threshold).' },
      { term: 'z-index', definition: 'Stacking order for non-static positioned elements. Higher value = on top.' },
    ],
    content: `## Typography, Transitions & Production CSS

Production CSS patterns that separate polished interfaces from rough ones.

### Web Fonts

\`\`\`css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
\`\`\`

### Transitions — Apply to Base State

\`\`\`css
/* BASE STATE — transition goes in both directions */
.button {
  background: var(--color-primary);
  transition: background 200ms ease, transform 150ms ease;
}

.button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
\`\`\`

If you put transition only on :hover, the return animation is instant.

### Transform (GPU Layer)

\`\`\`css
transform: translateX(100px);
transform: translate(-50%, -50%);  /* center absolute element */
transform: scale(1.05);
transform: rotate(45deg);
\`\`\`

Transforms are GPU-composited — fastest properties to animate. They do not affect layout.

### Position

\`\`\`css
/* Fixed header */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }

/* Tooltip below parent */
.parent { position: relative; }
.tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

/* Sticky sidebar */
.sidebar { position: sticky; top: 80px; }
\`\`\`

### Centering Absolute Elements

\`\`\`css
.parent { position: relative; }
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`

Most reliable way to center when you don't know the element's dimensions.

### CSS Reset Foundation

\`\`\`css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
img { max-width: 100%; height: auto; }
:root { font-size: 16px; }
\`\`\``,
    quiz: [
      { q: 'Where should transition be placed — base state or hover state?', options: ['Hover state', 'Base state', 'Both', 'Either works'], correct: 1, explanation: 'Transition on the base state animates in BOTH directions — to hover and back. On hover-only, the return is instant.' },
      { q: 'What makes transform properties fast to animate?', options: ['Less CSS code', 'GPU-composited — no layout recalculation needed', 'Browsers skip transitions for transforms', 'They only work on block elements'], correct: 1, explanation: 'transform and opacity are GPU-composited. No layout recalculation needed — use them for animations.' },
      { q: 'position: absolute is relative to what?', options: ['The document root', 'The viewport', 'The nearest ancestor with non-static position', 'The parent element always'], correct: 2, explanation: 'Absolutely positioned elements are relative to the nearest positioned ancestor (relative/absolute/fixed/sticky).' },
      { q: 'What is position: sticky?', options: ['Always fixed at the top', 'Normal flow until a threshold, then sticks like fixed while scrolling', 'Sticks to parent permanently', 'Deprecated'], correct: 1, explanation: 'sticky behaves like relative until it hits a threshold (e.g. top: 80px), then sticks like fixed.' },
    ],
  },
]
