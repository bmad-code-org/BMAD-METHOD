# PRD Workflow - Intent-Driven Product Planning

<critical-rules>
- <critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
- <critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
- <critical>This workflow uses INTENT-DRIVEN PLANNING - adapt organically to product type and context</critical>
- <critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
- <critical>Generate all documents in {document_output_language}</critical>
- <critical>LIVING DOCUMENT: Write to PRD.md continuously as you discover - never wait until the end</critical>
- <critical>GUIDING PRINCIPLE: Identify what makes this product special and ensure it's reflected throughout the PRD</critical>
- <critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>
- <critical>⚠️ CHECKPOINT PROTOCOL: After EVERY template-output tag, you MUST follow workflow.xml substep 2c. </critical>
- <critical>YOU ARE FACILITATING A CONVERSATION With a user to produce a final document step by step. The whole process is meant to be collaborative helping the user flesh out their ideas</critical>
</critical-rules>
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
</output>
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
  3. Detect project type AND domain complexity using data-driven classification
  </action>

<action>Load classification data files COMPLETELY:

- Load {project_types_data} - contains project type definitions, detection signals, and requirements
- Load {domain_complexity_data} - contains domain classifications, complexity levels, and special requirements

Parse CSV structure:

- project_types_data has columns: project_type, detection_signals, key_questions, required_sections, skip_sections, web_search_triggers, innovation_signals
- domain_complexity_data has columns: domain, signals, complexity, key_concerns, required_knowledge, suggested_workflow, web_searches, special_sections

Store these in memory for use throughout the workflow.
</action>

<action>Begin natural discovery conversation:
"Tell me about what you want to build - what problem does it solve and for whom?"

As the user describes their product, listen for signals to classify:

1. PROJECT TYPE classification
2. DOMAIN classification
   </action>

<action>DUAL DETECTION - Use CSV data to match:

**Project Type Detection:**

- Compare user's description against detection_signals from each row in project_types_data
- Look for keyword matches (semicolon-separated in CSV)
- Identify best matching project_type (api_backend, mobile_app, saas_b2b, developer_tool, cli_tool, web_app, game, desktop_app, iot_embedded, blockchain_web3)
- If multiple matches, ask clarifying question
- Store matched project_type value

**Domain Detection:**

- Compare user's description against signals from each row in domain_complexity_data
- Match domain keywords (semicolon-separated in CSV)
- Identify domain (healthcare, fintech, govtech, edtech, aerospace, automotive, scientific, legaltech, insuretech, energy, gaming, general)
- Get complexity level from matched row (high/medium/low/redirect)
- Store matched domain and complexity_level values

**Special Cases from CSV:**

- If project_type = "game" → Use project_types_data row to get redirect message
- If domain = "gaming" → Use domain_complexity_data redirect action
- If complexity = "high" → Note suggested_workflow and web_searches from domain row
  </action>

<action>SPECIAL ROUTING based on detected values:

**If game detected (from project_types_data):**
"Game development requires the BMGD module (BMad Game Development) which has specialized workflows for game design."
Exit workflow and redirect to BMGD.

**If complex domain detected (complexity = "high" from domain_complexity_data):**
Extract suggested_workflow and web_searches from the matched domain row.
Offer domain research options:
A) Run {suggested_workflow} workflow (thorough) - from CSV
B) Quick web search using {web_searches} queries - from CSV
C) User provides their own domain context
D) Continue with general knowledge

Present the options and WAIT for user choice.
</action>

<action>IDENTIFY WHAT MAKES IT SPECIAL early in conversation:
Ask questions like:

- "What excites you most about this product?"
- "What would make users love this?"
- "What's the unique value or compelling moment?"
- "What makes this different from alternatives?"

Capture this differentiator - it becomes a thread connecting throughout the PRD.
</action>

<template-output>vision_alignment</template-output>
<template-output>project_classification</template-output>
<template-output>project_type</template-output>
<template-output>domain_type</template-output>
<template-output>complexity_level</template-output>
<check if="complexity_level == 'high'">
<template-output>domain_context_summary</template-output>
</check>
<template-output>product_differentiator</template-output>
<template-output>product_brief_path</template-output>
<template-output>domain_brief_path</template-output>
<template-output>research_documents</template-output>

<critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

  <checkpoint title="Discovery Complete">
    <display>[a] Advanced Elicitation [c] Continue [p] Party Mode</display>
    <checkpoint-handlers>
      <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
      <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
      <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
    </checkpoint-handlers>
  </checkpoint>

</step>

<step n="2" goal="Success Definition">
  <action>Define what winning looks like for THIS specific product

**User Success First**
Ask:

- "What would make a user say 'this was worth it'?"
- "What moment makes them tell a friend about this?"
- "After [key journey], what outcome are they walking away with?"

**Business Success Second**
Ask:

- "What does success look like for your business at 3 months? 12 months?"
- "Is this about revenue, user growth, engagement, something else?"
- "What metric would make you say 'this is working'?"

**Make It Specific**
Challenge vague metrics:

- NOT: "10,000 users" → "What kind of users? Doing what?"
- NOT: "99.9% uptime" → "What's the real concern - data loss? Failed payments?"
- NOT: "Fast" → "How fast, and what specifically needs to be fast?"

Ask: "Can we measure this? How would you know if you hit it?"

**Connect to Differentiator**
Bring it back to the core:
"So success means users experience [differentiator] and achieve [outcome] - does that capture it?"

Adapt success criteria to context:

- Consumer: User love, engagement, retention
- B2B: ROI, efficiency, adoption
- Developer tools: Developer experience, community
- Regulated: Compliance, safety, validation</action>

  <template-output>success_criteria</template-output>
  <check if="business focus">
  <template-output>business_metrics</template-output>
  </check>

  <action>Smart scope negotiation - find the sweet spot based on success:

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
  <critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

    <checkpoint title="Success and Scope Complete">
      <display>[a] Advanced Elicitation [c] Continue [p] Party Mode [u] User Interview</display>
      <checkpoint-handlers>
        <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
        <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
        <on-select key="u">Load and execute {party_mode} but the party will include the users from the User Journeys section. The discussion can start with each user saying hello and giving their initial thoughts, then return to this checkpoint.</on-select>
        <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
      </checkpoint-handlers>
    </checkpoint>
  </step>

<step n="3" goal="User Journeys">
<critical>This step covers ALL user types - end users, admins, moderators, support, API consumers. If a human interacts with the system, there's a journey. No journey = no FRs = doesn't exist.</critical>

<action>Identify all user types first:

Before exploring journeys, ask the user:

"Besides the primary user, who else interacts with this system?"

Consider these common user types:

- End users (primary)
- Admins - manage users, settings, content
- Moderators - review flagged content, enforce rules
- Support staff - help users, investigate issues
- API consumers - if dev tool or platform
- Internal ops - analytics, monitoring, billing

List all user types before proceeding.</action>

<action>Create detailed narrative user journeys with personas:

For each user type identified, create rich, detailed journeys following this pattern:

**Journey Creation Process:**

**1. Develop the Persona**
Give them a name, context, and motivation:

- **Name**: Realistic name (Maria, Marcus, Jordan, etc.)
- **Backstory**: Who they are, what they want, why they need this
- **Motivation**: Core problem they're trying to solve
- **Emotional state**: How they feel about solving this problem

Example: "Maria is a working parent who wants to cook healthy meals for her family but struggles with meal planning and limited evening time. She's tired of the same rotating dishes and wants inspiration that fits her schedule."

**2. Map Their Complete Journey**
Document their end-to-end experience:

- **Entry point**: How they discover and access the product
- **Key steps**: Each touchpoint in sequence (use arrows →)
- **Critical actions**: What they do at each step
- **Decision points**: Choices they make
- **Success moment**: Where they achieve their goal
- **Exit point**: How the journey concludes

**3. Use This Exact Format for Each Journey:**

**Journey [Number]: [Persona Name] - [Journey Theme]**
[Persona description with backstory and motivation]

- [Entry point] → [step 1] → [step 2] → [step 3] → [critical moment] → [step N] → [completion]

**4. Explore Journey Details Conversationally**
For each journey, ask:

- "What happens at each step specifically?"
- "What could go wrong here? What's the recovery path?"
- "What information do they need to see/hear?"
- "What's their emotional state at each point?"
- "Where does this journey succeed or fail?"

**5. Connect Journeys to Requirements**
After each journey, explicitly state:
"This journey reveals requirements for:"

- List specific capability areas (e.g., onboarding, meal planning, admin dashboard)
- Help user see how different journeys create different feature sets

**Example Output Structure:**

**Journey 1: Maria - First Recipe Discovery**
Maria is a working parent who wants to cook healthy meals for her family but struggles with meal planning...

- Discovers via search → lands on recipe page → signs up → completes preferences → browses recommendations → saves first recipe → adds to meal plan

**Journey 2: [Persona] - [Theme]**
[Persona description with context]

- [Step sequence] → [critical moment] → [completion]

**Journey 3: [Admin/Support Persona] - [Admin Theme]**
[Admin persona description]

- [Admin workflow] → [decision point] → [system outcome]</action>

<action>Guide journey exploration to cover all key areas:

**Aim for 3-4 journeys minimum:**

1. Primary user - happy path (core experience)
2. Primary user - edge case (different goal, error recovery)
3. Secondary user (admin, moderator, support, etc.)
4. API consumer (if applicable)

**Ask after each:** "Another journey? We should cover [suggest uncovered user type]"

**Use journeys to reveal requirements:**
Each journey reveals different capabilities needed:

- Admin journey → admin dashboard, user management
- Support journey → ticket system, user lookup tools
- API journey → documentation, rate limiting, keys
- Error recovery → retry mechanisms, help content</action>

<template-output>user_journeys</template-output>
<critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

<checkpoint title="User Journeys Complete">
  <display>[a] Advanced Elicitation [c] Continue [p] Party Mode [u] User Interview</display>
  <checkpoint-handlers>
    <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
    <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
    <on-select key="u">Load and execute {party_mode} but the party will include the users from the User Journeys section. The discussion can start with each user saying hello and giving their initial thoughts, then return to this checkpoint.</on-select>
    <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
  </checkpoint-handlers>
</checkpoint>
</step>

<step n="5" goal="Domain-Specific Exploration" optional="true">
<critical>This step is DATA-DRIVEN using {domain_complexity_data} CSV loaded in Step 1</critical>

<action>Retrieve domain-specific configuration from CSV:

1. Find the row in {domain_complexity_data} where domain column matches the detected {domain} from Step 1
2. Extract these columns from the matched row:
   - key_concerns (semicolon-separated list)
   - required_knowledge (describes what expertise is needed)
   - web_searches (suggested search queries if research needed)
   - special_sections (semicolon-separated list of domain-specific sections to document)
3. Parse the semicolon-separated values into lists
4. Store for use in this step
   </action>

<action>Explore domain-specific requirements using key_concerns from CSV:

Parse key_concerns into individual concern areas.
For each concern:

- Ask the user about their approach to this concern
- Discuss implications for the product
- Document requirements, constraints, and compliance needs

Example for healthcare domain:
If key_concerns = "FDA approval;Clinical validation;HIPAA compliance;Patient safety;Medical device classification;Liability"
Then explore:

- "Will this product require FDA approval? What classification?"
- "How will you validate clinical accuracy and safety?"
- "What HIPAA compliance measures are needed?"
- "What patient safety protocols must be in place?"
- "What liability considerations affect the design?"

Synthesize domain requirements that will shape everything:

- Regulatory requirements (from key_concerns)
- Compliance needs (from key_concerns)
- Industry standards (from required_knowledge)
- Safety/risk factors (from key_concerns)
- Required validations (from key_concerns)
- Special expertise needed (from required_knowledge)

These inform:

- What features are mandatory
- What NFRs are critical
- How to sequence development
- What validation is required
  </action>

  <template-output>domain_considerations</template-output>

<action>Generate domain-specific special sections if defined:
Parse special_sections list from the matched CSV row.
For each section name, generate corresponding template-output.

Example mappings from CSV:

- "clinical_requirements" → <template-output>clinical_requirements</template-output>
- "regulatory_pathway" → <template-output>regulatory_pathway</template-output>
- "safety_measures" → <template-output>safety_measures</template-output>
- "compliance_matrix" → <template-output>compliance_matrix</template-output>
  </action>
  </check>
  <critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

<checkpoint title="Domain Exploration Complete">
  <display>[a] Advanced Elicitation [c] Continue [p] Party Mode [u] User Interview</display>
  <checkpoint-handlers>
    <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
    <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
    <on-select key="u">Load and execute {party_mode} but the party will include the users from the User Journeys section. The discussion can start with each user saying hello and giving their initial thoughts, then return to this checkpoint.</on-select>
    <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
  </checkpoint-handlers>
</checkpoint>
  </step>

<step n="6" goal="Innovation Discovery" optional="true">
<critical>This step uses innovation_signals from project_types_data CSV loaded in Step 1</critical>

<action>Check for innovation in this product:

1. Retrieve innovation_signals from the project_type row in {project_types_data}
2. Parse the semicolon-separated innovation signals specific to this project type
3. Listen for these signals in user's description and throughout conversation

Example for api_backend:
innovation_signals = "API composition;New protocol"

Example for mobile_app:
innovation_signals = "Gesture innovation;AR/VR features"

Example for saas_b2b:
innovation_signals = "Workflow automation;AI agents"
</action>

<action>Listen for general innovation signals in conversation:

User language indicators:

- "Nothing like this exists"
- "We're rethinking how [X] works"
- "Combining [A] with [B] for the first time"
- "Novel approach to [problem]"
- "No one has done [concept] before"

Project-type-specific signals (from CSV innovation_signals column):

- Match user's descriptions against the innovation_signals for their project_type
- If matches found, flag as innovation opportunity
  </action>

<action>If innovation detected (general OR project-type-specific):

Explore deeply:

- What makes it unique?
- What assumption are you challenging?
- How do we validate it works?
- What's the fallback if it doesn't?
- Has anyone tried this before?

Use web_search_triggers from project_types_data CSV if relevant:
<WebSearch if="novel">{web_search_triggers} {concept} innovations {date}</WebSearch>
</action>

<check if="innovation detected">
  <template-output>innovation_patterns</template-output>
  <template-output>validation_approach</template-output>
</check>
<critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

<checkpoint title="Innovation Discovery Complete">
  <display>[a] Advanced Elicitation [c] Continue [p] Party Mode [u] User Interview</display>
  <checkpoint-handlers>
    <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
    <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
    <on-select key="u">Load and execute {party_mode} but the party will include the users from the User Journeys section. The discussion can start with each user saying hello and giving their initial thoughts, then return to this checkpoint.</on-select>
    <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
  </checkpoint-handlers>
</checkpoint>
</step>

<step n="7" goal="Project-Specific Deep Dive">
<critical>This step is DATA-DRIVEN using project_types_data CSV loaded in Step 1</critical>

<action>Retrieve project-specific configuration from CSV:

1. Find the row in {project_types_data} where project_type column matches the detected {project_type} from Step 1
2. Extract these columns from the matched row:
   - key_questions (semicolon-separated list)
   - required_sections (semicolon-separated list)
   - skip_sections (semicolon-separated list)
   - innovation_signals (semicolon-separated list)
3. Parse the semicolon-separated values into lists
4. Store for use in this step
   </action>

<action>Conduct guided discovery using key_questions from CSV:

Parse key_questions into individual questions.
For each question:

- Ask the user naturally in conversational style
- Listen for their response
- Ask clarifying follow-ups as needed
- Connect answers to product value proposition

Example flow:
If key_questions = "Endpoints needed?;Authentication method?;Data formats?"
Then ask:

- "What are the main endpoints your API needs to expose?"
- "How will you handle authentication and authorization?"
- "What data formats will you support for requests and responses?"

Adapt questions to the user's context and skill level.
</action>

<action>Document project-type-specific requirements:

Based on the user's answers to key_questions, synthesize comprehensive requirements for this project type.

Cover the areas indicated by required_sections from CSV (semicolon-separated list).
Skip areas indicated by skip_sections from CSV.

For each required section:

- Summarize what was discovered
- Document specific requirements, constraints, and decisions
- Connect to product differentiator when relevant

Always connect requirements to product value:
"How does [requirement] support the product's core value proposition?"
</action>

<template-output>project_type_requirements</template-output>

<!-- Dynamic template outputs based on required_sections from CSV -->

<action>Generate dynamic template outputs based on required_sections:

Parse required_sections list from the matched CSV row.
For each section name in the list, generate a corresponding template-output.

Common mappings (adapt based on actual CSV values):

- "endpoint_specs" or "endpoint_specification" → <template-output>endpoint_specification</template-output>
- "auth_model" or "authentication_model" → <template-output>authentication_model</template-output>
- "platform_reqs" or "platform_requirements" → <template-output>platform_requirements</template-output>
- "device_permissions" or "device_features" → <template-output>device_features</template-output>
- "tenant_model" → <template-output>tenant_model</template-output>
- "rbac_matrix" or "permission_matrix" → <template-output>permission_matrix</template-output>

Generate all outputs dynamically - do not hardcode specific project types.
</action>

<note>Example CSV row for api_backend:
key_questions = "Endpoints needed?;Authentication method?;Data formats?;Rate limits?;Versioning?;SDK needed?"
required_sections = "endpoint_specs;auth_model;data_schemas;error_codes;rate_limits;api_docs"
skip_sections = "ux_ui;visual_design;user_journeys"

The LLM should parse these and generate corresponding template outputs dynamically.

**Template Variable Strategy:**
The prd-template.md has common template variables defined (endpoint_specification, authentication_model, platform_requirements, device_features, tenant_model, permission_matrix).

For required_sections that match these common variables:

- Generate the specific template-output (e.g., endpoint_specs → endpoint_specification)
- These will render in their own subsections in the template

For required_sections that DON'T have matching template variables:

- Include the content in the main project_type_requirements variable
- This ensures all requirements are captured even if template doesn't have dedicated sections

This hybrid approach balances template structure with CSV-driven flexibility.
</note>
<critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

<checkpoint title="Project-Specific Deep Dive Complete">
  <display>[a] Advanced Elicitation [c] Continue [p] Party Mode [u] User Interview</display>
  <checkpoint-handlers>
    <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
    <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
    <on-select key="u">Load and execute {party_mode} but the party will include the users from the User Journeys section. The discussion can start with each user saying hello and giving their initial thoughts, then return to this checkpoint.</on-select>
    <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
  </checkpoint-handlers>
</checkpoint>
</step>

<step n="9" goal="Functional Requirements Synthesis">
<critical>This section is THE CAPABILITY CONTRACT for all downstream work</critical>
<critical>UX designers will ONLY design what's listed here</critical>
<critical>Architects will ONLY support what's listed here</critical>
<critical>Epic breakdown will ONLY implement what's listed here</critical>
<critical>If a capability is missing from FRs, it will NOT exist in the final product</critical>

<action>Before writing FRs, understand their PURPOSE and USAGE:

**Purpose:**
FRs define WHAT capabilities the product must have. They are the complete inventory
of user-facing and system capabilities that deliver the product vision.

**Notice:**
✅ Each FR is a testable capability
✅ Each FR is implementation-agnostic (could be built many ways)
✅ Each FR specifies WHO and WHAT, not HOW
✅ No UI details, no performance numbers, no technology choices
✅ Comprehensive coverage of capability areas

**How They Will Be Used:**

1. UX Designer reads FRs → designs interactions for each capability
2. Architect reads FRs → designs systems to support each capability
3. PM reads FRs → creates epics and stories to implement each capability

**Critical Property - COMPLETENESS:**
Every capability discussed in vision, scope, domain requirements, and project-specific
sections MUST be represented as an FR. Missing FRs = missing capabilities.

**Critical Property - ALTITUDE:**
FRs state WHAT capability exists and WHO it serves, NOT HOW it's implemented or
specific UI/UX details. Those come later from UX and Architecture.
</action>

<action>Transform everything discovered into comprehensive functional requirements:

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
- ...

**Data Ownership (local-first products):**

- FR10: All user data stored locally on user's device
- FR11: Users can export complete data at any time
- ...

**Collaboration:**

- FR14: Users can share content with specific users or teams
- FR15: Users can comment on shared content
- ...

</example>

<action>Generate the complete FR list by systematically extracting capabilities from all discussed so far for all that is in scope.

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

COMPLETENESS GATE: Review your FR list against the entire PRD written so far and think hard - did you miss anything? Add it now before proceeding.
</action>

<template-output>functional_requirements_complete</template-output>
<critical>You MUST display the checkpoint display and HALT for user input, unless the user enabled YOLO mode.</critical>

<checkpoint title="Functional Requirements Complete">
  <display>[a] Advanced Elicitation [c] Continue [p] Party Mode [u] User Interview</display>
  <checkpoint-handlers>
    <on-select key="a">Load and execute {advanced_elicitation} task, then return to this checkpoint</on-select>
    <on-select key="p">Load and execute {party_mode}, then return to this checkpoint</on-select>
    <on-select key="u">Load and execute {party_mode} but the party will include the users from the User Journeys section. The discussion can start with each user saying hello and giving their initial thoughts, then return to this checkpoint.</on-select>
    <on-select key="c"> Ensure all content is written to {default_output_file}</on-select>
  </checkpoint-handlers>
</checkpoint>
</step>

<step n="10" goal="Non-Functional Requirements Discovery">
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

<step n="11" goal="Complete PRD and determine next steps">
<action>Announce that the PRD is complete and the unused sections will be cleaned up from the output document!</action>

<action>CRITICAL: Clean up the PRD document before validation:

Before running validation, you MUST remove any empty sections from the generated PRD:

1. **Scan for empty sections** - Look for sections with no meaningful content (just whitespace or placeholder text)
2. **Remove entire empty sections** - Delete the section header and any empty content
3. **Keep relevant sections only** - If a project type doesn't need certain sections (e.g., API specs for a mobile app), remove those sections entirely
4. **Ensure document flows logically** - The final PRD should only contain sections with actual content

**This cleanup step is essential because:**

- The template includes all possible sections for maximum flexibility
- Not all sections apply to every project type
- Empty sections make the PRD look incomplete and unprofessional
- Validation expects meaningful content in all included sections

**Example:** If building a CLI tool, you'd typically remove: API Specification, Platform Support, Device Capabilities, Multi-Tenancy Architecture, User Experience Principles sections.</action>

<check if="standalone_mode != true">
  <action>Load the FULL file: {status_file}</action>
  <action>Update workflow_status["prd"] = "{default_output_file}"</action>
  <action>Save file, preserving ALL comments and structure</action>

<action>Check workflow path to determine next expected workflows:

- Look for "create-epics-and-stories" as optional after PRD
- Look for "create-ux-design" as conditional (if_has_ui)
- Look for "create-epics-and-stories-after-ux" as optional
- Identify the required next phase workflow
  </action>
  </check>

<output>**✅ PRD Complete, {user_name}!**

**Next Steps:**

**Typical next workflows:**

1. `workflow create-ux-design` - UX Design (if UI exists)
2. `workflow create-architecture` - Technical architecture
3. `workflow create-epics-and-stories` - Epic breakdown

**Note:** Epics can be created at any point but have richer detail when created after UX/Architecture.

</output>
</step>

</workflow>
