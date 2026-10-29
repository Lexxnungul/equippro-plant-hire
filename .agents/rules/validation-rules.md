Trigger:Glob 
Trigger Pattern: src/lib/validation/**/*, src/app/api/**/*.ts, src/app/(auth)/**/*.tsx
Form and Input Rules

Validate every input on the client and on the server using identical Zod schemas.
Never trust client validation alone.
Reason: Attackers can bypass client checks by sending requests directly through curl or API clients.

Normalize email addresses by trimming whitespace and converting to lowercase.
Apply this normalization before schema parsing.
Reason: Case mismatches cause duplicate accounts and failed login lookups.

Validate Nigerian phone numbers to the E.164 standard.
Transform phone numbers matching /^(\+?234|0)[789][01]\d{8}$/ into the +234 format.
Reason: Logistics SMS gateways require numbers in the E.164 international format.

Require Corporate Affairs Commission registration numbers on signup.
Validate formats matching /^(RC|BN|IT|LLP)-?\d{6,8}$/i.
Reason: EquipPro leases heavy machinery only to verified legal business entities.

Enforce a minimum password length of 12 characters.
Do not force arbitrary special character requirements.
Check passwords against known breached password lists.
Reason: Password length provides better entropy than complex character rules.

Require explicit acceptance of terms before enabling account creation.
Keep the submit button disabled until the terms checkbox is checked.
Show clear helper text when an invalid submit button is clicked.
Reason: Contractors must legally accept equipment liability and deposit forfeiture rules.