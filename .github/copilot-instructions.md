<!-- BMAD:START -->

# BMAD Method — Project Instructions

## Project Configuration

- **Project**: snowmain1
- **User**: Sergey
- **Communication Language**: English
- **Document Output Language**: English
- **User Skill Level**: expert
- **Output Folder**: {project-root}/\_bmad-output/{context} (Dynamic)
- **Planning Artifacts**: {project-root}/\_bmad-output/{context}/planning-artifacts
- **Implementation Artifacts**: {project-root}/\_bmad-output/{context}/implementation-artifacts
- **Project Knowledge**: {project-root}/docs

## BMAD Runtime Structure

- **Agent definitions**: `_bmad/bmm/agents/` (BMM module) and `_bmad/core/agents/` (core)
- **Workflow definitions**: `_bmad/bmm/workflows/` (organized by phase)
- **Core tasks**: `_bmad/core/tasks/` (help, editorial review, indexing, sharding, adversarial review)
- **Core workflows**: `_bmad/core/workflows/` (brainstorming, party-mode, advanced-elicitation)
- **Workflow engine**: `_bmad/core/tasks/workflow.xml` (executes YAML-based workflows)
- **Module configuration**: `_bmad/bmm/config.yaml`
- **Core configuration**: `_bmad/core/config.yaml`
- **Agent manifest**: `_bmad/_config/agent-manifest.csv`
- **Workflow manifest**: `_bmad/_config/workflow-manifest.csv`
- **Help manifest**: `_bmad/_config/bmad-help.csv`
- **Agent memory**: `_bmad/_memory/`

## Key Conventions

- Always load `_bmad/bmm/config.yaml` before any agent activation or workflow execution
- Store all config fields as session variables: `{user_name}`, `{communication_language}`, `{output_folder}`, `{planning_artifacts}`, `{implementation_artifacts}`, `{project_knowledge}`
- MD-based workflows execute directly — load and follow the `.md` file
- YAML-based workflows require the workflow engine — load `workflow.xml` first, then pass the `.yaml` config
- Follow step-based workflow execution: load steps JIT, never multiple at once
- Save outputs after EACH step when using the workflow engine
- The `{project-root}` variable resolves to the workspace root at runtime

## Available Agents

| Agent               | Persona     | Title                                                                | Capabilities                                                                             |
| ------------------- | ----------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| bmad-master         | BMad Master | BMad Master Executor, Knowledge Custodian, and Workflow Orchestrator | runtime resource management, workflow orchestration, task execution, knowledge custodian |
| analyst             | Mary        | Business Analyst                                                     | market research, competitive analysis, requirements elicitation, domain expertise        |
| architect           | Winston     | Architect                                                            | distributed systems, cloud infrastructure, API design, scalable patterns                 |
| dev                 | Amelia      | Developer Agent                                                      | story execution, test-driven development, code implementation                            |
| pm                  | John        | Product Manager                                                      | PRD creation, requirements discovery, stakeholder alignment, user interviews             |
| qa                  | Quinn       | QA Engineer                                                          | test automation, API testing, E2E testing, coverage analysis                             |
| quick-flow-solo-dev | Barry       | Quick Flow Solo Dev                                                  | rapid spec creation, lean implementation, minimum ceremony                               |
| sm                  | Bob         | Scrum Master                                                         | sprint planning, story preparation, agile ceremonies, backlog management                 |
| tech-writer         | Paige       | Technical Writer                                                     | documentation, Mermaid diagrams, standards compliance, concept explanation               |
| ux-designer         | Sally       | UX Designer                                                          | user research, interaction design, UI patterns, experience strategy                      |

## Slash Commands

Type `/bmad-` in Copilot Chat to see all available BMAD workflows and agent activators. Agents are also available in the agents dropdown.

<!-- BMAD:END -->
