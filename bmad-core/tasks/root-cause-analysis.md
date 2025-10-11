# root-cause-analysis

Focused root cause analysis using fishbone (Ishikawa) methodology.

## Context

This task performs systematic root cause analysis to identify the underlying causes of defects, moving beyond symptoms to address fundamental issues.

## Task Execution

### Step 1: Problem Definition

1. Clearly state the problem/symptom
2. Define when it occurs (timing, frequency)
3. Define where it occurs (component, environment)
4. Quantify the impact (users affected, severity)

### Step 2: Fishbone Analysis Categories

Analyze the problem across these dimensions:

#### People (Developer/User factors)

- Knowledge gaps or misunderstandings
- Communication breakdowns
- Incorrect assumptions
- User behavior patterns

#### Process (Development/Deployment)

- Missing validation steps
- Inadequate testing coverage
- Deployment procedures
- Code review gaps

#### Technology (Tools/Infrastructure)

- Framework limitations
- Library bugs or incompatibilities
- Infrastructure issues
- Tool configuration problems

#### Environment (System/Configuration)

- Environment-specific settings
- Resource constraints
- External dependencies
- Network or connectivity issues

#### Data (Input/State)

- Invalid or unexpected input
- Data corruption or inconsistency
- State management issues
- Race conditions

#### Methods (Algorithms/Design)

- Algorithm flaws
- Design pattern misuse
- Architecture limitations
- Performance bottlenecks

### Step 3: 5-Whys Deep Dive

For each potential cause identified:

1. Ask "Why does this happen?"
2. For each answer, ask "Why?" again
3. Continue until reaching the root cause (typically 5 iterations)
4. Document the chain of causation

### Step 4: Evidence Collection

For each identified root cause:

- Gather supporting evidence (logs, code, metrics)
- Verify through reproduction or testing
- Rule out alternative explanations
- Establish confidence level

### Step 5: Root Cause Prioritization

Rank root causes by:

- Likelihood (probability this is the true cause)
- Impact (severity if this is the cause)
- Effort (complexity to address)
- Risk (potential for recurrence)

## Output Format

```markdown
# Root Cause Analysis: [Problem Description]

## Problem Statement

**What:** [Clear problem description]
**When:** [Timing/frequency]
**Where:** [Location/component]
**Impact:** [Quantified impact]

## Fishbone Analysis

### Category: [People/Process/Technology/Environment/Data/Methods]

**Potential Cause:** [Description]
**5-Whys Analysis:**

1. Why? [Answer]
2. Why? [Answer]
3. Why? [Answer]
4. Why? [Answer]
5. Why? [Root cause]

**Evidence:** [Supporting data/logs/code]
**Confidence:** [High/Medium/Low]

## Root Cause Summary

### Primary Root Cause

[Most likely root cause with evidence]

### Contributing Factors

1. [Secondary cause]
2. [Tertiary cause]

## Recommended Actions

1. **Immediate:** [Quick fix to address symptom]
2. **Short-term:** [Fix root cause]
3. **Long-term:** [Prevent recurrence]

## Verification Plan

[How to verify the root cause is correctly identified]
```

## Completion Criteria

- [ ] Problem clearly defined
- [ ] Fishbone analysis completed
- [ ] 5-Whys analysis performed
- [ ] Evidence collected and verified
- [ ] Root cause identified with confidence level
- [ ] Action plan created
