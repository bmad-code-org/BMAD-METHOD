# Technical/Architecture Research Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow conducts technical research for architecture and technology decisions</critical>

<workflow>

<step n="1" goal="Technical Research Discovery">
<action>Understand the technical research requirements</action>

**Welcome to Technical/Architecture Research!**

<ask>What technical decision or research do you need?

Common scenarios:

- Evaluate technology stack for a new project
- Compare frameworks or libraries (React vs Vue, Postgres vs MongoDB)
- Research architecture patterns (microservices, event-driven, CQRS)
- Investigate specific technologies or tools
- Best practices for specific use cases
- Performance and scalability considerations
- Security and compliance research</ask>

<template-output>technical_question</template-output>

<ask>What's the context for this decision?

- New greenfield project
- Adding to existing system (brownfield)
- Refactoring/modernizing legacy system
- Proof of concept / prototype
- Production-ready implementation
- Academic/learning purpose</ask>

<template-output>project_context</template-output>

</step>

<step n="2" goal="Define Technical Requirements and Constraints">
<action>Gather requirements and constraints that will guide the research</action>

**Let's define your technical requirements:**

<ask>**Functional Requirements** - What must the technology do?

Examples:

- Handle 1M requests per day
- Support real-time data processing
- Provide full-text search capabilities
- Enable offline-first mobile app
- Support multi-tenancy</ask>

<template-output>functional_requirements</template-output>

<ask>**Non-Functional Requirements** - Performance, scalability, security needs?

Consider:

- Performance targets (latency, throughput)
- Scalability requirements (users, data volume)
- Reliability and availability needs
- Security and compliance requirements
- Maintainability and developer experience</ask>

<template-output>non_functional_requirements</template-output>

<ask>**Constraints** - What limitations or requirements exist?

- Programming language preferences or requirements
- Cloud platform (AWS, Azure, GCP, on-prem)
- Budget constraints
- Team expertise and skills
- Timeline and urgency
- Existing technology stack (if brownfield)
- Open source vs commercial requirements
- Licensing considerations</ask>

<template-output>technical_constraints</template-output>

</step>

<step n="3" goal="Identify Alternatives and Options">
<action>Research and identify technology options to evaluate</action>

<ask>Do you have specific technologies in mind to compare, or should I discover options?

If you have specific options, list them. Otherwise, I'll research current leading solutions based on your requirements.</ask>

<template-output if="user provides options">user_provided_options</template-output>

<check if="discovering options">
  <action>Conduct web research to identify current leading solutions</action>
  <action>Search for:

- "[technical_category] best tools 2025"
- "[technical_category] comparison [use_case]"
- "[technical_category] production experiences reddit"
- "State of [technical_category] 2025"
  </action>

  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<action>Present discovered options (typically 3-5 main candidates)</action>
<template-output>technology_options</template-output>

</check>

</step>

<step n="4" goal="Deep Dive Research on Each Option">
<action>Research each technology option in depth</action>

<critical>For each technology option, research thoroughly</critical>

<step n="4a" title="Technology Profile" repeat="for-each-option">

Research and document:

**Overview:**

- What is it and what problem does it solve?
- Maturity level (experimental, stable, mature, legacy)
- Community size and activity
- Maintenance status and release cadence

**Technical Characteristics:**

- Architecture and design philosophy
- Core features and capabilities
- Performance characteristics
- Scalability approach
- Integration capabilities

**Developer Experience:**

- Learning curve
- Documentation quality
- Tooling ecosystem
- Testing support
- Debugging capabilities

**Operations:**

- Deployment complexity
- Monitoring and observability
- Operational overhead
- Cloud provider support
- Container/K8s compatibility

**Ecosystem:**

- Available libraries and plugins
- Third-party integrations
- Commercial support options
- Training and educational resources

**Community and Adoption:**

- GitHub stars/contributors (if applicable)
- Production usage examples
- Case studies from similar use cases
- Community support channels
- Job market demand

**Costs:**

- Licensing model
- Hosting/infrastructure costs
- Support costs
- Training costs
- Total cost of ownership estimate

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
<template-output>tech*profile*{{option_number}}</template-output>

</step>

</step>

<step n="5" goal="Comparative Analysis">
<action>Create structured comparison across all options</action>

**Create comparison matrices:**

<action>Generate comparison table with key dimensions:</action>

**Comparison Dimensions:**

1. **Meets Requirements** - How well does each meet functional requirements?
2. **Performance** - Speed, latency, throughput benchmarks
3. **Scalability** - Horizontal/vertical scaling capabilities
4. **Complexity** - Learning curve and operational complexity
5. **Ecosystem** - Maturity, community, libraries, tools
6. **Cost** - Total cost of ownership
7. **Risk** - Maturity, vendor lock-in, abandonment risk
8. **Developer Experience** - Productivity, debugging, testing
9. **Operations** - Deployment, monitoring, maintenance
10. **Future-Proofing** - Roadmap, innovation, sustainability

<action>Rate each option on relevant dimensions (High/Medium/Low or 1-5 scale)</action>

<template-output>comparative_analysis</template-output>

</step>

<step n="6" goal="Trade-offs and Decision Factors">
<action>Analyze trade-offs between options</action>

**Identify key trade-offs:**

For each pair of leading options, identify trade-offs:

- What do you gain by choosing Option A over Option B?
- What do you sacrifice?
- Under what conditions would you choose one vs the other?

**Decision factors by priority:**

<ask>What are your top 3 decision factors?

Examples:

- Time to market
- Performance
- Developer productivity
- Operational simplicity
- Cost efficiency
- Future flexibility
- Team expertise match
- Community and support</ask>

<template-output>decision_priorities</template-output>

<action>Weight the comparison analysis by decision priorities</action>

<template-output>weighted_analysis</template-output>

</step>

<step n="7" goal="Use Case Fit Analysis">
<action>Evaluate fit for specific use case</action>

**Match technologies to your specific use case:**

Based on:

- Your functional and non-functional requirements
- Your constraints (team, budget, timeline)
- Your context (greenfield vs brownfield)
- Your decision priorities

Analyze which option(s) best fit your specific scenario.

<ask>Are there any specific concerns or "must-haves" that would immediately eliminate any options?</ask>

<template-output>use_case_fit</template-output>

</step>

<step n="8" goal="Real-World Evidence">
<action>Gather production experience evidence</action>

**Search for real-world experiences:**

For top 2-3 candidates:

- Production war stories and lessons learned
- Known issues and gotchas
- Migration experiences (if replacing existing tech)
- Performance benchmarks from real deployments
- Team scaling experiences
- Reddit/HackerNews discussions
- Conference talks and blog posts from practitioners

<template-output>real_world_evidence</template-output>

</step>

<step n="9" goal="Architecture Pattern Research" optional="true">
<action>If researching architecture patterns, provide pattern analysis</action>

<ask>Are you researching architecture patterns (microservices, event-driven, etc.)?</ask>

<check if="yes">

Research and document:

**Pattern Overview:**

- Core principles and concepts
- When to use vs when not to use
- Prerequisites and foundations

**Implementation Considerations:**

- Technology choices for the pattern
- Reference architectures
- Common pitfalls and anti-patterns
- Migration path from current state

**Trade-offs:**

- Benefits and drawbacks
- Complexity vs benefits analysis
- Team skill requirements
- Operational overhead

<template-output>architecture_pattern_analysis</template-output>
</check>

</step>

<step n="10" goal="Recommendations and Decision Framework">
<action>Synthesize research into clear recommendations</action>

**Generate recommendations:**

**Top Recommendation:**

- Primary technology choice with rationale
- Why it best fits your requirements and constraints
- Key benefits for your use case
- Risks and mitigation strategies

**Alternative Options:**

- Second and third choices
- When you might choose them instead
- Scenarios where they would be better

**Implementation Roadmap:**

- Proof of concept approach
- Key decisions to make during implementation
- Migration path (if applicable)
- Success criteria and validation approach

**Risk Mitigation:**

- Identified risks and mitigation plans
- Contingency options if primary choice doesn't work
- Exit strategy considerations

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>recommendations</template-output>

</step>

<step n="11" goal="Decision Documentation">
<action>Create architecture decision record (ADR) template</action>

**Generate Architecture Decision Record:**

Create ADR format documentation:

```markdown
# ADR-XXX: [Decision Title]

## Status

[Proposed | Accepted | Superseded]

## Context

[Technical context and problem statement]

## Decision Drivers

[Key factors influencing the decision]

## Considered Options

[Technologies/approaches evaluated]

## Decision

[Chosen option and rationale]

## Consequences

**Positive:**

- [Benefits of this choice]

**Negative:**

- [Drawbacks and risks]

**Neutral:**

- [Other impacts]

## Implementation Notes

[Key considerations for implementation]

## References

[Links to research, benchmarks, case studies]
```

<template-output>architecture_decision_record</template-output>

</step>

<step n="12" goal="Finalize Technical Research Report">
<action>Compile complete technical research report</action>

**Your Technical Research Report includes:**

1. **Executive Summary** - Key findings and recommendation
2. **Requirements and Constraints** - What guided the research
3. **Technology Options** - All candidates evaluated
4. **Detailed Profiles** - Deep dive on each option
5. **Comparative Analysis** - Side-by-side comparison
6. **Trade-off Analysis** - Key decision factors
7. **Real-World Evidence** - Production experiences
8. **Recommendations** - Detailed recommendation with rationale
9. **Architecture Decision Record** - Formal decision documentation
10. **Next Steps** - Implementation roadmap

<action>Save complete report to {default_output_file}</action>

<ask>Would you like to:

1. Deep dive into specific technology
2. Research implementation patterns for chosen technology
3. Generate proof-of-concept plan
4. Create deep research prompt for ongoing investigation
5. Exit workflow

Select option (1-5):</ask>

<check if="option 4">
  <action>LOAD: {installed_path}/instructions-deep-prompt.md</action>
  <action>Pre-populate with technical research context</action>
</check>

</step>

<step n="FINAL" goal="Update status file on completion">
<action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
<action>Find the most recent file (by date in filename)</action>

<check if="status file exists">
  <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
    <param>mode: update</param>
    <param>action: complete_workflow</param>
    <param>workflow_name: research</param>
  </invoke-workflow>

  <check if="success == true">
    <output>Status updated! Next: {{next_workflow}}</output>
  </check>
</check>

<output>**✅ Technical Research Complete**

**Research Report:**

- Technical research report generated and saved

**Status file updated:**

- Current step: research (technical) ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**

1. Review technical research findings
2. Share with architecture team
3. Run `plan-project` to incorporate findings into PRD

Check status anytime with: `workflow-status`
</output>
</check>

<check if="status file not found">
  <output>**✅ Technical Research Complete**

**Research Report:**

- Technical research report generated and saved

Note: Running in standalone mode (no status file).

**Next Steps:**

1. Review technical research findings
2. Run plan-project workflow
   </output>
   </check>
   </step>

</workflow>
