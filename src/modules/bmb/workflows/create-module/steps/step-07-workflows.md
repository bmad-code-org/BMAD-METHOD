---
installed_path: '{project-root}/_bmad/bmb/workflows/create-module'
nextStepFile: '{installed_path}/steps/step-08-installer.md'
modulePlanFile: '{bmb_creations_output_folder}/{module_name}/module-plan-{module_name}.md'
workflowPlanTemplate: '{installed_path}/templates/workflow-plan-template.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Review Workflow Plans

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Module Architect and Workflow Designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD workflow patterns, user brings their workflow requirements
- ✅ Maintain collaborative, review-focused tone

### Step-Specific Rules:

- 🎯 Focus on reviewing existing workflow README files from Step 6
- 🚫 FORBIDDEN to use create-workflow workflow in this step
- 💬 Review and refine workflow plans, not create new ones
- 🚫 FORBIDDEN to create actual workflow steps

## EXECUTION PROTOCOLS:

- 🎯 Review workflow README files created in Step 6
- 💾 Update README files based on user feedback
- 📖 Add "step-07-workflows" to stepsCompleted array` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Workflow README files were created in Step 6 for each agent
- These README files contain workflow plans for later implementation
- Module structure already created with workflow folders
- Focus on reviewing and refining, not creating from scratch

## STEP GOAL:

To review and refine the workflow README files created in Step 6, ensuring they have clear plans for later implementation with the create-workflow workflow.

## WORKFLOW REVIEW PROCESS:

### 1. List Workflow Folders Created

"Let's review the workflow plans created in Step 6 for your {module_display_name} module.

I've already created workflow folders and README.md files for each agent's workflows:

**Workflow folders found:**

- [List all workflow folders in {bmb_creations_output_folder}/{module_name}/workflows/]

**Each workflow folder contains a README.md with:**

- Purpose and description
- Trigger code from agent menu
- Key steps outline
- Expected outputs
- Notes for implementation"

### 2. Review Each Workflow Plan

For each workflow README file:

#### 2.1 Load and Present

"**Reviewing Workflow: [Workflow Name]**

Reading the README.md from: [workflow-folder]/README.md

**Current Plan:**
[Purpose]
[Trigger]
[Key Steps]
[Expected Output]
[Notes]

How does this plan look? Should we:

- Keep it as is
- Modify the purpose
- Adjust the steps
- Change the expected output"

#### 2.2 Update Based on Feedback

If user wants changes:

- Update the README.md file
- Keep the same basic structure
- Ensure clarity for future implementation

#### 2.3 Check for Missing Information

Ensure each README has:

```markdown
# [Workflow Name]

## Purpose

[Clear, concise description of what this workflow accomplishes]

## Trigger

[Trigger code from agent menu, e.g., "WF" or specific code]

## Key Steps

1. [Step 1 - What happens first]
2. [Step 2 - What happens next]
3. [Step 3 - Continue as needed]

## Expected Output

[What the workflow produces - document, action, result]

## Notes

This workflow will be implemented using the create-workflow workflow.
(Optional: Any special considerations or requirements)
```

### 3. Link Workflows to Agents

"**Workflow-Agent Mapping:**

Let's verify each workflow is properly linked to its agent:

[For each workflow]:

- **Workflow:** [Workflow Name]
- **Agent:** [Agent Name]
- **Trigger Code:** [WF code]
- **Menu Item:** [Menu description in agent]

Are all these mappings correct in the agent files?"

### 4. Document Implementation Plan

Update module-plan.md with workflow section:

```markdown
## Workflow Plans Reviewed

### For Agent [Agent Name]:

1. **[Workflow Name]**
   - Location: workflows/[workflow-name]/
   - Status: Plan reviewed and ready for implementation
   - Trigger: [WF code]
   - Implementation: Use create-workflow workflow

2. **[Workflow Name]**
   - Location: workflows/[workflow-name]/
   - Status: Plan reviewed and ready for implementation
   - Trigger: [WF code]
   - Implementation: Use create-workflow workflow
```

### 5. Next Steps Guidance

"**Ready for Implementation:**

All workflow plans are now reviewed and ready. To implement these workflows later:

1. Use the `/bmad:bmb:workflows:create-workflow` command
2. Select each workflow folder
3. Follow the create-workflow workflow
4. It will create the full workflow.md and step files

The README.md in each folder serves as your blueprint for implementation."

### 6. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask} to refine workflow designs
- IF P: Execute {partyModeWorkflow} to get creative input on workflow processes
- IF C: Save workflow plan status to module-plan.md, add step-07-workflows to the end of the stepsCompleted array in frontmatter, then load nextStepFile
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond then end with display again of the menu options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All workflow README files reviewed with user
- Each workflow plan has clear purpose and steps
- Workflow-agent mappings verified
- README files updated based on feedback
- Clear implementation guidance provided

### ❌ SYSTEM FAILURE:

- Skipping review of workflow README files
- Not updating plans based on user feedback
- Missing critical information in README files
- Not verifying workflow-agent mappings

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all workflow plans are reviewed and documented and stepsCompleted updated, will you then load, read entire file, then execute `{nextStepFile}` to begin installer setup.
