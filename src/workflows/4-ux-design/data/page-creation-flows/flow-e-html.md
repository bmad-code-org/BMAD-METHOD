# Flow E: Generate HTML Prototype

**Activates when:** User chooses to generate HTML and screenshot it

---

## Introduction

<output>**Perfect! Let's generate an HTML prototype based on your concept.**

This creates a working page that you can:
- View in browser
- Screenshot for documentation
- Test responsive behavior
- Use as starting point for development

The screenshot becomes your "sketch" for the specification.</output>

---

## Benefits

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

## SUBSTEP E1: Define Basic Structure

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

---

## SUBSTEP E2: Generate HTML

<action>
**Generate HTML prototype:**

1. Create semantic HTML structure for each section
2. Add Tailwind CSS classes (or vanilla CSS)
3. Include placeholder content from user's descriptions
4. Add interactive elements with proper attributes
5. Make responsive (mobile-first)
6. Include basic states (hover, focus, etc.)

File: `prototypes/{{page_slug}}-prototype.html`

Save to: `C-UX-Scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/prototypes/`
</action>

---

## SUBSTEP E3: View and Capture

<output>**Prototype generated!** 🎉

**File location:**
`C-UX-Scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/prototypes/{{page_slug}}-prototype.html`

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

---

## SUBSTEP E4: Iterate If Needed

<ask>**How does the prototype look?**

[A] Perfect - I've captured screenshots
[B] Need adjustments - let me describe changes
[C] Completely different direction - let's revise

Choice:</ask>

**If A:** Route to `workshop-page-process.md` for analysis
**If B:** Update HTML based on feedback, return to E3
**If C:** Return to main workshop STEP 1 to redefine concept
