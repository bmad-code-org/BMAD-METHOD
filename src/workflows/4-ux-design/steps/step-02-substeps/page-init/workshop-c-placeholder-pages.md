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

<action>Store scenario_number and scenario_name</action>

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

For each page, gather:
1. **Page name** (examples: "Start Page", "Sign In", "Checkout")
2. **Page purpose** (1-2 sentences: what user accomplishes)
3. **User situation** (what just happened, what they're trying to do)

<action>Store page_name, page_purpose, user_situation for each page</action>

---

## PHASE 5: FLOW REVIEW

<output>**Here's your complete scenario flow:**

**Scenario {{scenario_number}}: {{scenario_name}}**

[Display numbered list of all pages with purposes]

Does this flow make sense? Any pages missing or in wrong order?</output>

<ask>**Review the flow:**

- Type "good" to proceed
- Type "add" to insert a page
- Type "remove N" to remove page N
- Type "move N to M" to reorder

Action:</ask>

---

## PHASE 6: GENERATE DOCUMENTS

<output>**Perfect! Creating your placeholder pages now...**</output>

<action>
For each page in pages_list:
1. Create folder structure with sketches subfolder
2. Generate placeholder document using template
3. Create scenario overview document
4. Create scenario tracking file

**See:** [substeps/placeholder-templates.md](substeps/placeholder-templates.md) for all templates
</action>

---

## PHASE 7: COMPLETION

<output>✅ **Placeholder pages created!**

**Scenario:** {{scenario_number}} - {{scenario_name}}

**Created:**
- {{pages_list.length}} page folders with navigation
- {{pages_list.length}} placeholder documents
- 1 scenario overview document
- 1 scenario tracking file

**Next Steps:**
1. **Add sketches** - Upload visuals for each page
2. **Complete specifications** - Run Workshop A (Sketch Analysis) for each page
3. **Add more pages** - Come back and add pages to this scenario
4. **Create another scenario** - Start a new user journey

**Ready to work on a specific page?**

Pick a page to work on:
[1-N] Page name
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
