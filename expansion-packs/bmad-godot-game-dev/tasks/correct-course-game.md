# Correct Course Task - Godot Game Development

## Purpose

- Guide a structured response to Godot game development change triggers using the `.bmad-godot-game-dev/checklists/game-change-checklist`.
- Analyze the impacts of changes on game features, node systems, and performance targets (60+ FPS).
- Explore Godot-specific solutions (e.g., GDScript vs C# optimization, scene restructuring, platform export adjustments).
- Draft specific, actionable proposed updates to affected game artifacts (e.g., GDD sections, technical specs, Godot project settings).
- Produce a consolidated "Godot Game Development Change Proposal" document for review and approval.
- Ensure clear handoff path for changes requiring fundamental redesign, language migration, or architecture updates.

## Instructions

### 1. Initial Setup & Mode Selection

- **Acknowledge Task & Inputs:**
  - Confirm with the user that the "Godot Game Development Correct Course Task" is being initiated.
  - Verify the change trigger (e.g., 60+ FPS performance issue, GDScript/C# migration need, node system refactor, platform export problem).
  - Confirm access to relevant game artifacts:
    - Game Design Document (GDD)
    - Technical Design Documents
    - Godot Architecture specifications (node hierarchy, signal flow)
    - Performance budgets (60+ FPS minimum) and platform requirements
    - Current sprint's game stories with TDD test coverage
    - Asset import settings and resource management
    - Language strategy documentation (GDScript vs C#)
  - Confirm access to `.bmad-godot-game-dev/checklists/game-change-checklist`.

- **Establish Interaction Mode:**
  - Ask the user their preferred interaction mode:
    - **"Incrementally (Default & Recommended):** Work through the game-change-checklist section by section, discussing findings and drafting changes collaboratively. Best for complex node restructuring, language migrations, or performance optimizations."
    - **"YOLO Mode (Batch Processing):** Conduct batched analysis and present consolidated findings. Suitable for straightforward scene optimizations or export setting adjustments."
  - Confirm the selected mode and inform: "We will now use the game-change-checklist to analyze the change and draft proposed updates specific to our Godot game development context with 60+ FPS targets and TDD practices."

### 2. Execute Game Development Checklist Analysis

- Systematically work through the game-change-checklist sections:
  1. **Change Context & Game Impact**
  2. **Feature/System Impact Analysis**
  3. **Technical Artifact Conflict Resolution**
  4. **Performance & Platform Evaluation**
  5. **Path Forward Recommendation**

- For each checklist section:
  - Present Godot-specific prompts and considerations
  - Analyze impacts on:
    - Godot scenes and node hierarchies
    - Signal connections and dependencies
    - Performance metrics (60+ FPS requirement, frame time, draw calls)
    - GDScript vs C# language boundaries
    - Resource loading and object pooling
    - Platform export templates and settings
    - TDD test coverage (GUT for GDScript, GoDotTest for C#)
  - Discuss findings with performance profiler data
  - Record status: `[x] Addressed`, `[N/A]`, `[!] Further Action Needed`
  - Document Godot-specific decisions and language choices

### 3. Draft Game-Specific Proposed Changes

Based on the analysis and agreed path forward:

- **Identify affected game artifacts requiring updates:**
  - GDD sections (mechanics, systems, progression)
  - Technical specifications (node architecture, 60+ FPS targets)
  - Godot-specific configurations (project settings, export presets)
  - Game story modifications (TDD requirements, language choices)
  - Resource import settings and compression
  - Platform export template configurations
  - Test suite updates (GUT/GoDotTest coverage)

- **Draft explicit changes for each artifact:**
  - **Game Stories:** Revise story text, TDD test requirements, GDScript/C# language selection
  - **Technical Specs:** Update node hierarchies, signal architectures, 60+ FPS validation
  - **Godot Configurations:** Propose project settings, rendering options, export templates
  - **GDD Updates:** Modify feature descriptions, balance parameters, progression systems
  - **Resource Specifications:** Adjust import settings, compression, pooling strategies
  - **Performance Targets:** Ensure 60+ FPS minimum, frame time <16.67ms, draw call budgets
  - **Test Coverage:** Update GUT tests for GDScript, GoDotTest for C# components

- **Include Godot-specific details:**
  - Scene tree structure changes
  - Node composition updates
  - Signal refactoring needs
  - Shader/material optimizations
  - Language migration paths (GDScript ↔ C#)
  - Object pooling implementations
  - Export preset modifications

### 4. Generate "Godot Game Development Change Proposal"

- Create a comprehensive proposal document containing:

  **A. Change Summary:**
  - Original issue (60+ FPS violation, language inefficiency, node bottleneck)
  - Godot systems affected (scenes, nodes, signals)
  - Platform/performance implications (frame time impact)
  - Chosen solution approach (GDScript optimization, C# migration, pooling)

  **B. Technical Impact Analysis:**
  - Godot node architecture changes needed
  - Performance implications (profiler metrics, FPS measurements)
  - Language strategy adjustments (GDScript vs C# boundaries)
  - Resource loading and pooling modifications
  - Platform export compatibility effects
  - TDD test suite impacts (GUT/GoDotTest coverage)

  **C. Specific Proposed Edits:**
  - For each game story: "Change Story GS-X.Y from: [old] To: [new with TDD requirements]"
  - For technical specs: "Update Godot Architecture Section X: [node/signal changes]"
  - For GDD: "Modify [Feature] in Section Y: [updates with performance targets]"
  - For project.godot: "Change [Setting] from [old_value] to [new_value]"
  - For language strategy: "Migrate [System] from GDScript to C# for performance"

  **D. Implementation Considerations:**
  - Required Godot version (4.x vs 3.x LTS)
  - Resource reimport with optimized settings
  - Scene and node refactoring requirements
  - GDScript static typing enforcement
  - C# performance optimization needs
  - Object pooling implementation
  - Platform export template testing
  - TDD test updates (Red-Green-Refactor cycle)

### 5. Finalize & Determine Next Steps

- Obtain explicit approval for the "Godot Game Development Change Proposal"
- Verify 60+ FPS targets are maintained post-change
- Provide the finalized document to the user

- **Based on change scope:**
  - **Minor adjustments (can be handled in current sprint):**
    - Confirm task completion
    - Verify TDD tests are updated
    - Suggest handoff to game-developer agent for implementation
    - Note required performance profiling validation
  - **Major changes (require replanning):**
    - Clearly state need for deeper technical review
    - Recommend engaging Game Architect for node restructuring
    - Evaluate language migration complexity (GDScript ↔ C#)
    - Provide proposal as input for architecture revision
    - Flag any 60+ FPS risks or TDD coverage gaps

## Output Deliverables

- **Primary:** "Godot Game Development Change Proposal" document containing:
  - Godot-specific change analysis
  - Technical impact assessment with node/signal context
  - Language strategy implications (GDScript vs C#)
  - Performance validation against 60+ FPS target
  - Clearly drafted updates for all affected game artifacts
  - TDD test coverage requirements
  - Implementation guidance following Carmack's optimization principles

- **Secondary:** Annotated game-change-checklist showing:
  - Technical decisions made (node architecture, language choices)
  - Performance trade-offs considered (profiler data)
  - Platform export accommodations
  - Godot-specific implementation notes
  - Required test updates (GUT/GoDotTest)
