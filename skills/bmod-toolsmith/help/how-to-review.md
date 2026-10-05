# How to: review a skill

Read this when the user has a skill, theirs or someone else's, and wants to know whether it is any good, how to make it leaner, or why it misbehaves.

1. **Point Smithy at the folder.** Review mode reads nothing but the skill; it works on an installed skill, a skill in a repository, or one pasted into a folder.
2. **Pre-pass.** A script measures it: tokens per file and what one run loads, the description's length and parts, whether frontmatter is valid, which scripts have headers and tests, every path that does not resolve, calls that should be `uv run`, scripts that touch customization files, and how it is registered.
3. **Five lenses**, run as parallel readers over every file a model would read: architecture (files, paths, shape, registration), determinism (what should be a script and what should be prose), leanness (what a capable model would do unasked, duplication, the smallest version), customization (declared values that reach nothing, overrides that cannot land), trigger (the description against the near misses).
4. **Findings**, in chat two lines each and in a markdown file in the eval-reports folder, merged, deduplicated and ordered by severity, each naming the file it is in and the fix. Nothing fails or blocks; the report is advice.
5. **Act on it.** Edit mode applies the findings the user accepts. For cuts the user is unsure about, a variant eval shows whether the section earned its place (`help/evals.md`).

For a skill Smithy just built, the lenses already ran and the defects are fixed; review is for skills he did not write, or for a second opinion later.
