# Agent Initiation Flow - Complete Diagram

## 🎬 **Full Agent Activation Sequence**

```
┌─────────────────────────────────────────┐
│  USER ACTIVATES FREYA                    │
│  @freya-ux.agent.yaml                  │
│  "Help me with Dog Week design"         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  STEP 0: CHECK FOR PROJECT OUTLINE      │
│  Look for: docs/.wds-project-outline.yaml│
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    FOUND         NOT FOUND
        │             │
        ▼             ▼
┌───────────────┐  ┌────────────────────┐
│  FAST PATH    │  │  FALLBACK PATH     │
│  (< 5 sec)    │  │  (30-60 sec)       │
└───┬───────────┘  └────┬───────────────┘
    │                   │
    │                   ▼
    │            ┌────────────────────────┐
    │            │ STEP 1: Branded        │
    │            │ "🎨 Freya WDS         │
    │            │  Designer Agent"       │
    │            └────┬───────────────────┘
    │                 │
    │                 ▼
    │            ┌────────────────────────┐
    │            │ STEP 2: Identify       │
    │            │ Project Structure      │
    │            │ • Check for numbered   │
    │            │   folders (WDS v6)     │
    │            │ • Check for letter     │
    │            │   folders (WPS2C v4)   │
    │            │ • Detect methodology   │
    │            └────┬───────────────────┘
    │                 │
    │                 ▼
    │            ┌────────────────────────┐
    │            │ STEP 3: Scan Folders   │
    │            │ • List each phase      │
    │            │ • Count files          │
    │            │ • Check completion     │
    │            │ (SLOW - many I/O ops)  │
    │            └────┬───────────────────┘
    │                 │
    │                 ▼
    │            ┌────────────────────────┐
    │            │ STEP 4: Generate Report│
    │            │ Based on folder scan   │
    │            └────┬───────────────────┘
    │                 │
    ▼                 │
┌───────────────────────────────────┐
│ STEP 1.5: PROCESS OUTLINE DATA    │◀──┘
│                                   │
│ Read from outline:                │
│ ┌───────────────────────────────┐ │
│ │ methodology:                  │ │
│ │   type: "wps2c-v4"            │ │
│ │                               │ │
│ │ phases:                       │ │
│ │   phase_4_ux_design:          │ │
│ │     active: true              │ │
│ │     status: "in_progress"     │ │
│ │     folder: "C-Scenarios"     │ │
│ │     intent: "3 MVP scenarios" │ │
│ │     scenarios:                │ │
│ │       - id: "01-onboarding"   │ │
│ │         status: "complete"    │ │
│ │         pages_specified: 9    │ │
│ │         pages_implemented: 5  │ │
│ └───────────────────────────────┘ │
│                                   │
│ Load methodology instructions:    │
│ • wps2c-v4-instructions.md        │
│ • Know folder pattern: {letter}-  │
│ • Know phase structure: A-G       │
└───────────────┬───────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  GENERATE SMART STATUS REPORT           │
│                                         │
│  ✅ Phase 2: Trigger Map (Complete)     │
│     └─ Intent: Swedish families focus   │
│                                         │
│  🔄 Phase 4: UX Design (In Progress)    │
│     ├─ Intent: 3 MVP scenarios          │
│     ├─ Scenario 01: Complete            │
│     │   (9 pages, 5 implemented)        │
│     └─ Scenario 03: In progress         │
│                                         │
│  📋 Phase 5: Design System (Skipped)    │
│     └─ Reason: Using shadcn/ui          │
│                                         │
│  💡 Recommendations:                    │
│  1. Complete Scenario 03 implementation │
│  2. Test pages 1.1-1.5 against specs    │
│  3. Start Scenario 02 if needed         │
│                                         │
│  Which would you like to work on?       │
└─────────────────────────────────────────┘
```

---

## 🔑 **Key Improvements from Methodology Integration**

### **1. Methodology Detection**

**FAST PATH (with outline):**

```yaml
# Reads from outline
methodology.type: "wps2c-v4"
→ Loads: wps2c-v4-instructions.md
→ Knows: Folders are {letter}-{name}
→ Knows: C-Scenarios is Phase 4
```

**FALLBACK PATH (no outline):**

```python
# Scans folders
if folders match "1-*", "2-*", "4-*":
    methodology = "wds-v6"
elif folders match "A-*", "B-*", "C-*":
    methodology = "wps2c-v4"
else:
    ask_user_which_methodology()
```

---

### **2. User Intentions Display**

**FROM OUTLINE:**

```yaml
phase_4_ux_design:
  intent: |
    Create 3 core MVP scenarios:
    - Customer onboarding
    - Profile management  
    - Calendar booking
```

**IN REPORT:**

```
🔄 Phase 4: UX Design (In Progress)
   └─ Intent: Create 3 core MVP scenarios
```

**USER SEES THEIR OWN WORDS!** ✨

---

### **3. Scenario-Level Tracking**

**FROM OUTLINE:**

```yaml
scenarios:
  - id: '01-customer-onboarding'
    status: 'complete'
    pages_specified: 9
    pages_implemented: 5
    intent: 'Onboard users to active family'
```

**IN REPORT:**

```
├─ Scenario 01: Customer Onboarding (Complete)
│   ├─ 9 pages specified
│   ├─ 5 pages implemented
│   └─ Next: Implement pages 1.6-1.9
```

**GRANULAR PROGRESS!** 📊

---

### **4. Skip Reasons**

**FROM OUTLINE:**

```yaml
phase_5_design_system:
  active: false
  skip_reason: 'Using shadcn/ui component library'
```

**IN REPORT:**

```
📋 Phase 5: Design System (Skipped)
   └─ Reason: Using shadcn/ui component library
```

**CONTEXT PRESERVED!** 🎯

---

## ⚡ **Performance Comparison**

| Operation            | Without Outline | With Outline |
| -------------------- | --------------- | ------------ |
| **Check outline**    | -               | <1s          |
| **Load methodology** | -               | <1s          |
| **Scan folders**     | 10-20s          | SKIPPED      |
| **Read files**       | 10-20s          | SKIPPED      |
| **Count lines**      | 5-10s           | SKIPPED      |
| **Generate report**  | 5-10s           | <2s          |
| **TOTAL**            | **30-60s**      | **<5s**      |

**Result**: **6-12x FASTER** activation! ⚡

---

## 🎨 **Example: Dog Week Project**

### **Outline Contents:**

```yaml
methodology:
  type: 'wps2c-v4'

phases:
  phase_4_ux_design:
    folder: 'C-Scenarios'
    intent: 'Mobile-first Swedish family dog coordination'
    scenarios:
      - id: '01-customer-onboarding'
        pages_specified: 9
        pages_implemented: 5
      - id: '03-booking-dog-walks'
        pages_specified: 1
        pages_implemented: 0
```

### **Freya's Response:**

```
🎨 Freya WDS Designer Agent

Reading project outline... ✅ (WPS2C v4 methodology detected)

🔄 Phase 4: UX Design (In Progress)
   Intent: Mobile-first Swedish family dog coordination

   Scenario 01: Customer Onboarding (Partially Implemented)
   ├─ 9 pages specified with object IDs
   ├─ 5 pages implemented (1.1-1.5)
   └─ 📋 Ready: Pages 1.6-1.9 (Add Dog, Add Family Member)

   Scenario 03: Dog Calendar Booking (Specified)
   ├─ Complete spec with Swedish week system
   ├─ Interactive HTML prototype exists
   └─ 📋 Ready for implementation

💡 I can help you with:
1. Implement pages 1.6-1.9 (complete onboarding flow)
2. Implement Scenario 03 (calendar booking system)
3. Review/refine existing specifications
4. Design additional scenarios if needed

What would you like to focus on?
```

**Time taken: <5 seconds**
**User sees their intentions + granular progress + smart recommendations!**

---

**Does this flow make sense now?** 🎯

The key is:

1. ✅ Agent checks for outline FIRST
2. ✅ Outline contains methodology + intentions + status
3. ✅ Agent loads methodology instructions
4. ✅ Agent uses outline data (doesn't scan folders)
5. ✅ Agent generates smart, contextual report
6. ✅ If no outline: fallback to folder scanning + suggest creating one
