# Quinn Quick Automate - Validation Checklist

## Test Generation

- [ ] API tests generated (if applicable)
- [ ] E2E tests generated (if UI exists)
- [ ] Tests use standard Playwright APIs
- [ ] Tests cover happy path
- [ ] Tests cover 1-2 critical error cases

## Test Quality

- [ ] All generated tests run successfully
- [ ] Tests use proper locators (getByRole, getByText, getByLabel)
- [ ] Tests have clear descriptions
- [ ] No hardcoded waits or sleeps
- [ ] Tests are independent (no order dependency)

## Output

- [ ] Test summary created
- [ ] Tests saved to appropriate directories
- [ ] Summary includes coverage metrics

## Validation

Run the tests:

```bash
npx playwright test
```

**Expected**: All tests pass ✅

---

**Need more comprehensive testing?** Install [Test Architect (TEA)](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/) for advanced workflows.
