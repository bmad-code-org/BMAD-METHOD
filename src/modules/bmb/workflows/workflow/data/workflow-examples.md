# Novel Workflow Examples

**Purpose:** Illustrative examples of workflows across diverse domains to demonstrate the range of what users can create.

---

## Understanding Workflow Structure

**Each arrow (→) in the "Flow" column represents a potential step file.**

```
Flow: Discovery → Assessment → Strategy → Shopping List → Prep Schedule
       ↓           ↓           ↓           ↓              ↓
       step-01-   step-02-   step-03-    step-04-      step-05-
    discovery  assessment  strategy  shopping-list  prep-schedule
```

**Each step file contains internal structure:**
- STEP GOAL
- MANDATORY EXECUTION RULES
- EXECUTION PROTOCOLS
- MANDATORY SEQUENCE (numbered sub-steps)
- Menu options
- Success/failure metrics

**Key insight:** A simple workflow might have 3-4 step files. A complex workflow might have 10+. Each step file is a focused, self-contained instruction.

---

## Example 1: Personalized Meal Plan Generator

**Domain:** Health & Fitness

| Aspect | Details |
|--------|---------|
| **Flow** (each → = step file) | Discovery → Assessment → Strategy → Shopping List → Prep Schedule |
| **Step Files** | ~5 files: step-01-discovery, step-02-assessment, step-03-strategy, step-04-shopping, step-05-prep |
| **Output** | Direct-to-final document, each step appends a section |
| **Intent/Prescriptive** | Intent-based - Facilitates discovery of preferences |
| **Planning** | No - builds final meal plan directly |
| **Continuable** | Yes - Can be 200+ tokens, users may need multiple sessions |
| **Structure** | Linear, 5 steps, no branching |
| **Conversation** | Open-ended with progressive questioning (1-2 at a time, probe preferences) |

**Description:** Helps users create personalized weekly meal plans based on dietary restrictions, health goals, and cooking habits.

---

## Example 2: Year-End Tax Organizer

**Domain:** Finance

| Aspect | Details |
|--------|---------|
| **Flow** (each → = step file) | Input Discovery → Document Categorization → Missing Document Alert → Final Summary |
| **Step Files** | 4 files: step-01-input-discovery, step-02-categorize, step-03-missing-alerts, step-04-summary |
| **Output** | Analysis-only + checklist of missing docs |
| **Intent/Prescriptive** | Highly Prescriptive - Tax compliance, exact categories |
| **Planning** | N/A |
| **Continuable** | No - Simple single-session checklist |
| **Structure** | Linear, 4 steps |
| **Conversation** | Focused - specific questions, document what user provides |

**Description:** Organizes financial documents for tax preparation, categorizes income/deductions, alerts to missing documents.

---

## Example 3: Employee Termination Checklist

**Domain:** Legal / HR / Compliance

| Aspect | Details |
|--------|---------|
| **Flow** (each → = step file) | Context → Regulatory Check → Document Requirements → Notification Timeline → Final Checklist |
| **Step Files** | 5 files: step-01-context, step-02-regulatory, step-03-documents, step-04-timeline, step-05-checklist. Some steps branch internally based on reason/location. |
| **Output** | Direct-to-final compliance checklist |
| **Intent/Prescriptive** | Highly Prescriptive - Legal compliance, state-specific |
| **Planning** | No |
| **Continuable** | No - Focused, single-session |
| **Structure** | Branching - Different paths within steps based on: reason, location, employee count |
| **Conversation** | Focused - specific classification questions, present requirements |

**Description:** Generates legally-compliant termination checklists that vary by state, termination reason, and employee count.

---

## Example 4: Tabletop RPG Campaign Builder

**Domain:** Entertainment / Games

| Aspect | Details |
|--------|---------|
| **Flow** (each → = step file) | Session Concept → NPC Creation → Scene Setup → Key Beats → Generate → [Repeat for next session] |
| **Step Files** | 4 core files: step-01-concept, step-02-npc, step-03-scene, step-04-beats, step-05-generate. Same files reused each session. |
| **Output** | Per-session document, maintains campaign continuity |
| **Intent/Prescriptive** | Intent-based - Creative facilitation |
| **Planning** | No - Each session builds directly to playable content |
| **Continuable** | Yes - Campaign has many sessions over months |
| **Structure** | Repeating loop - Same steps, new content each session |
| **Conversation** | Open-ended creative facilitation, "What if..." prompts |

**Description:** Helps Game Masters create individual RPG session content while tracking campaign continuity across multiple sessions.

---

## Example 5: Course Syllabus Creator

**Domain:** Education

| Aspect | Details |
|--------|---------|
| **Flow** | Course Type → Learning Objectives → Module Breakdown → Assessment → [Branch: academic] → Accreditation → [Branch: vocational] → Certification → Final |
| **Output** | Direct-to-final syllabus document |
| **Intent/Prescriptive** | Balanced - Framework prescriptive, content flexible |
| **Planning** | No |
| **Continuable** | Yes - Complex syllabus may require multiple sessions |
| **Structure** | Branching - Course type determines different sections |
| **Conversation** | Mixed - Framework questions (prescriptive) + content discovery (intent) |

**Description:** Creates course syllabi that adapt based on course type (academic, vocational, self-paced) with appropriate accreditation requirements.

---

## Example 6: SOP Writer

**Domain:** Business Process

| Aspect | Details |
|--------|---------|
| **Flow** | Process Selection → Scope Definition → Documentation → Review → [Generate] → "Create another?" → If yes, repeat |
| **Output** | Each SOP is independent, stored in `{sop_folder}/` |
| **Intent/Prescriptive** | Prescriptive - SOPs must be exact, unambiguous |
| **Planning** | No - Each SOP generated directly |
| **Continuable** | No - Single SOP per run, but workflow is repeatable |
| **Structure** | Repeating - Can create multiple SOPs in one session |
| **Conversation** | Focused on process details - "Walk me through step 1" |

**Description:** Generates Standard Operating Procedure documents for business processes. Can create multiple SOPs in one session, each stored independently.

---

## Example 7: Novel Outliner

**Domain:** Creative Writing

| Aspect | Details |
|--------|---------|
| **Flow** | Structure Selection → Character Arcs → Beat Breakdown → Pacing Review → Final Polish |
| **Output** | Free-form with Final Polish step to ensure flow and coherence |
| **Intent/Prescriptive** | Intent-based - "What does your character want?" |
| **Planning** | No - Builds outline directly |
| **Continuable** | Yes - Long-form creative work, sessions span weeks |
| **Structure** | Branching - Different flows based on structure choice |
| **Conversation** | Open-ended creative coaching, provocations |

**Description:** Helps authors create novel outlines with proper story structure (3-Act, Hero's Journey, etc.), character arcs, and beat sheets.

---

## Example 8: Wedding Itinerary Coordinator

**Domain:** Event Planning

| Aspect | Details |
|--------|---------|
| **Flow** | Venue Type → Vendor Coordination → Timeline → Guest Experience → [Branch: hybrid] → Virtual Setup → Day-of Schedule |
| **Output** | Direct-to-final itinerary |
| **Intent/Prescriptive** | Intent-based - Facilitates couple's vision |
| **Planning** | No |
| **Continuable** | Yes - Wedding planning takes months |
| **Structure** | Branching - Venue type affects required sections |
| **Conversation** | Open-ended discovery of preferences, budget, constraints |

**Description:** Creates detailed wedding day itineraries, adapting to venue type (indoor/outdoor/hybrid) and guest experience goals.

---

## Example 9: Annual Life Review

**Domain:** Personal Development

| Aspect | Details |
|--------|---------|
| **Flow** | Input Discovery (last year's goals) → Life Areas Assessment → Reflections → Goal Setting → Action Planning → Final Polish |
| **Output** | Free-form with Final Polish, discovers prior review first |
| **Intent/Prescriptive** | Intent-based - Coaching questions |
| **Planning** | No - Direct to life plan document |
| **Continuable** | Yes - Deep reflection may need multiple sessions |
| **Structure** | Linear with Input Discovery at start |
| **Conversation** | Open-ended coaching, progressive questioning |

**Description:** Annual review workflow that discovers prior year's goals, facilitates reflection across life areas, and sets intentional goals for coming year.

---

## Example 10: Room Renovation Planner

**Domain:** Home Improvement

| Aspect | Details |
|--------|---------|
| **Flow** | Room Type → Budget Assessment → Phase Planning → Materials → Contractor Timeline → [Branch: DIY] → Instructions |
| **Output** | Direct-to-final renovation plan |
| **Intent/Prescriptive** | Balanced - Code compliance prescriptive, design intent-based |
| **Planning** | No |
| **Continuable** | Yes - Complex planning, multi-session |
| **Structure** | Branching - Room type and DIY vs pro affect content |
| **Conversation** | Mixed - "What's your budget?" + "Describe your vision" |

**Description:** Creates room-specific renovation plans with material selection, contractor coordination, and optional DIY instructions.

---

## Pattern Analysis

### Structure Types

| Type | Count | Examples |
|------|-------|----------|
| Linear | 5 | Meal Plan, Tax, Termination, Life Review, Renovation |
| Branching | 5 | Termination, Syllabus, Novel, Wedding, Renovation |
| Repeating Loop | 2 | RPG Campaign, SOP Writer |

### Intent Spectrum

| Type | Count | Examples |
|------|-------|----------|
| Intent-based | 7 | Meal Plan, RPG Campaign, Syllabus (partial), Novel, Wedding, Life Review, Renovation (partial) |
| Prescriptive | 1 | Tax, Termination, SOP |
| Balanced | 2 | Syllabus, Renovation |

### Continuable vs Single-Session

| Type | Count | Examples |
|------|-------|----------|
| Continuable | 7 | Meal Plan, RPG Campaign, Syllabus, Novel, Wedding, Life Review, Renovation |
| Single-Session | 3 | Tax, Termination, SOP (repeatable but single-output) |

### Output Patterns

| Type | Count | Examples |
|------|-------|----------|
| Direct-to-Final | 9 | All except Tax |
| Analysis Only | 1 | Tax |
| With Final Polish | 1 | Novel |
| Input Discovery | 1 | Life Review |
| Repeating Output | 2 | RPG Campaign (sessions), SOP Writer (multiple SOPs) |

---

## Key Insights

1. **Continuable workflows are the norm** - 7 of 10 examples are continuable
2. **Intent-based dominates** - 7 of 10 are primarily intent-based facilitation
3. **Branching is common** - 5 of 10 have conditional paths based on user choices
4. **Input discovery matters** - Workflows in sequences (like BMM pipeline) need to find prior documents
5. **Final polish is critical** - Complex documents built section-by-section need optimization step
6. **Repeating loops exist** - Some workflows generate multiple outputs per session or repeat across sessions
7. **Mixed conversation styles** - Most use focused questions for data, open-ended for creative

---

## Workflow Design Questions

When creating a new workflow, ask:

1. **Domain:** What problem space does this operate in?
2. **Output:** What does this workflow produce? (Document, checklist, analysis, physical output?)
3. **Intent:** Is this prescriptive (compliance) or intent-based (creative)?
4. **Planning:** Plan-then-build or direct-to-final?
5. **Continuable:** Could this take multiple sessions or consume many tokens?
6. **Structure:** Linear, branching, or repeating loop?
7. **Inputs:** Does this require documents from prior workflows or external sources?
8. **Chaining:** Is this part of a module sequence? What comes before/after?
9. **Polish:** Does the final output need optimization for flow and coherence?
10. **Conversation:** Focused questions or open-ended facilitation?
