#!/usr/bin/env python3
"""
Sprint Status Updater - Robust YAML updater for sprint-status.yaml

Purpose: Update sprint-status.yaml entries while preserving:
  - Comments
  - Formatting
  - Section structure
  - Manual annotations

Created: 2026-01-02
Part of: Full Workflow Fix (Option C)
"""

import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime


class SprintStatusUpdater:
    """Updates sprint-status.yaml while preserving structure and comments"""

    def __init__(self, sprint_status_path: str):
        self.path = Path(sprint_status_path)
        self.content = self.path.read_text()
        self.lines = self.content.split('\n')
        self.updates_applied = 0

    def update_story_status(self, story_id: str, new_status: str, comment: str = None) -> bool:
        """
        Update a single story's status in development_status section

        Args:
            story_id: Story identifier (e.g., "19-4a-inventory-service-test-coverage")
            new_status: New status value (e.g., "done", "in-progress")
            comment: Optional comment to append (e.g., "✅ COMPLETE 2026-01-02")

        Returns:
            True if update was applied, False if story not found or unchanged
        """
        # Find the story line in development_status section
        in_dev_status = False
        story_line_idx = None

        for idx, line in enumerate(self.lines):
            if line.strip() == 'development_status:':
                in_dev_status = True
                continue

            if in_dev_status:
                # Check if we've left development_status section
                if line and not line.startswith('  ') and not line.startswith('#'):
                    break

                # Check if this is our story
                if line.startswith('  ') and story_id in line:
                    story_line_idx = idx
                    break

        if story_line_idx is None:
            # Story not found - need to add it
            return self._add_story_entry(story_id, new_status, comment)

        # Update existing line
        current_line = self.lines[story_line_idx]

        # Parse current line: "  story-id: status  # comment"
        match = re.match(r'(\s+)([a-z0-9-]+):\s*(\S+)(.*)', current_line)
        if not match:
            print(f"WARNING: Could not parse line: {current_line}", file=sys.stderr)
            return False

        indent, current_story_id, current_status, existing_comment = match.groups()

        # Check if update needed
        if current_status == new_status:
            return False  # No change needed

        # Build new line
        if comment:
            new_line = f"{indent}{story_id}: {new_status}  # {comment}"
        elif existing_comment:
            # Preserve existing comment
            new_line = f"{indent}{story_id}: {new_status}{existing_comment}"
        else:
            new_line = f"{indent}{story_id}: {new_status}"

        self.lines[story_line_idx] = new_line
        self.updates_applied += 1
        return True

    def _add_story_entry(self, story_id: str, status: str, comment: str = None) -> bool:
        """Add a new story entry to development_status section"""
        # Find the epic this story belongs to
        epic_match = re.match(r'^(\d+[a-z]?)-', story_id)
        if not epic_match:
            print(f"WARNING: Cannot determine epic for {story_id}", file=sys.stderr)
            return False

        epic_num = epic_match.group(1)
        epic_key = f"epic-{epic_num}"

        # Find where to insert the story (after its epic line)
        in_dev_status = False
        insert_idx = None

        for idx, line in enumerate(self.lines):
            if line.strip() == 'development_status:':
                in_dev_status = True
                continue

            if in_dev_status:
                # Look for the epic line
                if line.strip().startswith(f"{epic_key}:"):
                    # Found the epic - insert after it
                    insert_idx = idx + 1
                    break

        if insert_idx is None:
            print(f"WARNING: Could not find epic {epic_key} in development_status", file=sys.stderr)
            return False

        # Build new line
        if comment:
            new_line = f"  {story_id}: {status}  # {comment}"
        else:
            new_line = f"  {story_id}: {status}"

        # Insert the line
        self.lines.insert(insert_idx, new_line)
        self.updates_applied += 1
        return True

    def update_epic_status(self, epic_key: str, new_status: str, comment: str = None) -> bool:
        """Update epic status line"""
        in_dev_status = False
        epic_line_idx = None

        for idx, line in enumerate(self.lines):
            if line.strip() == 'development_status:':
                in_dev_status = True
                continue

            if in_dev_status:
                if line and not line.startswith('  ') and not line.startswith('#'):
                    break

                if line.strip().startswith(f"{epic_key}:"):
                    epic_line_idx = idx
                    break

        if epic_line_idx is None:
            print(f"WARNING: Epic {epic_key} not found", file=sys.stderr)
            return False

        # Parse current line
        current_line = self.lines[epic_line_idx]
        match = re.match(r'(\s+)([a-z0-9-]+):\s*(\S+)(.*)', current_line)
        if not match:
            return False

        indent, current_epic, current_status, existing_comment = match.groups()

        if current_status == new_status:
            return False

        # Build new line
        if comment:
            new_line = f"{indent}{epic_key}: {new_status}  # {comment}"
        elif existing_comment:
            new_line = f"{indent}{epic_key}: {new_status}{existing_comment}"
        else:
            new_line = f"{indent}{epic_key}: {new_status}"

        self.lines[epic_line_idx] = new_line
        self.updates_applied += 1
        return True

    def add_verification_note(self):
        """Add verification timestamp to header"""
        # Find and update last_verified line
        for idx, line in enumerate(self.lines):
            if line.startswith('# last_verified:'):
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S EST')
                self.lines[idx] = f"# last_verified: {timestamp}"
                break

    def save(self, backup: bool = True) -> Path:
        """
        Save updated content back to file

        Args:
            backup: If True, create backup before saving

        Returns:
            Path to backup file if created, otherwise original path
        """
        if backup and self.updates_applied > 0:
            backup_dir = Path('.sprint-status-backups')
            backup_dir.mkdir(exist_ok=True)
            backup_path = backup_dir / f"sprint-status-{datetime.now().strftime('%Y%m%d-%H%M%S')}.yaml"
            backup_path.write_text(self.content)
            print(f"✓ Backup created: {backup_path}", file=sys.stderr)

        # Write updated content
        new_content = '\n'.join(self.lines)
        self.path.write_text(new_content)

        return self.path


def scan_story_statuses(story_dir: str = "docs/sprint-artifacts") -> Dict[str, str]:
    """
    Scan all story files and extract EXPLICIT Status: fields

    CRITICAL: Only returns stories that HAVE a Status: field.
    If Status: field is missing, story is NOT included in results.
    This prevents overwriting sprint-status.yaml with defaults.

    Returns:
        Dict mapping story_id -> normalized_status (ONLY for stories with explicit Status: field)
    """
    story_dir_path = Path(story_dir)
    story_files = list(story_dir_path.glob("*.md"))

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
    skipped_count = 0

    for story_file in story_files:
        story_id = story_file.stem

        # Skip special files
        if (story_id.startswith('.') or
            story_id.startswith('EPIC-') or
            'COMPLETION' in story_id.upper() or
            'SUMMARY' in story_id.upper() or
            'REPORT' in story_id.upper() or
            'README' in story_id.upper() or
            'INDEX' in story_id.upper() or
            'REVIEW' in story_id.upper() or
            'AUDIT' in story_id.upper()):
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
                    normalized_status = 'ready-for-dev'

                story_statuses[story_id] = normalized_status
            else:
                # CRITICAL FIX: No Status: field found
                # Do NOT default to ready-for-dev - skip this story entirely
                # This prevents overwriting sprint-status.yaml with incorrect defaults
                skipped_count += 1

        except Exception as e:
            print(f"ERROR parsing {story_id}: {e}", file=sys.stderr)
            continue

    print(f"✓ Found {len(story_statuses)} stories with explicit Status: fields", file=sys.stderr)
    print(f"ℹ Skipped {skipped_count} stories without Status: fields (trust sprint-status.yaml)", file=sys.stderr)

    return story_statuses


def main():
    """Main entry point for CLI usage"""
    import argparse

    parser = argparse.ArgumentParser(description='Update sprint-status.yaml from story files')
    parser.add_argument('--dry-run', action='store_true', help='Show changes without applying')
    parser.add_argument('--validate', action='store_true', help='Validate only (exit 1 if discrepancies)')
    parser.add_argument('--sprint-status', default='docs/sprint-artifacts/sprint-status.yaml',
                        help='Path to sprint-status.yaml')
    parser.add_argument('--story-dir', default='docs/sprint-artifacts',
                        help='Path to story files directory')
    parser.add_argument('--epic', type=str, help='Validate specific epic only (e.g., epic-1)')
    parser.add_argument('--mode', choices=['validate', 'fix'], default='validate',
                        help='Mode: validate (report only) or fix (apply updates)')
    args = parser.parse_args()

    # Scan story files
    print("Scanning story files...", file=sys.stderr)
    story_statuses = scan_story_statuses(args.story_dir)

    # Filter by epic if specified
    if args.epic:
        # Extract epic number from epic key (e.g., "epic-1" -> "1")
        epic_match = re.match(r'epic-([0-9a-z-]+)', args.epic)
        if epic_match:
            epic_num = epic_match.group(1)
            # Filter stories that start with this epic number
            story_statuses = {k: v for k, v in story_statuses.items()
                            if k.startswith(f"{epic_num}-")}
            print(f"✓ Filtered to {len(story_statuses)} stories for {args.epic}", file=sys.stderr)
        else:
            print(f"WARNING: Invalid epic format: {args.epic}", file=sys.stderr)

    print(f"✓ Scanned {len(story_statuses)} story files", file=sys.stderr)
    print("", file=sys.stderr)

    # Load sprint-status.yaml
    updater = SprintStatusUpdater(args.sprint_status)

    # Find discrepancies
    discrepancies = []

    for story_id, new_status in story_statuses.items():
        # Check current status in sprint-status.yaml
        current_status = None
        in_dev_status = False

        for line in updater.lines:
            if line.strip() == 'development_status:':
                in_dev_status = True
                continue

            if in_dev_status and story_id in line:
                match = re.match(r'\s+[a-z0-9-]+:\s*(\S+)', line)
                if match:
                    current_status = match.group(1)
                    break

        if current_status is None:
            discrepancies.append((story_id, 'NOT-IN-FILE', new_status))
        elif current_status != new_status:
            discrepancies.append((story_id, current_status, new_status))

    # Report
    if not discrepancies:
        print("✓ sprint-status.yaml is up to date!", file=sys.stderr)
        sys.exit(0)

    print(f"⚠ Found {len(discrepancies)} discrepancies:", file=sys.stderr)
    print("", file=sys.stderr)

    for story_id, old_status, new_status in discrepancies[:20]:
        if old_status == 'NOT-IN-FILE':
            print(f"  [ADD] {story_id}: (not in file) → {new_status}", file=sys.stderr)
        else:
            print(f"  [UPDATE] {story_id}: {old_status} → {new_status}", file=sys.stderr)

    if len(discrepancies) > 20:
        print(f"  ... and {len(discrepancies) - 20} more", file=sys.stderr)

    print("", file=sys.stderr)

    # Handle mode parameter
    if args.mode == 'validate' or args.validate:
        print("✗ Validation failed - discrepancies found", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print("DRY RUN: Would update sprint-status.yaml", file=sys.stderr)
        sys.exit(0)

    # Apply updates (--mode fix or default behavior)
    print("Applying updates...", file=sys.stderr)

    for story_id, old_status, new_status in discrepancies:
        comment = f"Updated {datetime.now().strftime('%Y-%m-%d')}"
        updater.update_story_status(story_id, new_status, comment)

    # Add verification timestamp
    updater.add_verification_note()

    # Save
    updater.save(backup=True)

    print(f"✓ Applied {updater.updates_applied} updates", file=sys.stderr)
    print(f"✓ Updated: {updater.path}", file=sys.stderr)
    sys.exit(0)


if __name__ == '__main__':
    main()
