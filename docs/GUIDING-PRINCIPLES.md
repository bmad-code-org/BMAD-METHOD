# BMad Method Guiding Principles

The BMad Core and Method is a natural language framework for AI-assisted workflow with human in the loop processing along with software development. These principles ensure contributions maintain the method's effectiveness.

## Core Principles

### 1. Dev Agents Must Be Lean

- **Minimize dev agent dependencies**: Development agents that work in IDEs must have minimal context overhead
- **Save context for code**: Every line counts - dev agents should focus on coding, not documentation
- **Planning agents can be larger**: Planning agents (PM, Architect) used in web UI can have more complex tasks and dependencies
- **Small files, loaded on demand**: Multiple small, focused files are better than large files with many branches

### 2. Natural Language First

- **Everything is markdown**: Agents, tasks, templates - all written in plain English
- **No code in core**: The framework itself contains no programming code, only natural language instructions
- **Self-contained templates**: Templates are defined as YAML files with structured sections that include metadata, workflow configuration, and detailed instructions for content generation

### 3. Agent and Task Design

- **Agents define roles**: Each agent is a persona with specific expertise (e.g., Frontend Developer, API Developer)
- **Tasks are procedures**: Step-by-step instructions an agent follows to complete work
- **Templates are outputs**: Structured documents with embedded instructions for generation
- **Dependencies matter**: Explicitly declare only what's needed

## Practical Guidelines

### When to Add to Core

- Universal software development needs only
- Doesn't bloat dev agent contexts
- Follows existing agent/task/template patterns

### When to Create Expansion Packs

- Domain-specific needs beyond software development
- Non-technical domains (business, wellness, education, creative)
- Specialized technical domains (games, infrastructure, mobile)
- Heavy documentation or knowledge bases
- Anything that would bloat core agents

See [Expansion Packs Guide](../docs/expansion-packs.md) for detailed examples and ideas.

### Agent Design Rules

1. **Web/Planning Agents**: Can have richer context, multiple tasks, extensive templates
2. **Dev Agents**: Minimal dependencies, focused on code generation, lean task sets
3. **All Agents**: Clear persona, specific expertise, well-defined capabilities

### Task Writing Rules

1. Write clear step-by-step procedures
2. Use markdown formatting for readability
3. Keep dev agent tasks focused and concise
4. Planning tasks can be more elaborate
5. **Prefer multiple small tasks over one large branching task**
   - Instead of one task with many conditional paths
   - Create multiple focused tasks the agent can choose from
   - This keeps context overhead minimal
6. **Reuse common tasks** - Don't create new document creation tasks
   - Use the existing `create-doc` task
   - Pass the appropriate YAML template with structured sections
   - This maintains consistency and reduces duplication

### Template Rules

Templates follow the [BMad Document Template](../common/utils/bmad-doc-template.md) specification using YAML format:

1. **Structure**: Templates are defined in YAML with clear metadata, workflow configuration, and section hierarchy
2. **Separation of Concerns**: Instructions for LLMs are in `instruction` fields, separate from content
3. **Reusability**: Templates are agent-agnostic and can be used across different agents
4. **Key Components**:
   - `template` block for metadata (id, name, version, output settings)
   - `workflow` block for interaction mode configuration
   - `sections` array defining document structure with nested subsections
   - Each section has `id`, `title`, and `instruction` fields
5. **Advanced Features**:
   - Variable substitution using `{{variable_name}}` syntax
   - Conditional sections with `condition` field
   - Repeatable sections with `repeatable: true`
   - Agent permissions with `owner` and `editors` fields
   - Examples arrays for guidance (never included in output)
6. **Clean Output**: YAML structure ensures all processing logic stays separate from generated content

## Remember

- The power is in natural language orchestration and human agent collaboration, not code
- Dev agents code, planning agents plan
- Keep dev agents lean for maximum coding efficiency
- Expansion packs handle specialized domains
