---
title: "TEA Configuration Reference"
description: Complete reference for TEA configuration options and file locations
---

# TEA Configuration Reference

Complete reference for all TEA (Test Architect) configuration options.

## Configuration File Locations

### User Configuration (Installer-Generated)

**Location:** `_bmad/bmm/config.yaml`

**Purpose:** Project-specific configuration values for your repository

**Created By:** `npx bmad-method@alpha install` command

**Status:** Gitignored (not committed to repository)

**Usage:** Edit this file to change TEA behavior in your project

**Example:**
```yaml
# _bmad/bmm/config.yaml
project_name: my-awesome-app
user_skill_level: intermediate
output_folder: _bmad-output
tea_use_playwright_utils: true
tea_use_mcp_enhancements: false
```

### Canonical Schema (Source of Truth)

**Location:** `src/modules/bmm/module.yaml`

**Purpose:** Defines available configuration keys, defaults, and installer prompts

**Created By:** BMAD maintainers (part of BMAD repo)

**Status:** Versioned in BMAD repository

**Usage:** Reference only (do not edit unless contributing to BMAD)

**Note:** The installer reads `module.yaml` to prompt for config values, then writes user choices to `_bmad/bmm/config.yaml` in your project.

---

## TEA Configuration Options

### tea_use_playwright_utils

Enable Playwright Utils integration for production-ready fixtures and utilities.

**Schema Location:** `src/modules/bmm/module.yaml:52-56`

**User Config:** `_bmad/bmm/config.yaml`

**Type:** `boolean`

**Default:** `false` (set via installer prompt during installation)

**Installer Prompt:**
```
Are you using playwright-utils (@seontechnologies/playwright-utils) in your project?
You must install packages yourself, or use test architect's *framework command.
```

**Purpose:** Enables TEA to:
- Include playwright-utils in `*framework` scaffold
- Generate tests using playwright-utils fixtures
- Review tests against playwright-utils patterns
- Configure CI with burn-in and selective testing utilities

**Affects Workflows:**
- `*framework` - Includes playwright-utils imports and fixture examples
- `*atdd` - Uses fixtures like `apiRequest`, `authSession` in generated tests
- `*automate` - Leverages utilities for test patterns
- `*test-review` - Reviews against playwright-utils best practices
- `*ci` - Includes burn-in utility and selective testing

**Example (Enable):**
```yaml
tea_use_playwright_utils: true
```

**Example (Disable):**
```yaml
tea_use_playwright_utils: false
```

**Prerequisites:**
```bash
npm install -D @seontechnologies/playwright-utils
```

**Related:**
- [Integrate Playwright Utils Guide](/docs/how-to/customization/integrate-playwright-utils.md)
- [Playwright Utils on npm](https://www.npmjs.com/package/@seontechnologies/playwright-utils)

---

### tea_use_mcp_enhancements

Enable Playwright MCP servers for live browser verification during test generation.

**Schema Location:** `src/modules/bmm/module.yaml:47-50`

**User Config:** `_bmad/bmm/config.yaml`

**Type:** `boolean`

**Default:** `false`

**Installer Prompt:**
```
Test Architect Playwright MCP capabilities (healing, exploratory, verification) are optionally available.
You will have to setup your MCPs yourself; refer to https://docs.bmad-method.org/explanation/features/tea-overview for configuration examples.
Would you like to enable MCP enhancements in Test Architect?
```

**Purpose:** Enables TEA to use Model Context Protocol servers for:
- Live browser automation during test design
- Selector verification with actual DOM
- Interactive UI discovery
- Visual debugging and healing

**Affects Workflows:**
- `*test-design` - Enables exploratory mode (browser-based UI discovery)
- `*atdd` - Enables recording mode (verify selectors with live browser)
- `*automate` - Enables healing mode (fix tests with visual debugging)

**MCP Servers Required:**

**Two Playwright MCP servers** (actively maintained, continuously updated):

- `playwright` - Browser automation (`npx @playwright/mcp@latest`)
- `playwright-test` - Test runner with failure analysis (`npx playwright run-test-mcp-server`)

**Configuration example**:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    }
  }
}
```

**Configuration Location (IDE-Specific):**

**Cursor:**
```
~/.cursor/config.json or workspace .cursor/config.json
```

**VS Code with Claude:**
```
~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Example (Enable):**
```yaml
tea_use_mcp_enhancements: true
```

**Example (Disable):**
```yaml
tea_use_mcp_enhancements: false
```

**Prerequisites:**
1. MCP servers installed in IDE configuration
2. `@playwright/mcp` package available globally or locally
3. Browser binaries installed (`npx playwright install`)

**Related:**
- [Enable MCP Enhancements Guide](/docs/how-to/customization/enable-tea-mcp-enhancements.md)
- [TEA Overview - MCP Section](/docs/explanation/features/tea-overview.md#playwright-mcp-enhancements)
- [Playwright MCP on npm](https://www.npmjs.com/package/@playwright/mcp)

---

## Core BMM Configuration (Inherited by TEA)

TEA also uses core BMM configuration options from `_bmad/bmm/config.yaml`:

### output_folder

**Type:** `string`

**Default:** `_bmad-output`

**Purpose:** Where TEA writes output files (test designs, reports, traceability matrices)

**Example:**
```yaml
output_folder: _bmad-output
```

**TEA Output Files:**
- `test-design-system.md` (from *test-design system-level)
- `test-design-epic-N.md` (from *test-design epic-level)
- `test-review.md` (from *test-review)
- `traceability-matrix.md` (from *trace Phase 1)
- `gate-decision-{gate_type}-{story_id}.md` (from *trace Phase 2)
- `nfr-assessment.md` (from *nfr-assess)
- `automation-summary.md` (from *automate)
- `atdd-checklist-{story_id}.md` (from *atdd)

---

### user_skill_level

**Type:** `enum`

**Options:** `beginner` | `intermediate` | `expert`

**Default:** `intermediate`

**Purpose:** Affects how TEA explains concepts in chat responses

**Example:**
```yaml
user_skill_level: beginner
```

**Impact on TEA:**
- **Beginner:** More detailed explanations, links to concepts, verbose guidance
- **Intermediate:** Balanced explanations, assumes basic knowledge
- **Expert:** Concise, technical, minimal hand-holding

---

### project_name

**Type:** `string`

**Default:** Directory name

**Purpose:** Used in TEA-generated documentation and reports

**Example:**
```yaml
project_name: my-awesome-app
```

**Used in:**
- Report headers
- Documentation titles
- CI configuration comments

---

### communication_language

**Type:** `string`

**Default:** `english`

**Purpose:** Language for TEA chat responses

**Example:**
```yaml
communication_language: english
```

**Supported:** Any language (TEA responds in specified language)

---

### document_output_language

**Type:** `string`

**Default:** `english`

**Purpose:** Language for TEA-generated documents (test designs, reports)

**Example:**
```yaml
document_output_language: english
```

**Note:** Can differ from `communication_language` - chat in Spanish, generate docs in English.

---

## Environment Variables

TEA workflows may use environment variables for test configuration.

### Test Framework Variables

**Playwright:**
```bash
# .env
BASE_URL=https://todomvc.com/examples/react/
API_BASE_URL=https://api.example.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

**Cypress:**
```bash
# cypress.env.json or .env
CYPRESS_BASE_URL=https://example.com
CYPRESS_API_URL=https://api.example.com
```

### CI/CD Variables

Set in CI platform (GitHub Actions secrets, GitLab CI variables):

```yaml
# .github/workflows/test.yml
env:
  BASE_URL: ${{ secrets.STAGING_URL }}
  API_KEY: ${{ secrets.API_KEY }}
  TEST_USER_EMAIL: ${{ secrets.TEST_USER }}
```

---

## Configuration Patterns

### Development vs Production

**Separate configs for environments:**

```yaml
# _bmad/bmm/config.yaml
output_folder: _bmad-output

# .env.development
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000

# .env.staging
BASE_URL=https://staging.example.com
API_BASE_URL=https://api-staging.example.com

# .env.production (read-only tests only!)
BASE_URL=https://example.com
API_BASE_URL=https://api.example.com
```

### Team vs Individual

**Team config (committed):**
```yaml
# _bmad/bmm/config.yaml.example (committed to repo)
project_name: team-project
output_folder: _bmad-output
tea_use_playwright_utils: true
tea_use_mcp_enhancements: false
```

**Individual config (gitignored):**
```yaml
# _bmad/bmm/config.yaml (gitignored)
user_name: John Doe
user_skill_level: expert
tea_use_mcp_enhancements: true  # Individual preference
```

### Monorepo Configuration

**Root config:**
```yaml
# _bmad/bmm/config.yaml (root)
project_name: monorepo-parent
output_folder: _bmad-output
```

**Package-specific:**
```yaml
# packages/web-app/_bmad/bmm/config.yaml
project_name: web-app
output_folder: ../../_bmad-output/web-app
tea_use_playwright_utils: true

# packages/mobile-app/_bmad/bmm/config.yaml
project_name: mobile-app
output_folder: ../../_bmad-output/mobile-app
tea_use_playwright_utils: false
```

---

## Configuration Best Practices

### 1. Use Version Control Wisely

**Commit:**
```
_bmad/bmm/config.yaml.example    # Template for team
.nvmrc                            # Node version
package.json                      # Dependencies
```

**Gitignore:**
```
_bmad/bmm/config.yaml            # User-specific values
.env                              # Secrets
.env.local                        # Local overrides
```

### 2. Document Required Setup

**In your README:**
```markdown
## Setup

1. Install BMad:
   npx bmad-method@alpha install

2. Copy config template:
   cp _bmad/bmm/config.yaml.example _bmad/bmm/config.yaml

3. Edit config with your values:
   - Set user_name
   - Enable tea_use_playwright_utils if using playwright-utils
   - Enable tea_use_mcp_enhancements if MCPs configured
```

### 3. Validate Configuration

**Check config is valid:**
```bash
# Check TEA config is set
cat _bmad/bmm/config.yaml | grep tea_use

# Verify playwright-utils installed (if enabled)
npm list @seontechnologies/playwright-utils

# Verify MCP servers configured (if enabled)
# Check your IDE's MCP settings
```

### 4. Keep Config Minimal

**Don't over-configure:**
```yaml
# ❌ Bad - overriding everything unnecessarily
project_name: my-project
user_name: John Doe
user_skill_level: expert
output_folder: custom/path
planning_artifacts: custom/planning
implementation_artifacts: custom/implementation
project_knowledge: custom/docs
tea_use_playwright_utils: true
tea_use_mcp_enhancements: true
communication_language: english
document_output_language: english
# Overriding 11 config options when most can use defaults

# ✅ Good - only essential overrides
tea_use_playwright_utils: true
output_folder: docs/testing
# Only override what differs from defaults
```

**Use defaults when possible** - only override what you actually need to change.

---

## Troubleshooting

### Configuration Not Loaded

**Problem:** TEA doesn't use my config values.

**Causes:**
1. Config file in wrong location
2. YAML syntax error
3. Typo in config key

**Solution:**
```bash
# Check file exists
ls -la _bmad/bmm/config.yaml

# Validate YAML syntax
npm install -g js-yaml
js-yaml _bmad/bmm/config.yaml

# Check for typos (compare to module.yaml)
diff _bmad/bmm/config.yaml src/modules/bmm/module.yaml
```

### Playwright Utils Not Working

**Problem:** `tea_use_playwright_utils: true` but TEA doesn't use utilities.

**Causes:**
1. Package not installed
2. Config file not saved
3. Workflow run before config update

**Solution:**
```bash
# Verify package installed
npm list @seontechnologies/playwright-utils

# Check config value
grep tea_use_playwright_utils _bmad/bmm/config.yaml

# Re-run workflow in fresh chat
# (TEA loads config at workflow start)
```

### MCP Enhancements Not Working

**Problem:** `tea_use_mcp_enhancements: true` but no browser opens.

**Causes:**
1. MCP servers not configured in IDE
2. MCP package not installed
3. Browser binaries missing

**Solution:**
```bash
# Check MCP package available
npx @playwright/mcp@latest --version

# Install browsers
npx playwright install

# Verify IDE MCP config
# Check ~/.cursor/config.json or VS Code settings
```

### Config Changes Not Applied

**Problem:** Updated config but TEA still uses old values.

**Cause:** TEA loads config at workflow start.

**Solution:**
1. Save `_bmad/bmm/config.yaml`
2. Start fresh chat
3. Run TEA workflow
4. Config will be reloaded

**TEA doesn't reload config mid-chat** - always start fresh chat after config changes.

---

## Configuration Examples

### Minimal Setup (Defaults)

```yaml
# _bmad/bmm/config.yaml
project_name: my-project
user_skill_level: intermediate
output_folder: _bmad-output
tea_use_playwright_utils: false
tea_use_mcp_enhancements: false
```

**Best for:**
- New projects
- Learning TEA
- Simple testing needs

---

### Advanced Setup (All Features)

```yaml
# _bmad/bmm/config.yaml
project_name: enterprise-app
user_skill_level: expert
output_folder: docs/testing
planning_artifacts: docs/planning
implementation_artifacts: docs/implementation
project_knowledge: docs
tea_use_playwright_utils: true
tea_use_mcp_enhancements: true
```

**Prerequisites:**
```bash
npm install -D @seontechnologies/playwright-utils
# Configure MCP servers in IDE
```

**Best for:**
- Enterprise projects
- Teams with established testing practices
- Projects needing advanced TEA features

---

### Monorepo Setup

**Root config:**
```yaml
# _bmad/bmm/config.yaml (root)
project_name: monorepo
output_folder: _bmad-output
tea_use_playwright_utils: true
```

**Package configs:**
```yaml
# apps/web/_bmad/bmm/config.yaml
project_name: web-app
output_folder: ../../_bmad-output/web

# apps/api/_bmad/bmm/config.yaml
project_name: api-service
output_folder: ../../_bmad-output/api
tea_use_playwright_utils: false  # API tests don't need it
```

---

### Team Template

**Commit this template:**
```yaml
# _bmad/bmm/config.yaml.example
# Copy to config.yaml and fill in your values

project_name: your-project-name
user_name: Your Name
user_skill_level: intermediate  # beginner | intermediate | expert
output_folder: _bmad-output
planning_artifacts: _bmad-output/planning-artifacts
implementation_artifacts: _bmad-output/implementation-artifacts
project_knowledge: docs

# TEA Configuration
tea_use_playwright_utils: false  # Set true if using @seontechnologies/playwright-utils
tea_use_mcp_enhancements: false  # Set true if MCP servers configured in IDE

# Languages
communication_language: english
document_output_language: english
```

**Team instructions:**
```markdown
## Setup for New Team Members

1. Clone repo
2. Copy config template:
   cp _bmad/bmm/config.yaml.example _bmad/bmm/config.yaml
3. Edit with your name and preferences
4. Install dependencies:
   npm install
5. (Optional) Enable playwright-utils:
   npm install -D @seontechnologies/playwright-utils
   Set tea_use_playwright_utils: true
```

---

## FAQ

### When should I enable playwright-utils?

**Enable if:**
- You're using or planning to use `@seontechnologies/playwright-utils`
- You want production-ready fixtures and utilities
- Your team benefits from standardized patterns
- You need utilities like `apiRequest`, `authSession`, `networkRecorder`

**Skip if:**
- You're just learning TEA (keep it simple)
- You have your own fixture library
- You don't need the utilities

### When should I enable MCP enhancements?

**Enable if:**
- You want live browser verification during test generation
- You're debugging complex UI issues
- You want exploratory mode in `*test-design`
- You want recording mode in `*atdd` for accurate selectors

**Skip if:**
- You're new to TEA (adds complexity)
- You don't have MCP servers configured
- Your tests work fine without it

### Can I change config after installation?

**Yes!** Edit `_bmad/bmm/config.yaml` anytime.

**Important:** Start fresh chat after config changes (TEA loads config at workflow start).

### Can I have different configs per branch?

**Yes:**
```bash
# feature branch
git checkout feature/new-testing
# Edit config for experimentation
vim _bmad/bmm/config.yaml

# main branch
git checkout main
# Config reverts to main branch values
```

Config is gitignored, so each branch can have different values.

### How do I share config with team?

**Use config.yaml.example:**
```bash
# Commit template
cp _bmad/bmm/config.yaml _bmad/bmm/config.yaml.example
git add _bmad/bmm/config.yaml.example
git commit -m "docs: add BMad config template"
```

**Team members copy template:**
```bash
cp _bmad/bmm/config.yaml.example _bmad/bmm/config.yaml
# Edit with their values
```

---

## See Also

### How-To Guides
- [Set Up Test Framework](/docs/how-to/workflows/setup-test-framework.md)
- [Integrate Playwright Utils](/docs/how-to/customization/integrate-playwright-utils.md)
- [Enable MCP Enhancements](/docs/how-to/customization/enable-tea-mcp-enhancements.md)

### Reference
- [TEA Command Reference](/docs/reference/tea/commands.md)
- [Knowledge Base Index](/docs/reference/tea/knowledge-base.md)
- [Glossary](/docs/reference/glossary/index.md)

### Explanation
- [TEA Overview](/docs/explanation/features/tea-overview.md)
- [Testing as Engineering](/docs/explanation/philosophy/testing-as-engineering.md)

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
