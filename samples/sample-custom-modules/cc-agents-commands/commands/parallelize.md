---
description: "Parallelizes tasks across sub-agents"
prerequisites: "—"
argument-hint: "<task_description> [--workers=N] [--strategy=auto|file|feature|layer|test|analysis]"
allowed-tools: ["Task", "TodoWrite", "Glob", "Grep", "Read", "LS"]
---

Parallelize the following task across independent agents: $ARGUMENTS

## Task Analysis

Parse the arguments and understand the parallelization requirements:

- Extract any `--workers=N` option to guide agent count
- Extract any `--strategy=TYPE` option (or auto-detect from task content)
- Identify the core work to be parallelized

## Strategy Detection

Analyze the task to determine the best parallelization approach:

- **File-based**: Task mentions file patterns (.js, .py, .md) or specific file/directory paths
- **Feature-based**: Task involves distinct components, modules, or features
- **Layer-based**: Task spans frontend/backend/database/API architectural layers
- **Test-based**: Task involves running or fixing tests across multiple suites
- **Analysis-based**: Task requires research or analysis from multiple perspectives

## Work Package Creation

Divide the task into independent work packages based on the strategy:

**For file-based tasks:**

- Use Glob to identify relevant files
- Group related files together (avoid splitting dependencies)
- Ensure agents don't modify shared files

**For feature-based tasks:**

- Identify distinct features or components
- Create clear boundaries between feature scopes
- Assign one feature per agent

**For layer-based tasks:**

- Separate by architectural layers (frontend, backend, database)
- Define clear interface boundaries
- Ensure layers can be worked on independently

**For test-based tasks:**

- Group test suites by independence
- Separate unit tests from integration tests when beneficial
- Distribute test execution across agents

**For analysis-based tasks:**

- Break analysis into distinct aspects or questions
- Assign different research approaches or sources to each agent
- Consider multiple perspectives on the problem

## Agent Execution

Launch multiple Task agents in parallel (all in a single message) using `subagent_type="parallel-executor"`.

**Best practices:**

- Send all Task tool calls in one batch for true parallelization
- Give each agent clear scope boundaries to avoid conflicts
- Include specific instructions for each agent's work package
- Define what each agent should NOT modify to prevent overlaps

**Typical agent count:**

- Simple tasks (1-2 components): 2-3 agents
- Medium tasks (3-5 components): 3-4 agents
- Complex tasks (6+ components): 4-6 agents

Each agent prompt should include:

- The specific work package it's responsible for
- Context about the overall parallelization task
- Clear scope (which files/components to work on)
- Constraints (what NOT to modify)
- Expected output format

## Result Synthesis

After agents complete:

- Collect and validate each agent's results
- Check for any conflicts or overlaps between agents
- Merge findings into a coherent summary
- Report on overall execution and any issues encountered
