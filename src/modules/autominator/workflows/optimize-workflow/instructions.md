# Optimize n8n Workflow - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow analyzes and optimizes existing n8n workflows for performance and best practices.</critical>

<workflow>

  <step n="0" goal="Contextual Analysis (Smart Elicitation)">
    <critical>Before asking any questions, analyze what the user has already told you</critical>

    <action>Review the user's initial request and conversation history</action>
    <action>Extract any mentioned: workflow file path, performance issues, optimization goals</action>

    <check if="ALL requirements are clear from context">
      <action>Summarize your understanding</action>
      <action>Skip directly to Step 2 (Load Workflow)</action>
    </check>

    <check if="SOME requirements are clear">
      <action>Note what you already know</action>
      <action>Only ask about missing information in Step 1</action>
    </check>

    <check if="requirements are unclear or minimal">
      <action>Proceed with full elicitation in Step 1</action>
    </check>
  </step>

  <step n="1" goal="Gather Optimization Requirements" elicit="true">
    <critical>Understand the REAL PROBLEMS the user is experiencing, not just generic optimization goals</critical>

    <action>Ask Question 1: "Which workflow do you want to optimize?"</action>
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

    <action>Ask Question 2: "What problems are you experiencing with this workflow?"</action>
    <action>Examples: "Takes too long to run", "Fails frequently", "Hard to understand", "Doesn't handle errors well"</action>
    <action>WAIT for user input</action>
    <action>Store in {{problems_experienced}}</action>

    <action>Ask Question 3: "What's the business impact of these problems?"</action>
    <action>Examples: "Delays customer responses", "Wastes team time", "Causes data issues", "Costs money"</action>
    <action>WAIT for user input</action>
    <action>Store in {{business_impact}}</action>

    <action>Ask Question 4: "What would 'better' look like for this workflow?"</action>
    <action>Focus on desired outcomes: "Faster execution", "More reliable", "Easier to maintain", "Better error recovery"</action>
    <action>WAIT for user input</action>
    <action>Store in {{desired_improvements}}</action>

    <action>Ask Question 5: "Are there specific areas you want me to focus on?"</action>
    <action>Present numbered options (can select multiple):
      1. Performance - Speed and efficiency
      2. Reliability - Error handling and retries
      3. Maintainability - Code quality and structure
      4. Security - Credential and data handling
      5. All - Comprehensive review
      6. Let you decide - Analyze and recommend
    </action>
    <action>WAIT for user selection (1-6 or multiple)</action>
    <action>Store selections in {{optimization_focus}}</action>

    <action>Summarize understanding:</action>
    <action>- Problems: {{problems_experienced}}</action>
    <action>- Business Impact: {{business_impact}}</action>
    <action>- Desired Improvements: {{desired_improvements}}</action>
    <action>- Focus Areas: {{optimization_focus}}</action>

    <action>Ask: "Does this capture your optimization needs?"</action>
    <action>Present numbered options:
      1. Yes - Proceed with analysis
      2. No - Let me clarify
    </action>
    <action>WAIT for user selection (1-2)</action>
    <check if="selection is 2">
      <action>Ask: "What needs clarification?"</action>
      <action>WAIT for user input</action>
      <action>Update relevant variables</action>
      <action>Repeat summary and confirmation</action>
    </check>
  </step>

  <step n="2" goal="Load Workflow">
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
    <action>- Workflow name and settings</action>
    <action>- Node count and types</action>
    <action>- Connection patterns</action>
    <action>- Error handling configuration</action>
    <action>- Credential usage</action>

    <action>Display workflow summary to user:</action>
    <action>- Name: [workflow name]</action>
    <action>- Nodes: [count] nodes</action>
    <action>- Complexity: [simple/medium/complex]</action>
    <action>- Integrations: [list of services]</action>
  </step>

  <step n="3" goal="Research n8n Best Practices and Optimization">
    <critical>Search for n8n documentation on optimization and best practices</critical>

    <action>Inform user: "Researching n8n best practices and optimization techniques..."</action>

    <action>Perform web search for:</action>
    <action>1. n8n performance optimization</action>
    <action>2. n8n error handling best practices</action>
    <action>3. n8n workflow structure patterns</action>
    <action>4. n8n security best practices</action>
    <action>5. Solutions for: {{problems_experienced}}</action>

    <action>Search queries to use:</action>
    <action>- "n8n workflow optimization best practices"</action>
    <action>- "n8n performance tuning"</action>
    <action>- "n8n error handling patterns"</action>
    <action>- "n8n workflow security"</action>
    <action>- "n8n [specific problem] solution"</action>

    <action>Focus on official n8n documentation at docs.n8n.io</action>
    <action>Store relevant optimization techniques and best practices</action>
  </step>

  <step n="4" goal="Verify Optimization Strategy">
    <action>Summarize optimization approach based on documentation:</action>
    <action>- Solutions for {{problems_experienced}}</action>
    <action>- Best practices to apply</action>
    <action>- Performance improvements available</action>
    <action>- Expected impact on {{business_impact}}</action>

    <action>Inform user: "Based on n8n best practices, I've identified optimization opportunities."</action>
  </step>

  <step n="5" goal="Analyze Workflow">
    <action>Load {{helpers}} for best practices reference</action>

    <action>Perform comprehensive analysis based on {{optimization_focus}}:</action>

    <substep>Performance Analysis:
      - Check for unnecessary nodes
      - Identify inefficient data transformations
      - Look for missing batch processing opportunities
      - Check for redundant API calls
      - Analyze node execution order
      - Identify parallel execution opportunities
    </substep>

    <substep>Error Handling Analysis:
      - Check if critical nodes have retry logic
      - Verify continueOnFail settings
      - Look for missing error workflows
      - Check timeout configurations
      - Verify error notification setup
    </substep>

    <substep>Code Quality Analysis:
      - Review Set node configurations
      - Review Code node implementations
      - Check expression syntax and efficiency
      - Verify data type handling
      - Check for hardcoded values
      - Review node naming conventions
    </substep>

    <substep>Structure Analysis:
      - Check node positioning and layout
      - Verify logical flow organization
      - Look for overly complex branches
      - Check for duplicate logic
      - Verify proper use of merge nodes
      - Check connection patterns
    </substep>

    <substep>Best Practices Analysis:
      - Verify proper credential usage
      - Check for security issues
      - Verify proper use of node types
      - Check for deprecated node versions
      - Verify proper data handling
      - Check workflow settings
    </substep>

    <substep>Security Analysis:
      - Check credential exposure
      - Verify sensitive data handling
      - Check for hardcoded secrets
      - Verify proper authentication
      - Check data sanitization
    </substep>

    <action>Store all findings in {{issues_found}}</action>
  </step>

  <step n="6" goal="Generate Recommendations">
    <action>For each issue found, generate specific recommendations:</action>

    <action>Categorize recommendations by priority:</action>
    <action>- Critical: Security issues, major performance problems</action>
    <action>- High: Error handling gaps, significant inefficiencies</action>
    <action>- Medium: Code quality improvements, minor optimizations</action>
    <action>- Low: Cosmetic improvements, nice-to-haves</action>

    <action>For each recommendation, provide:</action>
    <action>1. Issue description</action>
    <action>2. Impact explanation</action>
    <action>3. Specific solution</action>
    <action>4. Implementation steps</action>
    <action>5. Expected improvement</action>

    <action>Store recommendations in {{recommendations}}</action>
  </step>

  <step n="7" goal="Present Analysis Report" elicit="true">
    <action>Present comprehensive optimization report:</action>

    <action>## Workflow Analysis Report</action>
    <action>Workflow: {{workflow_name}}</action>
    <action>Analysis Date: {timestamp}</action>
    <action>Optimization Focus: {{optimization_focus}}</action>

    <action>### Summary</action>
    <action>- Total Issues Found: [count]</action>
    <action>- Critical: [count]</action>
    <action>- High Priority: [count]</action>
    <action>- Medium Priority: [count]</action>
    <action>- Low Priority: [count]</action>

    <action>### Detailed Findings</action>
    <action>Present each issue with:</action>
    <action>- Priority level</action>
    <action>- Issue description</action>
    <action>- Current state</action>
    <action>- Recommended solution</action>
    <action>- Expected impact</action>

    <action>### Performance Opportunities</action>
    <action>List specific performance improvements with estimated impact</action>

    <action>### Best Practice Violations</action>
    <action>List n8n best practices not being followed</action>

    <action>Ask: "Would you like me to apply these optimizations?"</action>
    <action>Present numbered options:
      1. Yes - Apply all recommendations
      2. Yes - Apply only critical and high priority
      3. Yes - Let me choose which to apply
      4. No - Just provide the report
      5. Explain more - I need more details first
    </action>
    <action>WAIT for user selection (1-5)</action>

    <check if="selection is 5">
      <action>Ask: "Which recommendations would you like explained?"</action>
      <action>WAIT for user input</action>
      <action>Provide detailed explanation</action>
      <action>Repeat this step</action>
    </check>

    <check if="selection is 3">
      <action>Present recommendations as numbered list</action>
      <action>Ask: "Select recommendations to apply (comma-separated numbers)"</action>
      <action>WAIT for user input</action>
      <action>Store selected recommendations</action>
    </check>

    <check if="selection is 1, 2, or 3">
      <action>Store true in {{apply_changes}}</action>
      <action>Proceed to Step 8</action>
    </check>

    <check if="selection is 4">
      <action>Store false in {{apply_changes}}</action>
      <action>Skip to Step 11 (provide report only)</action>
    </check>
  </step>

  <step n="8" goal="Create Backup">
    <check if="{{apply_changes}} is true">
      <action>Create backup of original workflow</action>
      <action>Save backup to: {{workflow_file}}.backup-{timestamp}</action>
      <action>Store true in {{backup_created}}</action>
      <action>Inform user: "Backup created at {{workflow_file}}.backup-{timestamp}"</action>
    </check>
  </step>

  <step n="9" goal="Apply Optimizations">
    <critical>Follow guidelines from {{helpers}} for proper node configuration</critical>

    <action>Load current workflow JSON into memory</action>

    <action>Apply each selected recommendation:</action>

    <substep>Performance Optimizations:
      - Remove unnecessary nodes
      - Optimize data transformations
      - Add batch processing where applicable
      - Consolidate redundant API calls
      - Optimize node execution order
      - Add parallel execution where possible
    </substep>

    <substep>Error Handling Improvements:
      - Add retry logic to critical nodes
      - Set appropriate continueOnFail values
      - Add error workflows if needed
      - Configure timeouts
      - Add error notifications
    </substep>

    <substep>Code Quality Improvements:
      - Refactor Set node configurations
      - Optimize Code node implementations
      - Improve expression syntax
      - Fix data type handling
      - Replace hardcoded values with variables
      - Improve node naming
    </substep>

    <substep>Structure Improvements:
      - Reorganize node positions
      - Simplify complex branches
      - Remove duplicate logic
      - Optimize merge points
      - Improve connection patterns
    </substep>

    <substep>Best Practice Applications:
      - Fix credential usage
      - Address security issues
      - Update deprecated nodes
      - Improve data handling
      - Update workflow settings
    </substep>

    <action>Validate optimized workflow:</action>
    <action>- All node IDs remain unique</action>
    <action>- All connections are valid</action>
    <action>- No functionality is lost</action>
    <action>- All improvements are applied</action>
  </step>

  <step n="10" goal="Save Optimized Workflow">
    <action>Save optimized workflow to {{workflow_file}}</action>
  </step>

  <step n="11" goal="Validate JSON Syntax">
    <check if="{{apply_changes}} is true">
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

      <action>Once validation passes, confirm with user: "Workflow optimized successfully at {{workflow_file}}"</action>
    </check>
  </step>

  <step n="12" goal="Provide Optimization Summary">
    <action>Provide comprehensive summary:</action>

    <check if="{{apply_changes}} is true">
      <action>### Optimizations Applied</action>
      <action>- Total changes: [count]</action>
      <action>- Performance improvements: [list]</action>
      <action>- Error handling added: [list]</action>
      <action>- Code quality fixes: [list]</action>
      <action>- Structure improvements: [list]</action>
      <action>- Best practices applied: [list]</action>
      <action>- Backup location: {{workflow_file}}.backup-{timestamp}</action>

      <action>### Expected Improvements</action>
      <action>- Execution speed: [estimated improvement]</action>
      <action>- Reliability: [improvements]</action>
      <action>- Maintainability: [improvements]</action>
      <action>- Security: [improvements]</action>

      <action>### Testing Recommendations</action>
      <action>1. Import optimized workflow into n8n</action>
      <action>2. Test with sample data</action>
      <action>3. Compare execution times with original</action>
      <action>4. Verify all functionality works correctly</action>
      <action>5. Monitor error rates</action>
    </check>

    <check if="{{apply_changes}} is false">
      <action>### Optimization Report</action>
      <action>Report saved with all recommendations</action>
      <action>No changes applied to workflow</action>
      <action>Review recommendations and apply manually if desired</action>
    </check>

    <action>Ask: "Would you like additional help?"</action>
    <action>Present numbered options:
      1. No - I'm done
      2. Yes - Explain specific optimizations
      3. Yes - Optimize another workflow
      4. Revert - Restore from backup
    </action>
    <action>WAIT for user selection (1-4)</action>

    <check if="selection is 2">
      <action>Ask: "Which optimization would you like explained?"</action>
      <action>WAIT for user input</action>
      <action>Provide detailed explanation</action>
    </check>

    <check if="selection is 3">
      <action>Return to Step 1 for new workflow</action>
    </check>

    <check if="selection is 4">
      <action>Restore workflow from backup</action>
      <action>Confirm restoration to user</action>
    </check>
  </step>

  <step n="13" goal="Validate Content">
    <invoke-task>Validate against checklist at {{validation}} using {{bmad_folder}}/core/tasks/validate-workflow.xml</invoke-task>
  </step>

</workflow>
```
