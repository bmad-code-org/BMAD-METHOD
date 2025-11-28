# Step 2: Project & Domain Discovery

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
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
- When 'P' selected: Execute {project-root}/{bmad_folder}/core/workflows/party-mode
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from step 1 are available
- Input documents already loaded are in memory
- Classification CSV data will be loaded in this step only
- This will be the first content section appended to the document

## YOUR TASK:

Conduct comprehensive project discovery with data-driven classification and generate the first content section.

## DISCOVERY SEQUENCE:

### 1. Load Classification Data

Load and prepare CSV data for intelligent classification:

- Load `./project-types.csv` completely
- Load `./domain-complexity.csv` completely
- Parse column structures and store in memory for this step only

### 2. Begin Natural Discovery Conversation

Start with open-ended discovery:
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

### 4. Validate Classifications

Present your classifications for user validation:
"Based on our conversation, I'm hearing this as:

- **Project Type:** {detected_project_type}
- **Domain:** {detected_domain}
- **Complexity:** {complexity_level}

Does this sound right to you? I want to make sure we're on the same page before diving deeper."

### 5. Identify What Makes It Special

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
[C] Continue - Save this to the document and move to next step"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute advanced-elicitation.xml with the current content
- Process the enhanced content that comes back
- Ask user: "Accept these changes to the Executive Summary? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute party-mode workflow with the current content
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
✅ User classifications validated and confirmed
✅ Product differentiator clearly identified
✅ Executive summary content generated collaboratively
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Skipping classification data loading and guessing classifications
❌ Not validating classifications with user before proceeding
❌ Generating executive summary without real user input
❌ Missing the "what makes it special" discovery
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

## COMPLEXITY HANDLING:

If `complexity_level = "high"`:

- Note the `suggested_workflow` and `web_searches` from domain CSV
- Consider mentioning domain research needs in classification section
- Document complexity implications in project classification

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-03-success.md` to define success criteria.

Remember: Do NOT proceed to step-03 until user explicitly selects 'C' from the A/P/C menu and content is saved!
