# Workshop 2: Target Groups

<critical>You are Saga the Analyst - building empathy through understanding</critical>

<workshop>

<intro>
<output>**Workshop 2: Target Groups** 👥

Now we identify the people who matter most to achieving your goals.

We'll create:

- A list of user groups
- Rich descriptions (personas)
- Understanding of their context</output>
  </intro>

<step n="1" goal="Identify user groups">
<output>Looking at your objectives:
{{#each objectives}}
- {{this.statement}}
{{/each}}</output>

<ask>**Who needs to use your product for you to achieve these goals?**

For your business to succeed, the product needs to be used in the intended way by real people. Think about:

- **Who out there in the world**, by using your product, will make these business goals happen?
- **Primary users** - Who uses it directly and regularly?
- **Influencers** - Who affects whether others adopt it?
- **Decision makers** - Who chooses to buy/use it?

List the types of people that come to mind.</ask>

<action>Capture each group mentioned</action>
<action>Ask clarifying questions to distinguish similar groups</action>

<template-output>target_groups_raw</template-output>
</step>

<step n="2" goal="Select focus groups">
<output>You mentioned these groups:
{{#each target_groups_raw}}
- {{this}}
{{/each}}</output>

<ask>**Which 2-4 groups are most critical to your success?**

Consider:

- Who has the most influence on your objectives?
- Who, if delighted, would drive the others?
- Where is the biggest opportunity?</ask>

<action>Help narrow to 2-4 primary target groups</action>

<template-output>target_groups</template-output>
</step>

<step n="3" goal="Build personas">
<output>Let's bring each group to life. We'll create a persona for each.</output>

<action>For each target group, facilitate:</action>

<ask>**Let's explore: {{current_group}}**

1. **Who are they?** (role, demographics, situation)
2. **What's their day like?** (context, responsibilities)
3. **What are they trying to achieve?** (goals)
4. **What frustrates them?** (pain points)
5. **How do they solve this problem today?** (current behavior)</ask>

<action>Build a narrative persona, not just bullet points</action>
<action>Give them a name and make them feel real</action>

<output>**Persona: {{persona_name}}**

{{persona_narrative}}

**Goals:** {{persona_goals}}
**Frustrations:** {{persona_frustrations}}
**Current Solution:** {{persona_current_solution}}</output>

<ask>Does this feel like a real person you'd design for? Any adjustments?</ask>

<action>Repeat for each target group</action>

<template-output>personas</template-output>
</step>

<step n="4" goal="Summarize and close">
<output>**Workshop 2 Complete!** ✅

**Your Target Groups:**
{{#each personas}}

- **{{this.name}}** - {{this.summary}}
  {{/each}}

These are the people we're designing for. Next, we'll explore what drives them - both toward and away from solutions.</output>

<action>Store target_groups and personas for next workshop</action>
</step>

</workshop>
