---
title: Document Templates
description: The templates that ship with bmad-facilitate across BMad Method, Founder, and Creative, and which template demonstrates each capability.
sidebar:
  order: 3
---

Use this page to find a shipped template to extend or copy, or to see a working example of a specific template capability. Modules store templates in `doc-templates/` beside their `bmod.toml`: `bmod-method` (35 templates), `bmad-founder-agent-advisor` (17 templates), and `bmad-creative-agent-director` (8 templates).

To customize a shipped template for your team without losing future updates, extend it; see [Customize a Document for Your Team](../customize/customize-a-document-for-your-team.md). To write a new template or inspect every frontmatter field, see [Write a Document Template](../customize/write-a-document-template.md).

## BMad Method Templates

BMad Method keeps its 35 templates in `bmod-method/doc-templates/`, grouped by the default coaching agent (any agent can run another template when asked directly). Six Method templates generate a self-contained HTML artifact automatically (`view: always`): `agent-readiness`, `brand-identity`, `brief`, `pitch`, `prfaq`, and `ux-audit`.

### Mary and John (Analysis and Product)

| Template | Who | Level | Fits |
| --- | --- | --- | --- |
| `opportunity` | [Mary](../agents/mary-analyst.md) | Initiative | Whether a problem is worth pursuing before choosing a solution (`order: fixed`) |
| `experiment` | [Mary](../agents/mary-analyst.md) or [John](../agents/john-pm.md) | Any | A measured test of one hypothesis with thresholds set before running (`order: fixed`) |
| `prototype-plan` | [John](../agents/john-pm.md) | Any | A quick build to test an idea, options, or interaction feel (`mode: fast`) |
| `prfaq` | [Mary](../agents/mary-analyst.md) | Pre-initiative | Stress-testing a concept by writing its press release and FAQs first (`order: fixed`, `view: always`) |
| `brief` | [Mary](../agents/mary-analyst.md) | Pre-initiative | Why to build a product, or pitching it, in one or two pages (`view: always`) |
| `business-case` | [Mary](../agents/mary-analyst.md) | Initiative | Funding decision covering cost, expected return, and go or no-go criteria |
| `narrative` | [Mary](../agents/mary-analyst.md) | Program | Written argument for leadership to decide a strategy or annual plan |
| `prd-program` | [John](../agents/john-pm.md) | Program | Outcomes, guardrails, rollout strategy, and initiative map across initiatives |
| `prd` | [John](../agents/john-pm.md) | Initiative | Outcomes, guardrails, and epic map for work spanning several capabilities |
| `prd-epic` | [John](../agents/john-pm.md) | Epic | One capability's requirements: user journeys, numbered requirements, rules, and measurement |
| `pitch` | [John](../agents/john-pm.md) | Initiative or epic | Shaped, time-boxed proposal for teams betting fixed cycles (`view: always`) |
| `charter` | [Mary](../agents/mary-analyst.md) or [John](../agents/john-pm.md) | Program | Shared mandate, benefits, scope, and governance across initiatives |
| `srs` | [John](../agents/john-pm.md) | Initiative | Traceable, verifiable requirements for regulated or contracted work (`mode: step-by-step`) |
| `brd` | [Mary](../agents/mary-analyst.md) | Program or initiative | Signed business requirements when an external team builds or regulators require sign-off (`mode: step-by-step`) |
| `launch` | [John](../agents/john-pm.md) | Initiative | Coordinating a built feature's release across teams |

A `business-case` or `narrative` finishes with a `## For requirements` id list so Sofia can build an initiative or program ticket from it without a separate PRD. See [Write a PRD](../plan/write-a-prd.md).

### Sally (UX and Brand)

| Template | Category | Fits |
| --- | --- | --- |
| `trigger-map` | Strategy | User-psychology trigger map: goals, target groups, desires, and fears (shared with Mary) |
| `brand-identity` | Strategy | Reusable corporate brand kit: logos, `DESIGN.md` tokens, `BRAND.md`, and Brand Book (`view: always`) |
| `design-direction` | Strategy | Visual dissection, taste dials, themes, or Figma/Stitch/Claude Design handoffs |
| `ux-system` | Product UX | Initiative `DESIGN.md` tokens and shared `EXPERIENCE.md` information architecture and accessibility |
| `ux-epic` | Product UX | Epic `EXPERIENCE.md` flows, states, microcopy, and key-screen mockups |
| `ux-quick` | Product UX | Lightweight single-flow `EXPERIENCE.md` and wireframe (`mode: fast`) |
| `website-design` | Websites | Marketing site, landing page, docs, or portfolio narrative and conversion design |
| `ux-audit` | Audits | Six-dimension usability, visual craft, states, and accessibility scorecard (`order: fixed`, `view: always`) |

### Winston (Architecture and Technical Operations)

| Template | Fits |
| --- | --- |
| `arch-enterprise` | Enterprise system architecture across coupled initiatives |
| `arch-spine` | Initiative system architecture: stack, seams, `AD-n` invariants, AI/cost bounds, and Contract Index |
| `arch-epic` | Epic technical design against live code: story contracts, schemas, migrations, and `contract.yaml` |
| `solution-design` | Human-facing technical RFC and proposal for review board, partner, or client sign-off |
| `api-design` | Public API, webhook, or partner integration contract with versioning and error rules |
| `tech-evaluation` | Weighted build-vs-buy, vendor, or stack bake-off with total cost of ownership (`order: fixed`) |
| `migration-plan` | Data, platform, or API migration plan with parity proof and rollback gates |
| `agent-readiness` | Codebase audit for AI-assisted delivery friction, doc noise, and pattern drift (`view: always`) |
| `production-readiness` | Pre-launch production readiness review: SLOs, capacity, recovery, and go/no-go verdict |
| `decision-record` | Recording a technical choice, rejected alternatives, and tradeoffs (`mode: fast`) |
| `postmortem` | Blameless incident timeline, contributing factors, actions, and customer notice (`order: fixed`) |
| `security-review` | Reviewing a system against OWASP Top 10, STRIDE, or a custom threat catalog |

## Founder and Creative Templates

All 17 Founder templates (coached by Nadia) and all 8 Creative templates (coached by Clio) set `view: always` so their self-contained HTML artifact is built automatically at close:

| Template | Module | Use it for |
| --- | --- | --- |
| `startup-diagnostic` | [Founder](../founder/founder.md) | Hard questions on whether an idea has real demand, ending in one dated assignment (`order: fixed`) |
| `customer-interview-script` | Founder | Customer interview guide grounded in past behavior |
| `ideal-customer` | Founder | First narrow customer segment to win and how to reach them |
| `validation-experiment` | Founder | Testing whether people will pay or act, with the pass mark set first (`order: fixed`) |
| `lean-canvas` | Founder | Whole business model on one page with its riskiest assumption |
| `positioning` | Founder | Product positioning and one-liner (`order: fixed`) |
| `pricing` | Founder | Pricing structure and how to test willingness to pay |
| `fundraising-plan` | Founder | Planning a raise: amount, milestones, instrument, investors, and stop date |
| `proposal` | Founder | Asking for budget, time, or stakeholder approval |
| `accelerator-application` | Founder | Accelerator application structured around the program's questions |
| `pitch-deck` | Founder | Investor or stakeholder talk rendered as interactive HTML slides |
| `cofounder-agreement` | Founder | Co-founder alignment on roles, decisions, equity, and departure before legal drafting (`order: fixed`) |
| `first-hire` | Founder | Deciding whether to hire now, with scorecard, cost, and work-sample test (`order: fixed`) |
| `ninety-day-plan` | Founder | Two or three ninety-day goals with metrics and owners |
| `launch-plan` | Founder | Go-to-market launch plan |
| `investor-update` | Founder | Monthly or quarterly update to investors and advisors |
| `board-pack` | Founder | Pre-read packet prepared before a board meeting |
| `story` | [Creative](../creative/creative.md) | Narrative, brand origin, documentary arc, case study, or transformation story |
| `character` | Creative | Fictional character for a story, game, or campaign with a one-page sheet |
| `world` | Creative | Setting, magic or tech ruleset, factions, tensions, and aesthetic canon |
| `talk-script` | Creative | Spoken keynote, conference talk, podcast, or video explainer calibrated to `measured_wpm` |
| `presentation` | Creative | Narrative and visual slide deck delivered by a speaker |
| `problem-solve` | Creative | Root-cause diagnosis and contradiction-breaking (TRIZ and systems thinking) |
| `design-thinking` | Creative | Non-software human-centered design for services, workshops, and physical products |
| `innovation-play` | Creative | Non-startup strategic exploration across Blue Ocean, Three Horizons, and S-Curve plays |

## What a Template Can Do

| Capability | Example template | How it works |
| --- | --- | --- |
| Push back on thin answers | `postmortem` (Contributing factors) | The section comment specifies when to challenge and what to ask |
| Enforce a fixed choice list | `security-review` (Findings) | The section comment lists allowed status and severity values |
| Drive questions from a CSV catalog | Any custom template (`methods:`) | Frontmatter `methods:` points to a relative CSV (`category`, `name`, `key_questions`) |
| Enforce strict section order with changing voices | `prfaq` | `order: fixed` in frontmatter, with each section comment setting its own voice and stance |
| Customize how fast mode behaves | `security-review` (`stance`) | The `stance` comment explains how fast mode operates on that document |
| Share rules across a template family | Method or Founder templates | `guidance: guidance-method.md` or `guidance: guidance-planning.md` loads beside the template |
| Review against a custom rubric | `proposal` (`rubric-proposal.md`) | Frontmatter `rubric:` points to a relative file or bare `rubric-general` |
| Set discussion order separately from document order | Any shipped template | `facilitation_order` lists section ids; section comments mark required vs. optional |
| Include conditional sections | `proposal` (Alternatives) | Section comment begins with `include when:` |
| Request a diagram | `postmortem` (Timeline) | Section comment includes `diagram:` with a Mermaid kind or sketch instruction |
| Auto-generate a table of contents | `proposal` | Bare `## Table of Contents` heading directly after the title |
| Always build a self-contained HTML artifact | `brief`, `pitch`, `prfaq`, `ux-audit`, `brand-identity`, `agent-readiness`, and all Founder and Creative templates | `view: always` in frontmatter |
| Apply project brand and design systems | `modules.core-tools.design_system` (via `bmad setup`) plus template `layout` / `style` | Project design system sets default visual tokens, while template `layout` comments or `style` references guide domain-specific composition without mechanical field injection |
| Propose options instead of only asking | `character` (`stance`) | The comment invites concrete proposals the user can accept or reshape |
| Track companion files | `ux-system`, `ux-epic`, `arch-epic`, `postmortem` | Frontmatter `companions: [...]` tracks sibling files across progress checks, review, and finalize |
| Prevent cross-altitude id leaks | Multi-altitude templates | `forbid_id_prefixes: [...]` flags disallowed id prefixes during Finalize |
| Run a custom Finalize lint script | Any domain template | Frontmatter `lint:` names a relative script or command executed in Finalize step 1 |

No shipped template extends another shipped template. To add team rules on top of any shipped template, see [Extend a Template](../customize/write-a-document-template.md#extend-a-template).
