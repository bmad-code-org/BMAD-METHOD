---
name: gh-triage
description: Fetch all GitHub issues via gh CLI and use AI agents to deeply analyze, cluster, and prioritize issues with actual understanding. Use for issue triage, backlog cleanup, or when user mentions "issues", "triage", or "backlog".
license: MIT
disable-model-invocation: true
metadata:
  author: bmad-code-org
  version: "3.0.0"
  anthropic-internal: Core team issue triage tool for BMad Method repositories
  min-github-cli-version: "2.0"
compatibility: Requires gh CLI, git repository, and BMad Method with Task tool support
---

# GitHub Issue Triage with AI Analysis

**CRITICAL RULES:**
- NEVER include time or effort estimates in output or recommendations
- Focus on WHAT needs to be done, not HOW LONG it takes
- Use Bash tool with gh CLI for all GitHub operations

## Execution Plan

You will perform GitHub issue triage using AI agents for deep analysis:

### Step 1: Fetch Issues
Use `gh issue list` to fetch all open issues from the current repository in JSON format.

### Step 2: Batch Creation
Split issues into batches of ~10 issues each for parallel analysis.

### Step 3: Parallel Agent Analysis
For EACH batch, use the Task tool with `subagent_type=general-purpose` to launch an agent with this prompt:

```
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
```

### Step 4: Consolidate & Generate Report
After all agents complete, create a comprehensive markdown report saved to `_bmad-output/triage-reports/triage-YYYY-MM-DD.md` with:

## Report Structure

### Executive Summary
- Total issues analyzed
- Issue count by priority (CRITICAL, HIGH, MEDIUM, LOW)
- Major themes discovered
- Top 5 critical issues requiring immediate attention

### Critical Issues (CRITICAL Priority)
For each CRITICAL issue:
- **#123 - [Issue Title](url)**
- **What it's about:** [Deep understanding]
- **Affected:** [Components]
- **Why Critical:** [Rationale]
- **Suggested Action:** [Specific action]

### High Priority Issues (HIGH Priority)
Same format as Critical, grouped by theme.

### Theme Clusters
For each major theme:
- **Theme Name** (N issues)
- **What connects these:** [Pattern]
- **Root cause:** [If identifiable]
- **Consolidated actions:** [Bulk actions if applicable]
- **Issues:** #123, #456, #789

### Relationships & Dependencies
- **Duplicates:** List pairs with `gh issue close` commands
- **Related Issues:** Groups of related issues
- **Dependencies:** Blocking relationships

### Cross-Repo Issues
Issues that should be migrated to other repositories (bmad-builder, bmad-module-creative-intelligence-suite, bmad-module-game-dev-studio, bmad-method-test-architecture-enterprise).

For each, provide:
```
gh issue close XXX --repo CURRENT_REPO --comment "This issue belongs in REPO. Please report at https://github.com/TARGET_REPO/issues/new"
```

### Cleanup Candidates
- **v4-related:** Deprecated version issues with close commands
- **Stale:** No activity >30 days
- **Low priority + old:** Low priority issues >60 days old

### Actionable Next Steps
Specific, prioritized actions:
1. [CRITICAL] Fix broken installer - affects all new users
2. [HIGH] Resolve Windows path escaping issues
3. [HIGH] Address workflow integration bugs
etc.

Include `gh` commands where applicable for bulk actions.

---

## Execute Now

Begin by fetching issues from the current repository and follow the plan above.
