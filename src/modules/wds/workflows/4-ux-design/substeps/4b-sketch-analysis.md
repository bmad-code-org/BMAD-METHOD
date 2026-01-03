# Step 4B: Sketch Analysis (AI-Interprets, User-Confirms)

**Goal:** AI reads entire sketch, identifies sections, interprets function/purpose, user confirms before detailed specification.

---

## WORKFLOW APPROACH

**Balance: AI Enhancement + User Control**

1. **AI Reads Entire Sketch** → Identifies all sections holistically
2. **Designer Confirms Structure** → Validates section breakdown
3. **Section-by-Section AI Interpretation** → AI reads each section, interprets objects, function, purpose
4. **User Refinement Dialog** → Designer adds specifics, confirms/adjusts
5. **Batch Generation** → AI generates complete section spec with all translations

---

## STEP 1: HOLISTIC SKETCH READING

<output>**Let me read your entire sketch and identify the main sections...**</output>

<ask>Please share your sketch:

- Describe it to me
- Paste/upload an image
- Reference filename in Sketches/ folder

Your sketch:</ask>

<action>Analyze entire sketch holistically:

1. **Establish Scale First:**
   - Check if other pages in project have been analyzed
   - Look for established text styles (body text, buttons, headings)
   - Identify UI anchors (browser chrome, scrollbars, buttons, icons)
   - Use previous pages + UI elements to calibrate scale

2. **Identify Sections:**
   - Identify logical sections (header, hero, features, cards, footer, etc.)
   - Determine section boundaries (whitespace, visual grouping, layout)
   - Recognize section purposes from visual context
   - Count objects/elements in each section

3. **Cross-Page Pattern Matching:**
   - Check if sections look like components from previous pages
   - Compare text styles to established patterns (e.g., "thin lines, icon-sized spacing = 16px body text")
   - Note potential design system components
     </action>

<output>**📊 I've analyzed your sketch. Here's what I see:**

{{#if has_previous_pages}}
**🔗 Cross-Page References Detected:**
{{#each established_patterns}}

- {{pattern_name}}: {{specification}} (from {{source_page}})
  {{/each}}

I'll use these as reference points for consistency.
{{/if}}

---

**{{page_name}}** contains **{{section_count}} main sections:**

## {{#each identified_sections}}

**Section {{index}}: {{section_name}}** ({{location}})

- **Purpose:** {{interpreted_purpose}}
- **Contains:** {{object_count}} objects/elements
- **Layout:** {{layout_description}}
  {{#if looks_like_previous_component}}
- 💡 **Component?** Similar to {{component_name}} from {{previous_page}}
  {{/if}}
  {{#if matches_established_pattern}}
- ✅ **Pattern Match:** Text styles match {{pattern_name}} from {{source_page}}
  {{/if}}
  {{/each}}

---

This is my interpretation of the structure. Does this look right?</output>

<ask>Section structure:

1. **Confirm** - Yes, this is correct!
2. **Adjust** - I need to refine the section breakdown
3. **Add sections** - I see more sections
4. **Remove/merge sections** - Some sections should be combined

Choice [1/2/3/4]:</ask>

<check if="choice != 1">
  <ask>**How should I adjust the sections?**

Current breakdown:
{{#each identified_sections}}
{{index}}. {{section_name}} - {{interpreted_purpose}}
{{/each}}

Your changes:</ask>

<action>Update section structure based on feedback</action>
<output>**Updated structure:**

{{#each updated_sections}}
{{index}}. {{section_name}} - {{interpreted_purpose}}
{{/each}}

Does this look better?</output>

<action>Loop until user confirms structure</action>
</check>

---

## STEP 2: COMPONENT IDENTIFICATION

<check if="any_sections_look_like_components">
  <output>**🔄 I noticed some sections might be reusable components:**
  
  {{#each potential_components}}
  - **{{section_name}}** looks similar to **{{component_name}}** from {{previous_page}}
  {{/each}}
  </output>
  
  <ask>Should these be components (reusable across pages)?

1. **Yes, make them components** - Define once, reference later
2. **No, keep them as page-specific** - Each page has unique version
3. **Let me decide section-by-section** - I'll choose as we go

Choice [1/2/3]:</ask>

<action>Mark sections as components or page-specific based on user choice</action>
</check>

---

## STEP 3: SECTION-BY-SECTION AI INTERPRETATION

<output>**Perfect! Now I'll analyze each section in detail, one at a time.**

I'll interpret the objects, functions, and content for each section. You can confirm or refine my interpretation before I generate the spec.

---

**📍 Section {{current_index}}/{{total_sections}}: {{section_name}}**</output>

### 3A: AI Reads & Interprets Section (Recursive)

<action>For current section, identify objects **Top-Left to Bottom-Right**:

1. **Identify Top-Level Containers** (e.g., Cards, Rows, Groups)
   - IF container has children → Dive in and identify child elements
   - IF repeating group (e.g., 3 Feature Cards) → Identify as "Repeating Pattern"

2. **Handle Repeating Objects:**
   - **Fixed Count (e.g., 3 Cards):** Name individually (`card-01`, `card-02`, `card-03`)
   - **Dynamic List:** Define as Pattern + Data Source

3. **Determine Object Hierarchy:**
   - Parent: `feature-card-01`
   - Child: `feature-card-01-icon`, `feature-card-01-title`

4. **Interpret Attributes:**
   - Type (Button, Text, Input)
   - Function & Purpose
   - Text Content (Actual vs. Markers)
   - Visual Hierarchy
     </action>

<output>**My interpretation of "{{section_name}}":**

**Section Purpose:** {{interpreted_section_purpose}}

**Hierarchy I see:**

{{#each interpreted_objects}}
{{object_index}}. **{{interpreted_type}}** ({{hierarchy_level}})

- **Object ID:** `{{suggested_object_id}}`
  {{#if is_container}}
- **Contains:**
  {{#each children}}
  - {{child_type}}: `{{child_object_id}}`
    {{/each}}
    {{/if}}
- **Function:** {{interpreted_function}}
- **Purpose:** {{interpreted_purpose}}
  {{#if has_actual_text}}
- **Text in sketch:** "{{extracted_text}}"
  {{/if}}
  {{/each}}

**Overall Function:** {{section_function_summary}}</output>

### 3B: User Refinement Dialog

<ask>**Does this interpretation look right?**

1. **Yes, looks good!** - Move to content/translations
2. **Adjust interpretations** - I need to correct some things
3. **Add missing objects** - You missed something
4. **Remove objects** - Something isn't an object

Choice [1/2/3/4]:</ask>

<check if="choice == 2">
  <ask>**Which interpretations need adjustment?**
  
  {{#each interpreted_objects}}
  {{object_index}}. {{interpreted_type}} - {{interpreted_function}}
  {{/each}}
  
  Your corrections:</ask>
  
  <action>Update interpretations based on user feedback</action>
</check>

<check if="choice == 3">
  <ask>**What did I miss?**
  
  Describe the missing object(s):</ask>
  
  <action>Add missed objects to interpretation</action>
</check>

<check if="choice == 4">
  <ask>**Which objects should I remove?**
  
  {{#each interpreted_objects}}
  {{object_index}}. {{interpreted_type}}
  {{/each}}
  
  Remove numbers:</ask>
  
  <action>Remove specified objects</action>
</check>

<action>Re-display updated interpretation for confirmation</action>
<action>Loop until user confirms: "Yes, looks good!"</action>

---

## STEP 4: CONTENT & TRANSLATION GATHERING

<output>**Great! Now let's gather the content for all text elements in this section.**

I'll suggest translations for everything at once.</output>

## {{#each text_objects}}

**{{object_purpose}}** (`{{object_id}}`)

{{#if has_actual_text}}
<output>I found text in your sketch: "{{extracted_text}}"

Let me suggest translations...</output>

<action>Generate translations for all product_languages</action>

<output>**Suggested content:**

{{#each product_languages}}
{{this}}: {{suggested_translation}}
{{/each}}
</output>

<ask>For "{{object_purpose}}":

1. **Use these translations**
2. **Adjust translations**
3. **Manual input**

Choice [1/2/3]:</ask>

{{else}}
<ask>**Content for "{{object_purpose}}":**

{{primary_language}}:</ask>

<action>After receiving primary language, suggest other languages</action>

<output>**Translation suggestions:**

{{#each remaining_languages}}
{{this}}: {{suggested_translation}}
{{/each}}

Use these? [1] Yes [2] Adjust [3] Manual</output>

{{/if}}

## <action>Store confirmed content for this object</action>

{{/each}}

---

## STEP 5: BATCH SPECIFICATION GENERATION

<output>**Perfect! I have everything I need for "{{section_name}}".**

Let me generate the complete section specification...</output>

<action>Generate section spec:

1. Section header with purpose
2. All objects with full details
3. All translations grouped by object
4. Component references if applicable
5. Interactions and behaviors
6. States if applicable
7. Validation rules if applicable
   </action>

<output>**✅ Section "{{section_name}}" specification generated!**

```markdown
### {{Section_Name}}

**Purpose**: {{section_purpose}}

{{#each objects}}

#### {{Object_Purpose_Title}}

**OBJECT ID**: `{{object_id}}`

- **Component**: {{component_type}}
- **Position**: {{position}}
- **Style**: {{style_specs}}
  {{#if has_behavior}}
- **Behavior**: {{behavior}}
  {{/if}}
  {{#if is_text}}
- **Content**:
  {{#each product_languages}}
  - {{this}}: "{{content}}"
    {{/each}}
    {{/if}}
    {{#if has_states}}
- **States**: {{states}}
  {{/if}}

{{/each}}
```

**Next:** {{#if more_sections}}Section {{next_index}}: {{next_section_name}}{{else}}Complete page!{{/if}}</output>

<check if="more_sections">
  <action>Move to next section</action>
  <action>Repeat STEP 3 for next section</action>
</check>

<check if="!more_sections">
  <output>**🎉 All sections complete!**
  
  Your page specification includes:
  - {{total_sections}} sections
  - {{total_objects}} objects
  - {{total_text_elements}} text elements with {{language_count}} languages
  - {{component_count}} reusable components identified
  
  Ready to generate prototype!</output>
  
  <action>Proceed to 4C-08 (Generate Final Spec)</action>
</check>

---

## KEY PRINCIPLES

### ✅ AI Enhancement

- **Reads entire sketch** holistically
- **Identifies sections** automatically
- **Interprets function & purpose** from context
- **Suggests translations** proactively
- **Batch generates** complete specs

### ✅ User Control

- **Confirms structure** before detailed work
- **Refines interpretations** through dialog
- **Reviews translations** before acceptance
- **Stays in the loop** at key decision points
- **Can adjust** at any step

### ✅ Efficient Workflow

- **Section-by-section** keeps focus manageable
- **AI does heavy lifting** (interpretation, translation)
- **User does validation** (confirm, adjust, approve)
- **Batch generation** produces complete specs
- **Faster than pure manual** while maintaining quality

---

## EXAMPLE: Dog Week Start Page

### Step 1: Holistic Reading

**AI:**

```
I've analyzed your sketch. Here's what I see:

Start Page contains 5 main sections:

1. Header (Top)
   - Purpose: Navigation and user access
   - Contains: 3 objects (logo, sign-in button, language selector)
   - Layout: Horizontal bar, logo left, buttons right

2. Hero (Center)
   - Purpose: Primary value proposition and CTA
   - Contains: 3 objects (headline, supporting text, CTA button)
   - Layout: Centered, vertical stack
   - 💡 Component? Similar to Hero from other landing pages

3. Illustration (Center)
   - Purpose: Visual storytelling
   - Contains: 1 object (hero image)
   - Layout: Full-width image

4. Message (Below illustration)
   - Purpose: Supporting messaging
   - Contains: 2 objects (preheader, secondary headline)
   - Layout: Centered text

5. Feature Cards (Bottom)
   - Purpose: Key benefits showcase
   - Contains: 9 objects (3 cards × 3 elements each)
   - Layout: 3-column grid

Does this structure look right?
```

**User:** `1` (Confirms)

### Step 2: Section 1 - Header

**AI interprets:**

```
My interpretation of "Header":

Section Purpose: Primary navigation and user access

Objects I see:

1. Image/Logo (Top-left)
   - Object ID: `start-header-logo`
   - Function: Brand identity, links to home
   - Purpose: Establish brand presence

2. Button (Top-right, before language)
   - Object ID: `start-header-signin`
   - Function: Navigate to sign-in page
   - Purpose: User authentication access
   - Text in sketch: "Sign in"

3. Dropdown (Top-right, far right)
   - Object ID: `start-header-language`
   - Function: Toggle language
   - Purpose: Language selection
   - Text in sketch: "SE ▼"

Overall Function: Provide navigation and access to core functionality

Does this interpretation look right?
```

**User:** `1` (Confirms)

**AI suggests content:**

```
Content for "Sign In Button":

I found text in your sketch: "Sign in"

Suggested translations:
EN: Sign in
SE: Logga in

Use these? [1] Yes [2] Adjust [3] Manual
```

**User:** `1` (Accepts)

**AI generates:**

```markdown
### Header Object

**Purpose**: Navigation and user access with language selection

#### Dog Week Logo

**OBJECT ID**: `start-header-logo`

- **Component**: [Logo Component](/docs/D-Design-System/.../Logo.md)
- **Position**: Left-aligned
- **Behavior**: Links to home page

#### Sign In Button

**OBJECT ID**: `start-header-signin`

- **Component**: [Button Secondary](/docs/D-Design-System/.../Button-Secondary.md)
- **Position**: Right side (before language selector)
- **Behavior**: Navigate to sign-in page
- **Content**:
  - EN: "Sign in"
  - SE: "Logga in"

#### Language Selector

**OBJECT ID**: `start-header-language`

- **Component**: [Language Selector](/docs/D-Design-System/.../LanguageSelector.md)
- **Position**: Right side (after sign-in button)
- **Behavior**: onChange → toggle language
- **Content**: Globe icon + language code dropdown
```

**Next: Section 2 - Hero** 🎯

---

**This workflow balances AI power with designer control perfectly!** 🎨🤖✨
