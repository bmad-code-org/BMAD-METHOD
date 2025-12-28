# WDS Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: wds-workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>

<workflow>

<step n="1" goal="Welcome and project name">
<output>Welcome to Whiteport Design Studio, {user_name}! 🎨

I'll help you set up your design project with the right structure and phases.</output>

<ask>What's your project called?</ask>

<action>Store project_name</action>
<template-output>project_name</template-output>

<action>Load and execute: `workflow-init/steps/step-02-project-structure.md`</action>
</step>

</workflow>
