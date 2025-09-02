# TDD Methodology Migration Guide

This guide helps you migrate existing BMAD-METHOD projects to use TDD capabilities.

## Compatibility

The TDD expansion pack is designed to be **fully backward compatible**:

- `tdd.enabled=false` by default - no behavior changes for existing projects
- All TDD files are optional and guarded by configuration
- Existing workflows continue unchanged
- No breaking changes to existing agent personas or commands

## Migration Steps

### Step 1: Install the Expansion Pack

1. Copy the expansion pack files to your BMAD installation:

   ```bash
   cp -r expansion-packs/tdd-methodology/agents/* bmad-core/agents/
   cp -r expansion-packs/tdd-methodology/tasks/* bmad-core/tasks/
   cp -r expansion-packs/tdd-methodology/templates/* bmad-core/templates/
   cp -r expansion-packs/tdd-methodology/scripts/* bmad-core/scripts/
   ```

2. Update your `core-config.yaml`:
   ```yaml
   tdd:
     enabled: false # Start with TDD disabled
     require_for_new_stories: false
     allow_red_phase_ci_failures: true
     default_test_type: unit
     test_runner:
       auto_detect: true
     coverage:
       min_threshold: 0.0
   ```

### Step 2: Enable TDD for New Stories

1. Set `tdd.enabled: true` in your config
2. Use the TDD story template for new work:
   ```bash
   cp bmad-core/templates/story-tdd-template.md stories/new-feature.md
   ```

### Step 3: Convert Existing Stories (Optional)

For stories you want to convert to TDD:

#### Option A: Generate Test Plan from Acceptance Criteria

1. Run the enhanced `test-design.md` task with TDD mode enabled
2. Use the generated test plan to create failing tests
3. Add TDD frontmatter to the story file:
   ```yaml
   tdd:
     status: red
     cycle: 1
     tests: []
     coverage_target: 0.8
   ```

#### Option B: Retrofit Tests for Existing Code

1. Add TDD frontmatter with `status: green` (code already exists)
2. Write comprehensive tests to achieve desired coverage
3. Use `*tdd-refactor` to improve the code quality

### Step 4: Configure CI/CD

Add TDD validation to your CI pipeline:

```yaml
# GitHub Actions example
- name: TDD Guard
  run: |
    chmod +x bmad-core/scripts/tdd-guard.sh
    ./bmad-core/scripts/tdd-guard.sh
  continue-on-error: ${{ github.event_name == 'pull_request' && contains(github.head_ref, 'red') }}

- name: Run Tests
  run: |
    # Your test command here
    npm test # or pytest, etc.
```

## Conversion Examples

### Converting a Traditional Story

**Before:**

```markdown
# Feature: User Authentication

## Acceptance Criteria

- User can login with email/password
- Invalid credentials show error message
- Successful login redirects to dashboard
```

**After:**

```markdown
---
tdd:
  status: red
  cycle: 1
  tests:
    - id: 'auth-001'
      name: 'should authenticate valid user'
      type: 'unit'
      status: 'failing'
  coverage_target: 0.85
---

# Feature: User Authentication

## Acceptance Criteria

- User can login with email/password
- Invalid credentials show error message
- Successful login redirects to dashboard

## TDD Test Plan

### Cycle 1: Basic Authentication

1. **Test ID: auth-001** - Should authenticate valid user
2. **Test ID: auth-002** - Should reject invalid credentials
3. **Test ID: auth-003** - Should redirect on success

### Test Data Strategy

- Mock authentication service
- Use deterministic test users
- Control time/date for session tests
```

## Gradual Adoption Strategy

You can adopt TDD gradually:

1. **Phase 1**: Enable TDD for new critical features only
2. **Phase 2**: Convert existing stories when making significant changes
3. **Phase 3**: Full TDD adoption for all new work

## Configuration Options

```yaml
tdd:
  enabled: true
  require_for_new_stories: true # Enforce TDD for new work
  allow_red_phase_ci_failures: true # Allow failing tests in red phase
  default_test_type: unit
  test_runner:
    auto_detect: true
    fallback_command: 'npm test'
  coverage:
    min_threshold: 0.75
    report_path: 'coverage/lcov.info'
```

## Troubleshooting

### "TDD commands not available"

- Ensure `tdd.enabled: true` in config
- Verify agent files are updated with TDD commands
- Restart BMAD orchestrator

### "Tests not running in CI"

- Check test runner auto-detection
- Verify CI template includes test steps
- Ensure TDD guard script has execute permissions

### "Migration seems complex"

- Start with just one story
- Use the demo example as reference
- Gradually expand TDD usage

## Support

For migration support:

- Review the demo example in `examples/tdd-demo/`
- Check the expansion pack README
- Follow BMAD-METHOD standard support channels
