# Conceptual Specifications

**The critical difference between prompt-and-run vs. thoughtful specification**

---

## The Trigger Map: The Ultimate Why-Machine

**Before any specification, the Trigger Map establishes WHY:**

### Example: Transparent Pricing Feature

**Trigger Map Reasoning:**

```
TARGET GROUP: Budget-conscious customers
FEAR: Surprises and hidden costs
TRIGGER: Anxiety about final price
OUTCOME: Easier commitment to purchase
SOLUTION: Transparent price model explanation
```

**This WHY flows into specifications:**

```markdown
## Transparent Pricing Component

**WHY This Exists:**
Our main target group is afraid of surprises and hidden costs.
By explaining our transparent price model, the customer has an
easier time committing to the purchase.

**WHY Upfront (Not at Checkout):**
Anxiety happens early. Showing pricing transparency upfront
reduces fear before it builds.

**WHY Detailed Breakdown (Not Just Total):**
"No hidden costs" needs proof. Itemized breakdown shows
there's nothing hidden.

**WHAT NOT TO DO:**

- ❌ Don't hide pricing until checkout (increases anxiety)
- ❌ Don't show just total (doesn't prove transparency)
- ❌ Don't use fine print (contradicts "transparent")
```

**The Trigger Map WHY becomes the specification WHY.**

---

## The Problem with v4 WPS2C (Whiteport Sketch-to-Code)

**What happened:**

```
Designer: "Create a calendar for booking dog walks"
AI: *Runs with it*
Result: Generic calendar, missing the point
```

**What was missing:**

- No questioning to elevate thinking
- No capture of WHY decisions were made
- No understanding of business context
- AI "helped" by making assumptions

**Result:** Fast, but wrong. Better, but not right.

---

## The AI Habit Problem

**AI's default behavior:**

```
"I'll make this faster!"
"I'll make this better!"
"I'll add helpful features!"
```

**What AI misses:**

- WHY does this need to exist?
- WHO is this actually for?
- WHAT problem does this solve?
- WHAT should we NOT do?

**AI optimizes for implementation, not intention.**

---

## The Solution: Conceptual Specifications

### Traditional Specification (WHAT)

```markdown
## Calendar Component

**Features:**

- Week view
- Booking slots
- Color-coded states
- Countdown timers

**Visual:**

- 7 columns (days)
- 6 color states
- Timer in orange state
```

**Problem:** AI will implement this literally, but might:

- Add daily/monthly views ("better!")
- Add notifications ("helpful!")
- Make it generic ("reusable!")
- Miss the cultural context

---

### Conceptual Specification (WHY + WHAT)

```markdown
## Calendar Component

**WHY This Exists:**
Families struggle to coordinate dog care. Kids forget, parents nag,
dogs suffer. This calendar reduces conflict by making responsibility
visible and accountability fun.

**WHY Week View (Not Daily/Monthly):**
Swedish families think in weeks ("Vecka 40"). This matches their
mental model. Daily view is too granular, monthly too abstract.
→ AI: Don't add daily/monthly views, even if you think it's "better"

**WHY 6 Color States:**
Visual, instant understanding for kids. No reading required.

- WHITE: Empty (neutral, inviting)
- GRAY: Booked (committed, not yet active)
- ORANGE: Countdown (urgent, act now)
- BLUE: Active (in progress, can't book another)
- GREEN: Completed (success, positive reinforcement)
- RED: Missed (accountability, not punishment)

→ AI: Don't simplify to 3 states, each serves a purpose

**WHY Countdown Timer (Not Notifications):**
Gentle urgency without nagging. Visible when user checks app.
Notifications would break the "fun, not punishing" tone.
→ AI: Don't add push notifications, even if you think it's "helpful"

**WHY Leaderboard Integration:**
Makes accountability a game, not a chore. Encourages participation.
→ AI: This is core to the experience, don't make it optional

**WHAT NOT TO DO:**

- ❌ Don't add daily/monthly views (wrong mental model)
- ❌ Don't add notifications (wrong tone)
- ❌ Don't make it generic (Swedish culture specific)
- ❌ Don't simplify states (each serves a purpose)
```

---

## What This Enables

### 1. AI Follows Instructions Correctly

**Without WHY:**

```
AI: "I added daily view for flexibility!"
Designer: "No, that breaks the mental model..."
```

**With WHY:**

```
Spec: "Week view matches Swedish 'Vecka 40' culture. Don't add daily view."
AI: *Implements week view only*
Designer: ✅ Perfect
```

---

### 2. AI Knows What to Skip

**Without WHY:**

```
AI: "I added push notifications for reminders!"
Designer: "No, that's nagging, not gentle urgency..."
```

**With WHY:**

```
Spec: "Countdown timer = gentle urgency. Notifications = nagging. Don't add notifications."
AI: *Skips notifications*
Designer: ✅ Exactly right
```

---

### 3. AI Preserves Intent During Changes

**Without WHY:**

```
Designer: "Make the countdown more prominent"
AI: *Makes it bigger, adds sound, adds vibration*
Designer: "No, that's too aggressive..."
```

**With WHY:**

```
Spec: "Countdown = gentle urgency, not aggressive nagging"
Designer: "Make countdown more prominent"
AI: *Makes it bigger, keeps gentle tone*
Designer: ✅ Got it
```

---

### 4. Future Developers Understand Context

**Without WHY:**

```
Developer: "Why can't users book multiple walks at once?"
*Removes blocking logic*
*Breaks the accountability system*
```

**With WHY:**

```
Spec: "One active walk per dog = accountability. Kids can't game the system
       by booking everything then completing nothing."
Developer: "Oh, that's a business rule. I'll keep it."
```

---

## The Socratic Questioning Connection

**Agent asks WHY questions:**

```
Agent: "Why week view instead of daily?"
Designer: "Swedish families think in weeks..."
Agent: "Got it! Documenting:
        WHY: Matches Swedish 'Vecka 40' mental model
        WHAT NOT TO DO: Don't add daily/monthly views"
```

**This creates specifications that:**

- Capture reasoning, not just decisions
- Guide AI implementation correctly
- Prevent "helpful" mistakes
- Preserve intent over time

---

## Structure of Conceptual Specs

### For Each Component/Feature:

**1. WHY This Exists**

- What problem does it solve?
- What behavior change does it create?
- What value does it deliver?

**2. WHY These Specific Choices**

- Why this approach vs alternatives?
- What user need does this serve?
- What business goal does this support?

**3. WHAT NOT TO DO**

- What "improvements" would break the intent?
- What features should NOT be added?
- What assumptions should AI NOT make?

**4. WHAT (Traditional Specs)**

- Visual design
- Interactions
- Technical requirements

---

## Example: Dog Week "Book Walk" Button

### Traditional Spec (WHAT Only)

```markdown
## Book Walk Button

**Visual:**

- Blue background (#3B82F6)
- White text
- 48px height
- Rounded corners (8px)

**Action:**

- Click → Open booking modal
```

**AI might "improve" by:**

- Adding "Quick Book" shortcut
- Adding "Book for Week" bulk action
- Making it more prominent
- Adding animation

---

### Conceptual Spec

```markdown
## Book Walk Button

**WHY This Exists:**
Kids need a simple way to commit to walking the dog.
"Booking" creates accountability - it's a promise, not just a plan.

**WHY "Book Walk" (Not "Add Walk"):**
"Book" = Future commitment (proactive)
"Add" = Past logging (retroactive)
We need both, they serve different purposes.

**WHY Simple Click (Not Quick Actions):**
Kids should think before booking. One deliberate action = one commitment.
Quick actions would encourage gaming the system (book everything, complete nothing).

**WHY This Visual Treatment:**

- Blue = Action color (consistent with design system)
- 48px = Touch-friendly for kids
- Not oversized = Important but not aggressive

**WHAT NOT TO DO:**

- ❌ Don't add "Quick Book" shortcuts (encourages gaming)
- ❌ Don't add "Book for Week" bulk action (defeats accountability)
- ❌ Don't make it more prominent (not the only action)
- ❌ Don't add animation (not a game, it's responsibility)

**WHAT (Implementation):**

- Background: Blue (#3B82F6)
- Text: White, 16px Medium
- Height: 48px
- Border radius: 8px
- Action: Click → Open booking modal
```

**Now AI knows:**

- What to implement
- What NOT to add
- WHY each decision was made
- How to handle future changes

---

## The Transformation

### v4 WPS2C (Prompt-and-Run)

```
Designer: "Create a booking calendar"
AI: *Generates generic calendar*
Designer: "No, that's not right..."
AI: *Tries again, still generic*
Designer: *Gives up or over-specifies every detail*
```

### v6 WDS (Conceptual Specifications)

```
Designer: "I need a booking calendar"
Agent: "Help me understand - why week view instead of daily?"
Designer: "Swedish families think in weeks..."
Agent: "Got it. Why 6 color states instead of simpler?"
Designer: "Each state serves a purpose for kids..."
Agent: "Perfect. Why countdown instead of notifications?"
Designer: "Gentle urgency, not nagging..."

Agent: "Documenting all the WHYs. This will help AI implement
        correctly and prevent 'helpful' mistakes."

*Generates conceptual specification*

AI: *Implements exactly right, skips "improvements" that would break intent*
Designer: ✅ Perfect first time
```

---

## The Meta-Benefit

**Conceptual specifications are:**

✅ **Better for AI implementation**

- AI knows what NOT to do
- AI preserves intent during changes
- AI doesn't "help" incorrectly

✅ **Better for human developers**

- Understand context, not just requirements
- Make correct decisions when specs are unclear
- Maintain intent over time

✅ **Better for future designers**

- Understand why decisions were made
- Don't repeat solved problems
- Build on reasoning, not just patterns

✅ **Better for the designer**

- Socratic questioning elevates thinking
- Articulating WHY clarifies decisions
- Creates reusable design knowledge

---

## The Bottom Line

**Traditional specs answer: "What should we build?"**

**Conceptual specs answer:**

- What should we build?
- Why should we build it this way?
- What should we NOT build?
- How should AI help (and not help)?

**Result:**

- AI implements correctly first time
- AI skips "improvements" that break intent
- Specifications become design knowledge
- Designer thinking is preserved and amplified

**This is the difference between:**

- Prompt-and-run (fast but wrong)
- Conceptual specification (thoughtful and right)

---

## The BMad Method Flow

**The complete WHY chain:**

```
1. TRIGGER MAP (Phase 1: Business Model)
   ↓
   Establishes: WHO, WHAT TRIGGERS THEM, WHAT OUTCOME

2. SCENARIOS (Phase 1: Business Model)
   ↓
   Defines: User journeys, contexts, goals

3. INFORMATION ARCHITECTURE (Phase 2)
   ↓
   Structures: Content hierarchy, navigation

4. INTERACTION DESIGN (Phase 3)
   ↓
   Sketches: User flows, state transitions

5. UX SPECIFICATIONS (Phase 4)
   ↓
   Documents: WHY + WHAT + WHAT NOT TO DO

6. AI IMPLEMENTATION
   ↓
   Builds: Correctly, preserving intent
```

**Each phase carries WHY forward:**

- **Trigger Map** → WHY the business exists
- **Scenarios** → WHY users need this
- **IA** → WHY this structure
- **Interaction** → WHY this flow
- **UX Specs** → WHY these specific choices
- **AI** → Implements with full context

**Without Trigger Map, specifications lose their foundation.**

**With Trigger Map, every decision traces back to user needs and business goals.**

---

## The Bottom Line

**Traditional specs answer: "What should we build?"**

**Conceptual specs answer:**

- What should we build?
- Why should we build it this way?
- What should we NOT build?
- How should AI help (and not help)?

**Trigger Map provides the ultimate WHY:**

- WHO is this for?
- WHAT triggers their need?
- WHAT outcome do they want?
- WHY will this solution work?

**Result:**

- AI implements correctly first time
- AI skips "improvements" that break intent
- Specifications become design knowledge
- Designer thinking is preserved and amplified

**This is the difference between:**

- Prompt-and-run (fast but wrong)
- Conceptual specification (thoughtful and right)

---

**Trigger Map establishes WHY.**

**Socratic questioning reveals WHY.**

**Conceptual specifications capture WHY.**

**AI implementation preserves WHY.**

**Designer thinking flows through the entire process.**

---

[← Back to Workflows](README.md)
