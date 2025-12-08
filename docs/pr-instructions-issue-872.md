# Pull Request Instructions for Issue #872

Use this checklist to open a PR from your fork.

1. Push branch `fix/872-architecture-command` to your fork (already pushed locally in this workspace).
2. On GitHub, click **Compare & pull request** with:
   - **Base repository:** bmad-code-org/BMAD-METHOD
   - **Base branch:** main
   - **Head repository:** YOUR_FORK/BMAD-METHOD
   - **Head branch:** fix/872-architecture-command
3. Suggested PR title: `fix: anchor workflow commands for create-architecture`
4. PR description (project template):
   - **What:** Anchor generated workflow commands to `{project-root}` so IDEs don’t resolve core/workflow paths relative to module folders; add regression test for the `create-architecture` workflow command.
   - **Why:** `*workflow-init`/`*create-architecture` commands could fail with “workflow.xml does not exist” because generated command paths were relative (e.g., `.bmad/bmm/core/tasks/workflow.xml`). Anchoring ensures commands point to `.bmad/core/tasks/workflow.xml` and the correct workflow file.
   - **How:**
     - Update workflow command generator to prefix core/workflow paths with `{project-root}` and anchor display paths for installed workflows.
     - Add installation component test validating anchored paths for the `create-architecture` command.
   - **Testing:** `npm test`
5. Submit the PR and link it to Issue #872.

If reviewers ask for proof, include the `npm test` output from your latest run.
