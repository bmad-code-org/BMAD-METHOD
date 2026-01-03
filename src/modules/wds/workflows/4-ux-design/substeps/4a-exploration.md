# Step 4A: Scenario Exploration

<critical>This step is OPTIONAL - only use if user needs conceptual help before sketching</critical>

<goal>Help user think through the concept, flow, and solution before sketching begins</goal>

## When to Use This Step

Use 4A when:

- User has no existing sketches
- User is unsure how to approach a feature
- User wants to explore the concept together

Skip 4A when:

- User has sketches ready
- User knows exactly what they want

---

## Exploration Process

<output>**Let's explore this concept together before sketching.**

I'll help you think through:

- What the user is trying to accomplish
- What content and features they need
- How psychological triggers from your Trigger Map apply
- What the interaction flow should be</output>

<ask>**What is the user trying to accomplish on this page?**

What's their goal? What brought them here?</ask>

<action>Listen and reflect back the core user goal</action>

<ask>**What do they need to see or do to accomplish that?**

Think about:

- Information they need
- Actions they can take
- Choices they need to make</ask>

<action>Help structure the page elements</action>

<ask>**Let's check your Trigger Map - what drives this user?**

Looking at your personas and driving forces:

- What positive goals does this page support?
- What negative outcomes does it help them avoid?</ask>

<action>Reference Trigger Map from B-Trigger-Map/ if available</action>
<action>Connect design choices to user psychology</action>

<ask>**How does the interaction flow?**

Walk me through:

1. User arrives (from where?)
2. User sees... (what catches attention?)
3. User does... (main actions?)
4. User goes... (where next?)</ask>

<action>Sketch out the interaction flow verbally</action>

<output>**Great! Here's what we've explored:**

**User Goal:** {{user_goal}}

**Key Elements:**
{{key_elements_list}}

**Psychological Triggers:**
{{trigger_connections}}

**Flow:**
{{interaction_flow}}

You're ready to sketch! Would you like to:

1. **Create sketches** - Use your preferred tool, then come back for analysis (4B)
2. **Skip sketching** - Go directly to specification (4C)
3. **Explore more** - Refine the concept further</output>

<check if="choice == 1">
  <output>Perfect! Sketch your concept and come back when ready. I'll be here to analyze it (Step 4B). 🎨</output>
  <action>Save exploration notes to page folder as "exploration-notes.md"</action>
  <action>Pause workflow - user will return to Step 4B</action>
</check>

<check if="choice == 2">
  <action>Proceed directly to Step 4C (specification)</action>
</check>

<check if="choice == 3">
  <action>Ask what aspect to explore more deeply</action>
  <action>Continue exploration dialog</action>
</check>

---

**Next:** Step 4B (Sketch Analysis) or Step 4C (Specification)
