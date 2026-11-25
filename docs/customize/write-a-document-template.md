---
title: 'Write a Document Template'
description: Add your own template to bmad-facilitate, replace or hide a shipped one, add your team's rules to a template, and set how rendered views look.
sidebar:
  order: 7
---

Use the `bmad-facilitate` template library to make the skill coach your team through your own document types. Everything about a document is data. Template files say what each document asks for and what the review checks. The skill's customization says where templates live, where the result goes, and how the HTML view looks.

New to templates? [How Document Templates Work](./how-document-templates-work.md) explains the pieces, and [Customize a Document for Your Team](./customize-a-document-for-your-team.md) walks through changing a shipped one. This page is the full guide to the file format.

## When to use this

- Your team has a document type the shipped templates do not cover.
- Your organization has its own format for a postmortem, a proposal, or a decision record.
- A shipped template is right, but your team has rules to add: a policy to cite, a section it must contain, a check for the review.
- Rendered views should carry your team's look.

:::note[Prerequisites]
BMad installed with the core tools, and `bmad setup` run. Templates go in `_bmad/custom/facilitate-templates/`. Settings go in `_bmad/custom/bmad-facilitate.toml`, which the team commits; `bmad-facilitate.user.toml` beside it holds personal changes. `bmad-customize` writes any of these for you, an extension of a shipped template included: tell it what to change, such as "every PRD opens with a quote". How overrides merge is in [Customize BMad](./customize-bmad.md).
:::

## Add a template to the library

The quickest way is to ask `bmad-facilitate` to make a template for the document, such as "bmad-facilitate, make a template for vehicle appraisal reports". It coaches you through one, with the rules below built in, and saves it in `_bmad/custom/facilitate-templates/`. When an agent should offer it, ask Smithy (`bmad-toolsmith`) instead, who has the engine write it and wires the agent to it. The rest of this page is the format, for writing or reading one by hand.

Save the template in `_bmad/custom/facilitate-templates/`, with any rubric or method catalog beside it. The skill lists every markdown file there whose frontmatter has `template:`. Nothing else needs registering.

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
| `mode` | Optional. The mode a run of this template starts in: `freeform` (the default), `step-by-step` or `fast`. A team's or user's `mode` wins over it. See [Choose how a run walks the sections](#choose-how-a-run-walks-the-sections). |
| `order` | Optional. `fixed` for a document whose order matters as much as the result: freeform is never used, and fast keeps the order. |
| `facilitation_order` | The sections by id, in the order the skill takes them up. See [Order the sections](#order-the-sections). |
| `guidance` | Optional rules shared by a family of templates and read as part of each, resolved relative to the template (such as `guidance-method.md` in Method or `guidance-planning.md` in Founder). Without it the skill names no domain stakes levels; every document still carries `[ASSUMPTION: ...]` tags where the coach guessed until accepted or corrected. |
| `agents` | Optional list of the skills that offer this template, such as `[bmad-agent-pm]`; name several to share it. It says who offers the template by default; any agent the user asks can still write it. The `bmad` skill uses the list to say who offers the template. A template in an agent's `assets/` folder counts as that agent's without it. |
| `rubric` | Optional path to a rubric for the review, relative to the template (such as `rubric-planning.md`), or the bare name `rubric-general` for the shipped general rubric. Empty also uses `rubric-general`. |
| `methods` | Optional path to a method catalog, relative to the template: a CSV whose rows supply the questions the coaching asks. |
| `companions` | Optional one-line list of sibling filenames expected beside `{doc}` (e.g. `[DESIGN.md, EXPERIENCE.md]`), tracked across Resume, Progress, Review, and Finalize. |
| `forbid_id_prefixes` | Optional one-line list of disallowed id prefixes (e.g. `[FR]`), flagged during Finalize. |
| `lint` | Optional custom script path relative to the template file or command string (supporting `{doc}`, `{run}`, `{project-root}`) run during Finalize step 1. |
| `output` | Optional run folder for this template, or a path ending in `.md` for the document itself. It may use `{project-root}`, `{output_folder}`, `{active_initiative}`, `{id}` and `{slug}`. |
| `style` | Optional visual style guide for this template's HTML artifact: a CSS file, design-system doc, screenshot, or verbal aesthetic preference relative to the template. |
| `layout` | Optional layout guide or reference file (starter HTML, fixed brand elements, or sample screenshot) for the HTML artifact. It guides how the artifact looks, never whether it is made. See [Give a template its own view](#give-a-template-its-own-view). |
| `view` | Optional. Whether this template's view is made: `always`, `offer` or `never`. A team's or user's `view` wins over it. Set `always` when the view is the deliverable, as `pitch-deck` does for its slides. |

`template` and `version` stay in the finished document, as does any field you add for a view to show. The other fields stay out.

A method catalog has the header `category,name,key_questions`, with the key questions separated by `|`. The shipped `security-review` template uses one for the OWASP Top 10 and STRIDE:

```csv
category,name,key_questions
release,Rollback,"How is this change undone?|Who can run the rollback?"
```

## Replace a shipped template

The first template with an id wins, and installed modules' templates are searched last, so a template in any library with the same `template:` value replaces one a module installed. To change an installed template, copy it from the module's `doc-templates/` folder into yours, with any rubric or catalog it names, keep its `template:` value and edit the copy. To use your organization's postmortem format, save it in your folder with `template: postmortem`.

## Use more than one library

`template_libraries` lists where templates live, in search order. It starts with your project's `_bmad/custom/facilitate-templates/`, then `~/.bmad/facilitate-templates/` for personal templates you want in every project. An override appends to the list, and a folder that is missing or empty adds nothing.

```toml
# _bmad/custom/bmad-facilitate.toml

[workflow]
template_libraries = ["https://github.com/fernhollow/doc-templates@v1.2.0"]
```

| Entry | Example |
| --- | --- |
| A folder or one template file | `{project-root}/docs/templates` or `~/templates` |
| A GitHub repo, folder or file, read through `gh` | `https://github.com/fernhollow/doc-templates/tree/v1.2.0/planning` |
| A URL to one `.md` file | `https://example.com/templates/runbook.md` |
| A sentence naming the tool that reaches it | `Search corp:confluence_search in the DOCS space for templates` |

A library you cannot share goes in `bmad-facilitate.user.toml`, which stays out of git. A teammate without access who updates one of those documents follows its existing headings instead. If a library cannot be read, the skill names it and carries on with the others.

:::caution[Trust]
A template overrides the skill, so a remote library can direct an agent that has tools. Point only at sources you control. A branch or tag can move, so pin a commit SHA with `@ref` when the library must not change between runs.
:::

## Ship templates in a module

A module adds templates by putting them in `doc-templates/` in its record folder, the folder holding its `bmod.toml`, with any rubric or catalog beside them. They are offered once the module is installed, with no setting, and they update with the module. The shipped templates live this way in `bmod-method`, `bmad-founder-agent-advisor` and `bmod-cis`.

An organization can keep its templates in its own modules, one per program if it likes, such as `bmod-fernhollow-cards`. A module should add new ids or extend existing ones, because an extension applies wherever it sits. To replace an id outright, use a project's folder, which is searched first.

## Write the template file

A template is a markdown file in three parts: the document's frontmatter, comments that guide the coaching, and its sections. Frontmatter comes first. The comments never appear in the finished document. Where a template and the skill disagree, the template wins, in every mode; only a headless run still asks nothing.

```markdown
---
title: ""
template: runbook
version: 1.0.0
description: "Step-by-step instructions for one alert or recurring task."
facilitation_order: [when-to-use, severity, steps, rollback, escalation]
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
<!-- The alert, symptom or schedule that starts this runbook. -->

## Severity
<!-- The user must pick exactly one of: sev1, sev2, sev3. -->

## Steps
<!-- Numbered actions with expected results. When a step says "check the dashboard", ask which one and what a good reading is. diagram: flowchart -->

## Rollback
<!-- include when: a step changes production. How to undo each change. -->

## Escalation
<!-- optional. Who to call and when. -->
```

Above the first heading, give each of these keys its own comment, a line or two. All are optional:

| Key | What it tells the skill |
| --- | --- |
| `purpose` | The decision or job the document serves. |
| `stance` | How to coach for this document, including how a mode should run. |
| `opening` | How a run starts. It can hold the questions whose answers change how the rest is coached, records to ask for first, what the brain dump should cover, or a cold start with no brain dump, as for a questionnaire taken one question at a time. Unless it rules the brain dump out, the skill invites one in the same message. Without an `opening`, the skill asks nothing first and only invites the brain dump. Either way, a question the request already answers is skipped. |
| `inputs` | What must be asked, and which of it only the user knows. Each one is asked in every mode but headless unless the user already gave it, so list only what you want asked. |
| `writing` | Rules specific to this document. |
| `companions` | Other files to write beside the document, when, and what each holds. A file for a different reader belongs here, not overflow from the document. |
| `done when` | The test that ends the questioning. |
| `layout` | The brief for an HTML page written for each document. See [Give a template its own view](#give-a-template-its-own-view). |
| `next` | What to offer or do once the document is done, such as handing it to a build. |

By default Close authors a creative, full-fidelity self-contained HTML artifact; add a `layout` comment or reference file for design ideas or fixed structural elements, never rigid value injection. In the document body, `{title}` is the only placeholder.

Each section has one comment: a line on what goes in the section, then `diagram:` when a picture carries the meaning, with a Mermaid kind (flowchart, sequence, state, timeline, gantt, er, mindmap, quadrant, journey, pie) or a line saying what to draw. A section that is not required starts its comment with `optional` or `include when:` and a condition. A section assembled from the others, such as a summary or a glossary, starts its comment with `built:`. The skill asks nothing for it up front, drafts it once the sections it draws on are settled, and shows it for correction; the template list reports one placed ahead of a section that is not built.

### Order the sections

`facilitation_order` lists every `##` section by id: its heading in lowercase, with punctuation dropped and spaces as hyphens, so `What makes it different` is `what-makes-it-different` and `What's next?` is `whats-next`. It sets the order the skill takes the sections up in, not the document's order, so an executive summary can sit first in the document and come up last. Whether a section is required comes only from its comment, and the template list reports an id left with a `?` on it.

The skill settles every section before it finishes, in every mode. A required section is always filled. An optional one is offered when the order reaches it, and the user decides. An include-when one is checked against its condition, and the skill says what it found. Fast settles them too, so asking for speed never drops a section quietly. Sections left out are named at the end with the reason.

The template list reports an id that names no heading, an id listed twice, and a heading left off the list. Every shipped template sets the key. A template without it still works: a section whose comment does not start with `optional` or `include when:` is required, and the document's order is the order.

Say what goes in each section, not how to write well. Leave out example content, which the model would copy.

A section comment can also steer the conversation or limit the answer, in plain sentences. The `Steps` comment above tells the skill when to press, and `Severity` limits the user to a list. A list can live elsewhere: "The user must pick a team from `docs/teams.md`." The shipped `decision-record` and `security-review` templates show both, and [Document Templates](../reference/document-templates.md) lists where to see each capability.

### Choose how a run walks the sections

Every run starts in one of three modes. Freeform, the default, follows the user's thread conversationally across sections, updates the document quietly in the background, and plays back major decisions as they settle. Step-by-step takes sections one at a time in facilitation order and settles each before opening the next — set `mode: step-by-step` on heavy formal contracts (`srs`, `brd`, `charter`, `prd-program`, `arch-enterprise`). Fast drafts the whole document first, then walks the guesses with the user (`ux-quick`, `prototype-plan`, `decision-record`). A `mode` set for a team or a user through `bmad-customize` wins over every template's, and the user can switch at any time during a run.

Set `order: fixed` when an earlier section must be settled before a later one is worked, as in a PRFAQ, where the user defends the press release before the questions. A request for freeform then runs step-by-step, wherever it comes from, and fast keeps the order too. A team extension can set `mode` or `order`, or clear either with an empty value such as `order: ""`.

Each section comment is the brief for that part of the session. A voice, stance or method it sets, such as "you are now a skeptical customer", replaces the skill's defaults until the section closes, so write it as instructions to the coach rather than only a description of the content. These shipped templates set `order: fixed`: Mary's `prfaq` and `opportunity`, John's `pitch`, the `experiment` card they both offer, the module's `postmortem`, and Nadia's `cofounder-agreement`, `startup-diagnostic`, `positioning`, `first-hire` and `validation-experiment`.

In `step-by-step` runs, messages open with a progress line such as `PRFAQ · Customer FAQ (2 of 4)` counted against the template's facilitation order. In `freeform` and `fast`, progress counters stay hidden in chat while `progress.py` checks completeness quietly before Finalize.

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

An extension changes a template without copying it, so updates to the original still reach you. On every run the skill merges the template and its extensions into one file, the extensions first, and works from that file. To see exactly what it reads, ask `bmad-customize` to show the merged template. Save a file with `extends:` and the template's id in any library or module, and every run of that template includes it. Fernhollow Bank, a fictional company, uses the `proposal` template as it is, but every proposal must name an approval track from a fixed list and leave room for reviewers:

```markdown
---
extends: proposal
---

## Approval Track
<!-- After Budget. The user must pick exactly one of: fast-track, standard, regulated. -->

## Review Comments
<!-- Last. Keep the line below as it is; reviewers fill this in later. -->

_Reviewer comments go here._
```

An extension can hold anything a template can:

| In the extension | Effect |
| --- | --- |
| A section | Added where its comment says, and taken up at that point in the conversation. If the heading it names is gone, the skill places it by judgment. It is required unless its comment starts `optional` or `include when`, the same rule as a template's sections. With the same heading as a template section, it replaces that section or adds to it, as its comment says. |
| `facilitation_order` frontmatter | Replaces the template's whole order. A template section it leaves out is removed from the document, and the template list names it under `removed`. Set it only to reorder or remove the template's sections, never just to place a new one, because a section the template adds in a later update is also left out and removed. |
| `stance`, `inputs`, `writing` or `done when` comments | Added to the template's, and they win where they disagree with it. A policy to load goes in `inputs`; a review rule goes in `done when`. |
| `description`, `not_for`, `guidance`, `rubric`, `methods`, `output`, `style`, `layout`, `view`, `mode`, `order`, `companions`, `forbid_id_prefixes` or `lint` frontmatter | Replaces the template's value. An empty value (`mode: ""`, `order: ""`, `lint: ""`, `companions: []`, `forbid_id_prefixes: []`) clears the template's. |

This extension opens every PRD with a quote and always makes its HTML view, while John's updates to the PRD still arrive:

```markdown
---
extends: prd
view: always
---

## Quote
<!-- First, right under the title. Ask the user for a quote unique to this product before anything else. -->
```

When extensions conflict, the first in search order wins. Use a copy only to rebuild a template, or with a new id for a different document; [Customize a Document for Your Team](./customize-a-document-for-your-team.md#step-5-when-changes-outgrow-an-extension) shows when.

Rules for every document, whatever the template, go in `persistent_facts`, `doc_standards` and `finalize_reviewers` under `[workflow]` instead.

## Set how much documents show in pictures

By default the skill shows whatever has a shape as a picture in place of the paragraph it would take: a flow, a sequence, a timeline, a comparison, figures with a trend. A table or a Mermaid diagram covers most of these; it draws an SVG for what they show poorly, such as a scale with thresholds marked, a two-by-two or a rough sketch, and uses a generated image when the host has a tool for one. An SVG or image is saved beside the document and linked from it. A picture holds only what the document's text holds.

The `visuals` setting under `[workflow]` is that instruction in one sentence. Replace it to change the forms used or to hold documents to text and tables:

```toml
[workflow]
visuals = "Tables and Mermaid diagrams only. No image files."
```

A template's own comments win over the setting: a section's `diagram:` names the picture it carries, and a `writing` rule can ban pictures, as a form answer or an email must.

## Set the look of rendered views

At close the skill can render the document as one HTML file, with its diagrams drawn and the image files it links inlined. The page loads its Markdown and diagram renderers from jsDelivr when opened, so a reader with no network sees the plain text instead. Raw HTML in the document shows as text, and script links are dropped.

```toml
[workflow]
style = "{project-root}/_bmad/style/brand.css"
view = "always"
```

`style` is a CSS file applied to every view after the default styles. A written voice or style guide belongs in `doc_standards` or a template's `writing` comment instead. `view` is `offer` (ask at close), `always`, or `never`. Each wins over a template's own `style` or `view` when set; left empty, the template's holds, else the default styles and `offer`.

## Give a template its own view

A template stays markdown, and so does the document the skill writes, because the skill grows it section by section, reviews it and diffs it. An HTML artifact is authored separately at close from the finalized markdown and companions, preserving every section, id, metric, table, rule, and open question without inventing facts:

| You want | In the template or config | What happens |
| --- | --- | --- |
| A creative, domain-tailored interactive HTML artifact (default) | Nothing set (omit `layout`) | A subagent designs a bespoke, full-fidelity self-contained HTML artifact fitted to the document's domain and readers. |
| Visual and structural guidelines for every run of this template | A `layout` comment alone | A subagent composes the artifact around your visual guidelines and section emphasis. |
| Fixed brand elements or design ideas combined with custom layout | `layout` / `style` (or global `workflow.style`) plus optional `layout` comment | A subagent treats any reference HTML, CSS, design-system doc, verbal direction, or screenshot as inspiration or fixed brand framing (masthead, palette, footer) — composing creatively around the document rather than injecting fields mechanically. |
| Disable HTML output across your team or user settings | `view = "never"` in `bmad-facilitate.toml` / `.user.toml` | Overrides templates to skip HTML generation globally. |

The `layout` comment sits above the first heading with the other comments, and says what the page should do:

```markdown
<!-- layout: The sheet is the deliverable. Keep to one printable page, give key stats visual callouts, and let this character's world set the palette and typography. -->
```

An HTML artifact comes strictly from the finalized document, so it adds no claim the document does not hold. Each one costs a fresh generation, so the skill offers it at close (alongside native host artifact surfaces when available) unless `view` is `always`, from the template or team/user settings, which win over the template's. `view = "never"` in team or user settings disables HTML output globally.

:::tip[Templates for an agent]
An agent in a module offers the templates in the module's `doc-templates/` folder that name it in `agents`. An agent outside a module ships its templates in its `assets/` folder, and its `customize.toml` lists that folder in `template_libraries`. The agent passes the list when it runs `bmad-facilitate`, and it is searched after yours, so your copy with the same id wins. The settings in `bmad-facilitate.toml` (style, views, review and polish) still apply.
:::

## Check the result

Run the resolver on `bmad-facilitate` with `--key workflow.template_libraries` to see the merged list; see [Check what resolved](./customize-bmad.md#check-what-resolved). Then ask `bmad-facilitate` for your new document type and confirm it offers your template.
