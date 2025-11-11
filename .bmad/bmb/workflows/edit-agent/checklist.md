# Edit Agent - Validation Checklist

Use this checklist to validate agent edits meet BMAD Core standards.

## Agent Structure Validation

- [ ] Agent file format is valid (YAML or markdown/XML)
- [ ] Agent type is clearly identified (full, hybrid, standalone)
- [ ] File naming follows convention: `{agent-name}.agent.yaml` or `{agent-name}.agent.md`

## Persona Validation

- [ ] Role is clearly defined and specific
- [ ] Identity/purpose articulates what the agent does
- [ ] Communication style is specified (if custom style desired)
- [ ] Principles are listed and actionable (if applicable)

## Activation Validation

- [ ] Step 1: Loads persona from current agent file
- [ ] Step 2: Loads config file (if agent needs user context)
- [ ] Step 3: Sets user context variables (user_name, etc.)
- [ ] Step 4: Displays greeting using user_name and shows menu
- [ ] Step 5: WAITs for user input (doesn't auto-execute)
- [ ] Step 6: Processes user selection (number or trigger text)
- [ ] Step 7: Executes appropriate menu handler

## Menu Validation

- [ ] All menu items numbered sequentially
- [ ] Each item has cmd attribute with asterisk trigger (*help, *create, etc.)
- [ ] Workflow paths are correct (if workflow attribute present)
- [ ] Help command is present (\*help)
- [ ] Exit command is present (\*exit)
- [ ] Menu items are in logical order

## Configuration Validation

- [ ] Config file path is correct for module
- [ ] Config variables loaded in activation step 2
- [ ] Error handling present if config fails to load
- [ ] user_name used in greeting and communication
- [ ] communication_language used for output
- [ ] output_folder used for file outputs (if applicable)

## Menu Handler Validation

- [ ] menu-handlers section is present
- [ ] Workflow handler loads {project-root}/.bmad/core/tasks/workflow.xml
- [ ] Workflow handler passes yaml path as 'workflow-config' parameter
- [ ] Handlers check for attributes (workflow, exec, tmpl, data, action)
- [ ] Handler logic is complete and follows patterns

## Workflow Integration Validation

- [ ] All workflow paths exist and are correct
- [ ] Workflow paths use {project-root} variable
- [ ] Workflows are appropriate for agent's purpose
- [ ] Workflow parameters are passed correctly

## Communication Validation

- [ ] Agent communicates in {communication_language}
- [ ] Communication style matches persona
- [ ] Error messages are clear and helpful
- [ ] Confirmation messages for user actions

## Rules Validation

- [ ] Rules section defines agent behavior clearly
- [ ] File loading rules are specified
- [ ] Menu trigger format rules are clear
- [ ] Communication rules align with persona

## Quality Checks

- [ ] No placeholder text remains ({{AGENT_NAME}}, {ROLE}, etc.)
- [ ] No broken references or missing files
- [ ] Syntax is valid (YAML or XML)
- [ ] Indentation is consistent
- [ ] Agent purpose is clear from reading persona alone

## Type-Specific Validation

### Full Agent

- [ ] Has complete menu system with multiple items
- [ ] Loads config file for user context
- [ ] Supports multiple workflows
- [ ] Session management is clear

### Hybrid Agent

- [ ] Simplified activation (may skip some steps)
- [ ] Focused set of workflows
- [ ] May or may not have menu
- [ ] Config loading is appropriate

### Standalone Agent

- [ ] Single focused purpose
- [ ] Minimal activation (1-3 steps)
- [ ] No menu system
- [ ] Direct execution pattern
- [ ] May not need config file

## Final Checks

- [ ] Agent file has been saved
- [ ] File path is in correct module directory
- [ ] Agent is ready for testing
- [ ] Documentation is updated (if needed)
