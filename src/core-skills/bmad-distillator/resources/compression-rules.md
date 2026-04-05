# Compression Rules

These rules govern how source text is compressed into distillate format. Apply as a final pass over all output.

## Strip — Remove entirely

- Prose transitions: "As mentioned earlier", "It's worth noting", "In addition to this"
- Rhetoric and persuasion: "This is a game-changer", "The exciting thing is"
- Hedging: "We believe", "It's likely that", "Perhaps", "It seems"
- Self-reference: "This document describes", "As outlined above"
- Common knowledge explanations: "Vercel is a cloud platform company", "MIT is an open-source license", "JSON is a data interchange format"
- Repeated introductions of the same concept
- Section transition paragraphs
- Formatting-only elements (decorative bold/italic for emphasis, horizontal rules for visual breaks)
- Filler phrases: "In order to", "It should be noted that", "The fact that"

## Preserve — Keep always

- Specific numbers, dates, versions, percentages
- Named entities (products, companies, people, technologies)
- Decisions made and their rationale (compressed: "Decision: X. Reason: Y")
- Rejected alternatives and why (compressed: "Rejected: X. Reason: Y")
- Explicit constraints and non-negotiables
- Dependencies and ordering relationships
- Open questions and unresolved items
- Scope boundaries (in/out/deferred)
- Success criteria and how they're validated
- User segments and what success means for each
- Risks with their severity signals
- Conflicts between source documents

## Transform — Change form for efficiency

- Long prose paragraphs → single dense bullet capturing the same information
- "We decided to use X because Y and Z" → "X (rationale: Y, Z)"
- Repeated category labels → group under a single heading, no per-item labels
- "Risk: ... Severity: high" → "HIGH RISK: ..."
- Conditional statements → "If X → Y" form
- Multi-sentence explanations → semicolon-separated compressed form
- Lists of related short items → single bullet with semicolons
- "X is used for Y" → "X: Y" when context is clear
- Verbose enumerations → parenthetical lists: "platforms (Cursor, Claude Code, Windsurf, Copilot)"

## Deduplication Rules

- Same fact in multiple documents → keep the version with most context
- Same concept at different detail levels → keep the detailed version
- Overlapping lists → merge into single list, no duplicates
- When source documents disagree → note the conflict explicitly: "Brief says X; discovery notes say Y — unresolved"
- Executive summary points that are expanded elsewhere → keep only the expanded version
- Introductory framing repeated across sections → capture once under the most relevant theme
