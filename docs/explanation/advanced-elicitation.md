---
title: "Advanced Elicitation"
description: Push the LLM to rethink its work using structured reasoning methods
sidebar:
  order: 6
---

Make the LLM reconsider what it just generated. You pick a reasoning method, it applies that method to its own output, you decide whether to keep the improvements.

## What is Advanced Elicitation?

A structured second pass. Instead of asking the AI to "try again" or "make it better," you select a specific reasoning method and the AI re-examines its own output through that lens.

The difference matters. Vague requests produce vague revisions. A named method forces a particular angle of attack, surfacing insights that a generic retry would miss.

## When to Use It

- After a workflow generates content and you want alternatives
- When output seems okay but you suspect there's more depth
- To stress-test assumptions or find weaknesses
- For high-stakes content where rethinking helps

Workflows offer advanced elicitation at decision points - after the LLM has generated something, you'll be asked if you want to run it.

## How It Works

1. LLM suggests 5 relevant methods for your content
2. You pick one (or reshuffle for different options)
3. Method is applied, improvements shown
4. Accept or discard, repeat or continue

## Built-in Methods

Dozens of reasoning methods are available. A few examples:

- **Pre-mortem Analysis** - Assume the project already failed, work backward to find why
- **First Principles Thinking** - Strip away assumptions, rebuild from ground truth
- **Inversion** - Ask how to guarantee failure, then avoid those things
- **Red Team vs Blue Team** - Attack your own work, then defend it
- **Socratic Questioning** - Challenge every claim with "why?" and "how do you know?"
- **Constraint Removal** - Drop all constraints, see what changes, add them back selectively
- **Stakeholder Mapping** - Re-evaluate from each stakeholder's perspective
- **Analogical Reasoning** - Find parallels in other domains and apply their lessons

And many more. The AI picks the most relevant options for your content - you choose which to run.

:::tip[Start Here]
Pre-mortem Analysis is a good first pick for any spec or plan. It consistently finds gaps that a standard review misses.
:::
