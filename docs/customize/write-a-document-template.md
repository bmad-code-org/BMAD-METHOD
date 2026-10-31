---
title: 'Write a Document Template'
description: Add your own template to bmad-doc-pro, replace or hide a shipped one, add your team's rules to a template, and set how rendered views look.
sidebar:
  order: 5
---

Use the `bmad-doc-pro` template library to make the skill coach your team through your own document types. Everything about a document is data. Template files say what each document asks for and what the review checks. The skill's customization says where templates live, where the result goes, and how the HTML view looks.

## When to use this

- Your team has a document type the five shipped templates do not cover.
- Your organization has its own format for a postmortem, a proposal, or a decision record.
- A shipped template is right, but your team has rules to add: a policy to cite, a section it must contain, a check for the review.
- Rendered views should carry your team's look.

:::note[Prerequisites]
BMad installed with the core tools, and `bmad setup` run. Templates go in `_bmad/custom/doc-pro-templates/`. Settings go in `_bmad/custom/bmad-doc-pro.toml`, which the team commits; `bmad-doc-pro.user.toml` beside it holds personal changes. `bmad-customize` can write either file for you. How overrides merge is in [Customize BMad](./customize-bmad.md).
:::

## Add a template to the library

Save the template in `_bmad/custom/doc-pro-templates/`, with any rubric or method catalog beside it. The skill lists every markdown file there whose frontmatter has `template:`. Nothing else needs registering.

```yaml
---
title: ""
template: runbook
description: "An operator needs step-by-step instructions for one alert or recurring task."
rubric: rubric-runbook.md
status: draft
created: ""
updated: ""
---
```

| Field | What it holds |
| --- | --- |
| `template` | Kebab-case id. It names the run folder, and a later update uses it to find the template. |
| `description` | When to offer the template; the only text read when choosing. Quote it, because a colon breaks unquoted YAML. |
| `rubric` | Optional path to a rubric for the review, relative to the template. Empty uses the shipped planning rubric. |
| `methods` | Optional path to a method catalog, relative to the template: a CSV whose rows supply the questions the coaching asks. |

`description`, `rubric` and `methods` stay out of the finished document.

A method catalog has the header `category,method,name,description,key_questions`, with the key questions separated by `|`. The shipped `security-review` template uses one for the OWASP Top 10 and STRIDE:

```csv
category,method,name,description,key_questions
release,rollback,Rollback,How a change is undone.,"How is this change undone?|Who can run the rollback?"
```

## Replace a shipped template

The first template with an id wins and the shipped templates are searched last, so a template in any library with a shipped `template:` value replaces it. To use your organization's postmortem format, save it in your folder with `template: postmortem`.

## Use more than one library

`template_libraries` lists where templates live, in search order. An override appends to the list, and a folder that is missing or empty adds nothing.

```toml
# _bmad/custom/bmad-doc-pro.toml

[workflow]
template_libraries = ["https://github.com/acme/doc-templates@v1.2.0"]
```

| Entry | Example |
| --- | --- |
| A folder or one template file | `{project-root}/docs/templates` |
| A GitHub repo, folder or file, read through `gh` | `https://github.com/acme/doc-templates/tree/v1.2.0/planning` |
| A URL to one `.md` file | `https://example.com/templates/runbook.md` |
| A sentence naming the tool that reaches it | `Search corp:confluence_search in the DOCS space for templates` |

A library you cannot share goes in `bmad-doc-pro.user.toml`, which stays out of git. A teammate without access who updates one of those documents follows its existing headings instead. If a library cannot be read, the skill names it and carries on with the others.

:::caution[Trust]
A template overrides the skill, so a remote library can direct an agent that has tools. Point only at sources you control, and pin a version with `@ref` or a tag so the library cannot change between runs.
:::

## Write the template file

A template is a markdown file in three parts: the document's frontmatter, comments that guide the coaching, and its sections. Frontmatter comes first. The comments never appear in the finished document. Where a template and the skill disagree, the template wins, on every path; only a headless run still asks nothing.

```markdown
---
title: ""
template: runbook
description: "An operator needs step-by-step instructions for one alert or recurring task."
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

Add `view: slides` to the frontmatter for a slide view; without it the HTML view is one page. `{title}` is the only placeholder.

Each section has one comment: `required`, `optional`, or `include when:` with a condition, then a line on what goes in the section, then `diagram:` and a Mermaid kind when a picture carries the meaning (flowchart, sequence, state, timeline, gantt, er, mindmap, quadrant, journey). A heading with no comment is required. A required section is always filled, in one line at hobby stakes. An include-when section goes in only when the condition holds.

Say what goes in each section, not how to write well. Leave out example content, which the model would copy.

A section comment can also steer the conversation or limit the answer, in plain sentences. The `Steps` comment above tells the skill when to press, and `Severity` limits the user to a list. A list can live elsewhere: "The user must pick a team from `docs/teams.md`." The shipped `decision-record` and `security-review` templates show both.

Put a bare `## Table of Contents` heading right after the title of any template whose documents run long. Agents often read only the top of a file to judge it, so the skill fills this with a linked entry per section and a short phrase of its key terms, then checks it against the final headings. It gets no slide in a slide view.

## Use a format you already have

A file with no comments is followed as written: every heading is required, in order. Save your organization's existing format in the folder with `template` and `description` in its frontmatter and it works.

```markdown
---
title: ""
template: design-note
description: "A team wants to record the design of a change before building it."
status: draft
---

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
An agent's own templates ship in its `assets/` folder, and its `customize.toml` lists that folder in `template_libraries`. The agent passes the list when it runs `bmad-doc-pro`, and it is searched after yours, so your copy with the same id wins. The settings in `bmad-doc-pro.toml` (style, views, review and polish) still apply.
:::

## Check the result

Run the resolver on `bmad-doc-pro` with `--key workflow.template_libraries` or `--key workflow.additions` to see the merged settings; see [Check what resolved](./customize-bmad.md#check-what-resolved). Then ask `bmad-doc-pro` for your new document type and confirm it offers your template.
