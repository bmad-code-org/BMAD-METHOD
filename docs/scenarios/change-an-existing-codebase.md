---
title: Change an Existing Codebase
description: 'Scenario: code that works but has no written decisions. Give agents a project context, learn the part you will change if nobody knows it, make a small change first, then take the route the work needs.'
sidebar:
  order: 5
---

Use this route when the code works but its decisions were never written
down. No documentation pass comes first: `bmad-build` reads the repository on
every run and follows what it finds. Start small, and add planning only when
the work calls for it.

The example is the [room booker](../start/how-bmad-works.md#the-example-app),
two years old. Its author has left, and nobody remembers how a booking ends
when nobody shows up. Next up is the check-in feature.

![Change an Existing Codebase: give agents a project context, learn the code if nobody knows it, make a small change with bmad-build first, then take the route the larger change needs](/diagrams/scenario-existing-codebase.svg)

## Steps

1. **Give agents a project context** (recommended): a short, verified block
   in `AGENTS.md` on how to run the tests, where things live, and what not to
   change. It adopts an `AGENTS.md` or `CLAUDE.md` you already maintain. See
   [Start in an Existing Codebase](../existing-codebases/start-in-an-existing-codebase.md).

   ```text wrap
   /bmad-project-context
   ```

2. **Learn the part you will change, if nobody knows it.** `bmad-walkthrough`
   takes you through the code at your pace.

   ```text wrap
   /bmad-walkthrough src/bookings/expiry.ts
   ```

   `bmad-deep-recon` writes a cited account of how the code works and why,
   with no recommendation; deciding what to change stays with you, Sofia, and
   the build. Ask it factual questions, and when it shows its plan of
   questions, add your own in the same chat.

   ```text wrap
   /bmad-deep-recon before we add check-in, how do bookings end today, and what depends on that?
   ```

   ```text wrap
   Where does the booking expiry timer run today, and what depends on it?
   ```

   Hand the account to Sofia when she writes the initiative so the tickets
   cite it; a build with no ticket finds it among the planning documents.

3. **Make a small change first,** one session's worth, to see how the build
   handles this code. Pinning today's behavior with a test is a good first
   change before a feature changes it.

   ```text wrap
   /bmad-build add a test that pins how a booking ends today when nobody shows up
   ```

4. **Take the route the next change needs.** Check-in is more than one
   session, so it goes to [Build from a Conversation](./build-from-a-conversation.md)
   or [Plan a Feature as a Team](./plan-a-feature-as-a-team.md). One session's
   worth goes to [Make a Small Change](./make-a-small-change.md).

## What You Have at the End

A project-context block in `AGENTS.md` that every later session reads, a cited
account of how the code you are about to change works, and one small change
built the way this codebase works.

## How a Build Treats Existing Code

`bmad-build` reads the repository first, notes what to reuse and what must not
change, and matches the code it finds. To break a pattern on purpose, say so
in the request and write why in the ticket, so later sessions follow the new
rule. [Start in an Existing Codebase](../existing-codebases/start-in-an-existing-codebase.md#build-follows-what-it-finds)
explains why.

When Sofia slices work on existing code, she reads the code to see where
deployment splits. Where it contradicts a requirement, she adds a
`Source conflict:` line and offers the correction.

To follow this route step by step on a working app, see
[Walk Through an Existing Codebase](../start/walk-through-an-existing-codebase.md).
New to BMad? Start with [Install BMad](../start/install-bmad.md).
