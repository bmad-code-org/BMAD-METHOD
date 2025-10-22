# BMad Multi-Project Setup Instructions

This guide explains how to use the **centralized BMad installation** across all your projects.

## 🎯 Architecture Overview

### Central Hub (One Installation)
```
/Users/hbl/Documents/BMAD-METHOD/bmad/
├── core/           ← Shared BMad engine
├── bmm/            ← Shared agents & workflows
│   ├── agents/     ← All agent definitions
│   ├── workflows/  ← All workflow definitions
│   └── tasks/      ← Reusable tasks
└── _cfg/           ← BMad configuration
```

### Per-Project Workspaces (Isolated Artifacts)
```
/Users/hbl/Documents/your-project/
└── .bmad/          ← Project-specific workspace
    ├── analysis/   ← Project research
    ├── planning/   ← PRDs, architecture
    ├── stories/    ← Dev stories
    ├── sprints/    ← Sprint tracking
    ├── retrospectives/ ← Learnings
    ├── context/    ← Story context
    └── .bmadrc     ← Links to central BMad
```

**Key Benefit:** Install BMad once, use everywhere. Each project keeps its own notes isolated.

---

## 🚀 Setup Instructions

### For Pages Health (Already Done ✅)

The Pages Health project already has BMad workspace set up at:
`/Users/hbl/Documents/pages-health/.bmad/`

### For All Other Projects

Use the automated setup script:

```bash
# General syntax
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /path/to/your/project

# Examples
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /Users/hbl/Documents/my-app
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /Users/hbl/Documents/another-project
```

**What the script does:**
1. ✅ Creates `.bmad/` workspace in your project
2. ✅ Creates all required subdirectories
3. ✅ Links to central BMad installation
4. ✅ Generates project-specific configuration
5. ✅ Creates README with usage instructions

---

## 📋 Using BMad in Claude Code

### Step 1: Open Project in Claude Code

```bash
cd /Users/hbl/Documents/your-project
claude-code .
```

### Step 2: Access BMad Agents

Type `/` to see all available commands. BMad commands follow this pattern:

```
/bmad:bmm:agents:{agent-name}
/bmad:bmm:workflows:{workflow-name}
```

### Step 3: Common Agent Commands

**Planning & Architecture:**
- `/bmad:bmm:agents:analyst` - Research & analysis agent
- `/bmad:bmm:agents:pm` - Product manager agent
- `/bmad:bmm:agents:architect` - Technical architect agent

**Development:**
- `/bmad:bmm:agents:sm` - Scrum master (story management)
- `/bmad:bmm:agents:dev` - Developer agent
- `/bmad:bmm:agents:sr` - Senior reviewer agent

**Specialized:**
- `/bmad:bmm:agents:ux` - UX design agent
- `/bmad:bmm:agents:qa` - QA testing agent

### Step 4: Common Workflow Commands

**Analysis Phase (Optional):**
- `/bmad:bmm:workflows:brainstorm-project` - Project ideation
- `/bmad:bmm:workflows:research` - Market/tech research
- `/bmad:bmm:workflows:product-brief` - Product strategy

**Planning Phase (Required):**
- `/bmad:bmm:workflows:plan-project` - Creates PRD & architecture

**Implementation Phase (Iterative):**
- `/bmad:bmm:workflows:create-story` - Generate dev stories
- `/bmad:bmm:workflows:story-context` - Add technical context
- `/bmad:bmm:workflows:dev-story` - Implement story
- `/bmad:bmm:workflows:review-story` - Code review
- `/bmad:bmm:workflows:retrospective` - Sprint retro

---

## 🔄 Typical BMad Workflow

### 1. Start New Project or Feature

```bash
# Open project in Claude Code
cd /Users/hbl/Documents/your-project

# If .bmad doesn't exist yet:
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh $(pwd)

# Start Claude Code
claude-code .
```

### 2. Planning Phase

```
/bmad:bmm:workflows:plan-project
```

This will:
- Guide you through project planning
- Create PRD in `.bmad/planning/`
- Generate architecture docs
- Auto-scale based on project size

### 3. Implementation Phase

```
# Create stories from PRD
/bmad:bmm:workflows:create-story

# Add technical context to story
/bmad:bmm:workflows:story-context

# Implement the story
/bmad:bmm:workflows:dev-story

# Review implementation
/bmad:bmm:workflows:review-story
```

### 4. Continuous Improvement

```
# After each sprint
/bmad:bmm:workflows:retrospective
```

---

## 📁 Where Files Are Stored

### Project-Specific (In `.bmad/`)

All artifacts stay in your project's `.bmad/` folder:

```
your-project/.bmad/
├── analysis/
│   └── project-research-2025-10-07.md
├── planning/
│   ├── PRD-feature-name.md
│   └── architecture-v1.md
├── stories/
│   ├── STORY-001-user-auth.md
│   └── STORY-002-dashboard.md
└── sprints/
    └── sprint-1-planning.md
```

### Shared (In Central BMad)

Agents and workflows are never duplicated:

```
/Users/hbl/Documents/BMAD-METHOD/bmad/
└── bmm/
    ├── agents/      ← Shared by all projects
    └── workflows/   ← Shared by all projects
```

---

## 🔧 Configuration File

Each project has `.bmad/.bmadrc`:

```bash
# Central BMad installation path
BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD/bmad"

# Project information
PROJECT_NAME="your-project"
PROJECT_ROOT="/Users/hbl/Documents/your-project"

# Workspace directories
WORKSPACE_ROOT=".bmad"
ANALYSIS_DIR="${WORKSPACE_ROOT}/analysis"
PLANNING_DIR="${WORKSPACE_ROOT}/planning"
# ... etc
```

You can customize this per project if needed.

---

## ✅ Verification Checklist

After setting up a project:

- [ ] `.bmad/` folder exists in project root
- [ ] `.bmad/.bmadrc` points to central BMad
- [ ] All subdirectories created (analysis, planning, stories, etc.)
- [ ] `/bmad:` commands autocomplete in Claude Code
- [ ] Agent commands work: `/bmad:bmm:agents:pm`
- [ ] Workflow commands work: `/bmad:bmm:workflows:plan-project`

---

## 🆘 Troubleshooting

### Issue: BMad commands not showing in Claude Code

**Solution:**
1. Verify central BMad is installed:
   ```bash
   ls /Users/hbl/Documents/BMAD-METHOD/bmad
   ```
2. Verify project workspace exists:
   ```bash
   ls /Users/hbl/Documents/your-project/.bmad
   ```
3. Check `.bmadrc` points to correct path
4. Restart Claude Code

### Issue: Can't find agents or workflows

**Solution:**
Check central BMad has all modules:
```bash
ls /Users/hbl/Documents/BMAD-METHOD/bmad/bmm/agents
ls /Users/hbl/Documents/BMAD-METHOD/bmad/bmm/workflows
```

### Issue: Multiple projects mixing documentation

**Solution:**
This shouldn't happen! Each project has isolated `.bmad/` workspace.
Verify each project has its own:
```bash
ls /Users/hbl/Documents/project-a/.bmad
ls /Users/hbl/Documents/project-b/.bmad
```

---

## 📚 Quick Reference

### Setup New Project
```bash
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /path/to/project
```

### Most Used Commands
```
/bmad:bmm:workflows:plan-project     ← Start here
/bmad:bmm:workflows:create-story     ← Generate stories
/bmad:bmm:workflows:dev-story        ← Implement
/bmad:bmm:workflows:review-story     ← Review
```

### File Locations
- **Central BMad:** `/Users/hbl/Documents/BMAD-METHOD/bmad/`
- **Project Workspace:** `<your-project>/.bmad/`
- **Setup Script:** `/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh`

---

## 🎓 BMad Method Scale Levels

BMad automatically adapts to project size:

- **Level 0:** Single atomic change (no docs needed)
- **Level 1:** 1-10 stories (minimal docs)
- **Level 2:** 5-15 stories (focused PRD)
- **Level 3:** 12-40 stories (full architecture)
- **Level 4:** 40+ stories (enterprise scale)

The `plan-project` workflow will ask about scale and create appropriate documentation.

---

**You're all set! Install once, use everywhere. Each project stays organized in its own workspace.**
