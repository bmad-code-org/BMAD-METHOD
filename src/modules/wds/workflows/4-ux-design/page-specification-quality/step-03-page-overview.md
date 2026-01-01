# Step 3: Page Overview

**Purpose:** Provide essential context about the page's purpose, user situation, and success criteria.

---

## What Page Overview Provides

**For Designers:**
- Understand the "why" behind the page
- User emotional state and needs
- Success criteria to measure effectiveness

**For Developers:**
- Implementation priorities
- Business logic context
- Testing criteria

**For Stakeholders:**
- Business value
- User impact
- Measurable outcomes

---

## Standard Format

### Required Elements

```markdown
# [Page Number] [Page Name]

[1-2 paragraph description of page purpose, addressing user pain points and desired outcomes]

**User Situation**: [Description of user's context, emotional state, and needs when arriving at this page]

**Page Purpose**: [Clear statement of what this page accomplishes for the user and business]
```

---

## Format Example (Fictional Project)

```markdown
# 1.1 Home Page

The home page serves as the primary entry point for users discovering TaskFlow for the first time. This page addresses the universal pain point of project management overwhelm while promising the emotional transformation from chaos to control. The page must convert curious visitors into engaged users by demonstrating immediate value and removing adoption barriers.

**User Situation**: Small business owners and freelancers experiencing daily stress and confusion about task prioritization, seeking a solution that helps them focus on what matters most without complex setup.

**Page Purpose**: Convert visitors into users by addressing the core emotional drivers - eliminating task chaos while building confidence that they can manage their workload effectively without requiring a project management degree.
```

---

## Creation Instructions

<if condition="Creating new specification">

### Extract Context

1. **Review trigger map and personas**
   - Identify primary persona for this page
   - Note their fears, wants, and pain points
   - Understand their emotional state at this point in journey

2. **Define page goal**
   - What action should user take?
   - What problem does this page solve?
   - How does this connect to business goals?

3. **Capture user situation**
   - Where is user coming from? (previous page, external link, search)
   - What is their emotional state? (curious, frustrated, confident, overwhelmed)
   - What do they need right now?

### Generate Overview

<output>
Generate complete page overview following the standard format.

**Template Variables:**
- `{page_number}`: Page number (e.g., "1.1")
- `{page_name}`: Page name
- `{page_description}`: 1-2 paragraphs explaining page purpose and transformation
- `{user_situation}`: User's context and emotional state
- `{page_purpose}`: Clear success criteria

**Output Format:**
```markdown
# {page_number} {page_name}

{page_description}

**User Situation**: {user_situation}

**Page Purpose**: {page_purpose}
```
</output>

</if>

---

## Quality Check Instructions

<if condition="Analyzing existing specification">

### Overview Checklist

Run through each item. Report any failures.

**Required Elements:**

- [ ] **Page description** (1-2 paragraphs) present
- [ ] Description mentions **user pain points**
- [ ] Description mentions **desired outcome/transformation**
- [ ] **User Situation** section present and starts with "User Situation:"
- [ ] **Page Purpose** section present and starts with "Page Purpose:"

**Content Quality:**

- [ ] Description is **specific to this page** (not generic)
- [ ] User Situation includes **emotional state** or context
- [ ] Page Purpose clearly states **what success looks like**
- [ ] Language is **user-centric** (not feature-centric)
- [ ] Connects to **trigger map** or **persona needs**

**Format Consistency:**

- [ ] Page number matches navigation section
- [ ] H1 header uses correct format (`# X.X Page Name`)
- [ ] User Situation uses bold label format
- [ ] Page Purpose uses bold label format

### Report Format

<output>
**Page Overview Quality Report**

**Status:** ✅ PASS / ❌ FAIL

**Missing Elements:**
- [List any missing required sections]

**Content Issues:**
- [List vague or generic descriptions]
- [Note missing emotional context]
- [Identify unclear success criteria]

**Recommendations:**
- [Suggest specific improvements]
</output>

</if>

---

## Common Errors to Avoid

**❌ Don't:**
- Write generic descriptions that could apply to any page
- Focus only on features ("This page has a form and buttons")
- Skip emotional context ("User wants to sign up")
- Forget to connect to business goals
- Use technical jargon instead of user language

**✅ Do:**
- Reference specific personas by name
- Include emotional drivers (stress, confidence, fear, hope)
- Connect to trigger map pain points
- State clear, measurable outcomes
- Use empathetic, user-centric language

---

## Example Fixes

### ❌ Incorrect: Generic and feature-focused

```markdown
# 1.1 Home Page

This is the home page. It has a hero section, some text, and a button.

**User Situation**: User arrives at the page.

**Page Purpose**: Show information about the product.
```

**Issues:**
- No user pain points mentioned
- No emotional context
- Vague purpose
- Could describe any landing page

### ✅ Correct: Specific and user-centric

```markdown
# 1.1 Home Page

The home page serves as the primary entry point for users discovering TaskFlow for the first time. This page addresses the universal pain point of project management overwhelm while promising the emotional transformation from chaos to control. The page must convert curious visitors into engaged users by demonstrating immediate value and removing adoption barriers.

**User Situation**: Small business owners and freelancers experiencing daily stress and confusion about task prioritization, seeking a solution that helps them focus on what matters most without complex setup.

**Page Purpose**: Convert visitors into users by addressing the core emotional drivers - eliminating task chaos while building confidence that they can manage their workload effectively without requiring a project management degree.
```

**Strengths:**
- Specific target users (small business owners, freelancers)
- Clear pain point (project management overwhelm)
- Emotional transformation (chaos → control)
- Measurable outcome (convert visitors to users)
- User-centric language

---

## Next Step

<action>Load and execute: step-04-page-sections.md</action>

