#!/usr/bin/env python3
"""
Validation Progress Tracker - Track comprehensive validation progress

Purpose:
- Save progress after each story validation
- Enable resuming interrupted validation runs
- Provide real-time status updates

Created: 2026-01-02
"""

import yaml
from datetime import datetime
from pathlib import Path
from typing import Dict, List


class ValidationProgressTracker:
    """Tracks validation progress for resumability"""

    def __init__(self, progress_file: str):
        self.path = Path(progress_file)
        self.data = self._load_or_initialize()

    def _load_or_initialize(self) -> Dict:
        """Load existing progress or initialize new"""
        if self.path.exists():
            with open(self.path) as f:
                return yaml.safe_load(f)

        return {
            'started_at': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat(),
            'epic_filter': None,
            'total_stories': 0,
            'stories_validated': 0,
            'current_batch': 0,
            'batches_completed': 0,
            'status': 'in-progress',
            'counters': {
                'verified_complete': 0,
                'needs_rework': 0,
                'false_positives': 0,
                'in_progress': 0,
                'total_false_positive_tasks': 0,
                'total_critical_issues': 0,
            },
            'validated_stories': {},
            'remaining_stories': [],
        }

    def initialize(self, total_stories: int, story_list: List[str], epic_filter: str = None):
        """Initialize new validation run"""
        self.data['total_stories'] = total_stories
        self.data['remaining_stories'] = story_list
        self.data['epic_filter'] = epic_filter
        self.save()

    def mark_story_validated(self, story_id: str, result: Dict):
        """Mark a story as validated with results"""
        self.data['stories_validated'] += 1
        self.data['validated_stories'][story_id] = {
            'category': result.get('category'),
            'score': result.get('verification_score'),
            'false_positives': result.get('false_positive_count', 0),
            'critical_issues': result.get('critical_issues_count', 0),
            'validated_at': datetime.now().isoformat(),
        }

        # Update counters
        category = result.get('category')
        if category == 'VERIFIED_COMPLETE':
            self.data['counters']['verified_complete'] += 1
        elif category == 'FALSE_POSITIVE':
            self.data['counters']['false_positives'] += 1
        elif category == 'NEEDS_REWORK':
            self.data['counters']['needs_rework'] += 1
        elif category == 'IN_PROGRESS':
            self.data['counters']['in_progress'] += 1

        self.data['counters']['total_false_positive_tasks'] += result.get('false_positive_count', 0)
        self.data['counters']['total_critical_issues'] += result.get('critical_issues_count', 0)

        # Remove from remaining
        if story_id in self.data['remaining_stories']:
            self.data['remaining_stories'].remove(story_id)

        self.data['last_updated'] = datetime.now().isoformat()
        self.save()

    def mark_batch_complete(self, batch_number: int):
        """Mark a batch as complete"""
        self.data['batches_completed'] = batch_number
        self.data['current_batch'] = batch_number + 1
        self.save()

    def mark_complete(self):
        """Mark entire validation as complete"""
        self.data['status'] = 'complete'
        self.data['completed_at'] = datetime.now().isoformat()

        # Calculate duration
        started = datetime.fromisoformat(self.data['started_at'])
        completed = datetime.fromisoformat(self.data['completed_at'])
        duration = completed - started
        self.data['duration_hours'] = round(duration.total_seconds() / 3600, 1)

        self.save()

    def get_progress_percentage(self) -> float:
        """Get completion percentage"""
        if self.data['total_stories'] == 0:
            return 0
        return round((self.data['stories_validated'] / self.data['total_stories']) * 100, 1)

    def get_summary(self) -> Dict:
        """Get current progress summary"""
        return {
            'progress': f"{self.data['stories_validated']}/{self.data['total_stories']} ({self.get_progress_percentage()}%)",
            'verified_complete': self.data['counters']['verified_complete'],
            'false_positives': self.data['counters']['false_positives'],
            'needs_rework': self.data['counters']['needs_rework'],
            'remaining': len(self.data['remaining_stories']),
            'status': self.data['status'],
        }

    def save(self):
        """Save progress to file"""
        with open(self.path, 'w') as f:
            yaml.dump(self.data, f, default_flow_style=False, sort_keys=False)

    def get_remaining_stories(self) -> List[str]:
        """Get list of stories not yet validated"""
        return self.data['remaining_stories']

    def is_complete(self) -> bool:
        """Check if validation is complete"""
        return self.data['status'] == 'complete'


if __name__ == '__main__':
    # Example usage
    tracker = ValidationProgressTracker('.validation-progress-2026-01-02.yaml')

    # Initialize
    tracker.initialize(100, ['story-1.md', 'story-2.md', '...'], epic_filter='16e')

    # Mark story validated
    tracker.mark_story_validated('story-1', {
        'category': 'VERIFIED_COMPLETE',
        'verification_score': 98,
        'false_positive_count': 0,
        'critical_issues_count': 0,
    })

    # Show progress
    print(tracker.get_summary())
    # Output: {'progress': '1/100 (1.0%)', 'verified_complete': 1, ...}
