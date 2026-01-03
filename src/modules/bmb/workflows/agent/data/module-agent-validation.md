# Module Agent Validation Checklist

Validate Module agents meet BMAD quality standards.

**Run this AFTER Simple or Expert validation.**

---

## Module Integration Validation

### Module Membership

- [ ] Designed FOR specific module (BMM, BMGD, CIS, or other existing module)
- [ ] Module code in `agent.metadata.module` matches target module
- [ ] Agent integrates with module's existing agents/workflows

### Workflow Integration

- [ ] Menu items reference module workflows via `exec:`
- [ ] Workflow paths are correct and exist
- [ ] Workflow paths use: `{project-root}/_bmad/{module-code}/workflows/...`
- [ ] For workflows from other modules: uses both `workflow:` and `workflow-install:`

### Agent Coordination

- [ ] If inputs from other module agents: documented in menu description
- [ ] If outputs to other module agents: clear handoff points
- [ ] Agent role within module team is clear

---

## YAML Structure (Module-Specific)

### Module Agent Can Be Simple OR Expert

**If Simple-structure Module Agent:**
- [ ] `agent.metadata.hasSidecar` is `false` (no sidecar)
- [ ] Single .agent.yaml file (no sidecar)
- [ ] Uses `exec:` for workflow references
- [ ] Pass `simple-agent-validation.md` first

**If Expert-structure Module Agent:**
- [ ] `agent.metadata.hasSidecar` is `true` (has sidecar)
- [ ] Has sidecar folder
- [ ] Uses `exec:` for workflow references
- [ ] Sidecar paths use `{project-root}/_bmad/_memory/{sidecar-folder}/` format
- [ ] Pass `expert-agent-validation.md` first

---

## Menu Validation (Module-Specific)

### Workflow Handlers

- [ ] Module agents use `exec:` for workflow references
- [ ] Workflow paths use `{project-root}` variable
- [ ] Workflow paths point to existing workflows

### Unimplemented Features

- [ ] If `exec: 'todo'`, feature is documented as planned
- [ ] Description indicates "Coming soon" or similar

### Data Parameters (if used)

- [ ] `data:` parameter references valid files
- [ ] Data paths use `{project-root}` variable

---

## Module-Specific Quality

- [ ] Agent extends module capabilities (not redundant with existing agents)
- [ ] Agent has clear purpose within module ecosystem
- [ ] Compare with reference: `security-engineer.agent.yaml` (BMM module example)

---

## Workflow Path Validation

### Module Workflow Paths

- [ ] Format: `{project-root}/_bmad/{module-code}/workflows/{workflow-name}/workflow.{md|yaml}`
- [ ] Module codes: `bmm`, `bmgd`, `cis`, or custom module
- [ ] Paths are case-sensitive and match actual file structure

### Core Workflow Paths

- [ ] Format: `{project-root}/_bmad/core/workflows/{workflow-name}/workflow.{md|yaml}`
- [ ] Core workflows: `brainstorming`, `party-mode`, `advanced-elicitation`, etc.

---

## What the Compiler Adds (DO NOT validate presence)

These are auto-injected, don't validate for them:
- Frontmatter (`---name/description---`)
- XML activation block
- Menu items: MH (menu/help), CH (chat), PM (party-mode), DA (dismiss/exit)
- Rules section

---

## Common Issues

### Issue: Wrong Module Code

**Wrong:** `module: standalone`

**Fix:** `module: stand-alone` (with hyphen) OR actual module code like `bmm`

### Issue: Hardcoded Workflow Path

**Wrong:** `exec: '../../../bmm/workflows/create-prd/workflow.md'`

**Fix:** `exec: '{project-root}/_bmad/bmm/workflows/create-prd/workflow.md'`

### Issue: Action Instead of Exec for Workflows

**Wrong:** `action: '{project-root}/_bmad/.../workflow.md'`

**Fix:** `exec: '{project-root}/_bmad/.../workflow.md'`

### Issue: Redundant with Existing Agent

**Fix:** Ensure agent fills gap or adds specialized capability not already present in module
