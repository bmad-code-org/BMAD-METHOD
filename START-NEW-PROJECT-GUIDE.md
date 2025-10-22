# 🚀 BMad Method v6 - Start New Project Guide

**Complete step-by-step guide to use BMad in any new project**

---

## 📋 Prerequisites

✅ BMad v6 Alpha installed (you have this!)
✅ Global commands configured (you have this!)
✅ Claude Code installed

---

## 🎯 Quick Start (3 Steps)

### Step 1: Set Up BMad Workspace
```bash
# Navigate to your project (or create it)
mkdir -p /Users/hbl/Documents/your-project
cd /Users/hbl/Documents/your-project

# Set up BMad workspace
bmad-init $(pwd)
```

**What this does:**
- Creates `.bmad/` folder structure
- Links to central BMad installation
- Configures project-specific settings

### Step 2: Open in Claude Code
```bash
cd /Users/hbl/Documents/your-project
claude-code .
```

### Step 3: Start Planning
In Claude Code, type `/` and select:
```
/bmad:bmm:workflows:plan-project
```

That's it! BMad will guide you through the rest.

---

## 📁 What Gets Created

When you run `bmad-init`, this structure is created:

```
your-project/
├── .bmad/                    # BMad workspace (isolated to this project)
│   ├── .bmadrc               # Project configuration
│   ├── .gitignore            # Git ignore rules
│   ├── README.md             # Workspace documentation
│   ├── analysis/             # Research & brainstorming
│   ├── planning/             # PRDs & architecture docs
│   ├── stories/              # Development stories
│   ├── sprints/              # Sprint tracking
│   ├── retrospectives/       # Learnings
│   └── context/              # Story-specific expertise
├── [your existing files]
```

**Important:** The `.bmad/` folder is local to your project. Each project has its own isolated workspace.

---

## 🔄 Complete BMad Workflow

### Phase 1: Analysis (Optional)

**Start with research or brainstorming:**

```
/bmad:bmm:workflows:brainstorm-project  # Ideation
/bmad:bmm:workflows:research            # Market/tech research
/bmad:bmm:workflows:product-brief       # Product strategy
```

**Outputs saved to:** `.bmad/analysis/`

---

### Phase 2: Planning (Required)

**Create your PRD and architecture:**

```
/bmad:bmm:workflows:plan-project  ⭐ Start here!
```

**What happens:**
1. BMad asks about your project (size, type, stack, etc.)
2. Automatically determines scale (Level 0-4)
3. Creates appropriate documentation:
   - **Level 0-1:** Simple tech spec
   - **Level 2:** Focused PRD
   - **Level 3-4:** Full PRD + Architecture

**Outputs saved to:** `.bmad/planning/`

---

### Phase 3: Solutioning (Level 3-4 Only)

**For larger projects, create technical specs:**

```
/bmad:bmm:workflows:solution-architecture  # Full architecture
/bmad:bmm:workflows:tech-spec              # Epic-specific tech spec
```

**Outputs saved to:** `.bmad/planning/`

---

### Phase 4: Implementation (Iterative)

**Now the real work begins:**

#### 1. Generate Stories
```
/bmad:bmm:workflows:create-story
```
**Creates development stories from your PRD**
**Output:** `.bmad/stories/STORY-001-description.md`

#### 2. Add Technical Context (NEW in v6!)
```
/bmad:bmm:workflows:story-context
```
**Injects specialized expertise for the specific story**
**Output:** `.bmad/context/STORY-001-context.md`

#### 3. Implement Story
```
/bmad:bmm:workflows:dev-story
```
**Developer agent implements the story with full context**

#### 4. Review Code
```
/bmad:bmm:workflows:review-story
```
**Senior reviewer validates implementation**

#### 5. Repeat for Each Story
Continue steps 1-4 for all stories in your sprint

#### 6. Sprint Retrospective
```
/bmad:bmm:workflows:retrospective
```
**Learn and improve after each sprint**
**Output:** `.bmad/retrospectives/sprint-N-retro.md`

---

## 🎯 Example: Complete First Story

**Starting from a new project:**

```bash
# 1. Set up workspace
cd /Users/hbl/Documents/my-app
bmad-init $(pwd)

# 2. Open Claude Code
claude-code .
```

**In Claude Code:**

```
# 3. Create PRD
/bmad:bmm:workflows:plan-project

# Answer questions like:
# - What are you building?
# - New or existing codebase?
# - Tech stack?
# - Team size?
# - Timeline?

# 4. Generate first story
/bmad:bmm:workflows:create-story

# 5. Add context to story
/bmad:bmm:workflows:story-context

# 6. Implement story
/bmad:bmm:workflows:dev-story

# 7. Review implementation
/bmad:bmm:workflows:review-story

# 8. After sprint, do retro
/bmad:bmm:workflows:retrospective
```

**All artifacts saved in:** `/Users/hbl/Documents/my-app/.bmad/`

---

## 🛠️ Available Agents

Activate specific agents for specialized tasks:

```
/bmad:bmm:agents:analyst     # Research & analysis
/bmad:bmm:agents:pm          # Product planning
/bmad:bmm:agents:architect   # Technical architecture
/bmad:bmm:agents:sm          # Scrum master / story management
/bmad:bmm:agents:dev         # Development
/bmad:bmm:agents:sr          # Senior code reviewer
/bmad:bmm:agents:ux          # UX design
/bmad:bmm:agents:qa          # QA testing
```

**Use agents when:**
- You need specialized expertise
- Workflows don't fit your needs
- You want direct agent interaction

---

## 📊 Project Scale Levels

BMad automatically adapts to your project size:

| Level | Stories | Docs Created | Best For |
|-------|---------|--------------|----------|
| **0** | 1 atomic change | Tech spec only | Bug fixes, tiny features |
| **1** | 1-10 stories | Minimal PRD | Small features |
| **2** | 5-15 stories | Focused PRD | Medium features |
| **3** | 12-40 stories | Full PRD + Arch | Large features |
| **4** | 40+ stories | Enterprise docs | Major projects |

**The `/bmad:bmm:workflows:plan-project` workflow determines the scale automatically!**

---

## 🔍 Verify Setup

After running `bmad-init`:

```bash
# Check workspace structure
ls -la .bmad

# Should show:
# .bmadrc, analysis/, planning/, stories/, sprints/, retrospectives/, context/

# Check configuration
cat .bmad/.bmadrc

# Should show:
# BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD/bmad"
# PROJECT_NAME="your-project"
# etc.

# Test slash commands
cd your-project
claude-code .
# Type / and look for /bmad:* commands
```

---

## 💡 Pro Tips

### 1. Start Small
```
# For new projects, start with minimal planning
/bmad:bmm:workflows:plan-project
# Answer honestly about scope - let BMad adapt
```

### 2. Use Story Context
```
# Always add context before implementing
/bmad:bmm:workflows:story-context
# This provides specialized technical expertise
```

### 3. Iterate Quickly
```
# Don't create all stories upfront
# Create 1-3 stories → implement → review → repeat
```

### 4. Keep Workspace Clean
```
# All BMad artifacts go in .bmad/
# Your actual code stays in src/, app/, etc.
# Never mix them!
```

### 5. Retrospect Regularly
```
# After each sprint (or every 5 stories):
/bmad:bmm:workflows:retrospective
```

---

## 🆘 Troubleshooting

### Issue: Can't find /bmad commands

**Fix:**
```bash
# Update slash commands
bmad-update-commands

# Restart Claude Code
```

### Issue: Workspace not detected

**Fix:**
```bash
# Verify .bmad exists
ls -la .bmad

# If missing, recreate
bmad-init $(pwd)
```

### Issue: Wrong project detected

**Fix:**
```bash
# Check current directory
pwd

# Make sure you're in the right project
cd /Users/hbl/Documents/correct-project

# Then open Claude Code
claude-code .
```

---

## 📚 Multiple Projects

You can have BMad in multiple projects simultaneously:

```bash
# Set up project 1
bmad-init /Users/hbl/Documents/web-app

# Set up project 2
bmad-init /Users/hbl/Documents/mobile-app

# Set up project 3
bmad-init /Users/hbl/Documents/api-service

# List all BMad projects
bmad-list
```

**Each project is completely isolated:**
- Own `.bmad/` workspace
- Own documentation
- Own stories and sprints
- All using the same central BMad installation!

---

## 🎓 Learning Resources

### Quick Reference
```bash
bmad-quick | less
```

### Full Documentation
```bash
bmad-docs  # List all documentation files
```

### Video Tutorial
Visit: https://www.youtube.com/@BMadCode

### Community
- Discord: https://discord.gg/gk8jAdXWmj
- GitHub: https://github.com/bmad-code-org/BMAD-METHOD

---

## ✅ Checklist: Starting a New Project

- [ ] Navigate to project directory
- [ ] Run `bmad-init $(pwd)`
- [ ] Verify `.bmad/` created
- [ ] Open in Claude Code: `claude-code .`
- [ ] Start planning: `/bmad:bmm:workflows:plan-project`
- [ ] Create first story: `/bmad:bmm:workflows:create-story`
- [ ] Add context: `/bmad:bmm:workflows:story-context`
- [ ] Implement: `/bmad:bmm:workflows:dev-story`
- [ ] Review: `/bmad:bmm:workflows:review-story`
- [ ] Retrospect: `/bmad:bmm:workflows:retrospective`

---

## 🚀 Ready to Start?

### Option 1: Use Your Actual Project
```bash
cd /Users/hbl/Documents/your-real-project
bmad-init $(pwd)
claude-code .
# Type: /bmad:bmm:workflows:plan-project
```

### Option 2: Practice with Demo
```bash
mkdir /Users/hbl/Documents/bmad-demo
cd /Users/hbl/Documents/bmad-demo
bmad-init $(pwd)
claude-code .
# Type: /bmad:bmm:workflows:plan-project
```

### Option 3: Use Example Project
```bash
# I already created one for you!
cd /Users/hbl/Documents/project
claude-code .
# Type: /bmad:bmm:workflows:plan-project
```

---

**That's it! You now know how to start using BMad Method v6 in any new project!** 🎉

**BMad v6 Alpha** | Start New Project Guide | 2025-10-07
