# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

BMad Method (Build More Architect Dreams) is an AI-driven agile development framework. It provides specialized agents, guided workflows, and structured processes defined in YAML and Markdown. The CLI installer (`bmad-method`) sets up these components in user projects for use with AI IDEs.

**This is a content/configuration framework, not a traditional application.** The codebase is primarily YAML agent definitions, Markdown workflow steps, and JS tooling for the CLI installer and validation.

## Common Commands

### Run all checks (equivalent to CI)

```bash
npm test
```

This runs, in order: schema tests, file ref tests, installation tests, schema validation, ESLint, markdownlint, and Prettier checks.

### Individual checks

```bash
npm run test:schemas        # Agent schema validation tests
npm run test:refs           # CSV/file reference tests
npm run test:install        # CLI installation component tests
npm run validate:schemas    # YAML schema validation
npm run validate:refs       # Strict file reference validation
npm run lint                # ESLint (JS + YAML)
npm run lint:fix            # ESLint with auto-fix
npm run lint:md             # Markdown linting
npm run format:check        # Prettier check
npm run format:fix          # Prettier auto-format
```

### Documentation site

```bash
npm run docs:dev            # Local dev server
npm run docs:build          # Build docs site
```

## Architecture

- **`src/core/`** - Core BMad framework (master agent, core tasks/workflows)
- **`src/bmm/`** - BMad Method Module: 10+ specialized agents (dev, pm, architect, qa, ux, scrum master, etc.), 34+ workflows, team configs
- **`src/utility/`** - Reusable agent component templates
- **`tools/`** - CLI installer (`tools/cli/`), schema validators, build scripts
- **`test/`** - Test fixtures and integration tests
- **`website/`** - Astro/Starlight documentation site
- **`docs/`** - Documentation source (Markdown)

## Key Conventions

- **YAML over YML**: Always use `.yaml` extension, never `.yml`
- **YAML quoting**: Prefer double quotes in YAML files
- **Print width**: 140 characters (Prettier config)
- **Indent**: 2 spaces
- **Line endings**: LF
- **Node version**: 22 (see `.nvmrc`), minimum 20.0.0
- **Module system**: Mixed ESM/CJS in tooling JS files

## Commit Message Prefixes

Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

## Pre-commit Hooks

Husky + lint-staged runs on commit:
- JS files: ESLint fix + Prettier
- YAML files: ESLint fix + Prettier
- JSON files: Prettier
- Markdown files: markdownlint

## Important Notes

- Agent YAML files must conform to the schema validated by `npm run validate:schemas`
- File references in CSV files are validated by `npm run validate:refs` - keep them in sync
- PR target is `main` (trunk-based development)
- PRs should be 200-400 lines (max 800 excluding generated files)
- The `website/` directory is excluded from linting
- Test fixtures in `test/fixtures/` include intentionally invalid files - don't "fix" them
