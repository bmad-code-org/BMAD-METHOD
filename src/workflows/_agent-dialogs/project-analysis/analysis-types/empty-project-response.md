# Empty Project Analysis

**You were routed here because**: Docs folder exists but is empty
**Analysis type**: Complete project scan + Phase 0 setup

---

## What to Do

The docs/ folder exists but is empty. This means either:
- Someone started WDS setup but didn't complete it
- The folder was created manually or by a template

Perform a complete analysis, then **route to Phase 0 to complete setup**.

---

## 1. Scan Attached Repos

**Check ALL repos attached to IDE** (exclude WDS, BMAD, WPS2C):

For each project repo:

- **Project name**: Extract from package.json, folder name, or README
- **Tech stack**: Check package.json dependencies, frameworks
- **Folder structure**: Check for app/, src/, components/, etc.
- **Implementation status**: Any code implemented?

---

## 2. Check Project State

**Docs folder**: Empty (confirmed)

**Other folders** to check:

- `app/` or `src/`: Code implementation exists?
- `package.json`: Tech stack, dependencies
- `README.md`: Project description
- `.git/`: Repo initialized?
- `tsconfig.json`, `tailwind.config.js`, etc.: Tech configuration

---

## 3. Determine Project Type

**Scenario A**: Empty docs + No code = GREENFIELD

- Ready for fresh WDS setup
- Will follow Phase 1-7

**Scenario B**: Empty docs + Code exists = BROWNFIELD

- Has implementation without documentation
- Will follow Phase 8 (Kaizen approach)

---

## 4. Present Analysis & Route to Phase 0

**Format**:

```
[Your Agent Icon] [Your Agent Name]

Complete Project Analysis:

📁 Project: [Name from package.json or folder]
🔧 Tech Stack: [List key technologies or "Not yet defined"]
📂 Structure: [Describe what folders exist]

WDS Documentation Status:
├─ docs/ folder: Empty (WDS setup incomplete)
├─ .wds-project-outline.yaml: Not found
└─ Status: Ready to complete WDS setup

---

[SCENARIO A - Empty docs + No code]:

Project Status: GREENFIELD - Ready for WDS setup
├─ Code: None
├─ Configuration: [List any config files]
└─ Status: Fresh start

🚀 **This is a GREENFIELD project!**

The docs/ folder exists but is empty. Let's complete the setup properly.
This takes 3-5 minutes and ensures you follow the right workflow.

→ **Starting Phase 0: Project Setup**

---

[SCENARIO B - Empty docs + Code exists]:

Project Status: BROWNFIELD - Implementation exists, no documentation
├─ Implementation: [X] files in [app/src/] directory
├─ Tech Stack: [List detected technologies]
└─ Status: Code without specifications

Implementation found:
├─ [Feature/file 1]
├─ [Feature/file 2]
└─ [Feature/file 3]

⚠️ **This is a BROWNFIELD project!**

You have existing code but no WDS documentation.
Phase 0 will set up the right workflow (Phase 8 for improvements).

→ **Starting Phase 0: Project Setup**
```

---

## 5. Execute Phase 0

**CRITICAL**: After presenting the analysis, immediately load and execute Phase 0.

**Load**: `{project-root}/_bmad/wds/workflows/0-project-setup/steps/step-01-welcome.md`

**Why Phase 0 first**:
- Confirms greenfield vs brownfield (user validates your detection)
- Configures project complexity, tech stack, brief level
- Generates `.wds-project-outline.yaml` (enables fast path next time)
- Creates proper folder structure inside docs/
- Routes to correct phase (1-7 for greenfield, 8 for brownfield)

**DO NOT** skip Phase 0 and jump to Phase 1 or Phase 8 directly.
Phase 0 takes 3-5 minutes and prevents hours of wrong-path work.

---

## 6. Example Output (Freya analyzing Dog Week with empty docs/)

```
🎨 Freya WDS Designer Agent

Complete Project Analysis:

📁 Project: Dog Week
🔧 Tech Stack: Next.js 14, React, TypeScript, Tailwind, shadcn/ui, Supabase
📂 Structure: Next.js app directory structure

WDS Documentation Status:
├─ docs/ folder: Empty (WDS setup incomplete)
├─ .wds-project-outline.yaml: Not found
└─ Status: Ready to complete WDS setup

Project Status: BROWNFIELD - Implementation exists, no documentation
├─ Implementation: 47 files in app/ directory
├─ Tech Stack: Modern Next.js setup with Supabase
└─ Status: Significant code without specifications

Implementation found:
├─ Authentication flow (Supabase auth)
├─ Profile setup pages
├─ Family management features
├─ Calendar booking system
└─ Component library (shadcn/ui)

⚠️ **This is a BROWNFIELD project!**

You have existing code but no WDS documentation.
Phase 0 will set up the right workflow (Phase 8 for improvements).

---

**Phase 0: Project Setup**

Welcome to Whiteport Design Studio (WDS)!

I detected existing code in your project. Let me confirm:

**What type of project is this?**

[A] NEW Product (Greenfield)
    You're starting fresh, ignore the existing code.
    → Leads to Phase 1: Project Brief

[B] EXISTING Product (Brownfield) ← Recommended based on scan
    You're improving what exists.
    → Leads to Phase 8: Product Evolution

[C] NOT SURE
    → We'll analyze together

Your choice (A, B, or C):
```

---

## 7. After Phase 0 Completes

Once `.wds-project-outline.yaml` is generated:
- docs/ folder populated with correct structure
- Future agent activations use **fast path** (<5 seconds)
- Project configuration is preserved
- Correct workflow is pre-determined

**Activation complete** - User is now in Phase 1 or Phase 8.

---

**Total time: 3-5 minutes** (Phase 0 setup)
**Future activations: <5 seconds** (outline exists)
