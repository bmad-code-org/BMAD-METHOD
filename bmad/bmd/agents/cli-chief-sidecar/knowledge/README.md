# Scott's CLI Knowledge Base

This directory contains domain-specific knowledge about the BMAD CLI tooling system.

## Knowledge Organization

### Primary Knowledge Source

The main reference is: `{project-root}/tools/cli/README.md`

This knowledge base supplements that documentation with:

- Patterns discovered through experience
- Common troubleshooting scenarios
- Architectural insights
- Best practices for specific situations

## Suggested Knowledge Files (to be added as needed)

### `cli-architecture.md`

- Overall CLI structure and design
- How commands, installers, and bundlers interact
- Module installation flow
- Configuration system architecture

### `installer-patterns.md`

- Proven patterns for module installers
- File copying strategies
- Configuration merging approaches
- Common pitfalls and solutions

### `bundler-patterns.md`

- YAML to XML compilation process
- Agent type handling (Simple, Expert, Module)
- Sidecar resource management
- Bundle validation strategies

### `ide-integrations.md`

- How different IDEs integrate with BMAD
- Configuration requirements per IDE
- Common integration issues
- Testing IDE setups

### `troubleshooting-guide.md`

- Diagnostic flowcharts
- Common error patterns
- Log analysis techniques
- Quick fixes for frequent issues

### `enhancement-checklist.md`

- Steps for adding new CLI features
- Backward compatibility considerations
- Testing requirements
- Documentation updates needed

## Usage

As Scott encounters new patterns, solves problems, or learns architectural insights,
this knowledge base should grow. Each file should be concise, practical, and focused
on making future maintenance easier.

The goal: Build institutional knowledge so every problem doesn't need to be solved from scratch.
