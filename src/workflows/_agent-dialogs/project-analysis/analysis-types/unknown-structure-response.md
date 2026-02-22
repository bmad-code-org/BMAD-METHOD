# Unknown Structure Analysis

**You were routed here because**: Docs folder exists but doesn't match WDS v6 or WPS2C v4 patterns  
**Analysis type**: Complete project scan with structure analysis

---

## What to Do

Analyze the custom documentation structure and provide complete project assessment.

---

## 1. Scan Attached Repos

**Check ALL repos attached to IDE** (exclude WDS, BMAD, WPS2C):

For each project repo:

- **Project name**: Extract from package.json, folder name, or README
- **Tech stack**: Check package.json dependencies, frameworks
- **Documentation structure**: Analyze docs/ folder pattern
- **Implementation status**: Check code directories

---

## 2. Analyze Custom Docs Structure

**Examine docs/ folder**:

- **Pattern**: Numbered? Lettered? Date-based? Topic-based?
- **Content**: What types of files? (specs, designs, planning)
- **Completeness**: How much documentation exists?
- **Methodology hints**: Can you identify what system they're using?

**Common patterns**:

- Agile/Scrum: sprints/, backlog/, retrospectives/
- Feature-based: features/, requirements/, designs/
- Date-based: 2024-01-project-plan/
- Custom: Unique naming convention

---

## 3. Map to WDS Phases (If Possible)

**Try to map existing docs to WDS phases**:

| Custom Folder  | Possible WDS Phase                     |
| -------------- | -------------------------------------- |
| requirements/  | Phase 1: Project Brief or Phase 3: PRD |
| user-research/ | Phase 2: Trigger Mapping               |
| wireframes/    | Phase 4: UX Design                     |
| design-system/ | Phase 5: Design System                 |
| handoff/       | Phase 6: Design Deliveries             |

---

## 4. Assess Your Domain

**Filter by YOUR agent's domain**:

- **Saga**: Look for business strategy, user research, requirements
- **Freya**: Look for design files, prototypes, UI specs, wireframes
- **Idunn**: Look for technical specs, architecture, API docs

---

## 5. Present Complete Status Report

**Format**:

```
🎨 [Your Agent Name]

Complete Project Analysis:

📁 Project: [Name]
🔧 Tech Stack: [List]
📂 Structure: Custom documentation methodology

Documentation Structure Detected:
├─ docs/
│   ├─ [folder 1]/ - [X] files
│   ├─ [folder 2]/ - [Y] files
│   └─ [folder 3]/ - [Z] files
└─ Pattern: [Describe: topic-based, feature-based, etc.]

Mapping to WDS Phases:
├─ Phase 1 (Project Brief): [Folder name or "Not found"]
├─ Phase 2 (Trigger Map): [Folder name or "Not found"]
├─ Phase 4 (UX Design): [Folder name or "Not found"]
└─ [Other relevant phases]

Content Analysis (Your Domain):
[Focus on content relevant to YOUR agent]
├─ [What exists in your domain]
├─ [Quality/completeness assessment]
└─ [What's missing]

Implementation Status:
├─ Code: [X] files in [directory]
├─ Features: [List implemented features]
└─ Alignment: [Does code match docs?]

💡 Observation:
This project uses a [custom/agile/feature-based] methodology instead of
standard WDS structure. [Your assessment of effectiveness]

Recommended Options:

1. **Continue with current structure**
   - I'll adapt to your methodology
   - You keep your current organization
   - Tell me more about your approach

2. **Migrate to WDS v6 structure**
   - Modern numbered phases (1-8)
   - Better agent integration
   - Systematic workflow
   - Saga WDS Analyst Agent can help migrate

3. **Hybrid approach**
   - Keep your structure
   - Add WDS project outline for agent tracking
   - Best of both worlds

Which approach would you prefer?

[If they choose "continue", ask]:
Please describe your documentation structure so I can adapt:
- What do your folders represent?
- What's your workflow?
- What are you trying to achieve?
```

---

## 6. Example Output (Freya analyzing Agile project)

```
🎨 Freya WDS Designer Agent

Complete Project Analysis:

📁 Project: E-commerce Platform
🔧 Tech Stack: Vue 3, Nuxt, TypeScript, Vuetify
📂 Structure: Agile sprint-based methodology

Documentation Structure Detected:
├─ docs/
│   ├─ sprint-01/ - 8 user stories
│   ├─ sprint-02/ - 12 user stories
│   ├─ backlog/ - 24 items
│   ├─ design-assets/ - 15 Figma links
│   └─ api-specs/ - 6 OpenAPI files
└─ Pattern: Sprint-based Agile workflow

Mapping to WDS Phases:
├─ Phase 1 (Project Brief): Found in /backlog/project-vision.md
├─ Phase 2 (Trigger Map): Not found (user personas scattered in stories)
├─ Phase 4 (UX Design): Found in /design-assets/ and story attachments
├─ Phase 5 (Design System): Found in /design-assets/component-library.fig
└─ Phase 3 (PRD): Found in /api-specs/

Content Analysis (Design Domain):
├─ Wireframes: 12 Figma files linked in design-assets/
├─ User flows: Embedded in individual user stories
├─ Design system: Figma component library exists
└─ Consistency: Good, but scattered across sprints

Implementation Status:
├─ Code: 89 Vue component files
├─ Features: E-commerce core (cart, checkout, product catalog)
└─ Alignment: Design files match sprint implementation well

💡 Observation:
You're running a healthy Agile process with good design documentation,
but design specs are scattered across multiple sprints, making it hard
to get an overview.

Recommended Options:

1. **Continue with Agile structure**
   - I'll work within your sprint model
   - Help create design specs per user story
   - Maintain your current process

2. **Migrate to WDS v6 structure**
   - Consolidate design docs into Phase 4/5
   - Keep sprint planning separate
   - Better design overview
   - **Saga WDS Analyst Agent** can help migrate

3. **Hybrid approach** (Recommended)
   - Keep sprint planning
   - Add docs/4-ux-design/ for consolidated specs
   - Add project outline for agent tracking
   - Best of both: Agile + systematic design docs

Which approach would you prefer?
```

---

## After User Responds

**If "continue with current"**: Ask for explanation of their structure  
**If "migrate to WDS"**: Hand over to Saga WDS Analyst Agent  
**If "hybrid"**: Offer to help set up hybrid structure  
**If task in YOUR domain**: Continue helping  
**If task in ANOTHER domain**: Use `../05-agent-handoff-guide.md`

---

**Total time: 20-35 seconds** (depends on docs complexity)
