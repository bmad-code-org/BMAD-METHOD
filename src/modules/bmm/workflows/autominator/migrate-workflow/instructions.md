# Migrate Workflow to n8n - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow migrates automation workflows from other platforms to n8n.</critical>

<workflow>

  <step n="0" goal="Contextual Analysis (Smart Elicitation)">
    <critical>Before asking any questions, analyze what the user has already told you</critical>

    <action>Review the user's initial request and conversation history</action>
    <action>Extract any mentioned: source platform, workflow details, integrations, file paths</action>

    <check if="ALL requirements are clear from context">
      <action>Summarize your understanding</action>
      <action>Skip directly to Step 2 (Check Context7 MCP)</action>
    </check>

    <check if="SOME requirements are clear">
      <action>Note what you already know</action>
      <action>Only ask about missing information in Step 1</action>
    </check>

    <check if="requirements are unclear or minimal">
      <action>Proceed with full elicitation in Step 1</action>
    </check>
  </step>

  <step n="1" goal="Gather Migration Requirements" elicit="true">
    <action>Ask Question 1: "Which platform are you migrating from?"</action>
    <action>Present numbered options:
      1. Zapier - Migrate Zapier Zaps to n8n
      2. Make (Integromat) - Migrate Make scenarios to n8n
      3. HubSpot Workflows - Migrate HubSpot workflows to n8n
      4. Microsoft Power Automate - Migrate Power Automate flows to n8n
      5. IFTTT - Migrate IFTTT applets to n8n
      6. Other - Specify another automation platform
    </action>
    <action>WAIT for user selection (1-6)</action>
    <action>Store selection in {{source_platform}}</action>

    <check if="selection is 6 (Other)">
      <action>Ask: "Please specify the platform you're migrating from"</action>
      <action>WAIT for user input</action>
      <action>Store in {{source_platform}}</action>
    </check>

    <action>Ask Question 2: "How will you provide the workflow to migrate?"</action>
    <action>Present numbered options:
      1. Describe it - Explain what the workflow does
      2. Provide export file - Upload/paste workflow export file
      3. Provide screenshots - Share workflow screenshots
      4. Provide documentation - Share workflow documentation
    </action>
    <action>WAIT for user selection (1-4)</action>

    <check if="selection is 1">
      <action>Ask: "Please describe what the workflow does (trigger, actions, logic)"</action>
      <action>WAIT for user input</action>
      <action>Store in {{workflow_description}}</action>
    </check>

    <check if="selection is 2">
      <action>Ask: "Please provide the workflow export file path or paste the content"</action>
      <action>WAIT for user input</action>
      <action>Store in {{workflow_file}} or {{workflow_content}}</action>
    </check>

    <check if="selection is 3">
      <action>Ask: "Please share the workflow screenshots and describe the flow"</action>
      <action>WAIT for user input</action>
      <action>Store in {{workflow_description}}</action>
    </check>

    <check if="selection is 4">
      <action>Ask: "Please provide the workflow documentation"</action>
      <action>WAIT for user input</action>
      <action>Store in {{workflow_description}}</action>
    </check>

    <action>Ask Question 3: "What is the trigger for this workflow?"</action>
    <action>Present numbered options:
      1. Webhook/HTTP Request - Triggered by incoming HTTP requests
      2. Schedule/Cron - Runs on a schedule
      3. Form Submission - Triggered by form submissions
      4. Database Change - Triggered by database events
      5. Email - Triggered by incoming emails
      6. Service Event - Triggered by external service (Slack, Google Sheets, etc.)
      7. Not sure - Will determine from workflow details
    </action>
    <action>WAIT for user selection (1-7)</action>
    <action>Store selection in {{trigger_type}}</action>

    <action>Ask Question 4: "What integrations/services does this workflow use?"</action>
    <action>Ask: "Please list all services (e.g., Slack, Google Sheets, HubSpot, etc.)"</action>
    <action>WAIT for user input</action>
    <action>Store in {{integrations_used}}</action>

    <action>Ask Question 5: "How complex is the workflow?"</action>
    <action>Present numbered options:
      1. Simple - Linear flow with 3-5 steps
      2. Medium - Some conditional logic, 6-10 steps
      3. Complex - Multiple branches, loops, 11-20 steps
      4. Very Complex - Advanced logic, 20+ steps
    </action>
    <action>WAIT for user selection (1-4)</action>
    <action>Store selection in {{complexity}}</action>

    <action>Ask Question 6: "What should the migrated workflow be named?"</action>
    <action>WAIT for user input</action>
    <action>Store in {{workflow_name}}</action>

    <action>Ask Question 7: "Where should the n8n workflow file be saved?"</action>
    <action>Present numbered options:
      1. Default location - workflows/[workflow-name].json
      2. Custom path - Specify your own file path
      3. Project root - Save in main project directory
    </action>
    <action>WAIT for user selection (1-3)</action>
    <check if="selection is 2">
      <action>Ask for specific path</action>
      <action>WAIT for user input</action>
    </check>
    <action>Store final path in {{save_location}}</action>
  </step>

  <step n="2" goal="Check Context7 MCP Availability">
    <action>Check if Context7 MCP server is configured</action>
    <action>Try to list available MCP tools</action>

    <check if="Context7 MCP is available">
      <action>Store true in {{context7_available}}</action>
      <action>Proceed to Step 3</action>
    </check>

    <check if="Context7 MCP is NOT available">
      <action>Store false in {{context7_available}}</action>
      <action>Inform user: "Context7 MCP not configured. Proceeding with built-in n8n knowledge."</action>
      <action>Proceed to Step 4</action>
    </check>
  </step>

  <step n="3" goal="Query Context7 for n8n Documentation">
    <check if="{{context7_available}} is true">
      <action>Resolve n8n library ID using Context7</action>
      <action>Query Context7 for relevant n8n documentation based on:</action>
      <action>- Integrations used: {{integrations_used}}</action>
      <action>- Trigger type: {{trigger_type}}</action>
      <action>- Source platform: {{source_platform}}</action>
      <action>Store relevant documentation snippets for reference</action>
    </check>
  </step>

  <step n="4" goal="Load Platform Mappings">
    <action>Load {{platform_mappings}} file</action>
    <action>Extract mappings for {{source_platform}}</action>
    <action>Identify equivalent n8n nodes for source platform components</action>
  </step>

  <step n="5" goal="Analyze Source Workflow">
    <check if="{{workflow_file}} or {{workflow_content}} provided">
      <action>Parse source workflow file/content</action>
      <action>Extract workflow structure</action>
    </check>

    <action>Analyze workflow based on description and details:</action>
    <action>1. Identify trigger type and configuration</action>
    <action>2. List all actions/steps in order</action>
    <action>3. Identify conditional logic (if/then branches)</action>
    <action>4. Identify loops or iterations</action>
    <action>5. Identify data transformations</action>
    <action>6. Identify error handling</action>
    <action>7. Map integrations to n8n nodes</action>

    <action>Present analysis to user:</action>
    <action>- Source trigger: [platform-specific trigger]</action>
    <action>- n8n trigger: [mapped n8n node]</action>
    <action>- Source actions: [list with platform names]</action>
    <action>- n8n actions: [list with n8n node types]</action>
    <action>- Logic: [conditional branches, loops]</action>
    <action>- Transformations: [data mapping needs]</action>
  </step>

  <step n="6" goal="Plan n8n Workflow Structure">
    <action>Load {{helpers}} for node creation guidelines</action>
    <action>Load {{templates}} for reference</action>

    <action>Design n8n workflow structure:</action>
    <action>1. Map source trigger to n8n trigger node</action>
    <action>2. Map each source action to n8n node(s)</action>
    <action>3. Convert conditional logic to IF/Switch nodes</action>
    <action>4. Convert loops to Split In Batches nodes</action>
    <action>5. Add Set/Code nodes for data transformations</action>
    <action>6. Plan node connections</action>
    <action>7. Add error handling where needed</action>

    <action>Present migration plan to user:</action>
    <action>- n8n Trigger: [node type and configuration]</action>
    <action>- n8n Nodes: [list with descriptions]</action>
    <action>- Connections: [flow diagram]</action>
    <action>- Data Mappings: [field mappings]</action>
    <action>- Credentials Needed: [list of integrations requiring auth]</action>

    <action>Ask: "Does this migration plan look correct?"</action>
    <action>Present numbered options:
      1. Yes - Proceed with migration
      2. No - Adjust the plan
      3. Add more details - Provide additional information
    </action>
    <action>WAIT for user selection (1-3)</action>

    <check if="selection is 2 or 3">
      <action>Ask: "What changes or additions are needed?"</action>
      <action>WAIT for user input</action>
      <action>Adjust plan based on feedback</action>
      <action>Repeat this step</action>
    </check>
  </step>

  <step n="7" goal="Build n8n Workflow">
    <critical>Follow guidelines from {{helpers}} for proper node creation</critical>

    <action>Initialize workflow structure:</action>
    <substep>
      {
        "name": "{{workflow_name}}",
        "nodes": [],
        "connections": {},
        "active": false,
        "settings": {
          "executionOrder": "v1"
        },
        "tags": [
          {
            "name": "migrated-from-{{source_platform}}"
          }
        ]
      }
    </substep>

    <action>Build nodes ONE at a time:</action>

    <substep>For Each Mapped Node:
      1. Generate unique node ID
      2. Set node name (descriptive, unique)
      3. Set node type from platform mappings
      4. Set typeVersion (usually 1)
      5. Calculate position (220px spacing)
      6. Configure parameters based on source workflow
      7. Map data fields from source to n8n format
      8. Add credentials placeholder if needed
      9. Set error handling if required
    </substep>

    <substep>For Data Transformations:
      1. Identify field mappings needed
      2. Create Set nodes for simple mappings
      3. Create Code nodes for complex transformations
      4. Use n8n expressions: ={{ $json.fieldName }}
      5. Handle data type conversions
      6. Handle date/time format differences
    </substep>

    <substep>For Conditional Logic:
      1. Create IF nodes for if/then branches
      2. Create Switch nodes for multiple conditions
      3. Map source conditions to n8n condition format
      4. Set up true/false branches (index 0/1)
    </substep>

    <substep>For Connections:
      1. Connect trigger to first action
      2. Connect actions in sequence
      3. Connect conditional branches
      4. Connect merge points
      5. Validate all connections
    </substep>

    <action>Add migration notes as workflow tags</action>
    <action>Validate all node IDs are unique</action>
    <action>Validate all connections reference existing nodes</action>
  </step>

  <step n="8" goal="Add Migration Notes">
    <action>Add comment nodes or documentation:</action>
    <action>- Source platform: {{source_platform}}</action>
    <action>- Migration date: {timestamp}</action>
    <action>- Credentials to configure: [list]</action>
    <action>- Testing notes: [important considerations]</action>
    <action>- Platform-specific differences: [notes]</action>
  </step>

  <step n="9" goal="Save Migrated Workflow">
    <action>Save workflow to {{save_location}}</action>
  </step>

  <step n="10" goal="Validate JSON Syntax">
    <critical>NEVER delete the file if validation fails - always fix syntax errors</critical>

    <action>Run: node -e "JSON.parse(require('fs').readFileSync('{{save_location}}', 'utf8')); console.log('✓ Valid JSON')"</action>

    <check if="validation fails (exit code 1)">
      <action>Read the error message carefully - it shows the syntax error and position</action>
      <action>Open the file and navigate to the error location</action>
      <action>Fix the syntax error (add missing comma, bracket, or quote as indicated)</action>
      <action>Save the file</action>
      <action>Re-run validation with the same command</action>
      <action>Repeat until validation passes</action>
    </check>

    <action>Once validation passes, confirm with user: "Workflow migrated successfully to {{save_location}}"</action>
  </step>

  <step n="11" goal="Provide Migration Guidance">
    <action>Provide post-migration instructions:</action>
    <action>1. Import the JSON file into n8n</action>
    <action>2. Configure credentials for these services: [list]</action>
    <action>3. Review and update these data mappings: [list]</action>
    <action>4. Test with sample data before activating</action>
    <action>5. Compare outputs with original platform</action>
    <action>6. Monitor initial executions closely</action>

    <action>Highlight platform-specific differences:</action>
    <action>- Authentication: [differences]</action>
    <action>- Data formats: [differences]</action>
    <action>- Scheduling: [differences]</action>
    <action>- Error handling: [differences]</action>

    <action>Ask: "Would you like help with any specific part of the migration?"</action>
    <action>Present numbered options:
      1. No - I'm ready to test
      2. Yes - Explain credential setup
      3. Yes - Explain data mappings
      4. Yes - Explain testing approach
    </action>
    <action>WAIT for user selection (1-4)</action>

    <check if="selection is 2, 3, or 4">
      <action>Provide requested explanation</action>
    </check>
  </step>

  <step n="12" goal="Validate Content">
    <invoke-task>Validate against checklist at {{validation}} using {{bmad_folder}}/core/tasks/validate-workflow.xml</invoke-task>
  </step>

</workflow>
```
