# Create Story v3.0 - Greenfield Story Generation

<purpose>
Generate story for net-new features with zero existing implementation.
No codebase scanning—all tasks assumed incomplete (greenfield).
Focused on clear requirements and implementation guidance.
</purpose>

<philosophy>
**Fast Story Generation for New Features**

1. Load PRD, epic, and architecture context
2. Generate clear user story with acceptance criteria
3. All tasks marked incomplete (greenfield assumption)
4. No codebase scanning—saves time for net-new work
5. Ready for immediate implementation
</philosophy>

<config>
name: create-story
version: 3.0.0

task_status:
  incomplete: "[ ]"      # All tasks for greenfield stories

defaults:
  update_sprint_status: true
  create_report: false
</config>

<execution_context>
@patterns/verification.md
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="initialize" priority="first">
**Identify story and load context**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 GREENFIELD STORY GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Ask user for story:**
```
Which story should I create?

Provide:
- Story number (e.g., "1.9" or "1-9")
- OR epic number and story description

Your choice:
```

**Parse input:**
- Extract epic_num, story_num
- Determine story file path

**Load epic context:**
```bash
Read: {{planning_artifacts}}/epics.md
```

Extract:
- Epic business objectives
- Technical constraints
- Dependencies

**Load architecture context (if exists):**
```bash
Read: {{planning_artifacts}}/architecture.md
```

Extract:
- Technical architecture patterns
- Technology stack
- Integration patterns

**Load PRD context:**
```bash
Read: {{planning_artifacts}}/prd.md
```

Extract relevant sections:
- User personas
- Feature requirements
- Non-functional requirements

```
✅ Context Loaded

Story: {{epic_num}}.{{story_num}}
Epic: {{epic_title}}
Architecture: {{architecture_notes}}

[C] Continue to Story Generation
```
</step>

<step name="generate_story">
**Generate greenfield story**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 GENERATING STORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Story structure:**
All tasks marked `[ ]` (incomplete) since this is greenfield.

**Write story file:**
```bash
Write: {{story_dir}}/story-{{epic_num}}.{{story_num}}.md
```

**Story template:**
```markdown
# Story {{epic_num}}.{{story_num}}: {{title}}

## 📊 Metadata
- **Epic**: {{epic_num}} - {{epic_title}}
- **Priority**: {{priority}}
- **Estimate**: {{estimate}}
- **Dependencies**: {{dependencies}}
- **Created**: {{date}}

## 📖 User Story
As a {{persona}}
I want {{capability}}
So that {{benefit}}

## ✅ Acceptance Criteria
1. **{{criterion_1}}**
   - {{detail_1a}}
   - {{detail_1b}}

2. **{{criterion_2}}**
   - {{detail_2a}}
   - {{detail_2b}}

## 🔨 Implementation Tasks
### Frontend
- [ ] {{frontend_task_1}}
- [ ] {{frontend_task_2}}

### Backend
- [ ] {{backend_task_1}}
- [ ] {{backend_task_2}}

### Testing
- [ ] {{testing_task_1}}
- [ ] {{testing_task_2}}

## 📋 Technical Notes
### Architecture
{{architecture_guidance}}

### Dependencies
{{dependency_notes}}

### API Contracts
{{api_contract_notes}}

## 🧪 Testing Strategy
### Unit Tests
{{unit_test_strategy}}

### Integration Tests
{{integration_test_strategy}}

### E2E Tests
{{e2e_test_strategy}}

## 🎯 Definition of Done
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] Product owner acceptance

## 📝 Dev Notes
{{additional_context}}
```

**Validate generated story:**
```bash
# Check 7 sections exist
grep "^## " {{story_file}} | wc -l
# Should be 7 or more

# Check metadata section exists
grep "## 📊 Metadata" {{story_file}}
```
</step>

<step name="update_sprint_status" if="update_sprint_status">
**Update sprint-status.yaml**

```bash
Read: {{sprint_status}}

# Add story to sprint status with "ready-for-dev" status
# Preserve comments and structure

Write: {{sprint_status}}
```
</step>

<step name="final_summary">
**Report completion**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GREENFIELD STORY CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story: {{epic_num}}.{{story_num}} - {{title}}
File: {{story_file}}
Sections: 7/7 ✅

All tasks marked incomplete (greenfield).
Ready for implementation.

Next Steps:
1. Review story for accuracy
2. Use /story-pipeline or /super-dev-pipeline to implement
3. All context loaded and ready

[N] Create next story
[Q] Quit
[R] Review generated story
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If [N]:** Loop back to initialize with next story.
**If [R]:** Display story content, then show menu.
</step>

</process>

<examples>
```bash
# Create new greenfield story
/create-story
> Which story? 20.1

# With explicit story number
/create-story epic=20 story=1
```
</examples>

<failure_handling>
**Epic not found:** HALT with clear error.
**PRD not found:** Warn but continue with available context.
**Architecture doc not found:** Warn but continue with epic context.
**Write fails:** Report error, display generated content.
</failure_handling>

<success_criteria>
- [ ] Epic and PRD context loaded
- [ ] Story generated with all 7+ sections
- [ ] All tasks marked incomplete (greenfield)
- [ ] Story written to correct path
- [ ] Sprint status updated (if enabled)
</success_criteria>
