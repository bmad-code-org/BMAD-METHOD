# Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow handles BOTH new projects AND legacy projects being migrated to BMad Method</critical>

<workflow>

<step n="1" goal="Comprehensive scan for existing work and project state">
<output>Welcome to BMad Method, {user_name}!</output>

<action>Perform comprehensive scan for ALL existing work (not just quick scan):

**Check for BMM planning artifacts:**

- PRD files: {output*folder}/\_prd*.md or {output*folder}/\_prd*/index.md
- Tech-spec files: {output*folder}/\_tech-spec*.md or {output*folder}/\_spec*.md
- Epic files: {output*folder}/\_epic*.md or {output*folder}/\_epic*/index.md
- Architecture: {output*folder}/\_architecture*.md or {output*folder}/\_arch*.md
- UX Design: {output*folder}/\_ux*.md or {output*folder}/\_design*.md
- Product Brief: {output_folder}/\*brief\*.md
- Research docs: {output_folder}/\*research\*.md
- Brainstorm docs: {output_folder}/\*brainstorm\*.md

**Check for implementation artifacts:**

- The following could be in or nested under {output_folder} OR {sprint_artifacts} - CHECK BOTH LOCATIONS
  - Story files: {output_folder}/stories/*.md or \*\*/stories/*story\*.md
  - Sprint status: {output_folder}/sprint-status.yaml or {sprint_artifacts}/sprint-status.yaml
  - Existing workflow status: {default_output_file} or {sprint_artifacts}/bmm-workflow-status.yaml

**Check for codebase:**

- Source code directories: src/, lib/, app/, components/, etc.
- Package files: package.json, requirements.txt, Cargo.toml, go.mod, pom.xml, etc.
- Git repository: .git/
- Framework indicators: next.config.js, vite.config.js, etc.
  </action>

<action>Analyze findings and categorize project state:

- **STATE 1:** Clean slate (no artifacts, no code or scaffold only)
- **STATE 2:** Planning in progress (has PRD or tech-spec, no stories/implementation yet)
- **STATE 3:** Implementation in progress (has stories or sprint status)
- **STATE 4:** Legacy codebase (has code but no BMM artifacts)
- **STATE 5:** Partial/unclear (some artifacts, state unclear)
  </action>

<ask>What's your project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}</ask>
<action>Store project_name</action>
<template-output>project_name</template-output>
</step>

<step n="2" goal="Validate project state with user">

<check if="STATE 1: Clean slate">
  <output>Perfect! This looks like a fresh start.</output>
  <action>Set new_project = true</action>
  <action>Continue to Step 3 (ask about their work)</action>
</check>

<check if="STATE 2: Planning artifacts found">
  <output>I found existing planning documents:

{{#if found_prd}}
📋 **PRD:** {{prd_path}}
{{#if epic_count}}- {{epic_count}} epics, {{story_count}} stories{{/if}}

- Last modified: {{prd_modified}}
  {{/if}}

{{#if found_tech_spec}}
📋 **Tech-Spec:** {{spec_path}}
{{#if story_count}}- {{story_count}} stories{{/if}}

- Last modified: {{spec_modified}}
  {{/if}}

{{#if found_architecture}}
🏗️ **Architecture:** {{arch_path}}

- Last modified: {{arch_modified}}
  {{/if}}

{{#if found_ux}}
🎨 **UX Design:** {{ux_path}}

- Last modified: {{ux_modified}}
  {{/if}}

{{#if found_brief}}
📄 **Product Brief:** {{brief_path}}

- Last modified: {{brief_modified}}
  {{/if}}

{{#if found_research}}
🔍 **Research:** {{research_paths}}
{{/if}}

{{#if found_brainstorm}}
🧠 **Brainstorm:** {{brainstorm_paths}}
{{/if}}
</output>

<ask>What's your situation with these documents?

a) **Continue this work** - These docs describe what I'm building now
b) **Override/replace** - These are old, I'm starting something NEW
c) **Already done** - This work is complete, I'm starting a NEW project
d) **Not sure** - Let me explain my situation

Your choice [a/b/c/d]:</ask>

  <check if="choice == a (Continue)">
    <output>Got it! I'll create workflow tracking for your existing planning.</output>
    <action>Set continuing_existing_planning = true</action>
    <action>Store found artifacts for auto-completion in workflow status</action>
    <action>Continue to Step 5 (detect track from artifacts)</action>
  </check>

  <check if="choice == b (Override)">
    <ask>Should I archive these old documents before we start fresh?

I can move them to {output_folder}/archive/ so they're not in the way.

Archive old docs? (y/n)</ask>

    <action if="answer == y">Create archive folder if needed</action>
    <action if="answer == y">Move all found planning artifacts to {output_folder}/archive/</action>
    <output>{{#if archived}}✅ Old documents archived to {output_folder}/archive/{{else}}Starting fresh - old docs will be ignored{{/if}}</output>
    <action>Set new_project = true</action>
    <action>Continue to Step 3 (ask about their work)</action>

  </check>

  <check if="choice == c (Already done)">
    <ask>Should I archive the completed work before starting your new project? (y/n)</ask>
    <action if="answer == y">Archive old planning docs</action>
    <output>{{#if archived}}✅ Completed work archived{{else}}Ready for your new project!{{/if}}</output>
    <action>Set new_project = true</action>
    <action>Continue to Step 3 (ask about their work)</action>
  </check>

  <check if="choice == d (Not sure)">
    <ask>Tell me what you're trying to accomplish:</ask>
    <action>Analyze response and guide to appropriate choice (a, b, or c)</action>
    <action>Loop back to present choices again with guidance</action>
  </check>
</check>

<check if="STATE 3: Implementation in progress">
  <output>🚨 **I found active implementation work:**

{{#if found_stories}}
📝 **Story files:** {{story_count}} stories in {output_folder}/stories/
{{#if story_examples}}- Examples: {{story_examples}}{{/if}}
{{/if}}

{{#if found_sprint_status}}
📊 **Sprint tracking:** {{sprint_status_path}}

- {{completed_stories}} completed
- {{in_progress_stories}} in progress
- {{pending_stories}} pending
  {{/if}}

{{#if found_workflow_status}}
📋 **Workflow status:** {{workflow_status_path}}

- Generated: {{workflow_status_date}}
  {{/if}}

{{#if found_planning_docs}}
📚 **Planning docs:** {{found_planning_summary}}
{{/if}}
</output>

<ask>What's happening here?

a) **Continue implementation** - I'm still working on these stories
b) **Completed** - This work is done, starting something NEW
c) **Abandoned** - Stopping this, starting over
d) **Not sure** - Let me explain

Your choice [a/b/c/d]:</ask>

  <check if="choice == a (Continue)">
    <action>Check if bmm-workflow-status.yaml exists</action>

    <check if="workflow_status_exists">
      <output>✅ **You already have workflow tracking set up!**

Your current status file: {{workflow_status_path}}

You don't need workflow-init - you're already using the workflow system.

**To check your progress:**

- Load your current agent (PM, SM, Architect, etc.)
- Run: **/bmad:bmm:workflows:workflow-status**

This will show you what to do next.

Happy building! 🚀</output>
<action>Exit workflow gracefully (workflow already initialized)</action>
</check>

    <check if="no_workflow_status">
      <output>You have work in progress but no workflow tracking.

I'll create workflow tracking that recognizes your existing work.</output>
<action>Set migrating_legacy_project = true</action>
<action>Store found artifacts for workflow status generation</action>
<action>Continue to Step 5 (detect track from artifacts)</action>
</check>
</check>

  <check if="choice in [b (Completed), c (Abandoned)]">
    <ask>Archive the old work before starting fresh? (y/n)</ask>
    <action if="answer == y">Create archive folder</action>
    <action if="answer == y">Move stories, sprint status, and planning docs to archive</action>
    <output>{{#if archived}}✅ Old work archived{{else}}Clean slate! Ready for your new project.{{/if}}</output>
    <action>Set new_project = true</action>
    <action>Continue to Step 3 (ask about their work)</action>
  </check>

  <check if="choice == d (Not sure)">
    <ask>Tell me more about your situation:</ask>
    <action>Analyze and guide to appropriate choice</action>
  </check>
</check>

<check if="STATE 4: Legacy codebase (no BMM artifacts)">
  <output>I see you have an existing codebase:

{{codebase_summary}}

No BMM artifacts found - this project hasn't used BMad Method yet.</output>

<action>Set field_type = "brownfield"</action>
<action>Set new_project = true</action>
<action>Note: Will need document-project before planning</action>
<output>

💡 **Note for brownfield projects:**
You'll need to run **document-project** workflow before planning.
This analyzes your codebase and creates documentation that AI agents can use.

I'll include this as a prerequisite in your workflow path.</output>
<action>Continue to Step 3 (ask about their work)</action>
</check>

<check if="STATE 5: Partial/unclear">
  <output>I found some artifacts but the project state is unclear:

{{list_found_artifacts}}

Let me understand your situation.</output>

<ask>What are you trying to do?

a) Continue working on an existing project
b) Start something completely NEW
c) Fix/enhance the existing code
d) Let me explain my situation

Your choice:</ask>

<action>Analyze response carefully</action>
<action>Guide to appropriate state (Continue existing = Step 5, New = Step 3)</action>
</check>

</step>

<step n="3" goal="Ask user about their work (new projects only)">
<ask>Tell me about what you're working on. What's the goal?</ask>

<action>Store user_description</action>

<action>Analyze description for field type:

- Brownfield indicators: "existing", "current", "add to", "modify", "enhance", "refactor"
- Greenfield indicators: "new", "build", "create", "from scratch", "start"
- Codebase presence overrides: If found codebase = brownfield unless user says "scaffold"
  </action>

<check if="found codebase AND field_type still unclear">
  <ask>I see you have existing code here. Are you:

1. **Adding to or modifying** the existing codebase (brownfield)
2. **Starting fresh** - the existing code is just a scaffold/template (greenfield)
3. **Something else** - let me clarify

Your choice [1/2/3]:</ask>

  <check if="choice == 1">
    <action>Set field_type = "brownfield"</action>
  </check>

  <check if="choice == 2">
    <action>Set field_type = "greenfield"</action>
    <output>Got it - treating as greenfield despite the scaffold.</output>
  </check>

  <check if="choice == 3">
    <ask>Please explain your situation:</ask>
    <action>Analyze explanation and set field_type accordingly</action>
  </check>
</check>

<action if="field_type not yet set">Set field_type based on codebase presence (codebase = brownfield, none = greenfield)</action>

<action>Detect project_type (game vs software):

- Game keywords: "game", "player", "level", "gameplay", "rpg", "fps", "puzzle game"
- Default to "software" if not clearly a game
  </action>

<check if="project_type == game">
  <output>
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 **GAME DEVELOPMENT DETECTED**

Game development workflows are now part of the **BMad Game Development (BMGD)** module.

The BMM module is designed for software development. For game development, you'll need
the BMGD module which provides specialized game development workflows and agents.

**Would you like to:**
a) Install BMGD module now (recommended for game projects)
b) Continue with BMM workflows (for software projects only)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Your choice [a/b]:</ask>

  <check if="choice == a">
    <output>
    Please run the following command to install the BMGD module:

    ```bash
    bmad install bmgd
    ```

    After installation, you can start your game development workflow with the Game Designer agent.

    This workflow-init will now exit. Re-run it after installing BMGD.
    </output>
    <action>Exit workflow with success status</action>

  </check>

  <check if="choice == b">
    <output>
    ⚠️ **Warning:** BMM workflows are optimized for software development, not game development.

    You may encounter mismatched terminology and workflows. Consider installing BMGD for
    a better game development experience.

    Continuing with software development workflows...
    </output>
    <action>Set project_type = "software" (override game detection)</action>

  </check>
</check>

<template-output>user_description</template-output>
<template-output>field_type</template-output>
<template-output>project_type</template-output>
</step>

<step n="4" goal="Offer optional discovery workflows">
<output>Before we determine your planning approach, I want to offer some optional
workflows that can help you think through your project more deeply:</output>

<ask>Would you like to:

- 🧠 **Brainstorm** your project? (Creative exploration and idea generation)
- 🔍 **Research** your domain? (Technical research, competitive analysis, deep-dives)

These are completely OPTIONAL but can help clarify your vision before planning.

Your choice:
a) Yes, brainstorm first
b) Yes, research first
c) Yes, both
d) No, I'm ready to plan

Your choice [a/b/c/d]:</ask>

<check if="choice == a">
  <action>Set brainstorm_requested = true</action>
  <action>Set research_requested = false</action>
</check>

<check if="choice == b">
  <action>Set brainstorm_requested = false</action>
  <action>Set research_requested = true</action>
</check>

<check if="choice == c">
  <action>Set brainstorm_requested = true</action>
  <action>Set research_requested = true</action>
</check>

<check if="choice == d">
  <action>Set brainstorm_requested = false</action>
  <action>Set research_requested = false</action>
</check>

<template-output>brainstorm_requested</template-output>
<template-output>research_requested</template-output>
</step>

<step n="5" goal="Track selection with education (or detect from artifacts)">

<check if="continuing_existing_planning OR migrating_legacy_project">
  <action>Detect track from existing artifacts:

**Track Detection Logic:**

- Has PRD + Architecture → BMad Method
- Has PRD only → BMad Method (architecture was optional/skipped)
- Has tech-spec only → BMad Quick Flow
- Has Security/DevOps docs → BMad Enterprise Method
  </action>

  <output>Based on your existing planning documents, I've detected you're using:

**{{detected_track_name}}**

{{#if found_artifacts_list}}
Found completed workflows:
{{#each found_artifacts_list}}

- {{workflow_name}}: {{file_path}}
  {{/each}}
  {{/if}}

I'll create workflow tracking that matches your existing approach and
automatically marks these completed workflows as done.

Does this look right? (y/n)</output>

<ask if="answer == n">Which track should I use instead?

1. BMad Quick Flow
2. BMad Method
3. BMad Enterprise Method

Your choice:</ask>

<action if="user_corrects">Update selected_track based on choice</action>
<action>Store selected_track</action>
<template-output>selected_track</template-output>

<action>Continue to Step 6 (product brief question if applicable)</action>
</check>

<check if="new_project">
  <output>Now, let me explain your planning options.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 **BMad Quick Flow** - Fast Implementation Path

⏱️ **Time:** Hours to 1 day of planning
📝 **Approach:** Tech-spec focused - just enough detail to start coding
✅ **Best for:** Simple features, bug fixes, scope is crystal clear
⚠️ **Trade-off:** Less upfront planning = higher risk of rework if complexity emerges
🤖 **Agent Support:** Basic - AI will have minimal context

**Example:** "Fix login bug" or "Add export button"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **BMad Method** - Full Product Planning (RECOMMENDED)

⏱️ **Time:** 1-3 days of planning
📝 **Approach:** PRD + UX + Architecture - complete product and system design
✅ **Best for:**

- **GREENFIELD:** Products, platforms, multi-feature initiatives
- **BROWNFIELD:** Complex additions (new UIs + APIs, major refactors, new modules)

✅ **Benefits:**

- AI agents have COMPLETE context for better code generation
- Architecture distills massive codebases into focused solution design
- Prevents architectural drift and ensures consistency
- Fewer surprises and less rework during implementation
- Faster overall delivery (planning investment pays off!)
- Better code quality and maintainability

🤖 **Agent Support:** Exceptional - AI becomes a true coding partner with full context

{{#if brownfield}}
💡 **Why Architecture for Brownfield?**
Your brownfield documentation might be huge (thousands of lines). The Architecture
workflow takes all that context and creates a SUCCINCT solution design specific to
YOUR project. This keeps AI agents focused on YOUR changes without getting lost
in the existing codebase details.
{{/if}}

**Example:** "User dashboard with analytics" or "Payment integration system"
or "Add real-time collaboration to existing editor"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 **BMad Enterprise Method** - Extended Enterprise Planning

⏱️ **Time:** 3-7 days of planning
📝 **Approach:** BMad Method + Security Architecture + DevOps + Test Strategy
✅ **Best for:** Enterprise requirements, compliance, multi-tenant, mission-critical
✅ **Benefits:** All of BMad Method PLUS specialized planning for:

- Security architecture and threat modeling
- DevOps pipeline and infrastructure planning
- Comprehensive test strategy
- Compliance and audit requirements

🤖 **Agent Support:** Elite - comprehensive planning for complex enterprise systems

**Example:** "Multi-tenant SaaS platform" or "HIPAA-compliant patient portal"
or "Add SOC2-compliant audit logging to enterprise app"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</output>

<action>Generate recommendation based on user_description and field_type:

**Recommendation Logic:**

- Complexity keywords (dashboard, platform, system, integration, multiple features) → Recommend BMad Method
- Simple keywords (fix, bug, add button, simple) → Mention Quick Flow as option
- Enterprise keywords (multi-tenant, compliance, security, audit) → Recommend Enterprise
- Brownfield + complex → Strongly recommend Method (explain architecture benefit)
- Greenfield + complex → Recommend Method
  </action>

  <output>

💡 **My Honest Recommendation:**

{{recommendation_with_reasoning}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</output>

<ask>Which approach fits your situation?

1. **BMad Quick Flow** - Fast, minimal planning (I accept rework risk)
2. **BMad Method** - Full planning for better AI results (RECOMMENDED)
3. **BMad Enterprise Method** - Extended planning for enterprise needs
4. **I'm not sure** - Help me decide

Your choice [1/2/3/4]:</ask>

  <check if="choice == 4 (Not sure)">
    <ask>Tell me more about your concerns or uncertainties:</ask>
    <action>Provide tailored guidance based on their specific concerns</action>
    <action>Present choices again with more specific recommendation</action>
  </check>

<action>Map choice to track name:

- 1 → "quick-flow"
- 2 → "method"
- 3 → "enterprise"
  </action>

<action>Store selected_track</action>
<template-output>selected_track</template-output>
</check>

</step>

<step n="6" goal="Product brief question (greenfield Method/Enterprise only)">

<check if="field_type == brownfield OR selected_track == quick-flow">
  <action>Skip this step - product brief not applicable for brownfield or quick flow</action>
  <action>Set product_brief_requested = false</action>
  <action>Continue to Step 7 (generate workflow path)</action>
</check>

<check if="field_type == greenfield AND selected_track in [method, enterprise]">
  <output>One more optional workflow for greenfield projects:

📋 **Product Brief** - Strategic product planning document

This is OPTIONAL but recommended for greenfield BMad Method projects.
It helps you articulate:

- Product vision and unique value proposition
- Target users and their needs
- Success criteria and goals
- Market positioning and strategy

This comes BEFORE your PRD and helps inform it with strategic thinking.

Would you like to include Product Brief in your workflow?</output>

<ask>a) Yes, include Product Brief
b) No, skip to PRD

Your choice [a/b]:</ask>

  <check if="choice == a">
    <action>Set product_brief_requested = true</action>
  </check>

  <check if="choice == b">
    <action>Set product_brief_requested = false</action>
  </check>

<template-output>product_brief_requested</template-output>
</check>

</step>

<step n="7" goal="Load workflow path and build status structure">

<action>Determine path file based on selected track and field type:

**Path File Mapping:**

- quick-flow + greenfield → "quick-flow-greenfield.yaml"
- quick-flow + brownfield → "quick-flow-brownfield.yaml"
- method + greenfield → "method-greenfield.yaml"
- method + brownfield → "method-brownfield.yaml"
- enterprise + greenfield → "enterprise-greenfield.yaml"
- enterprise + brownfield → "enterprise-brownfield.yaml"
- game → "game-design.yaml"
  </action>

<action>Load {path_files}/{determined_path_file}</action>
<action>Parse workflow path file to extract phases and workflows</action>

<action>Build workflow_items list:

For each phase in path file:

1. Check if phase should be included based on:
   - User choices (brainstorm_requested, research_requested, product_brief_requested)
   - Phase conditions (prerequisite phases, optional phases)
2. Add comment header: `  # Phase {n}: {Phase Name}`
3. For each workflow in phase:
   - Check if workflow should be included based on user choices
   - Add entry: `  {workflow-id}: {default_status}  # agent: {agent}`
   - Default status from path file (required/optional/recommended/conditional)
   - Agent from path file (pm/architect/ux-designer/sm/analyst/etc.)
4. Add blank line between phases
   </action>

<action>Scan for existing completed workflows and update workflow_items:

**Scan locations:**

- Brainstorm: {output_folder}/brainstorm\*.md
- Research: {output_folder}/research\*.md
- Product Brief: {output_folder}/\*brief\*.md
- PRD: {output*folder}/\_prd*.md or {output*folder}/\_prd*/index.md
- Tech-spec: {output*folder}/\_tech-spec*.md or {output*folder}/\_spec*.md
- Epics: {output*folder}/\_epic*.md or {output*folder}/\_epic*/index.md
- UX Design: {output*folder}/\_ux*.md or {output*folder}/\_design*.md
- Architecture: {output*folder}/\_architecture*.md or {output*folder}/\_arch*.md
- Sprint Planning: {output_folder}/\*sprint\*.yaml

**CRITICAL:** If file exists, replace workflow status with ONLY the file path, preserving agent comment.
Example: `prd: docs/prd.md  # agent: pm` (NOT "completed - docs/prd.md")
</action>

<template-output>workflow_path_file</template-output>
<template-output>workflow_items</template-output>

</step>

<step n="8" goal="Present workflow path and create status file">

<action>Set generated date to current date</action>
<template-output>generated</template-output>

<output>Perfect! Here's your personalized BMad workflow path:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Track:** {{selected_track_display_name}}
**Field Type:** {{field_type}}
**Project:** {{project_name}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if brownfield AND needs_documentation}}
🔧 **Prerequisites:**
✅ document-project - Create comprehensive codebase documentation (analyst agent)
(Required before planning workflows)
{{/if}}

{{#if has_discovery_phase}}
🧠 **Phase 0: Discovery** (Optional - based on your choices)
{{#if brainstorm_requested}}
✅ Brainstorm - Creative exploration session (analyst agent)
{{/if}}
{{#if research_requested}}
✅ Research - Domain and technical research (analyst agent)
{{/if}}
{{#if product_brief_requested}}
✅ Product Brief - Strategic product planning (analyst agent)
{{/if}}
{{/if}}

{{#if selected_track == quick-flow}}
📝 **Phase 1: Planning**
✅ Tech-Spec - Implementation-focused specification (pm agent)
(Auto-detects epic structure if 2+ stories)

🚀 **Phase 2: Implementation**
✅ Sprint Planning - Create sprint tracking (sm agent)
✅ Story Development - Implement story-by-story (sm agent)
{{/if}}

{{#if selected_track in [method, enterprise]}}
📋 **Phase 1: Planning**
✅ PRD - Product Requirements Document (pm agent)
✅ Validate PRD (optional quality check) (pm agent)
✅ UX Design (if UI components - determined after PRD) (ux-designer agent)

🏗️ **Phase 2: Solutioning**
{{#if brownfield}}
✅ Architecture - Integration design (RECOMMENDED for brownfield) (architect agent)
Creates focused solution design from your existing codebase context
{{else}}
✅ Architecture - System design document (architect agent)
{{/if}}
✅ Validate Architecture (optional quality check) (architect agent)
✅ Solutioning Gate Check - Validate all planning aligns before coding (architect agent)

🚀 **Phase 3: Implementation**
✅ Sprint Planning - Create sprint tracking (sm agent)
✅ Story Development - Implement story-by-story with epic-tech-specs (sm agent)
{{/if}}

{{#if selected_track == enterprise}}

🏢 **Additional Enterprise Planning:**
✅ Security Architecture - Threat modeling and security design (architect agent)
✅ DevOps Strategy - Pipeline and infrastructure planning (architect agent)
✅ Test Strategy - Comprehensive testing approach (tea agent)
{{/if}}

{{#if found_existing_artifacts}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 **Existing Work Detected:**

I found these completed workflows and will mark them as done:
{{#each completed_workflows}}
✅ {{workflow_name}}: {{file_path}}
{{/each}}

Your workflow tracking will start from where you left off!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{/if}}</output>

<ask>Ready to create your workflow tracking file? (y/n)</ask>

<check if="answer == y">
  <action>Prepare all template variables for workflow-status-template.yaml:
  - generated: {current_date}
  - project_name: {project_name}
  - project_type: {project_type}
  - selected_track: {selected_track}
  - field_type: {field_type}
  - workflow_path_file: {workflow_path_file}
  - workflow_items: {workflow_items from step 7}
  </action>

<action>Generate YAML from workflow-status-template.yaml with all variables</action>
<action>Save status file to {output_folder}/bmm-workflow-status.yaml</action>

<action>Identify the first non-completed workflow in workflow_items</action>
<action>Look up that workflow's agent and command from the loaded path file</action>

<output>✅ **Workflow tracking created:** {output_folder}/bmm-workflow-status.yaml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if completed_workflows_found}}
🎉 Great news! I found {{completed_count}} workflow(s) already completed.
{{/if}}

**Next Workflow:** {{next_workflow_name}}
**Agent:** {{next_agent}}
**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

{{#if next_agent != 'analyst' AND next_agent != 'pm'}}
💡 **Tip:** Start a new chat and load the **{{next_agent}}** agent before running this workflow.
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Happy building with BMad Method! 🚀

**To check your progress anytime:**

- Load any BMM agent
- Run: /bmad:bmm:workflows:workflow-status
  </output>
  </check>

<check if="answer == n">
  <output>No problem! You can run workflow-init again anytime you're ready.

To get started later, just load the Analyst agent and run:
**/bmad:bmm:workflows:workflow-init**</output>
</check>

</step>

</workflow>
