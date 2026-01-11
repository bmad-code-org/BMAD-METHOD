# Story Creation Checklist

Use this checklist when creating a new story in Step 2.

## User Story Format

- [ ] Follows "As a [persona], I want [action], So that [benefit]" format
- [ ] Persona is clearly defined and exists in project documentation
- [ ] Action is specific and achievable
- [ ] Benefit ties to business value

## Acceptance Criteria

### Structure (for EACH AC)
- [ ] Has Given/When/Then format (BDD style)
- [ ] **Given** describes a valid precondition
- [ ] **When** describes a clear, single action
- [ ] **Then** describes a measurable outcome

### Quality (for EACH AC)
- [ ] Specific - no vague terms ("appropriate", "reasonable", "etc.")
- [ ] Measurable - clear success/failure criteria
- [ ] Testable - can write automated test
- [ ] Independent - no hidden dependencies on other AC

### Completeness
- [ ] All happy path scenarios covered
- [ ] Error scenarios defined
- [ ] Edge cases considered
- [ ] Boundary conditions clear

### Anti-patterns to AVOID
- [ ] No AND conjunctions (split into multiple AC)
- [ ] No OR alternatives (ambiguous paths)
- [ ] No implementation details (WHAT not HOW)
- [ ] No vague verbs ("handle", "process", "manage")

## Test Scenarios

- [ ] At least 2 test scenarios per AC
- [ ] Happy path scenario exists
- [ ] Error/edge case scenario exists
- [ ] Each scenario is unique (no duplicates)
- [ ] Scenarios are specific enough to write tests from

## Tasks

- [ ] Tasks cover implementation of all AC
- [ ] Tasks are actionable (start with verb)
- [ ] Subtasks provide enough detail
- [ ] Dependencies between tasks are clear
- [ ] No task is too large (can complete in one session)

## Technical Notes

- [ ] Database changes documented
- [ ] API changes documented
- [ ] UI changes documented
- [ ] Security considerations noted
- [ ] Performance considerations noted

## Dependencies & Scope

- [ ] Dependencies on other stories listed
- [ ] Dependencies on external systems listed
- [ ] Out of scope explicitly defined
- [ ] No scope creep from epic definition

## Quality Gate

Story is ready for validation when:
- [ ] All sections complete
- [ ] All AC in proper format
- [ ] Test scenarios defined
- [ ] Tasks cover all work
- [ ] No ambiguity remains
