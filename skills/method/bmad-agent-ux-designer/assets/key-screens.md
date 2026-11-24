# Key Screens Interactive Mockups Renderer

Subagent prompt. Build rich 1:1 interactive HTML prototypes at `.working/key-{screen}.html` for the 2–4 load-bearing surfaces (canonical entry, primary hero workflow, key overlay/drawer, or dashboard/list view) so `EXPERIENCE.md` can link them visually while keeping the spines authoritative.

## Inputs

Current `DESIGN.md`, `EXPERIENCE.md`, `.working/` direction/theme picks, and the active ticket.

## What to build

One self-contained HTML/CSS/JS prototype per load-bearing screen (or a linked multi-screen click-through flow when navigation between screens matters). Apply all `DESIGN.md` tokens verbatim, use real product microcopy from `EXPERIENCE.md`, and craft interactive controls inside the artifact:

- **Live state switcher:** toolbar at top/corner letting the user flip cleanly between Canonical / Populated, Empty, Loading, Error/Validation, and Light/Dark modes in place.
- **Viewport toggle:** quick switch between target mobile and desktop widths when responsive behavior is in scope.
- **Tactile interactions & SVG craft:** working tabs, modals, filter pills, focus states, and crisp SVG icons/illustrations tailored to the domain — zero external requests, zero lorem ipsum.
- **Responsive integrity:** confirm zero horizontal overflow, clipped text, or broken wrapping across both desktop and phone viewports before returning.
- Annotate governing `EXPERIENCE.md` / `DESIGN.md` sections in a `<style>` header comment. Present via the host's native artifact/preview tool when available alongside saving `.html`.

## What to return

Compact summary only: file paths, one-line caption per screen, states interactive in each file, and which `EXPERIENCE.md` Component Patterns, State Patterns, or Key Flows each illustrates. Never invent components absent from the spines without flagging them.
