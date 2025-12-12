---
name: 'step-08-scoping'
description: 'Define MVP boundaries and prioritize features across development phases'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-08-scoping.md'
nextStepFile: '{workflow_path}/steps/step-09-functional.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Scoping Exercise - MVP & Future Features

**Progress: Step 8 of 11** - Next: Functional Requirements

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on strategic scope decisions that keep projects viable
- 🎯 EMPHASIZE lean MVP thinking while preserving long-term vision

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 📚 Review the complete PRD document built so far
- ⚠️ Present A/P/C menu after generating scoping decisions
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to explore innovative scoping approaches
- **P (Party Mode)**: Bring multiple perspectives to ensure comprehensive scope decisions
- **C (Continue)**: Save the scoping decisions and proceed to functional requirements

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Complete PRD document built so far is available for review
- User journeys, success criteria, and domain requirements are documented
- Focus on strategic scope decisions, not feature details
- Balance between user value and implementation feasibility

## YOUR TASK:

Conduct comprehensive scoping exercise to define MVP boundaries and prioritize features across development phases.

## SCOPING SEQUENCE:

### 1. Review Current PRD State

Analyze everything documented so far:
"I've reviewed your complete PRD so far. Here's what we've established:

**Product Vision & Success:**
{{summary_of_vision_and_success_criteria}}

**User Journeys:** {{number_of_journeys}} mapped with rich narratives

**Domain & Innovation Focus:**
{{summary_of_domain_requirements_and_innovation}}

**Current Scope Implications:**
Based on everything we've documented, this looks like it could be:

- [ ] Simple MVP (small team, lean scope)
- [ ] Medium scope (moderate team, balanced features)
- [ ] Complex project (large team, comprehensive scope)

Does this initial assessment feel right, or do you see this differently?"

### 2. Define MVP Strategy

Facilitate strategic MVP decisions:

"Let's think strategically about your launch strategy:

**MVP Philosophy Options:**

1. **Problem-Solving MVP**: Solve the core problem with minimal features
2. **Experience MVP**: Deliver the key user experience with basic functionality
3. **Platform MVP**: Build the foundation for future expansion
4. **Revenue MVP**: Generate early revenue with essential features

**Critical Questions:**

- What's the minimum that would make users say 'this is useful'?
- What would make investors/partners say 'this has potential'?
- What's the fastest path to validated learning?

**Which MVP approach feels right for {{project_name}}?**"

### 3. Scoping Decision Framework

Use structured decision-making for scope:

**Must-Have Analysis:**
"Let's identify absolute MVP necessities. For each journey and success criterion, ask:

- **Without this, does the product fail?** (Y/N)
- **Can this be manual initially?** (Y/N)
- **Is this a deal-breaker for early adopters?** (Y/N)

**Current Document Review:**
Looking at your user journeys, what are the absolute core experiences that must work?

{{analyze_journeys_for_mvp_essentials}}"

**Nice-to-Have Analysis:**
"Let's also identify what could be added later:

**Post-MVP Enhancements:**

- Features that enhance but aren't essential
- User types that can be added later
- Advanced functionality that builds on MVP

**What features could we add in versions 2, 3, etc.?**"

### 4. Progressive Feature Roadmap

Create phased development approach:

"Let's map your features across development phases:

**Phase 1: MVP**

- Core user value delivery
- Essential user journeys
- Basic functionality that works reliably

**Phase 2: Growth**

- Additional user types
- Enhanced features
- Scale improvements

**Phase 3: Expansion**

- Advanced capabilities
- Platform features
- New markets or use cases

**Where does your current vision fit in this development sequence?**"

### 5. Risk-Based Scoping

Identify and mitigate scoping risks:

**Technical Risks:**
"Looking at your innovation and domain requirements:

- What's the most technically challenging aspect?
- Could we simplify the initial implementation?
- What's the riskiest assumption about technology feasibility?"

**Market Risks:**

- What's the biggest market risk?
- How does the MVP address this?
- What learning do we need to de-risk this?"

**Resource Risks:**

- What if we have fewer resources than planned?
- What's the absolute minimum team size needed?
- Can we launch with a smaller feature set?"

### 6. Generate Scoping Content

Prepare comprehensive scoping section:

#### Content Structure:

```markdown
## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** {{chosen_mvp_approach}}
**Resource Requirements:** {{mvp_team_size_and_skills}}

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
{{essential_journeys_for_mvp}}

**Must-Have Capabilities:**
{{list_of_essential_mvp_features}}

### Post-MVP Features

**Phase 2 (Post-MVP):**
{{planned_growth_features}}

**Phase 3 (Expansion):**
{{planned_expansion_features}}

### Risk Mitigation Strategy

**Technical Risks:** {{mitigation_approach}}
**Market Risks:** {{validation_approach}}
**Resource Risks:** {{contingency_approach}}
```

### 7. Present Content and Menu

Show the scoping decisions and present choices:

"I've analyzed your complete PRD and created a strategic scoping plan for {{project_name}}.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Explore alternative scoping strategies
[P] Party Mode - Bring different perspectives on MVP and roadmap decisions
[C] Continue - Save scoping decisions and move to Functional Requirements (Step 9 of 11)"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml with current scoping analysis
- Process enhanced scoping insights that come back
- Ask user: "Accept these improvements to the scoping decisions? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md with scoping context
- Process collaborative insights on MVP and roadmap decisions
- Ask user: "Accept these changes to the scoping decisions? (y/n)"
- If yes: Update content, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Load `./step-09-functional.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Complete PRD document analyzed for scope implications
✅ Strategic MVP approach defined and justified
✅ Clear MVP feature boundaries established
✅ Phased development roadmap created
✅ Key risks identified and mitigation strategies defined
✅ User explicitly agrees to scope decisions
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Not analyzing the complete PRD before making scoping decisions
❌ Making scope decisions without strategic rationale
❌ Not getting explicit user agreement on MVP boundaries
❌ Missing critical risk analysis
❌ Not creating clear phased development approach
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-09-functional.md`.

Remember: Do NOT proceed to step-09 until user explicitly selects 'C' from the A/P/C menu and content is saved!
