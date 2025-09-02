<!-- Powered by BMAD™ Core -->

# TDD Story Definition of Done Checklist

## Instructions for Agents

This checklist ensures TDD stories meet quality standards across all Red-Green-Refactor cycles. Both QA and Dev agents should validate completion before marking a story as Done.

[[LLM: TDD DOD VALIDATION INSTRUCTIONS

This is a specialized DoD checklist for Test-Driven Development stories. It extends the standard DoD with TDD-specific quality gates.

EXECUTION APPROACH:

1. Verify TDD cycle progression (Red → Green → Refactor → Done)
2. Validate test-first approach was followed
3. Ensure proper test isolation and determinism
4. Check code quality improvements from refactoring
5. Confirm coverage targets are met

CRITICAL: Never mark a TDD story as Done without completing all TDD phases.]]

## TDD Cycle Validation

### Red Phase Completion

[[LLM: Verify tests were written BEFORE implementation]]

- [ ] **Tests written first:** All tests were created before any implementation code
- [ ] **Failing correctly:** Tests fail for the right reasons (missing functionality, not bugs)
- [ ] **Proper test structure:** Tests follow Given-When-Then or Arrange-Act-Assert patterns
- [ ] **Deterministic tests:** No random values, network calls, or time dependencies
- [ ] **External dependencies mocked:** All external services, databases, APIs properly mocked
- [ ] **Test naming:** Clear, descriptive test names that express intent
- [ ] **Story metadata updated:** TDD status set to 'red' and test list populated

### Green Phase Completion

[[LLM: Ensure minimal implementation that makes tests pass]]

- [ ] **All tests passing:** 100% of tests pass consistently
- [ ] **Minimal implementation:** Only code necessary to make tests pass was written
- [ ] **No feature creep:** No functionality added without corresponding failing tests
- [ ] **Test-code traceability:** Implementation clearly addresses specific test requirements
- [ ] **Regression protection:** All previously passing tests remain green
- [ ] **Story metadata updated:** TDD status set to 'green' and test results documented

### Refactor Phase Completion

[[LLM: Verify code quality improvements while maintaining green tests]]

- [ ] **Tests remain green:** All tests continue to pass after refactoring
- [ ] **Code quality improved:** Duplication eliminated, naming improved, structure clarified
- [ ] **Design enhanced:** Better separation of concerns, cleaner interfaces
- [ ] **Technical debt addressed:** Known code smells identified and resolved
- [ ] **Commit discipline:** Small, incremental commits with green tests after each
- [ ] **Story metadata updated:** Refactoring notes and improvements documented

## Test Quality Standards

### Test Implementation Quality

[[LLM: Ensure tests are maintainable and reliable]]

- [ ] **Fast execution:** Unit tests complete in <100ms each
- [ ] **Isolated tests:** Each test can run independently in any order
- [ ] **Single responsibility:** Each test validates one specific behavior
- [ ] **Clear assertions:** Test failures provide meaningful error messages
- [ ] **Appropriate test types:** Right mix of unit/integration/e2e tests
- [ ] **Mock strategy:** Appropriate use of mocks vs fakes vs stubs

### Coverage and Completeness

[[LLM: Validate comprehensive test coverage]]

- [ ] **Coverage target met:** Code coverage meets story's target percentage
- [ ] **Acceptance criteria covered:** All ACs have corresponding tests
- [ ] **Edge cases tested:** Boundary conditions and error scenarios included
- [ ] **Happy path validated:** Primary success scenarios thoroughly tested
- [ ] **Error handling tested:** Exception paths and error recovery validated

## Implementation Quality

### Code Standards Compliance

[[LLM: Ensure production-ready code quality]]

- [ ] **Coding standards followed:** Code adheres to project style guidelines
- [ ] **Architecture alignment:** Implementation follows established patterns
- [ ] **Security practices:** Input validation, error handling, no hardcoded secrets
- [ ] **Performance considerations:** No obvious performance bottlenecks introduced
- [ ] **Documentation updated:** Code comments and documentation reflect changes

### File Organization and Management

[[LLM: Verify proper project structure]]

- [ ] **Test file organization:** Tests follow project's testing folder structure
- [ ] **Naming conventions:** Files and functions follow established patterns
- [ ] **Dependencies managed:** New dependencies properly declared and justified
- [ ] **Import/export clarity:** Clear module interfaces and dependencies
- [ ] **File list accuracy:** All created/modified files documented in story

## TDD Process Adherence

### Methodology Compliance

[[LLM: Confirm true TDD practice was followed]]

- [ ] **Test-first discipline:** No implementation code written before tests
- [ ] **Minimal cycles:** Small Red-Green-Refactor iterations maintained
- [ ] **Refactoring safety:** Only refactored with green test coverage
- [ ] **Requirements traceability:** Clear mapping from tests to acceptance criteria
- [ ] **Collaboration evidence:** QA and Dev agent coordination documented

### Documentation and Traceability

[[LLM: Ensure proper tracking and communication]]

- [ ] **TDD progress tracked:** Story shows progression through all TDD phases
- [ ] **Test execution logged:** Evidence of test runs and results captured
- [ ] **Refactoring documented:** Changes made during refactor phase explained
- [ ] **Agent collaboration:** Clear handoffs between QA (Red) and Dev (Green/Refactor)
- [ ] **Story metadata complete:** All TDD fields properly populated

## Integration and Deployment Readiness

### Build and Deployment

[[LLM: Ensure story integrates properly with project]]

- [ ] **Project builds successfully:** Code compiles without errors or warnings
- [ ] **All tests pass in CI:** Automated test suite runs successfully
- [ ] **No breaking changes:** Existing functionality remains intact
- [ ] **Environment compatibility:** Code works across development environments
- [ ] **Configuration managed:** Any new config values properly documented

### Review Readiness

[[LLM: Story is ready for peer review]]

- [ ] **Complete implementation:** All acceptance criteria fully implemented
- [ ] **Clean commit history:** Clear, logical progression of changes
- [ ] **Review artifacts:** All necessary files and documentation available
- [ ] **No temporary code:** Debug code, TODOs, and temporary hacks removed
- [ ] **Quality gates passed:** All automated quality checks successful

## Final TDD Validation

### Holistic Assessment

[[LLM: Overall TDD process and outcome validation]]

- [ ] **TDD value delivered:** Process improved code design and quality
- [ ] **Test suite value:** Tests provide reliable safety net for changes
- [ ] **Knowledge captured:** Future developers can understand and maintain code
- [ ] **Standards elevated:** Code quality meets or exceeds project standards
- [ ] **Learning documented:** Any insights or patterns discovered are captured

### Story Completion Criteria

[[LLM: Final checklist before marking Done]]

- [ ] **Business value delivered:** Story provides promised user value
- [ ] **Technical debt managed:** Any remaining debt is documented and acceptable
- [ ] **Future maintainability:** Code can be easily modified and extended
- [ ] **Production readiness:** Code is ready for production deployment
- [ ] **TDD story complete:** All TDD-specific requirements fulfilled

## Completion Declaration

**Agent Validation:**

- [ ] **QA Agent confirms:** Test strategy executed successfully, coverage adequate
- [ ] **Dev Agent confirms:** Implementation complete, code quality satisfactory

**Final Status:**

- [ ] **Story marked Done:** All DoD criteria met and verified
- [ ] **TDD status complete:** Story TDD metadata shows 'done' status
- [ ] **Ready for review:** Story package complete for stakeholder review

---

**Validation Date:** {date}  
**Validating Agents:** {qa_agent} & {dev_agent}  
**TDD Cycles Completed:** {cycle_count}  
**Final Test Status:** {passing_count} passing, {failing_count} failing
