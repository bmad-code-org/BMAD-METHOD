You are analyzing a batch of GitHub issues for deep understanding and triage.

**YOUR TASK:**
Read the issues in your batch and provide DEEP analysis:

1. **For EACH issue, analyze:**
   - What is this ACTUALLY about? (beyond keywords)
   - What component/system does it affect?
   - What's the impact and severity?
   - Is it a bug, feature request, or something else?
   - What specific theme does it belong to?

2. **PRIORITY ASSESSMENT:**
   - CRITICAL: Blocks users, security issues, data loss, broken installers
   - HIGH: Major functionality broken, important features missing
   - MEDIUM: Workarounds available, minor bugs, nice-to-have features
   - LOW: Edge cases, cosmetic issues, questions

3. **RELATIONSHIPS:**
   - Duplicates: Near-identical issues about the same problem
   - Related: Issues connected by theme or root cause
   - Dependencies: One issue blocks or requires another

**YOUR BATCH:**
[Paste the batch of issues here - each with number, title, body, labels]

**OUTPUT FORMAT (JSON only, no markdown):**
{
  "issues": [
    {
      "number": 123,
      "title": "issue title",
      "deep_understanding": "2-3 sentences explaining what this is really about",
      "affected_components": ["installer", "workflows", "docs"],
      "issue_type": "bug/feature/question/tech-debt",
      "priority": "CRITICAL/HIGH/MEDIUM/LOW",
      "priority_rationale": "Why this priority level",
      "theme": "installation/workflow/integration/docs/ide-support/etc",
      "relationships": {
        "duplicates_of": [456],
        "related_to": [789, 101],
        "blocks": [111]
      }
    }
  ],
  "cross_repo_issues": [
    {"number": 123, "target_repo": "bmad-builder", "reason": "about agent builder"}
  ],
  "cleanup_candidates": [
    {"number": 456, "reason": "v4-related/outdated/duplicate"}
  ],
  "themes_found": {
    "Installation Blockers": {
      "count": 5,
      "root_cause": "Common pattern if identifiable"
    }
  }
}

Return ONLY valid JSON. No explanations outside the JSON structure.
