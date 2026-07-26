---
name: project-change-ui
description: Modify existing UI with the smallest valid diff while preserving a project's UI contract. Use when changing layout, styles, content, or interaction in an existing screen or component.
---

# Outcome

Implement the requested UI change using existing components, tokens, and conventions.

# Use when

- Editing an existing screen or component.
- Changing layout, styles, content, responsive behavior, or local interaction.

# Do not use when

- Changing a product flow, shared design-system API, authentication, or payments.

# Inputs

- User request, nearest `AGENTS.md`, affected component, and UI contract when relevant.

# Procedure

1. Locate the affected component and its nearest project conventions.
2. Read UI references only for forms, accessibility, or interaction changes.
3. Make the smallest valid diff and inspect it for unrelated changes.

# Execution defaults

- Mode: patch or focused.
- Specification: off.
- Subagents: 0.
- Verification: manual or targeted static.

# Escalate when

- Navigation, shared primitives, public component APIs, or accessibility architecture changes.

# Done when

The requested UI behavior is implemented with the selected verification evidence.
