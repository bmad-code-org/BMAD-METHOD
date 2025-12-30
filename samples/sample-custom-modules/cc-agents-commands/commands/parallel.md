---
description: "Parallelize work across multiple specialized agents with conflict detection and phased execution"
argument-hint: "<task_description>"
allowed-tools: ["Task"]
---

Invoke the parallel-orchestrator agent to handle this parallelization request:

$ARGUMENTS

The parallel-orchestrator will:
1. Analyze the task and categorize by domain expertise
2. Detect file conflicts to prevent race conditions
3. Create non-overlapping work packages for each agent
4. Spawn appropriate specialized agents in TRUE parallel (single message)
5. Aggregate results and validate

## Agent Routing

The orchestrator automatically routes to the best specialist:
- **Test failures** → unit-test-fixer, api-test-fixer, database-test-fixer, e2e-test-fixer
- **Type errors** → type-error-fixer
- **Import errors** → import-error-fixer
- **Linting** → linting-fixer
- **Security** → security-scanner
- **Generic** → general-purpose

## Safety Controls

- Maximum 6 agents per batch
- Automatic conflict detection
- Phased execution for dependent work
- JSON output enforcement for efficiency
