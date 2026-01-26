# Multi-Agent Code Review

**Purpose:** Perform comprehensive code review using multiple specialized AI agents, each focusing on different quality aspects.

## Overview

Unlike traditional single-reviewer code review, multi-agent review leverages multiple specialized agents:
- **Architecture Agent**: Reviews system design, patterns, and structure
- **Security Agent**: Identifies vulnerabilities and security risks
- **Performance Agent**: Analyzes efficiency and optimization opportunities
- **Testing Agent**: Evaluates test coverage and quality
- **Code Quality Agent**: Reviews style, maintainability, and best practices

## Workflow

### Step 1: Load Story Context

```bash
# Read story file
story_file="{story_file}"
test -f "$story_file" || (echo "❌ Story file not found: $story_file" && exit 1)
```

Read the story file to understand:
- What was supposed to be implemented
- Acceptance criteria
- Tasks and subtasks
- File list

### Step 2: Invoke Multi-Agent Review Skill

```xml
<invoke-skill skill="multi-agent-review">
  <parameter name="story_id">{story_id}</parameter>
  <parameter name="base_branch">{base_branch}</parameter>
</invoke-skill>
```

The skill will:
1. Analyze changed files in the story
2. Select appropriate agents based on code changes
3. Run parallel reviews from multiple perspectives
4. Aggregate findings with severity ratings
5. Return comprehensive review report

### Step 3: Save Review Report

```bash
# The skill returns a review report
# Save it to: {review_report}
```

Display summary:
```
🤖 MULTI-AGENT CODE REVIEW COMPLETE

Agents Used: {agent_count}
- Architecture Agent
- Security Agent
- Performance Agent
- Testing Agent
- Code Quality Agent

Findings:
- 🔴 CRITICAL: {critical_count}
- 🟠 HIGH: {high_count}
- 🟡 MEDIUM: {medium_count}
- 🔵 LOW: {low_count}
- ℹ️ INFO: {info_count}

Report saved to: {review_report}
```

### Step 4: Present Findings

For each finding, display:
```
[{severity}] {title}
Agent: {agent_name}
Location: {file}:{line}

{description}

Recommendation:
{recommendation}

---
```

### Step 5: Next Steps

Suggest actions based on findings:
```
📋 RECOMMENDED NEXT STEPS:

If CRITICAL findings exist:
  ⚠️ MUST FIX before proceeding
  - Address all critical security/correctness issues
  - Re-run review after fixes

If only HIGH/MEDIUM findings:
  ✅ Story may proceed
  - Consider addressing high-priority items
  - Create follow-up tasks for medium items
  - Document LOW items as tech debt

If only LOW/INFO findings:
  ✅ Code quality looks good
  - Optional: Address style/optimization suggestions
  - Proceed to completion
```

## Integration with Super-Dev-Pipeline

This workflow is designed to be called from super-dev-pipeline step 7 (code review) when the story complexity is COMPLEX or when user explicitly requests multi-agent review.

**When to Use:**
- Complex stories (≥16 tasks or high-risk keywords)
- Stories involving security-sensitive code
- Stories with significant architectural changes
- When single-agent review has been inconclusive
- User explicitly requests comprehensive review

**When NOT to Use:**
- Micro stories (≤3 tasks)
- Standard stories with simple changes
- Stories that passed adversarial review cleanly

## Output Files

- `{review_report}`: Full review findings in markdown
- Integrated into story completion summary
- Referenced in audit trail

## Error Handling

If multi-agent-review skill fails:
- Fall back to adversarial code review
- Log the failure reason
- Continue pipeline with warning
