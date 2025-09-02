# Create Game Story Task

## Purpose

To identify the next logical game story based on project progress and epic definitions, and then to prepare a comprehensive, self-contained, and actionable story file using the `Game Story Template`. This task ensures the story is enriched with all necessary technical context, Godot-specific requirements (node architecture, GDScript/C# language selection, 60+ FPS performance targets), TDD test requirements, and acceptance criteria, making it ready for efficient implementation by a Game Developer Agent with minimal need for additional research or finding its own context.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Load Core Configuration and Check Workflow

- Load `.bmad-godot-game-dev/config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. This file is required for story creation. You can either: 1) Copy core-config.yaml from GITHUB bmad-core/ and configure it for your game project OR 2) Run the BMad installer against your project to upgrade and add the file automatically. Please add and configure before proceeding."
- Extract key configurations: `devStoryLocation`, `prd.*`, `architecture.*`, `workflow.*`

### 1. Identify Next Story for Preparation

#### 1.1 Locate Epic Files and Review Existing Stories

- Based on `prdSharded` from config, locate epic files (sharded location/pattern or monolithic PRD sections)
- If `devStoryLocation` has story files, load the highest `{epicNum}.{storyNum}.story.md` file
- **If highest story exists:**
  - Verify status is 'Done'. If not, alert user: "ALERT: Found incomplete story! File: {lastEpicNum}.{lastStoryNum}.story.md Status: [current status] Check if TDD tests are passing (GUT/GoDotTest). You should fix this story first, but would you like to accept risk & override to create the next story in draft?"
  - If proceeding, select next sequential story in the current epic
  - If epic is complete, prompt user: "Epic {epicNum} Complete: All stories in Epic {epicNum} have been completed. Would you like to: 1) Begin Epic {epicNum + 1} with story 1 2) Select a specific story to work on 3) Cancel story creation"
  - **CRITICAL**: NEVER automatically skip to another epic. User MUST explicitly instruct which story to create.
- **If no story files exist:** The next story is ALWAYS 1.1 (first story of first epic)
- Announce the identified story to the user: "Identified next story for preparation: {epicNum}.{storyNum} - {Story Title}"

### 2. Gather Story Requirements and Previous Story Context

- Extract story requirements from the identified epic file or PRD section
- If previous story exists, review Dev Agent Record sections for:
  - Completion Notes and Debug Log References
  - Implementation deviations and technical decisions
  - Godot-specific challenges (node structure, signal connections, 60+ FPS violations)
  - Language decisions (GDScript vs C# choices and rationale)
  - Resource loading and object pooling implementations
  - TDD test coverage and any failing tests
- Extract relevant insights that inform the current story's preparation

### 3. Gather Architecture Context

#### 3.1 Determine Architecture Reading Strategy

- **If `architectureVersion: >= v3` and `architectureSharded: true`**: Read `{architectureShardedLocation}/index.md` then follow structured reading order below
- **Else**: Use monolithic `architectureFile` for similar sections

#### 3.2 Read Architecture Documents Based on Story Type

**For ALL Game Stories:** tech-stack.md, godot-project-structure.md, coding-standards.md, test-strategy and standards.md, language-strategy.md

**For Gameplay/Mechanics Stories, additionally:** gameplay-systems-architecture.md, node-architecture-details.md, physics-configuration.md, input-system-architecture.md, state-machine-architecture.md, resource-architecture.md

**For UI/UX Stories, additionally:** node-architecture-details.md, ui-architecture.md, ui-component-system.md, ui-state-management.md, scene-management-architecture.md

**For Backend/Services Stories, additionally:** resource-architecture.md, data-persistence-architecture.md, save-system-implementation.md, analytics-integration.md, multiplayer-architecture.md

**For Graphics/Rendering Stories, additionally:** rendering-settings.md, shader-guidelines.md, sprite-management.md, particle-systems.md

**For Audio Stories, additionally:** audio-architecture.md, audio-mixing-configuration.md, sound-bank-management.md

#### 3.3 Extract Story-Specific Technical Details

Extract ONLY information directly relevant to implementing the current story. Do NOT invent new patterns, systems, or standards not in the source documents.

Extract:

- Specific Godot nodes and their inheritance hierarchy
- Language selection rationale (GDScript vs C# for each component)
- Node composition patterns and signal connections
- Scene (.tscn) and resource (.tres) organization requirements
- InputMap actions and device handling configurations
- Physics2D/3D settings and collision layers
- Control node anchoring and theme specifications
- Resource naming conventions and folder structures
- Performance budgets (60+ FPS minimum, frame time <16.67ms, draw calls)
- Platform export settings (desktop, mobile, web)
- TDD requirements with GUT (GDScript) and GoDotTest (C#)

ALWAYS cite source documents: `[Source: architecture/{filename}.md#{section}]`

### 4. Godot-Specific Technical Analysis

#### 4.1 Language Strategy Analysis

- Determine GDScript vs C# selection for each system based on:
  - Performance requirements (C# for compute-heavy operations)
  - Iteration speed needs (GDScript for rapid prototyping)
  - Existing codebase patterns
- Document static typing enforcement in GDScript (10-20% performance gain)
- Identify interop boundaries between GDScript and C#
- Note any GDExtension or plugin requirements
- Specify object pooling needs for spawned entities

#### 4.2 Scene and Node Planning

- Identify which scenes (.tscn) will be modified or created
- List scene inheritance and composition patterns
- Document node tree structure with parent-child relationships
- Specify scene instancing and pooling requirements
- Plan signal connections between nodes
- Define Autoload/singleton needs

#### 4.3 Node Architecture

- Define custom node classes needed (extending Node2D, Control, etc.)
- Specify Resource classes for data management
- Document signal emission and connection patterns
- Identify process vs physics_process usage
- Note Control node UI components and theme requirements
- Plan export variables for inspector configuration

#### 4.4 Resource Requirements

- List texture requirements with import settings
- Define AnimationPlayer and AnimationTree needs
- Specify AudioStream resources and bus routing
- Document shader and material requirements
- Note font resources and theme variations
- Plan resource preloading vs lazy loading strategy

### 5. Populate Story Template with Full Context

- Create new story file: `{devStoryLocation}/{epicNum}.{storyNum}.story.md` using Game Story Template
- Fill in basic story information: Title, Status (Draft), Story statement, Acceptance Criteria from Epic/PRD
- **`Dev Notes` section (CRITICAL):**
  - CRITICAL: This section MUST contain ONLY information extracted from architecture documents and PRD. NEVER invent or assume technical details.
  - Include ALL relevant technical details from Steps 2-4, organized by category:
    - **Previous Story Insights**: Key learnings from previous story implementation
    - **Language Strategy**: GDScript vs C# decisions for each component [with source references]
    - **Node Architecture**: Specific nodes, inheritance, signal patterns [with source references]
    - **Scene Specifications**: Scene modifications, node trees, instancing [with source references]
    - **Input Configuration**: InputMap actions, device handling [with source references]
    - **UI Implementation**: Control nodes, anchoring, themes [with source references]
    - **Resource Pipeline**: Resource requirements, import settings, pooling strategy
    - **Performance Targets**: 60+ FPS requirement, frame time budget, profiler metrics
    - **Platform Considerations**: Export template differences, platform-specific code
    - **TDD Requirements**: GUT tests for GDScript, GoDotTest for C#, test-first development
  - Every technical detail MUST include its source reference: `[Source: architecture/{filename}.md#{section}]`
  - If information for a category is not found in the architecture docs, explicitly state: "No specific guidance found in architecture docs"
- **`Tasks / Subtasks` section:**
  - Generate detailed, sequential list of technical tasks based ONLY on: Epic/PRD Requirements, Story AC, Reviewed Architecture Information
  - Include Godot-specific tasks:
    - Write failing tests FIRST (TDD Red phase)
    - Scene setup and node hierarchy creation
    - Node implementation with proper \_ready/\_process methods
    - Signal connection and event handling
    - InputMap integration
    - Physics2D/3D configuration
    - Control node UI with responsive anchoring
    - Performance profiling (maintain 60+ FPS)
    - Make tests pass (TDD Green phase)
    - Refactor while keeping tests green (TDD Refactor phase)
  - Each task must reference relevant architecture documentation
  - Include GUT/GoDotTest testing as explicit subtasks
  - Link tasks to ACs where applicable (e.g., `Task 1 (AC: 1, 3)`)
- Add notes on Godot project structure alignment or discrepancies found in Step 4

### 6. Story Draft Completion and Review

- Review all sections for completeness and accuracy
- Verify all source references are included for technical details
- Ensure Godot-specific requirements are comprehensive:
  - All scenes and node trees documented
  - Language strategy (GDScript/C#) justified
  - Signal connections clear
  - Resource requirements specified
  - 60+ FPS performance targets defined
  - TDD test requirements explicit
- Update status to "Draft" and save the story file
- Execute `.bmad-godot-game-dev/tasks/execute-checklist` `.bmad-godot-game-dev/checklists/game-story-dod-checklist`
- Provide summary to user including:
  - Story created: `{devStoryLocation}/{epicNum}.{storyNum}.story.md`
  - Status: Draft
  - Language strategy decisions (GDScript vs C# components)
  - Key Godot nodes and systems included
  - Scene/node modifications required
  - Resource requirements identified
  - TDD test coverage planned
  - Performance impact assessment (60+ FPS maintained?)
  - Any deviations or conflicts noted between PRD and architecture
  - Checklist Results
  - Next steps: For complex Godot features, suggest the user review the story draft and optionally test critical assumptions in Godot Editor

### 7. Godot-Specific Validation

Before finalizing, ensure:

- [ ] Language strategy defined (GDScript vs C# for each component)
- [ ] TDD approach specified (tests to write first)
- [ ] All node inheritance and composition patterns documented
- [ ] Signal connections and event flow mapped
- [ ] Scene instancing and pooling strategy defined
- [ ] InputMap actions configured
- [ ] Control node UI follows Godot anchoring best practices
- [ ] Performance profiling points identified (60+ FPS validation)
- [ ] Resource import settings documented
- [ ] Platform export settings noted
- [ ] Object pooling implemented for spawned entities
- [ ] Static typing enforced in all GDScript

This task ensures game development stories are immediately actionable and enable efficient AI-driven development of Godot game features with mandatory TDD practices and 60+ FPS performance targets.
