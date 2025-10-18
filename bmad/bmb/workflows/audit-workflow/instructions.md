# Audit Workflow - Workflow Quality Audit Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmb/workflows/audit-workflow/workflow.yaml</critical>

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

- `config_source: "{project-root}/bmad/[module]/config.yaml"`
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

<check>If config issues found:</check>
<action>Add to issues list with severity: CRITICAL</action>
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

<check>If unused variables found:</check>
<action>Add to issues list with severity: BLOAT</action>
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

<action>Record any improper config variable usage</action>
<template-output>config_usage_issues</template-output>

<check>If config usage issues found:</check>
<action>Add to issues list with severity: IMPORTANT</action>
</step>

<step n="5" goal="Web bundle validation" optional="true">
<check>If workflow.yaml contains web_bundle section:</check>

<action>Validate web_bundle structure:</action>

**Path Validation:**

- [ ] All paths use bmad/-relative format (NOT {project-root})
- [ ] No {config_source} variables in web_bundle section
- [ ] Paths match actual file locations

**Completeness Check:**

- [ ] instructions file listed in web_bundle_files
- [ ] template file listed (if document workflow)
- [ ] validation/checklist file listed (if exists)
- [ ] All data files referenced in yaml listed
- [ ] All files referenced in instructions listed

**Workflow Dependency Scan:**
<action>Scan instructions.md for <invoke-workflow> tags</action>
<action>Extract workflow paths from invocations</action>
<action>Verify each called workflow.yaml is in web_bundle_files</action>
<action>**CRITICAL**: Check if existing_workflows field is present when workflows are invoked</action>
<action>If <invoke-workflow> calls exist, existing_workflows MUST map workflow variables to paths</action>
<action>Example: If instructions use {core_brainstorming}, web_bundle needs:
existing_workflows: - core_brainstorming: "bmad/core/workflows/brainstorming/workflow.yaml"
</action>

**File Reference Scan:**
<action>Scan instructions.md for file references in <action> tags</action>
<action>Check for CSV, JSON, YAML, MD files referenced</action>
<action>Verify all referenced files are in web_bundle_files</action>

<action>Record any missing files or incorrect paths</action>
<template-output>web_bundle_issues</template-output>

<check>If web_bundle issues found:</check>
<action>Add to issues list with severity: CRITICAL</action>

<check>If no web_bundle section exists:</check>
<action>Note: "No web_bundle configured (may be intentional for local-only workflows)"</action>
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

<check>If bloat detected:</check>
<action>Add to issues list with severity: CLEANUP</action>
</step>

<step n="7" goal="Template variable mapping" if="workflow_type == 'document'">
<action>Extract all template variables from template.md: {{variable_name}} pattern</action>
<action>Scan instructions.md for corresponding <template-output>variable_name</template-output> tags</action>

<action>Cross-reference mapping:</action>

**For each template variable:**

1. Is there a matching <template-output> tag? (mark as MAPPED)
2. Is it a standard config variable? (mark as CONFIG_VAR - optional)
3. Is it unmapped? (mark as MISSING_OUTPUT)

**For each <template-output> tag:**

1. Is there a matching template variable? (mark as USED)
2. Is it orphaned? (mark as UNUSED_OUTPUT)

<action>Verify variable naming conventions:</action>

- [ ] All template variables use snake_case
- [ ] Variable names are descriptive (not abbreviated)
- [ ] Standard config variables properly formatted

<action>Record any mapping issues</action>
<template-output>template_issues</template-output>

<check>If template issues found:</check>
<action>Add to issues list with severity: IMPORTANT</action>
</step>

<step n="8" goal="Generate comprehensive audit report">
<action>Compile all findings into a structured report</action>

<action>Write audit report to {output_folder}/audit-report-{{workflow_name}}-{{date}}.md</action>

**Report Structure:**

```markdown
# Workflow Audit Report

**Workflow:** {{workflow_name}}
**Audit Date:** {{date}}
**Auditor:** Audit Workflow (BMAD v6)
**Workflow Type:** {{workflow_type}}

---

## Executive Summary

**Overall Status:** {{overall_status}}

- Critical Issues: {{critical_count}}
- Important Issues: {{important_count}}
- Cleanup Recommendations: {{cleanup_count}}

---

## 1. Standard Config Block Validation

{{config_issues}}

**Status:** {{config_status}}

---

## 2. YAML/Instruction/Template Alignment

{{alignment_issues}}

**Variables Analyzed:** {{total_variables}}
**Used in Instructions:** {{instruction_usage_count}}
**Used in Template:** {{template_usage_count}}
**Unused (Bloat):** {{bloat_count}}

---

## 3. Config Variable Usage

{{config_usage_issues}}

**Communication Language:** {{comm_lang_status}}
**User Name:** {{user_name_status}}
**Output Folder:** {{output_folder_status}}
**Date:** {{date_status}}

---

## 4. Web Bundle Validation

{{web_bundle_issues}}

**Web Bundle Present:** {{web_bundle_exists}}
**Files Listed:** {{web_bundle_file_count}}
**Missing Files:** {{missing_files_count}}

---

## 5. Bloat Detection

{{bloat_items}}

**Bloat Percentage:** {{bloat_percentage}}%
**Cleanup Potential:** {{cleanup_potential}}

---

## 6. Template Variable Mapping

{{template_issues}}

**Template Variables:** {{template_var_count}}
**Mapped Correctly:** {{mapped_count}}
**Missing Mappings:** {{missing_mapping_count}}

---

## Recommendations

### Critical (Fix Immediately)

{{critical_recommendations}}

### Important (Address Soon)

{{important_recommendations}}

### Cleanup (Nice to Have)

{{cleanup_recommendations}}

---

## Validation Checklist

Use this checklist to verify fixes:

- [ ] All standard config variables present and correct
- [ ] No unused yaml fields (bloat removed)
- [ ] Config variables used appropriately in instructions
- [ ] Web bundle includes all dependencies
- [ ] Template variables properly mapped
- [ ] File structure follows v6 conventions

---

## Next Steps

1. Review critical issues and fix immediately
2. Address important issues in next iteration
3. Consider cleanup recommendations for optimization
4. Re-run audit after fixes to verify improvements

---

**Audit Complete** - Generated by audit-workflow v1.0
```

<action>Display summary to {user_name} in {communication_language}</action>
<action>Provide path to full audit report</action>

<ask>Would you like to:

- View the full audit report
- Fix issues automatically (invoke edit-workflow)
- Audit another workflow
- Exit
  </ask>

<template-output>audit_report_path</template-output>
</step>

</workflow>
