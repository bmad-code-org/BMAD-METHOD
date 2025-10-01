# <!-- Powered by BMAD™ Core -->

# Story Definition of Done Checklist

## Story Quality

### Requirements
- [ ] **Clear Description** - Story purpose is clear and specific
- [ ] **User Story Format** - As a [user], I want [action], so that [benefit]
- [ ] **Acceptance Criteria** - All AC clearly defined and testable
- [ ] **Technical Specs** - Implementation details provided
- [ ] **File List** - All files to create/modify listed
- [ ] **Dependencies** - All dependencies identified

### Implementation
- [ ] **Code Complete** - All code written and working
- [ ] **TypeScript** - No TypeScript errors
- [ ] **Linting** - No ESLint warnings/errors
- [ ] **Code Review** - Peer reviewed and approved
- [ ] **Refactoring** - No obvious tech debt introduced

### Testing
- [ ] **Unit Tests** - Tests written for new logic
- [ ] **Integration Tests** - API tests if backend changes
- [ ] **Component Tests** - React component tests if frontend
- [ ] **E2E Tests** - E2E test if critical user flow
- [ ] **Test Coverage** - Meets coverage requirements (>80%)
- [ ] **All Tests Pass** - Green CI build
- [ ] **Manual Testing** - Tested manually by developer

### Frontend Specific
- [ ] **Responsive** - Works on mobile, tablet, desktop
- [ ] **Accessibility** - Keyboard navigation, ARIA labels, screen reader
- [ ] **Loading States** - Loading indicators implemented
- [ ] **Error States** - Error messages user-friendly
- [ ] **Empty States** - Empty state handling
- [ ] **Performance** - No performance regressions

### Backend Specific
- [ ] **Input Validation** - All inputs validated
- [ ] **Error Handling** - Proper error responses
- [ ] **Logging** - Important actions logged
- [ ] **Authentication** - Auth checks if needed
- [ ] **Authorization** - Permission checks if needed
- [ ] **Database** - Migrations run, indexes added

### Security
- [ ] **Input Sanitized** - User inputs sanitized
- [ ] **SQL Injection** - Protected (parameterized queries)
- [ ] **XSS Prevention** - Output encoded
- [ ] **Authentication** - Protected routes checked
- [ ] **No Secrets** - No hardcoded secrets

### Documentation
- [ ] **Code Comments** - Complex logic commented
- [ ] **README Updated** - If new setup required
- [ ] **API Docs** - API documentation updated
- [ ] **Types Documented** - TypeScript interfaces documented

### Git & Deployment
- [ ] **Branch Up-to-date** - Merged latest main
- [ ] **Commits** - Meaningful commit messages
- [ ] **PR Description** - Clear PR description with context
- [ ] **No Merge Conflicts** - Conflicts resolved
- [ ] **CI Passing** - All CI checks green
- [ ] **Deployed to Staging** - Tested on staging environment

### Product/Business
- [ ] **Acceptance Criteria Met** - All AC satisfied
- [ ] **Product Owner Approved** - PO signed off
- [ ] **QA Tested** - QA tested and approved (if QA exists)
- [ ] **User Feedback** - Tested by end user if possible

## Definition of DONE

**Story Complete:** [ ] Yes [ ] No

**Verified By:** _________
**Date:** _________

**Notes:**
_Any additional context or issues encountered_