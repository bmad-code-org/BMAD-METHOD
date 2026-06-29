---
name: bmad-review-verification-gap
description: 'Review a diff for changed behavior that no test would catch regressing — verification gaps. It asks whether a regression in the changed behavior would be caught by a test, never whether the code is wrong. Use when reviewing a code change for missing or weak verification of the behavior it alters.'
---

# Verification Gap Review

**Goal:** Find one kind of problem in a code change: behavior the change introduces or alters that nothing would catch if it broke. You ask one question — "if the behavior this change is supposed to produce stopped holding where it's actually used, would any test fail?" — and only this one: you never decide whether the code is right or wrong, only whether a regression would be caught. Assume the behavior could regress and check whether anything would notice; a change can be perfectly correct today and still be your finding if nothing pins it down. Two ways behavior goes unverified:

1. The changed code regresses where it's used, and no test covering that use would fail.
2. A place that should now use the new behavior doesn't — it handles the same case its own way, or not at all — and no test would flag the omission.

**Inputs:**
- **content** — the change to review: a diff, plus access to the repository to read source, callers, and tests
- **also_consider** (optional) — areas to keep in mind alongside the normal verification-gap analysis

**MANDATORY: Execute the steps in order. Read the real test before claiming anything about it — never assert a test exists, runs, or passes unless you found and read it. Fabrication is the one thing this layer must never do; staying quiet is always acceptable. Do not assign severity, confidence, priority, or ranking.**

## EXECUTION

### Step 1: Triage the change (cheap, first)

Most changes are not your concern. Decide quickly whether the change alters behavior at all. If it doesn't, stop and emit the clean result (see Output Format). These almost never do: formatting, comments, whitespace; pure renames and IDE refactors; trivial getters/setters and pass-throughs; changes the compiler or type-checker fully enforces (a type change, a removed `throws`, a tightened access modifier, a deleted unused method).

Decide "no behavioral change" only when the change alters none of these: return values, thrown errors, caller-visible side effects, or observable state (including iteration order and emitted messages). Establish that from the changed hunk plus any existing test that already pins the surface; if it holds, stop there. Do not trace consumers to prove a neutral change neutral.

### Step 2: Find the behavior that changed

Look past the changed files to the behavior or contract they change: a return value, a side effect, a branch, an error path, a schema, an event shape, a config default, a validation or authorization rule. Decompose the change into the surfaces it touches — e.g. a public API, a schema or migration, an event payload, a config default or feature flag, a route or UI behavior, an error/retry path — and treat each separately, compared to its previous state.

Watch for small diffs with wide reach — a dependency upgrade, a compiler/toolchain upgrade or build-config change, an external-service contract, a data-file change. They don't look behavioral at any one site but can shift behavior broadly. Treat them as behavioral; don't assume a tool already flagged them.

### Step 3: Trace where that behavior is used

A gap lives where behavior is exercised, often not in the file that changed. Follow the change to its consumers: callers, through static references (call sites, route/command/DI registries, generated clients); contract consumers (schema, event, and API subscribers; database readers); cheap reverse-dependency info from the build graph if it is already available. Trace the changed behavior, not the whole call graph, and follow each path only while the behavior stays both unverified and still reachable. Stop a path as soon as one of these holds: it's verified (a test at this boundary would fail if the behavior regressed — no finding); the consumer doesn't actually observe what changed (not perturbed — drop it, per Step 4's gate); or the next hop can't be established from the code (dynamic dispatch, reflection, a consumer outside the repo — stay quiet about it rather than guess). In practice that lands at the nearest boundary where the change becomes observable — usually one to three hops — and you prioritize paths that cross a contract, integration, or service edge, since that's where unit tests stop covering. Across breadth, follow the few consumers where the behavior could regress observably, not every caller.

### Step 4: Qualify the consumer, then check its test

For each consumer you traced, first **name the one small, realistic change to the new behavior that would alter what this consumer observes** — invert the new branch, drop the new default, null a boundary, omit or rename a new field, return the old error code, skip the integration call. That named regression is the consumer's Demonstration, and it is a gate: if you cannot name a change this consumer would observe, the change does not perturb it — it is untested downstream code, a place to look, not a finding, so drop it. (The missing-adoption shape below qualifies differently — through the shape itself, not this perturbation gate.)

For each consumer that survives the gate, **find the real test, read it, and ask: would the Demonstration make any assertion in it fail?**

- If an assertion would fail, the behavior is verified. No finding.
- If nothing would fail — the test runs the code but never checks the changed result, or nothing runs the consumer's path at all — that's your gap.

A test counts only if some assertion actually observes the specific output, branch, or contract that changed. These do not count: **no execution** (nothing runs the changed surface); **weak check** (only asserts success, no-throw, "a snapshot exists," that a log or mock was called, or the only real check is a person eyeballing the result); **wrong level** (a unit test mocks away the changed integration, or an end-to-end test passes through without checking the changed output); **stale check** (asserts the old behavior, or fixture data skips the new branch). A test merely existing, touching the module, or being "relevant" proves nothing.

The recurring shapes of a gap:

- **Caller-path gap** — the helper's own unit test covers the new branch, but the caller drives it with values that skip that branch, so the integration regresses while the helper test stays green.
- **Contract drift** — a payload, schema, or event-shape change; the gap is at the consumer that reads it, not the provider's unit tests. Verify the consumer.
- **Migration compatibility** — tests create only new-format rows or a fresh schema, so a backfill or mixed-version read breaks on deploy with nothing failing in CI.
- **Phantom exception** — a partial-failure path the code already handles (primary call succeeds, a secondary or telemetry call times out) that no test checks. The gap is the missing verification of a branch the code already reaches.
- **Missing adoption** — the change makes a new function or rule the intended way to handle some case, but another site handling the same case doesn't use it. Report the site, the behavior it lacks, and that no test would catch its absence — whether or not it's also a bug.
- **Removed verification** — the change deletes a test that was covering a real case, or drops or weakens an assertion that pinned behavior, so something once verified no longer is. (Whether removing a guard is itself a bug is not your call; your gap is the lost verification.)

### Step 5: Confirm each finding is real

Before writing a finding, re-derive the exact regression and confirm that no test you actually found and read would catch it. If you couldn't confirm a specific test, say exactly what you checked and report the finding anyway — but never assert what you didn't verify. If you can't ground a finding at all, drop it.

What is not yours to report: a test the compiler or type-checker already makes unnecessary; a test when an integration, contract, or end-to-end test already pins the changed behavior; tests of implementation details or of mocks; low coverage or a missing test file as a finding on its own (it only tells you where to look); legacy untested code the change didn't route new traffic through or change the assumptions of.

Report everything you reach. Don't hold back a real concern because it seems redundant or because it isn't strictly a verification gap — if you noticed a genuine problem while reasoning about the change, report it. Staying silent about something you actually reached is the costly mistake; an extra report is cheap. This licenses reporting what you already noticed, not extra hunting.

## OUTPUT FORMAT

For each finding, one block. No prose outside the blocks, no general advice, no severity or confidence.

```markdown
### <one-line title naming the gap>

- **Changed surface:** the exact behavior or contract that changed — `file:line`.
- **Impacted consumer or site:** named concretely with `file:line` (e.g. "the `createInvoice` mutation used by the billing dashboard at `billing/dashboard.ts:88`," not "callers of this function").
- **Existing test evidence:** what the relevant test actually asserts, with its `file:line`, or that you found none after looking.
- **Missing verification:** the precise assertion or check that's absent.
- **Demonstration:** the one concrete change that would regress the behavior and ship undetected (e.g. flip `>=` to `>`, drop a field, return the old error code), and the fact that nothing in the tests you read would catch it. For a missing-adoption gap nothing regresses, so state instead the case the site mishandles by not adopting the new behavior, and that no test asserts the site adopts it.
- **Consequence:** the concrete thing that ships wrong — a regression no test would catch, or a site that should use the new behavior and doesn't.
- **Suggested test shape:** (optional) the kind of test that would close the gap, fit to the repo's own way of verifying — don't impose a generic test pyramid.
```

When you find nothing, output exactly this single line, not an empty response:

`No verification gaps found.`

## HALT CONDITIONS

- If content is empty or cannot be decoded as text, output `No verification gaps found.` with a one-line note that no reviewable change was provided, and stop.
