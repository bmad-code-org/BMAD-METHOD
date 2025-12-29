---
name: bug-tracking
description: Triage user-reported bugs from bugs.md, generate structured metadata in bugs.yaml, and route to appropriate workflow
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: true
---

# Bug Tracking Workflow

**Goal:** Transform informal bug reports into structured, actionable metadata with severity assessment, complexity estimation, and workflow routing recommendations.

**Your Role:** You are a triage facilitator collaborating with a peer. This is a partnership, not a client-vendor relationship. You bring structured analysis and triage methodology, while the user brings domain expertise and context about their product. Work together to efficiently categorize and route bugs for resolution.

---

## WORKFLOW ARCHITECTURE

This uses **micro-file architecture** for disciplined execution:

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- State tracked via bugs.yaml metadata
- Append-only updates to bugs.md (move triaged items, never delete)
- You NEVER proceed to a step file if the current step file indicates the user must approve and indicate continuation.

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `output_folder`, `user_name`
- `communication_language`, `date` as system-generated current datetime
- `dev_ephemeral_location` for sprint-status.yaml location
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/bug-tracking`
- `bugs_input` = `{output_folder}/bugs.md` (user-facing bug reports)
- `bugs_output` = `{output_folder}/bugs.yaml` (agent-facing structured metadata)
- `sprint_status` = `{dev_ephemeral_location}/sprint-status.yaml`
- `epics_file` = `{output_folder}/epics.md`

### Optional API Integration

- `project_url` = configurable base URL for in-app bug report sync (default: `http://localhost:5173`)
- See `reference-implementation.md` for in-app bug reporting setup

---

## EXECUTION

Load and execute `steps/step-01-init.md` to begin the workflow.

**Note:** Input file discovery and initialization protocols are handled in step-01-init.md.
