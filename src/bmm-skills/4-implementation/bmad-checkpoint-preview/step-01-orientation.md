# Step 1: Orientation

Display: `[Orientation] → Walkthrough → Detail Pass → Testing`

## Follow Global Step Rules in SKILL.md

- The conversation context before this skill was triggered IS your starting point — not a blank slate.
- The user may have already mentioned a spec file, a commit, a branch, a PR, or described the change. Use what they gave you.
- For PR references, resolve to a commit or branch using whatever tools are available (e.g., `gh pr view` for GitHub). If resolution fails, ask for a SHA or branch.

## FIND THE CHANGE

1. **What did the user already tell you?** Look at the conversation for a spec path, commit ref, branch, PR, or description of the change.
2. **Fill in the other half.** If they gave a spec, look for `baseline_commit` in its frontmatter. If they gave a commit, check `{implementation_artifacts}` for a spec whose `baseline_commit` matches. If they gave both, use both.
3. **If they gave nothing**, check current branch and HEAD. Confirm: "I see HEAD is `<short-sha>` on `<branch>` — is this the change you want to review?"
4. **If you still can't identify a change**, ask:
   - What changed and why?
   - Which commit, branch, or PR should I look at?
   - Do you have a spec, bug report, or anything else that explains what this change is supposed to do?

   If after 3 exchanges you still can't identify a change, HALT.

## DETERMINE WHAT YOU HAVE

Set `change_type` based on how the user referred to the change:

| User referenced | `change_type` |
|---|---|
| A pull request | `PR` |
| A commit | `commit` |
| A branch | `branch` |
| A description (e.g. "the auth refactor") | use their words (e.g. `auth refactor`) |
| Nothing specific / ambiguous | `change` |

| What you have | Review Mode | Intent Source |
|---|---|---|
| Spec with `## Suggested Review Order` | `full-trail` | Spec's Intent section |
| Spec without trail | `spec-only` | Spec's Intent section |
| Commit ref, no spec | `bare-commit` | Commit message |

**Terse commit messages** (under 10 words): Scan the diff for the primary change pattern and draft a one-sentence intent. Confirm with the user before proceeding.

## PRODUCE ORIENTATION

### Intent Summary

- If intent comes from a spec's Intent section, display it verbatim regardless of length — it's already written to be concise.
- For other sources (commit messages, bug reports, user description): if ≤200 tokens, display verbatim. If longer, distill to ≤200 tokens and link to the full source.
- Format: `> **Intent:** {summary}`

### Surface Area Stats

Compute from `git diff --stat` against the appropriate baseline:

- **With spec**: Use `baseline_commit` from frontmatter. If missing, diff `HEAD~1..HEAD` and tell the user stats reflect only the latest commit.
- **Bare commit**: Diff against parent (`commit~1..commit`). For merge commits, use `--first-parent`.

Display as:

```
N files changed · M modules touched · ~L lines of logic · B boundary crossings · P new public interfaces
```

- **Files changed**: from `git diff --stat`
- **Modules touched**: distinct top-level directories with changes
- **Lines of logic**: added/modified lines excluding blanks, imports, formatting. `~` because approximate.
- **Boundary crossings**: changes spanning more than one top-level module. `0` if single module.
- **New public interfaces**: new exports, endpoints, public methods. `0` if none.

If git is unavailable or a command fails, show what you can and note what's missing.

### Present

```
[Orientation] → Walkthrough → Detail Pass → Testing

> **Intent:** {intent_summary}

{stats line}
```

## FALLBACK TRAIL GENERATION

**Skip this section if review mode is `full-trail`.**

When no Suggested Review Order exists, generate one from the diff and codebase context. A generated trail is lower quality than an author-produced one, but far better than none.

1. Get the full diff against the appropriate baseline (same rules as Surface Area Stats).
2. Read changed files in full — not just diff hunks. Surrounding code reveals intent that hunks alone miss. If total file content exceeds ~50k tokens, read only the files with the largest diff hunks in full and use hunks for the rest.
3. If a spec exists, use its Intent section to anchor concern identification.
4. Identify 2–5 concerns: cohesive design intents that each explain *why* behind a cluster of changes. Prefer functional groupings and architectural boundaries over file-level splits. A single-concern change is fine — don't invent groupings.
5. For each concern, select 1–4 `path:line` stops — locations where the concern is most visible. Prefer entry points, decision points, and boundary crossings over mechanical changes.
6. Lead with the entry point — the highest-leverage stop a reviewer should see first. Inside each concern, order stops so each builds on the previous. End with peripherals (tests, config, types).
7. Format each stop using `path:line` per the global step rules:

```
**{Concern name}**

- {one-line framing, ≤15 words}
  `src/path/to/file.ts:42`
```

When there is only one concern, omit the bold label — just list the stops directly.

Present after the orientation output:

```
I built a review trail for this {change_type} (no author-produced trail was found):

{generated trail}
```

Set review mode to `full-trail`. The generated trail is the Suggested Review Order for subsequent steps.

If git is unavailable or the diff cannot be retrieved, skip this section and proceed with the original review mode. Note: "Could not generate trail — git unavailable."

## NEXT

Read fully and follow `./step-02-walkthrough.md`
