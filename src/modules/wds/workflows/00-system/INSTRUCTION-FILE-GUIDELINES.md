# Instruction File Guidelines

**Purpose**: Universal guidelines for creating and organizing instruction files across all WDS agents and workflows

**Applies to**: All agents (Saga, Freya, Idunn) and all modules (WDS, BMM, BMGD)

---

## 📏 **File Size Guidelines**

### **Files That SHOULD Be Split** (Sequential Instructions)

**Types**:
- Agent workflow files (step-by-step instructions)
- Implementation guides (sequential tasks)
- Process documentation (phase-by-phase)
- Task instructions (do A, then B, then C)

**Size Limits**:
- **Ideal**: 60-150 lines
- **Maximum**: 180 lines before splitting

**Why?**
- Agents read these sequentially, top-to-bottom
- Large files increase chance of skipping steps
- Harder to navigate and maintain
- Cognitive overload for both agents and humans

**When to split**:
- ❌ Over 150 lines AND sequential
- ❌ Multiple distinct phases in one file
- ❌ File tries to do more than one job
- ❌ Agent must read entire file to proceed

---

### **Files That CAN Be Long** (Reference/Specification)

**Types**:
- **Page specifications** (comprehensive user requirements)
- **PRDs** (product requirement documents)
- **Design system documentation** (component library reference)
- **Technical architecture docs** (system design)
- **Analysis/case studies** (research, examples)
- **Dialog scripts** (conversation patterns with examples)

**Size Limits**:
- **No strict limit** - can be 300-600+ lines
- Use judgment based on usability

**Why?**
- These are human-readable reference materials
- Get broken into smaller work items (stories, tasks) later
- Need comprehensive detail in one place
- Not read sequentially by agents (they reference specific sections)

**Examples**:
```
3.1-Dog-Calendar-Page-Spec.md (600+ lines OK)
    ↓ Broken into work files
work/3.1-Dog-Calendar-Work.yaml (planning doc)
    ↓ Broken into stories
stories/3.1.1-header.md (80 lines)
stories/3.1.2-week-overview.md (95 lines)
    ↓ Agent implements one story at a time
```

---

## 🗂️ **File Organization Patterns**

### **Pattern 1: Router + Micro-Steps** (Best for workflows)

**Structure**:
```
workflow-name/
├── WORKFLOW-NAME.md (overview + router, 50-100 lines)
└── phases/
    ├── 1-phase-name.md (60-120 lines)
    ├── 2-phase-name.md (60-120 lines)
    └── 3-phase-name.md (60-120 lines)
```

**Example**:
```
project-analysis/
├── project-analysis-router.md (routes to correct analysis type)
└── analysis-types/
    ├── outline-based-analysis.md
    ├── folder-based-analysis.md
    └── empty-project-response.md
```

**When to use**:
- Multi-phase workflows
- Sequential processes
- Agent needs to follow steps in order

---

### **Pattern 2: Spec + Stories** (Best for implementation)

**Structure**:
```
feature-or-page/
├── [Feature]-Spec.md (comprehensive, 300-600+ lines OK)
├── work/
│   └── [Feature]-Work.yaml (planning doc)
└── stories/
    ├── [Feature].1-section.md (60-120 lines)
    ├── [Feature].2-section.md (60-120 lines)
    └── [Feature].3-section.md (60-120 lines)
```

**Example**:
```
3.1-Dog-Calendar-Booking/
├── 3.1-Dog-Calendar-Spec.md (comprehensive spec)
├── work/
│   └── 3.1-Dog-Calendar-Work.yaml
└── stories/
    ├── 3.1.1-header.md
    ├── 3.1.2-week-overview.md
    └── 3.1.3-leaderboard.md
```

**When to use**:
- Design and development work
- Complex features broken into sections
- Agent implements piece-by-piece

---

### **Pattern 3: Reference Guide** (Best for lookup)

**Structure**:
```
topic/
└── TOPIC-GUIDE.md (comprehensive, 200-400+ lines OK)
```

**Example**:
```
interactive-prototypes/
├── INTERACTIVE-PROTOTYPES-GUIDE.md (complete system overview)
├── CREATION-GUIDE.md (detailed technical reference)
└── PROTOTYPE-ANALYSIS.md (case study)
```

**When to use**:
- Best practices documentation
- Technical reference
- Analysis and case studies
- Agents look up specific sections as needed

---

## 🎯 **File Type Decision Tree**

```
Is this file sequential instructions?
├─ YES → Keep under 150 lines
│   └─ Over 150? → Split into router + phases
│
└─ NO → Is it a specification or reference?
    ├─ Specification → Length OK (will be broken into stories later)
    └─ Reference Guide → Length OK (agents reference specific sections)
```

---

## ✅ **Post-File Checklist**

**After creating or updating any instruction file, check**:

### **Step 1: Identify File Type**
- ❓ Sequential instructions? (agent reads top-to-bottom)
- ❓ Specification? (will be broken down later)
- ❓ Reference guide? (agent looks up sections)

### **Step 2: Check Line Count**
- Sequential instructions over 150 lines? → Consider splitting
- Multiple distinct phases? → Split into separate files
- More than one job? → Split by responsibility

### **Step 3: Verify Organization**
- One clear purpose per file?
- Natural break points if sequential?
- Clear navigation if split?

### **Step 4: Suggest Improvements**
If file should be split, suggest:
> "**Micro-step check**: This file is [X] lines. Since it contains [Y distinct phases/sequential steps], I recommend splitting it into:
>
> 1. `[router-file].md` (overview + links)
> 2. `[step-1].md` (phase 1)
> 3. `[step-2].md` (phase 2)
> ...
>
> **Would you like me to split it now?** (Y/N)"

---

## 📊 **Size Reference Table**

| File Type | Ideal Size | Max Size | Split If... |
|-----------|-----------|----------|-------------|
| **Router/Overview** | 50-100 lines | 120 lines | Multiple routing paths |
| **Micro-step instructions** | 60-150 lines | 180 lines | Multiple phases |
| **Dialog scripts** | 150-300 lines | 400 lines | Multiple separate dialogs |
| **Page specifications** | No limit | Use judgment | N/A (broken into stories) |
| **Reference guides** | 200-400 lines | 600 lines | Multiple distinct topics |
| **PRDs** | No limit | Use judgment | N/A (reference doc) |
| **Technical docs** | 200-400 lines | 600 lines | Multiple separate systems |

---

## 🚨 **Red Flags**

**Split immediately if**:
- ❌ Sequential instructions over 200 lines
- ❌ File contains 3+ distinct phases
- ❌ Agent must scroll extensively to follow
- ❌ Table of contents feels necessary
- ❌ You're thinking "this is getting long..."

**Keep as-is if**:
- ✅ Comprehensive specification document
- ✅ Reference guide with clear sections
- ✅ Will be broken into smaller work items
- ✅ Agents reference specific parts, not read sequentially

---

## 💡 **Key Principles**

1. **One job per file** - Each file has ONE clear purpose
2. **Router pattern** - Main file routes to specific instruction files
3. **Digestible chunks** - Keep sequential instructions under 150 lines
4. **Just-in-time loading** - Agent loads only what's needed for current phase
5. **Specs can be long** - They get broken down into stories/tasks later
6. **References can be long** - Agents look up specific sections as needed
7. **Instructions must be short** - Agents read them sequentially

---

## 🔄 **The Workflow Pattern**

**Comprehensive Spec → Planning Doc → Micro-Step Stories → Implementation**

```
Long Specification (500+ lines OK)
    ↓
    Analyzed and broken down
    ↓
Planning Document (work file, yaml)
    ↓
    Split into implementable chunks
    ↓
Story Files (50-150 lines each)
    ↓
    Agent follows one story at a time
    ↓
Incremental Implementation
```

**This pattern ensures**:
- Comprehensive requirements captured upfront
- Work broken into manageable pieces
- Agents follow focused, digestible instructions
- Quality maintained through approval gates

---

## 📝 **Related Guidelines**

- **File naming**: See `FILE-NAMING-CONVENTIONS.md`
- **Agent activation**: See `project-analysis/` workflow
- **Project structure**: See `.wds-project-outline.yaml`

---

**Remember**: The goal is to make instructions **easy for agents to follow** and **easy for humans to maintain**! 🎯

