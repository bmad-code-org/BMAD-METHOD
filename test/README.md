# Test Suite

Tests for the BMAD-METHOD tooling infrastructure.

## Quick Start

```bash
# Run all quality checks
npm run quality

# Run individual test suites
npm run test:install    # Installation component tests
npm run test:refs       # File reference validator tests
npm run validate:refs   # File reference validation (strict)
```

## Test Scripts

### Installation Component Tests

**File**: `test/test-installation-components.js`

Validates that the installer compiles and assembles agents correctly.

### File Reference Tests

**File**: `tools/tests/test_validate_file_refs.py`

Tests the file reference validator (`tools/validate_file_refs.py`) using temp-dir fixtures.
