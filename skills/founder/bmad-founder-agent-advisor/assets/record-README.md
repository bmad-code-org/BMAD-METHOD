# Business record

This folder is the business record: the facts every pitch, proposal and update quotes, the people being asked, the decisions and the material handed over. Nadia, the Founder Advisor, keeps it, and any agent or person can read it without her. When anyone's memory disagrees with it, the record wins, or is corrected.

It holds fundraising and personal detail. Whether it goes in version control is the team's call.

## Layout

- `company.md`: the company. Sections Venture (what it is, who it serves), Stage, Metrics (each with the date it was measured), Runway, The ask (what, from whom, how much, by when) and Documents (one line per live ask: the path of its current document; the document's status is in its own frontmatter). When an ask closes, its line moves to `## History` with the outcome.
- `founder.md`: the founder. Who they are and their strengths, the hardest part of the business side for them, what they want from an advisor, their time, runway and who else is in it, how they take a push, and what to avoid.
- `people/<slug>.md`: an investor, funder, customer, partner or advisor. It opens with `Kind: <investor|funder|customer|partner|advisor>`, then a Who section (firm, role, what they fund or buy) and one line `Where it stands: <stage> · next: <step or none> · <YYYY-MM-DD>`.
- `insights.md`: what customer conversations show: what people do and pay today, patterns counted as how many of how many, quotes with their source, who has paid or committed, and what it says about the riskiest assumption.
- `objections.md`: the hard questions investors and customers ask, one entry each, with how many have asked it and the best answer so far.
- `data-room.md`: what investors at this stage will ask to see, where each item is, and what is missing, stale or inconsistent.
- `numbers/`: `cap-table.json`, the cap table the round calculator reads, and dated models (`YYYY-MM-DD-model.csv`).
- `decisions/YYYY-MM-DD-<slug>.md`: the question, the options, the choice and why, the expected outcome, the kill criteria (what evidence by what date reverses it), and a `Review: YYYY-MM-DD · open` line whose status becomes `held`, `changed` or `stopped` when a check-in tests it.
- `check-ins/YYYY-MM-DD.md`: what moved, what stalled, and one line `Assignment: <action> · due <YYYY-MM-DD> · open`, set to `done` when it is.
- `raw/YYYY-MM-DD-<source>-<descriptor>.<ext>`: material as it was handed over (emails, feedback, call notes, exports), never edited. Frontmatter `status: raw` or `distilled`, and `distilled_to:` listing the record files made from it; each of those names it in a `source:` line.

## Rules

- `company.md`, `founder.md`, `insights.md`, `objections.md`, `data-room.md` and the people files say what is true now. A changed fact replaces the line that held it. `## History` takes a dated line only at a turning point, such as a round closing, a pivot or a funder saying no.
- Something that happened on a date gets its own dated file.

## Where this project differs

When the project's AGENTS.md says where people, decisions or originals go, its rules win. Note each difference here.
