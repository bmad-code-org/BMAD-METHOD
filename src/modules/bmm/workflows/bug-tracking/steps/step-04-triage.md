# Step 4: Triage Each Bug

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative triage between peers
- 📋 YOU ARE A FACILITATOR - ask clarifying questions when needed
- 🎯 This step performs the CORE TRIAGE analysis
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed varies widely
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Triage ONE bug at a time with user confirmation
- 💾 Track triage decisions for bugs.yaml update
- 📖 Ask clarifying questions when severity/complexity unclear
- 🚫 FORBIDDEN to auto-triage without user review

## CONTEXT BOUNDARIES:

- Parsed bugs from step-03 are in memory
- Reference bugs.yaml header for severity/complexity definitions
- Reference epics.md for story mapping
- Each bug gets full triage analysis

## YOUR TASK:

Perform collaborative triage analysis on each parsed bug, assessing severity, complexity, effort, workflow routing, and documentation impact.

## TRIAGE SEQUENCE (FOR EACH BUG):

### 1. Generate Bug ID

- Find highest existing bug-NNN from step-03 grep results
- Assign next sequential ID (e.g., bug-006)
- Format: `bug-` + zero-padded 3-digit number
- For features: `feature-` + zero-padded 3-digit number

### 2. Assess Severity

**Severity Levels:**
| Level | Criteria |
|-------|----------|
| critical | Prevents core functionality, crashes, data loss |
| high | Blocks major features, significantly degrades UX but has workaround |
| medium | Affects subset of users, minor impact |
| low | Cosmetic, edge case, minor inconvenience |

**Analysis Questions:**
- Does it prevent core functionality? → critical
- Does it cause crashes or data loss? → critical
- Does it block major features? → high
- Does it significantly degrade UX but have workaround? → high
- Does it affect subset of users with minor impact? → medium
- Is it cosmetic or edge case? → low

**If Unclear - ASK:**
"**Clarification needed for: {bug_title}**

I need more information to assess severity:
1. Does this bug prevent users from completing core flows?
2. Does the bug cause crashes or data loss?
3. How many users are affected? (all users, specific platform, edge case)
4. Is there a workaround available?

Please provide additional context."

### 3. Assess Complexity

**Complexity Levels:**
| Level | Criteria |
|-------|----------|
| trivial | One-line fix, obvious solution |
| small | Single file/component, solution clear |
| medium | Multiple files OR requires investigation |
| complex | Architectural change, affects many areas |

**If Unclear - ASK:**
"**Clarification needed for: {bug_title}**

To estimate complexity, I need:
1. Have you identified the root cause, or does it need investigation?
2. Which file(s) or component(s) are affected?
3. Is this isolated or does it affect multiple parts of the app?

Please provide technical details if available."

### 4. Determine Workflow Routing

**Routing Matrix:**
| Severity | Complexity | Workflow |
|----------|------------|----------|
| critical | any | correct-course |
| high | trivial | direct-fix |
| high | small | tech-spec |
| high | medium/complex | correct-course |
| medium | trivial | direct-fix |
| medium | small | tech-spec |
| medium | medium/complex | correct-course |
| low | trivial | direct-fix |
| low | small+ | backlog |

### 5. Map to Related Story/Epic

- If bug mentions story ID (e.g., "2-7"), use that
- Otherwise, infer from description using epic keywords
- Reference epics.md for story matching
- Format: `{epic_number}-{story_number}` or null

### 6. Determine Affected Platform

Extract from description:
- `all` - Default if not specified
- `ios` - iOS only
- `android` - Android only
- `web` - Web only

### 7. Assess Documentation Impact

**PRD Impact** (`doc_impact.prd: true/false`)
Set TRUE if issue:
- Conflicts with stated product goals
- Requires changing MVP scope
- Adds/removes/modifies core functionality
- Changes success metrics
- Affects multiple epics

**Architecture Impact** (`doc_impact.architecture: true/false`)
Set TRUE if issue:
- Requires new system components
- Changes data model (new tables, schema)
- Affects API contracts
- Introduces new dependencies
- Changes auth/security model

**UX Impact** (`doc_impact.ux: true/false`)
Set TRUE if issue:
- Adds new screens or navigation
- Changes existing user flows
- Requires new UI components
- Affects accessibility

**If any doc_impact is TRUE AND workflow != correct-course:**
- Override workflow to `correct-course`
- Add note: "Workflow elevated due to documentation impact"

### 8. Add Triage Notes

Document reasoning:
- Why this severity? (business impact, user impact)
- Why this complexity? (investigation needed, files affected)
- Why this workflow? (routing logic applied)
- Suggested next steps or investigation areas

### 9. Present Triage for Confirmation

"**Triage: {bug_id} - {bug_title}**

| Field | Value |
|-------|-------|
| Severity | {severity} |
| Complexity | {complexity} |
| Platform | {platform} |
| Workflow | {recommended_workflow} |
| Related | {related_story or 'None'} |

**Documentation Impact:**
- PRD: {yes/no}
- Architecture: {yes/no}
- UX: {yes/no}

**Triage Notes:**
{triage_notes}

[A] Accept triage
[M] Modify - adjust severity/complexity/workflow
[S] Skip - don't triage this item now
[N] Next bug (after accepting)"

### 10. Handle Modifications

If user selects [M]:
- Ask which field to modify
- Accept new value
- Re-present triage for confirmation

## SUCCESS METRICS:

✅ Each bug triaged with user confirmation
✅ Unclear items prompted for clarification
✅ Routing matrix applied correctly
✅ Documentation impact assessed
✅ Triage notes document reasoning

## FAILURE MODES:

❌ Auto-triaging without user review
❌ Not asking clarifying questions when needed
❌ Incorrect routing matrix application
❌ Missing documentation impact assessment
❌ Not documenting triage reasoning

❌ **CRITICAL**: Reading only partial step file
❌ **CRITICAL**: Proceeding without user confirmation per bug

## NEXT STEP:

After ALL bugs triaged (user selected [A] or [N] for each), load `./step-05-update.md` to update bugs.yaml and bugs.md.

Remember: Triage each bug individually with user confirmation!
