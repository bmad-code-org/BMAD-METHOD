---
name: '{{name}}'
description: '{{description}}'
---

# {{name}}

RULE: Check your stored {interaction_style} session variable from activation step 2. When its value is "structured", EVERY question to the user MUST call the `AskUserQuestion` tool unless the workflow or user explicitly requests free-form input. If you cannot determine {interaction_style}, default to open mode.

Read the entire task file at: {project-root}/{{bmadFolderName}}/{{path}}

Follow all instructions in the task file exactly as written.
