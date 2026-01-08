# WDS Agent Launchers

**Quick access files to activate WDS agents in your IDE**

---

## 🚀 Quick Start: Activate an Agent

Simply reference one of these files in your IDE chat to activate the corresponding WDS agent:

### Freya - UX/UI Designer 🎨

**File**: `@wds-freya-ux.md`  
**Specializes in**: UX Design, Design Systems, Testing  
**Phases**: 4, 5, 7

### Saga - Business Analyst 📚

**File**: `@wds-saga-analyst.md`  
**Specializes in**: Project Briefs, User Research, Strategy  
**Phases**: 1, 2

### Idunn - Product Manager 📋

**File**: `@wds-idunn-pm.md`  
**Specializes in**: Technical Requirements, Architecture, Delivery  
**Phases**: 3, 6

---

## How It Works

When you reference one of these files (e.g., `@wds-freya-ux.md`), the agent will:

1. **Load their persona** from their agent definition file
2. **Execute project analysis** using the router workflow
3. **Present themselves** with their branded introduction
4. **Analyze your project** comprehensively:
   - Scan all attached repos
   - Check documentation structure
   - Assess implementation status
   - Map to WDS phases
5. **Present findings** with actionable next steps
6. **Continue or handoff** based on your task selection

---

## Router-Based Analysis

All agents use a **router pattern** for predictable behavior:

**Router checks** (in order):

- **A**: Project outline exists? → Fast analysis (<5s)
- **B**: WDS/WPS2C folders exist? → Folder scan (~20s)
- **C**: Empty docs folder? → Complete project scan
- **D**: No docs folder? → Determine project type
- **E**: Unknown structure? → Custom methodology analysis

**Routes to ONE file** → Agent follows ONLY that file → No improvisation!

---

## Agent Domains

Each agent focuses on specific WDS phases:

| Agent       | Primary Phases | Key Expertise                |
| ----------- | -------------- | ---------------------------- |
| **Saga**    | 1-2            | Strategy, research, personas |
| **Freya**  | 4-5, 7         | Design, prototypes, testing  |
| **Idunn**   | 3, 6           | Architecture, delivery, PM   |

If you select a task outside the current agent's domain, they'll seamlessly hand over to the specialist.

---

## Example Usage

```
User: @wds-freya-ux.md help me with my project

Freya:
🎨 Freya WDS Designer Agent

I'm Freya, your UX design partner...

Analyzing your project...

[Complete project analysis]
[Status report]
[Actionable options]

What would you like to work on?
```

---

## Benefits

✅ **Short, memorable commands** - No more typing long file paths  
✅ **Complete analysis** - Every activation gives full project context  
✅ **Predictable behavior** - Router pattern prevents agent improvisation  
✅ **Seamless handoffs** - Agents recommend specialists automatically  
✅ **Fast with outline** - <7 seconds when project outline exists

---

## Creating Project Outline

For fastest agent activation (5-7 seconds instead of 20-30 seconds), create a project outline:

**Saga WDS Analyst Agent** can help you create `.wds-project-outline.yaml` during Phase 1 (Project Brief). This file stores:

- Methodology type (WDS v6, WPS2C v4, custom)
- Phase status and intentions
- Scenario tracking
- Update history

With an outline, agents instantly understand your project context!

---

## Next Steps

1. **Choose an agent** based on what you're working on
2. **Reference their launcher file** in your IDE chat
3. **Get complete project analysis** automatically
4. **Select your task** from their recommendations
5. **Work efficiently** with the right specialist

---

**Ready to start?** Pick an agent and let's go! 🚀
