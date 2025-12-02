---
name: 'step-09-customize'
description: 'Optional personalization with customization file creation'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-09-customize.md'
nextStepFile: '{workflow_path}/steps/step-10-build-tools.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-customization-{project_name}.md'
configOutputFile: '{project-root}/.bmad/_cfg/agents/{target_module}-{agent_filename}.customize.yaml'

# Template References
customizationTemplate: '{workflow_path}/templates/agent-customization.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 9: Optional Customization File

## STEP GOAL:

Offer optional customization file creation for easy personality tweaking and command modification without touching core agent files, providing experimental flexibility for agent refinement.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a customization specialist who helps users refine agent behavior
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring customization expertise, user brings their refinement preferences, together we create flexible agent configuration options
- ✅ Maintain collaborative experimental tone throughout

### Step-Specific Rules:

- 🎯 Focus only on offering optional customization file creation
- 🚫 FORBIDDEN to make customization mandatory or required
- 💬 Approach: Emphasize experimental and flexible nature of customizations
- 📋 Present customization as optional enhancement for future tweaking

## EXECUTION PROTOCOLS:

- 🎯 Present customization as optional enhancement with clear benefits
- 💾 Create easy-to-use customization template when requested
- 📖 Explain customization file purpose and usage clearly
- 🚫 FORBIDDEN to proceed without clear user choice about customization

## CONTEXT BOUNDARIES:

- Available context: Complete agent configuration from previous steps
- Focus: Optional customization file creation for future agent tweaking
- Limits: No modifications to core agent files, only customization overlay
- Dependencies: Complete agent ready for optional customization

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Customization Introduction

Present this to the user:

"Would you like to create a customization file for {{agent_name}}? This is completely optional, but it gives you an easy way to tweak personality and commands later without touching the core agent files."

**Customization Benefits:**

- Easy personality adjustments without editing core files
- Command modifications without risking agent stability
- Experimental tweaks you can turn on/off
- Safe space to try new approaches

### 2. Customization Options Explanation

**What You Can Customize:**
"Through the customization file, you'll be able to:

- Fine-tune communication style and personality details
- Add or modify commands without affecting core structure
- Experiment with different approaches or settings
- Make quick adjustments as you learn how {{agent_name}} works best for you"

**How It Works:**
"The customization file acts like a settings overlay - it lets you override specific parts of {{agent_name}}'s configuration while keeping the core agent intact and stable."

### 3. User Choice Handling

**Option A: Create Customization File**
If user wants customization:
"Great! I'll create a customization file template with some common tweak options. You can fill in as much or as little as you want now, and modify it anytime later."

**Option B: Skip Customization**
If user declines:
"No problem! {{agent_name}} is ready to use as-is. You can always create a customization file later if you find you want to make adjustments."

### 4. Customization File Creation (if chosen)

When user chooses customization:

**Template Creation:**
"I'm creating your customization file with easy-to-use sections for:

- **Personality tweaks** - Adjust communication style or specific principles
- **Command modifications** - Add new commands or modify existing ones
- **Experimental features** - Try new approaches safely
- **Quick settings** - Common adjustments people like to make"

**File Location:**
"Your customization file will be saved at: `{configOutputFile}`"

### 5. Customization Guidance

**Getting Started:**
"The template includes comments explaining each section. You can start with just one or two adjustments and see how they work, then expand from there."

**Safety First:**
"Remember, the customization file is completely safe - you can't break {{agent_name}} by trying things here. If something doesn't work well, just remove or modify that section."

### 6. Document Customization Setup

#### Content to Append (if applicable):

```markdown
## Agent Customization File

### Customization Choice

[User chose to create/skip customization file]

### Customization Purpose

[If created: Explanation of customization capabilities]

### File Location

[Path to customization file or note of skip]

### Usage Guidance

[Instructions for using customization file]
```

Save this content to `{outputFile}` for reference.

### 7. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [customization decision made and file created if requested], will you then load and read fully `{nextStepFile}` to execute and begin build tools handling.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User understands customization file purpose and benefits
- Customization decision made clearly (create or skip)
- Customization file created with proper template when requested
- User guidance provided for using customization effectively
- Experimental and flexible nature emphasized appropriately
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Making customization mandatory or pressuring user
- Creating customization file without clear user request
- Not explaining customization benefits and usage clearly
- Overwhelming user with excessive customization options

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
