# Edit Agent - Agent Editor Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/edit-agent/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication based on context and user needs</critical>
<critical>The goal is COLLABORATIVE IMPROVEMENT - work WITH the user, not FOR them</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Load and deeply understand the target agent">
<ask>What is the path to the agent you want to edit?</ask>

<action>Load the agent file from the provided path</action>
<action>Load ALL agent documentation to inform understanding:

- Agent types guide: {agent_types}
- Agent architecture: {agent_architecture}
- Command patterns: {agent_commands}
- Communication styles: {communication_styles}
- Workflow execution engine: {workflow_execution_engine}
  </action>

<action>Analyze the agent structure thoroughly:

- Parse persona (role, identity, communication_style, principles)
- Understand activation flow and steps
- Map menu items and their workflows
- Identify configuration dependencies
- Assess agent type (full, hybrid, standalone)
- Check workflow references for validity
- Evaluate against best practices from loaded guides
  </action>

<action>Reflect understanding back to {user_name}:

Present a warm, conversational summary adapted to the agent's complexity:

- What this agent does (its role and purpose)
- How it's structured (type, menu items, workflows)
- What you notice (strengths, potential improvements, issues)
- Your initial assessment of its health

Be conversational, not clinical. Help {user_name} see their agent through your eyes.
</action>

<ask>Does this match your understanding of what this agent should do?</ask>
<template-output>agent_understanding</template-output>
</step>

<step n="2" goal="Discover improvement goals collaboratively">
<critical>Understand WHAT the user wants to improve and WHY before diving into edits</critical>

<action>Engage in collaborative discovery:

Ask open-ended questions to understand their goals:

- What prompted you to want to edit this agent?
- What isn't working the way you'd like?
- Are there specific behaviors you want to change?
- Is there functionality you want to add or remove?
- How do users interact with this agent? What feedback have they given?

Listen for clues about:

- Functional issues (broken references, missing workflows)
- User experience issues (confusing menu, unclear communication)
- Performance issues (too slow, too verbose, not adaptive enough)
- Maintenance issues (hard to update, bloated, inconsistent)
- Integration issues (doesn't work well with other agents/workflows)
  </action>

<action>Based on their responses and your analysis from step 1, identify improvement opportunities:

Organize by priority and user goals:

- CRITICAL issues blocking functionality
- IMPORTANT improvements enhancing user experience
- NICE-TO-HAVE enhancements for polish

Present these conversationally, explaining WHY each matters and HOW it would help.
</action>

<action>Collaborate on priorities:

Don't just list options - discuss them:

- "I noticed {{issue}} - this could cause {{problem}}. Does this concern you?"
- "The agent could be more {{improvement}} which would help when {{use_case}}. Worth exploring?"
- "Based on what you said about {{user_goal}}, we might want to {{suggestion}}. Thoughts?"

Let the conversation flow naturally. Build a shared vision of what "better" looks like.
</action>

<template-output>improvement_goals</template-output>
</step>

<step n="3" goal="Facilitate improvements collaboratively" repeat="until-user-satisfied">
<critical>Work iteratively - improve, review, refine. Never dump all changes at once.</critical>

<action>For each improvement area, facilitate collaboratively:

1. **Explain the current state and why it matters**
   - Show relevant sections of the agent
   - Explain how it works now and implications
   - Connect to user's goals from step 2

2. **Propose improvements with rationale**
   - Suggest specific changes that align with best practices
   - Explain WHY each change helps
   - Provide examples from the loaded guides when helpful
   - Show before/after comparisons for clarity

3. **Collaborate on the approach**
   - Ask if the proposed change addresses their need
   - Invite modifications or alternative approaches
   - Explain tradeoffs when relevant
   - Adapt based on their feedback

4. **Apply changes iteratively**
   - Make one focused improvement at a time
   - Show the updated section
   - Confirm it meets their expectation
   - Move to next improvement or refine current one
     </action>

<action>Common improvement patterns to facilitate:

**If fixing broken references:**

- Identify all broken paths
- Explain what each reference should point to
- Verify new paths exist before updating
- Update and confirm working

**If refining persona/communication:**

- Review current persona definition
- Discuss desired communication style with examples
- Explore communication styles guide for patterns
- Refine language to match intent
- Test tone with example interactions

**If updating activation:**

- Walk through current activation flow
- Identify bottlenecks or confusion points
- Propose streamlined flow
- Ensure config loading works correctly
- Verify all session variables are set

**If managing menu items:**

- Review current menu organization
- Discuss if structure serves user mental model
- Add/remove/reorganize as needed
- Ensure all workflow references are valid
- Update triggers to be intuitive

**If enhancing menu handlers:**

- Explain current handler logic
- Identify where handlers could be smarter
- Propose enhanced logic based on agent architecture patterns
- Ensure handlers properly invoke workflows

**If optimizing agent type:**

- Discuss whether current type fits use case
- Explain characteristics of full/hybrid/standalone
- If converting, guide through structural changes
- Ensure all pieces align with new type
  </action>

<action>Throughout improvements, educate when helpful:

Share insights from the guides naturally:

- "The agent architecture guide suggests {{pattern}} for this scenario"
- "Looking at the command patterns, we could use {{approach}}"
- "The communication styles guide has a great example of {{technique}}"

Connect improvements to broader BMAD principles without being preachy.
</action>

<ask>After each significant change:

- "Does this feel right for what you're trying to achieve?"
- "Want to refine this further, or move to the next improvement?"
- "Is there anything about this change that concerns you?"
  </ask>

<template-output>improvement_implementation</template-output>
</step>

<step n="4" goal="Validate improvements holistically">
<action>Run comprehensive validation conversationally:

Don't just check boxes - explain what you're validating and why it matters:

- "Let me verify all the workflow paths resolve correctly..."
- "Checking that the activation flow works smoothly..."
- "Making sure menu handlers are wired up properly..."
- "Validating config loading is robust..."
  </action>

<action>Load validation checklist: {installed_path}/checklist.md</action>
<action>Check all items from checklist systematically</action>

<check if="validation_issues_found">
  <action>Present issues conversationally:

Explain what's wrong and implications:

- "I found {{issue}} which could cause {{problem}}"
- "The {{component}} needs {{fix}} because {{reason}}"

Propose fixes immediately:

- "I can fix this by {{solution}}. Should I?"
- "We have a couple options here: {{option1}} or {{option2}}. Thoughts?"
  </action>

<action>Fix approved issues and re-validate</action>
</check>

<check if="validation_passes">
  <action>Confirm success warmly:

"Excellent! Everything validates cleanly:

- All paths resolve correctly
- Activation flow is solid
- Menu structure is clear
- Handlers work properly
- Config loading is robust

Your agent is in great shape."
</action>
</check>

<template-output>validation_results</template-output>
</step>

<step n="5" goal="Review improvements and guide next steps">
<action>Create a conversational summary of what improved:

Tell the story of the transformation:

- "We started with {{initial_state}}"
- "You wanted to {{user_goals}}"
- "We made these key improvements: {{changes_list}}"
- "Now your agent {{improved_capabilities}}"

Highlight the impact:

- "This means users will experience {{benefit}}"
- "The agent is now more {{quality}}"
- "It follows best practices for {{patterns}}"
  </action>

<action>Guide next steps based on changes made:

If significant structural changes:

- "Since we restructured the activation, you should test the agent with a real user interaction"

If workflow references changed:

- "The agent now uses {{new_workflows}} - make sure those workflows are up to date"

If this is part of larger module work:

- "This agent is part of {{module}} - consider if other agents need similar improvements"

Be a helpful guide to what comes next, not just a task completer.
</action>

<ask>Would you like to:

- Test the edited agent by invoking it
- Edit another agent
- Make additional refinements to this one
- Return to your module work
  </ask>

<template-output>completion_summary</template-output>
</step>

</workflow>
