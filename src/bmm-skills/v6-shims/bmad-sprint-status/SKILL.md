---
name: bmad-sprint-status
description: 'Deprecated — forwards to bmad-sprint-planning (status view)'
metadata:
  lifecycle: shim
---

# DEPRECATED — forwards to bmad-sprint-planning (status view)

This skill was consolidated into `bmad-sprint-planning`, which now owns the whole sprint-status artifact: gate it, generate it, view it. It is retained as a thin compatibility shim so existing invocations by name and `_bmad/custom/bmad-sprint-status.toml` override files keep working. New work should invoke `bmad-sprint-planning` directly — "show sprint status" routes straight to the status view.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. This picks up any `{project-root}/_bmad/custom/bmad-sprint-status.toml` and `bmad-sprint-status.user.toml` overrides for the legacy fields (`activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`).

2. Load `{project-root}/_bmad/bmm/config.yaml` (and `config.user.yaml` if present) to resolve `{user_name}` and `{communication_language}`.

3. Emit a deprecation notice to the user in `{communication_language}`:

   > Notice: `bmad-sprint-status` is deprecated and will be removed in a future release. It now forwards to `bmad-sprint-planning`, whose status view covers everything this skill did. To silence this notice, invoke `bmad-sprint-planning` directly next time (e.g. "show sprint status") and migrate any `_bmad/custom/bmad-sprint-status.toml` overrides to `_bmad/custom/bmad-sprint-planning.toml`.

4. Invoke `bmad-sprint-planning` with the following context. Pass these as the activating context so it honors them instead of resolving its own customization from scratch:

   - **Intent:** `status view` — skip `bmad-sprint-planning`'s usual intent detection and its readiness gate.
   - **Pre-resolved legacy customization** — use these in place of resolving from `bmad-sprint-planning`'s own `customize.toml` for the four legacy fields: `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, and `on_complete` = the resolved values from step 1.
   - **Original user input:** forward whatever the user said when invoking this skill verbatim.

   `bmad-sprint-planning` takes the workflow from here. Do not execute any further steps in this shim.
