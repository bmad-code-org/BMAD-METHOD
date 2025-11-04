# Run Full Test Suite

This workflow runs the complete test suite for BMAD-METHOD, including linting, formatting checks, and any automated tests.

## Prerequisites

- Node.js v20+ installed
- Project dependencies installed (`npm install`)
- Clean working directory (optional, but recommended)

## Workflow Steps

### 1. Verify Environment

Check that you're in the project root and dependencies are installed:

```bash
pwd
ls package.json
```

If `node_modules` doesn't exist:

```bash
npm install
```

### 2. Check Git Status (Optional)

See current state before running tests:

```bash
git status
```

Consider committing or stashing changes before running tests to isolate failures.

### 3. Run Linting

Execute ESLint to check code quality:

```bash
npm run lint
```

**Expected Output**: No errors or warnings

**If errors occur**:
- Review the errors listed
- Many can be auto-fixed with: `npm run lint -- --fix`
- For remaining issues, manually fix the code
- Re-run lint to verify

### 4. Check Code Formatting

Run Prettier to verify code formatting:

```bash
npm run format:check
```

**Expected Output**: All files properly formatted

**If formatting issues occur**:
- Auto-fix with: `npm run format`
- This will reformat all files according to `.prettierrc`
- Review changes before committing

### 5. Run Unit Tests (If Available)

If unit tests are configured:

```bash
npm test
```

**Expected Output**: All tests passing

**If tests fail**:
- Review test output for failures
- Fix the failing code or tests
- Re-run tests to verify

### 6. Run Integration Tests (If Available)

If integration tests exist:

```bash
npm run test:integration
```

**Expected Output**: All integration tests passing

### 7. Build Project

Verify the project builds successfully:

```bash
npm run build
```

If no build script exists, this step can be skipped.

**Expected Output**: Successful build with no errors

**If build fails**:
- Review build errors
- Common issues:
  - Type errors (if using TypeScript)
  - Missing dependencies
  - Configuration issues
- Fix and rebuild

### 8. Test Installation (Optional)

Test the installation process in a clean environment:

```bash
# Create temporary test directory
mkdir -p /tmp/bmad-test
cd /tmp/bmad-test

# Test installation
npx /path/to/your/project/bmad-method@alpha install

# Verify installation worked
ls bmad/

# Cleanup
cd -
rm -rf /tmp/bmad-test
```

### 9. Manual Smoke Tests

Perform manual verification:

1. **Agent Activation**:
   - Load BMad Master agent in IDE
   - Verify greeting appears
   - Check menu displays correctly

2. **Config Loading**:
   - Verify `bmad/core/config.yaml` loads
   - Check variables populate correctly

3. **Workflow Execution**:
   - Test a simple workflow
   - Verify steps execute properly
   - Check output generation

4. **Customization**:
   - Test agent customization file
   - Verify override works correctly

### 10. Review Results

Create a test summary:

```markdown
## Test Results - [DATE]

### Linting
- [x] ESLint passed
- [ ] Issues found: [list]

### Formatting
- [x] Prettier passed
- [ ] Files need formatting: [list]

### Unit Tests
- [x] All tests passed (X/X)
- [ ] Failures: [list]

### Integration Tests
- [x] All tests passed (X/X)
- [ ] Failures: [list]

### Build
- [x] Build successful
- [ ] Build errors: [list]

### Manual Tests
- [x] Agent activation works
- [x] Config loading works
- [x] Workflows execute
- [x] Customization applies

### Overall Status
- [x] All tests passing - Ready for commit/release
- [ ] Issues to fix - See above
```

## Automated Test Script

Save this as `test-all.sh` for easy execution:

```bash
#!/bin/bash

echo "🧪 Running BMAD-METHOD Full Test Suite"
echo "========================================"

# Exit on first error
set -e

echo ""
echo "📋 Step 1: Linting..."
npm run lint

echo ""
echo "✨ Step 2: Format check..."
npm run format:check

echo ""
echo "🏗️  Step 3: Build..."
if npm run build 2>/dev/null; then
  echo "Build successful"
else
  echo "No build script (OK)"
fi

echo ""
echo "✅ All tests passed!"
echo ""
```

Make it executable:

```bash
chmod +x test-all.sh
```

Run with:

```bash
./test-all.sh
```

## Continuous Integration

For CI/CD pipelines, use this sequence:

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
```

## Pre-commit Hooks

BMAD-METHOD uses Husky for pre-commit hooks. These run automatically:

```bash
# Installed hooks
.husky/pre-commit
```

The pre-commit hook runs:
1. lint-staged (lints and formats only staged files)
2. Quick validation checks

If you need to skip hooks (not recommended):

```bash
git commit --no-verify -m "message"
```

## Troubleshooting

### Linting Failures

**Problem**: ESLint errors

**Solutions**:
1. Auto-fix: `npm run lint -- --fix`
2. Check specific file: `npx eslint path/to/file.js`
3. Review ESLint config: `eslint.config.mjs`

### Formatting Issues

**Problem**: Prettier finds issues

**Solutions**:
1. Auto-format: `npm run format`
2. Check specific file: `npx prettier --check path/to/file`
3. Review Prettier config: `prettier.config.mjs`

### Test Failures

**Problem**: Tests failing

**Solutions**:
1. Run single test: `npm test -- --grep "test name"`
2. Check test logs for details
3. Verify test environment setup
4. Check for dependency issues

### Build Errors

**Problem**: Build fails

**Solutions**:
1. Clean and reinstall: `rm -rf node_modules && npm install`
2. Check Node version: `node --version`
3. Review build configuration
4. Check for dependency conflicts

### Installation Test Fails

**Problem**: Test installation doesn't work

**Solutions**:
1. Check CLI tool code in `tools/cli/`
2. Verify bundler output
3. Test with verbose logging
4. Check file permissions

## Best Practices

1. **Run before committing**: Always run tests before git commit
2. **Fix immediately**: Don't accumulate test failures
3. **Clean state**: Test with clean working directory
4. **Document**: Note any skipped tests or known issues
5. **Automate**: Use pre-commit hooks and CI/CD
6. **Regular runs**: Run full suite daily during active development

## Resources

- [ESLint Configuration](./eslint.config.mjs)
- [Prettier Configuration](./prettier.config.mjs)
- [Package Scripts](./package.json)
- [Husky Hooks](./.husky/)

## Next Steps

After all tests pass:

- [ ] Commit changes
- [ ] Push to remote
- [ ] Create pull request (if applicable)
- [ ] Tag release (if ready)
- [ ] Deploy (if applicable)
