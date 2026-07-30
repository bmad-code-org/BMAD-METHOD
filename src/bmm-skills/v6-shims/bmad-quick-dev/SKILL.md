---
name: bmad-quick-dev
description: "Deprecated: forwards to bmad-build. Do not use unless invoked by name."
---

# Deprecated Build Alias

## On Activation

1. Check only whether these legacy customization files exist. File existence alone triggers the halt; do not read, parse, copy, rename, delete, or overwrite either file:
   - `{project-root}/_bmad/custom/bmad-quick-dev.toml`
   - `{project-root}/_bmad/custom/bmad-quick-dev.user.toml`
2. If either legacy file exists, HALT before invoking any skill. For each legacy file that exists, give the matching instruction:
   - For `{project-root}/_bmad/custom/bmad-quick-dev.toml`:
     - If `{project-root}/_bmad/custom/bmad-build.toml` does not exist, tell the user to rename the old file to that new filename.
     - If both files exist, tell the user to manually merge the old file's settings into `{project-root}/_bmad/custom/bmad-build.toml`. Do not overwrite the new file.
   - For `{project-root}/_bmad/custom/bmad-quick-dev.user.toml`:
     - If `{project-root}/_bmad/custom/bmad-build.user.toml` does not exist, tell the user to rename the old file to that new filename.
     - If both files exist, tell the user to manually merge the old file's settings into `{project-root}/_bmad/custom/bmad-build.user.toml`. Do not overwrite the new file.
3. Otherwise, output exactly: `bmad-quick-dev is deprecated. Redirecting to bmad-build. Please use bmad-build in the future.`
4. Invoke `bmad-build` exactly once with the user's original input verbatim, then execute no further steps in this shim.
