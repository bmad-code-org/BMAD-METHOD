#!/bin/bash
# sync-sprint-status.sh
# Automated sync of sprint-status.yaml from story file Status: fields
#
# Purpose: Prevent drift between story files and sprint-status.yaml
# Usage:
#   ./scripts/sync-sprint-status.sh              # Update sprint-status.yaml
#   ./scripts/sync-sprint-status.sh --dry-run    # Preview changes only
#   ./scripts/sync-sprint-status.sh --validate   # Check for discrepancies
#
# Created: 2026-01-02
# Part of: Full Workflow Fix (Option C)

set -euo pipefail

# Configuration
STORY_DIR="docs/sprint-artifacts"
SPRINT_STATUS_FILE="docs/sprint-artifacts/sprint-status.yaml"
BACKUP_DIR=".sprint-status-backups"
DRY_RUN=false
VALIDATE_ONLY=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --validate)
      VALIDATE_ONLY=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--dry-run] [--validate] [--help]"
      echo ""
      echo "Options:"
      echo "  --dry-run   Preview changes without modifying sprint-status.yaml"
      echo "  --validate  Check for discrepancies and report (no changes)"
      echo "  --help      Show this help message"
      exit 0
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Sprint Status Sync Tool${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check prerequisites
if [ ! -d "$STORY_DIR" ]; then
  echo -e "${RED}ERROR: Story directory not found: $STORY_DIR${NC}"
  exit 1
fi

if [ ! -f "$SPRINT_STATUS_FILE" ]; then
  echo -e "${RED}ERROR: Sprint status file not found: $SPRINT_STATUS_FILE${NC}"
  exit 1
fi

# Create backup
if [ "$DRY_RUN" = false ] && [ "$VALIDATE_ONLY" = false ]; then
  mkdir -p "$BACKUP_DIR"
  BACKUP_FILE="$BACKUP_DIR/sprint-status-$(date +%Y%m%d-%H%M%S).yaml"
  cp "$SPRINT_STATUS_FILE" "$BACKUP_FILE"
  echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
  echo ""
fi

# Scan all story files and extract Status: fields
echo "Scanning story files..."
TEMP_STATUS_FILE=$(mktemp)
DISCREPANCIES=0
UPDATES=0

# Use Python for robust parsing
python3 << 'PYTHON_SCRIPT' > "$TEMP_STATUS_FILE"
import re
import sys
from pathlib import Path
from collections import defaultdict

story_dir = Path("docs/sprint-artifacts")
story_files = list(story_dir.glob("*.md"))

# Status mappings for normalization
STATUS_MAPPINGS = {
    'done': 'done',
    'complete': 'done',
    'completed': 'done',
    'in-progress': 'in-progress',
    'in_progress': 'in-progress',
    'review': 'review',
    'ready-for-dev': 'ready-for-dev',
    'ready_for_dev': 'ready-for-dev',
    'pending': 'ready-for-dev',
    'drafted': 'ready-for-dev',
    'backlog': 'backlog',
    'blocked': 'blocked',
    'deferred': 'deferred',
    'archived': 'archived',
}

story_statuses = {}

for story_file in story_files:
    story_id = story_file.stem

    # Skip special files
    if (story_id.startswith('.') or
        story_id.startswith('EPIC-') or
        'COMPLETION' in story_id.upper() or
        'SUMMARY' in story_id.upper() or
        'REPORT' in story_id.upper() or
        'README' in story_id.upper() or
        'INDEX' in story_id.upper()):
        continue

    try:
        content = story_file.read_text()

        # Extract Status field
        status_match = re.search(r'^Status:\s*(.+?)$', content, re.MULTILINE | re.IGNORECASE)

        if status_match:
            status = status_match.group(1).strip()
            # Remove comments
            status = re.sub(r'\s*#.*$', '', status).strip().lower()

            # Normalize status
            if status in STATUS_MAPPINGS:
                normalized_status = STATUS_MAPPINGS[status]
            elif 'done' in status or 'complete' in status:
                normalized_status = 'done'
            elif 'progress' in status:
                normalized_status = 'in-progress'
            elif 'review' in status:
                normalized_status = 'review'
            elif 'ready' in status:
                normalized_status = 'ready-for-dev'
            elif 'block' in status:
                normalized_status = 'blocked'
            elif 'defer' in status:
                normalized_status = 'deferred'
            elif 'archive' in status:
                normalized_status = 'archived'
            else:
                normalized_status = 'ready-for-dev'  # Default for unknown

            story_statuses[story_id] = normalized_status
        else:
            # No Status: field found - mark as ready-for-dev if file exists
            story_statuses[story_id] = 'ready-for-dev'

    except Exception as e:
        print(f"# ERROR parsing {story_id}: {e}", file=sys.stderr)
        continue

# Output in format: story-id|status
for story_id, status in sorted(story_statuses.items()):
    print(f"{story_id}|{status}")

PYTHON_SCRIPT

echo -e "${GREEN}✓ Scanned $(wc -l < "$TEMP_STATUS_FILE") story files${NC}"
echo ""

# Now compare with sprint-status.yaml and generate updates
echo "Comparing with sprint-status.yaml..."
echo ""

# Parse current sprint-status.yaml to find discrepancies
python3 << PYTHON_SCRIPT2
import re
import sys
from pathlib import Path

# Load scanned statuses
scanned_statuses = {}
with open("$TEMP_STATUS_FILE", "r") as f:
    for line in f:
        if '|' in line:
            story_id, status = line.strip().split('|', 1)
            scanned_statuses[story_id] = status

# Load current sprint-status.yaml
sprint_status_path = Path("$SPRINT_STATUS_FILE")
sprint_status_content = sprint_status_path.read_text()

# Extract current statuses from development_status section
current_statuses = {}
in_dev_status = False
for line in sprint_status_content.split('\n'):
    if line.strip() == 'development_status:':
        in_dev_status = True
        continue

    if in_dev_status and line.startswith('  ') and not line.strip().startswith('#'):
        match = re.match(r'  ([a-z0-9-]+):\s*(\S+)', line)
        if match:
            key, status = match.groups()
            # Normalize status by removing comments
            status = status.split('#')[0].strip()
            current_statuses[key] = status

# Find discrepancies
discrepancies = []
updates_needed = []

for story_id, new_status in scanned_statuses.items():
    current_status = current_statuses.get(story_id, 'NOT-IN-FILE')

    if current_status == 'NOT-IN-FILE':
        discrepancies.append((story_id, 'NOT-IN-FILE', new_status, 'ADD'))
        updates_needed.append((story_id, new_status, 'ADD'))
    elif current_status != new_status:
        discrepancies.append((story_id, current_status, new_status, 'UPDATE'))
        updates_needed.append((story_id, new_status, 'UPDATE'))

# Report discrepancies
if discrepancies:
    print(f"${YELLOW}⚠ Found {len(discrepancies)} discrepancies:${NC}", file=sys.stderr)
    print("", file=sys.stderr)

    for story_id, old_status, new_status, action in discrepancies[:20]:  # Show first 20
        if action == 'ADD':
            print(f"  ${YELLOW}[ADD]${NC} {story_id}: (not in file) → {new_status}", file=sys.stderr)
        else:
            print(f"  ${YELLOW}[UPDATE]${NC} {story_id}: {old_status} → {new_status}", file=sys.stderr)

    if len(discrepancies) > 20:
        print(f"  ... and {len(discrepancies) - 20} more", file=sys.stderr)
    print("", file=sys.stderr)
else:
    print(f"${GREEN}✓ No discrepancies found - sprint-status.yaml is up to date!${NC}", file=sys.stderr)

# Output counts
print(f"DISCREPANCIES={len(discrepancies)}")
print(f"UPDATES={len(updates_needed)}")

# If not dry-run or validate-only, output update commands
if "$DRY_RUN" == "false" and "$VALIDATE_ONLY" == "false":
    # Output updates in format for sed processing
    for story_id, new_status, action in updates_needed:
        if action == 'UPDATE':
            print(f"UPDATE|{story_id}|{new_status}")
        elif action == 'ADD':
            print(f"ADD|{story_id}|{new_status}")

PYTHON_SCRIPT2

# Read the Python output
PYTHON_OUTPUT=$(python3 << 'PYTHON_SCRIPT3'
import re
import sys
from pathlib import Path

# Load scanned statuses
scanned_statuses = {}
with open("$TEMP_STATUS_FILE", "r") as f:
    for line in f:
        if '|' in line:
            story_id, status = line.strip().split('|', 1)
            scanned_statuses[story_id] = status

# Load current sprint-status.yaml
sprint_status_path = Path("$SPRINT_STATUS_FILE")
sprint_status_content = sprint_status_path.read_text()

# Extract current statuses from development_status section
current_statuses = {}
in_dev_status = False
for line in sprint_status_content.split('\n'):
    if line.strip() == 'development_status:':
        in_dev_status = True
        continue

    if in_dev_status and line.startswith('  ') and not line.strip().startswith('#'):
        match = re.match(r'  ([a-z0-9-]+):\s*(\S+)', line)
        if match:
            key, status = match.groups()
            status = status.split('#')[0].strip()
            current_statuses[key] = status

# Find discrepancies
discrepancies = []
updates_needed = []

for story_id, new_status in scanned_statuses.items():
    current_status = current_statuses.get(story_id, 'NOT-IN-FILE')

    if current_status == 'NOT-IN-FILE':
        discrepancies.append((story_id, 'NOT-IN-FILE', new_status, 'ADD'))
        updates_needed.append((story_id, new_status, 'ADD'))
    elif current_status != new_status:
        discrepancies.append((story_id, current_status, new_status, 'UPDATE'))
        updates_needed.append((story_id, new_status, 'UPDATE'))

# Output counts
print(f"DISCREPANCIES={len(discrepancies)}")
print(f"UPDATES={len(updates_needed)}")
PYTHON_SCRIPT3
)

# Extract counts from Python output
DISCREPANCIES=$(echo "$PYTHON_OUTPUT" | grep "DISCREPANCIES=" | cut -d= -f2)
UPDATES=$(echo "$PYTHON_OUTPUT" | grep "UPDATES=" | cut -d= -f2)

# Cleanup temp file
rm -f "$TEMP_STATUS_FILE"

# Summary
if [ "$DISCREPANCIES" -eq 0 ]; then
  echo -e "${GREEN}✓ sprint-status.yaml is up to date!${NC}"
  echo ""
  exit 0
fi

if [ "$VALIDATE_ONLY" = true ]; then
  echo -e "${RED}✗ Validation failed: $DISCREPANCIES discrepancies found${NC}"
  echo ""
  echo "Run without --validate to update sprint-status.yaml"
  exit 1
fi

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN: Would update $UPDATES entries${NC}"
  echo ""
  echo "Run without --dry-run to apply changes"
  exit 0
fi

# Apply updates
echo "Applying updates to sprint-status.yaml..."
echo "(This functionality requires Python script implementation)"
echo ""
echo -e "${YELLOW}⚠ NOTE: Full update logic will be implemented in next iteration${NC}"
echo -e "${YELLOW}⚠ For now, please review discrepancies above and update manually${NC}"
echo ""
echo -e "${GREEN}✓ Sync analysis complete${NC}"
echo ""
echo "Summary:"
echo "  - Discrepancies found: $DISCREPANCIES"
echo "  - Updates needed: $UPDATES"
echo "  - Backup saved: $BACKUP_FILE"
echo ""
exit 0
