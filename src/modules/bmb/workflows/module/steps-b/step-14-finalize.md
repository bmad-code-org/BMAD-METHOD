---
name: 'step-14-finalize'
description: 'Final polish, output the brief document'

briefTemplateFile: '../../templates/brief-template.md'
bmbCreationsOutputFolder: '{bmb_creations_output_folder}'
---

# Step 14: Finalize

## STEP GOAL:

Create the final module brief document and save it to the bmb-creations output folder.

## MANDATORY EXECUTION RULES:

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:
- ✅ You are the **Module Architect** — completing the brief
- ✅ Assemble everything into a beautiful document
- ✅ Celebrate the completion!

---

## MANDATORY SEQUENCE

### 1. Load Template

Load `{briefTemplateFile}` to use as the base.

### 2. Assemble the Brief

Fill in all sections with what we've gathered:

**Frontmatter:**
- date: {today's date}
- user_name: {from config}
- module_code: {from step 5}
- module_type: {from step 3}
- status: "Ready for Development"

**Executive Summary:**
- module_vision: {from step 4}
- module_category: {derived from vision}
- target_users: {from step 6}
- complexity_level: {assess from agent/workflow count}

**Module Identity:**
- module_code, module_name: {from step 5}
- module_identity: {vision summary}
- personality_theme: {from step 5 or step 12}

**Module Type:**
- module_type: {from step 3}
- module_type_explanation: {explain the choice}

**Unique Value Proposition:**
- unique_value_proposition: {from step 7}
- value_proposition_details: {elaborate}

**User Scenarios:**
- target_users: {from step 6}
- primary_use_case: {from step 11}
- user_journey: {from step 11}

**Agent Architecture:**
- agent_count_strategy: {single or multi, why}
- agent_roster_table: {from step 8}
- agent_interaction_model: {how they work together}
- agent_communication_style: {from step 8}

**Workflow Ecosystem:**
- core_workflows: {from step 9}
- feature_workflows: {from step 9}
- utility_workflows: {from step 9}

**Tools & Integrations:**
- mcp_tools: {from step 10}
- external_services: {from step 10}
- module_integrations: {from step 10}

**Creative Features:**
- creative_personality: {from step 12}
- easter_eggs: {from step 12}
- module_lore: {from step 12}

### 3. Write the Brief File

Save to: `{bmbCreationsOutputFolder}/modules/module-brief-{module_code}.md`

### 4. Celebrate and Next Steps

"**🎉 Your module brief is complete!**"

"**Saved to:** {file path}"

"**Next steps:**"
1. **Review the brief** — Make sure it captures your vision
2. **Run the module workflow (Create mode)** — This will build the module structure
3. **Create agents** — Use the agent-builder workflow for each agent
4. **Create workflows** — Use the workflow-builder workflow for each workflow
5. **Test and iterate** — Install and refine

"**You've created something amazing. Let's build it!**"

---

## Success Metrics

✅ Brief document created and saved
✅ All sections filled with gathered information
✅ File path provided to user
✅ Next steps clearly explained
