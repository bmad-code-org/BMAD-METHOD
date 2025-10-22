# BMad Method v6 Alpha - Quick Reference Guide

**Last Updated:** 2025-10-07

---

## 🚀 Getting Started

### 1. Set Up a New Project

```bash
# Method 1: Using alias (recommended)
bmad-init /path/to/your/project

# Method 2: Direct script
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /path/to/your/project
```

### 2. Open Project in Claude Code

```bash
cd /path/to/your/project
claude-code .
```

### 3. Start Using BMad

Type `/` in Claude Code to see all available BMad commands!

---

## 📋 BMad Slash Commands Cheat Sheet

### Core Workflows

| Command | Purpose |
|---------|---------|
| `/bmad:core:workflows:bmad-init` | Initialize BMad in current project |
| `/bmad:core:workflows:party-mode` | Activate multi-agent collaboration |
| `/bmad:core:workflows:brainstorming` | Start brainstorming session |
| `/bmad:core:agents:bmad-master` | Activate BMad master orchestrator |

### Phase 1: Analysis (Optional)

| Command | Purpose |
|---------|---------|
| `/bmad:bmm:workflows:brainstorm-project` | Project ideation and brainstorming |
| `/bmad:bmm:workflows:research` | Market/technical research |
| `/bmad:bmm:workflows:product-brief` | Create product brief |
| `/bmad:bmm:workflows:brainstorm-game` | Game-specific brainstorming |
| `/bmad:bmm:workflows:game-brief` | Create game design brief |

### Phase 2: Planning (Required)

| Command | Purpose |
|---------|---------|
| `/bmad:bmm:workflows:plan-project` | **Main workflow** - Scale-adaptive PRD/architecture |
| `/bmad:bmm:workflows:prd` | Create Product Requirements Document |
| `/bmad:bmm:workflows:gdd` | Game Design Document |
| `/bmad:bmm:workflows:plan-game` | Game-specific planning |

### Phase 3: Solutioning (Level 3-4)

| Command | Purpose |
|---------|---------|
| `/bmad:bmm:workflows:solution-architecture` | Create technical architecture |
| `/bmad:bmm:workflows:tech-spec` | Create Epic Technical Specification |

### Phase 4: Implementation (Iterative)

| Command | Purpose |
|---------|---------|
| `/bmad:bmm:workflows:create-story` | Generate development stories |
| `/bmad:bmm:workflows:story-context` | Add technical context to story |
| `/bmad:bmm:workflows:dev-story` | Implement development story |
| `/bmad:bmm:workflows:review-story` | Code review and validation |
| `/bmad:bmm:workflows:correct-course` | Issue resolution |
| `/bmad:bmm:workflows:retrospective` | Sprint retrospective |

### Specialized Agents

| Command | Purpose |
|---------|---------|
| `/bmad:bmm:agents:analyst` | Research & analysis agent |
| `/bmad:bmm:agents:pm` | Product manager agent |
| `/bmad:bmm:agents:architect` | Technical architect agent |
| `/bmad:bmm:agents:sm` | Scrum master agent |
| `/bmad:bmm:agents:dev` | Developer agent |
| `/bmad:bmm:agents:sr` | Senior reviewer agent |
| `/bmad:bmm:agents:ux` | UX design agent |
| `/bmad:bmm:agents:qa` | QA testing agent |

---

## 🎯 Typical Workflow

### For New Feature or Project

```
1. /bmad:bmm:workflows:plan-project
   ↓
2. /bmad:bmm:workflows:create-story
   ↓
3. /bmad:bmm:workflows:story-context
   ↓
4. /bmad:bmm:workflows:dev-story
   ↓
5. /bmad:bmm:workflows:review-story
   ↓
6. Repeat steps 2-5 for each story
   ↓
7. /bmad:bmm:workflows:retrospective
```

### For Simple Task (Level 0-1)

```
1. /bmad:bmm:workflows:tech-spec
   ↓
2. /bmad:bmm:workflows:dev-story
   ↓
3. /bmad:bmm:workflows:review-story
```

---

## 📁 File Locations

### Central BMad Installation
```
/Users/hbl/Documents/BMAD-METHOD/bmad/
├── core/           # Core engine
├── bmm/            # BMad Method module
│   ├── agents/     # Agent definitions
│   ├── workflows/  # Workflow definitions
│   └── tasks/      # Task definitions
└── _cfg/           # Configuration files
```

### Project Workspace
```
your-project/
└── .bmad/
    ├── analysis/        # Research & brainstorming
    ├── planning/        # PRDs & architecture
    ├── stories/         # Dev stories
    ├── sprints/         # Sprint planning
    ├── retrospectives/  # Learnings
    ├── context/         # Story context
    └── .bmadrc          # Project config
```

### Slash Commands
```
~/.claude/commands/bmad/
├── core/
│   ├── agents/
│   └── workflows/
└── bmm/
    ├── agents/
    └── workflows/
```

---

## 🔧 Terminal Commands

### BMad CLI

```bash
# Check status
bmad status

# List all BMad projects
bmad-list

# Set up new project
bmad-init /path/to/project

# Show help
bmad-help
```

### Project Setup

```bash
# Navigate to project
cd /path/to/your/project

# Set up BMad workspace
bmad-init $(pwd)

# Open in Claude Code
claude-code .
```

---

## 📊 Project Scale Levels

BMad automatically adapts to your project size:

| Level | Stories | Documentation |
|-------|---------|---------------|
| **0** | 1 atomic change | Tech spec only |
| **1** | 1-10 stories | Minimal PRD |
| **2** | 5-15 stories | Focused PRD |
| **3** | 12-40 stories | Full PRD + Architecture |
| **4** | 40+ stories | Enterprise-scale docs |

---

## 🆘 Troubleshooting

### Slash Commands Not Showing

**Check if commands are installed:**
```bash
ls ~/.claude/commands/bmad
```

**If empty, copy commands:**
```bash
cp -r /Users/hbl/Documents/BMAD-METHOD/.claude/commands/bmad ~/.claude/commands/
```

### BMad Not Detected in Project

**Verify workspace exists:**
```bash
ls -la .bmad
```

**Check configuration:**
```bash
cat .bmad/.bmadrc
```

### Can't Find BMad Installation

**Check central installation:**
```bash
ls /Users/hbl/Documents/BMAD-METHOD/bmad
```

**Verify in manifest:**
```bash
cat /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP-INSTRUCTIONS.md` | Complete setup guide |
| `OPTIMIZATION-CHECKLIST.md` | Gap analysis & improvements |
| `QUICK-REFERENCE.md` | This file - quick commands |

---

## 🎓 Tips & Best Practices

1. **Always start with planning** - Use `/bmad:bmm:workflows:plan-project` first
2. **Let the scale adapt** - Answer questions honestly for optimal workflow
3. **Use story-context** - Adds specialized expertise to each story
4. **Review before merging** - Always run `/bmad:bmm:workflows:review-story`
5. **Retrospect regularly** - Learn and improve with each sprint
6. **Keep workspaces isolated** - Each project has its own `.bmad/` folder

---

## 🔑 Key Environment Variables

```bash
BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD/bmad"
BMAD_VERSION="6.0.0-alpha.0"
BMAD_MODULES="core,bmm"
BMAD_IDE="claude-code"
```

Loaded from: `~/.bmadrc` (automatically on shell startup)

---

## ⚡ Power User Shortcuts

### Quick Project Setup
```bash
# One command to set up and open
bmad-init /path/to/project && cd /path/to/project && claude-code .
```

### List All BMad Projects
```bash
bmad-list
```

### Check BMad Status
```bash
bmad status
```

---

**BMad v6 Alpha** | Generated: 2025-10-07

For detailed documentation, see:
- `/Users/hbl/Documents/BMAD-METHOD/SETUP-INSTRUCTIONS.md`
- `/Users/hbl/Documents/BMAD-METHOD/OPTIMIZATION-CHECKLIST.md`
