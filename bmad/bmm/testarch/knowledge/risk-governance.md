# Risk Governance and Gatekeeping

- Score risk as probability (1–3) × impact (1–3); totals ≥6 demand mitigation before approval, 9 mandates a gate failure.
- Classify risks across TECH, SEC, PERF, DATA, BUS, OPS. Document owners, mitigation plans, and deadlines for any score above 4.
- Trace every acceptance criterion to implemented tests; missing coverage must be resolved or explicitly waived before release.
- Gate decisions:
  - **PASS** – no critical issues remain and evidence is current.
  - **CONCERNS** – residual risk exists but has owners, actions, and timelines.
  - **FAIL** – critical issues unresolved or evidence missing.
  - **WAIVED** – risk accepted with documented approver, rationale, and expiry.
- Maintain a gate history log capturing updates so auditors can follow the decision trail.
- Use the probability/impact scale fragment for shared definitions when scoring teams run the matrix.

_Source: Murat risk governance notes, gate schema guidance._
