# Party Mode - Multi-Agent Discussion Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>This workflow orchestrates group discussions between all installed BMAD agents</critical>

<workflow>

<step n="1" goal="Load Agent Manifest and Configurations">
  <action>Load the agent manifest CSV from {{manifest}}</action>
  <action>Parse CSV to extract all agent entries with their condensed information:</action>
    - name (agent identifier)
    - displayName (agent's persona name)
    - title (formal position)
    - icon (visual identifier)
    - role (capabilities summary)
    - identity (background/expertise)
    - communicationStyle (how they communicate)
    - principles (decision-making philosophy)
    - module (source module)
    - path (file location)

<action>For each agent found in manifest:</action>
<check>Look for config override at {{agent_overrides}}[module]-[agent-name].customize.yaml</check>
<action if="agent override exists">Load the override configuration</action>
<action>MERGE override data with manifest data (overrides take precedence):</action> - Override role replaces manifest role if present - Override identity replaces manifest identity if present - Override communicationStyle replaces manifest communicationStyle if present - Override principles replace manifest principles if present - Any additional persona elements from override are added

<action>Build complete agent roster with merged personalities</action>
<action>Store agent data for use in conversation orchestration</action>
</step>

<step n="2" goal="Initialize Party Mode">
  <action>Announce party mode activation with enthusiasm</action>
  <action>List all participating agents with their merged information:</action>
  <format>
    🎉 PARTY MODE ACTIVATED! 🎉
    All agents are here for a group discussion!

    Participating agents:
    [For each agent in roster:]
    - [Agent Name] ([Title]): [Role from merged data]

    [Total count] agents ready to collaborate!

    What would you like to discuss with the team?

  </format>
  <action>Wait for user to provide initial topic or question</action>
</step>

<step n="3" goal="Orchestrate Multi-Agent Discussion" repeat="until-exit">
  <action>For each user message or topic:</action>

  <substep n="3a" goal="Determine Relevant Agents">
    <action>Analyze the user's message/question</action>
    <action>Identify which agents would naturally respond based on:</action>
      - Their role and capabilities (from merged data)
      - Their stated principles
      - Their memories/context if relevant
      - Their collaboration patterns
    <action>Select 2-3 most relevant agents for this response</action>
    <note>If user addresses specific agent by name, prioritize that agent</note>
  </substep>

  <substep n="3b" goal="Generate In-Character Responses">
    <action>For each selected agent, generate authentic response:</action>
    <action>Use the agent's merged personality data:</action>
      - Apply their communicationStyle exactly
      - Reflect their principles in reasoning
      - Draw from their identity and role for expertise
      - Maintain their unique voice and perspective

    <action>Enable natural cross-talk between agents:</action>
      - Agents can reference each other by name
      - Agents can build on previous points
      - Agents can respectfully disagree or offer alternatives
      - Agents can ask follow-up questions to each other

  </substep>

  <substep n="3c" goal="Handle Questions and Interactions">
    <check>If an agent asks the user a direct question:</check>
      <action>Clearly highlight the question</action>
      <action>End that round of responses</action>
      <action>Display: "[Agent Name]: [Their question]"</action>
      <action>Display: "[Awaiting user response...]"</action>
      <action>WAIT for user input before continuing</action>

    <check>If agents ask each other questions:</check>
      <action>Allow natural back-and-forth in the same response round</action>
      <action>Maintain conversational flow</action>

    <check>If discussion becomes circular or repetitive:</check>
      <action>The BMad Master will summarize</action>
      <action>Redirect to new aspects or ask for user guidance</action>

  </substep>

  <substep n="3d" goal="Format and Present Responses">
    <action>Present each agent's contribution clearly:</action>
    <format>
      [Agent Name]: [Their response in their voice/style]

      [Another Agent]: [Their response, potentially referencing the first]

      [Third Agent if selected]: [Their contribution]
    </format>

    <action>Maintain spacing between agents for readability</action>
    <action>Preserve each agent's unique voice throughout</action>

  </substep>

  <substep n="3e" goal="Check for Exit Conditions">
    <check>If user message contains any {{exit_triggers}}:</check>
      <action>Have agents provide brief farewells in character</action>
      <action>Thank user for the discussion</action>
      <goto step="4">Exit party mode</goto>

    <check>If user seems done or conversation naturally concludes:</check>
      <ask>Would you like to continue the discussion or end party mode?</ask>
      <check>If user indicates end:</check>
        <goto step="4">Exit party mode</goto>

  </substep>
</step>

<step n="4" goal="Exit Party Mode">
  <action>Have 2-3 agents provide characteristic farewells to the user, and 1-2 to each other</action>
  <format>
    [Agent 1]: [Brief farewell in their style]

    [Agent 2]: [Their goodbye]

    🎊 Party Mode ended. Thanks for the great discussion!

  </format>
  <action>Exit workflow</action>
</step>

</workflow>

## Role-Playing Guidelines

<guidelines>
  <guideline>Keep all responses strictly in-character based on merged personality data</guideline>
  <guideline>Use each agent's documented communication style consistently</guideline>
  <guideline>Reference agent memories and context when relevant</guideline>
  <guideline>Allow natural disagreements and different perspectives</guideline>
  <guideline>Maintain professional discourse while being engaging</guideline>
  <guideline>Let agents reference each other naturally by name or role</guideline>
  <guideline>Include personality-driven quirks and occasional humor</guideline>
  <guideline>Respect each agent's expertise boundaries</guideline>
</guidelines>

## Question Handling Protocol

<question-protocol>
  <direct-to-user>
    When agent asks user a specific question (e.g., "What's your budget?"):
    - End that round immediately after the question
    - Clearly highlight the questioning agent and their question
    - Wait for user response before any agent continues
  </direct-to-user>

  <rhetorical>
    Agents can ask rhetorical or thinking-aloud questions without pausing
  </rhetorical>

  <inter-agent>
    Agents can question each other and respond naturally within same round
  </inter-agent>
</question-protocol>

## Moderation Notes

<moderation>
  <note>If discussion becomes circular, have bmad-master summarize and redirect</note>
  <note>If user asks for specific agent, let that agent take primary lead</note>
  <note>Balance fun and productivity based on conversation tone</note>
  <note>Ensure all agents stay true to their merged personalities</note>
  <note>Exit gracefully when user indicates completion</note>
</moderation>
