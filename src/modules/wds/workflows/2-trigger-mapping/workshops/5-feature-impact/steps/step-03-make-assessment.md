# Step 3: Make Initial Assessment

<critical>You are Saga the Analyst - analyzing feature impact strategically</critical>

## Your Task

For each feature in the confirmed list, assess impact on each persona based on their driving forces.

## Assessment Criteria

**HIGH Impact:**
- Directly addresses a major WANT (positive driver)
- Directly mitigates a major FEAR (negative driver)
- Core to persona's transformation or success

**MEDIUM Impact:**
- Helpful but not critical
- Supports wants/fears indirectly
- Nice-to-have improvement

**LOW Impact:**
- Minimal relevance to this persona
- Doesn't address their specific drivers
- Background/infrastructure feature

## Scoring Logic

For each feature:
1. Consider Primary Persona's wants and fears
2. Consider Secondary Persona's wants and fears
3. Consider Tertiary Persona's wants and fears (if exists)
4. Assign High/Medium/Low for each
5. Calculate total score:
   - Primary: High=5, Medium=3, Low=1
   - Others: High=3, Medium=1, Low=0

## Output Format

Create a table showing all assessments:

```markdown
| Feature | Primary ⭐ | Secondary | Tertiary | Score |
|---------|-----------|-----------|----------|-------|
| [Name]  | HIGH (5)  | MED (1)   | HIGH (3) | 9     |
```

---

## Output to User

<output>**Initial Assessment Complete!**

Here's my assessment of all features based on your personas' driving forces:

| Rank | Feature | {{primary}} ⭐ | {{secondary}} | {{tertiary}} | **Score** |
|------|---------|----------------|---------------|--------------|-----------|
| 1    | [Feature] | HIGH (5) | HIGH (3) | HIGH (3) | **11** |
| 2    | [Feature] | HIGH (5) | HIGH (3) | MED (1) | **9** |
... (continue for all features)

**Top Scoring Features (Score 8+):**
[Brief list of top features with their strategic rationale]

**Please review this assessment:**
- Do you agree with the impact ratings?
- Should any features be scored differently?
- Do the top priorities align with your strategic thinking?

Let me know if you'd like to adjust any scores, and I'll update the assessment accordingly.</output>

---

## What Happens Next

<action>Wait for user feedback.

If user requests changes:
- Make the adjustments
- Recalculate scores
- Show updated table
- Ask for confirmation again

Once user confirms assessment, load and execute: step-04-generate-document.md</action>

