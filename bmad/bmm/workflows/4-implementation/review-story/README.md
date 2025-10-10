# Review Story (Senior Developer Review)

Perform an AI-driven Senior Developer Review on a story flagged "Ready for Review". The workflow ingests the story, its Story Context, and the epic’s Tech Spec, consults local docs, uses enabled MCP servers for up-to-date best practices (with web search fallback), and appends structured review notes to the story.

## What It Does

- Auto-discovers the target story or accepts an explicit `story_path`
- Verifies the story is in a reviewable state (e.g., Ready for Review/Review)
- Loads Story Context (from Dev Agent Record → Context Reference or auto-discovery)
- Locates the epic Tech Spec and relevant architecture/standards docs
- Uses MCP servers for best-practices and security references; falls back to web search
- Reviews implementation vs Acceptance Criteria, Tech Spec, and repo standards
- Evaluates code quality, security, and test coverage
- Appends a "Senior Developer Review (AI)" section to the story with findings and action items
- Optionally updates story Status based on outcome

## How to Invoke

- By workflow name (if supported):
  - `workflow review-story`
- By path:
  - `workflow {project-root}/bmad/bmm/workflows/4-implementation/review-story/workflow.yaml`

## Inputs and Variables

- `story_path` (optional): Explicit path to a story file
- `story_dir` (from config): `{project-root}/bmad/bmm/config.yaml` → `dev_story_location`
- `allow_status_values`: Defaults include `Ready for Review`, `Review`
- `auto_discover_context` (default: true)
- `auto_discover_tech_spec` (default: true)
- `tech_spec_glob_template`: `tech-spec-epic-{{epic_num}}*.md`
- `arch_docs_search_dirs`: Defaults to `docs/` and `outputs/`
- `enable_mcp_doc_search` (default: true)
- `enable_web_fallback` (default: true)
- `update_status_on_result` (default: false)

## Story Updates

- Appends a section titled: `Senior Developer Review (AI)` at the end
- Adds a Change Log entry: "Senior Developer Review notes appended"
- If enabled, updates `Status` based on outcome

## Persistence and Backlog

To ensure review findings become actionable work, the workflow can persist action items to multiple targets (configurable):

- Story tasks: Inserts unchecked items under `Tasks / Subtasks` in a "Review Follow-ups (AI)" subsection so `dev-story` can pick them up next.
- Story review section: Keeps a full list under "Senior Developer Review (AI) → Action Items".
- Backlog file: Appends normalized rows to `docs/backlog.md` (created if missing) for cross-cutting or longer-term improvements.
- Epic follow-ups: If an epic Tech Spec is found, appends to its `Post-Review Follow-ups` section.

Configure via `workflow.yaml` variables:

- `persist_action_items` (default: true)
- `persist_targets`: `story_tasks`, `story_review_section`, `backlog_file`, `epic_followups`
- `backlog_file` (default: `{project-root}/docs/backlog.md`)
- `update_epic_followups` (default: true)
- `epic_followups_section_title` (default: `Post-Review Follow-ups`)

Routing guidance:

- Put must-fix items to ship the story into the story’s tasks.
- Put same-epic but non-blocking improvements into the epic Tech Spec follow-ups.
- Put cross-cutting, future, or refactor work into the backlog file.

## Related Workflows

- `dev-story` — Implements tasks/subtasks and can act on review action items
- `story-context` — Generates Story Context for a single story
- `tech-spec` — Generates epic Tech Spec documents

_Part of the BMAD Method v6 — Implementation Phase_
