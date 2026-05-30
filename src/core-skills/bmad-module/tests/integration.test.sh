#!/usr/bin/env bash
# integration.test.sh — end-to-end smoke test for the bmad-module skill.
#
# Hermetic: fabricates a minimal _bmad/_config/manifest.yaml skeleton in a
# tmp dir and exercises every verb against the vendored reference modules
# (tests/fixtures/examples/) and negative fixtures. Does NOT require
# BMAD-METHOD's installer; the upstream patch (§5) is verified separately.
#
# Run from anywhere:
#   bash src/core-skills/bmad-module/tests/integration.test.sh
#
# Exit 0 on full pass; non-zero on first failed assertion (set -e).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
MODULE_JS="${SKILL_DIR}/scripts/bmad-module.mjs"
# Reference modules are vendored under tests/fixtures/examples/ so the suite is
# self-contained — it does not depend on a sibling bmad-marketplace checkout.
EXAMPLES="${SCRIPT_DIR}/fixtures/examples"
FIXTURES="${SCRIPT_DIR}/fixtures"

WORKDIR="$(mktemp -d)"
trap 'rm -rf "${WORKDIR}"' EXIT
cd "${WORKDIR}"

pass=0
fail=0

note() { printf '\n\033[1m── %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; pass=$((pass+1)); }
ko()   { printf '  \033[31m✗\033[0m %s\n' "$*"; fail=$((fail+1)); }

# Wrapper that captures stdout/stderr/exit code into globals.
run() {
  set +e
  STDOUT="$(node "${MODULE_JS}" "$@" 2>/tmp/bmad-module-stderr.$$)"
  EXIT=$?
  STDERR="$(cat /tmp/bmad-module-stderr.$$)"
  rm -f /tmp/bmad-module-stderr.$$
  set -e
}

assert_exit() {
  local want=$1; local label=$2
  if [[ "${EXIT}" -eq "${want}" ]]; then ok "${label} → exit ${want}"
  else ko "${label} → expected exit ${want}, got ${EXIT}. stderr: ${STDERR}"
  fi
}

assert_path_exists() {
  if [[ -e "$1" ]]; then ok "exists: $1"
  else ko "missing: $1"
  fi
}

assert_path_absent() {
  if [[ ! -e "$1" ]]; then ok "absent: $1"
  else ko "should be gone: $1"
  fi
}

assert_grep() {
  local pat=$1; local file=$2
  if grep -q -E "$pat" "$file"; then ok "grep '$pat' in $(basename "$file")"
  else ko "grep '$pat' NOT in $(basename "$file"); contents:\n$(cat "$file")"
  fi
}

# ─── Setup: fabricate _bmad/_config/manifest.yaml ────────────────────────────

note "setup: minimal _bmad/ skeleton"
mkdir -p _bmad/_config
mkdir -p _bmad/core _bmad/bmm
cat > _bmad/_config/manifest.yaml <<'YAML'
installation:
  version: "v6.7.1"
  installDate: "2026-05-21T00:00:00.000Z"
  lastUpdated: "2026-05-21T00:00:00.000Z"
modules:
  - name: core
    version: "v6.7.1"
    installDate: "2026-05-21T00:00:00.000Z"
    lastUpdated: "2026-05-21T00:00:00.000Z"
    source: built-in
    npmPackage: null
    repoUrl: null
  - name: bmm
    version: "v6.7.1"
    installDate: "2026-05-21T00:00:00.000Z"
    lastUpdated: "2026-05-21T00:00:00.000Z"
    source: built-in
    npmPackage: null
    repoUrl: null
ides: []
YAML
printf 'canonicalId,name,description,module,path\n' > _bmad/_config/skill-manifest.csv
printf 'type,name,module,path,hash\n' > _bmad/_config/files-manifest.csv
ok "skeleton seeded at ${WORKDIR}/_bmad/"

# ─── 1. list (empty) ─────────────────────────────────────────────────────────
note "list (no modules)"
run list
assert_exit 0 "list empty"
[[ "${STDOUT}" == *"no modules installed"* ]] && ok "stdout reports empty" \
  || ko "expected 'no modules installed' in stdout: ${STDOUT}"

# ─── 2. dry-run install of minimal module ────────────────────────────────────
note "install --dry-run examples/minimal/acme-md-lint"
run install "${EXAMPLES}/minimal/acme-md-lint" --dry-run
assert_exit 0 "dry-run install"
[[ "${STDOUT}" == *"dry-run"* ]] && ok "stdout mentions dry-run" \
  || ko "expected 'dry-run' in stdout: ${STDOUT}"
assert_path_absent "_bmad/mdlint"

# ─── 3. real install of minimal module ───────────────────────────────────────
note "install examples/minimal/acme-md-lint"
run install "${EXAMPLES}/minimal/acme-md-lint"
assert_exit 0 "install minimal"
assert_path_exists "_bmad/mdlint/.claude-plugin/plugin.json"
assert_path_exists "_bmad/mdlint/skills/acme-md-lint/SKILL.md"
assert_grep '^  - name: mdlint' "_bmad/_config/manifest.yaml"
assert_grep 'source: community' "_bmad/_config/manifest.yaml"
assert_grep '"acme-md-lint","acme-md-lint"' "_bmad/_config/skill-manifest.csv"
assert_grep ',"mdlint",' "_bmad/_config/files-manifest.csv"

# ─── 4. list (one module) ────────────────────────────────────────────────────
note "list (after minimal install)"
run list
assert_exit 0 "list one"
[[ "${STDOUT}" == *"mdlint"* ]] && ok "stdout includes mdlint" \
  || ko "expected 'mdlint' in stdout: ${STDOUT}"

run list --json
assert_exit 0 "list --json"
[[ "${STDOUT}" == *"\"name\": \"mdlint\""* ]] && ok "json includes mdlint name" \
  || ko "expected mdlint in JSON: ${STDOUT}"

# ─── 5. idempotent re-install ────────────────────────────────────────────────
note "install acme-md-lint again (idempotent / collision)"
# Local sources have no sha, so the no-op fast path can't trigger — we hit
# the collision branch instead. Asserting exit 30 documents the v1 behavior:
# local re-installs require `update`.
run install "${EXAMPLES}/minimal/acme-md-lint"
assert_exit 30 "re-install collision"

# ─── 6. negative: reserved-code fixture ──────────────────────────────────────
note "install module-reserved-code → exit 21"
run install "${FIXTURES}/module-reserved-code"
assert_exit 21 "reserved code"

# ─── 7. negative: bad-traversal fixture ──────────────────────────────────────
note "install module-bad-traversal → exit 70"
run install "${FIXTURES}/module-bad-traversal"
assert_exit 70 "path traversal"

# ─── 8. negative: missing-fields fixture ─────────────────────────────────────
note "install module-bad-missing-fields → exit 20"
run install "${FIXTURES}/module-bad-missing-fields"
assert_exit 20 "missing required fields"

# ─── 9. comprehensive module install ─────────────────────────────────────────
note "install examples/comprehensive/acme-devlog"
run install "${EXAMPLES}/comprehensive/acme-devlog"
assert_exit 0 "install comprehensive"
assert_path_exists "_bmad/devlog/skills/bmad-devlog-write/SKILL.md"
assert_path_exists "_bmad/devlog/skills/bmad-devlog-setup/SKILL.md"
assert_path_exists "_bmad/devlog/agents/changelog-archivist.md"
# hooks/mcpServers are flattened to canonical root slots (see rewriteManifestPaths)
assert_path_exists "_bmad/devlog/hooks.json"
assert_path_exists "_bmad/devlog/.mcp.json"
# install.ignore excludes docs/ and tests/ and README.md / CHANGELOG.md
assert_path_absent "_bmad/devlog/docs"
assert_path_absent "_bmad/devlog/README.md"
assert_path_absent "_bmad/devlog/CHANGELOG.md"
[[ "${STDOUT}" == *"hooks"* ]] && ok "warns about hooks not auto-activated" \
  || ko "expected hooks warning in stdout: ${STDOUT}"

# ─── 10. remove minimal (no purge), preserve custom ─────────────────────────
note "create _bmad/custom/mdlint to test preservation, then remove"
mkdir -p _bmad/custom/mdlint
echo "user override" > _bmad/custom/mdlint/override.md
run remove mdlint
assert_exit 0 "remove mdlint"
assert_path_absent "_bmad/mdlint"
assert_path_exists "_bmad/custom/mdlint/override.md"
[[ "${STDOUT}" == *"preserved"* ]] && ok "stdout mentions preserved customs" \
  || ko "expected 'preserved' in stdout: ${STDOUT}"
# manifest rows for mdlint should be gone
grep -q ',"mdlint",' _bmad/_config/files-manifest.csv && \
  ko "mdlint rows still in files-manifest.csv" || ok "files-manifest.csv pruned"
grep -q '"acme-md-lint"' _bmad/_config/skill-manifest.csv && \
  ko "acme-md-lint row still in skill-manifest.csv" || ok "skill-manifest.csv pruned"

# ─── 11. remove --purge ──────────────────────────────────────────────────────
note "remove devlog --purge"
mkdir -p _bmad/custom/devlog
echo "user override" > _bmad/custom/devlog/override.md
run remove devlog --purge
assert_exit 0 "remove --purge"
assert_path_absent "_bmad/devlog"
assert_path_absent "_bmad/custom/devlog"

# ─── 12. remove unknown ──────────────────────────────────────────────────────
note "remove unknown code"
run remove nope
assert_exit 90 "remove unknown"

# ─── 13. IDE distribution into the user's chosen coding assistants ───────────
# Uses a SEPARATE project whose manifest lists two IDEs, so install/remove must
# push skills to (and prune them from) those IDE dirs via the vendored ide-sync
# bundle. Fully offline — no npx, no network, no node_modules.
note "IDE distribution: install/remove sync to configured assistants"
IDEPROJ="${WORKDIR}/ideproj"
mkdir -p "${IDEPROJ}/_bmad/_config"
cat > "${IDEPROJ}/_bmad/_config/manifest.yaml" <<'YAML'
installation:
  version: "v6.7.1"
  installDate: "2026-05-21T00:00:00.000Z"
  lastUpdated: "2026-05-21T00:00:00.000Z"
modules: []
ides:
  - claude-code
  - cursor
YAML
printf 'canonicalId,name,description,module,path\n' > "${IDEPROJ}/_bmad/_config/skill-manifest.csv"
printf 'type,name,module,path,hash\n' > "${IDEPROJ}/_bmad/_config/files-manifest.csv"

run install "${EXAMPLES}/minimal/acme-md-lint" --project-dir "${IDEPROJ}"
assert_exit 0 "install into IDE project"
assert_path_exists "${IDEPROJ}/.claude/skills/acme-md-lint/SKILL.md"
assert_path_exists "${IDEPROJ}/.agents/skills/acme-md-lint/SKILL.md"
[[ "${STDOUT}" == *"claude-code"* ]] && ok "stdout reports claude-code distribution" \
  || ko "expected claude-code in stdout: ${STDOUT}"
# Canonical end-state: skill source dirs removed from _bmad/ after distribution.
if find "${IDEPROJ}/_bmad" -name SKILL.md | grep -q .; then
  ko "SKILL.md still under _bmad after distribution"
else
  ok "_bmad skill dirs cleaned after distribution"
fi

run remove mdlint --project-dir "${IDEPROJ}"
assert_exit 0 "remove from IDE project"
assert_path_absent "${IDEPROJ}/.claude/skills/acme-md-lint"
assert_path_absent "${IDEPROJ}/.agents/skills/acme-md-lint"

# ─── Summary ─────────────────────────────────────────────────────────────────
echo
echo "──────────────────────────────────────────────────────────────────────"
printf '  %d pass · %d fail\n' "${pass}" "${fail}"
if [[ "${fail}" -gt 0 ]]; then
  echo "  FAIL"
  exit 1
fi
echo "  OK"
