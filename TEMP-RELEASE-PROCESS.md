# Temporary Release Process (branch `feat/npx-skills-distribution`)

> **Before merging this branch into `main`, replace this file with the real
> release process instructions and update the pointer in `AGENTS.md`.**
> Everything below describes a rehearsal against a throwaway repo, not how
> BMAD actually ships.

## Test mirror

`bmad-code-org/bmad-skills` is a disposable mirror of the
`feat/npx-skills-distribution` branch. It is the testbed for both halves of the
new distribution: the npx install/update flow (the module manifests'
`update_source` points at it) and the release process that feeds it. Nothing
here ships to users yet — the mirror exists so the flow can be exercised end to
end before it moves to the real distribution repo.

Its `dev` branch mirrors `feat/npx-skills-distribution`; after the quality gate
passes, refresh it with:

```bash
git push --force git@github.com:bmad-code-org/bmad-skills.git feat/npx-skills-distribution:dev
```

`main` stays the mirror's default branch but is release-only: it receives
stamped releases (current `dev` plus one version-stamp commit) cut by following
`tools/release.md`. Never stamp `dev` itself. Rehearse release changes against
the mirror first — versions burned there are throwaway.

## Version numbers to use

Stamp mirror releases as `0.0.0-next.N` — `0.0.0-next.1`, then `0.0.0-next.2`,
and so on. The `0.0.0` base keeps every rehearsal sorted below any real BMAD
version, so a burnt number can never be mistaken for a shipped release, and the
incrementing `next.N` suffix still orders correctly for the update check (which
is the thing being tested). Do not reuse a number: `tools/release.md` requires
each release to change the version `main` serves, and build metadata (`+...`)
does not count as a change.
