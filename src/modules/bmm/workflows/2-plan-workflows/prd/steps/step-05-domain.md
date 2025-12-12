---
name: 'step-05-domain'
description: 'Explore domain-specific requirements for complex domains (optional step)'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-05-domain.md'
nextStepFile: '{workflow_path}/steps/step-06-innovation.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd.md'

# Data Files
domainComplexityCSV: '{workflow_path}/domain-complexity.csv'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Domain-Specific Exploration

**Progress: Step 5 of 11** - Next: Innovation Focus

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on domain-specific requirements and compliance needs
- 🎯 OPTIONAL STEP: Only proceed if complexity_level = "high" from step-02

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating domain content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper domain insights
- **P (Party Mode)**: Bring domain expertise perspectives to explore requirements
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Domain complexity from step-02 should be "high" to justify this step
- Domain-specific CSV data will be loaded in this step
- Focus on compliance, regulations, and domain-specific constraints

## OPTIONAL STEP CHECK:

Before proceeding with this step, verify:

- Is `complexity_level` from step-02 equal to "high" and/or does the domain have specific regulatory/compliance needs?
- Would domain exploration significantly impact the product requirements?

If NO to these questions, skip this step and load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-06-innovation.md`.

## YOUR TASK:

Explore domain-specific requirements for complex domains that need specialized compliance, regulatory, or industry-specific considerations.

## DOMAIN EXPLORATION SEQUENCE:

### 1. Load Domain Configuration Data

Load domain-specific configuration for complex domains:

- Load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/domain-complexity.csv` completely
- Find the row where `domain` matches the detected domain from step-02
- Extract these columns:
  - `key_concerns` (semicolon-separated list)
  - `required_knowledge` (domain expertise needed)
  - `web_searches` (suggested research queries)
  - `special_sections` (domain-specific sections to document)

### 2. Present Domain Complexity Context

Start by explaining why this step is needed:
"Since {{project_name}} is in the {domain} domain with high complexity, we need to explore domain-specific requirements.

**Key Concerns for {domain}:**
[List the key_concerns from CSV]

This step will help us understand regulatory requirements, compliance needs, and industry-specific constraints that will shape our product."

### 3. Explore Domain-Specific Requirements

For each concern in `key_concerns` from the CSV:

#### Domain Concern Exploration:

- Ask the user about their approach to this concern
- Discuss implications for the product design and requirements
- Document specific requirements, constraints, and compliance needs

**Example for Healthcare Domain:**
If key_concerns = "FDA approval;Clinical validation;HIPAA compliance;Patient safety;Medical device classification;Liability"

Ask about each:

- "Will this product require FDA approval? What classification?"
- "How will you validate clinical accuracy and safety?"
- "What HIPAA compliance measures are needed?"
- "What patient safety protocols must be in place?"
- "What liability considerations affect the design?"

### 4. Synthesize Domain Requirements

Based on the conversation, synthesize domain requirements that will shape everything:

#### Categories to Document:

- **Regulatory requirements** (from key_concerns)
- **Compliance needs** (from key_concerns)
- **Industry standards** (from required_knowledge)
- **Safety/risk factors** (from key_concerns)
- **Required validations** (from key_concerns)
- **Special expertise needed** (from required_knowledge)

Explain how these inform:

- What features are mandatory
- What NFRs are critical
- How to sequence development
- What validation is required

### 5. Generate Domain-Specific Content

Prepare the content to append to the document:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## Domain-Specific Requirements

### [Domain Name] Compliance & Regulatory Overview

[Domain context summary based on conversation]

### Key Domain Concerns

[Key concerns addressed based on conversation]

### Compliance Requirements

[Compliance requirements based on conversation]

### Industry Standards & Best Practices

[Industry standards based on conversation]

### Required Expertise & Validation

[Required knowledge and validation based on conversation]

### Implementation Considerations

[Implementation implications based on conversation]
```

### 6. Handle Special Sections

Parse `special_sections` list from the matched CSV row. For each section name, generate corresponding subsections:

**Example mappings from CSV:**

- "clinical_requirements" → Add clinical validation requirements
- "regulatory_pathway" → Document approval pathway timeline
- "safety_measures" → Specify safety protocols and monitoring
- "compliance_matrix" → Create compliance tracking matrix

### 7. Present Content and Menu

Show the generated domain content and present choices:
"I've documented the {domain}-specific requirements that will shape {{project_name}}. These constraints are critical for success in this complex domain.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper into these domain requirements
[P] Party Mode - Bring domain expertise perspectives to validate requirements
[C] Continue - Save this and move to Innovation Focus (Step 6 of 11)"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml with the current domain content
- Process the enhanced domain insights that come back
- Ask user: "Accept these domain requirement improvements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md with the current domain requirements
- Process the collaborative domain expertise and validation
- Ask user: "Accept these changes to domain requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-06-innovation.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Domain complexity properly validated as high before proceeding
✅ All key concerns from CSV explored with user input
✅ Compliance requirements clearly documented
✅ Domain expertise needs identified and documented
✅ Special sections generated per CSV configuration
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Proceeding with domain exploration when complexity is not high
❌ Not loading or using CSV domain configuration properly
❌ Missing critical domain concerns from the key_concerns list
❌ Not connecting domain requirements to product implications
❌ Generating generic content without domain-specific details
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## SKIP CONDITIONS:

Skip this step and load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-06-innovation.md` if:

- `complexity_level` from step-02 is not "high"
- Domain has no specific regulatory/compliance requirements
- User confirms domain exploration is not needed

## NEXT STEP:

After user selects 'C' and content is saved to document, load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-06-innovation.md`.

Remember: Do NOT proceed to step-06 until user explicitly selects 'C' from the A/P/C menu and content is saved!
