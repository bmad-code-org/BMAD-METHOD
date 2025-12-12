# Rovo Dev IDE Integration

This document describes how BMAD-METHOD integrates with [Atlassian Rovo Dev](https://www.atlassian.com/rovo-dev), an AI-powered software development assistant.

## Overview

Rovo Dev is designed to integrate deeply with developer workflows and organizational knowledge bases. When you install BMAD-METHOD in a Rovo Dev project, it automatically installs BMAD agents, workflows, tasks, and tools just like it does for other IDEs (Cursor, VS Code, etc.).

BMAD-METHOD provides:

- **Agents**: Specialized subagents for various development tasks
- **Workflows**: Multi-step workflow guides and coordinators
- **Tasks & Tools**: Reference documentation for BMAD tasks and tools

### What are Rovo Dev Subagents?

Subagents are specialized agents that Rovo Dev can delegate tasks to. They are defined as Markdown files with YAML frontmatter stored in the `.rovodev/subagents/` directory. Rovo Dev automatically discovers these files and makes them available through the `@subagent-name` syntax.

## Installation and Setup

### Automatic Installation

When you run the BMAD-METHOD installer and select Rovo Dev as your IDE:

```bash
bmad install
```

The installer will:

1. Create a `.rovodev/subagents/` directory in your project (if it doesn't exist)
2. Convert BMAD agents into Rovo Dev subagent format
3. Write subagent files with the naming pattern: `bmad-<module>-<agent-name>.md`

### File Structure

After installation, your project will have:

```
project-root/
├── .rovodev/
│   ├── subagents/
│   │   ├── bmad-core-code-reviewer.md
│   │   ├── bmad-bmm-pm.md
│   │   ├── bmad-bmm-dev.md
│   │   └── ... (more agents from selected modules)
│   ├── workflows/
│   │   ├── bmad-brainstorming.md
│   │   ├── bmad-prd-creation.md
│   │   └── ... (workflow guides)
│   ├── references/
│   │   ├── bmad-task-core-code-review.md
│   │   ├── bmad-tool-core-analysis.md
│   │   └── ... (task/tool references)
│   ├── config.yml          (Rovo Dev configuration)
│   ├── prompts.yml         (Optional: reusable prompts)
│   └── ...
├── .bmad/                  (BMAD installation directory)
└── ...
```

**Directory Structure Explanation:**

- **subagents/**: Agents discovered and used by Rovo Dev with `@agent-name` syntax
- **workflows/**: Multi-step workflow guides and instructions
- **references/**: Documentation for available tasks and tools in BMAD

## Subagent File Format

BMAD agents are converted to Rovo Dev subagent format, which uses Markdown with YAML frontmatter:

### Basic Structure

```markdown
---
name: bmad-module-agent-name
description: One sentence description of what this agent does
tools:
  - bash
  - open_files
  - grep
  - expand_code_chunks
model: anthropic.claude-3-5-sonnet-20241022-v2:0 # Optional
load_memory: true # Optional
---

You are a specialized agent for [specific task].

## Your Role

Describe the agent's role and responsibilities...

## Key Instructions

1. First instruction
2. Second instruction
3. Third instruction

## When to Use This Agent

Explain when and how to use this agent...
```

### YAML Frontmatter Fields

| Field         | Type    | Required | Description                                                                                                                           |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | string  | Yes      | Unique identifier for the subagent (kebab-case, no spaces)                                                                            |
| `description` | string  | Yes      | One-line description of the subagent's purpose                                                                                        |
| `tools`       | array   | No       | List of tools the subagent can use. If not specified, uses parent agent's tools                                                       |
| `model`       | string  | No       | Specific LLM model for this subagent (e.g., `anthropic.claude-3-5-sonnet-20241022-v2:0`). If not specified, uses parent agent's model |
| `load_memory` | boolean | No       | Whether to load default memory files (AGENTS.md, AGENTS.local.md). Defaults to `true`                                                 |

### System Prompt

The content after the closing `---` is the subagent's system prompt. This defines:

- The agent's persona and role
- Its capabilities and constraints
- Step-by-step instructions for task execution
- Examples of expected behavior

## Using BMAD Components in Rovo Dev

### Invoking a Subagent (Agent)

In Rovo Dev, you can invoke a BMAD agent as a subagent using the `@` syntax:

```
@bmad-core-code-reviewer Please review this PR for potential issues
@bmad-bmm-pm Help plan this feature release
@bmad-bmm-dev Implement this feature
```

### Accessing Workflows

Workflow guides are available in `.rovodev/workflows/` directory:

```
@bmad-core-code-reviewer Use the brainstorming workflow from .rovodev/workflows/bmad-brainstorming.md
```

Workflow files contain step-by-step instructions and can be referenced or copied into Rovo Dev for collaborative workflow execution.

### Accessing Tasks and Tools

Task and tool documentation is available in `.rovodev/references/` directory. These provide:

- Task execution instructions
- Tool capabilities and usage
- Integration examples
- Parameter documentation

### Example Usage Scenarios

#### Code Review

```
@bmad-core-code-reviewer Review the changes in src/components/Button.tsx
for best practices, performance, and potential bugs
```

#### Documentation

```
@bmad-core-documentation-writer Generate API documentation for the new
user authentication module
```

#### Feature Design

```
@bmad-module-feature-designer Design a solution for implementing
dark mode support across the application
```

## Customizing BMAD Subagents

You can customize BMAD subagents after installation by editing their files directly in `.rovodev/subagents/`.

### Example: Adding Tool Restrictions

By default, BMAD subagents inherit tools from the parent Rovo Dev agent. You can restrict which tools a specific subagent can use:

```yaml
---
name: bmad-core-code-reviewer
description: Reviews code and suggests improvements
tools:
  - open_files
  - expand_code_chunks
  - grep
---
```

### Example: Using a Specific Model

Some agents might benefit from using a different model. You can specify this:

```yaml
---
name: bmad-core-documentation-writer
description: Writes clear and comprehensive documentation
model: anthropic.claude-3-5-sonnet-20241022-v2:0
---
```

### Example: Enhancing the System Prompt

You can add additional context to a subagent's system prompt:

```markdown
---
name: bmad-core-code-reviewer
description: Reviews code and suggests improvements
---

You are a specialized code review agent for our project.

## Project Context

Our codebase uses:

- React 18 for frontend
- Node.js 18+ for backend
- TypeScript for type safety
- Jest for testing

## Review Checklist

1. Type safety and TypeScript correctness
2. React best practices and hooks usage
3. Performance considerations
4. Test coverage
5. Documentation and comments

...rest of original system prompt...
```

## Memory and Context

By default, BMAD subagents have `load_memory: true`, which means they will load memory files from your project:

- **Project-level**: `.rovodev/AGENTS.md` and `.rovodev/.agent.md`
- **User-level**: `~/.rovodev/AGENTS.md` (global memory across all projects)

These files can contain:

- Project guidelines and conventions
- Common patterns and best practices
- Recent decisions and context
- Custom instructions for all agents

### Creating Project Memory

Create `.rovodev/AGENTS.md` in your project:

```markdown
# Project Guidelines

## Code Style

- Use 2-space indentation
- Use camelCase for variables
- Use PascalCase for classes

## Architecture

- Follow modular component structure
- Use dependency injection for services
- Implement proper error handling

## Testing Requirements

- Minimum 80% code coverage
- Write tests before implementation
- Use descriptive test names
```

## Troubleshooting

### Subagents Not Appearing in Rovo Dev

1. **Verify files exist**: Check that `.rovodev/subagents/bmad-*.md` files are present
2. **Check Rovo Dev is reloaded**: Rovo Dev may cache agent definitions. Restart Rovo Dev or reload the project
3. **Verify file format**: Ensure files have proper YAML frontmatter (between `---` markers)
4. **Check file permissions**: Ensure files are readable by Rovo Dev

### Agent Name Conflicts

If you have custom subagents with the same names as BMAD agents, Rovo Dev will load both but may show a warning. Use unique prefixes for custom subagents to avoid conflicts.

### Tools Not Available

If a subagent's tools aren't working:

1. Verify the tool names match Rovo Dev's available tools
2. Check that the parent Rovo Dev agent has access to those tools
3. Ensure tool permissions are properly configured in `.rovodev/config.yml`

## Advanced: Tool Configuration

Rovo Dev agents have access to a set of tools for various tasks. Common tools available include:

- `bash`: Execute shell commands
- `open_files`: View file contents
- `grep`: Search across files
- `expand_code_chunks`: View specific code sections
- `find_and_replace_code`: Modify files
- `create_file`: Create new files
- `delete_file`: Delete files
- `move_file`: Rename or move files

### MCP Servers

Rovo Dev can also connect to Model Context Protocol (MCP) servers, which provide additional tools and data sources:

- **Atlassian Integration**: Access to Jira, Confluence, and Bitbucket
- **Code Analysis**: Custom code analysis and metrics
- **External Services**: APIs and third-party integrations

Configure MCP servers in `~/.rovodev/mcp.json` or `.rovodev/mcp.json`.

## Integration with Other IDE Handlers

BMAD-METHOD supports multiple IDEs simultaneously. You can have both Rovo Dev and other IDE configurations (Cursor, VS Code, etc.) in the same project. Each IDE will have its own artifacts installed in separate directories.

For example:

- Rovo Dev agents: `.rovodev/subagents/bmad-*.md`
- Cursor rules: `.cursor/rules/bmad/`
- Claude Code: `.claude/rules/bmad/`

## Performance Considerations

- BMAD subagent files are typically small (1-5 KB each)
- Rovo Dev lazy-loads subagents, so having many subagents doesn't impact startup time
- System prompts are cached by Rovo Dev after first load

## Best Practices

1. **Keep System Prompts Concise**: Shorter, well-structured prompts are more effective
2. **Use Project Memory**: Leverage `.rovodev/AGENTS.md` for shared context
3. **Customize Tool Restrictions**: Give subagents only the tools they need
4. **Test Subagent Invocations**: Verify each subagent works as expected for your project
5. **Version Control**: Commit `.rovodev/subagents/` to version control for team consistency
6. **Document Custom Subagents**: Add comments explaining the purpose of customized subagents

## Related Documentation

- [Rovo Dev Official Documentation](https://www.atlassian.com/rovo-dev)
- [BMAD-METHOD Installation Guide](./installation.md)
- [IDE Handler Architecture](./ide-handlers.md)
- [Rovo Dev Configuration Reference](https://www.atlassian.com/rovo-dev/configuration)

## Examples

### Example 1: Code Review Workflow

```
User: @bmad-core-code-reviewer Review src/auth/login.ts for security issues
Rovo Dev → Subagent: Opens file, analyzes code, suggests improvements
Subagent output: Security vulnerabilities found, recommendations provided
```

### Example 2: Documentation Generation

```
User: @bmad-core-documentation-writer Generate API docs for the new payment module
Rovo Dev → Subagent: Analyzes code structure, generates documentation
Subagent output: Markdown documentation with examples and API reference
```

### Example 3: Architecture Design

```
User: @bmad-module-feature-designer Design a caching strategy for the database layer
Rovo Dev → Subagent: Reviews current architecture, proposes design
Subagent output: Detailed architecture proposal with implementation plan
```

## Support

For issues or questions about:

- **Rovo Dev**: See [Atlassian Rovo Dev Documentation](https://www.atlassian.com/rovo-dev)
- **BMAD-METHOD**: See [BMAD-METHOD README](../README.md)
- **IDE Integration**: See [IDE Handler Guide](./ide-handlers.md)
