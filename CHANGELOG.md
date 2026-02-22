# Changelog

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
