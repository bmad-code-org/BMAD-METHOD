---
title: "Forensic Investigation"
description: How bmad-investigate treats every issue like a crime scene, grades evidence, and produces a structured case file engineers can act on
sidebar:
  order: 6
---

You hand `bmad-investigate` a crash log, a stack trace, or just a "this used to work, now it doesn't". The skill takes
over the investigator's discipline for the duration of the run. It does not start fixing. It opens a case file.

Every finding gets graded. Every hypothesis gets a status. Wrong turns are kept, not erased. The deliverable is a
document another engineer can pick up cold.

This page explains why investigation is its own discipline, and what the skill buys you that a regular dev workflow
doesn't.

## The Problem With "Just Debug It"

Normal debugging blends three things: looking at evidence, reasoning about cause, and changing code to test the theory.
When they're blended, two failure modes show up.

The first is **narrative lock-in**. The first plausible story becomes the working theory, and every observation gets
bent to fit it. The bug stays unfixed until someone gives up and starts over. Hours later.

The second is **evidence amnesia**. You traced something, ruled it out, but didn't write down why. Two days later, with
fresh eyes, you trace it again. Or worse, a colleague picks up the bug and re-runs the same dead end you already
eliminated.

The skill's design is a direct response to both.

## Evidence Grading

Every finding in an investigation is one of three things.

- **Confirmed.** Directly observed in logs, code, or dumps; cited with a specific reference (a `path:line`, a log
  timestamp, a commit hash). If someone asks "how do you know?", you point at the citation.
- **Deduced.** Logically follows from confirmed evidence; the reasoning chain is shown. If a step in the chain is wrong,
  the deduction is wrong, and you can see exactly which step.
- **Hypothesized.** Plausible but unconfirmed. States what evidence would confirm or refute, and declares upfront what
  would close it. Hypotheses are explicitly *not facts*.

The grading is not about being humble. It's about making the case file readable. A reader can scan the Confirmed section
to know what is true, the Deduced section to know what follows, and the Hypothesized section to know what is still open.
Confusion between the three is the most common reason investigations spiral.

## Stronghold First

Investigation never starts from a theory. It starts from one piece of confirmed evidence and expands outward. That
evidence might be a specific error message, a stack frame, or a timestamped log entry.

This is the opposite of how investigations often go. Someone has a hunch, builds a theory, and then hunts for evidence
that supports it. The hunch can be right; the *method* is fragile because it makes confirmation bias the default.

A stronghold is a fact you can return to when reasoning gets murky. If a deduction takes you somewhere strange, you can
walk it back to the stronghold and try a different branch. Without one, you don't know which step to undo.

When evidence is sparse, the skill says so and switches to hypothesis-driven exploration: form hypotheses from what's
available, identify what would test each, present a prioritized data-collection list. Missing evidence is itself a
finding.

## Hypothesis Discipline

Hypotheses are never deleted from the case file. When evidence confirms or refutes one, its **Status** field updates
from Open to Confirmed or Refuted, and a **Resolution** explains what evidence settled it.

This rule has a real cost. Case files grow. The benefit is real too. The full reasoning history becomes part of the
deliverable. Six months later, when a similar bug surfaces, the next investigator can read the original case file and
see which paths were already eliminated and why. Without that history, every new investigator re-runs the same dead
ends.

It also disciplines the present-tense investigator. If you can't delete a wrong hypothesis, you have to disprove it
with cited evidence. Quietly dropping it when it becomes inconvenient is no longer an option.

## Challenge the Premise

The user's description of the problem is a hypothesis, not a fact. "The cache is broken" is something a user *believes*.
Before the skill builds an investigation around it, the technical claims are verified independently. If the evidence
contradicts the premise, the report says so directly.

This is the forensic instinct: the witness's account is data, not truth. Sometimes the reported bug is real but
mislabeled. Sometimes the described symptom is downstream of a different cause. Investigations that take the premise as
gospel diagnose the wrong defect, and the bug returns in a slightly different form.

## A Calibrated Walk

The skill is one procedure, not two modes. It calibrates how much defect-chasing versus how much area-exploration the
input demands, on a continuous scale.

A symptom-driven case (a ticket, a crash, an error message, a "this used to work") leans into hypothesis tracking,
timeline reconstruction, and a fix direction. A no-symptom case (understanding a module before you touch it, evaluating
reusability, building a mental model) leans into I/O mapping, control-flow filtering, and a verification plan. Most
real cases sit somewhere between, and the case file reflects whichever balance the evidence required.

The discipline is the same regardless of where on the scale a case lands: stronghold first, evidence grading, hypothesis
tracking, never erase. The output is always at `{implementation_artifacts}/investigations/{slug}-investigation.md`, with
sections that don't apply to a given case left empty or omitted.

When a deep bug requires understanding a broader subsystem, the procedure folds in the I/O mapping, control-flow
filtering, working-backward-from-outputs, and cross-component boundary tracing techniques inline. The area model lands
in the same case file. There is no mode switch.

## Methodology Lives in the Skill

The investigator's discipline is a property of the skill itself. Whoever invokes `bmad-investigate` takes on the
methodology and communication style for the run: clinical precision, evidence-first language, no hedging, case-file
framing. When the skill ends, the caller returns to its prior voice. No persona swap, just a tone shift from the skill's
principles.

This matters because investigation and implementation reward different instincts. Investigators are slow and precise.
Implementers are fast and confident. The same brain doing both in one session tends to do neither well. The skill
carves out the investigative posture inline, without a context switch to a separate identity.

## What You Get

A completed investigation file:

- Separates Confirmed findings (with citations) from Deductions and Hypotheses
- Preserves all hypotheses ever formed, with their final Status and Resolution
- Reconstructs a timeline of events from multiple evidence sources
- Identifies data gaps and what they would resolve
- Provides actionable conclusions grounded in evidence
- Includes a reproduction plan when a root cause is identified
- Maintains an investigation backlog of paths still to explore

Hand it to an engineer who was not present and they understand what happened, what is known, and what remains uncertain.
That's the bar.

## The Bigger Idea

Most "AI debugging" today blends evidence, reasoning, and code changes into one stream of plausible-looking text. The
signal is hard to find, the dead ends repeat, and the case file, if there is one, is a chat log nobody wants to read.

`bmad-investigate` treats investigation as a discipline with its own deliverable. Evidence has a grade. Hypotheses have
a status. Wrong turns are documented, not erased. The case file outlives the session.

When the next bug shows up that looks like one you've seen before, you have somewhere to start that isn't a blank
prompt.
