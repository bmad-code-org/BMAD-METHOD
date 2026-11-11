# How to: share a skill or module

Read this when the user wants other people or projects to install what they built, or asks how a module gets published or updated.

1. **Package it.** A skill Smithy built is usually registered already. Otherwise package mode wraps it, and asks for the `update_source`: the pushed repository and the folder holding the skill folders, as in `github:<owner>/<repo>/skills`.
2. **Lay out the repository.** Skills sit under `skills/`, with the `bmod-<code>/` record beside them for a multi-skill module. There is no registry or build step.
3. **Validate.** Validate mode reports what would stop it installing, loading or firing.
4. **Try a local install.** In a separate test project, `npx skills add <folder>`, then `bmad setup <code>` and `bmad status`.
5. **Publish.** Push and tag a release. Others run `npx skills add <owner>/<repo>`, including the record, then `bmad setup <code>`. A tag pins them: `<owner>/<repo>#v1.2.0`.
6. **Ship updates.** Bump the record's `version` on every release, because `bmad setup` compares it to offer the update. On GitHub that check reads the `main` branch. Rename or remove a skill through `retired.toml`, and never reuse a retired name. When users' files must change, ship a migration, which `bmad migrate` runs.

Offer a baseline eval before a first release: for a distributed skill, only that shows it beats the bare model on real cases (`help/evals.md`). Several modules can share a repository, but the repository validator needs all their records at one version.
