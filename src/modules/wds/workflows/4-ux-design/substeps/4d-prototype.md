# Step 4D: HTML Prototype

<goal>Create interactive prototype to validate design before development</goal>

## Prototype Creation

<output>**Let's bring your specification to life!**

I'll create an interactive HTML prototype that:

- Matches your specification exactly
- Uses your Design System (if Phase 5 enabled)
- Includes interactions and validation
- Switches between languages
- Reveals gaps in the design

This is your chance to click through and test before development. 🎨</output>

<ask>**Prototype scope - what should it include?**

1. **Full interactive** - All interactions, validation, state changes
2. **Visual only** - Static design for visual review
3. **Specific features** - Focus on particular interactions

Choice [1/2/3]:</ask>

<action>Store prototype_scope</action>

## Generate Prototype Files

<action>Generate HTML prototype:

**File 1: HTML** ({page}-Prototype.html)

```html
<!DOCTYPE html>
<html lang="{{default_language}}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{page_title}} - Prototype</title>
    <link rel="stylesheet" href="{{page}}-Prototype.css" />
  </head>
  <body>
    <!-- Semantic HTML matching specification -->
    {{generate_html_from_spec}}

    <script src="{{page}}-Prototype.js"></script>
  </body>
</html>
```

**File 2: CSS** ({page}-Prototype.css)

```css
/* Design System tokens (if Phase 5 enabled) */
{{design_system_imports}}

/* Component styles matching specification */
{{generate_css_from_spec}}

/* Responsive styles */
{{responsive_styles}}

/* State styles */
{{state_styles}}
```

**File 3: JavaScript** ({page}-Prototype.js)

```javascript
// Interaction behaviors from specification
{
  {
    generate_interactions_from_spec;
  }
}

// Validation logic
{
  {
    validation_logic;
  }
}

// State management
{
  {
    state_management;
  }
}

// Language switching
{
  {
    language_switching;
  }
}

// Initialize
{
  {
    initialization_code;
  }
}
```

</action>

<action>Save files to {output_folder}/C-Scenarios/{scenario}/{page}/Prototype/</action>

<output>✅ **Prototype created!**

**Files:**

- `Prototype/{page}-Prototype.html`
- `Prototype/{page}-Prototype.css`
- `Prototype/{page}-Prototype.js`

**Open the HTML file in your browser to test!**

Try:

- Clicking all interactive elements
- Testing validation
- Switching languages
- Checking different screen sizes
- Looking for gaps or issues</output>

<ask>**After testing, what did you discover?**

Common findings:

- Visual adjustments needed
- Missing states or interactions
- Content that's too long/short
- Flow issues
- Component needs

Anything to fix or refine?</ask>

<check if="user_found_issues">
  <ask>Would you like to:
  1. **Update specification (4C)** - Fix the specs and regenerate prototype
  2. **Quick prototype fix** - Adjust prototype directly
  3. **Note for later** - Document but move forward

Choice [1/2/3]:</ask>

  <check if="choice == 1">
    <action>Return to Step 4C</action>
  </check>
  
  <check if="choice == 2">
    <ask>What changes?</ask>
    <action>Apply changes to prototype files</action>
    <output>Updated! Test again in your browser. 🔄</output>
  </check>
  
  <check if="choice == 3">
    <action>Document issues as "refinement-notes.md"</action>
  </check>
</check>

<check if="no_issues">
  <output>Perfect! Your prototype validates the design. ✨</output>
</check>

<output>**Prototype testing complete!**</output>

<ask>**Visual quality assessment:**

How does the prototype look visually?

1. **Polished** - Design system covers everything, looks great
2. **Needs refinement** - Works but looks basic, design system incomplete
3. **Minor tweaks** - Small CSS adjustments needed

Choice [1/2/3]:</ask>

<check if="choice == 2">
  <output>**Design Refinement Available**

Since your design system is incomplete, I can help refine the visual design using:

1. **Figma MCP** (Recommended) - Automated component extraction with Object ID preservation
2. **NanoBanana** (Alternative) - AI-powered sketch envisioning (outputs images or code, requires manual interpretation)

Which would you prefer?</output>

  <action>Analyze prototype components and identify gaps in design system</action>
  
  <output>I've analyzed the prototype and found:

**Components needing refinement:**
- {list components missing from design system}
- {list components with incomplete states/variants}

**Estimated refinement time:** {X} components × 15-30 min each = {Y} hours

This will extend your design system and improve all future prototypes.</output>

  <ask>Would you like me to:
  1. **Extract to Figma** - I'll inject these components for refinement
  2. **Continue as-is** - Functional prototype is sufficient for now
  
  Choice [1/2]:</ask>
  
  <check if="choice == 1">
    <action>Load and execute `workflows/5-design-system/figma-integration/prototype-to-figma-workflow.md` Phase 2</action>
    
    <output>**Injecting components to Figma...**

I'm using the MCP server to inject components directly into your Figma file.

Target page: {scenario-number}-{scenario-name} / {page-number}-{page-name}

{Show injection progress and results}

✓ All components injected successfully!

**Figma link:** {provide link}

**Next steps:**
1. Open Figma and refine the components
2. When finished, let me know and I'll read them back
3. I'll update the design system automatically
4. We can re-render the prototype with improvements

Take your time with the refinement. I'll be here when you're ready!</output>

    <ask>For now, would you like to:
    [C] Continue to PRD update (refine Figma later)
    [W] Wait here until Figma refinement is complete
    
    Choice [C/W]:</ask>
    
    <check if="choice == W">
      <output>I'll wait here. Let me know when you've finished refining in Figma.</output>
      <action>Pause workflow, wait for user notification</action>
      
      <ask>Have you finished refining the components in Figma? [Y/N]</ask>
      
      <check if="yes">
        <action>Execute Phase 4 of prototype-to-figma-workflow (read refined components)</action>
        <output>{Show design token extraction and design system updates}</output>
        
        <ask>Would you like me to re-render the prototype with the enhanced design system now? [Y/N]</ask>
        
        <check if="yes">
          <action>Re-render prototype with updated design system</action>
          <output>✓ Prototype re-rendered with enhanced design system!
          
The prototype now looks polished and professional. All components use the refined design tokens.</output>
        </check>
      </check>
    </check>
  </check>
</check>

<check if="choice == 3">
  <ask>What CSS adjustments are needed?</ask>
  <action>Apply quick CSS fixes to prototype</action>
  <output>Updated! Test again in your browser. 🔄</output>
</check>

<output>Your design is validated and ready for development. Time to extract the functional requirements we discovered. 📋</output>

<ask>Ready to proceed to **Step 4E: PRD Update**? [Y/N]</ask>

<check if="yes">
  <action>Proceed to Step 4E</action>
</check>

<check if="no">
  <output>No problem! Resume anytime with "continue scenario". 👍</output>
  <action>Save progress</action>
</check>

---

**Next:** Step 4E (PRD Update)
