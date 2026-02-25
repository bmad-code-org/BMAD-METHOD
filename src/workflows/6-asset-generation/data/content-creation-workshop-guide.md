# Content Creation Workshop Guide

**Strategic, Multi-Model Content Generation for WDS**

---

## What Is This?

The Content Creation Workshop is a disciplined, multi-model framework for generating strategically grounded content. Instead of "blurting out versions," agents use five strategic models in sequence to create content that is:

- ✅ **Strategically grounded** (serves business goals)
- ✅ **Awareness-appropriate** (speaks to user's current understanding)
- ✅ **Action-focused** (enables specific user behaviors)
- ✅ **Empowering** (makes users feel capable)
- ✅ **Structurally persuasive** (WHY → HOW → WHAT flow)

---

## When to Use

**Use this workshop whenever creating:**
- Page headlines and hero content
- Section content and feature descriptions
- Value propositions and benefit statements
- CTAs with strategic importance
- About/mission statements
- Landing page content
- Onboarding narratives
- Feature announcements
- Case studies and testimonials
- Any user-facing text where **purpose and context matter**

**Skip this workshop for:**
- ❌ Standard UI microcopy (form labels, generic buttons, tooltips)
- ❌ System messages (loading, generic errors, confirmations)
- ❌ Navigation labels
- ❌ Standard form instructions
- ❌ Technical documentation
- ❌ Code comments
- ❌ Internal notes
- ❌ Placeholder content during prototyping

**For UI microcopy:** Use **Tone of Voice** guidelines (defined in Product Brief)
- Form labels: "Email" vs "Email address" (tone-dependent)
- Buttons: "Submit" vs "Continue" vs "Let's go" (tone-dependent)
- Errors: "Invalid input" vs "Hmm, that doesn't look right" (tone-dependent)
- See [Tone of Voice Guide](../../../docs/method/tone-of-voice-guide.md)

---

## The Five-Model Framework

### 0. Content Purpose = The Job To Do
- Defines: WHAT must this content accomplish? HOW will we know it worked?
- Answers: What's the measurable outcome? Which models should we emphasize?

### 1. Trigger Map = Strategic Foundation
- Provides: Business goal, solution, user, driving forces, customer awareness positioning
- Answers: WHO are we serving? WHAT motivates them? WHERE are they in their journey?

### 2. Customer Awareness Cycle = Content Strategy
- Provides: Language appropriate to awareness level, information priorities, required proof
- Answers: WHAT can they understand? WHAT do they need to know? WHAT will they believe?

### 3. Action Mapping = Content Filter
- Provides: Required user action, relevance test
- Answers: WHAT must they DO after reading this? Is this content necessary?

### 4. Badass Users = Tone & Frame
- Provides: Empowerment framing, transformation narrative, cognitive load reduction
- Answers: HOW does this make them feel capable? WHAT's the "aha moment"?

### 5. Golden Circle = Structural Order
- Provides: WHY → HOW → WHAT sequence
- Answers: WHAT order creates the most persuasive flow?

---

## Workshop Structure

The workshop follows **7 sequential considerations** (agents can adapt flow naturally):

0. **Define Content Purpose** - What job must this content do?
1. **Load Trigger Map Context** - Establish strategic foundation
2. **Apply Customer Awareness Strategy** - Determine appropriate language & information
3. **Define Required Action** - Filter for relevance
4. **Frame User Empowerment** - Set tone and transformation narrative
5. **Determine Structural Order** - Sequence content for persuasion
6. **Generate & Review Content** - Create options and select

**Duration:** 15-30 minutes per content section

**Mode Options:**
- **Quick Mode:** Agent synthesizes internally, presents reasoning + variants
- **Workshop Mode:** Collaborative conversation through each consideration

---

## How to Use

### For Agents

When you encounter content creation in a workflow:

1. **Define Purpose First** - "What job must this content do?"
   - If user provides purpose → Use it
   - If not → Ask: "What should this content accomplish?"
   - Define success criteria: "How will we know it worked?"

2. **Select Mode:**
   - **Quick Mode:** User says "Suggest content for [X]"
     - Synthesize all strategic considerations internally
     - Present: Purpose → Reasoning → Multiple variants → Selection
   - **Workshop Mode:** User says "Let's work through content for [X]"
     - Collaborative conversation through considerations
     - Adapt flow naturally (skip/combine as appropriate)

3. **Check for Trigger Map** - Does the current context have a Trigger Map?
   - If YES → Proceed with strategic generation
   - If NO → Suggest creating a Trigger Map first (route to Phase 2)

4. **Execute Strategically:**
   - Consider all strategic layers (Trigger Map, Awareness, Action, Empowerment, Structure)
   - Emphasize models based on content purpose (see Content Purpose Guide)
   - Don't force rigid steps - adapt naturally

5. **Present Options** - Offer 2-3 variations:
   - Different driving force angles (wish vs fear)
   - Different awareness approaches (if uncertain)
   - Different structural emphases

6. **Enable Review:**
   - Does content achieve its stated purpose?
   - Objective criteria, not "I like it"

### For Designers

You control the strategic context and mode:

1. **Define content purpose** - Be specific about what the content must accomplish
2. **Choose your mode:**
   - Need quick suggestions? → "Suggest content for this hero section"
   - Want to explore together? → "Let's work through the homepage hero"
3. **Provide context** or let agent find it (Trigger Map, page purpose, user state)
4. **Review against purpose** - Does it do its job? (objective criteria)
5. **Select or refine** - Choose variant or combine elements
6. **Iterate if needed** - Purpose not achieved? Refine and regenerate

---

## Integration Points

### In Phase 4: UX Design - Sketch Review Flow

**When designer presents a sketch:**

1. **Agent identifies text elements** (headlines, CTAs, sections, microcopy)
2. **Agent suggests purposes** for each element based on:
   - Position on page (hero vs. footer)
   - Content type (headline vs. error message)
   - Page context (landing vs. onboarding)
3. **Agent recommends model priorities** for each purpose
4. **Designer confirms/refines** purposes
5. **Agent generates content** for approved purposes
6. **Content is documented** in page specification

**Granularity Options:**
- **Element-by-element:** For critical content (hero headline, primary CTA)
- **Section-level:** For cohesive blocks (feature section, testimonials)
- **Batch:** For repetitive elements (form labels, tooltips)

**Example Sketch Review:**

```
DESIGNER: "Here's the landing page sketch [wireframe]"

AGENT: "I see several text elements. Let me suggest purposes:

📝 Hero Headline
Purpose: Hook Problem Aware users by validating frustration
Models: Customer Awareness ⭐⭐⭐, Golden Circle ⭐⭐⭐

📝 Hero Subhead
Purpose: Promise transformation, reduce anxiety
Models: Badass Users ⭐⭐, Customer Awareness ⭐⭐

📝 Feature Section (whole section)
Purpose: Show how solution works, enable understanding
Models: Action Mapping ⭐⭐⭐, Badass Users ⭐⭐

📝 CTA Button
Purpose: Make signup feel empowering and low-risk
Models: Badass Users ⭐⭐⭐, Action Mapping ⭐⭐

Does this match your intent?"

DESIGNER: "Yes, generate content"
[OR]
DESIGNER: "Make headline more fear-focused"
→ AGENT: Updates purpose, generates accordingly
```

### In Phase 4: UX Design - Page Specifications

**When creating page specifications:**
- Hero sections → Purpose-driven content generation
- Key feature descriptions → Purpose-driven content generation
- CTAs and conversion points → Purpose-driven content generation
- Error/empty state messages → Purpose-driven content generation

**When working with Freya:**
- Freya identifies text elements in sketches
- Suggests purposes automatically
- Generates content after confirmation
- Documents everything in page specifications

### In Phase 1: Product Brief (Pitch)

**When creating pitch deck content:**
- Problem statement → Run this workshop
- Solution description → Run this workshop
- Value propositions → Run this workshop

---

## What You Get

**For each content section:**

1. **Purpose Statement** (what this content must do)
   - Clear job definition
   - Success criteria
   - Model priority emphasis

2. **Strategic Context Document** (shows your thinking)
   - Trigger Map reference
   - Awareness journey map
   - Action requirement
   - Empowerment frame
   - Structural sequence

3. **Content Options** (2-3 variations)
   - Fully written content
   - Different angles/approaches
   - Rationale for each option
   - Model emphasis explained

4. **Selected Content** (final version)
   - Refined and approved
   - Ready for implementation
   - Traceable to strategic context
   - Reviewable against purpose

---

## Alpha Status Notice

⚠️ **This workshop is in Alpha** - first real-world usage pending.

**What this means:**
- Structure is theoretically sound but untested in practice
- Steps may need refinement based on actual usage
- Timing estimates may be inaccurate
- You may discover missing elements or unnecessary steps

**Please provide feedback:**
- What worked well?
- What felt clunky or unnecessary?
- What's missing?
- How could this be more efficient?

**Alpha will be removed when:**
- Successfully used in 3+ real projects
- Timing validated and adjusted
- Feedback integrated
- No major structural changes needed for 2 months

---

## Files

**Entry Point:**
- `content-creation-workshop.md` - Start here

**Micro-Steps:**
- `steps/workflow.md` - Sequential execution guide
- `steps/step-00-define-purpose.md`
- `steps/step-01-load-trigger-map-context.md`
- `steps/step-02-awareness-strategy.md`
- `steps/step-03-action-filter.md`
- `steps/step-04-empowerment-frame.md`
- `steps/step-05-structural-order.md`
- `steps/step-06-generate-content.md`

**Output Template:**
- `content-output.template.md` - Structured output format

---

## Related Resources

**Strategic Models:**
- [Customer Awareness Cycle](../../../docs/models/customer-awareness-cycle.md)
- [Golden Circle](../../../docs/models/golden-circle.md)
- [Action Mapping](../../../docs/models/action-mapping.md)
- [Kathy Sierra Badass Users](../../../docs/models/kathy-sierra-badass-users.md)

**Whiteport Methods:**
- [Trigger Mapping Guide](../../../docs/method/trigger-mapping-guide.md)
- [Content Purpose Guide](../../../docs/method/content-purpose-guide.md) - **Start here for content effectiveness**

**Workflows:**
- [Phase 4: UX Design](../../../docs/method/phase-4-ux-design-guide.md)
- [Phase 1: Product Exploration](../../../docs/method/phase-1-product-exploration-guide.md)

---

**Let's create strategically grounded content, not guesswork.** 🎯

