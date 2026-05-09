**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Output Location:** `{planning_artifacts}`
**Paths:** Bare paths (e.g. `agents/foo.md`) resolve from the skill root.

# Stage 4: Draft & Review

**Goal:** Produce the executive product brief and run it through multiple review lenses to catch blind spots before the user sees the final version.

## Step 1: Draft the Executive Brief

Use the template at `{workflow.brief_template}` as a guide — adapt structure to fit the product's story.

**Writing principles:**
- **Executive audience** — persuasive, clear, concise. 1-2 pages.
- **Lead with the problem** — make the reader feel the pain before presenting the solution
- **Concrete over abstract** — specific examples, real scenarios, measurable outcomes
- **Confident voice** — this is a pitch, not a hedge
- Write in `{document_output_language}`

**Create the output document at:** `{planning_artifacts}/product-brief-{project_name}.md`

Include YAML frontmatter:
```yaml
---
title: "Product Brief: {project_name}"
status: "draft"
created: "{timestamp}"
updated: "{timestamp}"
inputs: [list of input files used]
---
```

## Step 2: Fan Out Review Subagents

Before showing the draft to the user, run it through multiple review lenses in parallel.

**Launch in parallel:**

1. **Skeptic Reviewer** (`agents/skeptic-reviewer.md`) — "What's missing? What assumptions are untested? What could go wrong? Where is the brief vague or hand-wavy?"

2. **Opportunity Reviewer** (`agents/opportunity-reviewer.md`) — "What adjacent value propositions are being missed? What market angles or partnerships could strengthen this? What's underemphasized?"

3. **Contextual Reviewer** — You (the main agent) pick the most useful third lens based on THIS specific product. Choose the lens that addresses the SINGLE BIGGEST RISK that the skeptic and opportunity reviewers won't naturally catch. Examples:
   - For healthtech: "Regulatory and compliance risk reviewer"
   - For devtools: "Developer experience and adoption friction critic"
   - For marketplace: "Network effects and chicken-and-egg problem analyst"
   - For enterprise: "Procurement and organizational change management reviewer"
   - **When domain is unclear, default to:** "Go-to-market and launch risk reviewer" — examines distribution, pricing, and first-customer acquisition. Almost always valuable, frequently missed.
   Describe the lens, run the review yourself inline.

### Graceful Degradation

If subagents are unavailable:
- Perform all three review passes yourself, sequentially
- Apply each lens deliberately — don't blend them into one generic review
- The quality of review matters more than the parallelism

## Step 3: Integrate Review Insights

After all reviews complete:

1. **Triage findings** — group by theme, remove duplicates
2. **Apply non-controversial improvements** directly to the draft (obvious gaps, unclear language, missing specifics)
3. **Flag substantive suggestions** that need user input (strategic choices, scope questions, market positioning decisions)

## Step 4: Present to User

**Headless mode:** Skip to `prompts/finalize.md` — no user interaction. Save the improved draft directly.

**Yolo and Guided modes:**

Present the draft brief to the user. Then share the reviewer insights:

"Here's your product brief draft. Before we finalize, my review panel surfaced some things worth considering:

**[Grouped reviewer findings — only the substantive ones that need user input]**

What do you think? Any changes you'd like to make?"

Present reviewer findings with brief rationale, then offer: "Want me to dig into any of these, or are you ready to make your revisions?"

**Iterate** as long as the user wants to refine. Use the "anything else, or are we happy with this?" soft gate.

## Stage Complete

This stage is complete when: (a) the draft has been reviewed by all three lenses and improvements integrated, AND either (autonomous) save and route directly, or (guided/yolo) the user is satisfied. Route to `prompts/finalize.md`.
