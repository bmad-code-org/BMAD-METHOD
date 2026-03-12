# Domain Research Step 1: Domain Research Scope Confirmation

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user confirmation

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ FOCUS EXCLUSIVELY on confirming domain research scope and approach
- 📋 YOU ARE A DOMAIN RESEARCH PLANNER, not content generator
- 💬 ACKNOWLEDGE and CONFIRM understanding of domain research goals
- 🔍 This is SCOPE CONFIRMATION ONLY - no web research yet
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present [C] continue option after scope confirmation
- 💾 ONLY proceed when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Research type = "domain" is already set
- **Research topic = "{{research_topic}}"** - discovered from initial discussion
- **Research goals = "{{research_goals}}"** - captured from initial discussion
- Focus on industry/domain analysis with web research
- Web search is required to verify and supplement your knowledge with current facts

## YOUR TASK:

Confirm domain research scope and approach for **{{research_topic}}** with the user's goals in mind.

## DOMAIN SCOPE CONFIRMATION:

### 1. Begin Scope Confirmation

Start with domain scope understanding:
"I understand you want to conduct **domain research** for **{{research_topic}}** with these goals: {{research_goals}}

**Domain Research Scope:**

- **Industry Analysis**: Industry structure, market dynamics, and competitive landscape
- **Regulatory Environment**: Compliance requirements, regulations, and standards
- **Technology Patterns**: Innovation trends, technology adoption, and digital transformation
- **Economic Factors**: Market size, growth trends, and economic impact
- **Supply Chain**: Value chain analysis and ecosystem relationships

**Research Approach:**

- All claims verified against current public sources
- Multi-source validation for critical domain claims
- Confidence levels for uncertain domain information
- Comprehensive domain coverage with industry-specific insights

### 2. Scope Confirmation

Present clear scope confirmation:
"**Domain Research Scope Confirmation:**

For **{{research_topic}}**, I will research:

✅ **Industry Analysis** - market structure, key players, competitive dynamics
✅ **Regulatory Requirements** - compliance standards, legal frameworks
✅ **Technology Trends** - innovation patterns, digital transformation
✅ **Economic Factors** - market size, growth projections, economic impact
✅ **Supply Chain Analysis** - value chain, ecosystem, partnerships

**All claims verified against current public sources.**

**Does this domain research scope and approach align with your goals?**
[C] Continue - Begin domain research with this scope

### 3. Handle Continue Selection

#### If 'C' (Continue):

- Document scope confirmation in research file
- Update frontmatter: `stepsCompleted: [1]`
- Load: `./domain-steps/step-02-domain-analysis.md`

## APPEND TO DOCUMENT:

When user selects 'C', append scope confirmation:

```markdown
## Domain Research Scope Confirmation

**Research Topic:** {{research_topic}}
**Research Goals:** {{research_goals}}

**Domain Research Scope:**

- Industry Analysis - market structure, competitive landscape
- Regulatory Environment - compliance requirements, legal frameworks
- Technology Trends - innovation patterns, digital transformation
- Economic Factors - market size, growth projections
- Supply Chain Analysis - value chain, ecosystem relationships

**Research Methodology:**

- All claims verified against current public sources
- Multi-source validation for critical domain claims
- Confidence level framework for uncertain information
- Comprehensive domain coverage with industry-specific insights

**Scope Confirmed:** {{date}}
```

## SUCCESS METRICS:

✅ Domain research scope clearly confirmed with user
✅ All domain analysis areas identified and explained
✅ Research methodology emphasized
✅ [C] continue option presented and handled correctly
✅ Scope confirmation documented when user proceeds
✅ Proper routing to next domain research step

## FAILURE MODES:

❌ Not clearly confirming domain research scope with user
❌ Missing critical domain analysis areas
❌ Not explaining that web search is required for current facts
❌ Not presenting [C] continue option
❌ Proceeding without user scope confirmation
❌ Not routing to next domain research step

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C', load `./domain-steps/step-02-domain-analysis.md` to begin industry analysis.

Remember: This is SCOPE CONFIRMATION ONLY - no actual domain research yet, just confirming the research approach and scope!
