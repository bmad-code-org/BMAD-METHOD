# Adversarial Review Test Suite

Tests for the `also_consider` optional input in `review-adversarial-general.xml`.

## Purpose

Evaluate whether the `also_consider` input gently nudges the reviewer toward specific areas without overriding normal adversarial analysis.

## Test Content

All tests use `sample-content.md` - a deliberately imperfect User Authentication API doc with:

- Vague error handling section
- Missing rate limit details
- No token expiration info
- Password in plain text example
- Missing authentication headers
- No error response examples

## Running Tests

For each test case in `test-cases.yaml`, invoke the adversarial review task.

### Manual Test Invocation

```
Review this content using the adversarial review task:

<content>
[paste sample-content.md]
</content>

<also_consider>
[paste items from test case, or omit for TC01]
</also_consider>
```

## Evaluation Criteria

For each test, note:

1. **Total findings** - Still hitting ~10 issues?
2. **Distribution** - Are findings spread across concerns or clustered?
3. **Relevance** - Do findings relate to `also_consider` items when provided?
4. **Balance** - Are `also_consider` findings elevated over others, or naturally mixed?
5. **Quality** - Are findings actionable regardless of source?

## Expected Outcomes

- **TC01 (baseline)**: Generic spread of findings
- **TC02-TC05 (domain-focused)**: Some findings align with domain, others still organic
- **TC06 (single item)**: Light influence, not dominant
- **TC07 (vague items)**: Minimal change from baseline
- **TC08 (specific items)**: Direct answers if gaps exist
- **TC09 (mixed)**: Balanced across domains
- **TC10 (contradictory)**: Graceful handling
