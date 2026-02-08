---
inclusion: manual
---

# {{name}}

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL #[[file:{{bmadFolderName}}/core/tasks/workflow.md]]
2. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config #[[file:{{bmadFolderName}}/{{path}}]]
3. Pass workflow path to workflow.md using YAML parameter key `workflow-config` with value `{{bmadFolderName}}/{{path}}`
   Example invocation parameter block:
   ```yaml
   workflow-config: {{bmadFolderName}}/{{path}}
   ```
4. Follow workflow.md task instructions EXACTLY as written to process and follow the specific workflow config and its instructions
5. Save outputs after EACH section when generating any documents from templates
</steps>
