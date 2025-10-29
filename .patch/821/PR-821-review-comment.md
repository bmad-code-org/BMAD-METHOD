# Review summary for PR #821

Thank you for PR #821 — this is a substantial and thoughtful contribution. We reviewed the patch in depth and applied it on a review branch to assess fit with v6.

Summary of findings

- Scope: Adds a complete, self-contained subagent system for Claude & OpenCode under `subagentic/` (13 agents per platform + teams, checklists, templates, tasks, workflows, utils, data, docs).
- Isolation: No direct conflicts with existing `src/` assets; changes are pure additions.
- Philosophy: The PR aligns with a static, editor-first approach (copy/install + `@agent` + `*commands`). BMAD v6 is oriented around dynamic, template-generated agents, sidecars, and CLI workflows.
- External context: This PR appears to be a subset of the broader agentic-toolkit project. That toolkit includes multiple workflows (Simple, Claude/OpenCode subagents, BMAD), Task Master, and extensive MCP integrations.

Validation

- Applied patch on `pr-821-review` and generated inventory. No merge conflicts; 47 trailing whitespace warnings (non-blocking).
- Ran test and schema validators.
  - Unit tests: 48 passed / 2 failed (fixture expectations unrelated to this PR).
  - Agent schema validation: pre-existing 3 invalid files under `src/modules/bmm/agents/` (unrecognized menu keys). The PR’s subagentic content is markdown and not subject to BMAD YAML validation.

Architectural assessment

- Agent format: Subagents use Markdown + frontmatter and freeform behavior. BMAD uses structured YAML with a validated schema (`*.agent.yaml`).
- Invocation: Subagents use `@agent` and `*` commands; BMAD agents expose menu triggers bound to workflows/actions.
- Install/usage: Subagents are intended for global editor config (e.g., `~/.claude`), whereas BMAD is project-scoped and CLI-driven.

Recommendation

- Primary (proposed): Reference this as an external alternative rather than merging code. Rationale: avoid dual systems inside the repo and respect the broader agentic-toolkit as the home for this approach.
- Secondary: Extract optimization patterns from subagents to improve BMAD’s dynamic generation. We spiked a tiny adapter that converts a subagent Markdown into a BMAD `*.agent.yaml` and validated it successfully (see `src/modules/subagentic/agents/master.agent.yaml`).
- Optional: If we want a minimal direct integration, consider shipping only the 3-step Simple workflow as a tiny BMAD module.

Next steps

- If we proceed with the external-reference path: we’ll add a docs section linking to agentic-toolkit, positioning it as a quick-start for static/editor-first usage.
- If we want to invest in dynamic alignment: we can iterate on the adapter and templates to generate BMAD agents from the subagent definitions (or vice versa).

Again, thank you for the comprehensive contribution. We’re happy to collaborate on documenting and cross-linking, and on extracting patterns that improve BMAD v6 while keeping a single source of truth for generated agents.
