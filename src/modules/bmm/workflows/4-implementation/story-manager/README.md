# Story Manager Workflow

**Version:** 1.0
**Author:** Paul
**Module:** BMM (BMad Method Module)

## Purpose

The Story Manager workflow adds new stories to active epics while maintaining complete documentation integration and bidirectional traceability. Designed specifically for AI agent team coordination, this workflow ensures all project documentation stays current to prevent AI hallucination and reliance on outdated training data.

## When to Use

Use this workflow when:

- AI agents discover new requirements during implementation
- Senior dev reviews identify follow-up work needed
- Technical debt is identified that needs tracking
- Backlog recommendations need to be captured as stories
- Architecture changes necessitate new implementation stories
- Accessibility, performance, or security requirements emerge
- Integration issues require dedicated story tracking
- Any mid-sprint discovery needs to be properly integrated

## What It Does

### Core Capabilities

1. **Bidirectional Intelligence**: Propagates discoveries upstream (Story → Epic → PRD)
2. **Living Documentation**: Maintains current docs across entire project
3. **Atomic Integrity**: All-or-nothing updates prevent inconsistent states
4. **Resume Capability**: Checkpoint-based resume for context limit resilience
5. **Dynamic Discovery**: Finds and updates ALL relevant documentation automatically
6. **Cross-Referencing**: Maintains bidirectional story relationships

### Workflow Modes

**Creation Mode**: Build story from scratch with interactive requirements gathering

**Review-Based Mode**: Extract requirements from senior dev review or backlog item

## How to Invoke

From BMad agent:

```
/workflow story-manager
```

Or via command:

```
workflow story-manager
```

## Workflow Steps

1. **Initialize** - Detect and resume in-progress stories
2. **Gather Requirements** - Creation or Review-Based mode
3. **Analyze Epic** - Context analysis and revision detection
4. **Create Story** - Story-first document creation (Checkpoint 1)
5. **Discover Related Stories** - Find cross-reference candidates
6. **Update Epic** - Add story reference (Checkpoint 2)
7. **Discover Documentation** - Build complete docs inventory
8. **Update All Documentation** - Intelligent assessment and updates (Checkpoint 3+)
9. **Cross-Reference** - Bidirectional story linking (Checkpoint 4)
10. **Approve** - Human-in-the-loop verification
11. **Finalize** - Confirm atomic integrity and complete

## Inputs Required

### Always Required

- Epic number
- Story requirements/description
- Story rationale (why needed)

### Mode-Specific

- **Creation Mode**: Interactive requirements gathering
- **Review-Based Mode**: Review document path or content

### Referenced Documents

- Epic document (required - workflow will prompt if missing)
- PRD (recommended - workflow will prompt if missing, can continue without)
- solution-architecture.md (recommended - workflow will prompt if missing, can continue without)
- ux-specification.md (optional - assessed if present, skipped if absent)
- All other docs/ files (dynamic discovery)

## Outputs Generated

### Primary Output

- New story document: `docs/stories/story-{epic}.{num}.md`

### Updated Documents

- Parent epic (story reference added)
- PRD (if story impacts requirements)
- solution-architecture.md (if architectural impact)
- ux-specification.md (if UX impact)
- All other impacted documentation (discovered dynamically)
- Related stories (cross-references)

### Metadata

- Workflow status tracking
- Checkpoint state for resume
- Documentation update checklist
- Cross-reference map

## Critical Features

### Resume Capability

If workflow is interrupted (context limits, errors, etc.):

1. Restart workflow: `/workflow story-manager`
2. System detects in-progress story
3. Offers resume from last checkpoint
4. Loads all saved state
5. Continues from where it left off

### Atomic Integrity

The workflow ensures:

- All documentation updates complete successfully, or none do
- No partial states that could mislead AI agents
- Checkpoint-based atomicity (each checkpoint is complete state)
- Human verification before finalization

### Dynamic Documentation Discovery

Instead of hardcoded doc list, workflow:

1. Scans entire docs/ directory
2. Extracts references from related stories
3. Builds complete documentation inventory
4. Assesses each document for story impact
5. Updates only relevant documents

## Best Practices

### For Story Managers

1. **Be specific in requirements** - AI agents need clear direction
2. **Explain the 'why'** - Rationale helps future understanding
3. **Review all updates** - Human approval ensures quality
4. **Trust the process** - Atomic integrity prevents inconsistency

### For Review-Based Mode

1. **Provide complete reviews** - More context = better extraction
2. **Include rationale** - Explain why work is needed
3. **Reference existing docs** - Helps workflow understand context

### For Context Management

1. **Use checkpoints** - Don't fear interruption
2. **Resume when needed** - Workflow preserves all state
3. **One story at a time** - Focus prevents confusion

## Fundamental Truths

This workflow is built on 10 Fundamental Truths:

1. **Traceability Is Mandatory** - Every story links to epic and PRD
2. **Current Documentation or No Documentation** - Stale docs are dangerous
3. **System Consistency Is Required** - All docs describe same reality
4. **Change Is Normal** - Discovery-driven evolution is expected
5. **Connections Must Be Traceable** - Explicit linkage required
6. **Design for Human Verification** - LLMs are non-deterministic
7. **Capture the 'Why'** - Rationale is essential context
8. **Story-First Creation Order** - Story before epic update
9. **Atomic Documentation Updates** - All or nothing
10. **Stories Are Discovery Artifacts** - Reality flows upstream

## Troubleshooting

### Workflow won't start

- Check bmad/bmm/config.yaml exists
- Verify dev_story_location is set
- Ensure docs/ directory exists

### Can't find epic

- Workflow will prompt with options if epic not found
- You can provide alternate path, create minimal epic, or cancel
- Epic is the only truly required document

### Missing PRD or architecture docs

- Workflow will notify and prompt for options
- You can provide alternate paths or continue without them
- Continuing without reduces traceability but doesn't block workflow

### ux-specification.md not found

- This is optional - workflow will note absence and continue
- UX impact assessment will be skipped if doc doesn't exist

### Documentation not updating

- Check file permissions
- Verify document paths are correct
- Ensure intelligent assessment approved updates

### Resume not working

- Check story has workflow_status: draft or in-progress
- Verify checkpoint metadata present
- Ensure only one in-progress story exists

## Integration with BMM

This workflow integrates with BMM module:

- Uses BMM config (dev_story_location, output_folder)
- Compatible with create-story workflow format
- Follows BMM story numbering convention
- Maintains BMM documentation standards

## Next Steps After Completion

1. Story ready for AI agent implementation
2. Run story-context workflow to generate implementation context
3. Assign to AI dev agent
4. All documentation synchronized and current

## Version History

**v1.0** - Initial release

- Creation and Review-Based modes
- Dynamic documentation discovery
- Checkpoint-based resume
- Atomic integrity guarantees
- Bidirectional traceability
- Cross-reference management

---

**For Questions or Issues:**

- Review brainstorming session: `docs/brainstorming-session-results-2025-10-13.md`
- Check workflow guide: `bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Consult fundamental truths in brainstorming results
