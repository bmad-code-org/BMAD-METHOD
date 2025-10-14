# Level 0 - Minimal User Story Generation

<workflow>

<critical>This generates a single user story for Level 0 atomic changes</critical>
<critical>Level 0 = single file change, bug fix, or small isolated task</critical>
<critical>This workflow runs AFTER tech-spec.md has been completed</critical>
<critical>Output format MUST match create-story template for compatibility with story-context and dev-story workflows</critical>

<step n="1" goal="Load tech spec and extract the change">

<action>Read the completed tech-spec.md file from {output_folder}/tech-spec.md</action>
<action>Load bmm-workflow-status.md from {output_folder}/bmm-workflow-status.md</action>
<action>Extract dev_story_location from config (where stories are stored)</action>
<action>Extract the problem statement from "Technical Approach" section</action>
<action>Extract the scope from "Source Tree Structure" section</action>
<action>Extract time estimate from "Implementation Guide" or technical details</action>
<action>Extract acceptance criteria from "Testing Approach" section</action>

</step>

<step n="2" goal="Generate story slug and filename">

<action>Derive a short URL-friendly slug from the feature/change name</action>
<action>Max slug length: 3-5 words, kebab-case format</action>

<example>
- "Migrate JS Library Icons" → "icon-migration"
- "Fix Login Validation Bug" → "login-fix"
- "Add OAuth Integration" → "oauth-integration"
</example>

<action>Set story_filename = "story-{slug}.md"</action>
<action>Set story_path = "{dev_story_location}/story-{slug}.md"</action>

</step>

<step n="3" goal="Create user story in standard format">

<action>Create 1 story that describes the technical change as a deliverable</action>
<action>Story MUST use create-story template format for compatibility</action>

<guidelines>
**Story Point Estimation:**
- 1 point = < 1 day (2-4 hours)
- 2 points = 1-2 days
- 3 points = 2-3 days
- 5 points = 3-5 days (if this high, question if truly Level 0)

**Story Title Best Practices:**

- Use active, user-focused language
- Describe WHAT is delivered, not HOW
- Good: "Icon Migration to Internal CDN"
- Bad: "Run curl commands to download PNGs"

**Story Description Format:**

- As a [role] (developer, user, admin, etc.)
- I want [capability/change]
- So that [benefit/value]

**Acceptance Criteria:**

- Extract from tech-spec "Testing Approach" section
- Must be specific, measurable, and testable
- Include performance criteria if specified

**Tasks/Subtasks:**

- Map directly to tech-spec "Implementation Guide" tasks
- Use checkboxes for tracking
- Reference AC numbers: (AC: #1), (AC: #2)
- Include explicit testing subtasks

**Dev Notes:**

- Extract technical constraints from tech-spec
- Include file paths from "Source Tree Structure"
- Reference architecture patterns if applicable
- Cite tech-spec sections for implementation details
  </guidelines>

<action>Initialize story file using user_story_template</action>

<template-output file="{story_path}">story_title</template-output>
<template-output file="{story_path}">role</template-output>
<template-output file="{story_path}">capability</template-output>
<template-output file="{story_path}">benefit</template-output>
<template-output file="{story_path}">acceptance_criteria</template-output>
<template-output file="{story_path}">tasks_subtasks</template-output>
<template-output file="{story_path}">technical_summary</template-output>
<template-output file="{story_path}">files_to_modify</template-output>
<template-output file="{story_path}">test_locations</template-output>
<template-output file="{story_path}">story_points</template-output>
<template-output file="{story_path}">time_estimate</template-output>
<template-output file="{story_path}">architecture_references</template-output>

</step>

<step n="4" goal="Update bmm-workflow-status and initialize Phase 4">

<action>Open {output_folder}/bmm-workflow-status.md</action>

<action>Update "Workflow Status Tracker" section:</action>

- Set current_phase = "4-Implementation" (Level 0 skips Phase 3)
- Set current_workflow = "tech-spec (Level 0 - story generation complete, ready for implementation)"
- Check "2-Plan" checkbox in Phase Completion Status
- Set progress_percentage = 40% (planning complete, skipping solutioning)

<action>Initialize Phase 4 Implementation Progress section:</action>

#### BACKLOG (Not Yet Drafted)

**Ordered story sequence - populated at Phase 4 start:**

| Epic                               | Story | ID  | Title | File |
| ---------------------------------- | ----- | --- | ----- | ---- |
| (empty - Level 0 has only 1 story) |       |     |       |      |

**Total in backlog:** 0 stories

**NOTE:** Level 0 has single story only. No additional stories in backlog.

#### TODO (Needs Drafting)

Initialize with the ONLY story (already drafted):

- **Story ID:** {slug}
- **Story Title:** {{story_title}}
- **Story File:** `story-{slug}.md`
- **Status:** Draft (needs review before development)
- **Action:** User reviews drafted story, then runs SM agent `story-ready` workflow to approve

#### IN PROGRESS (Approved for Development)

Leave empty initially:

(Story will be moved here by SM agent `story-ready` workflow after user approves story-{slug}.md)

#### DONE (Completed Stories)

Initialize empty table:

| Story ID   | File | Completed Date | Points |
| ---------- | ---- | -------------- | ------ |
| (none yet) |      |                |        |

**Total completed:** 0 stories
**Total points completed:** 0 points

<action>Add to Artifacts Generated table:</action>

```
| tech-spec.md | Complete | {output_folder}/tech-spec.md | {{date}} |
| story-{slug}.md | Draft | {dev_story_location}/story-{slug}.md | {{date}} |
```

<action>Update "Next Action Required":</action>

```
**What to do next:** Review drafted story-{slug}.md, then mark it ready for development

**Command to run:** Load SM agent and run 'story-ready' workflow (confirms story-{slug}.md is ready)

**Agent to load:** bmad/bmm/agents/sm.md
```

<action>Add to Decision Log:</action>

```
- **{{date}}**: Level 0 tech-spec and story generation completed. Skipping Phase 3 (solutioning) - moving directly to Phase 4 (implementation). Single story (story-{slug}.md) drafted and ready for review.
```

<action>Save bmm-workflow-status.md</action>

</step>

<step n="5" goal="Provide user guidance for next steps">

<action>Display completion summary</action>

**Level 0 Planning Complete!**

**Generated Artifacts:**

- `tech-spec.md` → Technical source of truth
- `story-{slug}.md` → User story ready for implementation

**Story Location:** `{story_path}`

**Next Steps (choose one path):**

**Option A - Full Context (Recommended for complex changes):**

1. Load SM agent: `{project-root}/bmad/bmm/agents/sm.md`
2. Run story-context workflow
3. Then load DEV agent and run dev-story workflow

**Option B - Direct to Dev (For simple, well-understood changes):**

1. Load DEV agent: `{project-root}/bmad/bmm/agents/dev.md`
2. Run dev-story workflow (will auto-discover story)
3. Begin implementation

**Progress Tracking:**

- All decisions logged in: `bmm-workflow-status.md`
- Next action clearly identified

<ask>Ready to proceed? Choose your path:

1. Generate story context (Option A - recommended)
2. Go directly to dev-story implementation (Option B - faster)
3. Exit for now

Select option (1-3):</ask>

</step>

</workflow>
