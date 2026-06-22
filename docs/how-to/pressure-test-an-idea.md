---
title: "Pressure-Test an Idea"
description: Use the bmad-forge-idea skill to harden, prove, or kill an idea before you invest in it
sidebar:
  order: 12
---

Use the `bmad-forge-idea` skill to put a half-formed idea under adversarial questioning. It either survives with earned conviction or dies cheaply.

## When to Use This

- You hold an idea and want it stress-tested before you commit time or money
- You want an honest read on whether to kill it, not encouragement
- You're choosing between branches of a decision and need each one resolved
- Your idea lives inside an existing project and needs to be checked against what's already there

## When to Skip This

- You have no idea yet and need to generate options — use `bmad-brainstorming`
- You've committed to a product and want it proven customer-first — use `bmad-prfaq`
- You want your agents to debate a decision together — use `bmad-party-mode`

:::note[Prerequisites]
None. The forge runs in plain conversation. Installed agents and a configured persona roster make the session richer, but it works without them.
:::

## Run a Session

### 1. Invoke the skill

Type `bmad-forge-idea` in your IDE, or say "forge an idea" or "pressure-test this." Name the idea in the same message or wait for the first question.

### 2. State your goal

Tell the forge what you want: harden the idea, prove or kill it, or just think it through. The goal steers the questioning. Proving goes after the load-bearing claim first, and hardening drives each branch to a resolved answer.

### 3. Defend your thinking, one branch at a time

The interrogator asks one question at a time and puts its own recommended answer on the table for you to push against. Answer honestly. When it challenges a fuzzy term or a claim that doesn't match your project, settle that before you move on.

### 4. Steer the room

Every branch arrives with two voices — one from your roster, one conjured by the topic. Call a specific persona by name, summon a saved party, or say "adversarial on this" to have a claim attacked while you defend it.

### 5. Land an exit

Drive each branch to a resolved answer until the idea is hardened, killed, or simply clearer. Say when you're done, or let the forge call it.

## What You Get

The forge writes a self-contained `forge-report.html` every run, stamped to match the outcome. A hardened idea also distills into `forged-idea.md`, which captures the locked decisions and what was killed and why. That file feeds `bmad-spec`, `bmad-prd`, or `bmad-prfaq` for a product concept. A killed or clarified session needs no artifact; the report stands on its own.

:::tip[Let it kill the idea]
Finding out cheaply that an idea doesn't hold is the win. Don't steer the session toward a yes.
:::
