# Edit Agent Workflow

Interactive workflow for editing existing BMAD agents while maintaining best practices and modern standards.

## Purpose

This workflow helps you refine and improve existing agents by:

- Analyzing agents against BMAD best practices
- **Fixing persona field separation issues** (the #1 quality problem)
- Identifying issues and improvement opportunities
- Providing guided editing for specific aspects
- Validating changes against agent standards
- Ensuring consistency with modern agent architecture (Simple/Expert/Module)
- Migrating from legacy patterns (full/hybrid/standalone)

## When to Use

Use this workflow when you need to:

- **Fix persona field separation** (communication_style has behaviors mixed in)
- Fix issues in existing agents (broken paths, invalid references)
- Add new menu items or workflows
- Improve agent persona or communication style
- Update configuration handling
- Migrate from legacy terminology (full/hybrid/standalone → Simple/Expert/Module)
- Convert between agent types
- Optimize agent structure and clarity
- Update legacy agents to modern BMAD standards

## What You'll Need

- Path to the agent file or folder you want to edit:
  - Simple agent: path to .agent.yaml file
  - Expert agent: path to folder containing .agent.yaml and sidecar files
- Understanding of what changes you want to make (or let the workflow analyze and suggest)
- Access to the agent documentation (loaded automatically)

## Workflow Steps

1. **Load and analyze target agent** - Provide path to agent file
2. **Discover improvement goals collaboratively** - Discuss what needs improvement and why
3. **Facilitate improvements iteratively** - Make changes collaboratively with approval
4. **Validate all changes holistically** - Comprehensive validation checklist
5. **Review improvements and guide next steps** - Summary and guidance

## Common Editing Scenarios

The workflow handles these common improvement needs:

1. **Fix persona field separation** - Extract behaviors from communication_style to principles (MOST COMMON)
2. **Fix critical issues** - Address broken references, syntax errors
3. **Edit sidecar files** - Update templates, knowledge bases, docs (Expert agents)
4. **Add/fix standard config** - Ensure config loading and variable usage
5. **Refine persona** - Improve role, identity, communication style, principles
6. **Update activation** - Modify activation steps and greeting
7. **Manage menu items** - Add, remove, or reorganize commands
8. **Update workflow references** - Fix paths, add new workflows
9. **Enhance menu handlers** - Improve handler logic
10. **Improve command triggers** - Refine asterisk commands
11. **Migrate agent type** - Convert from legacy full/hybrid/standalone to Simple/Expert/Module
12. **Add new capabilities** - Add menu items, workflows, features
13. **Remove bloat** - Delete unused commands, redundant instructions, orphaned sidecar files
14. **Full review and update** - Comprehensive improvements

**Most agents need persona field separation fixes** - this is the #1 quality issue found in legacy agents.

## Agent Documentation Loaded

This workflow automatically loads comprehensive agent documentation:

**Core Concepts:**

- **Understanding Agent Types** - Simple, Expert, Module distinctions (architecture, not capability)
- **Agent Compilation** - How YAML compiles to XML and what auto-injects

**Architecture Guides:**

- **Simple Agent Architecture** - Self-contained agents (NOT capability-limited!)
- **Expert Agent Architecture** - Agents with sidecar files (templates, docs, knowledge)
- **Module Agent Architecture** - Ecosystem-integrated agents (design intent)

**Design Patterns:**

- **Agent Menu Patterns** - Menu handlers, command structure, workflow integration
- **Communication Presets** - 60 pure communication styles across 13 categories
- **Brainstorm Context** - Creative ideation for persona development

**Reference Implementations:**

- **commit-poet** (Simple) - Shows Simple agents can be powerful and sophisticated
- **journal-keeper** (Expert) - Shows sidecar structure with memories and patterns
- **security-engineer** (Module) - Shows design intent and ecosystem integration
- **All BMM agents** - Examples of distinct, memorable communication voices

**Workflow Execution Engine** - How agents execute workflows

## Critical: Persona Field Separation

**THE #1 ISSUE** in legacy agents is persona field separation. The workflow checks for this automatically.

### What Is Persona Field Separation?

Each persona field serves a specific purpose that the LLM uses when activating:

- **role** → "What knowledge, skills, and capabilities do I possess?"
- **identity** → "What background, experience, and context shape my responses?"
- **communication_style** → "What verbal patterns, word choice, quirks do I use?"
- **principles** → "What beliefs and philosophy drive my choices?"

### The Problem

Many agents have behaviors/role/identity mixed into communication_style:

**WRONG:**

```yaml
communication_style: 'Experienced analyst who ensures all stakeholders are heard and uses systematic approaches'
```

**RIGHT:**

```yaml
identity: 'Senior analyst with 8+ years connecting market insights to strategy'
communication_style: 'Treats analysis like a treasure hunt - excited by every clue, thrilled when patterns emerge'
principles:
  - 'Ensure all stakeholder voices heard'
  - 'Use systematic, structured approaches'
```

### Red Flag Words

If communication_style contains these words, it needs fixing:

- "ensures", "makes sure", "always", "never" → Behaviors (move to principles)
- "experienced", "expert who", "senior" → Identity (move to identity/role)
- "believes in", "focused on" → Philosophy (move to principles)

## Output

The workflow modifies your agent file in place, maintaining the original format (YAML). Changes are reviewed and approved by you before being applied.

## Best Practices

- **Start with analysis** - Let the workflow audit your agent first
- **Check persona field separation FIRST** - This is the #1 issue in legacy agents
- **Use reference agents as guides** - Compare against commit-poet, journal-keeper, BMM agents
- **Focus your edits** - Choose specific aspects to improve
- **Review each change** - Approve or modify proposed changes
- **Validate persona purity** - Communication_style should have ZERO red flag words
- **Validate thoroughly** - Use the validation step to catch all issues
- **Test after editing** - Invoke the edited agent to verify it works

## Tips

- **Most common fix needed:** Persona field separation - communication_style has behaviors/role mixed in
- If you're unsure what needs improvement, let the workflow analyze the agent first
- For quick fixes, tell the workflow specifically what needs fixing
- The workflow loads documentation automatically - you don't need to read it first
- You can make multiple rounds of edits in one session
- **Red flag words in communication_style:** "ensures", "makes sure", "experienced", "expert who", "believes in"
- Compare your agent's communication_style against the presets CSV - should be similarly pure
- Use the validation step to ensure you didn't miss anything

## Example Usage

**Scenario 1: Fix persona field separation (most common)**

```
User: Edit the analyst agent
Workflow: Loads agent → Analyzes → Finds communication_style has "ensures stakeholders heard"
          → Explains this is behavior, should be in principles
          → Extracts behaviors to principles
          → Crafts pure communication style: "Treats analysis like a treasure hunt"
          → Validates → Done
```

**Scenario 2: Add new workflow**

```
User: I want to add a new workflow to the PM agent
Workflow: Analyzes agent → User describes what workflow to add
          → Adds new menu item with workflow reference
          → Validates all paths resolve → Done
```

**Scenario 2b: Edit Expert agent sidecar files**

```
User: Edit the journal-keeper agent - I want to update the daily journal template
Workflow: Loads folder → Finds .agent.yaml + 3 sidecar templates + 1 knowledge file
          → Analyzes → Loads daily.md template
          → User describes changes to template
          → Updates daily.md, shows before/after
          → Validates menu item 'daily-journal' still references it correctly → Done
```

**Scenario 3: Migrate from legacy type**

```
User: This agent says it's a "full agent" - what does that mean now?
Workflow: Explains Simple/Expert/Module types
          → Identifies agent is actually Simple (single file)
          → Updates any legacy terminology in comments
          → Validates structure matches type → Done
```

## Related Workflows

- **create-agent** - Create new agents from scratch with proper field separation
- **edit-workflow** - Edit workflows referenced by agents
- **audit-workflow** - Audit workflows for compliance

## Activation

Invoke via BMad Builder agent:

```
/bmad:bmb:agents:bmad-builder
Then select: *edit-agent
```

Or directly via workflow.xml with this workflow config.

## Quality Standards

After editing with this workflow, your agent will meet these quality standards:

✓ Persona fields properly separated (communication_style is pure verbal patterns)
✓ Agent type matches structure (Simple/Expert/Module)
✓ All workflow paths resolve correctly
✓ Activation flow is robust
✓ Menu structure is clear and logical
✓ Handlers properly invoke workflows
✓ Config loading works correctly
✓ No legacy terminology (full/hybrid/standalone)
✓ Comparable quality to reference agents

This workflow ensures your agents meet the same high standards as the reference implementations and recently enhanced BMM agents.
