# Product Requirements Document (PRD)

**Product Name:** EquipPro Plant Hire  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Author:** Principal Design Engineer & Lead Technical PM  
**Target Environment:** Web (Mobile-First Responsive, High-Glare Outdoor & Desktop Office)

---

## 1. Document Overview & Strategic Goals

### 1.1 Executive Summary
EquipPro Plant Hire is an industrial-grade equipment leasing and fleet logistics web application designed for civil engineering contractors, infrastructure developers, and equipment depot operators in Lagos, Nigeria. The platform manages the commercial and operational lifecycle of heavy plant machinery (excavators, industrial power generators, soil compactors, and mobile cranes). It provides end-to-end transparency over asset mobilization, operator day-rate billing, refundable security deposit reconciliations, on-site service intervals, and legally compliant dispute resolution.

### 1.2 Problem Statement
Civil construction projects face severe operational friction:
1. **Mobilization Blindspots:** Lowboy flatbed transporters arrive at construction sites without verified dispatch clearance, leading to demurrage penalties ($\approx$ ₦150,000–₦350,000/day) and idle site labor.
2. **Security Deposit Disputes:** Contractors forfeit or contest security deposits due to lack of itemized, time-stamped pre-dispatch condition logs versus return wear-and-tear and fuel shortfalls.
3. **Catastrophic Equipment Downtime:** Industrial diesel generators and earthmoving assets miss critical preventative servicing (e.g., 250-hour oil/filter service intervals), causing engine seizure and project delivery delays.
4. **Fragile Digital Architecture:** Consumerized rental scripts fail under high-glare field environments, high-latency 3G networks, and non-resilient payment processing, lacking server-side enforcement and legal-grade audit retention.

### 1.3 Target Personas

```
+-----------------------------------------------------------------------+
| PERSONA 1: Field Operations & Procurement                             |
+-----------------------------------------------------------------------+
| Name: Babatunde Adeleke                                               |
| Role: Senior Site Project Manager (Civil Infrastructure)             |
| Demographics: Age 41 | Device: Tecno Camon / Samsung A-Series (Android)|
| Context: Outdoor construction sites (Lekki-Epe Expressway corridor);  |
|          Direct sunlight, dust, intermittent 3G edge connectivity.    |
| Core Need: Instant visual confirmation of mobilization status and     |
|            deposit balances without multi-level navigation trees.     |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| PERSONA 2: Depot Fleet & Asset Control                                |
+-----------------------------------------------------------------------+
| Name: Chidinma Okonkwo                                                |
| Role: Head of Fleet Operations & Dispatch                             |
| Demographics: Age 34 | Device: HP ProBook (Desktop Chrome, Fiber LAN) |
| Context: Central Depot Office (Ikeja Industrial Estate).              |
| Core Need: Authoritative administrative control over asset release,   |
|            operator license verification, payment capture/drop-off     |
|            auditing, and maintenance lockout flags.                   |
+-----------------------------------------------------------------------+
```

### 1.4 Primary Success Metrics
* **Mobilization Clearance Time:** $\le 120$ seconds from transaction confirmation to generated Depot Gate Pass.
* **Network Payload Efficiency:** Baseline First Contentful Paint (FCP) $\le 1.8\text{s}$ and Time to Interactive (TTI) $\le 3.2\text{s}$ on throttled Fast 3G ($1.6\text{ Mbps}$ down, $750\text{ kbps}$ up, $150\text{ms}$ RTT).
* **Zero False-Success Registrations:** 100% parity between UI-reported state and relational database persistence verified via server-side assertions.
* **Audit Trail Defense Integrity:** Zero orphan financial records during statutory 7-year audit retention queries under the Nigerian Data Protection Act (NDPA) and statutory tax mandates.

---

## 2. System Scope & Non-Goals

```
+---------------------------------------------------+---------------------------------------------------+
| IN-SCOPE (Core Engineering Deliverables)          | OUT-OF-SCOPE (Explicit System Non-Goals)          |
+---------------------------------------------------+---------------------------------------------------+
| 1. Single-Page Architecture (SPA) Auth Hub        | 1. Consumer Peer-to-Peer Machinery Listings       |
|    - Conditional rendering (Login/Register/Reset) |    - System exclusively brokers company-owned or  |
|    - URL query parameter state tracking           |      fully contracted enterprise depot fleet.     |
|    - Cryptographic verification code pipeline     |                                                   |
|                                                   | 2. Native CAN-Bus / In-Cylinder IoT Stream Parser |
| 2. Heavy Plant Dispatch & Booking Engine          |    - Telematics tracked via operational hours run |
|    - Shift calculation (dry-hire vs. wet-hire)    |      logs submitted at daily check-out/check-in;  |
|    - Machine status state-machine                 |      no continuous direct ECU socket processing.  |
|                                                   |                                                   |
| 3. Dual-Ledger Financial System                   | 3. Dynamic Automated Escrow Arbitrage             |
|    - Atomic transaction logging (`payments`)      |    - Deposit dispute settlements require manual   |
|    - Separate failed attempts (`payment_attempts`)|      admin sign-off supported by site photo logs; |
|    - Deposit wear-and-tear deduction logs         |      no uninspected programmatic refunds.         |
|                                                   |                                                   |
| 4. Preventative Maintenance Telematics Scheduler  | 4. Third-Party Haulage Logistics Marketplace      |
|    - 250-hour engine runtime service thresholds   |    - Logistics pricing calculated via internal    |
|    - Automatic operational lockout triggers       |      flat/depot-zone rates; does not integrate    |
|                                                   |      external on-demand freight APIs.             |
| 5. Administrative Depot Console                   |                                                   |
|    - Role-based route authorization guards        |                                                   |
|    - Gate-pass generator, override workflows      |                                                   |
|                                                   |                                                   |
| 6. Statutory Compliance & Deletion Engine         |                                                   |
|    - Idempotent 7-day grace purge background worker|                                                  |
|    - Right-to-erasure vs. tax ledger reconciliation|                                                  |
+---------------------------------------------------+---------------------------------------------------+
```

---

## 3. Information Architecture & User Personas

### 3.1 Role & Permission Matrix (RBAC)

```
+-----------------------------------+-------------------+--------------------+
| Capability / System Domain        | `CONTRACTOR`      | `DEPOT_ADMIN`      |
+-----------------------------------+-------------------+--------------------+
| View Fleet Availability & Specs   | YES (Read-Only)   | YES (Full Access)  |
| Initiate Booking Request          | YES               | NO (On-behalf only)|
| View Company Security Deposits    | YES (Own Tenancy) | YES (Global)       |
| Process Gate Pass Release Check   | NO                | YES (Write)        |
| Execute Machine Service Reset     | NO                | YES (Write)        |
| Modify Billing Rate Multipliers   | NO                | YES (Write)        |
| Request Account Deletion (NDPA)   | YES (Self)        | NO (Super-Admin)   |
| View Failed Transaction Diagnostics| NO               | YES (Audit Mode)   |
| Access `/admin/*` Routes          | NO (403 Forbidden)| YES                |
+-----------------------------------+-------------------+--------------------+
```

### 3.2 High-Level User Journeys

#### Journey A: Contractor Field Mobilization & Booking
1. **Access:** Contractor opens application via mobile browser under high-glare field conditions.
2. **Contextual Discovery:** Navigates catalog; views 20-Tonne Excavator availability, daily dry rate, required security deposit, and mobilization transport fee.
3. **Booking Configuration:** Selects hire duration (e.g., 14 Days), specifies mobilization site GPS/address, toggles "Wet Hire" (includes certified plant operator at ₦35,000/day).
4. **Commitment & Boundary Validation:** Submits booking. Client checks schema; server intercepts payload, validates plant availability in a database transaction, calculates total deposit + hire cost, and logs a `PENDING` payment attempt record.
5. **Settlement & Dispatch Clearance:** Completes payment gateway handshake. Webhook triggers atomic record insertion into `payments` table and transitions machine state to `ALLOCATED_PENDING_DISPATCH`.

#### Journey B: Depot Fleet Manager Maintenance & Dispatch Audit
1. **Authentication:** Dispatcher logs in via desktop; session cookie issued with strict enterprise security flags.
2. **Authorization Boundary:** Navigates to `/admin/dispatch-console`. System validates role token; prevents unprivileged access.
3. **Dispatch Verification:** Inspects machine `#CAT-320-04`. Confirms:
   - Client identity verified via email verification hash.
   - Initial deposit cleared into ledger.
   - Machine operating hours: $4,710\text{ hrs}$ (Service due at $4,750\text{ hrs}$—clearance granted).
4. **Gate Pass Generation:** Issues signed Gate Pass token. Fleet mobilizes to transport carrier.

---

## 4. Core Functional Requirements & Feature Specifications

### 4.1 Single-Page Architecture (SPA) Authentication & Registration Engine

#### Functional Intent
Authentication must exist entirely on a single structural page (`/auth`) utilizing conditional rendering based on URL query state (`?mode=login`, `?mode=register`, `?mode=reset`). This eliminates redundant layout renders, preserves memory on constrained devices, prevents session-drop transitions on flaky networks, and simplifies progressive disclosure.

```
+----------------------------------------------------------------------------------------------------+
|                                         /auth Route Canvas                                         |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ ?mode=login ]               [ ?mode=register ]                  [ ?mode=reset ]                 |
|  +------------------------+    +------------------------------+    +--------------------------+    |
|  | Email Address          |    | Company / Contractor Name    |    | Account Email            |    |
|  | Password               |    | CAC / RC Registration Number |    | [ Request Reset Link ]   |    |
|  | [ Sign In ]            |    | Official Corporate Email     |    +--------------------------+    |
|  |                        |    | Direct Phone Number          |                                    |
|  | [ Switch to Register ] |    | Secure Passphrase            |                                    |
|  | [ Forgot Password? ]   |    | [x] Terms & Conditions Check |                                    |
|  +------------------------+    | [ Create Account ]           |                                    |
|                                +------------------------------+                                    |
+----------------------------------------------------------------------------------------------------+
```

#### Field Specifications & Multi-Tier Validation Rules

```
+----------------------------------------------------------------------------------------------------+
| Field Name: `companyName`                                                                          |
+----------------------------------------------------------------------------------------------------+
| Business Job: Identifies the contracting corporate entity for tax invoicing and equipment release.|
| Client-Side Rule: Trim whitespace; Min 3 characters; Max 100 characters; Must contain alphanumeric |
|                   characters matching `/^[a-zA-Z0-9\s&.-]+$/`. Real-time blur trigger.             |
| Server-Side Boundary (Zod): `z.string().trim().min(3).max(100).regex(/^[a-zA-Z0-9\s&.-]+$/)`      |
| Legitimate User Blocked: Sole proprietorships trading under personal names containing unconventional|
|                          punctuation (e.g., "O'Connor & Sons Ltd") if apostrophes are omitted from |
|                          the regex. (Mitigation: Apostrophes explicitly permitted in pattern).      |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| Field Name: `cacNumber` (Corporate Affairs Commission Reg Number)                                  |
+----------------------------------------------------------------------------------------------------+
| Business Job: Legal entity validation for corporate liability and anti-fraud verification.         |
| Client-Side Rule: Text input (NOT type="number"); format `/^(RC|BN|IT|LLP)-?\d{6,8}$/i`.           |
| Server-Side Boundary (Zod): `z.string().trim().toUpperCase().regex(/^(RC|BN|IT|LLP)-?\d{6,8}$/)`  |
| Legitimate User Blocked: Newly formed joint ventures or foreign EPC contractors operating under   |
|                          special presidential exemptions without an immediate standard RC number.   |
|                          (Mitigation: System allows an optional flag for verified manual vetting). |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| Field Name: `phoneNumber`                                                                          |
+----------------------------------------------------------------------------------------------------+
| Business Job: Immediate on-site dispatch communication and SMS logistics dispatch alerts.          |
| Client-Side Rule: Strip all non-numeric characters; format validation for Nigerian standards:      |
|                   `/^(\+?234|0)[789][01]\d{8}$/`. On-blur error display.                            |
| Server-Side Boundary (Zod): Transform to E.164 standard (`+234...`); length exact 14 chars.        |
| Legitimate User Blocked: Expatriate Site Directors using international roaming numbers (e.g., +44).|
|                          (Cost: Deliberately accepted for initial release; fallback requires local |
|                          site liaison number).                                                     |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| Field Name: `email`                                                                                |
+----------------------------------------------------------------------------------------------------+
| Business Job: Unique identity anchor, transactional receipts, cryptographic verification delivery.  |
| Client-Side Rule: Registration: RFC 5322 regex on blur. Login: Format validated ONLY on submit to  |
|                   prevent irritating intermediate keystroke error flashing.                        |
| Server-Side Boundary (Zod): `z.string().trim().toLowerCase().email().max(255)`                    |
| Legitimate User Blocked: Legitimate RFC domains containing unusual TLDs (.construction, .engineering)|
|                          if generic regex restricts to `.com`/`.org`. System uses standard parsing.|
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| Field Name: `password`                                                                             |
+----------------------------------------------------------------------------------------------------+
| Business Job: Authentication secret. Priority given to length over arbitrary complexity symbols.   |
| Client-Side Rule: Min 12 characters; max 128 characters; trailing/leading space automatically      |
|                   trimmed; inline character counter shown only once user focuses input.            |
| Server-Side Boundary (Zod): Checked against k-anonymity breached password corpus (Pwned Passwords);|
|                             raw string must NEVER be lowercased; hashed immediately via Argon2id. |
| Legitimate User Blocked: Users utilizing legacy 8-character auto-generated browser passwords.      |
+----------------------------------------------------------------------------------------------------+
```

#### Terms & Conditions Acceptance Protocol
* **Implementation:** Controlled `<input type="checkbox" id="termsAccepted" required aria-required="true" />`.
* **State Behavior:** Submit button remains visually and programmatically disabled (`disabled aria-disabled="true"`) until the checkbox is checked and all required fields pass boundary validation.
* **Informational Action:** If a user attempts to interact with the disabled button, focus shifts to a high-contrast inline helper banner stating: *"Equipment lease terms, deposit forfeiture liability, and statutory dispute protocols must be accepted before account initialization."*
* **Sourcing:** Wording adapted from the Federation of Construction Contractors Nigeria (FCCN) Standard Plant Hire Conditions (2022 Revision).

#### Asynchronous Email Verification Flow
1. **Issuance:** On successful registration, system creates user record with `is_verified = false`.
2. **Generation:** Server generates a 6-digit numeric token using a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG):
   $$\text{Token} \in [100000, 999999]$$
   Token is hashed via SHA-256 and stored in the database alongside `expires_at` ($\text{NOW}() + 10\text{ minutes}$).
3. **Dispatch:** Background worker asynchronously queues and sends the email via an SMTP relay. The HTTP registration response completes without waiting for SMTP transport resolution:
   - *Synchronous Response Target:* $\le 180\text{ms}$.
   - *Background Job Execution Target:* $\le 1500\text{ms}$.
4. **Failure Modes:**
   - *Expired Code:* Return `400 Bad Request` $\to$ Display: *"Verification code has expired. A fresh token has been dispatched."*
   - *Incorrect Code:* Return `400 Bad Request` $\to$ Display: *"Invalid code. 4 attempts remaining."* (Limit: 5 attempts per window).
   - *Reused Code:* Token is atomically invalidated (`consumed_at = NOW()`) on first verification. Re-submission yields `400 Bad Request`.

---

### 4.2 Equipment Catalog, Dispatch Booking, & Mobilization Engine

#### Machine State Machine
To guarantee zero double-bookings under concurrent client requests, every machine transitions through an explicit state machine enforced at the database level via constraints and transactional locks.

```
       +------------------------------------+
       |            AVAILABLE               |
       +------------------------------------+
                          |
             [Booking Confirmed & Paid]
                          v
       +------------------------------------+
       |    ALLOCATED_PENDING_DISPATCH      |
       +------------------------------------+
                          |
             [Depot Inspection & Release]
                          v
       +------------------------------------+
       |          ON_HIRE_ACTIVE            |
       +------------------------------------+
             /                            \
[Return Logged & Verified]     [Runtime >= Service Threshold]
           /                                \
          v                                  v
+-------------------+              +-------------------+
| DEPOT_RECONCILE   |              |  MAINTENANCE_HOLD |
+-------------------+              +-------------------+
          |                                  |
[Deposit Processed]                [Service Completed]
          |                                  |
          +---------------->+<---------------+
                            |
                            v
                     [ AVAILABLE ]
```

#### Booking Calculation Logic
* **Dry Hire Calculation:**
  $$\text{Total Cost} = (\text{Daily Base Rate} \times \text{Duration in Days}) + \text{Mobilization Flat Rate} + \text{Refundable Security Deposit}$$
* **Wet Hire Calculation:**
  $$\text{Total Cost} = ((\text{Daily Base Rate} + \text{Certified Operator Day Rate}) \times \text{Duration in Days}) + \text{Mobilization Flat Rate} + \text{Refundable Security Deposit}$$
* **Overstay Penalty Billing:**
  $$\text{Overstay Fee} = \text{Elapsed Days Past Contract} \times (\text{Daily Base Rate} \times 1.50)$$

#### The Mobilization Engine & Gate Pass System
1. **Pre-Dispatch Audit:** Once an asset is `ALLOCATED_PENDING_DISPATCH`, the Depot Admin executes a pre-dispatch checklist:
   - Operating Hours meter reading captured.
   - Hydraulic lines, track tension, and fluid levels checked.
   - 4-quadrant high-resolution asset photos uploaded to object storage.
2. **Cryptographic Gate Pass:** Upon admin clearance, the system issues an ephemeral, cryptographically signed Gate Pass containing:
   - Machine Serial Number (e.g., `EQ-CAT320-09`)
   - Authorized Haulage Transporter Plate Number
   - Destination Site GPS Coordinates & Project Manager Contact
   - HMAC-SHA256 verification hash generated via depot secret.

---

### 4.3 Financial Ledger & Security Deposit Tracking Engine

#### Architectural Mandate: The Dual-Ledger Separation
Under no circumstances may failed, interrupted, or network-dropped payment operations be logged in the primary `payments` ledger. Financial ledgers represent balance-sheet realities. Failed operations must be persisted in an isolated `payment_attempts` diagnostic table to maintain pristine auditability and tax-filing compliance while providing high-resolution drop-off analysis.

```
+----------------------------------------------------------------------------------------------------+
| PAYMENTS (The Authoritative Balance-Sheet Table)                                                   |
+----------------------------------------------------------------------------------------------------+
| Contains ONLY completed, cryptographically reconciled financial events.                            |
| Immutable: Rows are NEVER updated or deleted. Reversals or adjustments occur strictly via          |
| offsetting CREDIT/DEBIT contra-entries.                                                            |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| PAYMENT_ATTEMPTS (The Diagnostic & Operational Audit Table)                                        |
+----------------------------------------------------------------------------------------------------+
| Captures every initialization event, payment provider drop-off, network timeout, insufficient     |
| funds refusal, and abandoned checkout attempt.                                                     |
| Primary Audit Metric: Drop-off and failure analysis across cellular carriers and payment channels. |
+----------------------------------------------------------------------------------------------------+
```

#### Security Deposit Deduction Protocol
Security deposits are held in a ring-fenced liability account. Upon asset return to the central depot:
1. **Check-In Telematics Scan:** Depot admin records final runtime hours and fuel levels.
2. **Deduction Assessment:**
   - *Fuel Shortfall:* Billed at $\text{Missing Liters} \times \text{Depot Surcharge Rate (₦1,250/L)}$.
   - *Component Damage:* Itemized repair costs referencing certified supplier invoices.
   - *Overstay Accrual:* Programmatically deducted from the deposit principal.
3. **Settlement Execution:** System calculates remaining balance:
   $$\text{Refund Amount} = \text{Deposit Principal} - (\text{Fuel Surcharge} + \text{Damage Deductions} + \text{Overstay Fees})$$
   - If $\text{Refund Amount} > 0$, an outbound credit transaction is dispatched via payment rail.
   - If $\text{Refund Amount} < 0$, the remaining balance converts to an immediately due accounts-receivable invoice; client account is flagged `DEPOSIT_ARREARS_LOCKED`.

---

### 4.4 Machine Maintenance & Telematics Tracking

#### The 250-Hour Preventative Maintenance Rule
Earthmoving and industrial generation assets require mandatory preventative maintenance every **250 operating hours** (engine oil purge, primary/secondary fuel filters, air intake filters, hydraulic fluid analysis).

#### Programmatic Enforcement Mechanism
1. **Hour Tracking:** Runtime hours are logged at three touchpoints:
   - Daily morning contractor site operational log (optional contractor upload).
   - Bi-weekly field technician on-site verification.
   - Formal machine return depot check-in.
2. **Threshold Calculation:**
   $$\text{Hours to Next Service} = \text{Target Service Threshold} - (\text{Current Operating Hours} \pmod{250})$$
3. **System Behavior Triggers:**
   - $\text{Hours to Next Service} \le 25\text{ Hours}$: Interface renders high-contrast Warning Banner (`warning-container` fill with `warning` icon) on both the Contractor Console and Dispatch Board: *"Routine 250-hr service due within 25 operational hours. Schedule on-site depot technician."*
   - $\text{Hours to Next Service} = 0$: Machine transitions to `MAINTENANCE_HOLD`. If the machine is currently in the depot, the booking engine blocks dispatch allocation. If currently `ON_HIRE_ACTIVE`, a high-priority depot notification dispatches a field service crew to prevent catastrophic engine seizure.
4. **Maintenance Clearance Reset:** Only a user holding the `DEPOT_ADMIN` role can execute a service reset, requiring entry of the technician's certification number, itemized part batch numbers, and oil batch ID.

---

### 4.5 Role-Based Protected Administrative Dashboard

#### Routing Architecture & Security Isolation
All administrative operations reside strictly under the `/admin/` path tree:
* `/admin/fleet-console`: Global plant allocation, service lockout overrides.
* `/admin/dispatch-board`: Pre-dispatch inspection, gate pass generation.
* `/admin/deposit-reconciliation`: Post-hire wear-and-tear deposit deduction adjustments.
* `/admin/audit-logs`: Machine-specific transaction failure diagnostics.

#### The Copied-Link Attack Barrier (Authentication vs. Authorization)
A common vulnerability in poorly architected systems occurs when an unprivileged authenticated user pastes an administrative URL into their browser:
1. **Authentication Gate:** The application checks if the user possesses a valid active session. (Passes: User is logged in as a standard contractor).
2. **Authorization Gate (The Barrier):** Middleware interrogates the active session record stored server-side. If `user.role !== 'DEPOT_ADMIN'`:
   - System **MUST NOT** render the administrative component shell or load administrative API bundles.
   - System logs an unauthorized route penetration attempt (`SECURITY_UNAUTHORIZED_ACCESS_ATTEMPT`) tagged with user ID, IP address, and request path.
   - System terminates client traversal and returns a pristine HTTP `403 Forbidden` response.
   - The user interface renders a generic, high-contrast refusal state: *"Access Denied: This operational area requires Fleet Depot Administrative Credentials."*

---

## 5. Data Architecture & Schema Specifications

### 5.1 Relational Entity-Relationship Diagram (ERD)

```
+--------------------+       1:N       +----------------------+
|       users        |----------------<|       sessions       |
+--------------------+                 +----------------------+
| id (PK)            |                 | id (PK)              |
| company_name       |                 | user_id (FK)         |
| email              |                 | session_token_hash   |
| password_hash      |                 | ip_address           |
| role               |                 | user_agent           |
| is_verified        |                 | expires_at           |
| deleted_at         |                 +----------------------+
+--------------------+
          | 1:N
          |
          +----------------------------+
          |                            |
          v 1:N                        v 1:N
+--------------------+       +----------------------+
|      bookings      |       |   payment_attempts   |
+--------------------+       +----------------------+
| id (PK)            |       | id (PK)              |
| user_id (FK)       |       | user_id (FK)         |
| machine_id (FK)    |       | booking_id (FK, opt) |
| start_date         |       | amount_in_kobo       |
| end_date           |       | payment_channel      |
| status             |       | gateway_reference    |
+--------------------+       | error_code           |
          | 1:N              | raw_gateway_payload  |
          |                  | created_at           |
          v                  +----------------------+
+--------------------+
|      payments      |
+--------------------+
| id (PK)            |
| booking_id (FK)    |
| user_id (FK)       |
| amount_in_kobo     |
| ledger_type        |
| transaction_ref    |
| created_at         |
+--------------------+

+--------------------+       1:N       +----------------------+
|      machines      |----------------<|   maintenance_logs   |
+--------------------+                 +----------------------+
| id (PK)            |                 | id (PK)              |
| serial_number      |                 | machine_id (FK)      |
| model_name         |                 | hours_at_service     |
| category           |                 | technician_name      |
| operational_status |                 | parts_replaced       |
| total_hours_run    |                 | performed_at         |
| last_service_hours |                 +----------------------+
+--------------------+

+--------------------------+
|     retrieval_chunks     |
+--------------------------+
| id (PK)                  |
| document_title           |
| section_reference        |
| chunk_content            |
| embedding_vector         |
| metadata                 |
| created_at               |
+--------------------------+
```

### 5.2 Schema Table Definitions (Data DDL & Types)

#### Table 1: `users`
* `id`: `UUID` (Primary Key, Default: `gen_random_uuid()`)
* `company_name`: `VARCHAR(100)` (NOT NULL)
* `cac_number`: `VARCHAR(20)` (NOT NULL, UNIQUE)
* `email`: `VARCHAR(255)` (NOT NULL, UNIQUE)
* `phone_number`: `VARCHAR(20)` (NOT NULL)
* `password_hash`: `VARCHAR(255)` (NOT NULL) -- Stores Argon2id hashed secret
* `role`: `VARCHAR(20)` (NOT NULL, Default: `'CONTRACTOR'`) -- Check constraint: `IN ('CONTRACTOR', 'DEPOT_ADMIN')`
* `is_verified`: `BOOLEAN` (NOT NULL, Default: `FALSE`)
* `deletion_scheduled_at`: `TIMESTAMPTZ` (NULLABLE) -- Managed by soft-delete compliance worker
* `anonymized_at`: `TIMESTAMPTZ` (NULLABLE)
* `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* `updated_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* *Indexes:*
  - `idx_users_email` ON `users(email)`
  - `idx_users_cac` ON `users(cac_number)`
  - `idx_users_deletion` ON `users(deletion_scheduled_at) WHERE deletion_scheduled_at IS NOT NULL`

#### Table 2: `sessions`
* `id`: `UUID` (Primary Key, Default: `gen_random_uuid()`)
* `user_id`: `UUID` (NOT NULL, Foreign Key $\to$ `users.id` ON DELETE CASCADE)
* `session_token_hash`: `VARCHAR(64)` (NOT NULL, UNIQUE) -- SHA-256 hash of plaintext cookie token
* `ip_address`: `VARCHAR(45)` (NOT NULL)
* `user_agent`: `TEXT` (NOT NULL)
* `is_revoked`: `BOOLEAN` (NOT NULL, Default: `FALSE`)
* `expires_at`: `TIMESTAMPTZ` (NOT NULL)
* `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* *Indexes:*
  - `idx_sessions_lookup` ON `sessions(session_token_hash) WHERE is_revoked IS FALSE`

#### Table 3: `payments` (Authoritative Commercial Ledger)
* `id`: `UUID` (Primary Key, Default: `gen_random_uuid()`)
* `booking_id`: `UUID` (NOT NULL, Foreign Key $\to$ `bookings.id`)
* `user_id`: `UUID` (NOT NULL, Foreign Key $\to$ `users.id`)
* `amount_in_kobo`: `BIGINT` (NOT NULL) -- Exact integer value; prevents IEEE 754 floating-point drift
* `currency`: `VARCHAR(3)` (NOT NULL, Default: `'NGN'`)
* `ledger_type`: `VARCHAR(30)` (NOT NULL) -- Check: `IN ('HIRE_FEE', 'SECURITY_DEPOSIT', 'MOBILIZATION_SURCHARGE', 'DEPOSIT_REFUND', 'DAMAGE_DEDUCTION')`
* `transaction_reference`: `VARCHAR(100)` (NOT NULL, UNIQUE)
* `payment_rail`: `VARCHAR(30)` (NOT NULL) -- E.g., `'NIBSS_INSTANT_PAYMENT'`, `'PAYSTACK_DIRECT'`
* `settled_at`: `TIMESTAMPTZ` (NOT NULL)
* `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* *Indexes:*
  - `idx_payments_booking` ON `payments(booking_id)`
  - `idx_payments_user` ON `payments(user_id)`
  - `idx_payments_ref` ON `payments(transaction_reference)`

#### Table 4: `payment_attempts` (Diagnostic & Abandonment Log)
* `id`: `UUID` (Primary Key, Default: `gen_random_uuid()`)
* `user_id`: `UUID` (NOT NULL, Foreign Key $\to$ `users.id`)
* `booking_id`: `UUID` (NULLABLE, Foreign Key $\to$ `bookings.id`)
* `amount_in_kobo`: `BIGINT` (NOT NULL)
* `payment_channel`: `VARCHAR(50)` (NOT NULL)
* `gateway_reference`: `VARCHAR(100)` (NULLABLE)
* `failure_category`: `VARCHAR(50)` (NOT NULL) -- Check: `IN ('INSUFFICIENT_FUNDS', 'NETWORK_TIMEOUT', 'ABANDONED_WINDOW', 'GATEWAY_ERROR', 'USER_CANCELLED')`
* `error_code`: `VARCHAR(50)` (NULLABLE)
* `raw_gateway_payload`: `JSONB` (NULLABLE)
* `ip_address`: `VARCHAR(45)` (NOT NULL)
* `attempted_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* *Indexes:*
  - `idx_attempts_user` ON `payment_attempts(user_id)`
  - `idx_attempts_category` ON `payment_attempts(failure_category)`

#### Table 5: `machines`
* `id`: `UUID` (Primary Key, Default: `gen_random_uuid()`)
* `serial_number`: `VARCHAR(50)` (NOT NULL, UNIQUE) -- E.g., `'CAT-320D-2024-01'`
* `plate_or_fleet_id`: `VARCHAR(30)` (NOT NULL, UNIQUE)
* `model_name`: `VARCHAR(100)` (NOT NULL)
* `category`: `VARCHAR(30)` (NOT NULL) -- Check: `IN ('EARTHMOVING', 'GENERATOR', 'COMPACTION', 'CRANE')`
* `daily_rate_kobo`: `BIGINT` (NOT NULL)
* `deposit_rate_kobo`: `BIGINT` (NOT NULL)
* `operational_status`: `VARCHAR(30)` (NOT NULL, Default: `'AVAILABLE'`) -- Check: `IN ('AVAILABLE', 'ALLOCATED_PENDING_DISPATCH', 'ON_HIRE_ACTIVE', 'DEPOT_RECONCILE', 'MAINTENANCE_HOLD')`
* `total_hours_run`: `DECIMAL(10, 2)` (NOT NULL, Default: `0.00`)
* `last_service_hours`: `DECIMAL(10, 2)` (NOT NULL, Default: `0.00`)
* `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* *Indexes:*
  - `idx_machines_status` ON `machines(operational_status)`
  - `idx_machines_category` ON `machines(category)`

#### Table 6: `retrieval_chunks` (Enterprise Knowledge Architecture)
* `id`: `UUID` (Primary Key, Default: `gen_random_uuid()`)
* `document_title`: `VARCHAR(150)` (NOT NULL)
* `section_reference`: `VARCHAR(100)` (NOT NULL)
* `chunk_content`: `TEXT` (NOT NULL)
* `embedding_vector`: `VECTOR(1536)` (NULLABLE) -- pgvector integration for operations manual & plant specs
* `metadata`: `JSONB` (NOT NULL, Default: `'{}'`)
* `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `NOW()`)
* *Indexes:*
  - `idx_retrieval_section` ON `retrieval_chunks(section_reference)`

---

## 6. Security, Compliance, & Lifecycle Operations

### 6.1 Authentication Hardening & Cryptographic Standards
* **Password Hashing:** Passwords are never hashed with rapid, unkeyed, or memory-light algorithms (e.g., standard MD5, SHA-256, or SHA-512). The system strictly utilizes **Argon2id** configured with enterprise memory-hardness parameters:
  - *Time Cost:* $3$ iterations
  - *Memory Cost:* $64\text{ MB}$ ($65,536\text{ KiB}$)
  - *Parallelism Factor:* $4$ threads
* **Input Trimming & Normalization:**
  - `email`: Normalized via strict lowercase transformation and space trimming across all endpoints.
  - `password`: Leading and trailing whitespace programmatically stripped to avoid user-invisible clipboard copy failures; character casing preserved precisely as entered.
* **Timing-Attack Elimination:** Authentication failure messages are generic and uniform: *"Incorrect email or password."* Backend verification logic enforces constant-time response profiles to ensure non-existent email accounts take identical processing duration to valid accounts with bad passwords.

### 6.2 Session Management & Browser Security Policies
* **Token Structure:** Session tokens are generated via CSPRNG ($32\text{ bytes}$ of entropy), base64url-encoded.
* **Storage Invariant:** Plaintext tokens are NEVER stored in the database. The database records only the `SHA-256` digest of the token.
* **Cookie Security Attributes:**
  ```http
  Set-Cookie: __Host-equippro_session=<TOKEN>; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict
  ```
  - `HttpOnly`: Mitigates script injection attacks by blocking `document.cookie` access.
  - `Secure`: Cookie transmitted exclusively over TLS encrypted channels.
  - `SameSite=Strict`: Completely suppresses cookie transmission on cross-site requests, mitigating Cross-Site Request Forgery (CSRF).
  - `__Host-` Prefix: Browser-enforced prefix ensuring the cookie cannot be overwritten by subdomains or unsecured connections.
* **Session Termination Protocol:** Logout executes server-side deletion of the associated row in `sessions` followed by issuance of an expired clearing cookie. 
* **Global Revocation:** Initiating a password reset forces atomic deletion of **ALL** active session tokens for that `user_id` across all devices.

### 6.3 Rate Limiting Architecture
Rate limiting is strictly enforced at the reverse proxy/edge layer and duplicated within API gateway middleware. Counters are stored in a centralized cache (Redis) utilizing a **Sliding Window Counter** algorithm.

```
+----------------------------------------------------------------------------------------------------+
| Endpoint Target: `POST /api/auth/login`                                                            |
| Limit: 5 requests per 15-minute sliding window per IP + Email tuple.                               |
| Penalty Status: HTTP 429 Too Many Requests.                                                        |
| Response Header: `Retry-After: <SECONDS>`                                                          |
| Mitigation for Shared Campus / Site Office IPs: Rate limit keys compound IP with hashed email.     |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| Endpoint Target: `POST /api/auth/register`                                                         |
| Limit: 3 requests per hour per IP.                                                                 |
| Penalty Status: HTTP 429 Too Many Requests.                                                        |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
| Endpoint Target: `POST /api/auth/verify-code`                                                      |
| Limit: 5 attempts per issued verification token.                                                   |
| Penalty Status: HTTP 429 Too Many Requests followed by token invalidation on 5th failure.          |
+----------------------------------------------------------------------------------------------------+
```

### 6.4 The Statutory Retention vs. Right-to-Erasure Pipeline

#### The Compliance Conflict
Under the **Nigerian Data Protection Act (NDPA)** and European **GDPR**, a citizen or business has the fundamental right to request the complete erasure of their personal information. Conversely, under the **Companies and Allied Matters Act (CAMA 2020)** and statutory **Federal Inland Revenue Service (FIRS)** regulations, corporate entities are legally required to maintain unalterable financial transaction records and tax ledgers for **seven (7) years**.

```
+----------------------------------------------------------------------------------------------------+
|                  THE LEGAL CONFLICT: RIGHT TO ERASURE vs. STATUTORY TAX RETENTION                  |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|    NDPA / GDPR Right to Erasure                     CAMA 2020 / FIRS Tax Mandate                   |
|    "Delete all my personal records,                 "Preserve all transaction ledgers              |
|     credentials, and identity data."                 and financial audit trails for 7 years."       |
|                  \                                                 /                               |
|                   \                                               /                                |
|                    v                                             v                                 |
|            +-------------------------------------------------------------+                         |
|            |                      THE COMPLIANCE RESOLUTION              |                         |
|            |                                                             |                         |
|            | 1. Purge ephemeral sessions, verification hashes, and PII.  |                         |
|            | 2. Irreversibly ANONYMIZE identity fields on audit records. |                         |
|            | 3. Retain numerical financial entries in the ledger intact. |                         |
|            +-------------------------------------------------------------+                         |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

#### The Deletion Protocol (Grace Period $\to$ Idempotent Background Job)
1. **Erasure Request Trigger:** User initiates account deletion via profile security console.
2. **Immediate Lockout:** System marks user record with `deletion_scheduled_at = NOW() + INTERVAL '7 DAYS'`.
   - All active user sessions are instantly deleted from `sessions`.
   - Subsequent login attempts are blocked: *"Account scheduled for deletion. Access revoked."*
3. **The 7-Day Revocation Grace Period:** The account sits dormant for 7 days. If the contractor contacts administrative support with legal proof of identity, the deletion schedule can be cancelled.
4. **Automated Scheduled Background Worker:** A resilient cron worker runs daily at `02:00 UTC`.
   - Worker queries: `SELECT * FROM users WHERE deletion_scheduled_at <= NOW() AND anonymized_at IS NULL;`
   - Worker executes an atomic, isolated database transaction per user:
     - `sessions`: Hard-deleted.
     - `payment_attempts`: Stripped of IP addresses and raw user-agent strings.
     - `users`: Identity fields are scrubbed. `email` replaced with `deleted-user-<UUID>@anonymized.equippro.ng`; `company_name` set to `'ANONYMIZED CONTRACTOR'`; `phone_number` set to `'+2340000000000'`; `password_hash` replaced with random bytes; `anonymized_at` set to `NOW()`.
     - `payments`: Retained in full. The foreign key links to the now-anonymized user record. Financial amounts, tax withholdings, and references remain legally auditable to the exact kobo.
5. **Worker Idempotency:** The worker logs explicit start lines, process IDs, scanned record counts, and completion lines. Running the worker twice sequentially against the same dataset produces zero changes on the second pass ($0$ records updated).

---

## 7. Accessibility & Design System Constraints

### 7.1 Material Design 3 (M3) Color Architecture
The application strictly enforces semantic role mappings derived from the Industrial Forge Rust primary key color (`#9A3412` pinned to Tone 40). Under no circumstances may raw hex values or arbitrary CSS colors be defined in component templates.

```
+----------------------------------------------------------------------------------------------------+
| ROLE TOKEN               | LIGHT SCHEME (Tone/Hex)          | DARK SCHEME (Tone/Hex)               |
+--------------------------+----------------------------------+--------------------------------------+
| `primary`                | Tone 40 (`#9A3412`)              | Tone 80 (`#FFB59D`)                  |
| `on-primary`             | Tone 100 (`#FFFFFF`)             | Tone 20 (`#5B1B03`)                  |
| `primary-container`      | Tone 90 (`#FFDBCF`)              | Tone 30 (`#7A280B`)                  |
| `on-primary-container`   | Tone 10 (`#380D00`)              | Tone 90 (`#FFDBCF`)                  |
| `secondary`              | Tone 40 (`#7A584C`)              | Tone 80 (`#EDBFB0`)                  |
| `on-secondary`           | Tone 100 (`#FFFFFF`)             | Tone 20 (`#432B23`)                  |
| `surface`                | Tone 98 (`#FEF8F3`)              | Tone 6 (`#141312`)                   |
| `on-surface`             | Tone 10 (`#1D1B1A`)              | Tone 90 (`#E7E1DC`)                  |
| `surface-container`      | Tone 94 (`#F2ECE7`)              | Tone 12 (`#22201E`)                  |
| `outline`                | Tone 50 (`#7F736C`)              | Tone 60 (`#998D84`)                  |
| `error`                  | Tone 40 (`#BA1A1A`)              | Tone 80 (`#FFB4AB`)                  |
| `on-error`               | Tone 100 (`#FFFFFF`)             | Tone 20 (`#690005`)                  |
| `warning`                | Tone 40 (`#7D5700`)              | Tone 80 (`#FFBA29`)                  |
| `warning-container`      | Tone 90 (`#FFDF9E`)              | Tone 30 (`#5E4100`)                  |
| `success`                | Tone 40 (`#2E6C31`)              | Tone 80 (`#96D892`)                  |
+----------------------------------------------------------------------------------------------------+
```

### 7.2 High-Contrast Accessibility Thresholds (WCAG 2.2 Level AA/AAA)
Given the severe ambient sunlight conditions of outdoor Lagos construction sites, standard digital design contrast ratios are insufficient.
* **Body Text & Numerical Data:** Must achieve a minimum contrast ratio of **7:1** against the background (WCAG AAA Compliance).
  - Light Mode `on-surface` (`#1D1B1A`) on `surface` (`#FEF8F3`) yields a contrast ratio of **15.8:1**.
* **Primary Interactive Actions:** `on-primary` (`#FFFFFF`) on `primary` (`#9A3412`) yields a contrast ratio of **5.3:1** (Passes WCAG AA for normal text; passes AAA for large UI elements).
* **Non-Color Error Communication:** A red outline alone fails accessibility requirements for deuteranopia and protanopia. All input errors **MUST** include:
  1. A structural border color transition to `error` (`#BA1A1A`).
  2. A dedicated caution/error icon (SVG vector) adjacent to the input.
  3. Programmatic screen-reader announcement linking via `aria-invalid="true"` and `aria-describedby="field-error-id"`.

### 7.3 Typography & Fluid Scaling
Typography utilizes a clean, geometric sans-serif engineered for rapid scannability on low-end displays.
* **Display Large:** `clamp(2.25rem, 4vw + 1rem, 3.5rem)` with line-height $1.4\times$; letter-spacing compact ($-0.02\text{em}$).
* **Body Large:** `1rem` ($16\text{px}$) with line-height $1.5\times$ ($24\text{px}$); letter-spacing normal ($0\text{em}$).
* **Button & Input Labels:** Explicitly defined in `rem` units with standard vertical and horizontal padding; hardcoded pixel widths on buttons are prohibited to prevent text-clipping on localized or high-zoom interfaces.

### 7.4 Screen Reader Speech Synthesizer Walkthrough
The single-page authentication form must be fully traversable and operable using standard screen readers (TalkBack on Android, VoiceOver on iOS/macOS, NVDA on Windows):
1. **Form Landmarks:** Encapsulated in `<main role="main">` with distinct `<form aria-labelledby="form-heading">` wrappers.
2. **Live Dynamic Announcements:** When the URL query parameter switches from `?mode=login` to `?mode=register`, an off-screen container configured with `aria-live="polite"` announces: *"Registration view loaded. Create an EquipPro contractor account."*
3. **Password Hint Coupling:** Password requirements are programmatically linked to the input via `aria-describedby="password-rules"`. Screen readers announce requirements only when the field receives focus, preventing redundant announcements during form navigation.

---

## 8. Verification & Acceptance Criteria Matrix

```
+-----------------------------------------------------------------------------------------------------------------------+
| VERIFICATION REQUIREMENT                    | ACCEPTANCE CRITERIA                                                     |
+-----------------------------------------------------------------------------------------------------------------------+
| 1. Token Referencing Integrity              | Codebase contains zero raw hex string literals outside the design       |
|                                             | system token file. All styles consume CSS variable tokens.              |
|                                             |                                                                         |
| 2. Scaffolding Execution Isolation          | Dev server compiles foundation cleanly with zero unused dependencies;   |
|                                             | initial route load time logged and tracked.                             |
|                                             |                                                                         |
| 3. False-Success Immunity                   | Form submission during database outage displays an explicit error       |
|                                             | message; network logs confirm a 5xx response with zero writes.          |
|                                             |                                                                         |
| 4. Client-Validation Attack Bypass          | CLI requests (e.g., via curl) with malformed payloads bypass client    |
|                                             | rules but are rejected server-side with an HTTP 400 Bad Request.       |
|                                             |                                                                         |
| 5. Dual-Ledger Payment Purity               | Failed, canceled, or network-timed-out checkouts create rows in         |
|                                             | `payment_attempts`; the `payments` table remains completely untouched.  |
|                                             |                                                                         |
| 6. Argon2id Password Benchmark              | Local timing tests confirm single-hash latency between 100ms and 300ms, |
|                                             | demonstrating effective brute-force resistance.                         |
|                                             |                                                                         |
| 7. Administrative Boundary Enforcement      | Non-admin authenticated user navigating to `/admin/*` receives an       |
|                                             | immediate HTTP 403 Forbidden response; admin UI is not rendered.       |
|                                             |                                                                         |
| 8. Deletion Worker Idempotence              | Background account deletion worker completes successfully; running it  |
|                                             | a second time against the same dataset results in zero modifications.   |
+-----------------------------------------------------------------------------------------------------------------------+
```