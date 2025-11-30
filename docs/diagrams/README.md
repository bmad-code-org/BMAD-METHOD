# BMM Workflow Diagram

This directory contains the BMM (BMad Method) workflow diagram and tools for generating it.

## Files

| File                               | Description                                         |
| ---------------------------------- | --------------------------------------------------- |
| `workflow-manifest.yaml`           | Workflow structure manifest (source of truth)       |
| `generate-manifest.md`             | Agentic prompt to generate/update manifest          |
| `bmm-workflow.d2`                  | D2 source diagram                                   |
| `bmm-workflow.svg`                 | Vector output (74KB)                                |
| `bmm-workflow.png`                 | Standard PNG (1600×1502, 257KB)                     |
| `bmm-workflow-print.png`           | High-res for Nano-Banana input (4000×3755, 732KB)   |
| `bmm-workflow-vintage.jpg`         | Print-ready vintage version (2144×1984, 1.1MB)      |
| `bmm-workflow-vintage-web.jpg`     | Web-optimized vintage (1400×1296, 281KB)            |
| `generate-bmm-workflow-diagram.md` | Generation prompt for Claude                        |
| `gracefully-age.prompt.md`         | Nano-Banana Pro prompt for vintage treatment        |
| `post-process-svg.py`              | SVG post-processing (labels, title, legend, footer) |
| `red-herring.png`                  | Fish stamp asset                                    |
| `fonts/`                           | ShareTechMono font files                            |

## Workflow Manifest System

The workflow manifest (`workflow-manifest.yaml`) is the **source of truth** for BMM workflow structure. It contains:

- All workflows organized by phase
- Workflow connections and dependencies
- Decision points (e.g., "Has UI?")
- Feedback loops (e.g., code review → dev)
- Cross-phase connections
- Output file patterns

### Generating/Updating the Manifest

Use the `generate-manifest.md` agentic prompt to create or update the manifest:

1. Feed `generate-manifest.md` to an agentic LLM (Claude, Gemini, etc.)
2. The agent will:
   - Scan `src/modules/bmm/workflows/` for all workflows
   - Extract workflow names, descriptions, and outputs from `workflow.yaml` files
   - Build the manifest with all connections and dependencies
   - Compare with existing manifest (if present)
   - **HARD STOP** if Quick Flow changes detected
   - Prompt for approval if main workflow changes detected
   - Write updated manifest to `workflow-manifest.yaml`

### When to Regenerate

Regenerate the manifest when:

- Adding new workflows
- Removing workflows
- Changing workflow outputs
- Changing workflow connections or dependencies
- Updating Quick Flow workflows (requires careful review)

### Change Detection

The manifest system includes intelligent change detection:

- **Quick Flow changes**: HARD STOP - these are critical paths
- **Main workflow changes**: User approval required
- **No changes**: Proceeds silently

## Generation Pipeline

### Step 1: Generate Base Diagram

Run the generation prompt with Claude:

```bash
# Claude will read generate-bmm-workflow-diagram.md and:
# 1. Analyze BMM workflow structure
# 2. Generate/update bmm-workflow.d2
# 3. Run d2 to create SVG
# 4. Post-process SVG
# 5. Convert to PNG
```

Or manually:

```bash
# Generate SVG from D2
d2 --font-regular=fonts/ShareTechMono-Regular.ttf \
   --font-bold=fonts/ShareTechMono-Regular.ttf \
   bmm-workflow.d2 bmm-workflow-technical.svg

# Post-process (shrink labels, outline title, add legend/footer/stamp)
python3 post-process-svg.py

# Convert to standard PNG
rsvg-convert bmm-workflow.svg -w 1600 -o bmm-workflow.png

# Convert to high-res PNG for Nano-Banana
rsvg-convert bmm-workflow.svg -w 4000 -o bmm-workflow-print.png

# Clean up
rm bmm-workflow-technical.svg
```

### Step 2: Vintage Treatment with Nano-Banana Pro

1. Go to [Nano-Banana Pro](https://nanobanana.org/) or use via Pixlr/Recraft

2. Upload `bmm-workflow-print.png` (the 4000px version)

3. Use the prompt from `gracefully-age.prompt.md`:
   - Applies aged paper texture, fold creases, coffee stains
   - Adds ink bleed and printing artifacts
   - Preserves all text, boxes, and arrows exactly
   - Does NOT apply sepia/fading (original colors are already vintage-toned)

4. Download the result (will be named something like `Gemini_Generated_Image_*.png`)

### Step 3: Remove the Watermark

Nano-Banana Pro adds a 4-pointed star watermark in the lower-right corner. Remove it:

```bash
# Set input file (adjust filename as needed)
INPUT=~/Downloads/Gemini_Generated_Image_XXXXX.png

# Find the watermark location (it's near the fish, bottom-right)
# The watermark is approximately at position (1950-2060, 1790-1900)

# Remove watermark by patching with nearby paper texture
magick "$INPUT" \
  \( -clone 0 -crop 120x120+1950+1680 +repage \
     \( -size 120x120 xc:black -fill white -draw "circle 60,60 60,5" -blur 0x12 \) \
     -alpha off -compose CopyOpacity -composite \) \
  -geometry +1950+1795 -compose over -composite \
  bmm-workflow-vintage-clean.png
```

**How this works:**

- Crops a 120×120 patch of clean paper texture from above the watermark (at +1950+1680)
- Creates a circular feathered mask to blend edges
- Composites the patch over the watermark location (+1950+1795)

**Verify the fix:**

```bash
# Crop the corner to check
magick bmm-workflow-vintage-clean.png -crop 600x600+1544+1384 /tmp/check.png
open /tmp/check.png  # or use any image viewer
```

The fish should be intact, watermark gone, no visible patch edges.

### Step 4: Fix the Legend

Nano-Banana garbles the small text in the legend. Fix by:

1. Covering the garbled text with vintage paper texture
2. Applying clean text with darken blend (preserves texture, shows text)

```bash
# Extract legend content from original (without outer borders)
magick bmm-workflow-print.png -crop 1600x450+1950+250 /tmp/legend-orig.png
magick /tmp/legend-orig.png -shave 25x25 /tmp/legend-content.png

# Scale to match Nano-Banana output
magick /tmp/legend-content.png -resize 831x211! /tmp/legend-content-scaled.png

# Sample clean paper texture (find an empty area - e.g., right of title)
magick bmm-workflow-vintage-clean.png -crop 100x100+900+120 /tmp/texture-patch.png

# Tile texture to cover legend area
magick /tmp/texture-patch.png -write mpr:tile +delete \
  -size 850x220 tile:mpr:tile /tmp/texture-tiled.png

# Cover garbled legend with tiled texture
magick bmm-workflow-vintage-clean.png \
  /tmp/texture-tiled.png -geometry +1055+143 -composite \
  /tmp/vintage-erased.png

# Apply clean text with darken blend (white becomes transparent)
magick /tmp/vintage-erased.png \
  /tmp/legend-content-scaled.png \
  -geometry +1059+147 -compose darken -composite \
  bmm-workflow-vintage-fixed.png
```

**Verify:**

```bash
magick bmm-workflow-vintage-fixed.png -crop 700x350+900+80 /tmp/legend-check.png
open /tmp/legend-check.png
```

The legend should have clean text on vintage paper texture, with box borders preserved.

### Step 5: Create Final Versions

```bash
# Print version (JPEG, 92% quality)
magick bmm-workflow-vintage-fixed.png \
  -quality 92 \
  bmm-workflow-vintage.jpg

# Web version (1400px wide, 85% quality)
magick bmm-workflow-vintage-fixed.png \
  -resize 1400x \
  -quality 85 \
  bmm-workflow-vintage-web.jpg

# Clean up
rm bmm-workflow-vintage-clean.png bmm-workflow-vintage-fixed.png
```

**File sizes:**

- Print: ~1.1MB (2144×1984 at 92% JPEG)
- Web: ~280KB (1400×1296 at 85% JPEG)

## Troubleshooting

### Watermark in wrong position

The watermark location varies slightly between Nano-Banana runs. To find it:

```bash
# Create a corner crop to locate the watermark
magick input.png -crop 600x600+1544+1384 /tmp/corner.png
open /tmp/corner.png
```

Look for the 4-pointed star shape near the fish. Adjust the patch coordinates accordingly.

### Patch is visible

If the patched area looks different from surroundings:

- Sample texture from a different location (try areas with similar color/texture)
- Increase blur radius for softer blending
- Use a smaller patch size

### Colors too dark/faded after Nano-Banana

The prompt in `gracefully-age.prompt.md` explicitly tells Nano-Banana NOT to apply sepia/fading since our original colors are already vintage-toned. If results are too dark, emphasize this more in the prompt.

### Legend position is off

The legend position depends on the Nano-Banana output dimensions. If dimensions differ from 2144×1984:

1. Calculate new scale factors: `new_width/4000` and `new_height/3755`
2. Adjust crop position: `1950 * width_scale`, `250 * height_scale`
3. Adjust legend size: `1600 * width_scale`, `450 * height_scale`

## Dependencies

- [D2](https://d2lang.com/) - Diagram scripting language
- [rsvg-convert](https://wiki.gnome.org/Projects/LibRsvg) - SVG to PNG conversion
- [ImageMagick](https://imagemagick.org/) (magick command) - Image manipulation
- Python 3 - For post-processing scripts
