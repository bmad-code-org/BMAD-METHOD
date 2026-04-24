/**
 * Installer Channel Resolution Tests
 *
 * Unit tests for the pure planning/resolution modules:
 *   - tools/installer/modules/channel-plan.js
 *   - tools/installer/modules/channel-resolver.js
 *
 * Neither module does I/O outside of GitHub tag lookups (which we don't
 * exercise here) and semver math. All tests are deterministic.
 *
 * Usage: node test/test-installer-channels.js
 */

const {
  parseChannelOptions,
  decideChannelForModule,
  buildPlan,
  orphanPinWarnings,
  bundledTargetWarnings,
  parsePinSpec,
} = require('../tools/installer/modules/channel-plan');

const { parseGitHubRepo, normalizeStableTag, classifyUpgrade, releaseNotesUrl } = require('../tools/installer/modules/channel-resolver');

const colors = {
  reset: '[0m',
  green: '[32m',
  red: '[31m',
  yellow: '[33m',
  cyan: '[36m',
  dim: '[2m',
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

function runTests() {
  // ─────────────────────────────────────────────────────────────────────────
  // channel-plan.js :: parsePinSpec
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-plan :: parsePinSpec');

  {
    const r = parsePinSpec('bmb=v1.2.3');
    assert(r && r.code === 'bmb' && r.tag === 'v1.2.3', 'valid CODE=TAG');
  }
  {
    const r = parsePinSpec('  cis = v0.1.0  ');
    assert(r && r.code === 'cis' && r.tag === 'v0.1.0', 'trims whitespace around code and tag');
  }
  assert(parsePinSpec('') === null, 'empty string returns null');
  assert(parsePinSpec('bmb') === null, 'missing = returns null');
  assert(parsePinSpec('=v1.0.0') === null, 'leading = returns null');
  assert(parsePinSpec('bmb=') === null, 'trailing = returns null');
  assert(parsePinSpec(null) === null, 'null input returns null');
  let undef;
  assert(parsePinSpec(undef) === null, 'undefined input returns null');
  assert(parsePinSpec(42) === null, 'non-string input returns null');

  // ─────────────────────────────────────────────────────────────────────────
  // channel-plan.js :: parseChannelOptions
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-plan :: parseChannelOptions');

  {
    const r = parseChannelOptions({});
    assert(r.global === null, 'empty: global is null');
    assert(r.nextSet instanceof Set && r.nextSet.size === 0, 'empty: nextSet is empty Set');
    assert(r.pins instanceof Map && r.pins.size === 0, 'empty: pins is empty Map');
    assert(Array.isArray(r.warnings) && r.warnings.length === 0, 'empty: no warnings');
    assert(r.acceptBypass === false, 'empty: acceptBypass false by default');
  }
  {
    const r = parseChannelOptions({ channel: 'stable' });
    assertEqual(r.global, 'stable', '--channel=stable sets global');
  }
  {
    const r = parseChannelOptions({ channel: 'NEXT' });
    assertEqual(r.global, 'next', '--channel is case-insensitive');
  }
  {
    const r = parseChannelOptions({ allStable: true });
    assertEqual(r.global, 'stable', '--all-stable sets global stable');
  }
  {
    const r = parseChannelOptions({ allNext: true });
    assertEqual(r.global, 'next', '--all-next sets global next');
  }
  {
    const r = parseChannelOptions({ channel: 'bogus' });
    assert(r.global === null, 'invalid --channel value is rejected (global stays null)');
    assert(
      r.warnings.some((w) => w.includes("Ignoring invalid --channel value 'bogus'")),
      'invalid --channel produces a warning',
    );
  }
  {
    // --all-stable and --all-next conflict → warning, first-wins
    const r = parseChannelOptions({ allStable: true, allNext: true });
    assertEqual(r.global, 'stable', 'conflict: first flag (--all-stable) wins');
    assert(
      r.warnings.some((w) => w.includes('Conflicting channel flags')),
      'conflict produces warning',
    );
  }
  {
    const r = parseChannelOptions({ next: ['bmb', 'cis', '  '] });
    assert(r.nextSet.has('bmb') && r.nextSet.has('cis'), '--next=CODE adds to nextSet');
    assert(!r.nextSet.has(''), 'blank --next entries are skipped');
  }
  {
    const r = parseChannelOptions({ pin: ['bmb=v1.0.0', 'cis=v2.0.0'] });
    assertEqual(r.pins.get('bmb'), 'v1.0.0', '--pin bmb=v1.0.0 recorded');
    assertEqual(r.pins.get('cis'), 'v2.0.0', '--pin cis=v2.0.0 recorded');
  }
  {
    const r = parseChannelOptions({ pin: ['bmb=v1.0.0', 'bmb=v1.1.0'] });
    assertEqual(r.pins.get('bmb'), 'v1.1.0', 'duplicate --pin: last wins');
    assert(
      r.warnings.some((w) => w.includes('--pin specified multiple times')),
      'duplicate --pin produces warning',
    );
  }
  {
    const r = parseChannelOptions({ pin: ['malformed-no-equals'] });
    assert(r.pins.size === 0, 'malformed --pin is ignored');
    assert(
      r.warnings.some((w) => w.includes('malformed --pin')),
      'malformed --pin warns',
    );
  }
  {
    const r = parseChannelOptions({ yes: true });
    assertEqual(r.acceptBypass, true, '--yes sets acceptBypass so curator-bypass prompt is auto-confirmed');
  }
  {
    const r = parseChannelOptions({ acceptBypass: true });
    assertEqual(r.acceptBypass, true, 'explicit acceptBypass: true honored');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // channel-plan.js :: decideChannelForModule (precedence)
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-plan :: decideChannelForModule (precedence)');

  const emptyOpts = parseChannelOptions({});

  {
    const r = decideChannelForModule({ code: 'bmb', channelOptions: emptyOpts });
    assertEqual(r.channel, 'stable', 'no signal → stable default');
    assertEqual(r.source, 'default', 'source: default');
  }
  {
    const r = decideChannelForModule({ code: 'bmb', channelOptions: emptyOpts, registryDefault: 'next' });
    assertEqual(r.channel, 'next', 'registry default applied when no flags');
    assertEqual(r.source, 'registry', 'source: registry');
  }
  {
    const r = decideChannelForModule({ code: 'bmb', channelOptions: emptyOpts, registryDefault: 'bogus' });
    assertEqual(r.channel, 'stable', 'invalid registry default ignored, falls to stable');
  }
  {
    const opts = parseChannelOptions({ channel: 'next' });
    const r = decideChannelForModule({ code: 'bmb', channelOptions: opts, registryDefault: 'stable' });
    assertEqual(r.channel, 'next', 'global --channel beats registry default');
    assertEqual(r.source, 'flag:--channel', 'source reflects --channel origin');
  }
  {
    const opts = parseChannelOptions({ channel: 'stable', next: ['bmb'] });
    const r = decideChannelForModule({ code: 'bmb', channelOptions: opts });
    assertEqual(r.channel, 'next', '--next=bmb beats --channel=stable for bmb');
    assertEqual(r.source, 'flag:--next', 'source: flag:--next');
  }
  {
    const opts = parseChannelOptions({ channel: 'next', pin: ['bmb=v1.0.0'] });
    const r = decideChannelForModule({ code: 'bmb', channelOptions: opts });
    assertEqual(r.channel, 'pinned', '--pin beats --channel');
    assertEqual(r.pin, 'v1.0.0', 'pin value carried through');
    assertEqual(r.source, 'flag:--pin', 'source: flag:--pin');
  }
  {
    const opts = parseChannelOptions({ next: ['bmb'], pin: ['bmb=v1.0.0'] });
    const r = decideChannelForModule({ code: 'bmb', channelOptions: opts });
    assertEqual(r.channel, 'pinned', '--pin beats --next for same code');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // channel-plan.js :: buildPlan, orphanPinWarnings, bundledTargetWarnings
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-plan :: buildPlan / warnings');

  {
    const opts = parseChannelOptions({ allStable: true, pin: ['bmb=v1.0.0'] });
    const plan = buildPlan({
      modules: [
        { code: 'bmb', defaultChannel: 'stable' },
        { code: 'cis', defaultChannel: 'stable' },
      ],
      channelOptions: opts,
    });
    assertEqual(plan.get('bmb').channel, 'pinned', 'buildPlan: bmb pinned');
    assertEqual(plan.get('cis').channel, 'stable', 'buildPlan: cis stable via global');
  }
  {
    const opts = parseChannelOptions({ pin: ['ghost=v1.0.0', 'bmb=v1.0.0'], next: ['gds'] });
    const warnings = orphanPinWarnings(opts, ['bmb']);
    assert(
      warnings.some((w) => w.includes("--pin for 'ghost'")),
      'orphanPinWarnings: flags pin for unselected module',
    );
    assert(
      warnings.some((w) => w.includes("--next for 'gds'")),
      'orphanPinWarnings: flags --next for unselected module',
    );
    assert(!warnings.some((w) => w.includes("'bmb'")), 'orphanPinWarnings: no warning for selected module');
  }
  {
    const opts = parseChannelOptions({ pin: ['bmm=v1.0.0'], next: ['core'] });
    const warnings = bundledTargetWarnings(opts, ['core', 'bmm']);
    assert(
      warnings.some((w) => w.includes('bundled module')),
      'bundledTargetWarnings: warns bundled pin',
    );
    assert(warnings.length === 2, 'bundledTargetWarnings: both pin and next warned');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // channel-resolver.js :: parseGitHubRepo
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-resolver :: parseGitHubRepo');

  {
    const r = parseGitHubRepo('https://github.com/bmad-code-org/BMAD-METHOD');
    assert(r && r.owner === 'bmad-code-org' && r.repo === 'BMAD-METHOD', 'https URL basic');
  }
  {
    const r = parseGitHubRepo('https://github.com/bmad-code-org/BMAD-METHOD.git');
    assert(r && r.repo === 'BMAD-METHOD', '.git suffix stripped');
  }
  {
    const r = parseGitHubRepo('https://github.com/bmad-code-org/BMAD-METHOD/');
    assert(r && r.repo === 'BMAD-METHOD', 'trailing slash stripped');
  }
  {
    const r = parseGitHubRepo('https://github.com/org/repo/tree/main/subdir');
    assert(r && r.owner === 'org' && r.repo === 'repo', 'deep path yields owner/repo');
  }
  {
    const r = parseGitHubRepo('git@github.com:org/repo.git');
    assert(r && r.owner === 'org' && r.repo === 'repo', 'SSH URL parsed');
  }
  assert(parseGitHubRepo('https://gitlab.com/foo/bar') === null, 'non-github URL returns null');
  assert(parseGitHubRepo('') === null, 'empty string returns null');
  assert(parseGitHubRepo(null) === null, 'null input returns null');
  assert(parseGitHubRepo(123) === null, 'non-string input returns null');

  // ─────────────────────────────────────────────────────────────────────────
  // channel-resolver.js :: normalizeStableTag
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-resolver :: normalizeStableTag');

  assertEqual(normalizeStableTag('v1.2.3'), '1.2.3', 'strips leading v');
  assertEqual(normalizeStableTag('1.2.3'), '1.2.3', 'bare semver accepted');
  assertEqual(normalizeStableTag('v1.2.3-alpha.1'), null, 'prerelease -alpha excluded');
  assertEqual(normalizeStableTag('v1.2.3-beta'), null, 'prerelease -beta excluded');
  assertEqual(normalizeStableTag('v1.2.3-rc.1'), null, 'prerelease -rc excluded');
  assertEqual(normalizeStableTag('not-a-version'), null, 'invalid string returns null');
  assertEqual(normalizeStableTag('v1.2'), null, 'incomplete semver returns null');
  assertEqual(normalizeStableTag(null), null, 'null returns null');
  assertEqual(normalizeStableTag(123), null, 'non-string returns null');

  // ─────────────────────────────────────────────────────────────────────────
  // channel-resolver.js :: classifyUpgrade
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-resolver :: classifyUpgrade');

  assertEqual(classifyUpgrade('v1.2.3', 'v1.2.3'), 'none', 'equal versions → none');
  assertEqual(classifyUpgrade('v1.2.3', 'v1.2.2'), 'none', 'downgrade → none');
  assertEqual(classifyUpgrade('v1.2.3', 'v1.2.4'), 'patch', 'patch bump');
  assertEqual(classifyUpgrade('v1.2.3', 'v1.3.0'), 'minor', 'minor bump');
  assertEqual(classifyUpgrade('v1.2.3', 'v2.0.0'), 'major', 'major bump');
  assertEqual(classifyUpgrade('1.2.3', '1.2.4'), 'patch', 'unprefixed versions work');
  assertEqual(classifyUpgrade('main', 'v1.2.3'), 'unknown', 'non-semver current → unknown');
  assertEqual(classifyUpgrade('v1.2.3', 'main'), 'unknown', 'non-semver next → unknown');
  assertEqual(classifyUpgrade('', ''), 'unknown', 'both empty → unknown');

  // ─────────────────────────────────────────────────────────────────────────
  // channel-resolver.js :: releaseNotesUrl
  // ─────────────────────────────────────────────────────────────────────────
  section('channel-resolver :: releaseNotesUrl');

  assertEqual(
    releaseNotesUrl('https://github.com/bmad-code-org/BMAD-METHOD', 'v1.2.3'),
    'https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v1.2.3',
    'builds standard release URL',
  );
  assertEqual(releaseNotesUrl('https://gitlab.com/foo/bar', 'v1.0.0'), null, 'non-github repo → null');
  assertEqual(releaseNotesUrl('https://github.com/foo/bar', null), null, 'null tag → null');
  assertEqual(releaseNotesUrl('', 'v1.0.0'), null, 'empty URL → null');

  // ─────────────────────────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────────────────────────
  console.log('');
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All channel resolution tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some channel resolution tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

try {
  runTests();
} catch (error) {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
}
