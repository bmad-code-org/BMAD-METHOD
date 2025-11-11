# Product Brief - Context-Adaptive Discovery Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses INTENT-DRIVEN FACILITATION - adapt organically to what emerges</critical>
<critical>The goal is DISCOVERING WHAT MATTERS through natural conversation, not filling a template</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to the document continuously as you discover - never wait until the end</critical>

## Input Document Discovery

This workflow may reference: market research, brainstorming documents, user specified other inputs, or brownfield project documentation.

**Discovery Process** (execute for each referenced document):

1. **Search for whole document first** - Use fuzzy file matching to find the complete document
2. **Check for sharded version** - If whole document not found, look for `{doc-name}/index.md`
3. **If sharded version found**:
   - Read `index.md` to understand the document structure
   - Read ALL section files listed in the index
   - Treat the combined content as if it were a single document
4. **Brownfield projects**: The `document-project` workflow always creates `{output_folder}/docs/index.md`

**Priority**: If both whole and sharded versions exist, use the whole document.

**Fuzzy matching**: Be flexible with document names - users may use variations in naming conventions.

<workflow>

<step n="0" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

<action if="status file not found">Set standalone_mode = true</action>

<check if="status file found">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "product-brief" workflow</action>
  <action>Get project_level from YAML metadata</action>
  <action>Find first non-completed workflow (next expected workflow)</action>

  <check if="project_level < 2">
    <output>**Note: Level {{project_level}} Project**

Product Brief is most valuable for Level 2+ projects, but can help clarify vision for any project.</output>
</check>

  <check if="product-brief status is file path (already completed)">
    <output>⚠️ Product Brief already completed: {{product-brief status}}</output>
    <ask>Re-running will overwrite the existing brief. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="product-brief is not the next expected workflow">
    <output>⚠️ Next expected workflow: {{next_workflow}}. Product Brief is out of sequence.</output>
    <ask>Continue with Product Brief anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. Run {{next_workflow}} instead.</output>
      <action>Exit workflow</action>
    </check>
  </check>

<action>Set standalone_mode = false</action>
</check>
</step>

<step n="1" goal="Begin the journey and understand context">
<action>Welcome {user_name} warmly in {communication_language}

Adapt your tone to {user_skill_level}:

- Expert: "Let's define your product vision. What are you building?"
- Intermediate: "I'm here to help shape your product vision. Tell me about your idea."
- Beginner: "Hi! I'm going to help you figure out exactly what you want to build. Let's start with your idea - what got you excited about this?"

Start with open exploration:

- What sparked this idea?
- What are you hoping to build?
- Who is this for - yourself, a business, users you know?

CRITICAL: Listen for context clues that reveal their situation:

- Personal/hobby project (fun, learning, small audience)
- Startup/solopreneur (market opportunity, competition matters)
- Enterprise/corporate (stakeholders, compliance, strategic alignment)
- Technical enthusiasm (implementation focused)
- Business opportunity (market/revenue focused)
- Problem frustration (solution focused)

Based on their initial response, sense:

- How formal/casual they want to be
- Whether they think in business or technical terms
- If they have existing materials to share
- Their confidence level with the domain</action>

<ask>What's the project name, and what got you excited about building this?</ask>

<action>From even this first exchange, create initial document sections</action>
<template-output>project_name</template-output>
<template-output>executive_summary</template-output>

<action>If they mentioned existing documents (research, brainstorming, etc.):

- Load and analyze these materials
- Extract key themes and insights
- Reference these naturally in conversation: "I see from your research that..."
- Use these to accelerate discovery, not repeat questions</action>

<template-output>initial_vision</template-output>
</step>

<step n="2" goal="Discover the problem worth solving">
<action>Guide problem discovery through natural conversation

DON'T ask: "What problem does this solve?"

DO explore conversationally based on their context:

For hobby projects:

- "What's annoying you that this would fix?"
- "What would this make easier or more fun?"
- "Show me what the experience is like today without this"

For business ventures:

- "Walk me through the frustration your users face today"
- "What's the cost of this problem - time, money, opportunities?"
- "Who's suffering most from this? Tell me about them"
- "What solutions have people tried? Why aren't they working?"

For enterprise:

- "What's driving the need for this internally?"
- "Which teams/processes are most affected?"
- "What's the business impact of not solving this?"
- "Are there compliance or strategic drivers?"

Listen for depth cues:

- Brief answers → dig deeper with follow-ups
- Detailed passion → let them flow, capture everything
- Uncertainty → help them explore with examples
- Multiple problems → help prioritize the core issue

Adapt your response:

- If they struggle: offer analogies, examples, frameworks
- If they're clear: validate and push for specifics
- If they're technical: explore implementation challenges
- If they're business-focused: quantify impact</action>

<action>Immediately capture what emerges - even if preliminary</action>
<template-output>problem_statement</template-output>

<check if="user mentioned metrics, costs, or business impact">
  <action>Explore the measurable impact of the problem</action>
  <template-output>problem_impact</template-output>
</check>

<check if="user mentioned current solutions or competitors">
  <action>Understand why existing solutions fall short</action>
  <template-output>existing_solutions_gaps</template-output>
</check>

<action>Reflect understanding: "So the core issue is {{problem_summary}}, and {{impact_if_mentioned}}. Let me capture that..."</action>
</step>

<step n="3" goal="Shape the solution vision">
<action>Transition naturally from problem to solution

Based on their energy and context, explore:

For builders/makers:

- "How do you envision this working?"
- "Walk me through the experience you want to create"
- "What's the 'magic moment' when someone uses this?"

For business minds:

- "What's your unique approach to solving this?"
- "How is this different from what exists today?"
- "What makes this the RIGHT solution now?"

For enterprise:

- "What would success look like for the organization?"
- "How does this fit with existing systems/processes?"
- "What's the transformation you're enabling?"

Go deeper based on responses:

- If innovative → explore the unique angle
- If standard → focus on execution excellence
- If technical → discuss key capabilities
- If user-focused → paint the journey

Web research when relevant:

- If they mention competitors → research current solutions
- If they claim innovation → verify uniqueness
- If they reference trends → get current data</action>

<action if="competitor or market mentioned">
  <WebSearch>{{competitor/market}} latest features 2024</WebSearch>
  <action>Use findings to sharpen differentiation discussion</action>
</action>

<template-output>proposed_solution</template-output>

<check if="unique differentiation discussed">
  <template-output>key_differentiators</template-output>
</check>

<action>Continue building the living document</action>
</step>

<step n="4" goal="Understand the people who need this">
<action>Discover target users through storytelling, not demographics

Facilitate based on project type:

Personal/hobby:

- "Who else would love this besides you?"
- "Tell me about someone who would use this"
- Keep it light and informal

Startup/business:

- "Describe your ideal first customer - not demographics, but their situation"
- "What are they doing today without your solution?"
- "What would make them say 'finally, someone gets it!'?"
- "Are there different types of users with different needs?"

Enterprise:

- "Which roles/departments will use this?"
- "Walk me through their current workflow"
- "Who are the champions vs skeptics?"
- "What about indirect stakeholders?"

Push beyond generic personas:

- Not: "busy professionals" → "Sales reps who waste 2 hours/day on data entry"
- Not: "tech-savvy users" → "Developers who know Docker but hate configuring it"
- Not: "small businesses" → "Shopify stores doing $10-50k/month wanting to scale"

For each user type that emerges:

- Current behavior/workflow
- Specific frustrations
- What they'd value most
- Their technical comfort level</action>

<template-output>primary_user_segment</template-output>

<check if="multiple user types mentioned">
  <action>Explore secondary users only if truly different needs</action>
  <template-output>secondary_user_segment</template-output>
</check>

<check if="user journey or workflow discussed">
  <template-output>user_journey</template-output>
</check>
</step>

<step n="5" goal="Define what success looks like" repeat="adapt-to-context">
<action>Explore success measures that match their context

For personal projects:

- "How will you know this is working well?"
- "What would make you proud of this?"
- Keep metrics simple and meaningful

For startups:

- "What metrics would convince you this is taking off?"
- "What user behaviors show they love it?"
- "What business metrics matter most - users, revenue, retention?"
- Push for specific targets: "100 users" not "lots of users"

For enterprise:

- "How will the organization measure success?"
- "What KPIs will stakeholders care about?"
- "What are the must-hit metrics vs nice-to-haves?"

Only dive deep into metrics if they show interest
Skip entirely for pure hobby projects
Focus on what THEY care about measuring</action>

<check if="metrics or goals discussed">
  <template-output>success_metrics</template-output>

  <check if="business objectives mentioned">
    <template-output>business_objectives</template-output>
  </check>

  <check if="KPIs matter to them">
    <template-output>key_performance_indicators</template-output>
  </check>
</check>

<action>Keep the document growing with each discovery</action>
</step>

<step n="6" goal="Discover the MVP scope">
<critical>Focus on FEATURES not epics - that comes in Phase 2</critical>

<action>Guide MVP scoping based on their maturity

For experimental/hobby:

- "What's the ONE thing this must do to be useful?"
- "What would make a fun first version?"
- Embrace simplicity

For business ventures:

- "What's the smallest version that proves your hypothesis?"
- "What features would make early adopters say 'good enough'?"
- "What's tempting to add but would slow you down?"
- Be ruthless about scope creep

For enterprise:

- "What's the pilot scope that demonstrates value?"
- "Which capabilities are must-have for initial rollout?"
- "What can we defer to Phase 2?"

Use this framing:

- Core features: "Without this, the product doesn't work"
- Nice-to-have: "This would be great, but we can launch without it"
- Future vision: "This is where we're headed eventually"

Challenge feature creep:

- "Do we need that for launch, or could it come later?"
- "What if we started without that - what breaks?"
- "Is this core to proving the concept?"</action>

<template-output>core_features</template-output>

<check if="scope creep discussed">
  <template-output>out_of_scope</template-output>
</check>

<check if="future features mentioned">
  <template-output>future_vision_features</template-output>
</check>

<check if="success criteria for MVP mentioned">
  <template-output>mvp_success_criteria</template-output>
</check>
</step>

<step n="7" goal="Explore relevant context dimensions" repeat="until-natural-end">
<critical>Only explore what emerges naturally - skip what doesn't matter</critical>

<action>Based on the conversation so far, selectively explore:

IF financial aspects emerged:

- Development investment needed
- Revenue potential or cost savings
- ROI timeline
- Budget constraints
  <check if="discussed">
  <template-output>financial_considerations</template-output>
  </check>

IF market competition mentioned:

- Competitive landscape
- Market opportunity size
- Differentiation strategy
- Market timing
  <check if="discussed">
  <WebSearch>{{market}} size trends 2024</WebSearch>
  <template-output>market_analysis</template-output>
  </check>

IF technical preferences surfaced:

- Platform choices (web/mobile/desktop)
- Technology stack preferences
- Integration needs
- Performance requirements
  <check if="discussed">
  <template-output>technical_preferences</template-output>
  </check>

IF organizational context emerged:

- Strategic alignment
- Stakeholder buy-in needs
- Change management considerations
- Compliance requirements
  <check if="discussed">
  <template-output>organizational_context</template-output>
  </check>

IF risks or concerns raised:

- Key risks and mitigation
- Critical assumptions
- Open questions needing research
  <check if="discussed">
  <template-output>risks_and_assumptions</template-output>
  </check>

IF timeline pressures mentioned:

- Launch timeline
- Critical milestones
- Dependencies
  <check if="discussed">
  <template-output>timeline_constraints</template-output>
  </check>

Skip anything that hasn't naturally emerged
Don't force sections that don't fit their context</action>
</step>

<step n="8" goal="Refine and complete the living document">
<action>Review what's been captured with the user

"Let me show you what we've built together..."

Present the actual document sections created so far

- Not a summary, but the real content
- Shows the document has been growing throughout

Ask:
"Looking at this, what stands out as most important to you?"
"Is there anything critical we haven't explored?"
"Does this capture your vision?"

Based on their response:

- Refine sections that need more depth
- Add any missing critical elements
- Remove or simplify sections that don't matter
- Ensure the document fits THEIR needs, not a template</action>

<action>Make final refinements based on feedback</action>
<template-output>final_refinements</template-output>

<action>Create executive summary that captures the essence</action>
<template-output>executive_summary</template-output>
</step>
<step n="9" goal="Complete and save the product brief">
<action>The document has been building throughout our conversation
Now ensure it's complete and well-organized</action>

<check if="research documents were provided">
  <action>Append summary of incorporated research</action>
  <template-output>supporting_materials</template-output>
</check>

<action>Ensure the document structure makes sense for what was discovered:

- Hobbyist projects might be 2-3 pages focused on problem/solution/features
- Startup ventures might be 5-7 pages with market analysis and metrics
- Enterprise briefs might be 10+ pages with full strategic context

The document should reflect their world, not force their world into a template</action>

<ask>Your product brief is ready! Would you like to:

1. Review specific sections together
2. Make any final adjustments
3. Save and move forward

What feels right?</ask>

<action>Make any requested refinements</action>
<template-output>final_document</template-output>
</step>

<check if="standalone_mode != true">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Find workflow_status key "product-brief"</action>
  <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
  <action>Update workflow_status["product-brief"] = "{output_folder}/bmm-product-brief-{{project_name}}-{{date}}.md"</action>
  <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
<action>Determine next agent from path file based on next workflow</action>
</check>

<output>**✅ Product Brief Complete, {user_name}!**

Your product vision has been captured in a document that reflects what matters most for your {{context_type}} project.

**Document saved:** {output_folder}/bmm-product-brief-{{project_name}}-{{date}}.md

{{#if standalone_mode != true}}
**What's next:** {{next_workflow}} ({{next_agent}} agent)

The next phase will take your brief and create the detailed planning artifacts needed for implementation.
{{else}}
**Next steps:**

- Run `workflow-init` to set up guided workflow tracking
- Or proceed directly to the PRD workflow if you know your path
  {{/if}}

Remember: This brief captures YOUR vision. It grew from our conversation, not from a rigid template. It's ready to guide the next phase of bringing your idea to life.
</output>
</step>

</workflow>
