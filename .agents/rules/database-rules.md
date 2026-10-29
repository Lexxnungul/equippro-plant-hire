Trigger: Glob
Trigger Pattern: prisma/**/*, src/lib/db/**/*, src/app/api/webhooks/**/*

Never run database schema migrations without developer approval.
Propose the exact migration SQL or Prisma schema change first.
Reason: Unapproved migrations can lock production tables and cause data loss.

Use UUID primary keys for all tables.
Default all primary keys to gen_random_uuid().
Reason: Sequential integer IDs leak business metrics and expose endpoints to enumeration attacks.

Store all financial values in Kobo as integers.
Use the BIGINT data type for money columns.
Never use float or decimal types for currency.
Reason: Floating point math introduces rounding errors in accounting calculations.

Dual-Ledger Rules

Write successful financial transactions only to the payments table.
Never record abandoned or failed transactions in the payments table.
Reason: The payments table is the authoritative ledger for tax and statutory audits.

Write abandoned, timed-out, or failed payments to the payment_attempts table.
Record the gateway response and error category for each attempt.
Reason: Diagnostic logs must remain separate from balance-sheet transactions.

Machine Lifecycle Rules

Enforce machine state changes at the database level.
Allowed states are AVAILABLE, ALLOCATED_PENDING_DISPATCH, ON_HIRE_ACTIVE, DEPOT_RECONCILE, and MAINTENANCE_HOLD.
Reason: Database constraints prevent double bookings during simultaneous checkout requests.

Move machines to MAINTENANCE_HOLD when runtime reaches 250 hours.
Calculate remaining hours using 250 - (total_hours_run % 250).
Reason: Heavy plant engines seize if preventative oil and filter maintenance is skipped.