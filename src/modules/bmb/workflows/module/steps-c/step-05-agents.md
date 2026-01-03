---
name: 'step-05-agents'
description: 'Create agent placeholder/spec files'

nextStepFile: './step-06-workflows.md'
agentSpecTemplate: '../../templates/agent-spec-template.md'
agentArchitectureFile: '../../data/agent-architecture.md'
buildTrackingFile: '{bmb_creations_output_folder}/modules/module-build-{module_code}.md'
targetLocation: '{build_tracking_targetLocation}'
---

# Step 5: Agent Specs

## STEP GOAL:

Create agent placeholder/spec files based on the brief.

## MANDATORY EXECUTION RULES:

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

### Role Reinforcement:

- ✅ You are the **Module Builder** — creating agent specs
- ✅ These are specs, not full agents (agent-builder does that)
- ✅ Keep it high-level

---

## MANDATORY SEQUENCE

### 1. Load Agent Architecture

Load `{agentArchitectureFile}` for guidance.

### 2. Get Agent Roster from Brief

Extract from the brief:
- Agent names
- Roles
- Workflows they're responsible for
- Communication style
- Memory needs (hasSidecar)

### 3. For Each Agent, Create Spec

Load `{agentSpecTemplate}` and create:

`{targetLocation}/agents/{agent_name}.spec.md`

With content:
```markdown
# Agent Specification: {agent_name}

**Module:** {module_code}
**Status:** Placeholder — To be created via create-agent workflow
**Created:** {date}

---

## Agent Metadata

```yaml
agent:
  metadata:
    id: "_bmad/{module_code}/agents/{agent_file_name}.md"
    name: {agent_human_name}
    title: {agent_title}
    icon: {agent_icon}
    module: {module_code}
    hasSidecar: {false/true}
```

---

## Agent Persona

### Role

{agent_role}

### Identity

{agent_identity}

### Communication Style

{agent_communication_style}

### Principles

{agent_principles}

---

## Agent Menu

### Planned Commands

| Trigger | Command | Description | Workflow |
|---------|---------|-------------|----------|
{agent_menu_table}

---

## Agent Integration

### Shared Context

- References: `{shared_context_files}`
- Collaboration with: {collaborating_agents}

### Workflow References

{workflow_references}

---

## Implementation Notes

**Use the create-agent workflow to build this agent.**

---

_Spec created on {date} via BMAD Module workflow_
```

### 4. Create All Agent Specs

Iterate through each agent from the brief and create their spec file.

### 5. Update Build Tracking

Update `{buildTrackingFile}`:
- Add 'step-05-agents' to stepsCompleted
- List all agent specs created

### 6. Report Success

"**✓ Agent specs created:**"

- {count} agent spec files
- {list agent names}

"**These are specs/blueprints. Use the create-agent workflow to build each agent.**"

### 7. MENU OPTIONS

**Select an Option:** [C] Continue

- IF C: Update tracking, load `{nextStepFile}`
- IF Any other: Help, then redisplay menu

---

## Success Metrics

✅ Agent spec files created for all agents
✅ Each spec has role, workflows, menu triggers
✅ hasSidecar documented (memory decision)
✅ Build tracking updated
