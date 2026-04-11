/**
 * RegistryClient Tests
 *
 * Tests the GitHub API cascade logic in RegistryClient:
 * - fetchGitHubFile tries API first, falls back to raw CDN
 * - fetchGitHubYaml/Json parse correctly
 * - Error propagation when both endpoints fail
 *
 * Uses monkey-patching to intercept HTTP calls without external dependencies.
 * Usage: node test/test-registry-client.js
 */

const { RegistryClient } = require('../tools/installer/modules/registry-client');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

// ─── Test Helpers ──────────────────────────────────────────────────────────

/**
 * Create a RegistryClient with stubbed fetch methods for testing cascade logic.
 * @param {Object} opts
 * @param {string|Error} opts.apiResult - Return value or Error to throw for API call
 * @param {string|Error} opts.rawResult - Return value or Error to throw for raw CDN call
 * @returns {{ client: RegistryClient, calls: string[] }}
 */
function createStubbedClient({ apiResult, rawResult }) {
  const client = new RegistryClient();
  const calls = [];

  // Stub _fetchWithHeaders (GitHub API path)
  client._fetchWithHeaders = async (url) => {
    calls.push(`api:${url}`);
    if (apiResult instanceof Error) throw apiResult;
    return apiResult;
  };

  // Stub fetch (raw CDN path)
  const originalFetch = client.fetch.bind(client);
  client.fetch = async (url, timeout) => {
    // Only intercept raw.githubusercontent.com calls
    if (url.includes('raw.githubusercontent.com')) {
      calls.push(`raw:${url}`);
      if (rawResult instanceof Error) throw rawResult;
      return rawResult;
    }
    return originalFetch(url, timeout);
  };

  return { client, calls };
}

// ─── Tests ─────────────────────────────────────────────────────────────────

async function testApiSuccessSkipsRaw() {
  const { client, calls } = createStubbedClient({
    apiResult: 'api-content',
    rawResult: 'raw-content',
  });

  const result = await client.fetchGitHubFile('owner', 'repo', 'path/file.txt', 'main');

  assert(result === 'api-content', 'API success returns API content');
  assert(calls.length === 1, 'API success makes exactly one call', `calls: ${calls.join(', ')}`);
  assert(calls[0].startsWith('api:'), 'API success calls API endpoint', `got: ${calls[0]}`);
}

async function testApiFailureFallsToRaw() {
  const { client, calls } = createStubbedClient({
    apiResult: new Error('HTTP 403'),
    rawResult: 'raw-content',
  });

  const result = await client.fetchGitHubFile('owner', 'repo', 'path/file.txt', 'main');

  assert(result === 'raw-content', 'API failure returns raw CDN content');
  assert(calls.length === 2, 'API failure makes two calls', `calls: ${calls.join(', ')}`);
  assert(calls[0].startsWith('api:'), 'First call is to API');
  assert(calls[1].startsWith('raw:'), 'Second call is to raw CDN');
}

async function testBothFailThrows() {
  const { client } = createStubbedClient({
    apiResult: new Error('HTTP 403'),
    rawResult: new Error('HTTP 404'),
  });

  let threw = false;
  try {
    await client.fetchGitHubFile('owner', 'repo', 'path/file.txt', 'main');
  } catch {
    threw = true;
  }

  assert(threw, 'Both endpoints failing throws an error');
}

async function testUrlConstruction() {
  const { client, calls } = createStubbedClient({
    apiResult: 'content',
    rawResult: 'content',
  });

  await client.fetchGitHubFile('bmad-code-org', 'bmad-plugins-marketplace', 'registry/official.yaml', 'main');

  const apiCall = calls[0];
  assert(
    apiCall.includes('api.github.com/repos/bmad-code-org/bmad-plugins-marketplace/contents/registry/official.yaml'),
    'API URL contains correct path',
    `got: ${apiCall}`,
  );
  assert(apiCall.includes('ref=main'), 'API URL contains ref parameter', `got: ${apiCall}`);
}

async function testRawUrlConstruction() {
  const { client, calls } = createStubbedClient({
    apiResult: new Error('fail'),
    rawResult: 'content',
  });

  await client.fetchGitHubFile('bmad-code-org', 'bmad-plugins-marketplace', 'registry/official.yaml', 'main');

  const rawCall = calls[1];
  assert(
    rawCall.includes('raw.githubusercontent.com/bmad-code-org/bmad-plugins-marketplace/main/registry/official.yaml'),
    'Raw URL contains correct path',
    `got: ${rawCall}`,
  );
}

async function testFetchGitHubYamlParsesCorrectly() {
  const yamlContent = 'modules:\n  - name: test\n    description: A test module\n';
  const { client } = createStubbedClient({
    apiResult: yamlContent,
    rawResult: yamlContent,
  });

  const result = await client.fetchGitHubYaml('owner', 'repo', 'file.yaml', 'main');

  assert(Array.isArray(result.modules), 'fetchGitHubYaml parses YAML correctly');
  assert(result.modules[0].name === 'test', 'fetchGitHubYaml preserves YAML values');
}

async function testFetchGitHubJsonParsesCorrectly() {
  const jsonContent = '{"name": "test", "version": "1.0.0"}';
  const { client } = createStubbedClient({
    apiResult: jsonContent,
    rawResult: jsonContent,
  });

  const result = await client.fetchGitHubJson('owner', 'repo', 'file.json', 'main');

  assert(result.name === 'test', 'fetchGitHubJson parses JSON correctly');
  assert(result.version === '1.0.0', 'fetchGitHubJson preserves JSON values');
}

// ─── Runner ────────────────────────────────────────────────────────────────

async function runTests() {
  console.log(`\n${colors.cyan}========================================`);
  console.log('  RegistryClient Tests');
  console.log(`========================================${colors.reset}\n`);

  await testApiSuccessSkipsRaw();
  await testApiFailureFallsToRaw();
  await testBothFailThrows();
  await testUrlConstruction();
  await testRawUrlConstruction();
  await testFetchGitHubYamlParsesCorrectly();
  await testFetchGitHubJsonParsesCorrectly();

  console.log(`\n${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All registry client tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some registry client tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});
