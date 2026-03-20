# Whiteport Design Studio (WDS)

```bash
npx whiteport-design-studio install
```

**Strategic design methodology for creating products users love, powered by AI agents.**

[![npm version](https://img.shields.io/npm/v/whiteport-design-studio.svg)](https://www.npmjs.com/package/whiteport-design-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
**v0.4.0** — BMad Skills + Design Space + Build Specifications

---

## What is WDS?

WDS is a structured design methodology that uses AI agents to guide you through product design, from initial strategy to developer-ready specifications.

- **Strategic foundation** — Connect every design decision to business goals and user psychology
- **Build specifications** — From Product Brief to complete database schema, state machines, API surface, and business logic
- **Shared agent memory** — Design Space: semantic knowledge base where agents search, capture, and communicate across sessions
- **Self-contained skills** — BMad-compliant agents with progressive disclosure, portable across any IDE
- **IDE-native** — Works inside your AI coding tool (Claude Code, Cursor, Windsurf, and 16 more)

---

## What's New in v0.4.0

**BMad Skill Conversion** — Saga and Freya are now self-contained BMad skills with progressive disclosure, capability menus, and bundled references. No more routing through separate workflow files.

**Design Space** — Shared knowledge base and agent messaging system, now a core WDS skill. Database-agnostic: SQLite for local solo work, Supabase for team collaboration. Same API, same agents, different backend. The installer handles setup.

**Material Analysis Phase** — When users provide existing documents (PRD, brief, research), Saga analyzes them before asking questions. Extract, present for confirmation, identify gaps, only ask about what's missing. A 60-minute session becomes 15 minutes.

**Platform Requirements → Build Specification** — The Platform Requirements step now produces a complete build specification: database schema (every table, column, type), state machines (every entity lifecycle), business logic (pseudocode, not prose), and API surface (every endpoint). Litmus test: *Can a coding agent build the entire platform from this document alone?*

---

## Skills

WDS ships three self-contained skills:

```
src/skills/
├── saga/           # Strategic analyst — Product Brief + Trigger Map
│   ├── SKILL.md
│   ├── bmad-manifest.json
│   └── references/
├── freya/          # UX designer — Scenarios + Design Loop
│   ├── SKILL.md
│   ├── bmad-manifest.json
│   └── references/
└── design-space/   # Knowledge base + agent messaging + work orders
    ├── SKILL.md
    └── bmad-manifest.json
```

| Skill | Role | What they do |
|-------|------|-------------|
| **Saga** | Business & Product Analyst | Product Brief (Phase 1), Trigger Mapping (Phase 2). Start here. |
| **Freya** | UX/UI Designer | UX Scenarios (Phase 3), UX Design (Phase 4), Asset Generation, Design System |
| **Design Space** | Agent Memory | Semantic knowledge search, cross-agent messaging, work orders, presence |

### Activating an agent

Tell your AI IDE:

```
Read and activate _bmad/wds/agents/saga-analyst.md
```

Saga will greet you by name and guide you through creating your Product Brief.

---

## Design Phases

| Phase | Focus | Agent | Output folder |
|-------|-------|-------|--------------|
| 0. Alignment & Signoff | Stakeholder alignment before starting | Saga | — |
| 1. Product Brief | Vision, positioning, success criteria, build specification | Saga | `A-Product-Brief/` |
| 2. Trigger Mapping | User psychology, business goals | Saga | `B-Trigger-Map/` |
| 3. UX Scenarios | Scenario outlines via 8-question dialog | Freya | `C-UX-Scenarios/` |
| 4. UX Design | Page specifications, interactions | Freya | `C-UX-Scenarios/` |
| 5. Agentic Development | AI-assisted development & testing | Freya | — |
| 6. Asset Generation | Visual and text assets from specs | Freya | — |
| 7. Design System | Component library, design tokens | Freya | `D-Design-System/` |
| 8. Product Evolution | Brownfield improvements | Freya | — |

Output folders are created inside your configured design output directory (default: `design-process/`).

---

## Design Space

Shared knowledge base and agent communication layer. Agents search design knowledge, message each other, and track work across sessions.

**Database-agnostic** — same API regardless of backend:
- **SQLite** — local file, zero infrastructure, data stays on your machine
- **Supabase** — cloud database, team collaboration, multi-machine

The installer asks during setup: "Install Design Space?" → choose your backend → done.

---

## Supported Design Tools

| Tool | What it does | MCP |
|------|-------------|-----|
| **Figma** | Professional UI design, design system management | Figma MCP |
| **Pencil (Penpot)** | Open-source design tool, AI-assisted layout | Pencil MCP |
| **Stitch** | AI screen generation from text descriptions | Stitch MCP |
| **Excalidraw** | Wireframing and sketch analysis | — |
| **html.to.design** | Import HTML prototypes into Figma | Figma plugin |
| **NanoBanana** | AI image generation for brand exploration | — |

---

## Project Structure

After installation:

```
your-project/
├── _bmad/
│   ├── wds/                    # WDS system files
│   │   ├── skills/             # Saga, Freya, Design Space
│   │   ├── agents/             # Compiled agent files
│   │   ├── workflows/          # Phase workflows
│   │   ├── data/               # Standards, frameworks, agent guides
│   │   └── config.yaml         # Your project configuration
│   └── design-space/           # Agent memory (optional, name configurable)
│       └── config.yaml         # Backend config (SQLite or Supabase)
├── design-process/             # Design output (created by agents)
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-UX-Scenarios/
│   └── D-Design-System/
└── .claude/instructions.md     # IDE configuration (varies by IDE)
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
   Read and activate _bmad/wds/agents/saga-analyst.md
   ```

4. **Follow Saga's guidance** — she'll greet you by name and walk you through creating your Product Brief. If you have existing documents, upload them — she analyzes before asking questions.

---

## Supported IDEs

WDS works with any AI-powered IDE or coding tool:

Atlassian Rovo Dev, Auggie CLI, Claude Code, Cline, Codex, Crush, Cursor, Gemini CLI, GitHub Copilot, Google Antigravity, iFlow CLI, Kilo Code, Kiro CLI, OpenCode, Qwen Code, Roo Code, Trae, VS Code, Windsurf

The installer configures your selected IDE(s) automatically.

---

## Learning Material

The installer can optionally include learning and reference material in `_wds-learn/`. This includes:

- **Getting Started** — Quick onboarding guides
- **Course modules** — Complete training course
- **Method guides** — Deep-dive into each design phase
- **Models** — Strategic frameworks (Golden Circle, Customer Awareness, etc.)
- **Tool guides** — Integration guides for Figma, Git, and more

You can safely delete `_wds-learn/` at any time without affecting the agents or workflows.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built by [Whiteport Collective](https://github.com/whiteport-collective)
