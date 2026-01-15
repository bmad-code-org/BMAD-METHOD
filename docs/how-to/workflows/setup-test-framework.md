---
title: "How to Set Up a Test Framework"
description: How to set up a production-ready test framework using TEA
---

Use TEA's `*framework` workflow to scaffold a production-ready test framework for your project.

## When to Use This

- No existing test framework in your project
- Current test setup isn't production-ready
- Starting a new project that needs testing infrastructure
- Phase 3 (Solutioning) after architecture is complete

:::note[Prerequisites]
- BMad Method installed
- Architecture completed (or at least tech stack decided)
- TEA agent available
:::

## Steps

### 1. Load the TEA Agent

Start a fresh chat and load the TEA (Test Architect) agent.

### 2. Run the Framework Workflow

```
*framework
```

### 3. Answer TEA's Questions

TEA will ask about:

- Your tech stack (React, Node, etc.)
- Preferred test framework (Playwright, Cypress, Jest)
- Testing scope (E2E, integration, unit)
- CI/CD platform (GitHub Actions, etc.)

### 4. Review Generated Output

TEA generates:

- **Test scaffold** — Directory structure and config files
- **Sample specs** — Example tests following best practices
- **`.env.example`** — Environment variable template
- **`.nvmrc`** — Node version specification
- **README updates** — Testing documentation

## What You Get

```
tests/
├── e2e/
│   ├── example.spec.ts
│   └── fixtures/
├── integration/
├── unit/
├── playwright.config.ts  # or cypress.config.ts
└── README.md
```

## Optional: Playwright Utils Integration

TEA can integrate with `@seontechnologies/playwright-utils` for advanced fixtures:

```bash
npm install -D @seontechnologies/playwright-utils
```

Enable during BMad installation or set `tea_use_playwright_utils: true` in config.

**Utilities available:** api-request, network-recorder, auth-session, intercept-network-call, recurse, log, file-utils, burn-in, network-error-monitor

## Optional: MCP Enhancements

TEA can use Playwright MCP servers for enhanced capabilities:

- `playwright` — Browser automation
- `playwright-test` — Test runner with failure analysis

Configure in your IDE's MCP settings.

## Tips

- **Run only once per repository** — Framework setup is a one-time operation
- **Run after architecture is complete** — Framework aligns with tech stack
- **Follow up with CI setup** — Run `*ci` to configure CI/CD pipeline

## Next Steps

After test framework setup:

1. **Test Design** — Create test plans for system or epics
2. **CI Configuration** — Set up automated test runs
3. **Story Implementation** — Tests are ready for development
