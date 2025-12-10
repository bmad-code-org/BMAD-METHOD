# Object Type: Button

**Goal:** Document button component with complete specification

---

## BUTTON IDENTIFICATION

<output>**Documenting button: {{button_description}}**</output>

---

## OBJECT ID

<action>Generate Object ID using format:
`{page}-{section}-{element}-button`

Example: `signin-form-submit-button`
</action>

<output>**Object ID:** `{{generated_object_id}}`</output>

---

## BUTTON TYPE

<ask>**What type of button is this?**

1. **Primary** - Main action (e.g., Submit, Save, Continue)
2. **Secondary** - Alternative action (e.g., Cancel, Back)
3. **Tertiary/Text** - Low priority (e.g., Skip, Learn More)
4. **Destructive** - Dangerous action (e.g., Delete, Remove)
5. **Icon Button** - Icon only, no text
6. **Link Button** - Styled as button but navigates

Choice [1-6]:</ask>

<action>Store button_type</action>

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
{{list_available_button_components}}

Component name:</ask>

<action>Store design_system_component</action>
<action>Store component_status = "existing"</action>
</check>

<check if="choice == 2">
  <ask>**New component name:**
  
  Suggested: `Button-{{button_type}}`
  
  Component name:</ask>
  
  <action>Store design_system_component</action>
  <action>Store component_status = "new"</action>
  <action>Mark for Design System addition in Phase 5</action>
  
  <output>✅ This button will be added to your Design System in Phase 5.</output>
</check>

<check if="choice == 3">
  <action>Store component_status = "page-specific"</action>
</check>
{{else}}
<action>Store component_status = "page-specific"</action>
{{/if}}

---

## BUTTON CONTENT

<ask>**Button text in all languages:**

{{#each language}}

- **{{language}}:**
  {{/each}}
  </ask>

<action>Store button_text for each language</action>

<ask>**Does the button have an icon?**

1. Yes - Icon before text
2. Yes - Icon after text
3. Yes - Icon only (no text)
4. No - Text only

Choice [1-4]:</ask>

<check if="has_icon">
  <ask>**Icon name/type:** (e.g., arrow-right, check, trash)</ask>
  <action>Store icon_name and icon_position</action>
</check>

---

## BUTTON STATES

<output>**Let's define all button states.**</output>

<ask>**For each state, describe the appearance:**

**Default state:**

- Background color:
- Text color:
- Border:

**Hover state:**

- Background color:
- Text color:
- Border:
- Other changes (shadow, scale, etc.):

**Active/Pressed state:**

- Background color:
- Text color:
- Visual feedback:

**Disabled state:**

- Background color:
- Text color:
- Cursor:
- Why disabled:

**Loading state** (if applicable):

- Show spinner: yes/no
- Loading text (in all languages):
- Disable other actions: yes/no
  </ask>

<action>Store state definitions for all states</action>

---

## BUTTON INTERACTION

<ask>**What happens when user clicks this button?**

Describe the complete flow:

1. User clicks...
2. Button changes to... (state)
3. System does... (action/API call)
4. If success...
5. If error...
6. User sees... (result)
7. Navigate to... (if applicable)
   </ask>

<action>Store interaction_flow</action>

---

## VALIDATION & REQUIREMENTS

<ask>**Any requirements before button can be clicked?**

- Form validation needed: yes/no
- Required fields must be filled: yes/no
- User must be authenticated: yes/no
- Other prerequisites:
  </ask>

<action>Store prerequisites</action>

---

## GENERATE BUTTON SPECIFICATION

<action>Generate button specification using format:

```markdown
### {{button_name}}

**Object ID:** `{{object_id}}`
**Type:** {{button_type}}
{{#if design_system_enabled}}
**Design System Component:** {{design_system_component}}
**Figma Component:** {{figma_component_name}}
{{/if}}

**Content:**
{{#each language}}

- **{{language}}:** {{button_text}}
  {{/each}}

{{#if has_icon}}
**Icon:** {{icon_name}} ({{icon_position}})
{{/if}}

**States:**

_Default:_

- Background: {{default_bg}}
- Text: {{default_text}}
- Border: {{default_border}}

_Hover:_

- Background: {{hover_bg}}
- Text: {{hover_text}}
- Changes: {{hover_changes}}

_Active:_

- Background: {{active_bg}}
- Text: {{active_text}}
- Feedback: {{active_feedback}}

_Disabled:_

- Background: {{disabled_bg}}
- Text: {{disabled_text}}
- Cursor: not-allowed
- When: {{disabled_condition}}

{{#if has_loading_state}}
_Loading:_

- Spinner: visible
- Text: {{loading_text}}
- Actions: disabled
  {{/if}}

**Interaction:**

1. {{interaction_step_1}}
2. {{interaction_step_2}}
   ...

{{#if has_prerequisites}}
**Requirements:**

- {{prerequisite_list}}
  {{/if}}
```

</action>

<output>✅ **Button documented!**

Specification added to page document.</output>

---

## EXAMPLE OUTPUT

```markdown
### Submit Button

**Object ID:** `signin-form-submit-button`
**Type:** Primary
**Design System Component:** primary-button-large
**Figma Component:** Button/Primary/Large

**Content:**

- **English:** Sign In
- **Swedish:** Logga In

**Icon:** None

**States:**

_Default:_

- Background: #0066CC (primary blue)
- Text: #FFFFFF (white)
- Border: none
- Border-radius: 8px
- Padding: 12px 24px

_Hover:_

- Background: #0052A3 (darker blue)
- Text: #FFFFFF
- Changes: slight shadow (0 2px 8px rgba(0,0,0,0.15))

_Active:_

- Background: #003D7A (even darker)
- Text: #FFFFFF
- Feedback: scale(0.98), shadow removed

_Disabled:_

- Background: #CCCCCC (gray)
- Text: #666666 (dark gray)
- Opacity: 0.6
- Cursor: not-allowed
- When: Form validation fails or during submission

_Loading:_

- Spinner: visible (white, 16px)
- Text (EN): "Signing in..."
- Text (SV): "Loggar in..."
- Actions: All form interactions disabled

**Interaction:**

1. User clicks button
2. Button enters loading state (spinner shows)
3. Validate all form fields
4. If validation fails: show field errors, exit loading
5. If validation passes: POST to /api/auth/signin
6. On API success: redirect to /dashboard
7. On API error: show error message above form, exit loading state

**Requirements:**

- Email field must contain valid email
- Password field must not be empty
- No existing submission in progress
```

---

**Return to 4c-03 to continue with next object**
