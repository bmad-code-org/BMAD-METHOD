# Image Generation Workflow - AI Image Prompting

**Agent**: Image Prompter
**Purpose**: Create effective prompts for AI image generation across multiple platforms

## Overview

This workflow guides you through crafting precise image prompts that produce high-quality results on Gemini, DALL-E, Midjourney, Stable Diffusion, and other AI image generators.

## When to Use

- Marketing visuals and graphics
- Social media content
- Product mockups
- Concept art and ideation
- Logo and branding elements
- Illustrations and artwork
- Photography-style images
- Any AI-generated image needs

## Workflow Steps

### Step 1: Define Visual Concept

**Goal**: Clarify your image vision

**Actions**:
1. Describe what you want to create
2. Identify the use case and platform
3. Choose aspect ratio ({{default_image_aspect_ratio}} or specify)
4. Determine style (photorealistic, illustration, etc.)
5. Consider technical requirements

**Questions**:
- What's the main subject or focus?
- What style or aesthetic do you want?
- Where will this image be used?
- What aspect ratio works best?

**Command**: `analyze-image-concept`

### Step 2: Select Template Type

**Goal**: Choose the right prompting structure

**Five Template Types**:

1. **Photorealistic** - Real-looking photos
   - Product photography
   - Lifestyle images
   - Nature and landscapes
   - Portrait photography

2. **Stylized/Illustrations** - Artistic renderings
   - Stickers and graphics
   - Cartoon/anime styles
   - Vector art
   - 3D renders

3. **Text-Heavy/Logos** - Typography and branding
   - Logo designs
   - Wordmarks
   - Badges and emblems
   - Typography art

4. **Product Mockups** - Staged product shots
   - Package design
   - Product photography
   - Mockup presentations
   - E-commerce images

5. **Minimalist** - Simple, clean designs
   - Minimal backgrounds
   - Single subject focus
   - Lots of negative space
   - Clean aesthetics

**Template Commands**: `template-photorealistic`, `template-stylized`, etc.

### Step 3: Build Scene Description

**Goal**: Create flowing narrative, not keyword lists

**Core Principle**: "Describe the scene, don't just list keywords"

**❌ Wrong Approach**:
```
sunset, ocean, beautiful, dramatic, colorful
```

**✅ Right Approach**:
```
A golden sunset casting warm orange and pink light across calm ocean waters, with dramatic purple clouds reflected in gentle waves
```

**Essential Elements Based on Template**:

#### For Photorealistic:
- **Shot Type**: Close-up, wide shot, medium shot, macro, aerial
- **Subject**: Detailed main focus description
- **Action**: What's happening
- **Environment**: Setting and context
- **Lighting**: Direction, quality, time of day
- **Mood**: Emotional tone
- **Camera Specs**: Lens, f-stop, film stock (if relevant)

#### For Stylized/Illustrations:
- **Style**: Flat design, 3D render, vector, cartoon, anime
- **Subject**: Character or object with personality
- **Characteristics**: Defining features
- **Color Palette**: 3-5 specific colors
- **Line Style**: Outlines, gradients, shading

#### For Text/Logos:
- **Type**: Logo, wordmark, badge, emblem
- **Exact Text**: "Text in quotes" (under 25 characters)
- **Font Style**: Serif, sans-serif, script, geometric
- **Colors**: Primary and accent colors
- **Elements**: Icons, shapes, decorative details

#### For Product Mockups:
- **Product**: Detailed item description
- **Surface**: Table, wall, hand, environment
- **Lighting**: Studio, natural, dramatic
- **Angle**: Top-down, 45-degree, straight-on
- **Context**: Props, environment elements

#### For Minimalist:
- **Single Subject**: One clear focal point
- **Background**: Solid color or simple gradient
- **Lighting**: Gentle, subtle highlights
- **Negative Space**: Deliberate emptiness
- **Orientation**: Portrait, landscape, square

**Command**: `create-image-prompt`

### Step 4: Add Visual Specificity

**Goal**: Replace vague terms with concrete details

**Vague → Specific Conversions**:
- "Beautiful lighting" → "Soft golden hour light from the left, creating long shadows"
- "Nice composition" → "Rule of thirds composition with subject in right third"
- "Good colors" → "Warm terracotta, burnt orange, cream, sage green palette"
- "Pretty scene" → "Serene lakeside setting with misty morning atmosphere"
- "Cool style" → "1980s Memphis design aesthetic with bold geometric shapes"

**Key Specificity Areas**:
1. **Colors**: Name 3-5 specific colors
2. **Lighting**: Direction and quality
3. **Composition**: Framing and layout rules
4. **Texture**: Material properties
5. **Style References**: Art movements, artists, periods

### Step 5: Optimize for Target Platform

**Goal**: Adapt prompt for specific AI tool

**Platform Considerations**:

**Gemini**:
- Natural, flowing descriptions
- Strong with photorealistic scenes
- Aspect ratios: 1:1, 16:9, 9:16, 3:4, 4:3
- Iterative refinement effective

**DALL-E**:
- Artistic styles and compositions
- Better text rendering (still limited)
- Detailed descriptions work well
- Supports inpainting and variations

**Midjourney**:
- Exceptional artistic control
- Use parameters: --ar, --v, --style
- Art movement references effective
- Great for creative/fantastical

**Stable Diffusion**:
- Tag-based prompting often works
- Negative prompts important
- Model-specific optimization
- High technical control

**Commands**: `optimize-for-gemini`, `optimize-for-dalle`, `optimize-for-midjourney`, `optimize-for-sd`

### Step 6: Define Technical Parameters

**Goal**: Set aspect ratio, style flags, and constraints

**Aspect Ratio**:
- 1:1 - Square (social media, balanced)
- 16:9 - Landscape (presentations, banners)
- 9:16 - Portrait (mobile, stories)
- 4:3 / 3:4 - Standard photos

**Style Modifiers** (platform-dependent):
- Photorealistic, illustration, 3D render
- Art movement references
- Artist style references
- Technical photography terms

**Text Constraints**:
- Keep text under 25 characters for reliability
- Simple, clear fonts render better
- Avoid complex typography

### Step 7: Review Quality Checklist

**Goal**: Ensure prompt effectiveness

**Checklist**:
- ✅ Scene description, not keyword list
- ✅ Specific, concrete visual details (no vague terms)
- ✅ 3-5 colors named specifically
- ✅ Lighting direction and quality described
- ✅ Composition and framing defined
- ✅ Style references included
- ✅ Aspect ratio appropriate
- ✅ Text under 25 characters (if applicable)
- ✅ Template structure followed
- ✅ Platform optimizations applied

**Command**: `refine-image-prompt`

### Step 8: Generate and Iterate

**Goal**: Create image and refine progressively

**Iterative Workflow**:
1. Generate initial image
2. Evaluate results
3. Change ONE element at a time
4. "Change the lighting to warmer"
5. "Adjust composition to place subject left"
6. Regenerate
7. Repeat until satisfied

**One Element at a Time**:
- ✅ "Make the lighting warmer"
- ✅ "Change background to sage green"
- ❌ "Make it better" (too vague)
- ❌ Change multiple elements simultaneously

**Command**: `iterate-image`

## Output Deliverables

### Image Prompt Document

Saved to: `{{image_prompts_folder}}/[project-name]-image-prompt.md`

**Contents**:
```markdown
# Image Prompt: [Project Name]

## Concept
[Visual vision and intended use]

## Primary Prompt

[Complete scene description with all details]

## Template Type
[Photorealistic / Stylized / Logo / Product / Minimalist]

## Technical Parameters
- Aspect Ratio: 1:1
- Style: Photorealistic
- Platform: Gemini (or other)

## Visual Breakdown
- **Subject**: [Main focus]
- **Composition**: [Framing and layout]
- **Lighting**: [Direction, quality, color temperature]
- **Color Palette**: [3-5 specific colors]
- **Texture**: [Material properties]
- **Mood**: [Emotional tone]
- **Style Reference**: [Art movement, period, or artist]

## Platform-Specific Notes
- **Gemini**: Natural description, iterative refinement
- **DALL-E**: [Specific recommendations if applicable]
- **Midjourney**: [Parameters if applicable]

## Iteration Log
1. Initial: [Base prompt]
2. Iteration 1: Changed lighting to golden hour
3. Iteration 2: Adjusted color palette to warmer tones
4. Final: [Final successful prompt]

## Metadata
- Created: [Date]
- Platform: [Primary AI tool]
- Status: [Draft/Generated/Refined/Final]
```

## Success Criteria

A successful image workflow produces:
- ✅ Flowing scene description (not keywords)
- ✅ Specific, concrete visual details
- ✅ Appropriate template structure
- ✅ Platform-optimized prompt
- ✅ Technical parameters defined
- ✅ Clear iteration strategy
- ✅ Documented for reference

## Tips for Success

1. **Describe Scenes**: Narrative flow, not keyword lists
2. **Be Specific**: Replace all vague terms with concrete details
3. **Name Colors**: 3-5 specific colors, not "colorful"
4. **Define Lighting**: Direction, quality, time of day
5. **One Change Per Iteration**: Progressive refinement
6. **Use Templates**: Structure prompts appropriately
7. **Keep Text Short**: Under 25 characters for reliability
8. **Reference Styles**: Art movements, artists, periods
9. **Consider Platform**: Optimize for your AI tool
10. **Document Success**: Save effective prompts

## Common Use Cases

### Social Media Graphics
- 1:1 aspect ratio
- Bold, eye-catching visuals
- Clear subject focus
- Platform-appropriate style

### Product Photography
- Use Product Mockup template
- Professional lighting
- Clean composition
- Context and staging

### Concept Art
- Stylized or photorealistic
- Detailed environmental descriptions
- Mood and atmosphere focus
- Reference art movements

### Logo Design
- Text-Heavy template
- Keep text under 25 characters
- Simple, clear fonts
- Defined color scheme

### Marketing Visuals
- Platform-appropriate ratios
- Brand-aligned color palettes
- Clear messaging and focus
- Professional production quality

---

*Master AI image prompting to create stunning visuals across any platform.*
