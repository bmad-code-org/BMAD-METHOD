<!-- Powered by BMAD-CORE™ -->

# Risk & Test Design v3.1

```xml
<task id="bmad/bmm/testarch/test-design" name="Risk & Test Design">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Story markdown, acceptance criteria, PRD/architecture context are available.</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Confirm inputs; halt if any are missing or unclear.</action>
    </step>
    <step n="2" title="Assess Risks">
      <action>Consult `{project-root}/bmad/bmm/testarch/tea-knowledge.md` for the latest risk heuristics before scoring.</action>
      <action>Use `{project-root}/bmad/bmm/testarch/tea-index.csv` to pull targeted fragments (risk heuristics, fixture guidance, etc.) from `knowledge/` as needed.</action>
      <action>Filter requirements to isolate genuine risks; review PRD/architecture/story for unresolved gaps.</action>
      <action>Classify risks across TECH, SEC, PERF, DATA, BUS, OPS; request clarification when evidence is missing.</action>
      <action>Score probability (1 unlikely, 2 possible, 3 likely) and impact (1 minor, 2 degraded, 3 critical); compute totals and highlight scores ≥6.</action>
      <action>Plan mitigations with owners, timelines, and update residual risk expectations.</action>
    </step>
    <step n="3" title="Design Coverage">
      <action>Break acceptance criteria into atomic scenarios tied to mitigations.</action>
      <action>Choose test levels using `{project-root}/bmad/bmm/testarch/test-levels-framework.md` and avoid duplicate coverage (prefer lower levels when possible).</action>
      <action>Assign priorities using `{project-root}/bmad/bmm/testarch/test-priorities-matrix.md`; outline data/tooling prerequisites and execution order.</action>
    </step>
    <step n="4" title="Deliverables">
      <action>Create risk assessment markdown (category/probability/impact/score) with mitigation matrix and gate snippet totals.</action>
      <action>Produce coverage matrix (requirement/level/priority/mitigation) plus recommended execution order.</action>
    </step>
  </flow>
  <halt>
    <i>If story data or criteria are missing, halt and request them.</i>
  </halt>
  <notes>
    <i>Category definitions: TECH=architecture flaws; SEC=missing controls; PERF=SLA risk; DATA=loss/corruption; BUS=user/business harm; OPS=deployment/run failures.</i>
    <i>Leverage `tea-index.csv` tags to find supporting evidence (e.g., fixture-architecture, selective-testing) without loading unnecessary files.</i>
    <i>Rely on evidence, not speculation; tie scenarios back to mitigations; keep scenarios independent and maintainable.</i>
  </notes>
  <output>
    <i>Unified risk assessment and coverage strategy ready for implementation.</i>
  </output>
</task>
```
