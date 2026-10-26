# equippro plant hire

## Description
EquipPro Plant Hire is an equipment leasing and logistics web application designed for civil engineering contractors and depot fleet operators in Lagos, Nigeria. The platform manages the commercial and operational lifecycle of heavy earthmoving machinery, industrial power generators, and compaction equipment under harsh field and sunlight conditions[cite: 5, 45]. It provides authoritative control over asset dispatch clearance, operator day-rate billing, dual-ledger payment tracking, 250-hour preventative maintenance lockouts, and legally compliant data retention.

## Who uses it
* `CONTRACTOR`: Construction Site Project Managers and Procurement Officers who browse fleet availability, initiate equipment hire bookings, verify mobilization dispatch status, monitor security deposit deductions, and manage account credentials.
* `DEPOT_ADMIN`: Fleet Operations and Dispatch Managers who execute pre-dispatch plant inspections, issue cryptographically signed Gate Passes, perform 250-hour preventative maintenance resets, reconcile wear-and-tear deposit deductions, and inspect transaction failure diagnostics.

## One thing that the agent must do well
Enforce absolute boundaries across UI and server execution: never allow raw hex values in styling (consume semantic CSS variables derived from primary `#9A3412` pinned to Tone 40), never accept unvalidated inputs on the server (validate every payload via Zod schemas), never write failed checkouts to the authoritative payment ledger, and stop execution immediately if the database is unreachable rather than displaying false-success states[cite: 6, 11, 24, 45].

## Defined Scope for the MVP
* Single-page authentication hub rendering forms conditionally on route `/auth` strictly via the query parameter contract `?mode=login`, `?mode=register`, and `?mode=reset` with zero full-page reloads[cite: 16, 45].
* Sliding-window Redis rate limits returning HTTP 429: exactly 5 attempts per 15 min per IP+email tuple on login, and 3 requests per hour per IP on registration[cite: 25, 45].
* Async email verification dispatching a 6-digit CSPRNG token (`100000`–`999999`) hashed via SHA-256 with a 10-minute expiry window[cite: 25, 45].
* Equipment catalog enforcing the 5 explicit machine states: `AVAILABLE`, `ALLOCATED_PENDING_DISPATCH`, `ON_HIRE_ACTIVE`, `DEPOT_RECONCILE`, and `MAINTENANCE_HOLD`.
* Strict dual-ledger persistence: completed transactions write exclusively to `payments`, while abandoned, timed-out, or failed checkouts write exclusively to `payment_attempts`[cite: 22, 23, 45].
* 250-hour preventative maintenance enforcing an inline warning at 25 hours or fewer to threshold, operational dispatch lockout at 0 hours, and clearance resets executable solely by `DEPOT_ADMIN` logging technician and parts batch IDs.
* Role-based route guards blocking `/admin/*` from non-admins with an immediate HTTP 403 Forbidden, zero admin UI component mounting, and security audit log generation[cite: 33, 34, 45].
* Idempotent background worker running a 7-day soft-delete grace period that purges `sessions`, anonymizes PII in `users`, and permanently preserves `payments` records intact for statutory CAMA/FIRS 7-year audit compliance.
* High-contrast UI achieving at least 7:1 contrast on body text, with non-color form errors requiring an error border, SVG caution icon, and `aria-describedby` programmatic text linkage[cite: 18, 45].
* `retrieval_chunks` DDL schema definition only; vector generation and RAG search query pipelines are explicitly deferred beyond initial scaffold.

## Not in scope items for the MVP
* Consumer peer-to-peer machinery marketplace listings (exclusive fleet brokerage only)[cite: 45].
* Native CAN-Bus or in-cylinder IoT direct ECU socket streaming (runtime tracked via operational logs)[cite: 45].
* Dynamic automated deposit dispute settlements or programmatic refund disbursements without manual depot inspection[cite: 45].
* Third-party on-demand haulage freight dispatch integrations (internal depot-zone pricing only)[cite: 45].
* Live vector embedding generation pipelines and vector cosine similarity search executions.

## Stack
* Framework: Next.js (App Router) + Node.js[cite: 45].
* Language: TypeScript (strict type checking across all boundaries)[cite: 10, 45].
* Database & ORM: PostgreSQL + Prisma ORM[cite: 45].
* Styling: Tailwind CSS + CSS Custom Properties (M3 semantic color roles derived from `#9A3412` pinned to Tone 40; zero raw hex values)[cite: 6, 7, 45].
* Boundary Validation: Zod schemas enforced on both client and route handler layers[cite: 24, 45].
* Cryptography: `@node-rs/argon2` configured strictly to 3 iterations, 64 MB (65,536 KiB) memory cost, and 4 threads; Web Crypto API CSPRNG for session IDs and tokens[cite: 25, 30, 45].
* Session Management: Hashed cookie `__Host-equippro_session` with `HttpOnly; Secure; SameSite=Strict`[cite: 30, 45].
* Centralized Cache & Limiting: Upstash Redis / Valkey sliding-window rate limiter[cite: 25, 45].
* Background Queue: BullMQ / Trigger.dev for asynchronous email dispatch and scheduled 02:00 UTC deletion worker[cite: 25, 26, 45].

## Folder map
```text
src/
├── app/
│   ├── (auth)/auth/page.tsx               # SPA mode-switched auth canvas (?mode=)
│   ├── (contractor)/catalog/page.tsx      # Fleet browsing & booking flow
│   ├── (admin)/admin/                     # RBAC protected admin routes (403 guard)
│   │   ├── dispatch-console/page.tsx      # Gate pass issuance & checklist
│   │   └── fleet-console/page.tsx         # Maintenance lockout overrides
│   └── api/
│       ├── auth/[...route]/route.ts       # Login, register, verify, logout handlers
│       └── webhooks/payment/route.ts      # Dual-ledger payment reconciler
├── components/
│   └── ui/                                # M3 token-based high-contrast components
├── lib/
│   ├── crypto/                            # Argon2id hasher & CSPRNG generator
│   ├── db/                                # Prisma client connection manager
│   ├── rate-limit/                        # Sliding-window Redis counters
│   └── validation/                        # Zod schemas for boundary validation
└── jobs/
    ├── mailer.ts                          # Asynchronous email queue worker
    └── compliance-purge.ts                # Idempotent 02:00 UTC statutory deletion job
prisma/
└── schema.prisma                          # 5-table relational schema + pgvector DDL