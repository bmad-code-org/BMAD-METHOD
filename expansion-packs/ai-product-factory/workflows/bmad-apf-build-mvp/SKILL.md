---
name: bmad-apf-build-mvp
description: Build the MVP by orchestrating implementation tasks through Cursor. Planning stays in BMAD; code execution in Cursor.
---

# Build MVP — AI Product Factory

## Philosophy

**Cursor is the execution engine. BMAD is the orchestration engine.**

This workflow does NOT write all code inline. It:
1. Prepares implementation context from artifacts
2. Breaks work into Cursor-executable tasks
3. Delegates to platform-specific agents
4. Tracks progress against stories

## On Activation

1. Load all upstream artifacts:
   - `{apf_artifacts}/product/epics-and-stories.md`
   - `{apf_artifacts}/engineering/tech-stack.md`
   - `{planning_artifacts}/architecture/`
   - `{apf_artifacts}/design/design-system.md`
   - `{apf_artifacts}/ux/wireframes/`
2. Load kit: `file:{project-root}/expansion-packs/ai-product-factory/kits/{launch_kit}-kit.md`

## Step 1: Project Scaffolding

Based on `{target_platform}`, invoke the appropriate platform agent to scaffold:
- Project structure
- Dependencies
- Configuration files
- Environment setup

Platform routing:
- `flutter` → `bmad-apf-flutter`
- `react-native` → `bmad-apf-react-native`
- `swiftui` → `bmad-apf-swiftui`
- `web` → Cursor with Next.js conventions

## Step 2: Foundation Layer

Implement in order:
1. **Database schema** → `bmad-apf-database`
2. **Authentication** → `bmad-apf-authentication`
3. **Backend API** → `bmad-apf-backend` or `bmad-apf-generate-backend`
4. **Navigation shell** → from UX artifacts

## Step 3: Feature Implementation

For each story in MVP backlog (priority order):
1. Load story + acceptance criteria
2. Prepare Cursor task context (files, AC, design refs)
3. Execute via `bmad-dev-story` (BMM) or direct Cursor implementation
4. Run tests → `bmad-apf-testing`
5. Mark story complete in `{apf_artifacts}/engineering/build-progress.md`

## Step 4: Integrations

- **Payments** → `bmad-apf-payments` (if applicable)
- **Analytics** → `bmad-apf-analytics`
- **Notifications** (if mobile kit)

## Step 5: Quality Gate

Before declaring MVP complete:
- [ ] All MVP stories implemented
- [ ] Tests passing
- [ ] Security audit → `bmad-apf-security`
- [ ] Code review → `bmad-code-review`

## Handoff

- `bmad-apf-deploy-app`
- `bmad-apf-cicd`

Run `{workflow.on_complete}`.
