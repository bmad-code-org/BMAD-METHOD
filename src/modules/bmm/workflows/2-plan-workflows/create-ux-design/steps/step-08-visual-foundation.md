# Step 8: Visual Foundation

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between UX facilitator and stakeholder
- 📋 YOU ARE A UX FACILITATOR, not a content generator
- 💬 FOCUS on establishing visual design foundation (colors, typography, spacing)
- 🎯 COLLABORATIVE discovery, not assumption-based design

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating visual foundation content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper visual insights
- **P (Party Mode)**: Bring multiple perspectives to define visual foundation
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Design system choice from step 6 provides component foundation
- Emotional response goals from step 4 inform visual decisions
- Focus on colors, typography, spacing, and layout foundation

## YOUR TASK:

Establish the visual design foundation including color themes, typography, and spacing systems.

## VISUAL FOUNDATION SEQUENCE:

### 1. Brand Guidelines Assessment

Check for existing brand requirements:
"Do you have existing brand guidelines or a specific color palette I should follow? (y/n)

If yes, I'll extract and document your brand colors and create semantic color mappings.
If no, I'll generate theme options based on your project's personality and emotional goals from our earlier discussion."

### 1.5 Knowledge Base Integration (Auto)

Before generating design options, automatically query the UI/UX Pro Max knowledge base for professional recommendations.

#### Prerequisite: Extract Variables from Frontmatter

Before executing searches, extract the following from the current document's frontmatter or previous step context:

- `{industry}` - From frontmatter field `industry` or `productType` (e.g., "SaaS", "E-commerce")
- `{style_keywords}` - From frontmatter field `style`, `visualStyle`, or `emotionalGoals` (e.g., "modern minimal")

**If variables are not available:**
- Use project name or product description as fallback search terms
- Or ask user: "What industry/style keywords should I use for design recommendations?"

#### Color Palette Search

Execute the following command using extracted context:

```bash
python {kb_path}/scripts/search.py "{industry} {style_keywords}" --domain color --json
```

> **Note:** Path uses `kb_path` from config. Update `kb_path` if the KB location changes.

**Parse JSON Output Fields:**
- `Primary (Hex)` - Primary brand color
- `Secondary (Hex)` - Secondary accent color
- `CTA (Hex)` - Call-to-action button color
- `Background (Hex)` - Background color recommendation
- `Text (Hex)` - Text color for readability
- `Border (Hex)` - Border/divider color

**Present to User:**
"🎨 **Knowledge Base Color Recommendations:**

Based on your project's industry ({industry}) and style ({style_keywords}), here are professional color palette suggestions:

| Role | Hex Code | Preview |
|------|----------|---------|
| Primary | {Primary (Hex)} | ██████ |
| Secondary | {Secondary (Hex)} | ██████ |
| CTA | {CTA (Hex)} | ██████ |
| Background | {Background (Hex)} | ██████ |
| Text | {Text (Hex)} | ██████ |
| Border | {Border (Hex)} | ██████ |

**What would you like to do with these recommendations?**
[1] Accept - Use these as the starting point
[2] Modify - Adjust these colors to your preference
[3] Skip - Generate fresh options without these suggestions"

#### Typography Search

After color recommendations, execute typography search:

```bash
python {kb_path}/scripts/search.py "{style_keywords}" --domain typography --json
```

**Parse JSON Output Fields:**
- `Font Pairing Name` - Name of the font pairing (e.g., "Geometric Modern")
- `Google Fonts URL` - Ready-to-use Google Fonts import link
- `CSS Import` - CSS @import statement
- `Tailwind Config` - Tailwind CSS configuration snippet
- `Notes` - Additional usage notes

**Present to User:**
"📝 **Knowledge Base Typography Recommendations:**

**{Font Pairing Name}**

| Property | Value |
|----------|-------|
| Google Fonts | {Google Fonts URL} |
| CSS Import | `{CSS Import}` |
| Tailwind Config | ```{Tailwind Config}``` |

*{Notes}*

**What would you like to do with these recommendations?**
[1] Accept - Use these font recommendations
[2] Modify - Adjust font choices
[3] Skip - Define typography from scratch"

#### Fallback Handling

If the search command fails, returns no results, or variables are unavailable:

"ℹ️ **Note:** Knowledge base search returned no specific recommendations for your criteria. Proceeding with standard design exploration.

This is normal for unique combinations - we'll create custom options tailored to your needs."

**Then proceed to Generate Color Theme Options normally.**

---

### 2. Generate Color Theme Options (If no brand guidelines)

Create visual exploration opportunities:
"If no existing brand guidelines, I'll create a color theme visualizer to help you explore options.

🎨 I can generate comprehensive HTML color theme visualizers with multiple theme options, complete UI examples, and the ability to see how colors work in real interface contexts.

This will help you make an informed decision about the visual direction for {{project_name}}."

### 3. Define Typography System

Establish the typographic foundation:
"**Typography Questions:**

- What should the overall tone feel like? (Professional, friendly, modern, classic?)
- How much text content will users read? (Headings only? Long-form content?)
- Any accessibility requirements for font sizes or contrast?
- Any brand fonts we must use?

**Typography Strategy:**

- Choose primary and secondary typefaces
- Establish type scale (h1, h2, h3, body, etc.)
- Define line heights and spacing relationships
- Consider readability and accessibility"

### 4. Establish Spacing and Layout Foundation

Define the structural foundation:
"**Spacing and Layout Foundation:**

- How should the overall layout feel? (Dense and efficient? Airy and spacious?)
- What spacing unit should we use? (4px, 8px, 12px base?)
- How much white space should be between elements?
- Should we use a grid system? If so, what column structure?

**Layout Principles:**

- [Layout principle 1 based on product type]
- [Layout principle 2 based on user needs]
- [Layout principle 3 based on platform requirements]"

### 5. Create Visual Foundation Strategy

Synthesize all visual decisions:
"**Visual Foundation Strategy:**

**Color System:**

- [Color strategy based on brand guidelines or generated themes]
- Semantic color mapping (primary, secondary, success, warning, error, etc.)
- Accessibility compliance (contrast ratios)

**Typography System:**

- [Typography strategy based on content needs and tone]
- Type scale and hierarchy
- Font pairing rationale

**Spacing & Layout:**

- [Spacing strategy based on content density and platform]
- Grid system approach
- Component spacing relationships

This foundation will ensure consistency across all our design decisions."

### 6. Generate Visual Foundation Content

Prepare the content to append to the document:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## Visual Design Foundation

### Color System

[Color system strategy based on conversation]

### Typography System

[Typography system strategy based on conversation]

### Spacing & Layout Foundation

[Spacing and layout foundation based on conversation]

### Accessibility Considerations

[Accessibility considerations based on conversation]
```

### 7. Present Content and Menu

Show the generated visual foundation content and present choices:
"I've established the visual design foundation for {{project_name}}. This provides the building blocks for consistent, beautiful design.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Let's refine our visual foundation
[P] Party Mode - Bring design perspectives on visual choices
[C] Continue - Save this to the document and move to design directions

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml with the current visual foundation content
- Process the enhanced visual insights that come back
- Ask user: "Accept these improvements to the visual foundation? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md with the current visual foundation
- Process the collaborative visual insights that come back
- Ask user: "Accept these changes to the visual foundation? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/ux-design-specification.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Load `./step-09-design-directions.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Brand guidelines assessed and incorporated if available
✅ Knowledge base integration executed before color generation
✅ User presented with Accept/Modify/Skip choices for KB recommendations
✅ Color system established with accessibility consideration
✅ Typography system defined with appropriate hierarchy
✅ Spacing and layout foundation created
✅ Visual foundation strategy documented
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Not checking for existing brand guidelines first
❌ Color palette not aligned with emotional goals
❌ Typography not suitable for content type or readability needs
❌ Spacing system not appropriate for content density
❌ Missing accessibility considerations
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-09-design-directions.md` to generate design direction mockups.

Remember: Do NOT proceed to step-09 until user explicitly selects 'C' from the A/P/C menu and content is saved!
