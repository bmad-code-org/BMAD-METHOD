# Flow B: Verbal Specification

**Activates when:** User chooses to describe the page through discussion

---

## Introduction

<output>**Great! Let's build the page concept through conversation.**

We'll define:
- Page sections (what areas exist?)
- Section purposes (why does each section exist?)
- Key objects (what interactive elements?)
- User flow (how do they move through the page?)

This creates a conceptual specification - the page where concept meets description.</output>

---

## SUBSTEP B1: Identify Sections

<ask>**What are the main SECTIONS of this page?**

Think about areas/blocks, like:
- Header/Navigation
- Hero/Banner
- Content areas
- Forms
- Footer

List the sections from top to bottom:</ask>

<action>Store sections_list</action>

---

## SUBSTEP B2: Section Purposes

<output>**Now let's define each section's purpose:**</output>

<action>
For each section in sections_list:
  <ask>
  **{{section.name}}**

  What is the PURPOSE of this section?
  - What should the user understand/do here?
  - Why does this section exist?

  Purpose:
  </ask>

  Store section.purpose
End
</action>

---

## SUBSTEP B3: Key Objects

<ask>**What are the KEY INTERACTIVE OBJECTS on this page?**

Think about:
- Buttons (CTAs, actions)
- Forms (inputs, selectors)
- Links (navigation, external)
- Media (images, videos)

List the most important interactive elements:</ask>

<action>Store key_objects</action>

---

## SUBSTEP B4: User Flow

<ask>**How does the user move through this page?**

- Where do they enter?
- What's their first action?
- What's the desired outcome?
- Where do they go next?

Describe the flow:</ask>

<action>Store user_flow</action>

---

## SUBSTEP B5: Generate Specification

<output>**Creating conceptual specification...**</output>

<action>
Generate page specification document:
- Page name and purpose
- Navigation (prev/next)
- For each section:
  - Section name
  - Section purpose
  - Status: "CONCEPTUAL - Needs visualization"
- For each key object:
  - Object name
  - Object type
  - Object purpose
  - Status: "CONCEPTUAL - Needs specification"
- User flow description
- Next steps: "Create visualization (sketch/wireframe)"

Save to: C-UX-Scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/{{page_number}}-{{page_slug}}.md
</action>

---

## Completion

<output>✅ **Conceptual page specification created!**

**What we defined:**
- {{sections_list.length}} sections with purposes
- {{key_objects.length}} key interactive objects
- Complete user flow

**Status:** CONCEPTUAL - Ready for visualization

**Next steps:**
1. Create sketch/wireframe based on this concept
2. Upload visualization
3. Run Page Process Workshop to enhance specification

Or:

[A] Create ASCII layout now (quick visual)
[B] Done - I'll create sketch later
[C] Actually, let's refine the concept more

Choice:</output>
