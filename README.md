# Whiteport Design Studio (WDS)

```bash
npx whiteport-design-studio install
```

**Strategic design methodology for creating products users love, powered by AI agents.**

[![npm version](https://img.shields.io/npm/v/whiteport-design-studio.svg)](https://www.npmjs.com/package/whiteport-design-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is WDS?

WDS is a structured design methodology that uses AI agents to guide you through product design, from initial strategy to developer-ready specifications.

- **Strategic foundation** - Connect every design decision to business goals and user psychology
- **Complete specifications** - Generate developer-ready page specs with all details defined
- **AI-powered workflow** - Three specialized agents guide you through each phase
- **IDE-native** - Works inside your AI coding tool (Claude Code, Cursor, Windsurf, and 16 more)

---

## Agents

WDS uses three specialized AI agents (the Norse Pantheon):

| Agent | Role | What they do |
|-------|------|-------------|
| **Saga** (Analyst) | Business & Product Analyst | Product Brief (Phase 1), Trigger Mapping (Phase 2). Start here. |
| **Freya** (Designer) | UX/UI Designer | UX Scenarios (Phase 3), UX Design (Phase 4), Agentic Development (Phase 5), Asset Generation (Phase 6), Design System (Phase 7) |
| **Idunn** (Product Manager) | Technical Coordinator | Platform Requirements (Phase 1), Design Handover (Phase 4), Product Evolution (Phase 8) |

### Activating an agent

Tell your AI IDE:

```
Read and activate _wds/agents/saga-analyst.md
```

Saga will greet you by name and guide you through creating your Product Brief.

---

## Design Phases

| Phase | Focus | Agent | Output folder |
|-------|-------|-------|--------------|
| 0. Alignment & Signoff | Stakeholder alignment before starting | Saga | — |
| 1. Product Brief | Vision, positioning, success criteria | Saga | `A-Product-Brief/` |
| 2. Trigger Mapping | User psychology, business goals | Saga | `B-Trigger-Map/` |
| 3. UX Scenarios | Scenario outlines via 8-question dialog | Freya | `C-UX-Scenarios/` |
| 4. UX Design | Page specifications, interactions | Freya | `D-UX-Design/` |
| 5. Agentic Development | AI-assisted development & testing | Freya | `G-Product-Development/` |
| 6. Asset Generation | Visual and text assets from specs | Freya | — |
| 7. Design System | Component library, design tokens | Freya | `D-Design-System/` |
| 8. Product Evolution | Brownfield improvements | Idunn | — |

Output folders are created inside your configured design artifacts directory (default: `design-artifacts/`).

---

## The 8-Question Scenario Dialog

Phase 3 uses a structured conversation to define each scenario. The agent walks through 8 strategic questions — one at a time — building a complete scenario outline:

1. **What transaction do we need to get really right?**
2. **Which business goal does it serve?**
3. **Which user, and in what real-life situation?**
4. **What do they want and fear going into this?**
5. **What device are they on?**
6. **What's the natural starting point?**
7. **What's the best possible outcome — for both sides?**
8. **What's the shortest path through the site?**

A *transaction* is any meaningful user journey — purchasing, booking, researching content page-by-page, comparing options, or any interaction where the user moves through the site with intent.

Two modes: **Conversation** (agent asks, you answer) or **Suggest** (agent proposes all 8, you review).

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
├── design-artifacts/        # Design output (created by agents)
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-UX-Scenarios/
│   ├── D-Design-System/
│   ├── E-PRD/
│   ├── F-Testing/
│   └── G-Product-Development/
└── .claude/instructions.md  # IDE configuration (varies by IDE)
```

---

## Getting Started

1. **Install WDS** in your project directory:
   ```bash
   npx whiteport-design-studio install
   ```

2. **Open your project** in your AI IDE (Claude Code, Cursor, Windsurf, etc.)

3. **Activate Saga** — tell the AI:
   ```
   Read and activate _wds/agents/saga-analyst.md
   ```

4. **Follow Saga's guidance** — Saga will greet you by name and walk you through creating your Product Brief. When you're ready for design work, switch to Freya.

---

## Supported IDEs

WDS works with any AI-powered IDE or coding tool:

Atlassian Rovo Dev, Auggie CLI, Claude Code, Cline, Codex, Crush, Cursor, Gemini CLI, GitHub Copilot, Google Antigravity, iFlow CLI, Kilo Code, Kiro CLI, OpenCode, Qwen Code, Roo Code, Trae, VS Code, Windsurf

The installer configures your selected IDE(s) automatically.

---

## Tools Integration

WDS integrates with design and prototyping tools:

- **Figma MCP** - Bidirectional sync between AI-generated designs and Figma
- **html.to.design** - Import HTML prototypes into Figma
- **NanoBanana/Eira** - AI-powered image generation for brand exploration
- **Excalidraw** - Sketch analysis and wireframing

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
