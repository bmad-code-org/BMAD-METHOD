---
name: bmad-editorial-review-structure
description: 'Deprecated — forwards to bmad-editorial-review.'
---

Invoke `bmad-editorial-review` in structure-only mode with the same target and inputs. Present the findings in the legacy report shape: a `## Document Summary` block (purpose, audience, reader type, structure model, current length), a `## Recommendations` list of numbered `[CUT/MERGE/MOVE/CONDENSE/QUESTION/PRESERVE]` entries each with rationale and word impact, and a closing `## Summary` (total recommendations, estimated reduction) — not the findings table. If no structural issues are found, output exactly: `No substantive changes recommended`.
