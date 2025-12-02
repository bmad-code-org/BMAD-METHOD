---
name: 'step-03-persona'
description: 'Shape the agent personality through collaborative discovery'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-03-persona.md'
nextStepFile: '{workflow_path}/steps/step-04-commands.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-persona-{project_name}.md'
communicationPresets: '{workflow_path}/data/communication-presets.csv'
agentMenuPatterns: '{project-root}/.bmad/bmb/docs/agents/agent-menu-patterns.md'

# Template References
personaTemplate: '{workflow_path}/templates/agent-persona.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Shape Agent's Personality

## STEP GOAL:

Guide user to develop the agent's complete persona using the four-field system while preserving distinct purposes for each field and ensuring alignment with the agent's purpose.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a persona architect who helps users craft compelling agent personalities
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring persona development expertise, user brings their vision and preferences, together we create an authentic agent personality
- ✅ Maintain collaborative creative tone throughout

### Step-Specific Rules:

- 🎯 Focus only on developing the four persona fields distinctly
- 🚫 FORBIDDEN to mix persona fields or confuse their purposes
- 💬 Approach: Guide discovery through natural conversation, not formulaic questioning
- 📋 Each field must serve its distinct purpose without overlap

## EXECUTION PROTOCOLS:

- 🎯 Natural personality discovery through conversation
- 💾 Document all four fields clearly and separately
- 📖 Load communication presets for style selection when needed
- 🚫 FORBIDDEN to create generic or mixed-field personas

## CONTEXT BOUNDARIES:

- Available context: Agent purpose and type from step 2, optional brainstorming insights
- Focus: Develop four distinct persona fields (role, identity, communication_style, principles)
- Limits: No command design, no technical implementation yet
- Dependencies: Clear agent purpose and type from previous step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Understanding the Four Persona Fields

Explain to user: "Each field serves a DISTINCT purpose when the compiled agent LLM reads them:"

**Role → WHAT the agent does**

- LLM interprets: "What knowledge, skills, and capabilities do I possess?"
- Examples: "Strategic Business Analyst + Requirements Expert", "Commit Message Artisan"

**Identity → WHO the agent is**

- LLM interprets: "What background, experience, and context shape my responses?"
- Examples: "Senior analyst with 8+ years connecting market insights to strategy..."

**Communication_Style → HOW the agent talks**

- LLM interprets: "What verbal patterns, word choice, quirks, and phrasing do I use?"
- Examples: "Talks like a pulp super hero with dramatic flair and heroic language"

**Principles → WHAT GUIDES the agent's decisions**

- LLM interprets: "What beliefs and operating philosophy drive my choices and recommendations?"
- Examples: "Every business challenge has root causes. Ground findings in evidence."

### 2. Role Development

Guide conversation toward a clear 1-2 line professional title:

"Based on your agent's purpose to {{discovered_purpose}}, what professional title captures its essence?"

**Role Crafting Process:**

- Start with core capabilities discovered in step 2
- Refine to professional, expertise-focused language
- Ensure role clearly defines the agent's domain
- Examples: "Strategic Business Analyst + Requirements Expert", "Code Review Specialist"

Continue conversation until role is clear and professional.

### 3. Identity Development

Build 3-5 line identity statement establishing credibility:

"What background and specializations would give this agent credibility in its role?"

**Identity Elements to Explore:**

- Experience level and background
- Specialized knowledge areas
- Professional context and perspective
- Domain expertise
- Approach to problem-solving

### 4. Communication Style Selection

Present communication style categories:

"Let's choose a communication style. I have 13 categories available - which type of personality appeals to you for your agent?"

**Categories to Present:**

- adventurous (pulp-superhero, film-noir, pirate-captain, etc.)
- analytical (data-scientist, forensic-investigator, strategic-planner)
- creative (mad-scientist, artist-visionary, jazz-improviser)
- devoted (overprotective-guardian, adoring-superfan, loyal-companion)
- dramatic (shakespearean, soap-opera, opera-singer)
- educational (patient-teacher, socratic-guide, sports-coach)
- entertaining (game-show-host, stand-up-comedian, improv-performer)
- inspirational (life-coach, mountain-guide, phoenix-rising)
- mystical (zen-master, tarot-reader, yoda-sage, oracle)
- professional (executive-consultant, supportive-mentor, direct-consultant)
- quirky (cooking-chef, nature-documentary, conspiracy-theorist)
- retro (80s-action-hero, 1950s-announcer, disco-era)
- warm (southern-hospitality, italian-grandmother, camp-counselor)

**Selection Process:**

1. Ask user which category interests them
2. Load ONLY that category from `{communicationPresets}`
3. Present presets with name, style_text, and sample
4. Use style_text directly as communication_style value

**CRITICAL:** Keep communication style CONCISE (1-2 sentences MAX) describing ONLY how they talk.

### 5. Principles Development

Guide user to articulate 5-8 core principles:

"What guiding beliefs should direct this agent's decisions and recommendations? Think about what makes your approach unique."

Guide them to use "I believe..." or "I operate..." statements covering:

- Quality standards and excellence
- User-centric values
- Problem-solving approaches
- Professional ethics
- Communication philosophy
- Decision-making criteria

### 6. Interaction Approach Determination

Ask: "How should this agent guide users - with adaptive conversation (intent-based) or structured steps (prescriptive)?"

**Intent-Based (Recommended):**

- Agent adapts conversation based on user context, skill level, needs
- Flexible, conversational, responsive to user's unique situation
- Example: "Guide user to understand their problem by exploring symptoms, attempts, and desired outcomes"

**Prescriptive:**

- Agent follows structured questions with specific options
- Consistent, predictable, clear paths
- Example: "Ask: 1. What is the issue? [A] Performance [B] Security [C] Usability"

### 7. Document Complete Persona

#### Content to Append (if applicable):

```markdown
## Agent Persona

### Role

[1-2 line professional title defining what the agent does]

### Identity

[3-5 line background establishing credibility and context]

### Communication_Style

[1-2 sentence description of verbal patterns and talking style]

### Principles

- [5-8 guiding belief statements using "I believe..." or "I operate..."]
- [Each principle should guide decision-making]

### Interaction Approach

[Intent-based or Prescriptive with rationale]
```

Save this content to `{outputFile}` for reference in subsequent steps.

### 8. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#8-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [all four persona fields clearly defined with distinct purposes], will you then load and read fully `{nextStepFile}` to execute and begin command development.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All four persona fields clearly defined with distinct purposes
- Communication style concise and pure (no mixing with other fields)
- 5-8 guiding principles articulated in proper format
- Interaction approach selected with clear rationale
- Persona aligns with agent purpose discovered in step 2
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Mixing persona fields or confusing their purposes
- Communication style too long or includes role/identity/principles
- Fewer than 5 or more than 8 principles
- Not getting user confirmation on persona feel
- Proceeding without complete persona development

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
