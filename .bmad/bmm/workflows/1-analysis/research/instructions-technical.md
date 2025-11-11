# Technical/Architecture Research Instructions

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication style based on {user_skill_level}</critical>
<critical>This is a HIGHLY INTERACTIVE workflow - make technical decisions WITH user, not FOR them</critical>
<critical>Web research is MANDATORY - use WebSearch tool with {{current_year}} for current version info and trends</critical>
<critical>ALWAYS verify current versions - NEVER use hardcoded or outdated version numbers</critical>
<critical>Communicate all responses in {communication_language} and tailor to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>🚨 ANTI-HALLUCINATION PROTOCOL - MANDATORY 🚨</critical>
<critical>NEVER invent version numbers, features, or technical details - ALWAYS verify with current {{current_year}} sources</critical>
<critical>Every technical claim (version, feature, performance, compatibility) MUST have a cited source with URL</critical>
<critical>Version numbers MUST be verified via WebSearch - do NOT rely on training data (it's outdated!)</critical>
<critical>When comparing technologies, cite sources for each claim (performance benchmarks, community size, etc.)</critical>
<critical>Mark confidence levels: [Verified {{current_year}} source], [Older source - verify], [Uncertain - needs verification]</critical>
<critical>Distinguish: FACT (from official docs/sources), OPINION (from community/reviews), SPECULATION (your analysis)</critical>
<critical>If you cannot find current information about a technology, state: "I could not find recent {{current_year}} data on [X]"</critical>
<critical>Extract and include source URLs in all technology profiles and comparisons</critical>

<workflow>

<step n="1" goal="Discover technical research needs through conversation">

<action>Engage conversationally based on skill level:

<check if="{user_skill_level} == 'expert'">
  "Let's research the technical options for your decision.

I'll gather current data from {{current_year}}, compare approaches, and help you think through trade-offs.

What technical question are you wrestling with?"
</check>

<check if="{user_skill_level} == 'intermediate'">
  "I'll help you research and evaluate your technical options.

We'll look at current technologies (using {{current_year}} data), understand the trade-offs, and figure out what fits your needs best.

What technical decision are you trying to make?"
</check>

<check if="{user_skill_level} == 'beginner'">
  "Think of this as having a technical advisor help you research your options.

I'll explain what different technologies do, why you might choose one over another, and help you make an informed decision.

What technical challenge brought you here?"
</check>
</action>

<action>Through conversation, understand:

- **The technical question** - What they need to decide or understand
- **The context** - Greenfield? Brownfield? Learning? Production?
- **Current constraints** - Languages, platforms, team skills, budget
- **What they already know** - Do they have candidates in mind?

Don't interrogate - explore together. If they're unsure, help them articulate the problem.
</action>

<template-output>technical_question</template-output>
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

<step n="3" goal="Discover and evaluate technology options together">

<critical>MUST use WebSearch to find current options from {{current_year}}</critical>

<action>Ask if they have candidates in mind:

"Do you already have specific technologies you want to compare, or should I search for the current options?"
</action>

<action if="user has candidates">Great! Let's research: {{user_candidates}}</action>

<action if="discovering options">Search for current leading technologies:

<WebSearch>{{technical_category}} best tools {{current_year}}</WebSearch>
<WebSearch>{{technical_category}} comparison {{use_case}} {{current_year}}</WebSearch>
<WebSearch>{{technical_category}} popular frameworks {{current_year}}</WebSearch>
<WebSearch>state of {{technical_category}} {{current_year}}</WebSearch>
</action>

<action>Share findings conversationally:

"Based on current {{current_year}} data, here are the main options:

{{discovered_options}}

<check if="{user_skill_level} == 'expert'">
These are the leaders right now. Which ones make sense to evaluate for your use case?"
</check>

<check if="{user_skill_level} == 'beginner'">
Each of these is popular for different reasons. Let me know if you want me to explain what makes each one different."
</check>
</action>

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>technology_options</template-output>

</step>

<step n="4" goal="Research each technology together in depth">

<critical>For each option, use WebSearch to gather CURRENT {{current_year}} information</critical>

<step n="4a" title="Deep dive on each technology" repeat="for-each-option">

<action>For {{technology_name}}, conduct comprehensive research:

<WebSearch>{{technology_name}} overview what is {{current_year}}</WebSearch>
<WebSearch>{{technology_name}} latest version release notes {{current_year}}</WebSearch>
<WebSearch>{{technology_name}} pros cons trade-offs {{current_year}}</WebSearch>
<WebSearch>{{technology_name}} production experience real world {{current_year}}</WebSearch>
<WebSearch>{{technology_name}} vs alternatives comparison {{current_year}}</WebSearch>
</action>

<action>Share findings conversationally and collaboratively:

"Here's what I found about {{technology_name}}:

**Overview:**
{{what_it_is_and_solves}}

**Current Status ({{current_year}}):**
{{maturity_community_release_cadence}}

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

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
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

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>

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

<step n="FINAL" goal="Update status file on completion" tag="workflow-status">
<check if="standalone_mode != true">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Find workflow_status key "research"</action>
  <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
  <action>Update workflow_status["research"] = "{output_folder}/bmm-research-technical-{{date}}.md"</action>
  <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
<action>Determine next agent from path file based on next workflow</action>
</check>

<output>**✅ Technical Research Complete**

**Research Report:**

- Technical research report generated and saved to {output_folder}/bmm-research-technical-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: research marked complete
- Next workflow: {{next_workflow}}
  {{else}}
  **Note:** Running in standalone mode (no progress tracking)
  {{/if}}

**Next Steps:**

{{#if standalone_mode != true}}

- **Next workflow:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Review findings with architecture team, or run additional analysis workflows

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Review technical research findings
- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>
  </step>

</workflow>
