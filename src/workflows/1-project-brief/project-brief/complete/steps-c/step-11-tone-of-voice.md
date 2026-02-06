# Step 11: Define Tone of Voice

## Purpose

Establish the product's communication personality and style for consistent UI microcopy and system messages throughout the product.

## Context for Agent

Now that you understand the product, users, positioning, and competitive landscape, you can suggest an appropriate Tone of Voice that aligns with the brand and resonates with target users.

**Important:** Tone of Voice is for **UI microcopy** (buttons, labels, errors, system messages), NOT strategic content (headlines, feature descriptions, value propositions).

## Key Elements

### What is Tone of Voice?

Tone of Voice defines:
- **Brand personality:** Who are we as a company?
- **Communication style:** How do we speak to users?
- **Emotional tone:** What feeling do we create?
- **Voice attributes:** Friendly, professional, quirky, authoritative, empathetic, technical, casual, formal, playful, serious, etc.

### Tone of Voice vs Strategic Content

**Tone of Voice applies to:**
- ✅ Form field labels ("Email" vs "Email address" vs "Your email")
- ✅ Button text ("Submit" vs "Continue" vs "Let's go")
- ✅ Error messages ("Invalid email" vs "Hmm, that doesn't look like an email")
- ✅ System messages ("Loading..." vs "Hang tight..." vs "Processing your request")
- ✅ Empty states ("No items" vs "Nothing here yet" vs "Your list is empty")
- ✅ Tooltips and instructions

**Strategic Content uses:**
- ❌ Content Creation Workshop (purpose-driven, context-specific)
- ❌ Headlines, hero sections, feature descriptions
- ❌ Value propositions, testimonials, case studies

## Instructions

### 1. Analyze Product Context

Review what you've learned:
- Vision & positioning
- Target users and their characteristics
- Business model and customers
- Competitive landscape
- Product category and context

### 2. Suggest Tone of Voice Attributes

Based on the product context, suggest 3-5 tone attributes:

**Present in this format:**

```
Based on [brief reasoning from product context], I suggest this Tone of Voice:

Tone Attributes:
1. [Attribute 1]: [Brief explanation why]
2. [Attribute 2]: [Brief explanation why]
3. [Attribute 3]: [Brief explanation why]
4. [Attribute 4]: [Brief explanation why]

Does this feel aligned with your brand vision?
```

**Example attributes:**
- Friendly & approachable (for consumer products)
- Professional & authoritative (for B2B/enterprise)
- Empathetic & supportive (for healthcare, education)
- Playful & quirky (for creative/youth products)
- Technical & precise (for developer tools)
- Casual & conversational (for social apps)
- Warm & personal (for services)

### 3. Provide Examples

Show the tone in action with side-by-side comparisons. **See:** [substeps/11-output-template.md](substeps/11-output-template.md) for the example format.

### 4. Refine Based on Feedback

**Ask:**
- "Does this tone feel right for your brand?"
- "Should we adjust any attributes? (more/less formal, friendly, technical, etc.)"
- "Are the examples aligned with how you want to communicate?"

**Iterate until confirmed.**

### 5. Document Final Tone of Voice

Once confirmed, document:
- Tone attributes (3-5 clear characteristics)
- Example microcopy showing tone in action
- Do's and Don'ts (brief guidelines)

## Questions to Ask

### If User Needs Guidance:

**"Let me ask a few questions to help define the tone:"**

1. **Relationship:** "How do you want users to feel about your brand? Like a trusted advisor? A helpful friend? An expert authority? A fun companion?"

2. **Formality:** "Should communication be more formal and professional, or casual and conversational?"

3. **Personality:** "If your product were a person, how would they speak? (serious, playful, quirky, straightforward, warm, technical)"

4. **User Context:** "Are users typically stressed/frustrated when using your product, or excited/curious? How should tone respond to their state?"

5. **Differentiation:** "How do competitors communicate? Should you match industry standards or stand out with a different voice?"

## Validation

Before proceeding:

- [ ] Tone attributes are clearly defined (3-5 specific characteristics)
- [ ] Attributes align with target users and positioning
- [ ] Examples demonstrate the tone clearly
- [ ] User confirms this feels right for their brand
- [ ] Tone is documented for reference

## Output Format

**See:** [substeps/11-output-template.md](substeps/11-output-template.md) for the complete Product Brief template.

## Next Step

**→ Proceed to [Step 12: Synthesize and Create Brief](step-12-synthesize.md)**

## State Update

Update frontmatter of output file:

```yaml
stepsCompleted:
  [
    'step-01-init.md',
    'step-02-vision.md',
    'step-03-positioning.md',
    'step-04-create-vtc.md',
    'step-05-business-model.md',
    'step-06-business-customers.md',
    'step-07-target-users.md',
    'step-08-success-criteria.md',
    'step-09-competitive-landscape.md',
    'step-10-constraints.md',
    'step-11-tone-of-voice.md',
  ]
```

---

## Example

**See:** [substeps/11-tone-of-voice-example.md](substeps/11-tone-of-voice-example.md)

This shows a complete Tone of Voice definition for a B2B SaaS onboarding tool, demonstrating how to define attributes based on user context (stressed HR managers) and provide clear before/after examples.

---

**⚠️ ALPHA:** This is a new addition to the Product Brief workflow. Feedback welcome on placement, questions, and output format.

