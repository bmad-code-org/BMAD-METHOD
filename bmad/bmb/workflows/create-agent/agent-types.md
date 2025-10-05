# BMAD Agent Types Reference

## Overview

BMAD agents come in three distinct types, each designed for different use cases and complexity levels. The type determines where the agent is stored and what capabilities it has.

## Directory Structure by Type

### Standalone Agents (Simple & Expert)

Live in their own dedicated directories under `bmad/agents/`:

```
bmad/agents/
├── my-helper/                   # Simple agent
│   ├── my-helper.agent.yaml     # Agent definition
│   └── my-helper.md             # Built XML (generated)
│
└── domain-expert/               # Expert agent
    ├── domain-expert.agent.yaml
    ├── domain-expert.md         # Built XML
    └── domain-expert-sidecar/   # Expert resources
        ├── memories.md          # Persistent memory
        ├── instructions.md      # Private directives
        └── knowledge/           # Domain knowledge

```

### Module Agents

Part of a module system under `bmad/{module}/agents/`:

```
bmad/bmm/agents/
├── product-manager.agent.yaml
├── product-manager.md           # Built XML
├── business-analyst.agent.yaml
└── business-analyst.md          # Built XML
```

## Agent Types

### 1. Simple Agent

**Purpose:** Self-contained, standalone agents with embedded capabilities

**Location:** `bmad/agents/{agent-name}/`

**Characteristics:**

- All logic embedded within the agent file
- No external dependencies
- Quick to create and deploy
- Perfect for single-purpose tools
- Lives in its own directory

**Use Cases:**

- Calculator agents
- Format converters
- Simple analyzers
- Static advisors

**YAML Structure (source):**

```yaml
agent:
  metadata:
    name: 'Helper'
    title: 'Simple Helper'
    icon: '🤖'
    type: 'simple'
  persona:
    role: 'Simple Helper Role'
    identity: '...'
    communication_style: '...'
    principles: ['...']
  menu:
    - trigger: calculate
      description: 'Perform calculation'
```

**XML Structure (built):**

```xml
<agent id="simple-agent" name="Helper" title="Simple Helper" icon="🤖">
  <persona>
    <role>Simple Helper Role</role>
    <identity>...</identity>
    <communication_style>...</communication_style>
    <principles>...</principles>
  </persona>
  <embedded-data>
    <!-- Optional embedded data/logic -->
  </embedded-data>
  <menu>
    <item cmd="*help">Show commands</item>
    <item cmd="*calculate">Perform calculation</item>
    <item cmd="*exit">Exit</item>
  </menu>
</agent>
```

### 2. Expert Agent

**Purpose:** Specialized agents with domain expertise and sidecar resources

**Location:** `bmad/agents/{agent-name}/` with sidecar directory

**Characteristics:**

- Has access to specific folders/files
- Domain-restricted operations
- Maintains specialized knowledge
- Can have memory/context files
- Includes sidecar directory for resources

**Use Cases:**

- Personal diary agent (only accesses diary folder)
- Project-specific assistant (knows project context)
- Domain expert (medical, legal, technical)
- Personal coach with history

**YAML Structure (source):**

```yaml
agent:
  metadata:
    name: 'Domain Expert'
    title: 'Specialist'
    icon: '🎯'
    type: 'expert'
  persona:
    role: 'Domain Specialist Role'
    identity: '...'
    communication_style: '...'
    principles: ['...']
  critical_actions:
    - 'Load COMPLETE file {agent-folder}/instructions.md and follow ALL directives'
    - 'Load COMPLETE file {agent-folder}/memories.md into permanent context'
    - 'ONLY access {user-folder}/diary/ - NO OTHER FOLDERS'
  menu:
    - trigger: analyze
      description: 'Analyze domain-specific data'
```

**XML Structure (built):**

```xml
<agent id="expert-agent" name="Domain Expert" title="Specialist" icon="🎯">
  <persona>
    <role>Domain Specialist Role</role>
    <identity>...</identity>
    <communication_style>...</communication_style>
    <principles>...</principles>
  </persona>
  <critical-actions>
    <!-- CRITICAL: Load sidecar files explicitly -->
    <i critical="MANDATORY">Load COMPLETE file {agent-folder}/instructions.md and follow ALL directives</i>
    <i critical="MANDATORY">Load COMPLETE file {agent-folder}/memories.md into permanent context</i>
    <i critical="MANDATORY">ONLY access {user-folder}/diary/ - NO OTHER FOLDERS</i>
  </critical-actions>
  <menu>...</menu>
</agent>
```

**Complete Directory Structure:**

```
bmad/agents/expert-agent/
├── expert-agent.agent.yaml      # Agent YAML source
├── expert-agent.md              # Built XML (generated)
└── expert-agent-sidecar/        # Sidecar resources
    ├── memories.md              # Persistent memory
    ├── instructions.md          # Private directives
    ├── knowledge/               # Domain knowledge base
    │   └── README.md
    └── sessions/                # Session notes
```

### 3. Module Agent

**Purpose:** Full-featured agents belonging to a module with access to workflows and resources

**Location:** `bmad/{module}/agents/`

**Characteristics:**

- Part of a BMAD module (bmm, bmb, cis)
- Access to multiple workflows
- Can invoke other tasks and agents
- Professional/enterprise grade
- Integrated with module workflows

**Use Cases:**

- Product Manager (creates PRDs, manages requirements)
- Security Engineer (threat models, security reviews)
- Test Architect (test strategies, automation)
- Business Analyst (market research, requirements)

**YAML Structure (source):**

```yaml
agent:
  metadata:
    name: 'John'
    title: 'Product Manager'
    icon: '📋'
    module: 'bmm'
    type: 'module'
  persona:
    role: 'Product Management Expert'
    identity: '...'
    communication_style: '...'
    principles: ['...']
  critical_actions:
    - 'Load config from {project-root}/bmad/{module}/config.yaml'
  menu:
    - trigger: create-prd
      workflow: '{project-root}/bmad/bmm/workflows/prd/workflow.yaml'
      description: 'Create PRD'
    - trigger: validate
      exec: '{project-root}/bmad/core/tasks/validate-workflow.xml'
      description: 'Validate document'
```

**XML Structure (built):**

```xml
<agent id="bmad/bmm/agents/pm.md" name="John" title="Product Manager" icon="📋">
  <persona>
    <role>Product Management Expert</role>
    <identity>...</identity>
    <communication_style>...</communication_style>
    <principles>...</principles>
  </persona>
  <critical-actions>
    <i>Load config from {project-root}/bmad/{module}/config.yaml</i>
  </critical-actions>
  <menu>
    <item cmd="*help">Show numbered menu</item>
    <item cmd="*create-prd" run-workflow="{project-root}/bmad/bmm/workflows/prd/workflow.yaml">Create PRD</item>
    <item cmd="*validate" exec="{project-root}/bmad/core/tasks/validate-workflow.xml">Validate document</item>
    <item cmd="*exit">Exit</item>
  </menu>
</agent>
```

## Choosing the Right Type

### Choose Simple Agent when:

- Single, well-defined purpose
- No external data needed
- Quick utility functions
- Embedded logic is sufficient

### Choose Expert Agent when:

- Domain-specific expertise required
- Need to maintain context/memory
- Restricted to specific data/folders
- Personal or specialized use case

### Choose Module Agent when:

- Part of larger system/module
- Needs multiple workflows
- Professional/team use
- Complex multi-step processes

## Migration Path

```
Simple Agent → Expert Agent → Module Agent
```

Agents can evolve:

1. Start with Simple for proof of concept
2. Add sidecar resources to become Expert
3. Integrate with module to become Module Agent

## Best Practices

1. **Start Simple:** Begin with the simplest type that meets your needs
2. **Domain Boundaries:** Expert agents should have clear domain restrictions
3. **Module Integration:** Module agents should follow module conventions
4. **Resource Management:** Document all external resources clearly
5. **Evolution Planning:** Design with potential growth in mind
