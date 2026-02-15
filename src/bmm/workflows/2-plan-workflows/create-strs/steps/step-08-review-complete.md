---
name: 'step-08-review-complete'
description: 'Final quality review of the complete StRS document against ISO 29148 Clause 7 requirements'

# File References
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'
checklistFile: '{project-root}/_bmad/bmm/workflows/2-plan-workflows/create-strs/checklist.md'
---

# Step 8: Final Review & Completion

**Progress: Step 8 of 8** - Final Step

## MANDATORY EXECUTION RULES (READ FIRST):

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- 🎯 This is a REVIEW step - focus on validation, not content generation
- 📋 Use the quality checklist to systematically verify document completeness

## EXECUTION PROTOCOLS:

- 🎯 Perform systematic review against ISO 29148 Clause 7
- 📖 Load and use the quality checklist
- 💾 Update document frontmatter to mark completion
- ✅ Present review findings to user for final approval

## REVIEW SEQUENCE:

### 1. Load Quality Checklist

Read the quality checklist from: `{checklistFile}`

### 2. Systematic Document Review

Review the complete StRS document against the checklist. For each item:

**Check:**
- Is the section present?
- Is the content substantive (not placeholder text)?
- Does it address the ISO 29148 requirement?
- Is the content consistent with other sections?

### 3. Cross-Section Consistency Check

Verify consistency across the entire document:

**Consistency Checks:**
- Stakeholder names used consistently throughout
- Business objectives align with operational requirements
- User profiles match the actors in operational scenarios
- Constraints don't contradict other requirements
- All abbreviations in glossary
- All referenced documents in references section

### 4. Completeness Assessment

Evaluate overall document completeness:

**Scoring:**
- **Complete**: All ISO 29148 Clause 7 sections present with substantive content
- **Mostly Complete**: 1-2 minor sections missing or thin
- **Incomplete**: Major sections missing or substantial gaps

### 5. Present Review Results

Present findings to the user:

**Review Report:**
"I've completed the ISO 29148 Clause 7 quality review of your StRS.

**Overall Assessment:** [Complete / Mostly Complete / Incomplete]

**Section Coverage:**
| Section | Status | Notes |
|---------|--------|-------|
| 1. Introduction & Stakeholders | [✅/⚠️/❌] | [Notes] |
| 2. References | [✅/⚠️/❌] | [Notes] |
| 3. Business Management Requirements | [✅/⚠️/❌] | [Notes] |
| 4. Business Operational Requirements | [✅/⚠️/❌] | [Notes] |
| 5. User Requirements | [✅/⚠️/❌] | [Notes] |
| 6. Proposed System Concept | [✅/⚠️/❌] | [Notes] |
| 7. Project Constraints | [✅/⚠️/❌] | [Notes] |
| 8. Appendices | [✅/⚠️/❌] | [Notes] |

**Consistency Issues Found:** [List any issues or "None"]

**Recommendations:** [Any suggestions for improvement]

**Next Steps:**
This StRS is now ready to serve as input for:
1. **PRD/SRS Creation** (John - PM) - Translates stakeholder needs into software requirements
2. **RTM Creation** - Links StRS requirements to downstream documents"

### 6. Finalize Document

**Frontmatter Updates:**
- Add this step name to `stepsCompleted` array
- Set `status: 'review'` (user should approve to set 'approved')
- Set `version: '1.0'`

**Present Completion Menu:**

Display: "**StRS creation is complete!** Would you like to:
- [R] Review and address any issues found
- [F] Finalize the StRS as-is (status → review)
- [A] Approve the StRS (status → approved)"

#### Menu Handling Logic:
- IF R: Go back to the relevant section and iterate, then return to this review
- IF F: Update frontmatter with `status: 'review'`, report completion
- IF A: Update frontmatter with `status: 'approved'`, report completion

### 7. Completion Report

After finalization:

"**StRS Complete!** 🎯

**Document:** `{outputFile}`
**Status:** [review / approved]
**ISO 29148 Clause 7 Coverage:** [Complete / Mostly Complete]

**This StRS feeds into:**
- PRD/SRS creation (use [CP] Create PRD with John)
- Requirements Traceability Matrix (use [RT] with John)
- Architecture decisions (use [CA] with Winston)

**Enterprise Track Next Step:**
Consider running the Quality Gate check before proceeding to PRD creation."

## SUCCESS METRICS:

✅ All ISO 29148 Clause 7 sections reviewed against checklist
✅ Cross-section consistency verified
✅ Completeness assessment provided with clear scoring
✅ Review findings presented clearly to user
✅ Document frontmatter updated with final status
✅ Next steps and downstream workflow guidance provided

## FAILURE MODES:

❌ Not using the quality checklist for systematic review
❌ Marking document complete without addressing critical gaps
❌ Not checking cross-section consistency
❌ Not providing clear next-step guidance
❌ Not updating document status in frontmatter

**Master Rule:** This review must be thorough and honest. Do NOT gloss over issues to appear complete.
