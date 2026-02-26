# Whiteport Design Studio (WDS)

**Strategic design methodology for creating products users love, powered by AI agents.**

[![npm version](https://img.shields.io/npm/v/whiteport-design-studio.svg)](https://www.npmjs.com/package/whiteport-design-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Installation

```bash
npx whiteport-design-studio install
```

The installer will guide you through setup: project type, experience level, and IDE configuration. Everything gets installed into a `_wds/` folder in your project.

---

## What is WDS?

WDS is a structured design methodology that uses AI agents to guide you through product design, from initial strategy to developer-ready specifications.

- **Strategic foundation** - Connect every design decision to business goals and user psychology
- **Complete specifications** - Generate developer-ready page specs with all details defined
- **AI-powered workflow** - Three specialized agents guide you through each phase
- **IDE-native** - Works inside your AI coding tool (Claude Code, Cursor, Windsurf, and 14 more)

---

## Agents

WDS uses three specialized AI agents (the Norse Pantheon):

| Agent | Role | What they do |
|-------|------|-------------|
| **Saga** (Analyst) | Business & Product Analyst | Product Brief (Phase 1) and Trigger Mapping (Phase 2) |
| **Freya** (Designer) | UX/UI Designer | Scenarios (Phase 3), UX Design (Phase 4), Design System (Phase 5) |
| **Idunn** (Product Manager) | Platform & Delivery | Platform architecture (Phase 3) and design deliveries (Phase 6) |

### Activating an agent

Tell your AI IDE:

```
Read and activate the agent in _wds/agents/saga-analyst.md
```

The agent will greet you, analyze your project, and guide you through the next steps.

---

## Design Phases

| Phase | Focus | Output folder |
|-------|-------|--------------|
| 1. Product Exploration | Vision, positioning, success criteria | `docs/A-Product-Brief/` |
| 2. Trigger Mapping | User psychology, business goals | `docs/B-Trigger-Map/` |
| 3. Platform Architecture | Technical requirements (optional) | `docs/C-Platform-Requirements/` |
| 4. UX Design | Scenarios, interactions, content structure | `docs/C-Scenarios/` |
| 5. Visual Design | Brand identity, design system, components | `docs/D-Design-System/` |
| 6. Design Delivery | Developer handoff, PRD finalization | `docs/E-PRD/Design-Deliveries/` |

Agent dialogs and conversation logs are saved to `docs/F-Agent-Dialogs/`.

---

## Project Structure

After installation, your project will have:

```
your-project/
├── _wds/                    # WDS system files
│   ├── agents/              # Compiled agent files (.md)
│   ├── workflows/           # Phase workflows
│   ├── data/                # Standards, frameworks, agent guides
│   ├── gems/                # Reusable prompt components
│   ├── templates/           # Document templates
│   ├── config.yaml          # Your project configuration
│   └── module.yaml          # Module definition
├── _wds-learn/              # Learning material (optional, safe to delete)
│   ├── getting-started/
│   ├── learn/
│   ├── method/
│   ├── models/
│   └── tools/
├── docs/                    # Design output (created by agents)
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-Platform-Requirements/
│   ├── C-Scenarios/
│   ├── D-Design-System/
│   ├── E-PRD/Design-Deliveries/
│   └── F-Agent-Dialogs/
└── .claude/instructions.md  # IDE configuration (varies by IDE)
```

---

## Getting Started

1. **Install WDS** in your project directory:
   ```bash
   npx whiteport-design-studio install
   ```

2. **Open your project** in your AI IDE (Claude Code, Cursor, Windsurf, etc.)

3. **Activate an agent** - tell the AI:
   ```
   Read and activate the agent in _wds/agents/saga-analyst.md
   ```

4. **Follow the agent's guidance** - The agent will analyze your project, present actionable next steps, and walk you through the work. Start with Saga for strategy, Freya for design, or Idunn for platform architecture.

---

## Supported IDEs

WDS works with any AI-powered IDE or coding tool:

Claude Code, Cursor, Windsurf, Cline, GitHub Copilot, Roo Code, Codex, Gemini, Qwen, Trae, Kiro CLI, Rovo Dev, Crush, Auggie, Antigravity, iFlow, OpenCode

The installer configures your selected IDE(s) automatically.

---

## Tools Integration

WDS integrates with design and prototyping tools:

- **Figma MCP** - Bidirectional sync between AI-generated designs and Figma
- **html.to.design** - Import HTML prototypes into Figma
- **NanoBanana/Eira** - AI-powered image generation for brand exploration
- **Excalidraw** - Sketch analysis and wireframing

---

## Key Concepts

### UX vs Visual Design

Phase 4 (UX Design) defines **how it works** - functionality, interactions, content structure.
Phase 5 (Visual Design) defines **how it looks** - brand expression, design tokens, component library.

Visual design can start at any time - brand identity is independent of product strategy.

### Adaptive Teaching

Agents adapt to your experience level:
- **Beginner** - Detailed guidance, one step at a time
- **Intermediate** - Balanced approach, builds on existing knowledge
- **Expert** - Direct and efficient, respects your time

---

## Learning Material

The installer can optionally include learning and reference material in `_wds-learn/`. This includes:

- **Getting Started** - Quick onboarding guides
- **Course modules** - Complete 12-module training course (Module 00-13)
- **Method guides** - Deep-dive into each design phase
- **Models** - Strategic frameworks (Golden Circle, Customer Awareness, etc.)
- **Tool guides** - Integration guides for Figma, Git, and more

You can safely delete `_wds-learn/` at any time without affecting the agents or workflows.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](LICENSE) for details.

---

Built by [Whiteport Collective](https://github.com/whiteport-collective)
