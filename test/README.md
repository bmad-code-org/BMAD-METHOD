# Test Suite

Tests for the BMAD-METHOD tooling infrastructure.

## Quick Start

```bash
# Run all quality checks
npm run quality

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

## Test Fixtures

Located in `test/fixtures/`:

```text
test/fixtures/
└── file-refs-csv/    # Fixtures for file reference CSV tests
```
