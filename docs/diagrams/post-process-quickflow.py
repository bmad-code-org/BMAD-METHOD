#!/usr/bin/env python3
"""
Post-process Quick Flow SVG to style output labels like main diagram.
"""

import re

INPUT_FILE = "quick-flow.svg"
OUTPUT_FILE = "quick-flow.svg"


def shrink_output_labels(content):
    """Make @*.md output labels smaller and grayed."""

    def shrink_tspan(match):
        tspan = match.group(0)
        return tspan.replace('<tspan', '<tspan font-size="24px" fill="#666666"')

    pattern = r'<tspan[^>]*>(@[^<]*|Shortcut for[^<]*|Can run standalone)</tspan>'
    content = re.sub(pattern, shrink_tspan, content)
    return content


def outline_title(content):
    """Make the title text have an outline/stencil effect."""
    # Match title text with font-size 4Xpx and fill color
    pattern = r'(<text[^>]*)(fill="#1a3a5c")([^>]*style="[^"]*font-size:4\dpx[^"]*")'
    replacement = r'\1fill="none" stroke="#1a3a5c" stroke-width="1.5"\3'
    return re.sub(pattern, replacement, content)


def main():
    with open(INPUT_FILE, 'r') as f:
        content = f.read()

    content = shrink_output_labels(content)
    content = outline_title(content)

    with open(OUTPUT_FILE, 'w') as f:
        f.write(content)

    print(f"Post-processed: {INPUT_FILE}")


if __name__ == "__main__":
    main()
