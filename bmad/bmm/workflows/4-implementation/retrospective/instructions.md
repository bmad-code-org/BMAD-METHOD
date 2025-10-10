# Retrospective - Epic Completion Review Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/4-implementation/retrospective/workflow.yaml</critical>

<critical>
FACILITATION NOTES:
- Bob (Scrum Master) facilitates this retrospective
- Psychological safety is paramount - NO BLAME
- Focus on systems, processes, and learning
- Everyone contributes with specific examples preferred
- Action items must be achievable with clear ownership
- Two-part format: (1) Epic Review + (2) Next Epic Preparation
</critical>

<workflow>

<step n="1" goal="Epic Context Discovery">
<action>Identify the completed epic</action>

<ask>Which epic has just been completed? (Enter epic number, e.g., "003" or auto-detect from highest completed story)</ask>

<check>If auto-detecting:</check>
<action>Check {output_folder}/stories/ for highest numbered completed story</action>
<action>Extract epic number from story file (e.g., "Epic: 003" section)</action>

<action>Load the completed epic from: {output_folder}/prd/epic-{{epic_number}}.md</action>
<action>Extract epic details:</action>

- Epic title and goals
- Success criteria
- Planned stories and story points
- Estimated sprint duration
- Business objectives

<action>Find all stories for this epic in {output_folder}/stories/</action>
<action>For each story, extract:</action>

- Story number and title
- Completion status
- Story points (if tracked)
- Actual completion date
- Dev Agent Record notes
- TEA Results and testing outcomes
- PO Notes and acceptance
- Blockers encountered and resolution
- Technical debt incurred

<action>Calculate epic metrics:</action>

- Completed stories vs. total planned
- Actual story points delivered vs. planned
- Actual sprints taken vs. estimated
- Velocity (points per sprint)
- Blocker count and resolution time
- Technical debt items logged

<action>Review epic goals and compare actual outcomes vs. planned</action>
<action>Note any scope changes or descoped items</action>
<action>Document key architectural decisions made during epic</action>
<action>Identify technical debt incurred and why</action>
</step>

<step n="2" goal="Preview Next Epic">
<action>Identify the next epic in sequence</action>
<action>Load next epic from: {output_folder}/prd/epic-{{next_epic_number}}.md</action>

<action>Analyze next epic for:</action>

- Epic title and objectives
- Planned stories and complexity
- Dependencies on completed epic work
- New technical requirements or capabilities needed
- Potential risks or unknowns

<action>Identify dependencies on completed work:</action>

- What components from Epic {{completed_number}} does Epic {{next_number}} rely on?
- Are all prerequisites complete and stable?
- Any incomplete work that creates blocking dependencies?

<action>Note potential gaps or preparation needed:</action>

- Technical setup required (infrastructure, tools, libraries)
- Knowledge gaps to fill (research, training, spikes)
- Refactoring needed before starting next epic
- Documentation or specifications to create

<action>Check for technical prerequisites:</action>

- APIs or integrations that must be ready
- Data migrations or schema changes needed
- Testing infrastructure requirements
- Deployment or environment setup
  </step>

<step n="3" goal="Initialize Retrospective with Context">
<action>Bob (Scrum Master) opens the retrospective with context</action>
<action>Present formatted retrospective header:</action>

```
🔄 TEAM RETROSPECTIVE - Epic {{epic_number}}: {{epic_title}}

Bob (Scrum Master) facilitating

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

<action>Load agent configurations from: {project-root}/bmad/\_cfg/agent-party.xml</action>
<action>Identify agents who participated in the completed epic based on story records</action>
<action>Ensure key roles present: Sarah (PO), Bob (SM), James (Dev), Murat (TEA), Winston (Architect), Mary (Analyst)</action>
</step>

<step n="4" goal="Epic Review Discussion">
<action>Bob facilitates Part 1: Reviewing the completed epic</action>
<action>Each agent shares in their unique voice, referencing actual story data</action>
<action>Maintain psychological safety - focus on learning, not blame</action>

<action>For each participating agent, present structured feedback:</action>

**{{Agent Name}} ({{Role}})**:

**What Went Well:**

- Successes from completed stories (cite specific examples)
- Effective practices or processes that worked
- Velocity achievements or quality wins
- Collaboration highlights
- Technical successes or good decisions

**What Could Improve:**

- Challenges from story records (cite specifics)
- Blockers that slowed progress and why
- Process friction or inefficiencies
- Technical debt incurred and rationale
- Communication or coordination issues

**Lessons Learned:**

- Key insights for future epics
- Patterns to repeat or avoid
- Skills or knowledge gained
- Process improvements to implement

<action>Agent personality guidance:</action>

- **Sarah (PO)**: Business value delivery, stakeholder management, requirements clarity
- **Bob (SM)**: Process effectiveness, team dynamics, blocker removal, velocity trends
- **James (Dev)**: Technical execution, code quality, development experience, tooling
- **Murat (TEA)**: Quality outcomes, testing effectiveness, defect prevention, coverage
- **Winston (Architect)**: Architectural decisions, technical strategy, long-term sustainability
- **Mary (Analyst)**: Requirements accuracy, specification quality, edge case handling

<action>Encourage specific examples from story records, metrics, and real outcomes</action>
<action>Bob synthesizes common themes as discussion progresses</action>
</step>

<step n="5" goal="Next Epic Preparation Discussion">
<action>Bob facilitates Part 2: Preparing for the next epic</action>
<action>Each agent addresses preparation needs from their domain</action>

<action>For each agent, present forward-looking analysis:</action>

**{{Agent Name}} ({{Role}})**:

**Dependencies Check:**

- What from Epic {{completed_number}} is needed for Epic {{next_number}}?
- Any incomplete work that could block us?
- Integration points or handoffs to verify?

**Preparation Needs:**

- Technical setup required before starting
- Knowledge gaps to fill (research, training, spikes)
- Refactoring or cleanup needed
- Documentation or specifications to create
- Tools or infrastructure to provision

**Risk Assessment:**

- Potential issues based on Epic {{completed_number}} experience
- Unknowns or uncertainties in Epic {{next_number}}
- Mitigation strategies to consider
- Early warning signs to watch for

<action>Focus on actionable preparation items</action>
<action>Identify dependencies between preparation tasks</action>
<action>Note any quick wins that could de-risk the next epic</action>
</step>

<step n="6" goal="Synthesize Action Items">
<action>Bob identifies patterns across all agent feedback</action>
<action>Synthesizes common themes into team agreements</action>
<action>Creates specific, achievable action items with clear ownership</action>
<action>Develops preparation sprint tasks if significant setup needed</action>

<action>Present comprehensive action plan:</action>

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

<action>Ensure every action item has clear owner and timeline</action>
<action>Prioritize preparation tasks by dependencies and criticality</action>
<action>Identify which tasks can run in parallel vs. sequential</action>
</step>

<step n="7" goal="Critical User Verification">
<action>Bob leads final verification checks before concluding retrospective</action>
<action>User must confirm readiness before next epic begins</action>

<ask>Let's verify Epic {{completed_number}} is truly complete. Please confirm each item:</ask>

**Testing Verification:**
<ask>Has full regression testing been completed for Epic {{completed_number}}? (yes/no/partial)</ask>
<check>If no or partial:</check>
<action>Add to Critical Path: Complete regression testing before Epic {{next_number}}</action>

**Deployment Status:**
<ask>Has Epic {{completed_number}} been deployed to production? (yes/no/scheduled)</ask>
<check>If no:</check>
<action>Add to Critical Path: Deploy Epic {{completed_number}} - scheduled for {{date}}</action>

**Business Validation:**
<ask>Have stakeholders reviewed and accepted Epic {{completed_number}} deliverables? (yes/no/pending)</ask>
<check>If no or pending:</check>
<action>Add to Critical Path: Obtain stakeholder acceptance before Epic {{next_number}}</action>

**Technical Health:**
<ask>Is the codebase in a stable, maintainable state after Epic {{completed_number}}? (yes/no/concerns)</ask>
<check>If no or concerns:</check>
<action>Document concerns: {{user_input}}</action>
<action>Add to Preparation Sprint: Address stability concerns</action>

**Blocker Resolution:**
<ask>Are there any unresolved blockers from Epic {{completed_number}} that will impact Epic {{next_number}}? (yes/no)</ask>
<check>If yes:</check>
<action>Document blockers: {{user_input}}</action>
<action>Add to Critical Path with highest priority</action>

<action>Bob summarizes verification results and any critical items added</action>
</step>

<step n="8" goal="Retrospective Closure">
<action>Bob closes the retrospective with summary and next steps</action>

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
Bob: "Great work team! We learned a lot from Epic {{completed_number}}.
Let's use these insights to make Epic {{next_number}} even better.
See you at sprint planning once prep work is done!"
```

<action>Save retrospective summary to: {output_folder}/retrospectives/epic-{{completed_number}}-retro-{{date}}.md</action>
<action>Confirm all action items have been captured</action>
<action>Remind user to schedule prep sprint if needed</action>
</step>

</workflow>

<facilitation-guidelines>
<guideline>Bob maintains psychological safety throughout - no blame or judgment</guideline>
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
