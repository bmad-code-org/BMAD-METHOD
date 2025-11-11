# BMM - BMad Method Module

Core orchestration system for AI-driven agile development, providing comprehensive lifecycle management through specialized agents and workflows.

---

## 📚 Complete Documentation

👉 **[BMM Documentation Hub](./docs/README.md)** - Start here for complete guides, tutorials, and references

**Quick Links:**

- **[Quick Start Guide](./docs/quick-start.md)** - New to BMM? Start here (15 min)
- **[Agents Guide](./docs/agents-guide.md)** - Meet your 12 specialized AI agents (45 min)
- **[Scale Adaptive System](./docs/scale-adaptive-system.md)** - How BMM adapts to project size (42 min)
- **[FAQ](./docs/faq.md)** - Quick answers to common questions
- **[Glossary](./docs/glossary.md)** - Key terminology reference

---

## 🏗️ Module Structure

This module contains:

```
bmm/
├── agents/          # 12 specialized AI agents (PM, Architect, SM, DEV, TEA, etc.)
├── workflows/       # 34 workflows across 4 phases + testing
├── teams/           # Pre-configured agent groups
├── tasks/           # Atomic work units
├── testarch/        # Comprehensive testing infrastructure
└── docs/            # Complete user documentation
```

### Agent Roster

**Core Development:** PM, Analyst, Architect, SM, DEV, TEA, UX Designer, Technical Writer
**Game Development:** Game Designer, Game Developer, Game Architect
**Orchestration:** BMad Master (from Core)

👉 **[Full Agents Guide](./docs/agents-guide.md)** - Roles, workflows, and when to use each agent

### Workflow Phases

**Phase 0:** Documentation (brownfield only)
**Phase 1:** Analysis (optional) - 5 workflows
**Phase 2:** Planning (required) - 6 workflows
**Phase 3:** Solutioning (Level 3-4) - 2 workflows
**Phase 4:** Implementation (iterative) - 10 workflows
**Testing:** Quality assurance (parallel) - 9 workflows

👉 **[Workflow Guides](./docs/README.md#-workflow-guides)** - Detailed documentation for each phase

---

## 🚀 Getting Started

**New Project:**

```bash
# Install BMM
npx bmad-method@alpha install

# Load Analyst agent in your IDE, then:
*workflow-init
```

**Existing Project (Brownfield):**

```bash
# Document your codebase first
*document-project

# Then initialize
*workflow-init
```

👉 **[Quick Start Guide](./docs/quick-start.md)** - Complete setup and first project walkthrough

---

## 🎯 Key Concepts

### Scale-Adaptive Design

BMM automatically adjusts to project complexity (Levels 0-4):

- **Level 0-1:** Quick Spec Flow for bug fixes and small features
- **Level 2:** PRD with optional architecture
- **Level 3-4:** Full PRD + comprehensive architecture

👉 **[Scale Adaptive System](./docs/scale-adaptive-system.md)** - Complete level breakdown

### Story-Centric Implementation

Stories move through a defined lifecycle: `backlog → drafted → ready → in-progress → review → done`

Just-in-time epic context and story context provide exact expertise when needed.

👉 **[Implementation Workflows](./docs/workflows-implementation.md)** - Complete story lifecycle guide

### Multi-Agent Collaboration

Use party mode to engage all 19+ agents (from BMM, CIS, BMB, custom modules) in group discussions for strategic decisions, creative brainstorming, and complex problem-solving.

👉 **[Party Mode Guide](./docs/party-mode.md)** - How to orchestrate multi-agent collaboration

---

## 📖 Additional Resources

- **[Brownfield Guide](./docs/brownfield-guide.md)** - Working with existing codebases
- **[Quick Spec Flow](./docs/quick-spec-flow.md)** - Fast-track for Level 0-1 projects
- **[Enterprise Agentic Development](./docs/enterprise-agentic-development.md)** - Team collaboration patterns
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[IDE Setup Guides](../../../docs/ide-info/)** - Configure Claude Code, Cursor, Windsurf, etc.

---

## 🤝 Community

- **[Discord](https://discord.gg/gk8jAdXWmj)** - Get help, share feedback (#general-dev, #bugs-issues)
- **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Report bugs or request features
- **[YouTube](https://www.youtube.com/@BMadCode)** - Video tutorials and walkthroughs

---

**Ready to build?** → [Start with the Quick Start Guide](./docs/quick-start.md)
