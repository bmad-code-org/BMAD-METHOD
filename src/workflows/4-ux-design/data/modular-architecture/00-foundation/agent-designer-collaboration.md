# Agent-Designer Collaboration in UX Design

**How AI agents optimize designer craft without replacing designer thinking**

---

## The Partnership Model

**Designer:** Strategic thinking, multi-dimensional decisions, creative problem-solving  
**Agent:** Systematic execution, pattern recognition, documentation assistance

**Not replacement. Amplification.**

---

## What Agents CANNOT Do

❌ **Understand business context**

- Why does this business exist?
- What are the real goals?
- What defines success?

❌ **Know user needs deeply**

- Who are the actual users?
- What are their mental models?
- What contexts do they operate in?

❌ **Make strategic decisions**

- Should we build this feature?
- Does this serve the user or just the business?
- What's the coherent storyline?

❌ **Balance competing priorities**

- Business goals vs user needs
- Simplicity vs functionality
- Technical viability vs ideal experience

**These require human judgment, empathy, and multi-dimensional thinking.**

---

## What Agents DO Brilliantly

✅ **Systematic decomposition**

```
Designer: "This calendar is complex"
Agent: "I detect 6 states, time-based transitions, business rules.
        Let me guide you through decomposition:
        - Page context
        - Visual design
        - Functional logic"
```

✅ **Pattern recognition**

```
Designer: "I'm adding body text here"
Agent: "I notice on Start Page, body text was 16px with 1.5 line-height.
        Should I use the same for consistency?"
```

✅ **Documentation assistance**

```
Designer: "The walk slot has different colors"
Agent: "Let me capture that systematically:
        - WHITE: Empty slot
        - GRAY: Booked
        - ORANGE: Countdown active
        - BLUE: Walk in progress
        - GREEN: Completed
        - RED: Missed"
```

✅ **Workflow guidance**

```
Designer: "Where should I document this content?"
Agent: "Does the content vary by page context?
        YES → Page file
        NO → Feature file"
```

✅ **Cross-reference tracking**

```
Designer: "I updated the button color"
Agent: "This button appears on 5 pages. Should I update all references?"
```

---

## The Collaboration Flow

### Phase 1: Designer Thinks

**Designer decides:**

- Business goals for this page
- User needs to serve
- Product strategy to implement
- Experience coherence to maintain
- Technical approach to take

**Agent observes, learns context.**

---

### Phase 2: Agent Guides Decomposition

**Agent asks systematic questions:**

```
"I see this sketch. Let me identify sections:
1. Navigation Header
2. Hero Section
3. Calendar Component
4. Leaderboard
5. Footer

Does this match your vision?"
```

**Designer confirms, corrects, adds context:**

```
"Yes, but the Calendar is the core feature.
It needs detailed specification."
```

**Agent adapts:**

```
"Got it. Calendar is core. I'll guide you through detailed decomposition.
The other sections we can keep schematic unless you need detail."
```

---

### Phase 3: Designer Provides Creative Input

**Designer sketches, explains, decides:**

```
"The walk slots have 6 states. I have a storyboard showing the flow.
The colors represent different stages of the walk lifecycle.
This needs to feel playful, not punishing."
```

**Agent captures systematically:**

```
"Capturing:
- 6 visual states (storyboard reference)
- Color-coded lifecycle
- Tone: Playful, not punishing

Should I create:
- Component file (visual design)
- Feature file (state machine logic)
- Storyboard reference?"
```

---

### Phase 4: Agent Ensures Consistency

**Agent checks patterns:**

```
"I notice you're using orange for 'countdown active' state.
On the Week Overview, orange circles also mean 'active day'.
This is consistent. Should I document this as a design system pattern?"
```

**Designer confirms or corrects:**

```
"Yes! Orange = active/urgent across the app.
Add that to the design system."
```

---

### Phase 5: Designer Makes Final Decisions

**Agent presents options:**

```
"For the User Profile dropdown, I can:
A) Keep simple specification in Page file
B) Create detailed Component + Feature files
C) Mark as TODO for later

This component has 3 states and logout logic.
What level of detail do you need?"
```

**Designer decides based on priorities:**

```
"Option B. User profile is important for trust.
Let's specify it properly."
```

---

## Crucial Agent Behaviors

### 1. Ask, Don't Assume

**Wrong:**

```
Agent: "I'll create a daily calendar view."
```

**Right:**

```
Agent: "I see a calendar. Should this be:
        - Daily view
        - Weekly view
        - Monthly view

        What matches your users' mental model?"
```

---

### 2. Provide Context, Not Just Questions

**Wrong:**

```
Agent: "What color should this be?"
```

**Right:**

```
Agent: "I notice the walk slot needs a color for 'countdown active' state.
        You've used:
        - Blue for 'in progress'
        - Green for 'completed'
        - Red for 'missed'

        What color represents 'urgent but not started'?"
```

---

### 3. Explain WHY Questions Matter

**Wrong:**

```
Agent: "Does content vary by page?"
```

**Right:**

```
Agent: "Does the hero heading change per page?

        This matters because:
        - If YES → Document in Page file (page-specific)
        - If NO → Document in Feature file (reusable)

        This keeps your specs maintainable."
```

---

### 4. Learn Designer Preferences

**After a few interactions:**

```
Agent: "I notice you prefer detailed specifications for user-facing components
        but schematic specs for admin sections.

        Should I apply this pattern to the Settings page?"
```

---

### 5. Catch Inconsistencies Gently

**Wrong:**

```
Agent: "ERROR: This contradicts the Start Page!"
```

**Right:**

```
Agent: "I notice on Start Page, buttons are 48px height.
        Here you specified 44px.

        Is this intentional (different context) or should I match for consistency?"
```

---

### 6. Ask "Why" Questions That Reveal Insights

**Agent notices patterns and asks for reasoning:**

```
Agent: "Help me understand: The header has two buttons -
        'Book Walk' and 'Add Walk'.

        They seem to do similar things. What's the difference?"
```

**Designer's answer reveals business logic:**

```
Designer: "Oh! Good catch.
           'Book Walk' = Reserve a future slot
           'Add Walk' = Log a walk that already happened

           We need both because kids forget to book but parents
           want to track completed walks for the leaderboard."
```

**Agent captures the insight:**

```
Agent: "Got it! Two distinct use cases:
        - Book Walk → Future planning (proactive)
        - Add Walk → Retroactive logging (accountability)

        Should I document this distinction in the Feature file
        so developers understand the different workflows?"
```

---

**When designer says "I don't know":**

```
Agent: "Why does the calendar show week numbers instead of dates?"

Designer: "Hmm, I'm not sure. It just felt right."

Agent: "Let me help you think through this. Pros and cons:

        Week Numbers:
        ✅ Matches Swedish 'Vecka 40' culture
        ✅ Simpler visual (less clutter)
        ✅ Focuses on rhythm, not specific dates
        ❌ Users might need to check what week it is
        ❌ Less familiar to non-Swedish users

        Specific Dates:
        ✅ Immediately clear what day it is
        ✅ Universal understanding
        ❌ More visual clutter
        ❌ Doesn't match Swedish planning culture

        Given your target users are Swedish families,
        which approach serves them better?"
```

**Designer thinks through it:**

```
Designer: "You're right - Swedish families think in weeks.
           'Vecka 40' is how they plan. Let's keep week numbers
           but add a small date range for clarity: 'Vecka 40 (2-8 Oct)'"
```

**Agent captures the decision:**

```
Agent: "Perfect! Documenting:
        - Primary: Week number (Swedish mental model)
        - Secondary: Date range (clarity)
        - Rationale: Matches target user planning culture

        This also goes in your design system as a pattern."
```

---

## What This Enables

### Designer Benefits

✅ **Focus on thinking, not documentation**

- Agent handles systematic capture
- Designer focuses on creative decisions

✅ **Maintain consistency effortlessly**

- Agent tracks patterns across pages
- Designer confirms or corrects

✅ **Iterate faster**

- Agent guides structured decomposition
- Designer doesn't get overwhelmed

✅ **Nothing gets missed**

- Agent asks systematic questions
- Designer provides context

✅ **Design system integrity**

- Agent catches inconsistencies
- Designer maintains coherence

---

### Project Benefits

✅ **Complete specifications**

- Nothing forgotten or assumed
- Clear handoffs to developers

✅ **Maintainable documentation**

- Structured, not monolithic
- Easy to update

✅ **Faster development**

- Developers have clear instructions
- AI code generators have precise prompts

✅ **Better products**

- Designer thinking + Agent systematization
- Strategic decisions + consistent execution

---

## The Bottom Line

**Agents don't replace designers.**

**Agents optimize designer craft by:**

- Handling systematic work
- Ensuring consistency
- Guiding structured workflows
- Catching oversights
- Documenting decisions

**This frees designers to:**

- Think strategically
- Make creative decisions
- Solve complex problems
- Maintain coherent experiences
- Balance competing priorities

**The result:**

- 10x faster specification
- 10x better consistency
- 10x more complete documentation
- 100% designer-driven decisions

**Designer thinking. Agent execution. Product success.**

---

## Related Concepts

### Conceptual Specifications

How capturing WHY (not just WHAT) makes AI implementation correct

---

[← Back to Guide](00-MODULAR-ARCHITECTURE-GUIDE.md)
