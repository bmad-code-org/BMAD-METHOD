---
name: 'step-05-memory-requirements'
description: 'Assess memory requirements and configure memory implementation'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-05-memory-requirements.md'
nextStepFile: '{project_path}/steps/step-06-external-tools.md'
workflowFile: '{workflow_path}/workflow.md'
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/{bmad_folder}/bmb/docs/workflows/common-workflow-tools.csv'
---

# Step 5: Memory Requirements Assessment

## STEP GOAL:

Assess whether the workflow needs memory capabilities and configure appropriate memory implementation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in memory implementation patterns

## EXECUTION PROTOCOLS:

- 🎯 Assess memory needs based on workflow requirements
- 💾 Present memory options from CSV
- 📖 Configure memory implementation if needed
- 🚫 FORBIDDEN to push memory when not required

## SEQUENCE OF INSTRUCTIONS:

### 1. Initialize Memory Assessment

"Assessing **Memory Requirements**

Most workflows complete their task and exit without needing persistent memory. However, some specialized workflows benefit from session-to-session continuity."

### 2. Present Memory Options from CSV

Load `{commonToolsCsv}` and filter for `type='tool-memory'`:

"**Memory Options:**

**Available Memory Types:**

- [List tool-memory options from CSV with descriptions]

**Key Question:** Does your workflow need to maintain state across multiple sessions?"

### 3. Memory Requirements Analysis

"**Memory Assessment Questions:**

1. **Session Continuity:** Will your workflow need to resume where it left off?
2. **Agent Initialization:** Will your workflow initialize agents with previous context?
3. **Pattern Recognition:** Would semantic search of past experiences be valuable?
4. **Self-Improvement:** Will your workflow learn from previous executions?

**Most workflows:** No memory needed (they complete and exit)
**Some workflows:** Sidecar files for history tracking
**Advanced workflows:** Vector database for semantic learning"

### 4. Configure Memory (If Needed)

If user selects memory:

"**Memory Configuration:**

Based on your needs, which memory type?

1. **Sidecar File** - History tracking and session continuity
2. **Vector Database** - Semantic search and pattern recognition
3. **Both** - Comprehensive memory capabilities
4. **None** - No persistent memory required

**Memory Management:** Privacy controls, cleanup strategies, access patterns"

### 5. Document Memory Configuration

Append to {workflowPlanFile}:

```markdown
## Memory Configuration

### Memory Requirements

**Sidecar File:** [selected/not selected] - Use case: [specific implementation]
**Vector Database:** [selected/not selected] - Use case: [specific implementation]
**Memory Management:** [cleanup, privacy, access patterns]
**Integration:** [how memory enhances workflow continuity]
```

### 6. Menu Options

Display: **Select an Option:** [C] Continue to External Tools [M] Modify Memory

#### Menu Handling Logic:

- IF C: Append memory configuration to {workflowPlanFile}, update frontmatter, then load {nextStepFile}
- IF M: Refine memory requirements

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and memory is documented will you load {nextStepFile} to configure external tools.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Memory options presented from CSV
- User's memory needs properly assessed
- Configuration documented appropriately
- No memory pushed when not needed

### ❌ SYSTEM FAILURE:

- Assuming memory is needed without assessment
- Duplicating CSV descriptions in step file
- Not documenting memory management strategies
