# Test Quality Definition of Done

- No hard waits (`waitForTimeout`, `cy.wait(ms)`); rely on deterministic waits or event hooks.
- Each spec <300 lines and executes in ≤1.5 minutes.
- Tests are isolated, parallel-safe, and self-cleaning (seed via API/tasks, teardown after run).
- Assertions stay visible in test bodies; avoid conditional logic controlling test flow.
- Suites must pass locally and in CI with the same commands.
- Promote new tests only after they have failed for the intended reason at least once.

_Source: Murat quality checklist._
