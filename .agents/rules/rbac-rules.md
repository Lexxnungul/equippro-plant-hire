Trigger: Glob
Trigger Pattern: src/middleware.ts, src/app/(admin)/**/*, src/lib/auth/**/*

Render all authentication views on the single /auth route.
Switch between login, registration, and password reset using the ?mode= query parameter.
Fallback to ?mode=login if the parameter is missing or invalid.
Reason: Query parameter switching prevents page reloads and maintains form state on slow 3G networks.

Hash all passwords with Argon2id.
Configure hashing with 3 iterations, 64 megabytes of memory cost, and 4 threads.
Never use MD5, SHA-256, or bcrypt.
Reason: Argon2id provides strong resistance against GPU and ASIC cracking attacks.

Deliver session tokens exclusively through secure HTTP cookies.
Set attributes to __Host-equippro_session=<TOKEN>; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict.
Store only the SHA-256 hash of the session token in the database.
Reason: Secure cookies prevent cross-site scripting token theft and cross-site request forgery attacks.

Authorization Rules

Restrict all /admin/* routes to users with the DEPOT_ADMIN role.
Check user roles in middleware before rendering any page component.
Reason: Administrative operations must be guarded before UI code loads in the browser.

Return HTTP 403 Forbidden when a contractor accesses an admin route.
Do not render partial admin layouts or admin scripts.
Log every unauthorized access attempt with user ID, IP address, and timestamp.
Reason: Contractors must never see internal depot interfaces or fleet controls.

Redirect unauthenticated users visiting protected routes to /auth?mode=login.
Do not return 403 to unauthenticated visitors.
Reason: Unauthenticated users must be prompted to sign in without exposing internal route permissions.