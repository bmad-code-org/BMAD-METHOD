# Convert Legacy - Validation Checklist

## Pre-Conversion Validation

### Source Analysis

- [ ] Original v4 file(s) fully loaded and parsed
- [ ] Item type correctly identified (agent/template/task/module)
- [ ] All dependencies documented and accounted for
- [ ] No critical content overlooked in source files

## Conversion Completeness

### For Agent Conversions

#### Content Preservation

- [ ] Agent name, id, title, and icon transferred
- [ ] All persona elements mapped to v6 structure
- [ ] All commands converted to v6 menu array (YAML)
- [ ] Dependencies properly referenced or converted
- [ ] Activation instructions adapted to v6 patterns

#### v6 Compliance (YAML Format)

- [ ] Valid YAML structure with proper indentation
- [ ] agent.metadata has all required fields (id, name, title, icon, module)
- [ ] agent.persona has all sections (role, identity, communication_style, principles)
- [ ] agent.menu uses proper handlers (workflow, action, exec, tmpl, data)
- [ ] agent.critical_actions array present when needed
- [ ] agent.prompts defined for any action: "#id" references
- [ ] File extension is .agent.yaml (will be compiled to .md later)

#### Best Practices

- [ ] Commands use appropriate workflow references instead of direct task calls
- [ ] File paths use {project-root} variables
- [ ] Config values use {config_source}: pattern
- [ ] Agent follows naming conventions (kebab-case for files)
- [ ] ALL paths reference {project-root}/.bmad/{{module}}/ locations, NOT src/
- [ ] exec, data, run-workflow commands point to final BMAD installation paths

### For Template/Workflow Conversions

#### Content Preservation

- [ ] Template metadata (name, description, output) transferred
- [ ] All sections converted to workflow steps
- [ ] Section hierarchy maintained in instructions
- [ ] Variables ({{var}}) preserved in template.md
- [ ] Elicitation points (elicit: true) converted to <invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
- [ ] Conditional sections preserved with if="" attributes
- [ ] Repeatable sections converted to repeat="" attributes

#### v6 Compliance

- [ ] workflow.yaml follows structure from workflow-creation-guide.md
- [ ] instructions.md has critical headers referencing workflow engine
- [ ] Steps numbered sequentially with clear goals
- [ ] Template variables match between instructions and template.md
- [ ] Proper use of XML tags (<action>, <check>, <ask>, <template-output>)
- [ ] File structure follows v6 pattern (folder with yaml/md files)

#### Best Practices

- [ ] Steps are focused with single goals
- [ ] Instructions are specific ("Write 1-2 paragraphs" not "Write about")
- [ ] Examples provided where helpful
- [ ] Limits set where appropriate ("3-5 items maximum")
- [ ] Save checkpoints with <template-output> at logical points
- [ ] Variables use descriptive snake_case names

### For Task Conversions

#### Content Preservation

- [ ] Task logic fully captured in workflow instructions
- [ ] Execution flow maintained
- [ ] User interaction points preserved
- [ ] Decision trees converted to workflow logic
- [ ] All processing steps accounted for
- [ ] Document generation patterns identified and preserved

#### Type Determination

- [ ] Workflow type correctly identified (document/action/interactive/meta)
- [ ] If generates documents, template.md created
- [ ] If performs actions only, marked as action workflow
- [ ] Output patterns properly analyzed

#### v6 Compliance

- [ ] Converted to proper workflow format (not standalone task)
- [ ] Follows workflow execution engine patterns
- [ ] Interactive elements use proper v6 tags
- [ ] Flow control uses v6 patterns (goto, check, loop)
- [ ] 1-9 elicitation menus converted to v6 elicitation
- [ ] Critical notices preserved in workflow.yaml
- [ ] YOLO mode converted to appropriate v6 patterns

### Module-Level Validation

#### Structure

- [ ] Module follows v6 directory structure
- [ ] All components in correct locations:
  - Agents in /agents/
  - Workflows in /workflows/
  - Data files in appropriate locations
- [ ] Config files properly formatted

#### Integration

- [ ] Cross-references between components work
- [ ] Workflow invocations use correct paths
- [ ] Data file references are valid
- [ ] No broken dependencies

## Technical Validation

### Syntax and Format

- [ ] YAML files have valid syntax (no parsing errors)
- [ ] XML structures properly formed and closed
- [ ] Markdown files render correctly
- [ ] File encoding is UTF-8
- [ ] Line endings consistent (LF)

### Path Resolution

- [ ] All file paths resolve correctly
- [ ] Variable substitutions work ({project-root}, {installed_path}, etc.)
- [ ] Config references load properly
- [ ] No hardcoded absolute paths (unless intentional)

## Functional Validation

### Execution Testing

- [ ] Converted item can be loaded without errors
- [ ] Agents activate properly when invoked
- [ ] Workflows execute through completion
- [ ] User interaction points function correctly
- [ ] Output generation works as expected

### Behavioral Validation

- [ ] Converted item behaves similarly to v4 version
- [ ] Core functionality preserved
- [ ] User experience maintains or improves
- [ ] No functionality regression

## Documentation and Cleanup

### Documentation

- [ ] Conversion report generated with all changes
- [ ] Any manual adjustments documented
- [ ] Known limitations or differences noted
- [ ] Migration instructions provided if needed

### Post-Conversion

- [ ] Original v4 files archived (if requested)
- [ ] File permissions set correctly
- [ ] Git tracking updated if applicable
- [ ] User informed of new locations

## Final Verification

### Quality Assurance

- [ ] Converted item follows ALL v6 best practices
- [ ] Code/config is clean and maintainable
- [ ] No TODO or FIXME items remain
- [ ] Ready for production use

### User Acceptance

- [ ] User reviewed conversion output
- [ ] User tested basic functionality
- [ ] User approved final result
- [ ] Any user feedback incorporated

## Notes Section

### Conversion Issues Found:

_List any issues encountered during validation_

### Manual Interventions Required:

_Document any manual fixes needed_

### Recommendations:

_Suggestions for further improvements or considerations_

---

**Validation Result:** [ ] PASSED / [ ] FAILED

**Validator:** {{user_name}}
**Date:** {{date}}
**Items Converted:** {{conversion_summary}}
