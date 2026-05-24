// Exit codes for bmad-module verbs. Documented in SKILL.md and README.md so
// callers (Claude, CI, humans) can branch on them programmatically.
export const EXIT = {
  OK: 0,
  USAGE: 2,
  // Setup/packaging problem — the skill's own bundled runtime files (e.g. the
  // vendored yaml in lib/vendor/) are missing or corrupt, usually from an
  // incomplete copy. Distinct from a module-rejection decision: it's fixable by
  // reinstalling the skill. Emitted by the launcher in bmad-module.mjs, which
  // duplicates the literal `5` so its guard can depend on nothing — keep in sync.
  TOOLING: 5,
  NO_BMAD_DIR: 10,
  BAD_MANIFEST: 20,
  RESERVED_PREFIX: 21,
  PREFIX_COLLISION: 30,
  FILE_OVERLAP: 40,
  COMMIT_FAILURE: 50,
  NETWORK_FAILURE: 60,
  PATH_TRAVERSAL: 70,
  MODIFIED_FILES: 80,
  NOT_INSTALLED: 90,
};

export class BmadModuleError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export function die(code, message) {
  process.stderr.write(`[bmad-module] ${message}\n`);
  process.exit(code);
}
