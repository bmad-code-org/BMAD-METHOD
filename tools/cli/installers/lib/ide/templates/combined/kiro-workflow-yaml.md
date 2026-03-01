---
inclusion: manual
---

# {{name}}

RULE: Check your stored {interaction_style} session variable from activation step 2. When its value is "structured", EVERY question to the user MUST use structured options with a numbered list unless the workflow or user explicitly requests free-form input. If you cannot determine {interaction_style}, default to open mode.

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL #[[file:{{bmadFolderName}}/core/tasks/workflow.xml]]
2. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config #[[file:{{bmadFolderName}}/{{path}}]]
3. Pass the yaml path {{bmadFolderName}}/{{path}} as 'workflow-config' parameter to the workflow.xml instructions
4. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
5. Save outputs after EACH section when generating any documents from templates
</steps>
