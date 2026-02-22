# Scenario Initialization Dialog

**Agents**: Freya WDS Designer Agent + Idunn WDS PM Agent  
**Purpose**: Define a complete user scenario before creating page specifications or prototypes  
**Output**: `[Scenario-Number]-[Scenario-Name].md` (scenario specification)

---

## 🎯 **When to Use This Workflow**

**Use when**:
- Starting a new user journey/scenario
- No scenario specification exists yet
- Need to define what pages belong in this scenario

**Skip when**:
- Scenario specification already exists
- Just adding one new page to existing scenario

---

## 🤝 **Collaboration Approach**

**Both agents contribute**:
- Idunn brings **business perspective** (goals, metrics, value)
- Freya brings **UX perspective** (flow, interactions, usability)

**Either agent can initiate** this dialog, then both collaborate.

---

## 📝 **The Dialog**

### **Step 1: Scenario Overview**

> "**Let's define this user scenario together!**
>
> **What is the high-level purpose of this scenario?**
>
> In one sentence, what is the user trying to accomplish?"

**Wait for response**

**Example**: "Family members coordinate who walks the dog each day"

**Record**:
- `scenario.overview`

---

### **Step 2: User Context**

> "**Who is the user and what's their situation?**
>
> Tell me about:
> - Who is the primary user? (role, characteristics)
> - What's their context? (where are they, what's happening)
> - What triggered them to start this journey?"

**Wait for response**

**Example**: 
- User: Family member (parent or child)
- Context: Planning the upcoming week, needs to coordinate dog care
- Trigger: New week starting, family needs to divide dog walking responsibilities

**Record**:
- `scenario.user_context`
- `scenario.trigger_points`

---

### **Step 2b: Link to Trigger Map** (if Trigger Map exists)

**Check**: Does `docs/B-Trigger-Map/` folder exist?

**If YES**:
> "**I see you have a Trigger Map defined!**
>
> **Which trigger(s) from your Trigger Map does this scenario address?**
>
> [Agent reads Trigger Map and lists triggers]
>
> Available triggers:
> - [Trigger ID] [Trigger name]
> - [Trigger ID] [Trigger name]
> ...
>
> **Which trigger(s) does this scenario solve?** (list IDs or 'none')"

**Wait for response**

**Example**:
- TM-03: "Dog forgotten at home all day" 
- TM-07: "Family arguments about who's not pulling their weight"
- TM-12: "Kids not taking responsibility for pet care"

**Record**:
- `scenario.trigger_map_links` (array of trigger IDs)

**If NO Trigger Map**: Skip this step

---

### **Step 3: User Goals**

> "**What are the user's specific goals?**
>
> List 2-5 concrete goals they want to achieve."

**Wait for response**

**Example**:
1. See who has walked the dog this week
2. Book a time slot to walk the dog
3. Track their contributions vs. other family members
4. Get reminded when it's their turn

**Record**:
- `scenario.user_goals` (array)

---

### **Step 4: User Value & Fears**

> "**How will completing this scenario add value to the user?**
>
> **Positive Goals** (what they want to achieve):
> - [Suggest 3-5 positive goals based on scenario]
>
> **Fears to Avoid** (what they want to prevent):
> - [Suggest 3-5 fears/concerns based on scenario]
>
> **Does this match their motivations? Any adjustments?**"

**Wait for response**

**Example**:

**Positive Goals**:
- Feel organized and in control of dog care
- Contribute fairly without being nagged
- See appreciation for their efforts
- Spend quality time with the dog
- Maintain family harmony

**Fears to Avoid**:
- Dog being neglected or forgotten
- Unfair distribution of responsibilities
- Family conflict over who's doing more
- Being blamed for missed walks
- Feeling guilty about not contributing

**Record**:
- `scenario.user_positive_goals` (array)
- `scenario.user_fears` (array)

---

### **Step 5: Success Criteria**

> "**How do we know the user succeeded?**
>
> What does success look like? What metrics matter?"

**Wait for response**

**Example**:
- User successfully books a walk
- Family coordination is visible
- Dog gets walked regularly (all slots filled)
- Fair distribution of responsibilities

**Record**:
- `scenario.success_criteria` (array)

---

### **Step 5: Entry Points**

> "**How does the user enter this scenario?**
>
> Where are they coming from? What actions lead them here?"

**Wait for response**

**Example**:
- From home dashboard ("Dog Calendar" tab)
- From notification ("Your turn to walk Rufus!")
- From family chat ("Who's walking the dog?")

**Record**:
- `scenario.entry_points` (array)

---

### **Step 6: Exit Points**

> "**Where does the user go after completing this scenario?**
>
> What are the natural next steps?"

**Wait for response**

**Example**:
- Back to home dashboard
- To dog health tracking (after walk completed)
- To family leaderboard (check standings)
- Exit app (done for now)

**Record**:
- `scenario.exit_points` (array)

---

### **Step 7: Pages in Scenario**

> "**Let's map out the pages needed for this journey.**
>
> I'll suggest pages based on the goals, you can adjust.
>
> **Proposed pages**:
> 1. [Page number] [Page name] - [Purpose]
> 2. [Page number] [Page name] - [Purpose]
> ...
>
> **Does this flow make sense? Any pages to add/remove/change?**"

**Wait for response**

**Example**:
1. 3.1 Dog Calendar Booking - View week, book walks, see family contributions
2. 3.2 Walk In Progress - Start/complete walk with timer
3. 3.3 Walk Summary - Review completed walk, add notes

**Record**:
- `scenario.pages` (array with page_number, page_name, purpose, sequence)

---

### **Step 8: Key Interactions**

> "**What are the critical moments in this journey?**
>
> What interactions are most important to get right?"

**Wait for response**

**Example**:
- Viewing available time slots (must be clear and fast)
- Booking a walk (must be instant feedback)
- Seeing real-time updates (when someone else books)
- Starting a walk (clear transition, timer visible)

**Record**:
- `scenario.key_interactions` (array)

---

### **Step 9: Edge Cases & Challenges**

> "**What could go wrong? What edge cases should we handle?**"

**Wait for response**

**Example**:
- Someone books same slot simultaneously
- User tries to book when dog already out walking
- No one has booked upcoming slots (motivation needed)
- Child vs. parent permissions (can child edit others' bookings?)

**Record**:
- `scenario.edge_cases` (array)

---

### **Step 10: Business Value** (Idunn's focus)

> "**Idunn, what's the business value of this scenario?**
>
> **How will users completing this scenario add value to business goals?**
>
> I'll suggest based on what we've discussed:
>
> **Suggested Business Value**:
> - [Value 1]
> - [Value 2]
> - [Value 3]
>
> **Metrics to track**:
> - [Metric 1]
> - [Metric 2]
> - [Metric 3]
>
> **Does this align with business goals? Any adjustments?**"

**Wait for response**

**Example**:

**Business Value**:
- Increases family engagement (active users per family)
- Reduces pet neglect (walks completed per week)
- Demonstrates app value (feature usage = retention)
- Drives word-of-mouth (families share success)
- Premium feature potential (leaderboard, insights)

**Metrics**:
- Walks booked vs. completed ratio
- Family participation rate (% of members active)
- Daily active users
- Feature retention (return rate)
- NPS increase

**Record**:
- `scenario.business_value`
- `scenario.metrics` (array)

---

### **Step 11: UX Priorities** (Freya's focus)

> "**Freya, what are the top UX priorities for this scenario?**
>
> What must we get right for great user experience?"

**Wait for response**

**Example**:
- Speed: Calendar loads instantly
- Clarity: Week view shows all info at a glance
- Feedback: Booking feels immediate and satisfying
- Gamification: Leaderboard motivates participation
- Mobile-first: Easy to book on-the-go

**Record**:
- `scenario.ux_priorities` (array)

---

## ✅ **Step 12: Create Scenario Specification**

**Agent creates**: `docs/C-UX-Scenarios/[Number]-[Name]/[Number]-[Name].md`

**File structure**:
```markdown
# [Scenario Number]: [Scenario Name]

## Overview
[One sentence purpose]

## User Context
**Who**: [Primary user role/characteristics]
**Context**: [Situation/environment]
**Trigger**: [What prompted this journey]

## Trigger Map Links
**Addresses these pain points**:
- [Trigger ID] [Trigger name from Trigger Map]
- [Trigger ID] [Trigger name from Trigger Map]
...

_(If no Trigger Map exists, omit this section)_

## User Goals
1. [Goal 1]
2. [Goal 2]
...

## User Value & Fears

### Positive Goals (What Users Want)
- [Positive goal 1]
- [Positive goal 2]
...

### Fears to Avoid (What Users Want to Prevent)
- [Fear 1]
- [Fear 2]
...

## Success Criteria
- [Criterion 1]
- [Criterion 2]
...

## Entry Points
- [Entry point 1]
- [Entry point 2]
...

## Exit Points
- [Exit point 1]
- [Exit point 2]
...

## Pages in This Scenario

### [Page Number] [Page Name]
**Purpose**: [Why this page exists]
**Sequence**: [When it appears in journey]
**Key Actions**: [What user does here]

[Repeat for each page...]

## Key Interactions
- [Interaction 1]
- [Interaction 2]
...

## Edge Cases
- [Edge case 1]
- [Edge case 2]
...

## Business Value
[Why this matters]

**Metrics**:
- [Metric 1]
- [Metric 2]
...

## UX Priorities
1. [Priority 1]
2. [Priority 2]
...

## Notes
[Any additional context]

---

**Status**: Defined  
**Created by**: [Agent name]  
**Date**: [Date]
```

---

## 🎉 **Step 13: Completion**

> "✅ **Scenario specification created!**
>
> **File**: `docs/C-UX-Scenarios/[Number]-[Name]/[Number]-[Name].md`
>
> **Next steps**:
> 1. **Update Trigger Map** (add link to this scenario from triggers)
> 2. **Create page specifications** (for each page in scenario)
> 3. **Create interactive prototypes** (if needed)
> 4. **Validate with stakeholders** (review scenario flow)
>
> **Would you like to**:
> - Update the Trigger Map with this scenario link?
> - Start defining page specifications?
> - Create prototypes?
> - Review the scenario doc?"

**If user wants to update Trigger Map**:

**Actions**:
1. Read `docs/B-Trigger-Map/[Trigger-Map-File].md` for each linked trigger
2. Add scenario link to each trigger's "How We Address This" or "Related Scenarios" section:
   ```markdown
   **Addressed in**: [Scenario 03: Booking Dog Walks](../C-UX-Scenarios/03-Booking-Dog-Walks/03-Booking-Dog-Walks.md)
   ```
3. Confirm updates complete

---

## 📋 **Example Complete Exchange**

**User**: "I want to create a scenario for booking dog walks"

**Idunn**: "Great! Let's define this together. I'll collaborate with Freya. What's the high-level purpose?"

**User**: "Family members coordinate who walks the dog each day"

**Freya**: "Perfect! Who is the primary user and what's their context?"

**User**: "Any family member - parent or child - planning the week ahead"

**Idunn**: "What are their specific goals?"

**User**: "See who walked the dog, book a time slot, track contributions, get fair distribution"

**Freya**: "How do we know they succeeded?"

**User**: "They book a walk, see it confirmed, family coordination is visible"

[Dialog continues through all questions...]

**Idunn & Freya**: "✅ Scenario specification created! Ready to create page specs?"

---

## 💡 **Tips for Both Agents**

**Idunn focuses on**:
- Business goals and metrics
- Value to users and business
- Priority and scope
- Success measurement

**Freya focuses on**:
- User experience flow
- Key interactions
- Visual journey
- Usability and delight

**Both contribute to**:
- Complete scenario understanding
- Page identification and sequencing
- Edge case identification
- Overall quality
- Linking scenarios back to Trigger Map (traceability)

---

## 🔗 **Trigger Map Integration**

**Why link scenarios to triggers?**:
- ✅ **Traceability**: See which pain points are addressed
- ✅ **Coverage**: Identify triggers not yet solved
- ✅ **Validation**: Ensure solutions match problems
- ✅ **Stakeholder clarity**: Show how software solves real problems
- ✅ **Prioritization**: Focus on high-impact triggers first

**Bidirectional linking**:
- **In Trigger Map**: "Addressed in Scenario X"
- **In Scenario**: "Solves Trigger Y, Z from Trigger Map"

**This creates a complete story**: Problem → Solution → Implementation

---

**This dialog should take 10-15 minutes and result in a complete scenario specification!** 🎯

