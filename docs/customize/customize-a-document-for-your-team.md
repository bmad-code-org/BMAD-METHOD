---
title: 'Customize a Document for Your Team'
description: Make every PRD ask the questions your company cares about, then give one department a PRD of its own.
sidebar:
  order: 6
---

In this hands-on walkthrough, you customize John's PRD so every PRD your team writes enforces your company's questions and metrics catalog without editing BMad's installed files, and then create a separate PRD template for one department whose needs outgrow the shared format. For background on how templates merge, see [How Document Templates Work](./how-document-templates-work.md); for the complete template file syntax, see [Write a Document Template](./write-a-document-template.md).

## What You'll Learn

- Add a required section with its own coaching rules
- Modify how the coach handles an existing section
- Inspect the exact merged template the coach reads
- Decide between extending a template, replacing it, and creating a new one

:::note[Prerequisites]
BMad installed with the BMad Method module, `bmad setup` run, and your AI coding tool open in your project. See [Install BMad](../start/install-bmad.md).
:::

:::tip[Quick Path]
Tell `bmad-customize` what every PRD needs. It writes a small extension in `_bmad/custom/facilitate-templates/` and shows you the merged result.
:::

## The Example

Larkspur, a fictional clinic scheduling software company, hit two problems last quarter. A reminders feature launched before Support had answers ready, causing support tickets to triple in week one, and several PRDs promised metrics nobody actually tracks.

Larkspur's product lead wants two rules on every PRD:

| Change | Kind | What the coach does |
| --- | --- | --- |
| A **Support readiness** section | New section | Asks who leads Support for the launch and which three questions customers will ask first, refusing "Support will figure it out" |
| **OKRs** grounded in the company metrics catalog | Change to an existing section | Reads the catalog before asking, and logs an open question instead of inventing an untracked metric |

## Step 1: Give the Coach a Catalog to Read

Create `docs/metrics-catalog.md` in your project with a few rows:

```markdown
# Metrics catalog

| Metric | Definition | Owner |
| --- | --- | --- |
| No-show rate | Booked appointments with no check-in, per week | Clinic Analytics |
| Reminder delivery rate | Reminders delivered over reminders sent | Messaging |
| Tickets per 100 clinics | Support tickets opened per 100 active clinics, per week | Support Ops |
```

## Step 2: Ask `bmad-customize` for the Change

Open chat, invoke `bmad-customize`, and describe the rules in plain language:

```text
Every PRD at Larkspur needs a Support readiness section after Scope and non-goals: who leads
Support for the launch, the first three questions customers will ask with their
answers, known issues, and where tickets escalate. Don't accept "Support will
figure it out". Also, every key result in the OKRs must use a metric from
docs/metrics-catalog.md with the owner it names, and a metric that isn't there
becomes an open question.
```

You do not need to know which underlying skill writes PRDs. `bmad-customize` locates the `prd` template, chooses an extension because you are adding rules rather than rebuilding the whole document, and previews a file like this before saving:

```markdown
---
extends: prd
---

## Support readiness
<!-- After Scope and non-goals. What Support needs on launch day. Ask who leads Support for this launch, then ask the user to picture the first week of tickets: the three questions customers will ask first, and the answer to each. Add known issues and where a ticket escalates. Push back on "Support will figure it out": a launch with no answers ready is not ready. -->

## OKRs
<!-- Adds to the template's OKRs. Every key result's metric comes from `docs/metrics-catalog.md` and names the owner it lists; read the catalog before asking. When the user proposes a metric the catalog lacks, say so and log an open question for its owner instead of inventing a definition. -->
```

Each comment guides the coach:

- The `Support readiness` comment introduces a new heading, places it after Scope and non-goals, specifies what to ask and when to push back, and marks it required by omitting `optional` or `include when`.
- The `OKRs` comment matches an existing heading in John's PRD and begins with "Adds to", preserving John's base coaching while adding Larkspur's catalog rule (writing "Replaces the template's OKRs" instead would use Larkspur's rule alone).

Approve the preview, and `bmad-customize` saves it under `_bmad/custom/facilitate-templates/` (for example, `prd-larkspur.md`) and displays the merged PRD template. Commit the file so everyone on your team inherits it.

## Step 3: Write a PRD with John

Start a session with John (`bmad-agent-pm`):

```text
John, let's create a PRD for text message appointment reminders.
```

John coaches the PRD as usual, incorporating both company rules. When the conversation reaches OKRs, he suggests metrics from your catalog such as no-show rate; if you propose an untracked metric like "patient happiness", he flags that it is absent from the catalog and logs an open question for its owner. After Scope and non-goals, he asks who leads Support and presses for concrete launch-week answers if you try to defer them.

## Step 4: Inspect What the Coach Reads

Ask `bmad-customize` to show the merged PRD template. It prints John's PRD combined with every matching extension (extensions first) exactly as the next run will read it. Whenever a custom rule seems ignored, check the merged template first, because anything absent from the merged template and its referenced guidance files never reaches the coach.

## Step 5: When Changes Outgrow an Extension

Suppose Larkspur's billing team writes PRDs for pricing, invoices, and payment changes. Their documents require proration, tax, and Finance sign-off sections while dropping sections ordinary product PRDs use. Adding billing-only sections to the shared `prd` extension would clutter every other team's PRDs.

| Scope of changes | Approach | Frontmatter id |
| --- | --- | --- |
| A few sections and rules for everyone | Extension | `extends: prd` |
| A rebuilt shape for everyone in the project | Replacement copy | `template: prd` |
| A separate document for one team or domain | New template | `template: prd-billing` |

Ask `bmad-customize` to create a dedicated billing template:

```text
The billing team needs its own PRD for changes to pricing, invoices and payments.
Start from John's PRD. Add a section that walks through what each customer pays
the day the change lands, with a worked example, and a Finance sign-off section.
Drop Users and journeys.
```

`bmad-customize` copies John's PRD to `_bmad/custom/facilitate-templates/prd-billing.md`, assigns a new `template` id, and adds the billing sections:

```markdown
---
template: prd-billing
description: "Requirements for a change to pricing, invoices or payments."
not_for: "Product work that does not change what customers pay or how they are billed (`prd`)."
agents: [bmad-agent-pm]
---

## What each customer pays
<!-- After Features and requirements. Walk the user through the day the change lands: mid-cycle upgrades, downgrades, refunds and annual plans. Ask for one worked example with real numbers, and push until every case names who absorbs the difference. -->
```

Three frontmatter fields control how John routes to it:

- `template: prd-billing` registers it as a distinct document while leaving `prd` intact for other teams.
- `description` and `not_for` tell John when to pick `prd-billing` versus `prd`.
- `agents: [bmad-agent-pm]` puts it in John's document catalog.

Note two tradeoffs when creating a separate copy: your `prd-larkspur.md` extension targets `prd` rather than `prd-billing` (so add Support readiness to `prd-billing.md` or create a second extension with `extends: prd-billing`), and a copied template does not automatically inherit updates made to John's shipped PRD.

## What You've Accomplished

```text
your-project/
├── docs/
│   └── metrics-catalog.md                  # read by the coach for every PRD
├── _bmad/custom/facilitate-templates/
│   ├── prd-larkspur.md                     # extension applied to every PRD
│   └── prd-billing.md                      # dedicated template for billing PRDs
└── _bmad-output/.../prd-text-reminders/
    └── prd-text-reminders.md               # the finished PRD
```

## Quick Reference

| Goal | How to do it |
| --- | --- |
| Add a section to every PRD | Add a new heading in an `extends: prd` file with a comment placing it and describing what to ask |
| Change coaching on an existing section | Reuse the heading in your extension with a comment that adds to or replaces the base rule |
| Remove a section | Specify `facilitation_order` in the extension and omit that section |
| Always generate HTML views for PRDs | Set `view: always` in the extension's frontmatter |
| Set a default mode for every document | Ask `bmad-customize` to set `mode` (`step-by-step`, `freeform`, or `fast`) on `bmad-facilitate` for your team or just for you |
| Override mode for one document | Set `mode: freeform` (or another mode) in the extension's frontmatter |
| Enforce strict section order on one document | Set `order: fixed` in the extension's frontmatter (or `order: ""` to clear it) |
| Give one team its own document | Create a new template with its own `template` id, `description`, `not_for`, and `agents` |
| Verify what a run reads | Ask `bmad-customize` to show the merged template |

## Common Questions

### Will updating BMad overwrite my changes?

No. Updates never touch `_bmad/custom/`. Your extensions continue applying, and improvements to John's shipped PRD still flow through automatically.

### Can I write template files by hand?

Yes. [Write a Document Template](./write-a-document-template.md) documents the complete format, and `bmad-customize` can validate any file you edit by hand.

### Who gets the change?

Everyone who pulls the repository gets files committed in `_bmad/custom/facilitate-templates/`. For personal changes that follow you across projects, place them in `~/.bmad/facilitate-templates/`.

### Does this work for other agents' documents too?

Yes. The same extension and template workflow works for every structured document written by Mary (`bmad-agent-analyst`), John (`bmad-agent-pm`), Sally (`bmad-agent-ux-designer`), and Winston (`bmad-agent-architect`), as well as Nadia (`bmad-founder-agent-advisor`) in Founder and Clio (`bmad-creative-agent-director`) in Creative. See [Document Templates](../reference/document-templates.md) for the full list of template ids.

## Getting Help

Ask the `bmad` skill in chat, or bring questions to the [BMad Discord](https://discord.gg/gk8jAdXWmj).

:::tip[Key Takeaways]
Templates act as facilitation instructions: section comments specify placement, questions, and pushback rules. Extend shipped templates by default so upstream improvements keep arriving, and copy a template only when you need a separate document type or full redesign. Check the merged template whenever you want to verify what the coach reads.
:::
