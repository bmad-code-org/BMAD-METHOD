# CI Pipeline and Burn-In Strategy

- Stage jobs: install/caching once, run `test-changed` for quick feedback, then shard full suites with `fail-fast: false` so evidence isn’t lost.
- Re-run changed specs 5–10x (burn-in) before merging to flush flakes; fail the pipeline on the first inconsistent run.
- Upload artifacts on failure (videos, traces, HAR) and keep retry counts explicit—hidden retries hide instability.
- Use `wait-on` for app startup, enforce time budgets (<10 min per job), and document required secrets alongside workflows.
- Mirror CI scripts locally (`npm run test:ci`, `scripts/burn-in-changed.sh`) so devs reproduce pipeline behaviour exactly.

_Source: Murat CI/CD strategy blog, Playwright/Cypress workflow examples._
