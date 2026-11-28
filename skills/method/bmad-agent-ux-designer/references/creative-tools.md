# Creative Tools

`{workflow.creative_tools}` is a registry of collaborative visual renderers invoked on demand when seeing options beats abstract discussion. Entries use `skill:NAME`, `file:PATH`, `tool:MCP_TOOL_NAME: <directive>`, or plain-text directives.

Defaults ship for interactive HTML color themes, visual directions, key-screen prototypes, and Excalidraw sketches. Teams append more via override TOML — Figma/Stitch/Penpot MCP, image generation, or custom renderers.

## Capability principle

Keep markdown contracts (`DESIGN.md`, `EXPERIENCE.md`, `BRAND.md`) lean and deterministic. Always inherit and extend any attached corporate brand kit or company design system (`{design_system}`, `branding/DESIGN.md`, `persistent_facts`, or `bmad-facilitate`'s `style`) rather than imposing conflicting styles. For visual artifacts, use the strongest visual and interactive capabilities available in your model and host harness: self-contained interactive HTML/CSS/JS, host artifact previews, image generation, or Excalidraw when rough sketching fits best.

## Artifact handling

Every renderer writes to `{run}/.working/` (or `{run}/logos/` when creating logo assets) with a descriptive filename. `.working/` preserves iteration history. At Finalize, walk `.working/` with the user and promote lasting artifacts to `{run}/mockups/` or `{run}/wireframes/`. Promotion test: *would a builder reading `DESIGN.md` or `EXPERIENCE.md` open this?* Leave throwaways in `.working/`.

## Renderer contract

Pass the subagent current draft spines, `{design_system}` or any attached brand kit / `DESIGN.md`, prior relevant `.working/` captures, visual references from `imports/`, user intent, and output path. The subagent writes the artifact and returns only a compact summary (file path, one line per variant/screen, state coverage). When the host provides a native interactive artifact/preview surface, render or present there too while saving the self-contained `.html` file in `{run}`. Open standalone HTML interactively (`open "PATH"` on macOS, `xdg-open` on Linux, `start ""` on Windows); skip opening in headless mode.

Your goal before presenting any final HTML deliverable is to confirm zero horizontal overflow, clipped text, broken controls, or layout collapse across both desktop and mobile viewports — using whatever browser or screenshot tool your harness provides (and stating plainly if the harness cannot visually render it).
