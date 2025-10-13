# Build Agent

## Overview

The Build Agent workflow is an interactive agent builder that guides you through creating BMAD Core compliant agents as YAML source files that compile to final `.md` during install. It supports three agent types: Simple (self-contained), Expert (with sidecar resources), and Module (full-featured with workflows).

## Key Features

- **Optional Brainstorming**: Creative ideation session before agent building to explore concepts and personalities
- **Three Agent Types**: Simple, Expert, and Module agents with appropriate structures
- **Persona Development**: Guided creation of role, identity, communication style, and principles
- **Command Builder**: Interactive command definition with workflow/task/action patterns
- **Validation Built-In**: Ensures YAML structure and BMAD Core compliance
- **Customize Support**: Optional `customize.yaml` for persona/menu overrides and critical actions
- **Sidecar Resources**: Setup for Expert agents with domain-specific data

## Usage

### Basic Invocation

```bash
workflow create-agent
```

### Through BMad Builder Agent

```
*create-agent
```

### With Brainstorming Session

The workflow includes an optional brainstorming phase (Step -1) that helps you explore agent concepts, personalities, and capabilities before building. This is particularly useful when you have a vague idea and want to develop it into a concrete agent concept.

### What You'll Be Asked

0. **Optional brainstorming** (vague idea → refined concept)
1. Agent type (Simple, Expert, or Module)
2. Basic identity (name, title, icon, filename)
3. Module assignment (for Module agents)
4. Sidecar resources (for Expert agents)
5. Persona elements (role, identity, style, principles)
6. Commands and their implementations
7. Critical actions (optional)
8. Activation rules (optional, rarely needed)

## Workflow Structure

### Files Included

```
create-agent/
├── workflow.yaml                  # Configuration
├── instructions.md                # Step-by-step guide
├── checklist.md                   # Validation criteria
├── README.md                      # This file
├── agent-types.md                 # Agent type documentation
├── agent-architecture.md          # Architecture patterns
├── agent-command-patterns.md      # Command patterns reference
└── communication-styles.md        # Style examples
```

## Workflow Process

### Phase 0: Optional Brainstorming (Step -1)

- Creative ideation session using diverse brainstorming techniques
- Explore agent concepts, personalities, and capabilities
- Generate character ideas, expertise areas, and command concepts
- Output feeds directly into agent identity and persona development

### Phase 1: Agent Setup (Steps 0-2)

- Load agent building documentation and patterns
- Choose agent type (Simple/Expert/Module)
- Define basic identity (name, title, icon, filename) - informed by brainstorming if completed
- Assign to module (for Module agents)

### Phase 2: Persona Development (Steps 2-3)

- Define role and responsibilities - leveraging brainstorming insights if available
- Craft unique identity and backstory
- Select communication style - can use brainstormed personality concepts
- Establish guiding principles
- Add critical actions (optional)

### Phase 3: Command Building (Step 4)

- Add *help and *exit commands (required)
- Define workflow commands (most common)
- Add task commands (for single operations)
- Create action commands (inline logic)
- Configure command attributes

### Phase 4: Finalization (Steps 5-10)

- Confirm activation behavior (mostly automatic)
- Generate `.agent.yaml` file
- Optionally create a customize file for overrides
- Setup sidecar resources (for Expert agents)
- Validate YAML and compile to `.md`
- Provide usage instructions

## Output

### Generated Files

#### For Standalone Agents (not part of a module)

- **YAML Source**: `{custom_agent_location}/{{agent_filename}}.agent.yaml` (default: `bmad/agents/`)
- **Installation Location**: `{project-root}/bmad/agents/{{agent_filename}}.md`
- **Compilation**: Run the BMAD Method installer and select "Compile Agents (Quick rebuild of all agent .md files)"

#### For Module Agents

- **YAML Source**: `src/modules/{{target_module}}/agents/{{agent_filename}}.agent.yaml`
- **Installation Location**: `{project-root}/bmad/{{module}}/agents/{{agent_filename}}.md`
- **Compilation**: Automatic during module installation

### YAML Agent Structure (simplified)

```yaml
agent:
  metadata:
    id: bmad/{{module}}/agents/{{agent_filename}}.md
    name: { { agent_name } }
    title: { { agent_title } }
    icon: { { agent_icon } }
    module: { { module } }
  persona:
    role: '...'
    identity: '...'
    communication_style: '...'
    principles: ['...', '...']
  menu:
    - trigger: example
      workflow: '{project-root}/path/to/workflow.yaml'
      description: Do the thing
```

### Optional Customize File

If created, generates at:
`{project-root}/bmad/_cfg/agents/{{module}}-{{agent_filename}}.customize.yaml`

## Installation and Compilation

### Agent Installation Locations

Agents are installed to different locations based on their type:

1. **Standalone Agents** (not part of a module)
   - Source: Created in your custom agent location (default: `bmad/agents/`)
   - Installed to: `{project-root}/bmad/agents/`
   - Compilation: Run BMAD Method installer and select "Compile Agents"

2. **Module Agents** (part of BMM, BMB, or custom modules)
   - Source: Created in `src/modules/{module}/agents/`
   - Installed to: `{project-root}/bmad/{module}/agents/`
   - Compilation: Automatic during module installation

### Compilation Process

The installer compiles YAML agent definitions to Markdown:

```bash
# For standalone agents
npm run build:agents

# For all BMad components (includes agents)
npm run install:bmad

# Using the installer menu
npm run installer
# Then select: Compile Agents
```

### Build Commands

Additional build commands for agent management:

```bash
# Build specific agent types
npx bmad-method build:agents        # Build standalone agents
npx bmad-method build:modules        # Build module agents (with modules)

# Full rebuild
npx bmad-method build:all           # Rebuild everything
```

## Requirements

- BMAD Core v6 project structure
- Module to host the agent (for Module agents)
- Understanding of agent purpose and commands
- Workflows/tasks to reference in commands (or mark as "todo")

## Brainstorming Integration

The optional brainstorming phase (Step -1) provides a seamless path from vague idea to concrete agent concept:

### When to Use Brainstorming

- **Vague concept**: "I want an agent that helps with data stuff"
- **Creative exploration**: Want to discover unique personality and approach
- **Team building**: Creating agents for a module with specific roles
- **Character development**: Need to flesh out agent personality and voice

### Brainstorming Flow

1. **Step -1**: Optional brainstorming session
   - Uses CIS brainstorming workflow with agent-specific context
   - Explores identity, personality, expertise, and command concepts
   - Generates detailed character and capability ideas

2. **Steps 0-2**: Agent setup informed by brainstorming
   - Brainstorming output guides agent type selection
   - Character concepts inform basic identity choices
   - Personality insights shape persona development

3. **Seamless transition**: Vague idea → brainstormed concept → built agent

### Key Principle

Users can go from **vague idea → brainstormed concept → built agent** in one continuous flow, with brainstorming output directly feeding into agent development.

## Best Practices

### Before Starting

1. Review example agents in `/bmad/bmm/agents/` for patterns
2. Consider using brainstorming if you have a vague concept to develop
3. Have a clear vision of the agent's role and personality (or use brainstorming to develop it)
4. List the commands/capabilities the agent will need
5. Identify any workflows or tasks the agent will invoke

### During Execution

1. **Agent Names**: Use memorable names that reflect personality
2. **Icons**: Choose an emoji that represents the agent's role
3. **Persona**: Make it distinct and consistent with communication style
4. **Commands**: Use kebab-case, start custom commands with letter (not \*)
5. **Workflows**: Reference existing workflows or mark as "todo" to implement later

### After Completion

1. **Compile the agent**:
   - For standalone agents: Run `npm run build:agents` or use the installer menu
   - For module agents: Automatic during module installation
2. **Test the agent**: Use the compiled `.md` agent in your IDE
3. **Implement placeholders**: Complete any "todo" workflows referenced
4. **Refine as needed**: Use customize file for persona adjustments
5. **Evolve over time**: Add new commands as requirements emerge

## Agent Types

### Simple Agent

- **Best For**: Self-contained utilities, simple assistants
- **Characteristics**: Embedded logic, no external dependencies
- **Example**: Calculator agent, random picker, simple formatter

### Expert Agent

- **Best For**: Domain-specific agents with data/memory
- **Characteristics**: Sidecar folders, domain restrictions, memory files
- **Example**: Diary keeper, project journal, personal knowledge base

### Module Agent

- **Best For**: Full-featured agents with workflows
- **Characteristics**: Part of module, commands invoke workflows
- **Example**: Product manager, architect, research assistant

## Troubleshooting

### Issue: Agent won't load

- **Solution**: Validate XML structure is correct
- **Check**: Ensure all required tags present (persona, cmds)

### Issue: Commands don't work

- **Solution**: Verify workflow paths are correct or marked "todo"
- **Check**: Test workflow invocation separately first

### Issue: Persona feels generic

- **Solution**: Review communication styles guide
- **Check**: Make identity unique and specific to role

## Customization

To modify agent building process:

1. Edit `instructions.md` to change steps
2. Update `agent-types.md` to add new agent patterns
3. Modify `agent-command-patterns.md` for new command types
4. Edit `communication-styles.md` to add personality examples

## Version History

- **v6.0.0** - BMAD Core v6 compatible
  - Three agent types (Simple/Expert/Module)
  - Enhanced persona development
  - Command pattern library
  - Validation framework

## Support

For issues or questions:

- Review example agents in `/bmad/bmm/agents/`
- Check agent documentation in this workflow folder
- Test with simple agents first, then build complexity
- Consult BMAD Method v6 documentation

---

_Part of the BMad Method v6 - BMB (BMad Builder) Module_
