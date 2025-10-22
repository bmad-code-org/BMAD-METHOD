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
git add bmad/*/agents/ bmad/_cfg/agent-manifest.csv bmad/core/preservation/
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
  ls -t bmad-agents-*.tar.gz 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true
  echo "✓ Cleanup: Kept last 30 backups"
fi

# Tier 3: iCloud Sync
echo "📦 Tier 3: Syncing to iCloud..."
mkdir -p "$ICLOUD_DIR"
rsync -av --delete \
  "$BMAD_ROOT/bmad/" \
  "$ICLOUD_DIR/" \
  --exclude=".DS_Store" \
  --exclude="node_modules" 2>&1 | grep -v "^sending\|^sent\|^total"
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
echo ""
echo "📋 Agent Count: $(wc -l < "$BMAD_ROOT/bmad/_cfg/agent-manifest.csv") agents backed up"
