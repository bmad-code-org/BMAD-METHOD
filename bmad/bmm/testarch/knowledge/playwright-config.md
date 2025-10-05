# Playwright Configuration Guardrails

- Load environment configs via a central map (`envConfigMap`) and fail fast when `TEST_ENV` is missing or unsupported.
- Standardize timeouts: action 15s, navigation 30s, expect 10s, test 60s; expose overrides through fixtures rather than inline literals.
- Emit HTML + JUnit reporters, disable auto-open, and store artifacts under `test-results/` for CI upload.
- Keep `.env.example`, `.nvmrc`, and browser dependencies versioned so local and CI runs stay aligned.
- Use global setup for shared auth tokens or seeding, but prefer per-test fixtures for anything mutable to avoid cross-test leakage.

_Source: Playwright book repo, SEON configuration example._
