# Fixture Architecture Playbook

- Build helpers as pure functions first, then expose them via Playwright `extend` or Cypress commands so logic stays testable in isolation.
- Compose capabilities with `mergeTests` (Playwright) or layered Cypress commands instead of inheritance; each fixture should solve one concern (auth, api, logs, network).
- Keep HTTP helpers framework agnostic—accept all required params explicitly and return results so unit tests and runtime fixtures can share them.
- Export fixtures through package subpaths (`"./api-request"`, `"./api-request/fixtures"`) to make reuse trivial across suites and projects.
- Treat fixture files as infrastructure: document dependencies, enforce deterministic timeouts, and ban hidden retries that mask flakiness.

_Source: Murat Testing Philosophy, cy-vs-pw comparison, SEON production patterns._
