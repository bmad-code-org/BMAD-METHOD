---
title: ""
template: ux-audit
version: 1.0.0
category: ux-audit
description: "Audit existing UI, prototype, or frontend code: hierarchy, anti-slop craft, states, accessibility, and fix plan."
not_for: "Designing a greenfield system from scratch (`ux-system`, `design-direction`); pure backend code readiness (`agent-readiness`); single-commit code review (`bmad-code-review`)."
agents: [bmad-agent-ux-designer]
order: fixed
facilitation_order: [audit-scope-and-baseline, usability-and-task-clarity, visual-hierarchy-and-craft, state-and-edge-coverage, accessibility-and-keyboard, responsive-and-consistency, remediation-backlog, executive-scorecard]
guidance: guidance-method.md
rubric: rubric-ux-audit.md
view: always
status: draft
created: ""
updated: ""
---

<!-- purpose: Critique an existing shipped UI, frontend codebase, or visual prototype across usability, visual craft, edge states, accessibility, responsiveness, and design consistency — returning a scored assessment and bounded `bmad-build` cleanup slices. -->

<!-- stance: Ground every finding in verified UI code paths, rendered screenshots, or `DESIGN.md`/`EXPERIENCE.md` mismatches — never vague taste opinions. Lead with the highest-impact user friction and broken flows first. Coach non-UX users in plain language explaining *why* each issue confuses or blocks real users. -->

<!-- opening: Inspect the target frontend files, live app/screenshots (`imports/`), and any `DESIGN.md`, `EXPERIENCE.md`, or `branding/` contract first so broken tokens, contrast issues, or structural gaps surface right away. Play back what surfaces exist, ask where users struggle today, and confirm whether formal WCAG/accessibility compliance is part of the audit scope. -->

<!-- inputs: Shipped frontend components/routes/styles, screenshots or recordings in `imports/`, support complaints/user feedback, and governing `DESIGN.md`/`EXPERIENCE.md` (if any). -->

<!-- layout: Interactive Executive UX Audit Scorecard with clickable 6-dimension health ratings (`Strong`, `Adequate`, `Friction`, `Broken`), severity filters across findings, and copyable bounded `bmad-build` remediation cards. -->

<!-- writing:
  - Score every dimension cleanly: `Strong`, `Adequate`, `Friction`, or `Broken` with concrete `file:line`, screen, or screenshot citations.
  - Flag "AI slop" / craft defects specifically (weak visual hierarchy, flat undifferentiated cards, competing focal accents, clipped text, generic defaults) alongside missing UX engineering (empty/loading/error/permission/keyboard/focus breaks).
  - Format each remediation slice so Sofia (`bmad-agent-po`) or Amelia (`bmad-build`) can pick it up immediately (`Target surfaces/files`, `Fix`, `Verification check`).
-->

<!-- done when: All six dimensions are scored against real UI evidence; missing edge states and accessibility blockers are cited by surface/file; token or system drift is identified; and a sequenced remediation backlog gives clear first slices to fix. -->

# {title}

## Table of Contents

## Executive scorecard
<!-- built: from the completed audit dimensions below.
  - Present overall UX verdict, six-dimension scores (`Strong` / `Adequate` / `Friction` / `Broken`), top three high-impact user blockers, and the first remediation slice to build next.
  - Keep strictly derived from settled sections; add no unverified claims.
-->

## Audit scope and baseline
<!-- Surfaces, routes, components, screenshots (`imports/`), and governing `DESIGN.md` / `EXPERIENCE.md` / `branding/` baseline inspected, plus primary user tasks evaluated. -->

## Usability and task clarity
<!-- Score and evidence covering navigation clarity, cognitive load, CTA affordances, label/microcopy comprehension, and multi-step flow completion friction. -->

## Visual hierarchy and craft
<!-- Score and evidence covering focal point discipline, spacing/rhythm, contrast ratios, typography scale, dark/light polish, and generic anti-pattern cleanup. -->

## State and edge coverage
<!-- Matrix auditing each key surface across cold load, empty, validation/network error, stale/partial data, offline, and permission-denied states. -->

## Accessibility and keyboard
<!-- Score and evidence covering semantic landmarks, focus visibility, keyboard-only traversal, ARIA roles/announcements, target sizes, and color contrast checks. -->

## Responsive and consistency
<!-- Score and evidence covering mobile/tablet/desktop layout breaks, overflow/truncation issues, and drift between components, copy voice, or `DESIGN.md` tokens. -->

## Remediation backlog
<!-- Sequenced, bounded fix slices ordered by user impact (`Critical/High` first), each naming target screens/files, exact behavioral fix, and verification criteria ready for `bmad-build` or Sofia. -->
