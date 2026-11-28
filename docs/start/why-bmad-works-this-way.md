---
title: Why BMad Works This Way
description: The design principles behind BMad's ticket tree, story sizing, goal-blind research, review depth, and plain-language agents.
sidebar:
  order: 2
---

BMad makes specific trade-offs about where decisions live, how big a story should be, when humans stay in control, and how agents ask questions. This page explains the reasoning behind each choice so you know when to follow the defaults and when to override them.

## The Ticket Is the Spec

When product specifications and engineering tickets live in separate files maintained by different workflows, they drift apart and every new coding session has to guess which document to trust. In BMad, the initiative, epic, or story ticket is the single source of truth at its level. Every skill working on a ticket reads it first and in full; only Sofia, the Product Owner, re-reads upstream sources such as briefs, PRDs, or meeting notes when she updates the ticket.

## Start Anywhere, Right-Sized

The four stages (Clarify, Plan, Build and verify, Learn and adjust) describe the kind of help a skill provides rather than a mandatory pipeline. BMad recommends the smallest route that safely fits your scope and risk. Every skill works independently, so work finishes when your goal is met and your chosen checks pass, even if most skills never ran.

## Size the Work Before Planning It

Sofia sizes new work from the blast radius of the work itself rather than from team size or calendar estimates. One self-contained behavior stays a single story or direct build; one cohesive capability spanning multiple stories becomes an epic; several capabilities sharing outcomes and rules become an initiative; and multiple related initiatives under one portfolio use a top-level program container. Epics follow user-visible capabilities rather than team org charts.

## One Story, One Capability

A story is one complete capability a person can see working end to end and verify in one sitting. Stories are intentionally substantial: an epic often holds just one to a few stories. Breaking work into tiny layer-by-layer tickets (one ticket for a migration, one for an API route, one for a form) was a workaround for coordinating multiple humans editing the same files. For AI coding agents, tiny horizontal slices hide the full behavior and exhaust the human reviewer with fragmented diffs.

Internal coding steps (migrations, endpoints, UI views, and tests) belong inside the build's own implementation plan rather than on the ticket board. A single build session focuses on one goal of roughly 500 changed lines (excluding tests) in a fresh chat; if a story takes more than one session, it continues from the same plan rather than fragmenting the ticket. When a request mixes two independent goals, `bmad-build` offers to split the second goal out cleanly instead of shipping half-wired placeholders.

## Agree Scope First, Write Clear Criteria Before Building

When Sofia slices an initiative into epics, she keeps the new epics thin at first so you agree on scope and boundaries before investing time in detailed edge cases. Once you are ready to work on an epic, Sofia refines its requirements (and offers John, Sally, or Winston if product, UX, or technical questions are still open) before slicing it into stories.

Once you approve an epic's story breakdown, Sofia writes full story files with clear Given/When/Then acceptance criteria and verification checks by default. Giving coding agents explicit verification contracts up front prevents silent assumptions during implementation and code review. If you prefer to keep later stories lightweight until pickup, you can tell Sofia to detail only the next story now and refine the rest when you reach them.

## You Mark Work Done

Automated builds always stop at `built` and never mark a ticket `done`. Only you, or an automation you explicitly direct, move a story to `done` after checking the outcome. Unattended runs (`bmad-build-auto`) also refuse to invent or choose their own work: you or your orchestrator pass a specific ticket, and if required decisions are missing, the run stops cleanly and reports why.

## Review Depth Follows the Stakes

By default, `bmad-build` runs a quick self-review suited to fast iteration. High-risk changes or changes affecting production systems warrant a thorough review before shipping, either inside `bmad-build`, through an independent `bmad-code-review` pass, or via your pull request review process. When an epic finishes, `bmad-retrospective` performs a deeper review across the entire epic's changes against its original goals.

## Research Reports What the Code Does

When `bmad-deep-recon` investigates an existing repository, it reports how the code works at a specific commit and how it evolved, citing every claim to a file, line, or commit without offering recommendations. Its sub-researchers receive only factual questions and never the feature goal, because an investigator who knows what you want to build tends to describe how the code ought to work rather than how it actually behaves. Deciding what to change stays with you.

## One Shared Facilitation Flow for Documents

Mary, John, Sally, and Winston (as well as Nadia in Founder and Clio in Creative) all create, update, and validate structured documents through the same shared facilitation flow (`bmad-facilitate`). Instead of learning a different workflow for every document type, you get the same interactive coaching, explicit assumption tracking, and fast or step-by-step pacing across briefs, PRDs, UX designs, and shared architecture documents. Every document stays optional: a solo builder or small team that already agrees can skip straight to Sofia or `bmad-build`.

## Change Goes Back to the Plan

When requirements shift mid-project, you bring the change to Sofia instead of patching future stories by hand. She updates the requirements first, adjusts remaining stories, marks obsolete work as dropped with a dated reason, and leaves already-built work intact unless it must change. On a team, upstream product requirements are updated before shared architecture so every reference stays aligned.

## Done and Dropped Work Is the Record

Completed and dropped tickets remain untouched as historical records and are never reshaped to newer templates. Cancelled items are marked dropped with a short reason rather than deleted, so ticket IDs are never reused and future teammates can see why a path was abandoned. Build plans stay beside finished stories as the audit trail that retrospectives and future debugging rely on.

## Talk to Agents in Plain Words

Every specialist agent responds to plain-English requests and routes automatically to the right skill or conversation. When you open an agent with no specific request, they orient you warmly in two or three plain sentences covering what they help with and ask one concrete starter question instead of dropping a wall of options. If you want to see everything an agent can do, just ask, and they summarize their capabilities and offer the full list on request.
