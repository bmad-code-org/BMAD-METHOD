---
# File references (ONLY variables used in this step)
nextStepFile: './step-v-07-implementation-leakage-validation.md'
prdFile: '{prd_file_path}'
validationReportPath: '{validation_report_path}'
---

# Step 6: Traceability Validation

## STEP GOAL:

Validate the traceability chain from Executive Summary → Success Criteria → User Journeys → Functional Requirements is intact, ensuring every requirement traces back to a user need or business objective.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Validation Architect and Quality Assurance Specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in systematic validation, not collaborative dialogue
- ✅ You bring analytical rigor and traceability matrix expertise
- ✅ This step runs autonomously - no user input needed

### Step-Specific Rules:

- 🎯 Focus ONLY on traceability chain validation
- 🚫 FORBIDDEN to validate other aspects in this step
- 💬 Approach: Systematic chain validation and orphan detection
- 🚪 This is a validation sequence step - auto-proceeds when complete

## EXECUTION PROTOCOLS:

- 🎯 Build and validate traceability matrix
- 💾 Identify broken chains and orphan requirements
- 📖 Append findings to validation report
- 📖 Display "Proceeding to next check..." and load next step
- 🚫 FORBIDDEN to pause or request user input

## CONTEXT BOUNDARIES:

- Available context: PRD file, validation report
- Focus: Traceability chain validation only
- Limits: Don't validate other aspects, don't pause for user input
- Dependencies: Steps 2-5 completed - initial validations done

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Attempt Sub-Process Validation

**Try to use Task tool to spawn a subprocess:**

"Perform traceability validation on this PRD:

1. Extract content from Executive Summary (vision, goals)
2. Extract Success Criteria
3. Extract User Journeys (user types, flows, outcomes)
4. Extract Functional Requirements (FRs)
5. Extract Product Scope (in-scope items)

**Validate chains:**
- Executive Summary → Success Criteria: Does vision align with defined success?
- Success Criteria → User Journeys: Are success criteria supported by user journeys?
- User Journeys → Functional Requirements: Does each FR trace back to a user journey?
- Scope → FRs: Do MVP scope FRs align with in-scope items?

**Identify orphans:**
- FRs not traceable to any user journey or business objective
- Success criteria not supported by user journeys
- User journeys without supporting FRs

Build traceability matrix and identify broken chains and orphan FRs.

Return structured findings with chain status and orphan list."

### 2. Graceful Degradation (if Task tool unavailable)

If Task tool unavailable, perform analysis directly:

**Step 1: Extract key elements**
- Executive Summary: Note vision, goals, objectives
- Success Criteria: List all criteria
- User Journeys: List user types and their flows
- Functional Requirements: List all FRs
- Product Scope: List in-scope items

**Step 2: Validate Executive Summary → Success Criteria**
- Does Executive Summary mention the success dimensions?
- Are Success Criteria aligned with vision?
- Note any misalignment

**Step 3: Validate Success Criteria → User Journeys**
- For each success criterion, is there a user journey that achieves it?
- Note success criteria without supporting journeys

**Step 4: Validate User Journeys → FRs**
- For each user journey/flow, are there FRs that enable it?
- List FRs with no clear user journey origin
- Note orphan FRs (requirements without traceable source)

**Step 5: Validate Scope → FR Alignment**
- Does MVP scope align with essential FRs?
- Are in-scope items supported by FRs?
- Note misalignments

**Step 6: Build traceability matrix**
- Map each FR to its source (journey or business objective)
- Note orphan FRs
- Identify broken chains

### 3. Tally Traceability Issues

**Broken chains:**
- Executive Summary → Success Criteria gaps: count
- Success Criteria → User Journeys gaps: count
- User Journeys → FRs gaps: count
- Scope → FR misalignments: count

**Orphan elements:**
- Orphan FRs (no traceable source): count
- Unsupported success criteria: count
- User journeys without FRs: count

**Total issues:** Sum of all broken chains and orphans

### 4. Report Traceability Findings to Validation Report

Append to validation report:

```markdown
## Traceability Validation

### Chain Validation

**Executive Summary → Success Criteria:** [Intact/Gaps Identified]
{If gaps: List specific misalignments}

**Success Criteria → User Journeys:** [Intact/Gaps Identified]
{If gaps: List unsupported success criteria}

**User Journeys → Functional Requirements:** [Intact/Gaps Identified]
{If gaps: List journeys without supporting FRs}

**Scope → FR Alignment:** [Intact/Misaligned]
{If misaligned: List specific issues}

### Orphan Elements

**Orphan Functional Requirements:** {count}
{List orphan FRs with numbers}

**Unsupported Success Criteria:** {count}
{List unsupported criteria}

**User Journeys Without FRs:** {count}
{List journeys without FRs}

### Traceability Matrix

{Summary table showing traceability coverage}

**Total Traceability Issues:** {total}

**Severity:** [Critical if orphan FRs exist, Warning if gaps, Pass if intact]

**Recommendation:**
[If Critical] "Orphan requirements exist - every FR must trace back to a user need or business objective."
[If Warning] "Traceability gaps identified - strengthen chains to ensure all requirements are justified."
[If Pass] "Traceability chain is intact - all requirements trace to user needs or business objectives."
```

### 5. Display Progress and Auto-Proceed

Display: "**Traceability Validation Complete**

Total Issues: {count} ({severity})

**Proceeding to next validation check...**"

Without delay, read fully and follow: {nextStepFile} (step-v-07-implementation-leakage-validation.md)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All traceability chains validated systematically
- Orphan FRs identified with numbers
- Broken chains documented
- Traceability matrix built
- Severity assessed correctly
- Findings reported to validation report
- Auto-proceeds to next validation step
- Subprocess attempted with graceful degradation

### ❌ SYSTEM FAILURE:

- Not validating all traceability chains
- Missing orphan FR detection
- Not building traceability matrix
- Not reporting findings to validation report
- Not auto-proceeding

**Master Rule:** Every requirement should trace to a user need or business objective. Orphan FRs indicate broken traceability that must be fixed.
