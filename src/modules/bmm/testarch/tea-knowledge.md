<!-- Powered by BMAD-CORE™ -->

# Murat Test Architecture Foundations (Slim Brief)

This brief distills Murat Ozcan's testing philosophy used by the Test Architect agent. Use it as the north star while executing the TEA workflows.

## Core Principles

- Cost vs confidence: cost = creation + execution + maintenance. Push confidence where impact is highest and skip redundant checks.
- Engineering assumes failure: predict what breaks, defend with tests, learn from every failure. A single failing test means the software is not ready.
- Quality is team work. Story estimates include testing, documentation, and deployment work required to ship safely.
- Missing test coverage is feature debt (hurts customers), not mere tech debt—treat it with the same urgency as functionality gaps.
- Shared mutable state is the source of all evil: design fixtures and helpers so each test owns its data.
- Composition over inheritance: prefer functional helpers and fixtures that compose behaviour; page objects and deep class trees hide duplication.
- Setup via API, assert via UI. Keep tests user-centric while priming state through fast interfaces.
- One test = one concern. Explicit assertions live in the test body, not buried in helpers.
- Test at the lowest level possible first: favour component/unit coverage before integration/E2E (target ~1:3–1:5 ratio of high-level to low-level tests).
- Zero tolerance for flakiness: if a test flakes, fix the cause immediately or delete the test—shipping with flakes is not acceptable evidence.

## Patterns & Heuristics

- Selector order: `data-cy` / `data-testid` -> ARIA -> text. Avoid brittle CSS, IDs, or index based locators.
- Network boundary is the mock boundary. Stub at the edge, never mid-service unless risk demands.
- **Network-first pattern**: ALWAYS intercept before navigation: `const call = interceptNetwork(); await page.goto(); await call;`
- Deterministic waits only: await specific network responses, elements disappearing, or event hooks. Ban fixed sleeps.
- **Fixture architecture (The Murat Way)**:
  ```typescript
  // 1. Pure function first (testable independently)
  export async function apiRequest({ request, method, url, data }) {
    /* implementation */
  }
  // 2. Fixture wrapper
  export const apiRequestFixture = base.extend({
    apiRequest: async ({ request }, use) => {
      await use((params) => apiRequest({ request, ...params }));
    },
  });
  // 3. Compose via mergeTests
  export const test = mergeTests(base, apiRequestFixture, authFixture, networkFixture);
  ```
- **Data factories pattern**:
  ```typescript
  export const createUser = (overrides = {}) => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    ...overrides,
  });
  ```
- Standard test skeleton keeps intent clear—`describe` the feature, `context` specific scenarios, make setup visible, and follow Arrange → Act → Assert explicitly:

  ```javascript
  describe('Checkout', () => {
    context('when inventory is available', () => {
      beforeEach(async () => {
        await seedInventory();
        await interceptOrders(); // intercept BEFORE navigation
        await test.step('navigate', () => page.goto('/checkout'));
      });

      it('completes purchase', async () => {
        await cart.fillDetails(validUser);
        await expect(page.getByTestId('order-confirmed')).toBeVisible();
      });
    });
  });
  ```

- Helper/fixture thresholds: 3+ call sites → promote to fixture with subpath export, 2-3 → shared utility module, 1-off → keep inline to avoid premature abstraction.
- Deterministic waits only: prefer `page.waitForResponse`, `cy.wait('@alias')`, or element disappearance (e.g., `cy.get('[data-cy="spinner"]').should('not.exist')`). Ban `waitForTimeout`/`cy.wait(ms)` unless quarantined in TODO and slated for removal.
- Data is created via APIs or tasks, not UI flows:
  ```javascript
  beforeEach(() => {
    cy.task('db:seed', { users: [createUser({ role: 'admin' })] });
  });
  ```
- Assertions stay in tests; when shared state varies, assert on ranges (`expect(count).toBeGreaterThanOrEqual(3)`) rather than brittle exact values.
- Visual debugging: keep component/test runner UIs available (Playwright trace viewer, Cypress runner) to accelerate feedback.

## Risk & Coverage

- Risk score = probability (1-3) × impact (1-3). Score 9 => gate FAIL, ≥6 => CONCERNS. Most stories have 0-1 high risks.
- Test level ratio: heavy unit/component coverage, but always include E2E for critical journeys and integration seams.
- Traceability looks for reality: map each acceptance criterion to concrete tests and flag missing coverage or duplicate value.
- NFR focus areas: Security, Performance, Reliability, Maintainability. Demand evidence (tests, telemetry, alerts) before approving.

## Test Configuration

- **Timeouts**: actionTimeout 15s, navigationTimeout 30s, testTimeout 60s, expectTimeout 10s
- **Reporters**: HTML (never auto-open) + JUnit XML for CI integration
- **Media**: screenshot only-on-failure, video retain-on-failure
- **Language Matching**: Tests should match source code language (JS/TS frontend -> JS/TS tests)

## Automation & CI

- Prefer Playwright for multi-language teams, worker parallelism, rich debugging; Cypress suits smaller DX-first repos or component-heavy spikes.
- **Framework Selection**: Large repo + performance = Playwright, Small repo + DX = Cypress
- **Component Testing**: Large repos = Vitest (has UI, easy RTL conversion), Small repos = Cypress CT
- CI pipelines run lint -> unit -> component -> e2e, with selective reruns for flakes and artifacts (videos, traces) on failure.
- Shard suites to keep feedback tight; treat CI as shared safety net, not a bottleneck.
- Test selection ideas (32+ strategies): filter by tags/grep (`npm run test -- --grep "@smoke"`), file patterns (`--spec "**/*checkout*"`), changed files (`npm run test:changed`), or test level (`npm run test:unit` / `npm run test:e2e`).
- Burn-in testing: run new or changed specs multiple times (e.g., 3-10x) to flush flakes before they land in main.
- Keep helper scripts handy (`scripts/test-changed.sh`, `scripts/burn-in-changed.sh`) so CI and local workflows stay in sync.

## Project Structure & Config

- **Directory structure**:
  ```
  project/
  ├── playwright.config.ts     # Environment-based config loading
  ├── playwright/
  │   ├── tests/               # All specs (group by domain: auth/, network/, feature-flags/…)
  │   ├── support/             # Frequently touched helpers (global-setup, merged-fixtures, ui helpers, factories)
  │   ├── config/              # Environment configs (base, local, staging, production)
  │   └── scripts/             # Expert utilities (burn-in, record/playback, maintenance)
  ```
- **Environment config pattern**:
  ```javascript
  const configs = {
    local: require('./config/local.config'),
    staging: require('./config/staging.config'),
    prod: require('./config/prod.config'),
  };
  export default configs[process.env.TEST_ENV || 'local'];
  ```
- Validate environment input up-front (fail fast when `TEST_ENV` is missing) and keep Playwright/Cypress configs small by delegating per-env overrides to files under `config/`.
- Keep `.env.example`, `.nvmrc`, and scripts (burn-in, test-changed) in source control so CI and local machines share tooling defaults.

## Test Hygiene & Independence

- Tests must be independent and stateless; never rely on execution order.
- Cleanup all data created during tests (afterEach or API cleanup).
- Ensure idempotency: same results every run.
- No shared mutable state; prefer factory functions per test.
- Tests must run in parallel safely; never commit `.only`.
- Prefer co-location: component tests next to components, integration in `tests/integration`, etc.
- Feature flags: centralise enum definitions (e.g., `export const FLAGS = Object.freeze({ NEW_FEATURE: 'new-feature' })`), provide helpers to set/clear targeting, write dedicated flag suites that clean up targeting after each run, and exercise both enabled/disabled paths in CI.

## CCTDD (Component Test-Driven Development)

- Start with failing component test -> implement minimal component -> refactor.
- Component tests catch ~70% of bugs before integration.
- Use `cy.mount()` or `render()` to test components in isolation; focus on user interactions.

## CI Optimization Strategies

- **Parallel execution**: Split by test file, not test case.
- **Smart selection**: Run only tests affected by changes (dependency graphs, git diff).
- **Burn-in testing**: Run new/modified tests 3x to catch flakiness early.
- **HAR recording**: Record network traffic for offline playback in CI.
- **Selective reruns**: Only rerun failed specs, not entire suite.
- **Network recording**: capture HAR files during stable runs so CI can replay network traffic when external systems are flaky.
- Stage jobs: cache dependencies once, run `test-changed` before full suite, then execute sharded E2E jobs with `fail-fast: false` so one failure doesn’t cancel other evidence.
- Ship burn-in scripts (e.g., `scripts/burn-in-changed.sh`) that loop 5–10x over changed specs and stop on first failure; wire them into CI for flaky detection before merge.

## Package Scripts

- **Essential npm scripts**:
  ```json
  "test:e2e": "playwright test",
  "test:unit": "vitest run",
  "test:component": "cypress run --component",
  "test:contract": "jest --testMatch='**/pact/*.spec.ts'",
  "test:debug": "playwright test --headed",
  "test:ci": "npm run test:unit && npm run test:e2e",
  "contract:publish": "pact-broker publish"
  ```

## Online Resources & Examples

- Full-text mirrors of Murat's public repos live in the `test-resources-for-ai/sample-repos` knowledge pack so TEA can stay offline. Key origins include Playwright patterns (`pw-book`), Cypress vs Playwright comparisons, Tour of Heroes, and Pact consumer/provider examples.

- - Fixture architecture: https://github.com/muratkeremozcan/cy-vs-pw-murats-version
- Playwright patterns: https://github.com/muratkeremozcan/pw-book
- Component testing (CCTDD): https://github.com/muratkeremozcan/cctdd
- Contract testing: https://github.com/muratkeremozcan/pact-js-example-consumer
- Full app example: https://github.com/muratkeremozcan/tour-of-heroes-react-vite-cypress-ts
- Blog essays at https://dev.to/muratkeremozcan provide narrative rationale—distil any new actionable guidance back into this brief when processes evolve.

## Risk Model Details

- TECH: Unmitigated architecture flaws, experimental patterns without fallbacks.
- SEC: Missing security controls, potential vulnerabilities, unsafe data handling.
- PERF: SLA-breaking slowdowns, resource exhaustion, lack of caching.
- DATA: Loss or corruption scenarios, migrations without rollback, inconsistent schemas.
- BUS: Business or user harm, revenue-impacting failures, compliance gaps.
- OPS: Deployment, infrastructure, or observability gaps that block releases.

## Probability & Impact Scale

- Probability 1 = Unlikely (standard implementation, low risk).
- Probability 2 = Possible (edge cases, needs attention).
- Probability 3 = Likely (known issues, high uncertainty).
- Impact 1 = Minor (cosmetic, easy workaround).
- Impact 2 = Degraded (partial feature loss, manual workaround needed).
- Impact 3 = Critical (blocker, data/security/regulatory impact).
- Scores: 9 => FAIL, 6-8 => CONCERNS, 4 => monitor, 1-3 => note only.

## Test Design Frameworks

- Use [`test-levels-framework.md`](./test-levels-framework.md) for level selection and anti-patterns.
- Use [`test-priorities-matrix.md`](./test-priorities-matrix.md) for P0–P3 priority criteria.
- Naming convention: `{epic}.{story}-{LEVEL}-{sequence}` (e.g., `2.4-E2E-01`).
- Tie each scenario to risk mitigations or acceptance criteria.

## Test Quality Definition of Done

- No hard waits (`page.waitForTimeout`, `cy.wait(ms)`)—use deterministic waits.
- Each test < 300 lines and executes in <= 1.5 minutes.
- Tests are stateless, parallel-safe, and self-cleaning.
- No conditional logic in tests (`if/else`, `try/catch` controlling flow).
- Explicit assertions live in tests, not hidden in helpers.
- Tests must run green locally and in CI with identical commands.
- A test delivers value only when it has failed at least once—design suites so they regularly catch regressions during development.

## NFR Status Criteria

- **Security**: PASS (auth, authz, secrets handled), CONCERNS (minor gaps), FAIL (critical exposure).
- **Performance**: PASS (meets targets, profiling evidence), CONCERNS (approaching limits), FAIL (breaches limits, leaks).
- **Reliability**: PASS (error handling, retries, health checks), CONCERNS (partial coverage), FAIL (no recovery, crashes).
- **Maintainability**: PASS (tests + docs + clean code), CONCERNS (duplication, low coverage), FAIL (no tests, tangled code).
- Unknown targets => CONCERNS until defined.

## Quality Gate Schema

```yaml
schema: 1
story: '{epic}.{story}'
story_title: '{title}'
gate: PASS|CONCERNS|FAIL|WAIVED
status_reason: 'Single sentence summary'
reviewer: 'Murat (Master Test Architect)'
updated: '2024-09-20T12:34:56Z'
waiver:
  active: false
  reason: ''
  approved_by: ''
  expires: ''
top_issues:
  - id: SEC-001
    severity: high
    finding: 'Issue description'
    suggested_action: 'Action to resolve'
risk_summary:
  totals:
    critical: 0
    high: 0
    medium: 0
    low: 0
recommendations:
  must_fix: []
  monitor: []
nfr_validation:
  security: { status: PASS, notes: '' }
  performance: { status: CONCERNS, notes: 'Add caching' }
  reliability: { status: PASS, notes: '' }
  maintainability: { status: PASS, notes: '' }
history:
  - at: '2024-09-20T12:34:56Z'
    gate: CONCERNS
    note: 'Initial review'
```

- Optional sections: `quality_score` block for extended metrics, and `evidence` block (tests_reviewed, risks_identified, trace.ac_covered/ac_gaps) when teams track them.

## Collaborative TDD Loop

- Share failing acceptance tests with the developer or AI agent.
- Track red -> green -> refactor progress alongside the implementation checklist.
- Update checklist items as each test passes; add new tests for discovered edge cases.
- Keep conversation focused on observable behavior, not implementation detail.

## Traceability Coverage Definitions

- FULL: All scenarios for the criterion validated across appropriate levels.
- PARTIAL: Some coverage exists but gaps remain.
- NONE: No tests currently validate the criterion.
- UNIT-ONLY: Only low-level tests exist; add integration/E2E.
- INTEGRATION-ONLY: Missing unit/component coverage for fast feedback.
- Avoid naive UI E2E until service-level confidence exists; use API or contract tests to harden backends first, then add minimal UI coverage to fill the gaps.

## CI Platform Guidance

- Default to GitHub Actions if no preference is given; otherwise ask for GitLab, CircleCI, etc.
- Ensure local script mirrors CI pipeline (npm test vs CI workflow).
- Use concurrency controls to prevent duplicate runs (`concurrency` block in GitHub Actions).
- Keep job runtime under 10 minutes; split further if necessary.

## Testing Tool Preferences

- Component testing: Large repositories prioritize Vitest with UI (fast, component-native). Smaller DX-first teams with existing Cypress stacks can keep Cypress Component Testing for consistency.
- E2E testing: Favor Playwright for large or performance-sensitive repos; reserve Cypress for smaller DX-first teams where developer experience outweighs scale.
- API testing: Prefer Playwright's API testing or contract suites over ad-hoc REST clients.
- Contract testing: Pact.js for consumer-driven contracts; keep `pact/` config in repo.
- Visual testing: Percy, Chromatic, or Playwright snapshots when UX must be audited.

## Naming Conventions

- File names: `ComponentName.cy.tsx` for Cypress component tests, `component-name.spec.ts` for Playwright, `ComponentName.test.tsx` for unit/RTL.
- Describe blocks: `describe('Feature/Component Name', () => { context('when condition', ...) })`.
- Data attributes: always kebab-case (`data-cy="submit-button"`, `data-testid="user-email"`).

## Contract Testing Rules (Pact)

- Use Pact for microservice integrations; keep a `pact/` directory with broker config and share contracts as first-class artifacts in the repo.
- Keep consumer contracts beside the integration specs that exercise them; version with semantic tags so downstream teams understand breaking changes.
- Publish contracts on every CI run and enforce provider verification before merge—failing verification blocks release and acts as a quality gate.
- Capture fallback behaviour (timeouts, retries, circuit breakers) inside interactions so resilience expectations stay explicit.
- Sample interaction scaffold:
  ```javascript
  const interaction = {
    state: 'user with id 1 exists',
    uponReceiving: 'a request for user 1',
    withRequest: {
      method: 'GET',
      path: '/users/1',
      headers: { Accept: 'application/json' },
    },
    willRespondWith: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: like({ id: 1, name: string('Jane Doe'), email: email('jane@example.com') }),
    },
  };
  ```

## Reference Capsules (Summaries Bundled In)

- **Fixture Architecture Quick Wins**
  - Compose Playwright or Cypress suites with additive fixtures; use `mergeTests`/`extend` to layer auth, network, and telemetry helpers without inheritance.
  - Keep HTTP helpers framework-agnostic so the same function fuels unit tests, API smoke checks, and runtime fixtures.
  - Normalize selectors (`data-testid`/`data-cy`) and lint new UI code for missing attributes to prevent brittle locators.

- **Playwright Patterns Digest**
  - Register network interceptions before navigation, assert on typed responses, and capture HAR files for regression.
  - Treat timeouts and retries as configuration, not inline magic numbers; expose overrides via fixtures.
  - Name specs and test IDs with intent (`checkout.complete-happy-path`) so CI shards and triage stay meaningful.

- **Component TDD Highlights**
  - Begin UI work with failing component specs; rebuild providers/stores per spec to avoid state bleed.
  - Use factories to exercise prop variations and edge cases; assert through accessible queries (`getByRole`, `getByLabelText`).
  - Document mount helpers and cleanup expectations so component tests stay deterministic.

- **Contract Testing Cliff Notes**
  - Store consumer contracts alongside integration specs; version with semantic tags and publish on every CI run.
  - Enforce provider verification prior to merge to act as a release gate for service integrations.
  - Capture fallback behaviour (timeouts, retries, circuit breakers) inside contracts to keep resilience expectations explicit.

- **End-to-End Reference Flow**
  - Prime end-to-end journeys through API fixtures, then assert through UI steps mirroring real user narratives.
  - Pair burn-in scripts (`npm run test:e2e -- --repeat-each=3`) with selective retries to flush flakes before promotion.

- **Philosophy & Heuristics Articles**
  - Use long-form articles for rationale; extract checklists, scripts, and thresholds back into this brief whenever teams adopt new practices.

These capsules distil Murat's sample repositories (Playwright patterns, Cypress vs Playwright comparisons, CCTDD, Pact examples, Tour of Heroes walkthrough) captured in the `test-resources-for-ai` knowledge pack so the TEA agent can operate offline while reflecting those techniques.

## Reference Assets

- [Test Architect README](./README.md) — high-level usage guidance and phase checklists.
- [Test Levels Framework](./test-levels-framework.md) — choose the right level for each scenario.
- [Test Priorities Matrix](./test-priorities-matrix.md) — assign P0–P3 priorities consistently.
- [TEA Workflows](../workflows/testarch/README.md) — per-command instructions executed by the agent.
- [Murat Knowledge Bundle](./test-resources-for-ai-flat.txt) — 347 KB flattened snapshot of Murat’s blogs, philosophy notes, and course material. Sections are delimited with `FILE:` headers; load relevant portions when deeper examples or rationales are required.
