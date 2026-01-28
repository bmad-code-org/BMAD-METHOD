# RMTN Developer Suite

A 'Senior Developer in a Box' for elite solo developers.

Automates context management and enforces a 'Plan -> Execute' workflow.

---

## Overview

A "Senior Developer in a Box" that automates context-keeping and planning overhead, allowing a solo developer to move with the speed and quality of a full team. The "Standard of Excellence for Solo Devs" enforces a "Plan → Execute" discipline with automated context management.

---

## Installation

```bash
bmad install rmtn-solo-dev
```

---

## Quick Start

1.  **Onboard:** Run `[SC] Scan Project` with Mimir to generate your Saga (PRD/Arch).
2.  **Plan:** Use `[NQ] New Quest` with Thor to plan your first feature.
3.  **Execute:** Run `[EX] Execute Quest` to implement the plan.

**For detailed documentation, see [docs/](docs/).**

---

## Components

### Agents

- **Mimir (The Sage):** Context Keeper, Analyst.
- **Thor (The Builder):** Implementation, Execution.

### Workflows

- **Scan Project:** Scans codebase to generate Saga (PRD/Arch).
- **New Quest:** Plans a new feature (Approach scoring + Tech Spec).
- **Execute Quest:** Implements a planned Quest step-by-step.
- **Update Saga:** Updates Saga based on completed Quests.
- **Quick Fix:** Rapidly fixes bugs without full Quest ceremony.

---

## Configuration

The module supports these configuration options (set during installation):

- `saga_folder`: Where should the Saga (Context/Arch) be stored?
- `quests_folder`: Where should Quests be stored?

---

## Module Structure

```
rmtn-solo-dev/
├── module.yaml
├── README.md
├── TODO.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   └── examples.md
├── agents/
├── workflows/
└── _module-installer/
```

---

## Documentation

For detailed user guides and documentation, see the **[docs/](docs/)** folder:
- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [Examples](docs/examples.md)

---

## Development Status

This module is currently in development. The following components are planned:

- [ ] Agents: 2 agents
- [ ] Workflows: 5 workflows

See TODO.md for detailed status.

---

## Author

Created via BMAD Module workflow

---

## License

Part of the BMAD framework.
