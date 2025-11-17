# Epic and Story Decomposition - Intent-Based Implementation Planning

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow transforms requirements into BITE-SIZED STORIES for development agents</critical>
<critical>EVERY story must be completable by a single dev agent in one focused session</critical>
<critical>⚠️ EPIC STRUCTURE PRINCIPLE: Each epic MUST deliver USER VALUE, not just technical capability. Epics are NOT organized by technical layers (database, API, frontend). Each epic should result in something USERS can actually use or benefit from. Exception: Foundation/setup stories at the start of first epic are acceptable. Another valid exception: API-first epic ONLY when the API itself has standalone value (e.g., will be consumed by third parties or multiple frontends).</critical>
<critical>BMAD METHOD WORKFLOW POSITION: This workflow can be invoked at multiple points - after PRD only, after PRD+UX, after PRD+UX+Architecture, or to update existing epics. If epics.md already exists, ASK the user: (1) CONTINUING - previous run was incomplete, (2) REPLACING - starting fresh/discarding old, (3) UPDATING - new planning document created since last epic generation</critical>
<critical>This is a LIVING DOCUMENT that evolves through the BMad Method workflow chain</critical>
<critical>Phase 4 Implementation pulls context from: PRD + epics.md + UX + Architecture</critical>
<critical>Communicate all responses in {communication_language} and adapt to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to epics.md continuously as you work - never wait until the end</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<workflow>

<step n="0" goal="Detect workflow mode and available context">
<action>Determine if this is initial creation or update mode

**Check for existing epics.md:**
</action>

<action>Check if {default_output_file} exists (epics.md)</action>

<check if="epics.md exists">
  <action>Load existing epics.md completely</action>
  <action>Extract existing:
  - Epic structure and titles
  - Story breakdown
  - FR coverage mapping
  - Existing acceptance criteria
  </action>

<output>📝 **Existing epics.md found!**

Current structure:

- {{epic_count}} epics defined
- {{story_count}} total stories
  </output>

<ask>What would you like to do?

1. **CONTINUING** - Previous run was incomplete, continue where we left off
2. **REPLACING** - Start fresh, discard existing epic structure
3. **UPDATING** - New planning document created (UX/Architecture), enhance existing epics

Enter your choice (1-3):</ask>

<action>Set mode based on user choice:

- Choice 1: mode = "CONTINUE" (resume incomplete work)
- Choice 2: mode = "CREATE" (start fresh, ignore existing)
- Choice 3: mode = "UPDATE" (enhance with new context)
  </action>
  </check>

<check if="epics.md does not exist">
  <action>Set mode = "CREATE"</action>
  <output>🆕 **INITIAL CREATION MODE**

No existing epics found - I'll create the initial epic breakdown.
</output>
</check>

<action>**Detect available context documents:**</action>

<action>Check which documents exist:

- UX Design specification ({ux_design_content})
- Architecture document ({architecture_content})
- Domain brief ({domain_brief_content})
- Product brief ({product_brief_content})
  </action>

<check if="mode == 'UPDATE'">
  <action>Identify what's NEW since last epic update:

- If UX exists AND not previously incorporated:
  - Flag: "ADD_UX_DETAILS = true"
  - Note UX sections to extract (interaction patterns, mockup references, responsive breakpoints)

- If Architecture exists AND not previously incorporated:
  - Flag: "ADD_ARCH_DETAILS = true"
  - Note Architecture sections to extract (tech stack, API contracts, data models)
    </action>

<output>**Context Analysis:**
{{if ADD_UX_DETAILS}}
✅ UX Design found - will add interaction details to stories
{{/if}}
{{if ADD_ARCH_DETAILS}}
✅ Architecture found - will add technical implementation notes
{{/if}}
{{if !ADD_UX_DETAILS && !ADD_ARCH_DETAILS}}
⚠️ No new context documents found - reviewing for any PRD changes
{{/if}}
</output>
</check>

<check if="mode == 'CREATE'">
  <output>**Available Context:**
  - ✅ PRD (required)
  {{if ux_design_content}}
  - ✅ UX Design (will incorporate interaction patterns)
  {{/if}}
  {{if architecture_content}}
  - ✅ Architecture (will incorporate technical decisions)
  {{/if}}
  {{if !ux_design_content && !architecture_content}}
  - ℹ️ Creating basic epic structure (can be enhanced later with UX/Architecture)
  {{/if}}
  </output>
</check>

<template-output>workflow_mode</template-output>
<template-output>available_context</template-output>
</step>

<step n="1" goal="Load PRD and extract requirements">
<action>
<check if="mode == 'CREATE'">
Welcome {user_name} to epic and story planning
</check>
<check if="mode == 'UPDATE'">
Welcome back {user_name} - let's enhance your epic breakdown with new context
</check>

Load required documents (fuzzy match, handle both whole and sharded):

- PRD.md (required)
- domain-brief.md (if exists)
- product-brief.md (if exists)

**CRITICAL - PRD FRs Are Now Flat and Strategic:**

The PRD contains FLAT, capability-level functional requirements (FR1, FR2, FR3...).
These are STRATEGIC (WHAT capabilities exist), NOT tactical (HOW they're implemented).

Example PRD FRs:

- FR1: Users can create accounts with email or social authentication
- FR2: Users can log in securely and maintain sessions
- FR6: Users can create, edit, and delete content items

**Your job in THIS workflow:**

1. Map each FR to one or more epics
2. Break each FR into stories with DETAILED acceptance criteria
3. Add ALL the implementation details that were intentionally left out of PRD

Extract from PRD:

- ALL functional requirements (flat numbered list)
- Non-functional requirements
- Domain considerations and compliance needs
- Project type and complexity
- MVP vs growth vs vision scope boundaries
- Product differentiator (what makes it special)
- Technical constraints
- User types and their goals
- Success criteria

**Create FR Inventory:**

List all FRs to ensure coverage:

- FR1: [description]
- FR2: [description]
- ...
- FRN: [description]

This inventory will be used to validate complete coverage in Step 4.
</action>

<template-output>fr_inventory</template-output>
</step>

<step n="2" goal="Propose epic structure from natural groupings">

<check if="mode == 'UPDATE'">
  <action>**MAINTAIN existing epic structure:**

Use the epic structure already defined in epics.md:

- Keep all existing epic titles and goals
- Preserve epic sequencing
- Maintain FR coverage mapping

Note: We're enhancing stories within existing epics, not restructuring.
</action>

<output>**Using existing epic structure:**
{{list_existing_epics_with_titles}}

Will enhance stories within these epics using new context.
</output>

<template-output>epics_summary</template-output>
<template-output>fr_coverage_map</template-output>

<goto step="3">Skip to story enhancement</goto>
</check>

<check if="mode == 'CREATE'">
<action>Analyze requirements and identify natural epic boundaries

INTENT: Find organic groupings that make sense for THIS product

Look for natural patterns:

- Features that work together cohesively
- User journeys that connect
- Business capabilities that cluster
- Domain requirements that relate (compliance, validation, security)
- Technical systems that should be built together

Name epics based on VALUE, not technical layers:

- Good: "User Onboarding", "Content Discovery", "Compliance Framework"
- Avoid: "Database Layer", "API Endpoints", "Frontend"

**⚠️ ANTI-PATTERN EXAMPLES (DO NOT DO THIS):**

❌ **WRONG - Technical Layer Breakdown:**

- Epic 1: Database Schema & Models
- Epic 2: API Layer / Backend Services
- Epic 3: Frontend UI Components
- Epic 4: Integration & Testing

WHY IT'S WRONG: User gets ZERO value until ALL epics complete. No incremental delivery.

✅ **CORRECT - User Value Breakdown:**

- Epic 1: Foundation (project setup - necessary exception)
- Epic 2: User Authentication (user can register/login - VALUE DELIVERED)
- Epic 3: Content Management (user can create/edit content - VALUE DELIVERED)
- Epic 4: Social Features (user can share/interact - VALUE DELIVERED)

WHY IT'S RIGHT: Each epic delivers something users can USE. Incremental value.

**Valid Exceptions:**

1. **Foundation Epic**: First epic CAN be setup/infrastructure (greenfield projects need this)
2. **API-First Epic**: ONLY valid if the API has standalone value (third-party consumers, multiple frontends, API-as-product). If it's just "backend for our frontend", that's the WRONG pattern.

Each epic should:

- Have clear business goal and user value
- Be independently valuable
- Contain 3-8 related capabilities
- Be deliverable in cohesive phase

For greenfield projects:

- First epic MUST establish foundation (project setup, core infrastructure, deployment pipeline)
- Foundation enables all subsequent work

For complex domains:

- Consider dedicated compliance/regulatory epics
- Group validation and safety requirements logically
- Note expertise requirements

Present proposed epic structure showing:

- Epic titles with clear value statements
- High-level scope of each epic
- **FR COVERAGE MAP: Which FRs does each epic address?**
  - Example: "Epic 1 (Foundation): Covers infrastructure needs for all FRs"
  - Example: "Epic 2 (User Management): FR1, FR2, FR3, FR4, FR5"
  - Example: "Epic 3 (Content System): FR6, FR7, FR8, FR9"
- Suggested sequencing
- Why this grouping makes sense

**Validate FR Coverage:**

Check that EVERY FR from Step 1 inventory is mapped to at least one epic.
If any FRs are unmapped, add them now or explain why they're deferred.
</action>

<template-output>epics_summary</template-output>
<template-output>fr_coverage_map</template-output>
</check>
</step>

<step n="3" goal="Decompose each epic into bite-sized stories with DETAILED AC" repeat="for-each-epic">

<check if="mode == 'UPDATE'">
  <action>**ENHANCE Epic {{N}} stories with new context:**

For each existing story in Epic {{N}}:

1. Preserve core story structure (title, user story statement)
2. Add/enhance based on available NEW context:

  <check if="ADD_UX_DETAILS">
    **Add from UX Design:**
    - Specific mockup/wireframe references
    - Exact interaction patterns
    - Animation/transition specifications
    - Responsive breakpoints
    - Component specifications
    - Error states and feedback patterns
    - Accessibility requirements (WCAG compliance)

    Example enhancement:
    BEFORE: "User can log in"
    AFTER: "User can log in via modal (UX pg 12-15) with email/password fields,
            password visibility toggle, remember me checkbox,
            loading state during auth (spinner overlay),
            error messages below fields (red, 14px),
            success redirects to dashboard with fade transition"

  </check>

  <check if="ADD_ARCH_DETAILS">
    **Add from Architecture:**
    - Specific API endpoints and contracts
    - Data model references
    - Tech stack implementation details
    - Performance requirements
    - Security implementation notes
    - Cache strategies
    - Error handling patterns

    Example enhancement:
    BEFORE: "System authenticates user"
    AFTER: "System authenticates user via POST /api/v1/auth/login,
            validates against users table (see Arch section 6.2),
            returns JWT token (expires 7d) + refresh token (30d),
            rate limited to 5 attempts/hour/IP,
            logs failures to security_events table"

  </check>

3. Update acceptance criteria with new details
4. Preserve existing prerequisites
5. Enhance technical notes with new context
   </action>
   </check>

<check if="mode == 'CREATE'">
<action>Break down Epic {{N}} into small, implementable stories

INTENT: Create stories sized for single dev agent completion

**CRITICAL - ALTITUDE SHIFT FROM PRD:**

PRD FRs are STRATEGIC (WHAT capabilities):

- ✅ "Users can create accounts"

Epic Stories are TACTICAL (HOW it's implemented):

- Email field with RFC 5322 validation
- Password requirements: 8+ chars, 1 uppercase, 1 number, 1 special
- Password strength meter with visual feedback
- Email verification within 15 minutes
- reCAPTCHA v3 integration
- Account creation completes in < 2 seconds
- Mobile responsive with 44x44px touch targets
- WCAG 2.1 AA compliant

**THIS IS WHERE YOU ADD ALL THE DETAILS LEFT OUT OF PRD:**

- UI specifics (exact field counts, validation rules, layout details)
- Performance targets (< 2s, 60fps, etc.)
- Technical implementation hints (libraries, patterns, APIs)
- Edge cases (what happens when...)
- Validation rules (regex patterns, constraints)
- Error handling (specific error messages, retry logic)
- Accessibility requirements (ARIA labels, keyboard nav, screen readers)
- Platform specifics (mobile responsive, browser support)

For each epic, generate:

- Epic title as `epic_title_{{N}}`
- Epic goal/value as `epic_goal_{{N}}`
- All stories as repeated pattern `story_title_{{N}}_{{M}}` for each story M

CRITICAL for Epic 1 (Foundation):

- Story 1.1 MUST be project setup/infrastructure initialization
- Sets up: repo structure, build system, deployment pipeline basics, core dependencies
- Creates foundation for all subsequent stories
- Note: Architecture workflow will flesh out technical details

Each story should follow BDD-style acceptance criteria:

**Story Pattern:**
As a [user type],
I want [specific capability],
So that [clear value/benefit].

**Acceptance Criteria using BDD:**
Given [precondition or initial state]
When [action or trigger]
Then [expected outcome]

And [additional criteria as needed]

**Prerequisites:** Only previous stories (never forward dependencies)

**Technical Notes:** Implementation guidance, affected components, compliance requirements

Ensure stories are:

- Vertically sliced (deliver complete functionality, not just one layer)
- Sequentially ordered (logical progression, no forward dependencies)
- Independently valuable when possible
- Small enough for single-session completion
- Clear enough for autonomous implementation

For each story in epic {{N}}, output variables following this pattern:

- story*title*{{N}}_1, story_title_{{N}}\*2, etc.
- Each containing: user story, BDD acceptance criteria, prerequisites, technical notes</action>

<template-output>epic*title*{{N}}</template-output>
<template-output>epic*goal*{{N}}</template-output>

<action>For each story M in epic {{N}}, generate story content</action>
<template-output>story-title-{{N}}-{{M}}</template-output>
</check>

<action>**EPIC {{N}} REVIEW - Present for Checkpoint:**

Summarize the COMPLETE epic breakdown:

**Epic {{N}}: {{epic_title}}**
Goal: {{epic_goal}}

Stories ({{count}} total):
{{for each story, show:}}

- Story {{N}}.{{M}}: {{story_title}}
  - User Story: As a... I want... So that...
  - Acceptance Criteria: (BDD format summary)
  - Prerequisites: {{list}}

**Review Questions to Consider:**

- Is the story sequence logical?
- Are acceptance criteria clear and testable?
- Are there any missing stories for the FRs this epic covers?
- Are the stories sized appropriately (single dev agent session)?
- FRs covered by this epic: {{FR_list}}

**NOTE:** At the checkpoint prompt, select [a] for Advanced Elicitation if you want to refine stories, add missing ones, or reorder. Select [c] to approve this epic and continue to the next one.
</action>

<template-output>epic\_{{N}}\_complete_breakdown</template-output>

</step>

<step n="4" goal="Review epic breakdown and completion">

<check if="mode == 'UPDATE'">
  <action>Review the ENHANCED epic breakdown for completeness

**Validate Enhancements:**

- All stories now have context-appropriate details
- UX references added where applicable
- Architecture decisions incorporated where applicable
- Acceptance criteria updated with new specifics
- Technical notes enhanced with implementation details

**Quality Check:**

- Stories remain bite-sized for single dev agent sessions
- No forward dependencies introduced
- All new context properly integrated
  </action>

<template-output>epic_breakdown_summary</template-output>
<template-output>enhancement_summary</template-output>

<output>✅ **Epic Enhancement Complete!**

**Updated:** epics.md with enhanced context

**Enhancements Applied:**
{{if ADD_UX_DETAILS}}

- ✅ UX interaction patterns and mockup references added
  {{/if}}
  {{if ADD_ARCH_DETAILS}}
- ✅ Architecture technical decisions and API contracts added
  {{/if}}

The epic breakdown now includes all available context for Phase 4 implementation.

**Next Steps:**
{{if !architecture_content}}

- Run Architecture workflow for technical decisions
  {{/if}}
  {{if architecture_content}}
- Ready for Phase 4: Sprint Planning
  {{/if}}
  </output>
  </check>

<check if="mode == 'CREATE'">
<action>Review the complete epic breakdown for quality and completeness

**Validate Epic Structure (USER VALUE CHECK):**

For each epic, answer: "What can USERS do after this epic is complete that they couldn't do before?"

- Epic 1: [Must have clear user value OR be Foundation exception]
- Epic 2: [Must deliver user-facing capability]
- Epic N: [Must deliver user-facing capability]

⚠️ RED FLAG: If an epic only delivers technical infrastructure (database layer, API without users, component library without features), RESTRUCTURE IT. Each epic should enable users to accomplish something.

Exception validation:

- Foundation epic: Acceptable as first epic for greenfield projects
- API-first epic: Acceptable ONLY if API has standalone consumers (third-party integrations, multiple frontends, API-as-product)

If any epic fails this check, restructure before proceeding.

**Validate FR Coverage:**

Create FR Coverage Matrix showing each FR mapped to epic(s) and story(ies):

- FR1: [description] → Epic X, Story X.Y
- FR2: [description] → Epic X, Story X.Z
- FR3: [description] → Epic Y, Story Y.A
- ...
- FRN: [description] → Epic Z, Story Z.B

Confirm: EVERY FR from Step 1 inventory is covered by at least one story.
If any FRs are missing, add stories now.

**Validate Story Quality:**

- All functional requirements from PRD are covered by stories
- Epic 1 establishes proper foundation (if greenfield)
- All stories are vertically sliced (deliver complete functionality, not just one layer)
- No forward dependencies exist (only backward references)
- Story sizing is appropriate for single-session completion
- BDD acceptance criteria are clear and testable
- Details added (what was missing from PRD FRs: UI specifics, performance targets, etc.)
- Domain/compliance requirements are properly distributed
- Sequencing enables incremental value delivery

Confirm with {user_name}:

- Epic structure makes sense
- All FRs covered by stories (validated via coverage matrix)
- Story breakdown is actionable
  <check if="ux_design_content && architecture_content">
- All available context has been incorporated (PRD + UX + Architecture)
- Ready for Phase 4 Implementation
  </check>
  <check if="ux_design_content && !architecture_content">
- UX context has been incorporated
- Ready for Architecture workflow (recommended next step)
  </check>
  <check if="!ux_design_content && architecture_content">
- Architecture context has been incorporated
- Consider running UX Design workflow if UI exists
  </check>
  <check if="!ux_design_content && !architecture_content">
- Basic epic structure created from PRD
- Ready for next planning phase (UX Design or Architecture)
  </check>
  </action>

<template-output>epic_breakdown_summary</template-output>
<template-output>fr_coverage_matrix</template-output>

<check if="mode == 'CREATE'">
<output>**✅ Epic Breakdown Complete**

**Created:** epics.md with epic and story breakdown

**FR Coverage:** All functional requirements from PRD mapped to stories

**Context Incorporated:**
{{if ux_design_content && architecture_content}}

- ✅ PRD requirements
- ✅ UX interaction patterns
- ✅ Architecture technical decisions
  **Status:** COMPLETE - Ready for Phase 4 Implementation!
  {{/if}}
  {{if ux_design_content && !architecture_content}}
- ✅ PRD requirements
- ✅ UX interaction patterns
  **Next:** Run Architecture workflow for technical decisions
  {{/if}}
  {{if !ux_design_content && architecture_content}}
- ✅ PRD requirements
- ✅ Architecture technical decisions
  **Next:** Consider UX Design workflow if UI needed
  {{/if}}
  {{if !ux_design_content && !architecture_content}}
- ✅ PRD requirements (basic structure)
  **Next:** Run UX Design (if UI) or Architecture workflow
  **Note:** Epics will be enhanced with additional context later
  {{/if}}
  </output>
  </check>
  </check>
  </step>

</workflow>
