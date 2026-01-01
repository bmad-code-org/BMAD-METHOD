---
name: 'step-05-intent-spectrum-validation'
description: 'Dedicated analysis and validation of intent vs prescriptive spectrum positioning'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-05-intent-spectrum-validation.md'
nextStepFile: '{workflow_path}/steps/step-06-web-subprocess-validation.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'
targetWorkflowPath: '{target_workflow_path}'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
intentSpectrum: '{project-root}/_bmad/bmb/docs/workflows/intent-vs-prescriptive-spectrum.md'
---

# Step 5: Intent vs Prescriptive Spectrum Validation

## STEP GOAL:

Analyze the workflow's position on the intent vs prescriptive spectrum, provide expert assessment, and confirm with user whether the current positioning is appropriate or needs adjustment.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a compliance validator and design philosophy specialist
- ✅ If you already have been given a name, communication_style, and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in intent vs prescriptive design principles
- ✅ User brings their workflow and needs guidance on spectrum positioning

### Step-Specific Rules:

- 🎯 Focus only on spectrum analysis and user confirmation
- 🚫 FORBIDDEN to make spectrum decisions without user input
- 💬 Approach: Educational, analytical, and collaborative
- 📋 Ensure user understands spectrum implications before confirming

## EXECUTION PROTOCOLS:

- 🎯 Analyze workflow's current spectrum position based on all previous findings
- 💾 Provide expert assessment with specific examples and reasoning
- 📖 Educate user on spectrum implications for their workflow type
- 🚫 FORBIDDEN to proceed without user confirmation of spectrum position

## CONTEXT BOUNDARIES:

- Available context: Complete analysis from workflow, step, and file validation phases
- Focus: Intent vs prescriptive spectrum analysis and user confirmation
- Limits: Spectrum analysis only, holistic workflow analysis comes next
- Dependencies: Successful completion of file size and formatting validation

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Spectrum Analysis

"Beginning **Intent vs Prescriptive Spectrum Validation**
Target: `{target_workflow_name}`

**Reference Standard:** Analysis based on `{intentSpectrum}`

This step will help ensure your workflow's approach to LLM guidance is intentional and appropriate for its purpose..."

### 2. Spectrum Position Analysis

**A. Current Position Assessment:**
Based on analysis of workflow.md, all step files, and implementation patterns:

"**Current Spectrum Analysis:**
Based on my review of your workflow, I assess its current position as:

**[Highly Intent-Based / Balanced Middle / Highly Prescriptive]**"

**B. Evidence-Based Reasoning:**
Provide specific evidence from the workflow analysis:

"**Assessment Evidence:**

- **Instruction Style:** [Examples of intent-based vs prescriptive instructions found]
- **User Interaction:** [How user conversations are structured]
- **LLM Freedom:** [Level of creative adaptation allowed]
- **Consistency Needs:** [Workflow requirements for consistency vs creativity]
- **Risk Factors:** [Any compliance, safety, or regulatory considerations]"

**C. Workflow Type Analysis:**
"**Workflow Type Analysis:**

- **Primary Purpose:** {workflow's main goal}
- **User Expectations:** {What users likely expect from this workflow}
- **Success Factors:** {What makes this workflow successful}
- **Risk Level:** {Compliance, safety, or risk considerations}"

### 3. Recommended Spectrum Position

**A. Expert Recommendation:**
"**My Professional Recommendation:**
Based on the workflow's purpose, user needs, and implementation, I recommend positioning this workflow as:

**[Highly Intent-Based / Balanced Middle / Highly Prescriptive]**"

**B. Recommendation Rationale:**
"**Reasoning for Recommendation:**

- **Purpose Alignment:** {Why this position best serves the workflow's goals}
- **User Experience:** {How this positioning enhances user interaction}
- **Risk Management:** {How this position addresses any compliance or safety needs}
- **Success Optimization:** {Why this approach will lead to better outcomes}"

**C. Specific Examples:**
Provide concrete examples of how the recommended position would look:

"**Examples at Recommended Position:**
**Intent-Based Example:** "Help users discover their creative potential through..."
**Prescriptive Example:** "Ask exactly: 'Have you experienced any of the following...'"

**Current State Comparison:**
**Current Instructions Found:** [Examples from actual workflow]
**Recommended Instructions:** [How they could be improved]"

### 4. Spectrum Education and Implications

**A. Explain Spectrum Implications:**
"**Understanding Your Spectrum Choice:**

**If Intent-Based:** Your workflow will be more creative, adaptive, and personalized. Users will have unique experiences, but interactions will be less predictable.

**If Prescriptive:** Your workflow will be consistent, controlled, and predictable. Every user will have similar experiences, which is ideal for compliance or standardization.

**If Balanced:** Your workflow will provide professional expertise with some adaptation, offering consistent quality with personalized application."

**B. Context-Specific Guidance:**
"**For Your Specific Workflow Type:**
{Provide tailored guidance based on whether it's creative, professional, compliance, technical, etc.}"

### 5. User Confirmation and Decision

**A. Present Findings and Recommendation:**
"**Spectrum Analysis Summary:**

**Current Assessment:** [Current position with confidence level]
**Expert Recommendation:** [Recommended position with reasoning]
**Key Considerations:** [Main factors to consider]

**My Analysis Indicates:** [Brief summary of why I recommend this position]

**The Decision is Yours:** While I provide expert guidance, the final spectrum position should reflect your vision for the workflow."

**B. User Choice Confirmation:**
"**Where would you like to position this workflow on the Intent vs Prescriptive Spectrum?**

**Options:**

1. **Keep Current Position** - [Current position] - Stay with current approach
2. **Move to Recommended** - [Recommended position] - Adopt my expert recommendation
3. **Move Toward Intent-Based** - Increase creative freedom and adaptation
4. **Move Toward Prescriptive** - Increase consistency and control
5. **Custom Position** - Specify your preferred approach

**Please select your preferred spectrum position (1-5):**"

### 6. Document Spectrum Decision

**A. Record User Decision:**
"**Spectrum Position Decision:**
**User Choice:** [Selected option]
**Final Position:** [Confirmed spectrum position]
**Rationale:** [User's reasoning, if provided]
**Implementation Notes:** [What this means for workflow design]"

**B. Update Compliance Report:**
Append to {complianceReportFile}:

```markdown
## Intent vs Prescriptive Spectrum Analysis

### Current Position Assessment

**Analyzed Position:** [Current spectrum position]
**Evidence:** [Specific examples from workflow analysis]
**Confidence Level:** [High/Medium/Low based on clarity of patterns]

### Expert Recommendation

**Recommended Position:** [Professional recommendation]
**Reasoning:** [Detailed rationale for recommendation]
**Workflow Type Considerations:** [Specific to this workflow's purpose]

### User Decision

**Selected Position:** [User's confirmed choice]
**Rationale:** [User's reasoning or preferences]
**Implementation Guidance:** [What this means for workflow]

### Spectrum Validation Results

✅ Spectrum position is intentional and understood
✅ User educated on implications of their choice
✅ Implementation guidance provided for final position
✅ Decision documented for future reference
```

### 7. Continuation Confirmation

"**Spectrum Validation Complete:**

- **Final Position:** [Confirmed spectrum position]
- **User Understanding:** Confirmed implications and benefits
- **Implementation Ready:** Guidance provided for maintaining position

**Ready for Phase 6:** Web Subprocess Validation analysis

- Flow validation and completion paths
- Goal alignment and optimization assessment
- Meta-workflow failure analysis and improvement recommendations

**Select an Option:** [C] Continue to Web Subprocess Validation [X] Exit"

## Menu Handling Logic:

- IF C: Save spectrum decision to report, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF X: Save current spectrum findings and end with guidance for resuming
- IF Any other comments or queries: respond and redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [spectrum position confirmed with user understanding], will you then load and read fully `{nextStepFile}` to execute and begin Web Subprocess Validation phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Comprehensive spectrum position analysis with evidence-based reasoning
- Expert recommendation provided with specific rationale and examples
- User educated on spectrum implications for their workflow type
- User makes informed decision about spectrum positioning
- Spectrum decision documented with implementation guidance
- User understands benefits and trade-offs of their choice

### ❌ SYSTEM FAILURE:

- Making spectrum recommendations without analyzing actual workflow content
- Not providing evidence-based reasoning for assessment
- Failing to educate user on spectrum implications
- Proceeding without user confirmation of spectrum position
- Not documenting user decision for future reference

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
