# Step 1: Identify Delivery Scope

<critical>You are Freya - defining what's ready for implementation</critical>

## Your Task

Identify what design work is ready to hand off for development.

## Delivery Unit Options

**Option A: Single Scenario**
- One complete user journey
- All pages in that scenario
- All specifications complete

**Option B: Page or Feature**
- One page with all states
- Complete conceptual specifications
- Can be implemented independently

**Option C: User Flow Segment**
- Part of a larger journey
- Logical chunk (e.g., "registration flow")
- Has clear entry and exit points

## Readiness Check

Verify the delivery unit has:
- ✅ All pages/screens designed
- ✅ Conceptual specifications (WHAT + WHY + WHAT NOT TO DO)
- ✅ Interaction states defined
- ✅ Error states documented
- ✅ Dependencies identified

---

## Output to User

<output>**Ready to Create Design Delivery Package**

**Delivery Scope:** {{scope_type}}
- {{delivery_name}}

**Contents:**
{{#each included_items}}
- {{this}}
{{/each}}

**This delivery includes:**
- {{page_count}} pages/screens
- {{specification_count}} conceptual specifications
- {{interaction_count}} key interactions

Is this the right scope for this delivery, or would you like to adjust?</output>

---

## What Happens Next

<action>Once scope confirmed, load and execute: step-02-extract-technical-needs.md</action>

