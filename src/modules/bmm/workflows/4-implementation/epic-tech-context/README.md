# Technical Specification Workflow

## Overview

Generate a comprehensive Technical Specification for a single epic from PRD, Epics file and Architecture to produce a document with full acceptance criteria and traceability mapping. Creates detailed implementation guidance that bridges business requirements with technical execution.

## Key Features

- **PRD-Architecture Integration** - Synthesizes business requirements with technical constraints
- **Traceability Mapping** - Links acceptance criteria to technical components and tests
- **Multi-Input Support** - Leverages PRD, architecture, front-end specs, and brownfield notes
- **Implementation Focus** - Provides concrete technical guidance for development teams
- **Testing Integration** - Includes test strategy aligned with acceptance criteria
- **Validation Ready** - Generates specifications suitable for architectural review

## Usage

### Basic Invocation

```bash
workflow tech-spec
```

### With Input Documents

```bash
# With specific PRD and architecture
workflow tech-spec --input PRD.md --input architecture.md

# With comprehensive inputs
workflow tech-spec --input PRD.md --input architecture.md --input front-end-spec.md
```

### Configuration

- **output_folder**: Location for generated technical specification
- **epic_id**: Used in output filename (extracted from PRD or prompted)
- **recommended_inputs**: PRD, architecture, front-end spec, brownfield notes

## Workflow Structure

### Files Included

```
tech-spec/
├── workflow.yaml           # Configuration and metadata
├── instructions.md         # Step-by-step execution guide
├── template.md            # Technical specification structure
├── checklist.md           # Validation criteria
└── README.md              # This file
```

## Workflow Process

### Phase 1: Input Collection and Analysis (Steps 1-2)

- **Document Discovery**: Locates PRD and Architecture documents
- **Epic Extraction**: Identifies epic title and ID from PRD content
- **Template Initialization**: Creates tech-spec document from template
- **Context Analysis**: Reviews complete PRD and architecture for alignment

### Phase 2: Technical Design Specification (Step 3)

- **Service Architecture**: Defines services/modules with responsibilities and interfaces
- **Data Modeling**: Specifies entities, schemas, and relationships
- **API Design**: Documents endpoints, request/response models, and error handling
- **Workflow Definition**: Details sequence flows and data processing patterns

### Phase 3: Non-Functional Requirements (Step 4)

- **Performance Specs**: Defines measurable latency, throughput, and scalability targets
- **Security Requirements**: Specifies authentication, authorization, and data protection
- **Reliability Standards**: Documents availability, recovery, and degradation behavior
- **Observability Framework**: Defines logging, metrics, and tracing requirements

### Phase 4: Dependencies and Integration (Step 5)

- **Dependency Analysis**: Scans repository for package manifests and frameworks
- **Integration Mapping**: Identifies external systems and API dependencies
- **Version Management**: Documents version constraints and compatibility requirements
- **Infrastructure Needs**: Specifies deployment and runtime dependencies

### Phase 5: Acceptance and Testing (Step 6)

- **Criteria Normalization**: Extracts and refines acceptance criteria from PRD
- **Traceability Matrix**: Maps acceptance criteria to technical components
- **Test Strategy**: Defines testing approach for each acceptance criterion
- **Component Mapping**: Links requirements to specific APIs and modules

### Phase 6: Risk and Validation (Steps 7-8)

- **Risk Assessment**: Identifies technical risks, assumptions, and open questions
- **Mitigation Planning**: Provides strategies for addressing identified risks
- **Quality Validation**: Ensures specification meets completeness criteria
- **Checklist Verification**: Validates against workflow quality standards

## Output

### Generated Files

- **Primary output**: tech-spec-{epic_id}-{date}.md
- **Traceability data**: Embedded mapping tables linking requirements to implementation

### Output Structure

1. **Overview and Scope** - Project context and boundaries
2. **System Architecture Alignment** - Connection to architecture
3. **Detailed Design** - Services, data models, APIs, and workflows
4. **Non-Functional Requirements** - Performance, security, reliability, observability
5. **Dependencies and Integrations** - External systems and technical dependencies
6. **Acceptance Criteria** - Testable requirements from PRD
7. **Traceability Mapping** - Requirements-to-implementation mapping
8. **Test Strategy** - Testing approach and framework alignment
9. **Risks and Assumptions** - Technical risks and mitigation strategies

## Requirements

- **PRD Document**: Product Requirements Document with clear acceptance criteria
- **Architecture Document**: architecture or technical design
- **Repository Access**: For dependency analysis and framework detection
- **Epic Context**: Clear epic identification and scope definition

## Best Practices

### Before Starting

1. **Validate Inputs**: Ensure PRD and architecture documents are complete and current
2. **Review Requirements**: Confirm acceptance criteria are specific and testable
3. **Check Dependencies**: Verify repository structure supports automated dependency analysis

### During Execution

1. **Maintain Traceability**: Ensure every acceptance criterion maps to implementation
2. **Be Implementation-Specific**: Provide concrete technical guidance, not high-level concepts
3. **Consider Constraints**: Factor in existing system limitations and brownfield challenges

### After Completion

1. **Architect Review**: Have technical lead validate design decisions
2. **Developer Walkthrough**: Ensure implementation team understands specifications
3. **Test Planning**: Use traceability matrix for test case development

## Troubleshooting

### Common Issues

**Issue**: Missing or incomplete technical details

- **Solution**: Review architecture document for implementation specifics
- **Check**: Ensure PRD contains sufficient functional requirements detail

**Issue**: Acceptance criteria don't map cleanly to technical components

- **Solution**: Break down complex criteria into atomic, testable statements
- **Check**: Verify PRD acceptance criteria are properly structured

**Issue**: Dependency analysis fails or is incomplete

- **Solution**: Check repository structure and manifest file locations
- **Check**: Verify repository contains standard dependency files (package.json, etc.)

**Issue**: Non-functional requirements are too vague

- **Solution**: Extract specific performance and quality targets from architecture
- **Check**: Ensure architecture document contains measurable NFR specifications

## Customization

To customize this workflow:

1. **Modify Template**: Update template.md to match organizational technical spec standards
2. **Extend Dependencies**: Add support for additional package managers or frameworks
3. **Enhance Validation**: Extend checklist.md with company-specific technical criteria
4. **Add Sections**: Include additional technical concerns like DevOps or monitoring

## Version History

- **v6.0.0** - Comprehensive technical specification with traceability
  - PRD-Architecture integration
  - Automated dependency detection
  - Traceability mapping
  - Test strategy alignment

## Support

For issues or questions:

- Review the workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Validate output using `checklist.md`
- Ensure PRD and architecture documents are complete before starting
- Consult BMAD documentation for technical specification standards

---

_Part of the BMad Method v6 - BMM (Method) Module_
