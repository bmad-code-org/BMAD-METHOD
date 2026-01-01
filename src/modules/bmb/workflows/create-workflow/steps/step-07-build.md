---
name: 'step-07-build'
description: 'Generate all workflow files based on the approved plan'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-07-build.md'
nextStepFile: '{workflow_path}/steps/step-08-review.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'

# Template References
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
stepInitContinuableTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-01-init-continuable-template.md'
step1bTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-1b-template.md'
# No content templates needed - will create content as needed during build
# No build summary template needed - will append summary directly to workflow plan
---

# Step 7: Workflow File Generation

## STEP GOAL:

To generate all the workflow files (workflow.md, step files, templates, and supporting files) based on the approved plan from the previous design step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

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
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and build is complete

## CONTEXT BOUNDARIES:

- Approved plan from step 6 guides implementation
- Generate files in target workflow location
- Load templates and documentation as needed during build
- Follow step-file architecture principles

## BUILD REFERENCE MATERIALS:

- When building each step file, you must follow template `{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md`
- When building continuable step-01-init.md files, use template `{project-root}/_bmad/bmb/docs/workflows/templates/step-01-init-continuable-template.md`
- When building continuation steps, use template `{project-root}/_bmad/bmb/docs/workflows/templates/step-1b-template.md`
- When building the main workflow.md file, you must follow template `{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md`
- Example step files from {project-root}/_bmad/bmb/reference/workflows/meal-prep-nutrition/workflow.md for patterns - this is an idealized workflow so all files can give good insight into format and structure to be followed

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
{bmb_creations_output_folder}/workflows/{workflow_name}/
├── workflow.md
├── steps/
│   ├── step-01-init.md
│   ├── step-01b-continue.md (if continuation support needed)
│   ├── step-02-[name].md
│   └── ...
├── templates/
│   └── [as needed]
└── data/
    └── [as needed]
```

For bmb module, this will be: `_bmad/custom/src/workflows/{workflow_name}/`
For other modules, check their module.yaml for custom_workflow_location

### 3. Generate workflow.md

Load and follow {workflowTemplate}:

- Create workflow.md using template structure
- Insert workflow name and description
- Configure all path variables ({project-root}, _bmad, {workflow_path})
- Set web_bundle flag to true unless user has indicated otherwise
- Define role and goal
- Include initialization path to step-01

### 4. Generate Step Files

#### 4a. Check for Continuation Support

**Check the workflow plan for continuation support:**

- Look for "continuation support: true" or similar flag
- Check if step-01b-continue.md was included in the design
- If workflow generates output documents, continuation is typically needed

#### 4b. Generate step-01-init.md (with continuation logic)

If continuation support is needed:

- Load and follow {stepInitContinuableTemplate}
- This template automatically includes all required continuation detection logic
- Customize with workflow-specific information:
  - Update workflow_path references
  - Set correct outputFile and templateFile paths
  - Adjust role and persona to match workflow type
  - Customize welcome message for workflow context
  - Configure input document discovery patterns (if any)
- Template automatically handles:
  - continueFile reference in frontmatter
  - Logic to check for existing output files with stepsCompleted
  - Routing to step-01b-continue.md for continuation
  - Fresh workflow initialization

#### 4c. Generate step-01b-continue.md (if needed)

**If continuation support is required:**

- Load and follow {step1bTemplate}
- Customize with workflow-specific information:
  - Update workflow_path references
  - Set correct outputFile path
  - Adjust role and persona to match workflow type
  - Customize welcome back message for workflow context
- Ensure proper nextStep detection logic based on step numbers

#### 4d. Generate Remaining Step Files

For each remaining step in the design:

- Load and follow {stepTemplate}
- Create step file using template structure
- Customize with step-specific content
- Ensure proper frontmatter with path references
- Include appropriate menu handling and universal rules
- Follow all mandatory rules and protocols from template
- **Critical**: Ensure each step updates `stepsCompleted` array when completing

### 5. Generate Templates (If Needed)

For document workflows:

- Create template.md with proper structure
- Include all variables from design
- Ensure variable naming consistency

Remember that the output format design we aligned on chose one of the following - and what it means practically when creating the workflow steps:
1. **Strict Template** - Must follow exact format with specific fields
   1. This is similar to the example where there are multiple template fragements that are specific with all fields to be in the final output.
   2. generally there will be 1 fragment to a step to complete in the overall template.
2. **Structured** - Required sections but flexible within each
   1. Usually there will just be one template file - and in this mode it lists out all the section headings (generally level 2 sections in the md) with a handlebars style placeholder for each section.
   2. Step files responsible for a specific section will upon user Continue of that step ensure output is written to the templates proper section
3. **Semi-structured** - Core sections plus optional additions
   1. Similar to the prior 2, but not all sections or content are listed in the template, some steps might offer various paths or options to go to different steps (or variance within a step) that can determine what sections end up in the final document
4. **Free-form** - Content-driven with minimal structure
   1. These are the easiest and most flexible. The single template usually only has the front matter fence with a stepsCompleted array and maybe some other fields, and outside of the front matter just the level 1 doc title
   2. With free form, any step that could produce content just appends to the end of the document, so its progressively build in the order of ste[s completed.
   3. Its good to have in this type of workflow a final polish output doc type step that cohesively can update the doc built up in this progressive manner, improving flow, reducing duplication, and ensure all information is aligned and where it belongs.

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

Create a build summary including:

- List of all files created with full paths
- Any customizations from templates
- Manual steps needed
- Next steps for testing

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
