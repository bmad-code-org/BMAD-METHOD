---
name: bmad-technical-research
description: 'Deprecated — forwards to bmad-deep-recon (technical type).'
---

# DEPRECATED — forwards to bmad-deep-recon (technical type)

This skill was consolidated into `bmad-deep-recon`. It is retained as a thin compatibility shim so existing invocations by name and `_bmad/custom/bmad-technical-research.toml` override files keep working. New work should invoke `bmad-deep-recon` directly — it covers market, domain, technical, competitive, user-voice, and academic-lit research, a select shape for choose-between decisions, and custom types.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. This picks up any `{project-root}/_bmad/custom/bmad-technical-research.toml` and `bmad-technical-research.user.toml` overrides for the legacy fields (`activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`).
2. Emit a deprecation notice to the user (in their configured communication language): `bmad-technical-research` is deprecated and forwards to `bmad-deep-recon` with the technical type. To silence this notice and access the full new surface (research types, engines, verification levels, red team, HTML briefing, handoffs), migrate `_bmad/custom/bmad-technical-research.toml` to `_bmad/custom/bmad-deep-recon.toml` and invoke `bmad-deep-recon` directly.
3. Invoke `bmad-deep-recon` with: **intent** `create`, **research type** `technical` (skip its type inference), the four legacy fields above as pre-resolved values, and the user's original input verbatim. `bmad-deep-recon` takes the workflow from here — do not execute any further steps in this shim.
