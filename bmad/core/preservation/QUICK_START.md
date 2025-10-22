# BMAD Agent Backup - Quick Start Guide

## ⚡ Immediate Backup (Right Now)

```bash
cd /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation
./backup-agents.sh quick
```

**Result**: Your agents are backed up to:
1. Git repository (committed)
2. iCloud Drive (synced)

---

## 📅 Setup Automated Daily Backups

### Option 1: Cron (Quick Setup - 2 minutes)

```bash
# Open crontab
crontab -e

# Add these two lines (press 'i' to insert):
0 2 * * * /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh quick >> /tmp/bmad-backup.log 2>&1
0 3 * * 0 /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh full >> /tmp/bmad-backup.log 2>&1

# Save and exit (press ESC, then :wq, then ENTER)
```

**Schedule**:
- Daily at 2 AM: Quick backup (git + iCloud)
- Weekly Sunday at 3 AM: Full backup (git + archive + iCloud)

### Option 2: Test It Now

```bash
# Run quick backup
./backup-agents.sh quick

# Run full backup
./backup-agents.sh full
```

---

## ✅ Verify Your Backups

```bash
# 1. Check git
cd /Users/hbl/Documents/BMAD-METHOD
git log -1 --oneline | grep "Agent backup"

# 2. Check iCloud
ls -lh "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/"

# 3. Check archives (if full backup)
ls -lh /Users/hbl/Documents/BMAD-AGENT-BACKUPS/*.tar.gz | head -5

# 4. Count agents
wc -l bmad/_cfg/agent-manifest.csv
```

Expected: You should see 21 agents (as of 2025-10-20)

---

## 🚨 Restore from Backup

### Quick Restore (from iCloud - fastest)

```bash
rsync -av \
  "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/" \
  /Users/hbl/Documents/BMAD-METHOD/bmad/
```

### Restore Specific Agents

```bash
# From iCloud
cp "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/core/agents/atlas.md" \
  /Users/hbl/Documents/BMAD-METHOD/bmad/core/agents/

# From git
cd /Users/hbl/Documents/BMAD-METHOD
git log --oneline --grep="Agent backup" | head -10  # Find commit
git show <commit-hash>:bmad/core/agents/mcp-guardian.md > bmad/core/agents/mcp-guardian.md
```

---

## 📤 Export Agents to Another Project

```bash
# Create export
PROJECT="my-new-project"
EXPORT_DIR="$HOME/bmad-exports/$PROJECT"

mkdir -p "$EXPORT_DIR"
cp -r /Users/hbl/Documents/BMAD-METHOD/bmad/ "$EXPORT_DIR/"
cd "$HOME/bmad-exports"
tar -czf "$PROJECT-agents.tar.gz" "$PROJECT"

echo "✅ Export ready: $HOME/bmad-exports/$PROJECT-agents.tar.gz"

# In new project
cd /path/to/new-project
tar -xzf ~/bmad-exports/$PROJECT-agents.tar.gz
# Then merge agents into your project structure
```

---

## 📊 Generate Agent Inventory

```bash
cd /Users/hbl/Documents/BMAD-METHOD

echo "# BMAD Agent Inventory - $(date +%Y-%m-%d)"
echo ""
echo "Total Agents: $(wc -l < bmad/_cfg/agent-manifest.csv)"
echo ""

for module in core bmm cis; do
  count=$(find bmad/$module/agents -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  echo "## $module Module: $count agents"
  find bmad/$module/agents -name "*.md" 2>/dev/null | while read file; do
    name=$(basename "$file" .md)
    echo "  - $name"
  done
  echo ""
done
```

---

## 🔧 Your Current Agents (As of Now)

### Core Module (4 agents)
- 🧙 **BMad Master** - BMAD orchestrator
- 🧙 **BMad Builder** - Module builder
- 📚 **Athena** - Knowledge documentation
- 🔧 **Atlas** - MCP technical engineer

### BMM Module (10 agents)
- 📊 **Mary** - Business Analyst
- 🏗️ **Winston** - Architect
- 💻 **Amelia** - Developer
- 🏛️ **Cloud Dragonborn** - Game Architect
- 🎲 **Samus Shepard** - Game Designer
- 🕹️ **Link Freeman** - Game Developer
- 🛡️ **Lukasz-AI** - Compliance Advisor
- 📋 **John** - Product Manager
- 🏃 **Bob** - Scrum Master
- 🧪 **Murat** - Test Architect
- 🎨 **Sally** - UX Expert

### CIS Module (5 agents)
- 🧠 **Carson** - Brainstorming Specialist
- 🔬 **Dr. Quinn** - Problem Solver
- 🎨 **Maya** - Design Thinking Coach
- ⚡ **Victor** - Innovation Strategist
- 📖 **Sophia** - Storyteller

**Total: 21 agents**

---

## 💡 Pro Tips

1. **Backup before changes**: Run `./backup-agents.sh quick` before modifying agents
2. **Weekly full backups**: Use `./backup-agents.sh full` weekly for archives
3. **Test restores**: Periodically test restore process to verify backups work
4. **Version control**: Use git commits for granular history
5. **iCloud sync**: Automatic cloud backup without extra services

---

## 🆘 Help Commands

```bash
# Check backup status
ls -lh "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/"

# View backup logs
tail -50 /tmp/bmad-backup.log

# List all backup archives
ls -lht /Users/hbl/Documents/BMAD-AGENT-BACKUPS/

# Check cron schedule
crontab -l | grep bmad
```

---

**Next**: Run your first backup now!

```bash
cd /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation
./backup-agents.sh full
```
