#!/usr/bin/env python3
"""
Post-process BMM workflow diagram SVG.

Transforms raw D2 output into the final styled diagram.
Run from docs/diagrams directory.
"""

import re
import base64

# =============================================================================
# CONFIGURATION
# =============================================================================

INPUT_FILE = "bmm-workflow-technical.svg"
OUTPUT_FILE = "bmm-workflow.svg"
STAMP_FILE = "red-herring.png"

# =============================================================================
# PROCESSING STEPS
# =============================================================================

def process_svg():
    """Run all SVG post-processing steps in order."""
    with open(INPUT_FILE, 'r') as f:
        content = f.read()

    content = shrink_output_labels(content)
    content = outline_title(content)
    content = left_align_title(content)
    content = inject_legend(content)
    content = inject_stamp(content)

    with open(OUTPUT_FILE, 'w') as f:
        f.write(content)

    print(f"Post-processed: {INPUT_FILE} -> {OUTPUT_FILE}")


# =============================================================================
# STEP 1: Shrink output labels (@*.md)
# =============================================================================

def shrink_output_labels(content):
    """Make @*.md output labels smaller and grayed."""

    def shrink_tspan(match):
        tspan = match.group(0)
        return tspan.replace('<tspan', '<tspan font-size="24px" fill="#666666"')

    # Match tspan elements containing @...
    pattern = r'<tspan[^>]*>@[^<]*</tspan>'
    content = re.sub(pattern, shrink_tspan, content)

    return content


# =============================================================================
# STEP 2: Outline title text
# =============================================================================

def outline_title(content):
    """Make the title text have an outline/hollow effect."""

    # Pattern: <text ... fill="#1a3a5c" ... style="...font-size:4Xpx">
    pattern = r'(<text[^>]*)(fill="#1a3a5c")([^>]*style="[^"]*font-size:4\dpx[^"]*")'
    replacement = r'\1fill="none" stroke="#1a3a5c" stroke-width="1.5"\3'

    return re.sub(pattern, replacement, content)


# =============================================================================
# STEP 3: Left-align title
# =============================================================================

def left_align_title(content):
    """Left-align the title text."""

    def align_title(match):
        text_elem = match.group(0)
        text_elem = text_elem.replace('text-anchor:middle', 'text-anchor:start')
        text_elem = re.sub(r'x="[^"]*"', 'x="50"', text_elem)
        return text_elem

    pattern = r'<text[^>]*font-size:4[0-9]px[^>]*>BMAD METHOD[^<]*</text>'
    return re.sub(pattern, align_title, content)


# =============================================================================
# STEP 4: Inject legend
# =============================================================================

LEGEND_WIDTH = 1200
LEGEND_SVG = '''
<g id="legend" transform="translate({x}, {y})">
  <!-- Legend box -->
  <rect x="0" y="0" width="1200" height="336" rx="4" ry="4" fill="#fafafa" stroke="#666" stroke-width="1"/>

  <!-- Title -->
  <text x="20" y="32" font-family="ShareTechMono, monospace" font-size="24" font-weight="bold" fill="#333">OUTPUTS</text>

  <!-- Separator line -->
  <line x1="20" y1="46" x2="1180" y2="46" stroke="#999" stroke-width="1"/>

  <!-- Left column -->
  <text x="20" y="80" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@bmm-workflow-status.yaml</tspan>
    <tspan fill="#666"> · Workflow tracking</tspan>
  </text>
  <text x="20" y="116" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@product-brief.md</tspan>
    <tspan fill="#666"> · Product vision and scope</tspan>
  </text>
  <text x="20" y="152" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@tech-spec.md</tspan>
    <tspan fill="#666"> · Quick-flow technical spec</tspan>
  </text>
  <text x="20" y="188" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@PRD.md</tspan>
    <tspan fill="#666"> · Product requirements</tspan>
  </text>
  <text x="20" y="224" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@ux-design.md</tspan>
    <tspan fill="#666"> · UX/UI design spec</tspan>
  </text>
  <text x="20" y="260" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@architecture.md</tspan>
    <tspan fill="#666"> · System architecture</tspan>
  </text>
  <text x="20" y="296" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@impl-readiness-report.md</tspan>
    <tspan fill="#666"> · Readiness validation</tspan>
  </text>

  <!-- Right column -->
  <text x="620" y="80" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@epics.md</tspan>
    <tspan fill="#666"> · Epic and story breakdown</tspan>
  </text>
  <text x="620" y="116" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@sprint-status.yaml</tspan>
    <tspan fill="#666"> · Sprint progress tracking</tspan>
  </text>
  <text x="620" y="152" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@{{epic}}-{{story}}-*.md</tspan>
    <tspan fill="#666"> · Implementation stories</tspan>
  </text>
  <text x="620" y="188" font-family="ShareTechMono, monospace" font-size="20">
    <tspan fill="#333" font-weight="bold">@sprint-change-proposal.md</tspan>
    <tspan fill="#666"> · Course correction</tspan>
  </text>
</g>
'''

def inject_legend(content):
    """Inject legend box in top-right corner."""

    legend_y = 180

    # Find Phase 4 right edge
    phase4_match = re.search(
        r'phase4-box[^>]*>.*?<rect[^>]*x="([0-9.]+)"[^>]*width="([0-9.]+)"',
        content, re.DOTALL
    )

    if phase4_match:
        phase4_x = float(phase4_match.group(1))
        phase4_w = float(phase4_match.group(2))
        legend_x = phase4_x + phase4_w - LEGEND_WIDTH + 97
    else:
        legend_x = 2314 - LEGEND_WIDTH + 97

    legend = LEGEND_SVG.format(x=legend_x, y=legend_y)

    last_svg_pos = content.rfind('</svg>')
    if last_svg_pos != -1:
        content = content[:last_svg_pos] + legend + '\n' + content[last_svg_pos:]

    return content


# =============================================================================
# STEP 5: Inject red herring stamp
# =============================================================================

STAMP_WIDTH = 200
STAMP_HEIGHT = 134
STAMP_MARGIN_X = 220
STAMP_MARGIN_Y = 85
STAMP_ROTATION = 10

def inject_stamp(content):
    """Inject red herring stamp in lower-right corner."""

    # Read and encode stamp image
    with open(STAMP_FILE, 'rb') as f:
        stamp_data = base64.b64encode(f.read()).decode('utf-8')

    # Get SVG dimensions
    viewbox_match = re.search(r'viewBox="(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"', content)
    if viewbox_match:
        svg_width = int(viewbox_match.group(3))
        svg_height = int(viewbox_match.group(4))
    else:
        svg_width, svg_height = 2000, 1500

    stamp_x = svg_width - STAMP_WIDTH - STAMP_MARGIN_X
    stamp_y = svg_height - STAMP_HEIGHT - STAMP_MARGIN_Y

    center_x = STAMP_WIDTH / 2
    center_y = STAMP_HEIGHT / 2

    stamp_svg = f'''
<g id="stamp" transform="translate({stamp_x}, {stamp_y}) rotate({STAMP_ROTATION}, {center_x}, {center_y})">
  <image width="{STAMP_WIDTH}" height="{STAMP_HEIGHT}"
         href="data:image/png;base64,{stamp_data}"/>
</g>
'''

    last_svg_pos = content.rfind('</svg>')
    if last_svg_pos != -1:
        content = content[:last_svg_pos] + stamp_svg + '\n' + content[last_svg_pos:]

    return content


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    process_svg()
