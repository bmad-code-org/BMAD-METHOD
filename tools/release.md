# Release Runbook — bmad-skills Mirror

How to cut a versioned release of `bmad-code-org/bmad-skills`. Follow it top to
bottom on a local clone of that repository; it needs no other document.

## Prerequisites

- Push access to `git@github.com:bmad-code-org/bmad-skills.git` over SSH.
- `uv`, or plain Python >= 3.11 — the stamper uses only the standard library,
  so `python3 tools/stamp_release.py <version>` works wherever the `uv run`
  command below appears.

## Branch model

- `dev` is the development branch. It is force-pushed from the source repo and
  always carries the placeholder version (for example `6.11.0-next`). It is
  never stamped.
- `main` is the default branch and is release-only. Installed copies check for
  updates against `main`, so what `main` serves defines the released version.
- Every release rewrites `main`: `main` is always the current `dev` plus
  exactly one stamp commit. It is never a fast-forward of the previous
  release, which is why the push below force-pushes.

## 1. Prepare a clean checkout of dev

```bash
git clone git@github.com:bmad-code-org/bmad-skills.git   # or reuse an existing clone
cd bmad-skills
git status --porcelain        # must print nothing; stop and clean up if it does
git fetch origin
git checkout --detach origin/dev
```

Working detached keeps the stamp commit off the local `dev` branch — `dev`
stays unstamped everywhere.

## 2. Choose the version

You supply the version; the tooling never derives or increments it. It must:

- be SemVer (`MAJOR.MINOR.PATCH`, optional prerelease such as `-rc.1`),
- not contain `-dev` (the update check cannot order `-dev` versions, so
  installed copies would never learn they are current or outdated),
- differ from the version `main` currently serves — stamping the same version
  again is a no-op for installed copies, so a release must change it. Build
  metadata (`+...`) does not count as a change: the update check ignores it,
  so `6.12.0+hotfix` compares equal to `6.12.0` and installed copies would
  never see such a release. Change the major, minor, patch, or prerelease
  part.

Check what `main` serves now:

```bash
git show origin/main:skills/bmad/module-manifest.toml
```

## 3. Stamp

```bash
uv run --python 3.11 tools/stamp_release.py <version>
```

Expected: exit 0 and a summary listing every `skills/*/module-manifest.toml`.
Nothing else is stamped — plugin metadata (Claude/Codex plugin.json,
marketplace catalogs) gets its version from `skills/bmad/module-manifest.toml`
when those artifacts are built. If it exits nonzero, the tree may be left
half-stamped (the script writes the files before its final verification), so
restore it with `git checkout -- .` first, then fix the reported problem and
rerun.

## 4. Review the diff

```bash
git diff --stat
git diff
```

Expected: only the files from the stamp summary, and within each file only the
version value changed.

## 5. Commit and push to main

```bash
git commit -am "chore(release): v<version>"
git push --force-with-lease origin HEAD:main
```

The force push is expected on every release (see the branch model above).
`--force-with-lease` makes it fail if someone else moved `main` since your
fetch; if that happens, start over from step 1.

## 6. Verify

```bash
git fetch origin
git show origin/main:skills/bmad/module-manifest.toml   # version = "<version>"
git show origin/dev:skills/bmad/module-manifest.toml    # still the placeholder
```
