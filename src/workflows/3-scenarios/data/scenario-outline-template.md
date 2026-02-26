# Scenario Outline Template

**Used by:** step-05-outline-scenario.md
**Purpose:** Structure the answers from the 8-question scenario dialog into a complete scenario outline.

---

## Template

```markdown
# [NN]: [Persona Name]'s [Purpose]

**Project:** [project_name]
**Created:** [date]
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
[The key transaction — stated as user purpose, not feature name]

---

## Business Goal (Q2)

**Goal:** [Which specific business goal this serves]
**Objective:** [Objective reference from Trigger Map]

---

## User & Situation (Q3)

**Persona:** [Name] ([Priority level: Primary/Secondary/Tertiary])
**Situation:** [Real-life context — who they are, where they are, what's happening]

---

## Driving Forces (Q4)

**Hope:** [What they're hoping to find or achieve — one sentence]

**Worry:** [What they're afraid of or want to avoid — one sentence]

> CONSTRAINT: One sentence per component. Phrases, not paragraphs.

---

## Device & Starting Point (Q5 + Q6)

**Device:** [Mobile / Desktop / Tablet]
**Entry:** [How they actually arrive] — max 2 sentences

---

## Best Outcome (Q7)

**User Success:**
[Tangible, measurable outcome the user achieves]

**Business Success:**
[Specific, measurable result the business gets]

---

## Shortest Path (Q8)

[Linear sunshine path — NO branches, NO "if" statements. Minimum viable steps.]

1. **[Page Name]** — [What user sees/does/achieves at this step]
2. **[Page Name]** — [What user sees/does/achieves at this step]
3. **[Page Name]** — [What user sees/does/achieves at this step] ✓

---

## Trigger Map Connections

**Persona:** [Name] ([Priority level])

**Driving Forces Addressed:**
- ✅ **Want:** [Specific positive driver from Trigger Map]
- ❌ **Fear:** [Specific negative driver from Trigger Map]

**Business Goal:** [Specific goal + objective from Trigger Map]

---

## Scenario Steps

Steps are outlined one at a time after scenario creation. The first step is processed automatically.

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| [NN].1 | `[NN].1-[page-slug]/` | [Step purpose] | [Interaction that leads to next step] |
| [NN].2 | `[NN].2-[page-slug]/` | [Step purpose] | [Interaction that leads to next step] |
| [NN].3 | `[NN].3-[page-slug]/` | [Step purpose] | [Final — scenario success] ✓ |

**First step** ([NN].1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
```

---

## Quality Reminders

When filling this template, check:

**Transaction** — Is this a real user journey? Browsing content page-by-page counts. Comparing options counts. Any meaningful path through the site with intent.

**Driving Forces** — Can you FEEL the user's state? "Interested" is not enough. "Panicked because family vacation is at risk" is.

**Best Outcome** — "Get more customers" fails. "Reduce info calls by 40% by giving tourists the info they need online" passes.

**Shortest Path** — Count the steps. Can you remove any? Each step must justify its existence.

**Trigger Map** — Don't invent a user. Use the actual persona with their actual driving forces.

---

_Template for Step 05: Outline Scenario (8-Question Dialog)_
