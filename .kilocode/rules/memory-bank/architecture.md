# Technical Architecture

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│            IDE Integration Layer                │
│   (Claude Code, OpenCode, Cursor, etc.)        │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              BMAD-CORE Framework                │
│  ┌──────────────────────────────────────────┐  │
│  │   Agent Orchestration Engine             │  │
│  │   - Agent loading & activation           │  │
│  │   - Persona management                   │  │
│  │   - Context & memory handling            │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │   Workflow Execution Engine              │  │
│  │   - YAML workflow parsing                │  │
│  │   - Step-by-step execution               │  │
│  │   - State management                     │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │   Configuration System                   │  │
│  │   - User preferences (config.yaml)       │  │
│  │   - Agent customization (_cfg/agents/)   │  │
│  │   - Update-safe settings                 │  │
│  └──────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Module Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   BMM    │  │   BMB    │  │   CIS    │     │
│  │ (Method) │  │(Builder) │  │(Creative)│     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

### Core Components

#### 1. Agent System

**Agent Definition Format**: XML-structured Markdown

```xml
<agent id="path" name="Name" title="Title" icon="🔷">
  <activation>...</activation>
  <persona>...</persona>
  <menu>...</menu>
</agent>
```

**Agent Types**:
- **Full Module Agents**: Complete persona with workflows
- **Hybrid Agents**: Combines persona + specialized knowledge
- **Sidecar Agents**: Specialized sub-agents with focused expertise

**Customization Layer**:
- Base agents in `bmad/{module}/agents/`
- Customizations in `bmad/_cfg/agents/{agent-name}.yaml`
- Customizations override base definitions (update-safe)

#### 2. Workflow Engine

**Workflow Structure**:
```yaml
workflow:
  id: unique-workflow-id
  name: Display Name
  steps:
    - id: step-1
      type: task | prompt | conditional
      instructions: path/to/instructions.md
```

**Execution Model**:
1. BMad Master loads workflow YAML
2. Reads core workflow executor (`bmad/core/tasks/workflow.xml`)
3. Executes steps sequentially
4. Manages state between steps
5. Handles outputs and templates

**Workflow Components**:
- `workflow.yaml` - Step definitions and flow
- `instructions.md` - Detailed step instructions
- `template.md` - Output templates (optional)
- `checklist.md` - Validation checklist (optional)

#### 3. Configuration System

**Global Config**: `bmad/core/config.yaml`
```yaml
user_name: User's Name
communication_language: en
output_folder: _docs
project_name: Project Name
```

**Module Configs**: Each module can extend with specific settings

**Customization Files**: `bmad/_cfg/agents/*.yaml`
- Override agent properties
- Survive framework updates
- Merged at runtime

#### 4. Installation System

**CLI Tool**: `tools/cli/`
- Interactive installer with module selection
- Automatic v4 migration detection
- IDE integration setup
- Manifest generation

**Installation Outputs**:
- `bmad/` directory with selected modules
- IDE-specific configuration files
- Agent customization templates
- Unified manifests

## Module Architecture

### BMM (BMad Method)

**Purpose**: Agile development methodology

**4-Phase Workflow**:
1. Analysis (Optional) - Brainstorming, research
2. Planning (Required) - PRD/GDD generation
3. Solutioning (Level 3-4) - Architecture, tech specs
4. Implementation (Iterative) - Stories, development, review

**Scale Adaptation**: Levels 0-4 adjust workflow depth

**Key Agents**: PM, Analyst, Architect, Scrum Master, Developer, Game Designer

### BMB (BMad Builder)

**Purpose**: Create custom agents, workflows, modules

**Creation Workflows**:
- `create-agent` - Interactive agent builder
- `create-workflow` - Workflow design system
- `create-module` - Full module packaging
- `edit-agent` / `edit-workflow` - Modification tools

**Output**: Properly structured BMAD-compliant artifacts

### CIS (Creative Intelligence Suite)

**Purpose**: Creative facilitation and innovation

**5 Domains**: Brainstorming, Design Thinking, Problem Solving, Innovation Strategy, Storytelling

**150+ Techniques**: Proven creative frameworks

**Integration**: Shared resource for other modules (e.g., BMM analysis phase)

## Technical Decisions

### Why XML-in-Markdown for Agents?
- Structured data with human readability
- Embedded in markdown for IDE compatibility
- Easy parsing while maintaining documentation
- Supports complex nested structures

### Why YAML for Workflows?
- Human-readable configuration
- Better than JSON for multi-line content
- Standard in DevOps tooling
- Easy to version control

### Why Separate Customization Directory?
- Update safety - framework can update without overwriting
- Clear separation of base vs custom
- Easy backup and sharing
- Version control friendly

### Why Unified bmad/ Directory?
- Simpler mental model
- Easier installation/uninstallation
- Cleaner project structure
- Better discoverability

## Integration Points

### IDE Integration
- **Claude Code**: Native slash commands
- **Cursor**: `.cursorrules` integration
- **VS Code**: Extension support
- **Other**: Markdown agent files work universally

### External Tools
- **Git**: Workflows can trigger git operations
- **npm/Node.js**: CLI tool ecosystem
- **Docker**: Optional containerization
- **CI/CD**: Workflow automation potential

## Data Flow

1. **User activates agent** in IDE
2. **IDE loads agent markdown** from `bmad/`
3. **Agent checks for customization** in `_cfg/`
4. **Config loaded** from `config.yaml`
5. **Agent presents menu** and waits for input
6. **User selects workflow/task**
7. **Workflow executor loads YAML**
8. **Steps execute sequentially** with state management
9. **Output generated** to configured location
10. **Context preserved** for next interaction

## Performance Considerations

- Lazy loading: Agents load on-demand
- Manifest caching: Pre-computed agent/workflow lists
- Incremental execution: Workflows save after each step
- Memory efficiency: Only active context in memory
- Minimal dependencies: Core is lightweight

## Security Model

- No external network calls in core framework
- All files read from local project
- User controls all customizations
- No secret storage in code
- IDE-level security applies
