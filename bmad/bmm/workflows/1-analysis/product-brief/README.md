# Product Brief Workflow

## Overview

Interactive product brief creation workflow that guides users through defining their product vision with multiple input sources and conversational collaboration. Supports both structured interactive mode and rapid "YOLO" mode for quick draft generation.

## Key Features

- **Dual Mode Operation** - Interactive step-by-step or rapid draft generation
- **Multi-Input Support** - Integrates market research, competitive analysis, and brainstorming results
- **Conversational Design** - Guides users through strategic thinking with probing questions
- **Executive Summary Generation** - Creates compelling summaries for stakeholder communication
- **Comprehensive Coverage** - Addresses all critical product planning dimensions
- **Stakeholder Ready** - Generates professional briefs suitable for PM handoff

## Usage

### Basic Invocation

```bash
workflow product-brief
```

### With Input Documents

```bash
# With market research
workflow product-brief --input market-research.md

# With multiple inputs
workflow product-brief --input market-research.md --input competitive-analysis.md
```

### Configuration

- **brief_format**: "comprehensive" (full detail) or "executive" (3-page limit)
- **autonomous**: false (requires user collaboration)
- **output_folder**: Location for generated brief

## Workflow Structure

### Files Included

```
product-brief/
├── workflow.yaml           # Configuration and metadata
├── instructions.md         # Interactive workflow steps
├── template.md            # Product brief document structure
├── checklist.md           # Validation criteria
└── README.md              # This file
```

## Workflow Process

### Phase 1: Initialization and Context (Steps 0-2)

- **Project Setup**: Captures project name and basic context
- **Input Gathering**: Collects and analyzes available documents
- **Mode Selection**: Chooses interactive or YOLO collaboration approach
- **Context Extraction**: Identifies core problems and opportunities

### Phase 2: Interactive Development (Steps 3-12) - Interactive Mode

- **Problem Definition**: Deep dive into user pain points and market gaps
- **Solution Articulation**: Develops clear value proposition and approach
- **User Segmentation**: Defines primary and secondary target audiences
- **Success Metrics**: Establishes measurable goals and KPIs
- **MVP Scoping**: Ruthlessly defines minimum viable features
- **Financial Planning**: Assesses ROI and strategic alignment
- **Technical Context**: Captures platform and technology considerations
- **Risk Assessment**: Identifies constraints, assumptions, and unknowns

### Phase 3: Rapid Generation (Steps 3-4) - YOLO Mode

- **Complete Draft**: Generates full brief based on initial context
- **Iterative Refinement**: User-guided section improvements
- **Quality Validation**: Ensures completeness and consistency

### Phase 4: Finalization (Steps 13-15)

- **Executive Summary**: Creates compelling overview for stakeholders
- **Supporting Materials**: Compiles research summaries and references
- **Final Review**: Quality check and handoff preparation

## Output

### Generated Files

- **Primary output**: product-brief-{project_name}-{date}.md
- **Supporting files**: Research summaries and stakeholder input documentation

### Output Structure

1. **Executive Summary** - High-level product concept and value proposition
2. **Problem Statement** - Detailed problem analysis with evidence
3. **Proposed Solution** - Core approach and key differentiators
4. **Target Users** - Primary and secondary user segments with personas
5. **Goals and Success Metrics** - Business objectives and measurable KPIs
6. **MVP Scope** - Must-have features and out-of-scope items
7. **Post-MVP Vision** - Phase 2 features and long-term roadmap
8. **Financial Impact** - Investment requirements and ROI projections
9. **Strategic Alignment** - Connection to company OKRs and initiatives
10. **Technical Considerations** - Platform requirements and preferences
11. **Constraints and Assumptions** - Resource limits and key assumptions
12. **Risks and Open Questions** - Risk assessment and research needs
13. **Supporting Materials** - Research summaries and references

## Requirements

No special requirements - designed to work with or without existing documentation.

## Best Practices

### Before Starting

1. **Gather Available Research**: Collect any market research, competitive analysis, or user feedback
2. **Define Stakeholder Audience**: Know who will use this brief for decision-making
3. **Set Time Boundaries**: Interactive mode requires 60-90 minutes for quality results

### During Execution

1. **Be Specific**: Avoid generic statements - provide concrete examples and data
2. **Think Strategically**: Focus on "why" and "what" rather than "how"
3. **Challenge Assumptions**: Use the conversation to test and refine your thinking
4. **Scope Ruthlessly**: Resist feature creep in MVP definition

### After Completion

1. **Validate with Checklist**: Use included criteria to ensure completeness
2. **Stakeholder Review**: Share executive summary first, then full brief
3. **Iterate Based on Feedback**: Product briefs should evolve with new insights

## Troubleshooting

### Common Issues

**Issue**: Brief lacks specificity or contains vague statements

- **Solution**: Restart problem definition with concrete examples and measurable impacts
- **Check**: Ensure each section answers "so what?" and provides actionable insights

**Issue**: MVP scope is too large or undefined

- **Solution**: Use the "what's the minimum to validate core hypothesis?" filter
- **Check**: Verify that each MVP feature is truly essential for initial value delivery

**Issue**: Missing strategic context or business justification

- **Solution**: Return to financial impact and strategic alignment sections
- **Check**: Ensure connection to company goals and clear ROI potential

## Customization

To customize this workflow:

1. **Modify Questions**: Update instructions.md to add industry-specific or company-specific prompts
2. **Adjust Template**: Customize template.md sections for organizational brief standards
3. **Add Validation**: Extend checklist.md with company-specific quality criteria
4. **Configure Modes**: Adjust brief_format settings for different output styles

## Version History

- **v6.0.0** - Interactive conversational design with dual modes
  - Interactive and YOLO mode support
  - Multi-input document integration
  - Executive summary generation
  - Strategic alignment focus

## Support

For issues or questions:

- Review the workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Validate output using `checklist.md`
- Consider running market research workflow first if lacking business context
- Consult BMAD documentation for product planning methodology

---

_Part of the BMad Method v6 - BMM (Method) Module_
