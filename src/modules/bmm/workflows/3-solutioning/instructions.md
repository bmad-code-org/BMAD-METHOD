# Solution Architecture Workflow Instructions

This workflow generates scale-adaptive solution architecture documentation that replaces the legacy HLA workflow.

```xml
<workflow name="solution-architecture">

<step n="0" goal="Load project analysis, validate prerequisites, and scale assessment">
<action>
1. Read project-workflow-analysis.md:
   Path: {{project_workflow_analysis_path}}

2. Extract:
   - project_level: {{0|1|2|3|4}}
   - field_type: {{greenfield|brownfield}}
   - project_type: {{web|mobile|embedded|game|library}}
   - has_user_interface: {{true|false}}
   - ui_complexity: {{none|simple|moderate|complex}}
   - ux_spec_path: /docs/ux-spec.md (if exists)
   - prd_status: {{complete|incomplete}}

3. Validate Prerequisites (BLOCKING):

   Check 1: PRD complete?
   IF prd_status != complete:
     ❌ STOP WORKFLOW
     Output: "PRD is required before solution architecture.

             REQUIRED: Complete PRD with FRs, NFRs, epics, and stories.

             Run: workflow plan-project

             After PRD is complete, return here to run solution-architecture workflow."
     END

   Check 2: UX Spec complete (if UI project)?
   IF has_user_interface == true AND ux_spec_missing:
     ❌ STOP WORKFLOW
     Output: "UX Spec is required before solution architecture for UI projects.

             REQUIRED: Complete UX specification before proceeding.

             Run: workflow ux-spec

             The UX spec will define:
             - Screen/page structure
             - Navigation flows
             - Key user journeys
             - UI/UX patterns and components
             - Responsive requirements
             - Accessibility requirements

             Once complete, the UX spec will inform:
             - Frontend architecture and component structure
             - API design (driven by screen data needs)
             - State management strategy
             - Technology choices (component libraries, animation, etc.)
             - Performance requirements (lazy loading, code splitting)

             After UX spec is complete at /docs/ux-spec.md, return here to run solution-architecture workflow."
     END

   Check 3: All prerequisites met?
   IF all prerequisites met:
     ✅ Prerequisites validated
     - PRD: complete
     - UX Spec: {{complete | not_applicable}}
     Proceeding with solution architecture workflow...

4. Determine workflow path:
   IF project_level == 0:
     - Skip solution architecture entirely
     - Output: "Level 0 project - validate/update tech-spec.md only"
     - STOP WORKFLOW
   ELSE:
     - Proceed with full solution architecture workflow
</action>
<template-output>prerequisites_and_scale_assessment</template-output>
</step>

<step n="1" goal="Deep requirements document and spec analysis">
<action>
1. Determine requirements document type based on project_type:
   - IF project_type == "game":
     Primary Doc: Game Design Document (GDD)
     Path: {{gdd_path}} OR {{prd_path}}/GDD.md
   - ELSE:
     Primary Doc: Product Requirements Document (PRD)
     Path: {{prd_path}}

2. Read primary requirements document:
   Read: {{determined_path}}

   Extract based on document type:

   IF GDD (Game):
   - Game concept and genre
   - Core gameplay mechanics
   - Player progression systems
   - Game world/levels/scenes
   - Characters and entities
   - Win/loss conditions
   - Game modes (single-player, multiplayer, etc.)
   - Technical requirements (platform, performance targets)
   - Art/audio direction
   - Monetization (if applicable)

   IF PRD (Non-Game):
   - All Functional Requirements (FRs)
   - All Non-Functional Requirements (NFRs)
   - All Epics with user stories
   - Technical constraints mentioned
   - Integrations required (payments, email, etc.)

3. Read UX Spec (if project has UI):
   IF has_user_interface == true:
     Read: {{ux_spec_path}}

     Extract:
     - All screens/pages (list every screen defined)
     - Navigation structure (how screens connect, patterns)
     - Key user flows (auth, onboarding, checkout, core features)
     - UI complexity indicators:
       * Complex wizards/multi-step forms
       * Real-time updates/dashboards
       * Complex state machines
       * Rich interactions (drag-drop, animations)
       * Infinite scroll, virtualization needs
     - Component patterns (from design system/wireframes)
     - Responsive requirements (mobile-first, desktop-first, adaptive)
     - Accessibility requirements (WCAG level, screen reader support)
     - Design system/tokens (colors, typography, spacing if specified)
     - Performance requirements (page load times, frame rates)

4. Cross-reference requirements + specs:
   IF GDD + UX Spec (game with UI):
   - Each gameplay mechanic should have UI representation
   - Each scene/level should have visual design
   - Player controls mapped to UI elements

   IF PRD + UX Spec (non-game):
   - Each epic should have corresponding screens/flows in UX spec
   - Each screen should support epic stories
   - FRs should have UI manifestation (where applicable)
   - NFRs (performance, accessibility) should inform UX patterns
   - Identify gaps: Epics without screens, screens without epic mapping

5. Detect characteristics:
   - Project type(s): web, mobile, embedded, game, library, desktop
   - UI complexity: simple (CRUD) | moderate (dashboards) | complex (wizards/real-time)
   - Architecture style hints: monolith, microservices, modular, etc.
   - Repository strategy hints: monorepo, polyrepo, hybrid
   - Special needs: real-time, event-driven, batch, offline-first

6. Identify what's already specified vs. unknown
   - Known: Technologies explicitly mentioned in PRD/UX spec
   - Unknown: Gaps that need decisions

Output summary:
- Project understanding
- UI/UX summary (if applicable):
  * Screen count: N screens
  * Navigation complexity: simple | moderate | complex
  * UI complexity: simple | moderate | complex
  * Key user flows documented
- PRD-UX alignment check: Gaps identified (if any)
</action>
<template-output>prd_and_ux_analysis</template-output>
</step>

<step n="2" goal="User skill level and preference clarification">
<ask>
What's your experience level with {{project_type}} development?

1. Beginner - Need detailed explanations and guidance
2. Intermediate - Some explanations helpful
3. Expert - Concise output, minimal explanations

Your choice (1/2/3):
</ask>

<action>
Set user_skill_level variable for adaptive output:
- beginner: Verbose explanations, examples, rationale for every decision
- intermediate: Moderate explanations, key rationale, balanced detail
- expert: Concise, decision-focused, minimal prose

This affects ALL subsequent output verbosity.
</action>

<ask optional="true">
Any technical preferences or constraints I should know?
- Preferred languages/frameworks?
- Required platforms/services?
- Team expertise areas?
- Existing infrastructure (brownfield)?

(Press enter to skip if none)
</ask>

<action>
Record preferences for narrowing recommendations.
</action>
</step>

<step n="3" goal="Determine architecture pattern">
<action>
Determine the architectural pattern based on requirements:

1. Architecture style:
   - Monolith (single application)
   - Microservices (multiple services)
   - Serverless (function-based)
   - Other (event-driven, JAMstack, etc.)

2. Repository strategy:
   - Monorepo (single repo)
   - Polyrepo (multiple repos)
   - Hybrid

3. Pattern-specific characteristics:
   - For web: SSR vs SPA vs API-only
   - For mobile: Native vs cross-platform vs hybrid vs PWA
   - For game: 2D vs 3D vs text-based vs web
   - For backend: REST vs GraphQL vs gRPC vs realtime
   - For data: ETL vs ML vs analytics vs streaming
   - Etc.
</action>

<ask>
Based on your requirements, I need to determine the architecture pattern:

1. Architecture style: {{suggested_style}} - Does this sound right? (or specify: monolith/microservices/serverless/other)

2. Repository strategy: {{suggested_repo_strategy}} - Monorepo or polyrepo?

{{project_type_specific_questions}}
</ask>

<elicit-required/>
<template-output>architecture_pattern</template-output>
</step>

<step n="4" goal="Epic analysis and component boundaries">
<action>
1. Analyze each epic from PRD:
   - What domain capabilities does it require?
   - What data does it operate on?
   - What integrations does it need?

2. Identify natural component/service boundaries:
   - Vertical slices (epic-aligned features)
   - Shared infrastructure (auth, logging, etc.)
   - Integration points (external services)

3. Determine architecture style:
   - Single monolith vs. multiple services
   - Monorepo vs. polyrepo
   - Modular monolith vs. microservices

4. Map epics to proposed components (high-level only)
</action>
<template-output>component_boundaries</template-output>
</step>

<step n="5" goal="Project-type-specific architecture questions">
<action>
1. Load project types registry:
   Read: {{installed_path}}/project-types/project-types.csv

2. Match detected project_type to CSV:
   - Use project_type from Step 1 (e.g., "web", "mobile", "backend")
   - Find matching row in CSV
   - Get question_file path

3. Load project-type-specific questions:
   Read: {{installed_path}}/project-types/{{question_file}}

4. Ask only UNANSWERED questions (dynamic narrowing):
   - Skip questions already answered by reference architecture
   - Skip questions already specified in PRD
   - Focus on gaps and ambiguities

5. Record all decisions with rationale

NOTE: For hybrid projects (e.g., "web + mobile"), load multiple question files
</action>

<ask>
{{project_type_specific_questions}}
</ask>

<elicit-required/>
<template-output>architecture_decisions</template-output>
</step>

<step n="6" goal="Generate solution architecture document with dynamic template">
<action>
Sub-step 6.1: Load Appropriate Template

1. Analyze project to determine:
   - Project type(s): {{web|mobile|embedded|game|library|cli|desktop|data|backend|infra|extension}}
   - Architecture style: {{monolith|microservices|serverless|etc}}
   - Repository strategy: {{monorepo|polyrepo|hybrid}}
   - Primary language(s): {{TypeScript|Python|Rust|etc}}

2. Search template registry:
   Read: {{installed_path}}/templates/registry.csv

   Filter WHERE:
   - project_types = {{project_type}}
   - architecture_style = {{determined_style}}
   - repo_strategy = {{determined_strategy}}
   - languages matches {{language_preference}} (if specified)
   - tags overlap with {{requirements}}

3. Select best matching row:
   Get {{template_path}} and {{guide_path}} from matched CSV row
   Example template: "web-fullstack-architecture.md", "game-engine-architecture.md", etc.
   Example guide: "game-engine-unity-guide.md", "game-engine-godot-guide.md", etc.

4. Load markdown template:
   Read: {{installed_path}}/templates/{{template_path}}

   This template contains:
   - Complete document structure with all sections
   - {{placeholder}} variables to fill (e.g., {{project_name}}, {{framework}}, {{database_schema}})
   - Pattern-specific sections (e.g., SSR sections for web, gameplay sections for games)
   - Specialist recommendations (e.g., audio-designer for games, hardware-integration for embedded)

5. Load pattern-specific guide (if available):
   IF {{guide_path}} is not empty:
     Read: {{installed_path}}/templates/{{guide_path}}

     This guide contains:
     - Engine/framework-specific questions
     - Technology-specific best practices
     - Common patterns and pitfalls
     - Specialist recommendations for this specific tech stack
     - Pattern-specific ADR examples

6. Present template to user:
</action>

<ask>
Based on your {{project_type}} {{architecture_style}} project, I've selected the "{{template_path}}" template.

This template includes {{section_count}} sections covering:
{{brief_section_list}}

I will now fill in all the {{placeholder}} variables based on our previous discussions and requirements.

Options:
1. Use this template (recommended)
2. Use a different template (specify which one)
3. Show me the full template structure first

Your choice (1/2/3):
</ask>

<action>
Sub-step 6.2: Fill Template Placeholders

6. Parse template to identify all {{placeholders}}

7. Fill each placeholder with appropriate content:
   - Use information from previous steps (PRD, UX spec, tech decisions)
   - Ask user for any missing information
   - Generate appropriate content based on user_skill_level

8. Generate final architecture.md document

CRITICAL REQUIREMENTS:
- MUST include "Technology and Library Decisions" section with table:
  | Category | Technology | Version | Rationale |
  - ALL technologies with SPECIFIC versions (e.g., "pino 8.17.0")
  - NO vagueness ("a logging library" = FAIL)

- MUST include "Proposed Source Tree" section:
  - Complete directory/file structure
  - For polyrepo: show ALL repo structures

- Design-level only (NO extensive code implementations):
  - ✅ DO: Data model schemas, API contracts, diagrams, patterns
  - ❌ DON'T: 10+ line functions, complete components, detailed implementations

- Adapt verbosity to user_skill_level:
  - Beginner: Detailed explanations, examples, rationale
  - Intermediate: Key explanations, balanced
  - Expert: Concise, decision-focused

Common sections (adapt per project):
1. Executive Summary
2. Technology Stack and Decisions (TABLE REQUIRED)
3. Repository and Service Architecture (mono/poly, monolith/microservices)
4. System Architecture (diagrams)
5. Data Architecture
6. API/Interface Design (adapts: REST for web, protocols for embedded, etc.)
7. Cross-Cutting Concerns
8. Component and Integration Overview (NOT epic alignment - that's cohesion check)
9. Architecture Decision Records
10. Implementation Guidance
11. Proposed Source Tree (REQUIRED)
12-14. Specialist sections (DevOps, Security, Testing) - see Step 7.5

NOTE: Section list is DYNAMIC per project type. Embedded projects have different sections than web apps.
</action>

<template-output>solution_architecture</template-output>
</step>

<step n="7" goal="Solution architecture cohesion check (QUALITY GATE)">
<action>
CRITICAL: This is a validation quality gate before proceeding.

Run cohesion check validation inline (NO separate workflow for now):

1. Requirements Coverage:
   - Every FR mapped to components/technology?
   - Every NFR addressed in architecture?
   - Every epic has technical foundation?
   - Every story can be implemented with current architecture?

2. Technology and Library Table Validation:
   - Table exists?
   - All entries have specific versions?
   - No vague entries ("a library", "some framework")?
   - No multi-option entries without decision?

3. Code vs Design Balance:
   - Any sections with 10+ lines of code? (FLAG for removal)
   - Focus on design (schemas, patterns, diagrams)?

4. Vagueness Detection:
   - Scan for: "appropriate", "standard", "will use", "some", "a library"
   - Flag all vague statements for specificity

5. Generate Epic Alignment Matrix:
   | Epic | Stories | Components | Data Models | APIs | Integration Points | Status |

   This matrix is SEPARATE OUTPUT (not in architecture.md)

6. Generate Cohesion Check Report with:
   - Executive summary (READY vs GAPS)
   - Requirements coverage table
   - Technology table validation
   - Epic Alignment Matrix
   - Story readiness (X of Y stories ready)
   - Vagueness detected
   - Over-specification detected
   - Recommendations (critical/important/nice-to-have)
   - Overall readiness score

7. Present report to user
</action>

<template-output>cohesion_check_report</template-output>

<ask>
Cohesion Check Results: {{readiness_score}}% ready

{{if_gaps_found}}
Issues found:
{{list_critical_issues}}

Options:
1. I'll fix these issues now (update architecture.md)
2. You'll fix them manually
3. Proceed anyway (not recommended)

Your choice:
{{/if}}

{{if_ready}}
✅ Architecture is ready for specialist sections!
Proceed? (y/n)
{{/if}}
</ask>

<action if="user_chooses_option_1">
Update architecture.md to address critical issues, then re-validate.
</action>
</step>

<step n="7.5" goal="Scale-adaptive specialist section handling" optional="true">
<action>
For each specialist area (DevOps, Security, Testing), assess complexity:

DevOps Assessment:
- Simple: Vercel/Heroku, 1-2 envs, simple CI/CD → Handle INLINE
- Complex: K8s, 3+ envs, complex IaC, multi-region → Create PLACEHOLDER

Security Assessment:
- Simple: Framework defaults, no compliance → Handle INLINE
- Complex: HIPAA/PCI/SOC2, custom auth, high sensitivity → Create PLACEHOLDER

Testing Assessment:
- Simple: Basic unit + E2E → Handle INLINE
- Complex: Mission-critical UI, comprehensive coverage needed → Create PLACEHOLDER

For INLINE: Add 1-3 paragraph sections to architecture.md
For PLACEHOLDER: Add handoff section with specialist agent invocation instructions
</action>

<ask for_each="specialist_area">
{{specialist_area}} Assessment: {{simple|complex}}

{{if_complex}}
Recommendation: Engage {{specialist_area}} specialist agent after this document.

Options:
1. Create placeholder, I'll engage specialist later (recommended)
2. Attempt inline coverage now (may be less detailed)
3. Skip (handle later)

Your choice:
{{/if}}

{{if_simple}}
I'll handle {{specialist_area}} inline with essentials.
{{/if}}
</ask>

<action>
Update architecture.md with specialist sections (inline or placeholders) at the END of document.
</action>

<template-output>specialist_sections</template-output>
</step>

<step n="8" goal="PRD epic/story updates (if needed)" optional="true">
<ask>
Did cohesion check or architecture design reveal:
- Missing enabler epics (e.g., "Infrastructure Setup")?
- Story modifications needed?
- New FRs/NFRs discovered?
</ask>

<ask if="changes_needed">
Architecture design revealed some PRD updates needed:
{{list_suggested_changes}}

Should I update the PRD? (y/n)
</ask>

<action if="user_approves">
Update PRD with architectural discoveries:
- Add enabler epics if needed
- Clarify stories based on architecture
- Update tech-spec.md with architecture reference
</action>
</step>

<step n="9" goal="Tech-spec generation per epic (INTEGRATED)">
<action>
For each epic in PRD:
1. Extract relevant architecture sections:
   - Technology stack (full table)
   - Components for this epic
   - Data models for this epic
   - APIs for this epic
   - Proposed source tree (relevant paths)
   - Implementation guidance

2. Generate tech-spec-epic-{{N}}.md using tech-spec workflow logic:
   Read: {project-root}/bmad/bmm/workflows/3-solutioning/tech-spec/instructions.md

   Include:
   - Epic overview (from PRD)
   - Stories (from PRD)
   - Architecture extract (from solution-architecture.md)
   - Component-level technical decisions
   - Implementation notes
   - Testing approach

3. Save to: /docs/tech-spec-epic-{{N}}.md
</action>

<template-output>tech_specs</template-output>

<action>
Update project-workflow-analysis.md workflow status:
- [x] Solution architecture generated
- [x] Cohesion check passed
- [x] Tech specs generated for all epics
</action>
</step>

<step n="10" goal="Polyrepo documentation strategy" optional="true">
<ask>
Is this a polyrepo project (multiple repositories)?
</ask>

<action if="polyrepo">
For polyrepo projects:

1. Identify all repositories from architecture:
   Example: frontend-repo, api-repo, worker-repo, mobile-repo

2. Strategy: Copy FULL documentation to ALL repos
   - architecture.md → Copy to each repo
   - tech-spec-epic-X.md → Copy to each repo (full set)
   - cohesion-check-report.md → Copy to each repo

3. Add repo-specific README pointing to docs:
   "See /docs/architecture.md for complete solution architecture"

4. Later phases extract per-epic and per-story contexts as needed

Rationale: Full context in every repo, extract focused contexts during implementation.
</action>

<action if="monorepo">
For monorepo projects:
- All docs already in single /docs directory
- No special strategy needed
</action>
</step>

<step n="11" goal="Validation and completion">
<action>
Final validation checklist:

- [x] architecture.md exists and is complete
- [x] Technology and Library Decision Table has specific versions
- [x] Proposed Source Tree section included
- [x] Cohesion check passed (or issues addressed)
- [x] Epic Alignment Matrix generated
- [x] Specialist sections handled (inline or placeholder)
- [x] Tech specs generated for all epics
- [x] Analysis template updated

Generate completion summary:
- Document locations
- Key decisions made
- Next steps (engage specialist agents if placeholders, begin implementation)
</action>

<template-output>completion_summary</template-output>
</step>

</workflow>
```

---

## Reference Documentation

For detailed design specification, rationale, examples, and edge cases, see:
`./arch-plan.md` (when available in same directory)

Key sections:

- Key Design Decisions (15 critical requirements)
- Step 6 - Architecture Generation (examples, guidance)
- Step 7 - Cohesion Check (validation criteria, report format)
- Dynamic Template Section Strategy
- CSV Registry Examples

This instructions.md is the EXECUTABLE guide.
arch-plan.md is the REFERENCE specification.
