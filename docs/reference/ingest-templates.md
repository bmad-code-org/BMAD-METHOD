---
title: Ingest Templates
description: Every ingest template shipped by Core Tools and BMad Method for bmad-ingest, what inputs each fits, what note structure it produces, and how to add custom templates.
sidebar:
  order: 8
---

`bmad-ingest` converts raw source material (meeting transcripts, chat or email threads, voice memos, user interviews, and long documents) into concise, cited markdown notes that people and agents can act on without rereading the raw source. Every claim links back to its location in the original, nothing is invented beyond the raw input, and an independent review pass verifies attribution, reversals, and open commitments before finishing.

## How `bmad-ingest` Stores Originals and Notes

| Behavior | Rule |
| --- | --- |
| Original preservation (`workflow.raw_folder`, default `{output_folder}/raw`) | Originals from outside the project are copied unchanged as `YYYY-MM-DD-<slug>` (dated from the input itself, or undated when the input carries no date). Originals already inside the project stay in place; fetched URLs are saved alongside their URL record. |
| Note placement (`workflow.notes_folder`, default `{output_folder}/notes`) | Written to the first matching target: a caller-specified folder, an active document's `sources/` folder, the template's `output` frontmatter, or `workflow.notes_folder`. |
| Note frontmatter | Every generated note includes `title`, `description`, `template`, `ingested` (date), and `source` (relative path to the raw file or URL). |
| Unsettled source passages | Inaudible passages, ambiguous speakers, or conflicting raw statements go under a closing `## Unclear in the source` section (omitted when none exist). |
| Headless runs | When invoked non-interactively, `bmad-ingest` asks nothing and finishes with one JSON object containing `note`, `raw`, `template`, and `unclear` (the count of items under `## Unclear in the source`). |

Use `bmad-customize` on `bmad-ingest` to change `raw_folder`, `notes_folder`, or `template_libraries`.

## Core Tools Ingest Templates

Shipped in `bmod-core-tools/ingest-templates/`:

| Template ID | Category | Fits | Output sections | Verification rule (`done when`) |
| --- | --- | --- | --- | --- |
| `meeting` | `general` | Any multi-person meeting or call from a transcript, recording notes, or write-up (default fallback for conversations) | Summary, Decisions, Action items, Open questions, Discussion | Every decision and commitment lists its owner and condition; proposals are not shown as decided; reversals show final state |
| `thread` | `general` | Email threads, chat channel exports, or message chains where later messages can overturn earlier ones | Where it stands, Decisions, Commitments, Waiting on an answer, Superseded *(optional)* | State as of the last message is clear; every open commitment and unanswered question is listed; overturned items are not shown as current |
| `voice-memo` | `general` | One person thinking aloud in a voice memo, dictation, or recorded walk | Summary, To-dos, Ideas, Questions | Every spoken to-do is listed, and ideas are not turned into decisions |
| `document` | `general` | Long written documents such as reports, articles, papers, contracts, specifications, or slide decks (default fallback for non-conversations) | Summary, Key points, Asks and obligations, Terms *(optional)* | Every ask, obligation, and deadline is listed, and every figure matches the source |
| `one-on-one` | `people` | Recurring private conversations between a manager and direct report | Topics, Commitments, Follow-ups from last time *(optional)*, For next time | Every commitment appears under its owner; off-the-record content is omitted with a single note that something was left out |

## BMad Method Ingest Templates

Shipped in `bmod-method/ingest-templates/`:

| Template ID | Category | Fits | Output sections | Verification rule (`done when`) |
| --- | --- | --- | --- | --- |
| `discovery-workshop` | `product-discovery` | Requirements or scoping sessions where stakeholders or clients state what should be built, feeding a brief, PRD, or tickets | Goals, Needs, Constraints, Out of scope, Risks and concerns, Decisions, Open questions | Every stakeholder need, constraint, and exclusion names who stated it, and asks are not shown as agreed scope |
| `user-interview` | `product-discovery` | User research or usability testing interviews where a customer describes their workflow or tests a product (not sales calls) | Participant, What they said, What they do, Pains and goals, Interpretation *(optional)* | Every pain and goal traces to a recorded quote or behavior; interpretation stays separate from raw evidence; leading questions are flagged |
| `standup` | `agile-team` | Daily standups or scrums where each person reports progress, next work, and blockers | Blockers, By person, After the standup *(optional)* | Every blocker names who owns it and who was asked to help |
| `sprint-review` | `agile-team` | Sprint reviews or stakeholder demos where completed work was shown and reviewed | Shown, Feedback, Outcome, New requests | Every demonstrated item has an accepted or sent-back outcome, and every new request names who asked |
| `retrospective` | `agile-team` | Sprint or project retrospectives where the team reviewed how it worked and agreed on process changes (not incident postmortems) | Actions agreed, Last retro's actions *(optional)*, What went well, What did not go well, Discussed, not agreed | Every agreed action names an owner and due date; unagreed proposals stay under Discussed, not agreed |

## Template Selection Rules

If you or a calling skill names a template id, path, or URL, `bmad-ingest` uses it directly. Otherwise it picks from the installed template descriptions, explains its choice in one line, and names close alternatives. When no specialized template fits, it falls back to `meeting` for conversations and `document` for everything else.

## Add, Replace, or Extend an Ingest Template

`bmad-ingest` searches libraries in order (first matching id wins):

1. `{project-root}/_bmad/custom/ingest-templates/` (team-wide, committed)
2. `~/.bmad/ingest-templates/` (personal across all projects)
3. Extra folders, files, pinned GitHub URLs, or MCP tool instructions added to `workflow.template_libraries` on `bmad-ingest`
4. Installed modules' `ingest-templates/` folders

To add a new template, save a markdown file in `_bmad/custom/ingest-templates/` with `template`, `category`, and `description` in frontmatter (plus optional `output` to route notes to a specific folder). Reuse a shipped `template` id to replace it, or use `extends: <id>` to add rules or sections while continuing to receive updates to the shipped template:

```markdown
---
template: sales-call
category: go-to-market
description: "A discovery or qualification call with a prospective customer."
---

<!-- purpose: Capture prospect context, objections, and agreed next steps without conflating wishes with product commitments. -->

<!-- done when: Every objection, budget/timeline figure, and follow-up owner traces to the transcript. -->

# {title}

## Account context

## Pain points and goals

## Objections and blockers

## Agreed next steps
<!-- One line each: action, owner, and date. -->
```

HTML comments (`purpose`, `done when`, optional `privacy` or `writing`, and per-section notes) steer extraction and review and are stripped from the final note. Mark optional sections with `<!-- Optional: ... -->`; non-optional sections that have no supporting material in the raw source state so in one line.
