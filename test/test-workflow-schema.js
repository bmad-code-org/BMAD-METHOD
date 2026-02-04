/**
 * Workflow Schema Validation Test Runner
 *
 * Runs all test fixtures and verifies expected outcomes.
 * Reports pass/fail for each test and overall coverage statistics.
 *
 * Usage: node test/test-workflow-schema.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const { validateWorkflowFile } = require('../tools/schema/workflow.js');
const { glob } = require('glob');

// ANSI color codes
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

/**
 * Parse test metadata from YAML comments
 * @param {string} filePath
 * @returns {{shouldPass: boolean, errorExpectation?: object}}
 */
function parseTestMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let shouldPass = true;
  const errorExpectation = {};

  for (const line of lines) {
    if (line.includes('Expected: PASS')) {
      shouldPass = true;
    } else if (line.includes('Expected: FAIL')) {
      shouldPass = false;
    }

    const codeMatch = line.match(/^# Error code: (.+)$/);
    if (codeMatch) {
      errorExpectation.code = codeMatch[1].trim();
    }

    const pathMatch = line.match(/^# Error path: (.+)$/);
    if (pathMatch) {
      errorExpectation.path = pathMatch[1].trim();
    }

    const messageMatch = line.match(/^# Error message: (.+)$/);
    if (messageMatch) {
      errorExpectation.message = messageMatch[1].trim();
    }

    const expectedMatch = line.match(/^# Error expected: (.+)$/);
    if (expectedMatch) {
      errorExpectation.expected = expectedMatch[1].trim();
    }

    const receivedMatch = line.match(/^# Error received: (.+)$/);
    if (receivedMatch) {
      errorExpectation.received = receivedMatch[1].trim();
    }
  }

  return {
    shouldPass,
    errorExpectation: Object.keys(errorExpectation).length > 0 ? errorExpectation : null,
  };
}

/**
 * Convert dot-notation path string to array (handles array indices)
 * e.g., "input_file_patterns.epics.load_strategy" => ["input_file_patterns", "epics", "load_strategy"]
 */
function parsePathString(pathString) {
  return pathString
    .replaceAll(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((part) => {
      const num = parseInt(part, 10);
      return isNaN(num) ? part : num;
    });
}

/**
 * Validate error against expectations
 * @param {object} error - Zod error issue
 * @param {object} expectation - Expected error structure
 * @returns {{valid: boolean, reason?: string}}
 */
function validateError(error, expectation) {
  if (expectation.code && error.code !== expectation.code) {
    return { valid: false, reason: `Expected code "${expectation.code}", got "${error.code}"` };
  }

  if (expectation.path) {
    const expectedPath = parsePathString(expectation.path);
    const actualPath = error.path;

    if (JSON.stringify(expectedPath) !== JSON.stringify(actualPath)) {
      return {
        valid: false,
        reason: `Expected path ${JSON.stringify(expectedPath)}, got ${JSON.stringify(actualPath)}`,
      };
    }
  }

  if (expectation.code === 'custom' && expectation.message && error.message !== expectation.message) {
    return {
      valid: false,
      reason: `Expected message "${expectation.message}", got "${error.message}"`,
    };
  }

  if (expectation.expected && error.expected !== expectation.expected) {
    return { valid: false, reason: `Expected type "${expectation.expected}", got "${error.expected}"` };
  }

  if (expectation.received && error.received !== expectation.received) {
    return { valid: false, reason: `Expected received "${expectation.received}", got "${error.received}"` };
  }

  return { valid: true };
}

/**
 * Run a single test case
 * @param {string} filePath
 * @returns {{passed: boolean, message: string}}
 */
function runTest(filePath) {
  const metadata = parseTestMetadata(filePath);
  const { shouldPass, errorExpectation } = metadata;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let workflowData;

    try {
      workflowData = yaml.parse(fileContent);
    } catch (parseError) {
      if (shouldPass) {
        return {
          passed: false,
          message: `Expected PASS but got YAML parse error: ${parseError.message}`,
        };
      }
      return {
        passed: true,
        message: 'Got expected YAML parse error',
      };
    }

    const result = validateWorkflowFile(filePath, workflowData);

    if (result.success && shouldPass) {
      return {
        passed: true,
        message: 'Validation passed as expected',
      };
    }

    if (!result.success && !shouldPass) {
      const actualError = result.error.issues[0];

      if (errorExpectation) {
        const validation = validateError(actualError, errorExpectation);

        if (!validation.valid) {
          return {
            passed: false,
            message: `Error validation failed: ${validation.reason}`,
          };
        }

        return {
          passed: true,
          message: `Got expected error (${errorExpectation.code}): ${actualError.message}`,
        };
      }

      return {
        passed: true,
        message: `Got expected validation error: ${actualError?.message}`,
      };
    }

    if (result.success && !shouldPass) {
      return {
        passed: false,
        message: 'Expected validation to FAIL but it PASSED',
      };
    }

    if (!result.success && shouldPass) {
      return {
        passed: false,
        message: `Expected validation to PASS but it FAILED: ${result.error.issues[0]?.message}`,
      };
    }

    return {
      passed: false,
      message: 'Unexpected test state',
    };
  } catch (error) {
    return {
      passed: false,
      message: `Test execution error: ${error.message}`,
    };
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Workflow Schema Validation Test Suite                    ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const testFiles = await glob('test/fixtures/workflow-schema/**/*.workflow.yaml', {
    cwd: path.join(__dirname, '..'),
    absolute: true,
  });

  if (testFiles.length === 0) {
    console.log(`${colors.yellow}⚠️  No test fixtures found${colors.reset}`);
    process.exit(0);
  }

  console.log(`Found ${colors.cyan}${testFiles.length}${colors.reset} test fixture(s)\n`);

  // Group tests by category
  const categories = {};
  for (const testFile of testFiles) {
    const relativePath = path.relative(path.join(__dirname, 'fixtures/workflow-schema'), testFile);
    const parts = relativePath.split(path.sep);
    const validInvalid = parts[0];
    const categoryKey = validInvalid;

    if (!categories[categoryKey]) {
      categories[categoryKey] = [];
    }
    categories[categoryKey].push(testFile);
  }

  // Run tests by category
  let totalTests = 0;
  let passedTests = 0;
  const failures = [];

  for (const [categoryKey, files] of Object.entries(categories).sort()) {
    const validLabel = categoryKey === 'valid' ? '✅' : '❌';

    console.log(`${colors.blue}${validLabel} ${categoryKey.toUpperCase()} FIXTURES${colors.reset}`);

    for (const testFile of files.sort()) {
      totalTests++;
      const testName = path.basename(testFile, '.workflow.yaml');
      const result = runTest(testFile);

      if (result.passed) {
        passedTests++;
        console.log(`  ${colors.green}✓${colors.reset} ${testName} ${colors.dim}${result.message}${colors.reset}`);
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${testName} ${colors.red}${result.message}${colors.reset}`);
        failures.push({
          file: path.relative(process.cwd(), testFile),
          message: result.message,
        });
      }
    }
    console.log('');
  }

  // Summary
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}Test Results:${colors.reset}`);
  console.log(`  Total:  ${totalTests}`);
  console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
  console.log(`  Failed: ${passedTests === totalTests ? colors.green : colors.red}${totalTests - passedTests}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  if (failures.length > 0) {
    console.log(`${colors.red}❌ FAILED TESTS:${colors.reset}\n`);
    for (const failure of failures) {
      console.log(`${colors.red}✗${colors.reset} ${failure.file}`);
      console.log(`  ${failure.message}\n`);
    }
    process.exit(1);
  }

  console.log(`${colors.green}✨ All tests passed!${colors.reset}\n`);
  process.exit(0);
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
