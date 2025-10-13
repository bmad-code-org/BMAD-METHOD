# Edit Workflow - Workflow Editor Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmb/workflows/edit-workflow/workflow.yaml</critical>
<critical>Study the workflow creation guide thoroughly at: {workflow_creation_guide}</critical>

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

<action>Create a list of identified issues or improvement opportunities</action>
<action>Prioritize issues by importance (critical, important, nice-to-have)</action>
</step>

<step n="3" goal="Select editing focus">
Present the editing menu to the user:

**What aspect would you like to edit?**

1. **Fix critical issues** - Address missing headers, broken references
2. **Update workflow.yaml** - Modify configuration, paths, metadata
3. **Refine instructions** - Improve steps, add detail, fix flow
4. **Update template** - Fix variables, improve structure (if applicable)
5. **Enhance validation** - Make checklist more specific and measurable
6. **Add new features** - Add steps, optional sections, or capabilities
7. **Configure web bundle** - Add/update web bundle for deployment
8. **Optimize for clarity** - Improve descriptions, add examples
9. **Full review and update** - Comprehensive improvements across all files

<ask>Select an option (1-9) or describe a custom edit:</ask>
</step>

<step n="4" goal="Load relevant documentation">
Based on the selected edit type, load appropriate reference materials:

<check>If editing instructions or adding features:</check>
<action>Review the "Writing Instructions" section of the creation guide</action>
<action>Load example workflows from {project-root}/bmad/bmm/workflows/ for patterns</action>

<check>If editing templates:</check>
<action>Review the "Templates and Variables" section of the creation guide</action>
<action>Ensure variable naming conventions are followed</action>

<check>If editing validation:</check>
<action>Review the "Validation" section and measurable criteria examples</action>

<check>If configuring web bundle:</check>
<action>Review the "Web Bundles" section of the creation guide</action>
<action>Scan all workflow files for referenced resources</action>
<action>Create inventory of all files that must be included</action>

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
7. Generate web_bundle section

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

Validation checks:

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

Web bundle validation (if applicable):

- [ ] web_bundle section present if needed
- [ ] All paths are bmad/-relative (no {project-root})
- [ ] No {config_source} variables in web bundle
- [ ] All referenced files listed in web_bundle_files
- [ ] Instructions, validation, template paths correct
- [ ] Complete file inventory verified

<check>If any validation fails:</check>
<ask>Issues found. Would you like to fix them? (y/n)</ask>
<check>If yes:</check>
<goto step="5">Return to editing</goto>
</step>

<step n="7" goal="Generate change summary">
Create a summary of all changes made:

## Workflow Edit Summary

**Workflow:** {{workflow_name}}
**Date:** {{date}}
**Editor:** {{user_name}}

### Changes Made:

<action>List each file that was modified with a brief description of changes</action>

### Improvements:

<action>Summarize how the workflow is now better aligned with best practices</action>

### Files Modified:

<action>List all modified files with their paths</action>

### Next Steps:

<action>Suggest any additional improvements or testing that could be done</action>

<ask>Would you like to:

- Save this summary to: {change_log_output}
- Test the edited workflow
- Make additional edits
- Exit
  </ask>

<check>If save summary:</check>
<action>Write the summary to the change log file</action>

<check>If test workflow:</check>
<invoke-workflow>{{workflow_name}}</invoke-workflow>
</step>

</workflow>
