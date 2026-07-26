const HARD_CRITICAL = [
  /\bauthentication\b|\bauthorization\b|\brefresh[ -]?token\b/i,
  /\bpayment|billing|subscription|checkout\b/i,
  /\bsensitive data|pii|personal data|secret\b/i,
  /\bdestructive migration|drop table|delete .*data\b/i,
  /\binfrastructure|terraform|production deploy|firewall\b/i,
  /\bsecurity|vulnerability|permission\b/i,
];
const PLANNED = [/\bpublic api|api contract|database schema|migration\b/i, /\bmultiple (modules|services)|cross-service|architecture\b/i];
const FOCUSED = [/\b(add|create|implement)\b/i, /\bfeature|endpoint|route|page|component|refactor\b/i];

export function classifyTask(request = '', overrides = {}) {
  const text = String(request);
  let mode = 'patch';
  let reason = 'local, reversible change';
  if (HARD_CRITICAL.some((pattern) => pattern.test(text))) {
    mode = 'critical';
    reason = 'hard critical risk trigger';
  } else if (PLANNED.some((pattern) => pattern.test(text))) {
    mode = 'planned';
    reason = 'cross-boundary, public-contract, or migration scope';
  } else if (FOCUSED.some((pattern) => pattern.test(text))) {
    mode = 'focused';
    reason = 'new or multi-file local capability';
  }
  if (overrides.mode && ['patch', 'focused', 'planned', 'critical'].includes(overrides.mode)) {
    mode = overrides.mode;
    reason = 'explicit user override';
  }
  return { mode, reason };
}

export const MODE_DEFAULTS = {
  patch: { spec: 'off', artifacts: 0, subagents: 0, verification: 'manual-or-targeted-static', review: 'self-diff' },
  focused: { spec: 'off', artifacts: 0, subagents: 0, verification: 'affected-module', review: 'self' },
  planned: { spec: 'compact-when-needed', artifacts: 1, subagents: 1, verification: 'relevant', review: 'conditional' },
  critical: { spec: 'required', artifacts: 'risk-based', subagents: 2, verification: 'full-relevant', review: 'independent' },
};
