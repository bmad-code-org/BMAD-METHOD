---
title: 'Write a Document Template'
description: Add your own template to bmad-doc-coach, replace or hide a shipped one, add your team's rules to a template, and set how rendered views look.
sidebar:
  order: 5
---

Use the `bmad-doc-coach` template library to make the skill coach your team through your own document types. Everything about a document is data. Template files say what each document asks for and what the review checks. The skill's customization says where templates live, where the result goes, and how the HTML view looks.

## When to use this

- Your team has a document type the five shipped templates do not cover.
- Your organization has its own format for a postmortem, a proposal, or a decision record.
- A shipped template is right, but your team has rules to add: a policy to cite, a section it must contain, a check for the review.
- Rendered views should carry your team's look.

:::note[Prerequisites]
BMad installed with the core tools, and `bmad setup` run. Templates go in `_bmad/custom/doc-coach-templates/`. Settings go in `_bmad/custom/bmad-doc-coach.toml`, which the team commits; `bmad-doc-coach.user.toml` beside it holds personal changes. `bmad-customize` can write either file for you. How overrides merge is in [Customize BMad](./customize-bmad.md).
:::

## Add a template to the library

Save the template in `_bmad/custom/doc-coach-templates/`, with any rubric or method catalog beside it. The skill lists every markdown file there whose frontmatter has `template:`. Nothing else needs registering.

```yaml
---
title: ""
template: runbook
version: 1.0.0
description: "Step-by-step instructions for one alert or recurring task."
rubric: rubric-runbook.md
status: draft
created: ""
updated: ""
---
```

| Field | What it holds |
| --- | --- |
| `template` | Kebab-case id. It names the run folder, and a later update uses it to find the template. |
| `version` | Optional version of the template. It is copied into each document, so a later update can say the template has moved on. |
| `description` | One short line saying what the template is for. Help lists it for every template on every run, so keep it under about 80 characters. Quote it, because a colon breaks unquoted YAML. |
| `not_for` | Optional short line naming what the template is not for, and the template to use instead. Read with `description` when choosing one, and not listed in help. |
| `agents` | Optional list of the skills that run this template, such as `[bmad-agent-pm]`. The `bmad` skill uses it to say who offers the template. A template in an agent's `assets/` folder counts as that agent's without it. |
| `rubric` | Optional path to a rubric for the review, relative to the template. Empty uses the shipped planning rubric. |
| `methods` | Optional path to a method catalog, relative to the template: a CSV whose rows supply the questions the coaching asks. |
| `output` | Optional run folder for this template. It may use `{output_folder}`, `{active_initiative}`, `{id}` and `{slug}`. |
| `style` | Optional CSS file for this template's rendered view, relative to the template. |

`template` and `version` stay in the finished document; the other fields stay out.

A method catalog has the header `category,method,name,description,key_questions`, with the key questions separated by `|`. The shipped `security-review` template uses one for the OWASP Top 10 and STRIDE:

```csv
category,method,name,description,key_questions
release,rollback,Rollback,How a change is undone.,"How is this change undone?|Who can run the rollback?"
```

## Replace a shipped template

The first template with an id wins, and installed modules' templates are searched last, so a template in any library with the same `template:` value replaces one a module installed. To change an installed template, copy it from the module's `doc-templates/` folder into yours, with any rubric or catalog it names, keep its `template:` value and edit the copy. To use your organization's postmortem format, save it in your folder with `template: postmortem`.

## Use more than one library

`template_libraries` lists where templates live, in search order. It starts with your project's `_bmad/custom/doc-coach-templates/`, then `~/.bmad/doc-coach-templates/` for personal templates you want in every project. An override appends to the list, and a folder that is missing or empty adds nothing.

```toml
# _bmad/custom/bmad-doc-coach.toml

[workflow]
template_libraries = ["https://github.com/fernhollow/doc-templates@v1.2.0"]
```

| Entry | Example |
| --- | --- |
| A folder or one template file | `{project-root}/docs/templates` or `~/templates` |
| A GitHub repo, folder or file, read through `gh` | `https://github.com/fernhollow/doc-templates/tree/v1.2.0/planning` |
| A URL to one `.md` file | `https://example.com/templates/runbook.md` |
| A sentence naming the tool that reaches it | `Search corp:confluence_search in the DOCS space for templates` |

A library you cannot share goes in `bmad-doc-coach.user.toml`, which stays out of git. A teammate without access who updates one of those documents follows its existing headings instead. If a library cannot be read, the skill names it and carries on with the others.

:::caution[Trust]
A template overrides the skill, so a remote library can direct an agent that has tools. Point only at sources you control, and pin a version with `@ref` or a tag so the library cannot change between runs.
:::

## Ship templates in a module

A module adds templates by putting them in `doc-templates/` in its record folder, the folder holding its `bmod.toml`, with any rubric or catalog beside them. They are offered once the module is installed, with no setting, and they update with the module. The shipped examples live this way in `bmod-core-tools`.

An organization can keep its templates in its own modules, one per program if it likes, such as `bmod-fernhollow-cards`. A module should add new ids or extend existing ones, because an extension applies wherever it sits. To replace an id outright, use a project's folder, which is searched first.

## Write the template file

A template is a markdown file in three parts: the document's frontmatter, comments that guide the coaching, and its sections. Frontmatter comes first. The comments never appear in the finished document. Where a template and the skill disagree, the template wins, on every path; only a headless run still asks nothing.

```markdown
---
title: ""
template: runbook
version: 1.0.0
description: "Step-by-step instructions for one alert or recurring task."
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
| `companions` | Other files to write beside the document, when, and what each holds. A file for a different reader belongs here, not overflow from the document. |
| `done when` | The test that ends the questioning. |

Add `view: slides` to the frontmatter for a slide view; without it the HTML view is one page. In the document body, `{title}` is the only placeholder.

Each section has one comment: `required`, `optional`, or `include when:` with a condition, then a line on what goes in the section, then `diagram:` and a Mermaid kind when a picture carries the meaning (flowchart, sequence, state, timeline, gantt, er, mindmap, quadrant, journey). A heading with no comment is required. A required section is always filled, in one line at hobby stakes. An include-when section goes in only when the condition holds.

Say what goes in each section, not how to write well. Leave out example content, which the model would copy.

A section comment can also steer the conversation or limit the answer, in plain sentences. The `Steps` comment above tells the skill when to press, and `Severity` limits the user to a list. A list can live elsewhere: "The user must pick a team from `docs/teams.md`." The shipped `decision-record` and `security-review` templates show both, and [Document Templates](../reference/document-templates.md) lists where to see each capability.

Put a bare `## Table of Contents` heading right after the title of any template whose documents run long. Agents often read only the top of a file to judge it, so the skill fills this with a linked entry per section and a short phrase of its key terms, then checks it against the final headings. It gets no slide in a slide view.

## Use a format you already have

A file with no comments is followed as written: every heading is required, in order. Save your organization's existing format in the folder with `template` and `description` in its frontmatter and it works.

```markdown
---
title: ""
template: design-note
version: 1.0.0
description: "Recording the design of a change before building it."
status: draft
---

# {title}

## Background

## Proposal

## Rollout plan

## Risks
```

Add the comments when you want the coaching, the optional sections, or the diagrams.

## Extend a template

An extension adds to a template without copying it, so updates to the original still reach you. Save a file with `extends:` and the template's id in any library or module, and every run of that template includes it. Fernhollow Bank, a fictional company, uses the `proposal` template as it is, but every proposal must name an approval track from a fixed list and leave room for reviewers:

```markdown
---
extends: proposal
---

## Approval Track
<!-- required, after Budget. The user must pick exactly one of: fast-track, standard, regulated. -->

## Review Comments
<!-- required, last. Keep the line below as it is; reviewers fill this in later. -->

_Reviewer comments go here._
```

An extension can hold anything a template can:

| In the extension | Effect |
| --- | --- |
| A section | Added where its comment says. If the heading it names is gone, the skill places it by judgment. |
| `stance`, `inputs`, `writing` or `done when` comments | Added to the template's. A policy to load goes in `inputs`; a review rule goes in `done when`. |
| `description`, `not_for`, `rubric`, `methods`, `output` or `style` frontmatter | Replaces the template's value. |

When extensions conflict, the first in search order wins. Use a copy instead when you want to change what a template already says.

Rules for every document, whatever the template, go in `persistent_facts`, `doc_standards` and `finalize_reviewers` under `[workflow]` instead.

## Set the look of rendered views

At close the skill can render a self-contained HTML view of the document, diagrams included.

```toml
[workflow]
style = "{project-root}/_bmad/style/brand.css"
html_view = "always"
```

`style` is a CSS file applied to every view after the default styles; empty uses the default. A written voice or style guide belongs in `doc_standards` or a template's `writing` comment instead. A template's `style` overrides it for that template. `html_view` is `offer` (the default: ask at close), `always`, or `never`. A template with `view: slides` renders unless `html_view` is `never`.

:::tip[Templates for an agent]
An agent's own templates ship in its `assets/` folder, and its `customize.toml` lists that folder in `template_libraries`. The agent passes the list when it runs `bmad-doc-coach`, and it is searched after yours, so your copy with the same id wins. The settings in `bmad-doc-coach.toml` (style, views, review and polish) still apply.
:::

## Check the result

Run the resolver on `bmad-doc-coach` with `--key workflow.template_libraries` to see the merged list; see [Check what resolved](./customize-bmad.md#check-what-resolved). Then ask `bmad-doc-coach` for your new document type and confirm it offers your template.
