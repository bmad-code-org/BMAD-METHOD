# Review Contractor Submission Workflow

## Overview

This workflow guides the review of a contractor's code submission. It combines code review, QA validation, and compliance checks to ensure quality before merging.

## Prerequisites

- Contractor has submitted work (SUBMITTED command or PR opened)
- PR exists and CI checks are passing
- Story context available

---

## Workflow Stages

### Stage 1: Identify Submission

**Objective:** Load all relevant information about the submission.

**Load Submission Details:**
```yaml
submission:
  story_id: "STORY-123"
  story_title: "Implement user authentication API"
  contractor_id: "backend-001"
  contractor_name: "Backend Developer"
  pr_number: 456
  pr_url: "https://github.com/org/repo/pull/456"
  branch: "story/STORY-123-implement-user-auth"
  submitted_at: "2025-11-29T15:00:00Z"
  iteration: 1  # First submission or revision?
```

**Load Story Context:**
- Original acceptance criteria
- Technical requirements
- Previous review feedback (if revision)

**Load PR Status:**
```
PR #456: story/STORY-123-implement-user-auth → develop

Status: Open
CI Checks: ✅ Passing
Commits: 5
Files Changed: 12
Additions: +450
Deletions: -20

Labels: contractor, needs-review
```

**Output:** Complete submission context

---

### Stage 2: Code Review

**Objective:** Review code quality, patterns, and implementation.

**Review Checklist:**

#### Functionality
- [ ] Implements all acceptance criteria
- [ ] Logic is correct and complete
- [ ] Edge cases handled appropriately
- [ ] Error handling is robust

#### Code Quality
- [ ] Follows project coding standards
- [ ] Clear, readable code
- [ ] Appropriate naming conventions
- [ ] No unnecessary complexity
- [ ] DRY principle followed

#### Architecture
- [ ] Follows project patterns
- [ ] Proper separation of concerns
- [ ] Appropriate abstractions
- [ ] No architecture violations

#### Performance
- [ ] Efficient algorithms
- [ ] No N+1 queries
- [ ] Appropriate caching
- [ ] Resource cleanup

#### Documentation
- [ ] Code comments where needed
- [ ] API documentation updated
- [ ] README updated if needed

**Review Comments Format:**
```markdown
### File: src/auth/AuthService.java

**Line 45-52: [BLOCKER]**
Missing input validation on email parameter. This could allow injection.

Suggestion:
```java
if (!EmailValidator.isValid(email)) {
    throw new ValidationException("Invalid email format");
}
```

**Line 78: [SUGGESTION]**
Consider extracting this logic to a separate method for reusability.
```

**Code Review Summary:**
| Category | Status | Issues |
|----------|--------|--------|
| Functionality | ✅/⚠️/❌ | Count |
| Code Quality | ✅/⚠️/❌ | Count |
| Architecture | ✅/⚠️/❌ | Count |
| Performance | ✅/⚠️/❌ | Count |
| Documentation | ✅/⚠️/❌ | Count |

---

### Stage 3: QA Review

**Objective:** Verify test coverage and acceptance criteria.

**Test Coverage Analysis:**
```
Coverage Report:
- Overall: 85%
- New Code: 92%
- Critical Paths: 100%

Test Types:
- Unit Tests: 24 added
- Integration Tests: 5 added
- E2E Tests: 0 (not required)
```

**Acceptance Criteria Validation:**

| # | Criterion | Test Coverage | Manual Verified |
|---|-----------|---------------|-----------------|
| 1 | POST /auth/login returns JWT token | ✅ Unit + Integration | ✅ |
| 2 | POST /auth/logout invalidates token | ✅ Unit | ✅ |
| 3 | POST /auth/refresh extends token | ✅ Unit + Integration | ✅ |
| 4 | 95% test coverage | ✅ 92% new code | - |

**Exploratory Testing Results:**
- Tested happy path: ✅
- Tested invalid inputs: ✅
- Tested edge cases: ✅
- Tested error scenarios: ✅

**Issues Found:**
```markdown
### QA-001: [MINOR]
Token expiry message could be more descriptive.
Currently: "Token expired"
Suggested: "Token expired. Please login again."

### QA-002: [BLOCKER]
Refresh token can be reused after logout.
Steps: Login → Logout → Use old refresh token → Still works
Expected: Should return 401
```

---

### Stage 4: Compliance Check

**Objective:** Verify security and compliance requirements.

**Security Checklist:**

#### Input Validation
- [ ] All user inputs validated
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No command injection

#### Authentication/Authorization
- [ ] Proper authentication checks
- [ ] Authorization verified
- [ ] Tokens handled securely
- [ ] Secrets not hardcoded

#### Data Protection
- [ ] Sensitive data encrypted
- [ ] PII handled correctly
- [ ] Logging doesn't expose secrets
- [ ] Error messages don't leak info

#### Dependencies
- [ ] No vulnerable dependencies
- [ ] Dependencies are necessary
- [ ] Licenses are compatible

**Security Scan Results:**
```
Static Analysis: 0 high, 2 medium, 5 low
Dependency Scan: 0 vulnerabilities
Secret Scan: No secrets detected
```

**Compliance Notes:**
- GDPR: ✅ User data handled per requirements
- SOC2: ✅ Audit logging in place

---

### Stage 5: Make Decision

**Objective:** Decide on submission outcome.

**Decision Matrix:**

| Condition | Decision |
|-----------|----------|
| All checks pass, no blockers | **APPROVE** |
| Minor issues only | **APPROVE WITH COMMENTS** |
| Blocker issues exist | **REQUEST REVISIONS** |
| Fundamental problems | **REJECT** |

**Issue Classification:**

| Type | Count | Action Required |
|------|-------|-----------------|
| Blocker | 0 | Must fix before merge |
| Major | 0 | Should fix before merge |
| Minor | 2 | Nice to fix, not required |
| Suggestion | 3 | Optional improvements |

**Decision Options:**

#### APPROVE
- All acceptance criteria met
- Code quality acceptable
- Tests adequate
- No security issues
- **Action:** Merge PR, send approval email

#### APPROVE WITH COMMENTS
- Minor issues noted but not blocking
- **Action:** Merge PR, send approval with feedback

#### REQUEST REVISIONS
- Blocker or major issues exist
- **Action:** Request changes on PR, send revision email

#### REJECT
- Fundamentally wrong approach
- Would require complete rewrite
- **Action:** Close PR, send rejection with explanation

**Your Decision:** [APPROVE / APPROVE WITH COMMENTS / REQUEST REVISIONS / REJECT]

---

### Stage 6: Communicate Result

**Objective:** Inform contractor and update systems.

**If APPROVED:**

1. **Approve PR on GitHub**
2. **Merge PR** (if auto-merge enabled) or mark ready
3. **Send approval email:**
   ```
   Subject: [PROJECT] [STORY-123] ✅ Approved - Implement user auth API

   Congratulations! Your submission has been approved and merged.

   Feedback: [any comments]

   Metrics:
   - Cycle Time: 3 days
   - Review Iterations: 1
   ```
4. **Update story status:** Complete
5. **Publish event:** `contractor.submission.approved`
6. **Check for next assignment**

**If REQUEST REVISIONS:**

1. **Request changes on PR**
2. **Add review comments** to specific lines
3. **Send revision email:**
   ```
   Subject: [PROJECT] [STORY-123] Revisions Requested - Implement user auth API

   Your submission needs the following changes:

   Required Changes:
   1. [Blocker issue description]
   2. [Major issue description]

   Optional Suggestions:
   - [Minor improvement]

   Deadline: [Date]
   ```
4. **Update submission state:** Revision requested
5. **Publish event:** `contractor.revision.requested`

**If REJECTED:**

1. **Close PR** without merging
2. **Send rejection email:**
   ```
   Subject: [PROJECT] [STORY-123] ❌ Submission Rejected - Implement user auth API

   Unfortunately, this submission cannot be accepted because:
   [Detailed explanation]

   Next steps:
   [Guidance on how to proceed]
   ```
3. **Update story status:** Needs rework
4. **Publish event:** `contractor.submission.rejected`
5. **Consider reassignment if pattern continues**

---

## Review Templates

### Approval Comment (GitHub PR)
```markdown
## ✅ Approved

Great work on this implementation!

### Summary
- All acceptance criteria met
- Test coverage: 92%
- Code quality: Good
- Security: No issues

### Minor Suggestions (optional)
- Consider adding more descriptive error messages
- Token refresh logic could be extracted to utility

Merging now. Thanks for the quality work!
```

### Revision Request Comment (GitHub PR)
```markdown
## 🔄 Changes Requested

Good progress, but some issues need addressing before merge.

### Required Changes

#### 1. Security: Refresh Token Reuse (Blocker)
**Location:** `AuthService.java:89`

Refresh tokens can be reused after logout. This is a security vulnerability.

**Fix:** Invalidate refresh token on logout.

```java
public void logout(String refreshToken) {
    refreshTokenRepository.invalidate(refreshToken);  // Add this
    // ... existing code
}
```

### Optional Improvements
- More descriptive error messages

Please address the required changes and reply with SUBMITTED when ready.
```

---

## Events Published

**contractor.submission.approved:**
```yaml
story_id: "STORY-123"
contractor_id: "backend-001"
pr_number: 456
reviewer: "coordinator"
feedback: "Great implementation..."
approved_at: "2025-11-30T10:00:00Z"
merged: true
cycle_time_hours: 72
```

**contractor.revision.requested:**
```yaml
story_id: "STORY-123"
contractor_id: "backend-001"
pr_number: 456
required_changes:
  - title: "Security: Refresh Token Reuse"
    description: "..."
    severity: "blocker"
optional_suggestions:
  - "More descriptive error messages"
revision_deadline: "2025-12-02T17:00:00Z"
iteration_number: 2
```

---

## Tips for Effective Reviews

1. **Be specific** - Point to exact lines and provide examples
2. **Explain why** - Help contractor learn, not just fix
3. **Prioritize** - Clearly distinguish blockers from nice-to-haves
4. **Be timely** - Review within SLA (24 hours)
5. **Be constructive** - Focus on code, not person
6. **Acknowledge good work** - Positive feedback matters
