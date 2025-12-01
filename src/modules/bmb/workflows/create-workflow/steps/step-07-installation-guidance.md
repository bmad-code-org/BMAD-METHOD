---
name: 'step-07-installation-guidance'
description: 'Configure installation guidance for tools that require setup'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-07-installation-guidance.md'
nextStepFile: '{workflow_path}/steps/step-08-tools-summary.md'
workflowFile: '{workflow_path}/workflow.md'
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/{bmad_folder}/bmb/docs/workflows/common-workflow-tools.csv'
---

# Step 7: Installation Guidance Configuration

## STEP GOAL:

Configure installation guidance for any selected tools that require setup, ensuring users can successfully prepare their environment.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in tool installation and setup procedures

## EXECUTION PROTOCOLS:

- 🎯 Identify tools requiring installation from CSV
- 💾 Configure installation approach based on user preference
- 📖 Generate or skip installation guidance as appropriate
- 🚫 FORBIDDEN to proceed without confirming installation approach

## SEQUENCE OF INSTRUCTIONS:

### 1. Initialize Installation Guidance

"Configuring **Installation Guidance**

Let's ensure users can successfully set up any tools your workflow requires. This prevents runtime errors and improves user experience."

### 2. Identify Installation Requirements

Load `{commonToolsCsv}` and filter for selected tools with `requires_install=yes`:

"**Installation Requirements:**

**Tools Requiring Installation:**

- [List selected tools from CSV where requires_install=yes]
- [Include URLs from CSV for each tool]

**No Installation Required:**

- [List selected tools from CSV where requires_install=no]
- All BMAD core tools, LLM features, and sidecar file memory"

### 3. Installation Approach Options

"**Installation Guidance Options:**

Based on your selected tools, how should the workflow handle installation?

1. **Include Installation Steps** - Add detailed setup instructions in early workflow step
2. **User Instructions Only** - Provide guidance but don't embed in workflow
3. **Assume Pre-Installed** - Skip installation guidance (advanced users)

**Installation Prerequisites (if included):**

- Node.js 18+ (for Node.js-based MCPs)
- Python 3.8+ (for Python-based MCPs)
- Git for cloning repositories
- MCP-compatible AI client (Claude Desktop or similar)"

### 4. Configure Installation Guidance

If user chooses installation guidance:

"**Installation Step Configuration:**

For each tool requiring installation, the workflow will include:

- Clone/download instructions using URL from CSV
- Dependency installation commands
- Configuration file setup
- Server startup procedures
- Claude Desktop configuration steps

**Installation Checklist (if included):**

- [ ] Download and install Claude Desktop
- [ ] Clone MCP repositories
- [ ] Install required dependencies
- [ ] Configure MCP servers
- [ ] Add to Claude configuration
- [ ] Test connectivity
- [ ] Verify functionality"

### 5. Document Installation Configuration

Append to {workflowPlanFile}:

```markdown
## Installation Guidance Configuration

### Installation Approach

**Selected Approach:** [detailed steps/user instructions/assume pre-installed]
**Tools Requiring Installation:** [list with URLs]
**Installation Step Placement:** [early in workflow, after setup]

### Installation Content

**Prerequisites:** [system requirements]
**Setup Steps:** [commands and procedures]
**Verification:** [testing procedures]
**User Support:** [troubleshooting guidance]
```

### 6. Menu Options

Display: **Select an Option:** [C] Continue to Tools Summary [M] Modify Installation Approach

#### Menu Handling Logic:

- IF C: Append installation configuration to {workflowPlanFile}, update frontmatter, then load {nextStepFile}
- IF M: Refine installation approach

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and installation guidance is documented will you load {nextStepFile} to complete tools configuration.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Installation requirements clearly identified from CSV
- Installation approach configured based on user preference
- Documentation prepared for setup procedures
- User understands how tools will be installed

### ❌ SYSTEM FAILURE:

- Missing installation requirement assessment
- Not using URLs from CSV for installation guidance
- Proceeding without confirming installation approach
