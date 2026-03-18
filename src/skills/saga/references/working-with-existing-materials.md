# Working with Existing Materials

**Purpose:** Guide for incorporating existing materials into the PB workflow. When users provide documentation, Saga MUST analyze it first, present findings for confirmation, and only ask questions about gaps.

---

## Core Principles

1. **Analyze first, ask second** — Read and extract before any questions
2. **Present, don't pocket** — Show the user what you found, structured by topic
3. **Confirm step by step** — Each extracted insight gets a yes/no/refine from the user
4. **Only ask about gaps** — If the answer is in the document, don't ask the question
5. **Stay casual** — No judgment about what exists or doesn't

---

## Checking for Materials

**Phase 0 asks:** "Do you have existing materials?" (website, brief, guidelines, research)

**Stored in outline:**
```yaml
existing_materials:
  has_materials: true/false
  website: "[URL]"
  previous_brief: "[path]"
  brand_guidelines: "[path]"
  research: "[path]"
  context_notes: "[brief notes]"
```

**If materials exist:** Read them COMPLETELY before starting PB steps. Then run the Material Analysis Phase.

---

## Material Analysis Phase (MANDATORY when materials exist)

This phase runs ONCE, after Step 1 (Init) and BEFORE Step 2 (Vision). It replaces the old "reference and ask" pattern with "analyze, present, confirm, then fill gaps."

### Step A: Read and Extract

Read every provided document completely. Extract information into these categories:

| Category | What to look for |
|----------|-----------------|
| **Vision** | Purpose, mission, "why this exists", aspirational statements |
| **Positioning** | Target market, differentiators, alternatives, category |
| **Business Model** | Revenue, pricing, monetization, cost structure |
| **Target Users** | User types, personas, segments, pain points |
| **Product Concept** | Core features, key interactions, product shape |
| **Success Criteria** | KPIs, metrics, milestones, definition of done |
| **Competitive Landscape** | Named competitors, alternatives, market gaps |
| **Constraints** | Technical limits, budget, timeline, team, regulations |
| **Tone & Brand** | Voice, personality, visual direction, existing brand |

For each category, note:
- **Complete** — enough information to draft this section
- **Partial** — some information, needs clarification or expansion
- **Missing** — not covered in the materials

### Step B: Present the Analysis

Present your findings to the user, organized by category. Use this pattern:

```
I've read through your materials. Here's what I found — let me walk you through
it section by section so you can confirm, correct, or add to each one.

**Vision**
From your [document name]: "[relevant quote or paraphrase]"
My interpretation: [your synthesis in one sentence]
→ Does this capture it? Anything that's evolved?

**Positioning**
From your [document name]: "[relevant quote or paraphrase]"
My interpretation: [your synthesis]
→ Still the direction?

[...continue for each category that has content...]
```

**Rules for presentation:**
- Present ONE category at a time. Wait for user response before moving to the next.
- Quote or closely paraphrase the source material so the user can see what you're working from
- Add your interpretation — this is where your strategic thinking adds value
- Ask for confirmation explicitly: ✓ confirm / ✗ reject / ~ refine
- If the user refines, capture the refinement before moving on

### Step C: Identify Gaps

After all extracted categories are confirmed, present the gaps:

```
That covers what I found in your materials. Here's what we still need to explore:

- [Gap 1]: Not covered in your documents
- [Gap 2]: Mentioned briefly but needs more depth
- [Gap 3]: Implied but not explicit

These are the topics I'll focus our conversation on.
The rest is already solid from your materials.
```

### Step D: Adjusted Workflow Plan

Tell the user which steps will be quick confirmations vs. full conversations:

```
Here's how the rest of the workflow will go:

Quick confirmation (already covered):
- Vision ✓ — confirmed from your materials
- Target Users ✓ — confirmed from your materials

Needs conversation (gaps to fill):
- Competitive Landscape — not covered yet
- Success Criteria — mentioned but needs specifics
- Constraints — partially covered, need technical details

This should be much faster since you've already done a lot of the thinking.
```

---

## Adapted Step Execution (after Material Analysis)

Once the Material Analysis Phase is complete, each subsequent step runs in one of two modes:

### Confirmation Mode (category = Complete)

The step's content was already extracted and confirmed during the analysis phase. The step becomes a quick pass:

1. Reference the confirmed content: "We already confirmed your vision as [synthesis]. I've documented it."
2. Ask if anything to add: "Anything else before we move on?"
3. If nothing: document and advance
4. If additions: capture them, update, confirm, advance

**This replaces the full exploratory conversation.** Do NOT re-ask questions the user already answered during the analysis phase.

### Gap-Filling Mode (category = Partial or Missing)

The step needs real conversation, but scoped to what's missing:

1. Reference what IS known: "From your materials, I know [X]. What I'm missing is [Y]."
2. Explore only the gap — do not re-cover confirmed ground
3. Synthesize the gap content with the confirmed content
4. Present the combined picture for confirmation

### CRITICAL RULE

**Never re-ask a question whose answer was already confirmed in the Material Analysis Phase.** If the user confirmed their vision during analysis, Step 2 (Vision) should take 30 seconds, not 10 minutes. The exploratory conversation pattern is for discovery — when materials exist, the discovery already happened.

---

## Step-by-Step Application

**Apply to all conversational steps** (2, 3, 5, 7, 7a, 8, 9, 10, 11, 12):

| Step | No Materials | With Materials (Confirmed) | With Materials (Gap) |
|------|-------------|---------------------------|---------------------|
| Vision (2) | Full exploration | "Confirmed as [X]. Anything to add?" | "You mentioned [X] but I need [Y]." |
| Positioning (3) | Full exploration | "Confirmed as [X]. Anything to add?" | "Target is clear, but differentiator needs work." |
| Business Model (5) | Full exploration | "Confirmed as [X]. Anything to add?" | "Revenue model clear, pricing needs detail." |
| Users (7) | Full exploration | "Confirmed as [X]. Anything to add?" | "Primary users clear, need to explore secondary." |
| Concept (7a) | Full exploration | "Confirmed as [X]. Anything to add?" | "Core concept clear, need interaction model." |
| Success (8) | Full exploration | "Confirmed as [X]. Anything to add?" | "Goals clear, need measurable KPIs." |

---

## Dialog Documentation

When materials exist, capture:

1. **What existed:** Quote/summarize existing material
2. **Analysis presented:** What Saga extracted and interpreted
3. **User response:** Confirmed / Refined / Rejected
4. **Gaps identified:** What was missing
5. **Gap conversation:** Discovery for missing pieces only
6. **Synthesis:** Final version (confirmed material + gap fills + refinements)

**Template:**

```markdown
**Source material:** [Document name, relevant section]

**Saga's extraction:**
> [Quote from material]
Interpretation: [Saga's synthesis]

**User response:** [Confirmed ✓ / Refined ~ / Rejected ✗]
[If refined/rejected: what changed and why]

**Gaps explored:**
- [Gap topic]: [Discovery conversation summary]

**Final synthesis:** [Confirmed content + gap fills integrated]

**User confirmation:** [Confirmed / Corrected]
```

---

## Common Scenarios

**Scenario: Comprehensive PRD provided**
1. Read it thoroughly — this is the primary source
2. Run full Material Analysis Phase (Steps A-D)
3. Most categories will be Complete — workflow becomes mostly confirmations
4. Focus conversation on strategic gaps (positioning nuance, success metrics, constraints)
5. Result: 15-minute workflow instead of 60-minute workflow

**Scenario: Previous brief exists**
1. Read it thoroughly
2. Run Material Analysis Phase
3. Identify what's solid vs outdated vs missing
4. Present: "Your brief from [date] covers X, Y, Z well. Has anything evolved?"
5. Focus on evolution and gaps

**Scenario: Existing website**
1. Review site (if URL in materials)
2. Extract positioning, tone, target audience signals
3. Present observations: "Your site positions you as [X], targets [Y], tone is [Z]"
4. Use as baseline for "what's changing?"

**Scenario: Brand guidelines exist**
1. Read guidelines (voice, values, identity)
2. Extract: personality, tone, visual direction, constraints
3. Present: "Your brand guidelines define [X]. These carry forward unless you say otherwise."
4. Mark brand-related categories as Complete
5. Focus on how brand translates to this specific product

**Scenario: Research / user interviews exist**
1. Review findings thoroughly
2. Extract: user pain points, needs, behaviors, quotes
3. Present: "Your research identified these user patterns: [list]"
4. Validate currency: "Is this still what you hear from users?"
5. Use as foundation for Target Users and Success Criteria steps

---

## What NOT to Do

- Say "thank you" and move on as if nothing was provided
- Pocket the information silently and only reference it in passing
- Ask questions whose answers are clearly in the provided documents
- Make the user repeat or re-explain documented work
- Assume everything is still current without asking (validate!)
- Judge quality of existing work
- Skip the Material Analysis Phase and go straight to step-by-step questions

---

## Benefits

- Efficiency — 15 minutes instead of 60 when materials are comprehensive
- Respect — Acknowledges the thinking already done
- Trust — User sees that Saga actually read and understood their materials
- Focus — Conversation time spent on real gaps, not re-discovery
- Quality — Final brief builds on confirmed foundation, not fresh guesses

---

## Quick Reference

**Check:** `existing_materials.has_materials` in outline

**If true — run Material Analysis Phase:**
1. Read ALL materials completely
2. Extract information into categories (vision, positioning, users, etc.)
3. Present findings ONE category at a time, wait for confirmation
4. Identify gaps after all categories confirmed
5. Tell user which steps will be quick vs. need conversation
6. Execute steps in Confirmation Mode or Gap-Filling Mode accordingly

**If false — run standard discovery:**
1. Full exploratory conversation per step
2. Standard pattern: Open → Explore → Reflect → Synthesize → Confirm

---

**The golden rule:** If the user gave you a document, they expect you to USE it — not just acknowledge it. Analyze it, show them what you found, and only ask about what's missing.
