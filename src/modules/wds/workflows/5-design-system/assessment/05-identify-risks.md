# Assessment Step 5: Identify Risks

**Purpose:** Identify potential problems with each design system decision.

**Input:** Similarity analysis and opportunity analysis

**Output:** List of risks for each option

---

## Risk Analysis Framework

### For Option 1: Reuse Existing

**Potential Risks:**

#### Loss of Distinction

- ❌ Different purposes look identical
- ❌ Users can't distinguish actions
- ❌ Semantic meaning lost
- ❌ Accessibility issues (same label, different action)

#### Constraint

- ❌ Forced to use existing styling
- ❌ Can't optimize for specific use case
- ❌ Future changes constrained
- ❌ Design evolution limited

#### Confusion

- ❌ Developers confused about usage
- ❌ Same component, different behaviors
- ❌ Unclear when to use
- ❌ Documentation complexity

#### Technical Debt

- ❌ Component becomes overloaded
- ❌ Too many conditional behaviors
- ❌ Hard to maintain
- ❌ Performance issues

---

### For Option 2: Add Variant

**Potential Risks:**

#### Complexity

- ❌ Component becomes complex
- ❌ Many variants to manage
- ❌ Harder to understand
- ❌ More documentation needed

#### Maintenance Burden

- ❌ Changes affect all variants
- ❌ Testing becomes complex
- ❌ More edge cases to handle
- ❌ Harder to refactor

#### Variant Explosion

- ❌ Too many variants over time
- ❌ Unclear which variant to use
- ❌ Variants become too specific
- ❌ Component loses coherence

#### Coupling

- ❌ Variants tightly coupled
- ❌ Can't change one without affecting others
- ❌ Shared code creates dependencies
- ❌ Harder to deprecate

---

### For Option 3: Create New

**Potential Risks:**

#### Inconsistency

- ❌ Visual inconsistency across pages
- ❌ Different styling for similar components
- ❌ User confusion
- ❌ Brand fragmentation

#### Duplication

- ❌ Duplicate code
- ❌ Duplicate maintenance
- ❌ Duplicate testing
- ❌ Duplicate documentation

#### Proliferation

- ❌ Too many components in design system
- ❌ Hard to find right component
- ❌ Developers create more duplicates
- ❌ Design system becomes unwieldy

#### Divergence

- ❌ Components drift over time
- ❌ Accidental inconsistencies
- ❌ Harder to maintain coherence
- ❌ More work to keep aligned

---

## Step 1: Analyze Current Situation for Risks

<action>
Based on similarity level and comparison, identify which risks apply
</action>

**Example (72% similarity, different purposes):**

```
Current Situation:
- High visual similarity (90%)
- Different functional purpose (navigation vs submission)
- Some behavioral differences (loading state, icon)

Risk Indicators:
- Reuse: High risk of semantic confusion
- Variant: Medium risk of complexity
- New: Medium risk of visual inconsistency
```

---

## Step 2: Generate Risk Lists

<output>
**Option 1: Reuse Button [btn-001]**

Risks:
❌ **Semantic Confusion:** Navigation and submission look identical
❌ **Accessibility:** Screen readers can't distinguish actions
❌ **Developer Confusion:** Same component, different behaviors
❌ **Future Constraint:** Can't optimize for navigation use case

Highest Risk: Semantic confusion - users won't understand the difference
</output>

<output>
**Option 2: Add "Navigation" Variant to Button [btn-001]**

Risks:
❌ **Complexity:** Button component now handles 2 different purposes
❌ **Maintenance:** Changes to button affect both submission and navigation
❌ **Variant Explosion:** What about other button types? (delete, cancel, etc.)
❌ **Documentation:** Need to explain when to use each variant

Highest Risk: Variant explosion - could lead to 10+ button variants
</output>

<output>
**Option 3: Create New "Navigation Button" Component**

Risks:
❌ **Visual Inconsistency:** Two similar-looking buttons with different names
❌ **Duplication:** Similar code in two components
❌ **Proliferation:** More components in design system
❌ **Developer Choice:** Which button should I use?

Highest Risk: Visual inconsistency - buttons might drift apart over time
</output>

---

## Step 3: Assess Risk Severity

<action>
Rate each risk as Low/Medium/High severity based on:
- Impact if it occurs
- Likelihood of occurring
- Difficulty to fix later
</action>

**Example:**

```
Risk Severity Assessment:

**Reuse Option:**
- Semantic confusion: HIGH (impacts UX, hard to fix)
- Accessibility: HIGH (compliance issue)
- Developer confusion: MEDIUM (documentation can help)
- Future constraint: MEDIUM (can refactor later)

**Variant Option:**
- Complexity: MEDIUM (manageable with good structure)
- Maintenance: MEDIUM (testing helps)
- Variant explosion: HIGH (hard to reverse)
- Documentation: LOW (just needs writing)

**New Option:**
- Visual inconsistency: MEDIUM (can be monitored)
- Duplication: LOW (acceptable trade-off)
- Proliferation: MEDIUM (can be managed)
- Developer choice: LOW (documentation helps)
```

---

## Step 4: Identify Deal-Breaker Risks

<action>
Highlight risks that would make an option unsuitable
</action>

**Example:**

```
🚨 Deal-Breaker Risks:

**Reuse:**
- Semantic confusion is HIGH risk
- Accessibility issue is HIGH risk
→ This option might not be viable

**Variant:**
- Variant explosion is HIGH risk
- But can be mitigated with clear guidelines
→ This option is risky but manageable

**New:**
- No HIGH severity risks identified
- All risks are manageable
→ This option is safest
```

---

## Step 5: Consider Mitigation Strategies

<action>
For each risk, identify if/how it can be mitigated
</action>

**Example:**

```
Risk Mitigation:

**Reuse - Semantic Confusion:**
- Mitigation: Use different labels/icons
- Effectiveness: LOW (still same component)
- Verdict: Hard to mitigate

**Variant - Variant Explosion:**
- Mitigation: Strict variant guidelines
- Effectiveness: MEDIUM (requires discipline)
- Verdict: Can be managed

**New - Visual Inconsistency:**
- Mitigation: Shared design tokens
- Effectiveness: HIGH (tokens ensure consistency)
- Verdict: Easily mitigated
```

---

## Step 6: Pass to Next Step

<action>
Pass risk analysis to decision presentation:
- Risks for each option
- Severity ratings
- Deal-breaker risks
- Mitigation strategies
</action>

**Next:** `06-present-decision.md`

---

## Edge Cases

**All options have high risks:**

```
⚠️ All Options Have Significant Risks

This is a tough decision:
- Reuse: Semantic confusion
- Variant: Complexity explosion
- New: Inconsistency

I'll present all trade-offs clearly so you can make an informed choice.
```

**No significant risks:**

```
✅ Low Risk Situation

All options have manageable risks:
- Reuse: Minor constraint
- Variant: Slight complexity
- New: Minimal duplication

Focus on opportunities to decide.
```

**One option has deal-breaker risk:**

```
🚨 One Option Not Recommended

Reuse has HIGH accessibility risk that's hard to mitigate.

I'll present Variant vs New as the viable options.
```

---

## Output Format

**For next step:**

```json
{
  "risks": {
    "reuse": {
      "semantic_confusion": "high",
      "accessibility": "high",
      "developer_confusion": "medium",
      "deal_breaker": true
    },
    "variant": {
      "complexity": "medium",
      "variant_explosion": "high",
      "maintenance": "medium",
      "deal_breaker": false,
      "mitigation": "strict_guidelines"
    },
    "new": {
      "visual_inconsistency": "medium",
      "duplication": "low",
      "proliferation": "medium",
      "deal_breaker": false,
      "mitigation": "shared_tokens"
    }
  }
}
```

---

**This step identifies risks. The next step presents the complete decision to the designer.**
