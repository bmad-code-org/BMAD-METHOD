---
---

# Step 5: Present

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- Do not present options or offers.

## INSTRUCTIONS

### Generate Suggested Review Order

Read `{baseline_revision}` from `{spec_file}` frontmatter and construct the diff of all changes since that revision.

Append the review order as a `## Suggested Review Order` section to `{spec_file}` **after the last existing section**. Do not modify the Code Map.

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

Change `{spec_file}` status to `done` in the frontmatter.

Follow `./sync-sprint-status.md` with `{target_status}` = `review`.

### Append Result Report

Append `## Auto Run Result` to `{spec_file}` **after** `## Suggested Review Order`. Include:

- `Status: done`
- Summary of implemented change
- Files changed with one-line descriptions
- Review findings breakdown: patches applied, items deferred, items rejected
- Verification performed, including command outcomes or manual inspection notes
- Any residual risks

### Display Summary

Display summary of your work to the user. Any file paths shown in conversation/terminal output must use CWD-relative format (no leading `/`) with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability — the goal is to make paths clickable in terminal emulators. Mention that `{spec_file}` now contains a Suggested Review Order and Auto Run Result.

Workflow complete.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.
