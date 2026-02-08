---
name: help
description: Get unstuck by showing what workflow steps come next or answering questions about what to do
standalone: true
---

# Task: BMAD Help

## KEY RULES

- **Empty `phase` = anytime** — Universal tools work regardless of workflow state
- **Numbered phases indicate sequence** — Phases like `1-discover` → `2-define` → `3-build` → `4-ship` flow in order (naming varies by module)
- **Stay in module** — Guide through the active module's workflow based on phase+sequence ordering
- **Descriptions contain routing** — Read for alternate paths (e.g., "back to previous if fixes needed")
- **`required=true` blocks progress** — Required workflows must complete before proceeding to later phases
- **Artifacts reveal completion** — Search resolved output paths for `outputs` patterns, fuzzy-match found files to workflow rows

## MODULE DETECTION

- **Empty `module` column** → universal tools (work across all modules)
- **Named `module`** → module-specific workflows

Detect the active module from conversation context, recent workflows, or user query keywords. If ambiguous, ask the user.

## INPUT ANALYSIS

Determine what was just completed:
- Did someone state they completed something? Proceed as if that was the input.
- Was a workflow just completed in this conversation? Proceed as if that was the input.
- Search resolved artifact locations for files; fuzzy-match to workflow `outputs` patterns.
- If an `index.md` exists, read it for additional context.
- If still unclear, ask: "What workflow did you most recently complete?"

## EXECUTION

1. **Load catalog** — Load `{project-root}/_bmad/_config/bmad-help.csv`

2. **Resolve output locations and config** — Scan each folder under `_bmad/` (except `_config`) for `config.yaml`. For each workflow row, resolve its `output-location` variables against that module's config so artifact paths can be searched. Also extract `communication_language` and `project_knowledge` from each scanned module's config.

3. **Ground in project knowledge** — If `project_knowledge` resolves to an existing path, read available documentation files (architecture docs, project overview, tech stack references) for grounding context. Use discovered project facts when composing any project-specific output. Never fabricate project-specific details. If documentation is unavailable, state that clearly.

4. **Analyze input** — Task may provide a workflow name/code, conversational phrase, or nothing. Infer what was just completed using INPUT ANALYSIS above.

5. **Detect active module** — Use MODULE DETECTION above to determine which module the user is working in.

6. **Present recommendations** — Show next steps based on completed workflows, phase/sequence ordering (KEY RULES), and artifact detection. Format per the following

## RECOMMENDED OUTPUT FORMAT

   **Optional items first** — List optional workflows until a required step is reached
   **Required items next** — List the next required workflow
   For each item show:
   - Workflow **name**
   - **Command** when `command` is present
   - **Agent load instruction + code** when `command` is empty
   - **Agent** title and display name from the CSV (e.g., "🎨 Alex (Designer)")
   - Brief **description**

   ### Display branching rules
   - When `command` has a value:
     - Present the command in your platform's command format (for example: `bmad-example-build-prototype`)
   - When `command` is empty:
     - Do not invent a slash command
     - Show how to load the agent from `agent` and then invoke using the workflow/code description
     - Example:
       - `Explain Concept (EC)`
       - `Load: /tech-writer, then ask to "EC about [topic]"`
       - `Agent: Tech Writer`
       - `Description: Create clear technical explanations with examples`

   ### Additional response output guidance to convey:
   - Present all output in `{communication_language}` when available in module config
   - Run each workflow in a **fresh context window**
   - Load the agent using the platform's command format for `agent-command`, or run the workflow command directly
   - For **validation workflows**: recommend using a different high-quality LLM if available
   - For conversational requests: match the user's tone while presenting clearly

7. Return to the calling process after presenting recommendations.
