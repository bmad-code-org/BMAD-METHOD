---
name: bmad-apf-generate-prd
description: Generate a PRD from AI Product Factory founder artifacts. Wraps bmad-prd with APF context injection.
---

# Generate PRD — AI Product Factory

Generate a production-grade PRD by feeding validated founder artifacts into the BMAD PRD workflow.

## On Activation

1. Resolve customization and load config.
2. Scan `{apf_artifacts}/founder/` for upstream artifacts:
   - `idea-validation-report.md`
   - `lean-canvas.md`
   - `market-research-brief.md`
   - `competitive-analysis.md`
   - `personas/`
   - `pricing-strategy.md`
3. Scan `{apf_artifacts}/product/` for existing product vision.

## Step 1: Context Assembly

Compile an **APF Context Brief** at `{apf_artifacts}/product/apf-context-brief.md` summarizing all founder-layer artifacts. This becomes input for PRD generation.

## Step 2: Invoke BMAD PRD

Invoke `bmad-prd` with:
- **Intent:** create
- **Pre-loaded context:** APF Context Brief path
- **Additional persistent facts:**
  - "PRD must reference validated personas from {apf_artifacts}/founder/personas/"
  - "MVP scope must align with lean canvas solution box"
  - "Success metrics must connect to pricing strategy"

Let `bmad-prd` drive the PRD creation process.

## Step 3: Cross-Reference

After PRD draft, verify:
- [ ] Personas referenced in user journeys
- [ ] MVP features match lean canvas
- [ ] Pricing tiers reflected if applicable
- [ ] Competitive differentiation captured

## Handoff

- **UX:** `bmad-apf-generate-ux`
- **Architecture:** `bmad-apf-choose-stack` → `bmad-create-architecture`
- **Stories:** `bmad-apf-story-generator`

Run `{workflow.on_complete}`.
