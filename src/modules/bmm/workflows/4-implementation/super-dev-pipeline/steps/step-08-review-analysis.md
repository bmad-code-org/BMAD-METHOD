---
name: 'step-08-review-analysis'
description: 'Intelligently analyze code review findings - distinguish real issues from gold plating'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-08-review-analysis.md'
stateFile: '{state_file}'
storyFile: '{story_file}'
reviewReport: '{sprint_artifacts}/review-{story_id}.md'

# Next step
nextStep: '{workflow_path}/steps/step-09-fix-issues.md'
---

# Step 8: Review Analysis

**Goal:** Critically analyze code review findings to distinguish **real problems** from **gold plating**, **false positives**, and **overzealous suggestions**.

## The Problem

AI code reviewers (and human reviewers) sometimes:
- 🎨 **Gold plate**: Suggest unnecessary perfectionism
- 🔍 **Overreact**: Flag non-issues to appear thorough
- 📚 **Over-engineer**: Suggest abstractions for simple cases
- ⚖️ **Misjudge context**: Apply rules without understanding tradeoffs

## The Solution

**Critical thinking filter**: Evaluate each finding objectively.

---

## Process

### 1. Load Review Report

```bash
# Read the code review report
review_report="{reviewReport}"
test -f "$review_report" || (echo "⚠️ No review report found" && exit 0)
```

Parse findings by severity:
- 🔴 CRITICAL
- 🟠 HIGH
- 🟡 MEDIUM
- 🔵 LOW
- ℹ️ INFO

### 2. Categorize Each Finding

For EACH finding, ask these questions:

#### Question 1: Is this a REAL problem?

```
Real Problem Indicators:
✅ Would cause bugs or incorrect behavior
✅ Would cause security vulnerabilities
✅ Would cause performance issues in production
✅ Would make future maintenance significantly harder
✅ Violates team/project standards documented in codebase

NOT Real Problems:
❌ "Could be more elegant" (subjective style preference)
❌ "Consider adding abstraction" (YAGNI - you aren't gonna need it)
❌ "This pattern is not ideal" (works fine, alternative is marginal)
❌ "Add comprehensive error handling" (for impossible error cases)
❌ "Add logging everywhere" (log signal, not noise)
```

#### Question 2: Does this finding understand CONTEXT?

```
Context Considerations:
📋 Story scope: Does fixing this exceed story requirements?
🎯 Project maturity: Is this MVP, beta, or production-hardened?
⚡ Performance criticality: Is this a hot path or cold path?
👥 Team standards: Does team actually follow this pattern?
📊 Data scale: Does this handle actual expected volume?

Example of MISSING context:
Finding: "Add database indexing for better performance"
Reality: Table has 100 rows total, query runs once per day
Verdict: ❌ REJECT - Premature optimization
```

#### Question 3: Is this ACTIONABLE?

```
Actionable Findings:
✅ Specific file, line number, exact issue
✅ Clear explanation of problem
✅ Concrete recommendation for fix
✅ Can be fixed in reasonable time

NOT Actionable:
❌ Vague: "Code quality could be improved"
❌ No location: "Some error handling is missing"
❌ No recommendation: "This might cause issues"
❌ Massive scope: "Refactor entire architecture"
```

### 3. Classification Decision Tree

For each finding, classify as:

```
┌─────────────────────────────────────────┐
│ Finding Classification Decision Tree    │
└─────────────────────────────────────────┘

Is it a CRITICAL security/correctness issue?
├─ YES → 🔴 MUST FIX
└─ NO ↓

Does it violate documented project standards?
├─ YES → 🟠 SHOULD FIX
└─ NO ↓

Would it prevent future maintenance?
├─ YES → 🟡 CONSIDER FIX (if in scope)
└─ NO ↓

Is it gold plating / over-engineering?
├─ YES → ⚪ REJECT (document why)
└─ NO ↓

Is it a style/opinion without real impact?
├─ YES → ⚪ REJECT (document why)
└─ NO → 🔵 OPTIONAL (tech debt backlog)
```

### 4. Create Classification Report

```markdown
# Code Review Analysis: Story {story_id}

## Review Metadata
- Reviewer: {reviewer_type} (Adversarial / Multi-Agent)
- Total Findings: {total_findings}
- Review Date: {date}

## Classification Results

### 🔴 MUST FIX (Critical - Blocking)
Total: {must_fix_count}

1. **[SECURITY] Unvalidated user input in API endpoint**
   - File: `src/api/users.ts:45`
   - Issue: POST /api/users accepts unvalidated input, SQL injection risk
   - Why this is real: Security vulnerability, could lead to data breach
   - Action: Add input validation with Zod schema
   - Estimated effort: 30 min

2. **[CORRECTNESS] Race condition in state update**
   - File: `src/components/UserForm.tsx:67`
   - Issue: Multiple async setState calls without proper sequencing
   - Why this is real: Causes intermittent bugs in production
   - Action: Use functional setState or useReducer
   - Estimated effort: 20 min

### 🟠 SHOULD FIX (High Priority)
Total: {should_fix_count}

3. **[STANDARDS] Missing error handling per team convention**
   - File: `src/services/userService.ts:34`
   - Issue: API calls lack try-catch per documented standards
   - Why this matters: Team standard in CONTRIBUTING.md section 3.2
   - Action: Wrap in try-catch, log errors
   - Estimated effort: 15 min

### 🟡 CONSIDER FIX (Medium - If in scope)
Total: {consider_count}

4. **[MAINTAINABILITY] Complex nested conditional**
   - File: `src/utils/validation.ts:23`
   - Issue: 4-level nested if-else hard to read
   - Why this matters: Could confuse future maintainers
   - Action: Extract to guard clauses or lookup table
   - Estimated effort: 45 min
   - **Scope consideration**: Nice to have, but not blocking

### ⚪ REJECTED (Gold Plating / False Positives)
Total: {rejected_count}

5. **[REJECTED] "Add comprehensive logging to all functions"**
   - Reason: Gold plating - logging should be signal, not noise
   - Context: These are simple utility functions, no debugging issues
   - Verdict: REJECT - Would create log spam

6. **[REJECTED] "Extract component for reusability"**
   - Reason: YAGNI - component used only once, no reuse planned
   - Context: Story scope is single-use dashboard widget
   - Verdict: REJECT - Premature abstraction

7. **[REJECTED] "Add database connection pooling"**
   - Reason: Premature optimization - current load is minimal
   - Context: App has 10 concurrent users max, no performance issues
   - Verdict: REJECT - Optimize when needed, not speculatively

8. **[REJECTED] "Consider microservices architecture"**
   - Reason: Out of scope - architectural decision beyond story
   - Context: Story is adding a single API endpoint
   - Verdict: REJECT - Massive overreach

### 🔵 OPTIONAL (Tech Debt Backlog)
Total: {optional_count}

9. **[STYLE] Inconsistent naming convention**
   - File: `src/utils/helpers.ts:12`
   - Issue: camelCase vs snake_case mixing
   - Why low priority: Works fine, linter doesn't flag it
   - Action: Standardize to camelCase when touching this file later
   - Create tech debt ticket: TD-{number}

## Summary

**Action Plan:**
- 🔴 MUST FIX: {must_fix_count} issues (blocking)
- 🟠 SHOULD FIX: {should_fix_count} issues (high priority)
- 🟡 CONSIDER: {consider_count} issues (if time permits)
- ⚪ REJECTED: {rejected_count} findings (documented why)
- 🔵 OPTIONAL: {optional_count} items (tech debt backlog)

**Estimated fix time:** {total_fix_time_hours} hours

**Proceed to:** Step 9 - Fix Issues (implement MUST FIX + SHOULD FIX items)
```

### 5. Document Rejections

**CRITICAL:** When rejecting findings, ALWAYS document WHY:

```markdown
## Rejected Findings - Rationale

### Finding: "Add caching layer for all API calls"
**Rejected because:**
- ⚡ Premature optimization - no performance issues detected
- 📊 Traffic analysis shows <100 requests/day
- 🎯 Story scope is feature addition, not optimization
- 💰 Cost: 2 days implementation, 0 proven benefit
- 📝 Decision: Monitor first, optimize if needed

### Finding: "Refactor to use dependency injection"
**Rejected because:**
- 🏗️ Over-engineering - current approach works fine
- 📏 Codebase size doesn't justify DI complexity
- 👥 Team unfamiliar with DI patterns
- 🎯 Story scope: simple feature, not architecture overhaul
- 📝 Decision: Keep it simple, revisit if codebase grows

### Finding: "Add comprehensive JSDoc to all functions"
**Rejected because:**
- 📚 Gold plating - TypeScript types provide documentation
- ⏱️ Time sink - 4+ hours for marginal benefit
- 🎯 Team standard: JSDoc only for public APIs
- 📝 Decision: Follow team convention, not reviewer preference
```

### 6. Update State

```yaml
# Update {stateFile}
current_step: 8
review_analysis:
  must_fix: {must_fix_count}
  should_fix: {should_fix_count}
  consider: {consider_count}
  rejected: {rejected_count}
  optional: {optional_count}
  estimated_fix_time: "{total_fix_time_hours}h"
  rejections_documented: true
  analysis_complete: true
```

---

## Critical Thinking Framework

Use this framework to evaluate EVERY finding:

### The "So What?" Test
- **Ask:** "So what if we don't fix this?"
- **If answer is:** "Nothing bad happens" → REJECT
- **If answer is:** "Production breaks" → MUST FIX

### The "YAGNI" Test (You Aren't Gonna Need It)
- **Ask:** "Do we need this NOW for current requirements?"
- **If answer is:** "Maybe someday" → REJECT
- **If answer is:** "Yes, breaks without it" → FIX

### The "Scope" Test
- **Ask:** "Is this within the story's scope?"
- **If answer is:** "No, requires new story" → REJECT (or create new story)
- **If answer is:** "Yes, part of ACs" → FIX

### The "Team Standard" Test
- **Ask:** "Does our team actually do this?"
- **If answer is:** "No, reviewer's opinion" → REJECT
- **If answer is:** "Yes, in CONTRIBUTING.md" → FIX

---

## Common Rejection Patterns

Learn to recognize these patterns:

1. **"Consider adding..."** - Usually gold plating unless critical
2. **"It would be better if..."** - Subjective opinion, often rejectable
3. **"For maximum performance..."** - Premature optimization
4. **"To follow best practices..."** - Check if team actually follows it
5. **"This could be refactored..."** - Does it need refactoring NOW?
6. **"Add comprehensive..."** - Comprehensive = overkill most of the time
7. **"Future-proof by..."** - Can't predict future, solve current problems

---

## Next Step

Proceed to **Step 9: Fix Issues** ({nextStep})

Implement MUST FIX and SHOULD FIX items. Skip rejected items (already documented why).
