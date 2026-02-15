---
name: 'step-02-stakeholder-identification'
description: 'Identify and analyze all stakeholders and their relationships to the system'

# File References
nextStepFile: './step-03-business-context.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Stakeholder Identification & Analysis

**Progress: Step 2 of 8** - Next: Business Context

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between expert peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on identifying ALL stakeholders who have interest in or are affected by the system
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating stakeholder content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Product Brief content is the primary source for stakeholder discovery
- All loaded input documents should inform stakeholder identification
- Focus on WHO has stakes in this system, not WHAT the system does
- ISO 29148 requires clear stakeholder categorization

## STAKEHOLDER IDENTIFICATION SEQUENCE:

### 1. Explain Stakeholder Identification Purpose

Start by explaining why stakeholder identification matters:

**Purpose:**
ISO 29148 requires formal identification of all parties who have interest in, are affected by, or can influence the system. This ensures no stakeholder group is overlooked and their needs are captured.

**Stakeholder Categories to Explore:**
- **Users** - People who will directly interact with the system
- **Acquirers/Customers** - People who purchase or commission the system
- **Operators** - People who maintain or administer the system
- **Regulators** - Bodies that govern or regulate the domain
- **Sponsors** - People funding or authorizing the project
- **Developers/Maintainers** - People who build and maintain the system
- **Support Staff** - People providing user support
- **Affected Parties** - People indirectly affected (competitors, displaced workers, etc.)

### 2. Extract Stakeholders from Product Brief

Systematically review the Product Brief to identify stakeholders:

**Extract From:**
- Target audience / user definitions → Primary users
- Business model → Customers, partners, revenue stakeholders
- Market context → Competitors, regulators
- Technical context → Development team, operations team
- Success criteria → Who benefits from success?

### 3. Collaborative Stakeholder Discovery

Engage the user to validate and expand the stakeholder list:

**Key Questions:**
- "Who will use this system daily? Are there different user types?"
- "Who is paying for this? Who decides if the project continues?"
- "Are there regulatory bodies or compliance requirements?"
- "Who will maintain the system after launch?"
- "Who might be negatively impacted by this system?"
- "Are there external partners or integrations involving other organizations?"

### 4. Create Stakeholder Profiles

For each identified stakeholder, capture:

**Stakeholder Profile Format:**
- **Name/Role**: Clear identifier
- **Category**: User / Acquirer / Operator / Regulator / Sponsor / Other
- **Interest Level**: High / Medium / Low
- **Influence Level**: High / Medium / Low
- **Key Concerns**: What matters most to this stakeholder
- **Success Criteria**: How this stakeholder measures success
- **Needs vs. Wants**: Distinguish essential needs from desirable features

### 5. Analyze Stakeholder Relationships

Map relationships and potential conflicts:

**Analysis Points:**
- Which stakeholders have conflicting needs?
- Which stakeholders have the most influence on requirements?
- Which stakeholders are most affected by system success/failure?
- What is the priority order when stakeholder needs conflict?

### 6. Generate Stakeholder Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## 1. Introduction

### 1.1 Business Purpose

[Business purpose derived from Product Brief - why this system is being built]

### 1.2 Business Scope

[Scope of the business domain this system addresses]

### 1.3 Business Overview

[High-level overview of the business context]

### 1.4 Definitions and Acronyms

[Key terms and acronyms used in this document - start list, will grow through workflow]

### 1.5 Stakeholder Identification

| Stakeholder | Category | Interest | Influence | Key Concerns |
|-------------|----------|----------|-----------|-------------- |
| [Name/Role] | [Category] | [H/M/L] | [H/M/L] | [Primary concerns] |

### 1.6 Stakeholder Profiles

#### [Stakeholder Name/Role]

- **Category:** [User / Acquirer / Operator / Regulator / Sponsor / Other]
- **Interest Level:** [High / Medium / Low]
- **Influence Level:** [High / Medium / Low]
- **Key Concerns:** [What matters most]
- **Success Criteria:** [How they measure success]
- **Needs:** [Essential requirements]
- **Wants:** [Desirable but not essential]

[Repeat for each stakeholder]

### 1.7 Stakeholder Relationship Analysis

[Relationship mapping, conflict areas, priority ordering]
```

### 7. Present MENU OPTIONS

Present the stakeholder identification and analysis for review, then display menu:
- Show identified stakeholders with profiles
- Highlight any potential conflicts between stakeholder needs
- Ask if any stakeholders are missing or profiles need adjustment
- Present menu options naturally as part of conversation

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Business Context (Step 3 of 8)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask} with the current stakeholder analysis, process enhanced insights, ask user acceptance, if yes update then redisplay, if no keep original then redisplay
- IF P: Read fully and follow: {partyModeWorkflow} with stakeholder analysis, process collaborative validation, ask user acceptance, if yes update then redisplay, if no keep original then redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ All stakeholder categories explored systematically
✅ Product Brief content used as primary source
✅ Each stakeholder has clear profile with needs vs. wants
✅ Stakeholder relationships and conflicts identified
✅ Priority ordering established for conflicting needs
✅ ISO 29148 Clause 7 Section 1 requirements addressed
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Missing key stakeholder categories (especially regulators, operators)
❌ Not distinguishing needs from wants
❌ Not identifying stakeholder conflicts
❌ Generating stakeholder list without user input
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file
❌ **CRITICAL**: Proceeding with 'C' without fully reading next step file

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define business context.
