# How to Run Tests - Issue #477

## Quick Start

All tests are located in the `test/` directory and use Jest as the test runner.

### Run All Tests

```bash
npm test
```

### Run Unit Tests Only

```bash
npm test -- test/unit/ --verbose
```

### Run Integration Tests Only

```bash
npm test -- test/integration/ --verbose
```

### Run Specific Test File

```bash
npm test -- test/unit/config-loader.test.js --verbose
npm test -- test/unit/manifest-validation.test.js --verbose
npm test -- test/unit/install-mode-detection.test.js --verbose
npm test -- test/unit/prompt-skipping.test.js --verbose
npm test -- test/integration/install-config-loading.test.js --verbose
npm test -- test/integration/questions-skipped-on-update.test.js --verbose
npm test -- test/integration/invalid-manifest-fallback.test.js --verbose
npm test -- test/integration/backward-compatibility.test.js --verbose
```

## Test Coverage

### Generate Coverage Report

```bash
npm test -- --coverage
```

### View Coverage Report

```bash
# After running coverage, open HTML report
npm test -- --coverage
# Check coverage/index.html in browser
```

## Verbose Output

### Run Tests with Detailed Output

```bash
npm test -- --verbose
npm test -- --verbose --no-coverage
```

### Show Logs During Tests

```bash
npm test -- --verbose --no-coverage --verbose
```

## Watch Mode (Development)

### Run Tests in Watch Mode

```bash
npm test -- --watch
npm test -- --watch --no-coverage
```

### Watch Specific Test File

```bash
npm test -- test/unit/config-loader.test.js --watch
```

## Debug Mode

### Run Tests with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand test/unit/config-loader.test.js
```

Then open `chrome://inspect` in Chrome DevTools

### Run Single Test with Debugging

```bash
node --inspect-brk node_modules/.bin/jest --testNamePattern="should load a valid manifest file" test/unit/config-loader.test.js
```

## Test Results Interpretation

### Successful Run

```
PASS  test/unit/config-loader.test.js
  ManifestConfigLoader
    loadManifest
      ✓ should load a valid manifest file (45 ms)
      ✓ should return empty config for missing manifest (12 ms)
      ✓ should throw error for corrupted YAML (8 ms)
      ...

PASS  test/unit/manifest-validation.test.js
  Manifest Validation
    validateManifest
      ✓ should validate complete valid manifest (3 ms)
      ✓ should reject manifest missing "version" (2 ms)
      ...

Test Suites: 8 passed, 8 total
Tests:       70+ passed, 70+ total
```

### Failed Test

```
FAIL  test/unit/config-loader.test.js
  ManifestConfigLoader
    loadManifest
      ✗ should load a valid manifest file
        Error: Expected manifest to be defined
        at Object.<anonymous> (test/unit/config-loader.test.js:45:12)
```

## CI/CD Integration

### Pre-commit Hook

```bash
npm test -- test/unit/ --coverage
```

### Pre-push Verification

```bash
npm test -- --coverage --watchAll=false
```

### GitHub Actions

```yaml
- name: Run Tests
  run: npm test -- --coverage --watchAll=false

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Common Issues and Solutions

### Tests Timeout

```bash
# Increase timeout
npm test -- --testTimeout=10000
```

### Module Not Found

```bash
# Reinstall dependencies
npm install
npm test
```

### Port Already in Use

```bash
# Kill process using port
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F
```

### Clear Cache

```bash
npm test -- --clearCache
```

### Force Fresh Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

## Test Statistics

```bash
# Count test cases
npm test -- --listTests | xargs grep -h "it(" | wc -l

# List all test names
npm test -- --verbose 2>&1 | grep "✓\|✕"

# Show slowest tests
npm test -- --verbose --detectOpenHandles
```

## Performance Optimization

### Parallel Testing (default)

```bash
npm test
```

### Sequential Testing

```bash
npm test -- --runInBand
```

### Specific Workers

```bash
npm test -- --maxWorkers=4
```

## Integration with IDE

### VS Code

```json
{
  "jest.rootPath": ".",
  "jest.runMode": "on-demand",
  "jest.showCoverageOnLoad": false
}
```

### IntelliJ IDEA / WebStorm

- Go to Settings → Languages & Frameworks → JavaScript → Tests → Jest
- Enable Jest
- Configure test root path

## Continuous Monitoring

### Watch Tests While Developing

```bash
npm test -- --watch --verbose --no-coverage
```

### Monitor Specific Test

```bash
npm test -- test/unit/config-loader.test.js --watch
```

## Test Documentation

For detailed information about each test:

- See: `TEST-SPECIFICATIONS.md` - Detailed test specifications
- See: `TEST-IMPLEMENTATION-SUMMARY.md` - Test summary and coverage

## Next Steps

1. ✅ Run all tests to verify they pass
2. Implement configuration loader code
3. Implement update detection code
4. Run tests to verify implementation
5. Check coverage report
6. Commit with passing tests
7. Push to CI/CD pipeline

## Test Maintenance

### Update Tests

When you modify the code implementation:

1. Run tests to see which fail
2. Update tests to match new implementation
3. Run tests again to verify
4. Commit tests with code changes

### Add New Tests

When adding new features:

1. Create test first (TDD approach)
2. Implement code to pass test
3. Run tests to verify
4. Commit with passing tests

## Support

For test issues or questions:

1. Check test output for error messages
2. Review TEST-SPECIFICATIONS.md
3. Review specific test file
4. Check git history for similar patterns
5. Debug using VS Code or Chrome DevTools
