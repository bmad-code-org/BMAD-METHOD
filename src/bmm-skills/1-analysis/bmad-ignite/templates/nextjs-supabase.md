---
id: nextjs-supabase
label: Next.js + Supabase
stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase (Postgres, auth, storage)
best_for: Full-stack web apps that need auth and a managed database
requires: [node, npx, git]
scaffold: npx --yes create-next-app@latest {target} --example with-supabase
verify_build: npm run build
verify_dev: npm run dev
verify_url: http://localhost:3000
---

# Next.js + Supabase

## Environment

Credentials come from a Supabase project: the user creates one free at <https://database.new>, then copies the project URL and publishable key from Settings > API into the env file. The scaffold ships `.env.example` documenting the exact variable names — copy it to `.env.local`, keep placeholders, and record each variable in the handoff. Static pages render without credentials; auth flows need them filled in.

## Bootstrap

1. Confirm `.env.local` exists (copied from `.env.example`) and is gitignored.
2. Nothing else — the example wires cookie-based Supabase auth, middleware, and shadcn/ui out of the box.

## Agent Notes

- Auth is cookie-based via `@supabase/ssr`; server components read the session through the helpers in `utils/supabase/` (or `lib/supabase/` depending on example version) — reuse them, never instantiate ad-hoc clients.
- Database schema changes go through Supabase migrations, not ORM sync. Row Level Security is the default posture: every new table needs policies before the UI touches it.
- UI primitives are shadcn/ui; add components with the shadcn CLI instead of hand-rolling.
