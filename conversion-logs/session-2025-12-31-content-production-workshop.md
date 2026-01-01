# Session Log: 2025-12-31 - Content Production Workshop

**Date:** December 31, 2025
**Status:** In Progress (Paused for Method Plumbing) 🔄

---

## Objectives

1. 🔄 Design "Scientific Content Creation Workflow" for WDS agents
2. ⏸️ Document strategic frameworks in method guides
3. ⏸️ Integrate frameworks into agent instructions
4. ⏸️ Implement Value Chain Content Analysis structure

---

## Context

User identified issues with agent behavior during WDS landing page content creation. Agents were generating suggestions without systematic strategic analysis, leading to:
- Content lacking strategic grounding
- No explanation of WHY specific content was chosen
- Agents "blurting out versions" instead of engaging in dialog
- No scientific approach to content generation

---

## Strategic Content Creation Chain

Developed comprehensive framework for content generation:

```
Business Goal 
  ↓
User + Driving Forces (positive & negative)
  ↓
Scenario → Value Chain Selection
  ↓
Usage Situation
  ↓
Flow Context (where user has been)
  ↓
Page Purpose
  ↓
Text Section → Local Purpose (emotions, facts, tools, mental pictures)
  ↓
Value Added to Driving Forces & Business Goal
```

**Key Principle:** Content should be generated from strategic context, not created in isolation.

---

## Value Chain Content Analysis

### Concept

Attach strategic reasoning to each key content component on a page. Shows:
- Which business goal this content serves
- Which user it targets
- Which driving forces it addresses
- Why this specific content was chosen

### Structure

Table format with columns:

| Business Goal | Solution | User | Driving Forces |
|--------------|----------|------|----------------|
| 1000 Registered users | Landing page | Harriet (hairdresser) | • Wish to be queen of beauty |
| 500 Premium signups | | | • Fear of falling behind |
| | | | • Wish to save time |
| | | Tom (trainer) | • Wish to grow business |

### Benefits

1. **Transparency:** Designer understands WHY content is structured this way
2. **Flexibility:** Designer can adjust value chain and regenerate content
3. **Multi-angle content:** Different driving forces create different message angles
4. **Options presentation:** Agent can show how content changes based on value chain selection

### Example: Multi-Angle Content

**Same Goal, Different Driving Forces:**
- "Wanting to be right" → Confidence-building, empowerment messaging
- "Fearing to be wrong" → Risk-reduction, reassurance messaging

Agent presents: *"If we address fear of X, then the content should sound like..."*

---

## Strategic Frameworks to Integrate (from WPS2C v4)

### 1. Customer Awareness Cycle (Eugene Schwartz)

**Stages:**
- Unaware
- Problem Aware
- Solution Aware
- Product Aware
- Most Aware

**Integration with Scenarios:**

Every scenario should move user from one CAC position to a more favorable one:

```
Scenario Structure with CAC:
- Business Goal (+ how CAC progression feeds it)
- User + Usage Context
- CAC Starting Point ← NEW
- CAC Target Position ← NEW
- User's Driving Forces (contextualized by awareness level)
- Solution/Interaction (designed to move through CAC)
```

**Example: Golf Resort**

```
FROM: Product Aware → "I know there are golf courses in Dubai"
TO:   Most Aware    → "I've played at [Your Resort], loved it, told others"

Business Goal: 4.5+ star reviews (measurable CAC outcome)
```

**Strategic Anchors CAC Provides:**
- What content to show? → Moves from Product Aware to Most Aware
- What actions to enable? → Progresses through cycle
- What emotions to evoke? → Reduces friction at each stage
- How to measure success? → Did they advance in CAC?

**Key Insight:** Driving forces change based on awareness level. A golfer who is "Problem Aware" (frustrated with crowded courses) has different active goals than one who is "Product Aware" (comparing Dubai courses).

**Usage in v4:** Used in Conceptual Documentation phase (`04-Conceptual-Documentation.md`)
- Framed each phase based on user awareness
- Guided conversation strategy
- Determined content depth and messaging

---

### 2. Golden Circle (Simon Sinek)

**Structure:**
- WHY (purpose, belief, motivation)
- HOW (process, differentiators)
- WHAT (product, features)

**Usage in v4:** Used in Product Brief Discovery (`01-Product-Brief-Discovery.md`)
- Structured discovery conversations
- Started with WHY questions (purpose, vision)
- Moved to HOW (approach, differentiators)
- Ended with WHAT (features, deliverables)

**Integration Point:** Product Brief phase, messaging hierarchy, value proposition

---

### 3. Action Mapping (Cathy Moore)

**Purpose:** Focus on what users DO, not just what they KNOW

**Usage in v4:** Used in Scenario Step Exploration
- Identified user actions that drive business results
- Eliminated information-only steps
- Focused on practice and application

**Integration Point:** UX Design phase, interaction design, scenario steps

---

### 4. Kathy Sierra's Teachings

**Principles:**
- Make users feel capable (not just informed)
- Reduce cognitive load
- Create "aha moments"
- Focus on user badassery, not product features

**Usage in v4:** Used in component design and user experience
- Component specifications focused on capability
- Microcopy reduced anxiety
- Interaction patterns built confidence

**Integration Point:** Component specifications, microcopy, interaction patterns, content creation

---

## Agent Content Creation Behavior

### Current (Problematic)
- Agent gets prompt → immediately generates suggestion
- No strategic analysis
- No explanation of reasoning
- Refuses to stay in dialog until good solution found

### Desired (Scientific)
1. Agent receives content creation request
2. Agent identifies strategic context:
   - Business goal(s)
   - Target user(s) and driving forces
   - CAC starting/target position
   - Scenario and value chain
   - Usage situation
   - Flow context
   - Page purpose
   - Text section local purpose
3. Agent presents context to designer: *"Here's the strategic context I'm working with..."*
4. Agent generates content WITH reasoning: *"Based on [value chain], targeting [driving force], this content takes the form..."*
5. Designer can:
   - Accept content
   - Adjust value chain → regenerate
   - Request alternative angles
   - Engage in dialog until satisfied

### Implementation Considerations

**In Most Cases:**
- Agent has enough context to present full section/page content
- Designer reviews and adjusts value chain if needed
- No workshop required for every text block

**For Complex Content:**
- Agent may present options based on different value chain selections
- Designer chooses angle or requests synthesis
- Iterative refinement with strategic grounding

**Always:**
- Agent explains WHY content is structured this way
- Value chain reasoning is explicit and editable
- Multiple strategic frameworks can inform decision simultaneously

---

## Multi-Dimensional Framework Synthesis

**Key Insight:** AI is phenomenal at getting multi-dimensional input (even conflicting frameworks) and creating a single output where all input is weighted and synthesized.

**Approach:**
- Don't require all frameworks to be used all the time
- Allow frameworks to complement or tension with each other
- AI synthesizes: Golden Circle + Action Mapping + Kathy Sierra + CAC → Optimal content

**Example Synthesis:**
- WHY (Golden Circle) → Purpose-driven messaging
- Problem Aware → Product Aware (CAC) → Content depth and framing
- Action focus (Action Mapping) → Call-to-action design
- Build capability (Kathy Sierra) → Confidence-building language

= **Resulting content addresses purpose, meets user where they are, focuses on action, builds confidence**

---

## Proposed Implementation Structure

### 1. Method Documentation (`docs/method/`)

Create tool-agnostic guides for each strategic framework:

**New Files to Create:**
- `cac-integration-guide.md` - Customer Awareness Cycle
- `golden-circle-guide.md` - Simon Sinek's framework
- `action-mapping-guide.md` - Cathy Moore's method
- `kathy-sierra-guide.md` - User capability framework
- `value-chain-content-analysis-guide.md` - New WDS concept

**Structure for Each:**
- What it is (overview)
- Why it matters (benefits)
- When to use it (context)
- How to apply it (step-by-step)
- Examples (real-world applications)
- Integration points (where in WDS process)

### 2. Agent Instructions

Reference methods in agent personas/workflows:

**Example Pattern:**
```markdown
When creating content for [scenario/page]:

1. Identify user's CAC position (see method/cac-integration-guide.md)
2. Use Kathy Sierra's method to identify aha moment (see method/kathy-sierra-guide.md)
3. Organize information according to Golden Circle (see method/golden-circle-guide.md)
4. Ensure action focus per Action Mapping (see method/action-mapping-guide.md)
5. Present Value Chain Content Analysis showing strategic reasoning
```

### 3. Workflow Integration

Embed framework checkpoints at appropriate workflow stages:

**Scenario Definition (Phase 2):**
- Add CAC Starting Point field
- Add CAC Target Position field
- Validate: Does scenario move user forward in CAC?

**Content Creation (Phase 4):**
- Activate Value Chain Content Analysis
- Reference relevant frameworks (CAC, Golden Circle, Kathy Sierra)
- Generate content with strategic reasoning

**Page Specifications:**
- Include Value Chain table for each key content section
- Show which business goal + user + driving force each section serves
- Allow designer to adjust and regenerate

---

## Use Cases Beyond Content Production

**User Question:** "These models are great for content production and copywriting, but they could serve a great purpose in other purposes as well in the WDS process?"

**Answer:** Yes! Strategic frameworks have multiple applications:

### Customer Awareness Cycle
- **Product Brief:** Determine where target users currently are in awareness
- **Trigger Mapping:** Map scenarios to CAC progression
- **Content Creation:** Match messaging to awareness level
- **Testing:** Validate that interactions move users forward in CAC

### Golden Circle
- **Product Brief:** Structure discovery conversations (WHY → HOW → WHAT)
- **Positioning:** Create value proposition hierarchy
- **Messaging:** Organize communication from purpose to features
- **Stakeholder Alignment:** Get buy-in by starting with WHY

### Action Mapping
- **Scenario Design:** Focus on user actions that drive business results
- **Interaction Design:** Eliminate information-only steps
- **Component Specs:** Design for action, not just display
- **Testing:** Validate that users can actually DO the thing

### Kathy Sierra
- **Component Design:** Build capability, not just functionality
- **Microcopy:** Reduce anxiety, build confidence
- **Onboarding:** Create aha moments early
- **Error Messages:** Help users feel capable even when things go wrong

---

## Examples from Old v4 Repo

### Customer Awareness Cycle Usage (04-Conceptual-Documentation.md)

```markdown
For each conceptual step:
1. Assess user's awareness level (Unaware → Most Aware)
2. Match content depth to awareness:
   - Problem Aware: Show the problem clearly
   - Solution Aware: Introduce your approach
   - Product Aware: Show how YOUR product works
3. Design progression to next awareness level
```

### Golden Circle Usage (01-Product-Brief-Discovery.md)

```markdown
Discovery conversation structure:

WHY Questions:
- Why does this product need to exist?
- What problem keeps you up at night?
- What would success look like for your users?

HOW Questions:
- How is your approach different?
- How will users experience this?
- How will you measure success?

WHAT Questions:
- What features are must-haves?
- What is out of scope?
- What are the deliverables?
```

### Action Mapping Usage (Scenario Exploration)

```markdown
For each scenario step:
1. What does the user DO?
2. What business result does this action drive?
3. Remove any step that is "learn about X" without action
4. Focus on practice, application, decision-making
```

### Kathy Sierra Usage (Component Design)

```markdown
For each component:
1. What capability does this give the user?
2. What makes them feel "I can do this"?
3. What reduces cognitive load?
4. What creates an aha moment?
5. How do we help them feel badass?
```

---

## Next Steps

### Method Plumbing (Current Priority)

User requested pause to do foundational work:

1. ✅ Document current content discussion (this file)
2. ⏸️ Create method guides for each strategic framework
3. ⏸️ Define Value Chain Content Analysis data structure
4. ⏸️ Update existing method guides to reference frameworks
5. ⏸️ Design content creation workflow/agent
6. ⏸️ Update agent instructions with framework references

### When Resuming Content Work

1. Test scientific content creation approach with WDS landing page
2. Validate Value Chain Content Analysis structure
3. Refine agent behavior based on real usage
4. Document patterns and best practices

---

## Key Decisions

### 1. CAC Integration with Scenarios

**Decision:** Every scenario must explicitly define CAC starting point and target position.

**Rationale:** Provides clear strategic anchor for all content and interaction decisions. Makes scenario success measurable.

### 2. Value Chain Content Analysis

**Decision:** Create explicit data structure showing strategic reasoning for each content component.

**Rationale:** Makes agent reasoning transparent, allows designer control, enables multi-angle content generation.

### 3. Multi-Dimensional Framework Synthesis

**Decision:** Don't require all frameworks all the time. Let AI synthesize multiple (even conflicting) frameworks.

**Rationale:** Leverages AI's strength in multi-dimensional synthesis. More flexible than rigid framework application.

### 4. Method Documentation Structure

**Decision:** Create tool-agnostic method guides that agents reference in their instructions.

**Rationale:** Separates methodology from implementation. Allows reuse across different agents and contexts.

---

## Quotes & Insights

> "The agent just spit out a suggestion after each prompt without asking or thinking."

> "I wanted to create the content for the WDS page. This is a complex task that I had worried a lot about. Instead of worrying, I started a full WDS process. I made a great PRD and went through the process of making a Trigger map. I got a lot of great inspiration and have a ton of context for the process."

> "The agent did not go about this in a scientific way. The agent blurted out versions left and right and refused to stay in the dialog until a good solution was found."

> "Based on all these data points, we have a fantastic position to write awesome content. I wish for the agent to identify this information and feed it to the user when it is time to create a text section. This is what I mean with scientific approach!"

> "Wanting to be right and fearing to be wrong is on the face of it technically the same thing, but in terms of driving forces it gives two different messages in terms of content presented to the user."

> "AI is phenomenal at getting multi-dimensional input and create a single output where all of the sometimes conflicting input is taken into account and weighed against each other."

> "A scenario should in essence take a user from one less favorable position in the CAC to a more favorable one. That is very useful to define where the user starts."

---

## Session Status

**Current Phase:** Method Plumbing 🔧
**Next Up:** Create strategic framework method guides
**Blocked:** None
**Notes:** Content discussion well-documented, ready to resume after method documentation is complete

---

*This session log preserves context for content production workshop development.*

