# Edit Module Workflow

Interactive workflow for editing existing BMAD modules, including structure, agents, workflows, configuration, and documentation.

## Purpose

This workflow helps you improve and maintain BMAD modules by:

- Analyzing module structure against best practices
- Managing agents and workflows within the module
- Updating configuration and documentation
- Ensuring cross-module integration works correctly
- Maintaining installer configuration (for source modules)

## When to Use

Use this workflow when you need to:

- Add new agents or workflows to a module
- Update module configuration
- Improve module documentation
- Reorganize module structure
- Set up cross-module workflow sharing
- Fix issues in module organization
- Update installer configuration

## What You'll Need

- Path to the module directory you want to edit
- Understanding of what changes you want to make
- Access to module documentation (loaded automatically)

## Workflow Steps

1. **Load and analyze target module** - Provide path to module directory
2. **Analyze against best practices** - Automatic audit of module structure
3. **Select editing focus** - Choose what aspect to edit
4. **Load relevant documentation and tools** - Auto-loads guides and workflows
5. **Perform edits** - Review and approve changes iteratively
6. **Validate all changes** - Comprehensive validation checklist
7. **Generate change summary** - Summary of improvements made

## Editing Options

The workflow provides 12 focused editing options:

1. **Fix critical issues** - Address missing files, broken references
2. **Update module config** - Edit config.yaml fields
3. **Manage agents** - Add, edit, or remove agents
4. **Manage workflows** - Add, edit, or remove workflows
5. **Update documentation** - Improve README files and guides
6. **Reorganize structure** - Fix directory organization
7. **Add new agent** - Create and integrate new agent
8. **Add new workflow** - Create and integrate new workflow
9. **Update installer** - Modify installer configuration (source only)
10. **Cross-module integration** - Set up workflow sharing with other modules
11. **Remove deprecated items** - Delete unused agents, workflows, or files
12. **Full module review** - Comprehensive analysis and improvements

## Integration with Other Workflows

This workflow integrates with:

- **edit-agent** - For editing individual agents
- **edit-workflow** - For editing individual workflows
- **create-agent** - For adding new agents
- **create-workflow** - For adding new workflows

When you select options to manage agents or workflows, the appropriate specialized workflow is invoked automatically.

## Module Structure

A proper BMAD module has:

```
module-code/
├── agents/              # Agent definitions
│   └── *.agent.yaml
├── workflows/           # Workflow definitions
│   └── workflow-name/
│       ├── workflow.yaml
│       ├── instructions.md
│       ├── checklist.md
│       └── README.md
├── config.yaml          # Module configuration
└── README.md           # Module documentation
```

## Standard Module Config

Every module config.yaml should have:

```yaml
module_name: 'Full Module Name'
module_code: 'xyz'
user_name: 'User Name'
communication_language: 'english'
output_folder: 'path/to/output'
```

Optional fields may be added for module-specific needs.

## Cross-Module Integration

Modules can share workflows:

```yaml
# In agent menu item:
workflow: '{project-root}/_bmad/other-module/workflows/shared-workflow/workflow.yaml'
```

Common patterns:

- BMM uses CIS brainstorming workflows
- All modules can use core workflows
- Modules can invoke each other's workflows

## Output

The workflow modifies module files in place, including:

- config.yaml
- Agent files
- Workflow files
- README and documentation files
- Directory structure (if reorganizing)

Changes are reviewed and approved by you before being applied.

## Best Practices

- **Start with analysis** - Let the workflow audit your module first
- **Use specialized workflows** - Let edit-agent and edit-workflow handle detailed edits
- **Update documentation** - Keep README files current with changes
- **Validate thoroughly** - Use the validation step to catch structural issues
- **Test after editing** - Invoke agents and workflows to verify they work

## Tips

- For adding agents/workflows, use options 7-8 to create and integrate in one step
- For quick config changes, use option 2 (update module config)
- Cross-module integration (option 10) helps set up workflow sharing
- Full module review (option 12) is great for inherited or legacy modules
- The workflow handles path updates when you reorganize structure

## Example Usage

```
User: I want to add a new workflow to BMM for API design
Workflow: Analyzes BMM → You choose option 8 (add new workflow)
          → Invokes create-workflow → Creates workflow
          → Integrates it into module → Updates README → Done
```

## Activation

Invoke via BMad Builder agent:

```
/bmad:bmb:agents:bmad-builder
Then select: *edit-module
```

Or directly via workflow.xml with this workflow config.

## Related Resources

- **Module Structure Guide** - Comprehensive module architecture documentation
- **BMM Module** - Example of full-featured module
- **BMB Module** - Example of builder/tooling module
- **CIS Module** - Example of workflow library module
