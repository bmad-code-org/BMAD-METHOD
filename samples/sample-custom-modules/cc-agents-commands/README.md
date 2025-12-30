# CC Agents Commands

**Version:** 1.2.0 | **Author:** Ricardo (Autopsias)

A curated collection of 51 battle-tested Claude Code extensions designed to help developers **stay in flow**. This module includes 18 slash commands, 31 agents, and 2 skills for workflow automation, testing, CI/CD orchestration, and BMAD development cycles.

## Contents

| Type | Count | Description |
|------|-------|-------------|
| **Commands** | 18 | Slash commands for workflows (`/pr`, `/ci-orchestrate`, etc.) |
| **Agents** | 31 | Specialized agents for testing, quality, BMAD, and automation |
| **Skills** | 2 | Reusable skill definitions (PR workflows, safe refactoring) |

## Installation

Copy the folders to your Claude Code configuration:

**Global installation** (`~/.claude/`):
```bash
cp -r commands/ ~/.claude/commands/
cp -r agents/ ~/.claude/agents/
cp -r skills/ ~/.claude/skills/
```

**Project installation** (`.claude/`):
```bash
cp -r commands/ .claude/commands/
cp -r agents/ .claude/agents/
cp -r skills/ .claude/skills/
```

## Quick Start

```
/nextsession     # Generate continuation prompt for next session
/pr status       # Check PR status (requires github MCP)
/ci-orchestrate  # Auto-fix CI failures (requires github MCP)
/commit-orchestrate  # Quality checks + commit
```

## Commands Reference

### Starting Work
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/nextsession` | Generates continuation prompt for next session | - |
| `/epic-dev-init` | Verifies BMAD project setup | BMAD framework |

### Building
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/epic-dev` | Automates BMAD development cycle | BMAD framework |
| `/epic-dev-full` | Full TDD/ATDD-driven BMAD development | BMAD framework |
| `/parallel` | Smart parallelization with conflict detection | - |
| `/parallelize` | Strategy-based parallelization | - |

### Quality Gates
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/ci-orchestrate` | Orchestrates CI failure analysis and fixes | `github` MCP |
| `/test-orchestrate` | Orchestrates test failure analysis | test files |
| `/code-quality` | Analyzes and fixes code quality issues | - |
| `/coverage` | Orchestrates test coverage improvement | coverage tools |

### Shipping
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/pr` | Manages pull request workflows | `github` MCP |
| `/commit-orchestrate` | Git commit with quality checks | - |

## Agents Reference

### Test Fixers
| Agent | Description |
|-------|-------------|
| `unit-test-fixer` | Fixes Python test failures |
| `api-test-fixer` | Fixes API endpoint test failures |
| `database-test-fixer` | Fixes database mock/integration tests |
| `e2e-test-fixer` | Fixes Playwright E2E test failures |

### Code Quality
| Agent | Description |
|-------|-------------|
| `linting-fixer` | Fixes linting and formatting issues |
| `type-error-fixer` | Fixes type errors and annotations |
| `import-error-fixer` | Fixes import and dependency errors |
| `security-scanner` | Scans for security vulnerabilities |

### Workflow Support
| Agent | Description |
|-------|-------------|
| `pr-workflow-manager` | Manages PR workflows via GitHub |
| `parallel-orchestrator` | Spawns parallel agents with conflict detection |
| `digdeep` | Five Whys root cause analysis |

### BMAD Workflow
| Agent | Description |
|-------|-------------|
| `epic-story-creator` | Creates user stories from epics |
| `epic-story-validator` | Validates stories and quality gates |
| `epic-test-generator` | Generates ATDD tests |
| `epic-implementer` | Implements stories (TDD GREEN phase) |
| `epic-code-reviewer` | Adversarial code review |

### CI/DevOps
| Agent | Description |
|-------|-------------|
| `ci-strategy-analyst` | Analyzes CI/CD pipeline issues |
| `ci-infrastructure-builder` | Builds CI/CD infrastructure |
| `ci-documentation-generator` | Generates CI/CD documentation |

### Browser Automation
| Agent | Description |
|-------|-------------|
| `browser-executor` | Browser automation with Chrome DevTools |
| `chrome-browser-executor` | Chrome-specific automation |
| `playwright-browser-executor` | Playwright-specific automation |

## Skills Reference

| Skill | Description | Prerequisites |
|-------|-------------|---------------|
| `pr-workflow` | Manages PR workflows | `github` MCP |
| `safe-refactor` | Test-safe file refactoring | - |

## Dependency Tiers

| Tier | Description | Examples |
|------|-------------|----------|
| **Standalone** | Works with zero configuration | `/nextsession`, `/parallel` |
| **MCP-Enhanced** | Requires specific MCP servers | `/ci-orchestrate` (`github` MCP) |
| **BMAD-Required** | Requires BMAD framework | `/epic-dev`, `/epic-dev-full` |

## Requirements

- [Claude Code](https://claude.ai/code) CLI installed
- Some extensions require specific MCP servers (noted in tables)
- BMAD extensions require BMAD framework installed

## License

MIT
