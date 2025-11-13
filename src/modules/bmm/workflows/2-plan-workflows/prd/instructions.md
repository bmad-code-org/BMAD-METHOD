# PRD Workflow - Intent-Driven Product Planning

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses INTENT-DRIVEN PLANNING - adapt organically to product type and context</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to PRD.md continuously as you discover - never wait until the end</critical>
<critical>GUIDING PRINCIPLE: Identify what makes this product special and ensure it's reflected throughout the PRD</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>

<workflow>

<step n="0" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {status_file} exists</action>

<action if="status file not found">Set standalone_mode = true</action>

<check if="status file found">
  <action>Load the FULL file: {status_file}</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "prd" workflow</action>
  <action>Get project_track from YAML metadata</action>
  <action>Find first non-completed workflow (next expected workflow)</action>

  <check if="project_track is Quick Flow">
    <output>**Quick Flow Track - Redirecting**

Quick Flow projects use tech-spec workflow for implementation-focused planning.
PRD is for BMad Method and Enterprise Method tracks that need comprehensive requirements.</output>
<action>Exit and suggest tech-spec workflow</action>
</check>

  <check if="prd status is file path (already completed)">
    <output>⚠️ PRD already completed: {{prd status}}</output>
    <ask>Re-running will overwrite the existing PRD. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

<action>Set standalone_mode = false</action>
</check>
</step>

<step n="0.5" goal="Discover and load input documents">
<invoke-protocol name="discover_inputs" />
<note>After discovery, these content variables are available: {product_brief_content}, {research_content}, {document_project_content}</note>
</step>

<step n="1" goal="Discovery - Project, Domain, and Vision">
<action>Welcome {user_name} and begin comprehensive discovery, and then start to GATHER ALL CONTEXT:
1. Check workflow-status.yaml for project_context (if exists)
2. Review loaded content: {product_brief_content}, {research_content}, {document_project_content} (auto-loaded in Step 0.5)
3. Detect project type AND domain complexity

Load references:
{installed_path}/project-types.csv
{installed_path}/domain-complexity.csv

Through natural conversation:
"Tell me about what you want to build - what problem does it solve and for whom?"

DUAL DETECTION:
Project type signals: API, mobile, web, CLI, SDK, SaaS
Domain complexity signals: medical, finance, government, education, aerospace

SPECIAL ROUTING:
If game detected → Inform user that game development requires the BMGD module (BMad Game Development)
If complex domain detected → Offer domain research options:
A) Run domain-research workflow (thorough)
B) Quick web search (basic)
C) User provides context
D) Continue with general knowledge

IDENTIFY WHAT MAKES IT SPECIAL early with questions such as: "What excites you most about this product?", "What would make users love this?", "What's the unique value or compelling moment?"

This becomes a thread that connects throughout the PRD.</action>

<template-output>vision_alignment</template-output>
<template-output>project_classification</template-output>
<template-output>project_type</template-output>
<template-output>domain_type</template-output>
<template-output>complexity_level</template-output>
<check if="complex domain">
<template-output>domain_context_summary</template-output>
</check>
<template-output>product_differentiator</template-output>
<template-output>product_brief_path</template-output>
<template-output>domain_brief_path</template-output>
<template-output>research_documents</template-output>
</step>

<step n="2" goal="Success Definition">
<action>Define what winning looks like for THIS specific product

INTENT: Meaningful success criteria, not generic metrics

Adapt to context:

- Consumer: User love, engagement, retention
- B2B: ROI, efficiency, adoption
- Developer tools: Developer experience, community
- Regulated: Compliance, safety, validation

Make it specific:

- NOT: "10,000 users"
- BUT: "100 power users who rely on it daily"

- NOT: "99.9% uptime"
- BUT: "Zero data loss during critical operations"

Connect to what makes the product special:

- "Success means users experience [key value moment] and achieve [desired outcome]"</action>

<template-output>success_criteria</template-output>
<check if="business focus">
<template-output>business_metrics</template-output>
</check>
</step>

<step n="3" goal="Scope Definition">
<action>Smart scope negotiation - find the sweet spot

The Scoping Game:

1. "What must work for this to be useful?" → MVP
2. "What makes it competitive?" → Growth
3. "What's the dream version?" → Vision

Challenge scope creep conversationally:

- "Could that wait until after launch?"
- "Is that essential for proving the concept?"

For complex domains:

- Include compliance minimums in MVP
- Note regulatory gates between phases</action>

<template-output>mvp_scope</template-output>
<template-output>growth_features</template-output>
<template-output>vision_features</template-output>
</step>

<step n="4" goal="Domain-Specific Exploration" optional="true">
<action>Only if complex domain detected or domain-brief exists

Synthesize domain requirements that will shape everything:

- Regulatory requirements
- Compliance needs
- Industry standards
- Safety/risk factors
- Required validations
- Special expertise needed

These inform:

- What features are mandatory
- What NFRs are critical
- How to sequence development
- What validation is required</action>

<check if="complex domain">
  <template-output>domain_considerations</template-output>
</check>
</step>

<step n="5" goal="Innovation Discovery" optional="true">
<action>Identify truly novel patterns if applicable

Listen for innovation signals:

- "Nothing like this exists"
- "We're rethinking how [X] works"
- "Combining [A] with [B] for the first time"

Explore deeply:

- What makes it unique?
- What assumption are you challenging?
- How do we validate it?
- What's the fallback?

<WebSearch if="novel">{concept} innovations {date}</WebSearch></action>

<check if="innovation detected">
  <template-output>innovation_patterns</template-output>
  <template-output>validation_approach</template-output>
</check>
</step>

<step n="6" goal="Project-Specific Deep Dive">
<action>Based on detected project type, dive deep into specific needs

Load project type requirements from CSV and expand naturally.

FOR API/BACKEND:

- Map out endpoints, methods, parameters
- Define authentication and authorization
- Specify error codes and rate limits
- Document data schemas

FOR MOBILE:

- Platform requirements (iOS/Android/both)
- Device features needed
- Offline capabilities
- Store compliance

FOR SAAS B2B:

- Multi-tenant architecture
- Permission models
- Subscription tiers
- Critical integrations

[Continue for other types...]

Always connect requirements to product value:
"How does [requirement] support the product's core value proposition?"</action>

<template-output>project_type_requirements</template-output>

<!-- Dynamic sections based on project type -->
<check if="API/Backend project">
  <template-output>endpoint_specification</template-output>
  <template-output>authentication_model</template-output>
</check>

<check if="Mobile project">
  <template-output>platform_requirements</template-output>
  <template-output>device_features</template-output>
</check>

<check if="SaaS B2B project">
  <template-output>tenant_model</template-output>
  <template-output>permission_matrix</template-output>
</check>
</step>

<step n="7" goal="UX Principles" if="project has UI or UX">
  <action>Only if product has a UI

Light touch on UX - not full design:

- Visual personality
- Key interaction patterns
- Critical user flows

"How should this feel to use?"
"What's the vibe - professional, playful, minimal?"

Connect UX to product vision:
"The UI should reinforce [core value proposition] through [design approach]"</action>

  <check if="has UI">
    <template-output>ux_principles</template-output>
    <template-output>key_interactions</template-output>
  </check>
</step>

<step n="8" goal="Functional Requirements Synthesis">
<critical>This section is THE CAPABILITY CONTRACT for all downstream work</critical>
<critical>UX designers will ONLY design what's listed here</critical>
<critical>Architects will ONLY support what's listed here</critical>
<critical>Epic breakdown will ONLY implement what's listed here</critical>
<critical>If a capability is missing from FRs, it will NOT exist in the final product</critical>

<action>Before writing FRs, understand their PURPOSE and USAGE:

**Purpose:**
FRs define WHAT capabilities the product must have. They are the complete inventory
of user-facing and system capabilities that deliver the product vision.

**How They Will Be Used:**

1. UX Designer reads FRs → designs interactions for each capability
2. Architect reads FRs → designs systems to support each capability
3. PM reads FRs → creates epics and stories to implement each capability
4. Dev Agent reads assembled context → implements stories based on FRs

**Critical Property - COMPLETENESS:**
Every capability discussed in vision, scope, domain requirements, and project-specific
sections MUST be represented as an FR. Missing FRs = missing capabilities.

**Critical Property - ALTITUDE:**
FRs state WHAT capability exists and WHO it serves, NOT HOW it's implemented or
specific UI/UX details. Those come later from UX and Architecture.
</action>

<action>Transform everything discovered into comprehensive functional requirements:

**Coverage - Pull from EVERYWHERE:**

- Core features from MVP scope → FRs
- Growth features → FRs (marked as post-MVP if needed)
- Domain-mandated features → FRs
- Project-type specific needs → FRs
- Innovation requirements → FRs
- Anti-patterns (explicitly NOT doing) → Note in FR section if needed

**Organization - Group by CAPABILITY AREA:**
Don't organize by technology or layer. Group by what users/system can DO:

- ✅ "User Management" (not "Authentication System")
- ✅ "Content Discovery" (not "Search Algorithm")
- ✅ "Team Collaboration" (not "WebSocket Infrastructure")

**Format - Flat, Numbered List:**
Each FR is one clear capability statement:

- FR#: [Actor] can [capability] [context/constraint if needed]
- Number sequentially (FR1, FR2, FR3...)
- Aim for 20-50 FRs for typical projects (fewer for simple, more for complex)

**Altitude Check:**
Each FR should answer "WHAT capability exists?" NOT "HOW is it implemented?"

- ✅ "Users can customize appearance settings"
- ❌ "Users can toggle light/dark theme with 3 font size options stored in LocalStorage"

The second example belongs in Epic Breakdown, not PRD.
</action>

<example>
**Well-written FRs at the correct altitude:**

**User Account & Access:**

- FR1: Users can create accounts with email or social authentication
- FR2: Users can log in securely and maintain sessions across devices
- FR3: Users can reset passwords via email verification
- FR4: Users can update profile information and preferences
- FR5: Administrators can manage user roles and permissions

**Content Management:**

- FR6: Users can create, edit, and delete content items
- FR7: Users can organize content with tags and categories
- FR8: Users can search content by keyword, tag, or date range
- FR9: Users can export content in multiple formats

**Data Ownership (local-first products):**

- FR10: All user data stored locally on user's device
- FR11: Users can export complete data at any time
- FR12: Users can import previously exported data
- FR13: System monitors storage usage and warns before limits

**Collaboration:**

- FR14: Users can share content with specific users or teams
- FR15: Users can comment on shared content
- FR16: Users can track content change history
- FR17: Users receive notifications for relevant updates

**Notice:**
✅ Each FR is a testable capability
✅ Each FR is implementation-agnostic (could be built many ways)
✅ Each FR specifies WHO and WHAT, not HOW
✅ No UI details, no performance numbers, no technology choices
✅ Comprehensive coverage of capability areas
</example>

<action>Generate the complete FR list by systematically extracting capabilities:

1. MVP scope → extract all capabilities → write as FRs
2. Growth features → extract capabilities → write as FRs (note if post-MVP)
3. Domain requirements → extract mandatory capabilities → write as FRs
4. Project-type specifics → extract type-specific capabilities → write as FRs
5. Innovation patterns → extract novel capabilities → write as FRs

Organize FRs by logical capability groups (5-8 groups typically).
Number sequentially across all groups (FR1, FR2... FR47).
</action>

<action>SELF-VALIDATION - Before finalizing, ask yourself:

**Completeness Check:**

1. "Did I cover EVERY capability mentioned in the MVP scope section?"
2. "Did I include domain-specific requirements as FRs?"
3. "Did I cover the project-type specific needs (API/Mobile/SaaS/etc)?"
4. "Could a UX designer read ONLY the FRs and know what to design?"
5. "Could an Architect read ONLY the FRs and know what to support?"
6. "Are there any user actions or system behaviors we discussed that have no FR?"

**Altitude Check:**

1. "Am I stating capabilities (WHAT) or implementation (HOW)?"
2. "Am I listing acceptance criteria or UI specifics?" (Remove if yes)
3. "Could this FR be implemented 5 different ways?" (Good - means it's not prescriptive)

**Quality Check:**

1. "Is each FR clear enough that someone could test whether it exists?"
2. "Is each FR independent (not dependent on reading other FRs to understand)?"
3. "Did I avoid vague terms like 'good', 'fast', 'easy'?" (Use NFRs for quality attributes)

COMPLETENESS GATE: Review your FR list against the entire PRD written so far.
Did you miss anything? Add it now before proceeding.
</action>

<template-output>functional_requirements_complete</template-output>
</step>

<step n="9" goal="Non-Functional Requirements Discovery">
<action>Only document NFRs that matter for THIS product

Performance: Only if user-facing impact
Security: Only if handling sensitive data
Scale: Only if growth expected
Accessibility: Only if broad audience
Integration: Only if connecting systems

For each NFR:

- Why it matters for THIS product
- Specific measurable criteria
- Domain-driven requirements

Skip categories that don't apply!</action>

<!-- Only output sections that were discussed -->
<check if="performance matters">
  <template-output>performance_requirements</template-output>
</check>
<check if="security matters">
  <template-output>security_requirements</template-output>
</check>
<check if="scale matters">
  <template-output>scalability_requirements</template-output>
</check>
<check if="accessibility matters">
  <template-output>accessibility_requirements</template-output>
</check>
<check if="integration matters">
  <template-output>integration_requirements</template-output>
</check>
</step>

<step n="10" goal="Review PRD and transition to epics">
<action>Review the PRD we've built together

"Let's review what we've captured:

- Vision: [summary]
- Success: [key metrics]
- Scope: [MVP highlights]
- Requirements: [count] functional, [count] non-functional
- Special considerations: [domain/innovation]

Does this capture your product vision?"</action>

<template-output>prd_summary</template-output>

<action>After PRD review and refinement complete:

"Excellent! Now we need to break these requirements into implementable epics and stories.

For the epic breakdown, you have two options:

1. Start a new session focused on epics (recommended for complex projects)
2. Continue here (I'll transform requirements into epics now)

Which would you prefer?"

If new session:
"To start epic planning in a new session:

1. Save your work here
2. Start fresh and run: workflow epics-stories
3. It will load your PRD and create the epic breakdown

This keeps each session focused and manageable."

If continue:
"Let's continue with epic breakdown here..."
[Proceed with epics-stories subworkflow]
Set project_track based on workflow status (BMad Method or Enterprise Method)
Generate epic_details for the epics breakdown document</action>

<template-output>project_track</template-output>
<template-output>epic_details</template-output>
</step>

<step n="11" goal="Complete PRD and suggest next steps">
<template-output>product_value_summary</template-output>

<check if="standalone_mode != true">
  <action>Load the FULL file: {status_file}</action>
  <action>Update workflow_status["prd"] = "{default_output_file}"</action>
  <action>Save file, preserving ALL comments and structure</action>
</check>

<output>**✅ PRD Complete, {user_name}!**

Your product requirements are documented and ready for implementation.

**Created:**

- **PRD.md** - Complete requirements adapted to {project_type} and {domain}

**Next Steps:**

1. **Epic Breakdown** (Required)
   Run: `workflow create-epics-and-stories` to decompose requirements into implementable stories

2. **UX Design** (If UI exists)
   Run: `workflow ux-design` for detailed user experience design

3. **Architecture** (Recommended)
   Run: `workflow create-architecture` for technical architecture decisions

What makes your product special - {product_value_summary} - is captured throughout the PRD and will guide all subsequent work.
</output>
</step>

</workflow>
