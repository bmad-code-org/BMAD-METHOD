# Component Test-Driven Development Loop

- Start every UI change with a failing component spec (`cy.mount` or RTL `render`); ship only after red → green → refactor passes.
- Recreate providers/stores per spec to prevent state bleed and keep parallel runs deterministic.
- Use factories to exercise prop/state permutations; cover accessibility by asserting against roles, labels, and keyboard flows.
- Keep component specs under ~100 lines: split by intent (rendering, state transitions, error messaging) to preserve clarity.
- Pair component tests with visual debugging (Cypress runner, Storybook, Playwright trace viewer) to accelerate diagnosis.

_Source: CCTDD repository, Murat component testing talks._
