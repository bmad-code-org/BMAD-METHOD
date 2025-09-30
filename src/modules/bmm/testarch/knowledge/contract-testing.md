# Contract Testing Essentials (Pact)

- Store consumer contracts beside the integration specs that generate them; version contracts semantically and publish on every CI run.
- Require provider verification before merge; failed verification blocks release and surfaces breaking changes immediately.
- Capture fallback behaviour inside interactions (timeouts, retries, error payloads) so resilience guarantees remain explicit.
- Automate broker housekeeping: tag releases, archive superseded contracts, and expire unused pacts to reduce noise.
- Pair contract suites with API smoke or component tests to validate data mapping and UI rendering in tandem.

_Source: Pact consumer/provider sample repos, Murat contract testing blog._
