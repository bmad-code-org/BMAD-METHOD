<!-- Powered by BMAD™ Core -->

# Request Research Task

## Purpose

This task provides a unified interface for any agent to request specialized research from the Research Coordinator, which can spawn up to 3 domain-specific researcher agents to attack problems from different angles.

## Key Features

- **Multi-Perspective Analysis**: Coordinator spawns specialized researchers with different domain expertise
- **Web Search Capabilities**: Researchers have access to current information and data
- **Adaptive Specialization**: Research agents adapt to specific domains as needed by the requesting context
- **Research Logging**: All synthesis results stored in indexed research log to avoid duplicate work
- **Configurable Team Size**: Default 3 researchers, configurable based on complexity

## Usage Scenarios

### From Any Agent

Any agent can call this task to get specialized research assistance:

```yaml
*task request-research
```

### Common Use Cases

- **Analyst**: Competitive analysis, market research, industry trends
- **Architect**: Technology assessment, scalability analysis, security research
- **PM**: Market validation, user research, feasibility studies
- **Dev**: Technical implementation research, library comparisons, best practices
- **QA**: Testing methodologies, quality standards, compliance requirements

## Task Process

### 1. Research Request Specification

The task will elicit a structured research request with these components:

#### Research Context

- **Requesting Agent**: Which agent is making the request
- **Project Context**: Current project phase and relevant background
- **Previous Research**: Check research log for related prior work
- **Urgency Level**: Timeline constraints and priority

#### Research Objective

- **Primary Goal**: What specific question or problem needs researching
- **Success Criteria**: How to measure if research achieved its objective
- **Scope Boundaries**: What to include/exclude from research
- **Decision Impact**: How results will be used

#### Domain Specialization Requirements

- **Primary Domain**: Main area of expertise needed (technical, market, user, etc.)
- **Secondary Domains**: Additional perspectives required
- **Specific Expertise**: Particular skills or knowledge areas
- **Research Depth**: High-level overview vs deep technical analysis

#### Output Requirements

- **Format**: Executive summary, detailed report, comparison matrix, etc.
- **Audience**: Who will consume the research results
- **Integration**: How results feed into next steps
- **Documentation**: Level of source citation needed

### 2. Research Coordination

The Research Coordinator will:

1. **Check Research Log**: Review `docs/research/research-index.md` for prior related work
2. **Design Research Strategy**: Plan multi-perspective approach
3. **Spawn Researcher Agents**: Deploy 1-3 specialized researchers with distinct angles
4. **Monitor Progress**: Coordinate between researchers to avoid overlap
5. **Synthesize Results**: Combine findings into coherent analysis

### 3. Research Execution

Each Researcher Agent will:

1. **Adapt Domain Expertise**: Configure specialization based on assigned perspective
2. **Conduct Web Research**: Use search capabilities to gather current information
3. **Analyze and Synthesize**: Process information through domain-specific lens
4. **Generate Findings**: Create structured report for their perspective
5. **Cite Sources**: Document credible sources and evidence

### 4. Result Delivery

#### To Requesting Agent

- **Executive Summary**: Key findings and recommendations
- **Detailed Analysis**: Comprehensive research results
- **Source Documentation**: Links and citations for verification
- **Next Steps**: Recommended actions or follow-up research

#### To Research Log

- **Research Entry**: Concise summary stored in `docs/research/YYYY-MM-DD-research-topic.md`
- **Index Update**: Add entry to `docs/research/research-index.md`
- **Tag Classification**: Add searchable tags for future reference

### 5. Quality Assurance

- **Source Credibility**: Verify information from reputable sources
- **Cross-Perspective Validation**: Ensure consistency across researcher findings
- **Bias Detection**: Identify and flag potential biases or limitations
- **Completeness Check**: Confirm all research objectives addressed

## Research Request Template

When executing this task, use this structure for research requests:

```yaml
research_request:
  metadata:
    requesting_agent: '[agent-id]'
    request_date: '[YYYY-MM-DD]'
    priority: '[high|medium|low]'
    timeline: '[timeframe needed]'

  context:
    project_phase: '[planning|development|validation|etc]'
    background: '[relevant project context]'
    related_docs: '[PRD, architecture, stories, etc]'
    previous_research: '[check research log references]'

  objective:
    primary_goal: '[specific research question]'
    success_criteria: '[how to measure success]'
    scope: '[boundaries and limitations]'
    decision_impact: '[how results will be used]'

  specialization:
    primary_domain: '[technical|market|user|competitive|regulatory|etc]'
    secondary_domains: '[additional perspectives needed]'
    specific_expertise: '[particular skills required]'
    research_depth: '[overview|detailed|comprehensive]'

  team_config:
    researcher_count: '[1-3, default 3]'
    perspective_1: '[domain and focus area]'
    perspective_2: '[domain and focus area]'
    perspective_3: '[domain and focus area]'

  output:
    format: '[executive_summary|detailed_report|comparison_matrix|etc]'
    audience: '[who will use results]'
    integration: '[how results feed into workflow]'
    citation_level: '[minimal|standard|comprehensive]'
```

## Integration with Existing Agents

### Adding Research Capability to Agents

To add research capabilities to existing agents, add this dependency:

```yaml
dependencies:
  tasks:
    - request-research.md
```

Then add a research command:

```yaml
commands:
  - research {topic}: Request specialized research analysis using task request-research
```

### Research Command Examples

- `*research "competitor API pricing models"` (from PM)
- `*research "microservices vs monolith for our scale"` (from Architect)
- `*research "React vs Vue for dashboard components"` (from Dev)
- `*research "automated testing strategies for ML models"` (from QA)

## Research Log Structure

### Research Index (`docs/research/research-index.md`)

```markdown
# Research Index

## Recent Research

- [2024-01-15: AI Model Comparison](2024-01-15-ai-model-comparison.md) - Technical analysis of LLM options
- [2024-01-12: Payment Gateway Analysis](2024-01-12-payment-gateway-analysis.md) - Market comparison of payment solutions

## Research by Category

### Technical Research

- AI/ML Models
- Architecture Decisions
- Technology Stacks

### Market Research

- Competitive Analysis
- User Behavior
- Industry Trends
```

### Individual Research Files (`docs/research/YYYY-MM-DD-topic.md`)

```markdown
# Research: [Topic]

**Date**: YYYY-MM-DD
**Requested by**: [agent-name]
**Research Team**: [perspectives used]

## Executive Summary

[Key findings and recommendations]

## Research Objective

[What was being researched and why]

## Key Findings

[Main insights from all perspectives]

## Recommendations

[Actionable next steps]

## Research Team Perspectives

### Perspective 1: [Domain]

[Key insights from this angle]

### Perspective 2: [Domain]

[Key insights from this angle]

### Perspective 3: [Domain]

[Key insights from this angle]

## Sources and References

[Credible sources cited by research team]

## Tags

[Searchable tags for future reference]
```

## Important Notes

- **Research Log Maintenance**: Research Coordinator automatically maintains the research index
- **Duplicate Prevention**: Always check existing research before launching new requests
- **Source Quality**: Prioritize credible, recent sources with proper attribution
- **Perspective Diversity**: Ensure research angles provide genuinely different viewpoints
- **Synthesis Quality**: Coordinator must reconcile conflicting findings and highlight uncertainties
- **Integration Focus**: All research should provide actionable insights for decision-making

## Error Handling

- **Web Search Failures**: Graceful degradation to available information
- **Conflicting Research**: Document disagreements and uncertainty levels
- **Incomplete Coverage**: Flag areas needing additional research
- **Source Quality Issues**: Clearly mark uncertain or low-confidence findings
