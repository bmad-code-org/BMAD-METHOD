# Test Framework Setup Workflow

Initializes a production-ready test framework architecture (Playwright or Cypress) with fixtures, helpers, configuration, and industry best practices. This workflow scaffolds the complete testing infrastructure for modern web applications, providing a robust foundation for test automation.

## Usage

```bash
bmad tea *framework
```

The TEA agent runs this workflow when:

- Starting a new project that needs test infrastructure
- Migrating from an older testing approach
- Setting up testing from scratch
- Standardizing test architecture across teams

## Inputs

**Required Context Files:**

- **package.json**: Project dependencies and scripts to detect project type and bundler

**Optional Context Files:**

- **Architecture docs** (architecture.md, tech-spec.md): Informs framework configuration decisions
- **Existing tests**: Detects current framework to avoid conflicts

**Workflow Variables:**

- `test_framework`: Auto-detected (playwright/cypress) or manually specified
- `project_type`: Auto-detected from package.json (react/vue/angular/next/node)
- `bundler`: Auto-detected from package.json (vite/webpack/rollup/esbuild)
- `test_dir`: Root test directory (default: `{project-root}/tests`)
- `use_typescript`: Prefer TypeScript configuration (default: true)
- `framework_preference`: Auto-detection or force specific framework (default: "auto")

## Outputs

**Primary Deliverables:**

1. **Configuration File**
   - `playwright.config.ts` or `cypress.config.ts` with production-ready settings
   - Timeouts: action 15s, navigation 30s, test 60s
   - Reporters: HTML + JUnit XML
   - Failure-only artifacts (traces, screenshots, videos)

2. **Directory Structure**

   ```
   tests/
   ├── e2e/                          # Test files (organize as needed)
   ├── support/                      # Framework infrastructure (key pattern)
   │   ├── fixtures/                 # Test fixtures with auto-cleanup
   │   │   ├── index.ts             # Fixture merging
   │   │   └── factories/           # Data factories (faker-based)
   │   ├── helpers/                 # Utility functions
   │   └── page-objects/            # Page object models (optional)
   └── README.md                    # Setup and usage guide
   ```

   **Note**: Test organization (e2e/, api/, integration/, etc.) is flexible. The **support/** folder contains reusable fixtures, helpers, and factories - the core framework pattern.

3. **Environment Configuration**
   - `.env.example` with `TEST_ENV`, `BASE_URL`, `API_URL`, auth credentials
   - `.nvmrc` with Node version (LTS)

4. **Test Infrastructure**
   - Fixture architecture using `mergeTests` pattern
   - Data factories with auto-cleanup (faker-based)
   - Sample tests demonstrating best practices
   - Helper utilities for common operations

5. **Documentation**
   - `tests/README.md` with comprehensive setup instructions
   - Inline comments explaining configuration choices
   - References to TEA knowledge base

**Secondary Deliverables:**

- Updated `package.json` with minimal test script (`test:e2e`)
- Sample test demonstrating fixture usage
- Network-first testing patterns
- Selector strategy guidance (data-testid)

**Validation Safeguards:**

- ✅ No existing framework detected (prevents conflicts)
- ✅ package.json exists and is valid
- ✅ Framework auto-detection successful or explicit choice provided
- ✅ Sample test runs successfully
- ✅ All generated files are syntactically correct

## Key Features

### Smart Framework Selection

- **Auto-detection logic** based on project characteristics:
  - **Playwright** recommended for: Large repos (100+ files), performance-critical apps, multi-browser support, complex debugging needs
  - **Cypress** recommended for: Small teams prioritizing DX, component testing focus, real-time test development
- Falls back to Playwright as default if uncertain

### Production-Ready Patterns

- **Fixture Architecture**: Pure function → fixture → `mergeTests` composition pattern
- **Auto-Cleanup**: Fixtures automatically clean up test data in teardown
- **Network-First**: Route interception before navigation to prevent race conditions
- **Failure-Only Artifacts**: Screenshots/videos/traces only captured on failure to reduce storage
- **Parallel Execution**: Configured for optimal CI performance

### Industry Best Practices

- **Selector Strategy**: Prescriptive guidance on `data-testid` attributes
- **Data Factories**: Faker-based factories for realistic test data
- **Contract Testing**: Recommends Pact for microservices architectures
- **Error Handling**: Comprehensive timeout and retry configuration
- **Reporting**: Multiple reporter formats (HTML, JUnit, console)

### Knowledge Base Integration

Automatically consults TEA knowledge base:

- `fixture-architecture.md` - Pure function → fixture → mergeTests pattern
- `data-factories.md` - Faker-based factories with auto-cleanup
- `network-first.md` - Network interception before navigation
- `playwright-config.md` - Playwright-specific best practices
- `test-config.md` - General configuration guidelines

## Integration with Other Workflows

**Before framework:**

- **plan-project** (Phase 2): Determines project scope and testing needs
- **workflow-status**: Verifies project readiness

**After framework:**

- **ci**: Scaffold CI/CD pipeline using framework configuration
- **test-design**: Plan test coverage strategy for the project
- **atdd**: Generate failing acceptance tests using the framework

**Coordinates with:**

- **architecture** (Phase 3): Aligns test structure with system architecture
- **tech-spec**: Uses technical specifications to inform test configuration

**Updates:**

- `bmm-workflow-status.md`: Adds framework initialization to Quality & Testing Progress section

## Important Notes

### Preflight Checks

**Critical requirements** verified before scaffolding:

- package.json exists in project root
- No modern E2E framework already configured
- Architecture/stack context available

If any check fails, workflow **HALTS** and notifies user.

### Framework-Specific Guidance

**Playwright Advantages:**

- Worker parallelism (significantly faster for large suites)
- Trace viewer (powerful debugging with screenshots, network, console logs)
- Multi-language support (TypeScript, JavaScript, Python, C#, Java)
- Built-in API testing capabilities
- Better handling of multiple browser contexts

**Cypress Advantages:**

- Superior developer experience (real-time reloading)
- Excellent for component testing
- Simpler setup for small teams
- Better suited for watch mode during development

**Avoid Cypress when:**

- API chains are heavy and complex
- Multi-tab/window scenarios are common
- Worker parallelism is critical for CI performance

### Selector Strategy

**Always recommend:**

- `data-testid` attributes for UI elements (framework-agnostic)
- `data-cy` attributes if Cypress is chosen (Cypress-specific)
- Avoid brittle CSS selectors or XPath

### Standalone Operation

This workflow operates independently:

- **No story required**: Can be run at project initialization
- **No epic context needed**: Works for greenfield and brownfield projects
- **Autonomous**: Auto-detects configuration and proceeds without user input

### Output Summary Format

After completion, provides structured summary:

```markdown
## Framework Scaffold Complete

**Framework Selected**: Playwright (or Cypress)

**Artifacts Created**:

- ✅ Configuration file: playwright.config.ts
- ✅ Directory structure: tests/e2e/, tests/support/
- ✅ Environment config: .env.example
- ✅ Node version: .nvmrc
- ✅ Fixture architecture: tests/support/fixtures/
- ✅ Data factories: tests/support/fixtures/factories/
- ✅ Sample tests: tests/e2e/example.spec.ts
- ✅ Documentation: tests/README.md

**Next Steps**:

1. Copy .env.example to .env and fill in environment variables
2. Run npm install to install test dependencies
3. Run npm run test:e2e to execute sample tests
4. Review tests/README.md for detailed setup instructions

**Knowledge Base References Applied**:

- Fixture architecture pattern (pure functions + mergeTests)
- Data factories with auto-cleanup (faker-based)
- Network-first testing safeguards
- Failure-only artifact capture
```

## Validation Checklist

After workflow completion, verify:

- [ ] Configuration file created and syntactically valid
- [ ] Directory structure exists with all folders
- [ ] Environment configuration generated (.env.example, .nvmrc)
- [ ] Sample tests run successfully (npm run test:e2e)
- [ ] Documentation complete and accurate (tests/README.md)
- [ ] No errors or warnings during scaffold
- [ ] package.json scripts updated correctly
- [ ] Fixtures and factories follow patterns from knowledge base

Refer to `checklist.md` for comprehensive validation criteria.

## Example Execution

**Scenario 1: New React + Vite project**

```bash
# User runs framework workflow
bmad tea *framework

# TEA detects:
# - React project (from package.json)
# - Vite bundler
# - No existing test framework
# - 150+ files (recommends Playwright)

# TEA scaffolds:
# - playwright.config.ts with Vite detection
# - Component testing configuration
# - React Testing Library helpers
# - Sample component + E2E tests
```

**Scenario 2: Existing Node.js API project**

```bash
# User runs framework workflow
bmad tea *framework

# TEA detects:
# - Node.js backend (no frontend framework)
# - Express framework
# - Small project (50 files)
# - API endpoints in routes/

# TEA scaffolds:
# - playwright.config.ts focused on API testing
# - tests/api/ directory structure
# - API helper utilities
# - Sample API tests with auth
```

**Scenario 3: Cypress preferred (explicit)**

```bash
# User sets framework preference
# (in workflow config: framework_preference: "cypress")

bmad tea *framework

# TEA scaffolds:
# - cypress.config.ts
# - tests/e2e/ with Cypress patterns
# - Cypress-specific commands
# - data-cy selector strategy
```

## Troubleshooting

**Issue: "Existing test framework detected"**

- **Cause**: playwright.config._ or cypress.config._ already exists
- **Solution**: Use `upgrade-framework` workflow (TBD) or manually remove existing config

**Issue: "Cannot detect project type"**

- **Cause**: package.json missing or malformed
- **Solution**: Ensure package.json exists and has valid dependencies

**Issue: "Sample test fails to run"**

- **Cause**: Missing dependencies or incorrect BASE_URL
- **Solution**: Run `npm install` and configure `.env` with correct URLs

**Issue: "TypeScript compilation errors"**

- **Cause**: Missing @types packages or tsconfig misconfiguration
- **Solution**: Ensure TypeScript and type definitions are installed

## Related Workflows

- **ci**: Scaffold CI/CD pipeline → [ci/README.md](../ci/README.md)
- **test-design**: Plan test coverage → [test-design/README.md](../test-design/README.md)
- **atdd**: Generate acceptance tests → [atdd/README.md](../atdd/README.md)
- **automate**: Expand regression suite → [automate/README.md](../automate/README.md)

## Version History

- **v4.0 (BMad v6)**: Pure markdown instructions, enhanced workflow.yaml, comprehensive README
- **v3.x**: XML format instructions
- **v2.x**: Legacy task-based approach
