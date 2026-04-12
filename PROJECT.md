# PROJECT.md

> **This file is the single source of truth for project state.**
> Update it BEFORE you push. The next person to pull this repo reads this first.

## What Is This?

**BMAD-METHOD** — Build More Architect Dreams. An AI-driven agile development framework with 12+ specialized agent personas (PM, Architect, Developer, UX, etc.), structured workflows, and scale-adaptive intelligence that adjusts from bug fixes to enterprise systems.

100% free and open source. Published on npm as `bmad-method`. Docs at docs.bmad-method.org.

## Quick Start

```bash
git clone https://github.com/zach-theochinomona/BMAD-METHOD.git
cd BMAD-METHOD

# Option A: DevContainer (recommended — Node 22 + Python 3.12)
# Open in VS Code / Cursor — auto-builds

# Option B: Manual
npm ci
pip install uv

# Quality checks (run before every push)
npm run quality

# Install BMad into a project
npx bmad-method install
```

## Current Status

| What | Status | Notes |
|------|--------|-------|
| Core framework | DONE | V6 released |
| Agent personas (12+) | DONE | PM, Architect, Developer, UX, etc. |
| CLI installer | DONE | `npx bmad-method install` |
| Skill architecture | DONE | Skills + validation |
| CI/CD | DONE | GitHub Actions (quality, docs, publish, discord) |
| Documentation site | DONE | docs.bmad-method.org |
| npm package | DONE | npmjs.com/package/bmad-method |

### Last Agent Working On This
- **Who:** hermes
- **When:** 2026-04-12
- **What:** Added PROJECT.md and devcontainer (fork setup)

### What Needs To Happen Next
1. 
2. 

## Architecture

```
.
├── src/                    # Source code
├── tools/                  # Build tools, skill validator
├── test/                   # Tests
├── docs/                   # Documentation source
├── website/                # Documentation website
├── .github/                # CI/CD workflows + issue templates
│   ├── workflows/          # publish, quality, docs, discord
│   └── ISSUE_TEMPLATE/     # Bug, feature, documentation
├── AGENTS.md               # Agent rules (conventional commits, quality checks)
├── package.json            # npm package config
└── .nvmrc                  # Node version (22)
```

### Key Decisions
- **Node 22 + Python 3.10+** — Dual runtime requirements
- **uv for Python** — Fast Python package manager
- **Conventional Commits** — Required for all commits
- **Quality gate** — `npm run quality` must pass before push (mirrors CI)
- **Skill validation** — `npm run validate:skills` checks skill integrity

## Dependencies

| Dependency | Why |
|-----------|-----|
| Node.js 22+ | Runtime |
| Python 3.10+ | Agent tooling |
| uv | Python package management |

## Known Issues & Gotchas

- Run `npm run quality` before EVERY push — mirrors `.github/workflows/quality.yaml`
- Skill validation rules in `tools/skill-validator.md`
- This is a **fork** — sync with upstream `bmad-code-org/BMAD-METHOD` periodically

## Environment

| Setting | Value |
|---------|-------|
| Node.js | 22 (see .nvmrc) |
| Python | 3.10+ |
| Package manager | npm + uv |
| Docker | Yes (devcontainer) |

---

> **RULE: Never leave this file stale. If you touched the code, update this file.**
