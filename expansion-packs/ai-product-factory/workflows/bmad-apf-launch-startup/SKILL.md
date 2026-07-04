---
name: bmad-apf-launch-startup
description: Full orchestrated workflow from idea to production-ready startup launch. Use when the user wants to build and launch a complete product.
---

# Launch Startup — AI Product Factory Master Workflow

Orchestrate the complete journey from a single idea to a production-ready, launched startup. This is the master workflow of AI Product Factory.

## Philosophy

- **One prompt. One founder. One production-ready startup.**
- BMAD orchestrates; Cursor executes implementation.
- Every phase produces deterministic artifacts that become context for the next phase.
- Do NOT replace BMAD core — extend it. Delegate to `bmad-prd`, `bmad-create-architecture`, `bmad-dev-story` where applicable.

## Conventions

- `{apf_artifacts}` — APF artifact root (default: `{output_folder}/apf-artifacts`)
- `{planning_artifacts}` — BMM planning artifacts (PRD, architecture, etc.)
- `{implementation_artifacts}` — BMM implementation artifacts (stories, reviews)
- Load pipeline definition: `file:{project-root}/expansion-packs/ai-product-factory/knowledge/product-pipeline.md`

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`
2. Run `{workflow.activation_steps_prepend}`. Load `{workflow.persistent_facts}`.
3. Load config from `{project-root}/_bmad/apf/config.yaml` (fallback: `_bmad/bmm/config.yaml`). Resolve `{user_name}`, `{communication_language}`, `{apf_artifacts}`, `{product_type}`, `{target_platform}`, `{launch_kit}`.
4. Greet `{user_name}` in `{communication_language}`. Explain this is the full launch pipeline — idea to production.
5. Run `{workflow.activation_steps_append}`.

## Phase 0: Intake

Capture the raw idea and constraints:

1. Ask for the **idea** in the user's own words (one paragraph minimum).
2. Confirm **product type** (`{product_type}`) and **target platform** (`{target_platform}`).
3. Confirm **launch kit** (auto-detect or explicit from `{launch_kit}`).
4. Create run workspace: `{apf_artifacts}/runs/{date}-{slug}/`
5. Write `run-manifest.yaml` with idea, constraints, and phase status tracker.
6. Seed memlog: `uv run {project-root}/_bmad/scripts/memlog.py init --workspace {doc_workspace} --field topic="<product name>"`

## Phase 1: Founder Layer

Execute in order (skip phases with existing artifacts if resuming):

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 1.1 | `bmad-apf-validate-idea` | `{apf_artifacts}/founder/idea-validation-report.md` |
| 1.2 | `bmad-apf-market-research` (agent) | `{apf_artifacts}/founder/market-research-brief.md` |
| 1.3 | `bmad-apf-competitor` (agent) | `{apf_artifacts}/founder/competitive-analysis.md` |
| 1.4 | `bmad-apf-customer-persona` (agent) | `{apf_artifacts}/founder/personas/` |
| 1.5 | `bmad-apf-business-model` (agent) | `{apf_artifacts}/founder/lean-canvas.md` |
| 1.6 | `bmad-apf-pricing` (agent) | `{apf_artifacts}/founder/pricing-strategy.md` |

**Gate:** Proceed only if idea validation recommends GO or CONDITIONAL GO.

## Phase 2: Product Layer

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 2.1 | `bmad-apf-generate-prd` | `{planning_artifacts}/prd/` or `{apf_artifacts}/product/prd.md` |
| 2.2 | `bmad-apf-feature-prioritizer` (agent) | `{apf_artifacts}/product/mvp-features.md` |
| 2.3 | `bmad-apf-roadmap-planner` (agent) | `{apf_artifacts}/product/roadmap.md` |
| 2.4 | `bmad-apf-story-generator` (agent) | `{apf_artifacts}/product/epics-and-stories.md` |

## Phase 3: UX & Design Layer

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 3.1 | `bmad-apf-generate-ux` | `{apf_artifacts}/ux/user-flows.md`, wireframes |
| 3.2 | `bmad-apf-brand` (agent) | `{apf_artifacts}/design/brand-guidelines.md` |
| 3.3 | `bmad-apf-generate-design-system` | `{apf_artifacts}/design/design-system.md` |

## Phase 4: Engineering Layer

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 4.1 | `bmad-apf-choose-stack` | `{apf_artifacts}/engineering/tech-stack.md` |
| 4.2 | `bmad-create-architecture` (BMM) | `{planning_artifacts}/architecture/` |
| 4.3 | `bmad-apf-build-mvp` | Implementation in project codebase via Cursor |
| 4.4 | `bmad-apf-testing` (agent) | Test suite + QA report |

## Phase 5: Deployment Layer

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 5.1 | `bmad-apf-cicd` (agent) | CI/CD configuration |
| 5.2 | `bmad-apf-deploy-app` | Deployed application URL |
| 5.3 | Store deployment (if mobile) | TestFlight / Play Console |

## Phase 6: Marketing & Launch Layer

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 6.1 | `bmad-apf-generate-landing` | Landing page (deployed) |
| 6.2 | `bmad-apf-content` (agent) | Privacy, Terms, FAQ |
| 6.3 | `bmad-apf-aso` / `bmad-apf-seo` (agent) | Store/SEO optimization |
| 6.4 | `bmad-apf-social` (agent) | Launch content pack |
| 6.5 | `bmad-apf-product-hunt` (agent) | Product Hunt listing |

## Phase 7: Growth Layer (Post-Launch)

| Step | Skill | Artifact Output |
|------|-------|-----------------|
| 7.1 | `bmad-apf-growth-analytics` (agent) | Growth dashboard |
| 7.2 | `bmad-apf-iterate-product` | Iteration plan |

## Execution Mode

After intake, offer:

- **Guided** — walk through each phase with checkpoints. User approves before proceeding.
- **Express** — run phases sequentially with minimal interruption. Pause only at gates.
- **Resume** — continue from last incomplete phase in `run-manifest.yaml`.

## Checkpoints

At each phase boundary:

1. List artifacts produced
2. Summarize key decisions
3. Ask: Proceed / Revise / Pause
4. Update `run-manifest.yaml` phase status

## On Complete

Run `{workflow.on_complete}`. Update manifest status to `launched`. Share artifact index and deployed URLs.
