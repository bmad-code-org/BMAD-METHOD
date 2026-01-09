# Step 4: Generate & Validate

**Progress: Step 4 of 5** - Next: Execute Export

**Duration:** 5-10 minutes

---

## YOUR TASK

Generate Figma-compatible HTML with proper OBJECT IDs and validate before export.

---

## GOAL

Create clean, validated HTML that will render correctly in Figma with proper layer naming.

---

## EXECUTION

### Generate HTML Structure

<action>
Generate HTML with OBJECT IDs from specifications:

1. Create root container with export name
2. Add state/variant containers for each component
3. Apply OBJECT IDs from specification mapping
4. Include state labels for clarity
5. Add proper semantic HTML tags
</action>

**HTML Structure Template:**
```html
<div id="{scenario-name}-export">
  <style>
    @import url('https://fonts.googleapis.com/css2?family={Font}');
    /* Component styles with hex colors, px values */
  </style>
  
  <div id="{component}-{state}-container">
    <div class="state-label">{State Name}</div>
    <{tag} id="{object-id}" class="{css-class}">
      {content}
    </{tag}>
  </div>
</div>
```

---

### Apply Styling Requirements

<action>
Convert code styles to Figma-compatible CSS:

✅ Fonts:
  - Use Google Fonts only
  - Import in <style> block

✅ Colors:
  - Convert CSS variables to hex values
  - var(--brown-dark) → #2F1A0C
  - var(--cream-light) → #FEF3CF

✅ Spacing:
  - Convert rem/em to pixels
  - 1.5rem → 24px
  - 2em → 32px

✅ Layout:
  - Use inline styles or <style> block
  - Simple flexbox/grid only
  - Avoid complex positioning
</action>

---

### Validation Checks

<output>Running pre-export validation...</output>

<action>
Validate generated HTML:

1. ✅ Specification Coverage
   - All components have OBJECT IDs
   - IDs match specification exactly
   - No duplicate IDs

2. ✅ ID Naming Convention
   - IDs follow project pattern
   - Consistent naming across export
   - State suffixes applied correctly

3. ✅ HTML Structure
   - Semantic HTML tags used
   - Proper element hierarchy
   - Container elements present

4. ✅ Styling Compatibility
   - Google Fonts used
   - Hex colors (no CSS variables)
   - Pixel values (no rem/em)
   - Clean, minimal markup

5. ✅ Content Completeness
   - Text matches specifications
   - No placeholder content
   - Language variations included (if applicable)
</action>

---

### Validation Report

<output>✅ Pre-Export Validation Report

📋 Specification Coverage:
  ✅ {count} components with OBJECT IDs
  ✅ 100% coverage achieved

🔍 ID Validation:
  ✅ No duplicate IDs found
  ✅ Naming convention followed
  ✅ {count} unique IDs ready

🏗️ Structure Validation:
  ✅ Semantic HTML used
  ✅ Proper element hierarchy

🎨 Styling Validation:
  ✅ Google Fonts configured
  ✅ Hex colors used
  ✅ Pixel spacing values
  ✅ Figma-compatible CSS

📝 Content Validation:
  ✅ Specification content matched
  ✅ No placeholder text

⚠️ Warnings: {count}
{list of non-blocking warnings}

❌ Errors: {count}
{list of blocking errors}

Ready to proceed to export? (Yes/No)</output>

<ask>Proceed with export? [Yes/Fix Errors/Cancel]:</ask>

---

### Handle Validation Failures

**If errors found:**

<output>❌ Validation Errors Must Be Resolved

Error Type: {error-type}
Affected Components: {list}

Would you like me to:
1. Auto-fix errors (if possible)
2. Guide you through manual fixes
3. Skip problematic components
4. Cancel export</output>

**Auto-fix capabilities:**
- Convert CSS variables to hex
- Convert rem/em to pixels
- Add missing IDs based on class names
- Fix duplicate IDs with suffixes

**Manual fix required:**
- Semantic HTML structure issues
- Missing specification content
- Complex CSS incompatible with Figma

---

## NEXT STEP

Once validation passes:

**→ Proceed to [Step 5: Execute Export](./step-05-execute-export.md)**

---

## OUTPUT AT THIS POINT

You now have:
- ✅ MCP connection verified
- ✅ Export scenario identified
- ✅ OBJECT IDs assigned
- ✅ HTML generated with proper IDs
- ✅ Validation completed successfully

Still need:
- ⏸️ Final export executed
- ⏸️ Export verified in Figma

---

*Step 4 complete - Ready to export*
