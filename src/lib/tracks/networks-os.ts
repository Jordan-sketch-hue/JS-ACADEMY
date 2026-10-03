import type { Course } from '../courses'

export const nosCourses: Course[] = [
  {
    id: 'nos-m01',
    track: 'networks-os' as any,
    title: 'TCP/IP & Network Fundamentals',
    subtitle: 'How data travels across the internet — protocols, layers, and addressing',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'OSI Model', definition: 'A conceptual framework dividing network communication into 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application; each layer provides services to the layer above and uses services from the layer below.' },
      { term: 'TCP vs UDP', definition: 'TCP provides reliable, ordered, connection-oriented delivery with flow control and error correction; UDP is connectionless, unordered, and unreliable but faster — suitable for real-time applications where latency matters more than reliability.' },
      { term: 'IP Address', definition: 'A numerical label (IPv4: 32-bit, IPv6: 128-bit) identifying a device on a network; routers use the network portion to route packets; the host portion identifies the specific device within a subnet.' },
      { term: 'Subnet Mask', definition: 'A 32-bit number that divides an IP address into network and host portions; CIDR notation (192.168.1.0/24) indicates the number of bits in the network portion; determines which addresses are local vs require routing.' },
      { term: 'Three-Way Handshake', definition: 'TCP connection establishment: SYN (client requests connection) → SYN-ACK (server acknowledges and responds) → ACK (client acknowledges). Establishes sequence numbers for reliable delivery; terminated with FIN-FIN or RST.' },
    ],
    content: `## TCP/IP & Network Fundamentals

Every web request, database query, API call, and real-time update travels over a network. Understanding how that happens — the protocols, the layers, and the mechanics — is foundational for every software engineer who builds systems that communicate.

### The OSI Model

The OSI model conceptually divides network communication into 7 layers:

**Layer 7 - Application**: user-facing protocols — HTTP, FTP, SMTP, DNS, WebSocket. The data your application creates and consumes.

**Layer 6 - Presentation**: data encoding and encryption — TLS operates here (though it spans 5-7 in practice), character encoding (UTF-8), compression.

**Layer 5 - Session**: managing session state between communicating parties. Largely absorbed into application protocols in modern systems.

**Layer 4 - Transport**: end-to-end communication — TCP (reliable, ordered), UDP (fast, unreliable). Port numbers live here — they identify which application on a host should receive data.

**Layer 3 - Network**: logical addressing and routing — IP addresses, routers. Packets (IP packets) travel from source to destination, potentially through many routers.

**Layer 2 - Data Link**: node-to-node communication on a local network segment — MAC addresses, Ethernet, WiFi. Frames travel between devices on the same network.

**Layer 1 - Physical**: electrical signals, optical signals, radio waves. The actual bits on the wire.

**How encapsulation works**: application data becomes a segment (TCP adds port, sequence number) → packet (IP adds source/destination addresses) → frame (Ethernet adds MAC addresses, CRC) → bits on wire. At the destination, each layer strips its header and passes data up.

### IP Addressing

IPv4 uses 32-bit addresses written as four octets: 192.168.1.100. With only 4.3 billion possible addresses, IPv4 address exhaustion drove the need for NAT (Network Address Translation) — private address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) used in homes and offices, with a single public IP shared by many devices.

IPv6 uses 128-bit addresses written in hex: 2001:0db8:85a3::8a2e:0370:7334. The address space is vast enough to give every atom on Earth an address.

**CIDR notation**: 192.168.1.0/24 means the first 24 bits (192.168.1) are the network, the last 8 bits are hosts. /24 gives 254 usable hosts; /16 gives 65,534; /8 gives 16,777,214.

**Routing**: a router maintains a routing table mapping destination networks to next-hop addresses. When a packet arrives, the router finds the most specific matching route and forwards the packet to the next hop.

### TCP: Reliable Delivery

TCP provides reliable, ordered, connection-oriented communication:

**Connection establishment (three-way handshake)**:
1. Client sends SYN with Initial Sequence Number (ISN_C)
2. Server responds with SYN-ACK: acknowledges client's ISN and provides its own ISN_S
3. Client sends ACK: acknowledges server's ISN

Both sides now have agreed-upon sequence numbers for tracking which bytes have been delivered.

**Sequence numbers**: every byte sent has a sequence number. The receiver acknowledges bytes received. If an acknowledgment isn't received within a timeout, the sender retransmits. This guarantees every byte arrives exactly once, in order.

**Flow control (sliding window)**: the receiver advertises how much buffer space it has. The sender won't send faster than the receiver can consume. Prevents overwhelming a slow receiver.

**Congestion control**: TCP infers network congestion from packet loss and adjusts its sending rate. Algorithms: slow start, AIMD (Additive Increase Multiplicative Decrease), CUBIC, BBR. This is why a file transfer slows when a network is congested.

**Connection teardown**: FIN-ACK → ACK → FIN-ACK → ACK (four-way handshake). TIME_WAIT ensures any delayed packets are absorbed before the port is reused.

### UDP: Speed Over Reliability

UDP adds nothing to IP except source/destination ports and a checksum. No connection, no acknowledgment, no ordering guarantees.

**Use cases**:
- **DNS**: one small request, one small response. Retrying is cheap; TCP overhead isn't worth it.
- **Video streaming / WebRTC**: a late video frame is worthless; better to drop it and show the next one than to wait for retransmission.
- **Gaming**: game state updates happen so frequently that a missed packet is less harmful than the latency of TCP's retransmission.
- **QUIC (HTTP/3)**: UDP-based protocol implementing its own reliability and multiplexing — avoids TCP's head-of-line blocking.

### DNS: The Internet's Phone Book

DNS (Domain Name System) translates human-readable hostnames (jsupremetech.online) to IP addresses (104.21.33.211).

**Resolution chain**:
1. Browser cache
2. OS cache / /etc/hosts
3. Recursive resolver (your ISP or 8.8.8.8)
4. Root nameserver (knows TLD servers)
5. TLD nameserver (.online knows the authoritative server for jsupremetech.online)
6. Authoritative nameserver → returns the IP

**DNS record types**:
- **A**: hostname → IPv4 address
- **AAAA**: hostname → IPv6 address
- **CNAME**: alias → another hostname
- **MX**: mail server for domain
- **TXT**: arbitrary text (used for SPF, DKIM, site verification)
- **NS**: nameserver for domain

TTL (Time To Live) controls caching. Short TTL (60s) enables fast failover; long TTL (86400s) reduces DNS lookup overhead.

### HTTP/HTTPS Protocol

HTTP is an application-layer protocol over TCP. Key elements:

**Request**: method (GET, POST, PUT, DELETE, etc.), URL, headers (Host, Content-Type, Authorization, etc.), optional body.

**Response**: status code (200 OK, 404 Not Found, 500 Internal Server Error), headers, body.

**HTTP/1.1** vs **HTTP/2** vs **HTTP/3**:
- HTTP/1.1: one request per connection at a time (keep-alive allows reuse but not parallelism); head-of-line blocking
- HTTP/2: multiplexing — many requests in parallel over one TCP connection; header compression (HPACK); server push
- HTTP/3 (QUIC): UDP-based; eliminates TCP head-of-line blocking; faster connection establishment; built-in encryption

**HTTPS = HTTP + TLS**: TLS (Transport Layer Security) provides encryption, authentication (certificates), and integrity. The TLS handshake happens after TCP connection and before HTTP requests.`,
    quiz: [
      {
        q: 'The TCP three-way handshake (SYN → SYN-ACK → ACK) establishes:',
        options: [
          'Encryption for the connection',
          'Agreed-upon sequence numbers enabling reliable, ordered delivery',
          'The maximum packet size for the connection',
          'Authentication between client and server',
        ],
        correct: 1,
        explanation: 'The three-way handshake exchanges Initial Sequence Numbers. Both sides now know where the other\'s byte stream starts — enabling sequencing and acknowledgment for reliable delivery.',
      },
      {
        q: 'UDP is preferred over TCP for real-time video streaming because:',
        options: [
          'UDP provides better security',
          'A late video frame is worthless — dropping a missed packet and continuing is better than waiting for TCP retransmission',
          'UDP has a larger maximum packet size',
          'UDP supports more concurrent connections',
        ],
        correct: 1,
        explanation: 'TCP retransmission introduces latency. In real-time media, a missing frame should be skipped — waiting for retransmission causes stutter. UDP\'s "fire and forget" matches real-time needs.',
      },
      {
        q: 'CIDR notation /24 in 192.168.1.0/24 means:',
        options: [
          '24 total hosts on the network',
          'The first 24 bits are the network address; the last 8 bits identify hosts (254 usable)',
          '24 routers in the path',
          'The network has 24-hour uptime guarantee',
        ],
        correct: 1,
        explanation: '/24 = 24-bit network prefix. 32 bits total - 24 = 8 host bits. 2^8 - 2 = 254 usable addresses (subtract network address and broadcast).',
      },
      {
        q: 'A CNAME DNS record differs from an A record in that it:',
        options: [
          'Provides IPv6 addresses instead of IPv4',
          'Maps a hostname to another hostname (alias), not directly to an IP address',
          'Is used only for email routing',
          'Has a longer TTL than A records',
        ],
        correct: 1,
        explanation: 'A record: hostname → IP. CNAME record: hostname → another hostname (which must eventually resolve to an IP via an A record). Used for subdomains pointing to a service\'s hostname (CDN, load balancer).',
      },
      {
        q: 'HTTP/2 improves on HTTP/1.1 primarily by:',
        options: [
          'Adding encryption that HTTP/1.1 does not have',
          'Multiplexing multiple requests over a single TCP connection, eliminating the sequential request bottleneck',
          'Using UDP instead of TCP',
          'Removing the need for TLS certificates',
        ],
        correct: 1,
        explanation: 'HTTP/1.1 handles one request at a time per connection (head-of-line blocking). HTTP/2 multiplexes — many requests in parallel over one connection, with header compression. Significant performance improvement.',
      },
    ],
  },
  {
    id: 'nos-m02',
    track: 'networks-os' as any,
    title: 'Operating System Internals',
    subtitle: 'Processes, memory, file systems — the layer between hardware and your code',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 2,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Process vs Thread', definition: 'A process is an independent program with its own address space, file handles, and resources; a thread is a unit of execution within a process sharing the process\'s address space and resources. Threads are cheaper to create and communicate faster but share fault domains.' },
      { term: 'Virtual Memory', definition: 'An abstraction giving each process the illusion of a large, private address space; the OS maps virtual addresses to physical RAM frames; pages not in RAM are stored on disk (swap) and loaded on demand (page fault).' },
      { term: 'System Call', definition: 'A mechanism by which user-space programs request services from the kernel (file I/O, network I/O, memory allocation, process creation); crossing the user/kernel boundary is expensive — reading a file requires multiple syscalls (open, read, close).' },
      { term: 'Scheduler', definition: 'The OS component that decides which process/thread runs on which CPU core at each moment; objectives include fairness, throughput, responsiveness, and CPU utilization; algorithms include round-robin, priority scheduling, CFS (Linux).' },
      { term: 'File Descriptor', definition: 'An integer handle (0=stdin, 1=stdout, 2=stderr, 3+ for opened files/sockets) that the kernel provides to user-space programs for I/O; a file descriptor represents an open file, socket, pipe, or device — everything in UNIX is a file.' },
    ],
    content: `## Operating System Internals

The operating system is the software layer between hardware and application programs. It manages hardware resources (CPU, memory, storage, devices), provides abstractions that make them easier to use, and ensures that multiple programs can run safely and fairly.

### Process Management

A **process** is a running instance of a program. It has:
- **Address space**: virtual memory the process can use (code, data, heap, stack)
- **File descriptors**: handles to open files and sockets
- **Process ID (PID)**: a unique integer identifier
- **State**: running, runnable (ready to run), blocked (waiting for I/O or a lock), zombie (finished but parent hasn't read exit status)

**Process lifecycle**: fork() creates a child process that is a copy of the parent; exec() replaces the current process's image with a new program; wait() lets the parent collect the child's exit status.

**A thread** shares the process's address space but has its own stack and registers. Threads within a process communicate through shared memory. Threads are faster to create and context-switch than processes (no address space switch). Downside: a bug in one thread (buffer overflow, use-after-free) can corrupt data for all threads.

**Context switching**: the CPU can only execute one thread per core at a time. The OS scheduler regularly switches which thread runs. A context switch saves the current thread's registers/stack pointer and restores the next thread's. Context switches are expensive (~microseconds) — this is why too many threads hurts performance.

### Scheduling

The scheduler decides which runnable thread gets the CPU. Key objectives:
- **Throughput**: maximize work completed per time unit
- **Latency**: minimize time from task arrival to completion
- **Fairness**: every thread gets CPU time proportional to its priority
- **CPU utilization**: keep the CPU busy (don't leave it idle while work is waiting)

**Round-robin**: each thread runs for a time slice (quantum), then yields to the next. Simple and fair but doesn't differentiate priorities.

**Priority scheduling**: higher-priority threads preempt lower-priority ones. Risk: priority inversion — a low-priority thread holds a lock that a high-priority thread needs; the low-priority thread can't run because of preemption; deadlock.

**CFS (Completely Fair Scheduler)**: Linux's scheduler. Tracks how much CPU time each thread has consumed and runs the thread with the least. Uses a red-black tree for efficient selection.

**I/O-bound vs CPU-bound**: I/O-bound processes (web servers, databases) spend most time waiting for I/O. CPU-bound processes (compression, ML training) use CPU continuously. Schedulers handle these differently.

### Memory Management

Programs use virtual addresses. The OS maps virtual addresses to physical memory frames through the **page table**. This enables:
- **Isolation**: each process sees a private address space; process A cannot read process B's memory
- **More memory than RAM**: pages not recently used can be swapped to disk; loaded back on page fault (at the cost of a disk read — 100,000x slower than RAM)
- **Memory-mapped files**: map file contents directly to virtual address space; efficient I/O for large files (databases, mmap'd files)

**Heap vs Stack**:
- **Stack**: fixed-size, LIFO, automatic allocation/deallocation. Local variables, function call frames. Stack overflow from deep recursion.
- **Heap**: dynamic, explicit allocation (malloc/free, new/delete, or GC). Objects created at runtime. Memory leaks from allocation without deallocation.

**Garbage Collection** (Go, Java, Python, JavaScript): automatically frees heap objects with no live references. Eliminates memory leaks and use-after-free but introduces GC pauses and overhead. Real-time systems (game engines, HFT) often avoid GC for predictability.

**Memory-mapped I/O**: \`mmap()\` maps a file (or device) into the virtual address space. Reads become memory accesses (served by the page cache if available; from disk if not). Databases (PostgreSQL, SQLite) use mmap for efficient buffer pool management.

### File Systems

A file system organizes data on storage devices:
- **Directory tree**: hierarchical namespace mapping names to inodes
- **Inode**: metadata about a file (size, permissions, timestamps, block pointers) without the name; a directory entry maps names to inode numbers
- **Blocks**: fixed-size units of storage on disk; a file's data is stored in blocks, referenced by the inode

**File system types**: ext4 (Linux standard), NTFS (Windows), APFS (macOS), ZFS (integrity + snapshots), btrfs. Each makes different tradeoffs on performance, integrity, and features.

**Journaling**: ext3/ext4, NTFS write a journal before committing changes to the file system. If the system crashes mid-operation, the journal enables recovery without a full fsck. Without journaling, crashes can corrupt file system structures.

**File descriptors and I/O modes**:
- **Buffered I/O**: library (stdio) buffers reads/writes; actual syscalls happen in large chunks. More efficient for sequential access.
- **Direct I/O**: bypasses the kernel page cache; goes straight to disk. Used by databases that manage their own caching.
- **Memory-mapped I/O**: treat file as memory array; kernel handles caching.
- **Async I/O / io_uring (Linux)**: submit I/O operations that execute without blocking the calling thread.

### Signals and Inter-Process Communication

**Signals**: asynchronous notifications sent to processes. SIGTERM (terminate gracefully), SIGKILL (terminate immediately, uncatchable), SIGHUP (reload config), SIGSEGV (segmentation fault — accessed invalid memory).

**IPC mechanisms**:
- **Pipes**: unidirectional byte stream between processes (\`ls | grep foo\` — the | is a pipe)
- **Unix domain sockets**: bidirectional, local-machine communication faster than TCP sockets
- **Shared memory**: processes map the same physical memory; fastest IPC but requires explicit synchronization
- **Message queues**: OS-managed FIFO queues for message passing between processes`,
    quiz: [
      {
        q: 'A process and a thread differ in that:',
        options: [
          'Threads are slower than processes',
          'Processes have isolated address spaces; threads within a process share the same address space and resources',
          'A process can only contain one thread',
          'Threads are for I/O; processes are for computation',
        ],
        correct: 1,
        explanation: 'Process isolation: each process has its own virtual address space. Threads share their process\'s address space — communication is fast but a bug in one thread can corrupt memory for all threads.',
      },
      {
        q: 'Virtual memory enables each process to:',
        options: [
          'Use physical RAM at native speeds without abstraction',
          'Have the illusion of a large private address space, with the OS handling mapping to physical RAM and swapping to disk',
          'Access other processes\' memory for inter-process communication',
          'Bypass the file system for faster storage',
        ],
        correct: 1,
        explanation: 'Virtual memory abstracts physical RAM: each process sees a private address space; the OS maps virtual pages to physical frames; unused pages can be swapped to disk. This enables isolation, overcommit, and more flexible memory use.',
      },
      {
        q: 'A system call (syscall) is needed for:',
        options: [
          'Arithmetic operations and local variable access',
          'Requesting kernel services like file I/O, network I/O, or memory allocation — operations that require hardware access or kernel privileges',
          'Calling functions in shared libraries',
          'Thread context switches',
        ],
        correct: 1,
        explanation: 'User-space code cannot directly access hardware or kernel data. Syscalls are the controlled gateway: open(), read(), write(), socket(), mmap() all cross into the kernel. This boundary crossing is expensive.',
      },
      {
        q: 'Journaling in file systems (ext4, NTFS) protects against:',
        options: [
          'Disk hardware failure',
          'File system corruption from crashes mid-operation, by recording intended operations before making them',
          'Unauthorized file access',
          'Running out of disk space',
        ],
        correct: 1,
        explanation: 'Journaling writes operations to a journal before applying them. On crash recovery, the journal is replayed to complete or roll back in-flight operations, maintaining file system consistency.',
      },
      {
        q: 'SIGKILL differs from SIGTERM in that:',
        options: [
          'SIGKILL is slower to terminate a process',
          'SIGKILL is sent by the kernel, not the user',
          'SIGKILL cannot be caught or ignored by the process — the kernel terminates it immediately; SIGTERM can be caught to allow graceful shutdown',
          'SIGTERM kills all threads; SIGKILL kills only the main thread',
        ],
        correct: 2,
        explanation: 'SIGTERM: sent to the process, which can catch it and clean up (close files, flush buffers, release locks) before exiting. SIGKILL: sent directly to the kernel\'s process scheduler — the process has no chance to handle it.',
      },
    ],
  },
  {
    id: 'nos-m03',
    track: 'networks-os' as any,
    title: 'Concurrency & Synchronization',
    subtitle: 'Threads, locks, race conditions, deadlocks — writing correct concurrent code',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 3,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Race Condition', definition: 'A bug where a program\'s behavior depends on the relative timing of two concurrent operations; occurs when shared state is accessed without synchronization and one operation\'s outcome depends on the other completing first.' },
      { term: 'Mutex (Mutual Exclusion)', definition: 'A synchronization primitive that allows only one thread to hold it at a time; threads that request a held mutex block until it is released; protects critical sections from concurrent access.' },
      { term: 'Deadlock', definition: 'A state where two or more threads are each waiting for a resource held by another, forming a cycle; none can proceed. Classic conditions: mutual exclusion, hold and wait, no preemption, circular wait — all four must hold.' },
      { term: 'Semaphore', definition: 'A synchronization primitive maintaining a count; threads decrement (wait/acquire) and increment (signal/release); binary semaphore (0/1) is equivalent to a mutex; counting semaphore limits concurrent access to N resources.' },
      { term: 'Async/Await (Event Loop)', definition: 'A concurrency model where one thread handles many concurrent I/O operations by interleaving them: when one operation blocks on I/O, the event loop runs another; suitable for I/O-bound workloads; not suitable for CPU-bound work.' },
    ],
    content: `## Concurrency & Synchronization

Concurrency is when a program has multiple things happening at the same time (or appearing to). Modern systems are inherently concurrent: web servers handle thousands of connections simultaneously, databases execute many transactions in parallel, and operating systems run multiple processes. Writing correct concurrent code is one of the hardest problems in software engineering.

### Why Concurrency Is Hard

Sequential code has a clear order: line 1 executes, then line 2, then line 3. Concurrent code has operations interleaving in ways that are non-deterministic — different orderings can produce different results, and the wrong ordering produces a bug.

**Race condition**: two threads access shared state without synchronization. The classic example:

Thread A: \`counter = counter + 1\`
Thread B: \`counter = counter + 1\`

Both read the same value (say, 5). Both add 1. Both write 6. Expected result: 7. Actual result: 6. Lost update.

Race conditions are insidious because they only manifest in specific timing conditions — the test passes most of the time, fails occasionally, and fails in production under load when timing conditions differ.

### Mutual Exclusion and Locks

A **mutex** (mutual exclusion lock) ensures only one thread executes a critical section at a time:

\`\`\`
mutex.lock()
counter = counter + 1   // critical section
mutex.unlock()
\`\`\`

The key property: if thread A holds the mutex, thread B calling mutex.lock() blocks until A releases it. This serializes access to the critical section, preventing the race.

**Lock granularity**: a single global lock is simple but serializes everything. Per-object locks allow more concurrency but are harder to reason about. Fine-grained locking is more scalable but more prone to deadlocks.

**Read-Write Locks (RWLock)**: for read-heavy workloads, many threads can read simultaneously (sharing the read lock), but writes require exclusive access (write lock). PostgreSQL's buffer cache uses this pattern extensively.

### Deadlock

Deadlock occurs when threads form a circular wait:
- Thread A holds lock L1 and waits for L2
- Thread B holds lock L2 and waits for L1
Neither can proceed.

**Coffman conditions** (all four must hold for deadlock):
1. **Mutual exclusion**: locks can only be held by one thread
2. **Hold and wait**: threads hold locks while waiting for others
3. **No preemption**: locks cannot be forcibly taken
4. **Circular wait**: a cycle of threads, each waiting for the next

**Prevention strategies**:
- **Lock ordering**: always acquire locks in a consistent order across all code paths. If all threads acquire L1 then L2 (never L2 then L1), circular wait is impossible.
- **Lock timeout**: if a lock cannot be acquired in X milliseconds, release all held locks and retry. Breaks deadlock but requires retry logic.
- **Deadlock detection**: detect cycles in the "waiting for" graph; force one thread to abort. Used by databases (deadlock → rollback one transaction).

### Semaphores and Higher-Level Primitives

A **semaphore** has a count. Wait decrements; signal increments. If count reaches 0, wait blocks.

**Binary semaphore** (count 0 or 1): equivalent to a mutex. **Counting semaphore**: allows N concurrent accesses. Used to limit connection pool size, rate-limit requests, or coordinate producer-consumer.

**Condition variables**: allow threads to wait for a condition without spinning:
\`\`\`
mutex.lock()
while (!condition_is_true) {
  cond.wait(mutex)  // atomically releases mutex and blocks
}
// condition is now true; mutex is re-acquired
mutex.unlock()
\`\`\`
Used with mutexes for producer-consumer, bounded buffers, and event signaling.

**Monitors** (Java's synchronized, Go's sync.Mutex with defer): encapsulate state and the lock protecting it; provide a cleaner pattern than raw mutex + condition variable.

### Lock-Free Data Structures

Lock-free algorithms use hardware atomic operations (Compare-And-Swap, CAS) to implement concurrent data structures without mutexes:

CAS: atomically checks if a memory location has an expected value and only updates if it does. If another thread changed it first, CAS fails and you retry.

Lock-free stacks, queues, and counters are possible but complex. Useful in hot paths where lock contention is a bottleneck. The ConcurrentLinkedQueue in Java, and Go's sync/atomic package implement these.

### Async/Await and the Event Loop

Thread-per-connection concurrency doesn't scale: a server with 10,000 concurrent connections would need 10,000 threads, consuming gigabytes of stack space and spending most time blocked on I/O.

**Event loop model** (Node.js, Python asyncio, JavaScript in browsers): a single thread handles many connections by interleaving I/O:
1. Submit I/O operation, register callback
2. Immediately handle other work
3. When I/O completes, callback fires

**async/await syntax** makes this readable:
\`\`\`javascript
async function fetchUser(id) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
  const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [id])
  return { user, orders }
}
\`\`\`
Each \`await\` yields back to the event loop; when the operation completes, execution resumes.

**Event loop limitations**: if one operation is CPU-intensive (image processing, cryptography, complex computation), it blocks the event loop and all other connections stall. CPU-bound work must run in a worker thread pool (Node.js worker_threads, Python multiprocessing).

### Go's Concurrency Model (CSP)

Go's goroutines are lightweight threads (2KB initial stack, millions can run simultaneously). Go's channels implement Communicating Sequential Processes (CSP):

\`don't communicate by sharing memory; share memory by communicating\`

Rather than locking shared data, goroutines pass data through channels:
\`\`\`go
ch := make(chan int)
go func() { ch <- expensiveComputation() }()
result := <-ch  // blocks until result is ready
\`\`\`

The select statement waits on multiple channels, implementing fan-in, timeouts, and cancellation patterns.`,
    quiz: [
      {
        q: 'Two threads both read counter=5, both add 1, and both write 6 — the expected value is 7 but the result is 6. This is:',
        options: [
          'A deadlock',
          'A race condition — unsynchronized access to shared state produces a lost update',
          'An integer overflow',
          'A priority inversion',
        ],
        correct: 1,
        explanation: 'Race condition: the read-modify-write sequence is non-atomic. Both threads read the same value before either writes. The second write overwrites the first, losing an update.',
      },
      {
        q: 'Lock ordering prevents deadlock by:',
        options: [
          'Preventing multiple threads from acquiring locks simultaneously',
          'Eliminating the circular wait condition — if all threads always acquire locks in the same order, no cycle can form',
          'Detecting when deadlock occurs and recovering',
          'Limiting the time a thread can hold a lock',
        ],
        correct: 1,
        explanation: 'Circular wait is one of the four Coffman conditions required for deadlock. Lock ordering eliminates it: if all code acquires L1 before L2, you can never have "A holds L1 waiting for L2" while "B holds L2 waiting for L1."',
      },
      {
        q: 'A counting semaphore with initial value 10 is useful for:',
        options: [
          'Ensuring at most 10 threads can enter a critical section simultaneously',
          'Counting 10 total operations',
          'Allowing 10 threads to wait for one signal',
          'Limiting execution to 10 seconds',
        ],
        correct: 0,
        explanation: 'A counting semaphore with value N allows N concurrent accesses. Each Wait decrements; each Signal increments. When count reaches 0, further Waits block. Used for connection pools, rate limiting, and resource allocation.',
      },
      {
        q: 'The event loop model (Node.js, asyncio) is inappropriate for:',
        options: [
          'Handling thousands of concurrent HTTP connections',
          'CPU-intensive operations like image compression — these block the loop and stall all other connections',
          'Database queries that return quickly',
          'WebSocket connections',
        ],
        correct: 1,
        explanation: 'The event loop is single-threaded. CPU-bound work blocks it entirely — no other connection can be served until the CPU work completes. CPU-bound work must be offloaded to worker threads.',
      },
      {
        q: 'Go\'s principle "don\'t communicate by sharing memory; share memory by communicating" means:',
        options: [
          'Go does not support shared memory',
          'Instead of locking shared variables, goroutines pass data through channels — the channel transfers both data and ownership, avoiding concurrent access',
          'Go channels are faster than mutexes',
          'Go programs should not use global variables',
        ],
        correct: 1,
        explanation: 'CSP-style concurrency: data flows through channels. At any time, only one goroutine has the channel value — no concurrent access, no locks needed. This eliminates a class of race conditions.',
      },
    ],
  },
  {
    id: 'nos-m04',
    track: 'networks-os' as any,
    title: 'Linux Command Line & Shell Scripting',
    subtitle: 'Mastering the terminal: files, processes, pipelines, and automation',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 4,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Pipeline', definition: 'A series of commands connected by pipe operators (|) where the standard output of each command becomes the standard input of the next; a fundamental Unix design pattern enabling composition of small tools into complex data transformations.' },
      { term: 'File Permissions', definition: 'Unix permissions (rwx) for owner, group, and others; expressed in octal (755 = rwxr-xr-x) or symbolic notation. setuid/setgid bits allow programs to run with the owner\'s privileges regardless of who executes them.' },
      { term: 'Environment Variable', definition: 'A named value in a process\'s environment, inherited by child processes; used to pass configuration (PATH, HOME, DATABASE_URL) without hardcoding; set with export VAR=value, accessed with $VAR.' },
      { term: 'Cron Job', definition: 'A scheduled task defined in the crontab, executed by the cron daemon at specified intervals; syntax: minute hour day month weekday command (e.g., 0 2 * * * /backup.sh — run at 2am daily).' },
      { term: 'Standard Streams', definition: 'Every process has three standard streams: stdin (0, input), stdout (1, output), stderr (2, errors); pipelines connect stdout of one command to stdin of the next; redirection (>, >>, 2>) writes streams to files.' },
    ],
    content: `## Linux Command Line & Shell Scripting

The command line is the most powerful interface to a computer. Developers who master the terminal work faster, automate repetitive tasks, debug more effectively, and understand their systems more deeply. Almost every server in the world runs Linux; knowing the shell is a professional requirement.

### Navigation and File Operations

\`\`\`bash
pwd              # print working directory
ls -la           # list files (l=long format, a=include hidden)
cd /var/log      # change directory (absolute path)
cd ..            # go up one level
cd ~             # go to home directory

mkdir -p /var/app/data     # create directory tree (-p: no error if exists)
cp -r src/ dest/           # copy recursively
mv old_name new_name       # move or rename
rm -rf directory/          # delete recursively (CAUTION: no undo)
ln -s /etc/nginx/nginx.conf nginx.conf  # symbolic link
\`\`\`

### File Viewing and Text Processing

\`\`\`bash
cat file.txt              # print entire file
head -n 20 file.txt       # first 20 lines
tail -n 100 file.txt      # last 100 lines
tail -f /var/log/app.log  # follow (real-time new lines — invaluable for logs)

grep -r "ERROR" /var/log/  # recursive grep
grep -n "function" src/*.ts  # show line numbers
grep -E "^[0-9]{4}" file     # extended regex

awk '{print $1, $3}' file    # print columns 1 and 3
sed 's/old/new/g' file.txt   # substitute globally
sort | uniq -c | sort -rn    # count occurrences, sort by frequency
wc -l file.txt               # count lines
\`\`\`

### Pipelines: The Unix Way

The Unix philosophy: programs that do one thing well, composable through pipes. Each command reads stdin, processes, writes stdout. Pipelines are the composition operator.

\`\`\`bash
# Count unique IP addresses in an access log
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# Find the 10 largest files in a directory
du -sh * | sort -rh | head -10

# Extract all email addresses from a file
grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' file.txt | sort -u

# Watch a process's CPU usage
watch -n 1 'ps aux | grep node | grep -v grep'
\`\`\`

### Process Management

\`\`\`bash
ps aux               # list all processes
top / htop           # interactive process monitor
kill -9 PID          # SIGKILL (force kill)
kill -15 PID         # SIGTERM (graceful shutdown)
killall nginx        # kill all processes named nginx

# Background and foreground
command &            # run in background
jobs                 # list background jobs
fg %1                # bring job 1 to foreground
nohup command &      # run after logout (ignore SIGHUP)

# System resources
free -h              # memory usage
df -h                # disk usage
iostat 1             # I/O statistics every 1 second
netstat -tulpn       # listening ports and their processes
ss -s                # socket statistics
\`\`\`

### File Permissions

Unix permissions: 9 bits for owner (rwx), group (rwx), and others (rwx).

\`\`\`
-rwxr-xr-- 1 deploy www-data 4096 Oct  1 09:00 deploy.sh
 |||||||||||
 |rwx       owner: read, write, execute
 |   r-x    group: read, no write, execute
 |      r-- others: read only
\`\`\`

\`\`\`bash
chmod 755 script.sh       # rwxr-xr-x (octal)
chmod +x script.sh        # add execute for all
chmod -w file.txt         # remove write for all
chown user:group file.txt # change owner and group
umask 022                 # default permissions mask (new files = 644)
\`\`\`

### Shell Scripting

\`\`\`bash
#!/bin/bash
# Deployment script example

set -e           # exit on any error
set -u           # error on undefined variables
set -o pipefail  # pipeline fails if any command fails

APP_DIR="/var/app"
DEPLOY_USER="deploy"

echo "Deploying to $APP_DIR..."

# Variables and command substitution
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$APP_DIR/backups/$DATE"

# Conditionals
if [ -d "$BACKUP_DIR" ]; then
  echo "Backup directory exists"
else
  mkdir -p "$BACKUP_DIR"
fi

# Loops
for file in *.js; do
  echo "Processing: $file"
  node "$file"
done

# Functions
check_dependency() {
  if ! command -v "$1" &> /dev/null; then
    echo "Error: $1 is not installed"
    exit 1
  fi
}

check_dependency node
check_dependency git

echo "Deploy complete"
\`\`\`

### Environment Variables and Configuration

\`\`\`bash
export DATABASE_URL="postgres://localhost/mydb"  # set in current and child processes
echo $DATABASE_URL                               # access variable
unset DATABASE_URL                               # remove

env                  # list all environment variables
printenv HOME        # print specific variable

# .env file (common pattern for apps)
# source .env         # load into current shell
# env $(cat .env | xargs) command   # pass to one command
\`\`\`

### SSH and Remote Access

\`\`\`bash
ssh user@host                    # connect to remote host
ssh -i ~/.ssh/key.pem user@host  # connect with specific key
ssh -L 5432:localhost:5432 user@host  # port forward (tunnel local 5432 to remote 5432)

scp local_file user@host:/remote/path   # copy to remote
rsync -avz ./src/ user@host:/app/src/  # sync directories efficiently

# SSH config (~/.ssh/config)
Host production
  HostName prod.example.com
  User deploy
  IdentityFile ~/.ssh/prod_key
\`\`\`

### Cron and Scheduled Tasks

\`\`\`bash
crontab -e        # edit current user's crontab
crontab -l        # list current crontab

# Crontab syntax: minute hour day month weekday command
# 0 2 * * *   run at 2:00am daily
# */5 * * * * run every 5 minutes
# 0 9 * * 1   run at 9am on Mondays
# 0 0 1 * *   run at midnight on the 1st of each month

0 2 * * * /scripts/backup.sh >> /var/log/backup.log 2>&1
*/5 * * * * /scripts/health_check.sh
\`\`\``,
    quiz: [
      {
        q: 'The command `cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -20` does what?',
        options: [
          'Deletes the first 20 lines of the access log',
          'Extracts the first column (IP addresses), counts occurrences per unique value, and shows the top 20 most frequent',
          'Sorts the access log by the first field',
          'Finds the 20 longest lines in the log',
        ],
        correct: 1,
        explanation: 'Pipeline breakdown: awk prints field 1 (IP) → sort alphabetically → uniq -c counts consecutive identical lines → sort -rn (reverse numeric) → head -20 takes the top 20. Classic "top N IPs" pattern.',
      },
      {
        q: 'The shell option `set -e` in a bash script causes:',
        options: [
          'The script to run as root',
          'The script to exit immediately if any command exits with a non-zero status',
          'All output to go to stderr',
          'Variables to be exported to the environment',
        ],
        correct: 1,
        explanation: '`set -e` is crucial for production scripts: if any command fails (exit code ≠ 0), the script stops immediately rather than continuing with potentially invalid state.',
      },
      {
        q: 'Permission 755 (rwxr-xr-x) on a file means:',
        options: [
          'Owner: read/write/execute; Group: read/execute only; Others: read/execute only',
          'Owner: full access; Group: read only; Others: no access',
          'Everyone has full access',
          'Only the owner can read the file',
        ],
        correct: 0,
        explanation: '755 = 7(owner: rwx=4+2+1) 5(group: r-x=4+0+1) 5(others: r-x=4+0+1). Common for executables and directories: owner can modify, group and others can read and execute.',
      },
      {
        q: '`tail -f /var/log/app.log` is useful because:',
        options: [
          'It shows the last modification time of the file',
          'It follows the file in real-time, printing new lines as they are appended — essential for watching live logs',
          'It counts the lines in the log file',
          'It filters the log for error-level entries',
        ],
        correct: 1,
        explanation: '`tail -f` (follow) stays open and prints new lines as they are written. Invaluable during debugging, deployments, or incident response for watching logs in real time.',
      },
      {
        q: 'A cron expression `0 2 * * *` schedules a job to run:',
        options: [
          'Every 2 minutes',
          'At minute 0 of hour 2 (2:00am), every day',
          'Every hour, 2 minutes past the hour',
          'At 2:00am on the 1st of every month',
        ],
        correct: 1,
        explanation: 'Cron: minute hour day month weekday. `0 2 * * *` = minute 0, hour 2, any day, any month, any weekday = 2:00am daily.',
      },
    ],
  },
  {
    id: 'nos-m05',
    track: 'networks-os' as any,
    title: 'Cloud Infrastructure & DevOps',
    subtitle: 'Cloud models, IaC, containers, CI/CD — modern deployment infrastructure',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 5,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Infrastructure as Code (IaC)', definition: 'Managing and provisioning infrastructure through machine-readable configuration files rather than manual processes; enables version control, reproducibility, and automated deployment of infrastructure.' },
      { term: 'Container', definition: 'A lightweight, isolated process environment sharing the host OS kernel but with its own filesystem (image), process namespace, network namespace, and resource limits (cgroups); Docker images are layered, immutable, and portable.' },
      { term: 'Container Orchestration', definition: 'Automated management of containerized applications across a cluster: scheduling, scaling, health checking, service discovery, and rolling updates; Kubernetes is the dominant orchestration platform.' },
      { term: 'CI/CD Pipeline', definition: 'Continuous Integration (automatically build and test on every commit) and Continuous Deployment/Delivery (automatically deploy passing builds); reduces deployment risk through small, frequent, automated releases.' },
      { term: 'Immutable Infrastructure', definition: 'A pattern where servers are never modified after deployment; instead, a new image is built and deployed, and old instances are replaced; eliminates configuration drift and makes rollback trivial.' },
    ],
    content: `## Cloud Infrastructure & DevOps

Cloud computing and DevOps transformed how software is built and deployed. Instead of managing physical hardware, engineers provision infrastructure programmatically, deploy in containers, and automate every step from code to production. This shift enables teams of five to operate services at global scale.

### Cloud Computing Models

**IaaS (Infrastructure as a Service)**: raw compute (VMs), storage, and networking. You manage everything from OS up. AWS EC2, Azure VMs, GCP Compute Engine. Maximum control, maximum responsibility.

**PaaS (Platform as a Service)**: managed runtime environments. You deploy your application; the platform manages OS, runtime, scaling, and availability. Heroku, Google App Engine, Railway, Vercel. Faster to start, less control.

**FaaS (Functions as a Service / Serverless)**: deploy individual functions that execute on-demand. Auto-scales to zero; you pay only for execution time. AWS Lambda, Cloudflare Workers, Vercel Edge Functions. Ideal for event-driven workloads; cold start latency is a limitation.

**The shared responsibility model**: the cloud provider secures the infrastructure (hardware, hypervisor, facilities); you secure what runs on it (OS updates, application security, IAM policies, encryption of your data).

### Infrastructure as Code

IaC treats infrastructure configuration like application code: version-controlled, reviewed, testable, and automated.

**Terraform** (HashiCorp): declarative HCL syntax for provisioning cloud resources across any provider. State file tracks what's deployed; plan shows what will change before applying.

\`\`\`hcl
resource "aws_instance" "app" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.micro"
  tags = { Name = "app-server" }
}
\`\`\`

**CDK / Pulumi**: define infrastructure in general-purpose languages (TypeScript, Python) rather than config syntax. Type safety, loops, and abstractions that HCL doesn't support.

**Ansible / Chef / Puppet**: configuration management — install packages, configure services, manage files on existing servers. Useful for server configuration; less appropriate for provisioning new infrastructure (that's Terraform's role).

**GitOps**: IaC stored in Git is the single source of truth; changes happen through PRs; automated pipelines apply changes on merge. Audit trail, rollback via git revert, team review of infrastructure changes.

### Containers and Docker

Docker packages applications with their dependencies into portable images:

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production        # install dependencies
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

**Image layers**: each Dockerfile instruction creates a layer. Layers are cached; only changed layers rebuild. Put rarely-changed instructions (FROM, RUN npm install) before frequently-changed ones (COPY source code) to maximize cache hits.

**Container isolation**: containers share the host kernel but have separate:
- Filesystem (image layers + container-specific writable layer)
- Process namespace (processes inside can't see host processes)
- Network namespace (each container has a virtual network interface)
- cgroups (CPU and memory limits)

**Docker Compose**: define multi-container applications. A web app with a database and a cache:
\`\`\`yaml
services:
  app:    { image: myapp, ports: ['3000:3000'], environment: {DATABASE_URL: postgres://db:5432/mydb} }
  db:     { image: postgres:15, environment: {POSTGRES_DB: mydb} }
  cache:  { image: redis:7-alpine }
\`\`\`

### Kubernetes

Kubernetes (K8s) is a container orchestration platform that manages containerized workloads across a cluster of machines.

**Core concepts**:
- **Pod**: the smallest deployable unit; 1+ containers sharing a network namespace and storage
- **Deployment**: manages a set of Pod replicas with rolling updates
- **Service**: a stable DNS name and IP that load-balances across matching Pods
- **Ingress**: routes external HTTP traffic to Services
- **ConfigMap / Secret**: externalizes configuration from container images

**Deployment example**:
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    spec:
      containers:
      - name: app
        image: myapp:v1.2.3
        resources:
          requests: { cpu: "100m", memory: "128Mi" }
          limits:   { cpu: "500m", memory: "512Mi" }
\`\`\`

**Why Kubernetes**: it handles scheduling (which node runs each Pod), restarts failed Pods, scales up and down, performs rolling updates with zero downtime, and manages service discovery. The trade-off: significant operational complexity.

### CI/CD Pipelines

CI/CD automates the path from code to production:

**Continuous Integration**:
- Every commit triggers a pipeline
- Build the application
- Run unit and integration tests
- Static analysis (linting, type checking, SAST)
- Build and push container image
- Fail fast: if tests fail, the pipeline stops and notifies the developer

**Continuous Deployment**:
- Deploy to staging automatically on every main branch merge
- Run smoke tests against staging
- Deploy to production automatically (CD) or after manual approval (Continuous Delivery)

**Pipeline as Code** (GitHub Actions, CircleCI, GitLab CI):
\`\`\`yaml
name: Deploy
on: [push]
jobs:
  test:
    steps:
      - run: npm test
  deploy:
    needs: test
    steps:
      - run: vercel deploy --prod
\`\`\`

**Feature flags**: deploy code before it's "on." Flag controls whether the feature is visible to users. Enables dark launches, progressive rollouts, and instant kill switches without a deployment.

### Observability: Metrics, Logs, Traces

**The Three Pillars**:
- **Metrics**: numerical time-series measurements (request rate, error rate, latency percentiles, CPU usage). Alerting is based on metrics. Prometheus collects metrics; Grafana visualizes.
- **Logs**: timestamped records of events. Use structured logging (JSON) to enable querying. Aggregate with ELK stack, Loki, or Datadog.
- **Traces**: records of requests as they propagate through distributed services. Shows where time is spent and where errors occur. OpenTelemetry is the standard; Jaeger and Zipkin store and visualize traces.

**SLO / SLA / SLI**:
- **SLI** (Service Level Indicator): a measured metric (99th percentile latency, error rate)
- **SLO** (Service Level Objective): the target (99.9% requests under 200ms)
- **SLA** (Service Level Agreement): contract with customers; SLA ≤ SLO (you alert internally before breaching the customer commitment)

**Error budget**: if your SLO is 99.9% uptime, you have 43.8 minutes/month of allowed downtime. Spend it on deployments and experiments. If you've used it, freeze deployments until the budget resets.`,
    quiz: [
      {
        q: 'The main advantage of Infrastructure as Code (IaC) over manual provisioning is:',
        options: [
          'It is faster to type commands than to write configuration files',
          'Infrastructure is version-controlled, reproducible, reviewable, and automated — eliminating configuration drift and enabling rollback',
          'IaC providers are cheaper than manually managed servers',
          'IaC eliminates the need for monitoring',
        ],
        correct: 1,
        explanation: 'IaC: infrastructure is code — version-controlled (git history shows who changed what), reviewed (PRs for infrastructure changes), reproducible (spin up identical environments), automated (apply on merge). Eliminates snowflake servers.',
      },
      {
        q: 'Docker image layers are important for performance because:',
        options: [
          'Layers enable encryption of container contents',
          'Unchanged layers are cached — placing rarely-changed instructions early maximizes cache reuse and speeds builds',
          'Each layer runs in a separate process',
          'Layers limit the container\'s memory usage',
        ],
        correct: 1,
        explanation: 'Docker build cache: a layer is only rebuilt if the instruction or any previous instruction changed. Put COPY package.json before COPY . (source code) so the npm install layer caches even when source changes.',
      },
      {
        q: 'Kubernetes Service provides:',
        options: [
          'A mechanism to build container images',
          'A stable DNS name and IP that load-balances traffic across matching Pods, even as they are replaced',
          'Storage persistence for stateful applications',
          'Rate limiting for external API calls',
        ],
        correct: 1,
        explanation: 'Pods are ephemeral — they come and go. A Service provides a stable endpoint: a DNS name and virtual IP that automatically routes to healthy Pods matching the selector.',
      },
      {
        q: 'An "error budget" in SRE (Site Reliability Engineering) represents:',
        options: [
          'The budget allocated to fixing production bugs',
          'The allowed amount of downtime or error rate under the SLO — spent on deployments and experiments',
          'The maximum number of rollbacks per month',
          'The engineering time budget for reliability work',
        ],
        correct: 1,
        explanation: 'SLO of 99.9% = 0.1% error budget (~43min/month). If budget remains, deploy new features (which have risk). If budget is exhausted, freeze deployments — reliability takes priority until budget resets.',
      },
      {
        q: 'Feature flags allow you to:',
        options: [
          'Automatically roll back failed deployments',
          'Deploy code to production before it\'s visible to users, enabling gradual rollout, dark launches, and instant kill switches without redeployment',
          'Limit feature access to paid tiers',
          'Track feature usage in analytics',
        ],
        correct: 1,
        explanation: 'Feature flags decouple deploy from release. Code is deployed (dark launch), then gradually enabled for a percentage of users. If a problem occurs, disable the flag — no emergency deployment needed.',
      },
    ],
  },
  {
    id: 'nos-m06',
    track: 'networks-os' as any,
    title: 'Database Systems & Storage',
    subtitle: 'ACID, indexes, query optimization, NoSQL — choosing and using the right database',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 6,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'ACID Properties', definition: 'The four properties guaranteeing database transaction reliability: Atomicity (all or nothing), Consistency (data remains valid), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists despite failures).' },
      { term: 'B-Tree Index', definition: 'The standard database index structure: a balanced tree where each node contains sorted keys and child pointers; enables O(log n) lookup, range queries, and ordered scans; most relational database indexes (PostgreSQL, MySQL) default to B-tree.' },
      { term: 'Query Plan', definition: 'The execution strategy chosen by the query optimizer for a SQL query; shows which indexes are used, join algorithms selected, and estimated row counts; EXPLAIN ANALYZE reveals actual vs estimated performance.' },
      { term: 'Write-Ahead Log (WAL)', definition: 'A database durability mechanism: changes are written to the WAL (sequential, append-only) before being applied to data pages; on crash, the WAL is replayed to recover committed transactions; also the basis of streaming replication.' },
      { term: 'CAP Theorem', definition: 'In a distributed database, you can guarantee at most two of: Consistency (all nodes see the same data), Availability (every request gets a response), Partition tolerance (system works despite network partitions). Since partitions are unavoidable, choose CP or AP.' },
    ],
    content: `## Database Systems & Storage

Databases are the foundation of most applications. The choice of database — and how you use it — determines whether your application is correct, performant, and scalable. Understanding database internals helps you write better queries, design better schemas, and make informed choices between the dozens of database systems available.

### Relational Databases and SQL

Relational databases model data as tables with rows and columns, with relationships between tables expressed through foreign keys.

**ACID transactions**:
- **Atomicity**: a transaction either completes entirely or not at all. No partial updates. If step 2 of 3 fails, step 1 rolls back.
- **Consistency**: a transaction brings the database from one valid state to another. Constraints (NOT NULL, UNIQUE, FK) are enforced; invalid states are rejected.
- **Isolation**: concurrent transactions execute as if serialized. One transaction's in-progress changes aren't visible to others until committed.
- **Durability**: once committed, data persists even if the database crashes immediately after.

**Isolation levels** (tradeoffs between isolation and performance):
- **Read Uncommitted**: can read dirty (uncommitted) data. Fastest, least safe.
- **Read Committed**: only committed data is visible. Default in PostgreSQL.
- **Repeatable Read**: same query returns same results within a transaction.
- **Serializable**: full isolation; transactions appear to run serially.

Higher isolation prevents anomalies (dirty reads, non-repeatable reads, phantom reads) but increases lock contention and reduces throughput.

### Indexes

An index is an auxiliary data structure enabling fast data retrieval without scanning every row:

**B-tree index** (default): balanced tree. Supports equality (WHERE id = 42), range (WHERE age > 18), and prefix queries (WHERE name LIKE 'Jo%'). Column order matters for composite indexes.

**Hash index**: O(1) equality lookup; doesn't support range queries. PostgreSQL uses hash indexes internally for certain operations.

**Composite indexes**: an index on (last_name, first_name) helps queries filtering on last_name or on both; doesn't help filtering on first_name alone. The leading column rule: the first column in the index must appear in the WHERE clause.

**Partial indexes**: index only rows matching a condition:
\`\`\`sql
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
\`\`\`
Smaller, faster, but only helps queries with that condition.

**Index trade-offs**: indexes speed reads but slow writes (every write updates all relevant indexes). An over-indexed table with 20 indexes has 20x write amplification.

### Query Optimization

The query optimizer chooses how to execute a query. EXPLAIN ANALYZE reveals the plan:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC LIMIT 10;
\`\`\`

**Key plan nodes**:
- **Seq Scan**: reads every row in the table. Fast for large fractions; slow for selective queries on large tables.
- **Index Scan**: uses a B-tree to find matching rows. Fast for selective predicates.
- **Index Only Scan**: all needed columns are in the index; no heap access. Fastest.
- **Nested Loop Join**: for each row in the outer table, find matching rows in the inner table. Excellent when inner is indexed and the outer is small.
- **Hash Join**: build a hash table from one side, probe with the other. Good for large unsorted joins.
- **Merge Join**: sort both sides, merge. Good for pre-sorted data.

**Common optimization patterns**:
- Add an index on high-cardinality columns used in WHERE and JOIN
- Avoid functions on indexed columns in WHERE (\`WHERE YEAR(created_at) = 2024\` disables index; use \`WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'\`)
- Use LIMIT early in CTEs (PostgreSQL may not push LIMIT down)
- Avoid SELECT * in production queries; select only needed columns
- Use EXPLAIN ANALYZE, not EXPLAIN — actual numbers, not estimates

### NoSQL Databases

NoSQL (not only SQL) covers several data models:

**Document databases** (MongoDB, CouchDB, Firestore): store JSON/BSON documents in collections. Schema-flexible (different documents can have different fields). Good for hierarchical data, rapidly changing schemas, and teams with varied data shapes. Weaker consistency guarantees than RDBMS.

**Key-value stores** (Redis, DynamoDB, etcd): the simplest model — keys map to values. Extremely fast. Redis adds data structures (lists, sets, sorted sets, hashes). Used for caching, session storage, rate limiting, leaderboards.

**Column-family databases** (Cassandra, HBase): data organized by column families. Optimized for write-heavy workloads and queries by a partition key. No joins; denormalized by design. Scales linearly to petabytes.

**Graph databases** (Neo4j, Amazon Neptune): data as nodes and edges. Efficient traversal of relationships (social networks, recommendation engines, knowledge graphs). SQL's JOIN chains become natural traversals.

**Time-series databases** (TimescaleDB, InfluxDB, Prometheus): optimized for sequential writes of timestamped data (metrics, IoT, financial data). Efficient aggregation over time ranges; automatic data retention policies.

### CAP Theorem and Distributed Databases

Eric Brewer's CAP theorem: a distributed data store can guarantee at most two of:
- **C**onsistency: every read sees the most recent write
- **A**vailability: every request receives a response (though possibly not the most recent data)
- **P**artition tolerance: the system continues operating despite network partitions

Since network partitions are unavoidable in distributed systems, the real choice is between CP (consistency + partition tolerance — may reject requests during partition) and AP (availability + partition tolerance — may serve stale data during partition).

**PACELC** (refinement of CAP): even without partitions, there's a trade-off between Latency and Consistency. Lower latency requires acknowledging writes before all replicas confirm — risking stale reads.

**PostgreSQL**: ACID, CP (primary serves consistent reads; replica may be slightly behind). **Cassandra**: AP (highly available, eventually consistent by default). **DynamoDB**: configurable (strongly consistent reads with higher latency, or eventually consistent with lower latency).

### Write-Ahead Log

The WAL is how databases achieve durability. Before modifying data pages:
1. Write the intended change to the WAL (sequential, append-only — very fast)
2. Acknowledge the commit to the client
3. Apply the change to data pages asynchronously

On crash: replay the WAL from the last checkpoint to recover all committed transactions.

**Streaming replication** (PostgreSQL): the WAL stream is shipped to replicas, which replay it to stay in sync. The primary's WAL is the source of truth; replicas are consistent copies.

**Change Data Capture (CDC)**: read the WAL to capture every row-level change and stream it to other systems (Kafka, event buses, search indexes). Debezium, AWS DMS, and PostgreSQL's logical replication all use this pattern.`,
    quiz: [
      {
        q: 'ACID Atomicity means:',
        options: [
          'All transactions are processed in atom-level detail',
          'A transaction either completes entirely or has no effect — partial updates are rolled back on failure',
          'Transactions execute in atomic (non-preemptible) CPU instructions',
          'Data is stored in the smallest possible units',
        ],
        correct: 1,
        explanation: 'Atomicity: all-or-nothing. If a bank transfer deducts from account A and fails before crediting account B, the deduction is rolled back. No partial state ever persists.',
      },
      {
        q: 'A B-tree index on (last_name, first_name) will NOT efficiently support:',
        options: [
          'WHERE last_name = "Morris"',
          'WHERE last_name = "Morris" AND first_name = "Jordan"',
          'WHERE first_name = "Jordan" (without last_name in the predicate)',
          'ORDER BY last_name, first_name',
        ],
        correct: 2,
        explanation: 'The leading column rule: a composite index helps queries that include the first column in the predicate. Without last_name, the index can\'t be used for first_name alone — a sequential scan is required.',
      },
      {
        q: 'CAP theorem\'s practical implication for distributed databases is:',
        options: [
          'You can achieve all three properties with the right implementation',
          'Since network partitions are unavoidable, you must choose between Consistency (CP) and Availability (AP) during a partition',
          'Distributed databases should not be used for critical data',
          'Consistency and Availability can both be achieved without partition tolerance',
        ],
        correct: 1,
        explanation: 'Partitions happen (network failures, node crashes). The real choice: CP systems reject requests during partitions to stay consistent (PostgreSQL primary fails over); AP systems serve possibly-stale data (Cassandra stays up).',
      },
      {
        q: 'The Write-Ahead Log (WAL) ensures durability by:',
        options: [
          'Writing data to two locations simultaneously',
          'Writing changes to a sequential append-only log before applying them to data pages; on crash, the log is replayed',
          'Compressing data to reduce the chance of corruption',
          'Backing up data to a remote server on every write',
        ],
        correct: 1,
        explanation: 'WAL: write to log first (fast, sequential), then acknowledge commit, then apply to pages (async). On crash, replay WAL from last checkpoint — all committed transactions are recovered.',
      },
      {
        q: 'Redis is most appropriate as:',
        options: [
          'The primary persistent store for relational data requiring transactions',
          'A cache, session store, or leaderboard — in-memory data structures with optional persistence; not a primary relational store',
          'A document database for variable-schema JSON data',
          'A time-series database for metrics storage',
        ],
        correct: 1,
        explanation: 'Redis: in-memory, data structures (strings, hashes, lists, sets, sorted sets), extremely fast (~100K ops/sec). Ideal for caching, sessions, rate limiting, pub/sub, and sorted sets for leaderboards. Not a replacement for PostgreSQL.',
      },
    ],
  },
  {
    id: 'nos-m07',
    track: 'networks-os' as any,
    title: 'Network Security',
    subtitle: 'Firewalls, TLS, PKI, zero trust — defending networked systems',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 7,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'TLS/SSL', definition: 'Transport Layer Security is the protocol providing encryption, authentication, and integrity for network communications; TLS 1.3 is the current standard; SSL is deprecated; a TLS handshake establishes a symmetric session key via asymmetric cryptography.' },
      { term: 'Public Key Infrastructure (PKI)', definition: 'A system of certificate authorities (CAs), certificates (X.509), and revocation mechanisms enabling trust in public keys; a certificate binds a public key to an identity, signed by a CA whose own certificate is trusted transitively to a root CA.' },
      { term: 'Zero Trust Architecture', definition: 'A security model eliminating the implicit trust assumption of the perimeter model; every request is authenticated and authorized regardless of network location; assumes breach.' },
      { term: 'Firewall', definition: 'A network security device that controls traffic based on rules; a stateless packet filter inspects individual packets; a stateful firewall tracks connection state; a WAF (Web Application Firewall) inspects HTTP payloads for SQL injection, XSS, etc.' },
      { term: 'DDoS Attack', definition: 'Distributed Denial of Service: overwhelming a service with traffic from many sources to prevent legitimate use; mitigated by rate limiting, scrubbing centers, and CDN absorption.' },
    ],
    content: `## Network Security

Every application communicating over a network is exposed to attack. Understanding network security — encryption protocols, firewall design, zero trust architectures — is essential for building secure systems.

### TLS: Encryption in Transit

TLS 1.3 handshake: Client sends ClientHello with key share → Server responds with ServerHello, certificate, and key share → both derive symmetric session key via Diffie-Hellman (key never transmitted). This is **forward secrecy**: even if the server's long-term private key is later compromised, past sessions cannot be decrypted.

**Certificate validation**: chain of trust to a trusted root CA, not expired, not revoked, SAN matches hostname.

**Mutual TLS (mTLS)**: both client and server present certificates. Used for service-to-service authentication in microservices and zero trust.

**Common misconfigurations**: accepting TLS 1.0/1.1, weak cipher suites (RC4), missing HSTS header, no certificate revocation check.

### PKI

X.509 certificate: Subject, Public key, Issuer, Validity, SANs, Signature. Certificate chain: leaf → intermediate CA → root CA. Root CAs are embedded in OS/browser trust stores.

**Certificate Transparency**: all public certificates must be logged in append-only CT logs. Detects mis-issuance.

**Let's Encrypt**: free automated CA; 90-day certificates; ACME protocol auto-renewal.

### Firewalls

**Stateless packet filter**: rules on source/destination IP, port, protocol. No connection tracking.

**Stateful firewall**: tracks TCP state; only packets belonging to established connections pass.

**WAF (Web Application Firewall)**: Layer 7 — inspects HTTP bodies and headers for SQL injection, XSS, CSRF, path traversal. OWASP ModSecurity Core Rule Set.

**DMZ**: internet-facing services in a DMZ between two firewalls; internal services behind the inner firewall.

### Zero Trust

Never trust, always verify. Every request authenticated and authorized regardless of whether it originates inside or outside the corporate network.

**Components**: Identity Provider (SSO/OIDC), device management (MDM health attestation), microsegmentation (explicit service-to-service allow-lists), mTLS between services, continuous per-request authorization.

**BeyondCorp** (Google): employees access internal apps from any network via an access proxy verifying identity and device health. No VPN required.

### Common Attacks

**ARP spoofing**: on LAN, respond to ARP requests with your own MAC to intercept traffic. Mitigated by dynamic ARP inspection.

**DNS poisoning**: return malicious IP for legitimate hostname. Mitigated by DNSSEC (cryptographic authentication of DNS records).

**DDoS mitigation**: rate limiting at edge, anycast scrubbing centers, CDN absorption, BGP blackholing (last resort).`,
    quiz: [
      {
        q: 'TLS forward secrecy means:',
        options: [
          'Past sessions can be decrypted if the server\'s private key is later compromised',
          'Session keys are derived via Diffie-Hellman and never transmitted — compromising the server\'s long-term private key cannot decrypt past sessions',
          'Future TLS versions will always be backwards compatible',
          'Certificates are valid indefinitely once issued',
        ],
        correct: 1,
        explanation: 'Forward secrecy: each session uses a fresh ephemeral DH key pair. The private key is discarded after the session. Past session keys cannot be derived even with the server\'s long-term private key.',
      },
      {
        q: 'Mutual TLS (mTLS) differs from standard TLS in that:',
        options: [
          'mTLS encrypts traffic in both directions; standard TLS only encrypts one direction',
          'Both client and server present certificates — the server authenticates the client, not just the other way around',
          'mTLS uses a different key exchange algorithm',
          'mTLS is only used for internal services',
        ],
        correct: 1,
        explanation: 'Standard TLS: client authenticates the server. mTLS: both parties present and validate certificates — mutual authentication. Essential for zero trust service-to-service communication.',
      },
      {
        q: 'Zero trust architecture\'s core principle is:',
        options: [
          'All traffic must be encrypted',
          'Never trust, always verify — every request is authenticated and authorized regardless of network location; internal network position confers no trust',
          'Only verified vendor hardware may be used',
          'All access must go through a VPN',
        ],
        correct: 1,
        explanation: 'Zero trust eliminates the perimeter assumption. Every request — even from inside the corporate network — must prove identity, device health, and authorization before accessing a resource.',
      },
      {
        q: 'A WAF differs from a network firewall in that:',
        options: [
          'A WAF operates at Layer 7 (HTTP) and inspects request payloads for SQL injection, XSS, and other application-layer attacks',
          'A WAF is faster than a network firewall',
          'A WAF only applies to HTTPS traffic',
          'A WAF blocks based on IP address rather than request content',
        ],
        correct: 0,
        explanation: 'Network firewalls see IPs and ports. A WAF decodes HTTP and inspects payloads — it can detect and block SQL injection in a form field or XSS in a URL parameter.',
      },
      {
        q: 'DNSSEC prevents DNS poisoning by:',
        options: [
          'Encrypting DNS traffic',
          'Adding cryptographic signatures to DNS records — resolvers verify signatures against published public keys; a poisoned record has an invalid signature and is rejected',
          'Requiring HTTPS for all DNS queries',
          'Blocking all UDP DNS queries',
        ],
        correct: 1,
        explanation: 'DNSSEC: zones sign records with their private key. Resolvers verify signatures chained to ICANN\'s root key. A poisoned record with a wrong IP will fail signature verification.',
      },
    ],
  },
  {
    id: 'nos-m08',
    track: 'networks-os' as any,
    title: 'Virtualization & Containers Deep Dive',
    subtitle: 'Hypervisors, namespaces, cgroups, Kubernetes scheduling — how isolation works',
    level: 'PhD',
    xp: 175,
    duration: 16,
    module: 8,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Hypervisor', definition: 'Software creating and managing virtual machines; Type 1 (bare-metal: KVM, VMware ESXi) runs directly on hardware; Type 2 (hosted: VirtualBox) runs on a host OS; VMs have full kernel isolation.' },
      { term: 'Linux Namespaces', definition: 'Kernel feature isolating process views: PID (separate process trees), NET (separate network stack), MNT (separate filesystem), UTS (hostname), IPC, USER. Docker uses all namespaces to create container isolation.' },
      { term: 'cgroups', definition: 'Linux control groups: limits, accounts, and isolates CPU, memory, I/O for process groups. Containers use cgroups to enforce --memory, --cpu-shares limits.' },
      { term: 'Container Image Layers', definition: 'Docker images are read-only layers stored by content hash (overlayfs); each layer = one Dockerfile instruction; layers shared across images; only changed layers need pushing/pulling.' },
      { term: 'Kubernetes Scheduler', definition: 'kube-scheduler assigns Pods to nodes: filters nodes (resource fit, affinity, taints) then scores them (least requested, balanced allocation); never over-commits beyond node capacity.' },
    ],
    content: `## Virtualization & Containers Deep Dive

### Virtual Machines and Hypervisors

Hardware-assisted virtualization (Intel VT-x, AMD-V): the hypervisor runs in VMX root mode; guest VMs in VMX non-root mode. Privileged instructions cause VM exits — the hypervisor handles them and resumes the guest.

**Type 1 (bare-metal)**: KVM, VMware ESXi, Hyper-V — runs on hardware directly; used in cloud data centers. **Type 2 (hosted)**: VirtualBox, VMware Workstation — runs on a host OS; used for local dev.

**KVM**: a Linux kernel module turning Linux itself into a Type 1 hypervisor. Used under AWS EC2, GCP, Azure.

### Linux Namespaces

Containers are not VMs — they share the host kernel but use namespaces to isolate resource views:

- **PID**: container processes can't see host processes
- **NET**: container gets its own network interfaces and routing table
- **MNT**: container has its own filesystem view
- **USER**: UID 0 inside the container maps to an unprivileged user outside (user namespace remapping)

**NET namespace**: each container gets a veth pair. One end in container namespace, other on docker0 bridge on host. Bridge provides inter-container communication and NAT to the outside.

### cgroups

**CPU**: \`cpu.shares\` (relative weight) or \`cpu.cfs_quota_us\` (hard cap). \`--cpus=0.5\` = at most 50% of one core.

**Memory**: \`memory.limit_in_bytes\` — exceeded → OOM killer terminates a process in the cgroup.

**cgroup v2**: unified hierarchy; default in modern Linux distros.

### Docker Image Internals

overlayfs merges layers: container's writable upper layer sits on top of read-only image layers. Reads go top-down. Writes go to upper layer only. 100 containers from the same image share image bytes on disk.

**Multi-stage builds**: build in a full image (compilers, tools), copy only compiled artifacts into a minimal production image. Build toolchain is not in the final image.

### Kubernetes Scheduling

1. **Filtering**: remove nodes that don't satisfy resource requests, nodeAffinity, taints/tolerations
2. **Scoring**: rank by LeastRequested (spread workload), BalancedResourceAllocation, InterPodAffinity
3. **Binding**: write nodeName to Pod spec

**Requests vs Limits**: requests are what the scheduler reserves; limits are the cgroup ceiling. OOM kill on memory limit exceedance; CPU throttling on CPU limit exceedance.

**QoS classes**: Guaranteed (requests = limits, last evicted), Burstable (requests < limits), BestEffort (no requests/limits, first evicted).

**Container security**: run as non-root (\`USER nonroot\` in Dockerfile), avoid \`--privileged\`, use seccomp profiles to whitelist syscalls, AppArmor/SELinux for MAC.`,
    quiz: [
      {
        q: 'Linux namespaces provide container isolation by:',
        options: [
          'Virtualizing CPU and memory hardware for each container',
          'Creating isolated views of specific system resources — containers share the kernel but each namespace instance has its own view of processes, network, and filesystem',
          'Encrypting container-to-container communication',
          'Running each container on a separate physical CPU core',
        ],
        correct: 1,
        explanation: 'Namespaces: same kernel, different views. PID namespace: container PIDs start at 1, can\'t see host processes. NET namespace: container has its own network stack. Lighter than VM isolation since the kernel is shared.',
      },
      {
        q: 'cgroups enforce:',
        options: [
          'Process isolation from other processes',
          'Resource limits (CPU, memory, I/O) on process groups — memory limit exceedance triggers OOM kill; CPU limit exceedance causes throttling',
          'Network access controls between containers',
          'Filesystem permissions for container users',
        ],
        correct: 1,
        explanation: 'cgroups don\'t isolate (namespaces do) — they limit. CPU quota, memory ceiling, I/O throttle. The container OOM kill when --memory is exceeded is cgroups in action.',
      },
      {
        q: 'Docker\'s union filesystem (overlayfs) enables:',
        options: [
          'Running multiple containers from the same image by sharing read-only layers — each container adds only its own thin writable layer on top',
          'Encrypting container filesystem contents',
          'Merging multiple containers\' filesystems into one',
          'Enabling container-to-host file sharing',
        ],
        correct: 0,
        explanation: 'overlayfs: image layers are read-only and shared across containers from the same image. Each container\'s writes go to its own upper layer. 100 containers share one copy of the base image bytes on disk.',
      },
      {
        q: 'Kubernetes Guaranteed QoS class provides the strongest scheduling guarantees because:',
        options: [
          'Guaranteed Pods run on dedicated nodes',
          'Requests equal limits — the scheduler reserves exactly what the Pod uses; Guaranteed Pods are last to be evicted under resource pressure',
          'Guaranteed Pods have network priority',
          'Guaranteed Pods cannot be OOM-killed',
        ],
        correct: 1,
        explanation: 'Guaranteed: requests = limits. No over-commitment for this Pod. Under pressure: BestEffort evicted first, then Burstable, then Guaranteed (last resort). Predictable for latency-sensitive workloads.',
      },
      {
        q: 'Multi-stage Docker builds reduce final image size by:',
        options: [
          'Compressing the image filesystem with gzip',
          'Building with full toolchain in a first stage, then copying only compiled artifacts into a minimal production image — build tools are not in the final image',
          'Removing unused base image layers automatically',
          'Running only essential processes in the final container',
        ],
        correct: 1,
        explanation: 'Multi-stage: \`FROM node:20 AS build\` runs npm install + build. \`FROM node:20-alpine\` + \`COPY --from=build\` takes only the output. No source code, compilers, or test dependencies in the deployed image.',
      },
    ],
  },
  {
    id: 'nos-m09',
    track: 'networks-os' as any,
    title: 'Distributed Systems Fundamentals',
    subtitle: 'Consensus, replication, consistency models — engineering for failure',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 9,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Consensus Algorithm', definition: 'A protocol enabling distributed nodes to agree on a value despite failures; Raft and Paxos are foundational; used in etcd, CockroachDB, ZooKeeper, Kafka.' },
      { term: 'Eventual Consistency', definition: 'A consistency model guaranteeing that if no new updates arrive, all replicas will eventually converge; reads may return stale data temporarily; used in Cassandra, DynamoDB.' },
      { term: 'Idempotency', definition: 'An operation is idempotent if applying it multiple times produces the same result as once; critical for retry safety; PUT and DELETE are idempotent; POST generally is not.' },
      { term: 'Two-Phase Commit (2PC)', definition: 'Distributed transaction protocol: Phase 1 — coordinator asks all participants to prepare and lock; Phase 2 — if all prepared, commit; if any failed, abort. Blocking if coordinator crashes between phases.' },
      { term: 'Vector Clock', definition: 'Causality-tracking mechanism: each node maintains a vector of logical timestamps; enables detecting happened-before relationships and concurrent updates without a global clock.' },
    ],
    content: `## Distributed Systems Fundamentals

### Why Distribution Is Hard

The fallacies of distributed computing: the network is NOT reliable, latency is NOT zero, bandwidth is NOT infinite. Partial failure — some nodes up, some down, messages delayed — is the normal operating condition.

### Consensus

**FLP Impossibility**: in a fully asynchronous system, no deterministic algorithm can guarantee consensus if even one node can fail. Practical algorithms (Raft, Paxos) assume partial synchrony.

**Raft** (designed to be understandable): three roles — Leader, Follower, Candidate.

**Leader election**: followers time out waiting for heartbeat → become Candidate → request votes → if majority vote, become Leader → send heartbeats.

**Log replication**: leader appends entry → sends AppendEntries to all followers → once majority acknowledge, entry is committed → committed entries never overwritten.

Used in: etcd (Kubernetes), CockroachDB, TiKV.

### Replication

**Primary-replica**: one node accepts writes; replicas apply WAL/change log. Synchronous (acknowledged after replica confirms — zero data loss, higher latency) vs Asynchronous (acknowledged immediately — lower latency, possible data loss on primary failure).

**Multi-primary**: multiple nodes accept writes; requires conflict resolution (CRDTs, last-write-wins). Enables geographic write distribution.

### Consistency Models

**Linearizability** (strongest): every operation appears to take effect at a single point in time. Requires consensus.

**Causal consistency**: causally related operations seen in the same order by all nodes. Concurrent operations may be seen in different orders.

**Eventual consistency**: all replicas converge eventually. No guarantees on read staleness. Cassandra, DynamoDB.

**Session guarantees**: read-your-writes, monotonic reads — practical middle ground.

### Distributed Transactions

**2PC**: Prepare (lock + vote yes/no) → Commit or Abort. Failure mode: coordinator crash after Prepare blocks all participants holding locks.

**Sagas**: sequence of local transactions; failures trigger compensating transactions (not rollbacks of others' committed state). No distributed locks. Used in microservices.

### Clocks and Causality

Physical clocks drift — cannot rely on timestamps for ordering across machines.

**Lamport timestamps**: increment counter on each event; take max(local, message) + 1 on receive. Captures happened-before.

**Vector clocks**: per-node counter vector. Enables detecting concurrent updates.

**Hybrid Logical Clocks (HLC)**: physical + logical. Used in CockroachDB, Spanner.

### Idempotency Keys

Network requests can fail ambiguously (request reached server but response lost). Retrying without idempotency → double processing.

**Idempotency key**: client generates UUID per operation; server returns cached result for duplicate keys rather than reprocessing. Used by Stripe for payments — prevents double charges.

**At-least-once vs exactly-once**: at-least-once = retry freely, consumer deduplicates; exactly-once = idempotent consumer + transactional producer (Kafka transactions) or deduplication at consumer.`,
    quiz: [
      {
        q: 'The FLP Impossibility result states that:',
        options: [
          'Distributed systems cannot guarantee both availability and consistency',
          'In a fully asynchronous system, no deterministic algorithm can guarantee consensus if even one node can fail',
          'Consensus algorithms require at least three nodes',
          'Network partitions always cause data loss',
        ],
        correct: 1,
        explanation: 'FLP: with one potentially crashed node and no timing guarantees, a deterministic consensus algorithm cannot guarantee termination. Practical algorithms (Raft, Paxos) assume partial synchrony (messages usually arrive within some bound) to work around this.',
      },
      {
        q: 'Raft commits a log entry after:',
        options: [
          'The leader writes it to its own log',
          'All followers have acknowledged',
          'A majority of nodes (including leader) have written the entry — fault-tolerant up to minority failures',
          'At least one follower has acknowledged',
        ],
        correct: 2,
        explanation: 'Majority commit: N=5 nodes → need 3 (majority). Tolerates 2 failures. This is why Raft clusters should have an odd number of nodes — to maintain a clear majority.',
      },
      {
        q: 'Eventual consistency means:',
        options: [
          'All writes eventually succeed after retries',
          'If no new updates arrive, all replicas will eventually converge to the same value — but reads may temporarily return stale data',
          'The system eventually becomes linearizable under low load',
          'All transactions eventually commit without rollback',
        ],
        correct: 1,
        explanation: 'Eventual consistency: AP systems favor availability. A read immediately after a write may return the old value from a stale replica. Under no new writes, replicas converge.',
      },
      {
        q: 'Sagas avoid 2PC\'s blocking problem by:',
        options: [
          'Sagas guarantee stronger consistency than 2PC',
          'Each step commits locally and publishes an event; failures trigger compensating transactions — no global locks, no blocking on coordinator failure',
          'Sagas use asynchronous replication',
          'Sagas require fewer network round trips',
        ],
        correct: 1,
        explanation: '2PC: distributed locking — slow/crashed coordinator blocks everyone. Sagas: local commits + events. Failure triggers compensating transactions (undo previously committed steps). No global locks.',
      },
      {
        q: 'An idempotency key prevents double-processing by:',
        options: [
          'Making the server process requests in order',
          'The client attaches a unique key per operation; the server returns the cached result for duplicate keys rather than processing again',
          'Preventing retries on network failures',
          'Ensuring each request reaches exactly one server',
        ],
        correct: 1,
        explanation: 'If a payment response is lost, the client retries with the same idempotency key. The server recognizes the duplicate and returns the cached result — no double charge.',
      },
    ],
  },
  {
    id: 'nos-m10',
    track: 'networks-os' as any,
    title: 'Performance Engineering',
    subtitle: 'Profiling, benchmarking, latency analysis — finding and fixing bottlenecks',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 10,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Latency Percentiles', definition: 'P50 (median) is the typical case; P99 means 99% of requests are faster; tail latency (P99, P999) captures the worst user experiences. Averages hide bimodal distributions and tail spikes.' },
      { term: 'Amdahl\'s Law', definition: 'Speedup from parallelism is limited by the serial fraction: max speedup = 1 / serial fraction. 10% serial work → max 10x speedup regardless of how many processors are added.' },
      { term: 'CPU Cache Hierarchy', definition: 'L1 (~1ns), L2 (~4ns), L3 (~12ns) caches before main RAM (~100ns). Cache-friendly code (sequential access, spatial/temporal locality) dramatically outperforms random-access code.' },
      { term: 'Profiling', definition: 'Measuring where a program spends time or allocates memory. Sampling profiler: periodic stack snapshots, low overhead (~1-5%), suitable for production. Flame graphs visualize profiler output.' },
      { term: 'Little\'s Law', definition: 'L = λW: items in system = arrival rate × time in system. To reduce queue length: reduce arrival rate or reduce processing time.' },
    ],
    content: `## Performance Engineering

### The Performance Mindset

Measure first, optimize second. Profile the actual system — the biggest wins come from a small number of hotspots (80/20 rule: 80% of time in 20% of code).

**Latency vs throughput**: a single-threaded server has low latency (no queuing) but poor throughput. High concurrency increases throughput but can increase P99 latency under load.

### Latency Analysis

**Always use percentiles, not averages**: 99 requests at 10ms + 1 request at 10s = average ~110ms. That average describes neither the typical case nor the worst case.

**Track**: P50 (typical), P95 (starting to see outliers), P99 (experienced by significant fraction at scale), P999 (0.1%).

**Tail latency causes**: GC pauses (stop-the-world), lock contention (serialized waits), OS scheduling jitter, CPU power management (C-state transitions), cold caches after deployment.

### CPU Profiling

**Sampling profiler**: every N ms, capture running thread stacks. Builds histogram of where time is spent. Tools: Linux \`perf\`, Go \`pprof\`, Node.js \`--prof\`, Async Profiler (JVM).

**Flame graphs** (Brendan Gregg): call stacks visualized as rectangles; width = % of time. Widest plateaus = hotspots.

**On-CPU**: where threads are running (CPU-bound hotspots). **Off-CPU**: where threads are blocked on I/O or locks.

**CPU performance counters** (\`perf stat\`): cache miss rate > 10% is a red flag.

### Memory Performance

**Cache-friendly access**: CPU prefetches 64-byte cache lines. Sequential array traversal = fast (prefetcher works). Linked list pointer chasing = slow (each node is a cache miss).

**Struct of Arrays vs Array of Structs**: SoA stores field x contiguously for all objects — scanning x values is cache-friendly. AoS stores whole objects contiguously — scanning x loads unused fields.

**Allocation overhead**: malloc in hot paths causes system calls and lock contention. Solutions: object pools, arena allocators, slab allocators.

### I/O Performance

Sequential I/O (log writes) is fast on all media. Random I/O (database index scans) is slow on HDD (~5ms seek), tolerable on SSD (~100μs).

\`fsync\` flushes to durable storage (1-10ms on SSD). Databases call \`fsync\` on WAL writes for durability.

**io_uring** (Linux 5.1+): shared ring buffers between user and kernel space. I/O operations submitted in batches without per-I/O syscalls. Major IOPS improvement for high-throughput storage workloads.

### Amdahl's Law in Practice

A web service: 80ms database (parallelizable), 15ms computation (CPU-bound), 5ms serialization (serial). Even infinite parallelism on the database and computation yields max speedup of 100/5 = 20x. The serial bottleneck is the ceiling.

**Benchmarking mistakes**: coordinated omission (client waits for response before sending next — hides queuing delay), forgetting warmup (cold cache), resource-limited test client (client saturates before server).`,
    quiz: [
      {
        q: 'P99 latency is more important to track than average latency because:',
        options: [
          'P99 is easier to calculate',
          'Averages hide tail latency — a bimodal distribution with occasional 10-second requests can have a "good" average but terrible experience for 1% of users',
          'P99 is what SLAs always specify',
          'Average latency includes outliers that skew results',
        ],
        correct: 1,
        explanation: '99 requests at 10ms + 1 at 10s → average ~110ms. P99 reveals the 1% who wait 10s. At 10,000 req/s, P99 = 100 users per second experiencing that latency.',
      },
      {
        q: 'A sampling profiler\'s advantage over an instrumented profiler is:',
        options: [
          'Sampling profilers are more accurate',
          'Low overhead (~1-5%) — periodic stack snapshots can run in production; instrumented profilers timing every function call are too expensive for production',
          'Sampling profilers capture memory allocation',
          'Sampling profilers require no code changes',
        ],
        correct: 1,
        explanation: 'Instrumented profilers can double execution time. Sampling profilers take stack snapshots at intervals (e.g., every 1ms). Statistical accuracy is good; overhead is low enough for production use.',
      },
      {
        q: 'If 10% of a program is serial, Amdahl\'s Law says the maximum speedup from infinite parallelism is:',
        options: [
          'Infinite',
          '10x',
          '90x',
          '100x',
        ],
        correct: 1,
        explanation: 'Max speedup = 1 / serial fraction = 1 / 0.1 = 10x. Even with 1,000 cores, you can\'t do better than 10x. The serial bottleneck is the ceiling.',
      },
      {
        q: 'Cache-friendly code matters because:',
        options: [
          'It reduces code size',
          'Sequential memory access enables CPU prefetching; scattered access (pointer chasing) causes cache misses that are 25-100x slower than cache hits',
          'It reduces memory usage',
          'It simplifies garbage collection',
        ],
        correct: 1,
        explanation: 'CPU cache hit: ~1-4ns. RAM access: ~100ns. Cache miss = 25-100x penalty. Sequential access lets the hardware prefetcher load data before it is needed. Random pointer chasing defeats the prefetcher.',
      },
      {
        q: 'io_uring reduces I/O overhead by:',
        options: [
          'Compressing I/O data before transmission',
          'Shared ring buffers between user and kernel space — batches of I/O operations submitted without per-I/O syscalls',
          'Caching frequently accessed files',
          'Prioritizing I/O over other system calls',
        ],
        correct: 1,
        explanation: 'Traditional async I/O: a syscall per operation. io_uring: user-space writes to a submission ring; kernel reads without a syscall. Completion events in another ring. Syscall overhead is amortized across a batch.',
      },
    ],
  },
  {
    id: 'nos-m11',
    track: 'networks-os' as any,
    title: 'Networking for Modern Web Apps',
    subtitle: 'CDNs, WebSockets, HTTP/3, edge computing — the modern web infrastructure stack',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 11,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Content Delivery Network (CDN)', definition: 'Globally distributed edge servers caching and serving content close to users via Anycast routing; reduces latency by minimizing RTT to origin; absorbs DDoS at scale.' },
      { term: 'WebSocket', definition: 'Full-duplex protocol over a single TCP connection; begins as HTTP/1.1 Upgrade request; enables real-time bidirectional communication (chat, live data, multiplayer) without polling.' },
      { term: 'HTTP/3 (QUIC)', definition: 'HTTP built on QUIC (UDP-based); eliminates TCP head-of-line blocking via per-stream reliability; 0-RTT connection resumption; built-in TLS 1.3; designed for unreliable networks.' },
      { term: 'Edge Computing', definition: 'Executing computation at CDN edge nodes close to users; enables low-latency auth checks, geo-routing, A/B testing without round-tripping to origin; Cloudflare Workers, Vercel Edge Functions.' },
      { term: 'Server-Sent Events (SSE)', definition: 'One-way server-to-client HTTP streaming; plain HTTP with Content-Type: text/event-stream; built-in reconnection; used for LLM token streaming, live data feeds.' },
    ],
    content: `## Networking for Modern Web Apps

### CDN Architecture

CDN edge nodes (PoPs) in dozens of cities. User traffic routed to nearest PoP via **Anycast** (multiple IPs announce the same address; BGP routes to closest).

**What CDNs cache**: static assets (set \`Cache-Control: public, max-age=31536000, immutable\` for versioned files), HTML, API responses.

**Cache invalidation**: TTL-based (simple, allows stale), Purge API (explicit on deploy), Surrogate keys / cache tags (invalidate all pages tagged with a key, e.g., all product pages for a category).

**CDN for security**: WAF rules at the edge; volumetric DDoS absorbed at CDN before reaching origin.

### Real-Time Communication

**Polling**: client asks "anything new?" every N seconds. Simple but wasteful.

**Long polling**: server holds connection until data arrives. Less wasteful.

**WebSocket handshake**: HTTP/1.1 Upgrade request → 101 Switching Protocols → bidirectional frame exchange. Either side sends frames anytime.

Frame opcodes: text (0x1), binary (0x2), ping/pong (0x9/0xA), close (0x8).

**SSE** (\`Content-Type: text/event-stream\`): server pushes events as text lines; \`EventSource\` in browser auto-reconnects. Simpler than WebSocket for one-directional streams. Used by OpenAI, Anthropic for token streaming.

### HTTP/3 and QUIC

**TCP head-of-line blocking**: one lost packet stalls all subsequent packets in the connection. HTTP/2 multiplexes over TCP — but one TCP-level loss stalls all HTTP/2 streams.

**QUIC** (UDP-based): per-stream reliability — loss in stream 1 doesn't block stream 2.

**Additional QUIC benefits**:
- **0-RTT resumption**: cached session parameters allow data in first packet
- **Built-in TLS 1.3**: encryption not optional
- **Connection migration**: connection ID in QUIC header, not 5-tuple — IP change (WiFi → cellular) doesn't disconnect

HTTP/3: ~30% of web traffic (2024). Cloudflare, Google, Vercel support it.

### Edge Computing

Run computation at the CDN edge node closest to the user instead of a central data center.

**Use cases**: JWT verification at edge, geo-redirect without origin RTT, A/B test variant assignment, bot detection, request/response transformation.

**Edge runtimes** (Cloudflare Workers, Vercel Edge Functions): V8 isolates start in ~0.5ms vs container cold starts (~500ms). Limitation: no Node.js APIs, limited I/O, short execution time.

**Edge + origin pattern**: edge handles routing/caching/auth; origin handles stateful computation and database queries.

### Load Balancers

**L4** (TCP/IP): routes by IP/port; doesn't inspect HTTP payload. Fast; for high-throughput UDP/TCP.

**L7** (HTTP): path routing (/api → API servers), header-based canary routing, session affinity.

**Algorithms**: round-robin, least connections, weighted, consistent hashing (same key → same server; cache locality; minimal disruption when servers added/removed).

### Service Mesh

**Sidecar proxy** (Envoy) alongside each service container — all traffic flows through sidecars. Provides: mTLS between services (automatic cert issuance), traffic management (retries, timeouts, circuit breaking, canary splits), observability (traces, metrics without code changes).

**Circuit breaker**: if downstream error rate exceeds threshold, immediately return errors for subsequent requests rather than waiting for timeouts. Prevents cascading failures.`,
    quiz: [
      {
        q: 'A CDN reduces latency primarily by:',
        options: [
          'Compressing content before delivery',
          'Serving cached content from edge nodes geographically close to users, minimizing the round-trip time to origin',
          'Using faster network cables than ISPs',
          'Prioritizing CDN traffic over other internet traffic',
        ],
        correct: 1,
        explanation: 'RTT is bounded by the speed of light — NYC to London ≈ 70ms. A CDN edge in London serves users there at ~5ms. Geographic proximity is the fundamental mechanism.',
      },
      {
        q: 'HTTP/3 (QUIC) eliminates TCP head-of-line blocking by:',
        options: [
          'Sending packets in a different order',
          'Running over UDP with per-stream reliability — a lost packet in stream 1 doesn\'t block stream 2',
          'Retransmitting lost packets faster than TCP',
          'Eliminating packet loss through better routing',
        ],
        correct: 1,
        explanation: 'TCP: all bytes in a connection are ordered. One lost packet stalls ALL subsequent bytes. QUIC over UDP: each stream has its own reliability state. Stream 1\'s loss only blocks stream 1.',
      },
      {
        q: 'SSE is preferred over WebSocket for LLM token streaming because:',
        options: [
          'SSE supports binary data better',
          'SSE is one-directional (server to client), simpler, works through standard proxies and CDNs, with built-in reconnection',
          'SSE has lower latency',
          'SSE supports more concurrent connections',
        ],
        correct: 1,
        explanation: 'LLM streaming is one-directional. SSE is plain HTTP — works through all standard proxies without special handling. EventSource auto-reconnects. WebSocket is more complex and some proxies require special configuration.',
      },
      {
        q: 'Edge computing runs computation at edge nodes because:',
        options: [
          'Edge nodes have more compute capacity',
          'Edge nodes are geographically close to users — latency-sensitive stateless operations (auth, geo-routing, bot detection) don\'t require a round trip to the data center',
          'Edge nodes are cheaper to operate',
          'Edge nodes can access databases more efficiently',
        ],
        correct: 1,
        explanation: 'JWT verification at origin: 70-100ms RTT. At edge node near the user: 5-10ms. For auth checks on every request, this latency difference is significant at scale.',
      },
      {
        q: 'Consistent hashing in load balancing improves cache locality because:',
        options: [
          'It distributes load more evenly than round-robin',
          'The same key always routes to the same server — that server\'s in-memory cache is warm for that key; round-robin routes the same key to all servers, making caching ineffective',
          'It prevents server overload',
          'It eliminates the need for session affinity',
        ],
        correct: 1,
        explanation: 'Consistent hashing: hash(key) → server. Same URL always goes to same server → warm cache. Round-robin: same URL rotates through all servers → cold caches everywhere.',
      },
    ],
  },
  {
    id: 'nos-m12',
    track: 'networks-os' as any,
    title: 'Site Reliability Engineering (SRE)',
    subtitle: 'Incident response, on-call, runbooks, postmortems — operating production systems',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 18,
    module: 12,
    certArea: 'Networks & Operating Systems',
    keyTerms: [
      { term: 'Incident Management', definition: 'Structured process: detect → alert → page on-call → triage → mitigate → resolve → postmortem; roles: incident commander (coordination), technical lead (diagnosis), communications lead (stakeholder updates).' },
      { term: 'Toil', definition: 'Manual, repetitive, tactical work that scales with service growth and provides no enduring value; SRE principle: keep toil below 50% of time; automate toil away to avoid burnout and reliability degradation.' },
      { term: 'Blameless Postmortem', definition: 'Document written after significant incidents capturing timeline, root cause analysis, contributing factors, and action items; blameless = focuses on systemic failures, not individuals; enables organizational learning.' },
      { term: 'Error Budget', definition: 'The allowable downtime/error rate from an SLO (99.9% = 43.8 min/month); when budget is plentiful, deploy frequently; when exhausted, reliability work takes priority over features.' },
      { term: 'SLO / SLI / SLA', definition: 'SLI: measured metric (P99 latency, error rate). SLO: internal target (99.9% requests under 200ms). SLA: customer contract commitment (always ≤ SLO); breach triggers consequences.' },
    ],
    content: `## Site Reliability Engineering (SRE)

### The SRE Philosophy

Google invented SRE when they realized that traditional ops (manually managing infrastructure separately from developers) didn't scale. SRE applies software engineering to operations: build automation, observability, and runbooks so repeated problems are solved permanently.

**SLOs + error budgets**: SLOs make reliability measurable. If SLO is 99.9%, error budget = 0.1% of the month (~43 minutes). When budget is full: deploy freely, run experiments. When budget is depleted: reliability work takes precedence over features.

**Toil elimination**: SRE teams track toil fraction. If > 50% of time is manual repeated work (handling the same alert the same way weekly), the team is in a reactive spiral. Goal: identify toil, automate it, redeploy time to proactive reliability work.

### The Four Golden Signals

Monitor these to cover the main ways a service fails users:
1. **Latency**: time to serve a request (P50, P95, P99)
2. **Traffic**: demand on the system (req/s, active users)
3. **Errors**: rate of failed requests (5xx, exceptions, timeouts)
4. **Saturation**: utilization of constrained resources (CPU, memory, connection pool, disk)

**Alerting principles**:
- Alert on symptoms (user-visible impact), not causes (CPU > 80% may not affect users)
- Every alert must be actionable — if no action exists, remove the alert
- < 2 pages per on-call shift; more degrades response quality
- Alert on SLO burn rate (budget burning too fast), not on individual errors

### Incident Response

**Severity**: P0 (service down), P1 (significant degradation), P2 (partial impact), P3 (minor).

**Roles**: Incident Commander (coordinates, delegates, communicates), Technical Lead (diagnoses, mitigates), Communications Lead (status page, stakeholder updates).

**Mitigation vs resolution**: mitigation stops user impact fast (roll back, disable feature, reroute). Resolution fixes the root cause. During an active incident: prioritize mitigation first — get users back, then fix root cause.

### Runbooks

Runbooks: step-by-step guides for specific alerts. Linked directly from the alert definition. Contents: what the alert means → diagnostic commands → decision tree (if X high, do Y) → escalation path.

Example "High P99 Latency" runbook:
1. Check error rate (if high → separate error incident)
2. Check recent deploys → roll back candidate
3. Check DB query time (\`SELECT * FROM pg_stat_activity\`)
4. Check CPU → flame graph, consider scaling
5. Check external dependencies
6. Escalate to senior engineer if unclear

### Blameless Postmortems

**Why blameless**: blame → engineers hide problems → missed learning → more incidents. Blameless → honesty → systemic fixes → fewer incidents.

**Structure**:
1. **Summary**: impact, duration, resolution
2. **Timeline**: minute-by-minute from monitoring, deploy logs, Slack, git
3. **Root cause**: 5-whys. "Alert fired" is not a root cause.
4. **Contributing factors**: missing docs, inadequate monitoring, thin on-call rotation
5. **Action items**: specific, assigned, time-bound. Bad: "improve monitoring." Good: "Add P99 latency alert at 200ms for payment checkout endpoint with runbook, assigned to @eng, by end of sprint."

### Capacity Planning

Measure current utilization → forecast growth (historical trend + planned launches) → determine headroom (target ~70% max utilization for spikes) → plan capacity additions with lead time.

**Load testing**: validate capacity assumptions. A service handling 1000 req/s should be tested at 2000 req/s to understand failure modes.`,
    quiz: [
      {
        q: 'The four golden signals of SRE monitoring are:',
        options: [
          'CPU, memory, disk, network',
          'Latency, traffic, errors, saturation — covering user experience, demand, failure rate, and resource limits',
          'Uptime, response time, throughput, availability',
          'Requests, responses, timeouts, retries',
        ],
        correct: 1,
        explanation: 'Google\'s four golden signals cover the main failure modes: Latency (how slow), Traffic (how much demand), Errors (how many failures), Saturation (how full). Together they detect most user-impacting issues.',
      },
      {
        q: 'Alerting on symptoms rather than causes means:',
        options: [
          'Alerting on P99 latency or error rate rather than CPU usage or disk space',
          'Waiting for users to report problems before alerting',
          'Alerting on any metric above 80% utilization',
          'Alerting only after multiple failures',
        ],
        correct: 0,
        explanation: 'Symptom alert: "5xx rate > 1%" pages you when users are affected. Cause alert: "CPU > 80%" pages you for something that may not affect users. Symptom-based alerting pages only for real user impact.',
      },
      {
        q: 'In incident response, mitigation differs from resolution in that:',
        options: [
          'Mitigation is permanent; resolution is temporary',
          'Mitigation stops user impact quickly (rollback, feature disable); resolution fixes the root cause — prioritize mitigation first',
          'Resolution requires a postmortem; mitigation does not',
          'Mitigation is the on-call\'s job; resolution is the developer\'s',
        ],
        correct: 1,
        explanation: 'During an outage: first stop the bleeding (mitigation) — roll back, disable feature, reroute traffic. Get users back. Then investigate root cause (resolution). Trying to fix root cause during the outage takes too long.',
      },
      {
        q: 'Blameless postmortems improve reliability because:',
        options: [
          'They hold individual engineers accountable',
          'A blame culture causes engineers to hide problems; blameless postmortems surface systemic failures and allow the organization to learn and prevent recurrence',
          'They reduce the number of incidents',
          'They document who was on-call during incidents',
        ],
        correct: 1,
        explanation: 'Blame → hiding → missed learning → more incidents. Blameless → honesty → systemic fixes → fewer incidents. Humans make mistakes in complex systems; design the system to make mistakes less likely and more detectable.',
      },
      {
        q: 'SRE toil refers to:',
        options: [
          'The physical discomfort of on-call work',
          'Manual, repetitive operational work that scales with service growth and provides no enduring value — if > 50% of on-call time, automate it away',
          'Complex debugging that takes too long',
          'Documentation that is difficult to write',
        ],
        correct: 1,
        explanation: 'Toil: handling the same alert the same way every week. It grows as the service grows. SRE principle: keep toil < 50% of time; automate it away. Otherwise the team is permanently reactive and cannot improve reliability.',
      },
    ],
  },
]
