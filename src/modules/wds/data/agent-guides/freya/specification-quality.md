# Freya's Specification Quality Guide

**When to load:** Before creating any page spec, component definition, or scenario documentation

---

## Core Principle

**If I can't explain it logically, it's not ready to specify.**

Gaps in logic become bugs in code. Clear specifications = confident implementation.

---

## The Logical Explanation Test

Before you write any specification, ask:

**"Can I explain WHY this exists and HOW it works without hand-waving?"**

- ✅ "This button triggers the signup flow, serving users who want to feel prepared (driving force)"
- ❌ "There's a button here... because users need it?"

**If you can't explain it clearly, stop and think deeper.**

---

## Purpose-Based Naming

**Name components by FUNCTION, not CONTENT**

### Good (Function)
- `hero-headline` - Describes its role on the page
- `primary-cta` - Describes its function in the flow
- `feature-benefit-section` - Describes what it does
- `form-validation-error` - Describes when it appears

### Bad (Content)
- `welcome-message` - What if the message changes?
- `blue-button` - What if we change colors?
- `first-paragraph` - Position isn't purpose
- `email-error-text` - Too specific, not reusable

**Why this matters:**
- Content changes, function rarely does
- Makes specs maintainable
- Helps developers understand intent
- Enables component reuse

---

## Clear Component Purpose

**Every component needs a clear job description:**

### Template
```markdown
### [Component Name]

**Purpose:** [What job does this do?]
**Triggers:** [What user action/state causes this?]
**Serves:** [Which driving force or goal?]
**Success:** [How do we know it worked?]
```

### Example
```markdown
### Primary CTA Button

**Purpose:** Initiate account creation flow
**Triggers:** User clicks after reading value proposition
**Serves:** User's desire to "feel prepared" (positive driving force)
**Success:** User enters email and moves to step 2
```

---

## Section-First Workflow

**Understand the WHOLE before detailing the PARTS**

### Wrong Approach (Bottom-Up)
1. Design individual components
2. Try to arrange them into sections
3. Hope the page makes sense
4. Realize it doesn't flow logically
5. Start over

### Right Approach (Top-Down)
1. **Identify page sections** - What major areas exist?
2. **Define section purposes** - Why does each section exist?
3. **Confirm flow logic** - Does the story make sense?
4. **Detail each section** - Now design components
5. **Specify components** - With clear purpose and context

**Result:** Logical flow, no gaps, confident specifications

---

## Multi-Language from the Start

**Never design in one language only**

### Grouped Translations
```markdown
#### Hero Headline

**Content:**
- EN: "Stop losing clients to poor proposals"
- SE: "Sluta förlora kunder på dåliga offerter"
- NO: "Slutt å miste kunder på dårlige tilbud"

**Purpose:** Hook Problem Aware users by validating frustration
```

### Why This Matters
- Prevents "English-first" bias
- Reveals translation issues early
- Shows if message works across cultures
- Keeps translations coherent (grouped by component)

---

## Specification Quality Checklist

Before marking a spec "complete":

- [ ] **Logical Explanation** - Can I explain WHY and HOW?
- [ ] **Purpose-Based Names** - Named by function, not content?
- [ ] **Clear Purpose** - Every component has a job description?
- [ ] **Section-First** - Whole page flows logically?
- [ ] **Multi-Language** - All product languages included?
- [ ] **No Hand-Waving** - No "probably" or "maybe" or "users will figure it out"?
- [ ] **Developer-Ready** - Could someone build this confidently?

---

## Red Flags (Stop and Rethink)

🚩 **Vague language:** "Something here to help users understand..."  
🚩 **Content-based names:** "blue-box", "top-paragraph"  
🚩 **Missing purpose:** "There's a button... because buttons are good?"  
🚩 **Illogical flow:** "This section comes after that one... because?"  
🚩 **English-only:** "We'll translate later..."  
🚩 **Gaps in logic:** "Users will just know what to do here"

**When you spot these, pause and dig deeper.**

---

## The Developer Trust Test

**Imagine handing your spec to a developer who:**
- Has never seen your sketches
- Doesn't know the business context
- Speaks a different language
- Lives in a different timezone

**Could they build this confidently?**

- ✅ Yes → Good spec
- ❌ No → More work needed

---

## Related Resources

- **File Naming:** `../../workflows/00-system/FILE-NAMING-CONVENTIONS.md`
- **Language Config:** `../../workflows/00-system/language-configuration-guide.md`
- **Page Spec Template:** `../../workflows/4-ux-design/templates/page-specification.template.md`

---

*Quality specifications are the foundation of confident implementation.*

