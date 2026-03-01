---
description: '{{description}}'
---

Execute the BMAD '{{name}}' workflow.

CRITICAL: You must load and follow the workflow definition exactly.

WORKFLOW INSTRUCTIONS:

1. LOAD the workflow file from {project-root}/{{bmadFolderName}}/{{path}}
2. READ its entire contents
3. FOLLOW every step precisely as specified
4. DO NOT skip or modify any steps

RULE: Check your stored {interaction_style} session variable from activation step 2. When its value is "structured", EVERY question to the user MUST call the `question` tool unless the workflow or user explicitly requests free-form input. If you cannot determine {interaction_style}, default to open mode.

WORKFLOW FILE: {project-root}/{{bmadFolderName}}/{{path}}
