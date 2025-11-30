# Generate BMM Workflow Manifest

This prompt generates a YAML manifest of all BMM workflows, their connections, and dependencies. The manifest serves as the source of truth for diagram generation and workflow documentation.

## Instructions

You are an agentic assistant tasked with researching the BMM workflow structure and generating a comprehensive manifest. Follow these steps:

### 1. Research Phase

Scan the BMM workflow structure to discover all workflows:

**Locations to scan:**

- `src/modules/bmm/workflows/1-analysis/` - Phase 1 (Discovery) workflows
- `src/modules/bmm/workflows/2-plan-workflows/` - Phase 2 (Planning) workflows
- `src/modules/bmm/workflows/3-solutioning/` - Phase 3 (Solutioning) workflows
- `src/modules/bmm/workflows/4-implementation/` - Phase 4 (Implementation) workflows
- `src/modules/bmm/workflows/bmad-quick-flow/` - Quick Flow workflows
- `src/modules/bmm/workflows/workflow-status/init/` - Entry point workflow

**For each workflow directory, extract from `workflow.yaml`:**

- `name` - The workflow name (e.g., "product-brief")
- `default_output_file` or output patterns - What files the workflow produces
- **DO NOT extract descriptions** - they cause false change detection and aren't used in diagrams

**Additional information to gather:**

- Read `package.json` to get the current BMAD version
- Get the current git commit hash (short form): `git rev-parse --short HEAD`
- Current timestamp in ISO format
- **Reference `docs/diagrams/bmm-workflow.d2`** for workflow connections (not descriptions)

### 2. Understand Workflow Connections

Study the existing `docs/diagrams/bmm-workflow.d2` file to understand:

**Within-phase connections:**

- Phase 1: All activities (brainstorm, research, domain-research, document-project) converge to product-brief
- Phase 3: architecture → create-epics-and-stories → implementation-readiness (sequential)
- Phase 4: sprint-planning → create-story → dev-story → code-review → story-done → retrospective (sequential)

**Decision points:**

- Phase 2: After `/prd`, there's a "Has UI?" decision
  - Yes → `/ux-design`
  - No → `/architecture` (cross-phase to Phase 3)

**Feedback loops (Phase 4):**

- code-review → dev-story (label: "fixes")
- story-done → create-story (label: "next story")
- retrospective → sprint-planning (label: "next epic")

**Cross-phase connections:**

- Entry: workflow-init → Phase 1 activities (main flow)
- Entry: workflow-init → quick-flow/create-tech-spec (quick-flow path)
- Phase 1: product-brief → Phase 2 prd
- Phase 2: ux-design → Phase 3 architecture
- Phase 2: tech-spec → Phase 3 create-epics-and-stories (quick-flow path, dashed)
- Phase 3: implementation-readiness → Phase 4 sprint-planning

**Standalone workflows:**

- Phase 4: `/correct-course` - Not part of main flow, run when issues arise

### 3. Build Manifest

Create a YAML manifest with this structure:

```yaml
version: '1.0'
generated: '<ISO timestamp>'
source_commit: '<git short hash>'
bmad_version: '<version from package.json>'

# Entry point
entry:
  id: workflow-init
  name: /workflow-init
  outputs:
    - file: '@bmm-workflow-status.yaml'

phases:
  discovery:
    label: 'PHASE 1: DISCOVERY'
    directory: '1-analysis'
    optional: true
    parallel: true # Activities can run in any order
    workflows:
      - id: <workflow-id>
        name: /<workflow-name>
        outputs:
          - file: '@filename.md'
            description: '...' # Only output files have descriptions (for legend)

    connections:
      - from: [brainstorm-project, research, domain-research, document-project]
        to: product-brief
        type: converge

  planning:
    label: 'PHASE 2: PLANNING'
    directory: '2-plan-workflows'
    optional: false
    parallel: false
    workflows: [...]

    decisions:
      - id: has-ui
        label: 'Has UI?'
        after: prd
        branches:
          - condition: 'Yes'
            to: ux-design
          - condition: 'No'
            to: architecture

    connections:
      - from: ux-design
        to: architecture

  solutioning:
    label: 'PHASE 3: SOLUTIONING'
    directory: '3-solutioning'
    optional: false
    parallel: false
    workflows: [...]

    connections:
      - from: architecture
        to: create-epics-and-stories
        type: sequential
      - from: create-epics-and-stories
        to: implementation-readiness
        type: sequential

  implementation:
    label: 'PHASE 4: IMPLEMENTATION'
    directory: '4-implementation'
    optional: false
    parallel: false
    workflows: [...]

    connections:
      - from: sprint-planning
        to: create-story
        type: sequential
      # ... etc

    feedback_loops:
      - from: code-review
        to: dev-story
        label: 'fixes'
        description: 'Return to dev for fixes'
      # ... etc

quick_flow:
  auto_regenerate: false
  directory: 'bmad-quick-flow'
  description: 'Fast-track path for experienced teams'
  workflows: [...]

  connections:
    - from: create-tech-spec
      to: quick-dev
      type: sequential

cross_phase_connections:
  - from: entry.workflow-init
    to: phases.discovery.activities
    label: 'Main flow'
    type: entry
  - from: entry.workflow-init
    to: quick_flow.create-tech-spec
    label: 'Quick-flow'
    type: quick_flow
  # ... etc

legend:
  title: 'OUTPUTS'
  items:
    - file: '@filename.md'
      description: '...'
    # ... all output files from all workflows
```

### 4. Compare with Previous Manifest (if exists)

If `docs/diagrams/workflow-manifest.yaml` already exists:

1. Load the existing manifest
2. Compare with the newly generated manifest
3. Detect changes:
   - Added workflows
   - Removed workflows
   - Changed workflow outputs
   - Changed output file descriptions (in legend)
   - Changed connections or dependencies
   - Changed decision points or feedback loops

4. Categorize changes:
   - **Quick Flow changes**: Any changes in the `quick_flow` section
   - **Main workflow changes**: Any changes in `phases` or `cross_phase_connections`

### 5. Decision Point

**If Quick Flow changes detected:**

- **HARD STOP** - Do not proceed
- Report what changed in detail
- Ask user: "Quick Flow has changed. What would you like to do?"
  - Option 1: Update manifest with changes
  - Option 2: Keep existing manifest
  - Option 3: Review changes and decide

**If main workflow changes detected:**

- Report what changed
- Ask user: "Main workflows have changed. Approve updating the manifest?"
  - If approved: Proceed to write
  - If rejected: Keep existing manifest

**If no changes detected:**

- Proceed silently to write manifest

### 6. Write Manifest

Write the manifest to `docs/diagrams/workflow-manifest.yaml`

Report summary:

- Number of workflows discovered
- Number of phases
- Number of output documents
- Any changes detected (if comparing)

## Self-Check

Before finalizing, verify:

**Completeness:**

- [ ] All workflow directories scanned
- [ ] All workflow.yaml files read
- [ ] All output files extracted
- [ ] Version and commit info included
- [ ] Timestamp is current

**Connections:**

- [ ] Within-phase connections defined
- [ ] Cross-phase connections defined
- [ ] Decision points defined
- [ ] Feedback loops defined
- [ ] Quick-flow paths defined

**Accuracy:**

- [ ] Workflow names match directory names
- [ ] Workflows do NOT have description fields (prevents false change detection)
- [ ] Output file descriptions are clear and concise (appear in legend)
- [ ] Output files match workflow.yaml patterns
- [ ] Connections match bmm-workflow.d2

**Change Detection (if applicable):**

- [ ] Previous manifest loaded correctly
- [ ] All changes detected
- [ ] Changes categorized correctly
- [ ] User prompted appropriately

## Notes

- This is an **agentic prompt**, not a formal BMAD workflow
- The manifest is the **source of truth** for diagram generation
- Quick Flow changes require **hard stop** - they're critical
- Main workflow changes require **user approval** - they're important
- The manifest should be **version controlled** in git
