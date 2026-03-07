# Write to Confluence — Reusable Task

**Purpose:** Create or update a Confluence page idempotently. Checks if the page already exists before creating a new one.

---

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `title` | Yes | Page title (should include project key prefix) |
| `body_content` | Yes | Markdown content for the page body |
| `space_key` | Yes | Confluence space key (from `{confluence_space_key}`) |
| `parent_page_id` | No | Parent page ID (defaults to `{confluence_parent_page_id}`) |
| `labels` | No | Array of labels to apply after creation |
| `link_to_jira_issue` | No | Jira issue key to link this page from (via remote issue link) |
| `key_map_id` | No | Identifier to store the page ID under in `.jira-key-map.yaml` |

---

## Execution

<workflow>

<step n="1" goal="Check if page already exists">
<action>Call `Search Content` with `query: "title = \"{title}\""` and `spaces_filter: "{space_key}"`</action>
<action>If a matching page is found, record its `page_id` and proceed to step 3 (update)</action>
<action>If no match found, proceed to step 2 (create)</action>
</step>

<step n="2" goal="Create new page">
<action>Call `Create Page` with:</action>

```
space_key: "{space_key}"
title: "{title}"
content: "{body_content}"
parent_id: "{parent_page_id}"    # omit if empty
```

<action>Record the returned `page_id`</action>
<action>Proceed to step 4</action>
</step>

<step n="3" goal="Update existing page">
<action>Call `Update Page` with:</action>

```
page_id: "{existing_page_id}"
title: "{title}"
content: "{body_content}"
version_comment: "Updated by BMAD agent"
```

<action>Record the `page_id`</action>
</step>

<step n="4" goal="Apply labels (if provided)">
<action>For each label in `{labels}`:</action>
<action>Call `Add Label` with `page_id: "{page_id}"` and `name: "{label}"`</action>
</step>

<step n="5" goal="Link from Jira issue (if provided)">
<action>If `link_to_jira_issue` is provided:</action>
<action>Call `Create Remote Issue Link` with:</action>

```
issue_key: "{link_to_jira_issue}"
url: "{confluence_base_url}/pages/{page_id}"
title: "{title}"
summary: "BMAD artefact published to Confluence"
```
</step>

<step n="6" goal="Update key map (if key_map_id provided)">
<action>If `key_map_id` is provided:</action>
<action>Update `{key_map_file}` under `confluence_pages.{key_map_id}` with the `page_id`</action>
<action>Update `last_updated` timestamp</action>

</step>

</workflow>

---

## Return Value

Returns `page_id` (string) for use by the calling workflow for cross-linking.
