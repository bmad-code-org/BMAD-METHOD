# Outline-Based Analysis

**You were routed here because**: Project outline exists  
**This is**: FAST PATH (<5 seconds)

---

## What to Do

Read `.wds-project-outline.yaml` and present status based on its contents.

---

## 1. Read the Outline

Location: `docs/.wds-project-outline.yaml` OR `.wds-project-outline.yaml`

**Extract**:

```yaml
methodology:
  type: "wds-v6" | "wps2c-v4" | "custom"

phases:
  phase_1_project_brief:
    active: true/false
    status: "not_started" | "in_progress" | "complete"
    intent: "[User's goals]"

  phase_4_ux_design:
    active: true
    status: "in_progress"
    scenarios:
      - id: "01-scenario"
        status: "complete"
        pages_specified: 9
        pages_implemented: 5
```

---

## 2. Check for Agent Dialog Files (Context Loading)

**Look for conversation history:**

1. **Find dialog folder:**
   - From outline, get `root_folder` (e.g., "docs", "design-process")
   - Check: `{{root_folder}}/progress/dialog/progress-tracker.md`

2. **If dialog files exist:**
   - **Read `dialog/progress-tracker.md`**: Shows which PB steps are complete, current status
   - **Read `dialog/00-context.md`**: Working relationship context (stakes, involvement level, recommendation style)
   - **Read `dialog/decisions.md`**: Key decisions made during discovery
   - **Read relevant step dialogs** (02-vision.md, 07-positioning.md, etc.) if needed for deeper context

3. **What you learn from dialogs:**
   - **Progress:** Which steps completed, which in progress
   - **Context:** User's role, stakes, how directive to be
   - **Decisions:** Why choices were made, what was explored
   - **Tone:** How user prefers to work (collaborative, autonomous, etc.)
   - **Conversation history:** Actual exchanges, what user said vs what agent synthesized

4. **If no dialog files:**
   - Fresh start, no prior conversation context
   - You'll learn about the project from outline and artifacts only

**Why this matters:** Dialog files let you continue seamlessly rather than asking questions that were already answered. If user discussed positioning rationale in detail 3 weeks ago, you don't re-ask - you already know.

**Time**: Add 3-5 seconds if dialogs exist (read 3-4 files)

---

## 3. Fast Validation (Tier 1)

**Purpose**: Quick reality check to catch obvious outline drift

**Why keep it silent**: Users care about their project progress, not technical file validation. Only surface validation if there's a problem worth discussing.

**What to check** (internally):

1. **Phase folders exist** - Does the outlined structure match reality?
2. **Artifacts roughly match** - Are the claimed files actually there?
3. **Major discrepancies** - Anything significantly wrong?

**When to mention validation**:

- ✅ Major issue found: "I noticed the outline mentions X, but I can't find it. Shall we update the outline or recreate the missing work?"
- ✅ Everything matches: Don't mention validation at all, just present status

**Time**: Add 2-3 seconds (total: 10-13 seconds with dialogs)

---

## 4. Present Status

**Purpose**: Show the project work - all active phases, what's been done, what needs doing.

**Show ALL active phases** from the outline (not filtered by agent):

**Suggested presentation format**:

```
Current Project Status:

[STATUS] Phase [N]: [Name] ([Status])
   ├─ Intent: "[User's exact words from outline]"
   ├─ [What's been created - describe the work]
   └─ [What's the progress]

[For skipped phases:]
⏭️  Phase [N]: [Name] (Skipped)
   └─ Reason: [skip_reason from outline]
```

**Status Icons** (suggested):

- ✅ Complete
- 🔄 In Progress
- 📋 Ready to start
- ⏭️ Skipped

**Talk about the work**: Focus on what's been designed/created, creative progress, user experiences - not files or folders.

---

## 5. Show Work Details

**If Phase 4 (UX Design) has scenarios**, show scenario progress:

```
Scenario Progress:
├─ Scenario 01: [Name] ([Status])
│   └─ [Brief description of what's been designed]
├─ Scenario 02: [Name] ([Status])
│   └─ [Brief description]
└─ Scenario 03: [Name] ([Status])
    └─ [Brief description]
```

**For other phases**, show relevant work details from the outline.

---

## 6. Ask What User Wants to Work On

**Present all possible work** (not filtered by agent domain):

```
💡 What would you like to work on?

[List all active work across all phases:]
1. [Task from any phase]
2. [Another task from any phase]
3. [Task from different phase]
4. [Alternative task]

Tell me what you would like to work on!
```

**After user selects**, route to appropriate work-type file based on selection.

---

## 7. Route Based on User Selection

**Determine work type** from user's selection:

**Strategy & Research work** → `../work-types/strategy-work.md`  
**Design & UX work** → `../work-types/design-work.md`  
**Technical & Platform work** → `../work-types/technical-work.md`  
**Testing & Validation work** → `../work-types/testing-work.md`

The work-type file will recommend the appropriate agent if needed.

---

## Example Output (Suggested - Agent Agnostic)

**This is a suggested way to present ALL project work, not filtered by agent**:

```
Current Project Status:

✅ Phase 1: Product Brief (Complete)
   └─ Vision and strategy established

✅ Phase 2: Trigger Map (Complete)
   └─ Users and journeys mapped

✅ Phase 3: Platform Requirements (Complete)
   └─ Tech stack and architecture defined

🔄 Phase 4: UX Design (In Progress)
   ├─ Intent: "Create 2-3 landing pages for developer handoff"
   ├─ Scenario 01 (Customer Onboarding): Complete
   │   └─ Welcoming flow for first-time users designed
   ├─ Scenario 02 (Family Invitation): Ready to start
   │   └─ Invitation experience needs design
   └─ Scenario 03 (Calendar Booking): Specified with prototype
       └─ Swedish week-based calendar ready for implementation

⏭️  Phase 5: Design System (Skipped)
   └─ Reason: Using shadcn/ui component library

📋 Phase 7: Testing (Ready to start)
   └─ Validation of Swedish week calendar and mobile UX

💡 What would you like to work on?

1. Design the family invitation experience (Scenario 02)
2. Refine the onboarding flow (Scenario 01)
3. Build interactive prototype for calendar
4. Validate implementation against design specs
5. Test Swedish week calendar logic
6. Review Product Brief or Trigger Map

Tell me what you would like to work on!
```

**Note**: This presents ALL work, letting the user choose. The work-type routing will then determine which agent is best suited.

---

## After User Selects

**Route to work-type file** based on what they chose:

- Strategy/research work → `../work-types/strategy-work.md`
- Design/UX work → `../work-types/design-work.md`
- Technical/platform work → `../work-types/technical-work.md`
- Testing/validation work → `../work-types/testing-work.md`

**Before starting work**, perform Tier 2 validation:
→ See: `../validation/deep-validation-before-work.md`

---

**Total time: 7-8 seconds** (with Tier 1 validation)
