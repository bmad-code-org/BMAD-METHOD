# BMad Method - Complete Command Reference

**Quick Access:** Type `bmad-help` in terminal

---

## 🎯 Most Used Commands

```bash
bmad-summary         # Show complete setup summary ⭐
bmad-doctor          # Quick health check
bmad-help            # List all commands
bmad-install-modules # Guide to install CIS + BMB
```

---

## 📋 All Available Commands (16)

### Setup & Configuration
| Command | Description |
|---------|-------------|
| `bmad-init <path>` | Set up BMad workspace in a project |
| `bmad status` | Show BMad installation status |
| `bmad-list` | List all projects with BMad workspaces |

### Health & Diagnostics
| Command | Description |
|---------|-------------|
| `bmad-doctor` | Quick health check (30 sec) |
| `bmad-validate` | Full system validation (2 min) |
| `bmad-summary` | Display complete setup summary |

### Maintenance & Updates
| Command | Description |
|---------|-------------|
| `bmad-update` | Full update (git pull + npm + commands) |
| `bmad-update-commands` | Update slash commands only |
| `bmad-backup` | Create backup of installation |
| `bmad-restore` | Restore from last backup |

### Documentation
| Command | Description |
|---------|-------------|
| `bmad-help` | Show all commands |
| `bmad-docs` | List all documentation files |
| `bmad-quick` | Quick reference guide |
| `bmad-install-modules` | Module installation guide |

### Custom Alias
| Command | Description |
|---------|-------------|
| `bmad <args>` | Run BMad CLI directly |

---

## 📚 Documentation Files

```bash
# Master Index (start here!)
cat /Users/hbl/Documents/BMAD-METHOD/README-SETUP.md

# Complete Summary
cat /Users/hbl/Documents/BMAD-METHOD/COMPLETE-SETUP-SUMMARY.md

# Quick Reference
cat /Users/hbl/Documents/BMAD-METHOD/QUICK-REFERENCE.md

# Setup Guide
cat /Users/hbl/Documents/BMAD-METHOD/SETUP-INSTRUCTIONS.md

# Optimization Checklist
cat /Users/hbl/Documents/BMAD-METHOD/OPTIMIZATION-CHECKLIST.md

# Module Installation
cat /Users/hbl/Documents/BMAD-METHOD/INSTALL-MODULES.md

# Maintenance Guide
cat /Users/hbl/Documents/BMAD-METHOD/MAINTENANCE-GUIDE.md
```

---

## 🛠️ Maintenance Scripts

```bash
# Quick health check
bash /Users/hbl/Documents/BMAD-METHOD/bmad-doctor.sh

# Full validation (10 checks)
bash /Users/hbl/Documents/BMAD-METHOD/validate-bmad-setup.sh

# Update/backup/restore
bash /Users/hbl/Documents/BMAD-METHOD/bmad-update.sh

# Project setup
bash /Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /path/to/project

# Show summary
bash /Users/hbl/Documents/BMAD-METHOD/show-setup-summary.sh
```

---

## 🚀 Slash Commands (Claude Code)

### BMM Module (Currently Available)

**Planning Phase:**
```
/bmad:bmm:workflows:plan-project       # Scale-adaptive PRD/architecture ⭐
/bmad:bmm:workflows:brainstorm-project # Project ideation
/bmad:bmm:workflows:research           # Market/tech research
/bmad:bmm:workflows:product-brief      # Product brief
```

**Solutioning Phase:**
```
/bmad:bmm:workflows:solution-architecture # Technical architecture
/bmad:bmm:workflows:tech-spec             # Epic technical spec
```

**Implementation Phase:**
```
/bmad:bmm:workflows:create-story       # Generate dev stories
/bmad:bmm:workflows:story-context      # Add technical context ⭐
/bmad:mmm:workflows:dev-story          # Implement story
/bmad:bmm:workflows:review-story       # Code review
/bmad:bmm:workflows:retrospective      # Sprint retro
```

**Agents:**
```
/bmad:bmm:agents:pm          # Product Manager
/bmad:bmm:agents:architect   # Technical Architect
/bmad:bmm:agents:sm          # Scrum Master
/bmad:bmm:agents:dev         # Developer
/bmad:bmm:agents:sr          # Senior Reviewer
/bmad:bmm:agents:ux          # UX Designer
/bmad:bmm:agents:qa          # QA Tester
```

### CIS Module (After Installation)
```
/bmad:cis:agents:carson      # Brainstorming Specialist
/bmad:cis:agents:maya        # Design Thinking Expert
/bmad:cis:agents:quinn       # Problem Solver
/bmad:cis:agents:victor      # Innovation Strategist
/bmad:cis:agents:sophia      # Master Storyteller

/bmad:cis:workflows:brainstorming      # 36 creative techniques
/bmad:cis:workflows:design-thinking    # 5-phase process
/bmad:cis:workflows:problem-solving    # Root cause analysis
/bmad:cis:workflows:innovation         # Business innovation
/bmad:cis:workflows:storytelling       # 25 frameworks
```

### BMB Module (After Installation)
```
/bmad:bmb:workflows:create-agent       # Build custom agent
/bmad:bmb:workflows:create-workflow    # Design workflow
/bmad:bmb:workflows:create-team        # Configure team
/bmad:bmb:workflows:bundle-agent       # Package for sharing
/bmad:bmb:workflows:create-method      # Custom methodology
```

---

## 🔄 Typical Usage Flow

### 1. Daily Start
```bash
# Load configuration
source ~/.zshrc

# Quick health check
bmad-doctor

# Check for updates
git pull
```

### 2. New Project Setup
```bash
# Set up workspace
bmad-init /Users/hbl/Documents/new-project

# Open in Claude Code
cd /Users/hbl/Documents/new-project
claude-code .

# Start planning
/bmad:bmm:workflows:plan-project
```

### 3. Development Workflow
```
1. /bmad:bmm:workflows:plan-project       # Create PRD
2. /bmad:bmm:workflows:create-story       # Generate stories
3. /bmad:bmm:workflows:story-context      # Add context
4. /bmad:bmm:workflows:dev-story          # Implement
5. /bmad:bmm:workflows:review-story       # Review
6. Repeat 2-5 for each story
7. /bmad:bmm:workflows:retrospective      # Retro
```

### 4. Maintenance
```bash
# Weekly check
bmad-doctor

# Monthly update
bmad-update

# Before major work
bmad-backup
```

---

## 🆘 Troubleshooting Commands

```bash
# Quick diagnosis
bmad-doctor

# Full validation
bmad-validate

# Fix slash commands
bmad-update-commands

# Reload config
source ~/.zshrc

# Emergency restore
bmad-restore

# Get help
bmad-help
bmad-docs
```

---

## 📊 Status Interpretation

### ✅ Healthy
```
✓ Central BMad installation
✓ 6+ modules installed
✓ 60+ slash commands
✓ Global aliases configured
✓ Environment variables
✓ 1+ project workspace(s)

✅ BMad is healthy!
```

### ⚠️ Functional with Warnings
```
✓ Central BMad installation
✓ 4 modules installed
  ⚠ CIS module missing
  ⚠ BMB module missing
✓ 44 slash commands

⚠️ BMad functional with 2 warning(s)
```
**Action:** Install missing modules

### ❌ Critical Issues
```
✗ Central BMad missing
✗ Slash commands missing
✗ Aliases missing

❌ Found 3 critical issue(s)
```
**Action:** Run `bmad-validate` for details

---

## 💡 Pro Tips

1. **Start your session:**
   ```bash
   source ~/.zshrc && bmad-summary
   ```

2. **Before important work:**
   ```bash
   bmad-backup
   ```

3. **Weekly maintenance:**
   ```bash
   bmad-doctor && bmad-update
   ```

4. **Learn BMad:**
   ```bash
   bmad-quick | less
   ```

5. **Set up multiple projects:**
   ```bash
   for proj in project1 project2 project3; do
     bmad-init /Users/hbl/Documents/$proj
   done
   ```

---

## 🔑 Environment Variables

```bash
$BMAD_HOME      # /Users/hbl/Documents/BMAD-METHOD/bmad
$BMAD_VERSION   # 6.0.0-alpha.0
$BMAD_MODULES   # core,bmm
$BMAD_IDE       # claude-code
```

**Location:** `~/.bmadrc` (auto-loaded via `~/.zshrc`)

---

**BMad v6 Alpha** | Complete Command Reference
