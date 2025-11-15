# Quick Start: BMAD in Claude Code Web (Use Your $250 Today!)

## 🚀 Get Started in 30 Minutes

This guide gets you up and running with BMAD agents in Claude Code web **right now**. No complex setup, just copy-paste and go.

---

## What You'll Build

By the end of this guide, you'll have:

✅ 3 BMAD agents running in Claude Code web Projects
✅ A complete workflow (Planning → Architecture → Implementation)
✅ Templates and workflows ready to use
✅ A real project to test with

**Cost:** ~$5-10 to test, then use remaining $240+ for real projects

---

## Prerequisites

- Claude Code web account (you have this!)
- $250 in credits (you have this!)
- This repo cloned locally (for copying agent definitions)

---

## Step 1: Create Your First Agent (Product Manager) - 10 mins

### 1.1 Create a New Claude Code Web Project

1. Go to Claude Code web
2. Click "New Project" (or equivalent in the web UI)
3. Name it: **"BMad Product Manager"**

### 1.2 Add Agent Instructions

Copy the contents of `claude-web-examples/PM-Project-Instructions.md` into the Project's custom instructions field.

**Or copy this directly:**

```markdown
# BMad Product Manager

## Persona
Role: Investigative Product Strategist + Market-Savvy PM
Identity: Product management veteran with 8+ years launching B2B and consumer products
Communication Style: Direct and analytical. Ask WHY relentlessly.

## Principles
1. Uncover the deeper WHY behind every requirement
2. Ruthless prioritization to achieve MVP goals
3. Proactively identify risks
4. Align efforts with measurable business impact

## Available Workflows
1. *create-prd - Create Product Requirements Document
2. *create-epics-and-stories - Break PRD into implementable stories
3. *tech-spec - Create lightweight spec for small projects
4. *validate-prd - Check PRD completeness

## How to Use
Trigger workflows by typing:
- "*create-prd" or "Run the PRD workflow"
- Or just ask naturally: "Help me create a PRD for my SaaS app"
```

### 1.3 Upload Workflow Templates

Upload these files to the Project (find them in the repo):

1. **PRD Template**: `src/modules/bmm/workflows/2-plan-workflows/prd/template.md`
2. **Project Types**: `src/modules/bmm/workflows/2-plan-workflows/prd/data/project-types.csv`

**How to upload:**
- In the Project, look for "Add files" or "Knowledge base"
- Upload both files

### 1.4 Test It!

Start a conversation in the "BMad Product Manager" Project:

```
Hi! I want to build a simple task management app for small teams.
Run the PRD workflow.
```

**Expected result:**
- Agent asks WHY questions
- Probes for user needs, market, goals
- Starts generating PRD sections
- **Cost:** ~$2-5

---

## Step 2: Create Your Second Agent (Architect) - 10 mins

### 2.1 Create Another Project

Name it: **"BMad Architect"**

### 2.2 Add Agent Instructions

```markdown
# BMad Architect

## Persona
Role: Solutions Architect + Technical Strategist
Identity: 12+ years designing scalable systems, cloud-native expert
Communication Style: Systems thinker. Questions assumptions. Risk-aware.

## Principles
1. Design for failure - systems will break
2. Simplicity over cleverness
3. Align architecture with business constraints
4. Document decisions with rationale

## Available Workflows
1. *architecture - Create technical architecture document
2. *validate-architecture - Check architecture completeness
3. *tech-decision - Make architectural decision records

## How to Use
Provide the PRD and ask:
- "*architecture" or "Design the architecture"
- Or: "I have a PRD, help me design the system"
```

### 2.3 Upload Workflow Templates

Upload these files:

1. **Architecture Template**: `src/modules/bmm/workflows/3-solutioning/architecture/template.md`

### 2.4 Test It!

In the "BMad Architect" Project:

```
I have a PRD for a task management app. Design the architecture.

[Paste the PRD you generated in Step 1]
```

**Expected result:**
- Agent analyzes requirements
- Proposes tech stack
- Designs system components
- Creates architecture doc
- **Cost:** ~$3-8

---

## Step 3: Create Your Third Agent (Developer) - 10 mins

### 3.1 Create Another Project

Name it: **"BMad Developer"**

### 3.2 Add Agent Instructions

```markdown
# BMad Developer

## Persona
Role: Full-Stack Developer + Code Quality Expert
Identity: 7+ years building production systems, TDD advocate
Communication Style: Pragmatic. Values working code. Test-driven.

## Principles
1. Working software over comprehensive documentation
2. Test-driven development
3. Clean code that others can maintain
4. Ship incrementally, iterate based on feedback

## Available Workflows
1. *dev-story - Implement a user story
2. *code-review - Review code for quality
3. *debug - Debug and fix issues
4. *refactor - Improve code structure

## How to Use
Provide the PRD, architecture, and story:
- "*dev-story" or "Implement story #5"
- Or: "Help me build the user authentication feature"
```

### 3.3 Upload Workflow Templates

Upload these files:

1. **Story Template**: `src/modules/bmm/workflows/4-implementation/dev-story/story-template.md`

### 3.4 Test It!

In the "BMad Developer" Project:

```
Implement the user registration feature.

PRD: [paste relevant section]
Architecture: [paste relevant section]

Technology: TypeScript + React + Node.js + PostgreSQL
```

**Expected result:**
- Agent analyzes requirements
- Generates code (frontend + backend)
- Includes tests
- Provides implementation steps
- **Cost:** ~$2-5

---

## Step 4: Run a Complete Workflow (Test All 3 Agents)

### Scenario: Build a "Quick Notes" App

**Goal:** Create a simple note-taking app to test your BMAD setup

### 4.1 Planning (Product Manager Project)

**Prompt:**
```
I want to build a "Quick Notes" web app.

Features:
- Create/edit/delete notes
- Simple markdown support
- Tag notes
- Search notes

Target: Personal use, single user (for now)
Timeline: 2 weeks
Tech: TypeScript + React

Run *create-prd
```

**What to expect:**
- 10-15 questions from PM
- PRD generation (~15-20 min)
- **Cost:** ~$3-5

**Save the output:** Copy PRD to a file: `docs/quick-notes-prd.md`

### 4.2 Architecture (Architect Project)

**Prompt:**
```
Design architecture for the Quick Notes app.

[Paste the PRD]
```

**What to expect:**
- Tech stack recommendation
- System architecture diagram (text)
- Data model design
- API design
- **Cost:** ~$4-8

**Save the output:** Copy to `docs/quick-notes-architecture.md`

### 4.3 Break Down Stories (Product Manager Project)

**Prompt:**
```
Create epics and stories for Quick Notes.

[Paste the PRD]
```

**What to expect:**
- 3-5 epics
- 15-25 user stories
- Prioritization
- **Cost:** ~$2-4

**Save the output:** Copy to `docs/quick-notes-stories.md`

### 4.4 Implement First Story (Developer Project)

**Prompt:**
```
Implement Story #1: User can create a new note

PRD: [paste relevant section]
Architecture: [paste relevant section]
Tech: TypeScript + React + Node.js + SQLite

Generate:
1. Frontend component (React)
2. Backend API (Node.js)
3. Database schema
4. Tests
```

**What to expect:**
- Complete code for frontend
- Backend API endpoint
- Database migration
- Unit tests
- **Cost:** ~$3-6

**Total cost for full workflow:** ~$12-23

---

## Step 5: Optimize Your Setup (Bonus)

### 5.1 Create a "Workflow Status" Document

Create a simple file to track project phase:

**`docs/workflow-status.yaml`**
```yaml
project: quick-notes
current_phase: implementation
completed:
  - analysis
  - planning
  - architecture

artifacts:
  prd: docs/quick-notes-prd.md
  architecture: docs/quick-notes-architecture.md
  stories: docs/quick-notes-stories.md

next_actions:
  - Implement remaining stories
  - Test end-to-end
  - Deploy MVP
```

Include this in each Project conversation to maintain context.

### 5.2 Create Project Shortcuts

For each Project, create a "starter prompt" file:

**PM Project - `pm-starter.md`:**
```markdown
## Quick Commands

**New PRD:**
"Create a PRD for [project description]"

**Update PRD:**
"Update the PRD with these changes: [changes]"

**Create Stories:**
"Break down the PRD into epics and stories"

**Validate:**
"Validate the PRD for completeness"
```

Paste this at the start of each conversation for quick reference.

### 5.3 Set Up a Project Folder Structure

Organize your outputs:

```
quick-notes/
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── epics/
│   │   ├── note-management.md
│   │   ├── search.md
│   │   └── tags.md
│   └── workflow-status.yaml
├── src/
│   ├── frontend/
│   ├── backend/
│   └── database/
└── README.md
```

---

## Cost Estimates: How Far Will $250 Go?

### Scenario A: Multiple Small Projects (5-10 projects)
- **Per project:** PRD + Architecture + 10 stories
- **Cost per project:** ~$25-35
- **Total projects:** 7-10 projects

### Scenario B: One Large Project
- **PRD + Architecture:** ~$15
- **100 stories @ $3 each:** ~$300 (over budget)
- **Solution:** Do planning in web ($15), switch to local IDE for stories

### Scenario C: Hybrid Approach (Recommended)
- **Planning in web:** PRD + Architecture + Story breakdown (~$20 per project)
- **Implementation in local IDE:** Free (uses your local resources)
- **Total projects:** 10-12 projects planned, unlimited implementation

**Recommendation:** Use your $250 for **planning and architecture only**. Install BMAD locally (free) for implementation.

---

## Next Steps

### This Week:
1. ✅ Complete Step 1-4 above (create 3 agents)
2. ✅ Run Quick Notes workflow end-to-end
3. ✅ Track costs (note how much each phase costs)
4. 📊 Evaluate: Is this working for your needs?

### Next Week:
1. 🔧 Install BMAD locally: `npx bmad-method@alpha install`
2. 🔄 Test hybrid approach: Plan in web, implement locally
3. 📝 Document your learnings
4. 🤝 Share feedback in BMAD Discord

### Next Month:
1. 🚀 Build a real project using BMAD
2. 🛠️ Consider contributing a Claude Web bundler to BMAD
3. 📚 Read the full BMAD docs to unlock advanced features
4. 💬 Help others get started in the community

---

## Troubleshooting

### Issue: "Agent isn't following the persona"
**Solution:** Make the persona section more explicit in the Project instructions. Add examples of how the agent should behave.

### Issue: "Workflows aren't structured"
**Solution:** Upload the workflow template files. The agent needs to see the output format.

### Issue: "Costs are too high"
**Solution:**
- Be more specific in prompts (reduces back-and-forth)
- Use shorter contexts (don't paste entire 50-page PRDs)
- Switch to local IDE for implementation

### Issue: "Can't switch between agents easily"
**Solution:** This is a limitation of Claude Code web. Workflow:
1. Complete phase in one Project
2. Copy output to a file
3. Open next Project
4. Paste output as context
5. Continue workflow

### Issue: "Agent forgot context"
**Solution:** Claude Code web Projects should maintain context. If not:
- Re-paste critical artifacts (PRD, architecture)
- Reference uploaded files explicitly
- Keep conversations focused on one workflow at a time

---

## Resources

- **Full Implementation Guide:** `CLAUDE_CODE_WEB_IMPLEMENTATION.md`
- **Best Practices:** `BEST_PRACTICES_SUMMARY.md`
- **PM Project Instructions:** `claude-web-examples/PM-Project-Instructions.md`
- **BMAD Discord:** https://discord.gg/gk8jAdXWmj
- **BMAD Repo:** https://github.com/bmad-code-org/BMAD-METHOD

---

## Feedback & Contribution

**Found this helpful?**
- ⭐ Star the BMAD repo
- 💬 Share your experience in Discord
- 📝 Contribute improvements to this guide

**Want to contribute a Claude Web bundler?**
- Check `CONTRIBUTING.md`
- Post in Discord #general-dev
- Submit a PR with your bundler

---

## Summary

You now have:

✅ **3 BMAD agents** running in Claude Code web
✅ **Complete workflow** from planning to implementation
✅ **Cost understanding** ($250 budget planning)
✅ **Real project template** (Quick Notes example)
✅ **Next steps** to go deeper

**Time invested:** 30 minutes
**Value unlocked:** Structured AI collaboration for your projects

Now go build something amazing! 🚀

---

*Questions? Post in BMAD Discord or create a GitHub issue.*
