# Edit Workflow - Workflow Editor Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmb/workflows/edit-workflow/workflow.yaml</critical>
<critical>Study the workflow creation guide thoroughly at: {workflow_creation_guide}</critical>
<critical>Communicate in {communication_language} throughout the workflow editing process</critical>

<workflow>

<step n="1" goal="Load and analyze target workflow">
<ask>What is the path to the workflow you want to edit? (provide path to workflow.yaml or workflow folder)</ask>

<action>Load the workflow.yaml file from the provided path</action>
<action>Identify the workflow type (document, action, interactive, autonomous, meta)</action>
<action>List all associated files (template.md, instructions.md, checklist.md, data files)</action>
<action>Load any existing instructions.md and template.md files if present</action>

Display a summary:

- Workflow name and description
- Type of workflow
- Files present
- Current structure overview
  </step>

<step n="2" goal="Analyze against best practices">
<action>Load the complete workflow creation guide from: {workflow_creation_guide}</action>
<action>Check the workflow against the guide's best practices:</action>

Analyze for:

- **Critical headers**: Are workflow engine references present?
- **File structure**: Are all expected files present for this workflow type?
- **Variable consistency**: Do variable names match between files?
- **Step structure**: Are steps properly numbered and focused?
- **XML tags**: Are tags used correctly and consistently?
- **Instructions clarity**: Are instructions specific with examples and limits?
- **Template variables**: Use snake_case and descriptive names?
- **Validation criteria**: Are checklist items measurable and specific?

**Standard Config Audit:**

- **workflow.yaml config block**: Check for standard config variables
  - Is config_source defined?
  - Are output_folder, user_name, communication_language pulled from config?
  - Is date set to system-generated?
- **Instructions usage**: Do instructions use config variables?
  - Does it communicate in {communication_language}?
  - Does it address {user_name}?
  - Does it write to {output_folder}?
- **Template usage**: Does template.md include config variables in metadata?

**YAML/File Alignment:**

- **Unused yaml fields**: Are there variables in workflow.yaml not used in instructions OR template?
- **Missing variables**: Are there hardcoded values that should be variables?
- **Web bundle completeness**: If web_bundle exists, does it include all dependencies?
  - All referenced files listed?
  - Called workflows included?

<action>Create a list of identified issues or improvement opportunities</action>
<action>Prioritize issues by importance (critical, important, nice-to-have)</action>
</step>

<step n="3" goal="Select editing focus">
Present the editing menu to the user:

**What aspect would you like to edit?**

1. **Fix critical issues** - Address missing headers, broken references
2. **Add/fix standard config** - Ensure standard config block and variable usage
3. **Update workflow.yaml** - Modify configuration, paths, metadata
4. **Refine instructions** - Improve steps, add detail, fix flow
5. **Update template** - Fix variables, improve structure (if applicable)
6. **Enhance validation** - Make checklist more specific and measurable
7. **Add new features** - Add steps, optional sections, or capabilities
8. **Configure web bundle** - Add/update web bundle for deployment
9. **Remove bloat** - Delete unused yaml fields, duplicate values
10. **Optimize for clarity** - Improve descriptions, add examples
11. **Full review and update** - Comprehensive improvements across all files

<ask>Select an option (1-11) or describe a custom edit:</ask>
</step>

<step n="4" goal="Load relevant documentation">
Based on the selected edit type, load appropriate reference materials:

<check>If option 2 (Add/fix standard config):</check>
<action>Prepare standard config block template:</action>

```yaml
# Critical variables from config
config_source: '{project-root}/bmad/{module}/config.yaml'
output_folder: '{config_source}:output_folder'
user_name: '{config_source}:user_name'
communication_language: '{config_source}:communication_language'
date: system-generated
```

<action>Check if workflow.yaml has existing config section (don't duplicate)</action>
<action>Identify missing config variables to add</action>
<action>Check instructions.md for config variable usage</action>
<action>Check template.md for config variable usage</action>

<check>If editing instructions or adding features:</check>
<action>Review the "Writing Instructions" section of the creation guide</action>
<action>Load example workflows from {project-root}/bmad/bmm/workflows/ for patterns</action>

<check>If editing templates:</check>
<action>Review the "Templates and Variables" section of the creation guide</action>
<action>Ensure variable naming conventions are followed</action>

<check>If editing validation:</check>
<action>Review the "Validation" section and measurable criteria examples</action>

<check>If option 9 (Remove bloat):</check>
<action>Cross-reference all workflow.yaml fields against instructions.md and template.md</action>
<action>Identify yaml fields not used in any file</action>
<action>Check for duplicate fields in web_bundle section</action>

<check>If configuring web bundle:</check>
<action>Review the "Web Bundles" section of the creation guide</action>
<action>Scan all workflow files for referenced resources</action>
<action>Create inventory of all files that must be included</action>
<action>Scan instructions for <invoke-workflow> calls - those yamls must be included</action>

<check>If fixing critical issues:</check>
<action>Load the workflow execution engine documentation</action>
<action>Verify all required elements are present</action>
</step>

<step n="5" goal="Perform edits" repeat="until-complete">
Based on the selected focus area:

<check>If configuring web bundle (option 7):</check>
<action>Check if web_bundle section exists in workflow.yaml</action>

If creating new web bundle:

1. Extract workflow metadata (name, description, author)
2. Convert all file paths to bmad/-relative format
3. Remove any {config_source} references
4. Scan instructions.md for all file references:
   - Data files (CSV, JSON)
   - Sub-workflows
   - Shared templates
   - Any included files
5. Scan template.md for any includes
6. Create complete web_bundle_files array
7. **CRITICAL**: Check for <invoke-workflow> calls in instructions:
   - If workflow invokes other workflows, add existing_workflows field
   - Maps workflow variable name to bmad/-relative path
   - Signals bundler to recursively include invoked workflow's web_bundle
   - Example: `existing_workflows: - core_brainstorming: "bmad/core/workflows/brainstorming/workflow.yaml"`
8. Generate web_bundle section

If updating existing web bundle:

1. Verify all paths are bmad/-relative
2. Check for missing files in web_bundle_files
3. Remove any config dependencies
4. Update file list with newly referenced files

<action>Show the current content that will be edited</action>
<action>Explain the proposed changes and why they improve the workflow</action>
<action>Generate the updated content following all conventions from the guide</action>

<ask>Review the proposed changes. Options:

- [a] Accept and apply
- [e] Edit/modify the changes
- [s] Skip this change
- [n] Move to next file/section
- [d] Done with edits
  </ask>

<check>If user selects 'a':</check>
<action>Apply the changes to the file</action>
<action>Log the change for the summary</action>

<check>If user selects 'e':</check>
<ask>What modifications would you like to make?</ask>
<goto step="5">Regenerate with modifications</goto>

<check>If user selects 'd':</check>
<continue>Proceed to validation</continue>
</step>

<step n="6" goal="Validate all changes" optional="true">
<action>Run a comprehensive validation check:</action>

**Basic Validation:**

- [ ] All file paths resolve correctly
- [ ] Variable names are consistent across files
- [ ] Step numbering is sequential and logical
- [ ] Required XML tags are properly formatted
- [ ] No placeholders remain (like {TITLE} or {WORKFLOW_CODE})
- [ ] Instructions match the workflow type
- [ ] Template variables match instruction outputs (if applicable)
- [ ] Checklist criteria are measurable (if present)
- [ ] Critical headers are present in instructions
- [ ] YAML syntax is valid

**Standard Config Validation:**

- [ ] workflow.yaml contains config_source
- [ ] output_folder, user_name, communication_language pulled from config
- [ ] date set to system-generated
- [ ] Instructions communicate in {communication_language} where appropriate
- [ ] Instructions address {user_name} where appropriate
- [ ] Instructions write to {output_folder} for file outputs
- [ ] Template optionally includes {{user_name}}, {{date}} in metadata (if document workflow)
- [ ] Template does NOT use {{communication_language}} in headers (agent-only variable)

**YAML/File Alignment:**

- [ ] All workflow.yaml variables used in instructions OR template
- [ ] No unused yaml fields (bloat-free)
- [ ] No duplicate fields between top-level and web_bundle
- [ ] Template variables match <template-output> tags in instructions

**Web bundle validation (if applicable):**

- [ ] web_bundle section present if needed
- [ ] All paths are bmad/-relative (no {project-root})
- [ ] No {config_source} variables in web bundle
- [ ] All referenced files listed in web_bundle_files
- [ ] Instructions, validation, template paths correct
- [ ] Called workflows (<invoke-workflow>) included in web_bundle_files
- [ ] Complete file inventory verified

<check>If any validation fails:</check>
<ask>Issues found. Would you like to fix them? (y/n)</ask>
<check>If yes:</check>
<goto step="5">Return to editing</goto>
</step>

<step n="7" goal="Generate change summary">
<action>Create a summary of all changes made for {user_name} in {communication_language}:</action>

**Summary Structure:**

- Workflow name
- Changes made (file-by-file descriptions)
- Improvements (how workflow is now better aligned with best practices)
- Files modified (complete list with paths)
- Next steps (suggestions for additional improvements or testing)

<ask>Would you like to:

- Test the edited workflow
- Make additional edits
- Exit
  </ask>

<check>If test workflow:</check>
<action>Invoke the edited workflow for testing</action>
</step>

</workflow>
