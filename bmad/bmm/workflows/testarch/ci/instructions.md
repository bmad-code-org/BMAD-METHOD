<!-- Powered by BMAD-CORE™ -->

# CI/CD Enablement v3.0

```xml
<task id="bmad/bmm/testarch/ci" name="CI/CD Enablement">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Git repository is initialized.</i>
    <i>- Local test suite passes.</i>
    <i>- Team agrees on target environments.</i>
    <i>- Access to CI platform settings/secrets is available.</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Confirm all items above; halt if prerequisites are unmet.</action>
    </step>
    <step n="2" title="Configure Pipeline">
      <action>Detect CI platform (default GitHub Actions; ask about GitLab/CircleCI/etc.).</action>
      <action>Scaffold workflow (e.g., `.github/workflows/test.yml`) with appropriate triggers and caching (Node version from `.nvmrc`, browsers).</action>
      <action>Stage jobs sequentially (lint → unit → component → e2e) with matrix parallelization (shard by file, not test).</action>
      <action>Add selective execution script(s) for affected tests plus burn-in job rerunning changed specs 3x to catch flakiness.</action>
      <action>Attach artifacts on failure (traces/videos/HAR) and configure retries/backoff/concurrency controls.</action>
      <action>Document required secrets/environment variables and wire Slack/email notifications; provide local mirror script.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Produce workflow file(s), helper scripts (`test-changed`, burn-in), README/ci.md updates, secrets checklist, and any dashboard/badge configuration.</action>
    </step>
  </flow>
  <halt>
    <i>If git repo is absent, tests fail, or CI platform is unspecified, halt and request setup.</i>
  </halt>
  <notes>
    <i>Use `{project-root}/bmad/bmm/testarch/tea-index.csv` to load CI-focused fragments (ci-burn-in, selective-testing, visual-debugging) before finalising recommendations.</i>
    <i>Target ~20× speedups via parallel shards and caching; keep jobs under 10 minutes.</i>
    <i>Use `wait-on-timeout` ≈120s for app startup; ensure local `npm test` mirrors CI run.</i>
    <i>Mention alternative platform paths when not on GitHub.</i>
  </notes>
  <output>
    <i>CI pipeline configuration and guidance ready for team adoption.</i>
  </output>
</task>
```
