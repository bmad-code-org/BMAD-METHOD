# assertion-analysis

Analyze code for missing assertions and defensive programming opportunities.

## Context

This task systematically identifies locations where assertions, preconditions, postconditions, and invariants should be added to catch bugs early and make code self-documenting. Assertions act as executable documentation and early warning systems for violations of expected behavior.

## Task Execution

### Phase 1: Code Analysis

#### Identify Assertion Candidates

**Function Boundaries:**

1. **Preconditions** (Entry assertions):
   - Parameter validation (null, range, type)
   - Required state before execution
   - Resource availability
   - Permission/authorization checks

2. **Postconditions** (Exit assertions):
   - Return value constraints
   - State changes completed
   - Side effects occurred
   - Resources properly managed

3. **Invariants** (Always true):
   - Class/object state consistency
   - Data structure integrity
   - Relationship maintenance
   - Business rule enforcement

**Critical Code Sections:**

- Before/after state mutations
- Around external system calls
- At algorithm checkpoints
- After complex calculations
- Before resource usage

### Phase 2: Assertion Category Analysis

#### Type 1: Safety Assertions

Prevent dangerous operations:

```
- Null/undefined checks before dereference
- Array bounds before access
- Division by zero prevention
- Type safety before operations
- Resource availability before use
```

#### Type 2: Correctness Assertions

Verify algorithmic correctness:

```
- Loop invariants maintained
- Sorted order preserved
- Tree balance maintained
- Graph properties held
- Mathematical properties true
```

#### Type 3: Contract Assertions

Enforce API contracts:

```
- Method preconditions met
- Return values valid
- State transitions legal
- Callbacks invoked correctly
- Events fired appropriately
```

#### Type 4: Security Assertions

Validate security constraints:

```
- Input sanitization complete
- Authorization verified
- Rate limits enforced
- Encryption applied
- Audit trail updated
```

### Phase 3: Automated Detection

#### Static Analysis Patterns

**Missing Null Checks:**

1. Identify all dereferences (obj.prop, obj->member)
2. Trace back to find validation
3. Flag unvalidated accesses

**Missing Range Checks:**

1. Find array/collection accesses
2. Identify index sources
3. Verify bounds checking exists

**Missing State Validation:**

1. Identify state-dependent operations
2. Check for state verification
3. Flag unverified state usage

**Missing Return Validation:**

1. Find function calls that can fail
2. Check if return values are validated
3. Flag unchecked returns

### Phase 4: Assertion Generation

#### Generate Appropriate Assertions

**For Different Languages:**

**JavaScript/TypeScript:**

```javascript
console.assert(condition, 'message');
if (!condition) throw new Error('message');
```

**Python:**

```python
assert condition, "message"
if not condition: raise AssertionError("message")
```

**Java:**

```java
assert condition : "message";
if (!condition) throw new AssertionError("message");
```

**C/C++:**

```c
assert(condition);
if (!condition) { /* handle error */ }
```

#### Assertion Templates

**Null/Undefined Check:**

```
assert(param != null, "Parameter 'param' cannot be null");
```

**Range Check:**

```
assert(index >= 0 && index < array.length,
       `Index ${index} out of bounds [0, ${array.length})`);
```

**State Check:**

```
assert(this.isInitialized, "Object must be initialized before use");
```

**Type Check:**

```
assert(typeof value === 'number', `Expected number, got ${typeof value}`);
```

**Invariant Check:**

```
assert(this.checkInvariant(), "Class invariant violated");
```

## Output Format

````markdown
# Assertion Analysis Report

## Summary

**Files Analyzed:** [count]
**Current Assertions:** [count]
**Recommended Additions:** [count]
**Critical Missing:** [count]
**Coverage Improvement:** [before]% → [after]%

## Critical Assertions Needed

### Priority 1: Safety Critical

Location: [file:line]

```[language]
// Current code
[code without assertion]

// Recommended addition
[assertion to add]
[protected code]
```
````

**Reason:** [Why this assertion is critical]
**Risk Without:** [What could go wrong]

### Priority 2: Correctness Verification

[Similar format for each recommendation]

### Priority 3: Contract Enforcement

[Similar format for each recommendation]

## Assertion Coverage by Component

| Component  | Current | Recommended | Priority       |
| ---------- | ------- | ----------- | -------------- |
| [Module A] | [count] | [count]     | [High/Med/Low] |
| [Module B] | [count] | [count]     | [High/Med/Low] |

## Detailed Recommendations

### File: [path/to/file]

#### Function: [functionName]

**Missing Preconditions:**

```[language]
// Add at function entry:
assert(param1 != null, "param1 required");
assert(param2 > 0, "param2 must be positive");
```

**Missing Postconditions:**

```[language]
// Add before return:
assert(result.isValid(), "Result must be valid");
```

**Missing Invariants:**

```[language]
// Add after state changes:
assert(this.items.length <= this.maxSize, "Size limit exceeded");
```

## Implementation Strategy

### Phase 1: Critical Safety (Immediate)

1. Add null checks for all pointer dereferences
2. Add bounds checks for array accesses
3. Add division by zero prevention

### Phase 2: Correctness (This Sprint)

1. Add algorithm invariants
2. Add state validation
3. Add return value checks

### Phase 3: Comprehensive (Next Sprint)

1. Add contract assertions
2. Add security validations
3. Add performance assertions

## Configuration Recommendations

### Development Mode

```[language]
// Enable all assertions
ASSERT_LEVEL = "all"
ASSERT_THROW = true
ASSERT_LOG = true
```

### Production Mode

```[language]
// Keep only critical assertions
ASSERT_LEVEL = "critical"
ASSERT_THROW = false
ASSERT_LOG = true
```

## Benefits Analysis

### Bug Prevention

- Catch [X]% more bugs in development
- Reduce production incidents by [Y]%
- Decrease debugging time by [Z]%

### Documentation Value

- Self-documenting code contracts
- Clear API expectations
- Explicit invariants

### Testing Support

- Faster test failure identification
- Better test coverage visibility
- Clearer failure messages

```

## Completion Criteria
- [ ] Code analysis completed
- [ ] Assertion candidates identified
- [ ] Priority levels assigned
- [ ] Assertions generated with proper messages
- [ ] Implementation plan created
- [ ] Configuration strategy defined
- [ ] Benefits quantified
```
