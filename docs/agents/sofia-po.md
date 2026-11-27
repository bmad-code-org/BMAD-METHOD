---
title: 'Sofia, Product Owner'
description: 'Use Sofia (bmad-agent-po) to turn notes or plans into organized build steps, track what is ready next, handle mid-project changes, and sync with issue trackers.'
sidebar:
  order: 3
---

Sofia (`bmad-agent-po`) is your organizer once you have an idea, notes, designs, or a plan from [John](john-pm.md) and want to turn it into clear work that coding agents can build reliably step by step. You do not need to know any agile or software-process jargon to work with her: speak in plain English about what you are making, or ask "Sofia, what can you help me with?" at any time.

## Sofia or Straight to Building?

If you are unsure whether to start with Sofia or jump straight into coding with [Amelia](amelia-dev.md) (`bmad-build`), use this simple rule:

- **Go straight to building** when you want one small, clear change that a coding agent can finish and verify in one go (a bug fix, a new helper, a single self-contained feature).
- **Start with Sofia** when the work has multiple parts that depend on each other, spans several sessions, needs designs or technical decisions attached so builds stay consistent, or involves a team tracking progress on a board.

If you are still not sure, ask `bmad` or describe your goal to Sofia and she will tell you whether you even need a plan or can build right away.

## What Sofia Helps You Do

### Turn messy inputs into one clear plan

Give Sofia rough notes, meeting takeaways, a product brief, a PRD, or designs. She pulls out what needs to be built, what rules it must obey, what is still unknown, and any places where two source files disagree, bringing those questions to you instead of guessing product answers herself.

### Break big goals into buildable steps

Sofia slices larger goals into ordered pieces small enough for one coding session each, where every piece delivers something real you can see and test when it finishes. She checks that nothing is missing, circular, or out of order before you approve.

### Prepare clear instructions and attach designs

For each build step, Sofia writes clear acceptance criteria in plain language (including how you will measure whether it worked) and links any finished UX designs or architecture notes so coding agents read the right context automatically.

### Track progress and tell you what is next

Ask Sofia "what's next?" or "status" anytime. She reads your project folder and tells you what is waiting on a decision, what is ready to build next, what is currently in progress, and what is blocked.

### Handle changes mid-project

Real projects change while you build them. When a requirement shifts, a new constraint appears, or an assumption turns out wrong, bring the change to Sofia. She updates the plan, flags which upcoming steps changed, and cleans up stale work without losing track of earlier decisions.

### Connect to your team's issue tracker

By default, Sofia stores everything in simple files right inside your repository so you need zero external setup. When your team uses Jira, Linear, GitHub Issues, GitLab, or Shortcut, she walks you through connecting that tracker and keeps it in sync.

:::note[Ways to start]
```text
/bmad-agent-po Here are my notes and John's product plan. Break this into clear steps we can build in order.
```

```text
Hey Sofia, what is ready to build next, and is anything waiting on my decision?
```

```text
/bmad-agent-po Users should be able to export CSV reports too. What in our current plan needs to change?
```
:::

See [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md), [Plan an Epic's Stories](../plan/plan-an-epics-stories.md), and [Set Up the Ticket Tree](../plan/set-up-the-ticket-tree.md) for step-by-step guides.

## Tailoring Sofia

To connect an external tracker, change when tickets publish to teammates, or adjust how Sofia organizes work, invoke `bmad-customize` (or ask Sofia to set up your store) and describe what you want.
