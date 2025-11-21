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
      <action>Skip directly to Step 2 (Research n8n Documentation)</action>
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
    <critical>Start by understanding the ACTUAL PROBLEM the user wants to solve, not just technical requirements</critical>

    <action>Ask Question 1: "What problem are you trying to solve with this automation?"</action>
    <action>Encourage detailed explanation: "Describe the current manual process, pain points, and desired outcome."</action>
    <action>WAIT for user input</action>
    <action>Store in {{problem_description}}</action>

    <action>Ask Question 2: "What triggers this process? When should the automation run?"</action>
    <action>Present numbered options:
      1. When data arrives - Webhook, form submission, API call
      2. On a schedule - Every hour, daily, weekly, custom cron
      3. When something changes - Database update, file change, service event
      4. Manually - On-demand execution
      5. Multiple triggers - Combination of above
      6. Not sure - Help me decide based on my problem
    </action>
    <action>WAIT for user selection (1-6)</action>
    <action>Store selection in {{trigger_type}}</action>

    <check if="selection is 6 (Not sure)">
      <action>Analyze {{problem_description}} and suggest appropriate trigger</action>
      <action>Ask: "Based on your problem, I recommend [trigger type]. Does this make sense?"</action>
      <action>WAIT for confirmation or adjustment</action>
      <action>Store final trigger in {{trigger_type}}</action>
    </check>

    <action>Ask Question 3: "What data or information does this workflow need to work with?"</action>
    <action>Examples: "Customer data, order details, form responses, API data, etc."</action>
    <action>WAIT for user input</action>
    <action>Store in {{data_requirements}}</action>

    <action>Ask Question 4: "What should happen with this data? What's the desired outcome?"</action>
    <action>Examples: "Send to Slack, update database, create invoice, notify team, etc."</action>
    <action>WAIT for user input</action>
    <action>Store in {{desired_outcome}}</action>

    <action>Ask Question 5: "What services or systems are involved?"</action>
    <action>Examples: "Slack, Google Sheets, PostgreSQL, HubSpot, custom API, etc."</action>
    <action>WAIT for user input</action>
    <action>Store in {{integrations}}</action>

    <action>Ask Question 6: "Are there any conditions or decision points in this process?"</action>
    <action>Examples: "If amount > $1000, notify manager; If status = 'urgent', send immediately"</action>
    <action>Present numbered options:
      1. No - Straight-through processing
      2. Yes - Describe the conditions
    </action>
    <action>WAIT for user selection (1-2)</action>
    <check if="selection is 2">
      <action>Ask: "Describe the conditions and what should happen in each case"</action>
      <action>WAIT for user input</action>
      <action>Store in {{conditional_logic}}</action>
    </check>

    <action>Ask Question 7: "How critical is this workflow? What happens if it fails?"</action>
    <action>Present numbered options:
      1. Low - Can retry manually if needed
      2. Medium - Should retry automatically, notify on failure
      3. High - Must succeed, need alerts and logging
      4. Critical - Business-critical, need comprehensive error handling
    </action>
    <action>WAIT for user selection (1-4)</action>
    <action>Store selection in {{criticality}}</action>

    <action>Ask Question 8: "What should the workflow be named?"</action>
    <action>Suggest name based on {{problem_description}}</action>
    <action>WAIT for user input</action>
    <action>Store in {{workflow_name}}</action>

    <action>Ask Question 9: "Where should the workflow file be saved?"</action>
    <action>Present numbered options:
      1. Default location - workflows/[workflow-name].json
      2. Custom path - Specify your own file path
    </action>
    <action>WAIT for user selection (1-2)</action>
    <check if="selection is 2">
      <action>Ask for specific path</action>
      <action>WAIT for user input</action>
    </check>
    <action>Store final path in {{save_location}}</action>

    <action>Summarize understanding:</action>
    <action>- Problem: {{problem_description}}</action>
    <action>- Trigger: {{trigger_type}}</action>
    <action>- Data: {{data_requirements}}</action>
    <action>- Outcome: {{desired_outcome}}</action>
    <action>- Services: {{integrations}}</action>
    <action>- Conditions: {{conditional_logic}}</action>
    <action>- Criticality: {{criticality}}</action>

    <action>Ask: "Does this capture your requirements correctly?"</action>
    <action>Present numbered options:
      1. Yes - Proceed with workflow creation
      2. No - Let me clarify or add details
    </action>
    <action>WAIT for user selection (1-2)</action>
    <check if="selection is 2">
      <action>Ask: "What needs to be clarified or added?"</action>
      <action>WAIT for user input</action>
      <action>Update relevant variables</action>
      <action>Repeat summary and confirmation</action>
    </check>
  </step>

  <step n="2" goal="Research n8n Documentation">
    <critical>Search for up-to-date n8n documentation based on user requirements</critical>

    <action>Inform user: "Researching n8n documentation for your workflow requirements..."</action>

    <action>Perform web search for n8n documentation on:</action>
    <action>1. Trigger type: {{trigger_type}}</action>
    <action>2. Integrations: {{integrations}}</action>
    <action>3. Conditional logic: {{conditional_logic}}</action>
    <action>4. Error handling: {{criticality}}</action>

    <action>Search queries to use:</action>
    <action>- "n8n [trigger_type] node documentation"</action>
    <action>- "n8n [integration] node setup"</action>
    <action>- "n8n workflow best practices"</action>
    <action>- "n8n error handling retry logic"</action>

    <action>Focus on official n8n documentation at docs.n8n.io</action>
    <action>Store relevant documentation snippets for reference</action>
    <action>Note any specific node configurations or parameters needed</action>
  </step>

  <step n="3" goal="Verify Documentation Understanding">
    <action>Summarize key findings from documentation:</action>
    <action>- Available node types for requirements</action>
    <action>- Required parameters and configurations</action>
    <action>- Best practices for this use case</action>
    <action>- Any limitations or considerations</action>

    <action>Inform user: "Based on n8n documentation, I found the necessary nodes and configurations for your workflow."</action>
  </step>

  <step n="4" goal="Plan Workflow Structure">
    <critical>Design workflow based on the ACTUAL PROBLEM, not just technical specs</critical>

    <action>Analyze the problem and requirements:</action>
    <action>- Problem to solve: {{problem_description}}</action>
    <action>- Trigger: {{trigger_type}}</action>
    <action>- Data needed: {{data_requirements}}</action>
    <action>- Desired outcome: {{desired_outcome}}</action>
    <action>- Services: {{integrations}}</action>
    <action>- Conditions: {{conditional_logic}}</action>
    <action>- Criticality: {{criticality}}</action>

    <action>Design workflow structure that solves the problem:</action>
    <action>1. Map trigger to appropriate n8n trigger node</action>
    <action>2. Design data acquisition steps (API calls, database queries)</action>
    <action>3. Plan data transformations needed for the outcome</action>
    <action>4. Implement conditional logic from {{conditional_logic}}</action>
    <action>5. Design actions to achieve {{desired_outcome}}</action>
    <action>6. Add error handling based on {{criticality}}</action>
    <action>7. Plan node connections and data flow</action>

    <action>Present the solution-focused workflow plan:</action>
    <action>## Workflow Solution for: {{problem_description}}</action>
    <action></action>
    <action>**How it works:**</action>
    <action>[Explain in plain language how the workflow solves the problem]</action>
    <action></action>
    <action>**Workflow Steps:**</action>
    <action>1. Trigger: [When/how it starts] - [n8n node type]</action>
    <action>2. Get Data: [What data is retrieved] - [n8n nodes]</action>
    <action>3. Process: [How data is transformed] - [n8n nodes]</action>
    <action>4. Decide: [Conditional logic if any] - [IF/Switch nodes]</action>
    <action>5. Act: [Final actions to achieve outcome] - [n8n nodes]</action>
    <action>6. Handle Errors: [Error strategy] - [Error handling config]</action>
    <action></action>
    <action>**Expected Result:**</action>
    <action>[Describe what happens when workflow runs successfully]</action>

    <action>Ask: "Does this workflow solve your problem?"</action>
    <action>Present numbered options:
      1. Yes - This solves my problem, proceed
      2. No - Missing something important
      3. Partially - Needs adjustments
      4. Explain more - I need clarification
    </action>
    <action>WAIT for user selection (1-4)</action>

    <check if="selection is 2">
      <action>Ask: "What's missing? What else needs to happen?"</action>
      <action>WAIT for user input</action>
      <action>Adjust workflow design to include missing elements</action>
      <action>Repeat this step</action>
    </check>

    <check if="selection is 3">
      <action>Ask: "What needs to be adjusted?"</action>
      <action>WAIT for user input</action>
      <action>Modify workflow design based on feedback</action>
      <action>Repeat this step</action>
    </check>

    <check if="selection is 4">
      <action>Ask: "Which part needs clarification?"</action>
      <action>WAIT for user input</action>
      <action>Provide detailed explanation of that part</action>
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
