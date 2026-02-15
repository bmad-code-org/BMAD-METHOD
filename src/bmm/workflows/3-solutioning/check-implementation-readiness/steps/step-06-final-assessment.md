---
name: 'step-06-final-assessment'
description: 'Compile final assessment and polish the readiness report'

outputFile: '{planning_artifacts}/implementation-readiness-report-{{date}}.md'
---

# Step 6: Final Assessment

## STEP GOAL:

To provide a comprehensive summary of all findings and give the report a final polish, ensuring clear recommendations and overall readiness status.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📖 You are at the final step - complete the assessment
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are delivering the FINAL ASSESSMENT
- ✅ Your findings are objective and backed by evidence
- ✅ Provide clear, actionable recommendations
- ✅ Success is measured by value of findings

### Step-Specific Rules:

- 🎯 Compile and summarize all findings
- 🚫 Don't soften the message - be direct
- 💬 Provide specific examples for problems
- 🚪 Add final section to the report

## EXECUTION PROTOCOLS:

- 🎯 Review all findings from previous steps
- 💾 Add summary and recommendations
- 📖 Determine overall readiness status
- 🚫 Complete and present final report

## FINAL ASSESSMENT PROCESS:

### 1. Initialize Final Assessment

"Completing **Final Assessment**.

I will now:

1. Review all findings from previous steps
2. Provide a comprehensive summary
3. Add specific recommendations
4. Determine overall readiness status"

### 2. Review Previous Findings

Check the {outputFile} for sections added by previous steps:

- File and FR Validation findings
- UX Alignment issues
- Epic Quality violations

### 2b. Enterprise Track Additional Checks (if applicable)

If the project is Enterprise track (check PRD frontmatter for `track: enterprise`), perform these additional validations:

**StRS Completeness:**
- [ ] StRS document exists and follows ISO 29148 Clause 7 structure
- [ ] All 7 major sections present (Introduction, References, Business Mgmt, Operational, User, System Concept, Constraints)
- [ ] StRS status is at least 'review' (check frontmatter)

**SyRS Completeness:**
- [ ] SyRS document exists and follows ISO 29148 Clause 8 structure
- [ ] System functional requirements mapped from PRD
- [ ] System interfaces defined
- [ ] Verification plan for each system requirement
- [ ] SyRS status is at least 'review' (check frontmatter)

**RTM Integrity:**
- [ ] RTM document exists with bidirectional traceability
- [ ] StRS → SyRS traceability present (forward coverage > 90%)
- [ ] SyRS → PRD traceability present (forward coverage > 90%)
- [ ] PRD → Stories traceability present (forward coverage > 95%)
- [ ] No orphan requirements at any level
- [ ] All requirement statuses documented

**Verification Method Assignment:**
- [ ] Every FR in PRD has a verification method assigned (Inspection / Analysis / Demonstration / Test)
- [ ] Every SyRS requirement has a verification method assigned
- [ ] Verification plan section exists in PRD

**Cross-Document Consistency:**
- [ ] StRS scope aligns with PRD scope
- [ ] SyRS interfaces match Architecture interfaces
- [ ] No terminology contradictions across documents
- [ ] Requirement priorities consistent across levels

**Baseline Status:**
- [ ] All requirement documents have version numbers in frontmatter
- [ ] Baseline version established (or ready to establish)
- [ ] Change history documented in each requirement document

Add Enterprise assessment findings to the report under a dedicated "Enterprise Track Assessment" section.

### 3. Add Final Assessment Section

Append to {outputFile}:

```markdown
## Summary and Recommendations

### Overall Readiness Status

[READY/NEEDS WORK/NOT READY]

### Critical Issues Requiring Immediate Action

[List most critical issues that must be addressed]

### Recommended Next Steps

1. [Specific action item 1]
2. [Specific action item 2]
3. [Specific action item 3]

### Final Note

This assessment identified [X] issues across [Y] categories. Address the critical issues before proceeding to implementation. These findings can be used to improve the artifacts or you may choose to proceed as-is.
```

### 4. Complete the Report

- Ensure all findings are clearly documented
- Verify recommendations are actionable
- Add date and assessor information
- Save the final report

### 5. Present Completion

Display:
"**Implementation Readiness Assessment Complete**

Report generated: {outputFile}

The assessment found [number] issues requiring attention. Review the detailed report for specific findings and recommendations."

## WORKFLOW COMPLETE

The implementation readiness workflow is now complete. The report contains all findings and recommendations for the user to consider.

Implementation Readiness complete. Read fully and follow: `_bmad/core/tasks/help.md` with argument `implementation readiness`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All findings compiled and summarized
- Clear recommendations provided
- Readiness status determined
- Final report saved

### ❌ SYSTEM FAILURE:

- Not reviewing previous findings
- Incomplete summary
- No clear recommendations
