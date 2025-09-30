<!-- Powered by BMAD-CORE™ -->

# Acceptance TDD v3.0

```xml
<task id="bmad/bmm/testarch/atdd" name="Acceptance Test Driven Development">
  <llm critical="true">
    <i>Preflight requirements:</i>
    <i>- Story is approved with clear acceptance criteria.</i>
    <i>- Development sandbox/environment is ready.</i>
    <i>- Framework scaffolding exists (run `*framework` if missing).</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Confirm each requirement above; halt if any are missing.</action>
    </step>
    <step n="2" title="Author Failing Acceptance Tests">
      <action>Clarify acceptance criteria and affected systems.</action>
      <action>Select appropriate test level (E2E/API/Component).</action>
      <action>Create failing tests using Given-When-Then with network interception before navigation.</action>
      <action>Build data factories and fixture stubs for required entities.</action>
      <action>Outline mocks/fixtures infrastructure the dev team must provide.</action>
      <action>Generate component tests for critical UI logic.</action>
      <action>Compile an implementation checklist mapping each test to code work.</action>
      <action>Share failing tests and checklist with the dev agent, maintaining red → green → refactor loop.</action>
    </step>
    <step n="3" title="Deliverables">
      <action>Output failing acceptance test files, component test stubs, fixture/mocks skeleton, implementation checklist, and data-testid requirements.</action>
    </step>
  </flow>
  <halt>
    <i>If acceptance criteria are ambiguous or the framework is missing, halt and request clarification/set up.</i>
  </halt>
  <notes>
    <i>Consult `{project-root}/bmad/bmm/testarch/tea-index.csv` to identify ATDD-related fragments (fixture-architecture, data-factories, component-tdd) and load them from `knowledge/`.</i>
    <i>Start red; one assertion per test; keep setup visible (no hidden shared state).</i>
    <i>Remind devs to run tests before writing production code; update checklist as tests turn green.</i>
  </notes>
  <output>
    <i>Failing acceptance/component test suite plus implementation checklist.</i>
  </output>
</task>
```
