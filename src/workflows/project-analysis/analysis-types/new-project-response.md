# New Project Analysis

**You were routed here because**: No docs folder exists at all  
**Analysis type**: Complete project scan

---

## What to Do

No docs/ folder means either brand new project or non-WDS project. Perform complete analysis of what exists.

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

**Scenario A**: Completely empty repo

- Just .git/ and maybe README
- Brand new project

**Scenario B**: Code exists, no WDS docs

- Has app/, src/, components/
- Active development without WDS methodology

**Scenario C**: Non-WDS documentation exists

- Has docs/ but different structure
- Using different methodology

---

## 3. Assess Your Domain

**Filter by YOUR agent's domain**:

- **Saga**: Look for business docs, research, strategy files
- **Freya**: Look for design files, prototypes, UI code, Figma links
- **Idunn**: Look for architecture docs, API specs, technical specs

---

## 4. Present Complete Status Report

**Format**:

```
🎨 [Your Agent Name]

Complete Project Analysis:

📁 Project: [Name]
🔧 Tech Stack: [List or "Not yet defined"]
📂 Structure: [Describe what exists]

WDS Documentation Status:
└─ No docs/ folder found

[SCENARIO A - Empty Project]:
Project Status: Brand new repository
├─ Configuration: [package.json, tsconfig, etc. exist?]
├─ README: [Exists? Contains what?]
└─ Status: Ready for setup

Recommended Next Steps:
1. Set up WDS project structure (docs/ with phases)
2. Create Product Brief to define vision
3. Set up technology stack
4. Begin Phase 1 work

**Saga WDS Analyst Agent** specializes in project setup and Product Briefs.
Would you like me to hand over to Saga to get started?

---

[SCENARIO B - Code Without Docs]:
Project Status: BROWNFIELD - Existing product, no WDS documentation
├─ Implementation: [X] files in [app/src/] directory
├─ Tech Stack: [List detected technologies]
└─ Status: Ready for Phase 8 entry

Implementation found:
├─ [Feature/file 1]
├─ [Feature/file 2]
└─ [Feature/file 3]

⚠️ IMPORTANT: This is a BROWNFIELD project!

You have existing code. DO NOT start with Phase 1-3.
Those phases are for NEW products (greenfield).

✅ Recommended Path: **Phase 8 - Existing Product Entry**

Phase 8 uses the Kaizen (改善) approach:
├─ Create Limited Brief (document what exists)
├─ Identify specific improvements
├─ Design focused updates (not complete redesigns)
├─ Implement incrementally
└─ Monitor and iterate

Next Steps:
1. Create docs/ folder with brownfield structure
2. Create Limited Brief (what exists + what you want to change)
3. Identify your first improvement opportunity
4. Begin Phase 8.1

**Options:**

[A] Set up brownfield structure now
    → Creates docs/ with Phase 8 templates
    → Guides you through Limited Brief

[B] Tell me what you want to improve
    → Skip straight to improvement design
    → I'll help document as we go

[C] Hand off to Saga for Limited Brief
    → Saga specializes in strategic documentation
    → Will reverse-engineer your product brief

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

💡 Options:
1. Migrate to WDS v6 methodology
2. Continue with current approach (I'll adapt)
3. Set up custom WDS hybrid

Which would you prefer?
```

---

## 5. Example Output (Freya analyzing unknown repo)

```
🎨 Freya WDS Designer Agent

Complete Project Analysis:

📁 Project: My Awesome App (from package.json)
🔧 Tech Stack: React 18, Vite, TypeScript, Styled Components
📂 Structure: Standard Vite project structure

WDS Documentation Status:
└─ No docs/ folder found

Project Status: Active development, no WDS documentation
├─ Implementation: 23 component files
├─ Tech Stack: Modern React setup
└─ Status: Reverse-document recommended

Implementation found:
├─ src/components/ - 15 UI components
├─ src/pages/ - 4 page components
├─ src/assets/ - Design assets and images
└─ src/hooks/ - Custom React hooks

💡 Observation:
This is an active React project with component-based architecture,
but no design specifications or documentation.

Recommended Next Steps:
1. Create docs/ folder with WDS structure
2. Reverse-engineer Product Brief
3. Document existing components as design system
4. Create scenarios for existing pages

**Saga WDS Analyst Agent** can help reverse-document your project
and create a Product Brief based on what exists.

Would you like me to hand over to Saga?

Alternatively, I can help you:
- Audit existing components for design system
- Document UI patterns currently in use
- Create specifications for existing pages
```

---

## After User Responds

**If task in YOUR domain**: Continue in same conversation  
**If task in ANOTHER domain**: Use `../agent-handoff-guide.md`

---

**Total time: 15-25 seconds** (depends on project size)
