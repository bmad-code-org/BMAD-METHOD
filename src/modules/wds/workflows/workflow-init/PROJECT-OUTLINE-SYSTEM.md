# WDS Project Outline System

**Single source of truth for all WDS agents and project coordination**

## What Is It?

The **Project Outline** (`.wds-project-outline.yaml`) is a YAML configuration file that captures:

- **User intentions** for each phase (gathered during project initiation)
- **Active/inactive phases** (skip what you don't need)
- **Current status** of all phases and scenarios
- **Work history** (who did what, when)
- **Project memory** (decisions, rationale, progress)

## Why It Exists

**Before Project Outline:**

- Agents scan folders/files on every activation (slow)
- No memory of WHY phases were skipped
- No tracking of scenario-level progress
- No record of user intentions

**With Project Outline:**

- ✅ **5x faster agent activation** - read 1 file instead of scanning 8 folders
- ✅ **User-driven planning** - intentions captured upfront
- ✅ **Scenario tracking** - granular progress within UX Design phase
- ✅ **Clear rationale** - explains why phases are skipped
- ✅ **Project memory** - complete work history

---

## How It Works

### 1. Creation (Saga WDS Analyst Agent)

During **Project Brief** phase, Saga asks about each phase:

**Example Questions:**

- "What are your intentions for Trigger Mapping?"
- "How many user scenarios do you envision?"
- "Are you using an existing component library?"

**Saga captures:**

- User's answer → `intent` field for each phase
- Active/inactive decision → `active: true/false`
- Skip reasons → `skip_reason` field

### 2. Reading (All WDS Agents)

**On activation**, agents:

1. Check for `.wds-project-outline.yaml` (fast path!)
2. Read user intentions and current status
3. Skip inactive phases
4. Report focused status and next actions

**Result**: <5 second activation instead of 30-60 seconds

### 3. Updating (All WDS Agents)

**When starting work:**

```yaml
status: 'in_progress'
started_date: '2024-12-10'
```

**When completing work:**

```yaml
status: 'complete'
completed_date: '2024-12-10'
completed_by: 'Freya WDS Designer Agent'
artifacts:
  - 'docs/4-ux-design/01-onboarding/*.md'
```

**Scenario tracking (Freya):**

```yaml
scenarios:
  - id: '01-customer-onboarding'
    name: 'Customer Onboarding'
    status: 'complete'
    pages_specified: 9
    pages_implemented: 5
```

---

## File Location

**Preferred**: `docs/.wds-project-outline.yaml`  
**Fallback**: `.wds-project-outline.yaml` (project root)

**Template**: `src/modules/wds/workflows/workflow-init/project-outline.template.yaml`

---

## Key Sections

### 1. Project Metadata

```yaml
project:
  name: 'Dog Week'
  description: 'Family dog care coordination app'
  wds_version: '4.0'
  path: 'full-product'
```

### 2. Phase Configuration

```yaml
phases:
  phase_4_ux_design:
    active: true
    status: 'in_progress'
    agent: 'freya-designer'
    intent: |
      User's intentions: "Create 3 core scenarios for MVP"
    scenarios_planned: 3
    scenarios_complete: 1
```

### 3. Scenario Tracking

```yaml
scenarios:
  - id: '01-customer-onboarding'
    status: 'complete'
    pages_specified: 9
    pages_implemented: 5
```

### 4. Update History

```yaml
update_history:
  - date: '2024-12-10'
    agent: 'freya-designer'
    action: 'completed'
    changes: 'Completed Scenario 01'
```

---

## Agent Integration

### Freya (Designer)

- Reads outline on activation
- Adds/updates scenarios as design work progresses
- Updates phase status when completing UX/Design System work

### Saga (Analyst)

- **Creates outline** during Project Brief
- Asks user intentions for each phase
- Updates when completing Product Brief/Trigger Map

### Idunn (PM)

- Reads outline on activation
- Updates when completing PRD Platform/Design Deliveries
- Tracks handoff artifacts

---

## Benefits by Role

### For Users

- ✅ Clear planning upfront (intentions captured)
- ✅ Flexible workflow (skip phases you don't need)
- ✅ Progress visibility (know exactly where you are)

### For Agents

- ✅ Fast activation (<5s vs 30-60s)
- ✅ Focused analysis (skip inactive phases)
- ✅ Better recommendations (know user intentions)
- ✅ Project memory (context across sessions)

### For Teams

- ✅ Single source of truth
- ✅ Work history tracking
- ✅ Coordination across agents
- ✅ Handoff clarity

---

## Example: Dog Week Project

```yaml
project:
  name: 'Dog Week'
  path: 'full-product'

phases:
  phase_2_trigger_mapping:
    active: true
    status: 'complete'
    intent: 'Focus on Swedish families with coordination pain points'

  phase_4_ux_design:
    active: true
    status: 'in_progress'
    intent: '3 MVP scenarios: onboarding, profile, calendar booking'
    scenarios:
      - id: '01-customer-onboarding'
        status: 'complete'
        pages_specified: 9
        pages_implemented: 5

  phase_5_design_system:
    active: false
    skip_reason: 'Using shadcn/ui component library'
```

---

## Future Enhancements

- [ ] Visual progress dashboard
- [ ] Automatic artifact detection
- [ ] Integration with BMM workflows
- [ ] Scenario dependency tracking
- [ ] Implementation progress from git commits

---

**Created**: 2024-12-10  
**Version**: 1.0  
**Part of**: WDS v6 (Whiteport Design Studio)
