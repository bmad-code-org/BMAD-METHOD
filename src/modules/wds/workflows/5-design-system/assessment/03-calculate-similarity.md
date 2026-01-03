# Assessment Step 3: Calculate Similarity

**Purpose:** Interpret comparison data and determine similarity level.

**Input:** Detailed comparison with scores

**Output:** Similarity classification and recommendation

---

## Similarity Levels

### Level 1: Identical (95-100%)

**Characteristics:**

- All visual attributes match
- Same functional purpose
- Same behavioral patterns
- Only content differs (labels, text)

**Interpretation:** This is the same component

**Recommendation:** Reuse existing component reference

---

### Level 2: Very High Similarity (80-94%)

**Characteristics:**

- Visual attributes mostly match
- Same core function
- Minor behavioral differences
- Same usage context

**Interpretation:** This is likely the same component with minor variations

**Recommendation:** Consider adding variant to existing component

---

### Level 3: High Similarity (65-79%)

**Characteristics:**

- Visual attributes similar
- Related functional purpose
- Some behavioral differences
- Similar usage context

**Interpretation:** Could be same component or new variant

**Recommendation:** Designer decision needed - variant or new?

---

### Level 4: Medium Similarity (45-64%)

**Characteristics:**

- Some visual overlap
- Different functional purpose
- Different behaviors
- Different usage context

**Interpretation:** Related but distinct components

**Recommendation:** Likely new component, but designer should confirm

---

### Level 5: Low Similarity (20-44%)

**Characteristics:**

- Minimal visual overlap
- Different function
- Different behaviors
- Different context

**Interpretation:** Different components that happen to share a type

**Recommendation:** Create new component

---

### Level 6: No Similarity (<20%)

**Characteristics:**

- No meaningful overlap
- Completely different purpose
- Unrelated patterns

**Interpretation:** Unrelated components

**Recommendation:** Definitely create new component

---

## Calculation Logic

<action>
Calculate overall similarity:
1. Weight each dimension:
   - Visual: 30%
   - Functional: 30%
   - Behavioral: 25%
   - Contextual: 15%

2. Convert dimension scores to numeric:
   - High = 1.0
   - Medium = 0.6
   - Low = 0.2

3. Calculate weighted average:
   - Overall = (Visual × 0.3) + (Functional × 0.3) + (Behavioral × 0.25) + (Contextual × 0.15)

4. Convert to percentage:
   - Similarity % = Overall × 100
     </action>

**Example:**

```
Dimension Scores:
- Visual: High (1.0)
- Functional: Medium (0.6)
- Behavioral: Medium (0.6)
- Contextual: Medium (0.6)

Calculation:
(1.0 × 0.3) + (0.6 × 0.3) + (0.6 × 0.25) + (0.6 × 0.15)
= 0.3 + 0.18 + 0.15 + 0.09
= 0.72

Similarity: 72% (High Similarity - Level 3)
```

---

## Step 1: Calculate Score

<action>
Apply calculation logic to comparison data
</action>

<output>
```
📊 Similarity Calculation

Visual: High (1.0) × 30% = 0.30
Functional: Medium (0.6) × 30% = 0.18
Behavioral: Medium (0.6) × 25% = 0.15
Contextual: Medium (0.6) × 15% = 0.09

Overall Similarity: 72%
Level: High Similarity (Level 3)

```
</output>

---

## Step 2: Classify Similarity

<action>
Map percentage to similarity level
</action>

<output>
```

**Similarity Level: High (72%)**

This component is similar to Button [btn-001] but has some differences.

Could be:

- A variant of the existing button
- A new related button component

Designer decision needed.

```
</output>

---

## Step 3: Generate Recommendation

<action>
Based on similarity level, generate recommendation with reasoning
</action>

**For Level 1-2 (Identical/Very High):**
```

✅ Recommendation: Reuse existing component

Reasoning:

- Components are nearly identical
- Only content/labels differ
- Same visual and behavioral patterns
- Maintaining consistency is straightforward

```

**For Level 3 (High):**
```

🤔 Recommendation: Designer decision needed

This could go either way:

- Similar enough to be a variant
- Different enough to be separate

I'll present the trade-offs so you can decide.

```

**For Level 4-5 (Medium/Low):**
```

🆕 Recommendation: Create new component

Reasoning:

- Significant functional differences
- Different usage contexts
- Trying to merge would create complexity
- Better to keep separate

```

**For Level 6 (No similarity):**
```

✅ Recommendation: Definitely create new component

Reasoning:

- Components are fundamentally different
- No meaningful overlap
- No benefit to linking them

```

---

## Step 4: Identify Key Decision Factors

<action>
Highlight the most important differences that affect the decision
</action>

**Example:**
```

🔑 Key Decision Factors:

1. **Icon presence** - Current has icon, existing doesn't
   Impact: Visual consistency, component complexity

2. **Loading state** - Current has loading, existing doesn't
   Impact: Behavioral complexity, reusability

3. **Navigation vs Submission** - Different purposes
   Impact: Semantic meaning, developer understanding

These differences will affect your decision.

```

---

## Step 5: Pass to Next Step

<action>
Pass classification and recommendation to opportunity identification:
- Similarity level
- Recommendation
- Key decision factors
</action>

**Next:** `04-identify-opportunities.md`

---

## Edge Cases

**Borderline cases (near threshold):**
```

⚠️ Borderline Case: 64% similarity

This is right on the edge between "High" and "Medium" similarity.

I'll present both perspectives so you can make an informed decision.

```

**Multiple candidates with similar scores:**
```

📊 Multiple Similar Candidates:

Button [btn-001]: 72% similarity
Button [btn-003]: 68% similarity

btn-001 is slightly closer, but both are viable options.
I'll compare to btn-001 for the decision.

```

**Perfect match but different context:**
```

⚠️ Unusual Pattern: 98% similarity but different context

Visually and behaviorally identical, but used in completely different contexts.

This might indicate:

- Same component, different use case ✓
- Accidental duplication ⚠️
- Context-specific variant needed 🤔

````

---

## Output Format

**For next step:**
```json
{
  "similarity": {
    "percentage": 72,
    "level": "high",
    "level_number": 3,
    "recommendation": "designer_decision",
    "key_factors": [
      "Icon presence",
      "Loading state",
      "Navigation vs Submission"
    ]
  }
}
````

---

**This step calculates and classifies. Opportunity/risk analysis happens in the next steps.**
