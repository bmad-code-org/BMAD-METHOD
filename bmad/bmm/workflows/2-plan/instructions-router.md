# PRD Workflow Router Instructions

<workflow>

<critical>This is the INITIAL ASSESSMENT phase - determines which instruction set to load</critical>
<critical>ALWAYS check for existing project-workflow-analysis.md first</critical>
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>

<step n="1" goal="Check for existing analysis or perform new assessment">

<action>Check if {output_folder}/project-workflow-analysis.md exists</action>

<check>If exists:</check>
<action>Load the analysis file</action>
<action>Check for existing workflow outputs based on level in analysis:</action>

- Level 0: Check for tech-spec.md
- Level 1-2: Check for PRD.md, epic-stories.md, tech-spec.md
- Level 3-4: Check for PRD.md, epics.md

<ask>Previous analysis found (Level {{project_level}}).

**Existing documents detected:**
{{list_existing_docs}}

Options:

1. Continue where left off with existing documents
2. Start fresh assessment (will archive existing work)
3. Review and modify previous analysis
   </ask>

<check>If not exists or starting fresh:</check>
<action>Proceed to assessment</action>

</step>

<step n="2" goal="Determine workflow path">

<ask>What type of planning do you need?

**Quick Selection:**

1. Full project planning (PRD, Tech Spec, etc.)
2. UX/UI specification only
3. Tech spec only (for small changes)
4. Generate AI Frontend Prompt from existing specs

Select an option or describe your needs:
</ask>

<check>If "UX/UI specification only":</check>
<action>LOAD: {installed_path}/ux/instructions-ux.md</action>
<action>Pass mode="standalone" to UX instructions</action>
<action>Skip remaining router steps</action>

<check>If "Generate AI Frontend Prompt":</check>
<action>Check for existing UX spec or PRD</action>
<invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>
<action>Exit workflow after prompt generation</action>

<check>If "Tech spec only" or "Full project planning":</check>
<action>Continue to step 3 for project assessment</action>

</step>

<step n="3" goal="Project context assessment" if="not_ux_only">

<ask>Let's understand your project needs:

**1. Project Type:**

1. Game
2. Web application
3. Mobile application
4. Desktop application
5. Backend service/API
6. Library/package
7. Other - Please specify

**2. Project Context:**

a. New project (greenfield)
b. Adding to existing clean codebase
c. Working with messy/legacy code (needs refactoring)

**3. What are you building?** (brief description)
</ask>

<action>Detect if project_type == "game"</action>

<check>If project_type == "game":</check>
<action>Set workflow_type = "gdd"</action>
<action>Skip level classification (GDD workflow handles all game project levels)</action>
<action>Jump to step 5 for GDD-specific assessment</action>

<action>Else, based on their description, analyze and suggest scope level:</action>

Examples:

- "Fix login bug" → Suggests Level 0 (single atomic change)
- "Add OAuth to existing app" → Suggests Level 1 (coherent feature)
- "Build internal admin dashboard" → Suggests Level 2 (small system)
- "Create customer portal with payments" → Suggests Level 3 (full product)
- "Multi-tenant SaaS platform" → Suggests Level 4 (platform)

<ask>Based on your description, this appears to be a **{{suggested_level}}** project.

**3. Quick Scope Guide - Please confirm or adjust:**

1. **Single atomic change** → Bug fix, add endpoint, single file change (Level 0)
2. **Coherent feature** → Add search, implement SSO, new component (Level 1)
3. **Small complete system** → Admin tool, team app, prototype (Level 2)
4. **Full product** → Customer portal, SaaS MVP (Level 3)
5. **Platform/ecosystem** → Enterprise suite, multi-tenant system (Level 4)

**4. Do you have existing documentation?**

1. Product Brief
2. Market Research
3. Technical docs/Architecture
4. None
   </ask>

</step>

<step n="4" goal="Determine project level and workflow path">

<action>Based on responses, determine:</action>

**Level Classification:**

- **Level 0**: Single atomic change → tech-spec only
- **Level 1**: Single feature, 1-10 stories → minimal PRD + tech-spec
- **Level 2**: Small system, 5-15 stories → focused PRD + tech-spec
- **Level 3**: Full product, 12-40 stories → full PRD + architect handoff
- **Level 4**: Platform, 40+ stories → enterprise PRD + architect handoff

<action>For brownfield without docs:</action>

- Levels 0-2: Can proceed with context gathering
- Levels 3-4: MUST run architect assessment first

</step>

<step n="5" goal="Create workflow analysis document">

<action>Initialize analysis using analysis_template from workflow.yaml</action>

<critical>Capture any technical preferences mentioned during assessment</critical>

Generate comprehensive analysis with all assessment data.

<template-output file="project-workflow-analysis.md">project_type</template-output>
<template-output file="project-workflow-analysis.md">project_level</template-output>
<template-output file="project-workflow-analysis.md">instruction_set</template-output>
<template-output file="project-workflow-analysis.md">scope_description</template-output>
<template-output file="project-workflow-analysis.md">story_count</template-output>
<template-output file="project-workflow-analysis.md">epic_count</template-output>
<template-output file="project-workflow-analysis.md">timeline</template-output>
<template-output file="project-workflow-analysis.md">field_type</template-output>
<template-output file="project-workflow-analysis.md">existing_docs</template-output>
<template-output file="project-workflow-analysis.md">team_size</template-output>
<template-output file="project-workflow-analysis.md">deployment_intent</template-output>
<template-output file="project-workflow-analysis.md">expected_outputs</template-output>
<template-output file="project-workflow-analysis.md">workflow_steps</template-output>
<template-output file="project-workflow-analysis.md">next_steps</template-output>
<template-output file="project-workflow-analysis.md">special_notes</template-output>
<template-output file="project-workflow-analysis.md">technical_preferences</template-output>

</step>

<step n="6" goal="Load appropriate instruction set and handle continuation">

<critical>Based on project type and level, load ONLY the needed instructions:</critical>

<check>If workflow_type == "gdd" (Game projects):</check>
<action>LOAD: {installed_path}/gdd/instructions-gdd.md</action>
<check>If continuing:</check>

- Load existing GDD.md if present
- Check which sections are complete
- Resume from last completed section
- GDD workflow handles all game project levels internally

<check>If Level 0:</check>
<action>LOAD: {installed_path}/tech-spec/instructions-sm.md</action>
<check>If continuing:</check>

- Load existing tech-spec.md
- Allow user to review and modify
- Complete any missing sections

<check>If Level 1-2:</check>
<action>LOAD: {installed_path}/prd/instructions-med.md</action>
<check>If continuing:</check>

- Load existing PRD.md if present
- Check which sections are complete
- Resume from last completed section
- If PRD done, show solutioning handoff instructions

<check>If Level 3-4:</check>
<action>LOAD: {installed_path}/prd/instructions-lg.md</action>
<check>If continuing:</check>

- Load existing PRD.md and epics.md
- Identify last completed step (check template variables)
- Resume from incomplete sections
- If all done, show architect handoff instructions

<critical>Pass continuation context to loaded instruction set:</critical>

- continuation_mode: true/false
- last_completed_step: {{step_number}}
- existing_documents: {{document_list}}

<critical>The loaded instruction set should check continuation_mode and adjust accordingly</critical>

</step>

</workflow>
