# BMAD Agent Preservation & Backup System

## 🎯 Purpose
Preserve all custom BMAD agents you've personally created, ensuring they're:
- Backed up across multiple locations
- Version controlled in git
- Exportable to other projects
- Recoverable after system failures
- Shareable with team members

---

## 📦 What Gets Backed Up

### Agent Definition Files
```
bmad/core/agents/
├── bmad-master.md
├── bmad-builder.md
├── genesis-keeper.md (Athena)
├── mcp-guardian.md (Atlas)
└── [your-custom-agents].md

bmad/bmm/agents/
├── analyst.md (Mary)
├── architect.md (Winston)
├── dev-impl.md (Amelia)
├── pm.md (John)
├── sm.md (Bob)
├── tea.md (Murat)
├── ux-expert.md (Sally)
└── lukasz-ai.md

bmad/cis/agents/
├── brainstorming-coach.md (Carson)
├── creative-problem-solver.md (Dr. Quinn)
├── design-thinking-coach.md (Maya)
├── innovation-strategist.md (Victor)
└── storyteller.md (Sophia)
```

### Agent Manifest
```
bmad/_cfg/agent-manifest.csv
```

### Custom Workflows Using Agents
```
bmad/core/workflows/party-mode/
├── workflow.yaml
├── instructions.md
└── template.md
```

---

## 🔄 Three-Tier Backup Strategy

### Tier 1: Local Git Repository (Primary)
**Location**: `/Users/hbl/Documents/BMAD-METHOD/.git`

```bash
# Current status
cd /Users/hbl/Documents/BMAD-METHOD
git status

# Create backup commit
git add bmad/
git commit -m "Backup: All custom BMAD agents $(date +%Y-%m-%d)"
git push origin main
```

**Frequency**: After every agent creation/modification

---

### Tier 2: External Backup Archive
**Location**: `/Users/hbl/Documents/BMAD-AGENT-BACKUPS/`

```bash
# Create timestamped backup
export BACKUP_DIR="/Users/hbl/Documents/BMAD-AGENT-BACKUPS"
export BACKUP_DATE=$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p "$BACKUP_DIR/$BACKUP_DATE"

# Copy all agents
cp -r /Users/hbl/Documents/BMAD-METHOD/bmad/core/agents "$BACKUP_DIR/$BACKUP_DATE/"
cp -r /Users/hbl/Documents/BMAD-METHOD/bmad/bmm/agents "$BACKUP_DIR/$BACKUP_DATE/"
cp -r /Users/hbl/Documents/BMAD-METHOD/bmad/cis/agents "$BACKUP_DIR/$BACKUP_DATE/"
cp /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/agent-manifest.csv "$BACKUP_DIR/$BACKUP_DATE/"

# Create archive
cd "$BACKUP_DIR"
tar -czf "bmad-agents-$BACKUP_DATE.tar.gz" "$BACKUP_DATE"

echo "✅ Backup created: $BACKUP_DIR/bmad-agents-$BACKUP_DATE.tar.gz"
```

**Frequency**: Weekly or before major changes

---

### Tier 3: Cloud Storage (GitHub/iCloud)
**Location**: GitHub repository + iCloud Drive

#### Option A: GitHub Private Repository
```bash
# Create dedicated agent backup repo
gh repo create bmad-agents-backup --private --description "Custom BMAD agent definitions backup"

# Initialize and push
cd /Users/hbl/Documents/BMAD-METHOD
git subtree push --prefix=bmad origin bmad-agents-backup

# Or create separate repo
mkdir ~/bmad-agents-export
cp -r bmad/*/agents ~/bmad-agents-export/
cp bmad/_cfg/agent-manifest.csv ~/bmad-agents-export/
cd ~/bmad-agents-export
git init
git add .
git commit -m "Initial agent backup"
git remote add origin git@github.com:yourusername/bmad-agents-backup.git
git push -u origin main
```

#### Option B: iCloud Drive
```bash
# Sync to iCloud
export ICLOUD_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents"
mkdir -p "$ICLOUD_DIR"

rsync -av --delete \
  /Users/hbl/Documents/BMAD-METHOD/bmad/ \
  "$ICLOUD_DIR/"

echo "✅ Synced to iCloud: $ICLOUD_DIR"
```

**Frequency**: Daily automated sync

---

## 🛠️ Automated Backup Script

**File**: `/Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh`

```bash
#!/bin/bash

# BMAD Agent Backup Automation Script
# Usage: ./backup-agents.sh [quick|full]

set -e

BMAD_ROOT="/Users/hbl/Documents/BMAD-METHOD"
BACKUP_ROOT="/Users/hbl/Documents/BMAD-AGENT-BACKUPS"
ICLOUD_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents"
BACKUP_DATE=$(date +%Y-%m-%d_%H-%M-%S)

echo "🔧 BMAD Agent Backup System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Tier 1: Git Commit
echo "📦 Tier 1: Creating git commit..."
cd "$BMAD_ROOT"
git add bmad/*/agents/ bmad/_cfg/agent-manifest.csv
if git diff --cached --quiet; then
  echo "✓ No changes to commit"
else
  git commit -m "Agent backup: $BACKUP_DATE"
  echo "✅ Git commit created"
fi

# Tier 2: Local Archive
if [ "$1" == "full" ]; then
  echo "📦 Tier 2: Creating local archive..."
  mkdir -p "$BACKUP_ROOT/$BACKUP_DATE"

  cp -r "$BMAD_ROOT/bmad/core/agents" "$BACKUP_ROOT/$BACKUP_DATE/core-agents"
  cp -r "$BMAD_ROOT/bmad/bmm/agents" "$BACKUP_ROOT/$BACKUP_DATE/bmm-agents"
  cp -r "$BMAD_ROOT/bmad/cis/agents" "$BACKUP_ROOT/$BACKUP_DATE/cis-agents"
  cp "$BMAD_ROOT/bmad/_cfg/agent-manifest.csv" "$BACKUP_ROOT/$BACKUP_DATE/"

  cd "$BACKUP_ROOT"
  tar -czf "bmad-agents-$BACKUP_DATE.tar.gz" "$BACKUP_DATE"
  rm -rf "$BACKUP_DATE"

  echo "✅ Archive created: bmad-agents-$BACKUP_DATE.tar.gz"

  # Keep only last 30 backups
  ls -t bmad-agents-*.tar.gz | tail -n +31 | xargs -r rm
  echo "✓ Cleanup: Kept last 30 backups"
fi

# Tier 3: iCloud Sync
echo "📦 Tier 3: Syncing to iCloud..."
mkdir -p "$ICLOUD_DIR"
rsync -av --delete \
  "$BMAD_ROOT/bmad/" \
  "$ICLOUD_DIR/" \
  --exclude=".DS_Store"
echo "✅ Synced to iCloud"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Backup Complete!"
echo ""
echo "📊 Backup Locations:"
echo "  - Git: $BMAD_ROOT/.git"
if [ "$1" == "full" ]; then
  echo "  - Archive: $BACKUP_ROOT/bmad-agents-$BACKUP_DATE.tar.gz"
fi
echo "  - iCloud: $ICLOUD_DIR"
```

Make it executable:
```bash
chmod +x /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh
```

**Usage**:
```bash
# Quick backup (git + iCloud)
./backup-agents.sh quick

# Full backup (git + archive + iCloud)
./backup-agents.sh full
```

---

## 🔄 Restoration Procedures

### Restore from Git
```bash
cd /Users/hbl/Documents/BMAD-METHOD
git log --oneline --grep="Agent backup"  # Find backup commit
git checkout <commit-hash> -- bmad/
```

### Restore from Archive
```bash
cd /Users/hbl/Documents/BMAD-AGENT-BACKUPS
ls -lt bmad-agents-*.tar.gz | head -5  # List recent backups
tar -xzf bmad-agents-YYYY-MM-DD_HH-MM-SS.tar.gz
cp -r YYYY-MM-DD_HH-MM-SS/* /Users/hbl/Documents/BMAD-METHOD/bmad/
```

### Restore from iCloud
```bash
rsync -av \
  "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/" \
  /Users/hbl/Documents/BMAD-METHOD/bmad/
```

---

## 📤 Export Agents to New Project

### Step 1: Create Agent Export Package
```bash
#!/bin/bash
# File: export-agents.sh

PROJECT_NAME="$1"
EXPORT_DIR="$HOME/bmad-agent-exports/$PROJECT_NAME"

mkdir -p "$EXPORT_DIR/agents"
mkdir -p "$EXPORT_DIR/config"

# Copy all agents
cp -r /Users/hbl/Documents/BMAD-METHOD/bmad/*/agents "$EXPORT_DIR/"

# Copy manifest
cp /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/agent-manifest.csv "$EXPORT_DIR/config/"

# Create import instructions
cat > "$EXPORT_DIR/IMPORT_README.md" <<'EOF'
# BMAD Agent Import Instructions

## Installation
1. Copy agent files to your project:
   ```bash
   cp -r agents/* YOUR_PROJECT/bmad/
   ```

2. Merge manifest entries:
   ```bash
   cat config/agent-manifest.csv >> YOUR_PROJECT/bmad/_cfg/agent-manifest.csv
   ```

3. Verify agents loaded:
   ```bash
   # In Party Mode
   /bmad:core:workflows:party-mode
   ```

## Customization
- Edit agent .md files to customize for your project
- Update manifest with project-specific paths
- Test in Party Mode before production use
EOF

# Create archive
cd "$HOME/bmad-agent-exports"
tar -czf "$PROJECT_NAME-agents.tar.gz" "$PROJECT_NAME"

echo "✅ Export complete: $HOME/bmad-agent-exports/$PROJECT_NAME-agents.tar.gz"
```

**Usage**:
```bash
./export-agents.sh signright-au
./export-agents.sh visa-ai
./export-agents.sh my-new-project
```

### Step 2: Import to New Project
```bash
# In new project
cd /path/to/new-project
tar -xzf ~/bmad-agent-exports/PROJECT_NAME-agents.tar.gz
cd PROJECT_NAME
cat IMPORT_README.md
# Follow instructions
```

---

## 🤖 Automated Daily Backup (Cron/LaunchAgent)

### Option 1: Cron Job
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh quick >> /tmp/bmad-backup.log 2>&1

# Full backup weekly (Sunday 3 AM)
0 3 * * 0 /Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh full >> /tmp/bmad-backup.log 2>&1
```

### Option 2: LaunchAgent (macOS)
**File**: `~/Library/LaunchAgents/com.bmad.agent-backup.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.bmad.agent-backup</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/hbl/Documents/BMAD-METHOD/bmad/core/preservation/backup-agents.sh</string>
        <string>quick</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>2</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/bmad-backup.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/bmad-backup-error.log</string>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.bmad.agent-backup.plist
launchctl start com.bmad.agent-backup  # Test immediately
```

---

## 📋 Agent Inventory Report

**Generate a complete inventory of your agents:**

```bash
#!/bin/bash
# File: agent-inventory.sh

echo "# BMAD Agent Inventory Report"
echo "Generated: $(date)"
echo ""
echo "## Summary"
echo "Total Agents: $(wc -l < /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/agent-manifest.csv)"
echo ""
echo "## Agents by Module"
echo ""

for module in core bmm cis; do
  count=$(find /Users/hbl/Documents/BMAD-METHOD/bmad/$module/agents -name "*.md" 2>/dev/null | wc -l)
  echo "### $module: $count agents"
  find /Users/hbl/Documents/BMAD-METHOD/bmad/$module/agents -name "*.md" 2>/dev/null | while read file; do
    name=$(basename "$file" .md)
    displayName=$(grep "^$name," /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/agent-manifest.csv | cut -d',' -f2)
    icon=$(grep "^$name," /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/agent-manifest.csv | cut -d',' -f4)
    echo "- $icon $displayName ($name)"
  done
  echo ""
done

echo "## File Sizes"
du -sh /Users/hbl/Documents/BMAD-METHOD/bmad/*/agents 2>/dev/null
echo ""
echo "## Recent Modifications"
find /Users/hbl/Documents/BMAD-METHOD/bmad/*/agents -name "*.md" -mtime -7 2>/dev/null | while read file; do
  echo "- $(basename "$file" .md): $(stat -f "%Sm" "$file")"
done
```

**Run it:**
```bash
chmod +x agent-inventory.sh
./agent-inventory.sh > AGENT_INVENTORY.md
```

---

## ✅ Verification Checklist

After backup, verify:

```bash
# 1. Git has latest agents
cd /Users/hbl/Documents/BMAD-METHOD
git log -1 --grep="Agent backup"

# 2. Archive exists
ls -lh /Users/hbl/Documents/BMAD-AGENT-BACKUPS/*.tar.gz | head -5

# 3. iCloud synced
ls -lh "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/"

# 4. Agent count matches
wc -l bmad/_cfg/agent-manifest.csv
find bmad/*/agents -name "*.md" | wc -l

# 5. All agents loadable in Party Mode
# Start Claude Code, run: /bmad:core:workflows:party-mode
```

---

## 🚨 Disaster Recovery

**Complete system failure - restore everything:**

```bash
#!/bin/bash
# File: disaster-recovery.sh

echo "🚨 BMAD Agent Disaster Recovery"
echo "This will restore all agents from backups"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Aborted"
  exit 1
fi

# Option 1: Restore from iCloud (fastest)
echo "Attempting iCloud restore..."
if [ -d "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents" ]; then
  rsync -av \
    "$HOME/Library/Mobile Documents/com~apple~CloudDocs/BMAD-Agents/" \
    /Users/hbl/Documents/BMAD-METHOD/bmad/
  echo "✅ Restored from iCloud"
  exit 0
fi

# Option 2: Restore from latest archive
echo "Attempting archive restore..."
LATEST_BACKUP=$(ls -t /Users/hbl/Documents/BMAD-AGENT-BACKUPS/bmad-agents-*.tar.gz 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
  tar -xzf "$LATEST_BACKUP" -C /tmp
  BACKUP_DIR=$(basename "$LATEST_BACKUP" .tar.gz | sed 's/bmad-agents-//')
  cp -r "/tmp/$BACKUP_DIR/"* /Users/hbl/Documents/BMAD-METHOD/bmad/
  echo "✅ Restored from archive: $LATEST_BACKUP"
  exit 0
fi

# Option 3: Restore from git
echo "Attempting git restore..."
cd /Users/hbl/Documents/BMAD-METHOD
git log --oneline --grep="Agent backup" | head -1
read -p "Enter commit hash to restore: " commit
git checkout "$commit" -- bmad/
echo "✅ Restored from git commit: $commit"
```

---

**📚 Now let me hand this to Athena to document permanently...**
