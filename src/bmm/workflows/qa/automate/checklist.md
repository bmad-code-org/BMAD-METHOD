# Quinn Automate - Validation Checklist

## Test Generation

- [ ] API tests generated (if applicable)
- [ ] E2E tests generated (if UI exists)
- [ ] Tests use standard test framework APIs
- [ ] Tests cover happy path
- [ ] Tests cover 1-2 critical error cases

## Requirements Traceability (All Tracks)

- [ ] Each acceptance criterion has at least one test
- [ ] Each FR has at least one test scenario defined
- [ ] Test descriptions reference the FR or acceptance criterion they verify

## Test Quality

- [ ] All generated tests run successfully
- [ ] Tests use proper locators (semantic, accessible)
- [ ] Tests have clear descriptions
- [ ] No hardcoded waits or sleeps
- [ ] Tests are independent (no order dependency)

## Output

- [ ] Test summary created
- [ ] Tests saved to appropriate directories
- [ ] Summary includes coverage metrics

## Validation

Run the tests using your project's test command.

**Expected**: All tests pass ✅

---

## Enterprise Track: TEA Module Integration

**When the TEA (Test Architecture Enterprise) module is installed, verify these additional items:**

### TEA Workflow Completion

- [ ] TEA TD (Test Design) has been run and test strategy document exists
- [ ] TEA TR (Traceability) has been run and test-requirement traceability matrix exists
- [ ] TEA NR (NFR Assessment) has been run if NFRs are present in the PRD
- [ ] TEA gate decision has been obtained (PASS / CONCERNS / FAIL)

### TEA Quality Gate

- [ ] TEA quality gate result is PASS or CONCERNS (FAIL blocks progression)
- [ ] If CONCERNS: issues documented and accepted by stakeholders
- [ ] RTM test columns populated from TEA TR output
- [ ] No orphan tests exist (every test traces to a requirement)

### Enterprise Test Metrics (from TEA outputs)

- [ ] Test coverage by requirement documented (from TEA TR)
- [ ] Test coverage by risk level P0-P3 documented (from TEA TD)
- [ ] NFR compliance status documented (from TEA NR)
- [ ] Full traceability chain verified: Test → Story → FR → SyRS → StRS

---

**Need more comprehensive testing?** Install [Test Architect (TEA)](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/) for advanced workflows.
