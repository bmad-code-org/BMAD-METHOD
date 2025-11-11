# Convert Legacy - v4 to v6 Conversion Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<parameter name="You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/convert-legacy/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the conversion process</critical>

<workflow>

<step n="1" goal="Identify and Load Legacy Item">
<action>Ask user for the path to the v4 item to convert (agent, workflow, or module)</action>
<action>Load the complete file/folder structure</action>
<action>Detect item type based on structure and content patterns:</action>
  - Agent: Contains agent or prompt XML tags, single file
  - Workflow: Contains workflow YAML or instruction patterns, usually folder
  - Module: Contains multiple agents/workflows in organized structure
  - Task: Contains task XML tags
<ask>Confirm detected type or allow user to correct: "Detected as [type]. Is this correct? (y/n)"</ask>
</step>

<step n="2" goal="Analyze Legacy Structure">
<action>Parse the v4 structure and extract key components:</action>

For v4 Agents (YAML-based in markdown):

- Agent metadata (name, id, title, icon, whenToUse)
- Persona block (role, style, identity, focus, core_principles)
- Commands list with task/template references
- Dependencies (tasks, templates, checklists, data files)
- Activation instructions and workflow rules
- IDE file resolution patterns

For v4 Templates (YAML-based document generators):

- Template metadata (id, name, version, output)
- Workflow mode and elicitation settings
- Sections hierarchy with:
  - Instructions for content generation
  - Elicit flags for user interaction
  - Templates with {{variables}}
  - Conditional sections
  - Repeatable sections

For v4 Tasks (Markdown with execution instructions):

- Critical execution notices
- Step-by-step workflows
- Elicitation requirements (1-9 menu format)
- Processing flows and decision trees
- Agent permission rules

For Modules:

- Module metadata
- Component list (agents, workflows, tasks)
- Dependencies
- Installation requirements

<action>Create a conversion map of what needs to be transformed</action>
<action>Map v4 patterns to v6 equivalents:

- v4 Task + Template → v6 Workflow (folder with workflow.yaml, instructions.md, template.md)
- v4 Agent YAML → v6 Agent YAML format
- v4 Commands → v6 <menu> with proper handlers
- v4 Dependencies → v6 workflow references or data files
  </action>
  </step>

<step n="3" goal="Determine Target Module and Location">
<ask>Which module should this belong to? (eg. bmm, bmb, cis, bmm-legacy, or custom)</ask>
<action if="custom module"><ask>Enter custom module code (kebab-case):</ask></action>
<action>Determine installation path based on type and module</action>
<critical>IMPORTANT: All paths must use final BMAD installation locations, not src paths!</critical>
<action>Show user the target location: {project-root}/.bmad/{{target_module}}/{{item_type}}/{{item_name}}</action>
<action>Note: Files will be created in .bmad/ but all internal paths will reference {project-root}/.bmad/ locations</action>
<ask>Proceed with this location? (y/n)</ask>
</step>

<step n="4" goal="Choose Conversion Strategy">
<action>Based on item type and complexity, choose approach:</action>

<check if="agent conversion">
  <check if="simple agent (basic persona + commands)">
    <action>Use direct conversion to v6 agent YAML format</action>
    <goto step="5a">Direct Agent Conversion</goto>
  </check>
  <check if="complex agent with embedded workflows">
    <action>Plan to invoke create-agent workflow</action>
    <goto step="5b">Workflow-Assisted Agent Creation</goto>
  </check>
</check>

<check if="template or task conversion to workflow">
  <action>Analyze the v4 item to determine workflow type:</action>

- Does it generate a specific document type? → Document workflow
- Does it produce structured output files? → Document workflow
- Does it perform actions without output? → Action workflow
- Does it coordinate other tasks? → Meta-workflow
- Does it guide user interaction? → Interactive workflow

<ask>Based on analysis, this appears to be a {{detected_workflow_type}} workflow. Confirm or correct:

1. Document workflow (generates documents with template)
2. Action workflow (performs actions, no template)
3. Interactive workflow (guided session)
4. Meta-workflow (coordinates other workflows)
   Select 1-4:</ask>

<action if="template conversion"><goto step="5c">Template-to-Workflow Conversion</goto></action>
<action if="task conversion"><goto step="5e">Task-to-Workflow Conversion</goto></action>
</check>

<check if="full module conversion">
  <action>Plan to invoke create-module workflow</action>
  <goto step="5d">Module Creation</goto>
</check>
</step>

<step n="5a" goal="Direct Agent Conversion" optional="true">
<action>Transform v4 YAML agent to v6 YAML format:</action>

1. Convert agent metadata structure:
   - v4 `agent.name` → v6 `agent.metadata.name`
   - v4 `agent.id` → v6 `agent.metadata.id`
   - v4 `agent.title` → v6 `agent.metadata.title`
   - v4 `agent.icon` → v6 `agent.metadata.icon`
   - Add v6 `agent.metadata.module` field

2. Transform persona structure:
   - v4 `persona.role` → v6 `agent.persona.role` (keep as YAML string)
   - v4 `persona.style` → v6 `agent.persona.communication_style`
   - v4 `persona.identity` → v6 `agent.persona.identity`
   - v4 `persona.core_principles` → v6 `agent.persona.principles` (as array)

3. Convert commands to menu:
   - v4 `commands:` list → v6 `agent.menu:` array
   - Each command becomes menu item with:
     - `trigger:` (without \* prefix - added at build)
     - `description:`
     - Handler attributes (`workflow:`, `exec:`, `action:`, etc.)
   - Map task references to workflow paths
   - Map template references to workflow invocations

4. Add v6-specific sections (in YAML):
   - `agent.prompts:` array for inline prompts (if using action: "#id")
   - `agent.critical_actions:` array for startup requirements
   - `agent.activation_rules:` for universal agent rules

5. Handle dependencies and paths:
   - Convert task dependencies to workflow references
   - Map template dependencies to v6 workflows
   - Preserve checklist and data file references
   - CRITICAL: All paths must use {project-root}/.bmad/{{module}}/ NOT src/

<action>Generate the converted v6 agent YAML file (.agent.yaml)</action>
<action>Example path conversions:

- exec="{project-root}/.bmad/{{target_module}}/tasks/task-name.md"
- run-workflow="{project-root}/.bmad/{{target_module}}/workflows/workflow-name/workflow.yaml"
- data="{project-root}/.bmad/{{target_module}}/data/data-file.yaml"
  </action>
  <action>Save to: .bmad/{{target_module}}/agents/{{agent_name}}.agent.yaml (physical location)</action>
  <action>Note: The build process will later compile this to .md with XML format</action>
  <goto step="6">Continue to Validation</goto>
  </step>

<step n="5b" goal="Workflow-Assisted Agent Creation" optional="true">
<action>Extract key information from v4 agent:</action>
- Name and purpose
- Commands and functionality
- Persona traits
- Any special behaviors

<invoke-workflow>
  workflow: {project-root}/.bmad/bmb/workflows/create-agent/workflow.yaml
  inputs:
    - agent_name: {{extracted_name}}
    - agent_purpose: {{extracted_purpose}}
    - commands: {{extracted_commands}}
    - persona: {{extracted_persona}}
</invoke-workflow>

<goto step="6">Continue to Validation</goto>
</step>

<step n="5c" goal="Template-to-Workflow Conversion" optional="true">
<action>Convert v4 Template (YAML) to v6 Workflow:</action>

1. Extract template metadata:
   - Template id, name, version → workflow.yaml name/description
   - Output settings → default_output_file
   - Workflow mode (interactive/yolo) → workflow settings

2. Convert template sections to instructions.md:
   - Each YAML section → workflow step
   - `elicit: true` → `<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>` tag
   - Conditional sections → `if="condition"` attribute
   - Repeatable sections → `repeat="for-each"` attribute
   - Section instructions → step content

3. Extract template structure to template.md:
   - Section content fields → template structure
   - {{variables}} → preserve as-is
   - Nested sections → hierarchical markdown

4. Handle v4 create-doc.md task integration:
   - Elicitation methods (1-9 menu) → convert to v6 elicitation
   - Agent permissions → note in instructions
   - Processing flow → integrate into workflow steps

<critical>When invoking create-workflow, the standard config block will be automatically added:</critical>

```yaml
# Critical variables from config
config_source: '{project-root}/.bmad/{{target_module}}/config.yaml'
output_folder: '{config_source}:output_folder'
user_name: '{config_source}:user_name'
communication_language: '{config_source}:communication_language'
date: system-generated
```

<invoke-workflow>
  workflow: {project-root}/.bmad/bmb/workflows/create-workflow/workflow.yaml
  inputs:
    - workflow_name: {{template_name}}
    - workflow_type: document
    - template_structure: {{extracted_template}}
    - instructions: {{converted_sections}}
</invoke-workflow>

<action>Verify the created workflow.yaml includes standard config block</action>
<action>Update converted instructions to use config variables where appropriate</action>

<goto step="6">Continue to Validation</goto>
</step>

<step n="5d" goal="Module Creation" optional="true">
<action>Analyze module structure and components</action>
<action>Create module blueprint with all components</action>

<invoke-workflow>
  workflow: {project-root}/.bmad/bmb/workflows/create-module/workflow.yaml
  inputs:
    - module_name: {{module_name}}
    - components: {{component_list}}
</invoke-workflow>

<goto step="6">Continue to Validation</goto>
</step>

<step n="5e" goal="Task-to-Workflow Conversion" optional="true">
<action>Convert v4 Task (Markdown) to v6 Workflow:</action>

1. Analyze task purpose and output:
   - Does it generate documents? → Create template.md
   - Does it process data? → Action workflow
   - Does it guide user interaction? → Interactive workflow
   - Check for file outputs, templates, or document generation

2. Extract task components:
   - Execution notices and critical rules → workflow.yaml metadata
   - Step-by-step instructions → instructions.md steps
   - Decision trees and branching → flow control tags
   - User interaction patterns → appropriate v6 tags

3. Based on confirmed workflow type:
   <check if="Document workflow">
   - Create template.md from output patterns
   - Map generation steps to instructions
   - Add template-output tags for sections
     </check>

   <check if="Action workflow">
     - Set template: false in workflow.yaml
     - Focus on action sequences in instructions
     - Preserve execution logic
   </check>

4. Handle special v4 patterns:
   - 1-9 elicitation menus → v6 <invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
   - Agent permissions → note in instructions
   - YOLO mode → autonomous flag or optional steps
   - Critical notices → workflow.yaml comments

<critical>When invoking create-workflow, the standard config block will be automatically added:</critical>

```yaml
# Critical variables from config
config_source: '{project-root}/.bmad/{{target_module}}/config.yaml'
output_folder: '{config_source}:output_folder'
user_name: '{config_source}:user_name'
communication_language: '{config_source}:communication_language'
date: system-generated
```

<invoke-workflow>
  workflow: {project-root}/.bmad/bmb/workflows/create-workflow/workflow.yaml
  inputs:
    - workflow_name: {{task_name}}
    - workflow_type: {{confirmed_workflow_type}}
    - instructions: {{extracted_task_logic}}
    - template: {{generated_template_if_document}}
</invoke-workflow>

<action>Verify the created workflow.yaml includes standard config block</action>
<action>Update converted instructions to use config variables where appropriate</action>

<goto step="6">Continue to Validation</goto>
</step>

<step n="6" goal="Validate Conversion">
<action>Run validation checks on converted item:</action>

For Agents:

- [ ] Valid YAML structure (.agent.yaml)
- [ ] All required sections present (metadata, persona, menu)
- [ ] Menu items properly formatted (trigger, description, handlers)
- [ ] Paths use {project-root} variables

For Workflows:

- [ ] Valid YAML syntax
- [ ] Instructions follow v6 conventions
- [ ] Template variables match
- [ ] File structure correct

**Standard Config Validation (Workflows):**

- [ ] workflow.yaml contains standard config block:
  - config_source defined
  - output_folder, user_name, communication_language pulled from config
  - date set to system-generated
- [ ] Converted instructions use config variables where appropriate
- [ ] Template includes config variables in metadata (if document workflow)
- [ ] No hardcoded paths that should use {output_folder}
- [ ] No generic greetings that should use {user_name}

For Modules:

- [ ] All components converted
- [ ] Proper folder structure
- [ ] Config files valid
- [ ] Installation ready

<action>Show validation results to user</action>
<ask>Any issues to fix before finalizing? (y/n)</ask>
<check if="yes">
<action>Address specific issues</action>
<goto step="6">Re-validate</goto>
</check>
</step>

<step n="7" goal="Migration Report">
<action>Generate conversion report showing:</action>
- Original v4 location
- New v6 location
- Items converted
- Any manual adjustments needed
- Warnings or notes

<action>Save report to: {output_folder}/conversion-report-{{date}}.md</action>
<action>Inform {user_name} in {communication_language} that the conversion report has been generated</action>
</step>

<step n="8" goal="Cleanup and Finalize">
<ask>Archive original v4 files? (y/n)</ask>
<action if="yes">Move v4 files to: {project-root}/archive/v4-legacy/{{date}}/</action>

<action>Show user the final converted items and their locations</action>
<action>Provide any post-conversion instructions or recommendations</action>

<ask>Would you like to convert another legacy item? (y/n)</ask>
<action if="yes"><goto step="1">Start new conversion</goto></action>
</step>

</workflow>
