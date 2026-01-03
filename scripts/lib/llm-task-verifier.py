#!/usr/bin/env python3
"""
LLM-Powered Task Verification - Use Claude Haiku to ACTUALLY verify code quality

Purpose: Don't guess with regex - have Claude READ the code and verify it's real
Method: For each task, read mentioned files, ask Claude "is this actually implemented?"

Created: 2026-01-02
Cost: ~$0.13 per story with Haiku (50 tasks × 3K tokens × $1.25/1M)
Full platform: 511 stories × $0.13 = ~$66 total
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List
from anthropic import Anthropic


class LLMTaskVerifier:
    """Uses Claude API to verify tasks by reading and analyzing actual code"""

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY required")

        self.client = Anthropic(api_key=self.api_key)
        self.model = 'claude-haiku-4-20250514'  # Fast + cheap for verification tasks
        self.repo_root = Path('.')

    def verify_task(self, task_text: str, is_checked: bool, story_context: Dict) -> Dict:
        """
        Use Claude to verify if a task is actually complete

        Args:
            task_text: The task description (e.g., "Implement UserService")
            is_checked: Whether task is checked [x] or not [ ]
            story_context: Context about the story (files, epic, etc.)

        Returns:
            {
                'task': task_text,
                'is_checked': bool,
                'actually_complete': bool,
                'confidence': 'very_high' | 'high' | 'medium' | 'low',
                'evidence': str,
                'issues_found': [list of issues],
                'verification_status': 'correct' | 'false_positive' | 'false_negative'
            }
        """
        # Extract file references from task
        file_refs = self._extract_file_references(task_text)

        # Read the files
        file_contents = {}
        for file_ref in file_refs[:5]:  # Limit to 5 files per task
            content = self._read_file(file_ref)
            if content:
                file_contents[file_ref] = content

        # If no files found, try reading files from story context
        if not file_contents and story_context.get('files'):
            for file_path in story_context['files'][:5]:
                content = self._read_file(file_path)
                if content:
                    file_contents[file_path] = content

        # Build prompt for Claude
        prompt = self._build_verification_prompt(task_text, is_checked, file_contents, story_context)

        # Call Claude API
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                temperature=0,  # Deterministic
                messages=[{
                    'role': 'user',
                    'content': prompt
                }]
            )

            # Parse response
            result_text = response.content[0].text
            result = self._parse_claude_response(result_text)

            # Add metadata
            result['task'] = task_text
            result['is_checked'] = is_checked
            result['tokens_used'] = response.usage.input_tokens + response.usage.output_tokens

            # Determine verification status
            if is_checked == result['actually_complete']:
                result['verification_status'] = 'correct'
            elif is_checked and not result['actually_complete']:
                result['verification_status'] = 'false_positive'
            else:
                result['verification_status'] = 'false_negative'

            return result

        except Exception as e:
            return {
                'task': task_text,
                'error': str(e),
                'verification_status': 'error'
            }

    def _build_verification_prompt(self, task: str, is_checked: bool, files: Dict, context: Dict) -> str:
        """Build prompt for Claude to verify task completion"""

        files_section = ""
        if files:
            files_section = "\n\n## Files Provided\n\n"
            for file_path, content in files.items():
                files_section += f"### {file_path}\n```typescript\n{content[:2000]}\n```\n\n"
        else:
            files_section = "\n\n## Files Provided\n\nNone - task may not reference specific files.\n"

        prompt = f"""You are a code verification expert. Your job is to verify whether a task from a user story is actually complete.

## Task to Verify

**Task:** {task}
**Claimed Status:** {'[x] Complete' if is_checked else '[ ] Not complete'}

## Story Context

**Story:** {context.get('story_id', 'Unknown')}
**Epic:** {context.get('epic', 'Unknown')}

{files_section}

## Your Task

Analyze the files (if provided) and determine:

1. **Is the task actually complete?**
   - If files provided: Does the code actually implement what the task describes?
   - Is it real implementation or just stubs/TODOs?
   - Are there tests? Do they pass?

2. **Confidence level:**
   - very_high: Clear evidence (tests passing, full implementation)
   - high: Strong evidence (code exists with logic, no stubs)
   - medium: Some evidence but incomplete
   - low: No files or cannot verify

3. **Evidence:**
   - What did you find that proves/disproves completion?
   - Specific line numbers or code snippets
   - Test results if applicable

4. **Issues (if any):**
   - Stub code or TODOs
   - Missing error handling
   - No multi-tenant isolation (dealerId filters)
   - Security vulnerabilities
   - Missing tests

## Response Format (JSON)

{{
  "actually_complete": true/false,
  "confidence": "very_high|high|medium|low",
  "evidence": "Detailed explanation of what you found",
  "issues_found": ["issue 1", "issue 2"],
  "recommendation": "What needs to be done (if incomplete)"
}}

**Be objective. If code is a stub with TODOs, it's NOT complete even if files exist.**
"""
        return prompt

    def _parse_claude_response(self, response_text: str) -> Dict:
        """Parse Claude's JSON response"""
        try:
            # Extract JSON from response (may have markdown)
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            else:
                # Fallback: parse manually
                return {
                    'actually_complete': 'complete' in response_text.lower() and 'not complete' not in response_text.lower(),
                    'confidence': 'low',
                    'evidence': response_text[:500],
                    'issues_found': [],
                }
        except:
            return {
                'actually_complete': False,
                'confidence': 'low',
                'evidence': 'Failed to parse response',
                'issues_found': ['Parse error'],
            }

    def _extract_file_references(self, task_text: str) -> List[str]:
        """Extract file paths from task text"""
        paths = []

        # Common patterns
        patterns = [
            r'[\w/-]+/[\w-]+\.[\w]+',  # Explicit paths
            r'\b([A-Z][\w-]+\.(ts|tsx|service|controller|repository))',  # Files
        ]

        for pattern in patterns:
            matches = re.findall(pattern, task_text)
            if isinstance(matches[0], tuple) if matches else False:
                paths.extend([m[0] for m in matches])
            else:
                paths.extend(matches)

        return list(set(paths))[:5]  # Max 5 files per task

    def _read_file(self, file_ref: str) -> str:
        """Find and read file from repository"""
        # Try exact path
        if (self.repo_root / file_ref).exists():
            try:
                return (self.repo_root / file_ref).read_text()[:5000]  # Max 5K chars
            except:
                return None

        # Search for file
        import subprocess
        try:
            result = subprocess.run(
                ['find', '.', '-name', Path(file_ref).name, '-type', 'f'],
                capture_output=True,
                text=True,
                cwd=self.repo_root,
                timeout=5
            )

            if result.stdout.strip():
                file_path = result.stdout.strip().split('\n')[0]
                return Path(file_path).read_text()[:5000]
        except:
            pass

        return None


def verify_story_with_llm(story_file_path: str) -> Dict:
    """
    Verify entire story using LLM for each task

    Cost: ~$1.50 per story (50 tasks × 3K tokens/task × $15/1M)
    Time: ~2-3 minutes per story
    """
    verifier = LLMTaskVerifier()
    story_path = Path(story_file_path)

    if not story_path.exists():
        return {'error': 'Story file not found'}

    content = story_path.read_text()

    # Extract story context
    story_id = story_path.stem
    epic_match = re.search(r'Epic:\*?\*?\s*(\w+)', content, re.IGNORECASE)
    epic = epic_match.group(1) if epic_match else 'Unknown'

    # Extract files from Dev Agent Record
    file_list_match = re.search(r'### File List\n\n(.+?)###', content, re.DOTALL)
    files = []
    if file_list_match:
        file_section = file_list_match.group(1)
        files = re.findall(r'[\w/-]+\.[\w]+', file_section)

    story_context = {
        'story_id': story_id,
        'epic': epic,
        'files': files
    }

    # Extract all tasks
    task_pattern = r'^-\s*\[([ xX])\]\s*(.+)$'
    tasks = re.findall(task_pattern, content, re.MULTILINE)

    if not tasks:
        return {'error': 'No tasks found'}

    # Verify each task with LLM
    print(f"\n🔍 Verifying {len(tasks)} tasks with Claude...", file=sys.stderr)

    task_results = []
    for idx, (checkbox, task_text) in enumerate(tasks):
        is_checked = checkbox.lower() == 'x'

        print(f"  {idx+1}/{len(tasks)}: {task_text[:60]}...", file=sys.stderr)

        result = verifier.verify_task(task_text, is_checked, story_context)
        task_results.append(result)

    # Calculate summary
    total = len(task_results)
    correct = sum(1 for r in task_results if r.get('verification_status') == 'correct')
    false_positives = sum(1 for r in task_results if r.get('verification_status') == 'false_positive')
    false_negatives = sum(1 for r in task_results if r.get('verification_status') == 'false_negative')

    return {
        'story_id': story_id,
        'total_tasks': total,
        'correct': correct,
        'false_positives': false_positives,
        'false_negatives': false_negatives,
        'verification_score': round((correct / total * 100), 1) if total > 0 else 0,
        'task_results': task_results
    }


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: llm-task-verifier.py <story-file>")
        sys.exit(1)

    results = verify_story_with_llm(sys.argv[1])

    if 'error' in results:
        print(f"❌ {results['error']}")
        sys.exit(1)

    # Print summary
    print(f"\n📊 Story: {results['story_id']}")
    print(f"Verification Score: {results['verification_score']}/100")
    print(f"✅ Correct: {results['correct']}")
    print(f"❌ False Positives: {results['false_positives']}")
    print(f"⚠️  False Negatives: {results['false_negatives']}")

    # Show false positives
    if results['false_positives'] > 0:
        print(f"\n❌ FALSE POSITIVES (claimed done but not implemented):")
        for task in results['task_results']:
            if task.get('verification_status') == 'false_positive':
                print(f"  - {task['task'][:80]}")
                print(f"    {task.get('evidence', 'No evidence')}")

    # Output JSON
    if '--json' in sys.argv:
        print(json.dumps(results, indent=2))
