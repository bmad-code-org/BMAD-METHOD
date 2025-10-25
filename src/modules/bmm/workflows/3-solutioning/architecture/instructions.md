# Decision Architecture Workflow Instructions

<workflow name="architecture">

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication style based on {user_skill_level}</critical>
<critical>The goal is ARCHITECTURAL DECISIONS that prevent AI agent conflicts, not detailed implementation specs</critical>
<critical>Communicate all responses in {communication_language} and tailor to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow replaces architecture with a conversation-driven approach</critical>

<step n="0" goal="Validate workflow and extract project configuration">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>**⚠️ No Workflow Status File Found**

The Decision Architecture workflow requires a status file to understand your project context.

Please run `workflow-init` first to:

- Define your project type and level
- Map out your workflow journey
- Create the status file

Run: `workflow-init`

After setup, return here to create your decision architecture.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>

  <check if="project_level < 3">
    <output>**Note: Level {{project_level}} Project**

Decision Architecture is typically for Level 3-4 projects, but can be used for any project that needs architectural planning.

For Level {{project_level}}, we'll keep the architecture appropriately scoped.
</output>
</check>
</check>
</step>

<step n="0.5" goal="Validate workflow sequencing">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: architecture</param>
</invoke-workflow>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue with Decision Architecture anyway? (y/n)</ask>
  <check if="n">
    <output>{{suggestion}}</output>
    <action>Exit workflow</action>
  </check>
</check>

<action>Check for existing PRD and epics files using fuzzy matching</action>

<action>Fuzzy match PRD file: {prd_file}</action>
<check if="PRD_not_found">
<output>**PRD Not Found**

Decision Architecture works from your Product Requirements Document (PRD).

Looking for: bmm-PRD.md, PRD.md, or product-requirements.md in {output_folder}

Please run the PRD workflow first to define your requirements.

Run: `workflow prd`
</output>
<action>Exit workflow - PRD required</action>
</check>

</step>

<step n="1" goal="Load and understand project context">
  <action>Load the PRD using fuzzy matching: {prd_file}</action>
  <action>Load epics file using fuzzy matching: {epics_file}</action>

<action>Check for UX specification using fuzzy matching:
<action>Attempt to locate: {ux_spec_file}</action>
<check if="ux_spec_found">
<action>Load UX spec and extract architectural implications: - Component complexity (simple forms vs rich interactions) - Animation/transition requirements - Real-time update needs (live data, collaborative features) - Platform-specific UI requirements - Accessibility standards (WCAG compliance level) - Responsive design breakpoints - Offline capability requirements - Performance expectations (load times, interaction responsiveness)
</action>
</check>
</action>

<action>Extract and understand from PRD: - Functional Requirements (what it must do) - Non-Functional Requirements (performance, security, compliance, etc.) - Epic structure and user stories - Acceptance criteria - Any technical constraints mentioned
</action>

<action>Count and assess project scale: - Number of epics: {{epic_count}} - Number of stories: {{story_count}} - Complexity indicators (real-time, multi-tenant, regulated, etc.) - UX complexity level (if UX spec exists)
</action>

<action>Reflect understanding back to {user_name}:
"I'm reviewing your project documentation for {{project_name}}.
I see {{epic_count}} epics with {{story_count}} total stories.
{{if_ux_spec}}I also found your UX specification which defines the user experience requirements.{{/if_ux_spec}}

     Key aspects I notice:
     - [Summarize core functionality]
     - [Note critical NFRs]
     {{if_ux_spec}}- [Note UX complexity and requirements]{{/if_ux_spec}}
     - [Identify unique challenges]

     This will help me guide you through the architectural decisions needed
     to ensure AI agents implement this consistently."

  </action>

<ask>Does this match your understanding of the project?</ask>
<template-output>project_context_understanding</template-output>
</step>

<step n="2" goal="Discover and evaluate starter templates">
  <critical>Modern starter templates make many good architectural decisions by default</critical>

<action>Based on PRD analysis, identify the primary technology domain: - Web application → Look for Next.js, Vite, Remix starters - Mobile app → Look for React Native, Expo, Flutter starters - API/Backend → Look for NestJS, Express, Fastify starters - CLI tool → Look for CLI framework starters - Full-stack → Look for T3, RedwoodJS, Blitz starters
</action>

  <check if="ux_spec_loaded">
    <action>Consider UX requirements when selecting starter:
      - Rich animations → Framer Motion compatible starter
      - Complex forms → React Hook Form included starter
      - Real-time features → Socket.io or WebSocket ready starter
      - Accessibility focus → WCAG-compliant component library starter
      - Design system → Storybook-enabled starter
    </action>
  </check>

<action>Search for relevant starter templates:
<WebSearch>{{primary_technology}} starter template CLI create command latest 2024</WebSearch>
<WebSearch>{{primary_technology}} boilerplate generator latest options</WebSearch>
</action>

  <check if="starter_templates_found">
    <action>Investigate what each starter provides:
      <WebSearch>{{starter_name}} default setup technologies included latest</WebSearch>
      <WebSearch>{{starter_name}} project structure file organization</WebSearch>
    </action>

    <check if="{user_skill_level} == 'expert'">
      <action>Present starter options concisely:
        "Found {{starter_name}} which provides:
         {{quick_decision_list}}

         This would establish our base architecture. Use it?"
      </action>
    </check>

    <check if="{user_skill_level} == 'beginner'">
      <action>Explain starter benefits:
        "I found {{starter_name}}, which is like a pre-built foundation for your project.

         Think of it like buying a prefab house frame instead of cutting each board yourself.

         It makes these decisions for you:
         {{friendly_decision_list}}

         This is a great starting point that follows best practices. Should we use it?"
      </action>
    </check>

    <ask>Use {{starter_name}} as the foundation? (recommended) [y/n]</ask>

    <check if="user_accepts_starter">
      <action>Get current starter command and options:
        <WebSearch>{{starter_name}} CLI command options flags latest 2024</WebSearch>
      </action>

      <action>Document the initialization command:
        Store command: {{full_starter_command_with_options}}
        Example: "npx create-next-app@latest my-app --typescript --tailwind --app"
      </action>

      <action>Extract and document starter-provided decisions:
        Starter provides these architectural decisions:
        - Language/TypeScript: {{provided_or_not}}
        - Styling solution: {{provided_or_not}}
        - Testing framework: {{provided_or_not}}
        - Linting/Formatting: {{provided_or_not}}
        - Build tooling: {{provided_or_not}}
        - Project structure: {{provided_pattern}}
      </action>

      <action>Mark these decisions as "PROVIDED BY STARTER" in our decision tracking</action>

      <action>Note for first implementation story:
        "Project initialization using {{starter_command}} should be the first implementation story"
      </action>
    </check>

    <check if="user_rejects_starter">
      <ask>Any specific reason to avoid the starter? (helps me understand constraints)</ask>
      <action>Note: Manual setup required, all decisions need to be made explicitly</action>
    </check>

  </check>

  <check if="no_starter_found_or_applicable">
    <action>Note: No standard starter template found for this project type.
            Will need to make all architectural decisions explicitly.</action>
  </check>

<template-output>starter_template_decision</template-output>
</step>

<step n="3" goal="Adapt facilitation style and identify remaining decisions">
  <action>Based on {user_skill_level} from config, set facilitation approach:

  <check if="{user_skill_level} == 'expert'">
    Set mode: EXPERT
    - Use technical terminology freely
    - Move quickly through decisions
    - Assume familiarity with patterns and tools
    - Focus on edge cases and advanced concerns
  </check>

  <check if="{user_skill_level} == 'intermediate'">
    Set mode: INTERMEDIATE
    - Balance technical accuracy with clarity
    - Explain complex patterns briefly
    - Confirm understanding at key points
    - Provide context for non-obvious choices
  </check>

  <check if="{user_skill_level} == 'beginner'">
    Set mode: BEGINNER
    - Use analogies and real-world examples
    - Explain technical concepts in simple terms
    - Provide education about why decisions matter
    - Protect from complexity overload
  </check>
  </action>

<action>Load decision catalog: {decision_catalog}</action>
<action>Load architecture patterns: {architecture_patterns}</action>

<action>Analyze PRD against patterns to identify needed decisions: - Match functional requirements to known patterns - Identify which categories of decisions are needed - Flag any novel/unique aspects requiring special attention - Consider which decisions the starter template already made (if applicable)
</action>

<action>Create decision priority list:
CRITICAL (blocks everything): - {{list_of_critical_decisions}}

    IMPORTANT (shapes architecture):
    - {{list_of_important_decisions}}

    NICE-TO-HAVE (can defer):
    - {{list_of_optional_decisions}}

  </action>

<action>Announce plan to {user_name} based on mode:
<check if="mode == 'EXPERT'">
"Based on your PRD, we need to make {{total_decision_count}} architectural decisions.
{{starter_covered_count}} are covered by the starter template.
Let's work through the remaining {{remaining_count}} decisions."
</check>

    <check if="mode == 'BEGINNER'">
      "Great! I've analyzed your requirements and found {{total_decision_count}} technical
       choices we need to make. Don't worry - I'll guide you through each one and explain
       why it matters. {{if_starter}}The starter template handles {{starter_covered_count}}
       of these automatically.{{/if_starter}}"
    </check>

  </action>

<template-output>decision_identification</template-output>
</step>

<step n="4" goal="Facilitate collaborative decision making" repeat="for-each-decision">
  <critical>Each decision must be made WITH the user, not FOR them</critical>
  <critical>ALWAYS verify current versions using WebSearch - NEVER trust hardcoded versions</critical>

<action>For each decision in priority order:</action>

<action>Present the decision based on mode:
<check if="mode == 'EXPERT'">
"{{Decision_Category}}: {{Specific_Decision}}
Options: {{concise_option_list_with_tradeoffs}}
Recommendation: {{recommendation}} for {{reason}}"
</check>

    <check if="mode == 'INTERMEDIATE'">
      "Next decision: {{Human_Friendly_Category}}

       We need to choose {{Specific_Decision}}.

       Common options:
       {{option_list_with_brief_explanations}}

       For your project, {{recommendation}} would work well because {{reason}}."
    </check>

    <check if="mode == 'BEGINNER'">
      "Let's talk about {{Human_Friendly_Category}}.

       {{Educational_Context_About_Why_This_Matters}}

       Think of it like {{real_world_analogy}}.

       Your main options:
       {{friendly_options_with_pros_cons}}

       My suggestion: {{recommendation}}
       This is good for you because {{beginner_friendly_reason}}."
    </check>

  </action>

  <check if="decision_involves_specific_technology">
    <action>Verify current stable version:
      <WebSearch>{{technology}} latest stable version 2024</WebSearch>
      <WebSearch>{{technology}} current LTS version</WebSearch>
    </action>

    <action>Update decision record with verified version:
      Technology: {{technology}}
      Verified Version: {{version_from_search}}
      Verification Date: {{today}}
    </action>

  </check>

<ask>What's your preference? (or 'explain more' for details)</ask>

  <check if="user_wants_more_info">
    <action>Provide deeper explanation appropriate to skill level</action>
    <check if="complex_tradeoffs">
      <action>Consider using advanced elicitation:
        "Would you like to explore innovative approaches to this decision?
         I can help brainstorm unconventional solutions if you have specific goals."
      </action>
    </check>
  </check>

<action>Record decision:
Category: {{category}}
Decision: {{user_choice}}
Version: {{verified_version_if_applicable}}
Affects Epics: {{list_of_affected_epics}}
Rationale: {{user_reasoning_or_default}}
Provided by Starter: {{yes_if_from_starter}}
</action>

<action>Check for cascading implications:
"This choice means we'll also need to {{related_decisions}}"
</action>

<template-output>decision_record</template-output>
</step>

<step n="5" goal="Address cross-cutting concerns">
  <critical>These decisions affect EVERY epic and story</critical>

<action>Facilitate decisions for consistency patterns: - Error handling strategy (How will all agents handle errors?) - Logging approach (Structured? Format? Levels?) - Date/time handling (Timezone? Format? Library?) - Authentication pattern (Where? How? Token format?) - API response format (Structure? Status codes? Errors?) - Testing strategy (Unit? Integration? E2E?)
</action>

  <check if="{user_skill_level} == 'beginner'">
    <action>Explain why these matter:
      "These are rules that EVERY part of your app must follow.
       If we don't decide now, each AI agent will do it differently,
       and your app won't work properly when the pieces come together."
    </action>
  </check>

<template-output>cross_cutting_decisions</template-output>
</step>

<step n="6" goal="Define project structure and boundaries">
  <action>Based on all decisions made, define the project structure</action>

<action>Create comprehensive source tree: - Root configuration files - Source code organization - Test file locations - Build/dist directories - Documentation structure
</action>

<action>Map epics to architectural boundaries:
"Epic: {{epic_name}} → Lives in {{module/directory/service}}"
</action>

<action>Define integration points: - Where do components communicate? - What are the API boundaries? - How do services interact?
</action>

<template-output>project_structure</template-output>
</step>

<step n="7" goal="Design novel architectural patterns" optional="true">
  <critical>Some projects require INVENTING new patterns, not just choosing existing ones</critical>

<action>Scan PRD for concepts that don't have standard solutions: - Novel interaction patterns (e.g., "swipe to match" before Tinder existed) - Unique multi-component workflows (e.g., "viral invitation system") - New data relationships (e.g., "social graph" before Facebook) - Unprecedented user experiences (e.g., "ephemeral messages" before Snapchat) - Complex state machines crossing multiple epics
</action>

  <check if="novel_patterns_detected">
    <action>For each novel pattern identified:</action>

    <action>Engage user in design collaboration:
      <check if="{user_skill_level} == 'expert'">
        "The {{pattern_name}} concept requires architectural innovation.

         Core challenge: {{challenge_description}}

         Let's design the component interaction model:"
      </check>

      <check if="{user_skill_level} == 'beginner'">
        "Your idea about {{pattern_name}} is unique - there isn't a standard way to build this yet!

         This is exciting - we get to invent the architecture together.

         Let me help you think through how this should work:"
      </check>
    </action>

    <action>Facilitate pattern design:
      1. Identify core components involved
      2. Map data flow between components
      3. Design state management approach
      4. Create sequence diagrams for complex flows
      5. Define API contracts for the pattern
      6. Consider edge cases and failure modes
    </action>

    <action>Use advanced elicitation for innovation:
      "What if we approached this differently?
       - What would the ideal user experience look like?
       - Are there analogies from other domains we could apply?
       - What constraints can we challenge?"
    </action>

    <action>Document the novel pattern:
      Pattern Name: {{pattern_name}}
      Purpose: {{what_problem_it_solves}}
      Components:
        {{component_list_with_responsibilities}}
      Data Flow:
        {{sequence_description_or_diagram}}
      Implementation Guide:
        {{how_agents_should_build_this}}
      Affects Epics:
        {{epics_that_use_this_pattern}}
    </action>

    <action>Validate pattern completeness:
      "Does this {{pattern_name}} design cover all the use cases in your epics?
       - {{use_case_1}}: ✓ Handled by {{component}}
       - {{use_case_2}}: ✓ Handled by {{component}}
       ..."
    </action>

  </check>

  <check if="no_novel_patterns">
    <action>Note: All patterns in this project have established solutions.
            Proceeding with standard architectural patterns.</action>
  </check>

<template-output>novel_pattern_designs</template-output>
</step>

<step n="8" goal="Define implementation patterns to prevent agent conflicts">
  <critical>These patterns ensure multiple AI agents write compatible code</critical>
  <critical>Focus on what agents could decide DIFFERENTLY if not specified</critical>

<action>Load pattern categories: {pattern_categories}</action>

<action>Based on chosen technologies, identify potential conflict points:
"Given that we're using {{tech_stack}}, agents need consistency rules for:"
</action>

<action>For each relevant pattern category, facilitate decisions:

    NAMING PATTERNS (How things are named):
    <check if="has_api">
      - REST endpoint naming: /users or /user? Plural or singular?
      - Route parameter format: :id or {id}?
    </check>
    <check if="has_database">
      - Table naming: users or Users or user?
      - Column naming: user_id or userId?
      - Foreign key format: user_id or fk_user?
    </check>
    <check if="has_frontend">
      - Component naming: UserCard or user-card?
      - File naming: UserCard.tsx or user-card.tsx?
    </check>

    STRUCTURE PATTERNS (How things are organized):
    - Where do tests live? __tests__/ or *.test.ts co-located?
    - How are components organized? By feature or by type?
    - Where do shared utilities go?

    FORMAT PATTERNS (Data exchange formats):
    <check if="has_api">
      - API response wrapper? {data: ..., error: ...} or direct response?
      - Error format? {message, code} or {error: {type, detail}}?
      - Date format in JSON? ISO strings or timestamps?
    </check>

    COMMUNICATION PATTERNS (How components interact):
    <check if="has_events">
      - Event naming convention?
      - Event payload structure?
    </check>
    <check if="has_state_management">
      - State update pattern?
      - Action naming convention?
    </check>

    LIFECYCLE PATTERNS (State and flow):
    - How are loading states handled?
    - What's the error recovery pattern?
    - How are retries implemented?

    LOCATION PATTERNS (Where things go):
    - API route structure?
    - Static asset organization?
    - Config file locations?

    CONSISTENCY PATTERNS (Cross-cutting):
    - How are dates formatted in the UI?
    - What's the logging format?
    - How are user-facing errors written?

  </action>

  <check if="{user_skill_level} == 'expert'">
    <action>Rapid-fire through patterns:
      "Quick decisions on implementation patterns:
       - {{pattern}}: {{suggested_convention}} OK? [y/n/specify]"
    </action>
  </check>

  <check if="{user_skill_level} == 'beginner'">
    <action>Explain each pattern's importance:
      "Let me explain why this matters:
       If one AI agent names database tables 'users' and another names them 'Users',
       your app will crash. We need to pick one style and make sure everyone follows it."
    </action>
  </check>

<action>Document implementation patterns:
Category: {{pattern_category}}
Pattern: {{specific_pattern}}
Convention: {{decided_convention}}
Example: {{concrete_example}}
Enforcement: "All agents MUST follow this pattern"
</action>

<template-output>implementation_patterns</template-output>
</step>

<step n="9" goal="Validate architectural coherence">
  <action>Run coherence checks:</action>

<action>Check decision compatibility: - Do all decisions work together? - Are there any conflicting choices? - Do the versions align properly?
</action>

<action>Verify epic coverage: - Does every epic have architectural support? - Are all user stories implementable with these decisions? - Are there any gaps?
</action>

<action>Validate pattern completeness: - Are there any patterns we missed that agents would need? - Do novel patterns integrate with standard architecture? - Are implementation patterns comprehensive enough?
</action>

  <check if="issues_found">
    <action>Address issues with {user_name}:
      "I notice {{issue_description}}.
       We should {{suggested_resolution}}."
    </action>
    <ask>How would you like to resolve this?</ask>
    <action>Update decisions based on resolution</action>
  </check>

<template-output>coherence_validation</template-output>
</step>

<step n="10" goal="Generate decision architecture document">
  <critical>The document must be complete, specific, and validation-ready</critical>
  <critical>This is the consistency contract for all AI agents</critical>

<action>Load template: {architecture_template}</action>

<action>Generate sections: 1. Executive Summary (2-3 sentences about the architecture approach) 2. Project Initialization (starter command if applicable) 3. Decision Summary Table (with verified versions and epic mapping) 4. Complete Project Structure (full tree, no placeholders) 5. Epic to Architecture Mapping (every epic placed) 6. Technology Stack Details (versions, configurations) 7. Integration Points (how components connect) 8. Novel Pattern Designs (if any were created) 9. Implementation Patterns (all consistency rules) 10. Consistency Rules (naming, organization, formats) 11. Data Architecture (models and relationships) 12. API Contracts (request/response formats) 13. Security Architecture (auth, authorization, data protection) 14. Performance Considerations (from NFRs) 15. Deployment Architecture (where and how) 16. Development Environment (setup and prerequisites) 17. Architecture Decision Records (key decisions with rationale)
</action>

<action>Fill template with all collected decisions and patterns</action>

<action>Ensure starter command is first implementation story:
<check if="using_starter_template">
"## Project Initialization

       First implementation story should execute:
       ```bash
       {{starter_command_with_options}}
       ```

       This establishes the base architecture with these decisions:
       {{starter_provided_decisions}}"
    </check>

  </action>

<template-output>architecture_document</template-output>
</step>

<step n="11" goal="Validate document completeness">
  <action>Load validation checklist: {installed_path}/checklist.md</action>

<action>Run validation checklist from {installed_path}/checklist.md</action>

<action>Verify MANDATORY items:
□ Decision table has Version column with specific versions
□ Every epic is mapped to architecture components
□ Source tree is complete, not generic
□ No placeholder text remains
□ All FRs from PRD have architectural support
□ All NFRs from PRD are addressed
□ Implementation patterns cover all potential conflicts
□ Novel patterns are fully documented (if applicable)
</action>

  <check if="validation_failed">
    <action>Fix missing items automatically</action>
    <goto step="10">Regenerate document section</goto>
  </check>

<template-output>validation_results</template-output>
</step>

<step n="12" goal="Final review and update workflow status">
  <action>Present completion summary:</action>

  <check if="{user_skill_level} == 'expert'">
    "Architecture complete. {{decision_count}} decisions documented.
     Ready for implementation phase."
  </check>

  <check if="{user_skill_level} == 'beginner'">
    "Excellent! Your architecture is complete. You made {{decision_count}} important
     decisions that will keep AI agents consistent as they build your app.

     What happens next:
     1. AI agents will read this architecture before implementing each story
     2. They'll follow your technical choices exactly
     3. Your app will be built with consistent patterns throughout

     You're ready to move to the implementation phase!"

  </check>

<action>Save document to {output_folder}/architecture.md</action>

  <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
    <param>mode: update</param>
    <param>action: complete_workflow</param>
    <param>workflow_name: architecture</param>
  </invoke-workflow>

  <check if="success == true">
    <output>✅ Decision Architecture workflow complete!

Status updated.
</output>

  </check>

<output>**Deliverables Created:**

- ✅ architecture.md - Complete architectural decisions document
  {{if_novel_patterns}}
- ✅ Novel pattern designs for unique concepts
  {{/if_novel_patterns}}
  {{if_starter_template}}
- ✅ Project initialization command documented
  {{/if_starter_template}}

The architecture is ready to guide AI agents through consistent implementation.

**Next Steps:**

- **Next required:** {{next_workflow}} ({{next_agent}} agent)
- Review the architecture.md document before proceeding

Check status anytime with: `workflow-status`
</output>

<template-output>completion_summary</template-output>
</step>

</workflow>
