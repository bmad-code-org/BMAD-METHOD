# pattern-detection

Analyze code and commit history for defect patterns and systemic issues.

## Context

This task identifies recurring defect patterns, systemic issues, and common problem areas to enable proactive quality improvements.

## Task Execution

### Step 1: Historical Analysis

#### Recent Commits Analysis

1. Review last 20-50 commits for:
   - Files frequently modified (hotspots)
   - Repeated fix attempts
   - Revert commits indicating instability
   - Emergency/hotfix patterns

#### Bug History Review

1. Analyze recent bug reports for:
   - Common symptoms
   - Recurring locations
   - Similar root causes
   - Fix patterns

### Step 2: Code Pattern Detection

#### Anti-Pattern Identification

Look for common problematic patterns:

- God objects/functions (excessive responsibility)
- Copy-paste code (DRY violations)
- Dead code (unused functions/variables)
- Complex conditionals (cyclomatic complexity)
- Long parameter lists
- Inappropriate intimacy (tight coupling)

#### Vulnerability Patterns

Check for security/reliability issues:

- Input validation gaps
- Error handling inconsistencies
- Resource leak patterns
- Race condition indicators
- SQL injection risks
- XSS vulnerabilities

### Step 3: Architectural Pattern Analysis

#### Dependency Issues

- Circular dependencies
- Version conflicts
- Missing abstractions
- Leaky abstractions
- Inappropriate dependencies

#### Design Smells

- Violated SOLID principles
- Missing design patterns where needed
- Over-engineering indicators
- Technical debt accumulation

### Step 4: Team Pattern Analysis

#### Development Patterns

- Rush commits (end of sprint)
- Incomplete implementations
- Missing tests for bug fixes
- Documentation gaps
- Code review oversights

#### Communication Patterns

- Misunderstood requirements
- Incomplete handoffs
- Knowledge silos
- Missing context in commits

### Step 5: Pattern Correlation

1. Group related patterns by:
   - Component/module
   - Developer/team
   - Time period
   - Feature area

2. Identify correlations:
   - Patterns that appear together
   - Cascade effects
   - Root pattern causing others

## Output Format

```markdown
# Defect Pattern Analysis Report

## Executive Summary

[High-level overview of key patterns found]

## Critical Patterns Detected

### Pattern 1: [Pattern Name]

**Type:** [Anti-pattern/Vulnerability/Design/Process]
**Frequency:** [Number of occurrences]
**Locations:**

- [file:line]
- [file:line]

**Description:** [What the pattern is]
**Impact:** [Why it matters]
**Example:** [Code snippet or commit reference]
**Recommendation:** [How to address]

## Hotspot Analysis

### High-Change Files

1. [filename] - [change count] changes, [bug count] bugs
2. [filename] - [change count] changes, [bug count] bugs

### Complex Areas

1. [component] - Complexity score: [number]
2. [component] - Complexity score: [number]

## Systemic Issues

### Issue 1: [Issue Name]

**Pattern Indicators:**

- [Pattern that indicates this issue]
- [Another indicator]

**Root Cause:** [Underlying systemic problem]
**Affected Areas:** [Components/teams affected]
**Priority:** [Critical/High/Medium/Low]
**Remediation Strategy:** [How to fix systematically]

## Trend Analysis

### Improving Areas

- [Area showing positive trends]

### Degrading Areas

- [Area showing negative trends]

### Stable Problem Areas

- [Persistent issues not getting better or worse]

## Recommendations

### Immediate Actions

1. [Quick win to address patterns]
2. [Another quick action]

### Short-term Improvements

1. [1-2 sprint improvements]
2. [Process changes needed]

### Long-term Strategy

1. [Architectural changes]
2. [Team/process evolution]

## Prevention Checklist

- [ ] Add static analysis for [pattern]
- [ ] Implement pre-commit hooks for [issue]
- [ ] Create coding standards for [area]
- [ ] Add automated tests for [vulnerability]
- [ ] Improve documentation for [component]
```

## Completion Criteria

- [ ] Historical analysis completed
- [ ] Code patterns identified
- [ ] Architectural issues found
- [ ] Team patterns analyzed
- [ ] Correlations established
- [ ] Recommendations provided
- [ ] Prevention strategies defined
