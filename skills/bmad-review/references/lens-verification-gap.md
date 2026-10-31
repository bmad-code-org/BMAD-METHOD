# Verification-Gap Lens

**Goal:** Find behavior this change altered that could break later without any test failing. Do not hunt for bugs; report the ones you run into while tracing.

A gap finding is a request to add or change one test. File it only when you can name a specific regression that test would catch. If no such test is worth writing, there is nothing to file.

Gap shapes:

1. **Regression gap:** the changed code could regress where it is used, and no test would fail.
2. **Missing-adoption gap:** a site that should use the new behavior still handles the case its own way, and no test would catch that.
3. **Broken-verification gap:** a test looks like it covers the change but does not: it is skipped, flaky, not run normally, or too weak to see the regression.
4. **Stale-verification gap:** a test this change made wrong or moot. It may still pass.

## Evidence rules

- Read a test before saying what it covers or misses.
- Before saying no test exists, search the repo for the symbol under test and its imports. Expected file locations are not enough.
- Say what you checked and how far you looked. Drop any finding you cannot ground.
- Do not assign severity, confidence, priority, or ranking.

## Sequence

### Step 1: Screen

Take each part of the change separately. Skip a part that changes no behavior: no change to return values, thrown errors, side effects callers can see, or observable state (including iteration order and emitted messages). Formatting, comments, renames, trivial getters and pass-throughs, and type-only changes are examples. Once a part is skipped, do not look at its callers or tests.

Also skip parts that are not worth a test: static text such as prompts, skills, and documents; LLM output; and build, toolchain, dependency, and configuration changes that the build or CI run itself checks. Deterministic code that builds a prompt or request, or handles a model's response, is still eligible; the model call itself is not, and existing tests that call a model are not precedent for more.

Do not skip test-only parts. A deleted or weakened test is checked in Step 4; every touched test is read in Step 5.

If every part is skipped, return zero findings (`[]`). When the output format includes a markdown report, note there that the change is non-behavioral; a caller's exact zero-findings output contract wins over this note.

### Step 2: Name the changed behavior

For each remaining part, say what behavior differs from before: output, side effect, branch, error path, schema or event shape, default, validation rule, external contract. Handle each behavior separately.

### Step 3: Find where it is used

Trace each changed behavior to the code that observes it: direct callers, registered entry points (routes, commands, DI), and contract consumers (schemas, events, APIs, database readers).

Stop a path when a test there would catch a regression, when the consumer does not observe the change, or when the next hop is a guess (dynamic dispatch, reflection, code outside the repo). One to three hops is usually enough. With more than five similar consumers, check representative ones and expand only when a consumer uses the behavior differently.

### Step 4: Name the regression, then check the test

For each consumer, name the smallest realistic regression it would see: the branch inverted, the default dropped, the field omitted, the old error code returned, the integration call skipped. This is the Demonstration. It describes what goes wrong for the consumer. "This line could be removed without a test failing" is not a regression. If there is no regression (the state is unreachable, the branch is defensive, the code repeats what another line already guarantees), drop the path. There is no finding and nowhere else to file it.

A missing-adoption gap needs two things: evidence the change means the new behavior to replace the local one (PR intent, naming or docs, a replaced sibling site, deleted duplicate logic, a test defining the new rule), and the same observable contract at both sites. Without both, it is a refactor suggestion, not a finding. With both, missing coverage of the non-adoption is the gap.

Read the relevant test. Would the Demonstration make an assertion fail?

- Yes: the behavior is verified. No finding.
- No test runs the path, or the test is skipped, flaky, or not run normally, or it runs the code without checking the changed result: report a regression gap or broken-verification gap.
- No test asserts the site adopts the new behavior: report a missing-adoption gap.

A test counts only when it runs normally and an assertion observes the changed output, branch, or contract. These do not count: assertions on source text; success, no-throw, or snapshot-only checks; mock or log-call checks; manual checks; tests that mock away the integration; end-to-end tests that pass through without checking the changed output; stale assertions or fixtures. For example, `expect(x ?? DEFAULT).toBe(DEFAULT)` passes when `x` is missing.

Common patterns: a helper test covers the branch but caller values skip it; a payload or schema change is not checked at the consumer; migration tests only create new-format rows; a handled partial-failure path has no test; a deleted or weakened test leaves behavior unpinned (deleting a source-text assertion is not this).

### Step 5: Check the touched tests

A test is wrong when what it asserts is not what the code should do after this change. A test or test comment is moot when it no longer exercises or describes anything. Report either as a stale-verification gap, saying what the test should assert instead, or that it should go.

### Step 6: Confirm

Before writing a finding, re-open the tests or search results it relies on. Check that the Demonstration names a regression and no test you read would catch it, or that the stale assertion pins the outcome you say it does. Explain why the test misses the regression from what it sets up and checks.

Do not report: cases the compiler or type checker enforces; behavior an integration, contract, or end-to-end test already verifies; low coverage or a missing test file by itself; untested code the change did not touch.

Defects you ran into while tracing are reported with `gap_shape: "other"`. Do not go looking for more.

## Findings shape

Emit each gap with the canonical fields plus this lens's extras:

- `location` — the behavior or contract that changed, `file:line`
- `trigger_condition` — the gap, in one line
- `guard_snippet` — the test to add or change: the assertion or check that is absent, or how the stale assertion should read, fit to how this repo already tests
- `potential_consequence` — the regression, and why the tests you read would not fail; for a missing-adoption gap, the case the site mishandles; for a stale-verification gap, what the code should do, and why the test does not say so
- `gap_shape` — `"regression-gap"`, `"missing-adoption-gap"`, `"broken-verification-gap"`, `"stale-verification-gap"`, or `"other"`
- `consumer` — the impacted consumer or site, named concretely with `file:line`, not "callers of this function"
- `evidence` — what the relevant test asserts, with `file:line`; or the searches run and their result; for a broken-verification gap, why the apparent test does not count; for a stale-verification gap, the assertion that is wrong or moot

For `gap_shape: "other"` findings the four canonical fields suffice (description only); `consumer` and `evidence` are optional. An empty array is valid when the change is non-behavioral or every changed behavior is verified. When this lens comes up clean and a markdown report is presented, its clean statement for this lens is exactly: `No verification gaps found.`
