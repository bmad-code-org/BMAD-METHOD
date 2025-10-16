# Research Workflow Router Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<!-- IDE-INJECT-POINT: research-subagents -->

<workflow>

<critical>This is a ROUTER that directs to specialized research instruction sets</critical>

<step n="1" goal="Check and load workflow status file">
<action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
<action>Find the most recent file (by date in filename: bmm-workflow-status.md)</action>

<check if="exists">
  <action>Load the status file</action>
  <action>Set status_file_found = true</action>
  <action>Store status_file_path for later updates</action>
</check>

<check if="not exists">
  <ask>**No workflow status file found.**

This workflow conducts research (optional Phase 1 workflow).

Options:

1. Run workflow-status first to create the status file (recommended for progress tracking)
2. Continue in standalone mode (no progress tracking)
3. Exit

What would you like to do?</ask>
<action>If user chooses option 1 → HALT with message: "Please run workflow-status first, then return to research"</action>
<action>If user chooses option 2 → Set standalone_mode = true and continue</action>
<action>If user chooses option 3 → HALT</action>
</check>
</step>

<step n="2" goal="Welcome and Research Type Selection">
<action>Welcome the user to the Research Workflow</action>

**The Research Workflow supports multiple research types:**

Present the user with research type options:

**What type of research do you need?**

1. **Market Research** - Comprehensive market analysis with TAM/SAM/SOM calculations, competitive intelligence, customer segments, and go-to-market strategy
   - Use for: Market opportunity assessment, competitive landscape analysis, market sizing
   - Output: Detailed market research report with financials

2. **Deep Research Prompt Generator** - Create structured, multi-step research prompts optimized for AI platforms (ChatGPT, Gemini, Grok, Claude)
   - Use for: Generating comprehensive research prompts, structuring complex investigations
   - Output: Optimized research prompt with framework, scope, and validation criteria

3. **Technical/Architecture Research** - Evaluate technology stacks, architecture patterns, frameworks, and technical approaches
   - Use for: Tech stack decisions, architecture pattern selection, framework evaluation
   - Output: Technical research report with recommendations and trade-off analysis

4. **Competitive Intelligence** - Deep dive into specific competitors, their strategies, products, and market positioning
   - Use for: Competitor deep dives, competitive strategy analysis
   - Output: Competitive intelligence report

5. **User Research** - Customer insights, personas, jobs-to-be-done, and user behavior analysis
   - Use for: Customer discovery, persona development, user journey mapping
   - Output: User research report with personas and insights

6. **Domain/Industry Research** - Deep dive into specific industries, domains, or subject matter areas
   - Use for: Industry analysis, domain expertise building, trend analysis
   - Output: Domain research report

<ask>Select a research type (1-6) or describe your research needs:</ask>

<action>Capture user selection as {{research_type}}</action>

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
