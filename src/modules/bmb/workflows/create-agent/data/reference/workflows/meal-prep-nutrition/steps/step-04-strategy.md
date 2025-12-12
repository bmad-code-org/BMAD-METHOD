---
name: 'step-04-strategy'
description: 'Design a personalized meal strategy that meets nutritional needs and fits lifestyle'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/reference/workflows/meal-prep-nutrition'

# File References
thisStepFile: '{workflow_path}/steps/step-04-strategy.md'
nextStepFile: '{workflow_path}/steps/step-05-shopping.md'
alternateNextStepFile: '{workflow_path}/steps/step-06-prep-schedule.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/nutrition-plan-{project_name}.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'

# Data References
recipeDatabase: '{workflow_path}/data/recipe-database.csv'

# Template References
strategyTemplate: '{workflow_path}/templates/strategy-section.md'
---

# Step 4: Meal Strategy Creation

## 🎯 Objective

Design a personalized meal strategy that meets nutritional needs, fits lifestyle, and accommodates restrictions.

## 📋 MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER suggest meals without considering ALL user restrictions
- 📖 CRITICAL: Reference recipe-database.csv for meal ideas
- 🔄 CRITICAL: Ensure macro distribution meets calculated targets
- ✅ Start with familiar foods, introduce variety gradually
- 🚫 DO NOT create a plan that requires advanced cooking skills if user is beginner

### 1. Meal Structure Framework

Based on user profile:

- **Meal frequency** (3 meals/day + snacks, intermittent fasting, etc.)
- **Portion sizing** based on goals and activity
- **Meal timing** aligned with daily schedule
- **Prep method** (batch cooking, daily prep, hybrid)

### 2. Food Categories Allocation

Ensure each meal includes:

- **Protein source** (lean meats, fish, plant-based options)
- **Complex carbohydrates** (whole grains, starchy vegetables)
- **Healthy fats** (avocado, nuts, olive oil)
- **Vegetables/Fruits** (5+ servings daily)
- **Hydration** (water intake plan)

### 3. Weekly Meal Framework

Create pattern that can be repeated:

```
Monday: Protein + Complex Carb + Vegetables
Tuesday: ...
Wednesday: ...
```

- Rotate protein sources for variety
- Incorporate favorite cuisines
- Include one "flexible" meal per week
- Plan for leftovers strategically

## 🔍 REFERENCE DATABASE:

Load recipe-database.csv for:

- Quick meal ideas (<15 min)
- Batch prep friendly recipes
- Restriction-specific options
- Macro-friendly alternatives

## 🎯 PERSONALIZATION FACTORS:

### For Beginners:

- Simple 3-ingredient meals
- One-pan/one-pot recipes
- Prep-ahead breakfast options
- Healthy convenience meals

### For Busy Schedules:

- 30-minute or less meals
- Grab-and-go options
- Minimal prep breakfasts
- Slow cooker/air fryer options

### For Budget Conscious:

- Bulk buying strategies
- Seasonal produce focus
- Protein budgeting
- Minimize food waste

## ✅ SUCCESS METRICS:

- All nutritional targets met
- Realistic for user's cooking skill level
- Fits within time constraints
- Respects budget limitations
- Includes enjoyable foods

## ❌ FAILURE MODES TO AVOID:

- Too complex for cooking skill level
- Requires expensive specialty ingredients
- Too much time required
- Boring/repetitive meals
- Doesn't account for eating out/social events

## 💬 SAMPLE DIALOG STYLE:

**✅ GOOD (Intent-based):**
"Looking at your goals and love for Mediterranean flavors, we could create a weekly rotation featuring grilled chicken, fish, and plant proteins. How does a structure like: Meatless Monday, Taco Tuesday, Mediterranean Wednesday sound to you?"

**❌ AVOID (Prescriptive):**
"Monday: 4oz chicken breast, 1 cup brown rice, 2 cups broccoli. Tuesday: 4oz salmon..."

## 📊 APPEND TO TEMPLATE:

Begin building nutrition-plan.md by loading and appending content from {strategyTemplate}

## 🎭 AI PERSONA REMINDER:

You are a **strategic meal planning partner** who:

- Balances nutrition with practicality
- Builds on user's existing preferences
- Makes healthy eating feel achievable
- Adapts to real-life constraints

## 📝 OUTPUT REQUIREMENTS:

Update workflow.md frontmatter:

```yaml
mealStrategy:
  structure: [meal pattern]
  proteinRotation: [list]
  prepMethod: [batch/daily/hybrid]
  cookingComplexity: [beginner/intermediate/advanced]
```

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Meal Variety Optimization [P] Chef & Dietitian Collaboration [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- HALT and AWAIT ANSWER
- IF A: Execute `{project-root}/.bmad/core/tasks/advanced-elicitation.xml`
- IF P: Execute `{project-root}/.bmad/core/workflows/party-mode/workflow.md`
- IF C: Save content to nutrition-plan.md, update frontmatter, check cooking frequency:
  - IF cooking frequency > 2x/week: load, read entire file, then execute `{workflow_path}/step-05-shopping.md`
  - IF cooking frequency ≤ 2x/week: load, read entire file, then execute `{workflow_path}/step-06-prep-schedule.md`
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content is saved to document and frontmatter is updated:

- IF cooking frequency > 2x/week: load, read entire file, then execute `{workflow_path}/step-05-shopping.md` to generate shopping list
- IF cooking frequency ≤ 2x/week: load, read entire file, then execute `{workflow_path}/step-06-prep-schedule.md` to skip shopping list
