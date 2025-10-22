# BMad Method v6 Alpha - Complete Setup Guide

**🎯 You are here because you want to maximize BMad Method across all your projects.**

---

## 📋 Quick Status Check

Run this to see your current setup:

```bash
source ~/.zshrc
bmad-doctor
```

---

## 🚀 What's Been Set Up

### ✅ Completed

1. **Central BMad Installation** - `/Users/hbl/Documents/BMAD-METHOD/bmad/`
2. **Global CLI & Aliases** - `bmad`, `bmad-init`, `bmad-doctor`, etc.
3. **Environment Variables** - Auto-loaded via `~/.bmadrc`
4. **Slash Commands** - 44+ commands in Claude Code
5. **Project Workspace** - Pages Health configured
6. **Documentation** - 6 comprehensive guides created
7. **Maintenance Scripts** - Validation, update, and backup tools

### ⚠️ Pending

1. **CIS Module** - Creative Intelligence Suite (5 agents + 5 workflows)
2. **BMB Module** - BMad Builder (create custom agents/workflows)

---

## 📚 Documentation Index

| File | Purpose | Command |
|------|---------|---------|
| **SETUP-INSTRUCTIONS.md** | Multi-project setup guide | `cat SETUP-INSTRUCTIONS.md` |
| **OPTIMIZATION-CHECKLIST.md** | Gap analysis & action plan | `cat OPTIMIZATION-CHECKLIST.md` |
| **QUICK-REFERENCE.md** | Command cheat sheet | `bmad-quick` |
| **INSTALL-MODULES.md** | How to install CIS + BMB | `bmad-install-modules` |
| **MAINTENANCE-GUIDE.md** | Troubleshooting & maintenance | `cat MAINTENANCE-GUIDE.md` |
| **README-SETUP.md** | This file - master index | `cat README-SETUP.md` |

---

## 🛠️ Available Commands

### Setup & Status
```bash
bmad-init <path>     # Set up BMad workspace in a project
bmad status          # Show BMad installation status
bmad-list            # List all projects with BMad
bmad-doctor          # Quick health check ⭐
bmad-validate        # Full system validation
```

### Maintenance
```bash
bmad-update          # Update BMad (git pull + npm + commands)
bmad-update-commands # Update slash commands only
bmad-backup          # Create backup
bmad-restore         # Restore from backup
```

### Documentation
```bash
bmad-help            # Show all commands
bmad-docs            # List documentation files
bmad-quick           # Quick reference guide
bmad-install-modules # Module installation guide
```

---

## 🎯 Next Steps

### 1. Install Missing Modules (Recommended)

**What you'll get:**
- **CIS Module:** 5 creative agents (Carson, Maya, Dr. Quinn, Victor, Sophia)
- **BMB Module:** Build custom agents and workflows

**How to install:**
```bash
# 1. Read the guide
bmad-install-modules

# 2. Run installer
cd /Users/hbl/Documents/BMAD-METHOD
npm run install:bmad

# 3. When prompted:
#    Destination: /Users/hbl/Documents/BMAD-METHOD/bmad (same as before)
#    Modules: Select CIS + BMB
#    Name: hbl
#    Language: en-AU
#    IDE: Claude Code

# 4. Verify
bmad-doctor
```

### 2. Set Up More Projects

```bash
# Example: Set up mermaid-dynamic project
bmad-init /Users/hbl/Documents/mermaid-dynamic

# Example: Set up visa-ai project
bmad-init /Users/hbl/Documents/visa-ai

# View all BMad projects
bmad-list
```

### 3. Start Using BMad

```bash
# 1. Go to a project
cd /Users/hbl/Documents/pages-health

# 2. Open in Claude Code
claude-code .

# 3. Type / to see all BMad commands
# Start with: /bmad:bmm:workflows:plan-project
```

---

## 🔍 How to Use BMad

### Typical Workflow

1. **Planning Phase**
   ```
   /bmad:bmm:workflows:plan-project
   ```
   Creates PRD and architecture based on project scale

2. **Story Creation**
   ```
   /bmad:bmm:workflows:create-story
   ```
   Generates development stories from PRD

3. **Add Context**
   ```
   /bmad:bmm:workflows:story-context
   ```
   Injects technical expertise for the story

4. **Implementation**
   ```
   /bmad:bmm:workflows:dev-story
   ```
   Implement the story with dev agent

5. **Code Review**
   ```
   /bmad:bmm:workflows:review-story
   ```
   Senior reviewer validates implementation

6. **Retrospective**
   ```
   /bmad:bmm:workflows:retrospective
   ```
   Learn and improve after sprint

---

## 📊 System Architecture

### Central Hub (Shared)
```
/Users/hbl/Documents/BMAD-METHOD/bmad/
├── core/           # Core engine (shared)
├── bmm/            # BMad Method (shared)
├── cis/            # Creative Intelligence (pending)
├── bmb/            # BMad Builder (pending)
└── _cfg/           # Configuration
```

### Per-Project Workspace (Isolated)
```
your-project/
└── .bmad/
    ├── analysis/        # Project research
    ├── planning/        # PRDs & architecture
    ├── stories/         # Dev stories
    ├── sprints/         # Sprint tracking
    ├── retrospectives/  # Learnings
    ├── context/         # Story context
    └── .bmadrc          # Links to central BMad
```

**Key Benefit:** Install once, use everywhere. Each project keeps its own isolated documentation.

---

## 🆘 Troubleshooting

### Quick Fixes

**Slash commands not showing?**
```bash
bmad-update-commands
```

**Aliases not working?**
```bash
source ~/.zshrc
bmad-help
```

**Something broken?**
```bash
bmad-validate  # Detailed diagnostics
```

**Need to restore?**
```bash
bmad-restore  # If you used bmad-update before
```

### Full Diagnostics

```bash
# 1. Quick check
bmad-doctor

# 2. Full validation
bmad-validate

# 3. Check docs
bmad-docs

# 4. Read maintenance guide
cat /Users/hbl/Documents/BMAD-METHOD/MAINTENANCE-GUIDE.md
```

---

## 📈 Current Setup Status

### What's Working ✅
- Central BMad installation
- BMM module (BMad Method)
- 44 slash commands
- Global CLI and aliases
- Environment variables
- Project workspace (pages-health)
- All documentation and scripts

### What's Missing ⚠️
- CIS module (Creative Intelligence Suite)
- BMB module (BMad Builder)

**To complete setup:**
```bash
bmad-install-modules  # Read the guide
cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad  # Install
```

---

## 🎓 Learning Resources

### Documentation Order (Recommended)

1. **Start Here:** `bmad-quick` - Quick reference
2. **Deep Dive:** `cat SETUP-INSTRUCTIONS.md` - Complete setup guide
3. **Optimize:** `cat OPTIMIZATION-CHECKLIST.md` - What's missing
4. **Maintain:** `cat MAINTENANCE-GUIDE.md` - Keep it healthy
5. **Extend:** `bmad-install-modules` - Add more modules

### BMad Method Resources

- **Discord:** https://discord.gg/gk8jAdXWmj
- **GitHub:** https://github.com/bmad-code-org/BMAD-METHOD
- **YouTube:** https://www.youtube.com/@BMadCode

---

## 🔑 Key Commands to Remember

```bash
# Health check (use this often!)
bmad-doctor

# Get help
bmad-help

# Set up new project
bmad-init /path/to/project

# View docs
bmad-docs

# Update everything
bmad-update

# Install modules
cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad
```

---

## ✨ What's Next?

### Option A: Install Modules (Recommended)
```bash
bmad-install-modules  # Read guide
cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad
```

### Option B: Start Using BMad Now
```bash
cd /Users/hbl/Documents/pages-health
claude-code .
# Type: /bmad:bmm:workflows:plan-project
```

### Option C: Set Up More Projects
```bash
bmad-init /Users/hbl/Documents/another-project
```

---

**🚀 You're all set!** BMad Method v6 Alpha is configured and ready to use.

**Quick Start:**
1. `source ~/.zshrc` - Load configuration
2. `bmad-doctor` - Verify setup
3. `bmad-install-modules` - Install CIS + BMB
4. `cd your-project && claude-code .` - Start using BMad

---

**BMad v6 Alpha** | Complete Setup Guide | 2025-10-07
