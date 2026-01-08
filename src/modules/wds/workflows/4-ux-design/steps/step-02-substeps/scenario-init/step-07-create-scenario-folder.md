# Step 7: Create Structure

---

<action>
**Determine scenario number:**
- Count existing scenario folders in `4-scenarios/`
- If none exist, scenario_num = 1
- Otherwise, scenario_num = (highest number + 1)
- Store scenario_num
</action>

<action>
**Create physical folder structure:**

1. Create `4-scenarios/{{scenario_num}}-{{scenario-slug}}/` directory

**Generate 00-scenario-overview.md:**

File: `4-scenarios/{{scenario_num}}-{{scenario-slug}}/00-scenario-overview.md`

Content:
```markdown
# Scenario {{scenario_num}}: {{scenario_name}}

**Project Structure:** Multiple scenarios

---

## Core Feature

{{core_feature}}

---

## User Journey

### Entry Point

{{entry_point}}

### Mental State

{{mental_state}}

When users arrive, they are feeling:
- **Trigger:** [what just happened]
- **Hope:** [what they're hoping for]
- **Worry:** [what they're worried about]

---

## Success Goals

### Business Success

{{business_success}}

### User Success

{{user_success}}

---

## Shortest Path

{{#each page in pages_list}}
{{@index + 1}}. **{{page.name}}** - {{page.description}}
{{/each}}

---

## Pages in This Scenario

{{#each page in pages_list}}
- `{{scenario_num}}.{{@index + 1}}-{{page.slug}}/`
{{/each}}

---

## Trigger Map Connections

[Link to relevant personas and driving forces from Trigger Map]

---

**Created:** {{date}}
**Status:** Ready for design
```

**Generate scenario-tracking.yaml:**

File: `4-scenarios/{{scenario_num}}-{{scenario-slug}}/scenario-tracking.yaml`

Content:
```yaml
scenario_number: {{scenario_num}}
scenario_name: "{{scenario_name}}"
core_feature: "{{core_feature}}"
entry_point: "{{entry_point}}"
mental_state: "{{mental_state}}"
business_success: "{{business_success}}"
user_success: "{{user_success}}"
pages_list:
{{#each page in pages_list}}
  - name: "{{page.name}}"
    slug: "{{page.slug}}"
    page_number: "{{scenario_num}}.{{@index + 1}}"
    description: "{{page.description}}"
    status: "not_started"
{{/each}}
current_page_index: 0
total_pages: {{pages_list.length}}
```

**Note:** Individual page folders and documents will be created when you run the page-init workshop for each page.
</action>

<output>✅ **Scenario structure created:**

**Scenario {{scenario_num}}:** {{scenario_name}}

**Folder:**
- `4-scenarios/{{scenario_num}}-{{scenario-slug}}/`

**Documents:**
- `00-scenario-overview.md` (detailed scenario metadata)
- `scenario-tracking.yaml` (progress tracking)

**Journey Overview:**
- **Start:** {{entry_point}} ({{mental_state}})
- **End:** {{business_success}} + {{user_success}}
- **Pages planned:** {{pages_list.length}}

**Next Step:**
- Run the page-init workshop to define and create the first page in this scenario

The scenario container is ready! 🎨</output>

---

<output>[C] Continue to Page Initialization Workshop</output>

<action>When user selects [C], load `step-02-substeps/page-init/step-01-page-context.md`</action>

