#!/usr/bin/env python3
"""
Task Verification Engine - Verify story task checkboxes match ACTUAL CODE

Purpose: Prevent false positives where tasks are checked but code doesn't exist
Method: Parse task text, infer what files/functions should exist, verify in codebase

Created: 2026-01-02
Part of: Comprehensive validation solution
"""

import re
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional


class TaskVerificationEngine:
    """Verifies that checked tasks correspond to actual code in the repository"""

    def __init__(self, repo_root: Path = Path(".")):
        self.repo_root = repo_root

    def verify_task(self, task_text: str, is_checked: bool) -> Dict:
        """
        Verify a single task against codebase reality

        DEEP VERIFICATION - Not just file existence, but:
        - Files exist AND have real implementation (not stubs)
        - Tests exist AND are passing
        - No TODO/FIXME comments in implementation
        - Code has actual logic (not empty classes)

        Returns:
            {
                'task': task_text,
                'is_checked': bool,
                'should_be_checked': bool,
                'confidence': 'high'|'medium'|'low',
                'evidence': [list of evidence],
                'verification_status': 'correct'|'false_positive'|'false_negative'|'uncertain'
            }
        """
        # Extract potential file paths from task text
        file_refs = self._extract_file_references(task_text)

        # Extract class/function names
        code_refs = self._extract_code_references(task_text)

        # Extract test requirements
        test_refs = self._extract_test_references(task_text)

        # Verify file existence AND implementation quality
        files_exist = []
        files_missing = []

        for file_ref in file_refs:
            if self._file_exists(file_ref):
                # DEEP CHECK: Is it really implemented or just a stub?
                if self._verify_real_implementation(file_ref, None):
                    files_exist.append(file_ref)
                else:
                    files_missing.append(f"{file_ref} (stub/TODO)")
            else:
                files_missing.append(file_ref)

        # Verify code existence AND implementation
        code_found = []
        code_missing = []

        for code_ref in code_refs:
            if self._code_exists(code_ref):
                code_found.append(code_ref)
            else:
                code_missing.append(code_ref)

        # Verify tests exist AND pass
        tests_passing = []
        tests_failing_or_missing = []

        for test_ref in test_refs:
            test_status = self._verify_test_exists_and_passes(test_ref)
            if test_status == 'passing':
                tests_passing.append(test_ref)
            else:
                tests_failing_or_missing.append(f"{test_ref} ({test_status})")

        # Build evidence with DEEP verification
        evidence = []
        confidence = 'low'
        should_be_checked = False

        # STRONGEST evidence: Tests exist AND pass
        if tests_passing:
            evidence.append(f"{len(tests_passing)} tests passing (VERIFIED)")
            confidence = 'very high'
            should_be_checked = True

        # Strong evidence: Files exist with real implementation
        if files_exist and not files_missing:
            evidence.append(f"All {len(files_exist)} files exist with real code (no stubs)")
            if confidence != 'very high':
                confidence = 'high'
            should_be_checked = True

        # Strong evidence: Code found with implementation
        if code_found and not code_missing:
            evidence.append(f"All {len(code_found)} code elements implemented")
            if confidence == 'low':
                confidence = 'high'
            should_be_checked = True

        # NEGATIVE evidence: Tests missing or failing
        if tests_failing_or_missing:
            evidence.append(f"{len(tests_failing_or_missing)} tests missing/failing")
            # Even if files exist, no passing tests = NOT done
            should_be_checked = False
            confidence = 'medium'

        # NEGATIVE evidence: Mixed results
        if files_exist and files_missing:
            evidence.append(f"{len(files_exist)} files OK, {len(files_missing)} missing/stubs")
            confidence = 'medium'
            should_be_checked = False  # Incomplete

        # Strong evidence of incompletion
        if not files_exist and files_missing:
            evidence.append(f"All {len(files_missing)} files missing or stubs")
            confidence = 'high'
            should_be_checked = False

        if not code_found and code_missing:
            evidence.append(f"Code not found: {', '.join(code_missing[:3])}")
            confidence = 'medium'
            should_be_checked = False

        # No file/code/test references - use heuristics
        if not file_refs and not code_refs and not test_refs:
            # Check for action keywords
            if self._has_completion_keywords(task_text):
                evidence.append("Research/analysis task (no code artifacts)")
                confidence = 'low'
                # Can't verify - trust the checkbox
                should_be_checked = is_checked
            else:
                evidence.append("No verifiable references")
                confidence = 'low'
                should_be_checked = is_checked

        # Determine verification status
        if is_checked == should_be_checked:
            verification_status = 'correct'
        elif is_checked and not should_be_checked:
            verification_status = 'false_positive'  # Checked but code missing
        elif not is_checked and should_be_checked:
            verification_status = 'false_negative'  # Unchecked but code exists
        else:
            verification_status = 'uncertain'

        return {
            'task': task_text,
            'is_checked': is_checked,
            'should_be_checked': should_be_checked,
            'confidence': confidence,
            'evidence': evidence,
            'verification_status': verification_status,
            'files_exist': files_exist,
            'files_missing': files_missing,
            'code_found': code_found,
            'code_missing': code_missing,
        }

    def _extract_file_references(self, task_text: str) -> List[str]:
        """Extract file path references from task text"""
        paths = []

        # Pattern 1: Explicit paths (src/foo/bar.ts)
        explicit_paths = re.findall(r'[\w/-]+/[\w-]+\.[\w]+', task_text)
        paths.extend(explicit_paths)

        # Pattern 2: "Create Foo.ts" or "Implement Bar.service.ts"
        file_mentions = re.findall(r'\b([A-Z][\w-]+\.(ts|tsx|js|jsx|py|md|yaml|json))\b', task_text)
        paths.extend([f[0] for f in file_mentions])

        # Pattern 3: "in components/Widget.tsx"
        contextual = re.findall(r'in\s+([\w/-]+\.[\w]+)', task_text, re.IGNORECASE)
        paths.extend(contextual)

        return list(set(paths))  # Deduplicate

    def _extract_code_references(self, task_text: str) -> List[str]:
        """Extract class/function/interface names from task text"""
        code_refs = []

        # Pattern 1: "Create FooService class"
        class_patterns = re.findall(r'(?:Create|Implement|Add)\s+(\w+(?:Service|Controller|Repository|Component|Interface|Type))', task_text, re.IGNORECASE)
        code_refs.extend(class_patterns)

        # Pattern 2: "Implement getFoo method"
        method_patterns = re.findall(r'(?:Implement|Add|Create)\s+(\w+)\s+(?:method|function)', task_text, re.IGNORECASE)
        code_refs.extend(method_patterns)

        # Pattern 3: Camel/PascalCase references
        camelcase = re.findall(r'\b([A-Z][a-z]+(?:[A-Z][a-z]+)+)\b', task_text)
        code_refs.extend(camelcase)

        return list(set(code_refs))

    def _file_exists(self, file_path: str) -> bool:
        """Check if file exists in repository"""
        # Try exact path first
        if (self.repo_root / file_path).exists():
            return True

        # Try common locations
        search_dirs = [
            'apps/backend/',
            'apps/frontend/',
            'packages/',
            'src/',
            'infrastructure/',
        ]

        for search_dir in search_dirs:
            if (self.repo_root / search_dir).exists():
                # Use find command
                try:
                    result = subprocess.run(
                        ['find', search_dir, '-name', Path(file_path).name, '-type', 'f'],
                        capture_output=True,
                        text=True,
                        cwd=self.repo_root,
                        timeout=5
                    )
                    if result.returncode == 0 and result.stdout.strip():
                        return True
                except:
                    pass

        return False

    def _code_exists(self, code_ref: str) -> bool:
        """Check if class/function/interface exists AND is actually implemented (not just a stub)"""
        try:
            # Search for class, interface, function, or type declaration
            patterns = [
                f'class {code_ref}',
                f'interface {code_ref}',
                f'function {code_ref}',
                f'export const {code_ref}',
                f'export function {code_ref}',
                f'type {code_ref}',
            ]

            for pattern in patterns:
                result = subprocess.run(
                    ['grep', '-r', '-l', pattern, '.', '--include=*.ts', '--include=*.tsx', '--include=*.js'],
                    capture_output=True,
                    text=True,
                    cwd=self.repo_root,
                    timeout=10
                )
                if result.returncode == 0 and result.stdout.strip():
                    # Found the declaration - now verify it's not a stub
                    file_path = result.stdout.strip().split('\n')[0]
                    if self._verify_real_implementation(file_path, code_ref):
                        return True

        except:
            pass

        return False

    def _verify_real_implementation(self, file_path: str, code_ref: str) -> bool:
        """
        Verify code is REALLY implemented, not just a stub or TODO

        Checks for:
        - File has substantial code (not just empty class)
        - No TODO/FIXME comments near the code
        - Has actual methods/logic (not just interface)
        """
        try:
            full_path = self.repo_root / file_path
            if not full_path.exists():
                return False

            content = full_path.read_text()

            # Find the code reference
            code_index = content.find(code_ref)
            if code_index == -1:
                return False

            # Get 500 chars after the reference (the implementation)
            code_snippet = content[code_index:code_index + 500]

            # RED FLAGS - indicates stub/incomplete code
            red_flags = [
                'TODO',
                'FIXME',
                'throw new Error(\'Not implemented',
                'return null;',
                '// Placeholder',
                '// Stub',
                'return {};',
                'return [];',
                'return undefined;',
            ]

            for flag in red_flags:
                if flag in code_snippet:
                    return False  # Found stub/placeholder

            # GREEN FLAGS - indicates real implementation
            green_flags = [
                'return',  # Has return statements
                'this.',   # Uses instance members
                'await',   # Has async logic
                'if (',    # Has conditional logic
                'for (',   # Has loops
                'const ',  # Has variables
            ]

            green_count = sum(1 for flag in green_flags if flag in code_snippet)

            # Need at least 3 green flags for "real" implementation
            return green_count >= 3

        except:
            return False

    def _extract_test_references(self, task_text: str) -> List[str]:
        """Extract test file references from task text"""
        test_refs = []

        # Pattern 1: Explicit test files
        test_files = re.findall(r'([\w/-]+\.(?:spec|test)\.(?:ts|tsx|js))', task_text)
        test_refs.extend(test_files)

        # Pattern 2: "Write tests for X" or "Add test coverage"
        if re.search(r'\b(?:test|tests|testing|coverage)\b', task_text, re.IGNORECASE):
            # Extract potential test subjects
            subjects = re.findall(r'(?:for|to)\s+(\w+(?:Service|Controller|Component|Repository|Widget))', task_text)
            test_refs.extend([f"{subj}.spec.ts" for subj in subjects])

        return list(set(test_refs))

    def _verify_test_exists_and_passes(self, test_ref: str) -> str:
        """
        Verify test file exists AND tests are passing

        Returns: 'passing' | 'failing' | 'missing' | 'not_run'
        """
        # Find test file
        if not self._file_exists(test_ref):
            return 'missing'

        # Try to run the test
        try:
            # Find the actual test file path
            result = subprocess.run(
                ['find', '.', '-name', Path(test_ref).name, '-type', 'f'],
                capture_output=True,
                text=True,
                cwd=self.repo_root,
                timeout=5
            )

            if not result.stdout.strip():
                return 'missing'

            test_file_path = result.stdout.strip().split('\n')[0]

            # Run the test (with timeout - don't hang)
            test_result = subprocess.run(
                ['pnpm', 'test', '--', test_file_path, '--run'],
                capture_output=True,
                text=True,
                cwd=self.repo_root,
                timeout=30  # 30 second timeout per test file
            )

            # Check output for pass/fail
            output = test_result.stdout + test_result.stderr

            if 'PASS' in output or 'passing' in output.lower():
                return 'passing'
            elif 'FAIL' in output or 'failing' in output.lower():
                return 'failing'
            else:
                return 'not_run'

        except subprocess.TimeoutExpired:
            return 'timeout'
        except:
            return 'not_run'

    def _has_completion_keywords(self, task_text: str) -> bool:
        """Check if task has action-oriented keywords"""
        keywords = [
            'research', 'investigate', 'analyze', 'review', 'document',
            'plan', 'design', 'decide', 'choose', 'evaluate', 'assess'
        ]
        text_lower = task_text.lower()
        return any(keyword in text_lower for keyword in keywords)


def verify_story_tasks(story_file_path: str) -> Dict:
    """
    Verify all tasks in a story file

    Returns:
        {
            'total_tasks': int,
            'checked_tasks': int,
            'correct_checkboxes': int,
            'false_positives': int,  # Checked but code missing
            'false_negatives': int,  # Unchecked but code exists
            'uncertain': int,
            'verification_score': float,  # 0-100
            'task_details': [...],
        }
    """
    story_path = Path(story_file_path)

    if not story_path.exists():
        return {'error': 'Story file not found'}

    content = story_path.read_text()

    # Extract all tasks (- [ ] or - [x])
    task_pattern = r'^-\s*\[([ xX])\]\s*(.+)$'
    tasks = re.findall(task_pattern, content, re.MULTILINE)

    if not tasks:
        return {
            'total_tasks': 0,
            'error': 'No task list found in story file'
        }

    # Verify each task
    engine = TaskVerificationEngine(story_path.parent.parent)  # Go up to repo root
    task_verifications = []

    for checkbox, task_text in tasks:
        is_checked = checkbox.lower() == 'x'
        verification = engine.verify_task(task_text, is_checked)
        task_verifications.append(verification)

    # Calculate summary
    total_tasks = len(task_verifications)
    checked_tasks = sum(1 for v in task_verifications if v['is_checked'])
    correct = sum(1 for v in task_verifications if v['verification_status'] == 'correct')
    false_positives = sum(1 for v in task_verifications if v['verification_status'] == 'false_positive')
    false_negatives = sum(1 for v in task_verifications if v['verification_status'] == 'false_negative')
    uncertain = sum(1 for v in task_verifications if v['verification_status'] == 'uncertain')

    # Verification score: (correct / total) * 100
    verification_score = (correct / total_tasks * 100) if total_tasks > 0 else 0

    return {
        'total_tasks': total_tasks,
        'checked_tasks': checked_tasks,
        'correct_checkboxes': correct,
        'false_positives': false_positives,
        'false_negatives': false_negatives,
        'uncertain': uncertain,
        'verification_score': round(verification_score, 1),
        'task_details': task_verifications,
    }


def main():
    """CLI entry point"""
    import sys
    import json

    if len(sys.argv) < 2:
        print("Usage: task-verification-engine.py <story-file-path>", file=sys.stderr)
        sys.exit(1)

    story_file = sys.argv[1]
    results = verify_story_tasks(story_file)

    # Print summary
    print(f"\n📋 Task Verification Report: {Path(story_file).name}")
    print("=" * 80)

    if 'error' in results:
        print(f"❌ {results['error']}")
        sys.exit(1)

    print(f"Total tasks: {results['total_tasks']}")
    print(f"Checked: {results['checked_tasks']}")
    print(f"Verification score: {results['verification_score']}/100")
    print()
    print(f"✅ Correct: {results['correct_checkboxes']}")
    print(f"❌ False positives: {results['false_positives']} (checked but code missing)")
    print(f"❌ False negatives: {results['false_negatives']} (unchecked but code exists)")
    print(f"❔ Uncertain: {results['uncertain']}")

    # Show false positives
    if results['false_positives'] > 0:
        print("\n⚠️  FALSE POSITIVES (checked but no evidence):")
        for task in results['task_details']:
            if task['verification_status'] == 'false_positive':
                print(f"  - {task['task'][:80]}")
                print(f"    Evidence: {', '.join(task['evidence'])}")

    # Show false negatives
    if results['false_negatives'] > 0:
        print("\n💡 FALSE NEGATIVES (unchecked but code exists):")
        for task in results['task_details']:
            if task['verification_status'] == 'false_negative':
                print(f"  - {task['task'][:80]}")
                print(f"    Evidence: {', '.join(task['evidence'])}")

    # Output JSON for programmatic use
    if '--json' in sys.argv:
        print("\n" + json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
