# Placeholder Page Templates

Templates for generating placeholder page documents.

---

## Page Placeholder Document Template

File: `C-UX-Scenarios/{{scenario_path}}/{{page.number}}-{{page.slug}}/{{page.number}}-{{page.slug}}.md`

```markdown
{{#if @index > 0}}
← [{{pages_list[@index - 1].number}}-{{pages_list[@index - 1].slug}}](../{{pages_list[@index - 1].number}}-{{pages_list[@index - 1].slug}}/{{pages_list[@index - 1].number}}-{{pages_list[@index - 1].slug}}.md)
{{/if}}
{{#if @index < pages_list.length - 1}}
| [{{pages_list[@index + 1].number}}-{{pages_list[@index + 1].slug}}](../{{pages_list[@index + 1].number}}-{{pages_list[@index + 1].slug}}/{{pages_list[@index + 1].number}}-{{pages_list[@index + 1].slug}}.md) →
{{/if}}

# {{page.number}} {{page.name}}

**User Situation:** {{page.situation}}

**Page Purpose:** {{page.purpose}}

---

## Status

⚠️ **PLACEHOLDER** - This page needs:
- [ ] Sketch or screenshot
- [ ] Section breakdown
- [ ] Object specifications
- [ ] Component links
- [ ] Interaction definitions
- [ ] States and variants

---

## Next Steps

To complete this page specification:

1. **Add a sketch**: Place sketch in `sketches/` folder
2. **Run Workshop A**: Sketch Analysis Workshop to break down the visual
3. **Specify objects**: Define all interactive elements with Object IDs
4. **Link components**: Connect to design system components
5. **Document states**: Define loading, error, success, empty states

---

{{#if @index > 0}}
**Previous Step**: ← [{{pages_list[@index - 1].number}}-{{pages_list[@index - 1].slug}}](../{{pages_list[@index - 1].number}}-{{pages_list[@index - 1].slug}}/{{pages_list[@index - 1].number}}-{{pages_list[@index - 1].slug}}.md)
{{/if}}
{{#if @index < pages_list.length - 1}}
**Next Step**: → [{{pages_list[@index + 1].number}}-{{pages_list[@index + 1].slug}}](../{{pages_list[@index + 1].number}}-{{pages_list[@index + 1].slug}}/{{pages_list[@index + 1].number}}-{{pages_list[@index + 1].slug}}.md)
{{/if}}

---

_Placeholder created using Whiteport Design Studio (WDS) methodology_
```

---

## Scenario Overview Template

File: `C-UX-Scenarios/{{scenario_path}}/00-{{scenario_slug}}-scenario.md`

```markdown
# {{scenario_number}} {{scenario_name}} - Scenario Overview

**Project**: {{project_name}}
**Date Created**: {{date}}
**Last Updated**: {{date}}

## Scenario Overview

[Brief description of this scenario - to be filled in]

## Scenario Steps

{{#each page in pages_list}}
### **{{page.number}} {{page.name}}**
**Purpose**: {{page.purpose}}
**Status**: ⚠️ Placeholder
**Files**: [{{page.number}}-{{page.slug}}.md]({{page.number}}-{{page.slug}}/{{page.number}}-{{page.slug}}.md)

{{/each}}

## User Journey Flow

```
{{#each page in pages_list}}
{{page.number}}-{{page.slug}}{{#unless @last}} → {{/unless}}
{{/each}}
```

## Status

{{pages_list.length}} placeholder pages created. Each page needs:
- Sketch or visual concept
- Detailed specifications
- Object definitions
- Component links

---

_Created using Whiteport Design Studio (WDS) methodology_
```

---

## Scenario Tracking Template

File: `C-UX-Scenarios/{{scenario_path}}/scenario-tracking.yaml`

```yaml
scenario_number: {{scenario_number}}
scenario_name: "{{scenario_name}}"
pages_list:
{{#each page in pages_list}}
  - name: "{{page.name}}"
    slug: "{{page.slug}}"
    page_number: "{{page.number}}"
    purpose: "{{page.purpose}}"
    status: "placeholder"
{{/each}}
current_page_index: 0
total_pages: {{pages_list.length}}
created_date: "{{date}}"
```

---

## When to Use Placeholders

**Advantages:**
- Quick mapping of entire flow
- Clear navigation before details
- Easy to see gaps or redundancies
- Can be reviewed by stakeholders early
- Team can work on different pages in parallel

**Use when:**
- New projects starting from scratch
- Complex multi-page scenarios
- When need for early stakeholder review
- Before diving into visual design

**Don't use when:**
- Single page projects
- When sketch already exists (use Workshop A)
- Small modifications to existing flow
