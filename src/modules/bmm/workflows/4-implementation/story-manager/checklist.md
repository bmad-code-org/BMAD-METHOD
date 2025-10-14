# Story Manager Workflow Validation Checklist

## Story Document Structure

- [ ] Story number follows convention: story-{epic_num}.{story_num}.md
- [ ] Status field present and accurate (draft/in-progress/complete)
- [ ] Created date and creator documented
- [ ] Story origin mode specified (Creation/Review-Based)
- [ ] Story origin rationale clearly explained

## Story Content Quality

- [ ] User story follows format: "As a [role], I want [action], so that [benefit]"
- [ ] Role is specific and appropriate
- [ ] Action is clear and actionable
- [ ] Benefit explains value/motivation
- [ ] Acceptance criteria present (minimum 3, maximum 7)
- [ ] Each acceptance criterion is specific and testable
- [ ] No placeholder text remains (all {{variables}} resolved)

## Epic Integration

- [ ] Parent epic correctly identified and referenced
- [ ] Epic document updated with story reference
- [ ] Epic analysis documented in story
- [ ] If epic revision occurred, changelog updated in epic
- [ ] Epic revision rationale documented

## Traceability

- [ ] PRD references documented
- [ ] Clear linkage from story back to PRD requirements
- [ ] Architecture impact assessed and documented
- [ ] UX impact assessed and documented
- [ ] All source references include file path and section

## Documentation Updates - Core

- [ ] PRD updated with story link (if PRD exists and story impacts it)
- [ ] solution-architecture.md updated (if architecture doc exists and story has architectural impact)
- [ ] ux-specification.md updated (if UX doc exists and story has UX impact) - OPTIONAL
- [ ] Missing core documents identified and user notified during workflow
- [ ] Each core doc update includes changelog entry
- [ ] No core documentation contradicts story requirements

## Documentation Updates - Discovered

- [ ] All docs/ files inventoried and assessed
- [ ] Each impacted document identified via intelligent assessment
- [ ] All relevant documents updated
- [ ] No orphaned references (all docs mentioned in story exist)
- [ ] Documentation references section lists all sources

## Cross-References and Related Stories

- [ ] All related stories identified
- [ ] Relationship types specified (depends-on, blocks, related, resolves, supersedes)
- [ ] New story includes references to all related stories
- [ ] All related stories updated with reciprocal cross-references
- [ ] No broken cross-reference links

## Atomic Integrity

- [ ] Documentation Update Checklist in story document complete
- [ ] All checkboxes marked (either updated or not-applicable)
- [ ] No partial updates (each doc either fully updated or unchanged)
- [ ] All checkpoint metadata present
- [ ] Workflow status reflects true completion state

## Workflow Metadata

- [ ] Workflow mode recorded correctly
- [ ] Last checkpoint documented
- [ ] Checkpoint state accurate
- [ ] All template variables resolved (no {{unresolved}})
- [ ] Review source referenced (if review-based mode)

## Resume Capability

- [ ] Story includes checkpoint metadata for resume
- [ ] Documentation checklist tracks progress
- [ ] Each checkpoint represents atomic state
- [ ] Abandoned stories marked with status and reason

## Completeness

- [ ] Story ready for AI agent implementation
- [ ] No TODOs or placeholder sections
- [ ] All required fields populated
- [ ] Dev notes include architecture constraints
- [ ] Project structure notes present
- [ ] File list section prepared for implementation

## Final Validation

### Story Issues

- [ ] No issues found
- Issue List:

### Documentation Issues

- [ ] No issues found
- Issue List:

### Integration Issues

- [ ] No issues found
- Issue List:

### Atomic Integrity Issues

- [ ] No issues found
- Issue List:

## Checklist Completion

- [ ] All critical items checked
- [ ] All issues documented and resolved
- [ ] Story Manager workflow executed completely
- [ ] Story status set to "complete"
- [ ] Human approval granted

---

**Validation Notes:**

This checklist ensures the Story Manager workflow maintains the 10 Fundamental Truths:

1. ✓ Traceability Is Mandatory
2. ✓ Current Documentation or No Documentation
3. ✓ System Consistency Is Required
4. ✓ Change Is Normal, Not Exceptional
5. ✓ Connections Must Be Traceable
6. ✓ Design for Human Verification
7. ✓ Capture the 'Why' Not Just the 'What'
8. ✓ Story-First Creation Order
9. ✓ Atomic Documentation Updates (All or Nothing)
10. ✓ Stories Are Discovery Artifacts (Upstream Flow)
