# Whiteport Design Studio (WDS) Module

**Design-focused methodology for UX/UI product development**

## Overview

Whiteport Design Studio provides a complete design workflow from product exploration through detailed component specifications. WDS creates the design artifacts that feed into development modules like BMad Method (BMM).

## Module Structure

```
wds/
├── _module-installer/          # Installation configuration
├── agents/                     # WDS specialized agents (Norse Pantheon)
│   ├── saga-analyst.agent.yaml # Saga-Analyst - Business & Product Analyst
│   ├── freyja-pm.agent.yaml    # Freyja-PM - Product Manager
│   └── baldr-ux.agent.yaml     # Baldr-UX - UX/UI Designer
├── workflows/                  # Phase-selectable design workflows
├── data/                       # Standards, frameworks, presentations
│   └── presentations/          # Agent introduction presentations
├── docs/                       # Module documentation
│   ├── method/                 # Methodology deep-dives
│   └── images/                 # Diagrams and visuals
├── examples/                   # Real-world usage examples
│   └── dog-week-patterns/      # Patterns from Dog Week project
├── reference/                  # Templates and checklists
│   ├── templates/              # Document templates
│   └── checklists/             # Phase completion checklists
├── teams/                      # Team configurations
└── README.md                   # This file (only README in module)
```

## Output Folder Structure

WDS creates an alphabetized folder structure in the user's `docs/` folder:

| Folder | Phase | Purpose |
|--------|-------|---------|
| `A-Product-Brief/` | 1 | Strategic foundation & vision |
| `B-Trigger-Map/` | 2 | Business goals, personas, drivers |
| `C-Scenarios/` | 4 | Visual specifications & sketches |
| `D-PRD/` | 3 | Product requirements documentation |
| `D-Design-System/` | 5 | Component library & design tokens |
| `E-UI-Roadmap/` | 6 | Development integration bridge |

## Phases

1. **Product Exploration** → `A-Product-Brief/`
2. **User Research** → `B-Trigger-Map/`
3. **Requirements** → `D-PRD/`
4. **Conceptual Design** → `C-Scenarios/`
5. **Component Design** → `D-Design-System/`
6. **Dev Integration** → `E-UI-Roadmap/`

## Agents - The Norse Pantheon 🏔️

| Agent | File | Role | Norse Meaning |
|-------|------|------|---------------|
| **Saga-Analyst** | `saga-analyst.agent.yaml` | Business & Product Analyst | Goddess of stories & wisdom |
| **Freyja-PM** | `freyja-pm.agent.yaml` | Product Manager | Goddess of love, war & strategy |
| **Baldr-UX** | `baldr-ux.agent.yaml` | UX/UI Designer | God of light & beauty |

## Conventions

- **One README rule:** Only this README.md; all other docs use `xxx-guide.md` naming
- **Alphabetized output:** A-B-C-D-E folder prefix in user projects
- **Design focus:** No development artifacts (handled by BMM)
- **Phase-selectable:** Users choose phases based on project scale

## Quick Start

```
# After installing BMad with WDS module
npx bmad-method@alpha install

# In your IDE, activate any WDS agent and run:
*workflow-init
```

## Integration with BMM

WDS outputs feed directly into BMad Method development workflows:

```
WDS → E-UI-Roadmap/ → BMM Architecture & Stories
```

---

<sub>Part of the BMad ecosystem • Contributed by Whiteport Collective</sub>

