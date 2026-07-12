# Step 1: Capture Intent

## RULES

- The prompt that invoked this workflow IS the intent — mine it before asking anything.
- Ask ONLY questions whose answer changes which template fits or how it is scaffolded. Never re-ask what the user already said.
- Hard cap: five questions, asked as one numbered list, one round. If answers leave gaps, default loudly ("Assuming web app — say otherwise") instead of asking again.
- This step decides nothing about the stack. It produces a clear intent picture for step 2.

## GREENFIELD GATE (do this first)

This workflow bootstraps projects that do not have a codebase yet. Check `{project-root}` for signs of an existing application: source directories (`src/`, `app/`, `lib/`), manifest files (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`), or lockfiles. Ignore BMad's own files (`_bmad/`, `_bmad-output/`, planning artifacts) and repo scaffolding (`.git`, `README.md`, LICENSE, editor config).

If an existing application is found: tell the user this workflow is for starting from zero, and suggest they invoke `bmad-quick-dev` for direct changes, `bmad-prd` to plan a feature, or `bmad-document-project` / `bmad-generate-project-context` to onboard BMad onto the existing code. HALT. Continue only if they explicitly confirm they want to scaffold a new project anyway (e.g. into a subdirectory).

## INSTRUCTIONS

1. Extract from the invoking prompt and conversation what is already known of:
   - **The idea** — one or two sentences on what they want to build.
   - **Audience / domain** — who it is for and any domain constraints.
   - **Capability needs** — auth, payments, realtime, AI features, none, unsure.
   - **Output target** — web app, mobile app, API/backend, content site, internal tool.
   - **Environment preferences** — language or framework the user already knows or requires, managed backend vs self-hosted.
2. Ask for the missing items only, as a single numbered list (max five questions). When the user replies, verify every question was answered; if any were ignored, re-ask only those once, then default loudly.
3. Restate the intent back in 2–4 sentences: what is being built, for whom, the capability needs, and the output target. Note any assumption you defaulted.
4. Derive a kebab-case `{slug}` from the idea (e.g. `invoice-tracker`).

## NEXT

Read fully and follow `./step-02-select-stack.md`
