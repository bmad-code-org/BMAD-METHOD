# Manual WDS Initialization

**Set up WDS in your project without NPX - 3 simple steps**

---

## Overview

This guide walks you through manually initializing WDS in your project by copying the necessary files and folder structure.

**Time:** 5 minutes  
**Difficulty:** Beginner

---

## Prerequisites

- A project repository (GitHub, GitLab, local Git repo)
- Basic familiarity with file structure
- Code editor (VS Code/Cursor recommended)

---

## Step 1: Copy WDS Module to Your Project

### Option A: Clone and Copy

```bash
# Clone WDS repository (temporary location)
git clone https://github.com/whiteport-collective/whiteport-design-studio.git temp-wds

# Copy the WDS module to your project
cp -r temp-wds/src/modules/wds your-project/.cursor/rules/wds

# Remove temporary clone
rm -rf temp-wds
```

### Option B: Download and Copy

1. Download WDS from [GitHub](https://github.com/whiteport-collective/whiteport-design-studio)
2. Extract the archive
3. Copy `src/modules/wds` to `your-project/.cursor/rules/wds`

---

## Step 2: Verify Folder Structure

After copying, your project should have this structure:

```
your-project/
├── .cursor/
│   └── rules/
│       └── wds/
│           ├── agents/
│           │   ├── freya-ux.agent.yaml
│           │   ├── idunn-pm.agent.yaml
│           │   └── saga-analyst.agent.yaml
│           ├── workflows/
│           │   ├── 1-project-brief/
│           │   ├── 2-trigger-mapping/
│           │   ├── 3-prd-platform/
│           │   ├── 4-ux-design/
│           │   └── 00-system/
│           ├── getting-started/
│           └── WDS-WORKFLOWS-GUIDE.md
└── [your project files]
```

---

## Step 3: Activate WDS Agent

### In Cursor AI

1. **Open your project** in Cursor
2. **Start a new chat** with the AI
3. **Reference the WDS agent** you want to use:

```
@wds/agents/freya-ux    - For UX Design & Prototyping
@wds/agents/idunn-pm     - For Product Management & Analysis
@wds/agents/saga-analyst - For Scenario Analysis
```

### Example Activation

```
You: @wds/agents/freya-ux

Agent: 🎨 **Freya - UX Designer**

I'm ready to help you design user experiences!

What would you like to work on?
- Create interactive prototypes
- Design scenarios
- Sketch to specification
- UX research and analysis
```

---

## Step 4: Start Your First Workflow

Choose a workflow to start:

### 🎯 **Trigger Map** (Recommended First Step)
```
@wds/workflows/trigger-map
```
*Understand your users' pain points and triggers*

### 📋 **Product Brief**
```
@wds/workflows/product-brief
```
*Define your product vision and goals*

### 🎨 **Interactive Prototypes**
```
@wds/workflows/interactive-prototypes
```
*Build clickable prototypes for testing*

### 📊 **Scenario Analysis**
```
@wds/workflows/scenario-init
```
*Define and analyze user scenarios*

---

## Verification Checklist

✅ WDS folder exists in `.cursor/rules/wds/`  
✅ Agent files are present in `agents/` folder  
✅ Workflows folder contains all 5 workflow directories  
✅ Can reference `@wds/agents/` in Cursor chat  
✅ Agent responds when referenced  

---

## Quick Reference

### Agent Launchers

| Agent | Purpose | Reference |
|-------|---------|-----------|
| **Freya** | UX Design & Prototyping | `@wds/agents/freya-ux` |
| **Idunn** | Product Management | `@wds/agents/idunn-pm` |
| **Saga** | Scenario Analysis | `@wds/agents/saga-analyst` |

### Key Workflows

| Workflow | Purpose | Reference |
|----------|---------|-----------|
| **Trigger Map** | User pain points | `@wds/workflows/trigger-map` |
| **Product Brief** | Product vision | `@wds/workflows/product-brief` |
| **Prototypes** | Interactive demos | `@wds/workflows/interactive-prototypes` |
| **Scenario Init** | User journeys | `@wds/workflows/scenario-init` |

---

## Troubleshooting

### ❌ "Can't find @wds/agents/freya-ux"

**Solution:** Check that the folder structure matches Step 2. The path should be:
```
.cursor/rules/wds/agents/freya-ux.agent.yaml
```

### ❌ "Agent doesn't respond"

**Solution:** 
1. Restart Cursor
2. Try referencing the agent again with a clear question:
   ```
   @wds/agents/freya-ux Can you help me create a prototype?
   ```

### ❌ "Workflow not found"

**Solution:** Verify all workflow folders are present:
```
.cursor/rules/wds/workflows/1-project-brief/
.cursor/rules/wds/workflows/2-trigger-mapping/
.cursor/rules/wds/workflows/3-prd-platform/
.cursor/rules/wds/workflows/4-ux-design/
.cursor/rules/wds/workflows/00-system/
```

---

## What's Next?

### 🎓 **Learn WDS Concepts**
[Course](../course/00-course-overview.md) - Deep dive into WDS methodology

### 🚀 **Start Your First Project**
[Quick Start](quick-start.md) - 5-minute walkthrough

### 📚 **Explore All Workflows**
[Workflows Guide](../WDS-WORKFLOWS-GUIDE.md) - Complete workflow documentation

### 🤝 **Join the Community**
[Discord](https://discord.gg/whiteport) - Get help and share experiences

---

## Optional: Create Project Docs Folder

For a complete setup, create a `docs/` folder in your project:

```bash
mkdir -p docs/{A-Strategy,B-Requirements,C-Scenarios,D-Prototypes,E-Deliveries}
```

This gives you a structured place to store all WDS outputs.

---

## Manual vs NPX Installation

| Method | Pros | Cons |
|--------|------|------|
| **Manual** | • No dependencies<br>• Full control<br>• Works offline | • Manual updates<br>• Must copy files |
| **NPX** | • Automatic updates<br>• One command<br>• Always latest | • Requires Node.js<br>• Internet needed |

Both methods give you the **exact same WDS experience**!

---

## Summary

You've successfully initialized WDS manually! 🎉

**You can now:**
✅ Reference WDS agents in Cursor  
✅ Run WDS workflows  
✅ Create conceptual specifications  
✅ Build interactive prototypes  

**Next:** Try the [Quick Start Guide](quick-start.md) to create your first Trigger Map!

---

[← Back to Getting Started](installation.md) | [Next: Quick Start →](quick-start.md)

