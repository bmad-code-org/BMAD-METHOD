# Gather Requirements - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow gathers requirements for n8n workflow creation.</critical>

<workflow>

  <step n="1" goal="Load Config and Initialize">
    <action>Resolve variables from config_source: requirements_folder, output_folder, user_name, communication_language</action>
    <action>Create {{requirements_folder}} directory if it does not exist</action>
    <action>Load template from {{template}}</action>
  </step>

  <step n="2" goal="Gather Requirements" elicit="true">
    <critical>Ask questions ONE AT A TIME and WAIT for user response after each question</critical>

    <ask>Question 1: What problem are you trying to solve with this automation?

Describe the current manual process, pain points, and desired outcome.</ask>
    <action>WAIT for user input</action>
    <action>Store response in {{problem_description}}</action>

    <action>Perform web search to understand the use case:</action>
    <action>- "n8n workflow for [problem description] site:docs.n8n.io"</action>
    <action>- "n8n automation [problem description] best practices"</action>
    <action>Store findings in {{use_case_research}}</action>

    <ask>Question 2: What triggers this process? When should the automation run?

Options:
1. When data arrives - Webhook, form submission, API call
2. On a schedule - Every hour, daily, weekly, custom cron
3. When something changes - Database update, file change, service event
4. Manually - On-demand execution
5. Multiple triggers - Combination of above
6. Not sure - Help me decide based on my problem

Enter your selection (1-6):</ask>
    <action>WAIT for user input</action>
    <action>Store response in {{trigger_type}}</action>

    <check if="selection is 6">
      <action>Analyze {{problem_description}} and suggest appropriate trigger</action>
      <ask>Based on your problem, I recommend [trigger type]. Does this make sense? (yes/no)</ask>
      <action>WAIT for confirmation</action>
      <action>Store final trigger in {{trigger_type}}</action>
    </check>

    <ask>Question 3: What data or information does this workflow need to work with?

Examples: Customer data, order details, form responses, API data, etc.</ask>
    <action>WAIT for user input</action>
    <action>Store response in {{data_requirements}}</action>

    <ask>Question 4: What should happen with this data? What's the desired outcome?

Examples: Send to Slack, update database, create invoice, notify team, etc.</ask>
    <action>WAIT for user input</action>
    <action>Store response in {{desired_outcome}}</action>

    <ask>Question 5: What services or systems are involved?

Examples: Slack, Google Sheets, PostgreSQL, HubSpot, custom API, etc.</ask>
    <action>WAIT for user input</action>
    <action>Store response in {{integrations}}</action>

    <action>Research EXACT n8n node types for each integration:</action>
    <action>For each service in {{integrations}}:</action>
    <action>1. Search: "n8n [service] node documentation site:docs.n8n.io"</action>
    <action>2. Extract EXACT node type string (e.g., "n8n-nodes-base.webhook")</action>
    <action>3. Extract typeVersion (e.g., 2.1)</action>
    <action>4. Extract available parameters structure</action>
    <action>5. Extract example usage from docs</action>
    <action>6. Note if trigger node or action node</action>
    <action>Store all findings in {{node_research}}</action>

    <ask>Question 6: Are there any conditions or decision points in this process?

Examples: If amount > $1000, notify manager; If status = 'urgent', send immediately

Options:
1. No - Straight-through processing
2. Yes - Describe the conditions

Enter your selection (1-2):</ask>
    <action>WAIT for user input</action>
    <check if="selection is 2">
      <ask>Describe the conditions and what should happen in each case:</ask>
      <action>WAIT for user input</action>
      <action>Store response in {{conditional_logic}}</action>
    </check>
    <check if="selection is 1">
      <action>Store "No conditional logic required" in {{conditional_logic}}</action>
    </check>

    <ask>Question 7: How critical is this workflow? What happens if it fails?

Options:
1. Low - Can retry manually if needed
2. Medium - Should retry automatically, notify on failure
3. High - Must succeed, need alerts and logging
4. Critical - Business-critical, need comprehensive error handling

Enter your selection (1-4):</ask>
    <action>WAIT for user input</action>
    <action>Store selection in {{criticality}}</action>

    <ask>Question 8: What should the workflow be named?</ask>
    <action>WAIT for user input</action>
    <action>Store response in {{workflow_name}}</action>
    <action>Generate {{workflow_slug}} from {{workflow_name}} (lowercase, hyphens, no spaces)</action>

    <action>Display summary:
- Problem: {{problem_description}}
- Trigger: {{trigger_type}}
- Data: {{data_requirements}}
- Outcome: {{desired_outcome}}
- Services: {{integrations}}
- Conditions: {{conditional_logic}}
- Criticality: {{criticality}}
- Name: {{workflow_name}}
    </action>

    <ask>Does this capture your requirements correctly?

Options:
1. Yes - Save requirements
2. No - Let me clarify or add details

Enter your selection (1-2):</ask>
    <action>WAIT for user input</action>
    <check if="selection is 2">
      <ask>What needs to be clarified or added?</ask>
      <action>WAIT for user input</action>
      <action>Update relevant variables based on feedback</action>
      <action>Repeat summary and confirmation</action>
    </check>
  </step>

  <step n="3" goal="Research Workflow Pattern">
    <action>Perform comprehensive web search for workflow pattern:</action>
    <action>- "n8n workflow pattern [trigger_type] to [desired_outcome] site:docs.n8n.io"</action>
    <action>- "n8n [integrations] workflow example site:docs.n8n.io"</action>
    <action>- "n8n best practices [use case] site:docs.n8n.io"</action>
    <action>Store findings in {{workflow_pattern_research}}</action>

    <action>Research parameter structures for each node type:</action>
    <action>For each node type in {{node_research}}:</action>
    <action>1. Search: "n8n [node type] parameters documentation site:docs.n8n.io"</action>
    <action>2. Extract EXACT parameter structure from docs</action>
    <action>3. Extract required vs optional parameters</action>
    <action>4. Extract parameter data types</action>
    <action>5. Extract example values</action>
    <action>Store in {{parameter_structures}}</action>
  </step>

  <step n="4" goal="Save Requirements Document">
    <action>Resolve output path: {{default_output_file}} using {{workflow_slug}}</action>
    <action>Fill template with all gathered variables AND research findings</action>
    <action>Include in document:</action>
    <action>- Problem description and requirements</action>
    <action>- Use case research findings</action>
    <action>- EXACT node types with typeVersions</action>
    <action>- EXACT parameter structures from docs</action>
    <action>- Workflow pattern recommendations</action>
    <action>- Best practices from research</action>
    <action>Save document to {{default_output_file}}</action>
    <action>Report saved file path to user</action>

    <output>✅ Requirements Saved Successfully!

**File:** {{default_output_file}}

**Next Steps:**
1. Review the requirements file
2. Run `*create-workflow` to generate the n8n workflow
   (The create-workflow will automatically load this requirements file)

**Note:** You can edit the requirements file manually before creating the workflow.
    </output>
  </step>

  <step n="5" goal="Validate Content">
    <invoke-task>Validate against checklist at {{validation}} using {{bmad_folder}}/core/tasks/validate-workflow.xml</invoke-task>
  </step>

</workflow>
```
