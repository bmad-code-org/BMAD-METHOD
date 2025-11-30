#!/usr/bin/env python3
"""
Composite Quick Flow diagram onto main BMM workflow as a paper overlay.

SCALING PRINCIPLE: Both diagrams use the same font sizes in D2 (27px for workflow boxes).
To maintain visual consistency, the Quick Flow must be scaled by the same factor as the
main diagram. This is calculated from the SVG viewBox dimensions and target PNG width.

Formula:
  scale_factor = main_png_width / main_svg_native_width
  quick_flow_width = quick_flow_svg_native_width * scale_factor
"""

import re
from PIL import Image, ImageDraw, ImageFilter

# Configuration
MAIN_SVG = "bmm-workflow.svg"
MAIN_IMAGE = "bmm-workflow.png"
OVERLAY_SVG = "quick-flow.svg"
OVERLAY_IMAGE = "quick-flow.png"
OUTPUT_IMAGE = "bmm-workflow-with-quickflow.png"

# Overlay positioning
OVERLAY_X = 150  # Left margin
OVERLAY_Y_FROM_BOTTOM = 140  # Distance from bottom

# Paper effect settings
SHADOW_OFFSET = 0
SHADOW_BLUR = 0
SHADOW_COLOR = (0, 0, 0, 0)
BORDER_COLOR = (255, 255, 255)  # No visible border
BORDER_WIDTH = 0
PAPER_PADDING = 0
ROTATION_ANGLE = -5  # 5° clockwise


def get_svg_native_width(svg_path):
    """Extract native width from SVG viewBox attribute."""
    with open(svg_path, 'r') as f:
        content = f.read()

    # Match the first viewBox (the main SVG element)
    match = re.search(r'viewBox="[0-9.-]+\s+[0-9.-]+\s+([0-9.]+)\s+[0-9.]+"', content)
    if match:
        return float(match.group(1))
    raise ValueError(f"Could not find viewBox in {svg_path}")


def add_paper_effect(overlay):
    """Add paper-like styling: padding, border, shadow."""

    # Add padding (white border around content)
    padded_w = overlay.width + PAPER_PADDING * 2
    padded_h = overlay.height + PAPER_PADDING * 2

    paper = Image.new('RGBA', (padded_w, padded_h), (255, 255, 255, 255))
    paper.paste(overlay, (PAPER_PADDING, PAPER_PADDING))

    # Draw border
    draw = ImageDraw.Draw(paper)
    draw.rectangle(
        [0, 0, padded_w - 1, padded_h - 1],
        outline=BORDER_COLOR,
        width=BORDER_WIDTH
    )

    # Slight rotation for natural "placed" look
    paper = paper.rotate(ROTATION_ANGLE, expand=True, fillcolor=(255, 255, 255, 0), resample=Image.BICUBIC)

    # Create shadow
    shadow_size = (paper.width + SHADOW_OFFSET * 2 + SHADOW_BLUR * 2,
                   paper.height + SHADOW_OFFSET * 2 + SHADOW_BLUR * 2)
    shadow = Image.new('RGBA', shadow_size, (0, 0, 0, 0))

    # Draw shadow rectangle
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rectangle(
        [SHADOW_BLUR + SHADOW_OFFSET,
         SHADOW_BLUR + SHADOW_OFFSET,
         SHADOW_BLUR + SHADOW_OFFSET + paper.width,
         SHADOW_BLUR + SHADOW_OFFSET + paper.height],
        fill=SHADOW_COLOR
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(SHADOW_BLUR))

    # Composite paper onto shadow
    shadow.paste(paper, (SHADOW_BLUR, SHADOW_BLUR), paper)

    return shadow


def main():
    # Load images
    main_img = Image.open(MAIN_IMAGE).convert('RGBA')
    overlay_img = Image.open(OVERLAY_IMAGE).convert('RGBA')

    print(f"Main image: {main_img.size}")
    print(f"Overlay image: {overlay_img.size}")

    # Calculate proportional scale factor from SVG dimensions
    main_svg_width = get_svg_native_width(MAIN_SVG)
    overlay_svg_width = get_svg_native_width(OVERLAY_SVG)

    scale_factor = main_img.width / main_svg_width
    target_overlay_width = int(overlay_svg_width * scale_factor)

    print(f"Main SVG native width: {main_svg_width}px")
    print(f"Overlay SVG native width: {overlay_svg_width}px")
    print(f"Scale factor: {scale_factor:.4f}")
    print(f"Target overlay width: {target_overlay_width}px")

    # Resize overlay to maintain font scale parity
    aspect = overlay_img.height / overlay_img.width
    new_height = int(target_overlay_width * aspect)
    overlay_img = overlay_img.resize((target_overlay_width, new_height), Image.LANCZOS)
    print(f"Overlay resized to: {overlay_img.size}")

    # Add paper effect
    paper_overlay = add_paper_effect(overlay_img)

    # Calculate position (bottom-left area)
    pos_x = OVERLAY_X
    pos_y = main_img.height - paper_overlay.height - OVERLAY_Y_FROM_BOTTOM

    print(f"Placing overlay at: ({pos_x}, {pos_y})")

    # Composite
    main_img.paste(paper_overlay, (pos_x, pos_y), paper_overlay)

    # Save (convert to RGB for PNG without alpha issues)
    main_img = main_img.convert('RGB')
    main_img.save(OUTPUT_IMAGE, 'PNG')

    print(f"Saved: {OUTPUT_IMAGE}")


if __name__ == "__main__":
    main()
