# Step 8: Create Page Structure

---

<action>
**Determine page folder path:**

**For single page projects (no scenarios):**
- Page path: `4-scenarios/{{page_slug}}/`

**For scenario-based projects:**
- Read scenario_number from context
- Read current_page_index from `scenario-tracking.yaml`
- Calculate page_number: `{{scenario_number}}.{{current_page_index + 1}}`
- Page path: `4-scenarios/{{scenario_number}}-{{scenario-slug}}/{{page_number}}-{{page_slug}}/`

Store page_path and page_number
</action>

<action>
**Create physical folder structure:**

1. Create page directory: `{{page_path}}`
2. Create sketches subdirectory: `{{page_path}}sketches/`
3. If has_variants and variant_count > 1:
   - Create variant subdirectories:
     - `{{page_path}}variant-a/sketches/`
     - `{{page_path}}variant-b/sketches/`
     - (etc. for each variant)

**Generate page specification document:**

File: `{{page_path}}{{page_number}}-{{page_slug}}.md`

Content:
```markdown
# {{page_number}} {{page_name}}

{{#if scenario_name}}
**Scenario:** {{scenario_name}}  
{{/if}}
**Page Number:** {{page_number}}  
**Created:** {{date}}  
**Method:** Whiteport Design Studio (WDS)

---

## Overview

**Page Purpose:** {{page_purpose}}

**Entry Points:**
- {{entry_point}}

**User Mental State:**
{{mental_state}}

**Main User Goal:** {{user_goal}}

**Business Goal:** {{business_goal}}

**URL/Route:** [To be determined]

---

{{#if scenario_name}}
## Journey Context

{{#if total_pages}}
This is **page {{current_page_index + 1}} of {{total_pages}}** in the "{{scenario_name}}" scenario.
{{/if}}

{{#if next_page}}
**Next Page:** {{next_page}}
{{/if}}

{{#if scenario_goal}}
**Scenario Goal:** {{scenario_goal}}
{{/if}}

---
{{/if}}

## Design Sections

[To be filled during sketch analysis and specification]

---

## Next Steps

1. Add sketches to `sketches/` folder
2. Run substep 4B (Sketch Analysis) to analyze sketches
3. Continue with substep 4C (Specification) to complete full details
4. Generate prototype (substep 4D)
5. Extract requirements (substep 4E)

---

_This starter document was generated from the page initialization workshop. Complete the full specification using the 4A-4E design process._
```

**Update scenario-tracking.yaml (if applicable):**

If this is a scenario-based project:
- Update current_page_index: increment by 1
- Update page status in pages_list
</action>

<output>✅ **Page structure created:**

**Page:** {{page_number}} {{page_name}}

**Folder:**
- `{{page_path}}`

**Purpose:** {{page_purpose}}

{{#if has_variants}}
**Variants:** {{variant_count}}
{{/if}}

**Next Steps:**
- Add sketches to the sketches folder
- Continue with page design (Step 3)

Ready to design! 🎨</output>

---

<output>[C] Continue to Step 3 (Page Design)
[A] Add Another Page
[S] Add Another Scenario (if multi-scenario project)</output>

<action>
- If user selects [C], load `steps/step-03-design-page.md`
- If user selects [A], reload `step-02-substeps/page-init/step-01-page-context.md`
- If user selects [S], load `step-02-substeps/scenario-init/step-01-core-feature.md`
</action>


