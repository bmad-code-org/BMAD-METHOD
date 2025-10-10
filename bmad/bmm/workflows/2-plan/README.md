---
last-redoc-date: 2025-10-01
---

# Project Planning Workflow (Phase 2)

This scale-adaptive workflow represents the cornerstone of BMM v6's intelligent project orchestration, automatically determining project complexity (Level 0-4) and routing to specialized planning pathways based on project type, scope, and context. Unlike traditional one-size-fits-all planning approaches, it dynamically adjusts output artifacts—from minimal tech specs for atomic changes to comprehensive PRD suites for enterprise platforms—ensuring planning overhead matches project value. The workflow serves as the critical bridge between Phase 1 analysis outputs and Phase 3 solutioning, establishing the contractual foundation for all subsequent development activities.

The workflow's routing intelligence analyzes project characteristics through multi-dimensional assessment: project type (game, web, mobile, backend), context (greenfield vs. brownfield), scope indicators, and complexity signals. Based on this analysis, it classifies projects into five levels with distinct artifact requirements. Level 0 produces only tech specs for single atomic changes. Levels 1-2 generate focused PRDs with embedded tech specs. Levels 3-4 create comprehensive PRDs with separate epics that hand off to the architect-driven solutioning workflow. This classification isn't merely about document generation—it fundamentally changes how requirements are structured, validated, and communicated to downstream consumers.

Critical to v6's flow improvement is this workflow's integration with the project-workflow-analysis.md tracking document, which maintains project state across sessions, tracks which agents participate in each phase, and provides continuity for multi-session planning efforts. The workflow can resume from any point, intelligently detecting existing artifacts and determining next steps without redundant work. For game projects, it routes to specialized GDD generation with genre-specific templates. For UX-heavy projects, it can generate standalone UX specifications or AI frontend prompts from existing specs.

## Key Features

- **Scale-adaptive planning** - Automatically determines output based on project complexity
- **Intelligent routing** - Uses router system to load appropriate instruction sets
- **Continuation support** - Can resume from previous sessions and handle incremental work
- **Multi-level outputs** - Supports 5 project levels (0-4) with appropriate artifacts
- **Input integration** - Leverages product briefs and market research when available
- **Template-driven** - Uses validated templates for consistent output structure

## Usage

### Basic Invocation

```bash
workflow plan-project
```

### With Input Documents

```bash
# With product brief as input
workflow plan-project --input /path/to/product-brief.md

# With multiple inputs
workflow plan-project --input product-brief.md --input market-research.md
```

### Configuration

The workflow adapts automatically based on project assessment, but key configuration options include:

- **scale_parameters**: Defines story/epic counts for each project level
- **output_folder**: Where all generated documents are stored
- **project_name**: Used in document names and templates

## Workflow Structure

### Files Included

```
plan-project/
├── workflow.yaml              # Configuration and metadata
├── instructions-router.md     # Initial assessment and routing logic
├── instructions-sm.md         # Level 0 instructions (tech-spec only)
├── instructions-med.md        # Level 1-2 instructions (PRD + tech-spec)
├── instructions-lg.md         # Level 3-4 instructions (full PRD + epics)
├── analysis-template.md       # Project assessment template
├── prd-template.md           # Product Requirements Document template
├── tech-spec-template.md     # Technical Specification template
├── epics-template.md         # Epic breakdown template
├── checklist.md              # Validation criteria
└── README.md                 # This file
```

## Workflow Process

### Phase 1: Assessment and Routing (Steps 1-5)

- **Project Analysis**: Determines project type (greenfield/brownfield/legacy)
- **Scope Assessment**: Classifies into 5 levels based on complexity
- **Document Discovery**: Identifies existing inputs and documentation
- **Workflow Routing**: Loads appropriate instruction set based on level
- **Continuation Handling**: Resumes from previous work when applicable

### Phase 2: Level-Specific Planning (Steps vary by level)

**Level 0 (Single Atomic Change)**:

- Creates technical specification only
- Focuses on implementation details for small changes

**Level 1-2 (Features and Small Systems)**:

- Generates minimal PRD with core sections
- Creates comprehensive tech-spec
- Includes basic epic breakdown

**Level 3-4 (Full Products and Platforms)**:

- Produces complete PRD with all sections
- Generates detailed epic breakdown
- Includes architect handoff materials
- Creates traceability mapping

### Phase 3: Validation and Handoff (Final steps)

- **Document Review**: Validates outputs against checklists
- **Architect Preparation**: For Level 3-4, prepares handoff materials
- **Next Steps**: Provides guidance for development phase

## Output

### Generated Files

- **Primary output**: PRD.md (except Level 0), tech-spec.md, project-workflow-analysis.md
- **Supporting files**: epics.md (Level 3-4), PRD-validation-report.md (if validation run)

### Output Structure by Level

**Level 0 - Tech Spec Only**:

1. **Technical Overview** - Implementation approach
2. **Detailed Design** - Code-level specifications
3. **Testing Strategy** - Validation approach

**Level 1-2 - Minimal PRD + Tech Spec**:

1. **Problem Statement** - Core issue definition
2. **Solution Overview** - High-level approach
3. **Requirements** - Functional and non-functional
4. **Technical Specification** - Implementation details
5. **Success Criteria** - Acceptance criteria

**Level 3-4 - Full PRD + Epics**:

1. **Executive Summary** - Project overview
2. **Problem Definition** - Detailed problem analysis
3. **Solution Architecture** - Comprehensive solution design
4. **User Experience** - Journey mapping and wireframes
5. **Requirements** - Complete functional/non-functional specs
6. **Epic Breakdown** - Development phases and stories
7. **Technical Handoff** - Architecture and implementation guidance

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
- **Check**: Verify the project-workflow-analysis.md reflects actual project complexity

**Issue**: Missing input documents cause incomplete planning

- **Solution**: Gather recommended inputs or proceed with manual context gathering
- **Check**: Ensure critical business context is captured even without formal documents

**Issue**: Continuation from previous session fails

- **Solution**: Check for existing project-workflow-analysis.md and ensure output folder is correct
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
- Consult project assessment in `project-workflow-analysis.md`
- Check continuation status in existing output documents

---

_Part of the BMad Method v6 - BMM (Method) Module_
