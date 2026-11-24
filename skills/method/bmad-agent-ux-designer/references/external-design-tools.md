# External Design Tools

Bridge BMad's markdown contracts (`DESIGN.md`, `EXPERIENCE.md`) with visual design tools configured in `{workflow.design_handoffs}`: Google Stitch (and Stitch MCP), Claude Design, Figma (Figma MCP `get_design_context`/`get_variable_defs`, Figma Make, or exports), Penpot MCP, Vercel v0, screenshots, or `awesome-design-md` reference files.

Visual generators produce layouts and style fast, while routinely skipping empty states, error recovery, permissions, offline behavior, accessibility, and token consistency. Use Sally to coach direction before prompting, then distill exports into durable contracts.

## Outbound (BMad to external tool)

1. Gather settled context from the active run: Trigger Map driving forces, Brand / Design Direction choices, dissected comp likes and anti-patterns, taste dials, target form-factor, and key journeys or ticket Requirements.
2. If an MCP integration (Stitch MCP, Figma MCP, Penpot MCP) is active in the harness and requested, read or push context directly. Otherwise assemble one crisp, copy-paste-ready prompt containing brand posture, token constraints, required surfaces/states, and anti-patterns.
3. Ask the user to run the external tool and save exports (`.stitch/DESIGN.md`, HTML/React exports, screenshots, SVG/PNG captures, or Figma URLs) into `{run}/imports/` or `{run}/`.

## Inbound (external output to `DESIGN.md` and `EXPERIENCE.md`)

1. Read every imported asset (HTML, `.stitch/DESIGN.md`, Figma MCP data, screenshots). Link source screenshots/exports under `{run}/imports/` cleanly so nothing stays orphaned.
2. **Distill visuals into `DESIGN.md`:** extract color roles, light/dark pairs, typography ramp, radii, spacing, and component token overrides. Flag missing dark mode tokens or low-contrast pairings before finalizing.
3. **Run the Missing-States & Behavior Pass (`EXPERIENCE.md`):** walk every imported screen and resolve what visual exports leave implied — navigation transitions, microcopy, cold/loading/empty states, validation and submission failures, permissions, responsive breakpoints, keyboard traversal, and ARIA semantics. Record that `DESIGN.md` and `EXPERIENCE.md` win on conflict with any import or mockup.
