---
name: step-05-outline-scenario
description: Create detailed outline for ONE scenario, repeating for each in the approved plan

# File References
nextStepFile: './step-06-generate-overview.md'

# Data References
scenarioTemplate: '../data/scenario-outline-template.md'
---

# Step 5: Outline Scenario (One at a Time)

## STEP GOAL:

Create a detailed outline for ONE scenario using all 7 required components, verify against quality gates, create the output file, then loop for each remaining scenario in the approved plan.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a UX Scenario Architect collaborating with the project owner
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring scenario thinking and user journey expertise, user brings their project knowledge, together we create concrete UX scenario outlines
- ✅ Maintain collaborative equal-partner tone throughout

### Step-Specific Rules:

- 🎯 Focus on ONE scenario at a time, complete it fully before moving to the next
- 🚫 FORBIDDEN to skip any of the 7 required components
- 💬 Approach: Collaborate with user on each scenario, using the template as structure
- 📋 Verify all quality gates before proceeding to the next scenario or step

## EXECUTION PROTOCOLS:

- 📖 Load the scenario outline template before starting
- 📋 Ensure all 7 components are present and high quality
- ✅ Run quality gates check before moving on
- 💾 Create output file in the correct folder structure
- 🔄 Loop back for each remaining scenario
- 🚫 FORBIDDEN to proceed if any quality gate fails

## CONTEXT BOUNDARIES:

- Available context: Approved scenario plan from Step 4, VTCs, page inventory, Trigger Map
- Focus: Detailed outlining of one scenario at a time
- Limits: Only outline scenarios from the approved plan
- Dependencies: User-approved scenario plan from Step 4

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Determine Which Scenario

Process scenarios in priority order (Priority 1 first, then 2, then 3).

If this is your first time at this step, start with scenario 01.
If returning from a loop, continue with the next unfinished scenario.

### 2. Load Template

Load the full template: `{scenarioTemplate}`

### 3. Create Outline with 7 Required Components

Every scenario outline MUST have all 7 components:

#### Component 1: Scenario Name & ID

- **Name:** Uses persona name + purpose (e.g., "Hasse's Emergency Search")
- **ID:** 01, 02, etc.
- **Slug:** `01-hasses-emergency-search`

#### Component 2: Core Feature

What this scenario covers, stated as user purpose (not feature name).

- **Bad:** "Homepage and service pages"
- **Good:** "Verify service availability before booking"

Must align with a specific business goal from the Trigger Map.

#### Component 3: Entry Point (Realistic)

How the user ACTUALLY arrives. Be specific about:
- **Device:** Mobile, desktop, tablet
- **Context:** Where they are, what they are doing
- **Discovery:** How they found the site (Google search, link, ad, bookmark)

- **Bad:** "User opens app"
- **Good:** "Googles 'car repair Oland' on mobile while parked at gas station, clicks top organic result"

#### Component 4: Mental State (Trigger / Hope / Worry)

Three components, all required, all specific:

- **Trigger:** What just happened that brought them here NOW
- **Hope:** What they are hoping to find or achieve
- **Worry:** What they are afraid of or want to avoid

- **Bad:** "User is interested in the product"
- **Good:** "Trigger: Motorhome broke down in Byxelkrok, family vacation at risk. Hope: Find trustworthy mechanic nearby, get back on road today. Worry: Being stranded for days, getting ripped off by unknown mechanic"

#### Component 5: Success Goals (Mutual Value)

Both required, both specific and measurable:

- **User Success:** Tangible outcome the user achieves
- **Business Success:** Measurable result for the business

- **Bad:** User: "Successfully use the site" / Business: "Get more customers"
- **Good:** User: "Confirmed mechanic fixes motorhomes, has location and hours, feels confident calling" / Business: "High-intent tourist call captured, positioned as emergency-capable, info call avoided"

#### Component 6: Shortest Path (Linear Sunshine Path)

Numbered steps. Each step has page name + what user accomplishes there.

**Rules:**
- Completely linear — ZERO "if" statements, ZERO branches
- Minimum viable steps — can you remove any step without breaking the flow?
- Each step moves meaningfully toward success
- This is the happiest path when everything works perfectly

**Format:**
```
1. **[Page Name]** — [What user sees/does/achieves here]
2. **[Page Name]** — [What user sees/does/achieves here]
3. **[Page Name]** — [What user sees/does/achieves here] ✓
```

#### Component 7: Trigger Map Connections

Explicitly link to Trigger Map data:
- **Persona:** [Name] ([Priority level])
- **Driving Forces Addressed:**
  - Positive: [specific want from Trigger Map]
  - Negative: [specific fear from Trigger Map]
- **Business Goal:** [specific goal + objective number]

### 4. Quality Gates (Check Before Moving On)

Before proceeding to the next scenario, verify:

- [ ] Mental state is visceral and specific (not generic "interested")
- [ ] Entry point is realistic with device + context + discovery method
- [ ] Path is truly linear (zero "if" statements)
- [ ] Both successes are specific and measurable (not vague)
- [ ] Scenario name includes persona name
- [ ] All 7 components present

**If any gate fails:** Fix before proceeding.

### 5. Create the File

1. Create folder: `{output_folder}/C-UX-Scenarios/[NN-slug]/`
2. Create file: `{output_folder}/C-UX-Scenarios/[NN-slug]/[NN-slug].md`
3. Use the template from data/ to structure the content

### 6. Loop Check

**Are there more scenarios in the approved plan?**

- **Yes** → Loop back to instruction 1 for the next scenario
- **No** → Proceed to menu options

### 7. Present MENU OPTIONS

Display: "Are you ready to [C] Continue to Generating the Overview?"

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [all scenarios from approved plan are outlined and pass quality gates], will you then load and read fully `{nextStepFile}` to execute and begin generating the overview.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Each scenario has all 7 required components
- All quality gates pass for every scenario
- Output files created in correct folder structure
- Scenarios processed in priority order
- All scenarios from approved plan completed before proceeding
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Missing any of the 7 required components
- Proceeding with failing quality gates
- Skipping scenarios from the approved plan
- Using generic mental states or vague success goals
- Creating branching paths instead of linear sunshine paths
- Not creating output files

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
