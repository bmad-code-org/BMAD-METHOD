# Phase 4: UX Design (Conceptual Specifications)

**Agent:** Baldr the UX Expert  
**Output:** `C-Scenarios/` (or your configured prefix)  
**Duration:** 2-4 hours per scenario (varies by complexity)

---

## What This Phase Does

UX Design transforms ideas into detailed visual specifications. Working with Baldr, you conceptualize, sketch, and specify every interaction until your design can be logically explained without gaps.

**The key insight:** Designs that can be logically explained without gaps are easy to develop. The specification process reveals holes in your thinking before they become expensive development problems.

---

## What You'll Create

For each scenario/page:

- **Scenario Structure** - Numbered folder hierarchy
- **Page Specifications** - Complete documentation of each screen
- **Component Definitions** - Every element with Object IDs
- **Interaction Behaviors** - What happens when users interact
- **State Definitions** - All possible states for dynamic elements
- **Multilingual Content** - Text in all supported languages
- **HTML Previews** - Interactive prototypes for validation

---

## Three Ways to Work

### 4A: Scenario Exploration
**When:** No sketch exists, discovering the solution together

Baldr helps you:
- Think through the user's journey
- Explore content and feature options
- Consider psychological triggers from your Trigger Map
- Arrive at a clear solution ready for sketching

### 4B: Sketch Analysis
**When:** You have a sketch, need to specify it

Baldr helps you:
- Analyze what the sketch shows
- Ask clarifying questions
- Identify all components and states
- Create complete specifications

### 4C: Specification Creation
**When:** Design is clear, need development-ready specs

Baldr helps you:
- Document every detail systematically
- Assign Object IDs for testing
- Define all interactions and states
- Prepare multilingual content

### 4D: HTML Preview
**When:** Specifications complete, need visual validation

Baldr helps you:
- Create interactive HTML prototypes
- Test the design in browser
- Discover gaps and issues
- Refine specifications before development

---

## The Scenario Structure

Scenarios organize your design work into a clear hierarchy:

```
C-Scenarios/
├── 00-Scenario-Overview.md
├── 01-User-Onboarding/
│   ├── 1.1-Welcome-Page/
│   │   ├── 1.1-Welcome-Page.md
│   │   ├── Sketches/
│   │   └── Frontend/
│   └── 1.2-Sign-Up/
│       ├── 1.2-Sign-Up.md
│       └── ...
├── 02-Core-Feature/
│   └── ...
```

**Numbering Convention:**
- Scenarios: 01, 02, 03...
- Pages within scenarios: 1.1, 1.2, 2.1, 2.2...

---

## Object IDs

Every interactive element gets an Object ID for:
- Consistent naming across specs and code
- Test automation with stable selectors
- Analytics tracking
- Design-dev communication

**Format:** `{page}-{section}-{element}` in kebab-case

**Example:**
```
welcome-page-hero-cta-button
signin-form-email-input
signin-form-error-email
```

---

## The Pressure-Testing Process

Specification isn't just documentation - it's design validation.

When you try to specify every detail, you discover:
- "What happens when this is empty?"
- "How does this look on mobile?"
- "What if the user does X before Y?"
- "Where does this data come from?"

Finding these gaps now is cheap. Finding them during development is expensive.

---

## HTML Previews

Interactive prototypes that validate your design:

**What they include:**
- Semantic HTML matching your specs
- CSS using your Design System tokens
- JavaScript for interactions and validation
- Multilingual content switching

**What they reveal:**
- Visual gaps ("the spacing doesn't match")
- Interaction issues ("we forgot the loading state")
- Component needs ("we need a phone input component")
- Content problems ("the translation is too long")
- Flow issues ("this navigation doesn't make sense")

**File Structure:**
```
1.1-Welcome-Page/
├── 1.1-Welcome-Page.md (specification)
├── Sketches/
│   └── concept-sketch.jpg
└── Frontend/
    ├── 1.1-Welcome-Page-Preview.html
    ├── 1.1-Welcome-Page-Preview.css
    └── 1.1-Welcome-Page-Preview.js
```

---

## When to Use This Phase

**Use this phase when:**
- Ready to design specific screens/pages
- Have strategic clarity from Phase 1-2
- Want to validate designs before development

**Start with exploration (4A) if:**
- No existing sketches
- Unsure how to approach a feature
- Need to think through the user journey

**Start with analysis (4B) if:**
- Have sketches ready to specify
- Know what you want, need to document it

**Use HTML previews (4D) if:**
- Specifications feel complete
- Want to validate before development
- Need stakeholder sign-off

---

## What to Prepare

Bring:
- Trigger Map (Phase 2) - for user psychology reference
- Any existing sketches or wireframes
- Technical constraints from PRD (Phase 3)
- Content in all supported languages (or draft it together)

---

## What Comes Next

Your specifications enable:

- **Phase 5: Design System** - Components extracted and documented
- **Phase 6: Dev Integration** - Complete handoff package
- **Development** - Specs so clear they eliminate guesswork

---

## Tips for Great Sessions

**Think out loud with Baldr**
- Share your reasoning
- Explore alternatives together
- Let the conversation reveal insights

**Be thorough with states**
- Empty states
- Loading states
- Error states
- Success states
- Edge cases

**Don't skip the preview**
- Click through your design
- Find the gaps before development
- Refine specs based on what you learn

**Reference your Trigger Map**
- Does this serve the user's goals?
- Does this avoid their fears?
- Does this support business objectives?

---

## Example Output

See: `examples/dog-week-patterns/C-Scenarios/` for complete scenario specifications from a real project.

---

*Phase 4 of the Whiteport Design Studio method*

