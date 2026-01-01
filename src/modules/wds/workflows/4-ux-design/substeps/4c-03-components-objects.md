# Substep 4C-03: Components & Object IDs

**Goal:** Identify all interactive elements, route to object-specific instructions, and assign Object IDs

---

## EXECUTION

<output>**Let's identify and document every component systematically.**

We'll work through each section, going **top-to-bottom, left-to-right** within each section, documenting each object using specialized instructions.</output>

---

## FOR EACH SECTION

<action>For each section identified in 4C-02:

<output>**Section: {{section_name}}**

Starting from top-left corner of this section...</output>

## FOR EACH OBJECT IN SECTION

<action>Loop through objects in section (top-to-bottom, left-to-right):

<output>**Next object in {{section_name}}:**</output>

<ask>What is the first/next object in this section (from top-left)?

Describe what you see:</ask>

<action>Store object_description</action>

### ROUTE TO OBJECT-TYPE INSTRUCTIONS

<action>Load and execute `object-types/object-router.md`</action>

<action>Object-router will: 1. Ask user to identify object type 2. Load appropriate object-type instruction file 3. Guide through complete object documentation 4. Generate specification with Object ID 5. Return here when complete
</action>

### DESIGN SYSTEM CHECK (IF ENABLED)

<action>After component specification complete: 1. Check project config: Is design system enabled? 2. If YES: Load and execute `workflows/5-design-system/design-system-router.md` 3. Design system router will: - Check for similar components - Run opportunity/risk assessment if needed - Extract component-level info to design system - Return component reference - Update page spec with reference 4. If NO: Keep complete specification on page 5. Continue to next object
</action>

<ask>**More objects in {{section_name}}?**

1. **Yes** - Document next object (move right, then down)
2. **No** - Section complete

Choice [1/2]:</ask>

  <check if="choice == 1">
    <action>Loop back to document next object in section</action>
  </check>
  
  <check if="choice == 2">
    <output>✅ **Section {{section_name}} complete!**</output>
    <action>Move to next section</action>
  </check>

</action>

</action>

---

## ALL SECTIONS COMPLETE

<output>✅ **All components identified and documented!**

**Summary:**

- **Sections processed:** {{section_count}}
- **Total components:** {{component_count}}
- **Components by type:**
  {{#each component_type}}
  - {{type_name}}: {{count}}
    {{/each}}

**Object IDs assigned:**
{{#each component}}

- `{{object_id}}` ({{component_type}})
  {{/each}}

**Next:** We'll specify the content and languages.</output>

---

## MENU

<ask>[C] Continue to 4C-04 (Content & Languages)</ask>

---

## WORKFLOW NOTES

**This substep uses object-type routing:**

1. For each object, user identifies the type
2. System loads specialized instruction file (button.md, text-input.md, etc.)
3. Each instruction file has:
   - Precise questions for that object type
   - Complete example outputs
   - Consistent format across all WDS projects
4. After documentation, control returns here
5. Continue until all objects in all sections are documented

**Benefits:**

- ✅ Consistent specifications across all WDS projects
- ✅ Agents have clear, focused instructions for each object type
- ✅ Example-driven (show, don't tell)
- ✅ Systematic coverage (nothing missed)
- ✅ Reusable patterns across repositories

---

## EXAMPLE COMPONENT REGISTRY

```yaml
sections_processed:
  - signin-form:
      components:
        - object_id: 'signin-form-email-input'
          type: 'text-input'
          documented_via: 'object-types/text-input.md'

        - object_id: 'signin-form-password-input'
          type: 'text-input'
          documented_via: 'object-types/text-input.md'

        - object_id: 'signin-form-submit-button'
          type: 'button'
          documented_via: 'object-types/button.md'

        - object_id: 'signin-form-forgot-link'
          type: 'link'
          documented_via: 'object-types/link.md'

total_components: 4
component_types:
  text-input: 2
  button: 1
  link: 1
```

---

## NEXT STEP

Load `substeps/4c-04-content-languages.md`
