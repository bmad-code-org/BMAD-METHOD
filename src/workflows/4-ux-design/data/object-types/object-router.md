# Object Type Router

**Goal:** Intelligently analyze object, suggest interpretation, and route to appropriate specification instructions

---

## STEP 1: TEXT ELEMENT DETECTION

<output>**Analyzing object from sketch...**</output>

<action>Apply text detection rules from `TEXT-DETECTION-PRIORITY.md`:

- Look for horizontal line PAIRS (2 lines together = text marker)
- Single lines alone = decorative elements (dividers, borders)
- Count pairs to determine number of text lines
  </action>

<check if="horizontal_lines_detected">
  <output>**✓ TEXT ELEMENT DETECTED**
  
  I see horizontal line pairs in the sketch - this is text content.
  
  **Quick Detection:**
  - **{{pair_count}} line pairs** → {{pair_count}} lines of text
  - Routing to text analysis for detailed specification...
  </output>
  
  <action>Route immediately to `object-types/templates/heading-text.md`</action>
  <action>Pass detected pairs to heading-text.md for analysis using guides/SKETCH-TEXT-ANALYSIS-GUIDE.md</action>
  
  **→ Loading text-specific instructions...**
  
  > **Reference:** Text detection rules in `TEXT-DETECTION-PRIORITY.md`, analysis methodology in `guides/SKETCH-TEXT-ANALYSIS-GUIDE.md`
</check>

---

## STEP 2: OTHER OBJECT ANALYSIS

<check if="not_text_element">

<action>Examine object characteristics:

- Visual appearance (shape, style, position)
- Context (what's around it, where in form/page)
- Interactive indicators (buttons, inputs, links)
- Container indicators (boxes, cards, modals)
- Media indicators (image placeholders, video frames)
  </action>

<output>**My interpretation:**

**This looks like a {{suggested_object_type}}.**

Based on what I see:

- {{observation_1}}
- {{observation_2}}
- {{observation_3}}

{{#if is_text_element}}
**Text Analysis from Sketch:**

- **{{line_count}} lines of text** (horizontal bar groups)
- **Line thickness:** {{thickness}} → ~{{estimated_font_size}} font
- **Line spacing:** {{spacing}} → ~{{estimated_line_height}} line-height
- **Alignment:** {{detected_alignment}}
- **Content capacity:** ~{{total_chars}} characters ({{chars_per_line}} per line)
  {{/if}}

**I think this {{component_name}}:**

- {{suggested_purpose}}
- {{suggested_interaction}}
- {{suggested_result}}

{{#if is_text_element}}
**Content should be:** {{content_guidance}} ({{line_count}} lines, ~{{total_chars}} characters)
{{/if}}

**Does this match your intent?**</output>

<ask>1. **Yes** - That's correct 2. **Close** - Similar but let me clarify 3. **No** - It's actually something different

Choice [1/2/3]:</ask>

---

## HANDLE USER RESPONSE

<check if="choice == 1">
  <output>✅ Great! Proceeding with {{suggested_object_type}} documentation.</output>
  <action>Store confirmed_object_type</action>
  <action>Store confirmed_purpose</action>
  <action>Route to appropriate object-type file</action>
</check>

<check if="choice == 2">
  <ask>**What should I adjust in my interpretation?**
  
  Please clarify:</ask>
  
  <action>Listen to clarification</action>
  <action>Adjust interpretation</action>
  
  <output>**Updated interpretation:**
  
  This {{adjusted_object_type}}:
  - {{adjusted_purpose}}
  
  Correct now?</output>
  
  <action>Once confirmed, route to appropriate object-type file</action>
</check>

<check if="choice == 3">
  <ask>**What is this object?**
  
  Please describe what it is and what it does:</ask>
  
  <action>Listen to user description</action>
  <action>Determine correct object type</action>
  
  <output>**Got it!** This is a {{corrected_object_type}}.
  
  I'll document it accordingly.</output>
  
  <action>Route to appropriate object-type file</action>
</check>

---

## STEP 3: ROUTE TO OBJECT-SPECIFIC INSTRUCTIONS

<action>Based on confirmed object type, load appropriate instruction file:

**TEXT ELEMENTS (DETECTED FIRST):**

- Horizontal line groups → `object-types/templates/heading-text.md`
  - Handles: Headings (H1-H6), Paragraphs, Labels, Captions
  - Includes: Sketch text analysis, character capacity, content guidance

**INTERACTIVE ELEMENTS:**

- **Button shapes** → `object-types/templates/button.md`
- **Input fields** → `object-types/templates/text-input.md`
- **Textarea boxes** → `object-types/textarea.md`
- **Dropdown indicators** → `object-types/select-dropdown.md`
- **Checkbox squares** → `object-types/checkbox.md`
- **Radio circles** → `object-types/radio-button.md`
- **Toggle switches** → `object-types/toggle-switch.md`
- **Underlined text/arrows** → `object-types/templates/link.md`

**MEDIA ELEMENTS:**

- **Image placeholders (X or box)** → `object-types/templates/image.md`
- **Video frame** → `object-types/video.md`

**CONTAINER ELEMENTS:**

- **Card/box container** → `object-types/card.md`
- **Overlay/popup** → `object-types/modal-dialog.md`
- **Grid/rows** → `object-types/table.md`
- **Bullet/numbered items** → `object-types/list.md`

**NAVIGATION ELEMENTS:**

- **Menu/tabs** → `object-types/navigation.md`

**STATUS ELEMENTS:**

- **Small circle/pill** → `object-types/badge.md`
- **Banner/box with icon** → `object-types/alert-toast.md`
- **Bar/spinner** → `object-types/progress.md`

**CUSTOM:**

- **Unique component** → `object-types/custom-component.md`
  </action>

</check>

---

## AFTER OBJECT DOCUMENTATION

<action>After object-specific instructions complete, return here</action>

<output>✅ **{{object_name}} documented!**</output>

<ask>**More objects in this section?**

Looking at the sketch, I can see {{describe_remaining_objects}}.

Should I analyze the next object?

1. **Yes** - Continue with next object
2. **No** - Section complete

Choice [1/2]:</ask>

<check if="choice == 1">
  <action>Loop back to top for next object analysis</action>
</check>

<check if="choice == 2">
  <output>✅ Section complete!</output>
  <action>Return to 4c-03</action>
</check>

---

## INTERPRETATION EXAMPLES

**Example 1: Button**

```
My interpretation:

This looks like a PRIMARY BUTTON.

Based on what I see:
- Prominent placement at bottom of form
- Bright blue background (primary color)
- White text saying "Save Profile"
- Located after all form fields

I think this "Save Profile Button":
- Saves the form data to the database
- Updates the user's profile information
- Shows loading state during save
- Navigates to profile view on success

Does this match your intent?
```

**Example 2: Text/Heading with Placeholder Lines**

```
My interpretation:

This looks like a HEADING (H2).

Based on what I see:
- Located at top of section, center-aligned
- Group of 2 horizontal bars (text placeholders)
- Thick lines suggesting larger font
- Positioned above body content

Text Analysis from Sketch:
- 2 lines of text (2 horizontal bar groups)
- Line thickness: 3px → ~28-32px font size
- Line spacing: 3px between lines → ~1.3 line-height
- Alignment: Center
- Content capacity: ~50-60 characters (25-30 per line)

I think this "Section Heading":
- Introduces the content section
- Draws attention to key message
- Should be brief and impactful

Content should be: Brief heading, 2 short lines (2 lines, ~50-60 characters)

Does this match your intent?
```

**Example 3: Body Text with Multiple Lines**

```
My interpretation:

This looks like BODY TEXT / PARAGRAPH.

Based on what I see:
- Below heading in main content area
- Group of 5 thin horizontal bars
- Left-aligned
- Comfortable spacing between lines

Text Analysis from Sketch:
- 5 lines of text (5 horizontal bar groups)
- Line thickness: 1px → ~16px font size
- Line spacing: 3px between lines → ~1.5 line-height
- Alignment: Left
- Content capacity: ~300-350 characters (60-70 per line)

I think this "Description Paragraph":
- Explains the feature or product
- Provides detailed information
- Engages the user

Content should be: Full paragraph (5 lines, ~300-350 characters)

Does this match your intent?
```

**Example 3: Link**

```
My interpretation:

This looks like a TEXT LINK.

Based on what I see:
- Underlined text saying "Forgot password?"
- Positioned below password field
- Smaller, less prominent than submit button
- Typical recovery flow placement

I think this "Forgot Password Link":
- Navigates to password reset flow
- Opens in same window
- For users who can't remember password
- Common authentication pattern

Does this match your intent?
```

---

## KEY PRINCIPLES

**✅ Agent demonstrates intelligence**

- Analyzes visual and contextual clues
- Makes informed suggestions
- Shows reasoning process

**✅ Trust-the-agent approach**

- Agent interprets, user confirms
- Not procedural checkbox selection
- Collaborative intelligence

**✅ Efficient workflow**

- Quick confirmation when correct
- Easy correction when needed
- Natural conversation flow

**✅ Context-aware**

- Understands form flow
- Recognizes UI patterns
- Applies common sense

---

**Return to 4c-03 after documentation complete**
