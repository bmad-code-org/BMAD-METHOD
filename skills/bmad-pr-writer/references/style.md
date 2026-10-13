# Style

## Titles

- 6–12 words. Name what the user gets, not the code that moved.
- An area prefix is fine when the repo has several surfaces:
  `Cards: …`, `Docs: …`.
- A status tag in parentheses is fine: `(flag off)`, `(prototype)`.

Good: `Name the agent wallet when it cannot pay the fee`.
Bad: `Various fixes`, `Update dashboard`, `Refactor flow store`.

## Body order

Drop sections that do not apply. Never reorder.

1. **Opening.** `What this changes`, `Why`, or `What happened`. Lead
   with the user-visible result or the failure, with real numbers.
   Link the parent PR or ticket.
2. **What changed.** Numbered or bulleted. File and function names in
   backticks. State the scope: "frontend only, no API change", "no
   check was removed".
3. **Screenshots or recordings.** UI changes only. Before and after in
   a two-column table. Say how they were made: real app, fixtures, or
   stubbed services.
4. **Safety.** Only when money, auth, data, or security is touched.
   Bullets with a bold lead: `**Who can change a card:** …`.
5. **Verified.** Each command with its count: `` `npm test`: 173/173
   pass ``. Say when the new tests fail on the old code. End with
   `**Not verified:** …`.
6. **Still open.** What remains, plainly.
7. **Closing ask.** Always last.

Aim for under 4,000 characters. Put long tables in `<details>`.

## Voice

- Sentences of 8–20 words, in plain words, for someone who did not see
  the work.
- Exact over vague: `2094 ms`, `29.9 USDC`, `4–6 → 2 calls`,
  `submit_watching` in `asa.rs`.
- Bold only the one outcome or risk the reader must not miss.
- State limits as facts: "No funds moved." "The card won't update live
  until the schema deploys."
- Do not inflate severity: "Defence in depth, not exploitable today."
- When a choice belongs to the reviewer, offer it: "If you'd rather fix
  this at the source, say so."
- Avoid: seamless, robust, leverage, comprehensive, simply, just,
  powerful, "this PR aims to", emoji.

## Commits

- Subject under 72 characters, same voice as the title.
- Optional body, wrapped at 72: why, in one to three lines.
- One logical change per commit.
