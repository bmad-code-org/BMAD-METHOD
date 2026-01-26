# Multi-Agent Code Review

**Purpose:** Perform unbiased code review using multiple specialized AI agents in FRESH CONTEXT, with agent count based on story complexity.

## Overview

**Key Principle: FRESH CONTEXT**
- Review happens in NEW session (not the agent that wrote the code)
- Prevents bias from implementation decisions
- Provides truly independent perspective

**Variable Agent Count by Complexity:**
- **MICRO** (2 agents): Security + Code Quality - Quick sanity check
- **STANDARD** (4 agents): + Architecture + Testing - Balanced review
- **COMPLEX** (6 agents): + Performance + Domain Expert - Comprehensive analysis

**Available Specialized Agents:**
- **Security Agent**: Identifies vulnerabilities and security risks
- **Code Quality Agent**: Reviews style, maintainability, and best practices
- **Architecture Agent**: Reviews system design, patterns, and structure
- **Testing Agent**: Evaluates test coverage and quality
- **Performance Agent**: Analyzes efficiency and optimization opportunities
- **Domain Expert**: Validates business logic and domain constraints

## Workflow

### Step 1: Determine Agent Count

Based on {complexity_level}:

```
If complexity_level == "micro":
  agent_count = 2
  agents = ["security", "code_quality"]
  Display: 🔍 MICRO Review (2 agents: Security + Code Quality)

Else if complexity_level == "standard":
  agent_count = 4
  agents = ["security", "code_quality", "architecture", "testing"]
  Display: 📋 STANDARD Review (4 agents: Multi-perspective)

Else if complexity_level == "complex":
  agent_count = 6
  agents = ["security", "code_quality", "architecture", "testing", "performance", "domain_expert"]
  Display: 🔬 COMPLEX Review (6 agents: Comprehensive analysis)
```

### Step 2: Load Story Context

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

### Step 3: Invoke Multi-Agent Review Skill (Fresh Context + Smart Agent Selection)

**CRITICAL:** This review MUST happen in a FRESH CONTEXT (new session, different agent).

**Smart Agent Selection:**
- Skill analyzes changed files and selects MOST RELEVANT agents
- Touching payments code? → Add financial-security agent
- Touching auth code? → Add auth-security agent
- Touching file uploads? → Add file-security agent
- Touching performance-critical code? → Add performance agent
- Agent count determined by complexity, but agents chosen by code analysis

```xml
<invoke-skill skill="multi-agent-review">
  <parameter name="story_id">{story_id}</parameter>
  <parameter name="base_branch">{base_branch}</parameter>
  <parameter name="max_agents">{agent_count}</parameter>
  <parameter name="agent_selection">smart</parameter>
  <parameter name="fresh_context">true</parameter>
</invoke-skill>
```

The skill will:
1. Create fresh context (unbiased review session)
2. Analyze changed files in the story
3. Detect code categories (auth, payments, file handling, etc.)
4. Select {agent_count} MOST RELEVANT specialized agents
5. Run parallel reviews from selected agents
6. Each agent reviews from their expertise perspective
7. Aggregate findings with severity ratings
8. Return comprehensive review report

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
