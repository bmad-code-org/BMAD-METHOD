# Workshop C: Placeholder Pages

**Trigger:** User wants to quickly map out a scenario structure without full specifications

---

## WORKSHOP GOAL

Rapidly create placeholder page documents with:
- Navigation structure
- Page names
- Page purposes
- Scenario context

This gives clarity to the overall flow before diving into detailed specifications.

---

## PHASE 1: TRIGGER DETECTION

<output>**Let's map out your scenario structure!**

Sometimes it helps to create placeholder pages first - just the names, purposes, and navigation - before diving into detailed specifications. This gives you a clear roadmap.

Would you like to:
- Create placeholders for a whole scenario flow
- Add individual placeholder pages as you plan

Let's start! 📋</output>

---

## PHASE 2: SCENARIO CONTEXT

<action>
**Determine scenario context:**
- Read project structure from wds-workflow-status.yaml
- Check existing scenarios
- Determine if working with existing or new scenario
</action>

<ask>**Which scenario are we mapping out?**

{{#if existing_scenarios}}
Existing scenarios:
{{#each scenario in existing_scenarios}}
- {{scenario.number}}: {{scenario.name}}
{{/each}}

Type scenario number or "new" for a new scenario:
{{else}}
This will be your first scenario. What should we call it?

Scenario name:
{{/if}}</ask>

<action>
Store scenario_number and scenario_name
</action>

---

## PHASE 3: FLOW MAPPING

<output>**Great! Let's map out the pages in this flow.**

Think about the user journey through "{{scenario_name}}"</output>

<ask>**How many pages will be in this scenario?**

Think about the steps a user goes through:
- Entry point / first page
- Middle steps (actions, decisions, inputs)
- Completion / exit page

Number of pages:</ask>

<action>Store pages_count</action>

---

## PHASE 4: PAGE ENUMERATION

<output>**Perfect! Let's name and define each page.**

I'll guide you through {{pages_count}} pages...</output>

<action>For page_index from 1 to pages_count, run this loop:</action>

<output>---

### Page {{page_index}} of {{pages_count}}

</output>

<ask>**What should we call this page?**

Examples:
- "Start Page" / "Home"
- "Sign In"
- "User Profile"
- "Checkout"
- "Confirmation"

Page name:</ask>

<action>
Store page_name
Generate page_slug
Calculate page_number (scenario.page_index)
</action>

<ask>**What's the PURPOSE of "{{page_name}}"?**

In 1-2 sentences:
- What does the user accomplish here?
- What happens on this page?

Purpose:</ask>

<action>Store page_purpose</action>

<ask>**What's the USER'S SITUATION when they arrive?**

What just happened? What are they trying to do?

User situation:</ask>

<action>Store user_situation</action>

<output>✓ **Page {{page_index}} defined:**

{{page_number}}-{{page_slug}}: {{page_name}}
- Purpose: {{page_purpose}}
- Situation: {{user_situation}}</output>

<action>Continue to next page</action>

---

## PHASE 5: FLOW REVIEW

<output>**Here's your complete scenario flow:**

**Scenario {{scenario_number}}: {{scenario_name}}**

{{#each page in pages_list}}
{{@index + 1}}. **{{page.number}}-{{page.slug}}** - {{page.name}}
   Purpose: {{page.purpose}}
   User: {{page.situation}}
   
{{/each}}

Does this flow make sense? Any pages missing or in wrong order?</output>

<ask>**Review the flow:**

- Type "good" to proceed
- Type "add" to insert a page
- Type "remove N" to remove page N
- Type "move N to M" to reorder

Action:</ask>

<action>
Process user adjustments:
- Add pages if needed
- Remove pages if requested
- Renumber pages after changes
</action>

---

## PHASE 6: GENERATE PLACEHOLDER DOCUMENTS

<output>**Perfect! Creating your placeholder pages now...**

Generating {{pages_list.length}} page documents...</output>

<action>
For each page in pages_list:

**Create folder structure:**
`4-scenarios/{{scenario_path}}/{{page.number}}-{{page.slug}}/`
`4-scenarios/{{scenario_path}}/{{page.number}}-{{page.slug}}/sketches/`

**Generate placeholder document:**

File: `4-scenarios/{{scenario_path}}/{{page.number}}-{{page.slug}}/{{page.number}}-{{page.slug}}.md`

Content:
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
</action>

<action>
**Create scenario overview document:**

File: `4-scenarios/{{scenario_path}}/00-{{scenario_slug}}-scenario.md`

Content:
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
</action>

<action>
**Create scenario tracking file:**

File: `4-scenarios/{{scenario_path}}/scenario-tracking.yaml`

Content:
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
</action>

---

## PHASE 7: COMPLETION SUMMARY

<output>✅ **Placeholder pages created!**

**Scenario:** {{scenario_number}} - {{scenario_name}}

**Created:**
- {{pages_list.length}} page folders with navigation
- {{pages_list.length}} placeholder documents
- 1 scenario overview document
- 1 scenario tracking file

**File structure:**
```
4-scenarios/
  {{scenario_path}}/
    00-{{scenario_slug}}-scenario.md
    scenario-tracking.yaml
{{#each page in pages_list}}
    {{page.number}}-{{page.slug}}/
      {{page.number}}-{{page.slug}}.md ⚠️ PLACEHOLDER
      sketches/
{{/each}}
```

**Your scenario flow:**
```
{{#each page in pages_list}}
{{page.number}}-{{page.slug}}: {{page.name}}
{{/each}}
```

---

## Next Steps

You can now:

1. **Add sketches** - Upload visuals for each page
2. **Complete specifications** - Run Workshop A (Sketch Analysis) for each page
3. **Add more pages** - Come back and add pages to this scenario
4. **Create another scenario** - Start a new user journey

**Ready to work on a specific page?**

Pick a page to work on:
{{#each page in pages_list}}
[{{@index + 1}}] {{page.name}}
{{/each}}
[N] Add another scenario
[D] Done for now

Choice:</output>

---

## ROUTING

<action>
**Based on user choice:**
- If user picks a page number → Route to Workshop B (Sketch Creation) for that page
- If user selects [N] → Route to scenario-init workshop
- If user selects [D] → Return to main UX design menu
</action>

---

## NOTES FOR IMPLEMENTATION

**Advantages of placeholders:**
- Quick mapping of entire flow
- Clear navigation before details
- Easy to see gaps or redundancies
- Can be reviewed by stakeholders early
- Team can work on different pages in parallel

**When to use:**
- New projects starting from scratch
- Complex multi-page scenarios
- When need for early stakeholder review
- Before diving into visual design

**When NOT to use:**
- Single page projects
- When sketch already exists (use Workshop A)
- Small modifications to existing flow


