# Reference example — feature epic

This file shows a complete, canonical feature epic with three stories. Use it as a shape primer in Stage 4 — match the section order, body density, and depends_on usage. Do not copy the content.

## File: `01-user-authentication/epic.md`

```markdown
---
title: "User Authentication"
epic: "01"
status: draft
depends_on: []
metadata:
  initiative: account-foundations-q2
---

# User Authentication

## Goal

End-users can register, sign in, and recover access to their account using
email + password. Establishes the session model that every other epic relies on.

## Shared Context

- Sessions are JWT-based, signed with the rotating key in `auth/keys/`. Token
  TTL: 30 minutes; refresh token TTL: 30 days.
- Password storage uses argon2id with the parameters from
  `{planning_artifacts}/architecture.md#password-hashing`.
- All endpoints under this epic live in `apps/api/src/routes/auth/`.
- Tests use the `authFixtures` helper at `apps/api/test/fixtures/auth.ts`.

## Story Sequence

01-define-user-and-session-models seeds the schema; 02-register-with-email and
03-sign-in-with-email both depend on it but are independent of each other.
04-password-reset-via-email depends on 02 (needs an existing account) and on
the mailer wired in `02-auth-migration` (cross-epic).

## References

- `{planning_artifacts}/prd.md#fr-1-1-through-fr-1-7`
- `{planning_artifacts}/architecture.md#auth`
- `{planning_artifacts}/ux/auth-flows.md`
```

## File: `01-user-authentication/01-define-user-and-session-models.md`

```markdown
---
title: "Define User and Session Models"
type: task
status: draft
epic: 01-user-authentication
depends_on: []
---

# Define User and Session Models

## Acceptance Criteria

- **AC1** — Given a fresh database, When the migration runs,
  Then the `users` and `sessions` tables exist with the columns specified in
  `architecture.md#auth`.
- **AC2** — Given the migration has run, When the seed script executes,
  Then a single admin user exists with the credentials from `.env.test`.

## Technical Notes

- Migration file: `apps/api/migrations/2026_05_01_auth.sql`.
- Use the existing `argon2id` helper at `apps/api/src/auth/hash.ts`.

## Coverage

- AC1 → FR1.1, FR1.2
- AC2 → FR1.3
```

## File: `01-user-authentication/02-register-with-email.md`

```markdown
---
title: "Register with Email"
type: feature
status: draft
epic: 01-user-authentication
depends_on: ["01-define-user-and-session-models"]
---

# Register with Email

As a new visitor,
I want to create an account with my email and a password,
So that I can sign in and use the product.

## Acceptance Criteria

- **AC1** — Given a valid email and a password meeting the policy,
  When I POST `/auth/register`,
  Then the response is 201 with my user id and a session token.
- **AC2** — Given an email that is already registered,
  When I POST `/auth/register`,
  Then the response is 409 with the `email_taken` error code.
- **AC3** — Given a password failing the policy,
  When I POST `/auth/register`,
  Then the response is 422 with the failing rules listed.

## Technical Notes

- Reuse `validatePasswordPolicy()` from `apps/api/src/auth/policy.ts`.
- Emit a `user.registered` event for downstream onboarding hooks.

## Coverage

- AC1 → FR1.4
- AC2 → FR1.5
- AC3 → FR1.6, NFR3.2 (password policy)
```

## File: `01-user-authentication/04-password-reset-via-email.md`

```markdown
---
title: "Password Reset via Email"
type: feature
status: draft
epic: 01-user-authentication
depends_on: ["02-register-with-email", "02-auth-migration/03-mailer-wired"]
---

# Password Reset via Email

As a registered user,
I want to reset my password via an emailed link,
So that I can recover access if I forget my credentials.

## Acceptance Criteria

- **AC1** — Given a registered email, When I POST `/auth/password-reset`,
  Then a reset email is dispatched and the response is 202.
- **AC2** — Given a valid reset token, When I POST `/auth/password-reset/confirm`
  with a new password, Then my password is updated and the token is consumed.
- **AC3** — Given a reset token older than 1 hour,
  When I POST `/auth/password-reset/confirm`,
  Then the response is 410 with the `token_expired` error.

## Technical Notes

- Reset tokens: 32-byte random, 1-hour TTL, single-use. Store hashed.
- The mailer dependency comes from epic 02; depends_on encodes that.

## Coverage

- AC1 → FR1.7
- AC2 → FR1.8
- AC3 → NFR4.1 (token lifecycle)
```
