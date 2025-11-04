# Kilocode Configuration for BMAD-METHOD

This directory contains optimized Kilocode AI configuration for the BMAD-METHOD project, designed to enhance AI-assisted development with context-aware modes, workflows, and rules.

## 📁 Structure

```
.kilocode/
├── README.md                          # This file
├── .kilocodemodes                     # Custom modes definition
├── rules/                             # Project-wide rules
│   ├── memory-bank/                   # Persistent AI context
│   │   ├── brief.md                   # Project overview
│   │   ├── product.md                 # Product context
│   │   ├── context.md                 # Current development state
│   │   ├── architecture.md            # Technical architecture
│   │   └── tech.md                    # Technology stack
│   ├── bmad-project-standards.md      # BMAD conventions
│   └── communication-guidelines.md     # Agent communication rules
├── rules-bmad-dev/                    # Developer mode rules
│   └── development-focus.md
├── rules-bmad-pm/                     # Product Manager mode rules
│   └── product-management-focus.md
├── rules-bmad-architect/              # Architect mode rules
│   └── architecture-focus.md
└── workflows/                         # Automated workflows
    ├── initialize-bmad-project.md
    ├── create-new-agent.md
    ├── update-memory-bank.md
    └── run-full-test-suite.md
```

## 🎨 Custom Modes

10 specialized modes matching BMAD agent personas:

| Mode | Slug | Purpose |
|------|------|---------|
| 🧙 BMad Master | `bmad-master` | Workflow orchestration and framework expertise |
| 📋 Product Manager | `bmad-pm` | Requirements gathering and PRD creation |
| 🏗️ Software Architect | `bmad-architect` | System design and architecture |
| 💻 Senior Developer | `bmad-developer` | Implementation and code review |
| 📊 Scrum Master | `bmad-scrum` | Sprint planning and story creation |
| 🔍 Business Analyst | `bmad-analyst` | Research and analysis |
| 🔨 BMad Builder | `bmad-builder` | Custom agent/workflow creation |
| 🎮 Game Developer | `bmad-game-dev` | Game development implementation |
| 🎨 Creative Facilitator | `bmad-creative` | Innovation and brainstorming |
| 📝 Documentation Specialist | `bmad-docs` | Technical writing |

### Using Modes

In Kilocode, switch modes by clicking the mode selector or using keyboard shortcuts. Each mode:
- Has specialized knowledge and focus areas
- Follows appropriate communication style
- Has access to mode-specific rules
- Remembers last used model ("Sticky Models")

## 🧠 Memory Bank

The Memory Bank provides persistent AI context about the BMAD-METHOD project.

### Core Files

1. **brief.md** - Project overview, mission, structure
   - Update: Rarely (major project changes only)

2. **product.md** - Problem statement, solution, users, goals
   - Update: Occasionally (product evolution)

3. **context.md** - Current development focus, recent changes, priorities
   - Update: Frequently (after significant changes)

4. **architecture.md** - System design, components, decisions
   - Update: As needed (architecture changes)

5. **tech.md** - Technologies, dependencies, setup
   - Update: As needed (tech stack changes)

### Initialization

On each new Kilocode session, the AI reads the Memory Bank and responds with:

```
[Memory Bank: Active]
```

Followed by a context summary showing understanding of the project state.

### Updating Memory Bank

Use the workflow: `/update-memory-bank`

Or manually update files as development progresses. See `workflows/update-memory-bank.md` for detailed process.

## 📜 Custom Rules

### Project-Wide Rules

Located in `.kilocode/rules/`, these apply to all modes:

**bmad-project-standards.md**:
- Directory structure conventions
- Agent file format requirements
- Workflow structure standards
- Customization system rules
- Code style standards
- Testing requirements

**communication-guidelines.md**:
- C.O.R.E. philosophy application
- Personalization requirements
- Question-driven discovery approach
- Agent-specific communication styles
- Error handling communication

### Mode-Specific Rules

Located in `.kilocode/rules-{mode}/`, these apply when that mode is active:

- **rules-bmad-dev/**: Development-focused guidance
- **rules-bmad-pm/**: Product management best practices
- **rules-bmad-architect/**: Architecture decision framework

## 🔄 Workflows

Automated, repeatable processes invoked with slash commands:

### Available Workflows

1. **`/initialize-bmad-project`**
   - Sets up new project with BMAD framework
   - Runs interactive installer
   - Configures IDE integration

2. **`/create-new-agent`**
   - Guides agent creation using BMB
   - Interactive or manual approaches
   - Validates against BMAD standards

3. **`/update-memory-bank`**
   - Updates AI context after changes
   - Guides which files need updates
   - Validates consistency

4. **`/run-full-test-suite`**
   - Executes linting, formatting, tests
   - Provides results summary
   - Helps identify issues

### Using Workflows

In Kilocode chat:
```
/workflow-name
```

Or:
```
/initialize-bmad-project
```

The AI will execute the workflow step-by-step, following the markdown instructions.

## 🚀 Getting Started

### First Time Setup

1. **Initialize Memory Bank**

   In Kilocode, execute:
   ```
   initialize memory bank
   ```

   The AI will analyze the project and generate comprehensive context.

2. **Select Appropriate Mode**

   Choose a mode matching your current task:
   - Coding? → `bmad-developer`
   - Planning? → `bmad-pm`
   - Architecture? → `bmad-architect`

3. **Verify Memory Bank Active**

   Look for:
   ```
   [Memory Bank: Active]
   ```

   With accurate project context summary.

### Daily Usage

1. **Start Session**: Memory Bank loads automatically
2. **Choose Mode**: Select mode for your current task
3. **Execute Workflows**: Use `/workflow-name` for common tasks
4. **Update Context**: Keep Memory Bank current with `/update-memory-bank`

## 🔧 Configuration

### Customizing Modes

Edit `.kilocodemodes` (YAML format):

```yaml
customModes:
  - slug: my-custom-mode
    name: 🎯 My Mode
    description: Custom mode description
    roleDefinition: |
      You are a specialist in...
    groups:
      - read
      - edit
    customInstructions: |
      Additional behavior instructions
```

### Adding Rules

Create new markdown files in:
- `.kilocode/rules/` for project-wide rules
- `.kilocode/rules-{mode}/` for mode-specific rules

Rules use markdown format with headers, lists, and code blocks.

### Creating Workflows

Add markdown files to `.kilocode/workflows/` with step-by-step instructions:

```markdown
# Workflow Name

## Step 1: First Step
Instructions for first step...

## Step 2: Second Step
Instructions for second step...
```

Invoke with `/workflow-name` in Kilocode.

## 📚 Best Practices

### Memory Bank Maintenance

- **Update context.md frequently**: After significant changes
- **Keep brief.md stable**: Only update for major project changes
- **Be concise**: Focus on what AI needs for context
- **Include dates**: Note when changes occurred
- **Remove outdated info**: Keep it current

### Mode Usage

- **Match mode to task**: Use specialized modes for focus
- **Switch modes**: Don't stay in one mode for all tasks
- **Mode-specific rules**: Leverage specialized guidance
- **Trust the system**: Modes remember model preferences

### Rule Writing

- **Clear and specific**: Vague rules aren't helpful
- **Use examples**: Show what you mean
- **Organize logically**: Group related rules
- **Keep updated**: Remove obsolete rules
- **Test effectiveness**: Verify AI follows rules

### Workflow Design

- **Step-by-step**: Clear, sequential instructions
- **Self-contained**: Each step independent
- **Actionable**: Concrete actions, not abstract concepts
- **Examples included**: Show expected outcomes
- **Error handling**: Address what can go wrong

## 🛠️ Troubleshooting

### Memory Bank Not Loading

**Symptom**: No `[Memory Bank: Active]` message

**Solutions**:
1. Verify files exist in `.kilocode/rules/memory-bank/`
2. Check file format (should be markdown)
3. Ensure files aren't empty
4. Reload Kilocode or restart session

### Mode Not Available

**Symptom**: Custom mode doesn't appear

**Solutions**:
1. Verify `.kilocodemodes` syntax (YAML)
2. Check slug is unique
3. Reload Kilocode (may require restart)
4. Validate file location (project root)

### Rules Not Applied

**Symptom**: AI doesn't follow custom rules

**Solutions**:
1. Verify rule file location
2. Check markdown formatting
3. Be more specific in rule descriptions
4. Add examples to clarify intent
5. Test with explicit prompts

### Workflow Not Found

**Symptom**: `/workflow` command fails

**Solutions**:
1. Verify file exists in `.kilocode/workflows/`
2. Check file has `.md` extension
3. Use correct workflow name (filename without .md)
4. Reload Kilocode if recently added

## 📖 Resources

### Kilocode Documentation

- [Custom Modes](https://kilocode.ai/docs/features/custom-modes)
- [Workflows](https://kilocode.ai/docs/features/slash-commands/workflows)
- [Custom Rules](https://kilocode.ai/docs/advanced-usage/custom-rules)
- [Custom Instructions](https://kilocode.ai/docs/advanced-usage/custom-instructions)
- [Memory Bank](https://kilocode.ai/docs/advanced-usage/memory-bank)

### BMAD Documentation

- [BMAD README](../README.md)
- [BMM Documentation](../bmad/bmm/README.md)
- [BMB Documentation](../bmad/bmb/README.md)
- [v4 to v6 Upgrade Guide](../docs/v4-to-v6-upgrade.md)

## 🤝 Contributing

To improve this Kilocode configuration:

1. Test changes thoroughly
2. Update documentation (this README)
3. Follow existing patterns and conventions
4. Keep Memory Bank files updated
5. Share improvements with the team

## 📄 License

This configuration is part of the BMAD-METHOD project.

MIT License - See [LICENSE](../LICENSE) for details.

---

**Questions or Issues?**

- [BMAD Discord](https://discord.gg/gk8jAdXWmj)
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- [Documentation](../README.md)

---

*Last Updated: 2025-11-04*
*BMAD-METHOD v6 Alpha*
