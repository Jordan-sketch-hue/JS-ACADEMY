import type { Course } from '../courses'

const CC_PAYLOAD_OBJ = 'Build content-managed full-stack applications with Payload CMS — collections, access control, hooks, rich text, and API integration in Next.js.'

export const crashPayloadCourses: Course[] = [
  {
    id: 'cc-payload-m01', track: 'crash', title: 'Payload CMS Introduction',
    subtitle: 'Set up Payload CMS in a Next.js 15 project with TypeScript.',
    moduleObjective: 'Install and configure Payload CMS in a Next.js project and access the admin panel.',
    courseObjective: CC_PAYLOAD_OBJ, crashId: 'cc-payload', crashTitle: 'Payload CMS', level: 'Basic',
    xp: 150, duration: 10, module: 1, certArea: 'Payload CMS Crash Course',
    keyTerms: [
      { term: 'Payload CMS', definition: 'TypeScript-native, self-hosted headless CMS built for Next.js. No vendor lock-in, full-stack control, MIT licensed.' },
      { term: 'Headless CMS', definition: 'CMS that provides content management + API without handling the frontend. You build the frontend in any framework.' },
      { term: 'payload.config.ts', definition: 'The main config file. Defines database, collections, globals, plugins, email, and CORS.' },
      { term: 'Admin Panel', definition: 'Payload auto-generates a full admin UI at /admin from your collection config. No extra code required.' },
      { term: 'Local API', definition: 'Payload exposes a Node.js API for direct database access in server components — no HTTP overhead.' },
    ],
    content: `## Payload CMS Introduction

Payload is a TypeScript-native headless CMS that runs inside your Next.js project. It auto-generates the admin UI, REST API, GraphQL API, and TypeScript types from your collection definitions.

### Install

\`\`\`bash
# New project with Payload template
npx create-payload-app@latest

# Or add to existing Next.js project
npx @payloadcms/next/create my-project
\`\`\`

### payload.config.ts

\`\`\`tsx
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL! },
  }),

  editor: lexicalEditor({}),

  collections: [Posts, Users],

  admin: {
    user: 'users',  // which collection is the admin user
  },

  cors: [process.env.NEXT_PUBLIC_APP_URL!],
})
\`\`\`

### File Structure

\`\`\`
app/
  (payload)/          ← Payload admin route group
    admin/
      [[...segments]]/
        page.tsx      ← Admin panel pages
    api/
      [...slug]/
        route.ts      ← Payload REST API
  (frontend)/         ← Your frontend routes
    page.tsx
payload.config.ts
collections/
  Posts.ts
  Users.ts
\`\`\`

### Access Admin Panel

Visit http://localhost:3000/admin — first visit prompts to create an admin user.`,
    quiz: [
      { q: 'What does Payload CMS auto-generate from your config?', options: ['Only the database schema', 'Admin UI, REST API, GraphQL API, TypeScript types — all from collection definitions', 'Only an API', 'Only types'], correct: 1, explanation: 'Payload generates the full admin panel, REST + GraphQL APIs, and TypeScript type definitions from your collection config. No boilerplate needed.' },
      { q: 'What is the Local API?', options: ['A localhost-only API', 'Payload\'s Node.js API for server-side access — direct DB queries without HTTP overhead', 'The REST API', 'GraphQL only'], correct: 1, explanation: 'The Local API calls payload.find(), payload.create() etc. in server components — no HTTP request, just direct database access with full type safety.' },
      { q: 'What does payload.config.ts define?', options: ['Only routes', 'Database adapter, collections, globals, editor, auth, CORS — the entire CMS configuration', 'TypeScript settings', 'Next.js config'], correct: 1, explanation: 'payload.config.ts is the single source of truth for your CMS. Everything — DB, collections, plugins, email, CORS — is configured here.' },
      { q: 'What is a headless CMS?', options: ['A CMS without a database', 'Provides content management and API but no frontend — you build the presentation layer separately', 'A static site generator', 'A database'], correct: 1, explanation: 'Headless = no head (frontend). Payload provides the admin UI, data, and APIs. Your Next.js app fetches and displays content however you choose.' },
    ],
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
