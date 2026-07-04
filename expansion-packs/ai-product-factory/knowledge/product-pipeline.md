# AI Product Factory — Product Pipeline

The complete orchestrated flow from idea to launched product.

```
Idea
 ↓
Idea Validation          → bmad-apf-validate-idea
 ↓
Market Research          → bmad-apf-market-research
 ↓
Competitor Analysis      → bmad-apf-competitor
 ↓
Business Model           → bmad-apf-business-model
 ↓
PRD                      → bmad-apf-generate-prd (→ bmad-prd)
 ↓
Feature Planning         → bmad-apf-feature-prioritizer
 ↓
UX                       → bmad-apf-generate-ux
 ↓
UI Design                → bmad-apf-generate-design-system
 ↓
Architecture             → bmad-apf-choose-stack → bmad-create-architecture
 ↓
Tech Stack Selection     → (included in choose-stack)
 ↓
Frontend + Backend       → bmad-apf-build-mvp
 ↓
Database + Auth + Payments → (sub-agents within build-mvp)
 ↓
Analytics                → bmad-apf-analytics
 ↓
QA                       → bmad-apf-testing
 ↓
CI/CD                    → bmad-apf-cicd
 ↓
Deployment               → bmad-apf-deploy-app
 ↓
App Store / Play Store   → bmad-apf-apple-deployment / bmad-apf-google-play
 ↓
Landing Page             → bmad-apf-generate-landing
 ↓
Marketing Assets         → bmad-apf-content, bmad-apf-social
 ↓
ASO / SEO                → bmad-apf-aso, bmad-apf-seo
 ↓
Launch                   → bmad-apf-launch-startup (orchestrator)
 ↓
Growth                   → bmad-apf-iterate-product
 ↓
Iteration                → bmad-apf-experiment
```

## Master Orchestrator

`bmad-apf-launch-startup` runs the full pipeline with phase gates and checkpoints.

## BMAD Core Integration

| APF Phase | BMAD Core Skill |
|---|---|
| PRD | `bmad-prd` |
| Architecture | `bmad-create-architecture` |
| Epics & Stories | `bmad-create-epics-and-stories` |
| Dev Stories | `bmad-dev-story` |
| Code Review | `bmad-code-review` |
| UX (alternative) | `bmad-ux` |
| Brainstorming | `bmad-brainstorming` |
| Market Research | `bmad-market-research` |

## Artifact Continuity

Each phase reads artifacts from prior phases in `{apf_artifacts}/`. Never start a phase without checking for existing upstream artifacts.
