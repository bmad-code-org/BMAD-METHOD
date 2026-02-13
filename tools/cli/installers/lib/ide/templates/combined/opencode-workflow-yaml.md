---
name: '{{name}}'
description: '{{description}}'
---

Execute the BMAD '{{name}}' workflow.

CRITICAL: Use the workflow runner task, not direct workflow-file execution.

WORKFLOW INSTRUCTIONS:
1. LOAD the workflow runner from {project-root}/{{bmadFolderName}}/core/tasks/workflow.md
2. READ its entire contents
3. PASS this parameter to the runner: workflow-config: {{bmadFolderName}}/{{path}}
4. FOLLOW every runner step exactly as specified
