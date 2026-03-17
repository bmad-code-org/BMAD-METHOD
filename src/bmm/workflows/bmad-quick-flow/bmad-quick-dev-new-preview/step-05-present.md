---
---

# Step 5: Present

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- NEVER auto-push.

## INSTRUCTIONS

### Generate Suggested Review Order

Determine what changed:

- **Plan-code-review:** Read `{baseline_commit}` from `{spec_file}` frontmatter and construct the diff of all changes since that commit.
- **One-shot:** No baseline exists. Use the files you created or modified during implementation.

**Plan-code-review:** Append the review order as a `## Suggested Review Order` section to `{spec_file}` **after the last existing section**. Do not modify the Code Map.

**One-shot:** Display the review order directly in conversation output.

Build the trail as an ordered sequence of **stops** — clickable `path:line` references with brief framing — optimized for a human reviewer reading top-down to understand the change:

1. **Order by concern, not by file.** Group stops by the conceptual concern they address (e.g., "validation logic", "schema change", "UI binding"). A single file may appear under multiple concerns.
2. **Lead with the entry point** — the single highest-leverage file:line a reviewer should look at first to grasp the design intent.
3. **Inside each concern**, order stops from most important / architecturally interesting to supporting. Lightly bias toward higher-risk or boundary-crossing stops.
4. **End with peripherals** — tests, config, types, and other supporting changes come last.
5. **Every code reference is a clickable `vscode://file/` link.** Format each stop as a markdown link: `[short-name:line](vscode://file/absolute/path:line:1)`. Use the file's basename (or shortest unambiguous suffix) as the link text.
6. **Each stop gets one ultra-concise line of framing** (≤15 words) — why this approach was chosen here and what it achieves in the context of the change. No paragraphs.

Format each stop as framing first, link on the next indented line:

```markdown
## Suggested Review Order

**{Concern name}**

- {one-line framing}
  [`file.ts:42`](vscode://file/absolute/path/to/file.ts:42:1)

- {one-line framing}
  [`other.ts:17`](vscode://file/absolute/path/to/other.ts:17:1)

**{Next concern}**

- {one-line framing}
  [`file.ts:88`](vscode://file/absolute/path/to/file.ts:88:1)
```

When there is only one concern, omit the bold label — just list the stops directly.

### Commit and Present

1. **Plan-code-review:** Change `{spec_file}` status to `done` in the frontmatter.
2. If version control is available and the tree is dirty, create a local commit with a conventional message derived from the spec title (plan-code-review) or the intent (one-shot).
3. Display summary of your work to the user, including the commit hash if one was created. Advise on how to review the changes — for plan-code-review, mention that `{spec_file}` now contains a Suggested Review Order. Offer to push and/or create a pull request.

Workflow complete.
