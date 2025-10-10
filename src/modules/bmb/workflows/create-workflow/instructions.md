# Build Workflow - Workflow Builder Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/bmb/workflows/create-workflow/workflow.yaml</critical>
<critical>You MUST fully understand the workflow creation guide at: {workflow_creation_guide}</critical>
<critical>Study the guide thoroughly to follow ALL conventions for optimal human-AI collaboration</critical>

<step n="-1" goal="Optional brainstorming phase" optional="true">
<ask>Do you want to brainstorm workflow ideas first? [y/n]</ask>

<action if="user_response == 'y' or user_response == 'yes'">
Invoke brainstorming workflow to explore ideas and design concepts:
- Workflow: {project-root}/bmad/core/workflows/brainstorming/workflow.yaml
- Context data: {installed_path}/brainstorm-context.md
- Purpose: Generate creative workflow ideas, explore different approaches, and clarify requirements

The brainstorming output will inform:

- Workflow purpose and goals
- Workflow type selection
- Step design and structure
- User experience considerations
- Technical requirements
  </action>

<action if="user_response == 'n' or user_response == 'no'">
Skip brainstorming and proceed directly to workflow building process.
</action>
</step>

<step n="0" goal="Load and understand workflow conventions">
<action>Load the complete workflow creation guide from: {workflow_creation_guide}</action>
<action>Study all sections thoroughly including:
  - Core concepts (tasks vs workflows, workflow types)
  - Workflow structure (required/optional files, patterns)
  - Writing instructions (step attributes, XML tags, flow control)
  - Templates and variables (syntax, naming, sources)
  - Validation best practices
  - Common pitfalls to avoid
</action>
<action>Load template files from: {workflow_template_path}/</action>
<critical>You must follow ALL conventions from the guide to ensure optimal human-AI collaboration</critical>
</step>

<step n="1" goal="Define workflow purpose and type">
Ask the user:
- What is the workflow name? (kebab-case, e.g., "product-brief")
- What module will it belong to? (e.g., "bmm", "bmb", "cis")
  - Store as {{target_module}} for output path determination
- What is the workflow's main purpose?
- What type of workflow is this?
  - Document workflow (generates documents like PRDs, specs)
  - Action workflow (performs actions like refactoring)
  - Interactive workflow (guided sessions)
  - Autonomous workflow (runs without user input)
  - Meta-workflow (coordinates other workflows)

Based on type, determine which files are needed:

- Document: workflow.yaml + template.md + instructions.md + checklist.md
- Action: workflow.yaml + instructions.md
- Others: Varies based on requirements

<critical>Determine output location based on module assignment:</critical>

- If workflow belongs to module: Save to {module_output_folder}
- If standalone workflow: Save to {standalone_output_folder}

Store decisions for later use.
</step>

<step n="2" goal="Gather workflow metadata">
Collect essential configuration details:
- Description (clear purpose statement)
- Author name (default to user_name or "BMad")
- Output file naming pattern
- Any required input documents
- Any required tools or dependencies

Create the workflow name in kebab-case and verify it doesn't conflict with existing workflows.
</step>

<step n="3" goal="Design workflow steps">
Work with user to outline the workflow steps:
- How many major steps? (Recommend 5-10 max)
- What is the goal of each step?
- Which steps are optional?
- Which steps need user input?
- Which steps should repeat?
- What variables/outputs does each step produce?

Create a step outline with clear goals and outputs.
</step>

<step n="4" goal="Create workflow.yaml">
Load and use the template at: {template_workflow_yaml}

Replace all placeholders following the workflow creation guide conventions:

- {TITLE} → Proper case workflow name
- {WORKFLOW_CODE} → kebab-case name
- {WORKFLOW_DESCRIPTION} → Clear description
- {module-code} → Target module
- {file.md} → Output filename pattern

Include:

- All metadata from steps 1-2
- Proper paths for installed_path using variable substitution
- Template/instructions/validation paths based on workflow type:
  - Document workflow: all files (template, instructions, validation)
  - Action workflow: instructions only (template: false)
  - Autonomous: set autonomous: true flag
- Required tools if any
- Recommended inputs if any

Follow path conventions from guide:

- Use {project-root} for absolute paths
- Use {installed_path} for workflow components
- Use {config_source} for config references

<critical>Determine save location:</critical>

- Use the output folder determined in Step 1 (module or standalone)
- Write to {{output_folder}}/workflow.yaml
  </step>

<step n="5" goal="Create instructions.md" if="workflow_type != 'template-only'">
Load and use the template at: {template_instructions}

Generate the instructions.md file following the workflow creation guide:

1. ALWAYS include critical headers:
   - Workflow engine reference: {project_root}/bmad/core/tasks/workflow.xml
   - workflow.yaml reference: must be loaded and processed

2. Structure with <workflow> tags containing all steps

3. For each step from design phase, follow guide conventions:
   - Step attributes: n="X" goal="clear goal statement"
   - Optional steps: optional="true"
   - Repeating: repeat="3" or repeat="for-each-X" or repeat="until-approved"
   - Conditional: if="condition"
   - Sub-steps: Use 3a, 3b notation

4. Use proper XML tags from guide:
   - Execution: <action>, <check>, <ask>, <goto>, <invoke-workflow>
   - Output: <template-output>, <elicit-required/>, <critical>, <example>
   - Flow: <loop>, <break>, <continue>

5. Best practices from guide:
   - Keep steps focused (single goal)
   - Be specific ("Write 1-2 paragraphs" not "Write about")
   - Provide examples where helpful
   - Set limits ("3-5 items maximum")
   - Save checkpoints with <template-output>

<critical>Save location:</critical>

- Write to {{output_folder}}/instructions.md
  </step>

<step n="6" goal="Create template.md" if="workflow_type == 'document'">
Load and use the template at: {template_template}

Generate the template.md file following guide conventions:

1. Document structure with clear sections
2. Variable syntax: {{variable_name}} using snake_case
3. Variable names MUST match <template-output> tags exactly from instructions
4. Include standard metadata:
   - **Date:** {{date}}
   - **Author:** {{user_name}} (if applicable)
5. Follow naming conventions from guide:
   - Use descriptive names: {{primary_user_journey}} not {{puj}}
   - Snake_case for all variables
   - Match instruction outputs precisely

Variable sources as per guide:

- workflow.yaml config values
- User input runtime values
- Step outputs via <template-output>
- System variables (date, paths)

<critical>Save location:</critical>

- Write to {{output_folder}}/template.md
  </step>

<step n="7" goal="Create validation checklist" optional="true">
Ask if user wants a validation checklist. If yes:

Load and use the template at: {template_checklist}

Create checklist.md following guide best practices:

1. Make criteria MEASURABLE and SPECIFIC
   ❌ "- [ ] Good documentation"
   ✅ "- [ ] Each function has JSDoc comments with parameters and return types"

2. Group checks logically:
   - Structure: All sections present, no placeholders, proper formatting
   - Content Quality: Clear and specific, technically accurate, consistent terminology
   - Completeness: Ready for next phase, dependencies documented, action items defined

3. Include workflow-specific validations based on type:
   - Document workflows: Template variables mapped, sections complete
   - Action workflows: Actions clearly defined, error handling specified
   - Interactive: User prompts clear, decision points documented

4. Add final validation section with issue lists

<critical>Save location:</critical>

- Write to {{output_folder}}/checklist.md
  </step>

<step n="8" goal="Create supporting files" optional="true">
Ask if any supporting data files are needed:
- CSV files with data
- Example documents
- Reference materials

If yes, create placeholder files or copy from templates.
</step>

<step n="9" goal="Test and validate workflow">
Review the created workflow:
1. Verify all file paths are correct
2. Check variable names match between files
3. Ensure step numbering is sequential
4. Validate YAML syntax
5. Confirm all placeholders are replaced

Show user a summary of created files and their locations.
Ask if they want to:

- Test run the workflow
- Make any adjustments
- Add additional steps or features
  </step>

<step n="9b" goal="Configure web bundle (optional)">
<ask>Will this workflow need to be deployable as a web bundle? [yes/no]</ask>

If yes:
<action>Explain web bundle requirements:</action>

- Web bundles are self-contained and cannot use config_source variables
- All files must be explicitly listed in web_bundle_files
- File paths use bmad/ root (not {project-root})

<action>Configure web_bundle section in workflow.yaml:</action>

1. Copy core workflow metadata (name, description, author)
2. Convert all file paths to bmad/-relative paths:
   - Remove {project-root}/ prefix
   - Remove {config_source} references (use hardcoded values)
   - Example: "{project-root}/bmad/bmm/workflows/x" → "bmad/bmm/workflows/x"

3. List ALL referenced files:
   - Scan instructions.md for any file paths
   - Scan template.md for any includes or references
   - Include all data files (CSV, JSON, etc.)
   - Include any sub-workflow YAML files
   - Include any shared templates

4. Create web_bundle_files array with complete list

Example:

```yaml
web_bundle:
  name: '{workflow_name}'
  description: '{workflow_description}'
  author: '{author}'
  instructions: 'bmad/{module}/workflows/{workflow}/instructions.md'
  validation: 'bmad/{module}/workflows/{workflow}/checklist.md'
  template: 'bmad/{module}/workflows/{workflow}/template.md'

  # Any data files (no config_source)
  data_file: 'bmad/{module}/workflows/{workflow}/data.csv'

  web_bundle_files:
    - 'bmad/{module}/workflows/{workflow}/instructions.md'
    - 'bmad/{module}/workflows/{workflow}/checklist.md'
    - 'bmad/{module}/workflows/{workflow}/template.md'
    - 'bmad/{module}/workflows/{workflow}/data.csv'
    # Add every single file referenced anywhere
```

<action>Validate web bundle completeness:</action>

- Ensure no {config_source} variables remain
- Verify all file paths are listed
- Check that paths are bmad/-relative

<template-output>web_bundle_config</template-output>
</step>

<step n="10" goal="Document and finalize">
Create a brief README for the workflow folder explaining:
- Purpose and use case
- How to invoke: `workflow {workflow_name}`
- Expected inputs
- Generated outputs
- Any special requirements

Provide user with:

- Location of created workflow: {{output_folder}}
- Command to run it
- Next steps:
  - "Run the BMAD Method installer to this project location"
  - "Select the option 'Compile Agents (Quick rebuild of all agent .md files)' after confirming the folder"
  - "This will compile your new workflow and make it available for use"
    </step>

</workflow>
