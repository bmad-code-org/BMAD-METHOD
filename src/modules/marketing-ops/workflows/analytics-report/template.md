# Marketing Analytics Report: {{report_period}}

**Report Date**: {{date}}
**Reporting Period**: {{reporting_period}}
**Comparison Period**: {{comparison_period}}
**Prepared by**: {{author}}

---

## Executive Summary

### Key Highlights

{{executive_summary_highlights}}

### Overall Performance

{{#each overall_metrics}}
- **{{metric_name}}**: {{current_value}} ({{change_vs_previous}} vs {{comparison_period}})
{{/each}}

### Top 3 Insights

1. **{{insight_1_title}}**: {{insight_1_summary}}
2. **{{insight_2_title}}**: {{insight_2_summary}}
3. **{{insight_3_title}}**: {{insight_3_summary}}

### Priority Recommendations

1. **{{recommendation_1}}** - Expected Impact: {{impact_1}}
2. **{{recommendation_2}}** - Expected Impact: {{impact_2}}
3. **{{recommendation_3}}** - Expected Impact: {{impact_3}}

---

## 1. Performance Dashboard

### 1.1 Key Metrics Scorecard

| Metric | Current Period | Previous Period | Change | Target | Status |
|--------|----------------|-----------------|--------|--------|--------|
{{#each key_metrics}}
| {{metric}} | {{current}} | {{previous}} | {{change}} | {{target}} | {{status_icon}} |
{{/each}}

**Status Legend**: ✅ On Target | ⚠️ Needs Attention | ❌ Below Target

### 1.2 Performance Trends

**{{primary_kpi}} Over Time**
```
{{primary_kpi_trend_chart}}
```

**Traffic & Engagement Trends**
```
{{traffic_trends_chart}}
```

**Conversion Funnel Performance**
```
{{funnel_performance_chart}}
```

---

## 2. Channel Performance Analysis

### 2.1 Channel Overview

| Channel | Traffic | Conversions | Revenue | CAC | ROAS | vs Previous |
|---------|---------|-------------|---------|-----|------|-------------|
{{#each channels}}
| {{channel_name}} | {{traffic}} | {{conversions}} | {{revenue}} | {{cac}} | {{roas}} | {{change}} |
{{/each}}
| **Total** | **{{total_traffic}}** | **{{total_conversions}}** | **{{total_revenue}}** | **{{avg_cac}}** | **{{blended_roas}}** | |

### 2.2 Channel Deep Dives

{{#each channel_deep_dives}}
#### {{channel_name}}

**Performance Summary**
{{performance_summary}}

**Key Metrics**
- Traffic: {{traffic}} ({{traffic_change}})
- Conversion Rate: {{conversion_rate}} ({{cr_change}})
- CAC: {{cac}} ({{cac_change}})
- ROAS: {{roas}} ({{roas_change}})
- Revenue Contribution: {{revenue_percentage}}

**Top Performing Campaigns**
| Campaign | Impressions | Clicks | Conversions | ROAS |
|----------|-------------|--------|-------------|------|
{{#each top_campaigns}}
| {{campaign}} | {{impressions}} | {{clicks}} | {{conversions}} | {{roas}} |
{{/each}}

**Insights**
{{channel_insights}}

**Recommendations**
{{channel_recommendations}}

---
{{/each}}

---

## 3. Conversion Funnel Analysis

### 3.1 Full Funnel Overview

```
{{funnel_visualization}}

Awareness → Consideration → Conversion → Retention
{{awareness_count}} → {{consideration_count}} → {{conversion_count}} → {{retention_count}}
```

### 3.2 Conversion Rates by Stage

| Funnel Stage | Users | Conversion to Next Stage | Drop-off | Notes |
|--------------|-------|-------------------------|----------|-------|
{{#each funnel_stages}}
| {{stage}} | {{users}} | {{conversion_rate}} | {{dropoff_rate}} | {{notes}} |
{{/each}}

### 3.3 Funnel Insights

**Biggest Drop-off Points**
{{#each dropoff_points}}
{{number}}. **{{stage_name}}**: {{dropoff_rate}} drop-off
   - **Why**: {{hypothesis}}
   - **Action**: {{recommended_action}}
{{/each}}

**Funnel Improvements vs Previous Period**
{{funnel_improvements}}

---

## 4. Audience & Segmentation Analysis

### 4.1 Audience Overview

**Total Users**: {{total_users}} ({{user_growth}})
**New vs Returning**: {{new_percentage}}% new, {{returning_percentage}}% returning

**Demographics**
| Dimension | Top Segment | % of Total | Conversion Rate |
|-----------|-------------|------------|----------------|
| Age | {{top_age_group}} | {{age_percentage}} | {{age_cr}} |
| Gender | {{top_gender}} | {{gender_percentage}} | {{gender_cr}} |
| Location | {{top_location}} | {{location_percentage}} | {{location_cr}} |
| Device | {{top_device}} | {{device_percentage}} | {{device_cr}} |

### 4.2 High-Value Segments

{{#each high_value_segments}}
#### {{segment_name}}

**Characteristics**
{{segment_characteristics}}

**Performance**
- Users: {{users}} ({{percentage_of_total}}% of total)
- Conversion Rate: {{conversion_rate}}
- Average Order Value: {{aov}}
- LTV: {{ltv}}
- Revenue Contribution: {{revenue_percentage}}%

**Acquisition Channels**
{{primary_channels}}

**Engagement Patterns**
{{engagement_patterns}}

**Growth Opportunity**
{{growth_opportunity}}

---
{{/each}}

### 4.3 Cohort Analysis

**Retention by Acquisition Month**
| Cohort | Month 0 | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|---------|---------|----------|
{{#each cohorts}}
| {{cohort_month}} | 100% | {{month_1}} | {{month_2}} | {{month_3}} | {{month_6}} | {{month_12}} |
{{/each}}

**Cohort Insights**
{{cohort_insights}}

---

## 5. Campaign Performance

### 5.1 Active Campaigns Summary

{{#each campaigns}}
#### {{campaign_name}}

| Metric | Value | vs Target |
|--------|-------|-----------|
| Budget | {{budget_spent}} / {{budget_total}} ({{budget_percentage}}%) | {{vs_budget}} |
| Impressions | {{impressions}} | {{vs_impression_target}} |
| Clicks | {{clicks}} | {{vs_click_target}} |
| CTR | {{ctr}} | {{vs_ctr_target}} |
| Conversions | {{conversions}} | {{vs_conversion_target}} |
| CPA | {{cpa}} | {{vs_cpa_target}} |
| ROAS | {{roas}} | {{vs_roas_target}} |

**Status**: {{campaign_status}}
**Key Insights**: {{campaign_insights}}
**Optimization Actions**: {{optimization_actions}}

---
{{/each}}

### 5.2 Campaign Comparison

| Campaign | Budget | ROAS | CPA | Conversions | Status |
|----------|--------|------|-----|-------------|--------|
{{#each campaign_comparison}}
| {{campaign}} | {{budget}} | {{roas}} | {{cpa}} | {{conversions}} | {{status}} |
{{/each}}

---

## 6. Revenue & ROI Analysis

### 6.1 Revenue Performance

**Total Revenue**: {{total_revenue}} ({{revenue_growth}} vs {{comparison_period}})

**Revenue by Source**
| Source | Revenue | % of Total | Growth | ROAS |
|--------|---------|------------|--------|------|
{{#each revenue_sources}}
| {{source}} | {{revenue}} | {{percentage}} | {{growth}} | {{roas}} |
{{/each}}

**Revenue Trends**
```
{{revenue_trend_chart}}
```

### 6.2 ROI Analysis

**Marketing Investment**: {{total_marketing_spend}}
**Total Revenue**: {{total_revenue}}
**Blended ROAS**: {{blended_roas}}
**Net Profit**: {{net_profit}}
**ROI**: {{roi}}%

**ROI by Channel**
| Channel | Spend | Revenue | ROAS | ROI % |
|---------|-------|---------|------|-------|
{{#each channel_roi}}
| {{channel}} | {{spend}} | {{revenue}} | {{roas}} | {{roi}} |
{{/each}}

### 6.3 Customer Economics

- **Average Order Value (AOV)**: {{aov}} ({{aov_change}})
- **Customer Acquisition Cost (CAC)**: {{cac}} ({{cac_change}})
- **Lifetime Value (LTV)**: {{ltv}} ({{ltv_change}})
- **LTV:CAC Ratio**: {{ltv_cac_ratio}} (Target: 3:1 minimum)
- **Payback Period**: {{payback_period}} months

---

## 7. Key Insights & Findings

{{#each insights}}
### Insight {{number}}: {{insight_title}}

**What Happened**
{{what_happened}}

**Why It Matters**
{{why_it_matters}}

**What's Driving It**
{{whats_driving_it}}

**Supporting Data**
{{supporting_data}}

---
{{/each}}

---

## 8. Recommendations & Action Plan

{{#each recommendations}}
### {{priority}} Priority: {{recommendation_title}}

**Recommendation**
{{recommendation_description}}

**Rationale**
{{rationale}}

**Expected Impact**
{{expected_impact}}

**Implementation Plan**
{{#each implementation_steps}}
{{step_number}}. {{step_description}} (Owner: {{owner}}, Timeline: {{timeline}})
{{/each}}

**Success Metrics**
{{success_metrics}}

**Resource Requirements**
- Budget: {{budget_required}}
- Team: {{team_required}}
- Timeline: {{timeline}}

**Priority Justification**
{{priority_justification}}

---
{{/each}}

### Recommendation Summary

| Priority | Recommendation | Expected Impact | Timeline | Owner |
|----------|----------------|-----------------|----------|-------|
{{#each recommendation_summary}}
| {{priority}} | {{recommendation}} | {{impact}} | {{timeline}} | {{owner}} |
{{/each}}

---

## 9. Competitive Context

### 9.1 Market Benchmarks

| Metric | Our Performance | Industry Average | Best in Class | Gap |
|--------|-----------------|------------------|---------------|-----|
{{#each benchmarks}}
| {{metric}} | {{our_performance}} | {{industry_avg}} | {{best_in_class}} | {{gap}} |
{{/each}}

### 9.2 Competitive Intelligence

{{competitive_intelligence_summary}}

---

## 10. Next Steps & Timeline

### Immediate Actions (This Week)
{{#each immediate_actions}}
- [ ] {{action}} (Owner: {{owner}})
{{/each}}

### Short-term Actions (This Month)
{{#each short_term_actions}}
- [ ] {{action}} (Owner: {{owner}})
{{/each}}

### Long-term Initiatives (This Quarter)
{{#each long_term_actions}}
- [ ] {{action}} (Owner: {{owner}})
{{/each}}

---

## Appendices

### A. Methodology & Data Sources

**Data Sources**
{{data_sources}}

**Calculation Methods**
{{calculation_methods}}

**Data Quality Notes**
{{data_quality_notes}}

### B. Detailed Data Tables

{{detailed_data_tables}}

### C. Glossary of Terms

{{glossary}}

### D. Additional Charts & Visualizations

{{additional_visualizations}}

---

**Report Status**: {{report_status}}
**Next Report Date**: {{next_report_date}}
**Questions or Feedback**: {{contact_info}}
