# Workshop: Page Creation (Discussion-Based)

**Purpose:** Define a page concept through conversation, create visualization method based on need

---

## CONTEXT

**This workflow activates when:** User needs to define a page concept but doesn't have a visualization yet.

**Goal:** Define what the page IS, then choose how to visualize it.

**Philosophy:** The page (concept) comes first. Visualization (method) follows.

---

## STEP 1: PAGE CONCEPT

<ask>**What is this page about?**

Tell me in your own words:
- What is this page called?
- What should it accomplish?
- Who uses it and why?

Describe the page concept:</ask>

<action>Store page_concept</action>

---

## STEP 2: VISUALIZATION PREFERENCE

<ask>**How would you like to visualize this page?**

[A] I'll draw a sketch (physical/digital) and upload it
[B] Let's describe it verbally - I'll specify sections through discussion
[C] Create a simple ASCII layout together
[D] It's similar to another page I can reference
[E] Generate HTML prototype - I'll screenshot it for documentation

Choice:</ask>

<action>Store visualization_method</action>

---

## NOTE ON OPTION E (HTML Prototype)

**This is the bridge method:**
```
Concept → HTML Code → Render → Screenshot → Documentation
```

**Benefits:**
- ✅ Professional, pixel-perfect visualization
- ✅ Tests actual layout behavior
- ✅ Responsive/mobile preview available
- ✅ Can iterate quickly
- ✅ Screenshot becomes the "sketch"
- ✅ Prototype is already built!

**Perfect for:**
- Users who can describe but can't draw
- Testing responsive layouts
- Quick professional mockups
- When prototype comes before final design

---

## FLOW A: SKETCH PATH

<check if="visualization_method == 'A'">

<output>**Perfect! Let's set up for your sketch.**

I'll create:
1. Page placeholder with navigation
2. Sketches folder ready for upload
3. Basic page structure

When you're ready, upload your sketch and we'll analyze it together using the Page Process Workshop.</output>

<action>
1. Run page-init-lightweight.md to create structure
2. User uploads sketch when ready
3. Return to workshop-page-process.md for analysis
</action>

</check>

---

## FLOW B: VERBAL SPECIFICATION

<check if="visualization_method == 'B'">

<output>**Great! Let's build the page concept through conversation.**

We'll define:
- Page sections (what areas exist?)
- Section purposes (why does each section exist?)
- Key objects (what interactive elements?)
- User flow (how do they move through the page?)

This creates a conceptual specification - the page where concept meets description.</output>

### SUBSTEP B1: IDENTIFY SECTIONS

<ask>**What are the main SECTIONS of this page?**

Think about areas/blocks, like:
- Header/Navigation
- Hero/Banner
- Content areas
- Forms
- Footer

List the sections from top to bottom:</ask>

<action>Store sections_list</action>

### SUBSTEP B2: SECTION PURPOSES

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

### SUBSTEP B3: KEY OBJECTS

<ask>**What are the KEY INTERACTIVE OBJECTS on this page?**

Think about:
- Buttons (CTAs, actions)
- Forms (inputs, selectors)
- Links (navigation, external)
- Media (images, videos)

List the most important interactive elements:</ask>

<action>Store key_objects</action>

### SUBSTEP B4: USER FLOW

<ask>**How does the user move through this page?**

- Where do they enter?
- What's their first action?
- What's the desired outcome?
- Where do they go next?

Describe the flow:</ask>

<action>Store user_flow</action>

### SUBSTEP B5: GENERATE SPECIFICATION

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

Save to: 4-scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/{{page_number}}-{{page_slug}}.md
</action>

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

</check>

---

## FLOW E: GENERATE HTML PROTOTYPE

<check if="visualization_method == 'E'">

<output>**Perfect! Let's generate an HTML prototype based on your concept.**

This creates a working page that you can:
- View in browser
- Screenshot for documentation
- Test responsive behavior
- Use as starting point for development

The screenshot becomes your "sketch" for the specification.</output>

### SUBSTEP E1: DEFINE BASIC STRUCTURE

<output>**Based on your page concept:**

**Page:** {{page_name}}
**Sections:** {{sections_list}}
**Key Objects:** {{key_objects}}

I'll generate a clean HTML prototype with:
- Semantic HTML structure
- Basic Tailwind CSS styling (or vanilla CSS)
- Placeholder content based on your descriptions
- Responsive layout
- Interactive elements (buttons, forms, etc.)</output>

<ask>**Any specific styling preferences?**

[A] Clean, minimal (default)
[B] Modern SaaS style
[C] Professional/corporate
[D] Creative/bold
[E] Match an existing site (describe)

Styling:</ask>

<action>Store styling_preference</action>

### SUBSTEP E2: GENERATE HTML

<action>
**Generate HTML prototype:**

1. Create semantic HTML structure for each section
2. Add Tailwind CSS classes (or vanilla CSS)
3. Include placeholder content from user's descriptions
4. Add interactive elements with proper attributes
5. Make responsive (mobile-first)
6. Include basic states (hover, focus, etc.)

File: `prototypes/{{page_slug}}-prototype.html`

Template structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page_name}} - Prototype</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Generated sections based on concept -->
    {{#each section in sections_list}}
    <section id="{{section.slug}}" class="...">
        <!-- Section content -->
    </section>
    {{/each}}
</body>
</html>
```

Save to: `4-scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/prototypes/`
</action>

### SUBSTEP E3: VIEW AND CAPTURE

<output>**Prototype generated!** 🎉

**File location:**
`4-scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/prototypes/{{page_slug}}-prototype.html`

**Next steps:**

1. **Open in browser** - Double-click the HTML file
2. **Review the layout** - Does it match your vision?
3. **Test responsive** - Resize browser window
4. **Take screenshots:**
   - Desktop view (full page)
   - Mobile view (if needed)
   - Key sections (close-ups)
5. **Save screenshots** to `sketches/` folder

**Screenshot naming:**
- `{{page_slug}}-desktop.jpg` - Full desktop view
- `{{page_slug}}-mobile.jpg` - Mobile view
- `{{page_slug}}-section-name.jpg` - Section close-ups</output>

<ask>**Ready to capture screenshots?**

Once you've saved the screenshots, type "done" and I'll analyze them:

Status:</ask>

<action>Wait for user confirmation</action>

### SUBSTEP E4: ITERATE IF NEEDED

<ask>**How does the prototype look?**

[A] Perfect - I've captured screenshots
[B] Need adjustments - let me describe changes
[C] Completely different direction - let's revise

Choice:</ask>

<check if="choice == 'A'">
  <action>
  User should have screenshots in sketches/ folder
  Route to: workshop-page-process.md for analysis
  </action>
</check>

<check if="choice == 'B'">
  <ask>What changes are needed?</ask>
  <action>
  Update HTML prototype based on feedback
  Regenerate sections as needed
  Return to SUBSTEP E3 (view and capture)
  </action>
</check>

<check if="choice == 'C'">
  <action>Return to STEP 1: PAGE CONCEPT to redefine</action>
</check>

</check>

---

<check if="visualization_method == 'C'">

<output>**Let's create a simple ASCII layout together.**

⚠️ **Note:** ASCII is a last resort - sketches are much better for capturing design intent!

We'll create a basic box-and-text layout to show structure.</output>

<ask>**What are the main sections from top to bottom?**

Example:
- Header
- Hero
- Features (3 columns)
- CTA
- Footer

List sections:</ask>

<action>Store sections_for_ascii</action>

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

</check>

---

## FLOW D: REFERENCE PAGE

<check if="visualization_method == 'D'">

<ask>**Which page is this similar to?**

Provide:
- Page name or URL
- What file path (if internal project)
- Or description of reference page

Reference:</ask>

<action>Store reference_page</action>

<ask>**What are the KEY DIFFERENCES from the reference?**

What changes from the reference page?

Differences:</ask>

<action>Store differences</action>

<output>**Creating page based on reference...**</output>

<action>
If internal reference exists:
  1. Copy reference specification structure
  2. Update with differences
  3. Mark sections that need updates
  4. Preserve navigation pattern

If external reference:
  1. Describe reference structure
  2. Note differences
  3. Create conceptual specification
  4. Recommend creating sketch showing changes

Generate specification document
</action>

<output>✅ **Reference-based page specification created!**

**Based on:** {{reference_page}}

**Key differences noted:** {{differences}}

**Next steps:**
- Review generated specification
- Create sketch showing unique elements
- Run Page Process Workshop to refine

Ready?</output>

</check>

---

## COMPLETION

<output>**Page concept defined!** 🎯

**Page:** {{page_name}}
**Method:** {{visualization_method_description}}
**Status:** 
{{#if has_visualization}}
- ✅ Conceptual specification complete
- ⏳ Visualization pending
{{else}}
- ✅ Conceptual specification complete
- ✅ Visualization method defined
{{/if}}

**The page is the place where visualization meets specification.**

**What would you like to do next?**

[A] Create/upload sketch for this page
[B] Create another page
[C] Review what we've created
[D] Back to scenario overview

Choice:</output>

---

## KEY PHILOSOPHY

### ✅ **Page-Centric Thinking**

The **page** is the conceptual entity:
- Has a purpose
- Serves users
- Contains sections
- Has interactive objects
- Exists in a flow

The **visualization** is one representation:
- Sketch (preferred)
- Wireframe
- ASCII (last resort)
- Verbal description
- Reference to similar page

**The page comes first. Visualization follows.**

### ✅ **Flexible Methods**

Different projects need different approaches:
- Early concept → Verbal/ASCII → Sketch later
- Clear vision → Sketch directly
- Existing patterns → Reference + differences
- Iterative → Mix of methods

**The workshop adapts to YOUR process.**

---

## INTEGRATION

This workshop creates:
1. **Conceptual page specification** (always)
2. **Placeholder for visualization** (always)
3. **Guidance for next steps** (always)

Next workshops use:
- **workshop-page-process.md** - When sketch is ready
- **page-init-lightweight.md** - For quick structure
- **4b-sketch-analysis.md** - For detailed analysis

---

**Created:** December 28, 2025  
**Purpose:** Define page concept, choose visualization method  
**Philosophy:** Page first, visualization second  
**Status:** Ready for use

