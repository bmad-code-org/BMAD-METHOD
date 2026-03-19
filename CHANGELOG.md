# Changelog

## 0.3.5 (2026-03-19)

### Features
- **Design Space** — Agent Space is now a core WDS skill. Semantic knowledge search, design capture, cross-agent messaging, session-scoped presence (agent-2567), work orders, and online roster. Self-contained skill with embedded HTTP credentials — works everywhere without MCP.
- **BMad skill conversion** — Saga and Freya converted to BMad-compliant self-contained SKILL.md format with progressive disclosure, activation mode detection (headless/yolo/guided), bmad-manifest.json capability menus, and references bundled into each skill directory. No more SKILL.md → workflow.md routing.

### Structure
```
src/skills/
├── saga/          # Strategic analyst — PB + Trigger Map
│   ├── SKILL.md
│   ├── bmad-manifest.json
│   └── references/
├── freya/         # UX designer — Scenarios + Design Loop
│   ├── SKILL.md
│   ├── bmad-manifest.json
│   └── references/
└── design-space/  # Agent Space — knowledge + messaging + work orders
    ├── SKILL.md
    └── bmad-manifest.json
```

## 0.3.4 (2026-03-18)

### Features
- **Material Analysis Phase** — When users provide existing documents (PRD, brief, research, guidelines), Saga now analyzes them before asking any questions. New protocol: Read → Extract into categories → Present findings one at a time for user confirmation → Identify gaps → Only ask about what's missing. Turns a 60-minute discovery session into a 15-minute confirmation + gap-fill when materials are comprehensive.
- **Confirmation Mode for all PB steps** — Steps 02–11 now check whether their topic was already confirmed during Material Analysis. If so, they run in Confirmation Mode (quick pass-through) instead of full exploratory conversation. No more re-asking questions whose answers are in the provided documents.
- **Updated working-with-existing-materials guide** — Complete rewrite of Saga's material handling guide. Old pattern (reference → ask) replaced with new pattern (analyze → present → confirm → fill gaps). Includes explicit failure conditions: acknowledging materials without analyzing them is now defined as a system failure.

### Fixes
- **"Black hole" problem** — Previously, Saga would accept uploaded documents, say thank you, and proceed as if nothing was provided. Users had to repeat information that was clearly in their documents. The Material Analysis Phase eliminates this entirely.

## 0.3.3 (2026-03-15)

### Changes
- Remove Idunn agent — Freya takes over PM responsibilities
- Bump version

## 0.3.2 (2026-03-12)

### Fixes
- Fix stale folder references in README

## 0.3.1 (2026-03-08)

### Fixes
- Fix IDE setup crash: yaml module not found in production
- Fix legacy migration bug

## 0.3.0 (2026-03-01)

### Breaking Changes
- **Two agents** - Removed Mimir orchestrator and Idunn PM. Only Saga (analyst) and Freya (designer + development) remain.
- **BMAD standard path** - Default installation path changed from `_wds/` to `_bmad/wds/`. Existing `_wds/` projects get a migration prompt.
- **Design Log replaces Agent Dialogs** - Single `00-design-log.md` with Backlog, Current, Design Loop Status, and Log sections replaces the multi-file Agent Dialog system.
- **VTC removed** - Value Trigger Chain concept removed entirely. Scenarios and content reference the Trigger Map directly.

### Features
- **9-step Design Loop** - Discuss, Spec, Wireframe, Approve, Iterate, Update Spec, Implement, Browser Review, Extract Tokens. Excalidraw default wireframing tool, PNG export as approval gate.
- **Spacing as first-class objects** - Named tokens (space-3xs to space-3xl), spacing objects with IDs in page specs, patterns section in design system.
- **8-question Scenario Dialog** - Replaces the old 7-component scenario template with a more conversational approach.
- **Adaptive dashboard in Phase 4** - Reads design log and suggests where to continue. Two-option transitions replace dead-end menus.
- **Token extraction** - Agents extract design system tokens from completed pages automatically.
- **Installer improvements** - Detects existing installations, update/migrate first, skips config on update. IDE multiselect, platform-agnostic. Optional learning material.

### Fixes
- Path references across 14+ files (D-UX-Design → C-UX-Scenarios)
- Duplicate trigger-map references
- Workflow routing and step chain cohesion (6-item audit)
- Learn section synced to v0.3.0 (24 files updated)

## 0.2.3 (2026-02-23)

### Features
- **Root folder selection** - Installer now asks where to create work products folder (design-process/, docs/, or deliverables/)

### Fixes
- **Duplicate folders** - Fixed issue where both design-process/ and docs/ folders were created during installation

## 0.2.2 (2026-02-23)

### Fixes
- **Installer crash** - Fixed "config is not defined" error during installation. The `createDocsFolders` method now correctly receives the config parameter needed for template replacements.

## 0.2.1 (2026-02-22)

### Known Issues
- **Installer crash** - Installation fails with "config is not defined" error. Fixed in 0.2.2.

## 0.2.0 (2026-02-20)

### Breaking Changes
- **Restructured workflows** - All workflow phases reorganized for BMad compliance (phases 0-8). Existing installations should do a fresh install.
- **Templates moved** - Top-level `templates/` directory removed. Templates now live inside their respective workflow folders.
- **Doc folders renamed** - `C-Platform-Requirements` → `C-UX-Scenarios`, added `E-PRD`, `F-Testing`, `G-Product-Development`, removed `F-Agent-Dialogs`.

### Features
- **Skills directory** - Added agent activation files (`skills/`) for `/freya`, `/idunn`, `/saga` commands.
- **Workflow registry** - Added `module-help.csv` with full workflow index and descriptions.
- **BMad path rewriting** - Compiler now handles `_bmad/wds/` paths from expansion module agents.

### Fixes
- **Agent menu paths** - Updated all agent workflow references to match restructured directories.
- **Stale documentation references** - Fixed old phase paths in agent guides and dialog templates.

## 0.1.1 (2026-01-29)

### Changes
- **Learning material moved** - Installer now places optional learning & reference material in `_wds-learn/` at the project root (safe to delete without touching `_wds/`).
- **Docs & messaging** - Updated README and post-install guidance to reference `_wds-learn/`.

## 0.1.0 (2026-01-29)

Initial public release on npm.

### Features
- **npm installer** - `npx whiteport-design-studio install` sets up WDS in any project
- **4 AI agents** - Mimir (Orchestrator), Saga (Analyst), Idunn (PM), Freya (Designer)
- **17 IDE configurations** - Claude Code, Cursor, Windsurf, Cline, GitHub Copilot, and more
- **Agent compiler** - Compiles `.agent.yaml` definitions into ready-to-use `.md` files
- **Project scaffolding** - Creates `docs/` folder structure (A-F) with `.gitkeep` files
- **Learning material** - Optional inclusion of training courses, method guides, and tool references
- **Update support** - Re-run the installer to update WDS files while preserving your `config.yaml`
