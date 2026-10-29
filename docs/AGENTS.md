equippro plant hire

Description

EquipPro Plant Hire is an industrial-grade equipment leasing and fleet logistics web application operating in Lagos, Nigeria. The platform manages the commercial and operational lifecycle of heavy earthmoving machinery, industrial power generators, and compaction equipment under high-glare field environments and low-bandwidth network constraints. It provides authoritative control over machine mobilization verification, certified operator billing, dual-ledger payment accounting, 250-hour preventative maintenance lockouts, and statutory tax vs. right-to-erasure data compliance.

Who uses it

CONTRACTOR: Site Project Managers and Procurement Officers who view fleet availability and technical specifications, calculate daily rental rates, verify dispatch mobilization status, monitor security deposit deduction balances, and initiate account deletion requests.

DEPOT_ADMIN: Central Depot Fleet Dispatchers and Operations Heads who execute pre-dispatch physical checklist inspections, issue cryptographically signed Gate Passes, perform 250-hour preventative maintenance overrides, reconcile post-hire deposit damage/fuel deductions, and inspect transaction drop-off diagnostics.

One thing that the agent must do well

Enforce absolute boundaries across UI rendering and backend execution: consume only semantic CSS variables derived from primary #9A3412 pinned to Tone 40, enforce 3-part non-color error indicators (structural border, adjacent SVG icon, aria-describedby), validate every server payload via Zod schemas, write failed checkouts strictly to payment_attempts, and stop execution immediately with visible errors if the database is unreachable rather than displaying false-success states.

Defined Scope for the MVP

Single-page authentication hub rendering forms conditionally on route /auth strictly via the query parameter contract ?mode=login (default fallback when parameter is absent or invalid), ?mode=register, and ?mode=reset with zero full-page reloads.

Registration form validation with Nigerian field rules (companyName, cacNumber, phoneNumber, email, password) and mandatory terms acceptance.

Asynchronous 6-digit CSPRNG verification code pipeline (100000–999999) hashed via SHA-256 with a 10-minute expiry window.

Sliding-window Redis rate limits returning HTTP 429: exactly 5 attempts per 15 min per IP+email tuple on login, and 3 requests per hour per IP on registration.

Machinery inventory state tracking across 5 explicit states: AVAILABLE, ALLOCATED_PENDING_DISPATCH, ON_HIRE_ACTIVE, DEPOT_RECONCILE, and MAINTENANCE_HOLD.

Strict dual-ledger persistence: checkout initialization, payment gateway drop-offs, timeouts, and failures write exclusively to payment_attempts, while only verified, cryptographically settled transactions write to payments.

Itemized security deposit deduction protocol for fuel shortfalls (₦1,250/L), verified repair invoices, and overstay penalties ($1.5\times$ daily rate).

250-hour preventative maintenance tracking with an inline UI warning at $\le 25\text{ hours}$ to threshold, and operational dispatch lockout at 0 hours remaining (total_hours_run - last_service_hours >= 250).

Role-based route guards redirecting unauthenticated visitors to /auth?mode=login, and blocking authenticated users with role !== 'DEPOT_ADMIN' from /admin/* with an immediate HTTP 403 Forbidden, zero admin UI component mounting, and security audit log generation.

Statutory 7-day soft-delete grace period with an idempotent background worker purging sessions, irreversibly anonymizing users PII, and retaining payments records intact for CAMA/FIRS 7-year audit requirements.

High-contrast UI achieving $\ge 7:1$ contrast on body copy, with non-color form errors requiring a structural border, adjacent SVG caution icon, and aria-describedby linkage.

retrieval_chunks DDL schema definition with pgvector extension inclusion only, verified via schema compilation; embedding generation and vector search queries are explicitly deferred.

Not in scope items for the MVP

Consumer peer-to-peer machinery marketplace listings (brokerage restricted strictly to company-contracted depot fleet).

Native CAN-Bus or in-cylinder IoT direct ECU socket streaming (runtime tracked via operational check-in/check-out logs).

Dynamic automated deposit dispute settlements or programmatic refund disbursements without manual depot inspection.

Third-party on-demand haulage freight logistics marketplace integrations (pricing calculated via internal flat depot-zone rates).

Live vector embedding generation pipelines, semantic search route handlers, and RAG completion agents.

Stack

Framework & Runtime: Next.js (App Router) + Node.js (TypeScript with strict typing enabled).

Database & ORM: PostgreSQL + Prisma ORM (relational schema, UUID primary keys, forward-only migrations, pgvector support).

Styling & Tokens: Tailwind CSS + CSS Custom Properties (semantic roles derived from Primary #9A3412 pinned to Tone 40; zero raw hex values in components).

Boundary Validation: Zod schemas shared across client form hooks and server Route Handlers.

Cryptography & Auth: @node-rs/argon2 configured to 3 iterations, 64 MB ($65,536\text{ KiB}$) memory cost, and 4 threads; Web Crypto API CSPRNG (crypto.getRandomValues).

Session Management: Hashed server-side sessions with secure cookies (__Host-equippro_session, HttpOnly, Secure, SameSite=Strict, Path=/).

Cache & Rate Limiting: Upstash Redis / Valkey sliding-window rate limiter enforcing HTTP 429 (Login: 5 requests / 15 min per IP+email tuple; Register: 3 / hr per IP).

Background Queue: BullMQ / Trigger.dev for asynchronous verification email dispatch and scheduled 02:00 UTC compliance purge jobs.

Folder map

src/
├── app/
│   ├── (auth)/auth/page.tsx               # SPA mode-switched auth canvas (?mode=login|register|reset)
│   ├── (contractor)/catalog/page.tsx      # Fleet catalog browsing, daily rate calculation, clearance status
│   ├── (admin)/admin/                     # RBAC protected admin routes (403 guard)
│   │   ├── dispatch-console/page.tsx      # Gate pass issuance & inspection checklist
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
└── jobs/                                  # Background workers (async verification mail & 02:00 UTC purge)
prisma/
└── schema.prisma                          # 5-table relational schema + pgvector DDL


How to work in this codebase

One change at a time: Implement one atomic route, schema model, or component per turn. State the exact file, lines to touch, and purpose before writing code.

Ask before adding packages: Packages listed in the Stack section are pre-approved for installation; do not install any additional npm dependencies without explicit developer confirmation.

Never alter database schemas without approval: Never alter database schemas, execute migrations, or run manual database write/mutation scripts via terminal or CLI without explicit developer approval; read-only connection diagnostic pings, read-only SELECT queries, and ORM runtime queries through application code are permitted.

List assumptions at the end of every response: Explicitly detail all assumptions made during the turn, or declare that zero assumptions were made.

Stop and ask when the PRD is silent: If an edge case, rate, or behavior is not specified in docs/prd.md, stop execution and ask for clarification. Do not guess defaults.

Where the detailed rules live

Product Specifications & Schema: docs/prd.md

Business Context & Persona: docs/business-brief.md

M3 Color Roles & Contrast Matrix: docs/colour-roles.md

Typography Hierarchy & Multipliers: docs/type-scale.md

Primary-Tinted Elevation System: docs/shadows.md

Boundary Validation Schemas: src/lib/validation/

Definitions

tier: A distinct architectural layer (Client SPA, Server Boundary Validator, Persistent Database, Centralized Cache, Background Worker).

record: An immutable committed row representing a verified domain event in the database (e.g., in payments).

chunk: A bounded text segment stored in retrieval_chunks for knowledge retrieval.

Dry Hire: Machinery lease without a plant operator (contractor supplies certified personnel).

Wet Hire: Machinery lease inclusive of a certified plant operator billed at fixed daily surcharge (₦35,000/day).

Gate Pass: An ephemeral authorization token containing machine serial, transporter plate, destination GPS, and project manager contact, cryptographically signed via HMAC-SHA256 using the depot secret.

Dual-Ledger: Strict physical separation where checkout initialization, payment gateway drop-offs, timeouts, and failures write exclusively to payment_attempts, and only verified, cryptographically settled transactions write to payments.

Idempotent Worker: A background job designed so repeated executions against the same state produce identical outcomes with zero duplicate modifications.

Maintenance Hold: An operational machine status triggered when total_hours_run - last_service_hours >= 250, blocking dispatch allocation until reset by DEPOT_ADMIN.