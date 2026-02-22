---
name: 'step-03-build-vtcs'
description: 'Extract Value Trigger Chains from Trigger Map to identify which scenarios to create'

# File References
nextStepFile: './step-04-suggest-scenarios.md'
---

# Step 3: Build Value Trigger Chains

## STEP GOAL:

Extract Value Trigger Chains (VTCs) from the Trigger Map, assign pages to each VTC, prioritize them, and verify complete coverage of all pages.

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

- 🎯 Focus only on building VTCs, assigning pages, and prioritizing
- 🚫 FORBIDDEN to create scenario outlines — only identify and plan scenarios
- 💬 Approach: Systematically trace paths from business goals to user actions
- 📋 Every page from the inventory must be assigned to exactly one VTC

## EXECUTION PROTOCOLS:

- 🔗 Trace complete chains from Business Goal → Persona → Force → Transaction → Scenario
- 📋 Answer all 7 Decision Matrix questions for each VTC
- 📊 Assign pages ensuring no repetition and full coverage
- 🚫 FORBIDDEN to leave any page unassigned

## CONTEXT BOUNDARIES:

- Available context: Product Brief, Trigger Map, approved page inventory from Step 2
- Focus: VTC extraction, page assignment, prioritization
- Limits: No scenario outlining, no file creation — only planning
- Dependencies: Approved scope analysis from Step 2

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Build VTCs

**What is a Value Trigger Chain?**

A VTC traces the path from business strategy to user action:

```
Business Goal → Persona → Driving Force → Transaction → Scenario
```

**Example:**
```
BG01: Reduce info calls by 40%
  → Hasse (Primary - stressed tourist)
    → Fear: Being stranded with broken RV
      → Transaction: Confirm mechanic capability + get directions
        → 01: "Hasse's Emergency Search"
```

For **each business goal** from the Trigger Map:

1. Identify which persona(s) most directly drive this goal
2. Identify which driving forces (wants AND fears) connect to this goal
3. Determine the specific transaction/action that fulfills it
4. Name a candidate scenario using the persona's name

**For each VTC, answer the Decision Matrix (all 7 required):**

| # | Question | Answer |
|---|----------|--------|
| 1 | Which business goal? | [Specific goal from Trigger Map] |
| 2 | Which persona? | [Name + priority level] |
| 3 | Which driving force? | [Specific want or fear] |
| 4 | What's the transaction? | [Concrete action user takes] |
| 5 | Where does user come from? | [Natural starting point - be specific] |
| 6 | What value does user get? | [Tangible outcome] |
| 7 | What value does business get? | [Measurable result] |

### 2. Assign Pages to VTCs

For each VTC, list which pages from the inventory (Step 02) the user visits.

**Rules:**
- Each page appears in exactly ONE VTC/scenario (no repetition)
- If a page could fit multiple scenarios, assign it to the highest-priority one
- Shared elements (navigation, footer) are excluded from page assignment

### 3. Prioritize

Rank the VTCs:

**Priority 1 — Critical Path:**
- Top business goal + primary persona + core product value
- These scenarios are created first and in most detail

**Priority 2 — Supporting:**
- Secondary persona scenarios, alternative entry paths
- Important but not the strategic core

**Priority 3 — Edge Cases:**
- Admin tasks, rare user segments, error recovery
- May be deferred to later phases

### 4. Coverage Check

After building all VTCs, verify:

- [ ] Every page from inventory is assigned to exactly one VTC
- [ ] Primary persona has at least one Priority 1 scenario
- [ ] Top business goal is addressed by at least one scenario
- [ ] No page appears in multiple scenarios

**If pages are unassigned:** Create additional VTCs or expand existing ones to cover them.

### 5. Present VTC List

Present the complete VTC list:

```
## Value Trigger Chains

### Priority 1
**VTC-01:** [Business Goal] → [Persona] → [Force] → [Transaction]
- Scenario: 01-[slug]
- Pages: [list]

### Priority 2
**VTC-02:** [Business Goal] → [Persona] → [Force] → [Transaction]
- Scenario: 02-[slug]
- Pages: [list]

### Coverage: [X/Y] pages assigned
```

### 6. Present MENU OPTIONS

Display: "Are you ready to [C] Continue to Scenario Suggestions?"

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [VTC list with full page coverage presented], will you then load and read fully `{nextStepFile}` to execute and begin scenario suggestions.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All business goals traced through complete VTC chains
- All 7 Decision Matrix questions answered for each VTC
- Every page from inventory assigned to exactly one VTC
- VTCs prioritized with clear rationale
- Coverage check passes (all pages assigned, no duplicates)
- Complete VTC list presented to user
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Leaving pages unassigned
- Assigning pages to multiple VTCs
- Skipping Decision Matrix questions
- Creating scenario outlines during this step
- Not verifying coverage before proceeding

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
