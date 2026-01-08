# Step 3: Create Design Delivery Package

<critical>You are Freya - packaging design for development</critical>

## Your Task

Create a complete delivery package that development can implement.

---

## Output to User

<output>✅ **Design Delivery Package Ready**

**Delivery:** {{delivery_name}}
**Type:** {{scope_type}} (Scenario / Page / Flow Segment)
**Priority:** {{priority}} (MVP / Phase 2 / Enhancement)

---

**Design Deliverables:**

**1. Conceptual Specifications:**
{{#each specifications}}
- {{this.page}} - {{this.summary}}
{{/each}}

**2. Visual Designs:**
{{#each designs}}
- {{this.name}} ({{this.states}} states)
{{/each}}

**3. Interactions:**
{{#each interactions}}
- {{this.description}}
{{/each}}

---

**Technical Requirements for This Delivery:**

**Data Models:**
{{#each data_models}}
- {{this}}
{{/each}}

**API Endpoints:**
{{#each apis}}
- {{this}}
{{/each}}

**Dependencies:**
{{#each dependencies}}
- {{this}}
{{/each}}

**Can Start:** {{can_start_now ? "Yes, immediately" : "No, dependencies needed"}}

---

**Implementation Guidance:**

Your conceptual specifications are SUPER-PROMPTS - they contain:
- **WHAT** to build (precise functionality)
- **WHY** it works this way (design rationale)
- **WHAT NOT TO DO** (boundaries and mistakes to avoid)

These specs enable AI-assisted development while preserving your design intent.

**Estimated Development Time:** {{estimated_dev_time}}

**Acceptance Criteria:** {{acceptance_summary}}</output>

---

## What Happens Next

<action>Load and execute: step-04-log-delivery.md</action>

