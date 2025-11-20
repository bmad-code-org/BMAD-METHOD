# Tech-Spec Workflow - Context-Aware Technical Planning (quick-flow)

<workflow>

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This is quick-flow efforts - tech-spec with context-rich story generation</critical>
<critical>Quick Flow: tech-spec + epic with 1-5 stories (always generates epic structure)</critical>
<critical>LIVING DOCUMENT: Write to tech-spec.md continuously as you discover - never wait until the end</critical>
<critical>CONTEXT IS KING: Gather ALL available context before generating specs</critical>
<critical>DOCUMENT OUTPUT: Technical, precise, definitive. Specific versions only. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<step n="0" goal="Validate workflow readiness and detect project level" tag="workflow-status">
<action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

<check if="status file not found">
  <output>No workflow status file found. Tech-spec workflow can run standalone or as part of BMM workflow path.</output>
  <output>**Recommended:** Run `workflow-init` first for project context tracking and workflow sequencing.</output>
  <output>**Quick Start:** Continue in standalone mode - perfect for rapid prototyping and quick changes!</output>
  <ask>Continue in standalone mode or exit to run workflow-init? (continue/exit)</ask>
  <check if="continue">
    <action>Set standalone_mode = true</action>

    <output>Great! Let's quickly configure your project...</output>

    <ask>How many user stories do you think this work requires?

**Single Story** - Simple change (bug fix, small isolated feature, single file change)
→ Generates: tech-spec + epic (minimal) + 1 story
→ Example: "Fix login validation bug" or "Add email field to user form"

**Multiple Stories (2-5)** - Coherent feature (multiple related changes, small feature set)
→ Generates: tech-spec + epic (detailed) + 2-5 stories
→ Example: "Add OAuth integration" or "Build user profile page"

Enter **1** for single story, or **2-5** for number of stories you estimate</ask>

    <action>Capture user response as story_count (1-5)</action>
    <action>Validate: If not 1-5, ask for clarification. If > 5, suggest using full BMad Method instead</action>

    <ask if="not already known greenfield vs brownfield">Is this a **greenfield** (new/empty codebase) or **brownfield** (existing codebase) project?

    **Greenfield** - Starting fresh, no existing code aside from starter templates
    **Brownfield** - Adding to or modifying existing functional code or project

    Enter **greenfield** or **brownfield**:</ask>

    <action>Capture user response as field_type (greenfield or brownfield)</action>
    <action>Validate: If not greenfield or brownfield, ask again</action>

    <output>Perfect! Running as:

- **Story Count:** {{story_count}} {{#if story_count == 1}}story (minimal epic){{else}}stories (detailed epic){{/if}}
- **Field Type:** {{field_type}}
- **Mode:** Standalone (no status file tracking)

Let's build your tech-spec!</output>
</check>
<check if="exit">
<action>Exit workflow</action>
</check>
</check>

<check if="status file found">
  <action>Load the FULL file: {workflow-status}</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "tech-spec" workflow</action>
  <action>Get selected_track from YAML metadata indicating this is quick-flow-greenfield or quick-flow-brownfield</action>
  <action>Get field_type from YAML metadata (greenfield or brownfield)</action>
  <action>Find first non-completed workflow (next expected workflow)</action>

  <check if="selected_track is NOT quick-flow-greenfield AND NOT quick-flow-brownfield">
    <output>**Incorrect Workflow for Level {{selected_track}}**
    Tech-spec is for Simple projects. **Correct workflow:** `create-prd` (PM agent). You should Exit at this point, unless you want to force run this workflow.
</output>
</check>

  <check if="tech-spec status is file path (already completed)">
    <output>⚠️ Tech-spec already completed: {{tech-spec status}}</output>
    <ask>Re-running will overwrite the existing tech-spec. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="tech-spec is not the next expected workflow">
    <output>⚠️ Next expected workflow: {{next_workflow}}. Tech-spec is out of sequence.</output>
    <ask>Continue with tech-spec anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. Run {{next_workflow}} instead.</output>
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

<step n="1" goal="Comprehensive context discovery - gather everything available">

<action>Welcome {user_name} warmly and explain what we're about to do:

"I'm going to gather all available context about your project before we dive into the technical spec. The following content has been auto-loaded:

- Product briefs and research: {product_brief_content}, {research_content}
- Brownfield codebase documentation: {document_project_content} (loaded via INDEX_GUIDED strategy)
- Your project's tech stack and dependencies
- Existing code patterns and structure

This ensures the tech-spec is grounded in reality and gives developers everything they need."
</action>

<action>**PHASE 1: Load Existing Documents**

Search for and load (using dual-strategy: whole first, then sharded):

1. **Product Brief:**
   - Search pattern: {output*folder}/\_brief*.md
   - Sharded: {output*folder}/\_brief*/index.md
   - If found: Load completely and extract key context

2. **Research Documents:**
   - Search pattern: {output*folder}/\_research*.md
   - Sharded: {output*folder}/\_research*/index.md
   - If found: Load completely and extract insights

3. **Document-Project Output (CRITICAL for brownfield):**
   - Always check: {output_folder}/index.md
   - If found: This is the brownfield codebase map - load ALL shards!
   - Extract: File structure, key modules, existing patterns, naming conventions

Create a summary of what was found and ask user if there are other documents or information to consider before proceeding:

- List of loaded documents
- Key insights from each
- Brownfield vs greenfield determination
  </action>

<action>**PHASE 2: Intelligently Detect Project Stack**

Use your comprehensive knowledge as a coding-capable LLM to analyze the project:

**Discover Setup Files:**

- Search {project-root} for dependency manifests (package.json, requirements.txt, Gemfile, go.mod, Cargo.toml, composer.json, pom.xml, build.gradle, pyproject.toml, etc.)
- Adapt to ANY project type - you know the ecosystem conventions

**Extract Critical Information:**

1. Framework name and EXACT version (e.g., "React 18.2.0", "Django 4.2.1")
2. All production dependencies with specific versions
3. Dev tools and testing frameworks (Jest, pytest, ESLint, etc.)
4. Available build/test scripts
5. Project type (web app, API, CLI, library, etc.)

**Assess Currency:**

- Identify if major dependencies are outdated (>2 years old)
- Use WebSearch to find current recommended versions if needed
- Note migration complexity in your summary

**For Greenfield Projects:**
<check if="field_type == greenfield">
<action>Use WebSearch to discover current best practices and official starter templates</action>
<action>Recommend appropriate starters based on detected framework (or user's intended stack)</action>
<action>Present benefits conversationally: setup time saved, modern patterns, testing included</action>
<ask>Would you like to use a starter template? (yes/no/show-me-options)</ask>
<action>Capture preference and include in implementation stack if accepted</action>
</check>

**Trust Your Intelligence:**
You understand project ecosystems deeply. Adapt your analysis to any stack - don't be constrained by examples. Extract what matters for developers.

Store comprehensive findings as {{project_stack_summary}}
</action>

<action>**PHASE 3: Brownfield Codebase Reconnaissance** (if applicable)

<check if="field_type == brownfield OR document-project output found">

Analyze the existing project structure:

1. **Directory Structure:**
   - Identify main code directories (src/, lib/, app/, components/, services/)
   - Note organization patterns (feature-based, layer-based, domain-driven)
   - Identify test directories and patterns

2. **Code Patterns:**
   - Look for dominant patterns (class-based, functional, MVC, microservices)
   - Identify naming conventions (camelCase, snake_case, PascalCase)
   - Note file organization patterns

3. **Key Modules/Services:**
   - Identify major modules or services already in place
   - Note entry points (main.js, app.py, index.ts)
   - Document important utilities or shared code

4. **Testing Patterns & Standards (CRITICAL):**
   - Identify test framework in use (from package.json/requirements.txt)
   - Note test file naming patterns (.test.js, test.py, .spec.ts, Test.java)
   - Document test organization (tests/, **tests**, spec/, test/)
   - Look for test configuration files (jest.config.js, pytest.ini, .rspec)
   - Check for coverage requirements (in CI config, test scripts)
   - Identify mocking/stubbing libraries (jest.mock, unittest.mock, sinon)
   - Note assertion styles (expect, assert, should)

5. **Code Style & Conventions (MUST CONFORM):**
   - Check for linter config (.eslintrc, .pylintrc, rubocop.yml)
   - Check for formatter config (.prettierrc, .black, .editorconfig)
   - Identify code style:
     - Semicolons: yes/no (JavaScript/TypeScript)
     - Quotes: single/double
     - Indentation: spaces/tabs, size
     - Line length limits
   - Import/export patterns (named vs default, organization)
   - Error handling patterns (try/catch, Result types, error classes)
   - Logging patterns (console, winston, logging module, specific formats)
   - Documentation style (JSDoc, docstrings, YARD, JavaDoc)

Store this as {{existing_structure_summary}}

**CRITICAL: Confirm Conventions with User**
<ask>I've detected these conventions in your codebase:

**Code Style:**
{{detected_code_style}}

**Test Patterns:**
{{detected_test_patterns}}

**File Organization:**
{{detected_file_organization}}

Should I follow these existing conventions for the new code?

Enter **yes** to conform to existing patterns, or **no** if you want to establish new standards:</ask>

<action>Capture user response as conform_to_conventions (yes/no)</action>

<check if="conform_to_conventions == no">
  <ask>What conventions would you like to use instead? (Or should I suggest modern best practices?)</ask>
  <action>Capture new conventions or use WebSearch for current best practices</action>
</check>

<action>Store confirmed conventions as {{existing_conventions}}</action>

</check>

<check if="field_type == greenfield">
  <action>Note: Greenfield project - no existing code to analyze</action>
  <action>Set {{existing_structure_summary}} = "Greenfield project - new codebase"</action>
</check>

</action>

<action>**PHASE 4: Synthesize Context Summary**

Create {{loaded_documents_summary}} that includes:

- Documents found and loaded
- Brownfield vs greenfield status
- Tech stack detected (or "To be determined" if greenfield)
- Existing patterns identified (or "None - greenfield" if applicable)

Present this summary to {user_name} conversationally:

"Here's what I found about your project:

**Documents Available:**
[List what was found]

**Project Type:**
[Brownfield with X framework Y version OR Greenfield - new project]

**Existing Stack:**
[Framework and dependencies OR "To be determined"]

**Code Structure:**
[Existing patterns OR "New codebase"]

This gives me a solid foundation for creating a context-rich tech spec!"
</action>

<template-output>loaded_documents_summary</template-output>
<template-output>project_stack_summary</template-output>
<template-output>existing_structure_summary</template-output>

</step>

<step n="2" goal="Conversational discovery of the change/feature">

<action>Engage {user_name} in natural, adaptive conversation to deeply understand what needs to be built.

**Discovery Approach:**
Adapt your questioning style to the complexity:

- For single-story changes: Focus on the specific problem, location, and approach
- For multi-story features: Explore user value, integration strategy, and scope boundaries

**Core Discovery Goals (accomplish through natural dialogue):**

1. **The Problem/Need**
   - What user or technical problem are we solving?
   - Why does this matter now?
   - What's the impact if we don't do this?

2. **The Solution Approach**
   - What's the proposed solution?
   - How should this work from a user/system perspective?
   - What alternatives were considered?

3. **Integration & Location**
   - <check if="brownfield">Where does this fit in the existing codebase?</check>
   - What existing code/patterns should we reference or follow?
   - What are the integration points?

4. **Scope Clarity**
   - What's IN scope for this work?
   - What's explicitly OUT of scope (future work, not needed)?
   - If multiple stories: What's MVP vs enhancement?

5. **Constraints & Dependencies**
   - Technical limitations or requirements?
   - Dependencies on other systems, APIs, or services?
   - Performance, security, or compliance considerations?

6. **Success Criteria**
   - How will we know this is done correctly?
   - What does "working" look like?
   - What edge cases matter?

**Conversation Style:**

- Be warm and collaborative, not interrogative
- Ask follow-up questions based on their responses
- Help them think through implications
- Reference context from Phase 1 (existing code, stack, patterns)
- Adapt depth to {{story_count}} complexity

Synthesize discoveries into clear, comprehensive specifications.
</action>

<template-output>problem_statement</template-output>
<template-output>solution_overview</template-output>
<template-output>change_type</template-output>
<template-output>scope_in</template-output>
<template-output>scope_out</template-output>

</step>

<step n="3" goal="Generate context-aware, definitive technical specification">

<critical>ALL TECHNICAL DECISIONS MUST BE DEFINITIVE - NO AMBIGUITY ALLOWED</critical>
<critical>Use existing stack info to make SPECIFIC decisions</critical>
<critical>Reference brownfield code to guide implementation</critical>

<action>Initialize tech-spec.md with the rich template</action>

<action>**Generate Context Section (already captured):**

These template variables are already populated from Step 1:

- {{loaded_documents_summary}}
- {{project_stack_summary}}
- {{existing_structure_summary}}

Just save them to the file.
</action>

<template-output file="tech-spec.md">loaded_documents_summary</template-output>
<template-output file="tech-spec.md">project_stack_summary</template-output>
<template-output file="tech-spec.md">existing_structure_summary</template-output>

<action>**Generate The Change Section:**

Already captured from Step 2:

- {{problem_statement}}
- {{solution_overview}}
- {{scope_in}}
- {{scope_out}}

Save to file.
</action>

<template-output file="tech-spec.md">problem_statement</template-output>
<template-output file="tech-spec.md">solution_overview</template-output>
<template-output file="tech-spec.md">scope_in</template-output>
<template-output file="tech-spec.md">scope_out</template-output>

<action>**Generate Implementation Details:**

Now make DEFINITIVE technical decisions using all the context gathered.

**Source Tree Changes - BE SPECIFIC:**

Bad (NEVER do this):

- "Update some files in the services folder"
- "Add tests somewhere"

Good (ALWAYS do this):

- "src/services/UserService.ts - MODIFY - Add validateEmail() method at line 45"
- "src/routes/api/users.ts - MODIFY - Add POST /users/validate endpoint"
- "tests/services/UserService.test.ts - CREATE - Test suite for email validation"

Include:

- Exact file paths
- Action: CREATE, MODIFY, DELETE
- Specific what changes (methods, classes, endpoints, components)

**Use brownfield context:**

- If modifying existing files, reference current structure
- Follow existing naming patterns
- Place new code logically based on current organization
  </action>

<template-output file="tech-spec.md">source_tree_changes</template-output>

<action>**Technical Approach - BE DEFINITIVE:**

Bad (ambiguous):

- "Use a logging library like winston or pino"
- "Use Python 2 or 3"
- "Set up some kind of validation"

Good (definitive):

- "Use winston v3.8.2 (already in package.json) for logging"
- "Implement using Python 3.11 as specified in pyproject.toml"
- "Use Joi v17.9.0 for request validation following pattern in UserController.ts"

**Use detected stack:**

- Reference exact versions from package.json/requirements.txt
- Specify frameworks already in use
- Make decisions based on what's already there

**For greenfield:**

- Make definitive choices and justify them
- Specify exact versions
- No "or" statements allowed
  </action>

<template-output file="tech-spec.md">technical_approach</template-output>

<action>**Existing Patterns to Follow:**

<check if="brownfield">
Document patterns from the existing codebase:
- Class structure patterns
- Function naming conventions
- Error handling approach
- Testing patterns
- Documentation style

Example:
"Follow the service pattern established in UserService.ts:

- Export class with constructor injection
- Use async/await for all asynchronous operations
- Throw ServiceError with error codes
- Include JSDoc comments for all public methods"
  </check>

<check if="greenfield">
"Greenfield project - establishing new patterns:
- [Define the patterns to establish]"
</check>

</action>

<template-output file="tech-spec.md">existing_patterns</template-output>

<action>**Integration Points:**

Identify how this change connects:

- Internal modules it depends on
- External APIs or services
- Database interactions
- Event emitters/listeners
- State management

Be specific about interfaces and contracts.
</action>

<template-output file="tech-spec.md">integration_points</template-output>

<action>**Development Context:**

**Relevant Existing Code:**
<check if="brownfield">
Reference specific files or code sections developers should review:

- "See UserService.ts lines 120-150 for similar validation pattern"
- "Reference AuthMiddleware.ts for authentication approach"
- "Follow error handling in PaymentService.ts"
  </check>

**Framework/Libraries:**
List with EXACT versions from detected stack:

- Express 4.18.2 (web framework)
- winston 3.8.2 (logging)
- Joi 17.9.0 (validation)
- TypeScript 5.1.6 (language)

**Internal Modules:**
List internal dependencies:

- @/services/UserService
- @/middleware/auth
- @/utils/validation

**Configuration Changes:**
Any config files to update:

- Update .env with new SMTP settings
- Add validation schema to config/schemas.ts
- Update package.json scripts if needed
  </action>

<template-output file="tech-spec.md">existing_code_references</template-output>
<template-output file="tech-spec.md">framework_dependencies</template-output>
<template-output file="tech-spec.md">internal_dependencies</template-output>
<template-output file="tech-spec.md">configuration_changes</template-output>

<check if="field_type == brownfield">
  <template-output file="tech-spec.md">existing_conventions</template-output>
</check>

<check if="field_type == greenfield">
  <action>Set {{existing_conventions}} = "Greenfield project - establishing new conventions per modern best practices"</action>
  <template-output file="tech-spec.md">existing_conventions</template-output>
</check>

<action>**Implementation Stack:**

Comprehensive stack with versions:

- Runtime: Node.js 20.x
- Framework: Express 4.18.2
- Language: TypeScript 5.1.6
- Testing: Jest 29.5.0
- Linting: ESLint 8.42.0
- Validation: Joi 17.9.0

All from detected project setup!
</action>

<template-output file="tech-spec.md">implementation_stack</template-output>

<action>**Technical Details:**

Deep technical specifics:

- Algorithms to implement
- Data structures to use
- Performance considerations
- Security considerations
- Error scenarios and handling
- Edge cases

Be thorough - developers need details!
</action>

<template-output file="tech-spec.md">technical_details</template-output>

<action>**Development Setup:**

What does a developer need to run this locally?

Based on detected stack and scripts:

```
1. Clone repo (if not already)
2. npm install (installs all deps from package.json)
3. cp .env.example .env (configure environment)
4. npm run dev (starts development server)
5. npm test (runs test suite)
```

Or for Python:

```
1. python -m venv venv
2. source venv/bin/activate
3. pip install -r requirements.txt
4. python manage.py runserver
```

Use the actual scripts from package.json/setup files!
</action>

<template-output file="tech-spec.md">development_setup</template-output>

<action>**Implementation Guide:**

**Setup Steps:**
Pre-implementation checklist:

- Create feature branch
- Verify dev environment running
- Review existing code references
- Set up test data if needed

**Implementation Steps:**
Step-by-step breakdown:

For single-story changes:

1. [Step 1 with specific file and action]
2. [Step 2 with specific file and action]
3. [Write tests]
4. [Verify acceptance criteria]

For multi-story features:
Organize by story/phase:

1. Phase 1: [Foundation work]
2. Phase 2: [Core implementation]
3. Phase 3: [Testing and validation]

**Testing Strategy:**

- Unit tests for [specific functions]
- Integration tests for [specific flows]
- Manual testing checklist
- Performance testing if applicable

**Acceptance Criteria:**
Specific, measurable, testable criteria:

1. Given [scenario], when [action], then [outcome]
2. [Metric] meets [threshold]
3. [Feature] works in [environment]
   </action>

<template-output file="tech-spec.md">setup_steps</template-output>
<template-output file="tech-spec.md">implementation_steps</template-output>
<template-output file="tech-spec.md">testing_strategy</template-output>
<template-output file="tech-spec.md">acceptance_criteria</template-output>

<action>**Developer Resources:**

**File Paths Reference:**
Complete list of all files involved:

- /src/services/UserService.ts
- /src/routes/api/users.ts
- /tests/services/UserService.test.ts
- /src/types/user.ts

**Key Code Locations:**
Important functions, classes, modules:

- UserService class (src/services/UserService.ts:15)
- validateUser function (src/utils/validation.ts:42)
- User type definition (src/types/user.ts:8)

**Testing Locations:**
Where tests go:

- Unit: tests/services/
- Integration: tests/integration/
- E2E: tests/e2e/

**Documentation to Update:**
Docs that need updating:

- README.md - Add new endpoint documentation
- API.md - Document /users/validate endpoint
- CHANGELOG.md - Note the new feature
  </action>

<template-output file="tech-spec.md">file_paths_complete</template-output>
<template-output file="tech-spec.md">key_code_locations</template-output>
<template-output file="tech-spec.md">testing_locations</template-output>
<template-output file="tech-spec.md">documentation_updates</template-output>

<action>**UX/UI Considerations:**

<check if="change affects user interface OR user experience">
  **Determine if this change has UI/UX impact:**
  - Does it change what users see?
  - Does it change how users interact?
  - Does it affect user workflows?

If YES, document:

**UI Components Affected:**

- List specific components (buttons, forms, modals, pages)
- Note which need creation vs modification

**UX Flow Changes:**

- Current flow vs new flow
- User journey impact
- Navigation changes

**Visual/Interaction Patterns:**

- Follow existing design system? (check for design tokens, component library)
- New patterns needed?
- Responsive design considerations (mobile, tablet, desktop)

**Accessibility:**

- Keyboard navigation requirements
- Screen reader compatibility
- ARIA labels needed
- Color contrast standards

**User Feedback:**

- Loading states
- Error messages
- Success confirmations
- Progress indicators
  </check>

<check if="no UI/UX impact">
  "No UI/UX impact - backend/API/infrastructure change only"
</check>
</action>

<template-output file="tech-spec.md">ux_ui_considerations</template-output>

<action>**Testing Approach:**

Comprehensive testing strategy using {{test_framework_info}}:

**CONFORM TO EXISTING TEST STANDARDS:**
<check if="conform_to_conventions == yes">

- Follow existing test file naming: {{detected_test_patterns.file_naming}}
- Use existing test organization: {{detected_test_patterns.organization}}
- Match existing assertion style: {{detected_test_patterns.assertion_style}}
- Meet existing coverage requirements: {{detected_test_patterns.coverage}}
  </check>

**Test Strategy:**

- Test framework: {{detected_test_framework}} (from project dependencies)
- Unit tests for [specific functions/methods]
- Integration tests for [specific flows/APIs]
- E2E tests if UI changes
- Mock/stub strategies (use existing patterns: {{detected_test_patterns.mocking}})
- Performance benchmarks if applicable
- Accessibility tests if UI changes

**Coverage:**

- Unit test coverage: [target %]
- Integration coverage: [critical paths]
- Ensure all acceptance criteria have corresponding tests
  </action>

<template-output file="tech-spec.md">test_framework_info</template-output>
<template-output file="tech-spec.md">testing_approach</template-output>

<action>**Deployment Strategy:**

**Deployment Steps:**
How to deploy this change:

1. Merge to main branch
2. Run CI/CD pipeline
3. Deploy to staging
4. Verify in staging
5. Deploy to production
6. Monitor for issues

**Rollback Plan:**
How to undo if problems:

1. Revert commit [hash]
2. Redeploy previous version
3. Verify rollback successful

**Monitoring:**
What to watch after deployment:

- Error rates in [logging service]
- Response times for [endpoint]
- User feedback on [feature]
  </action>

<template-output file="tech-spec.md">deployment_steps</template-output>
<template-output file="tech-spec.md">rollback_plan</template-output>
<template-output file="tech-spec.md">monitoring_approach</template-output>

</step>

<step n="4" goal="Auto-validate cohesion, completeness, and quality">

<critical>Always run validation - this is NOT optional!</critical>

<action>Tech-spec generation complete! Now running automatic validation...</action>

<action>Load {installed_path}/checklist.md</action>
<action>Review tech-spec.md against ALL checklist criteria:

**Section 1: Output Files Exist**

- Verify tech-spec.md created
- Check for unfilled template variables

**Section 2: Context Gathering**

- Validate all available documents were loaded
- Confirm stack detection worked
- Verify brownfield analysis (if applicable)

**Section 3: Tech-Spec Definitiveness**

- Scan for "or" statements (FAIL if found)
- Verify all versions are specific
- Check stack alignment

**Section 4: Context-Rich Content**

- Verify all new template sections populated
- Check existing code references (brownfield)
- Validate framework dependencies listed

**Section 5-6: Story Quality (deferred to Step 5)**

**Section 7: Workflow Status (if applicable)**

**Section 8: Implementation Readiness**

- Can developer start immediately?
- Is tech-spec comprehensive enough?
  </action>

<action>Generate validation report with specific scores:

- Context Gathering: [Comprehensive/Partial/Insufficient]
- Definitiveness: [All definitive/Some ambiguity/Major issues]
- Brownfield Integration: [N/A/Excellent/Partial/Missing]
- Stack Alignment: [Perfect/Good/Partial/None]
- Implementation Readiness: [Yes/No]
  </action>

<check if="validation issues found">
  <output>⚠️ **Validation Issues Detected:**

{{list_of_issues}}

I can fix these automatically. Shall I proceed? (yes/no)</output>

<ask>Fix validation issues? (yes/no)</ask>

  <check if="yes">
    <action>Fix each issue and re-validate</action>
    <output>✅ Issues fixed! Re-validation passed.</output>
  </check>

  <check if="no">
    <output>⚠️ Proceeding with warnings. Issues should be addressed manually.</output>
  </check>
</check>

<check if="validation passes">
  <output>✅ **Validation Passed!**

**Scores:**

- Context Gathering: {{context_score}}
- Definitiveness: {{definitiveness_score}}
- Brownfield Integration: {{brownfield_score}}
- Stack Alignment: {{stack_score}}
- Implementation Readiness: ✅ Ready

Tech-spec is high quality and ready for story generation!</output>
</check>

</step>

<step n="5" goal="Generate epic and context-rich stories">

<action>Invoke unified story generation workflow: {instructions_generate_stories}</action>

<action>This will generate:

- **epics.md** - Epic structure (minimal for 1 story, detailed for multiple)
- **story-{epic-slug}-N.md** - Story files (where N = 1 to {{story_count}})

All stories reference tech-spec.md as primary context - comprehensive enough that developers can often skip story-context workflow.
</action>

</step>

<step n="6" goal="Finalize and guide next steps">

<output>**✅ Tech-Spec Complete, {user_name}!**

**Deliverables Created:**

- ✅ **tech-spec.md** - Context-rich technical specification
  - Includes: brownfield analysis, framework details, existing patterns
- ✅ **epics.md** - Epic structure{{#if story_count == 1}} (minimal for single story){{else}} with {{story_count}} stories{{/if}}
- ✅ **story-{epic-slug}-1.md** - First story{{#if story_count > 1}}
- ✅ **story-{epic-slug}-2.md** - Second story{{/if}}{{#if story_count > 2}}
- ✅ **story-{epic-slug}-3.md** - Third story{{/if}}{{#if story_count > 3}}
- ✅ **Additional stories** through story-{epic-slug}-{{story_count}}.md{{/if}}

**What Makes This Tech-Spec Special:**

The tech-spec is comprehensive enough to serve as the primary context document:

- ✨ Brownfield codebase analysis (if applicable)
- ✨ Exact framework and library versions from your project
- ✨ Existing patterns and code references
- ✨ Specific file paths and integration points
- ✨ Complete developer resources

**Next Steps:**

**🎯 Recommended Path - Direct to Development:**

Since the tech-spec is CONTEXT-RICH, you can often skip story-context generation!

{{#if story_count == 1}}
**For Your Single Story:**

1. Ask DEV agent to run `dev-story`
   - Select story-{epic-slug}-1.md
   - Tech-spec provides all the context needed!

💡 **Optional:** Only run `story-context` (SM agent) if this is unusually complex
{{else}}
**For Your {{story_count}} Stories - Iterative Approach:**

1. **Start with Story 1:**
   - Ask DEV agent to run `dev-story`
   - Select story-{epic-slug}-1.md
   - Tech-spec provides context

2. **After Story 1 Complete:**
   - Repeat for story-{epic-slug}-2.md
   - Continue through story {{story_count}}

💡 **Alternative:** Use `sprint-planning` (SM agent) to organize all stories as a coordinated sprint

💡 **Optional:** Run `story-context` (SM agent) for complex stories needing additional context
{{/if}}

**Your Tech-Spec:**

- 📄 Saved to: `{output_folder}/tech-spec.md`
- Epic & Stories: `{output_folder}/epics.md` + `{sprint_artifacts}/`
- Contains: All context, decisions, patterns, and implementation guidance
- Ready for: Direct development!

The tech-spec is your single source of truth! 🚀
</output>

</step>

</workflow>
