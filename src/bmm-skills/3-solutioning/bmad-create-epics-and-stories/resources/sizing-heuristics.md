# Story Sizing Heuristics

Stories target **one AI session, verifiable end-state, bounded blast radius**. Use these heuristics during Stage 4 decomposition. Loaded as a persistent fact for the duration of authoring.

## The three tests

1. **One AI session.** A single dev agent, equipped with the epic's Shared Context, can complete the story end-to-end (code + tests + verification) in roughly one focused work session — typically 1–4 hours of effort, perhaps a few thousand lines of touched code at the high end. If you can't picture the agent finishing without context exhaustion or a hand-off, the story is too big.

2. **Verifiable end-state.** "Done" can be unambiguously checked — a test passes, an endpoint returns the expected shape, a UI flow completes. If "done" is "we wrote some code toward X," the story is mis-shaped.

3. **Bounded blast radius.** The story modifies a tractable surface area — typically a handful of files, one component or one cross-cutting concern. A story that touches every layer of the app and every test file is a feature, not a story.

## Right-sized examples

- "Add the `/users/:id/avatar` endpoint with multipart upload, S3 storage, and integration tests." — One endpoint, one storage path, well-bounded.
- "Migrate the `Order.totals` calculation from the controller into a domain service, with parity tests." — One refactor, one verification.
- "Wire the existing rate-limiter middleware onto the public auth routes and add coverage for 429 responses." — One integration, clear AC.

## Too-large signals

- The user story uses "and" three times.
- Acceptance criteria number more than ~6.
- The story would touch 4+ unrelated layers (UI + API + storage + worker + ops).
- "Build the X system."

If you see these, **split**: each AC is often a candidate sub-story; or, factor along the seams of the epic's Shared Context.

## Too-small signals

- AC list of one item that is itself a single function call.
- "Rename a variable" or "delete a comment" as a standalone story.
- Story body shorter than the front matter.

If you see these, **fold** into a sibling story or into the epic's Shared Context as a note.

## Vertical over horizontal

Vertical slices (a user-visible capability, end-to-end through the layers it needs) are preferred over horizontal slices (one layer at a time across many capabilities). Horizontal is acceptable when the slice has **explicit justification** in the epic's Shared Context — typically a deliberate seam (e.g. "Phase 1 establishes the schema; Phase 2 wires the UI in a single batch"). Justify horizontals in the epic.md, not in each story.

## Stage 5 sizing check is advisory

The validator's sizing check emits **warnings**, not failures. A warning means "this story's body is far longer than the epic's average — consider splitting." It does not block completion. If many warnings fire on real-world stories, tune the body-length thresholds in `scripts/validate_initiative.py` rather than weakening the schema or dependency checks.
