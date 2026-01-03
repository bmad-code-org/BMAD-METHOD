# Object Type: Image

**Goal:** Document image element with complete specification

---

## IMAGE IDENTIFICATION

<output>**Documenting image: {{image_description}}**</output>

---

## OBJECT ID

<action>Generate Object ID: `{page}-{section}-{element}-image`

Example: `landing-hero-illustration-image`
</action>

---

## DESIGN SYSTEM COMPONENT

{{#if design_system_enabled}}
<ask>**Design System component:**

1. **Use existing pattern** - From your Design System
2. **Create new pattern** - Add this image pattern to the Design System
3. **Page-specific only** - Not a reusable pattern

Choice [1/2/3]:</ask>

<check if="choice == 1">
  <ask>**Which existing image pattern?**

From your Design System:
{{list_available_image_patterns}}

Component name:</ask>

<action>Store design_system_component</action>
<action>Store component_status = "existing"</action>
</check>

<check if="choice == 2">
  <ask>**New image pattern name:**
  
  Suggested: `Image-{{pattern_type}}` (e.g., Image-Hero, Image-Avatar, Image-Card)
  
  Component name:</ask>
  
  <action>Store design_system_component</action>
  <action>Store component_status = "new"</action>
  <action>Mark for Design System addition in Phase 5</action>
  
  <output>✅ This image pattern will be added to your Design System in Phase 5.</output>
</check>

<check if="choice == 3">
  <action>Store component_status = "page-specific"</action>
</check>
{{else}}
<action>Store component_status = "page-specific"</action>
{{/if}}

---

## IMAGE PROPERTIES

<ask>**Image properties:**

**Source:**

- Image filename/path:
- Alt text (EN):
- Alt text (SV):
- Is decorative (no alt needed): yes/no

**Dimensions:**

- Width:
- Height:
- Aspect ratio:
- Object-fit: (cover/contain/fill)

**Responsive behavior:**

- Mobile size:
- Tablet size:
- Desktop size:
- Retina/2x version: yes/no
  </ask>

---

## IMAGE STATES

<ask>**Image states:**

**Loading:**

- Placeholder: (color/skeleton/blur)
- Lazy loading: yes/no

**Error:**

- Fallback image: (if any)
- Error message display: yes/no

**Loaded:**

- Fade-in animation: yes/no
- Animation duration:
  </ask>

---

## GENERATE SPECIFICATION

```markdown
### {{image_name}}

**Object ID:** `{{object_id}}`
**Type:** image

**Source:**

- File: {{image_path}}
- Alt (EN): {{alt_text_en}}
- Alt (SV): {{alt_text_sv}}
  {{#if is_decorative}}
- Decorative: role="presentation"
  {{/if}}

**Dimensions:**

- Width: {{width}}
- Height: {{height}}
- Aspect ratio: {{aspect_ratio}}
- Object-fit: {{object_fit}}

**Responsive:**

- Mobile: {{mobile_size}}
- Tablet: {{tablet_size}}
- Desktop: {{desktop_size}}
  {{#if has_retina}}
- Retina (@2x): {{retina_path}}
  {{/if}}

**Loading:**

- Placeholder: {{placeholder_type}}
- Lazy load: {{lazy_loading}}

**States:**

- **Loading:** {{loading_state}}
- **Error:** {{error_fallback}}
- **Loaded:** {{loaded_animation}}
```

---

**Return to 4c-03**
