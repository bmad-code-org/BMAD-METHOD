---
name: bmad-shard-pro
description: 'Makes long documents easy for agents to navigate. Use when the user says "shard this document", "this file is too long for agents", "turn this document, transcript or chat export into a wiki", "add a table of contents so agents can find things", or "update the sharded document".'
---

# Shard Pro

You make a long document cheap and safe for an agent to read later. That reader may or may not search, and may see only the first 200 lines of a file before deciding what else to open. From what it sees there, it must be able to tell where any fact lives. Nothing in the source may be lost or changed on the way. The user maintains the result afterwards, so it must also be easy to update.

## Conventions

- `{skill-root}` is this skill's folder; `{project-root}` is the nearest folder containing `_bmad/`.
- This skill's script is `uv run {skill-root}/scripts/shard_tool.py`; run it with `--help`, or `<command> --help`, for arguments. The memlog script is `uv run {project-root}/_bmad/scripts/memlog.py`; without `_bmad/`, skip memlog writes and say so once.
- `{doc_folder}` is the folder that holds the result. For a split, it is the input's own folder when that folder is named after it (`prd-x/prd-x.md`), otherwise a new folder beside the input, named after its stem; the main file is named after the folder. For a contents list, it is the file's own folder.

## On activation

- The document's main file opens with the sharded-document note, or the document has a contents list this skill made (it starts with `<!-- shard-pro:contents -->`): read `references/update.md` fully and follow it.
- Any other document: go to Assess.

## Assess

Run `outline` on the input. Convert anything that is not markdown or plain text with `convert` first, writing into `{doc_folder}/.source/`.

Recommend one outcome with one line on why:

- **Leave it as it is.** It is short enough to read whole, or already well signposted.
- **Contents list.** A markdown or text file stays one file and gains a detailed contents list near the top; input that needed converting is split or rewritten instead. It is the smaller change, and the one to choose when readers search or follow line ranges, when tools or skills expect the document as one file, or when you cannot tell how it will be read.
- **Faithful split.** The source is cut word for word into shards with a map. Choose it when readers load whole files, so each one should load only a part, or when the document will be maintained piece by piece. It loses nothing and is checked by script.
- **Rewrite.** Subject shards written fresh from the source, with citations. Use it only for input with no usable structure: transcripts, chat exports, a folder of notes.

Splitting costs every later reader a hop through the map, so recommend it only when a reader would otherwise pay more. When the user asked for a particular outcome ("shard this", "add a table of contents"), recommend that one unless the outline shows it would make the document worse to read, and then say why.

For Leave it as it is, tell the user why and stop. The other three go on to Plan; for a rewrite, read `references/rewrite.md` fully now.

## Plan from the outline

Plan from the outline and read only the ranges you need. Holding a long document whole in your context is the expensive mistake. Start from the proposed cut and change it where the content asks:

- Shards run about 3 to 14 KB, measured in characters, because line lengths vary too much to measure by lines. A shorter shard on one subject beats a merged one that joins unrelated subjects.
- Never cut inside a table, a step list or a diagram. `build` refuses cuts inside fenced blocks, tables and numbered lists; watch for the rest yourself.
- Name each shard from what it covers, in kebab-case. Never start a name with the document type's prefix, because a `prd-*` glob would load it as another PRD.
- When a heading is a bare identifier (`## 3`, `### C-2`), name the shard from its content (the outline shows the first line under each such heading) and keep the identifier in the title.
- Before you use the source's own index or numbering rules, check them against the body. They are often from an older edition.
- Keep an aggregate view (a matrix, a register, a glossary) whole, because a reader counting rows needs it in one place. Small ones may share a shard.
- Write each map summary so a reader with a question can tell this is the shard. When a shard's content is later superseded in the source, its summary says so.
- When the source states two values for one thing, list both, with the shard holding each, in a conflicts shard linked near the top of the map and in your report. Never pick one, even where the source declares a precedence rule.
- Set a lookup pattern only when readers arrive with identifiers the map titles do not already resolve, such as hundreds of requirement IDs.

Derived shards are a view the source lacks but a reader needs: a conflicts list, the current state after decisions were reversed, a decision log, action items, corrected figures. When a faithful split or a rewrite needs one, plan it and read `references/rewrite.md` fully.

Write the plan as JSON in the shape `build --help` shows.

## Agree the plan

- A user is present: show the outcome, why, where the result will go, and the shard list (titles and one-line summaries), then wait. For a split, say that the input moves into `.source/` and the shards become the document. Build only once they agree.
- The user asked you to run without stopping, or another skill invoked this one with no user present: go on, and report at the end.

## Build

Run `build`, or `toc` with the plan for a contents list. For rewritten or derived shards, follow the Writing and Checking steps in `references/rewrite.md` next. To change the plan afterwards, edit it and run `build` again; it reads the source from `.source/` and replaces the old shards.

Then record the outcome and each change or decision the user made in `{doc_folder}/.memlog.md`, keeping any memlog already there: `memlog.py init --workspace {doc_folder}` when none exists, then `append --type decision|change|event`.

## Check, then report

Run `check` on the result, with `--rebuild` after a faithful split, and fix every failure before you finish.

Report to the user:
- the outcome, and where the main file is;
- for a split, that the input now sits in `.source/`;
- what you found in the source: conflicts, index errors, suspected errors.

Findings go in the report and the memlog, never into shards. A shard says what the source says, and a reader cannot tell your judgement from the author's.
