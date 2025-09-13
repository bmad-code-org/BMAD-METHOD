<!-- Powered by BMAD™ Core -->

# Create Next Story with QA Integration Task

## Purpose

To identify the next logical story based on project progress and epic definitions, and then to prepare a comprehensive, self-contained, and actionable story file using the enhanced `Production QA Story Template`. This task ensures the story is enriched with all necessary technical context, requirements, acceptance criteria, AND comprehensive testing requirements, making it ready for efficient implementation by both Developer Agent and QA Test Engineer with minimal need for additional research.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Load Core Configuration and Check Workflow

- Load `{root}/core-config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. This file is required for story creation. You can either: 1) Copy it from GITHUB bmad-core/core-config.yaml and configure it for your project OR 2) Run the BMad installer against your project to upgrade and add the file automatically. Please add and configure core-config.yaml before proceeding."
- Load expansion pack configuration: `expansion-packs/bmad-production-qa/config.yaml`
- Extract key configurations: `devStoryLocation`, `prd.*`, `architecture.*`, `workflow.*`, testing configurations

### 1. Identify Next Story for Preparation

#### 1.1 Locate Epic Files and Review Existing Stories

- Based on `prdSharded` from config, locate epic files (sharded location/pattern or monolithic PRD sections)
- If `devStoryLocation` has story files, load the highest `{epicNum}.{storyNum}.story.md` file
- **If highest story exists:**
  - Verify status is 'Done'. If not, alert user: "ALERT: Found incomplete story! File: {lastEpicNum}.{lastStoryNum}.story.md Status: [current status] You should fix this story first, but would you like to accept risk & override to create the next story in draft?"
  - If proceeding, select next sequential story in the current epic
  - If epic is complete, prompt user: "Epic {epicNum} Complete: All stories in Epic {epicNum} have been completed. Would you like to: 1) Begin Epic {epicNum + 1} with story 1 2) Select a specific story to work on 3) Cancel story creation"
  - **CRITICAL**: NEVER automatically skip to another epic. User MUST explicitly instruct which story to create.
- **If no story files exist:** The next story is ALWAYS 1.1 (first story of first epic)
- Announce the identified story to the user: "Identified next story for preparation: {epicNum}.{storyNum} - {Story Title}"

### 2. Gather Story Requirements and Previous Story Context

- Extract story requirements from the identified epic file
- If previous story exists, review Dev Agent Record sections for:
  - Completion Notes and Debug Log References
  - Implementation deviations and technical decisions
  - Challenges encountered and lessons learned
  - Test implementation notes and testing decisions
- Extract relevant insights that inform the current story's preparation

### 3. Gather Architecture Context

#### 3.1 Determine Architecture Reading Strategy

- **If `architectureVersion: >= v4` and `architectureSharded: true`**: Read `{architectureShardedLocation}/index.md` then follow structured reading order below
- **Else**: Use monolithic `architectureFile` for similar sections

#### 3.2 Read Architecture Documents Based on Story Type

**For ALL Stories:** tech-stack.md, unified-project-structure.md, coding-standards.md, testing-strategy.md

**For Backend/API Stories, additionally:** data-models.md, database-schema.md, backend-architecture.md, rest-api-spec.md, external-apis.md

**For Frontend/UI Stories, additionally:** frontend-architecture.md, components.md, core-workflows.md, data-models.md

**For Full-Stack Stories:** Read both Backend and Frontend sections above

#### 3.3 Extract Story-Specific Technical Details

Extract ONLY information directly relevant to implementing the current story. Do NOT invent new libraries, patterns, or standards not in the source documents.

Extract:
- Specific data models, schemas, or structures the story will use
- API endpoints the story must implement or consume
- Component specifications for UI elements in the story
- File paths and naming conventions for new code
- Testing requirements specific to the story's features
- Security or performance considerations affecting the story

ALWAYS cite source documents: `[Source: architecture/{filename}.md#{section}]`

### 4. Verify Project Structure Alignment

- Cross-reference story requirements with Project Structure Guide from `docs/architecture/unified-project-structure.md`
- Ensure file paths, component locations, or module names align with defined structures
- Document any structural conflicts in "Project Structure Notes" section within the story draft

### 5. Analyze Testing Requirements (NEW SECTION)

#### 5.1 Extract Testing Strategy Information
- Read `docs/architecture/testing-strategy.md` or equivalent testing documentation
- Extract testing standards, frameworks, and requirements
- Identify test coverage thresholds and quality gates
- Note any story-specific testing considerations

#### 5.2 Generate Natural Language Test Requirements
Based on story acceptance criteria and user workflows, generate comprehensive test scenarios in natural language:

**E2E Testing Scenarios:**
- Primary user journey test scenarios
- Alternative workflow scenarios
- Error condition and edge case scenarios
- Browser compatibility requirements (if UI-related)

**API Testing Requirements (if applicable):**
- Endpoint validation scenarios
- Authentication and authorization test cases
- Data validation and error handling scenarios
- Integration test scenarios

**Performance Requirements:**
- Expected response time criteria
- Load capacity expectations based on story scope
- Resource usage constraints

**Security Considerations:**
- Input validation requirements
- Authentication/authorization needs
- Data protection considerations
- Security vulnerability checks

**Accessibility Requirements (if UI-related):**
- WCAG compliance requirements
- Screen reader compatibility
- Keyboard navigation requirements

**Visual Regression (if UI-related):**
- Cross-browser visual consistency
- Responsive design validation
- UI component visual integrity

### 6. Populate Enhanced Story Template with Full Context

- Create new story file: `{devStoryLocation}/{epicNum}.{storyNum}.story.md` using Enhanced Production QA Story Template
- Fill in all standard story information: Title, Status (Draft), Story statement, Acceptance Criteria from Epic
- **`Dev Notes` section (CRITICAL):**
  - Include ALL relevant technical details from Steps 2-4, organized by category
  - Every technical detail MUST include its source reference
  - If information for a category is not found in the architecture docs, explicitly state: "No specific guidance found in architecture docs"
- **`Testing Requirements` section (NEW):**
  - Populate comprehensive testing requirements in natural language based on Step 5 analysis
  - Include all testing scenarios organized by type (E2E, API, Performance, Security, Accessibility, Visual)
  - Reference acceptance criteria numbers where applicable
  - Ensure requirements are tool-agnostic (no specific framework names)
- **`Tasks / Subtasks` section:**
  - Generate detailed, sequential list of technical tasks based ONLY on: Epic Requirements, Story AC, Reviewed Architecture Information
  - Include testing-related tasks:
    - "Implement story functionality (AC: {numbers})"
    - "Create automated tests based on testing requirements"
    - "Validate test coverage meets requirements"
    - "Execute test suite and verify all tests pass"
  - Each task must reference relevant architecture documentation
  - Link tasks to ACs where applicable

### 7. Story Draft Completion and Review

- Review all sections for completeness and accuracy
- Verify all source references are included for technical details
- Ensure tasks align with epic requirements, architecture constraints, AND testing requirements
- Verify testing requirements cover all acceptance criteria
- Update status to "Draft" and save the story file
- Execute `{root}/tasks/execute-checklist` `{root}/checklists/story-draft-checklist`
- Provide summary to user including:
  - Story created: `{devStoryLocation}/{epicNum}.{storyNum}.story.md`
  - Status: Draft
  - Key technical components included from architecture docs
  - Comprehensive testing requirements generated
  - Any deviations or conflicts noted between epic and architecture
  - Checklist Results
  - Next steps: Suggest user have QA Test Engineer review testing requirements and optionally have the PO run the task `{root}/tasks/validate-next-story`

### 8. Recommend QA Integration Workflow (NEW)

Provide user with suggested next steps:
```
✅ Story Created with QA Integration: {epicNum}.{storyNum}

🎯 Comprehensive Coverage:
- Technical implementation requirements ✓
- Natural language testing scenarios ✓
- Performance and security considerations ✓
- Accessibility requirements ✓

🚀 Suggested Next Steps:
1. [Optional] QA Test Engineer: Review testing requirements
   Command: @qa-test-engineer *validate-test-strategy {story-file}

2. [Optional] PO: Validate story completeness
   Command: @po *validate-story-draft {story-file}

3. Begin Development: Dev agent can implement with full context
   Command: @dev *develop-story {story-file}

4. Parallel Testing: QA can create test suites while dev implements
   Command: @qa-test-engineer *create-e2e-tests {story-file}

The story now includes everything needed for both development AND comprehensive testing!
```