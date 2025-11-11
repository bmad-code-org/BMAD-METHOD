# delta-minimization

Automatically reduce failing test cases to minimal reproduction.

## Context

Delta debugging systematically minimizes failure-inducing inputs to find the smallest test case that still triggers a bug. This dramatically simplifies debugging by removing irrelevant complexity and isolating the essential trigger conditions.

## Task Execution

### Phase 1: Initial Setup

#### Capture Failing State

1. Record original failing test case:
   - Input data
   - Configuration settings
   - Environment state
   - Execution parameters
2. Verify bug reproduction
3. Measure initial complexity metrics:
   - Input size
   - Number of operations
   - Data structure depth
   - Configuration parameters

### Phase 2: Minimization Strategy

#### Select Minimization Approach

**For Data Inputs:**

1. **Binary reduction**: Remove half of input, test if still fails
2. **Line-by-line**: For text/config files
3. **Field elimination**: For structured data (JSON, XML)
4. **Value simplification**: Replace complex values with simple ones

**For Code/Test Cases:**

1. **Statement removal**: Delete non-essential lines
2. **Function inlining**: Replace calls with minimal implementations
3. **Loop unrolling**: Convert loops to minimal iterations
4. **Conditional simplification**: Remove unnecessary branches

**For Configuration:**

1. **Parameter elimination**: Remove non-essential settings
2. **Default substitution**: Replace with default values
3. **Range reduction**: Minimize numeric ranges

### Phase 3: Delta Algorithm Implementation

#### Core Algorithm

```
1. Start with failing test case T
2. While reduction is possible:
   a. Generate smaller candidate C from T
   b. Test if C still triggers bug
   c. If yes: T = C (accept reduction)
   d. If no: Try different reduction
3. Return minimal T
```

#### Automated Reduction Process

**Step 1: Coarse-Grained Reduction**

1. Try removing large chunks (50%)
2. Binary search for largest removable section
3. Continue until no large removals possible

**Step 2: Fine-Grained Reduction**

1. Try removing individual elements
2. Test each element for necessity
3. Build minimal required set

**Step 3: Simplification Pass**

1. Replace complex values with simpler equivalents:
   - Long strings → "a"
   - Large numbers → 0 or 1
   - Complex objects → empty objects
2. Maintain bug reproduction

### Phase 4: Validation

#### Verify Minimality

1. Confirm bug still reproduces
2. Verify no further reduction possible
3. Test that adding any removed element doesn't affect bug
4. Document reduction ratio achieved

#### Create Clean Reproduction

1. Format minimal test case
2. Remove all comments/documentation
3. Standardize naming (var1, var2, etc.)
4. Ensure standalone execution

## Intelligent Reduction Strategies

### Pattern-Based Reduction

Recognize common patterns and apply targeted reductions:

- **Array operations**: Reduce to 2-3 elements
- **Nested structures**: Flatten where possible
- **Async operations**: Convert to synchronous
- **External dependencies**: Mock with minimal stubs

### Semantic-Aware Reduction

Maintain semantic validity while reducing:

- Preserve type constraints
- Maintain referential integrity
- Keep required relationships
- Honor invariants

### Parallel Exploration

Test multiple reduction paths simultaneously:

- Try different reduction strategies
- Explore various simplification orders
- Combine successful reductions

## Output Format

````markdown
# Delta Debugging Minimization Report

## Original Test Case

**Size:** [original size/complexity]
**Components:** [number of elements/lines/fields]
**Execution Time:** [duration]

```[format]
[original test case - abbreviated if too long]
```
````

## Minimization Process

**Iterations:** [number]
**Time Taken:** [duration]
**Reduction Achieved:** [percentage]

### Reduction Path

1. [First major reduction] - Removed [what], Size: [new size]
2. [Second reduction] - Simplified [what], Size: [new size]
3. [Continue for significant reductions...]

## Minimal Reproduction

### Test Case

```[language]
// Minimal test case that reproduces bug
[minimized code/data]
```

### Requirements

- **Environment:** [minimal environment needed]
- **Dependencies:** [only essential dependencies]
- **Configuration:** [minimal config]

### Execution

```bash
# Command to reproduce
[exact command]
```

### Expected vs Actual

**Expected:** [what should happen]
**Actual:** [what happens (the bug)]

## Analysis

### Essential Elements

These elements are required for reproduction:

1. [Critical element 1] - Remove this and bug disappears
2. [Critical element 2] - Essential for triggering condition
3. [Continue for all essential elements]

### Removed Elements

These were safely removed without affecting the bug:

- [Category]: [what was removed and why it's non-essential]
- [Continue for major categories]

### Insights Gained

[What the minimization reveals about the bug's nature]

## Root Cause Hypothesis

Based on minimal reproduction:
[What the essential elements suggest about root cause]

## Next Steps

1. Debug the minimal case using other techniques
2. Focus on interaction between essential elements
3. Test fix against both minimal and original cases

```

## Completion Criteria
- [ ] Original failing case captured
- [ ] Minimization algorithm executed
- [ ] Minimal reproduction achieved
- [ ] Bug still reproduces with minimal case
- [ ] No further reduction possible
- [ ] Essential elements identified
- [ ] Clean reproduction documented
```
