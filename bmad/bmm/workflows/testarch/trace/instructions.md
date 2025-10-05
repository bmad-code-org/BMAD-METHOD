<!-- Powered by BMAD-CORE™ -->

# Requirements Traceability v3.0

```xml
<task id="bmad/bmm/testarch/trace" name="Requirements Traceability">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Story has implemented tests (or acknowledge gaps).</i>
    <i>- Access to source code and specifications is available.</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Confirm prerequisites; halt if tests or specs are unavailable.</action>
    </step>
    <step n="2" title="Trace Coverage">
      <action>Gather acceptance criteria and implemented tests.</action>
      <action>Map each criterion to concrete tests (file + describe/it) using Given-When-Then narrative.</action>
      <action>Classify coverage status as FULL, PARTIAL, NONE, UNIT-ONLY, or INTEGRATION-ONLY.</action>
      <action>Flag severity based on priority (P0 gaps are critical) and recommend additional tests or refactors.</action>
      <action>Build gate YAML coverage summary reflecting totals and gaps.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Generate traceability report under `docs/qa/assessments`, a coverage matrix per criterion, and gate YAML snippet capturing totals/gaps.</action>
    </step>
  </flow>
  <halt>
    <i>If story lacks implemented tests, pause and advise running `*atdd` or writing tests before tracing.</i>
  </halt>
  <notes>
    <i>Use `{project-root}/bmad/bmm/testarch/tea-index.csv` to load traceability-relevant fragments (risk-governance, selective-testing, test-quality) as needed.</i>
    <i>Coverage definitions: FULL=all scenarios validated, PARTIAL=some coverage, NONE=no validation, UNIT-ONLY=missing higher-level validation, INTEGRATION-ONLY=lacks lower-level confidence.</i>
    <i>Ensure assertions stay explicit and avoid duplicate coverage.</i>
  </notes>
  <output>
    <i>Traceability matrix and gate snippet ready for review.</i>
  </output>
</task>
```
