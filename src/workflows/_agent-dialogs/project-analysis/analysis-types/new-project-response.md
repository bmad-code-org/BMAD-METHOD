# New Project Analysis

**You were routed here because**: No docs folder exists at all
**Analysis type**: Complete project scan

---

## What to Do

No docs/ folder means either brand new project or non-WDS project. Perform complete analysis of what exists, then **route to Phase 0 for proper project setup**.

---

## 1. Scan Attached Repos

**Check ALL repos attached to IDE** (exclude WDS, BMAD, WPS2C):

For each project repo:

- **Project name**: Extract from package.json, folder name, or README
- **Tech stack**: Check package.json dependencies, frameworks
- **Folder structure**: Check for app/, src/, components/, etc.
- **Implementation status**: Any code implemented?
- **Other docs**: Non-WDS documentation? (README, Wiki, etc.)

---

## 2. Determine Project Type

**Scenario A**: Completely empty repo (GREENFIELD)

- Just .git/ and maybe README
- Brand new project
- No existing code

**Scenario B**: Code exists, no WDS docs (BROWNFIELD)

- Has app/, src/, components/
- Active development without WDS methodology

**Scenario C**: Non-WDS documentation exists

- Has docs/ but different structure
- Using different methodology

---

## 3. Present Analysis & Route to Phase 0

**Format**:

```
[Your Agent Icon] [Your Agent Name]

Complete Project Analysis:

📁 Project: [Name]
🔧 Tech Stack: [List or "Not yet defined"]
📂 Structure: [Describe what exists]

WDS Documentation Status:
└─ No docs/ folder found
└─ No .wds-project-outline.yaml found

---

[SCENARIO A - Empty Project / Greenfield]:

Project Status: Brand new repository
├─ Configuration: [package.json, tsconfig, etc. exist?]
├─ README: [Exists? Contains what?]
└─ Status: Ready for WDS setup

🚀 **This is a GREENFIELD project!**

Before we dive into design work, let's set up your project properly.
This takes 3-5 minutes and ensures you follow the right workflow.

→ **Starting Phase 0: Project Setup**

---

[SCENARIO B - Code Without Docs / Brownfield]:

Project Status: BROWNFIELD - Existing product, no WDS documentation
├─ Implementation: [X] files in [app/src/] directory
├─ Tech Stack: [List detected technologies]
└─ Status: Active codebase detected

Implementation found:
├─ [Feature/file 1]
├─ [Feature/file 2]
└─ [Feature/file 3]

⚠️ **This is a BROWNFIELD project!**

You have existing code. Phase 0 will confirm the right approach
(Phase 8 for improvements, not Phase 1-7 for new builds).

→ **Starting Phase 0: Project Setup**

---

[SCENARIO C - Different Methodology]:

Project Status: Uses non-WDS documentation structure
├─ Documentation: [Describe what exists]
├─ Methodology: [Try to identify: Agile, Scrum, custom]
└─ Status: Migration or custom setup needed

Existing Documentation:
├─ [File/folder 1]
├─ [File/folder 2]
└─ [File/folder 3]

💡 You have existing methodology. Phase 0 will help you decide:
- Migrate to WDS v6
- Continue current approach (I'll adapt)
- Set up custom WDS hybrid

→ **Starting Phase 0: Project Setup**
```

---

## 4. Execute Phase 0

**CRITICAL**: After presenting the analysis, immediately load and execute Phase 0.

**Load**: `{project-root}/_bmad/wds/workflows/0-project-setup/steps/step-01-welcome.md`

**Why Phase 0 first**:
- Confirms greenfield vs brownfield (user validates your detection)
- Configures project complexity, tech stack, brief level
- Generates `.wds-project-outline.yaml` (enables fast path next time)
- Routes to correct phase (1-7 for greenfield, 8 for brownfield)

**DO NOT** skip Phase 0 and jump to Phase 1 or Phase 8 directly.
Phase 0 takes 3-5 minutes and prevents hours of wrong-path work.

---

## 5. Phase 0 Flow Summary

```
Phase 0: Project Setup
    │
    ├─→ Step 0.1: Welcome & Orientation
    │       ├─→ Introduce WDS briefly
    │       └─→ Confirm: "Greenfield or Brownfield?"
    │           ├─→ [A] Greenfield (your Scenario A detection)
    │           ├─→ [B] Brownfield (your Scenario B detection)
    │           └─→ [C] Not sure (let user override)
    │
    └─→ Step 0.2: Configuration & Structure
            ├─→ Project name
            ├─→ Product complexity (landing/website/app)
            ├─→ Tech stack (optional)
            ├─→ Component library (optional)
            ├─→ Brief level (complete/simplified)
            ├─→ Strategic analysis (full/simplified/skip)
            ├─→ Create folder structure
            └─→ Generate .wds-project-outline.yaml
                    │
                    ├─→ Greenfield → Phase 1: Project Brief
                    └─→ Brownfield → Phase 8: Product Evolution
```

---

## 6. Example: Saga Detecting New Project

```
📚 Saga - WDS Analyst

Complete Project Analysis:

📁 Project: kalla-fordonservice (from folder name)
🔧 Tech Stack: Not yet defined
📂 Structure: Empty repository

WDS Documentation Status:
└─ No docs/ folder found
└─ No .wds-project-outline.yaml found

Project Status: Brand new repository
├─ Configuration: None
├─ README: None
└─ Status: Ready for WDS setup

🚀 **This is a GREENFIELD project!**

Before we dive into design work, let's set up your project properly.
This takes 3-5 minutes and ensures you follow the right workflow.

---

**Phase 0: Project Setup**

Welcome to Whiteport Design Studio (WDS)!

WDS is a design methodology that helps you create great digital products
through structured workflows.

**What type of project is this?**

[A] NEW Product (Greenfield)
    You're building something from scratch.
    → Leads to Phase 1: Project Brief

[B] EXISTING Product (Brownfield)
    You're improving something that exists.
    → Leads to Phase 8: Product Evolution

[C] NOT SURE
    → We'll analyze together

Your choice (A, B, or C):
```

---

## After Phase 0 Completes

Once `.wds-project-outline.yaml` is generated:
- Future agent activations use **fast path** (<5 seconds)
- Project configuration is preserved
- Correct workflow is pre-determined

**Activation complete** - User is now in Phase 1 or Phase 8.

---

**Total time: 3-5 minutes** (Phase 0 setup)
**Future activations: <5 seconds** (outline exists)
