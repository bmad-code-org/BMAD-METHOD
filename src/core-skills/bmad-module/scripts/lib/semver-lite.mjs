// semver-lite — zero-dependency stand-ins for the two semver functions this
// skill needs. We deliberately do NOT vendor the `semver` package: its only use
// here is install-time validation of an author's plugin.json (`valid` on
// #version, `validRange` on #bmad.compatibility.bmadMethod). That is bounded,
// low-severity input checking — unlike manifest.yaml round-tripping, which is
// co-owned with BMAD core and so keeps the REAL `yaml` library (see vendor/).
//
// `node:`-only, matching every other script BMAD installs. Both functions are
// generous: a wrong *reject* would fail a legitimate install, so where semver
// is lenient we are lenient too. Parity with the real `semver` is asserted by a
// battery in the repo's skill tests; keep that battery green if you edit this.

// Official SemVer 2.0.0 grammar (semver.org), with an optional leading `v` to
// match semver's parser. Build metadata is accepted but dropped from the
// normalized return, exactly like `semver.valid()`.
const SEMVER_RE =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;

/**
 * Mirror of `semver.valid()`: returns the normalized version string for a valid
 * full semver, otherwise null. Build metadata is stripped from the result.
 */
export function valid(version) {
  if (typeof version !== 'string') return null;
  const m = SEMVER_RE.exec(version.trim());
  if (!m) return null;
  return `${m[1]}.${m[2]}.${m[3]}${m[4] ? `-${m[4]}` : ''}`;
}

// ---- range grammar -------------------------------------------------------
// A "partial" is a 1–3 segment version where each segment may be a number or an
// x-range wildcard (x/X/*), with optional prerelease/build on the full form.
const XID = '(?:0|[1-9]\\d*|\\d+|[xX*])';
const PRE = '(?:-[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?';
const BUILD = '(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?';
const PARTIAL_RE = new RegExp(`^v?${XID}(?:\\.${XID}(?:\\.${XID}${PRE}${BUILD})?)?$`);

function isPartial(v) {
  return v !== '' && PARTIAL_RE.test(v);
}

// One comparator: an optional operator (>=, <=, >, <, =, ~, ^) glued to a
// partial version. Bare `*`/`x`/`X` (or empty) means "any".
function isComparator(tok) {
  if (tok === '' || tok === '*' || tok === 'x' || tok === 'X') return true;
  // `~>` is a semver-supported alias for `~`; match it before `~`/`>`.
  const m = /^(~>|>=|<=|>|<|=|~|\^)?(.*)$/.exec(tok);
  return isPartial(m[2]);
}

// One comparator set (the AND-joined part of a `||` union).
function isComparatorSet(set) {
  if (set === '' || set === '*') return true;
  // Hyphen range: "<partial> - <partial>" (spaces required around the dash).
  const hy = /^(.+?)\s+-\s+(.+)$/.exec(set);
  if (hy) return isPartial(hy[1].trim()) && isPartial(hy[2].trim());
  // Collapse whitespace after an operator so ">= 1.2.3" is a single comparator,
  // then split the remaining intersection on whitespace.
  const tokens = set
    .replace(/(~>|>=|<=|>|<|=|~|\^)\s+/g, '$1')
    .split(/\s+/)
    .filter(Boolean);
  // `[].every()` is already true, so an empty intersection means "any".
  return tokens.every((t) => isComparator(t));
}

/**
 * Mirror of `semver.validRange()` as a validator: returns the input range when
 * it is a syntactically valid semver range, otherwise null. (We return the
 * original string rather than semver's normalized form — callers here only test
 * truthiness.)
 */
export function validRange(range) {
  if (typeof range !== 'string') return null;
  const r = range.trim();
  if (r === '') return '*';
  const groups = r.split(/\s*\|\|\s*/);
  for (const g of groups) {
    if (!isComparatorSet(g.trim())) return null;
  }
  return range;
}
