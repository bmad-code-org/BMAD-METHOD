# Object Type: Link

**Goal:** Document link/anchor element with complete specification

---

## LINK IDENTIFICATION

<output>**Documenting link: {{link_description}}**</output>

---

## OBJECT ID

<action>Generate Object ID: `{page}-{section}-{element}-link`

Example: `signin-form-forgot-link`
</action>

---

## LINK TYPE

<ask>**What type of link?**

1. **Internal** - Same app navigation
2. **External** - External website (opens new tab)
3. **Email** - mailto: link
4. **Phone** - tel: link
5. **Download** - File download

Choice [1-5]:</ask>

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
{{list_available_link_components}}

Component name:</ask>

<action>Store design_system_component</action>
<action>Store component_status = "existing"</action>
</check>

<check if="choice == 2">
  <ask>**New component name:**
  
  Suggested: `Link-{{link_type}}` or `Link-{{style_variant}}`
  
  Component name:</ask>
  
  <action>Store design_system_component</action>
  <action>Store component_status = "new"</action>
  <action>Mark for Design System addition in Phase 5</action>
  
  <output>✅ This link style will be added to your Design System in Phase 5.</output>
</check>

<check if="choice == 3">
  <action>Store component_status = "page-specific"</action>
</check>
{{else}}
<action>Store component_status = "page-specific"</action>
{{/if}}

---

## LINK CONTENT & TARGET

<ask>**Link text in all languages:**

{{#each language}}

- **{{language}}:**
  {{/each}}

**Target/Destination:**

- URL or route:
- Opens in: same tab / new tab
  </ask>

---

## LINK STATES & STYLING

<ask>**Visual styling:**

**Default:**

- Text color:
- Text decoration: (underline/none)
- Font weight:
- Icon: (if any)

**Hover:**

- Text color:
- Text decoration:
- Cursor:

**Active/Visited:**

- Text color:
- Show as visited: yes/no

**Focus:**

- Outline color:
- Text decoration:
  </ask>

---

## GENERATE SPECIFICATION

```markdown
### {{link_name}}

**Object ID:** `{{object_id}}`
**Type:** {{link_type}}
**Destination:** {{target_url}}
**Opens:** {{same_or_new_tab}}

**Content:**
{{#each language}}

- **{{language}}:** {{link_text}}
  {{/each}}

{{#if has_icon}}
**Icon:** {{icon_name}} ({{icon_position}})
{{/if}}

**States:**

- **Default:** {{default_color}}, {{default_decoration}}
- **Hover:** {{hover_color}}, {{hover_decoration}}
- **Active:** {{active_color}}
- **Focus:** Outline {{focus_outline}}

**Interaction:**

- On click: Navigate to {{destination}}
  {{#if opens_new_tab}}
- Opens in new tab
- Includes rel="noopener noreferrer"
  {{/if}}
```

---

**Return to 4c-03**
