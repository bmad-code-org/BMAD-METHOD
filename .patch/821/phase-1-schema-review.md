# Phase 1: Schema and Format Review (PR #821)

Date: 2025-10-28
Branch: pr-821-review

## What we inspected

- BMAD agent schema implementation: `tools/schema/agent.js`
- Example BMAD agent: `src/modules/bmb/agents/bmad-builder.agent.yaml`
- Example PR agent (Claude): `subagentic/claude-subagents/agents/master.md`

## Findings

### BMAD Agent Schema (YAML)

- File extension: `*.agent.yaml`
- Validated via Zod schema (`tools/schema/agent.js`)
- Required structure:
  - `agent.metadata` (id, name, title, icon, optional module)
  - `agent.persona` (role, identity, communication_style, principles[])
  - `agent.menu[]` (entries with `trigger`, `description`, and one command target: `workflow` | `validate-workflow` | `exec` | `action` | `tmpl` | `data` | `run-workflow`)
  - Optional: `agent.critical_actions[]`, `agent.prompts[]`
- Module scoping derived from path: `src/modules/<module>/agents/`

### PR Subagent Format (Markdown)

- File extension: `.md` with YAML frontmatter
- Frontmatter keys observed: `name`, `description`, `model`, `color`
- Body contains prose defining behavior, commands (e.g., `*help`, `*task`), and resource lists
- Designed for editor-level runtime loading (e.g., `~/.claude/tasks`)

### Compatibility Assessment

- Schema: Incompatible (Markdown vs YAML schema)
- Data shape: Different core concepts (persona/menu vs freeform behavior & commands)
- Invocation model: Different (BMAD menus/workflows vs `*` commands and `@agent` entries)

## Implications

- BMAD validators (`validate:schemas`, tests) do not apply to `subagentic/` content
- Direct migration requires either:
  1. An adapter to convert subagent MD to BMAD `*.agent.yaml` definitions, or
  2. A generator to produce subagentic MD from BMAD YAML agents (reverse direction), or
  3. Keep subagentic content external and reference it in docs

## Minimal Adapter Proposal (Option 1)

- Parser: Read Markdown, extract frontmatter (name/description) and derive persona/menu
- Mapping sketch:
  - `agent.metadata`: id `<module or external>/subagentic/<name>`, name `<frontmatter.name>`, title from description, icon default
  - `agent.persona`: role from name, identity from description; principles use subagent "Core Operating Principles"
  - `agent.menu`: map `*` commands to menu `trigger` + `action` (`exec`), with descriptions from Commands section
- Output: Write to `src/modules/subagentic/agents/<agent>.agent.yaml` (new module)
- Caveat: Requires curation; not all commands map cleanly to BMAD command targets

## Current Repo Validation Status (context)

- `npm test` (fixtures) => 48 passed, 2 failed (fixture expectations)
- `npm run validate:schemas` (real agents) => 14 valid, 3 invalid (existing BMM agents with extra keys)
- These failures are unrelated to PR #821 content and pre-exist under `src/modules/bmm/agents/`

## Recommendation for Phase 2

- Do not attempt to validate `subagentic/` with BMAD schema (non-applicable)
- If integration is desired, spike an adapter script to convert 1-2 agents as proof of concept
- Otherwise, proceed with decision on documenting subagentic as an external alternative
