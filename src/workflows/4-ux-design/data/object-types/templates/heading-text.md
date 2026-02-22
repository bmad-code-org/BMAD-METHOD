# Object Type: Heading/Text (with Purpose-Based Organization)

**Goal:** Document text element with purpose-based naming and grouped translations

---

## TEXT IDENTIFICATION & ANALYSIS

<output>**Analyzing text element from sketch...**</output>

<action>First, check if sketch contains ACTUAL TEXT (readable words):

- Headlines often drawn as actual text
- Provides content guidance
- Can change during conversation
  </action>

<check if="sketch_has_readable_text">
  <action>Extract text from sketch</action>
  <output>**Text found in sketch:** "{{extracted_text}}"

I can use this as a starting suggestion, but we can change it if needed.</output>
</check>

<check if="sketch_has_line_markers">
  <action>Analyze text placeholders using rules from guides/SKETCH-TEXT-ANALYSIS-GUIDE.md:
  - Count horizontal line pairs (pairs = text lines)
  - Measure line thickness (thickness → font weight)
  - Measure distance between line pairs (spacing → font size estimate)
  - Check line position in container (position → text alignment)
  - Calculate line-height from font size
  - Estimate character capacity from line length
  </action>

<output>**Text placeholder detected:**

**Sketch Analysis:**

- **{{line_count}} line pairs** → {{line_count}} lines of text
- **Line thickness:** {{thickness}} → **{{estimated_font_weight}}**
- **Line spacing:** {{distance_between_lines}} → **~{{estimated_font_size}}** font size
- **Line-height:** ~{{estimated_line_height}} (calculated from font size)
- **Alignment:** {{detected_alignment}} (from line position)
- **Capacity:** ~{{total_chars}} characters per line

**This appears to be:** {{text_type}} (heading/body/caption/label)

⚠️ **Note:** If spacing is very large (>60px), verify this is text and not an image placeholder.

💡 **Analysis rules:** See `guides/SKETCH-TEXT-ANALYSIS-GUIDE.md` for complete methodology.</output>
</check>

---

## STEP 1: PURPOSE-BASED NAMING

<output>**Let's define this text element by its PURPOSE, not its content.**</output>

<ask>**What is the PURPOSE of this text on the page?**

Think about function, not content:

- "Primary headline" (not "Welcome to Dog Week")
- "Feature description" (not "Organize your family")
- "CTA supporting text" (not "Free forever")
- "Error message" (not "Invalid email")
- "Form label" (not "Email Address")

Purpose/function:</ask>

<action>Store text_purpose (e.g., "hero-headline", "feature-description", "error-message")</action>

---

## STEP 2: OBJECT ID (Based on Purpose)

<action>Generate Object ID from purpose:
`{page}-{section}-{purpose}`

Examples:

- `start-hero-headline` (not `start-hero-welcome-text`)
- `signin-form-email-label` (not `signin-form-email-address-text`)
- `profile-success-message` (not `profile-saved-successfully-text`)
  </action>

<output>**Object ID:** `{{generated_object_id}}`

Based on purpose: {{text_purpose}}</output>

---

## STEP 3: DESIGN SYSTEM COMPONENT

{{#if design_system_enabled}}
<ask>**Design System component:**

1. **Use existing typography** - From your Design System
2. **Create new typography** - Add this style to the Design System
3. **Page-specific only** - Not a reusable style

Choice [1/2/3]:</ask>

<check if="choice == 1">
  <ask>**Which existing typography component?**

From your Design System:
{{list_available_typography_components}}

Component name:</ask>

<action>Store design_system_component</action>
<action>Store component_status = "existing"</action>
</check>

<check if="choice == 2">
  <ask>**New typography component name:**
  
  Suggested: `Typography-{{text_type}}` (e.g., Typography-H1, Typography-Body)
  
  Component name:</ask>
  
  <action>Store design_system_component</action>
  <action>Store component_status = "new"</action>
  <action>Mark for Design System addition in Phase 5</action>
  
  <output>✅ This typography style will be added to your Design System in Phase 5.</output>
</check>

<check if="choice == 3">
  <action>Store component_status = "page-specific"</action>
</check>
{{else}}
<action>Store component_status = "page-specific"</action>
{{/if}}

---

## STEP 4: TEXT TYPE & POSITIONING

<ask>**Text element specifications:**

**HTML Tag** (semantic structure for SEO/accessibility):

- h1 (main page heading, only ONE per page)
- h2 (major section heading)
- h3 (subsection heading)
- h4/h5/h6 (minor headings)
- p (paragraph)
- span (inline, no semantic meaning)

HTML tag:

**Visual Style Type** (appearance, from Design System):

- Hero headline (large display text for hero sections)
- Main header (primary page/section headers)
- Sub header (section headings, emphasized)
- Sub header light (lighter section headings)
- Card header (headers within cards/panels)
- Small header (minor headers, labels)
- Body text (standard paragraphs)
- Body text large (larger body, intro text)
- Body text small (smaller body, secondary info)
- Caption text (image captions, metadata)
- Label text (form labels, UI labels)

Visual style name:

> **Important:** HTML tags define document structure. Visual styles define appearance. Keep them separate!

**Position on page:**

- Vertical: (top/middle/bottom of section)
- Horizontal: (left/center/right)
- Relative to: (e.g., "above CTA button", "below headline")

**Text Alignment** (from sketch line position):

- left (lines start at left edge)
- center (lines centered in container)
- right (lines end at right edge)
- justified (lines span full width)

Alignment:

**Style specifications:**

- Font size: {{estimated_font_size}} (est. from {{line_spacing}} spacing in sketch)
- Font weight: {{estimated_font_weight}} (from {{line_thickness}} line thickness in sketch)
- Line height: {{estimated_line_height}} (est. calculated from font size)
- Text color:
- Text transform: (none/uppercase/capitalize)
  </ask>

<action>Store html_tag, visual_type, visual_style_name, position, and style specifications</action>

---

## STEP 5: CONTENT WITH GROUPED TRANSLATIONS

<output>**Now let's specify the actual content.**

**IMPORTANT:** Translations will be grouped so each language reads coherently.
{{#if sketch_has_text}}
Content length: Based on sketch text "{{extracted_text}}"
{{else}}
Content length: ~{{total_chars}} characters (from sketch analysis)
{{/if}}

**Project languages:** {{product_languages}} (from workflow config)</output>

<check if="sketch_has_readable_text">
  <output>**I found text in your sketch:** "{{extracted_text}}"

Let me suggest translations for all configured languages...</output>

<action>Translate extracted_text to all product_languages</action>
<action>Generate suggested translations using context and best practices</action>

<output>**Suggested content for {{text_purpose}}:**

{{#each product_languages}}
**{{this}}:** {{suggested_translation}}
{{/each}}

These are my suggestions based on the sketch text. Please review and adjust as needed!</output>

<ask>Do these translations work, or would you like to change any of them?

1. **Use these translations** - They look good!
2. **Adjust translations** - I'll provide different versions
3. **Manual input** - I'll enter them myself

Choice [1/2/3]:</ask>

  <check if="choice == 2">
    <ask>Which language(s) need adjustment?

{{#each product_languages}}
**{{this}}:** {{suggested_translation}} ← Change this?
{{/each}}

Please provide the corrected versions:</ask>
</check>

  <check if="choice == 3">
    <ask>**Content for this {{text_purpose}}:**

{{#each product_languages}}
**{{this}}:**

{{/each}}
</ask>
</check>
</check>

<check if="!sketch_has_readable_text">
  <ask>**Content for this {{text_purpose}}:**

Please provide content. I'll suggest translations once you give me the first language!

**{{primary_language}}:**

</ask>

<action>After receiving primary language content, suggest translations for remaining languages</action>

<output>**Translation suggestions:**

{{#each remaining_languages}}
**{{this}}:** {{suggested_translation}}
{{/each}}

Would you like to use these, or provide your own?</output>
</check>

<action>Store content for each language</action>
<action>Validate length against sketch capacity (if applicable)</action>

<check if="content_exceeds_capacity">
  <output>⚠️ **Length Warning:**
  - Sketch capacity: ~{{sketch_capacity}} characters
  - Your content: {{actual_chars}} characters
  
  Consider shortening or adjusting design.</output>
</check>

---

## STEP 6: BEHAVIOR (if applicable)

<ask>**Does this text change or have behavior?**

- Static (never changes): no
- Updates with language toggle: yes
- Dynamic content (from API/user): yes
- Conditional display: yes

If yes, describe behavior:</ask>

<action>Store behavior if applicable</action>

---

## STEP 7: GENERATE SPECIFICATION (WDS Pattern)

<action>Generate specification following WDS specification pattern:

```markdown
#### {{Text_Purpose_Title}}

**OBJECT ID**: `{{object_id}}`

**HTML Structure:**

- **Tag**: {{html_tag}}
- **Semantic Purpose**: {{semantic_description}}

**Visual Style:**
{{#if design_system_component}}

- **Design System Component**: {{design_system_component}}
  {{/if}}
- **Visual Style Name**: {{visual_style_name}}
- **Font weight**: {{font_weight}} (from {{line_thickness}} line markers in sketch)
- **Font size**: {{font_size}} (est. from {{line_spacing}} spacing between line pairs)
- **Line-height**: {{line_height}} (est. calculated from font size)
  {{#if text_color}}
- **Color**: {{text_color}}
  {{/if}}
  {{#if text_transform}}
- **Transform**: {{text_transform}}
  {{/if}}

**Position**: {{position_description}}
**Alignment**: {{text_alignment}}

{{#if behavior}}
**Behavior**: {{behavior_description}}
{{/if}}

**Content**:
{{#each product_languages}}

- {{this}}: "{{content}}"
  {{/each}}

> **Sketch Analysis:** Values derived using `guides/SKETCH-TEXT-ANALYSIS-GUIDE.md` methodology. Designer should review and confirm.
```

{{#each additional_language}}

- {{lang_code}}: "{{content}}"
  {{/each}}

````
</action>

---

## TEXT GROUP ORGANIZATION

<output>**Is this text part of a GROUP?**

Many pages have text groups that should be read together:
- Headline + Body + Link
- Label + Helper text
- Heading + Subheading + Description

Grouping translations allows reading the entire section in one language.</output>

<ask>**Is this text part of a group?**

1. **Yes** - Part of a text group
2. **No** - Standalone text element

Choice [1/2]:</ask>

<check if="part_of_group">
  <ask>**What other text elements are in this group?**

  List them:</ask>

  <action>Mark as text group for grouped translation output</action>

  <output>**Text group will be formatted as:**

  ```markdown
  ### {{Group_Name}}
  **Purpose**: {{group_purpose}}

  #### {{Element_1_Purpose}}
  **OBJECT ID**: `{{object_id_1}}`
  - **Component**: {{type_1}}
  - **Content**:
    - EN: "{{content_en_1}}"
    - SE: "{{content_se_1}}"

  #### {{Element_2_Purpose}}
  **OBJECT ID**: `{{object_id_2}}`
  - **Component**: {{type_2}}
  - **Content**:
    - EN: "{{content_en_2}}"
    - SE: "{{content_se_2}}"

  #### {{Element_3_Purpose}}
  **OBJECT ID**: `{{object_id_3}}`
  - **Component**: {{type_3}}
  - **Content**:
    - EN: "{{content_en_3}}"
    - SE: "{{content_se_3}}"
````

**Reading in English:**
{{content_en_1}} + {{content_en_2}} + {{content_en_3}}

**Reading in Swedish:**
{{content_se_1}} + {{content_se_2}} + {{content_se_3}}

Each language reads as a complete, coherent message!</output>
</check>

---

## COMPLETE SPECIFICATION EXAMPLE (Dog Week Style)

```markdown
### Hero Object

**Purpose**: Primary value proposition and main conversion action

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading (`.text-heading-1`)
- **Position**: Center of hero section, above CTA
- **Style**:
  - Font weight: Bold (from 3px thick line markers)
  - Font size: 42px (est. from 24px spacing between line pairs)
  - Line-height: 1.2 (est. calculated from font size)
  - No italic, color: #1a1a1a
- **Behavior**: Updates with language toggle
- **Content**:

> **Note:** Values marked `(est. from...)` show sketch analysis reasoning. Confirm or adjust, then update with actual values.

- EN: "Every walk. on time. Every time."
- SE: "Varje promenad. i tid. Varje gång."

#### Supporting Text

**OBJECT ID**: `start-hero-supporting`

- **Component**: Body text (`.text-body`)
- **Position**: Below headline, above CTA button
- **Style**:
  - Font weight: Regular (from 1px thin line markers)
  - Font size: 16px (est. from 12px spacing between line pairs)
  - Line-height: 1.5 (est. calculated from font size)
- **Behavior**: Updates with language toggle
- **Content**:

> **Note:** Values marked `(est. from...)` show sketch analysis reasoning. Confirm or adjust, then update with actual values.

- EN: "Organize your family around dog care. Never miss a walk again."
- SE: "Organisera din familj kring hundvård. Missa aldrig en promenad igen."

#### Primary CTA Button

**OBJECT ID**: `start-hero-cta`

- **Component**: [Button Primary Large](/docs/D-Design-System/.../Button-Primary.md)
- **Position**: Center, below supporting text
- **Behavior**: Navigate to registration/sign-up
- **Content**:
  - EN: "start planning - free forever"
  - SE: "börja planera - gratis för alltid"
```

**Reading the Hero in English:**

> "Every walk. on time. Every time."
> "Organize your family around dog care. Never miss a walk again."
> [start planning - free forever]

**Reading the Hero in Swedish:**

> "Varje promenad. i tid. Varje gång."
> "Organisera din familj kring hundvård. Missa aldrig en promenad igen."
> [börja planera - gratis för alltid]

---

## KEY PRINCIPLES

### 1. Purpose-Based Naming ✅

**NOT:** `welcome-heading`, `description-paragraph`
**YES:** `hero-headline`, `feature-description`

Names describe FUNCTION, not content.

### 2. Separated Structure ✅

- **Position/Style** specified separately
- **Content** grouped by language
- **Behavior** clearly stated

### 3. Grouped Translations ✅

Text groups keep languages together so each reads coherently.

### 4. Professional Format ✅

Follows Dog Week specification style for consistency across WDS projects.

---

## BENEFITS

✅ **Purpose-Driven**

- Object IDs reflect function
- Names remain valid if content changes
- Clear semantic meaning

✅ **Translation-Friendly**

- Each language grouped together
- Easy to read entire section in one language
- Natural language flow preserved

✅ **Maintainable**

- Content can change without renaming
- Structure remains stable
- Easy to locate by purpose

✅ **Developer-Friendly**

- Clear what each text does
- Component references included
- Position clearly stated

---

**Return to object-router after documentation complete**
