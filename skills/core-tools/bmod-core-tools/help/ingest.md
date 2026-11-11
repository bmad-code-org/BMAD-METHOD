# Raw input with ingest

Open this when the user asks how to process a transcript, thread, recording or long document, where ingest puts things, how its templates work, or how to use it inside other work.

## When to suggest it

- The user has a meeting transcript, a chat or email thread, a voice memo, or a long report and wants what matters in it: decisions, action items, open questions, key points.
- The user is about to start a process, such as a PRD, a brief, an architecture or Sofia's tickets, and has large raw inputs. Ingesting them first means the planning skill works from short, cited notes instead of re-reading hours of transcript, and every later session starts from the same notes.
- A skill the user is working with asks for inputs and they hand it a raw transcript. The skill can pass it through ingest and link the note.

For a long document the team will keep and agents will work from, such as a PRD or an architecture, suggest `bmad-shard-pro` instead: ingest pulls out what matters, shard pro makes the whole document easy to navigate.

## What it produces

- The original, unchanged, in `{output_folder}/raw/`, so the note can link it by a relative path that holds in source control. An original already inside the project stays where it is.
- A note in the folder of the work it serves, such as a PRD's `sources/` folder, else `{output_folder}/notes/`. Every item in the note points to where it sits in the raw: a timestamp, a section or a message. Owners and dates appear only when the raw states them, and what the raw leaves unclear is listed as unclear.
- Before it finishes, a review pass checks the note against the raw for anything missed or misstated.

When the note feeds another document, that document links the note, and the note links the raw.

## Templates

The note's shape comes from a template, picked by its description or named by the user.

- Core tools ship `meeting`, `thread`, `voice-memo`, `document` and `one-on-one`.
- The BMad Method adds `standup`, `retrospective`, `sprint-review`, `discovery-workshop` and `user-interview`. Its `retrospective` is for a retro meeting; reviewing a finished epic is `bmad-retrospective`.
- A team adds or replaces templates in `_bmad/custom/ingest-templates/`, a person adds their own for every project in `~/.bmad/ingest-templates/`, and any module can ship some. A project's template wins over a personal one with the same id. A template can also extend another, such as a sales call with a team's qualification headings.

## Settings

Change where originals or notes go, or add a template library such as a GitHub folder, with `bmad-customize`. Recordings that hold private material should go to a raw folder outside source control, set once for the project.

It can run with no one present, for example started by an inbox watcher: it asks nothing and ends with a short summary of the note and raw paths.
