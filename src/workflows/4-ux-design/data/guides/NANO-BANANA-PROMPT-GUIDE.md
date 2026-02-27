# Nano Banana Prompt Composition Guide

**Purpose:** How to translate WDS page specifications into effective AI image generation prompts.

---

## The Core Problem

Page specifications are verbose (500–1000+ lines). Nano Banana accepts:
- **prompt**: max 8192 characters
- **system_instruction**: max 512 characters
- **input images**: up to 3 reference images for visual conditioning

This guide defines what to extract, what to skip, and how to balance creativity with spec adherence.

---

## What to Extract from Specs

### Always Include

| Element | Where to find it | Example |
|---------|-----------------|---------|
| **Image descriptions** | `Content > Image:` fields | "Öland landscape — open fields, workshop in distance, blue sky" |
| **Section names + order** | `## Page Sections` headers | Header → Hero → Vehicle Icons → About → Trust → Seasons → Footer |
| **Section purposes** | `**Purpose:**` lines | "Instant emotional connection and phone number access" |
| **Primary headlines** | `Content > SE/EN:` (pick one language) | "Vi är Källa Fordonservice" |
| **CTA / action labels** | Button/link content fields | "Ring 0485-270 70", "Läs mer om oss" |
| **Color values** | Visual direction or design tokens | Blues/grays, white background, red accent |
| **Font family** | Typography direction | Inter or similar sans-serif |
| **Layout pattern** | Layout Structure section | "3 columns desktop, 1 column mobile" |
| **Brand mood words** | Visual direction | Professional, local, reliable, Nordic |

### Always Skip

| Element | Why |
|---------|-----|
| Object IDs (`hem-hero-image`) | Development metadata, irrelevant to visual output |
| HTML tags (h1, h2, p, section) | Semantic structure, not visual |
| Component file paths | Internal references |
| Behavior / interaction states | Hover/active/disabled — static image can't show these |
| Accessibility attributes (aria-label) | Screen reader metadata |
| SEO section (meta descriptions, structured data) | Search engine metadata |
| Object Registry tables | Summary tables with no visual info |
| Checklists and Open Questions | Process tracking |
| Secondary/tertiary language content | Pick one language per generation |
| Font sizes in px | Too prescriptive for AI — describe hierarchy instead ("large bold headline", "smaller body text") |

---

## Prompt Budget Allocation

**Total: 8192 characters**

| Section | Faithful | Expressive | Vision |
|---------|----------|------------|--------|
| Creative preamble | 200 | 300 | 500 |
| Page/section context | 300 | 300 | 200 |
| Layout structure | 800 | 600 | 200 |
| Image descriptions | 1000 | 1000 | 1500 |
| Design tokens (colors, fonts) | 500 | 400 | 300 |
| Key content (headlines, CTAs) | 2000 | 1500 | 500 |
| Brand atmosphere | 200 | 500 | 1000 |
| **Buffer / user additions** | **3192** | **3592** | **3992** |

The buffer is intentionally large — prompt quality comes from clarity, not length.

---

## System Instruction Templates (max 512 chars)

### Faithful Mode
```
Professional UI designer creating a clean, realistic interface mockup.
Use specified colors and typography precisely. Show actual text content,
not placeholders. Standard mobile/web UI patterns. Sharp, production-ready look.
```

### Expressive Mode
```
Creative UI designer making a polished, visually appealing interface.
Follow the general layout structure but take creative liberties with
visual treatments, lighting, depth, and atmosphere. Make it look like
a real, beautiful product that inspires confidence.
```

### Vision Mode
```
Brand visual artist creating an artistic concept. Capture the emotional
essence and personality of the brand. Focus on color story, mood, light,
and feeling. The layout is a rough guide, not a constraint. Create something
that makes people feel the brand before they read a word.
```

### Image Asset Mode
```
Professional photographer/illustrator creating a single image for use
on a website. The image should feel authentic, not stock-photo polished.
Natural lighting, real environments, documentary style. High quality,
suitable for hero banners or content cards.
```

---

## Worked Example: Kalla 1.1-hem Hero Image

**Source spec:** 1.1-hem.md, Object `hem-hero-image`

**Spec image description:**
> "Öland landscape — open fields, the workshop visible in the distance, blue sky. Warm, inviting, unmistakably Öland."

**User creative override:**
> "Make the sky a dramatic sunset"

**Reference images provided:**
1. Verkstad-01.jpg (workshop exterior)
2. Verkstad-02.jpg (workshop angle)
3. Kalla-Logo.jpg (brand logo — for color/style context)

**Composed system_instruction** (298 chars):
```
Professional photographer creating a hero banner image for a Swedish
car workshop website. Authentic, documentary style. Natural Öland light.
The workshop is a community hub — warm, trustworthy, approachable.
Not stock-photo polished. Real place, real feeling.
```

**Composed prompt** (682 chars):
```
Wide landscape photograph of a Swedish car workshop (Källa Fordonservice)
on northern Öland. The workshop building is visible in the middle distance,
surrounded by the flat, open Öland landscape with low stone walls and
sparse vegetation.

The sky is a dramatic sunset — deep oranges, purples and golds spreading
across a vast Nordic sky. The golden light catches the workshop building,
making it glow warmly against the landscape.

The mood is warm, inviting, and unmistakably Öland — wide horizons,
quiet strength, a place you can trust. The workshop feels like it belongs
to the landscape, not imposed on it.

Colors: warm golden sunset tones, cool blue-gray Swedish twilight,
earthy workshop browns. Professional but human.
```

**Parameters:**
- `aspect_ratio`: `16:9` (hero banner)
- `model_tier`: `pro`
- `negative_prompt`: "stock photo, generic, urban, text overlay, watermark"

---

## Worked Example: Full Page Mockup

**Scope:** Full page, Expressive mode, Mobile (9:16)

**Composed prompt** (~2800 chars):
```
Mobile UI mockup (portrait) for "Källa Fordonservice" — a car workshop
website in northern Öland, Sweden. Clean Swedish minimalism, professional
but warm and approachable.

Page layout from top to bottom:

1. HEADER: Logo "Källa Fordonservice" on left. Phone icon and "Kontakta"
   button on right. Clean, minimal top bar.

2. SERVICE MENU: Horizontal scrollable menu below header with service
   categories: Service, Reparationer, AC, Däck, Yrkesmaskiner, Tunga fordon.
   Subtle, secondary navigation.

3. HERO SECTION: Full-width landscape photo of Öland with workshop in
   distance, dramatic sunset sky. Phone number "0485-270 70" overlaid
   in a semi-transparent dark box with white text, centered in lower third.
   The hero image dominates — emotional first impression.

4. VEHICLE ICON BAR: Row of 4 small vehicle icons below hero:
   Motorcycle, Car, Motorhome, Bus. Simple line icons with labels.
   Shows breadth of service.

5. ABOUT PREVIEW: Two-column on desktop, stacked on mobile.
   Left: Photo of two mechanics (Björn & Nauriz) in workshop, candid,
   friendly. Right: Heading "Vi är Källa Fordonservice" + short intro
   paragraph. Trust badges row below (3 small partner logos, muted).
   "Läs mer om oss →" link.

6. TRUST CARDS: Three cards in a row (stacked on mobile). Each has:
   image (4:3), heading, 2-line teaser text. White cards with subtle shadow.
   Topics: "En riktig bilverkstad", "Däck till alla fordon",
   "Del av Autoexperten".

7. SEASONS SECTION: Heading "Så skiftar säsongerna i Källa" centered.
   Four cards below (2×2 grid on mobile): Spring, Summer, Autumn, Winter.
   Each with atmospheric Öland seasonal photo, season name, teaser text.
   Warm, editorial feel.

8. FOOTER: Contact info, address, phone. Simple, functional.

Design details:
- Background: white or very light gray
- Text: dark charcoal, strong readable sans-serif (Inter)
- Accent: deep blue for links, subtle red for CTAs
- Cards: white with soft shadow (2-3px), rounded corners (4-8px)
- Images: warm, authentic, documentary style
- Generous whitespace between sections
- Mobile single-column, thumb-friendly
```

---

## Section Focus Mode

When generating a single section at high fidelity, spend the full prompt budget on that section. Include:

- All object details for that section
- Full content text (still one language)
- Precise visual style descriptions
- Layout relationships between objects
- Image descriptions with user overrides

This is useful for iterating on hero sections, card layouts, or navigation patterns before generating the full page.

---

## Generation Modes: Generate vs Edit

Nano Banana supports two fundamentally different modes:

### Generate Mode
Creates images from scratch. Reference images (input_image_path_1/2/3) influence **style and subject** but NOT layout.

**Use for:**
- Standalone image assets (hero photos, card images)
- Wireframes from page specifications (no visual input needed)
- When you have NO layout reference to work from

### Edit Mode
Transforms an existing image. The primary input image (slot 1) controls **layout structure** — section order, proportions, element placement are preserved. Additional images influence style.

**Use for:**
- Wireframe → Mockup transformation (recommended pipeline)
- Sketch → Digital wireframe conversion
- Iterative refinement of existing mockups

**Critical rules for edit mode:**
- **Always pin `aspect_ratio`** — if omitted, model may change aspect ratio and lose content
- **Targeted edits work, broad edits fail** — "add a nav bar to the header" succeeds; "make everything premium" drops sections
- **Adding > Removing** — model handles adding visible elements well, struggles to remove or restructure existing elements
- **Slot 1 = layout source** — put the image whose structure you want to keep in input_image_path_1

---

## Recommended Pipeline: Spec → Wireframe → Mockup

The most reliable approach for full-page mockups is a two-step pipeline:

### Step 1: Spec → Clean Wireframe (generate mode)

Use generate mode to create a clean digital wireframe from the page spec's layout structure. No photography, no colors — just gray boxes and text labels.

**Why this works:** Wireframes are NB's strength. Gray boxes + labels don't require photography or realistic text rendering. The structured layout data (column ratios, aspect ratios, element counts) translates directly into accurate placement.

**System instruction template:**
```
UX wireframe designer creating clean, precise digital wireframes. Use only
grayscale — light gray boxes for image placeholders, medium gray for backgrounds,
dark gray for text labels. No photography, no colors, no decoration. Professional
wireframe style. Clear section boundaries.
```

**Prompt structure:**
Describe each section top-to-bottom with specific layout instructions:
- Column ratios ("Left column ~50%, Right column ~50%")
- Element counts ("3 cards side by side", "11 icons in a row")
- Content labels ("heading: Vi är Källa Fordonservice")
- Image placeholder labels ("[HERO IMAGE — Öland landscape]")

**Preventing wireframe label leakage into mockups:**
ANY text in the wireframe will bleed into the mockup. This includes:
- Section annotations ("SECTION 1 — HEADER", "TRUST CARDS", "FOOTER")
- Placeholder labels ("[LOGO]", "[HERO IMAGE]", "[PHOTO — Name]")
- Descriptive text inside gray boxes

To minimize leakage:
- Use only real content text (actual headings, labels) — these are fine since they belong in the mockup
- Use empty gray boxes without text labels for image placeholders
- Avoid section titles that aren't part of the actual page design
- If labels are needed for your own reference, accept that some may leak and plan to iterate

**Parameters:**
- `mode`: `generate`
- `aspect_ratio`: `9:16` (full page portrait scroll)
- `model_tier`: `pro` (worth the quality for layout accuracy)
- `negative_prompt`: "photography, realistic images, colorful design, stock photos, polished UI, gradients, shadows"

### Step 2: Wireframe → Polished Mockup (edit mode)

Use edit mode with the generated wireframe as primary input to apply visual design while preserving layout.

**System instruction template:**
```
UI designer transforming wireframes into polished website mockups. Follow
the wireframe layout EXACTLY — section order, proportions, element placement.
Apply clean [brand style] with warm photography. Professional but human.
[viewport type] viewport.
```

**Prompt structure:**
Describe what to fill each placeholder with:
- Hero: specific scene description
- Photos: subject descriptions
- Cards: imagery for each card
- Colors: specific palette to apply
- Typography: font style

**Parameters:**
- `mode`: `edit`
- `input_image_path_1`: path to wireframe from step 1
- `input_image_path_2`: reference photo (optional, for style conditioning)
- `aspect_ratio`: MUST match step 1 (e.g., `9:16`)
- `model_tier`: `pro`
- `negative_prompt`: "wireframe style, gray boxes, placeholder text, section labels, annotations, sketch lines"

### Why This Pipeline Outperforms Direct Generation

| Approach | Layout accuracy | Visual quality | Reliability |
|----------|----------------|----------------|-------------|
| Direct generate (no reference) | Low — model invents layout | Medium | Unpredictable |
| Sketch → Mockup (edit) | Good — follows sketch structure | Medium-High | Good |
| **Spec → Wireframe → Mockup** | **High — spec-accurate** | **High** | **Best** |
| Iterative editing | Degrades with each pass | Varies | Poor for removal/restructure |

---

## Multi-Pass Strategy

Alternative workflow for thorough visual exploration (when not using the wireframe pipeline):

1. **Image assets first** — Generate key images (hero photo, card photos) as standalone assets
2. **Section focus** — Design critical sections (hero, trust cards) at high fidelity
3. **Full page mockup** — Combine everything into a page overview
4. **Iterate** — Refine based on user feedback

Each pass builds on the previous — reference images from pass 1 can condition pass 2.

---

## Batch Generation: Similar Page Sequences

Many projects have groups of pages that share the same layout but differ in content: vehicle type pages, service pages, article pages, product pages.

### The Template-and-Swap Pattern

1. **Design once** — Generate and iterate on ONE page until the user approves the visual direction
2. **Extract the template** — The approved prompt becomes a reusable template with swap points
3. **Generate the rest** — For each remaining page, swap in the unique content and generate

### Example: 11 Vehicle Type Pages

**Template prompt** (from approved 3.4-personbil):
```
Mobile UI mockup for a vehicle type page on "Källa Fordonservice" website.
Swedish minimalism, professional but warm.

Layout:
1. HEADER + SERVICE MENU (shared)
2. HERO: Full-width photo of {VEHICLE_IMAGE_DESCRIPTION}
   Heading: "{VEHICLE_NAME}" in bold
3. VEHICLE ICON BAR: {VEHICLE_TYPE} icon highlighted
4. SERVICES LIST: What we do for {VEHICLE_NAME_LOWERCASE}:
   {SERVICE_BULLETS}
5. CTA: "Ring oss: 0485-270 70"
6. RELATED ARTICLES: 2-3 article cards relevant to {VEHICLE_TYPE}
7. FOOTER (shared)

Design: white background, dark charcoal text, deep blue accent,
white cards with subtle shadow, warm authentic imagery.
```

**Swap table:**

| Page | VEHICLE_NAME | VEHICLE_IMAGE_DESCRIPTION | SERVICE_BULLETS |
|------|-------------|--------------------------|-----------------|
| 3.1 | Gräsklippare | Lawn mower on green garden, Öland summer | Service, reparation, vintervård |
| 3.2 | Moped/Skoter | Moped on coastal road | Service, reparation, besiktning |
| 3.9 | Traktor | Tractor in agricultural field, earth tones | Service, hydraulik, däck |
| ... | ... | ... | ... |

### Key Principles for Batch Generation

- **Shared parameters stay fixed:** system_instruction, creative mode, aspect ratio, design tokens, reference images
- **Only content swaps:** image descriptions, headlines, service lists, section-specific text
- **Sequential generation:** Generate one at a time, quick-review each, flag outliers for iteration
- **Use `flash` model tier** for batch runs (faster, cheaper) — save `pro` for the template page
- **Track everything** in the agent experience file for reproducibility

---

## Known Limitations

Documented from extensive testing on Kalla Fordonservice 1.1-hem (13+ generations, Feb 2026).

### What NB is Good At

| Use case | Quality | Notes |
|----------|---------|-------|
| **Wireframe generation from spec** | Excellent | Best use case. Structured layout data → accurate gray-box wireframes |
| **Single image assets** (hero photos, card images) | Good | Generate mode with descriptive prompts works well |
| **Style transfer via reference images** | Good | Slot 2-3 photos influence color/mood/subject effectively |
| **Adding elements** (edit mode) | Fair | Can add nav bars, icons, logos to existing images |
| **Wireframe → Mockup transformation** | Fair | Layout preserved, but wireframe text/labels leak through |

### What NB Struggles With

| Limitation | Severity | Workaround |
|------------|----------|------------|
| **Text rendering** | Critical | ALL generated text is garbled. Spec is source of truth — never trust AI text. Use mockups for layout/mood only |
| **Logo reproduction** | High | Cannot faithfully reproduce a provided logo. Generates an "inspired by" version. Use real logo in implementation |
| **Wireframe label leakage** | High | Placeholder text like "[LOGO]", "TRUST CARDS", section annotations bleed from wireframe into mockup. Minimize text in wireframes |
| **Removing elements** (edit mode) | High | Edit mode cannot reliably remove things (icons, labels, sections). Regenerate from wireframe instead |
| **Restructuring layout** (edit mode) | High | Cannot move elements to different positions (e.g., nav links from separate row into header). Regenerate |
| **Broad edit instructions** | High | "Make everything premium" causes section loss. Must use targeted, specific edits |
| **Aspect ratio drift** (edit mode) | Medium | If `aspect_ratio` not pinned, model changes it and drops below-fold content |
| **Grid layouts** | Medium | 2×2 grids often flatten to 1×4 rows. Specify "2 rows, 2 columns" explicitly |
| **Iterative degradation** | Medium | Each edit pass introduces drift. After 2-3 edits, regenerate from wireframe |

### Critical Rules

1. **All text is wrong** — mockups are for layout and visual direction only, never for content accuracy
2. **Always pin `aspect_ratio` in edit mode** — omitting it is the #1 cause of content loss
3. **One targeted change per edit** — never combine multiple changes in one edit call
4. **Regenerate > Edit for structural changes** — if you need to move, remove, or restructure elements, go back to wireframe step
5. **Pro model for anything structural** — Flash is only for quick image asset iterations
6. **No section labels in wireframes** — any text in the wireframe will appear in the mockup

### Where NB Fits in the Design Workflow

NB is best as an **image asset production tool**, not a layout or mockup tool. AI-generated wireframes and mockups are dead images — the user cannot drag a section, resize a column, or annotate feedback directly. Use editable tools (Excalidraw, Figma) for layout iteration.

**Use NB for:**
- Hero photography (landscapes, buildings, environments)
- People photos (team portraits, candid shots)
- Card and article imagery (seasonal photos, product shots)
- Mood and atmosphere exploration
- Placeholder images during design reviews

**Do NOT use NB for:**
- Wireframes (use Excalidraw — user can edit directly)
- Production mockups (use Google Stitch for HTML/CSS or Figma)
- Anything where text accuracy matters (all NB text is garbled)
- Anything the user needs to iterate on by hand

### Model Tiers

| Tier | Model | Input images | Strengths | Cost |
|------|-------|-------------|-----------|------|
| **Flash** | Gemini 2.5 Flash Image | 3 max | Fast, cheap. Good for single image assets | Low |
| **Pro** | Gemini 3 Pro Image | 14 objects + 5 characters | Better structural accuracy, higher thinking. Worth it for wireframes and first-pass mockups | Higher |

### Technical Limits

- Prompt: 8192 characters max
- System instruction: 512 characters max
- Negative prompt: 1024 characters max
- Input images don't consume Claude context — sent directly to Gemini via filesystem
- Output thumbnails returned by default (full image via `return_full_image: true`)
- `file_id` parameter causes validation errors when combined with `input_image_path` (known NB bug — use paths only)
