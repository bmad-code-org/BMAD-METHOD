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
11. **Adjust instruction style** - Convert between intent-based and prescriptive styles
12. **Full review and update** - Comprehensive improvements across all files

<ask>Select an option (1-12) or describe a custom edit:</ask>
</step>

<step n="4" goal="Load relevant documentation">
Based on the selected edit type, load appropriate reference materials:

<check if="option 2 (Add/fix standard config) selected">
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
</check>

<check if="editing instructions or adding features">
  <action>Review the "Writing Instructions" section of the creation guide</action>
  <action>Load example workflows from {project-root}/bmad/bmm/workflows/ for patterns</action>
</check>

<check if="editing templates">
  <action>Review the "Templates and Variables" section of the creation guide</action>
  <action>Ensure variable naming conventions are followed</action>
</check>

<action if="editing validation">Review the "Validation" section and measurable criteria examples</action>

<check if="option 9 (Remove bloat) selected">
  <action>Cross-reference all workflow.yaml fields against instructions.md and template.md</action>
  <action>Identify yaml fields not used in any file</action>
  <action>Check for duplicate fields in web_bundle section</action>
</check>

<check if="configuring web bundle">
  <action>Review the "Web Bundles" section of the creation guide</action>
  <action>Scan all workflow files for referenced resources</action>
  <action>Create inventory of all files that must be included</action>
  <action>Scan instructions for invoke-workflow calls - those yamls must be included</action>
</check>

<check if="fixing critical issues">
  <action>Load the workflow execution engine documentation</action>
  <action>Verify all required elements are present</action>
</check>

<check if="adjusting instruction style (option 11) selected">
  <action>Analyze current instruction style in instructions.md:</action>

- Count action tags vs ask tags
- Identify goal-oriented language ("guide", "explore", "help") vs prescriptive ("choose", "select", "specify")
- Assess whether steps are open-ended or structured with specific options
  <action>Determine current dominant style: intent-based, prescriptive, or mixed</action>
  <action>Load the instruction style guide section from create-workflow</action>
  </check>
  </step>

<step n="5" goal="Perform edits" repeat="until-complete">
Based on the selected focus area:

<check if="configuring web bundle (option 7) selected">
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
7. **CRITICAL**: Check for invoke-workflow calls in instructions:
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
   </check>

<check if="adjusting instruction style (option 11) selected">
  <action>Present current style analysis to user:</action>

**Current Instruction Style Analysis:**

- Current dominant style: {{detected_style}}
- Intent-based elements: {{intent_count}}
- Prescriptive elements: {{prescriptive_count}}

**Understanding Intent-Based vs Prescriptive:**

**1. Intent-Based (Recommended)** - Guide the LLM with goals and principles, let it adapt conversations naturally

- More flexible and conversational
- LLM chooses appropriate questions based on context
- Better for complex discovery and iterative refinement
- Example: `<action>Guide user to define their target audience with specific demographics and needs</action>`

**2. Prescriptive** - Provide exact wording for questions and options

- More controlled and predictable
- Ensures consistency across runs
- Better for simple data collection or specific compliance needs
- Example: `<ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask>`

**When to use Intent-Based:**

- Complex discovery processes (user research, requirements gathering)
- Creative brainstorming and ideation
- Iterative refinement workflows
- When user input quality matters more than consistency
- Workflows requiring adaptation to context

**When to use Prescriptive:**

- Simple data collection (platform, format, yes/no choices)
- Compliance verification and standards adherence
- Configuration with finite options
- When consistency is critical across all executions
- Quick setup wizards

**Best Practice: Mix Both Styles**

Even workflows with a primary style should use the other when appropriate. For example:

```xml
<!-- Intent-based workflow with prescriptive moments -->
<step n="1" goal="Understand user vision">
  <action>Explore the user's vision, uncovering their creative intent and target experience</action>
</step>

<step n="2" goal="Capture basic metadata">
  <ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask> <!-- Prescriptive for simple choice -->
</step>

<step n="3" goal="Deep dive into details">
  <action>Guide user to articulate their approach, exploring mechanics and unique aspects</action> <!-- Back to intent-based -->
</step>
```

<ask>What would you like to do?

1. **Make more intent-based** - Convert prescriptive ask tags to goal-oriented action tags where appropriate
2. **Make more prescriptive** - Convert open-ended action tags to specific ask tags with options
3. **Optimize mix** - Use intent-based for complex steps, prescriptive for simple data collection
4. **Review specific steps** - Show me each step and let me decide individually
5. **Cancel** - Keep current style

Select option (1-5):</ask>

<action>Store user's style adjustment preference as {{style_adjustment_choice}}</action>
</check>

<check if="choice is 1 (make more intent-based)">
  <action>Identify prescriptive ask tags that could be converted to intent-based action tags</action>
  <action>For each candidate conversion:

- Show original prescriptive version
- Suggest intent-based alternative focused on goals
- Explain the benefit of the conversion
- Ask for approval
  </action>
  <action>Apply approved conversions</action>
  </check>

<check if="choice is 2 (make more prescriptive)">
  <action>Identify open-ended action tags that could be converted to prescriptive ask tags</action>
  <action>For each candidate conversion:

- Show original intent-based version
- Suggest prescriptive alternative with specific options
- Explain when prescriptive is better here
- Ask for approval
  </action>
  <action>Apply approved conversions</action>
  </check>

<check if="choice is 3 (optimize mix)">
  <action>Analyze each step for complexity and purpose</action>
  <action>Recommend style for each step:

- Simple data collection → Prescriptive
- Complex discovery → Intent-based
- Binary decisions → Prescriptive
- Creative exploration → Intent-based
- Standards/compliance → Prescriptive
- Iterative refinement → Intent-based
  </action>
  <action>Show recommendations with reasoning</action>
  <action>Apply approved optimizations</action>
  </check>

<check if="choice is 4 (review specific steps)">
  <action>Present each step one at a time</action>
  <action>For each step:

- Show current instruction text
- Identify current style (intent-based, prescriptive, or mixed)
- Offer to keep, convert to intent-based, or convert to prescriptive
- Apply user's choice before moving to next step
  </action>
  </check>

<action if="choice is 5 (cancel)"><goto step="3">Return to editing menu</goto></action>

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

<check if="user selects 'a'">
  <action>Apply the changes to the file</action>
  <action>Log the change for the summary</action>
</check>

<check if="user selects 'e'">
  <ask>What modifications would you like to make?</ask>
  <goto step="5">Regenerate with modifications</goto>
</check>

<action if="user selects 'd'"><continue>Proceed to validation</continue></action>
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

<check if="any validation fails">
  <ask>Issues found. Would you like to fix them? (y/n)</ask>
  <check if="yes">
    <goto step="5">Return to editing</goto>
  </check>
</check>
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

<action if="test workflow">Invoke the edited workflow for testing</action>
</step>

</workflow>
