# Video Prompt: [Project Name]

**Date**: [Date]
**Creator**: {{user_name}}
**Duration**: {{video_default_duration}} seconds

## Concept

[Describe your visual vision and what you want to create]

### Purpose
[What is this video for? Where will it be used?]

### Mood
[What feeling should this evoke?]

## Sora 2 Prompt (Prose)

```
[Your complete, detailed visual description for Sora]
```

## Technical Parameters

**API Configuration** (set separately from prose prompt):
- **Model**: {{default_video_model}}
- **Size**: [1280x720 / 720x1280 / 1792x1024 / 1024x1792]
- **Duration**: {{video_default_duration}} seconds

## Cinematographic Breakdown

### Camera
- **Shot Type**: [Wide / Medium / Close-up / Extreme close-up]
- **Angle**: [Eye level / High / Low / Bird's eye / Dutch]
- **Lens**: [24mm / 35mm / 50mm / 85mm / 200mm]
- **Movement**: [Static / Pan / Tilt / Dolly / Tracking]

### Lighting
- **Direction**: [Front / Back / Side / Overhead / Underlighting]
- **Quality**: [Soft / Hard / Diffused / Dramatic]
- **Color Temperature**: [Warm / Cool / Neutral]
- **Time of Day**: [Golden hour / Blue hour / Midday / Night]

### Color Palette
1. [Primary Color]
2. [Secondary Color]
3. [Accent Color]
4. [Additional Color]
5. [Additional Color]

### Action Beats

**Duration**: {{video_default_duration}} seconds total

Break down the action with time-grounded beats:
- **0-2 sec**: [Specific action beat]
- **2-4 sec**: [Specific action beat]
- **4-6 sec**: [Specific action beat]
- **6-8 sec**: [Specific action beat]
- **8-10 sec**: [Specific action beat] (if 12-second duration)
- **10-12 sec**: [Specific action beat] (if 12-second duration)

### Style Anchors
- **Film Reference**: [e.g., "1970s film grain"]
- **Art Style**: [e.g., "Hand-painted animation"]
- **Aesthetic Period**: [e.g., "Film noir"]
- **Additional Style Notes**: [Any other style guidance]

### Depth of Field
[Shallow focus with bokeh / Deep focus / Rack focus - describe]

## Remix Suggestions

Ideas for variations to explore:
1. [One-element change, e.g., "Switch to 85mm lens for tighter framing"]
2. [One-element change, e.g., "Adjust lighting to blue hour for cooler tones"]
3. [One-element change, e.g., "Add subtle camera movement - slow dolly in"]

## Image References (Optional)

If using `input_reference` parameter:
- **Reference Image 1**: [Path/description]
- **Reference Image 2**: [Path/description]
- **Purpose**: [What these references provide - style, composition, color, etc.]

## Dialogue (If Applicable)

**Speaker 1**: "[Concise, natural line]"
**Speaker 2**: "[Concise, natural line]"

**Notes**:
- Keep lines brief and natural
- Coordinate with visual action
- Consider lip-sync implications

## Generation Log

### Version 1
- **Generated**: [Date]
- **Results**: [Brief notes on what worked/didn't work]
- **Changes for V2**: [Specific adjustments]

### Version 2
- **Generated**: [Date]
- **Results**: [Brief notes]
- **Changes for V3**: [Specific adjustments]

## Metadata

- **Project**: [Project name]
- **Use Case**: [Where this will be used]
- **Detail Level**: {{prompt_detail_preference}}
- **Status**: [Draft / Generated / Refined / Final]
- **Final File**: [Path to final video file]

## Notes

[Any additional notes, lessons learned, or patterns to remember]

---

**Saved to**: {{video_prompts_folder}}/[project-name]-video-prompt.md
