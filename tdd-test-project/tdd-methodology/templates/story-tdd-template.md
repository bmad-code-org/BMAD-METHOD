<!-- Powered by BMAD™ Core -->

# Story {epic}.{story}: {title}

## Story Metadata

```yaml
story:
  epic: '{epic}'
  number: '{story}'
  title: '{title}'
  status: 'draft'
  priority: 'medium'

# TDD Configuration (only when tdd.enabled=true)
tdd:
  status: 'red' # red|green|refactor|done
  cycle: 1
  coverage_target: 80.0
  tests: [] # Will be populated by QA agent during Red phase
```

## Story Description

**As a** {user_type}  
**I want** {capability}  
**So that** {business_value}

### Context

{Provide context about why this story is needed, what problem it solves, and how it fits into the larger epic/project}

## Acceptance Criteria

```gherkin
Feature: {Feature name}

Scenario: {Primary happy path}
  Given {initial conditions}
  When {action performed}
  Then {expected outcome}

Scenario: {Error condition 1}
  Given {error setup}
  When {action that causes error}
  Then {expected error handling}

Scenario: {Edge case}
  Given {edge case setup}
  When {edge case action}
  Then {edge case outcome}
```

## Technical Requirements

### Functional Requirements

- {Requirement 1}
- {Requirement 2}
- {Requirement 3}

### Non-Functional Requirements

- **Performance:** {Response time, throughput requirements}
- **Security:** {Authentication, authorization, data protection}
- **Reliability:** {Error handling, recovery requirements}
- **Maintainability:** {Code quality, documentation standards}

## TDD Test Plan (QA Agent Responsibility)

### Test Strategy

- **Primary Test Type:** {unit|integration|e2e}
- **Mocking Approach:** {mock external services, databases, etc.}
- **Test Data:** {how test data will be managed}

### Planned Test Scenarios

| ID     | Scenario           | Type        | Priority | AC Reference |
| ------ | ------------------ | ----------- | -------- | ------------ |
| TC-001 | {test description} | unit        | P0       | AC1          |
| TC-002 | {test description} | unit        | P0       | AC2          |
| TC-003 | {test description} | integration | P1       | AC3          |

_(This section will be populated by QA agent during test planning)_

## TDD Progress

### Current Phase: {RED|GREEN|REFACTOR|DONE}

**Cycle:** {cycle_number}
**Last Updated:** {date}

_(TDD progress will be tracked here through Red-Green-Refactor cycles)_

---

## Implementation Tasks (Dev Agent)

### Primary Tasks

- [ ] {Main implementation task 1}
- [ ] {Main implementation task 2}
- [ ] {Main implementation task 3}

### Subtasks

- [ ] {Detailed subtask}
- [ ] {Another subtask}

## Definition of Done

### TDD-Specific DoD

- [ ] Tests written first (Red phase completed)
- [ ] All tests passing (Green phase completed)
- [ ] Code refactored for quality (Refactor phase completed)
- [ ] Test coverage meets target ({coverage_target}%)
- [ ] All external dependencies properly mocked
- [ ] No features implemented without corresponding tests

### General DoD

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Ready for review

## Dev Agent Record

### Implementation Notes

_(Dev agent will document implementation decisions here)_

### TDD Cycle Log

_(Automatic tracking of Red-Green-Refactor progression)_

**Cycle 1:**

- Red Phase: {date} - {test count} failing tests written
- Green Phase: {date} - Implementation completed, all tests pass
- Refactor Phase: {date} - {refactoring summary}

### File List

_(Dev agent will list all files created/modified)_

- {file1}
- {file2}

### Test Execution Log

```bash
# Test runs will be logged here during development
```

## QA Results

_(QA agent will populate this during review)_

## Change Log

- **{date}**: Story created from TDD template
- **{date}**: {change description}

---

**TDD Status:** 🔴 RED | ⚫ Not Started
**Agent Assigned:** {agent_name}  
**Estimated Effort:** {hours} hours
