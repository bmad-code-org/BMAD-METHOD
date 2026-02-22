# Page Process Workshop Templates

Templates for comparison output and change detection displays.

---

## Change Detection Output Template

```handlebars
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

This sketch appears identical to the existing specification.
{{/if}}
```

---

## Detailed Comparison Template

```handlebars
**Detailed Section-by-Section Comparison:**

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
```

---

## Update Summary Template

```handlebars
✅ **Page specification updated!**

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
```

---

## Menu Options

**Update Strategy Menu (with changes):**
- [A] Update all changed/new/completed sections
- [B] Pick specific sections to update
- [C] Show me detailed comparison first
- [D] Actually, this is the same - cancel

**Update Strategy Menu (only removals):**
- [A] Remove deleted sections from spec
- [B] Keep them marked as "removed from design"
- [C] Cancel - I'll fix the sketch

**Completion Menu:**
- [A] Generate HTML prototype
- [B] Add another page
- [C] Update another section
- [D] Done with this page
