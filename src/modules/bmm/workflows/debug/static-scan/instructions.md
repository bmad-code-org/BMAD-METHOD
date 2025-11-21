# static-analysis

Comprehensive static analysis for defect detection and code quality assessment.

## Context

This task performs deep static analysis to identify bugs, anti-patterns, security vulnerabilities, and code quality issues without executing the code. It combines multiple analysis techniques to provide a comprehensive view of potential problems.

## Task Execution

### Phase 1: Multi-Layer Analysis

#### Layer 1: Syntax and Style Analysis

1. **Syntax Errors**: Malformed code that won't compile/run
2. **Style Violations**: Inconsistent formatting, naming conventions
3. **Dead Code**: Unreachable code, unused variables/functions
4. **Code Duplication**: Copy-paste code blocks

#### Layer 2: Semantic Analysis

1. **Type Issues**: Type mismatches, implicit conversions
2. **Logic Errors**: Always true/false conditions, impossible states
3. **Resource Leaks**: Unclosed files, unreleased memory
4. **API Misuse**: Incorrect parameter order, deprecated methods

#### Layer 3: Flow Analysis

1. **Control Flow**: Infinite loops, unreachable code, missing returns
2. **Data Flow**: Uninitialized variables, unused assignments
3. **Exception Flow**: Unhandled exceptions, empty catch blocks
4. **Null Flow**: Potential null dereferences

#### Layer 4: Security Analysis

1. **Injection Vulnerabilities**: SQL, XSS, command injection
2. **Authentication Issues**: Hardcoded credentials, weak crypto
3. **Data Exposure**: Sensitive data in logs, unencrypted storage
4. **Access Control**: Missing authorization, privilege escalation

### Phase 2: Pattern Detection

#### Anti-Patterns to Detect

**Code Smells:**

```
- God Classes/Functions (too much responsibility)
- Long Parameter Lists (>3-4 parameters)
- Feature Envy (excessive external data access)
- Data Clumps (repeated parameter groups)
- Primitive Obsession (overuse of primitives)
- Switch Statements (missing polymorphism)
- Lazy Class (too little responsibility)
- Speculative Generality (unused abstraction)
- Message Chains (deep coupling)
- Middle Man (unnecessary delegation)
```

**Performance Issues:**

```
- N+1 Queries (database inefficiency)
- Synchronous I/O in async context
- Inefficient Algorithms (O(n²) when O(n) possible)
- Memory Leaks (retained references)
- Excessive Object Creation (GC pressure)
- String Concatenation in Loops
- Missing Indexes (database)
- Blocking Operations (thread starvation)
```

**Concurrency Issues:**

```
- Race Conditions (unsynchronized access)
- Deadlocks (circular wait)
- Thread Leaks (unclosed threads)
- Missing Volatile (visibility issues)
- Double-Checked Locking (broken pattern)
- Lock Contention (performance bottleneck)
```

### Phase 3: Complexity Analysis

#### Metrics Calculation

1. **Cyclomatic Complexity**: Number of linearly independent paths
2. **Cognitive Complexity**: How difficult code is to understand
3. **Halstead Metrics**: Program vocabulary and difficulty
4. **Maintainability Index**: Composite maintainability score
5. **Technical Debt**: Estimated time to fix all issues
6. **Test Coverage**: Lines/branches/functions covered

#### Thresholds

```
Cyclomatic Complexity:
- Good: < 10
- Acceptable: 10-20
- Complex: 20-50
- Untestable: > 50

Cognitive Complexity:
- Simple: < 5
- Moderate: 5-10
- Complex: 10-15
- Very Complex: > 15
```

### Phase 4: Dependency Analysis

#### Identify Issues

1. **Circular Dependencies**: A→B→C→A cycles
2. **Version Conflicts**: Incompatible dependency versions
3. **Security Vulnerabilities**: Known CVEs in dependencies
4. **License Conflicts**: Incompatible license combinations
5. **Outdated Packages**: Dependencies needing updates
6. **Unused Dependencies**: Declared but not used

### Phase 5: Architecture Analysis

#### Structural Issues

1. **Layer Violations**: Cross-layer dependencies
2. **Module Coupling**: High interdependence
3. **Missing Abstractions**: Direct implementation dependencies
4. **Inconsistent Patterns**: Mixed architectural styles
5. **God Objects**: Central points of failure

## Automated Tools Integration

Simulate output from common static analysis tools:

**ESLint/TSLint** (JavaScript/TypeScript)
**Pylint/Flake8** (Python)
**SonarQube** (Multi-language)
**PMD/SpotBugs** (Java)
**RuboCop** (Ruby)
**SwiftLint** (Swift)

## Output Format

````markdown
# Static Analysis Report

## Executive Summary

**Files Analyzed:** [count]
**Total Issues:** [count]
**Critical:** [count] | **High:** [count] | **Medium:** [count] | **Low:** [count]
**Technical Debt:** [hours/days estimated]
**Code Coverage:** [percentage]

## Critical Issues (Immediate Action Required)

### Issue 1: [Security Vulnerability]

**File:** [path:line]
**Category:** Security
**Rule:** [CWE-ID or rule name]

```[language]
// Vulnerable code
[code snippet]
```
````

**Risk:** [Description of security risk]
**Fix:**

```[language]
// Secure code
[fixed code]
```

### Issue 2: [Logic Error]

[Similar format]

## High Priority Issues

### Category: Performance

| File   | Line   | Issue           | Impact       | Fix Effort |
| ------ | ------ | --------------- | ------------ | ---------- |
| [file] | [line] | N+1 Query       | High latency | 2 hours    |
| [file] | [line] | O(n²) algorithm | CPU spike    | 4 hours    |

### Category: Reliability

[Similar table format]

## Code Quality Metrics

### Complexity Analysis

| File   | Cyclomatic | Cognitive | Maintainability | Action   |
| ------ | ---------- | --------- | --------------- | -------- |
| [file] | 45 (High)  | 28 (High) | 35 (Low)        | Refactor |
| [file] | 32 (Med)   | 18 (Med)  | 55 (Med)        | Review   |

### Duplication Analysis

**Total Duplication:** [percentage]
**Largest Duplicate:** [lines] lines in [files]

### Top Duplicated Blocks:

1. [File A:lines] ↔ [File B:lines] - [line count] lines
2. [File C:lines] ↔ [File D:lines] - [line count] lines

## Anti-Pattern Detection

### God Classes

1. **[ClassName]** - [methods] methods, [lines] lines
   - Responsibilities: [list]
   - Suggested Split: [recommendations]

### Long Methods

1. **[methodName]** - [lines] lines, complexity: [score]
   - Extract Methods: [suggestions]

## Security Scan Results

### Vulnerabilities by Category

- Injection: [count]
- Authentication: [count]
- Data Exposure: [count]
- Access Control: [count]

### Detailed Findings

[List each with severity, location, and fix]

## Dependency Analysis

### Security Vulnerabilities

| Package | Version | CVE      | Severity | Fixed Version |
| ------- | ------- | -------- | -------- | ------------- |
| [pkg]   | [ver]   | [CVE-ID] | Critical | [ver]         |

### Outdated Dependencies

| Package | Current | Latest | Breaking Changes |
| ------- | ------- | ------ | ---------------- |
| [pkg]   | [ver]   | [ver]  | [Yes/No]         |

## Recommendations

### Immediate Actions (This Sprint)

1. Fix all critical security vulnerabilities
2. Resolve high-severity logic errors
3. Update vulnerable dependencies

### Short-term (Next Sprint)

1. Refactor high-complexity functions
2. Remove code duplication
3. Add missing error handling

### Long-term (Technical Debt)

1. Architectural improvements
2. Comprehensive refactoring
3. Test coverage improvement

## Trend Analysis

**Compared to Last Scan:**

- Issues: [+/-X]
- Complexity: [+/-Y]
- Coverage: [+/-Z%]
- Technical Debt: [+/-N hours]

```

## Completion Criteria
- [ ] All analysis layers completed
- [ ] Issues categorized by severity
- [ ] Metrics calculated
- [ ] Anti-patterns identified
- [ ] Security vulnerabilities found
- [ ] Dependencies analyzed
- [ ] Recommendations prioritized
- [ ] Fixes suggested for critical issues
```
