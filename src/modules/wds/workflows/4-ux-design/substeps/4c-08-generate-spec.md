# Substep 4C-08: Generate Specification Document

**Goal:** Compile all gathered information into the complete specification

---

## EXECUTION

<output>**Excellent! We've gathered everything we need.**

Now I'll compile it all into your complete page specification. 📝</output>

<action>Generate specification document using template at `templates/page-specification.template.md`

Fill in all sections with data collected:

- page_basics (from 4C-01)
- layout_sections (from 4C-02)
- components with object_ids (from 4C-03)
- multilingual_content (from 4C-04)
- interaction_behaviors (from 4C-05)
- page_states and component_states (from 4C-06)
- validation_rules and error_messages (from 4C-07)
  </action>

<action>Save complete specification to:
`{output_folder}/C-Scenarios/{scenario}/{page}/{page}.md`
</action>

<output>✅ **Complete specification generated!**

**Saved to:** `C-Scenarios/{scenario}/{page}/{page}.md`

**What we documented:**

- Page basics and routing
- {{section_count}} layout sections
- {{component_count}} components with Object IDs
- Content in {{language_count}} languages
- {{interaction_count}} interaction behaviors
- {{state_count}} total states (page + component)
- {{validation_count}} validation rules
- {{error_count}} error messages

**Your specification is development-ready!** 📋✨

The specification document includes:

- Clear Object IDs for every element
- Complete multilingual content
- Detailed interaction behaviors
- All possible states defined
- Validation rules and error messages
- Technical notes and data requirements</output>

---

## SPECIFICATION COMPLETE

Substep 4C is now complete. Return control to Step 3 (step-03-design-page.md) which will proceed to Substep 4D (Prototype).

---

## EXAMPLE SPECIFICATION SNIPPET

```markdown
### Email Input Field

**Object ID:** `signin-form-email-input`
**Component Type:** text-input
**Design System Component:** text-input (primary)

**Content:**

- **Label (EN):** Email Address
- **Label (SV):** E-postadress
- **Placeholder (EN):** your@email.com
- **Placeholder (SV):** din@epost.com

**States:**

- **Default:** Gray border, placeholder visible
- **Focus:** Primary color border, label floats above
- **Filled:** Dark border, label remains above
- **Error:** Red border, error message below
- **Disabled:** Light gray background, not interactive

**Interactions:**

- **On Focus:** Highlight border, float label
- **On Input:** Real-time email format validation
- **On Blur:** Full validation, show error if invalid

**Validation:**

- Required: Yes
- Format: Valid email (contains @, has domain)
- Error Code: ERR_EMAIL_INVALID
- Error Message (EN): "Please enter a valid email address"
- Error Message (SV): "Ange en giltig e-postadress"
```

---

**Substep 4C Complete!** Return to main page design flow.
