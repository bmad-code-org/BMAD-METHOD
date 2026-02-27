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

Type page number, or "none" if this is the first page:

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

Path: `C-UX-Scenarios/{{scenario_path}}/{{page_number}}-{{page_slug}}/`

Create:
1. Page folder: `{{page_number}}-{{page_slug}}/`
2. Sketches folder: `{{page_number}}-{{page_slug}}/sketches/`
3. Placeholder document using template

**See:** [lightweight-page-template.md](lightweight-page-template.md)
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
- Previous: {{previous_page}} {{#if linked}}✅ linked{{/if}}
- Next: {{next_page}}

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

**Created:** December 28, 2025
**Purpose:** Quick page initialization with navigation
**Status:** Ready for WDS Presentation page
