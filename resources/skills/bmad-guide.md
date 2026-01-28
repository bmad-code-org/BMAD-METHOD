# BMAD Method Guide - Process Navigation & Workflow Selection

You are working within the **BMAD Method (BMM)** - a 4-phase AI-powered agile development framework. This guide helps you stay on track and use the correct workflows.

## 🚨 CRITICAL RULES

1. **NEVER skip phases** - Each phase builds on the previous (except Phase 1 which is optional)
2. **ALWAYS check project level** - This determines which workflows to use
3. **ALWAYS use workflows** - Don't implement features manually without BMAD workflows
4. **ALWAYS consult workflow docs** - Located in `src/bmm/workflows/`
5. **STAY IN PHASE** - Complete current phase before moving to next

---

## 📍 WHERE AM I? - Quick Phase Check

### Phase 0: Brownfield Documentation
**You're here if:** Working with existing codebase that needs documentation
**Workflow:** `document-project`
**Next:** Phase 2 (skip Phase 1)

### Phase 1: Analysis (Optional)
**You're here if:** Need strategic exploration, research, or vision definition
**Workflows:**
- `brainstorm-project` - Explore multiple solution approaches
- `research` - Market/technical/competitive research
- `create-product-brief` - Define product vision

**Next:** Phase 2 (Planning)

### Phase 2: Planning (REQUIRED)
**You're here if:** Need to define requirements and scope
**Workflows:**
- **Level 0-1:** `bmad-quick-flow/create-tech-spec` (quick technical spec)
- **Level 2+:** `2-plan-workflows/prd` (full Product Requirements Document)
- **Optional:** `create-ux-design` (UX/UI specification - after PRD)

**Next:**
- Level 0-1: Skip to Phase 4 (Implementation)
- Level 2: Phase 4 if simple, Phase 3 if needs architecture
- Level 3-4: Phase 3 (Solutioning)

### Phase 3: Solutioning (Conditional)
**You're here if:** Need architectural decisions and epic breakdown
**Workflows:**
1. `create-architecture` - Make architectural decisions
2. `create-epics-and-stories` - Break requirements into implementable stories
3. `check-implementation-readiness` - Gate check validation

**Next:** Phase 4 (Implementation)

### Phase 4: Implementation (REQUIRED)
**You're here if:** Ready to implement stories
**Core Loop:**
1. `sprint-planning` (once) - Initialize sprint tracking
2. **For each story:**
   - `create-story` - Create individual story
   - `dev-story` or `super-dev-story` - Implement with tests
   - `code-review` - Quality review
   - Mark story as DONE
3. `retrospective` (per epic) - Review and extract lessons
4. `push-all` - Stage & push all changes when ready

**Advanced/Automated:**
- `autonomous-epic` - Fully automated epic completion
- `super-dev-story` - Enhanced dev with pre/post validation
- `gap-analysis` - Validate story against codebase
- `create-story-with-gap-analysis` - Combined create + validate

---

## 🎯 PROJECT LEVEL DETECTION

**ALWAYS determine project level first** to route to correct planning track:

| Level | Name | Stories | Detection Keywords | Planning Track |
|-------|------|---------|-------------------|----------------|
| **0** | Atomic | 1 | "bug", "fix", "typo", "update", "quick" | Tech spec only |
| **1** | Small | 1-10 | "small feature", "add button", "simple" | Tech spec only |
| **2** | Medium | 5-15 | "feature", "module", "component" | PRD (skip arch) |
| **3** | Complex | 12-40 | "system", "integration", "api", "architecture" | PRD + Architecture |
| **4** | Enterprise | 40+ | "platform", "enterprise", "multiple products" | PRD + Architecture |

**How to detect:**
```bash
# Use workflow-init to automatically detect level
/workflow-init
```

---

## 🔍 WORKFLOW DECISION TREE

```
┌─ START: What do you need to do?
│
├─ "I need to explore solutions" → Phase 1: brainstorm-project
│
├─ "I need requirements"
│  ├─ Level 0-1? → Phase 2: bmad-quick-flow/create-tech-spec
│  └─ Level 2+? → Phase 2: 2-plan-workflows/prd
│
├─ "I have PRD, need architecture" → Phase 3: create-architecture
│
├─ "I have PRD, need stories" → Phase 3: create-epics-and-stories
│
├─ "I'm ready to implement"
│  ├─ First time? → sprint-planning (initialize)
│  ├─ Need new story? → create-story
│  ├─ Implement story? → dev-story or super-dev-story
│  ├─ Automate epic? → autonomous-epic
│  └─ Review story? → code-review
│
└─ "Epic is done" → retrospective
```

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ DON'T:
1. **Skip Phase 2** - Requirements are ALWAYS required
2. **Jump to coding** without workflows
3. **Create architecture for Level 0-2** projects (overkill)
4. **Skip sprint-planning** before dev-story
5. **Mix phases** - finish current phase first
6. **Implement manually** - use dev-story/super-dev-story
7. **Forget retrospectives** - extract lessons after each epic

### ✅ DO:
1. **Check phase progression** - Am I in the right phase?
2. **Consult workflow docs** - Read the .md files in workflows/
3. **Use workflow-init** - Let BMAD detect level
4. **Follow story lifecycle** - create → dev → review → done
5. **One story at a time** - Complete before moving to next
6. **Use autonomous-epic** - For efficient bulk processing
7. **Validate with gap-analysis** - Before and after development

---

## 📚 HOW TO LOOK UP WORKFLOW INFO

### Method 1: Read Workflow Documentation
```bash
# Read workflow guide for current phase
cat src/bmm/workflows/README.md
cat src/bmm/docs/workflows-{phase}.md

# Example: Planning phase
cat src/bmm/docs/workflows-planning.md

# Example: Implementation phase
cat src/bmm/docs/workflows-implementation.md
```

### Method 2: Read Specific Workflow
```bash
# Read workflow details
cat src/bmm/workflows/{phase}/{workflow-name}/README.md

# Example: PRD workflow
cat src/bmm/workflows/2-plan-workflows/prd/README.md

# Example: Dev story workflow
cat src/bmm/workflows/4-implementation/dev-story/README.md
```

### Method 3: Check Workflow Configuration
```bash
# See workflow config
cat src/bmm/workflows/{phase}/{workflow-name}/workflow.yaml
```

### Method 4: Use Explore Agent
```
Use Task tool with subagent_type=Explore to search for workflow info:
"Find documentation about {workflow-name} in BMAD workflows"
```

---

## 🎬 TYPICAL PROJECT FLOWS

### Small Change (Level 0-1)
```
tech-spec → dev-story → code-review → done
```

### Medium Feature (Level 2)
```
prd → [optional: create-ux-design] → create-epics-and-stories
→ sprint-planning → (create-story → dev-story → code-review)* → retrospective
```

### Complex System (Level 3-4)
```
[optional: brainstorm/research] → prd → [optional: create-ux-design]
→ create-architecture → create-epics-and-stories → check-implementation-readiness
→ sprint-planning → (create-story → super-dev-story)* → retrospective
```

### Automated Epic Processing (Any Level)
```
[Phase 2-3 complete] → sprint-planning → autonomous-epic {epic_number}
→ (auto: create-story → super-dev-story → commit)* → retrospective
```

---

## 🚀 WORKFLOW EXECUTION PATTERNS

### Pattern 1: Step-File Workflows (PRD, Architecture, Epics)
- **Sequential execution** - Can't skip steps
- **One step at a time** - Load step file, execute, move to next
- **User approval gates** - Wait for approval between steps
- **Append-only building** - Never overwrite previous sections
- **State tracking** - Uses frontmatter `stepsCompleted` array

**Example:**
```
step-01-init.md → step-02-discovery.md → step-03-requirements.md → ...
```

### Pattern 2: YAML Configuration Workflows (Dev, Review, Sprint)
- **Full config in workflow.yaml**
- **Auto-discovery** - Finds story files automatically
- **System execution** - Agent-driven, not user-interactive
- **Config inheritance** - Reads from project config

---

## 🔧 ADVANCED FEATURES

### Autonomous Epic Processing
**When to use:** Want to automate entire epic completion
```bash
# After sprint-planning, automate all stories in epic
/autonomous-epic 2
```

**What it does:**
- Creates story → Develops with super-dev-story → Commits → Repeat
- Includes pre/post gap analysis
- Includes code review
- Creates git commit per story
- Continues on failures (configurable)

### Super-Dev-Story
**When to use:** Want enhanced development with validation
```bash
# Instead of dev-story, use super-dev-story
/super-dev-story
```

**What it does:**
- Pre-dev gap analysis (validate story before coding)
- Implement with tests
- Post-dev gap analysis (validate implementation)
- Built-in code review
- Fail-on-critical-issues (auto-fix loops)

### Gap Analysis
**When to use:** Validate story against actual codebase
```bash
# Standalone validation
/gap-analysis
```

**What it checks:**
- Missing infrastructure before implementation
- Implementation matches story requirements
- All tasks from story are actually completed

---

## 📋 WORKFLOW STATUS & TRACKING

### Check Current Status
```bash
# View sprint status
cat {project-root}/_bmad/bmm/implementation/sprint-status.yaml

# View workflow status
cat {project-root}/_bmad/bmm/workflow-status.yaml
```

### Story States
- `TODO` - Not started
- `IN PROGRESS` - Currently being developed
- `READY FOR REVIEW` - Implemented, needs review
- `DONE` - Complete and reviewed

---

## 🎯 WHEN TO USE EACH WORKFLOW - QUICK REFERENCE

| I need to... | Use this workflow | Phase |
|-------------|-------------------|-------|
| Explore solutions | brainstorm-project | 1 |
| Research market/tech | research | 1 |
| Define product vision | create-product-brief | 1 |
| Write requirements (quick) | bmad-quick-flow/create-tech-spec | 2 |
| Write requirements (full) | 2-plan-workflows/prd | 2 |
| Design UX/UI | create-ux-design | 2 |
| Make architecture decisions | create-architecture | 3 |
| Break into stories | create-epics-and-stories | 3 |
| Validate readiness | check-implementation-readiness | 3 |
| Start sprint | sprint-planning | 4 |
| Create individual story | create-story | 4 |
| Implement story | dev-story or super-dev-story | 4 |
| Automate epic | autonomous-epic | 4 |
| Validate against code | gap-analysis | 4 |
| Review quality | code-review | 4 |
| Review epic completion | retrospective | 4 |
| Push changes | push-all | 4 |

---

## 💡 TROUBLESHOOTING

### "I'm not sure which phase I'm in"
→ Check for existing artifacts:
- PRD exists? You're past Phase 2
- Architecture exists? You're past Phase 3
- Sprint-status.yaml exists? You're in Phase 4
- No artifacts? Start with Phase 2 (or Phase 1 if exploring)

### "I'm not sure which workflow to use"
→ Use this guide's decision tree or consult phase-specific docs:
- `workflows-planning.md` - Phase 2 workflows
- `workflows-solutioning.md` - Phase 3 workflows
- `workflows-implementation.md` - Phase 4 workflows

### "Workflow isn't working"
→ Check these:
1. Is config.yaml set up? (project-root/_bmad/bmm/config.yaml)
2. Are you in the right phase?
3. Did you complete prerequisite workflows?
4. Check workflow README for requirements

### "I want to automate everything"
→ Use autonomous-epic after completing Phase 2-3:
```bash
/sprint-planning  # Initialize once
/autonomous-epic 1  # Automate epic 1
/autonomous-epic 2  # Automate epic 2
```

---

## 🎓 KEY PRINCIPLES

1. **Scale-Adaptive** - Same system works for 1 story or 100 stories
2. **Phase-Gated** - Complete phases in order (except Phase 1 optional)
3. **Story-Centric** - Everything revolves around implementing stories
4. **Validation-First** - Gap analysis prevents mismatched implementations
5. **Automation-Friendly** - Can automate entire epics with autonomous workflows
6. **Quality-Built-In** - Code review and retrospectives are mandatory
7. **Documentation-Driven** - Every phase produces artifacts

---

## 📖 ADDITIONAL RESOURCES

### Core Documentation
- `src/bmm/docs/workflows-analysis.md` - Phase 1 guidance
- `src/bmm/docs/workflows-planning.md` - Phase 2 guidance
- `src/bmm/docs/workflows-solutioning.md` - Phase 3 guidance
- `src/bmm/docs/workflows-implementation.md` - Phase 4 guidance
- `src/bmm/docs/scale-adaptive-system.md` - Level detection
- `src/bmm/docs/brownfield-guide.md` - Existing codebases

### Specialized Guides
- `src/bmm/docs/test-architecture.md` - TestArch workflows
- `src/bmm/docs/agents-guide.md` - All 12 specialized agents

---

## ✅ CHECKLIST: Am I Following BMAD?

Before proceeding, check:

- [ ] I know what phase I'm in
- [ ] I know what project level this is (0-4)
- [ ] I've completed prerequisite phases
- [ ] I'm using a workflow (not coding manually)
- [ ] I've read the workflow documentation
- [ ] I'm following the story lifecycle (if Phase 4)
- [ ] I'm validating with gap analysis (if Phase 4)
- [ ] I'm doing code reviews (if Phase 4)
- [ ] I'm completing retrospectives (if finishing epic)

**If any are unchecked, STOP and fix it before proceeding.**

---

## 🚨 EMERGENCY: I Went Off Track

1. **Identify where you are:**
   - Check existing artifacts (PRD? Architecture? Sprint status?)
   - Determine current phase

2. **Determine where you should be:**
   - What was the original request?
   - What phase should that be in?

3. **Course correct:**
   - Use `correct-course` workflow if in Phase 4
   - Otherwise, restart the appropriate workflow for current phase

4. **Prevent future derailment:**
   - Consult this guide before starting work
   - Read workflow docs before executing
   - Use TodoWrite to track workflow steps

---

## 🎯 REMEMBER

**BMAD is a methodology, not a suggestion.**

When in doubt:
1. Check this guide
2. Read workflow documentation
3. Ask the user for clarification
4. Use explore agent to find info

**DO NOT improvise. Follow the process.**
