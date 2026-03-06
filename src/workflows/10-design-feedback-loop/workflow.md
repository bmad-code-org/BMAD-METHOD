---
name: 'design-feedback-loop'
description: 'Capture designer feedback as linked before/after pairs to build design taste'
configFile: '{project-root}/_bmad/wds/config.yaml'
---

# Design Feedback Loop

## PURPOSE
Learn the designer's taste through linked before/after pairs. Every improvement captured builds a library of solutions that makes future designs better from the start.

**Philosophy:** This is a solutions database, not a complaints log. The "before" state is context. The "after" state — the improvement — is the real knowledge.

## INITIALIZATION
1. READ COMPLETE this workflow file
2. Load Design Space protocol from `src/data/design-space/protocol.md`
3. Load feedback loop guide from `src/data/design-space/feedback-loop-guide.md`
4. Read `.claude/design-space-guide.md` if it exists in the project

## MODE ROUTING

### Create Mode (default)
Capture a designer's feedback as a linked pair:

1. **[step-01-detect-change]** — Recognize a preference signal
2. **[step-02-capture-before]** — Document the starting state
3. **[step-03-understand-why]** — Ask what would make it better
4. **[step-04-capture-after]** — Document the improved version and save the pair

### Validate Mode (flag: -v)
Pre-check a proposed design against known preferences:
→ Load `./steps-v/step-01-pre-check.md`

## MCP TOOLS USED
- `capture_feedback_pair` — save linked before/after with reasoning
- `search_preference_patterns` — check against known improvements
- `capture_visual` — screenshot + description for visual entries
- `search_space` — find related patterns

## RULES
- 📖 READ COMPLETE each step file before executing
- 🎯 Focus on solutions — what works and why
- 🔗 Always capture as linked pairs, never isolated entries
- 📸 Include screenshots when available (visual embedding adds pattern detection)
- ⏱️ Wait 25s between visual captures (Voyage AI rate limit on free tier)
- ✅ Confirm the learning with the designer: "Learned: [X] works better because [Y]"

## NEXT STEP
→ Load `./steps-c/step-01-detect-change.md`
