# Research Workflow Router Instructions

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate in {communication_language}, generate documents in {document_output_language}</critical>
<critical>Web research is ENABLED - always use current {{current_year}} data</critical>

<critical>🚨 ANTI-HALLUCINATION PROTOCOL - MANDATORY 🚨</critical>
<critical>NEVER present information without a verified source - if you cannot find a source, say "I could not find reliable data on this"</critical>
<critical>ALWAYS cite sources with URLs when presenting data, statistics, or factual claims</critical>
<critical>REQUIRE at least 2 independent sources for critical claims (market size, growth rates, competitive data)</critical>
<critical>When sources conflict, PRESENT BOTH views and note the discrepancy - do NOT pick one arbitrarily</critical>
<critical>Flag any data you are uncertain about with confidence levels: [High Confidence], [Medium Confidence], [Low Confidence - verify]</critical>
<critical>Distinguish clearly between: FACTS (from sources), ANALYSIS (your interpretation), and SPECULATION (educated guesses)</critical>
<critical>When using WebSearch results, ALWAYS extract and include the source URL for every claim</critical>

<!-- IDE-INJECT-POINT: research-subagents -->

<workflow>

<critical>This is a ROUTER that directs to specialized research instruction sets</critical>

<step n="1" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

<check if="status file not found">
  <output>No workflow status file found. Research is optional - you can continue without status tracking.</output>
  <action>Set standalone_mode = true</action>
</check>

<check if="status file found">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "research" workflow</action>
  <action>Get project_level from YAML metadata</action>
  <action>Find first non-completed workflow (next expected workflow)</action>
  <action>Pass status context to loaded instruction set for final update</action>

  <check if="research status is file path (already completed)">
    <output>⚠️ Research already completed: {{research status}}</output>
    <ask>Re-running will create a new research report. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="research is not the next expected workflow (latter items are completed already in the list)">
    <output>⚠️ Next expected workflow: {{next_workflow}}. Research is out of sequence.</output>
    <output>Note: Research can provide valuable insights at any project stage.</output>
    <ask>Continue with Research anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. Run {{next_workflow}} instead.</output>
      <action>Exit workflow</action>
    </check>
  </check>

<action>Set standalone_mode = false</action>
</check>
</step>

<step n="2" goal="Discover research needs through conversation">

<action>Welcome {user_name} warmly. Position yourself as their research partner who uses live {{current_year}} web data. Ask what they're looking to understand or research.</action>

<action>Listen and collaboratively identify the research type based on what they describe:

- Market/Business questions → Market Research
- Competitor questions → Competitive Intelligence
- Customer questions → User Research
- Technology questions → Technical Research
- Industry questions → Domain Research
- Creating research prompts for AI platforms → Deep Research Prompt Generator

Confirm your understanding of what type would be most helpful and what it will produce.
</action>

<action>Capture {{research_type}} and {{research_mode}}</action>

<template-output>research_type_discovery</template-output>
</step>

<step n="3" goal="Route to Appropriate Research Instructions">

<critical>Based on user selection, load the appropriate instruction set</critical>

<check if="research_type == 1 OR fuzzy match market research">
  <action>Set research_mode = "market"</action>
  <action>LOAD: {installed_path}/instructions-market.md</action>
  <action>Continue with market research workflow</action>
</check>

<check if="research_type == 2 or prompt or fuzzy match deep research prompt">
  <action>Set research_mode = "deep-prompt"</action>
  <action>LOAD: {installed_path}/instructions-deep-prompt.md</action>
  <action>Continue with deep research prompt generation</action>
</check>

<check if="research_type == 3 technical or architecture or fuzzy match indicates technical type of research">
  <action>Set research_mode = "technical"</action>
  <action>LOAD: {installed_path}/instructions-technical.md</action>
  <action>Continue with technical research workflow</action>

</check>

<check if="research_type == 4 or fuzzy match competitive">
  <action>Set research_mode = "competitive"</action>
  <action>This will use market research workflow with competitive focus</action>
  <action>LOAD: {installed_path}/instructions-market.md</action>
  <action>Pass mode="competitive" to focus on competitive intelligence</action>

</check>

<check if="research_type == 5 or fuzzy match user research">
  <action>Set research_mode = "user"</action>
  <action>This will use market research workflow with user research focus</action>
  <action>LOAD: {installed_path}/instructions-market.md</action>
  <action>Pass mode="user" to focus on customer insights</action>

</check>

<check if="research_type == 6 or fuzzy match domain or industry or category">
  <action>Set research_mode = "domain"</action>
  <action>This will use market research workflow with domain focus</action>
  <action>LOAD: {installed_path}/instructions-market.md</action>
  <action>Pass mode="domain" to focus on industry/domain analysis</action>
</check>

<critical>The loaded instruction set will continue from here with full context of the {research_type}</critical>

</step>

</workflow>
