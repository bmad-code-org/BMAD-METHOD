---
name: 'step-07-holistic-analysis'
description: 'Analyze workflow flow, goal alignment, and meta-workflow failures'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-07-holistic-analysis.md'
nextStepFile: '{workflow_path}/steps/step-08-generate-report.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'
targetWorkflowFile: '{target_workflow_path}'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
intentSpectrum: '{project-root}/_bmad/bmb/docs/workflows/intent-vs-prescriptive-spectrum.md'
---

# Step 7: Holistic Workflow Analysis

## STEP GOAL:

Perform comprehensive workflow analysis including flow validation, goal alignment assessment, optimization opportunities, and meta-workflow failure identification to provide complete compliance picture.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a compliance validator and quality assurance specialist
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring holistic workflow analysis and optimization expertise
- ✅ User brings their workflow and needs comprehensive assessment

### Step-Specific Rules:

- 🎯 Focus on holistic analysis beyond template compliance
- 🚫 FORBIDDEN to skip flow validation or optimization assessment
- 💬 Approach: Systematic end-to-end workflow analysis
- 📋 Identify meta-workflow failures and improvement opportunities

## EXECUTION PROTOCOLS:

- 🎯 Analyze complete workflow flow from start to finish
- 💾 Validate goal alignment and optimization opportunities
- 📖 Identify what meta-workflows (create/edit) should have caught
- 🚫 FORBIDDEN to provide superficial analysis without specific recommendations

## CONTEXT BOUNDARIES:

- Available context: Complete workflow analysis from previous phases
- Focus: Holistic workflow optimization and meta-process improvement
- Limits: Analysis phase only, report generation comes next
- Dependencies: Completed workflow.md and step validation phases

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Holistic Analysis

"Beginning **Phase 3: Holistic Workflow Analysis**
Target: `{target_workflow_name}`

Analyzing workflow from multiple perspectives:

- Flow and completion validation
- Goal alignment assessment
- Optimization opportunities
- Meta-workflow failure analysis..."

### 2. Workflow Flow Validation

**A. Completion Path Analysis:**
Trace all possible paths through the workflow:

"**Flow Validation Analysis:**"

- Does every step have a clear continuation path?
- Do all menu options have valid destinations?
- Are there any orphaned steps or dead ends?
- Can the workflow always reach a successful completion?

**Document issues:**

- **Critical:** Steps without completion paths
- **Major:** Inconsistent menu handling or broken references
- **Minor:** Inefficient flow patterns

**B. Sequential Logic Validation:**
Check step sequence logic:

- Does step order make logical sense?
- Are dependencies properly structured?
- Is information flow between steps optimal?
- Are there unnecessary steps or missing functionality?

### 3. Goal Alignment Assessment

**A. Stated Goal Analysis:**
Compare workflow.md goal with actual implementation:

"**Goal Alignment Analysis:**"

- **Stated Goal:** [quote from workflow.md]
- **Actual Implementation:** [what the workflow actually does]
- **Alignment Score:** [percentage match]
- **Gap Analysis:** [specific misalignments]

**B. User Experience Assessment:**
Evaluate workflow from user perspective:

- Is the workflow intuitive and easy to follow?
- Are user inputs appropriately requested?
- Is feedback clear and timely?
- Is the workflow efficient for the stated purpose?

### 4. Optimization Opportunities

**A. Efficiency Analysis:**
"**Optimization Assessment:**"

- **Step Consolidation:** Could any steps be combined?
- **Parallel Processing:** Could any operations run simultaneously?
- **JIT Loading:** Are references loaded optimally?
- **User Experience:** Where could user experience be improved?

**B. Architecture Improvements:**

- **Template Usage:** Are templates used optimally?
- **Output Management:** Are outputs appropriate and necessary?
- **Error Handling:** Is error handling comprehensive?
- **Extensibility:** Can the workflow be easily extended?

### 5. Meta-Workflow Failure Analysis

**CRITICAL SECTION:** Identify what create/edit workflows should have caught

"**Meta-Workflow Failure Analysis:**
**Issues that should have been prevented by create-workflow/edit-workflow:**"

**A. Create-Workflow Failures:**

- Missing frontmatter fields that should be validated during creation
- Incorrect path variable formats that should be standardized
- Template usage violations that should be caught during design
- Menu pattern deviations that should be enforced during build
- Workflow type mismatches that should be detected during planning

**B. Edit-Workflow Failures (if applicable):**

- Introduced compliance violations during editing
- Breaking template structure during modifications
- Inconsistent changes that weren't validated
- Missing updates to dependent files/references

**C. Systemic Process Improvements:**
"**Recommended Improvements for Meta-Workflows:**"

**For create-workflow:**

- Add validation step for frontmatter completeness
- Implement path variable format checking
- Add workflow type template usage validation
- Include menu pattern enforcement
- Add flow validation before finalization
- **Add Intent vs Prescriptive spectrum selection early in design process**
- **Include spectrum education for users during workflow creation**
- **Validate spectrum consistency throughout workflow design**

**For edit-workflow:**

- Add compliance validation before applying changes
- Include template structure checking during edits
- Implement cross-file consistency validation
- Add regression testing for compliance
- **Validate that edits maintain intended spectrum position**
- **Check for unintended spectrum shifts during modifications**

### 6. Severity-Based Recommendations

"**Strategic Recommendations by Priority:**"

**IMMEDIATE (Critical) - Must Fix for Workflow to Function:**

1. [Most critical issue with specific fix]
2. [Second critical issue with specific fix]

**HIGH PRIORITY (Major) - Significantly Impacts Quality:**

1. [Major issue affecting maintainability]
2. [Major issue affecting user experience]

**MEDIUM PRIORITY (Minor) - Standards Compliance:**

1. [Minor template compliance issue]
2. [Cosmetic or consistency improvements]

### 7. Continuation Confirmation

"**Phase 5 Complete:** Holistic analysis finished

- **Flow Validation:** [summary findings]
- **Goal Alignment:** [alignment percentage and key gaps]
- **Optimization Opportunities:** [number key improvements identified]
- **Meta-Workflow Failures:** [number issues that should have been prevented]

**Ready for Phase 8:** Comprehensive compliance report generation

- All findings compiled into structured report
- Severity-ranked violation list
- Specific fix recommendations
- Meta-workflow improvement suggestions

**Select an Option:** [C] Continue to Report Generation [X] Exit"

## Menu Handling Logic:

- IF C: Save holistic analysis findings to report, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF X: Save current findings and end with guidance for resuming
- IF Any other comments or queries: respond and redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [holistic analysis complete with meta-workflow failures identified], will you then load and read fully `{nextStepFile}` to execute and begin comprehensive report generation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete workflow flow validation with all paths traced
- Goal alignment assessment with specific gap analysis
- Optimization opportunities identified with prioritized recommendations
- Meta-workflow failures documented with improvement suggestions
- Strategic recommendations provided by severity priority
- User ready for comprehensive report generation

### ❌ SYSTEM FAILURE:

- Skipping flow validation or goal alignment analysis
- Not identifying meta-workflow failure opportunities
- Failing to provide specific, actionable recommendations
- Missing strategic prioritization of improvements
- Providing superficial analysis without depth

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
