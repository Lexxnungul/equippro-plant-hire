---
name: implement-machine-state-transition
description: Executes an atomic machine lifecycle state change with runtime hours tracking, 250-hour preventative maintenance calculation, and role authorization checks.
---

# implement-machine-state-transition

## Purpose
Transition a machine across its five valid operational states while enforcing preventative maintenance lockouts and pessimistic database locking.

## Required References
* `docs/database-rules.md` for the five valid machine states and optimistic/pessimistic locking rules[cite: 1].
* `docs/rbac-rules.md` for `DEPOT_ADMIN` role authorization rules[cite: 1].

## Procedure

1. Collect the state transition inputs:
   * `machineId`: UUID string[cite: 1].
   * `currentState`: Expected current state string (`AVAILABLE`, `ALLOCATED_PENDING_DISPATCH`, `ON_HIRE_ACTIVE`, `DEPOT_RECONCILE`, `MAINTENANCE_HOLD`)[cite: 1].
   * `targetState`: Target state string[cite: 1].
   * `reportedHours`: Operating runtime hours number or null[cite: 1].
   * `userRole`: Role string of the caller (`CONTRACTOR` or `DEPOT_ADMIN`)[cite: 1].
   * `maintenanceData`: Object containing `technicianName`, `partsReplaced`, `hoursAtService` (required only for maintenance resets)[cite: 1].

2. Validate the target state against the allowed state machine transitions:
   * From `AVAILABLE`: allow `ALLOCATED_PENDING_DISPATCH` only[cite: 1].
   * From `ALLOCATED_PENDING_DISPATCH`: allow `ON_HIRE_ACTIVE` (on dispatch) or `AVAILABLE` (if canceled)[cite: 1].
   * From `ON_HIRE_ACTIVE`: allow `DEPOT_RECONCILE` (on return) or `MAINTENANCE_HOLD` (on engine service trip)[cite: 1].
   * From `DEPOT_RECONCILE`: allow `AVAILABLE` (deposit processed) or `MAINTENANCE_HOLD` (service needed)[cite: 1].
   * From `MAINTENANCE_HOLD`: allow `AVAILABLE` only[cite: 1].
   * Reject any transition outside this path with an invalid state error[cite: 1].

3. Verify role permissions for restricted transitions:
   * If `targetState` is `ON_HIRE_ACTIVE` (Gate Pass release), assert `userRole === 'DEPOT_ADMIN'`[cite: 1].
   * If `currentState` is `MAINTENANCE_HOLD` and `targetState` is `AVAILABLE`, assert `userRole === 'DEPOT_ADMIN'`[cite: 1].
   * Reject unauthorized requests immediately with a 403 Forbidden response[cite: 1].

4. Open a Prisma database transaction with a concurrency lock on `machineId` and `currentState`:
   * Fetch the machine record using `id: machineId` and `operational_status: currentState`[cite: 1].
   * If no record matches, abort the transaction immediately to prevent stale state writes or race conditions[cite: 1].

5. Update runtime hours if `reportedHours` is provided:
   * Assert `reportedHours >= machine.total_hours_run` to prevent negative meter rollbacks[cite: 1].
   * Set `machine.total_hours_run = reportedHours`[cite: 1].

6. Evaluate the 250-hour preventative maintenance formula:
   * Calculate `hoursSinceService = machine.total_hours_run - machine.last_service_hours`[cite: 1].
   * If `hoursSinceService >= 250` and `currentState !== 'MAINTENANCE_HOLD'`:
     * Override `targetState = 'MAINTENANCE_HOLD'`[cite: 1].
     * Log an operational warning flag indicating dispatch lockout is active[cite: 1].

7. Process maintenance clearance if releasing from `MAINTENANCE_HOLD`:
   * Verify `maintenanceData` contains non-empty values for `technicianName` and `partsReplaced`[cite: 1].
   * Insert a new record into `maintenance_logs` containing `machineId`, `technicianName`, `partsReplaced`, and `hoursAtService: machine.total_hours_run`[cite: 1].
   * Update `machine.last_service_hours = machine.total_hours_run`[cite: 1].

8. Commit the machine status change:
   * Set `operational_status = targetState`[cite: 1].
   * Commit the transaction block[cite: 1].

9. Confirm the database write:
   * Query the machine table by `id`[cite: 1].
   * Verify `operational_status` matches the intended `targetState` and that timestamps reflect the update[cite: 1].