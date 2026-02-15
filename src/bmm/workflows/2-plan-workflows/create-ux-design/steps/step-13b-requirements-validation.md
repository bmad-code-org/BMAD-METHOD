# Step 13b: Requirements Validation & Handoff Checklist

## MANDATORY EXECUTION RULES (READ FIRST):

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- 🎯 This step validates UX design completeness against PRD requirements
- 📋 YOU ARE A VALIDATION FACILITATOR for this step

## EXECUTION PROTOCOLS:

- 🎯 Load PRD and validate requirements coverage
- 🎯 Load Architecture document and check constraint alignment
- ⚠️ Present findings with A/P/C menu
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step to stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Complete UX design specification from all previous steps is available
- PRD (if loaded at init) contains FRs/NFRs that UX must address
- Architecture (if loaded at init) contains technical constraints
- Focus on validating coverage and creating handoff artifacts

## YOUR TASK:

Validate that the UX design addresses PRD requirements, respects architecture constraints, and prepare handoff artifacts for downstream workflows (Architecture, Epics & Stories).

## VALIDATION & HANDOFF SEQUENCE:

### 1. Requirements Coverage Validation

If PRD was loaded during initialization:

**Extract PRD Functional Requirements:**
- Load the PRD and find all FRs
- For each FR, determine if the UX design addresses it

**Create Coverage Matrix:**
- Map each FR to UX design elements (user journeys, components, patterns)
- Identify FRs NOT addressed by UX design
- For unaddressed FRs, determine if they are:
  - Non-UI FRs (backend-only, no UX needed) → Mark as N/A
  - Missing from UX design → Flag as GAP

**Present to user:**
"I've validated your UX design against the PRD requirements:

**FR Coverage:**

| FR | Description | UX Element | Status |
|----|-------------|-----------|--------|
| FR1 | [desc] | [journey/component/pattern] | ✅ Covered |
| FR5 | [desc] | - | ⚠️ Gap (UI feature) |
| FR8 | [desc] | N/A | ➖ Backend only |

**Coverage: [X]% of UI-relevant FRs addressed**
**Gaps found: [count]**"

If PRD was NOT loaded:
- Note that requirements validation could not be performed
- Recommend running this check later when PRD is available

### 2. Architecture Constraint Alignment

If Architecture document was loaded:

**Check for conflicts:**
- API constraints vs. UX interaction patterns (e.g., real-time updates vs. REST-only API)
- Platform constraints vs. responsive strategy
- Performance budgets vs. animation/interaction complexity
- Data model constraints vs. information architecture

**Present any conflicts found:**
- Conflict description
- UX design assumption
- Architecture constraint
- Suggested resolution

If Architecture was NOT loaded:
- Note that constraint validation could not be performed

### 3. Downstream Handoff Checklist

Create handoff information for downstream workflows:

**For Architecture Workflow (Winston):**
- [ ] UX interaction patterns that require specific API design
- [ ] Real-time requirements identified in UX (WebSocket, SSE, polling)
- [ ] Data requirements from form designs and user flows
- [ ] Performance requirements from animation/interaction specs

**For Epics & Stories Workflow (John):**
- [ ] User journey → FR mapping (which journeys implement which FRs)
- [ ] Component complexity estimates (simple, moderate, complex)
- [ ] Design dependencies between components
- [ ] Phasing recommendations (what can be MVP vs. later)

**Design Decision Rationale:**
- Key design decisions and WHY they were made
- Alternatives considered and rejected (with reasons)
- Assumptions made during design

### 4. Generate Validation & Handoff Content

Append to the document:

```markdown
## Requirements Validation

### FR Coverage Matrix

[Table mapping FRs to UX elements]

### Architecture Constraint Alignment

[Any conflicts found and resolutions, or "No architecture document loaded"]

## Downstream Handoff

### Architecture Handoff

[UX constraints and requirements for architecture decisions]

### Epics & Stories Handoff

[User journey → FR mapping, complexity estimates, phasing recommendations]

### Design Decision Rationale

[Key decisions with reasoning for downstream teams]
```

### 5. Present MENU OPTIONS

Present the validation findings and handoff checklist, then display menu:
- Show coverage matrix highlights
- Show any architecture conflicts
- Show handoff readiness

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Complete Workflow (Step 14)"

#### Menu Handling Logic:
- IF A: Read fully and follow Advanced Elicitation, process, ask acceptance, update or keep, redisplay
- IF P: Read fully and follow Party Mode, process, ask acceptance, update or keep, redisplay
- IF C: Append to output document, update frontmatter, then read fully and follow: `./step-14-complete.md`
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document.

## SUCCESS METRICS:

✅ PRD FR coverage validated (if PRD available)
✅ Architecture constraints checked (if architecture available)
✅ FR → UX element mapping created
✅ Gaps identified with clear categorization
✅ Handoff checklist prepared for Architecture and Epics workflows
✅ Design decision rationale documented
✅ A/P/C menu presented and handled correctly

## FAILURE MODES:

❌ Not loading PRD for validation when it was discovered at init
❌ Claiming full coverage without systematic check
❌ Not creating handoff artifacts for downstream workflows
❌ Not documenting design decision rationale
❌ Marking non-UI FRs as gaps (they should be N/A)

## NEXT STEP:

After user selects 'C' and content is saved, load `./step-14-complete.md` to complete the workflow.

Remember: Do NOT proceed to step-14 until user explicitly selects 'C'!
