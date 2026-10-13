# Step 3: Publish

Show the user the title and body, or the commit message. Apply their
edits until they approve.

On approval:

- Commit message: create the commit.
- New PR: push the branch if it is not on the remote, then
  `gh pr create --title "<title>" --body-file <draft>` against the
  base branch the repo's rules name. Confirm with `gh pr view`.
- Existing PR: `gh pr edit <number> --title "<title>" --body-file <draft>`.
- A remote that is not GitHub: use that host's CLI when it is
  installed, otherwise give the user the draft path and the host's
  new-PR link.

Report the PR link or the commit hash in one line.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{{ workflow.on_complete }}
