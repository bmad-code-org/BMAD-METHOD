# Quick-Prototype - Rapid Game Prototyping Workflow

<workflow>

<critical>Communicate in {communication_language}, tailored to {user_skill_level}</critical>
<critical>Focus on PLAYABLE outcomes - get something testable fast</critical>
<critical>Prototype first, polish later - embrace programmer art</critical>
<critical>ALWAYS respect {project_context} if it exists - it defines project standards</critical>

<checkpoint-handlers>
  <on-select key="a">Load and execute {advanced_elicitation}, then return</on-select>
  <on-select key="p">Load and execute {party_mode_exec}, then return</on-select>
  <on-select key="d">Load and execute {quick_dev_workflow}</on-select>
</checkpoint-handlers>

<step n="1" goal="Understand what to prototype">

<action>Check if {project_context} exists. If yes, load it for project conventions.</action>

<action>Parse user input to determine prototype scope:

**Mechanic Prototype** - Testing a specific game mechanic
→ Focus on feel, feedback, core loop

**Feature Prototype** - Testing a game feature
→ Focus on functionality, integration

**Visual Prototype** - Testing look and feel
→ Focus on art direction, UI/UX

**System Prototype** - Testing a game system
→ Focus on data flow, balance hooks
</action>

<ask>**What are you prototyping?**

Describe the mechanic, feature, or system you want to test. Be specific about:

- What player action or behavior you're testing
- What "feeling right" looks like
- Any constraints (engine, platform, existing code)</ask>

</step>

<step n="2" goal="Define success criteria">

<action>Based on prototype type, establish testable success criteria:

**For Mechanics:**

- Does the input feel responsive?
- Is the feedback clear?
- Is it fun to repeat?

**For Features:**

- Does it work as expected?
- Does it integrate with existing systems?
- Can a player understand it?

**For Systems:**

- Is the data flowing correctly?
- Are the hooks in place for tuning?
- Does it scale?
  </action>

<ask>**What makes this prototype successful?**

Define 2-3 specific, testable criteria. For example:

- "Player can jump and it feels snappy"
- "Inventory shows correct item counts"
- "Enemy spawner creates waves correctly"</ask>

</step>

<step n="3" goal="Rapid implementation">

<action>Implement the prototype with these principles:

1. **Minimum Viable Prototype** - Only what's needed to test the idea
2. **Hardcode First** - Magic numbers are fine, extract later
3. **Skip Edge Cases** - Happy path only for now
4. **Placeholder Everything** - Cubes, debug text, temp sounds
5. **Comment Intent** - Mark what's temporary vs keeper code
   </action>

<action>For each implementation step:

1. **Create/Modify** - Write the minimum code
2. **Test Immediately** - Run and verify
3. **Iterate Quickly** - Adjust based on feel
4. **Mark Progress** - Note what works
   </action>

<critical>Speed over perfection - you're testing an IDEA, not shipping code</critical>

</step>

<step n="4" goal="Playtest and evaluate">

<action>Run through the success criteria:

For each criterion:

- [ ] Pass/Fail status
- [ ] Notes on feel/behavior
- [ ] Ideas for improvement
      </action>

<output>**Prototype Complete!**

**What was built:** {{prototype_summary}}
**Files Created/Modified:** {{files_list}}

**Success Criteria Results:**
{{criteria_results}}

**Observations:**
{{playtest_notes}}

**Next Steps:**

- [d] **Develop further** - Use quick-dev for production implementation
- [i] **Iterate** - Adjust and re-test
- [a] **Archive** - Keep as reference, move on
  </output>

<ask>**How did the prototype feel?**

Share your playtest observations. What worked? What didn't?
What's the next action?

**[d]** Develop this into production code
**[i]** Iterate on the prototype
**[a]** Archive and move on</ask>

<check if="d">
  <action>Load and execute {quick_dev_workflow} with prototype as reference</action>
</check>

<check if="i">
  <goto>step_3</goto>
</check>

<check if="a">
  <action>Document learnings, mark prototype as archived</action>
  <output>**Prototype Archived**

Learnings documented. When ready for production, use `quick-dev` with this prototype as reference.</output>
</check>

</step>

</workflow>
