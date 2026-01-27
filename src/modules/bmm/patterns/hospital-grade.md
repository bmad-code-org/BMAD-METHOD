# Hospital-Grade Quality Standards

**Philosophy:** Quality >> Speed

This pattern ensures code meets production-grade standards regardless of story complexity.

## Core Principles

1. **Take time to do it right**
   - Don't rush implementations
   - Consider edge cases
   - Handle errors properly

2. **No shortcuts**
   - Don't skip error handling
   - Don't leave TODO comments
   - Don't use `any` types
   - Don't hardcode values

3. **Production-ready from day one**
   - All code deployable immediately
   - No "we'll fix it later"
   - No technical debt by design

## Quality Checklist

### Code Quality
- [ ] All functions have clear, single responsibility
- [ ] Error handling for all failure paths
- [ ] Input validation at system boundaries
- [ ] No magic numbers or hardcoded strings
- [ ] Type safety (no `any`, proper generics)

### Testing
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] Edge cases covered
- [ ] Error cases covered
- [ ] 90%+ coverage target

### Security
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization checks
- [ ] Input sanitization
- [ ] No secrets in code

### Performance
- [ ] No N+1 query patterns
- [ ] Appropriate database indexes
- [ ] Efficient algorithms (avoid O(n²) where possible)
- [ ] Resource cleanup (connections, files)

### Maintainability
- [ ] Code follows project patterns
- [ ] Self-documenting code (clear names)
- [ ] Comments only where logic isn't obvious
- [ ] Consistent formatting
- [ ] DRY (Don't Repeat Yourself)

## Red Flags

**Immediate rejection criteria:**
- ❌ Security vulnerabilities
- ❌ Data loss scenarios
- ❌ Production bugs
- ❌ Missing error handling
- ❌ Skipped tests
- ❌ Hardcoded secrets

## Hospital-Grade Mindset

> "If this code ran a medical device, would I trust it with my family's life?"

If the answer is no, it's not hospital-grade. Fix it.
