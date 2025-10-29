# Module Brief Workflow

## Overview

The Module Brief workflow creates comprehensive blueprints for building new BMAD modules using strategic analysis and creative vision. It serves as the essential planning phase that transforms initial ideas into detailed, actionable specifications ready for implementation with the create-module workflow.

## Key Features

- **Strategic Module Planning** - Comprehensive analysis from concept to implementation roadmap
- **Multi-Mode Operation** - Interactive, Express, and YOLO modes for different planning needs
- **Creative Vision Development** - Guided process for innovative module concepts and unique value propositions
- **Architecture Design** - Detailed agent and workflow ecosystem planning with interaction models
- **User Journey Mapping** - Scenario-based validation ensuring practical usability
- **Technical Planning** - Infrastructure requirements, dependencies, and complexity assessment
- **Risk Assessment** - Proactive identification of challenges with mitigation strategies
- **Implementation Roadmap** - Phased development plan with clear deliverables and timelines

## Usage

### Basic Invocation

```bash
workflow module-brief
```

### With Brainstorming Input

```bash
# If you have brainstorming results from previous sessions
workflow module-brief --input brainstorming-session-2024-09-26.md
```

### Express Mode

```bash
# For quick essential planning only
workflow module-brief --mode express
```

### Configuration

The workflow uses standard BMB configuration:

- **output_folder**: Where the module brief will be saved
- **user_name**: Brief author information
- **communication_language**: Language for brief generation
- **date**: Automatic timestamp for versioning

## Workflow Structure

### Files Included

```
module-brief/
├── workflow.yaml           # Configuration and metadata
├── instructions.md         # Step-by-step execution guide
├── template.md            # Module brief document structure
├── checklist.md           # Validation criteria
└── README.md              # This file
```

## Workflow Process

### Phase 1: Foundation and Context (Steps 1-3)

**Mode Selection and Input Gathering**

- Choose operational mode (Interactive, Express, YOLO)
- Check for and optionally load existing brainstorming results
- Gather background context and inspiration sources

**Module Vision Development**

- Define core problem the module solves
- Identify target user audience and use cases
- Establish unique value proposition and differentiators
- Explore creative themes and personality concepts

**Module Identity Establishment**

- Generate module code (kebab-case) with multiple options
- Create compelling, memorable module name
- Select appropriate category (Domain-Specific, Creative, Technical, Business, Personal)
- Define optional personality theme for consistent agent character

### Phase 2: Architecture Planning (Steps 4-5)

**Agent Architecture Design**

- Plan agent team composition and roles
- Define agent archetypes (Orchestrator, Specialist, Helper, Creator, Analyzer)
- Specify personality traits and communication styles
- Map key capabilities and signature commands

**Workflow Ecosystem Design**

- Categorize workflows by purpose and complexity:
  - **Core Workflows**: Essential value-delivery functions (2-3)
  - **Feature Workflows**: Specialized capabilities (3-5)
  - **Utility Workflows**: Supporting operations (1-3)
- Define input-process-output flows for each workflow
- Assess complexity levels and implementation priorities

### Phase 3: Validation and User Experience (Steps 6-7)

**User Journey Mapping**

- Create detailed user scenarios and stories
- Map step-by-step usage flows through the module
- Validate end-to-end functionality and value delivery
- Identify potential friction points and optimization opportunities

**Technical Planning and Requirements**

- Assess data requirements and storage needs
- Map integration points with other modules and external systems
- Evaluate technical complexity and resource requirements
- Document dependencies and infrastructure needs

### Phase 4: Success Planning (Steps 8-9)

**Success Metrics Definition**

- Establish module success criteria and performance indicators
- Define quality standards and reliability requirements
- Create user experience goals and feedback mechanisms
- Set measurable outcomes for module effectiveness

**Development Roadmap Creation**

- Design phased approach with MVP, Enhancement, and Polish phases
- Define deliverables and timelines for each phase
- Prioritize features and capabilities by value and complexity
- Create clear milestones and success checkpoints

### Phase 5: Enhancement and Risk Management (Steps 10-12)

**Creative Features and Special Touches** (Optional)

- Design easter eggs and delightful user interactions
- Plan module lore and thematic consistency
- Add personality quirks and creative responses
- Develop backstories and universe building

**Risk Assessment and Mitigation**

- Identify technical, usability, and scope risks
- Develop mitigation strategies for each risk category
- Plan contingency approaches for potential challenges
- Document decision points and alternative paths

**Final Review and Export Preparation**

- Comprehensive review of all brief sections
- Validation against quality and completeness criteria
- Preparation for seamless handoff to create-module workflow
- Export readiness confirmation with actionable specifications

## Output

### Generated Files

- **Module Brief Document**: Comprehensive planning document at `{output_folder}/module-brief-{module_code}-{date}.md`
- **Strategic Specifications**: Ready-to-implement blueprint for create-module workflow

### Output Structure

The module brief contains detailed specifications across multiple sections:

1. **Executive Summary** - Vision, category, complexity, target users
2. **Module Identity** - Core concept, value proposition, personality theme
3. **Agent Architecture** - Agent roster, roles, interaction models
4. **Workflow Ecosystem** - Core, feature, and utility workflow specifications
5. **User Scenarios** - Primary use cases, secondary scenarios, user journey
6. **Technical Planning** - Data requirements, integrations, dependencies
7. **Success Metrics** - Success criteria, quality standards, performance targets
8. **Development Roadmap** - Phased implementation plan with deliverables
9. **Creative Features** - Special touches, easter eggs, module lore
10. **Risk Assessment** - Technical, usability, scope risks with mitigation
11. **Implementation Notes** - Priority order, design decisions, open questions
12. **Resources and References** - Inspiration sources, similar modules, technical references

## Requirements

- **Creative Vision** - Initial module concept or problem domain
- **Strategic Thinking** - Ability to plan architecture and user experience
- **Brainstorming Results** (optional) - Previous ideation sessions enhance planning quality

## Best Practices

### Before Starting

1. **Gather Inspiration** - Research similar tools, modules, and solutions in your domain
2. **Run Brainstorming Session** - Use ideation techniques to generate initial concepts
3. **Define Success Criteria** - Know what "successful module" means for your context

### During Execution

1. **Think User-First** - Always consider the end user experience and value delivery
2. **Be Specific** - Provide concrete examples and detailed specifications rather than abstractions
3. **Validate Early** - Use user scenarios to test if the module concept actually works
4. **Plan Iteratively** - Start with MVP and build complexity through phases

### After Completion

1. **Use as Blueprint** - Feed the brief directly into create-module workflow for implementation
2. **Review with Stakeholders** - Validate assumptions and gather feedback before building
3. **Update as Needed** - Treat as living document that evolves with implementation learnings
4. **Reference During Development** - Use as north star for design decisions and scope management

## Troubleshooting

### Common Issues

**Issue**: Stuck on module concept or vision

- **Solution**: Use creative prompts provided in the workflow
- **Check**: Review existing modules for inspiration and patterns

**Issue**: Agent or workflow architecture too complex

- **Solution**: Focus on MVP first, plan enhancement phases for additional complexity
- **Check**: Validate each component against user scenarios

**Issue**: Technical requirements unclear

- **Solution**: Research similar modules and their implementation approaches
- **Check**: Consult with technical stakeholders early in planning

**Issue**: Scope creep during planning

- **Solution**: Use phased roadmap to defer non-essential features
- **Check**: Regularly validate against core user scenarios and success criteria

## Customization

To customize this workflow:

1. **Modify Template Structure** - Update template.md to add new sections or reorganize content
2. **Extend Creative Prompts** - Add domain-specific ideation techniques in instructions.md
3. **Add Planning Tools** - Integrate additional analysis frameworks or planning methodologies
4. **Customize Validation** - Enhance checklist.md with specific quality criteria for your context

## Version History

- **v1.0.0** - Initial release
  - Comprehensive strategic module planning
  - Multi-mode operation (Interactive, Express, YOLO)
  - Creative vision and architecture design tools
  - User journey mapping and validation
  - Risk assessment and mitigation planning

## Support

For issues or questions:

- Review the workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Study existing module examples in `/bmad/` for patterns and inspiration
- Validate output using `checklist.md`
- Consult module structure guide at `create-module/module-structure.md`

---

_Part of the BMad Method v6 - BMB (Builder) Module_
