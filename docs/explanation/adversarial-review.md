---
title: "Adversarial Review"
description: Forced-finding review that blocks lazy "looks good" rubber stamps
sidebar:
  order: 9
---

Force deeper analysis by requiring a real list of issues — not a cynical persona.

## What is Adversarial Review?

A review technique where the reviewer must produce findings. "Looks good" with an empty list is not allowed.

The mechanism is a **finding floor** (at least ten issues to fix or improve) plus an explicit push to look for **what is missing**, not only what is wrong. If the content is empty, stop. If the list is empty, re-check — do not finish with nothing.

It is not about sounding hostile. Older prompts used a jaded persona; that does not change what modern models find. What still matters is the obligation to keep searching and to prefer omissions over a cursory pass.

## Why It Works

Normal reviews suffer from confirmation bias. You skim the work, nothing jumps out, you approve it. The floor breaks that pattern:

- **Forces thoroughness** — cannot finish until enough concrete issues are listed
- **Catches missing things** — "what is not here?" is part of the job
- **Feeds triage, not the user directly** — in build and code-review, a parent session filters noise into a short signal list; the hunter's job is recall, not final judgment
- **Information asymmetry** — hunters often run with fresh context on the change, so they evaluate the artifact rather than replaying the author's intent

## Where It's Used

- **bmad-build / bmad-build-auto / bmad-code-review** — the Blind Hunter layer: short inlined prompt, content under `CONTENT:`, parallel with edge-case and verification-gap layers, then triage
- **bmad-review** — the adversarial lens among multi-lens reviews (same method; canonical finding fields for merge)

The pattern can apply to any artifact that needs scrutiny: diffs, specs, docs.

## Human (or parent) Filtering Required

Because the model is instructed to fill a list, it will produce items even when some are thin, pre-existing, or wrong. Expect false positives.

**Triage decides what is real.** In agentic build/code-review, that is the parent workflow. In a standalone review, it is you. Dismiss noise; keep what matters.

## Example

Instead of:

> "The authentication implementation looks reasonable. Approved."

An adversarial pass produces a list such as:

> 1. `login.ts:47` — no rate limiting on failed attempts
> 2. Session token stored in localStorage (XSS risk)
> 3. Password validation only client-side
> 4. No audit logging for failed login attempts
> 5. Magic number `3600` should be a named constant
> …
> (through at least ten concrete items)

The first "review" might miss a security gap. The second is long on purpose so something real has a chance to surface.

## Iteration and Diminishing Returns

After addressing findings, another pass can still help. Each pass costs time; eventually you get only nits and false findings. Downstream triage and a fixed loop budget (in build) keep that from running forever.

:::tip[Better Reviews]
Look for what's missing, not only what's wrong. Keep hunting until the list is real — then let triage cut it down.
:::
