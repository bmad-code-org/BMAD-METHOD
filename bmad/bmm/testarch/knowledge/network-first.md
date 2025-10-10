# Network-First Safeguards

- Register interceptions before any navigation or user action; store the promise and await it immediately after the triggering step.
- Assert on structured responses (status, body schema, headers) instead of generic waits so failures surface with actionable context.
- Capture HAR files or Playwright traces on successful runs—reuse them for deterministic CI playback when upstream services flake.
- Prefer edge mocking: stub at service boundaries, never deep within the stack unless risk analysis demands it.
- Replace implicit waits with deterministic signals like `waitForResponse`, disappearance of spinners, or event hooks.

_Source: Murat Testing Philosophy, Playwright patterns book, blog on network interception._
