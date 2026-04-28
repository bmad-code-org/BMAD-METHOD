---
title: "Forensic Investigation"
description: How Tracy treats every issue as a crime scene, grades evidence, and produces a structured case file engineers can act on
sidebar:
  order: 6
---

You hand Tracy a crash log, a stack trace, or just a "this used to work, now it doesn't". She does not start fixing. She starts a case file.

Every finding gets graded. Every hypothesis gets a status. Wrong turns are kept, not erased. The deliverable is a document another engineer can pick up cold.

This page explains why investigation is its own discipline, and what that buys you that a regular dev workflow doesn't.

## The Problem With "Just Debug It"

Normal debugging blends three things together: looking at evidence, reasoning about what might have caused the symptom, and changing code to see if the symptom goes away. When they're blended, two failure modes show up.

The first is **narrative lock-in**. The first plausible story becomes the working theory, and every subsequent observation gets bent to fit it. The bug stays unfixed until someone gives up on the story and starts over. Hours later.

The second is **evidence amnesia**. You traced something, ruled it out, but didn't write down why. Two days later, with fresh eyes, you trace it again. Or worse, a colleague picks up the bug and re-runs the same dead end you already eliminated.

Tracy's design is a direct response to both.

## Evidence Grading

Every finding in an investigation is one of three things:

- **Confirmed.** Directly observed in logs, code, or dumps; cited with a specific reference (a `path:line`, a log timestamp, a commit hash). If someone asks "how do you know?", you point at the citation.
- **Deduced.** Logically follows from confirmed evidence; the reasoning chain is shown. If a step in the chain is wrong, the deduction is wrong, and you can see exactly which step.
- **Hypothesized.** Plausible but unconfirmed; states what evidence would confirm or refute it. Hypotheses are explicitly *not facts*, and they declare upfront what would close them.

The grading is not about being humble. It's about making the case file readable. A reader can scan the Confirmed section to know what is true, the Deduced section to know what follows, and the Hypothesized section to know what is still open. Confusion between the three is the most common reason investigations spiral.

## Stronghold First

Tracy never starts from a theory. She starts from one piece of confirmed evidence and expands outward. That evidence might be a specific error message, a stack frame, or a timestamped log entry.

This is the opposite of how investigations often go. Someone has a hunch, builds a theory, and then hunts for evidence that supports it. The hunch can be right; the *method* is fragile because it makes confirmation bias the default.

A stronghold is a fact you can return to when reasoning gets murky. If a deduction takes you somewhere strange, you can walk it back to the stronghold and try a different branch. Without one, you don't know which step to undo.

When evidence is sparse (no diagnostic archive, minimal logs, vague description), Tracy says so explicitly and switches to hypothesis-driven exploration: form hypotheses from what's available, identify what evidence would test each, and present a prioritized data-collection list. Missing evidence is itself a finding.

## Hypothesis Discipline

Hypotheses are never deleted from the case file. When evidence confirms or refutes one, its **Status** field updates from Open to Confirmed or Refuted, and a **Resolution** explains what evidence settled it.

This rule has a real cost. Case files grow. The benefit is real too. The full reasoning history becomes part of the deliverable. Six months later, when a similar bug surfaces, the next investigator can read the original case file and see which paths were already eliminated and why. Without that history, every new investigator re-runs the same dead ends.

It also disciplines the present-tense investigator. If you can't delete a wrong hypothesis, you have to actually disprove it with cited evidence, instead of quietly dropping it because it became inconvenient.

## Challenge the Premise

The user's description of the problem is a hypothesis, not a fact. "The cache is broken" is something a user *believes*. Before Tracy builds an investigation around it, she verifies the technical claims independently. If the evidence contradicts the premise, she says so directly.

This is the forensic instinct: the witness's account is data, not truth. Sometimes the bug a user reports is real but mislabeled. Sometimes the symptom they describe is downstream of an entirely different cause. Investigations that take the premise as gospel often diagnose the wrong defect, and the bug returns under a slightly different surface form.

## Two Modes, One Discipline

Tracy ships two skills:

- **`bmad-investigate`** (`IN`). There is a symptom. A ticket, a crash, an error message, a "this used to work". The deliverable is a structured investigation file at `{implementation_artifacts}/investigations/{slug}-investigation.md` with a root cause (or the most-promising hypothesis with documented gaps), a fix direction, and a reproduction plan.

- **`bmad-code-archaeology`** (`CX`). There is no symptom. You need to understand a module before you touch it, evaluate whether something is reusable, or build a mental model of an unfamiliar subsystem. The deliverable is an archaeology file with the area's I/O contract, key state transitions, boundary crossings, and a verification plan.

The discipline is the same in both: stronghold first, evidence grading, hypothesis tracking, never erase. Only the deliverable shape differs.

When investigating a deep bug requires understanding a broader subsystem, `bmad-investigate` does not switch skills. Its source-code-trace phase folds archaeology techniques inline (input/output mapping, control-flow filtering, working backward from outputs, cross-component boundary tracing) and writes the area model into the same case file. The standalone `bmad-code-archaeology` exists for the no-bug case, where exploration is the goal.

## Two Downstream Paths

An investigation produces a fix direction, and that direction has two natural downstream homes.

- **Small fix.** Feed the case file into `bmad-quick-dev`. The Quick Flow track is already wired for this. Tracy diagnoses, Amelia implements.
- **Systemic rework.** When the investigation surfaces something larger than a localized fix (an architectural assumption that broke, a cross-component data flow problem, a legacy area that needs targeted refactor), the case file becomes input to `bmad-create-prd` (Phase 2). The investigation's evidence-graded findings, reproduction plan, and timeline are exactly the constraints a PRD needs to capture.

Tracy doesn't decide which path. The fix direction in the conclusion does. Trivial findings go to Quick Flow. Non-trivial findings that touch multiple components or shift an architectural decision go to the planning phase.

## Tracy and Amelia

Amelia ships code. Tracy investigates. They don't overlap.

When a case concludes, Tracy stops at identifying the root cause and a fix direction. She doesn't implement. The hand-off to Amelia is explicit: a case file Amelia can read, a fix direction she can scope into a story, and a reproduction plan she can verify against. If the fix is genuinely trivial (an off-by-one, a missing null check), Tracy notes the direction in the report. She still doesn't apply the change.

This separation matters because investigation and implementation reward different instincts. An investigator's job is to be slow and precise; an implementer's job is to be fast and confident. The same brain, in the same session, doing both, tends to do neither well.

## What You Get

A completed investigation file:

- Separates Confirmed findings (with citations) from Deductions and Hypotheses
- Preserves all hypotheses ever formed, with their final Status and Resolution
- Reconstructs a timeline of events from multiple evidence sources
- Identifies data gaps and what they would resolve
- Provides actionable conclusions grounded in evidence
- Includes a reproduction plan when a root cause is identified
- Maintains an investigation backlog of paths still to explore

Hand it to an engineer who was not present and they understand what happened, what is known, and what remains uncertain. That's the bar.

## The Bigger Idea

Most "AI debugging" today blends evidence, reasoning, and code changes into one indistinguishable stream of plausible-looking text. The signal is hard to find, the dead ends repeat, and the case file, if there is one, is a chat log nobody wants to read.

Tracy treats investigation as a discipline with its own deliverable. Evidence has a grade. Hypotheses have a status. Wrong turns are documented, not erased. The case file outlives the session.

When the next bug shows up that looks like one you've seen before, you'll have somewhere to start that isn't a blank prompt.
