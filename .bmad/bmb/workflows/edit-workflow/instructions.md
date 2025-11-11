# Edit Workflow - Workflow Editor Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/edit-workflow/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication based on context and user needs</critical>
<critical>The goal is COLLABORATIVE IMPROVEMENT - work WITH the user, not FOR them</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Load and deeply understand the target workflow">
<ask>What is the path to the workflow you want to edit? (provide path to workflow.yaml or workflow directory)</ask>

<action>Load the target workflow completely:

- workflow.yaml configuration
- instructions.md (if exists)
- template.md (if exists)
- checklist.md (if exists)
- Any additional data files referenced
  </action>

<action>Load ALL workflow documentation to inform understanding:

- Workflow creation guide: {workflow_creation_guide}
- Workflow execution engine: {workflow_execution_engine}
- Study example workflows from: {project-root}/.bmad/bmm/workflows/
  </action>

<action>Analyze the workflow deeply:

- Identify workflow type (document, action, interactive, autonomous, meta)
- Understand purpose and user journey
- Map out step flow and logic
- Check variable consistency across files
- Evaluate instruction style (intent-based vs prescriptive)
- Assess template structure (if applicable)
- Review validation criteria
- Identify config dependencies
- Check for web bundle configuration
- Evaluate against best practices from loaded guides
  </action>

<action>Reflect understanding back to {user_name}:

Present a warm, conversational summary adapted to the workflow's complexity:

- What this workflow accomplishes (its purpose and value)
- How it's structured (type, steps, interactive points)
- What you notice (strengths, potential improvements, issues)
- Your initial assessment based on best practices
- How it fits in the larger BMAD ecosystem

Be conversational and insightful. Help {user_name} see their workflow through your eyes.
</action>

<ask>Does this match your understanding of what this workflow should accomplish?</ask>
<template-output>workflow_understanding</template-output>
</step>

<step n="2" goal="Discover improvement goals collaboratively">
<critical>Understand WHAT the user wants to improve and WHY before diving into edits</critical>

<action>Engage in collaborative discovery:

Ask open-ended questions to understand their goals:

- What prompted you to want to edit this workflow?
- What feedback have you gotten from users running it?
- Are there specific steps that feel clunky or confusing?
- Is the workflow achieving its intended outcome?
- Are there new capabilities you want to add?
- Is the instruction style working well for your users?

Listen for clues about:

- User experience issues (confusing steps, unclear instructions)
- Functional issues (broken references, missing validation)
- Performance issues (too many steps, repetitive, tedious)
- Maintainability issues (hard to update, bloated, inconsistent variables)
- Instruction style mismatch (too prescriptive when should be adaptive, or vice versa)
- Integration issues (doesn't work well with other workflows)
  </action>

<action>Based on their responses and your analysis from step 1, identify improvement opportunities:

Organize by priority and user goals:

- CRITICAL issues blocking successful runs
- IMPORTANT improvements enhancing user experience
- NICE-TO-HAVE enhancements for polish

Present these conversationally, explaining WHY each matters and HOW it would help.
</action>

<action>Assess instruction style fit:

Based on the workflow's purpose and your analysis:

- Is the current style (intent-based vs prescriptive) appropriate?
- Would users benefit from more/less structure?
- Are there steps that should be more adaptive?
- Are there steps that need more specificity?

Discuss style as part of improvement discovery, not as a separate concern.
</action>

<action>Collaborate on priorities:

Don't just list options - discuss them:

- "I noticed {{issue}} - this could make users feel {{problem}}. Want to address this?"
- "The workflow could be more {{improvement}} which would help when {{use_case}}. Worth exploring?"
- "Based on what you said about {{user_goal}}, we might want to {{suggestion}}. Thoughts?"

Let the conversation flow naturally. Build a shared vision of what "better" looks like.
</action>

<template-output>improvement_goals</template-output>
</step>

<step n="3" goal="Facilitate improvements collaboratively" repeat="until-user-satisfied">
<critical>Work iteratively - improve, review, refine. Never dump all changes at once.</critical>

<action>For each improvement area, facilitate collaboratively:

1. **Explain the current state and why it matters**
   - Show relevant sections of the workflow
   - Explain how it works now and implications
   - Connect to user's goals from step 2

2. **Propose improvements with rationale**
   - Suggest specific changes that align with best practices
   - Explain WHY each change helps
   - Provide examples from the loaded guides when helpful
   - Show before/after comparisons for clarity
   - Reference the creation guide's patterns naturally

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

**If refining instruction style:**

- Discuss where the workflow feels too rigid or too loose
- Identify steps that would benefit from intent-based approach
- Identify steps that need prescriptive structure
- Convert between styles thoughtfully, explaining tradeoffs
- Show how each style serves the user differently
- Test proposed changes by reading them aloud

**If improving step flow:**

- Walk through the user journey step by step
- Identify friction points or redundancy
- Propose streamlined flow
- Consider where steps could merge or split
- Ensure each step has clear goal and value
- Check that repeat conditions make sense

**If fixing variable consistency:**

- Identify variables used across files
- Find mismatches in naming or usage
- Propose consistent naming scheme
- Update all files to match
- Verify variables are defined in workflow.yaml

**If enhancing validation:**

- Review current checklist (if exists)
- Discuss what "done well" looks like
- Make criteria specific and measurable
- Add validation for new features
- Remove outdated or vague criteria

**If updating configuration:**

- Review standard config pattern
- Check if user context variables are needed
- Ensure output_folder, user_name, communication_language are used appropriately
- Add missing config dependencies
- Clean up unused config fields

**If adding/updating templates:**

- Understand the document structure needed
- Design template variables that match instruction outputs
- Ensure variable names are descriptive snake_case
- Include proper metadata headers
- Test that all variables can be filled

**If configuring web bundle:**

- Identify all files the workflow depends on
- Check for invoked workflows (must be included)
- Verify paths are .bmad/-relative
- Remove config_source dependencies
- Build complete file list

**If improving user interaction:**

- Find places where <ask> could be more open-ended
- Add educational context where users might be lost
- Remove unnecessary confirmation steps
- Make questions clearer and more purposeful
- Balance guidance with user autonomy
  </action>

<action>Throughout improvements, educate when helpful:

Share insights from the guides naturally:

- "The creation guide recommends {{pattern}} for workflows like this"
- "Looking at examples in BMM, this type of step usually {{approach}}"
- "The execution engine expects {{structure}} for this to work properly"

Connect improvements to broader BMAD principles without being preachy.
</action>

<ask>After each significant change:

- "Does this flow feel better for what you're trying to achieve?"
- "Want to refine this further, or move to the next improvement?"
- "How does this change affect the user experience?"
  </ask>

<template-output>improvement_implementation</template-output>
</step>

<step n="4" goal="Validate improvements holistically">
<action>Run comprehensive validation conversationally:

Don't just check boxes - explain what you're validating and why it matters:

- "Let me verify all file references resolve correctly..."
- "Checking that variables are consistent across all files..."
- "Making sure the step flow is logical and complete..."
- "Validating template variables match instruction outputs..."
- "Ensuring config dependencies are properly set up..."
  </action>

<action>Load validation checklist: {installed_path}/checklist.md</action>
<action>Check all items from checklist systematically</action>

<check if="validation_issues_found">
  <action>Present issues conversationally:

Explain what's wrong and implications:

- "I found {{issue}} which could cause {{problem}} when users run this"
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

- All file references resolve
- Variables are consistent throughout
- Step flow is logical and complete
- Template aligns with instructions (if applicable)
- Config dependencies are set up correctly
- Web bundle is complete (if applicable)

Your workflow is in great shape."
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
- "Now your workflow {{improved_capabilities}}"

Highlight the impact:

- "This means users will experience {{benefit}}"
- "The workflow is now more {{quality}}"
- "It follows best practices for {{patterns}}"
  </action>

<action>Guide next steps based on changes made:

If instruction style changed:

- "Since we made the workflow more {{style}}, you might want to test it with a real user to see how it feels"

If template was updated:

- "The template now has {{new_variables}} - run the workflow to generate a sample document"

If this is part of larger module work:

- "This workflow is part of {{module}} - consider if other workflows need similar improvements"

If web bundle was configured:

- "The web bundle is now set up - you can test deploying this workflow standalone"

Be a helpful guide to what comes next, not just a task completer.
</action>

<ask>Would you like to:

- Test the edited workflow by running it
- Edit another workflow
- Make additional refinements to this one
- Return to your module work
  </ask>

<template-output>completion_summary</template-output>
</step>

</workflow>
