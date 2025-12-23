# Create Tech-Spec - Spec Engineering for AI Development

<workflow>

<critical>Communicate in {communication_language}, tailored to {user_skill_level}</critical>
<critical>Generate documents in {document_output_language}</critical>
<critical>Conversational spec engineering - ask questions, investigate code, produce complete spec</critical>
<critical>Spec must contain ALL context a fresh dev agent needs to implement it</critical>

<checkpoint-handlers>
  <on-select key="a">Load and execute {advanced_elicitation}, then return to current step</on-select>
  <on-select key="p">Load and execute {party_mode_workflow}, then return to current step</on-select>
  <on-select key="b">Load and execute {quick_dev_workflow} with the tech-spec file</on-select>
</checkpoint-handlers>

<step n="1" goal="Understand what the user wants to build">

<action>Greet {user_name} and ask them to describe what they want to build or change.</action>

<action>Ask clarifying questions: problem, who's affected, scope, constraints, existing code?</action>

<action>Check for existing context in {output_folder} and {implementation_artifacts}</action>

<checkpoint title="Problem Understanding">
[a] Advanced Elicitation  [c] Continue  [p] Party Mode
</checkpoint>

</step>

<step n="2" goal="Investigate existing code (if applicable)">

<action>If brownfield: get file paths, read code, identify patterns/conventions/dependencies</action>

<action>Document: tech stack, code patterns, files to modify, test patterns</action>

<checkpoint title="Context Gathered">
[a] Advanced Elicitation  [c] Continue  [p] Party Mode
</checkpoint>

</step>

<step n="3" goal="Generate the technical specification">

<action>Create tech-spec using this structure:

```markdown
# Tech-Spec: {title}

**Created:** {date}
**Status:** Ready for Development

## Overview

### Problem Statement

### Solution

### Scope (In/Out)

## Context for Development

### Codebase Patterns

### Files to Reference

### Technical Decisions

## Implementation Plan

### Tasks

- [ ] Task 1: Description
- [ ] Task 2: Description

### Acceptance Criteria

- [ ] AC 1: Given/When/Then
- [ ] AC 2: ...

## Additional Context

### Dependencies

### Testing Strategy

### Notes
```

</action>

<action>Save to {implementation_artifacts}/tech-spec-{slug}.md</action>

</step>

<step n="4" goal="Review and finalize">

<action>Present spec to {user_name}, ask if it captures intent, make changes as needed</action>

<output>**Tech-Spec Complete!**

Saved to: {implementation_artifacts}/tech-spec-{slug}.md

[a] Advanced Elicitation - refine further
[b] Begin Development (not recommended - fresh context better)
[d] Done - exit
[p] Party Mode - get feedback

**Recommended:** Run `dev-spec {implementation_artifacts}/tech-spec-{slug}.md` in fresh context.
</output>

<ask>Choice (a/b/d/p):</ask>

</step>

</workflow>
