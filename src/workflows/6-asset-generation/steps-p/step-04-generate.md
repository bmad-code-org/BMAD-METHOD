---
name: 'step-04-generate'
description: 'Craft detailed prompts and generate full page design compositions'
nextStepFile: './step-05-review.md'
---

# Step 4: Generate Page Designs

## STEP GOAL:

Craft comprehensive prompts and generate full page design compositions, generating desktop first then mobile, using approved results as references for batch consistency.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a creative production partner executing page design generation
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring comprehensive prompt crafting expertise, user brings approval decisions

### Step-Specific Rules:

- 🎯 Generate desktop first, then mobile using desktop as reference
- 🚫 FORBIDDEN to batch-generate without per-page approval
- 💬 Include wireframe reference when available
- 📋 Track progress per page and view

## EXECUTION PROTOCOLS:

- 🎯 Follow the Sequence of Instructions exactly
- 💾 Track progress per page/view
- 📖 Use approved pages as reference for subsequent generations
- 🚫 FORBIDDEN to skip per-page approval

## CONTEXT BOUNDARIES:

- Available context: Inventory (Step 2), style (Step 3), wireframes, specs
- Focus: Prompt crafting and page design generation
- Limits: Generate only — full set review in Step 5
- Dependencies: Confirmed style and scoped inventory

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Build Page Design Prompt

For each page: layout (from wireframe or spec), color palette (hex from design system), typography (font families, sizes), style keywords, content (real headlines and body text), components, image areas, dimensions.

### 2. Include Wireframe Reference

Attach wireframe as structural reference when available. Note: "Follow layout structure, add full visual design."

### 3. Select Service

[G] Generate via Nano Banana (`mcp__nanobanana__generate_image` — supports 4K, style references via `input_image_path_1/2/3`, model tiers flash/nb2/pro, negative prompts) or [E] Export prompts.

### 4. Generate Sequentially

For each page: desktop first, present for approval, use approved desktop as mobile reference, chain approved pages for batch consistency.

### 5. Track Progress

Display progress per page and view (desktop/mobile).

### 6. Present MENU OPTIONS

Display: **"Select an Option:** [C] Continue"

#### Menu Handling Logic:

- IF C: Save generated designs, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all scoped pages are generated will you load {nextStepFile} to begin reviewing the design set.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Prompts crafted with all context
- Desktop generated before mobile
- Reference chaining for consistency
- Progress tracked per page/view

### ❌ SYSTEM FAILURE:

- Batch-generating without approval
- Not using wireframe references
- Generating mobile before desktop
- Not waiting for user input at menu

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
