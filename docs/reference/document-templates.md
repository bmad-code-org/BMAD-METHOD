---
title: Document Templates
description: The templates that ship with bmad-facilitate, and which one shows each thing a template can do.
sidebar:
  order: 4
---

Use this page to find a shipped template to copy, or to see how a template does something you want. Modules ship them, each in the `doc-templates/` folder beside its `bmod.toml` in your skills folder: `bmod-method`, `bmad-founder-agent-advisor` or `bmod-cis`.

To change one for your team, extend it instead of copying it, so its updates keep arriving; [Customize a Document for Your Team](../customize/customize-a-document-for-your-team.md) shows how. To start a different document from one, copy it into `_bmad/custom/facilitate-templates/` with a new `template:` id and edit the copy. [Write a Document Template](../customize/write-a-document-template.md) covers the file format.

## Shipped templates

| Template | Module | Use it for |
| --- | --- | --- |
| `decision-record` | BMad Method | Recording a choice, the alternatives and what it costs |
| `postmortem` | BMad Method | Learning from something that went wrong, without blame |
| `security-review` | BMad Method | Checking a system against the OWASP Top 10 or STRIDE |
| `proposal` | Founder | Asking for money, time or approval |
| `pitch-deck` | Founder | A talk or pitch with slides |
| `accelerator-application` | Founder | An application to an accelerator, in the program's own questions |
| `board-pack` | Founder | The pre-read sent before a board meeting |
| `cofounder-agreement` | Founder | Co-founders agreeing roles, decisions, equity and leaving before a lawyer drafts |
| `customer-interview-script` | Founder | A customer interview guide built on past behaviour |
| `first-hire` | Founder | Deciding whether to hire now, and the scorecard, cost and test for the role |
| `fundraising-plan` | Founder | Planning a raise: amount, milestones, instrument, investors and stop date |
| `ideal-customer` | Founder | The first narrow group of customers to win and how to reach them |
| `investor-update` | Founder | The monthly or quarterly update to investors and advisors |
| `launch-plan` | Founder | Taking a product to market |
| `lean-canvas` | Founder | The whole business model on one page, with its riskiest assumption |
| `ninety-day-plan` | Founder | Two or three goals for the next ninety days, with metrics and owners |
| `positioning` | Founder | Positioning and the one-liner |
| `pricing` | Founder | How the product is priced and how the price is tested |
| `startup-diagnostic` | Founder | Hard questions on whether an idea has real demand, ending in one dated assignment |
| `validation-experiment` | Founder | Testing whether people will pay or act, with the pass mark set first |
| `character` | Creative Intelligence Suite 0.4.0 and later | A fictional character for a story, game or campaign, on a one-page sheet |

The BMad Method also ships the planning templates John (`bmad-agent-pm`) and Mary (`bmad-agent-analyst`) run, `brief`, `prfaq` and `brd` among them; see [Define Requirements and a Specification](../plan/define-requirements-and-a-specification.md).

## What a template can do

| To do this | Look at | How it works |
| --- | --- | --- |
| Press the user on a thin answer | `postmortem`, Contributing factors | The section comment says when to push and what to ask |
| Make the user pick from a list | `decision-record`, Status | The section comment names the allowed values |
| Make the user pick from a source | `security-review`, Scope and system | The section comment points at the method catalog |
| Drive questions from a catalog | `security-review`, `methods-security.csv` | The `methods` frontmatter names a CSV of key questions |
| Walk the sections in order, each with its own voice | `prfaq` in `bmad-agent-analyst/assets/` | `paced: true` in the frontmatter, and each section comment is the brief for that part |
| Change how a path runs | `security-review`, `stance` | The comment says what the fast path does for this document |
| Use the shared planning rules | Any shipped template | `guidance: guidance-planning` adds stakes levels, `[ASSUMPTION]` tags in the body, ids and testable requirements |
| Review against its own rubric | `proposal`, `rubric-proposal.md` | The `rubric` frontmatter names the file |
| Set the order and what is required | Any shipped template | `facilitation_order` lists the sections by id, `?` on those not required |
| Include a section only when it applies | `proposal`, Alternatives | `alternatives?` in the order and an `include when:` section comment |
| Draw a diagram | `postmortem`, Timeline | A `diagram:` kind in the section comment |
| Add a table of contents | `proposal` | A bare `## Table of Contents` heading after the title |
| Render as slides | `pitch-deck` | `view: slides` in the frontmatter |
| Always make the view | `pitch-deck` | `html_view: always` in the frontmatter, because the slides are the deliverable |
| Render the same layout every time | `prfaq` in `bmad-agent-analyst/assets/`, `prfaq-view.html`; also `brief` and John's `pitch` | `view` names an HTML file whose slots a script fills at close |
| Have a page written for each document | `character`, `character-sheet.html` | `view` names a starter, and a `view` comment gives the brief |
| Have a page written from a brief alone | Founder's templates, such as `pitch-deck` | A `view` comment with no `view` file says where to be creative |
| Propose rather than only ask | `character`, `stance` | The comment invites proposals; one the user accepts is theirs |
| Write several files | `postmortem`, `companions` | The comment says when to write the customer notice and what it holds |

No shipped template adds to another. [Extend a template](../customize/write-a-document-template.md#extend-a-template) shows how.
