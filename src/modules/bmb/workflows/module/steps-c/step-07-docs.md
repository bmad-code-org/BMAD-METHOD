---
name: 'step-07-docs'
description: 'Generate README.md, TODO.md, and docs/ folder'

nextStepFile: './step-08-complete.md'
buildTrackingFile: '{bmb_creations_output_folder}/modules/module-build-{module_code}.md'
targetLocation: '{build_tracking_targetLocation}'
---

# Step 7: Documentation

## STEP GOAL:

Generate README.md, TODO.md, and user documentation in docs/ folder for the module.

## MANDATORY EXECUTION RULES:

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

### Role Reinforcement:

- ✅ You are the **Module Builder** — documentation creator
- ✅ README is the user's first impression
- ✅ TODO tracks remaining work
- ✅ docs/ provides user-facing documentation

---

## MANDATORY SEQUENCE

### 1. Generate README.md

Create `{targetLocation}/README.md`:

```markdown
# {module_display_name}

{brief_header}

{subheader}

---

## Overview

{module_overview_from_brief}

---

## Installation

```bash
bmad install {module_code}
```

---

## Quick Start

{quick_start_from_brief}

**For detailed documentation, see [docs/](docs/).**

---

## Components

### Agents

{agent_list_from_brief}

### Workflows

{workflow_list_from_brief}

---

## Configuration

The module supports these configuration options (set during installation):

{config_variables_from_module_yaml}

---

## Module Structure

```
{module_code}/
├── module.yaml
├── README.md
├── TODO.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   └── examples.md
├── agents/
├── workflows/
└── _module-installer/
```

---

## Documentation

For detailed user guides and documentation, see the **[docs/](docs/)** folder:
- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [Examples](docs/examples.md)

---

## Development Status

This module is currently in development. The following components are planned:

- [ ] Agents: {agent_count} agents
- [ ] Workflows: {workflow_count} workflows

See TODO.md for detailed status.

---

## Author

Created via BMAD Module workflow

---

## License

Part of the BMAD framework.
```

### 2. Generate TODO.md

Create `{targetLocation}/TODO.md`:

```markdown
# TODO: {module_display_name}

Development roadmap for {module_code} module.

---

## Agents to Build

{for each agent}
- [ ] {agent_name} ({agent_title})
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/{agent_name}.spec.md`

---

## Workflows to Build

{for each workflow}
- [ ] {workflow_name}
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/{workflow_name}/{workflow_name}.spec.md`

---

## Installation Testing

- [ ] Test installation with `bmad install`
- [ ] Verify module.yaml prompts work correctly
- [ ] Test installer.js (if present)
- [ ] Test IDE-specific handlers (if present)

---

## Documentation

- [ ] Complete README.md with usage examples
- [ ] Enhance docs/ folder with more guides
- [ ] Add troubleshooting section
- [ ] Document configuration options

---

## Next Steps

1. Build agents using create-agent workflow
2. Build workflows using create-workflow workflow
3. Test installation and functionality
4. Iterate based on testing

---

_Last updated: {date}_
```

### 3. Create docs/ Folder

Create `{targetLocation}/docs/` folder with user documentation:

### 3.1. getting-started.md

```markdown
# Getting Started with {module_display_name}

Welcome to {module_code}! This guide will help you get up and running.

---

## What This Module Does

{module_purpose_from_brief}

---

## Installation

If you haven't installed the module yet:

```bash
bmad install {module_code}
```

Follow the prompts to configure the module for your needs.

---

## First Steps

{first_steps_from_brief}

---

## Common Use Cases

{common_use_cases_from_brief}

---

## What's Next?

- Check out the [Agents Reference](agents.md) to meet your team
- Browse the [Workflows Reference](workflows.md) to see what you can do
- See [Examples](examples.md) for real-world usage

---

## Need Help?

If you run into issues:
1. Check the troubleshooting section in examples.md
2. Review your module configuration
3. Consult the broader BMAD documentation
```

### 3.2. agents.md

```markdown
# Agents Reference

{module_code} includes {agent_count} specialized agents:

---

{for each agent}
## {agent_title}

**ID:** `{agent_id}`
**Icon:** {agent_icon}

**Role:**
{agent_role_from_spec}

**When to Use:**
{when_to_use_from_spec}

**Key Capabilities:**
{agent_capabilities_from_spec}

**Menu Trigger(s):**
{menu_triggers_from_spec}

---
```

### 3.3. workflows.md

```markdown
# Workflows Reference

{module_code} includes {workflow_count} workflows:

---

{for each workflow}
## {workflow_title}

**ID:** `{workflow_id}`
**Workflow:** `{workflow_name}`

**Purpose:**
{workflow_purpose_from_spec}

**When to Use:**
{when_to_use_from_spec}

**Key Steps:**
{workflow_steps_outline_from_spec}

**Agent(s):**
{associated_agents_from_spec}

---
```

### 3.4. examples.md

```markdown
# Examples & Use Cases

This section provides practical examples for using {module_display_name}.

---

## Example Workflows

{example_workflows_from_brief}

---

## Common Scenarios

{common_scenarios_from_brief}

---

## Tips & Tricks

{tips_from_brief}

---

## Troubleshooting

### Common Issues

{troubleshooting_from_brief}

---

## Getting More Help

- Review the main BMAD documentation
- Check module configuration in module.yaml
- Verify all agents and workflows are properly installed
```

### 4. Update Build Tracking

Update `{buildTrackingFile}`:
- Add 'step-07-docs' to stepsCompleted
- Note: README.md, TODO.md, and docs/ folder created

### 5. Report Success

"**✓ Documentation created:**"

- README.md — module overview and navigation
- TODO.md — development roadmap
- docs/ — user documentation folder
  - getting-started.md — quick start guide
  - agents.md — agent reference
  - workflows.md — workflow reference
  - examples.md — practical examples

"**User documentation is valuable even with placeholder agent/workflow specs — users will understand what each component does and how to use them.**"

"**TODO.md tracks the remaining work:**"
- Build {agent_count} agents
- Build {workflow_count} workflows
- Test installation

### 6. MENU OPTIONS

**Select an Option:** [C] Continue

- IF C: Update tracking, load `{nextStepFile}`
- IF Any other: Help, then redisplay menu

---

## Success Metrics

✅ README.md created with all sections
✅ TODO.md created with agent/workflow checklist
✅ docs/ folder created with user documentation
✅ Build tracking updated
