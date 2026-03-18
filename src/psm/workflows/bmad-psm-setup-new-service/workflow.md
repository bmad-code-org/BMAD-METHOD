---
workflow_id: W-SETUP-SVC-001
workflow_name: Setup Production Service for BMAD
version: 6.2.0
lead_agent: "Architect Khang"
supporting_agents: ["SRE Minh", "Mary Analyst"]
phase: "1-Analysis → 2-Planning → 3-Solutioning → 4-Implementation"
created_date: 2026-03-17
last_modified: 2026-03-17
config_file: "_config/config.yaml"
estimated_duration: "12-20 hours"
outputFile: '{output_folder}/psm-artifacts/service-setup-{{project_name}}-{{date}}.md'
---

# Setup Production Service Workflow — BMAD Pattern

## Metadata & Context

**Goal**: Xây dựng production-grade service từ scratch, với đầy đủ architecture, API design, deployment pipeline, reliability patterns, security, và production readiness.

**Lead Team**:
- SRE Minh (Reliability, Infrastructure, Operations)
- Architect Khang (System Design, Technology Selection)
- Mary Analyst (Requirements, Risk Assessment)

**Success Criteria**:
- ✓ Architecture design document approved
- ✓ API contracts defined & validated
- ✓ Database schema designed & indexed
- ✓ CI/CD pipeline operational
- ✓ Resilience & observability in place
- ✓ Security & compliance verified
- ✓ Production readiness checklist passed

## Workflow Overview

Workflow này di qua 6 bước atomic, mỗi bước focus vào một domain riêng:

1. **Step-01-Architecture** → Requirements + Architecture Pattern Selection
2. **Step-02-API-Database** → API Design + Database Selection + Schema
3. **Step-03-Build-Deploy** → CI/CD + Containerization + Testing Strategy
4. **Step-04-Reliability** → Resilience Patterns + Observability + Error Handling
5. **Step-05-Security-Infra** → Auth/Authz + Secrets + K8s Config
6. **Step-06-Readiness** → PRR Checklist + Runbook + Go/No-Go Decision

## Configuration Loading

Tự động load từ `_config/config.yaml`:

```yaml
project_context:
  user_name: "[loaded from config]"
  organization: "[loaded from config]"
  environment: "production"

workflow_defaults:
  communication_language: "Vietnamese"
  output_folder: "./outputs/setup-new-service-{service_name}"
  timestamp: "2026-03-17"
```

## Execution Model

### Entry Point Logic

```
1. Check if workflow.md exists in outputs folder
   → If NEW: Start from step-01-architecture.md
   → If RESUME: Load progress.yaml → auto-skip completed steps
   → If PARTIAL: Load step-N-context.yaml → resume from step N

2. For each step:
   a) Load step-{N}-{name}.md
   b) Load referenced SKILL files (auto-parse "Load:" directives)
   c) Execute MENU [A][C] options
   d) Save step output to step-{N}-output.md
   e) Move to next step

3. Final: Generate comprehensive outputs in outputs folder
```

### State Tracking

Output document frontmatter tracks progress:

```yaml
workflow_progress:
  step_01_architecture: "completed"
  step_02_api_database: "completed"
  step_03_build_deploy: "in_progress"
  step_04_reliability: "pending"
  step_05_security_infra: "pending"
  step_06_readiness: "pending"
  last_updated: "2026-03-17T14:30:00Z"
  current_agent: "Architect Khang"
```

## Mandatory Workflow Rules

1. **No skipping steps** — Mỗi step phải được execute theo order
2. **Validate assumptions** — Mỗi decision phải được document
3. **Cross-phase collaboration** — Architects + SRE + Analysts work together
4. **Output artifacts** — Mỗi step produce tangible output documents
5. **Handoff protocol** — Context được transfer giữa steps rõ ràng

## Navigation

Hãy chọn cách bắt đầu:

- **[NEW]** — Bắt đầu workflow mới → Load step-01
- **[RESUME]** — Quay lại workflow đã từng chạy (detect progress)
- **[SKIP-TO]** — Nhảy tới step cụ thể (dev-only, requires confirmation)

---

**Tiếp tục bằng cách chọn [NEW] hoặc [RESUME]**
