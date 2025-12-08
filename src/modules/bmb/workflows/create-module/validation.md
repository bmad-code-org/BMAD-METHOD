# Create Module Workflow Validation Checklist

This document provides the validation criteria used in step-11-validate.md to ensure module quality and BMAD compliance.

## Structure Validation

### Required Directories

- [ ] agents/ - Agent definition files
- [ ] workflows/ - Workflow folders
- [ ] tasks/ - Task files (if needed)
- [ ] templates/ - Shared templates
- [ ] data/ - Module data
- [ ] \_module-installer/ - Installation config
- [ ] README.md - Module documentation
- [ ] module.yaml - module config file

### Optional File in \_module-installer/

- [ ] installer.js - Custom logic (if needed)

## Configuration Validation

### module.yaml

- [ ] Valid YAML syntax
- [ ] Module code matches folder name
- [ ] Name field present
- [ ] Prompt array with welcome messages
- [ ] Configuration fields properly defined
- [ ] Result templates use correct placeholders

### Module Plan

- [ ] All sections completed
- [ ] Module identity documented
- [ ] Component plan clear
- [ ] Configuration plan documented

## Component Validation

### Agents

- [ ] Files created in agents/ folder
- [ ] YAML frontmatter valid (for created agents)
- [ ] TODO flags used for non-existent workflows
- [ ] Menu items follow BMAD patterns
- [ ] Placeholder files contain TODO notes

### Workflows

- [ ] Folders created for each planned workflow
- [ ] workflow-plan.md in each folder
- [ ] README.md in each workflow folder
- [ ] Plans include all required sections
- [ ] Placeholder READMEs created for unplanned workflows

## Documentation Validation

### README.md

- [ ] Module name and purpose
- [ ] Installation instructions
- [ ] Components section
- [ ] Quick start guide
- [ ] Module structure diagram
- [ ] Configuration section
- [ ] Usage examples
- [ ] Development status
- [ ] Author information

### TODO.md

- [ ] Development phases defined
- [ ] Tasks prioritized
- [ ] Quick commands included
- [ ] Completion criteria defined

## Integration Validation

### Path Consistency

- [ ] All paths use correct template format
- [ ] Module code consistent throughout
- [ ] No hardcoded paths
- [ ] Cross-references correct

### Agent-Workflow Integration

- [ ] Agents reference correct workflows
- [ ] TODO flags used appropriately
- [ ] No circular dependencies
- [ ] Clear integration points

## BMAD Compliance

### Standards

- [ ] Follows BMAD module structure
- [ ] Uses BMAD installation patterns
- [ ] Agent files follow BMAD format
- [ ] Workflow plans follow BMAD patterns

### Best Practices

- [ ] Clear naming conventions
- [ ] Proper documentation
- [ ] Version control ready
- [ ] Installable via bmad install

## Final Checklist

### Before Marking Complete

- [ ] All validation items checked
- [ ] Critical issues resolved
- [ ] Module plan updated with final status
- [ ] stepsCompleted includes all 11 steps
- [ ] User satisfied with result

### Ready for Testing

- [ ] Installation should work
- [ ] Documentation accurate
- [ ] Structure complete
- [ ] Next steps clear
