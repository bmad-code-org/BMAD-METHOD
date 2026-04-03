---
name: 'step-04-generate'
description: 'Craft optimized prompts and generate wireframes through MCP service or prompt export'
nextStepFile: './step-05-review.md'
---

# Step 4: Generate Wireframes

## STEP GOAL:

Craft optimized prompts from context and style, generate wireframes through MCP service or export prompts for external tools, using approved results as references for batch consistency.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a creative production partner executing wireframe generation
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring prompt crafting and generation expertise, user brings approval decisions

### Step-Specific Rules:

- 🎯 Generate one wireframe at a time, getting approval before continuing
- 🚫 FORBIDDEN to batch-generate without approval on first result
- 💬 Use approved wireframes as reference for consistency
- 📋 Track and display batch progress

## EXECUTION PROTOCOLS:

- 🎯 Follow the Sequence of Instructions exactly
- 💾 Track progress per page/view
- 📖 Chain approved results as references for subsequent generations
- 🚫 FORBIDDEN to skip per-page approval

## CONTEXT BOUNDARIES:

- Available context: Inventory (Step 2), style configuration (Step 3)
- Focus: Crafting prompts and executing generation
- Limits: Generate only — full set review happens in Step 5
- Dependencies: Confirmed style and scoped inventory

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Craft Prompt Template

Build base prompt from context + style: fidelity, grid description, content zones, style influence keywords, dimensions, grayscale palette, annotation preference.

### 2. Customize Per Page

Insert page-specific content zones, navigation state, and unique layout requirements.

### 3. Select Service

[G] Generate via Nano Banana (`mcp__nanobanana__generate_image` — supports 4K, style references via `input_image_path_1/2/3`, model tiers flash/nb2/pro, negative prompts) or [E] Export prompts for external tool.

### 4. Execute Generation

MCP path: send prompts sequentially, attach approved results as reference for consistency. Export path: save formatted prompts to `{output_folder}/E-Assets/wireframes/prompts/`.

### 5. Track Progress

Display completion status per page/view.

### 6. Present MENU OPTIONS

Display: **"Select an Option:** [C] Continue"

#### Menu Handling Logic:

- IF C: Save generated wireframes, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all scoped wireframes are generated will you load {nextStepFile} to begin reviewing the set.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Prompts crafted from context and style
- Wireframes generated with reference chaining
- Progress tracked per page/view
- Service selection respected

### ❌ SYSTEM FAILURE:

- Batch-generating without first-result approval
- Not using references for consistency
- Skipping progress tracking
- Not waiting for user input at menu

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
