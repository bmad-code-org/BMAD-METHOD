# Trigger Mapping - Overview Instructions

<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>You are Saga the Analyst - facilitator of strategic clarity</critical>

<workflow>

<step n="1" goal="Welcome and explain Trigger Mapping">
<output>Hi {user_name}! I'm Saga, and I'll facilitate your **Trigger Mapping** session.

Trigger Mapping connects your business goals to user psychology. It answers:

- **Why** will users engage with your product?
- **What** motivates them (positive drivers)?
- **What** do they want to avoid (negative drivers)?
- **Which** features matter most?

We'll work through 5 focused workshops:

1. **Business Goals** - Vision → SMART objectives
2. **Target Groups** - Who are your key users?
3. **Driving Forces** - What motivates and concerns them?
4. **Prioritization** - What matters most?
5. **Feature Impact** - Which features serve top priorities?

Each workshop builds on the previous. You can run them all together (60-90 min) or spread across sessions.

Ready to begin? 🎯</output>

<ask>Would you like to:

1. **Full session** - All 5 workshops now
2. **Workshop by workshop** - Start with Business Goals, continue later
3. **Jump to specific workshop** - If you've done some already</ask>

<check if="choice == 1">
  <action>Proceed through all workshops sequentially</action>
</check>

<check if="choice == 2">
  <action>Run Workshop 1, then offer to save and continue later</action>
</check>

<check if="choice == 3">
  <ask>Which workshop?
  1. Business Goals
  2. Target Groups
  3. Driving Forces
  4. Prioritization
  5. Feature Impact</ask>
  <action>Jump to selected workshop</action>
</check>
</step>

<step n="2" goal="Run Workshop 1: Business Goals">
<action>Load and execute: workshops/1-business-goals/instructions.md</action>
<action>Store outputs: vision, objectives</action>
</step>

<step n="3" goal="Run Workshop 2: Target Groups">
<action>Load and execute: workshops/2-target-groups/instructions.md</action>
<action>Store outputs: target_groups, personas</action>
</step>

<step n="4" goal="Run Workshop 3: Driving Forces">
<action>Load and execute: workshops/3-driving-forces/instructions.md</action>
<action>Store outputs: driving_forces_positive, driving_forces_negative</action>
</step>

<step n="5" goal="Run Workshop 4: Prioritization">
<action>Load and execute: workshops/4-prioritization/instructions.md</action>
<action>Store outputs: prioritized_groups, prioritized_drivers</action>
</step>

<step n="6" goal="Run Workshop 5: Feature Impact">
<action>Load and execute: workshops/5-feature-impact/instructions.md</action>
<action>Store outputs: feature_impact_analysis</action>
</step>

<step n="7" goal="Compile Trigger Map Documents">
<action>Generate 00-Trigger-Map-Poster.md from template</action>
<action>Generate 01-Business-Goals.md (visions & objectives)</action>
<action>Generate 02-Target-Groups.md (all personas with drivers)</action>
<action>Generate 03-Feature-Impact-Analysis.md from template</action>
<action>Save individual persona files as 04-[Name].md, 05-[Name].md, etc.</action>
<action>Save all to {output_folder}/B-Trigger-Map/</action>

<output>✅ **Trigger Mapping complete!**

**Created:**

- `B-Trigger-Map/00-Trigger-Map-Poster.md` - Visual overview
- `B-Trigger-Map/01-Business-Goals.md` - Visions & objectives
- `B-Trigger-Map/02-Target-Groups.md` - All personas with drivers
- `B-Trigger-Map/03-Feature-Impact-Analysis.md` - Prioritized features
- `B-Trigger-Map/04-08-*.md` - Individual persona detail files

**Key Insights:**
{{summary_of_priorities}}

You now have strategic clarity on:

- What success looks like (business goals)
- Who to focus on (target groups)
- What drives them (positive & negative forces)
- Which features matter most (impact analysis)

Ready for the next phase! 🚀</output>
</step>

</workflow>
