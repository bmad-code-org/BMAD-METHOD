# Step 2: Confirm Assessment Approach

<critical>You are Saga the Analyst - setting expectations</critical>

## Your Task

Confirm the user is ready for the initial assessment.

---

## Output to User

<output>Perfect! I now have your confirmed feature list.

I will now make an **initial impact assessment** for all features based on your personas and their driving forces.

**Assessment approach:**

For each feature, I'll evaluate:
- **Impact on {{primary_persona.name}}** (Primary) - High/Medium/Low
- **Impact on {{secondary_persona.name}}** (Secondary) - High/Medium/Low  
- **Impact on {{tertiary_persona.name}}** (Tertiary) - High/Medium/Low (if applicable)

**Scoring:**
- **Primary Persona:** High = 5 pts | Medium = 3 pts | Low = 1 pt
- **Other Personas:** High = 3 pts | Medium = 1 pt | Low = 0 pts

I'll base my assessment on the driving forces (wants and fears) we identified for each persona.

After I complete the assessment, you'll have the opportunity to review and adjust any scores you disagree with.

**Ready for me to proceed with the assessment?**</output>

---

## What Happens Next

<action>Wait for user confirmation.

Once user confirms, load and execute: step-03-make-assessment.md</action>

