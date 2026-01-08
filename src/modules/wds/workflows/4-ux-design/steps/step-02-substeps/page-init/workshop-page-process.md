# Page Process Workshop

**Purpose:** Intelligent sketch analysis with context detection - handles both new and updated sketches

---

## CONTEXT

**This workflow activates when:** User has a sketch/visualization ready to analyze.

**Intelligence:** Detects if this is a new page or update to existing specification.

**Behavior:** 
- New page → Full analysis
- Updated page → Change detection, incremental update
- Partial completion → Specify ready sections, mark TBD

---

## STEP 1: CONTEXT DETECTION

<action>
**Determine page context:**

1. Read current page specification (if exists)
2. Check for existing sketch versions
3. Identify project structure (scenarios, pages)
4. Store context information
</action>

<check if="!page_spec_exists">
  <output>**This is the first sketch for this page!**
  
  Let me analyze what you've drawn and create the initial specification.</output>
  
  <action>Route to: `substeps/4b-sketch-analysis.md` (existing workflow)</action>
</check>

<check if="page_spec_exists">
  <output>**I see we already have specifications for this page.**
  
  Let me compare this sketch to what we have...</output>
  
  <action>Proceed to STEP 2: Change Detection</action>
</check>

---

## STEP 2: CHANGE DETECTION (For Existing Pages)

<action>
**Compare new sketch to existing specifications:**

1. Load existing specification document
2. Identify which sections are already specified
3. Analyze new sketch for:
   - Unchanged sections
   - Modified sections
   - New sections added
   - Removed sections
   - TBD sections now complete
   - Complete sections now TBD

4. Calculate confidence for each comparison
</action>

<output>**Comparison Results:**

{{#if has_changes}}
🔍 **Changes detected:**

{{#if unchanged_sections.length > 0}}
✅ **Unchanged sections** ({{unchanged_sections.length}}):
{{#each section in unchanged_sections}}
- {{section.name}}
{{/each}}
{{/if}}

{{#if modified_sections.length > 0}}
✏️ **Modified sections** ({{modified_sections.length}}):
{{#each section in modified_sections}}
- {{section.name}}: {{section.change_description}}
{{/each}}
{{/if}}

{{#if new_sections.length > 0}}
➕ **New sections added** ({{new_sections.length}}):
{{#each section in new_sections}}
- {{section.name}}: {{section.description}}
{{/each}}
{{/if}}

{{#if completed_sections.length > 0}}
✨ **TBD sections now complete** ({{completed_sections.length}}):
{{#each section in completed_sections}}
- {{section.name}}: Ready to specify
{{/each}}
{{/if}}

{{#if removed_sections.length > 0}}
⚠️ **Sections removed** ({{removed_sections.length}}):
{{#each section in removed_sections}}
- {{section.name}}
{{/each}}
{{/if}}

{{else}}
✅ **No changes detected**

This sketch appears identical to the existing specification. Are you sure you wanted to upload a new version?
{{/if}}

</output>

---

## STEP 3: UPDATE STRATEGY

<check if="has_changes">

<ask>**How would you like to proceed?**

{{#if modified_sections.length > 0 or new_sections.length > 0 or completed_sections.length > 0}}
[A] Update all changed/new/completed sections
[B] Pick specific sections to update
[C] Show me detailed comparison first
[D] Actually, this is the same - cancel
{{else if removed_sections.length > 0}}
[A] Remove deleted sections from spec
[B] Keep them marked as "removed from design"
[C] Cancel - I'll fix the sketch
{{/if}}

Choice:</ask>

<action>Store user_choice</action>

</check>

---

## STEP 4A: UPDATE ALL (If user chose A)

<check if="user_choice == 'A'">

<output>**Updating all changed sections:**

I'll process:
{{#if modified_sections.length > 0}}
- {{modified_sections.length}} modified sections
{{/if}}
{{#if new_sections.length > 0}}
- {{new_sections.length}} new sections
{{/if}}
{{#if completed_sections.length > 0}}
- {{completed_sections.length}} completed sections
{{/if}}
{{#if removed_sections.length > 0}}
- {{removed_sections.length}} removed sections
{{/if}}

**Preserving:**
{{#each section in unchanged_sections}}
- {{section.name}}
{{/each}}

Ready to analyze sections?</output>

<action>
For each section in (modified_sections + new_sections + completed_sections):
  Run 4b-sketch-analysis.md workflow for that section only
  Update specification document
  Preserve unchanged sections
End
</action>

</check>

---

## STEP 4B: SELECTIVE UPDATE (If user chose B)

<check if="user_choice == 'B'">

<ask>**Which sections should I update?**

{{#each section in (modified_sections + new_sections + completed_sections)}}
[{{@index + 1}}] {{section.name}} - {{section.change_type}}
{{/each}}

Enter numbers separated by commas (e.g., 1,3,5):</ask>

<action>
Parse selected_sections
For each selected section:
  Run 4b-sketch-analysis.md workflow for that section
  Update specification document
End
</action>

</check>

---

## STEP 4C: DETAILED COMPARISON (If user chose C)

<check if="user_choice == 'C'">

<output>**Detailed Section-by-Section Comparison:**

{{#each section in modified_sections}}

---

### {{section.name}}

**Current specification:**
{{section.current_spec_summary}}

**New sketch shows:**
{{section.new_sketch_summary}}

**Detected changes:**
{{#each change in section.changes}}
- {{change.description}}
{{/each}}

**Confidence:** {{section.confidence}}%

---
{{/each}}

After reviewing, what would you like to do?

[A] Update all
[B] Pick specific sections
[C] Cancel</output>

<action>Return to STEP 3 with user's choice</action>

</check>

---

## STEP 5: COMPLETION

<output>✅ **Page specification updated!**

**Summary:**
{{#if updated_count > 0}}
- {{updated_count}} sections updated
{{/if}}
{{#if added_count > 0}}
- {{added_count}} sections added
{{/if}}
{{#if preserved_count > 0}}
- {{preserved_count}} sections preserved (unchanged)
{{/if}}
{{#if removed_count > 0}}
- {{removed_count}} sections removed
{{/if}}

**Updated file:** `{{page_spec_path}}`

**Sketch saved to:** `{{sketch_path}}`

**Next steps:**
- Review the updated specification
- Generate updated prototype (if needed)
- Continue to next page or scenario

Would you like to:
[A] Generate HTML prototype
[B] Add another page
[C] Update another section
[D] Done with this page

Choice:</output>

---

## ROUTING

<action>
Based on user choice:
- [A] → Load prototype generation workflow
- [B] → Return to page-init/step-01-page-context.md
- [C] → Return to STEP 3 (pick sections)
- [D] → Return to main UX design menu
</action>

---

## KEY FEATURES

### ✅ **Intelligent Context Detection**
- Automatically knows if new or update
- Compares sketches to existing specs
- Identifies unchanged sections

### ✅ **Incremental Updates**
- Only updates what changed
- Preserves existing work
- No data loss

### ✅ **Change Confidence**
- Shows confidence level per change
- Lets user verify before processing
- Reduces errors

### ✅ **Flexible Control**
- Update all or select specific
- See detailed comparison
- Cancel anytime

---

## INTEGRATION WITH EXISTING SYSTEM

This workshop uses:
- **4b-sketch-analysis.md** - For actual section analysis
- **SKETCH-TEXT-ANALYSIS-GUIDE.md** - For reading text markers
- **page-specification.template.md** - For document structure
- **object-types/*.md** - For component specifications

**It's a smart router that preserves your existing workflows!**

---

**Created:** December 28, 2025  
**For:** Iterative page specification workflow  
**Status:** Ready to test with WDS Presentation page

