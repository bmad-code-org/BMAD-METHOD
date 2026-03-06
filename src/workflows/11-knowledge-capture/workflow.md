---
name: 'knowledge-capture'
description: 'Guided capture of design knowledge into the Design Space'
configFile: '{project-root}/_bmad/wds/config.yaml'
---

# Knowledge Capture Workflow

## PURPOSE
Structured capture of design insights, methodology learnings, and process improvements into the Design Space. Use this for deliberate capture sessions — auto-capture during design work is covered by agent guides.

## INITIALIZATION
1. READ COMPLETE this workflow file
2. Load Design Space protocol from `src/data/design-space/protocol.md`
3. Read `.claude/design-space-guide.md` if it exists in the project

## MODE ROUTING

### Create Mode (default)
Guided capture session:

1. **[step-01-context]** — Establish what to capture and why
2. **[step-02-capture]** — Structured capture with quality checks
3. **[step-03-review]** — Verify captures and identify gaps

### Validate Mode (flag: -v)
Audit existing Design Space entries for quality:
→ Load `./steps-v/step-01-audit.md`

## MCP TOOLS USED
- `capture_knowledge` — text insights with semantic embedding
- `capture_visual` — screenshots with dual embedding
- `search_space` — check for duplicates before capturing
- `recent_knowledge` — review recent entries

## RULES
- 📖 READ COMPLETE each step file before executing
- 🔍 Search before capturing — no duplicates
- 🎯 Quality over quantity — specific beats vague
- 🏷️ Tag everything — topics, components, project, source
- ⏱️ Wait 25s between visual captures (Voyage AI rate limit on free tier)

## NEXT STEP
→ Load `./steps-c/step-01-context.md`
