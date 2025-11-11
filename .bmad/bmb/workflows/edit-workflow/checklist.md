# Edit Workflow - Validation Checklist

## Pre-Edit Analysis

- [ ] Target workflow.yaml file successfully loaded and parsed
- [ ] All referenced workflow files identified and accessible
- [ ] Workflow type correctly determined (document/action/interactive/autonomous/meta)
- [ ] Best practices guide loaded and available for reference

## Edit Execution Quality

- [ ] User clearly informed of identified issues with priority levels
- [ ] Edit menu presented with all 8 standard options
- [ ] Selected edit type matches the actual changes made
- [ ] All proposed changes explained with reasoning before application

## File Integrity

- [ ] All modified files maintain valid YAML/Markdown syntax
- [ ] No placeholders like {TITLE} or {WORKFLOW_CODE} remain in edited files
- [ ] File paths use proper variable substitution ({project-root}, {installed_path})
- [ ] All file references resolve to actual paths

## Convention Compliance

- [ ] Instructions.md contains critical workflow engine reference header
- [ ] Instructions.md contains workflow.yaml processing reference header
- [ ] All step numbers are sequential (1, 2, 3... or 1a, 1b, 2a...)
- [ ] Each step has both n= attribute and goal= attribute
- [ ] Variable names use snake_case consistently
- [ ] Template variables (if any) match <template-output> tags exactly

## Instruction Quality

- [ ] Each step has a single, clear goal stated
- [ ] Instructions are specific with quantities (e.g., "3-5 items" not "several items")
- [ ] Optional steps marked with optional="true" attribute
- [ ] Repeating steps use proper repeat syntax (repeat="3" or repeat="until-complete")
- [ ] User prompts use <ask> tags and wait for response
- [ ] Actions use <action> tags for required operations

## Validation Criteria (if checklist.md exists)

- [ ] All checklist items are measurable and specific
- [ ] No vague criteria like "Good documentation" present
- [ ] Checklist organized into logical sections
- [ ] Each criterion can be objectively verified as true/false

## Change Documentation

- [ ] All changes logged with description of what and why
- [ ] Change summary includes list of modified files
- [ ] Improvements clearly articulated in relation to best practices
- [ ] Next steps or recommendations provided

## Post-Edit Verification

- [ ] Edited workflow follows patterns from production examples
- [ ] No functionality broken by the edits
- [ ] Workflow ready for testing or production use
- [ ] User given option to test the edited workflow

## Common Issues Resolved

- [ ] Missing critical headers added if they were absent
- [ ] Broken variable references fixed
- [ ] Vague instructions made specific
- [ ] Template-only workflows have template.md file
- [ ] Action workflows have template: false in workflow.yaml
- [ ] Step count reasonable (5-10 steps maximum unless justified)
