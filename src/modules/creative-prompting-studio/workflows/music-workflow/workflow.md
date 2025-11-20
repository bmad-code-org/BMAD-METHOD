# Music Composition Workflow - Suno Prompting

**Agent**: Suno Composer
**Purpose**: Create professional-quality instrumental music using Suno AI

## Overview

This workflow guides you through crafting effective music prompts using the Four Pillars Framework, ensuring Suno produces high-quality instrumental compositions.

## When to Use

- Background music for videos
- Podcast intros and outros
- Game soundtracks
- Ambient and atmospheric tracks
- Marketing and promotional music
- Personal music projects
- Learning music composition
- Any instrumental music needs

## Workflow Steps

### Step 1: Define Musical Vision

**Goal**: Clarify your musical concept

**Actions**:
1. Describe the musical idea or feeling
2. Identify intended use case
3. Determine length (short, medium, long based on {{music_default_length}})
4. Define mood and energy level
5. Consider audience and context

**Questions**:
- What's the primary emotion or mood?
- Where will this music be used?
- What genre or style feels right?
- What energy level (calm, energetic, building)?

**Command**: `analyze-music-concept`

### Step 2: Ensure Instrumental-Only Output

**Goal**: Configure Suno to exclude vocals

**Three Methods (use all for reliability)**:

1. **Toggle Method**
   - Navigate to Custom Mode
   - Activate "Instrumental" switch

2. **Exclusion Method**
   - In "Exclude Styles" field: `vocals, male vocals, female vocals, singing, lyrics`

3. **Meta-Tag Method**
   - Use structural tags in Lyrics box
   - No lyrical content, only tags like `[Intro]`, `[Build]`

### Step 3: Apply Four Pillars Framework

**Goal**: Build comprehensive musical description

#### Pillar 1: Genre & Style

- Be specific with subgenres
- ❌ "Electronic" → ✅ "Progressive house"
- ❌ "Rock" → ✅ "Instrumental post-rock"
- Consider genre fusion for unique sounds

#### Pillar 2: Mood & Atmosphere

- Define emotional qualities precisely
- "Ethereal and dreamy"
- "Dark and brooding"
- "Uplifting and energetic"
- "Melancholic yet hopeful"

#### Pillar 3: Instrumentation & Sound Design

- Specify instruments explicitly
- "Analog synths, deep bass, reverb-heavy drums"
- "Acoustic guitar, piano, subtle strings"
- "Orchestral brass, timpani, sweeping strings"
- Include production effects

#### Pillar 4: Structure & Dynamics

- Map track progression
- "Slow intro, gradual build, powerful drop"
- "Steady verse, energetic chorus, breakdown bridge"
- Define energy arcs and transitions

**Command**: `create-music-prompt`

### Step 4: Set Tempo and Key

**Goal**: Define rhythmic and harmonic foundation

**Tempo Options**:
- Use BPM values (e.g., "120 BPM")
- Classical terms: Adagio, Andante, Allegro, etc.
- Genre-appropriate ranges:
  - Ambient: 50-80 BPM
  - Lo-fi: 70-90 BPM
  - House: 120-130 BPM
  - Drum & Bass: 160-180 BPM

Default: {{default_music_tempo}} BPM

**Musical Key**:
- Specify if important for your use
- "C minor", "A major", "F# minor"
- Affects mood and tonality

### Step 5: Structure with Meta Tags

**Goal**: Organize composition with tags

**Structural Tags**:
```
[Intro]
[Verse]
[Chorus]
[Bridge]
[Outro]
```

**Dynamic Tags**:
```
[Build]
[Drop]
[Breakdown]
[Climax]
[Fade Out]
```

**Instrumental Tags**:
```
[Piano Solo]
[Guitar Solo]
[Synth Solo]
[Drum Solo]
```

**Mood Tags**:
```
[Melancholic Atmosphere]
[Euphoric Build]
[Serene Ambience]
```

**Example Meta Tag Structure**:
```
[Intro - Ambient]
[Build]
[Verse - Piano Lead]
[Chorus - Full Orchestra]
[Breakdown]
[Bridge - Synth Solo]
[Climax]
[Outro - Fade Out]
```

### Step 6: Configure Advanced Settings

**Goal**: Optimize Suno's creative parameters

**Style Influence (0-100%)**:
- **Recommended for Instrumentals**: 70-85%
- Controls adherence to your specifications
- Higher = stricter, Lower = more experimental

**Weirdness (0-100%)**:
- **Recommended**: 40-60%
- WARNING: Below 30% sounds robotic
- 40-60% provides natural variation
- Above 70% becomes chaotic

**Audio Influence (0-100%)** (if using reference):
- 0-40%: Light inspiration
- 50-70%: Strong style influence
- 80-100%: Close adherence

**Default Settings**:
- Style Influence: {{default_style_influence}}%
- Weirdness: {{default_weirdness_level}}%

### Step 7: Review Quality Checklist

**Goal**: Ensure prompt completeness

**Checklist**:
- ✅ Specific genre/subgenre identified
- ✅ Mood and atmosphere defined
- ✅ Instrumentation explicitly listed
- ✅ Structure and dynamics mapped
- ✅ Tempo specified (BPM or classical term)
- ✅ Vocals excluded via all three methods
- ✅ Meta tags structured appropriately
- ✅ Advanced settings configured
- ✅ Production quality mentioned

**Command**: `refine-music-prompt`

### Step 8: Generate and Enhance

**Goal**: Create music and improve quality

**Generation Process**:
1. Input all prompt elements
2. Configure Custom Mode (Instrumental ON)
3. Set Advanced Settings
4. Generate 2-4 variations
5. Evaluate results

**Quality Enhancement**:

**Remaster Feature**:
- Regenerates with latest technology
- Improves clarity and fidelity
- Use 1-2 passes maximum

**Command**: `apply-remaster`

**Stem Separation**:
- Isolates instrumental components
- Useful for mixing or verification

**Command**: `create-stem-separation`

**Multi-Remaster Approach**:
- Create 3-4 variations
- Emphasize different frequency ranges
- Compare and select best

## Output Deliverables

### Music Prompt Document

Saved to: `{{music_prompts_folder}}/[project-name]-music-prompt.md`

**Contents**:
```markdown
# Music Prompt: [Project Name]

## Musical Vision
[Concept, mood, intended use]

## Suno Configuration

### Style Field
[Detailed genre, mood, instrumentation, structure, tempo description]

### Exclude Styles
vocals, male vocals, female vocals, singing, lyrics

### Lyrics/Meta Tags
[Intro - Ambient Pads]
[Build - Add Bass]
[Verse - Piano Lead]
[Chorus - Full Instrumentation]
[Breakdown - Minimal]
[Bridge - Guitar Solo]
[Climax - Epic Build]
[Outro - Fade Out]

## Advanced Settings
- Style Influence: 75%
- Weirdness: 50%
- Audio Influence: N/A (or specify if using reference)

## Custom Mode
- ✅ Instrumental: ON
- Duration: Medium (2-3 minutes)

## Musical Breakdown
- **Genre**: Progressive house, synthwave influences
- **Tempo**: 128 BPM (Allegro)
- **Key**: C minor
- **Instrumentation**: Analog synths, deep sub-bass, crisp hi-hats, atmospheric pads
- **Structure**: Slow intro → building tension → powerful drop → melodic break → climactic outro
- **Production**: Sidechain compression, reverb-heavy, warm analog saturation

## Variation Ideas
- Try 124 BPM for slightly more relaxed feel
- Add arpeggiated synth in breakdown
- Experiment with different key (A minor)

## Metadata
- Length: Medium (2-3 min)
- Created: [Date]
- Status: [Draft/Generated/Remastered]
- Versions: [List generated versions]
```

## Success Criteria

A successful music workflow produces:
- ✅ Complete prompt with all Four Pillars
- ✅ Instrumental-only configuration
- ✅ Appropriate meta tag structure
- ✅ Optimized Advanced Settings
- ✅ Professional production quality
- ✅ Documented for future reference
- ✅ Variations explored

## Troubleshooting

**Problem**: Vocal artifacts appear
- **Solution**: Add vocals to Exclude Styles, lower Weirdness to 40-50%

**Problem**: Muddy or distorted sound
- **Solution**: Mention "clean production, crisp mix", apply Remaster, prioritize acoustic instruments

**Problem**: Repetitive or boring
- **Solution**: Use dynamic meta tags, increase Weirdness to 50-60%, vary instrumentation across sections

**Problem**: Wrong genre vibe
- **Solution**: Increase subgenre specificity, raise Style Influence to 80-90%, use Audio Upload reference

**Problem**: Wrong tempo/energy
- **Solution**: Specify exact BPM, use tempo terminology, ensure it matches genre standards

## Tips for Success

1. **Be Genre-Specific**: "Synthwave" beats "electronic music"
2. **Exclude Vocals Always**: Use all three methods
3. **Watch Weirdness**: Never below 30%, sweet spot 40-60%
4. **Use Meta Tags**: Structure creates professional results
5. **Specify BPM**: Exact numbers work better than vague "fast"
6. **Name Instruments**: List specific sounds explicitly
7. **Plan Structure**: Map intro → build → climax → outro
8. **Test Variations**: Generate 2-4 versions, compare
9. **Remaster Wisely**: 1-2 passes, not more
10. **Document Success**: Save effective prompts for future projects

## Genre-Specific Quick Commands

**Commands**:
- `create-electronic-prompt` - Electronic/EDM template
- `create-ambient-prompt` - Ambient/atmospheric template
- `create-cinematic-prompt` - Cinematic/orchestral template
- `create-lofi-prompt` - Lo-fi/chillhop template
- `create-jazz-prompt` - Jazz/fusion template
- `create-rock-prompt` - Instrumental rock template

---

*Master the art of AI music composition with Suno's powerful instrumental generation capabilities.*
