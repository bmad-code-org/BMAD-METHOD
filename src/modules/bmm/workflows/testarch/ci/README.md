# CI/CD Pipeline Setup Workflow

Scaffolds a production-ready CI/CD quality pipeline with test execution, burn-in loops for flaky test detection, parallel sharding, and artifact collection. This workflow creates platform-specific CI configuration optimized for fast feedback (< 45 min total) and reliable test execution with 20× speedup over sequential runs.

## Usage

```bash
bmad tea *ci
```

The TEA agent runs this workflow when:

- Test framework is configured and tests pass locally
- Team is ready to enable continuous integration
- Existing CI pipeline needs optimization or modernization
- Burn-in loop is needed for flaky test detection

## Inputs

**Required Context Files:**

- **Framework config** (playwright.config.ts, cypress.config.ts): Determines test commands and configuration
- **package.json**: Dependencies and scripts for caching strategy
- **.nvmrc**: Node version for CI (optional, defaults to Node 20 LTS)

**Optional Context Files:**

- **Existing CI config**: To update rather than create new
- **.git/config**: For CI platform auto-detection

**Workflow Variables:**

- `ci_platform`: Auto-detected (github-actions/gitlab-ci/circle-ci) or explicit
- `test_framework`: Detected from framework config (playwright/cypress)
- `parallel_jobs`: Number of parallel shards (default: 4)
- `burn_in_enabled`: Enable burn-in loop (default: true)
- `burn_in_iterations`: Burn-in iterations (default: 10)
- `selective_testing_enabled`: Run only changed tests (default: true)
- `artifact_retention_days`: Artifact storage duration (default: 30)
- `cache_enabled`: Enable dependency caching (default: true)

## Outputs

**Primary Deliverables:**

1. **CI Configuration File**
   - `.github/workflows/test.yml` (GitHub Actions)
   - `.gitlab-ci.yml` (GitLab CI)
   - Platform-specific optimizations and best practices

2. **Pipeline Stages**
   - **Lint**: Code quality checks (<2 min)
   - **Test**: Parallel execution with 4 shards (<10 min per shard)
   - **Burn-In**: Flaky test detection with 10 iterations (<30 min)
   - **Report**: Aggregate results and publish artifacts

3. **Helper Scripts**
   - `scripts/test-changed.sh`: Selective testing (run only affected tests)
   - `scripts/ci-local.sh`: Local CI mirror for debugging
   - `scripts/burn-in.sh`: Standalone burn-in execution

4. **Documentation**
   - `docs/ci.md`: Pipeline guide, debugging, secrets setup
   - `docs/ci-secrets-checklist.md`: Required secrets and configuration
   - Inline comments in CI configuration files

5. **Optimization Features**
   - Dependency caching (npm + browser binaries): 2-5 min savings
   - Parallel sharding: 75% time reduction
   - Retry logic: Handles transient failures (2 retries)
   - Failure-only artifacts: Cost-effective debugging

**Performance Targets:**

- Lint: <2 minutes
- Test (per shard): <10 minutes
- Burn-in: <30 minutes
- **Total: <45 minutes** (20× faster than sequential)

**Validation Safeguards:**

- ✅ Git repository initialized
- ✅ Local tests pass before CI setup
- ✅ Framework configuration exists
- ✅ CI platform accessible

## Key Features

### Burn-In Loop for Flaky Test Detection

**Critical production pattern:**

```yaml
burn-in:
  runs-on: ubuntu-latest
  steps:
    - run: |
        for i in {1..10}; do
          echo "🔥 Burn-in iteration $i/10"
          npm run test:e2e || exit 1
        done
```

**Purpose**: Runs tests 10 times to catch non-deterministic failures before they reach main branch.

**When to run:**

- On PRs to main/develop
- Weekly on cron schedule
- After test infrastructure changes

**Failure threshold**: Even ONE failure → tests are flaky, must fix before merging.

### Parallel Sharding

**Splits tests across 4 jobs:**

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npm run test:e2e -- --shard=${{ matrix.shard }}/4
```

**Benefits:**

- 75% time reduction (40 min → 10 min per shard)
- Faster feedback on PRs
- Configurable shard count

### Smart Caching

**Node modules + browser binaries:**

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Benefits:**

- 2-5 min savings per run
- Consistent across builds
- Automatic invalidation on dependency changes

### Selective Testing

**Run only tests affected by code changes:**

```bash
# scripts/test-changed.sh
CHANGED_FILES=$(git diff --name-only HEAD~1)
npm run test:e2e -- --grep="$AFFECTED_TESTS"
```

**Benefits:**

- 50-80% time reduction for focused PRs
- Faster feedback cycle
- Full suite still runs on main branch

### Failure-Only Artifacts

**Upload debugging materials only on test failures:**

- Traces (Playwright): 5-10 MB per test
- Screenshots: 100-500 KB each
- Videos: 2-5 MB per test
- HTML reports: 1-2 MB

**Benefits:**

- Reduces storage costs by 90%
- Maintains full debugging capability
- 30-day retention default

### Local CI Mirror

**Debug CI failures locally:**

```bash
./scripts/ci-local.sh
# Runs: lint → test → burn-in (3 iterations)
```

**Mirrors CI environment:**

- Same Node version
- Same commands
- Reduced burn-in (3 vs 10 for faster feedback)

### Knowledge Base Integration

Automatically consults TEA knowledge base:

- `ci-burn-in.md` - Burn-in loop patterns and iterations
- `selective-testing.md` - Changed test detection strategies
- `visual-debugging.md` - Artifact collection best practices
- `test-quality.md` - CI-specific quality criteria

## Integration with Other Workflows

**Before ci:**

- **framework**: Sets up test infrastructure and configuration
- **test-design** (optional): Plans test coverage strategy

**After ci:**

- **atdd**: Generate failing tests that run in CI
- **automate**: Expand test coverage that CI executes
- **trace (Phase 2)**: Use CI results for quality gate decisions

**Coordinates with:**

- **dev-story**: Tests run in CI after story implementation
- **retrospective**: CI metrics inform process improvements

**Updates:**

- `bmm-workflow-status.md`: Adds CI setup to Quality & Testing Progress section

## Important Notes

### CI Platform Auto-Detection

**GitHub Actions** (default):

- Auto-selected if `github.com` in git remote
- Free 2000 min/month for private repos
- Unlimited for public repos
- `.github/workflows/test.yml`

**GitLab CI**:

- Auto-selected if `gitlab.com` in git remote
- Free 400 min/month
- `.gitlab-ci.yml`

**Circle CI** / **Jenkins**:

- User must specify explicitly
- Templates provided for both

### Burn-In Strategy

**Iterations:**

- **3**: Quick feedback (local development)
- **10**: Standard (PR checks) ← recommended
- **100**: High-confidence (release branches)

**When to run:**

- ✅ On PRs to main/develop
- ✅ Weekly scheduled (cron)
- ✅ After test infra changes
- ❌ Not on every commit (too slow)

**Cost-benefit:**

- 30 minutes of CI time → Prevents hours of debugging flaky tests

### Artifact Collection Strategy

**Failure-only collection:**

- Saves 90% storage costs
- Maintains debugging capability
- Automatic cleanup after retention period

**What to collect:**

- Traces: Full execution context (Playwright)
- Screenshots: Visual evidence
- Videos: Interaction playback
- HTML reports: Detailed results
- Console logs: Error messages

**What NOT to collect:**

- Passing test artifacts (waste of space)
- Large binaries
- Sensitive data (use secrets instead)

### Selective Testing Trade-offs

**Benefits:**

- 50-80% time reduction for focused changes
- Faster feedback loop
- Lower CI costs

**Risks:**

- May miss integration issues
- Relies on accurate change detection
- False positives if detection is too aggressive

**Mitigation:**

- Always run full suite on merge to main
- Use burn-in loop on main branch
- Monitor for missed issues

### Parallelism Configuration

**4 shards** (default):

- Optimal for 40-80 test files
- ~10 min per shard
- Balances speed vs resource usage

**Adjust if:**

- Tests complete in <5 min → reduce shards
- Tests take >15 min → increase shards
- CI limits concurrent jobs → reduce shards

**Formula:**

```
Total test time / Target shard time = Optimal shards
Example: 40 min / 10 min = 4 shards
```

### Retry Logic

**2 retries** (default):

- Handles transient network issues
- Mitigates race conditions
- Does NOT mask flaky tests (burn-in catches those)

**When retries trigger:**

- Network timeouts
- Service unavailability
- Resource constraints

**When retries DON'T help:**

- Assertion failures (logic errors)
- Flaky tests (non-deterministic)
- Configuration errors

### Notification Setup (Optional)

**Supported channels:**

- Slack: Webhook integration
- Email: SMTP configuration
- Discord: Webhook integration

**Configuration:**

```yaml
notify_on_failure: true
notification_channels: 'slack'
# Requires SLACK_WEBHOOK secret in CI settings
```

**Best practice:** Enable for main/develop branches only, not PRs.

## Validation Checklist

After workflow completion, verify:

- [ ] CI configuration file created and syntactically valid
- [ ] Burn-in loop configured (10 iterations)
- [ ] Parallel sharding enabled (4 jobs)
- [ ] Caching configured (dependencies + browsers)
- [ ] Artifact collection on failure only
- [ ] Helper scripts created and executable
- [ ] Documentation complete (ci.md, secrets checklist)
- [ ] No errors or warnings during scaffold
- [ ] First CI run triggered and passes

Refer to `checklist.md` for comprehensive validation criteria.

## Example Execution

**Scenario 1: New GitHub Actions setup**

```bash
bmad tea *ci

# TEA detects:
# - GitHub repository (github.com in git remote)
# - Playwright framework
# - Node 20 from .nvmrc
# - 60 test files

# TEA scaffolds:
# - .github/workflows/test.yml
# - 4-shard parallel execution
# - Burn-in loop (10 iterations)
# - Dependency + browser caching
# - Failure artifacts (traces, screenshots)
# - Helper scripts
# - Documentation

# Result:
# Total CI time: 42 minutes (was 8 hours sequential)
# - Lint: 1.5 min
# - Test (4 shards): 9 min each
# - Burn-in: 28 min
```

**Scenario 2: Update existing GitLab CI**

```bash
bmad tea *ci

# TEA detects:
# - Existing .gitlab-ci.yml
# - Cypress framework
# - No caching configured

# TEA asks: "Update existing CI or create new?"
# User: "Update"

# TEA enhances:
# - Adds burn-in job
# - Configures caching (cache: paths)
# - Adds parallel: 4
# - Updates artifact collection
# - Documents secrets needed

# Result:
# CI time reduced from 45 min → 12 min
```

**Scenario 3: Standalone burn-in setup**

```bash
# User wants only burn-in, no full CI
bmad tea *ci
# Set burn_in_enabled: true, skip other stages

# TEA creates:
# - Minimal workflow with burn-in only
# - scripts/burn-in.sh for local testing
# - Documentation for running burn-in

# Use case:
# - Validate test stability before full CI setup
# - Debug intermittent failures
# - Confidence check before release
```

## Troubleshooting

**Issue: "Git repository not found"**

- **Cause**: No .git/ directory
- **Solution**: Run `git init` and `git remote add origin <url>`

**Issue: "Tests fail locally but should set up CI anyway"**

- **Cause**: Workflow halts if local tests fail
- **Solution**: Fix tests first, or temporarily skip preflight (not recommended)

**Issue: "CI takes longer than 10 min per shard"**

- **Cause**: Too many tests per shard
- **Solution**: Increase shard count (e.g., 4 → 8)

**Issue: "Burn-in passes locally but fails in CI"**

- **Cause**: Environment differences (timing, resources)
- **Solution**: Use `scripts/ci-local.sh` to mirror CI environment

**Issue: "Caching not working"**

- **Cause**: Cache key mismatch or cache limit exceeded
- **Solution**: Check cache key formula, verify platform limits

## Related Workflows

- **framework**: Set up test infrastructure → [framework/README.md](../framework/README.md)
- **atdd**: Generate acceptance tests → [atdd/README.md](../atdd/README.md)
- **automate**: Expand test coverage → [automate/README.md](../automate/README.md)
- **trace**: Traceability and quality gate decisions → [trace/README.md](../trace/README.md)

## Version History

- **v4.0 (BMad v6)**: Pure markdown instructions, enhanced workflow.yaml, burn-in loop integration
- **v3.x**: XML format instructions, basic CI setup
- **v2.x**: Legacy task-based approach
