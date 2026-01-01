---
name: 'step-04-journeys'
description: 'Map ALL user types that interact with the system with narrative story-based journeys'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-04-journeys.md'
nextStepFile: '{workflow_path}/steps/step-05-domain.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: User Journey Mapping

**Progress: Step 4 of 11** - Next: Domain Requirements

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on mapping ALL user types that interact with the system
- 🎯 CRITICAL: No journey = no functional requirements = product doesn't exist
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating journey content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper journey insights
- **P (Party Mode)**: Bring multiple perspectives to map comprehensive user journeys
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml
- When 'P' selected: Execute {project-root}/_bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Success criteria and scope already defined
- Input documents from step-01 are available (product briefs with user personas)
- Every human interaction with the system needs a journey

## YOUR TASK:

Create compelling narrative user journeys that leverage existing personas from product briefs and identify additional user types needed for comprehensive coverage.

## JOURNEY MAPPING SEQUENCE:

### 1. Leverage Existing Users & Identify Additional Types

**Check Input Documents for Existing Personas:**
Analyze product brief, research, and brainstorming documents for user personas already defined.

**If User Personas Exist in Input Documents:**
"I found some fantastic user personas in your product brief! Let me introduce them and see if we need to expand our cast of characters.

**From your brief:**
{{extracted_personas_from_brief_with_details}}

These are great starting points! Their stories already give us insight into what they need from {{project_name}}.

**Beyond your identified users, who else touches this system?**
Based on your product type and scope, we might need:

{{suggest_additional_user_types_based_on_project_context}}

What additional user types should we consider for this product?"

**If No Personas in Input Documents:**
Start with comprehensive user type discovery:
"Now that we know what success looks like, let's map out ALL the people who will interact with {{project_name}}.

**Beyond primary users, who else touches this system?**
Consider:

- End users (the primary focus)
- Admins - manage users, settings, content
- Moderators - review flagged content, enforce rules
- Support staff - help users, investigate issues
- API consumers - if dev tool or platform
- Internal ops - analytics, monitoring, billing

What user types should we map for this product?"

### 2. Create Narrative Story-Based Journeys

For each user type, create compelling narrative journeys that tell their story:

#### Narrative Journey Creation Process:

**If Using Existing Persona from Input Documents:**
"Let's tell {{persona_name}}'s story with {{project_name}}.

**Their Story So Far:**
{{persona_backstory_from_brief}}

**How {{project_name}} Changes Their Life:**
{{how_product_helps_them}}

Let's craft their journey narrative - where do we meet them in their story, and how does {{project_name}} help them write their next chapter?"

**If Creating New Persona:**
"Let's bring this user type to life with a compelling story.

**Creating Their Character:**

- **Name**: Give them a realistic name and personality
- **Situation**: What's happening in their life/work that creates the need?
- **Goal**: What do they desperately want to achieve?
- **Obstacle**: What's standing in their way right now?

**How {{project_name}} Becomes Their Solution:**
{{how_product_solves_their_story}}

Now let's map their journey narrative."

**Story-Based Journey Mapping:**

"Let's craft this as a story with our hero (the user) facing challenges and finding solutions through {{project_name}}:

**Story Structure:**

- **Opening Scene**: Where and how do we meet them? What's their current pain?
- **Rising Action**: What steps do they take? What do they discover?
- **Climax**: The critical moment where {{project_name}} delivers real value
- **Resolution**: How does their situation improve? What's their new reality?

**Use This Narrative Format such as this example:**

```markdown
**Journey 1: Maria Santos - Reclaiming Her Creative Time**
Maria is a freelance graphic designer who loves creating beautiful logos but spends hours every week managing client projects, sending invoices, and chasing payments. She feels like she's running a small business instead of doing what she loves. Late one night, while searching for invoicing tools, she discovers CreativeFlow and decides to give it a try.

The next morning, instead of her usual 30-minute project management routine, she spends 5 minutes setting up her first client in CreativeFlow. The system automatically generates a professional invoice and even suggests follow-up emails based on her communication patterns. When a client asks for a project update, Maria can share a beautiful progress link instead of digging through emails.

The breakthrough comes when she lands a major corporate client who's impressed by her "organized and professional" project setup. Six months later, Maria has doubled her client base and spends 80% of her time actually designing - exactly what she always wanted.
```

### 3. Guide Journey Exploration

For each journey, facilitate detailed exploration:

- "What happens at each step specifically?"
- "What could go wrong here? What's the recovery path?"
- "What information do they need to see/hear?"
- "What's their emotional state at each point?"
- "Where does this journey succeed or fail?"

### 4. Connect Journeys to Requirements

After each journey, explicitly state:
"This journey reveals requirements for:

- List specific capability areas (e.g., onboarding, meal planning, admin dashboard)
- Help user see how different journeys create different feature sets"

### 5. Aim for Comprehensive Coverage

Guide toward complete journey set:

- **Primary user** - happy path (core experience)
- **Primary user** - edge case (different goal, error recovery)
- **Secondary user** (admin, moderator, support, etc.)
- **API consumer** (if applicable)

Ask: "Another journey? We should cover [suggest uncovered user type]"

### 6. Generate User Journey Content

Prepare the content to append to the document:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## User Journeys

[All journey narratives based on conversation]

### Journey Requirements Summary

[Summary of capabilities revealed by journeys based on conversation]
```

### 7. Present Content and Menu

Show the generated journey content and present choices:
"I've mapped out the user journeys based on our conversation. Each journey reveals different capabilities needed for {{project_name}}.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper into these user journeys
[P] Party Mode - Bring different perspectives to ensure we have all journeys
[C] Continue - Save this and move to Domain Requirements (Step 5 of 11)"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml with the current journey content
- Process the enhanced journey insights that come back
- Ask user: "Accept these improvements to the user journeys? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/_bmad/core/workflows/party-mode/workflow.md with the current journeys
- Process the collaborative journey improvements and additions
- Ask user: "Accept these changes to the user journeys? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: add this step name to the end of the steps completed array
- Load `{project-root}/_bmad/bmm/workflows/2-plan-workflows/prd/steps/step-05-domain.md` (or determine if step is optional based on domain complexity)

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Existing personas from product briefs leveraged when available
✅ All user types identified (not just primary users)
✅ Rich narrative storytelling for each persona and journey
✅ Complete story-based journey mapping with emotional arc
✅ Journey requirements clearly connected to capabilities needed
✅ Minimum 3-4 compelling narrative journeys covering different user types
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Ignoring existing personas from product briefs
❌ Only mapping primary user journeys and missing secondary users
❌ Creating generic journeys without rich persona details and narrative
❌ Missing emotional storytelling elements that make journeys compelling
❌ Missing critical decision points and failure scenarios
❌ Not connecting journeys to required capabilities
❌ Not having enough journey diversity (admin, support, API, etc.)
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## JOURNEY TYPES TO ENSURE:

**Minimum Coverage:**

1. **Primary User - Success Path**: Core experience journey
2. **Primary User - Edge Case**: Error recovery, alternative goals
3. **Admin/Operations User**: Management, configuration, monitoring
4. **Support/Troubleshooting**: Help, investigation, issue resolution
5. **API/Integration** (if applicable): Developer/technical user journey

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-05-domain.md`.

Remember: Do NOT proceed to step-05 until user explicitly selects 'C' from the A/P/C menu and content is saved!
