// Exit codes for bmad-module verbs. Documented in SKILL.md and README.md so
// callers (Claude, CI, humans) can branch on them programmatically.
export const EXIT = {
  OK: 0,
  USAGE: 2,
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
