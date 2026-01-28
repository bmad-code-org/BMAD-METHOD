# {{Module/Feature Area}} - Implementation Playbook

> **Purpose:** Guide future agents implementing features in {{module_name}}
> **Created:** {{date}}
> **Last Updated:** {{date}}

## Common Gotchas

**What mistakes to avoid:**

- Add specific gotchas here as they're discovered
- Example: "Never concatenate user input into SQL queries"
- Example: "Always validate file paths before operations"

## Code Patterns

**Standard approaches that work:**

### Pattern: {{Pattern Name}}

✓ **Good:**
```
// Example of correct pattern
db.query(sql, [param1, param2])
```

✗ **Bad:**
```
// Example of incorrect pattern
sql + userInput
```

### Pattern: {{Another Pattern}}

✓ **Good:**
```
// Another example
if (!data) return null;
```

✗ **Bad:**
```
// Don't do this
data.map(...)  // crashes if data is null
```

## Test Requirements

**Essential tests for this module:**

- **Happy path:** Verify primary functionality
- **Edge cases:** Test null, undefined, empty arrays, invalid inputs
- **Error conditions:** Verify errors are handled properly
- **Security:** Test for injection attacks, auth bypasses, etc.

### Example Test Pattern

```typescript
describe('FeatureName', () => {
  it('handles happy path', () => {
    expect(fn(validInput)).toEqual(expected)
  })

  it('handles edge cases', () => {
    expect(fn(null)).toThrow()
    expect(fn([])).toEqual([])
  })

  it('validates security', () => {
    expect(fn("' OR 1=1--")).toThrow()
  })
})
```

## Related Stories

Stories that used these patterns:

- {{story_key}} - {{brief description}}

## Notes

- Keep this simple and actionable
- Add new learnings as they emerge
- Focus on preventable mistakes
