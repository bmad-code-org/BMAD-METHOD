---
name: 'step-04-generate'
description: 'Batch-generate icons with consistent style across the entire set'
nextStepFile: './step-05-review.md'
---

# Step 4: Generate Icons

## STEP GOAL:

Batch-generate icons with consistent style across the entire set, processing related icons in groups for maximum visual consistency and using approved results as references for subsequent icons.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a creative production partner executing icon generation
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring prompt crafting and batch generation expertise, user brings approval decisions
- ✅ Maintain an efficient, production-focused tone

### Step-Specific Rules:

- 🎯 Generate icons in groups for consistency (navigation, action, status, feature, social)
- 🚫 FORBIDDEN to skip group-by-group approval
- 💬 Get approval on first icon of each group before batch-generating the rest
- 📋 Track progress and display completion status

## EXECUTION PROTOCOLS:

- 🎯 Follow the Sequence of Instructions exactly
- 💾 Track generation progress per group
- 📖 Use approved icons as references for subsequent generations
- 🚫 FORBIDDEN to batch-generate without approval of first icon in group

## CONTEXT BOUNDARIES:

- Available context: Icon inventory (Step 2), style configuration (Step 3)
- Focus: Crafting prompts and executing icon generation
- Limits: Generate only — review as a complete set happens in next step
- Dependencies: Confirmed style and scoped inventory

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Build Icon Prompt Template

Construct base prompt using style configuration: style type, stroke/fill details, canvas size, padding, color mode, background transparency.

### 2. Generate by Group

Process related icons together for consistency:
1. Navigation set (menu, close, search, arrows, chevrons)
2. Action set (edit, delete, save, share, copy, download, upload)
3. Status set (success/check, warning, error/x, info)
4. Feature set (page-specific icons)
5. Social set (platform icons)

For each group: generate first icon, get approval, use as reference for rest of group.

### 3. Select Service

Present options: [G] Generate via Nano Banana (`mcp__nanobanana__generate_image` — supports 4K, style references via `input_image_path_1/2/3`, model tiers flash/nb2/pro, negative prompts), [E] Export prompts (for external generation), [L] Library match (search open-source icon libraries).

### 4. Optimize SVG Output

For each generated icon: clean SVG markup, ensure viewBox is correct, set stroke/fill to currentColor for monochrome, validate pixel alignment.

### 5. Track Progress

Display generation progress per group with completion counts.

### 6. Present MENU OPTIONS

Display: **"Select an Option:** [C] Continue"

#### Menu Handling Logic:

- IF C: Save generated icons, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can chat or ask questions — always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all scoped icons are generated will you load {nextStepFile} to begin reviewing the complete set.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Icons generated in consistent groups
- First icon of each group approved before batch generation
- SVG optimization applied to all icons
- Progress tracked and displayed

### ❌ SYSTEM FAILURE:

- Batch-generating without first-icon approval
- Not using approved icons as references
- Skipping SVG optimization
- Not waiting for user input at menu

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
