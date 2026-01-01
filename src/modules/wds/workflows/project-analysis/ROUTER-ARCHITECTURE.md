# Router-Based Agent System - Architecture

## 🎯 Why Router Pattern?

**Problem with Sequential Flow**:
❌ Agents improvise and skip steps  
❌ Agents combine instructions from multiple files  
❌ Agents take initiatives in wrong order  
❌ Unpredictable behavior

**Solution: Router Pattern**:
✅ Check condition → Route to ONE file → Follow ONLY that file  
✅ No flow to skip  
✅ No improvisation  
✅ Predictable, consistent behavior

---

## 🔀 Router Architecture

```
┌─────────────────────────────────┐
│  USER ACTIVATES AGENT           │
│  @freya / @saga / @idunn       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  STEP 1: Show Presentation      │
│  → freya-presentation.md       │
│  → saga-presentation.md         │
│  → idunn-presentation.md        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  STEP 2: ROUTER                 │
│  instructions.md (router only)  │
│                                 │
│  Check conditions in order:     │
│  A → B → C → D → E              │
│  STOP at first match            │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┬──────┬──────┬──────┐
      │             │      │      │      │
   COND A        COND B  COND C COND D COND E
      │             │      │      │      │
      ▼             ▼      ▼      ▼      ▼
┌─────────┐  ┌─────────┐ ┌──────┐ ┌────┐ ┌────┐
│Outline  │  │ Folder  │ │Empty │ │New │ │Unkn│
│Exists   │  │Structure│ │Docs  │ │Proj│ │own │
└────┬────┘  └────┬────┘ └───┬──┘ └─┬──┘ └─┬──┘
     │            │           │      │      │
     ▼            ▼           ▼      ▼      ▼
┌──────────┐ ┌──────────┐ ┌─────┐ ┌────┐ ┌────┐
│outline-  │ │folder-   │ │empty│ │new-│ │unkn│
│based-    │ │based-    │ │proj │ │proj│ │own-│
│analysis  │ │analysis  │ │resp │ │resp│ │resp│
│.md       │ │.md       │ │.md  │ │.md │ │.md │
└────┬─────┘ └────┬─────┘ └──┬──┘ └─┬──┘ └─┬──┘
     │            │            │      │      │
     │            │            │      │      │
     └────────────┴────────────┴──────┴──────┘
                  │
                  ▼
         ┌────────────────┐
         │ Present Status │
         │ + Options      │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────────┐
         │ User Selects Task  │
         └────────┬───────────┘
                  │
          ┌───────┴────────┐
          │                │
    In YOUR Domain   Other Domain
          │                │
          ▼                ▼
    ┌──────────┐    ┌──────────────┐
    │Continue  │    │agent-handoff-│
    │in same   │    │guide.md      │
    │convo     │    │              │
    └──────────┘    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Hand Over to │
                    │ Other Agent  │
                    └──────────────┘
```

---

## 📁 File Structure

```
project-analysis/
├── instructions.md                    ← ROUTER ONLY
├── agent-handoff-guide.md             ← Handoff instructions
├── analysis-types/                    ← Routed destinations
│   ├── outline-based-analysis.md      ← FAST (Condition A)
│   ├── folder-based-analysis.md       ← FALLBACK (Condition B)
│   ├── empty-project-response.md      ← Quick response (Condition C)
│   ├── new-project-response.md        ← Quick response (Condition D)
│   └── unknown-structure-response.md  ← Quick response (Condition E)
└── agent-domains/                     ← Agent expertise
    ├── saga-domain.md                 ← Phases 1-2
    ├── freya-domain.md               ← Phases 4-5, 7
    └── idunn-domain.md                ← Phases 3, 6
```

---

## 🎯 Router Conditions

**Checked in order. First match wins.**

```
A: Project Outline Exists?
   → docs/.wds-project-outline.yaml
   → .wds-project-outline.yaml
   IF YES → outline-based-analysis.md (FAST!)

B: Docs Folder with Structure?
   → docs/1-*, docs/A-* folders exist
   IF YES → folder-based-analysis.md (FALLBACK)

C: Empty Docs Folder?
   → docs/ exists but empty
   IF YES → empty-project-response.md (QUICK)

D: No Docs Folder?
   → No docs/ folder at all
   IF YES → new-project-response.md (QUICK)

E: Unknown Structure?
   → docs/ exists but no pattern match
   IF YES → unknown-structure-response.md (QUICK)
```

---

## 🔑 Key Principles

### 1. Router is NOT a Flow

- Router checks conditions
- Router routes to ONE file
- Agent follows ONLY that ONE file
- No combining files

### 2. Routed Files are Complete

- Each analysis file is standalone
- Contains all instructions needed
- Tells agent exactly what to present
- No references back to router

### 3. Agent Domain Files are Reference

- Loaded AFTER analysis complete
- Used for generating recommendations
- Lists "when to stay" vs "when to hand over"

### 4. Handoff Guide is Universal

- One handoff pattern for all agents
- Clear 4-step process
- No copy/paste needed
- Seamless agent switch

---

## ✅ Benefits of Router Pattern

| Sequential Flow   | Router Pattern         |
| ----------------- | ---------------------- |
| Agent improvises  | Agent follows ONE file |
| Skips steps       | No steps to skip       |
| Unpredictable     | Predictable            |
| Takes initiatives | Follows instructions   |
| Combines files    | Uses ONE file only     |

---

## 🎨 Example: Freya Activation

**User**: `@freya help me`

**Router checks**:

1. Outline exists? → **YES** ✅
2. Route to: `outline-based-analysis.md`
3. **STOP** (don't check B, C, D, E)

**Freya follows outline-based-analysis.md ONLY**:

- Reads outline
- Presents status
- Shows user intentions
- Suggests 2-4 options

**User**: "I need technical requirements"

**Freya checks**: `freya-domain.md`  
→ "Technical requirements" = Phase 3 = Idunn's domain

**Freya uses**: `agent-handoff-guide.md`  
→ Hands over to Idunn seamlessly

**Idunn activates automatically**:

- Shows presentation
- Router checks → Outline exists
- Routes to: `outline-based-analysis.md`
- Reads SAME outline
- Continues helping!

---

**Router pattern = Predictable, consistent agent behavior!** 🎯
