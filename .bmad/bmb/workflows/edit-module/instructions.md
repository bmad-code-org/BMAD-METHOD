# Edit Module - Module Editor Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/edit-module/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication based on context and user needs</critical>
<critical>The goal is COLLABORATIVE IMPROVEMENT - work WITH the user, not FOR them</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Load and deeply understand the target module">
<ask>What is the path to the module you want to edit? (provide path to module directory like .bmad/bmm/ or src/modules/bmm/)</ask>

<action>Load the module directory structure completely:

- Scan all directories and files
- Load config.yaml
- Load README.md
- List all agents in agents/ directory
- List all workflows in workflows/ directory
- Check for installer files (if in src/modules/)
- Identify any custom structure or patterns
  </action>

<action>Load ALL module documentation to inform understanding:

- Module structure guide: {module_structure_guide}
- Study reference modules: BMM, BMB, CIS
- Understand BMAD module patterns and conventions
  </action>

<action>Analyze the module deeply:

- Identify module purpose and role in BMAD ecosystem
- Understand agent organization and relationships
- Map workflow organization and dependencies
- Evaluate config structure and completeness
- Check documentation quality and currency
- Assess installer configuration (if source module)
- Identify cross-module integrations
- Evaluate against best practices from loaded guides
  </action>

<action>Reflect understanding back to {user_name}:

Present a warm, conversational summary adapted to the module's complexity:

- What this module provides (its purpose and value in BMAD)
- How it's organized (agents, workflows, structure)
- What you notice (strengths, potential improvements, issues)
- How it fits in the larger BMAD ecosystem
- Your initial assessment based on best practices

Be conversational and insightful. Help {user_name} see their module through your eyes.
</action>

<ask>Does this match your understanding of what this module should provide?</ask>
<template-output>module_understanding</template-output>
</step>

<step n="2" goal="Discover improvement goals collaboratively">
<critical>Understand WHAT the user wants to improve and WHY before diving into edits</critical>

<action>Engage in collaborative discovery:

Ask open-ended questions to understand their goals:

- What prompted you to want to edit this module?
- What feedback have you gotten from users of this module?
- Are there specific agents or workflows that need attention?
- Is the module fulfilling its intended purpose?
- Are there new capabilities you want to add?
- How well does it integrate with other modules?
- Is the documentation helping users understand and use the module?

Listen for clues about:

- Structural issues (poor organization, hard to navigate)
- Agent/workflow issues (outdated, broken, missing functionality)
- Configuration issues (missing fields, incorrect setup)
- Documentation issues (outdated, incomplete, unclear)
- Integration issues (doesn't work well with other modules)
- Installer issues (installation problems, missing files)
- User experience issues (confusing, hard to use)
  </action>

<action>Based on their responses and your analysis from step 1, identify improvement opportunities:

Organize by priority and user goals:

- CRITICAL issues blocking module functionality
- IMPORTANT improvements enhancing user experience
- NICE-TO-HAVE enhancements for polish

Present these conversationally, explaining WHY each matters and HOW it would help.
</action>

<action>Collaborate on priorities:

Don't just list options - discuss them:

- "I noticed {{issue}} - this could make it hard for users to {{problem}}. Want to address this?"
- "The module could be more {{improvement}} which would help when {{use_case}}. Worth exploring?"
- "Based on what you said about {{user_goal}}, we might want to {{suggestion}}. Thoughts?"

Let the conversation flow naturally. Build a shared vision of what "better" looks like.
</action>

<template-output>improvement_goals</template-output>
</step>

<step n="3" goal="Facilitate improvements collaboratively" repeat="until-user-satisfied">
<critical>Work iteratively - improve, review, refine. Never dump all changes at once.</critical>
<critical>For agent and workflow edits, invoke specialized workflows rather than doing inline</critical>

<action>For each improvement area, facilitate collaboratively:

1. **Explain the current state and why it matters**
   - Show relevant sections of the module
   - Explain how it works now and implications
   - Connect to user's goals from step 2

2. **Propose improvements with rationale**
   - Suggest specific changes that align with best practices
   - Explain WHY each change helps
   - Provide examples from reference modules when helpful
   - Reference the structure guide's patterns naturally

3. **Collaborate on the approach**
   - Ask if the proposed change addresses their need
   - Invite modifications or alternative approaches
   - Explain tradeoffs when relevant
   - Adapt based on their feedback

4. **Apply changes appropriately**
   - For agent edits: Invoke edit-agent workflow
   - For workflow edits: Invoke edit-workflow workflow
   - For module-level changes: Make directly and iteratively
   - Show updates and confirm satisfaction
     </action>

<action>Common improvement patterns to facilitate:

**If improving module organization:**

- Discuss how the current structure serves (or doesn't serve) users
- Propose reorganization that aligns with mental models
- Consider feature-based vs type-based organization
- Plan the reorganization steps
- Update all references after moving files

**If updating module configuration:**

- Review current config.yaml fields
- Check for missing standard fields (user_name, communication_language, output_folder)
- Add module-specific fields as needed
- Remove unused or outdated fields
- Ensure config is properly documented

**If managing agents:**

- Ask which agent needs attention and why
- For editing existing agent: <invoke-workflow path="{agent_editor}">
- For adding new agent: Guide creation and integration
- For removing agent: Confirm, remove, update references
- Ensure all agent references in workflows remain valid

**If managing workflows:**

- Ask which workflow needs attention and why
- For editing existing workflow: <invoke-workflow path="{workflow_editor}">
- For adding new workflow: Guide creation and integration
- For removing workflow: Confirm, remove, update agent references
- Ensure all workflow files are properly organized

**If improving documentation:**

- Review current README and identify gaps
- Discuss what users need to know
- Update module overview and purpose
- List agents and workflows with clear descriptions
- Add usage examples if helpful
- Ensure installation/setup instructions are clear

**If setting up cross-module integration:**

- Identify which workflows from other modules are needed
- Show how to reference workflows properly: {project-root}/.bmad/{{module}}/workflows/{{workflow}}/workflow.yaml
- Document the integration in README
- Ensure dependencies are clear
- Consider adding example usage

**If updating installer (source modules only):**

- Review installer script for correctness
- Check web bundle configurations
- Verify all files are included
- Test installation paths
- Update module metadata
  </action>

<action>When invoking specialized workflows:

Explain why you're handing off:

- "This agent needs detailed attention. Let me invoke the edit-agent workflow to give it proper focus."
- "The workflow editor can handle this more thoroughly. I'll pass control there."

After the specialized workflow completes, return and continue:

- "Great! That agent/workflow is updated. Want to work on anything else in the module?"
  </action>

<action>Throughout improvements, educate when helpful:

Share insights from the guides naturally:

- "The module structure guide recommends {{pattern}} for this scenario"
- "Looking at how BMM organized this, we could use {{approach}}"
- "The BMAD convention is to {{pattern}} which helps with {{benefit}}"

Connect improvements to broader BMAD principles without being preachy.
</action>

<ask>After each significant change:

- "Does this organization feel more intuitive?"
- "Want to refine this further, or move to the next improvement?"
- "How does this change affect users of the module?"
  </ask>

<template-output>improvement_implementation</template-output>
</step>

<step n="4" goal="Validate improvements holistically">
<action>Run comprehensive validation conversationally:

Don't just check boxes - explain what you're validating and why it matters:

- "Let me verify the module structure is solid..."
- "Checking that all agent workflow references are valid..."
- "Making sure config.yaml has all necessary fields..."
- "Validating documentation is complete and accurate..."
- "Ensuring cross-module references work correctly..."
  </action>

<action>Load validation checklist: {installed_path}/checklist.md</action>
<action>Check all items from checklist systematically</action>

<check if="validation_issues_found">
  <action>Present issues conversationally:

Explain what's wrong and implications:

- "I found {{issue}} which could cause {{problem}} for users"
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

- Module structure is well-organized
- All agent and workflow references are valid
- Configuration is complete
- Documentation is thorough and current
- Cross-module integrations work properly
- Installer is correct (if applicable)

Your module is in great shape."
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
- "Now your module {{improved_capabilities}}"

Highlight the impact:

- "This means users will experience {{benefit}}"
- "The module is now more {{quality}}"
- "It follows best practices for {{patterns}}"
  </action>

<action>Guide next steps based on changes made:

If structure changed significantly:

- "Since we reorganized the structure, you should update any external references to this module"

If agents or workflows were updated:

- "The updated agents/workflows should be tested with real user interactions"

If cross-module integration was added:

- "Test the integration with {{other_module}} to ensure it works smoothly"

If installer was updated:

- "Test the installation process to verify all files are included correctly"

If this is part of larger BMAD work:

- "Consider if patterns from this module could benefit other modules"

Be a helpful guide to what comes next, not just a task completer.
</action>

<ask>Would you like to:

- Test the edited module by invoking one of its agents
- Edit a specific agent or workflow in more detail
- Make additional refinements to the module
- Work on a different module
  </ask>

<template-output>completion_summary</template-output>
</step>

</workflow>
