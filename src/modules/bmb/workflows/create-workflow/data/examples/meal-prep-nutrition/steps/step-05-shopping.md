---
name: 'step-05-shopping'
description: 'Create a comprehensive shopping list that supports the meal strategy'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/reference/workflows/meal-prep-nutrition'

# File References
thisStepFile: '{workflow_path}/steps/step-05-shopping.md'
nextStepFile: '{workflow_path}/steps/step-06-prep-schedule.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/nutrition-plan-{project_name}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'

# Template References
shoppingTemplate: '{workflow_path}/templates/shopping-section.md'
---

# Step 5: Shopping List Generation

## 🎯 Objective

Create a comprehensive, organized shopping list that supports the meal strategy while minimizing waste and cost.

## 📋 MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 CRITICAL: This step is OPTIONAL - skip if user cooks <2x per week
- 📖 CRITICAL: Cross-reference with existing pantry items
- 🔄 CRITICAL: Organize by store section for efficient shopping
- ✅ Include quantities based on serving sizes and meal frequency
- 🚫 DO NOT forget staples and seasonings
  Only proceed if:

```yaml
cookingFrequency: "3-5x" OR "daily"
```

Otherwise, skip to Step 5: Prep Schedule

## 📊 Shopping List Organization:

### 1. By Store Section

```
PRODUCE:
- [Item] - [Quantity] - [Meal(s) used in]
PROTEIN:
- [Item] - [Quantity] - [Meal(s) used in]
DAIRY/ALTERNATIVES:
- [Item] - [Quantity] - [Meal(s) used in]
GRAINS/STARCHES:
- [Item] - [Quantity] - [Meal(s) used in]
FROZEN:
- [Item] - [Quantity] - [Meal(s) used in]
PANTRY:
- [Item] - [Quantity] - [Meal(s) used in]
```

### 2. Quantity Calculations

Based on:

- Serving size x number of servings
- Buffer for mistakes/snacks (10-20%)
- Bulk buying opportunities
- Shelf life considerations

### 3. Cost Optimization

- Bulk buying for non-perishables
- Seasonal produce recommendations
- Protein budgeting strategies
- Store brand alternatives

## 🔍 SMART SHOPPING FEATURES:

### Meal Prep Efficiency:

- Multi-purpose ingredients (e.g., spinach for salads AND smoothies)
- Batch prep staples (grains, proteins)
- Versatile seasonings

### Waste Reduction:

- "First to use" items for perishables
- Flexible ingredient swaps
- Portion planning

### Budget Helpers:

- Priority items (must-have vs nice-to-have)
- Bulk vs fresh decisions
- Seasonal substitutions

## ✅ SUCCESS METRICS:

- Complete list organized by store section
- Quantities calculated accurately
- Pantry items cross-referenced
- Budget considerations addressed
- Waste minimization strategies included

## ❌ FAILURE MODES TO AVOID:

- Forgetting staples and seasonings
- Buying too much of perishable items
- Not organizing by store section
- Ignoring user's budget constraints
- Not checking existing pantry items

## 💬 SAMPLE DIALOG STYLE:

**✅ GOOD (Intent-based):**
"Let's organize your shopping trip for maximum efficiency. I'll group items by store section. Do you currently have basic staples like olive oil, salt, and common spices?"

**❌ AVOID (Prescriptive):**
"Buy exactly: 3 chicken breasts, 2 lbs broccoli, 1 bag rice..."

## 📝 OUTPUT REQUIREMENTS:

Append to {outputFile} by loading and appending content from {shoppingTemplate}

## 🎭 AI PERSONA REMINDER:

You are a **strategic shopping partner** who:

- Makes shopping efficient and organized
- Helps save money without sacrificing nutrition
- Plans for real-life shopping scenarios
- Minimizes food waste thoughtfully

## 📊 STATUS UPDATE:

Update workflow.md frontmatter:

```yaml
shoppingListGenerated: true
budgetOptimized: [yes/partial/no]
pantryChecked: [yes/no]
```

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Budget Optimization Strategies [P] Shopping Perspectives [C] Continue to Prep Schedule

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- HALT and AWAIT ANSWER
- IF A: Execute `{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml`
- IF P: Execute `{project-root}/_bmad/core/workflows/party-mode/workflow.md`
- IF C: Save content to nutrition-plan.md, update frontmatter, then load, read entire file, then execute `{workflow_path}/step-06-prep-schedule.md`
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content is saved to document and frontmatter is updated, will you then load, read entire file, then execute `{workflow_path}/step-06-prep-schedule.md` to execute and begin meal prep schedule creation.
