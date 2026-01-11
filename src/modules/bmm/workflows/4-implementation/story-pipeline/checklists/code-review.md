# Code Review Checklist

Use this checklist for ADVERSARIAL code review in Step 6.
Your job is to FIND PROBLEMS (minimum 3, maximum 10).

## Adversarial Mindset

**CRITICAL RULES:**
- **NEVER** say "looks good" or "no issues found"
- **MUST** find 3-10 specific issues
- **FIX** every issue you find
- **RUN** tests after fixes

## Review Categories

### 1. Security Review

#### SQL Injection
- [ ] No raw SQL with user input
- [ ] Using parameterized queries
- [ ] Supabase RPC uses proper types

#### XSS (Cross-Site Scripting)
- [ ] User content is escaped
- [ ] dangerouslySetInnerHTML not used (or sanitized)
- [ ] URL parameters validated

#### Authentication & Authorization
- [ ] Protected routes check auth
- [ ] RLS policies on all tables
- [ ] No auth bypass possible
- [ ] Session handling secure

#### Credential Exposure
- [ ] No secrets in code
- [ ] No API keys committed
- [ ] Environment variables used
- [ ] .env files in .gitignore

#### Input Validation
- [ ] All inputs validated
- [ ] Types checked
- [ ] Lengths limited
- [ ] Format validation (email, URL, etc.)

### 2. Performance Review

#### Database
- [ ] No N+1 query patterns
- [ ] Indexes exist for query patterns
- [ ] Queries are efficient
- [ ] Proper pagination

#### React/Next.js
- [ ] No unnecessary re-renders
- [ ] Proper memoization where needed
- [ ] Server components used appropriately
- [ ] Client components minimized

#### Caching
- [ ] Cache headers appropriate
- [ ] Static data cached
- [ ] Revalidation strategy clear

#### Bundle Size
- [ ] No unnecessary imports
- [ ] Dynamic imports for large components
- [ ] Tree shaking working

### 3. Error Handling Review

#### Result Type
- [ ] All server actions use Result type
- [ ] No thrown exceptions
- [ ] Proper err() calls with codes

#### Error Messages
- [ ] User-friendly messages
- [ ] Technical details logged (not shown)
- [ ] Actionable guidance

#### Edge Cases
- [ ] Null/undefined handled
- [ ] Empty states handled
- [ ] Network errors handled
- [ ] Concurrent access considered

### 4. Test Coverage Review

#### Coverage
- [ ] All AC have tests
- [ ] Edge cases tested
- [ ] Error paths tested
- [ ] Happy paths tested

#### Quality
- [ ] Tests are deterministic
- [ ] No flaky tests
- [ ] Mocking is appropriate
- [ ] Assertions are meaningful

#### Missing Tests
- [ ] Security scenarios
- [ ] Permission denied cases
- [ ] Invalid input handling
- [ ] Concurrent operations

### 5. Code Quality Review

#### DRY (Don't Repeat Yourself)
- [ ] No duplicate code
- [ ] Common patterns extracted
- [ ] Utilities reused

#### SOLID Principles
- [ ] Single responsibility
- [ ] Open for extension
- [ ] Proper abstractions
- [ ] Dependency injection where appropriate

#### TypeScript
- [ ] Strict mode compliant
- [ ] No `any` types
- [ ] Proper type definitions
- [ ] Generic types used appropriately

#### Readability
- [ ] Clear naming
- [ ] Appropriate comments (not excessive)
- [ ] Logical organization
- [ ] Consistent style

### 6. Architecture Review

#### Module Boundaries
- [ ] Imports from index.ts only
- [ ] No circular dependencies
- [ ] Clear module responsibilities

#### Server/Client Separation
- [ ] "use server" on actions
- [ ] "use client" only when needed
- [ ] No server code in client

#### Data Flow
- [ ] Clear data ownership
- [ ] State management appropriate
- [ ] Props drilling minimized

## Issue Documentation

For each issue found:

```yaml
issue_{n}:
  severity: critical|high|medium|low
  category: security|performance|error-handling|testing|quality|architecture
  file: "{file_path}"
  line: {line_number}
  problem: |
    Clear description
  risk: |
    What could go wrong
  fix: |
    How to fix it
```

## After Fixing

- [ ] All issues fixed
- [ ] Tests still pass
- [ ] Lint clean
- [ ] Build succeeds
- [ ] Review report created

## Quality Gate

Review passes when:
- [ ] 3-10 issues found
- [ ] All issues fixed
- [ ] All categories reviewed
- [ ] Tests passing
- [ ] Review report complete
