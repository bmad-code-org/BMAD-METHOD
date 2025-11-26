# Docs Domain

## File Index

### Root Documentation

- @/README.md - Main project readme, installation guide, quick start
- @/CONTRIBUTING.md - Contribution guidelines, PR process, commit conventions
- @/CHANGELOG.md - Release history, version notes
- @/LICENSE - MIT license

### Documentation Directory

- @/docs/index.md - Documentation index/overview
- @/docs/v4-to-v6-upgrade.md - Migration guide from v4 to v6
- @/docs/v6-open-items.md - Known issues and open items
- @/docs/document-sharding-guide.md - Guide for sharding large documents
- @/docs/agent-customization-guide.md - How to customize agents
- @/docs/custom-agent-installation.md - Custom agent installation guide
- @/docs/web-bundles-gemini-gpt-guide.md - Web bundle usage for AI platforms
- @/docs/BUNDLE_DISTRIBUTION_SETUP.md - Bundle distribution setup

### Installer/Bundler Documentation

- @/docs/installers-bundlers/ - Tooling-specific documentation directory
- @/tools/cli/README.md - CLI usage documentation (comprehensive)

### IDE-Specific Documentation

- @/docs/ide-info/ - IDE-specific setup guides (15+ files)

### Module Documentation

Each module may have its own docs:

- @/src/modules/{module}/README.md
- @/src/modules/{module}/sub-modules/{ide}/README.md

## Documentation Standards

### README Updates

- Keep README.md in sync with current version and features
- Update installation instructions when CLI changes
- Reflect current module list and capabilities

### CHANGELOG Format

Follow Keep a Changelog format:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added

- New features

### Changed

- Changes to existing features

### Fixed

- Bug fixes

### Removed

- Removed features
```

### Commit-to-Docs Mapping

When code changes, check these docs:

- CLI changes → tools/cli/README.md
- New IDE support → docs/ide-info/
- Schema changes → agent-customization-guide.md
- Bundle changes → web-bundles-gemini-gpt-guide.md
- Installer changes → installers-bundlers/

## Common Tasks

- Update docs after code changes: Identify affected docs and update
- Fix outdated documentation: Compare with actual code behavior
- Add new feature documentation: Create in appropriate location
- Improve clarity: Rewrite confusing sections

## Documentation Quality Checks

- [ ] Accurate file paths and code examples
- [ ] Screenshots/diagrams up to date
- [ ] Version numbers current
- [ ] Links not broken
- [ ] Examples actually work

## Warning

Some docs may be out of date - always verify against actual code behavior. When finding outdated docs, either:

1. Update them immediately
2. Note in Domain Memories for later

## Relationships

- All domain changes may need doc updates
- CHANGELOG updated before every deploy
- README reflects installer capabilities
- IDE docs must match IDE handlers

---

## Domain Memories

<!-- Vexor appends documentation-specific learnings here -->
