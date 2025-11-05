---
last-redoc-date: 2025-10-01
---

# Project Planning Workflow (Phase 2)

The Phase 2 Planning workflow is **scale-adaptive**, meaning it automatically determines the right level of planning documentation based on project complexity (Levels 0-4). This ensures planning overhead matches project value—from minimal tech specs for bug fixes to comprehensive PRDs for enterprise platforms.

## Scale-Adaptive Flow (Levels 0-4)

The workflow routes to different planning approaches based on project level:

### Level 0 - Single File Change / Bug Fix

**Planning:** Tech-spec only (lightweight implementation plan)
**Output:** `tech-spec.md` with single story
**Next Phase:** Direct to implementation (Phase 4)

### Level 1 - Small Feature (1-3 files, 2-5 stories)

**Planning:** Tech-spec only (implementation-focused)
**Output:** `tech-spec.md` with epic breakdown and stories
**Next Phase:** Direct to implementation (Phase 4)

### Level 2 - Feature Set / Small Project (5-15 stories, 1-2 epics)

**Planning:** PRD (product-focused) + Tech-spec (technical planning)
**Output:** `PRD.md`, `epics.md`, `tech-spec.md`
**Next Phase:** Tech-spec workflow (lightweight solutioning), then implementation (Phase 4)
**Note:** Level 2 uses tech-spec instead of full architecture to keep planning lightweight

### Level 3 - Medium Project (15-40 stories, 2-5 epics)

**Planning:** PRD (strategic product document)
**Output:** `PRD.md`, `epics.md`
**Next Phase:** create-architecture workflow (Phase 3), then implementation (Phase 4)

### Level 4 - Large/Enterprise Project (40-100+ stories, 5-10 epics)

**Planning:** PRD (comprehensive product specification)
**Output:** `PRD.md`, `epics.md`
**Next Phase:** create-architecture workflow (Phase 3), then implementation (Phase 4)

**Critical Distinction:**

- **Levels 0-1:** No PRD, tech-spec only
- **Level 2:** PRD + tech-spec (skips full architecture)
- **Levels 3-4:** PRD → full create-architecture workflow

Critical to v6's flow improvement is this workflow's integration with the bmm-workflow-status.md tracking document, which maintains project state across sessions, tracks which agents participate in each phase, and provides continuity for multi-session planning efforts. The workflow can resume from any point, intelligently detecting existing artifacts and determining next steps without redundant work. For UX-heavy projects, it can generate standalone UX specifications or AI frontend prompts from existing specs.

## Key Features

- **Scale-adaptive planning** - Automatically determines output based on project complexity
- **Intelligent routing** - Uses router system to load appropriate instruction sets
- **Continuation support** - Can resume from previous sessions and handle incremental work
- **Multi-level outputs** - Supports 5 project levels (0-4) with appropriate artifacts
- **Input integration** - Leverages product briefs and market research when available
- **Template-driven** - Uses validated templates for consistent output structure

### Configuration

The workflow adapts automatically based on project assessment, but key configuration options include:

- **scale_parameters**: Defines story/epic counts for each project level
- **output_folder**: Where all generated documents are stored
- **project_name**: Used in document names and templates

## Workflow Structure

### Files Included

```
2-plan-workflows/
├── README.md                      # Overview and usage details
├── checklist.md                   # Shared validation criteria
├── prd/
│   ├── epics-template.md          # Epic breakdown template
│   ├── instructions.md            # Level 2-4 PRD instructions
│   ├── prd-template.md            # Product Requirements Document template
│   └── workflow.yaml
├── tech-spec/
│   ├── epics-template.md          # Epic-to-story handoff template
│   ├── instructions-level0-story.md
│   ├── instructions-level1-stories.md
│   ├── instructions.md            # Level 0-1 tech-spec instructions
│   ├── tech-spec-template.md      # Technical Specification template
│   ├── user-story-template.md     # Story template for Level 0/1
│   └── workflow.yaml
├── gdd/
│   ├── instructions-gdd.md        # Game Design Document instructions
│   ├── gdd-template.md            # GDD template
│   ├── game-types.csv             # Genre catalog
│   ├── game-types/                # Genre-specific templates
│   └── workflow.yaml
├── narrative/
│   ├── instructions-narrative.md  # Narrative design instructions
│   ├── narrative-template.md      # Narrative planning template
│   └── workflow.yaml
└── create-ux-design/
    ├── instructions.md            # UX design instructions
    ├── ux-design-template.md      # UX design template
    ├── checklist.md               # UX design validation checklist
    └── workflow.yaml
```

## Workflow Process

### Phase 1: Assessment and Routing (Steps 1-5)

- **Project Analysis**: Determines project type (greenfield/brownfield/legacy)
- **Scope Assessment**: Classifies into 5 levels based on complexity
- **Document Discovery**: Identifies existing inputs and documentation
- **Workflow Routing**: Loads appropriate instruction set based on level
- **Continuation Handling**: Resumes from previous work when applicable

### Phase 2: Level-Specific Planning (Steps vary by level)

**Level 0 (Single File Change / Bug Fix)**:

- Tech-spec only workflow
- Single story implementation plan
- Direct to Phase 4 (implementation)

**Level 1 (Small Feature)**:

- Tech-spec only workflow
- Epic breakdown with 2-5 stories
- Direct to Phase 4 (implementation)

**Level 2 (Feature Set / Small Project)**:

- PRD workflow (strategic product document)
- Generates `PRD.md` and `epics.md`
- Then runs tech-spec workflow (lightweight solutioning)
- Then to Phase 4 (implementation)

**Level 3-4 (Medium to Enterprise Projects)**:

- PRD workflow (comprehensive product specification)
- Generates `PRD.md` and `epics.md`
- Hands off to Phase 3 (create-architecture workflow)
- Full architecture design before implementation

### Phase 3: Validation and Handoff (Final steps)

- **Document Review**: Validates outputs against checklists
- **Architect Preparation**: For Level 3-4, prepares handoff materials
- **Next Steps**: Provides guidance for development phase

## Output

### Generated Files

- **Primary output**: PRD.md (except Level 0), tech-spec.md, bmm-workflow-status.md
- **Supporting files**: epics.md (Level 2-4), PRD-validation-report.md (if validation run)

### Output Structure by Level

**Level 0 - Tech Spec Only**:

- `tech-spec.md` - Single story implementation plan
- Direct to implementation

**Level 1 - Tech Spec with Epic Breakdown**:

- `tech-spec.md` - Epic breakdown with 2-5 stories
- Direct to implementation

**Level 2 - PRD + Tech Spec**:

- `PRD.md` - Strategic product document (goals, requirements, user journeys, UX principles, UI goals, epic list, scope)
- `epics.md` - Tactical implementation roadmap (detailed story breakdown)
- `tech-spec.md` - Lightweight technical planning (generated after PRD)
- Then to implementation

**Level 3-4 - PRD + Full Architecture**:

- `PRD.md` - Comprehensive product specification
- `epics.md` - Complete epic/story breakdown
- Hands off to create-architecture workflow (Phase 3)
- `architecture.md` - Generated by architect workflow
- Then to implementation

## Requirements

- **Input Documents**: Product brief and/or market research (recommended but not required)
- **Project Configuration**: Valid config.yaml with project_name and output_folder
- **Assessment Readiness**: Clear understanding of project scope and objectives

## Best Practices

### Before Starting

1. **Gather Context**: Collect any existing product briefs, market research, or requirements
2. **Define Scope**: Have a clear sense of project boundaries and complexity
3. **Prepare Stakeholders**: Ensure key stakeholders are available for input if needed

### During Execution

1. **Be Honest About Scope**: Accurate assessment ensures appropriate planning depth
2. **Leverage Existing Work**: Reference previous documents and avoid duplication
3. **Think Incrementally**: Remember that planning can evolve - start with what you know

### After Completion

1. **Validate Against Checklist**: Use included validation criteria to ensure completeness
2. **Share with Stakeholders**: Distribute appropriate documents to relevant team members
3. **Prepare for Architecture**: For Level 3-4 projects, ensure architect has complete context

## Troubleshooting

### Common Issues

**Issue**: Workflow creates wrong level of documentation

- **Solution**: Review project assessment and restart with correct scope classification
- **Check**: Verify the bmm-workflow-status.md reflects actual project complexity

**Issue**: Missing input documents cause incomplete planning

- **Solution**: Gather recommended inputs or proceed with manual context gathering
- **Check**: Ensure critical business context is captured even without formal documents

**Issue**: Continuation from previous session fails

- **Solution**: Check for existing bmm-workflow-status.md and ensure output folder is correct
- **Check**: Verify previous session completed at a valid checkpoint

## Customization

To customize this workflow:

1. **Modify Assessment Logic**: Update instructions-router.md to adjust level classification
2. **Adjust Templates**: Customize PRD, tech-spec, or epic templates for organizational needs
3. **Add Validation**: Extend checklist.md with organization-specific quality criteria
4. **Configure Outputs**: Modify workflow.yaml to change file naming or structure

## Version History

- **v6.0.0** - Scale-adaptive architecture with intelligent routing
  - Multi-level project support (0-4)
  - Continuation and resumption capabilities
  - Template-driven output generation
  - Input document integration

## Support

For issues or questions:

- Review the workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Validate output using `checklist.md`
- Consult project assessment in `bmm-workflow-status.md`
- Check continuation status in existing output documents

---

_Part of the BMad Method v6 - BMM (Method) Module_
