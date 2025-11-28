# Step 4: User Journey Mapping

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on mapping ALL user types that interact with the system
- 🎯 CRITICAL: No journey = no functional requirements = product doesn't exist

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

- When 'A' selected: Execute {project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/{bmad_folder}/core/workflows/party-mode
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Success criteria and scope already defined
- No additional data files needed for this step
- Every human interaction with the system needs a journey

## YOUR TASK:

Map comprehensive user journeys for ALL user types that interact with the system.

## JOURNEY MAPPING SEQUENCE:

### 1. Identify All User Types

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

### 2. Create Detailed Narrative Journeys

For each user type, create rich, detailed journeys following this structure:

#### Journey Creation Process:

**1. Develop the Persona:**

- **Name**: Realistic name (Maria, Marcus, Jordan, etc.)
- **Backstory**: Who they are, what they want, why they need this
- **Motivation**: Core problem they're trying to solve
- **Emotional state**: How they feel about solving this problem

**2. Map Complete Journey:**

- **Entry point**: How they discover and access the product
- **Key steps**: Each touchpoint in sequence (use arrows →)
- **Critical actions**: What they do at each step
- **Decision points**: Choices they make
- **Success moment**: Where they achieve their goal
- **Exit point**: How the journey concludes

**3. Use This Exact Format:**

```markdown
**Journey [Number]: [Persona Name] - [Journey Theme]**
[Persona description with backstory and motivation]

- [Entry point] → [step 1] → [step 2] → [step 3] → [critical moment] → [step N] → [completion]
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
[C] Continue - Save this to the document and move to next step"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute advanced-elicitation.xml with the current journey content
- Process the enhanced journey insights that come back
- Ask user: "Accept these improvements to the user journeys? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute party-mode workflow with the current journeys
- Process the collaborative journey improvements and additions
- Ask user: "Accept these changes to the user journeys? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `./step-05-domain.md` (or determine if step is optional based on domain complexity)

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ All user types identified (not just primary users)
✅ Rich persona development for each journey
✅ Complete end-to-end journey mapping with critical moments
✅ Journey requirements clearly connected to capabilities needed
✅ Minimum 3-4 comprehensive journeys covering different user types
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Only mapping primary user journeys and missing secondary users
❌ Creating generic journeys without rich persona details
❌ Missing critical decision points and failure scenarios
❌ Not connecting journeys to required capabilities
❌ Not having enough journey diversity (admin, support, API, etc.)
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

## JOURNEY TYPES TO ENSURE:

**Minimum Coverage:**

1. **Primary User - Success Path**: Core experience journey
2. **Primary User - Edge Case**: Error recovery, alternative goals
3. **Admin/Operations User**: Management, configuration, monitoring
4. **Support/Troubleshooting**: Help, investigation, issue resolution
5. **API/Integration** (if applicable): Developer/technical user journey

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-05-domain.md`.

Note: Step-05 is optional - check if domain complexity from step-02 warrants domain-specific exploration.

Remember: Do NOT proceed to step-05 until user explicitly selects 'C' from the A/P/C menu and content is saved!
