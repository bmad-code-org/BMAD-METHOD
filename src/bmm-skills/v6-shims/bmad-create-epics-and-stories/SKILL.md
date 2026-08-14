---
name: bmad-create-epics-and-stories
description: 'Deprecated — forwards to bmad-ticket (slice route, v6 compatibility on request).'
---

# DEPRECATED — forwards to bmad-ticket

This skill was replaced by `bmad-ticket`, which owns the ticket tree, the breakdown gates, and the coverage contract. It is retained as a thin compatibility shim so existing invocations by name and `_bmad/custom/bmad-create-epics-and-stories.toml` override files keep working. New work should invoke `bmad-ticket` directly.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. This picks up any `{project-root}/_bmad/custom/bmad-create-epics-and-stories.toml` and `bmad-create-epics-and-stories.user.toml` overrides for the legacy fields (`activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`).

2. Load `{project-root}/_bmad/bmm/config.yaml` (and `config.user.yaml` if present) to resolve `{user_name}` and `{communication_language}`.

3. Emit a deprecation notice to the user in `{communication_language}`:

   > Notice: `bmad-create-epics-and-stories` is deprecated and will be removed in a future release. It now forwards to `bmad-ticket`, which slices scope into a ticket tree of epic folders and story files instead of one epics document. Net-new epics and stories no longer feed `sprint-status.yaml` — the tree's `board` and `frontier` verbs are the tracking for new work (`sprint-status.yaml` remains in service for in-flight v6 stories only). To silence this notice, migrate `_bmad/custom/bmad-create-epics-and-stories.toml` to `_bmad/custom/bmad-ticket.toml` and invoke `bmad-ticket` directly next time.

4. Make the case before forwarding — once, plainly, then respect the answer. This skill generated every story for every epic up front; `bmad-ticket` recommends slicing to the detailed epic set now and incepting each epic just-in-time when its work begins: stories written long before implementation get rewritten when reality moves, and the epic envelope alone (description, goals, covers, linked inputs) supports T-shirt sizing on request without a single story written. If the user still wants all stories up front and/or the single epics-and-stories file, that path exists and will be honored.

5. Invoke `bmad-ticket` with the following context. Pass these as the activating context so `bmad-ticket` honors them instead of resolving its own customization from scratch for the legacy fields:

   - **Route:** `slice`. If the user confirmed the v6 shape in step 4, add: chain the incept route per epic after slice completes, then render the single epics-and-stories file — `bmad-ticket`'s `references/v6-migration.md` carries that flow (including the true-v6 fallback if the user refuses the tree outright).
   - **Pre-resolved legacy customization** — use these in place of `bmad-ticket`'s own values for the four legacy fields; for everything else (`project_root`, templates, `lifecycle_transitions`, `hitl_threshold`, `finalize_reviewers`, `severity_scale`, `project_keys`), use `bmad-ticket`'s own defaults and overrides as normal:
     - `activation_steps_prepend` = the resolved value from step 1
     - `activation_steps_append` = the resolved value from step 1
     - `persistent_facts` = the resolved value from step 1
     - `on_complete` = the resolved value from step 1
   - **Original user input:** forward whatever the user said when invoking this skill verbatim.

   `bmad-ticket` takes the workflow from here. Do not execute any further steps in this shim.
