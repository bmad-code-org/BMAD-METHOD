# Changelog

All notable changes to this module will be documented here. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] — 2026-05-21

### Added

- Clio the Historian persona-agent (`bmad-agent-historian`) with three menu actions: summarize range, recall topic context, identify patterns.
- `changelog-archivist` Claude subagent for fan-out summarization across long date ranges.
- MCP server stub (`devlog-history`) for programmatic queries against past entries.
- `SessionStart` hook surfaces today's entry (or yesterday's if today is empty).

### Changed

- Devlog entry template now includes "Open questions" and "Blockers" sections.
- Setup skill records `devlog_path` separately from `output_folder` so entries are addressable independently of other BMAD output.

## [0.3.0] — 2026-04-30

### Added

- Initial implementation: `bmad-devlog-write` and `bmad-devlog-summarize` skills.
- Setup skill scaffolding.
