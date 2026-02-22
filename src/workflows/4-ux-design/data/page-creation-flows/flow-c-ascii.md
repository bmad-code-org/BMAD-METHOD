# Flow C: ASCII Layout

**Activates when:** User chooses to create an ASCII layout

---

## Introduction

<output>**Let's create a simple ASCII layout together.**

⚠️ **Note:** ASCII is a last resort - sketches are much better for capturing design intent!

We'll create a basic box-and-text layout to show structure.</output>

---

## Gather Sections

<ask>**What are the main sections from top to bottom?**

Example:
- Header
- Hero
- Features (3 columns)
- CTA
- Footer

List sections:</ask>

<action>Store sections_for_ascii</action>

---

## Generate ASCII

<action>
Generate ASCII layout:

```
┌─────────────────────────────────────────┐
│  [HEADER]                               │
│  Logo | Nav | Contact                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                                         │
│  [HERO SECTION]                         │
│                                         │
│  Headline Goes Here                     │
│  Subheadline text here                  │
│                                         │
│  [CTA Button]                           │
│                                         │
└─────────────────────────────────────────┘

┌───────────┬───────────┬───────────┐
│           │           │           │
│ [Feature] │ [Feature] │ [Feature] │
│     1     │     2     │     3     │
│           │           │           │
│  Icon     │  Icon     │  Icon     │
│  Text     │  Text     │  Text     │
│           │           │           │
└───────────┴───────────┴───────────┘

... (for each section)
```

Save as conceptual specification with ASCII visualization
</action>

---

## Completion

<output>✅ **ASCII layout created!**

⚠️ **Remember:** This is a rough structural guide.

**Recommended next steps:**
1. Use this ASCII as a reference
2. Create a proper sketch/wireframe
3. Upload and run Page Process Workshop

**ASCII is helpful for structure, but lacks:**
- Visual hierarchy
- Spacing and proportions
- Typography details
- Color and visual design
- Actual content flow

Ready to move forward?</output>
