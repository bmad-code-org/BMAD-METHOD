---
name: bmad-checkpoint-preview
description: "Deprecated: forwards to bmad-walkthrough. Do not use unless invoked by name"
metadata:
  lifecycle: shim
---

# Deprecated Walkthrough Alias

## On Activation

1. Check whether either legacy customization file exists:
   - `{project-root}/_bmad/custom/bmad-checkpoint-preview.toml`
   - `{project-root}/_bmad/custom/bmad-checkpoint-preview.user.toml`
2. If neither legacy file exists, output exactly `bmad-checkpoint-preview is deprecated. Redirecting to bmad-walkthrough. Please use bmad-walkthrough in the future.`, invoke `bmad-walkthrough` exactly once with the user's original input verbatim, then execute no further steps in this shim.
3. For every legacy file that exists, use its matching new filename:
   - `{project-root}/_bmad/custom/bmad-checkpoint-preview.toml` becomes `{project-root}/_bmad/custom/bmad-walkthrough.toml`.
   - `{project-root}/_bmad/custom/bmad-checkpoint-preview.user.toml` becomes `{project-root}/_bmad/custom/bmad-walkthrough.user.toml`.
4. If the matching new file does not exist, tell the user that the customization file uses the deprecated name and offer to rename it. Rename it only after explicit approval. If approval is declined or unavailable, or the rename fails, HALT and do not invoke any skill.
5. If the matching new file already exists, do not overwrite it. Read both files, explain their differences, and propose the exact content for the new file. Resolve conflicting values with the user. Only after the user explicitly approves that content, save and verify the new file, then remove the legacy file. If approval is declined or unavailable, or any operation fails, HALT and do not invoke any skill.
6. After every detected legacy file has been migrated successfully and no legacy file remains, output exactly `bmad-checkpoint-preview is deprecated. Redirecting to bmad-walkthrough. Please use bmad-walkthrough in the future.`, invoke `bmad-walkthrough` exactly once with the user's original input verbatim, then execute no further steps in this shim.
