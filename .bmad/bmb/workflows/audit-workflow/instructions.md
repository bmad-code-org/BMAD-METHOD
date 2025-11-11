# Audit Workflow - Workflow Quality Audit Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/audit-workflow/workflow.yaml</critical>

<workflow>

  <step n="1" goal="Load and analyze target workflow">
    <ask>What is the path to the workflow you want to audit? (provide path to workflow.yaml or workflow folder)</ask>

    <action>Load the workflow.yaml file from the provided path</action>
    <action>Identify the workflow type (document, action, interactive, autonomous, meta)</action>
    <action>List all associated files:</action>

    - instructions.md (required for most workflows)
    - template.md (if document workflow)
    - checklist.md (if validation exists)
    - Any data files referenced in yaml

    <action>Load all discovered files</action>

    Display summary:

    - Workflow name and description
    - Type of workflow
    - Files present
    - Module assignment

  </step>

  <step n="2" goal="Validate standard config block">
    <action>Check workflow.yaml for the standard config block:</action>

    **Required variables:**

    - `config_source: "{project-root}/.bmad/[module]/config.yaml"`
    - `output_folder: "{config_source}:output_folder"`
    - `user_name: "{config_source}:user_name"`
    - `communication_language: "{config_source}:communication_language"`
    - `date: system-generated`

    <action>Validate each variable:</action>

    **Config Source Check:**

    - [ ] `config_source` is defined
    - [ ] Points to correct module config path
    - [ ] Uses {project-root} variable

    **Standard Variables Check:**

    - [ ] `output_folder` pulls from config_source
    - [ ] `user_name` pulls from config_source
    - [ ] `communication_language` pulls from config_source
    - [ ] `date` is set to system-generated

    <action>Record any missing or incorrect config variables</action>
    <template-output>config_issues</template-output>

    <action if="config issues found">Add to issues list with severity: CRITICAL</action>

  </step>

  <step n="3" goal="Analyze YAML/Instruction/Template alignment">
    <action>Extract all variables defined in workflow.yaml (excluding standard config block)</action>
    <action>Scan instructions.md for variable usage: {variable_name} pattern</action>
    <action>Scan template.md for variable usage: {{variable_name}} pattern (if exists)</action>

    <action>Cross-reference analysis:</action>

    **For each yaml variable:**

    1. Is it used in instructions.md? (mark as INSTRUCTION_USED)
    2. Is it used in template.md? (mark as TEMPLATE_USED)
    3. Is it neither? (mark as UNUSED_BLOAT)

    **Special cases to ignore:**

    - Standard config variables (config_source, output_folder, user_name, communication_language, date)
    - Workflow metadata (name, description, author)
    - Path variables (installed_path, template, instructions, validation)
    - Web bundle configuration (web_bundle block itself)

    <action>Identify unused yaml fields (bloat)</action>
    <action>Identify hardcoded values in instructions that should be variables</action>
    <template-output>alignment_issues</template-output>

    <action if="unused variables found">Add to issues list with severity: BLOAT</action>

  </step>

  <step n="4" goal="Config variable usage audit">
    <action>Analyze instructions.md for proper config variable usage:</action>

    **Communication Language Check:**

    - Search for phrases like "communicate in {communication_language}"
    - Check if greetings/responses use language-aware patterns
    - Verify NO usage of {{communication_language}} in template headers

    **User Name Check:**

    - Look for user addressing patterns using {user_name}
    - Check if summaries or greetings personalize with {user_name}
    - Verify optional usage in template metadata (not required)

    **Output Folder Check:**

    - Search for file write operations
    - Verify all outputs go to {output_folder} or subdirectories
    - Check for hardcoded paths like "/output/" or "/generated/"

    **Date Usage Check:**

    - Verify date is available for agent date awareness
    - Check optional usage in template metadata
    - Ensure no confusion between date and model training cutoff

    **Nested Tag Reference Check:**

    - Search for XML tag references within tags (e.g., `<action>Scan for <action> tags</action>`)
    - Identify patterns like: `<tag-name> tags`, `<tag-name> calls`, `<tag-name>content</tag-name>` within content
    - Common problematic tags to check: action, ask, check, template-output, invoke-workflow, goto
    - Flag any instances where angle brackets appear in content describing tags

    **Best Practice:** Use descriptive text without brackets (e.g., "action tags" instead of "<action> tags")

    **Rationale:**

    - Prevents XML parsing ambiguity
    - Improves readability for humans and LLMs
    - LLMs understand "action tags" = `<action>` tags from context

    **Conditional Execution Antipattern Check:**

    - Scan for self-closing check tags: `<check>condition text</check>` (invalid antipattern)
    - Detect pattern: check tag on one line, followed by action/ask/goto tags (indicates incorrect nesting)
    - Flag sequences like: `<check>If X:</check>` followed by `<action>do Y</action>`

    **Correct Patterns:**

    - Single conditional: `<action if="condition">Do something</action>`
    - Multiple actions: `<check if="condition">` followed by nested actions with closing `</check>` tag

    **Antipattern Example (WRONG):**
    ```xml
    <check>If condition met:</check>
    <action>Do something</action>
    ```

    **Correct Example:**
    ```xml
    <check if="condition met">
      <action>Do something</action>
      <action>Do something else</action>
    </check>
    ```

    **Or for single action:**
    ```xml
    <action if="condition met">Do something</action>
    ```

    <action>Scan instructions.md for nested tag references using pattern: &lt;(action|ask|check|template-output|invoke-workflow|invoke-task|goto|step)&gt; within text content</action>
    <action>Record any instances of nested tag references with line numbers</action>
    <action>Scan instructions.md for conditional execution antipattern: self-closing check tags</action>
    <action>Detect pattern: `&lt;check&gt;.*&lt;/check&gt;` on single line (self-closing check)</action>
    <action>Record any antipattern instances with line numbers and suggest corrections</action>
    <action>Record any improper config variable usage</action>
    <template-output>config_usage_issues</template-output>

    <action if="config usage issues found">Add to issues list with severity: IMPORTANT</action>
    <action if="nested tag references found">Add to issues list with severity: CLARITY (recommend using descriptive text without angle brackets)</action>
    <action if="conditional antipattern found">Add to issues list with severity: CRITICAL (invalid XML structure - must use action if="" or proper check wrapper)</action>

  </step>

  <step n="5" goal="Web bundle validation" optional="true">
    <check if="workflow.yaml contains web_bundle section">

      <action>Validate web_bundle structure:</action>

      **Path Validation:**

      - [ ] All paths use .bmad/-relative format (NOT {project-root})
      - [ ] No {config_source} variables in web_bundle section
      - [ ] Paths match actual file locations

      **Completeness Check:**

      - [ ] instructions file listed in web_bundle_files
      - [ ] template file listed (if document workflow)
      - [ ] validation/checklist file listed (if exists)
      - [ ] All data files referenced in yaml listed
      - [ ] All files referenced in instructions listed

      **Workflow Dependency Scan:**
      <action>Scan instructions.md for invoke-workflow tags</action>
      <action>Extract workflow paths from invocations</action>
      <action>Verify each called workflow.yaml is in web_bundle_files</action>
      <action>**CRITICAL**: Check if existing_workflows field is present when workflows are invoked</action>
      <action>If invoke-workflow calls exist, existing_workflows MUST map workflow variables to paths</action>
      <action>Example: If instructions use {core_brainstorming}, web_bundle needs: existing_workflows: - core_brainstorming: ".bmad/core/workflows/brainstorming/workflow.yaml"</action>

      **File Reference Scan:**
      <action>Scan instructions.md for file references in action tags</action>
      <action>Check for CSV, JSON, YAML, MD files referenced</action>
      <action>Verify all referenced files are in web_bundle_files</action>

      <action>Record any missing files or incorrect paths</action>
      <template-output>web_bundle_issues</template-output>

      <action if="web_bundle issues found">Add to issues list with severity: CRITICAL</action>

      <action if="no web_bundle section exists">Note: "No web_bundle configured (may be intentional for local-only workflows)"</action>
    </check>

  </step>

  <step n="6" goal="Bloat detection">
    <action>Identify bloat patterns:</action>

    **Unused YAML Fields:**

    - Variables defined but not used in instructions OR template
    - Duplicate fields between top-level and web_bundle section
    - Commented-out variables that should be removed

    **Hardcoded Values:**

    - File paths that should use {output_folder}
    - Generic greetings that should use {user_name}
    - Language-specific text that should use {communication_language}
    - Static dates that should use {date}

    **Redundant Configuration:**

    - Variables that duplicate web_bundle fields
    - Metadata repeated across sections

    <action>Calculate bloat metrics:</action>

    - Total yaml fields: {{total_yaml_fields}}
    - Used fields: {{used_fields}}
    - Unused fields: {{unused_fields}}
    - Bloat percentage: {{bloat_percentage}}%

    <action>Record all bloat items with recommendations</action>
    <template-output>bloat_items</template-output>

    <action if="bloat detected">Add to issues list with severity: CLEANUP</action>

  </step>

  <step n="7" goal="Template variable mapping" if="workflow_type == 'document'">
    <action>Extract all template variables from template.md: {{variable_name}} pattern</action>
    <action>Scan instructions.md for corresponding template-output tags</action>

    <action>Cross-reference mapping:</action>

    **For each template variable:**

    1. Is there a matching template-output tag? (mark as MAPPED)
    2. Is it a standard config variable? (mark as CONFIG_VAR - optional)
    3. Is it unmapped? (mark as MISSING_OUTPUT)

    **For each template-output tag:**

    1. Is there a matching template variable? (mark as USED)
    2. Is it orphaned? (mark as UNUSED_OUTPUT)

    <action>Verify variable naming conventions:</action>

    - [ ] All template variables use snake_case
    - [ ] Variable names are descriptive (not abbreviated)
    - [ ] Standard config variables properly formatted

    <action>Record any mapping issues</action>
    <template-output>template_issues</template-output>

    <action if="template issues found">Add to issues list with severity: IMPORTANT</action>

  </step>

  <step n="8" goal="Generate comprehensive audit report">
    <action>Compile all findings and calculate summary metrics</action>

    <action>Generate executive summary based on issue counts and severity levels</action>
    <template-output>workflow_type</template-output>
    <template-output>overall_status</template-output>
    <template-output>critical_count</template-output>
    <template-output>important_count</template-output>
    <template-output>cleanup_count</template-output>

    <action>Generate status summaries for each audit section</action>
    <template-output>config_status</template-output>
    <template-output>total_variables</template-output>
    <template-output>instruction_usage_count</template-output>
    <template-output>template_usage_count</template-output>
    <template-output>bloat_count</template-output>

    <action>Generate config variable usage status indicators</action>
    <template-output>comm_lang_status</template-output>
    <template-output>user_name_status</template-output>
    <template-output>output_folder_status</template-output>
    <template-output>date_status</template-output>
    <template-output>nested_tag_count</template-output>

    <action>Generate web bundle metrics</action>
    <template-output>web_bundle_exists</template-output>
    <template-output>web_bundle_file_count</template-output>
    <template-output>missing_files_count</template-output>

    <action>Generate bloat metrics</action>
    <template-output>bloat_percentage</template-output>
    <template-output>cleanup_potential</template-output>

    <action>Generate template mapping metrics</action>
    <template-output>template_var_count</template-output>
    <template-output>mapped_count</template-output>
    <template-output>missing_mapping_count</template-output>

    <action>Compile prioritized recommendations by severity</action>
    <template-output>critical_recommendations</template-output>
    <template-output>important_recommendations</template-output>
    <template-output>cleanup_recommendations</template-output>

    <action>Display summary to {user_name} in {communication_language}</action>
    <action>Provide path to full audit report: {output_folder}/audit-report-{{workflow_name}}-{{date}}.md</action>

    <ask>Would you like to:

    - View the full audit report
    - Fix issues automatically (invoke edit-workflow)
    - Audit another workflow
    - Exit
    </ask>

  </step>

</workflow>
