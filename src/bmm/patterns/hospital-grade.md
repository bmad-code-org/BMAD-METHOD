# Hospital-Grade Code Standards

<overview>
This code may be deployed in healthcare, financial, or safety-critical contexts where failures have serious consequences. Every line of code must meet hospital-grade reliability standards.

**Principle:** Quality >> Speed. Take 5 hours to do it right, not 1 hour to do it poorly.
</overview>

<mindset>
## Think Like a Hospital Engineer

Before writing any code, ask:
- What happens if this fails at 3 AM?
- What happens if input is malformed?
- What happens if a dependency is unavailable?
- What happens if this runs with 10x expected load?
- Would I trust this code with patient data?

If you can't answer confidently, add safeguards.
</mindset>

<required_practices>
## Non-Negotiable Practices

**Error Handling:**
- Every external call wrapped in try/catch
- Meaningful error messages (not just "Error occurred")
- Graceful degradation when possible
- Errors logged with context (user, action, timestamp)

**Input Validation:**
- Never trust user input
- Validate at system boundaries
- Use schema validation (zod, joi, etc.)
- Sanitize before database operations

**Type Safety:**
- No `any` types (TypeScript)
- Explicit return types on functions
- Null checks before property access
- Union types for known variants

**Authentication/Authorization:**
- Every endpoint checks auth
- Every data access checks ownership
- No security through obscurity
- Principle of least privilege
</required_practices>

<forbidden>
## Forbidden Patterns

**Never do these:**
```typescript
// BAD: Swallowed errors
try { doThing() } catch (e) { }

// BAD: any type
function process(data: any) { }

// BAD: No null check
const name = user.profile.name

// BAD: String concatenation in queries
const query = `SELECT * FROM users WHERE id = '${id}'`

// BAD: Hardcoded secrets
const apiKey = "sk_live_abc123"

// BAD: TODO comments left in production
// TODO: implement validation

// BAD: Console.log debugging
console.log("got here")
```
</forbidden>

<quality_gates>
## Quality Gates (All Must Pass)

Before code is considered complete:

```bash
# Type check - zero errors
npm run type-check

# Lint - zero errors, zero warnings
npm run lint

# Tests - all passing
npm test

# Build - succeeds
npm run build
```

If any gate fails, code is not done.
</quality_gates>

<verification>
## Verification Checklist

- [ ] All error paths handled
- [ ] Input validated at boundaries
- [ ] No `any` types
- [ ] No hardcoded secrets
- [ ] No TODO/FIXME in production code
- [ ] Tests cover happy path AND error paths
- [ ] Auth checks on all protected routes
- [ ] Logging for debugging without exposing PII
</verification>
