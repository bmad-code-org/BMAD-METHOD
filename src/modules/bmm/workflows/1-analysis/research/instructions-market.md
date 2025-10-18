# Market Research Workflow Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is an INTERACTIVE workflow with web research capabilities. Engage the user at key decision points.</critical>

<!-- IDE-INJECT-POINT: market-research-subagents -->

<workflow>

<step n="1" goal="Research Discovery and Scoping">
<action>Welcome the user and explain the market research journey ahead</action>

Ask the user these critical questions to shape the research:

1. **What is the product/service you're researching?**
   - Name and brief description
   - Current stage (idea, MVP, launched, scaling)

2. **What are your primary research objectives?**
   - Market sizing and opportunity assessment?
   - Competitive intelligence gathering?
   - Customer segment validation?
   - Go-to-market strategy development?
   - Investment/fundraising support?
   - Product-market fit validation?

3. **Research depth preference:**
   - Quick scan (2-3 hours) - High-level insights
   - Standard analysis (4-6 hours) - Comprehensive coverage
   - Deep dive (8+ hours) - Exhaustive research with modeling

4. **Do you have any existing research or documents to build upon?**

<template-output>product_name</template-output>
<template-output>product_description</template-output>
<template-output>research_objectives</template-output>
<template-output>research_depth</template-output>
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

<step n="3" goal="Live Market Intelligence Gathering" if="enable_web_research == true">
<action>Conduct real-time web research to gather current market data</action>

<critical>This step performs ACTUAL web searches to gather live market intelligence</critical>

Conduct systematic research across multiple sources:

<step n="3a" title="Industry Reports and Statistics">
<action>Search for latest industry reports, market size data, and growth projections</action>
Search queries to execute:
- "[market_category] market size [geographic_scope] [current_year]"
- "[market_category] industry report Gartner Forrester IDC McKinsey"
- "[market_category] market growth rate CAGR forecast"
- "[market_category] market trends [current_year]"

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</step>

<step n="3b" title="Regulatory and Government Data">
<action>Search government databases and regulatory sources</action>
Search for:
- Government statistics bureaus
- Industry associations
- Regulatory body reports
- Census and economic data
</step>

<step n="3c" title="News and Recent Developments">
<action>Gather recent news, funding announcements, and market events</action>
Search for articles from the last 6-12 months about:
- Major deals and acquisitions
- Funding rounds in the space
- New market entrants
- Regulatory changes
- Technology disruptions
</step>

<step n="3d" title="Academic and Research Papers">
<action>Search for academic research and white papers</action>
Look for peer-reviewed studies on:
- Market dynamics
- Technology adoption patterns
- Customer behavior research
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

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
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

<step n="6" goal="Competitive Intelligence" if="enable_competitor_analysis == true">
<action>Conduct comprehensive competitive analysis</action>

<step n="6a" title="Competitor Identification">
<action>Create comprehensive competitor list</action>

Search for and categorize:

1. **Direct Competitors** - Same solution, same market
2. **Indirect Competitors** - Different solution, same problem
3. **Potential Competitors** - Could enter market
4. **Substitute Products** - Alternative approaches

<ask>Do you have a specific list of competitors to analyze, or should I discover them through research?</ask>
</step>

<step n="6b" title="Competitor Deep Dive" repeat="5">
<action>For top 5 competitors, research and analyze</action>

Gather intelligence on:

- Company overview and history
- Product features and positioning
- Pricing strategy and models
- Target customer focus
- Recent news and developments
- Funding and financial health
- Team and leadership
- Customer reviews and sentiment

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
<template-output>competitor*analysis*{{competitor_number}}</template-output>
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

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
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

<step n="11" goal="Executive Summary Creation">
<action>Synthesize all findings into executive summary</action>

<critical>Write this AFTER all other sections are complete</critical>

Create compelling executive summary with:

**Market Opportunity:**

- TAM/SAM/SOM summary
- Growth trajectory

**Key Insights:**

- Top 3-5 findings
- Surprising discoveries
- Critical success factors

**Competitive Landscape:**

- Market structure
- Positioning opportunity

**Strategic Recommendations:**

- Priority actions
- Go-to-market approach
- Investment requirements

**Risk Summary:**

- Major risks
- Mitigation approach

<template-output>executive_summary</template-output>
</step>

<step n="12" goal="Report Compilation and Review">
<action>Compile full report and review with user</action>

<action>Generate the complete market research report using the template</action>
<action>Review all sections for completeness and consistency</action>
<action>Ensure all data sources are properly cited</action>

<ask>Would you like to review any specific sections before finalizing? Are there any additional analyses you'd like to include?</ask>

<goto step="9a" if="user requests changes">Return to refine opportunities</goto>

<template-output>final_report_ready</template-output>
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

<step n="14" goal="Update status file on completion">
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

<output>**✅ Research Complete ({{research_mode}} mode)**

**Research Report:**

- Research report generated and saved

**Status file updated:**

- Current step: research ({{research_mode}}) ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**

1. Review research findings
2. Share with stakeholders
3. Consider running:
   - `product-brief` or `game-brief` to formalize vision
   - `plan-project` if ready to create PRD/GDD

Check status anytime with: `workflow-status`
</output>
</check>

<check if="status file not found">
  <output>**✅ Research Complete ({{research_mode}} mode)**

**Research Report:**

- Research report generated and saved

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first.

**Next Steps:**

1. Review research findings
2. Run product-brief or plan-project workflows
   </output>
   </check>
   </step>

</workflow>
