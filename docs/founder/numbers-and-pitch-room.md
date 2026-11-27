---
title: 'Money, Fundraising, and Pitch Room'
description: 'Use Nadia to compute deterministic runway, unit economics, and cap tables, manage fundraising and customer evidence, and practice pitches in front of investor personas.'
sidebar:
  order: 2
---

Beyond writing business plans and updates, Nadia (`bmad-founder-agent-advisor`) runs exact financial math by script, turns messy notes into investor-ready evidence, and lets you rehearse tough conversations before they count. You do not need a finance background to run any of these tools; Nadia explains every term and assumption in plain English as you work through the numbers together.

## Exact Financial Math

Estimating runway, dilution, or unit economics in prose leads to quiet math mistakes that hurt credibility. Nadia runs a bundled calculation script for every financial figure and saves the results cleanly into your business record:

| Calculation | What it models and where it saves |
| --- | --- |
| Company and personal runway | Calculates months of cash left, the zero-cash month, whether current growth reaches breakeven before cash runs out (called default-alive), and how long personal savings last if you leave a day job while keeping a safety buffer; settled runway figures write back to `company/company.md` |
| Unit economics and market size | Calculates unit economics (how much one customer earns over their lifetime compared to what it costs to acquire them, plus acquisition payback, the months needed to earn back that acquisition cost) and bottom-up market sizing from real account counts and annual prices; settled metrics record with today's date in `company/company.md` |
| SAFEs and priced rounds | Models ownership and dilution when post-money SAFEs (early investment agreements that lock in the investor's ownership slice after the SAFE money enters) convert, or when a priced round (an investment round that sets an explicit share price and valuation) closes; cap table state lives in `company/numbers/cap-table.json` |
| Monthly operating models | Projects month-by-month cash flow with dated hires, recurring costs, and one-off expenses, exporting a dated CSV spreadsheet (`company/numbers/YYYY-MM-DD-model.csv`) alongside the stated assumptions |

## Customer Evidence and Strategic Calls

- Drop raw interview transcripts or notes in for customer synthesis, and Nadia extracts what people already pay for today, recurring patterns counted across interviews, and whether the evidence supports or weakens your riskiest assumption.
- Write down big decisions like quitting a job, pivoting, or hiring with explicit kill criteria, evidence targets, and a future check-in date so you revisit them objectively later.
- Run weekly or milestone check-ins to review what moved, what stalled, and any open commitments due for follow-up.

## Fundraising Pipeline, Terms, and Diligence

- Build and rank a list of investor targets or early customers, prep before calls, debrief after, draft cold emails or forwardable warm-intro blurbs, and file raw emails or metrics exports cleanly.
- Read a SAFE or term sheet in plain English with Nadia to spot what is standard, what is unusual, how it changes your ownership, and which questions to bring to your lawyer.
- Audit your data room (the shared folder of financials, legal documents, metrics, and customer proof that investors inspect before wiring money) to spot missing or out-of-date items before diligence starts.

## Live Rehearsal and Pitch Room

For one-on-one rehearsal, ask Nadia to play the other person across the table (an investor partner, a customer negotiating price, or a co-founder in a hard conversation) and debrief what landed afterward.

When you want higher pressure, open The Pitch Room: walk in, state your ask (how much money you want for what percentage of the company), and deliver a two-minute pitch to five distinct investor personas grounded in your real company record:

| Investor | What they press on |
| --- | --- |
| Dana Okafor | Numbers-first investor who checks sales, margins, acquisition cost, and valuation in the first minute |
| Rafael Quint | Former operator who built and sold a nine-figure product company and presses on execution, sales, and scaling bottlenecks |
| Lena Voss | Venture investor looking for billion-dollar market size, timing, and defensibility |
| Grace Whitfield | Founder-focused investor who digs into your resilience, conviction, and long-term commitment |
| Theo Marsh | Quiet skeptic who hunts the one unchecked number, hidden churn, or revenue concentration risk |

The five investors grill your numbers, interrupt and debate each other, and each finishes with either a specific offer (amount, equity, and conditions, with room to compete or team up) or a one-sentence pass. You can counter an offer or walk away. Nadia hosts without bidding, debriefs what landed and what broke once the session ends, and saves the hardest questions to `company/objections.md` so your next pitch is sharper.

:::note[Pitch Room prerequisite]
The Pitch Room uses `bmad-party-mode`, which is included when you install BMad core tools with `--skill '*'`. If you ran a minimal install without `bmad-party-mode`, add it first (`npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill bmad-party-mode`) before opening the room.
:::

:::note[Ways to start]
```text
/bmad-founder-agent-advisor Model our monthly cash flow through next year if we hire one engineer in March and spend $8k on a trade show in May.
```

```text
Hey Nadia, open The Pitch Room. I want to practice pitching a $500k raise for 10% equity before my angel meetings next week.
```
:::

:::caution[Boundaries]
Nadia is not a lawyer, accountant, licensed financial adviser, or therapist. On incorporation, contracts, tax, securities, or term sheets she gives you the exact questions to take to qualified counsel; when founder exhaustion or co-founder conflict goes beyond business advice, she names it plainly and points you to qualified support.
:::
