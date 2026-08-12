---
name: bmad-dev-auto
description: "Deprecated: forwards to bmad-build-auto. Do not use unless invoked by name"
---

# Deprecated Build Auto Alias

## On Activation

1. Check whether either legacy customization file exists:
   - `{project-root}/_bmad/custom/bmad-dev-auto.toml`
   - `{project-root}/_bmad/custom/bmad-dev-auto.user.toml`
2. If neither legacy file exists, output exactly `bmad-dev-auto is deprecated. Redirecting to bmad-build-auto. Please use bmad-build-auto in the future.`, invoke `bmad-build-auto` exactly once with the user's original input verbatim, then execute no further steps in this shim.
3. For every legacy file that exists, use its matching new filename:
   - `{project-root}/_bmad/custom/bmad-dev-auto.toml` becomes `{project-root}/_bmad/custom/bmad-build-auto.toml`.
   - `{project-root}/_bmad/custom/bmad-dev-auto.user.toml` becomes `{project-root}/_bmad/custom/bmad-build-auto.user.toml`.
4. If the matching new file does not exist, tell the user that the customization file uses the deprecated name and offer to rename it. Rename it only after explicit approval. If approval is declined or unavailable, or the rename fails, HALT and do not invoke any skill.
5. If the matching new file already exists, do not overwrite it. Read both files, explain their differences, and propose the exact content for the new file. Resolve conflicting values with the user. Only after the user explicitly approves that content, save and verify the new file, then remove the legacy file. If approval is declined or unavailable, or any operation fails, HALT and do not invoke any skill.
6. After every detected legacy file has been migrated successfully and no legacy file remains, output exactly `bmad-dev-auto is deprecated. Redirecting to bmad-build-auto. Please use bmad-build-auto in the future.`, invoke `bmad-build-auto` exactly once with the user's original input verbatim, then execute no further steps in this shim.
