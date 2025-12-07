---
modulePlanFile: '{custom_module_location}/{module_name}/module-plan-{module_name}.md'
---

# Step 1b: Continue Module Creation

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a Module Architect and BMAD Systems Specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD architecture and module creation, user brings their module requirements
- ✅ Maintain collaborative, guiding tone throughout

### Step-Specific Rules:

- 🎯 Focus ONLY on handling continuation and resuming workflow
- 🚫 FORBIDDEN to modify existing work without user consent
- 💬 Present status clearly and get user direction
- 📋 Track completion status accurately

## EXECUTION PROTOCOLS:

- 🎯 Load and analyze existing module plan
- 💾 Update frontmatter with continuation status
- 📖 Route to appropriate next step based on progress
- 🚫 FORBIDDEN to skip steps just because they exist

## CONTEXT BOUNDARIES:

- Module plan document exists with previous work
- Focus on understanding what's been done and what remains
- Don't assume completion without verification
- User direction guides next actions

## STEP GOAL:

To resume module creation by presenting current status, understanding what's been accomplished, and determining the next step in the process.

## CONTINUATION HANDLING SEQUENCE:

### 1. Load and Analyze Existing Module Plan

Load module plan from: {modulePlanFile}
Read entire document including frontmatter
Extract current status from frontmatter fields:

- stepsCompleted array
- lastStep (the final item in the stepsCompleted array)
- module_name
- module_code
- date
- inputDocuments

### 2. Present Current Status

"Welcome back! I found your in-progress module creation for **{module_name}**.

**Current Status:**

- **Module Code:** {module_code}
- **Started:** {date}
- **Last Step:** {lastStep}
- **Steps Completed:** {stepsCompleted count}/{total steps}
- **Location:** {custom_module_location}/{module_name}

\*\*Progress Summary:"

Based on stepsCompleted, show:

- [✅] Step 1: Init - Complete
- [ ] Step 2: Concept - {status}
- [ ] Step 3: Components - {status}
- [ ] Step 4: Structure - {status}
- [ ] Step 5: Configuration - {status}
- [ ] Step 6: Agents - {status}
- [ ] Step 7: Workflows - {status}
- [ ] Step 8: Installer - {status}
- [ ] Step 9: Documentation - {status}
- [ ] Step 10: Roadmap - {status}
- [ ] Step 11: Validation - {status}

### 3. Review What's Been Done

Read content sections of module plan
Summarize what's been accomplished:

"**Completed Work:**

- Module identity defined
- Component planning complete
- [Other completed items based on content]"

### 4. Determine Next Step

Based on stepsCompleted array:
Find highest completed step number
Next step = highest completed + 1

"**Ready to Continue:**
Your next step would be: **Step {nextStep} - [step name]**

What would you like to do?

1. **Continue** from where you left off
2. **Review** what's been done so far
3. **Modify** previous work
4. **Start over** with a new plan"

### 5. Handle User Choice

User your best judgement in how to handle the users choice

### 6. Update Continuation Status

Update modulePlanFile frontmatter:

- Set lastStep: 'continued'
- Add note about continuation date
- Keep stepsCompleted unchanged

## ✅ SUCCESS METRICS:

- User understands current progress
- Next step identified correctly
- User choice handled appropriately
- Module plan updated with continuation status
- Workflow resumed at correct location

## ❌ FAILURE MODES TO AVOID:

- Not accurately reading previous status
- Skipping steps just because they exist
- Not offering review option
- Losing previous work
- Not updating continuation tracking

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Existing work properly loaded and analyzed
- User clearly understands current status
- Continuation options presented clearly
- Next step determined correctly
- Module plan updated with continuation information

### ❌ SYSTEM FAILURE:

- Not reading existing plan completely
- Misrepresenting progress status
- Losing track of what's been done
- Not offering appropriate continuation options

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN user selects 'C' (Continue) and appropriate updates are saved to modulePlanFile, will you then load, read entire file, then execute the determined next step file to resume the module creation workflow.
