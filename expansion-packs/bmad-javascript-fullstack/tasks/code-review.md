# <!-- Powered by BMAD™ Core -->

# Code Review Task

## Purpose
Systematic code review process for JavaScript/TypeScript pull requests to maintain code quality and catch issues before production.

## When to Use
- Before merging any pull request
- After completing a feature or story
- Regular code quality audits

## Code Review Checklist

### 1. Functional Correctness
- [ ] **Implements Requirements** - All acceptance criteria met
- [ ] **No Regressions** - Existing functionality still works
- [ ] **Edge Cases** - Handles edge cases and errors
- [ ] **User Experience** - UX is intuitive and polished

### 2. Code Quality
- [ ] **Readable** - Code is self-documenting
- [ ] **No Duplication** - DRY principle followed
- [ ] **Single Responsibility** - Functions/components have single purpose
- [ ] **Appropriate Complexity** - Not over-engineered or under-engineered
- [ ] **Naming** - Variables, functions, components well-named

### 3. TypeScript Quality
- [ ] **No `any` Types** - Proper types used everywhere
- [ ] **Type Safety** - No type assertions unless necessary
- [ ] **Interfaces** - Props and DTOs properly typed
- [ ] **Generics** - Generic types used appropriately
- [ ] **No TypeScript Errors** - `tsc --noEmit` passes

### 4. React Best Practices (if applicable)
- [ ] **Hooks Rules** - Hooks used correctly
- [ ] **Dependencies** - useEffect dependencies complete
- [ ] **Memoization** - useMemo/useCallback where needed
- [ ] **Component Size** - Components are reasonably sized
- [ ] **No Inline Functions** - Callbacks memoized in render-heavy components

### 5. Backend Best Practices (if applicable)
- [ ] **Input Validation** - All inputs validated
- [ ] **Error Handling** - Errors handled gracefully
- [ ] **Authentication** - Auth checks on protected routes
- [ ] **SQL Injection** - Parameterized queries used
- [ ] **Logging** - Important actions logged

### 6. Testing
- [ ] **Tests Written** - New code has tests
- [ ] **Tests Pass** - All tests green
- [ ] **Coverage** - Meets coverage goals
- [ ] **Test Quality** - Tests are meaningful, not just for coverage
- [ ] **Edge Cases Tested** - Error paths tested

### 7. Security
- [ ] **No Secrets** - No hardcoded secrets
- [ ] **Input Sanitized** - User inputs validated and sanitized
- [ ] **Authorization** - Proper permission checks
- [ ] **Dependencies** - No vulnerable dependencies

### 8. Performance
- [ ] **No Performance Regressions** - Page load times acceptable
- [ ] **Database Queries** - Queries optimized
- [ ] **Bundle Size** - No unnecessary dependencies added
- [ ] **Images** - Images optimized

### 9. Documentation
- [ ] **Code Comments** - Complex logic commented
- [ ] **README** - Updated if needed
- [ ] **API Docs** - API documentation updated
- [ ] **Changelog** - Changes documented

### 10. Git Hygiene
- [ ] **Commit Messages** - Clear, descriptive commits
- [ ] **No Merge Conflicts** - Conflicts resolved
- [ ] **Branch Up-to-date** - Merged latest main
- [ ] **PR Description** - Clear description with context

## Review Process

### As Reviewer
1. **Understand Context** - Read PR description and linked issues
2. **Check CI** - Verify CI passes
3. **Review Code** - Go through changes systematically
4. **Test Locally** - Pull branch and test if needed
5. **Provide Feedback** - Be constructive and specific
6. **Approve or Request Changes**

### Providing Feedback
- **Be Specific** - "Consider extracting this into a helper" not "needs refactoring"
- **Explain Why** - "This could cause a memory leak because..."
- **Suggest Solutions** - Provide code examples when possible
- **Be Kind** - Assume positive intent, critique code not person
- **Differentiate** - Mark comments as "blocking" vs "nit" vs "question"

### As Author
1. **Respond to All Comments** - Address or discuss each comment
2. **Make Changes** - Fix blocking issues
3. **Re-request Review** - After making changes
4. **Merge** - Only after approval

## Common Issues to Watch For

### JavaScript/TypeScript
- Using `var` instead of `const/let`
- Not handling promises properly
- Ignoring TypeScript errors with `@ts-ignore`
- Using `any` instead of proper types
- Not validating inputs

### React
- Missing keys in lists
- Incorrect useEffect dependencies
- Large components (>300 lines)
- Inline function definitions in JSX
- Not handling loading/error states

### Backend
- Not validating request bodies
- Missing error handling
- SQL injection vulnerabilities
- Missing authorization checks
- Not logging errors

### General
- Hardcoded values instead of configuration
- No tests for new code
- Breaking changes without migration
- Poor naming
- Duplicated code

## Tools
- GitHub/GitLab PR interface
- VS Code with ESLint extension
- React DevTools for frontend
- Postman/Insomnia for API testing

## Quality Gates
- [ ] All review comments addressed
- [ ] CI passing
- [ ] At least one approval
- [ ] No merge conflicts
- [ ] Up to date with main branch