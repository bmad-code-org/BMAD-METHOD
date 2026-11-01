---
name: bmad-ingest
description: 'Turns a transcript, thread, voice memo or long document into a cited note agents can act on. Use when the user says "ingest this", "process this transcript", "make notes from this thread or recording" or "what came out of this meeting".'
---

# Ingest

You turn raw input (a transcript, a chat or email thread, a voice memo, a long document) into a note that a person or agent reads instead of the raw. That reader acts on the note without checking it, so every item must trace to a place in the raw and nothing may appear that the raw does not say. The raw is kept as it arrived, so anyone can check.

Run headless when the caller says so or no person is present: ask nothing.

## On activation

1. Config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder`. Script not found: BMad is not set up here; offer the `bmad` skill's setup, installing `bmad` first if needed (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run it again.
2. Customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow`; on any other failure read `{skill-root}/customize.toml` and use its defaults. Run each entry of `{workflow.activation_steps_prepend}`, hold every entry of `{workflow.persistent_facts}` as fact for the run (`file:` entries are paths or globs under `{project-root}` to read), then run each entry of `{workflow.activation_steps_append}`.

## Keep the raw

`{workflow.raw_folder}` holds originals so a note can link its raw by a relative path that holds in source control. Name what you store `YYYY-MM-DD-<slug>`, dated by when the input happened (its last day, for a range) as the raw or its file name shows it; when neither does, leave the date off rather than use today, which a reader would take for the input's date. When a different original already has that name, add `-2`, `-3` and so on.

- An original outside the project: copy it to `{workflow.raw_folder}`. One with attachments (images, slides, files on an email) goes in as a folder holding the original and its attachments.
- An original already inside the project: leave it where it is.
- A URL: record it. When you fetched the content to read it, also save what you read to `{workflow.raw_folder}`, because the page can change or disappear.

## Choose the template

Use a template the caller or user named by path or URL. Otherwise list them: `uv run {project-root}/_bmad/scripts/list_templates.py {workflow.template_libraries} <libraries the caller passed> --folder ingest-templates --root <folder>`, with one `--root` for the project's skills folder, then one for each user-level skills folder your host loads. Script not found: the BMad install predates it; ask the `bmad` skill to update, which refreshes the shared scripts, then list again. Follow each `tool_sources` sentence to reach that library's templates too. Name any `unreachable` source, `missing` path other than `{project-root}/_bmad/custom/ingest-templates` or `~/.bmad/ingest-templates`, or `orphaned` extension, and go on without it. Read any GitHub file through `gh`.

Use a template named by id; otherwise pick from the descriptions alone, say why in one line, and name close alternatives. Nothing fits: `meeting` for a conversation, `document` for anything else. Load the chosen template and each of its `extensions`, the first listed winning a conflict.

Comments in a template steer you and stay out of the note; its `done when` is what Review checks. A section the raw has nothing for says so in one line, unless its comment makes it optional.

## Write the note

The note's folder is the first of these that applies:

1. The caller or the user named one.
2. The work in progress makes it obvious, such as a document being written with a `sources/` folder beside it.
3. The template's `output`.
4. `{workflow.notes_folder}`, a path or an instruction to follow.

Write one note per raw unless the caller or user asks for one combined note. Name it `<raw name>.md`; when anything other than this raw's own earlier note already has that name, add `-2`, `-3` and so on. Its frontmatter holds `title`, `description` (one line a later reader uses to decide whether to open it), `template`, `ingested` (today) and `source` (the raw's path relative to the note, or its URL).

- Point each item to where it sits in the raw: a timestamp, a section, a message's date and speaker, or a short quote.
- Owners, dates, figures and conditions ("once X is done", "only if") appear only as the raw states them, each on the item it belongs to.
- Beside a relative date ("Monday", "next week"), add the calendar date when the raw's own date is known. Get dates and weekdays from `date` or `cal`, not from memory.
- Name people as the raw names them.
- When something said is later reversed or corrected, give the final state and say it changed.
- Quote exactly where the wording carries weight: a commitment, a customer's own words.
- Link the attachments that matter from the raw folder rather than copying them.
- Put what the raw itself leaves unsettled (an inaudible passage, an unclear speaker, two accounts that conflict) under a last `## Unclear in the source` section, and leave it out when there is none. Questions the people left open go where the template puts them.

A raw too long to hold whole is read in parts, keeping running notes as you go. Before writing, settle against the raw whatever changed across parts, such as a morning decision reversed in the afternoon.

Once written, check that `source` and every relative link in the note resolve from the note's folder.

## Review

A writer misses what it misread, so a reader that did not write the note checks it: a subagent when your host has them, otherwise a second pass of your own over the raw. Give the reviewer the note, the raw and the template, and have it return each of these with the raw's location:

- a decision, commitment or condition the raw holds that the note leaves out or misstates;
- something proposed or offered ("I'd do", "I can") shown as decided or assigned, or a reversed item shown in its earlier state;
- a quote or item credited to the wrong person;
- a citation that does not support its item;
- anything the template's `done when` asks that the note does not meet.

Check each finding against the raw before acting on it, because reviewers raise false alarms. Fix the note, and put what stays uncertain under `## Unclear in the source`.

## Finish

Tell the user the note's path and the raw's path, then run `{workflow.on_complete}`. A headless run ends with one JSON object holding `note`, `raw`, `template` and `unclear` (the count of items under `## Unclear in the source`).

To add or replace a template, put a file in `{project-root}/_bmad/custom/ingest-templates/`, or in `~/.bmad/ingest-templates/` for every project, with `template`, `category` and `description` in its frontmatter, reusing an id to replace a shipped one, or `extends: <id>` to add to one. To change where raws or notes go, or to add template libraries, invoke the `bmad-customize` skill naming `workflow.raw_folder`, `workflow.notes_folder` or `workflow.template_libraries`; if it is not installed, offer `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize`.
