---
name: 'step-02-discovery'
description: 'Conduct project and domain discovery with data-driven classification'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-02-discovery.md'
nextStepFile: '{workflow_path}/steps/step-03-success.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/prd.md'

# Data Files
projectTypesCSV: '{workflow_path}/project-types.csv'
domainComplexityCSV: '{workflow_path}/domain-complexity.csv'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Project & Domain Discovery

**Progress: Step 2 of 11** - Next: Success Criteria Definition

## STEP GOAL:

Conduct comprehensive project discovery that leverages existing input documents while allowing user refinement, with data-driven classification, and generate the Executive Summary content.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a product-focused PM facilitator collaborating with an expert peer
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring structured thinking and facilitation skills, while the user brings domain expertise and product vision

### Step-Specific Rules:

- 🎯 Focus on project classification and vision alignment only
- 🚫 FORBIDDEN to generate content without real user input
- 💬 APPROACH: Adapt questions based on document context (brownfield vs greenfield)
- 🎯 LOAD classification data BEFORE starting discovery conversation

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating executive summary content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper insights about the generated content
- **P (Party Mode)**: Bring multiple perspectives to discuss and improve the generated content
- **C (Continue)**: Append and save the content to the `{outputFile}` and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {advancedElicitationTask}
- When 'P' selected: Execute {partyModeWorkflow}
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from step 1 are available
- Input documents already loaded are in memory (product briefs, research, brainstorming, project docs)
- **Document counts available in frontmatter `documentCounts`**
- Classification CSV data will be loaded in this step only
- This will be the first content section appended to the document

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Read Document State from Frontmatter

**CRITICAL FIRST ACTION:** Read the frontmatter from `{outputFile}` to get document counts.

```
Read documentCounts from prd.md frontmatter:
- briefCount = documentCounts.briefs
- researchCount = documentCounts.research
- brainstormingCount = documentCounts.brainstorming
- projectDocsCount = documentCounts.projectDocs
```

**ANNOUNCE your understanding:**

"From step 1, I have loaded:

- Product briefs: {{briefCount}} files
- Research: {{researchCount}} files
- Brainstorming: {{brainstormingCount}} files
- Project docs: {{projectDocsCount}} files

{if projectDocsCount > 0}This is a **brownfield project** - I'll focus on understanding what you want to add or change.{else}This is a **greenfield project** - I'll help you define the full product vision.{/if}"

### 2. Load Classification Data

Load and prepare CSV data for intelligent classification:

- Load `{projectTypesCSV}` completely
- Load `{domainComplexityCSV}` completely
- Parse column structures and store in memory for this step only

### 3. Begin Discovery Conversation

**SELECT EXACTLY ONE DISCOVERY PATH based on document state:**

---

#### PATH A: Has Product Brief (briefCount > 0)

**Use this path when:** `briefCount > 0`

"As your PM peer, I've reviewed your product brief and have a great starting point for our discovery. Let me share what I understand and you can refine or correct as needed.

**Based on your product brief:**

**What you're building:**
{{extracted_vision_from_brief}}

**Problem it solves:**
{{extracted_problem_from_brief}}

**Target users:**
{{extracted_users_from_brief}}

**What makes it special:**
{{extracted_differentiator_from_brief}}

{if projectDocsCount > 0}I also see you have existing project documentation. This PRD will define how new features integrate with your existing system architecture.{/if}

**How does this align with your vision?** Should we refine any of these points or are there important aspects I'm missing?"

**AFTER this message, SKIP to Section 4.**

---

#### PATH B: No Brief but Has Project Docs - Brownfield (briefCount == 0 AND projectDocsCount > 0)

**Use this path when:** `briefCount == 0 AND projectDocsCount > 0`

**NOTE:** Extract the following from loaded project documentation (index.md, architecture.md, project-overview.md, etc.):

"As your PM peer, I've reviewed your existing project documentation from document-project.

**Your existing system includes:**

- **Tech Stack:** {analyze index.md and architecture.md for technologies used}
- **Architecture:** {summarize architecture patterns from architecture.md}
- **Key Components:** {list main components from source-tree-analysis.md or project-overview.md}

This PRD will define **new features or changes** to add to this existing codebase.

**Tell me about what you want to add or change:**

- What new capability or feature do you want to build?
- What problem will this solve for your users?
- How should it integrate with the existing system?
- Is this adding new functionality, improving existing features, or fixing issues?

I'll help you create a PRD focused on these additions while respecting your existing patterns and architecture."

**AFTER this message, SKIP to Section 4.**

---

#### PATH C: No Documents - Greenfield (briefCount == 0 AND projectDocsCount == 0)

**Use this path when:** `briefCount == 0 AND projectDocsCount == 0`

"As your PM peer, I'm excited to help you shape {{project_name}}. Let me start by understanding what you want to build.

**Tell me about what you want to create:**

- What problem does it solve?
- Who are you building this for?
- What excites you most about this product?

I'll be listening for signals to help us classify the project and domain so we can ask the right questions throughout our process."

**AFTER this message, continue to Section 4.**

---

### 4. Listen for Classification Signals

As the user describes their product/feature, listen for and match against:

#### Project Type Signals

Compare user description against `detection_signals` from `project-types.csv`:

- Look for keyword matches from semicolon-separated signals
- Examples: "API,REST,GraphQL" → api_backend
- Examples: "iOS,Android,app,mobile" → mobile_app
- Store the best matching `project_type`

#### Domain Signals

Compare user description against `signals` from `domain-complexity.csv`:

- Look for domain keyword matches
- Examples: "medical,diagnostic,clinical" → healthcare
- Examples: "payment,banking,trading" → fintech
- Store the matched `domain` and `complexity_level`

### 5. Present Classification for Validation

**SELECT EXACTLY ONE CLASSIFICATION PRESENTATION based on document state:**

---

#### IF PATH A was used (briefCount > 0):

"Based on your product brief and our discussion, I'm classifying this as:

- **Project Type:** {project_type_from_brief_or_conversation}
- **Domain:** {domain_from_brief_or_conversation}
- **Complexity:** {complexity_from_brief_or_conversation}

From your brief, I detected these classification signals:
{{classification_signals_from_brief}}

{if projectDocsCount > 0}Your existing project documentation also indicates:

- **Existing Tech Stack:** {from architecture.md or index.md}
- **Architecture Pattern:** {from architecture.md}

I'll ensure the new features align with your existing system.{/if}

Combined with our conversation, this suggests the above classification. Does this sound right?"

---

#### IF PATH B was used (briefCount == 0 AND projectDocsCount > 0):

"Based on your existing project documentation and our discussion about new features:

- **Existing Project Type:** {detected from project docs - e.g., web_app, api_backend}
- **Tech Stack:** {from architecture.md or index.md}
- **New Feature Type:** {from user's description of what they want to add}
- **Domain:** {detected_domain}
- **Complexity:** {complexity_level}

I'll ensure the PRD aligns with your existing architecture patterns. Does this classification sound right?"

---

#### IF PATH C was used (briefCount == 0 AND projectDocsCount == 0):

"Based on our conversation, I'm hearing this as:

- **Project Type:** {detected_project_type}
- **Domain:** {detected_domain}
- **Complexity:** {complexity_level}

Does this sound right to you? I want to make sure we're on the same page before diving deeper."

---

### 6. Identify What Makes It Special

**SELECT EXACTLY ONE DIFFERENTIATOR DISCOVERY based on document state:**

---

#### IF PATH A was used (briefCount > 0):

"From your product brief, I understand that what makes this special is:
{{extracted_differentiator_from_brief}}

Let's explore this deeper:

- **Refinement needed:** Does this capture the essence correctly, or should we adjust it?
- **Missing aspects:** Are there other differentiators that aren't captured in your brief?
- **Evolution:** How has your thinking on this evolved since you wrote the brief?"

---

#### IF PATH B was used (briefCount == 0 AND projectDocsCount > 0):

"Your existing system already provides certain capabilities. Now let's define what makes these **new additions** special:

- What gap in your current system will this fill?
- How will this improve the experience for your existing users?
- What's the key insight that led you to prioritize this addition?
- What would make users say 'finally, this is what we needed'?"

---

#### IF PATH C was used (briefCount == 0 AND projectDocsCount == 0):

Ask focused questions to capture the product's unique value:

- "What would make users say 'this is exactly what I needed'?"
- "What's the moment where users realize this is different/better?"
- "What assumption about [problem space] are you challenging?"
- "If this succeeds wildly, what changed for your users?"

---

### 7. Generate Executive Summary Content

Based on the conversation, prepare the content to append to the document:

#### Content Structure:

```markdown
## Executive Summary

{vision_alignment_content}

### What Makes This Special

{product_differentiator_content}

## Project Classification

**Technical Type:** {project_type}
**Domain:** {domain}
**Complexity:** {complexity_level}
{if projectDocsCount > 0}**Project Context:** Brownfield - extending existing system{else}**Project Context:** Greenfield - new project{/if}

{project_classification_content}
```

### 8. Present Content and Menu

Show the generated content to the user and present:

"I've drafted our Executive Summary based on our conversation. This will be the first section of your PRD.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 7]

**Select an Option:**
[A] Advanced Elicitation - Let's dive deeper and refine this content
[P] Party Mode - Bring in different perspectives to improve this
[C] Continue - Save this and move to Success Criteria Definition (Step 3 of 11)"

### 9. Handle Menu Selection

#### IF A (Advanced Elicitation):

- Execute {advancedElicitationTask} with the current content
- Process the enhanced content that comes back
- Ask user: "Accept these changes to the Executive Summary? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### IF P (Party Mode):

- Execute {partyModeWorkflow} with the current content
- Process the collaborative improvements that come back
- Ask user: "Accept these changes to the Executive Summary? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### IF C (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: add this step name to the end of the steps completed array
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [executive summary content finalized and saved to document with frontmatter updated], will you then load and read fully `{nextStepFile}` to execute and begin success criteria definition.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Document counts read from frontmatter and announced
- Classification data loaded and used effectively
- **Correct discovery path selected based on document counts**
- Input documents analyzed and leveraged for head start
- User classifications validated and confirmed
- Product differentiator clearly identified and refined
- Executive summary content generated collaboratively with document context
- A/P/C menu presented and handled correctly
- Content properly appended to document when C selected
- Frontmatter updated with stepsCompleted: [1, 2]

### ❌ SYSTEM FAILURE:

- **Not reading documentCounts from frontmatter first**
- **Executing multiple discovery paths instead of exactly one**
- Skipping classification data loading and guessing classifications
- Not leveraging existing input documents to accelerate discovery
- Not validating classifications with user before proceeding
- Generating executive summary without real user input
- Missing the "what makes it special" discovery and refinement
- Not presenting A/P/C menu after content generation
- Appending content without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## COMPLEXITY HANDLING:

If `complexity_level = "high"`:

- Note the `suggested_workflow` and `web_searches` from domain CSV
- Consider mentioning domain research needs in classification section
- Document complexity implications in project classification
