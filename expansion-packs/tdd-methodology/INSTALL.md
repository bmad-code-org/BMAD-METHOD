# TDD Methodology Expansion Pack - Installation Guide

## Quick Start

1. **Copy files to your BMAD installation:**

   ```bash
   # From the expansion pack directory
   cp -r agents/* /path/to/your/bmad-core/agents/
   cp -r tasks/* /path/to/your/bmad-core/tasks/
   cp -r templates/* /path/to/your/bmad-core/templates/
   cp -r scripts/* /path/to/your/bmad-core/scripts/
   ```

2. **Update your configuration:**
   Add to `bmad-core/core-config.yaml`:

   ```yaml
   tdd:
     enabled: true
     require_for_new_stories: true
     allow_red_phase_ci_failures: true
     default_test_type: unit
     test_runner:
       auto_detect: true
     coverage:
       min_threshold: 0.75
   ```

3. **Verify installation:**

   ```bash
   # Check that TDD commands are available
   bmad qa --help | grep tdd
   bmad dev --help | grep tdd
   ```

4. **Try the demo:**
   ```bash
   cd examples/tdd-demo
   # Follow the demo instructions
   ```

## Detailed Configuration

### Core Configuration Options

```yaml
# bmad-core/core-config.yaml
tdd:
  # Enable/disable TDD functionality
  enabled: true

  # Require TDD for all new stories
  require_for_new_stories: true

  # Allow CI failures during red phase
  allow_red_phase_ci_failures: true

  # Default test type for new tests
  default_test_type: unit # unit|integration|e2e

  # Test runner configuration
  test_runner:
    auto_detect: true
    fallback_command: 'npm test'
    timeout_seconds: 300

  # Coverage configuration
  coverage:
    min_threshold: 0.75
    report_path: 'coverage/lcov.info'
    fail_under_threshold: true
```

### Test Runner Detection

The expansion pack includes auto-detection for common test runners:

- **JavaScript/TypeScript**: Jest, Vitest, Mocha
- **Python**: pytest, unittest
- **Java**: Maven Surefire, Gradle Test
- **Go**: go test
- **C#/.NET**: dotnet test

Configure custom runners in `bmad-core/config/test-runners.yaml`:

```yaml
custom_runners:
  my_runner:
    pattern: 'package.json'
    test_command: 'npm run test:custom'
    watch_command: 'npm run test:watch'
    coverage_command: 'npm run test:coverage'
    report_paths:
      - 'coverage/lcov.info'
      - 'test-results.xml'
```

## CI/CD Integration

### GitHub Actions

```yaml
name: TDD Workflow

on: [push, pull_request]

jobs:
  tdd-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: TDD Guard
        run: |
          chmod +x bmad-core/scripts/tdd-guard.sh
          ./bmad-core/scripts/tdd-guard.sh
        continue-on-error: ${{ contains(github.head_ref, 'red') }}

      - name: Run Tests
        run: |
          # Your test command (auto-detected by BMAD)
          npm test

      - name: Coverage Report
        uses: codecov/codecov-action@v3
        with:
          file: coverage/lcov.info
```

### GitLab CI

```yaml
tdd_guard:
  script:
    - chmod +x bmad-core/scripts/tdd-guard.sh
    - ./bmad-core/scripts/tdd-guard.sh
  allow_failure:
    - if: '$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME =~ /^red-/'

test:
  script:
    - npm test
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## File Structure

After installation, your BMAD structure should include:

```
bmad-core/
├── agents/
│   ├── qa.md          # Enhanced with TDD commands
│   └── dev.md         # Enhanced with TDD commands
├── tasks/
│   ├── test-design.md # Enhanced with TDD support
│   ├── write-failing-tests.md
│   ├── tdd-implement.md
│   └── tdd-refactor.md
├── templates/
│   ├── story-tdd-template.md
│   ├── tdd-quality-gates.md
│   └── tdd-ci-template.yml
├── scripts/
│   └── tdd-guard.sh
└── config/
    └── test-runners.yaml
```

## Verification

### 1. Configuration Check

```bash
# Verify TDD is enabled
bmad config --show | grep tdd.enabled
```

### 2. Agent Commands Check

```bash
# Verify TDD commands are available
bmad qa *tdd-start --help
bmad qa *write-failing-tests --help
bmad dev *tdd-implement --help
```

### 3. Demo Run

```bash
# Run the complete demo
cd examples/tdd-demo
bmad story 1.1-user-validation.md --tdd
```

## Troubleshooting

### Issue: "TDD commands not found"

**Solution:** Ensure `tdd.enabled: true` in config and restart BMAD orchestrator

### Issue: "Test runner not detected"

**Solution:** Configure fallback command or add custom runner detection

### Issue: "CI failing on red phase"

**Solution:** Set `allow_red_phase_ci_failures: true` and use branch naming convention

### Issue: "Guard script permission denied"

**Solution:** `chmod +x bmad-core/scripts/tdd-guard.sh`

## Uninstall

To remove the TDD expansion pack:

1. Set `tdd.enabled: false` in config
2. Remove TDD-specific files (optional):
   ```bash
   rm bmad-core/tasks/write-failing-tests.md
   rm bmad-core/tasks/tdd-implement.md
   rm bmad-core/tasks/tdd-refactor.md
   rm bmad-core/templates/story-tdd-template.md
   rm bmad-core/templates/tdd-quality-gates.md
   rm bmad-core/scripts/tdd-guard.sh
   ```
3. Restore original agent files from backup (if needed)

## Support

For installation support:

- Check the README.md for comprehensive documentation
- Review the MIGRATION.md for existing project integration
- Follow standard BMAD-METHOD support channels
