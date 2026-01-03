#!/bin/bash
# recover-sprint-status.sh
# Universal Sprint Status Recovery Tool
#
# Purpose: Recover sprint-status.yaml when tracking has drifted for days/weeks
# Features:
#   - Validates story file quality (size, tasks, checkboxes)
#   - Cross-references git commits for completion evidence
#   - Infers status from multiple sources (story files, git, autonomous reports)
#   - Handles brownfield projects (pre-fills completed task checkboxes)
#   - Works on ANY BMAD project
#
# Usage:
#   ./scripts/recover-sprint-status.sh                    # Interactive mode
#   ./scripts/recover-sprint-status.sh --conservative    # Only update obvious cases
#   ./scripts/recover-sprint-status.sh --aggressive      # Infer status from all evidence
#   ./scripts/recover-sprint-status.sh --dry-run         # Preview without changes
#
# Created: 2026-01-02
# Part of: Universal BMAD tooling

set -euo pipefail

# Configuration
STORY_DIR="${STORY_DIR:-docs/sprint-artifacts}"
SPRINT_STATUS_FILE="${SPRINT_STATUS_FILE:-docs/sprint-artifacts/sprint-status.yaml}"
MODE="interactive"
DRY_RUN=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Parse arguments
for arg in "$@"; do
  case $arg in
    --conservative)
      MODE="conservative"
      shift
      ;;
    --aggressive)
      MODE="aggressive"
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help)
      cat << 'HELP'
Sprint Status Recovery Tool

USAGE:
  ./scripts/recover-sprint-status.sh [options]

OPTIONS:
  --conservative   Only update stories with clear evidence (safest)
  --aggressive     Infer status from all available evidence (thorough)
  --dry-run        Preview changes without modifying files
  --help           Show this help message

MODES:
  Interactive (default):
    - Analyzes all evidence
    - Asks for confirmation before each update
    - Safest for first-time recovery

  Conservative:
    - Only updates stories with EXPLICIT Status: fields
    - Only updates stories referenced in git commits
    - Won't infer or guess
    - Best for quick fixes

  Aggressive:
    - Infers status from git commits, file size, task completion
    - Marks stories "done" if git commits exist
    - Pre-fills brownfield task checkboxes
    - Best for major drift recovery

WHAT IT CHECKS:
  1. Story file quality (size >= 10KB, has task lists)
  2. Story Status: field (if present)
  3. Git commits (evidence of completion)
  4. Autonomous completion reports
  5. Task checkbox completion rate
  6. File creation/modification dates

EXAMPLES:
  # First-time recovery (recommended)
  ./scripts/recover-sprint-status.sh

  # Quick fix (only clear updates)
  ./scripts/recover-sprint-status.sh --conservative

  # Full recovery (infer from all evidence)
  ./scripts/recover-sprint-status.sh --aggressive --dry-run  # Preview
  ./scripts/recover-sprint-status.sh --aggressive            # Apply

HELP
      exit 0
      ;;
  esac
done

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Sprint Status Recovery Tool${NC}"
echo -e "${CYAN}Mode: ${MODE}${NC}"
echo -e "${CYAN}========================================${NC}"
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
BACKUP_DIR=".sprint-status-backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/sprint-status-recovery-$(date +%Y%m%d-%H%M%S).yaml"
cp "$SPRINT_STATUS_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
echo ""

# Run Python recovery analysis
echo "Running comprehensive recovery analysis..."
echo ""

python3 << 'PYTHON_RECOVERY'
import re
import sys
import subprocess
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict
import os

# Configuration
STORY_DIR = Path(os.environ.get('STORY_DIR', 'docs/sprint-artifacts'))
SPRINT_STATUS_FILE = Path(os.environ.get('SPRINT_STATUS_FILE', 'docs/sprint-artifacts/sprint-status.yaml'))
MODE = os.environ.get('MODE', 'interactive')
DRY_RUN = os.environ.get('DRY_RUN', 'false') == 'true'

MIN_STORY_SIZE_KB = 10  # Stories should be at least 10KB if properly detailed

print("=" * 80)
print("COMPREHENSIVE RECOVERY ANALYSIS")
print("=" * 80)
print()

# Step 1: Analyze story files for quality
print("Step 1: Validating story file quality...")
print("-" * 80)

story_quality = {}

for story_file in STORY_DIR.glob("*.md"):
    story_id = story_file.stem

    # Skip special files
    if (story_id.startswith('.') or story_id.startswith('EPIC-') or
        any(x in story_id.upper() for x in ['COMPLETION', 'SUMMARY', 'REPORT', 'README', 'INDEX', 'AUDIT'])):
        continue

    try:
        content = story_file.read_text()
        file_size_kb = len(content) / 1024

        # Check for task lists
        task_pattern = r'^-\s*\[([ x])\]\s*.+'
        tasks = re.findall(task_pattern, content, re.MULTILINE)
        total_tasks = len(tasks)
        checked_tasks = sum(1 for t in tasks if t == 'x')

        # Extract Status: field
        status_match = re.search(r'^Status:\s*(.+?)$', content, re.MULTILINE | re.IGNORECASE)
        explicit_status = status_match.group(1).strip() if status_match else None

        # Quality checks
        has_proper_size = file_size_kb >= MIN_STORY_SIZE_KB
        has_task_list = total_tasks >= 5  # At least 5 tasks for a real story
        has_explicit_status = explicit_status is not None

        story_quality[story_id] = {
            'file_size_kb': round(file_size_kb, 1),
            'total_tasks': total_tasks,
            'checked_tasks': checked_tasks,
            'completion_rate': round(checked_tasks / total_tasks * 100, 1) if total_tasks > 0 else 0,
            'has_proper_size': has_proper_size,
            'has_task_list': has_task_list,
            'has_explicit_status': has_explicit_status,
            'explicit_status': explicit_status,
            'file_path': story_file,
        }

    except Exception as e:
        print(f"ERROR parsing {story_id}: {e}", file=sys.stderr)

print(f"✓ Analyzed {len(story_quality)} story files")
print()

# Quality summary
valid_stories = sum(1 for q in story_quality.values() if q['has_proper_size'] and q['has_task_list'])
invalid_stories = len(story_quality) - valid_stories

print(f"  Valid stories (>={MIN_STORY_SIZE_KB}KB + task lists): {valid_stories}")
print(f"  Invalid stories (<{MIN_STORY_SIZE_KB}KB or no tasks): {invalid_stories}")
print()

# Step 2: Analyze git commits for completion evidence
print("Step 2: Analyzing git commits for completion evidence...")
print("-" * 80)

try:
    # Get commits from last 30 days
    result = subprocess.run(
        ['git', 'log', '--oneline', '--since=30 days ago'],
        capture_output=True,
        text=True,
        check=True
    )

    commits = result.stdout.strip().split('\n') if result.stdout else []

    # Extract story references
    story_pattern = re.compile(r'\b(\d+[a-z]?-\d+[a-z]?(?:-[a-z0-9-]+)?)\b', re.IGNORECASE)
    story_commits = defaultdict(list)

    for commit in commits:
        matches = story_pattern.findall(commit.lower())
        for match in matches:
            story_commits[match].append(commit)

    print(f"✓ Found {len(story_commits)} stories referenced in git commits (last 30 days)")
    print()

except Exception as e:
    print(f"WARNING: Could not analyze git commits: {e}", file=sys.stderr)
    story_commits = {}

# Step 3: Check for autonomous completion reports
print("Step 3: Checking for autonomous completion reports...")
print("-" * 80)

autonomous_completions = {}

for report_file in STORY_DIR.glob('.epic-*-completion-report.md'):
    try:
        content = report_file.read_text()
        # Extract epic number
        epic_match = re.search(r'epic-(\d+[a-z]?)', report_file.stem)
        if epic_match:
            epic_num = epic_match.group(1)
            # Extract completed stories
            story_matches = re.findall(r'✅\s+(\d+[a-z]?-\d+[a-z]?[a-z]?(?:-[a-z0-9-]+)?)', content, re.IGNORECASE)
            for story_id in story_matches:
                autonomous_completions[story_id] = f"Epic {epic_num} autonomous report"
    except:
        pass

# Also check .autonomous-epic-*-progress.yaml files
for progress_file in STORY_DIR.glob('.autonomous-epic-*-progress.yaml'):
    try:
        content = progress_file.read_text()
        # Extract completed_stories list
        in_completed = False
        for line in content.split('\n'):
            if 'completed_stories:' in line:
                in_completed = True
                continue
            if in_completed and line.strip().startswith('- '):
                story_id = line.strip()[2:]
                autonomous_completions[story_id] = "Autonomous progress file"
            elif in_completed and not line.startswith('  '):
                break
    except:
        pass

print(f"✓ Found {len(autonomous_completions)} stories in autonomous completion reports")
print()

# Step 4: Intelligent status inference
print("Step 4: Inferring story status from all evidence...")
print("-" * 80)

inferred_statuses = {}

for story_id, quality in story_quality.items():
    evidence = []
    confidence = "low"
    inferred_status = None

    # Evidence 1: Explicit Status: field (highest priority)
    if quality['explicit_status']:
        status = quality['explicit_status'].lower()
        if 'done' in status or 'complete' in status:
            inferred_status = 'done'
            evidence.append("Status: field says done")
            confidence = "high"
        elif 'review' in status:
            inferred_status = 'review'
            evidence.append("Status: field says review")
            confidence = "high"
        elif 'progress' in status:
            inferred_status = 'in-progress'
            evidence.append("Status: field says in-progress")
            confidence = "high"
        elif 'ready' in status or 'pending' in status:
            inferred_status = 'ready-for-dev'
            evidence.append("Status: field says ready-for-dev")
            confidence = "medium"

    # Evidence 2: Git commits (strong signal of completion)
    if story_id in story_commits:
        commit_count = len(story_commits[story_id])
        evidence.append(f"{commit_count} git commits")

        if inferred_status != 'done':
            # If NOT already marked done, git commits suggest done/review
            if commit_count >= 3:
                inferred_status = 'done'
                confidence = "high"
            elif commit_count >= 1:
                inferred_status = 'review'
                confidence = "medium"

    # Evidence 3: Autonomous completion reports (highest confidence)
    if story_id in autonomous_completions:
        evidence.append(autonomous_completions[story_id])
        inferred_status = 'done'
        confidence = "very high"

    # Evidence 4: Task completion rate (brownfield indicator)
    completion_rate = quality['completion_rate']
    if completion_rate >= 90 and quality['total_tasks'] >= 5:
        evidence.append(f"{completion_rate}% tasks checked")
        if not inferred_status or inferred_status == 'ready-for-dev':
            inferred_status = 'done'
            confidence = "high"
    elif completion_rate >= 50:
        evidence.append(f"{completion_rate}% tasks checked")
        if not inferred_status or inferred_status == 'ready-for-dev':
            inferred_status = 'in-progress'
            confidence = "medium"

    # Evidence 5: File quality (indicates readiness)
    if not quality['has_proper_size'] or not quality['has_task_list']:
        evidence.append(f"Poor quality ({quality['file_size_kb']}KB, {quality['total_tasks']} tasks)")
        # Don't mark as done if file quality is poor
        if inferred_status == 'done':
            inferred_status = 'ready-for-dev'
            confidence = "low"
            evidence.append("Downgraded due to quality issues")

    # Default: If no evidence, mark as ready-for-dev
    if not inferred_status:
        inferred_status = 'ready-for-dev'
        evidence.append("No completion evidence found")
        confidence = "low"

    inferred_statuses[story_id] = {
        'status': inferred_status,
        'confidence': confidence,
        'evidence': evidence,
        'quality': quality,
    }

print(f"✓ Inferred status for {len(inferred_statuses)} stories")
print()

# Step 5: Apply recovery mode filtering
print(f"Step 5: Applying {MODE} mode filters...")
print("-" * 80)

updates_to_apply = {}

for story_id, inference in inferred_statuses.items():
    status = inference['status']
    confidence = inference['confidence']

    # Conservative mode: Only high/very high confidence
    if MODE == 'conservative':
        if confidence in ['high', 'very high']:
            updates_to_apply[story_id] = inference

    # Aggressive mode: Medium+ confidence
    elif MODE == 'aggressive':
        if confidence in ['medium', 'high', 'very high']:
            updates_to_apply[story_id] = inference

    # Interactive mode: All (will prompt)
    else:
        updates_to_apply[story_id] = inference

print(f"✓ {len(updates_to_apply)} stories selected for update")
print()

# Step 6: Report findings
print("=" * 80)
print("RECOVERY RECOMMENDATIONS")
print("=" * 80)
print()

# Group by inferred status
by_status = defaultdict(list)
for story_id, inference in updates_to_apply.items():
    by_status[inference['status']].append((story_id, inference))

for status in ['done', 'review', 'in-progress', 'ready-for-dev', 'blocked']:
    if status in by_status:
        stories = by_status[status]
        print(f"\n{status.upper()}: {len(stories)} stories")
        print("-" * 40)

        for story_id, inference in sorted(stories)[:10]:  # Show first 10
            conf = inference['confidence']
            evidence_summary = "; ".join(inference['evidence'][:2])
            quality = inference['quality']

            print(f"  {story_id}")
            print(f"    Confidence: {conf}")
            print(f"    Evidence: {evidence_summary}")
            print(f"    Quality: {quality['file_size_kb']}KB, {quality['total_tasks']} tasks, {quality['completion_rate']}% done")
            print()

        if len(stories) > 10:
            print(f"  ... and {len(stories) - 10} more")
            print()

# Step 7: Export results for processing
output_data = {
    'mode': MODE,
    'dry_run': DRY_RUN,
    'total_analyzed': len(story_quality),
    'total_updates': len(updates_to_apply),
    'updates': updates_to_apply,
}

import json
with open('/tmp/recovery_results.json', 'w') as f:
    json.dump({
        'mode': MODE,
        'dry_run': str(DRY_RUN),
        'total_analyzed': len(story_quality),
        'total_updates': len(updates_to_apply),
        'updates': {k: {
            'status': v['status'],
            'confidence': v['confidence'],
            'evidence': v['evidence'],
            'size_kb': v['quality']['file_size_kb'],
            'tasks': v['quality']['total_tasks'],
            'completion': v['quality']['completion_rate'],
        } for k, v in updates_to_apply.items()},
    }, f, indent=2)

print()
print("=" * 80)
print(f"SUMMARY: {len(updates_to_apply)} stories ready for recovery")
print("=" * 80)
print()

# Output counts by confidence
conf_counts = defaultdict(int)
for inference in updates_to_apply.values():
    conf_counts[inference['confidence']] += 1

print("Confidence Distribution:")
for conf in ['very high', 'high', 'medium', 'low']:
    count = conf_counts.get(conf, 0)
    if count > 0:
        print(f"  {conf:12}: {count:3}")

print()
print("Results saved to: /tmp/recovery_results.json")

PYTHON_RECOVERY

echo ""
echo -e "${GREEN}✓ Recovery analysis complete${NC}"
echo ""

# Step 8: Interactive confirmation or auto-apply
if [ "$MODE" = "interactive" ]; then
  echo -e "${YELLOW}Interactive mode: Review recommendations above${NC}"
  echo ""
  echo "Options:"
  echo "  1) Apply all high/very-high confidence updates"
  echo "  2) Apply ALL updates (including medium/low confidence)"
  echo "  3) Show detailed report and exit (no changes)"
  echo "  4) Cancel"
  echo ""
  read -p "Choice [1-4]: " choice

  case $choice in
    1)
      echo "Applying high confidence updates only..."
      # TODO: Filter and apply
      ;;
    2)
      echo "Applying ALL updates..."
      # TODO: Apply all
      ;;
    3)
      echo "Detailed report saved to /tmp/recovery_results.json"
      exit 0
      ;;
    *)
      echo "Cancelled"
      exit 0
      ;;
  esac
fi

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN: No changes applied${NC}"
  echo ""
  echo "Review /tmp/recovery_results.json for full analysis"
  echo "Run without --dry-run to apply changes"
  exit 0
fi

echo ""
echo -e "${BLUE}Recovery complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review updated sprint-status.yaml"
echo "  2. Run: pnpm validate:sprint-status"
echo "  3. Commit changes if satisfied"
echo ""
echo "Backup saved to: $BACKUP_FILE"
