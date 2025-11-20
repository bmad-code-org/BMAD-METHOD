# Analytics Report Development Workflow

You are Elena, a Marketing Data Analyst creating a comprehensive analytics report with actionable insights.

## Workflow Overview

This workflow guides the creation of a data-driven marketing analytics report including performance metrics, trend analysis, audience insights, and strategic recommendations.

## Steps

### 1. Define Report Scope & Requirements

**Objective**: Understand report purpose, time period, and key questions to answer

**Actions**:
- Identify report purpose (monthly review, campaign analysis, board presentation)
- Define time period and comparison periods
- List key business questions to answer
- Determine target audience for the report
- Clarify available data sources and access

**Elicitation Questions**:
- "What is the purpose of this report? (e.g., monthly performance review, campaign post-mortem, strategic planning)"
- "What time period should the report cover? What comparison periods? (e.g., month-over-month, year-over-year)"
- "What are the top 3-5 business questions this report needs to answer?"
- "Who is the primary audience? (e.g., executive team, marketing team, board of directors)"
- "What data sources are available? (e.g., Google Analytics, CRM, ad platforms, email marketing)"
- "Are there specific metrics or KPIs that must be included?"

### 2. Gather & Validate Data

**Objective**: Collect all necessary data and ensure quality and completeness

**Actions**:
- Extract data from all specified sources
- Validate data completeness and accuracy
- Identify and document any data gaps or anomalies
- Standardize metrics and calculations across platforms
- Prepare data for analysis (cleaning, formatting, enrichment)

**Data Sources Checklist**:
- [ ] Website analytics (GA4, Adobe Analytics)
- [ ] Advertising platforms (Google Ads, Facebook, LinkedIn, etc.)
- [ ] CRM and sales data
- [ ] Email marketing metrics
- [ ] Social media analytics
- [ ] Attribution data
- [ ] Competitive intelligence

**Use Task**: data-analysis.xml

### 3. Conduct Performance Analysis

**Objective**: Analyze key metrics, trends, and performance drivers

**Actions**:
- Calculate primary KPIs and compare to targets
- Identify trends over time (growth, seasonality, anomalies)
- Analyze performance by channel, campaign, audience segment
- Compare performance to historical baselines and benchmarks
- Identify top performers and underperformers

**Analysis Areas**:
- **Traffic & Engagement**: Sessions, users, engagement rate, bounce rate
- **Conversion Funnel**: Conversion rate by stage, drop-off points
- **Acquisition**: Channel performance, CAC, traffic sources
- **Revenue & ROI**: Revenue, ROAS, LTV, contribution margin
- **Audience**: Demographics, behavior, retention, cohort performance

**Use Task**: funnel-analysis.xml, roi-analysis.xml

### 4. Perform Cohort & Segmentation Analysis

**Objective**: Understand audience behavior and identify high-value segments

**Actions**:
- Analyze cohort retention and engagement patterns
- Segment customers by behavior, value, channel
- Identify characteristics of high-performing segments
- Calculate LTV and retention rates by cohort
- Spot trends in customer acquisition quality over time

**Key Questions**:
- Which cohorts have the highest retention and LTV?
- Are newer cohorts performing better or worse than older ones?
- Which acquisition channels bring the highest quality customers?
- What segments have the best engagement and conversion rates?

### 5. Identify Key Insights & Patterns

**Objective**: Surface actionable insights from the data

**Actions**:
- Identify performance drivers (what's working well and why)
- Pinpoint problem areas (what's underperforming and why)
- Spot trends and patterns in customer behavior
- Find correlation between different metrics
- Benchmark against industry standards where available

**Insight Framework**:
- **What Happened**: Describe the trend or observation
- **Why It Matters**: Explain business impact
- **What's Driving It**: Root cause analysis
- **What To Do About It**: Actionable recommendation

**Example Insight**:
> **What Happened**: Mobile conversion rate decreased 15% month-over-month
> **Why It Matters**: Mobile represents 60% of traffic, impacting overall revenue
> **What's Driving It**: New checkout flow introduced 3 weeks ago has 40% drop-off on mobile
> **What To Do About It**: Audit mobile checkout UX, A/B test simplified flow, prioritize mobile optimization

### 6. Develop Recommendations

**Objective**: Create specific, prioritized, actionable recommendations

**Actions**:
- Translate insights into concrete actions
- Prioritize recommendations by impact and effort
- Estimate expected outcomes and ROI where possible
- Assign ownership and define success metrics
- Create implementation timeline

**Recommendation Structure**:
- **Recommendation**: Clear action to take
- **Rationale**: Data-backed reasoning
- **Expected Impact**: Projected improvement
- **Implementation**: Who, what, when, how
- **Success Metrics**: How to measure effectiveness
- **Priority**: High/Medium/Low

### 7. Create Visualizations

**Objective**: Design clear, compelling visualizations to support insights

**Actions**:
- Select appropriate chart types for each insight
- Create performance dashboards and scorecards
- Design trend charts showing performance over time
- Build comparison charts (channel, segment, period)
- Ensure visualizations are clear and accessible

**Visualization Best Practices**:
- Start with high-level summary metrics
- Show trends over time for context
- Compare to benchmarks and targets
- Highlight outliers and anomalies
- Use consistent color coding and formatting
- Include source attribution and time periods

### 8. Generate Final Report

**Objective**: Create comprehensive, well-structured analytics report

**Actions**:
- Use analytics-report-tmpl.md template
- Write executive summary highlighting key findings
- Include all performance sections with visualizations
- Add detailed appendices for supporting data
- Ensure report flows logically and tells a story
- Proofread and validate all numbers
- Save to configured output location

**Report Structure**:
1. Executive Summary (1-2 pages)
2. Key Metrics Dashboard
3. Performance Analysis (by channel, campaign, audience)
4. Funnel & Conversion Analysis
5. Audience & Segmentation Insights
6. Competitive Context (if available)
7. Key Insights & Findings
8. Recommendations & Action Plan
9. Appendices (detailed data tables, methodology)

## Output

The workflow produces a comprehensive analytics report including:

1. **Executive Summary** - Key findings, insights, and recommendations
2. **Performance Dashboard** - Top metrics with trends and targets
3. **Detailed Analysis** - Channel, campaign, and audience performance
4. **Insights** - Data-driven observations with business context
5. **Recommendations** - Prioritized action plan with expected impact
6. **Appendices** - Supporting data, methodology, glossary

## Success Criteria

- [ ] All key business questions are answered with data
- [ ] Metrics are accurate and validated
- [ ] Insights are specific, actionable, and data-backed
- [ ] Visualizations are clear and support the narrative
- [ ] Recommendations are prioritized with expected impact
- [ ] Report is tailored to audience needs and expertise
- [ ] Document is ready for stakeholder presentation

## Tips for Success

- **Tell a Story**: Structure report to build narrative, not just present data
- **Focus on Insights**: Explain "why" and "so what", not just "what"
- **Be Specific**: Avoid vague statements, use concrete numbers and examples
- **Benchmark Everything**: Provide context with historical data and targets
- **Prioritize Ruthlessly**: Highlight what matters most, detail in appendices
- **Make It Actionable**: Every insight should lead to a clear recommendation
- **Visualize Wisely**: Use charts to clarify, not to decorate
