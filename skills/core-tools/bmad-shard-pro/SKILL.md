---
name: bmad-shard-pro
description: 'Makes long documents easy for agents to navigate. Use when the user says "shard this document", "this file is too long for agents", "turn this document into a wiki", "add a table of contents so agents can find things", or "update the sharded document".'
---

# Shard Pro

You make a long document cheap and safe for an agent to read later. That reader may or may not search, and may see only the first 200 lines of a file before deciding what else to open. From what it sees there, it must be able to tell where any fact lives. Nothing in the source may be lost or changed on the way: you choose where to cut and what to call things, and the script does the cutting. The user maintains the result afterwards, so it must also be easy to update.

## Conventions

- `{skill-root}` is this skill's folder; `{project-root}` is the nearest folder containing `_bmad/`.
- This skill's script is `uv run {skill-root}/scripts/shard_tool.py`; run it with `--help`, or `<command> --help`, for arguments. The memlog script is `uv run {project-root}/_bmad/scripts/memlog.py`; without `_bmad/`, skip memlog writes and say so once.
- `{doc_folder}` is the folder that holds the result. For a split, it is the input's own folder when that folder is named after it (`prd-x/prd-x.md`), otherwise a new folder beside the input, named after its stem; the main file is named after the folder. For a contents list, it is the file's own folder.

## On activation

- The document's main file opens with the sharded-document note, or the document has a contents list this skill made (it starts with `<!-- shard-pro:contents -->`): read `references/update.md` fully and follow it.
- A transcript, chat export, email thread or pile of meeting notes: this is input to process into decisions, actions and notes, not a document to shard. Say so and invoke the `bmad-ingest` skill on it when it is installed; otherwise tell the user it needs processing first. Then stop.
- Any other file that is not markdown or plain text (.docx, PDF, HTML): ask the user to convert it to markdown first, with a tool they use or by asking you to, then go on from the converted file.
- Any other document: go to Assess.

## Assess

Run `outline` on the input. There are three outcomes: leave it as it is; a contents list, where the file stays one file and gains a detailed list of its sections near the top; or a faithful split, where the source is cut word for word into shards with a map, which loses nothing and is checked by script. Small, well-named files serve agents better than one long file, so a long document that is kept and edited is split unless something needs it whole. Pick the outcome with these steps and recommend it with one line on why:

1. **Under about 50,000 characters:** leave it as it is. An agent reads it whole for little.
2. **Otherwise, ask** what the document cannot show, in one message, leaving out what the request already says:
   - Will it be kept and edited, or is it a fixed reference, such as a vendor manual, a standard or a signed contract?
   - Does it have to stay one file: for export to Word or PDF, upload to another AI tool, a tool or skill that takes one path, or people who read or review it straight through? Or is it usually read whole, for example to validate it?

   With no user present, treat a project document (a PRD, spec, architecture or plan) as kept and edited, a third-party or signed document as a fixed reference, and neither as having to stay one file unless the request says so.
3. **Contents list** when it has to stay one file, is a fixed reference, or its sections lean on each other so much that no cut leaves shards that read on their own (steps that run across sections, frequent "as above"). When it already has an accurate contents list in its first 200 lines, leave it as it is instead.
4. **Faithful split** otherwise.

When the user asked for a particular outcome ("shard this", "add a table of contents"), recommend it unless these steps point elsewhere; then name the answer that points elsewhere, in one line, and do what they choose.

For Leave it as it is, tell the user why and stop. The other two go on to Plan.

## Plan from the outline

Plan from the outline and read only the ranges you need. Holding a long document whole in your context is the expensive mistake. Start from the proposed cut and change it where the content asks:

- Shards run about 3 to 14 KB, measured in characters, because line lengths vary too much to measure by lines. A shorter shard on one subject beats a merged one that joins unrelated subjects.
- Never cut inside a table, a step list or a diagram. `build` refuses cuts inside fenced blocks, tables and numbered lists; watch for the rest yourself.
- Name each shard from what it covers, in kebab-case. Never start a name with the document type's prefix, because a `prd-*` glob would load it as another PRD.
- When a heading is a bare identifier (`## 3`, `### C-2`), name the shard from its content (the outline shows the first line under each such heading) and keep the identifier in the title.
- Before you use the source's own index or numbering rules, check them against the body. They are often from an older edition.
- Keep an aggregate view (a matrix, a register, a glossary) whole, because a reader counting rows needs it in one place. Small ones may share a shard.
- Write each map summary so a reader with a question can tell this is the shard. When a shard's content is later superseded in the source, its summary says so.
- When the source states two values for one thing, the summary of each shard holding one says so and names the other shard. Never pick one, even where the source declares a precedence rule.
- Set `related` on a shard to the shards a change to it would also touch: the other shard of a conflict, and shards its text points to or that point to it. Leave it out when none do.
- Set a lookup pattern only when readers arrive with identifiers the map titles do not already resolve, such as hundreds of requirement IDs.

Write the plan as JSON in the shape `build --help` shows.

## Agree the plan

- A user is present: show the outcome, why, where the result will go, and the shard list (titles and one-line summaries), then wait. For a split, say that the input moves into `.source/` and the shards become the document. Build only once they agree.
- The user asked you to run without stopping, or another skill invoked this one with no user present: go on, and report at the end.

## Build

Run `build`, or `toc` with the plan for a contents list. To change the plan before anyone edits the shards, edit it and run `build` again; it reads the source from `.source/` and replaces the old shards. Once the shards have been edited, `build` refuses; make the change as `references/update.md` says instead.

Then record the outcome and each change or decision the user made in `{doc_folder}/.memlog.md`, keeping any memlog already there: `memlog.py init --workspace {doc_folder}` when none exists, then `append --type decision|change|event`.

## Check, then report

Run `check` on the result, with `--rebuild` after a faithful split, and fix every failure before you finish.

Report to the user:
- the outcome, and where the main file is;
- for a split, that the input now sits in `.source/`;
- what you found in the source: conflicts with both values and where each sits, index errors, suspected errors;
- links `check` warns no longer resolve after the split. Shards keep the source's words, so the user decides whether to fix them.

Findings go in the report and the memlog, never into shards. A shard says what the source says, and a reader cannot tell your judgement from the author's.
