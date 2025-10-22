# Retrospective - Epic Completion Review Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/4-implementation/retrospective/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>

<critical>DOCUMENT OUTPUT: Retrospective analysis. Concise insights, lessons learned, action items. User skill level ({user_skill_level}) affects conversation style ONLY, not retrospective content.</critical>
FACILITATION NOTES:

- Scrum Master facilitates this retrospective
- Psychological safety is paramount - NO BLAME
- Focus on systems, processes, and learning
- Everyone contributes with specific examples preferred
- Action items must be achievable with clear ownership
- Two-part format: (1) Epic Review + (2) Next Epic Preparation
  </critical>

<workflow>

<step n="1" goal="Epic Context Discovery">
<action>Help the user identify which epic was just completed through natural conversation</action>
<action>Attempt to auto-detect by checking {output_folder}/stories/ for the highest numbered completed story and extracting the epic number</action>
<action>If auto-detection succeeds, confirm with user: "It looks like Epic {{epic_number}} was just completed - is that correct?"</action>
<action>If auto-detection fails or user indicates different epic, ask them to share which epic they just completed</action>

<action>Verify epic completion status in sprint-status:</action>

<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: check_epic_complete</param>
  <param>epic_id: {{epic_number}}</param>
</invoke-workflow>

<check if="{{result_complete}} == false">
  <output>⚠️ Epic {{epic_number}} is not yet complete for retrospective

**Epic Status:**

- Total Stories: {{result_total_stories}}
- Completed (Done): {{result_done_stories}}
- Pending: {{result_total_stories - result_done_stories}}

**Pending Stories:**
{{result_pending_stories}}

**Options:**

1. Complete remaining stories before running retrospective
2. Continue with partial retrospective (not recommended)
3. Run sprint-planning to refresh story tracking
   </output>

<ask if="{{non_interactive}} == false">Epic is incomplete. Continue anyway? (yes/no)</ask>

  <check if="user says no">
    <action>HALT</action>
  </check>

<action if="user says yes">Set {{partial_retrospective}} = true</action>
</check>

<check if="{{result_complete}} == true">
  <output>✅ Epic {{epic_number}} is complete - all {{result_done_stories}} stories done!

Ready to proceed with retrospective.
</output>
</check>

<action>Load the completed epic from: {output_folder}/prd/epic-{{epic_number}}.md</action>
<action>Extract epic details:

- Epic title and goals
- Success criteria
- Planned stories and story points
- Estimated sprint duration
- Business objectives
  </action>

<action>Find all stories for this epic in {output_folder}/stories/</action>
<action>For each story, extract: - Story number and title - Completion status - Story points (if tracked) - Actual completion date - Dev Agent Record notes - TEA Results and testing outcomes - PO Notes and acceptance - Blockers encountered and resolution - Technical debt incurred
</action>

<action>Calculate epic metrics: - Completed stories vs. total planned - Actual story points delivered vs. planned - Actual sprints taken vs. estimated - Velocity (points per sprint) - Blocker count - Technical debt items logged
</action>

<action>Review epic goals and compare actual outcomes vs. planned</action>
<action>Note any scope changes or descoped items</action>
<action>Document key architectural decisions made during epic</action>
<action>Identify technical debt incurred and why</action>
</step>

<step n="2" goal="Preview Next Epic">
<action>Identify the next epic in sequence</action>
<action>Load next epic from: {output_folder}/prd/epic-{{next_epic_number}}.md</action>

<action if="next epic exists">
Analyze next epic for:
  - Epic title and objectives
  - Planned stories and complexity
  - Dependencies on completed epic work
  - New technical requirements or capabilities needed
  - Potential risks or unknowns
</action>

<action>Identify dependencies on completed work:

- What components from Epic {{completed_number}} does Epic {{next_number}} rely on?
- Are all prerequisites complete and stable?
- Any incomplete work that creates blocking dependencies?
  </action>

<action>Note potential gaps or preparation needed:

- Technical setup required (infrastructure, tools, libraries)
- Knowledge gaps to fill (research, training, spikes)
- Refactoring needed before starting next epic
- Documentation or specifications to create
  </action>

<action>Check for technical prerequisites:

- APIs or integrations that must be ready
- Data migrations or schema changes needed
- Testing infrastructure requirements
- Deployment or environment setup
  </action>

</step>

<step n="3" goal="Initialize Retrospective with Context">
<action>Scrum Master opens the retrospective with context</action>
<action>Present formatted retrospective header:

```
🔄 TEAM RETROSPECTIVE - Epic {{epic_number}}: {{epic_title}}

Scrum Master facilitating

═══════════════════════════════════════════════════════════

EPIC {{epic_number}} SUMMARY:

Delivery Metrics:
- Completed: {{completed_stories}}/{{total_stories}} stories ({{completion_percentage}}%)
- Velocity: {{actual_points}} story points (planned: {{planned_points}})
- Duration: {{actual_sprints}} sprints (planned: {{planned_sprints}})
- Average velocity: {{points_per_sprint}} points/sprint

Quality and Technical:
- Blockers encountered: {{blocker_count}}
- Technical debt items: {{debt_count}}
- Test coverage: {{coverage_info}}
- Production incidents: {{incident_count}}

Business Outcomes:
- Goals achieved: {{goals_met}}/{{total_goals}}
- Success criteria: {{criteria_status}}
- Stakeholder feedback: {{feedback_summary}}

═══════════════════════════════════════════════════════════

NEXT EPIC PREVIEW: Epic {{next_number}}: {{next_epic_title}}

Dependencies on Epic {{epic_number}}:
{{list_dependencies}}

Preparation Needed:
{{list_preparation_gaps}}

Technical Prerequisites:
{{list_technical_prereqs}}

═══════════════════════════════════════════════════════════

Team assembled for reflection:
{{list_agents_based_on_story_records}}

Focus Areas:
1. Learning from Epic {{epic_number}} execution
2. Preparing for Epic {{next_number}} success
```

</action>

<action>Load agent configurations from {agent-manifest}</action>
<action>Ensure key roles present from the {agent_manifest}: Product Owner, Scrum Master (facilitating the retro), Devs, Testing or QA, Architect, Analyst</action>
</step>

<step n="4" goal="Epic Review Discussion">
<action>Scrum Master facilitates Part 1: Reviewing the completed epic through natural, psychologically safe discussion</action>
<action>Create space for each agent to share their perspective in their unique voice and communication style, grounded in actual story data and outcomes</action>
<action>Maintain psychological safety throughout - focus on learning and systems, not blame or individual performance</action>

<action>Guide the retrospective conversation to naturally surface key themes across three dimensions:</action>

**1. Successes and Strengths:**
<action>Facilitate discussion that helps agents share what worked well during the epic - encourage specific examples from completed stories, effective practices, velocity achievements, collaboration wins, and smart technical decisions</action>
<action>Draw out concrete examples: "Can you share a specific story where that approach worked well?"</action>

**2. Challenges and Growth Areas:**
<action>Create safe space for agents to explore challenges encountered - guide them to discuss blockers, process friction, technical debt decisions, and coordination issues with curiosity rather than judgment</action>
<action>Probe for root causes: "What made that challenging? What pattern do we see here?"</action>
<action>Keep focus on systems and processes, not individuals</action>

**3. Insights and Learning:**
<action>Help the team articulate what they learned from this epic - facilitate discovery of patterns to repeat or avoid, skills gained, and process improvements worth trying</action>
<action>Connect insights to future application: "How might this insight help us in future epics?"</action>

<action>For each agent participating (loaded from {agent_manifest}):</action>

- Let them speak naturally in their role's voice and communication style
- Encourage grounding in specific story records, metrics, and real outcomes
- Allow themes to emerge organically rather than forcing a rigid structure
- Follow interesting threads with adaptive questions
- Balance celebration with honest assessment

<action>As facilitator, actively synthesize common themes and patterns as the discussion unfolds</action>
<action>Notice when multiple agents mention similar issues or successes - call these out to deepen the team's shared understanding</action>
<action>Ensure every voice is heard, inviting quieter agents to contribute</action>
</step>

<step n="5" goal="Next Epic Preparation Discussion">
<action>Scrum Master facilitates Part 2: Preparing for the next epic through forward-looking exploration</action>
<action>Shift the team's focus from reflection to readiness - guide each agent to explore preparation needs from their domain perspective</action>

<action>Facilitate discovery across critical preparation dimensions:</action>

**Dependencies and Continuity:**
<action>Guide agents to explore connections between the completed epic and the upcoming one - help them identify what components, decisions, or work from Epic {{completed_number}} the next epic relies upon</action>
<action>Probe for gaps: "What needs to be in place before we can start Epic {{next_number}}?"</action>
<action>Surface hidden dependencies: "Are there integration points we need to verify?"</action>

**Readiness and Setup:**
<action>Facilitate discussion about what preparation work is needed before the next epic can begin successfully - technical setup, knowledge development, refactoring, documentation, or infrastructure</action>
<action>Draw out specific needs: "What do you need to feel ready to start Epic {{next_number}}?"</action>
<action>Identify knowledge gaps: "What do we need to learn or research before diving in?"</action>

**Risks and Mitigation:**
<action>Create space for agents to voice concerns and uncertainties about the upcoming epic based on what they learned from this one</action>
<action>Explore proactively: "Based on Epic {{completed_number}}, what concerns do you have about Epic {{next_number}}?"</action>
<action>Develop mitigation thinking: "What could we do now to reduce that risk?"</action>
<action>Identify early warning signs: "How will we know if we're heading for that problem again?"</action>

<action>For each agent participating:</action>

- Let them share preparation needs in their natural voice
- Encourage domain-specific insights (Architect on technical setup, PM on requirements clarity, etc.)
- Follow interesting preparation threads with adaptive questions
- Help agents build on each other's observations
- Surface quick wins that could de-risk the epic early

<action>As facilitator, identify dependencies between preparation tasks as they emerge</action>
<action>Notice when preparation items from different agents connect or conflict - explore these intersections</action>
<action>Build a shared understanding of what "ready to start Epic {{next_number}}" actually means</action>
</step>

<step n="6" goal="Synthesize Action Items">
<action>Scrum Master identifies patterns across all agent feedback</action>
<action>Synthesizes common themes into team agreements</action>
<action>Creates specific, achievable action items with clear ownership</action>
<action>Develops preparation sprint tasks if significant setup needed</action>

<action>Present comprehensive action plan:

```
═══════════════════════════════════════════════════════════
📝 EPIC {{completed_number}} ACTION ITEMS:

Process Improvements:
1. {{action_item}} (Owner: {{agent}}, By: {{timeline}})
2. {{action_item}} (Owner: {{agent}}, By: {{timeline}})
3. {{action_item}} (Owner: {{agent}}, By: {{timeline}})

Technical Debt:
1. {{debt_item}} (Owner: {{agent}}, Priority: {{high/medium/low}})
2. {{debt_item}} (Owner: {{agent}}, Priority: {{high/medium/low}})

Documentation:
1. {{doc_need}} (Owner: {{agent}}, By: {{timeline}})

Team Agreements:
- {{agreement_1}}
- {{agreement_2}}
- {{agreement_3}}

═══════════════════════════════════════════════════════════
🚀 EPIC {{next_number}} PREPARATION SPRINT:

Technical Setup:
[ ] {{setup_task}} (Owner: {{agent}}, Est: {{hours/days}})
[ ] {{setup_task}} (Owner: {{agent}}, Est: {{hours/days}})

Knowledge Development:
[ ] {{research_task}} (Owner: {{agent}}, Est: {{hours/days}})
[ ] {{spike_task}} (Owner: {{agent}}, Est: {{hours/days}})

Cleanup/Refactoring:
[ ] {{refactor_task}} (Owner: {{agent}}, Est: {{hours/days}})
[ ] {{cleanup_task}} (Owner: {{agent}}, Est: {{hours/days}})

Documentation:
[ ] {{doc_task}} (Owner: {{agent}}, Est: {{hours/days}})

Total Estimated Effort: {{total_hours}} hours ({{total_days}} days)

═══════════════════════════════════════════════════════════
⚠️ CRITICAL PATH:

Blockers to Resolve Before Epic {{next_number}}:
1. {{critical_item}} (Owner: {{agent}}, Must complete by: {{date}})
2. {{critical_item}} (Owner: {{agent}}, Must complete by: {{date}})

Dependencies Timeline:
{{timeline_visualization_of_critical_dependencies}}

Risk Mitigation:
- {{risk}}: {{mitigation_strategy}}
- {{risk}}: {{mitigation_strategy}}
```

</action>

<action>Ensure every action item has clear owner and timeline</action>
<action>Prioritize preparation tasks by dependencies and criticality</action>
<action>Identify which tasks can run in parallel vs. sequential</action>
</step>

<step n="7" goal="Critical Readiness Exploration">
<action>Scrum Master leads a thoughtful exploration of whether Epic {{completed_number}} is truly complete and the team is ready for Epic {{next_number}}</action>
<action>Approach this as discovery, not interrogation - help user surface any concerns or unfinished elements that could impact the next epic</action>

<action>Guide a conversation exploring the completeness of Epic {{completed_number}} across critical dimensions:</action>

**Testing and Quality:**
<action>Explore the testing state of the epic - help user assess whether quality verification is truly complete</action>
<action>Ask thoughtfully: "Walk me through the testing that's been done for Epic {{completed_number}}. Does anything still need verification?"</action>
<action>Probe for gaps: "Are you confident the epic is production-ready from a quality perspective?"</action>
<action if="testing concerns surface">Add to Critical Path: Complete necessary testing before Epic {{next_number}}</action>

**Deployment and Release:**
<action>Understand where the epic currently stands in the deployment pipeline</action>
<action>Explore: "What's the deployment status for Epic {{completed_number}}? Is it live, scheduled, or still pending?"</action>
<action>If not yet deployed, clarify timeline: "When is deployment planned? Does that timing work for starting Epic {{next_number}}?"</action>
<action if="deployment must happen first">Add to Critical Path: Deploy Epic {{completed_number}} with clear timeline</action>

**Stakeholder Acceptance:**
<action>Guide user to reflect on business validation and stakeholder satisfaction</action>
<action>Ask: "Have stakeholders seen and accepted the Epic {{completed_number}} deliverables? Any feedback pending?"</action>
<action>Probe for risk: "Is there anything about stakeholder acceptance that could affect Epic {{next_number}}?"</action>
<action if="acceptance incomplete">Add to Critical Path: Obtain stakeholder acceptance before proceeding</action>

**Technical Health:**
<action>Create space for honest assessment of codebase stability after the epic</action>
<action>Explore: "How does the codebase feel after Epic {{completed_number}}? Stable and maintainable, or are there concerns?"</action>
<action>If concerns arise, probe deeper: "What's causing those concerns? What would it take to address them?"</action>
<action if="stability concerns exist">Document concerns and add to Preparation Sprint: Address stability issues before Epic {{next_number}}</action>

**Unresolved Blockers:**
<action>Help user surface any lingering issues that could create problems for the next epic</action>
<action>Ask: "Are there any unresolved blockers or technical issues from Epic {{completed_number}} that we need to address before moving forward?"</action>
<action>Explore impact: "How would these blockers affect Epic {{next_number}} if left unresolved?"</action>
<action if="blockers exist">Document blockers and add to Critical Path with appropriate priority</action>

<action>Synthesize the readiness discussion into a clear picture of what must happen before Epic {{next_number}} can safely begin</action>
<action>Summarize any critical items identified and ensure user agrees with the assessment</action>

</step>

<step n="8" goal="Retrospective Closure">
<action>Scrum Master closes the retrospective with summary and next steps</action>

<action>Present closure summary:</action>

```
═══════════════════════════════════════════════════════════
✅ RETROSPECTIVE COMPLETE

Epic {{completed_number}}: {{epic_title}} - REVIEWED

Key Takeaways:
- {{key_lesson_1}}
- {{key_lesson_2}}
- {{key_lesson_3}}

Action Items Committed: {{action_count}}
Preparation Tasks Defined: {{prep_task_count}}
Critical Path Items: {{critical_count}}

═══════════════════════════════════════════════════════════
🎯 NEXT STEPS:

1. Execute Preparation Sprint (Est: {{prep_days}} days)
2. Complete Critical Path items before Epic {{next_number}}
3. Review action items in next standup
4. Begin Epic {{next_number}} planning when preparation complete

═══════════════════════════════════════════════════════════
Scrum Master: "Great work team! We learned a lot from Epic {{completed_number}}.
Let's use these insights to make Epic {{next_number}} even better.
See you at sprint planning once prep work is done!"
```

<action>Save retrospective summary to: {output_folder}/retrospectives/epic-{{completed_number}}-retro-{{date}}.md</action>

<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: complete_retrospective</param>
  <param>epic_id: {{completed_number}}</param>
</invoke-workflow>

<check if="{{result_success}} == true">
  <output>✅ Retrospective marked as completed in sprint-status.yaml

Retrospective key: {{result_retro_key}}
Status: {{result_old_status}} → {{result_new_status}}
</output>
</check>

<check if="{{result_success}} == false">
  <output>⚠️ Could not update retrospective status: {{result_error}}

Retrospective document was saved, but sprint-status.yaml may need manual update.
</output>
</check>

<action>Confirm all action items have been captured</action>
<action>Remind user to schedule prep sprint if needed</action>
<output>**✅ Retrospective Complete, {user_name}!**

**Epic Review:**

- Epic {{completed_number}}: {{epic_title}} reviewed
- Retrospective Status: {{result_new_status}}
- Retrospective saved: {output_folder}/retrospectives/epic-{{completed_number}}-retro-{{date}}.md
- Action Items: {{action_count}}
- Preparation Tasks: {{prep_task_count}}
- Critical Path Items: {{critical_count}}

**Next Steps:**

1. Review retrospective summary: {output_folder}/retrospectives/epic-{{completed_number}}-retro-{{date}}.md
2. Execute preparation sprint (Est: {{prep_days}} days)
3. Complete critical path items before Epic {{next_number}}
4. Begin Epic {{next_number}} planning when preparation complete
   - Load PM agent and run `epic-tech-context` for next epic
   - Or continue with existing contexted epics
     </output>
     </step>

</workflow>

<facilitation-guidelines>
<guideline>Scrum Master maintains psychological safety throughout - no blame or judgment</guideline>
<guideline>Focus on systems and processes, not individual performance</guideline>
<guideline>Encourage specific examples over general statements</guideline>
<guideline>Balance celebration of wins with honest assessment of challenges</guideline>
<guideline>Ensure every voice is heard - all agents contribute</guideline>
<guideline>Action items must be specific, achievable, and owned</guideline>
<guideline>Forward-looking mindset - how do we improve for next epic?</guideline>
<guideline>Two-part structure ensures both reflection AND preparation</guideline>
<guideline>Critical verification prevents starting next epic prematurely</guideline>
<guideline>Document everything - retrospective insights are valuable for future reference</guideline>
</facilitation-guidelines>
