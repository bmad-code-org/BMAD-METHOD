# Create Tech-Spec - Spec Engineering for Game Development

<workflow>

<critical>Communicate in {communication_language}, tailored to {user_skill_level}</critical>
<critical>Generate documents in {document_output_language}</critical>
<critical>Conversational spec engineering - ask questions, investigate code, produce complete spec</critical>
<critical>Spec must contain ALL context a fresh dev agent needs to implement it</critical>
<critical>Focus on game-specific considerations: performance, feel, engine patterns</critical>

<checkpoint-handlers>
  <on-select key="a">Load and execute {advanced_elicitation}, then return to current step</on-select>
  <on-select key="p">Load and execute {party_mode_workflow}, then return to current step</on-select>
  <on-select key="b">Load and execute {quick_dev_workflow} with the tech-spec file</on-select>
</checkpoint-handlers>

<step n="1" goal="Understand what the user wants to build">

<action>Greet {user_name} and ask them to describe what they want to build or change in their game.</action>

<action>Ask game-specific clarifying questions:

- What's the feature/mechanic?
- How does it affect gameplay feel?
- Performance requirements? (60fps critical path?)
- Which game systems does it touch?
- Existing code to integrate with?
  </action>

<action>Check for existing context in {output_folder} and {implementation_artifacts}</action>

<checkpoint title="Problem Understanding">
[a] Advanced Elicitation  [c] Continue  [p] Party Mode
</checkpoint>

</step>

<step n="2" goal="Investigate existing game code (if applicable)">

<action>If brownfield: identify game engine (Unity/Unreal/Godot/custom)</action>

<action>Get file paths, read code, identify:

- Engine patterns and conventions
- Existing game systems to integrate with
- Performance-critical code paths
- Test patterns if any
  </action>

<action>Document: engine version, code patterns, files to modify, system dependencies</action>

<checkpoint title="Context Gathered">
[a] Advanced Elicitation  [c] Continue  [p] Party Mode
</checkpoint>

</step>

<step n="3" goal="Generate the technical specification">

<action>Create tech-spec using this game-focused structure:

```markdown
# Tech-Spec: {title}

**Created:** {date}
**Status:** Ready for Development
**Engine:** {engine_name} {version}

## Overview

### Feature/Mechanic Description

### Gameplay Impact

### Scope (In/Out)

## Context for Development

### Engine Patterns

### Existing Systems Integration

### Files to Reference

### Technical Decisions

## Implementation Plan

### Tasks

- [ ] Task 1: Description
- [ ] Task 2: Description

### Performance Considerations

- Frame budget impact
- Memory considerations
- Critical path notes

### Acceptance Criteria

- [ ] AC 1: Given/When/Then (include feel/responsiveness criteria)
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

<output>**Tech-Spec Complete!** 🎮

Saved to: {implementation_artifacts}/tech-spec-{slug}.md

[a] Advanced Elicitation - refine further
[b] Begin Development (not recommended - fresh context better)
[d] Done - exit
[p] Party Mode - get feedback

**Recommended:** Run `quick-dev` in fresh context with this spec.
</output>

<ask>Choice (a/b/d/p):</ask>

</step>

</workflow>
