---
title: Document Templates
description: The templates that ship with bmad-facilitate, and which one shows each thing a template can do.
sidebar:
  order: 3
---

Use this page to find a shipped template to copy, or to see how a template does something you want. Modules ship them, each in the `doc-templates/` folder beside its `bmod.toml` in your skills folder: `bmod-method`, `bmad-founder-agent-advisor` or `bmad-creative-agent-director`.

To change one for your team, extend it instead of copying it, so its updates keep arriving; [Customize a Document for Your Team](../customize/customize-a-document-for-your-team.md) shows how. To start a different document from one, copy it into `_bmad/custom/facilitate-templates/` with a new `template:` id and edit the copy. [Write a Document Template](../customize/write-a-document-template.md) covers the file format.

## BMad Method Templates

The BMad Method module keeps its templates in `bmod-method/doc-templates/`, grouped by the agent that coaches them by default (any agent writes another when asked):

### Mary and John (Analysis and Product)

| Template | Who | Level | Fits |
| --- | --- | --- | --- |
| `opportunity` | [Mary](../agents/mary-analyst.md) | Initiative | Whether a problem is worth pursuing, before any solution (`order: fixed`) |
| `experiment` | [Mary](../agents/mary-analyst.md) or [John](../agents/john-pm.md) | Any | A measured test of one hypothesis, its thresholds set before it runs (`order: fixed`) |
| `prototype-plan` | [John](../agents/john-pm.md) | Any | A quick build to test an idea, some options, or a look and feel (`mode: fast`) |
| `prfaq` | [Mary](../agents/mary-analyst.md) | Pre-initiative | Whether a concept survives scrutiny, working back from its press release (`order: fixed`) |
| `brief` | [Mary](../agents/mary-analyst.md) | Pre-initiative | Why to build a product, or pitching it, in a page or two |
| `business-case` | [Mary](../agents/mary-analyst.md) | Initiative | A funding decision: cost, expected return, go or no-go |
| `narrative` | [Mary](../agents/mary-analyst.md) | Program | A written argument for leadership to decide a strategy or annual plan |
| `prd-program` | [John](../agents/john-pm.md) | Program | Outcomes, guardrails, rollout strategy and initiative map across initiatives |
| `prd` | [John](../agents/john-pm.md) | Initiative | Outcomes, guardrails and the epic map for work with several capabilities |
| `prd-epic` | [John](../agents/john-pm.md) | Epic | One capability's requirements: journeys, numbered requirements, rules and how it is measured |
| `pitch` | [John](../agents/john-pm.md) | Initiative or epic | A shaped, time-boxed proposal for teams that bet fixed cycles |
| `charter` | [Mary](../agents/mary-analyst.md) or [John](../agents/john-pm.md) | Program | One mandate, benefits, scope, and governance across several initiatives |
| `srs` | [John](../agents/john-pm.md) | Initiative | Traceable, verifiable requirements for regulated or contracted work (`mode: step-by-step`) |
| `brd` | [Mary](../agents/mary-analyst.md) | Program or initiative | Signed business requirements when a separate party builds or a regulator expects it (`mode: step-by-step`) |
| `launch` | [John](../agents/john-pm.md) | Initiative | Coordinating a built feature's release across teams |

A `business-case` or `narrative` ends with a `## For requirements` list of ids, so Sofia can write the initiative or program from it without a PRD. See [Write a PRD](../plan/write-a-prd.md).

### Sally (UX and Brand)

| Template | Category | Fits |
| --- | --- | --- |
| `trigger-map` | Strategy | User-psychology trigger map: goals, target groups, desires, and fears (shared with Mary) |
| `brand-identity` | Strategy | Reusable corporate brand kit: logos, `DESIGN.md` tokens, `BRAND.md`, and Brand Book |
| `design-direction` | Strategy | Comp dissection, taste dials, themes, or Stitch/Claude Design/Figma handoffs |
| `ux-system` | Product UX | Initiative `DESIGN.md` tokens and shared `EXPERIENCE.md` IA and accessibility |
| `ux-epic` | Product UX | Epic `EXPERIENCE.md` flows, states, microcopy, and key-screen mockups |
| `ux-quick` | Product UX | Lightweight single-flow `EXPERIENCE.md` and wireframe (`mode: fast`) |
| `website-design` | Websites | Marketing site, landing page, docs, or portfolio narrative and conversion system |
| `ux-audit` | Audits | Six-dimension usability, visual craft, states, and accessibility scorecard (`order: fixed`) |

### Winston (Architecture and Technical Operations)

| Template | Fits |
| --- | --- |
| `arch-enterprise` | Enterprise architecture spine across coupled initiatives |
| `arch-spine` | Initiative architecture spine: stack, seams, `AD-n` invariants, AI/cost bounds, Contract Index |
| `arch-epic` | Epic tech design against live code: story contracts, schemas, migrations, and `contract.yaml` |
| `solution-design` | Human-facing technical RFC and proposal for ARB, partner, or client sign-off |
| `api-design` | Public API, webhook, or partner integration contract with versioning and error rules |
| `tech-evaluation` | Weighted build-vs-buy, vendor, or stack bake-off with TCO (`order: fixed`) |
| `migration-plan` | Data, platform, or API migration plan with parity proof and rollback gates |
| `agent-readiness` | Codebase audit for agentic delivery friction, doc noise, and pattern drift |
| `production-readiness` | Pre-launch production readiness review: SLOs, capacity, recovery, and verdict |
| `decision-record` | Recording any choice, the alternatives, and what it costs (`mode: fast`) |
| `postmortem` | Blameless incident timeline, contributing factors, actions, and customer notice (`order: fixed`) |
| `security-review` | Reviewing a system against OWASP Top 10, STRIDE, or a custom catalog |

## Founder and Creative Templates

| Template | Module | Use it for |
| --- | --- | --- |
| `startup-diagnostic` | [Founder](../founder/founder.md) | Hard questions on whether an idea has real demand, ending in one dated assignment (`order: fixed`) |
| `customer-interview-script` | Founder | A customer interview guide built on past behaviour |
| `ideal-customer` | Founder | The first narrow group of customers to win and how to reach them |
| `validation-experiment` | Founder | Testing whether people will pay or act, with the pass mark set first (`order: fixed`) |
| `lean-canvas` | Founder | The whole business model on one page, with its riskiest assumption |
| `positioning` | Founder | Positioning and the one-liner (`order: fixed`) |
| `pricing` | Founder | How the product is priced and how the price is tested |
| `fundraising-plan` | Founder | Planning a raise: amount, milestones, instrument, investors and stop date |
| `proposal` | Founder | Asking for money, time or approval |
| `accelerator-application` | Founder | An application to an accelerator, in the program's own questions |
| `pitch-deck` | Founder | A talk or pitch with slides (`view: always`) |
| `cofounder-agreement` | Founder | Co-founders agreeing roles, decisions, equity and leaving before a lawyer drafts (`order: fixed`) |
| `first-hire` | Founder | Deciding whether to hire now, and the scorecard, cost and test for the role (`order: fixed`) |
| `ninety-day-plan` | Founder | Two or three goals for the next ninety days, with metrics and owners |
| `launch-plan` | Founder | Taking a product to market |
| `investor-update` | Founder | The monthly or quarterly update to investors and advisors |
| `board-pack` | Founder | The pre-read sent before a board meeting |
| `story` | [Creative](../creative/creative.md) | A narrative, brand origin, documentary arc, case study, or transformation story |
| `character` | Creative | A fictional character for a story, game or campaign, with a one-page sheet |
| `world` | Creative | A setting, magic or tech ruleset, factions, tensions, and aesthetic canon |
| `talk-script` | Creative | Spoken keynote, conference talk, podcast, or video explainer calibrated to `measured_wpm` |
| `presentation` | Creative | A narrative and visual slide deck given by a speaker |
| `problem-solve` | Creative | Root-cause diagnosis and contradiction-breaking (TRIZ, systems thinking) |
| `design-thinking` | Creative | Non-software human-centered design for services, workshops, and physical products |
| `innovation-play` | Creative | Non-startup strategic reframing across Blue Ocean, Three Horizons, and S-Curve plays |

## What a template can do

| To do this | Look at | How it works |
| --- | --- | --- |
| Press the user on a thin answer | `postmortem`, Contributing factors | The section comment says when to push and what to ask |
| Make the user pick from a list | `security-review`, Findings | The section comment names the allowed status and severity values |
| Drive questions from a custom catalog | Any custom template (`methods:`) | The `methods` frontmatter names a relative CSV (`category`, `name`, `key_questions`) for proprietary checklists |
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
| Write and track several files | `postmortem` (`companions` comment); any template with `companions: [...]` frontmatter | Frontmatter `companions: [...]` tracks sibling files in `progress.py` and at Finalize; a `companions` comment explains when and what each holds |
| Forbid leaking id prefixes | Any multi-altitude template | `forbid_id_prefixes: [...]` flags disallowed id prefixes at Finalize |
| Run a custom Finalize lint check | Any domain template | Optional custom `lint:` names a relative script or command run during Finalize step 1 |

No shipped template adds to another. [Extend a template](../customize/write-a-document-template.md#extend-a-template) shows how.
