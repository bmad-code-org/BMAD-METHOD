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
│   └── installer.js
├── agents/                     # WDS specialized agents
│   ├── saga-analyst.agent.yaml # Saga - WDS Analyst
│   ├── idunn-pm.agent.yaml     # Idunn - WDS PM
│   └── freyja-ux.agent.yaml    # Freyja - WDS Designer
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
├── A-Product-Brief/            # Phase 1: Product Exploration
├── B-Trigger-Map/              # Phase 2: Trigger Mapping
├── C-Platform-Requirements/    # Phase 3: PRD Platform (technical foundation)
├── C-Scenarios/                # Phase 4: UX Design (scenarios & specifications)
├── D-Design-System/            # Phase 5: Design System (component library)
├── E-PRD/                      # Phase 6: PRD & Design Deliveries
├── F-Testing/                  # Phase 7: Testing validation
└── G-Product-Development/      # Phase 8: Ongoing product development
```

**Why alphabetical?** The `A-B-C-D-E` prefix creates a clear visual namespace that:
- Groups WDS artifacts together in file explorers
- Distinguishes from other project documentation
- Provides natural sort order matching workflow progression
- Becomes a recognizable WDS brand signature

---

## 🔄 The WDS Phases

WDS provides **8 design phases** that can be selected based on project scale:

| Phase | Name | Output Folder | Description |
|-------|------|---------------|-------------|
| 1️⃣ | **Product Exploration** | `A-Product-Brief/` | Vision, positioning, ICP framework |
| 2️⃣ | **Trigger Mapping** | `B-Trigger-Map/` | Personas, business goals, Feature Impact Analysis |
| 3️⃣ | **PRD Platform** | `C-Platform-Requirements/` | Technical foundation (parallel with Phase 4) |
| 4️⃣ | **UX Design** | `C-Scenarios/` | User scenarios, sketches, specifications |
| 5️⃣ | **Design System** | `D-Design-System/` | Design tokens, component library (optional) |
| 6️⃣ | **PRD & Design Deliveries** | `E-PRD/` | Complete PRD + packaged flows for BMM |
| 7️⃣ | **Testing** | `F-Testing/` | Designer validation of implementation |
| 8️⃣ | **Product Development** | `G-Product-Development/` | Ongoing improvements (existing products) |

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
| **Saga the WDS Analyst** | Business & Product Analyst | Goddess of stories & wisdom - uncovers your business story |
| **Idunn the WDS PM** | Product Manager | Goddess of renewal & youth - keeps projects vital and thriving |
| **Freyja the WDS Designer** | UX/UI Designer | Goddess of beauty, magic & strategy - creates experiences users love |

---

## 🔗 Integration with BMad Method (BMM)

WDS is designed to **hand off to BMM** for development:

```
WDS Design Phases                    BMM Development Phases
─────────────────                    ─────────────────────
A-Product-Brief/    ──────────────►  Architecture Context
B-Trigger-Map/      ──────────────►  User Story Personas
C-Platform-Requirements/ ─────────►  Technical Foundation
C-Scenarios/        ──────────────►  Story Specifications
D-Design-System/    ──────────────►  Component Implementation
E-PRD/              ──────────────►  PRD + Design Deliveries
```

The `E-PRD/` folder serves as the **integration bridge**, containing:
- Complete PRD (00-PRD.md) with functional requirements
- Design Deliveries (DD-XXX.yaml) - packaged flows for BMM handoff
- Scenario-to-epic mapping
- Component references
- Test scenarios

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ installed
- BMad Method CLI installed (`npm install -g @bmad/cli`)

### Install WDS Module

```bash
# Clone this repository
git clone https://github.com/whiteport-collective/whiteport-design-studio.git
cd whiteport-design-studio

# Install dependencies
npm install

# Install WDS module to your project
cd /path/to/your/project
bmad install wds
```

### What Gets Installed

The WDS installer creates:
- ✅ `docs/` directory structure with alphabetized folders (A-G)
- ✅ All 8 phase folders ready for your design work
- ✅ `.gitkeep` files to preserve empty directories
- ✅ `E-PRD/Design-Deliveries/` subfolder for BMM handoff

### Getting Started

After installation, activate any WDS agent:

```bash
# Start with Product Brief
bmad agent saga-wds-analyst

# Or jump to Platform Requirements
bmad agent idunn-wds-pm

# Or begin with UX Design
bmad agent freyja-wds-designer
```

---

## 📋 Development Status

### ✅ Complete

- ✅ Module folder structure (`src/modules/wds/`)
- ✅ Installation system (`_module-installer/installer.js`)
- ✅ All 3 agents converted to v6 YAML (Saga, Idunn, Freyja)
- ✅ Agent presentations and personas
- ✅ All 8 phase workflows complete
- ✅ Team configurations
- ✅ Complete documentation (method guides)
- ✅ Workflow architecture (step-file system)

### 🔄 Optional Enhancements

- [ ] Dog Week example patterns
- [ ] Conversation examples
- [ ] WDS Trigger Map example

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
