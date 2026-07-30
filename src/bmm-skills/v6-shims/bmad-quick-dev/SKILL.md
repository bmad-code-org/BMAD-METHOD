---
name: bmad-quick-dev
description: "Deprecated: forwards to bmad-build. Do not use unless invoked by name."
---

# Deprecated Build Alias

## On Activation

1. Check only whether these legacy customization files exist. File existence alone triggers the halt; do not read, parse, copy, rename, delete, or overwrite either file:
   - `{project-root}/_bmad/custom/bmad-quick-dev.toml`
   - `{project-root}/_bmad/custom/bmad-quick-dev.user.toml`
2. If either legacy file exists, HALT before invoking any skill. Report one exact rename for every legacy file that exists:
   - `{project-root}/_bmad/custom/bmad-quick-dev.toml` -> `{project-root}/_bmad/custom/bmad-build.toml`
   - `{project-root}/_bmad/custom/bmad-quick-dev.user.toml` -> `{project-root}/_bmad/custom/bmad-build.user.toml`
   Tell the user not to overwrite a target that already exists; they must reconcile or merge those files manually.
3. Otherwise, silently invoke `bmad-build` exactly once with the user's original input verbatim. Produce no notice or other output before invocation, and execute no further steps in this shim.
