import type { Course } from '../courses'

const CC_PAYLOAD_OBJ = 'Build content-managed full-stack applications with Payload CMS — collections, access control, hooks, rich text, and API integration in Next.js.'

export const crashPayloadCourses: Course[] = [
  {
    id: 'cc-payload-m01', track: 'crash', title: 'Environment, Setup & Your First Payload Collection',
    subtitle: 'Install Payload CMS, explore the file structure, and define a real content type from scratch.',
    moduleObjective: 'Set up Payload CMS in a new Next.js project, understand the headless CMS architecture, and create your first collection with fields.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Basic',
    xp: 150, duration: 12, module: 1, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Headless CMS', definition: 'A CMS that manages content (the "body") but has no frontend (the "head"). Your Next.js app is the head — it fetches content and displays it however it wants.' },
      { term: 'Payload CMS', definition: 'TypeScript-native, self-hosted headless CMS built for Next.js. Runs inside your project, auto-generates admin UI, REST API, GraphQL, and TypeScript types.' },
      { term: 'payload.config.ts', definition: 'The single config file for the entire CMS. Defines database adapter, collections, globals, editor, auth, CORS, and plugins.' },
      { term: 'Collection', definition: 'A content type — like a database table. Defines typed fields, access control, and hooks for one kind of content (Posts, Users, Media).' },
      { term: 'Admin Panel', definition: 'Payload auto-generates a full CRUD admin interface at /admin from your collection config. Editors use it to manage content — no extra code needed.' },
      { term: 'Local API', definition: 'Payload\'s server-side JS API — payload.find(), payload.create(), etc. Direct database access from server components with no HTTP overhead.' },
    ],
    content: `## Environment, Setup & Your First Payload Collection

### Step 1 — Set Up Your Environment

**What VS Code extensions do you need?**

For Payload development, you're writing TypeScript in a Next.js project. Install these:

1. **ESLint** — catches errors as you type
2. **Prettier** — auto-formats code on save
3. **TypeScript Error Lens** — inline TypeScript errors in the editor
4. **Tailwind CSS IntelliSense** — if you're styling the frontend with Tailwind

No Payload-specific extension exists — Payload is just TypeScript classes and config objects. VS Code's built-in TypeScript support handles IntelliSense on all Payload types.

**Create a Payload project**

The fastest path is the official CLI:
\`\`\`bash
npx create-payload-app@latest
\`\`\`

The CLI asks:
- **Project name** — becomes the folder name
- **Template** — choose "website" (Next.js + Postgres) or "blank"
- **Database** — choose Postgres (uses Supabase, Neon, Railway, or local)

The CLI installs dependencies and creates a fully working project with example collections. Start it:
\`\`\`bash
cd your-project
npm run dev
\`\`\`

Visit \`http://localhost:3000/admin\` — the first load creates the database tables and prompts you to create an admin user.

### WHY Payload? — The Headless CMS Problem

Before Payload, teams had two bad choices:

**Traditional CMS (WordPress)**
- Manages content AND renders the frontend (PHP templates)
- Hard to build modern React frontends on top of it
- Vendor-managed — can't customize the data structure freely

**Hosted Headless CMS (Contentful, Sanity)**
- API-only — you build the frontend
- But you pay per seat, per API call, per content type
- No code access — customizations happen in their UI

**Payload's answer:** run the CMS inside your Next.js project. You own the database, the config is TypeScript code in your repo, and the admin UI is auto-generated.

\`\`\`
WordPress:        CMS owns frontend + data
Contentful:       their servers → your frontend
Payload:          your code + your DB → admin UI auto-generated
\`\`\`

### File Structure After Installation

\`\`\`
src/
  app/
    (payload)/              ← Payload admin route group
      admin/
        [[...segments]]/
          page.tsx          ← Admin panel pages
      api/
        [...slug]/
          route.ts          ← Payload REST API routes
    (frontend)/             ← Your frontend routes
      page.tsx
      blog/
        [slug]/
          page.tsx
  collections/
    Posts.ts                ← Post content type
    Users.ts                ← User content type (with auth)
    Media.ts                ← File uploads
  globals/
    SiteSettings.ts         ← Singleton config (nav, footer)
payload.config.ts           ← Main CMS configuration
payload-types.ts            ← Auto-generated TypeScript types
\`\`\`

The key insight: your collections live as TypeScript files in your repo. They are source code — you version them with git, review them in PRs, deploy them with your app.

### payload.config.ts — The Central Hub

\`\`\`tsx
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Media } from './collections/Media'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,  // JWT signing key for admin sessions

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL! },
  }),

  editor: lexicalEditor({}),  // rich text editor (Facebook's Lexical)

  collections: [Posts, Users, Media],

  admin: {
    user: 'users',  // which collection handles admin authentication
  },

  cors: [process.env.NEXT_PUBLIC_APP_URL!],
  // Allow your frontend origin for REST API calls
})
\`\`\`

Everything flows from this file. Add a collection here → it appears in the admin panel, REST API, and TypeScript types automatically.

### Your First Real Collection — Posts

Let's build a blog posts collection step-by-step:

\`\`\`tsx
// src/collections/Posts.ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',                  // → /api/posts in REST, payload.find('posts') in Local API

  admin: {
    useAsTitle: 'title',          // shows "My First Post" as the admin list title
    defaultColumns: ['title', 'status', 'publishedAt'],
  },

  fields: [
    // Text field — required, shows at top of form
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    // URL-safe identifier, auto-generated from title via a hook (later)
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,              // adds a DB index for fast slug lookups
      admin: { position: 'sidebar' },
    },

    // Content state — editors can save drafts without publishing
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },

    // Relationship — references a document in the 'users' collection
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar' },
    },

    // Rich text (Lexical editor — outputs structured JSON)
    {
      name: 'content',
      type: 'richText',
    },

    // Metadata
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
\`\`\`

After saving this file and restarting the dev server, visit \`/admin\` — the "Posts" menu appears. Click "Create New Post" and you'll see this form rendered automatically.

What Payload just generated from this one file:
- Admin form with all fields
- REST endpoint: GET/POST \`/api/posts\`, GET/PATCH/DELETE \`/api/posts/:id\`
- GraphQL queries and mutations
- TypeScript type: \`import type { Post } from '@/payload-types'\`

### Access the Auto-Generated REST API

\`\`\`bash
# List all published posts
GET http://localhost:3000/api/posts?where[status][equals]=published

# Get one post
GET http://localhost:3000/api/posts/64abc123

# Create (requires auth)
POST http://localhost:3000/api/posts
Authorization: Bearer <your-admin-jwt>
Content-Type: application/json
{
  "title": "My First Post",
  "slug": "my-first-post",
  "status": "draft"
}
\`\`\``,
    quiz: [
      { q: 'What makes Payload different from Contentful or Sanity?', options: ['It has more features', 'It runs inside your own codebase — your database, your code, no per-seat pricing or vendor lock-in', 'It is cheaper always', 'It requires no database'], correct: 1, explanation: 'Contentful/Sanity are hosted services — you depend on their servers and pricing. Payload deploys with your Next.js app against your own Postgres database. You own everything.' },
      { q: 'What does Payload auto-generate from your collection config?', options: ['Only the database schema', 'Admin UI, REST API, GraphQL API, and TypeScript types — from one TypeScript config object', 'Only an API', 'Only types'], correct: 1, explanation: 'Define the fields once in your CollectionConfig object. Payload generates: admin form, REST endpoints, GraphQL schema, and TypeScript interfaces. No boilerplate.' },
      { q: 'What is the Local API?', options: ['An API only accessible on localhost', 'payload.find/create/update — direct server-side calls to the database with no HTTP round-trip', 'The REST API served locally', 'GraphQL only'], correct: 1, explanation: 'The Local API calls Payload\'s query layer directly from server components — same process, no network. Faster than REST and fully typed with your generated types.' },
      { q: 'What does the "slug" field in a CollectionConfig do?', options: ['URL slug for blog posts', 'Identifies the collection: used in REST path (/api/posts), Local API collection name, and relationship references', 'Required by Postgres', 'Sets the admin menu label'], correct: 1, explanation: 'The collection slug is its identifier. It sets the REST API path (/api/[slug]), the Local API collection string (payload.find({ collection: "posts" })), and how other collections reference it.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Simulate the Payload collection config pattern in plain JavaScript. Write a function defineCollection(config) that takes a collection config object and returns an enhanced version with: (1) an apiPath property ("/api/" + slug), (2) a getFields() method that returns the field names as a string array, (3) a getRequiredFields() method that returns only fields with required: true, and (4) a describe() method that returns a summary string. Test it with a Posts and Users collection config.',
      starterCode: `// Payload Collection Config Simulator

// Define a collection and return an enhanced config
function defineCollection(config) {
  // TODO: return an object that spreads config and adds:
  // - apiPath: "/api/" + config.slug
  // - getFields(): returns array of field name strings
  // - getRequiredFields(): returns names of fields where required === true
  // - describe(): returns "Collection: <slug> | Fields: <count> | Required: <count>"
}

// Test collections
const Posts = defineCollection({
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'status', type: 'select', required: true },
    { name: 'author', type: 'relationship' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
  ],
})

const Users = defineCollection({
  slug: 'users',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select' },
    { name: 'avatar', type: 'upload' },
  ],
})

// Test output
console.log('Posts API path:', Posts.apiPath)
console.log('Posts fields:', Posts.getFields())
console.log('Posts required:', Posts.getRequiredFields())
console.log('Posts description:', Posts.describe())
console.log('')
console.log('Users API path:', Users.apiPath)
console.log('Users fields:', Users.getFields())
console.log('Users required:', Users.getRequiredFields())
console.log('Users description:', Users.describe())
`,
      solution: `function defineCollection(config) {
  return {
    ...config,
    apiPath: '/api/' + config.slug,
    getFields() {
      return config.fields.map(f => f.name)
    },
    getRequiredFields() {
      return config.fields.filter(f => f.required === true).map(f => f.name)
    },
    describe() {
      const total = config.fields.length
      const required = config.fields.filter(f => f.required).length
      return 'Collection: ' + config.slug + ' | Fields: ' + total + ' | Required: ' + required
    },
  }
}

const Posts = defineCollection({
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'status', type: 'select', required: true },
    { name: 'author', type: 'relationship' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
  ],
})

const Users = defineCollection({
  slug: 'users',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select' },
    { name: 'avatar', type: 'upload' },
  ],
})

console.log('Posts API path:', Posts.apiPath)
console.log('Posts fields:', Posts.getFields())
console.log('Posts required:', Posts.getRequiredFields())
console.log('Posts description:', Posts.describe())
console.log('')
console.log('Users API path:', Users.apiPath)
console.log('Users fields:', Users.getFields())
console.log('Users required:', Users.getRequiredFields())
console.log('Users description:', Users.describe())
`,
      hints: [
        'Spread the config with ...config to copy all original properties',
        'getFields: config.fields.map(f => f.name) — map over fields array, return name property',
        'getRequiredFields: chain .filter(f => f.required === true) then .map(f => f.name)',
        'describe: use string concatenation, not template literals, to avoid nesting issues',
        'apiPath: "/api/" + config.slug — concatenate the slug onto the base path'
      ]
    }
  },
  {
    id: 'cc-payload-m02', track: 'crash', title: 'Collections & Fields',
    subtitle: 'Define content types with Payload collections and field types.',
    moduleObjective: 'Create collections with text, richText, relationship, and array fields.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Basic',
    xp: 150, duration: 11, module: 2, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Collection', definition: 'A content type — like a database table. Defines fields, access control, and hooks for a type of content.' },
      { term: 'Field', definition: 'A typed property of a collection. Payload has 20+ field types: text, number, richText, relationship, array, blocks, media.' },
      { term: 'slug', definition: 'Collection identifier — used in the API path: /api/posts, /api/users. Must be lowercase plural.' },
      { term: 'Relationship field', definition: 'References another collection document. Stores the related document\'s ID and optionally populates it.' },
      { term: 'Array field', definition: 'An ordered list of sub-fields. Editors can add, remove, and reorder items. Used for flexible content blocks.' },
    ],
    content: `## Collections & Fields

Collections define your content types. Fields define the shape of each document within the collection.

### Basic Collection

\`\`\`tsx
// collections/Posts.ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published', 'archived'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text', required: true },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
\`\`\`

### Field Types Reference

\`\`\`tsx
// Common field types
{ name: 'title', type: 'text' }
{ name: 'body', type: 'richText' }
{ name: 'xp', type: 'number', min: 0, max: 1000 }
{ name: 'active', type: 'checkbox', defaultValue: true }
{ name: 'level', type: 'select', options: ['Basic', 'Masters', 'PhD'] }
{ name: 'author', type: 'relationship', relationTo: 'users' }
{ name: 'cover', type: 'upload', relationTo: 'media' }
{ name: 'publishedAt', type: 'date' }
{ name: 'metadata', type: 'json' }
{ name: 'email', type: 'email' }
{ name: 'url', type: 'text', validate: (val) => isURL(val) || 'Must be a valid URL' }
\`\`\``,
    quiz: [
      { q: 'What is a collection slug used for?', options: ['URL path segment', 'Identifies the collection — used in API path (/api/posts), Local API calls, and relationship fields', 'Required for all fields', 'CSS identifier'], correct: 1, explanation: 'The slug is the collection\'s unique identifier. It determines the API endpoint path, Local API collection name, and how relationship fields reference it.' },
      { q: 'What does type: "relationship" do?', options: ['Creates a foreign key', 'References documents in another collection — stores the related ID and can populate the full document', 'Same as array', 'Creates a join table'], correct: 1, explanation: 'Relationship fields store the related document\'s ID. The admin panel shows a search input to select documents. Use depth parameter to populate nested relations.' },
      { q: 'What is an array field?', options: ['A list column', 'An ordered group of sub-fields that editors can add, remove, and reorder — used for flexible repeating content', 'Same as select', 'A database array'], correct: 1, explanation: 'Array fields let editors create multiple instances of a group of fields. Common for image galleries, feature lists, FAQ items.' },
      { q: 'What does admin.position: "sidebar" do?', options: ['Moves to a side panel in the admin UI — good for metadata like status, author, publishedAt', 'Changes the API', 'Hides the field', 'Makes it required'], correct: 0, explanation: 'Admin position controls where the field appears in the Payload admin editor. "sidebar" puts it in the right panel — standard for metadata.' },
    ],
  },
  {
    id: 'cc-payload-m03', track: 'crash', title: 'Access Control',
    subtitle: 'Secure Payload collections with function-based access control.',
    moduleObjective: 'Write access control functions for create, read, update, and delete operations.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Basic',
    xp: 150, duration: 10, module: 3, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Access control', definition: 'Functions that return true (allow) or false (deny) based on the user and document. Defined per operation.' },
      { term: 'isAdmin', definition: 'Pattern checking req.user.role === "admin". Common gate for create/delete operations.' },
      { term: 'isAdminOrSelf', definition: 'Allow if user is admin OR if the document belongs to them. Common for user profile updates.' },
      { term: 'where constraint', definition: 'Access control can return a Payload where query to filter which documents are accessible — not just allow/deny.' },
      { term: 'Field-level access', definition: 'Access control on individual fields — hide the email field from public reads while allowing title.' },
    ],
    content: `## Access Control

Payload access control uses functions that receive the user and document, return a boolean or a where constraint.

### Collection-level Access

\`\`\`tsx
// collections/Posts.ts
import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

const isAdminOrPublished: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true
  // Non-admins can only read published posts
  return { status: { equals: 'published' } }
}

const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'admin') return true
  return user?.id === id  // can only update/delete own document
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: isAdmin,           // only admins create posts
    read: isAdminOrPublished,  // public reads only published
    update: isAdminOrSelf,     // admins + own document
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      access: {
        read: isAdmin,  // field-level: only admins see email
      },
    },
    // ...
  ],
}
\`\`\`

### Where Constraints in Access Control

\`\`\`tsx
// Return a query filter instead of boolean
const canReadOwnOrPublic: Access = ({ req: { user } }) => {
  if (!user) {
    // Unauthenticated — only public posts
    return { status: { equals: 'published' } }
  }

  if (user.role === 'admin') return true

  // Authenticated users see own drafts + all published
  return {
    or: [
      { author: { equals: user.id } },
      { status: { equals: 'published' } },
    ],
  }
}
\`\`\`

### Users Collection with Roles

\`\`\`tsx
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,  // enables built-in auth
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor', 'user'],
      defaultValue: 'user',
      access: { update: isAdmin },  // only admins can change roles
    },
    { name: 'displayName', type: 'text' },
  ],
}
\`\`\``,
    quiz: [
      { q: 'What can an access control function return?', options: ['Only boolean', 'Boolean (allow/deny) OR a where query (filter which docs are accessible)', 'Error message', 'HTTP status code'], correct: 1, explanation: 'Returning true/false is allow/deny all. Returning a where query filters to a subset of documents — great for "own content" or "published only" patterns.' },
      { q: 'What does auth: true on a collection do?', options: ['Requires auth to read', 'Adds built-in authentication — login, logout, forgot password, refresh tokens, sessions', 'Makes fields required', 'Same as access control'], correct: 1, explanation: 'auth: true enables Payload\'s built-in auth system on that collection. Generates /api/users/login, /logout, /me, /refresh-token endpoints.' },
      { q: 'What is field-level access control?', options: ['Same as collection access', 'Controls read/write on individual fields — hide email from public while exposing name', 'Required for all fields', 'Adds validation'], correct: 1, explanation: 'Field access functions run per field. access: { read: isAdmin } on the email field hides it from non-admin responses while the rest of the document is readable.' },
      { q: 'How do you allow a user to only read their own documents?', options: ['Return user.id in access', 'Return { author: { equals: user.id } } — a where constraint filtering to owned docs', 'Use req.user.id === id', 'Not possible'], correct: 1, explanation: 'Returning a where constraint from access control filters the collection to matching documents. { author: { equals: user.id } } returns only the user\'s own posts.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Implement three access control functions that mirror Payload\'s real access control pattern. Each function receives { user, documentOwnerId } and returns true (allow), false (deny), or a filter object { owner: userId } (filter). Implement: (1) isAdmin — allow only if user.role === "admin". (2) isAdminOrSelf — allow admins or if user.id === documentOwnerId. (3) canReadOwnOrPublic — no user: return filter { status: "published" }; admin: return true; other: return filter combining own docs and published. Test each function with different user contexts.',
      starterCode: `// Access Control Function Simulator

// Returns true (allow), false (deny), or a filter object
function isAdmin({ user }) {
  // TODO: return true if user exists and role is 'admin', false otherwise
}

function isAdminOrSelf({ user, documentOwnerId }) {
  // TODO: admins always allowed
  // Non-admins only allowed if their id matches the document owner
  // Return false if not authenticated
}

function canReadOwnOrPublic({ user }) {
  // TODO: Three cases:
  // 1. No user (unauthenticated) → return { status: 'published' }
  // 2. Admin → return true
  // 3. Regular user → return { or: [{ owner: user.id }, { status: 'published' }] }
}

// Test contexts
const adminUser    = { id: 'u1', role: 'admin' }
const regularUser  = { id: 'u2', role: 'user' }
const anotherUser  = { id: 'u3', role: 'user' }
const noUser       = null

const docOwnerId = 'u2'  // regular user owns this document

console.log('=== isAdmin ===')
console.log('Admin:', isAdmin({ user: adminUser }))
console.log('User:', isAdmin({ user: regularUser }))
console.log('No user:', isAdmin({ user: noUser }))

console.log('\\n=== isAdminOrSelf ===')
console.log('Admin:', isAdminOrSelf({ user: adminUser, documentOwnerId }))
console.log('Owner:', isAdminOrSelf({ user: regularUser, documentOwnerId }))
console.log('Other:', isAdminOrSelf({ user: anotherUser, documentOwnerId }))
console.log('No user:', isAdminOrSelf({ user: noUser, documentOwnerId }))

console.log('\\n=== canReadOwnOrPublic ===')
console.log('Admin:', canReadOwnOrPublic({ user: adminUser }))
console.log('User:', canReadOwnOrPublic({ user: regularUser }))
console.log('No user:', canReadOwnOrPublic({ user: noUser }))
`,
      solution: `function isAdmin({ user }) {
  return user?.role === 'admin' ? true : false
}

function isAdminOrSelf({ user, documentOwnerId }) {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.id === documentOwnerId
}

function canReadOwnOrPublic({ user }) {
  if (!user) return { status: 'published' }
  if (user.role === 'admin') return true
  return { or: [{ owner: user.id }, { status: 'published' }] }
}

const adminUser   = { id: 'u1', role: 'admin' }
const regularUser = { id: 'u2', role: 'user' }
const anotherUser = { id: 'u3', role: 'user' }
const noUser      = null
const docOwnerId  = 'u2'

console.log('=== isAdmin ===')
console.log('Admin:', isAdmin({ user: adminUser }))
console.log('User:', isAdmin({ user: regularUser }))
console.log('No user:', isAdmin({ user: noUser }))

console.log('\\n=== isAdminOrSelf ===')
console.log('Admin:', isAdminOrSelf({ user: adminUser, documentOwnerId: docOwnerId }))
console.log('Owner:', isAdminOrSelf({ user: regularUser, documentOwnerId: docOwnerId }))
console.log('Other:', isAdminOrSelf({ user: anotherUser, documentOwnerId: docOwnerId }))
console.log('No user:', isAdminOrSelf({ user: noUser, documentOwnerId: docOwnerId }))

console.log('\\n=== canReadOwnOrPublic ===')
console.log('Admin:', canReadOwnOrPublic({ user: adminUser }))
console.log('User:', canReadOwnOrPublic({ user: regularUser }))
console.log('No user:', canReadOwnOrPublic({ user: noUser }))
`,
      hints: [
        'Optional chaining: user?.role handles null users — returns undefined instead of throwing',
        'isAdmin: check user?.role === "admin" — no user means false',
        'isAdminOrSelf: guard with !user first, then check admin role, then compare ids',
        'canReadOwnOrPublic: handle null user first (filter), then admin (true), then regular user (compound filter)'
      ]
    }
  },
  {
    id: 'cc-payload-m04', track: 'crash', title: 'Hooks',
    subtitle: 'Automate logic with Payload lifecycle hooks — before/after operations.',
    moduleObjective: 'Use beforeChange, afterChange, and beforeRead hooks to automate data transformations.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Masters',
    xp: 175, duration: 10, module: 4, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'beforeChange', definition: 'Hook that fires before a document is created or updated. Can modify the data before it\'s saved.' },
      { term: 'afterChange', definition: 'Hook that fires after a document is created or updated. Used for side effects like sending emails or clearing cache.' },
      { term: 'beforeRead', definition: 'Hook that fires before a document is returned. Can transform or add data to the response.' },
      { term: 'Hook context', definition: 'Hooks receive { req, data, doc, operation, originalDoc } — full context for decision-making.' },
      { term: 'Field hooks', definition: 'Hooks on individual fields: beforeChange, afterRead. Transform field values on read or write.' },
    ],
    content: `## Hooks

Hooks are Payload's automation layer — they run before or after database operations and can modify data, trigger side effects, or cancel operations.

### Auto-generate Slug

\`\`\`tsx
// collections/Posts.ts
import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && data.title) {
          data.slug = slugify(data.title, { lower: true, strict: true })
        }
        return data
      },
    ],
  },
  // ...
}
\`\`\`

### After Create: Send Welcome Email

\`\`\`tsx
hooks: {
  afterChange: [
    async ({ doc, operation, req }) => {
      if (operation === 'create') {
        await sendWelcomeEmail(doc.email, doc.displayName)
      }
      return doc
    },
  ],
},
\`\`\`

### beforeRead: Transform Data

\`\`\`tsx
hooks: {
  beforeRead: [
    ({ doc }) => {
      return {
        ...doc,
        // Add computed field
        fullName: \`\${doc.firstName} \${doc.lastName}\`,
        // Mask sensitive data
        email: doc.email?.replace(/(.)(.*)(@.*)/, (_, f, m, e) => f + '*'.repeat(m.length) + e),
      }
    },
  ],
},
\`\`\`

### Field Hook

\`\`\`tsx
{
  name: 'password',
  type: 'text',
  hooks: {
    beforeChange: [
      async ({ value }) => {
        if (!value) return value
        return hashPassword(value)  // hash before saving
      },
    ],
    afterRead: [
      () => undefined,  // never return the hash
    ],
  },
}
\`\`\``,
    quiz: [
      { q: 'When does beforeChange run?', options: ['Before the API request', 'Before a document is created or updated — can modify data before DB write', 'After the document is saved', 'Only for updates'], correct: 1, explanation: 'beforeChange fires before the DB write. Return modified data to change what gets saved. Throw an error to cancel the operation.' },
      { q: 'What is afterChange used for?', options: ['Modifying saved data', 'Side effects after a successful save — sending emails, clearing caches, triggering webhooks', 'Validation only', 'Reading data'], correct: 1, explanation: 'afterChange runs after the DB write succeeds. Use for side effects that depend on the data being saved: notifications, cache invalidation, search indexing.' },
      { q: 'How do you cancel an operation in a hook?', options: ['Return false', 'Throw an error — Payload catches it and returns a 400/500 response', 'Return undefined', 'Set data.cancel = true'], correct: 1, explanation: 'Throwing from a hook aborts the operation. The error message is returned to the client as a validation error.' },
      { q: 'What does a field afterRead hook returning undefined do?', options: ['Returns null', 'Removes the field from the response — useful for never exposing hashed passwords or secrets', 'Error', 'Returns the original value'], correct: 1, explanation: 'If afterRead returns undefined for a field, Payload omits that field from the response. Classic pattern for never returning hashed passwords.' },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a hook pipeline simulator. Implement a runHooks(document, hooks) function that takes a document object and an array of hook functions, runs them in sequence (each receives the result of the previous), and returns the final document. Then write three hooks: (1) addTimestamp — adds createdAt if operation is "create". (2) generateSlug — generates a slug from title using simple lowercase + hyphen replacement. (3) maskEmail — replaces the middle characters of an email with asterisks. Run the pipeline for a "create" operation and a "update" operation, logging the result after each hook.',
      starterCode: `// Hook Pipeline Simulator

// Run hooks in sequence — each receives the result of the previous
async function runHooks(document, hooks) {
  // TODO: iterate over hooks array
  // Pass document to first hook, pass result to next hook, etc.
  // Each hook is an async function that receives doc and returns modified doc
  // Return the final document
}

// Hook 1: Add timestamps on create
function addTimestamp(doc) {
  // TODO: if doc.operation === 'create', add createdAt: new Date().toISOString()
  // Always add updatedAt: new Date().toISOString()
  // Return modified doc
}

// Hook 2: Generate slug from title
function generateSlug(doc) {
  // TODO: if doc.data.title exists and operation is 'create'
  // set doc.data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  // Return doc
}

// Hook 3: Mask email in response
function maskEmail(doc) {
  // TODO: if doc.data.email exists
  // Keep first char + '***' + domain: "j***@gmail.com"
  // Split on '@', mask the local part, rejoin
  // Return doc
}

// Test: create operation
const createDoc = {
  operation: 'create',
  data: {
    title: 'My First Post About REST APIs',
    email: 'jordan@gmail.com',
    content: 'Some content here',
  }
}

// Test: update operation
const updateDoc = {
  operation: 'update',
  data: {
    title: 'Updated Post Title',
    email: 'jordan@gmail.com',
  }
}

runHooks(createDoc, [addTimestamp, generateSlug, maskEmail])
  .then(result => console.log('After create hooks:', result))

runHooks(updateDoc, [addTimestamp, generateSlug, maskEmail])
  .then(result => console.log('After update hooks:', result))
`,
      solution: `async function runHooks(document, hooks) {
  let current = document
  for (const hook of hooks) {
    current = await hook(current)
  }
  return current
}

function addTimestamp(doc) {
  const now = new Date().toISOString()
  if (doc.operation === 'create') {
    doc.data.createdAt = now
  }
  doc.data.updatedAt = now
  return doc
}

function generateSlug(doc) {
  if (doc.data.title && doc.operation === 'create') {
    doc.data.slug = doc.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return doc
}

function maskEmail(doc) {
  if (doc.data.email) {
    const parts = doc.data.email.split('@')
    const masked = parts[0][0] + '***'
    doc.data.email = masked + '@' + parts[1]
  }
  return doc
}

const createDoc = {
  operation: 'create',
  data: {
    title: 'My First Post About REST APIs',
    email: 'jordan@gmail.com',
    content: 'Some content here',
  }
}

const updateDoc = {
  operation: 'update',
  data: {
    title: 'Updated Post Title',
    email: 'jordan@gmail.com',
  }
}

runHooks(createDoc, [addTimestamp, generateSlug, maskEmail])
  .then(result => console.log('After create hooks:', result))

runHooks(updateDoc, [addTimestamp, generateSlug, maskEmail])
  .then(result => console.log('After update hooks:', result))
`,
      hints: [
        'runHooks: use a for...of loop with await on each hook call — accumulate result in a variable',
        'generateSlug: chain .toLowerCase(), .replace(/[^a-z0-9]+/g, "-") to replace non-alphanum with hyphens',
        'maskEmail: split on "@" to get local part and domain, mask local with first char + "***"',
        'Each hook mutates and returns the doc — return doc at the end of each function'
      ]
    }
  },
  {
    id: 'cc-payload-m05', track: 'crash', title: 'Rich Text with Lexical',
    subtitle: 'Build flexible content with Payload\'s Lexical rich text editor and custom blocks.',
    moduleObjective: 'Configure the Lexical editor with custom features and render rich text in Next.js.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Masters',
    xp: 175, duration: 11, module: 5, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Lexical', definition: 'Facebook\'s extensible rich text framework. Payload\'s built-in editor. Outputs structured JSON, not HTML.' },
      { term: 'Blocks field', definition: 'A polymorphic field where editors add different block types (Hero, Quote, Code, CTA). Each block has its own fields.' },
      { term: 'RichTextContent', definition: 'Payload\'s serializer/renderer for Lexical JSON → React components. Renders content in your frontend.' },
      { term: 'Inline blocks', definition: 'Blocks that appear inline in the rich text editor — embedded components within prose.' },
      { term: 'Features', definition: 'Lexical editor capabilities: BoldFeature, LinkFeature, InlineBlocksFeature. Configure what editors can do.' },
    ],
    content: `## Rich Text with Lexical

Payload's Lexical editor outputs structured JSON. You render it with the RichTextContent component or serialize it yourself.

### Configure Lexical

\`\`\`tsx
// payload.config.ts
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  BoldFeature, ItalicFeature, UnderlineFeature,
  HeadingFeature, BlockquoteFeature, CodeFeature,
  LinkFeature, UploadFeature, BlocksFeature,
} from '@payloadcms/richtext-lexical'

export default buildConfig({
  editor: lexicalEditor({
    features: [
      BoldFeature(), ItalicFeature(), UnderlineFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      BlockquoteFeature(), CodeFeature(),
      LinkFeature({ enabledCollections: ['posts', 'pages'] }),
      UploadFeature({ collections: { media: { fields: [] } } }),
    ],
  }),
})
\`\`\`

### Blocks Field

\`\`\`tsx
// Block definition
const CallToAction: Block = {
  slug: 'cta',
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'buttonText', type: 'text', required: true },
    { name: 'buttonUrl', type: 'text', required: true },
    { name: 'style', type: 'select', options: ['primary', 'secondary'] },
  ],
}

// Use in a collection
{
  name: 'layout',
  type: 'blocks',
  blocks: [CallToAction, HeroBlock, QuoteBlock],
}
\`\`\`

### Render Rich Text in Next.js

\`\`\`tsx
import { RichText } from '@payloadcms/richtext-lexical/react'

export function PostContent({ content }: { content: any }) {
  return (
    <div className="prose prose-lg max-w-none">
      <RichText data={content} />
    </div>
  )
}
\`\`\`

### Render Blocks

\`\`\`tsx
function LayoutRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'cta': return <CTABlock key={i} {...block} />
          case 'hero': return <HeroBlock key={i} {...block} />
          default: return null
        }
      })}
    </div>
  )
}
\`\`\``,
    quiz: [
      { q: 'What format does Lexical rich text output?', options: ['HTML string', 'Structured JSON — serialized node tree, not HTML', 'Markdown', 'XML'], correct: 1, explanation: 'Lexical outputs JSON (a node tree). Your frontend renders it with RichText component or custom serializers. This lets you style it your way.' },
      { q: 'What is a blocks field?', options: ['Array of text blocks', 'Polymorphic field where editors choose from block types — each block has its own fields', 'Same as array', 'Only for landing pages'], correct: 1, explanation: 'Blocks are like typed sections. Editors add a "CTA" block (heading, button text, URL) or a "Quote" block (quote, author). Flexible page building.' },
      { q: 'How do you render Payload rich text in React?', options: ['dangerouslySetInnerHTML', '<RichText data={content} /> from @payloadcms/richtext-lexical/react', 'JSON.stringify()', 'Custom parser required'], correct: 1, explanation: 'Payload ships a RichText component that traverses the Lexical JSON node tree and renders React components. Pass the data field from your content.' },
      { q: 'What do Lexical Features configure?', options: ['Database features', 'What formatting and insert capabilities editors have in the rich text editor — Bold, Link, Blocks, etc.', 'API features', 'Admin UI features'], correct: 1, explanation: 'Features are the Lexical editor\'s toolbar capabilities. Only configured features appear in the admin editor — BoldFeature adds bold, BlocksFeature adds block insertion.' },
    ],
  },
  {
    id: 'cc-payload-m06', track: 'crash', title: 'The Local API',
    subtitle: 'Query Payload data directly in Next.js server components using the Local API.',
    moduleObjective: 'Use payload.find(), payload.findByID(), and payload.create() in server components.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Masters',
    xp: 175, duration: 10, module: 6, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'payload.find()', definition: 'Queries a collection with filters, sorting, pagination. Returns { docs, totalDocs, page, totalPages }.' },
      { term: 'payload.findByID()', definition: 'Fetches one document by ID. Returns the document or throws if not found.' },
      { term: 'payload.create()', definition: 'Creates a document in a collection. Runs hooks and access control.' },
      { term: 'depth', definition: 'How many levels of relationships to populate. depth: 1 populates direct relationships; depth: 2 populates nested ones.' },
      { term: 'overrideAccess', definition: 'payload.find({ overrideAccess: true }) bypasses access control — for admin/server-side operations.' },
    ],
    content: `## The Local API

The Local API calls Payload directly from server components — no HTTP round-trip. The fastest way to query data in a Next.js + Payload app.

### Setup

\`\`\`tsx
// lib/payload.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getPayloadClient = async () => {
  return getPayload({ config: configPromise })
}
\`\`\`

### payload.find()

\`\`\`tsx
// Server component
export default async function BlogPage() {
  const payload = await getPayloadClient()

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',  // - prefix = descending
    limit: 10,
    depth: 1,  // populate author relationship
  })

  return (
    <main>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  )
}
\`\`\`

### payload.findByID()

\`\`\`tsx
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  return <PostDetail post={post} />
}
\`\`\`

### payload.create() (Server Action)

\`\`\`tsx
'use server'
import { getPayloadClient } from '@/lib/payload'

export async function createComment(postId: string, text: string, userId: string) {
  const payload = await getPayloadClient()

  return payload.create({
    collection: 'comments',
    data: {
      post: postId,
      author: userId,
      text,
    },
  })
}
\`\`\``,
    quiz: [
      { q: 'Why use the Local API over REST in server components?', options: ['More features', 'No HTTP overhead — direct function call to the database. Faster and type-safe', 'Required for Next.js', 'More secure'], correct: 1, explanation: 'Local API skips the HTTP layer — same process, no network. Faster, fully typed with your collection\'s generated types.' },
      { q: 'What does depth parameter do?', options: ['Query depth limit', 'Controls how many levels of relationships to populate — depth: 1 fetches related documents', 'Pagination depth', 'Required for joins'], correct: 1, explanation: 'depth: 0 returns only IDs for relationships. depth: 1 fetches related documents. depth: 2 fetches their relationships too. Higher depth = more queries.' },
      { q: 'What does overrideAccess: true do?', options: ['Makes the query faster', 'Bypasses access control — use for server-side admin operations where you want all docs', 'Required for server components', 'Disables auth'], correct: 1, explanation: 'overrideAccess bypasses access control functions. Use in server-side scripts, migrations, or admin operations where you intentionally need unrestricted access.' },
      { q: 'What does the sort: "-publishedAt" syntax do?', options: ['Finds by publishedAt', 'Sorts by publishedAt descending — minus prefix = descending, no prefix = ascending', 'Filters null dates', 'Required for dates'], correct: 1, explanation: 'Payload sort uses string with optional - prefix. "-publishedAt" = newest first. "title" = A-Z. Multiple sorts: ["-publishedAt", "title"].' },
    ],
  },
  {
    id: 'cc-payload-m07', track: 'crash', title: 'Media & Uploads',
    subtitle: 'Configure Payload media uploads with transformations and storage adapters.',
    moduleObjective: 'Set up a media collection with image resizing and cloud storage integration.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'PhD',
    xp: 200, duration: 10, module: 7, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Upload collection', definition: 'A Payload collection with upload: true. Stores files and generates alt text, dimensions, MIME type.' },
      { term: 'Image sizes', definition: 'Auto-generate resized versions on upload: thumbnail (400w), card (800w), hero (1920w).' },
      { term: 'Storage adapter', definition: 'Stores files on S3, Cloudflare R2, or Supabase Storage instead of the local filesystem.' },
      { term: 'Sharp', definition: 'Node.js image processing library. Payload uses it for resizing, format conversion, and WebP generation.' },
      { term: 'Static file serving', definition: 'Payload serves uploaded files at /media — configure staticDir and staticURL in the collection.' },
    ],
    content: `## Media & Uploads

Payload handles media uploads, image optimization, and multiple size generation automatically.

### Media Collection

\`\`\`tsx
// collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    staticURL: '/media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, crop: 'center' },
      { name: 'card', width: 800, height: 500 },
      { name: 'hero', width: 1920, height: 1080 },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
\`\`\`

### S3 Storage Adapter (Vercel)

\`\`\`tsx
// payload.config.ts
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET!,
      config: {
        region: process.env.S3_REGION!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
      },
    }),
  ],
})
\`\`\`

### Using Media in Next.js

\`\`\`tsx
import Image from 'next/image'
import type { Media } from '@/payload-types'

function MediaImage({ media, size = 'card' }: { media: Media; size?: string }) {
  const url = media.sizes?.[size]?.url ?? media.url!
  const width = media.sizes?.[size]?.width ?? media.width!
  const height = media.sizes?.[size]?.height ?? media.height!

  return (
    <Image
      src={url}
      alt={media.alt}
      width={width}
      height={height}
      className="w-full h-auto rounded-lg"
    />
  )
}
\`\`\``,
    quiz: [
      { q: 'What does imageSizes config do?', options: ['Sets CSS image sizes', 'Auto-generates resized versions of every uploaded image — thumbnail, card, hero sizes', 'Required for uploads', 'Same as Sharp config'], correct: 1, explanation: 'On upload, Payload uses Sharp to generate all configured sizes. Each size is stored separately and the URLs are saved in the document metadata.' },
      { q: 'What does a storage adapter do?', options: ['Compresses images', 'Stores uploaded files in S3/R2/Supabase instead of the local filesystem — required for serverless deploys', 'Changes the API', 'Handles CORS for media'], correct: 1, explanation: 'Local filesystem storage doesn\'t work on serverless platforms (files are wiped on redeploy). Storage adapters send files to cloud storage (S3, Cloudflare R2).' },
      { q: 'Where does Payload serve static files from?', options: ['Always from S3', 'staticDir for local files, storage adapter URL for cloud — configured per collection', 'Only from /public', 'CDN required'], correct: 1, explanation: 'staticURL and staticDir configure where uploaded files are served from. With a storage adapter, the adapter handles CDN URLs automatically.' },
      { q: 'What payload-types file is used for?', options: ['TypeScript config', 'Auto-generated types from your collections — import Media type for full type safety on uploaded files', 'Required config file', 'GraphQL schema'], correct: 1, explanation: 'Payload generates src/payload-types.ts from your config. Import collection types for type-safe access to field values, relationship IDs, and media sizes.' },
    ],
  },
  {
    id: 'cc-payload-m08', track: 'crash', title: 'Globals, Plugins & Deployment',
    subtitle: 'Use globals for site settings, extend with plugins, and deploy Payload to Vercel.',
    moduleObjective: 'Create a site settings global, add a plugin, and configure Payload for Vercel deployment.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'PhD',
    xp: 200, duration: 10, module: 8, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Global', definition: 'A singleton document (one record) — site settings, nav config, social links. findGlobal() / updateGlobal().' },
      { term: 'Plugin', definition: 'A function that adds collections, fields, hooks, or UI to your config. Payload has official plugins for SEO, search, forms.' },
      { term: 'payload-types.ts', definition: 'Auto-generated TypeScript types from your full config. Regenerate with npx payload generate:types.' },
      { term: 'DATABASE_URL', definition: 'Postgres connection string required for Payload on Vercel. Use Neon, Supabase, or Railway for serverless Postgres.' },
      { term: 'PAYLOAD_SECRET', definition: 'Random 32+ char string for JWT signing. Must match between deployments — store in env vars, never in code.' },
    ],
    content: `## Globals, Plugins & Deployment

Globals handle singleton content. Plugins extend Payload. Deployment to Vercel requires a serverless Postgres provider.

### Global — Site Settings

\`\`\`tsx
// globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'siteName', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'select', options: ['twitter', 'instagram', 'linkedin'] },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'mainNav', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'url', type: 'text' },
    ]},
  ],
}

// Use in server component
const payload = await getPayloadClient()
const settings = await payload.findGlobal({ slug: 'site-settings' })
\`\`\`

### Official Plugins

\`\`\`tsx
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

buildConfig({
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages'],
      generateTitle: ({ doc }) => \`\${doc.title} | JST Academy\`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
    searchPlugin({
      collections: ['posts', 'pages'],
    }),
  ],
})
\`\`\`

### Deploy to Vercel

\`\`\`bash
# Required env vars
DATABASE_URL=postgresql://...  # Neon / Supabase / Railway
PAYLOAD_SECRET=your-32-char-random-string
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app

# Regenerate types before deploy
npx payload generate:types

# Deploy
vercel --prod
\`\`\`

### Generate Types

\`\`\`bash
# After every config change
npx payload generate:types

# Add to package.json
"scripts": {
  "payload:generate-types": "payload generate:types",
  "build": "payload generate:types && next build"
}
\`\`\``,
    quiz: [
      { q: 'What is a Payload global?', options: ['A JS global variable', 'A singleton document — one record of this type, for site-wide settings like nav or social links', 'Same as a collection', 'A plugin'], correct: 1, explanation: 'Globals are for single-instance data: site settings, navigation, footer content. payload.findGlobal({ slug }) always returns one document.' },
      { q: 'What does payload generate:types do?', options: ['Creates migrations', 'Generates TypeScript types from your current collection/global config — run after every config change', 'Builds the project', 'Required for deployment'], correct: 1, explanation: 'Generated types give you TypeScript IntelliSense for all collection fields, relationship types, and upload sizes. Regenerate whenever config changes.' },
      { q: 'Why does Payload need a serverless Postgres provider for Vercel?', options: ['Vercel requires Postgres', 'Serverless functions are stateless — no persistent disk or local DB. Serverless Postgres (Neon, Supabase) maintains connections differently', 'SQLite is not supported', 'Performance'], correct: 1, explanation: 'Vercel functions have no persistent filesystem and cold-start connection pools differently. Serverless Postgres providers (Neon, Supabase) handle connection pooling for serverless.' },
      { q: 'What is PAYLOAD_SECRET used for?', options: ['API authentication', 'Signs JWT tokens for admin sessions — must be a random 32+ char string, same across all instances', 'Database password', 'Encrypts the database'], correct: 1, explanation: 'PAYLOAD_SECRET signs the JWT tokens for admin login sessions. If it changes, all active sessions are invalidated. Store it in env vars, never in code.' },
    ],
  },
]
