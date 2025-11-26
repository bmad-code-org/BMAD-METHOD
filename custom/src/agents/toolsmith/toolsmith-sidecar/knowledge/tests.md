# Tests Domain

## File Index

### Test Files

- @/test/test-agent-schema.js - Agent schema validation tests
- @/test/test-installation-components.js - Installation component tests
- @/test/test-cli-integration.sh - CLI integration tests (shell script)
- @/test/unit-test-schema.js - Unit test schema
- @/test/README.md - Test documentation
- @/test/fixtures/ - Test fixtures directory

### Validation Scripts

- @/tools/validate-agent-schema.js - Validates all agent YAML schemas
- @/tools/validate-bundles.js - Validates bundle integrity

## NPM Test Scripts

```bash
# Full test suite (recommended before commits)
npm test

# Individual test commands
npm run test:schemas         # Run schema tests
npm run test:install         # Run installation tests
npm run validate:bundles     # Validate bundle integrity
npm run validate:schemas     # Validate agent schemas
npm run lint                 # ESLint check
npm run format:check         # Prettier format check

# Coverage
npm run test:coverage        # Run tests with coverage (c8)
```

## Test Command Breakdown

`npm test` runs sequentially:

1. `npm run test:schemas` - Agent schema validation
2. `npm run test:install` - Installation component tests
3. `npm run validate:bundles` - Bundle validation
4. `npm run validate:schemas` - Schema validation
5. `npm run lint` - ESLint
6. `npm run format:check` - Prettier check

## Testing Patterns

### Schema Validation

- Uses Zod for schema definition
- Validates agent YAML structure
- Checks required fields, types, formats

### Installation Tests

- Tests core installer components
- Validates IDE handler setup
- Tests configuration collection

### Linting & Formatting

- ESLint with plugins: n, unicorn, yml
- Prettier for formatting
- Husky for pre-commit hooks
- lint-staged for staged file linting

## Dependencies

- jest: ^30.0.4 (test runner)
- c8: ^10.1.3 (coverage)
- zod: ^4.1.12 (schema validation)
- eslint: ^9.33.0
- prettier: ^3.5.3

## Common Tasks

- Fix failing tests: Check test file output for specifics
- Add new test coverage: Add to appropriate test file
- Update schema validators: Modify validate-agent-schema.js
- Debug validation errors: Run individual validation commands

## Pre-Commit Workflow

lint-staged configuration:

- `*.{js,cjs,mjs}` → lint:fix, format:fix
- `*.yaml` → eslint --fix, format:fix
- `*.{json,md}` → format:fix

## Relationships

- Tests validate what installers produce
- Run tests before deploy
- Schema changes may need doc updates
- All PRs should pass `npm test`

---

## Domain Memories

<!-- Vexor appends testing-specific learnings here -->
