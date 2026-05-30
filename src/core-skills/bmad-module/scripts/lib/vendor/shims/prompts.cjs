// Build-time shim for tools/installer/prompts.js, injected into the ide-sync
// bundle so the heavyweight interactive @clack/prompts dependency is never
// pulled in. The IDE engine only uses `prompts.log.*` for status output; that
// maps to plain stdout/stderr here. Interactive helpers throw if reached (they
// must not be during non-interactive distribution).
'use strict';

const out = (m) => process.stdout.write(`${m}\n`);
const err = (m) => process.stderr.write(`${m}\n`);

const log = {
  info: async (m) => out(m),
  success: async (m) => out(m),
  message: async (m) => out(m),
  step: async (m) => out(m),
  warn: async (m) => err(m),
  error: async (m) => err(m),
};

const notInteractive = () => {
  throw new Error('interactive prompt is not available in the ide-sync bundle');
};

// Identity color helper: every method returns its input unchanged.
const identityColor = new Proxy(
  {},
  {
    get: () => (s) => s,
  },
);

module.exports = {
  log,
  getColor: async () => identityColor,
  spinner: () => ({ start() {}, stop() {}, message() {} }),
  tasks: async () => {},
  note: async (m) => out(m),
  box: async (m) => out(m),
  intro: async () => {},
  outro: async () => {},
  cancel: async () => {},
  handleCancel: async () => {},
  getClack: notInteractive,
  select: notInteractive,
  multiselect: notInteractive,
  autocomplete: notInteractive,
  autocompleteMultiselect: notInteractive,
  directory: notInteractive,
  confirm: notInteractive,
  text: notInteractive,
  password: notInteractive,
  prompt: notInteractive,
};
