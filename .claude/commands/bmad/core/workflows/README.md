# CORE Workflows

## Available Workflows in core

**brainstorming**

- Path: `bmad/core/workflows/brainstorming/workflow.yaml`
- Facilitate interactive brainstorming sessions using diverse creative techniques. This workflow facilitates interactive brainstorming sessions using diverse creative techniques. The session is highly interactive, with the AI acting as a facilitator to guide the user through various ideation methods to generate and refine creative solutions.

**party-mode**

- Path: `bmad/core/workflows/party-mode/workflow.yaml`
- Orchestrates group discussions between all installed BMAD agents, enabling natural multi-agent conversations

## Execution

When running any workflow:

1. LOAD {project-root}/bmad/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes

- Normal: Full interaction
- #yolo: Skip optional steps
