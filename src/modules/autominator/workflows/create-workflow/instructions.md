# Create n8n Workflow - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates a new n8n workflow from scratch based on user requirements.</critical>

<workflow>

  <step n="0" goal="Contextual Analysis (Smart Elicitation)">
    <critical>Before asking any questions, analyze what the user has already told you</critical>

    <action>Review the user's initial request and conversation history</action>
    <action>Extract any mentioned: workflow type, trigger, integrations, complexity, requirements</action>

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

  <step n="1" goal="Gather Requirements" elicit="true">
    <action>Ask Question 1: "What type of automation workflow do you need?"</action>
    <action>Present numbered options:
      1. Webhook-based - Receive HTTP requests and process data
      2. Scheduled - Run on a schedule (cron/interval)
      3. Event-driven - Trigger from external service events
      4. Manual - Execute on demand
      5. Database-driven - Trigger from database changes
      6. Other - Describe your specific trigger needs
    </action>
    <action>WAIT for user selection (1-6)</action>
    <action>Store selection in {{workflow_type}}</action>

    <check if="selection is 6 (Other)">
      <action>Ask: "Please describe your trigger requirements"</action>
      <action>WAIT for user input</action>
      <action>Store in {{workflow_type}}</action>
    </check>

    <action>Ask Question 2: "What integrations or services will this workflow use?"</action>
    <action>Present numbered options:
      1. HTTP/REST APIs - Generic API calls
      2. Databases - PostgreSQL, MySQL, MongoDB, etc.
      3. Cloud Services - Google Sheets, Slack, Notion, Airtable
      4. Email - Send/receive emails
      5. CRM - HubSpot, Salesforce, etc.
      6. Custom Code - JavaScript/Python logic
      7. Multiple - Combination of above
      8. Other - Specify integrations
    </action>
    <action>WAIT for user selection (1-8)</action>
    <action>Store selection in {{integrations}}</action>

    <check if="selection is 7 or 8">
      <action>Ask: "Please list all integrations needed (comma-separated)"</action>
      <action>WAIT for user input</action>
      <action>Store in {{integrations}}</action>
    </check>

    <action>Ask Question 3: "How complex is your workflow logic?"</action>
    <action>Present numbered options:
      1. Simple (3-5 nodes) - Linear flow with minimal logic
      2. Medium (6-10 nodes) - Some conditional logic or branching
      3. Complex (11-20 nodes) - Multiple branches, loops, or error handling
      4. Very Complex (20+ nodes) - Advanced logic with parallel processing
    </action>
    <action>WAIT for user selection (1-4)</action>
    <action>Store selection in {{complexity}}</action>

    <action>Ask Question 4: "Do you need error handling and retry logic?"</action>
    <action>Present numbered options:
      1. No - Simple workflow without error handling
      2. Basic - Retry failed operations automatically
      3. Advanced - Custom error handling with notifications
      4. Comprehensive - Full error workflow with logging and alerts
    </action>
    <action>WAIT for user selection (1-4)</action>
    <action>Store selection in {{error_handling}}</action>

    <action>Ask Question 5: "What should the workflow be named?"</action>
    <action>WAIT for user input</action>
    <action>Store in {{workflow_name}}</action>

    <action>Ask Question 6: "Where should the workflow file be saved?"</action>
    <action>Present numbered options:
      1. Default location - workflows/[workflow-name].json
      2. Custom path - Specify your own file path
      3. Project root - Save in main project directory
      4. Specific folder - Choose from existing folders
    </action>
    <action>WAIT for user selection (1-4)</action>
    <check if="selection is 2 or 4">
      <action>Ask for specific path</action>
      <action>WAIT for user input</action>
    </check>
    <action>Store final path in {{save_location}}</action>

    <action>Ask Question 7: "Any additional requirements or specific logic needed?"</action>
    <action>Present numbered options:
      1. No - Proceed with current requirements
      2. Yes - Describe additional requirements
    </action>
    <action>WAIT for user selection (1-2)</action>
    <check if="selection is 2">
      <action>Ask: "Please describe additional requirements"</action>
      <action>WAIT for user input</action>
      <action>Store in {{additional_requirements}}</action>
    </check>
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
      <action>Inform user: "Context7 MCP server is not configured. This provides up-to-date n8n documentation."</action>
      <action>Recommend: "For best results, install Context7 MCP server in your IDE. See: https://github.com/context7/context7"</action>
      <action>Inform: "Proceeding with built-in n8n knowledge."</action>
      <action>Proceed to Step 4</action>
    </check>
  </step>

  <step n="3" goal="Query Context7 for n8n Documentation">
    <check if="{{context7_available}} is true">
      <action>Resolve n8n library ID using Context7</action>
      <action>Query Context7 for relevant n8n documentation based on:</action>
      <action>- Workflow type: {{workflow_type}}</action>
      <action>- Integrations: {{integrations}}</action>
      <action>- Complexity: {{complexity}}</action>
      <action>Store relevant documentation snippets for reference</action>
    </check>

    <check if="{{context7_available}} is false">
      <action>Skip Context7 query</action>
      <action>Use built-in knowledge and templates</action>
    </check>
  </step>

  <step n="4" goal="Plan Workflow Structure">
    <action>Based on gathered requirements, plan the workflow structure:</action>
    <action>1. Identify trigger node type</action>
    <action>2. List all action nodes needed</action>
    <action>3. Identify conditional logic (IF nodes)</action>
    <action>4. Plan data transformations (Set/Code nodes)</action>
    <action>5. Design error handling strategy</action>
    <action>6. Map node connections</action>

    <action>Present the planned structure to user in clear format:</action>
    <action>- Trigger: [trigger type]</action>
    <action>- Nodes: [list of nodes with descriptions]</action>
    <action>- Logic: [conditional branches, loops]</action>
    <action>- Error Handling: [strategy]</action>

    <action>Ask: "Does this structure meet your needs?"</action>
    <action>Present numbered options:
      1. Yes - Proceed with this structure
      2. No - Adjust the structure
      3. Add more details - Provide additional requirements
    </action>
    <action>WAIT for user selection (1-3)</action>

    <check if="selection is 2 or 3">
      <action>Ask: "What changes or additions are needed?"</action>
      <action>WAIT for user input</action>
      <action>Adjust structure based on feedback</action>
      <action>Repeat this step</action>
    </check>
  </step>

  <step n="5" goal="Load Templates and Resources">
    <action>Load {{templates}} file</action>
    <action>Identify closest matching template based on workflow type</action>
    <action>Load {{helpers}} for node creation guidelines</action>
    <action>Extract relevant template sections</action>
  </step>

  <step n="6" goal="Build Workflow JSON">
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
        "tags": []
      }
    </substep>

    <action>Build nodes ONE at a time following these rules:</action>

    <substep>For Each Node:
      1. Generate unique node ID
      2. Set node name (unique, descriptive)
      3. Set node type (e.g., n8n-nodes-base.webhook)
      4. Set typeVersion (usually 1)
      5. Calculate position:
         - First node (trigger): [250, 300]
         - Subsequent nodes: add 220 to x for each step
         - Branches: adjust y by ±100
      6. Configure parameters based on node type
      7. Add credentials if needed
      8. Set error handling options if required:
         - continueOnFail: true/false
         - retryOnFail: true/false
         - maxTries: number
         - waitBetweenTries: milliseconds
    </substep>

    <substep>For Each Connection:
      1. Identify source node name
      2. Identify target node name
      3. Create connection entry in connections object:
         "Source Node Name": [
           [
             {
               "node": "Target Node Name",
               "type": "main",
               "index": 0
             }
           ]
         ]
      4. For IF nodes:
         - index 0 = true branch
         - index 1 = false branch
      5. Validate all referenced nodes exist
    </substep>

    <substep>Node Building Order:
      1. Trigger node
      2. Main flow action nodes
      3. Conditional nodes (IF/Switch)
      4. Branch nodes
      5. Merge nodes
      6. Final action nodes
      7. Connect all nodes
    </substep>

    <action>Apply error handling based on {{error_handling}} selection</action>
    <action>Validate all node IDs are unique</action>
    <action>Validate all node names are unique</action>
    <action>Validate all connections reference existing nodes</action>
  </step>

  <step n="7" goal="Optimize and Save">
    <action>Review workflow for optimization:</action>
    <action>- Remove any unused nodes</action>
    <action>- Verify node positions don't overlap</action>
    <action>- Ensure proper spacing and alignment</action>
    <action>- Validate all required parameters are set</action>

    <action>Save workflow to {{save_location}}</action>
  </step>

  <step n="8" goal="Validate JSON Syntax">
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

    <action>Once validation passes, confirm with user: "n8n workflow created at {{save_location}}"</action>
  </step>

  <step n="9" goal="Provide Usage Instructions">
    <action>Inform user how to use the workflow:</action>
    <action>1. Import the JSON file into n8n</action>
    <action>2. Configure credentials for integrated services</action>
    <action>3. Test the workflow with sample data</action>
    <action>4. Activate the workflow when ready</action>

    <action>Ask: "Would you like me to explain any part of the workflow?"</action>
    <action>Present numbered options:
      1. No - I'm good to go
      2. Yes - Explain specific nodes
      3. Yes - Explain the overall flow
      4. Yes - Explain how to test it
    </action>
    <action>WAIT for user selection (1-4)</action>

    <check if="selection is 2, 3, or 4">
      <action>Provide requested explanation</action>
    </check>
  </step>

  <step n="10" goal="Validate Content">
    <invoke-task>Validate against checklist at {{validation}} using {{bmad_folder}}/core/tasks/validate-workflow.xml</invoke-task>
  </step>

</workflow>
```
