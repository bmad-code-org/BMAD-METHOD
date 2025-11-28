# Request Revision Workflow

## Overview

This workflow handles requesting code revisions from contractors via SMTP email. It ensures clear, actionable feedback is communicated asynchronously with appropriate deadlines and tracking.

## Prerequisites

- Contractor has submitted work (PR exists)
- Review has identified issues requiring changes
- Submission context available

---

## Workflow Stages

### Stage 1: Identify Submission

**Objective:** Load all relevant submission and review details.

**Load Submission Context:**

```yaml
submission:
  story_id: "STORY-123"
  story_title: "Implement user authentication API"
  contractor_id: "backend-001"
  contractor_name: "Backend Developer"
  contractor_email: "backend@contractor.example"
  pr_number: 456
  pr_url: "https://github.com/org/repo/pull/456"
  branch: "story/STORY-123-implement-user-auth"
  submitted_at: "2025-11-29T15:00:00Z"
  iteration: 1  # First submission
```

**Load Review Results:**

```yaml
review:
  reviewer: "contractor-coordinator"
  reviewed_at: "2025-11-30T10:00:00Z"
  decision: "request_revisions"
  issues_found:
    blockers: 2
    major: 1
    minor: 3
    suggestions: 2
  test_coverage: "85%"
  security_scan: "2 medium issues"
```

**Load Previous Iterations (if any):**

```yaml
previous_revisions:
  - iteration: 0
    submitted_at: "2025-11-28T12:00:00Z"
    issues_found: 5
    status: "revision_requested"
```

**Output:** Complete submission context

---

### Stage 2: Categorize Issues

**Objective:** Classify issues by severity and type for clear communication.

**Issue Severity:**

| Severity | Definition | Required? |
|----------|------------|-----------|
| 🚫 Blocker | Security vulnerability, breaking bug, or fundamental flaw | Must fix |
| ⚠️ Major | Significant issue affecting functionality or maintainability | Must fix |
| 📝 Minor | Code quality, style, or minor improvements | Should fix |
| 💡 Suggestion | Optional improvements or alternative approaches | Optional |

**Issue Categories:**

| Category | Examples |
|----------|----------|
| Security | Input validation, injection vulnerabilities, auth issues |
| Functionality | Logic errors, missing requirements, edge cases |
| Performance | N+1 queries, inefficient algorithms, resource leaks |
| Code Quality | Naming, structure, DRY violations, complexity |
| Testing | Missing tests, inadequate coverage, flaky tests |
| Documentation | Missing docs, outdated comments, unclear APIs |

**Categorized Issue List:**

```yaml
issues:
  blockers:
    - id: "REV-001"
      category: "security"
      severity: "blocker"
      title: "SQL Injection in user search"
      location: "src/repository/UserRepository.java:45"
      description: |
        Raw SQL query concatenates user input without sanitization.
        This allows SQL injection attacks.
      current_code: |
        String query = "SELECT * FROM users WHERE name = '" + name + "'";
      suggested_fix: |
        Use parameterized queries:
        String query = "SELECT * FROM users WHERE name = ?";
        jdbcTemplate.query(query, new Object[]{name}, rowMapper);
      references:
        - "OWASP SQL Injection: https://owasp.org/..."

    - id: "REV-002"
      category: "security"
      severity: "blocker"
      title: "Refresh token not invalidated on logout"
      location: "src/service/AuthService.java:89"
      description: |
        Logout does not invalidate the refresh token, allowing reuse.

  major:
    - id: "REV-003"
      category: "functionality"
      severity: "major"
      title: "Missing error handling for expired tokens"
      location: "src/controller/AuthController.java:67"
      description: |
        When token is expired, returns 500 instead of proper 401.

  minor:
    - id: "REV-004"
      category: "code_quality"
      severity: "minor"
      title: "Hardcoded token expiry value"
      location: "src/config/JwtConfig.java:23"
      description: |
        Token expiry is hardcoded. Should be configurable.

  suggestions:
    - id: "REV-005"
      category: "code_quality"
      severity: "suggestion"
      title: "Consider extracting token validation to utility"
      description: |
        Token validation logic is duplicated across 3 places.
```

**Issue Summary:**

```
Total Issues: 8
├── 🚫 Blockers: 2 (must fix)
├── ⚠️ Major: 1 (must fix)
├── 📝 Minor: 3 (should fix)
└── 💡 Suggestions: 2 (optional)

Required Changes: 3
Recommended Changes: 3
Optional Improvements: 2
```

**Output:** Categorized and prioritized issue list

---

### Stage 3: Prepare Feedback

**Objective:** Structure feedback for maximum clarity in async communication.

**Feedback Principles:**

1. **Be specific** - Exact file, line, and code references
2. **Explain why** - Help contractor learn, not just fix
3. **Provide examples** - Show suggested fixes when possible
4. **Prioritize clearly** - Distinguish blockers from nice-to-haves
5. **Be constructive** - Focus on code, not person
6. **Be complete** - Include everything in one email (async-first)

**Feedback Structure:**

```markdown
## Required Changes (Must Fix)

### 🚫 REV-001: SQL Injection in user search [BLOCKER]

**Location:** `src/repository/UserRepository.java:45`

**Issue:**
Raw SQL query concatenates user input without sanitization, allowing SQL injection attacks.

**Current Code:**
```java
String query = "SELECT * FROM users WHERE name = '" + name + "'";
```

**Fix Required:**
Use parameterized queries to prevent SQL injection:
```java
String query = "SELECT * FROM users WHERE name = ?";
jdbcTemplate.query(query, new Object[]{name}, rowMapper);
```

**Why This Matters:**
SQL injection is a critical security vulnerability (OWASP Top 10 #1) that can expose all user data.

---

### 🚫 REV-002: Refresh token not invalidated on logout [BLOCKER]

**Location:** `src/service/AuthService.java:89`

**Issue:**
The logout method does not invalidate the refresh token, allowing it to be reused after logout.

**Fix Required:**
Add refresh token invalidation to logout:
```java
public void logout(String refreshToken) {
    refreshTokenRepository.invalidate(refreshToken);  // Add this
    // ... existing code
}
```

---

## Recommended Changes (Should Fix)

### ⚠️ REV-003: Missing error handling for expired tokens [MAJOR]

**Location:** `src/controller/AuthController.java:67`

...

---

## Optional Improvements

### 💡 REV-005: Consider extracting token validation to utility

...
```

**Positive Feedback (if any):**

```markdown
## What's Working Well ✅

- Clean separation of concerns in the controller layer
- Good test coverage for happy path scenarios
- Clear API documentation with examples
```

**Output:** Structured feedback document

---

### Stage 4: Set Deadline

**Objective:** Determine appropriate revision deadline.

**Deadline Calculation:**

| Issue Count | Severity | Estimated Effort | Deadline |
|-------------|----------|------------------|----------|
| 1-2 blockers | Critical | 2-4 hours | 24 hours |
| 3-5 issues | High | 4-8 hours | 48 hours |
| 5-10 issues | Medium | 1-2 days | 72 hours |
| 10+ issues | Complex | 2-4 days | 5 days |

**Factors to Consider:**

```yaml
deadline_factors:
  issue_count: 8
  blocker_count: 2
  estimated_effort_hours: 6
  contractor_availability: "full-time"
  contractor_timezone: "UTC+5:30"
  original_story_deadline: "2025-12-01"
  current_date: "2025-11-30"
  business_days_remaining: 1
```

**Deadline Decision:**

```yaml
revision_deadline:
  due_date: "2025-12-02T17:00:00Z"
  due_date_local: "2025-12-02 22:30 IST"  # Contractor's timezone
  hours_from_now: 48
  reasoning: "6 hours estimated effort + buffer for questions"
  extends_story_deadline: true
  new_story_deadline: "2025-12-03"
```

**Output:** Revision deadline set

---

### Stage 5: Send Request

**Objective:** Send revision request via SMTP email.

**Revision Request Email:**

```markdown
Subject: [PROJECT] [STORY-123] 🔄 Revisions Requested - Implement user auth API

Hi Backend Developer,

Thank you for your submission on STORY-123. After review, we've identified some changes needed before we can merge.

---

## Summary

| Metric | Value |
|--------|-------|
| PR | #456 |
| Issues Found | 8 |
| Required Changes | 3 |
| Recommended Changes | 3 |
| Optional | 2 |
| Revision Deadline | Dec 2, 2025 (48 hours) |

---

## Required Changes (Must Fix Before Merge)

### 🚫 1. SQL Injection in user search [BLOCKER]

**Location:** `src/repository/UserRepository.java:45`

**Issue:**
Raw SQL query concatenates user input without sanitization. This is a critical security vulnerability.

**Current Code:**
```java
String query = "SELECT * FROM users WHERE name = '" + name + "'";
```

**Fix:**
```java
String query = "SELECT * FROM users WHERE name = ?";
jdbcTemplate.query(query, new Object[]{name}, rowMapper);
```

---

### 🚫 2. Refresh token not invalidated on logout [BLOCKER]

**Location:** `src/service/AuthService.java:89`

**Issue:**
Refresh tokens can be reused after logout, which is a security vulnerability.

**Fix:**
Add `refreshTokenRepository.invalidate(refreshToken);` in the logout method.

---

### ⚠️ 3. Missing error handling for expired tokens [MAJOR]

**Location:** `src/controller/AuthController.java:67`

**Issue:**
Returns 500 instead of 401 when token is expired.

**Fix:**
Catch `ExpiredTokenException` and return proper 401 response.

---

## Recommended Changes (Should Fix)

### 📝 4. Hardcoded token expiry value

**Location:** `src/config/JwtConfig.java:23`

Move to configuration file for flexibility.

### 📝 5. Missing test for token refresh edge case

Add test for refresh with invalid token.

### 📝 6. Error message could be more descriptive

Include guidance on next steps in error responses.

---

## Optional Improvements (Nice to Have)

### 💡 7. Consider extracting token validation to utility

Token validation is repeated in 3 places.

### 💡 8. Add request logging for debugging

Would help with troubleshooting auth issues.

---

## What's Working Well ✅

- Clean separation of concerns in controller layer
- Good test coverage for main scenarios
- Clear API documentation

---

## Next Steps

1. Address the 3 required changes (blockers + major)
2. Consider the recommended changes if time permits
3. Push updates to your branch
4. Reply with **SUBMITTED** when ready for re-review

**Deadline:** December 2, 2025 at 5:00 PM UTC (22:30 your local time)

Questions? Reply with **QUESTION - your question** and I'll clarify.

---

Best regards,
Project Coordinator

---
PR: https://github.com/org/repo/pull/456
Branch: story/STORY-123-implement-user-auth
Correlation ID: revision-STORY-123-iter2
Iteration: 2
```

**Send Email:**

```yaml
email:
  to: "backend@contractor.example"
  subject: "[PROJECT] [STORY-123] 🔄 Revisions Requested - Implement user auth API"
  template: "revision-request"
  variables:
    contractor_name: "Backend Developer"
    story_id: "STORY-123"
    story_title: "Implement user authentication API"
    pr_number: 456
    issues: "{issue_list}"
    deadline: "2025-12-02T17:00:00Z"
    iteration: 2
  correlation_id: "revision-STORY-123-iter2"
```

**Output:** Revision request email sent

---

### Stage 6: Update Systems

**Objective:** Update PR, story status, and tracking systems.

**Update PR on GitHub:**

```yaml
pr_update:
  action: "request_changes"
  pr_number: 456
  comment: |
    ## 🔄 Changes Requested

    Please address the following before merge:

    ### Required (3)
    - [ ] REV-001: Fix SQL injection in UserRepository.java:45
    - [ ] REV-002: Invalidate refresh token on logout
    - [ ] REV-003: Return 401 for expired tokens

    ### Recommended (3)
    - [ ] REV-004: Make token expiry configurable
    - [ ] REV-005: Add test for token refresh edge case
    - [ ] REV-006: Improve error messages

    See email for full details.

    **Deadline:** Dec 2, 2025
  labels:
    add: ["changes-requested", "iteration-2"]
    remove: ["needs-review"]
```

**Update Story Status:**

```yaml
story_update:
  story_id: "STORY-123"
  status: "revision_requested"
  revision_iteration: 2
  revision_deadline: "2025-12-02T17:00:00Z"
  issues_count: 8
  blockers_count: 2
```

**Update Module State:**

```yaml
state_update:
  revisions:
    - story_id: "STORY-123"
      contractor_id: "backend-001"
      pr_number: 456
      iteration: 2
      requested_at: "2025-11-30T10:30:00Z"
      deadline: "2025-12-02T17:00:00Z"
      issues:
        blockers: 2
        major: 1
        minor: 3
        suggestions: 2
      email_sent: true
      email_correlation_id: "revision-STORY-123-iter2"
      status: "awaiting_revision"
```

**Output:** All systems updated

---

## Events Published

**contractor.revision.requested:**
```yaml
story_id: "STORY-123"
contractor_id: "backend-001"
contractor_email: "backend@contractor.example"
pr_number: 456
iteration: 2
issues:
  blockers: 2
  major: 1
  minor: 3
  suggestions: 2
deadline: "2025-12-02T17:00:00Z"
email_correlation_id: "revision-STORY-123-iter2"
requested_at: "2025-11-30T10:30:00Z"
```

---

## Tracking Revisions

**Revision History:**

```yaml
revision_history:
  story_id: "STORY-123"
  iterations:
    - iteration: 1
      submitted_at: "2025-11-29T15:00:00Z"
      reviewed_at: "2025-11-30T10:00:00Z"
      issues_found: 8
      outcome: "revisions_requested"

    - iteration: 2
      submitted_at: null  # Awaiting
      deadline: "2025-12-02T17:00:00Z"
      expected_issues_resolved: 3  # Required only
```

**Max Iterations:**

```yaml
revision_policy:
  max_iterations: 3
  after_max_iterations: "escalate_to_coordinator"
  pattern_detection: true  # Track repeated issues
```

---

## Follow-Up Actions

**Auto-Reminder Schedule:**

```yaml
reminders:
  - trigger: "deadline - 24h"
    action: "send_reminder"
    template: "revision-reminder"

  - trigger: "deadline"
    action: "check_submission"
    if_not_submitted: "send_urgent_reminder"

  - trigger: "deadline + 24h"
    action: "escalate"
    template: "revision-overdue"
```

**Reminder Email:**

```
Subject: [PROJECT] [STORY-123] ⏰ Reminder: Revisions Due Tomorrow

Hi Backend Developer,

This is a reminder that revisions for STORY-123 are due tomorrow (Dec 2, 2025).

Required changes:
1. SQL injection fix (BLOCKER)
2. Refresh token invalidation (BLOCKER)
3. Token expiry error handling (MAJOR)

Reply with SUBMITTED when your changes are ready.

Questions? Reply with QUESTION.

Correlation ID: revision-STORY-123-iter2-reminder
```

---

## Tips for Effective Revision Requests

1. **Be exhaustive** - Include all issues in one email (async-first)
2. **Prioritize clearly** - Contractors should know what's mandatory
3. **Provide examples** - Show don't just tell
4. **Set realistic deadlines** - Account for complexity and timezone
5. **Acknowledge good work** - Include positive feedback too
6. **Track patterns** - Watch for recurring issues across submissions
