# Empty Project Analysis

**You were routed here because**: Docs folder exists but is empty  
**Analysis type**: Complete project scan

---

## What to Do

Even though docs/ is empty, perform a complete analysis of what exists.

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

## 3. Assess Your Domain

**Filter by YOUR agent's domain**:

- **Saga**: Look for business docs, research, strategy
- **Freya**: Look for design files, prototypes, UI code
- **Idunn**: Look for architecture, API specs, technical docs

---

## 4. Present Complete Status Report

**Format**:

```
🎨 [Your Agent Name]

Complete Project Analysis:

📁 Project: [Name from package.json or folder]
🔧 Tech Stack: [List key technologies]
📂 Structure: [Describe what folders exist]

Design Documentation Status:
├─ docs/ folder: Empty (no WDS structure set up)
├─ Implementation: [X] files in app/ directory
└─ Status: Project has code but no design documentation

[If code exists in your domain - be specific]:
Implementation found (no specifications):
├─ [File/feature 1]
├─ [File/feature 2]
└─ [File/feature 3]

💡 Observation:
This project has [implementation/config/setup] but hasn't started the WDS design process yet.

Recommended Next Steps:
1. Set up WDS documentation structure (docs/ folders)
2. Create Product Brief to document vision and strategy
3. Document existing implementation (if any)
4. [Specific suggestion based on what you found]

**Saga WDS Analyst Agent** specializes in setting up project structure
and creating Product Briefs. Would you like me to hand over to Saga?
```

---

## 5. Example Output (Freya analyzing Dog Week)

```
🎨 Freya WDS Designer Agent

Complete Project Analysis:

📁 Project: Dog Week
🔧 Tech Stack: Next.js 14, React, TypeScript, Tailwind, shadcn/ui, Supabase
📂 Structure: Next.js app directory structure

Design Documentation Status:
├─ docs/ folder: Empty (no WDS structure set up)
├─ Implementation: 47 files in app/ directory
└─ Status: Significant implementation exists without specifications

Implementation found (no specifications):
├─ Authentication flow (Supabase auth)
├─ Profile setup pages
├─ Family management features
├─ Calendar booking system
└─ Component library (shadcn/ui)

💡 Observation:
This is an active project with substantial implementation, but no design
documentation. The app appears to be a family dog care coordination tool.

Recommended Next Steps:
1. Document existing implementation with specifications
2. Create Product Brief to capture current vision
3. Set up scenario documentation for implemented features
4. Define what's been built vs what's planned

**Saga WDS Analyst Agent** specializes in setting up project structure
and creating Product Briefs. Would you like me to hand over to Saga?

Alternatively, I can help you:
- Document existing UI patterns
- Create specifications for implemented features
- Define design system based on current code
```

---

## After User Responds

**If task in YOUR domain**: Continue in same conversation  
**If task in ANOTHER domain**: Use `../agent-handoff-guide.md`

---

**Total time: 15-20 seconds** (scanning code takes time)
