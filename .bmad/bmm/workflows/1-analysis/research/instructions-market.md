# Market Research Workflow Instructions

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication style based on {user_skill_level}</critical>
<critical>This is a HIGHLY INTERACTIVE workflow - collaborate with user throughout, don't just gather info and disappear</critical>
<critical>Web research is MANDATORY - use WebSearch tool with {{current_year}} for all market intelligence gathering</critical>
<critical>Communicate all responses in {communication_language} and tailor to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>🚨 ANTI-HALLUCINATION PROTOCOL - MANDATORY 🚨</critical>
<critical>NEVER invent market data - if you cannot find reliable data, explicitly state: "I could not find verified data for [X]"</critical>
<critical>EVERY statistic, market size, growth rate, or competitive claim MUST have a cited source with URL</critical>
<critical>For CRITICAL claims (TAM/SAM/SOM, market size, growth rates), require 2+ independent sources that agree</critical>
<critical>When data sources conflict (e.g., different market size estimates), present ALL estimates with sources and explain variance</critical>
<critical>Mark data confidence: [Verified - 2+ sources], [Single source - verify], [Estimated - low confidence]</critical>
<critical>Clearly label: FACT (sourced data), ANALYSIS (your interpretation), PROJECTION (forecast/speculation)</critical>
<critical>After each WebSearch, extract and store source URLs - include them in the report</critical>
<critical>If a claim seems suspicious or too convenient, STOP and cross-verify with additional searches</critical>

<!-- IDE-INJECT-POINT: market-research-subagents -->

<workflow>

<step n="1" goal="Discover research needs and scope collaboratively">

<action>Welcome {user_name} warmly. Position yourself as their collaborative research partner who will:

- Gather live {{current_year}} market data
- Share findings progressively throughout
- Help make sense of what we discover together

Ask what they're building and what market questions they need answered.
</action>

<action>Through natural conversation, discover:

- The product/service and current stage
- Their burning questions (what they REALLY need to know)
- Context and urgency (fundraising? launch decision? pivot?)
- Existing knowledge vs. uncertainties
- Desired depth (gauge from their needs, don't ask them to choose)

Adapt your approach: If uncertain → help them think it through. If detailed → dig deeper.

Collaboratively define scope:

- Markets/segments to focus on
- Geographic boundaries
- Critical questions vs. nice-to-have
  </action>

<action>Reflect understanding back to confirm you're aligned on what matters.</action>

<template-output>product_name</template-output>
<template-output>product_description</template-output>
<template-output>research_objectives</template-output>
<template-output>research_scope</template-output>
</step>

<step n="2" goal="Market Definition and Boundaries">
<action>Help the user precisely define the market scope</action>

Work with the user to establish:

1. **Market Category Definition**
   - Primary category/industry
   - Adjacent or overlapping markets
   - Where this fits in the value chain

2. **Geographic Scope**
   - Global, regional, or country-specific?
   - Primary markets vs. expansion markets
   - Regulatory considerations by region

3. **Customer Segment Boundaries**
   - B2B, B2C, or B2B2C?
   - Primary vs. secondary segments
   - Segment size estimates

<ask>Should we include adjacent markets in the TAM calculation? This could significantly increase market size but may be less immediately addressable.</ask>

<template-output>market_definition</template-output>
<template-output>geographic_scope</template-output>
<template-output>segment_boundaries</template-output>
</step>

<step n="3" goal="Gather live market intelligence collaboratively">

<critical>This step REQUIRES WebSearch tool usage - gather CURRENT data from {{current_year}}</critical>
<critical>Share findings as you go - make this collaborative, not a black box</critical>

<action>Let {user_name} know you're searching for current {{market_category}} market data: size, growth, analyst reports, recent trends. Tell them you'll share what you find in a few minutes and review it together.</action>

<step n="3a" title="Search for market size and industry data">
<action>Conduct systematic web searches using WebSearch tool:

<WebSearch>{{market_category}} market size {{geographic_scope}} {{current_year}}</WebSearch>
<WebSearch>{{market_category}} industry report Gartner Forrester IDC {{current_year}}</WebSearch>
<WebSearch>{{market_category}} market growth rate CAGR forecast {{current_year}}</WebSearch>
<WebSearch>{{market_category}} market trends {{current_year}}</WebSearch>
<WebSearch>{{market_category}} TAM SAM market opportunity {{current_year}}</WebSearch>
</action>

<action>Share findings WITH SOURCES including URLs and dates. Ask if it aligns with their expectations.</action>

<action>CRITICAL - Validate data before proceeding:

- Multiple sources with similar figures?
- Recent sources ({{current_year}} or within 1-2 years)?
- Credible sources (Gartner, Forrester, govt data, reputable pubs)?
- Conflicts? Note explicitly, search for more sources, mark [Low Confidence]
  </action>

<action if="user_has_questions">Explore surprising data points together</action>

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>sources_market_size</template-output>
</step>

<step n="3b" title="Search for recent news and developments" optional="true">
<action>Search for recent market developments:

<WebSearch>{{market_category}} news {{current_year}} funding acquisitions</WebSearch>
<WebSearch>{{market_category}} recent developments {{current_year}}</WebSearch>
<WebSearch>{{market_category}} regulatory changes {{current_year}}</WebSearch>
</action>

<action>Share noteworthy findings:

"I found some interesting recent developments:

{{key_news_highlights}}

Anything here surprise you or confirm what you suspected?"
</action>
</step>

<step n="3c" title="Optional: Government and academic sources" optional="true">
<action if="research needs high credibility">Search for authoritative sources:

<WebSearch>{{market_category}} government statistics census data {{current_year}}</WebSearch>
<WebSearch>{{market_category}} academic research white papers {{current_year}}</WebSearch>
</action>
</step>

<template-output>market_intelligence_raw</template-output>
<template-output>key_data_points</template-output>
<template-output>source_credibility_notes</template-output>
</step>

<step n="4" goal="TAM, SAM, SOM Calculations">
<action>Calculate market sizes using multiple methodologies for triangulation</action>

<critical>Use actual data gathered in previous steps, not hypothetical numbers</critical>

<step n="4a" title="TAM Calculation">
**Method 1: Top-Down Approach**
- Start with total industry size from research
- Apply relevant filters and segments
- Show calculation: Industry Size × Relevant Percentage

**Method 2: Bottom-Up Approach**

- Number of potential customers × Average revenue per customer
- Build from unit economics

**Method 3: Value Theory Approach**

- Value created × Capturable percentage
- Based on problem severity and alternative costs

<ask>Which TAM calculation method seems most credible given our data? Should we use multiple methods and triangulate?</ask>

<template-output>tam_calculation</template-output>
<template-output>tam_methodology</template-output>
</step>

<step n="4b" title="SAM Calculation">
<action>Calculate Serviceable Addressable Market</action>

Apply constraints to TAM:

- Geographic limitations (markets you can serve)
- Regulatory restrictions
- Technical requirements (e.g., internet penetration)
- Language/cultural barriers
- Current business model limitations

SAM = TAM × Serviceable Percentage
Show the calculation with clear assumptions.

<template-output>sam_calculation</template-output>
</step>

<step n="4c" title="SOM Calculation">
<action>Calculate realistic market capture</action>

Consider competitive dynamics:

- Current market share of competitors
- Your competitive advantages
- Resource constraints
- Time to market considerations
- Customer acquisition capabilities

Create 3 scenarios:

1. Conservative (1-2% market share)
2. Realistic (3-5% market share)
3. Optimistic (5-10% market share)

<template-output>som_scenarios</template-output>
</step>
</step>

<step n="5" goal="Customer Segment Deep Dive">
<action>Develop detailed understanding of target customers</action>

<step n="5a" title="Segment Identification" repeat="for-each-segment">
For each major segment, research and define:

**Demographics/Firmographics:**

- Size and scale characteristics
- Geographic distribution
- Industry/vertical (for B2B)

**Psychographics:**

- Values and priorities
- Decision-making process
- Technology adoption patterns

**Behavioral Patterns:**

- Current solutions used
- Purchasing frequency
- Budget allocation

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
<template-output>segment*profile*{{segment_number}}</template-output>
</step>

<step n="5b" title="Jobs-to-be-Done Framework">
<action>Apply JTBD framework to understand customer needs</action>

For primary segment, identify:

**Functional Jobs:**

- Main tasks to accomplish
- Problems to solve
- Goals to achieve

**Emotional Jobs:**

- Feelings sought
- Anxieties to avoid
- Status desires

**Social Jobs:**

- How they want to be perceived
- Group dynamics
- Peer influences

<ask>Would you like to conduct actual customer interviews or surveys to validate these jobs? (We can create an interview guide)</ask>

<template-output>jobs_to_be_done</template-output>
</step>

<step n="5c" title="Willingness to Pay Analysis">
<action>Research and estimate pricing sensitivity</action>

Analyze:

- Current spending on alternatives
- Budget allocation for this category
- Value perception indicators
- Price points of substitutes

<template-output>pricing_analysis</template-output>
</step>
</step>

<step n="6" goal="Understand the competitive landscape">
<action>Ask if they know their main competitors or if you should search for them.</action>

<step n="6a" title="Discover competitors together">
<action if="user doesn't know competitors">Search for competitors:

<WebSearch>{{product_category}} competitors {{geographic_scope}} {{current_year}}</WebSearch>
<WebSearch>{{product_category}} alternatives comparison {{current_year}}</WebSearch>
<WebSearch>top {{product_category}} companies {{current_year}}</WebSearch>
</action>

<action>Present findings. Ask them to pick the 3-5 that matter most (most concerned about or curious to understand).</action>
</step>

<step n="6b" title="Research each competitor together" repeat="for-each-selected-competitor">
<action>For each competitor, search for:
- Company overview, product features
- Pricing model
- Funding and recent news
- Customer reviews and ratings

Use {{current_year}} in all searches.
</action>

<action>Share findings with sources. Ask what jumps out and if it matches expectations.</action>

<action if="user has follow-up questions">Dig deeper based on their interests</action>

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
<template-output>competitor*analysis*{{competitor_name}}</template-output>
</step>

<step n="6c" title="Competitive Positioning Map">
<action>Create positioning analysis</action>

Map competitors on key dimensions:

- Price vs. Value
- Feature completeness vs. Ease of use
- Market segment focus
- Technology approach
- Business model

Identify:

- Gaps in the market
- Over-served areas
- Differentiation opportunities

<template-output>competitive_positioning</template-output>
</step>
</step>

<step n="7" goal="Industry Forces Analysis">
<action>Apply Porter's Five Forces framework</action>

<critical>Use specific evidence from research, not generic assessments</critical>

Analyze each force with concrete examples:

<step n="7a" title="Supplier Power">
Rate: [Low/Medium/High]
- Key suppliers and dependencies
- Switching costs
- Concentration of suppliers
- Forward integration threat
</step>

<step n="7b" title="Buyer Power">
Rate: [Low/Medium/High]
- Customer concentration
- Price sensitivity
- Switching costs for customers
- Backward integration threat
</step>

<step n="7c" title="Competitive Rivalry">
Rate: [Low/Medium/High]
- Number and strength of competitors
- Industry growth rate
- Exit barriers
- Differentiation levels
</step>

<step n="7d" title="Threat of New Entry">
Rate: [Low/Medium/High]
- Capital requirements
- Regulatory barriers
- Network effects
- Brand loyalty
</step>

<step n="7e" title="Threat of Substitutes">
Rate: [Low/Medium/High]
- Alternative solutions
- Switching costs to substitutes
- Price-performance trade-offs
</step>

<template-output>porters_five_forces</template-output>
</step>

<step n="8" goal="Market Trends and Future Outlook">
<action>Identify trends and future market dynamics</action>

Research and analyze:

**Technology Trends:**

- Emerging technologies impacting market
- Digital transformation effects
- Automation possibilities

**Social/Cultural Trends:**

- Changing customer behaviors
- Generational shifts
- Social movements impact

**Economic Trends:**

- Macroeconomic factors
- Industry-specific economics
- Investment trends

**Regulatory Trends:**

- Upcoming regulations
- Compliance requirements
- Policy direction

<ask>Should we explore any specific emerging technologies or disruptions that could reshape this market?</ask>

<template-output>market_trends</template-output>
<template-output>future_outlook</template-output>
</step>

<step n="9" goal="Opportunity Assessment and Strategy">
<action>Synthesize research into strategic opportunities</action>

<step n="9a" title="Opportunity Identification">
Based on all research, identify top 3-5 opportunities:

For each opportunity:

- Description and rationale
- Size estimate (from SOM)
- Resource requirements
- Time to market
- Risk assessment
- Success criteria

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
<template-output>market_opportunities</template-output>
</step>

<step n="9b" title="Go-to-Market Recommendations">
Develop GTM strategy based on research:

**Positioning Strategy:**

- Value proposition refinement
- Differentiation approach
- Messaging framework

**Target Segment Sequencing:**

- Beachhead market selection
- Expansion sequence
- Segment-specific approaches

**Channel Strategy:**

- Distribution channels
- Partnership opportunities
- Marketing channels

**Pricing Strategy:**

- Model recommendation
- Price points
- Value metrics

<template-output>gtm_strategy</template-output>
</step>

<step n="9c" title="Risk Analysis">
Identify and assess key risks:

**Market Risks:**

- Demand uncertainty
- Market timing
- Economic sensitivity

**Competitive Risks:**

- Competitor responses
- New entrants
- Technology disruption

**Execution Risks:**

- Resource requirements
- Capability gaps
- Scaling challenges

For each risk: Impact (H/M/L) × Probability (H/M/L) = Risk Score
Provide mitigation strategies.

<template-output>risk_assessment</template-output>
</step>
</step>

<step n="10" goal="Financial Projections" optional="true" if="enable_financial_modeling == true">
<action>Create financial model based on market research</action>

<ask>Would you like to create a financial model with revenue projections based on the market analysis?</ask>

<check if="yes">
  Build 3-year projections:

- Revenue model based on SOM scenarios
- Customer acquisition projections
- Unit economics
- Break-even analysis
- Funding requirements

<template-output>financial_projections</template-output>
</check>

</step>

<step n="11" goal="Synthesize findings together into executive summary">

<critical>This is the last major content section - make it collaborative</critical>

<action>Review the research journey together. Share high-level summaries of market size, competitive dynamics, customer insights. Ask what stands out most - what surprised them or confirmed their thinking.</action>

<action>Collaboratively craft the narrative:

- What's the headline? (The ONE thing someone should know)
- What are the 3-5 critical insights?
- Recommended path forward?
- Key risks?

This should read like a strategic brief, not a data dump.
</action>

<action>Draft executive summary and share. Ask if it captures the essence and if anything is missing or overemphasized.</action>

<template-output>executive_summary</template-output>
</step>

<step n="12" goal="Validate sources and compile report">

<critical>MANDATORY SOURCE VALIDATION - Do NOT skip this step!</critical>

<action>Before finalizing, conduct source audit:

Review every major claim in the report and verify:

**For Market Size Claims:**

- [ ] At least 2 independent sources cited with URLs
- [ ] Sources are from {{current_year}} or within 2 years
- [ ] Sources are credible (Gartner, Forrester, govt data, reputable pubs)
- [ ] Conflicting estimates are noted with all sources

**For Competitive Data:**

- [ ] Competitor information has source URLs
- [ ] Pricing data is current and sourced
- [ ] Funding data is verified with dates
- [ ] Customer reviews/ratings have source links

**For Growth Rates and Projections:**

- [ ] CAGR and forecast data are sourced
- [ ] Methodology is explained or linked
- [ ] Multiple analyst estimates are compared if available

**For Customer Insights:**

- [ ] Persona data is based on real research (cited)
- [ ] Survey/interview data has sample size and source
- [ ] Behavioral claims are backed by studies/data
      </action>

<action>Count and document source quality:

- Total sources cited: {{count_all_sources}}
- High confidence (2+ sources): {{high_confidence_claims}}
- Single source (needs verification): {{single_source_claims}}
- Uncertain/speculative: {{low_confidence_claims}}

If {{single_source_claims}} or {{low_confidence_claims}} is high, consider additional research.
</action>

<action>Compile full report with ALL sources properly referenced:

Generate the complete market research report using the template:

- Ensure every statistic has inline citation: [Source: Company, Year, URL]
- Populate all {{sources_*}} template variables
- Include confidence levels for major claims
- Add References section with full source list
  </action>

<action>Present source quality summary to user:

"I've completed the research with {{count_all_sources}} total sources:

- {{high_confidence_claims}} claims verified with multiple sources
- {{single_source_claims}} claims from single sources (marked for verification)
- {{low_confidence_claims}} claims with low confidence or speculation

Would you like me to strengthen any areas with additional research?"
</action>

<ask>Would you like to review any specific sections before finalizing? Are there any additional analyses you'd like to include?</ask>

<goto step="9a" if="user requests changes">Return to refine opportunities</goto>

<template-output>final_report_ready</template-output>
<template-output>source_audit_complete</template-output>
</step>

<step n="13" goal="Appendices and Supporting Materials" optional="true">
<ask>Would you like to include detailed appendices with calculations, full competitor profiles, or raw research data?</ask>

<check if="yes">
  Create appendices with:

- Detailed TAM/SAM/SOM calculations
- Full competitor profiles
- Customer interview notes
- Data sources and methodology
- Financial model details
- Glossary of terms

<template-output>appendices</template-output>
</check>

</step>

<step n="14" goal="Update status file on completion" tag="workflow-status">
<check if="standalone_mode != true">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Find workflow_status key "research"</action>
  <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
  <action>Update workflow_status["research"] = "{output_folder}/bmm-research-{{research_mode}}-{{date}}.md"</action>
  <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
<action>Determine next agent from path file based on next workflow</action>
</check>

<output>**✅ Research Complete ({{research_mode}} mode)**

**Research Report:**

- Research report generated and saved to {output_folder}/bmm-research-{{research_mode}}-{{date}}.md

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
- **Optional:** Review findings with stakeholders, or run additional analysis workflows (product-brief for software, or install BMGD module for game-brief)

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Review research findings
- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>
  </step>

</workflow>
