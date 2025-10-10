<!-- Powered by BMAD-CORE™ -->

# Automation Expansion v3.0

```xml
<task id="bmad/bmm/testarch/automate" name="Automation Expansion">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Acceptance criteria are satisfied.</i>
    <i>- Code builds locally without errors.</i>
    <i>- Framework scaffolding is configured.</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Verify all requirements above; halt if any fail.</action>
    </step>
    <step n="2" title="Expand Automation">
      <action>Review story source/diff to confirm automation targets.</action>
      <action>Use `{project-root}/bmad/bmm/testarch/tea-index.csv` to load fragments such as `fixture-architecture`, `selective-testing`, `ci-burn-in`, `test-quality`, `test-levels`, and `test-priorities` before proposing additions.</action>
      <action>Ensure fixture architecture exists (Playwright `mergeTests`, Cypress commands); add apiRequest/network/auth/log fixtures if missing.</action>
      <action>Map acceptance criteria using the `test-levels` fragment to avoid redundant coverage.</action>
      <action>Assign priorities using the `test-priorities` fragment so effort follows risk tiers.</action>
      <action>Generate unit/integration/E2E specs (naming `feature-name.spec.ts`) covering happy, negative, and edge paths.</action>
      <action>Enforce deterministic waits, self-cleaning factories, and execution under 1.5 minutes per test.</action>
      <action>Run the suite, capture Definition of Done results, and update package.json scripts plus README instructions.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Create new/enhanced spec files grouped by level, supporting fixtures/helpers, data factory utilities, updated scripts/README notes, and a DoD summary highlighting remaining gaps.</action>
    </step>
  </flow>
  <halt>
    <i>If the automation target is unclear or the framework is missing, halt and request clarification/setup.</i>
  </halt>
  <notes>
    <i>Never create page objects; keep tests under 300 lines and stateless.</i>
    <i>Forbid hard waits/conditional flow; co-locate tests near source.</i>
    <i>Flag flaky patterns immediately.</i>
    <i>Reference `tea-index.csv` tags (e.g., fixture-architecture, selective-testing, ci-burn-in) to load the right fragment instead of the entire knowledge bundle.</i>
  </notes>
  <output>
    <i>Prioritized automation suite updates and DoD summary ready for gating.</i>
  </output>
</task>
```
