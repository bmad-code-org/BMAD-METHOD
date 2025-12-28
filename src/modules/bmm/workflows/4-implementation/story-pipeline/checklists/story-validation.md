# Story Validation Checklist

Use this checklist for ADVERSARIAL validation in Step 3.
Your job is to FIND PROBLEMS, not approve.

## Adversarial Mindset

Remember:
- **NEVER** say "looks good" without deep analysis
- **FIND** at least 3 issues (if none found, look harder)
- **QUESTION** every assumption
- **CHALLENGE** every AC

## AC Structure Validation

For EACH acceptance criterion:

### Given Clause
- [ ] Is a valid precondition (not an action)
- [ ] Can be set up programmatically
- [ ] Is specific (not "given the user is logged in" - which user?)
- [ ] Includes all necessary context

### When Clause
- [ ] Is a single, clear action
- [ ] Is something the user does (not the system)
- [ ] Can be triggered in a test
- [ ] Doesn't contain "and" (multiple actions)

### Then Clause
- [ ] Is measurable/observable
- [ ] Can be asserted in a test
- [ ] Describes outcome, not implementation
- [ ] Is specific (not "appropriate message shown")

## Testability Check

- [ ] Can write automated test from AC as written
- [ ] Clear what to assert
- [ ] No subjective criteria ("looks good", "works well")
- [ ] No timing dependencies ("quickly", "eventually")

## Technical Feasibility

Cross-reference with architecture.md:

- [ ] Data model supports requirements
- [ ] API patterns can accommodate
- [ ] No conflicts with existing features
- [ ] Security model (RLS) can support
- [ ] Performance is achievable

## Edge Cases Analysis

For each AC, consider:

- [ ] Empty/null inputs
- [ ] Maximum length/size
- [ ] Minimum values
- [ ] Concurrent access
- [ ] Network failures
- [ ] Permission denied
- [ ] Invalid data formats

## Common Problems to Find

### Vague Language
Look for and flag:
- "appropriate"
- "reasonable"
- "correctly"
- "properly"
- "as expected"
- "etc."
- "and so on"

### Missing Details
- [ ] Which user role?
- [ ] What error message exactly?
- [ ] What happens on failure?
- [ ] What are the limits?
- [ ] What validations apply?

### Hidden Complexity
- [ ] Multi-step process hidden in one AC
- [ ] Async operations not addressed
- [ ] State management unclear
- [ ] Error recovery not defined

## Validation Report Template

After review, document:

```yaml
issues_found:
  - id: 1
    severity: high|medium|low
    ac: "AC1"
    problem: "Description"
    fix: "How to fix"
```

## Quality Gate

Validation passes when:
- [ ] All AC reviewed against checklist
- [ ] All issues documented
- [ ] All issues fixed in story file
- [ ] Quality score >= 80
- [ ] Validation report appended
- [ ] ready_for_dev: true
