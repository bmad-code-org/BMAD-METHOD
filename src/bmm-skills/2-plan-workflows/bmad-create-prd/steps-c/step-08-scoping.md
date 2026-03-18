# Step 8: Scoping Exercise - Scope Definition (Phased or Single-Release)

**Progress: Step 8 of 11** - Next: Functional Requirements

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on strategic scope decisions that keep projects viable
- 🎯 EMPHASIZE lean MVP thinking while preserving long-term vision
- ⚠️ NEVER de-scope, defer, or phase out requirements that the user explicitly included in their input documents without asking first
- ⚠️ NEVER invent phasing (MVP/Growth/Vision) unless the user requests phased delivery — if input documents define all components as core requirements, they are ALL in scope
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ✅ YOU MUST ALWAYS WRITE all artifact and document content in `{document_output_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 📚 Review the complete PRD document built so far
- ⚠️ Present A/P/C menu after generating scoping decisions
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected


## CONTEXT BOUNDARIES:

- Complete PRD document built so far is available for review
- User journeys, success criteria, and domain requirements are documented
- Focus on strategic scope decisions, not feature details
- Balance between user value and implementation feasibility

## YOUR TASK:

Conduct comprehensive scoping exercise to define release boundaries and prioritize features based on the user's chosen delivery mode (phased or single-release).

## SCOPING SEQUENCE:

### 1. Review Current PRD State

Analyze everything documented so far:
- Present synthesis of established vision, success criteria, journeys
- Assess domain and innovation focus
- Evaluate scope implications: simple MVP, medium, or complex project
- Ask if initial assessment feels right or if they see it differently

### 2. Define MVP Strategy

Facilitate strategic MVP decisions:
- Explore MVP philosophy options: problem-solving, experience, platform, or revenue MVP
- Ask critical questions:
  - What's the minimum that would make users say 'this is useful'?
  - What would make investors/partners say 'this has potential'?
  - What's the fastest path to validated learning?
- Guide toward appropriate MVP approach for their product

### 3. Scoping Decision Framework

Use structured decision-making for scope:

**Must-Have Analysis:**
- Guide identification of absolute MVP necessities
- For each journey and success criterion, ask:
  - Without this, does the product fail?
  - Can this be manual initially?
  - Is this a deal-breaker for early adopters?
- Analyze journeys for MVP essentials

**Nice-to-Have Analysis:**
- Identify what could be added later:
  - Features that enhance but aren't essential
  - User types that can be added later
  - Advanced functionality that builds on MVP
- Ask what features could be added in versions 2, 3, etc.

**⚠️ SCOPE CHANGE CONFIRMATION GATE:**
- If you believe any user-specified requirement should be deferred or de-scoped, you MUST present this to the user and get explicit confirmation BEFORE removing it from scope
- Frame it as a recommendation, not a decision: "I'd recommend deferring X because [reason]. Do you agree, or should it stay in scope?"
- NEVER silently move user requirements to a later phase or exclude them from MVP
- Before creating any consequential phase-based artifacts (e.g., phase tags, labels, or follow-on prompts), present artifact creation as a recommendation and proceed only after explicit user approval

### 4. Progressive Feature Roadmap

**CRITICAL: Phasing is NOT automatic. Check the user's input first.**

Before proposing any phased approach, review the user's input documents:

- **If the input documents define all components as core requirements with no mention of phases:** Present all requirements as a single release scope. Do NOT invent phases or move requirements to fabricated future phases.
- **If the input documents explicitly request phased delivery:** Guide mapping of features across the phases the user defined.
- **If scope is unclear:** ASK the user whether they want phased delivery or a single release before proceeding.

**When the user requests phased delivery**, guide mapping of features across the phases the user defines:

- Use user-provided phase labels and count; if none are provided, propose a default (e.g., MVP/Growth/Vision) and ask for confirmation
- Ensure clear progression and dependencies between phases

**Each phase should address:**

- Core user value delivery and essential journeys for that phase
- Clear boundaries on what ships in each phase
- Dependencies on prior phases

**When the user chooses a single release**, define the complete scope:

- All user-specified requirements are in scope
- Focus must-have vs nice-to-have analysis on what ships in this release
- Do NOT create phases — use must-have/nice-to-have priority within the single release

**If phased delivery:** "Where does your current vision fit in this development sequence?"
**If single release:** "How does your current vision map to this upcoming release?"

### 5. Risk-Based Scoping

Identify and mitigate scoping risks:

**Technical Risks:**
"Looking at your innovation and domain requirements:

- What's the most technically challenging aspect?
- Could we simplify the initial implementation?
- What's the riskiest assumption about technology feasibility?"

**Market Risks:**

- What's the biggest market risk?
- How does the MVP address this?
- What learning do we need to de-risk this?"

**Resource Risks:**

- What if we have fewer resources than planned?
- What's the absolute minimum team size needed?
- Can we launch with a smaller feature set?"

### 6. Generate Scoping Content

Prepare comprehensive scoping section:

#### Content Structure:

**If user chose phased delivery:**

```markdown
## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** {{chosen_mvp_approach}}
**Resource Requirements:** {{mvp_team_size_and_skills}}

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
{{essential_journeys_for_mvp}}

**Must-Have Capabilities:**
{{list_of_essential_mvp_features}}

### Post-MVP Features

**Phase 2 (Post-MVP):**
{{planned_growth_features}}

**Phase 3 (Expansion):**
{{planned_expansion_features}}

### Risk Mitigation Strategy

**Technical Risks:** {{mitigation_approach}}
**Market Risks:** {{validation_approach}}
**Resource Risks:** {{contingency_approach}}
```

**If user chose single release (no phasing):**

```markdown
## Project Scoping

### Strategy & Philosophy

**Approach:** {{chosen_approach}}
**Resource Requirements:** {{team_size_and_skills}}

### Complete Feature Set

**Core User Journeys Supported:**
{{all_journeys}}

**Must-Have Capabilities:**
{{list_of_must_have_features}}

**Nice-to-Have Capabilities:**
{{list_of_nice_to_have_features}}

### Risk Mitigation Strategy

**Technical Risks:** {{mitigation_approach}}
**Market Risks:** {{validation_approach}}
**Resource Risks:** {{contingency_approach}}
```

### 7. Present MENU OPTIONS

Present the scoping decisions for review, then display menu:
- Show strategic scoping plan (using structure from step 6)
- Highlight release boundaries and prioritization (phased roadmap only if phased delivery was selected)
- Ask if they'd like to refine further, get other perspectives, or proceed
- Present menu options naturally as part of conversation

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Functional Requirements (Step 9 of 11)"

#### Menu Handling Logic:
- IF A: Invoke the `bmad-advanced-elicitation` skill with the current scoping analysis, process the enhanced insights that come back, ask user if they accept the improvements, if yes update content then redisplay menu, if no keep original content then redisplay menu
- IF P: Invoke the `bmad-party-mode` skill with the scoping context, process the collaborative insights on MVP and roadmap decisions, ask user if they accept the changes, if yes update content then redisplay menu, if no keep original content then redisplay menu
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array (also add `releaseMode: phased` or `releaseMode: single-release` to frontmatter based on user's choice), then read fully and follow: ./step-09-functional.md
- IF Any other: help user respond, then redisplay menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Complete PRD document analyzed for scope implications
✅ Strategic MVP approach defined and justified
✅ Clear feature boundaries established (phased or single-release, per user preference)
✅ All user-specified requirements accounted for — none silently removed or deferred
✅ Any scope reduction recommendations presented to user with rationale and explicit confirmation obtained
✅ Key risks identified and mitigation strategies defined
✅ User explicitly agrees to scope decisions
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Not analyzing the complete PRD before making scoping decisions
❌ Making scope decisions without strategic rationale
❌ Not getting explicit user agreement on MVP boundaries
❌ Missing critical risk analysis
❌ Not presenting A/P/C menu after content generation
❌ **CRITICAL**: Silently de-scoping or deferring requirements that the user explicitly included in their input documents
❌ **CRITICAL**: Inventing phasing (MVP/Growth/Vision) when the user did not request phased delivery
❌ **CRITICAL**: Making consequential scoping decisions (what is in/out of scope) without explicit user confirmation
❌ **CRITICAL**: Creating phase-based artifacts (tags, labels, follow-on prompts) without explicit user approval

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load ./step-09-functional.md.

Remember: Do NOT proceed to step-09 until user explicitly selects 'C' from the A/P/C menu and content is saved!
