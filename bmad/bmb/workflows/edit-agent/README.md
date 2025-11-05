# Edit Agent Workflow

Interactive workflow for editing existing BMAD Core agents while maintaining best practices and conventions.

## Purpose

This workflow helps you refine and improve existing agents by:

- Analyzing agents against BMAD Core best practices
- Identifying issues and improvement opportunities
- Providing guided editing for specific aspects
- Validating changes against agent standards
- Ensuring consistency with agent architecture

## When to Use

Use this workflow when you need to:

- Fix issues in existing agents
- Add new menu items or workflows
- Improve agent persona or communication style
- Update configuration handling
- Convert between agent types (full/hybrid/standalone)
- Optimize agent structure and clarity

## What You'll Need

- Path to the agent file you want to edit (.yaml or .md)
- Understanding of what changes you want to make
- Access to the agent documentation (loaded automatically)

## Workflow Steps

1. **Load and analyze target agent** - Provide path to agent file
2. **Analyze against best practices** - Automatic audit of agent structure
3. **Select editing focus** - Choose what aspect to edit
4. **Load relevant documentation** - Auto-loads guides based on your choice
5. **Perform edits** - Review and approve changes iteratively
6. **Validate all changes** - Comprehensive validation checklist
7. **Generate change summary** - Summary of improvements made

## Editing Options

The workflow provides 12 focused editing options:

1. **Fix critical issues** - Address broken references, syntax errors
2. **Add/fix standard config** - Ensure config loading and variable usage
3. **Refine persona** - Improve role, communication style, principles
4. **Update activation** - Modify activation steps and greeting
5. **Manage menu items** - Add, remove, or reorganize commands
6. **Update workflow references** - Fix paths, add new workflows
7. **Enhance menu handlers** - Improve handler logic
8. **Improve command triggers** - Refine asterisk commands
9. **Optimize agent type** - Convert between full/hybrid/standalone
10. **Add new capabilities** - Add menu items, workflows, features
11. **Remove bloat** - Delete unused commands, redundant instructions
12. **Full review and update** - Comprehensive improvements

## Agent Documentation Loaded

This workflow automatically loads:

- **Agent Types Guide** - Understanding full, hybrid, and standalone agents
- **Agent Architecture** - Structure, activation, and menu patterns
- **Command Patterns** - Menu handlers and command triggers
- **Communication Styles** - Persona and communication guidance
- **Workflow Execution Engine** - How agents execute workflows

## Output

The workflow modifies your agent file in place, maintaining the original format (YAML or markdown). Changes are reviewed and approved by you before being applied.

## Best Practices

- **Start with analysis** - Let the workflow audit your agent first
- **Focus your edits** - Choose specific aspects to improve
- **Review each change** - Approve or modify proposed changes
- **Validate thoroughly** - Use the validation step to catch issues
- **Test after editing** - Invoke the edited agent to verify it works

## Tips

- If you're unsure what needs improvement, choose option 12 (Full review)
- For quick fixes, choose the specific option (like option 6 for workflow paths)
- The workflow loads documentation automatically - you don't need to read it first
- You can make multiple rounds of edits in one session
- Use the validation step to ensure you didn't miss anything

## Related Workflows

- **create-agent** - Create new agents from scratch
- **edit-workflow** - Edit workflows referenced by agents
- **audit-workflow** - Audit workflows for compliance

## Example Usage

```
User: I want to add a new workflow to the PM agent
Workflow: Analyzes agent → Loads it → You choose option 5 (manage menu items)
          → Adds new menu item with workflow reference → Validates → Done
```

## Activation

Invoke via BMad Builder agent:

```
/bmad:bmb:agents:bmad-builder
Then select: *edit-agent
```

Or directly via workflow.xml with this workflow config.
