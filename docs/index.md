# BMad Documentation Index

Complete map of all BMad Method v6 documentation with recommended reading paths.

---

## 🎯 Getting Started (Start Here!)

**New users:** Start with one of these based on your situation:

| Your Situation         | Start Here                                                      | Then Read                                                     |
| ---------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| **Brand new to BMad**  | [Quick Start Guide](../src/modules/bmm/docs/quick-start.md)     | [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) |
| **Upgrading from v4**  | [v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md)                 | [Quick Start Guide](../src/modules/bmm/docs/quick-start.md)   |
| **Brownfield project** | [Brownfield Guide](../src/modules/bmm/docs/brownfield-guide.md) | [Quick Start Guide](../src/modules/bmm/docs/quick-start.md)   |

---

## 📋 Core Documentation

### Project-Level Docs (Root)

- **[README.md](../README.md)** - Main project overview, feature summary, and module introductions
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - How to contribute, pull request guidelines, code style
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and breaking changes
- **[CLAUDE.md](../CLAUDE.md)** - Claude Code specific guidelines for this project

### Installation & Setup

- **[v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md)** - Migration path for v4 users
- **[Document Sharding Guide](./document-sharding-guide.md)** - Split large documents for 90%+ token savings
- **[Web Bundles](./USING_WEB_BUNDLES.md)** - Use BMAD agents in Claude Projects, ChatGPT, or Gemini without installation
- **[Bundle Distribution Setup](./BUNDLE_DISTRIBUTION_SETUP.md)** - Maintainer guide for bundle auto-publishing

---

## 🏗️ Module Documentation

### BMad Method (BMM) - Software & Game Development

The flagship module for agile AI-driven development.

- **[BMM Module README](../src/modules/bmm/README.md)** - Module overview, agents, and complete documentation index
- **[BMM Documentation](../src/modules/bmm/docs/)** - All BMM-specific guides and references:
  - [Quick Start Guide](../src/modules/bmm/docs/quick-start.md) - Step-by-step guide to building your first project
  - [Quick Spec Flow](../src/modules/bmm/docs/quick-spec-flow.md) - Rapid Level 0-1 development
  - [Scale Adaptive System](../src/modules/bmm/docs/scale-adaptive-system.md) - Understanding the 5-level system
  - [Brownfield Guide](../src/modules/bmm/docs/brownfield-guide.md) - Working with existing codebases
- **[BMM Workflows Guide](../src/modules/bmm/workflows/README.md)** - **ESSENTIAL READING**
- **[Test Architect Guide](../src/modules/bmm/testarch/README.md)** - Testing strategy and quality assurance

### BMad Builder (BMB) - Create Custom Solutions

Build your own agents, workflows, and modules.

- **[BMB Module README](../src/modules/bmb/README.md)** - Module overview and capabilities
- **[Agent Creation Guide](../src/modules/bmb/workflows/create-agent/README.md)** - Design custom agents

### Creative Intelligence Suite (CIS) - Innovation & Creativity

AI-powered creative thinking and brainstorming.

- **[CIS Module README](../src/modules/cis/README.md)** - Module overview and workflows

---

## 🖥️ IDE-Specific Guides

Instructions for loading agents and running workflows in your development environment.

**Popular IDEs:**

- [Claude Code](./ide-info/claude-code.md)
- [Cursor](./ide-info/cursor.md)
- [VS Code](./ide-info/windsurf.md)

**Other Supported IDEs:**

- [Augment](./ide-info/auggie.md)
- [Cline](./ide-info/cline.md)
- [Codex](./ide-info/codex.md)
- [Crush](./ide-info/crush.md)
- [Gemini](./ide-info/gemini.md)
- [GitHub Copilot](./ide-info/github-copilot.md)
- [IFlow](./ide-info/iflow.md)
- [Kilo](./ide-info/kilo.md)
- [OpenCode](./ide-info/opencode.md)
- [Qwen](./ide-info/qwen.md)
- [Roo](./ide-info/roo.md)
- [Rovo Dev](./ide-info/rovo-dev.md)
- [Trae](./ide-info/trae.md)

**Key concept:** Every reference to "load an agent" or "activate an agent" in the main docs links to the [ide-info](./ide-info/) directory for IDE-specific instructions.

---

## 🔧 Advanced Topics

### Custom Agents

- **[Custom Agent Installation](./custom-agent-installation.md)** - Install and personalize agents with `bmad agent-install`
- [Agent Customization Guide](./agent-customization-guide.md) - Customize agent behavior and responses

### Installation & Bundling

- [IDE Injections Reference](./installers-bundlers/ide-injections.md) - How agents are installed to IDEs
- [Installers & Platforms Reference](./installers-bundlers/installers-modules-platforms-reference.md) - CLI tool and platform support
- [Web Bundler Usage](./installers-bundlers/web-bundler-usage.md) - Creating web-compatible bundles

---

## 🎓 Recommended Reading Paths

### Path 1: Brand New to BMad (Software Project)

1. [README.md](../README.md) - Understand the vision
2. [Quick Start Guide](../src/modules/bmm/docs/quick-start.md) - Get hands-on
3. [BMM Module README](../src/modules/bmm/README.md) - Understand agents
4. [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Master the methodology
5. [Your IDE guide](./ide-info/) - Optimize your workflow

### Path 2: Game Development Project

1. [README.md](../README.md) - Understand the vision
2. [Quick Start Guide](../src/modules/bmm/docs/quick-start.md) - Get hands-on
3. [BMM Module README](../src/modules/bmm/README.md) - Game agents are included
4. [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Game workflows
5. [Your IDE guide](./ide-info/) - Optimize your workflow

### Path 3: Upgrading from v4

1. [v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md) - Understand what changed
2. [Quick Start Guide](../src/modules/bmm/docs/quick-start.md) - Reorient yourself
3. [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Learn new v6 workflows

### Path 4: Working with Existing Codebase (Brownfield)

1. [Brownfield Guide](../src/modules/bmm/docs/brownfield-guide.md) - Approach for legacy code
2. [Quick Start Guide](../src/modules/bmm/docs/quick-start.md) - Follow the process
3. [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Master the methodology

### Path 5: Building Custom Solutions

1. [BMB Module README](../src/modules/bmb/README.md) - Understand capabilities
2. [Agent Creation Guide](../src/modules/bmb/workflows/create-agent/README.md) - Create agents
3. [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Understand workflow structure

### Path 6: Contributing to BMad

1. [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
2. Relevant module README - Understand the area you're contributing to
3. [Code Style section in CONTRIBUTING.md](../CONTRIBUTING.md#code-style) - Follow standards
