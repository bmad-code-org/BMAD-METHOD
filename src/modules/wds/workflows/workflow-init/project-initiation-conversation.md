# Project Initiation - Micro Steps for Saga WDS Analyst Agent

**Agent**: Saga WDS Analyst Agent  
**When**: During Phase 1 (Product Brief creation) - AFTER completing the brief document  
**Purpose**: Capture user's intentions for each project phase  
**Output**: `.wds-project-outline.yaml` file

---

## Overview

After completing the Product Brief, capture the user's intentions for each WDS phase through individual, focused questions. Each phase gets its own micro-step conversation.

**Important**:

- WDS v6 methodology is default (numbered folders: 1-8)
- WPS2C v4 is auto-detected only for existing projects
- Trust yourself to have natural conversations
- Complete ALL micro-steps sequentially

---

## MICRO-STEP 0: Explain What's Next

**Goal**: Let user know you'll ask about their intentions for different project phases.

**Outcome to capture**: User understands and is ready to continue.

**What NOT to do**:

- Don't ask about methodology (v6 is default)
- Don't show long lists of options
- Keep it brief and warm

---

## MICRO-STEP 1: Phase 2 - Trigger Mapping

**Goal**: Determine if user needs Trigger Mapping phase.

**Context for agent**:

- Critical for customer-facing products
- Can be skipped for: internal tools, technical products, known users

**Questions to understand**:

- Is this customer-facing or internal?
- Do you already know your target users?
- Do you need help defining personas?

**Outcome to capture**:

```yaml
phase_2_trigger_mapping:
  active: true/false
  intent: "[User's exact words about this phase]"
  skip_reason: '[If skipping, capture why]'
```

**Examples of user answers**:

- "This is an internal tool, we know our users" → active: false
- "Yes, I need help understanding my customers" → active: true
- "I have personas already, just need to document them" → active: true

---

## MICRO-STEP 2: Phase 3 - PRD Platform (Technical Foundation)

**Goal**: Understand user's technical foundation needs.

**Context for agent**:

- Defines architecture, data model, infrastructure
- Idunn WDS PM Agent handles this phase
- Can be minimal or comprehensive

**Questions to understand**:

- Do you have a tech stack already?
- Need help defining architecture?
- Already defined elsewhere?

**Outcome to capture**:

```yaml
phase_3_prd_platform:
  active: true/false
  intent: "[User's exact words about their tech approach]"
```

**Examples of user answers**:

- "Using Next.js and Supabase, just need to document" → active: true, intent captured
- "Not technical, just need design specs" → active: false
- "Need help choosing tech stack" → active: true, intent captured

---

## MICRO-STEP 3: Phase 4 - UX Design (Scenarios)

**Goal**: Understand scope of design work needed.

**Context for agent**:

- This is Freyja WDS Designer Agent's domain
- Core phase - defines what gets built
- User scenarios = user flows/journeys

**Questions to understand**:

- How many user flows/scenarios do you envision?
- Just landing pages or full application?
- What level of detail needed?

**Outcome to capture**:

```yaml
phase_4_ux_design:
  active: true # Almost always true
  intent: "[User's exact words about design scope]"
  scenarios_planned: [number if mentioned]
```

**Examples of user answers**:

- "Just 2-3 landing pages to hand off to developers" → scenarios_planned: 3
- "Full app with 5-6 major user flows" → scenarios_planned: 6
- "MVP with core onboarding and main feature" → scenarios_planned: 2

---

## MICRO-STEP 4: Phase 5 - Design System

**Goal**: Determine if design system work is needed.

**Context for agent**:

- Often skipped for simple projects
- Often skipped when using component libraries
- Needed for multi-product consistency

**Questions to understand**:

- Using a component library? (shadcn/ui, MUI, Radix, etc.)
- Building custom components?
- Need multi-product design system?

**Outcome to capture**:

**If using library**:

```yaml
phase_5_design_system:
  active: false
  skip_reason: 'Using [library name]'
  intent: '[User mentioned which library]'
```

**If building custom**:

```yaml
phase_5_design_system:
  active: true
  intent: "[User's plans for custom components]"
```

**Examples of user answers**:

- "Using Tailwind and shadcn/ui" → active: false, skip_reason captured
- "Need to create our own component library" → active: true
- "Skip for now, MVP first" → active: false, skip_reason: "MVP focus"

---

## MICRO-STEP 5: Phase 6 - Design Deliveries

**Goal**: Understand handoff/documentation needs.

**Context for agent**:

- Idunn WDS PM Agent handles this
- Packages design for handoff
- Creates PRD, epics, stories

**Questions to understand**:

- Handing off to developers?
- Implementing yourself?
- Need organized backlog?

**Outcome to capture**:

```yaml
phase_6_design_deliveries:
  active: true/false
  intent: "[User's handoff situation]"
```

**Examples of user answers**:

- "Yes, handing off to dev team" → active: true
- "I'm building it myself from specs" → active: false
- "Need backlog for planning" → active: true

---

## MICRO-STEP 6: Phase 7 - Testing

**Goal**: Determine testing/validation approach.

**Context for agent**:

- Freyja WDS Designer Agent helps validate implementation
- Compares built vs designed
- Can be handled separately

**Questions to understand**:

- Want design validation after implementation?
- Handling testing separately?
- QA team handling it?

**Outcome to capture**:

```yaml
phase_7_testing:
  active: true/false
  intent: "[User's testing approach]"
```

**Examples of user answers**:

- "Dev team will test" → active: false
- "Yes, want to validate against specs" → active: true
- "Will test during development" → active: false

---

## MICRO-STEP 7: Phase 8 - Ongoing Development

**Goal**: Determine if this is new or existing product.

**Context for agent**:

- Only for existing products needing improvements
- Skip for all new projects

**Questions to understand**:

- Is this a new product or existing product?

**Outcome to capture**:

**For new products** (most common):

```yaml
phase_8_ongoing_development:
  active: false
  skip_reason: 'New product - not yet launched'
```

**For existing products**:

```yaml
phase_8_ongoing_development:
  active: true
  intent: '[What improvements needed]'
```

---

## MICRO-STEP 8: Summarize Active Phases

**Goal**: Show user which phases are active based on their answers.

**What to show**:

- List active phases with their intentions
- List skipped phases with reasons
- Ask: "Does this look correct?"

**Outcome**: User confirms or requests changes.

**If user wants changes**: Go back and adjust specific phases.

---

## MICRO-STEP 9: Create Project Outline File

**Goal**: Write `.wds-project-outline.yaml` to `docs/` folder.

**File location**: `docs/.wds-project-outline.yaml`

**Use template**: `src/modules/wds/workflows/workflow-init/project-outline.template.yaml`

**Populate with**:

- `methodology.type: "wds-v6"` (always v6 for new projects)
- User intentions for each phase (from micro-steps 1-7)
- Active/inactive flags
- Skip reasons
- Current date and timestamps
- Initial status: phase_1 = "in_progress", others = "not_started"

**After creating file**:

- Confirm to user: "Project outline created"
- Explain: "Other agents will read this to understand your goals"

---

## MICRO-STEP 10: Update Phase 1 Status

**Goal**: Mark Product Brief phase as complete in the outline.

**Update in outline**:

```yaml
phase_1_product_brief:
  status: 'complete'
  completed_date: "[today's date]"
  completed_by: 'Saga WDS Analyst Agent'
  artifacts:
    - 'docs/1-project-brief/00-product-brief.md'
```

**Add to update history**:

```yaml
update_history:
  - date: '[today]'
    agent: 'saga-analyst'
    action: 'completed'
    phase: 'phase_1_project_brief'
    changes: 'Completed Product Brief and created project outline'
```

---

## Critical Requirements

**YOU MUST**:
✅ Complete ALL 10 micro-steps in order  
✅ Capture user's exact words in `intent` fields  
✅ Ask one focused question per micro-step  
✅ Wait for user's answer before proceeding  
✅ Create the `.wds-project-outline.yaml` file  
✅ Update the file after creating it

**YOU MUST NOT**:
❌ Skip any micro-steps  
❌ Ask about multiple phases at once  
❌ Assume user's intentions  
❌ Ask about methodology (v6 is default)  
❌ Make the conversation feel like a form/survey

---

## Example Flow: Landing Page Project

**Micro-step 1 result**:

```yaml
phase_2_trigger_mapping:
  active: false
  skip_reason: 'Internal marketing pages, target audience already known'
```

**Micro-step 3 result**:

```yaml
phase_4_ux_design:
  active: true
  intent: 'Create 2-3 landing pages with full specifications for developer handoff'
  scenarios_planned: 3
```

**Micro-step 4 result**:

```yaml
phase_5_design_system:
  active: false
  skip_reason: 'Using Tailwind CSS and shadcn/ui component library'
```

**Micro-step 5 result**:

```yaml
phase_6_design_deliveries:
  active: true
  intent: 'Package landing page specifications as handoff for development team'
```

**Result**: Clean, focused project with only needed phases active.

---

## Agent Behavior Notes

**Remember**:

- You're having a conversation, not filling out a form
- Listen to user's actual needs
- User's words matter - capture them exactly
- It's OK if user wants to skip phases
- It's OK if user has unusual combinations
- Trust your judgment on follow-up questions

**Total time**: 5-10 minutes  
**Value created**: Guides entire project + saves hours of agent confusion

---

**Created**: 2024-12-10  
**Agent**: Saga WDS Analyst Agent  
**Part of**: WDS v6 Project Initiation

---

## Step 3: Walk Through Each Phase

### Phase 1: Product Brief (Current Phase)

**Saga says:**

```
✅ Phase 1: Product Brief - We're here right now!

This phase defines your project vision, goals, and constraints.
Status: In Progress
```

**Capture:**

```yaml
phase_1_project_brief:
  active: true
  status: 'in_progress'
  intent: |
    [From Product Brief conversation]
```

---

### Phase 2: Trigger Mapping

**Saga asks:**

```
Phase 2: Trigger Mapping

This phase helps us identify:
- Target user groups
- User personas
- Business goals
- User triggers and pain points

This is critical for customer-facing products but can be skipped for:
- Internal tools
- Technical products with no end users
- Projects where you already know your users well

What are your intentions for Trigger Mapping?

Options:
1. Include it - I need help understanding my users
2. Include it - I want to document user personas
3. Skip it - This is an internal tool
4. Skip it - I already know my users
5. Something else (tell me)
```

**Based on answer, capture:**

**If including:**

```yaml
phase_2_trigger_mapping:
  active: true
  intent: |
    [User's exact answer about their intentions]
```

**If skipping:**

```yaml
phase_2_trigger_mapping:
  active: false
  skip_reason: 'Internal tool - no external users'
  intent: |
    [User's reason for skipping]
```

---

### Phase 3: PRD Platform (Technical Foundation)

**Saga asks:**

```
Phase 3: PRD Platform (Technical Foundation)

This phase defines:
- Technical architecture
- Data model
- Platform requirements
- Infrastructure needs
- Integration specifications

Idunn (WDS PM Agent) handles this phase.

What are your intentions for the technical foundation?

Options:
1. Need help defining everything from scratch
2. I have a tech stack in mind, need to document it
3. Already defined elsewhere (can skip or link to it)
4. Something else (tell me)
```

**Capture:**

```yaml
phase_3_prd_platform:
  active: true # or false
  intent: |
    [User's answer about tech approach]
```

---

### Phase 4: UX Design (Scenarios)

**Saga asks:**

```
Phase 4: UX Design (Scenarios)

This is where Freyja (WDS Designer Agent) creates:
- User scenario specifications
- Page designs with object IDs
- Interactive prototypes
- User flow diagrams

This is the core design work that defines what gets built.

What are your intentions for UX Design?

Questions:
1. How many scenarios or user flows do you envision?
   - MVP-focused (2-3 core scenarios)?
   - Comprehensive (5+ scenarios)?
   - Just landing pages?

2. What level of detail do you need?
   - Full specifications with object IDs for developers
   - Quick prototypes to test concepts
   - Something in between

Tell me about your vision here.
```

**Capture:**

```yaml
phase_4_ux_design:
  active: true
  intent: |
    [User's exact answer - e.g., "Just 2-3 landing pages 
    with full specs to hand off to developers"]
  scenarios_planned: [number from conversation]
```

---

### Phase 5: Design System

**Saga asks:**

```
Phase 5: Design System

This phase extracts and documents reusable components.
Freyja (WDS Designer Agent) handles this.

What are your intentions for a Design System?

Options:
1. Using an existing component library (shadcn/ui, MUI, Radix, etc.)
   → We can skip this phase

2. Building custom components
   → Include this phase

3. Creating a multi-product design system
   → Include this phase

4. Skipping for MVP/simple project
   → We can skip this phase

What's your approach?
```

**Based on answer:**

**If using library:**

```yaml
phase_5_design_system:
  active: false
  skip_reason: 'Using shadcn/ui component library'
  intent: |
    [User mentioned which library]
```

**If building custom:**

```yaml
phase_5_design_system:
  active: true
  intent: |
    [User's plans for custom design system]
```

---

### Phase 6: Design Deliveries

**Saga asks:**

```
Phase 6: Design Deliveries

This phase packages your design work for handoff.
Idunn (WDS PM Agent) creates:
- Complete PRD
- Implementation roadmap
- Epic and story breakdowns
- Handoff package

What are your intentions for design deliveries?

Options:
1. Handing off to a development team
   → Include this phase for proper handoff package

2. Implementing directly from specifications
   → Can skip if you're building it yourself

3. Need organized backlog for planning
   → Include this phase

What's your situation?
```

**Capture:**

```yaml
phase_6_design_deliveries:
  active: true # or false
  intent: |
    [User's answer about handoff needs]
```

---

### Phase 7: Testing

**Saga asks:**

```
Phase 7: Testing

This phase validates implementation against design specs.
Freyja (WDS Designer Agent) helps compare what's built vs. what was designed.

What are your intentions for testing?

Options:
1. Want design validation after implementation
2. Handling testing separately
3. Will test during development
4. Skip for now, maybe later

What's your preference?
```

**Capture:**

```yaml
phase_7_testing:
  active: true # or false
  intent: |
    [User's testing approach]
```

---

### Phase 8: Ongoing Development

**Saga asks:**

```
Phase 8: Ongoing Development

This phase is for existing products needing improvements.

Is this:
1. A new product (not started yet)
   → Skip this phase

2. An existing product needing enhancements
   → Include this phase

Which applies to your project?
```

**Capture:**

```yaml
phase_8_ongoing_development:
  active: false # Usually false for new projects
  skip_reason: 'New product - not yet in maintenance phase'
  intent: |
    [User's answer]
```

---

## Step 4: Summarize & Confirm

**Saga says:**

```
Perfect! Let me summarize your project plan:

📋 Project: [Project Name]
🔧 Methodology: WDS v6 (numbered phases)

Active Phases:
✅ Phase 1: Product Brief (In Progress)
   Intent: [brief summary]

✅ Phase 4: UX Design (Scenarios)
   Intent: "Create 2-3 landing pages with full specs"
   Estimated scenarios: 3

✅ Phase 6: Design Deliveries
   Intent: "Package for handoff to development team"

Skipped Phases:
⏭️ Phase 2: Trigger Mapping
   Reason: "Internal tool - users already known"

⏭️ Phase 5: Design System
   Reason: "Using shadcn/ui component library"

⏭️ Phase 7: Testing
   Reason: "Development team will handle testing"

⏭️ Phase 8: Ongoing Development
   Reason: "New product"

Does this look correct? Any changes?
```

---

## Step 5: Create Project Outline File

**After user confirms**, Saga creates:
`docs/.wds-project-outline.yaml`

**Populated with:**

- Methodology type
- User intentions for each phase
- Active/inactive flags
- Skip reasons
- Initial status tracking

**Saga says:**

```
✅ Project outline created!

This file will help all WDS agents understand your project instantly.
When you activate Freyja (Designer) or Idunn (PM), they'll read this
and know exactly what you're trying to accomplish.

Let's continue with your Product Brief...
```

---

## Example: Landing Page Project

**User Journey:**

1. **Methodology**: "WDS v6"
2. **Trigger Mapping**: "Skip - internal tool"
3. **Platform**: "Already defined, just need to document"
4. **UX Design**: "Just 2-3 landing pages to hand off"
5. **Design System**: "Using Tailwind + shadcn/ui"
6. **Deliveries**: "Yes, need handoff package for devs"
7. **Testing**: "Skip - devs will test"
8. **Ongoing**: "Skip - new project"

**Result Outline:**

```yaml
methodology:
  type: 'wds-v6'

phases:
  phase_1_project_brief:
    active: true
    status: 'in_progress'

  phase_2_trigger_mapping:
    active: false
    skip_reason: 'Internal tool - no external users'

  phase_3_prd_platform:
    active: true
    intent: 'Document existing tech stack (Next.js, Tailwind)'

  phase_4_ux_design:
    active: true
    intent: 'Create 2-3 landing pages with full specs for developer handoff'
    scenarios_planned: 3

  phase_5_design_system:
    active: false
    skip_reason: 'Using Tailwind CSS + shadcn/ui component library'

  phase_6_design_deliveries:
    active: true
    intent: 'Package landing page specs as handoff for development team'

  phase_7_testing:
    active: false
    skip_reason: 'Development team will handle QA testing'

  phase_8_ongoing_development:
    active: false
    skip_reason: 'New project - not yet launched'
```

---

## Benefits of This Workflow

✅ **User-driven**: Every decision is user's choice  
✅ **Clear context**: Agents know WHY phases are skipped  
✅ **Flexible**: Works for any project type  
✅ **Fast future activation**: Agents read outline in <5s  
✅ **Project memory**: Decisions preserved forever  
✅ **Better recommendations**: Agents suggest relevant next steps

---

## When to Run This Workflow

**Always run during**:

- Phase 1: Product Brief creation
- After completing the brief document
- Before moving to Phase 2

**Takes**:

- 5-10 minutes
- One conversation with user
- Creates lasting value for entire project

---

**Created**: 2024-12-10  
**Agent**: Saga WDS Analyst Agent  
**Part of**: WDS v6 Project Initiation
