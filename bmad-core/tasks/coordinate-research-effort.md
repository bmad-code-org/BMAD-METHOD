<!-- Powered by BMAD™ Core -->

# Coordinate Research Effort Task

## Purpose

This task is the primary workflow for the Research Coordinator to manage multi-perspective research efforts. It handles the complete research coordination lifecycle from initial request processing to final synthesis delivery.

## Key Responsibilities

- Process research requests from other agents
- Check existing research log to prevent duplication
- Design multi-perspective research strategy
- Deploy and coordinate researcher agents
- Synthesize findings into unified analysis
- Update research index and documentation

## Task Process

### 1. Research Request Intake

#### Process Incoming Request

**If called via unified request-research task:**

- Extract research request YAML structure
- Validate all required fields are present
- Understand requesting agent context and needs
- Assess urgency and timeline constraints

**If called directly by user/agent:**

- Elicit research requirements using structured approach
- Guide user through research request specification
- Ensure clarity on objectives and expected outcomes
- Document request in standard format

#### Critical Elements to Capture

- **Requesting Agent**: Which agent needs the research
- **Research Objective**: Specific question or problem
- **Context**: Project phase, background, constraints
- **Scope**: Boundaries and limitations
- **Domain Requirements**: Specializations needed
- **Output Format**: How results should be delivered
- **Timeline**: Urgency and delivery expectations

### 2. Research Log Analysis

#### Check for Existing Research

1. **Search Research Index**: Look for related prior research
   - Search by topic keywords
   - Check domain tags and categories
   - Review recent research for overlap
   - Identify potentially relevant prior work

2. **Assess Overlap and Gaps**
   - **Full Coverage**: If comprehensive research exists, refer to prior work
   - **Partial Coverage**: Identify specific gaps to focus new research
   - **No Coverage**: Proceed with full research effort
   - **Outdated Coverage**: Assess if refresh/update needed

3. **Integration Strategy**
   - How to build on prior research
   - What new perspectives are needed
   - How to avoid duplicating effort
   - Whether to update existing research or create new

### 3. Research Strategy Design

#### Multi-Perspective Planning

1. **Determine Research Team Size**
   - Default: 3 researchers for comprehensive coverage
   - Configurable based on complexity and timeline
   - Consider: 1 for simple queries, 2-3 for complex analysis

2. **Assign Domain Specializations**
   - **Primary Perspective**: Most critical domain expertise needed
   - **Secondary Perspectives**: Complementary viewpoints
   - **Avoid Overlap**: Ensure each researcher has distinct angle
   - **Maximize Coverage**: Balance breadth vs depth

#### Common Research Team Configurations

- **Technology Assessment**: Technical + Scalability + Security
- **Market Analysis**: Market + Competitive + User
- **Product Decision**: Technical + Business + User
- **Strategic Planning**: Market + Business + Innovation
- **Risk Assessment**: Technical + Regulatory + Business

### 4. Researcher Deployment

#### Configure Research Teams

For each researcher agent:

1. **Specialization Configuration**
   - Assign specific domain expertise
   - Configure perspective lens and focus areas
   - Set source priorities and analysis frameworks
   - Define role within overall research strategy

2. **Research Briefing**
   - Provide context from original request
   - Clarify specific angle to investigate
   - Set expectations for depth and format
   - Define coordination checkpoints

3. **Coordination Guidelines**
   - How to avoid duplicating other researchers' work
   - When to communicate with coordinator
   - How to handle conflicting information
   - Quality standards and source requirements

#### Research Assignment Template

```yaml
researcher_briefing:
  research_context: '[Context from original request]'
  assigned_domain: '[Primary specialization]'
  perspective_focus: '[Specific angle to investigate]'
  research_questions: '[Domain-specific questions to address]'
  source_priorities: '[Types of sources to prioritize]'
  analysis_framework: '[How to analyze information]'
  coordination_role: '[How this fits with other researchers]'
  deliverable_format: '[Expected output structure]'
  timeline: '[Deadlines and checkpoints]'
```

### 5. Research Coordination

#### Monitor Research Progress

- **Progress Checkpoints**: Regular status updates from researchers
- **Quality Review**: Interim assessment of findings quality
- **Coordination Adjustments**: Modify approach based on early findings
- **Conflict Resolution**: Address disagreements between researchers

#### Handle Research Challenges

- **Information Gaps**: Redirect research focus if sources unavailable
- **Conflicting Findings**: Document disagreements for synthesis
- **Scope Creep**: Keep research focused on original objectives
- **Quality Issues**: Address source credibility or analysis problems

### 6. Findings Synthesis

#### Synthesis Process

1. **Gather Individual Reports**
   - Collect findings from each researcher
   - Review quality and completeness
   - Identify areas needing clarification
   - Validate source credibility across reports

2. **Identify Patterns and Themes**
   - **Convergent Findings**: Where researchers agree
   - **Divergent Perspectives**: Different viewpoints on same issue
   - **Conflicting Evidence**: Contradictory information to reconcile
   - **Unique Insights**: Perspective-specific discoveries

3. **Reconcile Conflicts and Gaps**
   - Analyze reasons for conflicting findings
   - Assess source credibility and evidence quality
   - Document uncertainties and limitations
   - Identify areas needing additional research

#### Synthesis Output Structure

Using research-synthesis-tmpl.yaml:

1. **Executive Summary**: Key insights and recommendations
2. **Methodology**: Research approach and team configuration
3. **Key Findings**: Synthesized insights across perspectives
4. **Detailed Analysis**: Findings from each domain perspective
5. **Recommendations**: Actionable next steps
6. **Sources and Evidence**: Documentation and verification
7. **Limitations**: Constraints and uncertainties

### 7. Delivery and Documentation

#### Deliver to Requesting Agent

1. **Primary Deliverable**: Synthesized research report
2. **Executive Summary**: Key findings and recommendations
3. **Supporting Detail**: Access to full analysis as needed
4. **Next Steps**: Recommended actions and follow-up research

#### Update Research Index

Using research-log-entry-tmpl.yaml:

1. **Add Index Entry**: New research to chronological list
2. **Update Categories**: Add to appropriate domain sections
3. **Tag Classification**: Add searchable tags for future reference
4. **Cross-References**: Link to related prior research

#### Store Research Artifacts

- **Primary Report**: Store in docs/research/ with date-topic filename
- **Research Index**: Update research-index.md with new entry
- **Source Documentation**: Preserve links and references
- **Research Metadata**: Track team configuration and approach

### 8. Quality Assurance

#### Research Quality Checklist

- **Objective Completion**: All research questions addressed
- **Source Credibility**: Reliable, recent, and relevant sources
- **Perspective Diversity**: Genuinely different analytical angles
- **Evidence Quality**: Strong support for key findings
- **Synthesis Coherence**: Logical integration of perspectives
- **Actionable Insights**: Clear implications for decision-making
- **Uncertainty Documentation**: Limitations and gaps clearly stated

#### Validation Steps

1. **Internal Review**: Coordinator validates synthesis quality
2. **Source Verification**: Spot-check key sources and evidence
3. **Logic Check**: Ensure recommendations follow from findings
4. **Completeness Assessment**: Confirm all objectives addressed

### 9. Error Handling and Edge Cases

#### Common Challenges

- **Researcher Unavailability**: Adjust team size or perspective assignments
- **Source Access Issues**: Graceful degradation to available information
- **Conflicting Deadlines**: Prioritize critical research elements
- **Quality Problems**: Reassign research or adjust scope

#### Escalation Triggers

- **Irreconcilable Conflicts**: Major disagreements between researchers
- **Missing Critical Information**: Gaps that prevent objective completion
- **Quality Failures**: Repeated issues with source credibility or analysis
- **Timeline Pressures**: Cannot deliver quality research in time available

### 10. Continuous Improvement

#### Research Process Optimization

- **Track Research Effectiveness**: Monitor how research informs decisions
- **Identify Common Patterns**: Frequently requested research types
- **Optimize Team Configurations**: Most effective perspective combinations
- **Improve Synthesis Quality**: Better integration techniques

#### Knowledge Base Enhancement

- **Update Domain Profiles**: Refine specialization descriptions
- **Expand Source Directories**: Add new credible source types
- **Improve Methodologies**: Better research and analysis frameworks
- **Enhance Templates**: More effective output structures

## Integration Notes

- **Task Dependencies**: This task coordinates with researcher agent tasks
- **Template Usage**: Leverages research-synthesis-tmpl.yaml for output
- **Index Maintenance**: Updates research-index.md via research-log-entry-tmpl.yaml
- **Quality Control**: Uses research-quality-checklist.md for validation
- **Agent Coordination**: Manages researcher.md agents with specialized configurations
