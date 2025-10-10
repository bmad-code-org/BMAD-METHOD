# Error Handling and Resilience Checks

- Treat expected failures explicitly: intercept network errors and assert UI fallbacks (`error-message` visible, retries triggered).
- In Cypress, use scoped `Cypress.on('uncaught:exception')` to ignore known errors; rethrow anything else so regressions fail.
- In Playwright, hook `page.on('pageerror')` and only swallow the specific, documented error messages.
- Test retry/backoff logic by forcing sequential failures (e.g., 500, timeout, success) and asserting telemetry gets recorded.
- Log captured errors with context (request payload, user/session) but redact secrets to keep artifacts safe for sharing.

_Source: Murat error-handling patterns, Pact resilience guidance._
