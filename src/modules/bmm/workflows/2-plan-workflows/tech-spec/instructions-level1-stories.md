# Level 1 - Epic and Stories Generation

<workflow>

<critical>This generates epic and user stories for Level 1 projects after tech-spec completion</critical>
<critical>This is a lightweight story breakdown - not a full PRD</critical>
<critical>Level 1 = coherent feature, 1-10 stories (prefer 2-3), 1 epic</critical>
<critical>This workflow runs AFTER tech-spec.md has been completed</critical>
<critical>Story format MUST match create-story template for compatibility with story-context and dev-story workflows</critical>

<step n="1" goal="Load tech spec and extract implementation tasks">

<action>Read the completed tech-spec.md file from {output_folder}/tech-spec.md</action>
<action>Load bmm-workflow-status.md from {output_folder}/bmm-workflow-status.md</action>
<action>Extract dev_story_location from config (where stories are stored)</action>
<action>Identify all implementation tasks from the "Implementation Guide" section</action>
<action>Identify the overall feature goal from "Technical Approach" section</action>
<action>Extract time estimates for each implementation phase</action>
<action>Identify any dependencies between implementation tasks</action>

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
- Dev Agent Record: Empty sections for context workflow to populate
  </guidelines>

<for-each story="1 to story_count">
  <action>Set story_path_{n} = "{dev_story_location}/story-{epic_slug}-{n}.md"</action>
  <action>Create story file from user_story_template with the following content:</action>

  <template-output file="{story_path_{n}}">
    - story_title: User-focused deliverable title
    - role: User role (e.g., developer, user, admin)
    - capability: What they want to do
    - benefit: Why it matters
    - acceptance_criteria: Specific, measurable criteria from tech spec
    - tasks_subtasks: Implementation tasks with AC references
    - technical_summary: High-level approach, key decisions
    - files_to_modify: List of files that will change
    - test_locations: Where tests will be added
    - story_points: Estimated effort (1/2/3/5)
    - time_estimate: Days/hours estimate
    - architecture_references: Links to tech-spec.md sections
  </template-output>
</for-each>

<critical>Generate exactly {story_count} story files (2 or 3 based on Step 3 decision)</critical>

</step>

<step n="5" goal="Create story map and implementation sequence">

<action>Generate visual story map showing epic → stories hierarchy</action>
<action>Calculate total story points across all stories</action>
<action>Estimate timeline based on total points (1-2 points per day typical)</action>
<action>Define implementation sequence considering dependencies</action>

<example>
## Story Map

```
Epic: Icon Reliability
├── Story 1: Build Icon Infrastructure (3 points)
└── Story 2: Test and Deploy Icons (2 points)
```

**Total Story Points:** 5
**Estimated Timeline:** 1 sprint (1 week)

## Implementation Sequence

1. **Story 1** → Build icon infrastructure (setup, download, configure)
2. **Story 2** → Test and deploy (depends on Story 1)
   </example>

<template-output file="{output_folder}/epics.md">story_summaries</template-output>
<template-output file="{output_folder}/epics.md">story_map</template-output>
<template-output file="{output_folder}/epics.md">total_points</template-output>
<template-output file="{output_folder}/epics.md">estimated_timeline</template-output>
<template-output file="{output_folder}/epics.md">implementation_sequence</template-output>

</step>

<step n="6" goal="Update status and populate story backlog">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
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

<step n="7" goal="Finalize and provide user guidance">

<action>Confirm all stories map to tech spec implementation tasks</action>
<action>Verify total story points align with tech spec time estimates</action>
<action>Verify stories are properly sequenced with dependencies noted</action>
<action>Confirm all stories have measurable acceptance criteria</action>

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

**Story Location:** `{dev_story_location}/`

**Next Steps - Iterative Implementation:**

**1. Start with Story 1:**
a. Load SM agent: `{project-root}/bmad/bmm/agents/sm.md`
b. Run story-context workflow (select story-{epic_slug}-1.md)
c. Load DEV agent: `{project-root}/bmad/bmm/agents/dev.md`
d. Run dev-story workflow to implement story 1

**2. After Story 1 Complete:**

- Repeat process for story-{epic_slug}-2.md
- Story context will auto-reference completed story 1

**3. After Story 2 Complete:**
{{#if story_3}}

- Repeat process for story-{epic_slug}-3.md
  {{/if}}
- Level 1 feature complete!

**Progress Tracking:**

- All decisions logged in: `bmm-workflow-status.md`
- Next action clearly identified

<ask>Ready to proceed? Choose your path:

1. Generate context for story 1 (recommended - run story-context)
2. Go directly to dev-story for story 1 (faster)
3. Exit for now

Select option (1-3):</ask>

</step>

</workflow>
