---
name: scaffold-protected-admin-action
description: Scaffolds a role-protected administrative server action or Route Handler under /admin/* with session extraction, copied-link 403 defense, and audit logging.
---

# scaffold-protected-admin-action

## Purpose
Build a server action or API route handler inside the `/admin/` path tree that enforces session authentication, restricts access to `DEPOT_ADMIN`, logs unauthorized access attempts, and returns HTTP 403.

## Required References
* `docs/rbac-rules.md` for session extraction, `__Host-` cookie attributes, and 403 refusal responses.
* `docs/validation-rules.md` for server payload validation.

## Procedure

1. Collect the target route details:
   * Target endpoint path (e.g., `src/app/api/admin/release-gate-pass/route.ts` or server action path).
   * HTTP method (`POST`, `GET`, `PATCH`, `DELETE`).
   * Zod request body schema name.
   * Business action logic description.

2. Create or open the route handler file at the specified admin path.

3. Import the shared session manager, database client, and Zod validator:
   ```typescript
   import { getSessionFromCookie } from "@/lib/auth/session";
   import { prisma } from "@/lib/db";
   import { z } from "zod";