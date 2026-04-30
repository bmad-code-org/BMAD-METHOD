**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `prompts/discovery.md`) resolve from the skill root.

# Stage 1: Intent

**Goal:** Know what the initiative is about — well enough to make discovery (Stage 2) targeted, and well enough to suppress questions whose answers are already on disk.

This stage runs in **create** and **migrate** modes only. Edit-mode skips Stage 1 entirely (see `prompts/edit-mode.md`); from-spec mode skips Stage 1 entirely (see `prompts/from-spec.md`); headless mode never reaches Stage 1.

## Wrong-skill check (do this first)

If the user's opening message describes a single deliverable rather than an initiative-shaped piece of work, ask once whether this skill is the right fit before continuing:

- "I need to add a single story / fix one bug / write up a small change" → suggest `bmad-create-story`.
- "I haven't decided what we're building yet / I need help framing the product" → suggest `bmad-create-prd`.

A single soft prompt is enough — accept the user's answer and proceed.

## Create mode

You need three things to leave this stage:

1. **Initiative title** — a short kebab-friendly handle (e.g. "billing-stripe-v2"). The user may give a long sentence; ask for a tighter handle once you can summarize.
2. **Primary intent** — one or two sentences. What this initiative is for and roughly what done looks like. This is the relevance filter for Stage 2's artifact scan and Stage 3's epic shaping.
3. **Expected story-type mix** — pick one. This tells Stage 2 how to handle a missing PRD and shapes Stage 3's sizing intuition. When asking, give a one-liner per option:
   - **feature-heavy** — most stories deliver new user-visible capability (PRD-driven build).
   - **task-heavy / tech-debt** — most stories are refactors, infra, or cleanup with no user-story stanza.
   - **spike-heavy / research** — most stories are investigations whose output is a written finding, not shipped code.
   - **mixed** — meaningful blend.

**Suppress questions where the answer is already on disk.** If `governance.md` or `initiative-context.md` were loaded into facts, read them first. If they cover scope, owner, deadlines, or constraints, do not re-ask. Note absent files with a one-line pointer ("there's no `initiative-context.md` here — fine for solo work; mention it if you'd like to add one") and move on.

**Capture-don't-interrupt with acknowledgement.** If the user volunteers technical details, FRs, or epic ideas during this stage, capture them silently into your working memory. Do not redirect — they will be useful in Stages 2–4. Once per stage, surface a one-liner like "noted on the rate-limit constraint, I'll bring it back in epic design" so the user knows the tangent landed; do not list every captured detail.

When all three items are settled, route to `prompts/discovery.md` with `{mode}=create` and the initiative title and intent in your working memory.

## Migrate mode

A v6 monolithic file exists at `{initiative_store}/epics.md` or `{planning_artifacts}/epics.md`. Surface it in one short sentence — the path and roughly what's in it (epic count from a quick scan) — then offer the three options:

1. **Leave it alone and start fresh.** Treat the v6 file as inert; walk a normal create flow. Useful when the v6 plan is stale or you want to redesign.
2. **Run the canonical-v6 migration helper** at `prompts/migrate-v6.md`. Best when the v6 file is recent and you want to bootstrap the v7 tree from it without redoing the design work.
3. **Walk through manually using the v6 file as input** to a normal create flow. Useful when the v6 file is messy or partially edited — you read it as context, but the create flow is the system of record.

After the user picks:

- **Option 1 or 3** → set `{mode}=create` and route to `prompts/discovery.md`. Add the v6 file path to user-provided paths so the artifact analyzer reads it.
- **Option 2** → route to `prompts/migrate-v6.md`.

## Soft gate

This stage is conversational. Confirm with a soft prompt rather than a menu — "Anything else to add about the initiative, or should we move on to scanning the project?" Users almost always remember one more thing when given a graceful exit ramp.

## Stage Complete

Stage 1 ends when the chosen mode's exit conditions above are met. Carry the initiative title, primary intent, story-type mix, and any volunteered details into the next stage in working memory — none of this is written to disk yet (Stage 2 writes the inventory to `.bmad-cache/inventory.json`).
