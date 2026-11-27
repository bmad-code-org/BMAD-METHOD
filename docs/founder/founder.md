---
title: 'Founder'
description: 'Use Nadia, the Founder Advisor (bmad-founder-agent-advisor), to test an idea, compute runway and dilution by script, run fundraising, and keep one business record.'
sidebar:
  order: 1
---

Founder is a BMad module for the business side of starting and running a venture, from testing an unbuilt idea to raising a round, managing a board, or running a bootstrapped company. Everything runs through **Nadia, the Founder Advisor** (`bmad-founder-agent-advisor`).

Install Founder in the folder where you plan the business (such as a notes vault), rather than inside a software repository. Tell Nadia what you are dealing with in plain English, or ask "Nadia, what can you help me with?" anytime.

## Install Founder

With [BMad core tools](../start/install-bmad.md) installed in your business folder, add Founder and run setup:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/founder
```

Then ask the `bmad` skill to run `bmad setup founder`. Setup asks where to store your business record (defaulting to `company/` in that folder).

## One Shared Business Record

Nadia keeps your real company numbers, customer insights, investor contacts, objections, and decisions in one organized business record folder so every pitch, update, and financial model quotes the exact same facts. Whenever a figure, runway estimate, or investor status changes in conversation, she updates the record before moving on.

Because the business record holds fundraising and personal details, decide deliberately whether to commit that folder to version control.

## What Nadia Helps You Do

### Test whether an idea has real demand

Before spending months building, Nadia pushes you with direct office-hours questions to test whether people will actually pay or commit. She helps prepare customer interview guides focused on past behavior rather than polite compliments, turns raw interview notes into real evidence, sharpens your positioning and one-liner, and designs clear validation experiments with a pass mark set up front.

### Get your pricing and numbers right

Nadia helps structure pricing packages and value metrics, and calculates every financial figure using a bundled script rather than guessing in prose so your numbers never silently drift.

### Raise money with clarity

Whether you are planning a priced round, writing a grant or accelerator application, drafting a slide deck, or reaching out to angel investors, Nadia keeps your fundraising plan, investor pipeline, cold outreach, and diligence checklist in one place.

### Run the company day to day

Nadia helps with the human and operational side of running a company: aligning co-founders early on roles, decisions, and equity, deciding when to make a first hire (with a scorecard and cost check), setting focused 90-day plans, planning launches, and writing honest investor updates or board packs.

### Make hard calls and practice tough conversations

When you face a major fork (quitting your job, raising vs. bootstrapping, pivoting, or letting someone go), Nadia helps structure the call with clear kill criteria and a review date, or roleplays the conversation with you beforehand.

:::note[Ways to start]
```text
/bmad-founder-agent-advisor I have an idea for clinic scheduling software and four customer interviews. Help me check if there is real demand.
```

```text
/bmad-founder-agent-advisor We have $180k in the bank and two SAFEs. Help me figure out our real runway and what a $1M seed round does to our ownership.
```
:::

See [Money, Fundraising, and Pitching](numbers-and-pitch-room.md) for Nadia's financial modeling, fundraising workflows, and live investor pitch room. Software product planning and coding belong in BMad Method, while talks, storytelling, and creative writing belong in [Creative](../creative/creative.md).

## Tailoring Nadia

To add standing company constraints, adjust how Nadia pushes, or include your own document layouts, invoke `bmad-customize` and describe what you want changed.
