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

/**
 * Mirror of `semver.prerelease()`: returns the array of dot-separated
 * prerelease identifiers (numeric ones coerced to Number) for a valid version,
 * or null when the version is invalid or has no prerelease. Used by the channel
 * resolver to exclude `-alpha`/`-rc` tags from the stable channel.
 */
export function prerelease(version) {
  if (typeof version !== 'string') return null;
  const m = SEMVER_RE.exec(version.trim());
  if (!m || !m[4]) return null;
  return m[4].split('.').map((id) => (/^\d+$/.test(id) ? Number(id) : id));
}

// Numeric compare of the three core fields, then prerelease precedence per
// SemVer §11. Returns -1, 0, or 1. Both inputs must be valid semver.
function compareValid(a, b) {
  const ma = SEMVER_RE.exec(a);
  const mb = SEMVER_RE.exec(b);
  for (let i = 1; i <= 3; i++) {
    const d = Number(ma[i]) - Number(mb[i]);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  // A version WITH a prerelease has lower precedence than one without.
  const pa = ma[4];
  const pb = mb[4];
  if (!pa && !pb) return 0;
  if (!pa) return 1;
  if (!pb) return -1;
  const ia = pa.split('.');
  const ib = pb.split('.');
  const len = Math.min(ia.length, ib.length);
  for (let i = 0; i < len; i++) {
    if (ia[i] === ib[i]) continue;
    const na = /^\d+$/.test(ia[i]);
    const nb = /^\d+$/.test(ib[i]);
    if (na && nb) return Number(ia[i]) < Number(ib[i]) ? -1 : 1;
    // Numeric identifiers always have lower precedence than alphanumeric ones.
    if (na) return -1;
    if (nb) return 1;
    return ia[i] < ib[i] ? -1 : 1;
  }
  // A larger set of prerelease fields wins when all preceding are equal.
  return ia.length === ib.length ? 0 : ia.length < ib.length ? -1 : 1;
}

/**
 * Mirror of `semver.compare()`: -1/0/1 for a<b / a==b / a>b. Returns null when
 * either side is not valid semver (semver throws; callers here treat unknown as
 * "don't reorder").
 */
export function compare(a, b) {
  const va = valid(a);
  const vb = valid(b);
  if (va === null || vb === null) return null;
  return compareValid(va, vb);
}

/**
 * Mirror of `semver.rcompare()`: reverse of compare(), for sorting newest-first.
 */
export function rcompare(a, b) {
  const c = compare(a, b);
  return c === null ? 0 : -c;
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
