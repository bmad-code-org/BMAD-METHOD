# CC Agents Commands

**Version:** 1.3.0 | **Author:** Ricardo (Autopsias)

A curated collection of 53 battle-tested Claude Code extensions designed to help developers **stay in flow**. This module includes 16 slash commands, 35 agents, and 2 skills for workflow automation, testing, CI/CD orchestration, and BMAD development cycles.

## Contents

| Type | Count | Description |
|------|-------|-------------|
| **Commands** | 16 | Slash commands for workflows (`/pr`, `/ci-orchestrate`, etc.) |
| **Agents** | 35 | Specialized agents for testing, quality, BMAD, and automation |
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
| `/epic-dev-epic-end-tests` | Validates epic completion with NFR assessment | BMAD framework |
| `/parallel` | Smart parallelization with conflict detection | - |

### Quality Gates
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/ci-orchestrate` | Orchestrates CI failure analysis and fixes | `github` MCP |
| `/test-orchestrate` | Orchestrates test failure analysis | test files |
| `/code-quality` | Analyzes and fixes code quality issues | - |
| `/coverage` | Orchestrates test coverage improvement | coverage tools |
| `/create-test-plan` | Creates comprehensive test plans | project documentation |

### Shipping
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/pr` | Manages pull request workflows | `github` MCP |
| `/commit-orchestrate` | Git commit with quality checks | - |

### Testing
| Command | Description | Prerequisites |
|---------|-------------|---------------|
| `/test-epic-full` | Tests epic-dev-full command workflow | BMAD framework |
| `/user-testing` | Facilitates user testing sessions | user testing setup |
| `/usertestgates` | Finds and runs next test gate | test gates in project |

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
| `code-quality-analyzer` | Analyzes code quality issues |

### Workflow Support
| Agent | Description |
|-------|-------------|
| `pr-workflow-manager` | Manages PR workflows via GitHub |
| `parallel-orchestrator` | Spawns parallel agents with conflict detection |
| `digdeep` | Five Whys root cause analysis |
| `safe-refactor` | Test-safe file refactoring with validation |

### BMAD Workflow
| Agent | Description |
|-------|-------------|
| `epic-story-creator` | Creates user stories from epics |
| `epic-story-validator` | Validates stories and quality gates |
| `epic-test-generator` | Generates ATDD tests |
| `epic-atdd-writer` | Generates failing acceptance tests (TDD RED phase) |
| `epic-implementer` | Implements stories (TDD GREEN phase) |
| `epic-test-expander` | Expands test coverage after implementation |
| `epic-test-reviewer` | Reviews test quality against best practices |
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

### Testing Support
| Agent | Description |
|-------|-------------|
| `test-strategy-analyst` | Strategic test failure analysis |
| `test-documentation-generator` | Generates test failure runbooks |
| `validation-planner` | Plans validation scenarios |
| `scenario-designer` | Designs test scenarios |
| `ui-test-discovery` | Discovers UI test opportunities |
| `requirements-analyzer` | Analyzes project requirements |
| `evidence-collector` | Collects validation evidence |
| `interactive-guide` | Guides human testers through validation |

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
