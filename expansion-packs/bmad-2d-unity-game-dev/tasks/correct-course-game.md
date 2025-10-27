<!-- Powered by BMAD™ Core -->

# Correct Course Task - Game Development

## Purpose

- Guide a structured response to game development change triggers using the `{root}/checklists/game-change-checklist`.
- Analyze the impacts of changes on game features, technical systems, and milestone deliverables.
- Explore game-specific solutions (e.g., performance optimizations, feature scaling, platform adjustments).
- Draft specific, actionable proposed updates to affected game artifacts (e.g., GDD sections, technical specs, Unity configurations).
- Produce a consolidated "Game Development Change Proposal" document for review and approval.
- Ensure clear handoff path for changes requiring fundamental redesign or technical architecture updates.

## Instructions

### 1. Initial Setup & Mode Selection

- **Acknowledge Task & Inputs:**
  - Confirm with the user that the "Game Development Correct Course Task" is being initiated.
  - Verify the change trigger (e.g., performance issue, platform constraint, gameplay feedback, technical blocker).
  - Confirm access to relevant game artifacts:
    - Game Design Document (GDD)
    - Technical Design Documents
    - Unity Architecture specifications
    - Performance budgets and platform requirements
    - Current sprint's game stories and epics
    - Asset specifications and pipelines
  - Confirm access to `{root}/checklists/game-change-checklist`.

- **Establish Interaction Mode:**
  - Ask the user their preferred interaction mode:
    - **"Incrementally (Default & Recommended):** Work through the game-change-checklist section by section, discussing findings and drafting changes collaboratively. Best for complex technical or gameplay changes."
    - **"YOLO Mode (Batch Processing):** Conduct batched analysis and present consolidated findings. Suitable for straightforward performance optimizations or minor adjustments."
  - Confirm the selected mode and inform: "We will now use the game-change-checklist to analyze the change and draft proposed updates specific to our Unity game development context."

### 2. Execute Game Development Checklist Analysis

- Systematically work through the game-change-checklist sections:
  1. **Change Context & Game Impact**
  2. **Feature/System Impact Analysis**
  3. **Technical Artifact Conflict Resolution**
  4. **Performance & Platform Evaluation**
  5. **Path Forward Recommendation**

- For each checklist section:
  - Present game-specific prompts and considerations
  - Analyze impacts on:
    - Unity scenes and prefabs
    - Component dependencies
    - Performance metrics (FPS, memory, build size)
    - Platform-specific code paths
    - Asset loading and management
    - Third-party plugins/SDKs
  - Discuss findings with clear technical context
  - Record status: `[x] Addressed`, `[N/A]`, `[!] Further Action Needed`
  - Document Unity-specific decisions and constraints

### 3. Draft Game-Specific Proposed Changes

Based on the analysis and agreed path forward:

- **Identify affected game artifacts requiring updates:**
  - GDD sections (mechanics, systems, progression)
  - Technical specifications (architecture, performance targets)
  - Unity-specific configurations (build settings, quality settings)
  - Game story modifications (scope, acceptance criteria)
  - Asset pipeline adjustments
  - Platform-specific adaptations

- **Draft explicit changes for each artifact:**
  - **Game Stories:** Revise story text, Unity-specific acceptance criteria, technical constraints
  - **Technical Specs:** Update architecture diagrams, component hierarchies, performance budgets
  - **Unity Configurations:** Propose settings changes, optimization strategies, platform variants
  - **GDD Updates:** Modify feature descriptions, balance parameters, progression systems
  - **Asset Specifications:** Adjust texture sizes, model complexity, audio compression
  - **Performance Targets:** Update FPS goals, memory limits, load time requirements

- **Include Unity-specific details:**
  - Prefab structure changes
  - Scene organization updates
  - Component refactoring needs
  - Shader/material optimizations
  - Build pipeline modifications

### 4. Generate "Game Development Change Proposal"

- Create a comprehensive proposal document containing:

  **A. Change Summary:**
  - Original issue (performance, gameplay, technical constraint)
  - Game systems affected
  - Platform/performance implications
  - Chosen solution approach

  **B. Technical Impact Analysis:**
  - Unity architecture changes needed
  - Performance implications (with metrics)
  - Platform compatibility effects
  - Asset pipeline modifications
  - Third-party dependency impacts

  **C. Specific Proposed Edits:**
  - For each game story: "Change Story GS-X.Y from: [old] To: [new]"
  - For technical specs: "Update Unity Architecture Section X: [changes]"
  - For GDD: "Modify [Feature] in Section Y: [updates]"
  - For configurations: "Change [Setting] from [old_value] to [new_value]"

  **D. Implementation Considerations:**
  - Required Unity version updates
  - Asset reimport needs
  - Shader recompilation requirements
  - Platform-specific testing needs

### 5. Finalize & Determine Next Steps

- Obtain explicit approval for the "Game Development Change Proposal"
- Provide the finalized document to the user

- **Based on change scope:**
  - **Minor adjustments (can be handled in current sprint):**
    - Confirm task completion
    - Suggest handoff to game-dev agent for implementation
    - Note any required playtesting validation
  - **Major changes (require replanning):**
    - Clearly state need for deeper technical review
    - Recommend engaging Game Architect or Technical Lead
    - Provide proposal as input for architecture revision
    - Flag any milestone/deadline impacts

## Output Deliverables

- **Primary:** "Game Development Change Proposal" document containing:
  - Game-specific change analysis
  - Technical impact assessment with Unity context
  - Platform and performance considerations
  - Clearly drafted updates for all affected game artifacts
  - Implementation guidance and constraints

- **Secondary:** Annotated game-change-checklist showing:
  - Technical decisions made
  - Performance trade-offs considered
  - Platform-specific accommodations
  - Unity-specific implementation notes
