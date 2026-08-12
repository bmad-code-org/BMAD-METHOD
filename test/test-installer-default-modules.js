/**
 * Installer Non-Interactive Default Module Tests
 *
 * Regression coverage for module selection during `--action update --yes`.
 * Both module catalogs are stubbed so these tests remain offline and do not
 * depend on a BMAD installation or user cache.
 *
 * Usage: node test/test-installer-default-modules.js
 */

const { UI } = require('../tools/installer/ui');
const { OfficialModules } = require('../tools/installer/modules/official-modules');
const { ExternalModuleManager } = require('../tools/installer/modules/external-manager');
const { parseChannelOptions, buildPlan } = require('../tools/installer/modules/channel-plan');

const registryModules = [
  {
    code: 'bmad-loop',
    name: 'BMAD Loop',
    aliases: ['bauto'],
    builtIn: false,
    defaultSelected: false,
    defaultChannel: 'stable',
  },
];

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

function assertEqual(actual, expected, testName) {
  const ok = actual === expected;
  assert(ok, testName, ok ? '' : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function section(title) {
  console.log(`\n${colors.cyan}── ${title} ──${colors.reset}`);
}

async function withCatalogStubs({ builtInModules = [], registryModules = [] }, callback) {
  const originalOfficialListAvailable = OfficialModules.prototype.listAvailable;
  const originalExternalListAvailable = ExternalModuleManager.prototype.listAvailable;

  OfficialModules.prototype.listAvailable = async () => ({ modules: builtInModules });
  ExternalModuleManager.prototype.listAvailable = async () => registryModules;

  try {
    return await callback();
  } finally {
    OfficialModules.prototype.listAvailable = originalOfficialListAvailable;
    ExternalModuleManager.prototype.listAvailable = originalExternalListAvailable;
  }
}

async function getDefaultModules(installedModuleIds, registryModules = []) {
  return withCatalogStubs({ registryModules }, async () => new UI().getDefaultModules(new Set(installedModuleIds)));
}

async function runTests() {
  section('getDefaultModules :: custom module preservation');

  {
    const selection = await getDefaultModules(['manticore']);
    assert(
      selection.includes('manticore'),
      'custom module survives --action update --yes',
      `expected selection to contain "manticore", got ${JSON.stringify(selection)}`,
    );
  }

  section('getDefaultModules :: alias canonicalization');

  {
    const selection = await getDefaultModules(['bauto'], registryModules);
    assert(
      selection.includes('bmad-loop'),
      'installed alias selects its canonical module code',
      `expected selection to contain "bmad-loop", got ${JSON.stringify(selection)}`,
    );
    assert(
      !selection.includes('bauto'),
      'installed alias is omitted from the selection',
      `expected selection not to contain "bauto", got ${JSON.stringify(selection)}`,
    );
  }

  {
    const selection = await getDefaultModules(['bauto', 'bmad-loop'], registryModules);
    assertEqual(
      selection.filter((moduleId) => moduleId === 'bmad-loop').length,
      1,
      'alias and canonical module deduplicate to one canonical selection',
    );
    assert(
      !selection.includes('bauto'),
      'deduplicated selection omits the installed alias',
      `expected selection not to contain "bauto", got ${JSON.stringify(selection)}`,
    );
  }

  section('getDefaultModules :: installed channel decision');

  {
    const selection = await getDefaultModules(['bauto'], registryModules);
    const channelOptions = parseChannelOptions({ next: ['bmad-loop'] });
    const plan = buildPlan({
      modules: selection.map((code) => ({ code, defaultChannel: 'stable' })),
      channelOptions,
    });

    assertEqual(plan.get('bmad-loop')?.channel, 'next', 'canonicalized selection retains the installed --next channel decision');

    const staleAliasPlan = buildPlan({
      modules: [{ code: 'bauto', defaultChannel: 'stable' }],
      channelOptions,
    });
    assertEqual(staleAliasPlan.get('bauto')?.channel, 'stable', 'stale alias selection falls back to the registry default channel');
  }

  console.log('');
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All default module tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some default module tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});
