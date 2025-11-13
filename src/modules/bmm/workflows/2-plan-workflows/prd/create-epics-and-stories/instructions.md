# Epic and Story Decomposition - Intent-Based Implementation Planning

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow transforms requirements into BITE-SIZED STORIES for development agents</critical>
<critical>EVERY story must be completable by a single dev agent in one focused session</critical>
<critical>BMAD METHOD WORKFLOW POSITION: This is the FIRST PASS at epic breakdown</critical>
<critical>After this workflow: UX Design will add interaction details → UPDATE epics.md</critical>
<critical>After UX: Architecture will add technical decisions → UPDATE epics.md AGAIN</critical>
<critical>Phase 4 Implementation pulls context from: PRD + epics.md + UX + Architecture</critical>
<critical>This is a LIVING DOCUMENT that evolves through the BMad Method workflow chain</critical>
<critical>Communicate all responses in {communication_language} and adapt to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to epics.md continuously as you work - never wait until the end</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>

<workflow>

<step n="1" goal="Load PRD and extract requirements">
<action>Welcome {user_name} to epic and story planning

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
</step>

<step n="3" goal="Decompose each epic into bite-sized stories with DETAILED AC" repeat="for-each-epic">
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

</step>

<step n="4" goal="Review initial epic breakdown and prepare for updates">
<action>Review the complete epic breakdown for quality and completeness

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

**BMad Method Next Steps:**

This epic breakdown is the INITIAL VERSION. It will be updated as you progress:

1. **After UX Design Workflow:**
   - UX Designer will design interactions for capabilities
   - UPDATE story acceptance criteria with UX specs (mockup references, flow details)
   - Add interaction patterns, visual design decisions, responsive breakpoints

2. **After Architecture Workflow:**
   - Architect will define technical implementation approach
   - UPDATE story technical notes with architecture decisions
   - Add references to data models, API contracts, tech stack choices, deployment patterns

3. **During Phase 4 Implementation:**
   - Each story pulls context from: PRD (why) + epics.md (what/how) + UX (interactions) + Architecture (technical)
   - Stories may be further refined as implementation uncovers edge cases
   - This document remains the single source of truth for story details

Confirm with {user_name}:

- Epic structure makes sense
- All FRs covered by stories (validated via coverage matrix)
- Story breakdown is actionable with detailed acceptance criteria
- Ready for UX Design workflow (next BMad Method step)
  </action>

<template-output>epic_breakdown_summary</template-output>
<template-output>fr_coverage_matrix</template-output>

<output>**✅ Epic Breakdown Complete (Initial Version)**

**Created:** epics.md with epic and story breakdown

**FR Coverage:** All functional requirements from PRD mapped to stories (see coverage matrix in document)

**Next Steps in BMad Method:**

1. **UX Design** (if UI exists) - Run: `workflow ux-design`
   → Will add interaction details to stories in epics.md

2. **Architecture** - Run: `workflow create-architecture`
   → Will add technical details to stories in epics.md

3. **Phase 4 Implementation** - Stories ready for context assembly

**Important:** This is a living document that will be updated as you progress through the workflow chain. The epics.md file will evolve with UX and Architecture inputs before implementation begins.
</output>
</step>

</workflow>
