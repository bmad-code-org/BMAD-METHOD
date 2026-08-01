---
---

# Step 5: Present

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- NEVER auto-push.

## INSTRUCTIONS

### Generate Suggested Review Order

Read `{baseline_revision}` from `{spec_file}` frontmatter in manifest-story mode or `{baseline_commit}` in standalone mode. If the selected baseline exists and resolves to a reachable version-control revision, construct the diff of all changes since it. If it is missing, `NO_VCS`, invalid, or unreachable, use best effort to construct the current reviewed diff instead. Do not rewrite either baseline field during this fallback.

Write the review order as a `## Suggested Review Order` section in `{spec_file}`. Normally append it **after the last existing section**. If this run entered review from a `done` spec for a fresh review pass and a Suggested Review Order already exists, replace the existing section with the newly generated section instead of appending a duplicate. Do not modify the Code Map.

Build the trail as an ordered sequence of **stops** — clickable `path:line` references with brief framing — optimized for a human reviewer reading top-down to understand the change:

1. **Order by concern, not by file.** Group stops by the conceptual concern they address (e.g., "validation logic", "schema change", "UI binding"). A single file may appear under multiple concerns.
2. **Lead with the entry point** — the single highest-leverage file:line a reviewer should look at first to grasp the design intent.
3. **Inside each concern**, order stops from most important / architecturally interesting to supporting. Lightly bias toward higher-risk or boundary-crossing stops.
4. **End with peripherals** — tests, config, types, and other supporting changes come last.
5. **Every code reference is a clickable spec-file-relative link.** Compute each link target as a relative path from `{spec_file}`'s directory to the changed file. Format each stop as a markdown link: `[short-name:line](../../path/to/file.ts#L42)`. Use a `#L` line anchor. Use the file's basename (or shortest unambiguous suffix) plus line number as the link text. The relative path must be dynamically derived — never hardcode the depth.
6. **Each stop gets one ultra-concise line of framing** (≤15 words) — why this approach was chosen here and what it achieves in the context of the change. No paragraphs.

Format each stop as framing first, link on the next indented line:

```markdown
## Suggested Review Order

**{Concern name}**

- {one-line framing}
  [`file.ts:42`](../../src/path/to/file.ts#L42)

- {one-line framing}
  [`other.ts:17`](../../src/path/to/other.ts#L17)

**{Next concern}**

- {one-line framing}
  [`file.ts:88`](../../src/path/to/file.ts#L88)
```

> The `../../` prefix above is illustrative — compute the actual relative path from `{spec_file}`'s directory to each target file.

When there is only one concern, omit the bold label — just list the stops directly.

### Mark Spec Done

In standalone mode, change `{spec_file}` status to `done` in the frontmatter now, then follow `./sync-sprint-status.md` with `target_status` = `review`. In manifest-story mode, defer the `done` transition and sprint-status sync until `final_revision` is captured below.

### Commit and Complete

**Manifest-story mode:** use Build Auto-compatible revision finalization.

- If version control is unavailable, write `final_revision: NO_VCS` and `status: done` to `{spec_file}`.
- If version control is available, commit the reviewed implementation changes that remain uncommitted with a conventional message derived from the spec title, keeping the tracked story spec itself for the spec-finalization commit. Obtain the current full canonical revision directly from version control and preserve it verbatim as `final_revision`; then write that field and `status: done` into `{spec_file}`.
- After either path writes `status: done`, follow `./sync-sprint-status.md` with `target_status` = `review`.
- If version control is available and `{spec_file}` is tracked in this working copy, commit only `{spec_file}` as a spec-finalization commit and keep `final_revision` unchanged. Verify every reviewed implementation file appears after `baseline_revision` and the working copy is clean. HALT explicitly if finalization leaves it dirty.

Never add `final_commit` or `baseline_commit` fields to a manifest story.

**Standalone mode:** if version control is available and the tree is dirty, create a local commit with a conventional message derived from the spec title. Preserve the existing standalone frontmatter and commit behavior.

{workflow.open_spec}

### Display Summary

Display summary of your work to the user, including the commit hash if one was created. Any file paths shown in conversation/terminal output must use CWD-relative format (no leading `/`) with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability — the goal is to make paths clickable in terminal emulators.

Offer to push and/or create a pull request.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{workflow.on_complete}
