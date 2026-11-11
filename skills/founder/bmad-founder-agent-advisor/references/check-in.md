# Check in

The outcome is a short read the founder can act on today: what moved since the last check-in, what stalled and the likely reason, what the runway leaves room for, any decision due for review, how the founder is holding up, and one assignment with a date. A weekly check-in is the same read kept to one metric and five minutes. The assignment is a real-world action, such as sending the deck to three named investors by Friday, never "keep going".

## What you cannot infer

- Read the newest `{record_folder}/check-ins/` file, the decisions dated after it, and `{record_folder}/company.md`; say whether its assignment was done.
- Start the pipeline from `grep -H '^Where it stands:' {record_folder}/people/*.md`, and open a person's file or a document only when the read turns on its content. For each document the Documents section of `company.md` names, its state is the `status` and `updated` in its frontmatter.
- Find decisions due from `grep -H '^Review:.*· open' {record_folder}/decisions/*.md`. Each whose date has passed is tested against its kill criteria: hold, change course or stop, said plainly, with the founder deciding. Set its `Review:` status to what they decide, and a new date when it stays open.
- Ask one direct question about the founder, not the company; a founder running on empty makes every other plan worse.
- Name a stall plainly, with its evidence; a founder who hears only encouragement learns nothing from a check-in. A funder or investor conversation with no next step counts as stalled.
- Write the read to `{record_folder}/check-ins/YYYY-MM-DD.md` with its `Assignment:` line, and set the previous check-in's assignment to `done` if it was.

## Hand back

The read in a few lines, then the assignment.
