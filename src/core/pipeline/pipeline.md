# Pipeline Orchestrator

## Overview

The Pipeline Orchestrator enables multi-stage agent pipelines with automatic dependency management. It supports sequential, parallel, and hybrid execution modes.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PIPELINE ORCHESTRATOR                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐                        │
│   │ Stage 1 │───▶│ Stage 2 │───▶│ Stage 3 │  (Sequential)          │
│   └─────────┘    └─────────┘    └─────────┘                        │
│                                                                     │
│   ┌─────────┐                                                       │
│   │ Stage A │─┐                                                     │
│   └─────────┘ │  ┌─────────┐                                       │
│               ├─▶│ Stage D │  (Parallel → Sequential)              │
│   ┌─────────┐ │  └─────────┘                                       │
│   │ Stage B │─┘                                                     │
│   └─────────┘                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Commands

### PIPELINE create

Create a new pipeline from template or custom definition.

```
PIPELINE create
PIPELINE create --template full_sdlc
PIPELINE create --name "Custom Pipeline"
```

### PIPELINE run

Execute a pipeline.

```
PIPELINE run PIPE-20250115-myproject
PIPELINE run --active
```

### PIPELINE status

Show pipeline status.

```
PIPELINE status
PIPELINE status PIPE-20250115-myproject
```

**Example output:**
```
Pipeline: PIPE-20250115-myproject
Status: running
Progress: [████████░░░░░░░░░░░░] 40%

Stages:
[✓] analysis
    Agents: analyst
    Duration: 12m 34s
    Output: pipelines/outputs/analysis/

[✓] requirements
    Agents: pm
    Duration: 18m 22s
    Output: pipelines/outputs/requirements/

[►] design
    Agents: architect, ux-designer (parallel)
    Duration: 8m 15s (running)
    Output: pending

[○] planning
    Agents: sm
    Duration: pending
    Output: n/a

Currently executing: design
Estimated remaining: ~45 minutes
```

### PIPELINE list

List available pipelines and templates.

```
PIPELINE list
```

### PIPELINE abort

Abort a running pipeline.

```
PIPELINE abort PIPE-20250115-myproject
```

### PIPELINE resume

Resume a failed or paused pipeline.

```
PIPELINE resume PIPE-20250115-myproject
```

## Pipeline Templates

### full_sdlc
Complete software development lifecycle.

```yaml
stages:
  - analysis (analyst)
  - requirements (pm) → depends on analysis
  - design (architect + ux-designer, parallel) → depends on requirements
  - planning (sm) → depends on design
  - implementation (dev) → depends on planning
  - review (tea) → depends on implementation
```

### quick_flow
Rapid development with minimal ceremony.

```yaml
stages:
  - spec (quick-flow-solo-dev)
  - implement (quick-flow-solo-dev) → depends on spec
```

### analysis_only
Product analysis and requirements.

```yaml
stages:
  - research (analyst)
  - brief (analyst) → depends on research
  - requirements (pm) → depends on brief
```

### design_review
Architecture and UX design with review.

```yaml
stages:
  - architecture (architect)
  - ux (ux-designer) → depends on architecture
  - review (analyst + pm, parallel) → depends on architecture, ux
```

### test_suite
Comprehensive testing workflow.

```yaml
stages:
  - test_design (tea)
  - test_impl (tea) → depends on test_design
  - security (tea) → depends on test_impl
  - trace (tea) → depends on test_impl
```

## Custom Pipeline Definition

```yaml
pipeline_id: "PIPE-20250115-custom"
name: "Custom Pipeline"
description: "My custom pipeline"
created: "2025-01-15T10:00:00Z"
status: "pending"

stages:
  - name: "stage1"
    agents: ["analyst"]
    parallel: false
    depends_on: []
    outputs: ["analysis_report"]
    status: "pending"

  - name: "stage2"
    agents: ["architect", "ux-designer"]
    parallel: true
    depends_on: ["stage1"]
    outputs: ["architecture", "ux_design"]
    status: "pending"

  - name: "stage3"
    agents: ["dev"]
    parallel: false
    depends_on: ["stage2"]
    outputs: ["implementation"]
    status: "pending"
```

## Execution Flow

1. **Initialize**: Load pipeline definition, validate agents exist
2. **Queue**: Find stages with all dependencies completed
3. **Execute**: Run queued stages (parallel or sequential based on config)
4. **Collect**: Gather outputs from completed stages
5. **Update**: Update pipeline state file
6. **Repeat**: Continue until all stages complete or failure

## Error Handling

| Mode | Behavior |
|------|----------|
| halt | Stop pipeline on first failure |
| skip_dependents | Skip stages that depend on failed stage |
| retry | Retry failed stage (up to max_retries) |

## Output Management

Pipeline outputs are stored in:
```
_bmad-output/
└── pipelines/
    ├── PIPE-20250115-myproject.yaml  # Pipeline state
    └── outputs/
        ├── analysis/
        │   └── product-brief.md
        ├── requirements/
        │   └── prd.md
        └── design/
            ├── architecture.md
            └── ux-design.md
```

## Integration with Token Isolation

When executing stages:
1. Each agent runs in isolated subprocess (via Task tool)
2. Outputs written to pipeline output directory
3. Only status summaries return to orchestrator
4. Token budget preserved across multi-stage pipelines

## Best Practices

1. **Use templates** for common workflows
2. **Define dependencies explicitly** for correct execution order
3. **Enable parallel** only for truly independent stages
4. **Monitor progress** with status command
5. **Archive completed** pipelines to maintain clean state
