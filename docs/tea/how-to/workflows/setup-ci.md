---
title: "How to Set Up CI Pipeline with TEA"
description: Configure automated test execution with selective testing and burn-in loops using TEA
---

# How to Set Up CI Pipeline with TEA

Use TEA's `ci` workflow to scaffold production-ready CI/CD configuration for automated test execution with selective testing, parallel sharding, and flakiness detection.

## When to Use This

- Need to automate test execution in CI/CD
- Want selective testing (only run affected tests)
- Need parallel execution for faster feedback
- Want burn-in loops for flakiness detection
- Setting up new CI/CD pipeline
- Optimizing existing CI/CD workflow

## Prerequisites

- BMad Method installed
- TEA agent available
- Test framework configured (run `framework` first)
- Tests written (have something to run in CI)
- CI/CD platform access (GitHub Actions, GitLab CI, etc.)

## Steps

### 1. Load TEA Agent

Start a fresh chat and load TEA:

```
tea
```

### 2. Run the CI Workflow

```
ci
```

### 3. Select CI/CD Platform

TEA will ask which platform you're using.

**Supported Platforms:**
- **GitHub Actions** (most common)
- **GitLab CI**
- **Circle CI**
- **Jenkins**
- **Other** (TEA provides generic template)

**Example:**
```
GitHub Actions
```

### 4. Configure Test Strategy

TEA will ask about your test execution strategy.

#### Repository Structure

**Question:** "What's your repository structure?"

**Options:**
- **Single app** - One application in root
- **Monorepo** - Multiple apps/packages
- **Monorepo with affected detection** - Only test changed packages

**Example:**
```
Monorepo with multiple apps
Need selective testing for changed packages only
```

#### Parallel Execution

**Question:** "Want to shard tests for parallel execution?"

**Options:**
- **No sharding** - Run tests sequentially
- **Shard by workers** - Split across N workers
- **Shard by file** - Each file runs in parallel

**Example:**
```
Yes, shard across 4 workers for faster execution
```

**Why Shard?**
- **4 workers:** 20-minute suite → 5 minutes
- **Better resource usage:** Utilize CI runners efficiently
- **Faster feedback:** Developers wait less

#### Burn-In Loops

**Question:** "Want burn-in loops for flakiness detection?"

**Options:**
- **No burn-in** - Run tests once
- **PR burn-in** - Run tests multiple times on PRs
- **Nightly burn-in** - Dedicated flakiness detection job

**Example:**
```
Yes, run tests 5 times on PRs to catch flaky tests early
```

**Why Burn-In?**
- Catches flaky tests before they merge
- Prevents intermittent CI failures
- Builds confidence in test suite

### 5. Review Generated CI Configuration

TEA generates platform-specific workflow files.

#### GitHub Actions (`.github/workflows/test.yml`):

```yaml
name: Test Suite

on:
  pull_request:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Nightly at 2 AM

jobs:
  # Main test job with sharding
  test:
    name: Test (Shard ${{ matrix.shard }})
    runs-on: ubuntu-latest
    timeout-minutes: 15

    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/4

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.shard }}
          path: test-results/
          retention-days: 7

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
          retention-days: 7

  # Burn-in job for flakiness detection (PRs only)
  burn-in:
    name: Burn-In (Flakiness Detection)
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run burn-in loop
        run: |
          for i in {1..5}; do
            echo "=== Burn-in iteration $i/5 ==="
            npx playwright test --grep-invert "@skip" || exit 1
          done

      - name: Upload burn-in results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: burn-in-failures
          path: test-results/

  # Selective testing (changed files only)
  selective:
    name: Selective Tests
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for git diff

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run selective tests
        run: npm run test:changed
```

#### GitLab CI (`.gitlab-ci.yml`):

```yaml
variables:
  NODE_VERSION: "18"

stages:
  - test
  - burn-in

# Test job with parallel execution
test:
  stage: test
  image: node:$NODE_VERSION
  parallel: 4
  script:
    - npm ci
    - npx playwright install --with-deps
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: always
    paths:
      - test-results/
      - playwright-report/
    expire_in: 7 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# Burn-in job for flakiness detection
burn-in:
  stage: burn-in
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npx playwright install --with-deps
    - |
      for i in {1..5}; do
        echo "=== Burn-in iteration $i/5 ==="
        npx playwright test || exit 1
      done
  artifacts:
    when: on_failure
    paths:
      - test-results/
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

#### Burn-In Testing

**Option 1: Classic Burn-In (Playwright Built-In)**

```json
{
  "scripts": {
    "test": "playwright test",
    "test:burn-in": "playwright test --repeat-each=5 --retries=0"
  }
}
```

**How it works:**
- Runs every test 5 times
- Fails if any iteration fails
- Detects flakiness before merge

**Use when:** Small test suite, want to run everything multiple times

---

**Option 2: Smart Burn-In (Playwright Utils)**

If `tea_use_playwright_utils: true`:

**scripts/burn-in-changed.ts:**
```typescript
import { runBurnIn } from '@seontechnologies/playwright-utils/burn-in';

await runBurnIn({
  configPath: 'playwright.burn-in.config.ts',
  baseBranch: 'main'
});
```

**playwright.burn-in.config.ts:**
```typescript
import type { BurnInConfig } from '@seontechnologies/playwright-utils/burn-in';

const config: BurnInConfig = {
  skipBurnInPatterns: ['**/config/**', '**/*.md', '**/*types*'],
  burnInTestPercentage: 0.3,
  burnIn: { repeatEach: 5, retries: 0 }
};

export default config;
```

**package.json:**
```json
{
  "scripts": {
    "test:burn-in": "tsx scripts/burn-in-changed.ts"
  }
}
```

**How it works:**
- Git diff analysis (only affected tests)
- Smart filtering (skip configs, docs, types)
- Volume control (run 30% of affected tests)
- Each test runs 5 times

**Use when:** Large test suite, want intelligent selection

---

**Comparison:**

| Feature | Classic Burn-In | Smart Burn-In (PW-Utils) |
|---------|----------------|--------------------------|
| Changed 1 file | Runs all 500 tests × 5 = 2500 runs | Runs 3 affected tests × 5 = 15 runs |
| Config change | Runs all tests | Skips (no tests affected) |
| Type change | Runs all tests | Skips (no runtime impact) |
| Setup | Zero config | Requires config file |

**Recommendation:** Start with classic (simple), upgrade to smart (faster) when suite grows.

### 6. Configure Secrets

TEA provides a secrets checklist.

**Required Secrets** (add to CI/CD platform):

```markdown
## GitHub Actions Secrets

Repository Settings → Secrets and variables → Actions

### Required
- None (tests run without external auth)

### Optional
- `TEST_USER_EMAIL` - Test user credentials
- `TEST_USER_PASSWORD` - Test user password
- `API_BASE_URL` - API endpoint for tests
- `DATABASE_URL` - Test database (if needed)
```

**How to Add Secrets:**

**GitHub Actions:**
1. Go to repo Settings → Secrets → Actions
2. Click "New repository secret"
3. Add name and value
4. Use in workflow: `${{ secrets.TEST_USER_EMAIL }}`

**GitLab CI:**
1. Go to Project Settings → CI/CD → Variables
2. Add variable name and value
3. Use in workflow: `$TEST_USER_EMAIL`

### 7. Test the CI Pipeline

#### Push and Verify

**Commit the workflow file:**
```bash
git add .github/workflows/test.yml
git commit -m "ci: add automated test pipeline"
git push
```

**Watch the CI run:**
- GitHub Actions: Go to Actions tab
- GitLab CI: Go to CI/CD → Pipelines
- Circle CI: Go to Pipelines

**Expected Result:**
```
✓ test (shard 1/4) - 3m 24s
✓ test (shard 2/4) - 3m 18s
✓ test (shard 3/4) - 3m 31s
✓ test (shard 4/4) - 3m 15s
✓ burn-in - 15m 42s
```

#### Test on Pull Request

**Create test PR:**
```bash
git checkout -b test-ci-setup
echo "# Test" > test.md
git add test.md
git commit -m "test: verify CI setup"
git push -u origin test-ci-setup
```

**Open PR and verify:**
- Tests run automatically
- Burn-in runs (if configured for PRs)
- Selective tests run (if applicable)
- All checks pass ✓

## What You Get

### Automated Test Execution
- **On every PR** - Catch issues before merge
- **On every push to main** - Protect production
- **Nightly** - Comprehensive regression testing

### Parallel Execution
- **4x faster feedback** - Shard across multiple workers
- **Efficient resource usage** - Maximize CI runner utilization

### Selective Testing
- **Run only affected tests** - Git diff-based selection
- **Faster PR feedback** - Don't run entire suite every time

### Flakiness Detection
- **Burn-in loops** - Run tests multiple times
- **Early detection** - Catch flaky tests in PRs
- **Confidence building** - Know tests are reliable

### Artifact Collection
- **Test results** - Saved for 7 days
- **Screenshots** - On test failures
- **Videos** - Full test recordings
- **Traces** - Playwright trace files for debugging

## Tips

### Start Simple, Add Complexity

**Week 1:** Basic pipeline
```yaml
- Run tests on PR
- Single worker (no sharding)
```

**Week 2:** Add parallelization
```yaml
- Shard across 4 workers
- Faster feedback
```

**Week 3:** Add selective testing
```yaml
- Git diff-based selection
- Skip unaffected tests
```

**Week 4:** Add burn-in
```yaml
- Detect flaky tests
- Run on PR and nightly
```

### Optimize for Feedback Speed

**Goal:** PR feedback in < 5 minutes

**Strategies:**
- Shard tests across workers (4 workers = 4x faster)
- Use selective testing (run 20% of tests, not 100%)
- Cache dependencies (`actions/cache`, `cache: 'npm'`)
- Run smoke tests first, full suite after

**Example fast workflow:**
```yaml
jobs:
  smoke:
    # Run critical path tests (2 min)
    run: npm run test:smoke

  full:
    needs: smoke
    # Run full suite only if smoke passes (10 min)
    run: npm test
```

### Use Test Tags

Tag tests for selective execution:

```typescript
// Critical path tests (always run)
test('@critical should login', async ({ page }) => { });

// Smoke tests (run first)
test('@smoke should load homepage', async ({ page }) => { });

// Slow tests (run nightly only)
test('@slow should process large file', async ({ page }) => { });

// Skip in CI
test('@local-only should use local service', async ({ page }) => { });
```

**In CI:**
```bash
# PR: Run critical and smoke only
npx playwright test --grep "@critical|@smoke"

# Nightly: Run everything except local-only
npx playwright test --grep-invert "@local-only"
```

### Monitor CI Performance

Track metrics:

```markdown
## CI Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| PR feedback time | < 5 min | 3m 24s | ✅ |
| Full suite time | < 15 min | 12m 18s | ✅ |
| Flakiness rate | < 1% | 0.3% | ✅ |
| CI cost/month | < $100 | $75 | ✅ |
```

### Handle Flaky Tests

When burn-in detects flakiness:

1. **Quarantine flaky test:**
```typescript
test.skip('flaky test - investigating', async ({ page }) => {
  // TODO: Fix flakiness
});
```

2. **Investigate with trace viewer:**
```bash
npx playwright show-trace test-results/trace.zip
```

3. **Fix root cause:**
- Add network-first patterns
- Remove hard waits
- Fix race conditions

4. **Verify fix:**
```bash
npm run test:burn-in -- tests/flaky.spec.ts --repeat 20
```

### Secure Secrets

**Don't commit secrets to code:**
```yaml
# ❌ Bad
- run: API_KEY=sk-1234... npm test

# ✅ Good
- run: npm test
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

**Use environment-specific secrets:**
- `STAGING_API_URL`
- `PROD_API_URL`
- `TEST_API_URL`

### Cache Aggressively

Speed up CI with caching:

```yaml
# Cache node_modules
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

# Cache Playwright browsers
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('package-lock.json') }}
```

## Common Issues

### Tests Pass Locally, Fail in CI

**Symptoms:**
- Green locally, red in CI
- "Works on my machine"

**Common Causes:**
- Different Node version
- Different browser version
- Missing environment variables
- Timezone differences
- Race conditions (CI slower)

**Solutions:**
```yaml
# Pin Node version
- uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'

# Pin browser versions
- run: npx playwright install --with-deps chromium@1.40.0

# Set timezone
  env:
    TZ: 'America/New_York'
```

### CI Takes Too Long

**Problem:** CI takes 30+ minutes, developers wait too long.

**Solutions:**
1. **Shard tests:** 4 workers = 4x faster
2. **Selective testing:** Only run affected tests on PR
3. **Smoke tests first:** Run critical path (2 min), full suite after
4. **Cache dependencies:** `npm ci` with cache
5. **Optimize tests:** Remove slow tests, hard waits

### Burn-In Always Fails

**Problem:** Burn-in job fails every time.

**Cause:** Test suite is flaky.

**Solution:**
1. Identify flaky tests (check which iteration fails)
2. Fix flaky tests using `test-review`
3. Re-run burn-in on specific files:
```bash
npm run test:burn-in tests/flaky.spec.ts
```

### Out of CI Minutes

**Problem:** Using too many CI minutes, hitting plan limit.

**Solutions:**
1. Run full suite only on main branch
2. Use selective testing on PRs
3. Run expensive tests nightly only
4. Self-host runners (for GitHub Actions)

## Related Guides

- [How to Set Up Test Framework](/docs/tea/how-to/workflows/setup-test-framework.md) - Run first
- [How to Run Test Review](/docs/tea/how-to/workflows/run-test-review.md) - Audit CI tests
- [Integrate Playwright Utils](/docs/tea/how-to/customization/integrate-playwright-utils.md) - Burn-in utility

## Understanding the Concepts

- [Test Quality Standards](/docs/tea/explanation/test-quality-standards.md) - Why determinism matters
- [Network-First Patterns](/docs/tea/explanation/network-first-patterns.md) - Avoid CI flakiness

## Reference

- [Command: *ci](/docs/tea/reference/commands.md#ci) - Full command reference
- [TEA Configuration](/docs/tea/reference/configuration.md) - CI-related config options

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
