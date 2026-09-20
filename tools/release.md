# Release Runbook — BMAD-METHOD

`dev` receives development PRs; `main` is the default, release-only branch. Release by fast-forwarding `main` to a stamped commit on `dev`, then tag it. No release branches, release PRs, merge commits, or back-merges are needed. `main` stays an ancestor of `dev`. Only maintainers may push to `main`, with required status checks and force-push/deletion blocked.

This is a hand-run process. It does not publish to npm; npm maintenance stays on `V6.12`. Use Git, `uv`, and the Node version in `docs-site/.nvmrc`. Pause other pushes and merges into `dev` until the next placeholder is pushed. Do the release in one sitting. Stop on any failed command or unexpected diff.

The version lives in one place per module: the `version` line in the `[bmod]` table of `skills/bmod-method/bmod.toml` and `skills/bmod-core-tools/bmod.toml`. The skills of a module carry no version. Every module record in this repository carries the same version, and the stamper writes them together.

## 1. Prepare

Start in a clean BMAD-METHOD checkout with no unpublished commits:

```bash
git status --porcelain
git fetch origin
git switch dev
git pull --ff-only origin dev
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/dev)"
git merge-base --is-ancestor origin/main dev

bmad_release_version=6.13.0
bmad_next_version=6.13.1-next
git show origin/main:skills/bmod-core-tools/bmod.toml
git tag --list "v$bmad_release_version"
```

Choose the versions explicitly. The release must differ from what `main` serves and must not reuse a tag. Use SemVer, optionally with a prerelease; no `-dev` or build metadata (`+...`). The next placeholder is the next patch with `-next`. The stamper enforces the version syntax, not release history.

`main` has no `skills/bmod-core-tools/bmod.toml` until the first release that ships module records. For that release, take the version `main` serves from the newest tag: `git tag --list 'v*' --sort=-v:refname | head -1`.

## 2. Stamp and push dev

```bash
uv run --python 3.11 tools/stamp_release.py "$bmad_release_version"
git diff
git add skills/*/bmod.toml
git commit -m "chore(release): v$bmad_release_version"
bmad_release_commit=$(git rev-parse HEAD)
uv sync --frozen && (cd docs-site && npm ci) && uv run --frozen tools/quality.py
git push origin dev
```

Before it writes, the stamper runs the repository checks in `tools/validate_manifests.py`, the same ones the commit hook runs, and writes nothing if any of them fails. Review before committing: only the `[bmod]` version line in the two module records should change. Run the quality gate on committed `HEAD` in this checkout before pushing; keep that tested commit checked out through promotion/tagging. Wait for its required GitHub status checks to pass before promoting it.

## 3. Fast-forward main and tag

```bash
git fetch origin
test "$(git rev-parse HEAD)" = "$bmad_release_commit"
test "$(git rev-parse origin/dev)" = "$bmad_release_commit"
git merge-base --is-ancestor origin/main dev
git push origin dev:main
git fetch origin
test "$(git rev-parse origin/main)" = "$bmad_release_commit"
git tag -a "v$bmad_release_version" "$bmad_release_commit" -m "Release v$bmad_release_version"
git push origin "refs/tags/v$bmad_release_version"
```

The tag identifies the same stamped commit on `dev` and `main`. Never force a push or move a release tag. If `dev` moved, stop rather than including unreviewed changes in the release.

## 4. Stamp the next placeholder

```bash
git fetch origin
test "$(git rev-parse origin/dev)" = "$bmad_release_commit"
uv run --python 3.11 tools/stamp_release.py "$bmad_next_version"
git diff
git add skills/*/bmod.toml
git commit -m "chore: bump placeholder version to $bmad_next_version"
uv sync --frozen && (cd docs-site && npm ci) && uv run --frozen tools/quality.py
git push origin dev
```

Review the same version-only changes before committing. `main` and the tag retain the release version; `dev` carries the next placeholder. Development can resume. Nothing needs merging back.

## 5. Rebuild and verify

In the `bmad-code-org/bmad-plugins` checkout, confirm its release script sources `bmad-code-org/BMAD-METHOD` `main`, then run `python3 release.py`. Follow that repository's instructions to review, validate, commit, and push the plugins. Verify the release through `npx skills add bmad-code-org/BMAD-METHOD` and both the Claude and Codex marketplaces.

An installed module checks `main` through `raw.githubusercontent.com`, which caches files for around five minutes. Verify the release through Git first, or wait before trusting an update check that still reports the previous version.
