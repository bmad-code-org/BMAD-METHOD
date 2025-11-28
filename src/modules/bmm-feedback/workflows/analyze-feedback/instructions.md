# Analyze Feedback Instructions

## Objective
Analyze feedback items to determine sentiment, categorize by theme, identify patterns, and generate actionable insights.

## Prerequisites
- Feedback items collected (via `*collect`)
- Category definitions in config

---

<step n="1" goal="Select feedback to analyze">

### Select Analysis Scope

<action>Load unanalyzed feedback from state</action>

**Unanalyzed Feedback:** {{unanalyzed_count}} items

<ask>What would you like to analyze?
[u] All unanalyzed feedback ({{unanalyzed_count}} items)
[r] Re-analyze all feedback
[s] Select specific items
[d] Date range

Choice: </ask>

<action>Store as {{analysis_scope}}</action>
<action>Load feedback items based on selection</action>

**Selected for Analysis:** {{selected_count}} items

</step>

---

<step n="2" goal="Perform sentiment analysis">

### Sentiment Analysis

<action>For each feedback item, calculate sentiment score</action>
<action>Score range: -1 (very negative) to +1 (very positive)</action>

**Sentiment Distribution:**

```
Very Negative [-1.0 to -0.5]: ████████ {{very_negative_count}}
Negative      [-0.5 to -0.1]: ██████ {{negative_count}}
Neutral       [-0.1 to +0.1]: ████ {{neutral_count}}
Positive      [+0.1 to +0.5]: ██████████ {{positive_count}}
Very Positive [+0.5 to +1.0]: ████████████ {{very_positive_count}}
```

**Average Sentiment:** {{average_sentiment}}
**Sentiment Trend:** {{sentiment_trend}}

<check if="average_sentiment < config.sentiment.negative_threshold">
**ALERT: Negative sentiment spike detected!**
<publish event="feedback.sentiment.alert">
  <payload>
    <alert_type>negative_spike</alert_type>
    <current_sentiment>{{average_sentiment}}</current_sentiment>
    <previous_sentiment>{{previous_average}}</previous_sentiment>
    <change_percent>{{sentiment_change}}</change_percent>
    <sample_feedback>{{negative_samples}}</sample_feedback>
  </payload>
</publish>
</check>

</step>

---

<step n="3" goal="Categorize feedback">

### Category Classification

<action>Match feedback content against category keywords</action>
<action>Assign primary and secondary categories</action>
<action>Calculate category confidence scores</action>

**Category Distribution:**

| Category | Count | % | Avg Sentiment |
|----------|-------|---|---------------|
{{#each categories}}
| {{name}} | {{count}} | {{percent}}% | {{avg_sentiment}} |
{{/each}}

**Top Categories:**
1. {{top_category_1.name}}: {{top_category_1.count}} items
2. {{top_category_2.name}}: {{top_category_2.count}} items
3. {{top_category_3.name}}: {{top_category_3.count}} items

</step>

---

<step n="4" goal="Extract themes">

### Theme Extraction

<action>Identify common themes and topics</action>
<action>Group related feedback by theme</action>
<action>Rank themes by frequency and impact</action>

**Emerging Themes:**

{{#each themes}}
### {{rank}}. {{name}}
- **Mentions:** {{count}}
- **Sentiment:** {{sentiment}}
- **Sample Quotes:**
  {{#each sample_quotes}}
  > "{{quote}}" - {{source}}
  {{/each}}

{{/each}}

</step>

---

<step n="5" goal="Link to stories/features">

### Story Linking

<action>Load story keywords and feature tags</action>
<action>Match feedback to existing stories</action>
<action>Identify feedback without story matches</action>

**Linked to Stories:**

| Feedback ID | Story ID | Confidence |
|-------------|----------|------------|
{{#each linked_feedback}}
| {{feedback_id}} | {{story_id}} | {{confidence}}% |
{{/each}}

**Unlinked Feedback:** {{unlinked_count}} items
(May represent new feature requests or unknown issues)

</step>

---

<step n="6" goal="Generate insights">

### Insight Generation

<action>Identify patterns that exceed threshold</action>
<action>Generate actionable insights</action>

<check if="pattern_count >= config.analysis.insight_threshold">
{{#each insights}}
**Insight: {{title}}**

- **Type:** {{type}}
- **Feedback Count:** {{feedback_count}}
- **Impact Score:** {{impact_score}}
- **Description:** {{description}}
- **Suggested Action:** {{suggested_action}}

<publish event="feedback.insight.generated">
  <payload>
    <insight_id>{{id}}</insight_id>
    <type>{{type}}</type>
    <title>{{title}}</title>
    <description>{{description}}</description>
    <feedback_count>{{feedback_count}}</feedback_count>
    <feedback_ids>{{feedback_ids}}</feedback_ids>
    <suggested_action>{{suggested_action}}</suggested_action>
    <priority_impact>{{priority_impact}}</priority_impact>
  </payload>
</publish>
{{/each}}
</check>

</step>

---

<step n="7" goal="Check priority suggestions">

### Priority Impact Analysis

<action>Evaluate if any insights should trigger priority changes</action>
<action>Calculate priority scores based on feedback volume and sentiment</action>

<check if="high_impact_feedback_detected">
{{#each priority_suggestions}}
**Priority Suggestion:**
- **Story/Feature:** {{target}}
- **Current Priority:** {{current_priority}}
- **Suggested Priority:** {{suggested_priority}}
- **Reason:** {{reason}}
- **Supporting Feedback:** {{feedback_count}} items

<check if="config.priority_influence.auto_publish == true">
<publish event="feedback.priority.suggested">
  <payload>
    <suggestion_id>{{id}}</suggestion_id>
    <story_id>{{story_id}}</story_id>
    <current_priority>{{current_priority}}</current_priority>
    <suggested_priority>{{suggested_priority}}</suggested_priority>
    <reason>{{reason}}</reason>
    <feedback_count>{{feedback_count}}</feedback_count>
    <customer_impact>{{customer_impact}}</customer_impact>
    <sample_feedback>{{sample_feedback}}</sample_feedback>
  </payload>
</publish>
</check>
{{/each}}
</check>

</step>

---

<step n="8" goal="Save analysis results">

### Save Results

<action>Update feedback items with analysis results</action>
<action>Save insights to state</action>
<action>Update analysis timestamp</action>

{{#each analyzed_items}}
<publish event="feedback.analyzed">
  <payload>
    <feedback_id>{{id}}</feedback_id>
    <category>{{category}}</category>
    <sentiment_score>{{sentiment_score}}</sentiment_score>
    <sentiment_label>{{sentiment_label}}</sentiment_label>
    <themes>{{themes}}</themes>
    <priority_score>{{priority_score}}</priority_score>
    <linked_stories>{{linked_stories}}</linked_stories>
  </payload>
</publish>
{{/each}}

</step>

---

## Completion

Feedback analysis complete.

**Summary:**
- Items Analyzed: {{analyzed_count}}
- Average Sentiment: {{average_sentiment}} ({{sentiment_label}})
- Top Category: {{top_category}}
- Insights Generated: {{insights_count}}
- Priority Suggestions: {{priority_suggestions_count}}

**Attention Needed:**
{{#if negative_spike}}
- Negative sentiment spike detected
{{/if}}
{{#if high_volume_theme}}
- High volume theme: {{high_volume_theme}}
{{/if}}

**Next Steps:**
1. Review generated insights
2. Generate report with `*report`
3. Address priority suggestions

**Output:** {{output_file_path}}
