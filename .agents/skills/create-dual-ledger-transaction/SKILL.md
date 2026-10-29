---
name: create-dual-ledger-transaction
description: Implements an atomic dual-ledger financial transaction that writes dropped checkouts to payment_attempts and verified settlements to payments using integer kobo values.
---

# create-dual-ledger-transaction

## Purpose
Execute a financial billing transaction with strict dual-ledger persistence, integer kobo arithmetic, and automated failure routing.

## Required References
* `docs/database-rules.md` for dual-ledger separation, BigInt kobo rules, and immutable records.
* `docs/validation-rules.md` for boundary validation of monetary inputs.

## Procedure

1. Collect the transaction context:
   * `userId`: UUID string.
   * `bookingId`: UUID string.
   * `amountInKobo`: Integer or BigInt.
   * `ledgerType`: One of `HIRE_FEE`, `SECURITY_DEPOSIT`, `MOBILIZATION_SURCHARGE`, `DEPOSIT_REFUND`, `DAMAGE_DEDUCTION`.
   * `paymentChannel`: Payment rail string.

2. Verify that `amountInKobo` is an integer without decimal points. Reject the call if floating-point numbers are detected.

3. Generate a pre-transaction tracking record in `payment_attempts`:
   * Write `userId`, `bookingId`, `amountInKobo`, and `paymentChannel`.
   * Set `failureCategory` to `PENDING_GATEWAY`.
   * Capture the generated record ID as `attemptId`.

4. Initiate the payment rail request or webhook verification check.

5. Evaluate the payment response:
   * If the payment fails, times out, or gets canceled by the user, proceed to Step 6.
   * If the payment returns a confirmed cryptographic signature, proceed to Step 7.

6. Handle failed or abandoned payment:
   * Open a database query targeting `payment_attempts` where `id` equals `attemptId`.
   * Update `failureCategory` to the specific reason (`INSUFFICIENT_FUNDS`, `NETWORK_TIMEOUT`, `ABANDONED_WINDOW`, `GATEWAY_ERROR`, `USER_CANCELLED`).
   * Store the raw provider error payload in `rawGatewayPayload`.
   * Do not write to `payments`.
   * Terminate the procedure and return the error status.

7. Handle confirmed payment within a Prisma transaction block:
   * Start a `prisma.$transaction` call.
   * Read the target booking to confirm valid state.
   * Insert a new row into `payments` with `bookingId`, `userId`, `amountInKobo`, `ledgerType`, `transactionReference`, and settled timestamp.
   * Update the `payment_attempts` row where `id` equals `attemptId`, marking `gatewayReference` with the settlement reference.
   * Commit the transaction block.

8. Verify the dual-ledger status by querying the database:
   * Check that `payments` contains exactly one new row for successful transactions.
   * Check that `payments` contains zero new rows for failed transactions.
   * Check that `payment_attempts` contains the audit log for both outcomes.