---
id: t3-stack
label: T3 Stack (Next.js + Postgres, self-hosted)
stack: Next.js App Router, TypeScript, tRPC, Tailwind, Drizzle ORM against your own Postgres
best_for: Typesafe full-stack web apps without a managed BaaS — you own the database
requires: [node, npm, git]
scaffold: npm create t3-app@latest {target} -- --CI --appRouter --trpc --tailwind --drizzle --dbProvider postgres
verify_build: npm run build
verify_dev: npm run dev
verify_url: http://localhost:3000
---

# T3 Stack

## Environment

The generated `.env` ships a placeholder `DATABASE_URL`. Point it at a local or hosted Postgres instance; the app builds without a live database, but data routes need one. Record `DATABASE_URL` in the handoff with wherever the user plans to host Postgres.

## Bootstrap

1. Confirm `.env` exists and is gitignored (`.env.example` stays committed).
2. Once a real `DATABASE_URL` is set, push the schema with `npm run db:push`. If the user has no database yet, record this as pending — do not block ignition on it.

## Agent Notes

- Env access goes through `src/env.js` (typed validation via `@t3-oss/env-nextjs`) — new variables are declared there first, never read from `process.env` directly. `SKIP_ENV_VALIDATION=1` exists for CI builds only.
- All API traffic goes through tRPC routers in `src/server/api/routers/`; client calls use the generated hooks. Do not add bare REST routes alongside without an architecture decision.
- Schema lives in `src/server/db/schema.ts` (Drizzle); prefer `db:push` during early development, migrations once real data exists.
