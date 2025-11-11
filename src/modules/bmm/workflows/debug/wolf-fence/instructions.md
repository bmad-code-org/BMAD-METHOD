# wolf-fence-search

Binary search debugging to systematically isolate bug location.

## Context

This task implements the Wolf Fence algorithm (binary search debugging) to efficiently locate bugs by repeatedly dividing the search space in half. Named after the problem: "There's one wolf in Alaska; how do you find it? Build a fence down the middle, wait for the wolf to howl, determine which side it's on, and repeat."

## Task Execution

### Phase 1: Initial Analysis

1. Identify the boundaries of the problem space:
   - Entry point where system is working
   - Exit point where bug manifests
   - Code path between these points
2. Determine testable checkpoints
3. Calculate optimal division points

### Phase 2: Binary Search Implementation

#### Step 1: Divide Search Space

1. Identify midpoint of current search area
2. Insert diagnostic checkpoint at midpoint:
   - Add assertion to verify expected state
   - Add logging to capture actual state
   - Add breakpoint if interactive debugging available

#### Step 2: Test and Observe

1. Execute code up to checkpoint
2. Verify if bug has manifested:
   - State is correct → Bug is in second half
   - State is incorrect → Bug is in first half
   - Cannot determine → Need better checkpoint

#### Step 3: Narrow Focus

1. Select the half containing the bug
2. Repeat division process
3. Continue until bug location is isolated to:
   - Single function
   - Few lines of code
   - Specific data transformation

### Phase 3: Refinement

#### For Complex Bugs

1. **Multi-dimensional search**: When bug depends on multiple factors
   - Apply binary search on each dimension
   - Create test matrix for combinations

2. **Time-based search**: For timing/concurrency issues
   - Binary search on execution timeline
   - Add timestamps to narrow race conditions

3. **Data-based search**: For data-dependent bugs
   - Binary search on input size
   - Isolate problematic data patterns

### Phase 4: Bug Isolation

Once narrowed to small code section:

1. Analyze the isolated code thoroughly
2. Identify exact failure mechanism
3. Verify bug reproduction in isolation
4. Document minimal reproduction case

## Automated Implementation

### Checkpoint Generation Strategy

```markdown
1. Identify all function boundaries in path
2. Select optimal checkpoint locations:
   - Function entry/exit points
   - Loop boundaries
   - Conditional branches
   - Data transformations

3. Insert non-invasive checkpoints:
   - Use existing logging if available
   - Add temporary assertions
   - Leverage existing test infrastructure
```

### Search Optimization

- Start with coarse-grained divisions (module/class level)
- Progressively move to fine-grained (function/line level)
- Skip obviously correct sections based on static analysis
- Prioritize high-probability areas based on:
  - Recent changes
  - Historical bug density
  - Code complexity metrics

## Output Format

````markdown
# Wolf Fence Debug Analysis

## Search Summary

**Initial Scope:** [entry point] → [exit point]
**Final Location:** [specific file:line]
**Iterations Required:** [number]
**Time to Isolate:** [duration]

## Search Path

### Iteration 1

- **Search Space:** [full range]
- **Checkpoint:** [location]
- **Result:** Bug in [first/second] half
- **Evidence:** [what was observed]

### Iteration 2

- **Search Space:** [narrowed range]
- **Checkpoint:** [location]
- **Result:** Bug in [first/second] half
- **Evidence:** [what was observed]

[Continue for all iterations...]

## Bug Location

**File:** [path]
**Function:** [name]
**Lines:** [range]
**Description:** [what the bug is]

## Minimal Reproduction

```[language]
// Minimal code to reproduce
[code snippet]
```
````

## Root Cause

[Brief explanation of why bug occurs]

## Recommended Fix

[Suggested solution]

## Verification Points

- [ ] Bug reproducible at isolated location
- [ ] Fix resolves issue at checkpoint
- [ ] No regression in other checkpoints

```

## Completion Criteria
- [ ] Search space properly bounded
- [ ] Binary search completed
- [ ] Bug location isolated
- [ ] Minimal reproduction created
- [ ] Root cause identified
- [ ] Fix recommendation provided
```
