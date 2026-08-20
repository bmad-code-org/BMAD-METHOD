# Test Suite

Tests for the BMAD-METHOD tooling infrastructure.

## Quick Start

```bash
# Run all quality checks
npm run quality

# Run individual test suites
npm run test:refs       # File reference validator tests
npm run validate:refs   # File reference validation (strict)
npm run test:skills     # Skill validator tests
npm run validate:skills # Skill validation (strict)
```

## Test Scripts

### File Reference Tests

**File**: `tools/tests/test_validate_file_refs.py`

Tests the file reference validator (`tools/validate_file_refs.py`) using temp-dir fixtures.

### Skill Validation Tests

**File**: `tools/tests/test_validate_skills.py`

Tests the deterministic skill validator (`tools/validate_skills.py`) against checked-in fixtures and temp-dir cases.
