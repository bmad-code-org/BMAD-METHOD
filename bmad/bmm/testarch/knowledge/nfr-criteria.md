# Non-Functional Review Criteria

- **Security**
  - PASS: auth/authz, secret handling, and threat mitigations in place.
  - CONCERNS: minor gaps with clear owners.
  - FAIL: critical exposure or missing controls.
- **Performance**
  - PASS: metrics meet targets with profiling evidence.
  - CONCERNS: trending toward limits or missing baselines.
  - FAIL: breaches SLO/SLA or introduces resource leaks.
- **Reliability**
  - PASS: error handling, retries, health checks verified.
  - CONCERNS: partial coverage or missing telemetry.
  - FAIL: no recovery path or crash scenarios unresolved.
- **Maintainability**
  - PASS: clean code, tests, and documentation shipped together.
  - CONCERNS: duplication, low coverage, or unclear ownership.
  - FAIL: absent tests, tangled implementations, or no observability.
- Default to CONCERNS when targets or evidence are undefined—force the team to clarify before sign-off.

_Source: Murat NFR assessment guidance._
