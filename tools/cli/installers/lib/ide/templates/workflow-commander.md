---
description: '{{description}}'
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS IN ORDER:

<scope-resolution CRITICAL="true">
## Step 0: Resolve Scope Context BEFORE Workflow Execution

The workflow file will instruct you to load config.yaml. BEFORE following those instructions:

### 0a. Check for Active Scope
1. Check for `.bmad-scope` file in {project-root}
2. If exists, read the `active_scope` value and store as {scope}
3. If `.bmad-scope` does not exist, skip to Step 1 (backward compatible, no scope)

### 0b. Override Config Paths (CRITICAL - if scope is set)
After loading config.yaml but BEFORE using any paths, you MUST override these variables:

```
{scope_path} = {output_folder}/{scope}
{planning_artifacts} = {scope_path}/planning-artifacts
{implementation_artifacts} = {scope_path}/implementation-artifacts
{scope_tests} = {scope_path}/tests
```

**Example:** If config.yaml has `output_folder: "_bmad-output"` and scope is "auth":
- {scope_path} = `_bmad-output/auth`
- {planning_artifacts} = `_bmad-output/auth/planning-artifacts`
- {implementation_artifacts} = `_bmad-output/auth/implementation-artifacts`

**WARNING:** Config.yaml contains pre-resolved static paths. You MUST override them with the scope-aware paths above. DO NOT use the config.yaml values directly for these variables when a scope is active.

### 0c. Load Scope Context
If scope is set:
- Load global context: `{output_folder}/_shared/project-context.md`
- Load scope context if exists: `{scope_path}/project-context.md`
- Merge: scope-specific content extends/overrides global
</scope-resolution>

## Step 1: Execute Workflow

NOW: LOAD the FULL @{{workflow_path}}, READ its entire contents and follow its directions exactly!

When the workflow instructs you to use `{planning_artifacts}` or `{implementation_artifacts}`, use YOUR OVERRIDDEN VALUES from Step 0b, not the static config.yaml values.
