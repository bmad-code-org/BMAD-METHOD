# Module 15: Visual Design

## Lesson 2: Visual Design Techniques

**Practical methods for generating and refining visuals**

---

## Three Methods

In WDS, visual design happens through three categories of tools. You'll likely use a combination depending on the task.

### 1. Figma — Precision Design

Figma is where you go for pixel-level control. In WDS, you don't live in Figma — but you visit it when the agent can't get the details right.

**How you get code into Figma:**

**code.to.design** — a plugin that imports your HTML prototypes directly into Figma as editable layers. Your working prototype becomes a Figma file you can manipulate with all the precision Figma offers. When you're done, export back to code.

**How Figma talks to your agent:**

**Figma MCP** — connects your AI coding agent directly to Figma. The agent can read your Figma designs, extract styles, colors, spacing, and typography, and apply them to code — without you manually exporting or copying values.

**Best for:**
- Fine-tuning visual details the agent can't get right
- Establishing the visual language for a project
- Working with brand elements that need a designer's eye
- Exploring visual directions before committing to code
- Handing off precise specifications to developers

---

### 2. Image Generators — Visual Assets and Inspiration

AI image generation creates visual assets — hero photos, card images, persona illustrations, mood boards — that feed into your designs. These aren't working code or editable layouts. They're image assets.

**Nanobanana MCP (Gemini 2.5 Flash / Gemini 3 Pro)** — generates images directly from your AI coding agent and saves them to your repository. We've tested this extensively and learned what it does well and what it doesn't.

**What NB does well:**
- **Image assets** — Hero photos, card images, seasonal photos, persona illustrations
- **Mood visualization** — Captures atmosphere and visual direction
- **Style transfer** — Reference images influence the generated style
- **Quick exploration** — Fast to generate multiple visual directions

**What NB does NOT do well (critical limitations):**
- **All text is garbled** — AI-rendered text is never readable. Never trust it.
- **Logos cannot be reproduced** — Generates "inspired by" versions, not the real logo
- **Cannot edit results** — If something is wrong, you regenerate entirely. You cannot move, resize, or adjust elements.
- **Wireframe labels leak into mockups** — Annotation text bleeds through in edit mode
- **2x2 grids flatten** — Multi-row layouts are a consistent weak point
- **Broad edits cause section loss** — Unfocused instructions drop entire sections

**NB is an asset production tool, not a design tool.** The images are excellent as placeholders and visual references, but you cannot iterate on them the way you can with code or Figma. For wireframing, use Excalidraw. For production mockups, use Stitch or code generation.

**Best for:**
- Hero photos, card images, seasonal visuals, background images
- Persona illustrations for Trigger Map documents
- Mood boards and visual direction exploration
- Placeholder imagery during prototyping

For detailed guidance on AI wireframe generation (and why we recommend against it for iterative design), see [Module 09, Lesson 6: AI Wireframe Generation](../module-09-conceptual-sketching/lesson-06-ai-wireframe-generation.md).

---

### 3. UI Generators — Working Interfaces from Prompts

UI generators produce working interfaces — real HTML/CSS/React that you can interact with in the browser. This is the core WDS workflow.

**AI code generation (Claude, GPT, etc.)** — the agent generates working code directly from your specifications. You give it a spec, it builds a prototype. You click buttons, fill in forms, see hover states. This is real code, not a picture.

```
You: "Build the signup form from spec P02. Use our design tokens.
      Primary #0066FF, Inter font, 8px spacing scale."

Agent: Creates working HTML/CSS with all elements,
       states, and interactions from the spec.

You: Open in browser. Review. Give feedback.
```

**Google Stitch** — Google's AI UI design tool that generates real HTML/CSS code from text prompts or wireframe images. Available as an API with MCP server integration. Produces production-quality layouts with readable text, proper structure, and Figma export. 350 standard + 50 experimental generations per month.

**Best for:**
- Building working prototypes from specifications
- Iterating on layout, structure, and behavior
- Creating the production foundation
- Testing interactions and responsive behavior

---

## This Is Evolving

We are actively exploring these techniques as tools and capabilities develop rapidly. New image generation models, UI-specific generators, and Figma integrations appear regularly.

**What we've tested:**
- **Nanobanana MCP** for image generation — excellent for image assets (hero photos, card images, persona illustrations). Not suitable for wireframes or mockups due to garbled text, non-editable output, and layout limitations. See [Module 09, Lesson 6](../module-09-conceptual-sketching/lesson-06-ai-wireframe-generation.md) for detailed findings.
- **code.to.design** for Figma round-trips — established workflow
- **Figma MCP** for reading designs into code — works
- **AI code generation** (Claude, GPT) for UI building — core WDS workflow
- **Google Stitch** for UI generation — API and MCP available, generates real HTML/CSS

**Recommended tool roles (as of February 2026):**

| Tool | Role | Why |
|------|------|-----|
| **Excalidraw** | Wireframes | Editable, fast iteration, user can drag and resize |
| **Nano Banana** | Image assets | Hero photos, card images, illustrations, mood visuals |
| **Google Stitch** | Production mockups | Real HTML/CSS output, readable text, Figma export |
| **Figma** | Final polish | Pixel-level refinement, design system management |
| **AI code gen** | Prototypes | Working interactive prototypes from specs |

**Share your experience:** If you discover techniques that work well, or tools we haven't covered, share them in the Discord forum **#UX-design-channel**. This course evolves based on what the community learns together.

---

## Prompting for Visual Output

Whether you're generating code, images, or Figma designs, the quality of your output depends on the quality of your input.

### Prompt Structure for Code Generation

```
Generate [element type] based on this specification:

[Paste your specification]

Visual requirements:
- Font: [font family]
- Primary color: [hex code]
- Background: [color/style]
- Size: [dimensions or responsive]

Focus on: [what's most important]
```

### Example

```
Generate a signup form based on this specification:

## Signup Form
- Email field (required, validates email format)
- Password field (required, 8+ chars, show/hide toggle)
- Submit button: "Create Free Account"
- Terms link below
- Login link for existing users

Visual requirements:
- Font: Inter
- Primary color: #0066FF
- Background: White with subtle gray (#F9FAFB)
- Size: Mobile-first (max-width 400px)

Focus on: Clean, minimal, low friction
```

### Prompt Tips for Image Generation

When generating visual concepts or mood boards:

- Describe the feeling, not just the elements ("warm, inviting, professional" not just "signup form")
- Reference styles ("in the style of Stripe's marketing pages")
- Specify what you'll use the image for ("mood board for the onboarding flow")
- Include constraints ("mobile-first, accessible, brand colors #0066FF and #1A1A2E")

---

## Refining Generated Output

AI output is a starting point, not a final product. Regardless of which method you used, here's what to check and refine.

### Spacing

- AI often under- or over-spaces
- Adjust for visual rhythm
- Ensure breathing room around elements

### Typography

- Check font weights
- Verify line heights
- Adjust size hierarchy

### Colors

- Verify contrast ratios
- Check hover states
- Ensure consistency with tokens

### Touch Targets

- Buttons 44px minimum
- Adequate spacing between tap targets
- Test on actual devices

---

## Designing States

Each interactive element needs its states designed:

### Default

The initial appearance. What users see on load.

### Hover

Feedback on mouseover:
- Slight color change (10% darker)
- Subtle shadow or elevation
- Cursor change

### Active/Pressed

Feedback on click:
- Darker than hover
- Slight scale down (98%)
- Pressed appearance

### Focus

For keyboard navigation — must be visible:
- Outline (2px solid)
- Offset from element
- Sufficient contrast

### Disabled

When interaction is blocked:
- Reduced opacity (50-60%)
- No hover effects
- Cursor: not-allowed

### Loading

During async operations:
- Spinner or skeleton
- Reduced interactivity
- Progress indication

### Error

When something fails:
- Error color (usually red)
- Clear message
- Recovery path visible

---

## Accessibility in Visual Design

### Color Contrast

- Text on background: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Tools:** Contrast checkers in Figma, browser extensions

### Focus Visibility

- Focus rings must be visible
- 3:1 contrast against background
- Don't hide on mouse use

### Touch Targets

- Minimum 44x44px for touch
- 24x24px for precise mouse input
- Adequate spacing between targets

---

## Consistency Patterns

### Token Application

Apply tokens consistently:

```css
/* All primary buttons use same color */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

/* All headings use same scale */
h1 { font: var(--type-heading-1); }
h2 { font: var(--type-heading-2); }

/* All spacing uses same scale */
.card { padding: var(--space-lg); }
.stack > * + * { margin-top: var(--space-md); }
```

### Component Reuse

Same component, same styling:
- Buttons look identical across pages
- Inputs behave the same everywhere
- Cards have consistent structure

---

## Visual Design Checklist

For each page:

- [ ] Layout matches specification
- [ ] Visual hierarchy correct (primary element dominates)
- [ ] Typography applied from tokens
- [ ] Colors from palette/brand
- [ ] Spacing consistent (uses token scale)
- [ ] All states designed (default, hover, loading, error, etc.)
- [ ] Contrast ratios pass WCAG
- [ ] Touch targets adequate
- [ ] Responsive behavior defined

---

## What's Next

In the tutorial, you'll generate and refine visuals for your own specifications, working through the design loop until you have polished, validated prototypes.

---

**[Continue to Tutorial: Create Your Visuals →](tutorial-15.md)**

---

[← Back to Lesson 1](lesson-01-making-it-visible.md) | [Back to Module Overview](module-15-visual-design-overview.md)

*Part of Module 15: Visual Design*
