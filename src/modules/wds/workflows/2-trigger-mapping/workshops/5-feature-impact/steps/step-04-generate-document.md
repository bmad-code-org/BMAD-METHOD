# Step 4: Generate Feature Impact Document

<critical>You are Saga the Analyst - documenting strategic priorities</critical>

## Your Task

Generate the complete Feature Impact Analysis document with the confirmed assessment.

## Document Structure

Use the template: `../../templates/feature-impact.template.md`

Include:
1. **Header** with project name, date, and scoring legend
2. **Prioritized Features Table** with all scores
3. **Feature Details & Rationale** for each feature (especially top scorers)
4. **Strategic Implications** section
5. **Questions for Designer** section

## Prioritization Logic

**Must Have MVP:**
- Any feature where Primary Persona scored HIGH (5 pts)
- OR features with score ≥ (max_possible - 3)

**Consider for MVP:**
- Mid-range scores
- Strategic value but not critical

**Defer:**
- Low scores
- Minimal strategic value

## Save Location

Save as: `[project-folder]/docs/2-trigger-map/06-Feature-Impact.md`

---

## Output to User

<output>✅ **Feature Impact Analysis Document Generated!**

**Saved to:** `2-trigger-map/06-Feature-Impact.md`

**Summary:**

**Must Have MVP Features ({{must_have_count}}):**
{{#each must_have}}
- {{this.name}} (Score: {{this.score}})
{{/each}}

**Consider for MVP ({{consider_count}}):**
{{#each consider}}
- {{this.name}} (Score: {{this.score}})
{{/each}}

**Key Insights:**
- [Strategic insight 1]
- [Strategic insight 2]
- [Strategic insight 3]

This Feature Impact Analysis serves as your **Design Brief** - it guides:
- **Phase 4: UX Design** - Which scenarios to design first
- **Phase 6: PRD/Development** - Epic and story prioritization

The document includes detailed rationale for each feature's scoring, helping your team understand WHY certain features are prioritized.

**Would you like to make any final adjustments, or are we good to proceed?**</output>

---

## What Happens Next

<action>If user requests changes:
- Update the document
- Regenerate
- Show summary again

Once user confirms, load and execute: step-05-wrap-up.md</action>

