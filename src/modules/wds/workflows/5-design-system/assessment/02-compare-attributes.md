# Assessment Step 2: Compare Attributes

**Purpose:** Systematically compare current component to existing candidates.

**Input:** Current component spec + candidate list

**Output:** Detailed comparison of similarities and differences

---

## Comparison Framework

**Compare across 4 dimensions:**

### 1. Visual Attributes

- Size (small, medium, large)
- Shape (rounded, square, pill)
- Color scheme
- Typography
- Spacing/padding
- Border style

### 2. Functional Attributes

- Purpose/intent
- User action
- Input/output type
- Validation rules
- Required/optional

### 3. Behavioral Attributes

- States (default, hover, active, disabled, loading, error)
- Interactions (click, hover, focus, blur)
- Animations/transitions
- Keyboard support
- Accessibility

### 4. Contextual Attributes

- Usage pattern (where it appears)
- Frequency (how often used)
- Relationship to other components
- User journey stage

---

## Step 1: Visual Comparison

<action>
Compare visual attributes:
- Extract visual properties from current spec
- Extract visual properties from candidate
- Calculate matches and differences
</action>

**Example:**

```
Visual Comparison: Current Button vs Button [btn-001]

Similarities:
✓ Size: medium (both)
✓ Shape: rounded (both)
✓ Color scheme: blue primary (both)

Differences:
✗ Current: Has icon on left
✗ btn-001: Text only
✗ Current: Slightly larger padding
```

---

## Step 2: Functional Comparison

<action>
Compare functional attributes:
- What does it do?
- What's the user intent?
- What's the outcome?
</action>

**Example:**

```
Functional Comparison: Current Button vs Button [btn-001]

Similarities:
✓ Purpose: Primary action trigger
✓ User action: Click to submit/proceed
✓ Outcome: Form submission or navigation

Differences:
✗ Current: "Continue to next step"
✗ btn-001: "Submit form"
✗ Current: Navigation action
✗ btn-001: Form submission action
```

---

## Step 3: Behavioral Comparison

<action>
Compare behavioral attributes:
- States
- Interactions
- Animations
</action>

**Example:**

```
Behavioral Comparison: Current Button vs Button [btn-001]

Similarities:
✓ States: default, hover, active, disabled (both)
✓ Hover: Darkens background (both)
✓ Disabled: Grayed out (both)

Differences:
✗ Current: Has loading state with spinner
✗ btn-001: No loading state
✗ Current: Icon rotates on hover
```

---

## Step 4: Contextual Comparison

<action>
Compare contextual attributes:
- Where is it used?
- How often?
- What's the pattern?
</action>

**Example:**

```
Contextual Comparison: Current Button vs Button [btn-001]

Similarities:
✓ Both: Primary action in forms
✓ Both: Bottom-right of containers
✓ Both: High-frequency usage

Differences:
✗ Current: Multi-step flow navigation
✗ btn-001: Single-page form submission
✗ Current: Always has "next" context
```

---

## Step 5: Calculate Similarity Score

<action>
Score each dimension:
- Visual: High/Medium/Low similarity
- Functional: High/Medium/Low similarity
- Behavioral: High/Medium/Low similarity
- Contextual: High/Medium/Low similarity
</action>

**Scoring Guide:**

- **High:** 80%+ attributes match
- **Medium:** 50-79% attributes match
- **Low:** <50% attributes match

**Example:**

```
Similarity Score: Current Button vs Button [btn-001]

Visual:      High (90% match)
Functional:  Medium (60% match)
Behavioral:  Medium (70% match)
Contextual:  Medium (65% match)

Overall:     Medium-High Similarity
```

---

## Step 6: Summarize Comparison

<output>
Present comparison summary:

```
📊 Comparison: Current Button vs Button [btn-001]

**Similarities:**
✓ Visual appearance (size, shape, color)
✓ Primary action purpose
✓ Standard states (default, hover, active, disabled)
✓ High-frequency usage pattern

**Differences:**
✗ Current has icon, btn-001 is text-only
✗ Current has loading state, btn-001 doesn't
✗ Current for navigation, btn-001 for submission
✗ Current has icon animation

**Similarity Score:** Medium-High (71%)
```

</output>

---

## Step 7: Pass to Next Step

<action>
Pass comparison data to similarity calculation:
- Detailed comparison
- Similarity scores
- Key differences
</action>

**Next:** `03-calculate-similarity.md`

---

## Edge Cases

**Perfect match (100%):**

```
✓ This component is identical to btn-001.

This is likely the same component with different content.
```

**Recommend:** Reuse existing component

**Very low similarity (<30%):**

```
✗ This component is very different from btn-001.

Despite being the same type, these serve different purposes.
```

**Recommend:** Create new component

**Multiple candidates:**

```
📊 Comparing to 2 candidates:

Button [btn-001]: 71% similarity
Icon Button [btn-002]: 45% similarity

btn-001 is the closest match.
```

**Continue with best match**

---

## Output Format

**For next step:**

```json
{
  "comparison": {
    "candidate_id": "btn-001",
    "visual_similarity": "high",
    "functional_similarity": "medium",
    "behavioral_similarity": "medium",
    "contextual_similarity": "medium",
    "overall_score": 0.71,
    "similarities": [...],
    "differences": [...]
  }
}
```

---

**This step compares systematically. Interpretation happens in the next step.**
