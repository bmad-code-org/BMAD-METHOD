---
name: 'step-11-build'
description: 'Generate all workflow files based on the approved plan'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-11-build.md'
nextStepFile: '{workflow_path}/steps/step-12-review.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'
targetWorkflowPath: '{custom_workflow_location}/{new_workflow_name}'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'

# Template References
workflowTemplate: '{project-root}/{bmad_folder}/bmb/docs/workflows/workflow-template.md'
stepTemplate: '{project-root}/{bmad_folder}/bmb/docs/workflows/step-template.md'
contentTemplate: '{workflow_path}/templates/content-template.md'
buildSummaryTemplate: '{workflow_path}/templates/build-summary.md'
---

# Step 5: Workflow File Generation

## STEP GOAL:

To generate all the workflow files (workflow.md, step files, templates, and supporting files) based on the approved plan from the previous review step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and systems designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring implementation expertise and best practices
- ✅ User brings their specific requirements and design approvals

### Step-Specific Rules:

- 🎯 Focus ONLY on generating files based on approved design
- 🚫 FORBIDDEN to modify the design without user consent
- 💬 Generate files collaboratively, getting approval at each stage
- 🚪 CREATE files in the correct target location

## EXECUTION PROTOCOLS:

- 🎯 Generate files systematically from design
- 💾 Document all generated files and their locations
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and build is complete

## CONTEXT BOUNDARIES:

- Approved plan from step 10 guides implementation
- Generate files in target workflow location
- Load templates and documentation as needed during build
- Follow step-file architecture principles

## BUILD REFERENCE MATERIALS:

- When building each step file, you must follow template `{project-root}/{bmad_folder}/bmb/docs/workflows/step-template.md`
- When building the main workflow.md file, you must follow template `{project-root}/{bmad_folder}/bmb/docs/workflows/workflow-template.md`
- Example step files from {project-root}/{bmad_folder}/bmb/reference/workflows/meal-prep-nutrition/workflow.md for patterns

## FILE GENERATION SEQUENCE:

### 1. Confirm Build Readiness

Based on the approved plan, confirm:
"I have your approved plan and I'm ready to generate the workflow files. The plan specifies creating:

- Main workflow.md file
- [Number] step files
- [Number] templates
- Supporting files

All in: {targetWorkflowPath}

Ready to proceed?"

### 2. Create Directory Structure

Create the workflow folder structure in the target location:

```
{custom_workflow_location}/{workflow_name}/
├── workflow.md
├── steps/
│   ├── step-01-init.md
│   ├── step-02-[name].md
│   └── ...
├── templates/
│   └── [as needed]
└── data/
    └── [as needed]
```

For bmb module, this will be: `{bmad_folder}/custom/src/workflows/{workflow_name}/`
For other modules, check their install-config.yaml for custom_workflow_location

### 3. Generate workflow.md

Load and follow {workflowTemplate}:

- Create workflow.md using template structure
- Insert workflow name and description
- Configure all path variables ({project-root}, {bmad_folder}, {workflow_path})
- Set web_bundle flag to true unless user has indicated otherwise
- Define role and goal
- Include initialization path to step-01

### 4. Generate Step Files

For each step in the design:

- Load and follow {stepTemplate}
- Create step file using template structure
- Customize with step-specific content
- Ensure proper frontmatter with path references
- Include appropriate menu handling and universal rules
- Follow all mandatory rules and protocols from template

### 5. Generate Templates (If Needed)

For document workflows:

- Load {contentTemplate}
- Create template.md with proper structure
- Include all variables from design
- Ensure variable naming consistency

### 6. Generate Supporting Files

Based on design requirements:

- Create data files (csv)
- Generate README.md with usage instructions
- Create any configuration files
- Add validation checklists if designed

### 7. Verify File Generation

After creating all files:

- Check all file paths are correct
- Validate frontmatter syntax
- Ensure variable consistency across files
- Confirm sequential step numbering
- Verify menu handling logic

### 8. Document Generated Files

Create a summary of what was generated:

- List all files created with full paths
- Note any customizations from templates
- Identify any manual steps needed
- Provide next steps for testing

## QUALITY CHECKS DURING BUILD:

### Frontmatter Validation

- All YAML syntax is correct
- Required fields are present
- Path variables use correct format
- No hardcoded paths exist

### Step File Compliance

- Each step follows the template structure
- All mandatory rules are included
- Menu handling is properly implemented
- Step numbering is sequential

### Cross-File Consistency

- Variable names match across files
- Path references are consistent
- Dependencies are correctly defined
- No orphaned references exist

## BUILD PRINCIPLES:

### Follow Design Exactly

- Implement the design as approved
- Don't add or remove steps without consultation
- Maintain the interaction patterns designed
- Preserve the data flow architecture

### Maintain Best Practices

- Keep step files focused and reasonably sized (typically 5-10KB)
- Use collaborative dialogue patterns
- Include proper error handling
- Follow naming conventions

### Ensure Extensibility

- Design for future modifications
- Include clear documentation
- Make code readable and maintainable
- Provide examples where helpful

## CONTENT TO APPEND TO PLAN:

After generating all files, append to {workflowPlanFile}:

Load and append the content from {buildSummaryTemplate}

### 9. Present MENU OPTIONS

Display: **Build Complete - Select an Option:** [C] Continue to Review

#### EXECUTION RULES:

- Build complete - all files generated
- Present simple completion status
- User selects [C] to continue to review step

#### Menu Handling Logic:

- IF C: Save build summary to {workflowPlanFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: respond and redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content is saved to plan and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to execute and begin workflow review step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All workflow files generated in correct locations
- Files follow step-file architecture principles
- Plan implemented exactly as approved
- Build documented in {workflowPlanFile}
- Frontmatter updated with step completion

### ❌ SYSTEM FAILURE:

- Generating files without user approval
- Deviating from approved plan
- Creating files with incorrect paths
- Not updating plan frontmatter

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
