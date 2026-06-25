---
title: "Forge an Idea"
description: Pressure-test an idea through persona-driven interrogation until it hardens, proves out, or dies cheaply
sidebar:
  order: 13
---

Take a half-formed idea and pressure-test it now, in conversation, while changing your mind is still free.

## What is Forge Idea?

Run `bmad-forge-idea` and an exacting interrogator goes to work on your idea, one question at a time, until what survives is something you can act on with earned conviction. The skill is domain-agnostic. It runs on a software feature, a business model, a research hypothesis, or a life decision you keep circling.

What you walk away with is sharper thinking. A distilled `forged-idea.md` is only ever one possible exit, and the session never herds you toward "shall we build it?"

## Why Pressure-Test Early

The enemy is the hole you can't see in your own idea. An unexamined assumption or an unresolved branch is a crack, and a crack you miss now resurfaces later — in the build, or the launch, when it costs far more to fix.

A conversation is the cheapest place to catch it, because changing your mind here costs nothing. The forge spends that cheapness on purpose, going after the weak points while fixing them is still free.

## How a Session Runs

The interrogator works one question at a time, in dependency order, and puts its own recommended answer on the table each time. A position you can push against gets further than an open prompt. It finds discoverable answers itself instead of sending you to fetch them.

When your idea lands inside an existing project, that project's material becomes the ground truth. The interrogator checks your claims against what already exists and names the contradictions. Your vocabulary gets the same treatment. When a term is fuzzy or carries two meanings, it forces a precise choice before the branch can resolve, because a branch built on an overloaded word resolves falsely.

## The Room

The forge is voiced. Once the topic is set, every branch arrives with two characters instead of one faceless assistant. One comes from your installed roster — an agent or persona you'll recognize, drawn from the same cast behind [Party Mode](./party-mode.md) and [named agents](./named-agents.md). The other is conjured on the fly by the topic itself: a hostile competitor, a skeptical CFO, a domain specialist who has watched this exact plan fail before.

You steer the room whenever you want. Name a specific person, call a saved party, or invoke the **adversarial on this** gear to attack a claim to destruction with you defending it.

## Never Default-Agree

Reflexive agreement is the failure this skill exists to refuse. Acknowledging your idea isn't the same as endorsing it, and the forge won't praise anything before it has survived something. It attacks the weak point or builds on the strong one, and it credits only what genuinely earns the credit.

This is the deliberate inverse of [Adversarial Review](./adversarial-review.md). There, the reviewer is told to find problems and you filter out the false positives. Here, the interrogator is told never to grant agreement for free, so the pressure stays high and you think harder under it. It optimizes for the best idea over a comfortable session.

## How a Session Ends

The session ends however the thinking lands, and every landing is a real outcome. The forge writes a self-contained report you can keep, stamped to match the result.

| Outcome | What it means |
| --- | --- |
| **Hardened** | The idea survived. It distills into `forged-idea.md` (the locked decisions, plus what was killed and why), ready to feed `bmad-spec`, `bmad-prd`, or `bmad-prfaq` for a product concept. |
| **Killed** | The idea didn't survive, and the report records the cause of death. Finding that out cheaply is a win. |
| **Clearer** | You just think straighter now. No artifact needed, and the session stands on its own. |

## When to Use It

Reach for the forge when you already hold an idea and want it hardened or killed before you invest in it. Skip it when you're still generating options or when you need a group decision from your agents.

| Skill | Use it when | Voice |
| --- | --- | --- |
| `bmad-forge-idea` | You have an idea and want it stress-tested or killed | An interrogator plus a two-person room |
| `bmad-prfaq` | You've committed to a product and want it proven customer-first | A Working Backwards coach |
| `bmad-brainstorming` | You have no idea yet and need to generate options | A facilitation coach |
| `bmad-party-mode` | You want your agents to discuss or decide together | Your whole roster in one conversation |
| `bmad-review-adversarial-general` | You have an artifact and need its flaws found | A reviewer who must find issues |

## Example

:::note[Example]
**You:** "I want AI-generated weekly summaries in the app. Users get a digest email every Monday."

**Forge:** "Before the feature, who asked for this? My recommended answer is nobody did, and you're reasoning from 'AI summaries sound valuable.' Push back if there's a real signal."

**Skeptical CFO (conjured):** "And a Monday digest is a recurring inference cost across your whole active base, forever. What revenue line pays for it?"

**You:** "Retention, I guess. People forget to come back."

**Forge:** "Then the load-bearing claim is 'a Monday email brings lapsing users back,' not 'AI summaries are valuable.' Those are different ideas. Which one are we forging?"
:::

The first idea was a feature. Two questions in, the real idea is a retention bet you could test with a plain email and no model at all.
