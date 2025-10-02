# <!-- Powered by BMAD™ Core -->

# Create Checkpoint Summary Task

## Purpose
Compact accumulated context from workflow phases into concise summaries that maintain essential information while reducing token usage for subsequent phases. Implements the "compaction strategy" from effective context engineering.

## When to Use
- After major decision points (architecture chosen, tech stack selected)
- Before transitioning between workflow phases
- After 5+ sequential agent interactions
- When detailed discussions need to be archived with key decisions preserved

## Prerequisites
- Completed phase with multiple artifacts or discussions
- Clear understanding of what decisions were made
- Identified next phase that needs minimal context to proceed

## Process

### 1. Identify Context to Compact
**Review Phase Outputs:**
- All artifacts created in the current phase
- Key decisions and their rationale
- Technical discussions and conclusions
- Rejected alternatives (if critical for future reference)

**Determine Signal vs Noise:**
- **High Signal** (keep): Final decisions, artifact paths, constraints, dependencies
- **Low Signal** (archive): Verbose discussions, iteration history, detailed pros/cons

### 2. Extract Essential Information

**Decisions Made:**
- What was decided (1-2 sentence summary)
- Brief rationale (why this choice)
- Reference to detailed documentation (file path)

**Artifacts Created:**
- File path and one-line description
- Who should reference it and when
- Critical information it contains

**Constraints & Dependencies:**
- Technical constraints discovered
- Dependencies between decisions
- Blockers or risks identified

### 3. Create Checkpoint Document

**Structure:**
```markdown
# Phase Checkpoint: [Phase Name]

## Context
[2-3 sentences describing what this phase accomplished]

## Key Decisions
1. **[Decision]** - [Brief rationale] → Details: `[artifact-path]`
2. **[Decision]** - [Brief rationale] → Details: `[artifact-path]`

## Artifacts Created
- `[path/to/artifact.md]` - [one-line description]
- `[path/to/artifact.md]` - [one-line description]

## Critical Constraints
- [Constraint or requirement that impacts next phase]

## Next Phase Requirements
[3-5 sentences of essential context needed for next phase]

## Detailed References
Full analysis and discussions archived in: `[archive-path]/`
```

**File Naming:** `docs/checkpoints/[phase-name]-checkpoint.md`

### 4. Validate Checkpoint Quality

**Completeness Check:**
- [ ] All major decisions documented with rationale
- [ ] All artifacts listed with paths
- [ ] Critical constraints identified
- [ ] Next phase has sufficient context
- [ ] Checkpoint is < 100 lines

**Context Reduction Check:**
- [ ] Checkpoint is 80%+ smaller than full phase context
- [ ] No duplicate information from artifacts
- [ ] References use paths, not content repetition
- [ ] Verbose discussions compressed to conclusions

### 5. Archive Detailed Context

**Move to Archive:**
- Long technical discussions → `docs/archive/[phase-name]/discussions/`
- Iteration history → `docs/archive/[phase-name]/iterations/`
- Rejected alternatives → `docs/archive/[phase-name]/alternatives/`

**Keep Active:**
- Checkpoint summary
- Final artifacts (architecture docs, specs, etc.)
- Critical decision records

## Checkpoint Templates by Phase

### Architecture Phase Checkpoint
```markdown
# Architecture Phase Checkpoint

## Context
Architecture designed for [project type]. Selected [stack] based on [key requirements].

## Key Decisions
1. **Frontend**: [Framework] - [Why] → `docs/architecture/system-architecture.md`
2. **Backend**: [Framework] - [Why] → `docs/architecture/system-architecture.md`
3. **Database**: [Database] - [Why] → `docs/architecture/system-architecture.md`

## Artifacts
- `docs/architecture/system-architecture.md` - Complete system design
- `docs/architecture/technology-stack-decision.md` - Stack rationale

## Constraints
- [Technical constraint]
- [Business constraint]

## For Implementation Phase
[Brief context about architecture approach, key patterns to follow, integration points]
```

### Feature Analysis Checkpoint
```markdown
# Feature Analysis Checkpoint

## Context
Analyzed feature: [feature name]. Identified impact on [affected areas].

## Key Decisions
1. **Implementation Approach**: [Approach] - [Why] → `docs/features/[name]/technical-spec.md`
2. **Database Changes**: [Changes] - [Why] → `docs/features/[name]/technical-spec.md`

## Artifacts
- `docs/features/[name]/requirements.md` - User requirements
- `docs/features/[name]/technical-spec.md` - Implementation details

## Constraints
- Must maintain compatibility with [system]
- Performance target: [metric]

## For Story Creation
[Brief guide for breaking into stories, key technical considerations, testing approach]
```

## Best Practices

### Be Ruthless in Compression
- If it's in an artifact, don't repeat it in checkpoint
- If it's a detail, reference the artifact
- If it's a conclusion, state it concisely

### Optimize for Next Agent
- What does the next agent absolutely need to know?
- What can they find in referenced artifacts?
- What context would waste their token budget?

### Maintain Traceability
- Always provide artifact paths for details
- Archive full discussions with clear paths
- Enable reconstruction of decisions if needed

## Common Pitfalls

**Over-Compression:**
- Don't omit critical constraints
- Don't skip key decision rationale
- Don't lose dependency information

**Under-Compression:**
- Don't repeat artifact contents
- Don't include full discussions
- Don't list all rejected options (only critical ones)

**Poor Structure:**
- Don't mix decisions with implementation details
- Don't bury critical info in long paragraphs
- Don't forget to reference artifact paths

## Success Criteria

**Effective Checkpoint:**
- [ ] < 100 lines total
- [ ] 80%+ smaller than original context
- [ ] All decisions captured with brief rationale
- [ ] All artifacts referenced by path
- [ ] Next phase agent can proceed with checkpoint + artifacts only
- [ ] Detailed context archived with clear paths

**Quality Validation:**
- [ ] Developer unfamiliar with phase can understand decisions
- [ ] No need to read full discussion history
- [ ] Critical information not lost
- [ ] Traceable to detailed artifacts

## Integration with Workflows

**In Workflow YAML:**
```yaml
- agent: analyst OR js-solution-architect OR sm
  action: create_checkpoint
  uses: create-checkpoint-summary task
  creates: [phase-name]-checkpoint.md
  notes: "Compact phase context into checkpoint summary. Archive detailed discussions. SAVE to docs/checkpoints/"
```

**Next Phase References:**
```yaml
- agent: [next-agent]
  requires: [phase-name]-checkpoint.md
  notes: "Use checkpoint for context. Reference detailed artifacts as needed."
```

This task ensures long-horizon workflows maintain token efficiency while preserving essential information for downstream agents and future reference.
