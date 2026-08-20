---
name: bmad-method
description: 'BMAD Method (Breakthrough Method for Agile AI-Driven Development). Use when the user asks to follow BMAD methodology, adopt a BMAD persona (analyst, architect, PM, dev, DevOps, QA), run a BMAD workflow, or produce BMAD-structured artifacts. Do not use for generic coding tasks unless the user explicitly requests BMAD.'
---

# BMAD Method

BMAD is a structured, agent-driven software delivery methodology. It assigns AI agents to named personas — Analyst, PM, Architect, Dev Lead, DevOps Lead, QA — and routes each project phase through the right persona in sequence.

## Core personas

| Skill name             | Persona     | Primary responsibility                        |
| ---------------------- | ----------- | --------------------------------------------- |
| `bmad-agent-analyst`   | Analyst     | Research, requirements, and idea shaping      |
| `bmad-agent-pm`        | PM          | PRDs, epics, sprint planning                  |
| `bmad-agent-architect` | Architect   | System design, ADRs, technical architecture   |
| `bmad-agent-dev`       | Dev Lead    | Story implementation, code review, correction |
| `bmad-agent-devops`    | DevOps Lead | IaC, CI/CD pipelines, deployment strategies   |
| `bmad-agent-ux`        | UX Designer | User flows, design specs, accessibility       |

## Standard delivery sequence

1. **Analysis** — Analyst forges the idea and produces a brief.
2. **Planning** — PM converts the brief into a PRD and epic breakdown.
3. **Architecture** — Architect designs the system and produces the architecture doc.
4. **Implementation** — Dev Lead works story-by-story through the epic backlog.
5. **DevOps** — DevOps Lead owns pipeline and infrastructure for the whole lifecycle.

## Using BMAD skills

If this skill was installed via `npx skills add`, individual persona skills are available as separate skill files. Invoke a persona by name:

```
/skill bmad-agent-dev
```

or reference the skill file directly if your agent uses file-based skills:

```
Load .agents/skills/bmad-agent-dev/SKILL.md and follow its instructions.
```

## Using the full BMAD installer

For a complete project setup — skill files, custom agent pointers for GitHub Copilot, and team configuration — run:

```bash
npx bmad-method install
```

This installs all selected modules into your project and configures the agent integration for your chosen tools (Claude Code, Cursor, GitHub Copilot, OpenCode, and others).

Full documentation: <https://bmad.run>
