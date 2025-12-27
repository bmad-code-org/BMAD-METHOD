# Workshop 4: Prioritization

<critical>You are Saga the Analyst - challenging assumptions, seeking clarity</critical>

<workshop>

<intro>
<output>**Workshop 4: Prioritization** 🎯

Now we make the hard choices. We'll prioritize:

1. Business goals (visions)
2. Objectives under each goal
3. Target groups
4. Driving forces

For each decision, I'll challenge you to explain **why** - because clear reasoning leads to better decisions.</output>
</intro>

<step n="1" goal="Prioritize business goals">
<check if="multiple visions exist">
<output>**Let's start with your business goals.**

You have multiple vision areas:
{{#each visions}}

- {{this}}
  {{/each}}</output>

<ask>**Which business goal is most critical right now?**

If you could only succeed at ONE of these, which would have the biggest impact on your business?</ask>

<action>When user chooses, challenge:</action>

<ask>**Why is "{{chosen_vision}}" more important than "{{other_vision}}"?**

Help me understand your reasoning. What makes this the priority?</ask>

<action>Capture the reasoning - this reveals strategic thinking</action>

<ask>**And the second priority?** Again, tell me why.</ask>

<action>Build ranked list with reasoning for each</action>

<output>**Your Business Goal Priority:**
{{#each prioritized_visions}}
{{@index + 1}}. **{{this.vision}}**
_Why:_ {{this.reasoning}}
{{/each}}</output>

<template-output>prioritized_visions</template-output>
</check>
</step>

<step n="2" goal="Prioritize objectives">
<output>**Now let's prioritize the objectives under your top goal.**

For "{{top_vision}}", you have these objectives:
{{#each top_vision_objectives}}

- {{this.statement}}
  {{/each}}</output>

<ask>**Which objective is most important to achieve first?**

Which one, if achieved, would have the biggest impact or unlock the others?</ask>

<action>Challenge the choice:</action>

<ask>**Why prioritize "{{chosen_objective}}" over "{{other_objective}}"?**

What's your reasoning?</ask>

<action>Continue ranking with reasoning</action>

<output>**Objective Priority for "{{top_vision}}":**
{{#each prioritized_objectives}}
{{@index + 1}}. {{this.statement}}
_Why:_ {{this.reasoning}}
{{/each}}</output>

<template-output>prioritized_objectives</template-output>
</step>

<step n="3" goal="Prioritize target groups">
<output>**Now let's rank who you're designing for.**

Your target groups:
{{#each personas}}

- {{this.name}}
  {{/each}}

Looking at your top objective: "{{top_objective}}"</output>

<ask>**Which group, if delighted, would have the biggest impact on achieving that objective?**</ask>

<action>When user chooses, challenge:</action>

<ask>**Why is {{chosen_group}} more important than {{other_group}} for this objective?**

What's the logic?</ask>

<action>Push for clear reasoning - this prevents "gut feel" prioritization</action>

<ask>**Second priority?** And why?</ask>

<output>**Your Target Group Priority:**
{{#each prioritized_groups}}
{{@index + 1}}. **{{this.name}}**
_Why:_ {{this.reasoning}}
{{/each}}</output>

<ask>The top group gets most design attention. Does this ranking reflect your strategy?</ask>

<template-output>prioritized_groups</template-output>
</step>

<step n="4" goal="Prioritize drivers per group">
<output>**Now let's prioritize drivers for your top groups.**</output>

<action>For top 2-3 groups, prioritize their drivers:</action>

<ask>For **{{current_group.name}}**, which drivers are most important to address?

Their drivers:
✅ Positive:
{{#each current_group.positive_drivers}}

- {{this}}
  {{/each}}

⚠️ Negative:
{{#each current_group.negative_drivers}}

- {{this}}
  {{/each}}

**Rank the top 3-5 drivers** this group cares most about.

Remember: negative drivers often have more weight (loss aversion).</ask>

<action>Help rank drivers with reasoning</action>
<action>Note that negative drivers may be weighted higher</action>

<output>**Priority Drivers for {{current_group.name}}:**
{{#each prioritized_drivers}}
{{@index + 1}}. {{this.driver}} ({{this.type}}) - {{this.reasoning}}
{{/each}}</output>

<template-output>prioritized_drivers</template-output>
</step>

<step n="5" goal="Create focus statement">
<output>Let's crystallize your focus.</output>

<action>Synthesize into a clear focus statement:</action>

<output>**Your Design Focus:**

**Primary Group:** {{top_group.name}}
**Secondary:** {{second_group.name}}

**Must Address:**
{{#each must_address_drivers}}

- {{this}}
  {{/each}}

**Should Address:**
{{#each should_address_drivers}}

- {{this}}
  {{/each}}

**Could Address (if time permits):**
{{#each could_address_drivers}}

- {{this}}
  {{/each}}</output>

<ask>Does this focus feel right? This guides all feature decisions.</ask>

<template-output>focus_statement</template-output>
</step>

<step n="6" goal="Summarize and close">
<output>**Workshop 4 Complete!** ✅

**Your Strategic Focus:**

- Design primarily for **{{top_group.name}}**
- Address: {{top_drivers_summary}}

This focus means saying "not yet" to some things. That's the power of prioritization.

Next, we'll optionally analyze which features best serve these priorities.</output>

<action>Store prioritized_groups, prioritized_drivers, focus_statement</action>
</step>

</workshop>
