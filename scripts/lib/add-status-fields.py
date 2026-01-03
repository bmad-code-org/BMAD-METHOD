#!/usr/bin/env python3
"""
Add Status field to story files that are missing it.
Uses sprint-status.yaml as source of truth.
"""

import re
from pathlib import Path
from typing import Dict

def load_sprint_status(path: str = "docs/sprint-artifacts/sprint-status.yaml") -> Dict[str, str]:
    """Load story statuses from sprint-status.yaml"""
    with open(path) as f:
        lines = f.readlines()

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
    story_dir = Path("docs/sprint-artifacts")
    statuses = load_sprint_status()
    
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
            'README' in story_id.upper()):
            continue
        
        if story_id not in statuses:
            print(f"⚠️  {story_id}: Not in sprint-status.yaml")
            missing += 1
            continue
        
        status = statuses[story_id]
        
        if add_status_to_story(story_file, status):
            print(f"✓ {story_id}: Added Status: {status}")
            added += 1
        else:
            skipped += 1
    
    print()
    print(f"✅ Added Status field to {added} stories")
    print(f"ℹ️  Skipped {skipped} stories (already have Status)")
    print(f"⚠️  {missing} stories not in sprint-status.yaml")

if __name__ == '__main__':
    main()
