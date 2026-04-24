/**
 * Channel plan: the per-module resolution decision applied at install time.
 *
 * A "plan entry" for a module is:
 *   { channel: 'stable'|'next'|'pinned', pin?: string }
 *
 * We build the plan from:
 *   1. CLI flags (--channel / --all-* / --next=CODE / --pin CODE=TAG)
 *   2. Interactive answers (the "all stable?" gate + per-module picker)
 *   3. Registry defaults (default_channel from registry-fallback.yaml / official.yaml)
 *   4. Hardcoded fallback 'stable'
 *
 * Precedence: --pin > --next=CODE > --channel (global) > registry default > 'stable'.
 *
 * This module is pure. No prompts, no git, no filesystem.
 */

const VALID_CHANNELS = new Set(['stable', 'next']);

/**
 * Parse raw commander options into a structured channel options object.
 *
 * @param {Object} options - raw command-line options
 * @returns {{
 *   global: 'stable'|'next'|null,
 *   nextSet: Set<string>,
 *   pins: Map<string, string>,
 *   warnings: string[]
 * }}
 */
function parseChannelOptions(options = {}) {
  const warnings = [];

  // Global channel from --channel / --all-stable / --all-next.
  let global = null;
  const aliases = [];
  if (options.channel) aliases.push({ flag: '--channel', value: normalizeChannel(options.channel, warnings, '--channel') });
  if (options.allStable) aliases.push({ flag: '--all-stable', value: 'stable' });
  if (options.allNext) aliases.push({ flag: '--all-next', value: 'next' });

  const distinct = new Set(aliases.map((a) => a.value).filter(Boolean));
  if (distinct.size > 1) {
    warnings.push(
      `Conflicting channel flags: ${aliases
        .filter((a) => a.value)
        .map((a) => a.flag + '=' + a.value)
        .join(', ')}. Using first: ${aliases.find((a) => a.value).flag}.`,
    );
  }
  const firstValid = aliases.find((a) => a.value);
  if (firstValid) global = firstValid.value;

  // --next=CODE (repeatable)
  const nextSet = new Set();
  for (const code of options.next || []) {
    const trimmed = String(code).trim();
    if (!trimmed) continue;
    nextSet.add(trimmed);
  }

  // --pin CODE=TAG (repeatable)
  const pins = new Map();
  for (const spec of options.pin || []) {
    const parsed = parsePinSpec(spec);
    if (!parsed) {
      warnings.push(`Ignoring malformed --pin value '${spec}'. Expected CODE=TAG.`);
      continue;
    }
    if (pins.has(parsed.code)) {
      warnings.push(`--pin specified multiple times for '${parsed.code}'. Using last: ${parsed.tag}.`);
    }
    pins.set(parsed.code, parsed.tag);
  }

  // --yes auto-confirms the community-module curator-bypass prompt so
  // headless installs with --next=/--pin for a community module don't hang.
  const acceptBypass = options.yes === true || options.acceptBypass === true;

  return { global, nextSet, pins, warnings, acceptBypass };
}

function normalizeChannel(raw, warnings, flagName) {
  if (typeof raw !== 'string') return null;
  const lower = raw.trim().toLowerCase();
  if (VALID_CHANNELS.has(lower)) return lower;
  warnings.push(`Ignoring invalid ${flagName} value '${raw}'. Expected one of: stable, next.`);
  return null;
}

function parsePinSpec(spec) {
  if (typeof spec !== 'string') return null;
  const idx = spec.indexOf('=');
  if (idx <= 0 || idx === spec.length - 1) return null;
  const code = spec.slice(0, idx).trim();
  const tag = spec.slice(idx + 1).trim();
  if (!code || !tag) return null;
  return { code, tag };
}

/**
 * Build a per-module plan entry, applying precedence.
 *
 * @param {Object} args
 * @param {string} args.code
 * @param {Object} args.channelOptions - from parseChannelOptions
 * @param {string} [args.registryDefault] - module's default_channel, if any
 * @returns {{channel: 'stable'|'next'|'pinned', pin?: string, source: string}}
 *   source describes where the decision came from, for logging / debugging.
 */
function decideChannelForModule({ code, channelOptions, registryDefault }) {
  const { global, nextSet, pins } = channelOptions || { nextSet: new Set(), pins: new Map() };

  if (pins && pins.has(code)) {
    return { channel: 'pinned', pin: pins.get(code), source: 'flag:--pin' };
  }
  if (nextSet && nextSet.has(code)) {
    return { channel: 'next', source: 'flag:--next' };
  }
  if (global) {
    return { channel: global, source: 'flag:--channel' };
  }
  if (registryDefault && VALID_CHANNELS.has(registryDefault)) {
    return { channel: registryDefault, source: 'registry' };
  }
  return { channel: 'stable', source: 'default' };
}

/**
 * Build a full channel plan map for a set of modules.
 *
 * @param {Object} args
 * @param {Array<{code: string, defaultChannel?: string, builtIn?: boolean}>} args.modules
 *   Only the modules that need a channel entry; callers should filter out
 *   bundled modules (core/bmm) before calling.
 * @param {Object} args.channelOptions - from parseChannelOptions
 * @returns {Map<string, {channel: string, pin?: string, source: string}>}
 */
function buildPlan({ modules, channelOptions }) {
  const plan = new Map();
  for (const mod of modules || []) {
    plan.set(
      mod.code,
      decideChannelForModule({
        code: mod.code,
        channelOptions,
        registryDefault: mod.defaultChannel,
      }),
    );
  }
  return plan;
}

/**
 * Report any --pin CODE=TAG entries that don't correspond to a selected module.
 * These get warned about but don't abort the install.
 */
function orphanPinWarnings(channelOptions, selectedCodes) {
  const warnings = [];
  const selected = new Set(selectedCodes || []);
  for (const code of channelOptions?.pins?.keys() || []) {
    if (!selected.has(code)) {
      warnings.push(`--pin for '${code}' has no effect (module not selected).`);
    }
  }
  for (const code of channelOptions?.nextSet || []) {
    if (!selected.has(code)) {
      warnings.push(`--next for '${code}' has no effect (module not selected).`);
    }
  }
  return warnings;
}

/**
 * Warn when --pin / --next targets a bundled module (core, bmm). Those are
 * shipped inside the installer binary — there's no git clone to override, so
 * the flag has no effect. Users who actually want a prerelease core/bmm
 * should use `npx bmad-method@next install`.
 */
function bundledTargetWarnings(channelOptions, bundledCodes) {
  const warnings = [];
  const bundled = new Set(bundledCodes || []);
  const hint = '(bundled module; use `npx bmad-method@next install` for a prerelease)';
  for (const code of channelOptions?.pins?.keys() || []) {
    if (bundled.has(code)) {
      warnings.push(`--pin for '${code}' has no effect ${hint}.`);
    }
  }
  for (const code of channelOptions?.nextSet || []) {
    if (bundled.has(code)) {
      warnings.push(`--next for '${code}' has no effect ${hint}.`);
    }
  }
  return warnings;
}

module.exports = {
  parseChannelOptions,
  decideChannelForModule,
  buildPlan,
  orphanPinWarnings,
  bundledTargetWarnings,
  parsePinSpec,
};
