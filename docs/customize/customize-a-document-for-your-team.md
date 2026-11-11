---
title: 'Customize a Document for Your Team'
description: Make every PRD ask the questions your company cares about, then give one department a PRD of its own.
sidebar:
  order: 6
---

Make John's PRD ask the questions your company cares about, without touching BMad's own files, so every PRD your team writes covers them. Then give one department a PRD of its own when its needs outgrow the shared one.

## What You'll Learn

- Add a required section with its own coaching
- Change how the coach works an existing section
- See exactly what the coach read for a run
- Choose between extending a template, replacing it and making a new one

:::note[Prerequisites]
BMad installed with the BMad Method module, `bmad setup` run, and a coding tool open in your project. See [Install BMad](../start/install-bmad.md).
:::

:::tip[Quick Path]
Tell `bmad-customize` what every PRD needs. It writes an extension in `_bmad/custom/facilitate-templates/` and shows you the result. Write a PRD with John and open `.template.md` in its folder to see your rules in what the coach read.
:::

## The Example

Larkspur, a fictional company, sells appointment scheduling software to clinics. Two things went wrong last quarter. A reminders feature launched while Support had no answers ready, and tickets tripled in the first week. And PRDs kept promising metrics nobody tracks, so no one could say whether a launch worked.

Larkspur's product lead wants two changes to every PRD:

| Change | Kind | What the coach does |
| --- | --- | --- |
| A **Support readiness** section | A new section | Asks who leads Support for the launch and which questions customers will ask first, and refuses "Support will figure it out" |
| **Success metrics** taken from the company's metrics catalog | A change to a section John's PRD already has | Reads the catalog before asking, and logs an open question instead of inventing a metric |

## Step 1: Give the Coach a Catalog to Read

The metrics rule points at a file your team keeps. For this tutorial, create `docs/metrics-catalog.md` with a few rows:

```markdown
# Metrics catalog

| Metric | Definition | Owner |
| --- | --- | --- |
| No-show rate | Booked appointments with no check-in, per week | Clinic Analytics |
| Reminder delivery rate | Reminders delivered over reminders sent | Messaging |
| Tickets per 100 clinics | Support tickets opened per 100 active clinics, per week | Support Ops |
```

## Step 2: Ask bmad-customize for the Change

Run the `bmad-customize` skill and say what you want in plain words:

```text
Every PRD at Larkspur needs a Support readiness section after MVP scope: who leads
Support for the launch, the first three questions customers will ask with their
answers, known issues, and where tickets escalate. Don't accept "Support will
figure it out". Also, success metrics must come from docs/metrics-catalog.md with
the owner it names, and a metric that isn't there becomes an open question.
```

You do not need to know that John's PRD runs through `bmad-facilitate`. `bmad-customize` finds the `prd` template, decides this is an extension because you are adding to the PRD rather than rebuilding it, and shows you a file like this before writing it:

```markdown
---
extends: prd
---

## Support readiness
<!-- After MVP scope. What Support needs on launch day. Ask who leads Support for this launch, then ask the user to picture the first week of tickets: the three questions customers will ask first, and the answer to each. Add known issues and where a ticket escalates. Push back on "Support will figure it out": a launch with no answers ready is not ready. -->

## Success metrics
<!-- Adds to the template's Success metrics. Every metric comes from `docs/metrics-catalog.md` and names the owner it lists; read the catalog before asking. When the user proposes a metric the catalog lacks, say so and log an open question for its owner instead of inventing a definition. -->
```

Each comment is a facilitation instruction:

- **Support readiness** is a new heading, so it is added to every PRD. Its comment places it ("After MVP scope"), says what to ask and in what order, and says when to push back. It is required, because the comment does not start with `optional` or `include when`.
- **Success metrics** has the same heading as a section John's PRD already has, so it changes that section. "Adds to" keeps John's own instructions for the section and adds Larkspur's. A comment that said "Replaces the template's Success metrics" would use Larkspur's alone.

Say yes, and `bmad-customize` saves it in `_bmad/custom/facilitate-templates/`, under a name such as `prd-larkspur.md`, then shows the merged PRD: Support readiness is now in the facilitation order as a required section. Commit the file so your whole team gets it.

## Step 3: Write a PRD with John

Talk to John (`bmad-agent-pm`):

```text
John, let's create a PRD for text message appointment reminders.
```

John coaches the PRD as usual, and tells you up front that your project adds rules to it. On the fast path he raises both rules in his first batch of questions; when coaching, he raises each as the conversation reaches it. When the conversation reaches Success metrics, he offers metrics from your catalog, such as no-show rate. Propose one the catalog lacks, such as "patient happiness", and he says it is not in the catalog and logs an open question for its owner instead of defining it himself. After MVP scope he asks who leads Support for the launch, then walks you through the first week of tickets. Answer "Support will figure it out" and he presses for the answers.

## Step 4: See What the Coach Read

Open the PRD's folder. Beside the PRD and its `.memlog.md` is `.template.md`: John's PRD template merged with every extension of it, the extensions first. Your file's text sits at the top, under a line naming its path.

If a rule ever seems ignored, look here first. Text that is not in `.template.md` never reached the coach.

## Step 5: When Changes Outgrow an Extension

Larkspur's billing team writes PRDs for changes to pricing, invoices and payments. Their documents need sections an ordinary PRD does not have, such as proration, tax and Finance sign-off, and skip some it does have. Adding those to the `prd` extension would put billing sections in every team's PRD. The more you change, the more a separate document makes sense:

| Changes | Use | Template id |
| --- | --- | --- |
| A few sections and rules for everyone | An extension | `extends: prd` |
| A different shape for everyone in the project | A replacement copy | `template: prd` |
| A different document for one team or kind of work | A new template | `template: prd-billing` |

Billing needs the third. Ask `bmad-customize`:

```text
The billing team needs its own PRD for changes to pricing, invoices and payments.
Start from John's PRD. Add a section that walks through what each customer pays
the day the change lands, with a worked example, and a Finance sign-off section.
Drop Users and journeys.
```

It copies John's template to `_bmad/custom/facilitate-templates/prd-billing.md`, gives it a new id, and adds your sections, such as:

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

Three lines in its frontmatter matter:

- **`template: prd-billing`** makes it a new document. John's `prd` stays as it was for everyone else.
- **`description` and `not_for`** are what John reads to choose. Ask him for "a PRD for the new annual discount" and he picks `prd-billing`; ask for one about a calendar feature and he picks `prd`.
- **`agents: [bmad-agent-pm]`** has John offer it. Without it, the template is still usable but no agent lists it.

Two trade-offs come with a copy. Your `prd-larkspur.md` extension extends `prd`, not `prd-billing`, so add Support readiness to the copy too if billing launches need it, or write a second extension with `extends: prd-billing`. And a copy does not receive updates to John's template, so compare it when BMad's PRD changes.

## What You've Accomplished

```text
your-project/
├── docs/
│   └── metrics-catalog.md                  # read by the coach for every PRD
├── _bmad/custom/facilitate-templates/
│   ├── prd-larkspur.md                     # extension: every PRD
│   └── prd-billing.md                      # new template: billing PRDs
└── _bmad-output/.../prd-text-reminders/
    ├── prd-text-reminders.md               # the PRD
    ├── .memlog.md                          # its decision log
    └── .template.md                        # what the coach read
```

## Quick Reference

| To | Do |
| --- | --- |
| Add a section to every PRD | A new heading in an `extends: prd` file, with a comment that places it and says what to ask |
| Change how an existing section is coached | The same heading in the extension, with a comment that adds to or replaces the template's |
| Remove a section | List the order in the extension's `facilitation_order` and leave the section out |
| Make HTML views by default for PRDs | `html_view: always` in the extension's frontmatter |
| Give one team its own document | A copy with a new `template` id, `description`, `not_for` and `agents` |
| Check what a run used | Open `.template.md` in the run folder |

## Common Questions

**Will updating BMad overwrite my changes?** No. Updates never touch `_bmad/custom/`. Your extension keeps applying, and John's improvements to the PRD still reach you through it.

**Can I write these files by hand?** Yes. [Write a Document Template](./write-a-document-template.md) covers the format, and `bmad-customize` checks a file you wrote yourself.

**Who gets the change?** Everyone who pulls the project, since `_bmad/custom/` is committed. For a change only you want in every project, put the file in `~/.bmad/facilitate-templates/`.

**Does this work for Mary's documents too?** Yes. Extend `brief`, `prfaq` or `brd` the same way.

## Getting Help

Ask the `bmad` skill, or bring questions to the [BMad Discord](https://discord.gg/gk8jAdXWmj).

:::tip[Key Takeaways]
Templates are facilitation instructions: a section comment says where the section goes, what to ask and when to push. Extend a template by default so updates keep arriving, and copy it only to rebuild a document or to give one team a document of its own. `.template.md` shows exactly what the coach read.
:::
