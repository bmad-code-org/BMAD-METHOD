#!/usr/bin/env node
// bmad-module — thin launcher (entry point).
//
// This file has NO imports on purpose. It must ALWAYS load, so that a broken or
// incomplete skill copy — e.g. a missing lib/vendor/yaml.mjs after a partial
// install — is reported as a DOCUMENTED exit code with actionable guidance,
// instead of crashing at module-load with a raw ESM resolver stack trace and a
// bare exit 1 (which is not in the exit-code table). The real CLI is cli.mjs.
//
// TOOLING must equal EXIT.TOOLING in ./lib/exit.mjs. It is duplicated here as a
// literal so this guard depends on nothing and can never itself fail to load.
const TOOLING = 5;

try {
  // A failure resolving/evaluating this import graph means a runtime asset is
  // missing or corrupt. Runtime and usage errors are handled INSIDE cli.mjs
  // (which maps them to their own structured exit codes and calls process.exit
  // before returning), so they never reach the catch below.
  const { main } = await import('./cli.mjs');
  await main();
} catch (err) {
  const code = err && err.code;
  const isLoadError =
    err instanceof SyntaxError ||
    code === 'ERR_MODULE_NOT_FOUND' ||
    code === 'ERR_UNSUPPORTED_DIR_IMPORT' ||
    code === 'ERR_UNKNOWN_FILE_EXTENSION' ||
    code === 'ERR_DLOPEN_FAILED' ||
    code === 'ERR_REQUIRE_ESM';
  if (isLoadError) {
    process.stderr.write(
      `[bmad-module] the skill's bundled runtime files are missing or corrupt ` +
        `(${code || err.name}: ${err.message}).\n` +
        `[bmad-module] this is a setup/packaging problem, not a module-rejection ` +
        `decision — do not treat it as a failed install of the target module.\n` +
        `[bmad-module] fix: reinstall the skill so its scripts/ tree (including ` +
        `scripts/lib/vendor/) is complete — re-run \`npx bmad-method install\`, ` +
        `or re-copy the bmad-module skill folder in full.\n`,
    );
    process.exit(TOOLING);
  }
  // Anything else escaping cli.mjs is a genuine, unexpected bug.
  process.stderr.write(`[bmad-module] unexpected error: ${err && (err.stack || err.message)}\n`);
  process.exit(1);
}
