<!-- Powered by BMAD™ Core -->

# Setup Testing Framework Task

## Purpose

To initialize and configure a comprehensive testing framework setup for the project, including E2E testing, API testing, performance testing, and visual regression testing. This task sets up the testing infrastructure with industry best practices and CI/CD integration.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Analyze Current Project Structure

- Examine the project's package.json to understand the technology stack
- Check existing testing setup (if any)
- Identify the project type (React, Vue, Node.js, etc.)
- Document current dependencies and scripts

### 2. Ask User for Testing Framework Preferences

```
I'll help you set up a comprehensive testing framework. Please answer these questions:

🧪 E2E Testing Framework:
1. Playwright (recommended - fast, reliable, multi-browser)
2. Cypress (excellent DX, Chrome-focused)
3. Selenium (maximum browser compatibility)
4. WebdriverIO (flexible, enterprise-ready)

🌐 API Testing Tool:
1. Bruno (Git-friendly, version controlled)
2. Postman + Newman (industry standard)
3. REST Client (VS Code integrated)
4. Custom fetch/axios tests

⚡ Performance Testing:
1. k6 (JavaScript-based, developer-friendly)
2. Artillery (Node.js, great for CI/CD)
3. Locust (Python-based)
4. JMeter (comprehensive but heavy)

👁️ Visual Regression:
1. BackstopJS (mature, reliable)
2. Playwright visual comparisons
3. Chromatic (Storybook integration)
4. Skip visual testing for now

🔒 Security Testing:
1. OWASP ZAP (comprehensive security scanning)
2. Snyk (dependency vulnerability scanning)
3. npm audit (basic dependency scanning)
4. Skip security testing for now

Please provide your preferences for each category:
```

### 3. Create Testing Directory Structure

Based on user preferences, create appropriate directory structure:

```
tests/
├── e2e/                    # End-to-end tests
├── api/                    # API tests
├── performance/            # Performance tests
├── visual/                 # Visual regression tests
├── security/               # Security tests
├── fixtures/               # Test data and fixtures
├── utils/                  # Testing utilities
└── config/                 # Test configurations

test-reports/
├── e2e/                    # E2E test reports
├── api/                    # API test reports
├── performance/            # Performance test reports
├── visual/                 # Visual test reports
└── coverage/               # Code coverage reports
```

### 4. Install and Configure E2E Testing Framework

#### For Playwright:
- Install Playwright and browsers
- Create `playwright.config.js` with optimized settings
- Set up multiple test environments (dev, staging, prod)
- Configure parallel execution and retries
- Set up HTML reports and trace viewing

#### For Cypress:
- Install Cypress with TypeScript support
- Create `cypress.config.js`
- Set up custom commands and utilities
- Configure dashboard integration
- Set up component and E2E testing

### 5. Install and Configure API Testing

#### For Bruno:
- Install Bruno CLI
- Create API collection structure
- Set up environment variables
- Create authentication flows
- Configure request/response validation

#### For Postman + Newman:
- Set up Newman for CI/CD
- Export/import collection templates
- Configure environment management
- Set up automated API testing

### 6. Install and Configure Performance Testing

#### For k6:
- Install k6
- Create performance test templates
- Set up metrics collection
- Configure thresholds and SLAs
- Create HTML reports

#### For Artillery:
- Install Artillery
- Create load testing scenarios
- Set up metrics and monitoring
- Configure CI/CD integration

### 7. Install and Configure Visual Regression Testing

#### For BackstopJS:
- Install BackstopJS
- Create backstop.json configuration
- Set up reference scenarios
- Configure viewports and browsers
- Set up CI/CD integration

### 8. Install and Configure Security Testing

#### For OWASP ZAP:
- Create ZAP configuration
- Set up automated scanning
- Configure security policies
- Set up vulnerability reporting

### 9. Create Package.json Scripts

Add comprehensive test scripts:

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:api": "bruno run tests/api/",
    "test:performance": "k6 run tests/performance/load-test.js",
    "test:visual": "backstop test",
    "test:visual:approve": "backstop approve",
    "test:security": "zap-cli quick-scan",
    "test:all": "npm run test:unit && npm run test:e2e && npm run test:api && npm run test:performance",
    "test:ci": "npm run test:unit && npm run test:e2e -- --reporter=junit",
    "test:smoke": "npm run test:e2e -- --grep @smoke",
    "test:regression": "npm run test:visual && npm run test:e2e -- --grep @regression",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "test:coverage": "jest --coverage --coverageReporters=lcov",
    "test:watch": "jest --watch"
  }
}
```

### 10. Create CI/CD Integration Files

#### GitHub Actions Workflow:
```yaml
# .github/workflows/test.yml
name: Comprehensive Testing
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Run API tests
        run: npm run test:api
      - name: Upload test results
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-reports/
```

### 11. Create Configuration Files

Generate framework-specific configuration files with best practices:
- Test environment variables
- Browser configurations
- Retry strategies
- Timeout settings
- Report configurations

### 12. Create Testing Utilities and Helpers

Create common utilities:
- Authentication helpers
- Test data generators
- API client wrappers
- Page object models (for E2E)
- Custom assertions

### 13. Create Documentation

Generate comprehensive documentation:
- Testing strategy overview
- Framework-specific guides
- How to write new tests
- Running tests locally
- CI/CD integration
- Troubleshooting guide

### 14. Create Sample Tests

Generate example tests for each testing type:
- Sample E2E test with best practices
- Sample API test with authentication
- Sample performance test scenario
- Sample visual regression test

### 15. Quality Gates Configuration

Set up quality gates and thresholds:
- Code coverage requirements
- Performance benchmarks
- Visual diff tolerances
- Security scan thresholds

## Output Summary

Provide user with:
- Complete setup summary
- Next steps for writing tests
- Commands for running different test types
- Links to documentation
- Integration instructions for CI/CD

```
✅ Testing Framework Setup Complete!

🏗️ Infrastructure Created:
- E2E Testing: {selected-framework} configured
- API Testing: {selected-tool} ready
- Performance Testing: {selected-tool} installed
- Visual Testing: {selected-tool} configured
- Security Testing: {selected-tool} ready

📁 Directory Structure:
- tests/ folder with organized test types
- test-reports/ for all test outputs
- Configuration files created

🚀 Ready to Use:
- npm run test:e2e - Run E2E tests
- npm run test:api - Run API tests
- npm run test:performance - Run load tests
- npm run test:all - Run comprehensive test suite

📚 Documentation:
- tests/README.md - Complete testing guide
- Individual framework guides created
- CI/CD integration configured

Next: Start writing tests using the sample templates!
```