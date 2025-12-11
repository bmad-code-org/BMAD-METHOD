---
name: 'step-03-success'
description: 'Define comprehensive success criteria covering user, business, and technical success'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-03-success.md'
nextStepFile: '{workflow_path}/steps/step-04-journeys.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Success Criteria Definition

**Progress: Step 3 of 11** - Next: User Journey Mapping

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on defining what winning looks like for this product
- 🎯 COLLABORATIVE discovery, not assumption-based goal setting

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating success criteria content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper insights about success metrics
- **P (Party Mode)**: Bring multiple perspectives to define comprehensive success criteria
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Executive Summary and Project Classification already exist in document
- Input documents from step-01 are available (product briefs, research, brainstorming)
- No additional data files needed for this step
- Focus on measurable, specific success criteria
- LEVERAGE existing input documents to inform success criteria

## YOUR TASK:

Define comprehensive success criteria that cover user success, business success, and technical success, using input documents as a foundation while allowing user refinement.

## SUCCESS DISCOVERY SEQUENCE:

### 1. Begin Success Definition Conversation

**Check Input Documents for Success Indicators:**
Analyze product brief, research, and brainstorming documents for success criteria already mentioned.

**If Input Documents Contain Success Criteria:**
"Looking at your product brief and research, I see some initial success criteria already defined:

**From your brief:**
{{extracted_success_criteria_from_brief}}

**From research:**
{{extracted_success_criteria_from_research}}

**From brainstorming:**
{{extracted_success_criteria_from_brainstorming}}

This gives us a great foundation. Let's refine and expand on these initial thoughts:

**User Success First:**
Based on what we have, how would you refine these user success indicators:

- {{refined_user_success_from_documents}}
- Are there other user success metrics we should consider?

**What would make a user say 'this was worth it'** beyond what's already captured?"

**If No Success Criteria in Input Documents:**
Start with user-centered success:
"Now that we understand what makes {{project_name}} special, let's define what success looks like.

**User Success First:**

- What would make a user say 'this was worth it'?
- What's the moment where they realize this solved their problem?
- After using {{project_name}}, what outcome are they walking away with?

Let's start with the user experience of success."

### 2. Explore User Success Metrics

Listen for specific user outcomes and help make them measurable:

- Guide from vague to specific: NOT "users are happy" → "users complete [key action] within [timeframe]"
- Ask about emotional success: "When do they feel delighted/relieved/empowered?"
- Identify success moments: "What's the 'aha!' moment?"
- Define completion scenarios: "What does 'done' look like for the user?"

### 3. Define Business Success

Transition to business metrics:
"Now let's look at success from the business perspective.

**Business Success:**

- What does success look like at 3 months? 12 months?
- Are we measuring revenue, user growth, engagement, something else?
- What metric would make you say 'this is working'?

Help me understand what success means for your business."

### 4. Challenge Vague Metrics

Push for specificity on business metrics:

- "10,000 users" → "What kind of users? Doing what?"
- "99.9% uptime" → "What's the real concern - data loss? Failed payments?"
- "Fast" → "How fast, and what specifically needs to be fast?"
- "Good adoption" → "What percentage adoption by when?"

### 5. Connect to Product Differentiator

Tie success metrics back to what makes the product special:
"So success means users experience [differentiator] and achieve [outcome]. Does that capture it?"

Adapt success criteria to context:

- Consumer: User love, engagement, retention
- B2B: ROI, efficiency, adoption
- Developer tools: Developer experience, community
- Regulated: Compliance, safety, validation
- GovTech: Government compliance, accessibility, procurement

### 6. Smart Scope Negotiation

Guide scope definition through success lens:
"The Scoping Game:

1. What must work for this to be useful? → MVP
2. What makes it competitive? → Growth
3. What's the dream version? → Vision

Challenge scope creep conversationally:

- Could that wait until after launch?
- Is that essential for proving the concept?

For complex domains, include compliance minimums in MVP."

### 7. Generate Success Criteria Content

Prepare the content to append to the document:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## Success Criteria

### User Success

[Content about user success criteria based on conversation]

### Business Success

[Content about business success metrics based on conversation]

### Technical Success

[Content about technical success requirements based on conversation]

### Measurable Outcomes

[Content about specific measurable outcomes based on conversation]

## Product Scope

### MVP - Minimum Viable Product

[Content about MVP scope based on conversation]

### Growth Features (Post-MVP)

[Content about growth features based on conversation]

### Vision (Future)

[Content about future vision based on conversation]
```

### 8. Present Content and Menu

Show the generated content and present choices:
"I've drafted our success criteria and scope definition based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 7]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper and refine these success metrics
[P] Party Mode - Bring in different perspectives on success criteria
[C] Continue - Save success criteria and move to User Journey Mapping (Step 4 of 11)"

### 9. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml with the current success criteria content
- Process the enhanced success metrics that come back
- Ask user: "Accept these improvements to the success criteria? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md with the current success criteria
- Process the collaborative improvements to metrics and scope
- Ask user: "Accept these changes to the success criteria? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `./step-04-journeys.md`

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 7.

## SUCCESS METRICS:

✅ User success criteria clearly identified and made measurable
✅ Business success metrics defined with specific targets
✅ Success criteria connected to product differentiator
✅ Scope properly negotiated (MVP, Growth, Vision)
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Accepting vague success metrics without pushing for specificity
❌ Not connecting success criteria back to product differentiator
❌ Missing scope negotiation and leaving it undefined
❌ Generating content without real user input on what success looks like
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## DOMAIN CONSIDERATIONS:

If working in regulated domains (healthcare, fintech, govtech):

- Include compliance milestones in success criteria
- Add regulatory approval timelines to MVP scope
- Consider audit requirements as technical success metrics

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-04-journeys.md` to map user journeys.

Remember: Do NOT proceed to step-04 until user explicitly selects 'C' from the A/P/C menu and content is saved!
