# Step 0: Define Content Purpose

**What job must this content do?**

---

## Purpose

Before generating any content, we must define its **measurable job**. Content purpose determines which strategic models to emphasize and enables objective review.

---

## Duration

⏱️ **3-5 minutes**

---

## What You're Doing

Defining a clear, testable purpose statement that answers:
- What must this content accomplish?
- For whom? (audience/user state)
- How will we know it succeeded?

---

## Questions for the User

### 1. Content Context

**"What content are we creating?"**

Examples:
- Landing page hero section
- Product comparison table
- Error message for invalid email
- CTA button on pricing page
- About page mission statement

### 2. The Job To Do

**"What must this content accomplish?"**

Not "what it says" but "what it does":

**Good (outcome-focused):**
- "Convince Problem Aware users that shelf life matters"
- "Enable confident product selection between us and competitors"
- "Help user fix validation error while maintaining confidence"
- "Remove final purchase barrier with risk reversal"

**Bad (vague):**
- "Describe the product"
- "Explain benefits"
- "Add social proof"
- "Make it sound good"

**"Can you describe the specific outcome this content needs to achieve?"**

### 3. Target Audience/State

**"Who will read this? What state are they in?"**

Be specific:
- "Problem Aware hairdressers feeling behind on trends"
- "Product Aware B2B buyers comparing options"
- "New users who just made a validation error"
- "Most Aware users at checkout with last-minute doubts"

**"What's their mental/emotional state when they encounter this?"**

### 4. Success Criteria

**"How will we know this content succeeded?"**

Define measurable or observable outcomes:
- "User recognizes themselves and continues reading"
- "User can choose the right tier in < 30 seconds"
- "User knows what happened and how to fix it"
- "User clicks CTA feeling confident, not anxious"

**"What would 'working perfectly' look like?"**

### 5. Model Priority Emphasis

**"Which strategic models matter most for THIS job?"**

Based on content type and purpose, some models are more critical:

Present the **Model Priority Matrix** from Content Purpose Guide and discuss:

**Example: Error Message**
- Badass Users ⭐⭐⭐ (maintain confidence)
- Action Mapping ⭐⭐⭐ (enable recovery)
- Customer Awareness ⭐ (keep simple)
- Golden Circle ⭐ (not needed)
- VTC ⭐ (context only)

**Example: Landing Page Hero**
- Customer Awareness ⭐⭐⭐ (hook at their level)
- Golden Circle ⭐⭐⭐ (WHY-first)
- Badass Users ⭐⭐ (transformation promise)
- VTC ⭐⭐ (targeting/motivation)
- Action Mapping ⭐ (CTA comes later)

**"Which models should we emphasize for this content's purpose?"**

---

## Agent Actions

1. **Understand the content context** - What type of content is this?
2. **Define the purpose collaboratively** - What job must it do?
3. **Identify the audience/state** - Who will read it? When?
4. **Establish success criteria** - How will we know it worked?
5. **Select model priorities** - Which frameworks matter most?
6. **Document the purpose** - Clear statement for traceability and review

---

## Validation

Before proceeding to Step 1:

- [ ] Content type/context is clear
- [ ] Purpose is specific and outcome-focused (not vague)
- [ ] Audience and their state are defined
- [ ] Success criteria are measurable or observable
- [ ] Model priorities are selected based on purpose
- [ ] Purpose statement is documented

---

## Output

**Purpose Definition:**

```yaml
content_purpose:
  content_type: "[e.g., Landing page hero, Error message, CTA button]"
  
  purpose_statement: "[Action verb] + [specific audience/state] + [desired outcome]"
  
  audience:
    who: "[User persona or type]"
    state: "[Mental/emotional state, awareness level]"
    context: "[When/where they encounter this content]"
  
  success_criteria:
    - "[Observable outcome 1]"
    - "[Observable outcome 2]"
  
  model_priorities:
    primary: ["[Model 1 ⭐⭐⭐]", "[Model 2 ⭐⭐⭐]"]
    secondary: ["[Model 3 ⭐⭐]"]
    tertiary: ["[Model 4 ⭐]"]
  
  review_question: "[How will we know this achieved its purpose?]"
```

---

## Next Step

Once purpose is defined:

**→ Proceed to [Step 1: Load VTC Context](step-01-load-vtc-context.md)**

---

## Examples

### Example 1: Landing Page Hero

```yaml
content_purpose:
  content_type: "Landing page hero section"
  
  purpose_statement: "Hook Problem Aware hairdressers by validating their frustration and promising transformation"
  
  audience:
    who: "Harriet (hairdresser, ambitious, small-town)"
    state: "Problem Aware - feels behind when clients ask about trends"
    context: "Landing on site from Google search or Instagram ad"
  
  success_criteria:
    - "User immediately recognizes themselves in the problem"
    - "User feels validated, not alone"
    - "User wants to continue reading (doesn't bounce)"
  
  model_priorities:
    primary: ["Customer Awareness ⭐⭐⭐", "Golden Circle ⭐⭐⭐"]
    secondary: ["Badass Users ⭐⭐", "VTC ⭐⭐"]
    tertiary: ["Action Mapping ⭐"]
  
  review_question: "Does a Problem Aware hairdresser feel seen and want to learn more?"
```

---

### Example 2: Error Message

```yaml
content_purpose:
  content_type: "Form validation error message"
  
  purpose_statement: "Help user fix invalid email while maintaining confidence and reducing frustration"
  
  audience:
    who: "New user attempting signup"
    state: "Frustrated - made a typo, wants to fix it quickly"
    context: "Just clicked submit and saw error"
  
  success_criteria:
    - "User understands what's wrong"
    - "User knows exactly how to fix it"
    - "User doesn't feel stupid or blamed"
    - "User successfully resubmits"
  
  model_priorities:
    primary: ["Badass Users ⭐⭐⭐", "Action Mapping ⭐⭐⭐"]
    secondary: ["Customer Awareness ⭐"]
    tertiary: ["Golden Circle ⭐", "VTC ⭐"]
  
  review_question: "Can user fix error quickly without feeling frustrated?"
```

---

### Example 3: Product Comparison Feature

```yaml
content_purpose:
  content_type: "Shelf life comparison row in feature table"
  
  purpose_statement: "Convince value-conscious users that 3x longer shelf life saves them money and hassle"
  
  audience:
    who: "Product Aware users comparing us to competitors"
    state: "Evaluating features, looking for differentiators"
    context: "In active comparison mode, possibly has competitor tab open"
  
  success_criteria:
    - "User understands the 3x advantage"
    - "User connects longer shelf life to personal benefit (saves money/waste)"
    - "User sees this as competitive advantage worth paying for"
  
  model_priorities:
    primary: ["VTC ⭐⭐⭐", "Badass Users ⭐⭐"]
    secondary: ["Action Mapping ⭐⭐", "Customer Awareness ⭐"]
    tertiary: ["Golden Circle ⭐"]
  
  review_question: "Does user see 3x shelf life as a compelling reason to choose us?"
```

---

## Notes

- **Purpose comes first** - Everything else flows from this
- **Be specific** - Vague purposes lead to vague content
- **Make it testable** - "I like it" isn't a success criterion
- **Different purposes emphasize different models** - One size doesn't fit all
- **Purpose enables review** - Objective evaluation, not subjective preference

---

## Quick Reference: Purpose Templates

**Persuasion:**
- "Convince [audience] that [claim] by [strategy]"
- "Activate [driving force] through [benefit/proof]"
- "Move [start awareness] to [end awareness] by [approach]"

**Education:**
- "Enable [user] to [action] with [confidence level]"
- "Help [user] understand [concept] in [timeframe]"

**Functional:**
- "Guide [user] to [action] with zero [friction]"
- "Maintain [emotion] while [outcome]"

**Brand:**
- "Connect [audience] to our [value]"
- "Inspire [emotion] through [story]"

---

**⚠️ ALPHA:** If this step felt unnecessary or too structured, please note feedback. Is purpose definition too formal for Quick Mode?

