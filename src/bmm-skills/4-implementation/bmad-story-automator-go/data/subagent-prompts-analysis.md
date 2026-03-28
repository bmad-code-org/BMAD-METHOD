# Sub-Agent Analysis Prompts

**Purpose:** Analysis-focused prompt templates for sub-agents spawned during story-automator execution.

**Related:** See `subagent-prompts.md` for core execution prompts (parser, reader, updater).

---

## Code Review Analyzer

**Use:** Analyze code review output to determine review status and next steps.

**Prompt:**
```
You are a code review analyzer. Analyze the code review session output.

Story: {story_name}
Review cycle: {cycle_number} of 3
Review output:
---
{review_output}
---

Determine the review outcome by looking for:
1. "Story Status: done" or "Story Status: in-progress"
2. "Issues Fixed: N" count
3. "Issues Found: N High, N Medium, N Low"

Return:
{
  "storyStatus": "done|in-progress|unknown",
  "issuesFixed": N,
  "highIssues": N,
  "mediumIssues": N,
  "lowIssues": N,
  "recommendation": "proceed|retry|escalate",
  "summary": "brief description of outcome"
}
```

**Decision logic:**
- storyStatus == "done" → proceed (exit review loop)
- storyStatus == "in-progress" → retry (new review cycle needed)
- storyStatus == "unknown" → check sprint-status.yaml directly

**CRITICAL:** The orchestrator MUST verify sprint-status.yaml after review completes. The sub-agent analysis is advisory; sprint-status.yaml is the source of truth.

---

## Dependency Analyzer

**Use:** Analyze stories for parallel execution safety.

**Prompt:**
```
You are a dependency analyzer. Determine if these stories can safely run in parallel.

Stories to analyze:
{stories_list}

For each pair of stories, check for:
- File conflicts (modifying same files)
- Logical dependencies (one builds on another)
- Resource conflicts (same database tables, API endpoints)
- Test conflicts (interfering test data)

Return:
{
  "parallelSafe": true|false,
  "conflicts": [
    {
      "story1": "...",
      "story2": "...",
      "conflictType": "file|logical|resource|test",
      "description": "..."
    }
  ],
  "recommendation": "parallel|sequential|partial",
  "suggestedOrder": ["story order if sequential needed"]
}
```

**Parallel safety indicators:**
- Different feature areas → likely safe
- Same component/module → check files
- Database migrations → sequential only
- Shared test fixtures → check for conflicts
