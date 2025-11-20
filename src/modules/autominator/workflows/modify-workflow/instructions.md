# Modify n8n Workflow - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow modifies an existing n8n workflow based on user requirements.</critical>

<workflow>

  <step n="0" goal="Contextual Analysis (Smart Elicitation)">
    <critical>Before asking any questions, analyze what the user has already told you</critical>

    <action>Review the user's initial request and conversation history</action>
    <action>Extract any mentioned: workflow file path, changes needed, specific nodes</action>

    <check if="ALL requirements are clear from context">
      <action>Summarize your understanding</action>
      <action>Skip directly to Step 2 (Load Existing Workflow)</action>
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
    <action>Ask Question 1: "Which workflow file do you want to modify?"</action>
    <action>Present numbered options:
      1. Provide file path - Specify exact path to workflow JSON
      2. Search in workflows folder - List available workflows
      3. Paste workflow JSON - Provide workflow content directly
    </action>
    <action>WAIT for user selection (1-3)</action>

    <check if="selection is 1">
      <action>Ask: "Please provide the file path to the workflow JSON"</action>
      <action>WAIT for user input</action>
      <action>Store in {{workflow_file}}</action>
    </check>

    <check if="selection is 2">
      <action>List all .json files in workflows/ directory</action>
      <action>Present as numbered list</action>
      <action>WAIT for user selection</action>
      <action>Store selected file path in {{workflow_file}}</action>
    </check>

    <check if="selection is 3">
      <action>Ask: "Please paste the workflow JSON content"</action>
      <action>WAIT for user input</action>
      <action>Create temporary file with content</action>
      <action>Store temp file path in {{workflow_file}}</action>
    </check>

    <action>Ask Question 2: "What type of modification do you need?"</action>
    <action>Present numbered options:
      1. Add new nodes - Add functionality to existing workflow
      2. Modify existing nodes - Change node parameters or configuration
      3. Remove nodes - Delete nodes from workflow
      4. Change connections - Modify how nodes are connected
      5. Update error handling - Add or modify retry/error logic
      6. Optimize workflow - Improve performance or structure
      7. Multiple changes - Combination of above
    </action>
    <action>WAIT for user selection (1-7)</action>
    <action>Store selection in {{modification_type}}</action>

    <action>Ask Question 3: "Please describe the changes you want to make"</action>
    <action>WAIT for user input</action>
    <action>Store in {{changes_description}}</action>

    <check if="{{modification_type}} includes adding nodes">
      <action>Ask: "What nodes do you want to add? (describe functionality)"</action>
      <action>WAIT for user input</action>
      <action>Store in {{nodes_to_add}}</action>
    </check>

    <check if="{{modification_type}} includes modifying nodes">
      <action>Ask: "Which nodes do you want to modify? (provide node names or descriptions)"</action>
      <action>WAIT for user input</action>
      <action>Store in {{nodes_to_modify}}</action>
    </check>

    <check if="{{modification_type}} includes removing nodes">
      <action>Ask: "Which nodes do you want to remove? (provide node names)"</action>
      <action>WAIT for user input</action>
      <action>Store in {{nodes_to_remove}}</action>
    </check>
  </step>

  <step n="2" goal="Load Existing Workflow">
    <critical>Only load the workflow file when user provides it - never preload</critical>

    <action>Read workflow file from {{workflow_file}}</action>
    <action>Parse JSON content</action>
    <action>Validate JSON structure</action>

    <check if="JSON is invalid">
      <action>Inform user: "The workflow file has invalid JSON syntax"</action>
      <action>Show error details</action>
      <action>Ask: "Would you like me to fix the JSON syntax first? (yes/no)"</action>
      <action>WAIT for user response</action>

      <check if="user says yes">
        <action>Fix JSON syntax errors</action>
        <action>Save corrected file</action>
        <action>Proceed with loading</action>
      </check>

      <check if="user says no">
        <action>Exit workflow with error</action>
      </check>
    </check>

    <action>Extract workflow structure:</action>
    <action>- Workflow name</action>
    <action>- List of nodes (names, types, IDs)</action>
    <action>- Connections map</action>
    <action>- Current settings</action>

    <action>Display workflow summary to user:</action>
    <action>- Name: [workflow name]</action>
    <action>- Nodes: [count] nodes</action>
    <action>- Node list: [node names and types]</action>
    <action>- Connections: [connection count]</action>
  </step>

  <step n="3" goal="Create Backup">
    <action>Create backup of original workflow</action>
    <action>Save backup to: {{workflow_file}}.backup-{timestamp}</action>
    <action>Store true in {{backup_created}}</action>
    <action>Inform user: "Backup created at {{workflow_file}}.backup-{timestamp}"</action>
  </step>

  <step n="4" goal="Check Context7 MCP Availability">
    <action>Check if Context7 MCP server is configured</action>
    <action>Try to list available MCP tools</action>

    <check if="Context7 MCP is available">
      <action>Store true in {{context7_available}}</action>
      <action>Proceed to Step 5</action>
    </check>

    <check if="Context7 MCP is NOT available">
      <action>Store false in {{context7_available}}</action>
      <action>Inform user: "Context7 MCP not configured. Proceeding with built-in knowledge."</action>
      <action>Proceed to Step 6</action>
    </check>
  </step>

  <step n="5" goal="Query Context7 for n8n Documentation">
    <check if="{{context7_available}} is true">
      <action>Resolve n8n library ID using Context7</action>
      <action>Query Context7 for relevant n8n documentation based on:</action>
      <action>- Modification type: {{modification_type}}</action>
      <action>- Nodes to add: {{nodes_to_add}}</action>
      <action>- Changes description: {{changes_description}}</action>
      <action>Store relevant documentation snippets for reference</action>
    </check>
  </step>

  <step n="6" goal="Plan Modifications">
    <action>Load {{helpers}} for node creation guidelines</action>
    <action>Analyze current workflow structure</action>
    <action>Plan modifications based on requirements:</action>

    <check if="adding nodes">
      <action>1. Identify where new nodes should be inserted</action>
      <action>2. Determine node types needed</action>
      <action>3. Plan connections to/from new nodes</action>
      <action>4. Calculate positions for new nodes</action>
    </check>

    <check if="modifying nodes">
      <action>1. Identify nodes to modify by name or ID</action>
      <action>2. Determine what parameters to change</action>
      <action>3. Validate new parameter values</action>
    </check>

    <check if="removing nodes">
      <action>1. Identify nodes to remove by name or ID</action>
      <action>2. Identify connections that will be affected</action>
      <action>3. Plan how to reconnect remaining nodes</action>
    </check>

    <check if="changing connections">
      <action>1. Identify connections to modify</action>
      <action>2. Validate new connection targets exist</action>
      <action>3. Update connection indices if needed</action>
    </check>

    <action>Present modification plan to user:</action>
    <action>- Changes to be made: [detailed list]</action>
    <action>- Nodes affected: [list]</action>
    <action>- New connections: [list]</action>
    <action>- Removed connections: [list]</action>

    <action>Ask: "Does this modification plan look correct?"</action>
    <action>Present numbered options:
      1. Yes - Proceed with modifications
      2. No - Adjust the plan
      3. Add more changes - Include additional modifications
    </action>
    <action>WAIT for user selection (1-3)</action>

    <check if="selection is 2 or 3">
      <action>Ask: "What changes or additions are needed?"</action>
      <action>WAIT for user input</action>
      <action>Adjust plan based on feedback</action>
      <action>Repeat this step</action>
    </check>
  </step>

  <step n="7" goal="Apply Modifications">
    <critical>Follow guidelines from {{helpers}} for proper node creation</critical>

    <action>Load current workflow JSON into memory</action>

    <substep>If Adding Nodes:
      1. Generate unique node IDs (check against existing IDs)
      2. Create node objects with proper structure
      3. Calculate positions (avoid overlaps with existing nodes)
      4. Add nodes to workflow.nodes array
      5. Create connections to/from new nodes
      6. Update connections object
    </substep>

    <substep>If Modifying Nodes:
      1. Find nodes by name or ID
      2. Update parameters as specified
      3. Preserve node ID and other unchanged properties
      4. Validate new parameter values
      5. Update node in workflow.nodes array
    </substep>

    <substep>If Removing Nodes:
      1. Find nodes by name or ID
      2. Remove from workflow.nodes array
      3. Remove all connections to/from removed nodes
      4. Update connections object
      5. Reconnect remaining nodes if needed
    </substep>

    <substep>If Changing Connections:
      1. Update connections object
      2. Validate all referenced nodes exist
      3. Ensure connection indices are correct
      4. Remove orphaned connections
    </substep>

    <substep>If Updating Error Handling:
      1. Find affected nodes
      2. Add or update error handling properties:
         - continueOnFail
         - retryOnFail
         - maxTries
         - waitBetweenTries
      3. Validate error handling configuration
    </substep>

    <action>Validate modified workflow:</action>
    <action>- All node IDs are unique</action>
    <action>- All node names are unique</action>
    <action>- All connections reference existing nodes</action>
    <action>- No orphaned nodes (except trigger)</action>
    <action>- Node positions don't overlap</action>
  </step>

  <step n="8" goal="Save Modified Workflow">
    <action>Save modified workflow to {{workflow_file}}</action>
    <action>Preserve original file location</action>
  </step>

  <step n="9" goal="Validate JSON Syntax">
    <critical>NEVER delete the file if validation fails - always fix syntax errors</critical>

    <action>Run: node -e "JSON.parse(require('fs').readFileSync('{{workflow_file}}', 'utf8')); console.log('✓ Valid JSON')"</action>

    <check if="validation fails (exit code 1)">
      <action>Read the error message carefully - it shows the syntax error and position</action>
      <action>Open the file and navigate to the error location</action>
      <action>Fix the syntax error (add missing comma, bracket, or quote as indicated)</action>
      <action>Save the file</action>
      <action>Re-run validation with the same command</action>
      <action>Repeat until validation passes</action>
    </check>

    <action>Once validation passes, confirm with user: "Workflow modified successfully at {{workflow_file}}"</action>
  </step>

  <step n="10" goal="Summarize Changes">
    <action>Provide summary of changes made:</action>
    <action>- Nodes added: [count and names]</action>
    <action>- Nodes modified: [count and names]</action>
    <action>- Nodes removed: [count and names]</action>
    <action>- Connections changed: [count]</action>
    <action>- Backup location: {{workflow_file}}.backup-{timestamp}</action>

    <action>Ask: "Would you like to make additional changes?"</action>
    <action>Present numbered options:
      1. No - I'm done
      2. Yes - Make more modifications
      3. Revert - Restore from backup
    </action>
    <action>WAIT for user selection (1-3)</action>

    <check if="selection is 2">
      <action>Return to Step 1 with current workflow</action>
    </check>

    <check if="selection is 3">
      <action>Restore workflow from backup</action>
      <action>Confirm restoration to user</action>
    </check>
  </step>

  <step n="11" goal="Validate Content">
    <invoke-task>Validate against checklist at {{validation}} using {{bmad_folder}}/core/tasks/validate-workflow.xml</invoke-task>
  </step>

</workflow>
```
