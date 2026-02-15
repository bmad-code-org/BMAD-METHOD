---
name: 'step-05-user-requirements'
description: 'Define user requirements including user identification, profiles, and personnel requirements'

# File References
nextStepFile: './step-06-operational-concept.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: User Requirements

**Progress: Step 5 of 8** - Next: Operational Concept & Scenarios

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between expert peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on who the users are and what they specifically need from the system
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating user requirements
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Stakeholder profiles from Step 2 are the foundation (especially User-category stakeholders)
- Product Brief user definitions should inform user profiles
- Focus on USER needs at a stakeholder level, not system features
- ISO 29148 Clause 7 Section 5: User Requirements

## USER REQUIREMENTS SEQUENCE:

### 1. Explain User Requirements Purpose

**Purpose:**
User requirements capture WHO will use the system and WHAT they need at a human level. These are distinct from functional requirements (which define system capabilities) - user requirements focus on the human side: skills, training, environment, and interaction expectations.

**Sections to Cover:**
- User Identification (types and categories of users)
- User Profiles (characteristics, skills, environment)
- Personnel Requirements (staffing, training, support)

### 2. User Identification

Identify all user types from stakeholder analysis and Product Brief:

**Key Questions:**
- "What distinct types of users will interact with the system?"
- "How do these user types differ in their goals and capabilities?"
- "Are there user types who interact only occasionally vs. daily?"
- "Are there administrative or support user types?"
- "Are there automated system users (APIs, integrations)?"

### 3. User Profile Development

For each user type, build a detailed profile:

**Profile Elements:**
- **User Type Name**: Clear, descriptive identifier
- **Description**: Who this user is and their role
- **Technical Proficiency**: Low / Medium / High
- **Domain Expertise**: Novice / Intermediate / Expert
- **Usage Frequency**: Daily / Weekly / Monthly / Occasional
- **Usage Environment**: Office / Mobile / Remote / Field / Varied
- **Accessibility Needs**: Any specific accessibility requirements
- **Key Goals**: Top 3-5 things this user wants to accomplish
- **Frustrations**: Current pain points with existing solutions
- **Constraints**: Limitations on how this user can interact

**Key Questions per User Type:**
- "What is a day in the life of this user?"
- "What tools do they currently use?"
- "What are their biggest frustrations with current approaches?"
- "How tech-savvy is this user type?"
- "What would make them consider the system a success?"

### 4. Personnel Requirements

Define staffing and training needs:

**Key Questions:**
- "Will users need training to use the system?"
- "What level of training is acceptable (self-service, tutorial, formal)?"
- "Are there specialized roles needed to operate the system?"
- "What support model is expected (self-service, help desk, on-call)?"
- "Are there regulatory requirements for user certification?"

### 5. User Interaction Requirements

Capture high-level interaction expectations:

**Key Questions:**
- "What devices will users primarily use?"
- "What are the connectivity expectations (always online, offline capable)?"
- "What languages must the system support?"
- "Are there cultural or regional considerations?"
- "What is the expected learning curve?"

### 6. Generate User Requirements Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## 5. User Requirements

### 5.1 User Identification

| User Type | Description | Usage Frequency | Technical Proficiency |
|-----------|-------------|----------------|----------------------|
| [Type name] | [Brief description] | [Daily/Weekly/etc.] | [Low/Medium/High] |

### 5.2 User Profiles

#### UP-001: [User Type Name]

- **Description:** [Who this user is]
- **Technical Proficiency:** [Low / Medium / High]
- **Domain Expertise:** [Novice / Intermediate / Expert]
- **Usage Frequency:** [Daily / Weekly / Monthly / Occasional]
- **Usage Environment:** [Office / Mobile / Remote / Field]
- **Accessibility Needs:** [Specific requirements or "Standard"]
- **Key Goals:**
  1. [Primary goal]
  2. [Secondary goal]
  3. [Tertiary goal]
- **Current Frustrations:** [Pain points with existing solutions]
- **Constraints:** [Limitations on interaction]

[Repeat for each user type]

### 5.3 Personnel Requirements

#### Training Requirements

[Training model, certification needs, learning curve expectations]

#### Support Model

[Support structure, escalation paths, response time expectations]

#### Staffing

[Specialized roles needed, team structure implications]

### 5.4 User Interaction Requirements

[Device expectations, connectivity, languages, cultural considerations]
```

### 7. Present MENU OPTIONS

Present the user requirements for review, then display menu:
- Show user profiles and requirements
- Highlight connections to stakeholder analysis from Step 2
- Ask if any user types are missing or profiles need adjustment

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Operational Concept (Step 6 of 8)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process enhanced insights, ask user acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process collaborative validation, ask user acceptance, update or keep, redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ All user types identified and categorized
✅ Each user type has a detailed profile
✅ Profiles include goals, frustrations, constraints, and proficiency levels
✅ Personnel requirements (training, support, staffing) documented
✅ User interaction requirements captured
✅ Profiles connected to stakeholder analysis from Step 2
✅ ISO 29148 Clause 7 Section 5 requirements addressed

## FAILURE MODES:

❌ Missing user types (especially admin, support, API users)
❌ Generic profiles without specific goals and frustrations
❌ Not connecting to stakeholder profiles from Step 2
❌ Skipping personnel requirements
❌ Not capturing accessibility needs

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define operational concept and scenarios.
