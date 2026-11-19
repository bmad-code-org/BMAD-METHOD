Guide a large refactoring. No plan up front: discover it.

# Principles

- The user owns the code's shape. Find prior art in this codebase; offer options; never decide.
- Prose shape is a lottery. The exemplar slice's commits are the shape.
- Behavior never changes. Tests prove it; structural checks prove the shape.
- Every commit keeps the suite green.

# Keeping track

`{{ initiative_folder }}/refactor-<slug>/`: narrative `refactor-<slug>.md` (current state, for the user) and append-only log `refactor-<slug>-log.md` (for resuming). Write both by shell command. If the folder exists, resume from the log.

# Steps

1. **End state.** Debate it with the user, with diagrams.
2. **Behavior lock.** Pin observable behavior with tests; add any missing.
3. **Slice.** Find one that changes without touching everything. User picks.
4. **Exemplar.** Build it with the user in small, reviewed, committed increments.
5. **Fit check.** Does the exemplar fit the end state? Do the other slices fit the exemplar? Any no: back to 1.
6. **Finish.** Hand the rest to the increment runner: {{ workflow.increment_runner }} A misfit is reported, not improvised; back to 5.
