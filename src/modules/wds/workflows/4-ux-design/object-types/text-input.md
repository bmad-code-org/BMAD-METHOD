# Object Type: Text Input

**Goal:** Document text input field with complete specification

---

## INPUT IDENTIFICATION

<output>**Documenting text input: {{input_description}}**</output>

---

## OBJECT ID

<action>Generate Object ID using format:
`{page}-{section}-{field}-input`

Example: `signin-form-email-input`
</action>

<output>**Object ID:** `{{generated_object_id}}`</output>

---

## INPUT TYPE

<ask>**What type of text input is this?**

1. **Text** - General text (name, title, etc.)
2. **Email** - Email address
3. **Password** - Password (masked)
4. **Tel** - Phone number
5. **URL** - Website address
6. **Search** - Search query
7. **Number** - Numeric input
8. **Date** - Date picker
9. **Textarea** - Multi-line text

Choice [1-9]:</ask>

<action>Store input_type</action>

---

## DESIGN SYSTEM COMPONENT

{{#if design_system_enabled}}
<ask>**Design System component:**

1. **Use existing component** - From your component library
2. **Create new component** - Add this to the Design System
3. **Page-specific only** - Not a reusable component

Choice [1/2/3]:</ask>

<check if="choice == 1">
  <ask>**Which existing component?**

From your component library:
{{list_available_input_components}}

Component name:</ask>

<action>Store design_system_component</action>
<action>Store component_status = "existing"</action>
</check>

<check if="choice == 2">
  <ask>**New component name:**
  
  Suggested: `Input-{{input_type}}`
  
  Component name:</ask>
  
  <action>Store design_system_component</action>
  <action>Store component_status = "new"</action>
  <action>Mark for Design System addition in Phase 5</action>
  
  <output>✅ This input will be added to your Design System in Phase 5.</output>
</check>

<check if="choice == 3">
  <action>Store component_status = "page-specific"</action>
</check>
{{else}}
<action>Store component_status = "page-specific"</action>
{{/if}}

---

## INPUT CONTENT

<ask>**Label text in all languages:**

{{#each language}}

- **{{language}}:**
  {{/each}}
  </ask>

<action>Store label_text for each language</action>

<ask>**Placeholder text in all languages:**

{{#each language}}

- **{{language}}:**
  {{/each}}
  </ask>

<action>Store placeholder_text for each language</action>

<ask>**Helper text** (optional guidance below field):

{{#each language}}

- **{{language}}:**
  {{/each}}
  </ask>

<action>Store helper_text for each language</action>

---

## INPUT PROPERTIES

<ask>**Input properties:**

- Required field: yes/no
- Max length: (number or "none")
- Min length: (number or "none")
- Autocomplete: (on/off/specific type like "email")
- Autofocus: yes/no
- Readonly: yes/no
  </ask>

<action>Store input_properties</action>

---

## INPUT STATES

<output>**Let's define all input states.**</output>

<ask>**For each state, describe the appearance:**

**Default/Empty state:**

- Border color:
- Background:
- Placeholder visible: yes
- Label position:

**Focus state:**

- Border color:
- Background:
- Label position: (stays/floats above)
- Outline/glow:

**Filled state:**

- Border color:
- Background:
- Label position:

**Error state:**

- Border color:
- Background:
- Error message position: (below/inline)
- Icon: (if any)

**Disabled state:**

- Border color:
- Background:
- Text color:
- Cursor:
- Why disabled:

**Success state** (if applicable):

- Border color:
- Icon: (checkmark, etc.)
- When shown:
  </ask>

<action>Store state definitions for all states</action>

---

## VALIDATION RULES

<ask>**Validation rules for this input:**

**Required:**

- Is this field required: yes/no

**Format validation:**

- Format rules: (e.g., "must be valid email", "must contain @")
- Pattern/regex: (if applicable)

**Length validation:**

- Minimum length:
- Maximum length:

**Custom rules:**

- Any custom validation:

**Validation timing:**

- When to validate: on_blur / on_input / on_submit
  </ask>

<action>Store validation_rules</action>

---

## ERROR MESSAGES

<ask>**Error messages for validation failures:**

{{#each validation_rule}}
**When {{rule_name}} fails:**

Error code: (e.g., ERR_EMAIL_REQUIRED)

{{#each language}}

- **{{language}}:**
  {{/each}}
  {{/each}}
  </ask>

<action>Store error_messages with codes and translations</action>

---

## INPUT INTERACTION

<ask>**Interaction behaviors:**

**On focus:**

- What happens:

**On input (while typing):**

- Real-time validation: yes/no
- Character counter: yes/no
- Auto-formatting: yes/no (e.g., phone numbers)
- Other behaviors:

**On blur (loses focus):**

- Validation triggers: yes/no
- Save/update: yes/no
- Other behaviors:
  </ask>

<action>Store interaction_behaviors</action>

---

## GENERATE INPUT SPECIFICATION

<action>Generate input specification using format:

```markdown
### {{input_name}}

**Object ID:** `{{object_id}}`
**Type:** {{input_type}}
{{#if design_system_enabled}}
**Design System Component:** {{design_system_component}}
**Figma Component:** {{figma_component_name}}
{{/if}}

**Label:**
{{#each language}}

- **{{language}}:** {{label_text}}
  {{/each}}

**Placeholder:**
{{#each language}}

- **{{language}}:** {{placeholder_text}}
  {{/each}}

{{#if has_helper_text}}
**Helper Text:**
{{#each language}}

- **{{language}}:** {{helper_text}}
  {{/each}}
  {{/if}}

**Properties:**

- Required: {{is_required}}
- Max length: {{max_length}}
- Min length: {{min_length}}
- Autocomplete: {{autocomplete}}
- Autofocus: {{autofocus}}

**States:**

_Default:_

- Border: {{default_border}}
- Background: {{default_bg}}
- Label: {{label_position}}

_Focus:_

- Border: {{focus_border}}
- Label: {{focus_label_position}}
- Outline: {{focus_outline}}

_Filled:_

- Border: {{filled_border}}
- Label: {{filled_label_position}}

_Error:_

- Border: {{error_border}}
- Icon: {{error_icon}}
- Message: Below field

_Disabled:_

- Border: {{disabled_border}}
- Background: {{disabled_bg}}
- Cursor: not-allowed

**Validation:**
{{#each validation_rule}}

- {{rule_description}}
  {{/each}}

**Error Messages:**
{{#each error}}

- **{{error_code}}:** {{error_messages}}
  {{/each}}

**Interactions:**

- **On Focus:** {{focus_behavior}}
- **On Input:** {{input_behavior}}
- **On Blur:** {{blur_behavior}}
```

</action>

<output>✅ **Input field documented!**

Specification added to page document.</output>

---

## EXAMPLE OUTPUT

```markdown
### Email Input Field

**Object ID:** `signin-form-email-input`
**Type:** email
**Design System Component:** text-input
**Figma Component:** Input/Text/Medium

**Label:**

- **English:** Email Address
- **Swedish:** E-postadress

**Placeholder:**

- **English:** your@email.com
- **Swedish:** din@epost.com

**Helper Text:**

- **English:** We'll never share your email
- **Swedish:** Vi delar aldrig din e-post

**Properties:**

- Required: yes
- Max length: 254
- Min length: 5
- Autocomplete: email
- Autofocus: yes

**States:**

_Default:_

- Border: 1px solid #CCCCCC
- Background: #FFFFFF
- Label: Inside field (placeholder position)

_Focus:_

- Border: 2px solid #0066CC (primary)
- Label: Floats above field
- Outline: 0 0 0 3px rgba(0,102,204,0.1)

_Filled:_

- Border: 1px solid #666666
- Label: Remains above field

_Error:_

- Border: 2px solid #DC2626 (red)
- Icon: ⚠️ (warning icon, right side)
- Message: Below field in red

_Disabled:_

- Border: 1px solid #E5E5E5
- Background: #F5F5F5
- Cursor: not-allowed
- Text: #999999

**Validation:**

- Required field (cannot be empty)
- Must contain @ symbol
- Must have valid domain
- Must match email format pattern

**Error Messages:**

- **ERR_EMAIL_REQUIRED:**
  - EN: "Email address is required"
  - SV: "E-postadress krävs"
- **ERR_EMAIL_INVALID:**
  - EN: "Please enter a valid email address"
  - SV: "Ange en giltig e-postadress"
- **ERR_EMAIL_DOMAIN:**
  - EN: "Email domain appears invalid"
  - SV: "E-postdomän verkar ogiltig"

**Interactions:**

- **On Focus:** Border changes to primary color, label floats up with animation (200ms ease-out)
- **On Input:** Real-time validation (debounced 300ms), @ symbol triggers domain validation
- **On Blur:** Full validation runs, error message displays if invalid, save to form state
```

---

**Return to 4c-03 to continue with next object**
