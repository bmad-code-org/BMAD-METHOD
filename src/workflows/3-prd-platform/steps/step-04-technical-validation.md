# Step 4: Technical Validation & Proofs of Concept

## Purpose

Identify features needing validation and execute PoCs to prove feasibility.

## Context for Agent

Review Feature Impact Analysis to find risky features. High-impact + high-risk features get priority. Frame all results positively — even failed PoCs save weeks of design work.

## Instructions

### Identify Features Needing PoCs

Review Feature Impact Analysis and ask:

- Which features are innovative or unproven?
- Which depend on external APIs with potential limitations?
- Which have unknown performance characteristics?
- Which might not be technically feasible?

Prioritize by:
1. High Feature Impact Score + High Technical Risk
2. Medium Impact + High Risk
3. High Impact + Medium Risk

### Execute PoCs

For each identified feature:

1. **Define the question** — What exactly needs to be proven?
2. **Create or request PoC** — Guide through validation or assign to dev team
3. **Document results:**
   - Status: Proven / Limited / Not Feasible
   - Findings: What worked, what didn't
   - Limitations: Edge cases, performance, cost
   - Recommendation: Go / No-Go / Modify Feature
4. **Include code snippets** when possible

### Positive Framing

- Works: "This proves [feature] is technically sound. Design can proceed with confidence."
- Limited: "Valuable discovery! We found [limitation] early — design can account for it."
- Doesn't work: "Important learning! This saves weeks of design work. Let's explore alternatives."

**Output:** Create `02-Technical-Proofs-Of-Concept.md`

## Next Step

Proceed to step-05-security-framework.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md', 'step-03-integration-mapping.md', 'step-04-technical-validation.md']
```
