# Level 1 - Epic and Stories Generation

<workflow>

<critical>This generates epic and user stories for Level 1 projects after tech-spec completion</critical>
<critical>This is a lightweight story breakdown - not a full PRD</critical>
<critical>Level 1 = coherent feature, 1-10 stories (prefer 2-3), 1 epic</critical>
<critical>This workflow runs AFTER tech-spec.md has been completed</critical>
<critical>Story format MUST match create-story template for compatibility with story-context and dev-story workflows</critical>

<step n="1" goal="Load tech spec and extract implementation tasks">

<action>Read the completed tech-spec.md file from {output_folder}/tech-spec.md</action>
<action>Load bmm-workflow-status.yaml from {output_folder}/bmm-workflow-status.yaml (if exists)</action>
<action>Extract dev_ephemeral_location from config (where stories are stored)</action>

<action>Extract from the ENHANCED tech-spec structure:

- Overall feature goal from "The Change → Problem Statement" and "Proposed Solution"
- Implementation tasks from "Implementation Guide → Implementation Steps"
- Time estimates from "Implementation Guide → Implementation Steps"
- Dependencies from "Implementation Details → Integration Points" and "Development Context → Dependencies"
- Source tree from "Implementation Details → Source Tree Changes"
- Framework dependencies from "Development Context → Framework/Libraries"
- Existing code references from "Development Context → Relevant Existing Code"
- File paths from "Developer Resources → File Paths Reference"
- Key code locations from "Developer Resources → Key Code Locations"
- Testing locations from "Developer Resources → Testing Locations"
- Acceptance criteria from "Implementation Guide → Acceptance Criteria"
  </action>

</step>

<step n="2" goal="Create single epic">

<action>Create 1 epic that represents the entire feature</action>
<action>Epic title should be user-facing value statement</action>
<action>Epic goal should describe why this matters to users</action>

<guidelines>
**Epic Best Practices:**
- Title format: User-focused outcome (not implementation detail)
- Good: "JS Library Icon Reliability"
- Bad: "Update recommendedLibraries.ts file"
- Scope: Clearly define what's included/excluded
- Success criteria: Measurable outcomes that define "done"
</guidelines>

<example>
**Epic:** JS Library Icon Reliability

**Goal:** Eliminate external dependencies for JS library icons to ensure consistent, reliable display and improve application performance.

**Scope:** Migrate all 14 recommended JS library icons from third-party CDN URLs (GitHub, jsDelivr) to internal static asset hosting.

**Success Criteria:**

- All library icons load from internal paths
- Zero external requests for library icons
- Icons load 50-200ms faster than baseline
- No broken icons in production
  </example>

<action>Derive epic slug from epic title (kebab-case, 2-3 words max)</action>
<example>

- "JS Library Icon Reliability" → "icon-reliability"
- "OAuth Integration" → "oauth-integration"
- "Admin Dashboard" → "admin-dashboard"
  </example>

<action>Initialize epics.md summary document using epics_template</action>

<action>Also capture project_level for the epic template</action>

<template-output file="{output_folder}/epics.md">project_level</template-output>
<template-output file="{output_folder}/epics.md">epic_title</template-output>
<template-output file="{output_folder}/epics.md">epic_slug</template-output>
<template-output file="{output_folder}/epics.md">epic_goal</template-output>
<template-output file="{output_folder}/epics.md">epic_scope</template-output>
<template-output file="{output_folder}/epics.md">epic_success_criteria</template-output>
<template-output file="{output_folder}/epics.md">epic_dependencies</template-output>

</step>

<step n="3" goal="Determine optimal story count">

<critical>Level 1 should have 2-3 stories maximum - prefer longer stories over more stories</critical>

<action>Analyze tech spec implementation tasks and time estimates</action>
<action>Group related tasks into logical story boundaries</action>

<guidelines>
**Story Count Decision Matrix:**

**2 Stories (preferred for most Level 1):**

- Use when: Feature has clear build/verify split
- Example: Story 1 = Build feature, Story 2 = Test and deploy
- Typical points: 3-5 points per story

**3 Stories (only if necessary):**

- Use when: Feature has distinct setup, build, verify phases
- Example: Story 1 = Setup, Story 2 = Core implementation, Story 3 = Integration and testing
- Typical points: 2-3 points per story

**Never exceed 3 stories for Level 1:**

- If more needed, consider if project should be Level 2
- Better to have longer stories (5 points) than more stories (5x 1-point stories)
  </guidelines>

<action>Determine story_count = 2 or 3 based on tech spec complexity</action>

</step>

<step n="4" goal="Generate user stories from tech spec tasks">

<action>For each story (2-3 total), generate separate story file</action>
<action>Story filename format: "story-{epic_slug}-{n}.md" where n = 1, 2, or 3</action>

<guidelines>
**Story Generation Guidelines:**
- Each story = multiple implementation tasks from tech spec
- Story title format: User-focused deliverable (not implementation steps)
- Include technical acceptance criteria from tech spec tasks
- Link back to tech spec sections for implementation details

**CRITICAL: Acceptance Criteria Must Be:**

1. **Numbered** - AC #1, AC #2, AC #3, etc.
2. **Specific** - No vague statements like "works well" or "is fast"
3. **Testable** - Can be verified objectively
4. **Complete** - Covers all success conditions
5. **Independent** - Each AC tests one thing
6. **Format**: Use Given/When/Then when applicable

**Good AC Examples:**
✅ AC #1: Given a valid email address, when user submits the form, then the account is created and user receives a confirmation email within 30 seconds
✅ AC #2: Given an invalid email format, when user submits, then form displays "Invalid email format" error message
✅ AC #3: All unit tests in UserService.test.ts pass with 100% coverage

**Bad AC Examples:**
❌ "User can create account" (too vague)
❌ "System performs well" (not measurable)
❌ "Works correctly" (not specific)

**Story Point Estimation:**

- 1 point = < 1 day (2-4 hours)
- 2 points = 1-2 days
- 3 points = 2-3 days
- 5 points = 3-5 days

**Level 1 Typical Totals:**

- Total story points: 5-10 points
- 2 stories: 3-5 points each
- 3 stories: 2-3 points each
- If total > 15 points, consider if this should be Level 2

**Story Structure (MUST match create-story format):**

- Status: Draft
- Story: As a [role], I want [capability], so that [benefit]
- Acceptance Criteria: Numbered list from tech spec
- Tasks / Subtasks: Checkboxes mapped to tech spec tasks (AC: #n references)
- Dev Notes: Technical summary, project structure notes, references
- Dev Agent Record: Empty sections (tech-spec provides context)

**NEW: Comprehensive Context Fields**

Since tech-spec is context-rich, populate ALL template fields:

- dependencies: Extract from tech-spec "Development Context → Dependencies" and "Integration Points"
- existing_code_references: Extract from "Development Context → Relevant Existing Code" and "Developer Resources → Key Code Locations"
  </guidelines>

<for-each story="1 to story_count">
  <action>Set story_path_{n} = "{dev_ephemeral_location}/story-{epic_slug}-{n}.md"</action>
  <action>Create story file from user_story_template with the following content:</action>

  <template-output file="{story_path_{n}}">
    - story_title: User-focused deliverable title
    - role: User role (e.g., developer, user, admin)
    - capability: What they want to do
    - benefit: Why it matters
    - acceptance_criteria: Specific, measurable criteria from tech spec
    - tasks_subtasks: Implementation tasks with AC references
    - technical_summary: High-level approach, key decisions
    - files_to_modify: List of files that will change (from tech-spec "Developer Resources → File Paths Reference")
    - test_locations: Where tests will be added (from tech-spec "Developer Resources → Testing Locations")
    - story_points: Estimated effort (1/2/3/5)
    - time_estimate: Days/hours estimate
    - dependencies: Internal/external dependencies (from tech-spec "Development Context" and "Integration Points")
    - existing_code_references: Code to reference (from tech-spec "Development Context → Relevant Existing Code" and "Key Code Locations")
    - architecture_references: Links to tech-spec.md sections
  </template-output>
</for-each>

<critical>Generate exactly {story_count} story files (2 or 3 based on Step 3 decision)</critical>

</step>

<step n="5" goal="Create story map and implementation sequence with dependency validation">

<critical>Stories MUST be ordered so earlier stories don't depend on later ones</critical>
<critical>Each story must have CLEAR, TESTABLE acceptance criteria</critical>

<action>Analyze dependencies between stories:

**Dependency Rules:**

1. Infrastructure/setup → Feature implementation → Testing/polish
2. Database changes → API changes → UI changes
3. Backend services → Frontend components
4. Core functionality → Enhancement features
5. No story can depend on a later story!

**Validate Story Sequence:**
For each story N, check:

- Does it require anything from Story N+1, N+2, etc.? ❌ INVALID
- Does it only use things from Story 1...N-1? ✅ VALID
- Can it be implemented independently or using only prior stories? ✅ VALID

If invalid dependencies found, REORDER stories!
</action>

<action>Generate visual story map showing epic → stories hierarchy with dependencies</action>
<action>Calculate total story points across all stories</action>
<action>Estimate timeline based on total points (1-2 points per day typical)</action>
<action>Define implementation sequence with explicit dependency notes</action>

<example>
## Story Map

```
Epic: Icon Reliability
├── Story 1: Build Icon Infrastructure (3 points)
│   Dependencies: None (foundational work)
│
└── Story 2: Test and Deploy Icons (2 points)
    Dependencies: Story 1 (requires infrastructure)
```

**Total Story Points:** 5
**Estimated Timeline:** 1 sprint (1 week)

## Implementation Sequence

1. **Story 1** → Build icon infrastructure (setup, download, configure)
   - Dependencies: None
   - Deliverable: Icon files downloaded, organized, accessible

2. **Story 2** → Test and deploy (depends on Story 1)
   - Dependencies: Story 1 must be complete
   - Deliverable: Icons verified, tested, deployed to production

**Dependency Validation:** ✅ Valid sequence - no forward dependencies
</example>

<template-output file="{output_folder}/epics.md">story_summaries</template-output>
<template-output file="{output_folder}/epics.md">story_map</template-output>
<template-output file="{output_folder}/epics.md">total_points</template-output>
<template-output file="{output_folder}/epics.md">estimated_timeline</template-output>
<template-output file="{output_folder}/epics.md">implementation_sequence</template-output>

</step>

<step n="6" goal="Update status and populate story backlog">

<invoke-workflow path="{project-root}/.bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_workflow</param>
  <param>workflow_name: tech-spec</param>
  <param>populate_stories_from: {epics_output_file}</param>
</invoke-workflow>

<check if="success == true">
  <output>✅ Status updated! Loaded {{total_stories}} stories from epics.</output>
  <output>Next: {{next_workflow}} ({{next_agent}} agent)</output>
</check>

<check if="success == false">
  <output>⚠️ Status update failed: {{error}}</output>
</check>

</step>

<step n="7" goal="Auto-validate story quality and sequence">

<critical>Auto-run validation - NOT optional!</critical>

<action>Running automatic story validation...</action>

<action>**Validate Story Sequence (CRITICAL):**

For each story, check:

1. Does Story N depend on Story N+1 or later? ❌ FAIL - Reorder required!
2. Are dependencies clearly documented? ✅ PASS
3. Can stories be implemented in order 1→2→3? ✅ PASS

If sequence validation FAILS:

- Identify the problem dependencies
- Propose new ordering
- Ask user to confirm reordering
  </action>

<action>**Validate Acceptance Criteria Quality:**

For each story's AC, check:

1. Is it numbered (AC #1, AC #2, etc.)? ✅ Required
2. Is it specific and testable? ✅ Required
3. Does it use Given/When/Then or equivalent? ✅ Recommended
4. Are all success conditions covered? ✅ Required

Count vague AC (contains "works", "good", "fast", "well"):

- 0 vague AC: ✅ EXCELLENT
- 1-2 vague AC: ⚠️ WARNING - Should improve
- 3+ vague AC: ❌ FAIL - Must improve
  </action>

<action>**Validate Story Completeness:**

1. Do all stories map to tech spec tasks? ✅ Required
2. Do story points align with tech spec estimates? ✅ Recommended
3. Are dependencies clearly noted? ✅ Required
4. Does each story have testable AC? ✅ Required
   </action>

<action>Generate validation report</action>

<check if="sequence validation fails OR AC quality fails">
  <output>❌ **Story Validation Failed:**

{{issues_found}}

**Recommended Fixes:**
{{recommended_fixes}}

Shall I fix these issues? (yes/no)</output>

<ask>Apply fixes? (yes/no)</ask>

  <check if="yes">
    <action>Apply fixes (reorder stories, rewrite vague AC, add missing details)</action>
    <action>Re-validate</action>
    <output>✅ Validation passed after fixes!</output>
  </check>
</check>

<check if="validation passes">
  <output>✅ **Story Validation Passed!**

**Sequence:** ✅ Valid (no forward dependencies)
**AC Quality:** ✅ All specific and testable
**Completeness:** ✅ All tech spec tasks covered
**Dependencies:** ✅ Clearly documented

Stories are implementation-ready!</output>
</check>

</step>

<step n="8" goal="Finalize and provide user guidance">

<action>Confirm all validation passed</action>
<action>Verify total story points align with tech spec time estimates</action>
<action>Confirm epic and stories are complete</action>

**Level 1 Planning Complete!**

**Epic:** {{epic_title}}
**Total Stories:** {{story_count}}
**Total Story Points:** {{total_points}}
**Estimated Timeline:** {{estimated_timeline}}

**Generated Artifacts:**

- `tech-spec.md` → Technical source of truth
- `epics.md` → Epic and story summary
- `story-{epic_slug}-1.md` → First story (ready for implementation)
- `story-{epic_slug}-2.md` → Second story
  {{#if story_3}}
- `story-{epic_slug}-3.md` → Third story
  {{/if}}

**Story Location:** `{dev_ephemeral_location}/`

**Next Steps - Iterative Implementation:**

**🎯 RECOMMENDED - Direct to Development (Level 1):**

Since the tech-spec is now CONTEXT-RICH with:

- ✅ Brownfield codebase analysis (if applicable)
- ✅ Framework and library details with exact versions
- ✅ Existing patterns and code references
- ✅ Complete file paths and integration points
- ✅ Dependencies clearly mapped

**You can skip story-context for most Level 1 stories!**

**1. Start with Story 1:**
a. Load DEV agent: `{project-root}/.bmad/bmm/agents/dev.md`
b. Run `dev-story` workflow (select story-{epic_slug}-1.md)
c. Tech-spec provides all context needed
d. Implement story 1

**2. After Story 1 Complete:**

- Repeat for story-{epic_slug}-2.md
- Reference completed story 1 in your work

**3. After Story 2 Complete:**
{{#if story_3}}

- Repeat for story-{epic_slug}-3.md
  {{/if}}
- Level 1 feature complete!

**Option B - Generate Additional Context (optional):**

Only needed for extremely complex multi-story dependencies:

1. Load SM agent: `{project-root}/.bmad/bmm/agents/sm.md`
2. Run `story-context` workflow for complex stories
3. Then load DEV agent and run `dev-story`

**Progress Tracking:**

- All decisions logged in: `bmm-workflow-status.yaml`
- Next action clearly identified

<ask>Ready to proceed? Choose your path:

1. Go directly to dev-story for story 1 (RECOMMENDED - tech-spec has all context)
2. Generate additional story context first (for complex dependencies)
3. Exit for now

Select option (1-3):</ask>

</step>

</workflow>
