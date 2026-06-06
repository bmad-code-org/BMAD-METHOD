#!/usr/bin/env bash
# integration.test.sh — end-to-end smoke test for the bmad-module skill.
#
# Hermetic: fabricates a minimal _bmad/_config/manifest.yaml skeleton in a
# tmp dir and exercises every verb against the vendored reference modules
# (tests/fixtures/examples/) and negative fixtures. Does NOT require
# BMAD-METHOD's installer; installer integration is verified separately.
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
# self-contained — the fixtures travel with the test, no external checkout.
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
# Central config as `bmad install` would leave it: [core] supplies output_folder
# so module defaults that reference {output_folder} resolve during config-gen.
cat > _bmad/config.toml <<'TOML'
# Installer-managed. Regenerated on install.

[core]
user_name = "Tester"
output_folder = "{project-root}/_bmad-output"
TOML
printf '# Installer-managed.\n\n[core]\ncommunication_language = "English"\n' > _bmad/config.user.toml
# Core ships a canonical module-help.csv so the merged catalog has a baseline row.
printf 'module,skill,display-name,menu-code,description,action,args,phase,preceded-by,followed-by,required,output-location,outputs\n,bmad-help,Help,h,Show the BMAD help catalog,bmad-help,,,,,,,\n' > _bmad/core/module-help.csv
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
note "install examples/comprehensive/acme-devlog (with --set override)"
run install "${EXAMPLES}/comprehensive/acme-devlog" --set devlog.devlog_path='{output_folder}/journal'
assert_exit 0 "install comprehensive"
assert_path_exists "_bmad/devlog/skills/bmad-devlog-write/SKILL.md"
assert_path_exists "_bmad/devlog/skills/bmad-devlog-setup/SKILL.md"
assert_path_exists "_bmad/devlog/agents/changelog-archivist.md"
# hooks/mcpServers are flattened to canonical root slots (see rewriteManifestPaths)
assert_path_exists "_bmad/devlog/hooks.json"
assert_path_exists "_bmad/devlog/.mcp.json"
# moduleDefinition / moduleHelpCsv are also flattened to the module root even
# though they live inside the setup skill's assets/ dir.
assert_path_exists "_bmad/devlog/module.yaml"
assert_path_exists "_bmad/devlog/module-help.csv"
# install.ignore excludes docs/ and tests/ and README.md / CHANGELOG.md
assert_path_absent "_bmad/devlog/docs"
assert_path_absent "_bmad/devlog/README.md"
assert_path_absent "_bmad/devlog/CHANGELOG.md"
[[ "${STDOUT}" == *"hooks"* ]] && ok "warns about hooks not auto-activated" \
  || ko "expected hooks warning in stdout: ${STDOUT}"

# ─── 9a. parity: central config + agent roster (gap #3) ──────────────────────
note "config generation + agent roster"
assert_grep '^\[modules\.devlog]' "_bmad/config.toml"
# --set override resolves {output_folder} from [core] and applies the result template
assert_grep 'devlog_path = "\{project-root}/_bmad-output/journal"' "_bmad/config.toml"
assert_grep '^\[agents\.bmad-agent-historian]' "_bmad/config.toml"
assert_grep 'module = "devlog"' "_bmad/config.toml"
# [core] is preserved untouched
assert_grep '^user_name = "Tester"' "_bmad/config.toml"
# user-scoped answer lands in config.user.toml, not config.toml
assert_grep '^\[modules\.devlog]' "_bmad/config.user.toml"
assert_grep 'entry_format = "iso"' "_bmad/config.user.toml"

# ─── 9b. parity: module working directories (gap #2) ─────────────────────────
note "module directory creation"
assert_path_exists "_bmad-output/journal"

# ─── 9c. parity: merged help catalog (gap #1) ────────────────────────────────
note "bmad-help.csv merge"
assert_path_exists "_bmad/_config/bmad-help.csv"
head -1 _bmad/_config/bmad-help.csv | grep -q '^module,skill,display-name,' \
  && ok "bmad-help.csv has canonical header" || ko "bmad-help.csv header wrong"
assert_grep '^devlog,bmad-devlog-write,' "_bmad/_config/bmad-help.csv"
assert_grep '^devlog,bmad-agent-historian,' "_bmad/_config/bmad-help.csv"
# the core baseline row is still present
assert_grep ',bmad-help,Help,' "_bmad/_config/bmad-help.csv"

# ─── 9d. legacy module (marketplace.json + module.yaml, strategy 1) ──────────
note "install examples/legacy/bmad-mini-legacy (legacy marketplace.json)"
run install "${EXAMPLES}/legacy/bmad-mini-legacy"
assert_exit 0 "install legacy mini"
[[ "${STDOUT}" == *"resolved legacy module mlg"* ]] && ok "stdout reports legacy resolution" \
  || ko "expected 'resolved legacy module mlg' in stdout: ${STDOUT}"
# Synthetic plugin.json is staged; marketplace.json is preserved verbatim.
assert_path_exists "_bmad/mlg/.claude-plugin/plugin.json"
assert_path_exists "_bmad/mlg/.claude-plugin/marketplace.json"
# Skills under src/agents and src/workflows are flattened to skills/<basename>.
assert_path_exists "_bmad/mlg/skills/mlg-agent-one/SKILL.md"
assert_path_exists "_bmad/mlg/skills/mlg-flow/SKILL.md"
# module.yaml / module-help.csv flattened from src/ to the module root.
assert_path_exists "_bmad/mlg/module.yaml"
assert_path_exists "_bmad/mlg/module-help.csv"
# Undeclared trees are dropped — src/ wrapper and docs/ must not leak.
assert_path_absent "_bmad/mlg/src"
assert_path_absent "_bmad/mlg/docs"
# The staged manifest carries canonical rewritten paths.
assert_grep '"\./skills/mlg-agent-one"' "_bmad/mlg/.claude-plugin/plugin.json"
assert_grep '"\./module\.yaml"' "_bmad/mlg/.claude-plugin/plugin.json"
# Registered and merged like any community module. The manifest `name` is the
# kebab plugin name (module.yaml#name "MLG: …" would fail NAME_REGEX).
assert_grep '^  - name: mlg' "_bmad/_config/manifest.yaml"
assert_grep 'source: community' "_bmad/_config/manifest.yaml"
assert_grep '^mlg,' "_bmad/_config/bmad-help.csv"

# ─── 9e. legacy with a reserved first-party code (gds) ───────────────────────
note "install examples/legacy/bmad-reserved-legacy (reserved code on legacy path)"
run install "${EXAMPLES}/legacy/bmad-reserved-legacy"
assert_exit 0 "install legacy reserved code"
assert_path_exists "_bmad/gds/module.yaml"
assert_path_exists "_bmad/gds/skills/gds-agent-demo/SKILL.md"

# ─── 9f. legacy synthesize fallback (strategy 5, no module.yaml) ─────────────
note "install examples/legacy/bmad-synth-legacy (synthesized module.yaml)"
run install "${EXAMPLES}/legacy/bmad-synth-legacy"
assert_exit 0 "install legacy synth fallback"
# module.yaml + module-help.csv are synthesized and written into the module root.
assert_path_exists "_bmad/synthlg/module.yaml"
assert_path_exists "_bmad/synthlg/module-help.csv"
assert_path_exists "_bmad/synthlg/skills/synthlg-do-thing/SKILL.md"
assert_grep '^code: synthlg' "_bmad/synthlg/module.yaml"
assert_grep '^module,skill,display-name,' "_bmad/synthlg/module-help.csv"

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
# config blocks and help rows for devlog are stripped on removal
grep -q '\[modules\.devlog]' _bmad/config.toml \
  && ko "[modules.devlog] still in config.toml" || ok "config.toml [modules.devlog] stripped"
grep -q '\[agents\.bmad-agent-historian]' _bmad/config.toml \
  && ko "[agents.bmad-agent-historian] still in config.toml" || ok "config.toml agent block stripped"
grep -q '\[modules\.devlog]' _bmad/config.user.toml \
  && ko "[modules.devlog] still in config.user.toml" || ok "config.user.toml [modules.devlog] stripped"
grep -q '^devlog,' _bmad/_config/bmad-help.csv \
  && ko "devlog rows still in bmad-help.csv" || ok "bmad-help.csv devlog rows removed"
# [core] survives the removal
assert_grep '^user_name = "Tester"' "_bmad/config.toml"

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

# ─── 14. npm dependency install (gap #4) ─────────────────────────────────────
# A module shipping package.json. package.json/package-lock.json are copied to
# the module root; if npm is available, deps are installed in place. The fixture
# has no dependencies, so npm resolves offline. Guarded on npm availability so
# CI sandboxes without npm still pass.
note "npm fixture: package.json copied + deps installed in place"
run install "${EXAMPLES}/minimal-npm/acme-npmtool"
assert_exit 0 "install npm fixture"
assert_path_exists "_bmad/npmtool/package.json"
if command -v npm >/dev/null 2>&1; then
  [[ "${STDOUT}" == *"installed npm dependencies for npmtool"* ]] \
    && ok "npm dependencies installed" \
    || ko "expected npm install confirmation in stdout: ${STDOUT}"
  # The fixture has zero deps, so npm writes package-lock.json (not node_modules);
  # its presence proves npm actually ran inside the installed module dir.
  assert_path_exists "_bmad/npmtool/package-lock.json"
else
  ok "npm not on PATH — skipping dependency-install assertion"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo
echo "──────────────────────────────────────────────────────────────────────"
printf '  %d pass · %d fail\n' "${pass}" "${fail}"
if [[ "${fail}" -gt 0 ]]; then
  echo "  FAIL"
  exit 1
fi
echo "  OK"
