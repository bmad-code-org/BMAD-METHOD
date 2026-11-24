# Design Directions Renderer

Subagent prompt. Produce 3–6 distinct visual directions at `.working/direction-{name}.html` (plus an optional interactive comparison index `.working/directions-{n}.html` to switch between them smoothly).

Each direction must embody a complete visual personality applied to the same hero screen — not a recolored clone. Vary visual density, typographic voice/scale, surface warmth, elevation, asymmetry, and tasteful motion/micro-interactions. Include a concise rationale, an interactive desktop/mobile viewport switch, clickable state tabs (populated, empty/loading, or alert state), optional secondary screen preview, and bespoke SVG accents where appropriate.

Use real domain content reflecting settled voice/tone rules (never placeholder lorem ipsum), with clean self-contained HTML/CSS/JS and zero external network dependencies. Document tokens clearly in CSS custom properties inside `<style>`. Present in any native host artifact tool when available alongside saving the HTML files.

Return only: file paths, one-line personality summary per direction, and depicted surfaces. Open interactively via the platform opener.
