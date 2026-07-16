import type { Course } from '../courses'

export const techCourses: Course[] = [
  {
    id: 'tch-m01',
    track: 'tech',
    title: 'Full-Stack Architecture',
    subtitle: 'How modern applications are actually built — from request to response',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Client-Server Model',
        definition:
          'The architectural pattern in which a client (browser, mobile app) sends requests and a server processes them and returns responses. In modern apps, the "server" is often a distributed cluster of services, not a single machine.',
      },
      {
        term: 'API Layer',
        definition:
          'The interface between the frontend and backend that defines what data can be requested, in what format, and under what conditions. A well-designed API layer decouples the UI from the data layer so either can change independently.',
      },
      {
        term: 'Server-Side Rendering (SSR)',
        definition:
          'A rendering strategy in which HTML is generated on the server at request time rather than in the browser. SSR improves time-to-first-byte and SEO at the cost of server compute on every request.',
      },
      {
        term: 'Edge Runtime',
        definition:
          'A JavaScript execution environment distributed geographically close to users — at CDN nodes rather than a central data center. Edge functions execute in under 1ms cold-start vs. 100–400ms for traditional serverless functions.',
      },
      {
        term: 'Hydration',
        definition:
          'The process by which a JavaScript framework takes static HTML delivered from the server and "wakes it up" — attaching event listeners and state so the page becomes interactive. Poor hydration strategy is one of the most common performance killers in React applications.',
      },
    ],
    content: `## Full-Stack Architecture

Every production application you have ever used — from Instagram to your bank's mobile app — is built on the same fundamental architecture: a client that renders UI, a server that processes logic, and a database that persists state. What varies is where each responsibility lives, how they communicate, and how the system handles failure.

### The Modern Stack

In 2024, the dominant full-stack pattern for product companies is: Next.js or Remix on the frontend/BFF (Backend for Frontend) layer, a PostgreSQL database (usually managed via Supabase or PlanetScale), and a combination of API routes and serverless functions handling business logic. This is not the only valid architecture, but it is the one you will encounter most often when joining or auditing a team.

Next.js is worth understanding deeply because it operates at multiple layers simultaneously. A single Next.js application can serve:
- **Static pages** — HTML generated at build time, served from a CDN, essentially free at scale
- **Server-rendered pages** — HTML generated per-request on a server, necessary when content is personalized or real-time
- **Client components** — JavaScript that runs in the browser for interactivity
- **API routes** — Server-side endpoints at \`/api/*\` that handle form submissions, webhooks, and data mutations

### How a Request Flows

When a user visits your app, this is what happens in under 200ms on a well-optimized system:

1. Browser sends a GET request to your domain
2. DNS resolves to a CDN edge node geographically near the user
3. If the page is static and cached, the CDN returns it immediately — no server involved
4. If SSR is required, the edge node forwards the request to a serverless function
5. That function queries the database, renders the HTML, and returns it
6. The browser displays the HTML, then downloads the JavaScript bundle
7. React hydrates the page — attaching event handlers to the static HTML
8. Subsequent interactions can happen client-side or trigger API calls

The critical insight: **network round-trips are your biggest performance cost**. Every database query, every API call, every redirect adds latency. Architects obsess over reducing round-trips and moving compute closer to users.

### The Database Layer

Your database is the source of truth. Everything else can be rebuilt from it. This is why experienced engineers treat schema design as the highest-leverage decision in the early life of a product — a bad schema is expensive to fix once you have production data.

Most product databases are relational (PostgreSQL, MySQL). They store data in tables with typed columns, enforce relationships via foreign keys, and support complex queries via SQL. For read-heavy workloads, you add a caching layer (Redis) that keeps frequently-accessed data in memory so the database is not hit on every request.

### What "Serverless" Actually Means

Serverless does not mean no servers — it means servers you do not manage. Your code runs in a container that spins up on demand, executes, and disappears. You pay per invocation rather than per idle hour. This is excellent for variable-load APIs and background jobs, but terrible for long-running processes or workloads that need persistent memory.

### Choosing an Architecture

The right architecture is the simplest one that handles your current load with room to grow. A startup with 500 users does not need microservices. A single Next.js app with a managed database handles millions of monthly active users without heroics. Premature architectural complexity kills more startups than technical debt does.`,
    quiz: [
      {
        q: 'What is the primary advantage of serving static pages from a CDN versus server-rendering them on every request?',
        options: [
          'Static pages can include personalized user data',
          'CDN-served static pages bypass the server entirely, dramatically reducing latency and compute cost',
          'Static pages are always more secure than server-rendered ones',
          'CDN delivery is only faster for users outside the origin region',
        ],
        correct: 1,
        explanation:
          'Static pages cached at CDN edge nodes are returned without involving your server or database. This makes them nearly instant and free at scale — the tradeoff is they cannot contain per-user personalized data.',
      },
      {
        q: 'Why is hydration a potential performance bottleneck in React applications?',
        options: [
          'Hydration requires a second round-trip to the database',
          'The browser must download and execute JavaScript before the page becomes interactive, even though HTML is already visible',
          'Hydration forces SSR on every subsequent page visit',
          'React cannot hydrate pages served from a CDN',
        ],
        correct: 1,
        explanation:
          'The user sees HTML immediately (fast), but cannot interact with it until JavaScript downloads, parses, and hydrates — which can take 2–5 seconds on mobile. This gap between visible and interactive is a core metric called Time to Interactive (TTI).',
      },
      {
        q: 'A startup\'s API response time spikes under load. Which architectural change addresses the root cause most directly?',
        options: [
          'Switch from Next.js to a different frontend framework',
          'Add a caching layer (Redis) to serve frequent reads from memory instead of querying the database on every request',
          'Increase the JavaScript bundle size to reduce API calls',
          'Move the database to a different cloud provider',
        ],
        correct: 1,
        explanation:
          'Database queries are the most common bottleneck under load. A Redis cache holds frequently-read data in memory, reducing database round-trips from milliseconds to microseconds and allowing the same database to handle 10–100x more traffic.',
      },
      {
        q: 'What does the Backend for Frontend (BFF) pattern solve?',
        options: [
          'It replaces the database with a faster in-memory store',
          'It creates a dedicated server layer that aggregates data from multiple backend services into exactly what each frontend client needs, reducing over-fetching',
          'It moves all rendering to the client to reduce server load',
          'It eliminates the need for API versioning',
        ],
        correct: 1,
        explanation:
          'A BFF is a thin server layer that sits between your frontend and downstream services. It fetches from multiple APIs, transforms the responses, and returns exactly what the UI needs — reducing the number of network calls and payload size on the client.',
      },
      {
        q: 'When is a serverless architecture the WRONG choice?',
        options: [
          'When your API traffic is unpredictable and spiky',
          'When you have background jobs that run for 15+ minutes and maintain in-memory state across steps',
          'When you want to avoid managing server infrastructure',
          'When you are early-stage and cannot predict load',
        ],
        correct: 1,
        explanation:
          'Serverless functions are designed for short-lived, stateless execution — most platforms enforce a 10–15 minute timeout. Long-running processes that maintain state (ML inference pipelines, video processing jobs) require persistent compute like a dedicated VM or container.',
      },
    ],
  },
  {
    id: 'tch-m02',
    track: 'tech',
    title: 'How AI Models Work',
    subtitle: 'Tokens, embeddings, context windows, and the mechanics behind every LLM',
    level: 'Masters',
    xp: 160,
    duration: 15,
    module: 2,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Token',
        definition:
          'The basic unit of text that a language model processes — roughly 0.75 words in English. "Unbelievable" is one token; "J Supreme Tech" is three. Models are priced, speed-limited, and context-constrained by token count, not word or character count.',
      },
      {
        term: 'Embedding',
        definition:
          'A numeric vector (list of floating-point numbers) that represents the meaning of a word, sentence, or document in a high-dimensional space. Words with similar meanings have vectors that are mathematically close. Embeddings are the foundation of semantic search and RAG systems.',
      },
      {
        term: 'Context Window',
        definition:
          'The total number of tokens a model can "see" at once — both the input prompt and the output response. Claude 3\'s context window is 200,000 tokens (~150,000 words). Information outside the context window is invisible to the model during that call.',
      },
      {
        term: 'Temperature',
        definition:
          'A parameter (0.0 to 2.0) that controls the randomness of model outputs. At 0, the model always picks the highest-probability next token (deterministic, repetitive). At 1+, it samples more broadly, producing creative but less reliable outputs. Production systems use 0–0.3.',
      },
      {
        term: 'Transformer Architecture',
        definition:
          'The neural network design underlying every major language model since 2017. Transformers use self-attention mechanisms to weigh the relevance of every token to every other token in the context — the mathematical operation that allows the model to understand long-range dependencies in text.',
      },
    ],
    content: `## How AI Models Work

The models behind ChatGPT, Claude, and Gemini are not magic — they are specific mathematical architectures trained on specific data with specific objectives. Understanding the mechanics makes you a far better builder and a much harder person to fool by AI hype.

### What a Language Model Is Doing

At its core, a large language model (LLM) is doing one thing: given a sequence of tokens, predict the next most likely token. That's it. The emergent capabilities — reasoning, coding, summarization, translation — are not programmed in. They arise from training this simple prediction task on several trillion tokens of human-generated text.

When you send a prompt to Claude and get a response, the model is generating one token at a time, with each new token conditioned on every previous token in the context. This is why longer responses cost more — both in compute and in latency.

### The Transformer Architecture

The breakthrough paper was "Attention is All You Need" (Vaswani et al., 2017). Before transformers, the best NLP models processed text sequentially — each word depended only on the words before it. Transformers process all tokens in the context simultaneously using a mechanism called self-attention.

Self-attention lets the model answer: "For the current token I am predicting, how relevant is every other token in the context?" It assigns attention weights to all tokens, then computes a weighted representation. This is why transformers can handle long-range dependencies — the model can attend to a word 10,000 tokens back with the same mechanism as attending to the previous word.

The cost: self-attention is O(n²) in the length of the sequence. Doubling the context window quadruples the compute. This is why extending context windows is expensive and why most production systems use chunking and retrieval rather than stuffing everything into one prompt.

### Tokens and Why They Matter

Every API call you make to an LLM is priced in tokens. At $3 per million input tokens (rough GPT-4 pricing), running 10,000 API calls with 1,000-token prompts costs $30. At 10,000-token prompts, it's $300. Token efficiency is not a theoretical concern — it is a unit economics decision.

Token counts also affect latency. Models generate at roughly 30–80 tokens per second. A 1,000-token response takes 12–33 seconds at those rates. For user-facing applications, streaming (sending tokens as they are generated) is essential for perceived responsiveness.

### Embeddings and Semantic Search

Embeddings convert text into vectors — lists of ~1,500 numbers that encode meaning. Two sentences that mean the same thing have similar vectors even if they share no words. "The car broke down" and "the vehicle stopped functioning" will be embedded close together.

This property powers:
- **Semantic search**: find documents by meaning, not keyword match
- **RAG (Retrieval-Augmented Generation)**: fetch relevant knowledge before generating a response
- **Clustering**: group similar customer feedback, tickets, or documents automatically
- **Recommendation systems**: find items similar to what a user liked

In practice: you embed your knowledge base once (or nightly), store vectors in a database like Pinecone or pgvector, then at query time embed the user's question and retrieve the closest vectors. The retrieved text goes into the prompt as context.

### The Prompting Layer

Prompt engineering is the interface between human intent and model behavior. The model cannot read your mind — it responds to the exact tokens you send. Effective prompting means:

1. **Role definition** — tell the model what persona and constraints to operate under
2. **Task specification** — be precise about format, length, and output requirements
3. **Examples (few-shot)** — showing the model 2–3 examples of desired input-output pairs dramatically improves consistency
4. **Chain-of-thought** — asking the model to "think step by step" before answering improves accuracy on reasoning tasks by 30–50% on benchmarks

### What Models Cannot Do

LLMs do not have: persistent memory across calls, access to real-time information (without tools), the ability to run code reliably without verification, or true understanding of their own confidence. They are pattern-matching systems trained to produce plausible text. Every output should be treated as a strong first draft that requires review, not a ground truth.`,
    quiz: [
      {
        q: 'Why does self-attention make extending context windows computationally expensive?',
        options: [
          'Longer context requires larger embedding dimensions',
          'Self-attention complexity scales as O(n²) — doubling the context quadruples the compute',
          'The model must re-train on each new context window size',
          'Token generation speed is fixed regardless of context length',
        ],
        correct: 1,
        explanation:
          'Self-attention computes pairwise relevance between all tokens. With n tokens, that is n² comparisons. A 4,000-token context requires 16M attention computations; an 8,000-token context requires 64M — 4x as many for 2x the tokens.',
      },
      {
        q: 'A temperature setting of 0.0 is most appropriate for which use case?',
        options: [
          'Writing creative fiction with varied narrative styles',
          'Generating structured JSON from a defined schema where consistency is critical',
          'Brainstorming ten different marketing angles for a product',
          'Producing varied quiz questions from the same content',
        ],
        correct: 1,
        explanation:
          'Temperature 0 makes the model deterministic — it always picks the highest-probability next token. For structured output (JSON, code, SQL), this is desirable. For creative tasks, higher temperature (0.7–1.0) produces more diverse results.',
      },
      {
        q: 'What is the primary purpose of RAG (Retrieval-Augmented Generation)?',
        options: [
          'To increase the model\'s context window without retraining',
          'To inject relevant, up-to-date knowledge into the prompt at query time, allowing the model to answer questions about information it was not trained on',
          'To reduce hallucination by removing the generation step',
          'To convert the model\'s outputs into structured embeddings',
        ],
        correct: 1,
        explanation:
          'LLMs have a training cutoff and cannot access proprietary data. RAG retrieves relevant documents from a vector database and includes them in the prompt, effectively giving the model current and domain-specific knowledge without fine-tuning.',
      },
      {
        q: 'An API call costs $3 per million tokens. Your prompt is 2,000 tokens and you make 50,000 calls per month. What is your monthly input token cost?',
        options: ['$150', '$300', '$600', '$3,000'],
        correct: 1,
        explanation:
          '50,000 calls × 2,000 tokens = 100,000,000 tokens = 100M tokens. At $3 per million, that is $300/month. This is why token efficiency directly affects your AI product\'s unit economics.',
      },
      {
        q: 'Which technique most reliably improves LLM accuracy on multi-step reasoning tasks?',
        options: [
          'Increasing temperature to 1.5 to explore more answer paths',
          'Adding chain-of-thought prompting ("think step by step") before the final answer',
          'Reducing the prompt length to minimize token processing',
          'Using a smaller model for faster iteration',
        ],
        correct: 1,
        explanation:
          'Chain-of-thought (CoT) prompting was introduced by Wei et al. (2022) and demonstrated 30–50% accuracy improvements on reasoning benchmarks. It works by forcing the model to externalize its reasoning process, which reduces errors caused by jumping to conclusions.',
      },
    ],
  },
  {
    id: 'tch-m03',
    track: 'tech',
    title: 'APIs & Integrations',
    subtitle: 'Webhooks, REST, OAuth, and how modern systems talk to each other',
    level: 'Masters',
    xp: 155,
    duration: 13,
    module: 3,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'REST (Representational State Transfer)',
        definition:
          'An architectural style for web APIs that maps HTTP verbs (GET, POST, PUT, DELETE) to CRUD operations on resources identified by URLs. REST is stateless — each request contains all the information the server needs to process it.',
      },
      {
        term: 'Webhook',
        definition:
          'A push notification from one system to another, delivered as an HTTP POST to a URL you specify. Instead of your server polling an external service every minute ("Did anything change?"), the external service calls your server the moment something happens.',
      },
      {
        term: 'OAuth 2.0',
        definition:
          'The industry-standard authorization protocol that allows users to grant third-party applications access to their accounts without sharing passwords. When you click "Sign in with Google," OAuth 2.0 is the mechanism exchanging permission tokens between Google and the target app.',
      },
      {
        term: 'Rate Limiting',
        definition:
          'A server-side policy that caps how many requests a client can make in a given time window (e.g., 1,000 requests per hour). Rate limits protect server resources and prevent abuse. Hitting a rate limit returns HTTP 429; the client should back off and retry with exponential delay.',
      },
      {
        term: 'Idempotency',
        definition:
          'The property of an operation where performing it multiple times produces the same result as performing it once. GET is inherently idempotent; POST is not. Idempotency keys allow clients to safely retry failed requests (e.g., a payment) without fear of duplicate processing.',
      },
    ],
    content: `## APIs & Integrations

Every piece of software you build will talk to other software. Payment providers, authentication systems, AI models, CRMs, email platforms, social media APIs — the value of your product increasingly comes from how intelligently it orchestrates these external services, not from what it builds from scratch.

### REST: The Lingua Franca

REST is not a protocol — it is a set of conventions that emerged as the most practical way to design HTTP APIs. The conventions:

- **Resources as nouns, not verbs**: \`/users/123\` not \`/getUser?id=123\`
- **HTTP verbs carry intent**: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- **Stateless requests**: the server holds no session state between requests; the client sends auth credentials (typically a Bearer token in the Authorization header) with every call
- **Standard status codes**: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests, 500 Internal Server Error

When consuming a third-party REST API, the first things to check: authentication method, base URL, rate limits, and pagination strategy. Most production APIs paginate results — they return 25–100 items plus a cursor or page number, not the full dataset in one call.

### Webhooks: Event-Driven Integration

Polling is asking "is it done yet?" every N seconds. Webhooks are the system telling you when it is done. The difference in efficiency is massive at scale.

Stripe uses webhooks to notify you when a payment succeeds. GitHub uses them to trigger your CI pipeline when code is pushed. Twilio uses them to tell you when an SMS is delivered.

Setting up a webhook endpoint:
1. You expose a public HTTPS URL on your server (\`/webhooks/stripe\`)
2. You register that URL with the external service
3. When an event fires, the service sends a POST request to your URL with event data as JSON
4. Your server processes the event and returns HTTP 200 within ~5 seconds (or the service will retry)

Critical: always verify webhook signatures. Stripe, for example, includes a header \`Stripe-Signature\` containing an HMAC-SHA256 signature of the payload. If you do not verify it, any attacker who knows your webhook URL can send fake events.

### OAuth 2.0 Flows

OAuth is about delegation: a user grants your app permission to act on their behalf, without giving you their password.

The Authorization Code flow (used for web apps):
1. User clicks "Connect with Stripe" on your app
2. Your app redirects to Stripe's OAuth server with your \`client_id\` and requested \`scopes\`
3. User logs in to Stripe and approves the permissions
4. Stripe redirects back to your app with a \`code\` parameter
5. Your server exchanges that code (plus your \`client_secret\`) for an \`access_token\`
6. You use the access token in API calls on the user's behalf

The access token is short-lived (often 1 hour). A \`refresh_token\` (long-lived) allows you to get new access tokens without re-prompting the user.

### Error Handling and Retries

Network calls fail. Database connections drop. Third-party APIs go down for maintenance. Robust integrations handle failure gracefully.

The retry pattern for transient failures:
- Catch HTTP 500, 503, or network timeout errors
- Wait before retrying (exponential backoff: 1s, 2s, 4s, 8s)
- Set a maximum retry count (3–5 attempts)
- Log every retry with the error and attempt number

For critical operations (payments, data writes), use idempotency keys: include a unique ID with every request so that if you retry a timed-out request, the server recognizes the duplicate and returns the original result rather than processing twice.

### API Design Principles

When you are building an API others will consume:

- Version from day one (\`/v1/...\`) — you will need to make breaking changes
- Return consistent error shapes: \`{ error: { code: "NOT_FOUND", message: "..." } }\`
- Document with OpenAPI/Swagger so developers can generate client code automatically
- Use pagination for any collection endpoint that could return more than 50 items
- Never expose internal database IDs in public APIs — use UUIDs`,
    quiz: [
      {
        q: 'A webhook endpoint receives a POST from Stripe but you skip signature verification. What is the security risk?',
        options: [
          'The webhook will process slower without verification',
          'An attacker who knows your webhook URL can send forged events — fake "payment succeeded" notifications — triggering your business logic fraudulently',
          'Stripe will throttle your API access if you skip verification',
          'You will be unable to receive real events without the signature',
        ],
        correct: 1,
        explanation:
          'Webhook URLs are often discoverable. Without signature verification, any HTTP client can POST fake events to your endpoint. Stripe\'s HMAC-SHA256 signature, computed using your webhook secret, proves the event genuinely originated from Stripe.',
      },
      {
        q: 'What HTTP status code should a webhook endpoint return to prevent the sender from retrying delivery?',
        options: ['200 OK', '201 Created', '204 No Content', 'Either 200 or 204 — any 2xx signals successful receipt'],
        correct: 3,
        explanation:
          'Webhook senders interpret any 2xx response as successful delivery and will not retry. A non-2xx (4xx or 5xx) response triggers retry logic. Return 200 immediately after receiving and queuing the event — do not wait for processing to complete, or you risk timeouts.',
      },
      {
        q: 'In OAuth 2.0, why is the client_secret never sent to the browser?',
        options: [
          'Browsers cannot process secrets longer than 64 characters',
          'Anyone who can read the browser\'s JavaScript or network tab could steal it, allowing them to impersonate your application and obtain access tokens',
          'The client_secret is only needed for mobile apps, not web apps',
          'OAuth 2.0 requires secrets to be sent only over WebSocket connections',
        ],
        correct: 1,
        explanation:
          'The client_secret authenticates your application to the OAuth server. Exposing it in frontend code would let attackers register their own redirect URIs and steal authorization codes. The code-for-token exchange always happens server-to-server.',
      },
      {
        q: 'Your server retries a payment API call three times due to timeouts, and the payment processes on all three attempts. Which mechanism prevents triple-charging the customer?',
        options: [
          'Rate limiting on the payment provider side',
          'Idempotency keys — a unique ID sent with each attempt that the server uses to deduplicate processing',
          'OAuth token expiry that invalidates retried requests',
          'HTTP 409 Conflict responses that block duplicate payments',
        ],
        correct: 1,
        explanation:
          'Idempotency keys (e.g., Stripe\'s \`Idempotency-Key\` header) allow you to safely retry requests. The server stores the key with the result; if it sees the same key again, it returns the cached result without reprocessing. The key must be unique per operation and generated before the first attempt.',
      },
      {
        q: 'What is the correct REST endpoint design for updating a user\'s email address?',
        options: [
          'POST /updateUserEmail?userId=123',
          'PATCH /users/123 with body { "email": "new@email.com" }',
          'GET /users/123/setEmail?value=new@email.com',
          'PUT /changeEmail/123',
        ],
        correct: 1,
        explanation:
          'PATCH /users/123 follows REST conventions: the resource is identified by its URL (/users/123), PATCH signals a partial update, and the changed fields are in the request body. PATCH is preferred over PUT when only some fields are being updated, since PUT conventionally replaces the entire resource.',
      },
    ],
  },
  {
    id: 'tch-m04',
    track: 'tech',
    title: 'Databases',
    subtitle: 'SQL vs NoSQL, schema design, indexing, and knowing when to use what',
    level: 'Masters',
    xp: 165,
    duration: 16,
    module: 4,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'ACID Transactions',
        definition:
          'A set of properties (Atomicity, Consistency, Isolation, Durability) that guarantee database operations complete reliably. Atomicity means a transaction either fully succeeds or fully fails — you cannot charge a customer without recording the order. PostgreSQL is fully ACID-compliant; most NoSQL databases trade ACID for speed and scale.',
      },
      {
        term: 'Index',
        definition:
          'A separate data structure (typically a B-tree) that the database maintains alongside a table to enable fast lookups without scanning every row. An index on \`users.email\` turns an O(n) full-table scan into an O(log n) lookup. The tradeoff: indexes consume storage and slow down writes because they must be updated with every INSERT/UPDATE.',
      },
      {
        term: 'Foreign Key',
        definition:
          'A column in one table that references the primary key of another table, enforcing referential integrity at the database level. A foreign key on \`orders.user_id\` ensures you cannot create an order for a user that does not exist, and (depending on configuration) will prevent deleting a user who has orders.',
      },
      {
        term: 'N+1 Query Problem',
        definition:
          'A performance anti-pattern in which code fetches a list of N records, then makes one additional query per record to fetch related data — resulting in N+1 total queries instead of 1–2. Fetching 100 posts and then querying the author of each post separately makes 101 database round-trips. The fix is a JOIN or eager loading.',
      },
      {
        term: 'CAP Theorem',
        definition:
          'A theoretical result (Brewer, 2000) stating that a distributed data system can guarantee at most two of three properties: Consistency (all nodes see the same data), Availability (every request receives a response), and Partition Tolerance (the system functions despite network splits). NoSQL databases typically choose AP (available and partition-tolerant) over CP.',
      },
    ],
    content: `## Databases

The database is the most consequential technical decision you make early in a product. It is the hardest component to change after launch, and its design determines what queries are fast, what queries are possible, and how much your infrastructure costs at scale.

### Relational Databases (SQL)

PostgreSQL is the default correct choice for 90% of new products. It is battle-tested (30+ years), ACID-compliant, supports complex queries with JOINs and aggregations, and has a rich ecosystem of tooling.

Relational databases organize data into tables with defined schemas. Each table has typed columns (text, integer, boolean, timestamp, UUID, JSONB) and rows. Relationships between tables are expressed via foreign keys.

The relational model excels when:
- Your data has clear relationships (users have orders; orders have line items)
- You need complex queries across multiple entities
- Data integrity is critical (financial transactions, health records)
- You need to ask questions you have not thought of yet (ad-hoc analytics)

### Schema Design Principles

Good schema design starts with normalization — organizing data to eliminate redundancy. The three most important normal forms:

**1NF**: Each column contains atomic values. No arrays of values in a single column (use a separate table or JSONB).

**2NF**: Every non-key column depends on the full primary key, not a subset. In a table with composite keys, this prevents partial dependencies.

**3NF**: No non-key column depends on another non-key column (no transitive dependencies). Store \`city\` and \`state\` separately, not city-plus-state in one column.

In practice, you will denormalize selectively for performance — duplicating frequently-read data to avoid JOINs on hot paths. This is a deliberate trade-off, not an accident.

### Indexes: When and What

Without an index, a database satisfies a query by reading every row in the table (a full-table scan). With a B-tree index on the queried column, it finds rows in O(log n) time — roughly 20 comparisons for a million rows.

Add indexes on:
- Columns used in WHERE clauses (\`WHERE email = ?\`)
- Columns used in JOIN conditions (\`ON orders.user_id = users.id\`)
- Columns used in ORDER BY on large tables
- Foreign key columns (PostgreSQL does not do this automatically)

Do not blindly index everything. Each index adds ~10–30% write overhead and storage cost. A write-heavy table (logs, events) with 20 indexes will be slow. Profile query performance (use EXPLAIN ANALYZE in PostgreSQL) before adding indexes.

### NoSQL: When It Is the Right Tool

NoSQL covers a broad family: document stores (MongoDB), key-value stores (Redis), column stores (Cassandra), and graph databases (Neo4j). The common thread: they sacrifice SQL's relational flexibility for scale, speed, or specific data model fit.

**Use Redis for**: caching (session storage, rate limit counters, computed values that are expensive to recalculate), pub/sub messaging, and leaderboards.

**Use MongoDB for**: content that varies widely in structure per document (CMSs with variable block types, product catalogs with different attributes per category).

**Use Cassandra for**: write-heavy time-series data at extreme scale (IoT sensor readings, event logs for hundreds of millions of users). Cassandra writes are O(1); reads require careful query planning.

The most common NoSQL mistake: choosing MongoDB "for flexibility" on a relational dataset, then spending months trying to replicate JOIN behavior in application code.

### Connection Pooling

Opening a database connection is expensive — typically 50–100ms. Applications maintain a connection pool: a fixed number of open connections that requests borrow and return. In serverless environments (Next.js API routes, Lambda), each function invocation tries to open a new connection, which can exhaust your database's connection limit. The fix: use a connection pooler (PgBouncer, Supabase's built-in pooler) that manages connections between your functions and the database.

### Backups and Point-in-Time Recovery

Managed databases (Supabase, PlanetScale, RDS) take automated daily backups and support point-in-time recovery — restoring to any second in the past 7–30 days. Before choosing a database provider, verify: backup frequency, retention window, restore time objective (how long a restore takes), and whether you can test the restore process without service interruption.`,
    quiz: [
      {
        q: 'Your app fetches 500 blog posts, then queries the author\'s name for each post separately. How many database queries does this make, and what is the fix?',
        options: [
          '500 queries; fix by caching authors in Redis',
          '501 queries (N+1 problem); fix with a JOIN that fetches posts and authors in one query',
          '2 queries; this is already optimal',
          '500 queries; fix by storing author names directly in the posts table',
        ],
        correct: 1,
        explanation:
          'This is the N+1 problem: 1 query for posts + 500 queries for authors = 501. A JOIN (SELECT posts.*, users.name FROM posts JOIN users ON posts.user_id = users.id) returns the same data in 1 round-trip. At scale, N+1 patterns cause database exhaustion under traffic.',
      },
      {
        q: 'A table has 10 million rows. A query for records WHERE status = \'active\' takes 8 seconds. The most effective first fix is:',
        options: [
          'Move the table to a NoSQL database',
          'Add a B-tree index on the status column to convert the full-table scan to a direct lookup',
          'Increase the database server\'s RAM',
          'Shard the table horizontally across multiple servers',
        ],
        correct: 1,
        explanation:
          'Without an index, the database reads all 10M rows to find matching ones. An index on \`status\` allows the query planner to jump directly to matching rows in O(log n) time. This is always the first optimization to try before hardware upgrades or architectural changes.',
      },
      {
        q: 'Why should you NOT store a user\'s full address as a single "address" text column?',
        options: [
          'Text columns are slower than integer columns for indexing',
          'You cannot query or filter individual address components (city, state, postal code) efficiently without parsing the string',
          'PostgreSQL does not support text columns longer than 255 characters',
          'Single-column addresses violate ACID transaction requirements',
        ],
        correct: 1,
        explanation:
          'Compound values in a single column violate 1NF. If you ever need to filter users by state, offer regional shipping rates, or validate postal codes, a single string field forces expensive string parsing. Separate columns (street, city, state, postal_code, country) make all of these trivial.',
      },
      {
        q: 'According to CAP theorem, when a network partition occurs, which pair of guarantees can a system maintain?',
        options: [
          'All three: Consistency, Availability, and Partition Tolerance simultaneously',
          'Either Consistency + Partition Tolerance, or Availability + Partition Tolerance — but not all three',
          'Availability + Consistency, by sacrificing Partition Tolerance',
          'CAP theorem only applies to systems with more than 1,000 nodes',
        ],
        correct: 1,
        explanation:
          'Network partitions are unavoidable in distributed systems. When a partition occurs, you must choose: reject requests to ensure consistent data (CP), or serve potentially stale data to remain available (AP). Banking systems choose CP; social feeds typically choose AP.',
      },
      {
        q: 'What problem does a connection pooler like PgBouncer solve in a serverless environment?',
        options: [
          'It encrypts database connections to prevent eavesdropping',
          'It reuses a fixed set of long-lived database connections across thousands of short-lived function invocations, preventing connection exhaustion',
          'It automatically shards queries across multiple database replicas',
          'It caches query results to reduce database load',
        ],
        correct: 1,
        explanation:
          'PostgreSQL supports ~100 connections by default; some configurations handle 500. A Next.js app with 1,000 concurrent users spawns 1,000 serverless functions, each trying to open a connection. PgBouncer maintains a pool of 50 real connections and multiplexes thousands of application requests through them.',
      },
    ],
  },
  {
    id: 'tch-m05',
    track: 'tech',
    title: 'Automation & Workflows',
    subtitle: 'n8n, Make, Zapier — building systems that work while you sleep',
    level: 'PhD',
    xp: 175,
    duration: 17,
    module: 5,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Workflow Automation',
        definition:
          'The use of software to execute multi-step business processes triggered by events, schedules, or conditions — without human intervention at each step. Workflow automation is distinct from writing code; it uses visual node editors and pre-built connectors to wire together APIs that would otherwise require custom integration work.',
      },
      {
        term: 'Trigger',
        definition:
          'The event that initiates a workflow. Triggers can be time-based (run daily at 9 AM), event-based (a new row in a Supabase table), or webhook-based (a form submission). A workflow without an appropriate trigger runs at the wrong time or not at all.',
      },
      {
        term: 'Branching Logic',
        definition:
          'Conditional routing within a workflow that sends data down different paths based on values or conditions. An IF node can check whether a contact already exists in a CRM and route to "update record" vs. "create record" accordingly. Complex workflows are essentially visual flowcharts with API calls at each node.',
      },
      {
        term: 'Error Handling in Workflows',
        definition:
          'Mechanisms for detecting, logging, and recovering from failures in automated workflows. Without error handling, a failed API call silently aborts the workflow. Robust workflows include retry policies, error branches that notify the team via Slack or email, and dead-letter queues for payloads that cannot be processed.',
      },
      {
        term: 'Self-Hosted Automation',
        definition:
          'Running automation software on your own server rather than using a third-party SaaS. n8n can be self-hosted on Railway or a VPS, giving you unlimited workflow executions at the cost of server management. Zapier and Make are SaaS-only with per-task pricing that scales poorly for high-volume workflows.',
      },
    ],
    content: `## Automation & Workflows

The highest-leverage operators in any organization are not the ones who work hardest — they are the ones who build systems that work without them. Automation is the discipline of converting repeatable human processes into software-executed workflows that run 24/7, make no mistakes, and scale without hiring.

### The Automation Spectrum

At one end: no-code tools (Zapier, Make) that let non-engineers connect apps through a visual interface. At the other end: custom code (cron jobs, queue workers, event-driven microservices) that engineers write from scratch. Between them: low-code tools like n8n that give you the visual interface of no-code with the extensibility of custom code.

**Zapier**: largest integration library (6,000+ apps), easiest to start, expensive at scale. Each "Zap" handles simple linear workflows. Pricing is per task (each node execution counts). At 50,000+ tasks/month, the cost exceeds $500/month.

**Make (formerly Integromat)**: more powerful than Zapier, supports complex branching, loops, and data transformation with a visual scenario builder. Better pricing for moderate volume. Still a SaaS cost center at high volume.

**n8n**: open-source, self-hostable, with a visual node editor and the ability to run custom JavaScript inside any node. On Railway, running n8n costs ~$5/month regardless of workflow volume. This is the correct choice for any team running more than ~10,000 automated tasks per month.

### What to Automate First

The most valuable automation targets share these properties:
1. High frequency (happens multiple times per day)
2. Low variability (follows the same steps each time)
3. High error cost when done manually (data entry mistakes, missed follow-ups)
4. High cognitive load when done by a human (switching between 4 apps to complete one task)

The first automation most businesses should build: **lead intake to CRM**. A form submission triggers: create contact in CRM, send welcome email, notify sales Slack channel, add to email sequence, create deal with estimated value. This used to require a sales admin doing 5 manual steps per lead.

### Designing Reliable Workflows

The failure mode of most automated workflows is not that they break — it is that they break silently. A webhook stops delivering, an API key rotates, a third-party service changes a field name, and the workflow quietly does nothing while you assume it is running.

Design for observability:
- **Log every run**: n8n and Make log execution history by default. Review this weekly.
- **Alert on failure**: route workflow errors to a Slack channel. A workflow that fails 3x in a row should page someone.
- **Test with real data**: test workflows on production-equivalent data, not toy inputs. Edge cases in real customer names, addresses, and amounts will break your data transformation nodes.
- **Idempotent design**: if the same event triggers your workflow twice (webhook retries are common), it should not create two records or send two emails. Check for existence before creating.

### High-Value Automation Patterns

**Client onboarding automation**: contract signed (DocuSign webhook) → create project in Notion → create Slack channel → send welcome email → schedule kickoff call (Calendly) → add to billing in Stripe → notify team

**Lead nurturing**: new subscriber → tag based on source → wait 1 day → send email 1 → wait 3 days → check if opened → if yes, send offer; if no, send re-engagement

**Daily reporting**: 9 AM cron → query Supabase for yesterday's signups, revenue, churn → format as message → post to Slack #morning-metrics

**Invoice processing**: invoice received (email trigger) → extract data with AI → create in accounting software → notify approver → on approval, mark paid and file

### The n8n + AI Stack

n8n's HTTP Request node can call any API, including OpenAI and Claude. This unlocks AI-powered automation that goes beyond simple routing:
- Classify incoming support emails by topic and route to the right team
- Extract structured data from free-text form responses
- Generate first-draft responses to common inquiries for human review
- Summarize long documents before storing in a knowledge base

The pattern: receive unstructured input → transform with AI → route and store structured output. This turns messy human-generated text into clean data that drives downstream actions.`,
    quiz: [
      {
        q: 'A workflow runs 80,000 tasks per month on Zapier at $0.01 per task. What is the monthly cost, and what is the alternative?',
        options: [
          '$80; Zapier is always the cheapest option',
          '$800; self-hosting n8n on Railway for ~$5/month handles the same volume',
          '$800; switching to Make reduces this to ~$400',
          '$8,000; automation at this scale requires a dedicated engineering team',
        ],
        correct: 1,
        explanation:
          'At $0.01/task × 80,000 tasks = $800/month. n8n self-hosted on a $5 Railway instance runs unlimited tasks. The monthly savings fund two years of server costs. For any business exceeding ~20,000 tasks/month, self-hosted n8n has better economics.',
      },
      {
        q: 'Your lead intake workflow creates a CRM contact every time a webhook fires. When Stripe retries a failed webhook, you get duplicate contacts. What design principle prevents this?',
        options: [
          'Rate limiting the webhook endpoint',
          'Idempotent design — check if a contact with the email already exists before creating; update rather than create if found',
          'Using a different webhook provider with no retry logic',
          'Adding a 60-second delay before the create step',
        ],
        correct: 1,
        explanation:
          'Idempotency means the same input produces the same result regardless of how many times it runs. For contact creation, always query by email first. If found, update. If not, create. This also handles the case where a customer re-submits the same form.',
      },
      {
        q: 'Which characteristic makes a business process the highest-priority automation candidate?',
        options: [
          'It is done by a senior employee',
          'It is high-frequency, low-variability, and causes downstream problems when done incorrectly',
          'It has already been documented in a SOP',
          'It requires more than three software tools',
        ],
        correct: 1,
        explanation:
          'Automation ROI = (time saved × frequency) − (build and maintain cost). High-frequency, low-variability processes with high error cost deliver the most ROI. A task done 50x/day incorrectly 2% of the time is a better target than a complex task done monthly.',
      },
      {
        q: 'An automated workflow has been silently failing for two weeks. What architectural feature would have caught this immediately?',
        options: [
          'A visual diagram of the workflow on the team dashboard',
          'An error branch that posts to a Slack channel when any node fails, with the error message and payload',
          'More detailed documentation of the workflow steps',
          'Running the workflow on a more powerful server',
        ],
        correct: 1,
        explanation:
          'Silent failures are the most dangerous failure mode in automation. Every critical workflow should have an error branch that fires on any uncaught exception and notifies a human via Slack, email, or PagerDuty. The notification should include enough context to diagnose without looking at logs.',
      },
      {
        q: 'Where in the automation stack does an AI node add the most unique value?',
        options: [
          'Replacing API calls to reduce integration count',
          'Converting unstructured input (emails, form text, documents) into structured data that can drive downstream routing and storage logic',
          'Speeding up time-based triggers to run faster than their scheduled interval',
          'Replacing database queries with natural language lookups',
        ],
        correct: 1,
        explanation:
          'Traditional automation requires structured input (a form field, a defined webhook payload). AI nodes unlock automation on unstructured inputs — free text, scanned documents, voice transcripts. Classify this email → route to this team; extract these fields from this invoice → create this record.',
      },
    ],
  },
  {
    id: 'tch-m06',
    track: 'tech',
    title: 'Cybersecurity Fundamentals',
    subtitle: 'What every founder must know to not get hacked',
    level: 'PhD',
    xp: 180,
    duration: 18,
    module: 6,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Attack Surface',
        definition:
          'The total set of entry points through which an attacker can try to inject data into or extract data from an environment. Every API endpoint, open port, employee email address, and third-party integration is part of your attack surface. Security is fundamentally about minimizing and monitoring this surface.',
      },
      {
        term: 'SQL Injection',
        definition:
          'An attack in which malicious SQL code is inserted into an input that is concatenated into a database query. If a login form builds the query with string concatenation (SELECT * FROM users WHERE email = \'" + email + "\'"), an attacker can input email = \' OR 1=1 -- to return all users. Parameterized queries eliminate this class of attack entirely.',
      },
      {
        term: 'Zero Trust Architecture',
        definition:
          'A security model that assumes no user, device, or network is inherently trusted — even inside the corporate perimeter. Every request must be authenticated, authorized, and encrypted regardless of its origin. The antithesis of the "castle and moat" model where everything inside the firewall is trusted.',
      },
      {
        term: 'Principle of Least Privilege',
        definition:
          'The security design rule that every user, service, and process should have access to only the minimum resources required to perform its function. A read-only analytics service should not have write access to your production database. A compromised low-privilege account causes limited damage; a compromised admin account is catastrophic.',
      },
      {
        term: 'OWASP Top 10',
        definition:
          'The Open Worldwide Application Security Project\'s ranked list of the ten most critical web application security risks, updated periodically based on real-world breach data. The current top three: Broken Access Control, Cryptographic Failures, and Injection. Building a checklist from this list covers the majority of exploitable vulnerabilities in web applications.',
      },
    ],
    content: `## Cybersecurity Fundamentals

Security breaches do not just cause data loss — they destroy customer trust, trigger regulatory penalties, and can end a company. Verizon's annual Data Breach Investigations Report consistently finds that over 80% of breaches exploit known vulnerability classes that have well-established mitigations. The majority of attacks succeed because of preventable failures, not sophisticated novel techniques.

### The Threat Landscape for Founders

You are not being targeted by nation-state hackers with zero-days. You are being targeted by automated scanners probing for known vulnerabilities, credential stuffing attacks using leaked username/password lists, and phishing campaigns targeting your team members with access to production systems.

The most common breach vectors for small-to-medium businesses:
1. **Phishing**: fraudulent email convinces an employee to enter credentials on a fake login page
2. **Credential reuse**: employee uses the same password on your app as on a breached service
3. **Exposed secrets**: API keys or database credentials committed to a public GitHub repository
4. **Unpatched dependencies**: a known CVE in a third-party library that was never updated
5. **Misconfigured access controls**: a storage bucket or database exposed to the public internet

### Authentication and Session Security

Never store passwords in plaintext — this is a career-ending error and a legal liability. The correct approach: hash passwords with bcrypt, scrypt, or Argon2 (not MD5 or SHA-1, which are cryptographically broken for this purpose). When a user logs in, hash their input and compare to the stored hash.

For session tokens: generate cryptographically random values (not incrementing IDs, not user IDs). Store them in HTTP-only, Secure, SameSite=Strict cookies. HTTP-only prevents JavaScript from reading the cookie (defeating XSS-based session theft). Secure ensures it is only sent over HTTPS. SameSite=Strict prevents cross-site request forgery.

Implement multi-factor authentication for all internal admin accounts and any account with access to sensitive data. Enforce it, do not make it optional. The 30-second friction of an authenticator app has prevented thousands of account takeovers.

### Injection Attacks

SQL injection remains one of the most exploited vulnerability classes despite being trivially preventable. Never concatenate user input into SQL queries. Always use parameterized queries or an ORM that handles parameterization automatically.

The same principle applies to:
- **Command injection**: never pass user input to shell commands
- **LDAP injection**: sanitize inputs to directory queries
- **NoSQL injection**: MongoDB's \`$where\` operator can execute arbitrary JavaScript — avoid it

### Access Control

Broken access control is the #1 vulnerability class in the OWASP Top 10. The pattern: your app correctly requires authentication (user must be logged in) but does not check authorization (does this user have permission to see this specific record?).

Example: \`GET /api/orders/7823\` returns an order. If the server does not verify that the requesting user owns order 7823, any authenticated user can access any order by changing the ID. This is called Insecure Direct Object Reference (IDOR).

The fix: every data access query should filter by the authenticated user's ID:
\`\`\`sql
SELECT * FROM orders WHERE id = ? AND user_id = current_user_id
\`\`\`

### Secrets Management

The most common source of catastrophic data breaches at startups: secrets in source code. A database URL with credentials pushed to a public GitHub repo triggers automated scrapers within seconds. The attacker has your data before you notice.

Rules:
- Secrets go in environment variables, never in source code
- Use \`.env\` files locally; add \`.env\` to \`.gitignore\` immediately
- Use a secrets manager (AWS Secrets Manager, Doppler, Vercel's environment variables) for production
- Rotate any secret that may have been exposed, immediately
- Audit your git history for leaked secrets before making a private repo public

### Dependency Security

Your application has hundreds of third-party dependencies. Any one of them could contain a known CVE (Common Vulnerabilities and Exposures). Running \`npm audit\` or \`pip-audit\` weekly identifies known vulnerabilities and their severity. Automate this with GitHub's Dependabot or Snyk, which open pull requests when vulnerable dependencies are detected.

The Log4Shell vulnerability (CVE-2021-44228) in the Apache Log4j library affected hundreds of thousands of applications because of how deep it sat in the dependency tree — many teams did not know they were using it. Knowing your dependency tree is a security responsibility.`,
    quiz: [
      {
        q: 'A login form builds its query as: "SELECT * FROM users WHERE email = \'" + userInput + "\'". An attacker enters email = \' OR \'1\'=\'1. What happens?',
        options: [
          'The query fails because the email format is invalid',
          'The query returns all rows in the users table, bypassing authentication',
          'The database blocks the query automatically due to injection detection',
          'The attacker gains access only to the first user in the table',
        ],
        correct: 1,
        explanation:
          'The injected value creates: SELECT * FROM users WHERE email = \'\' OR \'1\'=\'1\'. The condition \'1\'=\'1\' is always true, so the WHERE clause matches every row. The application receives the full users table, typically authenticating as the first row. Parameterized queries prevent this by treating input as data, never as SQL syntax.',
      },
      {
        q: 'Which cookie attribute prevents a JavaScript-based XSS attack from stealing a session token?',
        options: [
          'SameSite=Strict',
          'HttpOnly — it prevents JavaScript from accessing the cookie at all',
          'Secure — it encrypts the cookie value',
          'Domain=your-app.com',
        ],
        correct: 1,
        explanation:
          'HttpOnly tells the browser to never expose the cookie to JavaScript — it can only be sent in HTTP headers. Even if an attacker injects malicious JavaScript that runs on your page, document.cookie will not include HttpOnly cookies. This defeats the most common XSS session-theft pattern.',
      },
      {
        q: 'Your app authenticates users correctly but an authenticated user can access any other user\'s orders by changing the order ID in the URL. What vulnerability class is this?',
        options: [
          'SQL Injection',
          'Insecure Direct Object Reference (IDOR) — a broken access control vulnerability',
          'Cross-Site Request Forgery (CSRF)',
          'Broken Authentication',
        ],
        correct: 1,
        explanation:
          'IDOR occurs when an application uses user-controllable input to access objects without verifying that the requesting user is authorized for that specific object. The fix: always filter data access by the authenticated user\'s identity, not just by the requested object ID.',
      },
      {
        q: 'A developer accidentally commits a Stripe live API key to a public GitHub repository. What is the correct immediate response?',
        options: [
          'Delete the commit from git history and hope no one scraped it',
          'Immediately revoke and rotate the key in the Stripe dashboard, then audit for any unauthorized charges',
          'Make the repository private and email Stripe to inform them',
          'Change the repository visibility to private; the key is no longer accessible',
        ],
        correct: 1,
        explanation:
          'Automated bots scrape GitHub for secrets within seconds of a commit. Once a key is potentially exposed, assume it is compromised. Revoke it immediately in the provider\'s dashboard (Stripe, AWS, etc.). Then audit usage logs for unauthorized activity during the exposure window. Deleting commit history is secondary — the priority is invalidating the credential.',
      },
      {
        q: 'The Principle of Least Privilege applied to a read-only analytics microservice means:',
        options: [
          'The service should run on the cheapest available server',
          'The service\'s database credentials should allow only SELECT queries on the specific tables it needs — no INSERT, UPDATE, DELETE, or access to unrelated tables',
          'The service should only process data from users with read-only accounts',
          'The service should not have access to the internet',
        ],
        correct: 1,
        explanation:
          'If this service is compromised (via a vulnerability in its dependencies or a bug in its code), an attacker gains only the ability to read analytics data — they cannot modify the database or access other tables. Limiting the blast radius of a compromised component is the core value of least privilege.',
      },
    ],
  },
  {
    id: 'tch-m07',
    track: 'tech',
    title: 'Version Control & Deployment',
    subtitle: 'Git, CI/CD, branching strategies, and deploying without fear',
    level: 'PhD',
    xp: 170,
    duration: 15,
    module: 7,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Git',
        definition:
          'A distributed version control system that tracks changes to files over time, allows multiple contributors to work in parallel, and enables reverting to any previous state. Every Git repository contains the full history of every change ever made, stored as a directed acyclic graph of commit objects.',
      },
      {
        term: 'CI/CD (Continuous Integration / Continuous Deployment)',
        definition:
          'CI is the practice of automatically running tests every time code is pushed to a shared branch, catching regressions before they reach production. CD is the automatic deployment of passing code to production without manual intervention. Together, they reduce the time between writing code and it running for users from days to minutes.',
      },
      {
        term: 'Branch Protection Rules',
        definition:
          'Repository settings that prevent direct pushes to critical branches (main, production) and require pull requests, passing CI checks, and code review approvals before merging. Branch protection rules enforce process at the infrastructure level rather than relying on team discipline.',
      },
      {
        term: 'Blue-Green Deployment',
        definition:
          'A zero-downtime deployment strategy that maintains two identical production environments (blue=current, green=new). Traffic is shifted to green only after it passes health checks. If green fails, traffic reverts to blue in seconds. The cost: you run double the infrastructure during the transition.',
      },
      {
        term: 'Git Rebase vs. Merge',
        definition:
          'Merge creates a merge commit that combines two branches, preserving their full history. Rebase replays your commits on top of the target branch, creating a linear history. Rebase produces cleaner logs but rewrites commit hashes — never rebase shared branches that others have based work on.',
      },
    ],
    content: `## Version Control & Deployment

The difference between a team that ships features confidently and one that fears every deployment comes down to process: how they manage code changes, how they test them, and how they move them to production. Git and CI/CD are the infrastructure of that process.

### Git Mental Model

Git tracks content, not files. Every commit is a snapshot of your entire repository at a point in time, identified by a SHA-1 hash. Commits form a graph — each commit points to its parent(s). Branches are just named pointers to commits.

The three key operations:
- **commit**: save a snapshot of staged changes with a message
- **merge**: join two branch histories together
- **rebase**: rewrite your commits as if they started from a different base

Understanding that branches are pointers (not copies of files) explains why creating, switching, and deleting branches is instantaneous regardless of how much code is in the repository.

### Branching Strategy

Small teams (1–5 engineers) can use GitHub Flow: main is always deployable, every feature is developed on a branch, merged via pull request, and deployed immediately. This is simple and fast.

Larger teams with separate staging and production environments use GitFlow or trunk-based development:
- **Trunk-based**: everyone merges to main (trunk) at least daily, using feature flags to hide incomplete features from users. Requires strong CI and feature flag infrastructure.
- **GitFlow**: separate branches for features, release candidates, and hotfixes. More process, more merge conflicts, but clearer release control.

The most common mistake: letting feature branches live for weeks. Long-lived branches accumulate divergence from main, and merging them becomes a painful, conflict-ridden exercise. Branches should live for hours to days, not weeks.

### Pull Request Discipline

A pull request (PR) is not just a code review — it is documentation of why a change was made. Good PRs:
- Are focused on one thing (do not fix three bugs and add a feature in one PR)
- Include a description of the problem, the solution, and how to test it
- Reference the issue or ticket they address
- Have passing CI checks before requesting review
- Are small enough to review in under 30 minutes

Reviewers should look for: correctness, security implications, performance implications, test coverage, and adherence to team conventions. Not just style.

### CI/CD Pipeline Design

A typical pipeline for a Next.js application:

1. **Trigger**: push to any branch or merge to main
2. **Install**: \`npm ci\` (reproducible install from lockfile)
3. **Lint**: ESLint checks code style and catches common bugs
4. **Type check**: \`tsc --noEmit\` catches TypeScript errors without emitting files
5. **Unit tests**: fast tests that do not require external services
6. **Build**: \`next build\` verifies the app compiles
7. **Integration tests**: tests that run against a test database
8. **Deploy to preview**: every PR gets a unique preview URL (Vercel does this automatically)
9. **On merge to main**: deploy to production

The goal is a pipeline that runs in under 5 minutes. If CI takes 20 minutes, developers stop waiting for it and start merging without confirmation. Speed is a feature of your CI system.

### Deployment Strategies

**Rolling deploy**: replace instances one at a time. At any moment during the deploy, some instances run the old version and some run the new version. Simple but means your app must be backward-compatible during the transition.

**Blue-green deploy**: run old and new in parallel, switch traffic atomically. No mixed-version period, but requires double the infrastructure during transition.

**Canary release**: send 5% of traffic to the new version, monitor error rates and latency, then gradually increase to 100%. Limits blast radius if the new version has a bug. Requires robust monitoring to work well.

### Rollback Planning

Every deployment should have a rollback plan. For Vercel, reverting to the previous deployment takes one click. For database changes, rollback is harder: if your deployment includes a migration that adds a column, rolling back means deciding what to do with data written to that column. This is why database migrations should be backward-compatible — add columns before removing old ones, never rename columns in a single step.

The practice of deploying at 4 PM on a Friday is considered harmful not because deployments are inherently risky, but because your team's ability to respond to an incident decreases over a weekend. With strong CI/CD and monitoring, any time is fine — but teams without those guardrails should deploy when support is available.`,
    quiz: [
      {
        q: 'Why are long-lived feature branches (lasting 2+ weeks) considered a risk?',
        options: [
          'Git cannot handle branches older than 14 days',
          'The branch accumulates significant divergence from main, making the eventual merge conflict-heavy and increasing the risk of regressions',
          'Long-lived branches consume extra server storage',
          'CI pipelines cannot run against branches older than the most recent tag',
        ],
        correct: 1,
        explanation:
          'While a feature branch is open, main continues to evolve. The longer the branch lives, the more it diverges. Merging a 3-week-old branch into a changed main is error-prone and hard to review. Trunk-based development with feature flags solves this by merging small increments daily.',
      },
      {
        q: 'What is the primary risk of running database migrations as part of a rolling deployment?',
        options: [
          'Rolling deployments do not support database migrations at all',
          'During the transition, old-version instances may fail to handle data written by new-version instances if the migration is not backward-compatible',
          'Migrations automatically revert if the deployment fails',
          'The migration runs before the code is deployed, causing a window where no code is running',
        ],
        correct: 1,
        explanation:
          'During a rolling deploy, old and new code run simultaneously. If the new code writes to a new column that old code does not know about, old instances may error or corrupt data. The solution: expand-contract migrations — add the new column and make both versions work with it before removing the old column in a subsequent deploy.',
      },
      {
        q: 'A CI pipeline takes 25 minutes to run. What behavior does this most likely cause among developers?',
        options: [
          'Developers write more thorough tests to justify the wait time',
          'Developers merge code without waiting for CI to pass, defeating the purpose of the pipeline',
          'The team adopts a faster framework to reduce build time',
          'Developers run CI locally before pushing to avoid the wait',
        ],
        correct: 1,
        explanation:
          'The 5-minute rule of thumb for CI exists for this reason. When feedback loops are slow, humans find shortcuts. A 25-minute pipeline is one that developers will learn to ignore, merge around, or push to "fix later." CI speed is a forcing function for developer compliance.',
      },
      {
        q: 'What distinguishes a canary release from a blue-green deployment?',
        options: [
          'Canary releases use a separate database; blue-green uses the same one',
          'Canary sends a small percentage of traffic to the new version and gradually increases it; blue-green switches all traffic atomically',
          'Blue-green is for frontend deployments only; canary is for backend services',
          'Canary releases require feature flags; blue-green does not',
        ],
        correct: 1,
        explanation:
          'Canary releases are graduated — 1%, 5%, 25%, 100% — allowing real-traffic validation with limited blast radius. Blue-green is binary — 0% or 100% on the new version. Canary is better when you are uncertain about production behavior; blue-green is better when you want instant rollback capability.',
      },
      {
        q: 'Why should you never force-push (git push --force) to a shared branch like main?',
        options: [
          'Force push is blocked by GitHub and GitLab on all plans',
          'Force push rewrites the branch\'s commit history, making any commits your teammates based work on unreachable and potentially causing them to lose work',
          'Force push triggers a full re-run of all CI jobs across the organization',
          'Force push removes branch protection rules permanently',
        ],
        correct: 1,
        explanation:
          'When you force push, you replace the remote branch\'s history with yours. Any commits on the remote that are not in your local branch are lost. Teammates who have pulled the old history will see divergence errors and may accidentally re-introduce the commits you removed. Force push on shared branches is one of the most disruptive things an engineer can do.',
      },
    ],
  },
  {
    id: 'tch-m08',
    track: 'tech',
    title: 'System Design',
    subtitle: 'How to architect products that scale past your first 10,000 users',
    level: 'PhD',
    xp: 185,
    duration: 19,
    module: 8,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Horizontal vs. Vertical Scaling',
        definition:
          'Vertical scaling adds more resources (CPU, RAM) to a single server — it has a hard ceiling at the most powerful hardware available. Horizontal scaling adds more servers and distributes load across them — it is theoretically limitless but requires stateless architecture since any request can hit any server.',
      },
      {
        term: 'Load Balancer',
        definition:
          'A component that distributes incoming requests across multiple application servers according to a routing algorithm (round-robin, least connections, IP hash). A load balancer is the entry point that makes horizontal scaling transparent to clients.',
      },
      {
        term: 'Message Queue',
        definition:
          'An asynchronous communication channel where a producer adds tasks and a consumer processes them independently. Queues decouple request handling from background processing — an API request returns immediately after enqueuing a job, while a worker processes it seconds or minutes later. RabbitMQ, SQS, and BullMQ are common implementations.',
      },
      {
        term: 'Database Sharding',
        definition:
          'Horizontal partitioning of a database across multiple servers, where each shard holds a subset of the data. A user table sharded by user_id range might put users 1–1M on shard 1 and users 1M–2M on shard 2. Sharding enables write scale beyond a single database server but adds enormous operational complexity.',
      },
      {
        term: 'SLA / SLO / SLI',
        definition:
          'Service Level Agreement (SLA): the contractual commitment to uptime and performance (99.9% uptime = 8.7 hours downtime/year). Service Level Objective (SLO): the internal target stricter than the SLA. Service Level Indicator (SLI): the actual measured metric (p99 latency, error rate). Google\'s SRE book defines this hierarchy as the foundation of production reliability.',
      },
    ],
    content: `## System Design

System design is the discipline of making architectural decisions that allow a product to handle growing load without rewriting it from scratch. The best-designed systems are not the most complex — they are the ones that are simple enough to operate and extend as requirements change.

### The Scaling Journey

Most products follow a predictable scaling path:

**Phase 1 (0–1,000 users)**: Single server, single database. All traffic hits one machine. Cost: $20–100/month. This is correct. Do not over-engineer early.

**Phase 2 (1,000–10,000 users)**: Vertical scaling (larger server), add a read replica to offload analytical queries, add a CDN for static assets. Cost: $100–500/month.

**Phase 3 (10,000–100,000 users)**: Horizontal scaling with a load balancer in front of multiple application servers. Add a caching layer (Redis). Move file storage to object storage (S3). Separate background jobs to dedicated workers.

**Phase 4 (100,000+ users)**: Database sharding or read replicas for specific tables, microservices for high-load components, message queues for async work, global CDN for content delivery.

The trap is designing for Phase 4 when you have 500 users. Netflix, Uber, and Amazon\'s architectures are the result of years of evolution under production traffic — not upfront design decisions.

### Stateless Architecture

The prerequisite for horizontal scaling is stateless application servers. If your server stores session data in memory, every user must be routed to the same server on every request. With two servers, user A's session is on Server 1, so if Server 2 handles A's next request, it cannot find the session.

The fix: store state outside the servers. Sessions go in Redis. Uploaded files go in S3. Any state that must persist beyond a single request lives in an external data store, not in server memory.

### Caching Strategy

Cache invalidation is famously one of the two hard problems in computer science. The strategy:

**Cache what is expensive and frequently read**: database query results, rendered HTML fragments, third-party API responses. The cache is a solved set of the most common queries so the database only handles the long tail.

**Cache at the right layer**:
- CDN caches static assets and full page HTML at the network edge (closest to users)
- Application cache (Redis) caches computed values shared across requests
- Database query cache (automatic in some databases) caches query plans and results

**Cache invalidation strategies**:
- TTL (Time-to-Live): cache expires after N seconds automatically. Simple but may serve stale data.
- Write-through: update the cache every time you update the source. No stale data, more write complexity.
- Event-driven: invalidate specific cache keys when the underlying data changes.

### Async Processing with Queues

Synchronous operations that take more than ~200ms hurt user experience. If a user uploads a photo and must wait 8 seconds while your server resizes it to 5 dimensions, the UX is poor. The pattern: accept the upload immediately, return a response, and enqueue the resizing job for a background worker.

Message queues (BullMQ with Redis, AWS SQS) enable this decoupling. The API server is the producer; background workers are consumers. Workers can be scaled independently — if image processing is the bottleneck, add more worker instances without touching the API servers.

Queues also provide retry semantics: if a worker crashes mid-job, the job returns to the queue and another worker picks it up. This gives you at-least-once processing guarantees.

### Microservices vs. Monolith

The default for new products should be a monolith — one codebase, one deployment, one database. Microservices introduce distributed systems complexity (network latency between services, distributed transactions, independent deployment pipelines) that is a maintenance burden for small teams.

The right time to extract a microservice: when a specific component has different scaling requirements than the rest of the system (e.g., your ML inference service needs GPUs while your CRUD API needs only CPU), or when different teams need to deploy independently.

Amazon famously started as a monolith. Their "two-pizza team" microservices architecture emerged after years of growth, not as an upfront design choice.

### Monitoring and Observability

You cannot improve what you cannot see. Production monitoring requires three pillars:
- **Metrics**: numerical measurements over time (request rate, error rate, p50/p95/p99 latency, database connection count). Tool: Datadog, Grafana, or Vercel Analytics.
- **Logs**: structured text records of events (request logs, error logs, audit logs). Tool: Logtail, Papertrail, AWS CloudWatch.
- **Traces**: end-to-end tracking of a request through every component it touches, with timing for each step. Tool: Jaeger, Datadog APM. Traces tell you where in your stack a slow request is spending its time.`,
    quiz: [
      {
        q: 'Your application stores user sessions in server memory. You add a second application server to handle traffic. What breaks?',
        options: [
          'The database becomes a bottleneck',
          'Users whose sessions are on Server 1 get logged out if the load balancer sends their next request to Server 2',
          'The second server cannot access the same codebase',
          'Sessions stored in memory are automatically replicated between servers',
        ],
        correct: 1,
        explanation:
          'In-memory sessions are local to the server process that created them. With two servers behind a load balancer, a user\'s request can land on either. If their session is on Server 1 and Server 2 handles the next request, it sees no session and treats the user as logged out. Sessions must be externalized to Redis or a database.',
      },
      {
        q: 'A photo upload endpoint makes users wait 12 seconds while the server resizes images to 6 different dimensions. Which pattern best addresses this?',
        options: [
          'Increase the server\'s CPU allocation to resize faster',
          'Accept the upload, store the original, return a 202 Accepted immediately, and enqueue a resize job for background workers',
          'Pre-generate all possible image dimensions when users register',
          'Use a CDN to resize images at delivery time',
        ],
        correct: 1,
        explanation:
          'HTTP 202 Accepted communicates "I received your request and will process it." The user gets a response in milliseconds; workers handle the compute-heavy resizing asynchronously. This is the correct pattern for any operation that takes more than ~500ms.',
      },
      {
        q: 'What is the primary reason to avoid building a microservices architecture at the start of a new product?',
        options: [
          'Microservices require a minimum of 10 engineers to operate',
          'Microservices introduce distributed systems complexity (network calls between services, distributed transactions, independent deployments) that slows a small team\'s velocity without commensurate benefit at low scale',
          'Microservices are not compatible with cloud hosting',
          'A monolith is faster to execute at all scales',
        ],
        correct: 1,
        explanation:
          'Distributed systems are fundamentally harder to reason about and operate than monoliths. Every service-to-service call adds latency and a potential failure point. For teams of fewer than ~20 engineers, a well-structured monolith almost always ships faster and has fewer production incidents than an equivalent microservices architecture.',
      },
      {
        q: 'Write-through cache invalidation means:',
        options: [
          'The cache is only populated when a user first requests the data (on cache miss)',
          'Every time the underlying data is written, the cache is updated simultaneously — ensuring the cache is never stale',
          'The cache writes data to the database instead of the application',
          'Cache entries expire after a fixed time-to-live',
        ],
        correct: 1,
        explanation:
          'Write-through ensures cache consistency at the cost of write complexity. When you update a record, you update both the database and the cache atomically. This eliminates stale reads but requires that all write paths update the cache — a single missed path creates an inconsistency that is hard to diagnose.',
      },
      {
        q: 'P99 latency of 3.2 seconds on your API means:',
        options: [
          '99% of requests take more than 3.2 seconds',
          '1% of requests take 3.2 seconds or more — these are the slowest requests in your distribution, often caused by database query outliers or garbage collection pauses',
          '3.2 seconds is your average response time across all endpoints',
          '99% of requests take exactly 3.2 seconds',
        ],
        correct: 1,
        explanation:
          'Percentile latency (p50, p95, p99) is more informative than averages for user experience. P99 of 3.2s means 1 in 100 requests feels very slow to a user. At 100 requests per second, that is 1 slow response per second. P99 often reveals the impact of shared resources (database locks, GC pauses) that averages obscure.',
      },
    ],
  },
  {
    id: 'tch-m09',
    track: 'tech',
    title: 'AI Agents & Autonomous Systems',
    subtitle: 'Building multi-step AI workflows that act, decide, and recover',
    level: 'PhD',
    xp: 195,
    duration: 20,
    module: 9,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'AI Agent',
        definition:
          'A software system in which a language model can select and invoke tools (web search, code execution, API calls, file I/O) based on its reasoning, observe the results, and use those results to decide the next action — repeating this loop until a goal is achieved or a termination condition is met.',
      },
      {
        term: 'ReAct Pattern (Reason + Act)',
        definition:
          'An agent prompting framework (Yao et al., 2022) that interleaves reasoning traces and actions: the model first writes a "Thought" explaining its plan, then an "Action" specifying the tool to use, then observes the result, then reasons about what to do next. This pattern significantly reduces errors compared to action-only agents.',
      },
      {
        term: 'Tool Calling',
        definition:
          'The capability of a language model to output structured JSON specifying a function name and arguments, which the surrounding framework executes and returns to the model as an observation. Tool calling is the mechanism that allows LLMs to interact with the world beyond text generation.',
      },
      {
        term: 'Multi-Agent System',
        definition:
          'An architecture in which multiple specialized AI agents collaborate on a task — an orchestrator agent decomposes a goal into subtasks and delegates to specialist agents (researcher, coder, reviewer). Each specialist operates within its domain; the orchestrator integrates their outputs.',
      },
      {
        term: 'Guardrails',
        definition:
          'Programmatic constraints that limit what an autonomous agent can do — input validation that catches harmful prompts before they reach the model, output validation that checks model responses before they are acted on, and hard restrictions on destructive operations (delete, purchase, send email) that require human confirmation.',
      },
    ],
    content: `## AI Agents & Autonomous Systems

The first generation of AI products were chatbots: a user sends a message, the model generates a response. The current generation is agents: the model can take actions in the world — search the web, write and run code, call APIs, create files, send messages — and iterate toward a goal without step-by-step human instruction.

### What Makes an Agent Different from a Chatbot

A chatbot responds. An agent acts. The technical difference: an agent has access to tools it can invoke, and it runs in a loop — acting, observing results, re-planning, acting again — rather than generating a single response per user turn.

The loop structure:
1. Receive goal or task
2. Reason about what to do next
3. Select and invoke a tool
4. Observe the tool's output
5. Update mental state based on observation
6. Repeat from step 2, or terminate if goal is achieved

The language model is the reasoning engine. The surrounding framework (LangChain, LlamaIndex, Anthropic's Claude SDK, OpenAI's Assistants API) provides the loop, tool management, and memory.

### The ReAct Pattern in Practice

Without structure, agents make poor sequential decisions — they jump to conclusions or take actions without sufficient reasoning. The ReAct pattern forces the model to externalize its reasoning before each action.

In practice, a ReAct agent produces interleaved output:
- **Thought**: "The user wants a summary of the Q3 earnings call. I should first search for the transcript."
- **Action**: search("AAPL Q3 2024 earnings call transcript")
- **Observation**: [transcript text returned]
- **Thought**: "I have the transcript. The user wants key highlights. I'll extract revenue, guidance, and notable executive comments."
- **Action**: extract_key_points(text=transcript, topics=["revenue", "guidance", "executive comments"])
- **Observation**: [structured highlights returned]
- **Answer**: [formatted summary delivered to user]

Each Thought-Action-Observation cycle is visible in logs, making agent behavior debuggable — a critical property when things go wrong.

### Tool Design for Agents

The tools you give an agent define what it can accomplish. Tool design principles:

**Scope tools narrowly**: a \`send_email\` tool is better than a \`manage_communications\` tool because it is predictable and auditable. Broad tools have unpredictable side effects.

**Make tools reversible where possible**: prefer \`create_draft\` over \`send_email\` for operations where human review adds value. Irreversible actions (delete, charge, deploy to production) should have confirmation requirements.

**Return rich observations**: a tool that returns only "success" gives the agent no information to work with. Return the full result — the created object, the query results, the file content — so the agent can reason about whether it achieved the intended effect.

**Handle errors gracefully**: tools should return structured error information, not raise exceptions. "User not found" vs. a stack trace. The agent needs to understand what went wrong to decide whether to retry, try an alternative approach, or report failure to the user.

### Multi-Agent Patterns

Complex tasks benefit from specialization. A research task might involve:
- **Orchestrator agent**: receives the goal, plans subtasks, delegates, integrates outputs
- **Researcher agent**: web search, source evaluation, note-taking
- **Writer agent**: transforms notes into a coherent document
- **Reviewer agent**: checks for factual accuracy and logical consistency

Communication between agents happens via shared memory (a database or vector store) or direct message passing. The orchestrator holds the task state and knows which subtasks are complete.

This pattern mirrors how human organizations work — a manager with specialists. It also has similar failure modes: poor task decomposition, misaligned specialist outputs, integration problems at the handoff.

### Production Reliability Challenges

Agents are harder to test and operate than CRUD APIs because their behavior is non-deterministic and their failure modes are novel:

**Infinite loops**: an agent that cannot complete a task may loop indefinitely. Always implement a maximum step count.

**Hallucinated tool calls**: LLMs occasionally generate tool invocations with wrong argument types or non-existent tool names. Validate all tool calls against their schemas before executing.

**Cascading errors**: a wrong action in step 3 leads to a plausible but incorrect observation in step 4, which leads the agent confidently down a wrong path. This is "confident wrongness" and is specific to AI systems.

**Cost overruns**: each step in an agent loop makes an API call. A 20-step agent processing 10,000 tasks/month at \$0.01/call costs \$2,000/month. Budget per agent run and alert when agents exceed expected step counts.

Guardrails are not optional in production: validate every input before it reaches the model, validate every tool call before it executes, and require human confirmation before any irreversible action.`,
    quiz: [
      {
        q: 'What fundamental capability distinguishes an AI agent from a standard chatbot?',
        options: [
          'Agents use larger language models with more parameters',
          'Agents can invoke tools to take actions in the world and iterate in a loop until a goal is achieved, rather than generating a single response',
          'Agents have access to the user\'s personal data by default',
          'Agents respond faster because they do not generate intermediate reasoning',
        ],
        correct: 1,
        explanation:
          'The defining characteristic of an agent is the action loop: reason → act (call a tool) → observe result → re-plan. A chatbot generates text in one pass. An agent can search the web, run code, call APIs, create files, and revise its approach based on what it observes — all autonomously.',
      },
      {
        q: 'Why does the ReAct pattern improve agent reliability compared to action-only agents?',
        options: [
          'It reduces the number of tool calls, lowering API costs',
          'Externalizing reasoning in "Thought" steps forces the model to plan before acting, reducing impulsive wrong actions and making failures debuggable',
          'It allows the agent to run multiple tools simultaneously',
          'ReAct agents do not require system prompts',
        ],
        correct: 1,
        explanation:
          'When reasoning is explicit, you can read the logs and see exactly where the agent\'s logic went wrong. It also causes the model to catch planning errors before committing to an action. Yao et al. showed ReAct outperforms action-only agents on HotpotQA and Fever benchmarks by 6–15%.',
      },
      {
        q: 'An agent processing expense reports is given a tool called manage_finances(). Why is this poor tool design?',
        options: [
          'Tool names should not contain underscores',
          'The tool is too broad — it is unpredictable what it might do, making the agent\'s behavior hard to audit and creating risk of unintended financial actions',
          'Tools should only accept string arguments',
          'A single tool cannot handle both reading and writing operations',
        ],
        correct: 1,
        explanation:
          'Broad tools give agents broad authority. Better design: get_expense_report(id), update_expense_status(id, status), request_reimbursement(id, amount). Each tool does one thing, its effect is predictable, and an audit log of tool calls tells a complete story of what the agent did.',
      },
      {
        q: 'What is the most important safety guardrail for an agent that can send emails on the user\'s behalf?',
        options: [
          'Limit the agent to sending a maximum of 10 emails per day',
          'Route all emails through a draft/review step that requires human confirmation before sending, since sending is irreversible',
          'Require the agent to copy the user on all outbound emails',
          'Use a read-only email API that does not support sending',
        ],
        correct: 1,
        explanation:
          'Irreversible actions (send, delete, charge, deploy) should require a confirmation gate in production agents. An agent that sends a poorly-worded email to 500 clients has caused real damage that cannot be undone. The pattern: create_draft → show_to_user → user_confirms → send.',
      },
      {
        q: 'An agent is expected to complete tasks in 5 steps on average. At 10,000 runs/month with an API cost of $0.02/step, what is the monthly API cost, and what metric should trigger an alert?',
        options: [
          '$1,000/month; alert when any single run exceeds 10 steps',
          '$200/month; alert when any single run exceeds 10 steps',
          '$1,000/month; alert when average steps across all runs exceeds 7',
          '$200/month; alert when total monthly cost exceeds $250',
        ],
        correct: 0,
        explanation:
          '10,000 runs × 5 steps × $0.02/step = $1,000/month. Alert when individual runs exceed 2× the expected step count (10 steps) — this catches infinite loops and stuck agents before they exhaust your budget. Also monitor total monthly spend with a hard cap to prevent runaway costs.',
      },
    ],
  },
  {
    id: 'tch-m10',
    track: 'tech',
    title: 'Mobile Apps',
    subtitle: 'How apps are built, what React Native vs native means, and when each matters',
    level: 'PhD',
    xp: 172,
    duration: 16,
    module: 10,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Native App',
        definition:
          'An application built using the platform\'s primary programming language and SDK — Swift/SwiftUI for iOS, Kotlin/Jetpack Compose for Android. Native apps have direct access to all platform APIs, achieve the best performance and animation fidelity, and integrate most naturally with OS-level features like widgets, Siri, and live activities.',
      },
      {
        term: 'React Native',
        definition:
          'A framework (Meta, 2015) that allows writing mobile applications in JavaScript/TypeScript using React. The New Architecture (introduced 2023) compiles JavaScript to native components via JSI (JavaScript Interface), eliminating the asynchronous bridge that caused performance problems in older versions. One codebase ships to both iOS and Android.',
      },
      {
        term: 'JavaScript Interface (JSI)',
        definition:
          'React Native\'s New Architecture mechanism that allows JavaScript to call native code synchronously rather than through an asynchronous message queue. JSI eliminates the serialization/deserialization overhead of the old bridge, enabling React Native apps to approach native rendering performance.',
      },
      {
        term: 'App Store Review',
        definition:
          'Apple\'s mandatory review process for every iOS app submission, typically taking 24–72 hours. Apple\'s guidelines cover content, privacy (required privacy manifest and usage descriptions for all APIs that access user data), payment (30% commission on in-app purchases), and technical requirements. Rejection delays can be 1–3 weeks for complex issues.',
      },
      {
        term: 'Over-the-Air (OTA) Update',
        definition:
          'The ability to push JavaScript bundle updates to a React Native app without submitting a new build to the App Store. Tools like CodePush (Microsoft) or EAS Update deliver updated JS bundles to installed apps, allowing bug fixes to reach users in minutes rather than days. OTA updates cannot change native code or add new native dependencies.',
      },
    ],
    content: `## Mobile Apps

There are 3.5 billion smartphone users and two dominant app distribution platforms with combined revenues exceeding $150 billion. Understanding how mobile apps are built, distributed, and monetized is essential for any technology leader — whether you are buying development services, managing a team, or evaluating a product.

### The Mobile Landscape

iOS and Android represent 99% of the global smartphone market. iOS users monetize at 2–3x the rate of Android users in North America and Europe. Android dominates in emerging markets. For most B2C products targeting North American consumers, iOS is the higher-priority platform.

The two fundamentally different ways to build for mobile:

**Native development**: write platform-specific code (Swift for iOS, Kotlin for Android). You get maximum performance, complete access to all platform APIs, and native UI components that behave exactly as users expect. You also maintain two separate codebases, which roughly doubles engineering effort.

**Cross-platform development**: write code once and compile/render to both platforms. React Native and Flutter are the dominant options. You trade some platform fidelity and performance ceiling for dramatically reduced development cost.

### React Native in Depth

React Native renders actual native UI components — it does not use a WebView. When you write \`<View>\`, it creates a UIView on iOS and android.view.View on Android. This is fundamentally different from hybrid apps (Cordova, Ionic) that render HTML inside a WebView.

The original React Native architecture had a JavaScript bridge: JS and native ran on separate threads and communicated via a JSON-serialized message queue. This was asynchronous, adding latency to every native interaction and causing the "janky" animations that gave React Native a poor performance reputation.

The New Architecture (stable in 2024) replaces the bridge with JSI (JavaScript Interface), which allows synchronous direct calls between JS and native code. Combined with Fabric (the new rendering engine) and TurboModules (lazy-loaded native modules), React Native apps built on the New Architecture achieve performance that is within ~10–15% of native for most use cases.

### When to Choose Native vs. React Native

**Choose native (Swift/Kotlin) when**:
- The app is animation-heavy (games, advanced transitions, real-time graphics)
- You need access to bleeding-edge platform APIs (new iOS features available months before React Native supports them)
- The team is already native-proficient and cross-platform code sharing is not a priority
- Apple Watch, widgets, and live activities are core features (React Native support is limited)

**Choose React Native when**:
- You want one team and one codebase for iOS and Android
- Your team is already proficient in JavaScript/TypeScript
- The app is primarily data-driven (forms, lists, CRUD operations)
- Shipping speed is critical and you cannot staff two native teams
- Web code sharing (React components) is valuable

**Choose Flutter when**:
- You want pixel-perfect custom UI that looks identical on both platforms (Flutter renders to a custom canvas, not native components)
- The team is comfortable with Dart
- Web + mobile + desktop from a single codebase is a requirement

### The App Distribution Model

**iOS**: all apps must be distributed through the App Store (sideloading is restricted to Enterprise accounts and select EU markets under DMA compliance). Apple takes 30% of in-app purchase revenue (15% for businesses with less than $1M/year in Apple-ecosystem revenue). Apple's review is mandatory and takes 24–72 hours per submission.

**Android**: Google Play is the primary distribution channel, but Android supports sideloading (installing APKs directly). Google takes 15% of the first $1M in annual Play-mediated revenue, then 30%. Play review takes 1–5 days.

### Performance Profiling

Mobile app performance problems fall into three categories:
- **Rendering**: too many re-renders, missing memoization, heavy components in scroll lists. In React Native, FlatList with \`keyExtractor\` and \`getItemLayout\` is mandatory for smooth performance on large lists.
- **JS thread blocking**: heavy computation on the main JS thread blocks UI updates. Move to a background thread using \`InteractionManager\` or web workers (in new arch).
- **Network**: slow API responses causing blank states. Implement optimistic updates (update UI immediately, confirm in background) and skeleton loading states to mask latency.

### Offline-First Design

Mobile users lose network connectivity. Your app's behavior during network loss defines user experience quality. Offline-first apps:
- Cache critical data locally (SQLite via react-native-mmkv or WatermelonDB)
- Queue actions taken offline and sync when connectivity returns
- Surface clear, non-alarming UI for offline states
- Handle sync conflicts (user edited on mobile and web simultaneously) with a defined resolution strategy`,
    quiz: [
      {
        q: 'What is the key technical difference between React Native and a hybrid app like Cordova?',
        options: [
          'React Native requires Expo; Cordova does not',
          'React Native renders actual native UI components; Cordova renders HTML in a WebView inside a native shell',
          'Cordova supports both iOS and Android; React Native is iOS-only',
          'React Native requires TypeScript; Cordova uses JavaScript only',
        ],
        correct: 1,
        explanation:
          'This distinction matters for performance and UX. Cordova\'s WebView renders web content — you see a browser inside your app, with web scrolling behavior and rendering. React Native\'s \`<ScrollView>\` renders as a native UIScrollView — it has native momentum, haptics, and OS-integrated behavior.',
      },
      {
        q: 'What problem did React Native\'s New Architecture (JSI) solve compared to the original bridge?',
        options: [
          'The old bridge could not support TypeScript',
          'The old bridge used an asynchronous JSON message queue between JS and native threads, causing latency on every native interaction. JSI enables synchronous direct calls.',
          'The new architecture adds support for Android tablets',
          'JSI eliminates the need for a JavaScript engine on the device',
        ],
        correct: 1,
        explanation:
          'Every native API call through the old bridge required serializing arguments to JSON, posting to a queue, deserializing on the native side, executing, serializing the result, and posting back. This async round-trip was 16ms minimum — an entire frame at 60fps. JSI makes these calls synchronous and eliminates serialization overhead.',
      },
      {
        q: 'An OTA update via EAS Update can deliver which types of changes without App Store review?',
        options: [
          'Any code change, including new native dependencies',
          'JavaScript/TypeScript logic and UI changes only — not changes to native code, native modules, or app permissions',
          'Both JavaScript and native code changes as long as they do not affect UI',
          'All changes except new in-app purchase products',
        ],
        correct: 1,
        explanation:
          'OTA updates push a new JavaScript bundle to the installed app. This covers React component changes, business logic, API endpoint updates, and styling. They cannot update native code (Swift, Kotlin, Objective-C), add new native modules, or change the app\'s permission requirements — those require a new binary submission.',
      },
      {
        q: 'A product renders a list of 5,000 items using ScrollView instead of FlatList. What is the likely performance impact?',
        options: [
          'No impact — ScrollView and FlatList have identical performance characteristics',
          'ScrollView renders all 5,000 items simultaneously, consuming large amounts of memory and causing slow initial render. FlatList virtualizes the list, rendering only visible items.',
          'FlatList is slower because it needs to calculate item positions dynamically',
          'ScrollView is recommended for lists over 1,000 items because of its simpler API',
        ],
        correct: 1,
        explanation:
          'React Native\'s ScrollView renders its entire content tree at mount time. 5,000 list items means 5,000 native views in memory simultaneously, which causes slow initial render, high memory usage, and janky scrolling. FlatList virtualizes: it renders only ~10–20 visible items, recycling views as the user scrolls.',
      },
      {
        q: 'Apple takes 30% of in-app purchase revenue. A developer with $800K in annual App Store revenue pays what effective rate?',
        options: [
          '30% — $240,000',
          '15% — $120,000, because the Small Business Program applies to developers earning under $1M/year',
          '15% on the first $1M; $800K falls entirely in the 15% tier — $120,000',
          '0% — Apple\'s commission only applies to App Store games',
        ],
        correct: 2,
        explanation:
          'Apple\'s App Store Small Business Program charges 15% on the first $1M in annual developer revenue (not per-app). A developer earning $800K pays 15% = $120,000. Crossing $1M moves all subsequent revenue to 30% for that calendar year. This is why some developers intentionally stay under the $1M threshold.',
      },
    ],
  },
  {
    id: 'tch-m11',
    track: 'tech',
    title: 'Cloud Infrastructure',
    subtitle: 'Servers, CDNs, edge computing, and what "serverless" actually means',
    level: 'Next-Gen AI',
    xp: 190,
    duration: 18,
    module: 11,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Virtual Machine (VM)',
        definition:
          'An emulated computer running as software on a physical host, with its own OS, CPU allocation, RAM, and storage. VMs are fully isolated, boot in 30–60 seconds, and are billed per hour whether idle or loaded. AWS EC2, Google Compute Engine, and Hetzner VPS are VM-based products.',
      },
      {
        term: 'Container (Docker)',
        definition:
          'A lightweight isolated process that packages application code with its runtime dependencies but shares the host OS kernel — unlike a VM which emulates an entire computer. Containers start in milliseconds rather than seconds, are portable across any Docker-compatible host, and can run hundreds per machine where VMs max at dozens.',
      },
      {
        term: 'CDN (Content Delivery Network)',
        definition:
          'A globally distributed network of servers ("points of presence") that cache and serve static assets from nodes geographically near end users. A CDN cuts time-to-first-byte for static content from hundreds of milliseconds (origin server round-trip) to single-digit milliseconds (local edge cache hit).',
      },
      {
        term: 'Serverless Function',
        definition:
          'A single-purpose function that runs on demand in a managed cloud environment — no server provisioning required. The cloud provider scales from zero to thousands of concurrent invocations automatically, and you are billed per invocation and execution duration rather than per hour. Cold starts (50–400ms) are the primary latency risk.',
      },
      {
        term: 'Infrastructure as Code (IaC)',
        definition:
          'The practice of defining and provisioning cloud infrastructure through machine-readable configuration files rather than manual console clicks. Terraform, Pulumi, and AWS CloudFormation are IaC tools. IaC makes infrastructure version-controlled, reproducible, and auditable — you can recreate your entire production environment from a repository.',
      },
    ],
    content: `## Cloud Infrastructure

Modern software does not run on hardware you own — it runs on compute, storage, and networking resources rented from cloud providers on demand. Understanding cloud infrastructure means understanding what you are paying for, how to architect for reliability and cost efficiency, and what trade-offs the new abstractions (containers, serverless, edge) make.

### The Cloud Provider Landscape

Three hyperscalers dominate: AWS (~33% market share), Azure (~23%), and Google Cloud (~11%). The remainder is split among Cloudflare Workers, Vercel, Railway, Render, and regional providers.

For most product companies, the practical choice is:
- **AWS**: maximum service breadth, best for teams with dedicated DevOps. Higher complexity.
- **Vercel**: best developer experience for Next.js/React applications. Higher per-unit cost at scale.
- **Railway/Render**: best for simple container deployments without DevOps overhead.
- **Cloudflare Workers**: edge-first serverless with the world's largest CDN backbone. Sub-millisecond cold starts globally.

The compute hierarchy (from most control to least):
1. **Bare metal**: you rent physical servers — no virtualization overhead, maximum performance, minimum flexibility
2. **Virtual machines**: isolated OS instances on shared hardware — flexible, slow to provision, billed per hour
3. **Containers**: packaged app processes on shared OS kernels — fast to start, portable, billed per use
4. **Serverless functions**: event-triggered code with no infrastructure management — automatic scaling, billed per invocation
5. **Edge functions**: serverless run at CDN nodes globally — lowest latency possible, most constrained runtime (limited CPU time, no persistent connections)

### How CDNs Work

Without a CDN: a user in Japan requests your app's logo. The request travels to your origin server in Virginia (150ms round-trip), the server reads the file from disk, and returns it over the same slow path.

With a CDN: the first request for that logo is a cache miss — same 150ms. But the CDN node in Tokyo now has the file. Every subsequent user in Asia gets it from Tokyo in 5ms. Cache hit rates of 90%+ mean your origin server handles only a small fraction of total traffic.

CDN caching rules:
- Cache static assets aggressively (images, fonts, JS bundles): set \`Cache-Control: max-age=31536000, immutable\`
- Cache dynamic pages conservatively or not at all: use \`Cache-Control: no-store\` or short TTLs
- Use content-addressed filenames (\`/app.a3b4c5d.js\`) so cache busting happens automatically when content changes

### Serverless Trade-offs

**Advantages**:
- No server provisioning or management
- Automatic scaling from zero to millions of requests
- Pay per invocation (often near-zero cost for low-traffic apps)
- Built-in high availability (multiple AZ deployment by default)

**Disadvantages**:
- **Cold starts**: the first invocation after an idle period spins up a new container (50–400ms for Node.js, up to 2s for JVM). Users on cold start paths experience latency spikes.
- **Execution time limits**: AWS Lambda max 15 minutes, Vercel Edge Functions max 30 seconds
- **Statelessness**: every invocation starts fresh — no in-memory cache persistence between calls
- **Vendor lock-in**: serverless APIs (AWS Lambda event format, Vercel Edge Functions) are not portable

The pattern for reducing cold starts: keep functions warm by pinging them every 5 minutes, use provisioned concurrency (paying to keep N instances always warm), or use edge functions which have near-zero cold start times.

### Object Storage vs. Block Storage vs. File Storage

**Object storage** (AWS S3, Cloudflare R2, Supabase Storage): store and retrieve files by key over HTTP. No file system interface. Horizontally limitless. Best for: user uploads, backups, static assets, media files. S3 Standard costs ~$0.023/GB/month.

**Block storage** (AWS EBS, Hetzner volumes): a virtual disk attached to a VM. Has a file system, supports random read/write. Best for: databases, application code on VMs. Must be in the same region as the VM.

**File storage** (AWS EFS, NFS): a file system shared across multiple servers. Best for: shared configuration, content that multiple app servers must read simultaneously.

### Infrastructure as Code

Clicking through a cloud console to configure your production infrastructure is like deploying code by copying files via FTP — it works until you need to reproduce it. IaC (Terraform, Pulumi, AWS CDK) defines infrastructure in code that is:
- **Version-controlled**: every change to infrastructure is tracked in git with author and timestamp
- **Reproducible**: create an identical staging environment from the same code
- **Auditable**: security and compliance teams can review infrastructure changes via pull requests
- **Recoverable**: if a region fails, spin up in a new region from the same IaC in minutes

Pulumi uses general-purpose languages (TypeScript, Python, Go), making it accessible to engineers who do not want to learn Terraform's HCL syntax.

### Cost Optimization Patterns

Cloud bills grow exponentially without active management. The top cost drivers and their mitigations:
- **Idle VMs**: right-size instances; use spot/preemptible instances for batch workloads (60–80% cheaper)
- **Egress fees**: AWS charges $0.09/GB for data leaving AWS. CDN-cached content pays the CDN's lower egress rate. Cloudflare R2 charges $0 egress, making it materially cheaper than S3 at high egress volume.
- **Unused resources**: orphaned load balancers, snapshots, and public IPs accumulate unnoticed. Run cost-anomaly detection (AWS Cost Explorer) with alerts on weekly spend increases >20%.`,
    quiz: [
      {
        q: 'A user in São Paulo requests a 2MB image served from your origin server in Frankfurt. The CDN has a cached version in its São Paulo PoP. What is the latency difference?',
        options: [
          'No difference — CDNs only improve performance for users in the same city as the origin',
          'Origin: ~180ms round-trip latency; CDN cache hit: ~5–10ms from the local PoP — roughly 20–36x faster',
          'CDN adds latency because requests must route through an additional server',
          'The CDN is faster only on repeat requests from the same user',
        ],
        correct: 1,
        explanation:
          'Frankfurt to São Paulo is ~180ms round-trip (speed of light + network hops). A CDN PoP in São Paulo serves from local cache in ~5ms. The first request is a cache miss (origin latency), but all subsequent requests to any user globally hit the São Paulo cache at edge speed. This is why CDN cache hit rate is a critical infrastructure metric.',
      },
      {
        q: 'Your Lambda function processes ML inference requests and has a cold start time of 3 seconds. Which strategy best addresses this for a user-facing API?',
        options: [
          'Increase the Lambda function\'s memory allocation',
          'Use provisioned concurrency to keep a set number of instances pre-initialized and always warm',
          'Switch to a synchronous execution model',
          'Reduce the function\'s code bundle size',
        ],
        correct: 1,
        explanation:
          'Provisioned concurrency keeps N Lambda instances initialized and ready, eliminating cold starts for the first N concurrent invocations. For a user-facing API where 3s cold starts would be unacceptable, provisioned concurrency (at a higher per-hour cost) is the correct fix. Reducing bundle size helps for JS cold starts but not for JVM or Python with heavy dependencies.',
      },
      {
        q: 'Why is Cloudflare R2 significantly cheaper than AWS S3 for high-volume media storage?',
        options: [
          'R2 uses less durable storage with a lower redundancy SLA',
          'R2 charges $0 for egress (data out to the internet), while S3 charges ~$0.09/GB — making R2 dramatically cheaper for read-heavy workloads with large files',
          'R2 is only cheaper for files under 100MB',
          'AWS S3 charges more per GB stored, not for bandwidth',
        ],
        correct: 1,
        explanation:
          'For a video platform serving 100TB/month, S3 egress costs $9,000/month; R2 egress is $0. R2 stores at a similar per-GB price (~$0.015 vs $0.023/GB). For storage-heavy, bandwidth-heavy products (video, media, backups), the egress difference often exceeds all other cloud costs combined.',
      },
      {
        q: 'What is the primary benefit of Infrastructure as Code over manually configuring cloud resources via a web console?',
        options: [
          'IaC runs faster than console-configured infrastructure',
          'IaC makes infrastructure version-controlled, reproducible, auditable, and recoverable — you can recreate an entire environment from a repository',
          'IaC eliminates the need for cloud provider accounts',
          'IaC automatically optimizes resource sizing based on traffic patterns',
        ],
        correct: 1,
        explanation:
          'If your production environment was configured by clicking through a console, can you recreate it from scratch in a disaster? With IaC, yes — run terraform apply and your infrastructure is exactly reproduced. This also enables: reviewing infra changes as pull requests, catching misconfigurations before they reach production, and onboarding new team members who can read the code to understand the architecture.',
      },
      {
        q: 'Which storage type is correct for a PostgreSQL database running on a VM?',
        options: [
          'Object storage (S3) — databases are just files and S3 is the cheapest file storage',
          'Block storage (EBS) — a virtual disk with a file system that the database uses for its data files, write-ahead log, and indexes',
          'File storage (EFS) — shared across multiple database instances for automatic replication',
          'CDN storage — databases benefit from global distribution of data',
        ],
        correct: 1,
        explanation:
          'PostgreSQL reads and writes files randomly — it seeks to specific byte offsets in its data files. This requires a file system with random I/O semantics, which block storage provides. Object storage (S3) is an HTTP API with no random I/O support. EBS volumes are the standard backing store for any database running on a VM.',
      },
    ],
  },
  {
    id: 'tch-m12',
    track: 'tech',
    title: 'Building Your Own AI-Powered Product',
    subtitle: 'From idea to working prototype — the full architecture of a real AI product',
    level: 'Next-Gen AI',
    xp: 210,
    duration: 20,
    module: 12,
    certArea: 'Technology',
    keyTerms: [
      {
        term: 'Product-Model Fit',
        definition:
          'The alignment between what a language model does well and the problem your product solves. A model that excels at text generation is poorly fitted to a product that needs real-time sensor data analysis. Product-model fit determines whether AI adds genuine capability or is a gimmick bolted onto an existing product.',
      },
      {
        term: 'Prompt Engineering as System Design',
        definition:
          'The practice of designing the system prompt, few-shot examples, and context structure as a first-class architectural concern — not an afterthought. The system prompt is the specification that governs all model behavior; a poorly-designed system prompt produces inconsistent outputs regardless of model capability.',
      },
      {
        term: 'Evals (Evaluations)',
        definition:
          'Automated test suites that measure the quality of an AI product\'s outputs against a defined standard. An eval might check: does the model stay within its defined scope, does it produce the correct format, does it produce factually accurate outputs on a known test set. Evals are the unit tests of AI systems.',
      },
      {
        term: 'Latency vs. Quality Trade-off',
        definition:
          'Larger models produce higher-quality outputs but respond more slowly. For a real-time user-facing chat, a 10-second response is unacceptable. For a background document analysis job, quality matters more than speed. AI product architecture requires explicitly deciding where on this spectrum each feature should sit.',
      },
      {
        term: 'AI Product Moat',
        definition:
          'The defensible differentiation of an AI-powered product beyond the underlying model. Since all competitors can call the same OpenAI or Anthropic API, the moat must come from: proprietary training data, unique distribution, superior prompt systems built over many iterations, embedded user workflows, or first-mover network effects in a niche.',
      },
    ],
    content: `## Building Your Own AI-Powered Product

The bottleneck for building AI products is no longer access to powerful models — any developer can call Claude or GPT-4 today. The bottleneck is knowing which problem to solve, how to architect the AI layer, how to measure whether it is working, and how to build defensible value that cannot be instantly replicated by a competitor calling the same API.

### Choosing the Right Problem

The best AI product problems share three properties:

1. **The task is language-shaped**: AI models excel at reading, writing, classifying, summarizing, extracting, and generating text. A product that helps lawyers draft contract clauses is AI-native. A product that needs to control physical robots in real-time is not (yet).

2. **The current solution is bad**: AI replaces tedious manual processes, not already-great software. If there is already an excellent spreadsheet formula for your problem, AI adds complexity without value. If the current solution is "hire a VA to read through 200 emails and flag the important ones," AI is transformative.

3. **Errors are recoverable**: AI models make mistakes. The best AI product use cases allow a human to review and correct AI output before it causes irreversible damage. Medical diagnosis, financial advice, and legal contracts require human review layers. Autocomplete, first-draft generation, and classification for routing can tolerate higher error rates.

### Architecture Patterns for AI Products

**Pattern 1: Augmentation** — AI assists a human workflow without replacing it. Example: an email client that drafts a response for the user to review and send. The AI reduces effort; the human maintains control. Error rate tolerance is high.

**Pattern 2: Automation** — AI replaces a workflow that was previously manual. Example: automatic tagging of incoming support tickets. Requires careful measurement of error rate and business impact of misclassification.

**Pattern 3: Net-new capability** — AI enables something that was not feasible before. Example: a product that answers questions about a company's internal documentation in natural language, where the previous solution was "search by keyword and hope." This category has the highest ceiling for value creation.

### The RAG Architecture in Production

Most enterprise AI products need to answer questions about proprietary data the base model was not trained on. The standard architecture:

1. **Ingestion pipeline**: when a document is added (via upload, webhook, or sync), split it into chunks of 200–500 tokens with overlap, generate embeddings for each chunk, and store in a vector database (pgvector in Postgres, Pinecone, Weaviate).

2. **Query pipeline**: when a user asks a question, embed the question, find the top-K most similar chunks (cosine similarity), include them in the prompt as context: "Using only the following excerpts, answer the question: [chunks]... Question: [user question]"

3. **Evaluation**: periodically test the system on a gold set of questions with known answers. Measure: recall (did the right chunks get retrieved?), faithfulness (is the answer grounded in the retrieved chunks?), and answer relevance (does the answer address the question?).

Chunking strategy matters more than most builders realize. Chunks that split mid-sentence lose context. Chunks that are too large reduce retrieval precision. Headers and metadata in chunks help the model understand document structure.

### Prompt System Design

Your system prompt is the product specification for your AI layer. It should define:
- The persona and tone the model should adopt
- The scope of questions it should and should not answer
- The output format (JSON schema, markdown, prose)
- How to handle uncertainty ("if you don't know, say so")
- Edge cases (hostile users, off-topic questions, requests to ignore instructions)

Prompt engineering is iterative. Start with a simple prompt, test it on 20–50 real user scenarios, identify failure modes, and add specific handling. A production system prompt is often 500–2,000 tokens — the result of dozens of iterations against real data.

### Model Selection Framework

Different models optimize for different properties. The decision matrix:
- **Latency-critical, user-facing chat**: Claude Haiku, GPT-4o mini — fast, cheap, good enough for most conversational tasks
- **Complex reasoning, document analysis**: Claude Sonnet, GPT-4o — best quality-to-cost ratio for moderate-complexity tasks
- **Highest-stakes, complex reasoning**: Claude Opus, GPT-4 — reserve for use cases where quality justifies 5–10x higher cost
- **Embedding generation**: text-embedding-3-small (OpenAI) or voyage-3-lite (Voyage AI) — separate embedding models from generation models
- **On-device inference**: Llama 3 8B, Phi-3 Mini — for mobile apps that cannot make API calls

Always run evals before changing models. A model that scores better on public benchmarks may perform worse on your specific data and prompts.

### Building the Moat

An API call to Claude is not a moat — every competitor can make the same call. Defensible AI products are built on:

1. **Proprietary training data**: if your product collects user interactions that improve the model's performance for your use case, that data becomes increasingly valuable over time and is unavailable to competitors
2. **Workflow embedding**: products that become the system of record for a workflow (not just an AI assistant) create switching costs
3. **Iteration depth**: a prompt system refined over 18 months against real user data outperforms a competitor's first-day prompt even on the same underlying model
4. **Niche specificity**: an AI product built specifically for Jamaican property law, or for Caribbean logistics compliance, captures a market that general-purpose AI assistants serve poorly

The worst AI product strategy: wrap an API and charge for access. Anyone can do that. The best strategy: use AI to deliver an outcome that was previously inaccessible to your target customer, and build every layer of the stack around that outcome.`,
    quiz: [
      {
        q: 'A competitor can call the same Claude API as your AI product. Which of the following creates the most defensible moat?',
        options: [
          'Using a larger model than the competitor',
          'Proprietary user interaction data collected over 18 months that continuously improves your prompt system and fine-tuned models in ways competitors cannot replicate',
          'Having a more colorful UI',
          'Charging a lower price per API call',
        ],
        correct: 1,
        explanation:
          'Data is the primary AI moat. A competitor can call the same model, copy your UI, and undercut your price. They cannot replicate your training data or the 18 months of iteration you did to tune your system against real user behavior. This is why data flywheel effects matter: more users → more data → better product → more users.',
      },
      {
        q: 'Your AI product classifies medical symptoms to triage patients to specialists. Compared to a product that classifies support tickets, what additional architecture requirement is mandatory?',
        options: [
          'A larger language model with more parameters',
          'Human review before AI classification results influence patient care, plus documented error rate tracking and clinical validation of the classification system',
          'A faster API response time',
          'On-device inference to avoid sending patient data to cloud APIs',
        ],
        correct: 1,
        explanation:
          'Medical decisions have irreversible consequences. An AI that misclassifies a heart attack as anxiety causes real harm. The architecture must include human oversight before AI recommendations affect clinical decisions, rigorous accuracy benchmarking on demographically diverse test sets, and documented protocols for when the AI should not be trusted.',
      },
      {
        q: 'In a RAG system, what is the most likely cause of the model giving correct-sounding but factually wrong answers?',
        options: [
          'The embedding model has too many dimensions',
          'The retrieval step returned irrelevant chunks, and the model confabulated an answer rather than saying "I don\'t have this information"',
          'The system prompt is too long',
          'The temperature is set too low',
        ],
        correct: 1,
        explanation:
          'RAG failures typically trace to retrieval failures. If the top-K retrieved chunks do not contain the answer, the model either says "I don\'t know" (if well-instructed) or confabulates a plausible-sounding but incorrect answer. The fix: improve retrieval recall by tuning chunk size, overlap, and the similarity threshold; add explicit instructions to only answer from provided context.',
      },
      {
        q: 'For a real-time customer chat assistant that must respond in under 2 seconds, which model tier is most appropriate?',
        options: [
          'The largest available model for maximum accuracy',
          'A fast, smaller model (Claude Haiku, GPT-4o mini) that sacrifices some reasoning depth for sub-second response times',
          'An on-device model that avoids API latency entirely',
          'A fine-tuned model, since fine-tuned models are always faster than base models',
        ],
        correct: 1,
        explanation:
          'Haiku-class models generate 80–120 tokens/second vs. 20–40 for Opus-class models. For conversational interfaces, users perceive responses over 2 seconds as slow. Use fast models for latency-critical paths and route complex tasks (long document analysis, code generation) to more capable models in non-realtime flows.',
      },
      {
        q: 'What is the purpose of evals in an AI product, and what should they measure?',
        options: [
          'Evals measure server response time and infrastructure costs',
          'Evals are automated test suites that measure output quality — checking accuracy on a gold test set, format compliance, hallucination rate, and scope adherence — enabling confident model and prompt changes',
          'Evals are user satisfaction surveys sent after each AI interaction',
          'Evals measure the token count of system prompts to ensure they are within model limits',
        ],
        correct: 1,
        explanation:
          'Without evals, you do not know if a prompt change or model upgrade improved or degraded your product. A gold test set (50–200 questions with known correct answers) lets you compare system versions quantitatively. Evals should run automatically on every prompt change, just as unit tests run on every code change.',
      },
    ],
  },
]
