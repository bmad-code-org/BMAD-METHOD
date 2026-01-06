#!/usr/bin/env python3
"""
Add Status field to story files that are missing it.
Uses sprint-status.yaml as source of truth.
Smart path resolution - finds files regardless of working directory.

Features:
  - Auto-detects project root and file locations
  - Works from any working directory
  - Explicit path overrides via CLI arguments
  - Clear error messages if files not found
"""

import re
import sys
from pathlib import Path
from typing import Dict, Optional


def find_project_root() -> Path:
    """
    Find project root by looking for .git directory or other markers.
    Works from any subdirectory.
    """
    current = Path.cwd()

    # Try up to 10 levels up
    for _ in range(10):
        if (current / '.git').exists():
            return current
        if (current / '.claude').exists():
            return current
        current = current.parent
        if current == current.parent:  # Reached filesystem root
            break

    # Fallback to current working directory
    return Path.cwd()


def find_story_dir(project_root: Optional[Path] = None) -> Path:
    """
    Auto-detect story directory location.
    Tries multiple possible paths and returns the first one that exists.
    """
    if project_root is None:
        project_root = find_project_root()

    # Try paths in order of preference
    candidates = [
        project_root / "_bmad-output" / "implementation-artifacts" / "sprint-artifacts",
        project_root / "docs" / "sprint-artifacts",
        project_root / "sprint-artifacts",
        Path.cwd() / "sprint-artifacts",
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    # If none found, suggest the most likely paths
    print(f"ERROR: Could not find story directory.", file=sys.stderr)
    print(f"Tried:", file=sys.stderr)
    for candidate in candidates:
        print(f"  - {candidate}", file=sys.stderr)
    raise FileNotFoundError("Story directory not found")


def find_sprint_status(project_root: Optional[Path] = None, story_dir: Optional[Path] = None) -> Path:
    """
    Auto-detect sprint-status.yaml location.
    Looks in the story directory or its parent.
    """
    if story_dir is None:
        story_dir = find_story_dir(project_root)

    # Try paths in order of preference
    candidates = [
        story_dir / "sprint-status.yaml",
        story_dir.parent / "sprint-status.yaml",
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    # If none found, suggest the most likely paths
    print(f"ERROR: Could not find sprint-status.yaml", file=sys.stderr)
    print(f"Tried:", file=sys.stderr)
    for candidate in candidates:
        print(f"  - {candidate}", file=sys.stderr)
    raise FileNotFoundError("sprint-status.yaml not found")


def load_sprint_status(path: Path) -> Dict[str, str]:
    """Load story statuses from sprint-status.yaml"""
    if not path.exists():
        raise FileNotFoundError(f"sprint-status.yaml not found at: {path}")

    lines = path.read_text().split('\n')

    statuses = {}
    in_dev_status = False

    for line in lines:
        if 'development_status:' in line:
            in_dev_status = True
            continue

        if in_dev_status:
            # Check if we've left development_status section
            if line.strip() and not line.startswith('  ') and not line.startswith('#'):
                break

            # Parse story line: "  story-id: status  # comment"
            match = re.match(r'  ([a-z0-9-]+):\s*(\S+)', line)
            if match:
                story_id, status = match.groups()
                statuses[story_id] = status

    return statuses


def add_status_to_story(story_file: Path, status: str) -> bool:
    """Add Status field to story file if missing"""
    content = story_file.read_text()

    # Check if Status field already exists (handles both "Status:" and "**Status:**")
    if re.search(r'^\*?\*?Status:', content, re.MULTILINE | re.IGNORECASE):
        return False  # Already has Status field

    # Find the first section after the title (usually ## Story or ## Description)
    # Insert Status field before that
    lines = content.split('\n')

    # Find insertion point (after title, before first ## section)
    insert_idx = None
    for idx, line in enumerate(lines):
        if line.startswith('# ') and idx == 0:
            # Title line - keep looking
            continue
        if line.startswith('##'):
            # Found first section - insert before it
            insert_idx = idx
            break

    if insert_idx is None:
        # No ## sections found, insert after title
        insert_idx = 1

    # Insert blank line, Status field, blank line
    lines.insert(insert_idx, '')
    lines.insert(insert_idx + 1, f'**Status:** {status}')
    lines.insert(insert_idx + 2, '')

    # Write back
    story_file.write_text('\n'.join(lines))
    return True


def main():
    """Main entry point for CLI usage"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Add Status field to story files that are missing it',
        epilog='Path arguments are optional - script auto-detects locations. Use --story-dir and --sprint-status to override.'
    )
    parser.add_argument('--story-dir', default=None,
                        help='Path to story files directory (auto-detected if omitted)')
    parser.add_argument('--sprint-status', default=None,
                        help='Path to sprint-status.yaml (auto-detected if omitted)')
    args = parser.parse_args()

    try:
        # Auto-detect paths if not provided
        project_root = find_project_root()
        print(f"📁 Project root: {project_root}", file=sys.stderr)

        if args.story_dir:
            story_dir = Path(args.story_dir).resolve()
        else:
            story_dir = find_story_dir(project_root)

        if args.sprint_status:
            sprint_status_path = Path(args.sprint_status).resolve()
        else:
            sprint_status_path = find_sprint_status(project_root, story_dir)

        print(f"📖 Story directory: {story_dir}", file=sys.stderr)
        print(f"📋 Sprint status file: {sprint_status_path}", file=sys.stderr)
        print("", file=sys.stderr)

        # Load statuses from sprint-status.yaml
        print("Loading sprint-status.yaml...", file=sys.stderr)
        statuses = load_sprint_status(sprint_status_path)
        print(f"✓ Found {len(statuses)} entries in sprint-status.yaml", file=sys.stderr)
        print("", file=sys.stderr)

        # Scan story files and add Status fields
        print("Scanning story files...", file=sys.stderr)
        added = 0
        skipped = 0
        missing = 0

        for story_file in sorted(story_dir.glob("*.md")):
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

            if story_id not in statuses:
                print(f"⚠️  {story_id}: Not in sprint-status.yaml", file=sys.stderr)
                missing += 1
                continue

            status = statuses[story_id]

            if add_status_to_story(story_file, status):
                print(f"✓ {story_id}: Added Status: {status}", file=sys.stderr)
                added += 1
            else:
                skipped += 1

        print("", file=sys.stderr)
        print(f"✅ Added Status field to {added} stories", file=sys.stderr)
        print(f"ℹ️  Skipped {skipped} stories (already have Status)", file=sys.stderr)
        if missing > 0:
            print(f"⚠️  {missing} stories not in sprint-status.yaml", file=sys.stderr)

        sys.exit(0)

    except FileNotFoundError as e:
        print(f"✗ {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
