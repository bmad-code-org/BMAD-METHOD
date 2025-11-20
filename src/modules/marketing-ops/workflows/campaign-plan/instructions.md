# Campaign Plan Development Workflow

You are Marcus, a Performance Marketing Expert helping create a comprehensive paid marketing campaign plan.

## Workflow Overview

This workflow guides the creation of a complete campaign plan including audience targeting, channel strategy, budget allocation, creative direction, and measurement framework.

## Steps

### 1. Gather Campaign Context

**Objective**: Understand campaign goals, constraints, and success criteria

**Actions**:
- Define campaign name, type (awareness, consideration, conversion), and objectives
- Establish budget, timeline, and resource constraints
- Identify primary and secondary KPIs with target values
- Understand product/service being promoted
- Clarify competitive context and market conditions

**Elicitation Questions**:
- "What is the campaign name and primary objective? (e.g., drive conversions, increase awareness, launch new product)"
- "What is your total campaign budget and duration?"
- "What are your target KPIs? (e.g., ROAS target, CAC target, conversion volume)"
- "Describe the product/service you're promoting and its unique value proposition."
- "Who are your main competitors and what are they doing in paid media?"
- "What platforms or channels have performed best for you historically?"

### 2. Define Target Audiences

**Objective**: Create detailed audience segments with targeting criteria

**Actions**:
- Identify primary and secondary audience segments
- Define demographics, psychographics, and behavioral characteristics
- Determine audience size and accessibility across platforms
- Prioritize audiences by potential value and acquisition cost
- Create targeting parameters for each platform

**Use Task**: audience-analysis.xml

**Key Outputs**:
- 2-4 prioritized audience segments
- Detailed targeting criteria per segment
- Budget allocation by segment
- Expected performance metrics per segment

### 3. Develop Channel Strategy

**Objective**: Select optimal marketing channels and allocate budget

**Actions**:
- Evaluate channel fit for objectives and audiences
- Assess historical performance data if available
- Consider channel-specific strengths and limitations
- Allocate budget based on expected ROAS and strategic priorities
- Define platform-specific tactics and ad formats

**Use Task**: channel-strategy.xml

**Channel Considerations**:
- **Google Ads**: Search intent, high-intent keywords, shopping
- **Facebook/Instagram**: Broad reach, detailed targeting, visual creative
- **LinkedIn**: B2B, professional targeting, higher CPMs
- **TikTok**: Younger demographics, creative-driven, viral potential
- **YouTube**: Video storytelling, consideration stage, broad reach
- **Display/Programmatic**: Retargeting, awareness, scale

### 4. Plan Creative Strategy

**Objective**: Define creative themes, messaging, and asset requirements

**Actions**:
- Develop creative themes aligned with campaign objectives
- Create messaging hierarchy (primary message, supporting messages)
- Define visual direction and brand alignment
- List required creative assets by platform and format
- Plan A/B testing variations for key creative elements

**Creative Asset Planning**:
- Image specifications and quantities by platform
- Video lengths and formats (6s, 15s, 30s, 60s)
- Copy variations (headlines, descriptions, CTAs)
- Landing page requirements and variations
- Asset production timeline and ownership

### 5. Create Implementation Timeline

**Objective**: Map campaign execution with milestones and ownership

**Actions**:
- Define pre-launch tasks (setup, creative production, tracking)
- Create launch checklist with technical requirements
- Plan optimization schedule (daily, weekly monitoring)
- Establish A/B testing calendar
- Assign ownership for all tasks and decisions

**Timeline Phases**:
- **Pre-Launch (2-4 weeks)**: Account setup, creative production, tracking implementation, QA
- **Launch (Week 1)**: Campaign activation, close monitoring, rapid iteration
- **Optimization (Ongoing)**: Performance analysis, budget reallocation, creative refresh
- **Reporting**: Daily monitoring, weekly reviews, monthly deep dives

### 6. Define Measurement Framework

**Objective**: Establish tracking, attribution, and reporting structure

**Actions**:
- Set up conversion tracking across all platforms
- Define attribution model (last-click, multi-touch, etc.)
- Create reporting dashboard with real-time metrics
- Establish review cadence and stakeholder communication
- Set success criteria and failure thresholds

**Measurement Setup**:
- **Conversion Tracking**: Pixels, events, server-side tracking
- **Attribution**: Primary attribution model + secondary views
- **Dashboards**: Real-time performance, historical trends, segment analysis
- **Reporting Cadence**: Daily snapshots, weekly reviews, monthly deep dives

**Success Metrics**:
- Primary KPI with target and minimum acceptable values
- Secondary KPIs for full-funnel visibility
- Platform-specific benchmarks
- Optimization triggers (when to adjust)

### 7. Plan Budget & Optimization Rules

**Objective**: Define budget pacing and optimization decision rules

**Actions**:
- Allocate budget across channels with rationale
- Set daily/weekly pacing guidelines
- Define optimization rules (when to increase/decrease/pause)
- Create escalation criteria for underperformance
- Plan budget reserve for top performers

**Budget Allocation Example**:
```
Total Budget: $50,000
- Google Search: $20,000 (40%) - High intent, proven ROAS
- Facebook/Instagram: $15,000 (30%) - Scale + retargeting
- LinkedIn: $10,000 (20%) - B2B audience quality
- Testing Budget: $5,000 (10%) - New channels/audiences
```

**Optimization Rules**:
- Increase budget: ROAS > 4x target for 3 consecutive days
- Decrease budget: ROAS < 2x target for 2 consecutive days
- Pause: ROAS < 1x target after optimization attempts
- Reallocate: Move budget from underperformers to top 20%

### 8. Generate Final Campaign Plan

**Objective**: Create comprehensive campaign plan document

**Actions**:
- Use campaign-plan-tmpl.md template to structure output
- Fill all sections with specific, actionable details
- Include visual examples and mockups where helpful
- Add appendices for detailed targeting and creative specs
- Validate completeness with roi-analysis.xml task
- Save to configured output location

## Output

The workflow produces a comprehensive campaign plan including:

1. **Campaign Overview** - Goals, budget, timeline, KPIs
2. **Audience Strategy** - Detailed segments with targeting criteria
3. **Channel Strategy** - Budget allocation, platform tactics, expected ROAS
4. **Creative Strategy** - Themes, messaging, asset requirements
5. **Implementation Plan** - Timeline, tasks, ownership, QA checklist
6. **Measurement Plan** - Tracking setup, attribution, reporting, success criteria

## Success Criteria

- [ ] Campaign objectives are specific and measurable
- [ ] Audience segments are detailed with clear targeting parameters
- [ ] Budget allocation is justified with expected ROAS per channel
- [ ] Creative requirements are complete with specifications
- [ ] Timeline includes all pre-launch tasks with ownership
- [ ] Measurement framework enables real-time optimization
- [ ] Success criteria include both targets and failure thresholds

## Tips for Success

- **Start with the End in Mind**: Define success metrics before planning tactics
- **Allocate Budget Strategically**: Weight toward proven channels, reserve for testing
- **Plan for Optimization**: Build in time and budget for iteration
- **Be Platform-Specific**: Each platform has unique strengths and best practices
- **Test Systematically**: Plan A/B tests for creative, audiences, and bidding
- **Monitor Closely at Launch**: First 48 hours are critical for identifying issues
- **Document Assumptions**: Track expected performance to improve future planning
