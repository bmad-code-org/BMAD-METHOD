---
title: Agents
description: Default BMM agents with their menu triggers and primary workflows
sidebar:
  order: 2
---

## Default Agents

This page lists the default BMM (Agile suite) agents that install with BMad Method, along with their menu triggers and primary workflows.

## Notes

- Triggers are the short menu codes (e.g., `CP`) and fuzzy matches shown in each agent menu.
- Slash commands are generated separately. See [Commands](./commands.md) for the slash command list and where they are defined.
- QA (Quinn) is the lightweight test automation agent in BMM. The full Test Architect (TEA) lives in its own module.

| Agent                       | Triggers                           | Primary workflows                                                                                   |
| --------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Analyst (Mary)              | `BP`, `RS`, `CB`, `DP`             | Brainstorm Project, Research, Create Brief, Document Project                                        |
| Product Manager (John)      | `CP`, `VP`, `EP`, `CE`, `IR`, `CC` | Create/Validate/Edit PRD, Create Epics and Stories, Implementation Readiness, Correct Course        |
| Architect (Winston)         | `CA`, `IR`                         | Create Architecture, Implementation Readiness                                                       |
| Scrum Master (Bob)          | `SP`, `CS`, `ER`, `CC`             | Sprint Planning, Create Story, Epic Retrospective, Correct Course                                   |
| Developer (Amelia)          | `DS`, `CR`                         | Dev Story, Code Review                                                                              |
| QA Engineer (Quinn)         | `QA`                               | Automate (generate tests for existing features)                                                     |
| Quick Flow Solo Dev (Barry) | `QS`, `QD`, `CR`                   | Quick Spec, Quick Dev, Code Review                                                                  |
| UX Designer (Sally)         | `CU`                               | Create UX Design                                                                                    |
| Technical Writer (Paige)    | `DP`, `WD`, `US`, `MG`, `VD`, `EC` | Document Project, Write Document, Update Standards, Mermaid Generate, Validate Doc, Explain Concept |
