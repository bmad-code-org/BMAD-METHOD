<!-- Powered by BMAD-CORE™ -->

# Test Framework Setup v3.0

```xml
<task id="bmad/bmm/testarch/framework" name="Test Framework Setup">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Confirm `package.json` exists.</i>
    <i>- Verify no modern E2E harness is already configured.</i>
    <i>- Have architectural/stack context available.</i>
  </llm>
  <flow>
    <step n="1" title="Run Preflight Checks">
      <action>Validate each preflight requirement; stop immediately if any fail.</action>
    </step>
    <step n="2" title="Scaffold Framework">
      <action>Identify framework stack from `package.json` (React/Vue/Angular/Next.js) and bundler (Vite/Webpack/Rollup/esbuild).</action>
      <action>Select Playwright for large/perf-critical repos, Cypress for small DX-first teams.</action>
      <action>Create folders `{framework}/tests/`, `{framework}/support/fixtures/`, `{framework}/support/helpers/`.</action>
      <action>Configure timeouts (action 15s, navigation 30s, test 60s) and reporters (HTML + JUnit).</action>
      <action>Generate `.env.example` with `TEST_ENV`, `BASE_URL`, `API_URL` plus `.nvmrc`.</action>
      <action>Implement pure function → fixture → `mergeTests` pattern and faker-based data factories.</action>
      <action>Enable failure-only screenshots/videos and document setup in README.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Produce Playwright/Cypress scaffold (config + support tree), `.env.example`, `.nvmrc`, seed tests, and README instructions.</action>
    </step>
  </flow>
  <halt>
    <i>If prerequisites fail or an existing harness is detected, halt and notify the user.</i>
  </halt>
  <notes>
    <i>Consult `{project-root}/bmad/bmm/testarch/tea-index.csv` to identify and load the `knowledge/` fragments relevant to this task (fixtures, network, config).</i>
    <i>Playwright: take advantage of worker parallelism, trace viewer, multi-language support.</i>
    <i>Cypress: avoid when dependent API chains are heavy; consider component testing (Vitest/Cypress CT).</i>
    <i>Contract testing: suggest Pact for microservices; always recommend data-cy/data-testid selectors.</i>
  </notes>
  <output>
    <i>Scaffolded framework assets and summary of what was created.</i>
  </output>
</task>
```
