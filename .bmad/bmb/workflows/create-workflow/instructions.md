# Build Workflow - Workflow Builder Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/create-workflow/workflow.yaml</critical>
<critical>You MUST fully understand the workflow creation guide at: {workflow_creation_guide}</critical>
<critical>Study the guide thoroughly to follow ALL conventions for optimal human-AI collaboration</critical>
<critical>Communicate in {communication_language} throughout the workflow creation process</critical>

<workflow>

<step n="-1" goal="Optional brainstorming phase" optional="true">
<ask>Do you want to brainstorm workflow ideas first? [y/n]</ask>

<action if="user_response == 'y' or user_response == 'yes'">
Invoke brainstorming workflow to explore ideas and design concepts:
- Workflow: {project-root}/.bmad/core/workflows/brainstorming/workflow.yaml
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

<step n="2" goal="Gather workflow metadata and invocation settings">
Collect essential configuration details:
- Description (clear purpose statement)
- Author name (default to user_name or "BMad")
- Output file naming pattern
- Any required input documents
- Any required tools or dependencies

<action>Determine standalone property - this controls how the workflow can be invoked:

Explain to the user:

**Standalone Property** controls whether the workflow can be invoked directly or only called by other workflows/agents.

**standalone: true (DEFAULT - Recommended for most workflows)**:

- Users can invoke directly via IDE commands or `/workflow-name`
- Shows up in IDE command palette
- Can also be called from agent menus or other workflows
- Use for: User-facing workflows, entry-point workflows, any workflow users run directly

**standalone: false (Use for helper/internal workflows)**:

- Cannot be invoked directly by users
- Only called via `<invoke-workflow>` from other workflows or agent menus
- Doesn't appear in IDE command palette
- Use for: Internal utilities, sub-workflows, helpers that don't make sense standalone

Most workflows should be `standalone: true` to give users direct access.
</action>

<ask>Should this workflow be directly invokable by users?

1. **Yes (Recommended)** - Users can run it directly (standalone: true)
2. **No** - Only called by other workflows/agents (standalone: false)

Most workflows choose option 1:
</ask>

<action>Store {{standalone_setting}} as true or false based on response</action>

Create the workflow name in kebab-case and verify it doesn't conflict with existing workflows.
</step>

<step n="3" goal="Understand workflow interaction style and design steps">
<critical>Instruction style and interactivity level fundamentally shape the user experience - choose thoughtfully</critical>

<action>Reference the comprehensive "Instruction Styles: Intent-Based vs Prescriptive" section from the loaded creation guide</action>

<action>Discuss instruction style collaboratively with the user:

Explain that there are two primary approaches:

**Intent-Based (RECOMMENDED as default)**:

- Gives AI goals and principles, lets it adapt conversation naturally
- More flexible, conversational, responsive to user context
- Better for: discovery, complex decisions, teaching, varied user skill levels
- Uses <action> tags with guiding instructions
- Example from architecture workflow: Facilitates decisions adapting to user_skill_level

**Prescriptive**:

- Provides exact questions and specific options
- More controlled, predictable, consistent across runs
- Better for: simple data collection, finite options, compliance, quick setup
- Uses <ask> tags with specific question text
- Example: Platform selection with 5 defined choices

Explain that **most workflows should default to intent-based** but use prescriptive for simple data points.
The architecture workflow is an excellent example of intent-based with prescriptive moments.
</action>

<ask>For this workflow's PRIMARY style:

1. **Intent-based (Recommended)** - Adaptive, conversational, responds to user context
2. **Prescriptive** - Structured, consistent, controlled interactions
3. **Mixed/Balanced** - I'll help you decide step-by-step

What feels right for your workflow's purpose?
</ask>

<action>Store {{instruction_style}} preference</action>

<action>Now discuss interactivity level:

Beyond style, consider **how interactive** this workflow should be:

**High Interactivity (Collaborative)**:

- Constant back-and-forth with user
- User guides direction, AI facilitates
- Iterative refinement and review
- Best for: creative work, complex decisions, learning experiences
- Example: Architecture workflow's collaborative decision-making

**Medium Interactivity (Guided)**:

- Key decision points have interaction
- AI proposes, user confirms or refines
- Validation checkpoints
- Best for: most document workflows, structured processes
- Example: PRD workflow with sections to review

**Low Interactivity (Autonomous)**:

- Minimal user input required
- AI works independently with guidelines
- User reviews final output
- Best for: automated generation, batch processing
- Example: Generating user stories from epics
  </action>

<ask>What interactivity level suits this workflow?

1. **High** - Highly collaborative, user actively involved throughout (Recommended)
2. **Medium** - Guided with key decision points
3. **Low** - Mostly autonomous with final review

Select the level that matches your workflow's purpose:
</ask>

<action>Store {{interactivity_level}} preference</action>

<action>Explain how these choices will inform the workflow design:

- Intent-based + High interactivity: Conversational discovery with open questions
- Intent-based + Medium: Facilitated guidance with confirmation points
- Intent-based + Low: Principle-based autonomous generation
- Prescriptive + any level: Structured questions, but frequency varies
- Mixed: Strategic use of both styles where each works best
  </action>

<action>Now work with user to outline workflow steps:

- How many major steps? (Recommend 3-7 for most workflows)
- What is the goal of each step?
- Which steps are optional?
- Which steps need heavy user collaboration vs autonomous execution?
- Which steps should repeat?
- What variables/outputs does each step produce?

Consider their instruction_style and interactivity_level choices when designing step flow:

- High interactivity: More granular steps with collaboration
- Low interactivity: Larger autonomous steps with review
- Intent-based: Focus on goals and principles in step descriptions
- Prescriptive: Define specific questions and options
  </action>

<action>Create a step outline that matches the chosen style and interactivity level</action>
<action>Note which steps should be intent-based vs prescriptive (if mixed approach)</action>

<template-output>step_outline</template-output>
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
- **Standalone property**: Use {{standalone_setting}} from step 2 (true or false)
- Proper paths for installed_path using variable substitution
- Template/instructions/validation paths based on workflow type:
  - Document workflow: all files (template, instructions, validation)
  - Action workflow: instructions only (template: false)
  - Autonomous: set autonomous: true flag
- Required tools if any
- Recommended inputs if any

<critical>ALWAYS include the standard config block:</critical>

```yaml
# Critical variables from config
config_source: '{project-root}/.bmad/{{target_module}}/config.yaml'
output_folder: '{config_source}:output_folder'
user_name: '{config_source}:user_name'
communication_language: '{config_source}:communication_language'
date: system-generated
```

<critical>This standard config ensures workflows can run autonomously and communicate properly with users</critical>

<critical>ALWAYS include the standalone property:</critical>

```yaml
standalone: { { standalone_setting } } # true or false from step 2
```

**Example complete workflow.yaml structure**:

```yaml
name: 'workflow-name'
description: 'Clear purpose statement'

# Paths
installed_path: '{project-root}/.bmad/module/workflows/name'
template: '{installed_path}/template.md'
instructions: '{installed_path}/instructions.md'
validation: '{installed_path}/checklist.md'

# Critical variables from config
config_source: '{project-root}/.bmad/module/config.yaml'
output_folder: '{config_source}:output_folder'
user_name: '{config_source}:user_name'
communication_language: '{config_source}:communication_language'
date: system-generated

# Output
default_output_file: '{output_folder}/document.md'

# Invocation control
standalone: true # or false based on step 2 decision
```

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
   - Workflow engine reference: {project-root}/.bmad/core/tasks/workflow.xml
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
   - Output: <template-output>, <invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>, <critical>, <example>
   - Flow: <loop>, <break>, <continue>

5. Best practices from guide:
   - Keep steps focused (single goal)
   - Be specific ("Write 1-2 paragraphs" not "Write about")
   - Provide examples where helpful
   - Set limits ("3-5 items maximum")
   - Save checkpoints with <template-output>

<critical>Standard config variable usage:</critical>

Instructions MUST use the standard config variables where appropriate:

- Communicate in {communication_language} throughout the workflow
- Address user as {user_name} in greetings and summaries
- Write all output files to {output_folder} or subdirectories
- Include {date} in generated document headers

Example usage in instructions:

```xml
<action>Write document to {output_folder}/output-file.md</action>
<critical>Communicate all responses in {communication_language}</critical>
<output>Hello {user_name}, the workflow is complete!</output>
```

<critical>Applying instruction style preference:</critical>

Based on the {{instruction_style}} preference from Step 3, generate instructions using these patterns:

**Intent-Based Instructions (Recommended for most workflows):**

Focus on goals, principles, and desired outcomes. Let the LLM adapt the conversation naturally.

✅ **Good Examples:**

```xml
<!-- Discovery and exploration -->
<action>Guide user to define their target audience with specific demographics, psychographics, and behavioral characteristics</action>
<action>Explore the user's vision for the product, asking probing questions to uncover core motivations and success criteria</action>
<action>Help user identify and prioritize key features based on user value and technical feasibility</action>

<!-- Validation and refinement -->
<action>Validate that the technical approach aligns with project constraints and team capabilities</action>
<action>Challenge assumptions about user needs and market fit with thought-provoking questions</action>

<!-- Complex iterative work -->
<action>Collaborate with user to refine the architecture, iterating until they're satisfied with the design</action>
```

❌ **Avoid (too prescriptive):**

```xml
<ask>What is your target audience age range? Choose: 18-24, 25-34, 35-44, 45+</ask>
<ask>List exactly 3 key features in priority order</ask>
```

**When to use Intent-Based:**

- Complex discovery processes (user research, requirements gathering)
- Creative brainstorming and ideation
- Iterative refinement workflows
- When user input quality matters more than consistency
- Workflows requiring adaptation to context

**Prescriptive Instructions (Use selectively):**

Provide exact wording, specific options, and controlled interactions.

✅ **Good Examples:**

```xml
<!-- Simple data collection -->
<ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask>
<ask>Select monetization model: Premium, Free-to-Play, Subscription, Ad-Supported</ask>

<!-- Compliance and standards -->
<ask>Does this comply with GDPR requirements? [yes/no]</ask>
<ask>Choose documentation standard: JSDoc, TypeDoc, TSDoc</ask>

<!-- Binary decisions -->
<ask>Do you want to generate test cases? [yes/no]</ask>
<ask>Include performance benchmarks? [yes/no]</ask>
```

❌ **Avoid (too rigid for complex tasks):**

```xml
<ask>What are your product goals? List exactly 5 goals, each 10-15 words</ask>
<ask>Describe your user persona in exactly 3 sentences</ask>
```

**When to use Prescriptive:**

- Simple data collection (platform, format, yes/no choices)
- Compliance verification and standards adherence
- Configuration with finite options
- When consistency is critical across all executions
- Quick setup wizards

**Mixing Both Styles (Best Practice):**

Even if user chose a primary style, use the other when appropriate:

```xml
<!-- Intent-based workflow with prescriptive moments -->
<step n="1" goal="Understand user vision">
  <action>Explore the user's vision for their game, uncovering their creative intent and target experience</action>
  <action>Ask probing questions about genre, themes, and emotional tone they want to convey</action>
</step>

<step n="2" goal="Capture basic metadata">
  <ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask> <!-- Prescriptive for simple choice -->
  <ask>Select primary genre: Action, RPG, Strategy, Puzzle, Simulation, Other</ask>
</step>

<step n="3" goal="Deep dive into gameplay">
  <action>Guide user to articulate their core gameplay loop, exploring mechanics and player agency</action> <!-- Back to intent-based -->
  <action>Help them identify what makes their game unique and compelling</action>
</step>
```

**Guidelines for the chosen style:**

If user chose **Intent-Based**:

- Default to goal-oriented <action> tags
- Use open-ended guidance language
- Save prescriptive <ask> tags for simple data/choices
- Focus on "guide", "explore", "help user", "validate"
- Allow LLM to adapt questions to user responses

If user chose **Prescriptive**:

- Default to explicit <ask> tags with clear options
- Use precise wording for consistency
- Save intent-based <action> tags for complex discovery
- Focus on "choose", "select", "specify", "confirm"
- Provide structured choices when possible

**Remember:** The goal is optimal human-AI collaboration. Use whichever style best serves the user at each step.

<critical>Save location:</critical>

- Write to {{output_folder}}/instructions.md
  </step>

<step n="6" goal="Create template.md" if="workflow_type == 'document'">
Load and use the template at: {template_template}

Generate the template.md file following guide conventions:

1. Document structure with clear sections
2. Variable syntax: {{variable_name}} using snake_case
3. Variable names MUST match <template-output> tags exactly from instructions
4. Include standard metadata header (optional - config variables available):

   ```markdown
   # Document Title

   **Date:** {{date}}

   **Author:** {{user_name}}
   ```

   Note: {{date}} and {{user_name}} are optional in headers. Primary purpose of these variables:
   - {{date}} - Gives agent current date awareness (not confused with training cutoff)
   - {{user_name}} - Optional author attribution
   - {{communication_language}} - NOT for document output! Tells agent how to communicate during execution

5. Follow naming conventions from guide:
   - Use descriptive names: {{primary_user_journey}} not {{puj}}
   - Snake_case for all variables
   - Match instruction outputs precisely

Variable sources as per guide:

- workflow.yaml config values (user_name, communication_language, date, output_folder)
- User input runtime values
- Step outputs via <template-output>
- System variables (date, paths)

<critical>Standard config variables in templates:</critical>

Templates CAN optionally use these config variables:

- {{user_name}} - Document author (optional)
- {{date}} - Generation date (optional)

IMPORTANT: {{communication_language}} is NOT for document headers!

- Purpose: Tells agent how to communicate with user during workflow execution
- NOT for: Document output language or template headers
- Future: {{document_output_language}} will handle multilingual document generation

These variables are automatically available from workflow.yaml config block.

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

**Basic Validation:**

1. Verify all file paths are correct
2. Check variable names match between files
3. Ensure step numbering is sequential
4. Validate YAML syntax
5. Confirm all placeholders are replaced

**Standard Config Validation:**

6. Verify workflow.yaml contains standard config block:

- config_source defined
- output_folder, user_name, communication_language pulled from config
- date set to system-generated

7. Check instructions use config variables where appropriate
8. Verify template includes config variables in metadata (if document workflow)

**YAML/Instruction/Template Alignment:**

9. Cross-check all workflow.yaml variables against instruction usage:

- Are all yaml variables referenced in instructions.md OR template.md?
- Are there hardcoded values that should be variables?
- Do template variables match <template-output> tags in instructions?

10. Identify any unused yaml fields (bloat detection)

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
- File paths use .bmad/ root (not {project-root})

<action>Configure web_bundle section in workflow.yaml:</action>

1. Copy core workflow metadata (name, description, author)
2. Convert all file paths to .bmad/-relative paths:
   - Remove {project-root}/ prefix
   - Remove {config_source} references (use hardcoded values)
   - Example: "{project-root}/.bmad/bmm/workflows/x" → ".bmad/bmm/workflows/x"

3. List ALL referenced files by scanning:

   **Scan instructions.md for:**
   - File paths in <action> tags
   - Data files (CSV, JSON, YAML, etc.)
   - Validation/checklist files
   - Any <invoke-workflow> calls → must include that workflow's yaml file
   - Any <goto> tags that reference other workflows
   - Shared templates or includes

   **Scan template.md for:**
   - Any includes or references to other files
   - Shared template fragments

   **Critical: Workflow Dependencies**
   - If instructions call another workflow, that workflow's yaml MUST be in web_bundle_files
   - Example: `<invoke-workflow>{project-root}/.bmad/core/workflows/x/workflow.yaml</invoke-workflow>`
     → Add ".bmad/core/workflows/x/workflow.yaml" to web_bundle_files

4. Create web_bundle_files array with complete list

Example:

```yaml
web_bundle:
  name: '{workflow_name}'
  description: '{workflow_description}'
  author: '{author}'
  instructions: '.bmad/{module}/workflows/{workflow}/instructions.md'
  validation: '.bmad/{module}/workflows/{workflow}/checklist.md'
  template: '.bmad/{module}/workflows/{workflow}/template.md'

  # Any data files (no config_source)
  data_file: '.bmad/{module}/workflows/{workflow}/data.csv'

  web_bundle_files:
    - '.bmad/{module}/workflows/{workflow}/instructions.md'
    - '.bmad/{module}/workflows/{workflow}/checklist.md'
    - '.bmad/{module}/workflows/{workflow}/template.md'
    - '.bmad/{module}/workflows/{workflow}/data.csv'
    # Add every single file referenced anywhere

  # CRITICAL: If this workflow invokes other workflows, use existing_workflows
  # This signals the bundler to recursively include those workflows' web_bundles
  existing_workflows:
    - workflow_variable_name: '.bmad/path/to/workflow.yaml'
```

**Example with existing_workflows:**

```yaml
web_bundle:
  name: 'brainstorm-game'
  description: 'Game brainstorming with CIS workflow'
  author: 'BMad'
  instructions: '.bmad/bmm/workflows/brainstorm-game/instructions.md'
  template: false
  web_bundle_files:
    - '.bmad/bmm/workflows/brainstorm-game/instructions.md'
    - '.bmad/mmm/workflows/brainstorm-game/game-context.md'
    - '.bmad/core/workflows/brainstorming/workflow.yaml'
  existing_workflows:
    - core_brainstorming: '.bmad/core/workflows/brainstorming/workflow.yaml'
```

**What existing_workflows does:**

- Tells the bundler this workflow invokes another workflow
- Bundler recursively includes the invoked workflow's entire web_bundle
- Essential for meta-workflows that orchestrate other workflows
- Maps workflow variable names to their .bmad/-relative paths

<action>Validate web bundle completeness:</action>

- Ensure no {config_source} variables remain
- Verify all file paths are listed
- Check that paths are .bmad/-relative
- If workflow uses <invoke-workflow>, add to existing_workflows

<template-output>web_bundle_config</template-output>
</step>

<step n="10" goal="Document and finalize">
<action>Create a brief README for the workflow folder explaining purpose, how to invoke, expected inputs, generated outputs, and any special requirements</action>

<action>Provide {user_name} with workflow completion summary in {communication_language}:</action>

- Location of created workflow: {{output_folder}}
- Command to run it: `workflow {workflow_name}`
- Next steps:
  - Run the BMAD Method installer to this project location
  - Select 'Compile Agents (Quick rebuild of all agent .md files)' after confirming the folder
  - This will compile the new workflow and make it available for use
    </step>

</workflow>
