# Domain Research - Collaborative Domain Exploration

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is COLLABORATIVE RESEARCH - engage the user as a partner, not just a data source</critical>
<critical>The goal is PRACTICAL UNDERSTANDING that directly informs requirements and architecture</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to domain-brief.md continuously as you discover - never wait until the end</critical>

<workflow>

<step n="0" goal="Set research context">
<action>Welcome {user_name} to collaborative domain research

Check for context:

- Was this triggered from PRD workflow?
- Is there a workflow-status.yaml with project context?
- Did user provide initial domain/project description?

If context exists, reflect it back:
"I understand you're building [description]. Let's explore the [domain] aspects together to ensure we capture all critical requirements."

If no context:
"Let's explore your project's domain together. Tell me about what you're building and what makes it unique or complex."</action>
</step>

<step n="1" goal="Domain detection and scoping">
<action>Through conversation, identify the domain and its complexity

Listen for domain signals and explore:

- "Is this in a regulated industry?"
- "Are there safety or compliance concerns?"
- "What could go wrong if this fails?"
- "Who are the stakeholders beyond direct users?"
- "Are there industry standards we need to follow?"

Based on responses, identify primary domain(s):

- Healthcare/Medical
- Financial Services
- Government/Public Sector
- Education
- Aerospace/Defense
- Automotive
- Energy/Utilities
- Legal
- Insurance
- Scientific/Research
- Other specialized domain

Share your understanding:
"Based on our discussion, this appears to be a [domain] project with [key characteristics]. The main areas we should research are:

- [Area 1]
- [Area 2]
- [Area 3]

What concerns you most about building in this space?"</action>

<template-output>domain_overview</template-output>
</step>

<step n="2" goal="Collaborative concern mapping">
<action>Work WITH the user to identify critical concerns

"Let's map out the important considerations together. I'll share what I typically see in [domain], and you tell me what applies to your case."

For detected domain, explore relevant areas:

HEALTHCARE:
"In healthcare software, teams often worry about:

- FDA approval pathways (510k, De Novo, PMA)
- HIPAA compliance for patient data
- Clinical validation requirements
- Integration with hospital systems (HL7, FHIR, DICOM)
- Patient safety and liability

Which of these apply to you? What else concerns you?"

FINTECH:
"Financial software typically deals with:

- KYC/AML requirements
- Payment processing regulations (PCI DSS)
- Regional compliance (US, EU, specific countries?)
- Fraud prevention
- Audit trails and reporting

What's your situation with these? Any specific regions?"

AEROSPACE:
"Aerospace software often requires:

- DO-178C certification levels
- Safety analysis (FMEA, FTA)
- Simulation validation
- Real-time performance guarantees
- Export control (ITAR)

Which are relevant for your project?"

[Continue for other domains...]

Document concerns as the user shares them
Ask follow-up questions to understand depth:

- "How critical is this requirement?"
- "Is this a must-have for launch or can it come later?"
- "Do you have expertise here or need guidance?"</action>

<template-output>concern_mapping</template-output>
</step>

<step n="3" goal="Research key requirements together">
<action>Conduct research WITH the user watching and contributing

"Let me research the current requirements for [specific concern]. You can guide me toward what's most relevant."

<WebSearch>{specific_requirement} requirements {date}</WebSearch>

Share findings immediately:
"Here's what I found about [requirement]:

- [Key point 1]
- [Key point 2]
- [Key point 3]

Does this match your understanding? Anything surprising or concerning?"

For each major concern:

1. Research current standards/regulations
2. Share findings with user
3. Get their interpretation
4. Note practical implications

If user has expertise:
"You seem knowledgeable about [area]. What should I know that might not be in public documentation?"

If user is learning:
"This might be new territory. Let me explain what this means practically for your development..."</action>

<template-output>regulatory_requirements</template-output>
<template-output>industry_standards</template-output>
</step>

<step n="4" goal="Identify practical implications">
<action>Translate research into practical development impacts

"Based on what we've learned, here's what this means for your project:

ARCHITECTURE IMPLICATIONS:

- [How this affects system design]
- [Required components or patterns]
- [Performance or security needs]

DEVELOPMENT IMPLICATIONS:

- [Additional development effort]
- [Special expertise needed]
- [Testing requirements]

TIMELINE IMPLICATIONS:

- [Certification/approval timelines]
- [Validation requirements]
- [Documentation needs]

COST IMPLICATIONS:

- [Compliance costs]
- [Required tools or services]
- [Ongoing maintenance]

Does this align with your expectations? Any surprises we should dig into?"</action>

<template-output>practical_implications</template-output>
</step>

<step n="5" goal="Discover domain-specific patterns">
<action>Explore how others solve similar problems

"Let's look at how successful [domain] products handle these challenges."

<WebSearch>best {domain} software architecture patterns {date}</WebSearch>
<WebSearch>{domain} software case studies {date}</WebSearch>

Discuss patterns:
"I found these common approaches in [domain]:

Pattern 1: [Description]

- Pros: [Benefits]
- Cons: [Tradeoffs]
- When to use: [Conditions]

Pattern 2: [Description]

- Pros: [Benefits]
- Cons: [Tradeoffs]
- When to use: [Conditions]

Which resonates with your vision? Or are you thinking something different?"

If user proposes novel approach:
"That's interesting and different from the standard patterns. Let's explore:

- What makes your approach unique?
- What problem does it solve that existing patterns don't?
- What are the risks?
- How do we validate it?"</action>

<template-output>domain_patterns</template-output>
<template-output if="novel approach">innovation_notes</template-output>
</step>

<step n="6" goal="Risk assessment and mitigation">
<action>Collaboratively identify and address risks

"Every [domain] project has risks. Let's think through yours:

REGULATORY RISKS:

- What if regulations change during development?
- What if approval/certification takes longer?
- What if we misinterpret requirements?

TECHNICAL RISKS:

- What if the domain requirements conflict with user experience?
- What if performance requirements are harder than expected?
- What if integrations are more complex?

MARKET RISKS:

- What if competitors move faster?
- What if domain experts are hard to find?
- What if users resist domain-mandated workflows?

For each risk you're concerned about, let's identify:

1. How likely is it?
2. What's the impact if it happens?
3. How can we mitigate it?
4. What's our plan B?"</action>

<template-output>risk_assessment</template-output>
</step>

<step n="7" goal="Create validation strategy">
<action>Plan how to ensure domain requirements are met

"Let's plan how to validate that we're meeting [domain] requirements:

COMPLIANCE VALIDATION:

- How do we verify regulatory compliance?
- Who needs to review/approve?
- What documentation is required?

TECHNICAL VALIDATION:

- How do we prove the system works correctly?
- What metrics matter?
- What testing is required?

DOMAIN EXPERT VALIDATION:

- Who are the domain experts to involve?
- When should they review?
- What are their success criteria?

USER VALIDATION:

- How do we ensure it's still usable despite constraints?
- What user testing is needed?
- How do we balance domain requirements with UX?

What validation is most critical for your confidence?"</action>

<template-output>validation_strategy</template-output>
</step>

<step n="8" goal="Document decision points">
<action>Capture key decisions and rationale

"Let's document the important decisions we've made:

DOMAIN APPROACH:

- We're choosing [approach] because [rationale]
- We're prioritizing [requirement] over [requirement] because [reason]
- We're deferring [requirement] to Phase 2 because [justification]

COMPLIANCE STRATEGY:

- We'll pursue [pathway] for regulatory approval
- We'll implement [standard] for industry compliance
- We'll handle [requirement] by [approach]

RISK DECISIONS:

- We accept [risk] because [reason]
- We'll mitigate [risk] through [approach]
- We'll monitor [risk] by [method]

Any decisions you want to revisit or rationale to add?"</action>

<template-output>key_decisions</template-output>
</step>

<step n="9" goal="Create actionable recommendations">
<action>Synthesize research into specific recommendations

"Based on our research, here are my recommendations for your PRD and development:

MUST HAVE (Domain Critical):

1. [Specific requirement with why it's critical]
2. [Specific requirement with why it's critical]
3. [Specific requirement with why it's critical]

SHOULD HAVE (Domain Important):

1. [Requirement that's important but not blocking]
2. [Requirement that's important but not blocking]

CONSIDER (Domain Nice-to-Have):

1. [Enhancement that would differentiate]
2. [Enhancement that would differentiate]

DEVELOPMENT SEQUENCE:

1. First: [What to build first and why]
2. Then: [What comes next and why]
3. Later: [What can wait and why]

EXPERTISE NEEDED:

- [Domain expert role]: For [specific areas]
- [Technical expert role]: For [specific requirements]

TIMELINE CONSIDERATIONS:

- Allow [time] for [process/approval]
- Start [requirement] early because [reason]
- [Requirement] can be parallel with development

Do these recommendations feel right? What would you adjust?"</action>

<template-output>recommendations</template-output>
</step>

<step n="10" goal="Package for PRD integration">
<action>Create clear handoff to PRD workflow

"I've captured everything in domain-brief.md. Here's the summary for your PRD:

DOMAIN: {identified_domain}
COMPLEXITY: {high|medium}

KEY REQUIREMENTS TO INCORPORATE:

- [Requirement 1 - critical for domain]
- [Requirement 2 - critical for domain]
- [Requirement 3 - important consideration]

IMPACTS ON:

- Functional Requirements: [How domain affects features]
- Non-Functional Requirements: [Performance, security, etc.]
- Architecture: [System design considerations]
- Development: [Process and timeline impacts]

REFERENCE DOCS:

- Full domain analysis: domain-brief.md
- Regulations researched: [List with links]
- Standards referenced: [List with links]

When you return to PRD, reference this brief for domain context.

Any final questions before we wrap up the domain research?"</action>

<template-output>summary_for_prd</template-output>
</step>

<step n="11" goal="Close with next steps">
<output>**✅ Domain Research Complete, {user_name}!**

We've explored the {domain} aspects of your project together and documented critical requirements.

**Created:**

- **domain-brief.md** - Complete domain analysis with requirements and recommendations

**Key Findings:**

- Primary domain: {domain}
- Complexity level: {complexity}
- Critical requirements: {count} identified
- Risks identified: {count} with mitigation strategies

**Next Steps:**

1. Return to PRD workflow with this domain context
2. Domain requirements will shape your functional requirements
3. Reference domain-brief.md for detailed requirements

**Remember:**
{most_important_finding}

The domain research will ensure your PRD captures not just what to build, but HOW to build it correctly for {domain}.
</output>
</step>

</workflow>
