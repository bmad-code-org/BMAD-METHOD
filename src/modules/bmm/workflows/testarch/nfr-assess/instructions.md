<!-- Powered by BMAD-CORE™ -->

# NFR Assessment v3.0

```xml
<task id="bmad/bmm/testarch/nfr-assess" name="NFR Assessment">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Implementation is deployed locally or accessible for evaluation.</i>
    <i>- Non-functional goals/SLAs are defined or discoverable.</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Confirm prerequisites; halt if targets are unknown and cannot be clarified.</action>
    </step>
    <step n="2" title="Assess NFRs">
      <action>Identify which NFRs to assess (default: Security, Performance, Reliability, Maintainability).</action>
      <action>Gather thresholds from story/architecture/technical preferences; mark unknown targets.</action>
      <action>Inspect evidence (tests, telemetry, logs) for each NFR and classify status using deterministic PASS/CONCERNS/FAIL rules.</action>
      <action>List quick wins and recommended actions for any concerns/failures.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Produce NFR assessment markdown summarizing evidence, status, and actions; update gate YAML block with NFR findings; compile checklist of evidence gaps and owners.</action>
    </step>
  </flow>
  <halt>
    <i>If NFR targets are undefined and cannot be obtained, halt and request definition.</i>
  </halt>
  <notes>
    <i>Load the `nfr-criteria`, `ci-burn-in`, and relevant fragments via `{project-root}/bmad/bmm/testarch/tea-index.csv` to ground the assessment.</i>
    <i>Unknown thresholds default to CONCERNS—never guess.</i>
    <i>Ensure every NFR has evidence or call it out explicitly.</i>
    <i>Suggest monitoring hooks and fail-fast mechanisms when gaps exist.</i>
  </notes>
  <output>
    <i>NFR assessment report with actionable follow-ups and gate snippet.</i>
  </output>
</task>
```
