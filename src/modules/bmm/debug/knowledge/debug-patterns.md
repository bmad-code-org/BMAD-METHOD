# debug-patterns

Common defect patterns and debugging strategies.

## Common Defect Patterns

### 1. Null/Undefined Reference Errors

**Pattern:** Accessing properties or methods on null/undefined objects
**Indicators:**

- TypeError: Cannot read property 'X' of undefined
- NullPointerException
- Segmentation fault

**Common Causes:**

- Missing null checks
- Asynchronous data not yet loaded
- Optional dependencies not injected
- Incorrect initialization order

**Detection Strategy:**

- Add defensive null checks
- Use optional chaining (?.)
- Initialize with safe defaults
- Validate inputs at boundaries

### 2. Race Conditions

**Pattern:** Multiple threads/processes accessing shared resources
**Indicators:**

- Intermittent failures
- Works in debug but fails in production
- Order-dependent behavior
- Data corruption

**Common Causes:**

- Missing synchronization
- Incorrect lock ordering
- Shared mutable state
- Async operations without proper await

**Detection Strategy:**

- Add logging with timestamps
- Use thread-safe data structures
- Implement proper locking mechanisms
- Review async/await usage

### 3. Memory Leaks

**Pattern:** Memory usage grows over time without release
**Indicators:**

- Increasing memory consumption
- Out of memory errors
- Performance degradation over time
- GC pressure

**Common Causes:**

- Event listeners not removed
- Circular references
- Large objects in closures
- Cache without eviction

**Detection Strategy:**

- Profile memory usage
- Review object lifecycle
- Check event listener cleanup
- Implement cache limits

### 4. Off-by-One Errors

**Pattern:** Incorrect loop boundaries or array indexing
**Indicators:**

- ArrayIndexOutOfBounds
- Missing first/last element
- Infinite loops
- Fence post errors

**Common Causes:**

- Confusion between length and last index
- Inclusive vs exclusive ranges
- Loop condition errors
- Zero-based vs one-based indexing

**Detection Strategy:**

- Review loop conditions carefully
- Test boundary cases
- Use forEach/map when possible
- Add assertions for array bounds

### 5. Type Mismatches

**Pattern:** Incorrect data types passed or compared
**Indicators:**

- Type errors at runtime
- Unexpected coercion behavior
- Failed validations
- Serialization errors

**Common Causes:**

- Weak typing assumptions
- Missing type validation
- Incorrect type conversions
- API contract violations

**Detection Strategy:**

- Add runtime type checking
- Use TypeScript/type hints
- Validate at API boundaries
- Review type coercion rules

### 6. Resource Exhaustion

**Pattern:** Running out of system resources
**Indicators:**

- Too many open files
- Connection pool exhaustion
- Thread pool starvation
- Disk space errors

**Common Causes:**

- Resources not properly closed
- Missing connection pooling
- Unbounded growth
- Inadequate limits

**Detection Strategy:**

- Implement try-finally blocks
- Use connection pooling
- Set resource limits
- Monitor resource usage

### 7. Concurrency Deadlocks

**Pattern:** Threads waiting for each other indefinitely
**Indicators:**

- Application hangs
- Threads in BLOCKED state
- No progress being made
- Timeout errors

**Common Causes:**

- Circular wait conditions
- Lock ordering violations
- Nested synchronized blocks
- Resource starvation

**Detection Strategy:**

- Always acquire locks in same order
- Use lock-free data structures
- Implement timeout mechanisms
- Avoid nested locks

### 8. SQL Injection Vulnerabilities

**Pattern:** Unvalidated input in SQL queries
**Indicators:**

- Unexpected database errors
- Data breaches
- Malformed query errors
- Authorization bypasses

**Common Causes:**

- String concatenation for queries
- Missing input validation
- Inadequate escaping
- Dynamic query construction

**Detection Strategy:**

- Use parameterized queries
- Validate all inputs
- Review dynamic SQL
- Implement least privilege

### 9. Infinite Recursion

**Pattern:** Function calling itself without termination
**Indicators:**

- Stack overflow errors
- Maximum call stack exceeded
- Application crashes
- Memory exhaustion

**Common Causes:**

- Missing base case
- Incorrect termination condition
- Circular dependencies
- Mutual recursion errors

**Detection Strategy:**

- Review base cases
- Add recursion depth limits
- Test edge cases
- Use iteration when possible

### 10. Cache Invalidation Issues

**Pattern:** Stale data served from cache
**Indicators:**

- Outdated information displayed
- Inconsistent state
- Changes not reflected
- Data synchronization issues

**Common Causes:**

- Missing invalidation logic
- Incorrect cache keys
- Race conditions in updates
- TTL too long

**Detection Strategy:**

- Review invalidation triggers
- Implement cache versioning
- Use appropriate TTLs
- Add cache bypass for testing

## Anti-Patterns to Avoid

### 1. Shotgun Debugging

Making random changes hoping something works

### 2. Blame the Compiler

Assuming the problem is in the framework/language

### 3. Programming by Coincidence

Not understanding why a fix works

### 4. Copy-Paste Solutions

Using solutions without understanding them

### 5. Ignoring Warnings

Dismissing compiler/linter warnings

## Debugging Best Practices

### 1. Systematic Approach

- Reproduce consistently
- Isolate the problem
- Form hypotheses
- Test systematically

### 2. Use Scientific Method

- Observe symptoms
- Form hypothesis
- Design experiment
- Test and validate

### 3. Maintain Debug Log

- Document what you tried
- Record what worked/failed
- Note patterns observed
- Track time spent

### 4. Leverage Tools

- Debuggers
- Profilers
- Static analyzers
- Log aggregators

### 5. Collaborate

- Pair debugging
- Code reviews
- Knowledge sharing
- Post-mortems
