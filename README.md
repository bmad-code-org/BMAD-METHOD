# Whiteport Design Studio (WDS) - BMad Method Module

[![Fork of BMad Method](https://img.shields.io/badge/Fork%20of-BMad%20Method%20v6-blue)](https://github.com/bmad-code-org/BMAD-METHOD)
[![Module Status](https://img.shields.io/badge/Status-In%20Development-orange)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 About This Fork

This repository is a **fork of [BMad-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)** with the purpose of contributing the **Whiteport Design Studio (WDS)** module to the BMad ecosystem.

### What is Whiteport Design Studio?

**WDS** is a design-focused methodology module that provides a complete **UX/UI design workflow** for product development—from initial product exploration through detailed component specifications. It complements the development-focused BMad Method (BMM) module by providing the **design artifacts** that feed into development.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BMad Ecosystem                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐      ┌─────────────────┐                     │
│   │  Whiteport      │      │  BMad Method    │                     │
│   │  Design Studio  │ ───► │  (BMM)          │                     │
│   │  (WDS)          │      │                 │                     │
│   │                 │      │                 │                     │
│   │  • Product Brief│      │  • Architecture │                     │
│   │  • Trigger Map  │      │  • Epics/Stories│                     │
│   │  • Scenarios    │      │  • Development  │                     │
│   │  • PRD          │      │  • Testing      │                     │
│   │  • Design System│      │  • Deployment   │                     │
│   │  • UI Roadmap   │      │                 │                     │
│   │                 │      │                 │                     │
│   │  DESIGN ────────┼──────┼► DEVELOPMENT    │                     │
│   └─────────────────┘      └─────────────────┘                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ WDS Module Structure

The WDS module will be located at `src/modules/wds/` and follows BMad v6 module conventions:

```
src/modules/wds/
├── _module-installer/          # Installation configuration
│   └── install-config.yaml
├── agents/                     # WDS specialized agents
│   ├── analyst.agent.yaml      # Mary - Business & Product Analyst
│   ├── pm.agent.yaml           # Sarah - Product Manager
│   └── designer.agent.yaml     # Sally - UX/UI Designer
├── workflows/                  # Phase-selectable workflows
├── data/                       # Standards, frameworks, presentations
├── docs/                       # Module documentation (xxx-guide.md)
├── examples/                   # Real-world usage examples
├── reference/                  # Templates and checklists
├── teams/                      # Team configurations
└── README.md                   # Module entry point (only README)
```

---

## 📁 WDS Output Folder Structure

WDS creates a distinctive **alphabetized folder structure** in the user's project `docs/` folder:

```
docs/
├── A-Product-Brief/            # Phase 1: Strategic foundation & vision
├── B-Trigger-Map/              # Phase 2: Business goals, personas, drivers
├── C-Scenarios/                # Phase 4: Visual specifications & sketches
├── D-PRD/                      # Phase 3: Product requirements documentation
├── D-Design-System/            # Phase 5: Component library & design tokens
└── E-UI-Roadmap/               # Phase 6: Development integration bridge
```

**Why alphabetical?** The `A-B-C-D-E` prefix creates a clear visual namespace that:
- Groups WDS artifacts together in file explorers
- Distinguishes from other project documentation
- Provides natural sort order matching workflow progression
- Becomes a recognizable WDS brand signature

---

## 🔄 The WDS Phases

WDS provides **6 design phases** that can be selected based on project scale:

| Phase | Name | Output Folder | Description |
|-------|------|---------------|-------------|
| 1️⃣ | **Product Exploration** | `A-Product-Brief/` | Vision, positioning, ICP framework |
| 2️⃣ | **User Research** | `B-Trigger-Map/` | Personas, business goals, driving forces |
| 3️⃣ | **Requirements** | `D-PRD/` | Functional & technical requirements |
| 4️⃣ | **Conceptual Design** | `C-Scenarios/` | User scenarios, sketches, specifications |
| 5️⃣ | **Component Design** | `D-Design-System/` | Design tokens, component library |
| 6️⃣ | **Dev Integration** | `E-UI-Roadmap/` | Handoff artifacts for development |

### Phase-Selectable Workflow

Unlike rigid tracks, WDS allows users to **select individual phases** based on project needs:

- **Landing page?** → Phases 1, 4, 5
- **Full product?** → All 6 phases
- **Existing product enhancement?** → Phases 2, 4, 5, 6
- **Design system only?** → Phases 4, 5

---

## 🤖 WDS Agents - The Norse Pantheon 🏔️

WDS introduces **3 specialized design agents** named after Norse mythology:

| Agent | Role | Norse Meaning |
|-------|------|---------------|
| **Saga-Analyst** | Business & Product Analyst | Goddess of stories & wisdom - uncovers your business story |
| **Freyja-PM** | Product Manager | Goddess of love, war & strategy - leads with heart and mind |
| **Baldr-UX** | UX/UI Designer | God of light & beauty - makes everything radiant |

---

## 🔗 Integration with BMad Method (BMM)

WDS is designed to **hand off to BMM** for development:

```
WDS Design Phases                    BMM Development Phases
─────────────────                    ─────────────────────
A-Product-Brief/    ──────────────►  Architecture Context
B-Trigger-Map/      ──────────────►  User Story Personas
D-PRD/              ──────────────►  Epic Breakdown Source
C-Scenarios/        ──────────────►  Story Specifications
D-Design-System/    ──────────────►  Component Implementation
E-UI-Roadmap/       ──────────────►  Development Roadmap
```

The `E-UI-Roadmap/` folder serves as the **integration bridge**, containing:
- Scenario-to-epic mapping
- Priority recommendations
- Technical constraints
- Component implementation notes
- Object ID inventory for testing

---

## 📋 Development Status

### Current Phase: Module Structure Setup

- [ ] Create `src/modules/wds/` folder structure
- [ ] Create `_module-installer/install-config.yaml`
- [ ] Convert agents to v6 YAML format (Mary, Sarah, Sally)
- [ ] Create phase-selectable workflow initialization
- [ ] Build core workflows for each phase
- [ ] Create documentation (xxx-guide.md format)
- [ ] Add example content (Dog Week patterns)
- [ ] Test integration with BMM

### Conventions

- **One README:** Only `README.md` at module root; all other docs use `xxx-guide.md` naming
- **Folder structure:** Alphabetized `A-B-C-D-E` prefix for user project output
- **Design focus:** No development/backlog artifacts (handled by BMM)
- **Phase-selectable:** Users choose phases based on project scale

---

## 🙏 Acknowledgments

### BMad Method

This module is built on the excellent **[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)** framework created by the BMad community. WDS leverages BMad Core's modular architecture to provide design-focused workflows.

### Whiteport Collective

WDS is contributed by **[Whiteport Collective](https://github.com/whiteport-collective)**, evolving from the earlier "Whiteport Sketch-to-Code" methodology into a proper BMad v6 module.

---

## 🔄 Keeping This Fork Updated

This fork is regularly synchronized with upstream BMad-METHOD:

```bash
# Sync with upstream
git fetch upstream
git merge upstream/main
git push origin main
```

---

## 📚 Original BMad Method Documentation

For complete BMad Method documentation, see:
- **[BMad Method README](https://github.com/bmad-code-org/BMAD-METHOD)** - Main documentation
- **[BMM Module Docs](./src/modules/bmm/docs/README.md)** - Development workflows
- **[Agent Customization](./docs/agent-customization-guide.md)** - Customize agents
- **[Quick Start Guide](./src/modules/bmm/docs/quick-start.md)** - Get started

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

**BMad Method** is a trademark of BMad Code, LLC.  
**Whiteport Design Studio** is contributed by Whiteport Collective.

---

<p align="center">
  <sub>Building the design bridge for human-AI collaboration 🎨</sub>
</p>
