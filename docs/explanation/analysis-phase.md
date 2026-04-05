---
title: "Analysis Phase: From Idea to Foundation"
description: What brainstorming, research, product briefs, and PRFAQs are — and when to use each
sidebar:
  order: 1
---

The Analysis phase (Phase 1) helps you think clearly about your product before committing to building it. Every tool in this phase is optional, but skipping analysis entirely means your PRD is built on assumptions instead of insight.

## Why Analysis Before Planning?

A PRD answers "what should we build and why?" If you feed it vague thinking, you get a vague PRD — and every downstream document inherits that vagueness. Architecture built on a weak PRD makes wrong technical bets. Stories derived from weak architecture miss edge cases. The cost compounds.

Analysis tools exist to make your PRD sharp. They attack the problem from different angles — creative exploration, market reality, customer clarity, feasibility — so that by the time you sit down with the PM agent, you know what you're building and for whom.

## The Tools

### Brainstorming

**What it is.** A facilitated creative session using proven ideation techniques. The AI acts as coach, pulling ideas out of you through structured exercises — not generating ideas for you.

**Why it's here.** Raw ideas need space to develop before they get locked into requirements. Brainstorming creates that space. It's especially valuable when you have a problem domain but no clear solution, or when you want to explore multiple directions before committing.

**When to use it.** You have a vague sense of what you want to build but haven't crystallized the concept. Or you have a concept but want to pressure-test it against alternatives.

See [Brainstorming](./brainstorming.md) for a deeper look at how sessions work.

### Research (Market, Domain, Technical)

**What it is.** Three focused research workflows that investigate different dimensions of your idea. Market research examines competitors, trends, and user sentiment. Domain research builds subject-matter expertise and terminology. Technical research evaluates feasibility, architecture options, and implementation approaches.

**Why it's here.** Building on assumptions is the fastest way to build something nobody needs. Research grounds your concept in reality — what competitors already exist, what users actually struggle with, what's technically feasible, and what industry-specific constraints you'll face.

**When to use it.** You're entering an unfamiliar domain, you suspect competitors exist but haven't mapped them, or your concept depends on technical capabilities you haven't validated. Run one, two, or all three — each stands alone.

### Product Brief

**What it is.** A guided discovery session that produces a 1-2 page executive summary of your product concept. The AI acts as a collaborative Business Analyst, helping you articulate the vision, target audience, value proposition, and scope.

**Why it's here.** The product brief is the gentler path into planning. It captures your strategic vision in a structured format that feeds directly into PRD creation. It works best when you already have conviction about your concept — you know the customer, the problem, and roughly what you want to build. The brief organizes and sharpens that thinking.

**When to use it.** Your concept is relatively clear and you want to document it efficiently before creating a PRD. You're confident in the direction and don't need your assumptions aggressively challenged.

### PRFAQ (Working Backwards)

**What it is.** Amazon's Working Backwards methodology adapted as an interactive challenge. You write the press release announcing your finished product before a single line of code exists, then answer the hardest questions customers and stakeholders would ask. The AI acts as a relentless but constructive product coach.

**Why it's here.** The PRFAQ is the rigorous path into planning. It forces customer-first clarity by making you defend every claim. If you can't write a compelling press release, the product isn't ready. If customer FAQ answers reveal gaps, those are gaps you'd discover much later — and more expensively — during implementation. The gauntlet surfaces weak thinking early, when it's cheapest to fix.

**When to use it.** You want your concept stress-tested before committing resources. You're unsure whether users will actually care. You want to validate that you can articulate a clear, defensible value proposition. Or you simply want the discipline of Working Backwards to sharpen your thinking.

## Which Should I Use?

| Situation | Recommended tool |
| --------- | ---------------- |
| "I have a vague idea, not sure where to start" | Brainstorming |
| "I need to understand the market before deciding" | Research |
| "I know what I want to build, just need to document it" | Product Brief |
| "I want to make sure this idea is actually worth building" | PRFAQ |
| "I want to explore, then validate, then document" | Brainstorming → Research → PRFAQ or Brief |

Product Brief and PRFAQ both produce input for the PRD — choose one based on how much challenge you want. The brief is collaborative discovery. The PRFAQ is a gauntlet. Both get you to the same destination; the PRFAQ tests whether your concept deserves to get there.

:::tip[Not Sure?]
Run `bmad-help` and describe your situation. It will recommend the right starting point based on what you've already done and what you're trying to accomplish.
:::

## What Happens After Analysis?

Analysis outputs feed directly into Phase 2 (Planning). The PRD workflow accepts product briefs, PRFAQ documents, research findings, and brainstorming reports as input — it synthesizes whatever you've produced into structured requirements. The more analysis you do, the sharper your PRD.
