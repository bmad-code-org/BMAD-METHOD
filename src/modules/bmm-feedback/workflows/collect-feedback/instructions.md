# Collect Feedback Instructions

## Objective
Gather feedback from all configured sources, standardize the format, and prepare for analysis.

## Prerequisites
- At least one feedback source configured
- API credentials for external sources (if applicable)

---

<step n="1" goal="Select collection scope">

### Select Collection Scope

<ask>What feedback would you like to collect?
[a] All enabled sources
[s] Select specific sources
[m] Manual entry only

Choice: </ask>

<action>Store as {{collection_mode}}</action>

<check if="collection_mode == 's'">
**Enabled Sources:**
{{#each enabled_sources}}
[{{index}}] {{name}} - {{description}}
{{/each}}

<ask>Select sources (comma-separated numbers): </ask>
<action>Store as {{selected_sources}}</action>
</check>

<ask>Collect feedback from what time period?
[t] Today
[w] Last 7 days
[m] Last 30 days
[c] Custom date range
[a] All time (since last collection)

Period: </ask>

<action>Calculate {{since_date}} based on selection</action>

</step>

---

<step n="2" goal="Collect from in-app source" condition="in_app in selected_sources">

### In-App Feedback

<action>Connect to in-app feedback widget/database</action>
<action>Query feedback since {{since_date}}</action>

**In-App Feedback Retrieved:** {{in_app_count}} items

{{#each in_app_feedback}}
| ID | Date | Content (preview) | Rating |
|----|------|-------------------|--------|
| {{id}} | {{date}} | {{content_preview}} | {{rating}} |
{{/each}}

</step>

---

<step n="3" goal="Collect from support tickets" condition="support in selected_sources">

### Support Tickets

<action>Connect to support system ({{support.provider}})</action>
<action>Query tickets with feedback tag since {{since_date}}</action>
<action>Extract feedback content from tickets</action>

**Support Feedback Retrieved:** {{support_count}} items

</step>

---

<step n="4" goal="Collect from surveys" condition="surveys in selected_sources">

### Survey Responses

<action>Connect to survey provider ({{surveys.provider}})</action>
<action>Query responses since {{since_date}}</action>
<action>Map survey questions to feedback categories</action>

**Survey Responses Retrieved:** {{survey_count}} items

</step>

---

<step n="5" goal="Collect from app stores" condition="app_store in selected_sources">

### App Store Reviews

<action>Query iOS App Store reviews for {{app_store.ios_app_id}}</action>
<action>Query Google Play reviews for {{app_store.android_package}}</action>
<action>Filter reviews since {{since_date}}</action>

**App Store Reviews Retrieved:** {{app_store_count}} items

</step>

---

<step n="6" goal="Manual feedback entry" condition="collection_mode == 'm'">

### Manual Feedback Entry

<ask>Enter feedback details:

Source (e.g., email, support ticket, survey): </ask>
<action>Store as {{manual_source}}</action>

<ask>Customer identifier (optional): </ask>
<action>Store as {{manual_customer}}</action>

<ask>Feedback content: </ask>
<action>Store as {{manual_content}}</action>

<ask>Any additional context or notes: </ask>
<action>Store as {{manual_notes}}</action>

<action>Create feedback item from manual entry</action>

<ask>Add another feedback item?
[y] Yes
[n] No

Choice: </ask>

<check if="choice == 'y'">
<action>Loop back to manual entry</action>
</check>

</step>

---

<step n="7" goal="Standardize and deduplicate">

### Process Collected Feedback

<action>Standardize all feedback to common format</action>
<action>Detect and merge duplicates</action>
<action>Assign unique feedback IDs</action>

**Collection Summary:**

| Source | Raw | Deduplicated | New |
|--------|-----|--------------|-----|
| In-App | {{in_app_raw}} | {{in_app_dedup}} | {{in_app_new}} |
| Support | {{support_raw}} | {{support_dedup}} | {{support_new}} |
| Surveys | {{survey_raw}} | {{survey_dedup}} | {{survey_new}} |
| App Store | {{app_store_raw}} | {{app_store_dedup}} | {{app_store_new}} |
| Manual | {{manual_count}} | {{manual_count}} | {{manual_count}} |
| **Total** | {{total_raw}} | {{total_dedup}} | {{total_new}} |

</step>

---

<step n="8" goal="Store and publish">

### Store Feedback

<action>Save new feedback items to state</action>
<action>Link to release if release_id provided</action>

{{#each new_feedback_items}}
<publish event="feedback.received">
  <payload>
    <feedback_id>{{id}}</feedback_id>
    <source>{{source}}</source>
    <content>{{content}}</content>
    <customer_id>{{customer_id}}</customer_id>
    <release_id>{{release_id}}</release_id>
    <timestamp>{{timestamp}}</timestamp>
  </payload>
</publish>
{{/each}}

<action>Log: "Collected {{total_new}} new feedback items from {{sources_used}}"</action>

</step>

---

## Completion

Feedback collection complete.

**Summary:**
- Sources queried: {{sources_count}}
- New feedback items: {{total_new}}
- Duplicates removed: {{duplicates_removed}}
- Period: {{since_date}} to {{now}}

**Next Steps:**
1. Run `*analyze` to categorize and score feedback
2. Review high-priority items manually
3. Generate report with `*report`

**Output:** {{output_file_path}}
