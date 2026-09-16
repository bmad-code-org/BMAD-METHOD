# Step 2: Create review narrative

Write the review narrative and the review log under
`{{ config.implementation_artifacts }}`. Prefix both files with a
shared short review slug and check that their names are unused
before creating them.

- **Review narrative:** Write blocks in the Block shapes. Use
  unchecked boxes for unvisited, in-progress, or reopened blocks,
  labeling their state; check a block when the user indicates they
  are satisfied with it. Note whether it changed during review and
  identify the current block. Work performed on a block does not
  itself mean it is accepted.
- **Review log:** Read and use `{{ rendered("templates/log-template.md") }}`.
  Keep findings, decisions, edits, and test results out of the review
  narrative.

If you are running in a sidebar of VS Code, Cursor, or another
editor, open the narrative file in the editor.

## NEXT

Read fully and follow: `{{ rendered("step-03-walkthrough.md") }}`
