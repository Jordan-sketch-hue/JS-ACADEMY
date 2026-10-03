import type { Course } from '../courses'

const COURSE_OBJECTIVE =
  'Master AWS from first principles — understand the global infrastructure, core services, and architectural patterns so you can design, deploy, and operate production-grade cloud applications with confidence.'

export const crashAwsCourses: Course[] = [
  // ── Module 1 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m01',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Cloud Fundamentals & the AWS Mental Model',
    subtitle: 'Regions, AZs, IAM, the shared responsibility model, and how to think about the cloud',
    level: 'Basic',
    xp: 160,
    duration: 16,
    module: 1,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Understand how AWS is structured geographically, secure your account with IAM best practices, and develop the mental model that makes every AWS service easier to learn.',
    keyTerms: [
      { term: 'Region', definition: 'An isolated geographic area (e.g. us-east-1) containing two or more Availability Zones. Data does not leave a region unless you explicitly replicate it.' },
      { term: 'Availability Zone (AZ)', definition: 'One or more discrete data centers with redundant power and networking inside a region. Distributing resources across AZs provides fault isolation.' },
      { term: 'IAM (Identity & Access Management)', definition: 'The AWS service that controls who can do what. Users, groups, roles, and policies are all IAM concepts. Principle of least privilege is the rule: grant only what is required.' },
      { term: 'Shared Responsibility Model', definition: 'AWS secures the infrastructure (hardware, data centers, hypervisors). You secure everything you put on top of it (OS patches, app code, data encryption, IAM policies).' },
      { term: 'Root Account', definition: 'The superuser account tied to the email that created the AWS account. Should be locked down immediately with MFA and never used for day-to-day work.' },
      { term: 'ARN (Amazon Resource Name)', definition: 'A globally unique identifier for every AWS resource. Format: arn:aws:service:region:account-id:resource. Used in IAM policies to specify exactly which resources a permission applies to.' },
    ],
    content: `## Cloud Fundamentals & the AWS Mental Model

### Why the Cloud Exists

Before cloud, companies bought physical servers, housed them in data centers, and paid for peak capacity that sat idle most of the time. AWS commoditized that infrastructure — you rent compute, storage, and networking by the second or GB, scale instantly, and pay only for what you use.

The mental shift: **you are not managing servers, you are composing managed services.** Every AWS service abstracts away a hard infrastructure problem.

### The Global Infrastructure

AWS operates across **34+ regions** worldwide. Each region is a self-contained cluster of data centers identified by a slug like \`us-east-1\` (N. Virginia) or \`eu-west-1\` (Ireland).

Inside each region are **Availability Zones** — physically separate facilities connected by high-speed, low-latency fiber. AZs are the unit of fault isolation. If one AZ loses power, the others keep running.

**Best practice**: spread your critical resources across at least 2 AZs. Most managed AWS services (RDS, ECS, ALB) do this automatically.

\`\`\`
Region: us-east-1
├── AZ: us-east-1a  (data center cluster A)
├── AZ: us-east-1b  (data center cluster B)
└── AZ: us-east-1c  (data center cluster C)
\`\`\`

### IAM — The Access Control Plane

**Every AWS API call is an IAM call.** Whether you click in the console or run \`aws s3 cp\`, IAM decides whether you are allowed.

**Core concepts:**

| Concept | What it is |
|---|---|
| User | A person or service with long-lived credentials |
| Group | A collection of users that share policies |
| Role | Temporary credentials assumed by a service or user |
| Policy | A JSON document that grants or denies specific actions on specific resources |

**The root account** (the email used to create the AWS account) has unlimited power. Secure it immediately:
1. Enable MFA
2. Create an IAM admin user for daily work
3. Never create access keys for root

**Principle of Least Privilege**: grant only the permissions something actually needs. An EC2 instance that reads from S3 needs \`s3:GetObject\` on that bucket — not \`s3:*\` on all buckets.

A minimal S3 read-only policy:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
\`\`\`

### The Shared Responsibility Model

This is the most important mental model for operating on AWS securely.

**AWS is responsible for:**
- Physical security of data centers
- Network hardware and hypervisors
- Managed service OS patches (e.g., RDS database engine)

**You are responsible for:**
- Your application code and its dependencies
- OS patches on EC2 instances you manage
- IAM policies and access controls
- Data encryption in transit and at rest
- Network configuration (security groups, VPC rules)

A breach caused by a misconfigured S3 bucket is your fault, not AWS's — even though AWS provides the bucket service.

### How to Think About AWS Services

Every AWS service answers one question: **"What hard infrastructure problem does this solve?"**

- Need to run code? → **Lambda** (serverless) or **EC2** (virtual machine)
- Need to store files? → **S3** (object storage)
- Need a database? → **RDS** (relational) or **DynamoDB** (NoSQL)
- Need to connect services? → **SQS** (queue) or **SNS** (pub/sub)

The services are building blocks. Real architectures compose 5–20 of them. Start with the question, then find the service.`,
    quiz: [
      {
        q: 'What is an Availability Zone?',
        options: [
          'A geographic region like us-east-1',
          'One or more discrete data centers inside a region, isolated for fault tolerance',
          'A VPC subnet within a region',
          'An AWS billing unit',
        ],
        correct: 1,
        explanation: 'AZs are physically separate facilities inside a region. Spreading resources across AZs means a failure in one data center cluster does not take down your application.',
      },
      {
        q: 'Under the Shared Responsibility Model, who is responsible for patching the OS on an EC2 instance you launched?',
        options: ['AWS', 'You', 'Both equally', 'The cloud provider chosen at launch'],
        correct: 1,
        explanation: 'EC2 gives you a virtual machine — you own the OS and everything on it. AWS patches the hypervisor underneath, but not your guest OS.',
      },
      {
        q: 'What should you do with the AWS root account after initial setup?',
        options: [
          'Use it for all admin tasks',
          'Delete it immediately',
          'Enable MFA, create an IAM admin user, and stop using root for daily work',
          'Share credentials with your team via password manager',
        ],
        correct: 2,
        explanation: 'Root has unlimited power and cannot be restricted by IAM policies. Secure it with MFA and create an IAM admin user for actual work.',
      },
      {
        q: 'What does the Principle of Least Privilege mean in IAM?',
        options: [
          'Always use managed policies over inline policies',
          'Grant only the specific permissions a user or service actually needs',
          'Prefer roles over users for all access',
          'Audit IAM permissions quarterly',
        ],
        correct: 1,
        explanation: 'Least privilege means a Lambda that reads from one S3 bucket gets s3:GetObject on that bucket — not s3:* on all buckets. Scope tightly to limit blast radius if credentials are compromised.',
      },
    ],
  },

  // ── Module 2 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m02',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Compute — EC2, Lambda & Choosing the Right Model',
    subtitle: 'Virtual machines vs. serverless functions — when to use each and how both work',
    level: 'Basic',
    xp: 170,
    duration: 17,
    module: 2,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Launch an EC2 instance, understand Lambda\'s event-driven execution model, and know the decision framework for choosing between virtual machines, containers, and serverless.',
    keyTerms: [
      { term: 'EC2 (Elastic Compute Cloud)', definition: 'AWS\'s virtual machine service. You choose an instance type (CPU/RAM), an OS image (AMI), and AWS runs the VM on its hardware. You manage the OS and everything above it.' },
      { term: 'Instance Type', definition: 'Defines the CPU, RAM, and network capacity of an EC2 instance. Families: t (burstable, cheapest), m (general purpose), c (compute optimized), r (memory optimized). Example: t3.micro (2 vCPU, 1 GB RAM).' },
      { term: 'AMI (Amazon Machine Image)', definition: 'A snapshot of an OS + configuration used to launch EC2 instances. AWS provides Amazon Linux, Ubuntu, Windows AMIs. You can also create custom AMIs from running instances.' },
      { term: 'Security Group', definition: 'A stateful firewall attached to EC2 (and other services). Rules specify which ports and IP ranges can connect. Default: all inbound blocked, all outbound allowed.' },
      { term: 'Lambda', definition: 'AWS\'s serverless compute service. You upload a function, configure a trigger, and AWS runs it on demand — no server management, billing per 100ms of execution.' },
      { term: 'Cold Start', definition: 'The delay on a Lambda\'s first invocation (or after inactivity) while AWS initializes the execution environment. Typically 100–500ms for Node.js/Python, longer for JVM runtimes.' },
    ],
    content: `## Compute — EC2, Lambda & Choosing the Right Model

### Two Mental Models of Compute

**EC2**: I need a server. Give me a virtual machine, I'll install what I need and keep it running.

**Lambda**: I have a function. Run it whenever this event happens, for as long as it takes, and charge me only for that execution.

Every other AWS compute option (ECS, Fargate, App Runner) lives between these two extremes.

### EC2 in Depth

EC2 instances are virtual machines running on AWS hardware. You choose:

| Decision | Options |
|---|---|
| Instance type | t3.micro, m5.large, c6g.xlarge — controls CPU/RAM |
| AMI | Amazon Linux 2023, Ubuntu 22.04, Windows Server, etc. |
| Storage | EBS volumes (persistent) or instance store (ephemeral) |
| Network | Which VPC, subnet, and security groups |

**Instance families:**
- **t** (burstable) — cheapest, earns CPU credits when idle, spends them on spikes. Good for dev environments, low-traffic apps.
- **m** (general purpose) — balanced CPU/RAM. The default for most workloads.
- **c** (compute optimized) — high CPU-to-RAM ratio. Good for batch processing, video encoding.
- **r** (memory optimized) — high RAM. Good for in-memory caches, large databases.

**Key EC2 concepts:**

\`\`\`bash
# Connect to an instance via SSH
ssh -i my-key.pem ec2-user@<public-ip>

# User data — bootstrap script that runs on first launch
#!/bin/bash
yum update -y
yum install -y nodejs
node -e "require('http').createServer((r,s)=>s.end('ok')).listen(3000)"
\`\`\`

**Security Groups** are the primary network control for EC2:

\`\`\`
Inbound rules:
  Port 22 (SSH)  — my IP only (0.0.0.0/0 is a security risk)
  Port 443 (HTTPS) — 0.0.0.0/0
  Port 80 (HTTP)   — 0.0.0.0/0

Outbound rules:
  All traffic — 0.0.0.0/0 (default, allows updates/API calls)
\`\`\`

### Lambda in Depth

Lambda functions are event-driven. AWS manages all infrastructure; you write the handler.

\`\`\`javascript
// A simple Lambda handler (Node.js 20.x runtime)
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event))

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda' }),
  }
}
\`\`\`

**Lambda limits to know:**
- Max execution time: **15 minutes**
- Memory: 128 MB – 10 GB (CPU scales with memory)
- Deployment package: 50 MB zipped (or 250 MB via Lambda Layers)
- Concurrent executions: 1,000 per region by default (soft limit, can increase)

**Common Lambda triggers:**
- API Gateway → HTTP request
- S3 → file uploaded/deleted
- SQS → message on a queue
- EventBridge → scheduled cron or custom event
- DynamoDB Streams → database change

### The Decision Framework

| Use | When |
|---|---|
| **Lambda** | Short-lived, event-driven, unpredictable traffic, zero-ops desired |
| **EC2** | Long-running processes, need full OS control, legacy apps, steady high traffic |
| **ECS/Fargate** | Containerized apps, more control than Lambda, less ops than EC2 |
| **App Runner** | Web apps and APIs, fully managed, simpler than ECS |

**Cost intuition:**
- Lambda: ~$0.20 per 1M invocations + duration. Near-zero cost at low volume.
- t3.micro: ~$0.0104/hr = ~$7.50/month. Cheaper at sustained high request volume.
- The crossover is roughly 1–5M monthly invocations depending on duration.`,
    quiz: [
      {
        q: 'What does a Lambda cold start refer to?',
        options: [
          'Running Lambda in a cold AWS region',
          'The delay on first invocation while AWS initializes the execution environment',
          'A Lambda that has never been tested',
          'Lambda running without a VPC attached',
        ],
        correct: 1,
        explanation: 'On first invocation (or after inactivity), AWS has to download your code, start a container, and initialize the runtime. This adds 100–500ms. Subsequent "warm" invocations reuse the container and are much faster.',
      },
      {
        q: 'What is the maximum execution duration for a single Lambda invocation?',
        options: ['30 seconds', '5 minutes', '15 minutes', '1 hour'],
        correct: 2,
        explanation: 'Lambda has a hard 15-minute timeout. For longer workloads use EC2, ECS, or break the work into smaller Lambda invocations chained via SQS or Step Functions.',
      },
      {
        q: 'You need to run a Node.js web server that handles 10M requests/day with consistent 50ms response times. Which compute choice is most appropriate?',
        options: ['Lambda', 't3.micro EC2', 'ECS Fargate with auto-scaling', 'S3 static hosting'],
        correct: 2,
        explanation: 'At 10M req/day with latency requirements, ECS Fargate with auto-scaling gives you containerized Node.js with predictable performance and automatic capacity management — better than Lambda cold starts and easier than managing EC2 fleets.',
      },
      {
        q: 'A security group inbound rule allows port 22 from 0.0.0.0/0. What is the risk?',
        options: [
          'Lambda functions cannot trigger EC2',
          'Anyone on the internet can attempt SSH connections to the instance',
          'The instance cannot reach the internet',
          'CloudWatch logs will be disabled',
        ],
        correct: 1,
        explanation: '0.0.0.0/0 means all IP addresses. SSH on port 22 with open inbound means the entire internet can attempt to brute-force or exploit your SSH service. Always restrict SSH to your own IP or use AWS Systems Manager Session Manager instead.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a Lambda handler function that receives an API Gateway event, extracts the `name` query string parameter (defaulting to "World" if missing), and returns a 200 response with body `{"message": "Hello, <name>!"}`. Use the standard Lambda handler signature.',
      starterCode: `// Lambda handler for API Gateway
export const handler = async (event) => {
  // event.queryStringParameters contains query params
  // Return: { statusCode: 200, body: JSON.stringify({...}) }

}`,
      solution: `export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? 'World'

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: \`Hello, \${name}!\` }),
  }
}`,
      hints: [
        'event.queryStringParameters is an object like { name: "Jordan" } or null if no params',
        'Use optional chaining (?.) and nullish coalescing (??) to safely get the value',
        'JSON.stringify the body — API Gateway requires the body to be a string',
      ],
    },
  },

  // ── Module 3 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m03',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Storage — S3, EBS & RDS',
    subtitle: 'Object storage, block storage, and managed databases — when and how to use each',
    level: 'Basic',
    xp: 165,
    duration: 16,
    module: 3,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Understand the three storage layers in AWS, configure an S3 bucket correctly, and know when to choose RDS vs. other database options.',
    keyTerms: [
      { term: 'S3 (Simple Storage Service)', definition: 'AWS\'s object storage — store any file up to 5 TB as an object in a bucket. Infinitely scalable, 11 nines durability (99.999999999%). Objects are accessed via HTTP, not mounted as a filesystem.' },
      { term: 'S3 Bucket', definition: 'A container for S3 objects. Bucket names are globally unique across all AWS accounts. Buckets are created in a specific region; data stays in that region unless you configure replication.' },
      { term: 'EBS (Elastic Block Store)', definition: 'Persistent block storage volumes attached to EC2 instances. Behaves like a hard drive — you format it, mount it, and read/write files. Stays attached to one EC2 instance at a time (except Multi-Attach io2).' },
      { term: 'RDS (Relational Database Service)', definition: 'Managed relational databases: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, and Aurora. AWS handles provisioning, patching, backups, and failover. You manage schema and queries.' },
      { term: 'S3 Bucket Policy', definition: 'A resource-based IAM policy attached directly to an S3 bucket that controls who can access objects inside it. Used to make buckets public, grant cross-account access, or enforce HTTPS-only access.' },
      { term: 'RDS Multi-AZ', definition: 'A standby RDS instance in a different AZ that receives synchronous replication. If the primary fails, AWS automatically promotes the standby. Provides high availability, not a read performance boost.' },
    ],
    content: `## Storage — S3, EBS & RDS

### Three Storage Layers

| Storage Type | Use case | Accessed via |
|---|---|---|
| **S3** | Files, images, backups, static sites, data lake | HTTP API |
| **EBS** | EC2 instance disk, databases on EC2 | Block device (like a hard drive) |
| **EFS** | Shared filesystem across multiple EC2 instances | NFS mount |
| **RDS** | Managed relational database | SQL (TCP connection) |

### S3 in Depth

S3 stores objects (files) in buckets. Every object has a key (the "path"), a value (the bytes), and metadata.

\`\`\`
Bucket: my-app-assets
Objects:
  uploads/profile-pic-123.jpg
  exports/report-2024-01.csv
  public/index.html
\`\`\`

**Durability and availability**: S3 automatically stores objects across at least 3 AZs. 11 nines durability means if you store 10 million objects, you can expect to lose one object every 10,000 years.

**Access control — the most important S3 topic:**

S3 has three layers of access control:
1. **Block Public Access** — account-level switch, on by default, prevents any public access regardless of policies. Never turn this off unless you explicitly need a public bucket.
2. **Bucket Policy** — JSON policy attached to the bucket. Controls who can do what.
3. **Object ACLs** — per-object permissions. Largely deprecated; use bucket policies instead.

A bucket policy that allows public read (for a static website):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-static-site/*"
    }
  ]
}
\`\`\`

**Pre-signed URLs** — time-limited URLs that grant temporary access to a private object without changing the bucket policy. Use for user file uploads and downloads.

\`\`\`javascript
// Generate a pre-signed URL (expires in 1 hour)
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const client = new S3Client({ region: 'us-east-1' })
const url = await getSignedUrl(
  client,
  new GetObjectCommand({ Bucket: 'my-bucket', Key: 'file.pdf' }),
  { expiresIn: 3600 }
)
\`\`\`

### EBS in Depth

EBS volumes are block devices — like virtual hard drives. They live in a specific AZ and can only be attached to EC2 instances in the same AZ.

**Volume types:**
- **gp3** — General Purpose SSD. The default. 3,000 IOPS baseline, configurable up to 16,000.
- **io2** — Provisioned IOPS SSD. For databases needing >16,000 IOPS or Multi-Attach.
- **sc1/st1** — HDD volumes. Cheapest; for infrequently accessed data.

EBS volumes persist independently of the EC2 instance lifecycle. You can detach a volume, attach it to another instance, or take a snapshot.

### RDS in Depth

RDS gives you a fully managed relational database. You pick the engine (Postgres, MySQL, etc.), instance class, and storage. AWS handles:
- OS and database engine patching
- Automated backups (point-in-time recovery up to 35 days)
- Failover with Multi-AZ
- Read replicas for horizontal read scaling

**Multi-AZ vs. Read Replicas:**

| Feature | Multi-AZ | Read Replica |
|---|---|---|
| Purpose | High availability | Read scaling |
| Replication | Synchronous | Asynchronous |
| Readable? | No (standby is passive) | Yes |
| Failover | Automatic | Manual promotion |

**Connection tip**: applications connect to the RDS **endpoint** (a DNS name). Multi-AZ failover keeps the same endpoint — your app reconnects automatically without config changes.`,
    quiz: [
      {
        q: 'What is the correct way to serve private S3 objects to authenticated users without making the bucket public?',
        options: [
          'Turn off Block Public Access',
          'Use S3 Transfer Acceleration',
          'Generate pre-signed URLs with a TTL',
          'Attach an IAM policy to the bucket with Principal: *',
        ],
        correct: 2,
        explanation: 'Pre-signed URLs embed temporary credentials that expire after a set time. The bucket stays private; only users with the URL can access the specific object within the window.',
      },
      {
        q: 'An RDS Multi-AZ standby instance is used for:',
        options: [
          'Serving read traffic to reduce load on the primary',
          'Automatic failover if the primary becomes unavailable',
          'Running database migrations without downtime',
          'Cross-region disaster recovery',
        ],
        correct: 1,
        explanation: 'The Multi-AZ standby is passive — it receives synchronous replication but serves no traffic. Its only job is to be promoted automatically if the primary fails, providing high availability.',
      },
      {
        q: 'You need to store 500 GB of user-uploaded images that your web app serves via HTTP. Which storage type fits?',
        options: ['EBS', 'S3', 'EFS', 'Instance Store'],
        correct: 1,
        explanation: 'S3 is purpose-built for serving files over HTTP at any scale. EBS is a block device attached to EC2 — you can\'t serve it directly over HTTP. Instance Store is ephemeral. EFS is a shared filesystem, not an HTTP service.',
      },
      {
        q: 'What does the S3 Block Public Access setting do?',
        options: [
          'Prevents objects from being downloaded more than once',
          'Blocks all programmatic access to the bucket',
          'Prevents public access regardless of bucket policies or ACLs',
          'Encrypts all objects at rest',
        ],
        correct: 2,
        explanation: 'Block Public Access is an account-level and bucket-level override that prevents any bucket policy or ACL from making objects publicly accessible. It is on by default and should stay on unless you have a deliberate public-site use case.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a function `generateUploadUrl(bucket, key, expiresInSeconds)` that uses the AWS SDK v3 to create a pre-signed S3 PUT URL. Return the URL string. Use `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.',
      starterCode: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const client = new S3Client({ region: 'us-east-1' })

async function generateUploadUrl(bucket, key, expiresInSeconds) {
  // Create a PutObjectCommand and return a pre-signed URL

}`,
      solution: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const client = new S3Client({ region: 'us-east-1' })

async function generateUploadUrl(bucket, key, expiresInSeconds) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}`,
      hints: [
        'PutObjectCommand takes { Bucket, Key } — the destination bucket and object key',
        'getSignedUrl takes the client, the command, and an options object with { expiresIn: seconds }',
        'Return the result of getSignedUrl directly — it returns a Promise<string>',
      ],
    },
  },

  // ── Module 4 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m04',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Networking — VPC, Subnets & Security Groups',
    subtitle: 'Build an isolated network on AWS, control traffic flow, and understand public vs. private subnets',
    level: 'Masters',
    xp: 200,
    duration: 18,
    module: 4,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Design a production VPC with public and private subnets, configure routing tables and NAT Gateways, and apply security groups and NACLs correctly.',
    keyTerms: [
      { term: 'VPC (Virtual Private Cloud)', definition: 'Your own isolated network within AWS. All resources you create live inside a VPC. You control the IP address range, subnets, routing, and network access controls.' },
      { term: 'Subnet', definition: 'A range of IP addresses within a VPC, scoped to a single AZ. Public subnets route traffic to the internet gateway; private subnets do not. Best practice: put web servers in public, databases in private.' },
      { term: 'Internet Gateway (IGW)', definition: 'A horizontally scaled, redundant AWS component that allows resources in a public subnet to communicate with the internet. Attach one to a VPC to enable internet access.' },
      { term: 'NAT Gateway', definition: 'Lets resources in private subnets make outbound internet requests (for software updates, API calls) without being reachable from the internet. Managed by AWS, no maintenance required.' },
      { term: 'Route Table', definition: 'A set of routing rules that determine where network traffic is directed. Each subnet is associated with one route table. A route to 0.0.0.0/0 pointing at an IGW makes a subnet public.' },
      { term: 'NACL (Network Access Control List)', definition: 'A stateless firewall at the subnet level. Rules are evaluated in order by number. Unlike security groups, NACLs require explicit inbound AND outbound rules. Less commonly customized than security groups.' },
    ],
    content: `## Networking — VPC, Subnets & Security Groups

### Why Networking Matters

Without a VPC, your EC2 instances and RDS databases would be directly on the internet with no isolation. The VPC is the envelope that wraps your entire infrastructure.

### VPC Architecture

Every AWS account gets a **default VPC** in each region with sensible defaults. For production, you create a custom VPC with deliberate subnet design.

**Standard production VPC layout:**

\`\`\`
VPC: 10.0.0.0/16  (65,536 IPs)
│
├── Public Subnet A (10.0.1.0/24) — AZ us-east-1a
│   └── Load Balancer, Bastion Host, NAT Gateway
│
├── Public Subnet B (10.0.2.0/24) — AZ us-east-1b
│   └── Load Balancer (second AZ for HA)
│
├── Private Subnet A (10.0.3.0/24) — AZ us-east-1a
│   └── EC2 app servers, ECS tasks
│
├── Private Subnet B (10.0.4.0/24) — AZ us-east-1b
│   └── EC2 app servers (second AZ for HA)
│
├── DB Subnet A (10.0.5.0/24) — AZ us-east-1a
│   └── RDS primary
│
└── DB Subnet B (10.0.6.0/24) — AZ us-east-1b
    └── RDS Multi-AZ standby
\`\`\`

**Public vs. Private subnet — the only difference is routing:**

| | Public Subnet | Private Subnet |
|---|---|---|
| Route to 0.0.0.0/0 | Internet Gateway | NAT Gateway |
| Resources get public IP | Yes (if configured) | No |
| Reachable from internet | Yes | No |

### How Traffic Flows

**Inbound request to your web app:**
1. Request hits the Internet Gateway
2. IGW routes to the Application Load Balancer in the public subnet
3. ALB forwards to EC2/ECS in the private subnet
4. App queries RDS in the DB subnet

**Outbound from private subnet (e.g., npm install):**
1. Private subnet routes 0.0.0.0/0 to the NAT Gateway (in public subnet)
2. NAT Gateway routes through the Internet Gateway
3. Response returns via NAT Gateway to the private instance

The private instance never gets a public IP — NAT handles the translation.

### Security Groups in Practice

Security Groups are the primary layer you interact with daily. Key properties:
- **Stateful**: if you allow inbound on port 443, the response is automatically allowed outbound
- **Allow rules only**: you cannot explicitly deny in a security group (use NACLs for deny)
- **Reference other groups**: allow traffic from another security group (not just an IP range)

**Example: three-tier security group design:**

\`\`\`
ALB Security Group:
  Inbound: 80/443 from 0.0.0.0/0
  Outbound: 3000 to App SG

App Security Group:
  Inbound: 3000 from ALB SG   ← references ALB SG, not IPs
  Outbound: 5432 to DB SG

DB Security Group:
  Inbound: 5432 from App SG   ← only the app can reach the DB
  Outbound: none needed
\`\`\`

Referencing security groups by ID instead of IP ranges means your rules stay valid as instances scale up and change IPs.

### NACLs vs. Security Groups

| | Security Group | NACL |
|---|---|---|
| Level | Instance | Subnet |
| Stateful | Yes | No (must allow both directions) |
| Rules | Allow only | Allow and Deny |
| Evaluation | All rules | In order (lowest number first) |

**When to use NACLs**: blocking a specific IP range at the subnet level (e.g., blocking a known attacker's IP block). For most architectures, security groups are sufficient.`,
    quiz: [
      {
        q: 'What makes a subnet "public" in AWS?',
        options: [
          'It has more than 256 IP addresses',
          'Its route table has a route to 0.0.0.0/0 pointing at an Internet Gateway',
          'It was created in the default VPC',
          'Its resources have public IP addresses assigned',
        ],
        correct: 1,
        explanation: 'Public vs. private is purely a routing decision. A subnet is public because traffic to 0.0.0.0/0 is directed at an Internet Gateway. Resources in a private subnet route outbound traffic to a NAT Gateway instead.',
      },
      {
        q: 'Why should your RDS database be in a private subnet?',
        options: [
          'RDS cannot run in public subnets',
          'Private subnets have lower latency',
          'Databases should not be directly reachable from the internet',
          'Public subnets cannot connect to RDS',
        ],
        correct: 2,
        explanation: 'A database in a public subnet can be reached directly from the internet if its security group allows it. Private subnets have no inbound internet route, so even a misconfigured security group cannot expose the database to the internet.',
      },
      {
        q: 'Your app server in a private subnet needs to download packages from the internet. What allows this?',
        options: ['Internet Gateway attached to the private subnet', 'NAT Gateway in a public subnet', 'VPC Peering', 'An Elastic IP on the instance'],
        correct: 1,
        explanation: 'A NAT Gateway in a public subnet handles outbound-only internet access for private subnet resources. It performs network address translation — outbound traffic appears to come from the NAT Gateway\'s public IP.',
      },
      {
        q: 'Security Group rule: allow inbound port 5432 from the "App Security Group" ID. What does this mean?',
        options: [
          'Allow Postgres connections from any instance in the same AZ',
          'Allow Postgres connections from any instance that has the App Security Group attached',
          'Allow all TCP traffic from instances with that security group',
          'Allow Postgres connections from a specific IP range',
        ],
        correct: 1,
        explanation: 'Referencing a security group by ID as the source means: allow connections from any EC2 instance (or other resource) that has that security group attached. This is more reliable than IP-based rules because it stays valid as instances scale and change IPs.',
      },
    ],
  },

  // ── Module 5 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m05',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Serverless Architecture — Lambda, API Gateway & SQS',
    subtitle: 'Build event-driven systems: HTTP APIs, async processing, and decoupled message queues',
    level: 'Masters',
    xp: 210,
    duration: 18,
    module: 5,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Wire a Lambda function to API Gateway to serve HTTP traffic, use SQS to decouple services asynchronously, and understand when serverless architecture wins and when it doesn\'t.',
    keyTerms: [
      { term: 'API Gateway', definition: 'A fully managed service for creating HTTP, REST, and WebSocket APIs. Routes requests to Lambda functions, EC2, or any HTTP endpoint. Handles auth, throttling, and caching.' },
      { term: 'SQS (Simple Queue Service)', definition: 'A managed message queue. Producers put messages in, consumers pull them out. Decouples services so a slow consumer doesn\'t back-pressure a fast producer. Messages persist up to 14 days.' },
      { term: 'SNS (Simple Notification Service)', definition: 'A pub/sub messaging service. Publishers send to a "topic"; all subscribers (Lambda, SQS, email, HTTP endpoint) receive a copy. Fan-out pattern: one event to many consumers.' },
      { term: 'EventBridge', definition: 'AWS\'s event bus. Routes events between AWS services and custom applications based on rules. Replaces CloudWatch Events. Use for scheduled crons (rate/cron expressions) and event-driven integration.' },
      { term: 'DLQ (Dead Letter Queue)', definition: 'An SQS queue that receives messages that failed processing after the maximum number of retries. Prevents failed messages from blocking the queue and enables inspection and retry.' },
      { term: 'Visibility Timeout', definition: 'When an SQS consumer reads a message, it becomes invisible to other consumers for the visibility timeout duration. If not deleted within that window, it reappears for another consumer to retry.' },
    ],
    content: `## Serverless Architecture — Lambda, API Gateway & SQS

### The Serverless Pattern

Serverless does not mean "no servers" — it means you do not manage servers. AWS handles capacity, scaling, patching, and availability. You write the function.

The three pillars of serverless on AWS:
1. **Lambda** — compute
2. **API Gateway** — HTTP trigger
3. **SQS/SNS/EventBridge** — async event trigger

### API Gateway + Lambda

The most common serverless pattern is an HTTP API backed by Lambda:

\`\`\`
User → API Gateway (HTTP API) → Lambda → Response
\`\`\`

API Gateway handles:
- TLS termination
- Request routing (GET /users, POST /users/{id})
- Auth (JWT, API key, custom Lambda authorizer)
- Throttling (requests/second limits)
- CORS headers

The Lambda receives an event object that contains everything about the request:

\`\`\`javascript
export const handler = async (event) => {
  // event shape for API Gateway HTTP API
  const { method, path, pathParameters, queryStringParameters, body } = {
    method: event.requestContext.http.method,
    path: event.requestContext.http.path,
    pathParameters: event.pathParameters,      // { id: '123' } from /users/{id}
    queryStringParameters: event.queryStringParameters,
    body: event.body ? JSON.parse(event.body) : null,
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, method }),
  }
}
\`\`\`

### SQS — Asynchronous Decoupling

SQS queues let services communicate without being directly connected. Classic use case: a web app receives an order, puts a message on a queue, and a separate Lambda processes it asynchronously.

\`\`\`
Web App → SQS Queue → Lambda (processes order)
                  ↓ (failed after retries)
               Dead Letter Queue (for inspection)
\`\`\`

**Two queue types:**

| | Standard Queue | FIFO Queue |
|---|---|---|
| Throughput | Unlimited | 300 msg/s (3,000 with batching) |
| Ordering | Best-effort | Guaranteed |
| Delivery | At least once | Exactly once |
| Use case | High-throughput async | Order-sensitive processing |

**Lambda ↔ SQS integration**: Lambda polls the queue for you (you don't write the poll loop):

\`\`\`javascript
export const handler = async (event) => {
  // event.Records is an array — Lambda batches SQS messages
  for (const record of event.Records) {
    const message = JSON.parse(record.body)
    console.log('Processing:', message)
    // If this throws, the message returns to the queue for retry
    await processOrder(message)
  }
  // Returning normally deletes processed messages from the queue
}
\`\`\`

**Visibility timeout**: when Lambda reads a message, it becomes invisible for the visibility timeout period (default 30s). If your Lambda takes longer than the timeout to finish, the message reappears and another Lambda picks it up — causing double-processing. Set visibility timeout to **6× your Lambda timeout**.

### SNS — Fan-Out

SNS topics publish to multiple subscribers simultaneously:

\`\`\`
Order Created Event → SNS Topic
  ├── SQS Queue (fulfillment service)
  ├── SQS Queue (analytics service)
  ├── Lambda (send confirmation email)
  └── HTTP endpoint (third-party integration)
\`\`\`

One publish, four consumers process it independently.

### EventBridge — Scheduled and Custom Events

\`\`\`javascript
// Cron syntax (run at 9am UTC every weekday)
// rate(5 minutes) — every 5 minutes
// cron(0 9 ? * MON-FRI *) — weekdays at 9am UTC

// EventBridge invokes your Lambda with an event like:
{
  "source": "aws.events",
  "detail-type": "Scheduled Event",
  "detail": {}
}
\`\`\`

Use EventBridge for: daily report generation, queue health checks, cache warming, cleanup jobs.`,
    quiz: [
      {
        q: 'What happens to an SQS message if the Lambda processing it throws an error?',
        options: [
          'The message is permanently deleted',
          'The message is sent to the SNS topic',
          'The message becomes visible again after the visibility timeout and will be retried',
          'The Lambda is automatically restarted',
        ],
        correct: 2,
        explanation: 'SQS messages are only deleted when the consumer explicitly deletes them (or when Lambda successfully processes a batch). If the handler throws, the message stays in the queue and reappears after the visibility timeout for retry.',
      },
      {
        q: 'You need to send an order confirmation email, update inventory, and log to analytics whenever an order is placed — all from a single event. Which pattern fits?',
        options: [
          'Three separate SQS queues, one per downstream service',
          'SNS topic with three subscribers (Lambda for email, SQS for inventory, SQS for analytics)',
          'API Gateway routing to three Lambda functions in sequence',
          'A single Lambda that calls all three services synchronously',
        ],
        correct: 1,
        explanation: 'SNS fan-out is the right pattern: one publish to the topic, and all three subscribers receive a copy simultaneously. Each processes independently — a failure in one doesn\'t affect the others.',
      },
      {
        q: 'Your Lambda timeout is set to 30 seconds. What should the SQS visibility timeout be?',
        options: ['30 seconds', '60 seconds', '180 seconds', '30 seconds is sufficient; they should match'],
        correct: 2,
        explanation: 'AWS recommends setting SQS visibility timeout to 6× the Lambda timeout. With a 30s Lambda timeout, use 180s visibility timeout. This prevents messages from reappearing (causing duplicate processing) if Lambda runs up to its timeout limit.',
      },
      {
        q: 'What is a Dead Letter Queue (DLQ) used for?',
        options: [
          'Storing messages that were successfully processed',
          'Buffering messages during high-traffic periods',
          'Capturing messages that failed processing after the maximum number of retries',
          'Archiving messages older than 14 days',
        ],
        correct: 2,
        explanation: 'DLQs catch poison-pill messages — ones that consistently fail processing. Without a DLQ, failed messages loop forever, blocking the queue. With a DLQ, they\'re isolated after N retries so you can inspect and replay them.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a Lambda handler that processes SQS records. For each record, parse the JSON body and call `processItem(item)`. If any record fails, throw an error with the failed record IDs so SQS can retry those specific records (partial batch response). Return `{ batchItemFailures: [...] }`.',
      starterCode: `async function processItem(item) {
  // Simulated async processing — may throw
  if (!item.id) throw new Error('Missing id')
  return item
}

export const handler = async (event) => {
  const failures = []

  // Process each record in event.Records
  // On failure, push { itemIdentifier: record.messageId } to failures
  // Return { batchItemFailures: failures }
}`,
      solution: `async function processItem(item) {
  if (!item.id) throw new Error('Missing id')
  return item
}

export const handler = async (event) => {
  const failures = []

  for (const record of event.Records) {
    try {
      const item = JSON.parse(record.body)
      await processItem(item)
    } catch (err) {
      failures.push({ itemIdentifier: record.messageId })
    }
  }

  return { batchItemFailures: failures }
}`,
      hints: [
        'Wrap each record in a try/catch — don\'t let one failure kill the whole batch',
        'On failure, push { itemIdentifier: record.messageId } to the failures array',
        'SQS partial batch response: return { batchItemFailures: failures } — successful records are deleted, failed ones return to the queue',
      ],
    },
  },

  // ── Module 6 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m06',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Containers on AWS — ECS, ECR & Fargate',
    subtitle: 'Containerize your app, push to ECR, and run it on Fargate without managing servers',
    level: 'Masters',
    xp: 215,
    duration: 19,
    module: 6,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Build and push a Docker image to ECR, define an ECS task definition, and run a Fargate service behind a load balancer with auto-scaling.',
    keyTerms: [
      { term: 'ECR (Elastic Container Registry)', definition: 'AWS\'s fully managed Docker image registry. Store, version, and scan Docker images. Private by default. Integrated with ECS and Lambda for seamless deployments.' },
      { term: 'ECS (Elastic Container Service)', definition: 'AWS\'s container orchestration service. Manages when and where Docker containers run. Two launch types: EC2 (you manage the host VMs) and Fargate (AWS manages the hosts).' },
      { term: 'Fargate', definition: 'A serverless compute engine for containers. You define CPU/memory requirements; AWS runs the container on managed infrastructure. No EC2 instances to patch, no cluster capacity to manage.' },
      { term: 'Task Definition', definition: 'A blueprint for your containerized application. Specifies the Docker image, CPU/memory, environment variables, port mappings, logging config, and IAM role. Versioned — each update creates a new revision.' },
      { term: 'ECS Service', definition: 'Maintains a desired number of running task instances. Integrates with ALB for load balancing and can auto-scale based on CPU, memory, or custom CloudWatch metrics.' },
      { term: 'Task Role', definition: 'An IAM role assigned to running ECS tasks. Gives your container the permissions it needs (e.g., S3 read, SQS write) without hardcoding credentials. Credentials are fetched from the instance metadata service.' },
    ],
    content: `## Containers on AWS — ECS, ECR & Fargate

### Why Containers on AWS

Containers solve "works on my machine." You package your app + runtime + dependencies into a Docker image; it runs identically everywhere.

AWS offers three levels of container management:
1. **ECS on EC2** — you manage the host VMs, AWS manages orchestration
2. **ECS on Fargate** — AWS manages everything, you specify CPU/memory
3. **EKS** — Kubernetes on AWS (for complex multi-team microservices)

For most applications: **start with Fargate**.

### ECR — Image Registry

Before ECS can run your container, the image must be in a registry. ECR is the AWS-native choice.

\`\`\`bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin \\
  123456789.dkr.ecr.us-east-1.amazonaws.com

# Create a repository
aws ecr create-repository --repository-name my-app

# Build, tag, and push
docker build -t my-app .
docker tag my-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
\`\`\`

ECR Image Scanning checks your image for known CVEs. Enable on push:

\`\`\`bash
aws ecr put-image-scanning-configuration \\
  --repository-name my-app \\
  --image-scanning-configuration scanOnPush=true
\`\`\`

### Task Definition

A task definition is the blueprint. Key fields:

\`\`\`json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789:role/my-app-task-role",
  "containerDefinitions": [
    {
      "name": "my-app",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "arn:aws:ssm:us-east-1:...:parameter/db-url" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
\`\`\`

**Two IAM roles:**
- **executionRoleArn** — used by ECS itself to pull the image from ECR and write logs to CloudWatch
- **taskRoleArn** — used by your application code to call other AWS services (S3, SQS, etc.)

### Fargate Service with ALB

The complete production setup:

\`\`\`
Internet → ALB (public subnet) → Target Group → Fargate Tasks (private subnet)
                                                        ↕
                                                   RDS (DB subnet)
\`\`\`

Auto-scaling keeps the task count right-sized. Scale on CPU:

\`\`\`bash
# Register scalable target
aws application-autoscaling register-scalable-target \\
  --service-namespace ecs \\
  --resource-id service/my-cluster/my-service \\
  --scalable-dimension ecs:service:DesiredCount \\
  --min-capacity 2 --max-capacity 10

# Scale when CPU > 70%
aws application-autoscaling put-scaling-policy \\
  --policy-name cpu-scaling \\
  --service-namespace ecs \\
  --resource-id service/my-cluster/my-service \\
  --scalable-dimension ecs:service:DesiredCount \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    }
  }'
\`\`\`

### Secrets Management

Never put secrets in environment variables in plain text or in your Docker image. Use AWS Secrets Manager or Parameter Store:

\`\`\`bash
# Store a secret
aws ssm put-parameter \\
  --name /my-app/database-url \\
  --value "postgres://..." \\
  --type SecureString

# Reference it in task definition via "secrets" array (shown above)
# ECS injects it as an environment variable at runtime
\`\`\``,
    quiz: [
      {
        q: 'What is the difference between the ECS Task Execution Role and the Task Role?',
        options: [
          'Execution Role is for the app; Task Role is for ECS infrastructure',
          'Execution Role is used by ECS to pull images and write logs; Task Role is used by your application code',
          'They are the same role with different names',
          'Execution Role applies to EC2 launch type; Task Role applies to Fargate',
        ],
        correct: 1,
        explanation: 'The Execution Role is assumed by the ECS agent — it needs permissions to pull from ECR and push logs to CloudWatch. The Task Role is assumed by your running container — it grants permissions your app needs (S3 access, SQS writes, etc.). These are separate for least-privilege.',
      },
      {
        q: 'Why should secrets like DATABASE_URL NOT be in the container image?',
        options: [
          'Container images cannot store strings',
          'Images are often stored in registries and pulled by multiple people — baking in secrets exposes them to anyone with registry access',
          'ECS does not support environment variables',
          'Secrets in images cause performance issues',
        ],
        correct: 1,
        explanation: 'Docker images are versioned artifacts stored in registries. A secret baked into an image is accessible to anyone who can pull that image, it persists forever in image history, and you cannot rotate it without rebuilding. Use Secrets Manager or SSM Parameter Store and inject at runtime.',
      },
      {
        q: 'You want ECS to automatically add more task instances when CPU usage exceeds 70%. What should you configure?',
        options: [
          'CloudWatch alarm that sends SNS notifications',
          'Application Auto Scaling with a TargetTrackingScaling policy on ECSServiceAverageCPUUtilization',
          'Manually update the desired task count via the console',
          'EC2 Auto Scaling on the host instances',
        ],
        correct: 1,
        explanation: 'ECS services integrate with Application Auto Scaling. A TargetTrackingScaling policy continuously adjusts the desired task count to maintain the target CPU percentage — scale out when above 70%, scale in when below.',
      },
      {
        q: 'In Fargate, what do you NOT need to manage compared to ECS on EC2?',
        options: [
          'Task definitions',
          'IAM roles for tasks',
          'The underlying EC2 host instances (OS patching, capacity)',
          'Docker images',
        ],
        correct: 2,
        explanation: 'Fargate\'s key value proposition: no EC2 instances to provision, patch, or right-size. You define CPU and memory requirements per task; AWS handles where and how they run. You still manage task definitions, IAM roles, and Docker images.',
      },
    ],
  },

  // ── Module 7 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m07',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'DevOps on AWS — CloudFormation, CDK & CloudWatch',
    subtitle: 'Infrastructure as code, CI/CD pipelines, and production observability',
    level: 'PhD',
    xp: 250,
    duration: 19,
    module: 7,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Define AWS infrastructure as code with CDK, set up a CI/CD pipeline that deploys on git push, and instrument your application with CloudWatch metrics, logs, and alarms.',
    keyTerms: [
      { term: 'CloudFormation', definition: 'AWS\'s infrastructure-as-code service. You define resources in JSON/YAML templates; CloudFormation creates, updates, and deletes them in dependency order. The foundational layer under CDK and SAM.' },
      { term: 'CDK (Cloud Development Kit)', definition: 'A framework for defining AWS infrastructure using real programming languages (TypeScript, Python, Java, etc.). CDK synthesizes to CloudFormation templates under the hood.' },
      { term: 'Stack', definition: 'In CloudFormation/CDK: a collection of AWS resources deployed and managed as a unit. One deployment = one stack. Stacks can reference each other via cross-stack outputs.' },
      { term: 'CloudWatch', definition: 'AWS\'s observability service. Collects metrics (CPU, latency, error rates), logs (application and infrastructure), and fires alarms when thresholds are breached.' },
      { term: 'CloudWatch Alarms', definition: 'Monitors a metric and triggers an action (SNS notification, Auto Scaling, Systems Manager) when the metric crosses a threshold for a defined period. The foundation of production alerting.' },
      { term: 'CodePipeline', definition: 'AWS\'s CI/CD pipeline service. Orchestrates stages: source (GitHub/CodeCommit), build (CodeBuild), test, and deploy (CodeDeploy, ECS, Lambda). Triggered on git push.' },
    ],
    content: `## DevOps on AWS — CloudFormation, CDK & CloudWatch

### Why Infrastructure as Code

Clicking through the AWS console creates infrastructure nobody can reproduce. Infrastructure as Code (IaC) means:
- **Reproducibility** — run the same template in dev, staging, prod
- **Version control** — infra changes go through pull requests
- **Auditability** — what changed and when is in git history
- **Automation** — pipelines deploy infra changes automatically

### CDK — Infrastructure in TypeScript

CDK lets you write AWS infrastructure in TypeScript (or Python, Java, etc.) with full IDE support, type safety, and reuse.

\`\`\`typescript
import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class MyAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // S3 bucket for uploads
    const bucket = new s3.Bucket(this, 'UploadsBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    })

    // Lambda function
    const handler = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    })

    // Grant Lambda read/write access to the bucket
    bucket.grantReadWrite(handler)

    // API Gateway in front of Lambda
    new apigateway.RestApi(this, 'Api', {
      defaultIntegration: new apigateway.LambdaIntegration(handler),
    })
  }
}
\`\`\`

\`\`\`bash
cdk synth   # Generate CloudFormation template (inspect what will be created)
cdk diff    # Show changes vs. deployed stack
cdk deploy  # Deploy the stack
\`\`\`

### CI/CD with GitHub Actions → AWS

The most common pipeline pattern in 2024: GitHub Actions triggers on push, builds and pushes a Docker image to ECR, then deploys to ECS Fargate.

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-role
          aws-region: us-east-1

      - name: Login to ECR
        id: ecr-login
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        run: |
          IMAGE=${{ steps.ecr-login.outputs.registry }}/my-app:${{ github.sha }}
          docker build -t $IMAGE .
          docker push $IMAGE
          echo "IMAGE=$IMAGE" >> $GITHUB_ENV

      - name: Deploy to ECS
        run: |
          aws ecs update-service \\
            --cluster my-cluster \\
            --service my-service \\
            --force-new-deployment
\`\`\`

**OIDC for GitHub Actions** — use IAM roles with OIDC instead of long-lived access keys. GitHub Actions requests a short-lived token from AWS; no secrets stored in GitHub.

### CloudWatch Observability

The three pillars of observability: **metrics**, **logs**, **traces**.

**Structured logging from Lambda/Node.js:**

\`\`\`javascript
export const handler = async (event) => {
  console.log(JSON.stringify({
    level: 'INFO',
    requestId: event.requestContext?.requestId,
    path: event.rawPath,
    message: 'Request received',
  }))

  try {
    const result = await processRequest(event)
    return { statusCode: 200, body: JSON.stringify(result) }
  } catch (err) {
    console.error(JSON.stringify({
      level: 'ERROR',
      message: err.message,
      stack: err.stack,
    }))
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
\`\`\`

**CloudWatch Alarms — essential alarms for production:**

\`\`\`
Lambda Error Rate    > 1%  → PagerDuty/SNS alert
Lambda P99 Duration > 3s  → Slack alert
RDS CPU             > 80% → Slack alert
ALB 5xx Rate        > 0.1% → PagerDuty alert
SQS Queue Depth     > 1000 → Slack alert (processing backed up)
\`\`\`

**Log Insights query for error analysis:**

\`\`\`sql
fields @timestamp, level, message, requestId
| filter level = "ERROR"
| sort @timestamp desc
| limit 20
\`\`\``,
    quiz: [
      {
        q: 'What does `cdk synth` do?',
        options: [
          'Deploys the stack to AWS immediately',
          'Synthesizes the CDK code into CloudFormation JSON/YAML templates without deploying',
          'Runs unit tests on CDK constructs',
          'Destroys all resources in the stack',
        ],
        correct: 1,
        explanation: '`cdk synth` compiles your CDK TypeScript into CloudFormation templates and outputs them to the `cdk.out/` directory. This lets you inspect exactly what will be created before deploying — useful for code reviews and security audits.',
      },
      {
        q: 'Why should GitHub Actions use OIDC roles instead of IAM access key pairs?',
        options: [
          'OIDC roles have higher rate limits',
          'Access keys cannot be used in GitHub Actions',
          'OIDC issues short-lived credentials per job run; no long-lived secrets stored in GitHub settings',
          'OIDC roles are faster to configure than access keys',
        ],
        correct: 2,
        explanation: 'Long-lived IAM access keys are a security liability — if GitHub is breached, the keys are exposed indefinitely. OIDC tokens are issued per job, expire quickly, and never need to be stored as secrets.',
      },
      {
        q: 'What is the advantage of structured (JSON) logging over plain text logs?',
        options: [
          'JSON logs are compressed automatically',
          'Structured logs can be queried, filtered, and aggregated in CloudWatch Logs Insights using field-level queries',
          'AWS charges less for JSON log storage',
          'Plain text logs are not supported by Lambda',
        ],
        correct: 1,
        explanation: 'Structured JSON logs let you query specific fields: filter by level = "ERROR", extract requestId, compute p99 duration. Plain text logs require regex parsing. In production at scale, structured logs are essential.',
      },
      {
        q: 'You want an alert when your Lambda error rate exceeds 1% over a 5-minute window. What AWS service powers this?',
        options: ['CloudTrail', 'AWS Config', 'CloudWatch Alarms', 'AWS Trusted Advisor'],
        correct: 2,
        explanation: 'CloudWatch Alarms monitor a metric (Lambda Errors / Lambda Invocations) over a time window and trigger actions (SNS notification, Auto Scaling) when the threshold is breached.',
      },
    ],
  },

  // ── Module 8 ─────────────────────────────────────────────────────────────
  {
    id: 'cc-aws-m08',
    track: 'crash',
    crashId: 'cc-aws',
    crashTitle: 'AWS',
    certArea: 'AWS Crash Course',
    title: 'Capstone — Architect & Deploy a Production App on AWS',
    subtitle: 'Design a full-stack architecture from scratch: VPC, ECS, RDS, S3, CDN, CI/CD, monitoring',
    level: 'PhD',
    xp: 280,
    duration: 22,
    module: 8,
    courseObjective: COURSE_OBJECTIVE,
    moduleObjective:
      'Synthesize all previous modules into a complete production architecture diagram and deployment plan, understand the cost model, and walk through the critical decisions every AWS architect makes.',
    keyTerms: [
      { term: 'CloudFront', definition: 'AWS\'s CDN (Content Delivery Network). Caches static assets (images, JS, CSS) at 450+ edge locations worldwide. Dramatically reduces latency for global users and reduces origin server load. Also used to serve S3 content with a custom domain.' },
      { term: 'Route 53', definition: 'AWS\'s DNS service. Maps domain names to IP addresses or AWS resources. Supports routing policies: Simple, Weighted (A/B traffic splits), Latency-based (route to nearest region), Failover (health check-based).' },
      { term: 'ACM (AWS Certificate Manager)', definition: 'Free TLS/SSL certificates for AWS services (CloudFront, ALB, API Gateway). Auto-renews. Does not work directly with EC2 — use Let\'s Encrypt for EC2 or put an ALB in front.' },
      { term: 'Well-Architected Framework', definition: 'AWS\'s 6-pillar framework for evaluating architectures: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability. The checklist every production system should be measured against.' },
      { term: 'Reserved Instances / Savings Plans', definition: 'Commit to 1 or 3 years of EC2/Fargate/Lambda usage for 30–72% discount over on-demand pricing. Savings Plans are flexible (apply across instance types); Reserved Instances are specific to a type/AZ.' },
      { term: 'Cost Explorer', definition: 'AWS\'s tool for visualizing and analyzing spending. Break down costs by service, region, tag, or linked account. Use resource tags to attribute costs to teams, projects, or environments.' },
    ],
    content: `## Capstone — Architect & Deploy a Production App on AWS

### The Production Architecture

You've learned every major service. Now see how they compose into a real system.

**Use case**: a Next.js web app with user auth, file uploads, a background job processor, and a REST API.

\`\`\`
                    ┌─────────────────────────────────────────────┐
                    │                    Users                    │
                    └──────────────────────┬──────────────────────┘
                                           │
                               ┌───────────▼────────────┐
                               │      Route 53 (DNS)    │
                               └───────────┬────────────┘
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │         CloudFront (CDN + TLS via ACM)      │
                    │  Static assets cached at edge / S3 origin   │
                    └──────────────┬──────────────┬───────────────┘
                                   │              │
                    ┌──────────────▼──┐      ┌────▼───────────────┐
                    │   S3 (Static    │      │  ALB (Application  │
                    │   Next.js build)│      │  Load Balancer)    │
                    └─────────────────┘      └────────┬───────────┘
                                                      │
                    ┌─────────────────────────────────▼──────────────────┐
                    │                  Private Subnet                    │
                    │  ┌─────────────────────┐  ┌──────────────────────┐ │
                    │  │  ECS Fargate         │  │  ECS Fargate         │ │
                    │  │  (Next.js API / SSR) │  │  (Background Worker) │ │
                    │  └──────────┬──────────┘  └──────────┬───────────┘ │
                    └─────────────┼────────────────────────┼─────────────┘
                                  │                        │
                    ┌─────────────▼──────┐    ┌────────────▼────────────┐
                    │  RDS PostgreSQL     │    │  SQS Queue              │
                    │  (Multi-AZ)         │    │  (job queue)            │
                    └────────────────────┘    └─────────────────────────┘

                    Additional services:
                    ├── S3 bucket (user file uploads, via pre-signed URLs)
                    ├── ElastiCache Redis (session store, caching)
                    ├── CloudWatch (logs, metrics, alarms)
                    └── Secrets Manager (DB password, API keys)
\`\`\`

### Critical Architecture Decisions

**1. Where does the Next.js app run?**

| Option | Trade-off |
|---|---|
| ECS Fargate | Full SSR/ISR support, auto-scaling, production-ready |
| Lambda + API GW | Cheaper at low traffic, cold starts hurt SSR |
| S3 + CloudFront | Static-only (no SSR), cheapest |

For a full Next.js app with auth: **ECS Fargate**.

**2. Database sizing**

Start with `db.t3.micro` (2 vCPU, 1 GB RAM) for dev/staging. Production: `db.t3.medium` minimum, scale up based on query latency (target < 10ms p99 for simple queries). Enable Multi-AZ on day one.

**3. File uploads**

Never route uploads through your app server — they consume memory and time. Pattern:

\`\`\`
1. Client requests a pre-signed S3 PUT URL from your API
2. Client uploads directly to S3 (bypass your server)
3. S3 triggers a Lambda or sends to SQS for post-processing
\`\`\`

**4. Secrets**

\`\`\`
Environment variable in task definition → SSM Parameter Store (free, simple)
Rotation needed (DB passwords, API keys) → Secrets Manager ($0.40/secret/month)
\`\`\`

### The Deployment Pipeline

\`\`\`
Developer pushes to main
        ↓
GitHub Actions
  ├── Run tests
  ├── docker build + push to ECR (tagged with git SHA)
  ├── cdk deploy (if infrastructure changed)
  └── aws ecs update-service --force-new-deployment
        ↓
ECS performs a rolling deployment
  ├── Launches new tasks with new image
  ├── ALB routes to new tasks once health checks pass
  └── Drains and terminates old tasks
\`\`\`

Zero-downtime deployments by default with ECS rolling updates and ALB health checks.

### Cost Model for This Architecture

Rough monthly costs (us-east-1, low traffic startup):

| Service | Cost |
|---|---|
| ECS Fargate (2× 0.5 vCPU, 1 GB) | ~$25/mo |
| RDS db.t3.micro Multi-AZ | ~$30/mo |
| ALB | ~$20/mo |
| CloudFront (first 1 TB free) | ~$0–8/mo |
| S3 (50 GB) | ~$1.15/mo |
| NAT Gateway | ~$32/mo |
| CloudWatch logs | ~$2/mo |
| **Total** | **~$115/mo** |

**Biggest levers to reduce cost:**
1. NAT Gateway — most expensive for small apps. Use a NAT Instance ($3/mo) or VPC Endpoints for common services
2. RDS — use Aurora Serverless v2 for dev (scales to zero)
3. Fargate — use Fargate Spot (up to 70% discount for fault-tolerant workloads)

### The Well-Architected Checklist

Before going to production, review these 5 key questions:

1. **Reliability**: What happens if one AZ fails? (Answer: multi-AZ everywhere)
2. **Security**: Is there any path from the internet to the database? (Answer: should be no)
3. **Cost**: Is NAT Gateway running for dev environments 24/7? (Answer: turn off dev after hours)
4. **Performance**: Where will you see the first bottleneck at 10× current load? (Answer: RDS — add read replica)
5. **Operations**: If an alert fires at 3am, can you diagnose from CloudWatch alone? (Answer: structured logs + dashboards)`,
    quiz: [
      {
        q: 'Why should file uploads go directly from the client to S3 (via pre-signed URLs) rather than through your app server?',
        options: [
          'S3 does not accept uploads from backend servers',
          'Routing uploads through the app server consumes memory, CPU, and connection time, limiting throughput and increasing costs',
          'Pre-signed URLs are required by AWS terms of service',
          'The app server has no network access to S3',
        ],
        correct: 1,
        explanation: 'A 100 MB upload routed through your server occupies a Fargate task\'s connection and memory for seconds. At scale, this creates a bottleneck. Direct-to-S3 uploads bypass your server entirely — your server just issues the pre-signed URL and gets out of the way.',
      },
      {
        q: 'CloudFront is placed in front of your ALB and S3. What does it add?',
        options: [
          'Database connection pooling',
          'Edge caching of responses, TLS termination at edge locations globally, and DDoS protection via AWS Shield Standard',
          'Automatic database failover',
          'IAM-based access control for all API endpoints',
        ],
        correct: 1,
        explanation: 'CloudFront is a CDN — it caches responses at 450+ edge locations so users get responses from the nearest point instead of traveling to your origin region. It also terminates TLS at the edge and includes basic DDoS protection at no extra cost.',
      },
      {
        q: 'What is the single biggest monthly cost driver for a small AWS architecture?',
        options: ['S3 storage', 'Lambda invocations', 'NAT Gateway data processing and hourly fees', 'CloudWatch logs'],
        correct: 2,
        explanation: 'NAT Gateway charges $0.045/GB for data processed plus an hourly fee — it adds up to ~$32+/month for small applications. For dev environments, consider a t3.nano NAT instance (~$3/mo) or VPC Endpoints for S3 and DynamoDB which bypass NAT Gateway entirely.',
      },
      {
        q: 'You want zero-downtime deployments for your ECS service. What provides this by default?',
        options: [
          'You must write a custom blue/green deploy script',
          'ECS rolling updates: new tasks pass ALB health checks before old tasks are drained',
          'CloudFormation automatically handles zero-downtime for all services',
          'EC2 Auto Scaling groups manage this automatically',
        ],
        correct: 1,
        explanation: 'ECS rolling updates launch new tasks and wait for them to pass the ALB health check before draining connections from old tasks. No custom scripting needed — configure the deployment minimum healthy percent (100%) and maximum percent (200%) in the service definition.',
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Write a CDK stack class `ApiStack` that creates: (1) an S3 bucket with versioning enabled and all public access blocked, (2) a Lambda function (Node 20, handler "index.handler") that receives the bucket name as an environment variable `BUCKET_NAME`, and (3) grants the Lambda read/write access to the bucket. Use TypeScript-style imports from `aws-cdk-lib`.',
      starterCode: `import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'

export class ApiStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    // 1. Create S3 bucket with versioning + block public access

    // 2. Create Lambda function with BUCKET_NAME env var

    // 3. Grant Lambda read/write to bucket

  }
}`,
      solution: `import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'

export class ApiStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'AppBucket', {
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    })

    const handler = new lambda.Function(this, 'AppHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    })

    bucket.grantReadWrite(handler)
  }
}`,
      hints: [
        'new s3.Bucket(this, "id", { versioned: true, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL })',
        'new lambda.Function(this, "id", { runtime, code, handler, environment: { BUCKET_NAME: bucket.bucketName } })',
        'bucket.grantReadWrite(handler) — this automatically creates and attaches the right IAM policy to the Lambda\'s role',
      ],
    },
  },
]
