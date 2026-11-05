# Facilitated documents from templates

Open this when the user asks what `bmad-facilitate` can write, how to call it without an agent, or how a team adds its own document templates.

## What it is for

It coaches the user through one document from a template, and later updates or validates it. Any document works, software or not. The user supplies what only they know; the skill reads their inputs, finds facts, reviews the draft and polishes it. Rigor follows the stakes the user states, from a hobby project to regulated or contracted work. A PRD or product brief goes to John (`bmad-agent-pm`).

- Coaching is the default: a conversation that steers back to the sections still unfilled.
- The fast path asks what the template requires plus up to three high-impact questions, drafts with the rest tagged as assumptions, then offers to walk the user through those.
- It skips questions only when the user says headless or autonomous, or hands over material and asks for the document. It then fills gaps with tagged best guesses.
- Unfinished runs resume.
- With no fitting template it builds a structure for the document type, says so, and at close offers to save it as a template.

## Templates the modules ship

Core tools ships no templates. Each module's templates are in `templates` in `knowledge.py`'s output once it is installed, so recommend a module when the user wants one it holds:

| id | Module | Recommend when |
|---|---|---|
| `decision-record` | Method | Any decision worth recording: context, options, choice, consequences. |
| `postmortem` | Method | Something went wrong and the team needs causes and actions, blamelessly. The timeline is drawn as a diagram, and it also writes a customer notice when customers were told. |
| `security-review` | Method | Reviewing a system against the OWASP Top 10 or STRIDE. The standard's items drive the questions; another standard needs its rows added to the catalog first. |
| `proposal` | Founder | Asking for money, time or approval: a grant, a bid, an internal request. The reader's own guidelines replace its headings. |
| `pitch-deck` | Founder | A talk or pitch that needs a story and slides. It always renders as an HTML slide view unless the team turned views off. |
| `character` | Creative Intelligence Suite 0.4.0 and later | A fictional character for a story, game or campaign. The coach proposes options, and each character gets its own one-page HTML sheet unless the team turned views off. |

Method also ships John's planning templates and `brd`, which Method's own help covers.

## Listing what it can coach

When the user asks what it can coach them through or which templates exist, list them instead of answering from this file, because `templates` in `knowledge.py`'s output covers only what installed modules ship, and a team's own templates appear nowhere else.

1. Run `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill <bmad-facilitate's folder> --project-root {project-root} --key workflow` and take `template_libraries`. Do the same for each installed agent whose `customize.toml` sets it. `bmad-ingest`'s library holds another kind of template, so leave it out.
2. Fill `{project-root}` and `{skill-root}` in those entries, then run `uv run {project-root}/_bmad/scripts/list_templates.py <entries> --root <folder>`, this skill's entries first, with one `--root` for each skills folder the host has active, project folders first.
3. Group `templates` by `source`, saying what each is for and naming its `extensions`. Name anything `shadowed`, `orphaned` or `unreachable`, and follow any `tool_sources`. The two default folders showing as `missing` is normal.

## Calling it directly

The user says what they want in plain words: the topic, a template (an id, a file path or a URL), an output folder, the stakes, and whether to run without questions. For example: "bmad-facilitate coach me through a security review covering the OWASP Top 10, output to docs/owasp". It infers what is missing. "Update" or "validate" with a document's path revises it or reviews it without changes. A document written without a template works too: it finds the closest template and uses that as the bar, then offers suggestions or a reshape.

## A team's own templates

Templates are files in `_bmad/custom/facilitate-templates/`. For settings, recommend `bmad-customize` on `bmad-facilitate`; the team file `_bmad/custom/bmad-facilitate.toml` is committed so everyone gets it.

- Add a template: a file in that folder with `template` and `description` in its frontmatter, and any rubric beside it. A `companions` comment asks for more files beside the document. A plain markdown file of headings works; each heading becomes a required section. A bare `## Table of Contents` heading after the title makes the skill fill and check one.
- Replace or edit a shipped template: copy it from `doc-templates/` in the record of the module that ships it into that folder and keep its `template` id. The project's copy wins.
- A module adds templates through `doc-templates/` in its record folder; no setting is needed. An `agents:` frontmatter list names the skills that run one, so help can say who offers it.
- Keep personal templates for every project in `~/.bmad/facilitate-templates/`. The project's folder is searched first.
- Use a shared library: add a folder or a pinned GitHub URL to `template_libraries`, in the `.user.toml` when it is private. Only sources the team controls, because a template overrides the skill.
- Add to a template without copying it: a file with `extends: <id>` in its frontmatter, holding the extra sections and comments. It applies on every run of that template, and updates to the original still arrive. For example, an `extends: proposal` file at Fernhollow Bank, a fictional company, adds a required Approval Track with three fixed choices and an empty Review Comments section.
- An organization can keep templates and extensions in its own modules, one per program if it likes, such as `bmod-fernhollow-cards`. A module adds new ids or extends existing ones; only a project's folder or a library replaces an id.
- `style` sets the look of every rendered view; `html_view` is `offer`, `always` or `never`. A template's `view` can name an HTML file beside it, filled the same way every time, and a `view` comment instead has a page written for each document, from that file as a starter or from the brief alone. The coaching stays in the markdown template.

The file format and worked examples are at `https://docs.bmad-method.org/customize/write-a-document-template/`.
