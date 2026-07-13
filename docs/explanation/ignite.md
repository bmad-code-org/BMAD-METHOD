---
title: "Ignite"
description: Go from idea to a running, verified repo before planning starts — scaffold from a curated starter template and hand off into the standard track
sidebar:
  order: 14
---

Go from "I want to build X" to a running, version-controlled, verified repo — then land in the standard planning track with the stack already decided.

`bmad-ignite` is the project-ignition workflow. It captures intent in a handful of questions, recommends one starter template from a curated registry, scaffolds it, verifies it builds and boots, and hands off a seeded brief plus an architecture seed so `bmad-prd` and `bmad-architecture` do not relitigate choices the scaffold already implements.

## Why This Exists

BMad's standard track is a planning pipeline: analysis → PRD → UX → architecture → epics and stories → implementation. It assumes either an existing codebase (brownfield) or that you will hand-bootstrap a repo somewhere between architecture and the first story.

That gap is exactly where non-expert builders stall. Tools like Lovable, Replit Agent, and v0 won that audience by making the bootstrap step boring: pick a proven starter, wire the environment, show a running preview. Ignite brings that step into BMad — paired with what those tools lack, a structured planning track to hand off into.

## What It Is Not

`bmad-ignite` is the opposite of `bmad-quick-dev`. Quick Dev skips planning because the repo already exists; Ignite exists because the repo does not. It builds no product features, writes no PRD, and designs no UX — it gets a known-good skeleton running and routes you to planning.

It is greenfield-only. If it detects an existing application in the workspace, it stops and routes you to `bmad-quick-dev`, `bmad-prd`, or `bmad-document-project` instead.

## How It Runs

| Step | What Happens |
| --- | --- |
| 1. Capture intent | At most five questions — idea, audience, capability needs (auth, payments, realtime, AI), output target. Skips anything you already said. |
| 2. Select stack | Recommends one template from the registry with a reason; presents the rest as a menu. One approval gate: stack, what you get, what is out of scope, what credentials you will owe later. |
| 3. Scaffold | Preflight tool checks, scaffold into a staging directory, collision-safe move into place, fresh git history with an initial commit, env placeholders documented — never invented. |
| 4. Verify and hand off | Build and boot checks with a bounded fix loop, an honest pass/fail record, then the handoff artifacts and a pointer to `bmad-prd`. |

## Template Manifests

Ignite picks from a curated menu, not a stack designed from scratch. Constraint is the feature: every built-in uses an official scaffolding CLI or first-party template, so the starting point is maintained upstream rather than frozen in this repo.

Each template is one markdown manifest. The frontmatter carries the machine fields — `id`, `label`, `stack`, `best_for`, `requires`, `scaffold`, `verify_build`, `verify_dev`, `verify_url` — used for the menu, preflight, and verification. The body is a playbook the agent reads and executes: `## Environment` (where credentials come from and how env files are wired), `## Bootstrap` (one-time steps after scaffolding), and `## Agent Notes` (the starter's conventions — where auth lives, how schema changes happen, what not to hand-roll). Agent Notes flow into `architecture-seed.md`, so every downstream agent inherits them.

| Template | Stack | Best For |
| --- | --- | --- |
| `nextjs-supabase` | Next.js, Tailwind, shadcn/ui, Supabase | Web apps needing auth and a managed database |
| `t3-stack` | Next.js, tRPC, Drizzle, your own Postgres | Typesafe full-stack without a managed BaaS |
| `expo-mobile` | Expo, expo-router | iOS/Android mobile apps |
| `fastapi-fullstack` | FastAPI, SQLModel, Postgres, React, Docker | Python backends with a React SPA |
| `astro-content` | Astro, content collections | Marketing sites, blogs, docs |

Two escape hatches always appear in the menu: **custom template** (any public git repository URL) and **manual** (skip scaffolding, go straight to planning).

## Build Your Own Templates

Ignite discovers manifests by scanning the directories in `template_paths` (a `customize.toml` list): the skill's built-in `templates/` directory first, then `_bmad/custom/ignite-templates/`. Later sources win on duplicate `id` — so a manifest in your custom directory with a built-in's id replaces it, and a new id appends to the menu.

```markdown
---
id: acme-internal-tool
label: Acme internal tool starter
stack: Next.js, Acme design system, internal auth
best_for: Internal tools on the Acme platform
requires: [node, npx, git]
scaffold: npx --yes create-acme-app@latest {target}
verify_build: npm run build
verify_dev: npm run dev
verify_url: http://localhost:3000
---

# Acme Internal Tool

## Environment

Request credentials via go/acme-onboarding; wire them into .env.local per the starter README.

## Bootstrap

1. Run npm run setup to register the app with the internal gateway.

## Agent Notes

- All UI comes from @acme/design-system — never hand-roll components.
- API calls go through the gateway client in src/lib/gateway.ts.
```

Save that as `_bmad/custom/ignite-templates/acme-internal-tool.md` and it appears in the menu. Commit the directory and the whole team gets the org's blessed starters.

## Community Templates

Three ways to share a template, cheapest first:

- **A manifest file** — anyone can publish a manifest (a gist, a snippet in a README); users drop it into `_bmad/custom/ignite-templates/`.
- **A template repository** — ship a starter repo with `bmad-template.md` at its root. When a user picks the custom-URL option and points ignite at the repo, the clone is the scaffold and the manifest inside it drives env wiring, bootstrap, verification, and Agent Notes — the repo behaves exactly like a built-in.
- **An org pack** — teams append their own directory to `template_paths` in `_bmad/custom/bmad-ignite.toml` and manage manifests wherever they live.

:::tip[No new infrastructure]
All of this rides BMad's existing customization merge — there is no separate registry service to run or schema to learn beyond one markdown file.
:::

## The Handoff

Ignite ends by writing two artifacts into planning artifacts:

- **`brief.md`** — a seed brief from intent capture, with unknowns listed as open questions. `bmad-prd` picks it up as input; run `bmad-product-brief` first if the concept needs deeper shaping.
- **`architecture-seed.md`** — the decided stack, environment variables (names and purpose, never values), pending bootstrap steps, and the verification record. Its **Decided** table is settled: the repo already implements those choices, so architecture work starts from there.

It also points to `bmad-generate-project-context` as an optional follow-up, so implementation agents inherit the template's conventions from day one.

## Honest Verification

Every template declares its own verification: a build command, a dev-server command, and a URL to probe while the server runs. Failures get at most three fix attempts — environment-level fixes only — and then the workflow reports the failure plainly and asks how to proceed. A scaffold that does not build is never presented as done.
