# Kernel Contract

The kernel is one file — `kernel.md` at the bundle root — injected into every agent session in this project. It is the highest-cost real estate the skill manages: every line is paid in every future session. This contract governs every kernel write, in any intent or mode.

## Hard rules

- **Instruction budget: ~150–200 instructions, a ceiling not a target.** Instruction-following measurably decays past this range (IFScale). Count instructions, not lines — one line carrying three rules is three instructions. When the budget is threatened, the weakest line moves to a bundle entry or dies; the budget is never raised. `context.py validate` measures it.
- **Priority ordering.** Most load-bearing rules first — the rules whose violation costs the most. The file must degrade gracefully if truncated or skimmed: a reader who stops halfway got the half that matters most.
- **The pruning test.** *Would removing this line change agent behavior?* If no, the line is deleted. Applied to every line at every write and every audit.

## What enters, what never does

A kernel line earns its place only by being **non-derivable** (the agent cannot learn it from the code in reasonable time) and **behavior-changing** (an agent without it does something wrong). The reliable categories: exact commands where the obvious guess fails, conventions that differ from ecosystem defaults, landmines (frozen areas, replaying webhooks, lying health endpoints), and hard org requirements.

Never enters, regardless of who asks:

```text
✗ "This project uses TypeScript and React"     ← skimmable from package.json
✗ "Write clean, well-tested code"              ← LLM default; changes nothing
✗ "The API layer calls the service layer"      ← visible in code; overview prose
```

## Shape

Terse sections, imperative lines. The three writing rules bind every line: **succinct to the point of discomfort** (if a line can be shorter, it isn't done); **present truth only** (never the story of the edit — supersession is a dated frontmatter field, not a sentence); **no reference without a link** (every named decision, doc, file, or system carries a path, `[[project:entry]]` link, or URL a fresh context can follow). No prose paragraphs, no introduction, no summary. The target shape:

```markdown
# Project Kernel — acme-billing
## Commands
- Test: `pnpm test` (vitest — do NOT use jest syntax)
- Single file: `pnpm test -- path/to/file`
## Conventions that differ from defaults
- Money is always integer cents (`amountCents`), never floats — src/lib/money.ts
- All DB access through repositories in src/repos/ — never call the client directly
- Errors: throw typed AppError subclasses; HTTP mapping only in middleware
## Landmines
- Stripe webhooks replay in staging every 6h — handlers must be idempotent
- `legacy/` is frozen: never modify; it is being strangled out
```

Section names adapt to the project; the example's three cover most repos. A line whose depth exceeds one sentence points at its bundle entry: `- Money is integer cents — why: [integer-cents](integer-cents.md)`.

## Trust

An interactive kernel holds only confirmed truths — each line was user-confirmed or path-verified during ingest. An auto-mode kernel carries `status: generated` in its frontmatter (the only frontmatter a kernel ever has) until a human session confirms it; confirmation removes the field. There is no per-line trust marking — the kernel is too small to need it, and markers cost budget.

## Kernel-only is success

A small project needs a kernel and nothing else. When ingest finds fewer than a handful of truths worth depth, say so and stop — manufacturing bundle entries to justify the machinery is exactly the volume failure this skill replaces.
