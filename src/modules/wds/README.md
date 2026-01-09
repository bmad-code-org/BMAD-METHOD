# Whiteport Design Studio (WDS) 🎨

**Strategic design methodology for creating products users love**

---

## ⚠️ Installation Notice

**The automated installer is currently not working.** You'll need to manually sideload the WDS agents.

### Quick Sideload Instructions:

1. **Copy agent files** from `src/modules/wds/agents/` to your IDE's agent configuration folder
2. **Configure agent paths** in your IDE settings
3. **Verify agents** appear in your IDE's agent list

📖 **Detailed installation guide:** [docs/how-to/installation/install-bmad.md](../../docs/how-to/installation/install-bmad.md)

---

## What You Can Accomplish with WDS

As a designer using WDS, you'll be able to:

🎯 **Create strategic designs** - Connect every design decision to business goals and user psychology  
📋 **Produce complete specifications** - Generate developer-ready page specs with all details defined  
✨ **Explore with AI image generation** - Use NanoBanana/Eira to generate design concepts and establish visual identity  
🎨 **Design with Figma** - Open your prototype in Figma, refine the design, export it back to update the design system and generate new code  
🤖 **Leverage AI agents** - Work with Saga, Idunn, and Freya to accelerate your workflow  
📦 **Deliver with confidence** - Hand off complete, tested prototypes with clear documentation  

### What You Need to Learn

To get the most out of WDS, you'll need to understand:

1. **The WDS workflow** - How phases connect and when to use each one
2. **Agent collaboration** - Working with Saga, Idunn, and Freya to accomplish tasks
3. **Tool integration** - Using Figma MCP, NanoBanana, and other design tools

� **Start learning:** [docs/learn-wds/](docs/learn-wds/) - Interactive courses and tutorials

---

## Module Structure

```
wds/
├── _module-installer/          # Installation configuration
├── agents/                     # WDS specialized agents (Norse Pantheon)
│   ├── saga-analyst.agent.yaml # Saga-Analyst - Business & Product Analyst
│   ├── idunn-pm.agent.yaml     # Idunn-WDS-PM - Product Manager
│   └── freya-ux.agent.yaml    # Freya-WDS-Designer - UX/UI Designer
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

## 📁 Output Structure

WDS creates a clean, alphabetized folder structure in your project's `docs/` folder:

| Folder             | Phase | Purpose                                      | Timing              |
| ------------------ | ----- | -------------------------------------------- | ------------------- |
| `A-Product-Brief/` | 1     | Strategic foundation & vision                | Start here          |
| `B-Trigger-Map/`   | 2     | User psychology & business goals             | After Phase 1       |
| `C-Scenarios/`     | 4     | UX specifications (HOW it works)             | After Phase 2       |
| `D-Design-System/` | 5     | Visual identity & components (HOW it looks)  | **Anytime** 🎨      |
| `D-PRD/`           | 3     | Technical requirements (optional)            | Before development  |
| `E-UI-Roadmap/`    | 6     | Development handoff                          | After Phase 4       |

## 🎯 Design Phases

### Core Workflow

**Phase 1: Product Exploration** → `A-Product-Brief/`  
Define vision, positioning, and success criteria

**Phase 2: User Research** → `B-Trigger-Map/`  
Connect business goals to user psychology and triggers

**Phase 4: UX Design** → `C-Scenarios/`  
**HOW it works** - Functionality, interactions, content structure

**Phase 5: Visual Design** → `D-Design-System/`  
**HOW it looks** - Tie UX to brand, create visual system  
⚡ **Can start anytime** - Brand identity is independent of product!

### Optional Phases

**Phase 3: Requirements** → `D-PRD/` (for technical products)  
**Phase 6: Dev Integration** → `E-UI-Roadmap/` (handoff to development)

---

## 💡 Key Concepts

### UX vs Visual Design

```
Phase 4 (UX Design)
├─ Defines HOW it works
├─ Functionality & interactions
├─ Content structure & hierarchy
└─ Question: "What does this do?"

Phase 5 (Visual Design)
├─ Defines HOW it looks and feels
├─ Brand expression & visual language
├─ Design tokens & system
└─ Question: "How does this feel like our brand?"
```

### Brand Independence

**Visual design is NOT tied to product timing!**

- ✅ Before product work (brand-first approach)
- ✅ Parallel to strategy (simultaneous development)
- ✅ After strategy (informed by insights)

**Output location:** `D-Design-System/01-Visual-Design/`

## Agents - The Norse Pantheon 🏔️

| Agent                   | File                      | Role                       | Norse Meaning                       |
| ----------------------- | ------------------------- | -------------------------- | ----------------------------------- |
| **Saga the Analyst**    | `saga-analyst.agent.yaml` | Business & Product Analyst | Goddess of stories & wisdom         |
| **Idunn the PM**        | `idunn-pm.agent.yaml`     | Product Manager            | Goddess of renewal & youth          |
| **Freya the Designer** | `freya-ux.agent.yaml`    | UX/UI Designer             | Goddess of beauty, magic & strategy |

## 🛠️ Tools & Integration

### Visual Design Tools

- **Figma MCP** - Automated bidirectional sync with Object IDs
- **NanoBanana/Eira** - AI-powered image generation for brand exploration
- **html.to.design** - Import HTML prototypes into Figma

### Workflow Tools

- **Excalidraw** - Sketch analysis and wireframing
- **Git** - Version control and collaboration
- **Cursor/Windsurf** - AI-powered IDE integration

📖 **Full tools guide:** [docs/tools/wds-tools-guide.md](docs/tools/wds-tools-guide.md)

---

## 📋 Conventions

- **One README rule** - Only this README.md; all other docs use `xxx-guide.md` naming
- **Alphabetized output** - A-B-C-D-E folder prefix for clean organization
- **Design focus** - No development artifacts (handled by BMM)
- **Phase-selectable** - Choose phases based on project needs
- **Tool-agnostic** - Works with any design/development tools

## 🚀 Getting Started

### 1. Sideload Agents (Manual Installation)

Since the installer isn't working, manually copy agents:

```bash
# Copy agent files to your IDE's agent folder
cp src/modules/wds/agents/*.yaml <your-ide-agent-folder>/
```

### 2. Activate an Agent

In your IDE, activate one of the WDS agents:
- **Saga** - Business & Product Analyst
- **Idunn** - Product Manager  
- **Freya** - UX/UI Designer

### 3. Initialize Workflow

```
*workflow-init
```

The agent will guide you through project setup and phase selection.

📖 **Detailed setup guide:** [docs/how-to/installation/install-bmad.md](../../docs/how-to/installation/install-bmad.md)

## 🔗 Integration with BMM

WDS design artifacts feed directly into BMad Method (BMM) development workflows:

```
WDS Design System → E-UI-Roadmap/ → BMM Architecture & Stories → Development
```

**Handoff includes:**
- Component specifications with Object IDs
- Design tokens (colors, typography, spacing)
- Interactive HTML prototypes
- User flow documentation
- Acceptance criteria

---

<sub>Part of the BMad ecosystem • Contributed by Whiteport Collective</sub>
