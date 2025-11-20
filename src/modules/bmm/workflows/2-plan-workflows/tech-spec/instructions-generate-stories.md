# Unified Epic and Story Generation

<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<workflow>

<critical>This generates epic + stories for ALL quick-flow projects</critical>
<critical>Always generates: epics.md + story files (1-5 stories based on {{story_count}})</critical>
<critical>Runs AFTER tech-spec.md completion</critical>
<critical>Story format MUST match create-story template for compatibility with story-context and dev-story workflows</critical>

<step n="1" goal="Load tech spec and extract implementation context">

<action>Read the completed tech-spec.md file from {default_output_file}</action>
<action>Load bmm-workflow-status.yaml from {workflow-status} (if exists)</action>
<action>Get story_count from workflow variables (1-5)</action>
<action>Ensure {sprint_artifacts} directory exists</action>

<action>Extract from tech-spec structure:

**From "The Change" section:**

- Problem statement and solution overview
- Scope (in/out)

**From "Implementation Details" section:**

- Source tree changes
- Technical approach
- Integration points

**From "Implementation Guide" section:**

- Implementation steps
- Testing strategy
- Acceptance criteria
- Time estimates

**From "Development Context" section:**

- Framework dependencies with versions
- Existing code references
- Internal dependencies

**From "Developer Resources" section:**

- File paths
- Key code locations
- Testing locations

Use this rich context to generate comprehensive, implementation-ready epic and stories.
</action>

</step>

<step n="2" goal="Generate epic slug and structure">

<action>Create epic based on the overall feature/change from tech-spec</action>

<action>Derive epic slug from the feature name:

- Use 2-3 words max
- Kebab-case format
- User-focused, not implementation-focused

Examples:

- "OAuth Integration" → "oauth-integration"
- "Fix Login Bug" → "login-fix"
- "User Profile Page" → "user-profile"
  </action>

<action>Store as {{epic_slug}} - this will be used for all story filenames</action>

<action>Adapt epic detail to story count:

**For single story (story_count == 1):**

- Epic is minimal - just enough structure
- Goal: Brief statement of what's being accomplished
- Scope: High-level boundary
- Success criteria: Core outcomes

**For multiple stories (story_count > 1):**

- Epic is detailed - full breakdown
- Goal: Comprehensive purpose and value statement
- Scope: Clear boundaries with in/out examples
- Success criteria: Measurable, testable outcomes
- Story map: Visual representation of epic → stories
- Implementation sequence: Logical ordering with dependencies
  </action>

</step>

<step n="3" goal="Generate epic document">

<action>Initialize {epics_file} using {epics_template}</action>

<action>Populate epic metadata from tech-spec context:

**Epic Title:** User-facing outcome (not implementation detail)

- Good: "OAuth Integration", "Login Bug Fix", "Icon Reliability"
- Bad: "Update recommendedLibraries.ts", "Refactor auth service"

**Epic Goal:** Why this matters to users/business

**Epic Scope:** Clear boundaries from tech-spec scope section

**Epic Success Criteria:** Measurable outcomes from tech-spec acceptance criteria

**Dependencies:** From tech-spec integration points and dependencies
</action>

<template-output file="{epics_file}">project_name</template-output>
<template-output file="{epics_file}">date</template-output>
<template-output file="{epics_file}">epic_title</template-output>
<template-output file="{epics_file}">epic_slug</template-output>
<template-output file="{epics_file}">epic_goal</template-output>
<template-output file="{epics_file}">epic_scope</template-output>
<template-output file="{epics_file}">epic_success_criteria</template-output>
<template-output file="{epics_file}">epic_dependencies</template-output>

</step>

<step n="4" goal="Intelligently break down into stories">

<action>Analyze tech-spec implementation steps and create story breakdown

**For story_count == 1:**

- Create single comprehensive story covering all implementation
- Title: Focused on the deliverable outcome
- Tasks: Map directly to tech-spec implementation steps
- Estimated points: Typically 1-5 points

**For story_count > 1:**

- Break implementation into logical story boundaries
- Each story must be:
  - Independently valuable (delivers working functionality)
  - Testable (has clear acceptance criteria)
  - Sequentially ordered (no forward dependencies)
  - Right-sized (prefer 2-4 stories over many tiny ones)

**Story Sequencing Rules (CRITICAL):**

1. Foundation → Build → Test → Polish
2. Database → API → UI
3. Backend → Frontend
4. Core → Enhancement
5. NO story can depend on a later story!

Validate sequence: Each story N should only depend on stories 1...N-1
</action>

<action>For each story position (1 to {{story_count}}):

1. **Determine story scope from tech-spec tasks**
   - Group related implementation steps
   - Ensure story leaves system in working state

2. **Create story title**
   - User-focused deliverable
   - Active, clear language
   - Good: "OAuth Backend Integration", "OAuth UI Components"
   - Bad: "Write some OAuth code", "Update files"

3. **Extract acceptance criteria**
   - From tech-spec testing strategy and acceptance criteria
   - Must be numbered (AC #1, AC #2, etc.)
   - Must be specific and testable
   - Use Given/When/Then format when applicable

4. **Map tasks to implementation steps**
   - Break down tech-spec implementation steps for this story
   - Create checkbox list
   - Reference AC numbers: (AC: #1), (AC: #2)

5. **Estimate story points**
   - 1 point = < 1 day (2-4 hours)
   - 2 points = 1-2 days
   - 3 points = 2-3 days
   - 5 points = 3-5 days
   - Total across all stories should align with tech-spec estimates
     </action>

</step>

<step n="5" goal="Generate story files">

<for-each story="1 to story_count">
  <action>Set story_filename = "story-{{epic_slug}}-{{n}}.md"</action>
  <action>Set story_path = "{sprint_artifacts}/{{story_filename}}"</action>

<action>Create story file using {user_story_template}</action>

<action>Populate story with:

**Story Header:**

- N.M format (where N is always 1 for quick-flow, M is story number)
- Title: User-focused deliverable
- Status: Draft

**User Story:**

- As a [role] (developer, user, admin, system, etc.)
- I want [capability/change]
- So that [benefit/value]

**Acceptance Criteria:**

- Numbered list (AC #1, AC #2, ...)
- Specific, measurable, testable
- Derived from tech-spec testing strategy and acceptance criteria
- Cover all success conditions for this story

**Tasks/Subtasks:**

- Checkbox list mapped to tech-spec implementation steps
- Each task references AC numbers: (AC: #1)
- Include explicit testing tasks

**Technical Summary:**

- High-level approach for this story
- Key technical decisions
- Files/modules involved

**Project Structure Notes:**

- files_to_modify: From tech-spec "Developer Resources → File Paths"
- test_locations: From tech-spec "Developer Resources → Testing Locations"
- story_points: Estimated effort
- dependencies: Prerequisites (other stories, systems, data)

**Key Code References:**

- From tech-spec "Development Context → Relevant Existing Code"
- From tech-spec "Developer Resources → Key Code Locations"
- Specific file:line references when available

**Context References:**

- Link to tech-spec.md (primary context document)
- Note: Tech-spec contains brownfield analysis, framework versions, patterns, etc.

**Dev Agent Record:**

- Empty sections (populated during dev-story execution)
- Agent Model Used
- Debug Log References
- Completion Notes
- Files Modified
- Test Results

**Review Notes:**

- Empty section (populated during code review)
  </action>

<template-output file="{{story_path}}">story_number</template-output>
<template-output file="{{story_path}}">story_title</template-output>
<template-output file="{{story_path}}">user_role</template-output>
<template-output file="{{story_path}}">capability</template-output>
<template-output file="{{story_path}}">benefit</template-output>
<template-output file="{{story_path}}">acceptance_criteria</template-output>
<template-output file="{{story_path}}">tasks_subtasks</template-output>
<template-output file="{{story_path}}">technical_summary</template-output>
<template-output file="{{story_path}}">files_to_modify</template-output>
<template-output file="{{story_path}}">test_locations</template-output>
<template-output file="{{story_path}}">story_points</template-output>
<template-output file="{{story_path}}">time_estimate</template-output>
<template-output file="{{story_path}}">dependencies</template-output>
<template-output file="{{story_path}}">existing_code_references</template-output>
</for-each>

</step>

<step n="6" goal="Generate story map and finalize epic" if="story_count > 1">

<action>Create visual story map showing epic → stories hierarchy

Include:

- Epic title at top
- Stories listed with point estimates
- Dependencies noted
- Sequence validation confirmation

Example:

```
Epic: OAuth Integration (8 points)
├── Story 1.1: OAuth Backend (3 points)
│   Dependencies: None
│
├── Story 1.2: OAuth UI Components (3 points)
│   Dependencies: Story 1.1
│
└── Story 1.3: OAuth Testing & Polish (2 points)
    Dependencies: Stories 1.1, 1.2
```

</action>

<action>Calculate totals:

- Total story points across all stories
- Estimated timeline (typically 1-2 points per day)
  </action>

<action>Append to {epics_file}:

- Story summaries
- Story map visual
- Implementation sequence
- Total points and timeline
  </action>

<template-output file="{epics_file}">story_map</template-output>
<template-output file="{epics_file}">story_summaries</template-output>
<template-output file="{epics_file}">total_points</template-output>
<template-output file="{epics_file}">estimated_timeline</template-output>
<template-output file="{epics_file}">implementation_sequence</template-output>

</step>

<step n="7" goal="Validate story quality">

<critical>Always run validation - NOT optional!</critical>

<action>Validate all stories against quality standards:

**Story Sequence Validation (CRITICAL):**

- For each story N, verify it doesn't depend on story N+1 or later
- Check: Can stories be implemented in order 1→2→3→...?
- If sequence invalid: Identify problem, propose reordering, ask user to confirm

**Acceptance Criteria Quality:**

- All AC are numbered (AC #1, AC #2, ...)
- Each AC is specific and testable (no "works well", "is good", "performs fast")
- AC use Given/When/Then or equivalent structure
- All success conditions are covered

**Story Completeness:**

- All stories map to tech-spec implementation steps
- Story points align with tech-spec time estimates
- Dependencies are clearly documented
- Each story has testable AC
- Files and locations reference tech-spec developer resources

**Template Compliance:**

- All required sections present
- Dev Agent Record sections exist (even if empty)
- Context references link to tech-spec.md
- Story numbering follows N.M format
  </action>

<check if="validation issues found">
  <output>⚠️ **Story Validation Issues:**

{{issues_list}}

**Recommended Fixes:**
{{fixes}}

Shall I fix these automatically? (yes/no)</output>

<ask>Apply fixes? (yes/no)</ask>

  <check if="yes">
    <action>Apply fixes (reorder stories, rewrite vague AC, add missing details)</action>
    <action>Re-validate</action>
    <output>✅ Validation passed after fixes!</output>
  </check>
</check>

<check if="validation passes">
  <output>✅ **Story Validation Passed!**

**Quality Scores:**

- Sequence: ✅ Valid (no forward dependencies)
- AC Quality: ✅ All specific and testable
- Completeness: ✅ All tech spec tasks covered
- Template Compliance: ✅ All sections present

Stories are implementation-ready!</output>
</check>

</step>

<step n="8" goal="Update workflow status and finalize">

<action>Update bmm-workflow-status.yaml (if exists):

- Mark tech-spec as complete
- Initialize story sequence tracking
- Set first story as TODO
- Track epic slug and story count
  </action>

<output>**✅ Epic and Stories Generated!**

**Epic:** {{epic_title}} ({{epic_slug}})
**Total Stories:** {{story_count}}
{{#if story_count > 1}}**Total Points:** {{total_points}}
**Estimated Timeline:** {{estimated_timeline}}{{/if}}

**Files Created:**

- `{epics_file}` - Epic structure{{#if story_count == 1}} (minimal){{/if}}
- `{sprint_artifacts}/story-{{epic_slug}}-1.md`{{#if story_count > 1}}
- `{sprint_artifacts}/story-{{epic_slug}}-2.md`{{/if}}{{#if story_count > 2}}
- Through story-{{epic_slug}}-{{story_count}}.md{{/if}}

**What's Next:**
All stories reference tech-spec.md as primary context. You can proceed directly to development with the DEV agent!

Story files are ready for:

- Direct implementation (dev-story workflow)
- Optional context generation (story-context workflow for complex cases)
- Sprint planning organization (sprint-planning workflow for multi-story coordination)
  </output>

</step>

</workflow>
