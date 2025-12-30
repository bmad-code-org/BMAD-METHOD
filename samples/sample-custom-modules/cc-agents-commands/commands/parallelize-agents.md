---
description: "Parallelizes tasks with specialized agents"
prerequisites: "—"
argument-hint: "<task_description> [--workers=N] [--strategy=auto|error|test|lint|api|database|type|import]"
allowed-tools: ["Task", "TodoWrite", "Glob", "Grep", "Read", "LS", "Bash", "SlashCommand"]
---

Parallelize the following task using specialized agents: $ARGUMENTS

## Task Analysis

Parse the arguments to understand what specialized agents are needed:

- Extract any `--workers=N` or `--strategy=TYPE` options
- Analyze the task content to detect which domain expertise is required
- Identify the core work and how it can be distributed

## Specialized Agent Detection

Determine which specialized agent types would be most effective:

**Error-focused agents:**

- `type-error-fixer` - For mypy errors, TypeVar, Protocol, type annotations
- `import-error-fixer` - For ModuleNotFoundError, import issues, Python path problems
- `linting-fixer` - For ruff, format issues, E501, F401 violations
- `api-test-fixer` - For FastAPI, endpoint tests, HTTP client issues
- `database-test-fixer` - For database connections, fixtures, SQL, Supabase issues
- `unit-test-fixer` - For pytest failures, assertions, mocks, test logic

**Workflow agents:**

- `commit-orchestrator` - For git commits, staging, pre-commit hooks, quality gates
- `ci-workflow-orchestrator` - For CI/CD failures, GitHub Actions, pipeline issues

**Investigation agents:**

- `digdeep` - For root cause analysis, mysterious failures, complex debugging
- `security-scanner` - For vulnerabilities, OWASP compliance, secrets detection
- `performance-test-fixer` - For load tests, response times, benchmarks
- `e2e-test-fixer` - For end-to-end workflows, integration tests

**Fallback:**

- `parallel-executor` - For general independent parallel work
- `general-purpose` - For complex multi-domain coordination

## Work Package Creation

Use available tools to understand the codebase and create specialized work packages:

- Use LS to examine project structure
- Use Grep to identify error patterns or relevant files
- Use Read to examine error outputs or test results

Then divide the task by domain expertise:

**Single-domain tasks** (e.g., "fix all linting errors"):

- Create 1-2 work packages for the same specialized agent type
- Group by file or error type

**Multi-domain tasks** (e.g., "fix test failures"):

- Analyze test output to categorize failures by type
- Create one work package per error category
- Assign appropriate specialized agent for each category

**Mixed-strategy tasks**:

- Categorize issues by required domain expertise
- Create specialized work packages for each agent type
- Ensure no overlap in file modifications

## Agent Execution

Launch multiple specialized Task agents in parallel (all in a single message) using the appropriate `subagent_type`.

**Best practices:**

- Send all Task tool calls in one batch for true parallelization
- Match agent type to problem domain for higher success rates
- Give each agent clear domain-specific scope
- Ensure agents don't modify the same files

**Agent specialization advantages:**

- Domain-specific tools and knowledge
- Optimized approaches for specific problem types
- Better error pattern recognition
- Higher fix success rates

Each specialized agent prompt should include:

- The agent's domain expertise and role
- Specific scope (files/directories/error types to address)
- The specialized work to complete
- Constraints to avoid conflicts with other agents
- Expected output format including cross-domain issues

## Result Synthesis

After specialized agents complete:

- Validate each agent's domain-specific results
- Identify any cross-domain conflicts or dependencies
- Merge findings into a coherent summary
- Report which agent types were most effective
- Recommend follow-up work if issues require different specializations

## Quick Reference: Agent Type Mapping

- **Linting** → `linting-fixer`
- **Type errors** → `type-error-fixer`
- **Import errors** → `import-error-fixer`
- **API tests** → `api-test-fixer`
- **Database tests** → `database-test-fixer`
- **Unit tests** → `unit-test-fixer`
- **Git commits** → `commit-orchestrator`
- **CI/CD** → `ci-workflow-orchestrator`
- **Deep investigation** → `digdeep`
- **Security** → `security-scanner`
- **Performance** → `performance-test-fixer`
- **E2E tests** → `e2e-test-fixer`
- **Independent tasks** → `parallel-executor`
- **Complex coordination** → `general-purpose`
