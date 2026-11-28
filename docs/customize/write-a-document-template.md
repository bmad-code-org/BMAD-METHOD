---
title: 'Write a Document Template'
description: Add your own template to bmad-facilitate, replace or extend a shipped one, configure voice and visuals, and control how self-contained HTML views look.
sidebar:
  order: 7
---

Use the `bmad-facilitate` template format to teach BMad new document types or tailor existing ones to your organization. Each template is a plain markdown file specifying the sections, coaching prompts, and review criteria, while `bmad-facilitate` settings control template libraries, visuals, voice guides, and HTML views.

If you are new to templates, read [How Document Templates Work](./how-document-templates-work.md) for the overview or follow [Customize a Document for Your Team](./customize-a-document-for-your-team.md) for a guided walkthrough. This page covers the full template file format and visual configuration.

## When to Use This

- Your team relies on a document type the shipped templates do not include.
- Your organization requires a specific format for a postmortem, proposal, or architecture record.
- A shipped template fits mostly well, and you want to add required sections, policies, or review checks.
- You want rendered HTML artifacts to follow specific layout guidelines or visual references.

:::note[Prerequisites]
BMad installed with Core Tools and `bmad setup` run. Project templates live in `_bmad/custom/facilitate-templates/`, and workflow settings live in `_bmad/custom/bmad-facilitate.toml` (team) or `bmad-facilitate.user.toml` (personal). You can ask `bmad-customize` to write any template extension or workflow setting for you; see [Customize BMad](./customize-bmad.md).
:::

## Add a Template to the Library

The fastest way to author a new template is to ask `bmad-facilitate` directly in chat (for example, "bmad-facilitate, make a template for vehicle appraisal reports"). It coaches you through the structure using all the rules below and saves the file in `_bmad/custom/facilitate-templates/`. If you want a custom agent to offer the template as well, ask Smithy (`bmad-toolsmith`).

To write one by hand, save a markdown file with a `template:` frontmatter field in `_bmad/custom/facilitate-templates/`, placing any rubric or method catalog beside it. No separate registration step is required.

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
| `template` | Kebab-case id used to name the run folder and match updates back to the template. |
| `version` | Optional template version copied into generated documents so later updates know if the template changed. |
| `description` | Short line (under ~80 characters) describing what the template is for. Quote it if it contains a colon. |
| `not_for` | Optional short line stating what the template does not cover and which template to use instead. |
| `mode` | Optional starting mode: `freeform` (default), `step-by-step`, or `fast`. A team or user `mode` setting overrides it. |
| `order` | Optional. Set `fixed` when section order matters as much as the result; freeform then runs step-by-step, and fast preserves order. |
| `facilitation_order` | Section ids in the order the coach raises them. See [Order the Sections](#order-the-sections). |
| `guidance` | Optional path relative to the template pointing to shared family rules (such as `guidance-method.md` in Method or `guidance-planning.md` in Founder). |
| `agents` | Optional list of agent skill names that offer this template (such as `[bmad-agent-pm]`). Any agent the user asks directly can still run it. |
| `rubric` | Optional path to a review rubric relative to the template, or `rubric-general` for the shipped default rubric. |
| `methods` | Optional path to a CSV method catalog relative to the template supplying structured coaching questions. |
| `companions` | Optional list of sibling filenames expected beside the main document (for example, `[DESIGN.md, EXPERIENCE.md]`), tracked across Resume, Progress, Review, and Finalize. |
| `forbid_id_prefixes` | Optional list of disallowed id prefixes (for example, `[FR]`) checked during Finalize. |
| `lint` | Optional custom script path or command (supporting `{doc}`, `{run}`, and `{project-root}`) executed during Finalize step 1. |
| `output` | Optional run folder or `.md` path supporting `{project-root}`, `{output_folder}`, `{active_initiative}`, `{id}`, and `{slug}`. |
| `style` | Optional visual style guidance for this template's HTML artifact: a CSS file, design-system doc, starter HTML file, reference screenshot path, or verbal aesthetic preference relative to the template. |
| `layout` | Optional layout guide or reference file for the HTML artifact. Guides appearance and emphasis, never whether HTML is generated. |
| `view` | Optional default HTML view behavior: `always`, `offer`, or `never`. Team or user `view` settings override it (`never` disables HTML views globally). |

`template` and `version` remain in finished documents, along with any extra frontmatter fields your HTML view displays; orchestration-only fields stay out of the final markdown.

A method catalog CSV uses the header `category,name,key_questions`, separating questions with `|`:

```csv
category,name,key_questions
release,Rollback,"How is this change undone?|Who can run the rollback?"
```

## Replace a Shipped Template

`bmad-facilitate` searches project and personal libraries before installed modules, and the first match for an id wins. To replace a shipped template outright, copy it (plus any rubric or catalog it references) from the module's `doc-templates/` folder into `_bmad/custom/facilitate-templates/`, keep the same `template:` id, and edit the copy.

## Use More Than One Library

`template_libraries` lists template sources in search order, defaulting to `{project-root}/_bmad/custom/facilitate-templates` followed by `~/.bmad/facilitate-templates`. Ask `bmad-customize` to append extra sources (or add them to `_bmad/custom/bmad-facilitate.toml`):

```toml
# _bmad/custom/bmad-facilitate.toml

[workflow]
template_libraries = ["https://github.com/fernhollow/doc-templates@v1.2.0"]
```

| Source type | Example |
| --- | --- |
| Local folder or single `.md` file | `{project-root}/docs/templates` or `~/templates` |
| GitHub repository, folder, or file (via `gh`) | `https://github.com/fernhollow/doc-templates/tree/v1.2.0/planning` |
| Direct URL to one `.md` file | `https://example.com/templates/runbook.md` |
| Plain sentence naming an MCP tool | `Search corp:confluence_search in the DOCS space for templates` |

Private libraries that teammates cannot access belong in `bmad-facilitate.user.toml`. If a library cannot be reached, `bmad-facilitate` reports it and continues with the remaining libraries.

:::caution[Trust Only Sources You Control]
A template directs the agent during facilitation, so point `template_libraries` only at sources your organization controls. Pin remote GitHub references to a commit SHA or immutable tag with `@ref` when reproducibility matters.
:::

## Ship Templates in a Module

Modules ship templates inside a `doc-templates/` folder beside their `bmod.toml` along with any companion rubrics or catalogs. Installed module templates appear automatically with no extra configuration and update alongside the module (as in `bmod-method`, `bmad-founder-agent-advisor`, and `bmad-creative-agent-director`). Prefer adding new ids or `extends:` files inside shared modules, reserving full replacements for project-level `_bmad/custom/facilitate-templates/`.

## Write the Template File

Every template has three parts: YAML frontmatter, document-level HTML comments that instruct the coach, and `##` section headings with section comments. Comments never appear in the finished document. Whenever a template rule conflicts with general skill defaults, the template wins (except that headless runs never pause to ask questions).

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

Document-level comments above the first heading are all optional:

| Key | What it tells the coach |
| --- | --- |
| `purpose` | The decision or job the finished document serves. |
| `stance` | How to coach this document, including mode behavior. |
| `opening` | How to begin the session (for example, opening questions, records to ask for first, or skipping the brain dump for a strict questionnaire). |
| `inputs` | Facts that must be asked in every interactive mode unless already supplied. |
| `writing` | Writing constraints specific to this document. |
| `companions` | Sibling files written beside the document, when to create them, and what each holds. |
| `done when` | The test that ends questioning and informs final review. |
| `layout` | Visual and structural guidance for the rendered HTML artifact. |
| `next` | Suggested follow-up actions once the document is finalized. |

In the markdown body, `{title}` is the only placeholder.

Each `##` section carries one comment describing what goes in the section. Add `diagram:` when a diagram communicates better than prose (naming a Mermaid type such as `flowchart`, `sequence`, `state`, `timeline`, `gantt`, `er`, `mindmap`, `quadrant`, `journey`, or `pie`, or describing what to sketch). Start a section comment with `optional` or `include when:` for conditional sections, or `built:` for sections synthesized automatically after earlier sections settle (such as an executive summary or glossary).

### Order the Sections

`facilitation_order` lists every `##` section id (lowercase heading, punctuation dropped, spaces replaced with hyphens, so `What's next?` becomes `whats-next`). It controls the order the coach discusses sections rather than their final order in the document, allowing an executive summary at the top of the file to be drafted last.

Every section is resolved before Finalize in every mode: required sections are filled, optional sections are offered to the user, and `include when:` sections are checked against their condition. Omitted sections are listed at the end with reasons.

Keep section comments focused on what belongs in the section and what to press on rather than pasting sample text that the model might imitate verbatim. A comment can also enforce fixed choices directly ("The user must pick a team from `docs/teams.md`"). See [Document Templates](../reference/document-templates.md) for shipped templates that demonstrate each pattern.

### Choose How a Run Walks the Sections

Every run starts in one of three modes:

| Mode | How it runs |
| --- | --- |
| `freeform` (default) | Follows the user's thread conversationally across sections, updates the document in the background, and confirms major decisions as they settle. |
| `step-by-step` | Works through one section at a time in `facilitation_order` and settles each before opening the next. Among shipped Method templates, `srs` and `brd` set `mode: step-by-step`. |
| `fast` | Drafts the complete document first, then reviews assumptions with the user. Among shipped Method templates, `ux-quick`, `prototype-plan`, and `decision-record` set `mode: fast`. |

A team or personal `mode` set on `bmad-facilitate` via `bmad-customize` overrides each template's default, and the user can switch modes mid-run.

Set `order: fixed` when earlier sections must settle before later ones are worked (for example, defending a PRFAQ press release before writing FAQs). On a fixed-order template, freeform runs as step-by-step and fast still preserves order. Shipped templates using `order: fixed` are Mary's `prfaq` and `opportunity`, the `experiment` card shared by Mary and John, Sally's `ux-audit`, Winston's `tech-evaluation` and `postmortem`, and Nadia's `cofounder-agreement`, `startup-diagnostic`, `positioning`, `first-hire`, and `validation-experiment`.

In `step-by-step` runs, chat messages open with a progress header such as `PRFAQ · Customer FAQ (2 of 4)`. In `freeform` and `fast` runs, progress counters stay out of chat while completeness is verified before Finalize.

Add a bare `## Table of Contents` heading directly beneath the title on long templates so the skill generates and verifies a linked table of contents during Finalize.

## Use a Format You Already Have

A markdown file with no comments still works: every heading becomes a required section in document order. Save your existing document structure in `_bmad/custom/facilitate-templates/` with `template` and `description` frontmatter, then add comments later whenever you want targeted coaching or conditional sections.

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

## Extend a Template

An extension modifies a shipped template without copying it, so future updates to the base template still reach you. Save a markdown file with `extends: <id>` in `_bmad/custom/facilitate-templates/` (or ask `bmad-customize` to write it). On every run, `bmad-facilitate` merges matching extensions ahead of the base template so extension rules take precedence.

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

| In an extension | Effect |
| --- | --- |
| A `##` section | Inserts a new section where its comment places it, or adds to / replaces an existing section with the same heading. Required unless the comment begins with `optional` or `include when:`. |
| `facilitation_order` frontmatter | Replaces the entire section order and removes any base section omitted from the list. Set it only when reordering or dropping base sections. |
| `stance`, `inputs`, `writing`, or `done when` comments | Appended to the base template's comments, winning wherever they conflict. |
| Frontmatter keys (`description`, `not_for`, `guidance`, `rubric`, `methods`, `output`, `style`, `layout`, `view`, `mode`, `order`, `companions`, `forbid_id_prefixes`, `lint`) | Replaces the base template's value. An empty value (`mode: ""`, `order: ""`, `lint: ""`, `companions: []`, `forbid_id_prefixes: []`) clears the base value. |

This short extension adds an opening quote and enables HTML views by default on every PRD while keeping John's shipped PRD updates flowing:

```markdown
---
extends: prd
view: always
---

## Quote
<!-- First, right under the title. Ask the user for a quote unique to this product before anything else. -->
```

When two extensions conflict, the first in library search order wins. Rules that apply across all templates belong on `bmad-facilitate` (`persistent_facts`, `doc_standards`, and `finalize_reviewers`) rather than in individual template extensions.

## Visuals and Voice Guide Settings

`bmad-facilitate` exposes two workflow-level content controls through `bmad-customize` (stored in `_bmad/custom/bmad-facilitate.toml` or `.user.toml`):

- `visuals` holds one instruction governing how aggressively documents use tables, Mermaid diagrams, inline SVGs, and generated images. By default, `bmad-facilitate` creates a visual whenever a diagram communicates faster than prose. Replace `visuals` (for example, `"Tables and Mermaid diagrams only. No image files."`) to restrict output forms; template-specific `diagram:` and `writing` comments still win on their own sections.
- `voice_guide` holds an optional path to a personal writing or speaking voice guide (such as `~/.bmad/voice-bible.md`), normally set in `_bmad/custom/bmad-facilitate.user.toml`. When set, first-person author-voiced documents across modules follow your voice rather than a neutral register (Creative module runs also support `modules.creative.voice_guide`).

## Control Self-Contained HTML Views

Every document stays markdown during drafting so the coach can iterate, review, and diff it cleanly. At Close, `bmad-facilitate` can also author a single, strictly self-contained `.html` artifact from the finalized markdown and companions: all CSS, JavaScript, and local images are inlined directly into the file with zero external network requests, and the view never renders raw markdown client-side.

Three layers control how HTML artifacts look and whether they are generated:

| Control | Where to set it | What it does |
| --- | --- | --- |
| **Project brand or design system** (`modules.core-tools.design_system`) | `bmad setup` | Applies your organization's shared design system, palette, and typography across HTML outputs project-wide (a template's own domain-specific `layout` can still override it, such as for a fictional character sheet). |
| **Global or template `style` and `layout`** | `bmad-customize` on `bmad-facilitate` (`style`) or template frontmatter / `layout` comment | Accepts a CSS file, a design-system doc, a starter HTML file, a reference screenshot path, or a verbal aesthetic preference. The renderer treats references as visual inspiration or fixed brand elements (masthead, palette, footer) while composing creatively around the document's content. |
| **HTML generation default (`view`)** | `bmad-customize` on `bmad-facilitate` (`view`) or template frontmatter | Accepts `offer` (ask at close), `always` (generate automatically), or `never` (disable HTML views globally, overriding both templates and callers). |

For example, adding a `layout` comment above the first heading shapes how a template renders:

```markdown
<!-- layout: The sheet is the deliverable. Keep to one printable page, give key stats visual callouts, and let this character's world set the palette and typography. -->
```

HTML artifacts are fidelity-checked against the finalized markdown and companions before presentation so no unsupported facts enter and no settled decisions, metrics, rules, or open questions are dropped.

:::tip[Templates Bundled with an Agent]
An agent inside a module automatically offers templates in its module's `doc-templates/` folder that list the agent in `agents`. A standalone agent outside a module ships templates in its `assets/` folder and lists that folder in its `template_libraries`. Because project and personal libraries are searched first, your local overrides still take priority.
:::

## Verify Your Template

Ask the BMad Agent or `bmad-customize` to show the merged template and confirm your library is active (see [Configuration and Customization Reference](../reference/configuration.md)), then ask `bmad-facilitate` or the assigned agent to start a run with your new template id.
