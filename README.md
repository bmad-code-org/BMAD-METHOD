# BMad CORE v6 Alpha

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

**The Universal Human-AI Collaboration Platform**

BMad-CORE (Collaboration Optimized Reflection Engine) is a revolutionary framework that amplifies human potential through specialized AI agents. Unlike traditional AI tools that replace human thinking, BMad-CORE guides you through reflective workflows that bring out your best ideas and the AI's full capabilities.

**🎯 Human Amplification, Not Replacement** • **🎨 Works in Any Domain** • **⚡ Powered by Specialized Agents**

---

## 🚀 Quick Start

**Prerequisites**: [Node.js](https://nodejs.org) v20+ required

**One-line install** (thanks Lum!):

```bash
git clone --branch v6-alpha --single-branch https://github.com/bmad-code-org/BMAD-METHOD
cd BMAD-METHOD && npm install
```

**Install to your project:**

```bash
npm run install:bmad
```

Follow the interactive prompts. **Important**: When asked for a destination, provide the **full path** to your project folder (don't accept the default).

**Essential Reading**: Before using BMad Method, read the **[BMM v6 Workflows Guide](./src/modules/bmm/workflows/README.md)** to understand the four-phase workflow system.

**Stay Connected**:

- ⭐ **[Star this repo](https://github.com/bmad-code-org/BMAD-METHOD)** to get notified of updates
- 🎥 **[Subscribe on YouTube](https://www.youtube.com/@BMadCode?sub_confirmation=1)** for tutorials
- 💬 **[Join Discord Community](https://discord.gg/gk8jAdXWmj)** for support and collaboration

---

## ⚠️ Alpha Status

**This is an active alpha release.** Please help us improve by testing and reporting issues!

| Status                        | Details                                                                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔄 **Frequent Updates**       | Pull often. Delete `node_modules` and run `npm install` after updates                                                                                                        |
| 🧪 **Potentially Unstable**   | Features and file structure may change frequently. [File issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) or discuss in [Discord](https://discord.gg/gk8jAdXWmj) |
| 🚧 **Work in Progress**       | Many features, polish, docs, agents, and workflows still coming before and after beta                                                                                        |
| 💻 **IDE/Local LLM Required** | Web bundles not fully working yet. Use quality LLM Models and tools for testing (especially BMM module)                                                                      |
| 🔀 **PR Target**              | Submit PRs against `v6-alpha` branch, not `main`                                                                                                                             |

**📋 [View v6 Alpha Open Items & Roadmap](./v6-open-items.md)** - Track progress and what's coming next

---

## What is BMad-CORE?

### The Problem with Traditional AI

Traditional AI tools provide **average, bland solutions** and do the thinking **for** you, making you dependent rather than capable.

### The BMad-CORE Difference

BMad-CORE brings out **the best thinking in you and the AI** through:

- **Guided Collaboration**: AI agents act as expert coaches, mentors, and collaborators
- **Reflective Workflows**: Structured frameworks that help you discover insights
- **Strategic Questioning**: Agents ask the right questions to stimulate your thinking
- **Domain Mastery**: Build expertise rather than just getting answers
- **Amplified Abilities**: Your natural talents enhanced, not replaced

### The C.O.R.E. System

- **C**ollaboration: Human-AI partnership where both contribute unique strengths
- **O**ptimized: Refined processes for maximum effectiveness
- **R**eflection: Guided thinking that unlocks better solutions
- **E**ngine: Powerful framework orchestrating specialized agents and workflows

---

## Universal Domain Coverage Through Modules

BMad-CORE works in **any domain** through specialized modules!

### 📦 Available Alpha Modules

#### **BMad Core (core)** - _Always Installed_

The foundation that powers every module. Includes orchestration agents for local environments and web bundles (ChatGPT, Gemini Gems, etc.).

#### **[BMad Method (bmm)](./src/modules/bmm/README.md)** - _Software Development Excellence_

Agile AI-driven software development rebuilt from the ground up on BMad-CORE. Features the revolutionary **Scale Adaptive Workflow Engine™** that adjusts from simple tasks to enterprise-scale projects.

**Four-Phase Methodology**: Analysis → Planning → Solutioning → Implementation

**[📚 Full BMM Documentation](./src/modules/bmm/README.md)** | **[📖 v6 Workflows Guide](./src/modules/bmm/workflows/README.md)**

#### **[BMad Builder (bmb)](./src/modules/bmb/README.md)** - _Create Custom Agents & Workflows_

Your authoring tool for custom agents, workflows, and modules. Easier than ever to customize existing modules or create standalone solutions.

**Three Agent Types**: Full module agents, hybrid agents, and lightweight standalone agents

**[📚 Full BMB Documentation](./src/modules/bmb/README.md)** | **[🎯 Agent Creation Guide](./src/modules/bmb/workflows/create-agent/README.md)**

#### **Creative Intelligence Suite (cis)** - _Innovation & Problem-Solving_

Unlock creative thinking and innovation! Includes brainstorming workflows that power other modules (like BMM) while standing alone as a complete creative toolkit.

**[📚 CIS Documentation](./src/modules/cis/readme.md)**

---

## 🎉 What's New in v6 Alpha

### Complete Ground-Up Rewrite

Everything rebuilt with best practices, advanced prompt engineering, and standardized XML/markdown conventions for maximum agent adherence.

### 🎨 Unprecedented Customizability

- **Agent Customization**: Modify any agent via sidecar files in `bmad/_cfg/agents/`
- **Update-Safe**: Your customizations persist through updates
- **Full Control**: Change names, personas, communication styles, language
- **Multi-Language**: Agents can communicate in your preferred language

### 🚀 Intelligent Installer

Brand new interactive installer that configures:

- Your name (how agents address you)
- Communication language preference
- Communication (chat) technical level of explanation (beginner - advanced level technical user knowledge)
- Documentation output language
- Module-specific customization options
- IDE-specific enhancements globally or per module (e.g., Claude Code sub-agents for BMM)

### 📁 Unified Installation

Everything installs to a single `bmad/` folder - no more scattered root folders. Clean, organized, and efficient.

### 🤝 Consolidated Agent Party

When you install modules, a unified agent party is created for party-mode in your IDE. Super efficient agent simulation with more exciting features coming in beta!

### 🎮 Expanded Game Development

Game development now fully integrated into BMM module:

- **Game Type Adaptive**: Adjusts to the type of game you're making
- **Multi-Engine Support**: More platforms being added

### ⚡ BMM Scale Adaptive Workflows

The BMad Method now adapts to your project scale (Levels 0-4) based on:

- Project scope and complexity
- New vs. existing codebase
- Current codebase state
- Team size and structure

Guides workflows intelligently from simple tech specs to enterprise-scale planning.

### 🆕 Three Agent Types (BMB)

1. **Full Module Agents**: Complete agents embedded in modules
2. **Hybrid Agents**: Shared across modules
3. **Standalone Agents**: Tiny, specialized agents free from any module - perfect for specific needs

---

## BMad Method (BMM) Four-Phase Workflow

The BMM module follows a comprehensive four-phase methodology. Each phase adapts to your project's scale and complexity.

**[Complete workflow documentation →](./src/modules/bmm/workflows/README.md)**

### Phase 1: Analysis _(Optional)_

**Analyst Agent**:

- `brainstorm-project` - Generate and refine project concepts
- `research` - Market research, deep research, prompt generation
- `product-brief` - Document initial product vision

**Game Designer Agent** _(for game projects)_:

- `brainstorm-game` - Game-specific ideation
- `game-brief` - Game concept documentation
- `research` - Game market and technical research

---

### Phase 2: Planning _(Required)_

**PM Agent**:

- `plan-project` - Creates scale-adaptive PRD or GDD

The planning workflow adapts to:

- Project complexity (Levels 0-4)
- Project type (web, mobile, embedded, game, etc.)
- New vs. existing codebase
- Team structure

**Game Designer Agent** _(for game projects)_:

- `plan-game` - Uses same workflow but optimized for Game Design Documents

---

### Phase 3: Solutioning _(Levels 3-4)_

**Architect / Game Architect Agent**:

- `architecture` - Creates adaptive architecture based on project type
  - No more document sharding
  - Adapts sections to your project (web, mobile, embedded, game, etc.)
  - Beyond basic concerns (complex testing, DevOps, security), specialized agents assist _(coming soon)_

- `tech-spec` - Generates Epic Tech Specs
  - Pulls all technical information from planning
  - Includes web research as needed
  - One tech spec per epic
  - Enhances SM's ability to prepare stories

**Note**: The PO can validate epics/stories with checklists, though the Architect maintains them during solutioning.

---

### Phase 4: Implementation _(Iterative)_

**Scrum Master (SM) Agent**:

Before development starts, the SM prepares each story:

1. `create-story` - Generates story from tech spec and context
2. `story-context` - **🎉 NEW!** Game-changing contextual preparation
   - Real-time context gathering for the specific story
   - No more generic file lists
   - Supercharged, specialized development context

**Dev Agent**:

Enhanced developer workflow:

- Development task execution
- Senior dev agent review (replaces separate QA agent)
- Pulls rich context from story-context workflow

**🎊 Many more exciting changes throughout BMM for you to discover during alpha!**

---

## Detailed Installation Guide

### Prerequisites

- **Node.js v20+** ([Download](https://nodejs.org))
- **Git** (for cloning)

### Step-by-Step Installation

#### Step 1: Clone the Repository

**Option A** - One-line install:

```bash
git clone --branch v6-alpha --single-branch https://github.com/bmad-code-org/BMAD-METHOD
```

**Option B** - Standard clone then checkout:

```bash
# Clone via your preferred method:
gh repo clone bmad-code-org/BMAD-METHOD
# OR
git clone https://github.com/bmad-code-org/BMAD-METHOD.git
# OR
git clone git@github.com:bmad-code-org/BMAD-METHOD.git

# Change to the directory
cd BMAD-METHOD

# Checkout alpha branch
git checkout v6-alpha

# Verify branch
git status
# Should show: "On branch v6-alpha. Your branch is up to date with 'origin/v6-alpha'."
```

#### Step 2: Install Dependencies

```bash
npm install
```

Verify `node_modules` folder exists at project root.

#### Step 3: Install to Your Project

```bash
npm run install:bmad
```

**Follow the interactive prompts:**

1. **Destination Path**: Enter the **full path** to your project folder
   - Don't accept the default
   - For new projects, confirm when prompted to create the directory
2. **Module Selection**:
   - **Core** (always installed)
   - **BMM** - BMad Method for software development (default)
   - **BMB** - BMad Builder for creating agents/workflows
   - **CIS** - Creative Intelligence Suite

3. **Configuration**:
   - Your name
   - Preferred communication language
   - Module-specific options

#### Step 4: Understanding the Installation

All modules install to a single `bmad/` folder in your project:

```
your-project/
└── bmad/
    ├── core/         # Core framework (always present)
    ├── bmm/          # BMad Method (if selected)
    ├── bmb/          # BMad Builder (if selected)
    ├── cis/          # Creative Intelligence Suite (shared resources)
    └── _cfg/         # Your customizations
        └── agents/   # Agent sidecar customization files
```

**Note**: You may see folders for modules you didn't explicitly select. This is intentional - modules share minimal required resources. For example, BMM uses CIS brainstorming workflows, so `bmad/cis/` appears with shared files even if you only selected BMM.

---

## Additional Resources

### BMad Builder (BMB) Resources

**Agent Development**:

- [Agent Architecture](src/modules/bmb/workflows/create-agent/agent-architecture)
- [Agent Command Patterns](src/modules/bmb/workflows/create-agent/agent-command-patterns.md)
- [Agent Types](src/modules/bmb/workflows/create-agent/agent-types.md)
- [Communication Styles](src/modules/bmb/workflows/create-agent/communication-styles.md)

**Module Development**:

- [Module Structure](src/modules/bmb/workflows/create-module/module-structure.md)

**Workflow Development**:

- [Workflow Creation Guide](src/modules/bmb/workflows/create-workflow/workflow-creation-guide.md)

> **Coming Soon**: A dedicated module contribution repository (beta release) where you can share your custom modules!

### Installer & Bundler Documentation

- **[CLI Tool Guide](tools/cli/README.md)** - Complete installer, bundler, and agent compilation system
- [IDE Injections](docs/installers-bundlers/ide-injections)
- [Installers Modules Platforms Reference](docs/installers-bundlers/installers-modules-platforms-reference)
- [Web Bundler Usage](docs/installers-bundlers/web-bundler-usage)
- [Claude Code Sub Module BMM Installer](src/modules/bmm/sub-modules/claude-code/readme.md)

---

## Support & Community

We have an amazing, active community ready to help!

- 💬 **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Get help, share ideas, collaborate
- 🐛 **[Issue Tracker](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Report bugs and request features
- 💬 **[GitHub Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions)** - Community conversations
- 🎥 **[YouTube Channel](https://www.youtube.com/@BMadCode)** - Tutorials and updates

---

## Contributing

We welcome contributions and new module development!

**📋 [Read CONTRIBUTING.md](CONTRIBUTING.md)** - Complete contribution guide

**Remember**: Submit PRs against the `v6-alpha` branch, not `main`.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Trademark Notice

BMAD™ and BMAD-METHOD™ are trademarks of BMad Code, LLC. All rights reserved.

---

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

<sub>Built with ❤️ for the human-AI collaboration community</sub>
