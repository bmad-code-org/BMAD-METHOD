# What belongs in a repo's agent instructions

Rules for deciding what goes in the block, for judging what a repo already has, and for explaining both to the user.

## The test

Can an agent derive this by reading the repository? If yes, leave it out — a stored copy is a stale duplicate of something the agent reads more accurately first-hand, and it is charged on every session. Write down what the code cannot say.

## Admit

- **Policy the code cannot express** — branch rules, frozen and protected paths, generated files, secrets, security and compliance. Stated by a human or read off an enforcing config, never inferred.
- **What a config file cannot say about running the project** — the root test script does nothing in this workspace, integration tests need a service up first, the suite takes eleven minutes so iterate on single files, the `Makefile` is the real entry point and `package.json` is vestigial, CI runs a typecheck the test script does not. The invocation itself is already stated in `package.json`, `Makefile`, `pyproject.toml`, or CI config and does not earn a line — the correction or the caveat does.
- **Conventions that differ from ecosystem defaults.** An agent follows the norm unless told otherwise, so only the divergences earn a line.
- **Pitfalls with observed evidence** — a recorded lesson, the maintainer's recollection, the same mistake fixed repeatedly in history, or one this session made and caught. A repo yields hundreds of trap-looking facts and none of them predict real mistakes; only observed behavior does. A surprising scan finding is a question to ask, not a line to write.
- **Runtime behavior invisible from the repo** — replaying webhooks, lying health endpoints, environment quirks — once a human confirms it.
- **Entry points and pointers** to where work lands.

Prefer prohibitions to advice, and name the permitted alternative in the same line.

## Exclude

| | Why |
|---|---|
| Repo overviews, directory trees, stack lists | Derived fresh, more accurately; stored copies rot |
| Anything included for being interesting | Interest is not need |
| Style rules an agent self-enforces | Belongs in a formatter, linter, hook, or CI check — propose the check instead |
| Platitudes | Already the default |
| Commands already stated in `package.json`, a `Makefile`, or CI config | Read from the source of truth; a copy drifts the moment a script is renamed |
| Pasted code, changelog content, fast-changing facts | Stale immediately |
| Aspirational state | Describe what is; intent belongs in specs |
| History and edit narration | Git holds it; state present truth |

## Retire

A policy or pitfall line goes only when the thing it guards is gone, or the user retires it. Nothing failing lately is not evidence — a working rule erases its own evidence.

Every other line faces one question at each write: would removing it change agent behavior? If no, cut it.

## Size

Every line is paid in every session, and instruction-following degrades as the loaded set grows. Count what other always-loaded files add. Over budget means cut the weakest lines or move them behind a trigger — never raise the budget. Ten lines of evidence means ten lines.

## Retrieval

An index the agent must choose to fetch gets skipped; one already in context does not. Keep everything load-bearing in the block. A pointer out of it names a trigger the agent can observe — a path, a file type, a named task — never one it must judge ("when the task is complex") or track about itself ("before your first edit").

Rules bounded to a directory go in a nested `AGENTS.md` there, attached by location rather than by pointer. Use a linked file only when the trigger is not a path.

## Maintain

- Re-check that caveats still hold — a slow suite that got fast, a workaround for a bug that was fixed.
- Diff deletions and renames since the verified SHA against every line.
- Record provenance in the block so the next run knows what it is diffing from.
- Capture mistakes when they happen, not at review time. One occurrence is a note; recurrence earns a line.
- Route anything mechanically preventable to a hook, lint rule, or CI check. A check that lands deletes its line.

## Repo or home directory

This block belongs committed: shared by the team, consistent across machines, versioned with the code it constrains.

Two things belong in the user's global agent config instead — rules repeating across all their projects, and personal preferences that are theirs rather than the team's.

## Judging an existing file

Report, in this order: what is derivable filler, what is unverifiable or stale, what is missing against the sections above, and what is already good. Keep recorded lessons by default — they are maintainer testimony, and are challenged only with evidence that the thing they name is gone or wrong.
