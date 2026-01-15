---
name: 'step-03-platforms'
description: 'Define target platforms and target audience for the game'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-03-platforms.md'
nextStepFile: './step-04-vision.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Platforms & Audience

**Progress: Step 3 of 14** - Next: Goals & Vision

## STEP GOAL:

Define the target platform(s) for the game and establish a clear picture of the target audience, including demographics, gaming experience level, and preferred play patterns.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- We engage in collaborative dialogue, not command-response
- Platform and audience decisions drive many downstream choices - take this seriously

### Step-Specific Rules:

- Focus on platform capabilities and audience characteristics
- FORBIDDEN to generate detailed content without real user input
- Consider platform-specific constraints (controls, performance, monetization)
- Approach: Guide user through considerations they may not have thought about

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content for each section
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore platform constraints and audience nuances deeper
- **P (Party Mode)**: Get multiple perspectives on platform/audience decisions
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- Game type and core concept from step 2 are available
- Platform choice affects many downstream decisions
- Audience definition affects tone, complexity, and accessibility

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Platform Discovery

**Guide user through platform selection:**

"Now let's talk about where players will experience {{game_name}}.

**Platform Options to Consider:**

| Platform                     | Considerations                                                           |
| ---------------------------- | ------------------------------------------------------------------------ |
| **PC (Steam/Epic)**          | Full keyboard/mouse, highest specs, Steam achievements, workshop support |
| **Web Browser**              | Instant access, limited performance, broad reach, touch/mouse hybrid     |
| **Mobile (iOS/Android)**     | Touch controls, short sessions, IAP monetization, battery/thermal limits |
| **Console (Switch/PS/Xbox)** | Controller-first, certification requirements, couch multiplayer          |
| **VR (Quest/PCVR)**          | Motion controls, comfort considerations, presence                        |

**For {{game_type}} games, common platform choices include:** {platform_suggestions_from_game_type}

**Questions to consider:**

1. Where do your target players primarily game?
2. Does your core gameplay work well with {platform} input methods?
3. Are you targeting a primary platform with potential ports later?

What platform(s) are you targeting?"

### 2. Capture Platform Details

**After user responds:**

Document:

- Primary platform (if multiple)
- Platform-specific control schemes
- Performance considerations (60fps target, resolution, etc.)
- Platform-specific features to leverage (achievements, cloud saves, etc.)

### 3. Audience Discovery

**Guide user through audience definition:**

"Now let's define who {{game_name}} is for.

**Demographics to Consider:**

- **Age Range:** What ages are you designing for? (affects content, complexity, monetization)
- **Gaming Experience:** Casual, core, or hardcore gamers?
- **Genre Familiarity:** Do they know {{game_type}} conventions, or are they new to the genre?
- **Session Length:** Quick mobile sessions (5-15 min) or deep PC sessions (1+ hour)?

**For {{game_type}} games, typical audiences include:**
{audience_suggestions_from_game_type}

Tell me about your ideal player. Who is this game for?"

### 4. Capture Audience Details

**After user responds:**

Document:

- Primary demographic
- Gaming experience level
- Genre familiarity expectations
- Preferred session lengths
- Secondary audiences (if any)

### 5. Generate Platforms & Audience Content

Based on the conversation, prepare the content:

```markdown
## Target Platform(s)

### Primary Platform

{{primary_platform}}

### Platform Considerations

{{platform_specific_details}}

### Control Scheme

{{control_scheme_for_platform}}

---

## Target Audience

### Demographics

{{target_demographics}}

### Gaming Experience

{{experience_level}} - {{experience_description}}

### Genre Familiarity

{{genre_familiarity_description}}

### Session Length

{{typical_session_length}} - {{session_description}}

### Player Motivations

{{what_draws_this_audience_to_this_game}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Platforms & Audience sections based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Select an Option:**
[A] Advanced Elicitation - Explore platform/audience deeper
[P] Party Mode - Get other perspectives on these decisions
[C] Continue - Save this and move to Goals & Vision (Step 4 of 14)"

### 7. Handle Menu Selection

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
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [platforms and audience content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Platform(s) clearly identified with rationale
- Platform-specific considerations documented
- Target audience demographics defined
- Gaming experience level captured
- Session length expectations established
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3]

### SYSTEM FAILURE:

- Assuming platform without user confirmation
- Generating audience profile without user input
- Not considering platform-specific constraints
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
