# Epic and Story Creation with Full Technical Context

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>PREREQUISITES: PRD.md AND Architecture.md MUST be completed before running this workflow</critical>
<critical>UX Design.md is highly recommended if the product has user interfaces</critical>
<critical>EVERY story must be completable by a single dev agent in one focused session</critical>
<critical>⚠️ EPIC STRUCTURE PRINCIPLE: Each epic MUST deliver USER VALUE, not just technical capability. Epics are NOT organized by technical layers (database, API, frontend). Each epic should result in something USERS can actually use or benefit from. Exception: Foundation/setup stories at the start of first epic are acceptable.</critical>
<critical>Communicate all responses in {communication_language} and adapt to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to epics.md continuously as you work - never wait until the end</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<workflow>

<step n="0" goal="Validate prerequisites and load all context">
<action>Welcome {user_name} to comprehensive epic and story creation</action>

<action>**CRITICAL PREREQUISITE VALIDATION:**</action>

<action>Verify required documents exist and are complete:

1. **PRD.md** - Contains functional requirements (FRs) and product scope
2. **Architecture.md** - Contains technical decisions, API contracts, data models
3. **UX Design.md** (if UI exists) - Contains interaction patterns, mockups, user flows

Missing any required document means this workflow cannot proceed successfully.</action>

<check if="!prd_content">
<output>❌ **PREREQUISITE FAILED: PRD.md not found**

The PRD is required to define what functionality needs to be built.

Please complete the PRD workflow first, then run this workflow again.</output>

<exit workflow="Missing required PRD document"/>
</check>

<check if="!architecture_content">
<output>❌ **PREREQUISITE FAILED: Architecture.md not found**

The Architecture document is required to provide technical implementation context for stories.

Please complete the Architecture workflow first, then run this workflow again.</output>

<exit workflow="Missing required Architecture document"/>
</check>

<action>List the documents loaded</action>

<action>**LOAD ALL CONTEXT DOCUMENTS:**</action>

<action>Load and analyze PRD.md:

Extract ALL functional requirements:

- Complete FR inventory (FR1, FR2, FR3...)
- Non-functional requirements and constraints
- Project scope boundaries (MVP vs growth vs vision)
- User types and their goals
- Success criteria
- Technical constraints
- Compliance requirements

**FR Inventory Creation:**
List every functional requirement with description for coverage tracking.
</action>

<action>Load and analyze Architecture.md:

Extract ALL technical implementation context relevant to the PRD functional requirements and project needs:

Scan comprehensively for any technical details needed to create complete user stories, including but not limited to:

- Technology stack decisions and framework choices
- API design, contracts, and integration patterns
- Data models, schemas, and relationships
- Authentication, authorization, and security patterns
- Performance requirements and scaling approaches
- Error handling, logging, and monitoring strategies
- Deployment architecture and infrastructure considerations
- Any other technical decisions, patterns, or constraints that impact implementation

Focus on extracting whatever technical context exists in the Architecture document that will be needed to create comprehensive, actionable user stories for all PRD requirements.
</action>

<action if="UX Design Exists">
Load and analyze UX Design.md:

Extract ALL user experience context relevant to the PRD functional requirements and project needs:

Scan comprehensively for any user experience details needed to create complete user stories, including but not limited to:

- User flows, journey patterns, and interaction design
- Screen layouts, components, and visual specifications
- Interaction patterns, behaviors, and micro-interactions
- Responsive design and mobile-first considerations
- Accessibility requirements and inclusive design patterns
- Animations, transitions, and feedback mechanisms
- Error states, validation patterns, and user guidance
- Any other UX/UI decisions, patterns, or specifications that impact implementation

Focus on extracting whatever user experience context exists in the UX document that will be needed to create comprehensive, actionable user stories for all PRD requirements.
</action>

<template-output>context_validation</template-output>
<template-output>fr_inventory</template-output>
</step>

<step n="1" goal="Design epic structure with full technical context">
<action>**STRATEGIC EPIC PLANNING WITH COMPLETE CONTEXT:**</action>

<action>Now that you have ALL available context (PRD + Architecture + UX), design epics that deliver incremental user value while leveraging the technical design decisions.

**EPIC DESIGN PRINCIPLES:**

1. **User-Value First**: Each epic must enable users to accomplish something meaningful
2. **Leverage Architecture**: Build upon the technical decisions already made
3. **Incremental Delivery**: Each epic should be independently valuable
4. **Logical Dependencies**: Dependencies should flow naturally, not artificially

**USE YOUR FULL CONTEXT:**

From PRD: Group related functional requirements that deliver user outcomes
From Architecture: Respect technical boundaries and integration points
From UX: Design around user journeys and interaction flows

**VALID EPIC EXAMPLES:**

✅ **CORRECT - User Value with Technical Context:**

- Epic 1: Foundation Setup (infrastructure, deployment, core services)
- Epic 2: User Authentication & Profile Management (register, login, profile management)
- Epic 3: Content Creation & Management (create, edit, publish, organize content)
- Epic 4: Content Discovery & Interaction (browse, search, share, comment)

❌ **WRONG - Technical Layer Breakdown:**

- Epic 1: Database Schema & Models
- Epic 2: REST API Endpoints
- Epic 3: Frontend Components
- Epic 4: Authentication Service

**PRESENT YOUR EPIC STRUCTURE:**

For each proposed epic, provide:

- **Epic Title**: Value-based, not technical
- **User Value Statement**: What users can accomplish after this epic
- **PRD Coverage**: Which FRs this epic addresses
- **Technical Context**: How this leverages Architecture decisions
- **UX Integration**: How this incorporates user experience patterns (if available)
- **Dependencies**: What must come before (natural dependencies only)

**FOUNDATION EPIC GUIDELINES:**

For Epic 1, include technical foundation based on Architecture:

- Project setup and build system
- Core infrastructure and deployment pipeline
- Database schema setup
- Basic authentication foundation
- API framework setup

This enables all subsequent user-facing epics.
</action>

<template-output>epics_structure_plan</template-output>
<template-output>epics_technical_context</template-output>
</step>

<step n="2" goal="Create detailed stories with complete implementation context" repeat="for-each-epic">
<action>**EPIC {{N}} - COMPREHENSIVE STORY CREATION:**</action>

<action>For Epic {{N}}: {{epic_title}}, create bite-sized stories that incorporate ALL available context.

**STORY CREATION WITH FULL CONTEXT:**

For each story, you now have the complete picture:

- **WHAT to build** (from PRD FRs)
- **HOW to build it** (from Architecture decisions)
- **HOW users interact** (from UX patterns, if available)

**TRANSFORM STRATEGIC REQUIREMENTS INTO TACTICAL IMPLEMENTATION:**

PRD says: "Users can create accounts"
Architecture says: "Use PostgreSQL with bcrypt hashing, JWT tokens, rate limiting"
UX says: "Modal dialog with email/password fields, real-time validation, loading states"

Your story becomes: Specific implementation details with exact acceptance criteria

**STORY PATTERN FOR EACH EPIC {{N}}:**

**Epic Goal:** {{epic_goal}}

For each story M in Epic {{N}}:

- **User Story**: As a [user type], I want [specific capability], So that [value/benefit]
- **Acceptance Criteria**: BDD format with COMPLETE implementation details
- **Technical Implementation**: Specific guidance from Architecture
- **User Experience**: Exact interaction patterns from UX (if available)
- **Prerequisites**: Only previous stories, never forward dependencies

**DETAILED ACCEPTANCE CRITERIA GUIDELINES:**

Include ALL implementation specifics:

**From Architecture:**

- Exact API endpoints and contracts
- Database operations and validations
- Authentication/authorization requirements
- Error handling patterns
- Performance requirements
- Security considerations
- Integration points with other systems

**From UX (if available):**

- Specific screen/page references
- Interaction patterns and behaviors
- Form validation rules and error messages
- Responsive behavior
- Accessibility requirements
- Loading states and transitions
- Success/error feedback patterns

**From PRD:**

- Business rules and constraints
- User types and permissions
- Compliance requirements
- Success criteria

**STORY SIZING PRINCIPLE:**

Each story must be completable by a single dev agent in one focused session. If a story becomes too large, break it down further while maintaining user value.

**EXAMPLE RICH STORY:**

**Story:** User Registration with Email Verification

As a new user, I want to create an account using my email address, So that I can access the platform's features.

**Acceptance Criteria:**
Given I am on the landing page
When I click the "Sign Up" button
Then the registration modal opens (UX Mockup 3.2)

And I see email and password fields with proper labels
And the email field validates RFC 5322 format in real-time
And the password field shows strength meter (red→yellow→green)
And I see "Password must be 8+ chars with 1 uppercase, 1 number, 1 special"

When I submit valid registration data
Then POST /api/v1/auth/register is called (Architecture section 4.1)
And the user record is created in users table with bcrypt hash (Architecture 6.2)
And a verification email is sent via SendGrid (Architecture 7.3)
And I see "Check your email for verification link" message
And I cannot log in until email is verified

**Technical Notes:**

- Use PostgreSQL users table (Architecture section 6.2)
- Implement rate limiting: 3 attempts per hour per IP (Architecture 8.1)
- Return JWT token on successful verification (Architecture 5.2)
- Log registration events to audit_events table (Architecture 9.4)
- Form validation follows UX Design patterns (UX section 4.1)

**Prerequisites:** Epic 1.1 - Foundation Setup Complete
</action>

<action>**Generate all stories for Epic {{N}}**</action>
<template-output>epic*title*{{N}}</template-output>
<template-output>epic*goal*{{N}}</template-output>

<action>For each story M in epic {{N}}, generate story content</action>
<template-output>story*{{N}}*{{M}}</template-output>

<action>**EPIC {{N}} COMPLETION REVIEW:**</action>

<output>**Epic {{N}} Complete: {{epic_title}}**

Stories Created: {{count}}

**FR Coverage:** {{list of FRs covered by this epic}}

**Technical Context Used:** {{Architecture sections referenced}}

{{if ux_design_content}}
**UX Patterns Incorporated:** {{UX sections referenced}}
{{/if}}

Ready for checkpoint validation.</output>

<template-output>epic\_{{N}}\_complete</template-output>
</step>

<step n="3" goal="Final validation and coverage matrix">
<action>**COMPREHENSIVE VALIDATION WITH FULL CONTEXT:**</action>

<action>Review the complete epic and story breakdown for quality and completeness using ALL available context.

**FR COVERAGE VALIDATION:**

Create complete FR Coverage Matrix showing every PRD functional requirement mapped to specific stories:

- **FR1:** [description] → Epic X, Story X.Y (with implementation details)
- **FR2:** [description] → Epic Y, Story Y.A (with implementation details)
- **FR3:** [description] → Epic Z, Story Z.B (with implementation details)
- ...

**CRITICAL VALIDATION:** Every single FR from the PRD must be covered by at least one story with complete acceptance criteria.

**ARCHITECTURE INTEGRATION VALIDATION:**

Verify that Architecture decisions are properly implemented:

- All API endpoints from Architecture are covered in stories
- Data models from Architecture are properly created and populated
- Authentication/authorization patterns are consistently applied
- Performance requirements are addressed in relevant stories
- Security measures are implemented where required
- Error handling follows Architecture patterns
- Integration points between systems are properly handled

**UX INTEGRATION VALIDATION** {{if ux_design_content}}:

Verify that UX design patterns are properly implemented:

- User flows follow the designed journey
- Screen layouts and components match specifications
- Interaction patterns work as designed
- Responsive behavior matches breakpoints
- Accessibility requirements are met
- Error states and feedback patterns are implemented
- Form validation follows UX guidelines
- Loading states and transitions are implemented
  {{/if}}

**STORY QUALITY VALIDATION:**

- All stories are sized for single dev agent completion
- Acceptance criteria are specific and testable
- Technical implementation guidance is clear
- User experience details are incorporated
- No forward dependencies exist
- Epic sequence delivers incremental value
- Foundation epic properly enables subsequent work

**FINAL QUALITY CHECK:**

Answer these critical questions:

1. **User Value:** Does each epic deliver something users can actually do/use?
2. **Completeness:** Are ALL PRD functional requirements covered?
3. **Technical Soundness:** Do stories properly implement Architecture decisions?
4. **User Experience:** {{if ux_design_content}} Do stories follow UX design patterns? {{/if}}
5. **Implementation Ready:** Can dev agents implement these stories autonomously?
   </action>

<output>**✅ EPIC AND STORY CREATION COMPLETE**

**Output Generated:** epics.md with comprehensive implementation details

**Full Context Incorporated:**

- ✅ PRD functional requirements and scope
- ✅ Architecture technical decisions and contracts
  {{if ux_design_content}}
- ✅ UX Design interaction patterns and specifications
  {{/if}}

**FR Coverage:** {{count}} functional requirements mapped to {{story_count}} stories
**Epic Structure:** {{epic_count}} epics delivering incremental user value

**Ready for Phase 4:** Sprint Planning and Development Implementation
</output>

<template-output>final_validation</template-output>
<template-output>fr_coverage_matrix</template-output>
</step>

</workflow>
