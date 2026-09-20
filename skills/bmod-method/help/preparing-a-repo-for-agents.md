# Preparing and keeping a repository fit for agents

Use this when the user asks how to get an existing codebase ready for agentic coding, why agents produce inconsistent work in their repo, how much documentation to keep, or how to hold quality over time. For the order of skills on an existing codebase, see `help/existing-codebase.md`.

## What makes a repository work well with agents

- **Consistency.** An agent copies the patterns it finds. When the project does the same thing several different ways, the agent cannot be consistent either, and each session may pick a different way.
- **A good initial `AGENTS.md`.** A short, verified set of rules is worth having from the start: the policies, commands, and conventions the code cannot show. `bmad-project-context` sets it up and keeps it small.
- **Good end-to-end tests.** They let an agent change code and know it still works, and they make refactoring safe. `bmad-qa-generate-e2e-tests` adds them for features that already exist.
- **Clean structure.** Very large files and tangled modules cost every session tokens and accuracy.

## Improve before building, when quality is low

If the codebase is inconsistent or untested, some refactoring and test work first goes a long way, and it pays back in every later session. Agents can help assess the code and carry out the improvements: ask for an assessment of inconsistent patterns, then make each cleanup its own `bmad-build` change with tests in place first. A skill dedicated to this is planned. A codebase of decent quality needs none of this: start with a small change.

## Documentation: keep it small

Earlier BMad guidance produced heavy documentation of a codebase. That is no longer suggested. Those documents were bloated, hard to maintain, and went stale quickly. A new documentation skill for codebases is planned.

- The code is the best documentation for an agent. During coding, an agent should need few documents.
- Documents should hold only what the code cannot explain: why a decision was made, a constraint from outside the code, a rule that spans components.
- Recommend small numbered decision records (ADRs), written consistently, only for what is needed, in the repository's `docs` folder or similar.
- `AGENTS.md` should make agents aware the records exist and when to consult them, without copying their content.

## Refactor regularly

After several stories, at the end of an epic, and every so often otherwise, do a refactoring pass toward cleaner code. This step is commonly skipped, and agent-built code drifts without it: duplication, near-copies of helpers, and patterns that diverged between sessions.

- The end of an epic is a good moment because the whole changeset can be looked at together. `bmad-retrospective` reports duplication and drift across the epic's stories, and its findings are a ready list of refactoring work.
- Run each refactoring as its own `bmad-build` change, separate from feature work.
- Refactoring is safest with a good test suite in place. Without one, add tests first.
