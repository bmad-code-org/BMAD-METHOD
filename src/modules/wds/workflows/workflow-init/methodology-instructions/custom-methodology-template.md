# Custom Methodology Template

# Create your own workflow structure

## Overview

If WDS v6 or WPS2C v4 don't fit your needs, create a custom methodology!

This file serves as a template for defining your own:

- Phase structure
- Folder naming conventions
- Agent responsibilities
- Deliverables

---

## How to Use

1. **Copy this template** to your project: `docs/.custom-methodology.md`
2. **Fill in your structure** (see sections below)
3. **Update project outline**:

```yaml
methodology:
  type: 'custom'
  instructions_file: 'docs/.custom-methodology.md'
```

4. **Agents will read your custom instructions** on activation

---

## Define Your Phase Structure

List all phases in your methodology:

```
{{PHASE_1_NAME}}/     → {{PHASE_1_DESCRIPTION}}
{{PHASE_2_NAME}}/     → {{PHASE_2_DESCRIPTION}}
{{PHASE_3_NAME}}/     → {{PHASE_3_DESCRIPTION}}
```

**Example**:

```
00-Discovery/         → Research and exploration
01-Strategy/          → Strategic planning
02-Design/            → Visual and UX design
03-Development/       → Implementation
04-Launch/            → Deployment and testing
```

---

## Phase Details Template

For each phase, define:

### {{PHASE_NAME}}

**Agent**: Which WDS agent handles this? (Saga/Freya/Idunn or specify custom)  
**Folder**: `docs/{{FOLDER_NAME}}/`  
**Required**: Yes/No  
**Deliverables**:

- {{DELIVERABLE_1}}
- {{DELIVERABLE_2}}
- {{DELIVERABLE_3}}

**Skip if**: {{CONDITIONS_TO_SKIP}}

---

## Example: Lean Startup Methodology

Here's an example custom methodology:

### Phase 1: Build

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/01-Build/`  
**Required**: Yes  
**Deliverables**:

- MVP specification
- Core feature prototypes
- Quick-and-dirty designs

### Phase 2: Measure

**Agent**: Saga WDS Analyst Agent  
**Folder**: `docs/02-Measure/`  
**Required**: Yes  
**Deliverables**:

- Analytics setup
- Success metrics definition
- User feedback collection plan

### Phase 3: Learn

**Agent**: Saga WDS Analyst Agent  
**Folder**: `docs/03-Learn/`  
**Required**: Yes  
**Deliverables**:

- Data analysis
- Pivot or persevere decision
- Next iteration plan

---

## Folder Naming Convention

Explain your naming system:

**Pattern**: `{{PREFIX}}-{{NAME}}/`

**Example**: `01-Build/`, `02-Measure/`, `03-Learn/`

**Why this pattern?**
{{EXPLAIN_YOUR_REASONING}}

---

## Project Outline Configuration

Map your custom phases to the standard WDS phase structure:

```yaml
methodology:
  type: 'custom'
  instructions_file: 'docs/.custom-methodology.md'

phases:
  phase_1_project_brief:
    folder: '{{YOUR_PHASE_1_FOLDER}}'
    name: '{{YOUR_PHASE_1_NAME}}'
    agent: '{{AGENT_NAME}}'

  phase_2_trigger_mapping:
    active: false # Skip if not in your methodology
    skip_reason: 'Not part of custom methodology'

  phase_4_ux_design:
    folder: '{{YOUR_DESIGN_FOLDER}}'
    name: '{{YOUR_DESIGN_PHASE_NAME}}'
    agent: 'freya-designer'
```

---

## Agent Behavior Instructions

Tell agents how to behave with your custom methodology:

### Saga WDS Analyst Agent

- **Responsibilities**: {{LIST_SAGA_RESPONSIBILITIES}}
- **Phases owned**: {{PHASE_NAMES}}
- **Special instructions**: {{CUSTOM_BEHAVIOR}}

### Freya WDS Designer Agent

- **Responsibilities**: {{LIST_FREYA_RESPONSIBILITIES}}
- **Phases owned**: {{PHASE_NAMES}}
- **Special instructions**: {{CUSTOM_BEHAVIOR}}

### Idunn WDS PM Agent

- **Responsibilities**: {{LIST_IDUNN_RESPONSIBILITIES}}
- **Phases owned**: {{PHASE_NAMES}}
- **Special instructions**: {{CUSTOM_BEHAVIOR}}

---

## Deliverable Templates

Link to or define templates for your deliverables:

### {{DELIVERABLE_NAME}}

**Template location**: `docs/templates/{{TEMPLATE_FILE}}`  
**Required sections**:

- {{SECTION_1}}
- {{SECTION_2}}
- {{SECTION_3}}

**Format**: Markdown / YAML / HTML / Other

---

## Workflow Paths

Define common project paths in your methodology:

### Path 1: {{PATH_NAME}}

**Use for**: {{PROJECT_TYPE}}  
**Active phases**: {{LIST_PHASES}}  
**Typical duration**: {{TIMEFRAME}}

### Path 2: {{PATH_NAME}}

**Use for**: {{PROJECT_TYPE}}  
**Active phases**: {{LIST_PHASES}}  
**Typical duration**: {{TIMEFRAME}}

---

## Integration with WDS Agents

Specify how WDS agents should adapt:

**Project Analysis**:

- Agents should check for: `{{LIST_KEY_FILES_OR_FOLDERS}}`
- Status indicators: {{HOW_TO_DETERMINE_STATUS}}
- Completion criteria: {{WHAT_MAKES_A_PHASE_COMPLETE}}

**Scenario Tracking** (if applicable):

- Scenario folder location: `{{PATH}}`
- Scenario naming convention: `{{PATTERN}}`
- Status tracking: {{HOW_TO_TRACK}}

**Handoffs**:

- When to suggest Saga: {{CONDITIONS}}
- When to suggest Freya: {{CONDITIONS}}
- When to suggest Idunn: {{CONDITIONS}}

---

## Example Custom Methodologies

### 1. Design Sprint (Google Ventures)

```
Monday/       → Understand
Tuesday/      → Diverge
Wednesday/    → Decide
Thursday/     → Prototype
Friday/       → Test
```

### 2. Shape Up (Basecamp)

```
00-Pitch/           → Problem definition and appetite
01-Betting/         → Project selection
02-Shaping/         → Scope definition
03-Building/        → Implementation (6 weeks)
04-Cooldown/        → 2-week buffer
```

### 3. JTBD (Jobs to Be Done)

```
01-Research/        → Job discovery
02-Job-Stories/     → Job story creation
03-Design/          → Solution design
04-Validation/      → Job completion testing
```

---

## Custom Methodology Checklist

Before finalizing your custom methodology, ensure:

- [ ] All phases are clearly defined
- [ ] Folder naming is consistent and logical
- [ ] Agent responsibilities are mapped
- [ ] Deliverables are specified for each phase
- [ ] Project outline configuration is complete
- [ ] Workflow paths are documented (if multiple)
- [ ] Integration instructions for WDS agents are clear

---

## Need Help?

If you're creating a custom methodology:

1. Start with WDS v6 or WPS2C v4 as a base
2. Adapt only what's necessary
3. Document thoroughly for your team
4. Test with one project before rolling out

**Questions?** Ask any WDS agent for guidance on creating custom methodologies.

---

**Template Version**: 1.0  
**Last Updated**: 2024-12-10  
**Part of**: WDS v6 (Whiteport Design Studio)
