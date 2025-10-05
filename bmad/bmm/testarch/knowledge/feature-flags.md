# Feature Flag Governance

- Centralize flag definitions in a frozen enum; expose helpers to set, clear, and target specific audiences.
- Test both enabled and disabled states in CI; clean up targeting after each spec to keep shared environments stable.
- For LaunchDarkly-style systems, script API helpers to seed variations instead of mutating via UI.
- Maintain a checklist for new flags: default state, owners, expiry date, telemetry, rollback plan.
- Document flag dependencies in story/PR templates so QA and release reviews know which toggles must flip before launch.

_Source: LaunchDarkly strategy blog, Murat test architecture notes._
