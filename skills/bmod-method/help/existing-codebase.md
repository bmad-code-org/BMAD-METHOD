# Using the method on an existing codebase

The method works on an inherited or long-lived codebase with no up-front documentation pass. `bmad-build` investigates the repository on every run, writes down what to reuse and what not to change, and follows that. Too little planning costs one build run, so start small and add planning only when the work calls for it.

BMad is installed per project. The existing repository needs its own install and its own `bmad setup`.

## Suggested order

1. **`bmad-project-context`**, recommended. A good initial `AGENTS.md` is worth having: it records a small, verified set of rules for agents. Skipping it does not fail a build; the cost is the same mistake every session until someone writes the rule down. When the repo already has a maintained `AGENTS.md` or `CLAUDE.md`, it adopts that file instead of starting over. It does not produce a repo overview or a stack list, so it will not teach the user the app.
2. **`bmad-walkthrough`**, when the user does not know the code. It guides them through a file, directory, commit, or PR at their own pace: intent first, then broad strokes, then detail.
3. **`bmad-architecture`**, only when needed. It can start from the codebase and ratify the conventions worth keeping in a short decisions list. Skip it when the codebase is well documented or the changes are small.
4. **`bmad-build`** for the first change. Pick something one session can finish. A change that follows established patterns, such as a new route in a layered API, needs no planning skill: a short intent file or a few sentences is enough input.
5. **`bmad-spec`**, then one `bmad-build` per story, when a change is bigger than one session.
6. **`bmad-qa-generate-e2e-tests`**, when the inherited app has little test coverage. It generates API and end-to-end tests for features that already exist.

If the codebase is inconsistent or has few tests, cleanup first pays back in every later session (`help/preparing-a-repo-for-agents.md`).

## What pushes a change up a tier

Size alone does not. A change needs more than `bmad-build` when it forces a decision the existing patterns do not cover: a new boundary between components, a schema migration strategy, new authorization rules. The user can also state such a decision in the intent, and `bmad-build` will raise it while clarifying.
