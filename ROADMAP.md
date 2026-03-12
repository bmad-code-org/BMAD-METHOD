# WDS Roadmap

## 0.3.4 — Installer Fixes

- [x] Remove pitch deck question from installer (runtime Saga prompt instead)
- [x] Fix skills path to `.claude/skills/{name}/SKILL.md`
- [x] Move `_wds-learn/` into `_bmad/wds/learn/`

## 0.4.0 — Agent Space

Active development on `feature/design-space-agent-messaging`.

- Agent Space (formerly Design Space) — shared semantic knowledge database with agent messaging
- Headless Excalidraw export — local Node script in `tools/` using `@excalidraw/utils` to render `.excalidraw` JSON to PNG. Agent uses it for wireframe previews during Design Loop iteration. Approval gate unchanged — user still exports manually to approve.
- Details TBD as feature branch stabilizes
