---
name: 'step-06-structure'
description: 'Define project structure, directory organization, and architectural boundaries'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-06-structure.md'
nextStepFile: './step-07-patterns.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Project Structure

**Progress: Step 6 of 9** - Next: Implementation Patterns

## STEP GOAL:

Define the complete project structure including directory organization, file naming conventions, and architectural boundaries. This ensures all AI agents place code consistently.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game architect facilitator
- Project structure prevents "where does this go?" confusion
- Clear boundaries enable parallel development

### Step-Specific Rules:

- Structure must be complete, not generic placeholders
- Map every major system to a location
- Define naming conventions explicitly

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after structure defined
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Refine structure organization
- **P (Party Mode)**: Get perspectives on layout
- **C (Continue)**: Confirm structure and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Determine Organization Pattern

"Let's define how your project will be organized.

**Organization Patterns:**

| Pattern           | Description                      | Best For      |
| ----------------- | -------------------------------- | ------------- |
| **By Feature**    | All related files together       | Feature teams |
| **By Type**       | Scripts, assets, scenes separate | Traditional   |
| **Hybrid**        | Types at top, features within    | Balanced      |
| **Domain-Driven** | By game domain/system            | Complex games |

**Engine Conventions:**

- {{engine}} typically uses: {{engine_convention}}

What organization pattern do you prefer?"

### 2. Define Root Structure

"Based on {{selected_pattern}}, let's define your root structure.

**For {{engine}}, typical root looks like:**

```
{{project_name}}/
├── {{source_folder}}/          # Game source code
├── {{assets_folder}}/          # Art, audio, data
├── {{scenes_folder}}/          # Scene/level files
├── {{tests_folder}}/           # Test files
├── {{docs_folder}}/            # Documentation
└── {{config_files}}            # Project config
```

Does this work, or would you like to adjust?"

### 3. Detail Source Structure

"Now let's detail the source code organization.

**Based on your systems:**
{{list_of_systems_from_context}}

**Proposed structure:**

```
{{source_folder}}/
├── core/                   # Core systems (singletons, managers)
│   ├── {{core_systems}}
├── gameplay/               # Gameplay mechanics
│   ├── {{gameplay_systems}}
├── ui/                     # User interface
│   ├── {{ui_organization}}
├── utils/                  # Utilities and helpers
│   ├── {{util_types}}
└── data/                   # Data structures and models
    └── {{data_types}}
```

What adjustments would you make?"

### 4. Define Asset Structure

"Let's organize your assets.

**Asset Categories:**

- Art (sprites, textures, models)
- Audio (music, sfx, voice)
- Data (configurations, levels)
- UI (interface assets)

**Proposed asset structure:**

```
{{assets_folder}}/
├── art/
│   ├── {{art_categories}}
├── audio/
│   ├── music/
│   ├── sfx/
│   └── {{audio_categories}}
├── data/
│   └── {{data_file_types}}
└── ui/
    └── {{ui_asset_types}}
```

How should assets be organized?"

### 5. Map Systems to Locations

"Let's map each major system to its location.

| System | Location | Notes |
| ------ | -------- | ----- |

{{system_location_mapping}}

Does this mapping make sense for your project?"

### 6. Define Naming Conventions

"Finally, let's establish naming conventions.

**Files:**

- Scripts: {{script_naming}} (e.g., PlayerController, enemy_spawner)
- Scenes: {{scene_naming}} (e.g., Level01, main_menu)
- Assets: {{asset_naming}} (e.g., player_idle, btn_play)

**Code Elements:**

- Classes: {{class_naming}} (e.g., PascalCase)
- Functions: {{function_naming}} (e.g., snake_case, camelCase)
- Variables: {{variable_naming}}
- Constants: {{constant_naming}} (e.g., UPPER_SNAKE)

**Game-Specific:**

- Prefabs/Scenes: {{prefab_naming}}
- Animation clips: {{animation_naming}}
- Event names: {{event_naming}}

What are your naming preferences?"

### 7. Generate Structure Section

Based on the conversation, prepare the content:

```markdown
## Project Structure

### Organization Pattern

**Pattern:** {{organization_pattern}}

**Rationale:** {{why_this_pattern}}

### Directory Structure
```

{{project_name}}/
{{complete_directory_tree}}

```

### System Location Mapping

| System | Location | Responsibility |
| ------ | -------- | -------------- |
{{system_mapping_table}}

### Naming Conventions

#### Files
{{file_naming_rules}}

#### Code Elements
| Element | Convention | Example |
| ------- | ---------- | ------- |
{{code_naming_table}}

#### Game Assets
{{asset_naming_rules}}

### Architectural Boundaries

{{boundary_rules}}
```

### 8. Present Content and Menu

Show the generated content to the user and present:

"I've defined the complete project structure.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 7]

**Validation Check:**

- Can every system find its home?
- Are naming conventions clear and consistent?
- Will AI agents know exactly where to place new code?

**Select an Option:**
[A] Advanced Elicitation - Refine structure organization
[P] Party Mode - Get perspectives on layout
[C] Continue - Save this and move to Implementation Patterns (Step 7 of 9)"

### 9. Handle Menu Selection

#### IF A (Advanced Elicitation):

- Execute {advancedElicitationTask} with the current content
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF P (Party Mode):

- Execute {partyModeWorkflow} with the current content
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF C (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [structure content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Complete directory structure defined
- Every system mapped to location
- Naming conventions explicit and consistent
- No placeholder or generic structures
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6]

### SYSTEM FAILURE:

- Generic structure with placeholders
- Systems without clear locations
- Vague naming conventions
- Not presenting A/P/C menu after structure
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
