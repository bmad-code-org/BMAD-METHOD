# BMad CORE + BMad Method

[![Stable Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=stable)](https://www.npmjs.com/package/bmad-method)
[![Alpha Version](https://img.shields.io/npm/v/bmad-method/alpha?color=orange&label=alpha)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

> **🚨 Alpha Version Notice**
>
> v6-alpha is near-beta quality—stable and vastly improved over v4, but documentation is still being refined. New videos coming soon to the [BMadCode YouTube channel](https://www.youtube.com/@BMadCode)—subscribe for updates!
>
> **Getting Started:**
>
> - **Install v6 Alpha:** `npx bmad-method@alpha install`
> - **Install stable v4:** `npx bmad-method install`
> - **Not sure what to do?** Load any agent and run `*workflow-init` for guided setup
> - **v4 Users:** [View v4 documentation](https://github.com/bmad-code-org/BMAD-METHOD/tree/V4) or [upgrade guide](./docs/v4-to-v6-upgrade.md)

## Universal Human-AI Collaboration Platform

**BMad-CORE** (**C**ollaboration **O**ptimized **R**eflection **E**ngine) amplifies human potential through specialized AI agents. Unlike tools that replace thinking, BMad-CORE guides reflective workflows that bring out your best ideas and AI's full capabilities.

The **BMad-CORE** powers the **BMad Method** (probably why you're here!), but you can also use **BMad Builder** to create custom agents, workflows, and modules for any domain—software development, business strategy, creativity, learning, and more.

**🎯 Human Amplification** • **🎨 Domain Agnostic** • **⚡ Agent-Powered**

## Table of Contents

- [BMad CORE + BMad Method](#bmad-core--bmad-method)
  - [Universal Human-AI Collaboration Platform](#universal-human-ai-collaboration-platform)
  - [Table of Contents](#table-of-contents)
  - [What is BMad-CORE?](#what-is-bmad-core)
    - [v6 Core Enhancements](#v6-core-enhancements)
    - [C.O.R.E. Philosophy](#core-philosophy)
  - [Modules](#modules)
    - [BMad Method (BMM) - AI-Driven Agile Development](#bmad-method-bmm---ai-driven-agile-development)
      - [v6 Highlights](#v6-highlights)
  - [🚀 Quick Start](#-quick-start)
    - [BMad Builder (BMB) - Create Custom Solutions](#bmad-builder-bmb---create-custom-solutions)
    - [Creative Intelligence Suite (CIS) - Innovation \& Creativity](#creative-intelligence-suite-cis---innovation--creativity)
  - [Installation](#installation)
  - [🎯 Working with Agents \& Commands](#-working-with-agents--commands)
    - [Method 1: Agent Menu (Recommended for Beginners)](#method-1-agent-menu-recommended-for-beginners)
    - [Method 2: Direct Slash Commands](#method-2-direct-slash-commands)
    - [Method 3: Party Mode Execution](#method-3-party-mode-execution)
  - [Key Features](#key-features)
    - [🎨 Update-Safe Customization](#-update-safe-customization)
    - [🚀 Intelligent Installation](#-intelligent-installation)
    - [📁 Clean Architecture](#-clean-architecture)
    - [📄 Document Sharding (Advanced)](#-document-sharding-advanced)
  - [Documentation](#documentation)
  - [Community \& Support](#community--support)
  - [Development \& Quality Checks](#development--quality-checks)
    - [Testing \& Validation](#testing--validation)
    - [Code Quality](#code-quality)
    - [Build \& Development](#build--development)
  - [Contributing](#contributing)
  - [License](#license)

---

## What is BMad-CORE?

Foundation framework powering all BMad modules:

- **Agent Orchestration** - Specialized AI personas with domain expertise
- **Workflow Engine** - Guided multi-step processes with built-in best practices
- **Modular Architecture** - Extend with domain-specific modules (BMM, BMB, CIS, custom)
- **IDE Integration** - Works with Claude Code, Cursor, Windsurf, VS Code, and more
- **Update-Safe Customization** - Your configs persist through all updates

### v6 Core Enhancements

- **🎨 Agent Customization** - Modify names, roles, personalities via `{bmad_folder}/_cfg/agents/` **[→ Customization Guide](./docs/agent-customization-guide.md)**
- **🌐 Multi-Language** - Independent language settings for communication and output
- **👤 Personalization** - Agents adapt to your name, skill level, and preferences
- **🔄 Persistent Config** - Customizations survive module updates
- **⚙️ Flexible Settings** - Configure per-module or globally
- **📦 Web Bundles** - Share agents in Gemini Gems and Custom GPTs **[→ Web Bundles Guide](./docs/web-bundles-gemini-gpt-guide.md)**

### C.O.R.E. Philosophy

- **C**ollaboration: Human-AI partnership leveraging complementary strengths
- **O**ptimized: Battle-tested processes for maximum effectiveness
- **R**eflection: Strategic questioning that unlocks breakthrough solutions
- **E**ngine: Framework orchestrating 19+ specialized agents and 50+ workflows

BMad-CORE doesn't give you answers—it helps you **discover better solutions** through guided reflection.

## Modules

### BMad Method (BMM) - AI-Driven Agile Development

Revolutionary AI-driven agile framework for software and game development. Automatically adapts from single bug fixes to enterprise-scale systems.

#### v6 Highlights

**🎯 Scale-Adaptive Intelligence (3 Planning Tracks)**

Automatically adjusts planning depth and documentation based on project needs:

- **Quick Flow Track:** Fast implementation (tech-spec only) - bug fixes, small features, clear scope
- **BMad Method Track:** Full planning (PRD + Architecture + UX) - products, platforms, complex features
- **Enterprise Method Track:** Extended planning (BMad Method + Security/DevOps/Test) - enterprise requirements, compliance

**🏗️ Four-Phase Methodology**

1. **Phase 1: Analysis** (Optional) - Brainstorming, research, product briefs
2. **Phase 2: Planning** (Required) - Scale-adaptive PRD/tech-spec/GDD
3. **Phase 3: Solutioning** (Track-dependent) - Architecture, (Coming soon: security, DevOps, test strategy)
4. **Phase 4: Implementation** (Iterative) - Story-centric development with just-in-time context

**🤖 12 Specialized Agents**

PM • Analyst • Architect • Scrum Master • Developer • Test Architect (TEA) • UX Designer • Technical Writer • Game Designer • Game Developer • Game Architect • BMad Master (Orchestrator)

**📚 Documentation**

- **[Complete Documentation Hub](./src/modules/bmm/docs/README.md)** - Start here for all BMM guides
- **[Quick Start Guide](./src/modules/bmm/docs/quick-start.md)** - Get building in 15 minutes
- **[Agents Guide](./src/modules/bmm/docs/agents-guide.md)** - Meet all 12 agents (45 min read)
- **[34 Workflow Guides](./src/modules/bmm/docs/README.md#-workflow-guides)** - Complete phase-by-phase reference
- **[BMM Module Overview](./src/modules/bmm/README.md)** - Module structure and quick links

---

## 🚀 Quick Start

**After installation** (see [Installation](#installation) below), choose your path:

**Three Planning Tracks:**

1. **⚡ Quick Flow Track** - Bug fixes and small features
   - 🐛 Bug fixes in minutes
   - ✨ Small features (2-3 related changes)
   - 🚀 Rapid prototyping
   - **[→ Quick Spec Flow Guide](./src/modules/bmm/docs/quick-spec-flow.md)**

2. **📋 BMad Method Track** - Products and platforms
   - Complete planning (PRD/GDD)
   - Architecture decisions
   - Story-centric implementation
   - **[→ Complete Quick Start Guide](./src/modules/bmm/docs/quick-start.md)**

3. **🏢 Brownfield Projects** - Add to existing codebases
   - Document existing code first
   - Then choose Quick Flow or BMad Method
   - **[→ Brownfield Guide](./src/modules/bmm/docs/brownfield-guide.md)**

**Not sure which path?** Run `*workflow-init` and let BMM analyze your project goal and recommend the right track.

**[📚 Learn More: Scale Adaptive System](./src/modules/bmm/docs/scale-adaptive-system.md)** - How BMM adapts across three planning tracks

---

### BMad Builder (BMB) - Create Custom Solutions

Build your own agents, workflows, and modules using the BMad-CORE framework.

**What You Can Build:**

- **Custom Agents** - Domain experts with specialized knowledge
- **Guided Workflows** - Multi-step processes for any task
- **Complete Modules** - Full solutions for specific domains
- **Three Agent Types** - Full module, hybrid, or standalone

**Perfect For:** Creating domain-specific solutions (legal, medical, finance, education, creative, etc.) or extending BMM with custom development workflows.

**Documentation:**

- **[BMB Module Overview](./src/modules/bmb/README.md)** - Complete reference
- **[Create Agent Workflow](./src/modules/bmb/workflows/create-agent/README.md)** - Build custom agents
- **[Create Workflow](./src/modules/bmb/workflows/create-workflow/README.md)** - Design guided processes
- **[Create Module](./src/modules/bmb/workflows/create-module/README.md)** - Package complete solutions

### Creative Intelligence Suite (CIS) - Innovation & Creativity

AI-powered creative facilitation using proven methodologies and techniques.

**5 Interactive Workflows:**

- **Brainstorming** - Generate and refine ideas with 30+ techniques
- **Design Thinking** - Human-centered problem solving
- **Problem Solving** - Systematic breakthrough techniques
- **Innovation Strategy** - Disruptive business model thinking
- **Storytelling** - Compelling narrative frameworks

**5 Specialized Agents:** Each with unique facilitation styles and domain expertise

**Shared Resource:** CIS workflows are used by other modules (BMM's `brainstorm-project` uses CIS brainstorming)

**Documentation:**

- **[CIS Module Overview](./src/modules/cis/README.md)** - Complete reference
- **[CIS Workflows Guide](./src/modules/cis/workflows/README.md)** - All 5 creative workflows

---

## Installation

**Prerequisites:** Node.js v20+ ([Download](https://nodejs.org))

```bash
# v6 Alpha (recommended for new projects)
npx bmad-method@alpha install

# Stable v4 (production)
npx bmad-method install
```

The installer provides:

1. **Module Selection** - Choose BMM, BMB, CIS (or all)
2. **Configuration** - Your name, language preferences, game dev options
3. **IDE Integration** - Automatic setup for your IDE

**Installation creates:**

```
your-project/
└── {bmad_folder}/
    ├── core/         # Core framework + BMad Master agent
    ├── bmm/          # BMad Method (12 agents, 34 workflows)
    ├── bmb/          # BMad Builder (1 agent, 7 workflows)
    ├── cis/          # Creative Intelligence (5 agents, 5 workflows)
    └── _cfg/         # Your customizations (survives updates)
        └── agents/   # Agent customization files
```

**Next Steps:**

1. Load any agent in your IDE
2. Run `*workflow-init` to set up your project workflow path
3. Follow the [Quick Start](#-quick-start) guide above to choose your planning track

**Alternative:** [**Web Bundles**](./docs/USING_WEB_BUNDLES.md) - Use BMAD agents in Claude Projects, ChatGPT, or Gemini without installation

---

## 🎯 Working with Agents & Commands

**Multiple Ways to Execute Workflows:**

BMad is flexible - you can execute workflows in several ways depending on your preference and IDE:

### Method 1: Agent Menu (Recommended for Beginners)

1. **Load an agent** in your IDE (see [IDE-specific instructions](./docs/ide-info/))
2. **Wait for the menu** to appear showing available workflows
3. **Tell the agent** what to run using natural language or shortcuts:
   - Natural: "Run workflow-init"
   - Shortcut: `*workflow-init`
   - Menu number: "Run option 2"

### Method 2: Direct Slash Commands

**Execute workflows directly** using slash commands:

```
/bmad:bmm:workflows:workflow-init
/bmad:bmm:workflows:prd
/bmad:bmm:workflows:dev-story
```

**Tip:** While you can run these without loading an agent first, **loading an agent is still recommended** - it can make a difference with certain workflows.

**Benefits:**

- ✅ Mix and match any agent with any workflow
- ✅ Run workflows not in the loaded agent's menu
- ✅ Faster access for experienced users who know the command names

### Method 3: Party Mode Execution

**Run workflows with multi-agent collaboration:**

1. Start party mode: `/bmad:core:workflows:party-mode`
2. Execute any workflow - **the entire team collaborates on it**
3. Get diverse perspectives from multiple specialized agents

**Perfect for:** Strategic decisions, complex workflows, cross-functional tasks

---

> **📌 IDE-Specific Note:**
>
> Slash command format varies by IDE:
>
> - **Claude Code:** `/bmad:bmm:workflows:prd`
> - **Cursor/Windsurf:** May use different syntax - check your IDE's [documentation](./docs/ide-info/)
> - **VS Code with Copilot Chat:** Syntax may differ
>
> See **[IDE Integration Guides](./docs/ide-info/)** for your specific IDE's command format.

---

## Key Features

### 🎨 Update-Safe Customization

Modify agents without touching core files:

- Override agent names, personalities, expertise via `{bmad_folder}/_cfg/agents/`
- Customizations persist through all updates
- Multi-language support (communication + output)
- Module-level or global configuration

### 🚀 Intelligent Installation

Smart setup that adapts to your environment:

- Auto-detects v4 installations for smooth upgrades
- Configures IDE integrations (Claude Code, Cursor, Windsurf, VS Code)
- Resolves cross-module dependencies
- Generates unified agent/workflow manifests

### 📁 Clean Architecture

Everything in one place:

- Single `{bmad_folder}/` folder (no scattered files, default folder name is .bmad)
- Modules live side-by-side (core, bmm, bmb, cis)
- Your configs in `_cfg/` (survives updates)
- Easy to version control or exclude

### 📄 Document Sharding (Advanced)

Optional optimization for large projects (BMad Method and Enterprise tracks):

- **Massive Token Savings** - Phase 4 workflows load only needed sections (90%+ reduction)
- **Automatic Support** - All workflows handle whole or sharded documents seamlessly
- **Easy Setup** - Built-in tool splits documents by headings
- **Smart Discovery** - Workflows auto-detect format

**[→ Document Sharding Guide](./docs/document-sharding-guide.md)**

---

## Documentation

**Module Documentation:**

- **[BMM Complete Documentation Hub](./src/modules/bmm/docs/README.md)** - All BMM guides, FAQs, troubleshooting
- **[BMB Module Reference](./src/modules/bmb/README.md)** - Build custom agents and workflows
- **[CIS Workflows Guide](./src/modules/cis/workflows/README.md)** - Creative facilitation workflows

**Customization & Sharing:**

- **[Agent Customization Guide](./docs/agent-customization-guide.md)** - Customize agent names, personas, and behaviors
- **[Web Bundles for Gemini & GPT](./docs/web-bundles-gemini-gpt-guide.md)** - Use BMad agents in Gemini Gems and Custom GPTs

**Additional Resources:**

- **[Documentation Index](./docs/index.md)** - All project documentation
- **[v4 to v6 Upgrade Guide](./docs/v4-to-v6-upgrade.md)** - Migration instructions
- **[CLI Tool Guide](./tools/cli/README.md)** - Installer and build tool reference
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

---

## Community & Support

- 💬 **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Get help, share projects (#general-dev, #bugs-issues)
- 🐛 **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Report bugs, request features
- 🎥 **[YouTube Channel](https://www.youtube.com/@BMadCode)** - Video tutorials and walkthroughs
- ⭐ **[Star this repo](https://github.com/bmad-code-org/BMAD-METHOD)** - Stay updated on releases

---

## Development & Quality Checks

**For contributors working on the BMAD codebase:**

**Requirements:** Node.js 22+ (see `.nvmrc`). Run `nvm use` to switch to the correct version.

### Testing & Validation

```bash
# Run all quality checks (comprehensive - use before pushing)
npm test

# Individual test suites
npm run test:schemas     # Agent schema validation (fixture-based)
npm run test:install     # Installation component tests (compilation)
npm run validate:schemas # YAML schema validation
npm run validate:bundles # Web bundle integrity
```

### Code Quality

```bash
# Lint check
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format check
npm run format:check

# Auto-format all files
npm run format:fix
```

### Build & Development

```bash
# Bundle for web deployment
npm run bundle

# Test local installation
npm run install:bmad
```

**Pre-commit Hook:** Auto-fixes changed files (lint-staged) + validates everything (npm test)
**CI:** GitHub Actions runs all quality checks in parallel on every PR

---

## Contributing

We welcome contributions! See **[CONTRIBUTING.md](CONTRIBUTING.md)** for:

- Code contribution guidelines
- Documentation improvements
- Module development
- Issue reporting

---

## License

**MIT License** - See [LICENSE](LICENSE) for details

**Trademarks:** BMAD™ and BMAD-METHOD™ are trademarks of BMad Code, LLC.

---

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

<sub>Built with ❤️ for the human-AI collaboration community</sub>
