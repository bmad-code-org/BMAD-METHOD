# debug-report-generation

Generate comprehensive debug report from analysis session.

## Context

This task consolidates all debugging findings, analyses, and recommendations into a comprehensive report for stakeholders and future reference.

## Task Execution

### Step 1: Gather Session Data

Collect all relevant information:

1. Original bug description and symptoms
2. Analysis performed (inspections, root cause, patterns)
3. Evidence collected (logs, code, metrics)
4. Findings and conclusions
5. Fix attempts and results
6. Recommendations made

### Step 2: Structure Report

Organize information hierarchically:

1. Executive Summary (1 page max)
2. Detailed Findings
3. Technical Analysis
4. Recommendations
5. Appendices

### Step 3: Generate Report Sections

#### Executive Summary

- Problem statement (1-2 sentences)
- Impact assessment (users, systems, business)
- Root cause (brief)
- Recommended fix (high-level)
- Estimated effort and risk

#### Detailed Findings

- Symptoms observed
- Reproduction steps
- Environmental factors
- Timeline of issue

#### Technical Analysis

- Code examination results
- Root cause analysis
- Pattern detection findings
- Test coverage gaps
- Performance impacts

#### Recommendations

- Immediate fixes
- Short-term improvements
- Long-term prevention
- Process enhancements

### Step 4: Add Supporting Evidence

Include relevant:

- Code snippets
- Log excerpts
- Stack traces
- Performance metrics
- Test results
- Screenshots (if applicable)

### Step 5: Quality Review

Ensure report:

- Is technically accurate
- Uses clear, concise language
- Includes all critical information
- Provides actionable recommendations
- Is appropriately formatted

## Output Format

````markdown
# Debug Analysis Report

**Report ID:** DBG-[timestamp]
**Date:** [current date]
**Analyst:** Debug Agent (Diana)
**Severity:** [Critical/High/Medium/Low]
**Status:** [Resolved/In Progress/Pending]

---

## Executive Summary

**Problem:** [1-2 sentence problem statement]

**Impact:** [Quantified impact on users/system]

**Root Cause:** [Brief root cause description]

**Solution:** [High-level fix description]

**Effort Required:** [Hours/Days estimate]
**Risk Level:** [High/Medium/Low]

---

## 1. Problem Description

### Symptoms

[Detailed symptoms observed]

### Reproduction

1. [Step 1]
2. [Step 2]
3. [Expected vs Actual]

### Environment

- **System:** [OS, version]
- **Application:** [Version, build]
- **Dependencies:** [Relevant versions]
- **Configuration:** [Key settings]

### Timeline

- **First Observed:** [Date/time]
- **Frequency:** [How often]
- **Last Occurrence:** [Date/time]

---

## 2. Technical Analysis

### Root Cause Analysis

[Detailed root cause with evidence]

### Code Analysis

```[language]
// Problematic code
[code snippet]
```
````

**Issue:** [What's wrong with the code]

### Pattern Analysis

[Any patterns detected]

### Test Coverage

- **Current Coverage:** [percentage]
- **Gap Identified:** [What's not tested]
- **Risk Areas:** [Untested critical paths]

---

## 3. Impact Assessment

### Severity Matrix

| Aspect         | Impact              | Severity       |
| -------------- | ------------------- | -------------- |
| Users Affected | [number/percentage] | [High/Med/Low] |
| Data Integrity | [description]       | [High/Med/Low] |
| Performance    | [metrics]           | [High/Med/Low] |
| Security       | [assessment]        | [High/Med/Low] |

### Business Impact

[Business consequences of the issue]

---

## 4. Solution & Recommendations

### Immediate Fix

```[language]
// Corrected code
[code snippet]
```

**Validation:** [How to verify fix works]

### Short-term Improvements

1. [Improvement 1]
2. [Improvement 2]

### Long-term Prevention

1. [Strategy 1]
2. [Strategy 2]

### Process Enhancements

1. [Process improvement]
2. [Tool/automation suggestion]

---

## 5. Implementation Plan

### Phase 1: Immediate (0-2 days)

- [ ] Apply code fix
- [ ] Add regression test
- [ ] Deploy to staging

### Phase 2: Short-term (1 week)

- [ ] Improve test coverage
- [ ] Add monitoring
- [ ] Update documentation

### Phase 3: Long-term (1 month)

- [ ] Refactor problematic area
- [ ] Implement prevention measures
- [ ] Team training on issue

---

## 6. Verification & Testing

### Test Cases

1. **Test:** [Name]
   **Steps:** [How to test]
   **Expected:** [Result]

### Regression Testing

[Areas requiring regression testing]

### Monitoring

[Metrics to monitor post-fix]

---

## 7. Lessons Learned

### What Went Wrong

[Root causes beyond the code]

### What Could Improve

[Process/tool improvements]

### Knowledge Sharing

[Information to share with team]

---

## Appendices

### A. Full Stack Traces

[Complete error traces]

### B. Log Excerpts

[Relevant log entries]

### C. Performance Metrics

[Before/after metrics]

### D. Related Issues

[Links to similar problems]

### E. References

[Documentation, articles, tools used]

---

**Report Generated:** [timestamp]
**Next Review:** [date for follow-up]

```

## Completion Criteria
- [ ] All sections completed
- [ ] Evidence included
- [ ] Recommendations actionable
- [ ] Report reviewed for accuracy
- [ ] Formatted for readability
- [ ] Ready for distribution
```
