---
title: 'Write a Document Template'
description: Add your own template to bmad-doc-pro, replace or hide a shipped one, add your team's rules to a template, and set how rendered views look.
sidebar:
  order: 5
---

Use the `bmad-doc-pro` template library to make the skill coach your team through your own document types. Everything about a document is data in the skill's customization: which templates exist, what each one asks for, what the review checks, where the result goes, and how its HTML view looks.

## When to use this

- Your team has a document type the five shipped templates do not cover.
- Your organization has its own format for a postmortem, a proposal, or a decision record.
- A shipped template is right, but your team has rules to add: a policy to cite, a section it must contain, a check for the review.
- Rendered views should carry your team's look.

:::note[Prerequisites]
BMad installed with the core tools, and `bmad setup` run. The changes below go in `_bmad/custom/bmad-doc-pro.toml`, which the team commits; `bmad-doc-pro.user.toml` beside it holds personal changes. `bmad-customize` can write either file for you. How overrides merge is in [Customize BMad](./customize-bmad.md).
:::

## Add a template to the library

Each template is one `[[workflow.templates]]` entry. The skill picks from the descriptions alone, so write the description as when to offer the template.

```toml
# _bmad/custom/bmad-doc-pro.toml

[[workflow.templates]]
id = "runbook"
name = "Runbook"
description = "An operator needs step-by-step instructions for one alert or recurring task."
file = "{project-root}/_bmad/custom/templates/runbook.md"
methods = ""
rubric = ""
disabled = false
```

| Field | What it holds |
| --- | --- |
| `id` | Kebab-case name. It names the run folder and the document's `template` frontmatter. |
| `description` | When to offer the template; the only text read when choosing. |
| `file` | A path or a URL to the template file. Use `{project-root}` for files in your repository. |
| `methods` | Optional path to a method catalog: a CSV whose rows supply the questions the coaching asks. |
| `rubric` | Optional path to a rubric for the review. Empty uses the shipped planning rubric. |
| `disabled` | `true` hides the template. |

A method catalog has the header `category,method,name,description,key_questions`, with the key questions separated by `|`. The shipped `security-review` template uses one for the OWASP Top 10 and STRIDE:

```csv
category,method,name,description,key_questions
release,rollback,Rollback,How a change is undone.,"How is this change undone?|Who can run the rollback?"
```

## Replace or hide a shipped template

An entry with a shipped `id` replaces that entry whole, so restate every field. To use your organization's postmortem format:

```toml
[[workflow.templates]]
id = "postmortem"
name = "Incident review"
description = "Something went wrong and the team needs causes and actions, blamelessly."
file = "{project-root}/_bmad/custom/templates/incident-review.md"
methods = ""
rubric = ""
disabled = false
```

To hide a shipped template, an entry with its `id` and `disabled = true` is enough.

## Write the template file

A template is a markdown file in three parts: the document's frontmatter, comments that guide the coaching, and its sections. Frontmatter comes first. The comments never appear in the finished document. Where a template and the skill disagree, the template wins, on every path; only a headless run still asks nothing.

```markdown
---
title: ""
template: runbook
status: draft
created: ""
updated: ""
---

<!-- purpose: Let an on-call operator handle one alert or task without help. -->

<!-- stance: Walk the procedure as the operator would and ask what they check after each step. -->

<!-- inputs: The alert or task, the access it needs, the exact commands. Only the user knows the failures they have seen. -->

<!-- writing:
  - Numbered steps, one action each, with its expected result.
  - Commands copied exactly.
-->

<!-- done when: Someone new to the system can follow it alone and knows when to escalate. -->

# {title}

## When to use
<!-- required. The alert, symptom or schedule that starts this runbook. -->

## Severity
<!-- required. The user must pick exactly one of: sev1, sev2, sev3. -->

## Steps
<!-- required. Numbered actions with expected results. When a step says "check the dashboard", ask which one and what a good reading is. diagram: flowchart -->

## Rollback
<!-- include when: a step changes production. How to undo each change. -->

## Escalation
<!-- optional. Who to call and when. -->
```

Above the first heading, give each of these keys its own comment, a line or two. All are optional:

| Key | What it tells the skill |
| --- | --- |
| `purpose` | The decision or job the document serves. |
| `stance` | How to coach for this document, including how a path should run. |
| `inputs` | What must be asked, and which of it only the user knows. Each one is asked on the coaching and fast paths unless the user already gave it, so list only what you want asked. |
| `writing` | Rules specific to this document. |
| `done when` | The test that ends the questioning. |

The `template` frontmatter must match the entry's `id`; that is how a later update finds the template. Add `view: slides` to the frontmatter for a slide view; without it the HTML view is one page. `{title}` is the only placeholder.

Each section has one comment: `required`, `optional`, or `include when:` with a condition, then a line on what goes in the section, then `diagram:` and a Mermaid kind when a picture carries the meaning (flowchart, sequence, state, timeline, gantt, er, mindmap, quadrant, journey). A required section is always filled, in one line at hobby stakes. An include-when section goes in only when the condition holds.

Say what goes in each section, not how to write well. Leave out example content, which the model would copy.

A section comment can also steer the conversation or limit the answer, in plain sentences. The `Steps` comment above tells the skill when to press, and `Severity` limits the user to a list. A list can live elsewhere: "The user must pick a team from `docs/teams.md`." The shipped `decision-record` and `security-review` templates show both.

## Use a format you already have

A file with no comments is followed as written: every heading is required, in order. Point an entry at your organization's existing format and it works without changes.

```markdown
# {title}

## Background

## Proposal

## Rollout plan

## Risks
```

Add the comments when you want the coaching, the optional sections, or the diagrams.

## Add your rules to a template

Additions add to a template without replacing it, so a team keeps its rules when the shipped template is updated. Each field is optional. Additions from the team file and a personal file merge, and their lists append.

```toml
[workflow.additions.postmortem]
facts = ["file:{project-root}/docs/oncall/severity-levels.md"]
include = ["The severity level, on our scale"]
checks = ["Every action item links a ticket"]
polish = ["file:{project-root}/_bmad/style/company-voice.md"]
output = "docs/postmortems/{slug}"
style = "{project-root}/_bmad/style/incident.css"
```

| Field | Effect |
| --- | --- |
| `facts` | Context loaded once the template is chosen: sentences, or `file:` paths and globs. |
| `include` | Content the document must contain. |
| `checks` | Rules added to the review. |
| `polish` | Polish passes run after the skill's standard ones: `skill:NAME [args]`, `file:PATH`, or plain text. |
| `output` | The run folder for this template. It may use `{output_folder}`, `{active_initiative}`, `{id}` and `{slug}`. |
| `style` | The look of this template's rendered view. |

Rules for every document, whatever the template, go in `persistent_facts`, `doc_standards` and `finalize_reviewers` under `[workflow]` instead.

## Set the look of rendered views

At close the skill can render a self-contained HTML view of the document, diagrams included.

```toml
[workflow]
style = "{project-root}/_bmad/style/brand.css"
html_view = "always"
```

`style` is a CSS file applied to every view after the default styles; empty uses the default. A written voice or style guide belongs in `doc_standards` or an addition's `polish` instead. A template's `additions.<id>.style` overrides it for that template. `html_view` is `offer` (the default: ask at close), `always`, or `never`. A template with `view: slides` renders unless `html_view` is `never`.

:::tip[Templates for an agent]
When an agent runs `bmad-doc-pro` with its own library, that agent's override file holds its templates and additions. The settings in `bmad-doc-pro.toml` (style, views, review and polish) still apply.
:::

## Check the result

Run the resolver on `bmad-doc-pro` with `--key workflow.templates` or `--key workflow.additions` to see the merged library; see [Check what resolved](./customize-bmad.md#check-what-resolved). Then ask `bmad-doc-pro` for your new document type and confirm it offers your template.
