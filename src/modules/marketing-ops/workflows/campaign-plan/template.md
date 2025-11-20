# {{campaign_name}} - Marketing Campaign Plan

**Campaign Type**: {{campaign_type}}
**Version**: 1.0
**Date**: {{date}}
**Prepared by**: {{author}}

---

## Executive Summary

[2-3 paragraph overview of campaign strategy, target audience, channel mix, and expected outcomes]

---

## 1. Campaign Overview

### 1.1 Campaign Basics

| Attribute | Details |
|-----------|---------|
| **Campaign Name** | {{campaign_name}} |
| **Campaign Type** | {{campaign_type}} |
| **Business Type** | {{business_type}} |
| **Duration** | {{start_date}} to {{end_date}} ({{duration_weeks}} weeks) |
| **Total Budget** | {{total_budget}} |
| **Primary Goal** | {{primary_goal}} |

### 1.2 Campaign Objectives

**Primary Objective**
{{primary_objective}}

**Secondary Objectives**
{{#each secondary_objectives}}
- {{objective}}
{{/each}}

### 1.3 Success Metrics

**Primary KPI**
- **Metric**: {{primary_kpi}}
- **Target**: {{primary_kpi_target}}
- **Minimum Acceptable**: {{primary_kpi_minimum}}

**Secondary KPIs**
| KPI | Current | Target | Minimum Acceptable |
|-----|---------|--------|-------------------|
{{#each secondary_kpis}}
| {{kpi_name}} | {{current}} | {{target}} | {{minimum}} |
{{/each}}

**Failure Condition**
{{failure_condition}}

---

## 2. Target Audience & Segmentation

### 2.1 Primary Audience Segments

{{#each audience_segments}}
#### Segment {{number}}: {{segment_name}}

**Demographics**
- Age: {{age_range}}
- Gender: {{gender}}
- Location: {{location}}
- Income: {{income_range}}
- Education: {{education}}

**Psychographics**
- Interests: {{interests}}
- Values: {{values}}
- Lifestyle: {{lifestyle}}
- Pain Points: {{pain_points}}

**Behavioral**
- Online Behavior: {{online_behavior}}
- Purchase Behavior: {{purchase_behavior}}
- Device Usage: {{device_usage}}
- Content Consumption: {{content_consumption}}

**Platform Targeting**
{{#each platform_targeting}}
- **{{platform}}**: {{targeting_criteria}}
{{/each}}

**Budget Allocation**: {{budget_percentage}}% ({{budget_amount}})
**Expected Performance**:
- Estimated Reach: {{estimated_reach}}
- Expected CAC: {{expected_cac}}
- Projected ROAS: {{projected_roas}}

---
{{/each}}

### 2.2 Audience Prioritization

| Segment | Priority | Budget % | Rationale |
|---------|----------|----------|-----------|
{{#each audience_priority}}
| {{segment}} | {{priority}} | {{budget_pct}} | {{rationale}} |
{{/each}}

---

## 3. Channel Strategy & Budget Allocation

### 3.1 Channel Mix

**Total Budget**: {{total_budget}}

{{#each channels}}
### {{channel_name}}

**Budget Allocation**: {{budget_percentage}}% ({{budget_amount}})
**Expected ROAS**: {{expected_roas}}
**Target CAC**: {{target_cac}}

**Platform Strengths for This Campaign**
{{platform_strengths}}

**Specific Tactics**
{{#each tactics}}
- **{{tactic_name}}**: {{tactic_description}}
{{/each}}

**Ad Formats**
{{#each ad_formats}}
- {{format}}: {{usage_strategy}}
{{/each}}

**Targeting Approach**
{{targeting_approach}}

**Bid Strategy**
{{bid_strategy}}

**Success Metrics**
{{#each success_metrics}}
- {{metric}}: {{target}}
{{/each}}

---
{{/each}}

### 3.2 Budget Allocation Summary

| Channel | Budget | % of Total | Expected ROAS | Expected Conversions |
|---------|--------|------------|---------------|---------------------|
{{#each budget_summary}}
| {{channel}} | {{budget}} | {{percentage}} | {{expected_roas}} | {{expected_conversions}} |
{{/each}}
| **Total** | **{{total_budget}}** | **100%** | **{{blended_roas}}** | **{{total_conversions}}** |

---

## 4. Creative Strategy & Assets

### 4.1 Creative Themes

**Primary Creative Theme**
{{primary_creative_theme}}

**Supporting Themes**
{{#each supporting_themes}}
- **{{theme_name}}**: {{theme_description}}
{{/each}}

### 4.2 Messaging Framework

**Primary Message**
{{primary_message}}

**Supporting Messages**
{{#each supporting_messages}}
{{number}}. {{message}}
{{/each}}

**Call-to-Action (CTA)**
- Primary CTA: {{primary_cta}}
- Secondary CTA: {{secondary_cta}}

### 4.3 Visual Direction

**Visual Style**
{{visual_style}}

**Color Palette**
{{color_palette}}

**Brand Alignment**
{{brand_alignment}}

**Reference Examples**
{{reference_examples}}

### 4.4 Required Creative Assets

{{#each creative_assets}}
#### {{platform}}

**Images**
{{#each images}}
- {{specification}}: {{quantity}} variations
{{/each}}

**Videos**
{{#each videos}}
- {{length}}: {{quantity}} variations - {{content_description}}
{{/each}}

**Copy**
{{#each copy}}
- {{type}}: {{character_limit}} chars - {{quantity}} variations
{{/each}}

---
{{/each}}

### 4.5 A/B Testing Plan

{{#each ab_tests}}
**Test {{number}}: {{test_name}}**
- **Element**: {{element_being_tested}}
- **Variations**: {{variations}}
- **Success Metric**: {{success_metric}}
- **Sample Size Required**: {{sample_size}}
- **Duration**: {{duration}}
{{/each}}

---

## 5. Implementation Plan & Timeline

### 5.1 Pre-Launch Phase ({{pre_launch_duration}})

**Week -4 to -3: Setup & Planning**
{{#each pre_launch_setup}}
- [ ] {{task}} (Owner: {{owner}}, Due: {{due_date}})
{{/each}}

**Week -2 to -1: Creative Production & QA**
{{#each pre_launch_production}}
- [ ] {{task}} (Owner: {{owner}}, Due: {{due_date}})
{{/each}}

**Launch Readiness Checklist**
{{#each launch_checklist}}
- [ ] {{item}}
{{/each}}

### 5.2 Launch Phase (Week 1)

**Day 1-2: Campaign Activation**
{{#each launch_day_1_2}}
- [ ] {{task}} (Owner: {{owner}})
{{/each}}

**Day 3-7: Close Monitoring & Rapid Iteration**
{{#each launch_day_3_7}}
- [ ] {{task}} (Owner: {{owner}})
{{/each}}

### 5.3 Optimization Phase (Week 2+)

**Daily Actions**
{{#each daily_actions}}
- {{action}}
{{/each}}

**Weekly Actions**
{{#each weekly_actions}}
- {{action}}
{{/each}}

**Optimization Triggers**
| Condition | Action |
|-----------|--------|
{{#each optimization_triggers}}
| {{condition}} | {{action}} |
{{/each}}

### 5.4 Timeline Gantt

```
{{timeline_gantt}}
```

---

## 6. Measurement & Optimization Plan

### 6.1 Conversion Tracking Setup

**Tracking Implementation**
{{#each tracking_implementation}}
- **{{platform}}**: {{tracking_method}}
  - Events: {{events}}
  - Values: {{values}}
{{/each}}

**Tracking Validation**
{{tracking_validation_plan}}

### 6.2 Attribution Model

**Primary Attribution**: {{primary_attribution_model}}
**Rationale**: {{attribution_rationale}}

**Secondary Attribution Views**
{{#each secondary_attribution}}
- {{model}}: {{use_case}}
{{/each}}

**Attribution Window**
- Click-through: {{click_attribution_window}}
- View-through: {{view_attribution_window}}

### 6.3 Reporting & Dashboards

**Real-Time Dashboard Metrics**
{{#each realtime_metrics}}
- {{metric}}
{{/each}}

**Daily Snapshot Metrics**
{{#each daily_metrics}}
- {{metric}}
{{/each}}

**Weekly Review Metrics**
{{#each weekly_metrics}}
- {{metric}}
{{/each}}

**Reporting Cadence**
| Report Type | Frequency | Audience | Contents |
|-------------|-----------|----------|----------|
{{#each reports}}
| {{report_type}} | {{frequency}} | {{audience}} | {{contents}} |
{{/each}}

### 6.4 Optimization Framework

**Performance Thresholds**
| Metric | Excellent | Good | Acceptable | Poor | Action Required |
|--------|-----------|------|------------|------|-----------------|
{{#each performance_thresholds}}
| {{metric}} | {{excellent}} | {{good}} | {{acceptable}} | {{poor}} | {{action}} |
{{/each}}

**Budget Reallocation Rules**
{{#each reallocation_rules}}
- **{{rule_name}}**: {{rule_description}}
{{/each}}

---

## 7. Risk Management

### 7.1 Identified Risks

{{#each risks}}
**Risk {{number}}: {{risk_name}}**
- **Likelihood**: {{likelihood}}
- **Impact**: {{impact}}
- **Mitigation**: {{mitigation_strategy}}
{{/each}}

### 7.2 Contingency Plans

{{#each contingencies}}
**Scenario**: {{scenario}}
**Contingency Plan**: {{plan}}
**Budget Reserve**: {{budget_reserve}}
{{/each}}

---

## 8. Budget Summary & ROI Projections

### 8.1 Budget Breakdown

| Category | Amount | % of Total |
|----------|--------|------------|
| **Media Spend** | | |
{{#each media_budget}}
| {{channel}} | {{amount}} | {{percentage}} |
{{/each}}
| **Creative Production** | {{creative_budget}} | {{creative_percentage}} |
| **Tools & Technology** | {{tools_budget}} | {{tools_percentage}} |
| **Agency/Freelance Fees** | {{agency_budget}} | {{agency_percentage}} |
| **Testing/Reserve** | {{testing_budget}} | {{testing_percentage}} |
| **Total Campaign Budget** | **{{total_campaign_budget}}** | **100%** |

### 8.2 ROI Projections

**Conservative Scenario**
- Projected Revenue: {{conservative_revenue}}
- ROAS: {{conservative_roas}}
- Total Conversions: {{conservative_conversions}}

**Expected Scenario**
- Projected Revenue: {{expected_revenue}}
- ROAS: {{expected_roas}}
- Total Conversions: {{expected_conversions}}

**Optimistic Scenario**
- Projected Revenue: {{optimistic_revenue}}
- ROAS: {{optimistic_roas}}
- Total Conversions: {{optimistic_conversions}}

---

## Appendices

### A. Detailed Targeting Parameters
{{detailed_targeting}}

### B. Creative Briefs
{{creative_briefs}}

### C. Landing Page Requirements
{{landing_page_requirements}}

### D. Competitor Campaign Analysis
{{competitor_analysis}}

### E. Historical Performance Data
{{historical_performance}}

---

**Document Status**: {{status}}
**Next Review Date**: {{next_review_date}}
**Approvers**: {{approvers}}
