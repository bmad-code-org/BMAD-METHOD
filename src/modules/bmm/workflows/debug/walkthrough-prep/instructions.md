# walkthrough-prep

Generate comprehensive materials for code walkthrough sessions.

## Context

This task prepares all necessary documentation, checklists, and presentation materials for conducting effective code walkthroughs. It ensures reviewers have everything needed to provide valuable feedback while minimizing meeting time.

## Task Execution

### Phase 1: Scope Analysis

#### Determine Walkthrough Type

1. **Feature Walkthrough**: New functionality
2. **Bug Fix Walkthrough**: Defect resolution
3. **Refactoring Walkthrough**: Code improvement
4. **Architecture Walkthrough**: Design decisions
5. **Security Walkthrough**: Security-focused review

#### Identify Key Components

1. Changed files and their purposes
2. Dependencies affected
3. Test coverage added/modified
4. Documentation updates
5. Configuration changes

### Phase 2: Material Generation

#### 1. Executive Summary

Create high-level overview:

- Purpose and goals
- Business value/impact
- Technical approach
- Key decisions made
- Risks and mitigations

#### 2. Technical Overview

**Architecture Diagram:**

```
[Component A] → [Component B] → [Component C]
     ↓              ↓              ↓
[Database]    [External API]   [Cache]
```

**Data Flow:**

```
1. User Input → Validation
2. Validation → Processing
3. Processing → Storage
4. Storage → Response
```

**Sequence Diagram:**

```
User → Frontend: Request
Frontend → Backend: API Call
Backend → Database: Query
Database → Backend: Results
Backend → Frontend: Response
Frontend → User: Display
```

#### 3. Code Change Summary

**Statistics:**

- Files changed: [count]
- Lines added: [count]
- Lines removed: [count]
- Test coverage: [before]% → [after]%
- Complexity change: [delta]

**Change Categories:**

- New features: [list]
- Modifications: [list]
- Deletions: [list]
- Refactoring: [list]

### Phase 3: Review Checklist Generation

#### Core Review Areas

**Functionality Checklist:**

- [ ] Requirements met
- [ ] Edge cases handled
- [ ] Error handling complete
- [ ] Performance acceptable
- [ ] Backwards compatibility maintained

**Code Quality Checklist:**

- [ ] Naming conventions followed
- [ ] DRY principle applied
- [ ] SOLID principles followed
- [ ] Comments appropriate
- [ ] No code smells

**Testing Checklist:**

- [ ] Unit tests added
- [ ] Integration tests updated
- [ ] Edge cases tested
- [ ] Performance tested
- [ ] Regression tests pass

**Security Checklist:**

- [ ] Input validation implemented
- [ ] Authentication checked
- [ ] Authorization verified
- [ ] Data sanitized
- [ ] Secrets not exposed

**Documentation Checklist:**

- [ ] Code comments updated
- [ ] README updated
- [ ] API docs updated
- [ ] Changelog updated
- [ ] Deployment docs updated

### Phase 4: Presentation Structure

#### Slide/Section Outline

**1. Introduction (2 min)**

- Problem statement
- Solution overview
- Success criteria

**2. Technical Approach (5 min)**

- Architecture decisions
- Implementation choices
- Trade-offs made

**3. Code Walkthrough (15 min)**

- Key components tour
- Critical logic explanation
- Integration points

**4. Testing Strategy (3 min)**

- Test coverage
- Test scenarios
- Performance results

**5. Discussion (5 min)**

- Open questions
- Concerns
- Suggestions

### Phase 5: Supporting Documentation

#### Code Snippets

Extract and annotate key code sections:

```[language]
// BEFORE: Original implementation
[original code]

// AFTER: New implementation
[new code]

// KEY CHANGES:
// 1. [Change 1 explanation]
// 2. [Change 2 explanation]
```

#### Test Cases

Document critical test scenarios:

```[language]
// Test Case 1: [Description]
// Input: [test input]
// Expected: [expected output]
// Covers: [what it validates]
```

#### Performance Metrics

If applicable:

- Execution time: [before] → [after]
- Memory usage: [before] → [after]
- Database queries: [before] → [after]

## Output Format

````markdown
# Code Walkthrough Package: [Feature/Fix Name]

## Quick Reference

**Date:** [scheduled date]
**Duration:** [estimated time]
**Presenter:** [name]
**Reviewers:** [list]
**Repository:** [link]
**Branch/PR:** [link]

## Executive Summary

[2-3 paragraph overview]

## Agenda

1. Introduction (2 min)
2. Technical Overview (5 min)
3. Code Walkthrough (15 min)
4. Testing & Validation (3 min)
5. Q&A (5 min)

## Pre-Review Checklist

**For Reviewers - Complete Before Meeting:**

- [ ] Read executive summary
- [ ] Review changed files list
- [ ] Note initial questions
- [ ] Check test results

## Technical Overview

### Architecture

[Include diagrams]

### Key Changes

| Component | Type          | Description    | Risk           |
| --------- | ------------- | -------------- | -------------- |
| [name]    | [New/Mod/Del] | [what changed] | [Low/Med/High] |

### Dependencies

**Added:** [list]
**Modified:** [list]
**Removed:** [list]

## Code Highlights

### Critical Section 1: [Name]

**File:** [path]
**Purpose:** [why this is important]

```[language]
[annotated code snippet]
```
````

**Discussion Points:**

- [Question or concern]
- [Alternative considered]

### Critical Section 2: [Name]

[Similar format]

## Testing Summary

### Coverage

- Unit Tests: [count] tests, [%] coverage
- Integration Tests: [count] tests
- Manual Testing: [checklist items]

### Key Test Scenarios

1. [Scenario]: [Result]
2. [Scenario]: [Result]

## Review Checklist

### Must Review

- [ ] [Critical file/function]
- [ ] [Security-sensitive code]
- [ ] [Performance-critical section]

### Should Review

- [ ] [Important logic]
- [ ] [API changes]
- [ ] [Database changes]

### Nice to Review

- [ ] [Refactoring]
- [ ] [Documentation]
- [ ] [Tests]

## Known Issues & Decisions

### Open Questions

1. [Question needing group input]
2. [Design decision to validate]

### Technical Debt

- [Debt item]: [Planned resolution]

### Future Improvements

- [Improvement]: [Timeline]

## Post-Review Action Items

**To be filled during review:**

- [ ] Action: [description] - Owner: [name]
- [ ] Action: [description] - Owner: [name]

## Appendix

### A. Full File List

[Complete list of changed files]

### B. Test Results

[Test execution summary]

### C. Performance Benchmarks

[If applicable]

### D. Related Documentation

- [Design Doc]: [link]
- [Requirements]: [link]
- [Previous Reviews]: [link]

```

## Completion Criteria
- [ ] Scope analyzed
- [ ] Executive summary written
- [ ] Technical overview created
- [ ] Code highlights selected
- [ ] Review checklist generated
- [ ] Presentation structure defined
- [ ] Supporting docs prepared
- [ ] Package formatted for distribution
```
