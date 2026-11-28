---
title: 'Founder'
description: 'Use Nadia, the Founder Advisor (bmad-founder-agent-advisor), to test an idea, compute runway and dilution by script, run fundraising, and keep one business record.'
sidebar:
  order: 1
---

Founder is a BMad module for the business side of starting and running a venture, from testing an unbuilt idea to raising outside investment, managing a board, or running a bootstrapped company. Everything runs through **Nadia, the Founder Advisor** (`bmad-founder-agent-advisor`).

You do not need a software repository to use Founder. Non-technical founders can install it in any dedicated business or notes folder (such as an Obsidian vault or a planning directory) and talk to Nadia in plain English, or ask `"Nadia, what can you help me with?"` anytime.

## Install Founder

You need Node.js, [uv](https://docs.astral.sh/uv/), and an AI coding tool that supports skills (see [How to Install BMad](../start/install-bmad.md) for prerequisites). From your business folder, install BMad core tools and the Founder module:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/founder --skill '*'
```

Open your AI tool in that folder and ask the `bmad` skill to run `bmad setup`. Setup installs the shared runtime and asks where to store your business record (defaulting to `company/` inside that folder).

## One Shared Business Record

Nadia keeps your real company facts in one organized `company/` folder so every pitch deck, investor update, proposal, and financial model quotes the exact same numbers. Whenever a metric, runway estimate, or investor status changes in conversation, she updates the file before moving on:

| Files | What they hold |
| --- | --- |
| `company.md` and `founder.md` | Your company profile, current stage, dated metrics, runway, active asks, and your personal goals, strengths, and constraints as a founder |
| `people/` | One file per investor, customer, partner, or advisor tracking who they are, where the relationship stands, and the next step |
| `insights.md` and `objections.md` | Evidence pulled from real customer interviews alongside the toughest questions investors and buyers keep asking, paired with your strongest answers |
| `numbers/` | Your live equity table (`cap-table.json`) and dated monthly operating models (`YYYY-MM-DD-model.csv`) |
| `decisions/`, `data-room.md`, `check-ins/`, and `raw/` | Dated strategic calls with reversal criteria, a diligence checklist, weekly assignments, and untouched raw source files |

Because the business record holds fundraising details and personal information, decide deliberately whether to commit that folder to version control.

## What Nadia Helps You Do

### Test whether an idea has real demand

Before spending months building, Nadia pushes you with direct office-hours questions in a startup diagnostic to test whether people will actually pay or commit. She writes customer interview scripts grounded in past behavior rather than polite compliments, defines your ideal customer profile, turns raw interview notes into counted evidence, sharpens your positioning and one-liner, and sets up a lean canvas or validation experiment with a clear pass mark agreed up front.

### Get your pricing and numbers right

Nadia helps structure pricing packages and value metrics, and calculates every financial figure using a bundled script rather than estimating in prose so your numbers never silently drift.

### Raise money and win funding

For a seed round (an early outside investment round), SAFEs (Simple Agreements for Future Equity, a common early investment contract that converts into shares later), grants, or accelerators, Nadia helps write your fundraising plan, pitch deck, proposals, and grant or accelerator applications while keeping your investor pipeline, cold outreach, and diligence checklist in one place.

### Run and grow the company

Nadia helps with the human and operational side of building a business: drafting a co-founder agreement on roles, decisions, and equity before paying lawyers, deciding when to make a first hire (with a scorecard and cost check), setting focused 90-day plans, mapping out launch plans, and writing honest investor updates and board packs. See [Document Templates](../reference/document-templates.md) for the full list of Founder templates.

### Make hard calls and practice tough conversations

When you face a major fork (quitting your job, raising versus bootstrapping, pivoting, or letting someone go), Nadia helps write down the call with clear kill criteria and a review date, or roleplays the conversation with you beforehand.

:::note[Ways to start]
```text
/bmad-founder-agent-advisor I have an idea for clinic scheduling software and four customer interviews. Help me check if there is real demand.
```

```text
Hey Nadia, we have $180k in the bank and two SAFEs. Help me figure out our real runway and what a $1M seed round does to our ownership.
```
:::

See [Money, Fundraising, and Pitch Room](numbers-and-pitch-room.md) for Nadia's financial modeling, fundraising workflows, and live investor pitch room. Software product planning and coding belong in [BMad Method](../start/how-bmad-works.md) (starting with [Mary](../agents/mary-analyst.md) for product discovery and market research inside a codebase), while talks, storytelling, and creative writing belong in [Creative](../creative/creative.md).

## Tailoring Nadia

To add standing company constraints, adjust how hard Nadia pushes, or include your own document layouts, invoke `bmad-customize` and describe what you want changed.
