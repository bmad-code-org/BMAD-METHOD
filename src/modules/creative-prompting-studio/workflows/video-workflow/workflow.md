# Video Creation Workflow - Sora 2 Prompting

**Agent**: Sora Director
**Purpose**: Create cinematic, detailed prompts for Sora 2 AI video generation

## Overview

This workflow guides you through crafting effective video prompts using cinematographic principles, ensuring Sora 2 produces stunning, controlled visual content.

## When to Use

- Marketing and promotional videos
- Product showcases and demos
- Narrative scenes and storytelling
- Abstract and artistic visuals
- Educational content
- Social media content
- Concept visualization
- Any AI-generated video needs

## Workflow Steps

### Step 1: Define Video Concept

**Goal**: Clarify your visual vision

**Actions**:
1. Describe your core video idea
2. Identify the mood and emotional tone
3. Determine duration (4, 8, or 12 seconds)
4. Choose aspect ratio (landscape, portrait, square)
5. Define intended use and platform

**Questions**:
- What's the main visual story?
- What feeling should it evoke?
- Where will this be used?
- What's the key moment or action?

**Command**: `analyze-video-concept`

### Step 2: Choose Detail Level

**Goal**: Select appropriate prompt complexity

**Levels**:
- **Simple** - Basic description, AI creative freedom
- **Standard** - Clear direction with creative elements (recommended)
- **Detailed** - Comprehensive cinematographic specifications
- **Ultra-Detailed** - Maximum technical control

Based on {{prompt_detail_preference}}, but can override for specific needs.

**Commands**: `create-simple-prompt`, `create-standard-prompt`, `create-detailed-prompt`, `create-ultra-detailed-prompt`

### Step 3: Build Core Visual Description

**Goal**: Create precise, concrete visual details

**Essential Elements**:

1. **Visual Clarity** - Replace vague with specific
   - ❌ "A beautiful street at night"
   - ✅ "Wet asphalt, zebra crosswalk, neon signs reflecting in puddles"

2. **Camera Framing & Angle**
   - Shot type: Wide, medium, close-up, extreme close-up
   - Angle: Eye level, high angle, low angle, bird's eye, Dutch angle
   - Lens: 24mm wide, 50mm normal, 85mm portrait, 200mm telephoto

3. **Depth of Field**
   - Shallow focus with bokeh background
   - Deep focus with everything sharp
   - Rack focus (shift focus between elements)

4. **Action in Beats**
   - Time-grounded, specific movements
   - "Takes four steps, pauses, pulls curtain"
   - Not: "person walks and does something"

5. **Lighting & Color**
   - Direction: Front, back, side, overhead
   - Quality: Soft, hard, diffused, dramatic
   - 3-5 specific colors: "Golden hour amber, deep blue shadows, warm terracotta"
   - Time of day and atmosphere

6. **Style Anchors**
   - Film references: "1970s film grain", "Super 8 footage"
   - Art styles: "Hand-painted animation", "Photorealistic"
   - Aesthetic periods: "Film noir", "French New Wave"

**Command**: `create-video-prompt`

### Step 4: Define Technical Parameters

**Goal**: Set Sora API requirements

**Parameters** (configured separately from prompt):
- **Model**: {{default_video_model}} (sora-2 or sora-2-pro)
- **Size**: Based on aspect ratio
  - Landscape: 1280x720
  - Portrait: 720x1280
  - Wide: 1792x1024
  - Tall: 1024x1792
- **Duration**: {{video_default_duration}} seconds (4, 8, or 12)

### Step 5: Add Advanced Elements (Optional)

**Goal**: Include additional control for complex needs

**For Dialogue Scenes**:
- Keep lines concise and natural
- Label speakers clearly
- Coordinate dialogue with visual action

**Command**: `create-dialogue-scene`

**For Image References**:
- Provide reference images (JPEG, PNG, WEBP)
- Use `input_reference` parameter
- Guides visual style and aesthetic

**For Technical Control**:
- Shutter angle and film stock
- Atmospheric effects (rain, fog, dust)
- Wardrobe and props details
- Sound design implications

### Step 6: Review Cinematographic Elements

**Goal**: Ensure all visual components are specified

**Checklist**:
- ✅ Concrete, specific visual descriptions (no vague terms)
- ✅ Camera angle and lens choice specified
- ✅ Lighting direction and quality defined
- ✅ 3-5 specific colors named
- ✅ Action described in clear, time-grounded beats
- ✅ Style anchors and references included
- ✅ Duration-appropriate action complexity
- ✅ Depth of field indicated

**Command**: `refine-video-prompt`

### Step 7: Generate and Iterate

**Goal**: Create video and refine based on results

**Process**:
1. Use prompt in Sora with technical parameters
2. Generate video
3. Evaluate results
4. Make targeted adjustments using remix
5. Generate variations

**Remix Strategy**:
- Pin successful elements
- Change ONE aspect at a time
- "Switch to 85mm lens"
- "Make lighting warmer"
- "Slow down the action"

**Command**: `remix-video-prompt`

## Output Deliverables

### Video Prompt Document

Saved to: `{{video_prompts_folder}}/[project-name]-video-prompt.md`

**Contents**:
```markdown
# Video Prompt: [Project Name]

## Concept
[Visual vision and purpose]

## Sora Prompt (Prose)

[Complete, detailed visual description]

## Technical Parameters
- Model: sora-2
- Size: 1280x720 (landscape)
- Duration: 8 seconds

## Cinematographic Breakdown
- **Camera**: Wide shot, 35mm lens, static
- **Lighting**: Golden hour, warm side light from right
- **Color Palette**: Amber, terracotta, deep blue, cream, sage
- **Action Beats**: Subject enters frame left, walks 4 steps, turns to camera, smiles (2 sec each)
- **Style**: 1970s film aesthetic, slight grain

## Remix Suggestions
- Try 85mm lens for closer framing
- Adjust to blue hour for cooler tones
- Add camera movement (slow dolly in)

## Metadata
- Created: [Date]
- Duration: 8 seconds
- Status: [Draft/Generated/Refined]
```

## Success Criteria

A successful video workflow produces:
- ✅ Precise, cinematic prompt ready for Sora
- ✅ All technical parameters specified
- ✅ Visual elements clearly defined
- ✅ Action appropriate for duration
- ✅ Style and mood conveyed effectively
- ✅ Remix strategy planned
- ✅ Documented for iteration

## Tips for Success

1. **Be Visually Specific**: Every detail matters; replace vague with concrete
2. **Match Duration**: 4-second clips need simpler action than 12-second
3. **Think Cinematically**: You're directing a camera operator
4. **Use Color Precisely**: Name 3-5 specific colors, not "colorful"
5. **Time-Ground Actions**: "Takes four steps" not "walks"
6. **Embrace Variation**: Same prompt = different results; plan remixes
7. **Reference Styles**: Film periods, movements, aesthetics guide AI
8. **One Change at a Time**: Remix single elements for control

## Common Use Cases

### Product Showcase
- Clean, studio-style lighting
- Specific camera movements (rotate, dolly)
- Highlight key features with close-ups
- Professional, polished aesthetic

**Command**: `template-product-showcase`

### Narrative Scene
- Story-driven action beats
- Character focus and emotion
- Cinematic lighting and composition
- Style anchors for mood

**Command**: `template-narrative-scene`

### Abstract/Artistic
- Experimental visuals
- Focus on movement and color
- Creative lighting effects
- Art movement references

**Command**: `template-abstract-visual`

### Nature/Landscape
- Environmental details
- Natural lighting (golden hour, overcast)
- Atmospheric effects
- Wide establishing shots

**Command**: `template-nature-landscape`

---

*Master cinematic prompting to create stunning, controlled video content with Sora 2.*
