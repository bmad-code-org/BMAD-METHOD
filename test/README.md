# Test Suite

Tests for the BMAD-METHOD tooling infrastructure.

## Quick Start

```bash
# Run all quality checks
npm run quality

# Run the full test suite
npm test

# Run individual test suites
npm run test:install    # Installation component tests
npm run test:refs       # File reference CSV tests
npm run validate:refs   # File reference validation (strict)
```

## Test Scripts

### Installation Component Tests

**File**: `test/test-installation-components.js`

Validates that the installer compiles and assembles agents correctly.

### File Reference Tests

**File**: `test/test-file-refs-csv.js`

Tests the CSV-based file reference validation logic.

### Installer Channel Resolution Tests

**File**: `test/test-installer-channels.js`

Unit tests for the installer's channel planning and resolution modules
(`channel-plan.js`, `channel-resolver.js`).

### Source URL Parsing Tests

**File**: `test/test-parse-source-urls.js`

Verifies `CustomModuleManager.parseSource()` handles Git URLs across
arbitrary hosts and path shapes.

### Rehype Plugin Tests

**File**: `test/test-rehype-plugins.mjs`

Tests the `rehype-markdown-links` and `rehype-base-paths` plugins used to
build the docs site.

### Shim Policy Tests

**File**: `test/test-shim-policy.js`

Tests deprecated-skill shim discovery, retention, and removal logic in the
installer.

### Site URL Tests

**File**: `test/test-site-url.mjs`

Regression tests for the docs site's `getSiteUrl()` resolver.

### Sprint-Status Template Sync

**File**: `test/test-template-sync.js`

Keeps the sprint-status template vendored by `bmad-retrospective` byte-identical
to the source owned by `bmad-sprint-planning`.

### Published Implementation Model Tests

**File**: `test/test-validate-published-implementation-model.mjs`

Tests `validatePublishedImplementationModel()`.

### Skill Validation Tests

**File**: `test/test-validate-skills.js`

Tests `validateSkill()` against fixtures, focused on description quality
(SKILL-06) and its deprecated-skill exemption.

### Workflow Path Regex Tests

**File**: `test/test-workflow-path-regex.js`

Tests that `ModuleManager`'s source and install workflow path regexes extract
the correct capture groups (module name and workflow sub-path).

### Build Auto Renderer Tests

**File**: `test/test-build-auto-renderer.js`

Black-box tests for the shared immutable snapshot renderer used by
`bmad-build-auto` and `bmad-build`.

### Adversarial Review Tests

**Directory**: `test/adversarial-review-tests/`

A separate, manually-run eval suite for the `bmad-review` skill's
`also_consider` input. See its own [README](adversarial-review-tests/README.md).

## Test Fixtures

Located in `test/fixtures/`:

```text
test/fixtures/
├── file-refs-csv/     # Fixtures for file reference CSV tests
└── validate-skills/   # Fixtures for skill validation tests
```
