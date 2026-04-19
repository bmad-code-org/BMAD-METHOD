**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Output Location:** `{planning_artifacts}`

# Stage 5: Finalize

**Goal:** Save the polished brief, offer the LLM distillate, and point the user forward.

## Step 1: Polish and Save

Update the product brief document at `{planning_artifacts}/product-brief-{project_name}.md`:
- Update frontmatter `status` to `"complete"`
- Update `updated` timestamp
- Ensure formatting is clean and consistent
- Confirm the document reads well as a standalone 1-2 page executive summary

## Step 2: Offer the Distillate

Throughout the discovery process, you likely captured detail that doesn't belong in a 1-2 page executive summary but is valuable for downstream work — requirements hints, platform preferences, rejected ideas, technical constraints, detailed user scenarios, competitive deep-dives, etc.

**Ask the user:**
"Your product brief is complete. During our conversation, I captured additional detail that goes beyond the executive summary — things like [mention 2-3 specific examples of overflow you captured]. Would you like me to create a detail pack for PRD creation? It distills all that extra context into a concise, structured format optimized for the next phase."

**If yes, create the distillate** at `{planning_artifacts}/product-brief-{project_name}-distillate.md`:

```yaml
---
title: "Product Brief Distillate: {project_name}"
type: llm-distillate
source: "product-brief-{project_name}.md"
created: "{timestamp}"
purpose: "Token-efficient context for downstream PRD creation"
---
```

**Distillate content principles:**
- Dense bullet points, not prose
- Each bullet carries enough context to be understood standalone (don't assume the reader has the full brief loaded)
- Group by theme, not by when it was mentioned
- Include:
  - **Rejected ideas** — so downstream workflows don't re-propose them, with brief rationale
  - **Requirements hints** — anything the user mentioned that sounds like a requirement
  - **Technical context** — platforms, integrations, constraints, preferences
  - **Detailed user scenarios** — richer than what fits in the exec summary
  - **Competitive intelligence** — specifics from web research worth preserving
  - **Open questions** — things surfaced but not resolved during discovery
  - **Scope signals** — what the user indicated is in/out/maybe for MVP
- Token-conscious: be concise, but give enough context per bullet so an LLM reading this later understands WHY each point matters

**Headless mode:** Always create the distillate automatically — unless the session was too brief to capture meaningful overflow (in that case, note this in the completion output instead of creating an empty file).

## Step 3: Present Completion

"Your product brief for {project_name} is complete!

**Executive Brief:** `{planning_artifacts}/product-brief-{project_name}.md`
[If distillate created:] **Detail Pack:** `{planning_artifacts}/product-brief-{project_name}-distillate.md`

**Recommended next step:** Use the product brief (and detail pack) as input for PRD creation — tell your assistant 'create a PRD' and point it to these files."
[If distillate created:] "The detail pack contains all the overflow context (requirements hints, rejected ideas, technical constraints) specifically structured for the PRD workflow to consume."

**Headless mode:** Output the file paths as structured JSON and exit:
```json
{
  "status": "complete",
  "brief": "{planning_artifacts}/product-brief-{project_name}.md",
  "distillate": "{path or null}",
  "confidence": "high|medium|low",
  "open_questions": ["any unresolved items"]
}
```

## Stage Complete

This is the terminal stage. After delivering the completion message and file paths, the workflow is done. If the user requests further revisions, loop back to `draft-and-review.md`. Otherwise, exit.
