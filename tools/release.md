# Release Runbook — BMAD-METHOD

Release the skills in `bmad-code-org/BMAD-METHOD`, then rebuild the Claude and
Codex plugins. This process does not publish to npm. Maintenance of the npm
installer stays on `V6.12`.

## Branch model

- `dev` receives development PRs and carries the next patch placeholder between
  releases, for example `6.13.1-next`.
- `main` is the default branch and serves releases. It requires a PR and passing
  checks, and cannot be deleted.
- Stamp the release on `dev`, merge its PR into `main` with a merge commit, and
  tag that merge commit. Then stamp the next placeholder on `dev`. There are
  no release branches and no back-merge.
- Only release PRs from `dev` target `main`. The retargeting workflow redirects
  other newly opened PRs to `dev`; it becomes active when installed on `main`.

## 1. Prepare a clean checkout

You need Git, GitHub CLI (`gh`), push access to BMAD-METHOD, the Node version
in `.nvmrc`, and `uv`. The stamper also works with plain Python 3.11 or later;
it uses only the standard library.

Coordinate with maintainers to pause other pushes and merges into `dev`.
Complete the stamp, release merge, tag, and next-placeholder stamp in one
sitting. Keep that pause in place until the placeholder is pushed.

```bash
git clone --branch dev git@github.com:bmad-code-org/BMAD-METHOD.git
cd BMAD-METHOD
git status --porcelain
git fetch origin
git switch dev
git pull --ff-only origin dev
```

If reusing a checkout, start there instead of cloning. Stop if the status is
not empty, if local `dev` has unpublished commits, or if any command fails.

## 2. Choose the version

Supply both versions explicitly. For example:

```bash
bmad_release_version=6.13.0
bmad_next_version=6.13.1-next
```

The release version must:

- be SemVer (`MAJOR.MINOR.PATCH`, optionally a prerelease such as `-rc.1`);
- not contain `-dev`, which the update checker cannot order;
- have no build metadata (`+...`), which the update checker ignores;
- differ from the version `main` currently serves.

The stamper enforces the first three rules. Check the last yourself:

```bash
git show origin/main:skills/bmad/module-manifest.toml
git tag --list "v$bmad_release_version"
```

For the first skills release, `main` still contains the 6.12 npm installer and
has no skill manifest. Inspect `git show origin/main:package.json` instead.
Never reuse a release version or an existing tag. Tags matching `v*` are
immutable.

## 3. Stamp and review dev

```bash
uv run --python 3.11 tools/stamp_release.py "$bmad_release_version"
git diff --stat
git diff
```

The summary lists all 29 skill manifests plus `package.json` and
`package-lock.json`. Only version values should change, including both the
lockfile's top-level version and its root package version. Dependency versions
must not change.

The stamper validates every manifest's exact keys, module, update source, and
knowledge value, and checks package metadata before writing. It verifies the
files afterward, including byte identity of manifests within each module.
A write or final verification failure can leave a partial stamp. Inspect and
restore only the stamp's changes before fixing the problem and rerunning.

```bash
git add skills/*/module-manifest.toml package.json package-lock.json
git commit -m "chore(release): v$bmad_release_version"
bmad_release_commit=$(git rev-parse HEAD)
npm ci && npm run quality
git push origin dev
```

Run the quality gate on committed `HEAD` in this exact checkout before every
push. If any check fails, stop and fix it before proceeding.

## 4. Merge the release PR

```bash
bmad_release_pr=$(gh pr create --base main --head dev \
  --title "chore(release): v$bmad_release_version" \
  --body "Release the stamped skills and package metadata from dev.")
gh pr checks "$bmad_release_pr" --required --watch
gh pr diff "$bmad_release_pr"
```

Review the release and obtain the required approvals. Confirm that `dev` still
points to the stamp commit and no other changes landed during the release:

```bash
git fetch origin
test "$(git rev-parse origin/dev)" = "$bmad_release_commit"
gh pr merge "$bmad_release_pr" --merge --match-head-commit "$bmad_release_commit"
```

Use a merge commit; do not squash, rebase, delete `dev`, or bypass required
checks. If the head changed, stop and review the new release contents before
trying again.

## 5. Tag the merge commit

```bash
git fetch origin
bmad_release_merge=$(gh pr view "$bmad_release_pr" --json mergeCommit --jq '.mergeCommit.oid')
test "$(git rev-parse origin/main)" = "$bmad_release_merge"
test "$(git rev-parse "$bmad_release_merge^2")" = "$bmad_release_commit"
git switch --detach "$bmad_release_merge"
git show HEAD:skills/bmad/module-manifest.toml
npm ci && npm run quality
git tag -a "v$bmad_release_version" -m "Release v$bmad_release_version"
git push origin "refs/tags/v$bmad_release_version"
```

Verify that the manifest shows the intended release version before tagging.
The tag identifies the merged commit on `main`, not the stamp commit on
`dev`. Never force-push a branch or tag.

## 6. Stamp the next placeholder on dev

```bash
git switch dev
git fetch origin
test "$(git rev-parse HEAD)" = "$bmad_release_commit"
test "$(git rev-parse origin/dev)" = "$bmad_release_commit"
uv run --python 3.11 tools/stamp_release.py "$bmad_next_version"
git diff
git add skills/*/module-manifest.toml package.json package-lock.json
git commit -m "chore: bump placeholder version to $bmad_next_version"
npm ci && npm run quality
git push origin dev
```

Review the same version-only changes before committing. Do not merge `main`
back into `dev`. Development can resume after the placeholder is pushed.

## 7. Verify the release

```bash
git fetch origin
git show origin/main:skills/bmad/module-manifest.toml
git show origin/dev:skills/bmad/module-manifest.toml
git rev-parse "v$bmad_release_version^{}"
```

Expect the release version on `main`, the next placeholder on `dev`, and the
tag resolving to the release merge commit. Package metadata on each branch
must match that branch's manifests.

Installed copies check `main` through `raw.githubusercontent.com`, which
caches files for around five minutes. Immediately after a release, update
checks may still report the previous version. Verify through Git first, or
wait a few minutes before trusting the raw-file response.

## 8. Rebuild the plugins

The Claude and Codex plugins ship from `bmad-code-org/bmad-plugins`. In its
checkout, confirm the release script sources `bmad-code-org/BMAD-METHOD`
`main`, then run `python3 release.py`. Follow that repository's instructions
to review, validate, commit, and push the generated plugins.

Verify the new release through all three install routes: `npx skills add
bmad-code-org/BMAD-METHOD`, the Claude marketplace, and the Codex marketplace.
The plugin repository's README documents its install commands.
