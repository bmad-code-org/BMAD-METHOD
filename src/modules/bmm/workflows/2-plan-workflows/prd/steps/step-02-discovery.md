# Step 2: Project & Domain Discovery

**Progress: Step 2 of 10** - Next: Success Criteria Definition

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on project classification and vision alignment only
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
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from step 1 are available
- Input documents already loaded are in memory (product briefs, research, brainstorming, project docs)
- Classification CSV data will be loaded in this step only
- This will be the first content section appended to the document
- LEVERAGE existing input documents to accelerate discovery process
- installed_path = `{project-root}/{bmad_folder}/bmm/workflows/2-plan-workflows/prd`

## YOUR TASK:

Conduct comprehensive project discovery that leverages existing input documents while allowing user refinement, with data-driven classification and generate the first content section.

## DISCOVERY SEQUENCE:

### 1. Load Classification Data

Load and prepare CSV data for intelligent classification:

- Load `{installed_path}/project-types.csv` completely
- Load `{installed_path/domain-complexity.csv` completely
- Parse column structures and store in memory for this step only

### 2. Leverage Input Documents for Head Start

Analyze available input documents to provide informed discovery:

**Check Input Documents Available:**

- Product Briefs: {{number_of_briefs}} documents loaded
- Research Documents: {{number_of_research}} documents loaded
- Brainstorming Results: {{number_of_brainstorming}} documents loaded
- Project Documentation: {{number_of_project_docs}} documents loaded

**If Input Documents Exist:**
"As your PM peer, I've reviewed your existing project documentation and have a great starting point for our discovery. Let me share what I understand and you can refine or correct as needed.

**Based on your product brief and research:**

**What you're building:**
{{extracted_vision_from_brief}}

**Problem it solves:**
{{extracted_problem_from_brief}}

**Target users:**
{{extracted_users_from_brief}}

**What makes it special:**
{{extracted_differentiator_from_brief}}

**How does this align with your vision?** Should we refine any of these points or are there important aspects I'm missing?"

**If No Input Documents:**
"As your PM peer, I'm excited to help you shape {{project_name}}. Let me start by understanding what you want to build.

**Tell me about what you want to create:**

- What problem does it solve?
- Who are you building this for?
- What excites you most about this product?

I'll be listening for signals to help us classify the project and domain so we can ask the right questions throughout our process."

### 3. Listen for Classification Signals

As the user describes their product, listen for and match against:

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

### 4. Enhanced Classification with Document Context

Leverage both user input and document analysis for classification:

**If Input Documents Exist:**
"Based on your product brief and our discussion, I'm classifying this as:

- **Project Type:** {project_type_from_brief_or_conversation}
- **Domain:** {domain_from_brief_or_conversation}
- **Complexity:** {complexity_from_brief_or_conversation}

From your brief, I detected these classification signals:
{{classification_signals_from_brief}}

Combined with our conversation, this suggests the above classification. Does this sound right?"

**If No Input Documents:**
Present your classifications for user validation:
"Based on our conversation, I'm hearing this as:

- **Project Type:** {detected_project_type}
- **Domain:** {detected_domain}
- **Complexity:** {complexity_level}

Does this sound right to you? I want to make sure we're on the same page before diving deeper."

### 5. Identify What Makes It Special

Leverage input documents for initial understanding, then refine:

**If Input Documents Exist:**
"From your product brief, I understand that what makes this special is:
{{extracted_differentiator_from_brief}}

Let's explore this deeper:

- **Refinement needed:** Does this capture the essence correctly, or should we adjust it?
- **Missing aspects:** Are there other differentiators that aren't captured in your brief?
- **Evolution:** How has your thinking on this evolved since you wrote the brief?"

**If No Input Documents:**
Ask focused questions to capture the product's unique value:

- "What would make users say 'this is exactly what I needed'?"
- "What's the moment where users realize this is different/better?"
- "What assumption about [problem space] are you challenging?"
- "If this succeeds wildly, what changed for your users?"

### 6. Generate Executive Summary Content

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

{project_classification_content}
```

### 7. Present Content and Menu

Show the generated content to the user and present:
"I've drafted our Executive Summary based on our conversation. This will be the first section of your PRD.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper and refine this content
[P] Party Mode - Bring in different perspectives to improve this
[C] Continue - Save this and move to Success Criteria Definition (Step 3 of 10)"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml with the current content
- Process the enhanced content that comes back
- Ask user: "Accept these changes to the Executive Summary? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md with the current content
- Process the collaborative improvements that come back
- Ask user: "Accept these changes to the Executive Summary? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `./step-03-success.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Classification data loaded and used effectively
✅ Input documents analyzed and leveraged for head start
✅ User classifications validated and confirmed
✅ Product differentiator clearly identified and refined
✅ Executive summary content generated collaboratively with document context
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Skipping classification data loading and guessing classifications
❌ Not leveraging existing input documents to accelerate discovery
❌ Not validating classifications with user before proceeding
❌ Generating executive summary without real user input
❌ Missing the "what makes it special" discovery and refinement
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## COMPLEXITY HANDLING:

If `complexity_level = "high"`:

- Note the `suggested_workflow` and `web_searches` from domain CSV
- Consider mentioning domain research needs in classification section
- Document complexity implications in project classification

## NEXT STEP:

After user selects 'C' and content is saved to document, load `installed_path/steps/step-03-success.md` to define success criteria.

Remember: Do NOT proceed to step-03 until user explicitly selects 'C' from the A/P/C menu and content is saved!
