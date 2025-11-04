# BMAD Project Standards and Conventions

## Project Structure Conventions

### Directory Organization

The BMAD framework follows a strict directory structure:

```
bmad/
├── core/              # Core framework - universal functionality
├── {module}/          # Module directories (bmm, bmb, cis, bmd)
└── _cfg/             # User customizations (update-safe)
```

**Rules**:
- Core framework code goes in `bmad/core/`
- Module-specific code in `bmad/{module}/`
- User customizations ONLY in `bmad/_cfg/`
- Never mix concerns across directories

### File Naming Conventions

**Agent Files**: `kebab-case.md`
- Examples: `bmad-master.md`, `product-manager.md`, `game-developer.md`

**Workflow Files**: `kebab-case/workflow.yaml`
- Directory per workflow with supporting files
- Examples: `create-agent/workflow.yaml`, `party-mode/workflow.yaml`

**Configuration Files**: `config.yaml`, `{name}-manifest.csv`
- Standard YAML format
- CSV for manifests

## Agent File Structure

### Required Format

Agent files MUST use XML-structured markdown with frontmatter:

```markdown
---
name: 'agent-slug'
description: 'Brief description'
---

<agent id="path/to/agent.md" name="Display Name" title="Full Title" icon="🎯">
<activation critical="MANDATORY">
  <!-- Steps here -->
</activation>

<persona>
  <role>Role definition</role>
  <identity>Identity description</identity>
  <communication_style>Communication style</communication_style>
  <principles>Core principles</principles>
</persona>

<menu>
  <item cmd="*command">Display Text</item>
</menu>
</agent>
```

### Agent Activation Standards

**MANDATORY First Steps**:
1. Load persona from current agent file
2. Load `bmad/core/config.yaml` and store variables:
   - `{user_name}`
   - `{communication_language}`
   - `{output_folder}`
   - `{project_name}`
3. Greet user by name in their preferred language
4. Display menu
5. Wait for user input

**Variable Usage**:
- Always use `{user_name}` when addressing user
- Always communicate in `{communication_language}`
- Write output to `{output_folder}` when specified
- Reference `{project_name}` in context

### Menu Item Standards

Menu items use three handler types:

1. **workflow**: Executes a workflow YAML
```xml
<item cmd="*trigger" workflow="{project-root}/path/to/workflow.yaml">Description</item>
```

2. **action**: Executes inline instructions or references prompt ID
```xml
<item cmd="*trigger" action="#prompt-id">Description</item>
<item cmd="*trigger" action="inline instruction text">Description</item>
```

3. **exec**: Direct command execution (use sparingly)
```xml
<item cmd="*trigger" exec="command to execute">Description</item>
```

**Rules**:
- Menu commands MUST use asterisk prefix: `*command`
- Include `*help` to redisplay menu
- Include `*exit` for agent exit
- Keep menu concise (5-10 items max)

## Workflow File Structure

### Workflow YAML Format

```yaml
workflow:
  id: unique-workflow-id
  name: Display Name
  description: Brief description
  type: interactive | automated

  steps:
    - id: step-1
      name: Step Name
      type: task | prompt | conditional | input
      instructions: path/to/instructions.md
      output:
        type: file | variable | both
        path: output/path.md
        template: path/to/template.md

    - id: step-2
      name: Next Step
      type: task
      dependencies:
        - step-1
      instructions: path/to/instructions-2.md
```

### Workflow Supporting Files

Each workflow directory should contain:

1. **workflow.yaml** (required) - Workflow definition
2. **instructions.md** (required) - Detailed step instructions
3. **README.md** (recommended) - Workflow documentation
4. **template.md** (optional) - Output templates
5. **checklist.md** (optional) - Validation checklist

### Workflow Execution Standards

When executing workflows:
1. Load `bmad/core/tasks/workflow.xml` (the workflow executor)
2. Pass workflow YAML path as parameter
3. Execute steps sequentially
4. Save output after EACH step (never batch)
5. Preserve state between steps
6. Handle errors gracefully

## Customization System

### Update-Safe Customizations

User customizations go in `bmad/_cfg/` and follow this structure:

```
bmad/_cfg/
├── agents/                    # Agent customization files
│   └── agent-name.yaml       # Override file per agent
├── agent-manifest.csv        # Generated agent list
├── workflow-manifest.csv     # Generated workflow list
└── task-manifest.csv         # Generated task list
```

### Agent Customization Format

File: `bmad/_cfg/agents/{agent-slug}.yaml`

```yaml
# Override any agent property
name: "Custom Name"
description: "Custom description"
communication_style: "Custom communication style"
additional_instructions: |
  Additional behavioral instructions
  that modify the agent's behavior
```

**Rules**:
- Customizations override base agent properties
- Survive framework updates
- Merge at runtime
- YAML format only

## Code Style Standards

### JavaScript/Node.js

**Style**:
- ES6+ features
- CommonJS modules (`require`, `module.exports`)
- 2-space indentation
- Single quotes for strings
- Semicolons required

**Linting**: ESLint (see `eslint.config.mjs`)
**Formatting**: Prettier (see `prettier.config.mjs`)

### YAML Files

**Style**:
- 2-space indentation
- No tabs
- Quoted strings when containing special characters
- Multi-line strings use `|` or `>` operators

**Validation**:
- Must parse without errors
- Required fields must be present
- Follow schema for workflow/config files

### Markdown Files

**Style**:
- ATX-style headers (`#` prefix)
- Fenced code blocks with language specifiers
- Blank line before/after headings
- No trailing whitespace

**Agent XML**:
- Properly nested XML structure
- Required attributes present
- Valid XML (no unclosed tags)

## Configuration Standards

### config.yaml Requirements

Must contain these fields:

```yaml
user_name: "User's Name"
communication_language: "en"  # ISO language code
output_folder: "_docs"        # Relative path
project_name: "Project Name"
```

**Optional Fields**:
```yaml
communication_style: "professional" | "casual" | "technical"
technical_level: "beginner" | "intermediate" | "expert"
output_format: "markdown" | "docx" | "pdf"
```

### Manifest CSV Format

**agent-manifest.csv**:
```csv
slug,name,path,description
agent-slug,Display Name,path/to/agent.md,Brief description
```

**workflow-manifest.csv**:
```csv
id,name,path,description,module
workflow-id,Display Name,path/to/workflow.yaml,Brief description,module-name
```

**task-manifest.csv**:
```csv
id,name,path,description,type
task-id,Display Name,path/to/task.xml,Brief description,task|utility
```

## Documentation Standards

### README Files

Each module and major component should have a README.md with:

1. **Overview** - What it is, purpose
2. **Installation** - How to install/activate
3. **Usage** - How to use, examples
4. **Configuration** - Available settings
5. **API/Reference** - Detailed reference (if applicable)
6. **Troubleshooting** - Common issues
7. **Contributing** - How to contribute

### Inline Documentation

**Agent Instructions**:
- Clear, step-by-step format
- Numbered lists for sequences
- Code examples where helpful
- Error handling guidance

**Workflow Instructions**:
- Detailed step instructions
- Expected inputs/outputs
- Validation criteria
- Error scenarios

**Code Comments**:
- Explain why, not what
- Document complex logic
- Note any non-obvious behavior
- Reference issues/tickets if relevant

## Version Control Standards

### Git Practices

**Branches**:
- `main` - Production releases
- `v6-alpha` - Alpha development
- `v4-stable` - Stable v4 branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

**Commit Messages**:
Format: `type(scope): message`

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Maintenance tasks

Examples:
- `feat(bmm): add Level 4 enterprise workflow`
- `fix(installer): resolve module selection bug`
- `docs(readme): update v6 alpha installation steps`

### What to Commit

**Include**:
- Source code (`src/`, `tools/`)
- Configuration templates
- Documentation
- Tests
- Build configuration

**Exclude** (via .gitignore):
- `node_modules/`
- `bmad/` (users install their own)
- IDE-specific files (user preference)
- Build artifacts
- Log files
- `.env` files

## Testing Standards

### Pre-commit Checks

**Automated** (via Husky):
1. Lint staged files
2. Format staged files
3. Validate syntax

**Manual Before Commit**:
1. Agent activation test
2. Workflow execution test
3. Config loading test
4. Customization test

### Testing Checklist

Before releases:
- [ ] All agents load correctly
- [ ] Workflows execute without errors
- [ ] Config file loads properly
- [ ] Customizations apply correctly
- [ ] Manifests generated accurately
- [ ] Installation works in clean environment
- [ ] IDE integrations function
- [ ] Documentation is current

## Best Practices

### Agent Design

1. **Single Responsibility**: Each agent has clear, focused purpose
2. **User-Centric**: Design for user workflow, not agent convenience
3. **Consistent Voice**: Maintain persona throughout interaction
4. **Config Integration**: Always load and use user config
5. **Error Handling**: Provide helpful error messages
6. **Language Support**: Respect communication_language setting

### Workflow Design

1. **Step Independence**: Each step should be self-contained
2. **State Management**: Save state after each step
3. **Clear Instructions**: Detailed, actionable step instructions
4. **Validation**: Include checks for step completion
5. **Templates**: Provide output templates where appropriate
6. **Flexibility**: Allow optional steps when possible

### Module Development

1. **Modular Design**: Modules should be independent
2. **Core Dependencies**: Depend only on core, not other modules
3. **Shared Resources**: Use CIS for shared creative workflows
4. **Clear Boundaries**: Well-defined module scope
5. **Documentation**: Comprehensive module README
6. **Examples**: Include usage examples

## Common Anti-Patterns to Avoid

### Agent Development

❌ **Don't**:
- Hard-code user names or languages
- Load unnecessary files at startup
- Create menu items that don't work
- Mix persona voices
- Forget error handling

✅ **Do**:
- Use config variables
- Lazy-load resources
- Test all menu items
- Maintain consistent persona
- Handle errors gracefully

### Workflow Development

❌ **Don't**:
- Batch multiple steps together
- Skip state saving
- Assume files exist
- Ignore dependencies
- Forget validation

✅ **Do**:
- Execute steps one at a time
- Save after each step
- Verify prerequisites
- Handle dependencies
- Validate outputs

### Customization

❌ **Don't**:
- Modify base agent files directly
- Put customizations outside `_cfg/`
- Use complex nested overrides
- Ignore YAML syntax

✅ **Do**:
- Use customization files
- Keep all customizations in `_cfg/`
- Keep overrides simple
- Validate YAML syntax

## Performance Considerations

1. **Lazy Loading**: Load files only when needed (except config)
2. **Caching**: Use manifests for agent/workflow discovery
3. **Incremental Execution**: Save workflow progress
4. **Minimal Context**: Load only necessary context
5. **Efficient Parsing**: Pre-validate YAML/XML when possible

## Security Considerations

1. **No External Calls**: Core framework stays local
2. **User Control**: Users control all customizations
3. **No Secrets**: Never store secrets in code
4. **File Permissions**: Respect file system permissions
5. **IDE Security**: Rely on IDE-level security
