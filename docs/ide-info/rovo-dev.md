# BMAD Method - Rovo Dev Instructions

## Activating Agents

BMAD agents are installed as subagents in `.rovodev/subagents/`.

### How to Use

1. **Open Project**: Subagents auto-load when project opens
2. **Invoke Agent**: Type `@` and select agent (e.g., `@bmad-bmm-dev`, `@bmad-bmm-architect`)
3. **Reference Files**: Check `.rovodev/workflows/` and `.rovodev/references/`

### Directory Structure

- `.rovodev/subagents/` - BMAD agents
- `.rovodev/workflows/` - Workflow guides
- `.rovodev/references/` - Tasks and tools

### Notes

- Agents are automatically discovered by Rovo Dev
- Subagents use YAML frontmatter for configuration
