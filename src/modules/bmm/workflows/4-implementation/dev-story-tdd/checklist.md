# TDD Dev Story Implementation Checklist

## Pre-Implementation

- [ ] Story is in "Approved" status
- [ ] Story Context JSON/XML is available
- [ ] Test framework is configured and working
- [ ] Development environment is ready
- [ ] RVTM is initialized (if using traceability)

## Story Loading

- [ ] Story markdown file loaded completely
- [ ] Story status verified as "Approved"
- [ ] Story Context loaded and pinned as authoritative
- [ ] Acceptance criteria extracted
- [ ] Tasks identified and ordered

## For Each Task/AC

### RED Phase

- [ ] Test written BEFORE implementation
- [ ] Test describes expected behavior clearly
- [ ] Test fails for the right reason
- [ ] Test registered with RVTM (if enabled)
- [ ] RED state confirmed with test execution

### GREEN Phase

- [ ] Minimal implementation written
- [ ] Only enough code to pass the test
- [ ] All tests now passing
- [ ] No existing tests broken
- [ ] Implementation linked to requirement

### REFACTOR Phase

- [ ] Code reviewed for improvement opportunities
- [ ] Duplication removed (DRY)
- [ ] SOLID principles applied
- [ ] Tests remain GREEN after each change
- [ ] Refactoring committed separately

## Validation

- [ ] All acceptance criteria have tests
- [ ] All tests are passing
- [ ] Code coverage meets standards (80%+)
- [ ] No commented-out code remains
- [ ] No TODO comments without tickets

## RVTM Traceability

- [ ] All requirements linked to tests
- [ ] All tests linked to implementation
- [ ] Test status accurately reflected
- [ ] Coverage metrics updated
- [ ] Traceability matrix complete

## Story Completion

- [ ] Story implementation status updated
- [ ] Test count documented
- [ ] Coverage percentage recorded
- [ ] Any remaining work noted
- [ ] Story marked "Ready for Review"

## Code Quality

- [ ] Tests are readable and maintainable
- [ ] Test names describe behavior
- [ ] Production code is clean
- [ ] No hardcoded values
- [ ] Error handling implemented

## Documentation

- [ ] Complex logic has comments
- [ ] API changes documented
- [ ] README updated if needed
- [ ] Change log entry added
- [ ] Test documentation complete

## Final Checks

- [ ] All TDD cycles completed
- [ ] No failing tests
- [ ] CI/CD pipeline passing
- [ ] Code review requested
- [ ] Story ready for QA
