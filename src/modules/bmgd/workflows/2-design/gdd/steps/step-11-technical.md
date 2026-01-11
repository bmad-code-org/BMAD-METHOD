---
name: 'step-11-technical'
description: 'Define technical specifications and requirements'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-11-technical.md'
nextStepFile: './step-12-epics.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 11: Technical Specifications

**Progress: Step 11 of 14** - Next: Epic Structure

## STEP GOAL:

Define technical requirements including performance targets, platform-specific details, and asset requirements. This provides a bridge to the architecture workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Technical specs inform the architecture workflow
- Not all technical decisions are made here - architecture comes later

### Step-Specific Rules:

- Focus on requirements, not implementation details
- FORBIDDEN to generate tech specs without user input
- Keep scope appropriate - detailed architecture comes in a separate workflow
- Reference target platform(s) from step 3

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into technical requirements
- **P (Party Mode)**: Get technical perspectives
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- All previous context available (especially platform from step 3)
- This is GDD-level specs, not architecture-level details
- Engine/framework selection happens in architecture workflow

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Performance Requirements Discovery

**Guide user through performance targets:**

"Let's define the technical requirements for {{game_name}}.

**Performance Targets:**

| Platform    | Typical Targets                             |
| ----------- | ------------------------------------------- |
| **PC**      | 60fps @ 1080p minimum, 4K optional          |
| **Console** | 30fps or 60fps depending on visual fidelity |
| **Mobile**  | 30fps, thermal management, battery life     |
| **Web**     | 30-60fps, file size under 50MB              |
| **VR**      | 72-90fps minimum, latency critical          |

**For {{game_type}} on {{platform}}:**

**Questions to consider:**

1. What frame rate are you targeting?
2. What resolutions should be supported?
3. What's the acceptable load time?
4. Any specific performance priorities? (visuals vs frame rate)

What are your performance targets for {{game_name}}?"

### 2. Platform-Specific Requirements

**Guide user through platform details:**

"Now let's capture platform-specific considerations for {{platform}}.

**Platform-Specific Questions:**

**PC:**

- Minimum and recommended specs?
- Steam/Epic/itch.io features to support?
- Mod support planned?
- Cloud saves?

**Console:**

- Certification requirements awareness?
- Controller-only or hybrid input?
- Achievement/trophy integration?

**Mobile:**

- iOS minimum version? Android API level?
- Portrait, landscape, or both?
- Offline play required?
- In-app purchases planned?

**Web:**

- Target browsers?
- WebGL version?
- Maximum build size?

What platform-specific requirements matter for {{game_name}}?"

### 3. Asset Requirements Discovery

**Guide user through asset considerations:**

"Finally, let's document asset requirements and constraints.

**Asset Categories:**

| Category             | Considerations                        |
| -------------------- | ------------------------------------- |
| **Sprites/Textures** | Resolution, count estimates, atlasing |
| **3D Models**        | Poly budgets, LOD levels, rigging     |
| **Animations**       | Frame counts, skeletal vs sprite      |
| **Audio**            | Music tracks, SFX count, voice lines  |
| **UI**               | Resolution scaling, localization      |

**Questions to consider:**

1. What are the major asset categories you'll need?
2. Any rough estimates on asset counts?
3. What quality level are you targeting?
4. Any external assets planned (asset store, licensed content)?

What are the key asset requirements for {{game_name}}?"

### 4. Generate Technical Content

Based on the conversation, prepare the content:

```markdown
## Technical Specifications

### Performance Requirements

{{performance_targets_description}}

#### Frame Rate Target

{{target_fps}}

#### Resolution Support

{{resolution_targets}}

#### Load Times

{{load_time_requirements}}

### Platform-Specific Details

{{platform_specific_requirements}}

#### {{platform}} Requirements

{{platform_details}}

### Asset Requirements

{{asset_requirements_overview}}

#### Art Assets

{{art_asset_requirements}}

#### Audio Assets

{{audio_asset_requirements}}

#### External Assets

{{third_party_asset_plans}}

### Technical Constraints

{{any_known_limitations_or_requirements}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Technical Specifications based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Note:** This is GDD-level technical planning. Detailed architecture decisions (engine selection, specific technologies, system design) will be addressed in the Architecture workflow after the GDD is complete.

**Select an Option:**
[A] Advanced Elicitation - Deep dive into technical requirements
[P] Party Mode - Get technical perspectives
[C] Continue - Save this and move to Epic Structure (Step 12 of 14)"

### 6. Handle Menu Selection

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [technical content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Performance targets clearly defined
- Platform-specific requirements documented
- Asset requirements outlined
- Scope appropriate for GDD (not architecture-level detail)
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

### SYSTEM FAILURE:

- Generating tech specs without user input
- Going too deep into architecture details
- Missing key platform requirements
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
