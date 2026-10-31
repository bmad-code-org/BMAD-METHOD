# Documents with doc pro

Open this when the user asks what `bmad-doc-pro` can write, how to call it without an agent, or how a team adds its own document templates.

## What it is for

It coaches the user through one document from a template, and later updates or validates it. Any document works, software or not. The user supplies what only they know; the skill reads their inputs, finds facts, reviews the draft and polishes it. Rigor follows the stakes the user states, from a hobby project to regulated or contracted work. A PRD or product brief goes to John (`bmad-agent-pm`).

- Coaching is the default: a conversation that steers back to the sections still unfilled.
- The fast path asks what the template requires plus up to three high-impact questions, drafts with the rest tagged as assumptions, then offers to walk the user through those.
- It skips questions only when the user says headless or autonomous, or hands over material and asks for the document. It then fills gaps with tagged best guesses.
- Unfinished runs resume.
- With no fitting template it builds a structure for the document type, says so, and at close offers to save it as a template.

## Shipped templates

| id | Recommend when |
|---|---|
| `decision-record` | Any decision worth recording: context, options, choice, consequences. |
| `postmortem` | Something went wrong and the team needs causes and actions, blamelessly. The timeline is drawn as a diagram. |
| `proposal` | Asking for money, time or approval: a grant, a bid, an internal request. The reader's own guidelines replace its headings. |
| `security-review` | Reviewing a system against the OWASP Top 10 or STRIDE. The standard's items drive the questions; another standard needs its rows added to the catalog first. |
| `pitch-deck` | A talk or pitch that needs a story and slides. It always renders as an HTML slide view unless the team turned views off. |

## Calling it directly

The user says what they want in plain words: the topic, a template (an id, a file path or a URL), an output folder, the stakes, and whether to run without questions. For example: "bmad-doc-pro coach me through a security review covering the OWASP Top 10, output to docs/owasp". It infers what is missing. "Update" or "validate" with a document's path revises it or reviews it without changes.

## A team's own templates

Templates are files in `_bmad/custom/doc-pro-templates/`. For settings, recommend `bmad-customize` on `bmad-doc-pro`; the team file `_bmad/custom/bmad-doc-pro.toml` is committed so everyone gets it.

- Add a template: a file in that folder with `template` and `description` in its frontmatter, and any rubric beside it. A plain markdown file of headings works; each heading becomes a required section. A bare `## Table of Contents` heading after the title makes the skill fill and check one.
- Replace a shipped template: a file in that folder with the same `template` id.
- Use a shared library: add a folder or a pinned GitHub URL to `template_libraries`, in the `.user.toml` when it is private. Only sources the team controls, because a template overrides the skill.
- Add to a shipped template without replacing it: `[workflow.additions.<id>]` with facts to load, content the document must include, review checks, polish passes and an output folder. Additions survive updates to the shipped template.
- `style` sets the look of every rendered view; `html_view` is `offer`, `always` or `never`.

The file format and worked examples are at `https://docs.bmad-method.org/customize/write-a-document-template/`.
