---
name: 'site-analysis'
description: 'Analyze a website and capture design DNA into Design Space'
configFile: '{project-root}/_bmad/wds/config.yaml'
---

# Site Analysis Workflow

## PURPOSE
Analyze a website and capture its complete design fingerprint — structural DNA, visual DNA, and content DNA — into the Design Space with dual embeddings.

## INITIALIZATION
1. READ COMPLETE this workflow file
2. Load config from `{project-root}/_bmad/wds/config.yaml`
3. Read `.claude/design-space-guide.md` if it exists in the project

## MODE ROUTING

### Create Mode (default)
Analyze a new website. Ask for the target URL, then proceed through:

1. **[step-01-init]** — Load context, confirm URL, check existing analysis
2. **[step-02-structural-dna]** — Navigation, layout, page types, IA
3. **[step-03-visual-dna]** — Colors, typography, spacing, imagery
4. **[step-04-content-dna]** — Tone, messaging, CTAs, content strategy
5. **[step-05-capture]** — Batch capture with dual embeddings
6. **[step-06-summary]** — Present findings, offer next steps

### Validate Mode (flag: -v)
Check an existing analysis for completeness:
→ Load `./steps-v/step-01-validate.md`

## MCP TOOLS USED
- `capture_visual` — screenshot + description → dual embedding
- `capture_knowledge` — text-only insights
- `search_space` — check for existing analysis
- `search_visual_similarity` — find similar patterns across projects

## RULES
- 📖 READ COMPLETE each step file before executing
- 🔄 Follow the sequence — don't skip steps
- ⏸️ Wait for user input at each step before proceeding
- 📸 Take screenshots of every significant section
- 📝 Write detailed semantic descriptions (200-400 words per section)
- 🏷️ Tag everything with project, topics, components
- ⏱️ Respect Voyage AI rate limits (25s between visual captures on free tier)

## NEXT STEP
→ Load `./steps-c/step-01-init.md`
