# Phase 4: UX Design (UX-Sketches & Usage Scenarios)

**Agent:** Freyja the WDS Designer  
**Output:** `C-Scenarios/` (or your configured prefix)

---

## What This Phase Does

UX Design transforms ideas into detailed visual specifications. Working with Freyja, you conceptualize, sketch, and specify every interaction until your design can be logically explained without gaps.

**The key insight:** Designs that can be logically explained without gaps are easy to develop. The specification process reveals gaps in your thinking early - when they're easy to address.

---

## What You'll Create

For each scenario/page:

- **Scenario Structure** - Numbered folder hierarchy
- **Page Specifications** - Complete documentation of each screen
- **Component Definitions** - Every element with Object IDs
- **Interaction Behaviors** - What happens when users interact
- **State Definitions** - All possible states for dynamic elements
- **Multilingual Content** - Text in all supported languages
- **HTML Prototypes** - Interactive prototypes for validation

---

## How Freyja the WDS Designer helps you design software

### 4A: Scenario Exploration
**When:** Discovering the Concept, the process, flow screen or component solution together, before sketching begin

Freyja helps you:
- Think through the user's journey
- Explore content and feature options
- Consider psychological triggers from your Trigger Map
- Arrive at a clear solution ready for sketching

### 4B: UI Sketch Analysis
**When:** You have a sketch and you need feedback on it

Freyja helps you:
- Analyze what the sketch shows
- Ask clarifying questions
- Identify all components and states

### 4C: Conceptual Specification
**When:** Design is clear, need development-ready specs

Freyja helps you:
- Document every detail systematically
- Assign Object IDs for testing
- Define all interactions and states
- Prepare multilingual content, error codes, instructions and any other content needed for the developers

### 4D: HTML Prototype
**When:** Specifications complete, and we make the sketch come alive to test the concept

Freyja helps you:
- Create interactive prototypes
- Test the design in browser
- Discover gaps and issues
- Refine specifications 
- Visualize the concept before development

### 4E: PRD Update
**When:** Page design is complete, before moving to the next scenario

Freyja helps you:
- Identify what features this page requires
- Add functional requirements to the PRD
- Reference the page (e.g., "Required by: 2.1-Dog-Calendar")
- Note any API endpoints, validations, or data needs discovered

**Why this step matters:**

Each page reveals concrete requirements:
- "This form needs email validation"
- "We need a GET endpoint for availability"
- "Users need to upload images here"

Capturing these while the page is fresh ensures nothing is forgotten. The PRD becomes a complete feature inventory with traceability to the pages that need each feature.

**PRD grows like this:**

```markdown
## Functional Requirements

### Email Validation
**Required by:** 1.2-Sign-Up, 2.3-Profile-Edit
- Validate format on input
- Check domain exists
- Prevent duplicates

### Availability Calendar API
**Required by:** 2.1-Dog-Calendar, 3.1-Booking-Flow
- GET /api/walkers/{id}/availability
- Returns 2-week window
- Updates via WebSocket
```

---

## The Scenario Structure

Scenarios organize your design work into a clear hierarchy:

```
C-Scenarios/
├── 00-Scenario-Overview.md
├── 01-User-Onboarding/
│   ├── 1.1-Start-Page/
│   │   ├── 1.1-Start-Page.md
│   │   ├── Sketches/
│   │   └── Prototype/
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

### Design System Integration

**When Design System is enabled** (Phase 5), each object in your specification includes component library references:

**Example specification entry:**
```markdown
### Submit Button
**Object ID:** `signin-form-submit-button`
**Component:** primary-button (from Design System)
**Figma Component:** Primary Button
**Variant:** size=large, type=primary
**State:** default

Triggers form validation and submission...
```

**Benefits:**
- Designers know which Figma component to use
- Developers know which code component to implement
- Design System ensures consistency
- Object IDs connect spec → design → code

**Without Design System:**
Just describe the element directly in the specification without component references.

---

## The Pressure-Testing Process

Specification isn't just documentation - it's design validation.

When you try to specify every detail, you discover:
- "What happens when this is empty?"
- "How does this look on mobile?"
- "What if the user does X before Y?"
- "Where does this data come from?"

Finding these gaps now means addressing them while solutions are still flexible.

---

## HTML Prototypes

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
1.1-Start-Page/
├── 1.1-Start-Page.md (specification)
├── Sketches/
│   └── concept-sketch.jpg
└── Prototype/
    ├── 1.1-Start-Page-Prototype.html
    ├── 1.1-Start-Page-Prototype.css
    └── 1.1-Start-Page-Prototype.js
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

**Use HTML prototypes (4D) if:**
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

**Think out loud with Freyja**
- Share your reasoning
- Explore alternatives together
- Let the conversation reveal insights

**Be thorough with states**
- Empty states
- Loading states
- Error states
- Success states
- Edge cases

**Don't skip the prototype**
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

