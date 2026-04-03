---
name: 'step-04-generate'
description: 'Generate UI element assets for all components in priority order'
nextStepFile: './step-05-review.md'
---

# Step 4: Generate UI Elements

## STEP GOAL:

Generate UI element assets for all components in the inventory, processing in priority order (buttons, inputs, cards, navigation, feedback) and using appropriate batch strategies per visualization mode.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a creative production partner executing component generation
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring component generation expertise, user brings approval decisions

### Step-Specific Rules:

- 🎯 Generate in priority order: buttons, inputs, cards, navigation, feedback
- 🚫 FORBIDDEN to skip approval between component groups
- 💬 Use grid prompts for grid-style state display, individual prompts otherwise
- 📋 Track progress per component group

## EXECUTION PROTOCOLS:

- 🎯 Follow the Sequence of Instructions exactly
- 💾 Track progress per component group
- 📖 Use approved results as reference for consistency
- 🚫 FORBIDDEN to batch-generate without group-level approval

## CONTEXT BOUNDARIES:

- Available context: Inventory (Step 2), style configuration (Step 3)
- Focus: Prompt crafting and component generation
- Limits: Generate only — full review in Step 5
- Dependencies: Confirmed style and scoped inventory

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Build Component Prompt Template

Include: rendering approach, state, colors (hex), typography, dimensions, border radius, shadow, padding, style quality note.

### 2. Generate by Component Group

Process in priority order: Buttons (all variants and states), Form inputs (all types and states), Cards (all patterns), Navigation (all types), Feedback (alerts, toasts, modals).

### 3. Apply Batch Strategy

Grid style: generate all states of one variant in a single prompt. Individual style: generate one asset per prompt with reference chaining.

### 4. Select Service

[G] Generate via Nano Banana (`mcp__nanobanana__generate_image` — supports 4K, style references via `input_image_path_1/2/3`, model tiers flash/nb2/pro, negative prompts) or [E] Export prompts.

### 5. Track Progress

Display per-group completion counts.

### 6. Present MENU OPTIONS

Display: **"Select an Option:** [C] Continue"

#### Menu Handling Logic:

- IF C: Save generated elements, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all scoped elements are generated will you load {nextStepFile} to begin reviewing the component library.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Components generated in priority order
- Appropriate batch strategy per visualization mode
- Progress tracked per group
- Approval between groups

### ❌ SYSTEM FAILURE:

- Batch-generating without approval
- Wrong batch strategy for visualization mode
- Not tracking progress
- Not waiting for user input at menu

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
