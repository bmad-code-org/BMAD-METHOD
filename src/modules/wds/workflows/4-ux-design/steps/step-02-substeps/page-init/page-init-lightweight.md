# Page Init (Lightweight)

**Purpose:** Quick page setup - establish context, create structure, ready for iteration

---

## CONTEXT

**This workflow activates when:** User wants quick page setup without full specification yet.

**Creates:** Minimal structure (name, purpose, navigation, folders) ready for iteration.

**Critical:** Navigation links must be established for page comprehension.

---

## STEP 1: PAGE BASICS

<ask>**What's the name of this page?**

Examples:
- "Start Page"
- "Sign In"
- "Dashboard"
- "User Profile"

Page name:</ask>

<action>
Store page_name
Generate page_slug from page_name (lowercase, hyphenated)
</action>

---

## STEP 2: PURPOSE & SITUATION

<ask>**What's the PURPOSE of this page?**

What should this page accomplish?

Purpose:</ask>

<action>Store page_purpose</action>

<ask>**What's the USER'S SITUATION when they arrive?**

What just happened? What are they trying to do?

User situation:</ask>

<action>Store user_situation</action>

---

## STEP 3: SCENARIO CONTEXT

<action>
**Determine scenario context:**
- Read project structure from wds-workflow-status.yaml
- Check existing scenarios
- Determine page placement
</action>

<check if="multiple_scenarios_exist">
  <ask>**Which scenario does this page belong to?**
  
  Existing scenarios:
  {{#each scenario in existing_scenarios}}
  - {{scenario.number}}: {{scenario.name}}
  {{/each}}
  
  Choose scenario [number] or "new" for a new scenario:</ask>
  
  <action>Store scenario_number</action>
</check>

<check if="single_scenario or no_scenarios">
  <output>This page will be in your main user flow.</output>
  <action>Set scenario_number = 1</action>
</check>

---

## STEP 4: NAVIGATION FLOW (CRITICAL!)

<output>**Now let's establish navigation - this is crucial for comprehension!**</output>

<action>
**Determine page number:**
- Count existing pages in scenario
- Calculate next page number
- Store page_number (e.g., "1.1", "1.2", "2.1")
</action>

<ask>**What page comes BEFORE this one?**

{{#if existing_pages_in_scenario.length > 0}}
Existing pages:
{{#each page in existing_pages_in_scenario}}
- {{page.number}}: {{page.name}}
{{/each}}

Type page number, or "none" if this is the first page:
{{else}}
This is the first page in the scenario. Type "none":
{{/if}}

Previous page:</ask>

<action>Store previous_page</action>

<ask>**What page comes AFTER this one?**

- If you know: Type the page name (we'll create it next)
- If unsure: Type "TBD"
- If last page: Type "none"

Next page:</ask>

<action>Store next_page</action>

---

## STEP 5: CREATE STRUCTURE

<output>**Creating page structure...**</output>

<action>
**Create folder structure:**

Path: `4-scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/`

Create:
1. Page folder: `{{page_number}}-{{page_slug}}/`
2. Sketches folder: `{{page_number}}-{{page_slug}}/sketches/`
3. Placeholder document: `{{page_number}}-{{page_slug}}.md`
</action>

<action>
**Generate placeholder document:**

File: `4-scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/{{page_number}}-{{page_slug}}.md`

Content:
```markdown
{{#if previous_page != "none"}}
← [{{previous_page}}](../{{previous_page_slug}}/{{previous_page_slug}}.md)
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
 | [{{next_page}}](../{{next_page_slug}}/{{next_page_slug}}.md) →
{{/if}}
{{#if next_page == "TBD"}}
 | Next: TBD
{{/if}}

![{{page_name}}](sketches/{{page_slug}}-concept.jpg)

{{#if previous_page != "none"}}
← [{{previous_page}}](../{{previous_page_slug}}/{{previous_page_slug}}.md)
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
 | [{{next_page}}](../{{next_page_slug}}/{{next_page_slug}}.md) →
{{/if}}

# {{page_number}} {{page_name}}

**User Situation:** {{user_situation}}

**Page Purpose:** {{page_purpose}}

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

## Navigation Context

{{#if previous_page != "none"}}
**Previous:** {{previous_page}}
{{else}}
**This is the first page in the scenario**
{{/if}}

{{#if next_page == "TBD"}}
**Next:** TBD (to be defined)
{{else if next_page != "none"}}
**Next:** {{next_page}}
{{else}}
**This is the last page in the scenario**
{{/if}}

---

## Next Steps

To complete this page specification:

1. **Add a sketch**: Place your sketch in `sketches/` folder
2. **Run Page Process Workshop**: Analyze your sketch
3. **Specify sections**: Define all page sections
4. **Specify objects**: Define all interactive elements with Object IDs
5. **Link components**: Connect to design system components
6. **Document states**: Define loading, error, success, empty states
7. **Generate prototype**: Create interactive HTML preview

---

{{#if previous_page != "none"}}
**Previous Step**: ← [{{previous_page}}](../{{previous_page_slug}}/{{previous_page_slug}}.md)
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
**Next Step**: → [{{next_page}}](../{{next_page_slug}}/{{next_page_slug}}.md)
{{/if}}

---

_Placeholder created using Whiteport Design Studio (WDS) methodology_
```
</action>

---

## STEP 6: UPDATE NAVIGATION

<check if="previous_page != 'none'">
  <action>
  **Update previous page document:**
  - Open previous page .md file
  - Update "Next" link to point to this page
  - Save
  </action>
</check>

---

## STEP 7: COMPLETION

<output>✅ **Page initialized!**

**Created:**
- Folder: `{{page_number}}-{{page_slug}}/`
- Document: `{{page_number}}-{{page_slug}}.md`
- Sketches folder: `sketches/`

**Page details:**
- **Number:** {{page_number}}
- **Name:** {{page_name}}
- **Purpose:** {{page_purpose}}

**Navigation:**
{{#if previous_page != "none"}}
- Previous: {{previous_page}} ✅ linked
{{else}}
- First page in scenario
{{/if}}
{{#if next_page != "none" and next_page != "TBD"}}
- Next: {{next_page}} ✅ linked
{{else if next_page == "TBD"}}
- Next: TBD
{{else}}
- Last page in scenario
{{/if}}

---

**Next steps:**

1. **Add your sketch** to `sketches/` folder
2. **Run Page Process Workshop** to analyze it

Or:

[A] Add sketch now and analyze
[B] Create another page first
[C] Back to scenario overview

Choice:</output>

---

## ROUTING

<action>
Based on user choice:
- [A] → workshop-page-process.md (with this page context)
- [B] → Repeat page-init for next page
- [C] → Return to scenario overview / main menu
</action>

---

## KEY PRINCIPLES

### ✅ **Navigation is Critical**
- Appears twice (top & after sketch)
- Links to previous/next pages
- Creates navigable flow
- Essential for comprehension

### ✅ **Lightweight Setup**
- Quick to create
- No detailed specs yet
- Just enough to get started
- Ready for iteration

### ✅ **Context Captured**
- Name, purpose, situation
- Scenario placement
- Page number assigned
- Flow established

---

**Created:** December 28, 2025  
**Purpose:** Quick page initialization with navigation  
**Status:** Ready for WDS Presentation page

