---
name: bmad-check-implementation-readiness
description: 'Deprecated — forwards to bmad-sprint-planning (readiness check)'
metadata:
  lifecycle: shim
---

# DEPRECATED — forwards to bmad-sprint-planning (readiness check)

This skill was consolidated into `bmad-sprint-planning`, which now checks implementation readiness before generating sprint tracking. It is retained as a thin compatibility shim so existing invocations by name and `_bmad/custom/bmad-check-implementation-readiness.toml` override files keep working. New work should invoke `bmad-sprint-planning` directly with a request to check implementation readiness.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. This picks up any `{project-root}/_bmad/custom/bmad-check-implementation-readiness.toml` and `bmad-check-implementation-readiness.user.toml` overrides for the legacy fields (`activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`).

2. Load `{project-root}/_bmad/bmm/config.yaml` (and `config.user.yaml` if present) to resolve `{user_name}` and `{communication_language}`.

3. Emit a deprecation notice to the user in `{communication_language}`:

   > Notice: `bmad-check-implementation-readiness` is deprecated and will be removed in v7. It now forwards to `bmad-sprint-planning`, whose readiness mode covers everything this skill did. To silence this notice, invoke `bmad-sprint-planning` directly next time (e.g. "check implementation readiness") and migrate any `_bmad/custom/bmad-check-implementation-readiness.toml` overrides to `_bmad/custom/bmad-sprint-planning.toml`.

4. Invoke `bmad-sprint-planning` with the following context. Pass these as the activating context so it honors them instead of resolving its own customization from scratch:
   - **Intent:** `readiness` — run the readiness gate only, report its result, and stop without generating sprint tracking.
   - **Pre-resolved legacy customization** — use these in place of resolving from `bmad-sprint-planning`'s own `customize.toml` for the four legacy fields: `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, and `on_complete` = the resolved values from step 1.
   - **Original user input:** forward whatever the user said when invoking this skill verbatim.

   `bmad-sprint-planning` takes the workflow from here. Do not execute any further steps in this shim.
