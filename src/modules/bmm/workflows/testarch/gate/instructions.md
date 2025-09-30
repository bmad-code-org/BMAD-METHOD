<!-- Powered by BMAD-CORE™ -->

# Quality Gate v3.0

```xml
<task id="bmad/bmm/testarch/gate" name="Quality Gate">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Latest assessments (risk/test design, trace, automation, NFR) are available.</i>
    <i>- Team has consensus on fixes/mitigations.</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Gather required assessments and confirm consensus; halt if information is stale or missing.</action>
    </step>
    <step n="2" title="Determine Gate Decision">
      <action>Assemble story metadata (id, title, links) for the gate file.</action>
      <action>Apply deterministic rules: PASS (all critical issues resolved), CONCERNS (minor residual risk), FAIL (critical blockers), WAIVED (business-approved waiver).</action>
      <action>Document rationale, residual risks, owners, due dates, and waiver details where applicable.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Update gate YAML with schema fields (story info, status, rationale, waiver, top issues, risk summary, recommendations, NFR validation, history).</action>
      <action>Provide summary message for the team highlighting decision and next steps.</action>
    </step>
  </flow>
  <halt>
    <i>If reviews are incomplete or risk data is outdated, halt and request the necessary reruns.</i>
  </halt>
  <notes>
    <i>Pull the risk-governance, probability-impact, and test-quality fragments via `{project-root}/bmad/bmm/testarch/tea-index.csv` before issuing a gate decision.</i>
    <i>FAIL whenever unresolved P0 risks/tests or security issues remain.</i>
    <i>CONCERNS when mitigations are planned but residual risk exists; WAIVED requires reason, approver, and expiry.</i>
    <i>Maintain audit trail in the history section.</i>
  </notes>
  <output>
    <i>Gate YAML entry and communication summary documenting the decision.</i>
  </output>
</task>
```
