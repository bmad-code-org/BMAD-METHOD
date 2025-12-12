---
name: 'step-10-nonfunctional'
description: 'Define quality attributes that matter for this specific product'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-10-nonfunctional.md'
nextStepFile: '{workflow_path}/steps/step-11-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 10: Non-Functional Requirements

**Progress: Step 10 of 11** - Next: Complete PRD

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on quality attributes that matter for THIS specific product
- 🎯 SELECTIVE: Only document NFRs that actually apply to the product

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating NFR content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to ensure comprehensive quality attributes
- **P (Party Mode)**: Bring technical perspectives to validate NFR completeness
- **C (Continue)**: Save the content to the document and proceed to final step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Functional requirements already defined and will inform NFRs
- Domain and project-type context will guide which NFRs matter
- Focus on specific, measurable quality criteria

## YOUR TASK:

Define non-functional requirements that specify quality attributes for the product, focusing only on what matters for THIS specific product.

## NON-FUNCTIONAL REQUIREMENTS SEQUENCE:

### 1. Explain NFR Purpose and Scope

Start by clarifying what NFRs are and why we're selective:

**NFR Purpose:**
NFRs define HOW WELL the system must perform, not WHAT it must do. They specify quality attributes like performance, security, scalability, etc.

**Selective Approach:**
We only document NFRs that matter for THIS product. If a category doesn't apply, we skip it entirely. This prevents requirement bloat and focuses on what's actually important.

### 2. Assess Product Context for NFR Relevance

Evaluate which NFR categories matter based on product context:

**Quick Assessment Questions:**

- **Performance**: Is there user-facing impact of speed?
- **Security**: Are we handling sensitive data or payments?
- **Scalability**: Do we expect rapid user growth?
- **Accessibility**: Are we serving broad public audiences?
- **Integration**: Do we need to connect with other systems?
- **Reliability**: Would downtime cause significant problems?

### 3. Explore Relevant NFR Categories

For each relevant category, conduct targeted discovery:

#### Performance NFRs (If relevant):

"Let's talk about performance requirements for {{project_name}}.

**Performance Questions:**

- What parts of the system need to be fast for users to be successful?
- Are there specific response time expectations?
- What happens if performance is slower than expected?
- Are there concurrent user scenarios we need to support?"

#### Security NFRs (If relevant):

"Security is critical for products that handle sensitive information.

**Security Questions:**

- What data needs to be protected?
- Who should have access to what?
- What are the security risks we need to mitigate?
- Are there compliance requirements (GDPR, HIPAA, PCI-DSS)?"

#### Scalability NFRs (If relevant):

"Scalability matters if we expect growth or have variable demand.

**Scalability Questions:**

- How many users do we expect initially? Long-term?
- Are there seasonal or event-based traffic spikes?
- What happens if we exceed our capacity?"
- What growth scenarios should we plan for?"

#### Accessibility NFRs (If relevant):

"Accessibility ensures the product works for users with disabilities.

**Accessibility Questions:**

- Are we serving users with visual, hearing, or motor impairments?
- Are there legal accessibility requirements (WCAG, Section 508)?
- What accessibility features are most important for our users?"

#### Integration NFRs (If relevant):

"Integration requirements matter for products that connect to other systems.

**Integration Questions:**

- What external systems do we need to connect with?
- Are there APIs or data formats we must support?
- How reliable do these integrations need to be?"

### 4. Make NFRs Specific and Measurable

For each relevant NFR category, ensure criteria are testable:

**From Vague to Specific:**

- NOT: "The system should be fast" → "User actions complete within 2 seconds"
- NOT: "The system should be secure" → "All data is encrypted at rest and in transit"
- NOT: "The system should scale" → "System supports 10x user growth with <10% performance degradation"

### 5. Generate NFR Content (Only Relevant Categories)

Prepare the content to append to the document:

#### Content Structure (Dynamic based on relevance):

When saving to document, append these Level 2 and Level 3 sections (only include sections that are relevant):

```markdown
## Non-Functional Requirements

### Performance

[Performance requirements based on conversation - only include if relevant]

### Security

[Security requirements based on conversation - only include if relevant]

### Scalability

[Scalability requirements based on conversation - only include if relevant]

### Accessibility

[Accessibility requirements based on conversation - only include if relevant]

### Integration

[Integration requirements based on conversation - only include if relevant]
```

### 6. Present Content and Menu

Show the generated NFR content and present choices:
"I've defined the non-functional requirements that specify how well {{project_name}} needs to perform. I've only included categories that actually matter for this product.

**Here's what I'll add to the document:**

[Show the complete NFR content from step 5]

**Note:** We've skipped categories that don't apply to avoid unnecessary requirements.

**What would you like to do?**
[A] Advanced Elicitation - Let's ensure we haven't missed critical quality attributes
[P] Party Mode - Bring technical perspectives to validate NFR specifications
[C] Continue - Save this and move to Complete PRD (Step 11 of 11)"

### 7. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml with the current NFR content
- Process the enhanced quality attribute insights that come back
- Ask user: "Accept these improvements to the non-functional requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md with the current NFR list
- Process the collaborative technical validation and additions
- Ask user: "Accept these changes to the non-functional requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
- Load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-11-complete.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Only relevant NFR categories documented (no requirement bloat)
✅ Each NFR is specific and measurable
✅ NFRs connected to actual user needs and business context
✅ Vague requirements converted to testable criteria
✅ Domain-specific compliance requirements included if relevant
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Documenting NFR categories that don't apply to the product
❌ Leaving requirements vague and unmeasurable
❌ Not connecting NFRs to actual user or business needs
❌ Missing domain-specific compliance requirements
❌ Creating overly prescriptive technical requirements
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NFR CATEGORY GUIDANCE:

**Include Performance When:**

- User-facing response times impact success
- Real-time interactions are critical
- Performance is a competitive differentiator

**Include Security When:**

- Handling sensitive user data
- Processing payments or financial information
- Subject to compliance regulations
- Protecting intellectual property

**Include Scalability When:**

- Expecting rapid user growth
- Handling variable traffic patterns
- Supporting enterprise-scale usage
- Planning for market expansion

**Include Accessibility When:**

- Serving broad public audiences
- Subject to accessibility regulations
- Targeting users with disabilities
- B2B customers with accessibility requirements

## NEXT STEP:

After user selects 'C' and content is saved to document, load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-11-complete.md` to finalize the PRD and complete the workflow.

Remember: Do NOT proceed to step-11 until user explicitly selects 'C' from the A/P/C menu and content is saved!
