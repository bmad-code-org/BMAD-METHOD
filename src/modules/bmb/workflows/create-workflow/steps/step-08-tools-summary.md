---
name: 'step-08-tools-summary'
description: 'Summarize tools configuration and proceed to workflow design'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-08-tools-summary.md'
nextStepFile: '{workflow_path}/steps/step-09-design.md'
workflowFile: '{workflow_path}/workflow.md'
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/{bmad_folder}/bmb/docs/workflows/common-workflow-tools.csv'
---

# Step 8: Tools Configuration Summary

## STEP GOAL:

Summarize the complete tools configuration and confirm readiness to proceed to workflow design.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in tools integration and workflow optimization

## EXECUTION PROTOCOLS:

- 🎯 Compile complete tools configuration summary
- 💾 Present final configuration for user confirmation
- 📖 Update workflow plan with comprehensive summary
- 🚫 FORBIDDEN to proceed to design without user confirmation

## SEQUENCE OF INSTRUCTIONS:

### 1. Initialize Tools Summary

"**Tools Configuration Summary**

Let's review your complete tools configuration before proceeding to workflow design. This ensures all integrations are properly planned."

### 2. Present Complete Configuration

Load all previous configurations from {workflowPlanFile} and CSV:

"**Complete Tools Configuration:**

**Core BMAD Tools:**

- [List selected core tools with integration points]
- [Load descriptions from CSV for confirmation]

**LLM Tool Features:**

- [List selected LLM features with integration points]
- [Load descriptions from CSV for confirmation]

**Tool-Memory:**

- [Selected memory types with implementation details]
- [Load descriptions from CSV for confirmation]

**External Tools:**

- [List selected MCP integrations with URLs]
- [Load descriptions from CSV for confirmation]
- [Mark which require installation]

**Installation Guidance:**

- [Approach selected and tools included]
- [Setup steps configured as needed]

**Integration Strategy:**

- [How tools enhance rather than disrupt workflow]
- [Checkpoint approaches and user choice points]
- [Performance optimization opportunities]"

### 3. Final Configuration Confirmation

"**Final Configuration Review:**

**Your workflow will include:**

- **Total Tools:** [count of selected tools]
- **Core Tools:** [number selected]
- **External Tools:** [number selected]
- **Installation Required:** [yes/no, which tools]

**Key Integration Points:**

- [Major phases where tools enhance workflow]
- [User experience considerations]
- [Performance optimizations]

**Ready to proceed with this configuration?**"

### 4. Update Workflow Plan with Final Summary

Append to {workflowPlanFile}:

```markdown
## Final Tools Configuration Summary

### Tools Inventory

**Core BMAD Tools:** [count and list]
**LLM Features:** [count and list]
**Memory Implementation:** [type and use case]
**External Tools:** [count and list with URLs]
**Installation Required:** [tools and setup complexity]

### Integration Strategy

**User Experience:** [how tools enhance workflow]
**Checkpoint Approach:** [when tools are offered]
**Performance Optimization:** [efficiency improvements]
**Installation Strategy:** [how users prepare environment]

### Ready for Design

All tools configured and ready for workflow design phase.
```

### 5. Menu Options

Display: **Select an Option:** [C] Continue to Workflow Design [M] Modify Configuration

#### Menu Handling Logic:

- IF C: Save final summary, update frontmatter stepsCompleted: [3, 4, 5, 6, 7, 8], then load {nextStepFile}
- IF M: Return to specific configuration step

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and summary is saved will you load {nextStepFile} to begin workflow design phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete tools configuration summarized clearly
- All descriptions loaded from CSV (not duplicated)
- User confirms configuration before proceeding
- Frontmatter updated with completed steps
- Ready to proceed to workflow design

### ❌ SYSTEM FAILURE:

- Not presenting complete configuration summary
- Duplicating CSV content instead of referencing it
- Proceeding to design without user confirmation
- Not updating workflow plan with final summary
