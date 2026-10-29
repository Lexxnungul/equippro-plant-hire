# EquipPro Plant Hire

> **Industrial-grade equipment leasing and fleet logistics web application operating across Lagos, Nigeria.**  
> Built for civil infrastructure contractors, commercial project managers, and central depot dispatchers under high-glare field environments and low-bandwidth network constraints.

---

## 🏗️ Overview

EquipPro Plant Hire manages the commercial and operational lifecycle of heavy earthmoving machinery, industrial power generators, soil compactors, and rough-terrain mobile cranes.

Operating in high-demand construction corridors (such as the Lekki-Epe Expressway and Ikeja Industrial Estate), the platform eliminates common civil engineering operational friction:
* **Mobilization Demurrage:** Replaces paper dispatch delays with an authorized, cryptographically signed Gate Pass issued in $\le 120\text{ seconds}$.
* **Security Deposit Disputes:** Reconciles post-hire return wear-and-tear, repair invoices, and fuel shortfalls (₦1,250/L) against ring-fenced deposits with full audit logging.
* **Catastrophic Equipment Downtime:** Prevents engine seizure through hard 250-hour preventative maintenance dispatch lockouts.
* **Dual-Ledger Compliance:** Enforces a physical separation between operational payment failures (`payment_attempts`) and immutable statutory financial records (`payments`).
* **High-Glare Visibility:** Built on a Material Design 3 high-contrast design system achieving $\ge 7:1$ contrast ratios (WCAG AAA) for outdoor readability under direct tropical sunlight.

---

## 👥 Target Personas & RBAC Matrix

| Capability / Action | `CONTRACTOR` | `DEPOT_ADMIN` |
| :--- | :---: | :---: |
| **Fleet Availability & Live Technical Specs** | ✅ Read-Only | ✅ Full Control |
| **Mobilization Booking Requests** | ✅ Self | ❌ (On-behalf only) |
| **Security Deposit Balances & Itemized Deductions** | ✅ Own Tenancy | ✅ Global Audit |
| **Pre-Dispatch Inspection & Gate Pass Release** | ❌ (Unauthorized) | ✅ Cryptographic Write |
| **250-Hour Preventative Maintenance Override** | ❌ (Unauthorized) | ✅ Certified Write |
| **Payment Drop-Off Diagnostics** | ❌ (Unauthorized) | ✅ Audit Log Mode |
| **Administrative Console (`/admin/*`) Access** | ❌ **403 Forbidden** | ✅ Authorized |
| **Account Erasure Request (NDPA Compliance)** | ✅ 7-Day Grace | ❌ Super-Admin Vetting |

---

## ⚙️ Core Architecture & Domain Logic

### 1. Single-Page Authentication Canvas (`/auth`)
* Operates on route `/auth` switched dynamically via query parameter contracts: `?mode=login`, `?mode=register`, and `?mode=reset` with zero full-page reloads.
* Nigerian business entity verification: Corporate Affairs Commission (`cacNumber`) validation (`/^(RC|BN|IT|LLP)-?\d{6,8}$/i`) and E.164 phone normalization (`+234...`).
* Hashing via **Argon2id** (3 iterations, 64 MB memory cost, 4 threads).
* Cryptographic 6-digit CSPRNG verification code pipeline ($100000–999999$) with SHA-256 digests and 10-minute expiry windows.
* Cookies strictly formatted with `__Host-equippro_session`, `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`.

### 2. State-Machine Driven Machinery Inventory
Machines transition through 5 explicit operational states enforced at the database level:
```
AVAILABLE ──> ALLOCATED_PENDING_DISPATCH ──> ON_HIRE_ACTIVE ──> DEPOT_RECONCILE ──> AVAILABLE
                                                     │                                   ▲
                                                     └───> MAINTENANCE_HOLD ─────────────┘
```
* **Dry Hire vs. Wet Hire:**
  $$\text{Total Cost} = (\text{Base Rate} + [\text{Wet Hire Operator @ ₦35,000/day}]) \times \text{Days} + \text{Mobilization Fee} + \text{Security Deposit}$$
* **Overstay Penalty:** $1.50 \times \text{Daily Base Rate}$ per day past contract completion.

### 3. Dual-Ledger Financial Architecture
* **`payments` (Balance-Sheet Ledger):** Contains **only** settled, cryptographically reconciled transactions. Immutable ledger recorded in integer **Kobo** (`BIGINT`).
* **`payment_attempts` (Diagnostic Ledger):** Captures initialization events, network timeouts, payment gateway errors, and user abandonment for granular drop-off analytics.

### 4. 250-Hour Preventative Maintenance Telematics
* Tracks running engine hours against a mandatory 250-hour service cycle:
  $$\text{Hours to Next Service} = 250 - (\text{Total Operating Hours} \pmod{250})$$
* **Warning Trigger:** High-contrast warning banner displayed at $\le 25\text{ operational hours}$ remaining.
* **Dispatch Lockout:** At $0\text{ hours}$ remaining, asset automatically trips to `MAINTENANCE_HOLD`, blocking dispatch allocation until a certified `DEPOT_ADMIN` service reset is recorded.

### 5. Statutory Retention vs. Right-to-Erasure Pipeline
Reconciles the **Nigerian Data Protection Act (NDPA)** right-to-erasure with statutory **CAMA 2020 / FIRS 7-year tax audit** mandates:
1. Deletion request initiates an immediate 7-day session revocation grace period.
2. Scheduled daily worker (`02:00 UTC`) scrubs PII (anonymizing email to `deleted-user-<UUID>@anonymized.equippro.ng`), purges active sessions, and wipes diagnostic telemetry.
3. Financial records in `payments` remain permanently intact with exact Kobo figures for statutory audit defense.

---

## 🎨 Design System & Accessibility

The UI strictly adheres to **Material Design 3 (M3)** tokens anchored to **Industrial Forge Rust (`#9A3412` Tone 40)**:
* **Source of Truth:** Defined in `design-tokens.tokens.json` and compiled via `scripts/convert-tokens.js` into CSS Custom Properties (`src/styles/tokens.css`).
* **Two-Tier Architecture:** Tier 1 Primitives (base palette, prohibited in markup) $\to$ Tier 2 Semantic Roles (`var(--color-primary)`, `var(--color-surface)`, `var(--color-outline)`).
* **Zero Raw Hex Literals:** Component code contains zero hardcoded hex codes.
* **WCAG AAA Sunlight Contrast:** All core copy achieves $\ge 7:1$ contrast against surface backgrounds.
* **Non-Color Error Indicators:** Form and status indicators pair color transitions with SVG alert icons and descriptive labels (accommodating color vision deficiencies).
* **Typography:** Built on **DM Sans** with fluid responsive clamp formulas (`clamp(2.25rem, 4vw + 1rem, 3.5rem)`).

---

## 💻 Tech Stack

* **Framework & Runtime:** [Next.js 14](https://nextjs.org/) (App Router) + Node.js (TypeScript Strict Mode).
* **Styling & Tokens:** Semantic CSS Custom Properties generated from Figma design tokens.
* **Validation:** [Zod](https://zod.dev/) schemas shared across client forms and server routes.
* **Database & ORM:** PostgreSQL + [Prisma ORM](https://www.prisma.io/) (UUID primary keys, BIGINT Kobo currency, pgvector support).
* **Security & Crypto:** `@node-rs/argon2`, Web Crypto API CSPRNG (`crypto.getRandomValues`).
* **Caching & Rate Limiting:** Upstash Redis (Sliding window rate limits: 5 attempts / 15 min on login, 3 / hr on registration).

---

## 📁 Project Structure

```
├── .agents/
│   ├── rules/                 # Architectural guardrails (database, design, RBAC, validation)
│   └── skills/                # Standardized procedure playbooks
├── docs/
│   ├── AGENTS.md              # Engineering boundaries and stack constraints
│   └── equippro_plant_hire_prd.md # Authoritative Product Requirements Document
├── scripts/
│   └── convert-tokens.js      # Two-tier token compiler (JSON -> tokens.css)
├── src/
│   ├── app/
│   │   ├── (contractor)/
│   │   │   └── catalog/       # Fleet catalog, rate calculator & availability
│   │   ├── layout.tsx         # Root layout with global design token injection
│   │   └── page.tsx           # Root redirection handler
│   └── styles/
│       └── tokens.css         # Autogenerated Tier 1 & Tier 2 CSS variables
├── design-tokens.tokens.json  # Authoritative design token source of truth
├── package.json               # Manifest with approved dependencies
└── tsconfig.json              # Strict TypeScript compiler options (@/* paths)
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.17+ or v20+ (tested on v24)
* **npm:** v9+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/EquipPro-Plant-Hire.git
   cd EquipPro-Plant-Hire
   ```

2. Install approved dependencies:
   ```bash
   npm install
   ```

3. Compile design tokens (if updating `design-tokens.tokens.json`):
   ```bash
   npm run build:tokens
   ```

4. Start local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the Fleet Catalog.

5. Run type checks and production build:
   ```bash
   npm run build
   ```

---

## 📜 Compliance & Verification Checklist

- [x] **Zero Raw Hex Literals:** All UI styling consumes semantic CSS Custom Properties.
- [x] **Strict Type Safety:** Clean compilation with zero TypeScript errors (`npx tsc --noEmit`).
- [x] **Static Build Integrity:** Next.js production build completes with 0 errors (`npm run build`).
- [x] **Dual-Ledger Separation:** Distinct physical isolation between `payments` and `payment_attempts`.
- [x] **250-Hour Maintenance Gate:** Lockout trigger on engine runtime thresholds.
