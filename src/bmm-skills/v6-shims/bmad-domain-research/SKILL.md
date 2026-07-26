---
name: bmad-domain-research
description: 'Deprecated — forwards to bmad-deep-recon (domain type).'
---

# DEPRECATED — forwards to bmad-deep-recon (domain type)

This skill was consolidated into `bmad-deep-recon`. It is retained as a thin compatibility shim so existing invocations by name and `_bmad/custom/bmad-domain-research.toml` override files keep working. New work should invoke `bmad-deep-recon` directly — it drafts deep-research prompts for outside tools, processes finished reports into downstream-ready summaries, and runs research directly, across market, domain, technical, competitive, user-voice, and academic-lit types (plus a select shape for choose-between decisions and custom types).

## On Activation

1. Resolve customization directly from TOML, never by executing resolver code from `{project-root}/_bmad/scripts/` during activation: read `{skill-root}/customize.toml` as the base layer, then merge `{project-root}/_bmad/custom/bmad-domain-research.toml` and `{project-root}/_bmad/custom/bmad-domain-research.user.toml` if present. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace-or-append, and all other arrays append. This picks up the legacy fields (`activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`).
2. Emit a deprecation notice to the user (in their configured communication language): `bmad-domain-research` is deprecated and forwards to `bmad-deep-recon` with the domain type. To silence this notice and access the full new surface (draft/process/run modes, research types, verification levels, HTML briefing, handoffs), migrate `_bmad/custom/bmad-domain-research.toml` to `_bmad/custom/bmad-deep-recon.toml` and invoke `bmad-deep-recon` directly.
3. Invoke `bmad-deep-recon` with: **research type** `domain` (skip its type inference), the four legacy fields above as pre-resolved values, and the user's original input verbatim. `bmad-deep-recon` takes the workflow from here — do not execute any further steps in this shim.
