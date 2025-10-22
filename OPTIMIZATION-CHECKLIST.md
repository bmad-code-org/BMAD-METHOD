# BMad Method v6 Alpha - Optimization & Configuration Checklist

**Status:** Based on your current installation at `/Users/hbl/Documents/BMAD-METHOD/bmad/`

---

## ✅ What's Already Installed & Working

### Core Installation
- ✅ **BMad Core** - Engine installed and operational
- ✅ **BMM Module** (BMad Method Manager) - Primary methodology module
- ✅ **Multi-IDE Support** - Configured for Claude Code, Codex, Gemini
- ✅ **Subagents Installed** - Claude Code subagents in `~/.claude/agents/bmad-*`
  - bmad-analysis/ (4 agents: api-documenter, codebase-analyzer, data-analyst, pattern-detector)
  - bmad-planning/ (7 agents: dependency-mapper, epic-optimizer, requirements-analyst, etc.)
  - bmad-research/ (2 agents)
  - bmad-review/ (2 agents)

### Project Setup
- ✅ **Pages Health** - `.bmad/` workspace configured
- ✅ **Setup Script** - `/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh`
- ✅ **Documentation** - Complete setup instructions created

---

## 🔧 What You're Missing (To Maximize BMad)

### 1. **Missing Modules** ⚠️

You only installed **BMM**. Available modules you can add:

| Module | Purpose | Status | Action |
|--------|---------|--------|--------|
| **CIS** (Creative Intelligence Suite) | Brainstorming, innovation, creative problem-solving | ❌ Not Installed | `npm run install:bmad` and select CIS |
| **BoMB/BMB** (BMad Builder) | Create custom agents, workflows, and modules | ❌ Not Installed | `npm run install:bmad` and select BMB |

**Why install these:**
- **CIS**: Powers advanced brainstorming and ideation workflows
- **BMB**: Lets you create custom agents specific to your domain/projects

**How to install:**
```bash
cd /Users/hbl/Documents/BMAD-METHOD
npm run install:bmad
# Select additional modules when prompted
# Use same destination: /Users/hbl/Documents/BMAD-METHOD/bmad
```

---

### 2. **Missing: BMad Slash Commands** ⚠️

**Issue:** BMad agents and workflows are NOT accessible as slash commands in Claude Code.

**What's Missing:**
- No `/bmad:bmm:agents:*` commands
- No `/bmad:bmm:workflows:*` commands
- Slash commands should be in `.claude/commands/bmad/` but directory doesn't exist

**Why This Happened:**
The installer created the agents/workflows but didn't install the Claude Code slash commands interface.

**Fix Required:**
You need to manually link or create slash command wrappers. I can help with this - see "Action Plan" below.

---

### 3. **Project Workspace Automation** 💡

**Current State:**
- Manual script works: `setup-project-bmad.sh`
- Must run for each new project

**Optimization Opportunity:**
Create a global alias for faster project setup:

```bash
# Add to ~/.zshrc
alias bmad-init='/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh'

# Then use anywhere:
cd /Users/hbl/Documents/new-project
bmad-init $(pwd)
```

---

### 4. **Missing: Global BMad CLI** 💡

**What You Could Have:**
A global `bmad` command to run workflows from terminal

**Currently:**
- BMad CLI exists at `/Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js`
- Not globally accessible

**To Enable:**
```bash
# Option 1: NPM global link
cd /Users/hbl/Documents/BMAD-METHOD
npm link

# Option 2: Alias in ~/.zshrc
alias bmad='node /Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js'

# Then use:
bmad status
bmad install
```

---

### 5. **Environment Integration** 💡

**Missing Enhancements:**

#### A. BMad Environment Variables
Create `~/.bmadrc` for global configuration:

```bash
# ~/.bmadrc
export BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD/bmad"
export BMAD_VERSION="6.0.0-alpha.0"
export BMAD_MODULES="core,bmm"
export BMAD_IDE="claude-code"
```

Source in `~/.zshrc`:
```bash
[ -f ~/.bmadrc ] && source ~/.bmadrc
```

#### B. Project Auto-Detection
Add to `~/.zshrc` to show BMad status when entering project directories:

```bash
bmad_check() {
  if [ -f ".bmad/.bmadrc" ]; then
    echo "📦 BMad workspace detected"
    cat .bmad/.bmadrc | grep PROJECT_NAME
  fi
}
alias cd='cdnvm'
cdnvm() {
  command cd "$@"
  bmad_check
}
```

---

### 6. **Documentation Organization** 📚

**Current State:**
- Central docs in BMAD-METHOD/bmad/docs/
- Project docs in each .bmad/ folder
- No index or quick reference

**Recommended Additions:**

#### A. Create Quick Reference Card
`/Users/hbl/Documents/BMAD-METHOD/QUICK-REFERENCE.md`
- Common workflows cheat sheet
- Agent activation commands
- File structure diagram
- Troubleshooting tips

#### B. Create Workflow Decision Tree
Help you decide which workflow to run based on:
- Project size (Level 0-4)
- Phase (Analysis, Planning, Solutioning, Implementation)
- Current state (greenfield vs brownfield)

---

### 7. **Git Integration** 🔄

**Missing: BMad Commit Templates**

Create `.gitmessage` template for BMad workflow commits:

```bash
# ~/.gitmessage-bmad
[BMad] <workflow>: <summary>

Phase: <Analysis|Planning|Solutioning|Implementation>
Agent: <agent-name>
Artifacts: <files-created>

<detailed description>

BMad v6 Alpha
```

Configure per project:
```bash
cd /Users/hbl/Documents/pages-health
git config commit.template ~/.gitmessage-bmad
```

---

## 🎯 Recommended Action Plan

### Phase 1: Critical Fixes (Do Now)

1. **Install Missing Modules**
   ```bash
   cd /Users/hbl/Documents/BMAD-METHOD
   npm run install:bmad
   # Select: CIS, BMB
   # Destination: /Users/hbl/Documents/BMAD-METHOD/bmad
   ```

2. **Fix Slash Commands** (I can help with this)
   - Create symbolic links or wrappers
   - Make agents accessible via `/bmad:*` commands

3. **Add Global Alias**
   ```bash
   echo 'alias bmad-init="/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh"' >> ~/.zshrc
   source ~/.zshrc
   ```

### Phase 2: Optimization (Do This Week)

4. **Enable Global BMad CLI**
   ```bash
   cd /Users/hbl/Documents/BMAD-METHOD
   npm link
   ```

5. **Create Environment Config**
   - Set up `~/.bmadrc`
   - Add auto-detection to shell

6. **Create Quick Reference**
   - Workflow cheat sheet
   - Decision tree for which agent/workflow to use

### Phase 3: Enhancement (Do When Needed)

7. **Set Up Remaining Projects**
   ```bash
   bmad-init /Users/hbl/Documents/mermaid-dynamic
   bmad-init /Users/hbl/Documents/visa-ai
   # ... etc for all /Documents/* projects
   ```

8. **Custom Workflows** (using BMB module)
   - Create domain-specific agents
   - Build custom workflows for your common patterns

9. **Git Templates**
   - BMad commit message templates
   - Pre-commit hooks for BMad workflow validation

---

## 📊 Current vs. Optimized State

| Feature | Current | Optimized |
|---------|---------|-----------|
| **Modules** | BMM only | BMM + CIS + BMB |
| **Slash Commands** | ❌ Not working | ✅ Full access |
| **Project Setup** | Manual script | Global alias `bmad-init` |
| **Global CLI** | ❌ Not available | ✅ `bmad` command |
| **Environment** | Not configured | Auto-detection, vars set |
| **Documentation** | Scattered | Quick ref + decision tree |
| **Git Integration** | Standard | BMad templates |
| **Automation** | Manual workflows | Streamlined + shortcuts |

---

## 🚀 Next Steps

**Which phase would you like to tackle first?**

1. **Phase 1 (Critical)** - Install missing modules & fix slash commands
2. **Phase 2 (Optimize)** - Global CLI & environment setup
3. **Phase 3 (Enhance)** - Set up all projects & create custom workflows

**I can help with any/all of these!** Just let me know which is most important to you right now.

---

## 📋 Quick Commands Summary

```bash
# Install more modules
cd /Users/hbl/Documents/BMAD-METHOD && npm run install:bmad

# Set up new project
/Users/hbl/Documents/BMAD-METHOD/setup-project-bmad.sh /path/to/project

# Check BMad status
node /Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js status

# View installed modules
cat /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml

# List all projects with BMad
find /Users/hbl/Documents -type f -name ".bmadrc" -exec dirname {} \;
```

---

**BMad v6 Alpha** | Generated: 2025-10-07
