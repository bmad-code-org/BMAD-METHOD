# Audit Workflow - Validation Checklist

## Structure

- [ ] workflow.yaml file loads without YAML syntax errors
- [ ] instructions.md file exists and is properly formatted
- [ ] template.md file exists (if document workflow) with valid markdown
- [ ] All critical headers present in instructions (workflow engine reference, workflow.yaml reference)
- [ ] Workflow type correctly identified (document/action/interactive/autonomous/meta)
- [ ] All referenced files actually exist at specified paths
- [ ] No placeholder text remains (like {TITLE}, {WORKFLOW_CODE}, TODO, etc.)

## Standard Config Block

- [ ] workflow.yaml contains `config_source` pointing to correct module config
- [ ] `output_folder` pulls from `{config_source}:output_folder`
- [ ] `user_name` pulls from `{config_source}:user_name`
- [ ] `communication_language` pulls from `{config_source}:communication_language`
- [ ] `date` is set to `system-generated`
- [ ] Config source uses {project-root} variable (not hardcoded path)
- [ ] Standard config comment present: "Critical variables from config"

## Config Variable Usage

- [ ] Instructions communicate in {communication_language} where appropriate
- [ ] Instructions address {user_name} in greetings or summaries where appropriate
- [ ] All file outputs write to {output_folder} or subdirectories (no hardcoded paths)
- [ ] Template includes {{user_name}} in metadata (optional for document workflows)
- [ ] Template includes {{date}} in metadata (optional for document workflows)
- [ ] Template does NOT use {{communication_language}} in headers (agent-only variable)
- [ ] No hardcoded language-specific text that should use {communication_language}
- [ ] Date used for agent date awareness (not confused with training cutoff)

## YAML/Instruction/Template Alignment

- [ ] Every workflow.yaml variable (excluding standard config) is used in instructions OR template
- [ ] No unused yaml fields present (bloat removed)
- [ ] No duplicate fields between top-level and web_bundle section
- [ ] All template variables ({{variable}}) have corresponding yaml definitions OR <template-output> tags
- [ ] All <template-output> tags have corresponding template variables (if document workflow)
- [ ] Template variables use snake_case naming convention
- [ ] Variable names are descriptive (not abbreviated like {{puj}} instead of {{primary_user_journey}})
- [ ] No hardcoded values in instructions that should be yaml variables

## Web Bundle Validation (if applicable)

- [ ] web_bundle section present if workflow needs deployment
- [ ] All paths in web_bundle use .bmad/-relative format (NOT {project-root})
- [ ] No {config_source} variables in web_bundle section
- [ ] instructions file listed in web_bundle_files array
- [ ] template file listed in web_bundle_files (if document workflow)
- [ ] validation/checklist file listed in web_bundle_files (if exists)
- [ ] All data files (CSV, JSON, YAML) listed in web_bundle_files
- [ ] All <invoke-workflow> called workflows have their .yaml files in web_bundle_files
- [ ] **CRITICAL**: If workflow invokes other workflows, existing_workflows field is present
- [ ] existing_workflows maps workflow variables to .bmad/-relative paths correctly
- [ ] All files referenced in instructions <action> tags listed in web_bundle_files
- [ ] No files listed in web_bundle_files that don't exist
- [ ] Web bundle metadata (name, description, author) matches top-level metadata

## Template Validation (if document workflow)

- [ ] Template variables match <template-output> tags in instructions exactly
- [ ] All required sections present in template structure
- [ ] Template uses {{variable}} syntax (double curly braces)
- [ ] Template variables use snake_case (not camelCase or PascalCase)
- [ ] Standard metadata header format correct (optional usage of {{date}}, {{user_name}})
- [ ] No placeholders remain in template (like {SECTION_NAME})
- [ ] Template structure matches document purpose

## Instructions Quality

- [ ] Each step has n="X" attribute with sequential numbering
- [ ] Each step has goal="clear goal statement" attribute
- [ ] Optional steps marked with optional="true"
- [ ] Repeating steps have appropriate repeat attribute (repeat="3", repeat="for-each-X", repeat="until-approved")
- [ ] Conditional steps have if="condition" attribute
- [ ] XML tags used correctly (<action>, <ask>, <check>, <goto>, <invoke-workflow>, <template-output>)
- [ ] No nested tag references in content (use "action tags" not "<action> tags")
- [ ] Tag references use descriptive text without angle brackets for clarity
- [ ] No conditional execution antipattern (no self-closing <check> tags)
- [ ] Single conditionals use <action if="condition"> (inline)
- [ ] Multiple conditionals use <check if="condition">...</check> (wrapper block with closing tag)
- [ ] Steps are focused (single goal per step)
- [ ] Instructions are specific with limits ("Write 1-2 paragraphs" not "Write about")
- [ ] Examples provided where helpful
- [ ] <template-output> tags save checkpoints for document workflows
- [ ] Flow control is logical and clear

## Bloat Detection

- [ ] Bloat percentage under 10% (unused yaml fields / total fields)
- [ ] No commented-out variables that should be removed
- [ ] No duplicate metadata between sections
- [ ] No variables defined but never referenced
- [ ] No redundant configuration that duplicates web_bundle

## Final Validation

### Critical Issues (Must fix immediately)

_List any critical issues found:_

- Issue 1:
- Issue 2:
- Issue 3:

### Important Issues (Should fix soon)

_List any important issues found:_

- Issue 1:
- Issue 2:
- Issue 3:

### Cleanup Recommendations (Nice to have)

_List any cleanup recommendations:_

- Recommendation 1:
- Recommendation 2:
- Recommendation 3:

---

## Audit Summary

**Total Checks:** 72
**Passed:** **\_** / 72
**Failed:** **\_** / 72
**Pass Rate:** **\_**%

**Recommendation:**

- Pass Rate ≥ 95%: Excellent - Ready for production
- Pass Rate 85-94%: Good - Minor fixes needed
- Pass Rate 70-84%: Fair - Important issues to address
- Pass Rate < 70%: Poor - Significant work required

---

**Audit Completed:** {{date}}
**Auditor:** Audit Workflow (BMAD v6)
