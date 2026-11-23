---
title: Document Templates
description: The templates that ship with bmad-facilitate, and which one shows each thing a template can do.
sidebar:
  order: 3
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

## Documents John and Mary write

The BMad Method also ships the planning templates for John, the Product Manager (`bmad-agent-pm`), and Mary, the Business Analyst (`bmad-agent-analyst`). The templates live in the method module's `doc-templates/` folder, and each names the agents that offer it in `agents`. Mary writes the documents that decide whether and why to go ahead; John writes the ones that define what gets built and how it ships. The list says who offers each by default; either writes any of them when you ask. Both agents hand every create, update, and validate to `bmad-facilitate`, so each document works the same way. [Write a PRD](../plan/write-a-prd.md) shows the modes, stakes, and assumption tags they share.

| Document | Who | Level | Fits |
| --- | --- | --- | --- |
| Opportunity assessment | Mary | Initiative | Whether a problem is worth pursuing, before any solution |
| Experiment card | Mary or John | Any | A measured test of one hypothesis, its thresholds set before it runs |
| Prototype plan | John | Any | A quick build to test an idea, some options, or a look and feel |
| PRFAQ | Mary | Before an initiative | Whether a concept survives scrutiny, working back from its press release |
| Brief | Mary | Before an initiative | Why to build a product, or pitching it, in a page or two |
| Business case | Mary | Initiative | A funding decision: cost, expected return, go or no-go |
| Strategy narrative | Mary | Program | A written argument for leadership to decide a strategy or annual plan |
| PRD | John | Program or initiative | Outcomes, guardrails and the epic map for work with several capabilities |
| Epic PRD | John | Epic | One capability's requirements: journeys, numbered requirements, rules and how it is measured |
| Shape Up pitch | John | Initiative or epic | A shaped, time-boxed proposal for teams that bet fixed cycles |
| Program charter | Mary or John | Program | One mandate, benefits, scope, and governance across several initiatives |
| Requirements specification | John | Initiative | Traceable, verifiable requirements for regulated or contracted work |
| Business requirements document | Mary | Initiative | What the business requires and signs for, when a separate party builds, a sponsor signs, or a regulator or contract expects it |
| Launch plan | John | Initiative | Coordinating a built feature's release across teams |

The first seven come before you commit, in Clarify; the rest plan and ship the work. Each is walked one section at a time by default, except the launch plan, which starts freeform; the PRFAQ, the experiment card, the opportunity assessment and the pitch keep their order even when you ask for freeform. A brief from Mary feeds the PRD, but neither requires the other. A business case or strategy narrative stays in prose and ends with a `## For requirements` list of ids, so Sofia can write the initiative from it without a PRD.

## What a template can do

| To do this | Look at | How it works |
| --- | --- | --- |
| Press the user on a thin answer | `postmortem`, Contributing factors | The section comment says when to push and what to ask |
| Make the user pick from a list | `decision-record`, Status | The section comment names the allowed values |
| Make the user pick from a source | `security-review`, Scope and system | The section comment points at the method catalog |
| Drive questions from a catalog | `security-review`, `methods-security.csv` | The `methods` frontmatter names a CSV of key questions |
| Walk the sections in order, each with its own voice | `prfaq` in `bmod-method/doc-templates/` | `order: fixed` in the frontmatter, and each section comment is the brief for that part |
| Change how a mode runs | `security-review`, `stance` | The comment says what fast mode does for this document |
| Use shared family rules | Any Method or Founder template | `guidance: guidance-method.md` (Method) or `guidance: guidance-planning.md` (Founder) resolves beside the template |
| Review against its own rubric | `proposal`, `rubric-proposal.md` | The `rubric` frontmatter names the file (or bare `rubric-general` for the core general rubric) |
| Set the order and what is required | Any shipped template | `facilitation_order` lists the sections by id; a section's comment says whether it is required |
| Include a section only when it applies | `proposal`, Alternatives | An `include when:` section comment |
| Draw a diagram | `postmortem`, Timeline | A `diagram:` kind in the section comment |
| Add a table of contents | `proposal` | A bare `## Table of Contents` heading after the title |
| Always make the view | `pitch-deck` | `view: always` in the frontmatter, because the slides are the deliverable |
| Steer the HTML artifact with layout guidelines | `brief`, `pitch`, `prfaq` in `bmod-method/doc-templates/` | A `layout` comment sets structural guidelines while preserving full fidelity |
| Combine fixed brand elements or ideas with custom composition | Any template with `layout` / `style` reference files | Reference HTML, CSS, design-system docs, or screenshots guide composition without mechanical value injection |
| Have a creative artifact written from a brief alone | Founder's templates, such as `pitch-deck` | A `layout` comment with no reference file guides visual treatment |
| Propose rather than only ask | `character`, `stance` | The comment invites proposals; one the user accepts is theirs |
| Write and track several files | `postmortem` (`companions` comment); any template with `companions: [...]` frontmatter | Frontmatter `companions: [...]` tracks expected sibling files in `progress.py` and `check_ids.py`; a `companions` comment explains when and what each holds |
| Forbid leaking id prefixes | Any multi-altitude template | `forbid_id_prefixes: [...]` passes `--forbid-prefix` to `check_ids.py` at Finalize |
| Run a custom Finalize lint check | Any domain template | `lint:` names a relative script or command run during Finalize step 1 |

No shipped template adds to another. [Extend a template](../customize/write-a-document-template.md#extend-a-template) shows how.
