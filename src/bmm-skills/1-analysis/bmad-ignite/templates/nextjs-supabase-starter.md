---
id: nextjs-supabase-starter
label: Next.js + Supabase (batteries included)
stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase (Postgres, auth, RLS), zod, vitest
best_for: Full-stack web apps that want auth, database patterns, and a CRUD reference feature pre-built — richer starting point than the plain nextjs-supabase example
requires: [node, npm, git]
scaffold: git clone --depth 1 https://github.com/Yash-1511/bmad-template-nextjs-supabase.git {target}
verify_build: npm run build
verify_dev: npm run dev
verify_url: http://localhost:3000
---

# Next.js + Supabase (batteries included)

A community template repository: auth, RLS-first migration patterns, a complete
notes CRUD vertical slice, typed env, tests, and CI are pre-built. The
authoritative playbook ships inside the repo as `bmad-template.md` — step 3
adopts it after cloning, so this entry stays a thin pointer.
