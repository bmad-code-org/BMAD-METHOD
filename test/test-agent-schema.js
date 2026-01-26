/**
 * Agent Schema Validation Test Runner
 *
 * Runs all test fixtures and verifies expected outcomes.
 * Reports pass/fail for each test and overall coverage statistics.
 *
 * Usage: node test/test-agent-schema.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const { validateAgentFile } = require('../tools/schema/agent.js');
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
 * @returns {{shouldPass: boolean, errorExpectation?: object, pathContext?: string}}
 */
function parseTestMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let shouldPass = true;
  let pathContext = null;
  const errorExpectation = {};

  for (const line of lines) {
    if (line.includes('Expected: PASS')) {
      shouldPass = true;
    } else if (line.includes('Expected: FAIL')) {
      shouldPass = false;
    }

    // Parse error metadata
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

    const minimumMatch = line.match(/^# Error minimum: (\d+)$/);
    if (minimumMatch) {
      errorExpectation.minimum = parseInt(minimumMatch[1], 10);
    }

    const expectedMatch = line.match(/^# Error expected: (.+)$/);
    if (expectedMatch) {
      errorExpectation.expected = expectedMatch[1].trim();
    }

    const receivedMatch = line.match(/^# Error received: (.+)$/);
    if (receivedMatch) {
      errorExpectation.received = receivedMatch[1].trim();
    }

    const keysMatch = line.match(/^# Error keys: \[(.+)\]$/);
    if (keysMatch) {
      errorExpectation.keys = keysMatch[1].split(',').map((k) => k.trim().replaceAll(/['"]/g, ''));
    }

    const contextMatch = line.match(/^# Path context: (.+)$/);
    if (contextMatch) {
      pathContext = contextMatch[1].trim();
    }
  }

  return {
    shouldPass,
    errorExpectation: Object.keys(errorExpectation).length > 0 ? errorExpectation : null,
    pathContext,
  };
}

/**
 * Convert dot-notation path string to array (handles array indices)
 * e.g., "agent.menu[0].trigger" => ["agent", "menu", 0, "trigger"]
 */
function parsePathString(pathString) {
  return pathString
    .replaceAll(/\[(\d+)\]/g, '.$1') // Convert [0] to .0
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
  // Check error code
  if (expectation.code && error.code !== expectation.code) {
    return { valid: false, reason: `Expected code "${expectation.code}", got "${error.code}"` };
  }

  // Check error path
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

  // For custom errors, strictly check message
  if (expectation.code === 'custom' && expectation.message && error.message !== expectation.message) {
    return {
      valid: false,
      reason: `Expected message "${expectation.message}", got "${error.message}"`,
    };
  }

  // For Zod errors, check type-specific fields
  if (expectation.minimum !== undefined && error.minimum !== expectation.minimum) {
    return { valid: false, reason: `Expected minimum ${expectation.minimum}, got ${error.minimum}` };
  }

  if (expectation.expected && error.expected !== expectation.expected) {
    return { valid: false, reason: `Expected type "${expectation.expected}", got "${error.expected}"` };
  }

  if (expectation.received && error.received !== expectation.received) {
    return { valid: false, reason: `Expected received "${expectation.received}", got "${error.received}"` };
  }

  if (expectation.keys) {
    const expectedKeys = expectation.keys.sort();
    const actualKeys = (error.keys || []).sort();
    if (JSON.stringify(expectedKeys) !== JSON.stringify(actualKeys)) {
      return {
        valid: false,
        reason: `Expected keys ${JSON.stringify(expectedKeys)}, got ${JSON.stringify(actualKeys)}`,
      };
    }
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
  const { shouldPass, errorExpectation, pathContext } = metadata;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let agentData;

    try {
      agentData = yaml.parse(fileContent);
    } catch (parseError) {
      // YAML parse error
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

    // Determine validation path
    // If pathContext is specified in comments, use it; otherwise derive from fixture location
    let validationPath = pathContext;
    if (!validationPath) {
      // Map fixture location to simulated src/ path
      const relativePath = path.relative(path.join(__dirname, 'fixtures/agent-schema'), filePath);
      const parts = relativePath.split(path.sep);

      if (parts.includes('metadata') && parts[0] === 'valid') {
        // Valid metadata tests: check if filename suggests module or core
        const filename = path.basename(filePath);
        if (filename.includes('module')) {
          validationPath = 'src/bmm/agents/test.agent.yaml';
        } else {
          validationPath = 'src/core/agents/test.agent.yaml';
        }
      } else if (parts.includes('metadata') && parts[0] === 'invalid') {
        // Invalid metadata tests: derive from filename
        const filename = path.basename(filePath);
        if (filename.includes('module') || filename.includes('wrong-module')) {
          validationPath = 'src/bmm/agents/test.agent.yaml';
        } else if (filename.includes('core')) {
          validationPath = 'src/core/agents/test.agent.yaml';
        } else {
          validationPath = 'src/core/agents/test.agent.yaml';
        }
      } else {
        // Default to core agent path
        validationPath = 'src/core/agents/test.agent.yaml';
      }
    }

    const result = validateAgentFile(validationPath, agentData);

    if (result.success && shouldPass) {
      return {
        passed: true,
        message: 'Validation passed as expected',
      };
    }

    if (!result.success && !shouldPass) {
      const actualError = result.error.issues[0];

      // If we have error expectations, validate strictly
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

      // No specific expectations - just check that it failed
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
  console.log(`${colors.cyan}║  Agent Schema Validation Test Suite                      ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Find all test fixtures
  const testFiles = await glob('test/fixtures/agent-schema/**/*.agent.yaml', {
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
    const relativePath = path.relative(path.join(__dirname, 'fixtures/agent-schema'), testFile);
    const parts = relativePath.split(path.sep);
    const validInvalid = parts[0]; // 'valid' or 'invalid'
    const category = parts[1]; // 'top-level', 'metadata', etc.

    const categoryKey = `${validInvalid}/${category}`;
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
    const [validInvalid, category] = categoryKey.split('/');
    const categoryLabel = category.replaceAll('-', ' ').toUpperCase();
    const validLabel = validInvalid === 'valid' ? '✅' : '❌';

    console.log(`${colors.blue}${validLabel} ${categoryLabel} (${validInvalid})${colors.reset}`);

    for (const testFile of files) {
      totalTests++;
      const testName = path.basename(testFile, '.agent.yaml');
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

  // Report failures
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

// Run
main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
