# Guide Contract

The guide is the project's agent instructions, written as two files at the repo root:

- **`AGENTS.md`** — loaded by every session, whatever its kind: Orientation, Policy, Where things are, and one closing pointer line: "Editing code? Read `AGENTS-dev.md` first."
- **`AGENTS-dev.md`** — read via that pointer by sessions that will touch code: Commands, Verification, Conventions, Known pitfalls. Planning and review sessions never pay for it.

When the whole guide fits in about 20 instructions, write a single `AGENTS.md` instead — the extra hop isn't worth it. Every line in either file has a recurring cost; this contract governs every write.

## Hard rules

- **Instruction budget: ~150–200 instructions across everything a coding session loads — a ceiling, not a target.** Instruction-following degrades past this range. Count instructions, not lines (one line carrying three rules is three instructions), and count what `CLAUDE.md` or other always-loaded files add. When the budget is exceeded, the weakest lines move behind links or are deleted; the budget is never raised.
- **Priority order.** Rules whose violation costs the most come first, so a reader who stops halfway got the half that matters most.
- **The pruning test.** *Would removing this line change agent behavior?* If no, delete it. Applied to every line at every write.

## Sections and what admits a line

Each section has its own admission rule. There is no global "non-derivable" test: some sections admit derivable content on purpose, and no section admits content merely for being true.

1. **Orientation** (`AGENTS.md`) — three or four sentences: what this project is, the stack, where planning, tickets, PRs, and deeper docs live. No admission test beyond brevity.
2. **Policy and safety** (`AGENTS.md`) — admitted by **authority**: what the org and the maintainers require and the code cannot express — branch rules, protected and frozen paths, generated files, secrets, what must never be done.
3. **Where things are** (`AGENTS.md`) — admitted by **localization value**: entry points where work actually lands, and "working on X? read Y first" pointers. Planning sessions need these as much as coding sessions. Earned per pointer, never exhaustive. Details go behind links, never inline.
4. **Commands** (`AGENTS-dev.md`) — admitted by **universal need, verified by execution**: build, test (including a single test), lint, run — exact invocations with flags, plus warnings where an operation is expensive or the obvious guess fails. Derivability is no objection: rediscovery is paid at the start of every session, and a derived command is a guess — both trials found repos where the obvious guess is wrong.
5. **Verification** (`AGENTS-dev.md`) — same rule: what must pass before commit and push, as the exact commands CI runs.
6. **Conventions that differ from defaults** (`AGENTS-dev.md`) — admitted when **the agent's default assumption is wrong**: an agent writing new code follows ecosystem norms unless told otherwise. Each line links its enforcement point or source file. Not admitted for being unusual, intricate, or interesting — a fact nobody would get wrong by default is not a convention line.
7. **Known pitfalls** (`AGENTS-dev.md`) — admitted by **observed failure only**: a lesson already recorded in the repo's instruction files or notes, the maintainer's recollection, session-log evidence, the same mistake fixed repeatedly in git history, or a mistake the writing session itself made and caught while working. A scan cannot nominate a pitfall from how the code *looks*: the repo yields hundreds of trap-looking facts and no property of the fact separates the few that cause real mistakes — that signal exists only in observed behavior. A surprising fact from scanning becomes, at most, an interview question ("do agents actually trip on this?"). Apparent derivability is irrelevant here in both directions: most working pitfall rules restate something readable, because agents misread it anyway.

**Retiring pitfall and policy lines:** a line retires only when the thing it guards is gone (removed, or now mechanically enforced) or the human retires it. Absence of recent failures is never grounds — a working rule erases its own evidence, and half the value of the guide is failures that no longer happen.

## What never enters

| Excluded | Why |
|---|---|
| Repo overviews, directory trees, tech-stack lists | No measured benefit; agents derive structure fresh, and stored copies drift |
| Facts included for being interesting or unusual | Interest is not evidence of need — this is the failure mode this skill replaces |
| Style rules an agent is meant to self-enforce | That job belongs to a formatter, linter, hook, or CI check — propose one instead |
| Platitudes ("write clean code") | Already the agent's default |
| Fast-changing facts, pasted code, changelog content | Go stale quickly; the guide is not a memory system |
| Aspirational state | Belongs in specs; the guide describes what is |

## Shape and style

Terse imperative lines under plain headings — no prose paragraphs beyond Orientation, no introduction, no summary. Every line states what to do or what not to do; a bare fact may appear only as the justification clause of such a line ("Exclude `vendor/` from searches — it is 60% of the tracked files", never "`vendor/` is 60% of the tracked files"). Use the contract's section headings so the guide's shape is recognizable across runs; material that seems to need a new section folds into the nearest one. State present truth only; git holds history. Every named decision, doc, file, or system includes a repo-relative path or URL that exists. Target shape (single-file form):

```markdown
# acme-billing
Payment-processing service for Acme storefronts. TypeScript/Node, pnpm.
Planning lives in docs/planning/, tickets in Linear (ACME board), PRs on GitHub.

## Commands
- Test: `pnpm test` (vitest — do NOT use jest syntax); single file: `pnpm test -- path/to/file`
- The full suite is slow; run single files while iterating.

## Before pushing
- `pnpm lint && pnpm test` must pass — same commands CI runs.

## Policy
- Never push to main; PRs only, one approval required.
- `legacy/` is frozen: never modify; it is being replaced.
- `src/generated/` is generated by `pnpm codegen` — never edit by hand.

## Conventions that differ from defaults
- Money is integer cents (`amountCents`), never floats — src/lib/money.ts
- All DB access through repositories in src/repos/ — never call the client directly.

## Where things are
- Webhook handling: src/routes/webhooks.ts; conventions in docs/webhooks.md
- Working on billing rules? Read docs/billing-model.md first.

## Known pitfalls
- Stripe webhooks replay in staging every 6h — handlers must be idempotent.
- Agents keep adding jest matchers; this repo is vitest-only.
```

## Editing an existing guide

A handwritten guide is the baseline, not raw material. Keep its phrasing where it works, propose changes as a diff, and never delete human-written content without agreement. Its recorded lessons — wherever they live: the old `AGENTS.md`, `CLAUDE.md`, notes files, warnings in READMEs — are standing maintainer testimony: keep them by default, and challenge one only with evidence that its referent is gone or wrong, never because scans show no recent failures. Restructuring a single old file into the two-file form is fine; losing its content is not.

## Scoped guides

A subsystem gets its own nested `AGENTS.md` when work keeps landing there and its truths don't belong at root — most harnesses auto-load the nearest file. 25–35 lines answering, in order: what is this, who owns it, how do I run it, what's surprising, where do I go next. Every path verified. Created when a subsystem needs one, never for every subsystem.

## Small guides are success

When the evidence supports ten lines, ten lines is the deliverable.
