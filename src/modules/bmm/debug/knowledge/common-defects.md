# common-defects

Reference guide for common software defects and their characteristics.

## Defect Classification System

### By Origin

1. **Requirements Defects** - Ambiguous, incomplete, or incorrect requirements
2. **Design Defects** - Architectural flaws, poor design decisions
3. **Coding Defects** - Implementation errors, logic mistakes
4. **Testing Defects** - Inadequate test coverage, wrong test assumptions
5. **Deployment Defects** - Configuration errors, environment issues
6. **Documentation Defects** - Outdated, incorrect, or missing documentation

### By Type

#### Logic Defects

- **Algorithm Errors:** Incorrect implementation of business logic
- **Control Flow Issues:** Wrong branching, loop errors
- **Boundary Violations:** Off-by-one, overflow, underflow
- **State Management:** Invalid state transitions, race conditions

#### Data Defects

- **Input Validation:** Missing or incorrect validation
- **Data Corruption:** Incorrect data manipulation
- **Type Errors:** Wrong data types, failed conversions
- **Persistence Issues:** Failed saves, data loss

#### Interface Defects

- **API Misuse:** Incorrect parameter passing, wrong method calls
- **Integration Errors:** Component communication failures
- **Protocol Violations:** Incorrect message formats
- **Version Incompatibility:** Breaking changes not handled

#### Performance Defects

- **Memory Leaks:** Unreleased resources
- **Inefficient Algorithms:** O(n²) where O(n) possible
- **Database Issues:** N+1 queries, missing indexes
- **Resource Contention:** Deadlocks, bottlenecks

#### Security Defects

- **Injection Flaws:** SQL, XSS, command injection
- **Authentication Issues:** Weak auth, session problems
- **Authorization Flaws:** Privilege escalation, IDOR
- **Data Exposure:** Sensitive data leaks, weak encryption

## Severity Classification

### Critical (P0)

- **Definition:** System unusable, data loss, security breach
- **Response Time:** Immediate
- **Examples:**
  - Application crash on startup
  - Data corruption or loss
  - Security vulnerability actively exploited
  - Complete feature failure

### High (P1)

- **Definition:** Major feature broken, significant impact
- **Response Time:** Within 24 hours
- **Examples:**
  - Core functionality impaired
  - Performance severely degraded
  - Workaround exists but difficult
  - Affects many users

### Medium (P2)

- **Definition:** Feature impaired, moderate impact
- **Response Time:** Within sprint
- **Examples:**
  - Non-core feature broken
  - Easy workaround available
  - Cosmetic issues with functional impact
  - Affects some users

### Low (P3)

- **Definition:** Minor issue, minimal impact
- **Response Time:** Next release
- **Examples:**
  - Cosmetic issues
  - Minor inconvenience
  - Edge case scenarios
  - Documentation errors

## Root Cause Categories

### Development Process

1. **Inadequate Requirements:** Missing acceptance criteria
2. **Poor Communication:** Misunderstood requirements
3. **Insufficient Review:** Code review missed issues
4. **Time Pressure:** Rushed implementation

### Technical Factors

1. **Complexity:** System too complex to understand fully
2. **Technical Debt:** Accumulated shortcuts causing issues
3. **Tool Limitations:** Development tools inadequate
4. **Knowledge Gap:** Team lacks necessary expertise

### Testing Gaps

1. **Missing Tests:** Scenario not covered
2. **Wrong Assumptions:** Tests based on incorrect understanding
3. **Environment Differences:** Works in test, fails in production
4. **Data Issues:** Test data not representative

### Organizational Issues

1. **Process Failures:** Procedures not followed
2. **Resource Constraints:** Insufficient time/people
3. **Training Gaps:** Team not properly trained
4. **Culture Issues:** Quality not prioritized

## Detection Methods

### Static Analysis

- **Code Review:** Manual inspection by peers
- **Linting:** Automated style and error checking
- **Security Scanning:** SAST tools
- **Complexity Analysis:** Cyclomatic complexity metrics

### Dynamic Analysis

- **Unit Testing:** Component-level testing
- **Integration Testing:** Component interaction testing
- **System Testing:** End-to-end testing
- **Performance Testing:** Load and stress testing

### Runtime Monitoring

- **Error Tracking:** Sentry, Rollbar
- **APM Tools:** Application performance monitoring
- **Log Analysis:** Centralized logging
- **User Reports:** Bug reports from users

### Formal Methods

- **Fagan Inspection:** Systematic peer review
- **Code Walkthroughs:** Step-by-step review
- **Pair Programming:** Real-time review
- **Test-Driven Development:** Test-first approach

## Prevention Strategies

### Process Improvements

1. **Clear Requirements:** Use user stories with acceptance criteria
2. **Design Reviews:** Architecture review before coding
3. **Code Standards:** Enforce coding guidelines
4. **Automated Testing:** CI/CD with comprehensive tests

### Technical Practices

1. **Defensive Programming:** Validate inputs, handle errors
2. **Design Patterns:** Use proven solutions
3. **Refactoring:** Regular code improvement
4. **Documentation:** Keep docs current

### Team Practices

1. **Knowledge Sharing:** Regular tech talks, documentation
2. **Pair Programming:** Collaborative development
3. **Code Reviews:** Mandatory peer review
4. **Retrospectives:** Learn from mistakes

### Tool Support

1. **Static Analyzers:** SonarQube, ESLint
2. **Test Frameworks:** Jest, Pytest, JUnit
3. **CI/CD Pipelines:** Jenkins, GitHub Actions
4. **Monitoring Tools:** Datadog, New Relic

## Defect Metrics

### Detection Metrics

- **Defect Density:** Defects per KLOC
- **Detection Rate:** Defects found per time period
- **Escape Rate:** Defects reaching production
- **Mean Time to Detect:** Average detection time

### Resolution Metrics

- **Fix Rate:** Defects fixed per time period
- **Mean Time to Fix:** Average fix time
- **Reopen Rate:** Defects reopened after fix
- **Fix Effectiveness:** First-time fix success rate

### Quality Metrics

- **Test Coverage:** Percentage of code tested
- **Code Complexity:** Average cyclomatic complexity
- **Technical Debt:** Estimated remediation effort
- **Customer Satisfaction:** User-reported issues
