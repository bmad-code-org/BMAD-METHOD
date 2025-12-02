---
name: 'step-06-external-tools'
description: 'Configure MCP integrations and installation requirements'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-06-external-tools.md'
nextStepFile: '{workflow_path}/steps/step-07-installation-guidance.md'
workflowFile: '{workflow_path}/workflow.md'
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/{bmad_folder}/bmb/docs/workflows/common-workflow-tools.csv'
---

# Step 6: External Tools Configuration

## STEP GOAL:

Identify and configure MCP integrations and external tools that the workflow requires.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in MCP integrations and external tools

## EXECUTION PROTOCOLS:

- 🎯 Load external tools from CSV
- 💾 Identify specific MCP needs for workflow
- 📖 Document which tools require installation
- 🚫 FORBIDDEN to proceed without confirming tool selections

## SEQUENCE OF INSTRUCTIONS:

### 1. Initialize External Tools Assessment

"Configuring **External Tools and MCP Integrations**

These tools extend workflow capabilities but typically require installation. Let's identify what your workflow actually needs."

### 2. Present External Tools from CSV

Load `{commonToolsCsv}` and filter for `propose='example'` and `type='mcp'`:

"**Available External Tools:**

**MCP Integrations (Require Installation):**

- [List MCP tools from CSV with URLs and descriptions]

**Example Workflows/Tasks:**

- [List example workflows/tasks from CSV with descriptions]

**Installation Note:** Tools marked with `requires_install=yes` will need setup steps."

### 3. Identify Specific Tool Needs

"**External Tool Requirements:**

Based on your workflow goals, which external tools do you need?

**Common MCP Needs:**

- **Documentation Access:** Context-7 for current API docs
- **Browser Automation:** Playwright for web interactions
- **Git Operations:** Direct version control integration
- **Database Access:** Multiple database connectivity
- **Custom Tools:** Any domain-specific MCPs you need

**Your Requirements:**

1. What external data or APIs will your workflow access?
2. Does your workflow need web browser automation?
3. Will it interact with version control systems?
4. Are database connections required?
5. Any custom MCPs you plan to use?"

### 4. Document External Tools Selection

Append to {workflowPlanFile}:

```markdown
## External Tools Configuration

### MCP Integrations

**Selected Tools:** [list from CSV]
**Purpose:** [how each MCP enhances workflow]
**Integration Points:** [where external tools are essential]
**Installation Required:** [yes/no, which tools]

### Example Workflows/Tasks

**Selected:** [list chosen workflows/tasks]
**Purpose:** [how they enhance workflow capabilities]
**Integration:** [where they fit in workflow flow]
```

### 5. Installation Assessment

"**Installation Requirements Assessment:**

**Tools Requiring Installation:** [list from CSV where requires_install=yes]

**Installation Guidance Options:**

1. Include detailed setup steps in workflow
2. Provide user installation checklist
3. Assume tools are pre-installed

**Your Preference:** [ask user how to handle installation]"

### 6. Menu Options

Display: **Select an Option:** [C] Continue to Installation Guidance [M] Modify External Tools

#### Menu Handling Logic:

- IF C: Append external tools configuration to {workflowPlanFile}, update frontmatter, then load {nextStepFile}
- IF M: Refine external tool requirements

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and external tools are documented will you load {nextStepFile} to configure installation guidance.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- External tools presented from CSV with installation requirements
- User's specific tool needs identified and documented
- Installation requirements clearly marked
- User understands which tools need setup

### ❌ SYSTEM FAILURE:

- Not filtering CSV for relevant tool types
- Missing installation requirement information
- Proceeding without confirming tool selections
