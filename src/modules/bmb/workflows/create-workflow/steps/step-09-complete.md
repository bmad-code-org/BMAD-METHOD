---
name: 'step-09-complete'
description: 'Final completion and wrap-up of workflow creation process'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-09-complete.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'
completionFile: '{targetWorkflowPath}/completion-summary-{new_workflow_name}.md'
---

# Step 9: Workflow Creation Complete

## STEP GOAL:

To complete the workflow creation process with a final summary, confirmation, and next steps for using the new workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a workflow architect and systems designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in workflow deployment and usage guidance
- ✅ User brings their specific workflow needs

### Step-Specific Rules:

- 🎯 Focus ONLY on completion and next steps
- 🚫 FORBIDDEN to modify the generated workflow
- 💬 Provide clear guidance on how to use the workflow
- 🚫 This is the final step - no next step to load

## EXECUTION PROTOCOLS:

- 🎯 Present completion summary
- 💾 Create final completion documentation
- 📖 Update plan frontmatter with completion status
- 🚫 This is the final step

## CONTEXT BOUNDARIES:

- All previous steps are complete
- Workflow has been generated and reviewed
- Focus ONLY on completion and next steps
- This step concludes the create-workflow process

## COMPLETION PROCESS:

### 1. Initialize Completion

"**Workflow Creation Complete!**

Congratulations! We've successfully created your new workflow. Let's finalize everything and ensure you have everything you need to start using it."

### 2. Final Summary

Present a complete summary of what was created:

**Workflow Created:** {new_workflow_name}
**Location:** {targetWorkflowPath}
**Files Generated:** [list from build step]

### 3. Create Completion Summary

Create {completionFile} with:

```markdown
---
workflowName: { new_workflow_name }
creationDate: [current date]
module: [module from plan]
status: COMPLETE
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
---

# Workflow Creation Summary

## Workflow Information

- **Name:** {new_workflow_name}
- **Module:** [module]
- **Created:** [date]
- **Location:** {targetWorkflowPath}

## Generated Files

[List all files created]

## Quick Start Guide

[How to run the new workflow]

## Next Steps

[Post-creation recommendations]
```

### 4. Usage Guidance

Provide clear instructions on how to use the new workflow:

**How to Use Your New Workflow:**

1. **Running the Workflow:**
   - [Instructions based on workflow type]
   - [Initial setup if needed]

2. **Common Use Cases:**
   - [Typical scenarios for using the workflow]
   - [Expected inputs and outputs]

3. **Tips for Success:**
   - [Best practices for this specific workflow]
   - [Common pitfalls to avoid]

### 5. Post-Creation Recommendations

"**Next Steps:**

1. **Test the Workflow:** Run it with sample data to ensure it works as expected
2. **Customize if Needed:** You can modify the workflow based on your specific needs
3. **Share with Team:** If others will use this workflow, provide them with the location and instructions
4. **Monitor Usage:** Keep track of how well the workflow meets your needs"

### 6. Final Confirmation

"**Is there anything else you need help with regarding your new workflow?**

- I can help you test it
- We can make adjustments if needed
- I can help you create documentation for users
- Or any other support you need"

### 7. Update Final Status

Update {workflowPlanFile} frontmatter:

- Set status to COMPLETE
- Set completion date
- Add stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]

## MENU OPTIONS

Display: **Workflow Creation Complete!** [T] Test Workflow [M] Make Adjustments [D] Get Help

### Menu Handling Logic:

- IF T: Offer to run the newly created workflow with sample data
- IF M: Offer to make specific adjustments to the workflow
- IF D: Provide additional help and resources
- IF Any other: Respond to user needs

## CRITICAL STEP COMPLETION NOTE

This is the final step. When the user is satisfied, the workflow creation process is complete.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Workflow fully created and reviewed
- Completion summary generated
- User understands how to use the workflow
- All documentation is in place

### ❌ SYSTEM FAILURE:

- Not providing clear usage instructions
- Not creating completion summary
- Leaving user without next steps

**Master Rule:** Ensure the user has everything needed to successfully use their new workflow.
