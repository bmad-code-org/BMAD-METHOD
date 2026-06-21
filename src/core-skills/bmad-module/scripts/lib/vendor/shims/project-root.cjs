// Build-time shim for tools/installer/project-root.js, injected into the
// ide-sync bundle. The full module reaches into custom-module-manager and the
// rest of the installer; the IDE engine only needs getProjectRoot() (to locate
// an optional project-level removals.txt). In the bundle, the project root is
// the cwd the bmad-module skill runs the bundle from.
'use strict';

const path = require('node:path');

function getProjectRoot() {
  return process.cwd();
}

function getSourcePath(...segments) {
  return path.join(process.cwd(), ...segments);
}

module.exports = { getProjectRoot, getSourcePath };
