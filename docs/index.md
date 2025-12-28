# BMad Documentation Index

## Core Documentation

### Project-Level Docs (Root)

- **[README.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/README.md)** - Main project overview, feature summary, and module introductions
- **[CONTRIBUTING.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CONTRIBUTING.md)** - How to contribute, pull request guidelines, code style
- **[CHANGELOG.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)** - Version history and breaking changes

### Installation & Setup

- **[Quick Installation](./installing-bmad.md)** - Add BMad official and custom modules to a project folder.
- **[v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md)** - Migration path for v4 users
- **[Document Sharding Guide](./document-sharding-guide.md)** - Split large documents
- **[Bundle Distribution Setup](./BUNDLE_DISTRIBUTION_SETUP.md)** - (temporarily non-functional) Maintainer guide for bundle auto-publishing

## Module Documentation

### Core Module Global Entities

- **[Core Module Index](./modules/core/index)** — Shared functionality available to all modules
  - [Global Core Config](./modules/core/global-core-config.md) — Inheritable configuration impacting all modules and custom content
  - [Core Workflows](./modules/core/core-workflows.md) — Domain-agnostic workflows usable by any module
    - [Party Mode](./modules/core/party-mode.md) — Multi-agent conversation orchestration
    - [Brainstorming](./modules/core/brainstorming.md) — Structured creative sessions with 60+ techniques
    - [Advanced Elicitation](./modules/core/advanced-elicitation.md) — LLM rethinking with 50+ reasoning methods
  - [Core Tasks](./modules/core/core-tasks.md) — Common tasks available across modules
    - [Index Docs](./modules/core/core-tasks.md#index-docs) — Generate directory index files
    - [Adversarial Review](./modules/core/core-tasks.md#adversarial-review-general) — Critical content review
    - [Shard Document](./modules/core/core-tasks.md#shard-document) — Split large documents into sections

### BMad Method (BMM) - Software & Game Development

The flagship module for agile AI-driven development.

- **[BMM Module Index](./modules/bmm-bmad-method/index)** - Module overview, agents, and complete documentation index
  - [Quick Start Guide](./modules/bmm-bmad-method/quick-start) - Step-by-step guide to building your first project
  - [Quick Spec Flow](./modules/bmm-bmad-method/quick-spec-flow) - Rapid Level 0-1 development
  - [Brownfield Guide](./modules/bmm-bmad-method/brownfield-guide) - Working with existing codebases
- **[BMM Workflows Guide](./modules/bmm-bmad-method/index#-workflow-guides)** - **ESSENTIAL READING**
- **[Test Architect Guide](./modules/bmm-bmad-method/test-architecture)** - Testing strategy and quality assurance

### BMad Builder (BMB) - Create Custom Solutions

Build your own agents, workflows, and modules.

- **[BMB Module Overview](./modules/bmb-bmad-builder/index)** - Module overview and capabilities
- **[Custom Content Guide](./modules/bmb-bmad-builder/custom-content)** - Design custom agents, workflows, and modules
- **[How to Install Custom Agents, Workflows and Modules](./modules/bmb-bmad-builder/custom-content-installation.md)** - Share and Install Custom Creations

### Creative Intelligence Suite (CIS) - Innovation & Creativity

- **[CIS Docs](./modules/cis-creative-intelligence-suite/index.md)**

#### Bmad Game Dev (BMGD)

- [Main Game Dev Module Docs Index](./modules/bmgd-bmad-game-dev/index.md)

AI-powered creative thinking and brainstorming.

- **[CIS Module README](./modules/cis-creative-intelligence-suite/index)** - Module overview and workflows

## Advanced Topics

### Custom Agents, Workflow and Modules
- **[Custom Content Installation](modules/bmb-bmad-builder/custom-content-installation.md)** - Install and personalize agents, workflows and modules with the default bmad-method installer!
- [Agent Customization Guide](./bmad-customization/agent-customization-guide.md) - Customize agent behavior and responses
- [Workflow Customization Guide](./bmad-customization/workflow-customization-guide.md) - Customize and Optimize workflows with step replacement and hooks (Capability Coming Soon)

## Recommended Reading Paths

### Path 1: Brand New to BMad (Software Project)

1. [README.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/README.md) - Understand the vision
2. [Quick Start Guide](./modules/bmm-bmad-method/quick-start) - Get hands-on
3. [BMM Module README](./modules/bmm-bmad-method/) - Understand agents
4. [BMM Workflows Guide](./modules/bmm-bmad-method/index#-workflow-guides) - Master the methodology

### Path 2: Game Development Project

1. [README.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/README.md) - Understand the vision
2. [Quick Start Guide](./modules/bmm-bmad-method/quick-start) - Get hands-on
3. [BMM Module README](./modules/bmm-bmad-method/) - Game agents are included
4. [BMGD Workflows Guide](./modules/bmgd/workflows-guide) - Game-specific workflows

### Path 3: Upgrading from v4

1. [v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md) - Understand what changed
2. [Quick Start Guide](./modules/bmm-bmad-method/quick-start) - Reorient yourself
3. [BMM Workflows Guide](./modules/bmm-bmad-method/index#-workflow-guides) - Learn new v6 workflows

### Path 4: Working with Existing Codebase (Brownfield)

1. [Brownfield Guide](./modules/bmm-bmad-method/brownfield-guide) - Approach for legacy code
2. [Quick Start Guide](./modules/bmm-bmad-method/quick-start) - Follow the process
3. [BMM Workflows Guide](./modules/bmm-bmad-method/index#-workflow-guides) - Master the methodology

### Path 5: Building Custom Solutions

1. [BMB Module Overview](./modules/bmb/index) - Understand capabilities
2. [Agent Creation Guide](./modules/bmb/agents/index) - Create agents
3. [BMB Workflows Guide](./modules/bmb/workflows/) - Understand workflow structure

### Path 6: Contributing to BMad

1. [CONTRIBUTING.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CONTRIBUTING.md) - Contribution guidelines
2. Relevant module README - Understand the area you're contributing to
